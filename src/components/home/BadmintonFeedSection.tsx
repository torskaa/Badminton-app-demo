import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  Calendar,
  ChevronDown,
  ChevronUp,
  Flame,
  Heart,
  MapPin,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DoodleAvatar, resolveDoodlePreset } from '../common/DoodleAvatar';
import { playCoinSound, playSelectSound } from '../../utils/retroAudio';

type FeedCategory = 'all' | 'friends' | 'match' | 'achievement' | 'milestone';

interface FriendOutcomeMeta {
  friendId: string;
  nameEn: string;
  opponentTh: string;
  opponentEn: string;
  result: 'win' | 'loss';
  matchType: 'Singles' | 'Doubles';
  scoreDisplay: string;
  setSummary: string;
  venueTh: string;
  venueEn: string;
  timeTh: string;
  timeEn: string;
  topSmashKmh: number;
  formStreak: ('W' | 'L')[];
  initialCheers: number;
}

const FRIEND_OUTCOMES_BY_ID: Record<string, FriendOutcomeMeta> = {
  usr_art: {
    friendId: 'usr_art',
    nameEn: 'Art Speedboat',
    opponentTh: 'พีท รัชดา',
    opponentEn: 'Pete Ratchada',
    result: 'win',
    matchType: 'Singles',
    scoreDisplay: '2:0',
    setSummary: '21-15 · 21-17',
    venueTh: 'วินเนอร์ พระราม 9 · คอร์ท 3',
    venueEn: 'Winner Rama 9 · Ct 3',
    timeTh: '14 นาทีที่แล้ว',
    timeEn: '14m ago',
    topSmashKmh: 368,
    formStreak: ['W', 'W', 'W', 'W', 'L'],
    initialCheers: 19,
  },
  usr_ohm: {
    friendId: 'usr_ohm',
    nameEn: 'Ohm Machinegun',
    opponentTh: 'มาร์ค เอกมัย',
    opponentEn: 'Mark Ekkamai',
    result: 'win',
    matchType: 'Singles',
    scoreDisplay: '2:1',
    setSummary: '21-19 · 18-21 · 21-16',
    venueTh: '71 สปอร์ตคลับ · คอร์ท 4',
    venueEn: '71 Sport Club · Ct 4',
    timeTh: '38 นาทีที่แล้ว',
    timeEn: '38m ago',
    topSmashKmh: 354,
    formStreak: ['W', 'W', 'L', 'W', 'W'],
    initialCheers: 15,
  },
  usr_top: {
    friendId: 'usr_top',
    nameEn: 'Top Drivebolt',
    opponentTh: 'เจมส์ บางนา',
    opponentEn: 'James Bangna',
    result: 'loss',
    matchType: 'Singles',
    scoreDisplay: '1:2',
    setSummary: '21-18 · 16-21 · 19-21',
    venueTh: 'สแมช โซน บางนา · คอร์ท 2',
    venueEn: 'Smash Zone Bangna · Ct 2',
    timeTh: '1 ชม. ที่แล้ว',
    timeEn: '1h ago',
    topSmashKmh: 339,
    formStreak: ['L', 'W', 'W', 'W', 'L'],
    initialCheers: 9,
  },
  usr_bank: {
    friendId: 'usr_bank',
    nameEn: 'Bank Ironwall',
    opponentTh: 'ตั้ม & โบ๊ท',
    opponentEn: 'Tum & Boat',
    result: 'win',
    matchType: 'Doubles',
    scoreDisplay: '2:0',
    setSummary: '21-14 · 21-18',
    venueTh: 'วินเนอร์ พระราม 9 · คอร์ท 5',
    venueEn: 'Winner Rama 9 · Ct 5',
    timeTh: '2 ชม. ที่แล้ว',
    timeEn: '2h ago',
    topSmashKmh: 328,
    formStreak: ['W', 'L', 'W', 'W', 'W'],
    initialCheers: 12,
  },
  usr_ploy: {
    friendId: 'usr_ploy',
    nameEn: 'Ploy Dropshot',
    opponentTh: 'นุ่น พระราม 9',
    opponentEn: 'Noon Rama 9',
    result: 'win',
    matchType: 'Singles',
    scoreDisplay: '2:1',
    setSummary: '19-21 · 21-17 · 21-13',
    venueTh: 'โปรคอร์ท รัชดา 18 · คอร์ท 6',
    venueEn: 'ProCourt Ratchada 18 · Ct 6',
    timeTh: '3 ชม. ที่แล้ว',
    timeEn: '3h ago',
    topSmashKmh: 304,
    formStreak: ['W', 'W', 'L', 'W', 'L'],
    initialCheers: 16,
  },
  usr_mean: {
    friendId: 'usr_mean',
    nameEn: 'Meen Backhand',
    opponentTh: 'นัท เสิร์ฟพิฆาต',
    opponentEn: 'Nut Flickserve',
    result: 'win',
    matchType: 'Singles',
    scoreDisplay: '2:0',
    setSummary: '21-17 · 21-19',
    venueTh: 'อินฟินิตี้ หทัยราษฎร์ · คอร์ท 1',
    venueEn: 'Infinity Arena · Ct 1',
    timeTh: 'เมื่อวาน 20:30 น.',
    timeEn: 'Yesterday 8:30 PM',
    topSmashKmh: 318,
    formStreak: ['W', 'L', 'W', 'L', 'W'],
    initialCheers: 8,
  },
};

