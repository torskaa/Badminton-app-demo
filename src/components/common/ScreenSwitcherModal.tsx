/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, Check, ArrowRight } from 'lucide-react';
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
 screens: {
 id: ScreenId;
 stepNo: string;
 title: string;
 description: string;
 actionTag: string;
 }[];
}

export const ScreenSwitcherModal: React.FC<ScreenSwitcherModalProps> = ({ isOpen, onClose }) => {
 const { currentScreen, navigateTo, theme, dataMode, setDataMode } = useApp();
 const isDark = theme === 'dark';

 const PATH_GROUPS: PathCategory[] = [
 {
 title: 'PATH A: ONBOARDING & SETUP',
 code: 'PATH A',
 badge: 'Welcome',
 screens: [
 { id: 'A1', stepNo: 'A1', title: 'Welcome Hero & Value Prop', description: 'Hero visual, instant booking intro, start onboarding', actionTag: 'Get Started' },
 { id: 'A2', stepNo: 'A2', title: 'Athlete Playstyle Setup', description: 'Hand dominance, playstyle archetype, skill assessment', actionTag: 'Build Profile' },
 ],
 },
 {
 title: 'PATH B: COURT DISCOVERY & BOOKING',
 code: 'PATH B',
 badge: 'Booking',
 screens: [
 { id: 'B1', stepNo: 'B1', title: 'Court Discovery & Arenas', description: 'Browse BWF Taraflex courts, search Rama 9 & Thonglor', actionTag: 'Find Court' },
 { id: 'B2', stepNo: 'B2', title: 'Court Slot & Schedule Picker', description: 'Select Court 1-4, prime time 2x EXP bonus slots', actionTag: 'Choose Time' },
 { id: 'B3', stepNo: 'B3', title: 'PromptPay Checkout & Slip Verify', description: 'Thai QR payment, simulated bank slip verification', actionTag: 'Pay Now' },
 { id: 'B4', stepNo: 'B4', title: 'Booking Confirmed & E-Ticket Pass', description: 'Digital check-in QR code pass + 100 EXP reward drop', actionTag: 'View Ticket' },
 ],
 },
 {
 title: 'PATH C: IN-MATCH SCORING & ANALYTICS',
 code: 'PATH C',
 badge: 'Courtside',
 screens: [
 { id: 'C1', stepNo: 'C1', title: 'Courtside Live Score Tracker', description: 'Thumb-friendly scoring, audio commentary waves, shot tags', actionTag: 'Live Match' },
 { id: 'C2', stepNo: 'C2', title: 'Post-Match Summary & EXP Payout', description: 'Match breakdown, animated XP gains, streak boost', actionTag: 'EXP Payout' },
 { id: 'C3', stepNo: 'C3', title: 'AI Match Diagnostics & Heatmap', description: 'Shot win-rates, 2D weak zone interactive court heatmap', actionTag: 'AI Heatmap' },
 { id: 'C4', stepNo: 'C4', title: 'Athlete Recap Card (Shareable)', description: 'FUT / Wrapped gold athlete share card for Instagram', actionTag: 'Recap Card' },
 ],
 },
 {
 title: 'PATH D: AI COACH & SKILL-UP HUB',
 code: 'PATH D',
 badge: 'AI Coach',
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
 screens: [
 { id: 'F1', stepNo: 'F1', title: 'Athlete Profile & Trophy Cabinet', description: 'FIFA athlete card, Yonex Astrox 99 gear, trophy badges', actionTag: 'My Profile' },
 { id: 'F2', stepNo: 'F2', title: 'Smartwatch Health & Telemetry', description: 'Live heart rate BPM, convert 680 kcal to +136 EXP', actionTag: 'Watch Sync' },
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
 className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md"
 >
 <motion.div
 initial={{ y: '100%' }}
 animate={{ y: 0 }}
 exit={{ y: '100%' }}
 transition={{ type: 'spring', damping: 28, stiffness: 320 }}
 className={`w-full max-w-xl rounded-t-[32px] sm:rounded-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden transition-colors ${
 isDark ? 'bg-[#0f172a] -slate-700/80 text-white' : 'bg-[#f4f7fb] -slate-200/90 text-slate-900'
 }`}
 >
 {/* Header */}
 <div className={`p-4 flex items-center justify-between shrink-0 ${
 isDark ? 'bg-[#161f30] -slate-700/80' : 'bg-white -slate-200/90'
 }`}>
 <div className="flex items-center gap-2.5">
 <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 -emerald-500/30 flex items-center justify-center font-bold">
 <Compass className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-base font-black uppercase tracking-tight leading-none">
 ALL 18 SCREENS DIRECTORY
 </h3>
 <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
 คลิกหน้าจอใดก็ได้เพื่อเข้าสู่ Interactive Journey ทันที
 </p>
 </div>
 </div>
 <button
 type="button"
 onClick={onClose}
 className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer border ${
 isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
 }`}
 >
 <X className="w-4 h-4 stroke-[2.5]" />
 </button>
 </div>

        {/* Break-UI / UI State Expander Selector (Demo / Worst Case / One / Empty) */}
        <div className="px-4 py-2 border-b border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between text-xs font-bold gap-2">
          <span className="text-neutral-500 text-[10px] uppercase font-black tracking-wider">
            Break-UI State:
          </span>
          <div className="flex items-center gap-1.5">
            {(['demo', 'worst', 'one', 'empty'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setDataMode(mode)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-transform active:scale-[0.96] cursor-pointer border ${
                  dataMode === mode
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {mode === 'worst' ? 'Worst Case' : mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

 {/* List of 18 Screens in Groups */}
 <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
 {PATH_GROUPS.map((group) => (
 <div key={group.code} className={`rounded-3xl p-3.5 space-y-2 ${
 isDark ? 'bg-[#161f30] -slate-700/80' : 'bg-white -slate-200/90 shadow-xs'
 }`}>
 <div className={`flex items-center justify-between pb-2 ${
 isDark ? '-slate-800' : '-slate-100'
 }`}>
 <div className="flex items-center gap-2">
 <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-500 -emerald-500/30">
 {group.code}
 </span>
 <span className="text-xs font-black uppercase tracking-wide">
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
 className={`w-full text-left p-3 rounded-2xl transition-all border flex flex-col justify-between cursor-pointer active:scale-95 ${
 isActive
 ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500'
 : isDark
 ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
 : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800'
 }`}
 >
 <div className="flex items-start justify-between gap-1 mb-1">
 <span className="text-xs font-black">
 {screen.stepNo}. {screen.title}
 </span>
 {isActive && (
 <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
 <Check className="w-2.5 h-2.5 stroke-[3]" />
 </span>
 )}
 </div>
 <p className={`text-[11px] line-clamp-2 leading-snug mb-2.5 ${
 isDark ? 'text-slate-400' : 'text-slate-500'
 }`}>
 {screen.description}
 </p>
 <div className="flex items-center justify-end">
 <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
 isActive
 ? 'bg-emerald-500 text-slate-950'
 : isDark
 ? 'bg-slate-800 text-slate-300'
 : 'bg-slate-200 text-slate-800'
 }`}>
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

 {/* Bottom Dismiss */}
 <div className={`p-3 flex items-center justify-between ${
 isDark ? 'bg-[#161f30] -slate-700/80' : 'bg-white -slate-200/90'
 }`}>
 <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
 18 of 18 screens interactive & connected
 </span>
 <button
 type="button"
 onClick={onClose}
 className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-transform active:scale-95 cursor-pointer ${
 isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700' : 'bg-slate-900 hover:bg-slate-800 text-white'
 }`}
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
