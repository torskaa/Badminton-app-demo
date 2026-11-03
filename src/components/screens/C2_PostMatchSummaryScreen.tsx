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
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title="สรุปผลการแข่งขัน & แจกรางวัล" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Victory Header */}
        <div className="text-center pt-2">
          <div
            className={`w-16 h-16 rounded-3xl mx-auto mb-2.5 flex items-center justify-center shadow-md ${
              isWinner
                ? 'bg-[#d8ff00] text-black shadow-[0_0_25px_rgba(216,255,0,0.5)]'
                : 'bg-neutral-800 text-white'
            }`}
          >
            <Trophy className="w-9 h-9 stroke-[2.3]" />
          </div>

          <div className="text-[11px] font-mono font-bold tracking-widest text-[#0066ff] uppercase">
            {isWinner ? 'MATCH VICTORY!' : 'MATCH COMPLETED'}
          </div>
          <h2 className="text-2xl font-black text-neutral-900 mt-0.5 tracking-tight">
            {isWinner ? 'ยินดีด้วย! คุณคว้าชัยชนะ' : 'สู้ได้ดีมากในเกมนี้!'}
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            {match.playerAName} vs {match.playerBName}
          </p>
        </div>

        {/* Sets Score Breakdown Card */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs text-center">
          <div className="text-[10px] text-neutral-400 font-mono font-bold mb-3 uppercase tracking-wider">
            FINAL SCORE SUMMARY
          </div>
          <div className="flex items-center justify-center gap-8">
            <div>
              <div className="text-xs font-bold text-neutral-600">{match.playerAName}</div>
              <div className="text-4xl font-black text-[#10b981] font-mono mt-1">
                {match.setsWonA || 2}
              </div>
            </div>
            <div className="text-xs font-mono text-neutral-300 font-extrabold uppercase">SETS</div>
            <div>
              <div className="text-xs font-bold text-neutral-600">{match.playerBName}</div>
              <div className="text-4xl font-black text-neutral-400 font-mono mt-1">
                {match.setsWonB || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Gamification EXP & Badges Gained */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
              รางวัลที่ได้รับ (Rewards Gained)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#d8ff00] text-black text-[10px] font-black">
              +250 EXP EARNED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-neutral-900">3-Week Streak</div>
                <div className="text-[10px] text-neutral-500 font-medium">รักษาวินัยต่อเนื่อง 🔥</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-neutral-900">Smash King</div>
                <div className="text-[10px] text-neutral-500 font-medium">ตบทำแต้มครบ 50 ครั้ง</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-neutral-700">Player Level {player.level} (Diamond League)</span>
            <span className="text-neutral-900 font-mono">{player.currentExp} / {player.nextLevelExp} EXP</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d8ff00] to-[#10b981] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (player.currentExp / player.nextLevelExp) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="px-5 pt-3 border-t border-neutral-200 bg-white shrink-0 space-y-2">
        <button
          type="button"
          onClick={() => navigateTo('C3')}
          className="w-full h-14 bg-[#111318] hover:bg-[#1f2430] active:scale-[0.98] rounded-full p-2 flex items-center justify-between shadow-lg transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#d8ff00] text-black flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-white font-extrabold text-xs tracking-wider uppercase">
            ดู AI วิเคราะห์จุดอ่อนช็อตตบ (AI Diagnostics)
          </span>
          <div className="w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('C4')}
          className="w-full h-11 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>สร้างการ์ดแชร์ผลแมตช์ลงโซเชียล (Recap Card)</span>
        </button>
      </div>
    </div>
  );
};
