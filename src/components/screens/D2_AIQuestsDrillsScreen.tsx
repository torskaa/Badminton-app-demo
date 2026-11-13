import React, { useEffect, useState } from 'react';
import { Zap, CheckCircle2, Trophy, Dumbbell, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import {
 CACHE_KEYS,
 QuestsDrillsCacheData,
 formatCacheTimestamp,
 readCache,
 writeCache,
} from '../../utils/offlineCache';

export const D2_AIQuestsDrillsScreen: React.FC = () => {
 const { quests, claimQuestReward, drills, completeDrill, language, isOnline, hasPendingSync, lastSyncedAt } = useApp();
 const [activeTab, setActiveTab] = useState<'quests' | 'drills'>(() => {
 const cached = readCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS);
 return cached?.activeTab === 'drills' ? 'drills' : 'quests';
 });

 useEffect(() => {
 const existing = readCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS);
 writeCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS, {
 quests: existing?.quests ?? quests,
 drills: existing?.drills ?? drills,
 activeTab,
 lastSyncedAt: existing?.lastSyncedAt ?? Date.now(),
 pendingSync: existing?.pendingSync ?? !isOnline,
 });
 }, [activeTab, quests, drills, isOnline]);

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000]  overflow-hidden">
 <MobileHeader showBack />

 {/* Offline Cached Progress Notice */}
 {!isOnline && (
 <div className="px-4 pt-2.5 shrink-0">
 <div className="rounded-[18px] bg-[#ffffff] border border-[#000000] px-3 py-2 flex items-center justify-between gap-2 text-[10px] font-bold">
 <div className="flex items-center gap-1.5 min-w-0">
 <span className="w-5 h-5 rounded-[1600px] bg-[#e85729] text-[#ffffff] flex items-center justify-center shrink-0">
 <WifiOff className="w-3 h-3" />
 </span>
 <span className="truncate text-[#000000]">
 {language === 'th'
 ? `บันทึกความคืบหน้า EXP ในเครื่องอัตโนมัติ (แคช ${formatCacheTimestamp(lastSyncedAt, 'th')})`
 : `Quest EXP saved locally offline (Cached ${formatCacheTimestamp(lastSyncedAt, 'en')})`}
 </span>
 </div>
 {hasPendingSync && (
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#7cd7a0] text-[#000000] border border-[#000000] text-[9px] font-black shrink-0">
 {language === 'th' ? 'รอซิงค์' : 'Queued'}
 </span>
 )}
 </div>
 </div>
 )}

 {/* Pill Segmented Tabs */}
 <div data-filter="true" className="px-5 py-3 flex items-center gap-2 bg-[#ffffff] shrink-0">
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
 <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
 {activeTab === 'quests' ? (
 <>
 <SectionHeader
 title={language === 'th' ? 'ภารกิจสะสม EXP ประจำวัน' : 'DAILY MISSION BOARD'}
 subtitle={language === 'th'
 ? 'ทำภารกิจรายวันเพื่อรับ EXP และปลดล็อกเหรียญตรา'
 : 'Complete daily missions to earn EXP and badges'}
 badge={language === 'th' ? 'รีเซ็ต 24 ชม.' : 'RESETS 24H'}
 badgeVariant="green"
 />

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
 <div className="w-11 h-11 rounded-[1600px] bg-[#7cd7a0] flex items-center justify-center text-xl shrink-0">
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

 <span className="px-2.5 py-1 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] shrink-0 whitespace-nowrap bg-[#7cd7a0] text-[#000000]">
 +{quest.expReward} EXP
 </span>
 </div>

 {/* Progress Bar */}
 <div className="w-full bg-[#e9e9e9] rounded-[1600px] h-3 overflow-hidden p-0.5 ">
 <div
 className="bg-[#7cd7a0] h-full rounded-[1600px] transition-all duration-300"
 style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
 />
 </div>

 <div className="flex items-center justify-between text-xs pt-1">
 <span className="text-[11px] font-bold text-[#000000]/60">
 {quest.current} / {quest.target} {language === 'th' ? 'สำเร็จ' : 'done'}
 </span>

 {quest.claimed ? (
 <span className="flex items-center gap-1 text-[11px] font-bold text-[#7cd7a0]">
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
 <SectionHeader
 title={language === 'th' ? 'แบบฝึกซ้อมเฉพาะบุคคล' : 'PERSONALIZED PRACTICE DRILLS'}
 subtitle={language === 'th'
 ? 'ออกแบบตามจุดอ่อนบนคอร์ทเพื่ออัปเรดาร์ 5 ด้าน'
 : 'Tailored from telemetry to boost your 5-axis skill radar'}
 badge={language === 'th' ? 'สายแท็กติก' : 'TACTICAL'}
 badgeVariant="green"
 />

 <div className="space-y-3">
 {drills.map((drill) => (
 <div
 key={drill.id}
 className="rounded-[24px] p-4 space-y-3 bg-[#ffffff]"
 >
 <div className="flex items-start justify-between gap-2">
 <div className="min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <span className="text-[11px] font-bold text-[#000000]/60 whitespace-nowrap">
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
 <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#7cd7a0] text-[#000000] shrink-0 whitespace-nowrap">
 {drill.focusArea}
 </span>
 </div>

 <div className="flex items-center justify-between pt-2 ">
 <span className="text-xs font-black text-[#15803d]">
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


