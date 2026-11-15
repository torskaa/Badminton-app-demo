/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';

interface ScreenSwitcherModalProps {
 isOpen: boolean;
 onClose: () => void;
}

interface PathCategory {
 title: string;
 code: string;
 badge: string;
 screens: {
 id: ScreenId;
 stepNo: string;
 title: string;
 description: string;
 actionTag: string;
 }[];
}

export const ScreenSwitcherModal: React.FC<ScreenSwitcherModalProps> = ({ isOpen, onClose }) => {
 const { currentScreen, navigateTo, theme, dataMode, setDataMode, language } = useApp();
 const isDark = theme === 'dark';
 const isThai = language === 'th';

 const PATH_GROUPS: PathCategory[] = [
 {
 title: isThai ? 'เริ่มต้นใช้งานและตั้งค่า' : 'ONBOARDING & SETUP',
 code: isThai ? 'หมวด A' : 'PATH A',
 badge: isThai ? 'เริ่มต้น' : 'Welcome',
 screens: [
 {
 id: 'A1',
 stepNo: '1',
 title: isThai ? 'หน้าต้อนรับและแนะนำแอป' : 'Welcome Hero & Value Prop',
 description: isThai ? 'แนะนำฟีเจอร์เด่นและเริ่มต้นใช้งาน' : 'Hero visual, instant booking intro, start onboarding',
 actionTag: isThai ? 'เริ่มต้น' : 'Get Started',
 },
 {
 id: 'A2',
 stepNo: '2',
 title: isThai ? 'ตั้งค่าสไตล์การเล่น' : 'Athlete Playstyle Setup',
 description: isThai ? 'เลือกมือที่ถนัด สไตล์และระดับฝีมือ' : 'Hand dominance, playstyle archetype, skill assessment',
 actionTag: isThai ? 'สร้างโปรไฟล์' : 'Build Profile',
 },
 ],
 },
 {
 title: isThai ? 'ค้นหาสนามและจองคอร์ท' : 'COURT DISCOVERY & BOOKING',
 code: isThai ? 'หมวด B' : 'PATH B',
 badge: isThai ? 'จองสนาม' : 'Booking',
 screens: [
 {
 id: 'B1',
 stepNo: '3',
 title: isThai ? 'สำรวจสนามแบดใกล้บ้าน' : 'Court Discovery & Arenas',
 description: isThai ? 'เลือกสนามมาตรฐานและดูคอร์ทว่าง' : 'Browse BWF Taraflex courts & open arenas',
 actionTag: isThai ? 'หาสนาม' : 'Find Court',
 },
 {
 id: 'B2',
 stepNo: '4',
 title: isThai ? 'เลือกคอร์ทและช่วงเวลา' : 'Court Slot & Schedule Picker',
 description: isThai ? 'เลือกเลขคอร์ทและรอบชั่วโมงที่สะดวก' : 'Select Court 1-4 & prime time slots',
 actionTag: isThai ? 'เลือกเวลา' : 'Choose Time',
 },
 {
 id: 'B3',
 stepNo: '5',
 title: isThai ? 'ชำระเงินด้วยพร้อมเพย์' : 'PromptPay Checkout',
 description: isThai ? 'สแกนจ่ายและยืนยันสลิปทันที' : 'QR payment & instant slip verification',
 actionTag: isThai ? 'ชำระเงิน' : 'Pay Now',
 },
 {
 id: 'B4',
 stepNo: '6',
 title: isThai ? 'บัตรเข้าสนามดิจิทัล' : 'Booking Confirmed & E-Ticket',
 description: isThai ? 'สแกนเข้าสนามพร้อมรับคะแนนโบนัส' : 'Digital check-in QR pass + bonus XP',
 actionTag: isThai ? 'ดูตั๋ว' : 'View Ticket',
 },
 ],
 },
 {
 title: isThai ? 'นับแต้มสดและวิเคราะห์เกม' : 'IN-MATCH SCORING & ANALYTICS',
 code: isThai ? 'หมวด C' : 'PATH C',
 badge: isThai ? 'ข้างสนาม' : 'Courtside',
 screens: [
 {
 id: 'C1',
 stepNo: '7',
 title: isThai ? 'บันทึกแต้มแมตช์สด' : 'Courtside Live Score Tracker',
 description: isThai ? 'นับแต้มง่ายๆ บอกฝั่งเสิร์ฟและช็อตเด็ด' : 'Thumb-friendly scoring & shot tags',
 actionTag: isThai ? 'นับแต้ม' : 'Live Match',
 },
 {
 id: 'C2',
 stepNo: '8',
 title: isThai ? 'สรุปผลหลังจบเกม' : 'Post-Match Summary',
 description: isThai ? 'ผลคะแนน รางวัลและบันทึกโน้ต' : 'Match breakdown, rewards & notes',
 actionTag: isThai ? 'ดูสรุป' : 'Summary',
 },
 {
 id: 'C3',
 stepNo: '9',
 title: isThai ? 'วิเคราะห์จุดอ่อน 4 โซน' : 'Match Diagnostics & Heatmap',
 description: isThai ? 'เปอร์เซ็นต์ช็อตและจุดเสียบนคอร์ท' : 'Shot win-rates & interactive court heatmap',
 actionTag: isThai ? 'วิเคราะห์' : 'Heatmap',
 },
 {
 id: 'C4',
 stepNo: '10',
 title: isThai ? 'การ์ดสรุปผลงานพร้อมแชร์' : 'Athlete Recap Card',
 description: isThai ? 'การ์ดทองสรุปสถิติสำหรับแชร์ลงโซเชียล' : 'Gold athlete recap card for social sharing',
 actionTag: isThai ? 'การ์ดผล' : 'Recap Card',
 },
 ],
 },
 {
 title: isThai ? 'โค้ชส่วนตัวและแบบฝึก' : 'COACH & SKILL-UP HUB',
 code: isThai ? 'หมวด D' : 'PATH D',
 badge: isThai ? 'ฝึกซ้อม' : 'Coach',
 screens: [
 {
 id: 'D1',
 stepNo: '11',
 title: isThai ? 'แดชบอร์ดทักษะ 5 มิติ' : 'Coach Dashboard & 5-Axis Radar',
 description: isThai ? 'ติดตามพลังตบ ความไว คุมลูก ความอึด แท็กติก' : 'Power, Speed, Control, Stamina & Tactics stats',
 actionTag: isThai ? 'หน้าโค้ช' : 'Coach Hub',
 },
 {
 id: 'D2',
 stepNo: '12',
 title: isThai ? 'ภารกิจประจำวันและแบบฝึก' : 'Daily Quests & Skill Drills',
 description: isThai ? 'ทำภารกิจและฝึกท่าแก้จุดอ่อนเพื่อรับคะแนน' : 'Complete quests & drills to claim XP',
 actionTag: isThai ? 'ภารกิจ' : 'Quests',
 },
 {
 id: 'D3',
 stepNo: '13',
 title: isThai ? 'วิเคราะห์วิดีโอด้วย AI' : 'Computer Vision Video Analysis',
 description: isThai ? 'สแกนคลิปวัดสปีดลูกตบและองศาแขน' : 'Replay scan, smash speed & joint angles',
 actionTag: isThai ? 'สแกนคลิป' : 'Vision Scan',
 },
 ],
 },
 {
 title: isThai ? 'ก๊วนแบดและจับคู่ดวล' : 'COMMUNITY & GUILD HUB',
 code: isThai ? 'หมวด E' : 'PATH E',
 badge: isThai ? 'ก๊วน' : 'Guilds',
 screens: [
 {
 id: 'E1',
 stepNo: '14',
 title: isThai ? 'ศูนย์รวมก๊วนตีแบด' : 'Badminton Guild Hub',
 description: isThai ? 'ค้นหาก๊วน ชวนเพื่อนและดูนัดลงคอร์ท' : 'Guild roster, chat & active court sessions',
 actionTag: isThai ? 'หน้าก๊วน' : 'Guilds',
 },
 {
 id: 'E2',
 stepNo: '15',
 title: isThai ? 'รายละเอียดก๊วนและหารบิล' : 'Group Event & Court RSVP',
 description: isThai ? 'ลงชื่อเข้าก๊วน เช็กรายชื่อและหารค่าคอร์ท' : 'Confirm RSVP, attendee list & split bill',
 actionTag: isThai ? 'ลงชื่อ' : 'Event RSVP',
 },
 {
 id: 'E3',
 stepNo: '16',
 title: isThai ? 'จับคู่ซ้อมสมดุล 50/50' : 'Smart Matchmaker (Duel)',
 description: isThai ? 'จัดคู่ซ้อมที่ฝีมือสูสีและสมดุลที่สุด' : 'Balanced matchmaking with sparring rivals',
 actionTag: isThai ? 'หาคู่ซ้อม' : 'Matchmaker',
 },
 {
 id: 'E4',
 stepNo: '17',
 title: isThai ? 'ตารางอันดับประจำซีซัน' : 'Guild & Arena Leaderboard',
 description: isThai ? 'เช็กอันดับอัตราชนะและลีกประจำซีซัน' : 'Rankings, top smashers & season leagues',
 actionTag: isThai ? 'อันดับ' : 'Leaderboard',
 },
 ],
 },
 {
 title: isThai ? 'โปรไฟล์และนาฬิกาสุขภาพ' : 'PROFILE & WEARABLE SYNC',
 code: isThai ? 'หมวด F' : 'PATH F',
 badge: isThai ? 'นักกีฬา' : 'Athlete',
 screens: [
 {
 id: 'F1',
 stepNo: '18',
 title: isThai ? 'โปรไฟล์และตู้เหรียญรางวัล' : 'Athlete Profile & Trophies',
 description: isThai ? 'การ์ดพลังนักกีฬา อุปกรณ์คู่ใจและเหรียญรางวัล' : 'Athlete card, gear specs & trophy cabinet',
 actionTag: isThai ? 'โปรไฟล์' : 'Profile',
 },
 {
 id: 'F2',
 stepNo: '19',
 title: isThai ? 'ซิงค์นาฬิกาและชีพจร' : 'Smartwatch Health Sync',
 description: isThai ? 'ดึงข้อมูลชีพจรและแปลงแคลอรี่เป็นคะแนน' : 'Live BPM, distance & calories-to-XP sync',
 actionTag: isThai ? 'ซิงค์' : 'Watch Sync',
 },
 ],
 },
 ];

 return (
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md"
 >
 <motion.div
 initial={{ y: '100%' }}
 animate={{ y: 0 }}
 exit={{ y: '100%' }}
 transition={{ type: 'spring', damping: 28, stiffness: 320 }}
 className={`w-full max-w-xl rounded-t-[32px] sm:rounded-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden transition-colors ${
 isDark ? 'bg-[#0f172a] -slate-700/80 text-white' : 'bg-[#f4f7fb] -slate-200/90 text-slate-900'
 }`}
 >
 {/* Header */}
 <div className={`p-4 flex items-center justify-between shrink-0 ${
 isDark ? 'bg-[#161f30] -slate-700/80' : 'bg-white -slate-200/90'
 }`}>
 <div className="flex items-center gap-2.5">
 <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 -emerald-500/30 flex items-center justify-center font-bold">
 <Compass className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-base font-black uppercase tracking-tight leading-none">
 {isThai ? 'เมนูนำทางทั้งหมด' : 'ALL SCREENS DIRECTORY'}
 </h3>
 <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
 {isThai ? 'เลือกหน้าที่ต้องการเปิดใช้งาน' : 'Jump to any screen in the app'}
 </p>
 </div>
 </div>
 <button
 type="button"
 onClick={onClose}
 className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer border ${
 isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
 }`}
 >
 <X className="w-4 h-4 stroke-[2.5]" />
 </button>
 </div>

 {/* Data Preview Mode Selector */}
 <div className="px-4 py-2 border-b border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between text-xs font-bold gap-2">
 <span className="text-neutral-500 text-[10px] uppercase font-black tracking-wider">
 {isThai ? 'ข้อมูลตัวอย่าง:' : 'Data Mode:'}
 </span>
 <div className="flex items-center gap-1.5">
 {(
 [
 { id: 'demo', th: 'ปกติ', en: 'DEMO' },
 { id: 'worst', th: 'ข้อมูลยาว', en: 'STRESS' },
 { id: 'one', th: 'รายการเดียว', en: 'ONE' },
 { id: 'empty', th: 'ว่างเปล่า', en: 'EMPTY' },
 ] as const
 ).map((mode) => (
 <button
 key={mode.id}
 type="button"
 onClick={() => setDataMode(mode.id)}
 className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-transform active:scale-[0.96] cursor-pointer border ${
 dataMode === mode.id
 ? 'bg-black text-white border-black shadow-xs'
 : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-100'
 }`}
 >
 {isThai ? mode.th : mode.en}
 </button>
 ))}
 </div>
 </div>

 {/* List of Screens in Groups */}
 <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
 {PATH_GROUPS.map((group) => (
 <div key={group.code} className={`rounded-3xl p-3.5 space-y-2 ${
 isDark ? 'bg-[#161f30] -slate-700/80' : 'bg-white -slate-200/90 shadow-xs'
 }`}>
 <div className={`flex items-center justify-between pb-2 ${
 isDark ? '-slate-800' : '-slate-100'
 }`}>
 <div className="flex items-center gap-2">
 <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-500 -emerald-500/30">
 {group.badge}
 </span>
 <span className="text-xs font-black uppercase tracking-wide">
 {group.title}
 </span>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 {group.screens.map((screen) => {
 const isActive = currentScreen === screen.id;
 return (
 <button
 type="button"
 key={screen.id}
 onClick={() => {
 navigateTo(screen.id);
 onClose();
 }}
 className={`w-full text-left p-3 rounded-2xl transition-all border flex flex-col justify-between cursor-pointer active:scale-95 ${
 isActive
 ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500'
 : isDark
 ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
 : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800'
 }`}
 >
 <div className="flex items-start justify-between gap-1 mb-1">
 <span className="text-xs font-black">
 {screen.title}
 </span>
 {isActive && (
 <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
 <Check className="w-2.5 h-2.5 stroke-[3]" />
 </span>
 )}
 </div>
 <p className={`text-[11px] line-clamp-2 leading-snug mb-2.5 ${
 isDark ? 'text-slate-400' : 'text-slate-500'
 }`}>
 {screen.description}
 </p>
 <div className="flex items-center justify-end">
 <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
 isActive
 ? 'bg-emerald-500 text-slate-950'
 : isDark
 ? 'bg-slate-800 text-slate-300'
 : 'bg-slate-200 text-slate-800'
 }`}>
 <span>{screen.actionTag}</span>
 <ArrowRight className="w-3 h-3" />
 </span>
 </div>
 </button>
 );
 })}
 </div>
 </div>
 ))}
 </div>

 {/* Bottom Dismiss */}
 <div className={`p-3 flex items-center justify-between ${
 isDark ? 'bg-[#161f30] -slate-700/80' : 'bg-white -slate-200/90'
 }`}>
 <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
 {isThai ? 'พร้อมใช้งานทุกหน้าจอ' : 'All screens interactive'}
 </span>
 <button
 type="button"
 onClick={onClose}
 className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-transform active:scale-95 cursor-pointer ${
 isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700' : 'bg-slate-900 hover:bg-slate-800 text-white'
 }`}
 >
 {isThai ? 'ปิดหน้าต่าง' : 'Close Directory'}
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 );
};
