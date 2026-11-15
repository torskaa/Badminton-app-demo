import { LeaderboardUser, PlayerProfile, PlayerTier, SkillRadar } from '../types';
import { DoodlePresetId } from '../components/common/DoodleAvatar';

export type MatchMode = 'balanced' | 'weakness' | 'challenge';

export type SkillAxis = keyof SkillRadar;

export interface OpponentCandidate {
  id: string;
  name: string;
  nameEn: string;
  tier: PlayerTier;
  playstyle: PlayerProfile['playstyle'];
  playstyleTh: string;
  role: string;
  roleTh: string;
  dominantHand: 'Right' | 'Left';
  homeCourt: string;
  winRate: number;
  totalGames: number;
  skillRadar: SkillRadar;
  ovr: number;
  avatarPreset?: DoodlePresetId;
}

export interface AxisComparison {
  axis: SkillAxis;
  labelTh: string;
  labelEn: string;
  playerVal: number;
  opponentVal: number;
  delta: number;
}

export interface OpponentSuggestion {
  candidate: OpponentCandidate;
  matchScore: number; // 0-99 compatibility %
  ovrDiff: number; // opponentOvr - playerOvr
  playerWinProb: number;
  opponentWinProb: number;
  reasonTh: string;
  reasonEn: string;
  highlightTagTh: string;
  highlightTagEn: string;
  comparisonAxes: AxisComparison[];
}

export interface DoublesPlayerSlot {
  id: string;
  name: string;
  nameEn: string;
  ovr: number;
  tier: PlayerTier;
  role: string;
  isUser?: boolean;
  isLockedRival?: boolean;
}

export interface BalancedPairing {
  id: string;
  teamA: [DoublesPlayerSlot, DoublesPlayerSlot];
  teamB: [DoublesPlayerSlot, DoublesPlayerSlot];
  teamAOvr: number;
  teamBOvr: number;
  winProbA: number;
  winProbB: number;
  balancePercent: number;
  balanceLabelTh: string;
  balanceLabelEn: string;
}

const TIER_RANK: Record<PlayerTier, number> = {
  Bronze: 1,
  Silver: 2,
  Gold: 3,
  Diamond: 4,
  Pro: 5,
};

const TIER_TH: Record<PlayerTier, string> = {
  Bronze: 'บรอนซ์',
  Silver: 'ซิลเวอร์',
  Gold: 'โกลด์',
  Diamond: 'ไดมอนด์',
  Pro: 'โปร',
};

const AXIS_LABELS: Record<SkillAxis, { th: string; en: string }> = {
  power: { th: 'พลังตบ', en: 'Power' },
  speed: { th: 'ความเร็ว', en: 'Speed' },
  control: { th: 'คุมลูก', en: 'Control' },
  stamina: { th: 'ความอึด', en: 'Stamina' },
  tactics: { th: 'แท็กติก', en: 'Tactics' },
};

const GOAL_TO_AXIS: Record<PlayerProfile['primaryGoal'], SkillAxis> = {
  'Smash Mastery': 'power',
  'Lightning Footwork': 'speed',
  'Tactical Net Play': 'control',
  Endurance: 'stamina',
};

