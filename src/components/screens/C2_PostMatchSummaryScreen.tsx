/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trophy, Flame, Zap, Award, Sparkles, ChevronRight, BarChart3, Share2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const C2_PostMatchSummaryScreen: React.FC = () => {
  const { match, player, navigateTo } = useApp();

  const isWinner = match.winner === 'A' || match.scoreA >= match.scoreB;

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title="Match Victory Summary" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Slush Victory Trophy Header */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 rounded-3xl mx-auto mb-2.5 flex items-center justify-center bg-[#ffd731] border border-black rotate-[-6deg] shadow-xs">
            <Trophy className="w-9 h-9 text-black stroke-[2.3]" />
          </div>

          <div className="text-[11px] font-extrabold tracking-wider text-[#5c4ade] uppercase">
            {isWinner ? 'MATCH VICTORY!' : 'MATCH COMPLETED'}
          </div>
          <h2 className="font-['Antonio'] text-4xl font-extrabold text-black mt-0.5 tracking-tight uppercase leading-none">
            {isWinner ? 'CHAMPION OF THE COURT!' : 'GREAT MATCH EFFORT!'}
          </h2>
          <p className="text-xs text-neutral-600 font-bold mt-1">
            {match.playerAName} vs {match.playerBName}
          </p>
        </div>

        {/* Final Sets Score Breakdown Card */}
        <div className="bg-white border border-black rounded-[32px] p-4 text-center shadow-xs">
          <span className="px-3 py-0.5 rounded-full bg-[#dceeff] border border-black text-[10px] font-bold uppercase text-black inline-block mb-3">
            Final Sets Breakdown
          </span>
          <div className="flex items-center justify-center gap-8">
            <div>
              <div className="text-xs font-bold text-neutral-600">{match.playerAName}</div>
              <div className="font-['Antonio'] text-6xl font-extrabold text-black mt-1 leading-none">
                {match.setsWonA || 2}
              </div>
            </div>
            <div className="font-['Antonio'] text-xl text-neutral-400 font-black uppercase">VS</div>
            <div>
              <div className="text-xs font-bold text-neutral-600">{match.playerBName}</div>
              <div className="font-['Antonio'] text-6xl font-extrabold text-neutral-400 mt-1 leading-none">
                {match.setsWonB || 0}
              </div>
            </div>
          </div>
        </div>

        {/* EXP Reward Card */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black uppercase tracking-wide">
              Match Loot & Rewards
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#55db9c] border border-black text-black text-xs font-extrabold">
              +250 EXP Total
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#dceeff]/50 border border-black">
              <span>Match Play Reward</span>
              <span className="font-bold text-black">+150 EXP</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#ffd731]/40 border border-black">
              <span className="flex items-center gap-1 font-bold">
                <Flame className="w-3.5 h-3.5 text-[#fb4903] fill-current" />
                <span>3-Week Streak Bonus (1.5x)</span>
              </span>
              <span className="font-bold text-black">+75 EXP</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#e9ccff]/50 border border-black">
              <span className="font-bold text-black">Smash Specialist Bonus</span>
              <span className="font-bold text-black">+25 EXP</span>
            </div>
          </div>
        </div>

        {/* Complete Next Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => navigateTo('C3')}
            className="w-full py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider border border-black flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>AI Shot Diagnostics & Court Heatmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateTo('C4')}
              className="py-3 rounded-full bg-[#ffd731] hover:bg-[#ffe259] border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Recap Card (FUT)</span>
            </button>

            <button
              onClick={() => navigateTo('D1')}
              className="py-3 rounded-full bg-white hover:bg-neutral-100 border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>AI Coach Hub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
