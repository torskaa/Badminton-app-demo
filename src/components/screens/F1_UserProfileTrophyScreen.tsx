import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Crown,
  LogIn,
  LogOut,
  MapPin,
  Plus,
  QrCode,
  Settings,
  Share2,
  Sparkles,
  Trash2,
  Trophy,
  UserCog,
  Wallet,
  Watch,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CloudMatchRecord } from '../../services/firebaseService';
import { Badge } from '../../types';
import { ProSubscriptionModal } from '../common/ProSubscriptionModal';
import { AppSettingsModal } from '../common/AppSettingsModal';
import { ShareAchievementModal } from '../common/ShareAchievementModal';
import { DoodleAvatar, resolveDoodlePreset } from '../common/DoodleAvatar';
import { PlayerStatsPanel } from '../profile/PlayerStatsPanel';
import { PlayerSkillRadarCard } from '../profile/PlayerSkillRadarCard';
import { FinancePanel } from '../finance/FinancePanel';
import { LogMatchModal } from '../profile/LogMatchModal';
import {
  EarnedBadgesShowcaseCard,
  HistoricalMatchStatsCard,
  LevelProgressCard,
  getRarityAccent,
  getRarityLabel,
  renderBadgeIcon,
} from '../profile/ProfileFirebaseOverview';
import {
  computeHistoricalMatchStats,
  formatMatchTimestamp,
  parseSetSummary,
} from '../../utils/matchHistoryUtils';
import { playCoinSound, playSelectSound } from '../../utils/retroAudio';

export interface PastMatchResult {
  id: string;
  isCloudOwned?: boolean;
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
  createdAtMs: number;
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
    createdAtMs: Date.UTC(2026, 10, 7, 12, 30),
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
    createdAtMs: Date.UTC(2026, 10, 5, 13, 0),
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
    createdAtMs: Date.UTC(2026, 10, 2, 11, 15),
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
    createdAtMs: Date.UTC(2026, 9, 28, 12, 0),
  },
];

function mapCloudMatchToCard(cm: CloudMatchRecord, isThai: boolean): PastMatchResult {
  const formattedDate = formatMatchTimestamp(cm.createdAtMs, isThai);
  const parsedScores = parseSetSummary(cm.setSummary, cm.finalScore);
  const partnerFromTeamA =
    cm.isDoubles && cm.playerAName.includes('&')
      ? cm.playerAName.split('&')[1]?.trim()
      : undefined;

  return {
    id: cm.id,
    isCloudOwned: true,
    opponent: {
      name: cm.playerBName,
      nameTh: cm.playerBName,
      nameEn: cm.playerBName,
      tier: isThai ? 'บันทึก Firebase' : 'Firebase Record',
      club: cm.courtName,
      avatars: cm.isDoubles ? [AVATARS.bank, AVATARS.top] : [AVATARS.ohm],
    },
    partnerName: partnerFromTeamA,
    partnerNameTh: partnerFromTeamA,
    partnerNameEn: partnerFromTeamA,
    partnerAvatar: AVATARS.ploy,
    courtName: cm.courtName,
    courtNameTh: cm.courtName,
    courtNameEn: cm.courtName,
    date: formattedDate,
    dateTh: formatMatchTimestamp(cm.createdAtMs, true),
    dateEn: formatMatchTimestamp(cm.createdAtMs, false),
    result: cm.result,
    matchType: cm.isDoubles ? 'Doubles' : 'Singles',
    scores: parsedScores,
    finalScore: cm.finalScore,
    durationMin: cm.durationMin,
    expGained: cm.expGained,
    highestSmashKmh: cm.highestSmashKmh,
    highlightShot: cm.highlightShot,
    highlightShotTh: cm.highlightShot,
    highlightShotEn: cm.highlightShot,
    createdAtMs: cm.createdAtMs,
  };
}

function mapDemoMatchToCloudRecord(m: PastMatchResult): CloudMatchRecord {
  return {
    id: m.id,
    ownerId: 'demo',
    playerAName: m.partnerName ? `You & ${m.partnerName}` : 'You',
    playerBName: m.opponent.name,
    isDoubles: m.matchType === 'Doubles',
    finalScore: m.finalScore,
    setSummary: m.scores.map((s) => `${s.userScore}-${s.opponentScore}`).join(' · '),
    result: m.result,
    courtName: m.courtName,
    highestSmashKmh: m.highestSmashKmh,
    durationMin: m.durationMin,
    expGained: m.expGained,
    highlightShot: m.highlightShot,
    isPublic: true,
    createdAtMs: m.createdAtMs,
  };
}

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
    className="no-doodle w-full px-4 py-3.5 min-h-[58px] flex items-center justify-between gap-3 text-left hover:bg-[#f8faf6] active:bg-[#eef5ea] transition-colors cursor-pointer"
  >
    <div className="flex items-center gap-3.5 min-w-0 flex-1">
      <div className="text-[#004d2c] shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold text-[#142608] leading-snug truncate">
          {title}
        </div>
        {subtitle && (
          <div className="text-[11px] font-normal text-[#5c6f5e] leading-snug truncate mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      {rightLabel && (
        <span className="text-[11px] font-semibold text-[#5c6f5e] whitespace-nowrap tabular-nums">
          {rightLabel}
        </span>
      )}
      <span className="w-8 h-8 rounded-full bg-[#f8faf6] border border-[#e6eee2] flex items-center justify-center text-[#004d2c] shrink-0">
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
      <h2 className="text-[13px] font-bold text-[#142608] leading-tight truncate">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[11px] text-[#5c6f5e] mt-0.5 truncate">
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
  onDelete?: () => void;
}

