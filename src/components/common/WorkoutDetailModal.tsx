import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Flame, Heart, Play, Share2, Sparkles, Trophy, Users, X, Zap, Check } from 'lucide-react';
import { playCoinSound, playSelectSound, playSmashSound } from '../../utils/retroAudio';
import { useApp } from '../../context/AppContext';

export interface WorkoutDetailData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  schedule: string;
  intensity: 'Low' | 'Medium' | 'High';
  intensityLabel: string;
  tags: string[];
  trainerName: string;
  trainerRole: string;
  trainerAvatar: string;
  courtName: string;
  videoPreviewUrl: string;
  targetScreen?: string;
  rating: string;
  caloriesBurnEstimate: number;
  durationMin: number;
}

interface WorkoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: WorkoutDetailData | null;
  onChangeMoodClick?: () => void;
  onStartTraining: () => void;
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  isOpen,
  onClose,
  workout,
  onChangeMoodClick,
  onStartTraining,
}) => {
  const { gainExp } = useApp();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  if (!isOpen || !workout) return null;

  const handleStart = () => {
    playSmashSound();
    gainExp(60, `เริ่มการซ้อม: ${workout.title}`);
    onStartTraining();
    onClose();
  };

  const handleToggleFavorite = () => {
    playCoinSound();
    setIsFavorite(!isFavorite);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#000000]/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 25 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="w-full max-w-sm bg-[#ffffff] rounded-[32px] border-2 border-[#000000] shadow-2xl flex flex-col overflow-hidden max-h-[92vh]"
        >
          {/* Top Bar (Video 00:11: < Workouts / Fits your mood today / Change my mood >) */}
          <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between border-b border-[#000000]/10">
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#000000] cursor-pointer hover:opacity-75"
            >
              <div className="w-7 h-7 rounded-[1600px] bg-[#f3f4f6] border border-[#000000] flex items-center justify-center">
                <ArrowLeft className="w-3.5 h-3.5 text-[#000000]" />
              </div>
              <span>Workouts</span>
            </button>

            {onChangeMoodClick && (
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  onChangeMoodClick();
                }}
                className="text-[11px] font-bold text-[#fb4903] hover:underline cursor-pointer whitespace-nowrap"
              >
                Change my mood &gt;
              </button>
            )}
          </div>

          {/* Subheader */}
          <div className="px-4 pt-2">
            <span className="text-[10px] text-[#000000]/60 font-bold uppercase tracking-wider block">
              Fits your mood today · แมตช์ที่ตรงกับพลังงานของคุณ
            </span>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3.5">
            {/* Main Video / Trainer Preview Card (Faithful to video 00:11 - 00:13) */}
            <div className="relative w-full aspect-[4/5] bg-[#243b34] rounded-[28px] border-2 border-[#000000] overflow-hidden shadow-md flex flex-col justify-between p-3.5">
              <img
                src={workout.videoPreviewUrl}
                alt={workout.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-[#000000]/40 pointer-events-none" />

              {/* Top Controls on Video: Rating & Heart */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#000000]/70 backdrop-blur-xs text-[#ffffff] border border-[#ffffff]/30 text-[9px] font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#fb4903]" />
                  <span>{workout.intensityLabel}</span>
                </span>

                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="w-9 h-9 rounded-full bg-[#ffffff]/90 backdrop-blur-xs border border-[#000000] flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-transform shadow-sm"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isFavorite ? 'fill-[#fb4903] text-[#fb4903]' : 'text-[#000000]'
                    }`}
                  />
                </button>
              </div>

              {/* Bottom of Video: Prominent "Start Training" Button inside media (Video 00:11) */}
              <div className="relative z-10 space-y-2">
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#ffffff]/90 bg-[#000000]/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-[#ffffff]/20">
                    ⏱️ ประมาณ {workout.durationMin} นาที · เบิร์น ~{workout.caloriesBurnEstimate} kcal
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full py-3 rounded-[1600px] bg-[#fb4903] hover:bg-[#ff5a1a] text-[#ffffff] border-2 border-[#000000] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform shadow-lg"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start training · เริ่มเซสชันนี้</span>
                </button>
              </div>
            </div>

            {/* Session Info Details (Exact VibeMove video 00:11 text hierarchy) */}
            <div className="space-y-2">
              <h3 className="text-lg font-black text-[#000000] font-['Antonio',sans-serif] uppercase tracking-wide leading-tight">
                {workout.title}
              </h3>

              <div className="flex items-center gap-2 text-xs font-bold text-[#000000]/75">
                <Clock className="w-3.5 h-3.5 text-[#5c4ade]" />
                <span>{workout.schedule}</span>
                <span>·</span>
                <span className="truncate">{workout.courtName}</span>
              </div>

              <p className="text-[11px] text-[#000000]/80 font-medium leading-relaxed">
                {workout.subtitle}
              </p>

              {/* Tags Row */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {workout.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-[1600px] bg-[#dceeff] border border-[#000000] text-[#000000] text-[10px] font-bold shrink-0 whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Trainer / Host Pill Card */}
              <div className="p-2.5 rounded-[20px] bg-[#f8fbff] border border-[#000000] flex items-center justify-between gap-2.5 mt-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={workout.trainerAvatar}
                    alt={workout.trainerName}
                    className="w-9 h-9 rounded-[14px] object-cover border border-[#000000] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-[#000000] truncate">{workout.trainerName}</p>
                    <p className="text-[10px] text-[#000000]/60 font-semibold truncate">{workout.trainerRole}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-[#ffd731] border border-[#000000] text-[10px] font-black text-[#000000] shrink-0">
                  ★ {workout.rating}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
