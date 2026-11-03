/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Zap, ChevronRight, Activity, ArrowRight, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const C3_AIDiagnosticsScreen: React.FC = () => {
  const { navigateTo, gainExp } = useApp();
  const [selectedZone, setSelectedZone] = useState<string>('front-left');
  const [drillAdded, setDrillAdded] = useState(false);

  const ZONE_INFO: Record<string, { name: string; errors: number; advice: string; tag: string }> = {
    'front-left': {
      name: 'หน้าเน็ตฝั่งซ้าย (Forehand Net)',
      errors: 6,
      advice: 'เสียแต้มจากการแตะลูกหยอดติดเน็ต (Net Tape) 4 ครั้ง แนะนำยกหัวไม้ระดับสายตาและย่อเข่าเข้าหาลูก',
      tag: 'Need Practice',
    },
    'front-right': {
      name: 'หน้าเน็ตฝั่งขวา (Backhand Net)',
      errors: 2,
      advice: 'การหยอดและดักลูกตัดทำได้ยอดเยี่ยม มีอัตราสำเร็จ 80%',
      tag: 'Strong Zone',
    },
    'mid-left': {
      name: 'กลางคอร์ทฝั่งซ้าย (Mid Left)',
      errors: 3,
      advice: 'ระวังการรับลูกดรายฟ์สวนเร็ว หลังตบลงพื้นแล้วรีเซ็ตท่าพร้อมช้าไป 0.4 วินาที',
      tag: 'Caution',
    },
    'mid-right': {
      name: 'กลางคอร์ทฝั่งขวา (Mid Right)',
      errors: 1,
      advice: 'คุมพื้นที่โซนนี้เหนียวแน่น ดักช็อตบุกได้เกือบทั้งหมด',
      tag: 'Excellent',
    },
    'back-left': {
      name: 'หลังคอร์ทมุมซ้าย (Backhand Deep)',
      errors: 7,
      advice: 'จุดอ่อนวิกฤต! ลูกเคลียร์ลึกหลังคอร์ทเปิดหน้าไม้ช้าทำให้ลูกออกข้าง (Out Wide) 5 ลูก',
      tag: 'Critical Weakness',
    },
    'back-right': {
      name: 'หลังคอร์ทมุมขวา (Smash Corner)',
      errors: 2,
      advice: 'จุดทำแต้มหลัก! จัมป์ตบทำวินเนอร์จากโซนนี้ได้ 8 แต้ม สปีดเฉลี่ย 312 km/h',
      tag: 'Winner Hotspot',
    },
  };

  const currentZone = ZONE_INFO[selectedZone];

  const handleAddDrill = () => {
    setDrillAdded(true);
    gainExp(80, 'เพิ่มแบบฝึกซ้อมแก้จุดอ่อนหน้าเน็ตเข้าตารางซ้อม');
    setTimeout(() => {
      navigateTo('D2');
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title="AI Match Diagnostics & Heatmap" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* AI Critical Weakness Alert */}
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-black text-amber-800 uppercase tracking-wide">
              AI Critical Weakness Alert
            </span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            AI ตรวจพบจุดบอดสำคัญ: เสียแต้มหน้าเน็ตฝั่งซ้ายไปถึง 6 แต้ม โดยเฉพาะลูกหยอดติดเน็ต (Net Tape) บ่อยที่สุดในเซตที่ 2
          </p>
        </div>

        {/* Interactive Badminton Court Heatmap */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-neutral-800 uppercase tracking-wider text-[11px]">
              Court Error Heatmap (แตะเพื่อดูจุดเสียแต้ม)
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              สีแดง = เสียแต้มบ่อย
            </span>
          </div>

          {/* 6-Zone Interactive Court Layout */}
          <div className="w-full h-48 rounded-2xl bg-[#0d5c3a] p-2 relative grid grid-cols-2 grid-rows-3 gap-1 shadow-inner border-2 border-emerald-800">
            {/* Net Line in Middle */}
            <div className="absolute inset-x-0 top-0 h-1 bg-white/70" />

            {/* Front Left */}
            <button
              type="button"
              onClick={() => setSelectedZone('front-left')}
              className={`rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer transition-all ${
                selectedZone === 'front-left'
                  ? 'bg-rose-500/80 text-white ring-2 ring-white shadow-md'
                  : 'bg-rose-500/40 text-white/90 hover:bg-rose-500/60'
              }`}
            >
              <span className="text-[10px] font-bold">Forehand Net</span>
              <span className="text-xs font-black">6 Errors</span>
            </button>

            {/* Front Right */}
            <button
              type="button"
              onClick={() => setSelectedZone('front-right')}
              className={`rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer transition-all ${
                selectedZone === 'front-right'
                  ? 'bg-emerald-500/80 text-white ring-2 ring-white shadow-md'
                  : 'bg-emerald-500/30 text-white/80 hover:bg-emerald-500/50'
              }`}
            >
              <span className="text-[10px] font-bold">Backhand Net</span>
              <span className="text-xs font-black">2 Errors</span>
            </button>

            {/* Mid Left */}
            <button
              type="button"
              onClick={() => setSelectedZone('mid-left')}
              className={`rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer transition-all ${
                selectedZone === 'mid-left'
                  ? 'bg-amber-500/80 text-white ring-2 ring-white shadow-md'
                  : 'bg-amber-500/30 text-white/80 hover:bg-amber-500/50'
              }`}
            >
              <span className="text-[10px] font-bold">Mid Left</span>
              <span className="text-xs font-black">3 Errors</span>
            </button>

            {/* Mid Right */}
            <button
              type="button"
              onClick={() => setSelectedZone('mid-right')}
              className={`rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer transition-all ${
                selectedZone === 'mid-right'
                  ? 'bg-emerald-500/80 text-white ring-2 ring-white shadow-md'
                  : 'bg-emerald-500/30 text-white/80 hover:bg-emerald-500/50'
              }`}
            >
              <span className="text-[10px] font-bold">Mid Right</span>
              <span className="text-xs font-black">1 Error</span>
            </button>

            {/* Back Left */}
            <button
              type="button"
              onClick={() => setSelectedZone('back-left')}
              className={`rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer transition-all ${
                selectedZone === 'back-left'
                  ? 'bg-rose-500/80 text-white ring-2 ring-white shadow-md'
                  : 'bg-rose-500/50 text-white/90 hover:bg-rose-500/70'
              }`}
            >
              <span className="text-[10px] font-bold">Backhand Deep</span>
              <span className="text-xs font-black">7 Errors</span>
            </button>

            {/* Back Right */}
            <button
              type="button"
              onClick={() => setSelectedZone('back-right')}
              className={`rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer transition-all ${
                selectedZone === 'back-right'
                  ? 'bg-[#d8ff00] text-black ring-2 ring-white shadow-md font-black'
                  : 'bg-[#d8ff00]/40 text-white hover:bg-[#d8ff00]/60'
              }`}
            >
              <span className="text-[10px] font-bold">Smash Corner</span>
              <span className="text-xs font-black">8 Winners!</span>
            </button>
          </div>
        </div>

        {/* Selected Zone Deep Diagnostic Card */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-neutral-900">
              {currentZone.name}
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-bold">
              {currentZone.tag}
            </span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed font-medium">
            {currentZone.advice}
          </p>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="px-5 pt-3 border-t border-neutral-200 bg-white shrink-0">
        <button
          type="button"
          onClick={handleAddDrill}
          className="w-full h-14 bg-[#111318] hover:bg-[#1f2430] active:scale-[0.98] rounded-full p-2 flex items-center justify-between shadow-lg transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#d8ff00] text-black flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-white font-extrabold text-xs tracking-wider uppercase">
            {drillAdded ? 'เพิ่มแบบฝึกซ้อมสำเร็จ!' : 'เพิ่มเควสต์ฝึกซ้อมแก้จุดอ่อน (+80 EXP)'}
          </span>
          <div className="w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>
      </div>
    </div>
  );
};
