import React from 'react';
import { Trophy, Flame, Zap, Award, BarChart3, Share2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';

export const C2_PostMatchSummaryScreen: React.FC = () => {
 const { match, player, navigateTo, language } = useApp();
 const isWinner = match.winner === 'A' || match.scoreA >= match.scoreB;

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000]  overflow-hidden">
 <MobileHeader showBack />

 <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
 {/* Victory Trophy Header */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'ผลการแข่งขัน' : 'MATCH OUTCOME'}
 subtitle={language === 'th' ? 'สรุปผู้ชนะและบันทึกสถิติแมตช์ล่าสุด' : 'Final match result and recorded score'}
 badge={language === 'th' ? 'บันทึกแล้ว' : 'RECORDED'}
 badgeVariant="green"
 />

 <div className="text-center rounded-[32px] p-5 bg-[#ffffff] space-y-2">

 <div className="w-16 h-16 rounded-[1600px] mx-auto mb-1 flex items-center justify-center bg-[#7cd7a0] text-[#000000]">
 <Trophy className="w-8 h-8 stroke-[2.3]" />
 </div>

 <span className="px-3 py-0.5 rounded-[1600px] text-[10px] font-bold tracking-[0.032em] uppercase bg-[#7cd7a0] text-[#000000] inline-block mb-1">
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
 </div>

 {/* Final Sets Score Breakdown Card */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'สรุปคะแนนเซ็ต' : 'FINAL SETS BREAKDOWN'}
 subtitle={language === 'th' ? 'ผลการปะทะทั้ง 3 เซ็ต' : 'Match score breakdown'}
 badge="Best of 3"
 badgeVariant="soft"
 />

 <div className="rounded-[32px] p-5 text-center bg-[#ffffff]">

 <div className="flex items-center justify-center gap-8 py-1">
 <div className="text-center">
 <div className="text-xs font-bold text-[#000000]/70">{match.playerAName}</div>
 <div className="font-['Antonio',sans-serif] text-6xl font-black text-[#15803d] mt-1 leading-none">
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
 </div>

 {/* EXP Reward Card */}
 <div className="space-y-2">
 <SectionHeader
 title={language === 'th' ? 'รางวัล & EXP ที่ได้รับ' : 'MATCH LOOT & EXP REWARDS'}
 subtitle={language === 'th'
 ? 'โบนัสแข่งจบ สตรีค 3 สัปดาห์ และแต้ม Smash'
 : 'Completion bonus, 3-week streak & smash rewards'}
 badge="+250 EXP"
 badgeVariant="green"
 />

 <div className="rounded-[28px] p-4 bg-[#ffffff]">

 <div className="space-y-1.5 text-xs">
 <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#ffffff]">
 <span className="font-bold text-[#000000]">
 {language === 'th' ? 'รางวัลการแข่งขันจบแมตช์' : 'Match Play Completion Reward'}
 </span>
 <span className="font-black text-[#15803d]">+150 EXP</span>
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
 <span className="font-black text-[#7cd7a0]">+25 EXP</span>
 </div>
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
 <Share2 className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
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
