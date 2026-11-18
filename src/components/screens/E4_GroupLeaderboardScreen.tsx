import React, { useState } from 'react';
import { Crown, Medal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { DoodleAvatar, resolveDoodlePreset } from '../common/DoodleAvatar';
import { LeaderboardUser, PlayerTier } from '../../types';
import { playSelectSound } from '../../utils/retroAudio';

export const E4_GroupLeaderboardScreen: React.FC = () => {
  const { leaderboard, setSparringModalPlayer, language } = useApp();
  const isThai = language === 'th';
  const [selectedTierFilter, setSelectedTierFilter] = useState<'All' | PlayerTier>('All');

  const getTierLabel = (tier: 'All' | PlayerTier) => {
    if (!isThai) return tier === 'All' ? 'All Tiers' : tier;
    switch (tier) {
      case 'All':
        return 'ทั้งหมด';
      case 'Diamond':
        return 'ไดมอนด์';
      case 'Gold':
        return 'โกลด์';
      case 'Silver':
        return 'ซิลเวอร์';
      case 'Bronze':
        return 'บรอนซ์';
    }
  };

  const filteredList = leaderboard.filter((item) => {
    if (selectedTierFilter === 'All') return true;
    return item.tier === selectedTierFilter;
  });

  const sortedList = [...filteredList].sort((a, b) => a.rank - b.rank);
  const showPodium = sortedList.length >= 3;
  const podiumFirst = sortedList[0];
  const podiumSecond = sortedList[1];
  const podiumThird = sortedList[2];

  const getPlayerLevel = (exp: number) => Math.max(12, Math.round(exp / 180));

  const formatCompactPoints = (exp: number) => {
    if (exp >= 1000) return `${(exp / 1000).toFixed(1)}k`;
    return exp.toLocaleString();
  };

  const openSparringFor = (item: LeaderboardUser) => {
    playSelectSound();
    setSparringModalPlayer({
      name: item.name,
      ovr: item.ovr,
      tier: isThai ? `ระดับ${getTierLabel(item.tier)}` : `${item.tier} League`,
      role: item.guildTitle || (isThai ? 'มือวางอันดับต้น' : 'Top Ranked Smasher'),
      status: isThai ? 'พร้อมดวลคะแนนซีซัน 4' : 'Ready for Season 4 Match',
      winRate: item.winRate,
    });
  };

  const renderPodiumColumn = (
    item: LeaderboardUser,
    position: 1 | 2 | 3
  ) => {
    const isFirst = position === 1;
    const isSecond = position === 2;

    const crownStyle = isFirst
      ? 'bg-[#004d2c] border-[#ffffff] text-[#7cd7a0]'
      : isSecond
        ? 'bg-[#7cd7a0] border-[#ffffff] text-[#004d2c]'
        : 'bg-[#e85729] border-[#ffffff] text-[#ffffff]';

    const pillarStyle = isFirst
      ? 'h-28 bg-gradient-to-b from-[#004d2c] to-[#00361f] text-[#7cd7a0] shadow-[inset_0_1px_0_rgba(124,215,160,0.3)]'
      : isSecond
        ? 'h-20 bg-gradient-to-b from-[#7cd7a0] to-[#56be82] text-[#004d2c] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]'
        : 'h-16 bg-gradient-to-b from-[#e85729] to-[#c94118] text-[#ffffff] shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]';

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => openSparringFor(item)}
        className="no-doodle flex flex-col items-center text-center group cursor-pointer focus:outline-none min-w-0"
      >
        {/* Avatar + Circular Corner Crown Badge */}
        <div className="relative mb-2">
          <div
            className={`rounded-full p-0.5 transition-transform group-hover:scale-105 ${
              isFirst
                ? 'ring-2 ring-[#004d2c]'
                : isSecond
                  ? 'ring-2 ring-[#7cd7a0]'
                  : 'ring-2 ring-[#e85729]/85'
            }`}
          >
            <DoodleAvatar
              preset={resolveDoodlePreset(item.name)}
              seed={item.name}
              size={isFirst ? 'lg' : 'md'}
              className={isFirst ? 'w-14 h-14' : 'w-12 h-12'}
              ringClass="border-2 border-[#ffffff]"
            />
          </div>
          <span
            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-xs ${crownStyle}`}
          >
            <Crown className="w-3 h-3 stroke-[2.3]" />
          </span>
        </div>

        {/* Name & Raw Score */}
        <span className="text-[12px] font-bold text-[#142608] truncate w-full px-0.5 leading-snug">
          {item.name}
        </span>
        <span className="text-[11px] font-semibold text-[#5c6f5e] tabular-nums mt-0.5">
          {item.exp.toLocaleString()}
        </span>

        {/* Podium Pillar */}
        <div
          className={`mt-2.5 w-full rounded-t-[14px] flex items-start justify-center pt-2.5 transition-opacity group-hover:opacity-95 ${pillarStyle}`}
        >
          <span className="text-[18px] font-extrabold tabular-nums leading-none">
            {position}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f8faf6] text-[#142608] overflow-hidden">
      <MobileHeader
        showBack
        title={isThai ? 'อันดับก๊วน' : 'Leaderboard'}
        subtitle={isThai ? 'ซีซัน 4 · พระราม 9' : 'Season 4 · Rama 9'}
      />

      <div className="px-4 pt-3 space-y-3.5 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28 max-w-2xl w-full mx-auto">
        {/* Hairline Tier Filter Chips */}
        <div data-filter="true" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {(['All', 'Diamond', 'Gold', 'Silver', 'Bronze'] as const).map((tier) => {
            const isSelected = selectedTierFilter === tier;
            return (
              <button
                type="button"
                key={tier}
                onClick={() => {
                  playSelectSound();
                  setSelectedTierFilter(tier);
                }}
                className={`no-doodle filter-pill min-h-[34px] px-3.5 py-1 rounded-full text-[12px] shrink-0 cursor-pointer transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c] font-semibold shadow-2xs'
                    : 'bg-[#ffffff] text-[#52525b] border-[#d4dfd0] hover:border-[#2d4d14] hover:text-[#142608] font-medium'
                }`}
              >
                {getTierLabel(tier)}
              </button>
            );
          })}
        </div>

        {/* Main Weekly Leaderboard Card (SmashAI Brand CI: Daylight Surface + Forest/Mint/Ember Podium) */}
        <section className="rounded-[26px] bg-[#ffffff] border border-[#d4dfd0] p-5 shadow-[0_6px_24px_rgba(0,77,44,0.06)] text-[#142608] space-y-5">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-bold text-[#004d2c] tracking-tight leading-tight">
                {isThai ? 'อันดับก๊วนรายสัปดาห์' : 'Weekly Leaderboard'}
              </h2>
              <p className="text-[12px] text-[#5c6f5e] font-medium mt-1">
                {isThai
                  ? '1 พ.ย. 2026 - 7 พ.ย. 2026 · ก๊วนพระราม 9'
                  : 'Nov 1, 2026 - Nov 7, 2026 · Rama 9 Squad'}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#004d2c] tabular-nums whitespace-nowrap shrink-0 pt-1">
              {isThai ? `${sortedList.length} คน` : `${sortedList.length} Players`}
            </span>
          </div>

          {/* Elevated Top 3 Podium (#2 Left · #1 Center · #3 Right) */}
          {showPodium && podiumFirst && podiumSecond && podiumThird && (
            <div className="grid grid-cols-3 items-end gap-3 pt-2 border-b border-[#e6eee2]">
              {renderPodiumColumn(podiumSecond, 2)}
              {renderPodiumColumn(podiumFirst, 1)}
              {renderPodiumColumn(podiumThird, 3)}
            </div>
          )}

          {/* Full Ranked List Card Inside Container */}
          {sortedList.length === 0 ? (
            <div className="rounded-[18px] bg-[#f8faf6] border border-[#d4dfd0] p-6 text-center space-y-2.5">
              <p className="text-xs font-medium text-[#5c6f5e]">
                {isThai ? 'ไม่พบผู้เล่นในลีกที่เลือก' : 'No players found in this league'}
              </p>
              <button
                type="button"
                onClick={() => setSelectedTierFilter('All')}
                className="no-doodle px-3.5 py-1.5 rounded-full bg-[#004d2c] text-[#ffffff] text-[11px] font-semibold cursor-pointer hover:bg-[#003b22]"
              >
                {isThai ? 'แสดงทั้งหมด' : 'Show All'}
              </button>
            </div>
          ) : (
            <div className="rounded-[18px] bg-[#ffffff] border border-[#d4dfd0] divide-y divide-[#e6eee2] overflow-hidden">
              {sortedList.map((item) => {
                const isUser = item.name.includes('กานต์') || item.id === 'usr_karn_007';
                const level = getPlayerLevel(item.exp);
                const rankDisplay = selectedTierFilter === 'All' ? item.rank : sortedList.indexOf(item) + 1;

                const crownColor =
                  rankDisplay === 1
                    ? 'text-[#004d2c]'
                    : rankDisplay === 2
                      ? 'text-[#15803d]'
                      : rankDisplay === 3
                        ? 'text-[#e85729]'
                        : 'text-[#879b89]';

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openSparringFor(item)}
                    className={`no-doodle w-full px-3.5 py-3 flex items-center justify-between gap-2.5 text-left transition-colors cursor-pointer ${
                      isUser ? 'bg-[#e8f7ee]/75 hover:bg-[#ddf3e5]' : 'bg-[#ffffff] hover:bg-[#f8faf6]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span
                        className={`w-4 text-center text-[12px] font-bold tabular-nums shrink-0 ${
                          rankDisplay === 1 ? 'text-[#004d2c]' : rankDisplay === 3 ? 'text-[#e85729]' : 'text-[#142608]'
                        }`}
                      >
                        {rankDisplay}
                      </span>

                      <span className={`w-5 flex items-center justify-center shrink-0 ${crownColor}`}>
                        {rankDisplay <= 3 ? (
                          <Crown className="w-4 h-4 stroke-[2.1]" />
                        ) : (
                          <Medal className="w-3.5 h-3.5 stroke-[1.9]" />
                        )}
                      </span>

                      <div className="shrink-0">
                        <DoodleAvatar
                          preset={resolveDoodlePreset(item.name)}
                          seed={item.name}
                          size="sm"
                          className="w-9 h-9"
                          ringClass={isUser ? 'border-[1.5px] border-[#004d2c]' : 'border border-[#d4dfd0]'}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[13px] font-semibold text-[#142608] truncate">
                            {item.name}
                          </span>
                          {isUser && (
                            <span className="text-[10px] font-bold text-[#004d2c] whitespace-nowrap shrink-0">
                              · {isThai ? 'คุณ' : 'You'}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#5c6f5e] truncate mt-0.5 tabular-nums">
                          {isThai
                            ? `เลเวล ${level} – ${getTierLabel(item.tier)} · ชนะ ${item.winRate}%`
                            : `Level ${level} – ${getTierLabel(item.tier)} · ${item.winRate}% win`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <div
                        className={`text-[14px] font-bold tabular-nums ${
                          rankDisplay <= 3 || isUser ? 'text-[#004d2c]' : 'text-[#142608]'
                        }`}
                      >
                        {formatCompactPoints(item.exp)}
                      </div>
                      <div className="text-[10px] font-medium text-[#5c6f5e] tabular-nums">
                        {isThai ? `${item.smashPoints} แต้ม` : `${item.smashPoints} pts`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
