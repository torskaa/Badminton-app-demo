/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Trophy,
  HelpCircle,
  X,
  ChevronRight,
  Flame,
  Smile,
  Compass,
  BookOpen,
  Heart,
  Play,
  Volume2,
  Award,
  Calendar,
  Layers,
  CheckCircle2,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  playSelectSound,
  playCoinSound,
  playSmashSound,
  playLevelUpSound,
} from '../../utils/retroAudio';
import { ScreenId } from '../../types';

export const MASCOT_IMAGE_URL = '/assets/aistudio/Gemini_Generated_Image_b3fgwrb3fgwrb3fg_9069fb4e.jpeg';

// Cute conversational tips cycling in the speech bubble
const COMPANION_SPEECHES_TH = [
  'หวัดดีครับ! วันนี้มาซ้อมตบสแมชกันเถอะ 🏸',
  'แตะดูทริคและภารกิจประจำวันได้เลย! ✨',
  'ฟุตเวิร์ก 6 มุมช่วยให้ประหยัดแรงขึ้นนะ 🏃💨',
  'แตะแปะมือรับ 30 คะแนนฟรีวันนี้! ✋',
  'มีคอร์ทว่างใกล้คุณด้วยนะ แตะดูเลย! 🗺️',
  'เล่นคู่: บุกยืนหน้า-หลัง รับยืนซ้าย-ขวา 🤝',
  'หาเพื่อนซ้อม? แวะดูในหน้าก๊วนได้เลย 👥',
];

const COMPANION_SPEECHES_EN = [
  "Hey there! Ready for some badminton today? 🏸",
  "Tap me for pro tips & daily missions! ✨",
  "Quick tip: Smooth 6-point footwork saves your stamina! 🏃💨",
  "Tap to high-five me for +30 Daily XP! ✋",
  "Looking for a court? Tap to view real-time slots! 🗺️",
  "Playing doubles? Attack front-back, defend side-by-side! 🤝",
  "Need sparring partners? Check out Guild Hub! 👥",
];

const PRO_TIPS = [
  {
    id: 'tip_1',
    category: 'Smash Power',
    categoryTh: 'พลังลูกตบ',
    title: 'เทคนิคกระโดดตบเร็ว 300+ กม./ชม.',
    titleEn: 'Jump Smash 300+ km/h Mechanics',
    desc: 'เทคตัวด้วยขาหลัง บิดสะโพก 45 องศา เหวี่ยงแขนฟาดจุดสูงสุดและหักข้อมือหน้าเน็ต',
    descEn: 'Take off with your rear foot, rotate hips 45°, and snap the wrist at the peak of your swing.',
    badge: 'Pro Attack',
    badgeTh: 'เกมบุก',
  },
  {
    id: 'tip_2',
    category: 'Footwork',
    categoryTh: 'ฟุตเวิร์ก 6 มุม',
    title: 'สเต็ปสไลด์คืนสู่กลางคอร์ท',
    titleEn: 'Chassé Step Recovery to Center',
    desc: 'หลังตีช็อตทุกลูก ให้สไลด์ก้าวชิดคืนตำแหน่งกลางคอร์ททันทีเพื่อเตรียมรับลูกถัดไป',
    descEn: 'Never stand still after hitting! Slide back to court center immediately for the next rally.',
    badge: 'Agility',
    badgeTh: 'ความไว',
  },
  {
    id: 'tip_3',
    category: 'Doubles Tactics',
    categoryTh: 'กลยุทธ์เกมคู่',
    title: 'การหมุนเวียนตำแหน่งบุก-รับ',
    titleEn: 'Doubles Attack & Defense Rotation',
    desc: 'เมื่อทีมได้บุกให้ยืนหน้า-หลัง แต่ถ้าถูกโยนลูกโด่งให้ถอยยืนคู่ขนานซ้าย-ขวา',
    descEn: 'Front-back formation when attacking; switch to side-by-side stance when defending high clears.',
    badge: 'Strategy',
    badgeTh: 'กลยุทธ์',
  },
  {
    id: 'tip_4',
    category: 'Equipment',
    categoryTh: 'อุปกรณ์และเอ็น',
    title: 'เลือกความตึงเอ็นให้เข้ามือ',
    titleEn: 'Optimal String Tension Guide',
    desc: 'มือใหม่ถึงระดับกลางแนะนำ 22–24 ปอนด์ ส่วนสายแข่งขันแนะนำ 26–28 ปอนด์เพื่อคุมทิศทาง',
    descEn: 'Beginners/intermediate aim for 22–24 lbs for sweet spot; tournament players prefer 26–28 lbs.',
    badge: 'Gear Pro',
    badgeTh: 'อุปกรณ์',
  },
];

