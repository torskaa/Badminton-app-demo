import React, { useState } from 'react';
import {
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Shuffle,
  Share2,
  Calendar,
  LayoutGrid,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SectionHeader } from '../common/SectionHeader';
import { DoodleAvatar, resolveDoodlePreset } from '../common/DoodleAvatar';
import { playSelectSound } from '../../utils/retroAudio';
import scoreboard3dImg from '../../assets/images/tool_scoreboard_3d_1794976750657.jpg';
import randomizer3dImg from '../../assets/images/tool_randomizer_3d_1794976750325.jpg';
import tactic3dImg from '../../assets/images/tool_tactic_3d_1794976752122.jpg';
import calculator3dImg from '../../assets/images/tool_calculator_3d_1794976752575.jpg';

export const ClubToolsScreen: React.FC = () => {
  const {
    navigateTo,
    goBack,
    gainExp,
    t,
    language,
    leaderboard,
    currentEvent,
    guildEvents,
    selectGuildEvent,
    updateEventBudget,
    startNewMatch,
    setSparringModalPlayer,
  } = useApp();
  const isThai = language === 'th';
  const [activeTool, setActiveTool] = useState<'menu' | 'scoreboard' | 'randomizer' | 'tactic' | 'calc'>('menu');

  // 1. Scoreboard v2 State (real badminton 21/deuce/30 best-of-3 rules)
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [server, setServer] = useState<'A' | 'B'>('A');
  const [setNumber, setSetNumber] = useState(1);
  const [setsWonA, setSetsWonA] = useState(0);
  const [setsWonB, setSetsWonB] = useState(0);
  const [matchWinner, setMatchWinner] = useState<'A' | 'B' | null>(null);

  const handleMiniScorePoint = (side: 'A' | 'B') => {
    if (matchWinner) return;
    playSelectSound();
    const nextA = side === 'A' ? scoreA + 1 : scoreA;
    const nextB = side === 'B' ? scoreB + 1 : scoreB;
    setServer(side);

    const aWonSet = (nextA >= 21 && nextA - nextB >= 2) || nextA === 30;
    const bWonSet = (nextB >= 21 && nextB - nextA >= 2) || nextB === 30;

    if (aWonSet || bWonSet) {
      const nextSetsA = setsWonA + (aWonSet ? 1 : 0);
      const nextSetsB = setsWonB + (bWonSet ? 1 : 0);
      setSetsWonA(nextSetsA);
      setSetsWonB(nextSetsB);
      if (nextSetsA >= 2 || nextSetsB >= 2) {
        setScoreA(nextA);
        setScoreB(nextB);
        setMatchWinner(nextSetsA >= 2 ? 'A' : 'B');
      } else {
        setScoreA(0);
        setScoreB(0);
        setSetNumber((n) => n + 1);
      }
      return;
    }

    setScoreA(nextA);
    setScoreB(nextB);
  };

  const resetMiniMatch = () => {
    playSelectSound();
    setScoreA(0);
    setScoreB(0);
    setSetsWonA(0);
    setSetsWonB(0);
    setSetNumber(1);
    setServer('A');
    setMatchWinner(null);
  };

  // 2. Team Randomizer v2 State (real dynamic OVR pairings & balance calculation)
  const SQUAD_PLAYERS = [
    { name: language === 'th' ? 'กานต์ (คุณ)' : 'Karn (You)', ovr: 88, tier: 'Diamond' },
    { name: language === 'th' ? 'โอห์ม ปืนกล' : 'Ohm Machinegun', ovr: 84, tier: 'Diamond' },
    { name: language === 'th' ? 'แบงค์ กำแพง' : 'Bank The Wall', ovr: 81, tier: 'Gold' },
    { name: language === 'th' ? 'พลอย จอมหยอด' : 'Ploy Net Master', ovr: 80, tier: 'Gold' },
    { name: language === 'th' ? 'นัท เสิร์ฟพิฆาต' : 'Nat Ace Server', ovr: 76, tier: 'Silver' },
    { name: language === 'th' ? 'ท็อป ดรายฟ์' : 'Top Flat Drive', ovr: 82, tier: 'Gold' },
    { name: language === 'th' ? 'อาร์ท สปีด' : 'Art Speedster', ovr: 86, tier: 'Diamond' },
    { name: language === 'th' ? 'มีน แบ็กแฮนด์' : 'Meen Backhand', ovr: 77, tier: 'Silver' },
  ];
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([0, 3, 1, 5]);

  const shuffleBalancedTeams = () => {
    const indices = SQUAD_PLAYERS.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const picked = indices.slice(0, 4).sort((a, b) => SQUAD_PLAYERS[b].ovr - SQUAD_PLAYERS[a].ovr);
    // Pair highest+lowest vs middle two for true 50/50 balance
    setShuffledOrder([picked[0], picked[3], picked[1], picked[2]]);
    gainExp(20, language === 'th' ? 'สุ่มจับคู่ก๊วนสมดุล' : 'Balanced match shuffled');
  };

  const teamAPlayers = [SQUAD_PLAYERS[shuffledOrder[0]], SQUAD_PLAYERS[shuffledOrder[1]]];
  const teamBPlayers = [SQUAD_PLAYERS[shuffledOrder[2]], SQUAD_PLAYERS[shuffledOrder[3]]];
  const teamAOvr = Math.round((teamAPlayers[0].ovr + teamAPlayers[1].ovr) / 2);
  const teamBOvr = Math.round((teamBPlayers[0].ovr + teamBPlayers[1].ovr) / 2);
  const balanceScore = Math.max(60, Math.min(100, 100 - Math.abs(teamAOvr - teamBOvr) * 6));

  // 3. Tactic Board State
  const [formation, setFormation] = useState<'attack' | 'defense'>('attack');

  // 4. Group Cost Calc State
  const [courtHours, setCourtHours] = useState(3);
  const [courtRate] = useState(280);
  const [shuttleTubes, setShuttleTubes] = useState(2);
  const [shuttlePrice] = useState(480);
  const [playerCount, setPlayerCount] = useState(Math.max(2, currentEvent.attendees.length));

  const courtFeeTotalCalc = courtHours * courtRate;
  const shuttleFeeTotalCalc = shuttleTubes * shuttlePrice;
  const totalExpense = courtFeeTotalCalc + shuttleFeeTotalCalc;
  const costPerPerson = playerCount > 0 ? Math.ceil(totalExpense / playerCount) : 0;

  const toolCards = [
    {
      id: 'scoreboard' as const,
      title: t.toolScoreboard,
      subtitle: t.toolScoreboardDesc,
      cta: language === 'th' ? 'เริ่มนับคะแนน' : 'OPEN SCORER',
      cardBg: 'bg-[#de4b1a]',
      titleColor: 'text-[#ffffff]',
      subColor: 'text-[#ffe6dc]',
      ctaColor: 'text-[#ffffff]',
      image: scoreboard3dImg,
      imageAlt: language === 'th' ? 'ป้ายนับคะแนนแบดมินตัน 3 มิติ' : '3D Badminton Flip Scoreboard',
      imageBoxClass: 'right-0 bottom-0 w-[166px] h-[138px]',
      imgClass: 'w-full h-full object-cover object-bottom scale-[1.06] translate-x-1 translate-y-1',
      fadeLeft: 'from-[#de4b1a] via-[#de4b1a]/30',
      fadeTop: 'from-[#de4b1a]',
    },
    {
      id: 'randomizer' as const,
      title: t.toolRandomizer,
      subtitle: t.toolRandomizerDesc,
      cta: language === 'th' ? 'สุ่มทีมสมดุล' : 'SHUFFLE TEAMS',
      cardBg: 'bg-[#024d27]',
      titleColor: 'text-[#ffffff]',
      subColor: 'text-[#c9eed8]',
      ctaColor: 'text-[#7cd7a0]',
      image: randomizer3dImg,
      imageAlt: language === 'th' ? 'ลูกเต๋าสุ่มแบ่งทีม 3 มิติ' : '3D Team Randomizer Dice',
      imageBoxClass: 'right-0 bottom-0 w-[164px] h-[146px]',
      imgClass: 'w-full h-full object-cover object-center scale-[1.14] translate-x-2 translate-y-2',
      fadeLeft: 'from-[#024d27] via-[#024d27]/35',
      fadeTop: 'from-[#024d27]',
    },
    {
      id: 'tactic' as const,
      title: t.toolTactic,
      subtitle: t.toolTacticDesc,
      cta: language === 'th' ? 'วางแผนการเล่น' : 'OPEN BOARD',
      cardBg: 'bg-[#1a291f]',
      titleColor: 'text-[#ffffff]',
      subColor: 'text-[#b7c8bd]',
      ctaColor: 'text-[#ffffff]',
      image: tactic3dImg,
      imageAlt: language === 'th' ? 'หมากวางแผนและลูกแบด 3 มิติ' : '3D Badminton Strategy Piece',
      imageBoxClass: 'right-0 bottom-0 w-[192px] h-[156px]',
      imgClass: 'w-full h-full object-cover object-right-bottom translate-y-1.5',
      fadeLeft: 'from-[#1a291f] via-[#1a291f]/40',
      fadeTop: 'from-[#1a291f]',
    },
    {
      id: 'calc' as const,
      title: t.toolCalc,
      subtitle: t.toolCalcDesc,
      cta: language === 'th' ? 'คำนวณค่าคอร์ท' : 'SPLIT COSTS',
      cardBg: 'bg-[#78d59e]',
      titleColor: 'text-[#0c2415]',
      subColor: 'text-[#153c24]',
      ctaColor: 'text-[#0c2415]',
      image: calculator3dImg,
      imageAlt: language === 'th' ? 'สมุดจดและเครื่องคิดเลข 3 มิติ' : '3D Court Cost Calculator',
      imageBoxClass: 'right-0 bottom-0 w-[160px] h-[142px]',
      imgClass: 'w-full h-full object-cover object-center scale-[1.12] translate-x-2.5 translate-y-2.5',
      fadeLeft: 'from-[#78d59e] via-[#78d59e]/30',
      fadeTop: 'from-[#78d59e]',
    },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f8faf6] text-[#142608] overflow-y-auto overscroll-contain no-scrollbar pb-24">
      <header className="sticky top-0 z-30 app-header-safe px-5 pb-3 flex items-center justify-between gap-3 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#d4dfd0]/60 shrink-0 select-none text-[#142608]">
        <button
          type="button"
          onClick={() => {
            playSelectSound();
            if (activeTool !== 'menu') {
              setActiveTool('menu');
            } else {
              goBack();
            }
          }}
          className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#2d4d14] shadow-2xs flex items-center justify-center text-[#142608] hover:bg-[#f8faf6] active:scale-95 transition-all cursor-pointer shrink-0"
          aria-label={language === 'th' ? 'ย้อนกลับ' : 'Back'}
          title={language === 'th' ? 'ย้อนกลับ' : 'Back'}
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
        </button>

        <div className="min-w-0 flex-1 text-center px-1">
          <h1 className="text-[15px] font-semibold text-[#142608] tracking-tight leading-tight truncate">
            {t.clubToolsHeader}
          </h1>
        </div>

        {activeTool === 'menu' ? (
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              navigateTo('E2');
            }}
            aria-label={language === 'th' ? 'นัดก๊วน' : 'RSVP'}
            title={language === 'th' ? 'นัดก๊วน' : 'RSVP'}
            className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#2d4d14] shadow-2xs flex items-center justify-center text-[#142608] hover:bg-[#f8faf6] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Calendar className="w-4 h-4 stroke-[1.9]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setActiveTool('menu');
            }}
            aria-label={language === 'th' ? 'เมนูรวม' : 'All Tools'}
            title={language === 'th' ? 'เมนูรวม' : 'All Tools'}
            className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#2d4d14] shadow-2xs flex items-center justify-center text-[#142608] hover:bg-[#f8faf6] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <LayoutGrid className="w-4 h-4 stroke-[1.9]" />
          </button>
        )}
      </header>

      <div className="px-4 pt-4 pb-6 space-y-5 max-w-3xl w-full mx-auto">
        {/* Menu View: Wide Editorial CI Feature Cards with Bottom-Right 3D Sculptural Objects */}
        {activeTool === 'menu' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {toolCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setActiveTool(card.id);
                  }}
                  className={`no-doodle group relative w-full min-h-[146px] rounded-[22px] ${card.cardBg} p-5 text-left overflow-hidden flex flex-col justify-between shadow-[0_6px_20px_rgba(20,38,8,0.08)] hover:shadow-[0_10px_28px_rgba(20,38,8,0.13)] active:scale-[0.985] transition-all cursor-pointer`}
                >
                  {/* Top-Left Title & Concise Subtitle */}
                  <div className="relative z-10 max-w-[64%] space-y-1">
                    <h3 className={`text-[19px] font-bold tracking-tight leading-snug ${card.titleColor}`}>
                      {card.title}
                    </h3>
                    <p className={`text-[12px] font-medium leading-snug line-clamp-2 ${card.subColor}`}>
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Bottom-Left Action Link with Directional Arrow */}
                  <div
                    className={`relative z-10 inline-flex items-center gap-1.5 text-[12px] font-bold tracking-wide mt-5 ${card.ctaColor}`}
                  >
                    <span className="whitespace-nowrap">{card.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.4] transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                  </div>

                  {/* Bottom-Right Tactile 3D Object Seamless Layer */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute ${card.imageBoxClass} overflow-hidden`}
                  >
                    <img
                      src={card.image}
                      alt={card.imageAlt}
                      referrerPolicy="no-referrer"
                      className={`${card.imgClass} transition-transform duration-300 group-hover:scale-[1.16]`}
                    />
                    <div className={`absolute inset-y-0 left-0 w-10 bg-gradient-to-r ${card.fadeLeft} to-transparent`} />
                    <div className={`absolute inset-x-0 top-0 h-7 bg-gradient-to-b ${card.fadeTop} to-transparent`} />
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Club Hub: Two 5-Item Topic Lists with View All CTAs */}
            <div className="space-y-3.5">
              <SectionHeader
                title={t.quickClubTitle}
                badge={isThai ? 'ก๊วนกรุงเทพฯ' : 'Bangkok Hub'}
                badgeVariant="soft"
              />

              <div className="flex flex-col gap-4">
                {/* TOPIC 1: Friday Squad & Open Sessions (5 Items + View All) */}
                <section className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] overflow-hidden shadow-2xs flex flex-col">
                  <div className="px-4 py-3.5 border-b border-[#e6eee2] flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-bold text-[#004d2c] truncate leading-tight">
                        {t.fridaySquad}
                      </h3>
                      <p className="text-[11px] text-[#5c6f5e] font-medium mt-0.5 truncate">
                        {isThai ? 'รอบก๊วนเปิดรับด่วน · 5 รายการ' : 'Open squad sessions · 5 items'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playSelectSound();
                        navigateTo('E1');
                      }}
                      className="no-doodle min-h-[34px] px-3 py-1 rounded-full bg-[#f8faf6] border border-[#d4dfd0] hover:border-[#004d2c] text-[11px] font-semibold text-[#004d2c] inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>{isThai ? 'ดูทั้งหมด' : 'View all'}</span>
                      <ArrowRight className="w-3 h-3 shrink-0" />
                    </button>
                  </div>

                  <div className="divide-y divide-[#e6eee2]">
                    {guildEvents.slice(0, 5).map((evt) => {
                      const dayShort = evt.date.includes('อาทิตย์')
                        ? isThai
                          ? 'อา.'
                          : 'SUN'
                        : evt.date.includes('เสาร์')
                          ? isThai
                            ? 'ส.'
                            : 'SAT'
                          : isThai
                            ? 'ศ.'
                            : 'FRI';
                      const spotsLeft = Math.max(0, evt.maxPlayers - evt.attendees.length);
                      const fee = Math.ceil(
                        (evt.courtFeeTotal + evt.shuttlecockFeeTotal) /
                          Math.max(1, evt.attendees.length)
                      );
                      return (
                        <button
                          key={evt.id}
                          type="button"
                          onClick={() => {
                            playSelectSound();
                            selectGuildEvent(evt.id);
                            navigateTo('E2');
                          }}
                          className="no-doodle w-full px-4 py-3 min-h-[58px] flex items-center justify-between gap-3 text-left hover:bg-[#f8faf6] active:bg-[#eff5ec] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="w-9 h-9 rounded-full bg-[#e8f7ee] border border-[#7cd7a0]/60 text-[#004d2c] text-[11px] font-bold flex items-center justify-center shrink-0">
                              {dayShort}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-[13px] font-semibold text-[#142608] truncate">
                                {evt.title}
                              </div>
                              <div className="text-[11px] text-[#5c6f5e] truncate mt-0.5 tabular-nums">
                                {evt.timeRange} · {evt.courtName}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-right tabular-nums">
                              <div
                                className={`text-[11px] font-bold whitespace-nowrap ${
                                  spotsLeft <= 2 ? 'text-[#e85729]' : 'text-[#004d2c]'
                                }`}
                              >
                                {spotsLeft === 0
                                  ? isThai
                                    ? 'เต็มแล้ว'
                                    : 'Full'
                                  : isThai
                                    ? `ว่าง ${spotsLeft} ที่`
                                    : `${spotsLeft} left`}
                              </div>
                              <div className="text-[10px] font-medium text-[#5c6f5e] whitespace-nowrap">
                                ~฿{fee}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#879b89] shrink-0" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* TOPIC 2: Squad Leaderboard Top 5 (5 Items + View All) */}
                <section className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] overflow-hidden shadow-2xs flex flex-col">
                  <div className="px-4 py-3.5 border-b border-[#e6eee2] flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-bold text-[#004d2c] truncate leading-tight">
                        {t.seasonLeaderboard}
                      </h3>
                      <p className="text-[11px] text-[#5c6f5e] font-medium mt-0.5 truncate">
                        {isThai ? 'ท็อป 5 ประจำสัปดาห์ · ซีซัน 4' : 'Weekly Top 5 · Season 4'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playSelectSound();
                        navigateTo('E4');
                      }}
                      className="no-doodle min-h-[34px] px-3 py-1 rounded-full bg-[#f8faf6] border border-[#d4dfd0] hover:border-[#004d2c] text-[11px] font-semibold text-[#004d2c] inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>{isThai ? 'ดูทั้งหมด' : 'View all'}</span>
                      <ArrowRight className="w-3 h-3 shrink-0" />
                    </button>
                  </div>

                  <div className="divide-y divide-[#e6eee2]">
                    {[...leaderboard]
                      .sort((a, b) => a.rank - b.rank)
                      .slice(0, 5)
                      .map((item) => {
                        const isUser = item.name.includes('กานต์') || item.id === 'usr_karn_007';
                        const tierTh =
                          item.tier === 'Diamond'
                            ? 'ไดมอนด์'
                            : item.tier === 'Gold'
                              ? 'โกลด์'
                              : item.tier === 'Silver'
                                ? 'ซิลเวอร์'
                                : 'บรอนซ์';
                        const rankColor =
                          item.rank === 1
                            ? 'text-[#004d2c]'
                            : item.rank === 2
                              ? 'text-[#15803d]'
                              : item.rank === 3
                                ? 'text-[#e85729]'
                                : 'text-[#5c6f5e]';

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              playSelectSound();
                              setSparringModalPlayer({
                                name: item.name,
                                ovr: item.ovr,
                                tier: isThai ? `ระดับ${tierTh}` : `${item.tier} League`,
                                role: item.guildTitle || (isThai ? 'มือวางอันดับต้น' : 'Top Ranked Smasher'),
                                status: isThai ? 'พร้อมดวลคะแนนซีซัน 4' : 'Ready for Season 4 Match',
                                winRate: item.winRate,
                              });
                            }}
                            className={`no-doodle w-full px-4 py-3 min-h-[58px] flex items-center justify-between gap-2.5 text-left transition-colors cursor-pointer ${
                              isUser ? 'bg-[#e8f7ee]/70 hover:bg-[#ddf3e5]' : 'hover:bg-[#f8faf6]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <span className={`w-4 text-center text-[12px] font-bold tabular-nums shrink-0 ${rankColor}`}>
                                {item.rank}
                              </span>
                              <div className="shrink-0">
                                <DoodleAvatar
                                  preset={resolveDoodlePreset(item.name)}
                                  seed={item.name}
                                  size="sm"
                                  className="w-9 h-9"
                                  ringClass={isUser ? 'border-[1.5px] border-[#004d2c]' : 'border border-[#d4dfd0]'}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1 min-w-0">
                                  <span className="text-[13px] font-semibold text-[#142608] truncate">
                                    {item.name}
                                  </span>
                                  {isUser && (
                                    <span className="text-[10px] font-bold text-[#004d2c] whitespace-nowrap shrink-0">
                                      · {isThai ? 'คุณ' : 'You'}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#5c6f5e] truncate mt-0.5 tabular-nums">
                                  {isThai
                                    ? `${tierTh} · ชนะ ${item.winRate}%`
                                    : `${item.tier} · ${item.winRate}% win`}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <div className="text-right tabular-nums">
                                <div
                                  className={`text-[13px] font-bold whitespace-nowrap ${
                                    item.rank <= 3 || isUser ? 'text-[#004d2c]' : 'text-[#142608]'
                                  }`}
                                >
                                  {item.exp >= 1000 ? `${(item.exp / 1000).toFixed(1)}k` : item.exp.toLocaleString()}
                                </div>
                                <div className="text-[10px] font-medium text-[#5c6f5e] whitespace-nowrap">
                                  {isThai ? `${item.smashPoints} แต้ม` : `${item.smashPoints} pts`}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[#879b89] shrink-0" />
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}

        {/* 1. Scoreboard v2 Interactive View */}
        {activeTool === 'scoreboard' && (
          <div className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e6eee2]">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔢</span>
                <h2 className="font-bold text-base text-[#004d2c]">
                  {t.toolScoreboard}
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e8f7ee] text-[#004d2c] text-[11px] font-bold whitespace-nowrap">
                {matchWinner
                  ? isThai
                    ? `จบแมตช์ · ทีม ${matchWinner} ชนะ!`
                    : `Match Over · Team ${matchWinner} Wins!`
                  : `${t.scorerSet} ${setNumber} (${t.scorerBestOf})`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              {/* Team A */}
              <div
                className={`p-4 rounded-[20px] border transition-all ${
                  server === 'A'
                    ? 'bg-[#e8f7ee] border-[#7cd7a0]'
                    : 'bg-[#f8faf6] border-[#d4dfd0]'
                }`}
              >
                <div className="text-xs font-bold text-[#004d2c] flex items-center justify-center gap-1.5">
                  <span className="uppercase tracking-wide">{t.teamA}</span>
                  {server === 'A' && !matchWinner && (
                    <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse" />
                  )}
                </div>
                <div className="text-5xl font-bold text-[#142608] my-2 tabular-nums">
                  {scoreA}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScoreA(Math.max(0, scoreA - 1))}
                    className="no-doodle w-8 h-8 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#2d4d14] font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(matchWinner)}
                    onClick={() => handleMiniScorePoint('A')}
                    className="no-doodle flex-1 py-2 rounded-full bg-[#004d2c] text-[#ffffff] font-semibold text-xs hover:bg-[#003a21] disabled:opacity-40 active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    {t.pointBtn}
                  </button>
                </div>
                <div className="text-[11px] text-[#5c6f5e] font-semibold mt-2 tabular-nums">
                  {t.setsWon}: {setsWonA}
                </div>
              </div>

              {/* Team B */}
              <div
                className={`p-4 rounded-[20px] border transition-all ${
                  server === 'B'
                    ? 'bg-[#e8f7ee] border-[#7cd7a0]'
                    : 'bg-[#f8faf6] border-[#d4dfd0]'
                }`}
              >
                <div className="text-xs font-bold text-[#004d2c] flex items-center justify-center gap-1.5">
                  <span className="uppercase tracking-wide">{t.teamB}</span>
                  {server === 'B' && !matchWinner && (
                    <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse" />
                  )}
                </div>
                <div className="text-5xl font-bold text-[#142608] my-2 tabular-nums">
                  {scoreB}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScoreB(Math.max(0, scoreB - 1))}
                    className="no-doodle w-8 h-8 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#2d4d14] font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(matchWinner)}
                    onClick={() => handleMiniScorePoint('B')}
                    className="no-doodle flex-1 py-2 rounded-full bg-[#004d2c] text-[#ffffff] font-semibold text-xs hover:bg-[#003a21] disabled:opacity-40 active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    {t.pointBtn}
                  </button>
                </div>
                <div className="text-[11px] text-[#5c6f5e] font-semibold mt-2 tabular-nums">
                  {t.setsWon}: {setsWonB}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={resetMiniMatch}
                className="no-doodle px-3.5 py-2 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#2d4d14] text-xs font-semibold text-[#142608] flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isThai ? 'เริ่มแมตช์ใหม่' : 'Reset Match'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('C1')}
                className="no-doodle px-4 py-2 rounded-full bg-[#004d2c] text-[#ffffff] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#003a21] cursor-pointer whitespace-nowrap"
              >
                <span>{t.openFullScorer}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 2. Team Randomizer v2 Interactive View */}
        {activeTool === 'randomizer' && (
          <div className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e6eee2]">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎲</span>
                <h2 className="font-bold text-base text-[#004d2c]">
                  {t.randomizerHeader}
                </h2>
              </div>
              <button
                type="button"
                onClick={shuffleBalancedTeams}
                className="no-doodle px-3.5 py-1.5 rounded-full bg-[#004d2c] text-[#ffffff] text-xs font-semibold flex items-center gap-1 hover:bg-[#003a21] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{t.shuffleBtn}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Team A */}
              <div className="p-3.5 rounded-[20px] bg-[#e8f7ee] border border-[#7cd7a0]/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#004d2c]">
                  <span>{isThai ? `ทีม A (เฉลี่ย ${teamAOvr})` : `TEAM A (OVR ${teamAOvr})`}</span>
                  <span className="text-[10px]">{t.court1}</span>
                </div>
                <div className="space-y-1.5 text-xs font-semibold text-[#142608]">
                  {teamAPlayers.map((p) => (
                    <div key={p.name} className="p-2 rounded-[12px] bg-[#ffffff] flex justify-between items-center">
                      <span className="truncate">{p.name}</span>
                      <span className="font-bold text-[#004d2c] ml-1 tabular-nums">{p.ovr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team B */}
              <div className="p-3.5 rounded-[20px] bg-[#e8f7ee] border border-[#7cd7a0]/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#004d2c]">
                  <span>{isThai ? `ทีม B (เฉลี่ย ${teamBOvr})` : `TEAM B (OVR ${teamBOvr})`}</span>
                  <span className="text-[10px]">{t.court1}</span>
                </div>
                <div className="space-y-1.5 text-xs font-semibold text-[#142608]">
                  {teamBPlayers.map((p) => (
                    <div key={p.name} className="p-2 rounded-[12px] bg-[#ffffff] flex justify-between items-center">
                      <span className="truncate">{p.name}</span>
                      <span className="font-bold text-[#004d2c] ml-1 tabular-nums">{p.ovr}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-[16px] bg-[#f8faf6] border border-[#d4dfd0] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#5c6f5e]">{t.balanceRate}:</span>
              <span className="font-bold text-[#004d2c] tabular-nums">
                ✓ {balanceScore}% ({t.balanceDesc})
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                startNewMatch({
                  playerAName: `${teamAPlayers[0].name.split(' ')[0]} & ${teamAPlayers[1].name.split(' ')[0]}`,
                  playerBName: `${teamBPlayers[0].name.split(' ')[0]} & ${teamBPlayers[1].name.split(' ')[0]}`,
                  isDoubles: true,
                })
              }
              className="no-doodle w-full py-3 rounded-full bg-[#004d2c] hover:bg-[#003a21] text-[#ffffff] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <span>{isThai ? 'เริ่มนับคะแนนแมตช์คู่นี้เลย' : 'Start Live Match with These Teams'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

 {/* 3. Tactic Board Interactive View */}
 {activeTool === 'tactic' && (
 <div className="bg-[#ffffff] rounded-[28px] p-5 shadow-sm space-y-4">
 <div className="flex items-center justify-between pb-3">
 <div className="flex items-center gap-2">
 <span className="text-lg">📋</span>
 <h2 className="font-['Antonio',sans-serif] font-black text-base uppercase text-[#000000]">
 {t.tacticHeader}
 </h2>
 </div>
 <div data-filter="true" className="bg-[#ececef] p-1 rounded-full flex items-center gap-1">
 <button
 type="button"
 onClick={() => setFormation('attack')}
 className={`no-doodle min-h-[30px] px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
 formation === 'attack'
 ? 'bg-[#ffffff] text-[#111111] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
 : 'text-[#6b7280] hover:text-[#111111]'
 }`}
 >
 {t.formationAttack}
 </button>
 <button
 type="button"
 onClick={() => setFormation('defense')}
 className={`no-doodle min-h-[30px] px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
 formation === 'defense'
 ? 'bg-[#ffffff] text-[#111111] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
 : 'text-[#6b7280] hover:text-[#111111]'
 }`}
 >
 {t.formationDefense}
 </button>
 </div>
 </div>

 {/* Tactical Badminton Court Graphic */}
 <div className="relative w-full h-64 rounded-[28px] bg-[#7cd7a0] p-3 flex flex-col justify-between overflow-hidden shadow-inner ">
 <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#000000] opacity-80" />
 <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-[#000000] opacity-50" />
 <div className="absolute bottom-1/4 left-0 right-0 h-0.5 bg-[#000000] opacity-50" />
 <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#000000] opacity-50" />

 {/* Team B */}
 <div className="relative z-10 flex justify-around">
 <div className="w-8 h-8 rounded-[1600px] bg-[#e85729] text-[#ffffff] flex items-center justify-center font-black text-xs shadow-md">
 B1
 </div>
 <div className="w-8 h-8 rounded-[1600px] bg-[#e85729] text-[#ffffff] flex items-center justify-center font-black text-xs shadow-md">
 B2
 </div>
 </div>

 {/* Shuttlecock */}
 <div className="self-center z-10 text-xl animate-bounce">
 🏸
 </div>

 {/* Team A */}
 <div className={`relative z-10 flex ${formation === 'attack' ? 'flex-col items-center gap-4' : 'justify-around'}`}>
 <div className="w-8 h-8 rounded-[1600px] bg-[#7cd7a0] text-[#000000] flex items-center justify-center font-black text-xs shadow-md">
 A1
 </div>
 <div className="w-8 h-8 rounded-[1600px] bg-[#7cd7a0] text-[#000000] flex items-center justify-center font-black text-xs shadow-md">
 A2
 </div>
 </div>
 </div>

 <p className="text-[11px] text-[#000000]/70 text-center font-bold">
 {formation === 'attack' ? t.tacticAttackDesc : t.tacticDefenseDesc}
 </p>
 </div>
 )}

 {/* 4. Group Cost Calc Interactive View */}
 {activeTool === 'calc' && (
 <div className="bg-[#ffffff] rounded-[28px] p-5 shadow-sm space-y-4">
 <div className="flex items-center justify-between pb-3">
 <div className="flex items-center gap-2">
 <span className="text-lg">🧮</span>
 <h2 className="font-['Antonio',sans-serif] font-black text-base uppercase text-[#000000]">
 {t.calcHeader}
 </h2>
 </div>
 <span className="text-xs font-bold text-[#000000] px-2.5 py-0.5 rounded-[1600px] bg-[#7cd7a0] ">
 {t.equalSplit}
 </span>
 </div>

 {/* Inputs */}
 <div className="space-y-3 text-xs">
 <div className="flex items-center justify-between">
 <span className="font-bold text-[#000000]">{t.courtHoursLabel} (280฿/{t.hrUnit}):</span>
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => setCourtHours(Math.max(1, courtHours - 1))}
 className="w-7 h-7 rounded-[1600px] bg-[#ffffff] border border-[#000000] font-bold cursor-pointer"
 >
 -
 </button>
 <span className="font-black text-sm w-12 text-center">{courtHours} {t.hrUnit}</span>
 <button
 type="button"
 onClick={() => setCourtHours(courtHours + 1)}
 className="w-7 h-7 rounded-[1600px] bg-[#ffffff] border border-[#000000] font-bold cursor-pointer"
 >
 +
 </button>
 </div>
 </div>

 <div className="flex items-center justify-between">
 <span className="font-bold text-[#000000]">{t.shuttleTubesLabel} (480฿/{t.tubeUnit}):</span>
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => setShuttleTubes(Math.max(0, shuttleTubes - 1))}
 className="w-7 h-7 rounded-[1600px] bg-[#ffffff] border border-[#000000] font-bold cursor-pointer"
 >
 -
 </button>
 <span className="font-black text-sm w-12 text-center">{shuttleTubes} {t.tubeUnit}</span>
 <button
 type="button"
 onClick={() => setShuttleTubes(shuttleTubes + 1)}
 className="w-7 h-7 rounded-[1600px] bg-[#ffffff] border border-[#000000] font-bold cursor-pointer"
 >
 +
 </button>
 </div>
 </div>

 <div className="flex items-center justify-between">
 <span className="font-bold text-[#000000]">{t.playersLabel}:</span>
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => setPlayerCount(Math.max(1, playerCount - 1))}
 className="w-7 h-7 rounded-[1600px] bg-[#ffffff] border border-[#000000] font-bold cursor-pointer"
 >
 -
 </button>
 <span className="font-black text-sm w-12 text-center">{playerCount} {t.personUnit}</span>
 <button
 type="button"
 onClick={() => setPlayerCount(playerCount + 1)}
 className="w-7 h-7 rounded-[1600px] bg-[#ffffff] border border-[#000000] font-bold cursor-pointer"
 >
 +
 </button>
 </div>
 </div>
 </div>

 {/* Split Result Card in Slush CI */}
 <div className="p-4 rounded-[24px] bg-[#7cd7a0] text-center space-y-1">
 <span className="text-[11px] font-bold text-[#000000] uppercase tracking-wide">
 {t.totalExpenseLabel}: ฿{totalExpense}
 </span>
 <div className="font-['Antonio',sans-serif] text-4xl font-black text-[#000000]">
 ~฿{costPerPerson} <span className="text-sm font-normal text-[#000000]/70">/{t.personUnit}</span>
 </div>
 <p className="text-[10px] text-[#000000]/70 font-bold">
 {t.calcFormulaDesc}
 </p>
 </div>

        <button
          type="button"
          onClick={() => {
            updateEventBudget(currentEvent.id, courtFeeTotalCalc, shuttleFeeTotalCalc);
            navigateTo('E2');
          }}
          className="no-doodle w-full py-3.5 rounded-full bg-[#004d2c] hover:bg-[#003a21] text-[#ffffff] font-bold text-xs uppercase tracking-wide transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Share2 className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">
            {isThai
              ? `อัปเดตยอด ฿${totalExpense.toLocaleString()} ลงนัดก๊วน`
              : `Apply ฿${totalExpense.toLocaleString()} to Squad Event`}
          </span>
        </button>
      </div>
    )}
 </div>
 </div>
 );
};
