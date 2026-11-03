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
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title="ตารางอันดับก๊วน & Season Tier" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Season Header Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-[#12192b] border border-amber-400/40 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-amber-400" />
              SEASON 4: NOVEMBER CLASH
            </span>
            <span className="text-[10px] text-slate-400 font-mono">เหลืออีก 14 วัน</span>
          </div>

          <h2 className="text-base font-black text-white">
            ตารางจัดอันดับก๊วนตบสนั่น พระราม 9
          </h2>
          <p className="text-[11px] text-slate-300">
            สะสม Win Rate และ Smash Winner Points เพื่อเลื่อนชั้นสู่ Diamond Tier
          </p>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {['All', 'Diamond', 'Gold', 'Silver', 'Bronze'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTierFilter(tier as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-colors ${
                selectedTierFilter === tier
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tier === 'All' ? 'ทั้งหมด (All Tiers)' : `${tier} League`}
            </button>
          ))}
        </div>

        {/* Podium Top 3 Visual (if All selected) */}
        {selectedTierFilter === 'All' && (
          <div className="grid grid-cols-3 gap-2 pt-2 items-end">
            {/* Rank 2 (You) */}
            <div className="p-2.5 rounded-2xl bg-gradient-to-t from-slate-900 to-[#131b2c] border border-slate-700 text-center flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center font-mono mb-1">
                2
              </div>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-lime-400 mb-1">
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-[11px] font-bold text-lime-400 truncate w-full">กานต์ (You)</div>
              <div className="text-[9px] text-slate-400 font-mono">68.5% WIN</div>
            </div>

            {/* Rank 1 (Art) */}
            <div className="p-3 rounded-2xl bg-gradient-to-t from-slate-900 to-[#221c10] border-2 border-amber-400 text-center flex flex-col items-center -translate-y-2 shadow-[0_0_20px_rgba(251,191,36,0.25)]">
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400 mb-1" />
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 font-black text-sm flex items-center justify-center mb-1 font-mono">
                ART
              </div>
              <div className="text-xs font-black text-amber-400 truncate w-full">อาร์ท สปีดโบ๊ท</div>
              <div className="text-[10px] text-white font-mono font-bold">74.2% WIN</div>
              <div className="text-[8px] text-amber-300 font-mono mt-0.5">SMASH GOD ⚡</div>
            </div>

            {/* Rank 3 (Ohm) */}
            <div className="p-2.5 rounded-2xl bg-gradient-to-t from-slate-900 to-[#131b2c] border border-slate-700 text-center flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center font-mono mb-1">
                3
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center font-mono mb-1">
                OHM
              </div>
              <div className="text-[11px] font-bold text-white truncate w-full">โอห์ม ปืนกล</div>
              <div className="text-[9px] text-slate-400 font-mono">66.0% WIN</div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Rows */}
        <div className="space-y-1.5 pt-1">
          {filteredList.map((user) => {
            const isCurrentPlayer = user.id === player.id;
            return (
              <div
                key={user.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                  isCurrentPlayer
                    ? 'bg-gradient-to-r from-lime-950/50 via-[#131d2c] to-slate-900 border-lime-400 shadow-md ring-1 ring-lime-400/40'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-black text-[11px] shrink-0 ${
                      user.rank === 1
                        ? 'bg-amber-400 text-slate-950'
                        : user.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : user.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {user.rank}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-extrabold truncate ${isCurrentPlayer ? 'text-lime-400' : 'text-white'}`}>
                        {user.name}
                      </span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-amber-400 font-mono font-bold">
                        {user.tier}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {user.guildTitle}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-white font-bold">{user.winRate}%</div>
                  <div className="text-[10px] text-lime-400">{user.smashPoints} Smash Pts</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action to Profile */}
      <div className="px-4 pt-2 shrink-0">
        <button
          onClick={() => navigateTo('F1')}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 font-black text-sm shadow-[0_4px_16px_rgba(204,255,0,0.35)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trophy className="w-4 h-4 stroke-[2.5]" />
          <span>ดูตู้เหรียญรางวัลของคุณ (Trophy Cabinet)</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
