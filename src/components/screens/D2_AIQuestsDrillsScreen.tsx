/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Zap, CheckCircle2, Trophy, Play, Video, Clock, Dumbbell, Award, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { AIDrill } from '../../types';

export const D2_AIQuestsDrillsScreen: React.FC = () => {
  const { quests, claimQuestReward, drills, completeDrill, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'quests' | 'drills'>('quests');
  const [selectedDrill, setSelectedDrill] = useState<AIDrill | null>(drills[0]);

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title="AI Quests & Training Drills" showBack />

      {/* Filter Tabs */}
      <div className="px-4 py-2 flex items-center gap-2 bg-slate-900/60 border-b border-slate-800 shrink-0">
        <button
          onClick={() => setActiveTab('quests')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'quests'
              ? 'bg-lime-400 text-slate-950 shadow-[0_0_12px_rgba(204,255,0,0.3)]'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>ภารกิจรับ EXP (Quests)</span>
        </button>

        <button
          onClick={() => setActiveTab('drills')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'drills'
              ? 'bg-lime-400 text-slate-950 shadow-[0_0_12px_rgba(204,255,0,0.3)]'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>คลิปซ้อมเฉพาะจุด (Drills)</span>
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'quests' ? (
          <>
            {/* Quests Header Info */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-lime-950/40 via-slate-900 to-slate-900 border border-lime-400/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-lime-400 font-bold uppercase">
                  Quest Progression
                </span>
                <h3 className="text-xs font-bold text-white">
                  ทำภารกิจเพื่อเลเวลอัป & ปลดล็อกเหรียญ
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-lime-400 font-mono">
                  {quests.filter((q) => q.claimed).length} / {quests.length} เคลียร์แล้ว
                </span>
              </div>
            </div>

            {/* Quests List */}
            <div className="space-y-2.5">
              {quests.map((quest) => {
                const isReadyToClaim = quest.current >= quest.target && !quest.claimed;
                return (
                  <div
                    key={quest.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      quest.claimed
                        ? 'bg-slate-950/60 border-slate-900 opacity-60'
                        : isReadyToClaim
                        ? 'bg-gradient-to-r from-[#141e2a] to-slate-900 border-lime-400 shadow-md ring-1 ring-lime-400/40'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isReadyToClaim
                              ? 'bg-lime-400 text-slate-950 font-bold shadow-[0_0_8px_#ccff00]'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <Zap className="w-4 h-4 fill-current" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                              {quest.type === 'daily' ? 'รายวัน (Daily)' : 'รายสัปดาห์ (Weekly)'}
                            </span>
                          </div>
                          <h4 className="text-xs font-extrabold text-white">
                            {quest.thaiTitle}
                          </h4>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-lime-400 font-mono">
                          +{quest.expReward} EXP
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Claim Button */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>ความคืบหน้า</span>
                        <span>
                          {quest.current} / {quest.target}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isReadyToClaim
                              ? 'bg-lime-400 shadow-[0_0_8px_#ccff00]'
                              : 'bg-slate-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (quest.current / quest.target) * 100)}%`,
                          }}
                        />
                      </div>

                      {/* Claim Button */}
                      {isReadyToClaim && (
                        <button
                          onClick={() => claimQuestReward(quest.id)}
                          className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                          <span>กดรับรางวัล +{quest.expReward} EXP ทันที!</span>
                        </button>
                      )}

                      {quest.claimed && (
                        <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> รับรางวัลแล้ว
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Drills Tab */
          <div className="space-y-3">
            <div className="text-[11px] text-slate-300">
              AI Coach แนะนำแบบฝึกซ้อม 3 บทนี้ตามสถิติจุดอ่อนล่าสุดของคุณ:
            </div>

            {/* Drill Cards */}
            {drills.map((drill) => {
              const isSelected = selectedDrill?.id === drill.id;
              return (
                <div
                  key={drill.id}
                  onClick={() => setSelectedDrill(drill)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    drill.completed
                      ? 'bg-slate-950/70 border-slate-900 opacity-70'
                      : isSelected
                      ? 'bg-[#121929] border-lime-400 shadow-md ring-1 ring-lime-400/40'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-lime-400/20 text-lime-400 font-bold">
                          {drill.focusArea}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {drill.difficulty}
                        </span>
                        <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {drill.durationMin} นาที
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-white">
                        {drill.thaiTitle}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {drill.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-lime-400 font-mono">
                        +{drill.expReward} EXP
                      </span>
                    </div>
                  </div>

                  {/* Steps preview if selected */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                      <div className="text-[11px] font-bold text-white flex items-center gap-1">
                        <Play className="w-3 h-3 text-lime-400 fill-lime-400" />
                        <span>ลำดับการฝึกซ้อม 4 จังหวะ:</span>
                      </div>
                      <div className="space-y-1">
                        {drill.steps.map((st, i) => (
                          <div key={i} className="text-[10px] text-slate-300 flex items-start gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-slate-800 text-lime-400 font-mono flex items-center justify-center shrink-0 text-[8px] font-bold">
                              {i + 1}
                            </span>
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>

                      {!drill.completed ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            completeDrill(drill.id);
                          }}
                          className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          <span>ฝึกซ้อมเสร็จสิ้น & รับ +{drill.expReward} EXP</span>
                        </button>
                      ) : (
                        <div className="w-full mt-2 py-2 text-center text-xs font-bold text-emerald-400 bg-emerald-950/40 rounded-xl border border-emerald-500/30 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> ซ้อมสำเร็จแล้ว (ได้รับ EXP แล้ว)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Primary Action to Video Analysis */}
      <div className="px-4 pt-2 shrink-0">
        <button
          onClick={() => navigateTo('D3')}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Video className="w-4 h-4 text-cyan-400" />
          <span>ไปที่ระบบ AI Computer Vision วิเคราะห์วิดีโอคลิป</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
