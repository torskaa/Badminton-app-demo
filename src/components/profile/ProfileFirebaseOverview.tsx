import React from 'react';
import {
  ArrowRight,
  Award,
  Clock,
  Cloud,
  Flame,
  HeartHandshake,
  LogIn,
  Plus,
  Sparkles,
  Sun,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge, PlayerProfile } from '../../types';
import { HistoricalMatchSummaryStats } from '../../utils/matchHistoryUtils';
import { playSelectSound } from '../../utils/retroAudio';

export function renderBadgeIcon(iconName: string, className = 'w-5 h-5') {
  switch (iconName) {
    case 'Zap':
      return <Zap className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    default:
      return <Award className={className} />;
  }
}

export function getRarityLabel(rarity: Badge['rarity'], isThai: boolean): string {
  if (!isThai) return rarity;
  switch (rarity) {
    case 'Legendary':
      return 'ตำนาน';
    case 'Epic':
      return 'มหากาพย์';
    case 'Rare':
      return 'หายาก';
    default:
      return 'ทั่วไป';
  }
}

export function getRarityAccent(rarity: Badge['rarity']): string {
  switch (rarity) {
    case 'Legendary':
      return 'text-[#e85729]';
    case 'Epic':
      return 'text-[#004d2c]';
    case 'Rare':
      return 'text-[#15803d]';
    default:
      return 'text-[#5c6f5e]';
  }
}

interface LevelProgressCardProps {
  player: PlayerProfile;
  tierDisplayLabel: string;
  ovrScore: number;
  isThai: boolean;
  isSignedIn: boolean;
  isLoading: boolean;
  syncedAtMs: number | null;
}

