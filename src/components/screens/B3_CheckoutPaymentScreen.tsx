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
    }, 1200);
  };

  const handleConfirmAndComplete = () => {
    gainExp(100, `จองสนาม ${selectedCourt.name} สำเร็จ`, 'Early Bird Shuttler');
    navigateTo('B4');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title="PromptPay Checkout" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Booking Summary Card */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#55db9c] border border-black text-[10px] font-black uppercase text-black inline-block mb-1">
                Booking Summary
              </span>
              <h3 className="font-['Antonio'] text-2xl font-extrabold text-black uppercase leading-tight">
                {selectedCourt.name}
              </h3>
              <p className="text-xs text-neutral-600 font-medium">
                Court {booking.selectedCourtNumber} · {booking.date || '7 Nov 2026'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Total</span>
              <div className="font-['Antonio'] text-2xl font-extrabold text-black">
                ฿{totalAmount}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#ffd731] border border-black text-xs font-bold text-black flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current" />
              <span>Loot Reward on Payment</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px]">
              +100 EXP
            </span>
          </div>
        </div>

        {/* PromptPay QR Code Card (Slush QR Card style) */}
        <div className="bg-[#5c4ade] border border-black rounded-[28px] p-4 text-white text-center space-y-3">
          <div className="flex items-center justify-between text-xs font-bold px-1">
            <span className="uppercase tracking-wider">Thai QR Payment</span>
            <span className="flex items-center gap-1 text-[#ffd731]">
              <Clock className="w-3.5 h-3.5" />
              <span>Auto-verify: 10:00 min</span>
            </span>
          </div>

          {/* QR Box */}
          <div className="w-44 h-44 bg-white border border-black rounded-2xl mx-auto p-3 flex flex-col items-center justify-center">
            {/* Real SVG QR code mockup */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
              <rect x="0" y="0" width="30" height="30" fill="black" />
              <rect x="5" y="5" width="20" height="20" fill="white" />
              <rect x="10" y="10" width="10" height="10" fill="black" />

              <rect x="70" y="0" width="30" height="30" fill="black" />
              <rect x="75" y="5" width="20" height="20" fill="white" />
              <rect x="80" y="10" width="10" height="10" fill="black" />

              <rect x="0" y="70" width="30" height="30" fill="black" />
              <rect x="5" y="75" width="20" height="20" fill="white" />
              <rect x="10" y="80" width="10" height="10" fill="black" />

              {/* Data modules */}
              <rect x="36" y="10" width="8" height="8" fill="black" />
              <rect x="48" y="14" width="12" height="8" fill="black" />
              <rect x="36" y="36" width="28" height="28" fill="black" />
              <rect x="42" y="42" width="16" height="16" fill="white" />
              <rect x="46" y="46" width="8" height="8" fill="black" />
              <rect x="10" y="44" width="14" height="8" fill="black" />
              <rect x="76" y="44" width="14" height="8" fill="black" />
              <rect x="40" y="74" width="20" height="14" fill="black" />
              <rect x="72" y="74" width="18" height="18" fill="black" />
            </svg>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-mono font-bold text-white bg-black/30 px-3 py-1 rounded-full border border-white/20">
              PromptPay: {promptPayNumber}
            </span>
            <button
              onClick={handleCopyPromptPay}
              className="px-3 py-1 rounded-full bg-white text-black font-bold text-xs border border-black hover:bg-neutral-100 transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedPromptPay ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Bank Slip Upload Simulation */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-3">
          <label className="text-xs font-bold text-black uppercase tracking-wide block">
            Payment Verification (สลิปโอนเงิน)
          </label>

          {isSlipUploaded ? (
            <div className="p-3 rounded-2xl bg-[#55db9c]/30 border border-black flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#55db9c] fill-black shrink-0" />
              <div>
                <p className="text-xs font-bold text-black">Slip Verified Successfully!</p>
                <p className="text-[10px] text-neutral-600 font-medium">Ref: PP-TRX-20261107-8891</p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={isVerifying}
              onClick={handleSimulateSlipUpload}
              className="w-full py-4 rounded-2xl border border-dashed border-black bg-[#dceeff]/40 hover:bg-[#dceeff] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors active:scale-98"
            >
              <UploadCloud className="w-6 h-6 text-black" />
              <span className="text-xs font-bold text-black">
                {isVerifying ? 'Verifying Bank Slip with AI...' : 'Tap to Upload Bank Transfer Slip'}
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">
                Supports KBank, SCB, BBL, Krungthai QR
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Sticky CTA */}
      <div className="px-4 pt-2">
        <button
          onClick={handleConfirmAndComplete}
          className="w-full py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-sm border border-black flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer shadow-sm"
        >
          <span>Confirm & Unlock E-Ticket (+100 EXP)</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
