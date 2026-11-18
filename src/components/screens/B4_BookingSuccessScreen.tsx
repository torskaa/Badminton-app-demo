import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Zap,
  Users,
  ArrowRight,
  Play,
  Calendar,
  XCircle,
  CloudCheck,
  LogIn,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { EntryTicketCard } from '../common/EntryTicketCard';
import { playSelectSound } from '../../utils/retroAudio';

export const B4_BookingSuccessScreen: React.FC = () => {
  const {
    booking,
    courts,
    selectedCourt,
    player,
    navigateTo,
    language,
    cloudBookings,
    cancelBooking,
    authUser,
    isAuthBusy,
    signInWithGoogle,
  } = useApp();
  const isThai = language === 'th';

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Resolve the active booking to display: user-selected saved booking, newly checked-out ref, or latest saved booking
  const activeSavedBooking = useMemo(() => {
    if (cloudBookings.length === 0) return null;
    if (selectedBookingId) {
      const found = cloudBookings.find((b) => b.id === selectedBookingId);
      if (found) return found;
    }
    if (booking.bookingRef) {
      const byRef = cloudBookings.find((b) => b.bookingRef === booking.bookingRef);
      if (byRef) return byRef;
    }
    return cloudBookings[0];
  }, [cloudBookings, selectedBookingId, booking.bookingRef]);

  const activeCourtFacility = useMemo(() => {
    if (!activeSavedBooking) return selectedCourt;
    return courts.find((c) => c.id === activeSavedBooking.courtId) || selectedCourt;
  }, [activeSavedBooking, courts, selectedCourt]);

  const { slotStart, slotEnd } = useMemo(() => {
    if (activeSavedBooking?.slotsSummary) {
      const chunks = activeSavedBooking.slotsSummary
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);
      const firstRange = chunks[0]?.split('-').map((t) => t.trim()) || [];
      const lastRange = chunks[chunks.length - 1]?.split('-').map((t) => t.trim()) || [];
      return {
        slotStart: firstRange[0] || '19:00',
        slotEnd: lastRange[1] || firstRange[1] || '21:00',
      };
    }
    return {
      slotStart:
        booking.selectedSlots && booking.selectedSlots.length > 0
          ? booking.selectedSlots[0].startTime
          : '19:00',
      slotEnd:
        booking.selectedSlots && booking.selectedSlots.length > 0
          ? booking.selectedSlots[booking.selectedSlots.length - 1].endTime
          : '21:00',
    };
  }, [activeSavedBooking, booking.selectedSlots]);

  const rawDate = activeSavedBooking?.date || booking.date || '2026-11-17';
  const formattedDateKicker = (() => {
    const parsed = new Date(`${rawDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return `${rawDate} · ${slotStart}`;
    }
    const dayStr = parsed
      .toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })
      .toUpperCase();
    return `${dayStr} · ${slotStart}`;
  })();

  const activeCourtName = activeSavedBooking?.courtName || selectedCourt.name;
  const courtNumber = String(activeSavedBooking?.courtNumber || booking.selectedCourtNumber || 3);
  const ticketRef = activeSavedBooking?.bookingRef || booking.bookingRef || 'SM-26-8921-C03';
  const activeStatus = activeSavedBooking?.status || 'confirmed';
  const activeAmount = activeSavedBooking?.totalAmount ?? booking.totalAmount ?? 560;
  const activePaymentMethod = activeSavedBooking?.paymentMethod || booking.paymentMethod || 'PromptPay';

  const venueSubline = `${activeCourtFacility.location || (isThai ? 'พระราม 9' : 'Rama 9')} · ${
    isThai ? 'พื้นยาง BWF · โซนหลัก' : 'BWF Mat · Main Hall'
  }`;

  const handleConfirmCancel = async (bookingId: string) => {
    if (cancellingId) return;
    setCancellingId(bookingId);
    setCancelError(null);
    try {
      await cancelBooking(bookingId);
      setConfirmCancelId(null);
    } catch {
      setCancelError(
        isThai
          ? 'ไม่สามารถยกเลิกการจองได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง'
          : 'Unable to cancel booking right now. Please try again.'
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f8faf6] text-[#142608] overflow-hidden">
      <MobileHeader title={isThai ? 'บัตรเข้าคอร์ทของฉัน' : 'My Court Passes'} showBack />

      <div className="px-4 pt-4 space-y-5 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-24 max-w-xl w-full mx-auto">
        {/* Clean Editorial Confirmation Header */}
        <div className="text-center pt-1 space-y-1.5">
          <div
            className={`w-12 h-12 rounded-full border flex items-center justify-center mx-auto ${
              activeStatus === 'cancelled'
                ? 'bg-[#fff5f2] border-[#e85729]/40 text-[#e85729]'
                : 'bg-[#e8f7ee] border-[#7cd7a0] text-[#004d2c]'
            }`}
          >
            {activeStatus === 'cancelled' ? (
              <XCircle className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            )}
          </div>
          <h2 className="text-[22px] font-bold tracking-tight leading-tight text-[#004d2c]">
            {activeStatus === 'cancelled'
              ? isThai
                ? 'รายการจองถูกยกเลิกแล้ว'
                : 'Booking Cancelled'
              : isThai
                ? 'บัตรเข้าสนามพร้อมใช้งาน'
                : 'Court Pass Confirmed'}
          </h2>
          <p className="text-xs text-[#526453] font-medium max-w-xs mx-auto">
            {activeStatus === 'cancelled'
              ? isThai
                ? 'ช่วงเวลาคอร์ทนี้ถูกปลดล็อกเรียบร้อยแล้ว คุณสามารถจองรอบใหม่ได้ทันที'
                : 'This court slot has been released and is available to rebook.'
              : isThai
                ? 'แสดงตั๋วด้านล่างหรือแตะฝั่งขวาเพื่อขยายสแกนที่เคาน์เตอร์สนาม'
                : 'Show this ticket or tap the stub to scan at the venue counter'}
          </p>
        </div>

        {/* Perforated Editorial Entry Ticket (SmashAI CI) */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'บัตรผ่านเข้าคอร์ท' : 'Court Entry Pass'}
            subtitle={isThai ? 'แตะที่แถบสแกนเพื่อขยายเต็มจอ' : 'Tap stub to expand scanner view'}
            badge={
              activeStatus === 'cancelled'
                ? isThai
                  ? 'ยกเลิกแล้ว'
                  : 'Cancelled'
                : activeStatus === 'completed'
                  ? isThai
                    ? 'ใช้งานแล้ว'
                    : 'Completed'
                  : isThai
                    ? 'ยืนยันแล้ว'
                    : 'Confirmed'
            }
            badgeVariant={activeStatus === 'cancelled' ? 'soft' : 'green'}
          />

          <div className={activeStatus === 'cancelled' ? 'opacity-65 transition-opacity' : ''}>
            <EntryTicketCard
              dateTimeLine={formattedDateKicker}
              title={activeCourtName}
              venueLine={venueSubline}
              specs={[
                { label: isThai ? 'คอร์ท' : 'COURT', value: courtNumber },
                { label: isThai ? 'เวลา' : 'SLOT', value: `${slotStart}` },
                { label: isThai ? 'ประตู' : 'GATE', value: 'A2' },
              ]}
              stubLabel={activeStatus === 'cancelled' ? 'VOID PASS' : 'COURT PASS'}
              ticketCode={ticketRef}
              defaultScanMode="barcode"
              isThai={isThai}
              notchBgClass="bg-[#f8faf6]"
            />
          </div>

          <p className="text-[11px] text-[#5c6f5e] text-center font-medium tabular-nums">
            {isThai
              ? `ช่วงเวลาจอง ${slotStart} – ${slotEnd} น. · ฿${activeAmount.toLocaleString()} (${activePaymentMethod})`
              : `Reserved ${slotStart} – ${slotEnd} · ฿${activeAmount.toLocaleString()} (${activePaymentMethod})`}
          </p>
        </div>

        {/* Saved Court Bookings List (Persisted in Firestore when signed in) */}
        <div className="space-y-2.5">
          <SectionHeader
            title={isThai ? 'รายการจองคอร์ทที่บันทึกไว้' : 'Saved Court Bookings'}
            subtitle={
              authUser
                ? isThai
                  ? 'ซิงค์เรียลไทม์กับบัญชีคลาวด์ของคุณ'
                  : 'Live-synced with your cloud account'
                : isThai
                  ? 'บันทึกไว้ในอุปกรณ์นี้'
                  : 'Stored on this device'
            }
            badge={`${cloudBookings.length}`}
            badgeVariant={authUser ? 'green' : 'soft'}
          />

          {!authUser && (
            <div className="p-3.5 rounded-[20px] bg-[#ffffff] border border-[#d4dfd0] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#e8f7ee] text-[#004d2c] flex items-center justify-center shrink-0">
                  <CloudCheck className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-[#526453] font-medium leading-snug">
                  {isThai
                    ? 'เข้าสู่ระบบ Google เพื่อเก็บบัตรจองคอร์ทไว้บนคลาวด์อย่างถาวร'
                    : 'Sign in with Google to sync bookings permanently across devices.'}
                </p>
              </div>
              <button
                type="button"
                disabled={isAuthBusy}
                onClick={() => signInWithGoogle()}
                className="no-doodle px-3 py-2 rounded-full bg-[#004d2c] text-[#ffffff] text-[11px] font-semibold flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isAuthBusy ? '...' : isThai ? 'ล็อกอิน' : 'Sign In'}</span>
              </button>
            </div>
          )}

          {cancelError && (
            <div className="p-3 rounded-[16px] bg-[#fff5f2] border border-[#e85729]/30 text-xs font-semibold text-[#e85729]">
              {cancelError}
            </div>
          )}

          {cloudBookings.length === 0 ? (
            <div className="p-4 rounded-[20px] bg-[#ffffff] border border-[#d4dfd0] text-center space-y-2">
              <p className="text-xs font-semibold text-[#142608]">
                {isThai ? 'ยังไม่มีประวัติการจองที่บันทึกไว้' : 'No saved court bookings yet'}
              </p>
              <p className="text-[11px] text-[#5c6f5e]">
                {isThai
                  ? 'เลือกสนามและช่วงเวลาที่ต้องการเพื่อบันทึกบัตรเข้าคอร์ท'
                  : 'Select a court and time slot to create your first saved pass.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  navigateTo('B1');
                }}
                className="no-doodle mt-1 px-4 py-2 rounded-full bg-[#004d2c] text-[#ffffff] text-xs font-semibold cursor-pointer"
              >
                {isThai ? 'จองสนามเลย' : 'Book a Court'}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {cloudBookings.map((item) => {
                const isSelected = activeSavedBooking?.id === item.id;
                const isCancelled = item.status === 'cancelled';
                const isCompleted = item.status === 'completed';
                const isConfirming = confirmCancelId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-[20px] p-3.5 bg-[#ffffff] border transition-all ${
                      isSelected
                        ? 'border-[#004d2c] shadow-[0_4px_14px_rgba(0,77,44,0.1)]'
                        : 'border-[#d4dfd0] hover:border-[#2d4d14]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        playSelectSound();
                        setSelectedBookingId(item.id);
                      }}
                      className="no-doodle w-full text-left flex items-start justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-[#142608] truncate">
                            {item.courtName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 whitespace-nowrap ${
                              isCancelled
                                ? 'bg-[#fff5f2] text-[#e85729]'
                                : isCompleted
                                  ? 'bg-[#f2f7f0] text-[#5c6f5e]'
                                  : 'bg-[#e8f7ee] text-[#15803d]'
                            }`}
                          >
                            {isCancelled
                              ? isThai
                                ? 'ยกเลิก'
                                : 'Cancelled'
                              : isCompleted
                                ? isThai
                                  ? 'เสร็จสิ้น'
                                  : 'Completed'
                                : isThai
                                  ? 'ยืนยันแล้ว'
                                  : 'Confirmed'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#5c6f5e] font-medium tabular-nums">
                          <Calendar className="w-3 h-3 shrink-0 text-[#004d2c]" />
                          <span className="truncate">
                            {item.date} · {isThai ? `คอร์ท ${item.courtNumber}` : `Court ${item.courtNumber}`} ·{' '}
                            {item.slotsSummary}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-[#5c6f5e]/80">
                          {item.bookingRef} · {item.paymentMethod}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-[#004d2c] tabular-nums">
                          ฿{item.totalAmount.toLocaleString()}
                        </div>
                        <span className="text-[10px] font-semibold text-[#15803d]">
                          {isSelected
                            ? isThai
                              ? 'กำลังแสดงบัตร'
                              : 'Viewing pass'
                            : isThai
                              ? 'ดูบัตร'
                              : 'View pass'}
                        </span>
                      </div>
                    </button>

                    {!isCancelled && !isCompleted && (
                      <div className="mt-2.5 pt-2.5 border-t border-[#d4dfd0]/60 flex items-center justify-end gap-2">
                        {isConfirming ? (
                          <>
                            <span className="text-[11px] font-medium text-[#5c6f5e] mr-auto">
                              {isThai ? 'ยืนยันยกเลิกคอร์ทนี้?' : 'Cancel this booking?'}
                            </span>
                            <button
                              type="button"
                              disabled={cancellingId === item.id}
                              onClick={() => setConfirmCancelId(null)}
                              className="no-doodle px-3 py-1 rounded-full bg-[#f2f7f0] text-[#142608] text-[11px] font-semibold cursor-pointer"
                            >
                              {isThai ? 'เก็บไว้' : 'Keep'}
                            </button>
                            <button
                              type="button"
                              disabled={cancellingId === item.id}
                              onClick={() => handleConfirmCancel(item.id)}
                              className="no-doodle px-3 py-1 rounded-full bg-[#e85729] text-[#ffffff] text-[11px] font-semibold cursor-pointer"
                            >
                              {cancellingId === item.id
                                ? '...'
                                : isThai
                                  ? 'ยืนยันยกเลิก'
                                  : 'Confirm Cancel'}
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              playSelectSound();
                              setConfirmCancelId(item.id);
                            }}
                            className="no-doodle px-3 py-1 rounded-full border border-[#d4dfd0] hover:border-[#e85729] text-[#5c6f5e] hover:text-[#e85729] text-[11px] font-semibold cursor-pointer transition-colors"
                          >
                            {isThai ? 'ยกเลิกการจอง' : 'Cancel Booking'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Compact EXP Reward Banner in SmashAI CI */}
        <div className="p-3.5 rounded-[20px] bg-[#ffffff] border border-[#d4dfd0] flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#004d2c] text-[#7cd7a0] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-[#004d2c] truncate">
                {isThai ? 'รับโบนัส +100 EXP แล้ว' : '+100 EXP Claimed'}
              </div>
              <div className="text-[11px] text-[#526453] font-medium tabular-nums truncate">
                {isThai
                  ? `เลเวล ${player.level} · สะสม ${player.currentExp.toLocaleString()} / ${player.nextLevelExp.toLocaleString()} EXP`
                  : `Lv.${player.level} · ${player.currentExp.toLocaleString()} / ${player.nextLevelExp.toLocaleString()} EXP`}
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#e85729] whitespace-nowrap shrink-0 tabular-nums">
            +100
          </span>
        </div>

        {/* Action Pathways */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              navigateTo('C1');
            }}
            className="no-doodle w-full min-h-[48px] py-3.5 px-4 rounded-full font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer bg-[#004d2c] hover:bg-[#003a21] text-[#ffffff] shadow-[0_6px_18px_rgba(0,77,44,0.18)] whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current shrink-0" />
            <span>{isThai ? 'ไปนับแต้มสดในสนาม' : 'Start Live Score Tracker'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                navigateTo('E2');
              }}
              className="no-doodle min-h-[44px] py-3 px-3 rounded-full text-xs font-semibold border border-[#d4dfd0] hover:border-[#2d4d14] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#f2f7f0] text-[#142608] whitespace-nowrap"
            >
              <Users className="w-3.5 h-3.5 text-[#004d2c] shrink-0" />
              <span>{isThai ? 'ชวนก๊วนหารบิล' : 'Split Bill'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                navigateTo('HOME');
              }}
              className="no-doodle min-h-[44px] py-3 px-3 rounded-full text-xs font-semibold border border-[#d4dfd0] hover:border-[#2d4d14] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#f2f7f0] text-[#142608] whitespace-nowrap"
            >
              <span>{isThai ? 'กลับหน้าหลัก' : 'Back Home'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
