import React, { useState } from 'react';
import { Zap, Sparkles, Video, Crown, Dumbbell, Shield, ArrowRight, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { ProSubscriptionModal } from '../common/ProSubscriptionModal';
import { DoodleAvatar } from '../common/DoodleAvatar';
import { playCoinSound } from '../../utils/retroAudio';

export const D1_AICoachDashboardScreen: React.FC = () => {
 const { player, navigateTo, language } = useApp();
 const [showPastComparison, setShowPastComparison] = useState(true);
 const [isProModalOpen, setIsProModalOpen] = useState(false);

 // 5-axis Radar Coordinates
 const cx = 130;
 const cy = 130;
 const maxR = 90;

 const getPoint = (value: number, index: number, total: number = 5) => {
 const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
 const r = (value / 100) * maxR;
 return {
 x: cx + r * Math.cos(angle),
 y: cy + r * Math.sin(angle),
 };
 };

 const currentStats = [
 { label: 'POW', full: language === 'th' ? 'พลังตบ' : 'Power', val: player.skillRadar.power },
 { label: 'SPD', full: language === 'th' ? 'สปีด' : 'Speed', val: player.skillRadar.speed },
 { label: 'CTL', full: language === 'th' ? 'การคุมลูก' : 'Control', val: player.skillRadar.control },
 { label: 'STA', full: language === 'th' ? 'ความอึด' : 'Stamina', val: player.skillRadar.stamina },
 { label: 'TAC', full: language === 'th' ? 'แท็กติก' : 'Tactics', val: player.skillRadar.tactics },
 ];

 const pastStats = [
 { label: 'Power', val: player.pastRadar.power },
 { label: 'Speed', val: player.pastRadar.speed },
 { label: 'Control', val: player.pastRadar.control },
 { label: 'Stamina', val: player.pastRadar.stamina },
 { label: 'Tactics', val: player.pastRadar.tactics },
 ];

 const currentPolygon = currentStats.map((s, i) => {
 const pt = getPoint(s.val, i);
 return `${pt.x},${pt.y}`;
 }).join(' ');

 const pastPolygon = pastStats.map((s, i) => {
 const pt = getPoint(s.val, i);
 return `${pt.x},${pt.y}`;
 }).join(' ');

 return (
 <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28  bg-[#f4f8fb] text-[#000000]">
 <MobileHeader />

 <div className="px-5 pt-4 pb-6 space-y-4">
 {/* Main Body Page Title & Short Description */}
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#15803d] text-[#ffffff] ">
 {language === 'th' ? 'เรดาร์ทักษะ & โค้ช' : 'COACHING & SKILL RADAR'}
 </span>
 <span className="text-[11px] font-bold text-[#000000]/60 uppercase tracking-[0.032em]">
 {language === 'th' ? 'ภาพรวมฟอร์มการเล่น' : 'PERFORMANCE OVERVIEW'}
 </span>
 </div>
 <h1 className="font-['Antonio',sans-serif] text-3xl font-black uppercase tracking-tight leading-none text-[#000000]">
 {language === 'th' ? 'โค้ช & เรดาร์วัดทักษะ' : 'COACH & SKILL RADAR'}
 </h1>
 <p className="text-xs text-[#000000]/70 font-bold leading-relaxed">
 {language === 'th'
 ? 'ระบบวิเคราะห์ฟอร์มการเล่น 5 มิติ ติดตามพัฒนาการรายเดือน และแนะนำแบบฝึกซ้อมเฉพาะบุคคล'
 : '5-dimensional athletic performance analysis, monthly tracking, and personalized drills.'}
 </p>
 </div>

 {/* 1. Athlete Banner Profile Card */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'ข้อมูลนักกีฬา & เทียร์' : 'ATHLETE IDENTITY & TIER'}
 subtitle={language === 'th' ? 'ระดับฝีมือ สถิติชนะต่อเนื่อง และเลเวลปัจจุบัน' : 'Current skill tier, active win streak, and athlete level'}
 badge={`${player.tier} TIER`}
 badgeVariant="green"
 />

 <div className="rounded-[32px] p-4 bg-[#ffffff]">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <DoodleAvatar
 preset="karn"
 size="lg"
 className="w-14 h-14"
 ringClass="border-2 border-[#000000] shadow-xs"
 />
 <div>
 <h2 className="font-['Antonio',sans-serif] text-xl font-black uppercase leading-tight text-[#000000]">
 {player.name}
 </h2>
 <p className="text-[11px] text-[#000000]/70 font-bold">
 {player.playstyle}
 </p>
 <span className="text-[11px] font-bold text-[#ff5c34]">
 🔥 {player.streakWeeks}-Week Streak Active
 </span>
 </div>
 </div>

 <div className="text-right">
 <span className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-[0.032em]">Level</span>
 <div className="font-['Antonio',sans-serif] text-3xl font-black text-[#15803d] leading-none">
 {player.level}
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* 2. Smash Pro Upgrade Banner */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'สมาชิก SMASH PRO' : 'PRO ATHLETE MEMBERSHIP'}
 subtitle={language === 'th' ? 'ส่วนลดค่าคอร์ท 10% · วิเคราะห์วิดีโอ AI ไม่จำกัด' : '10% court discount · Unlimited AI video scans'}
 badge={language === 'th' ? '฿199/เดือน' : '฿199/mo'}
 badgeVariant="orange"
 />

 <div className="rounded-[28px] p-4 bg-[#7cd7a0] space-y-2.5">
 <div className="flex items-center gap-2">
 <Crown className="w-4 h-4 text-[#000000] shrink-0" />
 <span className="text-xs font-bold text-[#000000]">
 {language === 'th'
 ? 'ส่วนลดค่าคอร์ท 10% ทุกสนาม · สแกนวิดีโอ AI ไม่จำกัดครั้ง'
 : '10% court discount · Unlimited AI computer vision scans'}
 </span>
 </div>
 <p className="text-[10px] text-[#000000]/80 font-bold">
 {language === 'th'
 ? 'ส่วนลดค่าคอร์ท 10% ทุกสนามพันธมิตร · สแกนวิดีโอ AI วิเคราะห์ฟอร์มไม่จำกัดครั้ง'
 : '10% court booking discount · Unlimited AI computer vision video scans'}
 </p>
 <div className="pt-1 flex items-center justify-between">
 <span className="text-[11px] font-bold text-[#000000]">
 {player.tier === 'Pro'
 ? (language === 'th' ? 'สมาชิก PRO ใช้งานได้เต็มระบบ' : 'Pro membership active')
 : (language === 'th' ? 'ปลดล็อกสิทธิพิเศษนักกีฬาเต็มรูปแบบ' : 'Unlock full athlete privileges')}
 </span>
 <button
 type="button"
 onClick={() => {
 setIsProModalOpen(true);
 playCoinSound();
 }}
 className="px-3.5 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] font-bold text-[11px] uppercase tracking-[0.032em] hover:bg-[#1a1a1a] transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
 >
 {player.tier === 'Pro'
 ? (language === 'th' ? 'ดูสถานะ PRO' : 'View Pro')
 : (language === 'th' ? 'อัปเกรด PRO' : 'Upgrade Pro')}
 </button>
 </div>
 </div>
 </div>

 {/* 3. 5-Axis Skill Radar Card */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'เรดาร์ประเมินทักษะ 5 มิติ' : 'ATHLETIC SKILL RADAR'}
 subtitle={language === 'th'
 ? 'พลังตบ · สปีด · คุมลูก · ความอึด · แท็กติก (30 วันล่าสุด)'
 : 'Power · Speed · Control · Stamina · Tactics (Last 30D)'}
 rightSlot={
 <button
 type="button"
 onClick={() => setShowPastComparison((prev) => !prev)}
 className="px-3 py-1 rounded-[1600px] text-[10px] font-bold tracking-[0.032em] cursor-pointer transition-transform active:scale-95 border border-[#000000] bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9] shrink-0 whitespace-nowrap"
 >
 {showPastComparison
 ? (language === 'th' ? '✓ เปิดเทียบ 30 วัน' : '✓ Past 30D')
 : (language === 'th' ? 'เทียบสถิติ 30 วัน' : 'Show 30D')}
 </button>
 }
 />

 <div className="rounded-[32px] p-4 bg-[#ffffff] space-y-2">

 {/* SVG Radar Chart */}
 <div className="w-full flex justify-center py-2">
 <svg width={260} height={260} className="overflow-visible">
 {/* Concentric Background Polygons */}
 {[0.25, 0.5, 0.75, 1.0].map((level, lIdx) => {
 const ringPoints = [0, 1, 2, 3, 4].map((i) => {
 const pt = getPoint(level * 100, i);
 return `${pt.x},${pt.y}`;
 }).join(' ');
 return (
 <polygon
 key={lIdx}
 points={ringPoints}
 fill="none"
 stroke="rgba(0,0,0,0.12)"
 strokeWidth={1}
 />
 );
 })}

 {/* Axis lines */}
 {[0, 1, 2, 3, 4].map((i) => {
 const pt = getPoint(100, i);
 return (
 <line
 key={i}
 x1={cx}
 y1={cy}
 x2={pt.x}
 y2={pt.y}
 stroke="rgba(0,0,0,0.15)"
 strokeWidth={1}
 />
 );
 })}

 {/* Past 30D Comparison Polygon */}
 {showPastComparison && (
 <polygon
 points={pastPolygon}
 fill="rgba(204, 204, 204, 0.35)"
 stroke="#666666"
 strokeWidth={1.5}
 strokeDasharray="4 3"
 />
 )}

 {/* Current Active Polygon */}
 <polygon
 points={currentPolygon}
 fill="rgba(77, 162, 255, 0.28)"
 stroke="#15803d"
 strokeWidth={2.5}
 />

 {/* Data points */}
 {currentStats.map((s, i) => {
 const pt = getPoint(s.val, i);
 return (
 <circle
 key={i}
 cx={pt.x}
 cy={pt.y}
 r={4}
 fill="#e85729"
 stroke="#000000"
 strokeWidth={1.5}
 />
 );
 })}

 {/* Text Labels around radar */}
 {currentStats.map((s, i) => {
 const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
 const labelR = maxR + 18;
 const lx = cx + labelR * Math.cos(angle);
 const ly = cy + labelR * Math.sin(angle);
 return (
 <text
 key={i}
 x={lx}
 y={ly}
 textAnchor="middle"
 dominantBaseline="middle"
 fill="#000000"
 fontSize={11}
 fontWeight="800"
 fontFamily="Antonio, sans-serif"
 >
 {s.label} ({s.val})
 </text>
 );
 })}
 </svg>
 </div>

 {/* Quick Legend */}
 <div className="flex items-center justify-center gap-4 text-[11px] font-bold pt-2 ">
 <div className="flex items-center gap-1.5 text-[#15803d]">
 <span className="w-2.5 h-2.5 rounded-[1600px] bg-[#15803d] " />
 <span>{language === 'th' ? 'ฟอร์มปัจจุบัน' : 'Current Form'}</span>
 </div>
 {showPastComparison && (
 <div className="flex items-center gap-1.5 text-[#000000]/60">
 <span className="w-3 h-0.5 bg-[#000000]/40" />
 <span>{language === 'th' ? 'สถิติ 30 วันก่อน' : 'Past 30 Days'}</span>
 </div>
 )}
 </div>
 </div>
 </div>

 {/* 4. Head Coach Advice */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'จุดแข็ง & คำแนะนำแท็กติก' : 'STRENGTHS & TACTICAL ADVICE'}
 subtitle={language === 'th'
 ? 'สรุปจุดเด่นล่าสุด พร้อมทางลัดฝึกซ้อมและสแกน AI'
 : 'Key strengths breakdown with training shortcuts'}
 badge={language === 'th' ? 'โค้ชวิเคราะห์' : 'COACH AI'}
 badgeVariant="green"
 />

 <div className="rounded-[28px] p-4 space-y-2.5 bg-[#ffffff]">

 <p className="text-xs text-[#000000]/80 leading-relaxed font-medium">
 {language === 'th'
 ? 'พลังตบ Smash ของคุณอยู่ในระดับท็อป (Power 88 / 342 km/h) แต่ยังมีจุดที่ต้องพัฒนาในเรื่อง การตัดหยอดหน้าเน็ต (Control 76) แนะนำให้ฝึกซ้อม Split-step drills สัปดาห์ละ 2 ครั้งเพื่อลด Unforced errors'
 : 'Your smash power is in top tier (Power 88 / 342 km/h), but net drop control (Control 76) needs improvement. Recommended 2 weekly split-step drill sessions.'}
 </p>

 <div className="pt-1 grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => navigateTo('D2')}
 className="py-3 px-3 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-transform active:scale-95 border border-[#000000] bg-[#000000] text-[#ffffff] hover:bg-[#1a1a1a] cursor-pointer whitespace-nowrap"
 >
 <Dumbbell className="w-4 h-4 shrink-0" />
 <span className="whitespace-nowrap">
 {language === 'th' ? 'แบบฝึกซ้อม D2' : 'QUESTS & DRILLS (D2)'}
 </span>
 </button>
 <button
 type="button"
 onClick={() => navigateTo('D3')}
 className="py-3 px-3 rounded-[1600px] font-bold text-xs border border-[#000000] flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9] uppercase tracking-[0.032em] whitespace-nowrap"
 >
 <Video className="w-4 h-4 text-[#15803d] shrink-0" />
 <span className="whitespace-nowrap">
 {language === 'th' ? 'สแกนวิดีโอ AI (D3)' : 'VISION SCAN (D3)'}
 </span>
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Pro Membership Modal */}
 <ProSubscriptionModal
 isOpen={isProModalOpen}
 onClose={() => setIsProModalOpen(false)}
 />
 </div>
 );
};
