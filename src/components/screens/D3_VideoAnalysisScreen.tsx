/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Video, UploadCloud, Play, Pause, CheckCircle2, Zap, Sparkles, Activity, ShieldCheck, ChevronRight, RefreshCw, Gauge } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const D3_VideoAnalysisScreen: React.FC = () => {
  const { gainExp, navigateTo } = useApp();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scrubberValue, setScrubberValue] = useState(64); // %

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
    <div className="flex-1 flex flex-col justify-between bg-[#06070a] pb-6">
      <MobileHeader title="Biomechanical Vision AI" subtitle="Joint Tracking & Smash Velocity" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* CV Video Player & Skeleton Overlay */}
        <div className="relative w-full h-64 rounded-3xl overflow-hidden bg-black border border-white/[0.1] shadow-2xl">
          <img
            src="/src/assets/images/badminton_smash_action_1793695158261.jpg"
            alt="AI Pose Tracking"
            className="w-full h-full object-cover object-top opacity-85"
            referrerPolicy="no-referrer"
          />

          {/* Biomechanical Telemetry SVG Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none">
            {/* Skeletal Kinetic Chains */}
            <line x1="160" y1="95" x2="195" y2="72" stroke="#d4ff00" strokeWidth="2.5" />
            <line x1="195" y1="72" x2="260" y2="88" stroke="#d4ff00" strokeWidth="2.5" />
            <line x1="160" y1="95" x2="152" y2="140" stroke="#00f0ff" strokeWidth="2" />
            <line x1="152" y1="140" x2="128" y2="180" stroke="#00f0ff" strokeWidth="2" />
            <line x1="152" y1="140" x2="178" y2="175" stroke="#00f0ff" strokeWidth="2" />

            {/* Trajectory vector arc */}
            <path
              d="M 285 70 Q 250 85 220 145"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />

            {/* Kinetic Nodes */}
            <circle cx="160" cy="95" r="4.5" fill="#d4ff00" />
            <circle cx="195" cy="72" r="4.5" fill="#d4ff00" />
            <circle cx="260" cy="88" r="6" fill="#d4ff00" stroke="#000" strokeWidth="2" />
            <circle cx="152" cy="140" r="4.5" fill="#00f0ff" />
            <circle cx="128" cy="180" r="4" fill="#00f0ff" />
            <circle cx="178" cy="175" r="4" fill="#00f0ff" />
          </svg>

          {/* Top HUD Badges */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/[0.1] text-[10px] font-mono text-[#d4ff00] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse" />
            <span>KINETIC FRAME 48/75</span>
          </div>

          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/[0.1] text-[10px] font-mono text-cyan-400 font-bold">
            VELOCITY: 324 KM/H
          </div>

          <div className="absolute bottom-10 left-3 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-[10px] font-mono text-amber-400 font-bold">
            APEX: 2.78M IMPACT HEIGHT
          </div>

          {/* Player Scrub Bar Controls */}
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center gap-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-6 h-6 rounded-lg bg-white/[0.1] text-white flex items-center justify-center cursor-pointer hover:bg-white/[0.2]"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={scrubberValue}
              onChange={(e) => setScrubberValue(Number(e.target.value))}
              className="flex-1 accent-[#d4ff00] h-1 bg-white/[0.2] rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-slate-300">00:01.42</span>
          </div>

          {/* Processing Screen State */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center gap-2 z-20">
              <RefreshCw className="w-8 h-8 text-[#d4ff00] animate-spin" />
              <div className="text-xs font-black text-white">Running Vision Tensor Pipeline...</div>
              <div className="text-[10px] font-mono text-slate-400">Pose Estimation · 17 Keypoints Active</div>
            </div>
          )}
        </div>

        {/* Video Upload Triggers */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSimulateUpload}
            disabled={isAnalyzing}
            className="py-2.5 px-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-[#d4ff00]" />
            <span>อัปโหลดคลิปใหม่</span>
          </button>

          <button
            onClick={handleSimulateUpload}
            disabled={isAnalyzing}
            className="py-2.5 px-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span>รีเซ็ตวิเคราะห์ใหม่</span>
          </button>
        </div>

        {/* Technique Score Card */}
        <div className="p-4 rounded-3xl bg-[#0b0e16] border border-white/[0.08] space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#d4ff00] font-bold uppercase tracking-wider">
                COMPOSITE TECHNIQUE SCORE
              </span>
              <h3 className="text-lg font-black text-white">
                คะแนนฟอร์ม: <span className="text-[#d4ff00] font-mono">88</span>/100
              </h3>
            </div>
            <div className="px-3 py-1 rounded-xl bg-[#d4ff00]/15 text-[#d4ff00] font-mono font-black text-xs border border-[#d4ff00]/30">
              GRADE A+ (PRO)
            </div>
          </div>

          {/* Sub Scores Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                <span>Jump Takeoff</span>
                <span className="font-mono text-[#d4ff00] font-bold">92%</span>
              </div>
              <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                <div className="h-full bg-[#d4ff00] rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                <span>Trunk Angle</span>
                <span className="font-mono text-[#d4ff00] font-bold">85%</span>
              </div>
              <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                <div className="h-full bg-[#d4ff00] rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                <span>Racket Pronation</span>
                <span className="font-mono text-[#d4ff00] font-bold">89%</span>
              </div>
              <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                <div className="h-full bg-[#d4ff00] rounded-full" style={{ width: '89%' }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                <span>Landing Reset</span>
                <span className="font-mono text-[#d4ff00] font-bold">84%</span>
              </div>
              <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                <div className="h-full bg-[#d4ff00] rounded-full" style={{ width: '84%' }} />
              </div>
            </div>
          </div>

          {/* AI Biomechanical Prescription */}
          <div className="pt-2 border-t border-white/[0.06] space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span>คำแนะนำปรับฟอร์มเฉพาะจุด:</span>
            </div>
            <div className="space-y-1.5">
              {analysisResult.coachingAdvice.map((advice: string, idx: number) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] text-[11px] text-slate-300 leading-relaxed border border-white/[0.05]">
                  {advice}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="px-4 pt-2 shrink-0">
        <button
          onClick={() => navigateTo('D2')}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-[#d4ff00] hover:bg-[#bbf000] text-black font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(212,255,0,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>ฝึกซ้อม Drill แก้จุดอ่อนนี้ (+250 EXP)</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