interface FeedMatchPayload {
  leftNameTh: string;
  leftNameEn: string;
  leftPartnerTh?: string;
  leftPartnerEn?: string;
  leftTierTh: string;
  leftTierEn: string;
  rightNameTh: string;
  rightNameEn: string;
  rightPartnerTh?: string;
  rightPartnerEn?: string;
  rightTierTh: string;
  rightTierEn: string;
  matchType: 'Singles' | 'Doubles';
  scoreDisplay: string;
  setSummary: string;
  venueTh: string;
  venueEn: string;
  topSmashKmh: number;
  durationMin: number;
  expBonus: number;
  highlightTh: string;
  highlightEn: string;
}

interface FeedAchievementPayload {
  memberNameTh: string;
  memberNameEn: string;
  memberRankTh: string;
  memberRankEn: string;
  badgeTitleTh: string;
  badgeTitleEn: string;
  badgeDescTh: string;
  badgeDescEn: string;
  rarityLabelTh: string;
  rarityLabelEn: string;
  progressText: string;
  expReward: number;
  icon: 'zap' | 'sparkles' | 'trophy';
}

interface FeedMilestonePayload {
  memberNameTh: string;
  memberNameEn: string;
  memberSubTh: string;
  memberSubEn: string;
  headlineTh: string;
  headlineEn: string;
  summaryTh: string;
  summaryEn: string;
  metrics: {
    labelTh: string;
    labelEn: string;
    value: string;
    highlight?: boolean;
  }[];
}

interface BadmintonFeedItem {
  id: string;
  type: 'match' | 'achievement' | 'milestone';
  guildTh: string;
  guildEn: string;
  timeTh: string;
  timeEn: string;
  initialCheers: number;
  match?: FeedMatchPayload;
  achievement?: FeedAchievementPayload;
  milestone?: FeedMilestonePayload;
}

