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
      balanceScore: '100% PERFECT 50/50 MATCH',
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
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title="AI จัดคู่สูสี (Team Matchmaker)" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Matchmaker Banner */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#0066ff]" />
              <span className="text-[10px] font-bold text-[#0066ff] uppercase tracking-wider">
                Fair-Play Balancing Engine
              </span>
            </div>
            <h3 className="text-xs font-extrabold text-neutral-900 mt-0.5">
              คำนวณจาก Skill Radar & สถิติจริงของผู้เล่น
            </h3>
          </div>
          <button
            type="button"
            onClick={handleShuffle}
            className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>สับคู่ใหม่</span>
          </button>
        </div>

        {/* Win Probability & Balance Score Pill */}
        <div className="p-3.5 rounded-2xl bg-[#111318] text-white flex items-center justify-between shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#d8ff00]">
            {currentPairing.balanceScore}
          </span>
          <span className="text-xs font-mono font-bold">
            Win Prob: {currentPairing.winProbA}% vs {currentPairing.winProbB}%
          </span>
        </div>

        {/* Team A Card */}
        <div className="p-4 rounded-3xl bg-white border-2 border-[#111318] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-[#111318] text-white text-[10px] font-black uppercase">
              TEAM A (OVR {currentPairing.teamAOvr})
            </span>
            <span className="text-xs font-mono font-bold text-neutral-500">
              Win Rate Exp: {currentPairing.winProbA}%
            </span>
          </div>

          <div className="space-y-2">
            {currentPairing.teamA.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-extrabold text-neutral-900">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-medium">
                    {p.role} · {p.tier} League
                  </div>
                </div>
                <span className="text-base font-black font-mono text-neutral-900">
                  {p.ovr}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center font-black text-xs text-neutral-400 uppercase tracking-widest">
          VS
        </div>

        {/* Team B Card */}
        <div className="p-4 rounded-3xl bg-white border-2 border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-900 text-[10px] font-black uppercase">
              TEAM B (OVR {currentPairing.teamBOvr})
            </span>
            <span className="text-xs font-mono font-bold text-neutral-500">
              Win Rate Exp: {currentPairing.winProbB}%
            </span>
          </div>

          <div className="space-y-2">
            {currentPairing.teamB.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-extrabold text-neutral-900">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-medium">
                    {p.role} · {p.tier} League
                  </div>
                </div>
                <span className="text-base font-black font-mono text-neutral-900">
                  {p.ovr}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="px-5 pt-3 border-t border-neutral-200 bg-white shrink-0">
        <button
          type="button"
          onClick={() => navigateTo('C1')}
          className="w-full h-14 bg-[#111318] hover:bg-[#1f2430] active:scale-[0.98] rounded-full p-2 flex items-center justify-between shadow-lg transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#d8ff00] text-black flex items-center justify-center font-bold">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <span className="text-white font-extrabold text-xs tracking-wider uppercase">
            เริ่มแมตช์ด้วยคู่นี้ (Courtside Score Tracker)
          </span>
          <div className="w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>
      </div>
    </div>
  );
};
