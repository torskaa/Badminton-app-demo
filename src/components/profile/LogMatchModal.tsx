import React, { useState } from 'react';
import { X, Plus, Trophy, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playSelectSound } from '../../utils/retroAudio';

interface LogMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogMatchModal: React.FC<LogMatchModalProps> = ({ isOpen, onClose }) => {
  const { language, courts, selectedCourt, authUser, logHistoricalMatch } = useApp();
  const isThai = language === 'th';

  const [isDoubles, setIsDoubles] = useState(false);
  const [opponentName, setOpponentName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [courtName, setCourtName] = useState(selectedCourt?.name || courts[0]?.name || 'Smash Arena');
  const [set1A, setSet1A] = useState('21');
  const [set1B, setSet1B] = useState('17');
  const [set2A, setSet2A] = useState('21');
  const [set2B, setSet2B] = useState('16');
  const [includeSet3, setIncludeSet3] = useState(false);
  const [set3A, setSet3A] = useState('21');
  const [set3B, setSet3B] = useState('19');
  const [highestSmashKmh, setHighestSmashKmh] = useState('338');
  const [durationMin, setDurationMin] = useState('38');
  const [highlightShot, setHighlightShot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const parsedSets = [
    { scoreA: Math.max(0, Math.min(30, Number(set1A) || 0)), scoreB: Math.max(0, Math.min(30, Number(set1B) || 0)) },
    { scoreA: Math.max(0, Math.min(30, Number(set2A) || 0)), scoreB: Math.max(0, Math.min(30, Number(set2B) || 0)) },
    ...(includeSet3
      ? [{ scoreA: Math.max(0, Math.min(30, Number(set3A) || 0)), scoreB: Math.max(0, Math.min(30, Number(set3B) || 0)) }]
      : []),
  ];

  const setsWonA = parsedSets.filter((s) => s.scoreA >= s.scoreB && (s.scoreA > 0 || s.scoreB > 0)).length;
  const setsWonB = parsedSets.filter((s) => s.scoreB > s.scoreA).length;
  const previewIsWin = setsWonA >= setsWonB;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponentName.trim()) {
      setErrorMessage(isThai ? 'กรุณาระบุชื่อคู่แข่งก่อนบันทึก' : 'Please enter an opponent name.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await logHistoricalMatch({
        opponentName: opponentName.trim(),
        partnerName: isDoubles ? partnerName.trim() : undefined,
        isDoubles,
        courtName: courtName.trim() || selectedCourt.name,
        sets: parsedSets,
        highestSmashKmh: Number(highestSmashKmh) || 320,
        durationMin: Number(durationMin) || 35,
        highlightShot:
          highlightShot.trim() ||
          (isThai ? 'ลูกตบสแมชเส้นข้างปิดเกม' : 'Cross-court jump smash winner'),
        isPublic: true,
      });
      setOpponentName('');
      setPartnerName('');
      setHighlightShot('');
      onClose();
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          (isThai ? 'บันทึกผลแข่งไม่สำเร็จ กรุณาลองอีกครั้ง' : 'Could not save match. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#142608]/45 backdrop-blur-[2px] p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={isThai ? 'บันทึกผลการแข่งขัน' : 'Log Match Result'}
    >
      <div className="w-full max-w-lg bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e6eee2] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#e8f7ee] text-[#004d2c] flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-[#142608] leading-tight truncate">
                {isThai ? 'บันทึกผลแมตช์ใหม่' : 'Log Historical Match'}
              </h3>
              <p className="text-[11px] text-[#5c6f5e] truncate">
                {authUser
                  ? isThai
                    ? 'บันทึกลง Firebase อัปเดตเลเวล เหรียญ และสถิติทันที'
                    : 'Saves directly to Firebase and updates level, badges & stats'
                  : isThai
                    ? 'บันทึกในเครื่อง (ล็อกอิน Google เพื่อซิงค์คลาวด์)'
                    : 'Saved locally (sign in with Google to sync to Firebase)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              onClose();
            }}
            aria-label={isThai ? 'ปิดหน้าต่าง' : 'Close'}
            className="no-doodle w-10 h-10 rounded-full bg-[#f8faf6] border border-[#d4dfd0] hover:border-[#2d4d14] flex items-center justify-center text-[#142608] cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto overscroll-contain">
          {/* Format & Live Result Preview */}
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5" data-filter="true">
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  setIsDoubles(false);
                }}
                className={`no-doodle filter-pill min-h-[38px] px-4 rounded-full text-xs border transition-colors cursor-pointer ${
                  !isDoubles
                    ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c] font-semibold'
                    : 'bg-[#f8faf6] text-[#5c6f5e] border-[#d4dfd0] font-medium'
                }`}
              >
                {isThai ? 'ประเภทเดี่ยว' : 'Singles'}
              </button>
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  setIsDoubles(true);
                }}
                className={`no-doodle filter-pill min-h-[38px] px-4 rounded-full text-xs border transition-colors cursor-pointer ${
                  isDoubles
                    ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c] font-semibold'
                    : 'bg-[#f8faf6] text-[#5c6f5e] border-[#d4dfd0] font-medium'
                }`}
              >
                {isThai ? 'ประเภทคู่' : 'Doubles'}
              </button>
            </div>

            <div className="text-right tabular-nums">
              <div
                className={`text-xs font-bold ${
                  previewIsWin ? 'text-[#15803d]' : 'text-[#e85729]'
                }`}
              >
                {previewIsWin ? (isThai ? 'ชนะ' : 'Win') : isThai ? 'แพ้' : 'Loss'} · {setsWonA}-{setsWonB}
              </div>
              <div className="text-[10px] font-semibold text-[#5c6f5e]">
                +{previewIsWin ? 180 : 90} EXP
              </div>
            </div>
          </div>

          {/* Opponent & Optional Partner */}
          <div className={`grid gap-3 ${isDoubles ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <label className="block text-[11px] font-semibold text-[#5c6f5e] mb-1">
                {isThai ? (isDoubles ? 'คู่แข่ง (เช่น แบงค์ & ท็อป)' : 'ชื่อคู่แข่ง') : isDoubles ? 'Opponents (e.g. Bank & Top)' : 'Opponent Name'}
              </label>
              <input
                type="text"
                maxLength={80}
                value={opponentName}
                onChange={(e) => setOpponentName(e.target.value)}
                placeholder={isThai ? 'เช่น โอห์ม ปืนกล' : 'e.g. Ohm Machinegun'}
                className="w-full min-h-[44px] px-3.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] text-xs font-medium text-[#142608] outline-none"
              />
            </div>

            {isDoubles && (
              <div>
                <label className="block text-[11px] font-semibold text-[#5c6f5e] mb-1">
                  {isThai ? 'คู่หูของคุณ' : 'Your Partner'}
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder={isThai ? 'เช่น พลอย' : 'e.g. Ploy'}
                  className="w-full min-h-[44px] px-3.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] text-xs font-medium text-[#142608] outline-none"
                />
              </div>
            )}
          </div>

          {/* Court */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5c6f5e] mb-1">
              {isThai ? 'สนามที่แข่งขัน' : 'Badminton Court'}
            </label>
            <input
              type="text"
              maxLength={120}
              value={courtName}
              onChange={(e) => setCourtName(e.target.value)}
              placeholder={isThai ? 'ชื่อสนามแบดมินตัน' : 'Court venue name'}
              className="w-full min-h-[44px] px-3.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] text-xs font-medium text-[#142608] outline-none"
            />
          </div>

          {/* Set Scores */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#5c6f5e]">
                {isThai ? 'คะแนนแต่ละเซต (เรา - คู่แข่ง)' : 'Set Scores (You - Opponent)'}
              </label>
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  setIncludeSet3((v) => !v);
                }}
                className="no-doodle text-[11px] font-semibold text-[#004d2c] hover:text-[#15803d] cursor-pointer"
              >
                {includeSet3
                  ? isThai
                    ? '- ลบเซต 3'
                    : '- Remove Set 3'
                  : isThai
                    ? '+ เพิ่มเซต 3'
                    : '+ Add Set 3'}
              </button>
            </div>

            <div className={`grid gap-2.5 ${includeSet3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {/* Set 1 */}
              <div className="p-2.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] space-y-1.5">
                <span className="text-[10px] font-bold text-[#5c6f5e] block text-center">
                  {isThai ? 'เซต 1' : 'Set 1'}
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={set1A}
                    onChange={(e) => setSet1A(e.target.value)}
                    className="w-full min-h-[38px] text-center rounded-[10px] bg-[#ffffff] border border-[#d4dfd0] text-sm font-bold text-[#142608] tabular-nums outline-none focus:border-[#004d2c]"
                  />
                  <span className="text-xs font-bold text-[#5c6f5e]">-</span>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={set1B}
                    onChange={(e) => setSet1B(e.target.value)}
                    className="w-full min-h-[38px] text-center rounded-[10px] bg-[#ffffff] border border-[#d4dfd0] text-sm font-bold text-[#142608] tabular-nums outline-none focus:border-[#004d2c]"
                  />
                </div>
              </div>

              {/* Set 2 */}
              <div className="p-2.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] space-y-1.5">
                <span className="text-[10px] font-bold text-[#5c6f5e] block text-center">
                  {isThai ? 'เซต 2' : 'Set 2'}
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={set2A}
                    onChange={(e) => setSet2A(e.target.value)}
                    className="w-full min-h-[38px] text-center rounded-[10px] bg-[#ffffff] border border-[#d4dfd0] text-sm font-bold text-[#142608] tabular-nums outline-none focus:border-[#004d2c]"
                  />
                  <span className="text-xs font-bold text-[#5c6f5e]">-</span>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={set2B}
                    onChange={(e) => setSet2B(e.target.value)}
                    className="w-full min-h-[38px] text-center rounded-[10px] bg-[#ffffff] border border-[#d4dfd0] text-sm font-bold text-[#142608] tabular-nums outline-none focus:border-[#004d2c]"
                  />
                </div>
              </div>

              {/* Set 3 */}
              {includeSet3 && (
                <div className="p-2.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#5c6f5e] block text-center">
                    {isThai ? 'เซต 3' : 'Set 3'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={set3A}
                      onChange={(e) => setSet3A(e.target.value)}
                      className="w-full min-h-[38px] text-center rounded-[10px] bg-[#ffffff] border border-[#d4dfd0] text-sm font-bold text-[#142608] tabular-nums outline-none focus:border-[#004d2c]"
                    />
                    <span className="text-xs font-bold text-[#5c6f5e]">-</span>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={set3B}
                      onChange={(e) => setSet3B(e.target.value)}
                      className="w-full min-h-[38px] text-center rounded-[10px] bg-[#ffffff] border border-[#d4dfd0] text-sm font-bold text-[#142608] tabular-nums outline-none focus:border-[#004d2c]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Smash Speed & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5c6f5e] mb-1">
                {isThai ? 'ความเร็วตบสูงสุด (กม./ชม.)' : 'Top Smash (km/h)'}
              </label>
              <input
                type="number"
                min={100}
                max={550}
                value={highestSmashKmh}
                onChange={(e) => setHighestSmashKmh(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] text-xs font-semibold text-[#142608] tabular-nums outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5c6f5e] mb-1">
                {isThai ? 'ระยะเวลาแข่ง (นาที)' : 'Duration (min)'}
              </label>
              <input
                type="number"
                min={5}
                max={240}
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] text-xs font-semibold text-[#142608] tabular-nums outline-none"
              />
            </div>
          </div>

          {/* Highlight Shot */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5c6f5e] mb-1">
              {isThai ? 'ช็อตไฮไลต์ประจำแมตช์ (ไม่บังคับ)' : 'Match Highlight Shot (Optional)'}
            </label>
            <input
              type="text"
              maxLength={140}
              value={highlightShot}
              onChange={(e) => setHighlightShot(e.target.value)}
              placeholder={isThai ? 'เช่น จัมป์สแมชลงเส้นข้างปิดเกม' : 'e.g. Cross-court jump smash winner'}
              className="w-full min-h-[44px] px-3.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#004d2c] text-xs font-medium text-[#142608] outline-none"
            />
          </div>

          {errorMessage && (
            <div className="px-3.5 py-2.5 rounded-[14px] bg-[#fff1ec] border border-[#e85729]/40 text-[11px] font-semibold text-[#e85729]">
              {errorMessage}
            </div>
          )}

          <div className="pt-1 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="no-doodle min-h-[46px] px-4 rounded-full bg-[#f8faf6] border border-[#d4dfd0] text-xs font-semibold text-[#5c6f5e] hover:text-[#142608] cursor-pointer"
            >
              {isThai ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="no-doodle flex-1 min-h-[46px] px-5 rounded-full bg-[#004d2c] hover:bg-[#15803d] disabled:opacity-60 text-[#ffffff] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>
                {isSubmitting
                  ? isThai
                    ? 'กำลังบันทึก...'
                    : 'Saving...'
                  : authUser
                    ? isThai
                      ? 'บันทึกแมตช์ลง Firebase'
                      : 'Save Match to Firebase'
                    : isThai
                      ? 'บันทึกผลการแข่งขัน'
                      : 'Save Match Result'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-[#5c6f5e]">
            <Sparkles className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
            <span>
              {isThai
                ? 'การบันทึกแมตช์จะอัปเดต EXP เลเวล และความคืบหน้าเหรียญรางวัลของคุณโดยอัตโนมัติ'
                : 'Logging a match automatically updates your EXP, level, and badge milestones.'}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
