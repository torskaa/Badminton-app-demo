import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Trophy,
  Zap,
  Watch,
  ChevronDown,
  ChevronUp,
  Calendar,
  Crosshair,
  QrCode,
  UserCog,
  Crown,
  Plus,
  MapPin,
  Sparkles,
  Settings,
  Share2,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProSubscriptionModal } from '../common/ProSubscriptionModal';
import { AppSettingsModal } from '../common/AppSettingsModal';
import { ShareAchievementModal } from '../common/ShareAchievementModal';
import { DoodleAvatar, resolveDoodlePreset } from '../common/DoodleAvatar';
import { PlayerStatsPanel } from '../profile/PlayerStatsPanel';
import { PlayerSkillRadarCard } from '../profile/PlayerSkillRadarCard';
import { playCoinSound, playSelectSound } from '../../utils/retroAudio';

export interface PastMatchResult {
  id: string;
  opponent: {
    name: string;
    nameTh?: string;
    nameEn?: string;
    tier: string;
    club: string;
    avatars: string[];
  };
  courtName: string;
  courtNameTh?: string;
  courtNameEn?: string;
  date: string;
  dateTh?: string;
  dateEn?: string;
  result: 'win' | 'loss';
  matchType: 'Singles' | 'Doubles';
  partnerName?: string;
  partnerNameTh?: string;
  partnerNameEn?: string;
  partnerAvatar?: string;
  scores: { set: number; userScore: number; opponentScore: number }[];
  finalScore: string;
  durationMin: number;
  expGained: number;
  highestSmashKmh: number;
  highlightShot: string;
  highlightShotTh?: string;
  highlightShotEn?: string;
}

const AVATARS = {
  ohm: 'ohm',
  bank: 'bank',
  top: 'top',
  ploy: 'ploy',
  meen: 'meen',
};

export const INITIAL_PAST_MATCHES: PastMatchResult[] = [
  {
    id: 'match_01',
    opponent: {
      name: 'โอห์ม ปืนกล',
      nameTh: 'โอห์ม ปืนกล',
      nameEn: 'Ohm Machinegun',
      tier: 'Diamond League',
      club: 'Rama 9 Smashers',
      avatars: [AVATARS.ohm],
    },
    courtName: 'Winner Arena Badminton Rama 9 (Court 3)',
    courtNameTh: 'วินเนอร์ อารีน่า พระราม 9 (คอร์ท 3)',
    courtNameEn: 'Winner Arena Badminton Rama 9 (Court 3)',
    date: '7 พ.ย. 2026 · 19:30 น.',
    dateTh: '7 พ.ย. 2026 · 19:30 น.',
    dateEn: 'Nov 7, 2026 · 7:30 PM',
    result: 'win',
    matchType: 'Singles',
    scores: [
      { set: 1, userScore: 21, opponentScore: 18 },
      { set: 2, userScore: 19, opponentScore: 21 },
      { set: 3, userScore: 21, opponentScore: 19 },
    ],
    finalScore: '2 - 1',
    durationMin: 48,
    expGained: 150,
    highestSmashKmh: 342,
    highlightShot: 'Steep Jump Smash (Corner Line)',
    highlightShotTh: 'ลูกจัมป์สแมชมุมคอร์ทเฉียบคม',
    highlightShotEn: 'Steep Jump Smash (Corner Line)',
  },
  {
    id: 'match_02',
    opponent: {
      name: 'แบงค์ & ท็อป',
      nameTh: 'แบงค์ & ท็อป',
      nameEn: 'Bank & Top',
      tier: 'Gold League',
      club: 'BKK Weekend Shuttlers',
      avatars: [AVATARS.bank, AVATARS.top],
    },
    partnerName: 'พลอย จอมหยอด',
    partnerNameTh: 'พลอย',
    partnerNameEn: 'Ploy',
    partnerAvatar: AVATARS.ploy,
    courtName: 'สนามแบดอินฟินิตี้ หทัยราษฎร์',
    courtNameTh: 'สนามแบดอินฟินิตี้ หทัยราษฎร์',
    courtNameEn: 'Infinity Badminton Hathairat',
    date: '5 พ.ย. 2026 · 20:00 น.',
    dateTh: '5 พ.ย. 2026 · 20:00 น.',
    dateEn: 'Nov 5, 2026 · 8:00 PM',
    result: 'win',
    matchType: 'Doubles',
    scores: [
      { set: 1, userScore: 21, opponentScore: 15 },
      { set: 2, userScore: 21, opponentScore: 17 },
    ],
    finalScore: '2 - 0',
    durationMin: 36,
    expGained: 120,
    highestSmashKmh: 328,
    highlightShot: 'Double Net Kill Tap & Intercept',
    highlightShotTh: 'การตัดหยอดหน้าเน็ตคู่ชิดเสา',
    highlightShotEn: 'Double Net Kill Tap & Intercept',
  },
  {
    id: 'match_03',
    opponent: {
      name: 'อาร์ท สปีด',
      nameTh: 'อาร์ท สปีด',
      nameEn: 'Art Speedster',
      tier: 'Diamond League',
      club: 'Rama 9 Smashers',
      avatars: [AVATARS.top],
    },
    courtName: 'Sport Refresh ลำลูกกา คลอง 4',
    courtNameTh: 'สปอร์ต รีเฟรช ลำลูกกา คลอง 4 (คอร์ท 5)',
    courtNameEn: 'Sport Refresh Lam Luk Ka Klong 4 (Court 5)',
    date: '2 พ.ย. 2026 · 18:15 น.',
    dateTh: '2 พ.ย. 2026 · 18:15 น.',
    dateEn: 'Nov 2, 2026 · 6:15 PM',
    result: 'loss',
    matchType: 'Singles',
    scores: [
      { set: 1, userScore: 17, opponentScore: 21 },
      { set: 2, userScore: 21, opponentScore: 16 },
      { set: 3, userScore: 18, opponentScore: 21 },
    ],
    finalScore: '1 - 2',
    durationMin: 55,
    expGained: 60,
    highestSmashKmh: 315,
    highlightShot: 'Full-Court Rally 34 Strokes',
    highlightShotTh: 'การตีโต้เต็มคอร์ท 34 จังหวะ',
    highlightShotEn: 'Full-Court Rally 34 Strokes',
  },
  {
    id: 'match_04',
    opponent: {
      name: 'มีน & นัท',
      nameTh: 'มีน & นัท',
      nameEn: 'Meen & Nat',
      tier: 'Silver League',
      club: 'Rama 9 Smashers',
      avatars: [AVATARS.meen, AVATARS.bank],
    },
    partnerName: 'โอห์ม ปืนกล',
    partnerNameTh: 'โอห์ม',
    partnerNameEn: 'Ohm',
    partnerAvatar: AVATARS.ohm,
    courtName: '71 Sport Club เอกมัย-ปรีดี',
    courtNameTh: '71 สปอร์ตคลับ เอกมัย-ปรีดี (คอร์ท 2)',
    courtNameEn: '71 Sport Club Ekkamai-Pridi (Court 2)',
    date: '28 ต.ค. 2026 · 19:00 น.',
    dateTh: '28 ต.ค. 2026 · 19:00 น.',
    dateEn: 'Oct 28, 2026 · 7:00 PM',
    result: 'win',
    matchType: 'Doubles',
    scores: [
      { set: 1, userScore: 21, opponentScore: 12 },
      { set: 2, userScore: 21, opponentScore: 14 },
    ],
    finalScore: '2 - 0',
    durationMin: 29,
    expGained: 100,
    highestSmashKmh: 336,
    highlightShot: 'Flick Serve Receiver Smash',
    highlightShotTh: 'ลูกตบสวนกลับจากการเสิร์ฟสะบัด',
    highlightShotEn: 'Flick Serve Receiver Smash',
  },
];

