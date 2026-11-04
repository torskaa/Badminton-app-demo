/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass, Sparkles, Trophy, Zap, Shield, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenSwitcherModal } from '../common/ScreenSwitcherModal';

export const A1_WelcomeScreen: React.FC = () => {
  const { navigateTo } = useApp();
  const [activeSlide, setActiveSlide] = useState<0 | 1>(0);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const slides = [
    {
      title: 'SMASH.',
      tagline: 'Your game. Unstuck.',
      subtitle: 'Connect with badminton players at your skill level. Book verified BWF Taraflex courts and level up with AI coaching.',
      badge: 'Badminton Community & AI',
      buttonText: 'Get Started',
      pillColor: '#ffd731',
    },
    {
      title: 'BOOK.',
      tagline: 'Instant court access.',
      subtitle: 'Zero phone calls. Live availability across Bangkok arenas. Fast PromptPay QR check-in and 2x EXP prime-time slots.',
      badge: 'BWF Certified Taraflex',
      buttonText: 'Explore Courts',
      pillColor: '#55db9c',
    },
  ];

  const slide = slides[activeSlide];

  const handleNext = () => {
    if (activeSlide === 0) {
      setActiveSlide(1);
    } else {
      navigateTo('A2');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between relative bg-[#dceeff] overflow-hidden text-black select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white border border-black flex items-center justify-center font-['Antonio'] font-bold text-lg">
            S
          </div>
          <span className="font-['Antonio'] text-2xl font-black tracking-tight uppercase">
            SMASH<span className="text-[#4da2ff]">.AI</span>
          </span>
        </div>

        <button
          onClick={() => setIsSwitcherOpen(true)}
          className="px-3 py-1 rounded-full bg-white hover:bg-neutral-100 border border-black text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
          title="App Navigation Directory (18 Screens)"
        >
          <Compass className="w-3.5 h-3.5 text-[#5c4ade]" />
          <span>18 Screens</span>
        </button>
      </div>

      {/* Hero Visual Area with Slush 3D Inflatable Ribbon & Floating Stickers */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-4 overflow-hidden">
        {/* Floating Stickers around the Display Headline */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-8, -4, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-6 left-6 z-20 px-3 py-1.5 rounded-2xl bg-[#fb4903] border border-black text-white text-xs font-bold flex items-center gap-1 shadow-xs"
        >
          <span>🚀</span>
          <span>AI Coach</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0], rotate: [10, 14, 10] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-6 z-20 px-3 py-1.5 rounded-2xl bg-[#ffd731] border border-black text-black text-xs font-bold flex items-center gap-1 shadow-xs"
        >
          <span>🏸</span>
          <span>Taraflex</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0], rotate: [-12, -8, -12] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 left-8 z-20 px-3 py-1.5 rounded-2xl bg-[#55db9c] border border-black text-black text-xs font-bold flex items-center gap-1 shadow-xs"
        >
          <Trophy className="w-3.5 h-3.5 stroke-[2.4]" />
          <span>Lv.14 Rank</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 7, 0], rotate: [8, 12, 8] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-16 right-8 z-20 px-3 py-1.5 rounded-2xl bg-[#5c4ade] border border-black text-white text-xs font-bold flex items-center gap-1 shadow-xs"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>+200 EXP</span>
        </motion.div>

        {/* Central Slush 3D Inflatable Curved Blue Ribbon Graphic */}
        <div className="relative w-full max-w-xs flex items-center justify-center my-2">
          <svg viewBox="0 0 320 200" className="w-full h-auto filter drop-shadow-[0_12px_24px_rgba(77,162,255,0.35)]">
            {/* Inflatable 3D Ribbon Paths */}
            <path
              d="M 20,130 C 50,40 120,30 180,80 C 240,130 290,90 300,50 C 310,120 230,180 150,150 C 70,120 40,180 20,130 Z"
              fill="#4da2ff"
              stroke="#000000"
              strokeWidth="2"
            />
            {/* Specular high-light curves */}
            <path
              d="M 40,110 C 65,55 120,48 165,85"
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.65"
            />
            <path
              d="M 180,140 C 220,155 260,130 280,80"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>

          {/* Central Shuttlecock Icon inside ribbon loop */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white border border-black flex items-center justify-center shadow-md">
              <span className="text-3xl">🏸</span>
            </div>
          </div>
        </div>

        {/* Massive Crushed Display Title (Slush Style Lateral / Antonio 800) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="text-center z-20 mt-2"
          >
            <h1 className="font-['Antonio'] text-7xl font-extrabold tracking-tight leading-[0.8] text-black uppercase">
              {slide.title}
            </h1>
            <p className="font-['Antonio'] text-3xl font-extrabold text-[#5c4ade] uppercase tracking-normal mt-1 leading-none">
              {slide.tagline}
            </p>
            <p className="text-xs text-neutral-700 mt-3 max-w-[280px] mx-auto leading-relaxed font-medium">
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action Card (Paper White Canvas) */}
      <div className="bg-white border-t border-black rounded-t-[36px] p-6 pb-8 flex flex-col gap-4 z-30">
        {/* Step Indicator & Category Tag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveSlide(0)}
              className={`h-2.5 rounded-full border border-black transition-all duration-300 cursor-pointer ${
                activeSlide === 0 ? 'w-8 bg-black' : 'w-2.5 bg-neutral-200'
              }`}
            />
            <button
              onClick={() => setActiveSlide(1)}
              className={`h-2.5 rounded-full border border-black transition-all duration-300 cursor-pointer ${
                activeSlide === 1 ? 'w-8 bg-black' : 'w-2.5 bg-neutral-200'
              }`}
            />
          </div>

          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            Step {activeSlide + 1} of 2
          </span>
        </div>

        {/* Primary Slush Pill Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-sm border border-black flex items-center justify-between px-5 transition-transform active:scale-98 cursor-pointer shadow-sm group"
        >
          <span className="w-7 h-7 rounded-full bg-[#55db9c] border border-black text-black flex items-center justify-center font-black text-xs">
            ★
          </span>
          <span className="font-bold tracking-wide text-white">
            {slide.buttonText}
          </span>
          <span className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </span>
        </button>

        {/* Quick Jump Buttons for All Paths */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => navigateTo('B1')}
            className="py-2.5 px-3 rounded-full bg-[#dceeff] hover:bg-[#cde5fd] border border-black text-xs font-bold text-black flex items-center justify-center gap-1 transition-transform active:scale-95 cursor-pointer"
          >
            <span>Book Courts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => navigateTo('C1')}
            className="py-2.5 px-3 rounded-full bg-[#ffd731] hover:bg-[#ffe259] border border-black text-xs font-bold text-black flex items-center justify-center gap-1 transition-transform active:scale-95 cursor-pointer"
          >
            <span>Live Score</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <ScreenSwitcherModal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
    </div>
  );
};
