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
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title="โปรไฟล์นักกีฬา & ตู้เหรียญรางวัล" />

      {/* Profile Navigation Strip */}
      <div className="px-4 py-2 flex items-center gap-1.5 bg-slate-900/60 border-b border-slate-800 shrink-0">
        <button
          onClick={() => setActiveTab('card')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'card'
              ? 'bg-lime-400 text-slate-950 font-extrabold shadow-sm'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Player Card
        </button>

        <button
          onClick={() => setActiveTab('trophies')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'trophies'
              ? 'bg-lime-400 text-slate-950 font-extrabold shadow-sm'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          คลังเหรียญ ({player.badges.filter((b) => b.unlocked).length})
        </button>

        <button
          onClick={() => setActiveTab('gear')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'gear'
              ? 'bg-lime-400 text-slate-950 font-extrabold shadow-sm'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          อุปกรณ์ไม้แบด
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'card' && (
          <div className="space-y-4 flex flex-col items-center">
            {/* FIFA Style Athlete Identity Card */}
            <div className="w-full max-w-[310px] rounded-[30px] p-[2px] bg-gradient-to-b from-amber-400 via-lime-400 to-cyan-500 shadow-[0_12px_45px_rgba(204,255,0,0.25)]">
              <div className="w-full bg-gradient-to-b from-[#131b2e] via-[#0b101c] to-[#070a12] rounded-[28px] p-5 text-white relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-4xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-lime-200 to-lime-400 leading-none">
                      85
                    </div>
                    <div className="text-[10px] font-extrabold text-lime-400 tracking-wider">
                      OVR · SMASH HUNTER
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-amber-400/50 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black text-amber-400">DIAMOND</span>
                  </div>
                </div>

                <div className="my-3 flex flex-col items-center relative">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-lime-400/50 shadow-xl bg-slate-900">
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <h3 className="text-sm font-black text-white">{player.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Lv.{player.level} Court Master · มือ{player.dominantHand === 'Right' ? 'ขวา' : 'ซ้าย'}
                    </p>
                  </div>
                </div>

                {/* Radar Values Mini Grid */}
                <div className="grid grid-cols-5 gap-1 pt-2 border-t border-slate-800 text-center">
                  <div className="p-1 rounded-lg bg-slate-900/80">
                    <div className="text-xs font-black font-mono text-lime-400">88</div>
                    <div className="text-[8px] text-slate-400">POW</div>
                  </div>
                  <div className="p-1 rounded-lg bg-slate-900/80">
                    <div className="text-xs font-black font-mono text-lime-400">82</div>
                    <div className="text-[8px] text-slate-400">SPD</div>
                  </div>
                  <div className="p-1 rounded-lg bg-slate-900/80">
                    <div className="text-xs font-black font-mono text-lime-400">76</div>
                    <div className="text-[8px] text-slate-400">CTL</div>
                  </div>
                  <div className="p-1 rounded-lg bg-slate-900/80">
                    <div className="text-xs font-black font-mono text-lime-400">84</div>
                    <div className="text-[8px] text-slate-400">STA</div>
                  </div>
                  <div className="p-1 rounded-lg bg-slate-900/80">
                    <div className="text-xs font-black font-mono text-lime-400">90</div>
                    <div className="text-[8px] text-slate-400">TAC</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Stats Strip */}
            <div className="w-full grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-base font-black text-white font-mono">
                  {player.stats.totalMatches}
                </div>
                <div className="text-[9px] text-slate-400">แมตช์ทั้งหมด</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-base font-black text-lime-400 font-mono">
                  {player.stats.winRate}%
                </div>
                <div className="text-[9px] text-slate-400">อัตราชนะ (Win Rate)</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-base font-black text-amber-400 font-mono">
                  {player.stats.highestSmashSpeedKmh}
                </div>
                <div className="text-[9px] text-slate-400">Max ตบ (km/h)</div>
              </div>
            </div>

            {/* Smartwatch Companion Sync Shortcut Card */}
            <div
              onClick={() => navigateTo('F2')}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-400 flex items-center justify-center">
                  <Watch className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                    Wearable Companion
                  </span>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Apple Watch / Garmin Health Sync
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    ดึง Heart Rate และแคลอรี่แปลงเป็นโบนัส EXP
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}

        {/* Badges / Trophy Cabinet */}
        {activeTab === 'trophies' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-300">
              เหรียญเกียรติยศแห่งความสำเร็จ (Badges & Milestones):
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {player.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                    badge.unlocked
                      ? 'bg-[#0f1624] border-lime-400/40 shadow-sm'
                      : 'bg-slate-950/60 border-slate-900 opacity-55'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-lime-400/20 to-lime-500/10 text-lime-400 border-lime-400/40 shadow-[0_0_12px_rgba(204,255,0,0.2)]'
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}
                  >
                    <Award className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`text-xs font-extrabold ${badge.unlocked ? 'text-white' : 'text-slate-400'}`}>
                          {badge.name} ({badge.thaiName})
                        </h4>
                        <span className={`text-[8px] font-mono px-1 rounded uppercase font-bold ${
                          badge.rarity === 'Legendary'
                            ? 'bg-amber-400/20 text-amber-400'
                            : badge.rarity === 'Epic'
                            ? 'bg-purple-400/20 text-purple-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {badge.rarity}
                        </span>
                      </div>
                      {badge.unlocked && (
                        <span className="text-[9px] text-lime-400 font-mono font-bold">
                          UNLOCKED
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {badge.description}
                    </p>

                    <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span>ความคืบหน้า: {badge.progress}/{badge.maxProgress}</span>
                      {badge.unlockedAt && <span>{badge.unlockedAt}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gear / Racket Equipment Locker */}
        {activeTab === 'gear' && (
          <div className="space-y-3">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              <img
                src="/src/assets/images/badminton_gear_showcase_1793695158333.jpg"
                alt="Badminton Racket Gear"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute bottom-2.5 left-3 text-white">
                <span className="text-[10px] font-mono text-lime-400 font-bold uppercase">
                  Primary Weapon
                </span>
                <h3 className="text-sm font-black">{player.racket.model}</h3>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">รุ่นไม้แบดมินตัน:</span>
                <span className="font-bold text-white">{player.racket.model}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">น้ำหนัก / ด้ามจับ:</span>
                <span className="font-mono text-white">{player.racket.weightGrip}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">ความตึงเอ็น (Tension):</span>
                <span className="font-mono text-lime-400 font-bold">{player.racket.stringTension}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">ชนิดเอ็น:</span>
                <span className="text-white">{player.racket.stringType}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-4 pt-2 shrink-0">
        <button
          onClick={() => navigateTo('F2')}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-black text-sm shadow-[0_4px_16px_rgba(6,182,212,0.3)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Watch className="w-4 h-4 stroke-[2.5]" />
          <span>เชื่อมต่อ Smartwatch & ดึงแคลอรี่ (+EXP โบนัส)</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
