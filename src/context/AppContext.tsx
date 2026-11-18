/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState } from 'react';
import {
  ScreenId,
  MainTab,
  AppViewMode,
  Badge,
  PlayerProfile,
  CourtFacility,
  CourtSlot,
  BookingState,
  MatchScoreState,
  ShotLogItem,
  Quest,
  AIDrill,
  GuildGroup,
  GuildEvent,
  LeaderboardUser,
  AppNotification,
  PlayerTier,
  RedeemedVoucher,
} from '../types';
import {
  INITIAL_PLAYER,
  COURTS_DATA,
  INITIAL_QUESTS,
  AI_DRILLS,
  GUILDS_DATA,
  INITIAL_GUILD_EVENTS,
  CURRENT_GUILD_EVENT,
  LEADERBOARD_DATA,
  FINANCE_TRANSACTIONS,
} from '../data/mockData';
import {
  WORST_CASE_PLAYER,
  ONE_ITEM_PLAYER,
  WORST_CASE_COURTS,
} from '../data/stressTestData';
import {
  playSelectSound,
  playCoinSound,
  playSmashSound,
  playLevelUpSound,
  toggleAudioMute,
} from '../utils/retroAudio';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import {
  CACHE_KEYS,
  CourtMapCacheData,
  PlayerMatchCacheData,
  QuestsDrillsCacheData,
  clearAllOfflineCaches,
  getCacheOverview,
  readCache,
  writeCache,
} from '../utils/offlineCache';
import {
  DrillStreakSummary,
  calculateDrillStreakSummary,
  loadDrillStreakDates,
  persistDrillStreakDates,
  recordDrillCompletedForToday,
  seedDefaultStreakDates,
} from '../utils/drillStreak';
import { auth } from '../firebase';
import {
  CloudBookingRecord,
  CloudFeedPost,
  CloudMatchRecord,
  CloudWalletTx,
  computeOvr,
  createBookingInCloud,
  createFeedPostInCloud,
  deleteMatchInCloud,
  ensureAndLoadUserProfile,
  markGuildAttendeePaidInCloud,
  recordWalletTransactionInCloud,
  resolveLocalizedPlaystyle,
  saveMatchInCloud,
  seedUserBadgesIfEmpty,
  signInWithGoogleAccount,
  signOutAccountSession,
  subscribeAuth,
  subscribeCommunityFeed,
  subscribeCommunityLeaderboard,
  subscribeGuildAttendees,
  subscribePublicMatches,
  subscribeUserBadges,
  subscribeUserBookings,
  subscribeUserMatches,
  subscribeUserProfile,
  subscribeWalletTransactions,
  syncPlayerProfileToCloud,
  toggleFeedCheerInCloud,
  toggleGuildRsvpInCloud,
  updateBookingStatusInCloud,
  upsertUserBadgeInCloud,
} from '../services/firebaseService';
import {
  BANGKOK_DEFAULT_CENTER,
  COURT_SLOT_HOURS,
  calculateHaversineKm,
  getTodayIsoDate,
  isSlotElapsedToday,
} from '../utils/geoUtils';

const ONBOARDING_STORAGE_KEY = 'smashai_onboarding_v4_completed';

const LIVE_STORAGE_KEYS = {
  WALLET_BALANCE: 'smashai_live_v1_wallet_balance',
  LOCAL_TXS: 'smashai_live_v1_local_txs',
  LOCAL_BOOKINGS: 'smashai_live_v1_local_bookings',
  LOCAL_MATCHES: 'smashai_live_v1_local_matches',
  LOCAL_FEED_POSTS: 'smashai_live_v1_local_feed_posts',
  GUILDS: 'smashai_live_v1_guilds',
  MY_GUILD_IDS: 'smashai_live_v1_my_guild_ids',
  GUILD_EVENTS: 'smashai_live_v1_guild_events',
  ACTIVE_EVENT_ID: 'smashai_live_v1_active_event_id',
  WEARABLE: 'smashai_live_v1_wearable',
  WEARABLE_CLAIMED_IDS: 'smashai_live_v1_wearable_claimed_ids',
  VOUCHERS: 'smashai_live_v1_vouchers',
  BOOKMARKS: 'smashai_live_v1_bookmarked_courts',
  CHEERED_IDS: 'smashai_live_v1_cheered_ids',
} as const;

function readLocalJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocalJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export interface UserGeoLocation {
  lat: number;
  lng: number;
  accuracyM?: number;
  isLiveGps: boolean;
  updatedAtMs: number;
}

interface ExpGainPayload {
  amount: number;
  source: string;
  badgeUnlocked?: string;
  newLevel?: number;
}

export interface LogHistoricalMatchInput {
  opponentName: string;
  partnerName?: string;
  isDoubles: boolean;
  courtName: string;
  sets: { scoreA: number; scoreB: number }[];
  highestSmashKmh: number;
  durationMin: number;
  highlightShot: string;
  isPublic?: boolean;
}

interface AppContextType {
  // Language & Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS['th'];

