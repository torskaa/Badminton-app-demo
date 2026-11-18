import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Zap, ChevronRight, Activity, ArrowRight, ShieldAlert, Sparkles, Check, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { fetchAIMatchDiagnostics } from '../../services/aiService';

export const C3_AIDiagnosticsScreen: React.FC = () => {
  const { navigateTo, gainExp, language, match, addCustomDrill } = useApp();
  const isThai = language === 'th';
  const [selectedZone, setSelectedZone] = useState<string>('front-left');
  const [drillAdded, setDrillAdded] = useState(false);
  const [isAnalyzingZone, setIsAnalyzingZone] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiInsightsByZone, setAiInsightsByZone] = useState<
    Record<string, { advice: string; drillFocus: string; source: string }>
  >({});

  const liveMatchScore = React.useMemo(() => {
    const sets = match.pastSets.map((s) => `${s.scoreA}-${s.scoreB}`);
    if (match.scoreA > 0 || match.scoreB > 0) {
      sets.push(`${match.scoreA}-${match.scoreB}`);
    }
    return sets.length > 0 ? sets.join(', ') : '21-18, 21-17';
  }, [match.pastSets, match.scoreA, match.scoreB]);

  const zoneCounts = React.useMemo(() => {
    const hasLoggedShots = match.shotHistory.length > 0;
    if (!hasLoggedShots) {
      return {
        'front-left': 4,
        'front-right': 1,
        'back-left': 5,
        'back-right': 8,
      };
    }
    const fl = match.shotHistory.filter((s) => s.zone === 'front-left' && (s.team === 'B' || s.errorReason)).length;
    const fr = match.shotHistory.filter((s) => s.zone === 'front-right' && (s.team === 'B' || s.errorReason)).length;
    const bl = match.shotHistory.filter((s) => (s.zone === 'back-left' || s.zone === 'mid-left') && (s.team === 'B' || s.errorReason)).length;
    const br = match.shotHistory.filter((s) => s.team === 'A' && (s.shotType === 'Smash' || s.zone === 'back-right')).length;
    return {
      'front-left': fl,
      'front-right': fr,
      'back-left': bl,
      'back-right': Math.max(1, br),
    };
  }, [match.shotHistory]);

  const ZONE_INFO: Record<
    string,
    {
      name: string;
      errors: number;
      advice: string;
      tag: string;
      color: string;
      focusArea: 'Smash' | 'Net Play' | 'Footwork' | 'Defense';
      drillTitle: string;
      drillTitleTh: string;
      steps: string[];
    }
  > = {
    'front-left': {
      name: isThai ? 'หน้าเน็ตโฟร์แฮนด์' : 'Forehand Net Zone',
      errors: zoneCounts['front-left'],
      advice: isThai
        ? `พบจังหวะเสียแต้มหน้าเน็ต ${zoneCounts['front-left']} ครั้ง ควรยกหัวไม้ระดับสายตาและย่อเข่าก่อนเข้าหาลูก`
        : `${zoneCounts['front-left']} net errors recorded. Keep racket head up and bend knees on approach.`,
      tag: isThai ? 'ควรฝึกเพิ่ม' : 'Need Practice',
      color: '#e85729',
      focusArea: 'Net Play',
      drillTitle: 'Forehand Net Tumble & Lift Recovery',
      drillTitleTh: 'ฝึกปั่นหน้าเน็ตโฟร์แฮนด์และถอยคุมคอร์ท',
      steps: isThai
        ? [
            'ตั้งท่า Split-step กลางคอร์ทแล้วย่อเข่าก้าวเข้าหน้าเน็ตซ้าย 15 ครั้ง x 3 เซ็ต',
            'ยกหัวไม้สูงเหนือระดับตาและแตะปั่นลูกชิดขอบเน็ต',
            'ดีดตัวถอยกลับจุดกลางทันทีหลังตีทุกลูก',
          ]
        : [
            'Split-step from center and lunge into forehand net (3 sets x 15 reps).',
            'Keep racket head above eye level for tight net tumbles.',
            'Recover explosively back to base position after every touch.',
          ],
    },
    'front-right': {
      name: isThai ? 'หน้าเน็ตแบ็คแฮนด์' : 'Backhand Net Zone',
      errors: zoneCounts['front-right'],
      advice: isThai
        ? `ปั่นเน็ตและตัดหยอดแม่นยำ (พลาดเพียง ${zoneCounts['front-right']} ครั้ง) รักษาความสม่ำเสมอต่อไป`
        : `Sharp net tumbles and drops (${zoneCounts['front-right']} error). Maintain this edge.`,
      tag: isThai ? 'จุดแข็ง' : 'Strong Zone',
      color: '#7cd7a0',
      focusArea: 'Net Play',
      drillTitle: 'Backhand Net Cross-Court Deception',
      drillTitleTh: 'ฝึกตัดหยอดและหลอกไขว้หน้าเน็ตแบ็คแฮนด์',
      steps: isThai
        ? [
            'ซ้อมจับกริปนิ้วโป้งและแตะลูกไขว้หน้าเน็ต 20 ลูกต่อเนื่อง',
            'สลับระหว่างหยอดตรงกับปั่นไขว้โดยใช้ท่าขึ้นไม้เดียวกัน',
            'คุมน้ำหนักไม่ให้ลูกลอยเกินระดับตาข่าย 15 ซม.',
          ]
        : [
            'Use thumb grip for 20 consecutive cross-court backhand net shots.',
            'Disguise straight tumble and cross-net using identical preparation.',
            'Keep shuttle clearance within 15cm above the tape.',
          ],
    },
    'back-left': {
      name: isThai ? 'มุมหลังแบ็คแฮนด์' : 'Backhand Deep Corner',
      errors: zoneCounts['back-left'],
      advice: isThai
        ? `พบลูกเสียมุมหลัง ${zoneCounts['back-left']} ครั้ง ควรเร่งสเต็ปเท้าถอยและปิดหน้าไม้ให้เร็วขึ้น`
        : `${zoneCounts['back-left']} deep-corner errors. Speed up footwork recovery and close racket face earlier.`,
      tag: isThai ? 'จุดอ่อนหลัก' : 'Critical Weakness',
      color: '#e85729',
      focusArea: 'Footwork',
      drillTitle: 'Deep Backhand Overhead & Recovery',
      drillTitleTh: 'ฝึกสเต็ปถอยมุมหลังแบ็คแฮนด์และเคลียร์ลึก',
      steps: isThai
        ? [
            'ซ้อมก้าว Chasse ถอยมุมหลังซ้ายพร้อมหมุนสะโพก 12 ครั้ง x 3 เซ็ต',
            'สลับตี Round-the-head เคลียร์ลึกกับดรอปตัดเส้นข้าง',
            'ลงเท้าด้วยขาขวาและดีดกลับกลางคอร์ทภายใน 0.8 วินาที',
          ]
        : [
            'Chasse footwork into deep backhand corner with hip rotation (3x12).',
            'Alternate round-the-head deep clear and sliced cross-drop.',
            'Land balanced and push back to center within 0.8s.',
          ],
    },
    'back-right': {
      name: isThai ? 'จุดตบทำแต้ม' : 'Smash Power Hotspot',
      errors: zoneCounts['back-right'],
      advice: isThai
        ? `จุดทำแต้มหลัก ตบชนะ ${zoneCounts['back-right']} แต้ม จังหวะกดวิถีลูกชันและแม่นยำ`
        : `Primary scoring zone with ${zoneCounts['back-right']} smash winners and steep downward trajectory.`,
      tag: isThai ? 'จุดทำแต้ม' : 'Winner Hotspot',
      color: '#7cd7a0',
      focusArea: 'Smash',
      drillTitle: 'Steep Jump Smash & Follow-Up Kill',
      drillTitleTh: 'ฝึกตบจัมป์สแมชกดมุมและตามซ้ำหน้าเน็ต',
      steps: isThai
        ? [
            'กระโดดตบเล็งมุมเส้นข้าง 10 ลูกต่อเนื่องสลับจังหวะช้า-เร็ว',
            'หมุนลำตัวและสะบัดข้อมือกดหน้าไม้ให้วิถีลูกชันลง',
            'ตามเข้าหน้าเน็ตทันทีเพื่อดักซ้ำลูกรับของคู่แข่ง',
          ]
        : [
            'Hit 10 consecutive steep smashes targeting sideline corners.',
            'Drive trunk rotation and wrist pronation for sharper downward angle.',
            'Follow every smash with a quick step in to kill weak blocks.',
          ],
    },
  };

  const currentZone = ZONE_INFO[selectedZone] || ZONE_INFO['front-left'];
  const activeAiInsight = aiInsightsByZone[selectedZone];

  const handleAnalyzeZoneWithAi = async () => {
    if (isAnalyzingZone) return;
    setIsAnalyzingZone(true);
    setAiError(null);
    try {
      const res = await fetchAIMatchDiagnostics({
        zoneName: currentZone.name,
        errorsCount: currentZone.errors,
        matchScore: liveMatchScore,
        language,
      });
      setAiInsightsByZone((prev) => ({
        ...prev,
        [selectedZone]: {
          advice: res.advice,
          drillFocus: res.drillFocus,
          source: res.source,
        },
      }));
      gainExp(25, isThai ? `AI วิเคราะห์โซน ${currentZone.name}` : `AI analyzed ${currentZone.name}`);
    } catch (err) {
      console.error('Zone AI diagnostics failed:', err);
      setAiError(
        isThai
          ? 'เชื่อมต่อโค้ช AI ไม่สำเร็จชั่วคราว กรุณาลองกดวิเคราะห์ใหม่อีกครั้ง'
          : 'Could not reach AI Coach right now. Please try again.'
      );
    } finally {
      setIsAnalyzingZone(false);
    }
  };

  const handleAddDrill = () => {
    addCustomDrill({
      title: activeAiInsight?.drillFocus || currentZone.drillTitle,
      thaiTitle: activeAiInsight?.drillFocus
        ? `${currentZone.name}: ${activeAiInsight.drillFocus}`
        : currentZone.drillTitleTh,
      focusArea: currentZone.focusArea,
      difficulty: 'Intermediate',
      durationMin: 15,
      expReward: 120,
      description: activeAiInsight?.advice || currentZone.advice,
      videoPlaceholderUrl: '/src/assets/images/badminton_smash_action_1793695158261.jpg',
      steps: currentZone.steps,
    });
    setDrillAdded(true);
    gainExp(80, isThai ? `เพิ่มแบบฝึกซ้อมแก้${currentZone.name}` : `Added ${currentZone.name} drill`);
    setTimeout(() => {
      navigateTo('D2');
    }, 650);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f8faf6] text-[#142608] overflow-hidden">
      <MobileHeader showBack />

      <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-28">
        {/* 2D Badminton Court Interactive Map */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'แผนผังวิเคราะห์จุดอ่อน 4 โซน' : '2D WEAKNESS HEATMAP'}
            subtitle={
              isThai
                ? `สกอร์อ้างอิง ${liveMatchScore} · แตะโซนเพื่อวิเคราะห์`
                : `Match score ${liveMatchScore} · Tap any zone`
            }
            badge={match.shotHistory.length > 0 ? (isThai ? 'ข้อมูลสด' : 'LIVE DATA') : (isThai ? 'คอร์ท 3' : 'COURT 3')}
            badgeVariant="orange"
          />

          <div className="rounded-[32px] p-4 text-center bg-[#ffffff] border border-[#d4dfd0]">
            <div className="relative w-full max-w-[280px] h-60 mx-auto bg-[#7cd7a0]/30 rounded-[24px] p-2 flex flex-col justify-between overflow-hidden">
              {/* Net Divider */}
              <div className="absolute top-1/2 inset-x-0 h-1 bg-[#142608] z-10 flex items-center justify-center">
                <span className="px-2 py-0.5 bg-[#142608] text-[#ffffff] text-[8px] font-black uppercase rounded-[1600px] whitespace-nowrap">
                  {isThai ? 'เน็ต' : 'NET'}
                </span>
              </div>

              {/* Top Half: Opponent side */}
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#142608]/60 uppercase tracking-[0.032em]">
                  {isThai ? 'แดนคู่ต่อสู้' : 'Opponent Court'}
                </span>
              </div>

              {/* Bottom Half: Player 4 zones */}
              <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-1.5 pt-1.5 z-20">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedZone('front-left');
                    setDrillAdded(false);
                  }}
                  className={`rounded-[16px] p-1.5 text-[10px] font-bold uppercase tracking-[0.032em] flex flex-col items-center justify-center transition-all cursor-pointer border border-[#142608] ${
                    selectedZone === 'front-left'
                      ? 'bg-[#e85729] text-[#ffffff] scale-102 ring-2 ring-[#142608]'
                      : 'bg-[#ffffff] text-[#142608] hover:bg-[#e8f7ee]'
                  }`}
                >
                  <span>{isThai ? 'หน้าเน็ตซ้าย' : 'Forehand Net'}</span>
                  <span className="text-[9px] font-mono mt-0.5">
                    {isThai ? `พลาด ${zoneCounts['front-left']} ครั้ง` : `${zoneCounts['front-left']} Errors`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedZone('front-right');
                    setDrillAdded(false);
                  }}
                  className={`rounded-[16px] p-1.5 text-[10px] font-bold uppercase tracking-[0.032em] flex flex-col items-center justify-center transition-all cursor-pointer border border-[#142608] ${
                    selectedZone === 'front-right'
                      ? 'bg-[#7cd7a0] text-[#142608] scale-102 ring-2 ring-[#142608]'
                      : 'bg-[#ffffff] text-[#142608] hover:bg-[#e8f7ee]'
                  }`}
                >
                  <span>{isThai ? 'หน้าเน็ตขวา' : 'Backhand Net'}</span>
                  <span className="text-[9px] font-mono mt-0.5">
                    {isThai ? `พลาด ${zoneCounts['front-right']} ครั้ง` : `${zoneCounts['front-right']} Errors`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedZone('back-left');
                    setDrillAdded(false);
                  }}
                  className={`rounded-[16px] p-1.5 text-[10px] font-bold uppercase tracking-[0.032em] flex flex-col items-center justify-center transition-all cursor-pointer border border-[#142608] ${
                    selectedZone === 'back-left'
                      ? 'bg-[#e85729] text-[#ffffff] scale-102 ring-2 ring-[#142608]'
                      : 'bg-[#ffffff] text-[#142608] hover:bg-[#e8f7ee]'
                  }`}
                >
                  <span>{isThai ? 'มุมหลังซ้าย' : 'Deep Backhand'}</span>
                  <span className="text-[9px] font-mono mt-0.5">
                    {isThai ? `พลาด ${zoneCounts['back-left']} ครั้ง` : `${zoneCounts['back-left']} Errors`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedZone('back-right');
                    setDrillAdded(false);
                  }}
                  className={`rounded-[16px] p-1.5 text-[10px] font-bold uppercase tracking-[0.032em] flex flex-col items-center justify-center transition-all cursor-pointer border border-[#142608] ${
                    selectedZone === 'back-right'
                      ? 'bg-[#7cd7a0] text-[#142608] scale-102 ring-2 ring-[#142608]'
                      : 'bg-[#ffffff] text-[#142608] hover:bg-[#e8f7ee]'
                  }`}
                >
                  <span>{isThai ? 'โซนตบทำแต้ม' : 'Smash Zone'}</span>
                  <span className="text-[9px] font-mono mt-0.5">
                    {isThai ? `ชนะ ${zoneCounts['back-right']} แต้ม` : `${zoneCounts['back-right']} Winners`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Zone Detail Card */}
        <div className="space-y-2">
          <SectionHeader
            title={currentZone.name}
            subtitle={isThai ? 'สถิติและวิธีแก้ไข' : 'Breakdown & biomechanics tip'}
            badge={currentZone.tag}
            badgeVariant={currentZone.color === '#e85729' ? 'orange' : 'green'}
          />

          <div className="rounded-[28px] p-4 space-y-3 bg-[#ffffff] border border-[#d4dfd0]">
            <p className="text-xs text-[#142608]/80 leading-relaxed font-medium">
              {currentZone.advice}
            </p>

            {aiError && (
              <div className="p-2.5 rounded-[14px] bg-[#fff1ec] border border-[#e85729]/30 text-[11px] font-medium text-[#b93815] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#e85729]" />
                <span>{aiError}</span>
              </div>
            )}

            {activeAiInsight && (
              <div className="p-3 rounded-[18px] bg-[#e8f7ee] border border-[#7cd7a0] space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[#004d2c] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isThai ? 'คำแนะนำจาก AI โค้ช' : 'AI Coach Breakdown'}
                  </span>
                  <span className="text-[10px] font-semibold text-[#15803d] uppercase">
                    {activeAiInsight.source === 'gemini' ? 'GEMINI AI' : 'COACH AI'}
                  </span>
                </div>
                <p className="text-[#142608] leading-relaxed">{activeAiInsight.advice}</p>
                <div className="text-[11px] font-semibold text-[#004d2c]">
                  {isThai ? 'แบบฝึกแนะนำ: ' : 'Recommended Drill: '}
                  {activeAiInsight.drillFocus}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyzeZoneWithAi}
              disabled={isAnalyzingZone}
              className="no-doodle w-full py-2.5 px-4 rounded-[1600px] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer bg-[#f8faf6] hover:bg-[#e8f7ee] text-[#004d2c] border border-[#d4dfd0] hover:border-[#2d4d14] whitespace-nowrap disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
              <span>
                {isAnalyzingZone
                  ? isThai ? 'กำลังให้โค้ช AI วิเคราะห์...' : 'Analyzing with AI Coach...'
                  : isThai ? 'ให้โค้ช AI วิเคราะห์จุดนี้ (+25 EXP)' : 'Ask AI Coach on This Zone (+25 EXP)'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleAddDrill}
              disabled={drillAdded}
              className="no-doodle w-full py-3.5 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] whitespace-nowrap disabled:opacity-80"
            >
              {drillAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3] text-[#7cd7a0] shrink-0" />
                  <span>{isThai ? 'บันทึกเข้าหน้าฝึกซ้อมแล้ว (+80 คะแนน)' : 'SAVED TO PRACTICE DRILLS (+80 EXP)'}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-[#7cd7a0] text-[#7cd7a0] shrink-0" />
                  <span>{isThai ? 'เพิ่มลงหน้าฝึกซ้อมจริง (D2)' : 'ADD TO MY PRACTICE DRILLS'}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dual Actions Footer */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => navigateTo('C4')}
            className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5 text-[#e85729] shrink-0" />
            <span>{isThai ? 'แชร์การ์ดผลแข่ง' : 'SHARE RECAP'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('D1')}
            className="py-3 px-3 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] border border-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
          >
            <span>{isThai ? 'ดูเรดาร์โค้ช' : 'COACH RADAR'}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
