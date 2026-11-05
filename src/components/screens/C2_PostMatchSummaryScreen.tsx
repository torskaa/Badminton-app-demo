import React from 'react';
import { Trophy, Flame, Zap, Award, BarChart3, Share2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const C2_PostMatchSummaryScreen: React.FC = () => {
  const { match, player, navigateTo } = useApp();
  const isWinner = match.winner === 'A' || match.scoreA >= match.scoreB;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      <MobileHeader title="Match Victory Summary" showBack />

      <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
        {/* Victory Trophy Header (Paper White, 1px black border, Antonio font) */}
        <div className="text-center pt-1 border border-[#000000] rounded-[32px] p-5 bg-[#ffffff]">
          <div className="w-16 h-16 rounded-[1600px] mx-auto mb-2.5 flex items-center justify-center bg-[#ffd731] border border-[#000000] text-[#000000]">
            <Trophy className="w-8 h-8 stroke-[2.3]" />
          </div>

          <span className="px-3 py-0.5 rounded-[1600px] text-[10px] font-bold tracking-[0.032em] uppercase bg-[#55db9c] border border-[#000000] text-[#000000] inline-block mb-1.5">
            {isWinner ? 'MATCH VICTORY!' : 'MATCH COMPLETED'}
          </span>
          <h2 className="font-['Antonio',sans-serif] text-3xl font-black tracking-tight uppercase leading-[0.85] text-[#000000]">
            {isWinner ? 'CHAMPION OF THE COURT' : 'GREAT MATCH EFFORT'}
          </h2>
          <p className="text-xs text-[#000000]/70 font-bold mt-2">
            {match.playerAName} vs {match.playerBName}
          </p>
        </div>

        {/* Final Sets Score Breakdown Card */}
        <div className="border border-[#000000] rounded-[32px] p-5 text-center bg-[#ffffff]">
          <span className="px-3 py-1 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#dceeff] border border-[#000000] inline-block mb-3">
            Final Sets Breakdown
          </span>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-xs font-bold text-[#000000]/70">{match.playerAName}</div>
              <div className="font-['Antonio',sans-serif] text-6xl font-black text-[#5c4ade] mt-1 leading-none">
                {match.setsWonA || 2}
              </div>
            </div>
            <div className="font-['Antonio',sans-serif] text-xl text-[#000000]/40 font-black uppercase">VS</div>
            <div className="text-center">
              <div className="text-xs font-bold text-[#000000]/70">{match.playerBName}</div>
              <div className="font-['Antonio',sans-serif] text-6xl font-black text-[#000000]/40 mt-1 leading-none">
                {match.setsWonB || 0}
              </div>
            </div>
          </div>
        </div>

        {/* EXP Reward Card */}
        <div className="border border-[#000000] rounded-[28px] p-4 space-y-3 bg-[#ffffff]">
          <div className="flex items-center justify-between">
            <span className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
              Match Loot & Rewards
            </span>
            <span className="px-3 py-0.5 rounded-[1600px] bg-[#ffd731] border border-[#000000] text-[#000000] text-xs font-black tracking-[0.032em]">
              +250 EXP Total
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-[16px] border border-[#000000] bg-[#ffffff]">
              <span className="font-bold text-[#000000]">Match Play Completion Reward</span>
              <span className="font-black text-[#5c4ade]">+150 EXP</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-[16px] border border-[#000000] bg-[#ffffff]">
              <span className="flex items-center gap-1.5 font-bold text-[#000000]">
                <Flame className="w-3.5 h-3.5 text-[#ff5c34] fill-[#ff5c34]" />
                <span>3-Week Active Streak Bonus (1.5x)</span>
              </span>
              <span className="font-black text-[#ff5c34]">+75 EXP</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-[16px] border border-[#000000] bg-[#ffffff]">
              <span className="font-bold text-[#000000]">Smash Winner Specialist Bonus</span>
              <span className="font-black text-[#55db9c]">+25 EXP</span>
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => navigateTo('C3')}
            className="w-full py-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] whitespace-nowrap"
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>AI SHOT DIAGNOSTICS (C3)</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigateTo('C4')}
              className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
            >
              <Share2 className="w-3.5 h-3.5 text-[#5c4ade] shrink-0" />
              <span>SHARE RECAP (C4)</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('D1')}
              className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
            >
              <span>AI COACH (D1)</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
