/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Zap, TrendingUp, Sparkles, Video, Award, ChevronRight, Dumbbell, Activity, Shield, ArrowUpRight, Flame } from 'lucide-react';
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
    <div className="flex-1 flex flex-col bg-[#f0f4f9] text-neutral-900 select-none pb-24 overflow-y-auto no-scrollbar">
      <MobileHeader title="AI Coach & Skill Radar" />

      <div className="p-4 space-y-4">
        {/* Athlete Banner Profile (Matches Image 2 & 3 Hero Banner) */}
        <div className="rounded-3xl p-5 bg-[#111318] text-white shadow-md relative overflow-hidden flex items-center justify-between">
          <div className="z-10">
            <span className="px-2.5 py-0.5 rounded-full bg-[#d8ff00] text-black text-[10px] font-black uppercase tracking-wider inline-block mb-1.5">
              Lv.{player.level} {player.tier} League
            </span>
            <h2 className="text-xl font-black tracking-tight">
              {player.name}
            </h2>
            <p className="text-xs text-neutral-400 font-medium mt-0.5">
              {player.playstyle}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs font-bold text-[#d8ff00] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {player.streakWeeks}-Week Streak
              </span>
              <span className="text-neutral-500">·</span>
              <span className="text-xs font-mono text-neutral-300">
                {player.stats.totalMatches} Matches
              </span>
            </div>
          </div>

          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80"
              alt="Player Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#d8ff00] shadow-md"
            />
          </div>
        </div>

        {/* 5-Axis Skill Radar Card */}
        <div className="p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#0066ff] uppercase tracking-wider block">
                Skill Evolution Radar
              </span>
              <h3 className="text-sm font-extrabold text-neutral-900 mt-0.5">
                เรดาร์ค่าพลัง 5 มิติ (FIFA Style)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowPastComparison(!showPastComparison)}
              className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] font-bold text-neutral-700 cursor-pointer transition-colors"
            >
              {showPastComparison ? 'ซ่อนกราฟอดีต' : 'เปรียบเทียบก่อนหน้า'}
            </button>
          </div>

          {/* SVG Radar */}
          <div className="flex justify-center items-center py-2">
            <svg width="260" height="260" className="overflow-visible">
              {/* Concentric Grid Circles */}
              {[0.25, 0.5, 0.75, 1].map((lvl) => {
                const r = maxR * lvl;
                return (
                  <circle
                    key={lvl}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray={lvl === 1 ? 'none' : '3,3'}
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
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Past Polygon (Gray) */}
              {showPastComparison && (
                <polygon
                  points={pastPolygon}
                  fill="#94a3b8"
                  fillOpacity="0.2"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
              )}

              {/* Current Polygon (Electric Neon Lime with border) */}
              <polygon
                points={currentPolygon}
                fill="#d8ff00"
                fillOpacity="0.45"
                stroke="#10b981"
                strokeWidth="2.5"
              />

              {/* Axis Labels */}
              {currentStats.map((s, i) => {
                const pt = getPoint(118, i);
                return (
                  <text
                    key={s.label}
                    x={pt.x}
                    y={pt.y + 4}
                    textAnchor="middle"
                    className="text-[10px] font-black fill-neutral-700 font-mono tracking-tight"
                  >
                    {s.label} ({s.val})
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Stats Bar List */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
            {currentStats.map((s) => (
              <div key={s.label} className="p-2.5 rounded-2xl bg-neutral-50 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">{s.label}:</span>
                <span className="font-extrabold text-neutral-900 font-mono">{s.val} / 100</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Action Hub / Fast Nav Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => navigateTo('D2')}
            className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs cursor-pointer hover:border-[#0066ff] hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#0066ff]/10 text-[#0066ff] flex items-center justify-center font-bold mb-2">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div className="text-xs font-black text-neutral-900 group-hover:text-[#0066ff] transition-colors">
              เควสต์ & แบบฝึก AI
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              3 Daily Quests รออยู่ (+300 EXP)
            </div>
          </div>

          <div
            onClick={() => navigateTo('D3')}
            className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs cursor-pointer hover:border-[#d8ff00] hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-2">
              <Video className="w-5 h-5" />
            </div>
            <div className="text-xs font-black text-neutral-900 group-hover:text-emerald-700 transition-colors">
              วิเคราะห์วิดีโอตบ
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              AI Skeleton Posture Tracking
            </div>
          </div>
        </div>

        {/* AI Coach Weakness Summary */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
              คำแนะนำประจำสัปดาห์ (AI Recommendation)
            </span>
            <span className="text-[10px] text-neutral-400">อัปเดตเมื่อ 1 ชั่วโมงที่แล้ว</span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed font-medium">
            พลังตบของคุณอยู่ในระดับท็อป 10% (362 km/h) แต่ความอึดในเซตที่ 3 ตกลงเหลือ 65% แนะนำซ้อม Multi-Shuttle Drills สัปดาห์ละ 2 ครั้งเพื่อเพิ่มความคงเส้นคงวา
          </p>
        </div>
      </div>
    </div>
  );
};
