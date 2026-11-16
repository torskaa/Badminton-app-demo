import React, { useMemo, useState } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playSelectSound } from '../../utils/retroAudio';

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

  const [chartMode, setChartMode] = useState<'range' | 'compare'>('range');
  const [selectedAxis, setSelectedAxis] = useState<SkillKey>('power');

  const cx = 180;
  const cy = 158;
  const maxR = 96;
  const levels = [20, 40, 60, 80, 100];

  const polarPoint = (value: number, index: number, total: number = AXES.length) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const clamped = Math.max(0, Math.min(100, value));
    const r = (clamped / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle,
    };
  };

  const metrics = useMemo(() => {
    return AXES.map((axis, idx) => {
      const current = player.skillRadar[axis.key];
      const past = player.pastRadar[axis.key];
      const delta = current - past;
      // In 'range' mode, build a balanced confidence range around current;
      // in 'compare' mode, highlight the band between past 30D and current score.
      const lower =
        chartMode === 'range'
          ? Math.max(12, Math.min(current, past) - 4)
          : Math.max(12, Math.min(current, past));
      const upper =
        chartMode === 'range'
          ? Math.min(100, Math.max(current, past) + 7)
          : Math.min(100, Math.max(current, past));

      return {
        ...axis,
        idx,
        current,
        past,
        delta,
        lower,
        upper,
        currentPt: polarPoint(current, idx),
        pastPt: polarPoint(past, idx),
        outerEdgePt: polarPoint(100, idx),
      };
    });
  }, [player.skillRadar, player.pastRadar, chartMode]);

  const bandPath = useMemo(() => {
    const outerPts = metrics.map((m) => polarPoint(m.upper, m.idx));
    const innerPts = [...metrics].reverse().map((m) => polarPoint(m.lower, m.idx));
    const outerD = outerPts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ') + ' Z';
    const innerD = innerPts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ') + ' Z';
    return `${outerD} ${innerD}`;
  }, [metrics]);

  const currentLinePoints = useMemo(() => {
    return metrics
      .map((m) => `${m.currentPt.x.toFixed(2)},${m.currentPt.y.toFixed(2)}`)
      .join(' ');
  }, [metrics]);

  const pastLinePoints = useMemo(() => {
    return metrics
      .map((m) => `${m.pastPt.x.toFixed(2)},${m.pastPt.y.toFixed(2)}`)
      .join(' ');
  }, [metrics]);

  const ovrScore = Math.round(
    AXES.reduce((sum, a) => sum + player.skillRadar[a.key], 0) / AXES.length
  );
  const pastOvr = Math.round(
    AXES.reduce((sum, a) => sum + player.pastRadar[a.key], 0) / AXES.length
  );
  const ovrDelta = ovrScore - pastOvr;

  const activeAxis = metrics.find((m) => m.key === selectedAxis) || metrics[0];

  // Angle for subtle ring level labels matching the reference radial annotations
  const scaleAngle = -Math.PI / 2 + Math.PI / 5;

  return (
    <div className="bg-[#ffffff] rounded-[24px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-bold text-[#111111] leading-tight">
              {isThai ? 'เรดาร์ทักษะ 5 มิติ' : '5-Axis Skill Profile'}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803d] tabular-nums">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {isThai ? `พลังรวม ${ovrScore}` : `OVR ${ovrScore}`} ({ovrDelta >= 0 ? `+${ovrDelta}` : ovrDelta})
              </span>
            </span>
          </div>
          <p className="text-[11px] text-[#71717a] mt-0.5 leading-snug">
            {isThai
              ? 'เทียบค่าพลังปัจจุบันกับเกณฑ์เฉลี่ยและฟอร์ม 30 วัน'
              : 'Current levels vs benchmark ring & 30-day range'}
          </p>
        </div>

        {/* Segmented Control matching Profile style */}
        <div
          data-filter="true"
          className="bg-[#ececef] p-1 rounded-full grid grid-cols-2 gap-1 shrink-0"
        >
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setChartMode('range');
            }}
            className={`no-doodle min-h-[30px] px-2.5 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              chartMode === 'range'
                ? 'bg-[#ffffff] text-[#111111] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                : 'text-[#6b7280] hover:text-[#111111]'
            }`}
          >
            {isThai ? 'ช่วงฟอร์ม' : 'Range'}
          </button>
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setChartMode('compare');
            }}
            className={`no-doodle min-h-[30px] px-2.5 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              chartMode === 'compare'
                ? 'bg-[#ffffff] text-[#111111] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                : 'text-[#6b7280] hover:text-[#111111]'
            }`}
          >
            {isThai ? 'เทียบ 30 วัน' : '30D Diff'}
          </button>
        </div>
      </div>

      {/* Circular Concentric Radar SVG (Inspired by reference circular circumplex chart) */}
      <div className="w-full flex justify-center">
        <svg
          viewBox="0 0 360 316"
          className="w-full max-w-[332px] h-auto overflow-visible select-none"
          role="img"
          aria-label={isThai ? 'กราฟเรดาร์ทักษะแบดมินตัน 5 มิติ' : '5-axis badminton skill radar chart'}
        >
          {/* Subtle Concentric Circles (20, 40, 60 bold average, 80, 100 bold outer rim) */}
          {levels.map((lvl) => {
            const r = (lvl / 100) * maxR;
            const isOuter = lvl === 100;
            const isMidBenchmark = lvl === 60;
            return (
              <circle
                key={lvl}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={isOuter || isMidBenchmark ? '#111111' : '#d4d4d8'}
                strokeWidth={isOuter ? 2.4 : isMidBenchmark ? 1.5 : 1}
              />
            );
          })}

          {/* Radial Spokes */}
          {metrics.map((m) => (
            <line
              key={m.key}
              x1={cx}
              y1={cy}
              x2={m.outerEdgePt.x}
              y2={m.outerEdgePt.y}
              stroke="#52525b"
              strokeWidth={1.1}
            />
          ))}

          {/* Scale Annotations along upper-right gap (matches reference low/average/high ticks) */}
          {[
            { lvl: 40, text: isThai ? '40 · ต่ำ' : '40 · Low' },
            { lvl: 60, text: isThai ? '60 · เฉลี่ย' : '60 · Avg' },
            { lvl: 80, text: isThai ? '80 · สูง' : '80 · High' },
          ].map((tick) => {
            const r = (tick.lvl / 100) * maxR + 4;
            const tx = cx + r * Math.cos(scaleAngle);
            const ty = cy + r * Math.sin(scaleAngle);
            return (
              <text
                key={tick.lvl}
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={7.5}
                fontWeight={600}
                fill="#52525b"
                transform={`rotate(20, ${tx}, ${ty})`}
              >
                {tick.text}
              </text>
            );
          })}

          {/* Translucent Sky-Blue Shaded Band Polygon (hollow band via evenodd) */}
          <path
            d={bandPath}
            fill="rgba(59, 130, 246, 0.32)"
            fillRule="evenodd"
            stroke="none"
          />

          {/* Past 30D Dashed Reference Line in compare mode */}
          {chartMode === 'compare' && (
            <polygon
              points={pastLinePoints}
              fill="none"
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
          )}

          {/* Crisp Solid Blue Current Skill Line */}
          <polygon
            points={currentLinePoints}
            fill="none"
            stroke="#2563eb"
            strokeWidth={2.3}
            strokeLinejoin="round"
          />

          {/* Interactive Vertex Nodes */}
          {metrics.map((m) => {
            const isSelected = m.key === selectedAxis;
            return (
              <g
                key={m.key}
                onClick={() => {
                  playSelectSound();
                  setSelectedAxis(m.key);
                }}
                className="cursor-pointer"
              >
                <circle
                  cx={m.currentPt.x}
                  cy={m.currentPt.y}
                  r={12}
                  fill="transparent"
                />
                <circle
                  cx={m.currentPt.x}
                  cy={m.currentPt.y}
                  r={isSelected ? 5 : 3.5}
                  fill={isSelected ? '#2563eb' : '#ffffff'}
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </g>
            );
          })}

          {/* Axis Dimension Labels around the outer rim */}
          {metrics.map((m) => {
            const labelR = maxR + 28;
            const lx = cx + labelR * Math.cos(m.outerEdgePt.angle);
            const ly = cy + labelR * Math.sin(m.outerEdgePt.angle);
            const cos = Math.cos(m.outerEdgePt.angle);
            const anchor =
              Math.abs(cos) < 0.25 ? 'middle' : cos > 0 ? 'start' : 'end';
            const isSelected = m.key === selectedAxis;

            return (
              <g
                key={`label_${m.key}`}
                onClick={() => {
                  playSelectSound();
                  setSelectedAxis(m.key);
                }}
                className="cursor-pointer"
              >
                <text
                  x={lx}
                  y={ly - 6}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fontSize={11.5}
                  fontWeight={isSelected ? 800 : 700}
                  fill={isSelected ? '#1d4ed8' : '#111111'}
                >
                  {isThai ? m.labelTh : m.labelEn}
                </text>
                <text
                  x={lx}
                  y={ly + 8}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill={isSelected ? '#2563eb' : '#6b7280'}
                >
                  {m.code} {m.current} ({m.delta >= 0 ? `+${m.delta}` : m.delta})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Compact Legend Row matching reference bottom-left legend */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#000000]/[0.06] flex-wrap">
        <div className="flex items-center gap-3 text-[11px] text-[#52525b]">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#111111]">
            <span className="relative inline-flex items-center justify-center w-4 h-3 rounded-[3px] bg-[#3b82f6]/35">
              <span className="w-3.5 h-[2px] bg-[#2563eb] rounded-full" />
            </span>
            <span>
              {chartMode === 'range'
                ? (isThai ? 'ระดับทักษะ & ช่วงฟอร์ม' : 'Skill & Form Range')
                : (isThai ? 'ปัจจุบัน vs 30 วันก่อน' : 'Current vs 30D')}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-[#71717a]">
            <span className="w-2.5 h-[2px] bg-[#111111] rounded-full" />
            <span>{isThai ? 'เกณฑ์เฉลี่ย (60)' : 'Avg (60)'}</span>
          </span>
        </div>

        {onOpenCoachRadar && (
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              onOpenCoachRadar();
            }}
            className="no-doodle text-[11px] font-medium text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1 cursor-pointer whitespace-nowrap"
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
                className={`no-doodle py-1.5 px-1 rounded-[12px] transition-all cursor-pointer tabular-nums ${
                  isSelected
                    ? 'bg-[#eff6ff] ring-1 ring-[#3b82f6]/40'
                    : 'bg-[#f5f5f7] hover:bg-[#ececef]'
                }`}
              >
                <div
                  className={`text-[9px] font-semibold uppercase ${
                    isSelected ? 'text-[#2563eb]' : 'text-[#71717a]'
                  }`}
                >
                  {m.code}
                </div>
                <div className="text-[13px] font-bold text-[#111111] leading-tight mt-0.5">
                  {m.current}
                </div>
                <div
                  className={`text-[9px] font-semibold ${
                    m.delta >= 0 ? 'text-[#15803d]' : 'text-[#dc2626]'
                  }`}
                >
                  {m.delta >= 0 ? `+${m.delta}` : m.delta}
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-3 py-2 rounded-[14px] bg-[#f5f5f7] flex items-center justify-between gap-2 text-[11px]">
          <div className="min-w-0">
            <span className="font-semibold text-[#111111]">
              {isThai ? activeAxis.labelTh : activeAxis.labelEn} ({activeAxis.code}):{' '}
            </span>
            <span className="text-[#52525b]">
              {isThai ? activeAxis.tipTh : activeAxis.tipEn}
            </span>
          </div>
          <span className="font-bold text-[#2563eb] tabular-nums shrink-0 whitespace-nowrap">
            {activeAxis.current}/100
          </span>
        </div>
      </div>
    </div>
  );
};
