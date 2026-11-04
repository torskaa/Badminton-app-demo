import React, { useState } from 'react';
import { Trophy, Medal, Zap, Flame, Crown, ChevronRight, TrendingUp, Filter, Swords, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { PlayerTier } from '../../types';

export const E4_GroupLeaderboardScreen: React.FC = () => {
  const { leaderboard, player, navigateTo } = useApp();
  const [selectedTierFilter, setSelectedTierFilter] = useState<'All' | PlayerTier>('All');

  const filteredList = leaderboard.filter((item) => {
    if (selectedTierFilter === 'All') return true;
    return item.tier === selectedTierFilter;
  });

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none">
      <MobileHeader title="ตารางอันดับก๊วน & SEASON TIER" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Season Header Banner - Slush Voltage Violet Sticker */}
        <div className="p-5 rounded-[28px] bg-[#5c4ade] text-white border-[1.5px] border-black space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="px-3 py-1 rounded-full bg-[#ffd731] text-black border border-black font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 fill-black" />
              SEASON 4: BANGKOK CLASH
            </span>
            <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-mono font-bold text-white">
              14 DAYS LEFT
            </span>
          </div>

          <h2 className="text-xl font-['Antonio',sans-serif] font-black uppercase tracking-tight text-white pt-1">
            ตารางจัดอันดับก๊วนตบสนั่น พระราม 9
          </h2>
          <p className="text-xs text-white/90 font-bold">
            สะสม Win Rate และ Smash Winner Points เพื่อเลื่อนชั้นสู่ Diamond Tier
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigateTo('E3')}
              className="px-3 py-1.5 rounded-full bg-[#ffd731] text-black border border-black font-['Antonio',sans-serif] font-black text-xs uppercase flex items-center gap-1 hover:bg-[#ffe366] cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>เปิดระบบจับคู่ AI Matchmaker</span>
            </button>
          </div>
        </div>

        {/* Tier Filter Pills - Slush Hand-Cut Sticker Style */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {['All', 'Diamond', 'Gold', 'Silver', 'Bronze'].map((tier) => (
            <button
              type="button"
              key={tier}
              onClick={() => setSelectedTierFilter(tier as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-['Antonio',sans-serif] font-black uppercase shrink-0 cursor-pointer transition-all border-[1.5px] border-black ${
                selectedTierFilter === tier
                  ? 'bg-black text-[#ffd731]'
                  : 'bg-white text-black hover:bg-[#ffd731]/40'
              }`}
            >
              {tier === 'All' ? 'ทั้งหมด (ALL TIERS)' : `${tier} LEAGUE`}
            </button>
          ))}
        </div>

        {/* Ranked Players List */}
        <div className="space-y-2.5">
          {filteredList.map((item) => {
            const isUser = item.name.includes('กานต์') || item.rank === 1;
            const rankBg =
              item.rank === 1
                ? 'bg-[#ffd731]' // Sunburst gold
                : item.rank === 2
                ? 'bg-white'
                : item.rank === 3
                ? 'bg-[#e9ccff]' // Lavender
                : isUser
                ? 'bg-[#55db9c]' // Mint Pop
                : 'bg-white';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-[24px] border-[1.5px] border-black transition-all flex items-center justify-between ${rankBg}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full border border-black flex items-center justify-center font-['Antonio',sans-serif] font-black text-sm shrink-0 ${
                      item.rank === 1
                        ? 'bg-black text-[#ffd731]'
                        : item.rank === 2
                        ? 'bg-[#5c4ade] text-white'
                        : item.rank === 3
                        ? 'bg-[#fb4903] text-white'
                        : 'bg-black/10 text-black'
                    }`}
                  >
                    {item.rank}
                  </div>

                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border-[1.5px] border-black bg-white"
                  />

                  <div>
                    <div className="text-xs font-extrabold text-black flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.rank === 1 && <Crown className="w-3.5 h-3.5 text-[#fb4903] fill-[#fb4903]" />}
                      {isUser && (
                        <span className="px-1.5 py-0.2 rounded-full bg-black text-[#55db9c] text-[8px] font-black font-mono">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-black/70 font-black font-mono mt-0.5">
                      OVR {item.ovr} · {item.tier} LEAGUE
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-['Antonio',sans-serif] font-black text-black">
                    {item.exp.toLocaleString()} EXP
                  </div>
                  <div className="text-[10px] text-[#fb4903] font-black">
                    WIN {item.winRate}% ({item.totalGames}G)
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Challenge Action CTA Card */}
        <div className="p-4 rounded-[28px] bg-white border-[1.5px] border-black flex items-center justify-between">
          <div>
            <div className="text-xs font-black uppercase text-black font-['Antonio',sans-serif]">
              ท้าดวลอันดับ 1 ก๊วน (CHALLENGE S1)
            </div>
            <div className="text-[10px] text-black/70 font-bold">
              จัดทีมสลับมือแบบสมดุล AI Balance 50/50
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('E3')}
            className="px-4 py-2 rounded-full bg-[#fb4903] text-white border-[1.5px] border-black font-['Antonio',sans-serif] font-black text-xs uppercase flex items-center gap-1 hover:bg-[#ff5d1e] active:scale-95 cursor-pointer"
          >
            <span>ท้าดวล</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

