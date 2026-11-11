import React, { useState } from 'react';
import { Trophy, Medal, Zap, Flame, Crown, Swords, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { PlayerTier } from '../../types';

export const E4_GroupLeaderboardScreen: React.FC = () => {
 const { leaderboard, player, navigateTo, setSparringModalPlayer } = useApp();
 const [selectedTierFilter, setSelectedTierFilter] = useState<'All' | PlayerTier>('All');

 const filteredList = leaderboard.filter((item) => {
 if (selectedTierFilter === 'All') return true;
 return item.tier === selectedTierFilter;
 });

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000]  overflow-hidden">
 <MobileHeader title="ตารางอันดับก๊วน & SEASON TIER" showBack />

 <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
 {/* Season Header Banner */}
 <div className="rounded-[28px] p-5 space-y-2.5 bg-[#ffffff]">
 <div className="flex items-center justify-between text-xs pb-2">
 <span className="px-3 py-1 rounded-[1600px] bg-[#ffd731] text-[#000000] font-black text-[10px] uppercase tracking-[0.032em] flex items-center gap-1.5">
 <Crown className="w-3.5 h-3.5 fill-[#000000]" />
 SEASON 4: BANGKOK CLASH
 </span>
 <span className="text-[10px] bg-[#dceeff] px-2.5 py-0.5 rounded-[1600px] font-bold">
 14 DAYS LEFT
 </span>
 </div>

 <h2 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight pt-1 leading-tight text-[#000000]">
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

 {/* Tier Filter Section */}
 <div className="space-y-1.5">
 <div className="flex items-center justify-between px-1">
 <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">
 เลือกลีกระดับฝีมือ · LEAGUE FILTER
 </span>
 <span className="text-[10px] font-bold text-[#5c4ade]">
 {selectedTierFilter}
 </span>
 </div>
 {/* Tier Filter Pills */}
 <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
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
 <div className="flex items-center justify-between px-1 pt-1">
 <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">
 อันดับนักกีฬาในก๊วน · SQUAD RANKINGS
 </span>
 <span className="text-[10px] font-bold text-[#000000]/60">
 {filteredList.length} รายชื่อ
 </span>
 </div>

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
 isUser ? 'bg-[#ffd731]' : 'bg-[#ffffff]'
 }`}
 >
 <div className="flex items-center gap-3">
 <div className={`w-8 h-8 rounded-[1600px] flex items-center justify-center font-['Antonio',sans-serif] text-base font-black ${
 item.rank === 1
 ? 'bg-[#000000] text-[#ffd731]'
 : item.rank === 2
 ? 'bg-[#cccccc] text-[#000000]'
 : item.rank === 3
 ? 'bg-[#ff5c34] text-[#ffffff]'
 : 'bg-[#ffffff] text-[#000000]'
 }`}>
 {item.rank}
 </div>

 <div>
 <div className="flex items-center gap-1.5">
 <span className="font-bold text-xs text-[#000000]">{item.name}</span>
 {isUser && (
 <span className="px-1.5 py-0.2 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[9px] font-bold uppercase">
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
