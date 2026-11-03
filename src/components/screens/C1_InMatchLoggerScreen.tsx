/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RotateCcw, Flag, Zap, Plus, Minus, ShieldAlert, Award, ChevronRight, Activity, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { ShotType, ErrorReason } from '../../types';

export const C1_InMatchLoggerScreen: React.FC = () => {
  const { match, addScorePoint, undoLastPoint, finishMatch, navigateTo } = useApp();

  const [selectedShotType, setSelectedShotType] = useState<ShotType>('Smash');
  const [selectedErrorReason, setSelectedErrorReason] = useState<ErrorReason | undefined>(undefined);
  const [activeTabTag, setActiveTabTag] = useState<'winner' | 'error'>('winner');

  const WINNER_SHOTS: { type: ShotType; label: string; icon: string }[] = [
    { type: 'Smash', label: 'Smash', icon: '⚡' },
    { type: 'Drop', label: 'Drop', icon: '🏸' },
    { type: 'Net', label: 'Net Kill', icon: '🎯' },
    { type: 'Drive', label: 'Drive', icon: '🚀' },
    { type: 'Clear', label: 'Clear', icon: '🏹' },
    { type: 'Lift', label: 'Lift', icon: '🛡️' },
  ];

  const ERROR_REASONS: ErrorReason[] = ['Net Tape', 'Out Wide', 'Out Baseline', 'Footwork Fault', 'Unforced'];

  const handleScoreTeamA = () => {
    addScorePoint('A', selectedShotType, selectedErrorReason);
  };

  const handleScoreTeamB = () => {
    addScorePoint('B', selectedShotType, selectedErrorReason);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 select-none pb-24">
      <MobileHeader
        title="Courtside Match Tracker"
        subtitle={`Set ${match.currentSet} · ${match.serviceBox === 'right' ? 'Right Service Box' : 'Left Service Box'}`}
      />

      {/* Broadcast Telemetry Strip (Matches Image 4) */}
      <div className="px-5 py-2 bg-white border-b border-neutral-200/80 flex items-center justify-between text-xs shadow-2xs">
        <div className="flex items-center gap-2 text-emerald-600 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="tracking-tight uppercase">LIVE COURT 3</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-600 font-mono text-[11px]">
          <span>Server:</span>
          <span className="px-2 py-0.5 rounded-full bg-[#111318] text-[#d8ff00] font-bold">
            Team {match.server}
          </span>
          <span className="text-neutral-400">({match.serviceBox === 'right' ? 'Even/Right' : 'Odd/Left'})</span>
        </div>
      </div>

      <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
        {/* Modern Broadcast Scoreboard (Matches Image 4) */}
        <div className="rounded-3xl bg-[#111318] text-white p-5 shadow-lg relative overflow-hidden">
          {/* Past Sets Pill */}
          <div className="flex items-center justify-between text-[11px] font-mono mb-4 pb-2.5 border-b border-white/10">
            <span className="tracking-wider uppercase text-neutral-400">Match Progression</span>
            <div className="flex items-center gap-2">
              {match.pastSets.length > 0 ? (
                match.pastSets.map((s) => (
                  <span key={s.set} className="px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                    S{s.set}: {s.scoreA}-{s.scoreB}
                  </span>
                ))
              ) : (
                <span className="text-neutral-400">Set 1 Live</span>
              )}
            </div>
          </div>

          {/* Main Score Digits Display */}
          <div className="grid grid-cols-2 gap-4 items-center text-center py-2 relative">
            {/* Center Divider & Live Audio Wave */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <span className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">VS</span>
              {/* Mini Audio Wave Bars (Matches Image 4) */}
              <div className="flex items-center gap-0.5 h-4">
                <span className="w-1 h-2 bg-[#d8ff00] rounded-full animate-bounce" />
                <span className="w-1 h-4 bg-[#d8ff00] rounded-full animate-pulse" />
                <span className="w-1 h-3 bg-[#d8ff00] rounded-full animate-bounce" />
              </div>
            </div>

            {/* Team A */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-bold text-neutral-300 truncate max-w-[120px]">
                  {match.playerAName}
                </span>
                {match.server === 'A' && (
                  <span className="w-2 h-2 rounded-full bg-[#d8ff00] shadow-[0_0_8px_#d8ff00]" />
                )}
              </div>
              <div className="text-5xl font-black font-mono tracking-tighter text-[#d8ff00]">
                {match.scoreA}
              </div>
              <span className="text-[10px] text-neutral-400 mt-1">
                Sets Won: <strong className="text-white">{match.setsWonA}</strong>
              </span>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 mb-1">
                {match.server === 'B' && (
                  <span className="w-2 h-2 rounded-full bg-[#d8ff00] shadow-[0_0_8px_#d8ff00]" />
                )}
                <span className="text-xs font-bold text-neutral-300 truncate max-w-[120px]">
                  {match.playerBName}
                </span>
              </div>
              <div className="text-5xl font-black font-mono tracking-tighter text-white">
                {match.scoreB}
              </div>
              <span className="text-[10px] text-neutral-400 mt-1">
                Sets Won: <strong className="text-white">{match.setsWonB}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Shot Selection Chips */}
        <div className="p-3.5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-extrabold text-neutral-800 uppercase tracking-wider text-[11px]">
              บันทึกรูปแบบช็อต (Shot Tagging)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTabTag('winner')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                  activeTabTag === 'winner'
                    ? 'bg-[#111318] text-[#d8ff00]'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                Winner
              </button>
              <button
                type="button"
                onClick={() => setActiveTabTag('error')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                  activeTabTag === 'error'
                    ? 'bg-rose-500 text-white'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                Fault / Error
              </button>
            </div>
          </div>

          {activeTabTag === 'winner' ? (
            <div className="grid grid-cols-3 gap-2">
              {WINNER_SHOTS.map((s) => (
                <button
                  type="button"
                  key={s.type}
                  onClick={() => setSelectedShotType(s.type)}
                  className={`py-2 px-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedShotType === s.type
                      ? 'bg-[#d8ff00] text-black border-[#d8ff00] shadow-xs scale-102 font-extrabold'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {ERROR_REASONS.map((err) => (
                <button
                  type="button"
                  key={err}
                  onClick={() => setSelectedErrorReason(err)}
                  className={`py-2 px-2 rounded-2xl border text-[11px] font-bold transition-all cursor-pointer ${
                    selectedErrorReason === err
                      ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {err}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Big Giant Thumb Scoring Buttons (48px+ touch target) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleScoreTeamA}
            className="h-24 rounded-3xl bg-[#111318] hover:bg-[#1a1d24] active:scale-95 text-white p-3 flex flex-col justify-between shadow-md cursor-pointer transition-all border border-neutral-800 group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-extrabold text-[#d8ff00] uppercase tracking-wider">
                POINT TEAM A
              </span>
              <Plus className="w-5 h-5 text-[#d8ff00] stroke-[3]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black truncate">{match.playerAName}</div>
              <div className="text-[10px] text-neutral-400">แตะเพื่อเพิ่ม +1 แต้ม</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleScoreTeamB}
            className="h-24 rounded-3xl bg-white hover:bg-neutral-50 active:scale-95 text-neutral-900 p-3 flex flex-col justify-between shadow-md cursor-pointer transition-all border border-neutral-200/90 group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-extrabold text-[#0066ff] uppercase tracking-wider">
                POINT TEAM B
              </span>
              <Plus className="w-5 h-5 text-[#0066ff] stroke-[3]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black truncate">{match.playerBName}</div>
              <div className="text-[10px] text-neutral-500">แตะเพื่อเพิ่ม +1 แต้ม</div>
            </div>
          </button>
        </div>

        {/* Secondary Match Utility Controls */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={undoLastPoint}
            className="flex-1 py-3 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold border border-neutral-200/90 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ย้อนคะแนน (Undo)</span>
          </button>

          <button
            type="button"
            onClick={finishMatch}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>จบแมตช์ (Finish)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