const TUTORIAL_CHAPTERS: Array<{
  id: string;
  icon: any;
  titleTh: string;
  titleEn: string;
  subtitleTh: string;
  subtitleEn: string;
  targetScreen: ScreenId;
  actionLabelTh: string;
  actionLabelEn: string;
  expReward: number;
}> = [
  {
    id: 'tut_book',
    icon: Compass,
    titleTh: '1. จองคอร์ทมาตรฐานง่ายๆ',
    titleEn: '1. Book Pro Courts',
    subtitleTh: 'ค้นหาสนามติดแอร์พร้อมดูตารางเวลาว่างแบบเรียลไทม์',
    subtitleEn: 'Find air-con courts with instant live slot availability.',
    targetScreen: 'B1',
    actionLabelTh: 'ค้นหาคอร์ท',
    actionLabelEn: 'Find Courts',
    expReward: 40,
  },
  {
    id: 'tut_score',
    icon: Zap,
    titleTh: '2. กระดานนับแต้มแมตช์สด',
    titleEn: '2. In-Match Live Scorer',
    subtitleTh: 'บันทึกแต้มระหว่างตีและเก็บช็อตวินเนอร์เพื่อรับคะแนน',
    subtitleEn: 'Live point tracker with shot logs. Earn XP on match finish.',
    targetScreen: 'C1',
    actionLabelTh: 'เปิดตัวนับคะแนน',
    actionLabelEn: 'Open Scorer',
    expReward: 50,
  },
  {
    id: 'tut_ai',
    icon: Play,
    titleTh: '3. วิเคราะห์สปีดตบจากวิดีโอ',
    titleEn: '3. Video AI Shot Diagnostics',
    subtitleTh: 'อัปโหลดคลิปเพื่อวัดความเร็วลูกตบและมุมข้อศอก',
    subtitleEn: 'Upload video clips to track smash velocity and swing angles.',
    targetScreen: 'D3',
    actionLabelTh: 'วิเคราะห์วิดีโอ',
    actionLabelEn: 'Try Video AI',
    expReward: 60,
  },
  {
    id: 'tut_guild',
    icon: Heart,
    titleTh: '4. จอยก๊วนแบดและหารค่าคอร์ท',
    titleEn: '4. Join Guild & Split Bills',
    subtitleTh: 'หาก๊วนระดับเดียวกัน สแกนจ่ายพร้อมเพย์และหารค่าคอร์ทอัตโนมัติ',
    subtitleEn: 'Join matching skill groups and split court fees via PromptPay.',
    targetScreen: 'E1',
    actionLabelTh: 'ดูก๊วนแนะนำ',
    actionLabelEn: 'View Guilds',
    expReward: 40,
  },
];

