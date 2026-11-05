import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Zap, Copy, Clock, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const B3_CheckoutPaymentScreen: React.FC = () => {
  const { booking, selectedCourt, gainExp, navigateTo } = useApp();

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);
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
      setVerificationDone(true);
    }, 800);
  };

  const handleConfirmAndComplete = () => {
    gainExp(100, `จองสนาม ${selectedCourt.name} สำเร็จ`, 'Early Bird Shuttler');
    navigateTo('B4');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      <MobileHeader title="PromptPay Checkout" showBack />

      <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-12">
        {/* Booking Summary Card */}
        <div className="border border-[#000000] rounded-[28px] p-4 space-y-3 bg-[#ffffff]">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-3 py-1 rounded-[1600px] text-[10px] font-bold tracking-[0.032em] uppercase bg-[#55db9c] border border-[#000000] text-[#000000] inline-block mb-1">
                Booking Summary
              </span>
              <h3 className="font-['Antonio',sans-serif] text-xl font-black tracking-tight leading-tight uppercase text-[#000000]">
                {selectedCourt.name}
              </h3>
              <p className="text-xs text-[#000000]/70 font-medium mt-0.5">
                Court {booking.selectedCourtNumber} · {booking.date || '12 Nov 2026'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">ยอดชำระ</span>
              <div className="font-['Antonio',sans-serif] text-3xl font-black text-[#000000]">
                ฿{totalAmount}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-[20px] bg-[#ffd731] border border-[#000000] text-xs font-bold text-[#000000] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current text-[#000000]" />
              <span>Loot Drop Reward on Payment</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[10px] font-bold tracking-[0.032em]">
              +100 EXP
            </span>
          </div>
        </div>

        {/* PromptPay QR Code Card */}
        <div className="border border-[#000000] rounded-[28px] p-5 text-center space-y-3.5 bg-[#ffffff] text-[#000000]">
          <div className="flex items-center justify-between text-xs font-bold px-1 text-[#000000]">
            <span className="uppercase tracking-[0.032em] font-['Antonio',sans-serif] text-sm font-black">Thai QR Payment</span>
            <span className="flex items-center gap-1 text-[#fb4903]">
              <Clock className="w-3.5 h-3.5" />
              <span>หมดอายุใน 10:00 นาที</span>
            </span>
          </div>

          {/* QR Box */}
          <div className="w-44 h-44 bg-[#ffffff] border border-[#000000] rounded-[24px] mx-auto p-3 flex flex-col items-center justify-center">
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

              <rect x="35" y="10" width="10" height="10" fill="black" />
              <rect x="50" y="10" width="10" height="10" fill="black" />
              <rect x="35" y="35" width="15" height="15" fill="black" />
              <rect x="55" y="35" width="10" height="20" fill="black" />
              <rect x="70" y="45" width="20" height="10" fill="black" />
              <rect x="35" y="65" width="20" height="10" fill="black" />
              <rect x="65" y="65" width="15" height="20" fill="black" />
              <rect x="45" y="80" width="15" height="10" fill="black" />
            </svg>
          </div>

          <div className="text-xs">
            <span className="text-[#000000]/60 block text-[11px] font-bold">พร้อมเพย์บัญชีทางการ (PromptPay ID)</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="font-mono font-bold text-sm tracking-widest">{promptPayNumber}</span>
              <button
                type="button"
                onClick={handleCopyPromptPay}
                className="p-1.5 rounded-[1600px] border border-[#000000] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] transition-colors cursor-pointer"
                title="คัดลอกเบอร์พร้อมเพย์"
              >
                {copiedPromptPay ? <Check className="w-3.5 h-3.5 text-[#55db9c]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {copiedPromptPay && <span className="text-[10px] text-[#000000] font-bold">คัดลอกเบอร์สำเร็จ!</span>}
          </div>
        </div>

        {/* Upload Bank Slip Box */}
        <div className="border border-[#000000] rounded-[28px] p-4 space-y-3 bg-[#ffffff]">
          <div className="flex items-center justify-between">
            <h4 className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
              Upload Transfer Slip (สลิปโอนเงิน)
            </h4>
            <span className="text-[10px] text-[#000000]/60 font-bold">AI Scan 100% Real-time</span>
          </div>

          <div
            onClick={handleSimulateSlipUpload}
            className={`border border-dashed rounded-[20px] p-4 text-center cursor-pointer transition-all ${
              verificationDone
                ? 'border-[#000000] bg-[#55db9c]'
                : 'border-[#000000] hover:bg-[#e9e9e9] bg-[#ffffff]'
            }`}
          >
            {isVerifying ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="w-6 h-6 border-2 border-[#000000] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-[#000000]">AI กำลังสแกนความถูกต้องของสลิป...</span>
              </div>
            ) : verificationDone ? (
              <div className="flex items-center justify-center gap-2 py-1 text-[#000000]">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span className="text-xs font-bold tracking-[0.032em]">สลิปถูกต้องเรียบร้อย (PromptPay Verified)</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-1">
                <UploadCloud className="w-6 h-6 text-[#000000]" />
                <span className="text-xs font-bold text-[#000000]">คลิกเพื่ออัปโหลดสลิปธนาคาร (Simulate Slip)</span>
                <span className="text-[10px] text-[#000000]/60 font-bold">รองรับ K-Plus, SCB Easy, Krungthai, Bangkok Bank</span>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Payment CTA (Black fill only) */}
        <button
          type="button"
          onClick={handleConfirmAndComplete}
          className="w-full py-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] whitespace-nowrap"
        >
          <span>CONFIRM & GET COURT PASS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
