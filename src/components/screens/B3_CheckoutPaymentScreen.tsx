/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QrCode, UploadCloud, CheckCircle2, ShieldCheck, Zap, AlertCircle, Copy, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const B3_CheckoutPaymentScreen: React.FC = () => {
  const { booking, selectedCourt, gainExp, navigateTo } = useApp();

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);
  const [isSlipUploaded, setIsSlipUploaded] = useState(false);
  const [copiedPromptPay, setCopiedPromptPay] = useState(false);

  const promptPayNumber = '089-921-4820';
  const totalAmount = booking.totalAmount || 560;

  const handleCopyPromptPay = () => {
    navigator.clipboard?.writeText(promptPayNumber.replace(/-/g, ''));
    setCopiedPromptPay(true);
    setTimeout(() => setCopiedPromptPay(false), 2000);
  };

  const handleSimulateSlipUpload = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSlipUploaded(true);
      setVerificationDone(true);
    }, 1400);
  };

  const handleConfirmAndComplete = () => {
    gainExp(100, `จองสนาม ${selectedCourt.name} สำเร็จ`, 'Early Bird Shuttler');
    navigateTo('B4');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title="ชำระเงิน & ยืนยันการจอง" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Booking Summary Card */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#0066ff] uppercase tracking-wider">
                Booking Summary
              </span>
              <h3 className="text-base font-extrabold text-neutral-900 mt-0.5">
                {selectedCourt.name}
              </h3>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                Court {booking.selectedCourtNumber} · {booking.date || '7 Nov 2026'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-neutral-900 font-mono">
                ฿{totalAmount}
              </span>
              <div className="text-[10px] text-[#10b981] font-bold">+100 EXP</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between text-xs">
            <span className="text-neutral-600 font-medium">Selected Slots:</span>
            <span className="font-bold text-neutral-900 font-mono">
              19:00 - 21:00 (2 Hours)
            </span>
          </div>
        </div>

        {/* PromptPay QR Section */}
        <div className="p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <h4 className="text-sm font-extrabold text-neutral-900 tracking-tight">
              สแกนจ่ายผ่านพร้อมเพย์ (PromptPay QR)
            </h4>
          </div>

          {/* QR Display */}
          <div className="p-4 rounded-3xl bg-neutral-50 border-2 border-neutral-200/90 shadow-inner flex flex-col items-center">
            <div className="w-48 h-48 bg-white rounded-2xl p-2.5 shadow-sm border border-neutral-200 flex items-center justify-center">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PROMPTPAY-0899214820-560THB"
                alt="PromptPay QR"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[11px] font-mono text-neutral-500 mt-2 font-medium">
              ยอดชำระ: <strong className="text-neutral-900 font-extrabold">฿{totalAmount}.00</strong>
            </span>
          </div>

          {/* Copy PromptPay ID */}
          <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs">
            <div className="text-left">
              <span className="text-[10px] text-neutral-400 block font-medium">PromptPay ID</span>
              <span className="font-mono font-bold text-neutral-800">{promptPayNumber}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyPromptPay}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedPromptPay ? 'คัดลอกแล้ว!' : 'คัดลอก'}</span>
            </button>
          </div>
        </div>

        {/* Slip Upload & OCR Simulation */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-800">
              แนบสลิปเพื่อยืนยันคอร์ททันที (Instant Auto-Verify)
            </h4>
            {verificationDone && (
              <span className="text-[10px] font-bold text-[#10b981] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ตรวจสอบผ่าน
              </span>
            )}
          </div>

          {!verificationDone ? (
            <button
              type="button"
              disabled={isVerifying}
              onClick={handleSimulateSlipUpload}
              className="w-full p-5 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-[#0066ff] bg-neutral-50/70 hover:bg-[#0066ff]/5 flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-neutral-200/60 group-hover:bg-[#0066ff]/10 text-neutral-600 group-hover:text-[#0066ff] flex items-center justify-center mb-2 transition-colors">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-neutral-800">
                {isVerifying ? 'กำลังตรวจสลิปผ่าน AI OCR...' : 'แตะเพื่อเลือกภาพสลิปโอนเงิน'}
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5">
                รองรับ KBank, SCB, KTB, BBL
              </span>
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-emerald-900">
                  สลิปถูกต้อง ยอดตรง ฿{totalAmount}.00
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  ระบบล็อกคอร์ทให้คุณทันที 100%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="px-5 pt-3 border-t border-neutral-200 bg-white shrink-0">
        <button
          type="button"
          onClick={handleConfirmAndComplete}
          className="w-full h-14 bg-[#111318] hover:bg-[#1f2430] active:scale-[0.98] rounded-full p-2 flex items-center justify-between shadow-lg transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#d8ff00] text-black flex items-center justify-center font-bold">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="text-white font-extrabold text-xs tracking-wider uppercase">
            ยืนยันการจองคอร์ท (+100 EXP)
          </span>
          <div className="w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>
      </div>
    </div>
  );
};