const BASE_CANDIDATE_POOL: OpponentCandidate[] = [
  {
    id: 'usr_ohm',
    name: 'โอห์ม ปืนกล',
    nameEn: 'Ohm Machinegun',
    tier: 'Diamond',
    playstyle: 'Attacking Smash Hunter',
    playstyleTh: 'สายตบเร็วสวนกลับ',
    role: 'Attacker',
    roleTh: 'มือตบจังหวะเร็ว',
    dominantHand: 'Right',
    homeCourt: 'Winner Arena พระราม 9',
    winRate: 66.0,
    totalGames: 112,
    skillRadar: { power: 86, speed: 85, control: 79, stamina: 83, tactics: 87 },
    ovr: 84,
    avatarPreset: 'ohm',
  },
  {
    id: 'usr_art',
    name: 'อาร์ท สปีดโบ๊ท',
    nameEn: 'Art Speedboat',
    tier: 'Diamond',
    playstyle: 'All-Rounder',
    playstyleTh: 'สายสปีดคอร์ทคุมเกม',
    role: 'All-Rounder',
    roleTh: 'ตัวเดินเกมสปีดสูง',
    dominantHand: 'Left',
    homeCourt: 'Winner Arena พระราม 9',
    winRate: 74.2,
    totalGames: 148,
    skillRadar: { power: 85, speed: 91, control: 84, stamina: 86, tactics: 88 },
    ovr: 87,
    avatarPreset: 'art',
  },
  {
    id: 'usr_ploy',
    name: 'พลอย จอมหยอด',
    nameEn: 'Ploy Netdrop',
    tier: 'Gold',
    playstyle: 'Net Control Wizard',
    playstyleTh: 'จอมเวทคุมหน้าเน็ต',
    role: 'Net Frontcourt',
    roleTh: 'มือหน้าคุมจังหวะเน็ต',
    dominantHand: 'Right',
    homeCourt: '71 Sport Club เอกมัย',
    winRate: 59.8,
    totalGames: 92,
    skillRadar: { power: 72, speed: 82, control: 90, stamina: 78, tactics: 86 },
    ovr: 82,
    avatarPreset: 'ploy',
  },
  {
    id: 'usr_bank',
    name: 'แบงค์ กำแพงเหล็ก',
    nameEn: 'Bank Ironwall',
    tier: 'Gold',
    playstyle: 'Defensive Wall',
    playstyleTh: 'สายรับเหนียวแน่น',
    role: 'Defender',
    roleTh: 'ตัวรับบล็อกลูกตบ',
    dominantHand: 'Right',
    homeCourt: 'สนามแบดอินฟินิตี้',
    winRate: 61.2,
    totalGames: 85,
    skillRadar: { power: 76, speed: 79, control: 83, stamina: 89, tactics: 84 },
    ovr: 82,
    avatarPreset: 'bank',
  },
  {
    id: 'usr_top',
    name: 'ท็อป ดรายฟ์สายฟ้า',
    nameEn: 'Top Thunderdrive',
    tier: 'Gold',
    playstyle: 'Attacking Smash Hunter',
    playstyleTh: 'สายดรายฟ์เร็วกลางคอร์ท',
    role: 'Drive Specialist',
    roleTh: 'ตัวตัดเกมกลางคอร์ท',
    dominantHand: 'Left',
    homeCourt: 'Sport Refresh ลำลูกกา',
    winRate: 63.4,
    totalGames: 98,
    skillRadar: { power: 84, speed: 86, control: 80, stamina: 80, tactics: 81 },
    ovr: 82,
    avatarPreset: 'top',
  },
  {
    id: 'usr_nan',
    name: 'แนนซี่ โปรดีเฟนส์',
    nameEn: 'Nancy ProGuard',
    tier: 'Pro',
    playstyle: 'Defensive Wall',
    playstyleTh: 'สายรับโต้กลับระดับโปร',
    role: 'Counter Specialist',
    roleTh: 'สายรับสวนคมระดับโปร',
    dominantHand: 'Right',
    homeCourt: 'Winner Arena พระราม 9',
    winRate: 77.5,
    totalGames: 164,
    skillRadar: { power: 84, speed: 89, control: 91, stamina: 90, tactics: 92 },
    ovr: 89,
  },
  {
    id: 'usr_mean',
    name: 'มีน แบ็กแฮนด์เทวะ',
    nameEn: 'Mean Backhand',
    tier: 'Silver',
    playstyle: 'Net Control Wizard',
    playstyleTh: 'สายวางมุมคุมเกม',
    role: 'Control Player',
    roleTh: 'ตัววางลูกแม่นยำ',
    dominantHand: 'Right',
    homeCourt: '71 Sport Club เอกมัย',
    winRate: 54.0,
    totalGames: 64,
    skillRadar: { power: 71, speed: 77, control: 84, stamina: 76, tactics: 80 },
    ovr: 78,
    avatarPreset: 'meen',
  },
  {
    id: 'usr_nut',
    name: 'นัท เสิร์ฟพิฆาต',
    nameEn: 'Nut FlickAce',
    tier: 'Silver',
    playstyle: 'All-Rounder',
    playstyleTh: 'สายเสิร์ฟสั้นชิงจังหวะ',
    role: 'Flick Server',
    roleTh: 'ตัวเสิร์ฟเปิดเกม',
    dominantHand: 'Right',
    homeCourt: 'สนามแบดอินฟินิตี้',
    winRate: 51.5,
    totalGames: 58,
    skillRadar: { power: 74, speed: 78, control: 77, stamina: 75, tactics: 76 },
    ovr: 76,
    avatarPreset: 'nat',
  },
];

