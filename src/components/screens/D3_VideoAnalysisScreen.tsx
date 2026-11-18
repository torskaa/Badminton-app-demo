import React, { useRef, useState } from 'react';
import { Video, UploadCloud, Play, Pause, CheckCircle2, Zap, Sparkles, Activity, ShieldCheck, ChevronRight, Gauge, ArrowRight, ImagePlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { fetchAIAnalyzeShot } from '../../services/aiService';

export const D3_VideoAnalysisScreen: React.FC = () => {
  const { player, updatePlayer, gainExp, navigateTo, language, setAnalyzedVideoResult } = useApp();
  const isThai = language === 'th';
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [newRecordSpeed, setNewRecordSpeed] = useState<number | null>(null);
  const [previewImg, setPreviewImg] = useState<string>('/src/assets/images/badminton_smash_action_1793695158261.jpg');
  const [analysisSource, setAnalysisSource] = useState<'gemini' | 'offline-cv' | 'default'>('default');

  const [analysisResult, setAnalysisResult] = useState({
    score: 88,
    metrics: {
      racketSpeedKmh: 342,
      contactHeightM: 2.85,
      trunkRotationDeg: 46.2,
      impactTimingMs: 14,
    },
    coachingAdvice: isThai
      ? [
          'จุดกระทบลูกสูง 2.85 เมตร ช่วยกดวิถีลูกชันและรับยาก',
          'หมุนลำตัวสมดุล 46.2° ควรสะบัดข้อมือเร็วขึ้นอีกเล็กน้อย',
          'หลังลงพื้นควรรีเซ็ตท่าเตรียมตัวทันทีเพื่อดักลูกหยอด',
        ]
      : [
          '2.85m contact height creates a steep downward smash angle.',
          '46.2° trunk rotation is balanced; snap the wrist slightly earlier.',
          'Reset into split-step immediately after landing to cover drops.',
        ],
  });

  const runAiScan = async (imageBase64?: string, imageMimeType?: string, clipName?: string) => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setScanError(null);
    setNewRecordSpeed(null);
    try {
      const nextMetrics = {
        racketSpeedKmh: 332 + Math.floor(Math.random() * 24),
        contactHeightM: Number((2.78 + Math.random() * 0.16).toFixed(2)),
        trunkRotationDeg: Number((43.5 + Math.random() * 7).toFixed(1)),
        impactTimingMs: 11 + Math.floor(Math.random() * 6),
      };
      const aiRes = await fetchAIAnalyzeShot({
        metrics: nextMetrics,
        clipName: clipName || 'Smash Forehand Frame',
        imageBase64,
        imageMimeType,
        language,
      });

      const updated = {
        score: aiRes.score,
        metrics: {
          racketSpeedKmh: aiRes.racketSpeedKmh,
          contactHeightM: aiRes.contactHeightM,
          trunkRotationDeg: aiRes.trunkRotationDeg,
          impactTimingMs: aiRes.impactTimingMs,
        },
        coachingAdvice: aiRes.coachingAdvice,
      };
      setAnalysisResult(updated);
      setAnalyzedVideoResult(updated);
      setAnalysisSource(aiRes.source);

      if (aiRes.racketSpeedKmh > player.stats.highestSmashSpeedKmh) {
        updatePlayer({
          stats: {
            ...player.stats,
            highestSmashSpeedKmh: aiRes.racketSpeedKmh,
          },
        });
        setNewRecordSpeed(aiRes.racketSpeedKmh);
      }

      gainExp(200, isThai ? 'สแกนวิเคราะห์ท่าตบด้วย AI สำเร็จ' : 'AI Video Analysis Completed');
    } catch (err) {
      console.error('Video AI analysis failed:', err);
      setScanError(
        isThai
          ? 'เชื่อมต่อ Gemini Vision ไม่สำเร็จชั่วคราว กรุณาลองอัปโหลดหรือสแกนใหม่อีกครั้ง'
          : 'Could not reach Gemini Vision right now. Please try scanning again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      if (result.startsWith('data:')) {
        setPreviewImg(result);
        const [header, base64Data] = result.split(',');
        const mimeMatch = header.match(/data:(.*?);base64/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        if (file.type.startsWith('image/') && base64Data) {
          runAiScan(base64Data, mime, file.name);
        } else {
          runAiScan(undefined, undefined, file.name);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-hidden">
      <MobileHeader showBack />

      <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16">
        {/* CV Video Player & Skeleton Overlay */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'ตรวจจับจุดกระทบและข้อต่อ' : 'KEYPOINT JOINT TRACKING'}
            subtitle={isThai ? 'วิเคราะห์ท่าทางด้วย Gemini Vision AI' : 'Gemini AI Computer Vision pose scan'}
            badge={analysisSource === 'gemini' ? 'GEMINI AI LIVE' : (isThai ? '120 เฟรม/วิ' : '120 FPS HD')}
            badgeVariant="green"
          />

          <div className="relative w-full h-64 rounded-[32px] overflow-hidden bg-[#000000]">
            <img
              src={previewImg}
              alt={isThai ? 'วิเคราะห์ท่าตบ' : 'Pose Tracking'}
              className="w-full h-full object-cover object-top opacity-85"
              referrerPolicy="no-referrer"
            />

            {/* Computer Vision Keypoint Skeleton Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="160" y1="50" x2="160" y2="105" stroke="#7cd7a0" strokeWidth="3" strokeDasharray={isPlaying ? '6 3' : undefined} />
              <line x1="160" y1="65" x2="120" y2="90" stroke="#7cd7a0" strokeWidth="3" />
              <line x1="120" y1="90" x2="100" y2="40" stroke="#e85729" strokeWidth="3.5" />
              <line x1="160" y1="65" x2="200" y2="85" stroke="#7cd7a0" strokeWidth="3" />
              <line x1="160" y1="105" x2="135" y2="160" stroke="#7cd7a0" strokeWidth="3" />
              <line x1="160" y1="105" x2="185" y2="160" stroke="#7cd7a0" strokeWidth="3" />

              <circle cx="160" cy="50" r="5" fill="#7cd7a0" stroke="#000000" strokeWidth="2" className={isPlaying ? 'animate-pulse' : ''} />
              <circle cx="120" cy="90" r="5" fill="#7cd7a0" stroke="#000000" strokeWidth="2" />
              <circle cx="100" cy="40" r={isPlaying ? '7' : '6'} fill="#e85729" stroke="#ffffff" strokeWidth="2" className={isPlaying ? 'animate-pulse' : ''} />
              <circle cx="200" cy="85" r="5" fill="#7cd7a0" stroke="#000000" strokeWidth="2" />
              <circle cx="135" cy="160" r="5" fill="#7cd7a0" stroke="#000000" strokeWidth="2" />
              <circle cx="185" cy="160" r="5" fill="#7cd7a0" stroke="#000000" strokeWidth="2" />
            </svg>

            {/* Live Scanning Line when playing or analyzing */}
            {(isPlaying || isAnalyzing) && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#7cd7a0] to-transparent opacity-80 animate-pulse shadow-[0_0_12px_#7cd7a0]"
              />
            )}

            {/* Floating Metric Badges */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-[1600px] bg-[#7cd7a0] text-[#142608] text-[10px] font-bold uppercase tracking-[0.032em] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>
                {isThai
                  ? `ความเร็วตบสูงสุด ${analysisResult.metrics.racketSpeedKmh} km/h`
                  : `${analysisResult.metrics.racketSpeedKmh} km/h Peak Velocity`}
              </span>
            </div>

            {!isPlaying && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#142608]/85 text-[#ffffff] text-[10px] font-bold">
                {isThai ? 'หยุดภาพเฟรม' : 'Paused Frame'}
              </div>
            )}

            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-[1600px] bg-[#000000]/85 text-[#ffffff] text-[10px] font-bold">
              {isThai
                ? `จุดกระทบ ${analysisResult.metrics.contactHeightM} ม. · มุม ${analysisResult.metrics.trunkRotationDeg}°`
                : `Contact: ${analysisResult.metrics.contactHeightM}m · Angle: ${analysisResult.metrics.trunkRotationDeg}°`}
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause overlay' : 'Play overlay'}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] flex items-center justify-center cursor-pointer transition-transform active:scale-90"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
          </div>

          {newRecordSpeed && (
            <div className="p-2.5 rounded-[16px] bg-[#e8f7ee] border border-[#7cd7a0] text-[11px] font-bold text-[#004d2c] flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
              <span>
                {isThai
                  ? `🏆 สถิติใหม่! บันทึกความเร็วตบ ${newRecordSpeed} km/h ลงโปรไฟล์แล้ว`
                  : `🏆 New PR! Saved ${newRecordSpeed} km/h smash speed to your profile`}
              </span>
            </div>
          )}

          {scanError && (
            <div className="p-2.5 rounded-[16px] bg-[#fff1ec] border border-[#e85729]/30 text-[11px] font-medium text-[#b93815]">
              {scanError}
            </div>
          )}
        </div>

        {/* Biomechanical Telemetry Card */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'สถิติความเร็วและแรงตบ' : 'SMASH BIOMECHANICS'}
            subtitle={isThai ? 'ความเร็ว จุดสัมผัส และข้อมือ' : 'Velocity, contact & wrist snap'}
            badge={isThai ? `คะแนน ${analysisResult.score}/100` : `Score ${analysisResult.score}/100`}
            badgeVariant="green"
          />

          <div className="rounded-[28px] p-4 bg-[#ffffff]">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-[20px] bg-[#f4f8fb]">
                <span className="text-[10px] text-[#000000]/60 font-bold block uppercase tracking-[0.032em]">
                  {isThai ? 'ความเร็วหน้าไม้' : 'Racket Speed'}
                </span>
                <span className="font-['Antonio',sans-serif] text-2xl font-black text-[#15803d]">
                  {analysisResult.metrics.racketSpeedKmh} <span className="text-xs font-normal">{isThai ? 'กม./ชม.' : 'km/h'}</span>
                </span>
              </div>
              <div className="p-3 rounded-[20px] bg-[#f4f8fb]">
                <span className="text-[10px] text-[#000000]/60 font-bold block uppercase tracking-[0.032em]">
                  {isThai ? 'ความสูงจุดกระทบ' : 'Contact Height'}
                </span>
                <span className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000]">
                  {analysisResult.metrics.contactHeightM} <span className="text-xs font-normal">{isThai ? 'ม.' : 'm'}</span>
                </span>
              </div>
              <div className="p-3 rounded-[20px] bg-[#f4f8fb]">
                <span className="text-[10px] text-[#000000]/60 font-bold block uppercase tracking-[0.032em]">
                  {isThai ? 'องศาหมุนลำตัว' : 'Trunk Rotation'}
                </span>
                <span className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000]">
                  {analysisResult.metrics.trunkRotationDeg}°
                </span>
              </div>
              <div className="p-3 rounded-[20px] bg-[#f4f8fb]">
                <span className="text-[10px] text-[#000000]/60 font-bold block uppercase tracking-[0.032em]">
                  {isThai ? 'จังหวะสะบัดข้อมือ' : 'Wrist Snap Timing'}
                </span>
                <span className="font-['Antonio',sans-serif] text-2xl font-black text-[#ff5c34]">
                  {analysisResult.metrics.impactTimingMs} <span className="text-xs font-normal">ms</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Coaching Advice */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'บทวิเคราะห์และคำแนะนำ' : 'HEAD COACH FEEDBACK'}
            subtitle={isThai ? 'แนวทางเพิ่มความแรงตบ' : 'Improve smash power safely'}
            badge={analysisSource === 'gemini' ? 'GEMINI AI' : (isThai ? 'โค้ชแนะนำ' : 'COACH AI')}
            badgeVariant="green"
          />

          <div className="rounded-[28px] p-4 space-y-2.5 bg-[#ffffff]">
            <div className="space-y-2 text-xs text-[#000000]/80 font-medium">
              {analysisResult.coachingAdvice.map((adv: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-[16px] bg-[#f4f8fb]">
                  <span className="w-5 h-5 rounded-[1600px] bg-[#000000] text-[#ffffff] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-snug">{adv}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hidden Image Upload Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => runAiScan()}
            disabled={isAnalyzing}
            className="w-full py-3.5 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] whitespace-nowrap disabled:opacity-60"
          >
            {isAnalyzing ? (
              <span>{isThai ? 'กำลังวิเคราะห์ด้วย Gemini AI...' : 'GEMINI AI ANALYZING...'}</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 shrink-0 text-[#7cd7a0]" />
                <span>{isThai ? 'วิเคราะห์ท่าตบใหม่ด้วย AI (+200 คะแนน)' : 'AI ANALYZE SMASH (+200 EXP)'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="w-full py-3 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[#e8f7ee] hover:bg-[#d1fae5] text-[#15803d] border border-[#15803d]/30 whitespace-nowrap"
          >
            <ImagePlus className="w-4 h-4 shrink-0" />
            <span>{isThai ? 'อัปโหลดภาพท่าตบของคุณให้ AI สแกน' : 'UPLOAD YOUR SMASH PHOTO'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('D2')}
            className="w-full py-3 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] border border-[#000000] whitespace-nowrap"
          >
            <span>{isThai ? 'ดูแบบฝึกแก้ทาง' : 'VIEW TACTICAL DRILLS'}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
