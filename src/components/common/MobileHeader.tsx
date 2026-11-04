/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Flame, Zap, Compass, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenSwitcherModal } from './ScreenSwitcherModal';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  subtitle?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ title, showBack, onBack, subtitle }) => {
  const { player, currentScreen, navigateTo, isSoundEnabled, toggleSound } = useApp();
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
          <span className="font-['Antonio'] text-2xl font-black tracking-tight text-black uppercase">
            SMASH<span className="text-[#4da2ff]">.AI</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="w-8 h-8 rounded-full bg-white border border-black text-black flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
            title="Audio Sound FX"
          >
            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#fb4903]" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-400" />}
          </button>
          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="px-3 py-1 rounded-full bg-[#ffd731] hover:bg-[#ffe169] text-black font-bold text-xs border border-black flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
            title="All 18 Screens Directory"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Screens</span>
          </button>
        </div>
        <ScreenSwitcherModal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-30 px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-black flex items-center justify-between gap-2.5 shrink-0 select-none">
        {/* Left: Back Pill or Logo */}
        <div className="flex items-center gap-2 min-w-0">
          {showBack ? (
            <button
              onClick={handleBack}
              className="w-8 h-8 rounded-full bg-white hover:bg-neutral-100 text-black border border-black flex items-center justify-center shrink-0 cursor-pointer transition-transform active:scale-90"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <div
              onClick={() => navigateTo('D1')}
              className="cursor-pointer font-['Antonio'] text-xl font-black tracking-tight text-black flex items-center shrink-0 hover:scale-105 transition-transform"
            >
              SMASH<span className="text-[#4da2ff]">.AI</span>
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-xs font-bold text-black truncate leading-tight tracking-tight uppercase font-['Plus_Jakarta_Sans',sans-serif]">
              {title || 'SmashAI'}
            </h1>
            {subtitle && (
              <p className="text-[10px] text-neutral-600 truncate leading-none mt-0.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right status: Streak + Level + Directory */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Streak pill (Ember) */}
          <div
            onClick={() => navigateTo('F1')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fb4903]/10 border border-black text-[#fb4903] text-[11px] font-bold cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            <Flame className="w-3 h-3 fill-current" />
            <span>{player.streakWeeks}W</span>
          </div>

          {/* Level pill (Sunburst) */}
          <div
            onClick={() => navigateTo('F1')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffd731] border border-black text-black text-[11px] font-extrabold cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Lv.{player.level}</span>
          </div>

          {/* Directory Pill (Mint Pop) */}
          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="w-8 h-8 rounded-full bg-[#55db9c] hover:bg-[#68eab0] text-black border border-black flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            title="App Navigation Directory (18 Screens)"
          >
            <Compass className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </header>

      <ScreenSwitcherModal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
    </>
  );
};
