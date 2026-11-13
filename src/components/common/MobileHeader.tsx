import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';

interface MobileHeaderProps {
 title?: string;
 showBack?: boolean;
 onBack?: () => void;
 subtitle?: string;
 rightSlot?: React.ReactNode;
}

interface HeaderMeta {
 thTitle: string;
 enTitle: string;
 thSub: string;
 enSub: string;
 action?: {
 thLabel: string;
 enLabel: string;
 target?: ScreenId;
 variant: 'cta' | 'badge';
 badgeTone?: 'green' | 'orange' | 'dark' | 'soft';
 };
}

const BADGE_TONES: Record<'green' | 'orange' | 'dark' | 'soft', string> = {
 green: 'bg-[#7cd7a0] text-[#000000]',
 orange: 'bg-[#e85729] text-[#ffffff]',
 dark: 'bg-[#000000] text-[#ffffff]',
 soft: 'bg-[#e8f7ee] text-[#15803d]',
};

export const MobileHeader: React.FC<MobileHeaderProps> = ({
 title,
 showBack,
 onBack,
 subtitle,
 rightSlot,
}) => {
 const { currentScreen, goBack, navigateTo, language } = useApp();

 const shouldShowBack = showBack !== undefined ? showBack : currentScreen !== 'HOME';

 const DEFAULT_META: Record<string, HeaderMeta> = {
 A1: {
 thTitle: 'เริ่มต้น',
 enTitle: 'Welcome',
 thSub: 'ค้นหาสนาม จองคอร์ท และเก็บสถิติ',
 enSub: 'Find courts, book & track stats.',
 action: { thLabel: 'BWF Club', enLabel: 'BWF Club', variant: 'badge', badgeTone: 'soft' },
 },
 A2: {
 thTitle: 'สไตล์เล่น',
 enTitle: 'Playstyle',
 thSub: 'ตั้งค่าสายถนัดและระดับฝีมือของคุณ',
 enSub: 'Set your playstyle & skill tier.',
 action: { thLabel: 'หน้าหลัก →', enLabel: 'Home →', target: 'HOME', variant: 'cta' },
 },
 B1: {
 thTitle: 'ค้นหาสนาม',
 enTitle: 'Courts',
 thSub: 'สำรวจสนามใกล้บ้านและกดจองทันที',
 enSub: 'Browse nearby courts & book fast.',
 action: { thLabel: 'แผนที่ →', enLabel: 'Map →', target: 'MAP', variant: 'cta' },
 },
 B2: {
 thTitle: 'จองคอร์ท',
 enTitle: 'Book Court',
 thSub: 'เลือกคอร์ทว่างและเวลาที่สะดวก',
 enSub: 'Pick open courts & time slots.',
 action: { thLabel: 'เปิดจองอยู่', enLabel: 'Open Slots', variant: 'badge', badgeTone: 'soft' },
 },
 B3: {
 thTitle: 'ชำระเงิน',
 enTitle: 'Checkout',
 thSub: 'ชำระค่าจองผ่านพร้อมเพย์หรือกระเป๋า',
 enSub: 'Pay via PromptPay or wallet.',
 action: { thLabel: 'ฟรีค่าธรรมเนียม', enLabel: '0% Fee', variant: 'badge', badgeTone: 'soft' },
 },
 B4: {
 thTitle: 'บัตรสนาม',
 enTitle: 'Court Pass',
 thSub: 'สแกน QR หน้าเคาน์เตอร์เข้าสนาม',
 enSub: 'Scan QR pass to check in.',
 action: { thLabel: 'แผนที่สนาม', enLabel: 'Court Map', target: 'MAP', variant: 'cta' },
 },
 C1: {
 thTitle: 'บันทึกแต้ม',
 enTitle: 'Scorer',
 thSub: 'นับแต้มสด บอกฝั่งเสิร์ฟและเก็บช็อต',
 enSub: 'Live scorer & shot analytics.',
 action: { thLabel: '● LIVE BWF', enLabel: '● LIVE BWF', variant: 'badge', badgeTone: 'orange' },
 },
 C2: {
 thTitle: 'สรุปผล',
 enTitle: 'Summary',
 thSub: 'เช็กคะแนนรวม รางวัล EXP และไฮไลต์',
 enSub: 'Final score, EXP & highlights.',
 action: { thLabel: 'การ์ดผล →', enLabel: 'Recap →', target: 'C4', variant: 'cta' },
 },
 C3: {
 thTitle: 'วิเคราะห์เกม',
 enTitle: 'Diagnostics',
 thSub: 'ดูจุดเสีย 4 โซนและแบบฝึกแก้ทาง',
 enSub: '4-zone heatmap & targeted drills.',
 action: { thLabel: 'ฝึกแก้ทาง →', enLabel: 'Drills →', target: 'D2', variant: 'cta' },
 },
 C4: {
 thTitle: 'การ์ดผล',
 enTitle: 'Recap Card',
 thSub: 'แชร์การ์ดสถิติแมตช์ลงสตอรี่ทันที',
 enSub: 'Share match card to your story.',
 action: { thLabel: 'โปรไฟล์ →', enLabel: 'Profile →', target: 'F1', variant: 'cta' },
 },
 D1: {
 thTitle: 'โค้ช AI',
 enTitle: 'AI Coach',
 thSub: 'ติดตามเรดาร์ทักษะ 5 มิติรายเดือน',
 enSub: 'Track 5-axis skill radar & form.',
 action: { thLabel: 'ภารกิจ →', enLabel: 'Quests →', target: 'D2', variant: 'cta' },
 },
 D2: {
 thTitle: 'ภารกิจ',
 enTitle: 'Quests',
 thSub: 'ทำภารกิจและแบบฝึกเพื่อรับแต้ม EXP',
 enSub: 'Finish daily drills to earn EXP.',
 action: { thLabel: '+EXP รายวัน', enLabel: 'Daily EXP', variant: 'badge', badgeTone: 'soft' },
 },
 D3: {
 thTitle: 'สแกนวิดีโอ',
 enTitle: 'AI Video',
 thSub: 'ตรวจองศาท่าตบ ฟุตเวิร์กและสปีดลูก',
 enSub: 'Analyze smash angle & footwork.',
 action: { thLabel: 'AI Vision', enLabel: 'AI Vision', variant: 'badge', badgeTone: 'dark' },
 },
 E1: {
 thTitle: 'ก๊วน',
 enTitle: 'Guilds',
 thSub: 'หาก๊วนตีแบด นัดลงสนามและหารบิล',
 enSub: 'Join local squads & split fees.',
 action: { thLabel: '+ นัดก๊วน', enLabel: '+ Event', target: 'E2', variant: 'cta' },
 },
 E2: {
 thTitle: 'นัดก๊วน',
 enTitle: 'Event RSVP',
 thSub: 'ลงชื่อร่วมก๊วนและดูค่าใช้จ่ายต่อคน',
 enSub: 'Confirm RSVP & check split bill.',
 action: { thLabel: 'จับคู่ 50/50', enLabel: 'Matchmaker', target: 'E3', variant: 'cta' },
 },
 E3: {
 thTitle: 'จับคู่ 50/50',
 enTitle: 'Matchmaker',
 thSub: 'สุ่มจัดคู่สมดุลตามคะแนนเรดาร์',
 enSub: 'Fair 50/50 doubles team shuffle.',
 action: { thLabel: 'อันดับก๊วน →', enLabel: 'Ranks →', target: 'E4', variant: 'cta' },
 },
 E4: {
 thTitle: 'อันดับก๊วน',
 enTitle: 'Leaderboard',
 thSub: 'เช็กอันดับ Win Rate และคะแนนซีซัน',
 enSub: 'Squad win rates & season ranks.',
 action: { thLabel: 'Season 4', enLabel: 'Season 4', variant: 'badge', badgeTone: 'orange' },
 },
 F1: {
 thTitle: 'โปรไฟล์',
 enTitle: 'Profile',
 thSub: 'การ์ดพลัง สถิติแข่งและเหรียญรางวัล',
 enSub: 'Athlete card, stats & badges.',
 action: { thLabel: 'ซิงค์นาฬิกา', enLabel: 'Wearable', target: 'F2', variant: 'cta' },
 },
 F2: {
 thTitle: 'นาฬิกา',
 enTitle: 'Wearable',
 thSub: 'ซิงค์ชีพจรและแคลอรีจากสนามจริง',
 enSub: 'Sync heart rate & calories.',
 action: { thLabel: 'Health Sync', enLabel: 'Health Sync', variant: 'badge', badgeTone: 'soft' },
 },
 CLUB_TOOLS: {
 thTitle: 'เครื่องมือ',
 enTitle: 'Tools',
 thSub: 'จัดทีม นับแต้ม และหารค่าคอร์ทก๊วน',
 enSub: 'Scoreboard, teams & split bills.',
 action: { thLabel: 'นัดก๊วน →', enLabel: 'RSVP →', target: 'E2', variant: 'cta' },
 },
 FINANCE: {
 thTitle: 'การเงิน',
 enTitle: 'Finance',
 thSub: 'จัดการยอดเงิน เติมเครดิตและดูประวัติ',
 enSub: 'Wallet balance & court receipts.',
 action: { thLabel: '0% Fee', enLabel: '0% Fee', variant: 'badge', badgeTone: 'soft' },
 },
 };

 const meta = DEFAULT_META[currentScreen];
 const resolvedTitle = title || (meta ? (language === 'th' ? meta.thTitle : meta.enTitle) : undefined);
 const resolvedSubtitle = subtitle || (meta ? (language === 'th' ? meta.thSub : meta.enSub) : undefined);
 const defaultAction = meta?.action;

 const handleBack = () => {
 if (onBack) {
 onBack();
 return;
 }
 goBack();
 };

 return (
 <header className="sticky top-0 z-30 app-header-safe px-5 pb-4 bg-[#ffffff] border-b border-[#000000]/10 shrink-0 select-none text-[#000000]">
 <div className="flex items-start justify-between gap-2.5 min-w-0">
 <div className="flex items-start gap-3 min-w-0 flex-1">
 {shouldShowBack && (
 <button
 type="button"
 onClick={handleBack}
 className="w-8 h-8 mt-0.5 rounded-[1600px] bg-[#ffffff] border border-[#000000]/20 shadow-xs flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#e8f7ee] transition-transform active:scale-90"
 aria-label="Back"
 title={language === 'th' ? 'ย้อนกลับ' : 'Back'}
 >
 <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
 </button>
 )}

 <div className="min-w-0 flex-1">
 {resolvedTitle && (
 <h1 className="text-xl font-black text-[#000000] font-['Antonio',sans-serif] tracking-wide uppercase leading-[1.1] truncate">
 {resolvedTitle}
 </h1>
 )}

 {resolvedSubtitle && (
 <p className="text-xs text-[#000000]/70 font-normal leading-snug mt-0.5 max-w-[185px]">
 {resolvedSubtitle}
 </p>
 )}
 </div>
 </div>

 {rightSlot ? (
 <div className="shrink-0 pt-0.5">{rightSlot}</div>
 ) : defaultAction ? (
 <div className="shrink-0 pt-0.5">
 {defaultAction.variant === 'cta' && defaultAction.target ? (
 <button
 type="button"
 onClick={() => navigateTo(defaultAction.target!)}
 className="px-3 py-1.5 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-[11px] font-bold whitespace-nowrap cursor-pointer hover:brightness-95"
 >
 {language === 'th' ? defaultAction.thLabel : defaultAction.enLabel}
 </button>
 ) : (
 <span
 className={`inline-block px-2.5 py-1 rounded-[1600px] text-[10px] font-bold whitespace-nowrap ${
 BADGE_TONES[defaultAction.badgeTone || 'soft']
 }`}
 >
 {language === 'th' ? defaultAction.thLabel : defaultAction.enLabel}
 </span>
 )}
 </div>
 ) : null}
 </div>
 </header>
 );
};

