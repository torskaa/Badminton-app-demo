/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Trophy, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import athleteHeroImg from '../../assets/images/onboarding_player_hero_1794910127129.jpg';
import courtHallImg from '../../assets/images/onboarding_court_aerial_1794910127319.jpg';

type OnboardingStep = 0 | 1 | 2;

export const A1_WelcomeScreen: React.FC = () => {
  const {
    navigateTo,
    completeOnboarding,
    authUser,
    signInWithGoogle,
    isAuthBusy,
    language,
    setLanguage,
  } = useApp();

  const isThai = language === 'th';
  const [activeSlide, setActiveSlide] = useState<OnboardingStep>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [courtImgFailed, setCourtImgFailed] = useState(false);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const goToSlide = (nextIdx: OnboardingStep) => {
    setDirection(nextIdx >= activeSlide ? 1 : -1);
    setActiveSlide(nextIdx);
  };

  const handleNext = () => {
    if (activeSlide < 2) {
      goToSlide((activeSlide + 1) as OnboardingStep);
    } else {
      completeOnboarding('HOME');
    }
  };

  const handlePrev = () => {
    if (activeSlide > 0) {
      goToSlide((activeSlide - 1) as OnboardingStep);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between bg-gradient-to-b from-[#f7f8fa] via-[#f5f7f6] to-[#e4f5eb] text-[#111827] relative overflow-hidden select-none">
      {/* Subtle Minimal Top Controls */}
      <header className="app-header-safe px-6 pb-2 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2">
          <img
            src="/apple-touch-icon.png"
            alt="SmashAI"
            className="w-7 h-7 rounded-full object-cover shadow-xs"
          />
          <span className="font-['Antonio',sans-serif] text-[17px] font-bold tracking-tight text-[#004d2c] whitespace-nowrap">
            SmashAI
          </span>
        </div>

        <div className="flex items-center bg-[#e9ecef]/85 p-0.5 rounded-full">
          <button
            type="button"
            onClick={() => setLanguage('th')}
            className={`no-doodle min-h-[34px] px-2.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
              isThai ? 'bg-[#ffffff] text-[#111827] shadow-xs' : 'text-[#6b7280]'
            }`}
          >
            TH
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`no-doodle min-h-[34px] px-2.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
              !isThai ? 'bg-[#ffffff] text-[#111827] shadow-xs' : 'text-[#6b7280]'
            }`}
          >
            EN
          </button>
        </div>
      </header>

      {/* Main Editorial Onboarding Stage */}
      <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 && activeSlide < 2) {
                handleNext();
              } else if (info.offset.x > 50 && activeSlide > 0) {
                handlePrev();
              }
            }}
            className="flex-1 min-h-0 flex flex-col justify-between relative"
          >
            {/* SLIDE 1: Editorial Stacked Headline + Top CTA + Bottom-Right Ribbon Art */}
            {activeSlide === 0 && (
              <div className="flex-1 min-h-0 flex flex-col justify-start px-7 pt-8 sm:pt-12 relative">
                <div className="relative z-20 max-w-[300px]">
                  {isThai ? (
                    <h1 className="text-[34px] sm:text-[38px] leading-[1.16] text-[#111827]">
                      <span className="font-semibold block">ยกระดับ</span>
                      <span className="font-normal text-[#374151] block">เกมแบดของคุณ</span>
                      <span className="font-normal text-[#374151] block">ด้วย </span>
                      <span className="font-bold text-[#004d2c]">โค้ช AI ส่วนตัว</span>
                    </h1>
                  ) : (
                    <h1 className="text-[36px] sm:text-[40px] leading-[1.08] tracking-tight text-[#111827]">
                      <span className="font-semibold block">Empower</span>
                      <span className="font-normal text-[#1f2937] block">Your Game With</span>
                      <span className="font-bold text-[#004d2c] block">Smart AI</span>
                      <span className="font-normal text-[#1f2937] block">Coaching</span>
                    </h1>
                  )}

                  <p className="mt-4 text-[13.5px] leading-relaxed text-[#6b7280] max-w-[260px]">
                    {isThai
                      ? 'วิเคราะห์ลูกตบ ฟุตเวิร์ก 6 มุม และแผนซ้อมรายวันที่ออกแบบเพื่อคุณโดยเฉพาะ'
                      : 'Decode peak smash velocity, net accuracy, and personalized drills after every match.'}
                  </p>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label={isThai ? 'ถัดไป' : 'Next'}
                    className="no-doodle mt-7 w-14 h-14 rounded-full bg-[#004d2c] hover:bg-[#003b22] text-[#ffffff] shadow-[0_12px_28px_rgba(0,77,44,0.28)] flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                  >
                    <ArrowRight className="w-5 h-5 stroke-[2.2]" />
                  </button>
                </div>

                {/* Large Soft Architectural SmashAI Ribbon Monogram (Bottom-Right Anchor) */}
                <svg
                  viewBox="0 0 320 320"
                  className="pointer-events-none select-none absolute -bottom-12 -right-10 w-[290px] h-[290px] sm:w-[320px] sm:h-[320px] z-10"
                  aria-hidden="true"
                >
                  <path
                    d="M118 295 C72 250, 70 184, 122 146 C158 120, 222 148, 250 110 C276 74, 240 24, 192 48 C144 72, 160 144, 212 184 C264 224, 260 288, 200 310"
                    fill="none"
                    stroke="#bcecd0"
                    strokeWidth="44"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.72"
                  />
                  <path
                    d="M118 295 C72 250, 70 184, 122 146 C158 120, 222 148, 250 110"
                    fill="none"
                    stroke="#86dfb0"
                    strokeWidth="44"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                </svg>
              </div>
            )}

            {/* SLIDE 2: Tilted Layered 3-Card Collage + Mixed-Weight Headline */}
            {activeSlide === 1 && (
              <div className="flex-1 min-h-0 flex flex-col justify-between px-7 pt-2 pb-2">
                {/* Floating Overlapping Collage Stage */}
                <div className="relative flex-1 min-h-[250px] flex items-center justify-center my-auto">
                  {/* Back-Left Court Photo Card */}
                  <div
                    className="absolute w-[164px] h-[205px] rounded-[22px] overflow-hidden bg-[#1a3a2a] shadow-[0_16px_34px_rgba(15,23,42,0.16)] transform -translate-x-[58px] -translate-y-[8px] -rotate-[9deg]"
                  >
                    {!courtImgFailed ? (
                      <img
                        src={courtHallImg}
                        alt={isThai ? 'สนามแบดมินตันในร่ม' : 'Indoor badminton hall'}
                        referrerPolicy="no-referrer"
                        onError={() => setCourtImgFailed(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#004d2c] to-[#15803d]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-[#ffffff]">
                      <div className="text-[10px] font-medium opacity-90">
                        {isThai ? 'สนามมาตรฐาน BWF' : 'Pro Floor Mats'}
                      </div>
                      <div className="text-xs font-bold tabular-nums">
                        {isThai ? '24 สนามใกล้คุณ' : '24 Nearby Halls'}
                      </div>
                    </div>
                  </div>

                  {/* Back-Right Real-Time Slot Card */}
                  <div className="absolute w-[170px] h-[212px] rounded-[22px] bg-[#ffffff] p-3.5 shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#000000]/5 transform translate-x-[54px] translate-y-[16px] rotate-[7deg] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-semibold text-[#6b7280]">
                        <span>{isThai ? 'รอบวันนี้' : 'Today'}</span>
                        <span className="text-[#004d2c] tabular-nums">1.8 {isThai ? 'กม.' : 'km'}</span>
                      </div>
                      <div className="text-sm font-bold text-[#111827] mt-1 leading-snug">
                        {isThai ? 'วินเนอร์ อารีน่า พระราม 9' : 'Winner Arena Rama 9'}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#f3f6f4] text-[11px]">
                        <span className="font-semibold text-[#111827] tabular-nums">19:00</span>
                        <span className="font-bold text-[#15803d]">{isThai ? 'ว่าง' : 'Open'}</span>
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#e8f7ee] text-[11px]">
                        <span className="font-semibold text-[#111827] tabular-nums">20:00</span>
                        <span className="font-bold text-[#004d2c] tabular-nums">฿280</span>
                      </div>
                    </div>

                    <div className="self-end w-11 h-11 rounded-full bg-[#e85729] text-[#ffffff] flex items-center justify-center text-center text-[9px] font-bold leading-tight shadow-md rotate-[8deg] shrink-0">
                      {isThai ? 'จองสด\nGPS' : 'LIVE\nSLOTS'}
                    </div>
                  </div>

                  {/* Front Signature Dark Forest Green Card */}
                  <div className="relative z-10 w-[184px] h-[228px] rounded-[24px] bg-gradient-to-br from-[#06291b] via-[#004d2c] to-[#0a633e] text-[#ffffff] p-4 shadow-[0_24px_48px_rgba(0,45,25,0.28)] transform -translate-x-[6px] -translate-y-[14px] -rotate-[3deg] flex flex-col justify-between overflow-hidden">
                    <svg
                      viewBox="0 0 120 120"
                      className="absolute -right-5 top-8 w-28 h-28 opacity-20 pointer-events-none"
                      aria-hidden="true"
                    >
                      <rect x="10" y="10" width="90" height="100" fill="none" stroke="#7cd7a0" strokeWidth="2.5" />
                      <line x1="10" y1="60" x2="100" y2="60" stroke="#7cd7a0" strokeWidth="2" />
                      <line x1="55" y1="10" x2="55" y2="110" stroke="#7cd7a0" strokeWidth="1.5" />
                    </svg>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-wide text-[#7cd7a0] uppercase">
                        {isThai ? 'แผนที่สนามสด' : 'Live Court Map'}
                      </span>
                      <MapPin className="w-4 h-4 text-[#7cd7a0]" />
                    </div>

                    <div>
                      <div className="text-[22px] font-bold leading-[1.12] tracking-tight">
                        {isThai ? 'เช็กคอร์ทว่าง\nแบบเรียลไทม์' : 'REAL-TIME\nBOOKING'}
                      </div>
                      <div className="mt-2 h-0.5 w-10 bg-[#7cd7a0] rounded-full" />
                    </div>

                    <div className="text-[11px] text-[#d1fae5] leading-snug">
                      {isThai
                        ? 'Google Maps · QR E-Ticket ทันที'
                        : 'Google Maps · Instant QR E-Ticket'}
                    </div>
                  </div>
                </div>

                {/* Lower Left-Aligned Headline & Subtitle */}
                <div className="pt-3 pb-1 max-w-[310px]">
                  {isThai ? (
                    <h1 className="text-[26px] sm:text-[29px] leading-[1.18] text-[#111827]">
                      <span className="font-bold">จองคอร์ท</span>{' '}
                      <span className="font-normal text-[#374151]">ใกล้คุณ</span>
                      <br />
                      <span className="font-normal text-[#374151]">พร้อม </span>
                      <span className="font-bold text-[#004d2c]">รอบว่างเรียลไทม์</span>
                    </h1>
                  ) : (
                    <h1 className="text-[27px] sm:text-[30px] leading-[1.15] tracking-tight text-[#111827]">
                      <span className="font-bold">Elevate</span>{' '}
                      <span className="font-normal text-[#374151]">Your Court</span>
                      <br />
                      <span className="font-normal text-[#374151]">With </span>
                      <span className="font-bold text-[#004d2c]">Live Availability</span>
                    </h1>
                  )}
                  <p className="mt-2.5 text-[13px] text-[#6b7280] leading-relaxed">
                    {isThai
                      ? 'ค้นหาสนามบน Google Maps คำนวณระยะทาง GPS จริง และล็อกเวลาเล่นผ่านพร้อมเพย์ในไม่กี่วินาที'
                      : 'Browse real courts on Google Maps, sort by live GPS distance, and lock open hourly slots instantly.'}
                  </p>
                </div>
              </div>
            )}

            {/* SLIDE 3: Centered Portrait Cutout + Floating Accents + Centered Goal Headline */}
            {activeSlide === 2 && (
              <div className="flex-1 min-h-0 flex flex-col justify-between px-6 pt-1 pb-2 relative">
                {/* Centered Player Composition Blending Softly Into Canvas */}
                <div className="relative flex-1 min-h-[255px] flex items-end justify-center overflow-hidden">
                  <div className="relative w-[245px] sm:w-[270px] h-full max-h-[340px] flex items-end justify-center">
                    {!heroImgFailed ? (
                      <img
                        src={athleteHeroImg}
                        alt={isThai ? 'นักแบดมินตัน SmashAI' : 'SmashAI badminton athlete'}
                        referrerPolicy="no-referrer"
                        onError={() => setHeroImgFailed(true)}
                        className="w-full h-full object-cover object-top rounded-t-[140px] mix-blend-multiply"
                      />
                    ) : (
                      <div className="w-48 h-64 rounded-t-full bg-gradient-to-b from-[#7cd7a0]/40 to-transparent flex items-center justify-center">
                        <Users className="w-16 h-16 text-[#004d2c]" />
                      </div>
                    )}

                    {/* Smooth Seamless Bottom Dissolve into Canvas Mint Glow */}
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#eaf6ef] via-[#eaf6ef]/80 to-transparent"
                      aria-hidden="true"
                    />

                    {/* Floating Right Badminton Squad Mini-Card */}
                    <div
                      className="absolute right-0 top-[44%] w-12 h-14 rounded-2xl bg-[#004d2c] text-[#ffffff] shadow-[0_12px_24px_rgba(0,77,44,0.28)] flex flex-col items-center justify-center gap-0.5 rotate-[10deg]"
                      aria-hidden="true"
                    >
                      <Users className="w-4 h-4 text-[#7cd7a0]" />
                      <span className="text-[10px] font-bold tabular-nums">2v2</span>
                    </div>

                    {/* Floating Left Trophy / Achievement Mini-Card */}
                    <div
                      className="absolute left-0 bottom-7 w-13 h-12 rounded-2xl bg-[#ffffff] border border-[#000000]/5 shadow-[0_12px_26px_rgba(15,23,42,0.12)] flex items-center justify-center -rotate-[12deg]"
                      aria-hidden="true"
                    >
                      <Trophy className="w-5 h-5 text-[#e85729]" />
                    </div>
                  </div>
                </div>

                {/* Centered Lower Headline + Concise Action Strip */}
                <div className="pt-2 text-center relative z-10">
                  {isThai ? (
                    <h1 className="text-[25px] sm:text-[28px] leading-[1.2] text-[#111827] mx-auto">
                      <span className="font-normal text-[#374151]">หาก๊วน</span>{' '}
                      <span className="font-bold text-[#111827]">จัดคู่สมดุล</span>
                      <br />
                      <span className="font-normal text-[#374151]">และพิชิต</span>{' '}
                      <span className="font-bold text-[#004d2c]">เป้าหมายไปด้วยกัน</span>
                    </h1>
                  ) : (
                    <h1 className="text-[26px] sm:text-[29px] leading-[1.18] tracking-tight text-[#111827] mx-auto">
                      <span className="font-normal text-[#374151]">Stay</span>{' '}
                      <span className="font-bold text-[#111827]">Connected</span>{' '}
                      <span className="font-normal text-[#374151]">And</span>
                      <br />
                      <span className="font-normal text-[#374151]">Achieve</span>{' '}
                      <span className="font-bold text-[#004d2c]">Goals Together</span>
                    </h1>
                  )}

                  <p className="mt-1.5 text-[12.5px] text-[#6b7280]">
                    {isThai
                      ? 'จับคู่ 2v2 ตาม OVR · เช็กชื่อก๊วน · หารค่าสนามอัตโนมัติ'
                      : 'AI 2v2 matchmaking · Weekly RSVPs · Auto court bill split'}
                  </p>

                  {/* Optional Quiet Setup / Google Auth Links */}
                  <div className="mt-2 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => navigateTo('A2')}
                      className="no-doodle min-h-[36px] px-1 text-xs font-semibold text-[#004d2c] hover:underline cursor-pointer whitespace-nowrap"
                    >
                      {isThai ? 'ตั้งค่าสไตล์ผู้เล่น (+150 EXP)' : 'Set playstyle (+150 EXP)'}
                    </button>

                    {!authUser && (
                      <>
                        <span className="text-[#d1d5db]" aria-hidden="true">
                          ·
                        </span>
                        <button
                          type="button"
                          disabled={isAuthBusy}
                          onClick={async () => {
                            const ok = await signInWithGoogle();
                            if (ok) {
                              completeOnboarding('HOME');
                            }
                          }}
                          className="no-doodle min-h-[36px] px-1 text-xs font-semibold text-[#e85729] hover:underline cursor-pointer disabled:opacity-50 whitespace-nowrap"
                        >
                          {isAuthBusy
                            ? isThai
                              ? 'กำลังเชื่อมต่อ...'
                              : 'Signing in...'
                            : isThai
                              ? 'เข้าสู่ระบบ Google'
                              : 'Google Sign In'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Clean Editorial Bottom Bar: Bottom-Left Skip + Center Minimal Dots + Bottom-Right Circular CTA */}
      <footer className="px-7 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] flex items-center justify-between z-30 shrink-0">
        <button
          type="button"
          onClick={() => completeOnboarding('HOME')}
          className="no-doodle min-h-[44px] min-w-[44px] px-1 text-left text-[14px] font-medium text-[#4b5563] hover:text-[#111827] transition-colors cursor-pointer whitespace-nowrap"
        >
          {isThai ? 'ข้าม' : 'Skip'}
        </button>

        {/* Minimal Progress Dots */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Onboarding steps">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={activeSlide === idx}
              aria-label={isThai ? `หน้า ${idx + 1}` : `Slide ${idx + 1}`}
              onClick={() => goToSlide(idx as OnboardingStep)}
              className={`no-doodle h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                activeSlide === idx
                  ? 'w-6 bg-[#004d2c]'
                  : 'w-1.5 bg-[#cbd5e1] hover:bg-[#94a3b8]'
              }`}
            />
          ))}
        </div>

        {/* Bottom-Right Circular Next / Finish Button (On Slide 1 CTA sits under Headline just like reference) */}
        <div className="w-14 h-14 flex items-center justify-end shrink-0">
          {activeSlide > 0 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label={
                activeSlide === 2
                  ? isThai
                    ? 'เข้าสู่หน้าหลัก'
                    : 'Get started'
                  : isThai
                    ? 'ถัดไป'
                    : 'Next'
              }
              className="no-doodle w-14 h-14 rounded-full bg-[#004d2c] hover:bg-[#003b22] text-[#ffffff] shadow-[0_12px_28px_rgba(0,77,44,0.28)] flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowRight className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
