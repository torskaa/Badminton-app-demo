import React, { useState } from 'react';
import { X, Check, Crown, Zap, Sparkles, ShieldCheck, ArrowRight, QrCode, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playLevelUpSound, playCoinSound } from '../../utils/retroAudio';

interface ProSubscriptionModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export const ProSubscriptionModal: React.FC<ProSubscriptionModalProps> = ({ isOpen, onClose }) => {
 const { updatePlayer, gainExp, language } = useApp();
 const isThai = language === 'th';
 const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
 const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'card'>('promptpay');
 const [isProcessing, setIsProcessing] = useState(false);
 const [isSuccess, setIsSuccess] = useState(false);

 if (!isOpen) return null;

 const handleSubscribe = () => {
 setIsProcessing(true);
 setTimeout(() => {
 setIsProcessing(false);
 setIsSuccess(true);
 playLevelUpSound();
 updatePlayer({
 tier: 'Pro',
 });
 gainExp(
 300,
 isThai ? 'อัปเกรดสมาชิกโปรสำเร็จ!' : 'Upgraded to Smash Pro!',
 isThai ? 'นักกีฬาระดับโปร' : 'Pro Athlete Status'
 );
 }, 1200);
 };

 const perks = [
 {
 title: isThai ? 'วัดความเร็วลูกตบไม่จำกัด' : 'Unlimited Smash Speed Scan',
 desc: isThai ? 'ตรวจจับสปีดลูกตบด้วยกล้องอัจฉริยะไม่จำกัดครั้ง' : 'Computer Vision smash velocity analysis without limits',
 color: '#ffd731',
 },
 {
 title: isThai ? 'ส่วนลดค่าคอร์ท 10% ทุกแมตช์' : '10% Off Every Court Booking',
 desc: isThai ? 'ลดทันทีในสนามพันธมิตรทั่วกรุงเทพฯ และปริมณฑล' : 'Instant discount across 48 partner arenas',
 color: '#55db9c',
 },
 {
 title: isThai ? 'แผนฝึกเจาะจงจุดอ่อน' : 'Personalized AI Drills & Diagnostics',
 desc: isThai ? 'วิเคราะห์โซนเสียแต้มหลังแข่งพร้อมคอร์สแก้ทาง' : 'Post-match weakness heatmap & targeted training plans',
 color: '#e9ccff',
 },
 {
 title: isThai ? 'การ์ดนักกีฬาและตราระดับโปร' : 'Gold Verified Pro Badge & Card',
 desc: isThai ? 'การ์ดนักกีฬาบัตรทองและตราสัญลักษณ์บนอันดับก๊วน' : 'Exclusive gold athlete card & leaderboard badge',
 color: '#4da2ff',
 },
 ];