  // Navigation
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId, direction?: 'forward' | 'backward') => void;
  goBack: () => void;
  navDirection: 'forward' | 'backward';
  hasCompletedOnboarding: boolean;
  completeOnboarding: (targetScreen?: ScreenId) => void;
  replayOnboarding: () => void;
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  isDeviceFrameEnabled: boolean;
  toggleDeviceFrame: () => void;
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  userLocation: UserGeoLocation;
  gpsPermissionState: 'prompt' | 'granted' | 'denied' | 'unsupported';
  requestLiveLocation: () => Promise<UserGeoLocation | null>;

  // Theme Settings (Light / Dark)
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Sound Settings
  isSoundEnabled: boolean;
  toggleSound: () => void;
  isCrtEnabled: boolean;
  toggleCrt: () => void;

  // Quick Sparring Modal
  sparringModalPlayer: any | null;
  setSparringModalPlayer: (player: any | null) => void;

  // Player & Gamification
  player: PlayerProfile;
  updatePlayer: (updates: Partial<PlayerProfile>) => void;
  gainExp: (amount: number, source: string, badgeName?: string) => void;
  expCelebration: ExpGainPayload | null;
  dismissExpCelebration: () => void;

  // Court Booking
  courts: CourtFacility[];
  selectedCourt: CourtFacility;
  setSelectedCourt: (court: CourtFacility) => void;
  bookmarkedCourtIds: string[];
  toggleBookmarkCourt: (courtId: string) => void;

  // Break UI Stress-Testing
  dataMode: 'demo' | 'worst' | 'empty' | 'one';
  setDataMode: (mode: 'demo' | 'worst' | 'empty' | 'one') => void;
  booking: BookingState;
  updateBooking: (updates: Partial<BookingState>) => void;
  resetBooking: () => void;

  // Match Scoring
  match: MatchScoreState;
  addScorePoint: (team: 'A' | 'B', shotType?: any, errorReason?: any) => void;
  undoLastPoint: () => void;
  finishMatch: () => void;
  startNewMatch: (options?: { playerAName?: string; playerBName?: string; isDoubles?: boolean }) => void;

  // Quests & AI Drills
  quests: Quest[];
  claimQuestReward: (questId: string) => void;
  drills: AIDrill[];
  completeDrill: (drillId: string) => void;
  addCustomDrill: (drill: Omit<AIDrill, 'id' | 'completed'>) => AIDrill;
  drillStreak: DrillStreakSummary;

  // Guild & Event
  guilds: GuildGroup[];
  myGuildIds: string[];
  guildEvents: GuildEvent[];
  activeEventId: string;
  selectGuildEvent: (eventId: string) => void;
  createGuild: (input: {
    name: string;
    tag: string;
    homeCourt: string;
    regularDays: string;
    maxMembers: number;
  }) => GuildGroup;
  joinGuild: (guildId: string) => void;
  currentEvent: GuildEvent;
  toggleEventRsvp: (userId: string) => void;
  payEventShare: (eventId?: string) => Promise<{
    ok: boolean;
    reason?: 'insufficient_funds' | 'already_paid' | 'not_attending';
    amountPaid?: number;
  }>;
  updateEventBudget: (eventId: string, courtFeeTotal: number, shuttlecockFeeTotal: number) => void;
  leaderboard: LeaderboardUser[];

  // Wearables (Strava OAuth + Apple Watch file/bridge sync)
  wearableConnected: boolean;
  setWearableConnected: (connected: boolean) => void;
  wearableMetrics: {
    heartRateBpm: number;
    maxHeartRateBpm?: number;
    caloriesBurned: number;
    distanceKm: number;
    durationMin?: number;
    source?: string;
    activityName?: string;
    activityId?: string;
    syncedAtMs?: number;
    expConverted: boolean;
  };
  convertCaloriesToExp: () => void;
  logWearableWorkout: (metrics: {
    heartRateBpm: number;
    maxHeartRateBpm?: number;
    caloriesBurned: number;
    distanceKm: number;
    durationMin?: number;
    source?: string;
    activityName?: string;
    activityId?: string;
  }) => void;

  // Video Analysis demo state
  analyzedVideoResult: any;
  setAnalyzedVideoResult: (res: any) => void;

  // Screen Loading & Skeleton Transitions
  isScreenLoading: boolean;
  setIsScreenLoading: (loading: boolean) => void;
  simulateDataFetch: (durationMs?: number) => void;

  // Centralized Notification System
  currentNotification: AppNotification | null;
  showNotification: (notification: Omit<AppNotification, 'id'>) => void;
  dismissNotification: () => void;
  triggerSampleInvite: () => void;
  triggerSampleBookingConfirmation: () => void;
  triggerSampleCountdownAlert: () => void;
  triggerSamplePartyUpdate: () => void;

  // Offline Connectivity & Local Cache Sync
  isOnline: boolean;
  justReconnected: boolean;
  hasPendingSync: boolean;
  lastSyncedAt: number | null;
  refreshOfflineCache: () => void;
  resetOfflineCache: () => void;

  // Firebase Auth & Cloud Sync (Soft Launch)
  authUser: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null;
  isAuthReady: boolean;
  isAuthBusy: boolean;
  isCloudProfileSynced: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signOutAccount: () => Promise<void>;
  walletBalance: number;
  walletTransactions: {
    id: string;
    title: string;
    subtitle: string;
    amount: number;
    type: 'credit' | 'debit';
    date: string;
    category: string;
    status: 'completed' | 'pending';
  }[];
  vouchers: RedeemedVoucher[];
  redeemPointsVoucher: (input: {
    costExp: number;
    titleTh: string;
    titleEn: string;
    discountAmount: number;
    target: 'court' | 'squad';
  }) => { ok: boolean; voucher?: RedeemedVoucher };
  topUpWallet: (amount: number) => Promise<void>;
  cloudBookings: CloudBookingRecord[];
  saveBookingToCloud: (
    paymentMethod?: 'PromptPay' | 'SmashPay' | 'TrueMoney',
    voucherId?: string
  ) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  cloudMatches: CloudMatchRecord[];
  userCloudMatches: CloudMatchRecord[];
  userCloudBadges: Badge[];
  isProfileCloudLoading: boolean;
  profileSyncedAt: number | null;
  logHistoricalMatch: (input: LogHistoricalMatchInput) => Promise<boolean>;
  deleteHistoricalMatch: (matchId: string) => Promise<void>;
  cloudFeedPosts: CloudFeedPost[];
  publishFeedPost: (input: {
    type: 'match' | 'achievement' | 'milestone';
    guildName: string;
    headline: string;
    summary: string;
    scoreDisplay?: string;
  }) => Promise<void>;
  cheeredCloudIds: Record<string, boolean>;
  toggleCloudFeedCheer: (postId: string, guildName: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('th');
  const t = TRANSLATIONS[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    playSelectSound();
  };

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const initialStartScreen: ScreenId = hasCompletedOnboarding ? 'HOME' : 'A1';
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(initialStartScreen);
  const [historyStack, setHistoryStack] = useState<ScreenId[]>([initialStartScreen]);
  const [navDirection, setNavDirection] = useState<'forward' | 'backward'>('forward');
  const [activeTab, setActiveTabState] = useState<MainTab>('home');
  const [isDeviceFrameEnabled, setIsDeviceFrameEnabled] = useState<boolean>(true);
  const [viewMode, setViewModeState] = useState<AppViewMode>('single');
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isCrtEnabled, setIsCrtEnabled] = useState<boolean>(false);

  const [userLocation, setUserLocation] = useState<UserGeoLocation>({
    lat: BANGKOK_DEFAULT_CENTER.lat,
    lng: BANGKOK_DEFAULT_CENTER.lng,
    isLiveGps: false,
    updatedAtMs: Date.now(),
  });
  const [gpsPermissionState, setGpsPermissionState] = useState<
    'prompt' | 'granted' | 'denied' | 'unsupported'
  >(() =>
    typeof navigator !== 'undefined' && 'geolocation' in navigator ? 'prompt' : 'unsupported'
  );
  const [liveClock, setLiveClock] = useState<Date>(() => new Date());

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sparringModalPlayer, setSparringModalPlayer] = useState<any | null>(null);

  // Screen Loading & Transition Skeleton State
  const [isScreenLoading, setIsScreenLoading] = useState<boolean>(false);

  const { isOnline, justReconnected } = useOnlineStatus();
  const [hasPendingSync, setHasPendingSync] = useState<boolean>(() => getCacheOverview().hasPendingSync);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(() => {
    const overview = getCacheOverview();
    return overview.questsSyncedAt || overview.courtMapSyncedAt || overview.matchSyncedAt || Date.now();
  });

  const simulateDataFetch = (durationMs = 500) => {
    setIsScreenLoading(true);
    setTimeout(() => {
      setIsScreenLoading(false);
    }, durationMs);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    playSelectSound();
  };

  const toggleSound = () => {
    const muted = toggleAudioMute();
    setIsSoundEnabled(!muted);
  };

  const toggleCrt = () => {
    setIsCrtEnabled((prev) => !prev);
  };

  const setViewMode = (mode: AppViewMode) => {
    setViewModeState(mode);
  };

  React.useEffect(() => {
    (window as any).__setAppViewMode = setViewMode;
  }, []);

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  React.useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'th') {
      document.documentElement.classList.add('font-thai');
      document.documentElement.classList.remove('font-eng');
    } else {
      document.documentElement.classList.add('font-eng');
      document.documentElement.classList.remove('font-thai');
    }
  }, [language]);

  // Break UI Stress-Testing Mode (Demo / Worst case / Empty / One)
  const [dataMode, setDataMode] = useState<'demo' | 'worst' | 'empty' | 'one'>('demo');

  // Player State (Rehydrated from localStorage for offline match/EXP continuity)
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    const cached = readCache<PlayerMatchCacheData>(CACHE_KEYS.PLAYER_MATCH);
    return cached?.player && cached.player.id ? cached.player : INITIAL_PLAYER;
  });
  const [expCelebration, setExpCelebration] = useState<ExpGainPayload | null>(null);

  // Court Booking State (Rehydrated from localStorage for offline Court Map access)
  const [courts, setCourts] = useState<CourtFacility[]>(() => {
    const cached = readCache<CourtMapCacheData>(CACHE_KEYS.COURT_MAP);
    return cached?.courts && cached.courts.length > 0 ? cached.courts : COURTS_DATA;
  });
  const [selectedCourt, setSelectedCourt] = useState<CourtFacility>(() => {
    const cachedMatch = readCache<PlayerMatchCacheData>(CACHE_KEYS.PLAYER_MATCH);
    const cachedMap = readCache<CourtMapCacheData>(CACHE_KEYS.COURT_MAP);
    const preferredId = cachedMatch?.selectedCourtId || cachedMap?.selectedCourtId;
    const pool = cachedMap?.courts && cachedMap.courts.length > 0 ? cachedMap.courts : COURTS_DATA;
    return pool.find((c) => c.id === preferredId) || pool[0];
  });

  // Derived fixtures + real-time GPS Haversine distances & real-time slot counts
  const activePlayer = dataMode === 'worst' ? WORST_CASE_PLAYER : dataMode === 'one' ? ONE_ITEM_PLAYER : player;
  const rawCourts = dataMode === 'worst' ? WORST_CASE_COURTS : dataMode === 'empty' ? [] : dataMode === 'one' ? [COURTS_DATA[0]] : courts;
  const [booking, setBooking] = useState<BookingState>(() => ({
    court: COURTS_DATA[0],
    selectedCourtNumber: 3,
    selectedSlots: [
      {
        id: 'slot_19_20',
        courtNumber: 3,
        startTime: '19:00',
        endTime: '20:00',
        price: 280,
        isAvailable: true,
        isSelected: true,
      },
      {
        id: 'slot_20_21',
        courtNumber: 3,
        startTime: '20:00',
        endTime: '21:00',
        price: 280,
        isAvailable: true,
        isSelected: true,
      },
    ],
    date: getTodayIsoDate(),
    totalAmount: 560,
    paymentMethod: 'PromptPay',
    slipUploaded: false,
    bookingRef: 'BK-SMA-8921',
  }));

  // Match Scoring State (Rehydrated from localStorage so scores persist if connection drops mid-match)
  const [match, setMatch] = useState<MatchScoreState>(() => {
    const cached = readCache<PlayerMatchCacheData>(CACHE_KEYS.PLAYER_MATCH);
    if (cached?.match && typeof cached.match.scoreA === 'number') {
      return cached.match;
    }
    return {
      playerAName: 'กานต์ & โอห์ม',
      playerBName: 'อาร์ท & ท็อป',
      isDoubles: true,
      scoreA: 19,
      scoreB: 18,
      setsWonA: 1,
      setsWonB: 0,
      currentSet: 2,
      pastSets: [{ set: 1, scoreA: 21, scoreB: 17 }],
      server: 'A',
      serviceBox: 'left',
      isMatchFinished: false,
      shotHistory: [
        {
          id: 'shot_1',
          pointNumber: 35,
          team: 'A',
          shotType: 'Smash',
          timestamp: '19:42',
          zone: 'mid-right',
        },
        {
          id: 'shot_2',
          pointNumber: 36,
          team: 'B',
          shotType: 'Drop',
          timestamp: '19:43',
          zone: 'front-left',
        },
        {
          id: 'shot_3',
          pointNumber: 37,
          team: 'A',
          shotType: 'Smash',
          timestamp: '19:44',
          zone: 'back-right',
        },
      ],
    };
  });

  // Quests & Drills State (Rehydrated from localStorage for offline access & claim persistence)
  const [quests, setQuests] = useState<Quest[]>(() => {
    const cached = readCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS);
    return cached?.quests && cached.quests.length > 0 ? cached.quests : INITIAL_QUESTS;
  });
  const [drills, setDrills] = useState<AIDrill[]>(() => {
    const cached = readCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS);
    return cached?.drills && cached.drills.length > 0 ? cached.drills : AI_DRILLS;
  });
  const [drillStreakDates, setDrillStreakDates] = useState<string[]>(() => loadDrillStreakDates());
  const drillStreak = React.useMemo(
    () => calculateDrillStreakSummary(drillStreakDates),
    [drillStreakDates]
  );

  // Guilds, Multi-Event Squads & Leaderboard State (persisted to localStorage)
  const [guilds, setGuilds] = useState<GuildGroup[]>(() => {
    const saved = readLocalJson<GuildGroup[]>(LIVE_STORAGE_KEYS.GUILDS, GUILDS_DATA);
    return Array.isArray(saved) && saved.length > 0 ? saved : GUILDS_DATA;
  });
  const [myGuildIds, setMyGuildIds] = useState<string[]>(() => {
    const saved = readLocalJson<string[]>(LIVE_STORAGE_KEYS.MY_GUILD_IDS, ['guild_rama9']);
    return Array.isArray(saved) ? saved : ['guild_rama9'];
  });
  const [guildEvents, setGuildEvents] = useState<GuildEvent[]>(() => {
    const saved = readLocalJson<GuildEvent[]>(LIVE_STORAGE_KEYS.GUILD_EVENTS, INITIAL_GUILD_EVENTS);
    return Array.isArray(saved) && saved.length > 0 ? saved : INITIAL_GUILD_EVENTS;
  });
  const [activeEventId, setActiveEventId] = useState<string>(() =>
    readLocalJson<string>(LIVE_STORAGE_KEYS.ACTIVE_EVENT_ID, INITIAL_GUILD_EVENTS[0].id)
  );
  const currentEvent = React.useMemo(
    () => guildEvents.find((e) => e.id === activeEventId) || guildEvents[0] || CURRENT_GUILD_EVENT,
    [guildEvents, activeEventId]
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(LEADERBOARD_DATA);

  // Firebase Auth & Cloud + Local Persisted State
  const [authUser, setAuthUser] = useState<{
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isAuthBusy, setIsAuthBusy] = useState<boolean>(false);
  const [isCloudProfileSynced, setIsCloudProfileSynced] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const pendingProfileSyncRef = React.useRef<{
    timer: ReturnType<typeof setTimeout> | null;
    uid: string;
    player: PlayerProfile;
    wallet: number;
  } | null>(null);

  const [walletBalance, setWalletBalance] = useState<number>(() =>
    readLocalJson<number>(LIVE_STORAGE_KEYS.WALLET_BALANCE, 1250)
  );
  const [localTransactions, setLocalTransactions] = useState<any[]>(() =>
    readLocalJson<any[]>(LIVE_STORAGE_KEYS.LOCAL_TXS, FINANCE_TRANSACTIONS)
  );
  const [cloudWalletTxs, setCloudWalletTxs] = useState<CloudWalletTx[]>([]);
  const [localBookings, setLocalBookings] = useState<CloudBookingRecord[]>(() =>
    readLocalJson<CloudBookingRecord[]>(LIVE_STORAGE_KEYS.LOCAL_BOOKINGS, [])
  );
  const [cloudBookingsRaw, setCloudBookings] = useState<CloudBookingRecord[]>([]);
  const [localSavedMatches, setLocalSavedMatches] = useState<CloudMatchRecord[]>(() =>
    readLocalJson<CloudMatchRecord[]>(LIVE_STORAGE_KEYS.LOCAL_MATCHES, [])
  );
  const [cloudMatchesRaw, setCloudMatches] = useState<CloudMatchRecord[]>([]);
  const [userCloudMatches, setUserCloudMatches] = useState<CloudMatchRecord[]>([]);
  const [userCloudBadges, setUserCloudBadges] = useState<Badge[]>([]);
  const [isProfileCloudLoading, setIsProfileCloudLoading] = useState<boolean>(false);
  const [profileSyncedAt, setProfileSyncedAt] = useState<number | null>(null);
  const [localFeedPosts, setLocalFeedPosts] = useState<CloudFeedPost[]>(() =>
    readLocalJson<CloudFeedPost[]>(LIVE_STORAGE_KEYS.LOCAL_FEED_POSTS, [])
  );
  const [cloudFeedPostsRaw, setCloudFeedPosts] = useState<CloudFeedPost[]>([]);
  const [cheeredCloudIds, setCheeredCloudIds] = useState<Record<string, boolean>>(() =>
    readLocalJson<Record<string, boolean>>(LIVE_STORAGE_KEYS.CHEERED_IDS, {})
  );
  const [vouchers, setVouchers] = useState<RedeemedVoucher[]>(() =>
    readLocalJson<RedeemedVoucher[]>(LIVE_STORAGE_KEYS.VOUCHERS, [])
  );
  const [bookmarkedCourtIds, setBookmarkedCourtIds] = useState<string[]>(() =>
    readLocalJson<string[]>(LIVE_STORAGE_KEYS.BOOKMARKS, ['court_3'])
  );

  // Merge cloud + local records transparently so every feature works both signed-in and signed-out
  const cloudBookings = React.useMemo(() => {
    const seen = new Set<string>();
    const combined: CloudBookingRecord[] = [];
    for (const item of [...cloudBookingsRaw, ...localBookings]) {
      const key = item.bookingRef || item.id;
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(item);
      }
    }
    return combined.sort((a, b) => b.createdAtMs - a.createdAtMs);
  }, [cloudBookingsRaw, localBookings]);

  const cloudMatches = React.useMemo(() => {
    const seen = new Set<string>();
    const combined: CloudMatchRecord[] = [];
    for (const item of [...cloudMatchesRaw, ...localSavedMatches]) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
    }
    return combined.sort((a, b) => b.createdAtMs - a.createdAtMs);
  }, [cloudMatchesRaw, localSavedMatches]);

  const cloudFeedPosts = React.useMemo(() => {
    const seen = new Set<string>();
    const combined: CloudFeedPost[] = [];
    for (const item of [...cloudFeedPostsRaw, ...localFeedPosts]) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
    }
    return combined.sort((a, b) => b.createdAtMs - a.createdAtMs);
  }, [cloudFeedPostsRaw, localFeedPosts]);

  // Keep a 30-second live clock so slot availability reflects real time of day
  React.useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Recompute real-time distanceKm (from userLocation) and remaining open slots today
  const activeCourts = React.useMemo(() => {
    const todayIso = getTodayIsoDate(liveClock);
    return rawCourts
      .map((court) => {
        const liveDistance =
          typeof court.latitude === 'number' && typeof court.longitude === 'number'
            ? calculateHaversineKm(userLocation, {
                lat: court.latitude,
                lng: court.longitude,
              })
            : court.distanceKm;

        const openHourCount = COURT_SLOT_HOURS.filter(
          (slot) => !isSlotElapsedToday(todayIso, slot.startHour, liveClock)
        ).length;

        const todaysBookingsForCourt = cloudBookings.filter(
          (b) => b.courtId === court.id && b.date === todayIso && b.status !== 'cancelled'
        ).length;

        return {
          ...court,
          distanceKm: liveDistance,
          slotsAvailableToday: Math.max(0, openHourCount - todaysBookingsForCourt),
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [rawCourts, userLocation, liveClock, cloudBookings]);

  const requestLiveLocation = React.useCallback((): Promise<UserGeoLocation | null> => {
    return new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
        setGpsPermissionState('unsupported');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const nextLoc: UserGeoLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracyM: Math.round(pos.coords.accuracy || 0),
            isLiveGps: true,
            updatedAtMs: Date.now(),
          };
          setUserLocation(nextLoc);
          setGpsPermissionState('granted');
          resolve(nextLoc);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setGpsPermissionState('denied');
          }
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 15000,
        }
      );
    });
  }, []);

  // Listen to browser geolocation permission changes & start live watch when already granted
  React.useEffect(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setGpsPermissionState('unsupported');
      return;
    }

    let watchId: number | null = null;
    const startWatch = () => {
      if (watchId !== null) return;
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracyM: Math.round(pos.coords.accuracy || 0),
            isLiveGps: true,
            updatedAtMs: Date.now(),
          });
          setGpsPermissionState('granted');
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setGpsPermissionState('denied');
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 20000,
          timeout: 10000,
        }
      );
    };

    if ('permissions' in navigator && navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((status) => {
          if (status.state === 'granted') {
            setGpsPermissionState('granted');
            startWatch();
          } else if (status.state === 'denied') {
            setGpsPermissionState('denied');
          }
        })
        .catch(() => {
          // Ignore permissions query errors on Safari/iOS
        });
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Wearable State (persisted to localStorage)
  const [wearableConnected, setWearableConnected] = useState<boolean>(false);
  const [claimedWearableIds, setClaimedWearableIds] = useState<string[]>(() =>
    readLocalJson<string[]>(LIVE_STORAGE_KEYS.WEARABLE_CLAIMED_IDS, [])
  );
  const [wearableMetrics, setWearableMetrics] = useState<{
    heartRateBpm: number;
    maxHeartRateBpm?: number;
    caloriesBurned: number;
    distanceKm: number;
    durationMin?: number;
    source?: string;
    activityName?: string;
    activityId?: string;
    syncedAtMs?: number;
    expConverted: boolean;
  }>(() =>
    readLocalJson(LIVE_STORAGE_KEYS.WEARABLE, {
      heartRateBpm: 164,
      maxHeartRateBpm: 182,
      caloriesBurned: 680,
      distanceKm: 3.42,
      durationMin: 60,
      source: 'Manual',
      expConverted: false,
    })
  );

  // Video Analysis State
  const [analyzedVideoResult, setAnalyzedVideoResult] = useState<any>(null);

  const SCREEN_ORDER: Record<ScreenId, number> = {
    HOME: 0,
    MAP: 1,
    CLUB_TOOLS: 2,
    FEED: 3,
    A1: 4, A2: 5,
    B1: 10, B2: 11, B3: 12, B4: 13,
    C1: 20, C2: 21, C3: 22, C4: 23,
    D1: 30, D2: 31, D3: 32,
    E1: 40, E2: 41, E3: 42, E4: 43,
    F1: 50, F2: 51, FINANCE: 52,
  };

  const syncTabForScreen = (screen: ScreenId) => {
    if (screen === 'HOME') {
      setActiveTabState('home');
    } else if (screen === 'MAP' || ['B1', 'B2', 'B3', 'B4'].includes(screen)) {
      setActiveTabState('discover');
    } else if (screen === 'CLUB_TOOLS' || ['E1', 'E2', 'E3', 'E4'].includes(screen)) {
      setActiveTabState('club');
    } else if (screen === 'FEED') {
      setActiveTabState('feed');
    } else if (screen === 'F1' || screen === 'F2' || screen === 'FINANCE' || ['D1', 'D2', 'D3'].includes(screen)) {
      setActiveTabState('profile');
    }
  };

  // Helpers
  const navigateTo = (screen: ScreenId, direction?: 'forward' | 'backward') => {
    playSelectSound();
    if (screen !== currentScreen) {
      const dir = direction || (SCREEN_ORDER[screen] < SCREEN_ORDER[currentScreen] ? 'backward' : 'forward');
      setNavDirection(dir);
      setHistoryStack((prev) => {
        if (screen === 'HOME') return ['HOME'];
        if (prev[prev.length - 1] === screen) return prev;
        return [...prev.slice(-15), screen];
      });
      setCurrentScreen(screen);
    }
    syncTabForScreen(screen);
  };

  const completeOnboarding = (targetScreen: ScreenId = 'HOME') => {
    playSelectSound();
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage quota errors
    }
    setHasCompletedOnboarding(true);
    setNavDirection('forward');
    setHistoryStack(targetScreen === 'HOME' ? ['HOME'] : ['HOME', targetScreen]);
    setCurrentScreen(targetScreen);
    syncTabForScreen(targetScreen);
  };

  const replayOnboarding = () => {
    playSelectSound();
    setNavDirection('backward');
    setHistoryStack(['A1']);
    setCurrentScreen('A1');
  };

  const getFallbackParentScreen = (screen: ScreenId): ScreenId => {
    if (['A2'].includes(screen)) return 'A1';
    if (['B2', 'B3', 'B4'].includes(screen)) return 'B1';
    if (['C2', 'C3', 'C4'].includes(screen)) return 'C1';
    if (['D2', 'D3'].includes(screen)) return 'D1';
    if (['E2', 'E3', 'E4'].includes(screen)) return 'E1';
    if (['F2', 'FINANCE'].includes(screen)) return 'F1';
    return 'HOME';
  };

  const goBack = () => {
    playSelectSound();
    let target: ScreenId = 'HOME';
    if (historyStack.length > 1) {
      target = historyStack[historyStack.length - 2];
      setHistoryStack((prev) => prev.slice(0, -1));
    } else {
      target = getFallbackParentScreen(currentScreen);
      setHistoryStack(target === 'HOME' ? ['HOME'] : ['HOME', target]);
    }
    setNavDirection('backward');
    setCurrentScreen(target);
    syncTabForScreen(target);
  };

  const setActiveTab = (tab: MainTab) => {
    let targetScreen: ScreenId = 'HOME';
    switch (tab) {
      case 'home':
        targetScreen = 'HOME';
        break;
      case 'club':
        targetScreen = 'CLUB_TOOLS';
        break;
      case 'discover':
        targetScreen = 'MAP';
        break;
      case 'feed':
        targetScreen = 'FEED';
        break;
      case 'profile':
        targetScreen = 'F1';
        break;
    }
    navigateTo(targetScreen);
  };

  // Firebase Auth listener & Firestore real-time subscriptions
  React.useEffect(() => {
    const unsubAuth = subscribeAuth(async (firebaseUser) => {
      if (!firebaseUser) {
        setAuthUser(null);
        setIsCloudProfileSynced(false);
        setIsProfileCloudLoading(false);
        setProfileSyncedAt(null);
        setCloudBookings([]);
        setCloudMatches([]);
        setUserCloudMatches([]);
        setUserCloudBadges([]);
        setCloudFeedPosts([]);
        setCloudWalletTxs([]);
        setIsAuthReady(true);
        return;
      }

      setIsProfileCloudLoading(true);
      setAuthUser({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      });

      try {
        const { profile, walletBalance: loadedWallet } = await ensureAndLoadUserProfile(
          firebaseUser,
          INITIAL_PLAYER
        );
        const seededBadges = await seedUserBadgesIfEmpty(firebaseUser.uid, INITIAL_PLAYER.badges);
        setPlayer((prev) => ({
          ...prev,
          ...profile,
          badges: seededBadges.length > 0 ? seededBadges : prev.badges,
        }));
        setUserCloudBadges(seededBadges);
        setWalletBalance(loadedWallet);
        setIsCloudProfileSynced(true);
        setProfileSyncedAt(Date.now());
      } catch (err) {
        console.error('Failed to sync user profile:', err);
        setIsProfileCloudLoading(false);
      } finally {
        setIsAuthReady(true);
      }
    });

    return () => unsubAuth();
  }, []);

  // Attach Firestore real-time listeners only when authenticated
  React.useEffect(() => {
    if (!isAuthReady || !authUser) return;

    const uid = authUser.uid;
    const unsubs: (() => void)[] = [];
    let profileLoaded = false;
    let badgesLoaded = false;
    let matchesLoaded = false;
    const checkProfileReady = () => {
      if (profileLoaded && badgesLoaded && matchesLoaded) {
        setIsProfileCloudLoading(false);
      }
    };

    unsubs.push(
      subscribeUserProfile(uid, INITIAL_PLAYER, ({ profile, walletBalance: liveWallet }) => {
        setPlayer((prev) => ({ ...prev, ...profile }));
        setWalletBalance(liveWallet);
        setIsCloudProfileSynced(true);
        setProfileSyncedAt(Date.now());
        profileLoaded = true;
        checkProfileReady();
      })
    );

    unsubs.push(
      subscribeUserBadges(uid, (badges) => {
        setUserCloudBadges(badges);
        if (badges.length > 0) {
          setPlayer((prev) => ({ ...prev, badges }));
        }
        setProfileSyncedAt(Date.now());
        badgesLoaded = true;
        checkProfileReady();
      })
    );

    unsubs.push(
      subscribeUserMatches(uid, (rows) => {
        setUserCloudMatches(rows);
        setProfileSyncedAt(Date.now());
        matchesLoaded = true;
        checkProfileReady();
      })
    );

    unsubs.push(
      subscribeUserBookings(uid, (rows) => {
        setCloudBookings(rows);
      })
    );

    unsubs.push(
      subscribePublicMatches((rows) => {
        setCloudMatches(rows);
      })
    );

    unsubs.push(
      subscribeCommunityFeed((posts) => {
        setCloudFeedPosts(posts);
      })
    );

    unsubs.push(
      subscribeWalletTransactions(uid, (txs) => {
        setCloudWalletTxs(txs);
      })
    );

    unsubs.push(
      subscribeCommunityLeaderboard((cloudUsers) => {
        if (cloudUsers.length === 0) return;
        const merged = [...cloudUsers];
        LEADERBOARD_DATA.forEach((mockUser) => {
          if (!merged.some((u) => u.id === mockUser.id || u.name === mockUser.name)) {
            merged.push(mockUser);
          }
        });
        merged.sort((a, b) => b.exp - a.exp);
        setLeaderboard(merged.map((u, idx) => ({ ...u, rank: idx + 1 })));
      })
    );

    unsubs.push(
      subscribeGuildAttendees(activeEventId, (cloudAttendees) => {
        if (cloudAttendees.length === 0) return;
        setGuildEvents((prevEvents) =>
          prevEvents.map((evt) => {
            if (evt.id !== activeEventId) return evt;
            const seedEvent = INITIAL_GUILD_EVENTS.find((e) => e.id === activeEventId) || evt;
            const base = seedEvent.attendees.filter(
              (a) => !cloudAttendees.some((ca) => ca.userId === a.id)
            );
            const mappedCloud = cloudAttendees.map((ca) => ({
              id: ca.userId,
              name: ca.name,
              avatar: '',
              tier: (ca.tier as PlayerTier) || 'Silver',
              ovr: ca.ovr,
              paid: ca.paid,
            }));
            return {
              ...evt,
              attendees: [...mappedCloud, ...base],
            };
          })
        );
      })
    );

    return () => {
      unsubs.forEach((fn) => fn());
    };
  }, [isAuthReady, authUser?.uid, activeEventId]);

  const signInWithGoogle = async (): Promise<boolean> => {
    setIsAuthBusy(true);
    setAuthError(null);
    const isThai = language === 'th';
    try {
      await signInWithGoogleAccount();
      playCoinSound();
      return true;
    } catch (err: any) {
      const code = String(err?.code || '');
      let msg = err?.message || (isThai ? 'การเข้าสู่ระบบด้วย Google ไม่สำเร็จ' : 'Google sign-in failed');

      if (code === 'auth/popup-blocked') {
        msg = isThai
          ? 'เบราว์เซอร์บล็อกหน้าต่างป๊อปอัป กรุณาอนุญาต Pop-up แล้วกดล็อกอินอีกครั้ง'
          : 'Popup was blocked by browser. Please allow pop-ups and try again.';
      } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        msg = isThai
          ? 'ยกเลิกหน้าต่างล็อกอิน Google สามารถกดเข้าสู่ระบบใหม่ได้ทุกเมื่อ'
          : 'Google sign-in window closed. Tap Sign In anytime to retry.';
      } else if (code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        msg = isThai
          ? `โดเมน "${host}" ยังไม่ได้รับอนุญาตใน Firebase Auth (ตั้งค่าใน Firebase Console -> Authorized domains)`
          : `Domain "${host}" is not authorized in Firebase Auth settings.`;
      }

      setAuthError(msg);
      showNotification({
        type: 'party_update',
        title: isThai ? 'ล็อกอิน Google ไม่สำเร็จ' : 'Google Sign-In Notice',
        message: msg,
        timeAgo: isThai ? 'เมื่อสักครู่' : 'Just now',
      });
      return false;
    } finally {
      setIsAuthBusy(false);
    }
  };

  const signOutAccount = async () => {
    setIsAuthBusy(true);
    try {
      if (pendingProfileSyncRef.current?.timer) {
        clearTimeout(pendingProfileSyncRef.current.timer);
        pendingProfileSyncRef.current = null;
      }
      await signOutAccountSession();
      setPlayer(INITIAL_PLAYER);
      setWalletBalance(readLocalJson<number>(LIVE_STORAGE_KEYS.WALLET_BALANCE, 1250));
      setLeaderboard(LEADERBOARD_DATA);
      playSelectSound();
    } finally {
      setIsAuthBusy(false);
    }
  };

  const mergedWalletTransactions = React.useMemo(() => {
    const mappedCloud = cloudWalletTxs.map((tx) => ({
      id: tx.id,
      title: tx.title,
      subtitle: tx.subtitle,
      amount: tx.amount,
      type: tx.type,
      date: language === 'th' ? 'ซิงค์บนคลาวด์แล้ว' : 'Cloud synced',
      category: tx.category,
      status: tx.status,
    }));
    const seen = new Set<string>();
    const combined: typeof mappedCloud = [];
    for (const item of [...mappedCloud, ...localTransactions]) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
    }
    return combined;
  }, [cloudWalletTxs, localTransactions, language]);

  const topUpWallet = async (amount: number) => {
    const nextBalance = walletBalance + amount;
    setWalletBalance(nextBalance);
    const title = language === 'th' ? 'เติมเงินผ่านพร้อมเพย์' : 'PromptPay QR Top-up';
    const subtitle = language === 'th' ? 'เติมเครดิตกระเป๋าเงินสำเร็จ' : 'SmashPay Wallet Credited';

    if (authUser) {
      await recordWalletTransactionInCloud(
        authUser.uid,
        {
          title,
          subtitle,
          amount,
          type: 'credit',
          category: 'wallet_topup',
        },
        nextBalance
      );
    } else {
      setLocalTransactions((prev) => [
        {
          id: `tx_${Date.now()}`,
          title,
          subtitle,
          amount,
          type: 'credit',
          date: language === 'th' ? 'เมื่อสักครู่' : 'Just now',
          category: 'wallet_topup',
          status: 'completed',
        },
        ...prev,
      ]);
    }
    playCoinSound();
    gainExp(
      50,
      language === 'th' ? `เติมเงิน ฿${amount} เข้ากระเป๋าเงิน` : `Topped up ฿${amount} to Wallet`
    );
  };

  const redeemPointsVoucher = (input: {
    costExp: number;
    titleTh: string;
    titleEn: string;
    discountAmount: number;
    target: 'court' | 'squad';
  }): { ok: boolean; voucher?: RedeemedVoucher } => {
    if (player.currentExp < input.costExp) {
      return { ok: false };
    }

    const voucher: RedeemedVoucher = {
      id: `vch_${Date.now()}`,
      code: `SMA-${Math.floor(1000 + Math.random() * 9000)}`,
      titleTh: input.titleTh,
      titleEn: input.titleEn,
      discountAmount: input.discountAmount,
      target: input.target,
      used: false,
      createdAtMs: Date.now(),
    };

    setPlayer((prev) => {
      const next = {
        ...prev,
        currentExp: Math.max(0, prev.currentExp - input.costExp),
      };
      if (authUser) {
        syncPlayerProfileToCloud(authUser.uid, next, walletBalance).catch((err) =>
          console.error('Sync redeemed points failed:', err)
        );
      }
      return next;
    });

    setVouchers((prev) => [voucher, ...prev]);
    playCoinSound();
    showNotification({
      type: 'reward_exp',
      title: language === 'th' ? 'แลกคูปองสำเร็จ!' : 'Voucher Redeemed!',
      message:
        language === 'th'
          ? `${input.titleTh} · โค้ด ${voucher.code} พร้อมใช้ทันทีในหน้าชำระเงิน`
          : `${input.titleEn} · Code ${voucher.code} is ready at checkout`,
      timeAgo: language === 'th' ? 'เมื่อสักครู่' : 'Just now',
    });

    return { ok: true, voucher };
  };

  const toggleBookmarkCourt = (courtId: string) => {
    playSelectSound();
    setBookmarkedCourtIds((prev) =>
      prev.includes(courtId) ? prev.filter((id) => id !== courtId) : [...prev, courtId]
    );
  };

  const saveBookingToCloud = async (
    paymentMethod: 'PromptPay' | 'SmashPay' | 'TrueMoney' = 'PromptPay',
    voucherId?: string
  ) => {
    const rawTotal = booking.totalAmount || 560;
    const activeVoucher = voucherId
      ? vouchers.find((v) => v.id === voucherId && !v.used && v.target === 'court')
      : undefined;
    const discount = activeVoucher ? Math.min(rawTotal, activeVoucher.discountAmount) : 0;
    const total = Math.max(0, rawTotal - discount);

    const slotsText =
      booking.selectedSlots.length > 0
        ? booking.selectedSlots.map((s) => `${s.startTime}-${s.endTime}`).join(', ')
        : '19:00-21:00';
    const refCode = booking.bookingRef || `BK-SMA-${Math.floor(1000 + Math.random() * 9000)}`;
    const bookingDate = booking.date || getTodayIsoDate();
    const courtNum = booking.selectedCourtNumber || 3;

    const nextBalance =
      paymentMethod === 'SmashPay' ? Math.max(0, walletBalance - total) : walletBalance;

    const txTitle =
      language === 'th'
        ? `ค่าจองคอร์ท ${selectedCourt.name}`
        : `Court Booking: ${selectedCourt.name}`;
    const txSub = `${paymentMethod} · ${refCode}${discount > 0 ? ` (-฿${discount})` : ''}`;

    if (authUser) {
      await createBookingInCloud(authUser.uid, {
        courtId: selectedCourt.id,
        courtName: selectedCourt.name,
        courtNumber: courtNum,
        date: bookingDate,
        slotsSummary: slotsText,
        totalAmount: total,
        paymentMethod,
        bookingRef: refCode,
      });

      await recordWalletTransactionInCloud(
        authUser.uid,
        {
          title: txTitle,
          subtitle: txSub,
          amount: -total,
          type: 'debit',
          category: 'court_booking',
        },
        nextBalance
      );

      if (paymentMethod === 'SmashPay') {
        setWalletBalance(nextBalance);
      }
    } else {
      if (paymentMethod === 'SmashPay') {
        setWalletBalance(nextBalance);
      }
      const localRecord: CloudBookingRecord = {
        id: `bk_local_${Date.now()}`,
        ownerId: player.id,
        courtId: selectedCourt.id,
        courtName: selectedCourt.name,
        courtNumber: courtNum,
        date: bookingDate,
        slotsSummary: slotsText,
        totalAmount: total,
        paymentMethod,
        bookingRef: refCode,
        status: 'confirmed',
        createdAtMs: Date.now(),
      };
      setLocalBookings((prev) => [localRecord, ...prev]);
      setLocalTransactions((prev) => [
        {
          id: `tx_bk_${Date.now()}`,
          title: txTitle,
          subtitle: txSub,
          amount: -total,
          type: 'debit',
          date: language === 'th' ? 'เมื่อสักครู่' : 'Just now',
          category: 'court_booking',
          status: 'completed',
        },
        ...prev,
      ]);
    }

    if (activeVoucher) {
      setVouchers((prev) =>
        prev.map((v) => (v.id === activeVoucher.id ? { ...v, used: true } : v))
      );
    }

    setBooking((prev) => ({
      ...prev,
      paymentMethod,
      bookingRef: refCode,
      discountAmount: discount,
      appliedVoucherId: activeVoucher?.id,
    }));
  };

  const cancelBooking = async (bookingId: string) => {
    const isCloudDoc = cloudBookingsRaw.some((b) => b.id === bookingId);
    if (authUser && isCloudDoc) {
      await updateBookingStatusInCloud(bookingId, 'cancelled');
    }
    setLocalBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
    playSelectSound();
    showNotification({
      type: 'court_booking',
      title: language === 'th' ? 'ยกเลิกการจองคอร์ทแล้ว' : 'Court Booking Cancelled',
      message:
        language === 'th'
          ? 'อัปเดตสถานะการจองและคืนสิทธิ์ช่วงเวลาคอร์ทเรียบร้อยแล้ว'
          : 'Booking status updated and court slot released.',
      timeAgo: language === 'th' ? 'เมื่อสักครู่' : 'Just now',
    });
  };

  const publishFeedPost = async (input: {
    type: 'match' | 'achievement' | 'milestone';
    guildName: string;
    headline: string;
    summary: string;
    scoreDisplay?: string;
  }) => {
    const uid = authUser?.uid || auth.currentUser?.uid;
    if (uid) {
      await createFeedPostInCloud(uid, player.name, input);
    } else {
      const localPost: CloudFeedPost = {
        id: `post_local_${Date.now()}`,
        authorId: player.id,
        authorName: player.name,
        type: input.type,
        guildName: input.guildName,
        headline: input.headline,
        summary: input.summary,
        scoreDisplay: input.scoreDisplay,
        cheersCount: 0,
        visibility: 'community',
        createdAtMs: Date.now(),
      };
      setLocalFeedPosts((prev) => [localPost, ...prev]);
    }
    gainExp(30, language === 'th' ? 'โพสต์อัปเดตลงฟีดก๊วน' : 'Published Badminton Feed update');
  };

  const toggleCloudFeedCheer = async (postId: string, guildName: string) => {
    const cloudPost = cloudFeedPostsRaw.find((p) => p.id === postId);
    const localPost = localFeedPosts.find((p) => p.id === postId);
    const optimisticNext = !Boolean(cheeredCloudIds[postId]);
    let actualCheered = optimisticNext;

    if (authUser && cloudPost) {
      actualCheered = await toggleFeedCheerInCloud(postId, authUser.uid, cloudPost.cheersCount);
    } else if (localPost) {
      setLocalFeedPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, cheersCount: Math.max(0, p.cheersCount + (optimisticNext ? 1 : -1)) }
            : p
        )
      );
    }

    setCheeredCloudIds((prev) => ({ ...prev, [postId]: actualCheered }));

    if (actualCheered) {
      playCoinSound();
      gainExp(
        10,
        language === 'th'
          ? `ส่งกำลังใจให้เพื่อนร่วมก๊วน (${guildName})`
          : `Cheered guild update (${guildName})`
      );
    } else {
      playSelectSound();
    }
  };

  const toggleDeviceFrame = () => {
    setIsDeviceFrameEnabled((prev) => !prev);
  };

  const scheduleProfileCloudSync = (uid: string, nextPlayer: PlayerProfile, nextWallet: number) => {
    if (pendingProfileSyncRef.current?.timer) {
      clearTimeout(pendingProfileSyncRef.current.timer);
    }
    const timer = setTimeout(() => {
      const pending = pendingProfileSyncRef.current;
      pendingProfileSyncRef.current = null;
      if (!pending) return;
      syncPlayerProfileToCloud(pending.uid, pending.player, pending.wallet).catch((err) =>
        console.error('Sync profile failed:', err)
      );
    }, 80);
    pendingProfileSyncRef.current = {
      timer,
      uid,
      player: nextPlayer,
      wallet: nextWallet,
    };
  };

  const updatePlayer = (updates: Partial<PlayerProfile>) => {
    setPlayer((prev) => {
      const normalizedUpdates: Partial<PlayerProfile> = { ...updates };
      if (typeof updates.name === 'string' && updates.name.trim()) {
        const cleanName = updates.name.trim().slice(0, 80);
        normalizedUpdates.name = cleanName;
        normalizedUpdates.nameTh = updates.nameTh ?? cleanName;
        normalizedUpdates.nameEn = updates.nameEn ?? cleanName;
      }
      if (updates.playstyle) {
        const localized = resolveLocalizedPlaystyle(updates.playstyle);
        normalizedUpdates.playstyle = localized.playstyle;
        normalizedUpdates.playstyleTh = updates.playstyleTh ?? localized.playstyleTh;
        normalizedUpdates.playstyleEn = updates.playstyleEn ?? localized.playstyleEn;
      }
      const next = { ...prev, ...normalizedUpdates };
      if (authUser) {
        scheduleProfileCloudSync(authUser.uid, next, walletBalance);
      }
      return next;
    });
  };

  const gainExp = (amount: number, source: string, badgeName?: string) => {
    setPlayer((prev) => {
      let newExp = prev.currentExp + amount;
      let newLevel = prev.level;
      let nextLevelExp = prev.nextLevelExp;

      if (newExp >= nextLevelExp) {
        newExp = newExp - nextLevelExp;
        newLevel += 1;
        nextLevelExp = Math.round(nextLevelExp * 1.25);
        playLevelUpSound();
      } else {
        playCoinSound();
      }

      setExpCelebration({
        amount,
        source,
        badgeUnlocked: badgeName,
        newLevel: newLevel !== prev.level ? newLevel : undefined,
      });

      const updated = {
        ...prev,
        level: newLevel,
        currentExp: newExp,
        nextLevelExp,
      };
      if (authUser) {
        scheduleProfileCloudSync(authUser.uid, updated, walletBalance);
      }
      return updated;
    });
  };

  const dismissExpCelebration = () => {
    playSelectSound();
    setExpCelebration(null);
  };

  const updateBooking = (updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const resetBooking = () => {
    setBooking({
      court: selectedCourt,
      selectedCourtNumber: 1,
      selectedSlots: [],
      date: getTodayIsoDate(),
      totalAmount: 0,
      paymentMethod: 'PromptPay',
      slipUploaded: false,
      bookingRef: `BK-SMA-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  const addScorePoint = (team: 'A' | 'B', shotType: any = 'Smash', errorReason?: any) => {
    playSmashSound();
    setMatch((prev) => {
      const nextScoreA = team === 'A' ? prev.scoreA + 1 : prev.scoreA;
      const nextScoreB = team === 'B' ? prev.scoreB + 1 : prev.scoreB;

      // Determine serving box (Badminton rule: even = right, odd = left)
      const servingScore = team === 'A' ? nextScoreA : nextScoreB;
      const nextBox = servingScore % 2 === 0 ? 'right' : 'left';

      const newShot: ShotLogItem = {
        id: `shot_${Date.now()}`,
        pointNumber: nextScoreA + nextScoreB,
        team,
        shotType: shotType || (team === 'A' ? 'Smash' : 'Drop'),
        errorReason,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        zone: team === 'A' ? 'mid-right' : 'front-left',
      };

      // Check set point (21 or deuce up to 30)
      let currentSetWonA = prev.setsWonA;
      let currentSetWonB = prev.setsWonB;
      let isSetOver = false;

      if (
        (nextScoreA >= 21 && nextScoreA - nextScoreB >= 2) ||
        nextScoreA === 30
      ) {
        currentSetWonA += 1;
        isSetOver = true;
      } else if (
        (nextScoreB >= 21 && nextScoreB - nextScoreA >= 2) ||
        nextScoreB === 30
      ) {
        currentSetWonB += 1;
        isSetOver = true;
      }

      if (isSetOver) {
        const past = [
          ...prev.pastSets,
          { set: prev.currentSet, scoreA: nextScoreA, scoreB: nextScoreB },
        ];
        const isMatchDone = currentSetWonA === 2 || currentSetWonB === 2;
        return {
          ...prev,
          scoreA: isMatchDone ? nextScoreA : 0,
          scoreB: isMatchDone ? nextScoreB : 0,
          setsWonA: currentSetWonA,
          setsWonB: currentSetWonB,
          currentSet: isMatchDone ? prev.currentSet : prev.currentSet + 1,
          pastSets: past,
          server: team,
          serviceBox: nextBox,
          shotHistory: [newShot, ...prev.shotHistory],
          isMatchFinished: isMatchDone,
          winner: isMatchDone ? (currentSetWonA === 2 ? 'A' : 'B') : undefined,
        };
      }

      return {
        ...prev,
        scoreA: nextScoreA,
        scoreB: nextScoreB,
        server: team,
        serviceBox: nextBox,
        shotHistory: [newShot, ...prev.shotHistory],
      };
    });
  };

  const undoLastPoint = () => {
    setMatch((prev) => {
      if (prev.shotHistory.length === 0) return prev;
      const lastShot = prev.shotHistory[0];
      const newHistory = prev.shotHistory.slice(1);
      const newScoreA = lastShot.team === 'A' ? Math.max(0, prev.scoreA - 1) : prev.scoreA;
      const newScoreB = lastShot.team === 'B' ? Math.max(0, prev.scoreB - 1) : prev.scoreB;

      return {
        ...prev,
        scoreA: newScoreA,
        scoreB: newScoreB,
        shotHistory: newHistory,
      };
    });
  };

  const advanceBadgesAfterMatch = async (params: {
    isDoubles: boolean;
    highestSmashKmh: number;
    setsCount: number;
  }): Promise<string | undefined> => {
    const isThai = language === 'th';
    const nowLabel = new Date().toLocaleDateString(isThai ? 'th-TH' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const sourceBadges = userCloudBadges.length > 0 ? userCloudBadges : player.badges;
    let newlyUnlockedTitle: string | undefined;
    const badgesToSync: Badge[] = [];

    const nextBadges = sourceBadges.map((badge) => {
      if (badge.unlocked) return badge;
      let increment = 0;
      if (badge.id === 'b_early_bird') {
        increment = 1;
      } else if (badge.id === 'b_fair_play' && params.isDoubles) {
        increment = 1;
      } else if (badge.id === 'b_iron_lung' && params.setsCount >= 3) {
        increment = 1;
      } else if (badge.id === 'b_smash_king' && params.highestSmashKmh >= 330) {
        increment = 5;
      }
      if (increment <= 0) return badge;

      const nextProgress = Math.min(badge.maxProgress, badge.progress + increment);
      const justUnlocked = nextProgress >= badge.maxProgress;
      if (justUnlocked && !newlyUnlockedTitle) {
        newlyUnlockedTitle = isThai ? badge.thaiName : badge.name;
      }
      const updated: Badge = {
        ...badge,
        progress: nextProgress,
        unlocked: justUnlocked,
        unlockedAt: justUnlocked ? nowLabel : badge.unlockedAt,
      };
      badgesToSync.push(updated);
      return updated;
    });

    if (badgesToSync.length > 0) {
      setPlayer((prev) => ({ ...prev, badges: nextBadges }));
      if (authUser) {
        await Promise.all(
          badgesToSync.map((b) =>
            upsertUserBadgeInCloud(authUser.uid, b).catch((err) =>
              console.error('Failed to sync badge progress:', err)
            )
          )
        );
      }
    }

    return newlyUnlockedTitle;
  };

  const logHistoricalMatch = async (input: LogHistoricalMatchInput): Promise<boolean> => {
    const isThai = language === 'th';
    const validSets = input.sets.filter((s) => s.scoreA > 0 || s.scoreB > 0);
    const setsToUse = validSets.length > 0 ? validSets : [{ scoreA: 21, scoreB: 18 }, { scoreA: 21, scoreB: 16 }];

    let setsWonA = 0;
    let setsWonB = 0;
    setsToUse.forEach((s) => {
      if (s.scoreA >= s.scoreB) setsWonA += 1;
      else setsWonB += 1;
    });
    const isWin = setsWonA >= setsWonB;
    const finalScore = `${setsWonA} - ${setsWonB}`;
    const setSummary = setsToUse.map((s) => `${s.scoreA}-${s.scoreB}`).join(' · ');
    const expGained = isWin ? 180 : 90;
    const cleanDuration = Math.max(10, Math.min(240, Math.round(input.durationMin || 35)));
    const cleanSmash = Math.max(150, Math.min(500, Math.round(input.highestSmashKmh || 320)));
    const teamAName = input.isDoubles && input.partnerName?.trim()
      ? `${player.name.split(' ')[0]} & ${input.partnerName.trim()}`
      : player.name;
    const teamBName = input.opponentName.trim() || (isThai ? 'คู่แข่งในสนาม' : 'Court Opponent');
    const courtLabel = input.courtName.trim() || selectedCourt.name;
    const highlightLabel =
      input.highlightShot.trim() || (isThai ? 'ลูกตบสแมชปิดเกม' : 'Match-Point Smash');

    // Update career stats immediately
    setPlayer((prev) => {
      const nextMatches = prev.stats.totalMatches + 1;
      const prevWins = Math.round((prev.stats.winRate / 100) * prev.stats.totalMatches);
      const nextWinRate = Number((((prevWins + (isWin ? 1 : 0)) / nextMatches) * 100).toFixed(1));
      const nextBestSmash = Math.max(prev.stats.highestSmashSpeedKmh, cleanSmash);
      const nextHours = Number((prev.stats.totalPlayHours + cleanDuration / 60).toFixed(1));
      const updated = {
        ...prev,
        stats: {
          ...prev.stats,
          totalMatches: nextMatches,
          winRate: nextWinRate,
          highestSmashSpeedKmh: nextBestSmash,
          totalPlayHours: nextHours,
          totalSmashes: prev.stats.totalSmashes + 6,
        },
      };
      if (authUser) {
        scheduleProfileCloudSync(authUser.uid, updated, walletBalance);
      }
      return updated;
    });

    if (authUser) {
      await saveMatchInCloud(authUser.uid, {
        playerAName: teamAName,
        playerBName: teamBName,
        isDoubles: input.isDoubles,
        finalScore,
        setSummary,
        result: isWin ? 'win' : 'loss',
        courtName: courtLabel,
        highestSmashKmh: cleanSmash,
        durationMin: cleanDuration,
        expGained,
        highlightShot: highlightLabel,
        isPublic: input.isPublic !== false,
      });
    } else {
      const localRecord: CloudMatchRecord = {
        id: `match_local_${Date.now()}`,
        ownerId: player.id,
        playerAName: teamAName,
        playerBName: teamBName,
        isDoubles: input.isDoubles,
        finalScore,
        setSummary,
        result: isWin ? 'win' : 'loss',
        courtName: courtLabel,
        highestSmashKmh: cleanSmash,
        durationMin: cleanDuration,
        expGained,
        highlightShot: highlightLabel,
        isPublic: input.isPublic !== false,
        createdAtMs: Date.now(),
      };
      setLocalSavedMatches((prev) => [localRecord, ...prev]);
    }

    const unlockedBadgeName = await advanceBadgesAfterMatch({
      isDoubles: input.isDoubles,
      highestSmashKmh: cleanSmash,
      setsCount: setsToUse.length,
    });

    gainExp(
      expGained,
      isThai
        ? `บันทึกแมตช์ ${isWin ? 'ชนะ' : 'แพ้'} ${teamBName} (${finalScore})`
        : `Logged ${isWin ? 'Win' : 'Loss'} vs ${teamBName} (${finalScore})`,
      unlockedBadgeName
    );
    return true;
  };

  const deleteHistoricalMatch = async (matchId: string): Promise<void> => {
    const isCloudOwned = userCloudMatches.some((m) => m.id === matchId);
    if (authUser && isCloudOwned) {
      await deleteMatchInCloud(matchId);
    }
    setLocalSavedMatches((prev) => prev.filter((m) => m.id !== matchId));
    playSelectSound();
  };

  const finishMatch = () => {
    const isThai = language === 'th';
    const winnerSide: 'A' | 'B' =
      match.setsWonA !== match.setsWonB
        ? match.setsWonA > match.setsWonB
          ? 'A'
          : 'B'
        : match.scoreA >= match.scoreB
          ? 'A'
          : 'B';
    const isWin = winnerSide === 'A';
    const allSets =
      match.isMatchFinished && match.pastSets.length > 0
        ? match.pastSets
        : [...match.pastSets, { set: match.currentSet, scoreA: match.scoreA, scoreB: match.scoreB }];
    const setSummary = allSets.map((s) => `${s.scoreA}-${s.scoreB}`).join(' · ');
    const finalSetsA = match.isMatchFinished ? match.setsWonA : match.setsWonA + (isWin ? 1 : 0);
    const finalSetsB = match.isMatchFinished ? match.setsWonB : match.setsWonB + (!isWin ? 1 : 0);
    const finalScore = `${finalSetsA} - ${finalSetsB}`;
    const smashesLogged = match.shotHistory.filter((s) => s.team === 'A' && s.shotType === 'Smash').length;
    const matchDurationMin = Math.max(12, Math.round(allSets.length * 18));
    const peakSmash = player.stats.highestSmashSpeedKmh || 342;

    setMatch((prev) => ({
      ...prev,
      isMatchFinished: true,
      winner: winnerSide,
    }));

    // Update career stats immediately
    setPlayer((prev) => {
      const nextMatches = prev.stats.totalMatches + 1;
      const prevWins = Math.round((prev.stats.winRate / 100) * prev.stats.totalMatches);
      const nextWinRate = Number((((prevWins + (isWin ? 1 : 0)) / nextMatches) * 100).toFixed(1));
      return {
        ...prev,
        stats: {
          ...prev.stats,
          totalMatches: nextMatches,
          winRate: nextWinRate,
          totalSmashes: prev.stats.totalSmashes + Math.max(1, smashesLogged),
          totalPlayHours: Number((prev.stats.totalPlayHours + matchDurationMin / 60).toFixed(1)),
        },
      };
    });

    const matchRecord: CloudMatchRecord = {
      id: `match_local_${Date.now()}`,
      ownerId: authUser?.uid || player.id,
      playerAName: match.playerAName,
      playerBName: match.playerBName,
      isDoubles: match.isDoubles,
      finalScore,
      setSummary,
      result: isWin ? 'win' : 'loss',
      courtName: selectedCourt.name,
      highestSmashKmh: peakSmash,
      durationMin: matchDurationMin,
      expGained: 350,
      highlightShot: isThai ? 'ลูกตบสแมชปิดแมตช์' : 'Match-Point Smash Winner',
      isPublic: true,
      createdAtMs: Date.now(),
    };
    setLocalSavedMatches((prev) => [matchRecord, ...prev]);

    if (authUser) {
      saveMatchInCloud(authUser.uid, {
        playerAName: matchRecord.playerAName,
        playerBName: matchRecord.playerBName,
        isDoubles: matchRecord.isDoubles,
        finalScore: matchRecord.finalScore,
        setSummary: matchRecord.setSummary,
        result: matchRecord.result,
        courtName: matchRecord.courtName,
        highestSmashKmh: matchRecord.highestSmashKmh,
        durationMin: matchRecord.durationMin,
        expGained: matchRecord.expGained,
        highlightShot: matchRecord.highlightShot,
        isPublic: true,
      }).catch((err) => console.error('Failed to save match to cloud:', err));
    }

    advanceBadgesAfterMatch({
      isDoubles: match.isDoubles,
      highestSmashKmh: peakSmash,
      setsCount: allSets.length,
    }).catch((err) => console.error('Failed to advance badges:', err));

    gainExp(
      350,
      isThai ? 'จบการแข่งขันแมตช์เต็ม' : 'Match Finished',
      isThai ? 'ราชาลูกตบ ขั้น 2' : 'Smash King Tier II'
    );
    navigateTo('C2');
  };

  const startNewMatch = (options?: { playerAName?: string; playerBName?: string; isDoubles?: boolean }) => {
    setMatch({
      playerAName: options?.playerAName || 'กานต์ & โอห์ม',
      playerBName: options?.playerBName || 'อาร์ท & ท็อป',
      isDoubles: options?.isDoubles ?? true,
      scoreA: 0,
      scoreB: 0,
      setsWonA: 0,
      setsWonB: 0,
      currentSet: 1,
      pastSets: [],
      server: 'A',
      serviceBox: 'right',
      shotHistory: [],
      isMatchFinished: false,
    });
    navigateTo('C1');
  };

  const claimQuestReward = (questId: string) => {
    const q = quests.find((item) => item.id === questId);
    if (!q || q.claimed || q.current < q.target) return;

    setQuests((prev) =>
      prev.map((item) => (item.id === questId ? { ...item, claimed: true } : item))
    );
    const isThai = language === 'th';
    gainExp(
      q.expReward,
      isThai ? `สำเร็จภารกิจ: ${q.thaiTitle}` : `Quest Completed: ${q.title}`
    );
  };

  const completeDrill = (drillId: string) => {
    const d = drills.find((item) => item.id === drillId);
    if (!d || d.completed) return;

    setDrills((prev) =>
      prev.map((item) => (item.id === drillId ? { ...item, completed: true } : item))
    );
    setDrillStreakDates((prev) => recordDrillCompletedForToday(prev));
    const isThai = language === 'th';
    gainExp(
      d.expReward,
      isThai ? `สำเร็จการซ้อม: ${d.thaiTitle}` : `Drill Completed: ${d.title}`
    );
  };

  const addCustomDrill = (drillInput: Omit<AIDrill, 'id' | 'completed'>): AIDrill => {
    const existing = drills.find(
      (d) => d.thaiTitle === drillInput.thaiTitle || d.title === drillInput.title
    );
    if (existing) {
      playSelectSound();
      return existing;
    }
    const created: AIDrill = {
      ...drillInput,
      id: `drill_ai_${Date.now()}`,
      completed: false,
    };
    setDrills((prev) => [created, ...prev]);
    playCoinSound();
    return created;
  };

  const selectGuildEvent = (eventId: string) => {
    const exists = guildEvents.some((e) => e.id === eventId);
    if (exists) {
      setActiveEventId(eventId);
    }
  };

  const createGuild = (input: {
    name: string;
    tag: string;
    homeCourt: string;
    regularDays: string;
    maxMembers: number;
  }): GuildGroup => {
    const newId = `guild_${Date.now()}`;
    const newGuild: GuildGroup = {
      id: newId,
      name: input.name.trim(),
      tag: input.tag.trim() || 'กรุงเทพฯ',
      level: 1,
      memberCount: 1,
      maxMembers: Math.max(4, Math.min(60, input.maxMembers || 16)),
      regularDays: input.regularDays.trim() || 'ศุกร์ (19:00-22:00)',
      homeCourt: input.homeCourt.trim() || selectedCourt.name,
      guildPerks: ['หารค่าคอร์ทอัตโนมัติ', 'จับคู่สมดุลด้วย AI'],
      avatarColor: '#004d2c',
    };
    setGuilds((prev) => [newGuild, ...prev]);
    setMyGuildIds((prev) => (prev.includes(newId) ? prev : [newId, ...prev]));

    const starterEvent: GuildEvent = {
      id: `evt_${Date.now()}`,
      guildId: newId,
      title: `${newGuild.name} · นัดเปิดก๊วน`,
      courtName: `${newGuild.homeCourt} · คอร์ท 1–2`,
      date: language === 'th' ? 'ศุกร์นี้' : 'This Friday',
      timeRange: '19:00 - 22:00 น.',
      courtFeeTotal: 960,
      shuttlecockFeeTotal: 320,
      maxPlayers: Math.min(12, newGuild.maxMembers),
      attendees: [
        {
          id: authUser?.uid || player.id,
          name: player.name,
          avatar: player.avatarUrl,
          tier: player.tier,
          ovr: computeOvr(player.skillRadar),
          paid: true,
          isHost: true,
        },
      ],
      waitlist: [],
    };
    setGuildEvents((prev) => [starterEvent, ...prev]);
    setActiveEventId(starterEvent.id);
    playCoinSound();
    gainExp(100, language === 'th' ? `สร้างก๊วนใหม่: ${newGuild.name}` : `Created Squad: ${newGuild.name}`);
    return newGuild;
  };

  const joinGuild = (guildId: string) => {
    setMyGuildIds((prev) => {
      if (prev.includes(guildId)) return prev;
      setGuilds((gs) =>
        gs.map((g) =>
          g.id === guildId ? { ...g, memberCount: Math.min(g.maxMembers, g.memberCount + 1) } : g
        )
      );
      return [...prev, guildId];
    });
    const linkedEvent = guildEvents.find((e) => e.guildId === guildId);
    if (linkedEvent) {
      setActiveEventId(linkedEvent.id);
    }
    playSelectSound();
  };

  const toggleEventRsvp = (userId: string) => {
    const targetEvent = currentEvent;
    const isAlreadyAttending = targetEvent.attendees.some((a) => a.id === userId);

    setGuildEvents((prevEvents) =>
      prevEvents.map((evt) => {
        if (evt.id !== targetEvent.id) return evt;
        if (isAlreadyAttending) {
          return {
            ...evt,
            attendees: evt.attendees.filter((a) => a.id !== userId),
          };
        }
        const newAttendee = {
          id: userId,
          name: player.name,
          avatar: player.avatarUrl,
          tier: player.tier,
          ovr: computeOvr(player.skillRadar),
          paid: false,
        };
        return {
          ...evt,
          attendees: [...evt.attendees, newAttendee],
        };
      })
    );

    if (authUser) {
      toggleGuildRsvpInCloud(
        targetEvent.id,
        authUser.uid,
        player,
        {
          title: targetEvent.title,
          date: targetEvent.date,
          timeRange: targetEvent.timeRange,
          courtName: targetEvent.courtName,
          courtFeeTotal: targetEvent.courtFeeTotal,
          shuttlecockFeeTotal: targetEvent.shuttlecockFeeTotal,
          maxPlayers: targetEvent.maxPlayers,
        },
        isAlreadyAttending
      ).catch((err) => console.error('Failed to sync guild RSVP:', err));
    }
  };

  const payEventShare = async (
    eventId?: string
  ): Promise<{
    ok: boolean;
    reason?: 'insufficient_funds' | 'already_paid' | 'not_attending';
    amountPaid?: number;
  }> => {
    const target = eventId
      ? guildEvents.find((e) => e.id === eventId) || currentEvent
      : currentEvent;
    const myId = authUser?.uid || player.id;
    const attendee = target.attendees.find((a) => a.id === myId || a.id === player.id);

    if (!attendee) return { ok: false, reason: 'not_attending' };
    if (attendee.paid) return { ok: false, reason: 'already_paid' };

    const totalCost = target.courtFeeTotal + target.shuttlecockFeeTotal;
    const rawShare = Math.ceil(totalCost / Math.max(1, target.attendees.length));

    // Auto-apply unused squad voucher if available
    const squadVoucher = vouchers.find((v) => !v.used && v.target === 'squad');
    const netShare = Math.max(0, rawShare - (squadVoucher ? squadVoucher.discountAmount : 0));

    if (walletBalance < netShare) {
      return { ok: false, reason: 'insufficient_funds' };
    }

    const nextBalance = walletBalance - netShare;
    setWalletBalance(nextBalance);

    if (squadVoucher) {
      setVouchers((prev) =>
        prev.map((v) => (v.id === squadVoucher.id ? { ...v, used: true } : v))
      );
    }

    setGuildEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt.id !== target.id
          ? evt
          : {
              ...evt,
              attendees: evt.attendees.map((a) =>
                a.id === attendee.id ? { ...a, paid: true } : a
              ),
            }
      )
    );

    const txTitle =
      language === 'th' ? `จ่ายค่าก๊วน ${target.title}` : `Squad Split: ${target.title}`;
    const txSub = `${target.courtName} · SmashPay`;

    if (authUser) {
      await Promise.all([
        markGuildAttendeePaidInCloud(target.id, authUser.uid, true).catch((err) =>
          console.error('Failed to mark attendee paid:', err)
        ),
        recordWalletTransactionInCloud(
          authUser.uid,
          {
            title: txTitle,
            subtitle: txSub,
            amount: -netShare,
            type: 'debit',
            category: 'split_bill',
          },
          nextBalance
        ).catch((err) => console.error('Failed to record split tx:', err)),
      ]);
    } else {
      setLocalTransactions((prev) => [
        {
          id: `tx_split_${Date.now()}`,
          title: txTitle,
          subtitle: txSub,
          amount: -netShare,
          type: 'debit',
          date: language === 'th' ? 'เมื่อสักครู่' : 'Just now',
          category: 'split_bill',
          status: 'completed',
        },
        ...prev,
      ]);
    }

    playCoinSound();
    gainExp(
      40,
      language === 'th' ? `ชำระส่วนแบ่งก๊วน ${target.title} ตรงเวลา` : `Paid squad split on time`
    );
    return { ok: true, amountPaid: netShare };
  };

  const updateEventBudget = (
    eventId: string,
    courtFeeTotal: number,
    shuttlecockFeeTotal: number
  ) => {
    setGuildEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt.id === eventId
          ? {
              ...evt,
              courtFeeTotal: Math.max(0, Math.round(courtFeeTotal)),
              shuttlecockFeeTotal: Math.max(0, Math.round(shuttlecockFeeTotal)),
            }
          : evt
      )
    );
    playSelectSound();
  };

  const convertCaloriesToExp = () => {
    if (wearableMetrics.expConverted) return;
    const bonusExp = Math.max(10, Math.round(wearableMetrics.caloriesBurned / 2));
    setWearableMetrics((prev) => ({ ...prev, expConverted: true }));
    if (wearableMetrics.activityId) {
      setClaimedWearableIds((prev) => {
        const next = prev.includes(wearableMetrics.activityId!)
          ? prev
          : [...prev.slice(-100), wearableMetrics.activityId!];
        writeLocalJson(LIVE_STORAGE_KEYS.WEARABLE_CLAIMED_IDS, next);
        return next;
      });
    }
    const isThai = language === 'th';
    const sourceTag = wearableMetrics.source ? ` · ${wearableMetrics.source}` : '';
    gainExp(
      bonusExp,
      isThai
        ? `ซิงค์สุขภาพ${sourceTag} (เผาผลาญ ${wearableMetrics.caloriesBurned} แคลอรี่)`
        : `Workout Sync${sourceTag} (${wearableMetrics.caloriesBurned} kcal burned)`
    );
  };

  const logWearableWorkout = (metrics: {
    heartRateBpm: number;
    maxHeartRateBpm?: number;
    caloriesBurned: number;
    distanceKm: number;
    durationMin?: number;
    source?: string;
    activityName?: string;
    activityId?: string;
  }) => {
    const safeAvgHr = Math.max(60, Math.min(220, Math.round(metrics.heartRateBpm)));
    const safeMaxHr = metrics.maxHeartRateBpm
      ? Math.max(safeAvgHr, Math.min(230, Math.round(metrics.maxHeartRateBpm)))
      : Math.min(220, safeAvgHr + 18);
    const alreadyClaimed = Boolean(
      metrics.activityId && claimedWearableIds.includes(metrics.activityId)
    );

    setWearableMetrics({
      heartRateBpm: safeAvgHr,
      maxHeartRateBpm: safeMaxHr,
      caloriesBurned: Math.max(20, Math.min(4000, Math.round(metrics.caloriesBurned))),
      distanceKm: Math.max(0.1, Math.min(100, Number(metrics.distanceKm.toFixed(2)))),
      durationMin: metrics.durationMin ? Math.max(1, Math.round(metrics.durationMin)) : undefined,
      source: metrics.source || 'Manual',
      activityName: metrics.activityName,
      activityId: metrics.activityId,
      syncedAtMs: Date.now(),
      expConverted: alreadyClaimed,
    });
    playSelectSound();
  };

  // Centralized Notification State
  const [currentNotification, setCurrentNotification] = useState<AppNotification | null>(null);

  const dismissNotification = React.useCallback(() => {
    setCurrentNotification(null);
  }, []);

  const showNotification = (notif: Omit<AppNotification, 'id'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    setCurrentNotification(newNotif);
    if (notif.type === 'match_invite') {
      playSmashSound();
    } else if (notif.type === 'court_booking' || notif.type === 'reward_exp') {
      playCoinSound();
    } else {
      playSelectSound();
    }
  };

  const triggerSampleInvite = () => {
    const isThai = language === 'th';
    showNotification({
      type: 'match_invite',
      title: isThai ? 'คำชวนดวลแมตช์ใหม่!' : 'New Match Invite!',
      message: isThai
        ? 'โค้ชอาร์ท (ระดับไดมอนด์) ท้าแข่งประเภทคู่ 21:00 น. ที่คอร์ท 3'
        : 'Coach Art (Diamond Rank) invited you to a doubles match at 21:00 on Court 3',
      timeAgo: isThai ? 'สดตอนนี้' : 'Just now',
      targetScreen: 'C1',
      metadata: {
        inviterName: isThai ? 'โค้ชอาร์ท' : 'Coach Art',
        inviterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        inviterTier: isThai ? 'ไดมอนด์' : 'DIAMOND',
        matchTime: isThai ? '21:00 น.' : '21:00',
      },
      actions: {
        primaryLabel: isThai ? 'ตอบรับคำท้า' : 'Accept Challenge',
        secondaryLabel: isThai ? 'ขอผ่านก่อน' : 'Decline',
        primaryAction: () => {
          navigateTo('C1');
          gainExp(50, isThai ? 'ตอบรับการแข่งขันสปาร์ริ่ง' : 'Accepted sparring challenge');
        },
      },
    });
  };

  const triggerSampleBookingConfirmation = () => {
    const isThai = language === 'th';
    showNotification({
      type: 'court_booking',
      title: isThai ? 'ยืนยันการจองคอร์ทสำเร็จ!' : 'Court Booking Confirmed!',
      message: isThai
        ? 'สนามแบดอินฟินิตี้ ลาดพร้าว · คอร์ท 3 วันนี้ 19:00 - 21:00 น.'
        : 'Infinity Badminton Ladprao · Court 3 Today 19:00 - 21:00',
      timeAgo: isThai ? 'เมื่อสักครู่' : 'Just now',
      targetScreen: 'B4',
      metadata: {
        courtName: isThai ? 'สนามแบดอินฟินิตี้ ลาดพร้าว' : 'Infinity Badminton Ladprao',
        courtNumber: 3,
        matchTime: '19:00 - 21:00',
      },
      actions: {
        primaryLabel: isThai ? 'ดูตั๋วการจอง' : 'View Pass',
        secondaryLabel: isThai ? 'ปิด' : 'Dismiss',
        primaryAction: () => {
          navigateTo('B4');
        },
      },
    });
  };

  const triggerSampleCountdownAlert = () => {
    const isThai = language === 'th';
    showNotification({
      type: 'match_countdown',
      title: isThai ? 'คอร์ทของคุณพร้อมแล้ว!' : 'Your Court is Ready!',
      message: isThai
        ? 'อีก 15 นาทีจะเริ่มแมตช์ที่ คอร์ท 3 · ระบบแอร์เปิดแล้ว 24°C'
        : '15 minutes until match starts at Court 3 · AC is set to 24°C',
      timeAgo: isThai ? 'สดตอนนี้' : 'Just now',
      targetScreen: 'C1',
      metadata: {
        countdownMinutes: 15,
        courtNumber: 3,
      },
      actions: {
        primaryLabel: isThai ? 'เข้าห้องแมตช์' : 'Enter Match Room',
        secondaryLabel: isThai ? 'รับทราบ' : 'Got it',
        primaryAction: () => {
          navigateTo('C1');
        },
      },
    });
  };

  const triggerSamplePartyUpdate = () => {
    const isThai = language === 'th';
    showNotification({
      type: 'party_update',
      title: isThai ? 'ก๊วนแบดคืนวันพุธ อัปเดต!' : 'Wednesday Badminton Party Update!',
      message: isThai
        ? 'มีสมาชิกใหม่ 2 คนเข้าร่วมก๊วน รวมเป็น 29/30 คน (เหลือ 1 ที่สุดท้าย!)'
        : '2 new players joined the party, now 29/30 players (1 spot left!)',
      timeAgo: isThai ? '1 นาทีที่แล้ว' : '1 min ago',
      targetScreen: 'E2',
      actions: {
        primaryLabel: isThai ? 'ดูก๊วนและชำระเงิน' : 'View Party & Pay',
        secondaryLabel: isThai ? 'ปิด' : 'Dismiss',
        primaryAction: () => {
          navigateTo('E2');
        },
      },
    });
  };

  // Persist Player, Live Match & Selected Court whenever updated
  React.useEffect(() => {
    const now = Date.now();
    const pending = !isOnline;
    writeCache<PlayerMatchCacheData>(CACHE_KEYS.PLAYER_MATCH, {
      player,
      match,
      selectedCourtId: selectedCourt.id,
      lastSyncedAt: now,
      pendingSync: pending,
    });
    if (pending) {
      setHasPendingSync(true);
    } else {
      setLastSyncedAt(now);
    }
  }, [player, match, selectedCourt.id, isOnline]);

  // Persist Quests & Drills whenever updated
  React.useEffect(() => {
    const existing = readCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS);
    const now = Date.now();
    const pending = !isOnline;
    writeCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS, {
      quests,
      drills,
      activeTab: existing?.activeTab || 'quests',
      lastSyncedAt: now,
      pendingSync: pending,
    });
    if (pending) {
      setHasPendingSync(true);
    } else {
      setLastSyncedAt(now);
    }
  }, [quests, drills, isOnline]);

  // Persist Court Map dataset whenever online or courts change
  React.useEffect(() => {
    const existing = readCache<CourtMapCacheData>(CACHE_KEYS.COURT_MAP);
    const now = Date.now();
    writeCache<CourtMapCacheData>(CACHE_KEYS.COURT_MAP, {
      courts,
      selectedCourtId: existing?.selectedCourtId || selectedCourt.id,
      activeFilter: existing?.activeFilter ?? null,
      searchQuery: existing?.searchQuery ?? '',
      onlyBookable: existing?.onlyBookable ?? false,
      showPricePerHour: existing?.showPricePerHour ?? true,
      sheetState: existing?.sheetState ?? 'peek',
      pan: existing?.pan ?? { x: 0, y: 0 },
      zoom: existing?.zoom ?? 1.05,
      lastSyncedAt: isOnline ? now : (existing?.lastSyncedAt || now),
    });
  }, [courts, selectedCourt.id, isOnline]);

  // Auto-clear pending sync flag when connection is restored
  React.useEffect(() => {
    if (!isOnline) return;
    const now = Date.now();
    const existingQuests = readCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS);
    if (existingQuests?.pendingSync) {
      writeCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS, {
        ...existingQuests,
        lastSyncedAt: now,
        pendingSync: false,
      });
    }
    const existingMatch = readCache<PlayerMatchCacheData>(CACHE_KEYS.PLAYER_MATCH);
    if (existingMatch?.pendingSync) {
      writeCache<PlayerMatchCacheData>(CACHE_KEYS.PLAYER_MATCH, {
        ...existingMatch,
        lastSyncedAt: now,
        pendingSync: false,
      });
    }
    setHasPendingSync(false);
    setLastSyncedAt(now);
  }, [isOnline]);

  const refreshOfflineCache = () => {
    const now = Date.now();
    if (isOnline) {
      setCourts(COURTS_DATA);
    }
    const existingMap = readCache<CourtMapCacheData>(CACHE_KEYS.COURT_MAP);
    writeCache<CourtMapCacheData>(CACHE_KEYS.COURT_MAP, {
      courts: isOnline ? COURTS_DATA : courts,
      selectedCourtId: existingMap?.selectedCourtId || selectedCourt.id,
      activeFilter: existingMap?.activeFilter ?? null,
      searchQuery: existingMap?.searchQuery ?? '',
      onlyBookable: existingMap?.onlyBookable ?? false,
      showPricePerHour: existingMap?.showPricePerHour ?? true,
      sheetState: existingMap?.sheetState ?? 'peek',
      pan: existingMap?.pan ?? { x: 0, y: 0 },
      zoom: existingMap?.zoom ?? 1.05,
      lastSyncedAt: now,
    });
    const existingQuests = readCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS);
    writeCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS, {
      quests,
      drills,
      activeTab: existingQuests?.activeTab || 'quests',
      lastSyncedAt: now,
      pendingSync: !isOnline,
    });
    writeCache<PlayerMatchCacheData>(CACHE_KEYS.PLAYER_MATCH, {
      player,
      match,
      selectedCourtId: selectedCourt.id,
      lastSyncedAt: now,
      pendingSync: !isOnline,
    });
    setLastSyncedAt(now);
    if (isOnline) {
      setHasPendingSync(false);
    }
  };

  // Persist live local state to localStorage so everything survives page reloads even when signed out
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.WALLET_BALANCE, walletBalance);
  }, [walletBalance]);
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.LOCAL_TXS, localTransactions);
  }, [localTransactions]);
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.LOCAL_BOOKINGS, localBookings);
  }, [localBookings]);
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.LOCAL_MATCHES, localSavedMatches);
  }, [localSavedMatches]);
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.LOCAL_FEED_POSTS, localFeedPosts);
  }, [localFeedPosts]);
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.GUILDS, guilds);
  }, [guilds]);
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.MY_GUILD_IDS, myGuildIds);
  }, [myGuildIds]);
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.GUILD_EVENTS, guildEvents);
  }, [guildEvents]);
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.ACTIVE_EVENT_ID, activeEventId);
  }, [activeEventId]);
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.WEARABLE, wearableMetrics);
  }, [wearableMetrics]);
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.VOUCHERS, vouchers);
  }, [vouchers]);
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.BOOKMARKS, bookmarkedCourtIds);
  }, [bookmarkedCourtIds]);
  React.useEffect(() => {
    writeLocalJson(LIVE_STORAGE_KEYS.CHEERED_IDS, cheeredCloudIds);
  }, [cheeredCloudIds]);

  const resetOfflineCache = () => {
    clearAllOfflineCaches();
    Object.values(LIVE_STORAGE_KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        // Ignore storage errors
      }
    });
    setPlayer(INITIAL_PLAYER);
    setCourts(COURTS_DATA);
    setSelectedCourt(COURTS_DATA[0]);
    setQuests(INITIAL_QUESTS);
    setDrills(AI_DRILLS);
    setGuilds(GUILDS_DATA);
    setMyGuildIds(['guild_rama9']);
    setGuildEvents(INITIAL_GUILD_EVENTS);
    setActiveEventId(INITIAL_GUILD_EVENTS[0].id);
    setWalletBalance(1250);
    setLocalTransactions(FINANCE_TRANSACTIONS);
    setLocalBookings([]);
    setLocalSavedMatches([]);
    setLocalFeedPosts([]);
    setVouchers([]);
    setBookmarkedCourtIds(['court_3']);
    setWearableMetrics({
      heartRateBpm: 164,
      caloriesBurned: 680,
      distanceKm: 3.42,
      expConverted: false,
    });
    setDrillStreakDates(persistDrillStreakDates(seedDefaultStreakDates()));
    setHasPendingSync(false);
    setLastSyncedAt(Date.now());
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentScreen,
        navigateTo,
        goBack,
        navDirection,
        hasCompletedOnboarding,
        completeOnboarding,
        replayOnboarding,
        activeTab,
        setActiveTab,
        isDeviceFrameEnabled,
        toggleDeviceFrame,
        viewMode,
        setViewMode,
        userLocation,
        gpsPermissionState,
        requestLiveLocation,
        player: activePlayer,
        updatePlayer,
        gainExp,
        expCelebration,
        dismissExpCelebration,
        courts: activeCourts,
        selectedCourt,
        setSelectedCourt,
        bookmarkedCourtIds,
        toggleBookmarkCourt,
        dataMode,
        setDataMode,
        booking,
        updateBooking,
        resetBooking,
        match,
        addScorePoint,
        undoLastPoint,
        finishMatch,
        startNewMatch,
        quests,
        claimQuestReward,
        drills,
        completeDrill,
        addCustomDrill,
        drillStreak,
        guilds,
        myGuildIds,
        guildEvents,
        activeEventId,
        selectGuildEvent,
        createGuild,
        joinGuild,
        currentEvent,
        toggleEventRsvp,
        payEventShare,
        updateEventBudget,
        leaderboard,
        wearableConnected,
        setWearableConnected,
        wearableMetrics,
        convertCaloriesToExp,
        logWearableWorkout,
        analyzedVideoResult,
        setAnalyzedVideoResult,
        theme,
        toggleTheme,
        sparringModalPlayer,
        setSparringModalPlayer,
        isSoundEnabled,
        toggleSound,
        isCrtEnabled,
        toggleCrt,
        isScreenLoading,
        setIsScreenLoading,
        simulateDataFetch,
        currentNotification,
        showNotification,
        dismissNotification,
        triggerSampleInvite,
        triggerSampleBookingConfirmation,
        triggerSampleCountdownAlert,
        triggerSamplePartyUpdate,
        isOnline,
        justReconnected,
        hasPendingSync,
        lastSyncedAt,
        refreshOfflineCache,
        resetOfflineCache,
        authUser,
        isAuthReady,
        isAuthBusy,
        isCloudProfileSynced,
        authError,
        signInWithGoogle,
        signOutAccount,
        walletBalance,
        walletTransactions: mergedWalletTransactions,
        vouchers,
        redeemPointsVoucher,
        topUpWallet,
        cloudBookings,
        saveBookingToCloud,
        cancelBooking,
        cloudMatches,
        userCloudMatches,
        userCloudBadges,
        isProfileCloudLoading,
        profileSyncedAt,
        logHistoricalMatch,
        deleteHistoricalMatch,
        cloudFeedPosts,
        publishFeedPost,
        cheeredCloudIds,
        toggleCloudFeedCheer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
