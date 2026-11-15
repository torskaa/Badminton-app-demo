import React, { useEffect, useMemo, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Zap,
  Film,
} from 'lucide-react';
import { MatchScoreState, ShotType } from '../../types';
import { SectionHeader } from './SectionHeader';
import { playSelectSound } from '../../utils/retroAudio';

interface ReplayPointFrame {
  step: number;
  pointNumber: number;
  team: 'A' | 'B';
  shotType: ShotType;
  timestamp: string;
  scoreA: number;
  scoreB: number;
}

interface MatchReplayTimelineProps {
  match: MatchScoreState;
  isThai: boolean;
}

const FALLBACK_SEQUENCE: { team: 'A' | 'B'; shotType: ShotType }[] = [
  { team: 'A', shotType: 'Drop' },
  { team: 'B', shotType: 'Drive' },
  { team: 'A', shotType: 'Smash' },
  { team: 'A', shotType: 'Net' },
  { team: 'B', shotType: 'Clear' },
  { team: 'A', shotType: 'Smash' },
];

const SHOT_LABEL_TH: Record<ShotType, string> = {
  Smash: 'ตบ',
  Drop: 'หยอด',
  Net: 'หน้าเน็ต',
  Drive: 'ดรายฟ์',
  Clear: 'เคลียร์',
  Lift: 'งัดโด่ง',
};

