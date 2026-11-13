import React, { useState } from 'react';
import { RotateCcw, Flag, Plus, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { ShotType, ErrorReason } from '../../types';

export const C1_InMatchLoggerScreen: React.FC = () => {
  const { match, addScorePoint, undoLastPoint, finishMatch, navigateTo, language } = useApp();
  const isThai = language === 'th';

  const [selectedShotType, setSelectedShotType] = useState<ShotType>('Smash');
  const [selectedErrorReason] = useState<ErrorReason | undefined>(undefined);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const WINNER_SHOTS: { type: ShotType; label: string; icon: string }[] = [
    { type: 'Smash', label: 'Smash', icon: '⚡' },
    { type: 'Drop', label: 'Drop', icon: '🏸' },
    { type: 'Net', label: 'Net Kill', icon: '🎯' },
    { type: 'Drive', label: 'Drive', icon: '🚀' },
    { type: 'Clear', label: 'Clear', icon: '🏹' },
    { type: 'Lift', label: 'Lift', icon: '🛡️' },
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
    <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-hidden">
      <MobileHeader
        title={isThai ? 'บันทึกแต้ม' : 'Scorer'}
        subtitle={
          isThai
            ? `เซ็ต ${match.currentSet} · ${match.serviceBox === 'right' ? 'ฝั่งขวา (แต้มคู่)' : 'ฝั่งซ้าย (แต้มคี่)'}`
            : `Set ${match.currentSet} · ${match.serviceBox === 'right' ? 'Right (Even)' : 'Left (Odd)'}`
        }
        showBack
      />

      <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-10">
        {/* 1. Scoreboard Section */}
        <div className="space-y-1.5">
          <SectionHeader
            title={isThai ? `ถ่ายทอดสด คอร์ท 3 · เซ็ต ${match.currentSet}` : `LIVE COURT 3 · SET ${match.currentSet}`}
            subtitle={isThai ? 'แตะปุ่มด้านล่างเพื่อเพิ่มคะแนนอัตโนมัติ' : 'Service box auto-rotates by even/odd rule'}
            badge={isThai ? `เสิร์ฟ: ทีม ${match.server} · BWF 21` : `Server ${match.server} · BWF 21`}
            badgeVariant="green"
          />

          <div className="rounded-[28px] p-4 bg-[#ffffff] space-y-3 shadow-xs">
            <div className="grid grid-cols-2 gap-3 items-center">
              {/* Team A (Player) */}
              <div className="text-center p-4 rounded-[22px] bg-[#7cd7a0] text-[#000000]">
                <span className="font-['Antonio',sans-serif] text-sm font-black uppercase block mb-1 truncate text-[#000000]">
                  {match.playerAName}
                </span>
                <div className="font-['Antonio',sans-serif] text-7xl font-black leading-none my-1 tracking-tight tabular-nums text-[#000000]">
                  {match.scoreA}
                </div>
                <span className="text-[10px] font-bold tracking-[0.032em] uppercase px-3 py-0.5 rounded-[1600px] inline-block mt-1 bg-[#000000] text-[#ffffff] whitespace-nowrap">
                  {isThai ? `เซ็ต: ${match.setsWonA}` : `Sets: ${match.setsWonA}`}
                </span>
              </div>

              {/* Team B (Opponents) */}
              <div className="text-center p-4 rounded-[22px] bg-[#e8f7ee] text-[#000000]">
                <span className="font-['Antonio',sans-serif] text-sm font-black uppercase block mb-1 truncate text-[#000000]">
                  {match.playerBName}
                </span>
                <div className="font-['Antonio',sans-serif] text-7xl font-black leading-none my-1 tracking-tight tabular-nums text-[#000000]">
                  {match.scoreB}
                </div>
                <span className="text-[10px] font-bold tracking-[0.032em] uppercase px-3 py-0.5 rounded-[1600px] inline-block mt-1 bg-[#000000] text-[#ffffff] whitespace-nowrap">
                  {isThai ? `เซ็ต: ${match.setsWonB}` : `Sets: ${match.setsWonB}`}
                </span>
              </div>
            </div>

            {/* Quick Undo & Service info */}
            <div className="flex items-center justify-between pt-1 text-xs font-bold">
              <button
                type="button"
                onClick={undoLastPoint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[1600px] border border-[#000000] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] transition-transform active:scale-95 cursor-pointer font-bold tracking-[0.032em] whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>{isThai ? 'ย้อนแต้ม' : 'Undo Point'}</span>
              </button>

              <span className="text-[11px] text-[#000000]/70 font-bold whitespace-nowrap tabular-nums">
                {isThai ? `แต้มรวม: ${match.shotHistory.length} ช็อต` : `Total: ${match.shotHistory.length} shots`}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Live Audio Commentary Section */}
        <div className="space-y-1.5">
          <SectionHeader
            title={isThai ? 'ระบบบรรยายเกมข้างสนาม' : 'LIVE MATCH COMMENTARY'}
            subtitle={isThai ? "วิเคราะห์เกมเรียลไทม์เพื่อเสริมสร้างสมาธิ (81')" : "Real-time courtside audio analysis (81')"}
            badge={isThai ? 'พากย์เสียงสด' : 'AUDIO CAST'}
            badgeVariant={isPlayingAudio ? 'orange' : 'green'}
          />

          <div
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="p-3.5 rounded-[24px] bg-[#ffffff] flex items-center justify-between gap-3 cursor-pointer hover:bg-[#f9fbfd] transition-colors shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlayingAudio(!isPlayingAudio);
                }}
                className={`w-10 h-10 rounded-[1600px] border border-[#000000] flex items-center justify-center cursor-pointer transition-transform active:scale-90 shrink-0 ${
                  isPlayingAudio ? 'bg-[#e85729] text-[#ffffff]' : 'bg-[#7cd7a0] text-[#000000]'
                }`}
                aria-label="Toggle live audio commentary"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-[#000000] truncate">
                  {isPlayingAudio
                    ? (isThai ? 'กำลังเล่นเสียงบรรยายเกมสด...' : 'Streaming courtside audio...')
                    : (isThai ? 'แตะเพื่อเปิดเสียงพากย์วิเคราะห์เกม' : 'Tap to start live voice commentary')}
                </div>
                <div className="text-[11px] text-[#000000]/60 font-semibold truncate">
                  {isThai ? 'ความเร็วตบล่าสุด 338 km/h · จังหวะโต้หน้าเน็ต' : 'Peak smash 338 km/h · Net exchange focus'}
                </div>
              </div>
            </div>

            {/* Waveform Bars */}
            <div className="flex items-center gap-1 shrink-0">
              {[10, 20, 14, 24, 14, 22, 12, 18, 10].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-[1600px] transition-all ${isPlayingAudio ? 'bg-[#e85729]' : 'bg-[#000000]'}`}
                  style={{ height: `${isPlayingAudio ? h : 7}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3. Shot Winner Classification Section */}
        <div className="space-y-1.5">
          <SectionHeader
            title={isThai ? 'ระบุช็อตที่ได้แต้ม' : 'POINT WINNER TYPE'}
            subtitle={isThai ? 'เลือกช็อตเพื่อคำนวณเรดาร์ทักษะ 5 ด้าน' : 'Select shot to update your 5-axis skill radar'}
            badge={isThai ? 'ประเภทช็อตทำแต้ม' : 'SHOT TYPE'}
            badgeVariant="green"
          />

          <div className="rounded-[24px] p-3.5 bg-[#ffffff] shadow-xs">
            <div className="grid grid-cols-3 gap-2">
              {WINNER_SHOTS.map((item) => {
                const isSelected = selectedShotType === item.type;
                return (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setSelectedShotType(item.type)}
                    className={`py-2.5 px-2.5 rounded-[1600px] text-[11px] font-bold tracking-[0.02em] flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer border border-[#000000] whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[#000000] text-[#ffffff]'
                        : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Giant Thumb Scoring Controls Section */}
        <div className="space-y-1.5">
          <SectionHeader
            title={isThai ? 'กดเพิ่มแต้มข้างสนาม (+1 POINT)' : 'COURTSIDE TAP-TO-SCORE (+1)'}
            badge="Thumb Controls"
            badgeVariant="soft"
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleScoreTeamA}
              className="py-4 px-3 rounded-[28px] font-bold tracking-[0.02em] text-xs uppercase flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[3] shrink-0" />
              <span className="truncate">{match.playerAName}</span>
            </button>

            <button
              type="button"
              onClick={handleScoreTeamB}
              className="py-4 px-3 rounded-[28px] font-bold tracking-[0.02em] text-xs uppercase flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] border border-[#000000] whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[3] shrink-0" />
              <span className="truncate">{match.playerBName}</span>
            </button>
          </div>
        </div>

        {/* Finish Match Button */}
        <button
          type="button"
          onClick={handleFinish}
          className="w-full py-3.5 px-4 rounded-[1600px] bg-[#e85729] hover:bg-[#e03f00] text-[#ffffff] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer border border-[#000000] whitespace-nowrap"
        >
          <Flag className="w-4 h-4 fill-current shrink-0" />
          <span className="whitespace-nowrap">FINISH MATCH & RECORD STATS</span>
        </button>
      </div>
    </div>
  );
};
