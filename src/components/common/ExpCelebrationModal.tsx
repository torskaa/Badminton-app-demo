/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Award, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-xs bg-white border border-black rounded-[36px] p-6 text-center relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] text-black shadow-2xl"
          >
            {/* Floating Top Sticker Accent */}
            <div className="w-16 h-16 rounded-3xl bg-[#ffd731] border border-black text-black flex items-center justify-center mx-auto mb-3 rotate-[-6deg] hover:rotate-3 transition-transform">
              {expCelebration.newLevel ? (
                <Trophy className="w-9 h-9 stroke-[2.4]" />
              ) : expCelebration.badgeUnlocked ? (
                <Award className="w-9 h-9 stroke-[2.4]" />
              ) : (
                <Zap className="w-9 h-9 fill-current stroke-[2.4]" />
              )}
            </div>

            {/* Celebration titles with Crushed Display Font */}
            {expCelebration.newLevel ? (
              <div>
                <div className="text-[12px] font-extrabold uppercase text-[#5c4ade] mb-0.5 tracking-wide">
                  LEVEL UP!
                </div>
                <h3 className="font-['Antonio'] text-3xl font-extrabold text-black uppercase leading-tight tracking-tight">
                  LEVEL {expCelebration.newLevel} REACHED
                </h3>
                <p className="text-xs text-neutral-600 mt-1 font-medium">Court Master Tier Unlocked</p>
              </div>
            ) : (
              <div>
                <div className="text-[11px] font-extrabold uppercase text-[#fb4903] mb-0.5 tracking-wide">
                  REWARD EARNED
                </div>
                <h3 className="font-['Antonio'] text-4xl font-extrabold text-black uppercase leading-none tracking-tight">
                  +{expCelebration.amount} EXP
                </h3>
              </div>
            )}

            {/* Reason card */}
            <div className="my-3 py-2.5 px-3 rounded-2xl bg-[#dceeff] border border-black text-xs text-black">
              <p className="font-bold">{expCelebration.source}</p>
              {expCelebration.badgeUnlocked && (
                <p className="text-[#fb4903] font-extrabold text-[11px] mt-1 flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Unlocked Badge: {expCelebration.badgeUnlocked}</span>
                </p>
              )}
            </div>

            {/* Level progress bar */}
            <div className="w-full bg-[#e9e9e9] border border-black rounded-full h-3 mb-4 overflow-hidden p-0.5">
              <div
                className="bg-[#55db9c] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (player.currentExp / player.nextLevelExp) * 100)}%` }}
              />
            </div>

            {/* Continue button */}
            <button
              type="button"
              onClick={dismissExpCelebration}
              className="w-full py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wide border border-black cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>Claim & Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
