import React, { useState } from 'react';
import { Compass, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenSwitcherModal } from './ScreenSwitcherModal';
import { QuickSparringModal } from './QuickSparringModal';
import { MobileStatusBar } from './MobileStatusBar';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { isSoundEnabled, toggleSound, currentScreen } = useApp();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isDesktopFullScreen, setIsDesktopFullScreen] = useState(false);

  // If the screen is A1, status bar can have dark text
  const isDarkStatusBar = !['B2'].includes(currentScreen);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative bg-[#f1f5f9] select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Ambience (Desktop Only Subtle Vignette) */}
      <div className="hidden md:block absolute inset-0 bg-radial from-slate-200/60 via-slate-100 to-slate-200 pointer-events-none" />

      {/* Real Mobile App Viewport */}
      <div
        className={`w-full flex flex-col relative transition-all duration-300 ${
          isDesktopFullScreen
            ? 'h-[100dvh] max-w-full rounded-none bg-[#ffffff]'
            : 'h-[100dvh] md:h-[860px] md:max-h-[96vh] md:max-w-[420px] md:rounded-[48px] md:border-[10px] md:border-[#0f172a] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] bg-[#ffffff] overflow-hidden'
        }`}
      >
        {/* iOS Native Status Bar */}
        <MobileStatusBar darkText={isDarkStatusBar} />

        {/* Real Mobile App Content Canvas */}
        <div className="flex-1 w-full min-h-0 overflow-hidden flex flex-col relative bg-[#ffffff] text-[#000000]">
          {children}
        </div>

        {/* iPhone Native Bottom Home Swipe Indicator */}
        <div className="w-full py-2 flex items-center justify-center shrink-0 bg-[#ffffff] z-40 pointer-events-none">
          <div className="w-32 h-1 rounded-[1600px] bg-[#000000]/70" />
        </div>
      </div>

      {/* Discreet Floating Helper Dock for Desktop / Testing (Non-intrusive) */}
      <aside aria-label="Testing Tools" className="hidden md:flex fixed bottom-5 right-5 z-50 items-center gap-2 p-1.5 rounded-[1600px] bg-[#000000]/90 text-[#ffffff] backdrop-blur-md border border-[#ffffff]/20 shadow-xl text-xs font-bold">
        {/* Sound FX Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          className="w-8 h-8 rounded-[1600px] flex items-center justify-center hover:bg-[#ffffff]/20 transition-transform active:scale-90 cursor-pointer"
          title={isSoundEnabled ? 'Sound FX: ON' : 'Sound FX: MUTED'}
        >
          {isSoundEnabled ? <Volume2 className="w-4 h-4 text-[#55db9c]" /> : <VolumeX className="w-4 h-4 text-[#ffffff]/40" />}
        </button>

        {/* Screen Switcher Modal Button */}
        <button
          type="button"
          onClick={() => setIsSwitcherOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[1600px] bg-[#ffffff] text-[#000000] hover:bg-[#ffd731] transition-transform active:scale-95 cursor-pointer font-bold tracking-[0.032em]"
          title="Open Screen Navigator"
        >
          <Compass className="w-3.5 h-3.5 text-[#5c4ade]" />
          <span>Screen Navigator</span>
        </button>

        {/* Desktop Phone vs Full Width Toggle */}
        <button
          type="button"
          onClick={() => setIsDesktopFullScreen(!isDesktopFullScreen)}
          className="w-8 h-8 rounded-[1600px] flex items-center justify-center hover:bg-[#ffffff]/20 transition-transform active:scale-90 cursor-pointer"
          title={isDesktopFullScreen ? 'Switch to Phone View' : 'Switch to Full View'}
        >
          {isDesktopFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* Screen Directory Modal */}
      <ScreenSwitcherModal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />

      {/* Quick Sparring Modal */}
      <QuickSparringModal />
    </div>
  );
};
