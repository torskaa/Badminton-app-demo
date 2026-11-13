import React, { useState } from 'react';
import { Star, MapPin, Zap, ArrowRight, Bookmark, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { CourtSlot } from '../../types';

export const B2_CourtDetailSlotScreen: React.FC = () => {
 const { selectedCourt, booking, updateBooking, navigateTo, language } = useApp();

 const [selectedCourtNum, setSelectedCourtNum] = useState<number>(booking.selectedCourtNumber || 3);
 const [selectedDayIndex, setSelectedDayIndex] = useState<number>(2); // S 12 Saturday
 const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

 const daysOfWeek = [
 { day: 'T', date: 10, label: 'Thu' },
 { day: 'F', date: 11, label: 'Fri' },
 { day: 'S', date: 12, label: 'Sat' },
 { day: 'S', date: 13, label: 'Sun' },
 { day: 'M', date: 14, label: 'Mon' },
 { day: 'T', date: 15, label: 'Tue' },
 { day: 'W', date: 16, label: 'Wed' },
 ];

 const AVAILABLE_SLOTS: CourtSlot[] = [
 { id: 's_17', courtNumber: selectedCourtNum, startTime: '17:00', endTime: '18:00', price: selectedCourt.pricePerHour, isAvailable: true },
 { id: 's_18', courtNumber: selectedCourtNum, startTime: '18:00', endTime: '19:00', price: selectedCourt.pricePerHour, isAvailable: true },
 { id: 's_19', courtNumber: selectedCourtNum, startTime: '19:00', endTime: '20:00', price: selectedCourt.pricePerHour, isAvailable: true },
 { id: 's_20', courtNumber: selectedCourtNum, startTime: '20:00', endTime: '21:00', price: selectedCourt.pricePerHour, isAvailable: true },
 { id: 's_21', courtNumber: selectedCourtNum, startTime: '21:00', endTime: '22:00', price: selectedCourt.pricePerHour, isAvailable: false },
 { id: 's_22', courtNumber: selectedCourtNum, startTime: '22:00', endTime: '23:00', price: selectedCourt.pricePerHour, isAvailable: true },
 ];

 const [activeSlotIds, setActiveSlotIds] = useState<string[]>(['s_19', 's_20']);

 const toggleSlot = (slot: CourtSlot) => {
 if (!slot.isAvailable) return;
 setActiveSlotIds((prev) =>
 prev.includes(slot.id) ? prev.filter((id) => id !== slot.id) : [...prev, slot.id]
 );
 };

 const selectedSlots = AVAILABLE_SLOTS.filter((s) => activeSlotIds.includes(s.id));
 const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);

 const handleContinueToCheckout = () => {
 updateBooking({
 court: selectedCourt,
 selectedCourtNumber: selectedCourtNum,
 selectedSlots,
 date: `2026-11-${daysOfWeek[selectedDayIndex].date}`,
 totalAmount: totalPrice,
 });
 navigateTo('B3');
 };

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000]  overflow-hidden">
 <MobileHeader title={selectedCourt.name} showBack />

 <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-6">
 {/* Court Hero Image with Hand-cut 1px solid black border */}
 <div className="relative w-full h-56 bg-[#000000] overflow-hidden ">
 <img
 src={selectedCourt.imageUrl || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80'}
 alt={selectedCourt.name}
 className="w-full h-full object-cover opacity-90"
 />

 {/* Action pills top right */}
 <div className="absolute top-4 right-4 flex items-center gap-2">
 <button
 type="button"
 onClick={() => setIsBookmarked(!isBookmarked)}
 className={`w-9 h-9 rounded-[1600px] border border-[#000000] flex items-center justify-center transition-all cursor-pointer ${
 isBookmarked ? 'bg-[#7cd7a0] text-[#000000]' : 'bg-[#ffffff] text-[#000000]'
 }`}
 >
 <Bookmark className="w-4 h-4 fill-current" />
 </button>
 <button
 type="button"
 className="w-9 h-9 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center text-[#000000] cursor-pointer"
 >
 <Share2 className="w-4 h-4" />
 </button>
 </div>

 {/* Bottom badge overlay */}
 <div className="absolute bottom-4 left-4 right-4 text-[#ffffff] bg-[#000000]/75 p-3 rounded-[24px] ">
 <div className="flex items-center gap-2 mb-1">
 <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-[10px] font-black uppercase">
 {language === 'th' ? 'มาตรฐาน BWF' : 'BWF Standard'}
 </span>
 <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-[10px] font-black uppercase flex items-center gap-1">
 <Zap className="w-3 h-3 fill-current" />
 <span>+100 EXP BONUS</span>
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
 <span className="text-xs font-bold block text-[#000000]">{language === 'th' ? 'พื้นสนาม' : 'Court Floor'}</span>
 <span className="text-[10px] text-[#000000] font-bold px-2 py-0.5 rounded-[1600px] bg-[#7cd7a0] inline-block mt-1">
 Taraflex
 </span>
 </div>
 <div className="p-3 rounded-[24px] bg-[#ffffff] text-center">
 <span className="text-xs font-bold block text-[#000000]">{language === 'th' ? 'ระบบแอร์' : 'Air Condition'}</span>
 <span className="text-[10px] text-[#000000] font-bold px-2 py-0.5 rounded-[1600px] bg-[#7cd7a0] inline-block mt-1">
 24°C Comfort
 </span>
 </div>
 <div className="p-3 rounded-[24px] bg-[#ffffff] text-center">
 <span className="text-xs font-bold block text-[#000000]">{language === 'th' ? 'ระบบไฟ' : 'Pro Lighting'}</span>
 <span className="text-[10px] text-[#000000] font-bold px-2 py-0.5 rounded-[1600px] bg-[#7cd7a0] inline-block mt-1">
 500 Lux
 </span>
 </div>
 </div>

 {/* Availability Calendar Day Selector */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'ตารางรอบสัปดาห์นี้' : 'THIS WEEK SCHEDULE'}
 subtitle={language === 'th' ? 'เลือกวันที่ต้องการเข้าใช้บริการสนาม' : 'Select your desired play date'}
 badge={language === 'th' ? 'พฤศจิกายน 2026' : 'Nov 2026'}
 badgeVariant="soft"
 />

 <div className="p-4 rounded-[28px] bg-[#ffffff]">
 <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
 {daysOfWeek.map((item, idx) => {
 const isSelected = selectedDayIndex === idx;
 return (
 <button
 key={idx}
 type="button"
 onClick={() => setSelectedDayIndex(idx)}
 className={`flex-1 min-w-[42px] py-2 rounded-[20px] border border-[#000000] flex flex-col items-center justify-center transition-all cursor-pointer ${
 isSelected
 ? 'bg-[#000000] text-[#ffffff] font-black'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 <span className="text-[10px] font-bold opacity-80">{item.day}</span>
 <span className="text-sm font-black mt-0.5">{item.date}</span>
 </button>
 );
 })}
 </div>
 </div>
 </div>

 {/* Court Number Pill Selector */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'เลือกคอร์ทแข่งขัน (1 - 4)' : 'SELECT COURT (1 - 4)'}
 subtitle={language === 'th' ? 'พื้นยาง BWF Taraflex · แอร์และไฟ 500 Lux' : 'BWF Taraflex · AC & 500 Lux lighting'}
 badge="BWF Taraflex"
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
 {language === 'th' ? `คอร์ท ${cNum}` : `Court ${cNum}`}
 </button>
 );
 })}
 </div>
 </div>
 </div>

 {/* Time Slots List */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'เลือกรอบเวลาที่ต้องการเล่น' : 'AVAILABLE TIME SLOTS'}
 subtitle={language === 'th' ? 'แตะเลือกรอบชั่วโมงที่ว่างอยู่' : 'Tap open hourly slots below'}
 badge={language === 'th' ? 'เลือกได้หลาย ชม.' : 'Multi-hours'}
 badgeVariant="soft"
 />

 <div className="grid grid-cols-2 gap-2">
 {AVAILABLE_SLOTS.map((slot) => {
 const isSelected = activeSlotIds.includes(slot.id);
 return (
 <div
 key={slot.id}
 onClick={() => toggleSlot(slot)}
 className={`p-3.5 rounded-[24px] transition-all cursor-pointer flex flex-col justify-between ${
 !slot.isAvailable
 ? 'opacity-40 cursor-not-allowed bg-[#cccccc]'
 : isSelected
 ? 'bg-[#7cd7a0] text-[#000000]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e8f7ee]'
 }`}
 >
 <div className="flex items-center justify-between mb-1">
 <span className="font-['Antonio',sans-serif] text-base font-black">{slot.startTime} - {slot.endTime}</span>
 {isSelected && (
 <span className="w-5 h-5 rounded-[1600px] bg-[#000000] text-[#ffffff] flex items-center justify-center text-[10px] font-bold">
 ✓
 </span>
 )}
 </div>
 <div className="flex items-center justify-between text-[11px] font-bold">
 <span className="text-[#000000]/70">
 {language === 'th' ? `คอร์ท ${slot.courtNumber}` : `Court ${slot.courtNumber}`}
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
 {language === 'th' ? `ยอดรวม (${selectedSlots.length} ชม.)` : `Total (${selectedSlots.length} hr)`}
 </span>
 <span className="font-['Antonio',sans-serif] text-3xl font-black tracking-tight text-[#000000] leading-none">
 ฿{totalPrice}
 </span>
 </div>

 <button
 type="button"
 disabled={selectedSlots.length === 0}
 onClick={handleContinueToCheckout}
 className={`py-3.5 px-6 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer border border-[#000000] whitespace-nowrap shrink-0 ${
 selectedSlots.length === 0
 ? 'bg-[#cccccc] text-[#000000]/40 cursor-not-allowed'
 : 'bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff]'
 }`}
 >
 <span className="whitespace-nowrap">
 {language === 'th' ? 'ดำเนินการชำระเงิน' : 'PROCEED TO CHECKOUT'}
 </span>
 <ArrowRight className="w-4 h-4 shrink-0" />
 </button>
 </div>
 </div>
 </div>
 );
};
