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

 const [hand, setHand] = useState<'Right' | 'Left'>(player.dominantHand);
 const [playstyle, setPlaystyle] = useState(player.playstyle);
 const [goal, setGoal] = useState(player.primaryGoal);
 const [selectedTier, setSelectedTier] = useState<PlayerTier>(player.tier);
 const [playerName, setPlayerName] = useState(player.name);

 const PLAYSTYLES = [
 {
 id: 'Attacking Smash Hunter' as const,
 title: 'สายตบพิฆาต (Smash Hunter)',
 desc: 'เน้นบุกต่อเนื่อง จัมป์ตบหนักหน่วง ตัดสินแต้มเร็ว',
 icon: Zap,
 color: '#ffd731',
 },
 {
 id: 'Net Control Wizard' as const,
 title: 'สายหยอดคุมเชิง (Net Wizard)',
 desc: 'ควบคุมจังหวะ วางลูกเลียดเน็ต บีบให้คู่แข่งยกสูง',
 icon: Crosshair,
 color: '#4da2ff',
 },
 {
 id: 'Defensive Wall' as const,
 title: 'สายรับกำแพงเหล็ก (Defensive Wall)',
 desc: 'เหนียวแน่น ดักทุกลูก สวนลูกดรายฟ์เปลี่ยนรับเป็นรุก',
 icon: Shield,
 color: '#55db9c',
 },
 {
 id: 'All-Rounder' as const,
 title: 'สายสมดุลรอบด้าน (All-Rounder)',
 desc: 'เล่นได้ทุกตำแหน่ง วางลูกแม่นยำ ปรับเกมตามคู่แข่ง',
 icon: Target,
 color: '#e9ccff',
 },
 ];

 const GOALS = [
 { id: 'Smash Mastery' as const, label: '⚡ อัปสปีดลูกตบ (Power & Angle)' },
 { id: 'Lightning Footwork' as const, label: '👟 สปีดฟุตเวิร์กคล่องแคล่ว ทันทุกช็อต' },
 { id: 'Tactical Net Play' as const, label: '🎯 วางลูกหน้าเน็ตแม่นยำ ไม่เสียแต้มง่าย' },
 { id: 'Endurance' as const, label: '🫁 พลังปอดอึด ยืนระยะได้ครบ 3 เซต' },
 ];

 const TIERS: { tier: PlayerTier; label: string; desc: string }[] = [
 { tier: 'Bronze', label: 'มือใหม่ (Beginner / N)', desc: 'หวดสัปดาห์ละ 1 ครั้ง' },
 { tier: 'Silver', label: 'ระดับกลาง (Intermediate / S, P-)', desc: 'ก๊วนประจำ ตีเบสิกคล่อง' },
 { tier: 'Gold', label: 'ระดับสูง (Advanced / P, P+)', desc: 'ทักษะแข่งขัน ฟุตเวิร์กดี' },
 { tier: 'Diamond', label: 'นักกีฬาลีก (Semi-Pro / C, B)', desc: 'ทัวร์นาเมนต์ สปีด 300+ km/h' },
 ];

 const handleSaveAndContinue = () => {
 updatePlayer({
 name: playerName,
 dominantHand: hand,
 playstyle,
 primaryGoal: goal,
 tier: selectedTier,
 });
 gainExp(150, 'สร้างโปรไฟล์และตั้งค่าสไตล์การเล่นสำเร็จ');
 navigateTo('D1');
 };

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000]  overflow-hidden">
 <MobileHeader
 title={language === 'th' ? 'ตั้งค่า DNA นักกีฬา' : 'ATHLETE DNA SETUP'}
 subtitle={language === 'th' ? 'สร้างสไตล์การเล่นและสายความถนัด' : 'Custom Playstyle Archetype'}
 showBack
 />

 <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16">
 {/* Intro Card */}
 <div className="p-4 rounded-[28px] bg-[#ffffff] space-y-1">
 <div className="flex items-center gap-2 mb-1">
 <span className="px-3 py-1 rounded-[1600px] bg-[#ffd731] text-[#000000] text-[10px] font-bold tracking-[0.032em] uppercase">
 {language === 'th' ? 'ตั้งค่าตัวละคร' : 'Character Setup'}
 </span>
 <span className="text-xs text-[#000000]/70 font-bold">+150 EXP Reward</span>
 </div>
 <h2 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight text-[#000000] leading-tight">
 {language === 'th' ? 'สร้างสไตล์ DNA นักกีฬาเฉพาะตัว' : 'CUSTOMIZE YOUR ATHLETE DNA'}
 </h2>
 <p className="text-xs text-[#000000]/70 mt-1 font-medium leading-relaxed">
 {language === 'th'
 ? 'ระบบจะนำ Archetype นี้ไปวิเคราะห์เรดาร์ทักษะ 5 มิติ แนะนำคู่ซ้อม และจัด Drills ฝึกฝน'
 : 'Your archetype directly shapes your 5-axis skill radar, sparring recommendations, and custom drills.'}
 </p>
 </div>

 {/* Player Name & Hand */}
 <div className="p-4 rounded-[28px] bg-[#ffffff] space-y-3">
 <div>
 <label className="text-[11px] font-bold uppercase tracking-[0.032em] block mb-1.5 text-[#000000]/70">
 Player Handle / ชื่อนักกีฬา
 </label>
 <div className="relative">
 <input
 type="text"
 value={playerName}
 onChange={(e) => setPlayerName(e.target.value)}
 placeholder="เช่น Shuttle King, Beam BWF"
 className="w-full px-4 py-2.5 rounded-[1600px] text-xs font-bold tracking-[0.032em] bg-[#ffffff] text-[#000000] focus:outline-none"
 />
 <User className="w-4 h-4 absolute right-3.5 top-3 text-[#000000]/40" />
 </div>
 </div>

 <div>
 <label className="text-[11px] font-bold uppercase tracking-[0.032em] block mb-1.5 text-[#000000]/70">
 Dominant Hand / มือข้างที่ถนัด
 </label>
 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => setHand('Right')}
 className={`py-2.5 px-3 rounded-[1600px] text-xs font-bold tracking-[0.032em] transition-transform active:scale-95 cursor-pointer border border-[#000000] ${
 hand === 'Right'
 ? 'bg-[#ffd731] text-[#000000]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 🖐️ Right-Handed (มือขวา)
 </button>
 <button
 type="button"
 onClick={() => setHand('Left')}
 className={`py-2.5 px-3 rounded-[1600px] text-xs font-bold tracking-[0.032em] transition-transform active:scale-95 cursor-pointer border border-[#000000] ${
 hand === 'Left'
 ? 'bg-[#ffd731] text-[#000000]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 🤚 Left-Handed (มือซ้าย)
 </button>
 </div>
 </div>
 </div>

 {/* 4 Archetype Cards (Multi-color sticker cards with 1px black outline) */}
 <div className="space-y-2.5">
 <label className="text-[11px] font-bold uppercase tracking-[0.032em] block px-1 text-[#000000]/70">
 Playstyle Archetype / สไตล์การเล่น
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
 ? 'bg-[#ffd731] text-[#000000]'
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
 Target Focus / เป้าหมายหลักที่ต้องการพัฒนา
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
 ? 'bg-[#55db9c] text-[#000000]'
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
 Self-Assessed Skill Level / ระดับฝีมือปัจจุบัน
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
 ? 'bg-[#e9ccff] text-[#000000]'
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
 className="w-full py-3.5 px-4 rounded-[1600px] bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 border border-[#000000] transition-transform active:scale-98 cursor-pointer"
 >
 <Sparkles className="w-4 h-4 fill-[#ffffff]" />
 <span>
 {language === 'th' ? 'บันทึก DNA และสร้างเรดาร์ทักษะ (+150 EXP)' : 'SAVE DNA & BUILD SKILL RADAR (+150 EXP)'}
 </span>
 <ArrowRight className="w-4 h-4 stroke-[2.5]" />
 </button>
 </div>
 </div>
 );
};
