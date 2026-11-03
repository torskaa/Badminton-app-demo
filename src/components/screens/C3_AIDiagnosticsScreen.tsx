/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Zap, ChevronRight, Activity, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const C3_AIDiagnosticsScreen: React.FC = () => {
  const { navigateTo } = useApp();
  const [selectedZone, setSelectedZone] = useState<string>('front-left');

  const ZONE_INFO: Record<string, { name: string; errors: number; advice: string }> = {
    'front-left': {
      name: 'หน้าเน็ตฝั่งซ้าย (Forehand Net)',
      errors: 6,
      advice: 'เสียแต้มจากการแตะลูกหยอดติดเน็ต (Net Tape) 4 ครั้ง แนะนำยกหัวไม้ระดับสายตาและย่อเข่าเข้าหาลูก',
    },
    'front-right': {
      name: 'หน้าเน็ตฝั่งขวา (Backhand Net)',
      errors: 2,
      advice: 'การหยอดและดักลูกตัดทำได้ยอดเยี่ยม มีอัตราสำเร็จ 80%',
    },
    'mid-left': {
      name: 'กลางคอร์ทฝั่งซ้าย (Mid Left)',
      errors: 3,
      advice: 'ระวังการรับลูกดรายฟ์สวนเร็ว หลังตบลงพื้นแล้วรีเซ็ตท่าพร้อมช้าไป 0.4 วินาที',
    },
    'mid-right': {
      name: 'กลางคอร์ทฝั่งขวา (Mid Right)',
      errors: 1,
      advice: 'คุมพื้นที่โซนนี้เหนียวแน่น ดักช็อตบุกได้เกือบทั้งหมด',
    },
    'back-left': {
      name: 'หลังคอร์ทมุมซ้าย (Backhand Deep)',
      errors: 7,
      advice: 'จุดอ่อนวิกฤต! ลูกเคลียร์ลึกหลังคอร์ทเปิดหน้าไม้ช้าทำให้ลูกออกข้าง (Out Wide) 5 ลูก',
    },
    'back-right': {
      name: 'หลังคอร์ทมุมขวา (Smash Corner)',
      errors: 2,
      advice: 'จุดทำแต้มหลัก! จัมป์ตบทำวินเนอร์จากโซนนี้ได้ 8 แต้ม สปีดเฉลี่ย 312 km/h',
    },
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title="AI Match Diagnostics" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* AI Executive Summary Alert */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
              AI Critical Weakness Alert
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            "คุณเสียแต้มจากลูกดรอปหน้าเน็ต <span className="text-amber-400 font-bold">4 แต้มติดในช่วงท้ายเกม</span> และมุมลูกตบช่วงเซต 2 ตกกลางคอร์ทเปิดมุมให้คู่ต่อสู้สวน Drive เร็วได้ง่าย"
          </p>
          <div className="text-[10px] text-slate-400 font-mono">
            คำนวณจากสถิติช็อตจริง 42 ช็อตในแมตช์นี้
          </div>
        </div>

        {/* Weak Zone Heatmap Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-lime-400" />
              <span>Court Weak Zone Heatmap (แตะเพื่อดูรายละเอียด)</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">ฝั่งคอร์ทของคุณ</span>
          </div>

          {/* 2D Court Visualizer */}
          <div className="w-full bg-[#0a1820] rounded-2xl border-2 border-emerald-500/50 p-3 shadow-inner relative overflow-hidden">
            {/* Badminton Net Line */}
            <div className="w-full border-b-2 border-dashed border-white/60 mb-2 flex items-center justify-between text-[9px] text-white/70 font-mono px-1">
              <span>NET LINE ═══════════</span>
              <span>เน็ต</span>
            </div>

            {/* 6 Zones Grid representing half court */}
            <div className="grid grid-cols-2 gap-2">
              {/* Front Left */}
              <button
                onClick={() => setSelectedZone('front-left')}
                className={`h-20 rounded-xl border p-2 flex flex-col justify-between text-left transition-all cursor-pointer ${
                  selectedZone === 'front-left'
                    ? 'border-red-400 bg-red-500/30 ring-2 ring-red-400'
                    : 'border-red-500/40 bg-red-500/15 hover:bg-red-500/25'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-red-300">
                  <span>หน้าซ้าย (Net)</span>
                  <span className="px-1.5 py-0.2 bg-red-500 text-white rounded font-mono text-[9px]">
                    6 เสีย
                  </span>
                </div>
                <div className="text-[9px] text-slate-300">หยอดติดเน็ตบ่อย</div>
              </button>

              {/* Front Right */}
              <button
                onClick={() => setSelectedZone('front-right')}
                className={`h-20 rounded-xl border p-2 flex flex-col justify-between text-left transition-all cursor-pointer ${
                  selectedZone === 'front-right'
                    ? 'border-lime-400 bg-lime-500/30 ring-2 ring-lime-400'
                    : 'border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-lime-300">
                  <span>หน้าขวา (Net)</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 rounded font-mono text-[9px]">
                    2 เสีย
                  </span>
                </div>
                <div className="text-[9px] text-slate-300">คุมจังหวะดีเยี่ยม</div>
              </button>

              {/* Mid Left */}
              <button
                onClick={() => setSelectedZone('mid-left')}
                className={`h-20 rounded-xl border p-2 flex flex-col justify-between text-left transition-all cursor-pointer ${
                  selectedZone === 'mid-left'
                    ? 'border-amber-400 bg-amber-500/30 ring-2 ring-amber-400'
                    : 'border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-amber-300">
                  <span>กลางซ้าย (Drive)</span>
                  <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded font-mono text-[9px]">
                    3 เสีย
                  </span>
                </div>
                <div className="text-[9px] text-slate-300">ดรายฟ์สวนไว</div>
              </button>

              {/* Mid Right */}
              <button
                onClick={() => setSelectedZone('mid-right')}
                className={`h-20 rounded-xl border p-2 flex flex-col justify-between text-left transition-all cursor-pointer ${
                  selectedZone === 'mid-right'
                    ? 'border-lime-400 bg-lime-500/30 ring-2 ring-lime-400'
                    : 'border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-lime-300">
                  <span>กลางขวา (Drive)</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 rounded font-mono text-[9px]">
                    1 เสีย
                  </span>
                </div>
                <div className="text-[9px] text-slate-300">ปลอดภัย</div>
              </button>

              {/* Back Left */}
              <button
                onClick={() => setSelectedZone('back-left')}
                className={`h-20 rounded-xl border p-2 flex flex-col justify-between text-left transition-all cursor-pointer ${
                  selectedZone === 'back-left'
                    ? 'border-red-400 bg-red-500/30 ring-2 ring-red-400'
                    : 'border-red-500/50 bg-red-500/20 hover:bg-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-red-300">
                  <span>หลังซ้าย (Backhand)</span>
                  <span className="px-1.5 py-0.2 bg-red-500 text-white rounded font-mono text-[9px]">
                    7 เสีย ⚠️
                  </span>
                </div>
                <div className="text-[9px] text-slate-300">จุดอ่อนสูงสุด</div>
              </button>

              {/* Back Right */}
              <button
                onClick={() => setSelectedZone('back-right')}
                className={`h-20 rounded-xl border p-2 flex flex-col justify-between text-left transition-all cursor-pointer ${
                  selectedZone === 'back-right'
                    ? 'border-lime-400 bg-lime-500/30 ring-2 ring-lime-400'
                    : 'border-lime-500/40 bg-lime-500/15 hover:bg-lime-500/25'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-lime-300">
                  <span>หลังขวา (Smash)</span>
                  <span className="px-1.5 py-0.2 bg-lime-400 text-slate-950 rounded font-mono text-[9px]">
                    2 เสีย · 8 ชนะ
                  </span>
                </div>
                <div className="text-[9px] text-slate-300">จุดทำแต้มหลัก 🔥</div>
              </button>
            </div>

            {/* Baseline */}
            <div className="w-full border-t-2 border-white/60 mt-2 text-center text-[9px] text-white/70 font-mono">
              BASELINE ═══════════════════
            </div>
          </div>

          {/* Selected Zone Detail Card */}
          {selectedZone && ZONE_INFO[selectedZone] && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{ZONE_INFO[selectedZone].name}</span>
                <span className="text-red-400 font-mono font-bold">
                  เสีย {ZONE_INFO[selectedZone].errors} แต้ม
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {ZONE_INFO[selectedZone].advice}
              </p>
            </div>
          )}
        </div>

        {/* Shot Accuracy & Distribution */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white block">
            Shot Accuracy & Distribution (อัตราความสำเร็จ)
          </label>
          <div className="space-y-2">
            {[
              { type: '⚡ Jump Smash', winRate: 68, count: 19, barColor: 'from-lime-400 to-lime-300' },
              { type: '🏸 Net Drop / Tumble', winRate: 42, count: 12, barColor: 'from-amber-400 to-amber-300' },
              { type: '🚀 Flat Drive & Push', winRate: 75, count: 16, barColor: 'from-cyan-400 to-cyan-300' },
              { type: '🎯 Deep Clear & Lift', winRate: 58, count: 14, barColor: 'from-purple-400 to-purple-300' },
            ].map((shot, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-white">{shot.type}</span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-400">{shot.count} ครั้ง</span>
                    <span className="text-lime-400 font-bold">{shot.winRate}% ชนะ</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${shot.barColor} rounded-full`}
                    style={{ width: `${shot.winRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer: Connect to Drills or Social Card */}
      <div className="px-4 space-y-2 pt-2 shrink-0">
        <button
          onClick={() => navigateTo('D2')}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 font-black text-sm shadow-[0_4px_16px_rgba(204,255,0,0.35)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>ซ้อมแก้ไขจุดอ่อนนี้กับ AI Coach Drill (+250 EXP)</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>

        <button
          onClick={() => navigateTo('C4')}
          className="w-full min-h-[44px] py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <span>ไปที่การ์ดสรุปผล Match Recap Card</span>
        </button>
      </div>
    </div>
  );
};
