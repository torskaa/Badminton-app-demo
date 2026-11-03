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
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title="AI Quests & Training Drills" showBack />

      {/* Modern Filter Segmented Tabs */}
      <div className="px-5 py-3 flex items-center gap-2 bg-white border-b border-neutral-200/80 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('quests')}
          className={`flex-1 py-2 rounded-full text-xs font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'quests'
              ? 'bg-[#111318] text-white shadow-xs'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>ภารกิจรับ EXP (Quests)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('drills')}
          className={`flex-1 py-2 rounded-full text-xs font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'drills'
              ? 'bg-[#111318] text-white shadow-xs'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
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
            <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#0066ff] uppercase tracking-wider block">
                  Quest Progression
                </span>
                <h3 className="text-xs font-extrabold text-neutral-900 mt-0.5">
                  ทำภารกิจเพื่อเลเวลอัป & ปลดล็อกเหรียญ
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#d8ff00] text-black text-[10px] font-black">
                DAILY & WEEKLY
              </span>
            </div>

            {/* Quests List */}
            <div className="space-y-3">
              {quests.map((q) => {
                const isComplete = q.current >= q.target;
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-neutral-900">
                            {q.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                            +{q.expReward} EXP
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {q.thaiTitle}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 font-bold">
                        <span>ความคืบหน้า</span>
                        <span className="font-mono">
                          {q.current} / {q.target}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#d8ff00] to-[#10b981] rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (q.current / q.target) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400 font-medium">
                        หมวดหมู่: {q.type}
                      </span>
                      {q.claimed ? (
                        <span className="text-[11px] text-neutral-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> รับรางวัลแล้ว
                        </span>
                      ) : isComplete ? (
                        <button
                          type="button"
                          onClick={() => claimQuestReward(q.id)}
                          className="px-4 py-1.5 rounded-full bg-[#d8ff00] hover:bg-[#cbf000] text-black text-xs font-black shadow-xs cursor-pointer transition-all"
                        >
                          กดรับ +{q.expReward} EXP!
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 font-medium">
                          กำลังดำเนินการ...
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
            {/* Drills List */}
            <div className="space-y-3">
              {drills.map((drill) => (
                <div
                  key={drill.id}
                  onClick={() => setSelectedDrill(drill)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-xs ${
                    selectedDrill?.id === drill.id
                      ? 'bg-white border-[#0066ff] ring-2 ring-[#0066ff]/20'
                      : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#0066ff] uppercase tracking-wider block">
                        {drill.focusArea}
                      </span>
                      <h4 className="text-sm font-extrabold text-neutral-900 mt-0.5">
                        {drill.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">
                        {drill.thaiTitle} - {drill.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {drill.durationMin} min
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#10b981] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      +{drill.expReward} EXP เมื่อซ้อมจบ
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        completeDrill(drill.id);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#111318] hover:bg-[#1f2430] text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current text-[#d8ff00]" />
                      <span>ซ้อมจบแล้ว</span>
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
