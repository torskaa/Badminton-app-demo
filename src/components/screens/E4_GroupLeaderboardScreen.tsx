import React, { useState } from 'react';
import { Trophy, Medal, Zap, Flame, Crown, Swords, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { DoodleAvatar } from '../common/DoodleAvatar';
import { PlayerTier } from '../../types';

export const E4_GroupLeaderboardScreen: React.FC = () => {
  const { leaderboard, navigateTo, setSparringModalPlayer, language } = useApp();
  const isThai = language === 'th';
  const [selectedTierFilter, setSelectedTierFilter] = useState<'All' | PlayerTier>('All');

  const getTierLabel = (tier: 'All' | PlayerTier) => {
    if (!isThai) return tier === 'All' ? 'ALL TIERS' : `${tier.toUpperCase()} LEAGUE`;
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

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-hidden">
      <MobileHeader showBack />

      <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
        {/* Season Header Banner */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'ซีซัน 4: ศึกกรุงเทพฯ' : 'SEASON 4: BANGKOK CLASH'}
            subtitle={isThai ? 'สะสมสถิติชนะและคะแนน' : 'Climb ranks with wins & points'}
            badge={isThai ? 'อีก 14 วัน' : '14 DAYS LEFT'}
            badgeVariant="orange"
          />

          <div className="rounded-[28px] p-5 space-y-2.5 bg-[#ffffff]">
            <h2 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight leading-tight text-[#000000]">
              {isThai ? 'อันดับก๊วนตบสนั่น พระราม 9' : 'RAMA 9 SMASH SQUAD RANKINGS'}
            </h2>
            <p className="text-xs text-[#000000]/70 font-medium">
              {isThai
                ? 'เก็บคะแนนเพื่อเลื่อนสู่ระดับไดมอนด์'
                : 'Earn match points to reach Diamond Tier'}
            </p>

            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateTo('E3')}
                className="px-4 py-2 rounded-[1600px] bg-[#000000] text-[#ffffff] font-bold text-xs uppercase tracking-[0.032em] flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 border border-[#000000] hover:bg-[#1a1a1a] whitespace-nowrap"
              >
                <Swords className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">
                  {isThai ? 'จัดทีมสมดุล 50/50' : 'SMART MATCHMAKER'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier Filter Section */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'เลือกลีกระดับฝีมือ' : 'LEAGUE FILTER'}
            badge={getTierLabel(selectedTierFilter)}
            badgeVariant="orange"
          />
          {/* Tier Filter Pills */}
          <div data-filter="true" className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {(['All', 'Diamond', 'Gold', 'Silver', 'Bronze'] as const).map((tier) => (
              <button
                type="button"
                key={tier}
                onClick={() => setSelectedTierFilter(tier)}
                className={`px-4 py-1.5 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] shrink-0 cursor-pointer transition-all border border-[#000000] whitespace-nowrap ${
                  selectedTierFilter === tier
                    ? 'bg-[#000000] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                }`}
              >
                {getTierLabel(tier)}
              </button>
            ))}
          </div>
        </div>

        {/* Ranked Players List Header */}
        <SectionHeader
          title={isThai ? 'อันดับนักกีฬาในก๊วน' : 'SQUAD RANKINGS'}
          badge={isThai ? `${filteredList.length} คน` : `${filteredList.length} Players`}
          badgeVariant="soft"
        />

        {/* Ranked Players List */}
        <div className="space-y-2.5">
          {filteredList.map((item) => {
            const isUser = item.name.includes('กานต์') || item.rank === 1;

            return (
              <div
                key={item.id}
                onClick={() =>
                  setSparringModalPlayer({
                    name: item.name,
                    ovr: item.ovr,
                    tier: isThai ? `ระดับ${getTierLabel(item.tier)}` : `${item.tier} League`,
                    role: isThai ? 'มือวางอันดับต้น' : 'Top Ranked Smasher',
                    status: isThai ? 'พร้อมดวลคะแนนซีซัน 4' : 'Ready for Season 4 Match',
                    winRate: item.winRate,
                  })
                }
                className={`p-3.5 rounded-[24px] transition-all flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                  isUser ? 'bg-[#7cd7a0]' : 'bg-[#ffffff]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-[1600px] border-[1.5px] border-[#000000] flex items-center justify-center font-['Antonio',sans-serif] text-sm font-black shrink-0 ${
                      item.rank === 1
                        ? 'bg-[#000000] text-[#e85729]'
                        : item.rank === 2
                          ? 'bg-[#f4f8fb] text-[#000000]'
                          : item.rank === 3
                            ? 'bg-[#e85729] text-[#ffffff]'
                            : 'bg-[#ffffff] text-[#000000]'
                    }`}
                  >
                    {item.rank}
                  </div>

                  <DoodleAvatar seed={item.name} size="sm" />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#000000]">{item.name}</span>
                      {isUser && (
                        <span className="px-1.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[9px] font-bold uppercase whitespace-nowrap shrink-0">
                          {isThai ? 'คุณ' : 'YOU'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#000000]/60 font-bold uppercase tracking-[0.032em]">
                      {getTierLabel(item.tier)} · {isThai ? `พลัง ${item.ovr}` : `OVR ${item.ovr}`}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000]">
                    {isThai ? `ชนะ ${item.winRate}%` : `${item.winRate}% WIN`}
                  </div>
                  <span className="text-[10px] font-bold text-[#000000]/60">
                    {isThai
                      ? `${item.totalGames} แมตช์ · ${item.smashPoints} แต้ม`
                      : `${item.totalGames} Matches · ${item.smashPoints} pts`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
