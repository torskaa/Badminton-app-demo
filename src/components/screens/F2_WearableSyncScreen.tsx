/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Watch, Heart, Flame, Footprints, Zap, CheckCircle2, RefreshCw, ArrowLeft, Activity } from 'lucide-react';
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
    <div className="flex-1 flex flex-col justify-between bg-[#06070a] pb-6">
      <MobileHeader title="Wearable Live Companion" subtitle="Apple Watch & Garmin Health Telemetry" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Connection Status Box */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#121926] via-[#0c121d] to-[#070b12] border border-white/[0.08] shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/15 text-cyan-400 border border-cyan-400/30 flex items-center justify-center">
              <Watch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white">Apple Watch Ultra 2</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                BLE Connected · High Freq Sensor
              </div>
            </div>
          </div>

          <button
            onClick={handleSyncFresh}
            disabled={isSyncing}
            className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] flex items-center justify-center cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Live ECG Pulse Line (SVG wave) */}
        <div className="p-4 rounded-3xl bg-[#0b0e16] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>Real-time Cardiac Rhythm (164 BPM)</span>
            </span>
            <span className="text-[10px] text-rose-400 font-mono">Aerobic Anaerobic Edge</span>
          </div>

          {/* SVG Animated Pulse Wave */}
          <div className="w-full h-14 bg-black/40 rounded-2xl border border-white/[0.05] relative overflow-hidden flex items-center">
            <svg className="w-full h-12 stroke-rose-500 fill-none" viewBox="0 0 400 40">
              <path
                d="M 0 20 L 60 20 L 70 5 L 80 35 L 90 12 L 100 20 L 160 20 L 170 4 L 180 36 L 190 10 L 200 20 L 260 20 L 270 5 L 280 35 L 290 12 L 300 20 L 360 20 L 370 4 L 380 36 L 400 20"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute right-3 top-2 text-[9px] font-mono text-slate-400">
              HRV: 62ms
            </div>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1 fill-rose-500/30" />
            <div className="text-xl font-black text-white font-mono">
              {wearableMetrics.heartRateBpm}
            </div>
            <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">BPM (Peak 182)</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1 fill-amber-500/30" />
            <div className="text-xl font-black text-white font-mono">
              {wearableMetrics.caloriesBurned}
            </div>
            <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">KCAL (Active)</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <Footprints className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-xl font-black text-white font-mono">
              {wearableMetrics.distanceKm}
            </div>
            <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">KM (4,210 Steps)</div>
          </div>
        </div>

        {/* Gamified Calories-to-EXP Conversion Box */}
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#131d27] via-[#0d151e] to-[#080d14] border border-[#d4ff00]/40 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#d4ff00] fill-[#d4ff00]" />
              <span className="text-xs font-black text-white">
                Biometric Motivation: Calories to EXP
              </span>
            </div>
            <span className="text-[10px] text-[#d4ff00] font-mono font-bold">
              Rate: 5 kcal = 1 EXP
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            เบิร์นไปแล้ว <span className="text-amber-400 font-bold">680 แคลอรี่</span> จากการลงคอร์ท 110 นาที แปลงเป็นโบนัส EXP สำหรับอัปเลเวลนักกีฬา
          </p>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-mono">CLAIMABLE BONUS</div>
              <div className="text-2xl font-black text-[#d4ff00] font-mono">
                +136 <span className="text-xs text-white">EXP</span>
              </div>
            </div>

            <button
              onClick={convertCaloriesToExp}
              disabled={wearableMetrics.expConverted}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                wearableMetrics.expConverted
                  ? 'bg-white/[0.05] text-slate-500 border border-white/[0.08] cursor-not-allowed'
                  : 'bg-[#d4ff00] hover:bg-[#bbf000] text-black shadow-[0_0_20px_rgba(212,255,0,0.35)] hover:brightness-110 active:scale-[0.97]'
              }`}
            >
              {wearableMetrics.expConverted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>แปลงสำเร็จแล้ว</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-black" />
                  <span>กดแปลงรับ EXP</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* HR Zones Breakdown */}
        <div className="p-4 rounded-3xl bg-[#0b0e16] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span>Heart Rate Intensity Breakdown</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Max HR 182 BPM</span>
          </div>

          <div className="space-y-1.5 pt-1 text-[10px]">
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Zone 5: Anaerobic Max (170-182 BPM)</span>
                <span className="text-rose-400 font-mono font-bold">18 min (16%)</span>
              </div>
              <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '16%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Zone 4: Threshold Drive (152-169 BPM)</span>
                <span className="text-amber-400 font-mono font-bold">54 min (49%)</span>
              </div>
              <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '49%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Zone 3: Aerobic Base (133-151 BPM)</span>
                <span className="text-[#d4ff00] font-mono font-bold">28 min (25%)</span>
              </div>
              <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                <div className="h-full bg-[#d4ff00] rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="px-4 pt-2 shrink-0">
        <button
          onClick={() => navigateTo('F1')}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-extrabold text-xs border border-white/[0.08] flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปยังโปรไฟล์ & ตู้เหรียญรางวัล (Trophy Room)</span>
        </button>
      </div>
    </div>
  );
};
