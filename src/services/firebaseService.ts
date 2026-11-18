import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { Badge, LeaderboardUser, PlayerProfile, PlayerTier } from '../types';

export interface CloudBookingRecord {
  id: string;
  ownerId: string;
  courtId: string;
  courtName: string;
  courtNumber: number;
  date: string;
  slotsSummary: string;
  totalAmount: number;
  paymentMethod: 'PromptPay' | 'SmashPay' | 'TrueMoney';
  bookingRef: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAtMs: number;
}

export interface CloudMatchRecord {
  id: string;
  ownerId: string;
  playerAName: string;
  playerBName: string;
  isDoubles: boolean;
  finalScore: string;
  setSummary: string;
  result: 'win' | 'loss';
  courtName: string;
  highestSmashKmh: number;
  durationMin: number;
  expGained: number;
  highlightShot: string;
  isPublic: boolean;
  createdAtMs: number;
}

export interface CloudFeedPost {
  id: string;
  authorId: string;
  authorName: string;
  type: 'match' | 'achievement' | 'milestone';
  guildName: string;
  headline: string;
  summary: string;
  scoreDisplay?: string;
  cheersCount: number;
  visibility: 'community';
  createdAtMs: number;
}

export interface CloudWalletTx {
  id: string;
  ownerId: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  status: 'completed' | 'pending';
  createdAtMs: number;
}

export interface CloudGuildAttendee {
  userId: string;
  name: string;
  tier: string;
  ovr: number;
  paid: boolean;
  joinedAtMs: number;
}

const VALID_ID_RE = /^[a-zA-Z0-9_-]+$/;

