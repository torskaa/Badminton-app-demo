/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, RefreshCw, Zap, Trophy, Play, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const E3_AISmartMatchmakerScreen: React.FC = () => {
  const { currentEvent, navigateTo } = useApp();

  const [shuffleCount, setShuffleCount] = useState(0);

  // Balanced Pairings Presets that simulate AI MMR balance calculation
  const PAIRING_OPTIONS = [
    {
      teamA: [
        { name: 'กานต์ (You)', ovr: 85, tier: 'Diamond', role: 'Smash Backcourt' },
        { name: 'พลอย จอมหยอด', ovr: 80, tier: 'Gold', role: 'Net Frontcourt' },
      ],
      teamB: [
        { name: 'โอห์ม ปืนกล', ovr: 84, tier: 'Diamond', role: 'Attacker' },
        { name: 'แบงค์ กำแพงเหล็ก', ovr: 81, tier: 'Gold', role: 'Defender' },
      ],
      teamAOvr: 82.5,
      teamBOvr: 82.5,
      winProbA: 50,
      winProbB: 50,
      balanceScore: '100% PERFECT MATCH',
    },
    {
      teamA: [
        { name: 'กานต์ (You)', ovr: 85, tier: 'Diamond', role: 'Smash Backcourt' },
        { name: 'นัท เสิร์ฟพิฆาต', ovr: 76, tier: 'Silver', role: 'Flick Server' },
      ],
      teamB: [
        { name: 'ท็อป ดรายฟ์สายฟ้า', ovr: 82, tier: 'Gold', role: 'Drive Specialist' },
        { name: 'มีน แบ็กแฮนด์เทวะ', ovr: 77, tier: 'Silver', role: 'Control' },
      ],
      teamAOvr: 80.5,
      teamBOvr: 79.5,
      winProbA: 52,
      winProbB: 48,
      balanceScore: '98% HIGHLY COMPETITIVE',
    },
  ];

  const currentPairing = PAIRING_OPTIONS[shuffleCount % PAIRING_OPTIONS.length];

  const handleShuffle = () => {
    setShuffleCount((prev) => prev + 1);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title="AI Smart Team Matchmaker" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/30 space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wide">
              MMR Equalizer Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            AI ประเมิน OVR, Win Rate, และบทบาทตำแหน่ง (หน้าเน็ต/หลังคอร์ท) เพื่อจับคู่แข่งขัน 2v2 ให้ออกมาสูสีและสนุกที่สุด
          </p>
        </div>

        {/* Balance Metric Badge */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">ระดับความสูสี:</span>
          <span className="text-lime-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {currentPairing.balanceScore}
          </span>
        </div>

        {/* The VS Match Arena Box */}
        <div className="space-y-3">
          {/* Team A Box */}
          <div className="p-4 rounded-3xl bg-gradient-to-b from-[#141e2a] to-slate-900 border border-lime-400/40 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-lime-400 uppercase tracking-wider">
                TEAM A (ฝั่งคอร์ท 1)
              </span>
              <span className="text-xs font-black font-mono text-white">
                TEAM OVR: <span className="text-lime-400">{currentPairing.teamAOvr}</span>
              </span>
            </div>

            <div className="space-y-1.5">
              {currentPairing.teamA.map((p, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-lime-400/20 text-lime-400 font-bold flex items-center justify-center font-mono text-[10px]">
                      {p.name[0]}
                    </div>
                    <div>
                      <span className="font-bold text-white block">{p.name}</span>
                      <span className="text-[10px] text-slate-400">{p.role}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-lime-400 font-bold">{p.ovr} OVR</span>
                    <span className="text-[10px] text-slate-500 block">{p.tier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VS Divider & Projected Probability */}
          <div className="relative py-2 flex items-center justify-center">
            <div className="w-full border-t border-slate-800" />
            <div className="absolute px-3 py-1 bg-black border border-slate-700 rounded-full text-xs font-black font-mono text-white shadow-lg flex items-center gap-2">
              <span className="text-lime-400">{currentPairing.winProbA}%</span>
              <span className="text-slate-500">VS</span>
              <span className="text-amber-400">{currentPairing.winProbB}%</span>
            </div>
          </div>

          {/* Team B Box */}
          <div className="p-4 rounded-3xl bg-gradient-to-b from-[#201815] to-slate-900 border border-amber-500/40 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                TEAM B (ฝั่งคอร์ท 2)
              </span>
              <span className="text-xs font-black font-mono text-white">
                TEAM OVR: <span className="text-amber-400">{currentPairing.teamBOvr}</span>
              </span>
            </div>

            <div className="space-y-1.5">
              {currentPairing.teamB.map((p, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center font-mono text-[10px]">
                      {p.name[0]}
                    </div>
                    <div>
                      <span className="font-bold text-white block">{p.name}</span>
                      <span className="text-[10px] text-slate-400">{p.role}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-amber-400 font-bold">{p.ovr} OVR</span>
                    <span className="text-[10px] text-slate-500 block">{p.tier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Tactical Match Preview */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1">
          <span className="font-bold text-white">🏸 AI Tactical Forecast:</span>
          <p className="leading-relaxed text-slate-400">
            แมตช์นี้จะดวลกันด้วยสปีดเกมเร็ว Team A มีจุดเด่นเกมบุกหลังคอร์ท ส่วน Team B มีเกมรับเหนียวแน่น เหมาะสำหรับเล่น 3 เซตเต็มเพื่อความตื่นเต้น
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 space-y-2 pt-2 shrink-0">
        <button
          onClick={handleShuffle}
          className="w-full min-h-[46px] rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          <span>สุ่มจับคู่ใหม่ (Re-balance / Shuffle)</span>
        </button>

        <button
          onClick={() => navigateTo('C1')}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 font-black text-sm shadow-[0_4px_16px_rgba(204,255,0,0.35)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>ลงสนาม & เริ่มเปิดหน้าจดแต้มคู่นี้ (Quick Logger)</span>
        </button>
      </div>
    </div>
  );
};