const MatchFaceOffCard: React.FC<MatchFaceOffCardProps> = ({
  match,
  userDisplayName,
  userAvatarUrl,
  isThai,
  isExpanded,
  onToggleExpand,
  onAnalyze,
  onDelete,
}) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const isWin = match.result === 'win';
  const isDoubles = match.matchType === 'Doubles';
  const userShortName = userDisplayName.split(' ')[0] || (isThai ? 'คุณ' : 'You');
  const partnerShortName = isThai
    ? match.partnerNameTh || match.partnerName || 'คู่หู'
    : match.partnerNameEn || match.partnerName || 'Partner';
  const teamALabel = isDoubles ? `${userShortName} & ${partnerShortName}` : userShortName;
  const teamBLabel = isThai
    ? match.opponent.nameTh || match.opponent.name
    : match.opponent.nameEn || match.opponent.name;

  const tierLabel = isThai
    ? match.opponent.tier
        .replace('Diamond League', 'ลีกไดมอนด์')
        .replace('Platinum League', 'ลีกแพลทินัม')
        .replace('Gold League', 'ลีกโกลด์')
        .replace('Silver League', 'ลีกซิลเวอร์')
        .replace('Bronze League', 'ลีกบรอนซ์')
    : match.opponent.tier;

  const scoreDisplay = match.finalScore.replace('-', ':');
  const setSummary =
    match.scores.length > 0
      ? match.scores.map((s) => `${s.userScore}-${s.opponentScore}`).join(' · ')
      : match.finalScore;

  return (
    <div className="rounded-[24px] bg-[#ffffff] border border-[#d4dfd0] p-4 space-y-3 shadow-2xs transition-all">
      {/* Top Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5c6f5e] min-w-0 truncate">
          <Calendar className="w-3.5 h-3.5 text-[#5c6f5e] shrink-0" />
          <span className="truncate">
            {isThai ? match.dateTh || match.date : match.dateEn || match.date}
          </span>
          <span className="text-[#cad7c5]">·</span>
          <span className="shrink-0">
            {isThai ? (isDoubles ? 'ประเภทคู่' : 'ประเภทเดี่ยว') : match.matchType}
          </span>
        </div>
        <span
          className={`text-[11px] font-bold shrink-0 whitespace-nowrap ${
            isWin ? 'text-[#15803d]' : 'text-[#e85729]'
          }`}
        >
          {isWin ? (isThai ? 'ชนะ' : 'Won') : isThai ? 'แพ้' : 'Lost'}
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
          <span className="text-xs font-semibold text-[#142608] truncate w-full mt-1.5 leading-snug">
            {teamALabel}
          </span>
          <span className="text-[10px] font-normal text-[#5c6f5e] truncate w-full">
            {isThai ? 'ทีมเรา' : 'You'}
          </span>
        </div>

        {/* Center Score Block */}
        <div className="bg-[#f8faf6] border border-[#e6eee2] rounded-[18px] px-4 py-2 text-center min-w-[96px] flex flex-col items-center justify-center">
          <div className="text-[22px] font-bold text-[#142608] tabular-nums leading-tight whitespace-nowrap">
            {scoreDisplay}
          </div>
          <div className="text-[10px] font-medium text-[#5c6f5e] tabular-nums whitespace-nowrap mt-0.5">
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
                accentClass="border-[#ffffff] ring-1 ring-[#d4dfd0] bg-[#f8faf6]"
              />
              <FaceAvatar
                src={match.opponent.avatars[1]}
                label={teamBLabel}
                className="w-10 h-10"
                accentClass="border-[#ffffff] ring-1 ring-[#d4dfd0] bg-[#f8faf6]"
              />
            </div>
          ) : (
            <FaceAvatar
              src={match.opponent.avatars[0]}
              label={teamBLabel}
              className="w-11 h-11"
              accentClass="border-[#ffffff] ring-1 ring-[#d4dfd0] bg-[#f8faf6]"
            />
          )}
          <span className="text-xs font-semibold text-[#142608] truncate w-full mt-1.5 leading-snug">
            {teamBLabel}
          </span>
          <span className="text-[10px] font-normal text-[#5c6f5e] truncate w-full">
            {tierLabel}
          </span>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="pt-2.5 border-t border-[#e6eee2] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-normal text-[#5c6f5e] min-w-0 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#5c6f5e] shrink-0" />
          <span className="truncate">
            {isThai ? match.courtNameTh || match.courtName : match.courtNameEn || match.courtName}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleExpand}
          className="no-doodle px-3 py-1.5 min-h-[36px] rounded-full bg-[#f8faf6] border border-[#d4dfd0] text-[11px] font-semibold text-[#004d2c] flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap hover:border-[#004d2c] transition-colors"
        >
          <span>{isExpanded ? (isThai ? 'ซ่อน' : 'Hide') : isThai ? 'สถิติ' : 'Stats'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          )}
        </button>
      </div>

      {/* Expandable Telemetry Drawer */}
      {isExpanded && (
        <div className="p-3 rounded-[18px] bg-[#f8faf6] border border-[#e6eee2] space-y-2.5 text-[11px]">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-[14px] bg-[#ffffff] border border-[#e6eee2]">
              <span className="text-[10px] font-medium text-[#5c6f5e] block whitespace-nowrap">
                {isThai ? 'สปีดตบ' : 'Top Smash'}
              </span>
              <span className="text-xs font-bold text-[#142608] whitespace-nowrap tabular-nums mt-0.5 block">
                {match.highestSmashKmh} {isThai ? 'กม./ชม.' : 'km/h'}
              </span>
            </div>
            <div className="p-2.5 rounded-[14px] bg-[#ffffff] border border-[#e6eee2]">
              <span className="text-[10px] font-medium text-[#5c6f5e] block whitespace-nowrap">
                {isThai ? 'เวลาแข่ง' : 'Duration'}
              </span>
              <span className="text-xs font-bold text-[#142608] whitespace-nowrap tabular-nums mt-0.5 block">
                {match.durationMin} {isThai ? 'นาที' : 'min'}
              </span>
            </div>
            <div className="p-2.5 rounded-[14px] bg-[#e8f7ee] border border-[#7cd7a0]/45">
              <span className="text-[10px] font-medium text-[#004d2c] block whitespace-nowrap">
                {isThai ? 'EXP ที่ได้' : 'EXP Gained'}
              </span>
              <span className="text-xs font-bold text-[#004d2c] whitespace-nowrap tabular-nums mt-0.5 block">
                +{match.expGained}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-[14px] bg-[#ffffff] border border-[#e6eee2] flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Sparkles className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
              <span className="truncate text-[#5c6f5e]">
                <strong className="font-semibold text-[#142608]">
                  {isThai ? 'ไฮไลต์:' : 'Highlight:'}
                </strong>{' '}
                {isThai
                  ? match.highlightShotTh || match.highlightShot
                  : match.highlightShotEn || match.highlightShot}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onDelete && match.isCloudOwned && (
                confirmingDelete ? (
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmingDelete(false);
                      onDelete();
                    }}
                    className="no-doodle px-2.5 py-1.5 rounded-full bg-[#e85729] text-[#ffffff] text-[11px] font-semibold cursor-pointer whitespace-nowrap"
                  >
                    {isThai ? 'ยืนยันลบ' : 'Confirm Delete'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    aria-label={isThai ? 'ลบแมตช์' : 'Delete match'}
                    className="no-doodle w-8 h-8 rounded-full bg-[#f8faf6] border border-[#d4dfd0] hover:border-[#e85729] text-[#5c6f5e] hover:text-[#e85729] flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )
              )}

              {onAnalyze && (
                <button
                  type="button"
                  onClick={onAnalyze}
                  className="no-doodle px-3 py-1.5 rounded-full bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] text-[11px] font-semibold cursor-pointer active:scale-95 transition-all whitespace-nowrap"
                >
                  {isThai ? 'วิเคราะห์ช็อต' : 'Analyze'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const F1_UserProfileTrophyScreen: React.FC = () => {
  const {
    player,
    updatePlayer,
    navigateTo,
    goBack,
    booking,
    language,
    authUser,
    isAuthBusy,
    signInWithGoogle,
    signOutAccount,
    walletBalance,
    cloudBookings,
    cloudMatches,
    userCloudMatches,
    isProfileCloudLoading,
    profileSyncedAt,
    deleteHistoricalMatch,
    wearableMetrics,
  } = useApp();
  const isThai = language === 'th';

  const [activeTab, setActiveTab] = useState<'card' | 'finance' | 'stats' | 'matches' | 'trophies' | 'gear'>('card');
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareAchievementOpen, setIsShareAchievementOpen] = useState(false);
  const [isLogMatchOpen, setIsLogMatchOpen] = useState(false);

  const [isEditingGear, setIsEditingGear] = useState(false);
  const [gearDraft, setGearDraft] = useState(player.racket);
  const [gearSavedNotice, setGearSavedNotice] = useState(false);

  const [matchFilter, setMatchFilter] = useState<'all' | 'win' | 'loss' | 'Singles' | 'Doubles'>('all');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [badgeStatusFilter, setBadgeStatusFilter] = useState<'all' | 'earned' | 'progress'>('all');
  const [badgeCategoryFilter, setBadgeCategoryFilter] = useState<'all' | Badge['category']>('all');

  // Strict Firebase source of truth when signed in; preview fallback when signed out
  const effectiveMatchRecords: CloudMatchRecord[] = useMemo(() => {
    if (authUser) {
      return userCloudMatches;
    }
    const localOnly = cloudMatches.filter((m) => m.ownerId === player.id);
    return [...localOnly, ...INITIAL_PAST_MATCHES.map(mapDemoMatchToCloudRecord)];
  }, [authUser, userCloudMatches, cloudMatches, player.id]);

  const historicalStats = useMemo(
    () => computeHistoricalMatchStats(effectiveMatchRecords),
    [effectiveMatchRecords]
  );

  const matches: PastMatchResult[] = useMemo(() => {
    if (authUser) {
      return userCloudMatches.map((cm) => mapCloudMatchToCard(cm, isThai));
    }
    const localMapped = cloudMatches
      .filter((m) => m.ownerId === player.id)
      .map((cm) => mapCloudMatchToCard(cm, isThai));
    return [...localMapped, ...INITIAL_PAST_MATCHES];
  }, [authUser, userCloudMatches, cloudMatches, player.id, isThai]);

  const unlockedBadgesCount = player.badges.filter((b) => b.unlocked).length;

  const filteredMatches = useMemo(
    () =>
      matches.filter((m) => {
        if (matchFilter === 'all') return true;
        if (matchFilter === 'win') return m.result === 'win';
        if (matchFilter === 'loss') return m.result === 'loss';
        if (matchFilter === 'Singles') return m.matchType === 'Singles';
        if (matchFilter === 'Doubles') return m.matchType === 'Doubles';
        return true;
      }),
    [matches, matchFilter]
  );

  const filteredBadges = useMemo(
    () =>
      player.badges.filter((b) => {
        if (badgeStatusFilter === 'earned' && !b.unlocked) return false;
        if (badgeStatusFilter === 'progress' && b.unlocked) return false;
        if (badgeCategoryFilter !== 'all' && b.category !== badgeCategoryFilter) return false;
        return true;
      }),
    [player.badges, badgeStatusFilter, badgeCategoryFilter]
  );

  const handleStartLiveMatch = () => {
    playSelectSound();
    navigateTo('C1');
  };

  const displayName = authUser
    ? player.name || authUser.displayName || (isThai ? 'กานต์ ธนวัฒน์' : 'Karn Tanawat')
    : isThai
      ? player.nameTh || player.name || 'กานต์ ธนวัฒน์'
      : player.nameEn || player.name || 'Karn Tanawat';
  const playstyleLabel = isThai
    ? player.playstyleTh || 'สายบุกตบสแมชดุดัน'
    : player.playstyleEn || player.playstyle;
  const tierDisplayLabel = isThai
    ? {
        Bronze: 'ลีกบรอนซ์',
        Silver: 'ลีกซิลเวอร์',
        Gold: 'ลีกโกลด์',
        Diamond: 'ลีกไดมอนด์',
        Pro: 'ลีกโปร',
      }[player.tier] || 'ลีกไดมอนด์'
    : `${player.tier} League`;

  const liveOvr = Math.round(
    (player.skillRadar.power +
      player.skillRadar.speed +
      player.skillRadar.control +
      player.skillRadar.stamina +
      player.skillRadar.tactics) /
      5
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28 bg-[#f8faf6] text-[#142608]">
      {/* Sticky Top Bar + Centered Identity Hero */}
      <div className="bg-gradient-to-b from-[#ffffff] via-[#fafcfa] to-[#f8faf6] border-b border-[#d4dfd0]">
        <header className="sticky top-0 z-30 app-header-safe px-5 pb-3 flex items-center justify-between gap-2 bg-[#ffffff]/85 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              goBack();
            }}
            aria-label={isThai ? 'ย้อนกลับ' : 'Back'}
            className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#004d2c] shadow-2xs flex items-center justify-center text-[#142608] hover:bg-[#f8faf6] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </button>

          <h1 className="text-[15px] font-bold text-[#142608] tracking-tight truncate text-center">
            {isThai ? 'โปรไฟล์นักแบดมินตัน' : 'Player Profile'}
          </h1>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setIsSettingsOpen(true);
            }}
            aria-label={isThai ? 'ตั้งค่า' : 'Settings'}
            className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#004d2c] shadow-2xs flex items-center justify-center text-[#142608] hover:bg-[#f8faf6] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Settings className="w-4 h-4 stroke-[1.9]" />
          </button>
        </header>

        {/* Identity Hero */}
        <div className="px-5 pt-2 flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="relative p-1 rounded-full bg-[#e8f7ee] border border-[#7cd7a0]/50 shadow-xs">
            {authUser?.photoURL ? (
              <img
                src={authUser.photoURL}
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#ffffff]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <DoodleAvatar
                preset="karn"
                size="xl"
                ringClass="border-2 border-[#ffffff]"
              />
            )}
          </div>

          <h2 className="mt-3 text-[24px] font-bold text-[#142608] leading-tight tracking-tight">
            {displayName}
          </h2>

          <p className="mt-1 text-xs font-medium text-[#5c6f5e] max-w-md leading-relaxed">
            {isThai
              ? `${playstyleLabel} · ${tierDisplayLabel} · พลังรวม ${liveOvr}`
              : `${playstyleLabel} · ${tierDisplayLabel} · ${liveOvr} OVR`}
          </p>

          {/* Compact Key Metrics Strip: Level, Earned Badges, Win Rate, Matches */}
          <div className="mt-4 w-full max-w-xl grid grid-cols-4 gap-2 bg-[#ffffff] border border-[#d4dfd0] rounded-[22px] p-2.5 shadow-2xs tabular-nums">
            <div className="py-1.5 px-1 rounded-[14px] bg-[#e8f7ee]">
              <div className="text-[10px] font-semibold text-[#004d2c] whitespace-nowrap">
                {isThai ? 'เลเวลปัจจุบัน' : 'Level'}
              </div>
              <div className="text-base font-bold text-[#004d2c] mt-0.5">
                Lv.{player.level}
              </div>
            </div>
            <div className="py-1.5 px-1 rounded-[14px] bg-[#f8faf6]">
              <div className="text-[10px] font-semibold text-[#5c6f5e] whitespace-nowrap">
                {isThai ? 'เหรียญที่ได้' : 'Badges'}
              </div>
              <div className="text-base font-bold text-[#142608] mt-0.5">
                {unlockedBadgesCount}/{player.badges.length}
              </div>
            </div>
            <div className="py-1.5 px-1 rounded-[14px] bg-[#f8faf6]">
              <div className="text-[10px] font-semibold text-[#5c6f5e] whitespace-nowrap">
                {isThai ? 'แมตช์' : 'Matches'}
              </div>
              <div className="text-base font-bold text-[#142608] mt-0.5">
                {historicalStats.totalMatches}
              </div>
            </div>
            <div className="py-1.5 px-1 rounded-[14px] bg-[#f8faf6]">
              <div className="text-[10px] font-semibold text-[#5c6f5e] whitespace-nowrap">
                {isThai ? 'อัตราชนะ' : 'Win Rate'}
              </div>
              <div className="text-base font-bold text-[#15803d] mt-0.5">
                {historicalStats.winRate}%
              </div>
            </div>
          </div>

          {/* LEVEL 1 PRIMARY TABS: Clean Editorial Underline Tab Bar */}
          <div
            data-filter="true"
            role="tablist"
            className="mt-4 w-full max-w-xl flex items-center gap-1 overflow-x-auto no-scrollbar"
          >
            {(
              [
                { id: 'card', label: isThai ? 'หน้าหลัก' : 'Overview' },
                { id: 'matches', label: isThai ? 'แมตช์' : 'Matches' },
                { id: 'trophies', label: isThai ? 'เหรียญ' : 'Badges' },
                { id: 'stats', label: isThai ? 'สถิติ' : 'Stats' },
                { id: 'finance', label: isThai ? 'การเงิน' : 'Wallet' },
                { id: 'gear', label: isThai ? 'อุปกรณ์' : 'Gear' },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    playSelectSound();
                    setActiveTab(tab.id);
                  }}
                  className={`no-doodle relative flex-1 shrink-0 min-w-fit min-h-[44px] px-3 pb-2.5 pt-1.5 flex items-center justify-center text-[13px] transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'font-bold text-[#004d2c]'
                      : 'font-medium text-[#5c6f5e] hover:text-[#142608]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 inset-x-2 h-[2.5px] rounded-full bg-[#004d2c]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 pt-4 space-y-5 max-w-3xl w-full mx-auto">
        {activeTab === 'finance' && (
          <div className="space-y-3">
            <ProfileSubHeader
              title={isThai ? 'กระเป๋าเงินและการเงิน' : 'SmashPay & Finance'}
              subtitle={isThai ? 'เติมเงิน โอนเงิน และประวัติธุรกรรม' : 'Top up, transfer & transactions'}
            />
            <FinancePanel embeddedInProfile />
          </div>
        )}

        {activeTab === 'card' && (
          <div className="space-y-5">
            {/* Firebase Auth & Live Cloud Account Bar */}
            <div className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] p-4 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {authUser?.photoURL ? (
                  <img
                    src={authUser.photoURL}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover border border-[#d4dfd0] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#e8f7ee] text-[#004d2c] flex items-center justify-center shrink-0">
                    {authUser ? <CheckCircle2 className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[#142608] truncate">
                    {authUser
                      ? authUser.email || displayName
                      : isThai
                        ? 'เชื่อมต่อบัญชี Firebase เพื่อซิงค์โปรไฟล์'
                        : 'Connect Firebase Account to Sync Profile'}
                  </div>
                  <div className="text-[11px] text-[#5c6f5e] truncate mt-0.5 tabular-nums">
                    {authUser
                      ? isThai
                        ? `ซิงค์เรียลไทม์ · เลเวล ${player.level} · ${unlockedBadgesCount} เหรียญ · ${userCloudMatches.length} แมตช์`
                        : `Live sync · Lv.${player.level} · ${unlockedBadgesCount} badges · ${userCloudMatches.length} matches`
                      : isThai
                        ? 'เข้าสู่ระบบ Google เพื่อดึงเลเวล เหรียญรางวัล และประวัติแมตช์จากคลาวด์'
                        : 'Sign in with Google to load your level, badges & match history from Firebase'}
                  </div>
                </div>
              </div>

              {authUser ? (
                <button
                  type="button"
                  disabled={isAuthBusy}
                  onClick={() => signOutAccount()}
                  className="no-doodle min-h-[40px] px-3.5 rounded-full bg-[#f8faf6] border border-[#d4dfd0] hover:border-[#004d2c] text-[#142608] text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isThai ? 'ออก' : 'Sign out'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isAuthBusy}
                  onClick={() => signInWithGoogle()}
                  className="no-doodle min-h-[42px] px-4 rounded-full bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap active:scale-95 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isAuthBusy ? '...' : isThai ? 'เข้าสู่ระบบ Google' : 'Google Sign In'}</span>
                </button>
              )}
            </div>

            {/* PILLAR 1: Current Level & EXP Progress (Fetched from Firebase /users/{uid}) */}
            <LevelProgressCard
              player={player}
              tierDisplayLabel={tierDisplayLabel}
              ovrScore={liveOvr}
              isThai={isThai}
              isSignedIn={Boolean(authUser)}
              isLoading={isProfileCloudLoading}
              syncedAtMs={profileSyncedAt}
            />

            {/* PILLAR 2: Badges Earned Showcase (Fetched from Firebase /users/{uid}/badges) */}
            <EarnedBadgesShowcaseCard
              badges={player.badges}
              isThai={isThai}
              isSignedIn={Boolean(authUser)}
              isLoading={isProfileCloudLoading}
              onViewAllBadges={() => setActiveTab('trophies')}
            />

            {/* PILLAR 3: Historical Match Stats Dashboard (Fetched from Firebase /matches) */}
            <HistoricalMatchStatsCard
              stats={historicalStats}
              isThai={isThai}
              isSignedIn={Boolean(authUser)}
              isLoading={isProfileCloudLoading}
              onLogMatch={() => setIsLogMatchOpen(true)}
              onOpenLiveScorer={handleStartLiveMatch}
              onSignIn={() => signInWithGoogle()}
              onViewAllMatches={() => setActiveTab('matches')}
            />

            {/* Recent Match Cards Preview */}
            {matches.length > 0 && (
              <div className="space-y-2.5">
                <ProfileSubHeader
                  title={isThai ? 'แมตช์ล่าสุดของคุณ' : 'Recent Matches'}
                  subtitle={
                    authUser
                      ? isThai
                        ? 'บันทึกผลการแข่งขันจากฐานข้อมูล Firebase'
                        : 'Latest scorecards fetched from Firebase'
                      : isThai
                        ? 'ตัวอย่างประวัติการแข่งขัน'
                        : 'Sample match history preview'
                  }
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => {
                        playSelectSound();
                        setActiveTab('matches');
                      }}
                      className="no-doodle min-h-[36px] px-3 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#004d2c] text-[11px] font-semibold text-[#004d2c] flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <span>{isThai ? 'ดูทั้งหมด' : 'See all'}</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[1.75] shrink-0" />
                    </button>
                  }
                />

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
                      onDelete={
                        match.isCloudOwned
                          ? () => deleteHistoricalMatch(match.id)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 5-Axis Skill Radar */}
            <div className="space-y-2">
              <ProfileSubHeader
                title={isThai ? 'ค่าพลังและทักษะผู้เล่น' : 'Player Skill Breakdown'}
              />
              <PlayerSkillRadarCard onOpenCoachRadar={() => navigateTo('D1')} />
            </div>

            {/* Smash Pro Banner */}
            <button
              type="button"
              onClick={() => {
                setIsProModalOpen(true);
                playCoinSound();
              }}
              className="no-doodle relative w-full rounded-[24px] bg-[#ffffff] border border-[#d4dfd0] p-4 min-h-[72px] shadow-2xs overflow-hidden flex items-center justify-between gap-3 text-left cursor-pointer hover:border-[#004d2c] active:scale-[0.99] transition-all"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-[#7cd7a0]/35 via-[#a7f3d0]/15 to-transparent"
              />
              <div className="relative flex items-center gap-3.5 min-w-0 flex-1">
                <Crown className="w-5 h-5 stroke-[1.75] text-[#004d2c] shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-bold text-[#142608] truncate">
                    {isThai ? 'สมาชิกสแมชโปร' : 'Smash Pro Membership'}
                  </div>
                  <div className="text-[11px] text-[#5c6f5e] truncate mt-0.5">
                    {isThai
                      ? 'ลดค่าคอร์ท 10% · วิเคราะห์เกมไม่จำกัด'
                      : '10% off courts · Unlimited AI analysis'}
                  </div>
                </div>
              </div>
              <div className="relative flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-[#004d2c] whitespace-nowrap">
                  {player.tier === 'Pro'
                    ? isThai
                      ? 'ใช้งานอยู่'
                      : 'Active'
                    : isThai
                      ? '฿199/ด.'
                      : '฿199/mo'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#004d2c]" />
              </div>
            </button>

            {/* Account & Court Tools Menu */}
            <div className="space-y-2">
              <ProfileSubHeader title={isThai ? 'บัญชีและเครื่องมือคอร์ท' : 'Account & Court Tools'} />
              <div className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] shadow-2xs divide-y divide-[#e6eee2] overflow-hidden">
                <ProfileMenuRow
                  icon={<Wallet className="w-5 h-5 stroke-[1.65]" />}
                  title={isThai ? 'กระเป๋าเงินและการเงิน' : 'SmashPay & Finance'}
                  subtitle={isThai ? 'เติมเงิน โอนเงิน และประวัติธุรกรรม' : 'Top up, transfer & transactions'}
                  rightLabel={`฿${walletBalance.toLocaleString()}`}
                  onClick={() => {
                    playSelectSound();
                    setActiveTab('finance');
                  }}
                />
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
                    cloudBookings[0]
                      ? `${cloudBookings[0].courtName} · ${isThai ? 'คอร์ท' : 'Court'} ${cloudBookings[0].courtNumber}`
                      : isThai
                        ? `${booking.court?.name || 'สแมช อารีน่า พระราม 9'} · คอร์ท ${booking.selectedCourtNumber || 3}`
                        : `${booking.court?.name || 'Smash Arena Rama 9'} · Court ${booking.selectedCourtNumber || 3}`
                  }
                  rightLabel={cloudBookings.length > 0 ? `${cloudBookings.length}` : isThai ? 'พร้อมใช้' : 'Ready'}
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
                      ? `${wearableMetrics.heartRateBpm} ครั้ง/นาที · ${wearableMetrics.caloriesBurned} แคลอรี · ${wearableMetrics.distanceKm} กม.`
                      : `${wearableMetrics.heartRateBpm} BPM · ${wearableMetrics.caloriesBurned} kcal · ${wearableMetrics.distanceKm} km`
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
              </div>
            </div>
          </div>
        )}

        {/* DEDICATED TAB: PLAYER STATS */}
        {activeTab === 'stats' && <PlayerStatsPanel />}

        {/* DEDICATED TAB: MATCHES */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            <ProfileSubHeader
              title={isThai ? 'ประวัติผลการแข่งขันทั้งหมด' : 'All Historical Matches'}
              subtitle={
                authUser
                  ? isThai
                    ? `ดึงข้อมูลจาก Firebase Firestore · ${matches.length} แมตช์`
                    : `Fetched from Firebase Firestore · ${matches.length} matches`
                  : isThai
                    ? 'ตัวอย่างข้อมูลในเครื่อง · ล็อกอิน Google เพื่อเก็บข้อมูลถาวร'
                    : 'Local preview · Sign in with Google to save permanently in Firebase'
              }
              rightSlot={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      setIsLogMatchOpen(true);
                    }}
                    className="no-doodle min-h-[38px] px-3.5 rounded-full bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] text-[11px] font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>{isThai ? 'บันทึกแมตช์' : 'Log Match'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleStartLiveMatch}
                    className="no-doodle min-h-[38px] px-3 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#004d2c] text-[#142608] text-[11px] font-semibold cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {isThai ? 'นับแต้มสด' : 'Live Scorer'}
                  </button>
                </div>
              }
            />

            {/* Stat Summary & Filter Bar */}
            <div className="p-4 rounded-[24px] bg-[#ffffff] border border-[#d4dfd0] shadow-2xs space-y-3">
              <div className="grid grid-cols-4 gap-2 text-center tabular-nums">
                <div className="p-2 rounded-[14px] bg-[#f8faf6] border border-[#e6eee2]">
                  <div className="text-[10px] font-semibold text-[#5c6f5e] whitespace-nowrap">
                    {isThai ? 'ทั้งหมด' : 'Total'}
                  </div>
                  <div className="text-lg font-bold text-[#142608] mt-0.5">
                    {historicalStats.totalMatches}
                  </div>
                </div>
                <div className="p-2 rounded-[14px] bg-[#e8f7ee] border border-[#7cd7a0]/45">
                  <div className="text-[10px] font-semibold text-[#004d2c] whitespace-nowrap">
                    {isThai ? 'ชนะ' : 'Wins'}
                  </div>
                  <div className="text-lg font-bold text-[#004d2c] mt-0.5">
                    {historicalStats.wins}
                  </div>
                </div>
                <div className="p-2 rounded-[14px] bg-[#fff1ec] border border-[#e85729]/25">
                  <div className="text-[10px] font-semibold text-[#e85729] whitespace-nowrap">
                    {isThai ? 'แพ้' : 'Losses'}
                  </div>
                  <div className="text-lg font-bold text-[#e85729] mt-0.5">
                    {historicalStats.losses}
                  </div>
                </div>
                <div className="p-2 rounded-[14px] bg-[#f8faf6] border border-[#e6eee2]">
                  <div className="text-[10px] font-semibold text-[#5c6f5e] whitespace-nowrap">
                    {isThai ? 'อัตราชนะ' : 'Win Rate'}
                  </div>
                  <div className="text-lg font-bold text-[#15803d] mt-0.5">
                    {historicalStats.winRate}%
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              <div data-filter="true" className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {(
                  [
                    { id: 'all', label: isThai ? `ทั้งหมด (${matches.length})` : `All (${matches.length})` },
                    { id: 'win', label: isThai ? `ชนะ (${historicalStats.wins})` : `Won (${historicalStats.wins})` },
                    { id: 'loss', label: isThai ? `แพ้ (${historicalStats.losses})` : `Lost (${historicalStats.losses})` },
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
                    className={`no-doodle filter-pill min-h-[36px] px-3.5 py-1 rounded-full text-[12px] transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      matchFilter === f.id
                        ? 'bg-[#004d2c] text-[#ffffff] border border-[#004d2c] font-semibold shadow-2xs'
                        : 'bg-[#f8faf6] text-[#5c6f5e] border border-[#d4dfd0] hover:border-[#004d2c] hover:text-[#142608] font-medium'
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
                <div className="p-8 text-center bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] space-y-3">
                  <p className="text-xs font-semibold text-[#5c6f5e]">
                    {matches.length === 0
                      ? isThai
                        ? 'ยังไม่มีประวัติการแข่งขันที่บันทึกใน Firebase'
                        : 'No matches recorded in Firebase yet'
                      : isThai
                        ? 'ไม่พบข้อมูลแมตช์ในหมวดหมู่นี้'
                        : 'No matches match this filter'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      setIsLogMatchOpen(true);
                    }}
                    className="no-doodle min-h-[42px] px-4 rounded-full bg-[#004d2c] text-[#ffffff] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isThai ? 'บันทึกแมตช์ใหม่' : 'Log New Match'}</span>
                  </button>
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
                    onDelete={
                      match.isCloudOwned
                        ? () => deleteHistoricalMatch(match.id)
                        : undefined
                    }
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* DEDICATED TAB: TROPHIES & BADGES */}
        {activeTab === 'trophies' && (
          <div className="space-y-4">
            <ProfileSubHeader
              title={isThai ? 'ตู้เหรียญรางวัล' : 'Trophy & Badge Case'}
              subtitle={
                isThai
                  ? `ปลดล็อกแล้ว ${unlockedBadgesCount} จาก ${player.badges.length} เหรียญ${authUser ? ' · ซิงค์ Firebase' : ''}`
                  : `${unlockedBadgesCount} of ${player.badges.length} unlocked${authUser ? ' · Synced with Firebase' : ''}`
              }
              rightSlot={
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setIsShareAchievementOpen(true);
                  }}
                  className="no-doodle min-h-[38px] px-3.5 rounded-full bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Share2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isThai ? 'แชร์ความสำเร็จ' : 'Share'}</span>
                </button>
              }
            />

            {/* Badge Filter Bar */}
            <div className="p-3.5 rounded-[22px] bg-[#ffffff] border border-[#d4dfd0] space-y-2.5">
              <div data-filter="true" className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {(
                  [
                    { id: 'all', label: isThai ? `ทั้งหมด (${player.badges.length})` : `All (${player.badges.length})` },
                    { id: 'earned', label: isThai ? `ปลดล็อกแล้ว (${unlockedBadgesCount})` : `Earned (${unlockedBadgesCount})` },
                    { id: 'progress', label: isThai ? `กำลังสะสม (${player.badges.length - unlockedBadgesCount})` : `In Progress (${player.badges.length - unlockedBadgesCount})` },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      setBadgeStatusFilter(item.id);
                    }}
                    className={`no-doodle filter-pill min-h-[34px] px-3.5 rounded-full text-[11px] border whitespace-nowrap cursor-pointer ${
                      badgeStatusFilter === item.id
                        ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c] font-semibold'
                        : 'bg-[#f8faf6] text-[#5c6f5e] border-[#d4dfd0] font-medium'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div data-filter="true" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {(
                  [
                    { id: 'all', label: isThai ? 'ทุกหมวด' : 'All Categories' },
                    { id: 'combat', label: isThai ? 'เกมบุก' : 'Combat' },
                    { id: 'endurance', label: isThai ? 'ความอึด' : 'Endurance' },
                    { id: 'social', label: isThai ? 'สังคมก๊วน' : 'Social' },
                    { id: 'special', label: isThai ? 'พิเศษ' : 'Special' },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      setBadgeCategoryFilter(cat.id);
                    }}
                    className={`no-doodle filter-pill min-h-[30px] px-3 rounded-full text-[11px] border whitespace-nowrap cursor-pointer ${
                      badgeCategoryFilter === cat.id
                        ? 'bg-[#e8f7ee] text-[#004d2c] border-[#004d2c] font-semibold'
                        : 'bg-[#ffffff] text-[#5c6f5e] border-[#e6eee2] font-medium'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredBadges.length === 0 ? (
              <div className="p-8 text-center bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] text-xs font-medium text-[#5c6f5e]">
                {isThai ? 'ไม่พบเหรียญรางวัลในตัวกรองนี้' : 'No badges match this filter'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredBadges.map((b) => {
                  const pct = Math.min(100, Math.round((b.progress / Math.max(1, b.maxProgress)) * 100));
                  return (
                    <div
                      key={b.id}
                      className={`p-4 rounded-[24px] border shadow-2xs transition-all flex flex-col justify-between gap-3 ${
                        b.unlocked
                          ? 'bg-[#ffffff] border-[#d4dfd0]'
                          : 'bg-[#ffffff]/80 border-[#e6eee2]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                              b.unlocked
                                ? 'bg-[#e8f7ee] text-[#004d2c]'
                                : 'bg-[#f8faf6] text-[#5c6f5e]'
                            }`}
                          >
                            {renderBadgeIcon(b.iconName, 'w-5 h-5')}
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wide ${getRarityAccent(
                              b.rarity
                            )}`}
                          >
                            {getRarityLabel(b.rarity, isThai)}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-[#142608] leading-snug">
                          {isThai ? b.thaiName : b.name}
                        </h3>
                        <p className="text-[11px] text-[#5c6f5e] mt-1 leading-relaxed">
                          {b.description}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2.5 border-t border-[#e6eee2]">
                        <div className="flex items-center justify-between text-[11px] font-semibold tabular-nums">
                          <span
                            className={
                              b.unlocked
                                ? 'text-[#15803d] flex items-center gap-1'
                                : 'text-[#5c6f5e]'
                            }
                          >
                            {b.unlocked ? (
                              <>
                                <Zap className="w-3 h-3 shrink-0" />
                                <span>
                                  {b.unlockedAt
                                    ? isThai
                                      ? `ปลดล็อก · ${b.unlockedAt}`
                                      : `Earned · ${b.unlockedAt}`
                                    : isThai
                                      ? 'ปลดล็อกแล้ว'
                                      : 'Unlocked'}
                                </span>
                              </>
                            ) : (
                              isThai ? 'ความคืบหน้า' : 'Progress'
                            )}
                          </span>
                          <span className="text-[#142608]">
                            {b.progress}/{b.maxProgress}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#e6eee2] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              b.unlocked ? 'bg-[#004d2c]' : 'bg-[#7cd7a0]'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* DEDICATED TAB: GEAR */}
        {activeTab === 'gear' && (
          <div className="space-y-3">
            <ProfileSubHeader
              title={isThai ? 'สเปกอุปกรณ์ไม้แบด' : 'Racket & String Setup'}
              subtitle={isThai ? 'ข้อมูลไม้และเอ็นที่ใช้งานประจำ' : 'Current primary court setup'}
              rightSlot={
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setGearDraft(player.racket);
                    setIsEditingGear((prev) => !prev);
                  }}
                  className="no-doodle min-h-[36px] px-3.5 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#004d2c] text-[11px] font-semibold text-[#004d2c] cursor-pointer whitespace-nowrap"
                >
                  {isEditingGear ? (isThai ? 'ยกเลิก' : 'Cancel') : isThai ? 'แก้ไขอุปกรณ์' : 'Edit Gear'}
                </button>
              }
            />

            {gearSavedNotice && (
              <div className="px-3.5 py-2.5 rounded-[16px] bg-[#e8f7ee] border border-[#7cd7a0] text-[11px] font-semibold text-[#004d2c] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
                <span>{isThai ? 'บันทึกสเปกอุปกรณ์ไม้แบดเรียบร้อยแล้ว' : 'Racket setup saved'}</span>
              </div>
            )}

            {isEditingGear ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updatePlayer({
                    racket: {
                      model: gearDraft.model.trim() || player.racket.model,
                      weightGrip: gearDraft.weightGrip.trim() || player.racket.weightGrip,
                      stringTension: gearDraft.stringTension.trim() || player.racket.stringTension,
                      stringType: gearDraft.stringType.trim() || player.racket.stringType,
                    },
                  });
                  setIsEditingGear(false);
                  setGearSavedNotice(true);
                  setTimeout(() => setGearSavedNotice(false), 2600);
                }}
                className="bg-[#ffffff] rounded-[24px] border border-[#d4dfd0] p-4 space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c6f5e] mb-1">
                    {isThai ? 'รุ่นไม้แบด' : 'Racket Model'}
                  </label>
                  <input
                    type="text"
                    value={gearDraft.model}
                    onChange={(e) => setGearDraft((d) => ({ ...d, model: e.target.value }))}
                    className="w-full min-h-[42px] px-3 rounded-[12px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] text-xs font-semibold text-[#142608] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5c6f5e] mb-1">
                      {isThai ? 'น้ำหนัก / ขนาดกริป' : 'Weight / Grip'}
                    </label>
                    <input
                      type="text"
                      value={gearDraft.weightGrip}
                      onChange={(e) => setGearDraft((d) => ({ ...d, weightGrip: e.target.value }))}
                      className="w-full min-h-[42px] px-3 rounded-[12px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] text-xs font-semibold text-[#142608] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5c6f5e] mb-1">
                      {isThai ? 'ความตึงเอ็น' : 'String Tension'}
                    </label>
                    <input
                      type="text"
                      value={gearDraft.stringTension}
                      onChange={(e) => setGearDraft((d) => ({ ...d, stringTension: e.target.value }))}
                      className="w-full min-h-[42px] px-3 rounded-[12px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] text-xs font-semibold text-[#142608] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c6f5e] mb-1">
                    {isThai ? 'ประเภทเอ็น' : 'String Type'}
                  </label>
                  <input
                    type="text"
                    value={gearDraft.stringType}
                    onChange={(e) => setGearDraft((d) => ({ ...d, stringType: e.target.value }))}
                    className="w-full min-h-[42px] px-3 rounded-[12px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] text-xs font-semibold text-[#142608] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="no-doodle w-full min-h-[44px] rounded-full bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] text-xs font-bold cursor-pointer active:scale-95 transition-all"
                >
                  {isThai ? 'บันทึกสเปกอุปกรณ์' : 'Save Racket Setup'}
                </button>
              </form>
            ) : (
              <div className="bg-[#ffffff] rounded-[24px] border border-[#d4dfd0] shadow-2xs divide-y divide-[#e6eee2] overflow-hidden">
                <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#5c6f5e] whitespace-nowrap">
                    {isThai ? 'รุ่นไม้แบด' : 'Racket Model'}
                  </span>
                  <span className="text-xs font-semibold text-[#142608] font-mono truncate">
                    {player.racket.model}
                  </span>
                </div>

                <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#5c6f5e] whitespace-nowrap">
                    {isThai ? 'น้ำหนัก / ขนาดกริป' : 'Weight / Grip'}
                  </span>
                  <span className="text-xs font-semibold text-[#142608] font-mono whitespace-nowrap">
                    {player.racket.weightGrip}
                  </span>
                </div>

                <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#5c6f5e] whitespace-nowrap">
                    {isThai ? 'ความตึงเอ็น' : 'String Tension'}
                  </span>
                  <span className="text-xs font-semibold text-[#15803d] font-mono whitespace-nowrap">
                    {player.racket.stringTension}
                  </span>
                </div>

                <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#5c6f5e] whitespace-nowrap">
                    {isThai ? 'ประเภทเอ็น' : 'String Type'}
                  </span>
                  <span className="text-xs font-semibold text-[#142608] truncate">
                    {player.racket.stringType}
                  </span>
                </div>
              </div>
            )}
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
      <LogMatchModal
        isOpen={isLogMatchOpen}
        onClose={() => setIsLogMatchOpen(false)}
      />
    </div>
  );
};
