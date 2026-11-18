import React, { useEffect, useRef, useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Zap,
  Copy,
  Clock,
  Check,
  Wallet,
  QrCode,
  Smartphone,
  Ticket,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { playSelectSound } from '../../utils/retroAudio';

export const B3_CheckoutPaymentScreen: React.FC = () => {
  const {
    booking,
    selectedCourt,
    gainExp,
    navigateTo,
    saveBookingToCloud,
    language,
    walletBalance,
    vouchers,
    authUser,
    isAuthBusy,
    signInWithGoogle,
  } = useApp();
  const isThai = language === 'th';

  const [paymentMethod, setPaymentMethod] = useState<'PromptPay' | 'SmashPay' | 'TrueMoney'>(
    booking.paymentMethod || 'PromptPay'
  );
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
  const [slipPreviewUrl, setSlipPreviewUrl] = useState<string | null>(null);
  const [slipFileName, setSlipFileName] = useState<string>('');
  const [slipError, setSlipError] = useState<string | null>(null);
  const [copiedPromptPay, setCopiedPromptPay] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(600);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const promptPayNumber = '089-921-4820';

  const availableCourtVouchers = vouchers.filter((v) => !v.used && v.target === 'court');
  const appliedVoucher = availableCourtVouchers.find((v) => v.id === selectedVoucherId);

  const rawTotal = booking.totalAmount || 560;
  const discount = appliedVoucher ? Math.min(rawTotal, appliedVoucher.discountAmount) : 0;
  const netTotal = Math.max(0, rawTotal - discount);

  const hasEnoughWallet = walletBalance >= netTotal;
  const needsSlip = paymentMethod !== 'SmashPay';
  const isReadyToConfirm = needsSlip ? Boolean(slipPreviewUrl) : hasEnoughWallet;

  // Real ticking 10-minute payment hold countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const handleCopyPromptPay = () => {
    navigator.clipboard?.writeText(promptPayNumber.replace(/-/g, ''));
    setCopiedPromptPay(true);
    playSelectSound();
    setTimeout(() => setCopiedPromptPay(false), 2000);
  };

  const handleSlipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSlipError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setSlipError(isThai ? 'กรุณาเลือกไฟล์รูปภาพสลิป (.jpg, .png)' : 'Please upload a valid image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setSlipError(isThai ? 'ไฟล์สลิปใหญ่เกิน 10MB' : 'File size must be under 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSlipPreviewUrl(String(reader.result || ''));
      setSlipFileName(file.name);
      playSelectSound();
    };
    reader.readAsDataURL(file);
  };

  const handleClearSlip = () => {
    setSlipPreviewUrl(null);
    setSlipFileName('');
    setSlipError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmAndComplete = async () => {
    if (isSubmittingBooking) return;
    if (!isReadyToConfirm) {
      setSlipError(
        needsSlip
          ? isThai
            ? 'กรุณาอัปโหลดรูปสลิปการโอนก่อนยืนยัน หรือสลับไปจ่ายด้วย SmashPay Wallet'
            : 'Please upload your transfer slip first, or switch to SmashPay Wallet.'
          : isThai
            ? 'ยอดเงินใน SmashPay ไม่เพียงพอ กรุณาเติมเงินหรือเลือกจ่ายด้วย PromptPay'
            : 'Insufficient SmashPay balance. Top up or switch to PromptPay.'
      );
      return;
    }

    setIsSubmittingBooking(true);
    setSlipError(null);
    try {
      await saveBookingToCloud(paymentMethod, appliedVoucher?.id);
    } catch (err: any) {
      const rawMsg = String(err?.message || '');
      if (rawMsg.includes('Quota exceeded')) {
        setSlipError(
          isThai
            ? 'โควต้าฐานข้อมูลคลาวด์วันนี้เต็มแล้ว กรุณาลองใหม่พรุ่งนี้'
            : 'Firestore daily free-tier quota reached. Please try again tomorrow.'
        );
      } else {
        setSlipError(
          isThai
            ? 'ไม่สามารถบันทึกการจองลงคลาวด์ได้ กรุณาลองใหม่อีกครั้ง'
            : 'Unable to save booking to cloud storage. Please try again.'
        );
      }
      setIsSubmittingBooking(false);
      return;
    } finally {
      setIsSubmittingBooking(false);
    }

    gainExp(
      100,
      isThai ? `จองสนาม ${selectedCourt.name} สำเร็จ` : `Booked ${selectedCourt.name}`,
      isThai ? 'นกตื่นเช้าลุยคอร์ท' : 'Early Bird Shuttler'
    );
    navigateTo('B4');
  };

  const slotsLabel =
    booking.selectedSlots && booking.selectedSlots.length > 0
      ? booking.selectedSlots.map((s) => `${s.startTime}-${s.endTime}`).join(', ')
      : '19:00-21:00';

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f8faf6] text-[#142608] overflow-hidden">
      <MobileHeader title={isThai ? 'ชำระเงินจองคอร์ท' : 'Checkout'} showBack />

      <div className="px-4 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16 max-w-xl w-full mx-auto">
        {/* 1. Booking Summary Card */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'รายละเอียดคอร์ทและเวลา' : 'COURT PASS DETAILS'}
            subtitle={isThai ? 'ตรวจสอบสนาม หมายเลขคอร์ท และรอบเวลา' : 'Verify venue, date & court'}
            badge={isThai ? 'ขั้นตอน 2/2' : 'Step 2/2'}
            badgeVariant="soft"
          />

          <div className="rounded-[24px] p-4 space-y-3 bg-[#ffffff] border border-[#d4dfd0] shadow-2xs">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-bold tracking-tight leading-tight text-[#004d2c] truncate">
                  {selectedCourt.name}
                </h3>
                <p className="text-xs text-[#5c6f5e] font-medium mt-0.5">
                  {isThai
                    ? `คอร์ท ${booking.selectedCourtNumber || 3}`
                    : `Court ${booking.selectedCourtNumber || 3}`}{' '}
                  · {booking.date}
                </p>
                <p className="text-[11px] font-semibold text-[#142608] mt-1 tabular-nums">
                  {isThai ? `รอบเวลา: ${slotsLabel} น.` : `Slots: ${slotsLabel}`}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold text-[#5c6f5e] uppercase block">
                  {isThai ? 'ยอดชำระสุทธิ' : 'Net Total'}
                </span>
                {discount > 0 && (
                  <span className="text-xs text-[#5c6f5e] line-through tabular-nums block">
                    ฿{rawTotal.toLocaleString()}
                  </span>
                )}
                <div className="text-2xl font-bold text-[#004d2c] tabular-nums">
                  ฿{netTotal.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Available Vouchers from Points Redemption */}
            {availableCourtVouchers.length > 0 && (
              <div className="pt-2 border-t border-[#d4dfd0]/70 space-y-1.5">
                <div className="text-[11px] font-semibold text-[#004d2c] flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-[#15803d]" />
                  <span>{isThai ? 'คูปองส่วนลดของคุณ' : 'Your Redeemed Vouchers'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {availableCourtVouchers.map((v) => {
                    const active = selectedVoucherId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          playSelectSound();
                          setSelectedVoucherId(active ? null : v.id);
                        }}
                        className={`no-doodle px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c]'
                            : 'bg-[#e8f7ee] text-[#004d2c] border-[#7cd7a0] hover:border-[#004d2c]'
                        }`}
                      >
                        <span>{isThai ? v.titleTh : v.titleEn}</span>
                        <span className="font-mono opacity-80">({v.code})</span>
                        {active && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="p-3 rounded-[18px] bg-[#e8f7ee] border border-[#7cd7a0] text-xs font-semibold text-[#004d2c] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-[#15803d] text-[#15803d]" />
                <span>{isThai ? 'รับโบนัส EXP เมื่อชำระเงิน' : 'Loot Drop Reward on Payment'}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#004d2c] text-[#7cd7a0] text-[10px] font-bold whitespace-nowrap shrink-0 tabular-nums">
                +100 EXP
              </span>
            </div>
          </div>
        </div>

        {/* 2. Payment Method Selector */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'เลือกวิธีชำระเงิน' : 'PAYMENT METHOD'}
            subtitle={isThai ? 'เลือกหักกระเป๋าทันทีหรือโอนพร้อมเพย์' : 'Instant wallet pay or QR transfer'}
            rightSlot={
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 tabular-nums ${
                  secondsLeft < 120
                    ? 'bg-[#e85729] text-[#ffffff]'
                    : 'bg-[#004d2c] text-[#ffffff]'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>
                  {mm}:{ss}
                </span>
              </span>
            }
          />

          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: 'PromptPay' as const,
                label: isThai ? 'พร้อมเพย์ QR' : 'PromptPay',
                sub: isThai ? 'แนบสลิป' : 'Slip upload',
                icon: QrCode,
              },
              {
                id: 'SmashPay' as const,
                label: 'SmashPay',
                sub: `฿${walletBalance.toLocaleString()}`,
                icon: Wallet,
              },
              {
                id: 'TrueMoney' as const,
                label: 'TrueMoney',
                sub: isThai ? 'วอลเล็ท' : 'Wallet QR',
                icon: Smartphone,
              },
            ].map((opt) => {
              const Icon = opt.icon;
              const active = paymentMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setPaymentMethod(opt.id);
                    setSlipError(null);
                  }}
                  className={`no-doodle p-3 rounded-[20px] border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    active
                      ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c] shadow-[0_6px_16px_rgba(0,77,44,0.18)]'
                      : 'bg-[#ffffff] text-[#142608] border-[#d4dfd0] hover:border-[#2d4d14]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#7cd7a0]' : 'text-[#004d2c]'}`} />
                  <div>
                    <div className="text-[11px] font-bold leading-tight truncate">{opt.label}</div>
                    <div
                      className={`text-[10px] font-medium tabular-nums truncate mt-0.5 ${
                        active ? 'text-[#ffffff]/80' : 'text-[#5c6f5e]'
                      }`}
                    >
                      {opt.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Conditional Payment Body */}
        {paymentMethod === 'SmashPay' ? (
          <div className="rounded-[24px] p-5 bg-[#ffffff] border border-[#d4dfd0] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#e8f7ee] text-[#004d2c] flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#142608]">
                    {isThai ? 'กระเป๋าเงิน SmashPay' : 'SmashPay Wallet'}
                  </div>
                  <div className="text-xs text-[#5c6f5e] font-medium">
                    {isThai ? 'หักยอดอัตโนมัติ ไม่ต้องอัปโหลดสลิป' : 'Instant deduction, no slip required'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-semibold text-[#5c6f5e]">
                  {isThai ? 'ยอดคงเหลือ' : 'Balance'}
                </div>
                <div
                  className={`text-lg font-bold tabular-nums ${
                    hasEnoughWallet ? 'text-[#15803d]' : 'text-[#e85729]'
                  }`}
                >
                  ฿{walletBalance.toLocaleString()}
                </div>
              </div>
            </div>

            {hasEnoughWallet ? (
              <div className="p-3 rounded-[16px] bg-[#e8f7ee] text-xs font-semibold text-[#004d2c] flex items-center justify-between">
                <span>{isThai ? 'ยอดคงเหลือหลังชำระ' : 'Balance after checkout'}</span>
                <span className="font-bold tabular-nums">
                  ฿{(walletBalance - netTotal).toLocaleString()}
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-[16px] bg-[#fff5f2] border border-[#e85729]/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#e85729]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {isThai
                      ? `ยอดเงินขาดอีก ฿${(netTotal - walletBalance).toLocaleString()}`
                      : `Need ฿${(netTotal - walletBalance).toLocaleString()} more`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('FINANCE')}
                  className="no-doodle px-3.5 py-2 rounded-full bg-[#e85729] text-[#ffffff] text-xs font-semibold cursor-pointer"
                >
                  {isThai ? 'ไปเติมเงินเข้า SmashPay →' : 'Top up SmashPay →'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* QR Code Card */}
            <div className="rounded-[24px] p-5 text-center space-y-3.5 bg-[#ffffff] border border-[#d4dfd0]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f7ee] text-[#004d2c] text-[11px] font-semibold">
                <span>
                  {paymentMethod === 'TrueMoney'
                    ? isThai
                      ? 'สแกนจ่ายด้วย TrueMoney Wallet'
                      : 'Scan via TrueMoney Wallet'
                    : isThai
                      ? 'สแกนจ่ายด้วย Thai QR PromptPay'
                      : 'Scan via Thai QR PromptPay'}
                </span>
              </div>

              <div className="w-44 h-44 bg-[#ffffff] rounded-[20px] border border-[#d4dfd0] mx-auto p-3 flex flex-col items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#142608] fill-current">
                  <rect x="0" y="0" width="30" height="30" fill="#142608" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" fill="#142608" />

                  <rect x="70" y="0" width="30" height="30" fill="#142608" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" fill="#142608" />

                  <rect x="0" y="70" width="30" height="30" fill="#142608" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" fill="#142608" />

                  <rect x="35" y="10" width="10" height="10" fill="#004d2c" />
                  <rect x="50" y="10" width="10" height="10" fill="#142608" />
                  <rect x="35" y="35" width="15" height="15" fill="#004d2c" />
                  <rect x="55" y="35" width="10" height="20" fill="#142608" />
                  <rect x="70" y="45" width="20" height="10" fill="#004d2c" />
                  <rect x="35" y="65" width="20" height="10" fill="#142608" />
                  <rect x="65" y="65" width="15" height="20" fill="#142608" />
                  <rect x="45" y="80" width="15" height="10" fill="#004d2c" />
                </svg>
              </div>

              <div className="text-xs">
                <span className="text-[#5c6f5e] block text-[11px] font-medium">
                  {isThai ? 'หมายเลขพร้อมเพย์สนาม (โอนยอด ฿' + netTotal + ')' : `PromptPay ID (Transfer ฿${netTotal})`}
                </span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="font-mono font-bold text-sm tracking-widest text-[#142608]">
                    {promptPayNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPromptPay}
                    className="no-doodle p-1.5 rounded-full border border-[#d4dfd0] hover:border-[#2d4d14] bg-[#ffffff] text-[#004d2c] transition-colors cursor-pointer"
                    title={isThai ? 'คัดลอกเบอร์พร้อมเพย์' : 'Copy PromptPay Number'}
                  >
                    {copiedPromptPay ? (
                      <Check className="w-3.5 h-3.5 text-[#15803d]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {copiedPromptPay && (
                  <span className="text-[10px] text-[#15803d] font-semibold">
                    {isThai ? 'คัดลอกหมายเลขสำเร็จ!' : 'Copied successfully!'}
                  </span>
                )}
              </div>
            </div>

            {/* Real File Upload for Bank Transfer Slip */}
            <div className="space-y-2">
              <SectionHeader
                title={isThai ? 'อัปโหลดสลิปโอนเงินจริง' : 'UPLOAD TRANSFER SLIP'}
                subtitle={isThai ? 'เลือกไฟล์รูปสลิปจากเครื่องของคุณ' : 'Select transfer receipt image'}
                badge={slipPreviewUrl ? (isThai ? 'แนบแล้ว' : 'Attached') : isThai ? 'จำเป็น' : 'Required'}
                badgeVariant={slipPreviewUrl ? 'green' : 'soft'}
              />

              <div className="rounded-[24px] p-4 bg-[#ffffff] border border-[#d4dfd0]">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSlipFileChange}
                  className="hidden"
                />

                {slipPreviewUrl ? (
                  <div className="flex items-center gap-3 p-3 rounded-[18px] bg-[#e8f7ee] border border-[#7cd7a0]">
                    <img
                      src={slipPreviewUrl}
                      alt="Transfer slip preview"
                      className="w-14 h-14 rounded-[12px] object-cover border border-[#004d2c]/20 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#004d2c]">
                        <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
                        <span>{isThai ? 'แนบสลิปเรียบร้อย' : 'Slip Attached'}</span>
                      </div>
                      <p className="text-[11px] text-[#5c6f5e] truncate mt-0.5">{slipFileName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearSlip}
                      className="no-doodle w-9 h-9 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#e85729] text-[#e85729] flex items-center justify-center cursor-pointer shrink-0"
                      aria-label={isThai ? 'ลบสลิป' : 'Remove slip'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="no-doodle w-full border border-dashed border-[#004d2c]/50 hover:border-[#004d2c] hover:bg-[#e8f7ee]/40 rounded-[18px] p-5 text-center cursor-pointer transition-all bg-[#f8faf6]"
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <UploadCloud className="w-6 h-6 text-[#004d2c]" />
                      <span className="text-xs font-bold text-[#142608]">
                        {isThai ? 'แตะเพื่อเลือกรูปสลิปจากเครื่อง' : 'Tap to Choose Slip Image'}
                      </span>
                      <span className="text-[10px] text-[#5c6f5e] font-medium">
                        {isThai ? 'รองรับ JPG, PNG, WebP (ไม่เกิน 10MB)' : 'Supports JPG, PNG, WebP (max 10MB)'}
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {slipError && (
          <div className="p-3 rounded-[16px] bg-[#fff5f2] border border-[#e85729]/30 text-xs font-semibold text-[#e85729] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{slipError}</span>
          </div>
        )}

        {/* Cloud Persistence Notice */}
        {!authUser && (
          <div className="p-3 rounded-[18px] bg-[#ffffff] border border-[#d4dfd0] flex items-center justify-between gap-2.5">
            <p className="text-[11px] text-[#5c6f5e] font-medium leading-snug">
              {isThai
                ? 'เข้าสู่ระบบ Google เพื่อบันทึกการจองคอร์ทนี้ลงบัญชีคลาวด์ข้ามอุปกรณ์'
                : 'Sign in with Google to persist this booking across devices.'}
            </p>
            <button
              type="button"
              disabled={isAuthBusy}
              onClick={() => signInWithGoogle()}
              className="no-doodle px-3 py-1.5 rounded-full bg-[#e8f7ee] hover:bg-[#7cd7a0]/40 text-[#004d2c] text-[11px] font-bold shrink-0 cursor-pointer whitespace-nowrap"
            >
              {isAuthBusy ? '...' : isThai ? 'เข้าสู่ระบบ' : 'Sign In'}
            </button>
          </div>
        )}

        {/* Confirm Payment CTA */}
        <button
          type="button"
          disabled={isSubmittingBooking || secondsLeft === 0}
          onClick={handleConfirmAndComplete}
          className={`no-doodle w-full py-4 rounded-full font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            isReadyToConfirm && secondsLeft > 0
              ? 'bg-[#004d2c] hover:bg-[#003a21] text-[#ffffff] shadow-[0_6px_18px_rgba(0,77,44,0.2)] cursor-pointer'
              : 'bg-[#d4dfd0] text-[#5c6f5e] cursor-pointer'
          }`}
        >
          <span className="whitespace-nowrap">
            {isSubmittingBooking
              ? isThai
                ? 'กำลังบันทึกการจอง...'
                : 'SAVING BOOKING...'
              : secondsLeft === 0
                ? isThai
                  ? 'หมดเวลาทำรายการ — กดย้อนกลับเพื่อจองใหม่'
                  : 'HOLD EXPIRED — GO BACK'
                : paymentMethod === 'SmashPay'
                  ? isThai
                    ? `ชำระ ฿${netTotal.toLocaleString()} ด้วย SmashPay และรับบัตร`
                    : `PAY ฿${netTotal.toLocaleString()} VIA SMASHPAY`
                  : isThai
                    ? `ยืนยันสลิป ฿${netTotal.toLocaleString()} และรับบัตรเข้าคอร์ท`
                    : `CONFIRM ฿${netTotal.toLocaleString()} & GET COURT PASS`}
          </span>
        </button>
      </div>
    </div>
  );
};
