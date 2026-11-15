import React, { useState } from 'react';
import { Trophy, ArrowRight, Swords } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { GuildHubEmptyState } from '../common/GuildHubEmptyState';
import { JoinedAvatarStack, StackMember } from '../common/JoinedAvatarStack';

const GUILD_PREVIEW_MEMBERS: StackMember[] = [
  { id: 'gm_1', name: 'กานต์ ธนวัฒน์' },
  { id: 'gm_2', name: 'โอห์ม ปืนกล' },
  { id: 'gm_3', name: 'แบงค์ กำแพงเหล็ก' },
  { id: 'gm_4', name: 'พลอย จอมหยอด' },
  { id: 'gm_5', name: 'นัท เสิร์ฟพิฆาต' },
];

export const E1_GuildHubScreen: React.FC = () => {
  const { guilds, currentEvent, navigateTo, gainExp, language } = useApp();
  const isThai = language === 'th';

  const [activeFilter, setActiveFilter] = useState<'all' | 'my_squads' | 'weekend' | 'competitive'>('all');
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [createToast, setCreateToast] = useState(false);

  const filters = [
    { id: 'all', label: isThai ? 'ทั้งหมด' : 'All' },
    { id: 'weekend', label: isThai ? 'สุดสัปดาห์' : 'Weekend' },
    { id: 'competitive', label: isThai ? 'สายแข่ง' : 'Competitive' },
    { id: 'my_squads', label: isThai ? 'ก๊วนของฉัน' : 'My Squads' },
  ];

  const handleCreateGuild = () => {
    gainExp(100, isThai ? 'สร้างก๊วนใหม่สำเร็จ' : 'Created new squad');
    setCreateToast(true);
    setTimeout(() => {
      setCreateToast(false);
      navigateTo('E2');
    }, 1200);
  };

  const filteredGuilds = simulateEmpty
    ? []
    : activeFilter === 'my_squads'
    ? []
    : activeFilter === 'weekend'
    ? guilds.filter((g) => g.regularDays.includes('เสาร์') || g.homeCourt.includes('เอกมัย'))
    : activeFilter === 'competitive'
    ? guilds.filter((g) => g.memberCount > 25)
    : guilds;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28 bg-[#f4f8fb] text-[#000000]">
      <MobileHeader />

      <div className="px-5 pt-4 pb-6 space-y-4">
        {/* Community Header Banner */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'ศูนย์รวมก๊วน' : 'Squad Hub'}
            subtitle={isThai ? 'รวมก๊วนตีแบดและนัดลงสนาม' : 'Find squads and sessions'}
            badge={isThai ? 'เปิดรับ' : 'Open'}
            badgeVariant="green"
          />

          <div className="rounded-[28px] p-4 bg-[#ffffff]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[1600px] bg-[#7cd7a0] flex items-center justify-center font-bold text-[#000000] text-lg shrink-0">
                👥
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold leading-tight text-[#000000] truncate">
                  {isThai ? 'ก๊วนตีแบดกรุงเทพฯ' : 'Bangkok Smashers Guild'}
                </h2>
                <p className="text-xs text-[#000000]/65 font-medium truncate mt-0.5">
                  {isThai ? 'หารค่าคอร์ทและจัดคู่สมดุล' : 'Split bills & balanced pairings'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Upcoming Guild Event Banner */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'นัดตีแบดถัดไป' : 'Next Session'}
            badge={
              isThai
                ? `${currentEvent.attendees.length}/${currentEvent.maxPlayers} คน`
                : `${currentEvent.attendees.length}/${currentEvent.maxPlayers} joined`
            }
            badgeVariant="green"
          />

          <div
            onClick={() => navigateTo('E2')}
            className="rounded-[28px] p-4 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform space-y-3 bg-[#ffffff]"
          >
            <div className="space-y-2">
              <div className="min-w-0">
                <h3 className="text-lg font-bold leading-snug text-[#000000] truncate">
                  {currentEvent.title}
                </h3>
                <p className="text-xs text-[#000000]/65 font-medium mt-0.5 truncate">
                  {currentEvent.courtName} · {currentEvent.date}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <JoinedAvatarStack
                  members={currentEvent.attendees}
                  totalCount={currentEvent.attendees.length}
                  maxVisible={4}
                  size="sm"
                />
                <span className="text-[11px] font-bold text-[#15803d] whitespace-nowrap">
                  {isThai
                    ? `ว่าง ${Math.max(0, currentEvent.maxPlayers - currentEvent.attendees.length)} ที่`
                    : `${Math.max(0, currentEvent.maxPlayers - currentEvent.attendees.length)} spots left`}
                </span>
              </div>
            </div>

            {/* Split Bill preview & Attend button */}
            <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-xs gap-2">
              <div>
                <span className="text-[10px] font-bold text-[#000000]/55 block">
                  {isThai ? 'เฉลี่ยคนละ' : 'Est. per player'}
                </span>
                <div className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000] leading-none tabular-nums">
                  ~฿{Math.round((currentEvent.courtFeeTotal + currentEvent.shuttlecockFeeTotal) / Math.max(1, currentEvent.attendees.length))}
                  <span className="text-xs font-normal text-[#000000]/60">
                    {isThai ? '/คน' : '/ea'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('E2');
                }}
                className="px-4 py-2 rounded-[1600px] font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#000000] text-[#ffffff] border border-[#000000] hover:bg-[#1a1a1a] shrink-0 whitespace-nowrap"
              >
                <span className="whitespace-nowrap">
                  {isThai ? 'ลงชื่อ & หารบิล' : 'RSVP & Split Bill'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => navigateTo('E3')}
            className="border border-[#000000] rounded-[24px] p-4 text-left cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform flex flex-col justify-between h-28 bg-[#ffffff]"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-[1600px] bg-[#e85729] text-[#ffffff] flex items-center justify-center font-bold">
                <Swords className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-[1600px] bg-[#f4f8fb] whitespace-nowrap shrink-0">
                {isThai ? 'จัดทีม' : 'Teams'}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight text-[#000000] truncate">
                {isThai ? 'จัดคู่สมดุล' : 'Smart Matchmaker'}
              </h4>
              <p className="text-[11px] text-[#000000]/65 font-medium truncate">
                {isThai ? 'สุ่มทีม 50/50' : 'Balanced 50/50'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('E4')}
            className="border border-[#000000] rounded-[24px] p-4 text-left cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform flex flex-col justify-between h-28 bg-[#ffffff]"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-[1600px] bg-[#7cd7a0] text-[#000000] flex items-center justify-center font-bold">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-[1600px] bg-[#e8f7ee] whitespace-nowrap shrink-0">
                {isThai ? 'อันดับ' : 'Ranks'}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight text-[#000000] truncate">
                {isThai ? 'อันดับก๊วน' : 'Leaderboard'}
              </h4>
              <p className="text-[11px] text-[#000000]/65 font-medium truncate">
                {isThai ? 'ตารางคะแนนก๊วน' : 'Season standings'}
              </p>
            </div>
          </button>
        </div>

        {/* Guild Category Tabs */}
        <div className="space-y-3">
          <SectionHeader
            title={isThai ? 'ก๊วนที่เปิดรับ' : 'Open Squads'}
            subtitle={isThai ? `พบ ${filteredGuilds.length} ก๊วน` : `${filteredGuilds.length} squads open`}
            rightSlot={
              <button
                type="button"
                onClick={() => setSimulateEmpty(!simulateEmpty)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-[1600px] border border-[#000000] cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  simulateEmpty ? 'bg-[#e85729] text-[#ffffff]' : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                }`}
              >
                {simulateEmpty ? (isThai ? '✕ ปิดว่าง' : '✕ Close') : (isThai ? 'ดูแบบว่าง' : 'Empty View')}
              </button>
            }
          />

          {/* Filter Pills */}
          <div data-filter="true" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
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
                  className={`px-3.5 py-1.5 rounded-[1600px] text-xs font-bold shrink-0 border border-[#000000] cursor-pointer transition-all whitespace-nowrap ${
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
            <div className="p-3 rounded-[20px] bg-[#7cd7a0] text-xs font-bold text-[#000000] text-center animate-bounce">
              {isThai ? '🎉 สร้างก๊วนสำเร็จ +100 EXP' : '🎉 Squad created! +100 EXP'}
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
            <div className="space-y-2.5">
              {filteredGuilds.map((g, idx) => (
                <div
                  key={g.id}
                  onClick={() => navigateTo('E2')}
                  className="p-4 rounded-[24px] space-y-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] bg-[#ffffff]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-bold text-[#000000] truncate">{g.name}</h4>
                      <p className="text-xs text-[#000000]/65 font-medium truncate">
                        {g.homeCourt} · {g.regularDays}
                      </p>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-[1600px] text-xs font-bold bg-[#000000] text-[#ffffff] hover:bg-[#1a1a1a] shrink-0 whitespace-nowrap">
                      {isThai ? 'เข้าร่วม' : 'Join'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f1f5f9]">
                    <JoinedAvatarStack
                      members={idx === 0 ? currentEvent.attendees : GUILD_PREVIEW_MEMBERS}
                      totalCount={g.memberCount}
                      maxVisible={4}
                      size="xs"
                    />
                    <span className="text-[11px] font-bold text-[#000000]/60 tabular-nums whitespace-nowrap">
                      {isThai ? `${g.memberCount}/${g.maxMembers} สมาชิก` : `${g.memberCount}/${g.maxMembers} members`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