export function computeSkillOvr(radar: SkillRadar): number {
  const sum = radar.power + radar.speed + radar.control + radar.stamina + radar.tactics;
  return Math.round(sum / 5);
}

export function detectWeakestAxis(radar: SkillRadar): SkillAxis {
  const axes: SkillAxis[] = ['power', 'speed', 'control', 'stamina', 'tactics'];
  return axes.reduce((lowest, axis) => (radar[axis] < radar[lowest] ? axis : lowest), 'power');
}

export function computeWinProbability(playerOvr: number, opponentOvr: number): number {
  const diff = opponentOvr - playerOvr;
  const prob = Math.round((1 / (1 + Math.pow(10, diff / 16))) * 100);
  return Math.max(18, Math.min(82, prob));
}

function mergeCandidatePool(
  player: PlayerProfile,
  leaderboard: LeaderboardUser[]
): OpponentCandidate[] {
  const lbMap = new Map(leaderboard.map((u) => [u.id, u]));
  return BASE_CANDIDATE_POOL.filter((c) => c.id !== player.id).map((candidate) => {
    const lbUser = lbMap.get(candidate.id);
    const radarOvr = computeSkillOvr(candidate.skillRadar);
    return {
      ...candidate,
      winRate: lbUser?.winRate ?? candidate.winRate,
      totalGames: lbUser?.totalGames ?? candidate.totalGames,
      ovr: lbUser?.ovr ?? radarOvr,
    };
  });
}

export function getAxisLabel(axis: SkillAxis, lang: 'th' | 'en'): string {
  return AXIS_LABELS[axis][lang];
}

