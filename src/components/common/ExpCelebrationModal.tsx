/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExpCelebrationModal: React.FC = () => {
  const { expCelebration, dismissExpCelebration, player } = useApp();

  return (
    <AnimatePresence>
      {expCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-xs bg-white border border-neutral-200 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden"
          >
        {/* Floating icon */}
        <div className="w-16 h-16 rounded-3xl bg-[#d8ff00] text-black flex items-center justify-center mx-auto mb-4 shadow-md animate-bounce">
          {expCelebration.newLevel ? (
            <Trophy className="w-9 h-9 stroke-[2.4]" />
          ) : expCelebration.badgeUnlocked ? (
            <Award className="w-9 h-9 stroke-[2.4]" />
          ) : (
            <Zap className="w-9 h-9 fill-current stroke-[2.4]" />
          )}
        </div>

        {/* Celebration titles */}
        {expCelebration.newLevel ? (
          <div>
            <div className="text-[11px] font-black tracking-widest uppercase text-[#0066ff] mb-1">
              LEVEL UP!
            </div>
            <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              ยินดีด้วย! คุณเลเวล {expCelebration.newLevel} แล้ว
            </h3>
            <p className="text-xs text-neutral-500 mt-1">ยศ Court Master ปลดล็อกพลังใหม่</p>
          </div>
        ) : (
          <div>
            <div className="text-[11px] font-black tracking-widest uppercase text-[#0066ff] mb-1">
              EXP REWARD EARNED
            </div>
            <h3 className="text-3xl font-black text-neutral-900 flex items-center justify-center gap-1 font-mono">
              <span>+{expCelebration.amount}</span>
              <span className="text-[#10b981] text-xl">EXP</span>
            </h3>
          </div>
        )}

        {/* Reason card */}
        <div className="my-3 py-2.5 px-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-700">
          <p className="font-bold">{expCelebration.source}</p>
          {expCelebration.badgeUnlocked && (
            <p className="text-amber-600 font-extrabold text-[11px] mt-1 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>ปลดล็อกเหรียญ: {expCelebration.badgeUnlocked}</span>
            </p>
          )}
        </div>

        {/* Level progress bar */}
        <div className="w-full bg-neutral-100 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#d8ff00] to-[#10b981] h-2 rounded-full"
            style={{ width: `${Math.min(100, (player.currentExp / player.nextLevelExp) * 100)}%` }}
          />
        </div>

        {/* Continue button */}
          <button
            type="button"
            onClick={dismissExpCelebration}
            className="w-full py-3.5 rounded-full bg-[#111318] hover:bg-[#1f2430] text-white text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer transition-all active:scale-98"
          >
            ลุยต่อ (Claim & Continue)
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
};
