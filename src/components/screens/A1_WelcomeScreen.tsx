import React, { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenSwitcherModal } from '../common/ScreenSwitcherModal';

export const A1_WelcomeScreen: React.FC = () => {
  const { navigateTo } = useApp();
  const [activeSlide, setActiveSlide] = useState<0 | 1>(0);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const slides = [
    {
      title: 'Build Your Community',
      subtitle: 'Connect with players at your skill level. Find partners, join teams, and grow together.',
      badge: 'Badminton & Sports AI',
      buttonText: 'Get Started',
      image: '/src/assets/images/badminton_smash_action_1793695158261.jpg',
    },
    {
      title: 'Book Courts Instantly',
      subtitle: 'Quickly find and reserve nearby courts without calls or waiting. Guaranteed Taraflex surface.',
      badge: 'Instant Court Booking',
      buttonText: 'Continue to Setup',
      image: '/src/assets/images/badminton_court_arena_1793695157813.jpg',
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
    <div className="flex-1 flex flex-col justify-between relative bg-white overflow-hidden text-neutral-900 select-none">
      {/* Dynamic Island & Status Bar Header */}
      <div className="absolute top-0 inset-x-0 z-30 px-6 pt-3 pb-2 flex items-center justify-between text-white text-xs font-semibold">
        <span>9:30</span>
        <div className="w-24 h-4 bg-black rounded-full mx-auto" />
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-[#d4ff00] hover:scale-110 transition-transform"
            title="App Navigation Directory"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
          <span>5G</span>
        </div>
      </div>

      {/* Hero Visual Top Half (Matches Image 1) */}
      <div className="relative w-full h-[52%] shrink-0 overflow-hidden bg-slate-900">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Seamless Smooth Fade Gradient into the white card below */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Floating Mini Chip on Image */}
        <div className="absolute bottom-6 left-6 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium tracking-tight shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse" />
            {slide.badge}
          </span>
        </div>
      </div>

      {/* Clean Bottom Card (Matches Image 1 typography & layout) */}
      <div className="flex-1 bg-white px-7 pb-8 pt-2 flex flex-col justify-between relative z-20">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-[1.15] mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
            {slide.title}
          </h1>

          <p className="text-sm text-neutral-500 mt-3 leading-relaxed font-normal max-w-[320px]">
            {slide.subtitle}
          </p>

          {/* Step Dots Indicator (Matches Image 1: [● ━━]) */}
          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={() => setActiveSlide(0)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === 0
                  ? 'w-7 bg-neutral-900'
                  : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
            <button
              onClick={() => setActiveSlide(1)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === 1
                  ? 'w-7 bg-neutral-900'
                  : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          </div>
        </div>

        {/* Iconic Pill Button (Matches Image 1: [ ✳️ Get Started ➔ ]) */}
        <div className="pt-4">
          <button
            onClick={handleNext}
            className="w-full h-15 bg-[#111318] hover:bg-[#1a1d24] active:scale-[0.98] rounded-full p-2 flex items-center justify-between shadow-xl transition-all cursor-pointer group"
          >
            {/* Left Circular Asterisk Badge */}
            <div className="w-11 h-11 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981] group-hover:rotate-45 transition-transform duration-300">
              <span className="text-xl font-black leading-none">✱</span>
            </div>

            {/* Center Label */}
            <span className="text-white font-bold text-sm tracking-wide">
              {slide.buttonText}
            </span>

            {/* Right White Circle with Arrow */}
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-neutral-900 group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </div>
          </button>

          {/* Quick Skip to Home */}
          <div className="text-center mt-3">
            <button
              onClick={() => navigateTo('B1')}
              className="text-xs text-neutral-400 hover:text-neutral-700 font-medium cursor-pointer transition-colors"
            >
              Skip to Court Discovery →
            </button>
          </div>
        </div>
      </div>

      <ScreenSwitcherModal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
    </div>
  );
};
