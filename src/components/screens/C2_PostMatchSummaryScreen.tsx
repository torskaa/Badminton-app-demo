import React, { useMemo, useState } from 'react';
import {
  Trophy,
  Flame,
  BarChart3,
  Share2,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  NotebookPen,
  Check,
  Save,
  Trash2,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { playCoinSound, playSelectSound } from '../../utils/retroAudio';
import { CACHE_KEYS, formatCacheTimestamp, readCache, writeCache } from '../../utils/offlineCache';
import { analyzeMatchInsights } from '../../utils/matchInsightsAnalyzer';
import { MatchReplayTimeline } from '../common/MatchReplayTimeline';

interface SavedMatchNote {
  id: string;
  matchup: string;
  scoreSummary: string;
  note: string;
  savedAt: number;
}

interface MatchNotesCacheData {
  draft: string;
  savedNotes: SavedMatchNote[];
  lastSavedAt: number | null;
}

interface MatchTrendPoint {
  id: string;
  label: string;
  opponentTh: string;
  opponentEn: string;
  result: 'W' | 'L';
  formScore: number;
  smashKmh: number;
  scoreLine: string;
  isCurrent?: boolean;
}

export const C2_PostMatchSummaryScreen: React.FC = () => {
  const { match, player, navigateTo, language } = useApp();
  const isThai = language === 'th';
  const isWinner = match.winner === 'A' || match.scoreA >= match.scoreB;

  const [trendMetric, setTrendMetric] = useState<'formScore' | 'smashKmh'>('formScore');

  const [noteInput, setNoteInput] = useState<string>(() => {
    const cached = readCache<MatchNotesCacheData>(CACHE_KEYS.MATCH_NOTES);
    return cached?.draft || '';
  });
  const [savedNotes, setSavedNotes] = useState<SavedMatchNote[]>(() => {
    const cached = readCache<MatchNotesCacheData>(CACHE_KEYS.MATCH_NOTES);
    return Array.isArray(cached?.savedNotes) ? cached.savedNotes : [];
  });
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(() => {
    const cached = readCache<MatchNotesCacheData>(CACHE_KEYS.MATCH_NOTES);
    return cached?.lastSavedAt ?? null;
  });
  const [justSavedNote, setJustSavedNote] = useState(false);

  const quickObservationTags = useMemo(
    () =>
      isThai
        ? [
            'คุมจังหวะหน้าเน็ตได้ดีขึ้น',
            'ต้องเร่งการถอยคอร์ทด้านหลัง',
            'ตบครอสคอร์ทเข้าเป้าแม่นยำ',
            'ปลายเซ็ต 3 แรงยังตกเล็กน้อย',
          ]
        : [
            'Strong net control & tight drops',
            'Need faster recovery to backcourt',
            'Cross-court smashes landed well',
            'Stamina dipped slightly in late set',
          ],
    [isThai]
  );

  const handleAppendObservation = (tagText: string) => {
    playSelectSound();
    setNoteInput((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return tagText;
      if (trimmed.includes(tagText)) return prev;
      return `${trimmed}\n• ${tagText}`;
    });
  };

  const handleSaveMatchNote = () => {
    const trimmed = noteInput.trim();
    if (!trimmed) return;
    playCoinSound();
    const now = Date.now();
    const newEntry: SavedMatchNote = {
      id: `note_${now}`,
      matchup: `${match.playerAName} vs ${match.playerBName}`,
      scoreSummary: `${match.setsWonA || 2}-${match.setsWonB || 0} (${match.scoreA}-${match.scoreB})`,
      note: trimmed,
      savedAt: now,
    };
    const nextNotes = [newEntry, ...savedNotes].slice(0, 6);
    setSavedNotes(nextNotes);
    setLastSavedAt(now);
    setNoteInput('');
    writeCache<MatchNotesCacheData>(CACHE_KEYS.MATCH_NOTES, {
      draft: '',
      savedNotes: nextNotes,
      lastSavedAt: now,
    });
    setJustSavedNote(true);
    window.setTimeout(() => setJustSavedNote(false), 2400);
  };

  const handleNoteChange = (value: string) => {
    setNoteInput(value);
    writeCache<MatchNotesCacheData>(CACHE_KEYS.MATCH_NOTES, {
      draft: value,
      savedNotes,
      lastSavedAt,
    });
  };

  const handleDeleteNote = (id: string) => {
    playSelectSound();
    const nextNotes = savedNotes.filter((item) => item.id !== id);
    setSavedNotes(nextNotes);
    writeCache<MatchNotesCacheData>(CACHE_KEYS.MATCH_NOTES, {
      draft: noteInput,
      savedNotes: nextNotes,
      lastSavedAt,
    });
  };

  const trendData: MatchTrendPoint[] = useMemo(() => {
    const pointMargin = Math.max(-10, Math.min(12, match.scoreA - match.scoreB));
    const currentFormScore = Math.min(
      98,
      Math.max(
        68,
        Math.round(
          (isWinner ? 84 : 74) +
            pointMargin * 0.7 +
            Math.min(6, match.shotHistory.filter((s) => s.team === 'A').length * 0.35)
        )
      )
    );
    const baseSmash = player.stats.highestSmashSpeedKmh || 342;
    const currentSmash = Math.min(380, Math.max(295, Math.round(baseSmash - (isWinner ? 8 : 22))));

    return [
      {
        id: 'm1',
        label: isThai ? 'นัด 1' : 'M1',
        opponentTh: 'แบงค์ & ท็อป',
        opponentEn: 'Bank & Top',
        result: 'L',
        formScore: 73,
        smashKmh: 312,
        scoreLine: '18-21, 17-21',
      },
      {
        id: 'm2',
        label: isThai ? 'นัด 2' : 'M2',
        opponentTh: 'มีน & นัท',
        opponentEn: 'Meen & Nat',
        result: 'W',
        formScore: 78,
        smashKmh: 324,
        scoreLine: '21-15, 21-14',
      },
      {
        id: 'm3',
        label: isThai ? 'นัด 3' : 'M3',
        opponentTh: 'อาร์ท สปีด',
        opponentEn: 'Art Speed',
        result: 'L',
        formScore: 76,
        smashKmh: 319,
        scoreLine: '19-21, 21-16, 18-21',
      },
      {
        id: 'm4',
        label: isThai ? 'นัด 4' : 'M4',
        opponentTh: 'โอห์ม ปืนกล',
        opponentEn: 'Ohm Gun',
        result: 'W',
        formScore: 84,
        smashKmh: 338,
        scoreLine: '21-18, 21-19',
      },
      {
        id: 'm5',
        label: isThai ? 'ล่าสุด' : 'Now',
        opponentTh: match.playerBName,
        opponentEn: match.playerBName,
        result: isWinner ? 'W' : 'L',
        formScore: currentFormScore,
        smashKmh: currentSmash,
        scoreLine: `${match.scoreA}-${match.scoreB}`,
        isCurrent: true,
      },
    ];
  }, [isThai, isWinner, match.scoreA, match.scoreB, match.playerBName, match.shotHistory, player.stats.highestSmashSpeedKmh]);

  const firstVal = trendData[0][trendMetric];
  const latestVal = trendData[trendData.length - 1][trendMetric];
  const deltaVal = latestVal - firstVal;
  const avgVal = Math.round(
    trendData.reduce((sum, item) => sum + item[trendMetric], 0) / trendData.length
  );

  const weeklySummary = useMemo(() => {
    const wins = trendData.filter((m) => m.result === 'W').length;
    const total = trendData.length;
    const weeklyWinRate = Math.round((wins / Math.max(1, total)) * 100);
    const prevWeekWinRate = 50;
    const winRateDelta = weeklyWinRate - prevWeekWinRate;

    const firstForm = trendData[0]?.formScore || 70;
    const latestForm = trendData[trendData.length - 1]?.formScore || firstForm;
    const improvementPct = Math.round(((latestForm - firstForm) / Math.max(1, firstForm)) * 100);
    const improvementProgress = Math.min(
      100,
      Math.max(10, Math.round((Math.max(0, improvementPct) / 25) * 100))
    );

    const ringRadius = 15;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const ringOffset = ringCircumference - (weeklyWinRate / 100) * ringCircumference;

    return {
      wins,
      total,
      weeklyWinRate,
      winRateDelta,
      firstForm,
      latestForm,
      improvementPct,
      improvementProgress,
      ringRadius,
      ringCircumference,
      ringOffset,
    };
  }, [trendData]);

  const matchInsight = useMemo(() => analyzeMatchInsights(match), [match]);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-hidden">
      <MobileHeader showBack />

      <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
        {/* Victory Trophy Header */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'ผลการแข่งขัน' : 'MATCH OUTCOME'}
            subtitle={isThai ? 'สรุปผู้ชนะและผลคะแนน' : 'Final match result'}
            badge={isThai ? 'บันทึกแล้ว' : 'RECORDED'}
            badgeVariant="green"
          />

          <div className="text-center rounded-[32px] p-5 bg-[#ffffff] space-y-2 shadow-sm">
            <div className="w-16 h-16 rounded-[1600px] mx-auto mb-1 flex items-center justify-center bg-[#7cd7a0] text-[#000000]">
              <Trophy className="w-8 h-8 stroke-[2.3]" />
            </div>

            <span className="px-3 py-0.5 rounded-[1600px] text-[10px] font-bold tracking-[0.032em] uppercase bg-[#7cd7a0] text-[#000000] inline-block mb-1">
              {isWinner
                ? (isThai ? 'ชัยชนะของแมตช์' : 'MATCH VICTORY!')
                : (isThai ? 'จบการแข่งขัน' : 'MATCH COMPLETED')}
            </span>
            <h2 className="font-['Antonio',sans-serif] text-3xl font-black tracking-tight uppercase leading-[0.85] text-[#000000]">
              {isWinner
                ? (isThai ? 'ผู้ชนะแห่งสนาม' : 'CHAMPION OF THE COURT')
                : (isThai ? 'เกมยอดเยี่ยม' : 'GREAT MATCH EFFORT')}
            </h2>
            <p className="text-xs text-[#000000]/70 font-bold mt-1">
              {match.playerAName} {isThai ? 'พบ' : 'vs'} {match.playerBName}
            </p>
          </div>
        </div>

        {/* Final Sets Score Breakdown Card */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'สรุปคะแนนเซ็ต' : 'FINAL SETS'}
            subtitle={isThai ? 'ผลรวมแต่ละเซ็ต' : 'Match set breakdown'}
            badge={isThai ? 'ชนะ 2 ใน 3 เซ็ต' : 'Best of 3'}
            badgeVariant="soft"
          />

          <div className="rounded-[32px] p-5 text-center bg-[#ffffff] shadow-sm">
            <div className="flex items-center justify-center gap-8 py-1">
              <div className="text-center">
                <div className="text-xs font-bold text-[#000000]/70">{match.playerAName}</div>
                <div className="font-['Antonio',sans-serif] text-6xl font-black text-[#15803d] mt-1 leading-none tabular-nums">
                  {match.setsWonA || 2}
                </div>
              </div>
              <div className="font-['Antonio',sans-serif] text-xl text-[#000000]/40 font-black uppercase">VS</div>
              <div className="text-center">
                <div className="text-xs font-bold text-[#000000]/70">{match.playerBName}</div>
                <div className="font-['Antonio',sans-serif] text-6xl font-black text-[#000000]/40 mt-1 leading-none tabular-nums">
                  {match.setsWonB || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Average Win Rate & Performance Improvement Summary */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'สรุปฟอร์มสัปดาห์นี้' : 'WEEKLY SUMMARY'}
            subtitle={
              isThai
                ? 'อัตราชนะและพัฒนาการล่าสุด'
                : 'Win rate & improvement'
            }
            badge={
              weeklySummary.improvementPct >= 0
                ? `${isThai ? 'ดีขึ้น' : 'UP'} +${weeklySummary.improvementPct}%`
                : `${weeklySummary.improvementPct}%`
            }
            badgeVariant={weeklySummary.improvementPct >= 0 ? 'green' : 'orange'}
          />

          <div className="grid grid-cols-2 gap-2.5">
            {/* Weekly Avg Win Rate Card with Small Circular Progress Indicator */}
            <div className="rounded-[24px] p-3.5 bg-[#ffffff] shadow-sm flex flex-col justify-between space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-[#000000]/60 leading-tight">
                  {isThai ? 'อัตราชนะสัปดาห์นี้' : 'Weekly Win Rate'}
                </span>
                {/* Small Circular Progress Indicator */}
                <div className="relative w-9 h-9 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 38 38">
                    <circle
                      cx="19"
                      cy="19"
                      r={weeklySummary.ringRadius}
                      className="stroke-[#e5e7eb]"
                      strokeWidth="3.5"
                      fill="none"
                    />
                    <circle
                      cx="19"
                      cy="19"
                      r={weeklySummary.ringRadius}
                      className={
                        weeklySummary.weeklyWinRate >= 50 ? 'stroke-[#7cd7a0]' : 'stroke-[#e85729]'
                      }
                      strokeWidth="3.5"
                      strokeDasharray={weeklySummary.ringCircumference}
                      strokeDashoffset={weeklySummary.ringOffset}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5 text-[#000000]" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000] leading-none tabular-nums">
                    {weeklySummary.weeklyWinRate}%
                  </span>
                  <span
                    className={`text-[10px] font-bold tabular-nums ${
                      weeklySummary.winRateDelta >= 0 ? 'text-[#15803d]' : 'text-[#e85729]'
                    }`}
                  >
                    {weeklySummary.winRateDelta >= 0
                      ? `+${weeklySummary.winRateDelta}%`
                      : `${weeklySummary.winRateDelta}%`}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-[#000000]/55 mt-1 truncate tabular-nums">
                  {isThai
                    ? `ชนะ ${weeklySummary.wins}/${weeklySummary.total} นัด · สัปดาห์นี้`
                    : `${weeklySummary.wins}/${weeklySummary.total} wins this week`}
                </div>
              </div>
            </div>

            {/* Performance Improvement Card with Small Linear Progress Indicator */}
            <div className="rounded-[24px] p-3.5 bg-[#ffffff] shadow-sm flex flex-col justify-between space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-[#000000]/60 leading-tight">
                  {isThai ? 'พัฒนาการฟอร์ม' : 'Perf Improvement'}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    weeklySummary.improvementPct >= 0
                      ? 'bg-[#7cd7a0]/30 text-[#15803d]'
                      : 'bg-[#e85729]/15 text-[#e85729]'
                  }`}
                >
                  {weeklySummary.improvementPct >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`font-['Antonio',sans-serif] text-2xl font-black leading-none tabular-nums ${
                      weeklySummary.improvementPct >= 0 ? 'text-[#15803d]' : 'text-[#e85729]'
                    }`}
                  >
                    {weeklySummary.improvementPct >= 0
                      ? `+${weeklySummary.improvementPct}%`
                      : `${weeklySummary.improvementPct}%`}
                  </span>
                  <span className="text-[10px] font-bold text-[#000000]/55 tabular-nums">
                    ({weeklySummary.firstForm}→{weeklySummary.latestForm})
                  </span>
                </div>

                {/* Small Progress Bar Indicator */}
                <div className="mt-1.5 space-y-1">
                  <div className="w-full h-1.5 rounded-full bg-[#e5e7eb] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        weeklySummary.improvementPct >= 0 ? 'bg-[#7cd7a0]' : 'bg-[#e85729]'
                      }`}
                      style={{ width: `${weeklySummary.improvementProgress}%` }}
                    />
                  </div>
                  <div className="text-[9px] font-bold text-[#000000]/50 truncate">
                    {isThai ? 'เทียบฟอร์มต้นสัปดาห์' : 'vs. early-week form'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Match Performance Progression Trend Line (Recharts) */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'แนวโน้มฟอร์ม 5 นัดล่าสุด' : '5-MATCH TREND'}
            subtitle={
              isThai
                ? 'เทียบกับค่าเฉลี่ยส่วนตัว'
                : 'Last 5 recorded matches'
            }
            badge={
              deltaVal >= 0
                ? `+${deltaVal} ${trendMetric === 'formScore' ? (isThai ? 'แต้ม' : 'PTS') : 'km/h'}`
                : `${deltaVal} ${trendMetric === 'formScore' ? (isThai ? 'แต้ม' : 'PTS') : 'km/h'}`
            }
            badgeVariant={deltaVal >= 0 ? 'green' : 'orange'}
          />

          <div className="rounded-[28px] p-4 bg-[#ffffff] shadow-sm space-y-3">
            {/* Metric Header & Segmented Switch */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-[12px] bg-[#7cd7a0]/25 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-[#15803d]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-[#000000] leading-tight truncate tabular-nums">
                    {trendMetric === 'formScore'
                      ? isThai
                        ? `ฟอร์มล่าสุด ${latestVal}/100`
                        : `Latest Form ${latestVal}/100`
                      : isThai
                      ? `สปีดตบล่าสุด ${latestVal} km/h`
                      : `Latest Peak ${latestVal} km/h`}
                  </div>
                  <div className="text-[10px] font-bold text-[#000000]/55 truncate tabular-nums">
                    {isThai ? `ค่าเฉลี่ย 5 นัด: ${avgVal}` : `5-Match Avg: ${avgVal}`}
                  </div>
                </div>
              </div>

              <div
                data-filter="true"
                className="bg-[#ececef] p-1 rounded-full flex items-center gap-1 shrink-0"
              >
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setTrendMetric('formScore');
                  }}
                  className={`no-doodle min-h-[32px] px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                    trendMetric === 'formScore'
                      ? 'bg-[#ffffff] text-[#111111] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                      : 'text-[#6b7280] hover:text-[#111111]'
                  }`}
                >
                  {isThai ? 'ฟอร์ม' : 'Form'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setTrendMetric('smashKmh');
                  }}
                  className={`no-doodle min-h-[32px] px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                    trendMetric === 'smashKmh'
                      ? 'bg-[#ffffff] text-[#111111] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                      : 'text-[#6b7280] hover:text-[#111111]'
                  }`}
                >
                  {isThai ? 'ความเร็วตบ' : 'Smash'}
                </button>
              </div>
            </div>

            {/* Recharts Trend Line Chart */}
            <div className="w-full h-[176px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 12, left: -16, bottom: 2 }}
                >
                  <defs>
                    <linearGradient id="smashFormGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7cd7a0" stopOpacity={0.65} />
                      <stop offset="95%" stopColor="#7cd7a0" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(0, 0, 0, 0.08)"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }}
                    dy={4}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={42}
                    domain={
                      trendMetric === 'formScore' ? [60, 100] : ['dataMin - 15', 'dataMax + 15']
                    }
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#6b7280' }}
                  />
                  <ReferenceLine
                    y={avgVal}
                    stroke="#000000"
                    strokeDasharray="4 4"
                    strokeOpacity={0.28}
                  />
                  <Tooltip
                    cursor={{ stroke: '#000000', strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const pt = payload[0].payload as MatchTrendPoint;
                      return (
                        <div className="rounded-[14px] bg-[#ffffff] border-2 border-[#000000] px-3 py-2 shadow-sm text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-black text-[#000000]">{pt.label}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                                pt.result === 'W'
                                  ? 'bg-[#7cd7a0] text-[#000000]'
                                  : 'bg-[#e85729] text-[#ffffff]'
                              }`}
                            >
                              {pt.result === 'W' ? (isThai ? 'ชนะ' : 'WIN') : (isThai ? 'แพ้' : 'LOSS')}
                            </span>
                          </div>
                          <div className="font-bold text-[#000000]/70 truncate max-w-[140px]">
                            vs {isThai ? pt.opponentTh : pt.opponentEn}
                          </div>
                          <div className="font-black text-[#15803d] tabular-nums">
                            {isThai ? `ฟอร์ม: ${pt.formScore}/100` : `Form: ${pt.formScore}/100`}
                          </div>
                          <div className="font-bold text-[#000000]/75 tabular-nums">
                            ⚡ {pt.smashKmh} km/h
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={trendMetric}
                    stroke="#000000"
                    strokeWidth={3}
                    fill="url(#smashFormGradient)"
                    dot={(dotProps) => {
                      const { cx, cy, payload } = dotProps;
                      if (typeof cx !== 'number' || typeof cy !== 'number') return <g key={dotProps.key} />;
                      const isCurrent = Boolean((payload as MatchTrendPoint)?.isCurrent);
                      return (
                        <circle
                          key={dotProps.key}
                          cx={cx}
                          cy={cy}
                          r={isCurrent ? 6 : 4}
                          fill={isCurrent ? '#e85729' : '#7cd7a0'}
                          stroke="#000000"
                          strokeWidth={2.5}
                        />
                      );
                    }}
                    activeDot={{
                      r: 6,
                      fill: '#e85729',
                      stroke: '#000000',
                      strokeWidth: 2.5,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 5-Match Mini Chips */}
            <div className="grid grid-cols-5 gap-1.5 pt-1 border-t border-[#f3f4f6]">
              {trendData.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-[12px] px-1.5 py-1.5 text-center ${
                    m.isCurrent ? 'bg-[#7cd7a0]/35 ring-1 ring-[#000000]/20' : 'bg-[#f4f8fb]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[9px] font-bold text-[#000000]/60">{m.label}</span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center ${
                        m.result === 'W'
                          ? 'bg-[#7cd7a0] text-[#000000]'
                          : 'bg-[#e85729] text-[#ffffff]'
                      }`}
                    >
                      {m.result}
                    </span>
                  </div>
                  <div className="text-[11px] font-black text-[#000000] tabular-nums mt-0.5">
                    {m[trendMetric]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animated Match Replay Timeline */}
        <MatchReplayTimeline match={match} isThai={isThai} />

        {/* AI Match Insights Section */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'โค้ชวิเคราะห์หลังเกม' : 'AI MATCH INSIGHTS'}
            subtitle={
              isThai
                ? 'วิเคราะห์จากแต้มและช็อตล่าสุด'
                : 'From your recent score & shots'
            }
            badge={isThai ? matchInsight.focusTagTh : matchInsight.focusTagEn}
            badgeVariant="dark"
          />

          <div className="rounded-[28px] p-4 bg-[#243b34] text-[#ffffff] shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[16px] bg-[#7cd7a0] text-[#000000] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold text-[#7cd7a0] uppercase">
                  {isThai ? 'คำแนะนำเทคนิค' : 'TECHNICAL TIP'}
                </div>
                <h3 className="text-sm font-black text-[#ffffff] leading-snug mt-0.5">
                  {isThai ? matchInsight.headlineTh : matchInsight.headlineEn}
                </h3>
                <p className="text-[11px] font-medium text-[#ffffff]/75 mt-0.5 truncate">
                  {isThai ? matchInsight.evidenceSummaryTh : matchInsight.evidenceSummaryEn}
                </p>
              </div>
            </div>

            <div className="rounded-[18px] bg-[#162722] border border-[#7cd7a0]/35 p-3.5 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-[#ffd731] shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-[#ffffff] leading-relaxed">
                {isThai ? matchInsight.technicalTipTh : matchInsight.technicalTipEn}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#ffffff]/80 min-w-0">
                <span className="px-2 py-1 rounded-[1600px] bg-[#ffffff]/10 whitespace-nowrap tabular-nums">
                  {isThai ? `${matchInsight.shotsAnalyzed} แต้มที่วิเคราะห์` : `${matchInsight.shotsAnalyzed} Pts Analyzed`}
                </span>
                <span className="px-2 py-1 rounded-[1600px] bg-[#ffffff]/10 whitespace-nowrap truncate">
                  ⚡ {matchInsight.topUserShot}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  navigateTo('D2');
                }}
                className="px-3.5 py-1.5 rounded-[1600px] bg-[#ffffff] hover:bg-[#f2f2f2] text-[#000000] text-[11px] font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{isThai ? 'ฝึกแก้จุดนี้' : 'Practice Tip'}</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* EXP Reward Card */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'รางวัลที่ได้รับ' : 'MATCH REWARDS'}
            subtitle={
              isThai
                ? 'โบนัสแข่งจบและสตรีคต่อเนื่อง'
                : 'Completion & streak bonuses'
            }
            badge={isThai ? '+250 คะแนน' : '+250 EXP'}
            badgeVariant="green"
          />

          <div className="rounded-[28px] p-4 bg-[#ffffff] shadow-sm">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#f4f8fb]">
                <span className="font-bold text-[#000000]">
                  {isThai ? 'รางวัลแข่งจบแมตช์' : 'Match Completion Reward'}
                </span>
                <span className="font-black text-[#15803d]">+150 EXP</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#f4f8fb]">
                <span className="flex items-center gap-1.5 font-bold text-[#000000]">
                  <Flame className="w-3.5 h-3.5 text-[#ff5c34] fill-[#ff5c34]" />
                  <span>
                    {isThai ? 'โบนัสสตรีค 3 สัปดาห์' : '3-Week Streak Bonus (1.5x)'}
                  </span>
                </span>
                <span className="font-black text-[#ff5c34]">+75 EXP</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#f4f8fb]">
                <span className="font-bold text-[#000000]">
                  {isThai ? 'โบนัสลูกตบทำแต้ม' : 'Smash Winner Bonus'}
                </span>
                <span className="font-black text-[#15803d]">+25 EXP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Match Notes & Observations */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'บันทึกส่วนตัวหลังเกม' : 'MATCH NOTES'}
            subtitle={
              isThai
                ? 'จดจุดเด่นและสิ่งที่ต้องซ้อมเพิ่ม'
                : 'Save highlights & reminders'
            }
            badge={
              savedNotes.length > 0
                ? isThai
                  ? `บันทึกแล้ว ${savedNotes.length}`
                  : `${savedNotes.length} SAVED`
                : isThai
                ? 'โน้ตโค้ช'
                : 'LOGBOOK'
            }
            badgeVariant={justSavedNote ? 'green' : 'soft'}
          />

          <div className="rounded-[28px] p-4 bg-[#ffffff] shadow-sm space-y-3">
            {/* Quick Tap Observation Starters */}
            <div data-filter="true" className="flex flex-wrap gap-1.5">
              {quickObservationTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAppendObservation(tag)}
                  className="px-2.5 py-1 rounded-[1600px] bg-[#f4f8fb] hover:bg-[#e8f7ee] text-[#000000]/80 text-[10px] font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  + {tag}
                </button>
              ))}
            </div>

            {/* Textarea Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="c2-match-notes"
                className="flex items-center justify-between text-[11px] font-bold text-[#000000]/70"
              >
                <span className="flex items-center gap-1.5">
                  <NotebookPen className="w-3.5 h-3.5 text-[#15803d]" />
                  <span>{isThai ? 'ข้อสังเกตฟอร์มการเล่นวันนี้' : 'Your Match Observations'}</span>
                </span>
                <span className="text-[10px] text-[#000000]/45 tabular-nums">
                  {noteInput.length}/300
                </span>
              </label>
              <textarea
                id="c2-match-notes"
                rows={3}
                maxLength={300}
                value={noteInput}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder={
                  isThai
                    ? 'พิมพ์สิ่งที่สังเกตเห็น เช่น จังหวะเสิร์ฟ หรือจุดที่ต้องซ้อมเพิ่ม...'
                    : 'Write observations, serve notes, or next drill focus...'
                }
                className="w-full rounded-[18px] bg-[#f4f8fb] border-2 border-[#000000]/15 focus:border-[#000000] focus:bg-[#ffffff] outline-none p-3 text-xs font-medium text-[#000000] placeholder:text-[#000000]/40 resize-none transition-colors"
              />
            </div>

            {/* Save Button & Confirmation */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-[#000000]/55 truncate">
                {justSavedNote ? (
                  <span className="text-[#15803d] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{isThai ? 'บันทึกโน้ตลงเครื่องแล้ว!' : 'Observation saved locally!'}</span>
                  </span>
                ) : lastSavedAt ? (
                  <span>
                    {isThai
                      ? `บันทึกล่าสุด ${formatCacheTimestamp(lastSavedAt, 'th')}`
                      : `Last saved ${formatCacheTimestamp(lastSavedAt, 'en')}`}
                  </span>
                ) : (
                  <span>{isThai ? 'บันทึกข้อมูลลงเครื่องอัตโนมัติ' : 'Stored locally on your device'}</span>
                )}
              </span>

              <button
                type="button"
                onClick={handleSaveMatchNote}
                disabled={!noteInput.trim()}
                className="px-4 py-2 rounded-[1600px] bg-[#7cd7a0] hover:bg-[#6bc991] disabled:opacity-45 text-[#000000] text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-transform"
              >
                <Save className="w-3.5 h-3.5 shrink-0" />
                <span>{isThai ? 'บันทึกโน้ต' : 'Save Note'}</span>
              </button>
            </div>

            {/* Saved Notes History List */}
            {savedNotes.length > 0 && (
              <div className="pt-2.5 border-t border-[#f3f4f6] space-y-2">
                <div className="text-[10px] font-bold uppercase text-[#000000]/55">
                  {isThai ? 'โน้ตที่บันทึกไว้ล่าสุด' : 'Saved Match Observations'}
                </div>
                <div className="space-y-2">
                  {savedNotes.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-[16px] bg-[#f4f8fb] p-3 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#000000]/60 flex-wrap">
                          <span className="text-[#000000] truncate">{entry.matchup}</span>
                          <span>·</span>
                          <span className="text-[#15803d] tabular-nums">{entry.scoreSummary}</span>
                          <span>·</span>
                          <span className="tabular-nums">
                            {formatCacheTimestamp(entry.savedAt, language)}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#000000] whitespace-pre-line leading-relaxed">
                          {entry.note}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(entry.id)}
                        aria-label={isThai ? 'ลบโน้ต' : 'Delete note'}
                        className="no-doodle p-1.5 rounded-full text-[#000000]/40 hover:text-[#e85729] hover:bg-[#ffffff] transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Actions */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => navigateTo('C3')}
            className="w-full py-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] whitespace-nowrap"
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>{isThai ? 'ดูฮีทแมพวิเคราะห์จุดอ่อน' : 'SHOT DIAGNOSTICS & HEATMAP'}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigateTo('C4')}
              className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
            >
              <Share2 className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
              <span>{isThai ? 'แชร์การ์ดผลแข่ง' : 'SHARE RECAP'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('D1')}
              className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
            >
              <span>{isThai ? 'เรดาร์โค้ช' : 'COACH RADAR'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
