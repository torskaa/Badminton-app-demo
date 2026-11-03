/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Zap, Trophy, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExpCelebrationModal: React.FC = () => {
  const { expCelebration, dismissExpCelebration, player } = useApp();

  if (!expCelebration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-xs bg-gradient-to-b from-[#161f33] to-[#0d1320] border-2 border-lime-400/50 rounded-3xl p-6 text-center shadow-[0_0_50px_rgba(204,255,0,0.25)] relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-lime-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Floating icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-lime-500 to-lime-300 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(204,255,0,0.6)] animate-bounce">
          {expCelebration.newLevel ? (
            <Trophy className="w-9 h-9 stroke-[2.4]" />
          ) : expCelebration.badgeUnlocked ? (
            <Award className="w-9 h-9 stroke-[2.4]" />
          ) : (
            <Zap className="w-9 h-9 stroke-[2.4]" />
          )}
        </div>

        {/* Celebration titles */}
        {expCelebration.newLevel ? (
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-lime-400 mb-1">
              LEVEL UP!
            </div>
            <h3 className="text-xl font-extrabold text-white">
              ยินดีด้วย! คุณเลเวล {expCelebration.newLevel} แล้ว
            </h3>
            <p className="text-xs text-slate-300 mt-1">ยศ Court Master ปลดล็อกพลังใหม่</p>
          </div>
        ) : (
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-lime-400 mb-1">
              EXP REWARD EARNED
            </div>
            <h3 className="text-2xl font-black text-white flex items-center justify-center gap-1.5">
              <span>+{expCelebration.amount}</span>
              <span className="text-lime-400 text-lg">EXP</span>
            </h3>
          </div>
        )}

        {/* Reason pill */}
        <div className="my-3 py-2 px-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
          <p className="font-medium text-slate-200">{expCelebration.source}</p>
          {expCelebration.badgeUnlocked && (
            <p className="text-amber-400 font-semibold text-[11px] mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> ปลดล็อกเหรียญ: {expCelebration.badgeUnlocked}
            </p>
          )}
        </div>

        {/* Player Level Progress Preview */}
        <div className="space-y-1 mb-5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Player Lv.{player.level}</span>
            <span className="text-lime-400 font-mono">
              {player.currentExp} / {player.nextLevelExp} EXP
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-lime-500 to-lime-300 rounded-full transition-all duration-500 shadow-[0_0_8px_#ccff00]"
              style={{
                width: `${Math.min(100, (player.currentExp / player.nextLevelExp) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Claim / Dismiss Button */}
        <button
          onClick={dismissExpCelebration}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 font-bold text-sm shadow-[0_4px_16px_rgba(204,255,0,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>เก็บรางวัล & ลุยต่อ</span>
        </button>
      </div>
    </div>
  );
};
