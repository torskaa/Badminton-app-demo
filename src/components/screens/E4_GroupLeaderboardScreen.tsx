import React, { useState } from 'react';
import { Trophy, Medal, Zap, Flame, Crown, Swords, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { DoodleAvatar } from '../common/DoodleAvatar';
import { PlayerTier } from '../../types';

export const E4_GroupLeaderboardScreen: React.FC = () => {
 const { leaderboard, player, navigateTo, setSparringModalPlayer } = useApp();
 const [selectedTierFilter, setSelectedTierFilter] = useState<'All' | PlayerTier>('All');

 const filteredList = leaderboard.filter((item) => {
 if (selectedTierFilter === 'All') return true;
 return item.tier === selectedTierFilter;
 });

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000]  overflow-hidden">
 <MobileHeader showBack />

 <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
 {/* Season Header Banner */}
 <div className="space-y-2">
 <SectionHeader
 title="SEASON 4: BANGKOK CLASH"
 subtitle="สะสม Win Rate และคะแนนเพื่อเลื่อนชั้น"
 badge="14 DAYS LEFT"
 badgeVariant="orange"
 />

 <div className="rounded-[28px] p-5 space-y-2.5 bg-[#ffffff]">
 <h2 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight leading-tight text-[#000000]">
 ตารางจัดอันดับก๊วนตบสนั่น พระราม 9
 </h2>
 <p className="text-xs text-[#000000]/70 font-medium">
 สะสม Win Rate และ Smash Winner Points เพื่อเลื่อนชั้นสู่ Diamond Tier
 </p>

 <div className="pt-1 flex items-center gap-2">
 <button
 type="button"
 onClick={() => navigateTo('E3')}
 className="px-4 py-2 rounded-[1600px] bg-[#000000] text-[#ffffff] font-bold text-xs uppercase tracking-[0.032em] flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 border border-[#000000] hover:bg-[#1a1a1a] whitespace-nowrap"
 >
 <Swords className="w-3.5 h-3.5 shrink-0" />
 <span className="whitespace-nowrap">SMART MATCHMAKER จัดทีมสมดุล (E3)</span>
 </button>
 </div>
 </div>
 </div>

 {/* Tier Filter Section */}
 <div className="space-y-2">
 <SectionHeader
 title="เลือกลีกระดับฝีมือ · LEAGUE FILTER"
 badge={selectedTierFilter}
 badgeVariant="orange"
 />
 {/* Tier Filter Pills */}
 <div data-filter="true" className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
 {['All', 'Diamond', 'Gold', 'Silver', 'Bronze'].map((tier) => (
 <button
 type="button"
 key={tier}
 onClick={() => setSelectedTierFilter(tier as any)}
 className={`px-4 py-1.5 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] shrink-0 cursor-pointer transition-all border border-[#000000] ${
 selectedTierFilter === tier
 ? 'bg-[#000000] text-[#ffffff]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 {tier === 'All' ? 'ทั้งหมด (ALL TIERS)' : `${tier} LEAGUE`}
 </button>
 ))}
 </div>
 </div>

 {/* Ranked Players List Header */}
 <SectionHeader
 title="อันดับนักกีฬาในก๊วน · SQUAD RANKINGS"
 badge={`${filteredList.length} รายชื่อ`}
 badgeVariant="soft"
 />

 {/* Ranked Players List */}
 <div className="space-y-2.5">
 {filteredList.map((item) => {
 const isUser = item.name.includes('กานต์') || item.rank === 1;

 return (
 <div
 key={item.id}
 onClick={() => setSparringModalPlayer({
 name: item.name,
 ovr: item.ovr,
 tier: `${item.tier} League`,
 role: 'Top Ranked Smasher',
 status: 'พร้อมดวลคะแนน Season 4',
 winRate: item.winRate,
 })}
 className={`p-3.5 rounded-[24px] transition-all flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
 isUser ? 'bg-[#7cd7a0]' : 'bg-[#ffffff]'
 }`}
 >
 <div className="flex items-center gap-2.5 min-w-0">
 <div className={`w-7 h-7 rounded-[1600px] border-[1.5px] border-[#000000] flex items-center justify-center font-['Antonio',sans-serif] text-sm font-black shrink-0 ${
 item.rank === 1
 ? 'bg-[#000000] text-[#e85729]'
 : item.rank === 2
 ? 'bg-[#f4f8fb] text-[#000000]'
 : item.rank === 3
 ? 'bg-[#e85729] text-[#ffffff]'
 : 'bg-[#ffffff] text-[#000000]'
 }`}>
 {item.rank}
 </div>

 <DoodleAvatar seed={item.name} size="sm" />

 <div className="min-w-0">
 <div className="flex items-center gap-1.5">
 <span className="font-bold text-xs text-[#000000]">{item.name}</span>
 {isUser && (
 <span className="px-1.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[9px] font-bold uppercase whitespace-nowrap shrink-0">
 You
 </span>
 )}
 </div>
 <span className="text-[10px] text-[#000000]/60 font-bold uppercase tracking-[0.032em]">
 {item.tier} · OVR {item.ovr}
 </span>
 </div>
 </div>

 <div className="text-right">
 <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000]">
 {item.winRate}% WIN
 </div>
 <span className="text-[10px] font-bold text-[#000000]/60">
 {item.totalGames} แมตช์ · {item.smashPoints} pts
 </span>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 );
};
