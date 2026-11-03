/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Zap, TrendingUp, Sparkles, Video, Award, ChevronRight, Dumbbell, Activity, Shield, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const D1_AICoachDashboardScreen: React.FC = () => {
  const { player, navigateTo } = useApp();
  const [showPastComparison, setShowPastComparison] = useState(true);

  // 5-axis Radar Coordinates
  const cx = 120;
  const cy = 120;
  const maxR = 85;

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

  const MOMENTUM_POINTS = [
    { time: 'Set 1 (0-11)', stamina: 96, label: 'High Press' },
    { time: 'Set 1 (12-21)', stamina: 89, label: 'Dominant' },
    { time: 'Set 2 (0-11)', stamina: 82, label: 'Stable' },
    { time: 'Set 2 (12-21)', stamina: 74, label: 'Fatigue Onset' },
    { time: 'Set 3 (Crunch)', stamina: 65, label: 'Sub-300km/h' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#06070a] pb-6">
      <MobileHeader title="AI Performance Hub" subtitle="Biomechanical Analytics & Radar" />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Athlete Status Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#121622] via-[#0b0e16] to-[#0a0d14] border border-white/[0.08] shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={player.avatarUrl}
                alt={player.name}
                className="w-12 h-12 rounded-2xl object-cover border border-white/[0.12]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-[#d4ff00] text-black font-black text-[9px] rounded font-mono">
                {player.tier.slice(0, 3)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-white">{player.name}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                Lv.{player.level} Court Master · <span className="text-[#d4ff00]">{player.currentExp}</span>/{player.nextLevelExp} EXP
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateTo('F1')}
            className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white flex items-center justify-center border border-white/[0.08] cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-[#d4ff00]" />
          </button>
        </div>

        {/* 5-Axis Radar Chart Container */}
        <div className="p-4 rounded-3xl bg-[#0b0e16] border border-white/[0.08] shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#d4ff00] font-bold tracking-wider uppercase">
                SKILL RADAR ENGINE
              </span>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#d4ff00]" />
                <span>Athlete Power Index (85 OVR)</span>
              </h3>
            </div>

            <button
              onClick={() => setShowPastComparison(!showPastComparison)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                showPastComparison
                  ? 'bg-[#d4ff00]/15 text-[#d4ff00] border-[#d4ff00]/40'
                  : 'bg-white/[0.03] text-slate-400 border-white/[0.08]'
              }`}
            >
              {showPastComparison ? 'Compare: ON' : 'Compare: OFF'}
            </button>
          </div>

          {/* SVG Radar */}
          <div className="flex items-center justify-center py-1">
            <svg width="240" height="240" className="overflow-visible select-none">
              {/* Concentric Polygons */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, i) => {
                const ringPoints = [0, 1, 2, 3, 4].map((idx) => {
                  const pt = getPoint(level * 100, idx);
                  return `${pt.x},${pt.y}`;
                }).join(' ');
                return (
                  <polygon
                    key={i}
                    points={ringPoints}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                    strokeDasharray={level === 1.0 ? '0' : '2 3'}
                  />
                );
              })}

              {/* Axis Rays */}
              {[0, 1, 2, 3, 4].map((idx) => {
                const pt = getPoint(100, idx);
                return (
                  <line
                    key={idx}
                    x1={cx}
                    y1={cy}
                    x2={pt.x}
                    y2={pt.y}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Past Comparison */}
              {showPastComparison && (
                <polygon
                  points={pastPolygon}
                  fill="rgba(59, 130, 246, 0.12)"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* Current Radar */}
              <polygon
                points={currentPolygon}
                fill="rgba(212, 255, 0, 0.22)"
                stroke="#d4ff00"
                strokeWidth="2.5"
              />

              {/* Points */}
              {currentStats.map((s, i) => {
                const pt = getPoint(s.val, i);
                return (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#d4ff00"
                    stroke="#07080c"
                    strokeWidth="2"
                  />
                );
              })}

              {/* Labels */}
              <text x={cx} y={cy - maxR - 8} textAnchor="middle" fill="#d4ff00" fontSize="10" fontWeight="bold" fontFamily="monospace">
                POW ({player.skillRadar.power})
              </text>
              <text x={cx + maxR + 8} y={cy - 18} textAnchor="start" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">
                SPD ({player.skillRadar.speed})
              </text>
              <text x={cx + 42} y={cy + maxR + 14} textAnchor="start" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">
                CTL ({player.skillRadar.control})
              </text>
              <text x={cx - 42} y={cy + maxR + 14} textAnchor="end" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">
                STA ({player.skillRadar.stamina})
              </text>
              <text x={cx - maxR - 8} y={cy - 18} textAnchor="end" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">
                TAC ({player.skillRadar.tactics})
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-5 text-[10px] text-slate-400 pt-2 border-t border-white/[0.06] font-mono">
            <span className="flex items-center gap-1.5 text-[#d4ff00]">
              <span className="w-2 h-2 rounded-full bg-[#d4ff00]" />
              Current Lv.12 (85 OVR)
            </span>
            {showPastComparison && (
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Previous Baseline (+11 OVR)
              </span>
            )}
          </div>
        </div>

        {/* Biometric Stamina Curve */}
        <div className="p-4 rounded-3xl bg-[#0b0e16] border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Stamina & Fatigue Curve</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Velocity Decay</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {MOMENTUM_POINTS.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[10px]">
                <span className="w-24 font-mono text-slate-400 truncate">{pt.time}</span>
                <div className="flex-1 h-2.5 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4ff00] to-emerald-400 rounded-full"
                    style={{ width: `${pt.stamina}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono font-bold text-slate-200">
                  {pt.stamina}%
                </span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-white/[0.06]">
            ⚠️ AI Alert: ความเร็วหัวไม้ลูกตบลดลง 14% ในแต้มดิวซ์ท้ายเกมเนื่องจากแกนกลางลำตัวล้า
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => navigateTo('D2')}
            className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-left cursor-pointer transition-colors group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#d4ff00]/15 text-[#d4ff00] flex items-center justify-center mb-2">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-[#d4ff00] transition-colors">
              AI Action Drills
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">แบบฝึกซ้อมแก้จุดอ่อน</div>
          </button>

          <button
            onClick={() => navigateTo('D3')}
            className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-left cursor-pointer transition-colors group"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-400/15 text-cyan-400 flex items-center justify-center mb-2">
              <Video className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
              Computer Vision
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">วิเคราะห์สรีระและมุมสวิง</div>
          </button>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="px-4 pt-2 shrink-0">
        <button
          onClick={() => navigateTo('D2')}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-[#d4ff00] hover:bg-[#bbf000] text-black font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(212,255,0,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>ดูภารกิจรับ EXP & แบบฝึกซ้อมวันนี้</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
