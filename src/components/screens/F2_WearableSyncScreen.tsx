import React, { useState } from 'react';
import { Watch, Heart, Flame, Footprints, Zap, RefreshCw, ArrowRight, Swords, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const F2_WearableSyncScreen: React.FC = () => {
 const { wearableMetrics, convertCaloriesToExp, navigateTo, language } = useApp();
 const isThai = language === 'th';
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

 const rewardExp = Math.round(wearableMetrics.caloriesBurned / 2);

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-hidden">
 <MobileHeader showBack />

 <div className="px-5 pt-4 space-y-3.5 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16">
 {/* Connection Status Box */}
 <div className="p-4 rounded-[28px] bg-[#ffffff] flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-[1600px] bg-[#7cd7a0] flex items-center justify-center font-bold text-[#000000]">
 <Watch className="w-6 h-6" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-['Antonio',sans-serif] text-base font-black uppercase tracking-wide text-[#000000]">
 {isThai ? 'นาฬิกาอัจฉริยะ' : 'APPLE WATCH ULTRA 2'}
 </span>
 <span className="w-2.5 h-2.5 rounded-full bg-[#7cd7a0] animate-pulse" />
 </div>
 <div className="text-[10px] font-bold tracking-[0.032em] text-[#000000]/70 uppercase">
 {isThai ? 'เชื่อมต่อบลูทูธเรียลไทม์' : 'BLE CONNECTED · REALTIME'}
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
 <div className="p-4 rounded-[28px] bg-[#ffffff] space-y-2.5">
 <div className="flex items-center justify-between text-xs gap-2">
 <span className="font-['Antonio',sans-serif] text-sm font-black uppercase flex items-center gap-1.5 tracking-wide text-[#000000] truncate">
 <Heart className="w-4 h-4 text-[#e85729] fill-[#e85729] animate-pulse shrink-0" />
 <span className="truncate">
 {isThai ? 'ชีพจรหัวใจ (164 ครั้ง/นาที)' : 'CARDIAC RHYTHM (164 BPM)'}
 </span>
 </span>
 <span className="text-[10px] font-bold uppercase px-3 py-0.5 rounded-[1600px] bg-[#e85729] text-[#ffffff] tracking-[0.032em] whitespace-nowrap shrink-0">
 {isThai ? 'โซนออกกำลังหนัก' : 'ANAEROBIC ZONE'}
 </span>
 </div>

 {/* SVG Heart Rate Wave */}
 <div className="w-full h-20 rounded-[20px] bg-[#000000] p-2 relative flex items-center overflow-hidden">
 <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
 <path
 d="M 0 30 Q 20 30 30 30 L 40 10 L 48 50 L 56 15 L 64 35 L 72 30 L 120 30 L 130 8 L 138 52 L 146 12 L 154 35 L 162 30 L 220 30 L 230 10 L 238 50 L 246 15 L 254 35 L 262 30 L 300 30"
 fill="none"
 stroke="#7cd7a0"
 strokeWidth="2.5"
 strokeLinecap="round"
 />
 </svg>
 <div className="absolute right-3 top-2 text-[10px] font-bold text-[#7cd7a0] tracking-[0.032em]">
 {isThai ? 'สูงสุด 182 ครั้ง/นาที' : 'PEAK 182 BPM'}
 </div>
 </div>
 </div>

 {/* 3 Metric Cards */}
 <div className="grid grid-cols-3 gap-2.5">
 <div className="p-3.5 rounded-[24px] bg-[#e85729] text-[#ffffff] text-center">
 <Heart className="w-4 h-4 mx-auto mb-1 fill-[#ffffff]" />
 <div className="font-['Antonio',sans-serif] text-2xl font-black leading-none">
 {wearableMetrics.heartRateBpm}
 </div>
 <div className="text-[9px] font-bold uppercase tracking-[0.032em] mt-1 text-[#ffffff]/80">
 {isThai ? 'ชีพจรเฉลี่ย' : 'AVG BPM'}
 </div>
 </div>

 <div className="p-3.5 rounded-[24px] bg-[#e8f7ee] text-[#000000] text-center">
 <Flame className="w-4 h-4 mx-auto mb-1 text-[#e85729] fill-[#e85729]" />
 <div className="font-['Antonio',sans-serif] text-2xl font-black leading-none">
 {wearableMetrics.caloriesBurned}
 </div>
 <div className="text-[9px] font-bold uppercase tracking-[0.032em] mt-1 text-[#000000]/70">
 {isThai ? 'เผาผลาญ (แคล)' : 'KCAL BURN'}
 </div>
 </div>

 <div className="p-3.5 rounded-[24px] bg-[#7cd7a0] text-[#000000] text-center">
 <Footprints className="w-4 h-4 mx-auto mb-1 text-[#000000]" />
 <div className="font-['Antonio',sans-serif] text-2xl font-black leading-none">
 {wearableMetrics.distanceKm}
 </div>
 <div className="text-[9px] font-bold uppercase tracking-[0.032em] mt-1 text-[#000000]/70">
 {isThai ? 'ระยะทาง (กม.)' : 'KM DIST'}
 </div>
 </div>
 </div>

 {/* Convert Calories to EXP Card */}
 <div className="p-4 rounded-[28px] bg-[#ffffff] space-y-3">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-[1600px] bg-[#e85729] flex items-center justify-center text-[#ffffff]">
 <Zap className="w-4 h-4 fill-[#000000]" />
 </div>
 <h4 className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
 {isThai ? 'แปลงแคลอรีเป็นคะแนน' : 'CALORIES TO EXP ENGINE'}
 </h4>
 </div>

 <p className="text-xs text-[#000000]/80 font-medium leading-relaxed">
 {isThai
 ? 'ทุก 2 แคลอรีที่เผาผลาญในสนาม แปลงเป็น 1 คะแนนสะสม'
 : 'Every 2 calories burned on court converts to 1 athlete EXP.'}
 </p>

 {/* Primary CTA */}
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
 <CheckCircle2 className="w-4 h-4 text-[#7cd7a0] shrink-0" />
 <span className="whitespace-nowrap">
 {isThai ? `รับแล้ว +${rewardExp} คะแนน` : `CLAIMED +${rewardExp} EXP`}
 </span>
 </>
 ) : (
 <>
 <Zap className="w-4 h-4 fill-[#ffffff] shrink-0" />
 <span className="whitespace-nowrap">
 {isThai ? `แลกคะแนน (+${rewardExp} คะแนน)` : `CONVERT KCAL (+${rewardExp} EXP)`}
 </span>
 </>
 )}
 </button>

 {justConverted && (
 <div className="p-2.5 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-center text-xs font-bold whitespace-nowrap">
 {isThai ? `🎉 รับ +${rewardExp} คะแนนเข้าโปรไฟล์แล้ว` : `🎉 +${rewardExp} EXP CLAIMED TO PROFILE!`}
 </div>
 )}
 </div>

 {/* Dual CTA Links */}
 <div className="grid grid-cols-2 gap-2.5">
 <button
 type="button"
 onClick={() => navigateTo('C1')}
 className="p-3 rounded-[1600px] bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
 >
 <Swords className="w-3.5 h-3.5 shrink-0" />
 <span className="whitespace-nowrap">{isThai ? 'บันทึกแต้มสด' : 'LIVE SCORER'}</span>
 </button>
 <button
 type="button"
 onClick={() => navigateTo('F1')}
 className="p-3 rounded-[1600px] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] border border-[#000000] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
 >
 <span className="whitespace-nowrap">{isThai ? 'ตู้เหรียญรางวัล' : 'TROPHY ROOM'}</span>
 <ArrowRight className="w-3.5 h-3.5 shrink-0" />
 </button>
 </div>
 </div>
 </div>
 );
};
