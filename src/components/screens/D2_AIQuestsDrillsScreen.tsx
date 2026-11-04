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
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title="Daily Quests & Drills" showBack />

      {/* Slush Pill Segmented Tabs */}
      <div className="px-5 py-3 flex items-center gap-2 bg-white border-b border-black shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('quests')}
          className={`flex-1 py-2 rounded-full text-xs font-extrabold cursor-pointer transition-transform active:scale-95 border border-black flex items-center justify-center gap-1.5 ${
            activeTab === 'quests'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Daily Quests</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('drills')}
          className={`flex-1 py-2 rounded-full text-xs font-extrabold cursor-pointer transition-transform active:scale-95 border border-black flex items-center justify-center gap-1.5 ${
            activeTab === 'drills'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>AI Drills</span>
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'quests' ? (
          <>
            {/* Quests Header Info */}
            <div className="bg-white border border-black rounded-[28px] p-4 flex items-center justify-between shadow-xs">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffd731] border border-black text-[10px] font-black uppercase text-black inline-block mb-1">
                  Active Quests
                </span>
                <h3 className="font-['Antonio'] text-2xl font-extrabold text-black uppercase leading-tight">
                  DAILY MISSION BOARD
                </h3>
                <p className="text-xs text-neutral-600 font-medium">
                  Complete missions to earn EXP, unlock badges, and level up.
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
                    className="bg-white border border-black rounded-[24px] p-3.5 space-y-2 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-[#ffd731] border border-black flex items-center justify-center text-lg shrink-0">
                          {quest.icon || '🏸'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-black">{quest.title}</h4>
                          <p className="text-[11px] text-neutral-600 font-medium mt-0.5">
                            {quest.thaiTitle}
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-[#55db9c] border border-black text-black text-[10px] font-black shrink-0">
                        +{quest.expReward} EXP
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#e9e9e9] border border-black rounded-full h-2.5 overflow-hidden p-0.5">
                      <div
                        className="bg-[#5c4ade] h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold text-neutral-500">
                        Progress: {quest.current} / {quest.target}
                      </span>

                      {quest.claimed ? (
                        <span className="text-[11px] font-extrabold text-neutral-400">
                          ✓ Claimed
                        </span>
                      ) : isCompleted ? (
                        <button
                          type="button"
                          onClick={() => claimQuestReward(quest.id)}
                          className="px-3.5 py-1 rounded-full bg-black text-white hover:bg-neutral-800 text-[11px] font-bold border border-black cursor-pointer transition-transform active:scale-95 shadow-xs"
                        >
                          Claim Reward (+{quest.expReward} EXP)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => claimQuestReward(quest.id)}
                          className="px-3.5 py-1 rounded-full bg-[#ffd731] hover:bg-[#ffe259] text-black text-[10px] font-bold border border-black cursor-pointer transition-transform active:scale-95"
                        >
                          Simulate Progress
                        </button>
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
            <div className="bg-white border border-black rounded-[28px] p-4 flex items-center justify-between shadow-xs">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5c4ade] text-white border border-black text-[10px] font-black uppercase inline-block mb-1">
                  AI Drills
                </span>
                <h3 className="font-['Antonio'] text-2xl font-extrabold text-black uppercase leading-tight">
                  PERSONALIZED DRILL REPERTOIRE
                </h3>
                <p className="text-xs text-neutral-600 font-medium">
                  Weak-zone training drills curated by AI vision match diagnostics.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {drills.map((drill) => (
                <div
                  key={drill.id}
                  className="bg-white border border-black rounded-[24px] p-3.5 space-y-2 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-[#dceeff] border border-black text-[9px] font-bold text-black uppercase inline-block mb-1">
                        {drill.focusArea}
                      </span>
                      <h4 className="font-['Antonio'] text-xl font-bold text-black uppercase leading-tight">
                        {drill.title}
                      </h4>
                      <p className="text-[11px] text-neutral-600 mt-0.5">{drill.description}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-[#ffd731] border border-black text-black text-[10px] font-black shrink-0">
                      +{drill.expReward} EXP
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <span className="text-[11px] font-bold text-neutral-500">
                      Duration: {drill.durationMin} mins · {drill.difficulty}
                    </span>

                    <button
                      type="button"
                      onClick={() => completeDrill(drill.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border border-black cursor-pointer transition-transform active:scale-95 ${
                        drill.completed
                          ? 'bg-[#55db9c] text-black font-extrabold'
                          : 'bg-black text-white hover:bg-neutral-800'
                      }`}
                    >
                      {drill.completed ? '✓ Drill Complete' : 'Mark Complete (+EXP)'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Quick Navigations */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => navigateTo('D3')}
            className="py-3 rounded-full bg-white hover:bg-neutral-100 border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-[#5c4ade]" />
            <span>Vision Pose Scan</span>
          </button>

          <button
            onClick={() => navigateTo('D1')}
            className="py-3 rounded-full bg-[#55db9c] hover:bg-[#68eab0] border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>AI Coach Radar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
