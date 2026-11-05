import React, { useState } from 'react';
import { Sparkles, RefreshCw, Zap, Trophy, Play, Users, ArrowRight, ShieldCheck, Swords } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const E3_AISmartMatchmakerScreen: React.FC = () => {
  const { navigateTo, gainExp } = useApp();
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

  const handleAcceptDuel = () => {
    gainExp(40, 'เริ่มการแข่งขันแมตช์สลับมือสมดุล AI');
    navigateTo('C1');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      <MobileHeader title="AI Smart Matchmaker" showBack />

      <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16">
        {/* Matchmaker Banner Card */}
        <div className="border border-[#000000] rounded-[32px] p-5 bg-[#ffffff]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#5c4ade] text-[#ffffff] border border-[#000000]">
                AI Radar Balancing
              </span>
              <span className="text-xs font-bold text-[#000000]/60">MMR Skill Equalizer</span>
            </div>
            <h2 className="font-['Antonio',sans-serif] text-2xl font-black uppercase leading-tight tracking-tight text-[#000000]">
              FAIR PLAY MATCHMAKING
            </h2>
            <p className="text-xs text-[#000000]/70 font-medium mt-0.5">
              จัดทีมสลับมือแบบสมดุล หมดปัญหามือห่าง เกมขาด ด้วยอัลกอริทึม 50/50
            </p>
          </div>
        </div>

        {/* Balance Score Card */}
        <div className="p-4 rounded-[26px] border border-[#000000] flex items-center justify-between bg-[#55db9c] text-[#000000]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#000000] stroke-[2.5]" />
            <span className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wide">
              {currentPairing.balanceScore}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShuffle}
            className="px-3 py-1.5 rounded-[1600px] border border-[#000000] text-xs font-bold uppercase tracking-[0.032em] flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>สลับคู่ใหม่</span>
          </button>
        </div>

        {/* Balanced Teams Display */}
        <div className="grid grid-cols-2 gap-3">
          {/* Team A */}
          <div className="border border-[#000000] rounded-[28px] p-4 bg-[#ffd731] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-['Antonio',sans-serif] text-base font-black uppercase text-[#000000]">TEAM A</span>
              <span className="text-xs font-black text-[#000000]">OVR {currentPairing.teamAOvr}</span>
            </div>
            <div className="space-y-2">
              {currentPairing.teamA.map((p, i) => (
                <div key={i} className="p-2.5 rounded-[18px] bg-[#ffffff] border border-[#000000] text-xs">
                  <span className="font-bold block truncate text-[#000000]">{p.name}</span>
                  <span className="text-[10px] text-[#000000]/60 block">{p.role}</span>
                </div>
              ))}
            </div>
            <div className="text-center pt-1 font-['Antonio',sans-serif] text-sm font-black text-[#000000]">
              โอกาสชนะ {currentPairing.winProbA}%
            </div>
          </div>

          {/* Team B */}
          <div className="border border-[#000000] rounded-[28px] p-4 bg-[#e9ccff] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-['Antonio',sans-serif] text-base font-black uppercase text-[#000000]">TEAM B</span>
              <span className="text-xs font-black text-[#000000]">OVR {currentPairing.teamBOvr}</span>
            </div>
            <div className="space-y-2">
              {currentPairing.teamB.map((p, i) => (
                <div key={i} className="p-2.5 rounded-[18px] bg-[#ffffff] border border-[#000000] text-xs">
                  <span className="font-bold block truncate text-[#000000]">{p.name}</span>
                  <span className="text-[10px] text-[#000000]/60 block">{p.role}</span>
                </div>
              ))}
            </div>
            <div className="text-center pt-1 font-['Antonio',sans-serif] text-sm font-black text-[#000000]">
              โอกาสชนะ {currentPairing.winProbB}%
            </div>
          </div>
        </div>

        {/* Accept Duel CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleAcceptDuel}
            className="w-full py-3.5 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-[#ffffff] shrink-0" />
            <span className="whitespace-nowrap">ACCEPT DUEL & START MATCH (C1)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
