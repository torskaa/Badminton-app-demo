import React, { useEffect, useMemo, useState } from 'react';
import { Star, Navigation, Zap, ArrowRight, Bookmark, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { CourtSlot } from '../../types';
import courtHallFallbackImg from '../../assets/images/onboarding_court_aerial_1794910127319.jpg';
import {
  BANGKOK_DEFAULT_CENTER,
  COURT_SLOT_HOURS,
  generateUpcomingDays,
  getGoogleMapsDirectionsUrl,
  isSlotElapsedToday,
} from '../../utils/geoUtils';

export const B2_CourtDetailSlotScreen: React.FC = () => {
  const {
    selectedCourt,
    booking,
    updateBooking,
    navigateTo,
    language,
    cloudBookings,
    bookmarkedCourtIds,
    toggleBookmarkCourt,
  } = useApp();
  const isThai = language === 'th';

  const [selectedCourtNum, setSelectedCourtNum] = useState<number>(booking.selectedCourtNumber || 1);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0); // Default to Today
  const isBookmarked = bookmarkedCourtIds.includes(selectedCourt.id);
  const [nowClock, setNowClock] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNowClock(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const daysOfWeek = useMemo(() => generateUpcomingDays(isThai, 7, nowClock), [isThai, nowClock]);
  const activeDay = daysOfWeek[selectedDayIndex] || daysOfWeek[0];

  const availableSlots: (CourtSlot & { statusReason?: 'elapsed' | 'booked' })[] = useMemo(() => {
    return COURT_SLOT_HOURS.map((slot) => {
      const elapsed = isSlotElapsedToday(activeDay.isoDate, slot.startHour, nowClock);
      const bookedInCloud = cloudBookings.some(
        (b) =>
          b.courtId === selectedCourt.id &&
          b.courtNumber === selectedCourtNum &&
          b.date === activeDay.isoDate &&
          b.status !== 'cancelled' &&
          b.slotsSummary.includes(slot.startTime)
      );

      const isAvailable = !elapsed && !bookedInCloud;
      return {
        id: slot.id,
        courtNumber: selectedCourtNum,
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: selectedCourt.pricePerHour,
        isAvailable,
        statusReason: elapsed ? 'elapsed' : bookedInCloud ? 'booked' : undefined,
      };
    });
  }, [activeDay.isoDate, nowClock, cloudBookings, selectedCourt.id, selectedCourt.pricePerHour, selectedCourtNum]);

  const [activeSlotIds, setActiveSlotIds] = useState<string[]>([]);

  // Auto-select first 1-2 open slots whenever date/court changes or currently selected slots become unavailable
  useEffect(() => {
    const openIds = availableSlots.filter((s) => s.isAvailable).map((s) => s.id);
    setActiveSlotIds((prev) => {
      const stillOpen = prev.filter((id) => openIds.includes(id));
      if (stillOpen.length > 0) return stillOpen;
      return openIds.slice(0, 2);
    });
  }, [availableSlots]);

  const toggleSlot = (slot: CourtSlot) => {
    if (!slot.isAvailable) return;
    setActiveSlotIds((prev) =>
      prev.includes(slot.id) ? prev.filter((id) => id !== slot.id) : [...prev, slot.id]
    );
  };

  const selectedSlots = availableSlots.filter((s) => activeSlotIds.includes(s.id));
  const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);
  const directionsUrl = getGoogleMapsDirectionsUrl(
    selectedCourt.latitude ?? BANGKOK_DEFAULT_CENTER.lat,
    selectedCourt.longitude ?? BANGKOK_DEFAULT_CENTER.lng,
    selectedCourt.name
  );

  const handleContinueToCheckout = () => {
    updateBooking({
      court: selectedCourt,
      selectedCourtNumber: selectedCourtNum,
      selectedSlots,
      date: activeDay.isoDate,
      totalAmount: totalPrice,
    });
    navigateTo('B3');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-hidden">
      <MobileHeader title={selectedCourt.name} showBack />

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-6">
        {/* Court Hero Image */}
        <div className="relative w-full h-56 bg-[#000000] overflow-hidden">
          <img
            src={selectedCourt.imageUrl || courtHallFallbackImg}
            alt={selectedCourt.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />

          {/* Action pills top right */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 h-9 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center gap-1.5 text-[11px] font-bold text-[#000000] hover:bg-[#7cd7a0] transition-colors cursor-pointer shadow-sm"
              title={isThai ? 'นำทางด้วย Google Maps' : 'Directions in Google Maps'}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isThai ? 'นำทาง' : 'Directions'}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <button
              type="button"
              onClick={() => toggleBookmarkCourt(selectedCourt.id)}
              className={`w-9 h-9 rounded-[1600px] border border-[#000000] flex items-center justify-center transition-all cursor-pointer ${
                isBookmarked ? 'bg-[#7cd7a0] text-[#000000]' : 'bg-[#ffffff] text-[#000000]'
              }`}
              aria-label={isThai ? 'บันทึกสนามโปรด' : 'Bookmark court'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom badge overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-[#ffffff] bg-[#000000]/75 p-3 rounded-[24px]">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-[10px] font-black uppercase">
                {isThai ? 'มาตรฐานสากล' : 'BWF Standard'}
              </span>
              <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-[10px] font-black uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                <span>{isThai ? '+100 โบนัส' : '+100 EXP BONUS'}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#ffffff]/20 text-[#ffffff] text-[10px] font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-[#e85729] stroke-[#e85729]" />
                <span>
                  {selectedCourt.rating} · {selectedCourt.distanceKm} {isThai ? 'กม.' : 'km'}
                </span>
              </span>
            </div>
            <h1 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight text-[#ffffff] leading-tight">
              {selectedCourt.name}
            </h1>
            <p className="text-xs text-[#ffffff]/90 font-bold">{selectedCourt.location}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Amenities Strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-[24px] bg-[#ffffff] text-center">
              <span className="text-xs font-bold block text-[#000000]">{isThai ? 'พื้นสนาม' : 'Court Floor'}</span>
              <span className="text-[10px] text-[#000000] font-bold px-2 py-0.5 rounded-[1600px] bg-[#7cd7a0] inline-block mt-1">
                {isThai ? 'พื้นยาง' : 'Taraflex'}
              </span>
            </div>
            <div className="p-3 rounded-[24px] bg-[#ffffff] text-center">
              <span className="text-xs font-bold block text-[#000000]">{isThai ? 'ระบบแอร์' : 'Air Condition'}</span>
              <span className="text-[10px] text-[#000000] font-bold px-2 py-0.5 rounded-[1600px] bg-[#7cd7a0] inline-block mt-1">
                {selectedCourt.hasAirCon ? (isThai ? 'เย็น 24°C' : '24°C Comfort') : isThai ? 'ระบายอากาศ' : 'Open Air'}
              </span>
            </div>
            <div className="p-3 rounded-[24px] bg-[#ffffff] text-center">
              <span className="text-xs font-bold block text-[#000000]">{isThai ? 'จำนวนคอร์ท' : 'Courts'}</span>
              <span className="text-[10px] text-[#000000] font-bold px-2 py-0.5 rounded-[1600px] bg-[#7cd7a0] inline-block mt-1">
                {selectedCourt.courtCount} {isThai ? 'คอร์ท' : 'Courts'}
              </span>
            </div>
          </div>

          {/* Availability Calendar Day Selector (Real-time 7-day rolling schedule) */}
          <div className="space-y-2">
            <SectionHeader
              title={isThai ? 'ตารางรอบเรียลไทม์' : 'REAL-TIME SCHEDULE'}
              subtitle={isThai ? 'เลือกวันที่ต้องการเข้าเล่น' : 'Select your play date'}
              badge={activeDay.monthYearLabel}
              badgeVariant="soft"
            />

            <div className="p-4 rounded-[28px] bg-[#ffffff]">
              <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-1">
                {daysOfWeek.map((item, idx) => {
                  const isSelected = selectedDayIndex === idx;
                  return (
                    <button
                      key={item.isoDate}
                      type="button"
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`flex-1 min-w-[46px] py-2 rounded-[20px] border border-[#000000] flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#000000] text-[#ffffff] font-black'
                          : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                      }`}
                    >
                      <span className="text-[10px] font-bold opacity-80 whitespace-nowrap">{item.dayLabel}</span>
                      <span className="text-sm font-black mt-0.5">{item.dateNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Court Number Pill Selector */}
          <div className="space-y-2">
            <SectionHeader
              title={isThai ? 'เลือกคอร์ท (1 - 4)' : 'SELECT COURT (1 - 4)'}
              subtitle={isThai ? 'พื้นยาง · แอร์เย็นและไฟสว่าง' : 'Taraflex · AC & 500 Lux lighting'}
              badge={isThai ? 'พื้นยางมาตรฐาน' : 'Pro Court'}
              badgeVariant="green"
            />

            <div className="p-4 rounded-[28px] bg-[#ffffff]">
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((cNum) => {
                  const isSelected = selectedCourtNum === cNum;
                  return (
                    <button
                      type="button"
                      key={cNum}
                      onClick={() => setSelectedCourtNum(cNum)}
                      className={`py-2 px-2 rounded-[1600px] text-xs font-bold tracking-[0.032em] transition-all cursor-pointer border border-[#000000] whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#7cd7a0] text-[#000000]'
                          : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                      }`}
                    >
                      {isThai ? `คอร์ท ${cNum}` : `Court ${cNum}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time Slots List (Real-time clock & live Firestore occupancy) */}
          <div className="space-y-2">
            <SectionHeader
              title={isThai ? 'รอบเวลาว่างตอนนี้' : 'LIVE AVAILABLE SLOTS'}
              subtitle={
                activeDay.isToday
                  ? isThai
                    ? `อัปเดตตามเวลาจริง (${nowClock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
                    : `Live clock (${nowClock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
                  : isThai
                    ? 'แตะเลือกรอบชั่วโมงที่ว่างอยู่'
                    : 'Tap open hourly slots below'
              }
              badge={isThai ? 'เลือกได้หลาย ชม.' : 'Multi-hours'}
              badgeVariant="soft"
            />

            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = activeSlotIds.includes(slot.id);
                return (
                  <div
                    key={slot.id}
                    onClick={() => toggleSlot(slot)}
                    className={`p-3.5 rounded-[24px] transition-all flex flex-col justify-between ${
                      !slot.isAvailable
                        ? 'opacity-45 cursor-not-allowed bg-[#e5e7eb]'
                        : isSelected
                          ? 'bg-[#7cd7a0] text-[#000000] cursor-pointer'
                          : 'bg-[#ffffff] text-[#000000] hover:bg-[#e8f7ee] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-['Antonio',sans-serif] text-base font-black">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      {!slot.isAvailable ? (
                        <span className="px-2 py-0.5 rounded-[1600px] bg-[#000000]/15 text-[#000000] text-[9px] font-bold">
                          {slot.statusReason === 'booked'
                            ? isThai
                              ? 'จองแล้ว'
                              : 'Booked'
                            : isThai
                              ? 'ผ่านเวลา'
                              : 'Elapsed'}
                        </span>
                      ) : (
                        isSelected && (
                          <span className="w-5 h-5 rounded-[1600px] bg-[#000000] text-[#ffffff] flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[#000000]/70">
                        {isThai ? `คอร์ท ${slot.courtNumber}` : `Court ${slot.courtNumber}`}
                      </span>
                      <span className="font-black text-[#000000]">฿{slot.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Bottom Booking Bar */}
      <div className="shrink-0 p-4 bg-[#ffffff] z-30">
        <div className="w-full flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#000000]/60 font-bold uppercase block tracking-[0.032em]">
              {isThai ? `ยอดรวม (${selectedSlots.length} ชม.)` : `Total (${selectedSlots.length} hr)`}
            </span>
            <span className="font-['Antonio',sans-serif] text-3xl font-black tracking-tight text-[#000000] leading-none">
              ฿{totalPrice}
            </span>
          </div>

          <button
            type="button"
            disabled={selectedSlots.length === 0}
            onClick={handleContinueToCheckout}
            className={`py-3.5 px-6 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 border border-[#000000] whitespace-nowrap shrink-0 ${
              selectedSlots.length === 0
                ? 'bg-[#cccccc] text-[#000000]/40 cursor-not-allowed'
                : 'bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] cursor-pointer'
            }`}
          >
            <span className="whitespace-nowrap">
              {isThai ? 'ดำเนินการชำระเงิน' : 'PROCEED TO CHECKOUT'}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