const FaceAvatar: React.FC<{
  src?: string;
  label: string;
  className?: string;
  accentClass?: string;
}> = ({ src, label, className = 'w-11 h-11', accentClass = 'border-white' }) => {
  const preset = resolveDoodlePreset(src || label);
  return (
    <DoodleAvatar
      preset={preset}
      seed={label}
      className={className}
      ringClass={`border-2 ${accentClass} shadow-xs`}
    />
  );
};

interface ProfileMenuRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  rightLabel?: string;
}

const ProfileMenuRow: React.FC<ProfileMenuRowProps> = ({
  icon,
  title,
  subtitle,
  onClick,
  rightLabel,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="no-doodle w-full px-4 py-3.5 min-h-[58px] flex items-center justify-between gap-3 text-left hover:bg-[#f9fafb] active:bg-[#f3f4f6] transition-colors cursor-pointer"
  >
    <div className="flex items-center gap-3.5 min-w-0 flex-1">
      <div className="text-[#1f2937] shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium text-[#111111] leading-snug truncate">
          {title}
        </div>
        {subtitle && (
          <div className="text-[11px] font-normal text-[#71717a] leading-snug truncate mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      {rightLabel && (
        <span className="text-[11px] font-medium text-[#71717a] whitespace-nowrap">
          {rightLabel}
        </span>
      )}
      <span className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#111111]/75 shrink-0">
        <ArrowRight className="w-4 h-4 stroke-[1.75]" />
      </span>
    </div>
  </button>
);

interface ProfileSubHeaderProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

const ProfileSubHeader: React.FC<ProfileSubHeaderProps> = ({ title, subtitle, rightSlot }) => (
  <div className="flex items-end justify-between gap-3 px-1">
    <div className="min-w-0 flex-1">
      <h2 className="text-[13px] font-semibold text-[#6b7280] leading-tight truncate">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[11px] text-[#9ca3af] mt-0.5 truncate">
          {subtitle}
        </p>
      )}
    </div>
    {rightSlot && <div className="shrink-0">{rightSlot}</div>}
  </div>
);

interface MatchFaceOffCardProps {
  match: PastMatchResult;
  userDisplayName: string;
  userAvatarUrl: string;
  isThai: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAnalyze?: () => void;
}