export const LevelProgressCard: React.FC<LevelProgressCardProps> = ({
  player,
  tierDisplayLabel,
  ovrScore,
  isThai,
  isSignedIn,
  isLoading,
  syncedAtMs,
}) => {
  const safeNextExp = Math.max(1, player.nextLevelExp || 1000);
  const progressPct = Math.min(100, Math.max(0, Math.round((player.currentExp / safeNextExp) * 100)));
  const remainingExp = Math.max(0, safeNextExp - player.currentExp);
  const syncedLabel = syncedAtMs
    ? new Date(syncedAtMs).toLocaleTimeString(isThai ? 'th-TH' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  if (isLoading) {
    return (
      <div className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] p-4 space-y-3 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded bg-[#e6eee2]" />
          <div className="h-4 w-20 rounded bg-[#e6eee2]" />
        </div>
        <div className="h-3 w-full rounded-full bg-[#e6eee2]" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 rounded-[14px] bg-[#f8faf6]" />
          <div className="h-12 rounded-[14px] bg-[#f8faf6]" />
          <div className="h-12 rounded-[14px] bg-[#f8faf6]" />
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] p-4 sm:p-5 space-y-3.5 shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[26px] font-bold text-[#004d2c] leading-none tabular-nums">
              {isThai ? `เลเวล ${player.level}` : `Level ${player.level}`}
            </span>
            <span className="text-xs font-semibold text-[#142608]">
              {tierDisplayLabel}
            </span>
          </div>
          <p className="text-[11px] text-[#5c6f5e] mt-1">
            {isThai
              ? `อีก ${remainingExp.toLocaleString()} EXP เพื่อขึ้นเลเวล ${player.level + 1}`
              : `${remainingExp.toLocaleString()} EXP needed for Level ${player.level + 1}`}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803d]">
            <Cloud className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isSignedIn
                ? isThai
                  ? 'Firebase สด'
                  : 'Firebase Live'
                : isThai
                  ? 'โหมดพรีวิว'
                  : 'Local Preview'}
            </span>
          </div>
          {isSignedIn && syncedLabel && (
            <div className="text-[10px] text-[#5c6f5e] tabular-nums mt-0.5">
              {isThai ? `อัปเดต ${syncedLabel}` : `Synced ${syncedLabel}`}
            </div>
          )}
        </div>
      </div>

      {/* EXP Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] tabular-nums">
          <span className="font-semibold text-[#142608]">
            {player.currentExp.toLocaleString()} / {safeNextExp.toLocaleString()} EXP
          </span>
          <span className="font-bold text-[#004d2c]">{progressPct}%</span>
        </div>
        <div
          className="h-2.5 w-full rounded-full bg-[#e8f0e4] overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#004d2c] via-[#15803d] to-[#7cd7a0] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Compact Level Metadata Strip (no pills) */}
      <div className="grid grid-cols-3 gap-2 pt-0.5 text-center tabular-nums">
        <div className="py-2 px-2 rounded-[14px] bg-[#f8faf6] border border-[#e6eee2]">
          <div className="text-[10px] font-medium text-[#5c6f5e]">
            {isThai ? 'ค่าพลังรวม' : 'Overall OVR'}
          </div>
          <div className="text-base font-bold text-[#142608] mt-0.5">{ovrScore}</div>
        </div>
        <div className="py-2 px-2 rounded-[14px] bg-[#f8faf6] border border-[#e6eee2]">
          <div className="text-[10px] font-medium text-[#5c6f5e]">
            {isThai ? 'สตรีคสัปดาห์' : 'Week Streak'}
          </div>
          <div className="text-base font-bold text-[#e85729] mt-0.5">
            {player.streakWeeks} {isThai ? 'สัปดาห์' : 'wk'}
          </div>
        </div>
        <div className="py-2 px-2 rounded-[14px] bg-[#e8f7ee] border border-[#7cd7a0]/45">
          <div className="text-[10px] font-medium text-[#004d2c]">
            {isThai ? 'เลเวลถัดไป' : 'Next Milestone'}
          </div>
          <div className="text-base font-bold text-[#004d2c] mt-0.5">Lv.{player.level + 1}</div>
        </div>
      </div>
    </section>
  );
};

interface EarnedBadgesShowcaseCardProps {
  badges: Badge[];
  isThai: boolean;
  isSignedIn: boolean;
  isLoading: boolean;
  onViewAllBadges: () => void;
}

export const EarnedBadgesShowcaseCard: React.FC<EarnedBadgesShowcaseCardProps> = ({
  badges,
  isThai,
  isSignedIn,
  isLoading,
  onViewAllBadges,
}) => {
  const earnedBadges = badges.filter((b) => b.unlocked);
  const nextInProgress = badges
    .filter((b) => !b.unlocked)
    .sort((a, b) => b.progress / Math.max(1, b.maxProgress) - a.progress / Math.max(1, a.maxProgress))[0];

  if (isLoading) {
    return (
      <div className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] p-4 space-y-3 animate-pulse">
        <div className="h-5 w-40 rounded bg-[#e6eee2]" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="h-24 rounded-[16px] bg-[#f8faf6]" />
          <div className="h-24 rounded-[16px] bg-[#f8faf6]" />
          <div className="h-24 rounded-[16px] bg-[#f8faf6]" />
          <div className="h-24 rounded-[16px] bg-[#f8faf6]" />
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] p-4 sm:p-5 space-y-3.5 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold text-[#142608] leading-tight">
            {isThai ? 'เหรียญรางวัลที่ได้รับ' : 'Badges Earned'}
          </h3>
          <p className="text-[11px] text-[#5c6f5e] mt-0.5 tabular-nums">
            {isThai
              ? `ปลดล็อกแล้ว ${earnedBadges.length} จาก ${badges.length} เหรียญ${isSignedIn ? ' · ซิงค์จาก Firebase' : ''}`
              : `${earnedBadges.length} of ${badges.length} unlocked${isSignedIn ? ' · Fetched from Firebase' : ''}`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playSelectSound();
            onViewAllBadges();
          }}
          className="no-doodle min-h-[38px] px-3 rounded-full bg-[#f8faf6] border border-[#d4dfd0] hover:border-[#004d2c] text-[11px] font-semibold text-[#004d2c] flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>{isThai ? 'ดูทั้งหมด' : 'View all'}</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>

      {earnedBadges.length === 0 ? (
        <div className="p-4 rounded-[16px] bg-[#f8faf6] border border-[#e6eee2] text-center space-y-1">
          <p className="text-xs font-semibold text-[#142608]">
            {isThai ? 'ยังไม่มีเหรียญที่ปลดล็อก' : 'No badges earned yet'}
          </p>
          <p className="text-[11px] text-[#5c6f5e]">
            {isThai
              ? 'ลงแข่งและบันทึกแมตช์เพื่อปลดล็อกเหรียญรางวัลแรกของคุณ'
              : 'Log your matches to unlock your first achievement badge.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {earnedBadges.slice(0, 4).map((badge) => (
            <button
              key={badge.id}
              type="button"
              onClick={() => {
                playSelectSound();
                onViewAllBadges();
              }}
              className="no-doodle text-left p-3 rounded-[18px] bg-[#f8faf6] border border-[#d4dfd0] hover:border-[#004d2c] transition-colors flex flex-col justify-between gap-2 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="w-9 h-9 rounded-full bg-[#e8f7ee] text-[#004d2c] flex items-center justify-center shrink-0">
                  {renderBadgeIcon(badge.iconName, 'w-4 h-4')}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide ${getRarityAccent(badge.rarity)}`}>
                  {getRarityLabel(badge.rarity, isThai)}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#142608] leading-snug truncate">
                  {isThai ? badge.thaiName : badge.name}
                </div>
                <div className="text-[10px] text-[#5c6f5e] truncate mt-0.5">
                  {badge.unlockedAt || (isThai ? 'ปลดล็อกแล้ว' : 'Unlocked')}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Next Milestone In-Progress Bar */}
      {nextInProgress && (
        <div className="p-3 rounded-[16px] bg-[#f8faf6] border border-[#e6eee2] space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[#5c6f5e] shrink-0">
                {renderBadgeIcon(nextInProgress.iconName, 'w-3.5 h-3.5')}
              </span>
              <span className="font-semibold text-[#142608] truncate">
                {isThai ? `ใกล้ปลดล็อก: ${nextInProgress.thaiName}` : `Next up: ${nextInProgress.name}`}
              </span>
            </div>
            <span className="font-bold text-[#004d2c] tabular-nums shrink-0">
              {nextInProgress.progress}/{nextInProgress.maxProgress}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#dce7d7] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#15803d] transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((nextInProgress.progress / Math.max(1, nextInProgress.maxProgress)) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

interface HistoricalMatchStatsCardProps {
  stats: HistoricalMatchSummaryStats;
  isThai: boolean;
  isSignedIn: boolean;
  isLoading: boolean;
  onLogMatch: () => void;
  onOpenLiveScorer: () => void;
  onSignIn: () => void;
  onViewAllMatches: () => void;
}

export const HistoricalMatchStatsCard: React.FC<HistoricalMatchStatsCardProps> = ({
  stats,
  isThai,
  isSignedIn,
  isLoading,
  onLogMatch,
  onOpenLiveScorer,
  onSignIn,
  onViewAllMatches,
}) => {
  const durationDisplay =
    stats.totalDurationMin >= 60
      ? `${(stats.totalDurationMin / 60).toFixed(1)} ${isThai ? 'ชม.' : 'hrs'}`
      : `${stats.totalDurationMin} ${isThai ? 'นาที' : 'min'}`;

  if (isLoading) {
    return (
      <div className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] p-4 space-y-3 animate-pulse">
        <div className="h-5 w-48 rounded bg-[#e6eee2]" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="h-16 rounded-[16px] bg-[#f8faf6]" />
          <div className="h-16 rounded-[16px] bg-[#f8faf6]" />
          <div className="h-16 rounded-[16px] bg-[#f8faf6]" />
          <div className="h-16 rounded-[16px] bg-[#f8faf6]" />
        </div>
        <div className="h-32 rounded-[16px] bg-[#f8faf6]" />
      </div>
    );
  }

  return (
    <section className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="flex items-start justify-between gap-2.5 flex-wrap">
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold text-[#142608] leading-tight">
            {isThai ? 'สถิติแมตช์ย้อนหลัง' : 'Historical Match Stats'}
          </h3>
          <p className="text-[11px] text-[#5c6f5e] mt-0.5">
            {isSignedIn
              ? isThai
                ? `ดึงข้อมูลจริงจาก Firebase · ${stats.totalMatches} แมตช์ของคุณ`
                : `Fetched live from Firebase · ${stats.totalMatches} recorded matches`
              : isThai
                ? 'ตัวอย่างข้อมูลในเครื่อง · เข้าสู่ระบบ Google เพื่อดึงสถิติจาก Firebase'
                : 'Local preview · Sign in with Google to fetch your Firebase match history'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              onLogMatch();
            }}
            className="no-doodle min-h-[38px] px-3.5 rounded-full bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>{isThai ? 'บันทึกแมตช์' : 'Log Match'}</span>
          </button>
          {stats.totalMatches > 0 && (
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                onViewAllMatches();
              }}
              className="no-doodle min-h-[38px] px-3 rounded-full bg-[#f8faf6] border border-[#d4dfd0] hover:border-[#004d2c] text-[11px] font-semibold text-[#004d2c] flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>{isThai ? 'ทั้งหมด' : 'All'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* Signed-in Empty State */}
      {stats.totalMatches === 0 ? (
        <div className="p-5 rounded-[18px] bg-[#f8faf6] border border-[#e6eee2] text-center space-y-3">
          <div className="w-11 h-11 rounded-full bg-[#e8f7ee] text-[#004d2c] flex items-center justify-center mx-auto">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#142608]">
              {isThai ? 'ยังไม่มีประวัติแมตช์ใน Firebase' : 'No Firebase match history yet'}
            </h4>
            <p className="text-xs text-[#5c6f5e] max-w-sm mx-auto leading-relaxed">
              {isThai
                ? 'บันทึกผลการแข่งขันแรกของคุณเพื่อเริ่มติดตามอัตราชนะ ความเร็วตบ และรับ EXP อัปเลเวลทันที'
                : 'Log your first badminton match to track win rate, smash velocity, court time, and earn EXP.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                onLogMatch();
              }}
              className="no-doodle min-h-[44px] px-4 rounded-full bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isThai ? 'บันทึกแมตช์แรกเลย' : 'Log First Match'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                onOpenLiveScorer();
              }}
              className="no-doodle min-h-[44px] px-4 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#004d2c] text-[#142608] text-xs font-semibold cursor-pointer"
            >
              {isThai ? 'เปิดกระดานนับแต้มสด' : 'Open Live Scorer'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 4-Cell Aggregated KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 tabular-nums">
            <div className="p-3 rounded-[16px] bg-[#f8faf6] border border-[#e6eee2]">
              <div className="text-[10px] font-semibold text-[#5c6f5e]">
                {isThai ? 'อัตราชนะ' : 'Win Rate'}
              </div>
              <div className="text-xl font-bold text-[#004d2c] mt-0.5 leading-tight">
                {stats.winRate}%
              </div>
              <div className="text-[11px] font-medium text-[#5c6f5e] mt-0.5">
                {isThai ? `ชนะ ${stats.wins} · แพ้ ${stats.losses}` : `${stats.wins}W · ${stats.losses}L`}
              </div>
            </div>

            <div className="p-3 rounded-[16px] bg-[#f8faf6] border border-[#e6eee2]">
              <div className="text-[10px] font-semibold text-[#5c6f5e]">
                {isThai ? 'ตบสูงสุด / เฉลี่ย' : 'Peak / Avg Smash'}
              </div>
              <div className="text-xl font-bold text-[#142608] mt-0.5 leading-tight">
                {stats.peakSmashKmh}
                <span className="text-[11px] font-medium text-[#5c6f5e] ml-1">km/h</span>
              </div>
              <div className="text-[11px] font-medium text-[#5c6f5e] mt-0.5">
                {isThai ? `เฉลี่ย ${stats.avgSmashKmh} กม./ชม.` : `Avg ${stats.avgSmashKmh} km/h`}
              </div>
            </div>

            <div className="p-3 rounded-[16px] bg-[#e8f7ee] border border-[#7cd7a0]/45">
              <div className="text-[10px] font-semibold text-[#004d2c]">
                {isThai ? 'EXP จากแมตช์' : 'Match EXP'}
              </div>
              <div className="text-xl font-bold text-[#004d2c] mt-0.5 leading-tight">
                +{stats.totalExpGained.toLocaleString()}
              </div>
              <div className="text-[11px] font-medium text-[#15803d] mt-0.5">
                {stats.totalMatches} {isThai ? 'แมตช์' : 'matches'}
              </div>
            </div>

            <div className="p-3 rounded-[16px] bg-[#f8faf6] border border-[#e6eee2]">
              <div className="text-[10px] font-semibold text-[#5c6f5e] flex items-center gap-1">
                <Clock className="w-3 h-3 shrink-0" />
                <span>{isThai ? 'เวลาลงคอร์ท' : 'Court Time'}</span>
              </div>
              <div className="text-xl font-bold text-[#142608] mt-0.5 leading-tight">
                {durationDisplay}
              </div>
              <div className="text-[11px] font-medium text-[#5c6f5e] mt-0.5">
                {stats.currentStreak.count > 0
                  ? stats.currentStreak.type === 'win'
                    ? isThai
                      ? `ชนะติด ${stats.currentStreak.count} นัด`
                      : `${stats.currentStreak.count}W streak`
                    : isThai
                      ? `แพ้ติด ${stats.currentStreak.count} นัด`
                      : `${stats.currentStreak.count}L streak`
                  : '-'}
              </div>
            </div>
          </div>

          {/* Singles vs Doubles Split Bar */}
          <div className="grid grid-cols-2 gap-2.5 text-[11px] tabular-nums">
            <div className="px-3 py-2.5 rounded-[14px] bg-[#f8faf6] border border-[#e6eee2] flex items-center justify-between gap-2">
              <span className="font-semibold text-[#142608]">
                {isThai ? 'ประเภทเดี่ยว' : 'Singles'}
              </span>
              <span className="text-[#5c6f5e]">
                {stats.singlesMatches > 0
                  ? `${stats.singlesWins}W-${stats.singlesMatches - stats.singlesWins}L (${stats.singlesWinRate}%)`
                  : isThai
                    ? 'ยังไม่มี'
                    : 'None'}
              </span>
            </div>
            <div className="px-3 py-2.5 rounded-[14px] bg-[#f8faf6] border border-[#e6eee2] flex items-center justify-between gap-2">
              <span className="font-semibold text-[#142608]">
                {isThai ? 'ประเภทคู่' : 'Doubles'}
              </span>
              <span className="text-[#5c6f5e]">
                {stats.doublesMatches > 0
                  ? `${stats.doublesWins}W-${stats.doublesMatches - stats.doublesWins}L (${stats.doublesWinRate}%)`
                  : isThai
                    ? 'ยังไม่มี'
                    : 'None'}
              </span>
            </div>
          </div>

          {/* Historical Smash Velocity Trend Chart */}
          {stats.trendSeries.length >= 2 && (
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#142608]">
                  {isThai ? 'กราฟความเร็วตบย้อนหลัง (กม./ชม.)' : 'Smash Speed Trend (km/h)'}
                </span>
                <span className="text-[#5c6f5e] tabular-nums">
                  {isThai
                    ? `คะแนนเฉลี่ย ${stats.avgPointsFor} : ${stats.avgPointsAgainst}`
                    : `Avg pts ${stats.avgPointsFor} : ${stats.avgPointsAgainst}`}
                </span>
              </div>
              <div className="h-[140px] w-full rounded-[16px] bg-[#f8faf6] border border-[#e6eee2] pt-3 pr-3 pb-1 pl-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.trendSeries} margin={{ top: 4, right: 6, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="smashTrendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#15803d" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#7cd7a0" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dce7d7" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#5c6f5e', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={['dataMin - 20', 'dataMax + 15']}
                      tick={{ fill: '#5c6f5e', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const row = payload[0].payload as HistoricalMatchSummaryStats['trendSeries'][number];
                        return (
                          <div className="bg-[#ffffff] border border-[#d4dfd0] rounded-[12px] px-3 py-2 shadow-md text-[11px] tabular-nums">
                            <div className="font-bold text-[#142608]">
                              vs {row.opponent} ({row.score})
                            </div>
                            <div className="text-[#004d2c] font-semibold mt-0.5">
                              {row.smashKmh} km/h · +{row.expGained} EXP
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="smashKmh"
                      stroke="#004d2c"
                      strokeWidth={2.2}
                      fill="url(#smashTrendFill)"
                      dot={{ r: 3.5, fill: '#004d2c', stroke: '#ffffff', strokeWidth: 1.5 }}
                      activeDot={{ r: 5, fill: '#e85729', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {!isSignedIn && (
            <div className="pt-1 flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0]">
              <span className="text-[11px] text-[#5c6f5e]">
                {isThai
                  ? 'เข้าสู่ระบบ Google เพื่อดึงและซิงค์สถิติแมตช์ของคุณจาก Firebase'
                  : 'Sign in with Google to fetch and persist your match stats in Firebase.'}
              </span>
              <button
                type="button"
                onClick={onSignIn}
                className="no-doodle min-h-[36px] px-3 rounded-full bg-[#004d2c] text-[#ffffff] text-[11px] font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isThai ? 'เข้าสู่ระบบ' : 'Sign In'}</span>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
