import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Swords,
  Clock,
  Users,
  Trophy,
  X,
  ChevronRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';
import { DoodleAvatar } from './DoodleAvatar';
import { playSelectSound } from '../../utils/retroAudio';

export const NotificationBanner: React.FC = () => {
  const { currentNotification, dismissNotification, navigateTo, language } = useApp();
  const [progress, setProgress] = useState(100);
  const isThai = language === 'th';

  useEffect(() => {
    if (!currentNotification) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const duration = 7000;
    const intervalTime = 50;
    const startTime = Date.now();

    const intervalTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPercent);
    }, intervalTime);

    const dismissTimer = setTimeout(() => {
      dismissNotification();
    }, duration);

    return () => {
      clearInterval(intervalTimer);
      clearTimeout(dismissTimer);
    };
  }, [currentNotification?.id, dismissNotification]);

  const handleBannerClick = () => {
    if (!currentNotification) return;
    playSelectSound();
    if (currentNotification.targetScreen) {
      navigateTo(currentNotification.targetScreen);
    }
    dismissNotification();
  };

  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentNotification) return;
    playSelectSound();
    if (currentNotification.actions?.primaryAction) {
      currentNotification.actions.primaryAction();
    } else if (currentNotification.targetScreen) {
      navigateTo(currentNotification.targetScreen);
    }
    dismissNotification();
  };

  const handleSecondaryAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentNotification) return;
    playSelectSound();
    if (currentNotification.actions?.secondaryAction) {
      currentNotification.actions.secondaryAction();
    }
    dismissNotification();
  };

  const getNotificationTheme = (type?: AppNotification['type']) => {
    switch (type) {
      case 'court_booking':
        return {
          badgeBg: 'bg-[#7cd7a0]',
          badgeText: 'text-[#000000]',
          badgeLabel: isThai ? 'ยืนยันการจองคอร์ท' : 'COURT CONFIRMED',
          icon: <Calendar className="w-4 h-4 text-[#000000]" />,
          borderAccent: 'border-l-4 border-l-[#7cd7a0]',
        };
      case 'match_invite':
        return {
          badgeBg: 'bg-[#ffd731]',
          badgeText: 'text-[#000000]',
          badgeLabel: isThai ? 'คำชวนดวลแมตช์' : 'MATCH INVITE',
          icon: <Swords className="w-4 h-4 text-[#000000]" />,
          borderAccent: 'border-l-4 border-l-[#ffd731]',
        };
      case 'match_countdown':
        return {
          badgeBg: 'bg-[#e85729]',
          badgeText: 'text-[#ffffff]',
          badgeLabel: isThai ? 'การแจ้งเตือนแมตช์' : 'UPCOMING MATCH',
          icon: <Clock className="w-4 h-4 text-[#ffffff]" />,
          borderAccent: 'border-l-4 border-l-[#e85729]',
        };
      case 'party_update':
        return {
          badgeBg: 'bg-[#e8f7ee]',
          badgeText: 'text-[#000000]',
          badgeLabel: isThai ? 'อัปเดตก๊วน' : 'PARTY UPDATE',
          icon: <Users className="w-4 h-4 text-[#000000]" />,
          borderAccent: 'border-l-4 border-l-[#15803d]',
        };
      case 'reward_exp':
        return {
          badgeBg: 'bg-[#ffd731]',
          badgeText: 'text-[#000000]',
          badgeLabel: isThai ? 'รางวัลความสำเร็จ' : 'REWARD',
          icon: <Trophy className="w-4 h-4 text-[#000000]" />,
          borderAccent: 'border-l-4 border-l-[#ffd731]',
        };
      default:
        return {
          badgeBg: 'bg-[#f4f8fb]',
          badgeText: 'text-[#000000]',
          badgeLabel: isThai ? 'การแจ้งเตือน' : 'ALERT',
          icon: <Sparkles className="w-4 h-4 text-[#000000]" />,
          borderAccent: 'border-l-4 border-l-[#000000]',
        };
    }
  };

  const theme = getNotificationTheme(currentNotification?.type);

  return (
    <AnimatePresence>
      {currentNotification && (
        <motion.div
          key={currentNotification.id}
          initial={{ y: -80, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          className="absolute top-[max(env(safe-area-inset-top,0px),24px)] left-5 right-5 z-50 pointer-events-auto select-none"
        >
          <div
            onClick={handleBannerClick}
            className={`w-full bg-[#ffffff] rounded-[24px] shadow-2xl p-3.5 space-y-2.5 cursor-pointer hover:bg-[#fafafa] transition-all relative overflow-hidden ${theme.borderAccent}`}
          >
            {/* Header Row: Badge, Time, Dismiss button */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className={`px-2 py-0.5 rounded-[1600px] text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 ${theme.badgeBg} ${theme.badgeText}`}
                >
                  {theme.icon}
                  <span>{theme.badgeLabel}</span>
                </span>
                {currentNotification.timeAgo && (
                  <span className="text-[10px] text-[#000000]/60 font-bold truncate">
                    {currentNotification.timeAgo}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  dismissNotification();
                }}
                className="w-6 h-6 rounded-full bg-[#eeeeee] hover:bg-[#000000] hover:text-[#ffffff] border border-[#000000] flex items-center justify-center text-[#000000] cursor-pointer transition-colors shrink-0"
                title="ปิดแจ้งเตือน"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body Content */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="font-['Antonio',sans-serif] text-sm font-black text-[#000000] uppercase tracking-wide leading-tight line-clamp-1">
                  {currentNotification.title}
                </h4>
                <p className="text-[11px] text-[#000000]/80 font-bold leading-snug line-clamp-2">
                  {currentNotification.message}
                </p>
              </div>

              {/* If metadata has avatar */}
              {currentNotification.metadata?.inviterAvatar && (
                <DoodleAvatar
                  seed={currentNotification.title}
                  size="sm"
                  ringClass="border-2 border-[#000000] shadow-xs"
                />
              )}
            </div>

            {/* Action Row */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#000000]/60">
                <span>{isThai ? 'แตะเพื่อเปิดหน้าจอที่เกี่ยวข้อง' : 'Tap to open details'}</span>
                <ChevronRight className="w-3 h-3 text-[#000000]/40" />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {currentNotification.actions?.secondaryLabel && (
                  <button
                    type="button"
                    onClick={handleSecondaryAction}
                    className="px-2.5 py-1 rounded-[1600px] bg-[#ffffff] hover:bg-[#f0f0f0] border border-[#000000] text-[10px] font-bold text-[#000000] cursor-pointer"
                  >
                    {currentNotification.actions.secondaryLabel}
                  </button>
                )}

                {/* Primary CTA button retains solid black border */}
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="px-3 py-1 rounded-[1600px] bg-[#000000] hover:bg-[#222222] text-[#ffffff] border-2 border-[#000000] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer active:scale-95 transition-transform shadow-xs"
                >
                  <span>{currentNotification.actions?.primaryLabel || (isThai ? 'ดูรายละเอียด' : 'View Details')}</span>
                  <Check className="w-3 h-3 text-[#7cd7a0]" />
                </button>
              </div>
            </div>

            {/* Auto-Dismiss Progress Bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#eeeeee]">
              <div
                className="h-full bg-[#000000] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
