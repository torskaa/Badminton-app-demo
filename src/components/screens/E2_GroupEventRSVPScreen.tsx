import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  ArrowRight,
  CheckCircle2,
  UserPlus,
  Swords,
  ChevronDown,
  ChevronUp,
  Wallet,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { DoodleAvatar, DoodleAddSlot } from '../common/DoodleAvatar';
import { JoinedAvatarStack } from '../common/JoinedAvatarStack';
import { EntryTicketCard } from '../common/EntryTicketCard';
import { playSelectSound } from '../../utils/retroAudio';

export const E2_GroupEventRSVPScreen: React.FC = () => {
  const {
    currentEvent,
    toggleEventRsvp,
    payEventShare,
    player,
    authUser,
    walletBalance,
    navigateTo,
    gainExp,
    language,
  } = useApp();
  const isThai = language === 'th';
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [showMemberList, setShowMemberList] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payNotice, setPayNotice] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const myUserId = authUser?.uid || player.id;
  const myAttendee = currentEvent.attendees.find(
    (a) => a.id === myUserId || a.id === player.id
  );
  const isUserAttending = Boolean(myAttendee);
  const hasUserPaid = Boolean(myAttendee?.paid);

  const totalExpense = currentEvent.courtFeeTotal + currentEvent.shuttlecockFeeTotal;
  const confirmedCount = currentEvent.attendees.length;
  const remainingSpots = Math.max(0, currentEvent.maxPlayers - confirmedCount);
  const costPerPerson = confirmedCount > 0 ? Math.ceil(totalExpense / confirmedCount) : 140;

  const handleToggleRSVP = () => {
    toggleEventRsvp(myUserId);
    setPayNotice(null);
    if (!isUserAttending) {
      gainExp(50, isThai ? `ลงชื่อก๊วน ${currentEvent.title}` : `Joined ${currentEvent.title}`);
    }
  };

  const handleInviteFriends = async () => {
    playSelectSound();
    const shareText = isThai
      ? `ชวนตีแบด! ${currentEvent.title}\nสนาม: ${currentEvent.courtName}\nวันเวลา: ${currentEvent.date} (${currentEvent.timeRange})\nหารเฉลี่ย ~฿${costPerPerson}/คน (เหลือ ${remainingSpots} ที่)\nเข้าลงชื่อที่ SmashAI: ${window.location.href}`
      : `Join our badminton session! ${currentEvent.title}\nVenue: ${currentEvent.courtName}\nWhen: ${currentEvent.date} (${currentEvent.timeRange})\nEst. ~฿${costPerPerson}/player (${remainingSpots} spots left)\n${window.location.href}`;

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: currentEvent.title,
          text: shareText,
          url: window.location.href,
        });
        setInviteMessage(isThai ? 'ส่งคำชวนเพื่อนเรียบร้อย!' : 'Invite shared!');
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setInviteMessage(isThai ? 'คัดลอกข้อความและลิงก์ชวนเพื่อนแล้ว!' : 'Invite text & link copied!');
      } else {
        setInviteMessage(isThai ? 'พร้อมส่งลิงก์ชวนเพื่อนแล้ว' : 'Invite ready!');
      }
    } catch {
      // User dismissed share sheet or clipboard denied — fallback quietly
      try {
        await navigator.clipboard?.writeText(shareText);
        setInviteMessage(isThai ? 'คัดลอกข้อความชวนเพื่อนแล้ว!' : 'Invite copied to clipboard!');
      } catch {
        setInviteMessage(isThai ? 'ไม่สามารถคัดลอกอัตโนมัติได้' : 'Could not copy invite');
      }
    }
    setTimeout(() => setInviteMessage(null), 3000);
  };

  const handlePayShare = async () => {
    if (isPaying) return;
    setIsPaying(true);
    setPayNotice(null);
    try {
      const res = await payEventShare(currentEvent.id);
      if (res.ok) {
        setPayNotice({
          type: 'ok',
          text: isThai
            ? `ชำระส่วนแบ่ง ฿${res.amountPaid} สำเร็จแล้ว (+40 EXP)`
            : `Paid ฿${res.amountPaid} share via SmashPay (+40 EXP)`,
        });
      } else if (res.reason === 'insufficient_funds') {
        setPayNotice({
          type: 'error',
          text: isThai
            ? `ยอด SmashPay คงเหลือ ฿${walletBalance} ไม่พอจ่าย ฿${costPerPerson} (กดเติมเงินในกระเป๋าเงิน)`
            : `SmashPay balance (฿${walletBalance}) is lower than ฿${costPerPerson}`,
        });
      }
    } finally {
      setIsPaying(false);
    }
  };

  const userSeatNumber = Math.max(
    1,
    currentEvent.attendees.findIndex((a) => a.id === myUserId || a.id === player.id) + 1
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f8faf6] text-[#142608] overflow-hidden">
      <MobileHeader title={currentEvent.title} showBack />

      <div className="px-4 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-24 max-w-xl w-full mx-auto">
        {/* 1. Event Overview OR Perforated Event Entry Ticket when joined */}
        <div className="space-y-2">
          <SectionHeader
            title={
              isUserAttending
                ? isThai
                  ? 'บัตรเข้าก๊วนของคุณ'
                  : 'Your Event Pass'
                : isThai
                  ? 'เปิดรับสมาชิก'
                  : 'RSVP Open'
            }
            badge={
              isUserAttending
                ? hasUserPaid
                  ? isThai
                    ? 'จ่ายแล้ว ✓'
                    : 'Paid ✓'
                  : isThai
                    ? 'ลงชื่อแล้ว · รอจ่าย'
                    : 'Going · Unpaid'
                : isThai
                  ? `ว่าง ${remainingSpots} ที่`
                  : `${remainingSpots} left`
            }
            badgeVariant={isUserAttending ? (hasUserPaid ? 'green' : 'soft') : 'orange'}
          />

          {isUserAttending ? (
            <EntryTicketCard
              dateTimeLine={`${currentEvent.date.toUpperCase()} · ${currentEvent.timeRange.split('-')[0].trim()}`}
              title={currentEvent.title}
              venueLine={currentEvent.courtName}
              specs={[
                { label: isThai ? 'ลำดับ' : 'SPOT', value: `#${String(userSeatNumber).padStart(2, '0')}` },
                { label: isThai ? 'สถานะ' : 'STATUS', value: hasUserPaid ? (isThai ? 'จ่ายแล้ว' : 'PAID') : (isThai ? 'รอจ่าย' : 'DUE') },
                { label: isThai ? 'หารเฉลี่ย' : 'SHARE', value: `฿${costPerPerson}` },
              ]}
              stubLabel="ADMIT ONE"
              ticketCode={`EV-26-${currentEvent.id.slice(-4).toUpperCase()}-P${String(userSeatNumber).padStart(2, '0')}`}
              defaultScanMode="barcode"
              isThai={isThai}
              notchBgClass="bg-[#f8faf6]"
            />
          ) : (
            <div className="rounded-[24px] p-4 space-y-2.5 bg-[#ffffff] border border-[#d4dfd0]">
              <h2 className="text-xl font-bold leading-snug text-[#004d2c]">
                {currentEvent.title}
              </h2>

              <div className="space-y-1.5 text-xs text-[#526453] font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                  <span>
                    {currentEvent.date} · {currentEvent.timeRange}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#e85729] shrink-0" />
                  <span>{currentEvent.courtName}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Automatic Split-Bill Calculator + Real Pay Share */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'หารค่าคอร์ทและลูกแบด' : 'Split Bill'}
            badge={isThai ? `รวม ฿${totalExpense.toLocaleString()}` : `Total ฿${totalExpense.toLocaleString()}`}
            badgeVariant="dark"
          />

          <div className="rounded-[24px] p-4 bg-[#e8f7ee] border border-[#7cd7a0] space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-[#004d2c]">
                  {isThai ? 'เฉลี่ยคนละประมาณ' : 'Est. per player'}
                </div>
                <p className="text-[11px] text-[#526453] font-medium tabular-nums">
                  {isThai
                    ? `คอร์ท ฿${currentEvent.courtFeeTotal.toLocaleString()} + ลูกแบด ฿${currentEvent.shuttlecockFeeTotal.toLocaleString()}`
                    : `Court ฿${currentEvent.courtFeeTotal.toLocaleString()} + Shuttles ฿${currentEvent.shuttlecockFeeTotal.toLocaleString()}`}
                </p>
              </div>
              <div className="text-3xl font-bold text-[#004d2c] leading-none whitespace-nowrap shrink-0 tabular-nums">
                ~฿{costPerPerson}{' '}
                <span className="text-xs font-medium text-[#526453]">
                  ({confirmedCount} {isThai ? 'คน' : 'ppl'})
                </span>
              </div>
            </div>

            {isUserAttending && !hasUserPaid && (
              <button
                type="button"
                disabled={isPaying}
                onClick={handlePayShare}
                className="no-doodle w-full py-3 px-4 rounded-full bg-[#004d2c] hover:bg-[#003a21] text-[#ffffff] font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-[#7cd7a0] shrink-0" />
                <span>
                  {isPaying
                    ? isThai
                      ? 'กำลังชำระเงิน...'
                      : 'Processing...'
                    : isThai
                      ? `จ่ายส่วนแบ่ง ฿${costPerPerson} ด้วย SmashPay (คงเหลือ ฿${walletBalance.toLocaleString()})`
                      : `Pay ฿${costPerPerson} Share via SmashPay (฿${walletBalance.toLocaleString()})`}
                </span>
              </button>
            )}

            {payNotice && (
              <div
                className={`p-2.5 rounded-[14px] text-xs font-semibold flex items-center justify-between gap-2 ${
                  payNotice.type === 'ok'
                    ? 'bg-[#ffffff] text-[#15803d] border border-[#7cd7a0]'
                    : 'bg-[#fff5f2] text-[#e85729] border border-[#e85729]/30'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {payNotice.type === 'ok' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate">{payNotice.text}</span>
                </div>
                {payNotice.type === 'error' && (
                  <button
                    type="button"
                    onClick={() => navigateTo('FINANCE')}
                    className="no-doodle underline text-[11px] font-bold shrink-0 cursor-pointer"
                  >
                    {isThai ? 'เติมเงิน' : 'Top up'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 3. Confirmed Attendees with Overlapping Avatar Stack */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'สมาชิกที่ลงชื่อ' : 'Joined Members'}
            badge={isThai ? `สูงสุด ${currentEvent.maxPlayers} คน` : `Max ${currentEvent.maxPlayers}`}
            badgeVariant="soft"
          />

          <div className="rounded-[24px] p-4 bg-[#ffffff] border border-[#d4dfd0] space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <JoinedAvatarStack
                  members={currentEvent.attendees}
                  totalCount={confirmedCount}
                  maxVisible={4}
                  size="md"
                  onClick={() => setShowMemberList((prev) => !prev)}
                />
                <DoodleAddSlot
                  label={isThai ? 'ชวนเพื่อน' : 'Invite'}
                  size="sm"
                  onClick={handleInviteFriends}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowMemberList((prev) => !prev)}
                className="no-doodle px-3 py-1.5 rounded-full bg-[#f8faf6] border border-[#d4dfd0] hover:border-[#2d4d14] text-[11px] font-bold text-[#142608] flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{isThai ? `${confirmedCount} คน` : `${confirmedCount} joined`}</span>
                {showMemberList ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {inviteMessage && (
              <div className="px-3 py-2 rounded-[14px] bg-[#e8f7ee] border border-[#7cd7a0] text-[11px] font-semibold text-[#004d2c] text-center">
                {inviteMessage}
              </div>
            )}

            {showMemberList && (
              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-dashed border-[#d4dfd0]">
                {currentEvent.attendees.map((a) => (
                  <div
                    key={a.id}
                    className="p-2.5 rounded-[14px] bg-[#f8faf6] border border-[#e6eee2] flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <DoodleAvatar seed={a.name} size="xs" />
                      <span className="font-semibold truncate text-[#142608]">
                        {a.name.split(' ')[0]}
                      </span>
                    </div>
                    {a.paid ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#e8f7ee] text-[10px] font-semibold text-[#15803d] shrink-0 whitespace-nowrap">
                        {isThai ? 'จ่ายแล้ว' : 'Paid'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#fff5f2] text-[10px] font-semibold text-[#e85729] shrink-0 whitespace-nowrap">
                        {isThai ? 'รอจ่าย' : 'Due'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Actions */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              handleToggleRSVP();
            }}
            className={`no-doodle w-full min-h-[46px] py-3.5 px-4 rounded-full font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] whitespace-nowrap ${
              isUserAttending
                ? 'bg-[#e8f7ee] text-[#004d2c] border border-[#7cd7a0] hover:border-[#004d2c]'
                : 'bg-[#004d2c] hover:bg-[#003a21] text-[#ffffff] shadow-[0_6px_18px_rgba(0,77,44,0.16)]'
            }`}
          >
            {isUserAttending ? (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.3] shrink-0" />
                <span className="whitespace-nowrap">
                  {isThai ? 'ลงชื่อแล้ว · แตะเพื่อยกเลิก' : 'Going · Tap to cancel'}
                </span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">
                  {isThai ? 'ลงชื่อเข้าร่วมรับบัตร (+50 EXP)' : 'Join & Get Ticket (+50 EXP)'}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              navigateTo('E3');
            }}
            className="no-doodle w-full min-h-[44px] py-3 px-4 rounded-full font-semibold text-xs border border-[#d4dfd0] hover:border-[#2d4d14] flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[#ffffff] hover:bg-[#f2f7f0] text-[#142608] whitespace-nowrap"
          >
            <Swords className="w-3.5 h-3.5 text-[#e85729] shrink-0" />
            <span className="whitespace-nowrap">
              {isThai ? 'จัดทีมสมดุล' : 'Smart Matchmaker'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