export function suggestOpponents(
  player: PlayerProfile,
  leaderboard: LeaderboardUser[],
  mode: MatchMode
): OpponentSuggestion[] {
  const playerOvr = computeSkillOvr(player.skillRadar);
  const playerTierRank = TIER_RANK[player.tier];
  const weakestAxis = detectWeakestAxis(player.skillRadar);
  const goalAxis = GOAL_TO_AXIS[player.primaryGoal];
  const candidates = mergeCandidatePool(player, leaderboard);

  const scored = candidates.map((candidate) => {
    const oppOvr = candidate.ovr;
    const ovrDiff = oppOvr - playerOvr;
    const absOvrDiff = Math.abs(ovrDiff);
    const tierGap = Math.abs(TIER_RANK[candidate.tier] - playerTierRank);

    // 5-axis similarity (0..100)
    const axes: SkillAxis[] = ['power', 'speed', 'control', 'stamina', 'tactics'];
    const totalAxisDist = axes.reduce(
      (acc, ax) => acc + Math.abs(player.skillRadar[ax] - candidate.skillRadar[ax]),
      0
    );
    const radarSimilarity = Math.max(0, 100 - totalAxisDist / 2.2);

    let score = 0;
    let reasonTh = '';
    let reasonEn = '';
    let highlightTagTh = '';
    let highlightTagEn = '';

    if (mode === 'balanced') {
      // Closest OVR parity + tier closeness + style contrast bonus
      const ovrFit = Math.max(0, 100 - absOvrDiff * 6.5);
      const tierFit = Math.max(0, 100 - tierGap * 16);
      const styleDiversity = candidate.playstyle !== player.playstyle ? 6 : 2;
      score = Math.round(ovrFit * 0.56 + tierFit * 0.24 + radarSimilarity * 0.14 + styleDiversity);

      if (absOvrDiff <= 1) {
        highlightTagTh = 'สูสี 50/50';
        highlightTagEn = '50/50 Rival';
        reasonTh = `พลังรวมใกล้กัน (ต่างกัน ${absOvrDiff} แต้ม) · ระดับ${TIER_TH[candidate.tier]}`;
        reasonEn = `Near-identical skill rating (${absOvrDiff} OVR gap) for a close ${candidate.tier}-tier battle.`;
      } else if (candidate.playstyle !== player.playstyle) {
        highlightTagTh = 'ต่างสไตล์สมดุล';
        highlightTagEn = 'Style Contrast';
        reasonTh = `สาย${candidate.playstyleTh}ที่พลังใกล้เคียง ช่วยฝึกแก้เกม`;
        reasonEn = `${candidate.playstyle} matchup with similar OVR to test tactical adaptability.`;
      } else {
        highlightTagTh = 'คู่แข่งระดับเดียวกัน';
        highlightTagEn = 'Peer Match';
        reasonTh = `ระดับ${TIER_TH[candidate.tier]}ใกล้เคียงกัน · อัตราชนะ ${candidate.winRate}%`;
        reasonEn = `Matched ${candidate.tier}-tier peer with ${candidate.winRate}% win rate.`;
      }
    } else if (mode === 'weakness') {
      // Target opponent strong in player's weakest axis & training goal without overwhelming OVR gap
      const targetAxisScore = candidate.skillRadar[weakestAxis];
      const goalAxisScore = candidate.skillRadar[goalAxis];
      const edgeOverPlayer = Math.max(0, targetAxisScore - player.skillRadar[weakestAxis]);
      const reasonableGap = Math.max(0, 100 - Math.max(0, absOvrDiff - 3) * 8);
      score = Math.round(
        targetAxisScore * 0.45 +
          Math.min(18, edgeOverPlayer * 1.4) +
          goalAxisScore * 0.2 +
          reasonableGap * 0.2
      );

      const weakTh = AXIS_LABELS[weakestAxis].th;
      const weakEn = AXIS_LABELS[weakestAxis].en;
      highlightTagTh = `ฝึก${weakTh}`;
      highlightTagEn = `Trains ${weakEn}`;
      reasonTh = `คู่แข่งเด่น${weakTh} (${targetAxisScore}) ช่วยลับจุดอ่อนของคุณ (${player.skillRadar[weakestAxis]})`;
      reasonEn = `Strong in ${weakEn} (${targetAxisScore}) — ideal sparring partner to sharpen your ${player.skillRadar[weakestAxis]} ${weakEn}.`;
    } else {
      // 'challenge': favor +1 to +6 OVR stronger rivals or +1 tier up
      const desiredGain = ovrDiff >= 1 && ovrDiff <= 6 ? 98 - Math.abs(ovrDiff - 3) * 5 : Math.max(30, 82 - Math.abs(ovrDiff - 3) * 8);
      const winRateBoost = Math.min(20, Math.round((candidate.winRate - 50) * 0.7));
      score = Math.round(desiredGain * 0.75 + radarSimilarity * 0.15 + winRateBoost);

      highlightTagTh = ovrDiff > 0 ? `+${ovrDiff} แต้มท้าชน` : 'สายแข็งประจำสนาม';
      highlightTagEn = ovrDiff > 0 ? `+${ovrDiff} OVR Boss` : 'Top Rival';
      reasonTh =
        ovrDiff > 0
          ? `แกร่งกว่าคุณ +${ovrDiff} แต้ม (ชนะ ${candidate.winRate}%) เหมาะซ้อมไต่ระดับ`
          : `เรตชนะสูง ${candidate.winRate}% · สปีดและแท็กติกดุดันเหมาะซ้อมไต่ระดับ`;
      reasonEn =
        ovrDiff > 0
          ? `Rated +${ovrDiff} OVR higher (${candidate.winRate}% WR) — tough benchmark to push your rank.`
          : `High ${candidate.winRate}% win rate rival to sharpen high-tempo match pressure.`;
    }

    const clampedScore = Math.max(58, Math.min(99, score));
    const playerWinProb = computeWinProbability(playerOvr, oppOvr);
    const opponentWinProb = 100 - playerWinProb;

    // Pick top 2 most informative axes (player's weakest axis + opponent's highest delta axis)
    const comparisonAxes: AxisComparison[] = axes
      .map((axis) => ({
        axis,
        labelTh: AXIS_LABELS[axis].th,
        labelEn: AXIS_LABELS[axis].en,
        playerVal: player.skillRadar[axis],
        opponentVal: candidate.skillRadar[axis],
        delta: candidate.skillRadar[axis] - player.skillRadar[axis],
      }))
      .sort((a, b) => {
        if (a.axis === weakestAxis && mode === 'weakness') return -1;
        if (b.axis === weakestAxis && mode === 'weakness') return 1;
        return Math.abs(b.delta) - Math.abs(a.delta);
      })
      .slice(0, 2);

    return {
      candidate,
      matchScore: clampedScore,
      ovrDiff,
      playerWinProb,
      opponentWinProb,
      reasonTh,
      reasonEn,
      highlightTagTh,
      highlightTagEn,
      comparisonAxes,
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

export function generateBalancedPairings(
  player: PlayerProfile,
  suggestions: OpponentSuggestion[],
  lockedOpponentId?: string | null
): BalancedPairing[] {
  const playerOvr = computeSkillOvr(player.skillRadar);
  const userSlot: DoublesPlayerSlot = {
    id: player.id,
    name: `${player.nameTh || player.name} (คุณ)`,
    nameEn: `${player.nameEn || player.name} (You)`,
    ovr: playerOvr,
    tier: player.tier,
    role: player.playstyleTh || player.playstyle,
    isUser: true,
  };

  const poolSlots: DoublesPlayerSlot[] = suggestions.slice(0, 6).map((s) => ({
    id: s.candidate.id,
    name: s.candidate.name,
    nameEn: s.candidate.nameEn,
    ovr: s.candidate.ovr,
    tier: s.candidate.tier,
    role: s.candidate.roleTh,
    isLockedRival: s.candidate.id === lockedOpponentId,
  }));

  if (poolSlots.length < 3) return [];

  const combinations: BalancedPairing[] = [];

  for (let i = 0; i < poolSlots.length; i++) {
    const partner = poolSlots[i];
    if (lockedOpponentId && partner.id === lockedOpponentId) continue;

    for (let j = 0; j < poolSlots.length; j++) {
      if (j === i) continue;
      for (let k = j + 1; k < poolSlots.length; k++) {
        if (k === i) continue;
        const opp1 = poolSlots[j];
        const opp2 = poolSlots[k];

        if (lockedOpponentId && opp1.id !== lockedOpponentId && opp2.id !== lockedOpponentId) {
          continue;
        }

        const teamAOvr = Number(((userSlot.ovr + partner.ovr) / 2).toFixed(1));
        const teamBOvr = Number(((opp1.ovr + opp2.ovr) / 2).toFixed(1));
        const diff = Math.abs(teamAOvr - teamBOvr);
        const winProbA = computeWinProbability(teamAOvr, teamBOvr);
        const winProbB = 100 - winProbA;
        const balancePercent = Math.max(70, Math.round(100 - diff * 4));

        const orderedOpps: [DoublesPlayerSlot, DoublesPlayerSlot] =
          opp2.id === lockedOpponentId ? [opp2, opp1] : [opp1, opp2];

        combinations.push({
          id: `${partner.id}_${orderedOpps[0].id}_${orderedOpps[1].id}`,
          teamA: [userSlot, partner],
          teamB: orderedOpps,
          teamAOvr,
          teamBOvr,
          winProbA,
          winProbB,
          balancePercent,
          balanceLabelTh:
            diff <= 0.5
              ? `${balancePercent}% สมดุล 50/50 สมบูรณ์แบบ`
              : `${balancePercent}% สูสีแข่งขันสนุก`,
          balanceLabelEn:
            diff <= 0.5
              ? `${balancePercent}% PERFECT 50/50 MATCH`
              : `${balancePercent}% HIGHLY COMPETITIVE`,
        });
      }
    }
  }

  return combinations
    .sort((a, b) => Math.abs(a.teamAOvr - a.teamBOvr) - Math.abs(b.teamAOvr - b.teamBOvr))
    .slice(0, 6);
}
