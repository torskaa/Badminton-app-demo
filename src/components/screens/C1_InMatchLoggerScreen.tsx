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
    <div className="flex-1 flex flex-col justify-between bg-[#06070a] select-none">
      <MobileHeader
        title="Courtside Match Tracker"
        subtitle={`Set ${match.currentSet} · ${match.serviceBox === 'right' ? 'Right Service Box' : 'Left Service Box'}`}
      />

      {/* Broadcast Telemetry Strip */}
      <div className="px-4 py-2 bg-[#090c13] border-b border-white/[0.06] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-tight">LIVE MATCH</span>
          <span className="text-slate-500 font-sans">· Court 3</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
          <span>Server:</span>
          <span className="text-[#d4ff00] font-bold">Team {match.server}</span>
          <span className="text-slate-500">({match.serviceBox === 'right' ? 'Even/Right' : 'Odd/Left'})</span>
        </div>
      </div>

      <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
        {/* Modern Broadcast Scoreboard */}
        <div className="rounded-3xl bg-gradient-to-b from-[#121622] to-[#0a0d14] border border-white/[0.08] shadow-2xl p-4 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#d4ff00]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Past Sets Pill */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-3 pb-2 border-b border-white/[0.06]">
            <span className="tracking-wider uppercase text-slate-400">Match Progression</span>
            <div className="flex items-center gap-2">
              {match.pastSets.length > 0 ? (
                match.pastSets.map((s) => (
                  <span key={s.set} className="px-2 py-0.5 rounded bg-white/[0.05] text-white">
                    S{s.set}: {s.scoreA}-{s.scoreB}
                  </span>
                ))
              ) : (
                <span className="text-slate-500">First Set in progress</span>
              )}
            </div>
          </div>

          {/* Dual Score Cards */}
          <div className="grid grid-cols-2 gap-3 text-center">
            {/* Team A (You) */}
            <div
              className={`p-3.5 rounded-2xl transition-all relative ${
                match.server === 'A'
                  ? 'bg-[#d4ff00]/[0.07] border border-[#d4ff00]/40 shadow-[0_0_20px_rgba(212,255,0,0.12)]'
                  : 'bg-white/[0.02] border border-white/[0.06]'
              }`}
            >
              {match.server === 'A' && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-[#d4ff00] text-black font-black text-[9px] font-mono tracking-wider">
                  SERVING
                </div>
              )}
              <div className="text-xs font-bold text-slate-200 truncate mt-1">
                {match.playerAName}
              </div>
              <div className="text-5xl font-black text-[#d4ff00] font-mono tracking-tighter my-1">
                {match.scoreA}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Sets Won: <span className="text-white font-bold">{match.setsWonA}</span>
              </div>
            </div>

            {/* Team B */}
            <div
              className={`p-3.5 rounded-2xl transition-all relative ${
                match.server === 'B'
                  ? 'bg-amber-500/[0.07] border border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.12)]'
                  : 'bg-white/[0.02] border border-white/[0.06]'
              }`}
            >
              {match.server === 'B' && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-amber-400 text-black font-black text-[9px] font-mono tracking-wider">
                  SERVING
                </div>
              )}
              <div className="text-xs font-bold text-slate-200 truncate mt-1">
                {match.playerBName}
              </div>
              <div className="text-5xl font-black text-slate-100 font-mono tracking-tighter my-1">
                {match.scoreB}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Sets Won: <span className="text-white font-bold">{match.setsWonB}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tactile Shot Tagging Panel */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span>Shot Tagging Selector</span>
            </span>

            {/* Winner vs Error Switcher */}
            <div className="flex items-center gap-1 p-0.5 bg-black/60 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setActiveTabTag('winner')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                  activeTabTag === 'winner'
                    ? 'bg-[#d4ff00] text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Winner
              </button>
              <button
                onClick={() => setActiveTabTag('error')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                  activeTabTag === 'error'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Error
              </button>
            </div>
          </div>

          {activeTabTag === 'winner' ? (
            <div className="grid grid-cols-3 gap-1.5">
              {WINNER_SHOTS.map((item) => (
                <button
                  key={item.type}
                  onClick={() => setSelectedShotType(item.type)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border ${
                    selectedShotType === item.type
                      ? 'bg-[#d4ff00] text-black border-[#d4ff00] shadow-[0_0_12px_rgba(212,255,0,0.35)]'
                      : 'bg-white/[0.02] text-slate-300 border-white/[0.06] hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              {ERROR_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedErrorReason(reason)}
                  className={`py-2 px-1 rounded-xl text-[10px] font-bold text-center transition-all cursor-pointer border ${
                    selectedErrorReason === reason
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.05]'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Large Touch Scoring Buttons (Thumb Ergonomics) */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            {/* Team A Point (+1) */}
            <button
              onClick={handleScoreTeamA}
              className="min-h-[76px] rounded-2xl bg-gradient-to-b from-[#d4ff00] to-[#bbf000] hover:brightness-110 text-black font-black p-3 flex flex-col items-center justify-center shadow-[0_6px_25px_rgba(212,255,0,0.35)] active:scale-[0.97] transition-all cursor-pointer border border-[#e6ff4d]"
            >
              <div className="text-[10px] uppercase tracking-wider font-extrabold opacity-80">
                POINT · TEAM A
              </div>
              <div className="text-3xl font-black font-mono">
                {match.scoreA + 1}
              </div>
            </button>

            {/* Team B Point (+1) */}
            <button
              onClick={handleScoreTeamB}
              className="min-h-[76px] rounded-2xl bg-gradient-to-b from-[#181d28] to-[#10141e] hover:bg-[#202737] text-white font-black p-3 flex flex-col items-center justify-center shadow-lg active:scale-[0.97] transition-all cursor-pointer border border-white/[0.1]"
            >
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                POINT · TEAM B
              </div>
              <div className="text-3xl font-black font-mono text-slate-100">
                {match.scoreB + 1}
              </div>
            </button>
          </div>
        </div>

        {/* Live Shot Feed (Horizontal Stream) */}
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-mono text-[10px]">Shot Log:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {match.shotHistory.slice(0, 3).map((shot) => (
              <span
                key={shot.id}
                className={`text-[10px] px-2 py-0.5 rounded-md font-mono shrink-0 ${
                  shot.team === 'A'
                    ? 'bg-[#d4ff00]/15 text-[#d4ff00] border border-[#d4ff00]/30'
                    : 'bg-white/[0.05] text-slate-300'
                }`}
              >
                P{shot.pointNumber} · T{shot.team} ({shot.shotType})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-3.5 border-t border-white/[0.08] bg-[#07080c] flex items-center gap-2.5 shrink-0">
        <button
          onClick={undoLastPoint}
          disabled={match.shotHistory.length === 0}
          className="min-h-[44px] px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 disabled:opacity-40 border border-white/[0.08] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>

        <button
          onClick={finishMatch}
          className="flex-1 min-h-[44px] rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(251,191,36,0.25)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Flag className="w-4 h-4 fill-black" />
          <span>Finish Match & Claim EXP</span>
        </button>
      </div>
    </div>
  );
};
