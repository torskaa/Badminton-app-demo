/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Users, Calculator, Check, CheckCircle2, Clock, MapPin, DollarSign, ArrowRight, ShieldCheck, UserPlus, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const E2_GroupEventRSVPScreen: React.FC = () => {
  const { currentEvent, toggleEventRsvp, player, navigateTo } = useApp();

  const isUserAttending = currentEvent.attendees.some((a) => a.id === player.id);

  const totalExpense = currentEvent.courtFeeTotal + currentEvent.shuttlecockFeeTotal;
  const confirmedCount = currentEvent.attendees.length;
  const costPerPerson = confirmedCount > 0 ? (totalExpense / confirmedCount).toFixed(0) : '140';

  const [paymentMarked, setPaymentMarked] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title="นัดตี & ระบบหารค่าคอร์ท" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Event Header Banner */}
        <div className="p-5 rounded-3xl bg-white border border-neutral-200/80 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold text-[#0066ff] uppercase tracking-wider">
              WEEKLY SQUAD MATCH
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-extrabold">
              RSVP Open
            </span>
          </div>

          <h2 className="text-base font-extrabold text-neutral-900">
            {currentEvent.title}
          </h2>

          <div className="space-y-1.5 text-xs text-neutral-600 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#0066ff]" />
              <span>{currentEvent.date} · {currentEvent.timeRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{currentEvent.courtName}</span>
            </div>
          </div>
        </div>

        {/* Automatic Split-Bill Calculator Card */}
        <div className="p-5 rounded-3xl bg-white border-2 border-[#d8ff00] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-neutral-800" />
              <span className="text-xs font-extrabold text-neutral-900">
                ระบบคำนวณยอดหารอัตโนมัติ (Auto-Split Engine)
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">Fair-Play Certified</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-500 font-bold block uppercase">ยอดหารต่อคน</span>
              <div className="text-3xl font-black text-neutral-900 font-mono">
                ฿{costPerPerson}
              </div>
              <span className="text-[10px] text-neutral-400">
                จากยอดรวม ฿{totalExpense} (หาร {confirmedCount} คน)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPaymentMarked(!paymentMarked)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                paymentMarked
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#111318] text-[#d8ff00] hover:bg-[#1a1d24]'
              }`}
            >
              {paymentMarked ? '✓ โอนจ่ายแล้ว' : 'สแกนจ่ายพร้อมเพย์'}
            </button>
          </div>
        </div>

        {/* Attendees List with Payment Status */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
              รายชื่อผู้เล่นที่ลงชื่อแล้ว ({confirmedCount}/{currentEvent.maxPlayers})
            </h4>
            <span className="text-[10px] text-[#0066ff] font-bold">
              ว่างอีก {currentEvent.maxPlayers - confirmedCount} ที่
            </span>
          </div>

          <div className="space-y-2">
            {currentEvent.attendees.map((att) => (
              <div
                key={att.id}
                className="p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={att.avatar}
                    alt={att.name}
                    className="w-8 h-8 rounded-full object-cover border border-white"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-neutral-900 block">
                      {att.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      OVR {att.ovr} · {att.tier} League
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    att.paid
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {att.paid ? 'ชำระแล้ว' : 'รอชำระ'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="px-5 pt-3 border-t border-neutral-200 bg-white shrink-0 space-y-2">
        <button
          type="button"
          onClick={() => toggleEventRsvp(player.id)}
          className={`w-full h-14 rounded-full p-2 flex items-center justify-between shadow-lg transition-all cursor-pointer group ${
            isUserAttending
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-[#111318] hover:bg-[#1f2430] text-white'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-[#d8ff00] text-black flex items-center justify-center font-bold">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <span className="font-extrabold text-xs tracking-wider uppercase">
            {isUserAttending ? 'ยกเลิกการลงชื่อ (Cancel RSVP)' : 'กดลงชื่อเข้าร่วมก๊วน (RSVP Now)'}
          </span>
          <div className="w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('E3')}
          className="w-full h-11 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <Sparkles className="w-4 h-4 text-[#0066ff]" />
          <span>ส่งรายชื่อให้ AI จัดคู่สายสมดุล (Smart Matchmaker)</span>
        </button>
      </div>
    </div>
  );
};
