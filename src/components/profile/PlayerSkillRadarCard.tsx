import React, { useId, useMemo, useState } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { playSelectSound } from '../../utils/retroAudio';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/radar-chart';

type SkillKey = 'power' | 'speed' | 'control' | 'stamina' | 'tactics';

interface SkillAxisMeta {
  key: SkillKey;
  code: string;
  labelTh: string;
  labelEn: string;
  tipTh: string;
  tipEn: string;
}

const AXES: SkillAxisMeta[] = [
  {
    key: 'power',
    code: 'PWR',
    labelTh: 'พลังตบ',
    labelEn: 'Power',
    tipTh: 'ความเร็วลูกตบและแรงส่งหัวไม้ในจังหวะบุก',
    tipEn: 'Smash velocity and overhead attacking punch',
  },
  {
    key: 'speed',
    code: 'SPD',
    labelTh: 'ความเร็ว',
    labelEn: 'Speed',
    tipTh: 'สปีดออกตัวและฟุตเวิร์กเข้าถึงลูกหน้าคอร์ท',
    tipEn: 'First-step burst and court coverage footwork',
  },
  {
    key: 'control',
    code: 'CTL',
    labelTh: 'คุมลูก',
    labelEn: 'Control',
    tipTh: 'ความแม่นยำลูกหยอดและวางลูกชิดเส้นข้าง',
    tipEn: 'Net drop accuracy and sideline placement',
  },
  {
    key: 'stamina',
    code: 'STA',
    labelTh: 'ความอึด',
    labelEn: 'Stamina',
    tipTh: 'ความคงเส้นคงวาของแรงปะทะในช่วงเซตตัดสิน',
    tipEn: 'Late-game endurance through deciding sets',
  },
  {
    key: 'tactics',
    code: 'TAC',
    labelTh: 'แท็กติก',
    labelEn: 'Tactics',
    tipTh: 'การอ่านเกม ดักทางคู่แข่ง และจังหวะเปลี่ยนรับเป็นรุก',
    tipEn: 'Shot selection, anticipation, and counter transitions',
  },
];

interface PlayerSkillRadarCardProps {
  onOpenCoachRadar?: () => void;
}

