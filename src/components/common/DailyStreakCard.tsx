import React from 'react';
import { Flame, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playSelectSound } from '../../utils/retroAudio';
import { CACHE_KEYS, QuestsDrillsCacheData, readCache, writeCache } from '../../utils/offlineCache';

export const DailyStreakCard: React.FC = () => {
  const { drillStreak, drills, quests, language, navigateTo, isOnline, lastSyncedAt } = useApp();
  const isThai = language === 'th';

  const remainingDrillsCount = drills.filter((d) => !d.completed).length;

  const handleOpenDrills = () => {
    playSelectSound();
    const existing = readCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS);
    writeCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS, {
      quests: existing?.quests ?? quests,
      drills: existing?.drills ?? drills,
      activeTab: 'drills',
      lastSyncedAt: lastSyncedAt ?? Date.now(),
      pendingSync: existing?.pendingSync ?? !isOnline,
    });
    navigateTo('D2');
  };

  return (
    <div className="rounded-[28px] bg-[#ffffff] p-4 shadow-sm space-y-3.5">
      {/* Top Row: Flame Emblem, Streak Count & Primary CTA */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Flame Icon Badge */}
          <div
            className={`w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 relative transition-colors ${
              drillStreak.completedToday
                ? 'bg-[#e85729] text-[#ffffff]'
                : 'bg-[#fff3ee] text-[#e85729]'
            }`}
          >
            <Flame
              className={`w-6 h-6 ${
                drillStreak.completedToday ? 'fill-[#ffffff] text-[#ffffff]' : 'fill-[#e85729]/20 text-[#e85729]'
              }`}
            />
            {drillStreak.completedToday && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#7cd7a0] border-2 border-[#ffffff] flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-[#000000] stroke-[3]" />
              </span>
            )}
          </div>

          {/* Count & Status */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-[#000000]/55 uppercase">
                {isThai ? 'สตรีคซ้อมแบดรายวัน' : 'DAILY DRILL STREAK'}
              </span>
              <span className="px-2 py-0.5 rounded-[1600px] bg-[#f3f4f6] text-[9px] font-bold text-[#000000]/70 whitespace-nowrap shrink-0 tabular-nums">
                {isThai ? `สูงสุด ${drillStreak.longestStreak} วัน` : `Best ${drillStreak.longestStreak}d`}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span
                data-testid="daily-streak-count"
                className="text-2xl font-black text-[#000000] font-['Antonio',sans-serif] leading-none tabular-nums"
              >
                {drillStreak.currentStreak}
              </span>
              <span className="text-xs font-black text-[#000000]">
                {isThai
                  ? 'วันติด'
                  : drillStreak.currentStreak === 1
                  ? 'Day Streak'
                  : 'Days Streak'}
              </span>
            </div>

            <p
              className={`text-[11px] font-bold mt-0.5 leading-snug ${
                drillStreak.completedToday ? 'text-[#15803d]' : 'text-[#e85729]'
              }`}
            >
              {drillStreak.completedToday
                ? isThai
                  ? 'วันนี้ซ้อมแบบฝึกครบแล้ว สตรีคปลอดภัย!'
                  : "Today's drill complete! Streak locked in."
                : drillStreak.currentStreak > 0
                ? isThai
                  ? `ทำแบบฝึกอีก 1 อย่างวันนี้เพื่ออัปเป็น ${drillStreak.currentStreak + 1} วันติด`
                  : `Finish 1 drill today to hit ${drillStreak.currentStreak + 1} days`
                : isThai
                ? 'เริ่มซ้อมแบบฝึกวันนี้เพื่อเปิดสตรีคแรก'
                : 'Complete 1 drill today to start your streak'}
            </p>
          </div>
        </div>

        {/* Single-line Interactive CTA Button */}
        <button
          type="button"
          onClick={handleOpenDrills}
          className={`px-3.5 py-2 rounded-[1600px] text-[11px] font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 transition-transform ${
            drillStreak.completedToday
              ? 'bg-[#ffffff] hover:bg-[#f3f4f6] text-[#000000]'
              : 'bg-[#7cd7a0] hover:bg-[#6bc991] text-[#000000]'
          }`}
        >
          <span>
            {drillStreak.completedToday
              ? isThai
                ? `ฝึกเพิ่ม (${remainingDrillsCount})`
                : `Drills (${remainingDrillsCount})`
              : isThai
              ? 'ซ้อมเลย'
              : 'Train Now'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>

      {/* Bottom 7-Day Consecutive Tracker Strip */}
      <div className="pt-2 border-t border-[#f3f4f6] grid grid-cols-7 gap-1.5">
        {drillStreak.last7Days.map((day) => (
          <div key={day.dateKey} className="flex flex-col items-center gap-1">
            <span
              className={`text-[10px] font-bold leading-none ${
                day.isToday ? 'text-[#000000]' : 'text-[#000000]/50'
              }`}
            >
              {isThai ? day.labelTh : day.labelEn}
            </span>
            <div
              className={`w-8 h-8 rounded-[1600px] flex items-center justify-center transition-all ${
                day.completed && day.isToday
                  ? 'bg-[#e85729] text-[#ffffff]'
                  : day.completed
                  ? 'bg-[#7cd7a0] text-[#000000]'
                  : day.isToday
                  ? 'bg-[#fff3ee] text-[#e85729] border border-dashed border-[#e85729]'
                  : 'bg-[#f3f4f6] text-[#000000]/25'
              }`}
            >
              {day.completed ? (
                <Flame
                  className={`w-4 h-4 ${
                    day.isToday ? 'fill-[#ffffff] text-[#ffffff]' : 'fill-[#000000]/15 text-[#000000]'
                  }`}
                />
              ) : day.isToday ? (
                <Flame className="w-3.5 h-3.5 text-[#e85729]/70" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#000000]/20" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
