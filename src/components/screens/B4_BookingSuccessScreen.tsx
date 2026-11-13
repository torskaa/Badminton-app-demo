import React from 'react';
import { CheckCircle2, Zap, Users, ArrowRight, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';

export const B4_BookingSuccessScreen: React.FC = () => {
 const { booking, selectedCourt, player, navigateTo } = useApp();

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000]  overflow-hidden">
 <MobileHeader />

 <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16">
 {/* Success Badge Header */}
 <div className="text-center pt-2">
 <div className="w-16 h-16 rounded-[1600px] bg-[#7cd7a0] text-[#000000] flex items-center justify-center mx-auto mb-2">
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
 <div className="space-y-2">
 <SectionHeader
 title="โบนัสความสำเร็จ · LOOT REWARD"
 subtitle="สะสมค่าประสบการณ์เพื่ออัปเลเวลนักกีฬา"
 badge={`Lv.${player.level} Smasher`}
 badgeVariant="dark"
 />

 <div className="p-4 rounded-[28px] bg-[#7cd7a0] text-[#000000]">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-11 h-11 rounded-[1600px] bg-[#000000] text-[#ffffff] flex items-center justify-center font-bold shrink-0">
 <Zap className="w-6 h-6 fill-current text-[#e85729]" />
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
 </div>

 {/* Digital E-Ticket Pass Container */}
 <div className="space-y-2">
 <SectionHeader
 title="บัตรผ่านดิจิทัล · COURT E-TICKET"
 subtitle="สแกน QR เพื่อเข้าคอร์ทอัตโนมัติ"
 badge="ยืนยันแล้ว"
 badgeVariant="green"
 />

 <div className="rounded-[32px] overflow-hidden bg-[#ffffff]">
 {/* Ticket Header */}
 <div className="p-4 bg-[#000000] text-[#ffffff] flex items-center justify-between gap-2">
 <div className="min-w-0">
 <span className="text-[10px] font-bold text-[#e85729] uppercase tracking-[0.032em] block mb-0.5">
 BWF TARAFLEX PASS · SMASH
 </span>
 <h3 className="font-['Antonio',sans-serif] text-2xl font-black tracking-tight leading-none text-[#ffffff] truncate">
 {selectedCourt.name}
 </h3>
 </div>
 <div className="px-3 py-1 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-xs font-black whitespace-nowrap shrink-0">
 COURT {booking.selectedCourtNumber || 3}
 </div>
 </div>

 {/* Ticket Details */}
 <div className="p-4 space-y-3">
 <div className="grid grid-cols-2 gap-2 text-xs">
 <div className="p-3 rounded-[20px] bg-[#f4f8fb]">
 <span className="text-[10px] text-[#000000]/60 font-bold uppercase block tracking-[0.032em]">วันและเวลาที่จอง</span>
 <span className="font-bold">{booking.date || '12 Nov 2026'} (19:00 - 21:00)</span>
 </div>
 <div className="p-3 rounded-[20px] bg-[#f4f8fb]">
 <span className="text-[10px] text-[#000000]/60 font-bold uppercase block tracking-[0.032em]">รหัสอ้างอิงบัตร</span>
 <span className="font-mono font-bold text-[#15803d]">{booking.bookingRef || 'BK-SMA-8921'}</span>
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
 </div>

 {/* Action Pathways Grid (Black fill and outlined black) */}
 <div className="space-y-2 pt-2">
 <button
 type="button"
 onClick={() => navigateTo('C1')}
 className="w-full py-4 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] whitespace-nowrap"
 >
 <Play className="w-4 h-4 fill-current shrink-0" />
 <span>ไปบันทึกแต้มสดในสนาม (C1)</span>
 </button>

 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => navigateTo('E2')}
 className="py-3 px-3 rounded-[1600px] text-xs font-bold tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
 >
 <Users className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
 <span>ชวนก๊วนหารบิล E2</span>
 </button>
 <button
 type="button"
 onClick={() => navigateTo('B1')}
 className="py-3 px-3 rounded-[1600px] text-xs font-bold tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
 >
 <span>กลับหน้าหลัก B1</span>
 <ArrowRight className="w-3.5 h-3.5 shrink-0" />
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};
