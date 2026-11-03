/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, QrCode, Zap, Calendar, Users, ArrowRight, Play, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const B4_BookingSuccessScreen: React.FC = () => {
  const { booking, selectedCourt, player, navigateTo } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title="การจองสำเร็จ" />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Success Banner */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/40 flex items-center justify-center mx-auto mb-2.5 shadow-[0_0_24px_rgba(204,255,0,0.4)]">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            จองสนามสำเร็จเรียบร้อย!
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            E-Ticket พร้อมใช้งาน นำ QR Code สแกนหน้าเคาน์เตอร์ได้ทันที
          </p>
        </div>

        {/* EXP Reward Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-lime-950/70 via-slate-900 to-slate-900 border border-lime-400/40 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-black">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>รับ +100 EXP สำเร็จ!</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-lime-400/20 text-lime-400 border border-lime-400/30">
                  เควสต์จองสนาม
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                คุณสะสม EXP รวม {player.currentExp} / {player.nextLevelExp} EXP
              </div>
            </div>
          </div>
        </div>

        {/* Digital E-Ticket Pass (iOS Wallet Style) */}
        <div className="rounded-3xl bg-[#0f1524] border border-slate-700/80 shadow-2xl overflow-hidden relative">
          {/* Top ticket header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-dashed border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-lime-400 font-bold uppercase tracking-wider">
                COURT PASS · SMASH-AI
              </span>
              <h3 className="text-sm font-extrabold text-white">
                {selectedCourt.name}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-700 text-lime-400 font-black text-xs font-mono">
              C-{booking.selectedCourtNumber}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="p-4 space-y-3 bg-[#0d121f]">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">วันที่ (Date)</span>
                <span className="font-bold text-white">ศุกร์ 7 พ.ย. 2026</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">ช่วงเวลา (Time)</span>
                <span className="font-bold text-lime-400 font-mono">19:00 - 21:00 น.</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">ช่องคอร์ท (Court)</span>
                <span className="font-bold text-white">คอร์ท {booking.selectedCourtNumber} (Taraflex)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">รหัสอ้างอิง (Ref ID)</span>
                <span className="font-mono text-slate-300 font-medium">{booking.bookingRef}</span>
              </div>
            </div>

            {/* Check-in QR Simulation */}
            <div className="pt-3 border-t border-slate-800 flex flex-col items-center justify-center">
              <div className="p-3 bg-white rounded-xl shadow-md">
                {/* Visual QR pattern */}
                <div className="w-24 h-24 bg-slate-950 rounded flex items-center justify-center text-white text-center p-1">
                  <QrCode className="w-20 h-20 text-white" />
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-2">
                SCAN TO CHECK-IN AT RECEPTION
              </span>
            </div>
          </div>

          {/* Ticket bottom notches */}
          <div className="absolute top-[82px] -left-3 w-6 h-6 rounded-full bg-[#080b12]" />
          <div className="absolute top-[82px] -right-3 w-6 h-6 rounded-full bg-[#080b12]" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 space-y-2 pt-2 shrink-0">
        <button
          onClick={() => navigateTo('E2')}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 font-black text-sm shadow-[0_4px_20px_rgba(204,255,0,0.3)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Users className="w-4 h-4 stroke-[2.5]" />
          <span>ชวนเพื่อนสร้าง Match Event ในก๊วน (หารค่าคอร์ท)</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>

        <button
          onClick={() => navigateTo('C1')}
          className="w-full min-h-[44px] py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Play className="w-3.5 h-3.5 text-lime-400 fill-lime-400" />
          <span>ไปที่หน้าจดแต้มข้างสนาม (Quick In-Match Logger)</span>
        </button>
      </div>
    </div>
  );
};
