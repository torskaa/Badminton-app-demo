/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Zap, ChevronRight, Activity, ArrowRight, ShieldAlert, Sparkles, Check, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const C3_AIDiagnosticsScreen: React.FC = () => {
  const { navigateTo, gainExp } = useApp();
  const [selectedZone, setSelectedZone] = useState<string>('front-left');
  const [drillAdded, setDrillAdded] = useState(false);

  const ZONE_INFO: Record<string, { name: string; errors: number; advice: string; tag: string; color: string }> = {
    'front-left': {
      name: 'Forehand Net Zone',
      errors: 6,
      advice: '4 net-tape errors detected. Keep racket head at eye level and bend knees before contacting shuttle.',
      tag: 'Need Practice',
      color: '#fb4903',
    },
    'front-right': {
      name: 'Backhand Net Zone',
      errors: 2,
      advice: 'Net slice and kill execution was solid with an 80% point conversion rate.',
      tag: 'Strong Zone',
      color: '#55db9c',
    },
    'mid-left': {
      name: 'Midcourt Left (Drive)',
      errors: 3,
      advice: 'Fast recovery lag detected after jump smash (0.4s delay in split-step readiness).',
      tag: 'Caution',
      color: '#ffd731',
    },
    'mid-right': {
      name: 'Midcourt Right (Intercept)',
      errors: 1,
      advice: 'Solid court coverage; intercepted 90% of opponent cross-court returns.',
      tag: 'Excellent',
      color: '#4da2ff',
    },
    'back-left': {
      name: 'Backhand Deep Corner',
      errors: 7,
      advice: 'Critical weak zone! Late racket face angle caused 5 out-wide baseline errors.',
      tag: 'Critical Weakness',
      color: '#fb4903',
    },
    'back-right': {
      name: 'Smash Power Hotspot',
      errors: 2,
      advice: 'Primary winner hotspot! 8 jump smash winners with average 312 km/h velocity.',
      tag: 'Winner Hotspot',
      color: '#ffd731',
    },
  };

  const currentZone = ZONE_INFO[selectedZone];

  const handleAddDrill = () => {
    setDrillAdded(true);
    gainExp(80, 'เพิ่มแบบฝึกซ้อมแก้จุดอ่อนหน้าเน็ตเข้าตารางซ้อม');
    setTimeout(() => {
      navigateTo('D2');
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title="AI Match Diagnostics" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Header Intro Banner */}
        <div className="bg-white border border-black rounded-[28px] p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#fb4903] text-white border border-black text-[10px] font-black uppercase">
              AI Vision Heatmap
            </span>
            <span className="text-xs font-bold text-neutral-600">Court 3 Match Diagnostics</span>
          </div>
          <h2 className="font-['Antonio'] text-3xl font-extrabold text-black uppercase tracking-tight leading-tight">
            2D WEAKNESS HEATMAP
          </h2>
          <p className="text-xs text-neutral-600 font-medium">
            Tap any court zone below to view shot statistics and AI coaching drills.
          </p>
        </div>

        {/* 2D Badminton Court Interactive Map (Slush Style) */}
        <div className="bg-white border border-black rounded-[32px] p-4 text-center shadow-xs">
          <div className="relative w-full max-w-[280px] h-60 mx-auto bg-[#55db9c]/30 border-2 border-black rounded-2xl p-2 flex flex-col justify-between relative overflow-hidden">
            {/* Net Divider */}
            <div className="absolute top-1/2 inset-x-0 h-1 bg-black z-10 flex items-center justify-center">
              <span className="px-2 py-0.2 bg-white border border-black text-[9px] font-black uppercase">
                NET
              </span>
            </div>

            {/* Top Half (Opponent side) */}
            <div className="grid grid-cols-2 gap-1.5 h-[46%] opacity-60">
              <div className="rounded-xl border border-dashed border-black/40 flex items-center justify-center text-[10px] font-bold">
                Opponent L
              </div>
              <div className="rounded-xl border border-dashed border-black/40 flex items-center justify-center text-[10px] font-bold">
                Opponent R
              </div>
            </div>

            {/* Bottom Half (Player Zones - Clickable) */}
            <div className="grid grid-cols-2 gap-1.5 h-[46%] z-20">
              <button
                type="button"
                onClick={() => setSelectedZone('front-left')}
                className={`rounded-xl border-2 transition-transform cursor-pointer flex flex-col items-center justify-center p-1 ${
                  selectedZone === 'front-left' ? 'scale-105 border-black shadow-xs font-extrabold' : 'border-black/60'
                }`}
                style={{ backgroundColor: ZONE_INFO['front-left'].color }}
              >
                <span className="text-[10px] font-bold text-black">Net Forehand</span>
                <span className="text-[9px] font-black px-1.5 py-0.2 bg-black text-white rounded-full">
                  6 Errs
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedZone('front-right')}
                className={`rounded-xl border-2 transition-transform cursor-pointer flex flex-col items-center justify-center p-1 ${
                  selectedZone === 'front-right' ? 'scale-105 border-black shadow-xs font-extrabold' : 'border-black/60'
                }`}
                style={{ backgroundColor: ZONE_INFO['front-right'].color }}
              >
                <span className="text-[10px] font-bold text-black">Net Backhand</span>
                <span className="text-[9px] font-black px-1.5 py-0.2 bg-white text-black border border-black rounded-full">
                  80% Win
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedZone('back-left')}
                className={`rounded-xl border-2 transition-transform cursor-pointer flex flex-col items-center justify-center p-1 ${
                  selectedZone === 'back-left' ? 'scale-105 border-black shadow-xs font-extrabold' : 'border-black/60'
                }`}
                style={{ backgroundColor: ZONE_INFO['back-left'].color }}
              >
                <span className="text-[10px] font-bold text-black">Deep Backhand</span>
                <span className="text-[9px] font-black px-1.5 py-0.2 bg-black text-white rounded-full">
                  7 Errs
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedZone('back-right')}
                className={`rounded-xl border-2 transition-transform cursor-pointer flex flex-col items-center justify-center p-1 ${
                  selectedZone === 'back-right' ? 'scale-105 border-black shadow-xs font-extrabold' : 'border-black/60'
                }`}
                style={{ backgroundColor: ZONE_INFO['back-right'].color }}
              >
                <span className="text-[10px] font-bold text-black">Smash Hotspot</span>
                <span className="text-[9px] font-black px-1.5 py-0.2 bg-white text-black border border-black rounded-full">
                  8 Winners
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Zone Insight Card */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-['Antonio'] text-xl font-bold uppercase text-black">
              {currentZone.name}
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full border border-black text-[10px] font-black uppercase text-black"
              style={{ backgroundColor: currentZone.color }}
            >
              {currentZone.tag}
            </span>
          </div>

          <p className="text-xs text-neutral-700 leading-relaxed font-medium">
            {currentZone.advice}
          </p>

          <div className="pt-2">
            <button
              onClick={handleAddDrill}
              className="w-full py-3 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs border border-black flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-[#ffd731] text-[#ffd731]" />
              <span>{drillAdded ? 'Added! Going to Quests...' : 'Add AI Drill to Quest Board (+80 EXP)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Navigations */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => navigateTo('C4')}
            className="py-3 rounded-full bg-[#ffd731] hover:bg-[#ffe259] border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>FUT Athlete Card</span>
          </button>

          <button
            onClick={() => navigateTo('D1')}
            className="py-3 rounded-full bg-white hover:bg-neutral-100 border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>AI Coach Radar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
