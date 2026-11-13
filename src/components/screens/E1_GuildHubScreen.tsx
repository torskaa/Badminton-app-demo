import React, { useState } from 'react';
import { Users, Calendar, Trophy, ChevronRight, Plus, ArrowRight, Swords, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { GuildHubEmptyState } from '../common/GuildHubEmptyState';
import { DoodleAvatar } from '../common/DoodleAvatar';

export const E1_GuildHubScreen: React.FC = () => {
 const { guilds, currentEvent, navigateTo, gainExp } = useApp();
 const [activeFilter, setActiveFilter] = useState<'all' | 'my_squads' | 'weekend' | 'competitive'>('all');
 const [simulateEmpty, setSimulateEmpty] = useState(false);
 const [createToast, setCreateToast] = useState(false);

 const filters = [
 { id: 'all', label: 'All Guilds' },
 { id: 'weekend', label: 'Weekend' },
 { id: 'competitive', label: 'Competitive' },
 { id: 'my_squads', label: 'My Squads' }, // Empty state triggers here naturally!
 ];

 const handleCreateGuild = () => {
 gainExp(100, 'สร้างก๊วนแบดมินตันใหม่สำเร็จ (Guild Captain)');
 setCreateToast(true);
 setTimeout(() => {
 setCreateToast(false);
 navigateTo('E2');
 }, 1200);
 };

 const filteredGuilds = simulateEmpty
 ? []
 : activeFilter === 'my_squads'
 ? [] // Natural empty state: user hasn't created a squad yet
 : activeFilter === 'weekend'
 ? guilds.filter((g) => g.homeCourt.includes('พระราม 9'))
 : activeFilter === 'competitive'
 ? guilds.filter((g) => g.memberCount > 50)
 : guilds;

 return (
 <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28  bg-[#f4f8fb] text-[#000000]">
 <MobileHeader />

 <div className="px-5 pt-4 pb-6 space-y-4">
 {/* Community Header Banner */}
 <div className="space-y-2">
 <SectionHeader
 title="ศูนย์กลางคอมมูนิตี้ · SQUAD HUB"
 subtitle="รวมก๊วนตีแบดในกรุงเทพฯ และจัดทีมลงแข่ง"
 badge="เปิดรับสมาชิก"
 badgeVariant="green"
 />

 <div className="rounded-[28px] p-4 bg-[#ffffff]">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-[1600px] bg-[#7cd7a0] flex items-center justify-center font-bold text-[#000000] text-xl shrink-0">
 👥
 </div>
 <div>
 <h2 className="font-['Antonio',sans-serif] text-xl font-black uppercase leading-tight text-[#000000]">
 BANGKOK SMASHERS GUILD
 </h2>
 <p className="text-xs text-[#000000]/70 font-medium">
 หารค่าคอร์ท, จับคู่ก๊วนสมดุล และลงแข่งเก็บคะแนนประจำสัปดาห์
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Featured Upcoming Guild Event Banner */}
 <div className="space-y-2">
 <SectionHeader
 title="กิจกรรมนัดตีแบด · UPCOMING SESSION"
 subtitle="เสาร์หน้า · นัดรวมก๊วนประจำสัปดาห์"
 badge={`${currentEvent.attendees.length}/${currentEvent.maxPlayers} RSVP'd`}
 badgeVariant="green"
 />

 <div
 onClick={() => navigateTo('E2')}
 className="rounded-[28px] p-5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform space-y-3 bg-[#ffffff]"
 >

 <div className="flex items-start justify-between gap-2">
 <div className="min-w-0">
 <h3 className="font-['Antonio',sans-serif] text-2xl font-black uppercase leading-tight tracking-tight text-[#000000]">
 {currentEvent.title}
 </h3>
 <p className="text-xs text-[#000000]/70 font-medium mt-0.5">
 {currentEvent.courtName} · {currentEvent.date} ({currentEvent.timeRange})
 </p>
 </div>
 <div className="flex items-center -space-x-2 shrink-0 pt-0.5">
 {currentEvent.attendees.slice(0, 3).map((a) => (
 <DoodleAvatar
 key={a.id}
 seed={a.name}
 size="xs"
 ringClass="border-2 border-[#000000] ring-1 ring-[#ffffff]"
 />
 ))}
 </div>
 </div>

 {/* Split Bill preview & Attend button */}
 <div className="pt-3 flex items-center justify-between text-xs">
 <div>
 <span className="text-[10px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">หารเฉลี่ยประมาณ</span>
 <div className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000] leading-none">
 ~฿{Math.round((currentEvent.courtFeeTotal + currentEvent.shuttlecockFeeTotal) / currentEvent.maxPlayers)}
 <span className="text-xs font-normal text-[#000000]/60">/คน</span>
 </div>
 </div>

 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 navigateTo('E2');
 }}
 className="px-4 py-2 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#000000] text-[#ffffff] border border-[#000000] hover:bg-[#1a1a1a] shrink-0 whitespace-nowrap"
 >
 <span className="whitespace-nowrap">VIEW RSVP & BILL (E2)</span>
 <ArrowRight className="w-3.5 h-3.5 shrink-0" />
 </button>
 </div>
 </div>
 </div>

 {/* Quick Hub Navigation Cards */}
 <div className="grid grid-cols-2 gap-2.5">
 <button
 type="button"
 onClick={() => navigateTo('E3')}
 className="border border-[#000000] rounded-[24px] p-4 text-left cursor-pointer hover:scale-105 active:scale-95 transition-transform flex flex-col justify-between h-32 bg-[#ffffff]"
 >
 <div className="flex items-center justify-between">
 <div className="w-9 h-9 rounded-[1600px] bg-[#e85729] text-[#ffffff] flex items-center justify-center font-bold">
 <Swords className="w-4 h-4" />
 </div>
 <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-[1600px] bg-[#f4f8fb] whitespace-nowrap shrink-0">
 จับคู่อัจฉริยะ
 </span>
 </div>
 <div>
 <h4 className="font-['Antonio',sans-serif] text-base font-black uppercase leading-tight text-[#000000]">
 Smart Matchmaker
 </h4>
 <p className="text-[10px] text-[#000000]/70 font-bold">จัดทีม 50/50 สลับมือสมดุล →</p>
 </div>
 </button>

 <button
 type="button"
 onClick={() => navigateTo('E4')}
 className="border border-[#000000] rounded-[24px] p-4 text-left cursor-pointer hover:scale-105 active:scale-95 transition-transform flex flex-col justify-between h-32 bg-[#ffffff]"
 >
 <div className="flex items-center justify-between">
 <div className="w-9 h-9 rounded-[1600px] bg-[#7cd7a0] text-[#000000] flex items-center justify-center font-bold">
 <Trophy className="w-4 h-4" />
 </div>
 <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-[1600px] bg-[#e8f7ee] whitespace-nowrap shrink-0">
 ตารางอันดับ
 </span>
 </div>
 <div>
 <h4 className="font-['Antonio',sans-serif] text-base font-black uppercase leading-tight text-[#000000]">
 Leaderboard
 </h4>
 <p className="text-[10px] text-[#000000]/70 font-bold">Season 4 อันดับก๊วน →</p>
 </div>
 </button>
 </div>

 {/* Guild Category Tabs + Empty State Simulator Toggle */}
 <div className="space-y-3">
 <SectionHeader
 title="ก๊วนแบดมินตันในกรุงเทพฯ"
 subtitle={`พบ ${filteredGuilds.length} ก๊วนที่เปิดรับสมาชิก`}
 rightSlot={
 <button
 type="button"
 onClick={() => setSimulateEmpty(!simulateEmpty)}
 className={`text-[10px] font-bold tracking-[0.032em] px-2.5 py-1 rounded-[1600px] border border-[#000000] cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
 simulateEmpty ? 'bg-[#e85729] text-[#ffffff]' : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 title="สลับดูหน้าตาตอนไม่พบก๊วน (Empty State)"
 >
 {simulateEmpty ? '✕ ปิด Empty' : '🔍 ทดสอบ Empty'}
 </button>
 }
 />

 {/* Filter Pills */}
 <div data-filter="true" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
 {filters.map((f) => {
 const isActive = activeFilter === f.id && !simulateEmpty;
 return (
 <button
 key={f.id}
 type="button"
 onClick={() => {
 setActiveFilter(f.id as any);
 setSimulateEmpty(false);
 }}
 className={`px-3 py-1.5 rounded-[1600px] text-xs font-bold tracking-[0.032em] shrink-0 border border-[#000000] cursor-pointer transition-all ${
 isActive
 ? 'bg-[#000000] text-[#ffffff]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 {f.label}
 </button>
 );
 })}
 </div>

 {createToast && (
 <div className="p-3 rounded-[20px] bg-[#7cd7a0] text-xs font-bold text-[#000000] text-center animate-bounce">
 🎉 สร้างก๊วนสำเร็จ! +100 EXP มุ่งหน้าสู่หน้าตั้งค่าปาร์ตี้...
 </div>
 )}

 {/* Render GuildHubEmptyState or Guilds List */}
 {filteredGuilds.length === 0 ? (
 <GuildHubEmptyState
 onCreateGuild={handleCreateGuild}
 onFindSparring={() => navigateTo('E3')}
 onReset={() => {
 setActiveFilter('all');
 setSimulateEmpty(false);
 }}
 />
 ) : (
 <div className="space-y-2">
 {filteredGuilds.map((g) => (
 <div
 key={g.id}
 onClick={() => navigateTo('E2')}
 className="p-3.5 rounded-[24px] flex items-center justify-between gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] bg-[#ffffff]"
 >
 <div className="min-w-0 flex-1">
 <h4 className="font-['Antonio',sans-serif] text-base font-black uppercase text-[#000000] truncate">{g.name}</h4>
 <p className="text-[10px] text-[#000000]/70 font-medium truncate">{g.homeCourt} · {g.memberCount} สมาชิก</p>
 </div>
 <span className="px-3.5 py-1.5 rounded-[1600px] text-[10px] font-bold tracking-[0.032em] bg-[#000000] text-[#ffffff] hover:bg-[#1a1a1a] shrink-0 whitespace-nowrap">
 JOIN SQUAD
 </span>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 );
};
