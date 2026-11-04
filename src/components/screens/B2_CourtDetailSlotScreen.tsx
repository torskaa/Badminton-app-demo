/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, MapPin, Zap, Clock, ShieldCheck, Check, ArrowRight, Sparkles, ChevronLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { CourtSlot } from '../../types';

export const B2_CourtDetailSlotScreen: React.FC = () => {
  const { selectedCourt, booking, updateBooking, navigateTo } = useApp();

  const [selectedCourtNum, setSelectedCourtNum] = useState<number>(booking.selectedCourtNumber || 3);
  const [selectedDate, setSelectedDate] = useState('2026-11-07');

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
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title={selectedCourt.name} showBack />

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* Court Hero Card with Slush Sticker Badge */}
        <div className="bg-white border border-black rounded-[32px] p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 rounded-full bg-[#ffd731] border border-black text-[10px] font-black uppercase text-black flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              <span>2X EXP Slot Bonus</span>
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-black">
              <Star className="w-3.5 h-3.5 fill-[#ffd731] stroke-black" />
              <span>4.9 (BWF Grade)</span>
            </div>
          </div>

          <h2 className="font-['Antonio'] text-3xl font-extrabold text-black uppercase tracking-tight leading-tight">
            {selectedCourt.name}
          </h2>
          <p className="text-xs text-neutral-600 font-medium mt-0.5">
            {selectedCourt.location} · {selectedCourt.surfaceType} (BWF Standard)
          </p>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-200">
            <span className="px-2.5 py-1 rounded-full bg-[#55db9c] border border-black text-[10px] font-bold text-black">
              ✓ Taraflex Flooring
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#e9ccff] border border-black text-[10px] font-bold text-black">
              ✓ Air-Conditioned
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#4da2ff] border border-black text-[10px] font-bold text-black">
              ✓ Pro Lighting
            </span>
          </div>
        </div>

        {/* Court Number Pill Selector */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-2">
          <label className="text-xs font-bold text-black block mb-1 uppercase tracking-wide">
            Select Court Number (คอร์ท)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((cNum) => {
              const isSelected = selectedCourtNum === cNum;
              return (
                <button
                  type="button"
                  key={cNum}
                  onClick={() => setSelectedCourtNum(cNum)}
                  className={`py-2 rounded-full border text-xs font-bold cursor-pointer transition-transform active:scale-95 ${
                    isSelected
                      ? 'bg-black text-white border-black font-extrabold'
                      : 'bg-white hover:bg-neutral-100 text-black border-black'
                  }`}
                >
                  Court {cNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule Time Slots (Slush Sticker Cards) */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-black uppercase tracking-wide">
              Select Time Slots (เลือกช่วงเวลา)
            </label>
            <span className="text-[10px] font-bold text-[#5c4ade]">
              {selectedSlots.length} hours selected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_SLOTS.map((slot) => {
              const isSelected = activeSlotIds.includes(slot.id);
              return (
                <button
                  type="button"
                  key={slot.id}
                  disabled={!slot.isAvailable}
                  onClick={() => toggleSlot(slot)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    !slot.isAvailable
                      ? 'bg-neutral-100 text-neutral-400 border-neutral-300 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'bg-[#ffd731] border-black text-black scale-[1.02]'
                      : 'bg-[#dceeff]/50 hover:bg-[#dceeff] border-black/80 text-black'
                  } active:scale-95`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['Antonio'] text-lg font-bold">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="flex items-center justify-between text-[11px] mt-1 font-bold">
                    <span>{slot.isAvailable ? `฿${slot.price}` : 'Booked'}</span>
                    {slot.isAvailable && slot.startTime >= '19:00' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-black text-white">
                        2x EXP
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Checkout Bar */}
      <div className="px-4 pt-2">
        <div className="bg-white border border-black rounded-[32px] p-3 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-neutral-500 uppercase">Total Amount</span>
            <div className="font-['Antonio'] text-2xl font-extrabold text-black leading-none">
              ฿{totalPrice} <span className="text-xs text-[#55db9c] font-bold">(+100 EXP)</span>
            </div>
          </div>

          <button
            onClick={handleContinueToCheckout}
            disabled={selectedSlots.length === 0}
            className={`py-3 px-5 rounded-full font-bold text-xs border border-black flex items-center gap-2 transition-transform cursor-pointer ${
              selectedSlots.length > 0
                ? 'bg-black text-white hover:bg-neutral-800 active:scale-95'
                : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <span>Lock & Pay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
