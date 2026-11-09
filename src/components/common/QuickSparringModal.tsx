import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Swords, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickSparringModal: React.FC = () => {
 const { sparringModalPlayer, setSparringModalPlayer, navigateTo, gainExp } = useApp();

 if (!sparringModalPlayer) return null;

 const handleStartDuel = () => {
 gainExp(50, `ท้าดวลสปาร์ริงกับ ${sparringModalPlayer.name}`);
 setSparringModalPlayer(null);
 navigateTo('E3');
 };

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#000000]/60">
 <motion.div
 initial={{ opacity: 0, y: 100 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 100 }}
 transition={{ type: 'spring', damping: 25, stiffness: 300 }}
 className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 bg-[#ffffff] text-[#000000] shadow-2xl"
 >
 {/* Header */}
 <div className="flex items-center justify-between pb-4 ">
 <div className="flex items-center gap-2.5">
 <span className="w-9 h-9 rounded-[1600px] bg-[#ffd731] text-[#000000] flex items-center justify-center font-bold shadow-xs">
 <Swords className="w-4 h-4" />
 </span>
 <div>
 <h3 className="font-['Antonio',sans-serif] text-base font-black tracking-tight uppercase text-[#000000]">
 Quick Match Sparring
 </h3>
 <p className="text-[11px] text-[#000000]/60 font-bold">ค้นหาคู่ซ้อมตบแบดมินตันทันใจ</p>
 </div>
 </div>

 <button
 type="button"
 onClick={() => setSparringModalPlayer(null)}
 className="w-8 h-8 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] flex items-center justify-center hover:bg-[#e9e9e9] transition-transform active:scale-95 cursor-pointer shadow-xs"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Player Card Details */}
 <div className="py-4 space-y-3.5">
 <div className="flex items-center gap-3.5">
 <div
 className="w-14 h-14 rounded-[1600px] p-1 shrink-0 flex items-center justify-center text-2xl font-bold shadow-xs"
 style={{ backgroundColor: sparringModalPlayer.color || '#ffd731' }}
 >
 🏸
 </div>

 <div>
 <div className="flex items-center gap-2">
 <h4 className="font-['Antonio',sans-serif] text-lg font-black tracking-tight uppercase text-[#000000]">
 {sparringModalPlayer.name}
 </h4>
 <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold tracking-[0.032em] bg-[#000000] text-[#ffffff] shadow-xs">
 OVR {sparringModalPlayer.ovr || 84}
 </span>
 </div>
 <p className="text-xs text-[#000000]/70 font-bold mt-0.5">
 {sparringModalPlayer.role || 'Attacking Smash Specialist'} · {sparringModalPlayer.tier || 'Gold League'}
 </p>
 <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-[#000000]">
 <span className="w-2 h-2 rounded-full bg-[#55db9c] " />
 <span>{sparringModalPlayer.status || 'ว่างซ้อมเดี่ยว/คู่ ตอนนี้'}</span>
 </div>
 </div>
 </div>

 {/* Quick Stats Grid */}
 <div className="grid grid-cols-3 gap-2 text-center">
 <div className="p-3 rounded-[20px] bg-[#ffffff] shadow-xs">
 <span className="text-[10px] text-[#000000]/60 font-bold block uppercase tracking-[0.032em]">Win Rate</span>
 <span className="font-['Antonio',sans-serif] text-base font-black text-[#000000]">{sparringModalPlayer.winRate || 74}%</span>
 </div>
 <div className="p-3 rounded-[20px] bg-[#ffffff] shadow-xs">
 <span className="text-[10px] text-[#000000]/60 font-bold block uppercase tracking-[0.032em]">Smash Peak</span>
 <span className="font-['Antonio',sans-serif] text-base font-black text-[#000000]">342 km/h</span>
 </div>
 <div className="p-3 rounded-[20px] bg-[#ffffff] shadow-xs">
 <span className="text-[10px] text-[#000000]/60 font-bold block uppercase tracking-[0.032em]">Play Time</span>
 <span className="font-['Antonio',sans-serif] text-base font-black text-[#000000]">120+ hrs</span>
 </div>
 </div>

 {/* Preferred Arena */}
 <div className="p-3 rounded-[20px] bg-[#ffffff] flex items-center justify-between text-xs shadow-xs">
 <div className="flex items-center gap-2">
 <MapPin className="w-4 h-4 text-[#fb4903] shrink-0" />
 <span className="font-bold text-[#000000]">สนามประจำ: สแมช อารีน่า พระราม 9 (คอร์ท 3)</span>
 </div>
 <span className="text-[10px] text-[#000000] font-bold px-2 py-0.5 rounded-[1600px] bg-[#55db9c] shadow-xs">2.4 กม.</span>
 </div>
 </div>

 {/* Action Buttons (Outlined black and black-fill only) */}
 <div className="grid grid-cols-2 gap-2.5 pt-1">
 <button
 type="button"
 onClick={() => {
 setSparringModalPlayer(null);
 navigateTo('C1');
 }}
 className="py-3 px-3 rounded-[1600px] font-bold text-xs tracking-[0.032em] uppercase border border-[#000000] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] text-center cursor-pointer transition-colors whitespace-nowrap shrink-0"
 >
 LIVE SCORER (C1)
 </button>
 <button
 type="button"
 onClick={handleStartDuel}
 className="py-3 px-3 rounded-[1600px] font-bold text-xs tracking-[0.032em] uppercase bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
 >
 <Swords className="w-4 h-4 shrink-0" />
 <span className="whitespace-nowrap">DUEL IN E3 (+50 EXP)</span>
 </button>
 </div>
 </motion.div>
 </div>
 </AnimatePresence>
 );
};
