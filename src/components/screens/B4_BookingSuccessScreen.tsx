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
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title="การจองสำเร็จ (Court Pass)" />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Success Banner */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-sm border-2 border-emerald-200">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
            จองสนามสำเร็จเรียบร้อย!
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            E-Ticket พร้อมใช้งาน นำ QR Code สแกนหน้าเคาน์เตอร์สนามได้ทันที
          </p>
        </div>

        {/* EXP Reward Card */}
        <div className="p-3.5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#d8ff00] text-black flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-neutral-900 flex items-center gap-1.5">
                <span>รับ +100 EXP สำเร็จ!</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                  Quest Complete
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5 font-medium">
                สะสมรวม {player.currentExp} / {player.nextLevelExp} EXP เพื่อขึ้นสู่ยศถัดไป
              </div>
            </div>
          </div>
        </div>

        {/* Digital E-Ticket Pass (iOS Wallet Modern Style) */}
        <div className="rounded-3xl bg-white border border-neutral-200/90 shadow-md overflow-hidden relative">
          {/* Top ticket header */}
          <div className="p-4 bg-[#111318] text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#d8ff00] font-bold uppercase tracking-wider">
                COURT PASS · SMASH-AI
              </span>
              <h3 className="text-base font-extrabold text-white">
                {selectedCourt.name}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-300">
              #BK-8921
            </span>
          </div>

          {/* Ticket Body */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-medium text-neutral-400 block">คอร์ทที่จอง</span>
                <span className="text-base font-black text-neutral-900">
                  Court {booking.selectedCourtNumber || 3}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block">
                  {selectedCourt.surfaceType}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-neutral-400 block">ช่วงเวลา</span>
                <span className="text-base font-black text-neutral-900 font-mono">
                  19:00 - 21:00
                </span>
                <span className="text-[10px] text-neutral-500 block">
                  {booking.date || '7 Nov 2026'}
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center pt-1">
              <div className="p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200 shadow-inner">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SMASH-AI-PASS-8921"
                  alt="Pass QR"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <span className="text-[10px] font-mono text-neutral-400 mt-2">
                สแกนที่เคาน์เตอร์สนามเพื่อเปิดไฟคอร์ท
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => navigateTo('C1')}
            className="w-full h-13 rounded-full bg-[#111318] hover:bg-[#1f2430] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-98"
          >
            <Play className="w-4 h-4 fill-[#d8ff00] text-[#d8ff00]" />
            <span>เริ่มบันทึกแต้มแมตช์ข้างสนาม (Courtside Tracker)</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('E2')}
            className="w-full h-12 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-xs flex items-center justify-center gap-2 border border-neutral-200 cursor-pointer transition-all"
          >
            <Users className="w-4 h-4 text-[#0066ff]" />
            <span>ชวนเพื่อนเข้าก๊วน & หารบิลค่าคอร์ท (Split Bill)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
