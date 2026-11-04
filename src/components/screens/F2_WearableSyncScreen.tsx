import React, { useState } from 'react';
import { Watch, Heart, Flame, Footprints, Zap, CheckCircle2, RefreshCw, ArrowLeft, Activity, ArrowRight, Swords } from 'lucide-react';
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
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none">
      <MobileHeader title="WEARABLE LIVE COMPANION" subtitle="Apple Watch & Garmin Health Telemetry" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Connection Status Box - Slush Sticker Card */}
        <div className="p-4 rounded-[28px] bg-white border-[1.5px] border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#4da2ff] border border-black text-black flex items-center justify-center font-bold">
              <Watch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-['Antonio',sans-serif] font-black uppercase text-black tracking-wide">
                  APPLE WATCH ULTRA 2
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#55db9c] border border-black animate-pulse" />
              </div>
              <div className="text-[10px] text-black/70 font-mono font-bold">
                BLE CONNECTED · 100HZ SENSOR
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSyncFresh}
            disabled={isSyncing}
            className="w-10 h-10 rounded-full bg-[#ffd731] border border-black hover:bg-[#ffe366] text-black flex items-center justify-center cursor-pointer transition-transform active:scale-90"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Live Cardiac Rhythm Rhythm */}
        <div className="p-4 rounded-[28px] bg-white border-[1.5px] border-black space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-['Antonio',sans-serif] font-black uppercase text-black flex items-center gap-1.5 tracking-wide">
              <Heart className="w-4 h-4 text-[#fb4903] fill-[#fb4903] animate-pulse" />
              <span>CARDIAC RHYTHM (164 BPM)</span>
            </span>
            <span className="text-[10px] text-black font-['Antonio',sans-serif] font-black uppercase bg-[#ffd731] px-2.5 py-0.5 rounded-full border border-black">
              ANAEROBIC ZONE
            </span>
          </div>

          {/* SVG Heart Rate Wave */}
          <div className="w-full h-20 rounded-2xl bg-black p-2 relative flex items-center overflow-hidden border border-black">
            <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
              <path
                d="M 0 30 Q 20 30 30 30 L 40 10 L 48 50 L 56 15 L 64 35 L 72 30 L 120 30 L 130 8 L 138 52 L 146 12 L 154 35 L 162 30 L 220 30 L 230 10 L 238 50 L 246 15 L 254 35 L 262 30 L 300 30"
                fill="none"
                stroke="#55db9c"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3.5 rounded-[24px] bg-[#ffd731] border-[1.5px] border-black text-center">
            <Heart className="w-4 h-4 text-black mx-auto mb-1" />
            <div className="text-xl font-['Antonio',sans-serif] font-black text-black">
              {wearableMetrics.heartRateBpm}
            </div>
            <div className="text-[9px] text-black/70 font-mono font-black uppercase">AVG BPM</div>
          </div>

          <div className="p-3.5 rounded-[24px] bg-[#e9ccff] border-[1.5px] border-black text-center">
            <Flame className="w-4 h-4 text-black mx-auto mb-1" />
            <div className="text-xl font-['Antonio',sans-serif] font-black text-black">
              {wearableMetrics.caloriesBurned}
            </div>
            <div className="text-[9px] text-black/70 font-mono font-black uppercase">KCAL BURN</div>
          </div>

          <div className="p-3.5 rounded-[24px] bg-[#55db9c] border-[1.5px] border-black text-center">
            <Footprints className="w-4 h-4 text-black mx-auto mb-1" />
            <div className="text-xl font-['Antonio',sans-serif] font-black text-black">
              {wearableMetrics.distanceKm}
            </div>
            <div className="text-[9px] text-black/70 font-mono font-black uppercase">KM DIST</div>
          </div>
        </div>

        {/* Convert Calories to EXP Card */}
        <div className="p-5 rounded-[28px] bg-white border-[1.5px] border-black space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#ffd731] border border-black flex items-center justify-center text-black">
              <Zap className="w-4 h-4 fill-black" />
            </div>
            <h4 className="text-xs font-['Antonio',sans-serif] font-black text-black uppercase tracking-wider">
              CALORIES TO EXP ENGINE (แปลงเหงื่อเป็น EXP)
            </h4>
          </div>

          <p className="text-xs text-black/80 font-bold leading-relaxed">
            ทุก 2 แคลอรีที่เผาผลาญในคอร์ทแปลงเป็น 1 EXP นักกีฬา เพิ่มกำลังใจให้ออกแรงเต็มที่ทุกเซต
          </p>

          <button
            type="button"
            disabled={wearableMetrics.expConverted}
            onClick={convertCaloriesToExp}
            className={`w-full py-3.5 px-4 rounded-full text-xs font-['Antonio',sans-serif] font-black uppercase tracking-wider transition-all border-[1.5px] border-black flex items-center justify-center gap-2 ${
              wearableMetrics.expConverted
                ? 'bg-black/10 text-black/40 cursor-not-allowed border-black/30'
                : 'bg-[#55db9c] text-black hover:bg-[#6ef5b4] active:scale-95 cursor-pointer'
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

        {/* Dual CTA Links */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => navigateTo('C1')}
            className="p-3 rounded-full bg-[#5c4ade] text-white border-[1.5px] border-black font-['Antonio',sans-serif] font-black text-xs uppercase flex items-center justify-center gap-1 hover:bg-[#6b58eb] active:scale-95 cursor-pointer"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>ไปบันทึกแต้มสด</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('F1')}
            className="p-3 rounded-full bg-white text-black border-[1.5px] border-black font-['Antonio',sans-serif] font-black text-xs uppercase flex items-center justify-center gap-1 hover:bg-[#ffd731] active:scale-95 cursor-pointer"
          >
            <span>ดูตู้เหรียญรางวัล</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

