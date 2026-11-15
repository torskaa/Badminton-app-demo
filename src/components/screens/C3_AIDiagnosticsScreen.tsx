import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Zap, ChevronRight, Activity, ArrowRight, ShieldAlert, Sparkles, Check, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';

export const C3_AIDiagnosticsScreen: React.FC = () => {
  const { navigateTo, gainExp, language } = useApp();
  const isThai = language === 'th';
  const [selectedZone, setSelectedZone] = useState<string>('front-left');
  const [drillAdded, setDrillAdded] = useState(false);

  const ZONE_INFO: Record<string, { name: string; errors: number; advice: string; tag: string; color: string }> = {
    'front-left': {
      name: isThai ? 'หน้าเน็ตโฟร์แฮนด์' : 'Forehand Net Zone',
      errors: 4,
      advice: isThai
        ? 'ติดเน็ต 4 ครั้ง ควรยกหัวไม้ระดับสายตาและย่อเข่าก่อนเข้าหาลูก'
        : '4 net errors recorded. Keep racket head up and bend knees on approach.',
      tag: isThai ? 'ควรฝึกเพิ่ม' : 'Need Practice',
      color: '#e85729',
    },
    'front-right': {
      name: isThai ? 'หน้าเน็ตแบ็คแฮนด์' : 'Backhand Net Zone',
      errors: 1,
      advice: isThai
        ? 'ปั่นเน็ตและตัดหยอดแม่นยำ ทำแต้มสำเร็จ 80%'
        : 'Sharp net tumbles and drops with 80% point conversion.',
      tag: isThai ? 'จุดแข็ง' : 'Strong Zone',
      color: '#7cd7a0',
    },
    'back-left': {
      name: isThai ? 'มุมหลังแบ็คแฮนด์' : 'Backhand Deep Corner',
      errors: 5,
      advice: isThai
        ? 'ตีออกเส้นหลัง 5 ครั้ง ควรเร่งปิดหน้าไม้ให้เร็วขึ้น'
        : '5 deep-out errors. Close the racket face earlier on deep clears.',
      tag: isThai ? 'จุดอ่อนหลัก' : 'Critical Weakness',
      color: '#e85729',
    },
    'back-right': {
      name: isThai ? 'จุดตบทำแต้ม' : 'Smash Power Hotspot',
      errors: 1,
      advice: isThai
        ? 'จุดทำแต้มหลัก ตบชนะ 8 ครั้ง ความเร็วเฉลี่ย 312 km/h'
        : 'Primary scoring zone with 8 smash winners averaging 312 km/h.',
      tag: isThai ? 'จุดทำแต้ม' : 'Winner Hotspot',
      color: '#7cd7a0',
    },
  };

  const currentZone = ZONE_INFO[selectedZone] || ZONE_INFO['front-left'];

  const handleAddDrill = () => {
    setDrillAdded(true);
    gainExp(80, isThai ? 'เพิ่มแบบฝึกซ้อมแก้จุดอ่อนหน้าเน็ต' : 'Added targeted net weakness drill');
    setTimeout(() => {
      navigateTo('D2');
    }, 600);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-hidden">
      <MobileHeader showBack />

      <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
        {/* 2D Badminton Court Interactive Map */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'แผนผังวิเคราะห์จุดอ่อน 4 โซน' : '2D WEAKNESS HEATMAP'}
            subtitle={isThai ? 'แตะโซนบนคอร์ทเพื่อดูจุดพลาด' : 'Tap any court zone to inspect errors'}
            badge={isThai ? 'คอร์ท 3' : 'COURT 3'}
            badgeVariant="orange"
          />

          <div className="rounded-[32px] p-4 text-center bg-[#ffffff]">
            <div className="relative w-full max-w-[280px] h-60 mx-auto bg-[#7cd7a0]/30 rounded-[24px] p-2 flex flex-col justify-between overflow-hidden">
              {/* Net Divider */}
              <div className="absolute top-1/2 inset-x-0 h-1 bg-[#000000] z-10 flex items-center justify-center">
                <span className="px-2 py-0.5 bg-[#000000] text-[#ffffff] text-[8px] font-black uppercase rounded-[1600px] whitespace-nowrap">
                  {isThai ? 'เน็ต' : 'NET'}
                </span>
              </div>

              {/* Top Half: Opponent side */}
              <div className="flex-1 -dashed -[#000000]/40 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-[0.032em]">
                  {isThai ? 'แดนคู่ต่อสู้' : 'Opponent Court'}
                </span>
              </div>

              {/* Bottom Half: Player 4 zones */}
              <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-1.5 pt-1.5 z-20">
                <button
                  type="button"
                  onClick={() => setSelectedZone('front-left')}
                  className={`rounded-[16px] p-1.5 text-[10px] font-bold uppercase tracking-[0.032em] flex flex-col items-center justify-center transition-all cursor-pointer border border-[#000000] ${
                    selectedZone === 'front-left'
                      ? 'bg-[#e85729] text-[#ffffff] scale-102 ring-2 ring-[#000000]'
                      : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                  }`}
                >
                  <span>{isThai ? 'หน้าเน็ตซ้าย' : 'Forehand Net'}</span>
                  <span className="text-[9px] font-mono mt-0.5">
                    {isThai ? 'พลาด 4 ครั้ง' : '4 Errors'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedZone('front-right')}
                  className={`rounded-[16px] p-1.5 text-[10px] font-bold uppercase tracking-[0.032em] flex flex-col items-center justify-center transition-all cursor-pointer border border-[#000000] ${
                    selectedZone === 'front-right'
                      ? 'bg-[#7cd7a0] text-[#000000] scale-102 ring-2 ring-[#000000]'
                      : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                  }`}
                >
                  <span>{isThai ? 'หน้าเน็ตขวา' : 'Backhand Net'}</span>
                  <span className="text-[9px] font-mono mt-0.5">
                    {isThai ? 'พลาด 1 ครั้ง' : '1 Error'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedZone('back-left')}
                  className={`rounded-[16px] p-1.5 text-[10px] font-bold uppercase tracking-[0.032em] flex flex-col items-center justify-center transition-all cursor-pointer border border-[#000000] ${
                    selectedZone === 'back-left'
                      ? 'bg-[#e85729] text-[#ffffff] scale-102 ring-2 ring-[#000000]'
                      : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                  }`}
                >
                  <span>{isThai ? 'มุมหลังซ้าย' : 'Deep Backhand'}</span>
                  <span className="text-[9px] font-mono mt-0.5">
                    {isThai ? 'พลาด 5 ครั้ง' : '5 Errors'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedZone('back-right')}
                  className={`rounded-[16px] p-1.5 text-[10px] font-bold uppercase tracking-[0.032em] flex flex-col items-center justify-center transition-all cursor-pointer border border-[#000000] ${
                    selectedZone === 'back-right'
                      ? 'bg-[#7cd7a0] text-[#000000] scale-102 ring-2 ring-[#000000]'
                      : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                  }`}
                >
                  <span>{isThai ? 'โซนตบทำแต้ม' : 'Smash Zone'}</span>
                  <span className="text-[9px] font-mono mt-0.5">
                    {isThai ? 'ชนะ 8 แต้ม' : '8 Winners'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Zone Detail Card */}
        <div className="space-y-2">
          <SectionHeader
            title={currentZone.name}
            subtitle={isThai ? 'สถิติและวิธีแก้ไข' : 'Breakdown & biomechanics tip'}
            badge={currentZone.tag}
            badgeVariant={currentZone.color === '#e85729' ? 'orange' : 'green'}
          />

          <div className="rounded-[28px] p-4 space-y-3 bg-[#ffffff]">
            <p className="text-xs text-[#000000]/80 leading-relaxed font-medium">
              {currentZone.advice}
            </p>

            <button
              type="button"
              onClick={handleAddDrill}
              className="w-full py-3.5 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] whitespace-nowrap"
            >
              {drillAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3] text-[#7cd7a0] shrink-0" />
                  <span>{isThai ? 'เพิ่มแบบฝึกสำเร็จ (+80 คะแนน)' : 'DRILL ADDED (+80 EXP)'}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-[#e85729] text-[#e85729] shrink-0" />
                  <span>{isThai ? 'เพิ่มลงภารกิจฝึกซ้อม' : 'ADD DRILL TO QUESTS'}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dual Actions Footer */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => navigateTo('C4')}
            className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5 text-[#e85729] shrink-0" />
            <span>{isThai ? 'แชร์การ์ดผลแข่ง' : 'SHARE RECAP'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('D1')}
            className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
          >
            <span>{isThai ? 'ดูเรดาร์โค้ช' : 'COACH RADAR'}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
