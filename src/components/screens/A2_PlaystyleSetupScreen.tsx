/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Zap, Target, Crosshair, ArrowRight, Sparkles, Shield, User } from 'lucide-react';
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
      accent: 'border-lime-400 text-lime-400 bg-lime-400/10',
    },
    {
      id: 'Net Control Wizard' as const,
      title: 'สายหยอดคุมเชิง (Net Wizard)',
      desc: 'ควบคุมจังหวะ วางลูกเลียดเน็ต บีบให้คู่แข่งยกสูง',
      icon: Crosshair,
      accent: 'border-cyan-400 text-cyan-400 bg-cyan-400/10',
    },
    {
      id: 'Defensive Wall' as const,
      title: 'สายรับกำแพงเหล็ก (Defensive Wall)',
      desc: 'เหนียวแน่น ดักทุกลูก สวนลูกดรายฟ์เปลี่ยนรับเป็นรุก',
      icon: Shield,
      accent: 'border-amber-400 text-amber-400 bg-amber-400/10',
    },
    {
      id: 'All-Rounder' as const,
      title: 'สายสมดุลรอบด้าน (All-Rounder)',
      desc: 'เล่นได้ทุกตำแหน่ง วางลูกแม่นยำ ปรับเกมตามคู่แข่ง',
      icon: Target,
      accent: 'border-purple-400 text-purple-400 bg-purple-400/10',
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
    // Award 150 EXP for completing profile setup
    gainExp(150, 'สร้างโปรไฟล์และตั้งค่าสไตล์การเล่นสำเร็จ');
    navigateTo('D1');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title="ตั้งค่าตัวละคร & สไตล์การเล่น" showBack />

      <div className="p-4 space-y-5 flex-1 overflow-y-auto no-scrollbar">
        {/* Intro */}
        <div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-lime-400 uppercase">
            PATH A2 · Character Creation
          </span>
          <h2 className="text-lg font-black text-white mt-0.5">
            สร้าง DNA นักกีฬาแบดมินตันของคุณ
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            AI Coach จะใช้ข้อมูลนี้ในการปรับจูนคำแนะนำ แบบฝึกซ้อม และการวิเคราะห์จุดอ่อน
          </p>
        </div>

        {/* Player Name & Dominant Hand */}
        <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
              ชื่อนักกีฬา / ฉายาในคอร์ท
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700">
              <User className="w-4 h-4 text-lime-400" />
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none flex-1 font-semibold"
                placeholder="ชื่อของคุณ..."
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
              มือข้างที่ถนัด (Dominant Hand)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHand('Right')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  hand === 'Right'
                    ? 'bg-lime-400 text-slate-950 border-lime-400 shadow-[0_0_12px_rgba(204,255,0,0.4)]'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>ถนัดขวา (Right)</span>
                {hand === 'Right' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              <button
                type="button"
                onClick={() => setHand('Left')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  hand === 'Left'
                    ? 'bg-lime-400 text-slate-950 border-lime-400 shadow-[0_0_12px_rgba(204,255,0,0.4)]'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
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
          <label className="text-xs font-bold text-white flex items-center justify-between">
            <span>สไตล์การเล่นหลัก (Primary Playstyle)</span>
            <span className="text-[10px] text-lime-400 font-mono">ส่งผลต่อ Skill Radar</span>
          </label>

          <div className="grid grid-cols-1 gap-2">
            {PLAYSTYLES.map((style) => {
              const Icon = style.icon;
              const isSelected = playstyle === style.id;
              return (
                <div
                  key={style.id}
                  onClick={() => setPlaystyle(style.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-slate-900 border-lime-400 ring-1 ring-lime-400/50 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${style.accent}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">
                        {style.title}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {style.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Tier Self-Assessment */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white block">
            ประเมินระดับฝีมือเริ่มต้น (Skill Tier League)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TIERS.map((item) => {
              const isSelected = selectedTier === item.tier;
              return (
                <button
                  type="button"
                  key={item.tier}
                  onClick={() => setSelectedTier(item.tier)}
                  className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-amber-400/80 ring-1 ring-amber-400/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[11px] font-black ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                      {item.tier}
                    </span>
                    {isSelected && <span className="text-[9px] text-amber-400 font-bold">ACTIVE</span>}
                  </div>
                  <p className="text-[10px] text-slate-300 font-medium leading-tight">
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Goal */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white block">
            เป้าหมายที่ต้องการพัฒนาอันดับ 1
          </label>
          <div className="space-y-1.5">
            {GOALS.map((g) => {
              const isSelected = goal === g.id;
              return (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`w-full py-2 px-3 rounded-xl text-left border text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-lime-400/10 border-lime-400/60 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{g.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Action */}
      <div className="px-4 pt-2 shrink-0">
        <button
          onClick={handleSaveAndContinue}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 font-black text-sm shadow-[0_4px_20px_rgba(204,255,0,0.35)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>บันทึก & เข้าสู่ AI Dashboard (+150 EXP)</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
