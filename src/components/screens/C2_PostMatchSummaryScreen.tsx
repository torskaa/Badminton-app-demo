/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, Flame, Zap, Award, Sparkles, ChevronRight, BarChart3, Share2, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const C2_PostMatchSummaryScreen: React.FC = () => {
  const { match, player, navigateTo } = useApp();

  const isWinner = match.winner === 'A' || match.scoreA >= match.scoreB;

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title="สรุปผลการแข่งขัน & แจกรางวัล" />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Victory Header */}
        <div className="text-center pt-2">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-2xl ${
              isWinner
                ? 'bg-gradient-to-tr from-lime-400 to-lime-300 text-slate-950 shadow-[0_0_30px_rgba(204,255,0,0.5)] animate-bounce'
                : 'bg-gradient-to-tr from-slate-700 to-slate-600 text-slate-200'
            }`}
          >
            <Trophy className="w-9 h-9 stroke-[2.3]" />
          </div>

          <div className="text-[11px] font-mono font-bold tracking-widest text-lime-400 uppercase">
            {isWinner ? 'MATCH VICTORY!' : 'MATCH COMPLETED'}
          </div>
          <h2 className="text-2xl font-black text-white mt-0.5">
            {isWinner ? 'ยินดีด้วย! คุณคว้าชัยชนะ' : 'สู้ได้ดีมากในเกมนี้!'}
          </h2>
          <p className="text-xs text-slate-400">
            {match.playerAName} vs {match.playerBName}
          </p>
        </div>

        {/* Sets Score Breakdown */}
        <div className="p-3.5 rounded-2xl bg-[#0f1422] border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 font-mono mb-2">FINAL SCORE SUMMARY</div>
          <div className="flex items-center justify-center gap-6">
            <div>
              <div className="text-xs font-bold text-slate-300">ทีมกานต์ (A)</div>
              <div className="text-3xl font-black text-lime-400 font-mono">
                {match.setsWonA || 2}
              </div>
            </div>
            <div className="text-sm font-mono text-slate-500 font-bold">SET RATIO</div>
            <div>
              <div className="text-xs font-bold text-slate-300">ทีมคู่แข่ง (B)</div>
              <div className="text-3xl font-black text-slate-400 font-mono">
                {match.setsWonB || 0}
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-center gap-3 text-xs font-mono text-slate-300">
            <span className="px-2 py-0.5 bg-slate-900 rounded">Set 1: 21-17</span>
            <span className="px-2 py-0.5 bg-slate-900 rounded">Set 2: 21-19</span>
          </div>
        </div>

        {/* EXP Payout Breakdown with Animation styling */}
        <div className="p-4 rounded-3xl bg-gradient-to-b from-slate-900 to-[#0e1320] border border-lime-400/40 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-lime-400 fill-lime-400" />
              <span>EXP & REWARD RECAP</span>
            </span>
            <span className="text-base font-black text-lime-400 font-mono">
              +400 EXP
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>ฐานการเล่นแมตช์เต็ม (Match Completed)</span>
              <span className="font-mono text-lime-400">+250 EXP</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>โบนัสตบวินเนอร์ (Smash Winner Bonus x8)</span>
              <span className="font-mono text-lime-400">+100 EXP</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>โบนัส Match MVP ยอดเยี่ยม</span>
              <span className="font-mono text-lime-400">+50 EXP</span>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="pt-2 border-t border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Player Lv.{player.level} (Court Master)</span>
              <span className="text-lime-400 font-mono font-bold">
                {player.currentExp} / {player.nextLevelExp} EXP
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-lime-500 to-lime-300 rounded-full transition-all duration-700 shadow-[0_0_8px_#ccff00]"
                style={{
                  width: `${Math.min(100, (player.currentExp / player.nextLevelExp) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Streak & Badge Unlock Pill Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Streak Boost */}
          <div className="p-3 rounded-2xl bg-[#141b2a] border border-amber-500/30 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="text-[10px] text-amber-400 font-bold uppercase">
                STREAK ACTIVE!
              </div>
              <div className="text-xs font-black text-white">
                4-Week Streak 🔥
              </div>
              <div className="text-[9px] text-slate-400">เล่นต่อเนื่องไม่ขาด</div>
            </div>
          </div>

          {/* Badge Unlocked */}
          <div className="p-3 rounded-2xl bg-[#141b2a] border border-lime-400/30 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-lime-400 font-bold uppercase">
                BADGE UNLOCKED
              </div>
              <div className="text-xs font-black text-white truncate">
                Smash King II 👑
              </div>
              <div className="text-[9px] text-slate-400">ตบชนะสะสม 50 แต้ม</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation to Diagnostics or Social Card */}
      <div className="px-4 space-y-2 pt-2 shrink-0">
        <button
          onClick={() => navigateTo('C3')}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 font-black text-sm shadow-[0_4px_16px_rgba(204,255,0,0.35)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <BarChart3 className="w-4 h-4 stroke-[2.5]" />
          <span>เจาะลึก AI Match Diagnostics (ดู Weak Zone)</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>

        <button
          onClick={() => navigateTo('C4')}
          className="w-full min-h-[44px] py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-lime-400" />
          <span>ดูการ์ดสรุปผล Match Recap Card (แชร์ IG / TikTok)</span>
        </button>
      </div>
    </div>
  );
};