const FEED_ITEMS: BadmintonFeedItem[] = [
  {
    id: 'feed_match_1',
    type: 'match',
    guildTh: 'ก๊วนตบสนั่น พระราม 9',
    guildEn: 'Rama 9 Smashers',
    timeTh: '18 นาทีที่แล้ว',
    timeEn: '18m ago',
    initialCheers: 14,
    match: {
      leftNameTh: 'อาร์ท สปีดโบ๊ท',
      leftNameEn: 'Art Speedboat',
      leftTierTh: 'ลีกไดมอนด์ · #1',
      leftTierEn: 'Diamond · #1',
      rightNameTh: 'โอห์ม ปืนกล',
      rightNameEn: 'Ohm Machinegun',
      rightTierTh: 'ลีกไดมอนด์ · #3',
      rightTierEn: 'Diamond · #3',
      matchType: 'Singles',
      scoreDisplay: '2:1',
      setSummary: '21-18 · 17-21 · 21-15',
      venueTh: 'วินเนอร์ อารีน่า พระราม 9 · คอร์ท 3',
      venueEn: 'Winner Arena Rama 9 · Court 3',
      topSmashKmh: 356,
      durationMin: 48,
      expBonus: 260,
      highlightTh: 'จัมป์สแมชฉีกมุมเส้นข้างปิดเซตตัดสิน',
      highlightEn: 'Cross-court jump smash sealed deciding set',
    },
  },
  {
    id: 'feed_ach_1',
    type: 'achievement',
    guildTh: 'ก๊วนตบสนั่น พระราม 9',
    guildEn: 'Rama 9 Smashers',
    timeTh: '42 นาทีที่แล้ว',
    timeEn: '42m ago',
    initialCheers: 21,
    achievement: {
      memberNameTh: 'พลอย จอมหยอด',
      memberNameEn: 'Ploy Dropshot',
      memberRankTh: 'ลีกโกลด์ · สายคุมหน้าเน็ต',
      memberRankEn: 'Gold League · Net Specialist',
      badgeTitleTh: 'ปลดล็อกเหรียญ "จอมเวทหน้าเน็ต"',
      badgeTitleEn: 'Unlocked "Net Wizard" Badge',
      badgeDescTh: 'หยอดลูกเลียดเน็ตทำแต้มครบ 25 ครั้งในสัปดาห์เดียว',
      badgeDescEn: 'Scored 25 tight net-drop winners in one week',
      rarityLabelTh: 'ระดับอีปิก',
      rarityLabelEn: 'Epic Tier',
      progressText: '25/25',
      expReward: 450,
      icon: 'sparkles',
    },
  },
  {
    id: 'feed_mile_1',
    type: 'milestone',
    guildTh: 'ก๊วนเสาร์อาทิตย์ เอกมัย',
    guildEn: 'Ekkamai Weekend Club',
    timeTh: '2 ชม. ที่แล้ว',
    timeEn: '2h ago',
    initialCheers: 18,
    milestone: {
      memberNameTh: 'ท็อป ดรายฟ์สายฟ้า',
      memberNameEn: 'Top Drivebolt',
      memberSubTh: 'ลีกโกลด์ · อันดับ 4 ก๊วน',
      memberSubEn: 'Gold League · Rank #4',
      headlineTh: 'ทะลุหลักชัย 100 แมตช์ในฤดูกาลนี้',
      headlineEn: 'Reached 100 Matches Milestone',
      summaryTh: 'ลงสนามสม่ำเสมอครบ 100 แมตช์ พร้อมอัปอัตราชนะขึ้น 63.4%',
      summaryEn: 'Completed 100 official club matches with a 63.4% win rate',
      metrics: [
        { labelTh: 'แมตช์รวม', labelEn: 'Matches', value: '100' },
        { labelTh: 'อัตราชนะ', labelEn: 'Win Rate', value: '63.4%' },
        { labelTh: 'โบนัสก๊วน', labelEn: 'Guild EXP', value: '+500', highlight: true },
      ],
    },
  },
  {
    id: 'feed_match_2',
    type: 'match',
    guildTh: 'ก๊วนตบสนั่น พระราม 9',
    guildEn: 'Rama 9 Smashers',
    timeTh: '3 ชม. ที่แล้ว',
    timeEn: '3h ago',
    initialCheers: 11,
    match: {
      leftNameTh: 'แบงค์',
      leftNameEn: 'Bank',
      leftPartnerTh: 'พลอย',
      leftPartnerEn: 'Ploy',
      leftTierTh: 'คู่ผสมก๊วนพระราม 9',
      leftTierEn: 'Rama 9 Mixed Pair',
      rightNameTh: 'ท็อป',
      rightNameEn: 'Top',
      rightPartnerTh: 'มีน',
      rightPartnerEn: 'Meen',
      rightTierTh: 'สายดรายฟ์เร็ว',
      rightTierEn: 'Fast Drive Pair',
      matchType: 'Doubles',
      scoreDisplay: '2:0',
      setSummary: '21-16 · 21-19',
      venueTh: '71 สปอร์ตคลับ เอกมัย · คอร์ท 5',
      venueEn: '71 Sport Club Ekkamai · Court 5',
      topSmashKmh: 332,
      durationMin: 36,
      expBonus: 190,
      highlightTh: 'แบงค์รับเหนียว 9 ช็อตติดก่อนพลอยดักหน้าเน็ตปิดแต้ม',
      highlightEn: '9 consecutive defensive blocks into sharp net kill',
    },
  },
  {
    id: 'feed_ach_2',
    type: 'achievement',
    guildTh: 'ก๊วนตบสนั่น พระราม 9',
    guildEn: 'Rama 9 Smashers',
    timeTh: 'เมื่อวาน 21:40 น.',
    timeEn: 'Yesterday 9:40 PM',
    initialCheers: 27,
    achievement: {
      memberNameTh: 'โอห์ม ปืนกล',
      memberNameEn: 'Ohm Machinegun',
      memberRankTh: 'ลีกไดมอนด์ · สายสปีดปอดเหล็ก',
      memberRankEn: 'Diamond League · Iron Runner',
      badgeTitleTh: 'ปลดล็อกเหรียญ "ปอดเหล็ก 3 เซต"',
      badgeTitleEn: 'Unlocked "Iron Lung 3-Set" Badge',
      badgeDescTh: 'จบแมตช์ 3 เซตติดกัน 5 นัดโดยความเร็วฟุตเวิร์กไม่ตก',
      badgeDescEn: 'Finished 5 straight 3-set matches at peak footwork pace',
      rarityLabelTh: 'ระดับตำนาน',
      rarityLabelEn: 'Legendary',
      progressText: '5/5',
      expReward: 600,
      icon: 'zap',
    },
  },
  {
    id: 'feed_mile_2',
    type: 'milestone',
    guildTh: 'ก๊วนตบสนั่น พระราม 9',
    guildEn: 'Rama 9 Smashers',
    timeTh: 'เมื่อวาน 19:00 น.',
    timeEn: 'Yesterday 7:00 PM',
    initialCheers: 32,
    milestone: {
      memberNameTh: 'แบงค์ กำแพงเหล็ก',
      memberNameEn: 'Bank Ironwall',
      memberSubTh: 'สมาชิกหลัก · ก๊วนพระราม 9',
      memberSubEn: 'Core Member · Rama 9 Hub',
      headlineTh: 'ก๊วนพระราม 9 อัปสู่เลเวล 8 สำเร็จ',
      headlineEn: 'Guild Reached Level 8',
      summaryTh: 'สมาชิก 28/30 คนร่วมเล่นครบเป้าสัปดาห์ ปลดล็อกส่วนลดลูกแบด 15%',
      summaryEn: '28/30 members hit weekly court target · 15% shuttle discount unlocked',
      metrics: [
        { labelTh: 'สมาชิกก๊วน', labelEn: 'Members', value: '28/30' },
        { labelTh: 'เลเวลก๊วน', labelEn: 'Guild Lv.', value: 'Lv.8' },
        { labelTh: 'สิทธิพิเศษ', labelEn: 'Perk', value: '-15%', highlight: true },
      ],
    },
  },
];

