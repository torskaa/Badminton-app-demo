import React, { useState } from 'react';
import { Calendar, MapPin, ArrowRight, CheckCircle2, UserPlus, Swords } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { DoodleAvatar, DoodleAddSlot } from '../common/DoodleAvatar';

export const E2_GroupEventRSVPScreen: React.FC = () => {
 const { currentEvent, toggleEventRsvp, player, navigateTo, gainExp, language } = useApp();
 const isThai = language === 'th';
 const [inviteSent, setInviteSent] = useState(false);

 const isUserAttending = currentEvent.attendees.some((a) => a.id === player.id);

 const totalExpense = currentEvent.courtFeeTotal + currentEvent.shuttlecockFeeTotal;
 const confirmedCount = currentEvent.attendees.length;
 const costPerPerson = confirmedCount > 0 ? (totalExpense / confirmedCount).toFixed(0) : '140';

 const handleToggleRSVP = () => {
 toggleEventRsvp(player.id);
 if (!isUserAttending) {
 gainExp(50, `ลงชื่อเข้าร่วมกิจกรรมก๊วน ${currentEvent.title}`);
 }
 };

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000]  overflow-hidden">
 <MobileHeader showBack />

 <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16">
 {/* Event Header Banner (Slush style) */}
 <div className="space-y-2">
 <SectionHeader
 title="เปิดรับสมาชิกลงชื่อ · RSVP OPEN"
 subtitle="รายละเอียดสถานที่และเวลาที่นัดตีแบด"
 badge={`เหลือ ${currentEvent.maxPlayers - confirmedCount} ที่นั่ง`}
 badgeVariant="orange"
 />

 <div className="rounded-[32px] p-5 space-y-2.5 bg-[#ffffff]">
 <h2 className="font-['Antonio',sans-serif] text-2xl font-black uppercase leading-tight tracking-tight text-[#000000]">
 {currentEvent.title}
 </h2>

 <div className="space-y-1.5 text-xs text-[#000000]/70 font-medium pt-1">
 <div className="flex items-center gap-2">
 <Calendar className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
 <span>{currentEvent.date} · {currentEvent.timeRange}</span>
 </div>
 <div className="flex items-center gap-2">
 <MapPin className="w-3.5 h-3.5 text-[#e85729] shrink-0" />
 <span>{currentEvent.courtName} (Court 3-6)</span>
 </div>
 </div>
 </div>
 </div>

 {/* Automatic Split-Bill Calculator Card */}
 <div className="space-y-2">
 <SectionHeader
 title="ระบบหารบิลอัตโนมัติ · AUTO SPLIT BILL"
 subtitle="คำนวณค่าคอร์ทและลูกขนไก่ตามผู้เข้าร่วม"
 badge={`รวม ฿${totalExpense}`}
 badgeVariant="dark"
 />

 <div className="rounded-[28px] p-4 bg-[#7cd7a0]">
 <div className="flex items-baseline justify-between">
 <div>
 <div className="font-['Antonio',sans-serif] text-base font-black uppercase text-[#000000]">
 เฉลี่ยจ่ายคนละประมาณ
 </div>
 <p className="text-[10px] text-[#000000]/70 font-bold">
 รวมค่าคอร์ท 2 ชม. + ลูกขนไก่ RSL Silver
 </p>
 </div>
 <div className="font-['Antonio',sans-serif] text-4xl font-black text-[#000000] leading-none whitespace-nowrap shrink-0">
 ~฿{costPerPerson} <span className="text-xs font-normal text-[#000000]/70">({confirmedCount} คน)</span>
 </div>
 </div>
 </div>
 </div>

 {/* Confirmed Attendees List */}
 <div className="space-y-2">
 <SectionHeader
 title="รายชื่อผู้เล่นที่ยืนยัน · CONFIRMED SQUAD"
 subtitle="สมาชิกลงชื่อเข้าร่วมก๊วนรอบนี้"
 badge={`Max ${currentEvent.maxPlayers} คน`}
 badgeVariant="soft"
 />

 <div className="rounded-[28px] p-4 bg-[#ffffff] space-y-4">
 {/* Doodle Participants Strip (inspired by circular doodle squad + dashed Add slot) */}
 <div className="space-y-2">
 <div className="flex items-center justify-between gap-2">
 <span className="text-[11px] font-bold uppercase tracking-wide text-[#000000]/65">
 {isThai ? `สมาชิก (${confirmedCount})` : `PARTICIPANTS (${confirmedCount})`}
 </span>
 {inviteSent && (
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#7cd7a0] border border-[#000000] text-[10px] font-bold text-[#000000] whitespace-nowrap">
 {isThai ? 'คัดลอกลิงก์ชวนเพื่อนแล้ว!' : 'Invite link copied!'}
 </span>
 )}
 </div>
 <div className="flex items-start gap-3 overflow-x-auto no-scrollbar pb-1">
 {currentEvent.attendees.slice(0, 6).map((a) => {
 const shortName = a.name.split(' ')[0] || a.name;
 return (
 <div key={a.id} className="flex flex-col items-center gap-1 shrink-0 w-13">
 <DoodleAvatar
 seed={a.name}
 size="md"
 ringClass={`border-2 ${a.paid ? 'border-[#000000] ring-2 ring-[#7cd7a0]' : 'border-[#000000]'} shadow-xs`}
 />
 <span className="text-[11px] font-bold text-[#000000] truncate w-full text-center">
 {shortName}
 </span>
 </div>
 );
 })}
 <DoodleAddSlot
 label={isThai ? 'ชวนเพื่อน' : 'Add'}
 size="md"
 onClick={() => {
 setInviteSent(true);
 setTimeout(() => setInviteSent(false), 2500);
 }}
 />
 </div>
 </div>

 {/* Detailed Status Grid */}
 <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-[#000000]/20">
 {currentEvent.attendees.map((a) => (
 <div
 key={a.id}
 className="p-2.5 rounded-[18px] bg-[#f4f8fb] flex items-center justify-between gap-2 text-xs"
 >
 <div className="flex items-center gap-2 min-w-0">
 <DoodleAvatar seed={a.name} size="xs" />
 <div className="min-w-0">
 <span className="font-bold block truncate text-[#000000]">{a.name.split(' ')[0]}</span>
 <span className="text-[10px] text-[#000000]/60 font-medium block truncate">OVR {a.ovr}</span>
 </div>
 </div>
 {a.paid && (
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#7cd7a0] border border-[#000000] text-[9px] font-bold text-[#000000] shrink-0 whitespace-nowrap">
 Paid
 </span>
 )}
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Toggle RSVP Action */}
 <div className="space-y-2 pt-1">
 <button
 type="button"
 onClick={handleToggleRSVP}
 className={`w-full py-3.5 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 border border-[#000000] whitespace-nowrap ${
 isUserAttending
 ? 'bg-[#7cd7a0] text-[#000000]'
 : 'bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff]'
 }`}
 >
 {isUserAttending ? (
 <>
 <CheckCircle2 className="w-4 h-4 stroke-[2.5] shrink-0" />
 <span className="whitespace-nowrap">ATTENDING (TAP TO CANCEL)</span>
 </>
 ) : (
 <>
 <UserPlus className="w-4 h-4 shrink-0" />
 <span className="whitespace-nowrap">RSVP THIS SATURDAY (+50 EXP)</span>
 </>
 )}
 </button>

 <button
 type="button"
 onClick={() => navigateTo('E3')}
 className="w-full py-3 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] border border-[#000000] flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
 >
 <Swords className="w-3.5 h-3.5 text-[#e85729] shrink-0" />
 <span className="whitespace-nowrap">SMART MATCHMAKER จัดทีมสมดุล (E3)</span>
 <ArrowRight className="w-3.5 h-3.5 shrink-0" />
 </button>
 </div>
 </div>
 </div>
 );
};
