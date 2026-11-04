/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Zap, TrendingUp, Sparkles, Video, Award, ChevronRight, Dumbbell, Activity, Shield, ArrowRight, Flame, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const D1_AICoachDashboardScreen: React.FC = () => {
  const { player, navigateTo } = useApp();
  const [showPastComparison, setShowPastComparison] = useState(true);

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
    <div className="flex-1 flex flex-col bg-[#dceeff] text-black select-none pb-24 overflow-y-auto no-scrollbar font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title="AI Coach & Skill Radar" />

      <div className="p-4 space-y-4">
        {/* Athlete Banner Profile (Slush Style) */}
        <div className="bg-white border border-black rounded-[32px] p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#ffd731] border border-black flex items-center justify-center font-['Antonio'] text-2xl font-black rotate-[-4deg]">
              JR
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-extrabold uppercase">
                  {player.tier} Tier
                </span>
                <span className="text-[11px] font-bold text-[#fb4903]">
                  🔥 {player.streakWeeks}-Week Streak
                </span>
              </div>
              <h2 className="font-['Antonio'] text-2xl font-black text-black uppercase leading-tight">
                {player.name}
              </h2>
              <p className="text-[11px] text-neutral-600 font-medium">
                {player.playstyle}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-neutral-500 uppercase">Athlete Lv.</span>
            <div className="font-['Antonio'] text-3xl font-extrabold text-black leading-none">
              {player.level}
            </div>
          </div>
        </div>

        {/* 5-Axis Skill Radar Card */}
        <div className="bg-white border border-black rounded-[32px] p-4 text-center shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-['Antonio'] text-xl font-bold uppercase tracking-tight text-black">
              5-Axis Skill Radar
            </h3>
            <button
              onClick={() => setShowPastComparison((prev) => !prev)}
              className="px-2.5 py-1 rounded-full bg-[#dceeff] border border-black text-[10px] font-bold cursor-pointer transition-transform active:scale-95"
            >
              {showPastComparison ? 'Compare: 30D' : 'Current Only'}
            </button>
          </div>

          {/* SVG Radar */}
          <div className="relative w-64 h-64 mx-auto my-2">
            <svg viewBox="0 0 260 260" className="w-full h-full">
              {/* Concentric Polygons */}
              {[0.25, 0.5, 0.75, 1.0].map((level, idx) => {
                const pts = [0, 1, 2, 3, 4].map((i) => {
                  const pt = getPoint(level * 100, i);
                  return `${pt.x},${pt.y}`;
                }).join(' ');
                return (
                  <polygon
                    key={idx}
                    points={pts}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="1"
                    strokeDasharray={idx < 3 ? '2 2' : 'none'}
                    opacity="0.3"
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
                    stroke="#000000"
                    strokeWidth="1"
                    opacity="0.25"
                  />
                );
              })}

              {/* Past Polygon (Lavender) */}
              {showPastComparison && (
                <polygon
                  points={pastPolygon}
                  fill="#e9ccff"
                  fillOpacity="0.4"
                  stroke="#5c4ade"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* Current Polygon (Mint Pop) */}
              <polygon
                points={currentPolygon}
                fill="#55db9c"
                fillOpacity="0.6"
                stroke="#000000"
                strokeWidth="2"
              />

              {/* Axis Labels */}
              {currentStats.map((s, i) => {
                const pt = getPoint(114, i);
                return (
                  <text
                    key={i}
                    x={pt.x}
                    y={pt.y + 4}
                    textAnchor="middle"
                    className="font-bold text-[10px] fill-black"
                  >
                    {s.label} ({s.val})
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-bold pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#55db9c] border border-black inline-block" />
              <span>Current (Overall 84)</span>
            </span>
            {showPastComparison && (
              <span className="flex items-center gap-1.5 text-neutral-600">
                <span className="w-3 h-3 rounded-full bg-[#e9ccff] border border-black inline-block" />
                <span>Last Month (76)</span>
              </span>
            )}
          </div>
        </div>

        {/* AI Sensei Coach Advice Bubble (Slush Sticker Card) */}
        <div className="bg-[#ffd731] border border-black rounded-[28px] p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-white border border-black flex items-center justify-center font-bold text-xs">
              🤖
            </span>
            <span className="font-['Antonio'] text-lg font-bold text-black uppercase tracking-tight">
              AI Coach Weekly Diagnostic
            </span>
          </div>
          <p className="text-xs text-neutral-800 leading-relaxed font-bold">
            "สปีดลูกตบจัมป์สแมชเพิ่มขึ้น +14 km/h! จุดที่ต้องโฟกัสในสัปดาห์นี้คือการดักลูกหยอดหน้าเน็ตฝั่งซ้าย เพื่อเพิ่มค่า Control ให้แตะ 80"
          </p>
        </div>

        {/* Navigation Action Buttons (Complete Flow) */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => navigateTo('D2')}
            className="w-full py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider border border-black flex items-center justify-between px-5 transition-transform active:scale-98 cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#ffd731] fill-current" />
              <span>Daily Quests & Skill Drills (+120 EXP)</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateTo('D3')}
              className="py-3 rounded-full bg-white hover:bg-neutral-100 border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-[#5c4ade]" />
              <span>Vision Pose Scan</span>
            </button>

            <button
              onClick={() => navigateTo('C1')}
              className="py-3 rounded-full bg-[#55db9c] hover:bg-[#68eab0] border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Start Live Match</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
