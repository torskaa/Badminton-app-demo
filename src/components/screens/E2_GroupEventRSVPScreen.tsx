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
  const costPerPerson = confirmedCount > 0 ? (totalExpense / confirmedCount).toFixed(2) : '0';

  const [paymentMarked, setPaymentMarked] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title="กิจกรรมนัดตี & ระบบหารค่าคอร์ท" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Event Header Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#131b2e] to-[#0d1320] border border-slate-800 space-y-2.5 shadow-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono font-bold text-lime-400 uppercase">
              RAMA 9 SMASHERS MATCH
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
              เปิดรับ RSVP
            </span>
          </div>

          <h2 className="text-base font-black text-white">
            {currentEvent.title}
          </h2>

          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-lime-400" />
              <span>{currentEvent.date} · {currentEvent.timeRange}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{currentEvent.courtName}</span>
            </div>
          </div>
        </div>

        {/* Automatic Split-Bill Calculator Card */}
        <div className="p-4 rounded-3xl bg-[#0f1422] border border-lime-400/40 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-lime-400" />
              <span className="text-xs font-black text-white">
                ระบบคำนวณยอดหารอัตโนมัติ (Auto-Split Engine)
              </span>
            </div>
            <span className="text-[10px] text-lime-400 font-mono">คำนวณเรียลไทม์</span>
          </div>

          {/* Breakdown */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>ค่าคอร์ท (3 คอร์ท x 3 ชม.)</span>
              <span className="font-mono text-slate-200">฿{currentEvent.courtFeeTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>ค่าลูกแบดมินตัน RSL Classic (2 หลอด)</span>
              <span className="font-mono text-slate-200">฿{currentEvent.shuttlecockFeeTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300 font-bold pt-1 border-t border-slate-800">
              <span>ยอดรวมค่าใช้จ่ายทั้งหมด</span>
              <span className="font-mono text-white">฿{totalExpense.toLocaleString()}</span>
            </div>
          </div>

          {/* Result Per Person */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-lime-950/60 to-slate-900 border border-lime-400/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400">
                หาร {confirmedCount} คนที่คอนเฟิร์มแล้ว
              </div>
              <div className="text-xl font-black text-lime-400 font-mono">
                ฿{costPerPerson} <span className="text-xs font-normal text-slate-300">/ คน</span>
              </div>
            </div>

            <button
              onClick={() => setPaymentMarked(!paymentMarked)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                paymentMarked
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              {paymentMarked ? '✓ ชำระแล้ว' : 'แจ้งโอนเงินแล้ว'}
            </button>
          </div>
        </div>

        {/* Attendees List & Payment Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-lime-400" />
              <span>รายชื่อผู้เข้าร่วม ({confirmedCount}/{currentEvent.maxPlayers})</span>
            </label>
            <span className="text-[10px] text-slate-400">
              ว่าง {currentEvent.maxPlayers - confirmedCount} ที่
            </span>
          </div>

          <div className="space-y-1.5">
            {currentEvent.attendees.map((att, idx) => (
              <div
                key={att.id}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] text-slate-500 w-3">
                    {idx + 1}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-lime-400 font-bold font-mono flex items-center justify-center text-[10px] border border-slate-700">
                    {att.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white">{att.name}</span>
                      {att.isHost && (
                        <span className="text-[9px] px-1 bg-amber-500/20 text-amber-400 rounded font-bold">
                          HOST
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {att.tier} Tier (OVR {att.ovr})
                    </span>
                  </div>
                </div>

                <div>
                  {att.paid || (att.id === player.id && paymentMarked) ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ชำระแล้ว
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-400">
                      รอชำระ
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waitlist info */}
        {currentEvent.waitlist.length > 0 && (
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Waitlist ต่อคิว: {currentEvent.waitlist.join(', ')}</span>
            <span className="text-slate-500 font-mono text-[10px]">สำรอง 2 คน</span>
          </div>
        )}
      </div>

      {/* Action Footer: Join RSVP / Launch AI Matchmaker */}
      <div className="px-4 space-y-2 pt-2 shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => toggleEventRsvp(player.id)}
            className={`min-h-[46px] rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              isUserAttending
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 shadow-md hover:brightness-110'
            }`}
          >
            {isUserAttending ? (
              <span>ยกเลิกเข้าร่วม (Cancel RSVP)</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>กดเข้าร่วม (Join Event)</span>
              </>
            )}
          </button>

          <button
            onClick={() => navigateTo('E3')}
            className="min-h-[46px] rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI จัดคู่ 2v2 สูสี</span>
          </button>
        </div>

        <button
          onClick={() => navigateTo('E4')}
          className="w-full min-h-[40px] py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer border border-slate-800"
        >
          <span>ดูตารางอันดับแรงก์ประจำเดือน (Group Leaderboard)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
