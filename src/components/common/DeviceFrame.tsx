/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, LayoutGrid, Compass, Zap, Flame, Sparkles, Trophy, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MultiScreenShowcase } from './MultiScreenShowcase';
import { ScreenSwitcherModal } from './ScreenSwitcherModal';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { viewMode, setViewMode, currentScreen, navigateTo, isSoundEnabled, toggleSound, player } = useApp();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#dceeff] text-black flex flex-col items-center justify-start relative overflow-x-hidden selection:bg-[#ffd731] selection:text-black font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Slush Marquee Announcement Tape */}
      <div className="w-full bg-black text-white text-[12px] font-bold tracking-[0.03em] uppercase py-1.5 px-4 overflow-hidden border-b border-black select-none z-50">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          <span>⚡ SMASH. YOUR GAME. UNSTUCK.</span>
          <span>·</span>
          <span>🏸 BWF TARAFLEX COURT BOOKING</span>
          <span>·</span>
          <span>🚀 AI COACH PERSONALIZED DRILLS</span>
          <span>·</span>
          <span>🔥 {player.streakWeeks}-WEEK ACTIVE STREAK</span>
          <span>·</span>
          <span>🏆 EXP LEVEL {player.level} COURT MASTER</span>
          <span>·</span>
          <span>⚡ SMASH. YOUR GAME. UNSTUCK.</span>
          <span>·</span>
          <span>🏸 BWF TARAFLEX COURT BOOKING</span>
          <span>·</span>
          <span>🚀 AI COACH PERSONALIZED DRILLS</span>
          <span>·</span>
          <span>🔥 {player.streakWeeks}-WEEK ACTIVE STREAK</span>
          <span>·</span>
          <span>🏆 EXP LEVEL {player.level} COURT MASTER</span>
        </div>
      </div>

      {/* 2. Top Navigation Bar (Slush Sticker Pill Nav) */}
      <header className="w-full max-w-6xl px-4 py-3 flex items-center justify-between gap-3 z-40 select-none">
        {/* Left: Brand Logo & Sticker Mark */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => navigateTo('A1')}
            className="w-10 h-10 rounded-full bg-white border border-black flex items-center justify-center font-['Antonio'] font-bold text-xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            S
          </div>
          <div
            onClick={() => navigateTo('A1')}
            className="cursor-pointer font-['Antonio'] text-3xl font-extrabold tracking-tight leading-none uppercase hidden sm:block"
          >
            SMASH<span className="text-[#4da2ff]">.AI</span>
          </div>
        </div>

        {/* Center: Slush Pill View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-black rounded-full">
          <button
            onClick={() => setViewMode('showcase')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'showcase'
                ? 'bg-black text-white'
                : 'text-black hover:bg-[#dceeff]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">5-Screen Canvas</span>
            <span className="sm:hidden">Canvas</span>
          </button>

          <button
            onClick={() => setViewMode('single')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'single'
                ? 'bg-black text-white'
                : 'text-black hover:bg-[#dceeff]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Single Phone</span>
            <span className="sm:hidden">Phone</span>
          </button>
        </div>

        {/* Right: Sound Toggle + 18-Screen Directory + Launch CTA */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-9 h-9 rounded-full bg-white border border-black flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title={isSoundEnabled ? 'Audio Sound FX: ON' : 'Audio Sound FX: MUTED'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-[#fb4903]" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
          </button>

          {/* 18 Screens Directory Button */}
          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#e9ccff] hover:bg-[#dfb5ff] border border-black text-xs font-bold text-black cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            title="Open 18-Screen Directory"
          >
            <Compass className="w-3.5 h-3.5 text-[#5c4ade]" />
            <span className="hidden md:inline">All 18 Screens</span>
            <span className="md:hidden">18 Screens</span>
          </button>

          {/* Launch App Pill (Slush Primary Action) */}
          <button
            onClick={() => {
              setViewMode('single');
              navigateTo('C1');
            }}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold border border-black cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            <span>Courtside Live</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Decorative Slush Inflatable Blue Ribbon Background SVGs & Floating Stickers */}
      <div className="absolute top-28 left-4 w-12 h-12 rounded-2xl bg-[#ffd731] border border-black rotate-[-12deg] hidden xl:flex items-center justify-center pointer-events-none z-10 hover:rotate-6 transition-transform">
        <span className="text-xl">🏸</span>
      </div>
      <div className="absolute top-44 right-6 w-12 h-12 rounded-2xl bg-[#fb4903] border border-black rotate-[14deg] hidden xl:flex items-center justify-center pointer-events-none z-10 text-white">
        <Sparkles className="w-6 h-6 fill-current" />
      </div>
      <div className="absolute bottom-24 left-10 w-14 h-14 rounded-2xl bg-[#55db9c] border border-black rotate-[8deg] hidden xl:flex items-center justify-center pointer-events-none z-10">
        <Trophy className="w-7 h-7 text-black stroke-[2.2]" />
      </div>
      <div className="absolute bottom-40 right-12 w-14 h-14 rounded-2xl bg-[#5c4ade] border border-black rotate-[-10deg] hidden xl:flex items-center justify-center pointer-events-none z-10 text-white">
        <Zap className="w-7 h-7 fill-current" />
      </div>

      {/* Main View Area */}
      {viewMode === 'showcase' ? (
        <div className="w-full flex-1 flex flex-col items-center">
          <MultiScreenShowcase />
        </div>
      ) : (
        <main className="w-full flex-1 flex flex-col items-center justify-center p-0 md:p-6 pb-12 relative z-20">
          {/* Slush Styled Phone Container */}
          <div className="w-full max-w-[420px] h-screen md:h-[860px] md:max-h-[94vh] md:rounded-[44px] md:border-[2.5px] md:border-black overflow-hidden bg-white relative flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            {/* Dynamic Island Pill */}
            <div className="absolute top-3.5 inset-x-0 z-50 flex justify-center pointer-events-none">
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2 text-[9px] text-white">
                <span className="w-2 h-2 rounded-full bg-neutral-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
              </div>
            </div>

            {/* Content Viewport */}
            <div className="flex-1 w-full h-full overflow-hidden flex flex-col relative bg-white text-black">
              {children}
            </div>

            {/* iPhone Bottom Home Bar */}
            <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none z-50">
              <div className="w-28 h-1 bg-black/30 rounded-full" />
            </div>
          </div>
        </main>
      )}

      {/* Screen Switcher Modal */}
      <ScreenSwitcherModal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
    </div>
  );
};
