import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Flag, Plus, Volume2, Vibrate } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { ShotType, ErrorReason } from '../../types';
import {
  isHapticSupported,
  loadHapticsPreference,
  saveHapticsPreference,
  triggerHaptic,
} from '../../utils/hapticFeedback';

export const C1_InMatchLoggerScreen: React.FC = () => {
  const { match, addScorePoint, undoLastPoint, finishMatch, navigateTo, language } = useApp();
  const isThai = language === 'th';

  const [selectedShotType, setSelectedShotType] = useState<ShotType>('Smash');
  const [selectedErrorReason] = useState<ErrorReason | undefined>(undefined);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isHapticEnabled, setIsHapticEnabled] = useState<boolean>(() => loadHapticsPreference());
  const [pulsingTeam, setPulsingTeam] = useState<'A' | 'B' | null>(null);
  const pulseTimerRef = useRef<number | null>(null);

  const hapticHardwareAvailable = isHapticSupported();

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current);
      }
    };
  }, []);

  const triggerVisualPulse = (team: 'A' | 'B') => {
    if (pulseTimerRef.current !== null) {
      window.clearTimeout(pulseTimerRef.current);
    }
    setPulsingTeam(team);
    pulseTimerRef.current = window.setTimeout(() => {
      setPulsingTeam(null);
    }, 240);
  };

  const handleToggleHaptics = () => {
    const next = !isHapticEnabled;
    setIsHapticEnabled(next);
    saveHapticsPreference(next);
    if (next) {
      triggerHaptic('light', true);
    }
  };

  const WINNER_SHOTS: { type: ShotType; label: string; icon: string }[] = [
    { type: 'Smash', label: isThai ? 'ลูกตบ' : 'Smash', icon: '⚡' },
    { type: 'Drop', label: isThai ? 'ลูกหยอด' : 'Drop', icon: '🏸' },
    { type: 'Net', label: isThai ? 'ดักเน็ต' : 'Net Kill', icon: '🎯' },
    { type: 'Drive', label: isThai ? 'ลูกไดรฟ์' : 'Drive', icon: '🚀' },
    { type: 'Clear', label: isThai ? 'ลูกเคลียร์' : 'Clear', icon: '🏹' },
    { type: 'Lift', label: isThai ? 'งัดหลัง' : 'Lift', icon: '🛡️' },
  ];

  const handleScoreTeamA = () => {
    const nextScoreA = match.scoreA + 1;
    const winsSet = (nextScoreA >= 21 && nextScoreA - match.scoreB >= 2) || nextScoreA === 30;
    triggerHaptic(winsSet ? 'set_won' : 'point_a', isHapticEnabled);
    triggerVisualPulse('A');
    addScorePoint('A', selectedShotType, selectedErrorReason);
  };

  const handleScoreTeamB = () => {
    const nextScoreB = match.scoreB + 1;
    const winsSet = (nextScoreB >= 21 && nextScoreB - match.scoreA >= 2) || nextScoreB === 30;
    triggerHaptic(winsSet ? 'set_won' : 'point_b', isHapticEnabled);
    triggerVisualPulse('B');
    addScorePoint('B', selectedShotType, selectedErrorReason);
  };

  const handleUndoPoint = () => {
    triggerHaptic('undo', isHapticEnabled);
    undoLastPoint();
  };

  const handleSelectShot = (shotType: ShotType) => {
    triggerHaptic('light', isHapticEnabled);
    setSelectedShotType(shotType);
  };

  const handleFinish = () => {
    triggerHaptic('set_won', isHapticEnabled);
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
        rightSlot={
          <button
            type="button"
            onClick={handleToggleHaptics}
            aria-pressed={isHapticEnabled}
            title={
              hapticHardwareAvailable
                ? (isThai ? 'เปิด/ปิดระบบสั่นตอบสนองตอนกดแต้ม' : 'Toggle scoring vibration feedback')
                : (isThai ? 'ระบบตอบสนองการสัมผัส (เบราว์เซอร์นี้ไม่รองรับการสั่นฮาร์ดแวร์)' : 'Haptic toggle (device fallback visual pulse)')
            }
            className={`px-3 py-1.5 rounded-[1600px] text-[11px] font-bold whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer transition-colors ${
              isHapticEnabled
                ? 'bg-[#7cd7a0] hover:bg-[#6bc991] text-[#000000]'
                : 'bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000]/65'
            }`}
          >
            <Vibrate className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isThai
                ? (isHapticEnabled ? 'สั่น: เปิด' : 'สั่น: ปิด')
                : (isHapticEnabled ? 'Haptic On' : 'Haptic Off')}
            </span>
          </button>
        }
      />

      <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-10">
        {/* 1. Scoreboard Section */}
        <div className="space-y-1.5">
          <SectionHeader
            title={isThai ? `คอร์ท 3 · เซ็ต ${match.currentSet}` : `LIVE COURT 3 · SET ${match.currentSet}`}
            subtitle={isThai ? 'แตะปุ่มด้านล่างเพื่อเพิ่มแต้ม' : 'Service box auto-rotates'}
            badge={isThai ? `เสิร์ฟ: ทีม ${match.server}` : `Server ${match.server}`}
            badgeVariant="green"
          />

          <div className="rounded-[28px] p-4 bg-[#ffffff] space-y-3 shadow-xs">
            <div className="grid grid-cols-2 gap-3 items-center">
              {/* Team A (Player) */}
              <div
                className={`text-center p-4 rounded-[22px] bg-[#7cd7a0] text-[#000000] transition-transform duration-150 ${
                  pulsingTeam === 'A' ? 'scale-[1.03] ring-2 ring-[#000000]' : 'scale-100'
                }`}
              >
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
              <div
                className={`text-center p-4 rounded-[22px] bg-[#e8f7ee] text-[#000000] transition-transform duration-150 ${
                  pulsingTeam === 'B' ? 'scale-[1.03] ring-2 ring-[#000000]' : 'scale-100'
                }`}
              >
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
                onClick={handleUndoPoint}
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
            title={isThai ? 'พากย์เสียงข้างสนาม' : 'LIVE COMMENTARY'}
            subtitle={isThai ? 'วิเคราะห์เกมแบบเรียลไทม์' : 'Real-time courtside audio'}
            badge={isThai ? 'พากย์สด' : 'AUDIO'}
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
                  triggerHaptic('light', isHapticEnabled);
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
            title={isThai ? 'ช็อตทำแต้ม' : 'POINT WINNER SHOT'}
            subtitle={isThai ? 'เลือกช็อตเพื่อบันทึกสถิติ' : 'Select winning shot'}
            badge={isThai ? 'ช็อต' : 'SHOT'}
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
                    onClick={() => handleSelectShot(item.type)}
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
            title={isThai ? 'กดเพิ่มแต้ม' : 'TAP TO SCORE (+1)'}
            badge={isHapticEnabled ? (isThai ? 'สั่นเปิด' : 'Haptic On') : (isThai ? 'กดด่วน' : 'Quick Tap')}
            badgeVariant={isHapticEnabled ? 'green' : 'soft'}
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleScoreTeamA}
              className="doodle-cta py-4 px-3 rounded-[24px] font-bold tracking-[0.02em] text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer bg-[#7cd7a0] hover:bg-[#6bc991] text-[#000000] whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[3] shrink-0" />
              <span className="truncate">{match.playerAName}</span>
            </button>

            <button
              type="button"
              onClick={handleScoreTeamB}
              className="doodle-cta py-4 px-3 rounded-[24px] font-bold tracking-[0.02em] text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e8f7ee] text-[#000000] whitespace-nowrap"
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
          <span className="whitespace-nowrap">
            {isThai ? 'จบแมตช์และบันทึกผล' : 'FINISH & SAVE MATCH'}
          </span>
        </button>
      </div>
    </div>
  );
};
