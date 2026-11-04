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
      racketSpeedKmh: 342,
      contactHeightM: 2.85,
      trunkRotationDeg: 46.2,
      impactTimingMs: 14,
    },
    scores: {
      jumpTiming: 94,
      shoulderSnap: 88,
      racketAngle: 91,
      landingRecovery: 86,
    },
    coachingAdvice: [
      'Peak contact height reached 2.85m providing an exceptionally steep downward smash trajectory.',
      'Trunk rotation (46.2°) is optimal; slightly accelerate wrist snap release by 14ms for maximum whip.',
      'Split-step reset immediately on landing to prepare for defensive net returns.',
    ],
  });

  const handleSimulateUpload = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      gainExp(200, 'AI Computer Vision Analysis Completed');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title="AI Pose & Smash Vision" subtitle="Biomechanics Angle & Velocity Scan" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* CV Video Player & Skeleton Overlay (Slush Card with 1px black outline) */}
        <div className="relative w-full h-64 rounded-[32px] overflow-hidden bg-black border border-black shadow-xs">
          <img
            src="/src/assets/images/badminton_smash_action_1793695158261.jpg"
            alt="AI Pose Tracking"
            className="w-full h-full object-cover object-top opacity-85"
            referrerPolicy="no-referrer"
          />

          {/* Computer Vision Keypoint Skeleton Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Skeletal tracking lines */}
            <line x1="160" y1="50" x2="160" y2="105" stroke="#39ff14" strokeWidth="3" />
            <line x1="160" y1="65" x2="120" y2="90" stroke="#39ff14" strokeWidth="3" />
            <line x1="120" y1="90" x2="100" y2="40" stroke="#ffd731" strokeWidth="3.5" />
            <line x1="160" y1="65" x2="200" y2="85" stroke="#39ff14" strokeWidth="3" />
            <line x1="160" y1="105" x2="135" y2="160" stroke="#39ff14" strokeWidth="3" />
            <line x1="160" y1="105" x2="185" y2="160" stroke="#39ff14" strokeWidth="3" />

            {/* Joint Nodes */}
            <circle cx="160" cy="50" r="5" fill="#39ff14" stroke="#000" strokeWidth="2" />
            <circle cx="120" cy="90" r="5" fill="#39ff14" stroke="#000" strokeWidth="2" />
            <circle cx="100" cy="40" r="6" fill="#ffd731" stroke="#000" strokeWidth="2" />
            <circle cx="200" cy="85" r="5" fill="#39ff14" stroke="#000" strokeWidth="2" />
            <circle cx="135" cy="160" r="5" fill="#39ff14" stroke="#000" strokeWidth="2" />
            <circle cx="185" cy="160" r="5" fill="#39ff14" stroke="#000" strokeWidth="2" />
          </svg>

          {/* Floating Metric Badges */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#ffd731] border border-black text-black text-[10px] font-black uppercase flex items-center gap-1 shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>342 km/h Peak Velocity</span>
          </div>

          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/80 border border-white text-white text-[10px] font-bold">
            Contact: 2.85m · Angle: 46.2°
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white border border-black text-black flex items-center justify-center cursor-pointer transition-transform active:scale-90"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
        </div>

        {/* Biomechanical Telemetry Card */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-['Antonio'] text-xl font-bold uppercase tracking-tight text-black">
              Kinetic Chain Scores
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#55db9c] border border-black text-black text-xs font-black">
              Overall: 88/100
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-[#dceeff]/50 border border-black">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">Jump Peak Timing</span>
              <span className="font-['Antonio'] text-2xl font-bold text-black">94 / 100</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#dceeff]/50 border border-black">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">Shoulder Snap</span>
              <span className="font-['Antonio'] text-2xl font-bold text-black">88 / 100</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#dceeff]/50 border border-black">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">Face Angle</span>
              <span className="font-['Antonio'] text-2xl font-bold text-black">91 / 100</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#dceeff]/50 border border-black">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">Landing Recovery</span>
              <span className="font-['Antonio'] text-2xl font-bold text-black">86 / 100</span>
            </div>
          </div>
        </div>

        {/* AI Coaching Action Points */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-2 shadow-xs">
          <h4 className="font-['Antonio'] text-lg font-bold text-black uppercase tracking-tight">
            AI Kinetic Recommendations
          </h4>
          <ul className="space-y-1.5 text-xs text-neutral-700 font-medium">
            {analysisResult.coachingAdvice.map((advice: string, i: number) => (
              <li key={i} className="flex items-start gap-2 p-2 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="w-4 h-4 rounded-full bg-[#55db9c] border border-black flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upload Simulation and Next Flows */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleSimulateUpload}
            disabled={isAnalyzing}
            className="w-full py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider border border-black flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isAnalyzing ? 'Scanning Pose Keypoints...' : 'Scan New Video Clip (+200 EXP)'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateTo('D2')}
              className="py-3 rounded-full bg-[#ffd731] hover:bg-[#ffe259] border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <span>Train This Drill</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigateTo('D1')}
              className="py-3 rounded-full bg-white hover:bg-neutral-100 border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <span>Back to Dojo Hub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
