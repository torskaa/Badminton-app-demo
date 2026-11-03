/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, Flame, Zap, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenSwitcherModal } from './ScreenSwitcherModal';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  subtitle?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ title, showBack, onBack, subtitle }) => {
  const { player, currentScreen, navigateTo } = useApp();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (['A2'].includes(currentScreen)) navigateTo('A1', 'backward');
    else if (['B2', 'B3'].includes(currentScreen)) navigateTo('B1', 'backward');
    else if (['B4'].includes(currentScreen)) navigateTo('B1', 'backward');
    else if (['C2', 'C3', 'C4'].includes(currentScreen)) navigateTo('C1', 'backward');
    else if (['D2', 'D3'].includes(currentScreen)) navigateTo('D1', 'backward');
    else if (['E2', 'E3', 'E4'].includes(currentScreen)) navigateTo('E1', 'backward');
    else if (['F2'].includes(currentScreen)) navigateTo('F1', 'backward');
    else navigateTo('D1', 'backward');
  };

  if (currentScreen === 'A1') {
    return (
      <header className="px-5 pt-4 pb-2 flex items-center justify-between bg-transparent z-20">
        <div className="flex items-center gap-2">
          <span className="font-black text-lg tracking-tighter text-white">
            SMASH<span className="text-[#d4ff00]">AI</span>
          </span>
        </div>
        <button
          onClick={() => setIsSwitcherOpen(true)}
          className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/[0.06]"
          title="App Directory"
        >
          <Compass className="w-4 h-4 text-[#d4ff00]" />
        </button>
        <ScreenSwitcherModal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-30 px-4 py-3 bg-white/95 backdrop-blur-xl border-b border-neutral-200/80 flex items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack ? (
            <button
              onClick={handleBack}
              className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center shrink-0 cursor-pointer transition-colors border border-neutral-200"
              aria-label="Back"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <div
              onClick={() => navigateTo('D1')}
              className="cursor-pointer font-black text-sm tracking-tighter text-neutral-900 flex items-center shrink-0"
            >
              SMASH<span className="text-[#0066ff]">AI</span>
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-xs font-extrabold text-neutral-900 truncate leading-snug tracking-tight">
              {title || 'SmashAI'}
            </h1>
            {subtitle && (
              <p className="text-[10px] text-neutral-500 truncate leading-none mt-0.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right status: Streak + Level + Directory */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div
            onClick={() => navigateTo('F1')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-[10px] font-bold cursor-pointer shadow-2xs hover:bg-amber-100 transition-colors"
          >
            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>{player.streakWeeks}W</span>
          </div>

          <div
            onClick={() => navigateTo('F1')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d8ff00]/30 border border-[#d8ff00] text-neutral-950 text-[10px] font-extrabold cursor-pointer shadow-2xs hover:bg-[#d8ff00]/50 transition-colors"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Lv.{player.level}</span>
          </div>

          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer border border-neutral-200 transition-colors"
            title="App Navigation Directory"
          >
            <Compass className="w-4 h-4 text-neutral-800" />
          </button>
        </div>
      </header>

      <ScreenSwitcherModal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
    </>
  );
};
