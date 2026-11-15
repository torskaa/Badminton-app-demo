/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Zap, Target, Crosshair, ArrowRight, Shield, User, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { PlayerTier } from '../../types';

export const A2_PlaystyleSetupScreen: React.FC = () => {
 const { player, updatePlayer, gainExp, navigateTo, language } = useApp();
 const isThai = language === 'th';

 const [hand, setHand] = useState<'Right' | 'Left'>(player.dominantHand);
 const [playstyle, setPlaystyle] = useState(player.playstyle);
 const [goal, setGoal] = useState(player.primaryGoal);
 const [selectedTier, setSelectedTier] = useState<PlayerTier>(player.tier);
 const [playerName, setPlayerName] = useState(player.name);

 const PLAYSTYLES = [
 {
 id: 'Attacking Smash Hunter' as const,
 title: isThai ? 'สายตบพิฆาต' : 'Smash Hunter',
 desc: isThai ? 'เน้นบุกต่อเนื่อง ตบหนัก ปิดแต้มไว' : 'Relentless offense with steep jump smashes',
 icon: Zap,
 color: '#e85729',
 },
 {
 id: 'Net Control Wizard' as const,
 title: isThai ? 'สายหยอดคุมเชิง' : 'Net Control Wizard',
 desc: isThai ? 'วางลูกเลียดเน็ต คุมจังหวะเกม' : 'Tight net drops to force weak lifts',
 icon: Crosshair,
 color: '#7cd7a0',
 },
 {
 id: 'Defensive Wall' as const,
 title: isThai ? 'สายรับกำแพงเหล็ก' : 'Defensive Wall',
 desc: isThai ? 'รับเหนียวแน่น ดักสวนโต้กลับแม่นยำ' : 'Solid defense and quick counter-drives',
 icon: Shield,
 color: '#7cd7a0',
 },
 {
 id: 'All-Rounder' as const,
 title: isThai ? 'สายสมดุลรอบด้าน' : 'All-Rounder',
 desc: isThai ? 'เล่นได้ครบทุกตำแหน่ง ปรับเกมตามสถานการณ์' : 'Balanced positioning and smart shot placement',
 icon: Target,
 color: '#e8f7ee',
 },
 ];

 const GOALS = [
 { id: 'Smash Mastery' as const, label: isThai ? '⚡ อัปสปีดและมุมลูกตบ' : '⚡ Boost Smash Power & Angle' },
 { id: 'Lightning Footwork' as const, label: isThai ? '👟 ฟุตเวิร์กไว ทันทุกช็อต' : '👟 Faster 6-Corner Footwork' },
 { id: 'Tactical Net Play' as const, label: isThai ? '🎯 วางลูกหน้าเน็ตแม่นยำ' : '🎯 Sharper Tactical Net Play' },
 { id: 'Endurance' as const, label: isThai ? '🫁 ยืนระยะอึดครบ 3 เซต' : '🫁 3-Set Stamina & Endurance' },
 ];

 const TIERS: { tier: PlayerTier; label: string; desc: string }[] = [
 {
 tier: 'Bronze',
 label: isThai ? 'มือใหม่' : 'Beginner',
 desc: isThai ? 'ตีสัปดาห์ละ 1 ครั้ง' : 'Casual weekly play',
 },
 {
 tier: 'Silver',
 label: isThai ? 'ระดับกลาง' : 'Intermediate',
 desc: isThai ? 'มีก๊วนประจำ ตีเบสิกคล่อง' : 'Regular squad games',
 },
 {
 tier: 'Gold',
 label: isThai ? 'ระดับสูง' : 'Advanced',
 desc: isThai ? 'ทักษะแข่งขัน ฟุตเวิร์กดี' : 'Competitive footwork',
 },
 {
 tier: 'Diamond',
 label: isThai ? 'นักกีฬาลีก' : 'Semi-Pro',
 desc: isThai ? 'สายทัวร์นาเมนต์ ตบแรง' : 'Tournament level',
 },
 ];

 const handleSaveAndContinue = () => {
 updatePlayer({
 name: playerName,
 dominantHand: hand,
 playstyle,
 primaryGoal: goal,
 tier: selectedTier,
 });
 gainExp(150, isThai ? 'บันทึกสไตล์การเล่นเรียบร้อย' : 'Saved player style profile');
 navigateTo('D1');
 };

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-hidden">
 <MobileHeader showBack />

 <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16">
 {/* Intro Card */}
 <div className="p-4 rounded-[28px] bg-[#ffffff] space-y-1">
 <div className="flex items-center gap-2 mb-1">
 <span className="px-3 py-1 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-[10px] font-bold tracking-[0.032em] uppercase">
 {isThai ? 'ตั้งค่าผู้เล่น' : 'Player Setup'}
 </span>
 <span className="text-xs text-[#000000]/70 font-bold">
 {isThai ? '+150 คะแนน' : '+150 EXP'}
 </span>
 </div>
 <h2 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight text-[#000000] leading-tight">
 {isThai ? 'เลือกสไตล์การเล่นของคุณ' : 'BUILD YOUR PLAYSTYLE'}
 </h2>
 <p className="text-xs text-[#000000]/70 mt-1 font-medium leading-relaxed">
 {isThai
 ? 'ใช้แนะนำคู่ซ้อมและโปรแกรมฝึกที่เหมาะกับคุณ'
 : 'Used to personalize sparring matches and training drills.'}
 </p>
 </div>

 {/* Player Name & Hand */}
 <div className="p-4 rounded-[28px] bg-[#ffffff] space-y-3">
 <div>
 <label className="text-[11px] font-bold uppercase tracking-[0.032em] block mb-1.5 text-[#000000]/70">
 {isThai ? 'ชื่อนักกีฬา' : 'Player Name'}
 </label>
 <div className="relative">
 <input
 type="text"
 value={playerName}
 onChange={(e) => setPlayerName(e.target.value)}
 placeholder={isThai ? 'เช่น กานต์, บีม' : 'e.g. Karn, Beam'}
 className="w-full px-4 py-2.5 rounded-[1600px] text-xs font-bold tracking-[0.032em] bg-[#ffffff] text-[#000000] focus:outline-none"
 />
 <User className="w-4 h-4 absolute right-3.5 top-3 text-[#000000]/40" />
 </div>
 </div>

 <div>
 <label className="text-[11px] font-bold uppercase tracking-[0.032em] block mb-1.5 text-[#000000]/70">
 {isThai ? 'มือข้างที่ถนัด' : 'Dominant Hand'}
 </label>
 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => setHand('Right')}
 className={`py-2.5 px-3 rounded-[1600px] text-xs font-bold tracking-[0.032em] transition-transform active:scale-95 cursor-pointer border border-[#000000] whitespace-nowrap ${
 hand === 'Right'
 ? 'bg-[#7cd7a0] text-[#000000]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 {isThai ? '🖐️ มือขวา' : '🖐️ Right-Handed'}
 </button>
 <button
 type="button"
 onClick={() => setHand('Left')}
 className={`py-2.5 px-3 rounded-[1600px] text-xs font-bold tracking-[0.032em] transition-transform active:scale-95 cursor-pointer border border-[#000000] whitespace-nowrap ${
 hand === 'Left'
 ? 'bg-[#7cd7a0] text-[#000000]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 {isThai ? '🤚 มือซ้าย' : '🤚 Left-Handed'}
 </button>
 </div>
 </div>
 </div>

 {/* 4 Archetype Cards */}
 <div className="space-y-2.5">
 <label className="text-[11px] font-bold uppercase tracking-[0.032em] block px-1 text-[#000000]/70">
 {isThai ? 'สไตล์การเล่น' : 'Playstyle'}
 </label>

 <div className="space-y-2">
 {PLAYSTYLES.map((item) => {
 const isSelected = playstyle === item.id;
 const Icon = item.icon;
 return (
 <div
 key={item.id}
 onClick={() => setPlaystyle(item.id)}
 className={`p-3.5 rounded-[24px] transition-transform active:scale-98 cursor-pointer flex items-center justify-between ${
 isSelected
 ? 'bg-[#7cd7a0] text-[#000000]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 <div className="flex items-center gap-3">
 <div
 className="w-10 h-10 rounded-[1600px] flex items-center justify-center text-[#000000]"
 style={{ backgroundColor: item.color }}
 >
 <Icon className="w-5 h-5 stroke-[2.2]" />
 </div>
 <div>
 <div className="font-['Antonio',sans-serif] text-base font-black tracking-tight uppercase text-[#000000]">
 {item.title}
 </div>
 <div className="text-[10px] text-[#000000]/70 font-medium">
 {item.desc}
 </div>
 </div>
 </div>

 <div className={`w-6 h-6 rounded-[1600px] flex items-center justify-center ${
 isSelected ? 'bg-[#000000] text-[#ffffff]' : 'bg-[#ffffff]'
 }`}>
 {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Primary Goals */}
 <div className="p-4 rounded-[28px] bg-[#ffffff] space-y-2.5">
 <label className="text-[11px] font-bold uppercase tracking-[0.032em] block text-[#000000]/70">
 {isThai ? 'เป้าหมายหลัก' : 'Primary Goal'}
 </label>
 <div className="grid grid-cols-1 gap-1.5">
 {GOALS.map((g) => {
 const isSelected = goal === g.id;
 return (
 <button
 key={g.id}
 type="button"
 onClick={() => setGoal(g.id)}
 className={`py-2 px-3 rounded-[1600px] text-left text-xs font-bold tracking-[0.032em] transition-all cursor-pointer border border-[#000000] flex items-center justify-between ${
 isSelected
 ? 'bg-[#7cd7a0] text-[#000000]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 <span>{g.label}</span>
 {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
 </button>
 );
 })}
 </div>
 </div>

 {/* Player Tier Selection */}
 <div className="p-4 rounded-[28px] bg-[#ffffff] space-y-2.5">
 <label className="text-[11px] font-bold uppercase tracking-[0.032em] block text-[#000000]/70">
 {isThai ? 'ระดับฝีมือปัจจุบัน' : 'Skill Level'}
 </label>
 <div className="grid grid-cols-2 gap-2">
 {TIERS.map((t) => {
 const isSelected = selectedTier === t.tier;
 return (
 <button
 key={t.tier}
 type="button"
 onClick={() => setSelectedTier(t.tier)}
 className={`p-3 rounded-[20px] text-left border border-[#000000] transition-all cursor-pointer ${
 isSelected
 ? 'bg-[#e8f7ee] text-[#000000]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 <div className="font-['Antonio',sans-serif] text-sm font-black uppercase text-[#000000]">{t.label}</div>
 <div className="text-[9px] text-[#000000]/70 font-medium mt-0.5">{t.desc}</div>
 </button>
 );
 })}
 </div>
 </div>

 {/* Save and Continue Button */}
 <button
 type="button"
 onClick={handleSaveAndContinue}
 className="w-full py-3.5 px-4 rounded-[1600px] bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 border border-[#000000] transition-transform active:scale-98 cursor-pointer whitespace-nowrap"
 >
 <Sparkles className="w-4 h-4 fill-[#ffffff] shrink-0" />
 <span>
 {isThai ? 'บันทึกสไตล์และสร้างโปรไฟล์ (+150 คะแนน)' : 'SAVE STYLE & PROFILE (+150 EXP)'}
 </span>
 <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0" />
 </button>
 </div>
 </div>
 );
};
