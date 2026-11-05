import React, { useState } from 'react';
import { Award, Trophy, Zap, Watch, ChevronRight, Calendar, Crosshair, QrCode, UserCog, Crown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { ProSubscriptionModal } from '../common/ProSubscriptionModal';
import { playCoinSound } from '../../utils/retroAudio';

export const F1_UserProfileTrophyScreen: React.FC = () => {
  const { player, navigateTo, booking } = useApp();
  const [activeTab, setActiveTab] = useState<'card' | 'trophies' | 'gear'>('card');
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28 font-['Plus_Jakarta_Sans',sans-serif] bg-[#dceeff] text-[#000000]">
      <MobileHeader title="โปรไฟล์นักกีฬา & ตู้เหรียญรางวัล" />

      {/* Segmented Tab Bar (Paper white with 1px black border, 1600px pills) */}
      <div className="px-5 py-3 flex items-center gap-2 border-b border-[#000000] bg-[#ffffff] shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('card')}
          className={`flex-1 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] transition-all cursor-pointer border border-[#000000] ${
            activeTab === 'card'
              ? 'bg-[#000000] text-[#ffffff]'
              : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
          }`}
        >
          PLAYER CARD
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trophies')}
          className={`flex-1 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] transition-all cursor-pointer border border-[#000000] ${
            activeTab === 'trophies'
              ? 'bg-[#000000] text-[#ffffff]'
              : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
          }`}
        >
          เหรียญ ({player.badges.filter((b) => b.unlocked).length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gear')}
          className={`flex-1 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] transition-all cursor-pointer border border-[#000000] ${
            activeTab === 'gear'
              ? 'bg-[#000000] text-[#ffffff]'
              : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
          }`}
        >
          ไม้ & เอ็น
        </button>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'card' && (
          <div className="space-y-3.5 flex flex-col items-center">
            {/* Athlete Identity Trading Card (Gold / Sunburst finish with 1px solid black border) */}
            <div className="w-full max-w-[340px] rounded-[32px] bg-[#ffd731] border-2 border-[#000000] p-4 text-[#000000]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-['Antonio',sans-serif] text-6xl font-black leading-none">
                    85
                  </div>
                  <div className="text-[11px] font-bold tracking-[0.032em] uppercase mt-0.5">
                    OVR · SMASH PRO
                  </div>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[9px] font-bold tracking-[0.032em]">
                    DIAMOND LEAGUE
                  </span>
                </div>

                <img
                  src={player.avatarUrl}
                  alt="Player Avatar"
                  className="w-16 h-16 rounded-[20px] object-cover border border-[#000000] bg-[#ffffff]"
                />
              </div>

              <div className="text-center mt-3 pt-2.5 border-t border-[#000000]/20">
                <h3 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight text-[#000000]">
                  {player.name}
                </h3>
                <p className="text-xs text-[#000000]/80 font-bold">
                  สไตล์การเล่น: {player.playstyle}
                </p>
              </div>

              {/* Stat Pills */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-[#000000]/20 text-center">
                <div className="p-2 rounded-[16px] bg-[#ffffff] border border-[#000000]">
                  <div className="text-[9px] font-bold uppercase text-[#000000]/60 tracking-[0.032em]">POW</div>
                  <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000]">
                    {player.skillRadar.power}
                  </div>
                </div>
                <div className="p-2 rounded-[16px] bg-[#ffffff] border border-[#000000]">
                  <div className="text-[9px] font-bold uppercase text-[#000000]/60 tracking-[0.032em]">SPD</div>
                  <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000]">
                    {player.skillRadar.speed}
                  </div>
                </div>
                <div className="p-2 rounded-[16px] bg-[#ffffff] border border-[#000000]">
                  <div className="text-[9px] font-bold uppercase text-[#000000]/60 tracking-[0.032em]">CTL</div>
                  <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000]">
                    {player.skillRadar.control}
                  </div>
                </div>
              </div>
            </div>

            {/* My Active Booking Pass (Real User Flow) */}
            <div
              onClick={() => navigateTo('B4')}
              className="w-full max-w-[340px] p-4 rounded-[28px] bg-[#ffffff] border border-[#000000] cursor-pointer hover:bg-[#e9ccff] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[1600px] bg-[#55db9c] border border-[#000000] flex items-center justify-center font-bold text-[#000000]">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
                    บัตรเข้าคอร์ทของฉัน (MY ACTIVE PASS)
                  </div>
                  <div className="text-[10px] text-[#000000]/70 font-bold">
                    {booking.court?.name || 'สแมช อารีน่า พระราม 9'} · คอร์ท {booking.selectedCourtNumber || 3}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#000000]" />
            </div>

            {/* Wearable Sync Callout */}
            <div
              onClick={() => navigateTo('F2')}
              className="w-full max-w-[340px] p-4 rounded-[28px] bg-[#ffffff] border border-[#000000] cursor-pointer hover:bg-[#ffd731] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[1600px] bg-[#4da2ff] border border-[#000000] flex items-center justify-center font-bold text-[#000000]">
                  <Watch className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
                    APPLE WATCH & GARMIN SYNC
                  </div>
                  <div className="text-[10px] text-[#000000]/70 font-bold">
                    อัตราเต้นหัวใจ 164 BPM · แปลง 480 kcal เป็น +240 EXP
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#000000]" />
            </div>

            {/* Edit DNA & Settings */}
            <div
              onClick={() => navigateTo('A2')}
              className="w-full max-w-[340px] p-4 rounded-[28px] bg-[#ffffff] border border-[#000000] cursor-pointer hover:bg-[#e9e9e9] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[1600px] bg-[#e9ccff] border border-[#000000] flex items-center justify-center font-bold text-[#000000]">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
                    แก้ไข ATHLETE DNA & สไตล์การเล่น
                  </div>
                  <div className="text-[10px] text-[#000000]/70 font-bold">
                    ปรับสายตบ, มือกุมแร็กเก็ต, และเป้าหมายฝึกฝน
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#000000]" />
            </div>

            {/* Pro Membership Monetization Shortcut */}
            <div
              onClick={() => {
                setIsProModalOpen(true);
                playCoinSound();
              }}
              className="w-full max-w-[340px] p-4 rounded-[28px] bg-[#ffd731] border border-[#000000] cursor-pointer hover:bg-[#ffe266] transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-[1600px] bg-[#000000] text-[#ffd731] flex items-center justify-center font-bold shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000] truncate">
                    {player.tier === 'Pro' ? 'SMASHAI PRO MEMBER' : 'SMASHAI PRO MEMBER'}
                  </div>
                  <div className="text-[10px] text-[#000000]/80 font-bold truncate">
                    ลดค่าคอร์ท 10% · สแกน 3D ไม่จำกัด (฿199/ด.)
                  </div>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[10px] font-bold tracking-[0.032em] uppercase shrink-0 whitespace-nowrap">
                {player.tier === 'Pro' ? 'ACTIVE' : 'UPGRADE'}
              </span>
            </div>

            {/* Quick Action Buttons (Black fill and outlined black) */}
            <div className="w-full max-w-[340px] grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigateTo('D1')}
                className="p-3 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#ffffff] text-[#000000] border border-[#000000] hover:bg-[#e9e9e9] whitespace-nowrap"
              >
                <Crosshair className="w-3.5 h-3.5 text-[#5c4ade]" />
                <span>AI COACH RADAR</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('B1')}
                className="p-3 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#000000] text-[#ffffff] border border-[#000000] hover:bg-[#1a1a1a] whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>BOOK COURTS</span>
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
                  className={`p-4 rounded-[28px] border border-[#000000] transition-all flex flex-col justify-between ${
                    b.unlocked ? 'bg-[#ffffff]' : 'bg-[#cccccc]/40 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-[1600px] bg-[#ffd731] border border-[#000000] text-[#000000] flex items-center justify-center font-bold">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.032em] px-2.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000]">
                        {b.rarity}
                      </span>
                    </div>

                    <h5 className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wide text-[#000000]">
                      {b.name}
                    </h5>
                    <p className="text-[10px] text-[#000000]/70 mt-1 font-medium leading-relaxed">
                      {b.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#000000]/20 flex items-center justify-between text-[10px] font-bold">
                    <span className={b.unlocked ? 'text-[#000000]' : 'text-[#000000]/50'}>
                      {b.unlocked ? '✓ ปลดล็อกแล้ว (+100 EXP)' : `${b.progress}/${b.maxProgress}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gear' && (
          <div className="p-5 rounded-[28px] bg-[#ffffff] border border-[#000000] space-y-4">
            <h4 className="font-['Antonio',sans-serif] text-base font-black uppercase tracking-wider text-[#000000]">
              สเปกอุปกรณ์ไม้แบด (RACKET & STRING SPEC)
            </h4>

            <div className="space-y-2.5">
              <div className="p-3 rounded-[20px] bg-[#dceeff] border border-[#000000] flex items-center justify-between">
                <span className="text-xs text-[#000000]/70 font-bold">รุ่นไม้แบด:</span>
                <span className="text-xs font-bold font-mono">{player.racket.model}</span>
              </div>
              <div className="p-3 rounded-[20px] bg-[#dceeff] border border-[#000000] flex items-center justify-between">
                <span className="text-xs text-[#000000]/70 font-bold">น้ำหนัก / กริป:</span>
                <span className="text-xs font-bold font-mono">{player.racket.weightGrip}</span>
              </div>
              <div className="p-3 rounded-[20px] bg-[#dceeff] border border-[#000000] flex items-center justify-between">
                <span className="text-xs text-[#000000]/70 font-bold">ความตึงเอ็น:</span>
                <span className="text-xs font-bold text-[#5c4ade] font-mono">{player.racket.stringTension}</span>
              </div>
              <div className="p-3 rounded-[20px] bg-[#dceeff] border border-[#000000] flex items-center justify-between">
                <span className="text-xs text-[#000000]/70 font-bold">ประเภทเอ็น:</span>
                <span className="text-xs font-bold">{player.racket.stringType}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pro Membership Modal */}
      <ProSubscriptionModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />
    </div>
  );
};