const MatchFaceOffCard: React.FC<MatchFaceOffCardProps> = ({
  match,
  userDisplayName,
  userAvatarUrl,
  isThai,
  isExpanded,
  onToggleExpand,
  onAnalyze,
}) => {
  const isWin = match.result === 'win';
  const isDoubles = match.matchType === 'Doubles';
  const userShortName = userDisplayName.split(' ')[0] || (isThai ? 'คุณ' : 'You');
  const partnerShortName = isThai
    ? (match.partnerNameTh || match.partnerName || 'คู่หู')
    : (match.partnerNameEn || match.partnerName || 'Partner');
  const teamALabel = isDoubles ? `${userShortName} & ${partnerShortName}` : userShortName;
  const teamBLabel = isThai
    ? (match.opponent.nameTh || match.opponent.name)
    : (match.opponent.nameEn || match.opponent.name);

  const tierLabel = isThai
    ? match.opponent.tier
        .replace('Diamond League', 'ลีกไดมอนด์')
        .replace('Platinum League', 'ลีกแพลทินัม')
        .replace('Gold League', 'ลีกโกลด์')
        .replace('Silver League', 'ลีกซิลเวอร์')
        .replace('Bronze League', 'ลีกบรอนซ์')
    : match.opponent.tier;

  const scoreDisplay = match.finalScore.replace('-', ':');
  const setSummary = match.scores.map((s) => `${s.userScore}-${s.opponentScore}`).join(' · ');

  return (
    <div className="rounded-[24px] bg-[#ffffff] p-4 space-y-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
      {/* Top Row: Clean unboxed date + match format on left, subtle semantic result chip on right */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717a] min-w-0 truncate">
          <Calendar className="w-3.5 h-3.5 text-[#9ca3af] shrink-0" />
          <span className="truncate">
            {isThai ? (match.dateTh || match.date) : (match.dateEn || match.date)}
          </span>
          <span className="text-[#d4d4d8]">·</span>
          <span className="shrink-0">
            {isThai ? (isDoubles ? 'ประเภทคู่' : 'ประเภทเดี่ยว') : match.matchType}
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 whitespace-nowrap ${
            isWin ? 'bg-[#e8f7ee] text-[#15803d]' : 'bg-[#fef2f2] text-[#dc2626]'
          }`}
        >
          {isWin ? (isThai ? 'ชนะ' : 'Won') : (isThai ? 'แพ้' : 'Lost')}
        </span>
      </div>

      {/* Centerpiece: 2-Sided Matchup */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 py-1">
        {/* Left Side: User Team */}
        <div className="flex flex-col items-center text-center min-w-0">
          {isDoubles ? (
            <div className="flex items-center justify-center -space-x-2.5">
              <FaceAvatar
                src={userAvatarUrl}
                label={userShortName}
                className="w-10 h-10 z-10"
                accentClass="border-[#ffffff] ring-1 ring-[#7cd7a0] bg-[#e8f7ee]"
              />
              <FaceAvatar
                src={match.partnerAvatar}
                label={partnerShortName}
                className="w-10 h-10"
                accentClass="border-[#ffffff] ring-1 ring-[#7cd7a0] bg-[#e8f7ee]"
              />
            </div>
          ) : (
            <FaceAvatar
              src={userAvatarUrl}
              label={userShortName}
              className="w-11 h-11"
              accentClass="border-[#ffffff] ring-1 ring-[#7cd7a0] bg-[#e8f7ee]"
            />
          )}
          <span className="text-xs font-semibold text-[#111111] truncate w-full mt-1.5 leading-snug">
            {teamALabel}
          </span>
          <span className="text-[10px] font-normal text-[#71717a] truncate w-full">
            {isThai ? 'ทีมเรา' : 'You'}
          </span>
        </div>

        {/* Center: Soft Score Capsule */}
        <div className="bg-[#f5f5f7] rounded-[18px] px-4 py-2 text-center min-w-[96px] flex flex-col items-center justify-center">
          <div className="text-[22px] font-bold text-[#111111] tabular-nums leading-tight whitespace-nowrap">
            {scoreDisplay}
          </div>
          <div className="text-[10px] font-medium text-[#71717a] tabular-nums whitespace-nowrap mt-0.5">
            {setSummary}
          </div>
        </div>

        {/* Right Side: Opponent Team */}
        <div className="flex flex-col items-center text-center min-w-0">
          {isDoubles && match.opponent.avatars.length > 1 ? (
            <div className="flex items-center justify-center -space-x-2.5">
              <FaceAvatar
                src={match.opponent.avatars[0]}
                label={teamBLabel}
                className="w-10 h-10 z-10"
                accentClass="border-[#ffffff] ring-1 ring-[#e5e7eb] bg-[#f5f5f7]"
              />
              <FaceAvatar
                src={match.opponent.avatars[1]}
                label={teamBLabel}
                className="w-10 h-10"
                accentClass="border-[#ffffff] ring-1 ring-[#e5e7eb] bg-[#f5f5f7]"
              />
            </div>
          ) : (
            <FaceAvatar
              src={match.opponent.avatars[0]}
              label={teamBLabel}
              className="w-11 h-11"
              accentClass="border-[#ffffff] ring-1 ring-[#e5e7eb] bg-[#f5f5f7]"
            />
          )}
          <span className="text-xs font-semibold text-[#111111] truncate w-full mt-1.5 leading-snug">
            {teamBLabel}
          </span>
          <span className="text-[10px] font-normal text-[#71717a] truncate w-full">
            {tierLabel}
          </span>
        </div>
      </div>

      {/* Bottom Footer: Hairline Divider + Venue + Circular Expand Button */}
      <div className="pt-2.5 border-t border-[#000000]/[0.06] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-normal text-[#71717a] min-w-0 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#9ca3af] shrink-0" />
          <span className="truncate">
            {isThai ? (match.courtNameTh || match.courtName) : (match.courtNameEn || match.courtName)}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleExpand}
          className="no-doodle px-2.5 py-1.5 min-h-[34px] rounded-full bg-[#f3f4f6] text-[11px] font-medium text-[#111111] flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap hover:bg-[#e5e7eb] transition-colors"
        >
          <span>{isExpanded ? (isThai ? 'ซ่อน' : 'Hide') : (isThai ? 'สถิติ' : 'Stats')}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          )}
        </button>
      </div>

      {/* Expandable Telemetry Drawer */}
      {isExpanded && (
        <div className="p-3 rounded-[18px] bg-[#f5f5f7] space-y-2.5 text-[11px]">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-[14px] bg-[#ffffff]">
              <span className="text-[10px] font-medium text-[#71717a] block whitespace-nowrap">
                {isThai ? 'สปีดตบ' : 'Top Smash'}
              </span>
              <span className="text-xs font-semibold text-[#111111] whitespace-nowrap tabular-nums mt-0.5 block">
                {match.highestSmashKmh} {isThai ? 'กม./ชม.' : 'km/h'}
              </span>
            </div>
            <div className="p-2.5 rounded-[14px] bg-[#ffffff]">
              <span className="text-[10px] font-medium text-[#71717a] block whitespace-nowrap">
                {isThai ? 'เวลาแข่ง' : 'Duration'}
              </span>
              <span className="text-xs font-semibold text-[#111111] whitespace-nowrap tabular-nums mt-0.5 block">
                {match.durationMin} {isThai ? 'นาที' : 'min'}
              </span>
            </div>
            <div className="p-2.5 rounded-[14px] bg-[#e8f7ee]">
              <span className="text-[10px] font-medium text-[#15803d] block whitespace-nowrap">
                {isThai ? 'คะแนนที่ได้' : 'Points'}
              </span>
              <span className="text-xs font-semibold text-[#15803d] whitespace-nowrap tabular-nums mt-0.5 block">
                +{match.expGained}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-[14px] bg-[#ffffff] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Sparkles className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
              <span className="truncate text-[#3f3f46]">
                <strong className="font-semibold text-[#111111]">
                  {isThai ? 'ไฮไลต์:' : 'Highlight:'}
                </strong>{' '}
                {isThai
                  ? (match.highlightShotTh || match.highlightShot)
                  : (match.highlightShotEn || match.highlightShot)}
              </span>
            </div>
            {onAnalyze && (
              <button
                type="button"
                onClick={onAnalyze}
                className="no-doodle px-3 py-1.5 rounded-full bg-gradient-to-b from-[#2b2b2e] to-[#111111] text-[#ffffff] text-[11px] font-medium hover:opacity-90 cursor-pointer active:scale-95 transition-all whitespace-nowrap shrink-0"
              >
                {isThai ? 'วิเคราะห์ช็อต' : 'Analyze'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const F1_UserProfileTrophyScreen: React.FC = () => {
  const { player, navigateTo, goBack, booking, gainExp, language } = useApp();
  const isThai = language === 'th';
  const [activeTab, setActiveTab] = useState<'card' | 'stats' | 'matches' | 'trophies' | 'gear'>('card');
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareAchievementOpen, setIsShareAchievementOpen] = useState(false);

  const [matches, setMatches] = useState<PastMatchResult[]>(INITIAL_PAST_MATCHES);
  const [matchFilter, setMatchFilter] = useState<'all' | 'win' | 'loss' | 'Singles' | 'Doubles'>('all');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>('match_01');

  const totalMatchesCount = matches.length;
  const winsCount = matches.filter((m) => m.result === 'win').length;
  const winRatePercentage = totalMatchesCount > 0 ? Math.round((winsCount / totalMatchesCount) * 100) : 0;
  const totalExpFromMatches = matches.reduce((sum, m) => sum + m.expGained, 0);
  const unlockedBadgesCount = player.badges.filter((b) => b.unlocked).length;

  const filteredMatches = matches.filter((m) => {
    if (matchFilter === 'all') return true;
    if (matchFilter === 'win') return m.result === 'win';
    if (matchFilter === 'loss') return m.result === 'loss';
    if (matchFilter === 'Singles') return m.matchType === 'Singles';
    if (matchFilter === 'Doubles') return m.matchType === 'Doubles';
    return true;
  });

  const handleSimulateNewMatch = () => {
    playCoinSound();
    const newMatch: PastMatchResult = {
      id: `match_${Date.now()}`,
      opponent: {
        name: isThai ? 'แชมป์ สแมชไฟเออร์' : 'Champ Smashfire',
        tier: isThai ? 'ลีกไดมอนด์' : 'Diamond League',
        club: isThai ? 'สโมสรสแมชกรุงเทพ' : 'Bangkok Clash Arena',
        avatars: [AVATARS.ohm],
      },
      courtName: isThai ? 'สแมช อารีน่า พระราม 9 (คอร์ท 1)' : 'Smash Arena Rama 9 (Court 1)',
      date: isThai ? 'วันนี้ เมื่อสักครู่' : 'Today Just now',
      result: 'win',
      matchType: 'Singles',
      scores: [
        { set: 1, userScore: 21, opponentScore: 19 },
        { set: 2, userScore: 22, opponentScore: 20 },
      ],
      finalScore: '2 - 0',
      durationMin: 38,
      expGained: 160,
      highestSmashKmh: 348,
      highlightShot: isThai ? 'ลูกตบปิดแต้มช่วงดิวซ์' : 'Clutch Deuce Winning Smash',
    };
    setMatches([newMatch, ...matches]);
    setExpandedMatchId(newMatch.id);
    gainExp(160, isThai ? 'บันทึกชัยชนะแมตช์ใหม่แล้ว' : 'Saved new match victory');
  };

  const displayName = isThai
    ? (player.nameTh || 'กานต์ ธนวัฒน์')
    : (player.nameEn || 'Karn Tanawat');
  const playstyleLabel = isThai
    ? (player.playstyleTh || 'สายบุกตบสแมชดุดัน')
    : (player.playstyleEn || player.playstyle);

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28 bg-[#f5f5f7] text-[#111111]">
      {/* Minimal Sticky Top Bar + Centered Hero Backdrop */}
      <div className="bg-gradient-to-b from-[#ffffff] via-[#fafafc] to-[#f5f5f7] pb-5">
        <header className="sticky top-0 z-30 app-header-safe px-5 pb-3 flex items-center justify-between gap-2 bg-[#ffffff]/80 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              goBack();
            }}
            aria-label={isThai ? 'ย้อนกลับ' : 'Back'}
            className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#111111] hover:bg-[#f3f4f6] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </button>

          <h1 className="text-[15px] font-semibold text-[#111111] tracking-tight truncate text-center">
            {isThai ? 'โปรไฟล์' : 'Profile'}
          </h1>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setIsSettingsOpen(true);
            }}
            aria-label={isThai ? 'ตั้งค่า' : 'Settings'}
            className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#111111] hover:bg-[#f3f4f6] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Settings className="w-4 h-4 stroke-[1.9]" />
          </button>
        </header>

        {/* Centered Profile Identity Hero (Matches Reference Image) */}
        <div className="px-5 pt-2 flex flex-col items-center text-center">
          <div className="p-1 rounded-full bg-[#e8f7ee]/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <DoodleAvatar
              preset="karn"
              size="xl"
              ringClass="border-2 border-[#ffffff]"
            />
          </div>

          <h2 className="mt-3 text-[24px] font-semibold text-[#111111] leading-tight tracking-tight">
            {displayName}
          </h2>

          <p className="mt-1 text-xs font-normal text-[#71717a] max-w-[300px] leading-relaxed">
            {isThai
              ? `${playstyleLabel} · ลีกไดมอนด์ · พลังรวม 85`
              : `${playstyleLabel} · Diamond League · 85 OVR`}
          </p>

          {/* Subtle Compact Stats Strip */}
          <div className="mt-4 w-full max-w-md grid grid-cols-4 gap-2 bg-[#ffffff] rounded-[22px] p-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="py-1.5 rounded-[14px] bg-[#f5f5f7]">
              <div className="text-[10px] font-medium text-[#71717a] whitespace-nowrap">
                {isThai ? 'พลังตบ' : 'Power'}
              </div>
              <div className="text-base font-semibold text-[#111111] tabular-nums mt-0.5">
                {player.skillRadar.power}
              </div>
            </div>
            <div className="py-1.5 rounded-[14px] bg-[#f5f5f7]">
              <div className="text-[10px] font-medium text-[#71717a] whitespace-nowrap">
                {isThai ? 'ความเร็ว' : 'Speed'}
              </div>
              <div className="text-base font-semibold text-[#111111] tabular-nums mt-0.5">
                {player.skillRadar.speed}
              </div>
            </div>
            <div className="py-1.5 rounded-[14px] bg-[#f5f5f7]">
              <div className="text-[10px] font-medium text-[#71717a] whitespace-nowrap">
                {isThai ? 'คุมลูก' : 'Control'}
              </div>
              <div className="text-base font-semibold text-[#111111] tabular-nums mt-0.5">
                {player.skillRadar.control}
              </div>
            </div>
            <div className="py-1.5 rounded-[14px] bg-[#e8f7ee]">
              <div className="text-[10px] font-medium text-[#15803d] whitespace-nowrap">
                {isThai ? `เลเวล ${player.level}` : `Lv.${player.level}`}
              </div>
              <div className="text-base font-semibold text-[#15803d] tabular-nums mt-0.5">
                {player.currentExp.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Clean Segmented Tab Bar */}
          <div
            data-filter="true"
            className="mt-4 w-full max-w-md bg-[#ececef] p-1 rounded-full grid grid-cols-5 gap-1"
          >
            {(
              [
                { id: 'card', label: isThai ? 'หน้าหลัก' : 'Overview' },
                { id: 'stats', label: isThai ? 'สถิติ' : 'Stats' },
                { id: 'matches', label: isThai ? 'แมตช์' : 'Matches' },
                { id: 'trophies', label: isThai ? 'เหรียญ' : 'Badges' },
                { id: 'gear', label: isThai ? 'อุปกรณ์' : 'Gear' },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setActiveTab(tab.id);
                  }}
                  className={`no-doodle min-h-[38px] px-1.5 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap truncate ${
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
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 pt-2 space-y-5 max-w-2xl w-full mx-auto">
        {activeTab === 'card' && (
          <div className="space-y-5">
            {/* Featured Top Banner Card (Matching Reference "Invite friends" Card) */}
            <button
              type="button"
              onClick={() => {
                setIsProModalOpen(true);
                playCoinSound();
              }}
              className="no-doodle relative w-full rounded-[24px] bg-[#ffffff] p-4 min-h-[72px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-[#fafafa] active:scale-[0.99] transition-all"
            >
              {/* Soft right-side decorative gradient sweep matching reference image */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-[#7cd7a0]/45 via-[#a7f3d0]/20 to-transparent"
              />
              <div className="relative flex items-center gap-3.5 min-w-0 flex-1">
                <Crown className="w-5 h-5 stroke-[1.75] text-[#111111] shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-[#111111] truncate">
                    {isThai ? 'สมาชิกสแมชโปร' : 'Smash Pro Membership'}
                  </div>
                  <div className="text-[11px] text-[#71717a] truncate mt-0.5">
                    {isThai
                      ? 'ลดค่าคอร์ท 10% · วิเคราะห์เกมไม่จำกัด'
                      : '10% off courts · Unlimited AI analysis'}
                  </div>
                </div>
              </div>
              <div className="relative flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-full bg-[#111111] text-[#ffffff] text-[10px] font-semibold whitespace-nowrap">
                  {player.tier === 'Pro'
                    ? (isThai ? 'ใช้งานอยู่' : 'Active')
                    : (isThai ? '฿199/ด.' : '฿199/mo')}
                </span>
              </div>
            </button>

            {/* Circular Skill Radar Card on Overview Tab */}
            <div className="space-y-2">
              <ProfileSubHeader
                title={isThai ? 'ค่าพลังและทักษะผู้เล่น' : 'Player Skill Breakdown'}
              />
              <PlayerSkillRadarCard onOpenCoachRadar={() => navigateTo('D1')} />
            </div>

            {/* Grouped Menu 1: Court Pass, Wearable, Playstyle, Share */}
            <div className="space-y-2">
              <ProfileSubHeader title={isThai ? 'บัญชีและคอร์ทของคุณ' : 'Account & Court Tools'} />
              <div className="bg-[#ffffff] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] divide-y divide-[#000000]/[0.06] overflow-hidden">
                <ProfileMenuRow
                  icon={<BarChart3 className="w-5 h-5 stroke-[1.65]" />}
                  title={isThai ? 'สถิติผู้เล่นเชิงลึก' : 'Player Match Stats'}
                  subtitle={isThai ? 'คะแนนเฉลี่ย ตารางอันดับ และ H2H' : 'Averages, standings & H2H records'}
                  rightLabel={isThai ? 'H2H' : 'View'}
                  onClick={() => {
                    playSelectSound();
                    setActiveTab('stats');
                  }}
                />
                <ProfileMenuRow
                  icon={<QrCode className="w-5 h-5 stroke-[1.65]" />}
                  title={isThai ? 'บัตรเข้าคอร์ทของฉัน' : 'My Active Court Pass'}
                  subtitle={
                    isThai
                      ? `${booking.court?.name || 'สแมช อารีน่า พระราม 9'} · คอร์ท ${booking.selectedCourtNumber || 3}`
                      : `${booking.court?.name || 'Smash Arena Rama 9'} · Court ${booking.selectedCourtNumber || 3}`
                  }
                  rightLabel={isThai ? 'พร้อมใช้' : 'Ready'}
                  onClick={() => {
                    playSelectSound();
                    navigateTo('B4');
                  }}
                />
                <ProfileMenuRow
                  icon={<Watch className="w-5 h-5 stroke-[1.65]" />}
                  title={isThai ? 'ซิงค์นาฬิกาและสุขภาพ' : 'Smart Wearable Sync'}
                  subtitle={
                    isThai
                      ? '164 ครั้ง/นาที · 480 แคลอรี · ซิงค์แล้ว'
                      : '164 BPM · 480 kcal · Synced'
                  }
                  onClick={() => {
                    playSelectSound();
                    navigateTo('F2');
                  }}
                />
                <ProfileMenuRow
                  icon={<UserCog className="w-5 h-5 stroke-[1.65]" />}
                  title={isThai ? 'แก้ไขสไตล์และมือถนัด' : 'Playstyle & Grip Hand'}
                  subtitle={
                    isThai
                      ? 'ปรับสายตบ มือถนัด และเป้าหมาย'
                      : 'Customize playstyle, grip & goals'
                  }
                  onClick={() => {
                    playSelectSound();
                    navigateTo('A2');
                  }}
                />
                <ProfileMenuRow
                  icon={<Share2 className="w-5 h-5 stroke-[1.65]" />}
                  title={isThai ? 'แชร์การ์ดความสำเร็จ' : 'Share Achievement Card'}
                  subtitle={
                    isThai
                      ? `ปลดล็อก ${unlockedBadgesCount}/${player.badges.length} เหรียญรางวัล`
                      : `${unlockedBadgesCount}/${player.badges.length} trophies unlocked`
                  }
                  onClick={() => {
                    playSelectSound();
                    setIsShareAchievementOpen(true);
                  }}
                />
              </div>
            </div>

            {/* Grouped Menu 2: Training, Courts, App Settings */}
            <div className="space-y-2">
              <ProfileSubHeader title={isThai ? 'การฝึกซ้อมและการตั้งค่า' : 'Training & Preferences'} />
              <div className="bg-[#ffffff] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] divide-y divide-[#000000]/[0.06] overflow-hidden">
                <ProfileMenuRow
                  icon={<Crosshair className="w-5 h-5 stroke-[1.65]" />}
                  title={isThai ? 'เรดาร์โค้ชและพัฒนาการ' : 'Coach Skill Radar'}
                  subtitle={
                    isThai
                      ? 'ติดตามทักษะ 5 มิติรายเดือน'
                      : 'Track 5-axis skill progress'
                  }
                  onClick={() => {
                    playSelectSound();
                    navigateTo('D1');
                  }}
                />
                <ProfileMenuRow
                  icon={<Calendar className="w-5 h-5 stroke-[1.65]" />}
                  title={isThai ? 'จองสนามแบดมินตัน' : 'Book Badminton Courts'}
                  subtitle={
                    isThai
                      ? 'ค้นหาคอร์ทว่างใกล้คุณ'
                      : 'Browse nearby open courts'
                  }
                  onClick={() => {
                    playSelectSound();
                    navigateTo('B1');
                  }}
                />
                <ProfileMenuRow
                  icon={<Settings className="w-5 h-5 stroke-[1.65]" />}
                  title={isThai ? 'ภาษาและเสียงแจ้งเตือน' : 'Language & Sound Settings'}
                  subtitle={
                    isThai
                      ? 'สลับภาษาไทย/อังกฤษและเสียงระบบ'
                      : 'Switch language, audio & sync'
                  }
                  rightLabel={isThai ? 'ไทย' : 'EN'}
                  onClick={() => {
                    playSelectSound();
                    setIsSettingsOpen(true);
                  }}
                />
              </div>
            </div>

            {/* Past Match Results Section */}
            <div className="space-y-2.5">
              <ProfileSubHeader
                title={isThai ? 'ประวัติการแข่งขัน' : 'Match History'}
                subtitle={isThai ? 'บันทึกผลการแข่งล่าสุดและสถิติคอร์ท' : 'Recent scores & court stats'}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      setActiveTab('matches');
                    }}
                    className="no-doodle min-h-[36px] px-2.5 py-1 rounded-full bg-[#ffffff] shadow-[0_1px_4px_rgba(0,0,0,0.06)] text-[11px] font-medium text-[#111111] flex items-center gap-1.5 hover:bg-[#f3f4f6] cursor-pointer whitespace-nowrap"
                  >
                    <span>{isThai ? 'ดูทั้งหมด' : 'See all'}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[1.75] shrink-0" />
                  </button>
                }
              />

              {/* Quick Stats Summary Card */}
              <div className="bg-[#ffffff] rounded-[24px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-[16px] bg-[#f5f5f7]">
                  <div className="text-[10px] font-medium text-[#71717a] whitespace-nowrap">
                    {isThai ? 'อัตราชนะ' : 'Win Rate'}
                  </div>
                  <div className="text-lg font-bold text-[#111111] leading-tight tabular-nums mt-0.5 whitespace-nowrap">
                    {winRatePercentage}%
                  </div>
                  <div className="text-[10px] text-[#71717a] mt-0.5 whitespace-nowrap">
                    {isThai ? `ชนะ ${winsCount} · แพ้ ${totalMatchesCount - winsCount}` : `${winsCount}W · ${totalMatchesCount - winsCount}L`}
                  </div>
                </div>

                <div className="p-2.5 rounded-[16px] bg-[#e8f7ee]">
                  <div className="text-[10px] font-medium text-[#15803d] whitespace-nowrap">
                    {isThai ? 'คะแนนสะสม' : 'Points Earned'}
                  </div>
                  <div className="text-lg font-bold text-[#15803d] leading-tight tabular-nums mt-0.5 whitespace-nowrap">
                    +{totalExpFromMatches}
                  </div>
                  <div className="text-[10px] text-[#15803d]/80 mt-0.5 whitespace-nowrap">
                    {totalMatchesCount} {isThai ? 'แมตช์' : 'Matches'}
                  </div>
                </div>

                <div className="p-2.5 rounded-[16px] bg-[#f5f5f7]">
                  <div className="text-[10px] font-medium text-[#71717a] whitespace-nowrap">
                    {isThai ? 'ตบสูงสุด' : 'Top Smash'}
                  </div>
                  <div className="text-lg font-bold text-[#111111] leading-tight tabular-nums mt-0.5 whitespace-nowrap">
                    {Math.max(...matches.map((m) => m.highestSmashKmh))}
                  </div>
                  <div className="text-[10px] text-[#71717a] mt-0.5 whitespace-nowrap">
                    {isThai ? 'กม./ชม.' : 'km/h'}
                  </div>
                </div>
              </div>

              {/* Match Face-Off Cards */}
              <div className="space-y-3">
                {matches.slice(0, 3).map((match) => (
                  <MatchFaceOffCard
                    key={match.id}
                    match={match}
                    userDisplayName={displayName}
                    userAvatarUrl={player.avatarUrl}
                    isThai={isThai}
                    isExpanded={expandedMatchId === match.id}
                    onToggleExpand={() => {
                      playSelectSound();
                      setExpandedMatchId(expandedMatchId === match.id ? null : match.id);
                    }}
                    onAnalyze={() => navigateTo('C3')}
                  />
                ))}
              </div>

              {/* Matte Dark Pill Primary CTA (Matching Reference "Send a sparkle" Button) */}
              <button
                type="button"
                onClick={handleSimulateNewMatch}
                className="no-doodle w-full min-h-[50px] py-3.5 px-5 rounded-full bg-gradient-to-b from-[#2b2b2e] to-[#111111] text-[#ffffff] text-[14px] font-medium flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(0,0,0,0.14)] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>{isThai ? 'จำลองบันทึกผลแข่งใหม่' : 'Simulate New Match'}</span>
              </button>
            </div>
          </div>
        )}

        {/* DEDICATED TAB: PLAYER STATS */}
        {activeTab === 'stats' && <PlayerStatsPanel />}

        {/* DEDICATED TAB: MATCHES */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            <ProfileSubHeader
              title={isThai ? 'ประวัติผลการแข่งขันทั้งหมด' : 'All Match History'}
              subtitle={isThai ? 'แมตช์ที่บันทึกไว้ในระบบ' : 'Recorded matches in your log'}
              rightSlot={
                <button
                  type="button"
                  onClick={handleSimulateNewMatch}
                  className="no-doodle min-h-[36px] px-3 py-1.5 rounded-full bg-gradient-to-b from-[#2b2b2e] to-[#111111] text-[#ffffff] text-[11px] font-medium flex items-center gap-1 hover:opacity-90 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>{isThai ? 'เพิ่มผลแข่ง' : 'Add Match'}</span>
                </button>
              }
            />

            {/* Stat Summary & Clean Filter Bar */}
            <div className="p-4 rounded-[24px] bg-[#ffffff] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-[14px] bg-[#f5f5f7]">
                  <div className="text-[10px] font-medium text-[#71717a] whitespace-nowrap">
                    {isThai ? 'ทั้งหมด' : 'Total'}
                  </div>
                  <div className="text-lg font-bold text-[#111111] tabular-nums mt-0.5">
                    {matches.length}
                  </div>
                </div>
                <div className="p-2 rounded-[14px] bg-[#e8f7ee]">
                  <div className="text-[10px] font-medium text-[#15803d] whitespace-nowrap">
                    {isThai ? 'ชนะ' : 'Wins'}
                  </div>
                  <div className="text-lg font-bold text-[#15803d] tabular-nums mt-0.5">
                    {winsCount}
                  </div>
                </div>
                <div className="p-2 rounded-[14px] bg-[#fef2f2]">
                  <div className="text-[10px] font-medium text-[#dc2626] whitespace-nowrap">
                    {isThai ? 'แพ้' : 'Losses'}
                  </div>
                  <div className="text-lg font-bold text-[#dc2626] tabular-nums mt-0.5">
                    {matches.length - winsCount}
                  </div>
                </div>
                <div className="p-2 rounded-[14px] bg-[#f5f5f7]">
                  <div className="text-[10px] font-medium text-[#71717a] whitespace-nowrap">
                    {isThai ? 'อัตราชนะ' : 'Win Rate'}
                  </div>
                  <div className="text-lg font-bold text-[#111111] tabular-nums mt-0.5">
                    {winRatePercentage}%
                  </div>
                </div>
              </div>

              <div data-filter="true" className="bg-[#ececef] p-1 rounded-full flex items-center gap-1 overflow-x-auto no-scrollbar">
                {(
                  [
                    { id: 'all', label: isThai ? `ทั้งหมด (${matches.length})` : `All (${matches.length})` },
                    { id: 'win', label: isThai ? `ชนะ (${winsCount})` : `Won (${winsCount})` },
                    { id: 'loss', label: isThai ? `แพ้ (${matches.length - winsCount})` : `Lost (${matches.length - winsCount})` },
                    { id: 'Singles', label: isThai ? 'เดี่ยว' : 'Singles' },
                    { id: 'Doubles', label: isThai ? 'คู่' : 'Doubles' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      setMatchFilter(f.id);
                    }}
                    className={`no-doodle min-h-[34px] px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      matchFilter === f.id
                        ? 'bg-[#ffffff] text-[#111111] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                        : 'text-[#6b7280] hover:text-[#111111]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Match List */}
            <div className="space-y-3">
              {filteredMatches.length === 0 ? (
                <div className="p-8 text-center bg-[#ffffff] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                  <p className="text-xs font-medium text-[#71717a]">
                    {isThai ? 'ไม่พบข้อมูลแมตช์ในหมวดหมู่นี้' : 'No matches found'}
                  </p>
                </div>
              ) : (
                filteredMatches.map((match) => (
                  <MatchFaceOffCard
                    key={match.id}
                    match={match}
                    userDisplayName={displayName}
                    userAvatarUrl={player.avatarUrl}
                    isThai={isThai}
                    isExpanded={expandedMatchId === match.id}
                    onToggleExpand={() => {
                      playSelectSound();
                      setExpandedMatchId(expandedMatchId === match.id ? null : match.id);
                    }}
                    onAnalyze={() => navigateTo('C3')}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* DEDICATED TAB: TROPHIES */}
        {activeTab === 'trophies' && (
          <div className="space-y-3">
            <ProfileSubHeader
              title={isThai ? 'ตู้เหรียญรางวัล' : 'Trophy & Badge Case'}
              subtitle={
                isThai
                  ? `ปลดล็อกแล้ว ${unlockedBadgesCount} จาก ${player.badges.length} เหรียญ`
                  : `${unlockedBadgesCount} of ${player.badges.length} unlocked`
              }
              rightSlot={
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setIsShareAchievementOpen(true);
                  }}
                  className="no-doodle min-h-[36px] px-3 py-1.5 rounded-full bg-gradient-to-b from-[#2b2b2e] to-[#111111] text-[#ffffff] text-[11px] font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Share2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isThai ? 'แชร์ความสำเร็จ' : 'Share'}</span>
                </button>
              }
            />

            <div className="grid grid-cols-2 gap-3">
              {player.badges.map((b) => {
                const rarityText = isThai
                  ? b.rarity === 'Legendary'
                    ? 'ตำนาน'
                    : b.rarity === 'Epic'
                      ? 'มหากาพย์'
                      : b.rarity === 'Rare'
                        ? 'หายาก'
                        : 'ทั่วไป'
                  : b.rarity;

                return (
                  <div
                    key={b.id}
                    className={`p-4 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all flex flex-col justify-between ${
                      b.unlocked ? 'bg-[#ffffff]' : 'bg-[#ffffff]/60 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            b.unlocked ? 'bg-[#e8f7ee] text-[#15803d]' : 'bg-[#f3f4f6] text-[#9ca3af]'
                          }`}
                        >
                          {b.unlocked ? <Trophy className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#52525b] whitespace-nowrap shrink-0">
                          {rarityText}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-[#111111] leading-snug">
                        {b.name}
                      </h3>
                      <p className="text-[11px] text-[#71717a] mt-1 leading-relaxed">
                        {b.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#000000]/[0.06] flex items-center justify-between text-[11px] font-medium">
                      <span className={b.unlocked ? 'text-[#15803d] whitespace-nowrap flex items-center gap-1' : 'text-[#71717a] whitespace-nowrap'}>
                        {b.unlocked ? (
                          <>
                            <Zap className="w-3 h-3 shrink-0" />
                            <span>{isThai ? 'ปลดล็อก (+100 คะแนน)' : 'Unlocked (+100 pts)'}</span>
                          </>
                        ) : (
                          `${b.progress}/${b.maxProgress}`
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DEDICATED TAB: GEAR */}
        {activeTab === 'gear' && (
          <div className="space-y-3">
            <ProfileSubHeader
              title={isThai ? 'สเปกอุปกรณ์ไม้แบด' : 'Racket & String Setup'}
              subtitle={isThai ? 'ข้อมูลไม้และเอ็นที่ใช้งานประจำ' : 'Current primary court setup'}
            />

            <div className="bg-[#ffffff] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] divide-y divide-[#000000]/[0.06] overflow-hidden">
              <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-[#71717a] whitespace-nowrap">
                  {isThai ? 'รุ่นไม้แบด' : 'Racket Model'}
                </span>
                <span className="text-xs font-semibold text-[#111111] font-mono truncate">
                  {player.racket.model}
                </span>
              </div>

              <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-[#71717a] whitespace-nowrap">
                  {isThai ? 'น้ำหนัก / ขนาดกริป' : 'Weight / Grip'}
                </span>
                <span className="text-xs font-semibold text-[#111111] font-mono whitespace-nowrap">
                  {player.racket.weightGrip}
                </span>
              </div>

              <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-[#71717a] whitespace-nowrap">
                  {isThai ? 'ความตึงเอ็น' : 'String Tension'}
                </span>
                <span className="text-xs font-semibold text-[#15803d] font-mono whitespace-nowrap">
                  {player.racket.stringTension}
                </span>
              </div>

              <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-[#71717a] whitespace-nowrap">
                  {isThai ? 'ประเภทเอ็น' : 'String Type'}
                </span>
                <span className="text-xs font-semibold text-[#111111] truncate">
                  {player.racket.stringType}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProSubscriptionModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />
      <AppSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <ShareAchievementModal
        isOpen={isShareAchievementOpen}
        onClose={() => setIsShareAchievementOpen(false)}
      />
    </div>
  );
};
