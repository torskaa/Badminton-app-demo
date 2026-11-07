import React, { useState } from 'react';
import {
  QrCode,
  Search,
  Wallet,
  Calendar,
  MapPin,
  Star,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourtFacility } from '../../types';

export const HomeScreen: React.FC = () => {
  const { player, courts, setSelectedCourt, updateBooking, navigateTo, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectCourt = (court: CourtFacility) => {
    setSelectedCourt(court);
    updateBooking({ court, selectedCourtNumber: 1 });
    navigateTo('B2');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-y-auto overscroll-contain no-scrollbar pb-24">
      {/* 1. Slush-Style Clean Header Card with 1px Solid Black Border */}
      <div className="bg-[#ffffff] text-[#000000] px-4 pt-3 pb-12 border-b border-[#000000] relative">
        <div className="flex items-center justify-between gap-2.5 mb-3">
          {/* QR Code Scanner */}
          <button
            type="button"
            onClick={() => navigateTo('MAP')}
            className="w-9 h-9 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center text-[#000000] hover:bg-[#e9e9e9] active:scale-95 transition-transform cursor-pointer shrink-0"
            title="Scan QR Code"
          >
            <QrCode className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Global Search Bar */}
          <div
            onClick={() => navigateTo('MAP')}
            className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] cursor-pointer hover:bg-[#f3f4f6] transition-colors"
          >
            <Search className="w-4 h-4 text-[#000000]/60 shrink-0" />
            <input
              type="text"
              readOnly
              placeholder={t.searchGlobal}
              value={searchQuery}
              className="w-full bg-transparent text-xs font-semibold text-[#000000] placeholder:text-[#000000]/50 outline-none cursor-pointer"
            />
          </div>

          {/* Coin Badge & Avatar */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              onClick={() => navigateTo('FINANCE')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-[1600px] bg-[#ffd731] border border-[#000000] text-[#000000] text-[11px] font-black cursor-pointer active:scale-95 transition-transform"
            >
              <span>🪙</span>
              <span>120</span>
            </div>

            <div
              onClick={() => navigateTo('F1')}
              className="w-9 h-9 rounded-[1600px] border-2 border-[#000000] overflow-hidden bg-[#e9ccff] cursor-pointer hover:scale-105 active:scale-95 transition-transform shrink-0 relative"
            >
              <img
                src={player.avatarUrl}
                alt={player.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Greeting Banner */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h1 className="text-xl font-black text-[#000000] font-['Antonio',sans-serif] uppercase tracking-wide leading-tight flex items-center gap-1.5">
              <span>{t.goodEvening}</span>
              <span className="text-base">👋</span>
            </h1>
            <p className="text-[11px] text-[#000000]/70 font-bold mt-0.5">
              {t.subGreeting}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold bg-[#ffffff] border border-[#000000] px-2.5 py-1 rounded-[1600px] text-[#000000] shrink-0">
            <MapPin className="w-3 h-3 text-[#fb4903]" />
            <span>{t.city}</span>
          </div>
        </div>
      </div>

      {/* 2. Floating Quick Info Widget (Slush White Paper Card with 1px Black Border) */}
      <div className="px-4 -mt-8 z-10">
        <div className="bg-[#ffffff] rounded-[28px] p-3.5 border border-[#000000] shadow-sm space-y-2">
          {/* Container Subheader */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#000000]/10 text-[10px]">
            <span className="px-2 py-0.5 rounded-[1600px] bg-[#dceeff] border border-[#000000] font-black uppercase tracking-wider text-[#000000]">
              สรุปข้อมูลด่วน · QUICK WIDGET
            </span>
            <span className="font-bold text-[#000000]/60">
              กระเป๋าเงิน & คอร์ทที่จอง
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 divide-x divide-[#000000]/15">
            {/* Left: SmashPay Wallet */}
            <div
              onClick={() => navigateTo('FINANCE')}
              className="cursor-pointer pr-2 hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-[#000000]/60 mb-0.5">
                <span className="flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-[#5c4ade]" />
                  <span className="truncate">{t.walletTitle}</span>
                </span>
                <ChevronRight className="w-3 h-3 text-[#000000]/40 shrink-0" />
              </div>
              <div className="text-base font-black text-[#000000] font-['Antonio',sans-serif]">
                ฿1,250.00
              </div>
              <div className="text-[10px] text-[#5c4ade] font-bold mt-0.5 whitespace-nowrap">
                <span>{t.topUpQuick}</span>
              </div>
            </div>

            {/* Right: Dynamic Contextual Slot */}
            <div
              onClick={() => navigateTo('B4')}
              className="cursor-pointer pl-3 hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-[#000000]/60 mb-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#fb4903]" />
                  <span className="text-[#fb4903] font-bold truncate">{t.nextMatch}</span>
                </span>
                <ChevronRight className="w-3 h-3 text-[#000000]/40 shrink-0" />
              </div>
              <div className="text-xs font-black text-[#000000] truncate">
                {t.nextMatchDetail}
              </div>
              <div className="text-[10px] text-[#000000]/60 font-bold truncate mt-0.5">
                {t.nextMatchLocation}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top Quick Action Dual Pills (Rounded-[1600px], 1px solid black border) */}
      <div className="px-4 mt-4 space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">
            ทางลัดทันใจ · QUICK SHORTCUTS
          </span>
          <span className="text-[10px] font-bold text-[#5c4ade]">
            2 เมนูยอดนิยม
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => navigateTo('MAP')}
            className="py-3 px-4 rounded-[1600px] bg-[#ffffff] border border-[#000000] shadow-xs flex items-center justify-center gap-2 hover:bg-[#ffd731] transition-all cursor-pointer active:scale-95"
          >
            <span className="text-base shrink-0">🏸</span>
            <span className="font-bold text-xs text-[#000000] whitespace-nowrap">
              {t.quickFindCourts}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('E1')}
            className="py-3 px-4 rounded-[1600px] bg-[#ffffff] border border-[#000000] shadow-xs flex items-center justify-center gap-2 hover:bg-[#55db9c] transition-all cursor-pointer active:scale-95 relative"
          >
            <span className="text-base shrink-0">👥</span>
            <span className="font-bold text-xs text-[#000000] whitespace-nowrap">
              {t.quickFindGroups}
            </span>
            <span className="absolute -top-1.5 -right-1 px-2 py-0.2 rounded-[1600px] bg-[#fb4903] text-[#ffffff] border border-[#000000] text-[9px] font-black tracking-wide shadow-xs whitespace-nowrap">
              28 {t.personUnit}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Services Matrix (Grid 4x2 in Slush CI with 1:1 Aspect Ratio) */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-black text-[#000000] uppercase tracking-wider font-['Antonio',sans-serif]">
            {t.servicesTitle}
          </h2>
          <span className="text-[10px] text-[#000000]/60 font-bold">{t.servicesCount}</span>
        </div>
        <p className="text-[11px] text-[#000000]/70 font-bold mb-2.5">
          เครื่องมือจัดการคอร์ท, ฝึกซ้อม, แข่งขัน, และก๊วนคอมมูนิตี้
        </p>

        <div className="grid grid-cols-4 gap-2">
          {/* 1. Find Courts */}
          <button
            type="button"
            onClick={() => navigateTo('MAP')}
            className="p-2 rounded-[20px] bg-[#ffffff] border border-[#000000] flex flex-col items-center justify-between aspect-square hover:bg-[#55db9c]/20 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <div className="w-9 h-9 rounded-[1600px] bg-[#55db9c] border border-[#000000] flex items-center justify-center text-lg mt-0.5">
              🏸
            </div>
            <span className="text-[10px] font-bold text-[#000000] text-center leading-tight whitespace-nowrap">
              {t.serviceFindCourts}
            </span>
          </button>

          {/* 2. Find Groups */}
          <button
            type="button"
            onClick={() => navigateTo('E1')}
            className="p-2 rounded-[20px] bg-[#ffffff] border border-[#000000] flex flex-col items-center justify-between aspect-square hover:bg-[#ffd731]/20 transition-all active:scale-95 cursor-pointer shadow-xs relative"
          >
            <span className="absolute -top-1 right-1 px-1.5 py-0.2 rounded-[1600px] bg-[#fb4903] text-[#ffffff] border border-[#000000] text-[8px] font-black">
              28
            </span>
            <div className="w-9 h-9 rounded-[1600px] bg-[#ffd731] border border-[#000000] flex items-center justify-center text-lg mt-0.5">
              👫
            </div>
            <span className="text-[10px] font-bold text-[#000000] text-center leading-tight whitespace-nowrap">
              {t.serviceFindGroups}
            </span>
          </button>

          {/* 3. Create Group */}
          <button
            type="button"
            onClick={() => navigateTo('E2')}
            className="p-2 rounded-[20px] bg-[#ffffff] border border-[#000000] flex flex-col items-center justify-between aspect-square hover:bg-[#4da2ff]/20 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <div className="w-9 h-9 rounded-[1600px] bg-[#4da2ff] border border-[#000000] flex items-center justify-center text-lg mt-0.5">
              ➕
            </div>
            <span className="text-[10px] font-bold text-[#000000] text-center leading-tight whitespace-nowrap">
              {t.serviceCreateGroup}
            </span>
          </button>

          {/* 4. Club Tools */}
          <button
            type="button"
            onClick={() => navigateTo('CLUB_TOOLS')}
            className="p-2 rounded-[20px] bg-[#ffffff] border border-[#000000] flex flex-col items-center justify-between aspect-square hover:bg-[#e9ccff]/20 transition-all active:scale-95 cursor-pointer shadow-xs relative"
          >
            <span className="absolute -top-1 right-1 px-1.5 py-0.2 rounded-[1600px] bg-[#fb4903] text-[#ffffff] border border-[#000000] text-[8px] font-black">
              {t.hotBadge}
            </span>
            <div className="w-9 h-9 rounded-[1600px] bg-[#e9ccff] border border-[#000000] flex items-center justify-center text-lg mt-0.5">
              🧰
            </div>
            <span className="text-[10px] font-bold text-[#000000] text-center leading-tight whitespace-nowrap">
              {t.serviceClubTools}
            </span>
          </button>

          {/* 5. Find a Coach */}
          <button
            type="button"
            onClick={() => navigateTo('D1')}
            className="p-2 rounded-[20px] bg-[#ffffff] border border-[#000000] flex flex-col items-center justify-between aspect-square hover:bg-[#ffd731]/20 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <div className="w-9 h-9 rounded-[1600px] bg-[#ffd731] border border-[#000000] flex items-center justify-center text-lg mt-0.5">
              👨‍🏫
            </div>
            <span className="text-[10px] font-bold text-[#000000] text-center leading-tight whitespace-nowrap">
              {t.serviceFindCoach}
            </span>
          </button>

          {/* 6. Play Tournaments */}
          <button
            type="button"
            onClick={() => navigateTo('E4')}
            className="p-2 rounded-[20px] bg-[#ffffff] border border-[#000000] flex flex-col items-center justify-between aspect-square hover:bg-[#fb4903]/20 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <div className="w-9 h-9 rounded-[1600px] bg-[#fb4903] border border-[#000000] text-[#ffffff] flex items-center justify-center text-lg mt-0.5">
              🏆
            </div>
            <span className="text-[10px] font-bold text-[#000000] text-center leading-tight whitespace-nowrap">
              {t.serviceTournaments}
            </span>
          </button>

          {/* 7. Badminton Activity */}
          <button
            type="button"
            onClick={() => navigateTo('D2')}
            className="p-2 rounded-[20px] bg-[#ffffff] border border-[#000000] flex flex-col items-center justify-between aspect-square hover:bg-[#55db9c]/20 transition-all active:scale-95 cursor-pointer shadow-xs relative"
          >
            <span className="absolute -top-1 right-1 px-1.5 py-0.2 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-[8px] font-black">
              {t.newBadge}
            </span>
            <div className="w-9 h-9 rounded-[1600px] bg-[#55db9c] border border-[#000000] flex items-center justify-center text-lg mt-0.5">
              🎯
            </div>
            <span className="text-[10px] font-bold text-[#000000] text-center leading-tight whitespace-nowrap">
              {t.serviceActivity}
            </span>
          </button>

          {/* 8. Badminton Level Quiz */}
          <button
            type="button"
            onClick={() => navigateTo('A2')}
            className="p-2 rounded-[20px] bg-[#ffffff] border border-[#000000] flex flex-col items-center justify-between aspect-square hover:bg-[#e9ccff]/20 transition-all active:scale-95 cursor-pointer shadow-xs relative"
          >
            <span className="absolute -top-1 right-1 px-1.5 py-0.2 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-[8px] font-black">
              {t.newBadge}
            </span>
            <div className="w-9 h-9 rounded-[1600px] bg-[#e9ccff] border border-[#000000] flex items-center justify-center text-lg mt-0.5">
              📋
            </div>
            <span className="text-[10px] font-bold text-[#000000] text-center leading-tight whitespace-nowrap">
              {t.serviceLevelQuiz}
            </span>
          </button>
        </div>
      </div>

      {/* 5. Campaign Banner in Slush CI (Mint Green #55db9c with 1px black border) */}
      <div className="px-4 mt-5">
        <div
          onClick={() => navigateTo('E1')}
          className="rounded-[28px] bg-[#55db9c] text-[#000000] border border-[#000000] p-4 relative overflow-hidden shadow-xs cursor-pointer hover:opacity-95 transition-all"
        >
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] text-[9px] font-black tracking-wide uppercase inline-block">
                {t.openChatBadge}
              </span>
              <h3 className="text-base font-black text-[#000000] font-['Antonio',sans-serif] uppercase tracking-wide leading-tight">
                {t.openChatTitle}
              </h3>
              <p className="text-[11px] text-[#000000]/80 font-bold leading-tight">
                {t.openChatDesc}
              </p>
              <div className="pt-1">
                <span className="px-3 py-1 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] text-[10px] font-bold uppercase tracking-wider inline-block">
                  {t.openChatBtn} →
                </span>
              </div>
            </div>

            {/* Mascot / Icon Badge */}
            <div className="w-20 h-20 rounded-[20px] bg-[#ffffff] border border-[#000000] p-1 shrink-0 flex flex-col items-center justify-center shadow-xs">
              <span className="text-3xl">🏸</span>
              <span className="text-[8px] font-black text-[#000000] mt-0.5">LINE OPENCHAT</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. "Book a Badminton Court" Section (16:9 Aspect Ratio Cards with 1px Solid Black Borders) */}
      <div className="px-4 mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#000000] uppercase tracking-wide font-['Antonio',sans-serif]">
              {t.bookCourtTitle}
            </h2>
            <p className="text-[11px] text-[#000000]/70 font-bold">
              {t.bookCourtSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('MAP')}
            className="text-xs font-bold text-[#000000] hover:underline cursor-pointer flex items-center gap-0.5"
          >
            <span>{t.seeAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 16:9 Court Cards Feed */}
        <div className="space-y-3">
          {courts.map((court) => (
            <div
              key={court.id}
              onClick={() => handleSelectCourt(court)}
              className="bg-[#ffffff] rounded-[28px] overflow-hidden border border-[#000000] shadow-xs cursor-pointer hover:shadow-md transition-all active:scale-99"
            >
              {/* 16:9 Image Container */}
              <div className="relative w-full aspect-[16/9] bg-[#e5e7eb] overflow-hidden border-b border-[#000000]">
                <img
                  src={court.imageUrl}
                  alt={court.name}
                  className="w-full h-full object-cover"
                />

                {/* Status Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] text-[10px] font-bold flex items-center gap-1 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#55db9c] animate-pulse" />
                    <span>{t.bookedAgo}</span>
                  </span>

                  <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-[10px] font-black whitespace-nowrap">
                    {t.bookableTag}
                  </span>
                </div>

                {/* Price Pill Bottom Right */}
                <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-[1600px] bg-[#ffd731] text-[#000000] border border-[#000000] text-xs font-black shadow-xs whitespace-nowrap">
                  ฿{court.pricePerHour}/{t.hrUnit}
                </div>
              </div>

              {/* Court Info Content */}
              <div className="p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-['Antonio',sans-serif] font-black text-base uppercase text-[#000000] leading-snug line-clamp-1">
                    {court.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#000000] shrink-0 bg-[#ffd731] border border-[#000000] px-2 py-0.5 rounded-[1600px]">
                    <Star className="w-3 h-3 text-[#000000] fill-[#000000]" />
                    <span>{court.rating}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#000000]/60 font-bold line-clamp-1">
                  {court.location} · {court.distanceKm} km
                </p>

                {/* Amenities Badges & Book Action Button */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {court.amenities.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-[1600px] bg-[#dceeff] border border-[#000000] text-[#000000] text-[10px] font-bold shrink-0 whitespace-nowrap"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCourt(court);
                    }}
                    className="px-3.5 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] text-[11px] font-bold uppercase tracking-wider hover:bg-[#1a1a1a] transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
                  >
                    {t.bookCourtBtn}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
