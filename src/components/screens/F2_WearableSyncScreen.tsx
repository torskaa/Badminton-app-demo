import React, { useState } from 'react';
import { Watch, Heart, Flame, Footprints, Zap, RefreshCw, ArrowRight, Swords, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const F2_WearableSyncScreen: React.FC = () => {
  const { wearableMetrics, convertCaloriesToExp, navigateTo } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [justConverted, setJustConverted] = useState(false);

  const handleSyncFresh = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  const handleConvert = () => {
    if (wearableMetrics.expConverted) return;
    convertCaloriesToExp();
    setJustConverted(true);
    setTimeout(() => setJustConverted(false), 3000);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      <MobileHeader title="WEARABLE COMPANION" subtitle="Apple Watch & Health Telemetry" showBack />

      <div className="p-4 space-y-3.5 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16">
        {/* Connection Status Box (Paper White, 1px solid black border, 28px radius) */}
        <div className="p-4 rounded-[28px] bg-[#ffffff] border border-[#000000] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[1600px] bg-[#4da2ff] border border-[#000000] flex items-center justify-center font-bold text-[#000000]">
              <Watch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Antonio',sans-serif] text-base font-black uppercase tracking-wide text-[#000000]">
                  APPLE WATCH ULTRA 2
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#55db9c] border border-[#000000] animate-pulse" />
              </div>
              <div className="text-[10px] font-bold tracking-[0.032em] text-[#000000]/70 uppercase">
                BLE CONNECTED · 100HZ REALTIME
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSyncFresh}
            disabled={isSyncing}
            className="w-10 h-10 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center hover:bg-[#e9e9e9] transition-transform active:scale-90 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-[#000000] ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Live Cardiac Rhythm Box */}
        <div className="p-4 rounded-[28px] bg-[#ffffff] border border-[#000000] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-['Antonio',sans-serif] text-sm font-black uppercase flex items-center gap-1.5 tracking-wide text-[#000000]">
              <Heart className="w-4 h-4 text-[#ff5c34] fill-[#ff5c34] animate-pulse" />
              <span>CARDIAC RHYTHM (164 BPM)</span>
            </span>
            <span className="text-[10px] font-bold uppercase px-3 py-0.5 rounded-[1600px] bg-[#ffd731] text-[#000000] border border-[#000000] tracking-[0.032em]">
              ANAEROBIC ZONE
            </span>
          </div>

          {/* SVG Heart Rate Wave */}
          <div className="w-full h-20 rounded-[20px] bg-[#000000] p-2 relative flex items-center overflow-hidden border border-[#000000]">
            <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
              <path
                d="M 0 30 Q 20 30 30 30 L 40 10 L 48 50 L 56 15 L 64 35 L 72 30 L 120 30 L 130 8 L 138 52 L 146 12 L 154 35 L 162 30 L 220 30 L 230 10 L 238 50 L 246 15 L 254 35 L 262 30 L 300 30"
                fill="none"
                stroke="#55db9c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute right-3 top-2 text-[10px] font-bold text-[#55db9c] tracking-[0.032em]">
              PEAK 182 BPM
            </div>
          </div>
        </div>

        {/* 3 Metric Cards (Six-color sticker palette applied as a shared set) */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3.5 rounded-[24px] border border-[#000000] bg-[#ff5c34] text-[#ffffff] text-center">
            <Heart className="w-4 h-4 mx-auto mb-1 fill-[#ffffff]" />
            <div className="font-['Antonio',sans-serif] text-2xl font-black leading-none">
              {wearableMetrics.heartRateBpm}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.032em] mt-1 text-[#ffffff]/80">AVG BPM</div>
          </div>

          <div className="p-3.5 rounded-[24px] border border-[#000000] bg-[#ffd731] text-[#000000] text-center">
            <Flame className="w-4 h-4 mx-auto mb-1 text-[#000000] fill-[#000000]" />
            <div className="font-['Antonio',sans-serif] text-2xl font-black leading-none">
              {wearableMetrics.caloriesBurned}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.032em] mt-1 text-[#000000]/70">KCAL BURN</div>
          </div>

          <div className="p-3.5 rounded-[24px] border border-[#000000] bg-[#55db9c] text-[#000000] text-center">
            <Footprints className="w-4 h-4 mx-auto mb-1 text-[#000000]" />
            <div className="font-['Antonio',sans-serif] text-2xl font-black leading-none">
              {wearableMetrics.distanceKm}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.032em] mt-1 text-[#000000]/70">KM DIST</div>
          </div>
        </div>

        {/* Convert Calories to EXP Card */}
        <div className="p-4 rounded-[28px] bg-[#ffffff] border border-[#000000] space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[1600px] bg-[#ffd731] border border-[#000000] flex items-center justify-center text-[#000000]">
              <Zap className="w-4 h-4 fill-[#000000]" />
            </div>
            <h4 className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
              CALORIES TO EXP ENGINE (แปลงเหงื่อเป็น EXP)
            </h4>
          </div>

          <p className="text-xs text-[#000000]/80 font-medium leading-relaxed">
            ทุก 2 แคลอรีที่เผาผลาญในคอร์ทแปลงเป็น 1 EXP นักกีฬา เพิ่มกำลังใจให้ออกแรงเต็มที่ทุกเซต
          </p>

          {/* Primary CTA (Black fill only per rules) */}
          <button
            type="button"
            disabled={wearableMetrics.expConverted}
            onClick={handleConvert}
            className={`w-full py-3 px-4 rounded-[1600px] text-xs font-bold tracking-[0.032em] uppercase transition-all flex items-center justify-center gap-2 border border-[#000000] whitespace-nowrap ${
              wearableMetrics.expConverted
                ? 'bg-[#cccccc] text-[#000000]/40 cursor-not-allowed'
                : 'bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] active:scale-95 cursor-pointer'
            }`}
          >
            {wearableMetrics.expConverted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#55db9c] shrink-0" />
                <span className="whitespace-nowrap">CLAIMED +240 EXP</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-[#ffffff] shrink-0" />
                <span className="whitespace-nowrap">CONVERT KCAL (+{Math.round(wearableMetrics.caloriesBurned / 2)} EXP)</span>
              </>
            )}
          </button>

          {justConverted && (
            <div className="p-2.5 rounded-[1600px] bg-[#55db9c] border border-[#000000] text-[#000000] text-center text-xs font-bold whitespace-nowrap">
              🎉 +{Math.round(wearableMetrics.caloriesBurned / 2)} EXP CLAIMED TO PROFILE!
            </div>
          )}
        </div>

        {/* Dual CTA Links (Outlined and Black fill) */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => navigateTo('C1')}
            className="p-3 rounded-[1600px] bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Swords className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">LIVE SCORER (C1)</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('F1')}
            className="p-3 rounded-[1600px] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] border border-[#000000] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span className="whitespace-nowrap">TROPHY ROOM (F1)</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
