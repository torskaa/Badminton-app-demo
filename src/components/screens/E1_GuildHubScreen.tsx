import React, { useState } from 'react';
import { Users, Calendar, Trophy, ChevronRight, Plus, ArrowRight, Swords, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { GuildHubEmptyState } from '../common/GuildHubEmptyState';

export const E1_GuildHubScreen: React.FC = () => {
  const { guilds, currentEvent, navigateTo, gainExp } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'my_squads' | 'weekend' | 'competitive'>('all');
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [createToast, setCreateToast] = useState(false);

  const filters = [
    { id: 'all', label: 'All Guilds' },
    { id: 'weekend', label: 'Weekend' },
    { id: 'competitive', label: 'Competitive' },
    { id: 'my_squads', label: 'My Squads' }, // Empty state triggers here naturally!
  ];

  const handleCreateGuild = () => {
    gainExp(100, 'สร้างก๊วนแบดมินตันใหม่สำเร็จ (Guild Captain)');
    setCreateToast(true);
    setTimeout(() => {
      setCreateToast(false);
      navigateTo('E2');
    }, 1200);
  };

  const filteredGuilds = simulateEmpty
    ? []
    : activeFilter === 'my_squads'
    ? [] // Natural empty state: user hasn't created a squad yet
    : activeFilter === 'weekend'
    ? guilds.filter((g) => g.homeCourt.includes('พระราม 9'))
    : activeFilter === 'competitive'
    ? guilds.filter((g) => g.memberCount > 50)
    : guilds;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28 font-['Plus_Jakarta_Sans',sans-serif] bg-[#dceeff] text-[#000000]">
      <MobileHeader title="Guilds & Community" />

      <div className="p-4 space-y-4">
        {/* Community Header Banner */}
        <div className="border border-[#000000] rounded-[28px] p-4 flex items-center justify-between bg-[#ffffff]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[1600px] bg-[#ffd731] border border-[#000000] flex items-center justify-center font-bold text-[#000000] text-xl shrink-0">
              👥
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-[1600px] text-[9px] font-bold tracking-[0.032em] uppercase bg-[#e9ccff] border border-[#000000] text-[#000000] inline-block mb-0.5">
                Community Hub
              </span>
              <h2 className="font-['Antonio',sans-serif] text-xl font-black uppercase leading-tight text-[#000000]">
                BANGKOK SMASHERS GUILD
              </h2>
              <p className="text-xs text-[#000000]/70 font-medium">
                หารค่าคอร์ท, จับคู่ก๊วนสมดุล และลงแข่งเก็บคะแนนประจำสัปดาห์
              </p>
            </div>
          </div>
        </div>

        {/* Featured Upcoming Guild Event Banner */}
        <div
          onClick={() => navigateTo('E2')}
          className="border border-[#000000] rounded-[28px] p-5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform space-y-3 bg-[#ffffff]"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="px-3 py-1 rounded-[1600px] bg-[#ffd731] border border-[#000000] text-[#000000] font-bold tracking-[0.032em] text-[10px] uppercase flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Next Saturday Session
            </span>
            <span className="px-2.5 py-0.5 rounded-[1600px] text-xs font-black bg-[#55db9c] border border-[#000000] text-[#000000]">
              {currentEvent.attendees.length}/{currentEvent.maxPlayers} RSVP'd
            </span>
          </div>

          <div>
            <h3 className="font-['Antonio',sans-serif] text-2xl font-black uppercase leading-tight tracking-tight text-[#000000]">
              {currentEvent.title}
            </h3>
            <p className="text-xs text-[#000000]/70 font-medium mt-0.5">
              {currentEvent.courtName} · {currentEvent.date} ({currentEvent.timeRange})
            </p>
          </div>

          {/* Split Bill preview & Attend button */}
          <div className="pt-3 border-t border-[#000000]/20 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">หารเฉลี่ยประมาณ</span>
              <div className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000] leading-none">
                ~฿{Math.round((currentEvent.courtFeeTotal + currentEvent.shuttlecockFeeTotal) / currentEvent.maxPlayers)}
                <span className="text-xs font-normal text-[#000000]/60">/คน</span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigateTo('E2');
              }}
              className="px-4 py-2 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#000000] text-[#ffffff] border border-[#000000] hover:bg-[#1a1a1a] shrink-0 whitespace-nowrap"
            >
              <span className="whitespace-nowrap">VIEW RSVP & BILL (E2)</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => navigateTo('E3')}
            className="border border-[#000000] rounded-[24px] p-4 text-left cursor-pointer hover:scale-105 active:scale-95 transition-transform flex flex-col justify-between h-32 bg-[#ffffff]"
          >
            <div className="w-9 h-9 rounded-[1600px] bg-[#ffd731] border border-[#000000] text-[#000000] flex items-center justify-center font-bold">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-['Antonio',sans-serif] text-base font-black uppercase leading-tight text-[#000000]">
                AI Matchmaker
              </h4>
              <p className="text-[10px] text-[#000000]/70 font-bold">จัดทีม 50/50 สลับมือสมดุล →</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('E4')}
            className="border border-[#000000] rounded-[24px] p-4 text-left cursor-pointer hover:scale-105 active:scale-95 transition-transform flex flex-col justify-between h-32 bg-[#ffffff]"
          >
            <div className="w-9 h-9 rounded-[1600px] bg-[#55db9c] border border-[#000000] text-[#000000] flex items-center justify-center font-bold">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-['Antonio',sans-serif] text-base font-black uppercase leading-tight text-[#000000]">
                Leaderboard
              </h4>
              <p className="text-[10px] text-[#000000]/70 font-bold">Season 4 อันดับก๊วน →</p>
            </div>
          </button>
        </div>

        {/* Guild Category Tabs + Empty State Simulator Toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-['Antonio',sans-serif] text-base font-black uppercase tracking-wider text-[#000000]">
              ก๊วนแบดมินตันในกรุงเทพฯ
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSimulateEmpty(!simulateEmpty)}
                className={`text-[10px] font-bold tracking-[0.032em] px-2.5 py-0.5 rounded-[1600px] border border-[#000000] cursor-pointer transition-colors ${
                  simulateEmpty ? 'bg-[#fb4903] text-[#ffffff]' : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                }`}
                title="สลับดูหน้าตาตอนไม่พบก๊วน (Empty State)"
              >
                {simulateEmpty ? '✕ ปิดจำลอง Empty' : '🔍 ทดสอบ Empty State'}
              </button>
              <span className="text-xs text-[#000000]/60 font-bold">{filteredGuilds.length} ก๊วน</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {filters.map((f) => {
              const isActive = activeFilter === f.id && !simulateEmpty;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(f.id as any);
                    setSimulateEmpty(false);
                  }}
                  className={`px-3 py-1.5 rounded-[1600px] text-xs font-bold tracking-[0.032em] shrink-0 border border-[#000000] cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#000000] text-[#ffffff]'
                      : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {createToast && (
            <div className="p-3 rounded-[20px] bg-[#55db9c] border border-[#000000] text-xs font-bold text-[#000000] text-center animate-bounce">
              🎉 สร้างก๊วนสำเร็จ! +100 EXP มุ่งหน้าสู่หน้าตั้งค่าปาร์ตี้...
            </div>
          )}

          {/* Render GuildHubEmptyState or Guilds List */}
          {filteredGuilds.length === 0 ? (
            <GuildHubEmptyState
              onCreateGuild={handleCreateGuild}
              onFindSparring={() => navigateTo('E3')}
              onReset={() => {
                setActiveFilter('all');
                setSimulateEmpty(false);
              }}
            />
          ) : (
            <div className="space-y-2">
              {filteredGuilds.map((g) => (
                <div
                  key={g.id}
                  onClick={() => navigateTo('E2')}
                  className="p-3.5 rounded-[24px] border border-[#000000] flex items-center justify-between gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] bg-[#ffffff]"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-['Antonio',sans-serif] text-base font-black uppercase text-[#000000] truncate">{g.name}</h4>
                    <p className="text-[10px] text-[#000000]/70 font-medium truncate">{g.homeCourt} · {g.memberCount} สมาชิก</p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-[1600px] text-[10px] font-bold tracking-[0.032em] border border-[#000000] bg-[#000000] text-[#ffffff] hover:bg-[#1a1a1a] shrink-0 whitespace-nowrap">
                    JOIN SQUAD
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
