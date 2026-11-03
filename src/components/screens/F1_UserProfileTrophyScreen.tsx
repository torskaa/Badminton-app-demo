/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Trophy, Zap, Flame, Shield, Watch, ChevronRight, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const F1_UserProfileTrophyScreen: React.FC = () => {
  const { player, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'card' | 'trophies' | 'gear'>('card');

  return (
    <div className="flex-1 flex flex-col bg-[#f0f4f9] text-neutral-900 select-none pb-24 overflow-y-auto no-scrollbar">
      <MobileHeader title="โปรไฟล์นักกีฬา & ตู้เหรียญรางวัล" />

      {/* Segmented Tab Bar */}
      <div className="px-5 py-3 flex items-center gap-2 bg-white border-b border-neutral-200/80 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('card')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'card'
              ? 'bg-[#111318] text-white shadow-xs'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
          }`}
        >
          Player Card
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trophies')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'trophies'
              ? 'bg-[#111318] text-white shadow-xs'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
          }`}
        >
          เหรียญ ({player.badges.filter((b) => b.unlocked).length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gear')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'gear'
              ? 'bg-[#111318] text-white shadow-xs'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
          }`}
        >
          ไม้ & เอ็น
        </button>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'card' && (
          <div className="space-y-4 flex flex-col items-center">
            {/* FIFA Style Athlete Identity Card */}
            <div className="w-full max-w-[310px] rounded-[34px] p-[3px] bg-gradient-to-b from-[#d8ff00] via-cyan-400 to-[#0066ff] shadow-xl">
              <div className="w-full bg-[#111318] rounded-[31px] p-5 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#d8ff00]/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-4xl font-black font-mono tracking-tight text-[#d8ff00] leading-none">
                      85
                    </div>
                    <div className="text-[11px] font-extrabold text-[#d8ff00] tracking-wider mt-1">
                      OVR · SMASH
                    </div>
                    <div className="text-[9px] font-mono text-neutral-400">
                      DIAMOND LEAGUE
                    </div>
                  </div>

                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80"
                    alt="Player Avatar"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                  />
                </div>

                <div className="text-center mt-3 pt-2 border-t border-white/10">
                  <h3 className="text-lg font-black tracking-tight text-white uppercase">
                    {player.name}
                  </h3>
                  <p className="text-[10px] text-[#d8ff00] font-bold">
                    {player.playstyle}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
                  <div>
                    <div className="text-[9px] text-neutral-400">POW</div>
                    <div className="text-xs font-black font-mono text-[#d8ff00]">{player.skillRadar.power}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-400">SPD</div>
                    <div className="text-xs font-black font-mono text-white">{player.skillRadar.speed}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-400">CTL</div>
                    <div className="text-xs font-black font-mono text-white">{player.skillRadar.control}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wearable Sync Callout */}
            <div
              onClick={() => navigateTo('F2')}
              className="w-full max-w-[310px] p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs cursor-pointer hover:border-[#0066ff] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                  <Watch className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-neutral-900">
                    Apple Watch & Garmin Sync
                  </div>
                  <div className="text-[10px] text-neutral-500 font-medium">
                    แปลงแคลอรี 480 kcal เป็น +240 EXP
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </div>
        )}

        {activeTab === 'trophies' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {player.badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-3xl border transition-all flex flex-col justify-between shadow-xs ${
                    b.unlocked
                      ? 'bg-white border-neutral-200/80'
                      : 'bg-neutral-100 border-neutral-200/50 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                        {b.rarity}
                      </span>
                    </div>

                    <h5 className="text-xs font-extrabold text-neutral-900">
                      {b.name}
                    </h5>
                    <p className="text-[10px] text-neutral-500 mt-0.5 font-medium leading-relaxed">
                      {b.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] font-bold">
                    <span className={b.unlocked ? 'text-[#10b981]' : 'text-neutral-400'}>
                      {b.unlocked ? '✓ ปลดล็อกแล้ว' : `${b.progress}/${b.maxProgress}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gear' && (
          <div className="p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
              สเปกอุปกรณ์ไม้แบด (Racket & String Spec)
            </h4>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-medium">รุ่นไม้แบด:</span>
                <span className="text-xs font-extrabold text-neutral-900">{player.racket.model}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-medium">น้ำหนัก / กริป:</span>
                <span className="text-xs font-extrabold text-neutral-900 font-mono">{player.racket.weightGrip}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-medium">ความตึงเอ็น:</span>
                <span className="text-xs font-black text-[#0066ff] font-mono">{player.racket.stringTension}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-medium">ประเภทเอ็น:</span>
                <span className="text-xs font-extrabold text-neutral-900">{player.racket.stringType}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
