import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Zap, ChevronRight, Activity, ArrowRight, ShieldAlert, Sparkles, Check, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';

export const C3_AIDiagnosticsScreen: React.FC = () => {
 const { navigateTo, gainExp, language } = useApp();
 const [selectedZone, setSelectedZone] = useState<string>('front-left');
 const [drillAdded, setDrillAdded] = useState(false);

 const ZONE_INFO: Record<string, { name: string; errors: number; advice: string; tag: string; color: string }> = {
 'front-left': {
 name: 'Forehand Net Zone',
 errors: 4,
 advice: 'พบข้อผิดพลาดลูกติดเน็ต 4 ครั้ง แนะนำให้ตั้งหน้าไม้ระดับสายตาและย่อเข่าก่อนสัมผัสลูก',
 tag: 'Need Practice',
 color: '#e85729',
 },
 'front-right': {
 name: 'Backhand Net Zone',
 errors: 1,
 advice: 'ลูกปั่นเน็ตและการตัดหยอดทำได้ยอดเยี่ยม เปลี่ยนเป็นแต้มได้ถึง 80%',
 tag: 'Strong Zone',
 color: '#7cd7a0',
 },
 'back-left': {
 name: 'Backhand Deep Corner',
 errors: 5,
 advice: 'จุดอ่อนสำคัญ! องศาหน้าไม้ปิดช้าเกินไป ทำให้ลูกออกเส้นหลัง 5 ครั้ง',
 tag: 'Critical Weakness',
 color: '#e85729',
 },
 'back-right': {
 name: 'Smash Power Hotspot',
 errors: 1,
 advice: 'จุดทำแต้มหลัก! ตบ Smash ชนะ 8 ครั้ง ความเร็วเฉลี่ย 312 km/h',
 tag: 'Winner Hotspot',
 color: '#7cd7a0',
 },
 };

 const currentZone = ZONE_INFO[selectedZone] || ZONE_INFO['front-left'];

 const handleAddDrill = () => {
 setDrillAdded(true);
 gainExp(80, 'เพิ่มแบบฝึกซ้อมแก้จุดอ่อนหน้าเน็ตเข้าตารางซ้อม');
 setTimeout(() => {
 navigateTo('D2');
 }, 600);
 };

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000]  overflow-hidden">
 <MobileHeader showBack />

 <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
 {/* 2D Badminton Court Interactive Map */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'แผนผังวิเคราะห์จุดอ่อน 4 โซน' : '2D WEAKNESS HEATMAP (4-ZONE)'}
 subtitle={language === 'th'
 ? 'แตะโซนบนคอร์ทเพื่อดู Unforced Errors และวิธีแก้ไข'
 : 'Tap any court zone to inspect errors & targeted drills'}
 badge={language === 'th' ? 'คอร์ท 3' : 'COURT 3'}
 badgeVariant="orange"
 />

 <div className="rounded-[32px] p-4 text-center bg-[#ffffff]">
 <div className="relative w-full max-w-[280px] h-60 mx-auto bg-[#7cd7a0]/30 rounded-[24px] p-2 flex flex-col justify-between overflow-hidden">
 {/* Net Divider */}
 <div className="absolute top-1/2 inset-x-0 h-1 bg-[#000000] z-10 flex items-center justify-center">
 <span className="px-2 py-0.5 bg-[#000000] text-[#ffffff] text-[8px] font-black uppercase rounded-[1600px] whitespace-nowrap">
 NET
 </span>
 </div>

 {/* Top Half: Opponent side */}
 <div className="flex-1 -dashed -[#000000]/40 flex items-center justify-center">
 <span className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-[0.032em]">
 {language === 'th' ? 'แดนคู่ต่อสู้ (Opponent Court)' : 'Opponent Court'}
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
 <span>Forehand Net</span>
 <span className="text-[9px] font-mono mt-0.5">4 Errors</span>
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
 <span>Backhand Net</span>
 <span className="text-[9px] font-mono mt-0.5">1 Error</span>
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
 <span>Deep Backhand</span>
 <span className="text-[9px] font-mono mt-0.5">5 Errors</span>
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
 <span>Smash Zone</span>
 <span className="text-[9px] font-mono mt-0.5">8 Winners</span>
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Selected Zone Detail Card */}
 <div className="space-y-2">
 <SectionHeader
 title={currentZone.name}
 subtitle={language === 'th'
 ? 'สถิติข้อผิดพลาดและแนวทางปรับเทคนิคในโซนนี้'
 : 'Error count breakdown & biomechanics tips'}
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
 <span>{language === 'th' ? 'เพิ่มแบบฝึกซ้อมสำเร็จ (+80 EXP)' : 'DRILL ADDED (+80 EXP)'}</span>
 </>
 ) : (
 <>
 <Zap className="w-4 h-4 fill-[#e85729] text-[#e85729] shrink-0" />
 <span>{language === 'th' ? 'เพิ่มแบบฝึกซ้อมเข้า Quests (D2)' : 'ADD DRILL TO QUESTS (D2)'}</span>
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
 <span>{language === 'th' ? 'แชร์การ์ด (C4)' : 'SHARE RECAP (C4)'}</span>
 </button>
 <button
 type="button"
 onClick={() => navigateTo('D1')}
 className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
 >
 <span>{language === 'th' ? 'เรดาร์โค้ช (D1)' : 'COACH RADAR (D1)'}</span>
 <ArrowRight className="w-3.5 h-3.5 shrink-0" />
 </button>
 </div>
 </div>
 </div>
 );
};
