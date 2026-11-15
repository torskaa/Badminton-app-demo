import React, { useState } from 'react';
import { Calendar, MapPin, ArrowRight, CheckCircle2, UserPlus, Swords, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { DoodleAvatar, DoodleAddSlot } from '../common/DoodleAvatar';
import { JoinedAvatarStack } from '../common/JoinedAvatarStack';

export const E2_GroupEventRSVPScreen: React.FC = () => {
  const { currentEvent, toggleEventRsvp, player, navigateTo, gainExp, language } = useApp();
  const isThai = language === 'th';
  const [inviteSent, setInviteSent] = useState(false);
  const [showMemberList, setShowMemberList] = useState(false);

  const isUserAttending = currentEvent.attendees.some((a) => a.id === player.id);

  const totalExpense = currentEvent.courtFeeTotal + currentEvent.shuttlecockFeeTotal;
  const confirmedCount = currentEvent.attendees.length;
  const remainingSpots = Math.max(0, currentEvent.maxPlayers - confirmedCount);
  const costPerPerson = confirmedCount > 0 ? Math.round(totalExpense / confirmedCount) : 140;

  const handleToggleRSVP = () => {
    toggleEventRsvp(player.id);
    if (!isUserAttending) {
      gainExp(50, isThai ? `ลงชื่อก๊วน ${currentEvent.title}` : `Joined ${currentEvent.title}`);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-hidden">
      <MobileHeader showBack />

      <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16">
        {/* 1. Event Overview */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'เปิดรับสมาชิก' : 'RSVP Open'}
            badge={
              isThai
                ? `ว่าง ${remainingSpots} ที่`
                : `${remainingSpots} left`
            }
            badgeVariant="orange"
          />

          <div className="rounded-[28px] p-4 space-y-2.5 bg-[#ffffff]">
            <h2 className="text-xl font-bold leading-snug text-[#000000]">
              {currentEvent.title}
            </h2>

            <div className="space-y-1.5 text-xs text-[#000000]/75 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                <span>{currentEvent.date} · {currentEvent.timeRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#e85729] shrink-0" />
                <span>{currentEvent.courtName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Automatic Split-Bill Calculator */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'หารค่าคอร์ท' : 'Split Bill'}
            badge={isThai ? `รวม ฿${totalExpense.toLocaleString()}` : `Total ฿${totalExpense.toLocaleString()}`}
            badgeVariant="dark"
          />

          <div className="rounded-[28px] p-4 bg-[#7cd7a0]">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-[#000000]">
                  {isThai ? 'เฉลี่ยคนละประมาณ' : 'Est. per player'}
                </div>
                <p className="text-[11px] text-[#000000]/70 font-medium">
                  {isThai ? 'ค่าคอร์ท + ลูกขนไก่' : 'Court + shuttlecocks'}
                </p>
              </div>
              <div className="font-['Antonio',sans-serif] text-4xl font-black text-[#000000] leading-none whitespace-nowrap shrink-0 tabular-nums">
                ~฿{costPerPerson}{' '}
                <span className="text-xs font-normal text-[#000000]/70">
                  ({confirmedCount} {isThai ? 'คน' : 'ppl'})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Confirmed Attendees with Overlapping Avatar Stack */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'สมาชิกที่ลงชื่อ' : 'Joined Members'}
            badge={isThai ? `สูงสุด ${currentEvent.maxPlayers} คน` : `Max ${currentEvent.maxPlayers}`}
            badgeVariant="soft"
          />

          <div className="rounded-[28px] p-4 bg-[#ffffff] space-y-3">
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
                  onClick={() => {
                    setInviteSent(true);
                    setTimeout(() => setInviteSent(false), 2500);
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowMemberList((prev) => !prev)}
                className="no-doodle px-3 py-1.5 rounded-[1600px] bg-[#f4f8fb] hover:bg-[#e8f7ee] text-[11px] font-bold text-[#000000] flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{isThai ? `${confirmedCount} คน` : `${confirmedCount} joined`}</span>
                {showMemberList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {inviteSent && (
              <div className="px-3 py-1.5 rounded-[14px] bg-[#e8f7ee] text-[11px] font-bold text-[#15803d] text-center">
                {isThai ? 'คัดลอกลิงก์ชวนเพื่อนแล้ว' : 'Invite link copied!'}
              </div>
            )}

            {/* Expandable Compact Member List */}
            {showMemberList && (
              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-dashed border-[#000000]/15">
                {currentEvent.attendees.map((a) => (
                  <div
                    key={a.id}
                    className="p-2.5 rounded-[16px] bg-[#f4f8fb] flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <DoodleAvatar seed={a.name} size="xs" />
                      <span className="font-bold truncate text-[#000000]">
                        {a.name.split(' ')[0]}
                      </span>
                    </div>
                    {a.paid && (
                      <span className="px-2 py-0.5 rounded-[1600px] bg-[#7cd7a0] text-[10px] font-bold text-[#000000] shrink-0 whitespace-nowrap">
                        {isThai ? 'จ่ายแล้ว' : 'Paid'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Actions */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleToggleRSVP}
            className={`w-full py-3.5 px-4 rounded-[1600px] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 border border-[#000000] whitespace-nowrap ${
              isUserAttending
                ? 'bg-[#7cd7a0] text-[#000000]'
                : 'bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff]'
            }`}
          >
            {isUserAttending ? (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5] shrink-0" />
                <span className="whitespace-nowrap">
                  {isThai ? 'ลงชื่อแล้ว · แตะเพื่อยกเลิก' : 'Going · Tap to cancel'}
                </span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">
                  {isThai ? 'ลงชื่อเข้าร่วม (+50 EXP)' : 'Join Session (+50 EXP)'}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigateTo('E3')}
            className="w-full py-3 px-4 rounded-[1600px] font-bold text-xs border border-[#000000] flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
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
