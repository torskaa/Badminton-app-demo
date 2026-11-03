/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Video, UploadCloud, Play, Pause, CheckCircle2, Zap, Sparkles, Activity, ShieldCheck, ChevronRight, Gauge, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const D3_VideoAnalysisScreen: React.FC = () => {
  const { gainExp, navigateTo } = useApp();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [analysisResult, setAnalysisResult] = useState<any>({
    analyzed: true,
    score: 88,
    metrics: {
      racketSpeedKmh: 324,
      contactHeightM: 2.78,
      trunkRotationDeg: 44.5,
      impactTimingMs: 18,
    },
    scores: {
      jumpTiming: 92,
      shoulderSnap: 85,
      racketAngle: 89,
      landingRecovery: 84,
    },
    coachingAdvice: [
      'จุดกระทบลูกสูงถึง 2.78 เมตร (จุดพีคสูงสุด) ทำให้ลูกมีมุมกดปักลึกชัน (Steep Angle)',
      'การหมุนสะโพกและลำตัวทำมุม 44.5° อยู่ในเกณฑ์ดีมาก แต่จังหวะ Snap ข้อมือช้าไป 18ms',
      'ก้าวลงพื้นด้วยเท้าซ้ายพร้อมดันตัวกลับ T-line ทันทีเพื่อไม่ให้เสียเปรียบลูกสวนเร็ว',
    ],
  });

  const handleSimulateUpload = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      gainExp(200, 'AI Computer Vision Analysis Completed');
    }, 1600);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title="Biomechanical Vision AI" subtitle="Joint Tracking & Smash Velocity" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* CV Video Player & Skeleton Overlay */}
        <div className="relative w-full h-64 rounded-3xl overflow-hidden bg-black shadow-lg">
          <img
            src="/src/assets/images/badminton_smash_action_1793695158261.jpg"
            alt="AI Pose Tracking"
            className="w-full h-full object-cover object-top opacity-85"
            referrerPolicy="no-referrer"
          />

          {/* Skeleton Overlay Lines */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              {/* Arm & Racket tracking line */}
              <line x1="160" y1="90" x2="195" y2="45" stroke="#d8ff00" strokeWidth="3" strokeDasharray="4,2" />
              <line x1="160" y1="90" x2="140" y2="135" stroke="#00ffcc" strokeWidth="2.5" />
              <circle cx="160" cy="90" r="5" fill="#d8ff00" />
              <circle cx="195" cy="45" r="7" fill="#ff0055" />
              <circle cx="140" cy="135" r="5" fill="#00ffcc" />
            </svg>
          </div>

          {/* Top Live Tracking Telemetry */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between text-xs">
            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#d8ff00] font-mono text-[10px] font-bold border border-white/10">
              ● POSE SKELETON v2.4 ACTIVE
            </span>
            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-[10px] font-bold">
              324 KM/H
            </span>
          </div>

          {/* Bottom Player Overlay Bar */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between px-3 py-1.5 rounded-2xl bg-black/60 backdrop-blur-md text-white text-xs">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#d8ff00] cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <span className="text-[10px] font-mono text-neutral-300">00:03.24 / 00:05.00</span>
          </div>
        </div>

        {/* 4 Biomechanical Key Metrics */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block">Racket Speed</span>
            <div className="text-xl font-black text-neutral-900 font-mono mt-0.5">324 km/h</div>
            <span className="text-[10px] text-emerald-600 font-bold">Top 12% Speed</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block">Contact Height</span>
            <div className="text-xl font-black text-neutral-900 font-mono mt-0.5">2.78 m</div>
            <span className="text-[10px] text-[#0066ff] font-bold">Steep Attack Angle</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block">Trunk Rotation</span>
            <div className="text-xl font-black text-neutral-900 font-mono mt-0.5">44.5°</div>
            <span className="text-[10px] text-neutral-500 font-bold">Optimal Core Snap</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block">Overall Technique</span>
            <div className="text-xl font-black text-[#d8ff00] bg-black px-2 py-0.5 rounded-lg inline-block font-mono mt-0.5">88/100</div>
            <span className="text-[10px] text-neutral-500 font-bold block mt-1">Grade A</span>
          </div>
        </div>

        {/* AI Coaching Actionable Advice */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2.5">
          <h4 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
            คำแนะนำปรับท่วงท่า (AI Pose Correction)
          </h4>
          <div className="space-y-2">
            {analysisResult.coachingAdvice.map((adv: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{adv}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="px-5 pt-3 border-t border-neutral-200 bg-white shrink-0">
        <button
          type="button"
          disabled={isAnalyzing}
          onClick={handleSimulateUpload}
          className="w-full h-14 bg-[#111318] hover:bg-[#1f2430] active:scale-[0.98] rounded-full p-2 flex items-center justify-between shadow-lg transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#d8ff00] text-black flex items-center justify-center font-bold">
            <UploadCloud className="w-5 h-5" />
          </div>
          <span className="text-white font-extrabold text-xs tracking-wider uppercase">
            {isAnalyzing ? 'กำลังประมวลผลโมเดล AI...' : 'อัปโหลดคลิปใหม่เพื่อวิเคราะห์ (+200 EXP)'}
          </span>
          <div className="w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>
      </div>
    </div>
  );
};
