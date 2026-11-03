/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, Medal, Zap, Flame, Crown, ChevronRight, TrendingUp, Filter } from 'lucide-react';
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
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title="ตารางอันดับก๊วน & Season Tier" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Season Header Banner */}
        <div className="p-5 rounded-3xl bg-[#111318] text-white space-y-2 shadow-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono font-black text-[#d8ff00] uppercase tracking-widest flex items-center gap-1.5">
              <Crown className="w-4 h-4 fill-current" />
              SEASON 4: NOVEMBER CLASH
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">14 days left</span>
          </div>

          <h2 className="text-base font-black tracking-tight">
            ตารางจัดอันดับก๊วนตบสนั่น พระราม 9
          </h2>
          <p className="text-xs text-neutral-400 font-medium">
            สะสม Win Rate และ Smash Winner Points เพื่อเลื่อนชั้นสู่ Diamond Tier
          </p>
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {['All', 'Diamond', 'Gold', 'Silver', 'Bronze'].map((tier) => (
            <button
              type="button"
              key={tier}
              onClick={() => setSelectedTierFilter(tier as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 cursor-pointer transition-all ${
                selectedTierFilter === tier
                  ? 'bg-[#111318] text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80'
              }`}
            >
              {tier === 'All' ? 'ทั้งหมด (All Tiers)' : `${tier} League`}
            </button>
          ))}
        </div>

        {/* Top 3 Podium Cards */}
        <div className="space-y-2.5">
          {filteredList.map((item, idx) => {
            const isUser = item.name.includes('กานต์') || item.rank === 1;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-3xl border transition-all flex items-center justify-between shadow-xs ${
                  item.rank === 1
                    ? 'bg-gradient-to-r from-amber-50 to-white border-amber-300 ring-2 ring-amber-200/60'
                    : isUser
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-white border-neutral-200/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                      item.rank === 1
                        ? 'bg-amber-400 text-black shadow-xs'
                        : item.rank === 2
                        ? 'bg-neutral-300 text-neutral-800'
                        : item.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {item.rank}
                  </div>

                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                  />

                  <div>
                    <div className="text-xs font-extrabold text-neutral-900 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.rank === 1 && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-medium">
                      OVR {item.ovr} · {item.tier} League
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black font-mono text-neutral-900">
                    {item.exp.toLocaleString()} EXP
                  </div>
                  <div className="text-[10px] text-[#10b981] font-bold">
                    Win {item.winRate}% ({item.totalGames}G)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
