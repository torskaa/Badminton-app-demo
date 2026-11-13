import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Zap, Copy, Clock, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';

export const B3_CheckoutPaymentScreen: React.FC = () => {
 const { booking, selectedCourt, gainExp, navigateTo, language } = useApp();

 const [isVerifying, setIsVerifying] = useState(false);
 const [verificationDone, setVerificationDone] = useState(false);
 const [copiedPromptPay, setCopiedPromptPay] = useState(false);

 const promptPayNumber = '089-921-4820';
 const totalAmount = booking.totalAmount || 560;

 const handleCopyPromptPay = () => {
 navigator.clipboard?.writeText(promptPayNumber.replace(/-/g, ''));
 setCopiedPromptPay(true);
 setTimeout(() => setCopiedPromptPay(false), 2000);
 };

 const handleSimulateSlipUpload = () => {
 setIsVerifying(true);
 setTimeout(() => {
 setIsVerifying(false);
 setVerificationDone(true);
 }, 800);
 };

 const handleConfirmAndComplete = () => {
 gainExp(100, language === 'th' ? `จองสนาม ${selectedCourt.name} สำเร็จ` : `Booked ${selectedCourt.name}`, 'Early Bird Shuttler');
 navigateTo('B4');
 };

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000]  overflow-hidden">
 <MobileHeader showBack />

 <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-12">
 {/* Booking Summary Card */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'รายละเอียดคอร์ท & วันเวลา' : 'COURT PASS DETAILS'}
 subtitle={language === 'th' ? 'ตรวจสอบสนาม วันที่ และหมายเลขคอร์ท' : 'Verify facility, date, and court number'}
 badge="Step 2/2"
 badgeVariant="soft"
 />

 <div className="rounded-[28px] p-4 space-y-3 bg-[#ffffff]">

 <div className="flex items-start justify-between">
 <div>
 <h3 className="font-['Antonio',sans-serif] text-xl font-black tracking-tight leading-tight uppercase text-[#000000]">
 {selectedCourt.name}
 </h3>
 <p className="text-xs text-[#000000]/70 font-medium mt-0.5">
 {language === 'th' ? `คอร์ท ${booking.selectedCourtNumber || 3}` : `Court ${booking.selectedCourtNumber || 3}`} · {booking.date || '12 Nov 2026'}
 </p>
 </div>

 <div className="text-right">
 <span className="text-[10px] font-bold text-[#000000]/60 uppercase block tracking-[0.032em]">
 {language === 'th' ? 'ยอดชำระสุทธิ' : 'Net Total'}
 </span>
 <div className="font-['Antonio',sans-serif] text-3xl font-black text-[#000000]">
 ฿{totalAmount}
 </div>
 </div>
 </div>

 <div className="p-3 rounded-[20px] bg-[#7cd7a0] text-xs font-bold text-[#000000] flex items-center justify-between">
 <span className="flex items-center gap-1.5">
 <Zap className="w-4 h-4 fill-current text-[#000000]" />
 <span>{language === 'th' ? 'รับโบนัส EXP เมื่อชำระเงิน' : 'Loot Drop Reward on Payment'}</span>
 </span>
 <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[10px] font-bold tracking-[0.032em] whitespace-nowrap shrink-0">
 +100 EXP
 </span>
 </div>
 </div>
 </div>

 {/* PromptPay QR Code Card */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'คิวอาร์โค้ดพร้อมเพย์' : 'THAI QR PAYMENT'}
 subtitle={language === 'th' ? 'สแกนด้วยแอปธนาคารทุกแห่งในไทย' : 'Scan via any Thai mobile banking app'}
 rightSlot={
 <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[1600px] bg-[#e85729] text-[#ffffff] text-[10px] font-bold whitespace-nowrap shrink-0">
 <Clock className="w-3 h-3" />
 <span>10:00</span>
 </span>
 }
 />

 <div className="rounded-[28px] p-5 text-center space-y-3.5 bg-[#ffffff] text-[#000000]">

 {/* QR Box */}
 <div className="w-44 h-44 bg-[#ffffff] rounded-[24px] mx-auto p-3 flex flex-col items-center justify-center">
 <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
 <rect x="0" y="0" width="30" height="30" fill="black" />
 <rect x="5" y="5" width="20" height="20" fill="white" />
 <rect x="10" y="10" width="10" height="10" fill="black" />

 <rect x="70" y="0" width="30" height="30" fill="black" />
 <rect x="75" y="5" width="20" height="20" fill="white" />
 <rect x="80" y="10" width="10" height="10" fill="black" />

 <rect x="0" y="70" width="30" height="30" fill="black" />
 <rect x="5" y="75" width="20" height="20" fill="white" />
 <rect x="10" y="80" width="10" height="10" fill="black" />

 <rect x="35" y="10" width="10" height="10" fill="black" />
 <rect x="50" y="10" width="10" height="10" fill="black" />
 <rect x="35" y="35" width="15" height="15" fill="black" />
 <rect x="55" y="35" width="10" height="20" fill="black" />
 <rect x="70" y="45" width="20" height="10" fill="black" />
 <rect x="35" y="65" width="20" height="10" fill="black" />
 <rect x="65" y="65" width="15" height="20" fill="black" />
 <rect x="45" y="80" width="15" height="10" fill="black" />
 </svg>
 </div>

 <div className="text-xs">
 <span className="text-[#000000]/60 block text-[11px] font-bold">
 {language === 'th' ? 'หมายเลขพร้อมเพย์ทางการ' : 'Official PromptPay ID'}
 </span>
 <div className="flex items-center justify-center gap-2 mt-1">
 <span className="font-mono font-bold text-sm tracking-widest">{promptPayNumber}</span>
 <button
 type="button"
 onClick={handleCopyPromptPay}
 className="p-1.5 rounded-[1600px] border border-[#000000] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] transition-colors cursor-pointer"
 title={language === 'th' ? 'คัดลอกเบอร์พร้อมเพย์' : 'Copy PromptPay Number'}
 >
 {copiedPromptPay ? <Check className="w-3.5 h-3.5 text-[#7cd7a0]" /> : <Copy className="w-3.5 h-3.5" />}
 </button>
 </div>
 {copiedPromptPay && (
 <span className="text-[10px] text-[#000000] font-bold">
 {language === 'th' ? 'คัดลอกเบอร์สำเร็จ!' : 'Copied successfully!'}
 </span>
 )}
 </div>
 </div>
 </div>

 {/* Upload Bank Slip Box */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'อัปโหลดสลิปโอนเงิน' : 'UPLOAD TRANSFER SLIP'}
 subtitle={language === 'th' ? 'ตรวจสอบความถูกต้องและออกบัตรเข้าสนาม' : 'Verify slip to unlock your digital court pass'}
 badge={language === 'th' ? 'ตรวจทันที' : 'INSTANT'}
 badgeVariant="green"
 />

 <div className="rounded-[28px] p-4 bg-[#ffffff]">
 <div
 onClick={handleSimulateSlipUpload}
 className={`border border-dashed rounded-[20px] p-4 text-center cursor-pointer transition-all ${
 verificationDone
 ? 'border-[#000000] bg-[#7cd7a0]'
 : 'border-[#000000] hover:bg-[#e9e9e9] bg-[#ffffff]'
 }`}
 >
 {isVerifying ? (
 <div className="flex flex-col items-center gap-2 py-2">
 <div className="w-6 h-6 border-2 border-[#000000] border-t-transparent rounded-full animate-spin" />
 <span className="text-xs font-bold text-[#000000]">
 {language === 'th' ? 'กำลังตรวจสอบความถูกต้องของสลิป...' : 'Verifying transfer slip...'}
 </span>
 </div>
 ) : verificationDone ? (
 <div className="flex items-center justify-center gap-2 py-1 text-[#000000]">
 <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
 <span className="text-xs font-bold tracking-[0.032em]">
 {language === 'th' ? 'สลิปถูกต้องเรียบร้อย ยืนยันแล้ว' : 'Slip Verified Successfully'}
 </span>
 </div>
 ) : (
 <div className="flex flex-col items-center gap-1.5 py-1">
 <UploadCloud className="w-6 h-6 text-[#000000]" />
 <span className="text-xs font-bold text-[#000000]">
 {language === 'th' ? 'คลิกเพื่ออัปโหลดสลิปธนาคาร' : 'Click to Upload Bank Slip'}
 </span>
 <span className="text-[10px] text-[#000000]/60 font-bold">
 {language === 'th' ? 'รองรับ K PLUS, SCB Easy, Krungthai NEXT' : 'Supports all major Thai banking apps'}
 </span>
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Confirm Payment CTA */}
 <button
 type="button"
 onClick={handleConfirmAndComplete}
 className="w-full py-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] whitespace-nowrap"
 >
 <span className="whitespace-nowrap">
 {language === 'th' ? 'ยืนยันและรับบัตรเข้าคอร์ท' : 'CONFIRM & GET COURT PASS'}
 </span>
 </button>
 </div>
 </div>
 );
};