export const GameCompanionWidget: React.FC = () => {
  const { language, navigateTo, currentScreen, gainExp, player } = useApp();
  const isThai = language === 'th';

  const [isOpen, setIsOpen] = useState(false);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'tutorial' | 'tips' | 'quests' | 'cheer'>('tutorial');
  const [hasHighFivedToday, setHasHighFivedToday] = useState(false);
  const [isHighFiveAnimating, setIsHighFiveAnimating] = useState(false);
  const [cheerReaction, setCheerReaction] = useState<string | null>(null);
  const [isBubbleDismissed, setIsBubbleDismissed] = useState(false);

  // Auto cycle speech bubble every 8 seconds
  useEffect(() => {
    const speeches = isThai ? COMPANION_SPEECHES_TH : COMPANION_SPEECHES_EN;
    const interval = setInterval(() => {
      setSpeechIndex((prev) => (prev + 1) % speeches.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isThai]);

  const currentSpeech = isThai
    ? COMPANION_SPEECHES_TH[speechIndex]
    : COMPANION_SPEECHES_EN[speechIndex];

  // Daily high-five action
  const handleHighFive = () => {
    if (hasHighFivedToday || isHighFiveAnimating) {
      playSelectSound();
      setCheerReaction(isThai ? 'ไฮไฟว์กันไปแล้ววันนี้ พรุ่งนี้มาแปะมือใหม่นะเพื่อน!' : 'High-fived already today! Come back tomorrow!');
      return;
    }

    setIsHighFiveAnimating(true);
    playSmashSound();
    setTimeout(() => {
      playLevelUpSound();
      gainExp(30, isThai ? 'ไฮไฟว์กับน้องสแมชชี่ประจำวัน (+30 คะแนน)' : 'Daily High-Five with Smashy (+30 XP)');
      setHasHighFivedToday(true);
      setIsHighFiveAnimating(false);
      setCheerReaction(isThai ? 'เย่! แปะมือสำเร็จ พลังบวกเต็มเปี่ยม พร้อมลงคอร์ทแล้ว!' : 'Awesome! High-five claimed, full energy to dominate!');
    }, 600);
  };

  const handleCheerSound = (message: string) => {
    playCoinSound();
    setCheerReaction(message);
  };

  // Adjust widget position depending on whether BottomTabBar is shown
  const isFullFlowScreen = [
    'A1', 'A2',
    'B2', 'B3', 'B4',
    'C1', 'C4',
    'D3',
    'E2', 'E3',
    'F2',
  ].includes(currentScreen);

  const bottomPositionClass = isFullFlowScreen ? 'bottom-5' : 'bottom-20';

  return (
    <>
      {/* ============================================================ */}
      {/* 1. FLOATING COMPANION BUBBLE WIDGET (Always visible) */}
      {/* ============================================================ */}
      <div
        className={`absolute ${bottomPositionClass} right-3 z-30 flex items-end gap-2 pointer-events-auto transition-all duration-300 select-none`}
      >
        {/* Animated Speech Bubble */}
        <AnimatePresence>
          {!isBubbleDismissed && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative max-w-[210px] bg-[#ffffff] rounded-2xl shadow-xl px-3 py-2 text-left cursor-pointer group"
              onClick={() => {
                playSelectSound();
                setIsOpen(true);
              }}
            >
              {/* Close mini badge */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playSelectSound();
                  setIsBubbleDismissed(true);
                }}
                className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-[#000000] text-white flex items-center justify-center text-[9px] opacity-70 hover:opacity-100 transition-opacity"
                title="Dismiss tip"
              >
                ×
              </button>

              {/* Speech bubble tail pointing right */}
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[#ffffff] rotate-45" />

              <div className="flex items-center gap-1 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#7cd7a0] animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#7cd7a0]">
                  {isThai ? 'น้องสแมชชี่' : 'SMASHY #15'}
                </span>
                <span className="text-[9px] text-neutral-600 font-bold ml-auto flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-[#e85729] fill-[#e85729]" />
                  {isThai ? 'คู่มือ' : 'GUIDE'}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-neutral-800 leading-tight">
                {currentSpeech}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Avatar Button */}
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setIsOpen(true);
              setIsBubbleDismissed(false);
            }}
            aria-label="Open Smashy Badminton Companion"
            className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#7cd7a0] via-[#e85729] to-[#e85729] shadow-2xl cursor-pointer active:scale-90 transition-transform group flex items-center justify-center"
          >
            {/* Pulsing ring aura */}
            <span className="absolute inset-0 rounded-full bg-[#e85729]/40 animate-ping opacity-60 pointer-events-none" />

            {/* Inner Avatar Container with Precise Mascot Face Crop */}
            <div className="w-full h-full rounded-full overflow-hidden bg-[#243b34] relative">
              <img
                src={MASCOT_IMAGE_URL}
                alt="Smashy Badminton Hero #15"
                className="w-full h-full object-cover object-[51%_22%] scale-110 group-hover:scale-125 transition-transform duration-300"
              />
            </div>

            {/* Floating Level / Number Badge */}
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#e85729] text-white text-[9px] font-black uppercase tracking-wider shadow-md">
              #15
            </span>

            {/* Live Indicator Dot */}
            <span className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 rounded-full bg-[#7cd7a0] border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </span>
          </button>
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* 2. FULL INTERACTIVE GAME GUIDE & COMPANION MODAL */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-full max-w-sm max-h-[90vh] bg-[#f8f9fa] rounded-[32px] overflow-hidden shadow-2xl flex flex-col relative text-black"
            >
              {/* Modal Top Banner with Smashy Hero Presentation */}
              <div className="relative bg-gradient-to-br from-[#1a3a30] via-[#243b34] to-[#0f241d] text-white p-4 pt-5 shrink-0 overflow-hidden">
                {/* Background badminton court ambient graphics */}
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                  <div className="w-full h-full border border-white/20 m-2" />
                  <div className="w-full h-1/2 border-b border-white/20 absolute top-0" />
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setIsOpen(false);
                  }}
                  className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Mascot Profile Header */}
                <div className="flex items-center gap-3.5 relative z-10">
                  {/* Big Animated Mascot Frame */}
                  <motion.div
                    animate={{ rotate: [0, 2, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-xl bg-[#243b34] relative"
                  >
                    <img
                      src={MASCOT_IMAGE_URL}
                      alt="Smashy Hero"
                      className="w-full h-full object-cover object-[51%_22%] scale-110"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs py-0.5 text-center text-[8px] font-black uppercase text-[#e85729] tracking-wider">
                      {isThai ? 'คู่หู #15' : 'HERO #15'}
                    </div>
                  </motion.div>

                  {/* Character Bio & Vitality */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#e85729] text-black text-[10px] font-black uppercase tracking-wider">
                        {isThai ? 'คู่หูเลเวล 10' : 'LVL 10 COMPANION'}
                      </span>
                      <span className="text-[10px] text-[#7cd7a0] font-bold flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3 fill-current" />
                        {isThai ? 'ผู้ช่วยส่วนตัว' : 'CO-PILOT'}
                      </span>
                    </div>

                    <h3 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-wide leading-none text-white">
                      {isThai ? 'น้องสแมชชี่' : 'SMASHY #15'}
                    </h3>

                    <p className="text-[11px] text-white/80 font-medium leading-tight mt-1 line-clamp-2">
                      {isThai
                        ? 'คู่หูนักแบดส่วนตัว พร้อมเควสต์ ทริกเทคนิค และช่วยนำทาง'
                        : 'Your badminton partner for pro tips, quests & guides!'}
                    </p>
                  </div>
                </div>

                {/* High-Five Mini-Game Banner */}
                <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="text-[11px] leading-tight">
                    <div className="font-bold text-[#e85729] flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {isThai ? 'เควสต์ไฮไฟว์ประจำวัน' : 'Daily High-Five Quest'}
                    </div>
                    <div className="text-[10px] text-white/70">
                      {hasHighFivedToday
                        ? (isThai ? 'รับไปแล้ว +30 คะแนนวันนี้' : 'Claimed +30 XP today!')
                        : (isThai ? 'แตะแปะมือรับทันที +30 คะแนน' : 'Tap to high-five for +30 XP')}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleHighFive}
                    disabled={isHighFiveAnimating}
                    className={`px-3 py-1.5 rounded-[1600px] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border border-[#000000] active:scale-95 shadow-md ${
                      hasHighFivedToday
                        ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                        : 'bg-[#e85729] hover:bg-[#ffe169] text-black'
                    }`}
                  >
                    <motion.span
                      animate={isHighFiveAnimating ? { rotate: [0, -30, 20, 0], scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      ✋
                    </motion.span>
                    <span>{hasHighFivedToday ? (isThai ? 'ไฮไฟว์แล้ว' : 'DONE') : (isThai ? 'แปะมือเลย!' : 'HIGH FIVE')}</span>
                  </button>
                </div>

                {/* Dynamic Cheer/Feedback Toast */}
                <AnimatePresence>
                  {cheerReaction && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 p-2 rounded-xl bg-white text-black text-[11px] font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#e85729] shrink-0" />
                      <span className="flex-1">{cheerReaction}</span>
                      <button
                        type="button"
                        onClick={() => setCheerReaction(null)}
                        className="text-neutral-600 hover:text-black font-extrabold text-xs ml-1"
                      >
                        ×
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Tabs (Tutorial / Tips / Quests / Cheer) */}
              <div className="flex border-b border-neutral-200 bg-white px-2 pt-2 gap-1 text-[11px] font-black uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setActiveTab('tutorial');
                  }}
                  className={`flex-1 py-2 rounded-t-xl transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'tutorial'
                      ? 'bg-[#f8f9fa] text-[#7cd7a0] border-b-2 border-[#7cd7a0]'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{isThai ? 'คู่มือแอป' : 'Tour'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setActiveTab('tips');
                  }}
                  className={`flex-1 py-2 rounded-t-xl transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'tips'
                      ? 'bg-[#f8f9fa] text-[#7cd7a0] border-b-2 border-[#7cd7a0]'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  <Flame className="w-3 h-3 text-[#e85729]" />
                  <span>{isThai ? 'ทริคสแมช' : 'Tips'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setActiveTab('quests');
                  }}
                  className={`flex-1 py-2 rounded-t-xl transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'quests'
                      ? 'bg-[#f8f9fa] text-[#7cd7a0] border-b-2 border-[#7cd7a0]'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  <Trophy className="w-3 h-3 text-[#e85729]" />
                  <span>{isThai ? 'เควสต์' : 'Quests'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setActiveTab('cheer');
                  }}
                  className={`flex-1 py-2 rounded-t-xl transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'cheer'
                      ? 'bg-[#f8f9fa] text-[#7cd7a0] border-b-2 border-[#7cd7a0]'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  <Smile className="w-3 h-3 text-[#15803d]" />
                  <span>{isThai ? 'คุยเล่น' : 'Cheer'}</span>
                </button>
              </div>

              {/* Scrollable Tab Content Body */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 min-h-0 bg-[#f8f9fa]">
                {/* ================================================= */}
                {/* TAB 1: APP WALKTHROUGH & TUTORIAL */}
                {/* ================================================= */}
                {activeTab === 'tutorial' && (
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-2xl bg-white shadow-xs">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {isThai
                          ? 'ยินดีต้อนรับสู่แอปแบดมินตันยุคใหม่! น้องสแมชชี่ขอแนะนำ 4 ฟีเจอร์เด็ดที่จะทำให้การตีแบดของคุณสนุกและง่ายขึ้น'
                          : 'Welcome to the modern badminton app! Here are 4 essential features to level up your games:'}
                      </p>
                    </div>

                    {TUTORIAL_CHAPTERS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          className="p-3 rounded-2xl bg-white shadow-xs flex items-start gap-3 hover:shadow-md transition-shadow"
                        >
                          <div className="w-9 h-9 rounded-xl bg-[#7cd7a0]/10 text-[#7cd7a0] flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-bold text-black">
                                {isThai ? item.titleTh : item.titleEn}
                              </h4>
                              <span className="text-[10px] font-extrabold text-[#15803d] bg-[#7cd7a0]/20 px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                                +{item.expReward} {isThai ? 'คะแนน' : 'XP'}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-600 leading-tight mt-0.5">
                              {isThai ? item.subtitleTh : item.subtitleEn}
                            </p>
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  playSelectSound();
                                  setIsOpen(false);
                                  navigateTo(item.targetScreen, 'forward');
                                }}
                                className="px-3 py-1.5 rounded-[1600px] bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-black cursor-pointer active:scale-95 transition-transform"
                              >
                                <span>{isThai ? item.actionLabelTh : item.actionLabelEn}</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ================================================= */}
                {/* TAB 2: PRO TIPS & TACTICS */}
                {/* ================================================= */}
                {activeTab === 'tips' && (
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-2xl bg-[#e85729]/15 text-black text-xs font-bold flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#e85729] shrink-0" />
                      <span>{isThai ? 'เคล็ดลับเสริมพลังจากน้องสแมชชี่' : 'Smashy Pro Badminton Masterclass'}</span>
                    </div>

                    {PRO_TIPS.map((tip) => (
                      <div
                        key={tip.id}
                        className="p-3 rounded-2xl bg-white shadow-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#e85729]/10 text-[#e85729]">
                            {isThai ? tip.badgeTh : tip.badge}
                          </span>
                          <span className="text-[10px] text-neutral-600 font-semibold">
                            {isThai ? tip.categoryTh : tip.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-black leading-tight">
                          {isThai ? tip.title : tip.titleEn}
                        </h4>
                        <p className="text-[11px] text-neutral-700 leading-relaxed">
                          {isThai ? tip.desc : tip.descEn}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ================================================= */}
                {/* TAB 3: MISSIONS & QUESTS SHORTCUT */}
                {/* ================================================= */}
                {activeTab === 'quests' && (
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-2xl bg-white shadow-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-black">
                          {isThai ? 'เลเวลผู้เล่นปัจจุบัน' : 'Player Level'}
                        </span>
                        <span className="text-xs font-black text-[#7cd7a0]">
                          {isThai ? `เลเวล ${player.level}` : `LVL ${player.level}`}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#7cd7a0] h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (player.currentExp / player.nextLevelExp) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-neutral-600 mt-1 font-semibold">
                        <span>{player.currentExp} {isThai ? 'คะแนน' : 'XP'}</span>
                        <span>
                          {isThai
                            ? `${player.nextLevelExp} คะแนน เพื่อเลเวลถัดไป`
                            : `${player.nextLevelExp} XP to next level`}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white shadow-xs space-y-2">
                      <h4 className="text-xs font-black uppercase text-black">
                        {isThai ? 'เควสต์เร่งด่วนประจำวัน' : 'Active Quests'}
                      </h4>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                        <div className="text-[11px]">
                          <div className="font-bold text-black">{isThai ? 'จองคอร์ทวันนี้' : 'Book a court today'}</div>
                          <div className="text-[10px] text-neutral-600">{isThai ? '+50 คะแนน' : '+50 XP'}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            playSelectSound();
                            setIsOpen(false);
                            navigateTo('B1');
                          }}
                          className="px-2.5 py-1 rounded-[1600px] bg-black text-white text-[10px] font-bold uppercase border border-black cursor-pointer active:scale-95"
                        >
                          {isThai ? 'ไปจอง' : 'GO'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                        <div className="text-[11px]">
                          <div className="font-bold text-black">{isThai ? 'นับคะแนนสด 1 แมตช์' : 'Log 1 Live Match'}</div>
                          <div className="text-[10px] text-neutral-600">{isThai ? '+75 คะแนน' : '+75 XP'}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            playSelectSound();
                            setIsOpen(false);
                            navigateTo('C1');
                          }}
                          className="px-2.5 py-1 rounded-[1600px] bg-black text-white text-[10px] font-bold uppercase border border-black cursor-pointer active:scale-95"
                        >
                          {isThai ? 'เริ่มแข่ง' : 'PLAY'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                        <div className="text-[11px]">
                          <div className="font-bold text-black">{isThai ? 'ฝึกซ้อม 3 ท่าจากโค้ช' : 'Complete 3 Coach Drills'}</div>
                          <div className="text-[10px] text-neutral-600">{isThai ? '+100 คะแนน' : '+100 XP'}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            playSelectSound();
                            setIsOpen(false);
                            navigateTo('D2');
                          }}
                          className="px-2.5 py-1 rounded-[1600px] bg-black text-white text-[10px] font-bold uppercase border border-black cursor-pointer active:scale-95"
                        >
                          {isThai ? 'ไปซ้อม' : 'DRILL'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================================================= */}
                {/* TAB 4: TALK & CHEER (Sound effects & game dialogue) */}
                {/* ================================================= */}
                {activeTab === 'cheer' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-white shadow-xs text-center space-y-2">
                      <div className="w-16 h-16 rounded-full mx-auto overflow-hidden bg-[#243b34] p-0.5 shadow-md">
                        <img
                          src={MASCOT_IMAGE_URL}
                          alt="Smashy"
                          className="w-full h-full object-cover object-[51%_22%]"
                        />
                      </div>
                      <h4 className="text-xs font-black uppercase text-black">
                        {isThai ? 'กล่องเสียงส่งกำลังใจจากสแมชชี่!' : "Smashy's Cheering Box"}
                      </h4>
                      <p className="text-[11px] text-neutral-600">
                        {isThai
                          ? 'กดปุ่มด้านล่างเพื่อฟังเสียงเอฟเฟกต์และข้อความเสริมกำลังใจก่อนลงคอร์ท'
                          : 'Tap below for retro arcade sound effects and motivational boosts!'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleCheerSound(
                            isThai
                              ? 'สแมชชี่: "สุดยอด! วอร์มร่างกายให้พร้อม แล้วลุยให้เต็มที่!"'
                              : 'Smashy: "Warm up well and smash hard today!"'
                          )
                        }
                        className="p-3 rounded-2xl bg-white hover:bg-neutral-50 shadow-xs border border-black text-left cursor-pointer active:scale-95 transition-transform"
                      >
                        <div className="text-lg">🔥</div>
                        <div className="text-[11px] font-bold text-black mt-1">
                          {isThai ? 'ปลุกใจก่อนแข่ง' : 'Pre-Match Hype'}
                        </div>
                        <div className="text-[9px] text-neutral-600">{isThai ? 'เสียงสแมช' : 'Smash SFX'}</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          playLevelUpSound();
                          setCheerReaction(
                            isThai
                              ? 'สแมชชี่: "ยินดีด้วยครับเพื่อน! ความพยายามไม่เคยทรยศใคร!"'
                              : 'Smashy: "Level Up mindset! Great job today!"'
                          );
                        }}
                        className="p-3 rounded-2xl bg-white hover:bg-neutral-50 shadow-xs border border-black text-left cursor-pointer active:scale-95 transition-transform"
                      >
                        <div className="text-lg">🏆</div>
                        <div className="text-[11px] font-bold text-black mt-1">
                          {isThai ? 'ฉลองชัยชนะ' : 'Victory Fanfare'}
                        </div>
                        <div className="text-[9px] text-neutral-600">{isThai ? 'เสียงเลเวลอัป' : 'Fanfare SFX'}</div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleCheerSound(
                            isThai
                              ? 'สแมชชี่: "อย่าลืมจิบน้ำทุกๆ 15 นาที และคูลดาวน์กล้ามเนื้อมือด้วยนะ"'
                              : 'Smashy: "Hydrate every 15 mins and stretch your wrist!"'
                          )
                        }
                        className="p-3 rounded-2xl bg-white hover:bg-neutral-50 shadow-xs border border-black text-left cursor-pointer active:scale-95 transition-transform"
                      >
                        <div className="text-lg">💧</div>
                        <div className="text-[11px] font-bold text-black mt-1">
                          {isThai ? 'คำเตือนสุขภาพ' : 'Health Reminder'}
                        </div>
                        <div className="text-[9px] text-neutral-600">{isThai ? 'เสียงเหรียญ' : 'Coin SFX'}</div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleCheerSound(
                            isThai
                              ? 'สแมชชี่: "ถ้าเสียแต้ม อย่าหัวร้อนนะ หายใจลึกๆ แล้วเซ็ตแต้มใหม่!"'
                              : 'Smashy: "Stay calm after lost rallies, focus on the next point!"'
                          )
                        }
                        className="p-3 rounded-2xl bg-white hover:bg-neutral-50 shadow-xs border border-black text-left cursor-pointer active:scale-95 transition-transform"
                      >
                        <div className="text-lg">🧘</div>
                        <div className="text-[11px] font-bold text-black mt-1">
                          {isThai ? 'คุมสติในสนาม' : 'Mental Focus'}
                        </div>
                        <div className="text-[9px] text-neutral-600">{isThai ? 'เสียงเตือน' : 'Focus SFX'}</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Quick Action Footer */}
              <div className="p-3 bg-white border-t border-neutral-200 flex items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setIsOpen(false);
                    navigateTo('D1');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-[1600px] bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{isThai ? 'หน้าโค้ชส่วนตัว' : 'Coach Hub'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setIsOpen(false);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-[1600px] bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider border border-black flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7cd7a0]" />
                  <span>{isThai ? 'ปิดหน้าต่าง' : 'Got it!'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
