/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ChevronRight, Check, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';

interface ScreenSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PathCategory {
  title: string;
  code: string;
  screens: {
    id: ScreenId;
    title: string;
    description: string;
  }[];
}

export const ScreenSwitcherModal: React.FC<ScreenSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentScreen, navigateTo } = useApp();

  if (!isOpen) return null;

  const PATH_GROUPS: PathCategory[] = [
    {
      title: 'Onboarding & Playstyle',
      code: 'PATH A',
      screens: [
        { id: 'A1', title: 'Welcome & Value Prop', description: 'Hero intro, AI engine overview' },
        { id: 'A2', title: 'Athlete Profile & Playstyle', description: 'Hand dominance, playstyle, skill assessment' },
      ],
    },
    {
      title: 'Court Booking & Rewards',
      code: 'PATH B',
      screens: [
        { id: 'B1', title: 'Arena Discovery (GPS)', description: 'Nearby courts, BWF certified, 2x EXP bonus' },
        { id: 'B2', title: 'Detail & Court Slot Picker', description: 'Court numbers, prime-time slots, amenities' },
        { id: 'B3', title: 'PromptPay & Instant Verify', description: 'Thai QR payment with auto-slip verification' },
        { id: 'B4', title: 'Digital E-Ticket Pass', description: 'QR check-in pass + 100 EXP reward celebration' },
      ],
    },
    {
      title: 'Live Score & Diagnostics',
      code: 'PATH C',
      screens: [
        { id: 'C1', title: 'Courtside Score Tracker', description: 'Thumb-friendly scoring, quick tag shots & unforced errors' },
        { id: 'C2', title: 'Post-Match EXP Payout', description: 'Match breakdown, animated XP gains, streak boost' },
        { id: 'C3', title: 'AI Match Diagnostics & Heatmap', description: 'Shot win-rates, 2D weak zone interactive heatmap' },
        { id: 'C4', title: 'Athlete Recap Card', description: 'FUT / Wrapped athlete share card for Instagram' },
      ],
    },
    {
      title: 'AI Coach & Skill-Up Hub',
      code: 'PATH D',
      screens: [
        { id: 'D1', title: 'Skill Radar & Biometrics', description: '5-axis radar chart with past baseline comparison' },
        { id: 'D2', title: 'Quests & Training Drills', description: 'Daily/weekly challenges with interactive tutorials' },
        { id: 'D3', title: 'Computer Vision Analysis', description: 'Skeleton tracking, racket speed (324 km/h), form score' },
      ],
    },
    {
      title: 'Squad & Competitive League',
      code: 'PATH E',
      screens: [
        { id: 'E1', title: 'Squad Hub & Guild Perks', description: 'Active clubs, member roster, training schedule' },
        { id: 'E2', title: 'Event RSVP & Auto Split-Bill', description: 'Auto-calculates court fee + shuttlecock cost per head' },
        { id: 'E3', title: 'AI Smart Matchmaker', description: 'Balances 2v2 doubles for 50/50 competitive games' },
        { id: 'E4', title: 'Season Tier Leaderboard', description: 'Diamond/Gold standings, win rates, titles' },
      ],
    },
    {
      title: 'Athlete Profile & Wearables',
      code: 'PATH F',
      screens: [
        { id: 'F1', title: 'Profile & Trophy Cabinet', description: 'Athlete FIFA card, equipment locker, badges' },
        { id: 'F2', title: 'Smartwatch Companion Sync', description: 'Live heart rate, calories-to-EXP conversion' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0c0f17] border-t sm:border border-white/[0.1] rounded-t-[32px] sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#0e121d]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#d4ff00]/20 text-[#d4ff00] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white">App Navigation Directory</h3>
              <p className="text-[10px] text-slate-400">เข้าถึงทุกโมดูลของ SmashAI ได้ทันที</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {PATH_GROUPS.map((group) => (
            <div key={group.code} className="space-y-1.5">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[9px] font-mono text-[#d4ff00] font-bold tracking-wider">
                  {group.code}
                </span>
                <span className="text-xs font-bold text-slate-300">{group.title}</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {group.screens.map((screen) => {
                  const isActive = currentScreen === screen.id;
                  return (
                    <button
                      key={screen.id}
                      onClick={() => {
                        navigateTo(screen.id);
                        onClose();
                      }}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between border cursor-pointer ${
                        isActive
                          ? 'bg-[#d4ff00]/10 border-[#d4ff00]/40 text-white'
                          : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.05] text-slate-300'
                      }`}
                    >
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isActive ? 'text-[#d4ff00]' : 'text-slate-100'}`}>
                            {screen.title}
                          </span>
                          {isActive && <Check className="w-3.5 h-3.5 text-[#d4ff00]" />}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {screen.description}
                        </p>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#d4ff00]' : 'text-slate-500'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
