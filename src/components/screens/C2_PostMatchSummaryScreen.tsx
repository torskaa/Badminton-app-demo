import React from 'react';
import { Trophy, Flame, Zap, Award, BarChart3, Share2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const C2_PostMatchSummaryScreen: React.FC = () => {
 const { match, player, navigateTo, language } = useApp();
 const isWinner = match.winner === 'A' || match.scoreA >= match.scoreB;

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
 <MobileHeader
 title={language === 'th' ? 'สรุปผลการแข่งขัน' : 'Match Victory Summary'}
 showBack
 />

 <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
 {/* Victory Trophy Header */}
 <div className="text-center pt-1 rounded-[32px] p-5 bg-[#ffffff] space-y-2">
 <div className="flex items-center justify-between pb-2 ">
 <span className="px-2 py-0.2 rounded-[1600px] text-[9px] font-bold uppercase tracking-[0.032em] bg-[#ffd731] text-[#000000] ">
 {language === 'th' ? 'ผลการแข่งขัน' : 'MATCH OUTCOME'}
 </span>
 <span className="text-[10px] text-[#000000]/60 font-bold uppercase">
 {language === 'th' ? 'บันทึกสถิติเรียบร้อย' : 'Recorded'}
 </span>
 </div>

 <div className="w-16 h-16 rounded-[1600px] mx-auto mb-1 flex items-center justify-center bg-[#ffd731] text-[#000000]">
 <Trophy className="w-8 h-8 stroke-[2.3]" />
 </div>

 <span className="px-3 py-0.5 rounded-[1600px] text-[10px] font-bold tracking-[0.032em] uppercase bg-[#55db9c] text-[#000000] inline-block mb-1">
 {isWinner
 ? (language === 'th' ? 'ชัยชนะของแมตช์!' : 'MATCH VICTORY!')
 : (language === 'th' ? 'จบการแข่งขัน' : 'MATCH COMPLETED')}
 </span>
 <h2 className="font-['Antonio',sans-serif] text-3xl font-black tracking-tight uppercase leading-[0.85] text-[#000000]">
 {isWinner
 ? (language === 'th' ? 'ผู้ชนะแห่งสนาม' : 'CHAMPION OF THE COURT')
 : (language === 'th' ? 'เกมการแข่งขันยอดเยี่ยม' : 'GREAT MATCH EFFORT')}
 </h2>
 <p className="text-xs text-[#000000]/70 font-bold mt-1">
 {match.playerAName} vs {match.playerBName}
 </p>
 </div>

 {/* Final Sets Score Breakdown Card */}
 <div className="rounded-[32px] p-5 text-center bg-[#ffffff] space-y-3">
 <div className="flex items-center justify-between pb-2 ">
 <div className="flex items-center gap-1.5">
 <span className="px-2 py-0.2 rounded-[1600px] text-[9px] font-bold uppercase tracking-[0.032em] bg-[#dceeff] text-[#000000] ">
 {language === 'th' ? 'สรุปคะแนนเซ็ต' : 'SET BREAKDOWN'}
 </span>
 <span className="font-['Antonio',sans-serif] text-xs font-black uppercase tracking-wider text-[#000000]">
 {language === 'th' ? 'ผลการปะทะทั้ง 3 เซ็ต' : 'FINAL SETS BREAKDOWN'}
 </span>
 </div>
 <span className="text-[10px] text-[#000000]/60 font-bold">Best of 3</span>
 </div>

 <div className="flex items-center justify-center gap-8 py-1">
 <div className="text-center">
 <div className="text-xs font-bold text-[#000000]/70">{match.playerAName}</div>
 <div className="font-['Antonio',sans-serif] text-6xl font-black text-[#5c4ade] mt-1 leading-none">
 {match.setsWonA || 2}
 </div>
 </div>
 <div className="font-['Antonio',sans-serif] text-xl text-[#000000]/40 font-black uppercase">VS</div>
 <div className="text-center">
 <div className="text-xs font-bold text-[#000000]/70">{match.playerBName}</div>
 <div className="font-['Antonio',sans-serif] text-6xl font-black text-[#000000]/40 mt-1 leading-none">
 {match.setsWonB || 0}
 </div>
 </div>
 </div>
 </div>

 {/* EXP Reward Card */}
 <div className="rounded-[28px] p-4 space-y-3 bg-[#ffffff]">
 {/* Subheader */}
 <div className="flex items-center justify-between pb-2 ">
 <div>
 <div className="flex items-center gap-1.5 mb-0.5">
 <span className="px-2 py-0.2 rounded-[1600px] text-[9px] font-bold uppercase tracking-[0.032em] bg-[#ffd731] text-[#000000] ">
 {language === 'th' ? 'รางวัล & EXP' : 'REWARDS & EXP'}
 </span>
 <span className="font-['Antonio',sans-serif] text-xs font-black uppercase tracking-wider text-[#000000]">
 {language === 'th' ? 'สรุปแต้มค่าประสบการณ์ที่ได้รับ' : 'MATCH LOOT & EXP REWARDS'}
 </span>
 </div>
 <p className="text-[10px] text-[#000000]/60 font-bold">
 {language === 'th'
 ? 'โบนัสแข่งจบ โบนัสสตรีค 3 สัปดาห์ และแต้มตบ Smash สำเร็จ'
 : 'Completion bonus, 3-week active streak, and smash specialist rewards'}
 </p>
 </div>
 <span className="px-3 py-0.5 rounded-[1600px] bg-[#ffd731] text-[#000000] text-xs font-black tracking-[0.032em] shrink-0">
 +250 EXP Total
 </span>
 </div>

 <div className="space-y-1.5 text-xs">
 <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#ffffff]">
 <span className="font-bold text-[#000000]">
 {language === 'th' ? 'รางวัลการแข่งขันจบแมตช์' : 'Match Play Completion Reward'}
 </span>
 <span className="font-black text-[#5c4ade]">+150 EXP</span>
 </div>
 <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#ffffff]">
 <span className="flex items-center gap-1.5 font-bold text-[#000000]">
 <Flame className="w-3.5 h-3.5 text-[#ff5c34] fill-[#ff5c34]" />
 <span>
 {language === 'th' ? 'โบนัสสตรีค 3 สัปดาห์ (คูณ 1.5x)' : '3-Week Active Streak Bonus (1.5x)'}
 </span>
 </span>
 <span className="font-black text-[#ff5c34]">+75 EXP</span>
 </div>
 <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#ffffff]">
 <span className="font-bold text-[#000000]">
 {language === 'th' ? 'โบนัสคะแนนลูกตบพิฆาต' : 'Smash Winner Specialist Bonus'}
 </span>
 <span className="font-black text-[#55db9c]">+25 EXP</span>
 </div>
 </div>
 </div>

 {/* Next Actions */}
 <div className="space-y-2 pt-1">
 <button
 type="button"
 onClick={() => navigateTo('C3')}
 className="w-full py-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] whitespace-nowrap"
 >
 <BarChart3 className="w-4 h-4 shrink-0" />
 <span>{language === 'th' ? 'ดูฮีทแมพและวิเคราะห์ช็อต (C3)' : 'SHOT DIAGNOSTICS & HEATMAP (C3)'}</span>
 <ArrowRight className="w-4 h-4 shrink-0" />
 </button>

 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => navigateTo('C4')}
 className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
 >
 <Share2 className="w-3.5 h-3.5 text-[#5c4ade] shrink-0" />
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
 </div>
 );
};
