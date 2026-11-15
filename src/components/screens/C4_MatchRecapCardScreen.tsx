import React, { useState } from 'react';
import { Share2, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { DoodleAvatar } from '../common/DoodleAvatar';

export const C4_MatchRecapCardScreen: React.FC = () => {
  const { player, navigateTo, language } = useApp();
  const isThai = language === 'th';
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareStory = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-hidden">
      <MobileHeader showBack />

      <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-12">
        {/* Banner Label */}
        <div className="text-center px-2 space-y-1">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#7cd7a0] text-[#000000] inline-block">
              {isThai ? 'พร้อมแชร์ลงสตอรี่' : 'Story Share Ready'}
            </span>
            <span className="text-[10px] font-bold text-[#000000]/60 uppercase">
              {isThai ? 'รุ่นพิเศษ' : 'Gold Edition'}
            </span>
          </div>
          <h2 className="font-['Antonio',sans-serif] text-3xl font-black tracking-tight leading-[0.88] uppercase text-[#000000]">
            {isThai ? 'การ์ดนักกีฬาประจำแมตช์' : 'ATHLETE TRADING CARD'}
          </h2>
          <p className="text-xs text-[#000000]/70 font-bold mt-1">
            {isThai
              ? 'แชร์สถิติลงสตอรี่ได้ทันที'
              : 'Share your match card directly to social stories'}
          </p>
        </div>

        {/* Modern Athlete Card */}
        <div className="w-full rounded-[36px] bg-[#7cd7a0] p-4 text-[#000000]">
          {/* Top row: OVR, Position, Tier */}
          <div className="flex items-start justify-between">
            <div>
              <div className="font-['Antonio',sans-serif] text-6xl font-black leading-none text-[#000000]">
                88
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.032em] mt-1 text-[#000000]">
                {isThai ? 'พลังรวม · สายตบพิฆาต' : 'OVR · SMASH HUNTER'}
              </div>
              <div className="text-[10px] font-bold text-[#000000]/70">
                {isThai ? `ระดับ${player.tier} · เลเวล ${player.level}` : `${player.tier} Tier · Lv.${player.level}`}
              </div>
            </div>

            <DoodleAvatar
              preset="karn"
              size="lg"
              ringClass="border-2 border-[#000000] shadow-xs"
            />
          </div>

          {/* Athlete Name */}
          <div className="mt-4 pb-3">
            <h3 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight text-[#000000] leading-none">
              {player.name}
            </h3>
            <p className="text-[11px] text-[#000000]/80 font-bold mt-1">
              {isThai ? 'ก๊วนตบสนั่นกรุงเทพฯ · แอสทรอกซ์ 99 โปร' : 'Bangkok Smashers Guild · Astrox 99 Pro'}
            </p>
          </div>

          {/* 5-Axis Stats Grid */}
          <div className="grid grid-cols-3 gap-2 my-3 text-center">
            <div className="p-2 rounded-[16px] bg-[#ffffff]">
              <span className="text-[9px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">
                {isThai ? 'พลังตบ' : 'PWR'}
              </span>
              <span className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{player.skillRadar.power}</span>
            </div>
            <div className="p-2 rounded-[16px] bg-[#ffffff]">
              <span className="text-[9px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">
                {isThai ? 'สปีด' : 'SPD'}
              </span>
              <span className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{player.skillRadar.speed}</span>
            </div>
            <div className="p-2 rounded-[16px] bg-[#ffffff]">
              <span className="text-[9px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">
                {isThai ? 'คุมลูก' : 'CTL'}
              </span>
              <span className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{player.skillRadar.control}</span>
            </div>
            <div className="p-2 rounded-[16px] bg-[#ffffff]">
              <span className="text-[9px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">
                {isThai ? 'ความอึด' : 'STA'}
              </span>
              <span className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{player.skillRadar.stamina}</span>
            </div>
            <div className="p-2 rounded-[16px] bg-[#ffffff]">
              <span className="text-[9px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">
                {isThai ? 'แท็กติก' : 'TAC'}
              </span>
              <span className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{player.skillRadar.tactics}</span>
            </div>
            <div className="p-2 rounded-[16px] bg-[#7cd7a0] text-[#000000] font-black">
              <span className="text-[9px] uppercase block tracking-[0.032em]">
                {isThai ? 'สตรีค' : 'STREAK'}
              </span>
              <span className="font-['Antonio',sans-serif] text-xl font-black">
                {isThai ? `${player.streakWeeks} สัปดาห์` : `${player.streakWeeks}W`}
              </span>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="flex items-center justify-between text-[10px] font-bold text-[#000000]/70 pt-2">
            <span>{isThai ? 'บัตรนักกีฬา 2026' : 'ATHLETE CARD 2026'}</span>
            <span className="text-[#000000] font-black">{isThai ? 'ยืนยันสถิติ' : 'VERIFIED'}</span>
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
                <Check className="w-4 h-4 stroke-[3] text-[#7cd7a0] shrink-0" />
                <span className="whitespace-nowrap">{isThai ? 'คัดลอกลิงก์แล้ว' : 'COPIED FOR STORY!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{isThai ? 'แชร์ลงสตอรี่' : 'SHARE STORY'}</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigateTo('D1')}
              className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
            >
              <span>{isThai ? 'เรดาร์โค้ช' : 'COACH RADAR'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => navigateTo('E3')}
              className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
            >
              <span>{isThai ? 'จับคู่ก๊วน' : 'MATCHMAKER'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
