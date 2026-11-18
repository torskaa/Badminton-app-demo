import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Crosshair,
  Dumbbell,
  Home,
  MapPin,
  Plus,
  Share2,
  Shuffle,
  Trophy,
  User,
  Wallet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';
import { playSelectSound } from '../../utils/retroAudio';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

type ActionIconKey =
  | 'home'
  | 'map'
  | 'wallet'
  | 'share'
  | 'drills'
  | 'profile'
  | 'trophy'
  | 'plus'
  | 'shuffle'
  | 'radar'
  | 'calendar';

interface HeaderMeta {
  thTitle: string;
  enTitle: string;
  action?: {
    thLabel: string;
    enLabel: string;
    target: ScreenId;
    icon: ActionIconKey;
  };
}

const renderActionIcon = (icon: ActionIconKey) => {
  const cls = 'w-4 h-4 stroke-[1.9]';
  switch (icon) {
    case 'home':
      return <Home className={cls} />;
    case 'map':
      return <MapPin className={cls} />;
    case 'wallet':
      return <Wallet className={cls} />;
    case 'share':
      return <Share2 className={cls} />;
    case 'drills':
      return <Dumbbell className={cls} />;
    case 'profile':
      return <User className={cls} />;
    case 'trophy':
      return <Trophy className={cls} />;
    case 'plus':
      return <Plus className={cls} />;
    case 'shuffle':
      return <Shuffle className={cls} />;
    case 'radar':
      return <Crosshair className={cls} />;
    case 'calendar':
      return <Calendar className={cls} />;
  }
};

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack,
  onBack,
  subtitle,
  rightSlot,
}) => {
  const { currentScreen, goBack, navigateTo, language } = useApp();
  const isThai = language === 'th';

  const shouldShowBack = showBack !== undefined ? showBack : currentScreen !== 'HOME';

  const DEFAULT_META: Record<string, HeaderMeta> = {
    A1: {
      thTitle: 'เริ่มต้น',
      enTitle: 'Welcome',
    },
    A2: {
      thTitle: 'สไตล์การเล่น',
      enTitle: 'Playstyle',
      action: { thLabel: 'หน้าหลัก', enLabel: 'Home', target: 'HOME', icon: 'home' },
    },
    B1: {
      thTitle: 'ค้นหาสนาม',
      enTitle: 'Courts',
      action: { thLabel: 'แผนที่สนาม', enLabel: 'Court Map', target: 'MAP', icon: 'map' },
    },
    B2: {
      thTitle: 'จองคอร์ท',
      enTitle: 'Book Court',
      action: { thLabel: 'แผนที่สนาม', enLabel: 'Court Map', target: 'MAP', icon: 'map' },
    },
    B3: {
      thTitle: 'ชำระเงิน',
      enTitle: 'Checkout',
      action: { thLabel: 'กระเป๋าเงิน', enLabel: 'Wallet', target: 'FINANCE', icon: 'wallet' },
    },
    B4: {
      thTitle: 'บัตรเข้าสนาม',
      enTitle: 'Court Pass',
      action: { thLabel: 'แผนที่สนาม', enLabel: 'Court Map', target: 'MAP', icon: 'map' },
    },
    C1: {
      thTitle: 'บันทึกแต้ม',
      enTitle: 'Scorer',
    },
    C2: {
      thTitle: 'สรุปผลแข่ง',
      enTitle: 'Match Summary',
      action: { thLabel: 'การ์ดสรุปผล', enLabel: 'Recap Card', target: 'C4', icon: 'share' },
    },
    C3: {
      thTitle: 'วิเคราะห์เกม',
      enTitle: 'Diagnostics',
      action: { thLabel: 'แบบฝึกแก้ทาง', enLabel: 'Drills', target: 'D2', icon: 'drills' },
    },
    C4: {
      thTitle: 'การ์ดสรุปผล',
      enTitle: 'Recap Card',
      action: { thLabel: 'โปรไฟล์', enLabel: 'Profile', target: 'F1', icon: 'profile' },
    },
    D1: {
      thTitle: 'โค้ช AI',
      enTitle: 'AI Coach',
      action: { thLabel: 'ภารกิจและแบบฝึก', enLabel: 'Quests', target: 'D2', icon: 'trophy' },
    },
    D2: {
      thTitle: 'ภารกิจและฝึกซ้อม',
      enTitle: 'Quests & Drills',
      action: { thLabel: 'โค้ช AI', enLabel: 'AI Coach', target: 'D1', icon: 'radar' },
    },
    D3: {
      thTitle: 'สแกนวิดีโอ',
      enTitle: 'AI Video',
      action: { thLabel: 'โค้ช AI', enLabel: 'AI Coach', target: 'D1', icon: 'radar' },
    },
    E1: {
      thTitle: 'ก๊วนตีแบด',
      enTitle: 'Guilds',
      action: { thLabel: 'นัดก๊วน', enLabel: 'New Event', target: 'E2', icon: 'plus' },
    },
    E2: {
      thTitle: 'รายละเอียดก๊วน',
      enTitle: 'Event RSVP',
      action: { thLabel: 'จับคู่ 50/50', enLabel: 'Matchmaker', target: 'E3', icon: 'shuffle' },
    },
    E3: {
      thTitle: 'จับคู่ 50/50',
      enTitle: 'Matchmaker',
      action: { thLabel: 'อันดับก๊วน', enLabel: 'Leaderboard', target: 'E4', icon: 'trophy' },
    },
    E4: {
      thTitle: 'อันดับก๊วน',
      enTitle: 'Leaderboard',
      action: { thLabel: 'จับคู่ 50/50', enLabel: 'Matchmaker', target: 'E3', icon: 'shuffle' },
    },
    F1: {
      thTitle: 'โปรไฟล์',
      enTitle: 'Profile',
    },
    F2: {
      thTitle: 'นาฬิกาและสุขภาพ',
      enTitle: 'Wearable Sync',
      action: { thLabel: 'โปรไฟล์', enLabel: 'Profile', target: 'F1', icon: 'profile' },
    },
    CLUB_TOOLS: {
      thTitle: 'เครื่องมือ',
      enTitle: 'Tools',
      action: { thLabel: 'นัดก๊วน', enLabel: 'RSVP', target: 'E2', icon: 'calendar' },
    },
    FINANCE: {
      thTitle: 'การเงิน',
      enTitle: 'Finance',
    },
  };

  const meta = DEFAULT_META[currentScreen];
  const resolvedTitle = title || (meta ? (isThai ? meta.thTitle : meta.enTitle) : undefined);
  const defaultAction = meta?.action;

  const handleBack = () => {
    playSelectSound();
    if (onBack) {
      onBack();
      return;
    }
    goBack();
  };

  return (
    <header className="sticky top-0 z-30 app-header-safe px-5 pb-3 flex items-center justify-between gap-3 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#d4dfd0]/60 shrink-0 select-none text-[#142608]">
      {shouldShowBack ? (
        <button
          type="button"
          onClick={handleBack}
          className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#2d4d14] shadow-2xs flex items-center justify-center text-[#142608] active:scale-95 transition-all cursor-pointer shrink-0"
          aria-label={isThai ? 'ย้อนกลับ' : 'Back'}
          title={isThai ? 'ย้อนกลับ' : 'Back'}
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
        </button>
      ) : (
        <div className="w-11 h-11 shrink-0" aria-hidden="true" />
      )}

      <div className="min-w-0 flex-1 text-center px-1">
        {resolvedTitle && (
          <h1 className="text-[15px] font-semibold text-[#111111] tracking-tight leading-tight truncate">
            {resolvedTitle}
          </h1>
        )}
        {subtitle && (
          <p className="text-[11px] font-normal text-[#71717a] leading-snug truncate mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {rightSlot ? (
        <div className="shrink-0 min-w-[44px] flex items-center justify-end">{rightSlot}</div>
      ) : defaultAction ? (
        <button
          type="button"
          onClick={() => {
            playSelectSound();
            navigateTo(defaultAction.target);
          }}
          aria-label={isThai ? defaultAction.thLabel : defaultAction.enLabel}
          title={isThai ? defaultAction.thLabel : defaultAction.enLabel}
          className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#2d4d14] shadow-2xs flex items-center justify-center text-[#142608] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          {renderActionIcon(defaultAction.icon)}
        </button>
      ) : (
        <div className="w-11 h-11 shrink-0" aria-hidden="true" />
      )}
    </header>
  );
};
