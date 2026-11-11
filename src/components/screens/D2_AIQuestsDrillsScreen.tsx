import React, { useState } from 'react';
import { Zap, CheckCircle2, Trophy, Dumbbell, Award, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const D2_AIQuestsDrillsScreen: React.FC = () => {
 const { quests, claimQuestReward, drills, completeDrill, language } = useApp();
 const [activeTab, setActiveTab] = useState<'quests' | 'drills'>('quests');

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000]  overflow-hidden">
 <MobileHeader
 title={language === 'th' ? 'ภารกิจและแบบฝึกซ้อม' : 'Daily Quests & Drills'}
 showBack
 />

 {/* Pill Segmented Tabs */}
 <div className="px-4 py-3 flex items-center gap-2 bg-[#ffffff] shrink-0">
 <button
 type="button"
 onClick={() => setActiveTab('quests')}
 className={`flex-1 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1.5 border border-[#000000] whitespace-nowrap ${
 activeTab === 'quests'
 ? 'bg-[#000000] text-[#ffffff]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 <Trophy className="w-3.5 h-3.5 shrink-0" />
 <span className="whitespace-nowrap">
 {language === 'th' ? `ภารกิจรายวัน (${quests.filter((q) => !q.claimed).length})` : `Daily Quests (${quests.filter((q) => !q.claimed).length})`}
 </span>
 </button>

 <button
 type="button"
 onClick={() => setActiveTab('drills')}
 className={`flex-1 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1.5 border border-[#000000] whitespace-nowrap ${
 activeTab === 'drills'
 ? 'bg-[#000000] text-[#ffffff]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 <Dumbbell className="w-3.5 h-3.5 shrink-0" />
 <span className="whitespace-nowrap">
 {language === 'th' ? `แบบฝึกซ้อม (${drills.length})` : `Practice Drills (${drills.length})`}
 </span>
 </button>
 </div>

 {/* Single Scroll Container */}
 <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
 {activeTab === 'quests' ? (
 <>
 {/* Quests Header Info */}
 <div className="rounded-[28px] p-4 flex items-center justify-between bg-[#ffffff]">
 <div>
 <div className="flex items-center gap-1.5 mb-1">
 <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#ffd731] inline-block text-[#000000]">
 {language === 'th' ? 'ภารกิจที่กำลังเปิด' : 'Active Quests'}
 </span>
 <span className="text-[10px] font-bold text-[#000000]/60 uppercase">
 {language === 'th' ? 'รีเซ็ตทุก 24 ชม.' : 'Resets in 24h'}
 </span>
 </div>
 <h3 className="font-['Antonio',sans-serif] text-xl font-black uppercase leading-tight text-[#000000]">
 {language === 'th' ? 'กระดานภารกิจสะสม EXP ประจำวัน' : 'DAILY MISSION BOARD'}
 </h3>
 <p className="text-xs text-[#000000]/70 font-bold mt-0.5">
 {language === 'th'
 ? 'ทำภารกิจรายวันเพื่อรับ EXP และปลดล็อกเหรียญตราเกียรติยศนักกีฬา'
 : 'Complete daily missions to earn EXP and unlock athlete badges.'}
 </p>
 </div>
 </div>

 {/* Quest Items */}
 <div className="space-y-2.5">
 {quests.map((quest) => {
 const isCompleted = quest.current >= quest.target;
 return (
 <div
 key={quest.id}
 className="rounded-[24px] p-4 space-y-3 bg-[#ffffff]"
 >
 <div className="flex items-start justify-between gap-2">
 <div className="flex items-center gap-3">
 <div className="w-11 h-11 rounded-[1600px] bg-[#ffd731] flex items-center justify-center text-xl shrink-0">
 {quest.icon || '🏸'}
 </div>
 <div>
 <h4 className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wide text-[#000000]">
 {language === 'th' ? quest.thaiTitle : quest.title}
 </h4>
 <p className="text-[11px] text-[#000000]/70 font-bold mt-0.5">
 {language === 'th' ? `เป้าหมาย: ${quest.target} ครั้ง` : `Target: ${quest.target} completions`}
 </p>

 </div>
 </div>

 <span className="px-2.5 py-1 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] shrink-0 bg-[#55db9c] text-[#000000]">
 +{quest.expReward} EXP
 </span>
 </div>

 {/* Progress Bar */}
 <div className="w-full bg-[#e9e9e9] rounded-[1600px] h-3 overflow-hidden p-0.5 ">
 <div
 className="bg-[#55db9c] h-full rounded-[1600px] transition-all duration-300"
 style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
 />
 </div>

 <div className="flex items-center justify-between text-xs pt-1">
 <span className="text-[11px] font-bold text-[#000000]/60">
 {quest.current} / {quest.target} {language === 'th' ? 'สำเร็จ' : 'done'}
 </span>

 {quest.claimed ? (
 <span className="flex items-center gap-1 text-[11px] font-bold text-[#55db9c]">
 <CheckCircle2 className="w-3.5 h-3.5" />
 <span>{language === 'th' ? 'รับแล้ว' : 'Claimed'}</span>
 </span>
 ) : isCompleted ? (
 <button
 type="button"
 onClick={() => claimQuestReward(quest.id)}
 className="px-4 py-1.5 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] bg-[#000000] text-[#ffffff] border border-[#000000] hover:bg-[#1a1a1a] transition-transform active:scale-95 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
 >
 {language === 'th' ? `รับ +${quest.expReward} EXP` : `CLAIM +${quest.expReward} EXP`}
 </button>
 ) : (
 <span className="text-[11px] font-bold text-[#000000]/50">
 {language === 'th' ? 'กำลังดำเนินการ' : 'In progress'}
 </span>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </>
 ) : (
 <>
 {/* Drills Section */}
 <div className="rounded-[28px] p-4 bg-[#ffffff]">
 <div className="flex items-center gap-1.5 mb-1">
 <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#e9ccff] inline-block text-[#000000]">
 {language === 'th' ? 'การฝึกซ้อมเชิงแท็กติก' : 'TACTICAL DRILLS'}
 </span>
 <span className="text-[10px] font-bold text-[#000000]/60 uppercase">
 {language === 'th' ? 'ออกแบบตามจุดอ่อน' : 'Weakness-Targeted'}
 </span>
 </div>
 <h3 className="font-['Antonio',sans-serif] text-xl font-black uppercase leading-tight text-[#000000]">
 {language === 'th' ? 'แบบฝึกซ้อมเฉพาะบุคคลเพื่อยกระดับทักษะ' : 'PERSONALIZED PRACTICE DRILLS'}
 </h3>
 <p className="text-xs text-[#000000]/70 font-bold mt-0.5">
 {language === 'th'
 ? 'แบบฝึกซ้อมเฉพาะบุคคลที่ออกแบบจากสถิติจุดอ่อนบนคอร์ท เพื่อพัฒนาเรดาร์ทักษะ 5 ด้าน'
 : 'Personalized drills tailored from in-match telemetry to level up your 5-axis skill radar.'}
 </p>
 </div>

 <div className="space-y-3">
 {drills.map((drill) => (
 <div
 key={drill.id}
 className="rounded-[24px] p-4 space-y-3 bg-[#ffffff]"
 >
 <div className="flex items-start justify-between">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <span className="px-2 py-0.5 rounded-[1600px] text-[9px] font-bold uppercase tracking-[0.032em] bg-[#ffd731] text-[#000000]">
 {drill.focusArea}
 </span>
 <span className="text-[11px] font-bold text-[#000000]/60">
 ⏱️ {drill.durationMin} {language === 'th' ? 'นาที' : 'mins'}
 </span>
 </div>
 <h4 className="font-['Antonio',sans-serif] text-base font-black uppercase text-[#000000]">
 {language === 'th' ? drill.thaiTitle : drill.title}
 </h4>
 <p className="text-xs text-[#000000]/70 mt-1 font-bold leading-relaxed">
 {drill.description}
 </p>
 </div>
 </div>

 <div className="flex items-center justify-between pt-2 ">
 <span className="text-xs font-black text-[#5c4ade]">
 +{drill.expReward} EXP
 </span>
 <button
 type="button"
 onClick={() => completeDrill(drill.id)}
 className="px-4 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] bg-[#000000] text-[#ffffff] border border-[#000000] hover:bg-[#1a1a1a] transition-transform active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
 >
 {drill.completed
 ? (language === 'th' ? 'สำเร็จแล้ว' : 'COMPLETED')
 : (language === 'th' ? 'เริ่มฝึกซ้อม' : 'START DRILL')}
 </button>
 </div>
 </div>
 ))}
 </div>
 </>
 )}
 </div>
 </div>
 );
};


