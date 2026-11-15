/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MatchScoreState, ShotType } from '../types';

export interface MatchInsightResult {
  focusTagTh: string;
  focusTagEn: string;
  headlineTh: string;
  headlineEn: string;
  technicalTipTh: string;
  technicalTipEn: string;
  evidenceSummaryTh: string;
  evidenceSummaryEn: string;
  shotsAnalyzed: number;
  topUserShot: ShotType;
  opponentThreatShot: ShotType;
}

function getDominantShot(shots: ShotType[], fallback: ShotType): ShotType {
  if (shots.length === 0) return fallback;
  const counts: Record<string, number> = {};
  for (const s of shots) {
    counts[s] = (counts[s] || 0) + 1;
  }
  let best = fallback;
  let bestCount = -1;
  for (const [shot, count] of Object.entries(counts)) {
    if (count > bestCount) {
      best = shot as ShotType;
      bestCount = count;
    }
  }
  return best;
}

export function analyzeMatchInsights(match: MatchScoreState): MatchInsightResult {
  const userShots = match.shotHistory.filter((s) => s.team === 'A');
  const opponentShots = match.shotHistory.filter((s) => s.team === 'B');

  const topUserShot = getDominantShot(
    userShots.map((s) => s.shotType),
    'Smash'
  );
  const opponentThreatShot = getDominantShot(
    opponentShots.map((s) => s.shotType),
    'Drop'
  );

  const scoreDiff = match.scoreA - match.scoreB;
  const totalShots = Math.max(match.shotHistory.length, match.scoreA + match.scoreB);
  const isCloseGame = Math.abs(scoreDiff) <= 3 && (match.scoreA >= 16 || match.scoreB >= 16);

  const oppFrontCourtCount = opponentShots.filter(
    (s) => s.shotType === 'Drop' || s.shotType === 'Net'
  ).length;
  const userSmashCount = userShots.filter((s) => s.shotType === 'Smash').length;
  const driveCount = match.shotHistory.filter((s) => s.shotType === 'Drive').length;

  // Priority 1: Tight match / deuce pressure -> Serve height & third-shot discipline
  if (isCloseGame) {
    return {
      focusTagTh: 'แท็กติกลูกเสิร์ฟ & แต้มเบียด',
      focusTagEn: 'SERVE DISCIPLINE',
      headlineTh: 'ลดความสูงลูกเสิร์ฟสั้นช่วงแต้มเบียด',
      headlineEn: 'Keep Short Serves Tight Over the Tape',
      technicalTipTh:
        'เน้นเสิร์ฟให้ต่ำเลียดตาข่ายมากขึ้น โดยเฉพาะช่วงแต้ม 18+ เพื่อตัดโอกาสคู่แข่งบุกสวนเร็วหน้าเน็ต',
      technicalTipEn:
        'Focus on serving lower over the net during high-pressure 18+ rallies to deny easy front-court attacks.',
      evidenceSummaryTh: `สกอร์เบียด ${match.scoreA}-${match.scoreB} · คู่แข่งทำแต้มจาก ${opponentThreatShot} บ่อยสุด`,
      evidenceSummaryEn: `Tight ${match.scoreA}-${match.scoreB} finish · Opponent scored most via ${opponentThreatShot}`,
      shotsAnalyzed: totalShots,
      topUserShot,
      opponentThreatShot,
    };
  }

  // Priority 2: Opponent hurting user at the net / drops
  if (oppFrontCourtCount >= opponentShots.length * 0.45 || opponentThreatShot === 'Drop' || opponentThreatShot === 'Net') {
    return {
      focusTagTh: 'คุมโซนหน้าเน็ต & เสิร์ฟ',
      focusTagEn: 'NET & SERVE HEIGHT',
      headlineTh: 'เสิร์ฟเลียดเน็ตและตั้งหน้าไม้สูงหลังหยอด',
      headlineEn: 'Focus on Serving Lower Over the Net',
      technicalTipTh:
        'เน้นเสิร์ฟให้ต่ำเลียดขอบเน็ตและยกหัวไม้ค้างไว้ระดับอกทันทีหลังหยอด เพื่อดักโต้ลูกหน้าเน็ตของคู่แข่งได้เร็วขึ้น',
      technicalTipEn:
        'Focus on serving lower over the net and keep your racket head up immediately after drops to intercept tight net replies.',
      evidenceSummaryTh: `คู่แข่งทำแต้มหน้าเน็ต/ลูกหยอดเด่น (${opponentThreatShot})`,
      evidenceSummaryEn: `Opponent attacked front-court gaps (${opponentThreatShot})`,
      shotsAnalyzed: totalShots,
      topUserShot,
      opponentThreatShot,
    };
  }

  // Priority 3: Fast flat drive battle
  if (driveCount >= Math.max(2, match.shotHistory.length * 0.35)) {
    return {
      focusTagTh: 'จังหวะโต้ลูกเร็วกลางคอร์ท',
      focusTagEn: 'FLAT DRIVE SPEED',
      headlineTh: 'กระชับวงสวิงรับลูกไดรฟ์ให้ไวขึ้น',
      headlineEn: 'Shorten Your Backswing on Flat Exchanges',
      technicalTipTh:
        'ลดระยะง้างไม้ในจังหวะดวลลูกไดรฟ์กลางคอร์ท ใช้ข้อมือดีดสั้นหน้าลำตัวเพื่อให้คุมจังหวะบุกต่อเนื่อง',
      technicalTipEn:
        'Compact your backswing during fast mid-court drives and contact the shuttle slightly out in front of your body.',
      evidenceSummaryTh: `มีจังหวะดวลไดรฟ์สูง · ช็อตทำแต้มหลักคือ ${topUserShot}`,
      evidenceSummaryEn: `High-tempo drive rallies · Primary weapon: ${topUserShot}`,
      shotsAnalyzed: totalShots,
      topUserShot,
      opponentThreatShot,
    };
  }

  // Priority 4: Strong offensive smash match -> net follow-up tip
  if (userSmashCount >= 1 && scoreDiff > 0) {
    return {
      focusTagTh: 'ปิดแต้มต่อเนื่องหลังตบ',
      focusTagEn: 'ATTACK FOLLOW-UP',
      headlineTh: 'ก้าวตามซ้ำหน้าเน็ตทันทีหลังลูกสแมช',
      headlineEn: 'Split-Step Forward After Heavy Smashes',
      technicalTipTh:
        'ลูกตบสแมชทำคะแนนได้ดีมาก แนะนำให้ก้าวตามเข้าหน้าเน็ตทันทีหลังตบหนัก เพื่อเก็บแต้มซ้ำจากลูกรับที่ลอยคืน',
      technicalTipEn:
        'Your smash pace forced weak blocks—follow heavy smashes one step forward to kill loose returns at the net.',
      evidenceSummaryTh: `ชนะด้วยสกอร์ ${match.scoreA}-${match.scoreB} · ช็อตหลักคือ ${topUserShot}`,
      evidenceSummaryEn: `Won ${match.scoreA}-${match.scoreB} · Dominant winner: ${topUserShot}`,
      shotsAnalyzed: totalShots,
      topUserShot,
      opponentThreatShot,
    };
  }

  // Priority 5: Trailing / recovery defense -> deep lifts & serve placement
  return {
    focusTagTh: 'การวางลูก & เปิดเกมรับ',
    focusTagEn: 'CORNER PLACEMENT',
    headlineTh: 'เน้นเสิร์ฟต่ำและโยนเคลียร์ลึกถึงเส้นหลัง',
    headlineEn: 'Focus on Serving Lower Over the Net',
    technicalTipTh:
      'เน้นเสิร์ฟให้ต่ำเลียดตาข่ายคู่กับลูกเคลียร์ลึกเข้ามุมหลังซ้ายขวา เพื่อลดจังหวะตบซ้ำของคู่แข่ง',
    technicalTipEn:
      'Focus on serving lower over the net and push defensive lifts deep to the back boundary corners.',
    evidenceSummaryTh: `วิเคราะห์จากสกอร์ ${match.scoreA}-${match.scoreB} · ปรับสมดุลรับ-รุก`,
    evidenceSummaryEn: `Based on ${match.scoreA}-${match.scoreB} score · Reset rally tempo`,
    shotsAnalyzed: totalShots,
    topUserShot,
    opponentThreatShot,
  };
}
