import React, { useState } from 'react';
import { Award, Trophy, Zap, Flame, Shield, Watch, ChevronRight, Sparkles, RefreshCw, Layers, Calendar, Crosshair } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const F1_UserProfileTrophyScreen: React.FC = () => {
  const { player, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'card' | 'trophies' | 'gear'>('card');

  return (
    <div className="flex-1 flex flex-col bg-[#dceeff] text-black select-none pb-24 overflow-y-auto no-scrollbar">
      <MobileHeader title="โปรไฟล์นักกีฬา & ตู้เหรียญรางวัล" />

      {/* Segmented Tab Bar - Slush Sticker Pills */}
      <div className="px-5 py-3 flex items-center gap-2 bg-[#dceeff] shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('card')}
          className={`flex-1 py-2 rounded-full text-xs font-['Antonio',sans-serif] font-black uppercase tracking-wider transition-all cursor-pointer border-[1.5px] border-black ${
            activeTab === 'card'
              ? 'bg-black text-[#ffd731]'
              : 'bg-white text-black hover:bg-white/80'
          }`}
        >
          PLAYER CARD
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trophies')}
          className={`flex-1 py-2 rounded-full text-xs font-['Antonio',sans-serif] font-black uppercase tracking-wider transition-all cursor-pointer border-[1.5px] border-black ${
            activeTab === 'trophies'
              ? 'bg-black text-[#ffd731]'
              : 'bg-white text-black hover:bg-white/80'
          }`}
        >
          เหรียญ ({player.badges.filter((b) => b.unlocked).length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gear')}
          className={`flex-1 py-2 rounded-full text-xs font-['Antonio',sans-serif] font-black uppercase tracking-wider transition-all cursor-pointer border-[1.5px] border-black ${
            activeTab === 'gear'
              ? 'bg-black text-[#ffd731]'
              : 'bg-white text-black hover:bg-white/80'
          }`}
        >
          ไม้ & เอ็น
        </button>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'card' && (
          <div className="space-y-4 flex flex-col items-center">
            {/* Slush Athlete Identity Trading Card */}
            <div className="w-full max-w-[320px] rounded-[32px] p-4 bg-[#ffd731] border-[2px] border-black text-black relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-5xl font-['Antonio',sans-serif] font-black tracking-tight leading-none text-black">
                    85
                  </div>
                  <div className="text-[11px] font-['Antonio',sans-serif] font-black text-black tracking-wider mt-1 uppercase">
                    OVR · SMASH PRO
                  </div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-black text-[#ffd731] font-mono text-[9px] font-black">
                    DIAMOND LEAGUE
                  </span>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80"
                  alt="Player Avatar"
                  className="w-18 h-18 rounded-2xl object-cover border-[1.5px] border-black bg-white"
                />
              </div>

              <div className="text-center mt-3 pt-2 border-t-[1.5px] border-black">
                <h3 className="text-2xl font-['Antonio',sans-serif] font-black tracking-tight text-black uppercase">
                  {player.name}
                </h3>
                <p className="text-xs font-extrabold text-black/80">
                  สไตล์การเล่น: {player.playstyle}
                </p>
              </div>

              {/* Stat Pills */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t-[1.5px] border-black text-center">
                <div className="p-2 rounded-2xl bg-white border border-black">
                  <div className="text-[9px] font-black uppercase text-black/60 font-mono">POW</div>
                  <div className="text-base font-['Antonio',sans-serif] font-black text-black">
                    {player.skillRadar.power}
                  </div>
                </div>
                <div className="p-2 rounded-2xl bg-white border border-black">
                  <div className="text-[9px] font-black uppercase text-black/60 font-mono">SPD</div>
                  <div className="text-base font-['Antonio',sans-serif] font-black text-black">
                    {player.skillRadar.speed}
                  </div>
                </div>
                <div className="p-2 rounded-2xl bg-white border border-black">
                  <div className="text-[9px] font-black uppercase text-black/60 font-mono">CTL</div>
                  <div className="text-base font-['Antonio',sans-serif] font-black text-black">
                    {player.skillRadar.control}
                  </div>
                </div>
              </div>
            </div>

            {/* Wearable Sync Callout */}
            <div
              onClick={() => navigateTo('F2')}
              className="w-full max-w-[320px] p-4 rounded-[28px] bg-white border-[1.5px] border-black cursor-pointer hover:bg-[#e9ccff] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#4da2ff] border border-black text-white flex items-center justify-center font-bold">
                  <Watch className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-black font-['Antonio',sans-serif]">
                    APPLE WATCH & GARMIN SYNC
                  </div>
                  <div className="text-[10px] text-black/70 font-bold">
                    แปลงแคลอรี 480 kcal เป็น +240 EXP
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-black" />
            </div>

            {/* Quick Action Buttons */}
            <div className="w-full max-w-[320px] grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigateTo('D1')}
                className="p-3 rounded-[24px] bg-[#55db9c] border-[1.5px] border-black font-['Antonio',sans-serif] font-black text-xs uppercase flex items-center justify-center gap-1.5 hover:bg-[#6ef5b4] active:scale-95 cursor-pointer text-black"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>AI COACH RADAR</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('B1')}
                className="p-3 rounded-[24px] bg-[#ffd731] border-[1.5px] border-black font-['Antonio',sans-serif] font-black text-xs uppercase flex items-center justify-center gap-1.5 hover:bg-[#ffe366] active:scale-95 cursor-pointer text-black"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>จองสนามแบด</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'trophies' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {player.badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-[28px] border-[1.5px] border-black transition-all flex flex-col justify-between ${
                    b.unlocked
                      ? 'bg-white'
                      : 'bg-white/60 opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-2xl bg-[#ffd731] border border-black text-black flex items-center justify-center font-bold">
                        <Award className="w-5 h-5 text-black" />
                      </div>
                      <span className="text-[9px] font-['Antonio',sans-serif] font-black uppercase px-2 py-0.5 rounded-full bg-black text-[#ffd731]">
                        {b.rarity}
                      </span>
                    </div>

                    <h5 className="text-xs font-black text-black font-['Antonio',sans-serif] uppercase tracking-wide">
                      {b.name}
                    </h5>
                    <p className="text-[10px] text-black/80 mt-1 font-bold leading-relaxed">
                      {b.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t-[1.5px] border-black flex items-center justify-between text-[10px] font-black">
                    <span className={b.unlocked ? 'text-[#fb4903]' : 'text-black/50'}>
                      {b.unlocked ? '✓ ปลดล็อกแล้ว (+100 EXP)' : `${b.progress}/${b.maxProgress}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gear' && (
          <div className="p-5 rounded-[28px] bg-white border-[1.5px] border-black space-y-4">
            <h4 className="text-xs font-['Antonio',sans-serif] font-black text-black uppercase tracking-wider">
              สเปกอุปกรณ์ไม้แบด (RACKET & STRING SPEC)
            </h4>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#dceeff] border border-black flex items-center justify-between">
                <span className="text-xs text-black/70 font-bold">รุ่นไม้แบด:</span>
                <span className="text-xs font-black text-black">{player.racket.model}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#dceeff] border border-black flex items-center justify-between">
                <span className="text-xs text-black/70 font-bold">น้ำหนัก / กริป:</span>
                <span className="text-xs font-black text-black font-mono">{player.racket.weightGrip}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#dceeff] border border-black flex items-center justify-between">
                <span className="text-xs text-black/70 font-bold">ความตึงเอ็น:</span>
                <span className="text-xs font-black text-[#5c4ade] font-mono">{player.racket.stringTension}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#dceeff] border border-black flex items-center justify-between">
                <span className="text-xs text-black/70 font-bold">ประเภทเอ็น:</span>
                <span className="text-xs font-black text-black">{player.racket.stringType}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

