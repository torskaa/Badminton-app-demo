import React, { useState } from 'react';
import { Backpack, Check, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playCoinSound, playSelectSound } from '../../utils/retroAudio';
import { CACHE_KEYS, readCache, writeCache } from '../../utils/offlineCache';

interface GearItem {
  id: string;
  emoji: string;
  labelTh: string;
  labelEn: string;
  hintTh: string;
  hintEn: string;
}

interface GearCheckCacheData {
  packedIds: string[];
  updatedAt: number;
}

const ESSENTIAL_GEAR_ITEMS: GearItem[] = [
  {
    id: 'shuttlecocks',
    emoji: '🏸',
    labelTh: 'ลูกขนไก่ (1–2 หลอด)',
    labelEn: 'Shuttlecocks (1–2 tubes)',
    hintTh: 'เช็กความเร็วลูกและสภาพขนก่อนออกบ้าน',
    hintEn: 'Check speed grade before heading out',
  },
  {
    id: 'water',
    emoji: '💧',
    labelTh: 'น้ำดื่ม & เกลือแร่',
    labelEn: 'Water & Electrolytes',
    hintTh: 'จิบชดเชยเหงื่อระหว่างเซ็ต 2 และ 3',
    hintEn: 'Stay hydrated between sets 2 & 3',
  },
  {
    id: 'extra_shirt',
    emoji: '👕',
    labelTh: 'เสื้อเปลี่ยนสำรอง & ผ้าเช็ดหน้า',
    labelEn: 'Extra Shirts & Towel',
    hintTh: 'เตรียมอย่างน้อย 1–2 ตัวสำหรับตีหลายเกม',
    hintEn: 'Pack 1–2 dry shirts for multi-game play',
  },
  {
    id: 'racket_grip',
    emoji: '🎒',
    labelTh: 'ไม้แบด & กริปพันด้ามสำรอง',
    labelEn: 'Racket & Extra Overgrips',
    hintTh: 'ตรวจความตึงเอ็นและพกกริปกันลื่น',
    hintEn: 'Check string tension & grip tackiness',
  },
  {
    id: 'court_shoes',
    emoji: '👟',
    labelTh: 'รองเท้าคอร์ท & ถุงเท้ากีฬา',
    labelEn: 'Court Shoes & Socks',
    hintTh: 'พื้นยางไม่ลื่นช่วยเซฟข้อเท้าและเข่า',
    hintEn: 'Non-marking grip sole for safe footwork',
  },
];

export const GearCheckCard: React.FC = () => {
  const { language } = useApp();
  const isThai = language === 'th';

  const [packedIds, setPackedIds] = useState<string[]>(() => {
    const cached = readCache<GearCheckCacheData>(CACHE_KEYS.GEAR_CHECK);
    if (cached && Array.isArray(cached.packedIds)) {
      return cached.packedIds;
    }
    return ['racket_grip'];
  });

  const packedCount = ESSENTIAL_GEAR_ITEMS.filter((item) => packedIds.includes(item.id)).length;
  const totalCount = ESSENTIAL_GEAR_ITEMS.length;
  const allPacked = packedCount === totalCount;
  const progressPct = Math.round((packedCount / totalCount) * 100);

  const persistPacked = (nextIds: string[]) => {
    setPackedIds(nextIds);
    writeCache<GearCheckCacheData>(CACHE_KEYS.GEAR_CHECK, {
      packedIds: nextIds,
      updatedAt: Date.now(),
    });
  };

  const handleToggleItem = (id: string) => {
    const exists = packedIds.includes(id);
    const nextIds = exists
      ? packedIds.filter((item) => item !== id)
      : [...packedIds, id];

    if (!exists && nextIds.length === totalCount) {
      playCoinSound();
    } else {
      playSelectSound();
    }
    persistPacked(nextIds);
  };

  const handleResetAll = () => {
    playSelectSound();
    persistPacked([]);
  };

  return (
    <div className="space-y-2.5">
      {/* External Section Header (Outside Card Container, matching other sections) */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              allPacked ? 'bg-[#e8f7ee] text-[#15803d]' : 'bg-[#ffffff] text-[#111111] shadow-xs'
            }`}
          >
            <Backpack className="w-4 h-4 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[13px] font-semibold text-[#111111] leading-tight truncate">
              {isThai ? 'เช็กอุปกรณ์ก่อนไปคอร์ท' : 'Gear Check'}
            </h3>
            <p className="text-[11px] font-normal text-[#71717a] truncate tabular-nums mt-0.5">
              {allPacked
                ? isThai
                  ? 'จัดกระเป๋าครบทุกชิ้น พร้อมลุยคอร์ท!'
                  : 'All essentials packed. Ready for court!'
                : isThai
                ? `เตรียมแล้ว ${packedCount}/${totalCount} รายการก่อนออกเดินทาง`
                : `${packedCount} of ${totalCount} essentials packed`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {packedCount > 0 && (
            <button
              type="button"
              onClick={handleResetAll}
              title={isThai ? 'ล้างรายการที่เช็ก' : 'Reset checklist'}
              aria-label={isThai ? 'ล้างรายการที่เช็ก' : 'Reset checklist'}
              className="no-doodle w-7 h-7 rounded-full bg-[#ffffff] hover:bg-[#f3f4f6] text-[#71717a] shadow-xs flex items-center justify-center cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap tabular-nums ${
              allPacked
                ? 'bg-[#e8f7ee] text-[#15803d]'
                : 'bg-[#e5e7eb]/70 text-[#52525b]'
            }`}
          >
            {allPacked
              ? isThai
                ? 'ครบแล้ว ✓'
                : 'Ready ✓'
              : `${packedCount}/${totalCount}`}
          </span>
        </div>
      </div>

      {/* Slim Readiness Progress Bar */}
      <div className="px-1">
        <div className="w-full h-1.5 rounded-full bg-[#e5e7eb] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#15803d] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Grouped Hairline Toggle List Card (Profile Menu List Style) */}
      <div className="rounded-[24px] bg-[#ffffff] shadow-[0_2px_12px_rgba(0,0,0,0.03)] divide-y divide-[#000000]/[0.06] overflow-hidden">
        {ESSENTIAL_GEAR_ITEMS.map((item) => {
          const isChecked = packedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              role="switch"
              aria-checked={isChecked}
              onClick={() => handleToggleItem(item.id)}
              className="no-doodle w-full px-4 py-3 min-h-[56px] flex items-center justify-between gap-3 text-left hover:bg-[#f9fafb] active:bg-[#f3f4f6] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-sm shrink-0">
                  {item.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[13px] font-medium leading-snug truncate transition-colors ${
                      isChecked ? 'text-[#71717a]' : 'text-[#111111]'
                    }`}
                  >
                    {isThai ? item.labelTh : item.labelEn}
                  </div>
                  <div className="text-[11px] font-normal text-[#71717a] truncate">
                    {isThai ? item.hintTh : item.hintEn}
                  </div>
                </div>
              </div>

              {/* Clean Toggle Switch Pill */}
              <span
                aria-hidden="true"
                className={`w-10 h-6 rounded-full p-0.5 flex items-center transition-colors shrink-0 ${
                  isChecked ? 'bg-[#15803d] justify-end' : 'bg-[#d4d4d8] justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#ffffff] shadow-xs flex items-center justify-center">
                  {isChecked && <Check className="w-3 h-3 text-[#15803d] stroke-[2.5]" />}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