export const MatchReplayTimeline: React.FC<MatchReplayTimelineProps> = ({
  match,
  isThai,
}) => {
  const frames: ReplayPointFrame[] = useMemo(() => {
    // Reconstruct chronological order of logged shots
    const logged = [...match.shotHistory].sort((a, b) => a.pointNumber - b.pointNumber);

    // Ensure at least 6 points to visualize an engaging rally replay even on fresh matches
    const sourceEvents: { team: 'A' | 'B'; shotType: ShotType; timestamp: string; pointNumber: number }[] =
      logged.length >= 4
        ? logged.slice(-10).map((s) => ({
            team: s.team,
            shotType: s.shotType,
            timestamp: s.timestamp,
            pointNumber: s.pointNumber,
          }))
        : [
            ...FALLBACK_SEQUENCE.slice(0, Math.max(0, 6 - logged.length)).map((item, idx) => ({
              team: item.team,
              shotType: item.shotType,
              timestamp: '19:40',
              pointNumber: Math.max(1, (logged[0]?.pointNumber || 10) - (6 - logged.length) + idx),
            })),
            ...logged.map((s) => ({
              team: s.team,
              shotType: s.shotType,
              timestamp: s.timestamp,
              pointNumber: s.pointNumber,
            })),
          ];

    // Walk backwards from final match.scoreA / match.scoreB so final frame lands cleanly on current score
    const countA = sourceEvents.filter((e) => e.team === 'A').length;
    const countB = sourceEvents.filter((e) => e.team === 'B').length;
    let runningA = Math.max(0, match.scoreA - countA);
    let runningB = Math.max(0, match.scoreB - countB);

    return sourceEvents.map((ev, index) => {
      if (ev.team === 'A') {
        runningA += 1;
      } else {
        runningB += 1;
      }
      return {
        step: index,
        pointNumber: ev.pointNumber,
        team: ev.team,
        shotType: ev.shotType,
        timestamp: ev.timestamp,
        scoreA: runningA,
        scoreB: runningB,
      };
    });
  }, [match.shotHistory, match.scoreA, match.scoreB]);

  const [currentStep, setCurrentStep] = useState<number>(Math.max(0, frames.length - 1));
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2>(1);

  // Sync step bounds if frames change
  useEffect(() => {
    setCurrentStep(Math.max(0, frames.length - 1));
    setIsPlaying(false);
  }, [frames.length]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;

    const intervalMs = speedMultiplier === 2 ? 480 : 900;
    const timer = window.setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= frames.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [isPlaying, frames.length, speedMultiplier]);

  const activeFrame = frames[Math.min(currentStep, frames.length - 1)] || {
    step: 0,
    pointNumber: 1,
    team: 'A' as const,
    shotType: 'Smash' as ShotType,
    timestamp: '19:44',
    scoreA: match.scoreA,
    scoreB: match.scoreB,
  };

  const progressPct =
    frames.length <= 1 ? 100 : Math.round((currentStep / (frames.length - 1)) * 100);

  const handlePlayToggle = () => {
    playSelectSound();
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (currentStep >= frames.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handleRestart = () => {
    playSelectSound();
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleStep = (delta: -1 | 1) => {
    playSelectSound();
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(0, Math.min(frames.length - 1, prev + delta)));
  };

  return (
    <div className="space-y-2">
      <SectionHeader
        title={isThai ? 'รีเพลย์ลำดับคะแนน' : 'MATCH REPLAY TIMELINE'}
        subtitle={
          isThai
            ? 'ย้อนชมจังหวะทำแต้มทีละช็อต'
            : 'Animated point-by-point rally replay'
        }
        badge={isPlaying ? (isThai ? 'กำลังเล่น' : 'PLAYING') : `${currentStep + 1}/${frames.length}`}
        badgeVariant={isPlaying ? 'orange' : 'green'}
      />

      <div className="rounded-[28px] p-4 bg-[#ffffff] shadow-sm space-y-3.5">
        {/* Animated Live Score Slate for Current Replay Step */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div
            className={`rounded-[18px] p-2.5 text-center transition-all duration-300 ${
              activeFrame.team === 'A'
                ? 'bg-[#7cd7a0] ring-2 ring-[#000000] scale-[1.02]'
                : 'bg-[#f4f8fb] opacity-85'
            }`}
          >
            <div className="text-[10px] font-bold text-[#000000]/75 truncate">
              {match.playerAName}
            </div>
            <div className="font-['Antonio',sans-serif] text-3xl font-black text-[#000000] tabular-nums leading-none mt-1">
              {activeFrame.scoreA}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-1 text-center">
            <div className="w-7 h-7 rounded-full bg-[#000000] text-[#ffffff] flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-[#7cd7a0]" />
            </div>
            <span className="text-[9px] font-bold text-[#000000]/55 tabular-nums mt-1 whitespace-nowrap">
              {isThai ? `แต้ม ${activeFrame.pointNumber}` : `PT #${activeFrame.pointNumber}`}
            </span>
          </div>

          <div
            className={`rounded-[18px] p-2.5 text-center transition-all duration-300 ${
              activeFrame.team === 'B'
                ? 'bg-[#e85729] text-[#ffffff] ring-2 ring-[#000000] scale-[1.02]'
                : 'bg-[#f4f8fb] text-[#000000] opacity-85'
            }`}
          >
            <div
              className={`text-[10px] font-bold truncate ${
                activeFrame.team === 'B' ? 'text-[#ffffff]/90' : 'text-[#000000]/75'
              }`}
            >
              {match.playerBName}
            </div>
            <div className="font-['Antonio',sans-serif] text-3xl font-black tabular-nums leading-none mt-1">
              {activeFrame.scoreB}
            </div>
          </div>
        </div>

        {/* Active Shot Event Banner */}
        <div className="rounded-[16px] bg-[#f4f8fb] px-3 py-2 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                activeFrame.team === 'A' ? 'bg-[#15803d]' : 'bg-[#e85729]'
              }`}
            />
            <span className="font-bold text-[#000000] truncate">
              {activeFrame.team === 'A' ? match.playerAName : match.playerBName}{' '}
              {isThai ? 'ได้แต้มจาก' : 'scored via'}{' '}
              <span className="text-[#15803d]">
                {isThai ? SHOT_LABEL_TH[activeFrame.shotType] || activeFrame.shotType : activeFrame.shotType}
              </span>
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#000000]/55 tabular-nums shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#e85729]" />
            <span>{activeFrame.timestamp}</span>
          </span>
        </div>

        {/* Animated Timeline Track & Clickable Point Nodes */}
        <div className="space-y-2">
          <div className="w-full h-1.5 rounded-full bg-[#e5e7eb] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#000000] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {frames.map((frame, idx) => {
              const isReached = idx <= currentStep;
              const isCurrent = idx === currentStep;
              return (
                <button
                  key={`${frame.pointNumber}_${idx}`}
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setIsPlaying(false);
                    setCurrentStep(idx);
                  }}
                  title={`${frame.scoreA}-${frame.scoreB} (${isThai ? SHOT_LABEL_TH[frame.shotType] || frame.shotType : frame.shotType})`}
                  className={`no-doodle min-w-[38px] px-2 py-1.5 rounded-[12px] flex flex-col items-center justify-center transition-all cursor-pointer shrink-0 ${
                    isCurrent
                      ? frame.team === 'A'
                        ? 'bg-[#7cd7a0] text-[#000000] ring-2 ring-[#000000] scale-105'
                        : 'bg-[#e85729] text-[#ffffff] ring-2 ring-[#000000] scale-105'
                      : isReached
                      ? frame.team === 'A'
                        ? 'bg-[#e8f7ee] text-[#000000]'
                        : 'bg-[#fff1ec] text-[#000000]'
                      : 'bg-[#f4f8fb] text-[#000000]/35 opacity-60'
                  }`}
                >
                  <span className="text-[9px] font-black leading-none">
                    {frame.team}
                  </span>
                  <span className="text-[10px] font-bold tabular-nums leading-tight mt-0.5">
                    {frame.scoreA}-{frame.scoreB}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div data-filter="true" className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleRestart}
              aria-label={isThai ? 'เริ่มใหม่' : 'Restart replay'}
              className="w-8 h-8 rounded-full bg-[#f4f8fb] hover:bg-[#e5e7eb] text-[#000000] flex items-center justify-center cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleStep(-1)}
              disabled={currentStep <= 0}
              aria-label={isThai ? 'แต้มก่อนหน้า' : 'Previous point'}
              className="w-8 h-8 rounded-full bg-[#f4f8fb] hover:bg-[#e5e7eb] disabled:opacity-35 text-[#000000] flex items-center justify-center cursor-pointer transition-colors"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleStep(1)}
              disabled={currentStep >= frames.length - 1}
              aria-label={isThai ? 'แต้มถัดไป' : 'Next point'}
              className="w-8 h-8 rounded-full bg-[#f4f8fb] hover:bg-[#e5e7eb] disabled:opacity-35 text-[#000000] flex items-center justify-center cursor-pointer transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setSpeedMultiplier((prev) => (prev === 1 ? 2 : 1));
              }}
              className="px-2.5 h-8 rounded-full bg-[#f4f8fb] hover:bg-[#e5e7eb] text-[#000000] text-[10px] font-black tabular-nums cursor-pointer transition-colors whitespace-nowrap"
            >
              {speedMultiplier}x
            </button>
          </div>

          <button
            type="button"
            onClick={handlePlayToggle}
            className={`px-4 py-2 rounded-[1600px] text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-transform ${
              isPlaying
                ? 'bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff]'
                : 'bg-[#7cd7a0] hover:bg-[#6bc991] text-[#000000]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 shrink-0" />
                <span>{isThai ? 'หยุดชั่วคราว' : 'Pause'}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 shrink-0 fill-current" />
                <span>
                  {currentStep >= frames.length - 1
                    ? isThai
                      ? 'เล่นรีเพลย์'
                      : 'Play Replay'
                    : isThai
                    ? 'เล่นต่อ'
                    : 'Resume'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
