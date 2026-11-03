/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Watch, Heart, Flame, Footprints, Zap, CheckCircle2, RefreshCw, ArrowLeft, Activity, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const F2_WearableSyncScreen: React.FC = () => {
  const { wearableMetrics, convertCaloriesToExp, navigateTo } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncFresh = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title="Wearable Live Companion" subtitle="Apple Watch & Garmin Health Telemetry" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Connection Status Box */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <Watch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-neutral-900">Apple Watch Ultra 2</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">
                BLE Connected · High Freq Sensor
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSyncFresh}
            disabled={isSyncing}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#0066ff]' : ''}`} />
          </button>
        </div>

        {/* Live ECG Heart Rate Rhythm */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-neutral-900 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span>Real-time Cardiac Rhythm (164 BPM)</span>
            </span>
            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
              Anaerobic Zone
            </span>
          </div>

          {/* SVG Heart Rate Wave */}
          <div className="w-full h-20 rounded-2xl bg-neutral-900 p-2 relative flex items-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
              <path
                d="M 0 30 Q 20 30 30 30 L 40 10 L 48 50 L 56 15 L 64 35 L 72 30 L 120 30 L 130 8 L 138 52 L 146 12 L 154 35 L 162 30 L 220 30 L 230 10 L 238 50 L 246 15 L 254 35 L 262 30 L 300 30"
                fill="none"
                stroke="#ff3366"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs text-center">
            <Heart className="w-4 h-4 text-rose-500 mx-auto mb-1" />
            <div className="text-base font-black font-mono text-neutral-900">
              {wearableMetrics.heartRateBpm}
            </div>
            <div className="text-[9px] text-neutral-400 font-medium">AVG BPM</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs text-center">
            <Flame className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <div className="text-base font-black font-mono text-neutral-900">
              {wearableMetrics.caloriesBurned}
            </div>
            <div className="text-[9px] text-neutral-400 font-medium">KCAL BURN</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs text-center">
            <Footprints className="w-4 h-4 text-[#0066ff] mx-auto mb-1" />
            <div className="text-base font-black font-mono text-neutral-900">
              {wearableMetrics.distanceKm} km
            </div>
            <div className="text-[9px] text-neutral-400 font-medium">COURT DIST</div>
          </div>
        </div>

        {/* Convert Calories to EXP Card */}
        <div className="p-5 rounded-3xl bg-white border-2 border-[#d8ff00] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-neutral-900 fill-current" />
              <h4 className="text-xs font-extrabold text-neutral-900">
                แปลงเหงื่อและแคลอรีเป็น EXP (Calories to EXP Engine)
              </h4>
            </div>
          </div>

          <p className="text-xs text-neutral-600 font-medium leading-relaxed">
            ทุก 2 แคลอรีที่เผาผลาญในคอร์ทแปลงเป็น 1 EXP นักกีฬา เพิ่มกำลังใจให้ออกแรงเต็มที่
          </p>

          <button
            type="button"
            disabled={wearableMetrics.expConverted}
            onClick={convertCaloriesToExp}
            className={`w-full py-3.5 px-4 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 ${
              wearableMetrics.expConverted
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-[#d8ff00] text-black hover:bg-[#cbf000] active:scale-98'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>
              {wearableMetrics.expConverted
                ? '✓ แลกรับ +240 EXP เรียบร้อยแล้ว'
                : `แลกรับ +${Math.round(wearableMetrics.caloriesBurned / 2)} EXP ทันที`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
