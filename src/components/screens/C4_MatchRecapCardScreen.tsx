import React, { useState } from 'react';
import { Share2, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const C4_MatchRecapCardScreen: React.FC = () => {
  const { player, navigateTo, language } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareStory = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      <MobileHeader
        title={language === 'th' ? 'การ์ดสรุปผลนักกีฬา' : 'Athlete Recap Card'}
        showBack
      />

      <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-12">
        {/* Banner Label */}
        <div className="text-center px-2 space-y-1">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#ffd731] border border-[#000000] text-[#000000] inline-block">
              {language === 'th' ? 'พร้อมแชร์ลงสตอรี่' : 'Story Share Ready'}
            </span>
            <span className="text-[10px] font-bold text-[#000000]/60 uppercase">
              {language === 'th' ? 'การ์ดทองคำ' : 'Gold Edition'}
            </span>
          </div>
          <h2 className="font-['Antonio',sans-serif] text-3xl font-black tracking-tight leading-[0.88] uppercase text-[#000000]">
            {language === 'th' ? 'การ์ดนักกีฬาประจำแมตช์' : 'ATHLETE TRADING CARD'}
          </h2>
          <p className="text-xs text-[#000000]/70 font-bold mt-1">
            {language === 'th'
              ? 'แชร์ผลงานการแข่งขันขึ้น Instagram Story, TikTok และ Line ได้ทันที'
              : 'Share your match glory directly to Instagram Story, TikTok, and Line.'}
          </p>
        </div>

        {/* Modern Athlete Card */}
        <div className="w-full rounded-[36px] bg-[#ffd731] border-2 border-[#000000] p-4 text-[#000000]">
          {/* Top row: OVR, Position, Tier */}
          <div className="flex items-start justify-between">
            <div>
              <div className="font-['Antonio',sans-serif] text-6xl font-black leading-none text-[#000000]">
                88
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.032em] mt-1 text-[#000000]">
                OVR · SMASH HUNTER
              </div>
              <div className="text-[10px] font-bold text-[#000000]/70">
                {player.tier} Tier · Lv.{player.level}
              </div>
            </div>

            {/* Shuttlecock Avatar Sticker */}
            <div className="w-16 h-16 rounded-[20px] bg-[#ffffff] border border-[#000000] flex items-center justify-center text-3xl">
              🏸
            </div>
          </div>

          {/* Athlete Name */}
          <div className="mt-4 pb-3 border-b border-[#000000]/20">
            <h3 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight text-[#000000] leading-none">
              {player.name}
            </h3>
            <p className="text-[11px] text-[#000000]/80 font-bold mt-1">
              Bangkok Smashers Guild · Astrox 99 Pro
            </p>
          </div>

          {/* 5-Axis Stats Grid */}
          <div className="grid grid-cols-3 gap-2 my-3 text-center">
            <div className="p-2 rounded-[16px] bg-[#ffffff] border border-[#000000]">
              <span className="text-[9px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">PWR</span>
              <span className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{player.skillRadar.power}</span>
            </div>
            <div className="p-2 rounded-[16px] bg-[#ffffff] border border-[#000000]">
              <span className="text-[9px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">SPD</span>
              <span className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{player.skillRadar.speed}</span>
            </div>
            <div className="p-2 rounded-[16px] bg-[#ffffff] border border-[#000000]">
              <span className="text-[9px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">CTL</span>
              <span className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{player.skillRadar.control}</span>
            </div>
            <div className="p-2 rounded-[16px] bg-[#ffffff] border border-[#000000]">
              <span className="text-[9px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">STA</span>
              <span className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{player.skillRadar.stamina}</span>
            </div>
            <div className="p-2 rounded-[16px] bg-[#ffffff] border border-[#000000]">
              <span className="text-[9px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">TAC</span>
              <span className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{player.skillRadar.tactics}</span>
            </div>
            <div className="p-2 rounded-[16px] bg-[#55db9c] text-[#000000] font-black border border-[#000000]">
              <span className="text-[9px] uppercase block tracking-[0.032em]">STREAK</span>
              <span className="font-['Antonio',sans-serif] text-xl font-black">{player.streakWeeks}W</span>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="flex items-center justify-between text-[10px] font-bold text-[#000000]/70 pt-2 border-t border-[#000000]/20">
            <span>BWF COURT MASTER 2026</span>
            <span className="text-[#000000] font-black">SMASH VERIFIED</span>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="w-full space-y-2 pt-2">
          <button
            type="button"
            onClick={handleShareStory}
            className="w-full py-3.5 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000]"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 stroke-[3] text-[#55db9c] shrink-0" />
                <span className="whitespace-nowrap">{language === 'th' ? 'คัดลอกลิงก์สตอรี่แล้ว!' : 'COPIED FOR STORY!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{language === 'th' ? 'แชร์ลง IG / TIKTOK STORY' : 'SHARE STORY (IG / TIKTOK)'}</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigateTo('D1')}
              className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
            >
              <span>{language === 'th' ? 'เรดาร์โค้ช (D1)' : 'COACH RADAR (D1)'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => navigateTo('E3')}
              className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
            >
              <span>MATCHMAKER (E3)</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
