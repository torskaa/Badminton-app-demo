import React, { useState } from 'react';
import { Compass, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenSwitcherModal } from './ScreenSwitcherModal';
import { QuickSparringModal } from './QuickSparringModal';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { isSoundEnabled, toggleSound } = useApp();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isDesktopFullScreen, setIsDesktopFullScreen] = useState(false);

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center relative bg-[#dceeff] select-none font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      {/* Background Ambience (Desktop Only Subtle Texture) */}
      <div className="hidden md:block absolute inset-0 bg-radial from-[#ffffff]/40 via-transparent to-[#000000]/5 pointer-events-none" />

      {/* Real Mobile App Viewport (Adaptive to any phone screen, zero mock status bar) */}
      <main
        className={`w-full flex flex-col relative transition-all duration-200 overflow-hidden ${
          isDesktopFullScreen
            ? 'h-[100dvh] max-w-full rounded-none bg-[#ffffff]'
            : 'h-[100dvh] w-full md:h-[92vh] md:max-h-[920px] md:max-w-[430px] md:rounded-[36px] md:border-2 md:border-[#000000] md:shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-[#ffffff]'
        }`}
      >
        {/* Real Mobile App Content Canvas with Safe Area Top Handling */}
        <div className="flex-1 w-full min-h-0 overflow-hidden flex flex-col relative bg-[#ffffff] text-[#000000] pt-[env(safe-area-inset-top,0px)]">
          {children}
        </div>
      </main>

      {/* Discreet Floating Helper Dock for Desktop / Reviewers (Hidden on Mobile) */}
      <aside
        aria-label="Testing Tools"
        className="hidden md:flex fixed bottom-5 right-5 z-50 items-center gap-2 p-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] shadow-xl text-xs font-bold"
      >
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
          <span>Screen Directory</span>
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
