import React, { useId, useMemo, useState } from 'react';
import { Sparkles, Video, Crown, Dumbbell, TrendingUp } from 'lucide-react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { ProSubscriptionModal } from '../common/ProSubscriptionModal';
import { DoodleAvatar } from '../common/DoodleAvatar';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/radar-chart';
import { playCoinSound, playSelectSound } from '../../utils/retroAudio';
import { AICoachAdviceResponse, fetchAICoachInsight } from '../../services/aiService';

export const D1_AICoachDashboardScreen: React.FC = () => {
  const { player, navigateTo, language, gainExp } = useApp();
  const [showPastComparison, setShowPastComparison] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [coachQuestion, setCoachQuestion] = useState('');
  const [isLoadingCoach, setIsLoadingCoach] = useState(false);
  const [coachInsight, setCoachInsight] = useState<AICoachAdviceResponse | null>(null);
  const [coachError, setCoachError] = useState<string | null>(null);

  const isThai = language === 'th';

  const handleAskCoach = async () => {
    if (isLoadingCoach) return;
    setIsLoadingCoach(true);
    setCoachError(null);
    try {
      const res = await fetchAICoachInsight({
        player,
        question: coachQuestion.trim() || undefined,
        language,
      });
      setCoachInsight(res);
      gainExp(20, isThai ? 'ปรึกษาโค้ช AI ประจำวัน' : 'Consulted AI Badminton Coach');
    } catch (err) {
      console.error('AI coach failed:', err);
      setCoachError(
        isThai
          ? 'เชื่อมต่อโค้ช AI ไม่สำเร็จชั่วคราว กรุณาลองใหม่อีกครั้ง'
          : 'Could not reach AI Coach right now. Please try again.'
      );
    } finally {
      setIsLoadingCoach(false);
    }
  };
  const rawId = useId().replace(/:/g, '');
  const glowFilterId = `coach-radar-glow-${rawId}`;
  const pastGlowFilterId = `coach-radar-past-glow-${rawId}`;

  const radarData = useMemo(
    () => [
      {
        axis: isThai ? 'พลังตบ' : 'Power',
        code: 'PWR',
        current: player.skillRadar.power,
        past: player.pastRadar.power,
      },
      {
        axis: isThai ? 'ความเร็ว' : 'Speed',
        code: 'SPD',
        current: player.skillRadar.speed,
        past: player.pastRadar.speed,
      },
      {
        axis: isThai ? 'คุมลูก' : 'Control',
        code: 'CTL',
        current: player.skillRadar.control,
        past: player.pastRadar.control,
      },
      {
        axis: isThai ? 'ความอึด' : 'Stamina',
        code: 'STA',
        current: player.skillRadar.stamina,
        past: player.pastRadar.stamina,
      },
      {
        axis: isThai ? 'แท็กติก' : 'Tactics',
        code: 'TAC',
        current: player.skillRadar.tactics,
        past: player.pastRadar.tactics,
      },
    ],
    [player.skillRadar, player.pastRadar, isThai]
  );

  const currentAvg =
    radarData.reduce((acc, item) => acc + item.current, 0) / radarData.length;
  const pastAvg =
    radarData.reduce((acc, item) => acc + item.past, 0) / radarData.length;
  const growthPercent =
    pastAvg > 0 ? Number((((currentAvg - pastAvg) / pastAvg) * 100).toFixed(1)) : 0;

  const radarChartConfig = useMemo<ChartConfig>(
    () => ({
      current: {
        label: isThai ? 'ฟอร์มปัจจุบัน' : 'Current Form',
        color: '#15803d',
      },
      past: {
        label: isThai ? '30 วันก่อน' : 'Past 30 Days',
        color: '#e85729',
      },
    }),
    [isThai]
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28 bg-[#f8faf6] text-[#142608]">
      <MobileHeader />

      <div className="px-5 pt-4 pb-6 space-y-4">
        {/* 1. Athlete Banner Profile Card */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'ข้อมูลนักกีฬา' : 'ATHLETE PROFILE'}
            subtitle={isThai ? 'ระดับฝีมือและสตรีคปัจจุบัน' : 'Skill tier and active streak'}
            badge={isThai ? `ระดับ${player.tier}` : `${player.tier} TIER`}
            badgeVariant="green"
          />

          <div className="rounded-[32px] p-4 bg-[#ffffff]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DoodleAvatar
                  preset="karn"
                  size="lg"
                  className="w-14 h-14"
                  ringClass="border-2 border-[#000000] shadow-xs"
                />
                <div>
                  <h2 className="font-['Antonio',sans-serif] text-xl font-black uppercase leading-tight text-[#000000]">
                    {player.name}
                  </h2>
                  <p className="text-[11px] text-[#000000]/70 font-bold">
                    {isThai ? player.playstyleTh : player.playstyle}
                  </p>
                  <span className="text-[11px] font-bold text-[#ff5c34]">
                    {isThai ? `🔥 สตรีค ${player.streakWeeks} สัปดาห์ติด` : `🔥 ${player.streakWeeks}-Week Streak`}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-[0.032em]">
                  {isThai ? 'เลเวล' : 'Level'}
                </span>
                <div className="font-['Antonio',sans-serif] text-3xl font-black text-[#15803d] leading-none">
                  {player.level}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Smash Pro Upgrade Banner */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'สมาชิกสแมชโปร' : 'PRO MEMBERSHIP'}
            subtitle={isThai ? 'ลดค่าคอร์ท 10% · สแกนท่าทางไม่จำกัด' : '10% court discount · Unlimited scans'}
            badge={isThai ? '฿199/เดือน' : '฿199/mo'}
            badgeVariant="orange"
          />

          <div className="rounded-[28px] p-4 bg-[#7cd7a0] space-y-2.5">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#000000] shrink-0" />
              <span className="text-xs font-bold text-[#000000]">
                {isThai
                  ? 'ส่วนลดค่าคอร์ท 10% พร้อมวิเคราะห์วิดีโอไม่จำกัด'
                  : '10% court booking discount & unlimited AI video scans'}
              </span>
            </div>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#000000]">
                {player.tier === 'Pro'
                  ? (isThai ? 'สมาชิกโปรใช้งานเต็มระบบ' : 'Pro membership active')
                  : (isThai ? 'ปลดล็อกสิทธิพิเศษนักกีฬา' : 'Unlock full athlete privileges')}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsProModalOpen(true);
                  playCoinSound();
                }}
                className="px-3.5 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] font-bold text-[11px] uppercase tracking-[0.032em] hover:bg-[#1a1a1a] transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
              >
                {player.tier === 'Pro'
                  ? (isThai ? 'ดูสถานะโปร' : 'View Pro')
                  : (isThai ? 'อัปเกรดโปร' : 'Upgrade Pro')}
              </button>
            </div>
          </div>
        </div>

        {/* 3. 5-Axis Skill Radar Card (Glowing Stroke Recharts in SmashAI CI) */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'เรดาร์ประเมินทักษะ 5 มิติ' : 'ATHLETIC SKILL RADAR'}
            subtitle={
              isThai
                ? 'พลังตบ · ความเร็ว · คุมลูก · ความอึด · แท็กติก'
                : 'Power · Speed · Control · Stamina · Tactics'
            }
            rightSlot={
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  setShowPastComparison((prev) => !prev);
                }}
                className={`no-doodle min-h-[32px] px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors border shrink-0 whitespace-nowrap ${
                  showPastComparison
                    ? 'bg-[#e8f7ee] text-[#004d2c] border-[#004d2c]'
                    : 'bg-[#ffffff] text-[#5c6f5e] border-[#d4dfd0] hover:border-[#2d4d14] hover:text-[#142608]'
                }`}
              >
                {showPastComparison
                  ? isThai
                    ? 'เทียบ 30 วัน'
                    : '30D Overlay On'
                  : isThai
                    ? '+ เทียบ 30 วัน'
                    : '+ Compare 30D'}
              </button>
            }
          />

          <div className="rounded-[28px] p-5 bg-[#ffffff] border border-[#d4dfd0] shadow-2xs space-y-3">
            {/* Card Header matching Glowing Stroke Radar reference */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center justify-center gap-2 flex-wrap">
                <h3 className="text-[15px] font-bold text-[#142608]">
                  {isThai ? 'สมดุลทักษะแบดมินตัน' : 'Skill Performance Radar'}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                    growthPercent >= 0
                      ? 'bg-[#e8f7ee] text-[#004d2c]'
                      : 'bg-[#fff1ec] text-[#e85729]'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {growthPercent >= 0 ? `+${growthPercent}%` : `${growthPercent}%`}
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-[#5c6f5e]">
                {isThai
                  ? `พลังรวมเฉลี่ย OVR ${Math.round(currentAvg)} เทียบพัฒนาการย้อนหลัง 30 วัน`
                  : `Average OVR ${Math.round(currentAvg)} vs 30-day historical trend`}
              </p>
            </div>

            {/* Glowing Stroke Recharts Radar */}
            <ChartContainer
              config={radarChartConfig}
              className="mx-auto aspect-square w-full max-w-[300px] h-[250px]"
            >
              <RadarChart data={radarData} outerRadius="70%">
                <defs>
                  <filter
                    id={glowFilterId}
                    x="-35%"
                    y="-35%"
                    width="170%"
                    height="170%"
                  >
                    <feGaussianBlur stdDeviation="5.5" result="blur" />
                    <feComponentTransfer in="blur" result="vividBlur">
                      <feFuncA type="linear" slope="1.9" />
                    </feComponentTransfer>
                    <feComposite in="SourceGraphic" in2="vividBlur" operator="over" />
                  </filter>
                  <filter
                    id={pastGlowFilterId}
                    x="-35%"
                    y="-35%"
                    width="170%"
                    height="170%"
                  >
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComponentTransfer in="blur" result="softBlur">
                      <feFuncA type="linear" slope="1.35" />
                    </feComponentTransfer>
                    <feComposite in="SourceGraphic" in2="softBlur" operator="over" />
                  </filter>
                </defs>

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" valueSuffix=" / 100" />}
                />
                <PolarGrid strokeDasharray="3 3" stroke="#cad7c5" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{
                    fill: '#142608',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  tickLine={false}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />

                {showPastComparison && (
                  <Radar
                    name="past"
                    dataKey="past"
                    stroke="var(--color-past)"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    fill="none"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: '#e85729',
                      stroke: '#ffffff',
                      strokeWidth: 2,
                    }}
                    filter={`url(#${pastGlowFilterId})`}
                  />
                )}

                <Radar
                  name="current"
                  dataKey="current"
                  stroke="var(--color-current)"
                  strokeWidth={2.6}
                  fill="none"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: '#004d2c',
                    stroke: '#7cd7a0',
                    strokeWidth: 2.5,
                  }}
                  filter={`url(#${glowFilterId})`}
                />
              </RadarChart>
            </ChartContainer>

            {/* Compact 5-Axis Score Bar + Legend */}
            <div className="grid grid-cols-5 gap-1.5 text-center pt-1">
              {radarData.map((s) => {
                const diff = s.current - s.past;
                return (
                  <div
                    key={s.code}
                    className="py-1.5 px-1 rounded-[12px] bg-[#f8faf6] border border-[#e6eee2] tabular-nums"
                  >
                    <div className="text-[9px] font-bold text-[#5c6f5e] uppercase">
                      {s.code}
                    </div>
                    <div className="text-[13px] font-bold text-[#142608] leading-tight mt-0.5">
                      {s.current}
                    </div>
                    <div
                      className={`text-[9px] font-semibold ${
                        diff >= 0 ? 'text-[#15803d]' : 'text-[#e85729]'
                      }`}
                    >
                      {diff >= 0 ? `+${diff}` : diff}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] font-medium pt-1 border-t border-[#e6eee2]">
              <div className="flex items-center gap-1.5 text-[#142608] font-semibold">
                <span className="w-3.5 h-[2.5px] rounded-full bg-[#15803d] shadow-[0_0_6px_rgba(21,128,61,0.65)]" />
                <span>{isThai ? 'ฟอร์มปัจจุบัน' : 'Current Form'}</span>
              </div>
              {showPastComparison && (
                <div className="flex items-center gap-1.5 text-[#5c6f5e]">
                  <span className="w-3.5 h-0 border-t-2 border-dashed border-[#e85729]" />
                  <span>{isThai ? 'สถิติ 30 วันก่อน' : 'Past 30 Days'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Head Coach Advice */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'จุดแข็งและคำแนะนำ' : 'STRENGTHS & ADVICE'}
            subtitle={isThai ? 'แนวทางฝึกซ้อมและวิเคราะห์ท่าทางด้วย Gemini AI' : 'Personalized training advice powered by Gemini AI'}
            badge={coachInsight?.source === 'gemini' ? 'GEMINI AI' : (isThai ? 'โค้ชแนะนำ' : 'COACH AI')}
            badgeVariant="green"
          />

          <div className="rounded-[28px] p-4 space-y-3 bg-[#ffffff] border border-[#d4dfd0]">
            <p className="text-xs text-[#142608]/80 leading-relaxed font-medium">
              {coachInsight
                ? coachInsight.summary
                : isThai
                ? `พลังตบอยู่ในระดับสูง (${player.stats.highestSmashSpeedKmh} km/h) ควรฝึกคุมลูกหน้าเน็ตและซ้อมจังหวะก้าวสัปดาห์ละ 2 ครั้ง`
                : `Smash power is strong (${player.stats.highestSmashSpeedKmh} km/h); focus on net drop control with 2 weekly split-step drills.`}
            </p>

            {coachError && (
              <div className="p-2.5 rounded-[14px] bg-[#fff1ec] border border-[#e85729]/30 text-[11px] font-medium text-[#b93815]">
                {coachError}
              </div>
            )}

            {coachInsight && (
              <div className="p-3 rounded-[18px] bg-[#e8f7ee] border border-[#7cd7a0] space-y-1.5 text-xs">
                <div className="font-bold text-[#004d2c] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{coachInsight.headline}</span>
                </div>
                <ul className="space-y-1 text-[#142608]/85 list-disc list-inside">
                  {coachInsight.tips.map((tip, idx) => (
                    <li key={idx} className="leading-snug">{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                maxLength={140}
                value={coachQuestion}
                onChange={(e) => setCoachQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAskCoach();
                  }
                }}
                placeholder={isThai ? 'ถามโค้ช (เช่น แก้ลูกหยอดหน้าเน็ตยังไง?)' : 'Ask AI coach (e.g. How to defend smashes?)'}
                className="flex-1 min-w-0 px-3.5 py-2 rounded-full bg-[#ffffff] border border-[#d4dfd0] focus:border-[#2d4d14] text-xs font-medium text-[#142608] outline-none transition-colors"
              />
              <button
                type="button"
                disabled={isLoadingCoach}
                onClick={handleAskCoach}
                className="no-doodle px-3.5 py-2 rounded-full bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] text-xs font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 active:scale-95 disabled:opacity-60"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isLoadingCoach
                    ? isThai ? 'กำลังคิด...' : 'Thinking...'
                    : isThai ? 'ถามโค้ช' : 'Ask AI'}
                </span>
              </button>
            </div>

            <div className="pt-1 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigateTo('D2')}
                className="py-3 px-3 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-transform active:scale-95 border border-[#000000] bg-[#000000] text-[#ffffff] hover:bg-[#1a1a1a] cursor-pointer whitespace-nowrap"
              >
                <Dumbbell className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">
                  {isThai ? 'ภารกิจและแบบฝึก' : 'QUESTS & DRILLS'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('D3')}
                className="py-3 px-3 rounded-[1600px] font-bold text-xs border border-[#000000] flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9] uppercase tracking-[0.032em] whitespace-nowrap"
              >
                <Video className="w-4 h-4 text-[#15803d] shrink-0" />
                <span className="whitespace-nowrap">
                  {isThai ? 'สแกนวิดีโอท่าตบ' : 'VISION SCAN'}
                </span>
              </button>
            </div>
          </div>
        </div>
 </div>

 {/* Pro Membership Modal */}
 <ProSubscriptionModal
 isOpen={isProModalOpen}
 onClose={() => setIsProModalOpen(false)}
 />
 </div>
 );
};
