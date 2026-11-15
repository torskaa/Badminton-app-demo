import React, { useEffect, useState } from 'react';
import { X, Download, Share2, Check, Sparkles, Trophy, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  AchievementCardTheme,
  generateAchievementCardDataUrl,
} from '../../utils/achievementCardGenerator';
import { playCoinSound, playSelectSound } from '../../utils/retroAudio';

interface ShareAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAchievementModal: React.FC<ShareAchievementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { player, drillStreak, language } = useApp();
  const isThai = language === 'th';

  const [cardTheme, setCardTheme] = useState<AchievementCardTheme>('mint');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const unlockedBadges = React.useMemo(
    () => player.badges.filter((b) => b.unlocked),
    [player.badges]
  );

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setIsGenerating(true);

    generateAchievementCardDataUrl({
      player,
      unlockedBadges,
      totalBadgesCount: player.badges.length,
      dailyStreakDays: drillStreak.currentStreak,
      language,
      theme: cardTheme,
    })
      .then((url) => {
        if (!cancelled) {
          setImageUrl(url);
          setIsGenerating(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsGenerating(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, player, unlockedBadges, drillStreak.currentStreak, language, cardTheme]);

  if (!isOpen) return null;

  const showTempStatus = (msg: string) => {
    setStatusFeedback(msg);
    setTimeout(() => {
      setStatusFeedback(null);
    }, 2600);
  };

  const handleDownloadPng = () => {
    if (!imageUrl) return;
    playCoinSound();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `smashclub-lv${player.level}-achievement.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showTempStatus(isThai ? 'บันทึกรูปการ์ด PNG แล้ว!' : 'Achievement card downloaded!');
  };

  const handleShareNative = async () => {
    if (!imageUrl) return;
    playSelectSound();

    const shareSummary = isThai
      ? `ตอนนี้ฉันอยู่เลเวล ${player.level} (${player.currentExp.toLocaleString()} คะแนน) และปลดล็อก ${unlockedBadges.length}/${player.badges.length} เหรียญรางวัลแล้ว!`
      : `Reached Lv.${player.level} (${player.currentExp.toLocaleString()} XP) with ${unlockedBadges.length}/${player.badges.length} trophies unlocked!`;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `smashclub-lv${player.level}-achievement.png`, {
        type: 'image/png',
      });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: isThai ? 'การ์ดความสำเร็จ' : 'SmashClub Achievement Card',
          text: shareSummary,
          files: [file],
        });
        showTempStatus(isThai ? 'แชร์การ์ดสำเร็จ!' : 'Shared successfully!');
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: isThai ? 'การ์ดความสำเร็จ' : 'SmashClub Achievement Card',
          text: shareSummary,
        });
        showTempStatus(isThai ? 'แชร์ความสำเร็จแล้ว!' : 'Shared successfully!');
        return;
      }

      if (navigator.clipboard && 'write' in navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showTempStatus(isThai ? 'คัดลอกรูปการ์ดลงคลิปบอร์ดแล้ว!' : 'Image copied to clipboard!');
        return;
      }
    } catch {
      // Fallback gracefully to text copy if share was cancelled or unsupported
    }

    try {
      await navigator.clipboard.writeText(shareSummary);
      showTempStatus(isThai ? 'คัดลอกข้อความสถิติพร้อมแชร์แล้ว!' : 'Achievement summary copied!');
    } catch {
      handleDownloadPng();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/65 backdrop-blur-xs">
      <div className="w-full max-w-[390px] max-h-[92dvh] overflow-y-auto no-scrollbar rounded-[32px] bg-[#f4f8fb] border-2 border-[#000000] shadow-[4px_6px_0px_#000000] p-4 space-y-3.5 text-[#000000]">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-[14px] bg-[#7cd7a0] border-2 border-[#000000] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#000000]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black leading-tight truncate">
                {isThai ? 'การ์ดแชร์ความสำเร็จ' : 'Share Achievement Card'}
              </h3>
              <p className="text-[11px] font-bold text-[#000000]/60 truncate">
                {isThai
                  ? `เลเวล ${player.level} · ${unlockedBadges.length} เหรียญล่าสุด`
                  : `Lv.${player.level} · ${unlockedBadges.length} Trophies Unlocked`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              onClose();
            }}
            aria-label={isThai ? 'ปิดหน้าต่าง' : 'Close modal'}
            className="w-8 h-8 rounded-[1600px] bg-[#ffffff] hover:bg-[#e5e7eb] flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4 text-[#000000]" />
          </button>
        </div>

        {/* Quick Telemetry Summary Pills */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[18px] bg-[#ffffff] px-3 py-2 flex items-center gap-2 shadow-xs">
            <Zap className="w-4 h-4 text-[#e85729] shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-[#000000]/55">
                {isThai ? 'เลเวลและคะแนน' : 'LEVEL & XP'}
              </div>
              <div className="text-xs font-black text-[#000000] tabular-nums truncate">
                {isThai
                  ? `เลเวล ${player.level} · ${player.currentExp.toLocaleString()} คะแนน`
                  : `Lv.${player.level} · ${player.currentExp.toLocaleString()} XP`}
              </div>
            </div>
          </div>
          <div className="rounded-[18px] bg-[#ffffff] px-3 py-2 flex items-center gap-2 shadow-xs">
            <Trophy className="w-4 h-4 text-[#15803d] shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-[#000000]/55">
                {isThai ? 'เหรียญล่าสุด' : 'TROPHY COUNT'}
              </div>
              <div className="text-xs font-black text-[#000000] tabular-nums truncate">
                {unlockedBadges.length} / {player.badges.length} {isThai ? 'ชิ้น' : 'Earned'}
              </div>
            </div>
          </div>
        </div>

        {/* Theme Switcher Pills */}
        <div data-filter="true" className="flex items-center gap-1.5 bg-[#ffffff] p-1 rounded-[1600px]">
          {(
            [
              { id: 'mint', labelTh: 'เขียวมินต์', labelEn: 'Mint' },
              { id: 'dark', labelTh: 'คอร์ทกลางคืน', labelEn: 'Night Court' },
              { id: 'orange', labelTh: 'ส้มสแมช', labelEn: 'Smash Orange' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                playSelectSound();
                setCardTheme(item.id);
              }}
              className={`flex-1 py-1.5 px-2 rounded-[1600px] text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                cardTheme === item.id
                  ? 'bg-[#000000] text-[#ffffff]'
                  : 'text-[#000000]/65 hover:text-[#000000]'
              }`}
            >
              {isThai ? item.labelTh : item.labelEn}
            </button>
          ))}
        </div>

        {/* Generated PNG Card Preview */}
        <div className="rounded-[24px] bg-[#ffffff] p-2 shadow-sm flex items-center justify-center aspect-[4/5] overflow-hidden relative">
          {isGenerating || !imageUrl ? (
            <div className="flex flex-col items-center justify-center gap-2 text-center p-6">
              <div className="w-8 h-8 rounded-full border-3 border-[#7cd7a0] border-t-[#000000] animate-spin" />
              <span className="text-xs font-bold text-[#000000]/60">
                {isThai ? 'กำลังสร้างการ์ดรูปภาพ...' : 'Generating image card...'}
              </span>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={isThai ? 'การ์ดความสำเร็จ' : 'SmashClub Achievement Card'}
              className="w-full h-full object-contain rounded-[18px]"
            />
          )}
        </div>

        {/* Feedback Banner */}
        {statusFeedback && (
          <div className="rounded-[16px] bg-[#7cd7a0] px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-[#000000]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusFeedback}</span>
          </div>
        )}

        {/* Interactive Share & Download CTAs */}
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={!imageUrl || isGenerating}
            className="py-2.5 px-3 rounded-[1600px] bg-[#ffffff] hover:bg-[#e5e7eb] text-[#000000] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>{isThai ? 'บันทึกรูปภาพ' : 'Save PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareNative}
            disabled={!imageUrl || isGenerating}
            className="py-2.5 px-3 rounded-[1600px] bg-[#7cd7a0] hover:bg-[#6bc991] text-[#000000] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <Share2 className="w-3.5 h-3.5 shrink-0" />
            <span>{isThai ? 'แชร์การ์ด' : 'Share Card'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
