import React from 'react';
import { ScreenId } from '../../types';

export type SkeletonVariant = 'home' | 'profile' | 'map' | 'finance' | 'club_tools' | 'generic';

export interface LoadingSkeletonProps {
 variant?: SkeletonVariant;
 screen?: ScreenId;
 className?: string;
 animate?: boolean;
 message?: string;
}

/**
 * Shimmer element with subtle pulse and Slush design tokens
 */
const Bone: React.FC<{
  className?: string;
  rounded?: string;
  border?: boolean;
}> = ({ className = 'h-4 w-full', rounded = 'rounded-[1600px]' }) => (
  <div
    className={`bg-[#e4effa] animate-pulse ${rounded} ${className}`}
  />
);

/**
 * Loading Skeleton mimicking HomeScreen layout
 */
const HomeSkeleton: React.FC = () => {
 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-y-auto no-scrollbar pb-28">
 {/* 1. Header Card */}
 <div className="bg-[#ffffff] px-4 pt-3 pb-12 space-y-3 relative">
 <div className="flex items-center justify-between gap-2.5">
 {/* QR Button skeleton */}
 <Bone className="w-9 h-9 shrink-0" rounded="rounded-[1600px]" />

 {/* Search bar skeleton */}
 <div className="flex-1 h-9 rounded-[1600px] bg-[#f0f4f8] flex items-center px-3 gap-2">
 <Bone className="w-4 h-4 shrink-0" rounded="rounded-full" />
 <Bone className="h-3 w-36" />
 </div>

 {/* Coins & Avatar */}
 <div className="flex items-center gap-1.5 shrink-0">
 <Bone className="w-14 h-7" rounded="rounded-[1600px]" />
 <Bone className="w-9 h-9" rounded="rounded-[1600px]" />
 </div>
 </div>

 {/* Greeting Banner */}
 <div className="flex items-center justify-between pt-1">
 <div className="space-y-1.5">
 <Bone className="h-6 w-36" rounded="rounded-[12px]" />
 <Bone className="h-3.5 w-48" />
 </div>
 <Bone className="h-6 w-20" rounded="rounded-[1600px]" />
 </div>
 </div>

 {/* 2. Floating Quick Info Widget */}
 <div className="px-4 -mt-8 z-10">
 <div className="bg-[#ffffff] rounded-[28px] p-3.5 shadow-sm space-y-2.5">
 <div className="flex items-center justify-between pb-1.5 ">
 <Bone className="h-4 w-32" rounded="rounded-[1600px]" />
 <Bone className="h-3 w-24" />
 </div>
 <div className="grid grid-cols-2 gap-3 ">
 <div className="space-y-1.5 pr-2">
 <Bone className="h-3 w-20" />
 <Bone className="h-5 w-24" />
 <Bone className="h-3 w-16" />
 </div>
 <div className="space-y-1.5 pl-3">
 <Bone className="h-3 w-20" />
 <Bone className="h-4 w-28" />
 <Bone className="h-3 w-24" />
 </div>
 </div>
 </div>
 </div>

 {/* 3. AI Smart Insight Banner Skeleton */}
 <div className="px-4 mt-3">
 <div className="p-3.5 rounded-[24px] bg-[#fffbed] space-y-2 shadow-xs">
 <div className="flex items-center justify-between pb-1 ">
 <Bone className="h-4 w-44" rounded="rounded-[1600px]" />
 <Bone className="h-3 w-4" rounded="rounded-full" />
 </div>
 <Bone className="h-3.5 w-full" />
 <Bone className="h-3.5 w-5/6" />
 <div className="flex gap-2 pt-1">
 <Bone className="h-6 w-32" rounded="rounded-[1600px]" />
 <Bone className="h-6 w-28" rounded="rounded-[1600px]" />
 </div>
 </div>
 </div>

 {/* 4. Top Quick Action Dual Pills */}
 <div className="px-4 mt-3 space-y-1.5">
 <div className="flex justify-between px-1">
 <Bone className="h-3 w-28" />
 <Bone className="h-3 w-16" />
 </div>
 <div className="grid grid-cols-2 gap-2.5">
 <Bone className="h-11" rounded="rounded-[1600px]" />
 <Bone className="h-11" rounded="rounded-[1600px]" />
 </div>
 </div>

 {/* 5. Services Matrix (Grid 4x2 in 1:1 Aspect Ratio) */}
 <div className="px-4 mt-5 space-y-2.5">
 <div className="flex justify-between items-center">
 <Bone className="h-4 w-36" />
 <Bone className="h-3 w-16" />
 </div>
 <div className="grid grid-cols-4 gap-2">
 {Array.from({ length: 8 }).map((_, i) => (
 <div
 key={i}
 className="p-2 rounded-[20px] bg-[#ffffff] flex flex-col items-center justify-between aspect-square"
 >
 <Bone className="w-9 h-9 mt-0.5" rounded="rounded-[1600px]" />
 <Bone className="h-2.5 w-12" />
 </div>
 ))}
 </div>
 </div>

 {/* 6. Grab-Style Recommended for You Carousel */}
 <div className="px-4 mt-6 space-y-3">
 <div className="flex justify-between items-center">
 <div className="space-y-1">
 <Bone className="h-5 w-44" />
 <Bone className="h-3 w-56" />
 </div>
 <Bone className="h-5 w-14" rounded="rounded-[1600px]" />
 </div>

 {/* Filter Pills */}
 <div className="flex gap-1.5 overflow-hidden">
 <Bone className="h-7 w-20" rounded="rounded-[1600px]" />
 <Bone className="h-7 w-24" rounded="rounded-[1600px]" />
 <Bone className="h-7 w-24" rounded="rounded-[1600px]" />
 <Bone className="h-7 w-20" rounded="rounded-[1600px]" />
 </div>

 {/* Cards Row */}
 <div className="flex gap-3 overflow-hidden -mx-4 px-4">
 <div className="w-[280px] shrink-0 bg-[#ffffff] rounded-[28px] p-4 space-y-3">
 <div className="flex justify-between">
 <Bone className="h-4 w-28" rounded="rounded-[1600px]" />
 <Bone className="h-4 w-10" rounded="rounded-[1600px]" />
 </div>
 <Bone className="h-5 w-48" />
 <Bone className="h-3.5 w-full" />
 <Bone className="h-8 w-full" rounded="rounded-[1600px]" />
 </div>
 <div className="w-[280px] shrink-0 bg-[#ffffff] rounded-[28px] p-4 space-y-3 opacity-60">
 <div className="flex justify-between">
 <Bone className="h-4 w-28" rounded="rounded-[1600px]" />
 <Bone className="h-4 w-10" rounded="rounded-[1600px]" />
 </div>
 <Bone className="h-5 w-48" />
 <Bone className="h-3.5 w-full" />
 <Bone className="h-8 w-full" rounded="rounded-[1600px]" />
 </div>
 </div>
 </div>

 {/* 7. Book a Court 16:9 Feed */}
 <div className="px-4 mt-6 space-y-3">
 <div className="flex justify-between items-center">
 <Bone className="h-5 w-36" />
 <Bone className="h-3 w-16" />
 </div>
 <div className="bg-[#ffffff] rounded-[28px] overflow-hidden space-y-3 p-3">
 <Bone className="w-full aspect-[16/9]" rounded="rounded-[20px]" />
 <div className="space-y-2">
 <div className="flex justify-between">
 <Bone className="h-5 w-48" />
 <Bone className="h-5 w-12" rounded="rounded-[1600px]" />
 </div>
 <Bone className="h-3.5 w-36" />
 <div className="flex justify-between pt-1">
 <div className="flex gap-1.5">
 <Bone className="h-5 w-16" rounded="rounded-[1600px]" />
 <Bone className="h-5 w-16" rounded="rounded-[1600px]" />
 </div>
 <Bone className="h-7 w-20" rounded="rounded-[1600px]" />
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

/**
 * Loading Skeleton mimicking User Profile Screen (F1)
 */
const ProfileSkeleton: React.FC = () => {
 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-y-auto no-scrollbar pb-28">
 {/* Header bar */}
 <div className="px-4 py-3 bg-[#ffffff] flex items-center justify-between">
 <Bone className="h-6 w-44" />
 <Bone className="w-8 h-8" rounded="rounded-full" />
 </div>

 {/* Segmented Tab Bar (4 pills) */}
 <div className="px-4 py-3 bg-[#ffffff] flex items-center gap-1.5">
 <Bone className="flex-1 h-8" rounded="rounded-[1600px]" />
 <Bone className="flex-1 h-8" rounded="rounded-[1600px]" />
 <Bone className="flex-1 h-8" rounded="rounded-[1600px]" />
 <Bone className="flex-1 h-8" rounded="rounded-[1600px]" />
 </div>

 <div className="p-4 space-y-4">
 {/* Athlete Trading Card (Gold with black border) */}
 <div className="w-full rounded-[32px] bg-[#ffd731]/80 p-4 space-y-3">
 <div className="flex items-center justify-between pb-2 ">
 <Bone className="h-4 w-32" rounded="rounded-[1600px]" />
 <Bone className="h-3 w-20" />
 </div>

 <div className="flex items-start justify-between">
 <div className="space-y-1.5">
 <Bone className="h-12 w-20" rounded="rounded-[14px]" />
 <Bone className="h-3 w-28" />
 <Bone className="h-4 w-24" rounded="rounded-[1600px]" />
 </div>
 <Bone className="w-16 h-16" rounded="rounded-[20px]" />
 </div>

 <div className="text-center pt-2.5 flex flex-col items-center gap-1">
 <Bone className="h-6 w-40" />
 <Bone className="h-3 w-32" />
 </div>

 {/* Radar Stat Pills: POW / SPD / CTL */}
 <div className="grid grid-cols-3 gap-2 pt-2.5 ">
 <div className="p-2 rounded-[16px] bg-[#ffffff] flex flex-col items-center gap-1">
 <Bone className="h-2.5 w-8" />
 <Bone className="h-5 w-10" />
 </div>
 <div className="p-2 rounded-[16px] bg-[#ffffff] flex flex-col items-center gap-1">
 <Bone className="h-2.5 w-8" />
 <Bone className="h-5 w-10" />
 </div>
 <div className="p-2 rounded-[16px] bg-[#ffffff] flex flex-col items-center gap-1">
 <Bone className="h-2.5 w-8" />
 <Bone className="h-5 w-10" />
 </div>
 </div>
 </div>

 {/* Past Match Results Section Skeleton */}
 <div className="w-full p-4 rounded-[28px] bg-[#ffffff] space-y-3">
 <div className="flex items-center justify-between pb-2 ">
 <div className="flex items-center gap-2">
 <Bone className="w-8 h-8" rounded="rounded-[1600px]" />
 <div className="space-y-1">
 <Bone className="h-4 w-36" />
 <Bone className="h-2.5 w-28" />
 </div>
 </div>
 <Bone className="h-6 w-16" rounded="rounded-[1600px]" />
 </div>

 {/* Quick stats strip */}
 <div className="grid grid-cols-3 gap-2">
 <Bone className="h-14" rounded="rounded-[16px]" />
 <Bone className="h-14" rounded="rounded-[16px]" />
 <Bone className="h-14" rounded="rounded-[16px]" />
 </div>

 {/* Match cards */}
 <div className="space-y-2.5 pt-1">
 {Array.from({ length: 2 }).map((_, idx) => (
 <div
 key={idx}
 className="rounded-[20px] bg-[#f8fbff] p-3 space-y-2"
 >
 <div className="flex justify-between">
 <Bone className="h-3 w-32" />
 <Bone className="h-4 w-20" rounded="rounded-[1600px]" />
 </div>
 <div className="flex justify-between items-center pt-1 ">
 <div className="space-y-1">
 <Bone className="h-4 w-28" />
 <Bone className="h-3 w-40" />
 </div>
 <Bone className="h-7 w-12" rounded="rounded-[8px]" />
 </div>
 <div className="flex gap-1.5 pt-1">
 <Bone className="h-5 w-16" rounded="rounded-[8px]" />
 <Bone className="h-5 w-16" rounded="rounded-[8px]" />
 <Bone className="h-5 w-16" rounded="rounded-[8px]" />
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Active Booking Pass Skeleton */}
 <div className="w-full p-4 rounded-[28px] bg-[#ffffff] space-y-2">
 <div className="flex justify-between pb-1 ">
 <Bone className="h-3.5 w-28" rounded="rounded-[1600px]" />
 <Bone className="h-3.5 w-16" />
 </div>
 <div className="flex items-center gap-3">
 <Bone className="w-10 h-10 shrink-0" rounded="rounded-[1600px]" />
 <div className="space-y-1 flex-1">
 <Bone className="h-4 w-36" />
 <Bone className="h-3 w-48" />
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

/**
 * Loading Skeleton mimicking Court Map Screen
 */
const MapSkeleton: React.FC = () => {
 return (
 <div className="flex-1 min-h-0 flex flex-col relative bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
 {/* 1. Map Canvas Placeholder with vector grid lines & pins */}
 <div className="absolute inset-0 w-full h-full bg-[#e8f3fc] overflow-hidden">
 {/* Abstract vector land shapes */}
 <div className="absolute top-12 left-8 w-44 h-44 rounded-full bg-[#d1fae5]/60 animate-pulse" />
 <div className="absolute top-28 right-6 w-36 h-36 rounded-full bg-[#d1fae5]/60 animate-pulse" />
 <div className="absolute bottom-40 left-12 w-48 h-48 rounded-full bg-[#d1fae5]/60 animate-pulse" />

 {/* Road Grid lines */}
 <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-[#ffd731]/30" />
 <div className="absolute top-1/3 left-0 right-0 h-2 bg-[#ffffff]/80" />
 <div className="absolute top-2/3 left-0 right-0 h-2.5 bg-[#ffffff]/80" />

 {/* Pulsing User Location Marker */}
 <div className="absolute top-[48%] left-[49%] -translate-x-1/2 -translate-y-1/2">
 <div className="w-8 h-8 rounded-full bg-[#5c4ade]/30 animate-ping absolute inset-0" />
 <div className="w-6 h-6 rounded-full bg-[#5c4ade] relative flex items-center justify-center">
 <div className="w-2 h-2 rounded-full bg-[#ffffff]" />
 </div>
 </div>

 {/* Map Pin Skeletons */}
 <div className="absolute top-[32%] left-[30%] flex flex-col items-center">
 <Bone className="w-12 h-5 shadow-sm" rounded="rounded-[1600px]" />
 <div className="w-7 h-7 rounded-full bg-[#55db9c] flex items-center justify-center -mt-1">
 <span className="text-[10px]">🏸</span>
 </div>
 </div>

 <div className="absolute top-[28%] right-[25%] flex flex-col items-center">
 <Bone className="w-12 h-5 shadow-sm" rounded="rounded-[1600px]" />
 <div className="w-7 h-7 rounded-full bg-[#55db9c] flex items-center justify-center -mt-1">
 <span className="text-[10px]">🏸</span>
 </div>
 </div>

 <div className="absolute top-[58%] right-[20%] flex flex-col items-center">
 <Bone className="w-12 h-5 shadow-sm" rounded="rounded-[1600px]" />
 <div className="w-7 h-7 rounded-full bg-[#55db9c] flex items-center justify-center -mt-1">
 <span className="text-[10px]">🏸</span>
 </div>
 </div>
 </div>

 {/* 2. Top Search & Filter Strip Overlay */}
 <div className="relative z-20 px-4 pt-3 space-y-2">
 <div className="bg-[#ffffff] rounded-[1600px] p-2.5 shadow-sm flex items-center justify-between gap-2">
 <div className="flex items-center gap-2 flex-1 pl-1">
 <Bone className="w-4 h-4 rounded-full" />
 <Bone className="h-3 w-40" />
 </div>
 <Bone className="w-7 h-7 rounded-[1600px]" />
 </div>

 {/* Suggestion Chips */}
 <div className="flex items-center gap-1.5 overflow-hidden">
 <Bone className="h-6 w-16" rounded="rounded-[1600px]" />
 <Bone className="h-6 w-28" rounded="rounded-[1600px]" />
 <Bone className="h-6 w-24" rounded="rounded-[1600px]" />
 </div>

 {/* Filter Pills */}
 <div className="flex items-center gap-1.5 overflow-hidden">
 <Bone className="h-7 w-20" rounded="rounded-[1600px]" />
 <Bone className="h-7 w-20" rounded="rounded-[1600px]" />
 <Bone className="h-7 w-24" rounded="rounded-[1600px]" />
 </div>
 </div>

 {/* 3. Floating Map Controls Skeleton */}
 <div className="absolute right-4 top-40 z-20 space-y-2">
 <Bone className="w-9 h-9" rounded="rounded-[1600px]" />
 <Bone className="w-9 h-18" rounded="rounded-[20px]" />
 </div>

 {/* 4. Bottom Sheet Container Skeleton (Peek ~148px) */}
 <div className="absolute bottom-0 left-0 right-0 z-30 bg-[#ffffff] rounded-t-[32px] shadow-2xl p-4 space-y-3">
 {/* Drag Handle */}
 <div className="w-10 h-1.5 bg-[#000000]/25 rounded-full mx-auto" />

 <div className="flex items-center justify-between pb-1 ">
 <Bone className="h-5 w-40" />
 <Bone className="h-3 w-16" />
 </div>

 {/* Court Card in Sheet */}
 <div className="p-3 rounded-[20px] bg-[#f8fbff] flex items-center justify-between gap-3">
 <div className="flex items-center gap-3 flex-1 min-w-0">
 <Bone className="w-14 h-14 shrink-0" rounded="rounded-[14px]" />
 <div className="space-y-1.5 flex-1 min-w-0">
 <Bone className="h-4 w-36" />
 <Bone className="h-3 w-48" />
 <Bone className="h-3 w-20" />
 </div>
 </div>
 <Bone className="h-8 w-20 shrink-0" rounded="rounded-[1600px]" />
 </div>
 </div>
 </div>
 );
};

/**
 * Loading Skeleton mimicking Finance Screen
 */
const FinanceSkeleton: React.FC = () => {
 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-y-auto no-scrollbar pb-28">
 <div className="bg-[#ffffff] px-4 pt-4 pb-12 space-y-2">
 <div className="flex items-center justify-between">
 <Bone className="h-7 w-48" />
 <Bone className="h-5 w-24" rounded="rounded-[1600px]" />
 </div>
 <Bone className="h-3.5 w-60" />
 </div>

 {/* Floating dual cards */}
 <div className="px-4 -mt-8 z-10 space-y-3">
 <div className="grid grid-cols-2 gap-3">
 <div className="bg-[#ffffff] rounded-[28px] p-4 h-32 flex flex-col justify-between">
 <Bone className="h-3 w-20" />
 <Bone className="h-7 w-28" />
 <Bone className="h-3 w-full" rounded="rounded-[1600px]" />
 </div>
 <div className="bg-[#ffffff] rounded-[28px] p-4 h-32 flex flex-col justify-between">
 <Bone className="h-3 w-20" />
 <Bone className="h-7 w-20" />
 <Bone className="h-3 w-full" rounded="rounded-[1600px]" />
 </div>
 </div>

 {/* Action buttons */}
 <div className="grid grid-cols-2 gap-3">
 <Bone className="h-11" rounded="rounded-[1600px]" />
 <Bone className="h-11" rounded="rounded-[1600px]" />
 </div>
 </div>

 {/* Recommended for you */}
 <div className="px-4 mt-6 space-y-3">
 <Bone className="h-5 w-48" />
 <div className="flex gap-3 overflow-hidden -mx-4 px-4">
 <div className="w-[240px] shrink-0 p-4 rounded-[28px] bg-[#ffffff] h-40 flex flex-col justify-between">
 <Bone className="h-4 w-24" rounded="rounded-[1600px]" />
 <Bone className="h-5 w-36" />
 <Bone className="h-3 w-full" />
 <Bone className="h-3 w-20" />
 </div>
 <div className="w-[240px] shrink-0 p-4 rounded-[28px] bg-[#ffffff] h-40 flex flex-col justify-between opacity-60">
 <Bone className="h-4 w-24" rounded="rounded-[1600px]" />
 <Bone className="h-5 w-36" />
 <Bone className="h-3 w-full" />
 <Bone className="h-3 w-20" />
 </div>
 </div>
 </div>
 </div>
 );
};

/**
 * Generic Screen Skeleton
 */
const GenericSkeleton: React.FC<{ message?: string }> = ({ message }) => {
 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] p-4 space-y-4 overflow-y-auto no-scrollbar pb-28">
 <div className="bg-[#ffffff] p-4 rounded-[28px] space-y-3">
 <div className="flex justify-between items-center">
 <Bone className="h-6 w-48" />
 <Bone className="h-4 w-16" rounded="rounded-[1600px]" />
 </div>
 <Bone className="h-3.5 w-64" />
 </div>

 <div className="bg-[#ffffff] p-4 rounded-[28px] space-y-3">
 <Bone className="h-4 w-32" />
 <Bone className="h-28 w-full" rounded="rounded-[20px]" />
 <div className="grid grid-cols-2 gap-2">
 <Bone className="h-10" rounded="rounded-[1600px]" />
 <Bone className="h-10" rounded="rounded-[1600px]" />
 </div>
 </div>

 {message && (
 <div className="text-center py-2">
 <span className="text-xs font-bold text-[#000000]/60 uppercase tracking-wider animate-pulse">
 {message}
 </span>
 </div>
 )}
 </div>
 );
};

/**
 * Centralized LoadingSkeleton component that automatically maps screen IDs
 * or explicit variants to their respective high-fidelity layout skeletons.
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
 variant,
 screen,
 className = '',
 message,
}) => {
 // Resolve variant from screen if variant not explicitly provided
 const resolvedVariant: SkeletonVariant =
 variant ||
 (() => {
 switch (screen) {
 case 'HOME':
 return 'home';
 case 'F1':
 return 'profile';
 case 'MAP':
 case 'B1':
 return 'map';
 case 'FINANCE':
 return 'finance';
 case 'CLUB_TOOLS':
 return 'club_tools';
 default:
 return 'generic';
 }
 })();

 return (
 <div className={`w-full h-full flex flex-col min-h-0 overflow-hidden ${className}`}>
 {resolvedVariant === 'home' && <HomeSkeleton />}
 {resolvedVariant === 'profile' && <ProfileSkeleton />}
 {resolvedVariant === 'map' && <MapSkeleton />}
 {resolvedVariant === 'finance' && <FinanceSkeleton />}
 {resolvedVariant === 'club_tools' && <GenericSkeleton message="กำลังโหลดกล่องเครื่องมือสโมสร..." />}
 {resolvedVariant === 'generic' && <GenericSkeleton message={message || 'กำลังโหลดข้อมูล...'} />}
 </div>
 );
};
