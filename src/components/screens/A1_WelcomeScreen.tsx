/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass, Sparkles, Trophy, Zap, Shield, ChevronRight, Award, Flame, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenSwitcherModal } from '../common/ScreenSwitcherModal';

export const A1_WelcomeScreen: React.FC = () => {
 const { navigateTo } = useApp();
 const [activeSlide, setActiveSlide] = useState<0 | 1 | 2>(0);
 const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

 const slides = [
 {
 title: 'SMASH',
 tagline: 'YOUR GAME. UNSTUCK.',
 subtitle: 'Connect with badminton players at your skill level. Book verified BWF Taraflex courts and level up with AI coaching.',
 badge: 'Badminton Community & AI',
 buttonText: 'Get Started',
 },
 {
 title: 'BOOK',
 tagline: 'INSTANT COURTSIDE ACCESS',
 subtitle: 'Zero phone calls. Live availability across Bangkok arenas. Fast PromptPay QR check-in and 2x EXP prime-time slots.',
 badge: 'BWF Certified Taraflex',
 buttonText: 'Explore Courts',
 },
 {
 title: 'WIN',
 tagline: 'TRACK EVERY POINT LIVE',
 subtitle: 'Courtside live scorekeeper, CV smash speed telemetry up to 342 km/h, and customized daily drills.',
 badge: 'AI Telemetry 342 km/h',
 buttonText: 'Enter Arena',
 },
 ];

 const slide = slides[activeSlide];

 const handleNext = () => {
 if (activeSlide < 2) {
 setActiveSlide((prev) => (prev + 1) as 0 | 1 | 2);
 } else {
 navigateTo('A2');
 }
 };

 return (
 <div className="flex-1 min-h-0 flex flex-col justify-between relative bg-[#dceeff] overflow-y-auto overscroll-contain no-scrollbar text-[#000000] ">
 {/* Top Header Bar */}
 <div className="px-4 pt-4 pb-2 flex items-center justify-between z-30">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-[1600px] bg-[#ffd731] flex items-center justify-center font-black text-sm">
 🏸
 </div>
 <span className="font-['Antonio',sans-serif] text-2xl font-black tracking-tight uppercase">
 SMASH
 </span>
 </div>

 <button
 onClick={() => setIsSwitcherOpen(true)}
 className="px-3 py-1.5 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-xs font-bold tracking-[0.032em] flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer hover:bg-[#e9e9e9]"
 title="App Navigation Directory (18 Screens)"
 >
 <Compass className="w-3.5 h-3.5 text-[#5c4ade]" />
 <span>18 Screens</span>
 </button>
 </div>

 {/* Hero Visual Area with 3D Blue Inflatable Ribbon Sculpture & Sticker Clusters */}
 <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-2 overflow-hidden">
 {/* Floating Sticker Cluster (Six-color sticker palette applied as a shared set) */}
 <motion.div
 animate={{ y: [0, -8, 0], rotate: [-8, -4, -8] }}
 transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
 className="absolute top-3 left-4 z-20 px-3 py-1 rounded-[1600px] bg-[#fb4903] text-[#ffffff] text-[11px] font-bold tracking-[0.032em] flex items-center gap-1.5 cursor-pointer"
 >
 <Flame className="w-3.5 h-3.5 fill-[#ffffff]" />
 <span>342 km/h Peak</span>
 </motion.div>

 <motion.div
 animate={{ y: [0, 8, 0], rotate: [8, 12, 8] }}
 transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
 className="absolute top-5 right-4 z-20 px-3 py-1 rounded-[1600px] bg-[#ffd731] text-[#000000] text-[11px] font-bold tracking-[0.032em] flex items-center gap-1.5 cursor-pointer"
 >
 <span>🏸</span>
 <span>Taraflex BWF</span>
 </motion.div>

 <motion.div
 animate={{ y: [0, -6, 0], rotate: [-10, -6, -10] }}
 transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
 className="absolute bottom-20 left-4 z-20 px-3 py-1 rounded-[1600px] bg-[#55db9c] text-[#000000] text-[11px] font-bold tracking-[0.032em] flex items-center gap-1.5 cursor-pointer"
 >
 <Trophy className="w-3.5 h-3.5 stroke-[2.4]" />
 <span>Lv.14 Rank</span>
 </motion.div>

 <motion.div
 animate={{ y: [0, 7, 0], rotate: [6, 10, 6] }}
 transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
 className="absolute bottom-16 right-4 z-20 px-3 py-1 rounded-[1600px] bg-[#e9ccff] text-[#000000] text-[11px] font-bold tracking-[0.032em] flex items-center gap-1.5 cursor-pointer"
 >
 <Zap className="w-3.5 h-3.5 text-[#5c4ade] fill-current" />
 <span>+250 EXP</span>
 </motion.div>

 {/* Central 3D Inflatable Electric Blue Ribbon Graphic (Signature Brand Sculpture) */}
 <div className="relative w-full max-w-xs flex items-center justify-center my-1">
 <svg viewBox="0 0 320 180" className="w-full h-auto">
 {/* Inflatable 3D Ribbon Base with Electric Blue (#4da2ff) and 1px solid black handcut outline */}
 <path
 d="M 25,115 C 55,30 120,25 180,75 C 240,125 285,85 295,45 C 305,115 225,165 145,140 C 70,115 40,165 25,115 Z"
 fill="#4da2ff"
 stroke="#000000"
 strokeWidth="1.5"
 />
 {/* Glossy specular highlight curves */}
 <path
 d="M 45,95 C 70,45 120,40 165,75"
 fill="none"
 stroke="#ffffff"
 strokeWidth="5"
 strokeLinecap="round"
 opacity="0.75"
 />
 <path
 d="M 180,130 C 220,145 260,120 275,75"
 fill="none"
 stroke="#ffffff"
 strokeWidth="4"
 strokeLinecap="round"
 opacity="0.5"
 />
 </svg>

 {/* Central Playful Badminton Shuttlecock inside Ribbon loop */}
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
 <div className="w-16 h-16 rounded-[1600px] bg-[#ffffff] flex items-center justify-center">
 <span className="text-3xl">🏸</span>
 </div>
 </div>
 </div>

 {/* Lateral Crushed Sculptural Display Headline (0.75–0.80 line height non-negotiable) */}
 <AnimatePresence mode="wait">
 <motion.div
 key={activeSlide}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.2 }}
 className="text-center z-20 mt-1 max-w-xs"
 >
 <h1 className="lateral-display text-7xl font-extrabold tracking-tight text-[#000000]">
 {slide.title}
 </h1>
 <p className="font-['Antonio',sans-serif] text-2xl font-black text-[#5c4ade] uppercase tracking-normal mt-1 leading-none">
 {slide.tagline}
 </p>
 <p className="text-xs text-[#000000]/80 mt-2.5 max-w-[270px] mx-auto leading-relaxed font-medium">
 {slide.subtitle}
 </p>
 </motion.div>
 </AnimatePresence>
 </div>

 {/* Bottom Action Card (Paper White Canvas #ffffff alternating rhythm with 1px black outline) */}
 <div className="bg-[#ffffff] rounded-t-[36px] p-4 pb-6 flex flex-col gap-3.5 z-30">
 {/* Step Indicator Pill & Category Tag */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1.5">
 {[0, 1, 2].map((idx) => (
 <button
 key={idx}
 type="button"
 onClick={() => setActiveSlide(idx as 0 | 1 | 2)}
 className={`h-2.5 rounded-[1600px] border border-[#000000] transition-all duration-300 cursor-pointer ${
 activeSlide === idx ? 'w-8 bg-[#000000]' : 'w-2.5 bg-[#cccccc]'
 }`}
 />
 ))}
 </div>

 <span className="text-[11px] font-bold tracking-[0.032em] text-[#000000]/60 uppercase">
 Step {activeSlide + 1} of 3
 </span>
 </div>

 {/* Primary CTA (Rule: Black fill only, NEVER blue #4da2ff, 1600px radius, 1px solid black) */}
 <button
 onClick={handleNext}
 className="w-full py-3.5 rounded-[1600px] bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] font-bold text-xs tracking-[0.032em] border border-[#000000] flex items-center justify-between px-4 transition-transform active:scale-98 cursor-pointer group"
 >
 <span className="w-7 h-7 rounded-[1600px] bg-[#55db9c] text-[#000000] flex items-center justify-center font-black text-xs">
 ★
 </span>
 <span className="font-bold tracking-[0.032em] text-[#ffffff] uppercase text-xs">
 {slide.buttonText}
 </span>
 <span className="w-7 h-7 rounded-[1600px] bg-[#ffffff] text-[#000000] flex items-center justify-center group-hover:translate-x-1 transition-transform">
 <ArrowRight className="w-4 h-4 stroke-[2.5]" />
 </span>
 </button>

 {/* Quick Shortcut Buttons (Concrete gray / Sky wash alternates with 1px black borders) */}
 <div className="grid grid-cols-2 gap-2 pt-0.5">
 <button
 onClick={() => navigateTo('B1')}
 className="py-2.5 px-3 rounded-[1600px] bg-[#dceeff] hover:bg-[#cde5fd] border border-[#000000] text-xs font-bold tracking-[0.032em] text-[#000000] flex items-center justify-center gap-1 transition-transform active:scale-95 cursor-pointer"
 >
 <span>Book Courts</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </button>

 <button
 onClick={() => navigateTo('C1')}
 className="py-2.5 px-3 rounded-[1600px] bg-[#ffd731] hover:bg-[#ffe259] border border-[#000000] text-xs font-bold tracking-[0.032em] text-[#000000] flex items-center justify-center gap-1 transition-transform active:scale-95 cursor-pointer"
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