export const BadmintonFeedSection: React.FC = () => {
  const {
    language,
    navigateTo,
    gainExp,
    dataMode,
    leaderboard,
    setSparringModalPlayer,
  } = useApp();
  const isThai = language === 'th';

  const [activeFilter, setActiveFilter] = useState<FeedCategory>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [expandedFriendId, setExpandedFriendId] = useState<string | null>('usr_art');
  const [cheeredIds, setCheeredIds] = useState<Record<string, boolean>>({});
  const [showAllItems, setShowAllItems] = useState(false);

  // Derive top-ranked guild friends (exclude current user usr_karn_007)
  const topFriendsActivity = useMemo(() => {
    if (dataMode === 'empty') return [];
    const rankedFriends = leaderboard
      .filter((u) => u.id !== 'usr_karn_007' && FRIEND_OUTCOMES_BY_ID[u.id])
      .sort((a, b) => a.rank - b.rank)
      .map((u) => ({
        user: u,
        outcome: FRIEND_OUTCOMES_BY_ID[u.id],
      }));

    if (dataMode === 'one') return rankedFriends.slice(0, 1);
    return activeFilter === 'friends' ? rankedFriends : rankedFriends.slice(0, 4);
  }, [leaderboard, dataMode, activeFilter]);

  const filteredItems = useMemo(() => {
    if (dataMode === 'empty' || activeFilter === 'friends') return [];
    const base =
      activeFilter === 'all'
        ? FEED_ITEMS
        : FEED_ITEMS.filter((item) => item.type === activeFilter);
    if (dataMode === 'one') return base.slice(0, 1);
    return base;
  }, [activeFilter, dataMode]);

  const visibleItems =
    activeFilter === 'all' && !showAllItems
      ? filteredItems.slice(0, 4)
      : filteredItems;

  const toggleExpand = (id: string) => {
    playSelectSound();
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleCheer = (id: string, guildName: string) => {
    const alreadyCheered = Boolean(cheeredIds[id]);
    setCheeredIds((prev) => ({ ...prev, [id]: !alreadyCheered }));
    if (!alreadyCheered) {
      playCoinSound();
      gainExp(
        10,
        isThai
          ? `ส่งกำลังใจให้เพื่อนร่วมก๊วน (${guildName})`
          : `Cheered guild update (${guildName})`
      );
    } else {
      playSelectSound();
    }
  };

  const showFriendActivityBlock =
    dataMode !== 'empty' &&
    (activeFilter === 'all' || activeFilter === 'friends') &&
    topFriendsActivity.length > 0;

  return (
    <section className="space-y-4" aria-label={isThai ? 'ฟีดแบดมินตันก๊วน' : 'Badminton Feed'}>
      {/* Section Header matching ProfileSubHeader */}
      <div className="flex items-end justify-between gap-3 px-1">
        <div className="min-w-0 flex-1">
          <h2 className="text-[13px] font-semibold text-[#6b7280] leading-tight truncate">
            {isThai ? 'ฟีดแบดมินตันก๊วน' : 'Badminton Feed'}
          </h2>
          <p className="text-[11px] text-[#9ca3af] mt-0.5 truncate">
            {isThai
              ? 'กิจกรรมเพื่อน ผลแข่ง ความสำเร็จ และหลักชัยจากก๊วน'
              : 'Friend activity, match results, badges & guild milestones'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playSelectSound();
            navigateTo('E1');
          }}
          className="no-doodle min-h-[36px] px-2.5 py-1 rounded-full bg-[#ffffff] shadow-[0_1px_4px_rgba(0,0,0,0.06)] text-[11px] font-medium text-[#111111] flex items-center gap-1 hover:bg-[#f3f4f6] cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>{isThai ? 'ดูก๊วน' : 'Guilds'}</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[1.75] shrink-0" />
        </button>
      </div>

      {/* Segmented Filter Tab Bar matching Profile UI (5-tab grid) */}
      <div
        data-filter="true"
        className="bg-[#ececef] p-1 rounded-full grid grid-cols-5 gap-1"
      >
        {(
          [
            { id: 'all', label: isThai ? 'ทั้งหมด' : 'All' },
            { id: 'friends', label: isThai ? 'เพื่อน' : 'Friends' },
            { id: 'match', label: isThai ? 'ผลแข่ง' : 'Matches' },
            { id: 'achievement', label: isThai ? 'เหรียญ' : 'Badges' },
            { id: 'milestone', label: isThai ? 'หลักชัย' : 'Milestones' },
          ] as const
        ).map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playSelectSound();
                setActiveFilter(tab.id);
              }}
              className={`no-doodle min-h-[38px] px-1 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap truncate ${
                isActive
                  ? 'bg-[#ffffff] text-[#111111] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                  : 'text-[#6b7280] hover:text-[#111111]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* FRIEND ACTIVITY SUB-SECTION (Profile Grouped Rows Layout) */}
      {showFriendActivityBlock && (
        <div className="space-y-2">
          <div className="flex items-end justify-between gap-3 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="text-[13px] font-semibold text-[#6b7280] leading-tight truncate">
                {isThai ? 'กิจกรรมเพื่อนอันดับท็อป' : 'Friend Activity'}
              </h3>
              <p className="text-[11px] text-[#9ca3af] mt-0.5 truncate">
                {isThai
                  ? 'ผลการแข่งขันล่าสุดของเพื่อนอันดับต้นในก๊วนของคุณ'
                  : 'Recent match outcomes of top-ranked friends in your guild'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                navigateTo('E4');
              }}
              className="no-doodle min-h-[34px] px-2.5 py-1 rounded-full bg-[#ffffff] shadow-[0_1px_4px_rgba(0,0,0,0.06)] text-[11px] font-medium text-[#111111] flex items-center gap-1 hover:bg-[#f3f4f6] cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{isThai ? 'อันดับก๊วน' : 'Rankings'}</span>
              <ArrowRight className="w-3 h-3 stroke-[1.75] shrink-0" />
            </button>
          </div>

          <div className="bg-[#ffffff] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] divide-y divide-[#000000]/[0.06] overflow-hidden">
            {topFriendsActivity.map(({ user, outcome }) => {
              const isExpanded = expandedFriendId === user.id;
              const isWin = outcome.result === 'win';
              const cheerKey = `friend_${user.id}`;
              const isCheered = Boolean(cheeredIds[cheerKey]);
              const cheerCount = outcome.initialCheers + (isCheered ? 1 : 0);
              const friendDisplayName = isThai ? user.name : outcome.nameEn;
              const opponentName = isThai ? outcome.opponentTh : outcome.opponentEn;

              return (
                <div key={user.id} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      setExpandedFriendId(isExpanded ? null : user.id);
                    }}
                    className="no-doodle w-full px-4 py-3.5 min-h-[64px] flex items-center justify-between gap-3 text-left hover:bg-[#f9fafb] active:bg-[#f3f4f6] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative shrink-0">
                        <DoodleAvatar
                          preset={resolveDoodlePreset(user.name)}
                          size="sm"
                          className="w-10 h-10"
                          ringClass={`border-2 border-[#ffffff] ring-1 ${
                            user.rank <= 3 ? 'ring-[#7cd7a0]' : 'ring-[#e5e7eb]'
                          }`}
                        />
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#111111] text-[#ffffff] text-[9px] font-bold leading-none tabular-nums">
                          #{user.rank}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[13px] font-semibold text-[#111111] truncate">
                            {friendDisplayName}
                          </span>
                          <span className="text-[10px] font-medium text-[#71717a] shrink-0 tabular-nums">
                            · {isThai ? `พลัง ${user.ovr}` : `OVR ${user.ovr}`}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#71717a] truncate mt-0.5 tabular-nums">
                          vs {opponentName} · {outcome.setSummary} · {isThai ? outcome.timeTh : outcome.timeEn}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tabular-nums whitespace-nowrap ${
                          isWin
                            ? 'bg-[#e8f7ee] text-[#15803d]'
                            : 'bg-[#fef2f2] text-[#dc2626]'
                        }`}
                      >
                        {isWin
                          ? `${isThai ? 'ชนะ' : 'W'} ${outcome.scoreDisplay}`
                          : `${isThai ? 'แพ้' : 'L'} ${outcome.scoreDisplay}`}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#111111]/75 shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 stroke-[1.75]" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 stroke-[1.75]" />
                        )}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3.5 pt-1 space-y-2.5 bg-[#fafafa]">
                      <div className="grid grid-cols-3 gap-2 text-center tabular-nums">
                        <div className="p-2 rounded-[14px] bg-[#ffffff]">
                          <div className="text-[10px] font-medium text-[#71717a] whitespace-nowrap">
                            {isThai ? 'สปีดตบสูงสุด' : 'Top Smash'}
                          </div>
                          <div className="text-xs font-bold text-[#111111] mt-0.5 whitespace-nowrap">
                            {outcome.topSmashKmh} {isThai ? 'กม./ชม.' : 'km/h'}
                          </div>
                        </div>

                        <div className="p-2 rounded-[14px] bg-[#ffffff]">
                          <div className="text-[10px] font-medium text-[#71717a] whitespace-nowrap">
                            {isThai ? 'ฟอร์ม 5 นัด' : 'Last 5 Form'}
                          </div>
                          <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-bold">
                            {outcome.formStreak.map((res, idx) => (
                              <span
                                key={idx}
                                className={res === 'W' ? 'text-[#15803d]' : 'text-[#dc2626]'}
                              >
                                {res}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-2 rounded-[14px] bg-[#e8f7ee]">
                          <div className="text-[10px] font-medium text-[#15803d] whitespace-nowrap">
                            {isThai ? 'อัตราชนะก๊วน' : 'Win Rate'}
                          </div>
                          <div className="text-xs font-bold text-[#15803d] mt-0.5 whitespace-nowrap">
                            {user.winRate}%
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <span className="text-[11px] text-[#71717a] flex items-center gap-1 min-w-0 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#9ca3af] shrink-0" />
                          <span className="truncate">
                            {isThai ? outcome.venueTh : outcome.venueEn}
                          </span>
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleCheer(
                                cheerKey,
                                isThai ? 'ก๊วนตบสนั่น พระราม 9' : 'Rama 9 Smashers'
                              )
                            }
                            className={`no-doodle min-h-[34px] px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-all whitespace-nowrap tabular-nums ${
                              isCheered
                                ? 'bg-[#e8f7ee] text-[#15803d]'
                                : 'bg-[#ffffff] text-[#111111] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:bg-[#f3f4f6]'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 shrink-0 ${isCheered ? 'fill-current' : ''}`} />
                            <span>{cheerCount}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              playSelectSound();
                              setSparringModalPlayer({
                                name: friendDisplayName,
                                ovr: user.ovr,
                                tier: isThai ? `ลีก ${user.tier}` : `${user.tier} League`,
                                role: user.guildTitle,
                                status: isThai
                                  ? `อันดับ #${user.rank} ก๊วนพระราม 9`
                                  : `Rank #${user.rank} · Rama 9 Guild`,
                                winRate: user.winRate,
                              });
                            }}
                            className="no-doodle min-h-[34px] px-3 py-1 rounded-full bg-gradient-to-b from-[#2b2b2e] to-[#111111] text-[#ffffff] text-[11px] font-medium flex items-center gap-1 cursor-pointer hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
                          >
                            <Swords className="w-3 h-3 shrink-0" />
                            <span>{isThai ? 'ชวนตีก๊วน' : 'Spar'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeFilter !== 'friends' && visibleItems.length === 0 ? (
        <div className="bg-[#ffffff] rounded-[24px] p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-2">
          <div className="text-2xl">🏸</div>
          <div className="text-xs font-semibold text-[#111111]">
            {isThai ? 'ยังไม่มีอัปเดตในหมวดหมู่นี้' : 'No feed updates yet'}
          </div>
          <p className="text-[11px] text-[#71717a]">
            {isThai
              ? 'เข้าร่วมก๊วนหรือลงแข่งเพื่อบันทึกอัปเดตแรกของวัน'
              : 'Join a guild or log a match to share the first update'}
          </p>
        </div>
      ) : activeFilter === 'friends' && topFriendsActivity.length === 0 ? (
        <div className="bg-[#ffffff] rounded-[24px] p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-2">
          <div className="text-2xl">👥</div>
          <div className="text-xs font-semibold text-[#111111]">
            {isThai ? 'ยังไม่มีกิจกรรมเพื่อนในก๊วน' : 'No friend activity yet'}
          </div>
          <p className="text-[11px] text-[#71717a]">
            {isThai
              ? 'ชวนเพื่อนเข้าก๊วนเพื่อติดตามผลแมตช์ล่าสุด'
              : 'Invite friends to your guild to follow their latest match results'}
          </p>
        </div>
      ) : (
        visibleItems.length > 0 && (
          <div className="space-y-2.5">
            {activeFilter === 'all' && (
              <div className="px-1 pt-0.5">
                <h3 className="text-[13px] font-semibold text-[#6b7280] leading-tight truncate">
                  {isThai ? 'อัปเดตล่าสุดจากชุมชน' : 'Community Updates'}
                </h3>
              </div>
            )}

            <div className="space-y-3">
              {visibleItems.map((item) => {
                const isCheered = Boolean(cheeredIds[item.id]);
                const cheerCount = item.initialCheers + (isCheered ? 1 : 0);
                const isExpanded = Boolean(expandedIds[item.id]);

                if (item.type === 'match' && item.match) {
                  const m = item.match;
                  const isDoubles = m.matchType === 'Doubles';
                  const leftLabel = isDoubles
                    ? `${isThai ? m.leftNameTh : m.leftNameEn} & ${isThai ? m.leftPartnerTh : m.leftPartnerEn}`
                    : isThai
                    ? m.leftNameTh
                    : m.leftNameEn;
                  const rightLabel = isDoubles
                    ? `${isThai ? m.rightNameTh : m.rightNameEn} & ${isThai ? m.rightPartnerTh : m.rightPartnerEn}`
                    : isThai
                    ? m.rightNameTh
                    : m.rightNameEn;

                  return (
                    <article
                      key={item.id}
                      className="bg-[#ffffff] rounded-[24px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717a] min-w-0 truncate">
                          <Calendar className="w-3.5 h-3.5 text-[#9ca3af] shrink-0" />
                          <span className="truncate">{isThai ? item.timeTh : item.timeEn}</span>
                          <span className="text-[#d4d4d8]">·</span>
                          <span className="truncate">{isThai ? item.guildTh : item.guildEn}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#e8f7ee] text-[#15803d] text-[11px] font-semibold shrink-0 whitespace-nowrap">
                          {isThai ? 'ผลแข่งก๊วน' : 'Match Result'}
                        </span>
                      </div>

                      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 py-1">
                        <div className="flex flex-col items-center text-center min-w-0">
                          {isDoubles ? (
                            <div className="flex items-center justify-center -space-x-2.5">
                              <DoodleAvatar
                                preset={resolveDoodlePreset(m.leftNameTh)}
                                size="sm"
                                className="w-10 h-10 z-10"
                                ringClass="border-2 border-[#ffffff] ring-1 ring-[#7cd7a0]"
                              />
                              <DoodleAvatar
                                preset={resolveDoodlePreset(m.leftPartnerTh)}
                                size="sm"
                                className="w-10 h-10"
                                ringClass="border-2 border-[#ffffff] ring-1 ring-[#7cd7a0]"
                              />
                            </div>
                          ) : (
                            <DoodleAvatar
                              preset={resolveDoodlePreset(m.leftNameTh)}
                              size="md"
                              className="w-11 h-11"
                              ringClass="border-2 border-[#ffffff] ring-1 ring-[#7cd7a0]"
                            />
                          )}
                          <span className="text-xs font-semibold text-[#111111] truncate w-full mt-1.5 leading-snug">
                            {leftLabel}
                          </span>
                          <span className="text-[10px] text-[#71717a] truncate w-full">
                            {isThai ? m.leftTierTh : m.leftTierEn}
                          </span>
                        </div>

                        <div className="bg-[#f5f5f7] rounded-[18px] px-4 py-2 text-center min-w-[94px] flex flex-col items-center justify-center">
                          <div className="text-[22px] font-bold text-[#111111] tabular-nums leading-tight whitespace-nowrap">
                            {m.scoreDisplay}
                          </div>
                          <div className="text-[10px] font-medium text-[#71717a] tabular-nums whitespace-nowrap mt-0.5">
                            {m.setSummary}
                          </div>
                        </div>

                        <div className="flex flex-col items-center text-center min-w-0">
                          {isDoubles ? (
                            <div className="flex items-center justify-center -space-x-2.5">
                              <DoodleAvatar
                                preset={resolveDoodlePreset(m.rightNameTh)}
                                size="sm"
                                className="w-10 h-10 z-10"
                                ringClass="border-2 border-[#ffffff] ring-1 ring-[#e5e7eb]"
                              />
                              <DoodleAvatar
                                preset={resolveDoodlePreset(m.rightPartnerTh)}
                                size="sm"
                                className="w-10 h-10"
                                ringClass="border-2 border-[#ffffff] ring-1 ring-[#e5e7eb]"
                              />
                            </div>
                          ) : (
                            <DoodleAvatar
                              preset={resolveDoodlePreset(m.rightNameTh)}
                              size="md"
                              className="w-11 h-11"
                              ringClass="border-2 border-[#ffffff] ring-1 ring-[#e5e7eb]"
                            />
                          )}
                          <span className="text-xs font-semibold text-[#111111] truncate w-full mt-1.5 leading-snug">
                            {rightLabel}
                          </span>
                          <span className="text-[10px] text-[#71717a] truncate w-full">
                            {isThai ? m.rightTierTh : m.rightTierEn}
                          </span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-3 rounded-[18px] bg-[#f5f5f7] space-y-2 text-[11px]">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 rounded-[14px] bg-[#ffffff]">
                              <span className="text-[10px] font-medium text-[#71717a] block whitespace-nowrap">
                                {isThai ? 'สปีดตบ' : 'Top Smash'}
                              </span>
                              <span className="text-xs font-semibold text-[#111111] tabular-nums mt-0.5 block">
                                {m.topSmashKmh} {isThai ? 'กม./ชม.' : 'km/h'}
                              </span>
                            </div>
                            <div className="p-2 rounded-[14px] bg-[#ffffff]">
                              <span className="text-[10px] font-medium text-[#71717a] block whitespace-nowrap">
                                {isThai ? 'เวลาแข่ง' : 'Duration'}
                              </span>
                              <span className="text-xs font-semibold text-[#111111] tabular-nums mt-0.5 block">
                                {m.durationMin} {isThai ? 'นาที' : 'min'}
                              </span>
                            </div>
                            <div className="p-2 rounded-[14px] bg-[#e8f7ee]">
                              <span className="text-[10px] font-medium text-[#15803d] block whitespace-nowrap">
                                {isThai ? 'คะแนนก๊วน' : 'Club EXP'}
                              </span>
                              <span className="text-xs font-semibold text-[#15803d] tabular-nums mt-0.5 block">
                                +{m.expBonus}
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-[14px] bg-[#ffffff] flex items-center gap-1.5 text-[#3f3f46]">
                            <Sparkles className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                            <span className="truncate">
                              <strong className="font-semibold text-[#111111]">
                                {isThai ? 'ช็อตเด่น:' : 'Highlight:'}
                              </strong>{' '}
                              {isThai ? m.highlightTh : m.highlightEn}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="pt-2.5 border-t border-[#000000]/[0.06] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#71717a] min-w-0 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#9ca3af] shrink-0" />
                          <span className="truncate">{isThai ? m.venueTh : m.venueEn}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleCheer(item.id, isThai ? item.guildTh : item.guildEn)
                            }
                            className={`no-doodle min-h-[34px] px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-all whitespace-nowrap tabular-nums ${
                              isCheered
                                ? 'bg-[#e8f7ee] text-[#15803d]'
                                : 'bg-[#f3f4f6] text-[#111111] hover:bg-[#e5e7eb]'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 shrink-0 ${isCheered ? 'fill-current' : ''}`} />
                            <span>{cheerCount}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleExpand(item.id)}
                            className="no-doodle min-h-[34px] px-2.5 py-1 rounded-full bg-[#f3f4f6] text-[11px] font-medium text-[#111111] flex items-center gap-1 cursor-pointer hover:bg-[#e5e7eb] transition-colors whitespace-nowrap"
                          >
                            <span>{isExpanded ? (isThai ? 'ซ่อน' : 'Hide') : (isThai ? 'สถิติ' : 'Stats')}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }

                if (item.type === 'achievement' && item.achievement) {
                  const a = item.achievement;
                  return (
                    <article
                      key={item.id}
                      className="bg-[#ffffff] rounded-[24px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <DoodleAvatar
                            preset={resolveDoodlePreset(a.memberNameTh)}
                            size="sm"
                            className="w-10 h-10 shrink-0"
                            ringClass="border-2 border-[#ffffff] ring-1 ring-[#e5e7eb]"
                          />
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-[#111111] truncate">
                              {isThai ? a.memberNameTh : a.memberNameEn}
                            </div>
                            <div className="text-[11px] text-[#71717a] truncate">
                              {isThai ? item.guildTh : item.guildEn} · {isThai ? item.timeTh : item.timeEn}
                            </div>
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full bg-[#fff3ee] text-[#e85729] text-[11px] font-semibold shrink-0 whitespace-nowrap">
                          {isThai ? a.rarityLabelTh : a.rarityLabelEn}
                        </span>
                      </div>

                      <div className="rounded-[18px] bg-[#f5f5f7] p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[14px] bg-[#e8f7ee] text-[#15803d] flex items-center justify-center shrink-0">
                          {a.icon === 'zap' ? (
                            <Zap className="w-5 h-5" />
                          ) : a.icon === 'trophy' ? (
                            <Trophy className="w-5 h-5" />
                          ) : (
                            <Sparkles className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-semibold text-[#111111] leading-snug truncate">
                            {isThai ? a.badgeTitleTh : a.badgeTitleEn}
                          </div>
                          <div className="text-[11px] text-[#71717a] leading-snug mt-0.5">
                            {isThai ? a.badgeDescTh : a.badgeDescEn}
                          </div>
                        </div>
                        <div className="text-right shrink-0 tabular-nums">
                          <div className="text-xs font-bold text-[#15803d]">+{a.expReward}</div>
                          <div className="text-[10px] font-medium text-[#71717a]">{a.progressText}</div>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#000000]/[0.06] flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#71717a] truncate flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#9ca3af] shrink-0" />
                          <span className="truncate">{isThai ? a.memberRankTh : a.memberRankEn}</span>
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleCheer(item.id, isThai ? item.guildTh : item.guildEn)
                            }
                            className={`no-doodle min-h-[34px] px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-all whitespace-nowrap tabular-nums ${
                              isCheered
                                ? 'bg-[#e8f7ee] text-[#15803d]'
                                : 'bg-[#f3f4f6] text-[#111111] hover:bg-[#e5e7eb]'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 shrink-0 ${isCheered ? 'fill-current' : ''}`} />
                            <span>{cheerCount}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              playSelectSound();
                              navigateTo('E3');
                            }}
                            className="no-doodle min-h-[34px] px-3 py-1 rounded-full bg-gradient-to-b from-[#2b2b2e] to-[#111111] text-[#ffffff] text-[11px] font-medium flex items-center gap-1 cursor-pointer hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
                          >
                            <Swords className="w-3 h-3 shrink-0" />
                            <span>{isThai ? 'ท้าดวล' : 'Challenge'}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }

                if (item.type === 'milestone' && item.milestone) {
                  const ml = item.milestone;
                  return (
                    <article
                      key={item.id}
                      className="bg-[#ffffff] rounded-[24px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <DoodleAvatar
                            preset={resolveDoodlePreset(ml.memberNameTh)}
                            size="sm"
                            className="w-10 h-10 shrink-0"
                            ringClass="border-2 border-[#ffffff] ring-1 ring-[#7cd7a0]"
                          />
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-[#111111] truncate">
                              {isThai ? ml.memberNameTh : ml.memberNameEn}
                            </div>
                            <div className="text-[11px] text-[#71717a] truncate">
                              {isThai ? item.guildTh : item.guildEn} · {isThai ? item.timeTh : item.timeEn}
                            </div>
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#111111] text-[11px] font-semibold shrink-0 whitespace-nowrap">
                          {isThai ? 'หลักชัยก๊วน' : 'Milestone'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-[14px] font-semibold text-[#111111] leading-snug">
                          {isThai ? ml.headlineTh : ml.headlineEn}
                        </h3>
                        <p className="text-[11px] text-[#71717a] mt-0.5 leading-snug">
                          {isThai ? ml.summaryTh : ml.summaryEn}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center tabular-nums">
                        {ml.metrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-[14px] ${
                              metric.highlight ? 'bg-[#e8f7ee]' : 'bg-[#f5f5f7]'
                            }`}
                          >
                            <div
                              className={`text-[10px] font-medium whitespace-nowrap ${
                                metric.highlight ? 'text-[#15803d]' : 'text-[#71717a]'
                              }`}
                            >
                              {isThai ? metric.labelTh : metric.labelEn}
                            </div>
                            <div
                              className={`text-sm font-bold leading-tight mt-0.5 whitespace-nowrap ${
                                metric.highlight ? 'text-[#15803d]' : 'text-[#111111]'
                              }`}
                            >
                              {metric.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2.5 border-t border-[#000000]/[0.06] flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#71717a] truncate flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-[#e85729] shrink-0" />
                          <span className="truncate">{isThai ? ml.memberSubTh : ml.memberSubEn}</span>
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleCheer(item.id, isThai ? item.guildTh : item.guildEn)
                            }
                            className={`no-doodle min-h-[34px] px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-all whitespace-nowrap tabular-nums ${
                              isCheered
                                ? 'bg-[#e8f7ee] text-[#15803d]'
                                : 'bg-[#f3f4f6] text-[#111111] hover:bg-[#e5e7eb]'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 shrink-0 ${isCheered ? 'fill-current' : ''}`} />
                            <span>{cheerCount}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              playSelectSound();
                              navigateTo('E4');
                            }}
                            className="no-doodle min-h-[34px] px-3 py-1 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#111111] text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                          >
                            <span>{isThai ? 'อันดับก๊วน' : 'Rankings'}</span>
                            <ArrowRight className="w-3 h-3 shrink-0" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }

                return null;
              })}
            </div>
          </div>
        )
      )}

      {/* Expand / Collapse Remaining Feed CTA (Profile-style clean button) */}
      {activeFilter === 'all' && filteredItems.length > 4 && (
        <button
          type="button"
          onClick={() => {
            playSelectSound();
            setShowAllItems((prev) => !prev);
          }}
          className="no-doodle w-full min-h-[44px] py-2.5 px-4 rounded-full bg-[#ffffff] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:bg-[#fafafa] text-[#111111] text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
        >
          <span>
            {showAllItems
              ? (isThai ? 'แสดงน้อยลง' : 'Show fewer updates')
              : (isThai
                  ? `ดูฟีดก๊วนทั้งหมด (${filteredItems.length})`
                  : `View all feed updates (${filteredItems.length})`)}
          </span>
          {showAllItems ? (
            <ChevronUp className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          )}
        </button>
      )}
    </section>
  );
};