 return (
 <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#000000]/60 p-0 sm:p-4 animate-in fade-in duration-200">
 <div className="w-full max-w-[420px] max-h-[92vh] overflow-y-auto no-scrollbar bg-[#ffffff] shadow-2xl rounded-t-[36px] sm:rounded-[36px] p-5 text-[#000000] flex flex-col justify-between">
 {/* Header & Close */}
 <div>
 <div className="flex items-center justify-between pb-3 ">
 <div className="flex items-center gap-2">
 <span className="px-3 py-1 rounded-[1600px] bg-[#ffd731] text-[#000000] font-['Antonio',sans-serif] text-xs font-black tracking-[0.032em] uppercase flex items-center gap-1.5 shadow-xs">
 <Crown className="w-3.5 h-3.5 fill-[#000000]" />
 {isThai ? 'สมาชิกโปร' : 'SMASH PRO'}
 </span>
 <span className="text-[10px] font-bold tracking-[0.032em] uppercase text-[#000000]/60">
 {isThai ? 'สิทธิพิเศษรายสมาชิก' : 'PRO MEMBERSHIP'}
 </span>
 </div>
 <button
 type="button"
 onClick={onClose}
 className="w-8 h-8 rounded-[1600px] bg-[#cccccc] border border-[#000000] flex items-center justify-center hover:bg-[#ff5c34] hover:text-[#ffffff] transition-colors cursor-pointer shadow-xs"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {isSuccess ? (
 <div className="py-8 text-center space-y-4">
 <div className="w-20 h-20 mx-auto rounded-[1600px] bg-[#55db9c] flex items-center justify-center shadow-md">
 <Crown className="w-10 h-10 text-[#000000]" />
 </div>
 <div className="font-['Antonio',sans-serif] text-3xl font-black uppercase tracking-tight text-[#000000]">
 {isThai ? 'ยินดีต้อนรับสู่ระดับโปร!' : 'WELCOME TO PRO!'}
 </div>
 <p className="text-xs text-[#000000]/80 font-bold max-w-[280px] mx-auto">
 {isThai
 ? 'อัปเกรดเป็นสมาชิกโปรเรียบร้อย รับโบนัส +300 คะแนน พร้อมส่วนลดค่าคอร์ท 10%'
 : 'Upgraded to Pro Athlete! You earned +300 XP bonus and 10% off all courts.'}
 </p>
 <div className="pt-4">
 <button
 type="button"
 onClick={() => {
 setIsSuccess(false);
 onClose();
 }}
 className="w-full py-3.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] font-bold text-xs uppercase tracking-[0.032em] hover:bg-[#1a1a1a] transition-all cursor-pointer shadow-sm"
 >
 {isThai ? 'เริ่มใช้งานสิทธิพิเศษเลย' : 'START USING PRO PERKS'}
 </button>
 </div>
 </div>
 ) : (
 <>
 {/* Value Proposition Title */}
 <div className="mt-4">
 <h3 className="font-['Antonio',sans-serif] text-3xl font-black uppercase tracking-tight leading-[0.92] text-[#000000]">
 {isThai ? (
 <>
 ปลดล็อกฟีเจอร์พิเศษ <br />
 <span className="text-[#5c4ade]">สมาชิกระดับโปร</span>
 </>
 ) : (
 <>
 UNLOCK PRO POWER <br />
 <span className="text-[#5c4ade]">PRO ATHLETE</span>
 </>
 )}
 </h3>
 <p className="text-xs text-[#000000]/70 font-bold mt-2">
 {isThai
 ? 'ตัวช่วยวิเคราะห์ฟอร์มการเล่นและรับส่วนลดสนามจริงทุกแมตช์'
 : 'Train smarter with full analytics and instant court booking discounts.'}
 </p>
 </div>

 {/* Billing Cycle Selector */}
 <div className="grid grid-cols-2 gap-2 mt-4 p-1.5 rounded-[1600px] bg-[#dceeff] shadow-xs">
 <button
 type="button"
 onClick={() => {
 setBillingCycle('yearly');
 playCoinSound();
 }}
 className={`py-2 px-3 rounded-[1600px] text-xs font-bold tracking-[0.032em] uppercase transition-all cursor-pointer flex flex-col items-center ${
 billingCycle === 'yearly'
 ? 'bg-[#000000] text-[#ffffff] border border-[#000000] shadow-xs'
 : 'text-[#000000] hover:bg-[#ffffff]/60'
 }`}
 >
 <span>{isThai ? 'รายปี (฿1,990/ปี)' : 'Annual (฿1,990/yr)'}</span>
 <span className="text-[9px] text-[#55db9c] font-black">
 {isThai ? 'ประหยัด 17% (฿165/ด.)' : 'Save 17% (฿165/mo)'}
 </span>
 </button>

 <button
 type="button"
 onClick={() => {
 setBillingCycle('monthly');
 playCoinSound();
 }}
 className={`py-2 px-3 rounded-[1600px] text-xs font-bold tracking-[0.032em] uppercase transition-all cursor-pointer flex flex-col items-center justify-center ${
 billingCycle === 'monthly'
 ? 'bg-[#000000] text-[#ffffff] border border-[#000000] shadow-xs'
 : 'text-[#000000] hover:bg-[#ffffff]/60'
 }`}
 >
 <span>{isThai ? 'รายเดือน' : 'Monthly'}</span>
 <span className="text-[9px] text-[#000000]/60 font-bold">
 {isThai ? '฿199 / เดือน' : '฿199 / month'}
 </span>
 </button>
 </div>

 {/* Perks List */}
 <div className="mt-4 space-y-2">
 {perks.map((p, idx) => (
 <div
 key={idx}
 className="p-3 rounded-[20px] bg-[#ffffff] shadow-xs flex items-start gap-2.5"
 >
 <div
 className="w-6 h-6 rounded-[1600px] flex items-center justify-center text-[#000000] shrink-0 text-xs font-black mt-0.5 shadow-xs"
 style={{ backgroundColor: p.color }}
 >
 <Check className="w-3.5 h-3.5" />
 </div>
 <div>
 <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wide text-[#000000]">
 {p.title}
 </div>
 <div className="text-[11px] text-[#000000]/70 font-medium leading-snug">
 {p.desc}
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Payment Method Selector */}
 <div className="mt-4 pt-3 ">
 <div className="text-[10px] font-bold uppercase tracking-[0.032em] text-[#000000]/60 mb-2">
 {isThai ? 'เลือกช่องทางชำระเงิน' : 'Payment Method'}
 </div>
 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => setPaymentMethod('promptpay')}
 className={`p-2.5 rounded-[1600px] border border-[#000000] flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.032em] cursor-pointer shadow-xs ${
 paymentMethod === 'promptpay'
 ? 'bg-[#55db9c] text-[#000000]'
 : 'bg-[#ffffff] text-[#000000]'
 }`}
 >
 <QrCode className="w-4 h-4" />
 <span>{isThai ? 'พร้อมเพย์' : 'PromptPay QR'}</span>
 </button>
 <button
 type="button"
 onClick={() => setPaymentMethod('card')}
 className={`p-2.5 rounded-[1600px] border border-[#000000] flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.032em] cursor-pointer shadow-xs ${
 paymentMethod === 'card'
 ? 'bg-[#55db9c] text-[#000000]'
 : 'bg-[#ffffff] text-[#000000]'
 }`}
 >
 <CreditCard className="w-4 h-4" />
 <span>{isThai ? 'บัตรเครดิต' : 'Credit Card'}</span>
 </button>
 </div>
 </div>

 {/* Action Button (CTA maintains solid black border) */}
 <div className="mt-5 pt-3 ">
 <button
 type="button"
 onClick={handleSubscribe}
 disabled={isProcessing}
 className="w-full py-3.5 px-4 rounded-[1600px] bg-[#000000] text-[#ffffff] border-2 border-[#000000] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 hover:bg-[#1a1a1a] transition-all cursor-pointer active:scale-95 disabled:opacity-50 whitespace-nowrap shadow-sm"
 >
 {isProcessing ? (
 <span className="whitespace-nowrap">{isThai ? 'กำลังดำเนินการ...' : 'PROCESSING PAYMENT...'}</span>
 ) : (
 <>
 <span className="whitespace-nowrap">
 {isThai
 ? `ยืนยันสมัครโปร (${billingCycle === 'yearly' ? '฿1,990/ปี' : '฿199/ด.'})`
 : `CONFIRM PRO (${billingCycle === 'yearly' ? '฿1,990/YR' : '฿199/MO'})`}
 </span>
 <ArrowRight className="w-4 h-4 shrink-0" />
 </>
 )}
 </button>
 <p className="text-center text-[10px] text-[#000000]/50 font-bold mt-2">
 {isThai ? 'ยกเลิกได้ทุกเมื่อผ่านหน้าการตั้งค่า' : 'Cancel anytime in app settings.'}
 </p>
 </div>
 </>
 )}
 </div>
 </div>
 </div>
 );
};
