import React, { useState } from 'react';
import { RotateCcw, Flag, Plus, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { ShotType, ErrorReason } from '../../types';

export const C1_InMatchLoggerScreen: React.FC = () => {
  const { match, addScorePoint, undoLastPoint, finishMatch, navigateTo, language } = useApp();

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
        title={language === 'th' ? 'บันทึกคะแนนสดข้างสนาม' : 'Courtside Match Tracker'}
        subtitle={language === 'th' ? `เซ็ต ${match.currentSet} · ${match.serviceBox === 'right' ? 'คอร์ทขวา (แต้มคู่)' : 'คอร์ทซ้าย (แต้มคี่)'}` : `Set ${match.currentSet} · ${match.serviceBox === 'right' ? 'Right Box (Even)' : 'Left Box (Odd)'}`}
      />

      <div className="p-4 space-y-3.5 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-8">
        {/* Live Broadcast Pill */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55db9c] border border-[#000000]" />
            <span className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
              {language === 'th' ? `ถ่ายทอดสด คอร์ท 3 · เซ็ต ${match.currentSet}` : `LIVE COURT 3 · SET ${match.currentSet}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="px-3 py-1 rounded-[1600px] border border-[#000000] bg-[#ffffff] text-[11px] font-bold tracking-[0.032em] text-[#000000]">
              {language === 'th' ? `ผู้ส่งลูก: ทีม ${match.server}` : `Server: Team ${match.server}`}
            </span>
          </div>
        </div>

        {/* 1. Scoreboard Card */}
        <div className="border border-[#000000] rounded-[28px] p-4 bg-[#ffffff] space-y-3">
          {/* Subheader */}
          <div className="flex items-center justify-between pb-2 border-b border-[#000000]/15">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="px-2 py-0.2 rounded-[1600px] text-[9px] font-bold uppercase tracking-[0.032em] bg-[#ffd731] text-[#000000] border border-[#000000]">
                  {language === 'th' ? 'กระดานคะแนนสด' : 'LIVE SCORE'}
                </span>
                <span className="font-['Antonio',sans-serif] text-xs font-black uppercase tracking-wider text-[#000000]">
                  {language === 'th' ? 'แต้มการแข่งขัน & เซ็ต' : 'MATCH SCORE & SETS'}
                </span>
              </div>
              <p className="text-[10px] text-[#000000]/60 font-bold">
                {language === 'th'
                  ? 'แตะปุ่มเพื่อเพิ่มคะแนน ระบบจะคำนวณตำแหน่งเสิร์ฟให้อัตโนมัติ'
                  : 'Tap to add points. Service box auto-rotates by even/odd rule'}
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#55db9c] text-[#000000] border border-[#000000]">
              BWF 21 PTS
            </span>
          </div>

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
                {language === 'th' ? `เซ็ต: ${match.setsWonA}` : `Sets: ${match.setsWonA}`}
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
                {language === 'th' ? `เซ็ต: ${match.setsWonB}` : `Sets: ${match.setsWonB}`}
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
              <span>{language === 'th' ? 'Undo ย้อนแต้ม' : 'Undo Point'}</span>
            </button>

            <span className="text-[11px] text-[#000000]/70 font-bold">
              {language === 'th' ? `แต้มรวม: ${match.shotHistory.length} ช็อต` : `Total: ${match.shotHistory.length} shots`}
            </span>
          </div>
        </div>

        {/* 2. Live Audio Commentary Widget */}
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
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.1 rounded-[1600px] text-[8px] font-bold uppercase tracking-[0.032em] bg-[#55db9c] text-[#000000] border border-[#000000]">
                  {language === 'th' ? 'พากย์เสียงสด' : 'AUDIO CAST'}
                </span>
                <span className="font-['Antonio',sans-serif] text-sm font-black block leading-tight text-[#000000]">
                  {language === 'th' ? 'ระบบบรรยายเกมข้างสนาม' : 'LIVE MATCH COMMENTARY'}
                </span>
              </div>
              <span className="text-[10px] text-[#000000]/60 font-bold">
                {language === 'th' ? 'วิเคราะห์เกมเรียลไทม์เพื่อเสริมสร้างสมาธิ (81\')' : 'Real-time courtside audio analysis (81\')'}
              </span>
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

        {/* 3. Shot Winner Type Tag Pills */}
        <div className="border border-[#000000] rounded-[24px] p-3.5 bg-[#ffffff] space-y-2">
          {/* Subheader */}
          <div className="pb-1.5 border-b border-[#000000]/15">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-2 py-0.2 rounded-[1600px] text-[9px] font-bold uppercase tracking-[0.032em] bg-[#4da2ff] text-[#000000] border border-[#000000]">
                {language === 'th' ? 'ประเภทช็อตทำแต้ม' : 'SHOT CLASSIFICATION'}
              </span>
              <span className="font-['Antonio',sans-serif] text-xs font-black uppercase tracking-wider text-[#000000]">
                {language === 'th' ? 'ระบุช็อตที่ได้แต้ม' : 'POINT WINNER TYPE'}
              </span>
            </div>
            <p className="text-[10px] text-[#000000]/60 font-bold">
              {language === 'th'
                ? 'เลือกช็อตที่ทำคะแนนเพื่อนำไปคำนวณเรดาร์ทักษะ 5 ด้าน'
                : 'Select the scoring shot to update your 5-axis skill radar stats'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
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

        {/* 4. Giant Thumb Scoring Buttons */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase text-[#000000]/70 tracking-[0.032em]">
              {language === 'th' ? 'กดเพิ่มแต้มข้างสนาม (+1 POINT)' : 'COURTSIDE TAP-TO-SCORE (+1)'}
            </span>
            <span className="text-[10px] text-[#000000]/50 font-bold">Thumb Controls</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
