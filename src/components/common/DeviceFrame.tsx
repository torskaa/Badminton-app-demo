import React, { useState } from 'react';
import { Smartphone, LayoutGrid, Compass, ChevronDown, Check, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MultiScreenShowcase } from './MultiScreenShowcase';
import { ScreenSwitcherModal } from './ScreenSwitcherModal';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { viewMode, setViewMode, currentScreen, navigateTo } = useApp();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#030508] text-slate-100 flex flex-col items-center justify-start transition-colors selection:bg-[#d8ff00] selection:text-black">
      {/* Top Universal Control & Switcher Bar */}
      <header className="w-full bg-[#080b12]/95 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        {/* Logo & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d8ff00] shadow-[0_0_10px_#d8ff00] animate-pulse" />
            <span className="font-black text-sm md:text-base tracking-tighter text-white">
              SMASH<span className="text-[#d8ff00]">AI</span>
            </span>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] text-neutral-400 font-mono">
            v2.4 Modern UI
          </span>
        </div>

        {/* Center: Primary View Mode Switcher (Showcase vs Single Phone) */}
        <div className="flex items-center p-1 rounded-2xl bg-white/[0.06] border border-white/[0.1] shadow-inner">
          <button
            onClick={() => setViewMode('showcase')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'showcase'
                ? 'bg-[#d8ff00] text-black shadow-md scale-102 font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 stroke-[2.4]" />
            <span className="hidden sm:inline">แยกหน้าจอ Navigation</span>
            <span className="sm:hidden">แยกจอ</span>
          </button>

          <button
            onClick={() => setViewMode('single')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'single'
                ? 'bg-[#d8ff00] text-black shadow-md scale-102 font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 stroke-[2.4]" />
            <span className="hidden sm:inline">โหมดมือถือเดี่ยว</span>
            <span className="sm:hidden">จอเดี่ยว</span>
          </button>
        </div>

        {/* Right: Quick Screen Directory Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white border border-white/[0.1] cursor-pointer transition-colors shadow-xs"
            title="เลือกเปิดหน้าจอใดก็ได้จาก 18 หน้าจอ"
          >
            <Compass className="w-3.5 h-3.5 text-[#d8ff00]" />
            <span className="hidden md:inline text-[11px]">ทุกหน้าจอ (18 Screens)</span>
          </button>
        </div>
      </header>

      {/* Main View Area */}
      {viewMode === 'showcase' ? (
        <MultiScreenShowcase />
      ) : (
        <main className="w-full flex-1 flex flex-col items-center justify-center p-0 md:p-6 pb-12">
          <div className="w-full max-w-[420px] h-screen md:h-[860px] md:max-h-[94vh] md:rounded-[48px] md:border-[3px] md:border-neutral-700 md:shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden bg-white relative flex flex-col ring-1 ring-white/10">
            {/* Dynamic Island Pill */}
            <div className="absolute top-3.5 inset-x-0 z-50 flex justify-center pointer-events-none">
              <div className="w-24 h-5 bg-black rounded-full shadow-inner flex items-center justify-between px-2 text-[9px] text-white">
                <span className="w-2 h-2 rounded-full bg-neutral-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
              </div>
            </div>

            {/* Content Viewport */}
            <div className="flex-1 w-full h-full overflow-hidden flex flex-col relative bg-[#f0f4f9] text-neutral-900">
              {children}
            </div>

            {/* iPhone Bottom Home Bar */}
            <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none z-50">
              <div className="w-28 h-1 bg-neutral-400/60 rounded-full" />
            </div>
          </div>
        </main>
      )}

      <ScreenSwitcherModal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
    </div>
  );
};
