import React, { useState } from 'react';
import { Zap, CheckCircle2, Trophy, Dumbbell, Award, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const D2_AIQuestsDrillsScreen: React.FC = () => {
  const { quests, claimQuestReward, drills, completeDrill, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'quests' | 'drills'>('quests');

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      <MobileHeader title="Daily Quests & Drills" showBack />

      {/* Pill Segmented Tabs (Paper White with 1px black outline) */}
      <div className="px-5 py-3 flex items-center gap-2 border-b border-[#000000] bg-[#ffffff] shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('quests')}
          className={`flex-1 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1.5 border border-[#000000] ${
            activeTab === 'quests'
              ? 'bg-[#000000] text-[#ffffff]'
              : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Daily Quests ({quests.filter((q) => !q.claimed).length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('drills')}
          className={`flex-1 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1.5 border border-[#000000] ${
            activeTab === 'drills'
              ? 'bg-[#000000] text-[#ffffff]'
              : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>AI Drills ({drills.length})</span>
        </button>
      </div>

      {/* Single Scroll Container with min-h-0 */}
      <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
        {activeTab === 'quests' ? (
          <>
            {/* Quests Header Info */}
            <div className="border border-[#000000] rounded-[28px] p-4 flex items-center justify-between bg-[#ffffff]">
              <div>
                <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#ffd731] border border-[#000000] inline-block mb-1 text-[#000000]">
                  Active Quests
                </span>
                <h3 className="font-['Antonio',sans-serif] text-xl font-black uppercase leading-tight text-[#000000]">
                  DAILY MISSION BOARD
                </h3>
                <p className="text-xs text-[#000000]/70 font-medium mt-0.5">
                  ทำภารกิจรายวันเพื่อรับ EXP และปลดล็อกเหรียญตราเกียรติยศ
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
                    className="border border-[#000000] rounded-[24px] p-4 space-y-3 bg-[#ffffff]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-[1600px] bg-[#ffd731] border border-[#000000] flex items-center justify-center text-xl shrink-0">
                          {quest.icon || '🏸'}
                        </div>
                        <div>
                          <h4 className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wide text-[#000000]">
                            {quest.title}
                          </h4>
                          <p className="text-[11px] text-[#000000]/70 font-medium mt-0.5">
                            {quest.thaiTitle}
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] shrink-0 bg-[#55db9c] border border-[#000000] text-[#000000]">
                        +{quest.expReward} EXP
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#e9e9e9] rounded-[1600px] h-3 overflow-hidden p-0.5 border border-[#000000]">
                      <div
                        className="bg-[#55db9c] h-full rounded-[1600px] transition-all duration-300"
                        style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] font-bold text-[#000000]/60">
                        {quest.current} / {quest.target} สำเร็จ
                      </span>

                      {quest.claimed ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#55db9c]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>รับแล้ว</span>
                        </span>
                      ) : isCompleted ? (
                        <button
                          type="button"
                          onClick={() => claimQuestReward(quest.id)}
                          className="px-4 py-1.5 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] bg-[#000000] text-[#ffffff] border border-[#000000] hover:bg-[#1a1a1a] transition-transform active:scale-95 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                        >
                          CLAIM +{quest.expReward} EXP
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-[#000000]/50">กำลังดำเนินการ</span>
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
            <div className="border border-[#000000] rounded-[28px] p-4 bg-[#ffffff]">
              <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#e9ccff] border border-[#000000] inline-block mb-1 text-[#000000]">
                AI Tactical Drills
              </span>
              <h3 className="font-['Antonio',sans-serif] text-xl font-black uppercase leading-tight text-[#000000]">
                RECOMMENDED PRACTICE DRILLS
              </h3>
              <p className="text-xs text-[#000000]/70 font-medium mt-0.5">
                แบบฝึกซ้อมเฉพาะบุคคลที่ AI ออกแบบจากข้อมูลจุดอ่อนบนคอร์ท
              </p>
            </div>

            <div className="space-y-3">
              {drills.map((drill) => (
                <div
                  key={drill.id}
                  className="border border-[#000000] rounded-[24px] p-4 space-y-3 bg-[#ffffff]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-[1600px] text-[9px] font-bold uppercase tracking-[0.032em] bg-[#ffd731] border border-[#000000] text-[#000000]">
                          {drill.focusArea}
                        </span>
                        <span className="text-[11px] font-bold text-[#000000]/60">
                          ⏱️ {drill.durationMin} นาที
                        </span>
                      </div>
                      <h4 className="font-['Antonio',sans-serif] text-base font-black uppercase text-[#000000]">
                        {drill.title}
                      </h4>
                      <p className="text-xs text-[#000000]/70 mt-1 font-medium leading-relaxed">
                        {drill.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#000000]/20">
                    <span className="text-xs font-black text-[#5c4ade]">
                      +{drill.expReward} EXP
                    </span>
                    <button
                      type="button"
                      onClick={() => completeDrill(drill.id)}
                      className="px-4 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] bg-[#000000] text-[#ffffff] border border-[#000000] hover:bg-[#1a1a1a] transition-transform active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {drill.completed ? 'COMPLETED (REPEAT)' : 'START DRILL'}
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
