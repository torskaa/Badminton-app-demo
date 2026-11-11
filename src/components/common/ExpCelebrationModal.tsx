/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Toggle to show/hide character mascot without deleting any code
const SHOW_MASCOT = false;

export const ExpCelebrationModal: React.FC = () => {
  const { expCelebration, dismissExpCelebration, player, language } = useApp();
  const isThai = language === 'th';

  return (
    <AnimatePresence>
      {expCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-xs bg-white rounded-[36px] p-5 text-center relative overflow-hidden text-black shadow-2xl"
          >
            {/* Mascot Cheering Avatar Badge or Classic Badge */}
            {SHOW_MASCOT ? (
              <div className="relative mx-auto mb-2 flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-full overflow-hidden bg-[#243b34] p-0.5 border-3 border-[#ffd731] shadow-xl relative"
                >
                  <img
                    src="/assets/aistudio/Gemini_Generated_Image_b3fgwrb3fgwrb3fg_9069fb4e.jpeg"
                    alt="Smashy Cheering"
                    className="w-full h-full object-cover object-[51%_22%] scale-110"
                  />
                  <div className="absolute top-0 right-0 bg-[#fb4903] text-white text-[8px] font-black px-1.5 rounded-bl-md">
                    #15
                  </div>
                </motion.div>

                {/* Floating Star / Trophy Badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#ffd731] text-black flex items-center justify-center shadow-md">
                  {expCelebration.newLevel ? (
                    <Trophy className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Zap className="w-4 h-4 fill-current stroke-[2.5]" />
                  )}
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-3xl bg-[#ffd731] text-black flex items-center justify-center mx-auto mb-3 rotate-[-6deg] hover:rotate-3 transition-transform shadow-xs">
                {expCelebration.newLevel ? (
                  <Trophy className="w-9 h-9 stroke-[2.4]" />
                ) : expCelebration.badgeUnlocked ? (
                  <Award className="w-9 h-9 stroke-[2.4]" />
                ) : (
                  <Zap className="w-9 h-9 fill-current stroke-[2.4]" />
                )}
              </div>
            )}

            {/* Celebration titles with Crushed Display Font */}
            {expCelebration.newLevel ? (
              <div>
                <div className="text-[11px] font-extrabold uppercase text-[#5c4ade] mb-0.5 tracking-wide flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" />
                  LEVEL UP!
                </div>
                <h3 className="font-['Antonio',sans-serif] text-3xl font-extrabold text-black uppercase leading-tight tracking-tight">
                  LEVEL {expCelebration.newLevel} REACHED
                </h3>
                <p className="text-[11px] text-neutral-600 mt-0.5 font-medium">
                  {isThai ? 'ปลดล็อกสถานะยอดนักแบดมินตัน!' : 'Court Master Tier Unlocked'}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-[11px] font-extrabold uppercase text-[#fb4903] mb-0.5 tracking-wide flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current text-[#ffd731]" />
                  REWARD EARNED
                </div>
                <h3 className="font-['Antonio',sans-serif] text-4xl font-extrabold text-black uppercase leading-none tracking-tight">
                  +{expCelebration.amount} EXP
                </h3>
              </div>
            )}

            {/* Reason card */}
            <div className="my-2.5 py-2 px-3 rounded-2xl bg-[#dceeff] text-xs text-black shadow-xs">
              <p className="font-bold text-[11.5px] leading-snug">{expCelebration.source}</p>
              {expCelebration.badgeUnlocked && (
                <p className="text-[#fb4903] font-extrabold text-[10.5px] mt-1 flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Unlocked Badge: {expCelebration.badgeUnlocked}</span>
                </p>
              )}
            </div>

            {/* Companion Cheer Speech Bubble (when mascot enabled) */}
            {SHOW_MASCOT && (
              <div className="mb-3 px-3 py-1.5 rounded-xl bg-neutral-100 text-[10.5px] text-neutral-800 font-medium italic border border-neutral-200">
                {expCelebration.newLevel ? (
                  <span>
                    {isThai
                      ? 'สแมชชี่: "ยินดีด้วยครับเพื่อน! สแมชหนักขึ้นอีกขั้น ลุยต่อเลย!"'
                      : 'Smashy: "Level up! Your smashes are getting legendary, partner!"'}
                  </span>
                ) : (
                  <span>
                    {isThai
                      ? 'สแมชชี่: "เยี่ยมมาก! ทุกคะแนนและหยาดเหงื่อ พาเราเข้าใกล้แชมป์!"'
                      : 'Smashy: "Awesome effort! Every rally gets you closer to mastery!"'}
                  </span>
                )}
              </div>
            )}

            {/* Level progress bar */}
            <div className="w-full bg-[#e9e9e9] rounded-full h-2.5 mb-3.5 overflow-hidden p-0.5">
              <div
                className="bg-[#55db9c] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (player.currentExp / player.nextLevelExp) * 100)}%`,
                }}
              />
            </div>

            {/* Continue button (CTA preserves black border) */}
            <button
              type="button"
              onClick={dismissExpCelebration}
              className="w-full py-3 px-4 rounded-[1600px] bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs"
            >
              <span className="whitespace-nowrap">{isThai ? 'รับรางวัลและลุยต่อ' : 'CLAIM & CONTINUE'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
