/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Zap, Target, Crosshair, ArrowRight, Shield, User, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { PlayerTier } from '../../types';

export const A2_PlaystyleSetupScreen: React.FC = () => {
  const { player, updatePlayer, gainExp, navigateTo } = useApp();

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
    { id: 'Smash Mastery' as const, label: '⚡ อยากอัปเลเวลสายตบ (Max Power & Angle)' },
    { id: 'Lightning Footwork' as const, label: '👟 สปีดฟุตเวิร์กคล่องแคล่ว ทันทุกช็อต' },
    { id: 'Tactical Net Play' as const, label: '🎯 วางลูกหน้าเน็ตแม่นยำ ไม่เสียแต้มง่าย' },
    { id: 'Endurance' as const, label: '🫁 พลังปอดอึด ยืนระยะได้ครบ 3 เซต' },
  ];

  const TIERS: { tier: PlayerTier; label: string; desc: string }[] = [
    { tier: 'Bronze', label: 'มือใหม่ (Beginner / มือ N)', desc: 'เพิ่งเริ่มเล่น หรือหวดสัปดาห์ละ 1 ครั้ง' },
    { tier: 'Silver', label: 'ระดับกลาง (Intermediate / มือ S, P-)', desc: 'ตีเบสิกคล่อง เริ่มลงแข่งก๊วนประจำ' },
    { tier: 'Gold', label: 'ระดับสูง (Advanced / มือ P, P+)', desc: 'ทักษะแม่นยำ ฟุตเวิร์กดี แข่งทัวร์นาเมนต์' },
    { tier: 'Diamond', label: 'นักกีฬาลีก (Semi-Pro / มือ C, B)', desc: 'ทักษะแข่งขัน สปีดลูก 300+ km/h' },
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
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title="Athlete DNA & Playstyle" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Intro Banner Card */}
        <div className="bg-white border border-black rounded-[28px] p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffd731] border border-black text-[10px] font-black uppercase text-black">
              Character Setup
            </span>
            <span className="text-xs text-neutral-500 font-bold">+150 EXP Reward</span>
          </div>
          <h2 className="font-['Antonio'] text-3xl font-extrabold text-black uppercase tracking-tight leading-tight">
            CUSTOMIZE YOUR DNA
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5 font-medium">
            AI Coach will use your archetype to calculate your 5-axis skill radar and drills.
          </p>
        </div>

        {/* Player Name & Hand Card */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-3">
          <div>
            <label className="text-xs font-bold text-black block mb-1">
              Athlete Name (Display Name)
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-full bg-[#dceeff]/50 border border-black text-sm font-bold text-black outline-none focus:bg-white transition-colors"
              placeholder="Your Name..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-black block mb-1.5">
              Dominant Hand (มือข้างที่ถนัด)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHand('Right')}
                className={`py-2 px-3 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  hand === 'Right'
                    ? 'bg-black text-white border-black'
                    : 'bg-white hover:bg-neutral-100 text-black border-black'
                }`}
              >
                <span>ถนัดขวา (Right)</span>
                {hand === 'Right' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              <button
                type="button"
                onClick={() => setHand('Left')}
                className={`py-2 px-3 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  hand === 'Left'
                    ? 'bg-black text-white border-black'
                    : 'bg-white hover:bg-neutral-100 text-black border-black'
                }`}
              >
                <span>ถนัดซ้าย (Left)</span>
                {hand === 'Left' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Playstyle Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-black px-1 flex items-center gap-1.5 uppercase tracking-wide">
            <span>Playstyle Archetype (สไตล์การเล่น)</span>
          </label>

          <div className="grid grid-cols-1 gap-2">
            {PLAYSTYLES.map((style) => {
              const Icon = style.icon;
              const isSelected = playstyle === style.id;
              return (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => setPlaystyle(style.id)}
                  className={`w-full text-left p-3.5 rounded-[22px] border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'border-black scale-[1.01]'
                      : 'bg-white hover:bg-neutral-50 border-black/80'
                  }`}
                  style={{ backgroundColor: isSelected ? style.color : '#ffffff' }}
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-black flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-black stroke-[2.4]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-black">
                        {style.title}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-700 leading-tight mt-0.5">
                      {style.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Goal */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-2">
          <label className="text-xs font-bold text-black block mb-1">
            Primary Training Goal (เป้าหมายหลัก)
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {GOALS.map((g) => {
              const isSelected = goal === g.id;
              return (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`w-full text-left p-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#55db9c] border-black text-black'
                      : 'bg-white hover:bg-neutral-100 border-neutral-300 text-black'
                  }`}
                >
                  <span>{g.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier Ranking */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-2">
          <label className="text-xs font-bold text-black block mb-1">
            Skill Tier Ranking (ระดับฝีมือปัจจุบัน)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TIERS.map((t) => {
              const isSelected = selectedTier === t.tier;
              return (
                <button
                  type="button"
                  key={t.tier}
                  onClick={() => setSelectedTier(t.tier)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#ffd731] border-black text-black font-bold'
                      : 'bg-white hover:bg-neutral-50 border-neutral-300 text-black'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{t.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <p className="text-[10px] text-neutral-600 leading-tight">
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="px-4 pt-2">
        <button
          onClick={handleSaveAndContinue}
          className="w-full py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-sm border border-black flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer shadow-sm"
        >
          <span>Save Profile & Enter AI Coach</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
