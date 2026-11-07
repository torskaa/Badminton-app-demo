import React, { useState } from 'react';
import { Video, UploadCloud, Play, Pause, CheckCircle2, Zap, Sparkles, Activity, ShieldCheck, ChevronRight, Gauge, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const D3_VideoAnalysisScreen: React.FC = () => {
  const { gainExp, navigateTo, language } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [analysisResult] = useState<any>({
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
      'จุดกระทบลูกสูงถึง 2.85 เมตร ทำให้วิถีลูกกดลงคอร์ทคู่ต่อสู้ชันและรับยากมาก',
      'การหมุนลำตัว (46.2°) ทำได้สมดุล ควรสบัดข้อมือเร็วขึ้นอีก 14ms เพื่อความแรงสูงสุด',
      'หลังลงสู่พื้น ควรรีเซ็ตท่าย่อเตรียมตัว Split-step ทันทีเพื่อดักลูกหยอดสวนกลับ',
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
    <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      <MobileHeader
        title={language === 'th' ? 'วิเคราะห์ท่าทาง & สปีดตบ' : 'Pose & Smash Vision'}
        subtitle={language === 'th' ? 'สแกนมุมชีวกลศาสตร์และความเร็วลูกตบ' : 'Biomechanics Angle & Velocity Scan'}
        showBack
      />

      <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16">
        {/* CV Video Player & Skeleton Overlay */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.2 rounded-[1600px] text-[9px] font-bold uppercase tracking-[0.032em] bg-[#4da2ff] text-[#000000] border border-[#000000]">
                {language === 'th' ? 'สแกนวิดีโอ 3D' : '3D COMPUTER VISION'}
              </span>
              <span className="font-['Antonio',sans-serif] text-xs font-black uppercase tracking-wider text-[#000000]">
                {language === 'th' ? 'การติดตามมุมข้อต่อ & จุดกระทบลูก' : 'KEYPOINT JOINT TRACKING'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#000000]/60 uppercase">120 FPS HD</span>
          </div>

          <div className="relative w-full h-64 rounded-[32px] overflow-hidden bg-[#000000] border-2 border-[#000000]">
            <img
              src="/src/assets/images/badminton_smash_action_1793695158261.jpg"
              alt="Pose Tracking"
              className="w-full h-full object-cover object-top opacity-85"
              referrerPolicy="no-referrer"
            />

            {/* Computer Vision Keypoint Skeleton Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="160" y1="50" x2="160" y2="105" stroke="#4da2ff" strokeWidth="3" />
              <line x1="160" y1="65" x2="120" y2="90" stroke="#4da2ff" strokeWidth="3" />
              <line x1="120" y1="90" x2="100" y2="40" stroke="#ffd731" strokeWidth="3.5" />
              <line x1="160" y1="65" x2="200" y2="85" stroke="#4da2ff" strokeWidth="3" />
              <line x1="160" y1="105" x2="135" y2="160" stroke="#4da2ff" strokeWidth="3" />
              <line x1="160" y1="105" x2="185" y2="160" stroke="#4da2ff" strokeWidth="3" />

              <circle cx="160" cy="50" r="5" fill="#4da2ff" stroke="#000000" strokeWidth="2" />
              <circle cx="120" cy="90" r="5" fill="#4da2ff" stroke="#000000" strokeWidth="2" />
              <circle cx="100" cy="40" r="6" fill="#ffd731" stroke="#000000" strokeWidth="2" />
              <circle cx="200" cy="85" r="5" fill="#4da2ff" stroke="#000000" strokeWidth="2" />
              <circle cx="135" cy="160" r="5" fill="#4da2ff" stroke="#000000" strokeWidth="2" />
              <circle cx="185" cy="160" r="5" fill="#4da2ff" stroke="#000000" strokeWidth="2" />
            </svg>

            {/* Floating Metric Badges */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-[1600px] bg-[#ffd731] border border-[#000000] text-[#000000] text-[10px] font-bold uppercase tracking-[0.032em] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>342 km/h Peak Velocity</span>
            </div>

            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-[1600px] bg-[#000000] border border-[#000000] text-[#ffffff] text-[10px] font-bold">
              Contact: 2.85m · Angle: 46.2°
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] flex items-center justify-center cursor-pointer transition-transform active:scale-90"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Biomechanical Telemetry Card */}
        <div className="border border-[#000000] rounded-[28px] p-4 space-y-3 bg-[#ffffff]">
          {/* Subheader */}
          <div className="flex items-center justify-between pb-2 border-b border-[#000000]/15">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="px-2 py-0.2 rounded-[1600px] text-[9px] font-bold uppercase tracking-[0.032em] bg-[#ffd731] text-[#000000] border border-[#000000]">
                  {language === 'th' ? 'ข้อมูลชีวกลศาสตร์' : 'BIOMECHANICS'}
                </span>
                <h3 className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
                  {language === 'th' ? 'สถิติแรงตบและความเร็วการเคลื่อนไหว' : 'SMASH BIOMECHANICS TELEMETRY'}
                </h3>
              </div>
              <p className="text-[10px] text-[#000000]/60 font-bold">
                {language === 'th'
                  ? 'คำนวณความเร็วหัวไม้ จุดสัมผัสลูก และไทม์มิ่งการสบัดข้อมือ'
                  : 'Racket velocity, impact contact height, trunk rotation, and wrist snap timing'}
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#55db9c] border border-[#000000] text-[#000000] shrink-0">
              Score 88/100
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-[20px] bg-[#dceeff] border border-[#000000]">
              <span className="text-[10px] text-[#000000]/60 font-bold block uppercase tracking-[0.032em]">{language === 'th' ? 'ความเร็วแร็กเก็ต' : 'Racket Speed'}</span>
              <span className="font-['Antonio',sans-serif] text-2xl font-black text-[#5c4ade]">
                {analysisResult.metrics.racketSpeedKmh} <span className="text-xs font-normal">km/h</span>
              </span>
            </div>
            <div className="p-3 rounded-[20px] bg-[#dceeff] border border-[#000000]">
              <span className="text-[10px] text-[#000000]/60 font-bold block uppercase tracking-[0.032em]">{language === 'th' ? 'จุดกระทบลูก (สูง)' : 'Contact Height'}</span>
              <span className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000]">
                {analysisResult.metrics.contactHeightM} <span className="text-xs font-normal">{language === 'th' ? 'เมตร' : 'm'}</span>
              </span>
            </div>
            <div className="p-3 rounded-[20px] bg-[#dceeff] border border-[#000000]">
              <span className="text-[10px] text-[#000000]/60 font-bold block uppercase tracking-[0.032em]">{language === 'th' ? 'องศาหมุนลำตัว' : 'Trunk Rotation'}</span>
              <span className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000]">
                {analysisResult.metrics.trunkRotationDeg}°
              </span>
            </div>
            <div className="p-3 rounded-[20px] bg-[#dceeff] border border-[#000000]">
              <span className="text-[10px] text-[#000000]/60 font-bold block uppercase tracking-[0.032em]">{language === 'th' ? 'สบัดข้อมือ Timing' : 'Wrist Snap Timing'}</span>
              <span className="font-['Antonio',sans-serif] text-2xl font-black text-[#ff5c34]">
                {analysisResult.metrics.impactTimingMs} <span className="text-xs font-normal">ms</span>
              </span>
            </div>
          </div>
        </div>

        {/* Coaching Advice */}
        <div className="border border-[#000000] rounded-[28px] p-4 space-y-2.5 bg-[#ffffff]">
          {/* Subheader */}
          <div className="pb-2 border-b border-[#000000]/15">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-5 h-5 rounded-[1600px] bg-[#ffd731] border border-[#000000] flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-[#000000]" />
              </span>
              <span className="px-2 py-0.2 rounded-[1600px] text-[9px] font-bold uppercase tracking-[0.032em] bg-[#55db9c] text-[#000000] border border-[#000000]">
                {language === 'th' ? 'คำแนะนำจากโค้ช' : 'COACH FEEDBACK'}
              </span>
              <h4 className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
                {language === 'th' ? 'บทวิเคราะห์เชิงลึกและแนวทางปรับปรุง' : 'HEAD COACH ACTIONABLE FEEDBACK'}
              </h4>
            </div>
            <p className="text-[10px] text-[#000000]/60 font-bold">
              {language === 'th'
                ? 'คำแนะนำปรับท่าทางเพื่อเพิ่มแรงตบและลดความเสี่ยงบาดเจ็บ'
                : 'Step-by-step biomechanical adjustments to increase smash power and reduce injuries'}
            </p>
          </div>

          <div className="space-y-2 text-xs text-[#000000]/80 font-medium">
            {analysisResult.coachingAdvice.map((adv: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 p-2 rounded-[16px] bg-[#dceeff] border border-[#000000]">
                <span className="w-5 h-5 rounded-[1600px] bg-[#000000] text-[#ffffff] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-snug">{adv}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleSimulateUpload}
            disabled={isAnalyzing}
            className="w-full py-3.5 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] whitespace-nowrap"
          >
            {isAnalyzing ? (
              <span>AI ANALYZING VELOCITY...</span>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 shrink-0" />
                <span>RE-SCAN SMASH VIDEO (+200 EXP)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigateTo('D2')}
            className="w-full py-3 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] border border-[#000000] whitespace-nowrap"
          >
            <span>VIEW TACTICAL DRILLS (D2)</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