function sanitizeId(raw: string, fallbackPrefix = 'item'): string {
  const cleaned = (raw || '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
  if (!cleaned || !VALID_ID_RE.test(cleaned)) {
    return `${fallbackPrefix}_${Date.now()}`;
  }
  return cleaned;
}

function clampStr(val: string | undefined | null, maxLen: number, fallback = ''): string {
  const s = String(val ?? fallback).trim();
  return (s || fallback).slice(0, maxLen);
}

function clampInt(val: number | undefined | null, min: number, max: number, fallback: number): number {
  const n = Math.round(Number(val));
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function toMs(val: unknown): number {
  if (val instanceof Timestamp) return val.toMillis();
  if (typeof val === 'number') return val;
  return Date.now();
}

export function computeOvr(radar: PlayerProfile['skillRadar']): number {
  const sum =
    (radar?.power || 80) +
    (radar?.speed || 80) +
    (radar?.control || 80) +
    (radar?.stamina || 80) +
    (radar?.tactics || 80);
  return clampInt(sum / 5, 1, 99, 85);
}

export async function signInWithGoogleAccount(): Promise<User> {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export async function signOutAccountSession(): Promise<void> {
  await signOut(auth);
}

export function subscribeAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

const PLAYSTYLE_LOCALIZATION: Record<string, { th: string; en: string }> = {
  'Attacking Smash Hunter': {
    th: 'สายบุกตบสแมชดุดัน',
    en: 'Attacking Smash Hunter',
  },
  'Net Control Wizard': {
    th: 'สายหยอดคุมเชิงหน้าเน็ต',
    en: 'Net Control Wizard',
  },
  'Defensive Wall': {
    th: 'สายรับกำแพงเหล็กโต้กลับ',
    en: 'Defensive Wall',
  },
  'All-Rounder': {
    th: 'สายสมดุลรอบด้าน',
    en: 'All-Rounder',
  },
};

export function resolveLocalizedPlaystyle(playstyle?: string | null): {
  playstyle: PlayerProfile['playstyle'];
  playstyleTh: string;
  playstyleEn: string;
} {
  const key = (playstyle || 'Attacking Smash Hunter') as PlayerProfile['playstyle'];
  const mapped = PLAYSTYLE_LOCALIZATION[key] || PLAYSTYLE_LOCALIZATION['Attacking Smash Hunter'];
  return {
    playstyle: (key in PLAYSTYLE_LOCALIZATION ? key : 'Attacking Smash Hunter') as PlayerProfile['playstyle'],
    playstyleTh: mapped.th,
    playstyleEn: mapped.en,
  };
}

function mapFirestoreUserProfile(
  uid: string,
  data: Record<string, any>,
  fallbackProfile: PlayerProfile
): { profile: Partial<PlayerProfile>; walletBalance: number } {
  const displayName = clampStr(data.displayName, 80, fallbackProfile.name);
  const localizedStyle = resolveLocalizedPlaystyle(data.playstyle || fallbackProfile.playstyle);
  const loadedProfile: Partial<PlayerProfile> = {
    id: uid,
    name: displayName,
    nameTh: displayName,
    nameEn: displayName,
    avatarUrl: clampStr(data.photoUrl, 500, fallbackProfile.avatarUrl),
    tier: (data.tier as PlayerTier) || fallbackProfile.tier,
    level: clampInt(data.level, 1, 200, fallbackProfile.level),
    currentExp: clampInt(data.currentExp, 0, 10000000, fallbackProfile.currentExp),
    nextLevelExp: clampInt(data.nextLevelExp, 1, 10000000, fallbackProfile.nextLevelExp),
    dominantHand: data.dominantHand === 'Left' ? 'Left' : 'Right',
    playstyle: localizedStyle.playstyle,
    playstyleTh: localizedStyle.playstyleTh,
    playstyleEn: localizedStyle.playstyleEn,
    primaryGoal: (data.primaryGoal as PlayerProfile['primaryGoal']) || fallbackProfile.primaryGoal,
    streakWeeks: clampInt(data.streakWeeks, 0, 1000, fallbackProfile.streakWeeks),
    skillRadar: data.skillRadar || fallbackProfile.skillRadar,
    racket: data.racket || fallbackProfile.racket,
    stats: data.stats || fallbackProfile.stats,
  };
  return {
    profile: loadedProfile,
    walletBalance: typeof data.walletBalance === 'number' ? data.walletBalance : 1250,
  };
}

export async function ensureAndLoadUserProfile(
  user: User,
  fallbackProfile: PlayerProfile
): Promise<{ profile: Partial<PlayerProfile>; walletBalance: number }> {
  const uid = sanitizeId(user.uid, 'user');
  const userPath = `users/${uid}`;
  const lbPath = `leaderboard/${uid}`;

  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return mapFirestoreUserProfile(uid, snap.data(), fallbackProfile);
    }

    const displayName = clampStr(user.displayName || user.email?.split('@')[0], 80, fallbackProfile.name);
    const email = clampStr(user.email, 160, '');
    const photoUrl = clampStr(user.photoURL, 500, fallbackProfile.avatarUrl);
    const initialWallet = 1250;
    const localizedStyle = resolveLocalizedPlaystyle(fallbackProfile.playstyle);

    const profileDoc: Record<string, unknown> = {
      uid,
      displayName,
      photoUrl,
      tier: fallbackProfile.tier,
      level: clampInt(fallbackProfile.level, 1, 200, 12),
      currentExp: clampInt(fallbackProfile.currentExp, 0, 10000000, 4250),
      nextLevelExp: clampInt(fallbackProfile.nextLevelExp, 1, 10000000, 5000),
      dominantHand: fallbackProfile.dominantHand,
      playstyle: clampStr(localizedStyle.playstyle, 80),
      primaryGoal: clampStr(fallbackProfile.primaryGoal, 60),
      streakWeeks: clampInt(fallbackProfile.streakWeeks, 0, 1000, 3),
      walletBalance: initialWallet,
      skillRadar: fallbackProfile.skillRadar,
      racket: fallbackProfile.racket,
      stats: fallbackProfile.stats,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (email) {
      profileDoc.email = email;
    }

    await setDoc(userRef, profileDoc);

    const lbRef = doc(db, 'leaderboard', uid);
    await setDoc(lbRef, {
      uid,
      displayName,
      tier: fallbackProfile.tier,
      level: clampInt(fallbackProfile.level, 1, 200, 12),
      ovr: computeOvr(fallbackProfile.skillRadar),
      points: clampInt(fallbackProfile.currentExp, 0, 10000000, 4250),
      winRate: fallbackProfile.stats.winRate,
      avatarPreset: 'karn',
      visibility: 'community',
      updatedAt: serverTimestamp(),
    });

    return {
      profile: {
        id: uid,
        name: displayName,
        nameTh: displayName,
        nameEn: displayName,
        playstyle: localizedStyle.playstyle,
        playstyleTh: localizedStyle.playstyleTh,
        playstyleEn: localizedStyle.playstyleEn,
        avatarUrl: photoUrl || fallbackProfile.avatarUrl,
      },
      walletBalance: initialWallet,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${userPath} | ${lbPath}`);
  }
}

export function subscribeUserProfile(
  uid: string,
  fallbackProfile: PlayerProfile,
  onData: (payload: { profile: Partial<PlayerProfile>; walletBalance: number }) => void
): () => void {
  const safeUid = sanitizeId(uid, 'user');
  const userPath = `users/${safeUid}`;
  return onSnapshot(
    doc(db, 'users', safeUid),
    (snapshot) => {
      if (!snapshot.exists()) return;
      onData(mapFirestoreUserProfile(safeUid, snapshot.data(), fallbackProfile));
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, userPath);
    }
  );
}

const VALID_BADGE_CATEGORIES = new Set<Badge['category']>(['combat', 'endurance', 'social', 'special']);
const VALID_BADGE_RARITIES = new Set<Badge['rarity']>(['Common', 'Rare', 'Epic', 'Legendary']);
const RARITY_SORT_WEIGHT: Record<Badge['rarity'], number> = {
  Legendary: 4,
  Epic: 3,
  Rare: 2,
  Common: 1,
};

function buildUserBadgePayload(
  uid: string,
  badge: Badge,
  forUpdate = false
): Record<string, unknown> {
  const safeUid = sanitizeId(uid, 'user');
  const safeBadgeId = sanitizeId(badge.id, 'badge').slice(0, 64);
  const safeCategory: Badge['category'] = VALID_BADGE_CATEGORIES.has(badge.category)
    ? badge.category
    : 'special';
  const safeRarity: Badge['rarity'] = VALID_BADGE_RARITIES.has(badge.rarity)
    ? badge.rarity
    : 'Common';
  const safeMaxProgress = clampInt(badge.maxProgress, 1, 1000000, 1);
  const safeProgress = clampInt(badge.progress, 0, safeMaxProgress, 0);
  const unlocked = Boolean(badge.unlocked || safeProgress >= safeMaxProgress);

  const payload: Record<string, unknown> = {
    name: clampStr(badge.name, 80, 'Badge'),
    thaiName: clampStr(badge.thaiName, 80, 'เหรียญรางวัล'),
    description: clampStr(badge.description, 240, 'Badminton achievement milestone'),
    iconName: clampStr(badge.iconName, 40, 'Trophy'),
    category: safeCategory,
    rarity: safeRarity,
    unlocked,
    progress: unlocked ? safeMaxProgress : safeProgress,
    maxProgress: safeMaxProgress,
    updatedAt: serverTimestamp(),
  };

  if (!forUpdate) {
    payload.ownerId = safeUid;
    payload.badgeId = safeBadgeId;
  }

  const unlockedAtText = clampStr(badge.unlockedAt, 60, '');
  if (unlocked && unlockedAtText) {
    payload.unlockedAt = unlockedAtText;
  }

  return payload;
}

function mapFirestoreBadgeDoc(id: string, data: Record<string, any>): Badge {
  const maxProgress = clampInt(data.maxProgress, 1, 1000000, 1);
  const progress = clampInt(data.progress, 0, maxProgress, 0);
  const unlocked = Boolean(data.unlocked);
  const category = VALID_BADGE_CATEGORIES.has(data.category) ? data.category : 'special';
  const rarity = VALID_BADGE_RARITIES.has(data.rarity) ? data.rarity : 'Common';
  return {
    id: String(data.badgeId || id),
    name: String(data.name || 'Badge'),
    thaiName: String(data.thaiName || data.name || 'เหรียญรางวัล'),
    description: String(data.description || ''),
    iconName: String(data.iconName || 'Trophy'),
    category,
    rarity,
    unlocked,
    unlockedAt: data.unlockedAt ? String(data.unlockedAt) : undefined,
    progress,
    maxProgress,
  };
}

function sortBadgesForDisplay(badges: Badge[]): Badge[] {
  return [...badges].sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    const rarityDiff = (RARITY_SORT_WEIGHT[b.rarity] || 0) - (RARITY_SORT_WEIGHT[a.rarity] || 0);
    if (rarityDiff !== 0) return rarityDiff;
    const aPct = a.maxProgress > 0 ? a.progress / a.maxProgress : 0;
    const bPct = b.maxProgress > 0 ? b.progress / b.maxProgress : 0;
    return bPct - aPct;
  });
}

export async function seedUserBadgesIfEmpty(
  uid: string,
  defaultBadges: Badge[]
): Promise<Badge[]> {
  const safeUid = sanitizeId(uid, 'user');
  const colPath = `users/${safeUid}/badges`;
  try {
    const q = query(collection(db, 'users', safeUid, 'badges'), where('ownerId', '==', safeUid));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return sortBadgesForDisplay(
        snap.docs.map((d) => mapFirestoreBadgeDoc(d.id, d.data()))
      );
    }

    const batch = writeBatch(db);
    defaultBadges.forEach((badge) => {
      const safeBadgeId = sanitizeId(badge.id, 'badge').slice(0, 64);
      const badgeRef = doc(db, 'users', safeUid, 'badges', safeBadgeId);
      batch.set(badgeRef, buildUserBadgePayload(safeUid, { ...badge, id: safeBadgeId }, false));
    });
    await batch.commit();
    return sortBadgesForDisplay(defaultBadges);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, colPath);
  }
}

export function subscribeUserBadges(
  uid: string,
  onData: (badges: Badge[]) => void
): () => void {
  const safeUid = sanitizeId(uid, 'user');
  const colPath = `users/${safeUid}/badges`;
  const q = query(collection(db, 'users', safeUid, 'badges'), where('ownerId', '==', safeUid));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = sortBadgesForDisplay(
        snapshot.docs.map((d) => mapFirestoreBadgeDoc(d.id, d.data()))
      );
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, colPath);
    }
  );
}

export async function upsertUserBadgeInCloud(uid: string, badge: Badge): Promise<void> {
  const safeUid = sanitizeId(uid, 'user');
  const safeBadgeId = sanitizeId(badge.id, 'badge').slice(0, 64);
  const path = `users/${safeUid}/badges/${safeBadgeId}`;
  try {
    const badgeRef = doc(db, 'users', safeUid, 'badges', safeBadgeId);
    const existingSnap = await getDoc(badgeRef);
    if (existingSnap.exists()) {
      await updateDoc(badgeRef, buildUserBadgePayload(safeUid, { ...badge, id: safeBadgeId }, true));
    } else {
      await setDoc(badgeRef, buildUserBadgePayload(safeUid, { ...badge, id: safeBadgeId }, false));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function syncPlayerProfileToCloud(
  uid: string,
  player: PlayerProfile,
  walletBalance: number
): Promise<void> {
  const safeUid = sanitizeId(uid, 'user');
  const userPath = `users/${safeUid}`;
  try {
    const userRef = doc(db, 'users', safeUid);
    const displayName = clampStr(player.name, 80, 'Badminton Player');
    const safeWallet = Math.max(0, Math.min(1000000, Number(walletBalance) || 0));
    const safeLevel = clampInt(player.level, 1, 200, 12);
    const safeExp = clampInt(player.currentExp, 0, 10000000, 0);
    const safeNextExp = clampInt(player.nextLevelExp, 1, 10000000, 1000);
    const safeStreak = clampInt(player.streakWeeks, 0, 1000, 0);

    const existingSnap = await getDoc(userRef);
    if (existingSnap.exists()) {
      await updateDoc(userRef, {
        displayName,
        photoUrl: clampStr(player.avatarUrl, 500, ''),
        tier: player.tier,
        level: safeLevel,
        currentExp: safeExp,
        nextLevelExp: safeNextExp,
        dominantHand: player.dominantHand,
        playstyle: clampStr(player.playstyle, 80),
        primaryGoal: clampStr(player.primaryGoal, 60),
        streakWeeks: safeStreak,
        walletBalance: safeWallet,
        skillRadar: player.skillRadar,
        racket: player.racket,
        stats: player.stats,
        updatedAt: serverTimestamp(),
      });
    } else {
      const email = clampStr(auth.currentUser?.email, 160, '');
      const initialDoc: Record<string, unknown> = {
        uid: safeUid,
        displayName,
        photoUrl: clampStr(player.avatarUrl, 500, ''),
        tier: player.tier,
        level: safeLevel,
        currentExp: safeExp,
        nextLevelExp: safeNextExp,
        dominantHand: player.dominantHand,
        playstyle: clampStr(player.playstyle, 80),
        primaryGoal: clampStr(player.primaryGoal, 60),
        streakWeeks: safeStreak,
        walletBalance: safeWallet,
        skillRadar: player.skillRadar,
        racket: player.racket,
        stats: player.stats,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (email) {
        initialDoc.email = email;
      }
      await setDoc(userRef, initialDoc);
    }

    await setDoc(
      doc(db, 'leaderboard', safeUid),
      {
        uid: safeUid,
        displayName,
        tier: player.tier,
        level: safeLevel,
        ovr: computeOvr(player.skillRadar),
        points: safeExp,
        winRate: player.stats.winRate,
        avatarPreset: 'karn',
        visibility: 'community',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

export async function createBookingInCloud(
  uid: string,
  input: {
    courtId: string;
    courtName: string;
    courtNumber: number;
    date: string;
    slotsSummary: string;
    totalAmount: number;
    paymentMethod: 'PromptPay' | 'SmashPay' | 'TrueMoney';
    bookingRef: string;
  }
): Promise<string> {
  const safeUid = sanitizeId(uid, 'user');
  const bookingId = sanitizeId(`bk_${Date.now()}_${safeUid.slice(0, 6)}`, 'bk');
  const path = `bookings/${bookingId}`;
  const safeDate = clampStr(input.date, 32, '2026-11-17');
  const safeRef = clampStr(input.bookingRef, 40, 'BK-SMA-1001');
  try {
    await setDoc(doc(db, 'bookings', bookingId), {
      ownerId: safeUid,
      courtId: clampStr(input.courtId, 80, 'court_1'),
      courtName: clampStr(input.courtName, 120, 'Badminton Court'),
      courtNumber: clampInt(input.courtNumber, 1, 40, 1),
      date: safeDate.length >= 4 ? safeDate : '2026-11-17',
      slotsSummary: clampStr(input.slotsSummary, 120, '19:00-21:00'),
      totalAmount: Math.max(0, Math.min(100000, Number(input.totalAmount) || 0)),
      paymentMethod: input.paymentMethod,
      bookingRef: safeRef.length >= 4 ? safeRef : 'BK-SMA-1001',
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return bookingId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateBookingStatusInCloud(
  bookingId: string,
  status: 'completed' | 'cancelled'
): Promise<void> {
  const safeId = sanitizeId(bookingId, 'bk');
  const path = `bookings/${safeId}`;
  try {
    await updateDoc(doc(db, 'bookings', safeId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeUserBookings(
  uid: string,
  onData: (bookings: CloudBookingRecord[]) => void
): () => void {
  const safeUid = sanitizeId(uid, 'user');
  const path = 'bookings';
  const q = query(collection(db, 'bookings'), where('ownerId', '==', safeUid));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: CloudBookingRecord[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ownerId: String(data.ownerId || safeUid),
          courtId: String(data.courtId || ''),
          courtName: String(data.courtName || ''),
          courtNumber: Number(data.courtNumber || 1),
          date: String(data.date || ''),
          slotsSummary: String(data.slotsSummary || ''),
          totalAmount: Number(data.totalAmount || 0),
          paymentMethod: data.paymentMethod || 'PromptPay',
          bookingRef: String(data.bookingRef || ''),
          status: data.status || 'confirmed',
          createdAtMs: toMs(data.createdAt),
        };
      });
      list.sort((a, b) => b.createdAtMs - a.createdAtMs);
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveMatchInCloud(
  uid: string,
  input: Omit<CloudMatchRecord, 'id' | 'ownerId' | 'createdAtMs'>
): Promise<string> {
  const safeUid = sanitizeId(uid, 'user');
  const matchId = sanitizeId(`match_${Date.now()}_${safeUid.slice(0, 6)}`, 'match');
  const path = `matches/${matchId}`;
  try {
    await setDoc(doc(db, 'matches', matchId), {
      ownerId: safeUid,
      playerAName: clampStr(input.playerAName, 80, 'Player A'),
      playerBName: clampStr(input.playerBName, 80, 'Player B'),
      isDoubles: Boolean(input.isDoubles),
      finalScore: clampStr(input.finalScore, 20, '2 - 0'),
      setSummary: clampStr(input.setSummary, 80, ''),
      result: input.result === 'loss' ? 'loss' : 'win',
      courtName: clampStr(input.courtName, 120, 'Smash Arena'),
      highestSmashKmh: clampInt(input.highestSmashKmh, 0, 600, 320),
      durationMin: clampInt(input.durationMin, 0, 600, 35),
      expGained: clampInt(input.expGained, 0, 5000, 120),
      highlightShot: clampStr(input.highlightShot, 140, 'Jump Smash'),
      isPublic: input.isPublic !== false,
      createdAt: serverTimestamp(),
    });
    return matchId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteMatchInCloud(matchId: string): Promise<void> {
  const safeMatchId = sanitizeId(matchId, 'match');
  const path = `matches/${safeMatchId}`;
  try {
    await deleteDoc(doc(db, 'matches', safeMatchId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

function mapFirestoreMatchDoc(id: string, data: Record<string, any>): CloudMatchRecord {
  return {
    id,
    ownerId: String(data.ownerId || ''),
    playerAName: String(data.playerAName || ''),
    playerBName: String(data.playerBName || ''),
    isDoubles: Boolean(data.isDoubles),
    finalScore: String(data.finalScore || ''),
    setSummary: String(data.setSummary || ''),
    result: data.result === 'loss' ? 'loss' : 'win',
    courtName: String(data.courtName || ''),
    highestSmashKmh: Number(data.highestSmashKmh || 0),
    durationMin: Number(data.durationMin || 0),
    expGained: Number(data.expGained || 0),
    highlightShot: String(data.highlightShot || ''),
    isPublic: Boolean(data.isPublic),
    createdAtMs: toMs(data.createdAt),
  };
}

export function subscribeUserMatches(
  uid: string,
  onData: (matches: CloudMatchRecord[]) => void
): () => void {
  const safeUid = sanitizeId(uid, 'user');
  const path = 'matches';
  const q = query(collection(db, 'matches'), where('ownerId', '==', safeUid));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs
        .map((d) => mapFirestoreMatchDoc(d.id, d.data()))
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribePublicMatches(onData: (matches: CloudMatchRecord[]) => void): () => void {
  const path = 'matches';
  const q = query(collection(db, 'matches'), where('isPublic', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs
        .map((d) => mapFirestoreMatchDoc(d.id, d.data()))
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function createFeedPostInCloud(
  uid: string,
  authorName: string,
  input: {
    type: 'match' | 'achievement' | 'milestone';
    guildName: string;
    headline: string;
    summary: string;
    scoreDisplay?: string;
  }
): Promise<string> {
  const safeUid = sanitizeId(uid, 'user');
  const postId = sanitizeId(`post_${Date.now()}_${safeUid.slice(0, 6)}`, 'post');
  const path = `feedPosts/${postId}`;
  try {
    const payload: Record<string, unknown> = {
      authorId: safeUid,
      authorName: clampStr(authorName, 80, 'Player'),
      type: input.type,
      guildName: clampStr(input.guildName, 100, 'Rama 9 Smashers'),
      headline: clampStr(input.headline, 140),
      summary: clampStr(input.summary, 400),
      cheersCount: 0,
      visibility: 'community',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (input.scoreDisplay) {
      payload.scoreDisplay = clampStr(input.scoreDisplay, 40);
    }
    await setDoc(doc(db, 'feedPosts', postId), payload);
    return postId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeCommunityFeed(onData: (posts: CloudFeedPost[]) => void): () => void {
  const path = 'feedPosts';
  const q = query(collection(db, 'feedPosts'), where('visibility', '==', 'community'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: CloudFeedPost[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          authorId: String(data.authorId || ''),
          authorName: String(data.authorName || ''),
          type: data.type || 'milestone',
          guildName: String(data.guildName || ''),
          headline: String(data.headline || ''),
          summary: String(data.summary || ''),
          scoreDisplay: data.scoreDisplay ? String(data.scoreDisplay) : undefined,
          cheersCount: Number(data.cheersCount || 0),
          visibility: 'community',
          createdAtMs: toMs(data.createdAt),
        };
      });
      list.sort((a, b) => b.createdAtMs - a.createdAtMs);
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function toggleFeedCheerInCloud(
  postId: string,
  uid: string,
  currentCheersCount: number
): Promise<boolean> {
  const safePostId = sanitizeId(postId, 'post');
  const safeUid = sanitizeId(uid, 'user');
  const postPath = `feedPosts/${safePostId}`;
  try {
    const postRef = doc(db, 'feedPosts', safePostId);
    const cheerRef = doc(db, 'feedPosts', safePostId, 'cheers', safeUid);

    const [cheerSnap, postSnap] = await Promise.all([getDoc(cheerRef), getDoc(postRef)]);
    const existsNow = cheerSnap.exists();
    const serverCount = postSnap.exists()
      ? Number(postSnap.data().cheersCount ?? currentCheersCount)
      : currentCheersCount;
    const nextCount = existsNow ? Math.max(0, serverCount - 1) : serverCount + 1;

    const batch = writeBatch(db);
    if (existsNow) {
      batch.delete(cheerRef);
    } else {
      batch.set(cheerRef, {
        userId: safeUid,
        createdAt: serverTimestamp(),
      });
    }

    batch.update(postRef, {
      cheersCount: nextCount,
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
    return !existsNow;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, postPath);
  }
}

export async function recordWalletTransactionInCloud(
  uid: string,
  tx: {
    title: string;
    subtitle: string;
    amount: number;
    type: 'credit' | 'debit';
    category: string;
  },
  nextBalance: number
): Promise<string> {
  const safeUid = sanitizeId(uid, 'user');
  const txId = sanitizeId(`tx_${Date.now()}_${safeUid.slice(0, 6)}`, 'tx');
  const path = `walletTransactions/${txId}`;
  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'walletTransactions', txId), {
      ownerId: safeUid,
      title: clampStr(tx.title, 100, 'Transaction'),
      subtitle: clampStr(tx.subtitle, 140, 'SmashPay'),
      amount: Math.max(-1000000, Math.min(1000000, Number(tx.amount) || 0)),
      type: tx.type,
      category: clampStr(tx.category, 40, 'wallet'),
      status: 'completed',
      createdAt: serverTimestamp(),
    });
    batch.update(doc(db, 'users', safeUid), {
      walletBalance: Math.max(0, Math.min(1000000, Number(nextBalance) || 0)),
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
    return txId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeWalletTransactions(
  uid: string,
  onData: (txs: CloudWalletTx[]) => void
): () => void {
  const safeUid = sanitizeId(uid, 'user');
  const path = 'walletTransactions';
  const q = query(collection(db, 'walletTransactions'), where('ownerId', '==', safeUid));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: CloudWalletTx[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ownerId: String(data.ownerId || safeUid),
          title: String(data.title || ''),
          subtitle: String(data.subtitle || ''),
          amount: Number(data.amount || 0),
          type: data.type === 'debit' ? 'debit' : 'credit',
          category: String(data.category || 'wallet'),
          status: data.status === 'pending' ? 'pending' : 'completed',
          createdAtMs: toMs(data.createdAt),
        };
      });
      list.sort((a, b) => b.createdAtMs - a.createdAtMs);
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeCommunityLeaderboard(
  onData: (entries: LeaderboardUser[]) => void
): () => void {
  const path = 'leaderboard';
  const q = query(collection(db, 'leaderboard'), where('visibility', '==', 'community'));
  return onSnapshot(
    q,
    (snapshot) => {
      const rows: LeaderboardUser[] = snapshot.docs
        .map((d) => {
          const data = d.data();
          const expVal = Number(data.points || 0);
          return {
            rank: 0,
            id: d.id,
            name: String(data.displayName || 'Player'),
            tier: (data.tier as PlayerTier) || 'Silver',
            ovr: Number(data.ovr || 85),
            winRate: Number(data.winRate || 60),
            totalGames: Math.max(1, Math.round(expVal / 150)),
            smashPoints: expVal,
            exp: expVal,
            guildTitle: 'Rama 9 Smashers',
            avatarUrl: String(data.avatarPreset || 'karn'),
          };
        })
        .sort((a, b) => b.exp - a.exp)
        .map((item, idx) => ({ ...item, rank: idx + 1 }));
      onData(rows);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function toggleGuildRsvpInCloud(
  eventId: string,
  uid: string,
  player: PlayerProfile,
  eventSeed: {
    title: string;
    date: string;
    timeRange: string;
    courtName: string;
    courtFeeTotal: number;
    shuttlecockFeeTotal: number;
    maxPlayers: number;
  },
  isCurrentlyAttending: boolean
): Promise<void> {
  const safeEventId = sanitizeId(eventId, 'evt');
  const safeUid = sanitizeId(uid, 'user');
  const attendeePath = `guildEvents/${safeEventId}/attendees/${safeUid}`;
  try {
    const eventRef = doc(db, 'guildEvents', safeEventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) {
      await setDoc(eventRef, {
        hostId: safeUid,
        title: clampStr(eventSeed.title, 120, 'Wednesday Night Smash'),
        date: clampStr(eventSeed.date, 40, 'Wed'),
        timeRange: clampStr(eventSeed.timeRange, 40, '19:00 - 22:00'),
        courtName: clampStr(eventSeed.courtName, 120, 'Smash Arena'),
        courtFeeTotal: Math.max(0, Number(eventSeed.courtFeeTotal) || 0),
        shuttlecockFeeTotal: Math.max(0, Number(eventSeed.shuttlecockFeeTotal) || 0),
        maxPlayers: clampInt(eventSeed.maxPlayers, 2, 100, 16),
        visibility: 'community',
        updatedAt: serverTimestamp(),
      });
    }

    const attendeeRef = doc(db, 'guildEvents', safeEventId, 'attendees', safeUid);
    if (isCurrentlyAttending) {
      await deleteDoc(attendeeRef);
    } else {
      await setDoc(attendeeRef, {
        userId: safeUid,
        name: clampStr(player.name, 80, 'Player'),
        tier: clampStr(player.tier, 20, 'Diamond'),
        ovr: computeOvr(player.skillRadar),
        paid: false,
        joinedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, attendeePath);
  }
}

export function subscribeGuildAttendees(
  eventId: string,
  onData: (attendees: CloudGuildAttendee[]) => void
): () => void {
  const safeEventId = sanitizeId(eventId, 'evt');
  const path = `guildEvents/${safeEventId}/attendees`;
  return onSnapshot(
    collection(db, 'guildEvents', safeEventId, 'attendees'),
    (snapshot) => {
      const list: CloudGuildAttendee[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          userId: d.id,
          name: String(data.name || 'Player'),
          tier: String(data.tier || 'Silver'),
          ovr: Number(data.ovr || 80),
          paid: Boolean(data.paid),
          joinedAtMs: toMs(data.joinedAt),
        };
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function markGuildAttendeePaidInCloud(
  eventId: string,
  uid: string,
  paid: boolean
): Promise<void> {
  const safeEventId = sanitizeId(eventId, 'evt');
  const safeUid = sanitizeId(uid, 'user');
  const attendeePath = `guildEvents/${safeEventId}/attendees/${safeUid}`;
  try {
    const attendeeRef = doc(db, 'guildEvents', safeEventId, 'attendees', safeUid);
    const snap = await getDoc(attendeeRef);
    if (snap.exists()) {
      await updateDoc(attendeeRef, { paid: Boolean(paid) });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, attendeePath);
  }
}
