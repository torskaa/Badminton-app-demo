/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QrCode, UploadCloud, CheckCircle2, ShieldCheck, Zap, AlertCircle, Copy, Clock, Sparkles } from 'lucide-react';
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
    // Award 100 EXP for court booking quest!
    gainExp(100, `จองสนาม ${selectedCourt.name} สำเร็จ`, 'Early Bird Shuttler');
    navigateTo('B4');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title="ชำระเงิน & ยืนยันการจอง" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Booking Summary Card */}
        <div className="p-3.5 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-2.5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-lime-400 font-bold uppercase">
                Booking Summary
              </span>
              <h3 className="text-sm font-extrabold text-white">
                {selectedCourt.name}
              </h3>
              <p className="text-[11px] text-slate-400">
                คอร์ท {booking.selectedCourtNumber} · วันที่ 7 พ.ย. 2026
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-lime-400 font-mono">
                ฿{totalAmount}
              </span>
              <div className="text-[10px] text-slate-400">ชำระเต็มจำนวน</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-lime-400" />
              {booking.selectedSlots.length > 0
                ? booking.selectedSlots.map((s) => `${s.startTime}-${s.endTime}`).join(', ')
                : '19:00 - 21:00 (2 ชม.)'}
            </span>
            <span className="text-lime-400 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 fill-lime-400" /> รับ +100 EXP
            </span>
          </div>
        </div>

        {/* Thai QR PromptPay Box */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
          {/* PromptPay Header */}
          <div className="w-full bg-[#003b64] text-white py-1.5 px-3 rounded-t-2xl -mt-4 -mx-4 mb-3 flex items-center justify-between text-xs font-bold">
            <span className="tracking-wider">THAI QR PAYMENT</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">PromptPay</span>
          </div>

          {/* QR Container */}
          <div className="p-3 bg-white rounded-2xl shadow-md border-4 border-slate-100 flex flex-col items-center">
            {/* SVG stylized QR code */}
            <svg
              className="w-44 h-44"
              viewBox="0 0 100 100"
              fill="black"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corner position markers */}
              <rect x="5" y="5" width="26" height="26" fill="black" rx="4" />
              <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
              <rect x="13" y="13" width="10" height="10" fill="black" rx="1" />

              <rect x="69" y="5" width="26" height="26" fill="black" rx="4" />
              <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
              <rect x="77" y="13" width="10" height="10" fill="black" rx="1" />

              <rect x="5" y="69" width="26" height="26" fill="black" rx="4" />
              <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
              <rect x="13" y="77" width="10" height="10" fill="black" rx="1" />

              {/* Data modules */}
              <rect x="36" y="8" width="8" height="6" />
              <rect x="48" y="6" width="6" height="10" />
              <rect x="58" y="10" width="6" height="6" />
              <rect x="8" y="36" width="6" height="10" />
              <rect x="18" y="42" width="10" height="6" />
              <rect x="36" y="22" width="6" height="6" />
              <rect x="46" y="24" width="12" height="6" />

              {/* Center PromptPay Logo Badge */}
              <circle cx="50" cy="50" r="14" fill="#003b64" />
              <text
                x="50"
                y="54"
                textAnchor="middle"
                fill="#ccff00"
                fontSize="10"
                fontWeight="900"
                fontFamily="sans-serif"
              >
                ฿
              </text>

              {/* Bottom data dots */}
              <rect x="36" y="64" width="12" height="6" />
              <rect x="52" y="70" width="6" height="12" />
              <rect x="64" y="64" width="8" height="8" />
              <rect x="76" y="76" width="18" height="6" />
              <rect x="62" y="40" width="8" height="12" />
              <rect x="78" y="44" width="12" height="6" />
              <rect x="38" y="82" width="8" height="8" />
            </svg>
            <div className="text-[11px] font-mono font-bold text-slate-800 mt-1">
              ยอดชำระ: ฿{totalAmount}.00
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-3 text-xs space-y-1">
            <div className="text-slate-300 font-semibold">
              ชื่อบัญชี: บจก. สแมชเอไอ แบดมินตัน พลัส (SmashAI Ltd)
            </div>
            <div className="flex items-center justify-center gap-1.5 text-slate-400 font-mono text-[11px]">
              <span>PromptPay ID: {promptPayNumber}</span>
              <button
                onClick={handleCopyPromptPay}
                className="p-1 rounded bg-slate-800 text-lime-400 hover:text-white cursor-pointer"
                title="คัดลอกเบอร์"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            {copiedPromptPay && (
              <span className="text-[10px] text-lime-400 font-bold block">
                ✓ คัดลอกหมายเลขพร้อมเพย์แล้ว
              </span>
            )}
          </div>
        </div>

        {/* Slip Upload & Auto-Verification Simulation */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span>ระบบตรวจสอบสลิปอัตโนมัติ (AI Slip OCR)</span>
            </label>
            {verificationDone && (
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ยืนยันสลิปผ่าน 100%
              </span>
            )}
          </div>

          {!verificationDone ? (
            <button
              onClick={handleSimulateSlipUpload}
              disabled={isVerifying}
              className="w-full py-4 border-2 border-dashed border-slate-700 hover:border-lime-400 rounded-xl bg-slate-950/60 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <UploadCloud
                className={`w-6 h-6 ${isVerifying ? 'text-lime-400 animate-spin' : 'text-slate-400'}`}
              />
              <div className="text-xs font-bold text-slate-200">
                {isVerifying ? 'กำลังอ่าน OCR สลิปโอนเงิน...' : 'แตะเพื่ออัปโหลดสลิปธนาคาร (จำลอง)'}
              </div>
              <div className="text-[10px] text-slate-500">
                รองรับ K PLUS, SCB EASY, Krungthai NEXT, Bangkok Bank
              </div>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <div className="font-bold text-white">ตรวจสอบสลิปถูกต้องแล้ว</div>
                <div className="text-[10px] text-slate-300 font-mono">
                  Ref: TRN-20261107-9831 · ยอด ฿{totalAmount}.00 ตรงกัน
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action footer */}
      <div className="px-4 pt-2 shrink-0">
        <button
          onClick={handleConfirmAndComplete}
          disabled={!verificationDone && !isSlipUploaded}
          className={`w-full min-h-[48px] py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
            verificationDone
              ? 'bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 shadow-[0_4px_20px_rgba(204,255,0,0.35)] hover:brightness-110 active:scale-98'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>ยืนยันการจอง & รับ E-Ticket (+100 EXP)</span>
        </button>
      </div>
    </div>
  );
};
