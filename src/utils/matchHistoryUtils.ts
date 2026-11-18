import { CloudMatchRecord } from '../services/firebaseService';

export interface ParsedSetScore {
  set: number;
  userScore: number;
  opponentScore: number;
}

export interface HistoricalMatchSummaryStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  singlesMatches: number;
  singlesWins: number;
  singlesWinRate: number;
  doublesMatches: number;
  doublesWins: number;
  doublesWinRate: number;
  peakSmashKmh: number;
  avgSmashKmh: number;
  totalDurationMin: number;
  totalExpGained: number;
  avgPointsFor: number;
  avgPointsAgainst: number;
  currentStreak: { type: 'win' | 'loss' | 'none'; count: number };
  trendSeries: {
    id: string;
    label: string;
    opponent: string;
    smashKmh: number;
    expGained: number;
    result: 'win' | 'loss';
    score: string;
  }[];
}

export function parseSetSummary(setSummary?: string, finalScore?: string): ParsedSetScore[] {
  if (setSummary && setSummary.trim()) {
    const tokens = setSummary
      .split(/[·,;/|]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const parsed: ParsedSetScore[] = [];
    tokens.forEach((token) => {
      const match = token.match(/^(\d{1,2})\s*[-:]\s*(\d{1,2})$/);
      if (match) {
        parsed.push({
          set: parsed.length + 1,
          userScore: Number(match[1]),
          opponentScore: Number(match[2]),
        });
      }
    });
    if (parsed.length > 0) return parsed;
  }

  // Fallback derived cleanly from finalScore if setSummary was omitted
  const scoreMatch = (finalScore || '').match(/(\d+)\s*[-:]\s*(\d+)/);
  if (scoreMatch) {
    const setsA = Math.min(3, Number(scoreMatch[1]));
    const setsB = Math.min(3, Number(scoreMatch[2]));
    const fallbackSets: ParsedSetScore[] = [];
    let wA = 0;
    let wB = 0;
    while (wA < setsA || wB < setsB) {
      if (wA < setsA) {
        fallbackSets.push({ set: fallbackSets.length + 1, userScore: 21, opponentScore: 17 });
        wA += 1;
      }
      if (wB < setsB) {
        fallbackSets.push({ set: fallbackSets.length + 1, userScore: 17, opponentScore: 21 });
        wB += 1;
      }
    }
    if (fallbackSets.length > 0) return fallbackSets;
  }

  return [];
}

export function formatMatchTimestamp(ms: number, isThai: boolean): string {
  if (!Number.isFinite(ms) || ms <= 0) {
    return isThai ? 'บันทึกลงคลาวด์แล้ว' : 'Saved in Firebase';
  }
  const d = new Date(ms);
  const datePart = d.toLocaleDateString(isThai ? 'th-TH' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timePart = d.toLocaleTimeString(isThai ? 'th-TH' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !isThai,
  });
  return isThai ? `${datePart} · ${timePart} น.` : `${datePart} · ${timePart}`;
}

export function computeHistoricalMatchStats(
  matches: CloudMatchRecord[]
): HistoricalMatchSummaryStats {
  const totalMatches = matches.length;
  if (totalMatches === 0) {
    return {
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      singlesMatches: 0,
      singlesWins: 0,
      singlesWinRate: 0,
      doublesMatches: 0,
      doublesWins: 0,
      doublesWinRate: 0,
      peakSmashKmh: 0,
      avgSmashKmh: 0,
      totalDurationMin: 0,
      totalExpGained: 0,
      avgPointsFor: 0,
      avgPointsAgainst: 0,
      currentStreak: { type: 'none', count: 0 },
      trendSeries: [],
    };
  }

  let wins = 0;
  let singlesMatches = 0;
  let singlesWins = 0;
  let doublesMatches = 0;
  let doublesWins = 0;
  let peakSmashKmh = 0;
  let smashSum = 0;
  let smashCount = 0;
  let totalDurationMin = 0;
  let totalExpGained = 0;
  let totalPointsFor = 0;
  let totalPointsAgainst = 0;
  let matchesWithPoints = 0;

  for (const m of matches) {
    const isWin = m.result === 'win';
    if (isWin) wins += 1;
    if (m.isDoubles) {
      doublesMatches += 1;
      if (isWin) doublesWins += 1;
    } else {
      singlesMatches += 1;
      if (isWin) singlesWins += 1;
    }
    if (m.highestSmashKmh > 0) {
      peakSmashKmh = Math.max(peakSmashKmh, m.highestSmashKmh);
      smashSum += m.highestSmashKmh;
      smashCount += 1;
    }
    totalDurationMin += Math.max(0, m.durationMin || 0);
    totalExpGained += Math.max(0, m.expGained || 0);

    const parsedSets = parseSetSummary(m.setSummary, m.finalScore);
    if (parsedSets.length > 0) {
      matchesWithPoints += 1;
      totalPointsFor += parsedSets.reduce((acc, s) => acc + s.userScore, 0);
      totalPointsAgainst += parsedSets.reduce((acc, s) => acc + s.opponentScore, 0);
    }
  }

  // Current streak (matches are sorted newest first)
  const firstResult = matches[0].result;
  let streakCount = 0;
  for (const m of matches) {
    if (m.result === firstResult) streakCount += 1;
    else break;
  }

  // Chronological trend series (up to latest 8 matches, oldest -> newest)
  const recentChronological = [...matches.slice(0, 8)].reverse();
  const trendSeries = recentChronological.map((m, idx) => {
    const shortDate = m.createdAtMs
      ? new Date(m.createdAtMs).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
      : `M${idx + 1}`;
    return {
      id: m.id,
      label: shortDate,
      opponent: m.playerBName,
      smashKmh: m.highestSmashKmh || 0,
      expGained: m.expGained || 0,
      result: m.result,
      score: m.finalScore,
    };
  });

  const losses = totalMatches - wins;
  return {
    totalMatches,
    wins,
    losses,
    winRate: Math.round((wins / totalMatches) * 100),
    singlesMatches,
    singlesWins,
    singlesWinRate: singlesMatches > 0 ? Math.round((singlesWins / singlesMatches) * 100) : 0,
    doublesMatches,
    doublesWins,
    doublesWinRate: doublesMatches > 0 ? Math.round((doublesWins / doublesMatches) * 100) : 0,
    peakSmashKmh,
    avgSmashKmh: smashCount > 0 ? Math.round(smashSum / smashCount) : 0,
    totalDurationMin,
    totalExpGained,
    avgPointsFor: matchesWithPoints > 0 ? Number((totalPointsFor / matchesWithPoints).toFixed(1)) : 0,
    avgPointsAgainst:
      matchesWithPoints > 0 ? Number((totalPointsAgainst / matchesWithPoints).toFixed(1)) : 0,
    currentStreak: { type: firstResult, count: streakCount },
    trendSeries,
  };
}