export const PlayerSkillRadarCard: React.FC<PlayerSkillRadarCardProps> = ({
  onOpenCoachRadar,
}) => {
  const { player, language } = useApp();
  const isThai = language === 'th';
  const rawId = useId().replace(/:/g, '');
  const glowFilterId = `smash-radar-glow-${rawId}`;
  const pastGlowFilterId = `smash-radar-past-glow-${rawId}`;

  const [chartMode, setChartMode] = useState<'glow' | 'compare'>('glow');
  const [selectedAxis, setSelectedAxis] = useState<SkillKey>('power');

  const metrics = useMemo(() => {
    return AXES.map((axis) => {
      const current = player.skillRadar[axis.key];
      const past = player.pastRadar[axis.key];
      const delta = current - past;
      return {
        ...axis,
        axis: isThai ? axis.labelTh : axis.labelEn,
        current,
        past,
        delta,
      };
    });
  }, [player.skillRadar, player.pastRadar, isThai]);

  const ovrAvg =
    AXES.reduce((sum, a) => sum + player.skillRadar[a.key], 0) / AXES.length;
  const pastAvg =
    AXES.reduce((sum, a) => sum + player.pastRadar[a.key], 0) / AXES.length;
  const ovrScore = Math.round(ovrAvg);
  const growthPercent =
    pastAvg > 0 ? Number((((ovrAvg - pastAvg) / pastAvg) * 100).toFixed(1)) : 0;

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      current: {
        label: isThai ? 'ฟอร์มปัจจุบัน' : 'Current Form',
        color: '#15803d',
      },
      past: {
        label: isThai ? '30 วันก่อน' : 'Past 30D',
        color: '#e85729',
      },
    }),
    [isThai]
  );

  const activeAxis = metrics.find((m) => m.key === selectedAxis) || metrics[0];

  return (
    <div className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] p-4 shadow-2xs space-y-3">
      {/* Header Row: Centered/Clean Editorial Title + Trend Growth Badge + Mode Toggle */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-bold text-[#142608] leading-tight">
              {isThai ? 'เรดาร์ทักษะ 5 มิติ' : '5-Axis Skill Radar'}
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums whitespace-nowrap ${
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
          <p className="text-[11px] text-[#5c6f5e] mt-0.5 leading-snug">
            {isThai
              ? `ค่าพลังเฉลี่ย OVR ${ovrScore} เทียบกับสถิติ 30 วันก่อน`
              : `Overall skill OVR ${ovrScore} compared against 30-day baseline`}
          </p>
        </div>

        {/* Outlined Hairline Chart Mode Chips */}
        <div
          data-filter="true"
          className="inline-flex items-center gap-1.5 shrink-0"
        >
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setChartMode('glow');
            }}
            className={`no-doodle filter-pill min-h-[30px] px-2.5 py-1 rounded-full text-[10px] transition-all cursor-pointer whitespace-nowrap border ${
              chartMode === 'glow'
                ? 'bg-[#e8f7ee] text-[#004d2c] border-[#004d2c] font-semibold'
                : 'bg-[#ffffff] text-[#5c6f5e] border-[#d4dfd0] hover:border-[#2d4d14] hover:text-[#142608] font-medium'
            }`}
          >
            {isThai ? 'ปัจจุบัน' : 'Current'}
          </button>
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setChartMode('compare');
            }}
            className={`no-doodle filter-pill min-h-[30px] px-2.5 py-1 rounded-full text-[10px] transition-all cursor-pointer whitespace-nowrap border ${
              chartMode === 'compare'
                ? 'bg-[#e8f7ee] text-[#004d2c] border-[#004d2c] font-semibold'
                : 'bg-[#ffffff] text-[#5c6f5e] border-[#d4dfd0] hover:border-[#2d4d14] hover:text-[#142608] font-medium'
            }`}
          >
            {isThai ? 'เทียบ 30 วัน' : '30D Diff'}
          </button>
        </div>
      </div>

      {/* Glowing Stroke Recharts Radar Chart */}
      <div className="w-full flex justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px] h-[250px]"
        >
          <RadarChart data={metrics} outerRadius="70%">
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
            <PolarRadiusAxis
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />

            {chartMode === 'compare' && (
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
      </div>

      {/* Compact Legend Row + Coach Deep-Dive CTA */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e6eee2] flex-wrap">
        <div className="flex items-center gap-3.5 text-[11px] text-[#5c6f5e]">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#142608]">
            <span className="w-3.5 h-[2.5px] rounded-full bg-[#15803d] shadow-[0_0_6px_rgba(21,128,61,0.65)]" />
            <span>{isThai ? 'ฟอร์มปัจจุบัน' : 'Current Form'}</span>
          </span>
          {chartMode === 'compare' && (
            <span className="inline-flex items-center gap-1.5 font-medium text-[#5c6f5e]">
              <span className="w-3.5 h-0 border-t-2 border-dashed border-[#e85729]" />
              <span>{isThai ? '30 วันก่อน' : 'Past 30D'}</span>
            </span>
          )}
        </div>

        {onOpenCoachRadar && (
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              onOpenCoachRadar();
            }}
            className="no-doodle text-[11px] font-semibold text-[#004d2c] hover:text-[#15803d] flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>{isThai ? 'เจาะลึกโค้ช' : 'Coach Insights'}</span>
            <ArrowRight className="w-3 h-3 shrink-0" />
          </button>
        )}
      </div>

      {/* Interactive 5-Axis Stat Strip + Selected Focus Note */}
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {metrics.map((m) => {
            const isSelected = m.key === selectedAxis;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => {
                  playSelectSound();
                  setSelectedAxis(m.key);
                }}
                className={`no-doodle py-1.5 px-1 rounded-[14px] border transition-all cursor-pointer tabular-nums ${
                  isSelected
                    ? 'bg-[#e8f7ee] border-[#004d2c]/60'
                    : 'bg-[#f8faf6] border-[#e6eee2] hover:border-[#7cd7a0]'
                }`}
              >
                <div
                  className={`text-[9px] font-bold uppercase ${
                    isSelected ? 'text-[#004d2c]' : 'text-[#5c6f5e]'
                  }`}
                >
                  {m.code}
                </div>
                <div className="text-[13px] font-bold text-[#142608] leading-tight mt-0.5">
                  {m.current}
                </div>
                <div
                  className={`text-[9px] font-semibold ${
                    m.delta >= 0 ? 'text-[#15803d]' : 'text-[#e85729]'
                  }`}
                >
                  {m.delta >= 0 ? `+${m.delta}` : m.delta}
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-3 py-2 rounded-[14px] bg-[#f8faf6] border border-[#e6eee2] flex items-center justify-between gap-2 text-[11px]">
          <div className="min-w-0">
            <span className="font-semibold text-[#142608]">
              {isThai ? activeAxis.labelTh : activeAxis.labelEn} ({activeAxis.code}):{' '}
            </span>
            <span className="text-[#5c6f5e]">
              {isThai ? activeAxis.tipTh : activeAxis.tipEn}
            </span>
          </div>
          <span className="font-bold text-[#004d2c] tabular-nums shrink-0 whitespace-nowrap">
            {activeAxis.current}/100
          </span>
        </div>
      </div>
    </div>
  );
};
