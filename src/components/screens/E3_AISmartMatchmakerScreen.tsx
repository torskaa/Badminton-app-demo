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

  const PAIRING_OPTIONS = [
    {
      teamA: [
        { name: 'กานต์ (You)', ovr: 88, tier: 'Diamond', role: 'Smash Backcourt' },
        { name: 'พลอย จอมหยอด', ovr: 82, tier: 'Gold', role: 'Net Frontcourt' },
      ],
      teamB: [
        { name: 'โอห์ม ปืนกล', ovr: 86, tier: 'Diamond', role: 'Attacker' },
        { name: 'แบงค์ กำแพงเหล็ก', ovr: 84, tier: 'Gold', role: 'Defender' },
      ],
      teamAOvr: 85.0,
      teamBOvr: 85.0,
      winProbA: 50,
      winProbB: 50,
      balanceScore: '100% PERFECT 50/50 MATCH',
    },
    {
      teamA: [
        { name: 'กานต์ (You)', ovr: 88, tier: 'Diamond', role: 'Smash Backcourt' },
        { name: 'นัท เสิร์ฟพิฆาต', ovr: 78, tier: 'Silver', role: 'Flick Server' },
      ],
      teamB: [
        { name: 'ท็อป ดรายฟ์สายฟ้า', ovr: 84, tier: 'Gold', role: 'Drive Specialist' },
        { name: 'มีน แบ็กแฮนด์เทวะ', ovr: 81, tier: 'Silver', role: 'Control' },
      ],
      teamAOvr: 83.0,
      teamBOvr: 82.5,
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
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title="AI Smart Matchmaker" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Matchmaker Banner Card */}
        <div className="bg-white border border-black rounded-[32px] p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5c4ade] text-white border border-black text-[10px] font-black uppercase">
                AI Radar Balancing
              </span>
              <span className="text-xs font-bold text-neutral-600">MMR Skill Equalizer</span>
            </div>
            <h2 className="font-['Antonio'] text-3xl font-extrabold text-black uppercase tracking-tight leading-tight">
              FAIR PLAY MATCHMAKING
            </h2>
            <p className="text-xs text-neutral-600 font-medium">
              Eliminate one-sided games. AI matches team stats for a thrilling 50/50 clash.
            </p>
          </div>
        </div>

        {/* Balance Score Sticker Card */}
        <div className="p-3.5 rounded-[28px] bg-[#55db9c] border border-black flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-black stroke-[2.5]" />
            <span className="font-['Antonio'] text-xl font-extrabold text-black uppercase leading-none">
              {currentPairing.balanceScore}
            </span>
          </div>

          <button
            onClick={handleShuffle}
            className="px-3 py-1 rounded-full bg-white text-black border border-black text-xs font-bold hover:bg-neutral-100 flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Shuffle</span>
          </button>
        </div>

        {/* Versus Teams Split (Slush Cards) */}
        <div className="space-y-3">
          {/* Team A (Blue) */}
          <div className="bg-white border border-black rounded-[28px] p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#4da2ff] border border-black text-black text-[10px] font-black uppercase">
                Team A (Blue)
              </span>
              <span className="font-['Antonio'] text-xl font-bold text-black">
                {currentPairing.teamAOvr} OVR AVG ({currentPairing.winProbA}% Win)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {currentPairing.teamA.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-2xl bg-[#dceeff]/50 border border-black">
                  <div className="font-bold text-black truncate">{p.name}</div>
                  <div className="text-[10px] text-neutral-600 font-medium">{p.role} · {p.ovr} OVR</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <span className="font-['Antonio'] text-2xl font-black text-black px-4 py-1 rounded-full bg-white border border-black inline-block">
              VS
            </span>
          </div>

          {/* Team B (Yellow) */}
          <div className="bg-white border border-black rounded-[28px] p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ffd731] border border-black text-black text-[10px] font-black uppercase">
                Team B (Yellow)
              </span>
              <span className="font-['Antonio'] text-xl font-bold text-black">
                {currentPairing.teamBOvr} OVR AVG ({currentPairing.winProbB}% Win)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {currentPairing.teamB.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-2xl bg-[#ffd731]/30 border border-black">
                  <div className="font-bold text-black truncate">{p.name}</div>
                  <div className="text-[10px] text-neutral-600 font-medium">{p.role} · {p.ovr} OVR</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons (Direct flow into Match Logger C1) */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => navigateTo('C1')}
            className="w-full py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider border border-black flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Accept Duel & Start Match (Go to Courtside)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateTo('E4')}
              className="py-3 rounded-full bg-white hover:bg-neutral-100 border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <span>View Leaderboards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigateTo('E1')}
              className="py-3 rounded-full bg-white hover:bg-neutral-100 border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <span>Back to Guild</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
