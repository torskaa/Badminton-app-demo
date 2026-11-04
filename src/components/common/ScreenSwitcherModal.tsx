/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Compass, Star, ChevronRight, Zap, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';

interface ScreenSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PathCategory {
  title: string;
  code: string;
  badge: string;
  color: string;
  screens: {
    id: ScreenId;
    stepNo: string;
    title: string;
    description: string;
    actionTag: string;
  }[];
}

export const ScreenSwitcherModal: React.FC<ScreenSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentScreen, navigateTo } = useApp();

  const PATH_GROUPS: PathCategory[] = [
    {
      title: 'PATH A: ONBOARDING & SETUP',
      code: 'PATH A',
      badge: 'Welcome',
      color: '#dceeff',
      screens: [
        { id: 'A1', stepNo: 'A1', title: 'Welcome Hero & Value Prop', description: 'Hero visual, instant booking intro, start onboarding', actionTag: 'Get Started' },
        { id: 'A2', stepNo: 'A2', title: 'Athlete Playstyle Setup', description: 'Hand dominance, playstyle archetype, skill assessment', actionTag: 'Build Profile' },
      ],
    },
    {
      title: 'PATH B: COURT DISCOVERY & BOOKING',
      code: 'PATH B',
      badge: 'Booking',
      color: '#55db9c',
      screens: [
        { id: 'B1', stepNo: 'B1', title: 'Court Discovery & GPS Map', description: 'Browse BWF Taraflex courts, search Rama 9 & Thonglor', actionTag: 'Find Court' },
        { id: 'B2', stepNo: 'B2', title: 'Court Slot & Schedule Picker', description: 'Select Court 1-4, prime time 2x EXP bonus slots', actionTag: 'Choose Time' },
        { id: 'B3', stepNo: 'B3', title: 'PromptPay Checkout & Slip Verify', description: 'Thai QR payment, simulated bank slip verification', actionTag: 'Pay Now' },
        { id: 'B4', stepNo: 'B4', title: 'Booking Confirmed & E-Ticket Pass', description: 'Digital check-in QR code pass + 100 EXP reward drop', actionTag: 'View Ticket' },
      ],
    },
    {
      title: 'PATH C: IN-MATCH SCORING & ANALYTICS',
      code: 'PATH C',
      badge: 'Courtside',
      color: '#ffd731',
      screens: [
        { id: 'C1', stepNo: 'C1', title: 'Courtside Live Score Tracker', description: 'Thumb-friendly scoring, quick tag shots & unforced errors', actionTag: 'Live Match' },
        { id: 'C2', stepNo: 'C2', title: 'Post-Match Summary & EXP Payout', description: 'Match breakdown, animated XP gains, streak boost', actionTag: 'EXP Payout' },
        { id: 'C3', stepNo: 'C3', title: 'AI Match Diagnostics & Heatmap', description: 'Shot win-rates, 2D weak zone interactive heatmap', actionTag: 'AI Heatmap' },
        { id: 'C4', stepNo: 'C4', title: 'Athlete Recap Card (Shareable)', description: 'FUT / Wrapped athlete share card for Instagram', actionTag: 'Recap Card' },
      ],
    },
    {
      title: 'PATH D: AI COACH & SKILL-UP HUB',
      code: 'PATH D',
      badge: 'AI Coach',
      color: '#e9ccff',
      screens: [
        { id: 'D1', stepNo: 'D1', title: 'AI Coach Dashboard & 5-Axis Radar', description: 'Power, Speed, Control, Stamina, Tactics radar stats', actionTag: 'Coach Hub' },
        { id: 'D2', stepNo: 'D2', title: 'Daily Quests & Skill Drills', description: 'Quests: Smash King, Iron Lung, Early Bird + claim EXP', actionTag: 'Drill Quests' },
        { id: 'D3', stepNo: 'D3', title: 'Computer Vision Video Analysis', description: 'Replay scan, 342 km/h smash speed & joint angles', actionTag: 'Vision Scan' },
      ],
    },
    {
      title: 'PATH E: COMMUNITY & GUILD HUB',
      code: 'PATH E',
      badge: 'Guilds',
      color: '#fb4903',
      screens: [
        { id: 'E1', stepNo: 'E1', title: 'Bangkok Smashers Guild HQ', description: 'Guild roster, community chat, active court parties', actionTag: 'Guild Tavern' },
        { id: 'E2', stepNo: 'E2', title: 'Group Event & Court RSVP', description: '4-player court reservation, headcount, +50 EXP RSVP', actionTag: 'Event RSVP' },
        { id: 'E3', stepNo: 'E3', title: 'AI Smart Matchmaker (Duel)', description: '96% compatibility matchmaking with sparring partner', actionTag: 'Find Partner' },
        { id: 'E4', stepNo: 'E4', title: 'Guild & Arena Leaderboard', description: 'Rankings, top smashers, Master/Diamond league', actionTag: 'Leaderboard' },
      ],
    },
    {
      title: 'PATH F: PROFILE & WEARABLE SYNC',
      code: 'PATH F',
      badge: 'Athlete',
      color: '#4da2ff',
      screens: [
        { id: 'F1', stepNo: 'F1', title: 'Athlete Profile & Trophy Cabinet', description: 'FIFA athlete card, Yonex Astrox 99 gear, trophy badges', actionTag: 'My Profile' },
        { id: 'F2', stepNo: 'F2', title: 'Smartwatch Health & Battery Sync', description: 'Live heart rate BPM, convert 680 kcal to +136 EXP', actionTag: 'Watch Sync' },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="w-full max-w-xl bg-[#dceeff] border-2 border-black rounded-t-[36px] sm:rounded-[36px] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-black font-['Plus_Jakarta_Sans',sans-serif]"
          >
            {/* Slush Sticker Header */}
            <div className="p-4 bg-white border-b border-black flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#ffd731] border border-black flex items-center justify-center font-bold text-black shadow-xs">
                  <Compass className="w-5 h-5 stroke-[2.4]" />
                </div>
                <div>
                  <h3 className="font-['Antonio'] text-2xl font-black uppercase tracking-tight text-black leading-none">
                    ALL 18 SCREENS DIRECTORY
                  </h3>
                  <p className="text-xs text-neutral-600 font-medium mt-0.5">
                    Click any screen below to test the full interactive flow
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 text-black border border-black flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* List of 18 Screens in Groups */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-[#dceeff]">
              {PATH_GROUPS.map((group) => (
                <div key={group.code} className="bg-white border border-black rounded-[24px] p-3.5 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-full border border-black text-[10px] font-extrabold uppercase text-black"
                        style={{ backgroundColor: group.color }}
                      >
                        {group.code}
                      </span>
                      <span className="font-['Antonio'] text-lg font-bold text-black uppercase tracking-tight">
                        {group.title}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.screens.map((screen) => {
                      const isActive = currentScreen === screen.id;
                      return (
                        <button
                          type="button"
                          key={screen.id}
                          onClick={() => {
                            navigateTo(screen.id);
                            onClose();
                          }}
                          className={`w-full text-left p-3 rounded-2xl transition-all border flex flex-col justify-between cursor-pointer ${
                            isActive
                              ? 'bg-[#ffd731] border-black text-black font-bold scale-[1.02]'
                              : 'bg-white hover:bg-[#dceeff]/50 border-black/80 text-black'
                          } active:scale-95`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-['Antonio'] text-base font-bold text-black">
                              {screen.stepNo}. {screen.title}
                            </span>
                            {isActive && (
                              <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-600 line-clamp-2 leading-snug font-normal mb-2">
                            {screen.description}
                          </p>
                          <div className="flex items-center justify-end">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black text-white text-[10px] font-bold">
                              <span>{screen.actionTag}</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Dismiss Pill */}
            <div className="p-3 bg-white border-t border-black flex items-center justify-between">
              <span className="text-xs text-neutral-600 font-medium">18 of 18 screens fully interactive</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-transform active:scale-95 cursor-pointer"
              >
                Close Directory
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
