import React from 'react';
import { Footprints, Flame, Clock, ChevronRight } from 'lucide-react';
import { playSelectSound } from '../../utils/retroAudio';
import { useApp } from '../../context/AppContext';

interface ProgressRingsWidgetProps {
 steps?: number;
 stepsTarget?: number;
 calories?: number;
 caloriesTarget?: number;
 activityMinutes?: number;
 activityTargetMinutes?: number;
 onSeeActivityClick?: () => void;
}

export const ProgressRingsWidget: React.FC<ProgressRingsWidgetProps> = ({
 steps = 4820,
 stepsTarget = 6000,
 calories = 680,
 caloriesTarget = 800,
 activityMinutes = 105, // 1h 45m
 activityTargetMinutes = 120, // 2h
 onSeeActivityClick,
}) => {
 const { language } = useApp();
 const isThai = language === 'th';

 // Circular ring calculations
 const radius = 17;
 const circumference = 2 * Math.PI * radius;

 const stepsPct = Math.min(100, Math.round((steps / stepsTarget) * 100));
 const caloriesPct = Math.min(100, Math.round((calories / caloriesTarget) * 100));
 const activityPct = Math.min(100, Math.round((activityMinutes / activityTargetMinutes) * 100));

 const formatHoursMinutes = (totalMin: number) => {
 const h = Math.floor(totalMin / 60);
 const m = totalMin % 60;
 if (isThai) {
 return `${h} ชม. ${m} นาที`;
 }
 return `${h}h ${m}m`;
 };

 return (
 <div className="space-y-2">
 {/* Header row - Strictly single language */}
 <div className="flex items-center justify-between">
 <h2 className="text-sm font-black text-[#000000] uppercase tracking-wide font-['Antonio',sans-serif]">
 {isThai ? 'ความก้าวหน้าของคุณ' : 'Your Progress'}
 </h2>
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 if (onSeeActivityClick) onSeeActivityClick();
 }}
 className="text-xs font-bold text-[#000000]/70 hover:text-[#000000] flex items-center gap-0.5 cursor-pointer"
 >
 <span>{isThai ? 'ดูสถิติ' : 'See activity'}</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>

 {/* 3 Progress Cards Grid */}
 <div className="grid grid-cols-3 gap-2">
 {/* Card 1: Steps */}
 <div
 onClick={() => {
 playSelectSound();
 if (onSeeActivityClick) onSeeActivityClick();
 }}
 className="bg-[#ffffff] rounded-[22px] shadow-sm p-2.5 flex flex-col justify-between aspect-square hover:shadow-md transition-all cursor-pointer active:scale-98"
 >
 <div className="relative w-10 h-10 mx-auto">
 <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
 <circle
 cx="22"
 cy="22"
 r={radius}
 className="stroke-[#eeeeee]"
 strokeWidth="4"
 fill="none"
 />
 <circle
 cx="22"
 cy="22"
 r={radius}
 className="stroke-[#55db9c] transition-all duration-1000 ease-out"
 strokeWidth="4"
 strokeDasharray={circumference}
 strokeDashoffset={circumference - (stepsPct / 100) * circumference}
 strokeLinecap="round"
 fill="none"
 />
 </svg>
 <div className="absolute inset-0 flex items-center justify-center">
 <Footprints className="w-4 h-4 text-[#000000]" />
 </div>
 </div>

 <div className="text-center">
 <div className="text-xs font-black text-[#000000] font-['Antonio',sans-serif]">
 {steps.toLocaleString()}
 </div>
 <div className="text-[10px] text-[#000000]/60 font-bold truncate">
 {isThai ? 'ก้าว' : 'steps'}
 </div>
 </div>
 </div>

 {/* Card 2: Calories */}
 <div
 onClick={() => {
 playSelectSound();
 if (onSeeActivityClick) onSeeActivityClick();
 }}
 className="bg-[#ffffff] rounded-[22px] shadow-sm p-2.5 flex flex-col justify-between aspect-square hover:shadow-md transition-all cursor-pointer active:scale-98"
 >
 <div className="relative w-10 h-10 mx-auto">
 <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
 <circle
 cx="22"
 cy="22"
 r={radius}
 className="stroke-[#eeeeee]"
 strokeWidth="4"
 fill="none"
 />
 <circle
 cx="22"
 cy="22"
 r={radius}
 className="stroke-[#fb4903] transition-all duration-1000 ease-out"
 strokeWidth="4"
 strokeDasharray={circumference}
 strokeDashoffset={circumference - (caloriesPct / 100) * circumference}
 strokeLinecap="round"
 fill="none"
 />
 </svg>
 <div className="absolute inset-0 flex items-center justify-center">
 <Flame className="w-4 h-4 text-[#fb4903]" />
 </div>
 </div>

 <div className="text-center">
 <div className="text-xs font-black text-[#000000] font-['Antonio',sans-serif]">
 {calories}
 </div>
 <div className="text-[10px] text-[#000000]/60 font-bold truncate">
 {isThai ? 'แคลอรี่' : 'kcal'}
 </div>
 </div>
 </div>

 {/* Card 3: Activity Court Time */}
 <div
 onClick={() => {
 playSelectSound();
 if (onSeeActivityClick) onSeeActivityClick();
 }}
 className="bg-[#ffffff] rounded-[22px] shadow-sm p-2.5 flex flex-col justify-between aspect-square hover:shadow-md transition-all cursor-pointer active:scale-98"
 >
 <div className="relative w-10 h-10 mx-auto">
 <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
 <circle
 cx="22"
 cy="22"
 r={radius}
 className="stroke-[#eeeeee]"
 strokeWidth="4"
 fill="none"
 />
 <circle
 cx="22"
 cy="22"
 r={radius}
 className="stroke-[#ffd731] transition-all duration-1000 ease-out"
 strokeWidth="4"
 strokeDasharray={circumference}
 strokeDashoffset={circumference - (activityPct / 100) * circumference}
 strokeLinecap="round"
 fill="none"
 />
 </svg>
 <div className="absolute inset-0 flex items-center justify-center">
 <Clock className="w-4 h-4 text-[#000000]" />
 </div>
 </div>

 <div className="text-center">
 <div className="text-xs font-black text-[#000000] font-['Antonio',sans-serif]">
 {formatHoursMinutes(activityMinutes)}
 </div>
 <div className="text-[10px] text-[#000000]/60 font-bold truncate">
 {isThai ? 'เวลาในสนาม' : 'court activity'}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
