/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, MapPin, Zap, Clock, ShieldCheck, Check, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title={selectedCourt.name} showBack />

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">
        {/* Gallery Hero Card (Matches Image 3) */}
        <div className="relative w-full h-52 bg-slate-900">
          <img
            src={selectedCourt.imageUrl}
            alt={selectedCourt.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Badges on hero */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-[#d8ff00] flex items-center gap-1.5 shadow-md">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>2x EXP Bonus Active</span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
            <div>
              <span className="text-[10px] text-[#d8ff00] font-mono font-bold uppercase tracking-wider">
                {selectedCourt.surfaceType}
              </span>
              <h2 className="text-lg font-extrabold leading-tight">
                {selectedCourt.name}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-[#d8ff00] font-mono">
                ฿{selectedCourt.pricePerHour}
              </div>
              <div className="text-[10px] text-neutral-300">/ hour</div>
            </div>
          </div>
        </div>

        {/* Info & Amenities Card */}
        <div className="px-4 space-y-4">
          <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#0066ff]" />
                {selectedCourt.location}
              </span>
              <span className="text-amber-500 font-extrabold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> {selectedCourt.rating.toFixed(1)}
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-1.5">
              {selectedCourt.amenities.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 text-[10px] text-neutral-700 font-semibold"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Date Selector (Matches Image 3) */}
          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-2 px-1">
              เลือกวันที่เล่น (Select Date)
            </label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
              {[
                { date: '2026-11-07', day: 'FRI', num: '7 Nov', tag: 'Today' },
                { date: '2026-11-08', day: 'SAT', num: '8 Nov', tag: 'Weekend' },
                { date: '2026-11-09', day: 'SUN', num: '9 Nov', tag: 'Prime' },
                { date: '2026-11-10', day: 'MON', num: '10 Nov', tag: 'Evening' },
              ].map((d) => (
                <button
                  type="button"
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`min-w-[80px] p-3 rounded-2xl text-center border transition-all cursor-pointer ${
                    selectedDate === d.date
                      ? 'bg-[#111318] text-white font-bold border-[#111318] shadow-sm'
                      : 'bg-white border-neutral-200/80 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className={`text-[10px] ${selectedDate === d.date ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {d.day}
                  </div>
                  <div className="text-xs font-black mt-0.5">{d.num}</div>
                  <div className={`text-[9px] mt-1 font-semibold ${selectedDate === d.date ? 'text-[#d8ff00]' : 'text-[#0066ff]'}`}>
                    {d.tag}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Court Number Selector */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <label className="text-xs font-bold text-neutral-800">
                เลือกช่องคอร์ท (Court Number)
              </label>
              <span className="text-[11px] text-[#0066ff] font-bold">
                Court {selectedCourtNum} Selected
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setSelectedCourtNum(num)}
                  className={`py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center ${
                    selectedCourtNum === num
                      ? 'bg-[#0066ff] text-white border-[#0066ff] shadow-sm font-black'
                      : 'bg-white border-neutral-200/80 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span>Court {num}</span>
                  <span className={`text-[9px] mt-0.5 ${selectedCourtNum === num ? 'text-white/80' : 'text-neutral-400'}`}>
                    Taraflex
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots Grid (Matches Image 3) */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <label className="text-xs font-bold text-neutral-800">
                รอบเวลาที่เปิดจอง (Available Time Slots)
              </label>
              <span className="text-[10px] text-neutral-500">
                {activeSlotIds.length} slot(s) selected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {AVAILABLE_SLOTS.map((slot) => {
                const isSelected = activeSlotIds.includes(slot.id);
                return (
                  <button
                    type="button"
                    key={slot.id}
                    disabled={!slot.isAvailable}
                    onClick={() => toggleSlot(slot)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      !slot.isAvailable
                        ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'bg-white border-[#d8ff00] ring-2 ring-[#d8ff00]/60 shadow-sm text-neutral-900'
                        : 'bg-white border-neutral-200/80 hover:border-neutral-300 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black font-mono">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#d8ff00] text-black flex items-center justify-center font-bold">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : !slot.isAvailable ? (
                        <span className="text-[9px] text-neutral-400 font-bold">Full</span>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500">
                      <span>฿{slot.price}</span>
                      <span className="text-[#10b981] font-bold">+100 EXP</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Summary & Proceed (Matches Image 3) */}
      <div className="px-5 pt-3 border-t border-neutral-200 bg-white shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[11px] text-neutral-500">
              Court {selectedCourtNum} · {selectedSlots.length} hour(s)
            </div>
            <div className="text-xl font-black text-neutral-900 font-mono">
              ฿{totalPrice}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold text-[#10b981] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>+{selectedSlots.length * 100} EXP Instant</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={selectedSlots.length === 0}
          onClick={handleContinueToCheckout}
          className={`w-full min-h-[50px] py-3.5 px-5 rounded-full font-extrabold text-sm flex items-center justify-between cursor-pointer transition-all ${
            selectedSlots.length > 0
              ? 'bg-[#d8ff00] text-black shadow-[0_6px_25px_rgba(216,255,0,0.4)] hover:bg-[#cbf000] active:scale-98'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
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
