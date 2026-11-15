import React, { useMemo, useState } from 'react';
import {
  RefreshCw,
  Play,
  Swords,
  Target,
  TrendingUp,
  Check,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { DoodleAvatar } from '../common/DoodleAvatar';
import { playSelectSound } from '../../utils/retroAudio';
import {
  MatchMode,
  OpponentSuggestion,
  computeSkillOvr,
  detectWeakestAxis,
  generateBalancedPairings,
  getAxisLabel,
  suggestOpponents,
} from '../../utils/matchmakerAlgorithm';

export const E3_AISmartMatchmakerScreen: React.FC = () => {
  const { player, leaderboard, startNewMatch, gainExp, language } = useApp();
  const isThai = language === 'th';

  const [matchMode, setMatchMode] = useState<MatchMode>('balanced');
  const [shuffleCount, setShuffleCount] = useState(0);
  const [lockedOpponentId, setLockedOpponentId] = useState<string | null>(null);
  const [showAllOpponents, setShowAllOpponents] = useState(false);

  const playerOvr = useMemo(() => computeSkillOvr(player.skillRadar), [player.skillRadar]);
  const weakestAxis = useMemo(() => detectWeakestAxis(player.skillRadar), [player.skillRadar]);

  const suggestions = useMemo(
    () => suggestOpponents(player, leaderboard, matchMode),
    [player, leaderboard, matchMode]
  );

  const pairings = useMemo(
    () => generateBalancedPairings(player, suggestions, lockedOpponentId),
    [player, suggestions, lockedOpponentId]
  );

  const currentPairing =
    pairings.length > 0 ? pairings[shuffleCount % pairings.length] : null;

  const visibleSuggestions = showAllOpponents ? suggestions : suggestions.slice(0, 3);

  const handleModeChange = (mode: MatchMode) => {
    playSelectSound();
    setMatchMode(mode);
    setShuffleCount(0);
  };

  const handleToggleLockOpponent = (opponentId: string) => {
    playSelectSound();
    setLockedOpponentId((prev) => (prev === opponentId ? null : opponentId));
    setShuffleCount(0);
  };

  const handleShuffle = () => {
    playSelectSound();
    setShuffleCount((prev) => prev + 1);
  };

  const handleChallenge1v1 = (suggestion: OpponentSuggestion) => {
    playSelectSound();
    const myShortName = (isThai ? player.nameTh : player.nameEn) || player.name;
    const oppName = isThai ? suggestion.candidate.name : suggestion.candidate.nameEn;
    gainExp(35, `ท้าดวลเดี่ยวกับ ${suggestion.candidate.name}`);
    startNewMatch({
      playerAName: myShortName.split(' ')[0],
      playerBName: oppName.split(' ')[0],
      isDoubles: false,
    });
  };

  const handleAcceptDuel = () => {
    playSelectSound();
    gainExp(40, 'เริ่มการแข่งขันแมตช์สลับมือสมดุล AI');
    if (currentPairing) {
      const a1 = (isThai ? currentPairing.teamA[0].name : currentPairing.teamA[0].nameEn).split(' ')[0];
      const a2 = (isThai ? currentPairing.teamA[1].name : currentPairing.teamA[1].nameEn).split(' ')[0];
      const b1 = (isThai ? currentPairing.teamB[0].name : currentPairing.teamB[0].nameEn).split(' ')[0];
      const b2 = (isThai ? currentPairing.teamB[1].name : currentPairing.teamB[1].nameEn).split(' ')[0];
      startNewMatch({
        playerAName: `${a1} & ${a2}`,
        playerBName: `${b1} & ${b2}`,
        isDoubles: true,
      });
      return;
    }
    startNewMatch();
  };

  const weakestLabel = getAxisLabel(weakestAxis, isThai ? 'th' : 'en');
  const weakestScore = player.skillRadar[weakestAxis];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-hidden">
      <MobileHeader showBack />

      <div className="px-5 pt-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-24">
        {/* 1. User Skill Baseline & Matching Algorithm Mode Filter */}
        <div className="space-y-2.5">
          <SectionHeader
            title={isThai ? 'แนะนำคู่แข่งตามระดับฝีมือ' : 'SKILL-BASED OPPONENTS'}
            subtitle={
              isThai
                ? `คำนวณจากคะแนนทักษะ (${playerOvr}) · จุดพัฒนา: ${weakestLabel} ${weakestScore}`
                : `Matched to 5-axis radar (OVR ${playerOvr}) · Focus: ${weakestLabel} ${weakestScore}`
            }
            badge={isThai ? `คะแนน ${playerOvr}` : `OVR ${playerOvr}`}
            badgeVariant="dark"
          />

          {/* Clean Mode Filter Pills (exempt from heavy borders) */}
          <div data-filter="true" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleModeChange('balanced')}
              className={`px-3 py-1.5 rounded-[1600px] text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 border border-[#000000]/20 cursor-pointer transition-colors ${
                matchMode === 'balanced'
                  ? 'bg-[#000000] text-[#ffffff]'
                  : 'bg-[#ffffff] text-[#000000] hover:bg-[#e8f7ee]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{isThai ? 'สมดุล 50/50' : 'Balanced 50/50'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('weakness')}
              className={`px-3 py-1.5 rounded-[1600px] text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 border border-[#000000]/20 cursor-pointer transition-colors ${
                matchMode === 'weakness'
                  ? 'bg-[#000000] text-[#ffffff]'
                  : 'bg-[#ffffff] text-[#000000] hover:bg-[#e8f7ee]'
              }`}
            >
              <Target className="w-3.5 h-3.5 shrink-0" />
              <span>{isThai ? `ฝึก${weakestLabel}` : `Train ${weakestLabel}`}</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('challenge')}
              className={`px-3 py-1.5 rounded-[1600px] text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 border border-[#000000]/20 cursor-pointer transition-colors ${
                matchMode === 'challenge'
                  ? 'bg-[#000000] text-[#ffffff]'
                  : 'bg-[#ffffff] text-[#000000] hover:bg-[#e8f7ee]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              <span>{isThai ? 'ท้าไต่แรงก์' : 'Rank Push'}</span>
            </button>
          </div>
        </div>

        {/* 2. Ranked Opponent Suggestions List */}
        <div className="space-y-2.5">
          {visibleSuggestions.map((item, idx) => {
            const { candidate, matchScore, ovrDiff, playerWinProb, comparisonAxes } = item;
            const isLocked = lockedOpponentId === candidate.id;
            const displayName = isThai ? candidate.name : candidate.nameEn;

            return (
              <div
                key={candidate.id}
                className={`rounded-[26px] p-4 bg-[#ffffff] space-y-3 transition-all ${
                  isLocked ? 'ring-2 ring-[#7cd7a0]' : ''
                }`}
              >
                {/* Top Row: Rank Badge + Avatar + Name + Match % */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <DoodleAvatar
                      preset={candidate.avatarPreset}
                      seed={candidate.name}
                      size="md"
                      ringClass="border border-[#000000]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-[#000000]/50">#{idx + 1}</span>
                        <h4 className="text-sm font-bold text-[#000000] truncate">{displayName}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-[1600px] bg-[#e8f7ee] text-[#15803d] text-[10px] font-bold whitespace-nowrap">
                          {isThai ? `พลัง ${candidate.ovr}` : `OVR ${candidate.ovr}`} ({ovrDiff >= 0 ? `+${ovrDiff}` : ovrDiff})
                        </span>
                        <span className="px-2 py-0.5 rounded-[1600px] bg-[#f4f8fb] text-[#000000]/75 text-[10px] font-bold whitespace-nowrap">
                          {isThai
                            ? candidate.tier === 'Diamond'
                              ? 'ไดมอนด์'
                              : candidate.tier === 'Gold'
                                ? 'โกลด์'
                                : candidate.tier === 'Silver'
                                  ? 'ซิลเวอร์'
                                  : 'บรอนซ์'
                            : candidate.tier}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-[11px] font-bold whitespace-nowrap">
                      {matchScore}% {isThai ? 'เข้ากัน' : 'MATCH'}
                    </span>
                    <div className="text-[10px] font-bold text-[#000000]/60 mt-1 whitespace-nowrap">
                      {isThai ? `โอกาสชนะ ${playerWinProb}%` : `${playerWinProb}% Win Prob`}
                    </div>
                  </div>
                </div>

                {/* Algorithm Rationale */}
                <p className="text-xs text-[#000000]/75 font-normal leading-snug">
                  {isThai ? item.reasonTh : item.reasonEn}
                </p>

                {/* Radar Stat Comparison Chips (User vs Opponent) */}
                <div className="grid grid-cols-2 gap-2">
                  {comparisonAxes.map((ax) => (
                    <div
                      key={ax.axis}
                      className="rounded-[14px] bg-[#f4f8fb] px-2.5 py-2 flex items-center justify-between text-[11px]"
                    >
                      <span className="font-bold text-[#000000]/70 truncate">
                        {isThai ? ax.labelTh : ax.labelEn}
                      </span>
                      <span className="font-bold tabular-nums text-[#000000] whitespace-nowrap">
                        {ax.playerVal} <span className="text-[#000000]/40">{isThai ? '/' : 'vs'}</span>{' '}
                        <span className={ax.delta > 0 ? 'text-[#e85729]' : 'text-[#15803d]'}>
                          {ax.opponentVal}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Row */}
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleToggleLockOpponent(candidate.id)}
                    className={`flex-1 py-2 px-3 rounded-[1600px] text-[11px] font-bold whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer ${
                      isLocked
                        ? 'bg-[#7cd7a0] text-[#000000]'
                        : 'bg-[#ffffff] text-[#000000]'
                    }`}
                  >
                    {isLocked && <Check className="w-3.5 h-3.5 shrink-0" />}
                    <span>
                      {isLocked
                        ? isThai
                          ? 'เลือกเป็นคู่แข่งแล้ว'
                          : 'Rival Selected'
                        : isThai
                          ? 'เลือกเข้าทีม B'
                          : 'Pin to Team B'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChallenge1v1(item)}
                    className="py-2 px-3.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[11px] font-bold whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Swords className="w-3.5 h-3.5 shrink-0" />
                    <span>{isThai ? 'ดวลเดี่ยว' : '1v1 Match'}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {suggestions.length > 3 && (
            <div className="text-center pt-0.5">
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  setShowAllOpponents((prev) => !prev);
                }}
                className="px-4 py-1.5 rounded-[1600px] bg-[#ffffff] text-[#000000] text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                {showAllOpponents
                  ? isThai
                    ? 'แสดงน้อยลง'
                    : 'Show Top 3'
                  : isThai
                    ? `ดูคู่แข่งแนะนำทั้งหมด (${suggestions.length})`
                    : `Show All ${suggestions.length} Suggestions`}
              </button>
            </div>
          )}
        </div>

        {/* 3. Dynamic 50/50 Doubles Team Balancer */}
        {currentPairing && (
          <div className="space-y-2.5 pt-1">
            <SectionHeader
              title={isThai ? 'จัดทีมคู่ 50/50 อัตโนมัติ' : 'BALANCED 2V2 TEAM PAIRING'}
              subtitle={
                lockedOpponentId
                  ? isThai
                    ? 'ล็อกคู่แข่งไว้ในทีม B แล้ว'
                    : 'Locked selected rival in Team B'
                  : isThai
                    ? 'จับคู่ 4 คนให้สูสีที่สุด'
                    : 'Auto-paired for tight rallies'
              }
              badge={isThai ? 'ทีมสมดุล' : 'BALANCED'}
              badgeVariant="orange"
            />

            {/* Balance Score Card */}
            <div className="p-4 rounded-[26px] flex items-center justify-between gap-2 bg-[#7cd7a0] text-[#000000]">
              <div className="min-w-0">
                <span className="font-['Antonio',sans-serif] text-base font-black uppercase tracking-wide block truncate">
                  {isThai ? currentPairing.balanceLabelTh : currentPairing.balanceLabelEn}
                </span>
                <p className="text-[11px] text-[#000000]/80 font-normal">
                  {isThai
                    ? `พลังเฉลี่ย ${currentPairing.teamAOvr} ต่อ ${currentPairing.teamBOvr}`
                    : `Team Avg ${currentPairing.teamAOvr} vs ${currentPairing.teamBOvr}`}
                </p>
              </div>

              <button
                type="button"
                onClick={handleShuffle}
                className="px-3 py-1.5 rounded-[1600px] text-xs font-bold flex items-center gap-1.5 cursor-pointer bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9] shrink-0 whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                <span>{isThai ? 'สลับคู่ใหม่' : 'Re-shuffle'}</span>
              </button>
            </div>

            {/* Balanced Teams Display */}
            <div className="grid grid-cols-2 gap-3">
              {/* Team A */}
              <div className="rounded-[28px] p-4 bg-[#7cd7a0] space-y-2.5">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase block text-[#000000]/70">
                      {isThai ? 'ทีม A' : 'TEAM A'}
                    </span>
                    <span className="font-['Antonio',sans-serif] text-base font-black uppercase text-[#000000] tabular-nums">
                      {isThai ? `พลัง ${currentPairing.teamAOvr}` : `OVR ${currentPairing.teamAOvr}`}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#000000] px-2 py-0.5 rounded-[1600px] bg-[#ffffff] whitespace-nowrap">
                    {isThai ? `ชนะ ${currentPairing.winProbA}%` : `${currentPairing.winProbA}% Win`}
                  </span>
                </div>
                <div className="space-y-2">
                  {currentPairing.teamA.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-[18px] bg-[#ffffff] text-xs flex items-center gap-2">
                      <DoodleAvatar seed={p.name} size="xs" />
                      <div className="min-w-0">
                        <span className="font-bold block truncate text-[#000000]">
                          {isThai ? p.name : p.nameEn}
                        </span>
                        <span className="text-[10px] text-[#000000]/60 block truncate">
                          {isThai ? `พลัง ${p.ovr} · ${p.role}` : `OVR ${p.ovr} · ${p.role}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team B */}
              <div className="rounded-[28px] p-4 bg-[#e8f7ee] space-y-2.5">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase block text-[#000000]/70">
                      {isThai ? 'ทีม B' : 'TEAM B'}
                    </span>
                    <span className="font-['Antonio',sans-serif] text-base font-black uppercase text-[#000000] tabular-nums">
                      {isThai ? `พลัง ${currentPairing.teamBOvr}` : `OVR ${currentPairing.teamBOvr}`}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#000000] px-2 py-0.5 rounded-[1600px] bg-[#ffffff] whitespace-nowrap">
                    {isThai ? `ชนะ ${currentPairing.winProbB}%` : `${currentPairing.winProbB}% Win`}
                  </span>
                </div>
                <div className="space-y-2">
                  {currentPairing.teamB.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-[18px] bg-[#ffffff] text-xs flex items-center gap-2">
                      <DoodleAvatar seed={p.name} size="xs" />
                      <div className="min-w-0">
                        <span className="font-bold block truncate text-[#000000]">
                          {isThai ? p.name : p.nameEn}
                        </span>
                        <span className="text-[10px] text-[#000000]/60 block truncate">
                          {isThai ? `พลัง ${p.ovr} · ${p.role}` : `OVR ${p.ovr} · ${p.role}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accept Duel CTA */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleAcceptDuel}
            className="w-full py-3.5 px-4 rounded-[1600px] font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-[#ffffff] shrink-0" />
            <span className="whitespace-nowrap">
              {isThai ? 'ยอมรับผลจับคู่และเริ่มนับแต้ม' : 'ACCEPT DUEL & START MATCH'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
