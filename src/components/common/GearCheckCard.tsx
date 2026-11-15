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
    hintTh: 'เช็กความเร็วลูกและสภาพขนก่อนออกจากบ้าน',
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
    <div className="rounded-[28px] bg-[#ffffff] p-4 shadow-sm space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-[16px] flex items-center justify-center shrink-0 transition-colors ${
              allPacked ? 'bg-[#7cd7a0] text-[#000000]' : 'bg-[#7cd7a0]/25 text-[#15803d]'
            }`}
          >
            <Backpack className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-[#000000] leading-tight truncate">
              {isThai ? 'เช็กอุปกรณ์ก่อนไปคอร์ท' : 'Gear Check'}
            </h3>
            <p className="text-[11px] font-bold text-[#000000]/60 truncate tabular-nums">
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
              className="no-doodle w-7 h-7 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#000000]/65 flex items-center justify-center cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <span
            className={`px-2.5 py-1 rounded-[1600px] text-[10px] font-bold whitespace-nowrap tabular-nums ${
              allPacked
                ? 'bg-[#7cd7a0] text-[#000000]'
                : 'bg-[#f3f4f6] text-[#000000]/75'
            }`}
          >
            {allPacked
              ? isThai
                ? 'ครบแล้ว ✓'
                : 'READY ✓'
              : `${packedCount}/${totalCount}`}
          </span>
        </div>
      </div>

      {/* Readiness Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-[#e5e7eb] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#7cd7a0] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Interactive Toggle List */}
      <div className="space-y-2">
        {ESSENTIAL_GEAR_ITEMS.map((item) => {
          const isChecked = packedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              role="switch"
              aria-checked={isChecked}
              onClick={() => handleToggleItem(item.id)}
              className={`no-doodle w-full rounded-[18px] px-3 py-2.5 flex items-center justify-between gap-2.5 text-left transition-all cursor-pointer ${
                isChecked
                  ? 'bg-[#e8f7ee] ring-1 ring-[#7cd7a0]'
                  : 'bg-[#f4f8fb] hover:bg-[#eef3f7]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-8 h-8 rounded-[12px] bg-[#ffffff] flex items-center justify-center text-base shrink-0 shadow-xs">
                  {item.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-xs font-bold leading-snug truncate ${
                      isChecked ? 'text-[#000000]/65 line-through' : 'text-[#000000]'
                    }`}
                  >
                    {isThai ? item.labelTh : item.labelEn}
                  </div>
                  <div className="text-[10px] font-medium text-[#000000]/50 truncate">
                    {isThai ? item.hintTh : item.hintEn}
                  </div>
                </div>
              </div>

              {/* Tactile Toggle Switch Pill */}
              <span
                aria-hidden="true"
                className={`w-10 h-6 rounded-full p-0.5 flex items-center transition-colors shrink-0 ${
                  isChecked ? 'bg-[#7cd7a0] justify-end' : 'bg-[#d1d5db] justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#ffffff] shadow-xs flex items-center justify-center">
                  {isChecked && <Check className="w-3 h-3 text-[#15803d] stroke-[3]" />}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
