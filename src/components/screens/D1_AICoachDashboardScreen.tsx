import React, { useState } from 'react';
import { Zap, Sparkles, Video, Crown, Dumbbell, Shield, ArrowRight, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { ProSubscriptionModal } from '../common/ProSubscriptionModal';
import { playCoinSound } from '../../utils/retroAudio';

export const D1_AICoachDashboardScreen: React.FC = () => {
  const { player, navigateTo } = useApp();
  const [showPastComparison, setShowPastComparison] = useState(true);
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  // 5-axis Radar Coordinates
  const cx = 130;
  const cy = 130;
  const maxR = 90;

  const getPoint = (value: number, index: number, total: number = 5) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const currentStats = [
    { label: 'POW', full: 'Power (พลังตบ)', val: player.skillRadar.power },
    { label: 'SPD', full: 'Speed (สปีด)', val: player.skillRadar.speed },
    { label: 'CTL', full: 'Control (หยอด/คุม)', val: player.skillRadar.control },
    { label: 'STA', full: 'Stamina (ความอึด)', val: player.skillRadar.stamina },
    { label: 'TAC', full: 'Tactics (แท็กติก)', val: player.skillRadar.tactics },
  ];

  const pastStats = [
    { label: 'Power', val: player.pastRadar.power },
    { label: 'Speed', val: player.pastRadar.speed },
    { label: 'Control', val: player.pastRadar.control },
    { label: 'Stamina', val: player.pastRadar.stamina },
    { label: 'Tactics', val: player.pastRadar.tactics },
  ];

  const currentPolygon = currentStats.map((s, i) => {
    const pt = getPoint(s.val, i);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  const pastPolygon = pastStats.map((s, i) => {
    const pt = getPoint(s.val, i);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28 font-['Plus_Jakarta_Sans',sans-serif] bg-[#dceeff] text-[#000000]">
      <MobileHeader />

      <div className="p-4 space-y-4">
        {/* Main Body Page Title & Short Description */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#5c4ade] text-[#ffffff] border border-[#000000]">
              COACHING RADAR
            </span>
            <span className="text-[11px] font-bold text-[#000000]/60 uppercase tracking-[0.032em]">
              PERFORMANCE OVERVIEW
            </span>
          </div>
          <h1 className="font-['Antonio',sans-serif] text-3xl font-black uppercase tracking-tight leading-none text-[#000000]">
            AI COACH & SKILL RADAR
          </h1>
          <p className="text-xs text-[#000000]/70 font-medium leading-relaxed">
            ระบบวิเคราะห์ฟอร์มการเล่น 5 มิติ ติดตามพัฒนาการรายเดือน และแนะนำแบบฝึกซ้อมเฉพาะบุคคล
          </p>
        </div>

        {/* 1. Athlete Banner Profile Card */}
        <div className="border border-[#000000] rounded-[32px] p-4 bg-[#ffffff] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#000000]/15">
            <div>
              <span className="font-['Antonio',sans-serif] text-xs font-black uppercase tracking-wider text-[#000000]">
                ATHLETE IDENTITY (ข้อมูลนักกีฬา)
              </span>
              <p className="text-[10px] text-[#000000]/60 font-bold">
                ระดับเทียร์ สถิติสตรีคชนะ และสไตล์การเล่นของคุณ
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#ffd731] text-[#000000] border border-[#000000]">
              {player.tier} TIER
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-[20px] border border-[#000000] overflow-hidden bg-[#e9ccff] shrink-0">
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-['Antonio',sans-serif] text-xl font-black uppercase leading-tight text-[#000000]">
                  {player.name}
                </h2>
                <p className="text-[11px] text-[#000000]/70 font-bold">
                  {player.playstyle}
                </p>
                <span className="text-[11px] font-bold text-[#ff5c34]">
                  🔥 {player.streakWeeks}-Week Streak Active
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-[0.032em]">Level</span>
              <div className="font-['Antonio',sans-serif] text-3xl font-black text-[#5c4ade] leading-none">
                {player.level}
              </div>
            </div>
          </div>
        </div>

        {/* 2. SmashAI Pro Upgrade Banner */}
        <div className="border border-[#000000] rounded-[28px] p-4 bg-[#ffd731] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#000000]" />
              <span className="font-['Antonio',sans-serif] text-xs font-black uppercase tracking-wider text-[#000000]">
                PRO ATHLETE MEMBERSHIP (สิทธิพิเศษ)
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#000000]/70">฿199/ด.</span>
          </div>
          <p className="text-[10px] text-[#000000]/80 font-bold">
            ส่วนลดค่าคอร์ท 10% ทุกสนามพันธมิตร · สแกนวิดีโอ 3D วิเคราะห์ฟอร์มไม่จำกัด
          </p>
          <div className="pt-1 flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#000000]">
              {player.tier === 'Pro' ? 'สถานะ: สมาชิก PRO ใช้งานได้เต็มระบบ' : 'ปลดล็อกสิทธิพิเศษนักกีฬาแบบเต็มรูปแบบ'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsProModalOpen(true);
                playCoinSound();
              }}
              className="px-3.5 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] font-bold text-[11px] uppercase tracking-[0.032em] hover:bg-[#1a1a1a] transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
            >
              {player.tier === 'Pro' ? 'ดูสถานะ PRO' : 'อัปเกรด PRO'}
            </button>
          </div>
        </div>

        {/* 3. 5-Axis Skill Radar Card */}
        <div className="border border-[#000000] rounded-[32px] p-4 bg-[#ffffff] space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-['Antonio',sans-serif] text-base font-black uppercase tracking-wide text-[#000000]">
                5-AXIS AI SKILL RADAR
              </h3>
              <p className="text-[10px] text-[#000000]/60 font-bold">
                เรดาร์วัดทักษะ 5 ด้าน คำนวณจากสถิติแข่งขัน 30 วัน (Power, Speed, Control, Stamina, Tactics)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPastComparison((prev) => !prev)}
              className="px-3 py-1 rounded-[1600px] text-[10px] font-bold tracking-[0.032em] cursor-pointer transition-transform active:scale-95 border border-[#000000] bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9] shrink-0 whitespace-nowrap"
            >
              {showPastComparison ? '✓ Past 30D Active' : 'Show Past 30D'}
            </button>
          </div>

          {/* SVG Radar Chart */}
          <div className="w-full flex justify-center py-2">
            <svg width={260} height={260} className="overflow-visible">
              {/* Concentric Background Polygons */}
              {[0.25, 0.5, 0.75, 1.0].map((level, lIdx) => {
                const ringPoints = [0, 1, 2, 3, 4].map((i) => {
                  const pt = getPoint(level * 100, i);
                  return `${pt.x},${pt.y}`;
                }).join(' ');
                return (
                  <polygon
                    key={lIdx}
                    points={ringPoints}
                    fill="none"
                    stroke="rgba(0,0,0,0.12)"
                    strokeWidth={1}
                  />
                );
              })}

              {/* Axis lines */}
              {[0, 1, 2, 3, 4].map((i) => {
                const pt = getPoint(100, i);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={pt.x}
                    y2={pt.y}
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth={1}
                  />
                );
              })}

              {/* Past 30D Comparison Polygon */}
              {showPastComparison && (
                <polygon
                  points={pastPolygon}
                  fill="rgba(204, 204, 204, 0.35)"
                  stroke="#666666"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              )}

              {/* Current Active Polygon */}
              <polygon
                points={currentPolygon}
                fill="rgba(77, 162, 255, 0.28)"
                stroke="#5c4ade"
                strokeWidth={2.5}
              />

              {/* Data points */}
              {currentStats.map((s, i) => {
                const pt = getPoint(s.val, i);
                return (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={4}
                    fill="#ffd731"
                    stroke="#000000"
                    strokeWidth={1.5}
                  />
                );
              })}

              {/* Text Labels around radar */}
              {currentStats.map((s, i) => {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                const labelR = maxR + 18;
                const lx = cx + labelR * Math.cos(angle);
                const ly = cy + labelR * Math.sin(angle);
                return (
                  <text
                    key={i}
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#000000"
                    fontSize={11}
                    fontWeight="800"
                    fontFamily="Antonio, sans-serif"
                  >
                    {s.label} ({s.val})
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Quick Legend */}
          <div className="flex items-center justify-center gap-4 text-[11px] font-bold pt-2 border-t border-[#000000]/15">
            <div className="flex items-center gap-1.5 text-[#5c4ade]">
              <span className="w-2.5 h-2.5 rounded-[1600px] bg-[#5c4ade] border border-[#000000]" />
              <span>Current Form (ปัจจุบัน)</span>
            </div>
            {showPastComparison && (
              <div className="flex items-center gap-1.5 text-[#000000]/60">
                <span className="w-3 h-0.5 bg-[#000000]/40" />
                <span>Past 30 Days</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. AI Head Coach Advice */}
        <div className="border border-[#000000] rounded-[28px] p-4 space-y-2.5 bg-[#ffffff]">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[1600px] bg-[#55db9c] border border-[#000000] text-[#000000] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h4 className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
                AI HEAD COACH DIAGNOSTICS (วิเคราะห์ฟอร์ม)
              </h4>
              <p className="text-[10px] text-[#000000]/60 font-bold">
                สรุปจุดแข็งและข้อผิดพลาดล่าสุด พร้อมทางลัดสู่แบบฝึกซ้อมและสแกนกล้อง 3D
              </p>
            </div>
          </div>

          <p className="text-xs text-[#000000]/80 leading-relaxed font-medium">
            พลังตบ Smash ของคุณอยู่ในระดับท็อป <strong>(Power 88 / 342 km/h)</strong> แต่ยังมีจุดที่ต้องพัฒนาในเรื่อง <strong>การตัดหยอดหน้าเน็ต (Control 76)</strong> แนะนำให้ฝึกซ้อม Split-step drills สัปดาห์ละ 2 ครั้งเพื่อลด Unforced errors
          </p>

          <div className="pt-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigateTo('D2')}
              className="py-3 px-2 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-transform active:scale-95 border border-[#000000] bg-[#000000] text-[#ffffff] hover:bg-[#1a1a1a] cursor-pointer whitespace-nowrap"
            >
              <Dumbbell className="w-4 h-4 shrink-0" />
              <span>AI QUESTS (D2)</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('D3')}
              className="py-3 px-2 rounded-[1600px] font-bold text-xs border border-[#000000] flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9] uppercase tracking-[0.032em] whitespace-nowrap"
            >
              <Video className="w-4 h-4 text-[#5c4ade] shrink-0" />
              <span>VISION SCAN (D3)</span>
            </button>
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
