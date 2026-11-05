import React, { useState } from 'react';
import { RotateCcw, Flag, Plus, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { ShotType, ErrorReason } from '../../types';

export const C1_InMatchLoggerScreen: React.FC = () => {
  const { match, addScorePoint, undoLastPoint, finishMatch, navigateTo } = useApp();

  const [selectedShotType, setSelectedShotType] = useState<ShotType>('Smash');
  const [selectedErrorReason] = useState<ErrorReason | undefined>(undefined);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const WINNER_SHOTS: { type: ShotType; label: string; icon: string; color: string }[] = [
    { type: 'Smash', label: 'Smash', icon: '⚡', color: '#ffd731' },
    { type: 'Drop', label: 'Drop', icon: '🏸', color: '#55db9c' },
    { type: 'Net', label: 'Net Kill', icon: '🎯', color: '#4da2ff' },
    { type: 'Drive', label: 'Drive', icon: '🚀', color: '#fb4903' },
    { type: 'Clear', label: 'Clear', icon: '🏹', color: '#e9ccff' },
    { type: 'Lift', label: 'Lift', icon: '🛡️', color: '#5c4ade' },
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
    <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      <MobileHeader
        title="Courtside Match Tracker"
        subtitle={`Set ${match.currentSet} · ${match.serviceBox === 'right' ? 'Right Box (Even)' : 'Left Box (Odd)'}`}
      />

      <div className="p-4 space-y-3.5 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-8">
        {/* Live Broadcast Pill */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55db9c] border border-[#000000]" />
            <span className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
              LIVE COURT 3 · SET {match.currentSet}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="px-3 py-1 rounded-[1600px] border border-[#000000] bg-[#ffffff] text-[11px] font-bold tracking-[0.032em] text-[#000000]">
              Server: Team {match.server}
            </span>
          </div>
        </div>

        {/* Scoreboard Card (Paper White Canvas, 1px solid black border, 28px radius) */}
        <div className="border border-[#000000] rounded-[28px] p-4 bg-[#ffffff]">
          <div className="grid grid-cols-2 gap-3 items-center">
            {/* Team A (Player) */}
            <div className="text-center p-4 rounded-[24px] border border-[#000000] bg-[#ffd731] text-[#000000]">
              <span className="font-['Antonio',sans-serif] text-sm font-black uppercase block mb-1 truncate text-[#000000]">
                {match.playerAName}
              </span>
              <div className="font-['Antonio',sans-serif] text-7xl font-black leading-none my-1 tracking-tight text-[#000000]">
                {match.scoreA}
              </div>
              <span className="text-[10px] font-bold tracking-[0.032em] uppercase px-3 py-0.5 rounded-[1600px] inline-block mt-1 bg-[#000000] text-[#ffffff] border border-[#000000]">
                Sets: {match.setsWonA}
              </span>
            </div>

            {/* Team B (Opponents) */}
            <div className="text-center p-4 rounded-[24px] border border-[#000000] bg-[#e9ccff] text-[#000000]">
              <span className="font-['Antonio',sans-serif] text-sm font-black uppercase block mb-1 truncate text-[#000000]">
                {match.playerBName}
              </span>
              <div className="font-['Antonio',sans-serif] text-7xl font-black leading-none my-1 tracking-tight text-[#000000]">
                {match.scoreB}
              </div>
              <span className="text-[10px] font-bold tracking-[0.032em] uppercase px-3 py-0.5 rounded-[1600px] inline-block mt-1 bg-[#000000] text-[#ffffff] border border-[#000000]">
                Sets: {match.setsWonB}
              </span>
            </div>
          </div>

          {/* Quick Undo & Service info */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#000000]/20 text-xs font-bold">
            <button
              type="button"
              onClick={undoLastPoint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[1600px] border border-[#000000] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] transition-transform active:scale-95 cursor-pointer font-bold tracking-[0.032em]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo แต้ม</span>
            </button>

            <span className="text-[11px] text-[#000000]/70 font-bold">
              แต้มรวม: {match.shotHistory.length} ช็อต
            </span>
          </div>
        </div>

        {/* Live Audio Commentary Widget */}
        <div className="p-3.5 rounded-[24px] border border-[#000000] bg-[#ffffff] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`w-9 h-9 rounded-[1600px] border border-[#000000] flex items-center justify-center cursor-pointer transition-transform active:scale-90 ${
                isPlayingAudio ? 'bg-[#fb4903] text-[#ffffff]' : 'bg-[#ffd731] text-[#000000]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <div>
              <span className="font-['Antonio',sans-serif] text-sm font-black block leading-tight text-[#000000]">
                AI Live Audio Commentary
              </span>
              <span className="text-[10px] text-[#000000]/60 font-bold">บรรยายสดวิเคราะห์เกมเรียลไทม์ (81')</span>
            </div>
          </div>

          {/* Waveform SVG */}
          <div className="flex items-center gap-1">
            {[12, 24, 18, 30, 16, 28, 14, 22, 10, 26, 18].map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-[#000000] rounded-[1600px]"
                style={{ height: `${isPlayingAudio ? h : 8}px` }}
              />
            ))}
          </div>
        </div>

        {/* Shot Winner Type Tag Pills (Multi-color sticker set) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-[#000000]/70 block px-1 tracking-[0.032em]">
            Point Winner Type (ระบุประเภทช็อตที่ได้แต้ม)
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {WINNER_SHOTS.map((item) => {
              const isSelected = selectedShotType === item.type;
              return (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setSelectedShotType(item.type)}
                  className={`py-2 px-2.5 rounded-[1600px] text-xs font-bold tracking-[0.032em] flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer border border-[#000000] ${
                    isSelected
                      ? 'bg-[#000000] text-[#ffffff]'
                      : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="text-[11px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ergonomic Giant Thumb Scoring Buttons (Black fill and outlined black only) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleScoreTeamA}
            className="py-4 px-3 rounded-[28px] font-bold tracking-[0.032em] text-xs uppercase flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] whitespace-nowrap"
          >
            <Plus className="w-5 h-5 stroke-[3] shrink-0" />
            <span className="truncate">+1 {match.playerAName}</span>
          </button>

          <button
            type="button"
            onClick={handleScoreTeamB}
            className="py-4 px-3 rounded-[28px] font-bold tracking-[0.032em] text-xs uppercase flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] border border-[#000000] whitespace-nowrap"
          >
            <Plus className="w-5 h-5 stroke-[3] shrink-0" />
            <span className="truncate">+1 {match.playerBName}</span>
          </button>
        </div>

        {/* Finish Match Button (Ember Badge with 1px black outline) */}
        <button
          type="button"
          onClick={handleFinish}
          className="w-full py-3.5 rounded-[1600px] bg-[#fb4903] hover:bg-[#e03f00] text-[#ffffff] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer border border-[#000000] whitespace-nowrap"
        >
          <Flag className="w-4 h-4 fill-current shrink-0" />
          <span>FINISH MATCH & RECORD STATS</span>
        </button>
      </div>
    </div>
  );
};
