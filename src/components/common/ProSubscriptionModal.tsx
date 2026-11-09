import React, { useState } from 'react';
import { X, Check, Crown, Zap, Sparkles, ShieldCheck, ArrowRight, QrCode, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playLevelUpSound, playCoinSound } from '../../utils/retroAudio';

interface ProSubscriptionModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export const ProSubscriptionModal: React.FC<ProSubscriptionModalProps> = ({ isOpen, onClose }) => {
 const { player, updatePlayer, gainExp } = useApp();
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
 gainExp(300, 'สมัคร SmashAI Pro Member สำเร็จ!', 'Pro Athlete Status');
 }, 1200);
 };

 const perks = [
 {
 title: 'Unlimited CV Smash Radar Scan',
 desc: 'วัดความเร็วลูกตบแบบ Computer Vision 3D ไม่จำกัดจำนวนครั้ง',
 color: '#ffd731',
 },
 {
 title: 'ส่วนลดค่าคอร์ท 10% ทุกแมตช์',
 desc: 'ลดทันทีใน 48 สนามพันธมิตรทั่วกรุงเทพฯ และปริมณฑล',
 color: '#55db9c',
 },
 {
 title: 'แผนซ้อม AI Drill & Diagnostics',
 desc: 'วิเคราะห์ Heatmap จุดอ่อนหลังแข่ง พร้อมคอร์สซ้อมเฉพาะบุคคล',
 color: '#e9ccff',
 },
 {
 title: 'Gold Verified Pro Badge & Card',
 desc: 'การ์ดนักกีฬาบัตรทอง และตราสัญลักษณ์ Pro บนลีดเดอร์บอร์ด',
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
 SMASHAI PRO
 </span>
 <span className="text-[10px] font-bold tracking-[0.032em] uppercase text-[#000000]/60">
 MONETIZATION ENGINE
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
 WELCOME TO PRO!
 </div>
 <p className="text-xs text-[#000000]/80 font-bold max-w-[280px] mx-auto">
 คุณได้อัปเกรดเป็น <strong>SmashAI Pro Athlete</strong> เรียบร้อยแล้ว ได้รับโบนัส <strong>+300 EXP</strong> พร้อมส่วนลดคอร์ท 10% ทุกการจอง
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
 เริ่มใช้งานสิทธิพิเศษ PRO เลย
 </button>
 </div>
 </div>
 ) : (
 <>
 {/* Value Proposition Title */}
 <div className="mt-4">
 <h3 className="font-['Antonio',sans-serif] text-3xl font-black uppercase tracking-tight leading-[0.88] text-[#000000]">
 ปลดล็อกพลัง AI <br />
 <span className="text-[#5c4ade]">SMASHAI PRO ATHLETE</span>
 </h3>
 <p className="text-xs text-[#000000]/70 font-bold mt-2">
 ระบบสมาชิกสำหรับนักแบดมินตันยุคใหม่ ช่วยซ้อม พัฒนาฟอร์ม และลดค่าใช้จ่ายสนามจริง
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
 <span>รายปี (฿1,990/ปี)</span>
 <span className="text-[9px] text-[#55db9c] font-black">ประหยัด 17% (฿165/ด.)</span>
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
 <span>รายเดือน</span>
 <span className="text-[9px] text-[#000000]/60 font-bold">฿199 / เดือน</span>
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
 เลือกช่องทางชำระเงิน (Real In-App Payment Flow)
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
 <span>PromptPay QR</span>
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
 <span>Credit Card</span>
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
 <span className="whitespace-nowrap">PROCESSING PAYMENT...</span>
 ) : (
 <>
 <span className="whitespace-nowrap">CONFIRM PRO ({billingCycle === 'yearly' ? '฿1,990/YR' : '฿199/MO'})</span>
 <ArrowRight className="w-4 h-4 shrink-0" />
 </>
 )}
 </button>
 <p className="text-center text-[10px] text-[#000000]/50 font-bold mt-2">
 สามารถยกเลิกได้ทุกเมื่อผ่านหน้าการตั้งค่าบัญชี
 </p>
 </div>
 </>
 )}
 </div>
 </div>
 </div>
 );
};
