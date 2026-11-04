/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RotateCcw, Flag, Zap, Plus, Minus, ShieldAlert, Award, ChevronRight, Activity, ArrowRight, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { ShotType, ErrorReason } from '../../types';

export const C1_InMatchLoggerScreen: React.FC = () => {
  const { match, addScorePoint, undoLastPoint, finishMatch, navigateTo } = useApp();

  const [selectedShotType, setSelectedShotType] = useState<ShotType>('Smash');
  const [selectedErrorReason, setSelectedErrorReason] = useState<ErrorReason | undefined>(undefined);
  const [activeTabTag, setActiveTabTag] = useState<'winner' | 'error'>('winner');

  const WINNER_SHOTS: { type: ShotType; label: string; icon: string; color: string }[] = [
    { type: 'Smash', label: 'Smash', icon: '⚡', color: '#ffd731' },
    { type: 'Drop', label: 'Drop', icon: '🏸', color: '#4da2ff' },
    { type: 'Net', label: 'Net Kill', icon: '🎯', color: '#55db9c' },
    { type: 'Drive', label: 'Drive', icon: '🚀', color: '#e9ccff' },
    { type: 'Clear', label: 'Clear', icon: '🏹', color: '#fb4903' },
    { type: 'Lift', label: 'Lift', icon: '🛡️', color: '#dceeff' },
  ];

  const handleScoreTeamA = () => {
    addScorePoint('A', selectedShotType, selectedErrorReason);
  };

  const handleScoreTeamB = () => {
    addScorePoint('B', selectedShotType, selectedErrorReason);
  };

  const handleFinish = () => {
    finishMatch();
    navigateTo('C2');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black select-none pb-24 font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader
        title="Courtside Match Tracker"
        subtitle={`Set ${match.currentSet} · ${match.serviceBox === 'right' ? 'Right Box (Even)' : 'Left Box (Odd)'}`}
      />

      <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
        {/* Live Broadcast Pill */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55db9c] border border-black animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-black">
              LIVE COURT 3 · SET {match.currentSet}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="px-2.5 py-0.5 rounded-full bg-white border border-black">
              Server: Team {match.server}
            </span>
          </div>
        </div>

        {/* Big Slush Scoreboard Card with Massive Display Numbers */}
        <div className="bg-white border border-black rounded-[32px] p-4 relative overflow-hidden shadow-xs">
          <div className="grid grid-cols-2 gap-3 items-center">
            {/* Team A (Player) */}
            <div className="text-center p-3 rounded-2xl bg-[#ffd731] border border-black">
              <span className="text-[11px] font-extrabold uppercase text-black block mb-1">
                {match.playerAName}
              </span>
              <div className="font-['Antonio'] text-7xl font-extrabold text-black leading-none my-1 tracking-tight">
                {match.scoreA}
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black text-white inline-block">
                Sets: {match.setsWonA}
              </span>
            </div>

            {/* Team B (Opponents) */}
            <div className="text-center p-3 rounded-2xl bg-[#4da2ff] border border-black">
              <span className="text-[11px] font-extrabold uppercase text-black block mb-1">
                {match.playerBName}
              </span>
              <div className="font-['Antonio'] text-7xl font-extrabold text-black leading-none my-1 tracking-tight">
                {match.scoreB}
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black text-white inline-block">
                Sets: {match.setsWonB}
              </span>
            </div>
          </div>

          {/* Quick Undo & Service info */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-200 text-xs font-bold">
            <button
              onClick={undoLastPoint}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-neutral-100 border border-black text-black transition-transform active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo Point</span>
            </button>

            <span className="text-neutral-600 font-medium text-[11px]">
              Tap shot tag below before scoring
            </span>
          </div>
        </div>

        {/* Shot Tag Pills (Slush Multi-color Sticker Palette) */}
        <div className="bg-white border border-black rounded-[28px] p-3.5 space-y-2">
          <label className="text-xs font-bold text-black uppercase tracking-wide px-1 flex items-center justify-between">
            <span>Tag Shot Type (ประเภทลูกที่ได้แต้ม)</span>
            <span className="text-[10px] font-extrabold text-[#5c4ade]">Selected: {selectedShotType}</span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {WINNER_SHOTS.map((s) => {
              const isSelected = selectedShotType === s.type;
              return (
                <button
                  type="button"
                  key={s.type}
                  onClick={() => setSelectedShotType(s.type)}
                  className={`py-2 px-3 rounded-full border text-xs font-bold transition-transform cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'border-black scale-105 shadow-xs'
                      : 'bg-white hover:bg-neutral-50 border-black/70 text-black'
                  } active:scale-95`}
                  style={{ backgroundColor: isSelected ? s.color : '#ffffff' }}
                >
                  <span>{s.icon}</span>
                  <span className="text-black font-extrabold">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Giant Thumb Scoring Buttons (+1 Team A / +1 Team B) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleScoreTeamA}
            className="h-20 bg-black hover:bg-neutral-800 text-white border border-black rounded-3xl p-3 flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-xs"
          >
            <div className="flex items-center gap-1.5 font-['Antonio'] text-2xl font-bold">
              <Plus className="w-5 h-5 text-[#ffd731] stroke-[3]" />
              <span>POINT A</span>
            </div>
            <span className="text-[11px] text-neutral-300 font-medium">กานต์ & โอห์ม (+1)</span>
          </button>

          <button
            type="button"
            onClick={handleScoreTeamB}
            className="h-20 bg-white hover:bg-neutral-100 text-black border border-black rounded-3xl p-3 flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-xs"
          >
            <div className="flex items-center gap-1.5 font-['Antonio'] text-2xl font-bold">
              <Plus className="w-5 h-5 text-[#4da2ff] stroke-[3]" />
              <span>POINT B</span>
            </div>
            <span className="text-[11px] text-neutral-600 font-medium">อาร์ท & ท็อป (+1)</span>
          </button>
        </div>

        {/* Finish Match / Next Flow Button */}
        <div>
          <button
            type="button"
            onClick={handleFinish}
            className="w-full py-3.5 rounded-full bg-[#55db9c] hover:bg-[#66eab2] text-black font-extrabold text-xs uppercase tracking-wide border border-black flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 shadow-xs"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Finish Match & Claim EXP Payout</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
