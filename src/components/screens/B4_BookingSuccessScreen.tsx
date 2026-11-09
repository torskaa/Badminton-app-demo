import React from 'react';
import { CheckCircle2, Zap, Users, ArrowRight, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const B4_BookingSuccessScreen: React.FC = () => {
 const { booking, selectedCourt, player, navigateTo } = useApp();

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
 <MobileHeader title="Court Pass Confirmed" />

 <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16">
 {/* Success Badge Header */}
 <div className="text-center pt-2">
 <div className="w-16 h-16 rounded-[1600px] bg-[#55db9c] text-[#000000] flex items-center justify-center mx-auto mb-2">
 <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
 </div>
 <span className="px-3 py-0.5 rounded-[1600px] bg-[#ffffff] text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
 บัตรเข้าคอร์ทสำเร็จ · RESERVATION CONFIRMED
 </span>
 <h2 className="font-['Antonio',sans-serif] text-3xl font-black tracking-tight leading-tight uppercase text-[#000000]">
 BOOKING CONFIRMED!
 </h2>
 <p className="text-xs text-[#000000]/70 font-medium max-w-xs mx-auto">
 บัตรเข้าคอร์ทดิจิทัลพร้อมใช้งานสำหรับการเช็คอินที่เคาน์เตอร์สนาม
 </p>
 </div>

 {/* EXP Reward Loot Card Container */}
 <div className="p-4 rounded-[28px] bg-[#ffd731] text-[#000000] space-y-2">
 <div className="flex items-center justify-between">
 <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[9px] font-black uppercase tracking-wider">
 โบนัสความสำเร็จ · LOOT REWARD
 </span>
 <span className="text-[10px] font-bold text-[#000000]/70">
 Lv.{player.level} Smasher
 </span>
 </div>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-11 h-11 rounded-[1600px] bg-[#000000] text-[#ffffff] flex items-center justify-center font-bold">
 <Zap className="w-6 h-6 fill-current text-[#ffd731]" />
 </div>
 <div>
 <div className="font-['Antonio',sans-serif] text-xl font-black tracking-tight uppercase text-[#000000]">
 +100 EXP CLAIMED!
 </div>
 <div className="text-xs text-[#000000]/80 font-bold mt-0.5">
 สะสม EXP เพื่อเลื่อนขั้นสู่ Diamond Tier ({player.currentExp} / {player.nextLevelExp} EXP)
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Digital E-Ticket Pass Container */}
 <div className="rounded-[32px] overflow-hidden bg-[#ffffff]">
 {/* Container Subheader */}
 <div className="px-4 pt-3 pb-2 bg-[#f8fafc] flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#dceeff] text-[9px] font-black uppercase tracking-wider text-[#000000]">
 บัตรผ่านดิจิทัล · COURT E-TICKET
 </span>
 </div>
 <span className="text-[10px] font-bold text-[#000000]/60">
 สถานะ: ยืนยันแล้ว
 </span>
 </div>

 {/* Ticket Header */}
 <div className="p-4 bg-[#000000] text-[#ffffff] flex items-center justify-between">
 <div>
 <span className="text-[10px] font-bold text-[#ffd731] uppercase tracking-[0.032em] block mb-0.5">
 BWF TARAFLEX PASS · SMASH
 </span>
 <h3 className="font-['Antonio',sans-serif] text-2xl font-black tracking-tight leading-none text-[#ffffff]">
 {selectedCourt.name}
 </h3>
 </div>
 <div className="px-3 py-1 rounded-[1600px] bg-[#55db9c] text-[#000000] text-xs font-black">
 COURT {booking.selectedCourtNumber || 3}
 </div>
 </div>

 {/* Ticket Details */}
 <div className="p-4 space-y-3">
 <div className="grid grid-cols-2 gap-2 text-xs">
 <div className="p-3 rounded-[20px] bg-[#dceeff]">
 <span className="text-[10px] text-[#000000]/60 font-bold uppercase block tracking-[0.032em]">วันและเวลาที่จอง</span>
 <span className="font-bold">{booking.date || '12 Nov 2026'} (19:00 - 21:00)</span>
 </div>
 <div className="p-3 rounded-[20px] bg-[#dceeff]">
 <span className="text-[10px] text-[#000000]/60 font-bold uppercase block tracking-[0.032em]">รหัสอ้างอิงบัตร</span>
 <span className="font-mono font-bold text-[#5c4ade]">{booking.bookingRef || 'BK-SMA-8921'}</span>
 </div>
 </div>

 {/* QR Code */}
 <div className="py-2 text-center">
 <div className="w-32 h-32 bg-[#ffffff] rounded-[20px] mx-auto p-2 flex items-center justify-center ">
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

 <rect x="36" y="10" width="8" height="8" fill="black" />
 <rect x="36" y="36" width="28" height="28" fill="black" />
 <rect x="42" y="42" width="16" height="16" fill="white" />
 <rect x="72" y="74" width="18" height="18" fill="black" />
 </svg>
 </div>
 <p className="text-[11px] text-[#000000]/60 mt-2 font-bold">
 สแกนที่จุด Check-in หน้าร้านเพื่อเปิดไฟคอร์ทอัตโนมัติ
 </p>
 </div>
 </div>
 </div>

 {/* Action Pathways Grid (Black fill and outlined black) */}
 <div className="space-y-2 pt-2">
 <button
 type="button"
 onClick={() => navigateTo('C1')}
 className="w-full py-4 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000]"
 >
 <Play className="w-4 h-4 fill-current" />
 <span>ไปบันทึกแต้มสดในสนาม (Courtside Live C1)</span>
 </button>

 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => navigateTo('E2')}
 className="py-3 px-3 rounded-[1600px] text-xs font-bold tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000]"
 >
 <Users className="w-3.5 h-3.5 text-[#5c4ade]" />
 <span>ชวนก๊วนหารบิล E2</span>
 </button>
 <button
 type="button"
 onClick={() => navigateTo('B1')}
 className="py-3 px-3 rounded-[1600px] text-xs font-bold tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000]"
 >
 <span>กลับหน้าหลัก B1</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};
