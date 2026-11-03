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
      color: 'text-amber-500 bg-amber-50',
    },
    {
      id: 'Net Control Wizard' as const,
      title: 'สายหยอดคุมเชิง (Net Wizard)',
      desc: 'ควบคุมจังหวะ วางลูกเลียดเน็ต บีบให้คู่แข่งยกสูง',
      icon: Crosshair,
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      id: 'Defensive Wall' as const,
      title: 'สายรับกำแพงเหล็ก (Defensive Wall)',
      desc: 'เหนียวแน่น ดักทุกลูก สวนลูกดรายฟ์เปลี่ยนรับเป็นรุก',
      icon: Shield,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'All-Rounder' as const,
      title: 'สายสมดุลรอบด้าน (All-Rounder)',
      desc: 'เล่นได้ทุกตำแหน่ง วางลูกแม่นยำ ปรับเกมตามคู่แข่ง',
      icon: Target,
      color: 'text-purple-600 bg-purple-50',
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
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title="ตั้งค่าสไตล์การเล่น & DNA" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Intro */}
        <div className="px-1">
          <span className="text-[10px] font-bold tracking-wider text-[#0066ff] uppercase">
            CHARACTER CUSTOMIZATION
          </span>
          <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
            สร้าง DNA นักกีฬาของคุณ
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            AI Coach จะใช้สไตล์นี้คำนวณ Skill Radar และแผนฝึกซ้อมรายวัน
          </p>
        </div>

        {/* Player Name & Hand Card */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1.5">
              ชื่อนักกีฬา (Display Name)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="ระบุชื่อของคุณ..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1.5">
              มือข้างที่ถนัด (Dominant Hand)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHand('Right')}
                className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  hand === 'Right'
                    ? 'bg-[#111318] text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <span>ถนัดขวา (Right)</span>
                {hand === 'Right' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <button
                type="button"
                onClick={() => setHand('Left')}
                className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  hand === 'Left'
                    ? 'bg-[#111318] text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <span>ถนัดซ้าย (Left)</span>
                {hand === 'Left' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Playstyle Selector */}
        <div>
          <label className="text-xs font-bold text-neutral-800 block px-1 mb-2">
            สไตล์การเล่นหลัก (Primary Playstyle)
          </label>
          <div className="space-y-2">
            {PLAYSTYLES.map((ps) => {
              const Icon = ps.icon;
              const isSelected = playstyle === ps.id;
              return (
                <div
                  key={ps.id}
                  onClick={() => setPlaystyle(ps.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-white border-[#0066ff] ring-2 ring-[#0066ff]/20 shadow-sm'
                      : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${ps.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-extrabold text-neutral-900">
                      {ps.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {ps.desc}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#0066ff] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Goal Selector */}
        <div>
          <label className="text-xs font-bold text-neutral-800 block px-1 mb-2">
            เป้าหมายที่อยากพัฒนาเร็วที่สุด
          </label>
          <div className="space-y-2">
            {GOALS.map((g) => {
              const isSelected = goal === g.id;
              return (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`w-full p-3 rounded-2xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                    isSelected
                      ? 'bg-white border-[#d8ff00] ring-2 ring-[#d8ff00]/40 shadow-xs text-neutral-900'
                      : 'bg-white border-neutral-200/80 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <span>{g.label}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#d8ff00] text-black flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier Selector */}
        <div>
          <label className="text-xs font-bold text-neutral-800 block px-1 mb-2">
            ระดับฝีมือโดยประมาณ (Player Tier)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TIERS.map((t) => {
              const isSelected = selectedTier === t.tier;
              return (
                <button
                  type="button"
                  key={t.tier}
                  onClick={() => setSelectedTier(t.tier)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'bg-white border-neutral-200/80 text-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <div className="text-xs font-black">{t.tier}</div>
                  <div className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {t.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="px-5 pt-3 border-t border-neutral-200 bg-white">
        <button
          onClick={handleSaveAndContinue}
          className="w-full h-14 bg-[#111318] hover:bg-[#1f2430] active:scale-[0.98] rounded-full p-2 flex items-center justify-between shadow-lg transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#d8ff00] text-black flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-white font-extrabold text-xs tracking-wider uppercase">
            บันทึกโปรไฟล์ & เริ่มต้นใช้งาน (+150 EXP)
          </span>
          <div className="w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>
      </div>
    </div>
  );
};
