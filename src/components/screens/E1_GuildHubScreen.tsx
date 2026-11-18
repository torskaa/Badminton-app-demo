import React, { useState } from 'react';
import { Trophy, ArrowRight, Swords, Plus, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { GuildHubEmptyState } from '../common/GuildHubEmptyState';
import { JoinedAvatarStack, StackMember } from '../common/JoinedAvatarStack';
import { playSelectSound } from '../../utils/retroAudio';

const GUILD_PREVIEW_MEMBERS: StackMember[] = [
  { id: 'gm_1', name: 'กานต์ ธนวัฒน์' },
  { id: 'gm_2', name: 'โอห์ม ปืนกล' },
  { id: 'gm_3', name: 'แบงค์ กำแพงเหล็ก' },
  { id: 'gm_4', name: 'พลอย จอมหยอด' },
  { id: 'gm_5', name: 'นัท เสิร์ฟพิฆาต' },
];

export const E1_GuildHubScreen: React.FC = () => {
  const {
    guilds,
    myGuildIds,
    guildEvents,
    courts,
    currentEvent,
    createGuild,
    joinGuild,
    selectGuildEvent,
    navigateTo,
    language,
  } = useApp();
  const isThai = language === 'th';

  const [activeFilter, setActiveFilter] = useState<'all' | 'my_squads' | 'weekend' | 'competitive'>('all');
  const [createToast, setCreateToast] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Create Guild Form State
  const [newName, setNewName] = useState('');
  const [newTag, setNewTag] = useState(isThai ? 'พระราม 9' : 'Rama 9');
  const [newHomeCourt, setNewHomeCourt] = useState(courts[0]?.name || 'วินเนอร์ อารีน่า พระราม 9');
  const [newDays, setNewDays] = useState(isThai ? 'พุธ · ศุกร์ (19:00-22:00)' : 'Wed · Fri (19:00-22:00)');
  const [newMaxMembers, setNewMaxMembers] = useState(16);

  const filters = [
    { id: 'all', label: isThai ? 'ทั้งหมด' : 'All' },
    { id: 'weekend', label: isThai ? 'สุดสัปดาห์' : 'Weekend' },
    { id: 'competitive', label: isThai ? 'สายแข่ง' : 'Competitive' },
    { id: 'my_squads', label: isThai ? `ก๊วนของฉัน (${myGuildIds.length})` : `My Squads (${myGuildIds.length})` },
  ];

  const handleOpenCreateModal = () => {
    playSelectSound();
    setIsCreateModalOpen(true);
  };

  const handleSubmitCreateGuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const created = createGuild({
      name: newName.trim(),
      tag: newTag.trim() || (isThai ? 'กรุงเทพฯ' : 'Bangkok'),
      homeCourt: newHomeCourt,
      regularDays: newDays.trim() || 'ศุกร์ (19:00-22:00)',
      maxMembers: newMaxMembers,
    });
    setIsCreateModalOpen(false);
    setNewName('');
    setCreateToast(
      isThai
        ? `สร้างก๊วน "${created.name}" สำเร็จ (+100 EXP)`
        : `Created "${created.name}" (+100 EXP)`
    );
    setTimeout(() => {
      setCreateToast(null);
      navigateTo('E2');
    }, 1000);
  };

  const handleOpenGuild = (guildId: string) => {
    joinGuild(guildId);
    const linked = guildEvents.find((e) => e.guildId === guildId);
    if (linked) {
      selectGuildEvent(linked.id);
    }
    navigateTo('E2');
  };

  const filteredGuilds =
    activeFilter === 'my_squads'
      ? guilds.filter((g) => myGuildIds.includes(g.id))
      : activeFilter === 'weekend'
        ? guilds.filter(
            (g) =>
              g.regularDays.includes('เสาร์') ||
              g.regularDays.includes('อาทิตย์') ||
              g.regularDays.toLowerCase().includes('sat') ||
              g.homeCourt.includes('เอกมัย')
          )
        : activeFilter === 'competitive'
          ? guilds.filter((g) => g.memberCount >= 20 || g.level >= 5)
          : guilds;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28 bg-[#f8faf6] text-[#142608]">
      <MobileHeader title={isThai ? 'ศูนย์รวมก๊วน' : 'Squad Hub'} showBack />

      <div className="px-4 pt-4 pb-6 space-y-4 max-w-xl w-full mx-auto">
        {/* Community Header Banner */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'ศูนย์รวมก๊วน' : 'Squad Hub'}
            subtitle={isThai ? 'รวมก๊วนตีแบดและนัดลงสนาม' : 'Find squads and sessions'}
            rightSlot={
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="no-doodle px-3 py-1.5 rounded-full bg-[#004d2c] hover:bg-[#003a21] text-[#ffffff] text-[11px] font-semibold flex items-center gap-1 cursor-pointer active:scale-95 transition-all whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isThai ? 'สร้างก๊วน' : 'Create'}</span>
              </button>
            }
          />

          <div className="rounded-[24px] p-4 bg-[#ffffff] border border-[#d4dfd0] shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#e8f7ee] border border-[#7cd7a0] flex items-center justify-center font-bold text-[#004d2c] text-lg shrink-0">
                👥
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold leading-tight text-[#004d2c] truncate">
                  {isThai ? 'ก๊วนตีแบดกรุงเทพฯ' : 'Bangkok Smashers Guild'}
                </h2>
                <p className="text-xs text-[#5c6f5e] font-medium truncate mt-0.5">
                  {isThai
                    ? `${guilds.length} ก๊วนเปิดรับ · ${guildEvents.length} นัดสัปดาห์นี้`
                    : `${guilds.length} active squads · ${guildEvents.length} sessions this week`}
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
            className="rounded-[24px] p-4 border border-[#d4dfd0] hover:border-[#2d4d14] cursor-pointer active:scale-[0.99] transition-all space-y-3 bg-[#ffffff] shadow-2xs"
          >
            <div className="space-y-2">
              <div className="min-w-0">
                <h3 className="text-base font-bold leading-snug text-[#142608] truncate">
                  {currentEvent.title}
                </h3>
                <p className="text-xs text-[#5c6f5e] font-medium mt-0.5 truncate">
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

            <div className="pt-2.5 border-t border-[#e6eee2] flex items-center justify-between text-xs gap-2">
              <div>
                <span className="text-[10px] font-semibold text-[#5c6f5e] block">
                  {isThai ? 'เฉลี่ยคนละ' : 'Est. per player'}
                </span>
                <div className="text-2xl font-bold text-[#004d2c] leading-none tabular-nums">
                  ~฿
                  {Math.ceil(
                    (currentEvent.courtFeeTotal + currentEvent.shuttlecockFeeTotal) /
                      Math.max(1, currentEvent.attendees.length)
                  )}
                  <span className="text-xs font-normal text-[#5c6f5e]">
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
                className="no-doodle px-4 py-2.5 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#004d2c] text-[#ffffff] hover:bg-[#003a21] shrink-0 whitespace-nowrap"
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
            className="no-doodle border border-[#d4dfd0] hover:border-[#2d4d14] rounded-[22px] p-4 text-left cursor-pointer active:scale-95 transition-all flex flex-col justify-between h-28 bg-[#ffffff] shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-full bg-[#e85729] text-[#ffffff] flex items-center justify-center">
                <Swords className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fff5f2] text-[#e85729] whitespace-nowrap shrink-0">
                {isThai ? 'จัดทีม' : 'Teams'}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight text-[#142608] truncate">
                {isThai ? 'จัดคู่สมดุล' : 'Smart Matchmaker'}
              </h4>
              <p className="text-[11px] text-[#5c6f5e] font-medium truncate">
                {isThai ? 'สุ่มทีม 50/50' : 'Balanced 50/50'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('E4')}
            className="no-doodle border border-[#d4dfd0] hover:border-[#2d4d14] rounded-[22px] p-4 text-left cursor-pointer active:scale-95 transition-all flex flex-col justify-between h-28 bg-[#ffffff] shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-full bg-[#e8f7ee] text-[#004d2c] flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e8f7ee] text-[#15803d] whitespace-nowrap shrink-0">
                {isThai ? 'อันดับ' : 'Ranks'}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight text-[#142608] truncate">
                {isThai ? 'อันดับก๊วน' : 'Leaderboard'}
              </h4>
              <p className="text-[11px] text-[#5c6f5e] font-medium truncate">
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
          />

          <div
            data-filter="true"
            className="bg-[#eef3ec] border border-[#d4dfd0] p-1 rounded-full flex items-center gap-1 overflow-x-auto no-scrollbar"
          >
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setActiveFilter(f.id as any);
                  }}
                  className={`no-doodle min-h-[34px] px-3.5 py-1.5 rounded-full text-[11px] font-semibold shrink-0 cursor-pointer transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#004d2c] text-[#ffffff]'
                      : 'text-[#5c6f5e] hover:text-[#142608]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {createToast && (
            <div className="p-3 rounded-[18px] bg-[#e8f7ee] border border-[#7cd7a0] text-xs font-bold text-[#004d2c] text-center">
              {createToast}
            </div>
          )}

          {filteredGuilds.length === 0 ? (
            <GuildHubEmptyState
              onCreateGuild={handleOpenCreateModal}
              onFindSparring={() => navigateTo('E3')}
              onReset={() => setActiveFilter('all')}
            />
          ) : (
            <div className="space-y-2.5">
              {filteredGuilds.map((g) => {
                const isMember = myGuildIds.includes(g.id);
                const linkedEvent = guildEvents.find((e) => e.guildId === g.id);
                return (
                  <div
                    key={g.id}
                    onClick={() => handleOpenGuild(g.id)}
                    className="p-4 rounded-[24px] border border-[#d4dfd0] hover:border-[#2d4d14] space-y-3 cursor-pointer active:scale-[0.99] transition-all bg-[#ffffff] shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-base font-bold text-[#142608] truncate">{g.name}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-[#e8f7ee] text-[#004d2c] text-[10px] font-semibold shrink-0">
                            {g.tag}
                          </span>
                        </div>
                        <p className="text-xs text-[#5c6f5e] font-medium truncate mt-0.5">
                          {g.homeCourt} · {g.regularDays}
                        </p>
                      </div>
                      <span
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap flex items-center gap-1 ${
                          isMember
                            ? 'bg-[#e8f7ee] text-[#004d2c] border border-[#7cd7a0]'
                            : 'bg-[#004d2c] text-[#ffffff]'
                        }`}
                      >
                        {isMember && <Check className="w-3 h-3" />}
                        <span>{isMember ? (isThai ? 'สมาชิก' : 'Joined') : isThai ? 'เข้าร่วม' : 'Join'}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e6eee2]">
                      <JoinedAvatarStack
                        members={linkedEvent ? linkedEvent.attendees : GUILD_PREVIEW_MEMBERS}
                        totalCount={g.memberCount}
                        maxVisible={4}
                        size="xs"
                      />
                      <span className="text-[11px] font-semibold text-[#5c6f5e] tabular-nums whitespace-nowrap">
                        {isThai
                          ? `${g.memberCount}/${g.maxMembers} สมาชิก`
                          : `${g.memberCount}/${g.maxMembers} members`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Real Create Squad Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#000000]/55 backdrop-blur-xs p-0 sm:p-4">
          <form
            onSubmit={handleSubmitCreateGuild}
            className="w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] bg-[#ffffff] border border-[#d4dfd0] p-5 shadow-2xl space-y-4 text-[#142608]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#e6eee2]">
              <h3 className="text-base font-bold text-[#004d2c]">
                {isThai ? 'สร้างก๊วนแบดมินตันใหม่' : 'Create New Badminton Squad'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="no-doodle w-8 h-8 rounded-full bg-[#f2f7f0] flex items-center justify-center text-[#142608] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#5c6f5e] mb-1">
                  {isThai ? 'ชื่อก๊วน *' : 'Squad Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={isThai ? 'เช่น ก๊วนตบไว อารีย์' : 'e.g. Ari Smashers'}
                  className="w-full px-3.5 py-2.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] focus:outline-none font-medium text-[#142608]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-[#5c6f5e] mb-1">
                    {isThai ? 'ย่าน / โซน' : 'Area / Tag'}
                  </label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder={isThai ? 'เช่น รัชดา' : 'e.g. Ratchada'}
                    className="w-full px-3 py-2.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] focus:outline-none font-medium text-[#142608]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#5c6f5e] mb-1">
                    {isThai ? 'รับสูงสุด (คน)' : 'Max Members'}
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={60}
                    value={newMaxMembers}
                    onChange={(e) => setNewMaxMembers(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] focus:outline-none font-medium text-[#142608] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#5c6f5e] mb-1">
                  {isThai ? 'สนามประจำ' : 'Home Court'}
                </label>
                <select
                  value={newHomeCourt}
                  onChange={(e) => setNewHomeCourt(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] focus:outline-none font-medium text-[#142608]"
                >
                  {courts.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#5c6f5e] mb-1">
                  {isThai ? 'วัน-เวลาตีประจำ' : 'Regular Play Days'}
                </label>
                <input
                  type="text"
                  value={newDays}
                  onChange={(e) => setNewDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] focus:outline-none font-medium text-[#142608]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!newName.trim()}
              className="no-doodle w-full py-3.5 rounded-full bg-[#004d2c] hover:bg-[#003a21] disabled:opacity-50 text-[#ffffff] font-bold text-xs cursor-pointer transition-all active:scale-95"
            >
              {isThai ? 'สร้างก๊วนและเปิดนัดแรก (+100 EXP)' : 'Create Squad & First Session (+100 EXP)'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
