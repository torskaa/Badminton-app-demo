import React, { useState } from 'react';
import { ArrowLeft, Flame, Zap, Compass } from 'lucide-react';
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

  return (
    <>
      <header className="sticky top-0 z-30 px-4 py-2.5 bg-[#ffffff] border-b border-[#000000] flex items-center justify-between gap-2.5 shrink-0 select-none text-[#000000]">
        {/* Left: Back Pill or Clean Logo */}
        <div className="flex items-center gap-2 min-w-0">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-8 h-8 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#e9e9e9] transition-transform active:scale-90"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <div
              onClick={() => navigateTo('B1')}
              className="cursor-pointer flex items-center gap-1 shrink-0 hover:scale-105 transition-transform"
            >
              <span className="font-['Antonio',sans-serif] text-xl font-black uppercase tracking-tight text-[#000000]">
                SMASH
              </span>
            </div>
          )}

          {showBack && title && (
            <div className="min-w-0">
              <h1 className="text-xs font-bold tracking-[0.032em] truncate leading-tight uppercase font-['Antonio',sans-serif] text-sm">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[10px] text-[#000000]/60 truncate leading-none mt-0.5 font-bold">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right status: Streak + Level + Directory */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Streak pill (Ember) */}
          <div
            onClick={() => navigateTo('F1')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-[1600px] bg-[#fb4903] text-[#ffffff] border border-[#000000] text-[10px] font-bold tracking-[0.032em] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            <Flame className="w-3 h-3 fill-current text-[#ffffff]" />
            <span>{player.streakWeeks}W</span>
          </div>

          {/* Level pill (Sunburst) */}
          <div
            onClick={() => navigateTo('F1')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-[1600px] bg-[#ffd731] text-[#000000] border border-[#000000] text-[10px] font-bold tracking-[0.032em] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Lv.{player.level}</span>
          </div>

          {/* Directory Pill */}
          <button
            type="button"
            onClick={() => setIsSwitcherOpen(true)}
            className="w-8 h-8 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center cursor-pointer hover:bg-[#e9ccff] active:scale-95 transition-all"
            title="App Navigation Directory (18 Screens)"
          >
            <Compass className="w-4 h-4 text-[#5c4ade]" />
          </button>
        </div>
      </header>

      <ScreenSwitcherModal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
    </>
  );
};
