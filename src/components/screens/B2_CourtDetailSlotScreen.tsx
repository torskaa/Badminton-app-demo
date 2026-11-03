/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, MapPin, Zap, Clock, ShieldCheck, Check, ArrowRight, Info, Users, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { CourtSlot } from '../../types';

export const B2_CourtDetailSlotScreen: React.FC = () => {
  const { selectedCourt, booking, updateBooking, navigateTo } = useApp();

  const [selectedCourtNum, setSelectedCourtNum] = useState<number>(booking.selectedCourtNumber || 3);
  const [selectedDate, setSelectedDate] = useState('2026-11-07');

  // Time Slots with status
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
      date: selectedDate,
      totalAmount: totalPrice,
    });
    navigateTo('B3');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title={selectedCourt.name} showBack />

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">
        {/* Gallery Hero */}
        <div className="relative w-full h-48 bg-slate-900">
          <img
            src={selectedCourt.imageUrl}
            alt={selectedCourt.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-black/40" />

          {/* Badges on hero */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-lime-400/40 text-[10px] font-bold text-lime-400 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-lime-400" />
            <span>โบนัส EXP {selectedCourt.bonusExpMultiplier}x เมื่อจอง</span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-[10px] text-lime-400 font-mono font-bold">
                {selectedCourt.surfaceType}
              </span>
              <h2 className="text-base font-extrabold text-white leading-tight">
                {selectedCourt.name}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-lime-400 font-mono">
                ฿{selectedCourt.pricePerHour}
              </div>
              <div className="text-[10px] text-slate-400">/ชั่วโมง/คอร์ท</div>
            </div>
          </div>
        </div>

        {/* Info & Amenities */}
        <div className="px-4 space-y-3">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {selectedCourt.location}
              </span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" /> {selectedCourt.rating}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
              {selectedCourt.amenities.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-slate-800/80 text-[10px] text-slate-300 font-medium"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="text-xs font-bold text-white block mb-2">
              เลือกวันที่เล่น (Select Date)
            </label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
              {[
                { date: '2026-11-07', day: 'ศุกร์', num: '7 พ.ย.', tag: 'วันนี้' },
                { date: '2026-11-08', day: 'เสาร์', num: '8 พ.ย.', tag: 'ก๊วนใหญ่' },
                { date: '2026-11-09', day: 'อาทิตย์', num: '9 พ.ย.', tag: 'ว่างเยอะ' },
                { date: '2026-11-10', day: 'จันทร์', num: '10 พ.ย.', tag: 'รอบค่ำ' },
              ].map((d) => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`min-w-[76px] p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    selectedDate === d.date
                      ? 'bg-lime-400 text-slate-950 font-bold border-lime-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="text-[10px] opacity-80">{d.day}</div>
                  <div className="text-xs font-extrabold">{d.num}</div>
                  <div className="text-[9px] mt-0.5 opacity-90">{d.tag}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Court Number Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-white">
                เลือกช่องคอร์ท (Court Number)
              </label>
              <span className="text-[10px] text-lime-400 font-mono">
                กำลังเลือก: คอร์ท {selectedCourtNum}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedCourtNum(num)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center ${
                    selectedCourtNum === num
                      ? 'bg-slate-900 border-lime-400 text-lime-400 ring-1 ring-lime-400/40 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>คอร์ท {num}</span>
                  <span className="text-[9px] font-mono text-slate-500 font-normal">
                    {num === 3 || num === 5 ? 'ไฟดีมาก' : 'ว่าง'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-white flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-lime-400" />
                <span>ช่วงเวลาที่ต้องการ (Time Slots)</span>
              </label>
              <span className="text-[10px] text-slate-400">เลือกได้มากกว่า 1 ชม.</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_SLOTS.map((slot) => {
                const isSelected = activeSlotIds.includes(slot.id);
                return (
                  <button
                    key={slot.id}
                    disabled={!slot.isAvailable}
                    onClick={() => toggleSlot(slot)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      !slot.isAvailable
                        ? 'opacity-40 bg-slate-950 border-slate-900 cursor-not-allowed'
                        : isSelected
                        ? 'bg-lime-400/10 border-lime-400 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold font-mono">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      {isSelected ? (
                        <div className="w-3.5 h-3.5 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : !slot.isAvailable ? (
                        <span className="text-[9px] text-red-400">เต็ม</span>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>฿{slot.price}</span>
                      <span className="text-lime-400 font-mono">+100 EXP</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Summary & Proceed */}
      <div className="px-4 pt-3 border-t border-slate-800/80 bg-[#0a0d15] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[10px] text-slate-400">
              คอร์ท {selectedCourtNum} · {selectedSlots.length} ชั่วโมง
            </div>
            <div className="text-lg font-black text-white font-mono">
              ฿{totalPrice}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-lime-400 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-lime-400" />
              รับทันที +{selectedSlots.length * 100} EXP
            </span>
          </div>
        </div>

        <button
          disabled={selectedSlots.length === 0}
          onClick={handleContinueToCheckout}
          className={`w-full min-h-[50px] py-3.5 px-5 rounded-full font-extrabold text-sm flex items-center justify-between cursor-pointer transition-all ${
            selectedSlots.length > 0
              ? 'bg-[#d8ff00] text-black shadow-[0_6px_25px_rgba(216,255,0,0.4)] hover:bg-[#cbf000] active:scale-98'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 fill-current" />
            <span>Book Appointment · ฿{totalPrice}</span>
          </span>
          <div className="w-8 h-8 rounded-full bg-black text-[#d8ff00] flex items-center justify-center">
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>
      </div>
    </div>
  );
};
