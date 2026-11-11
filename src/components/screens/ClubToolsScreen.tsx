import React, { useState } from 'react';
import {
 RotateCcw,
 ArrowRight,
 Shuffle,
 Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClubToolsScreen: React.FC = () => {
 const { navigateTo, gainExp, t, language } = useApp();
 const [activeTool, setActiveTool] = useState<'menu' | 'scoreboard' | 'randomizer' | 'tactic' | 'calc'>('menu');

 // 1. Scoreboard v2 State
 const [scoreA, setScoreA] = useState(19);
 const [scoreB, setScoreB] = useState(18);
 const [server, setServer] = useState<'A' | 'B'>('A');
 const [setNumber] = useState(2);
 const [setsWonA] = useState(1);
 const [setsWonB] = useState(0);

 // 2. Team Randomizer v2 State
 const [shuffleCount, setShuffleCount] = useState(1);
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

 // 3. Tactic Board State
 const [formation, setFormation] = useState<'attack' | 'defense'>('attack');

 // 4. Group Cost Calc State
 const [courtHours, setCourtHours] = useState(3);
 const [courtRate] = useState(280);
 const [shuttleTubes, setShuttleTubes] = useState(2);
 const [shuttlePrice] = useState(480);
 const [playerCount, setPlayerCount] = useState(8);

 const totalExpense = courtHours * courtRate + shuttleTubes * shuttlePrice;
 const costPerPerson = playerCount > 0 ? Math.ceil(totalExpense / playerCount) : 0;

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000]  overflow-y-auto overscroll-contain no-scrollbar pb-24">
 {/* Header in Slush CI */}
 <div className="bg-[#ffffff] px-4 pt-4 pb-3 flex items-center justify-between sticky top-0 z-20 shadow-xs">
 <div>
 <div className="flex items-center gap-2">
 <h1 className="text-xl font-black text-[#000000] font-['Antonio',sans-serif] uppercase tracking-wide">
 {t.clubToolsHeader}
 </h1>
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#fb4903] text-[#ffffff] text-[9px] font-black uppercase">
 {t.newBadge} V2
 </span>
 </div>
 <p className="text-[11px] text-[#000000]/60 font-bold">
 {t.clubToolsHeaderSub}
 </p>
 </div>

 {activeTool !== 'menu' && (
 <button
 type="button"
 onClick={() => setActiveTool('menu')}
 className="px-3 py-1.5 rounded-[1600px] bg-[#ffffff] text-xs font-bold text-[#000000] border border-[#000000] hover:bg-[#e9e9e9] transition-colors cursor-pointer whitespace-nowrap"
 >
 {t.backToMenu}
 </button>
 )}
 </div>

 <div className="p-4 space-y-4">
 {/* Menu View: 4 Symmetrical 1:1 Aspect Cards with 1px Solid Black Border */}
 {activeTool === 'menu' && (
 <>
 <div className="grid grid-cols-2 gap-3">
 {/* Tool 1: Scoreboard v2 */}
 <div
 onClick={() => setActiveTool('scoreboard')}
 className="bg-[#ffffff] rounded-[28px] p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between aspect-square active:scale-98 relative group"
 >
 <span className="absolute top-3 right-3 px-2 py-0.5 rounded-[1600px] bg-[#fb4903] text-[#ffffff] text-[9px] font-black">
 {t.hotBadge}
 </span>
 <div className="w-12 h-12 rounded-[20px] bg-[#ffd731] flex items-center justify-center text-2xl shadow-xs">
 🔢
 </div>
 <div>
 <h3 className="font-['Antonio',sans-serif] font-black text-base uppercase text-[#000000] leading-snug">
 {t.toolScoreboard}
 </h3>
 <p className="text-[10px] text-[#000000]/60 font-bold mt-0.5 leading-tight">
 {t.toolScoreboardDesc}
 </p>
 </div>
 </div>

 {/* Tool 2: Team Randomizer v2 */}
 <div
 onClick={() => setActiveTool('randomizer')}
 className="bg-[#ffffff] rounded-[28px] p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between aspect-square active:scale-98 relative group"
 >
 <span className="absolute top-3 right-3 px-2 py-0.5 rounded-[1600px] bg-[#fb4903] text-[#ffffff] text-[9px] font-black">
 {t.hotBadge}
 </span>
 <div className="w-12 h-12 rounded-[20px] bg-[#55db9c] flex items-center justify-center text-2xl shadow-xs">
 🎲
 </div>
 <div>
 <h3 className="font-['Antonio',sans-serif] font-black text-base uppercase text-[#000000] leading-snug">
 {t.toolRandomizer}
 </h3>
 <p className="text-[10px] text-[#000000]/60 font-bold mt-0.5 leading-tight">
 {t.toolRandomizerDesc}
 </p>
 </div>
 </div>

 {/* Tool 3: Tactic Board */}
 <div
 onClick={() => setActiveTool('tactic')}
 className="bg-[#ffffff] rounded-[28px] p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between aspect-square active:scale-98 relative group"
 >
 <span className="absolute top-3 right-3 px-2 py-0.5 rounded-[1600px] bg-[#55db9c] text-[#000000] text-[9px] font-black">
 {t.newBadge}
 </span>
 <div className="w-12 h-12 rounded-[20px] bg-[#4da2ff] flex items-center justify-center text-2xl shadow-xs">
 📋
 </div>
 <div>
 <h3 className="font-['Antonio',sans-serif] font-black text-base uppercase text-[#000000] leading-snug">
 {t.toolTactic}
 </h3>
 <p className="text-[10px] text-[#000000]/60 font-bold mt-0.5 leading-tight">
 {t.toolTacticDesc}
 </p>
 </div>
 </div>

 {/* Tool 4: Group Cost Calc */}
 <div
 onClick={() => setActiveTool('calc')}
 className="bg-[#ffffff] rounded-[28px] p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between aspect-square active:scale-98 relative group"
 >
 <span className="absolute top-3 right-3 px-2 py-0.5 rounded-[1600px] bg-[#fb4903] text-[#ffffff] text-[9px] font-black">
 {t.hotBadge}
 </span>
 <div className="w-12 h-12 rounded-[20px] bg-[#e9ccff] flex items-center justify-center text-2xl shadow-xs">
 🧮
 </div>
 <div>
 <h3 className="font-['Antonio',sans-serif] font-black text-base uppercase text-[#000000] leading-snug">
 {t.toolCalc}
 </h3>
 <p className="text-[10px] text-[#000000]/60 font-bold mt-0.5 leading-tight">
 {t.toolCalcDesc}
 </p>
 </div>
 </div>
 </div>

 {/* Quick Sparring & RSVP Shortcuts */}
 <div className="bg-[#ffffff] rounded-[28px] p-4 space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black uppercase tracking-wider text-[#000000] font-['Antonio',sans-serif]">
 {t.quickClubTitle}
 </span>
 <span className="text-[10px] text-[#000000]/60 font-bold">Bangkok Hub</span>
 </div>

 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => navigateTo('E2')}
 className="p-3 rounded-[20px] bg-[#dceeff]/40 border border-[#000000] text-left hover:bg-[#dceeff] transition-colors cursor-pointer"
 >
 <span className="text-lg">🏸</span>
 <div className="font-bold text-xs text-[#000000] mt-1">{t.fridaySquad}</div>
 <div className="text-[10px] text-[#000000]/60 font-bold">{t.fridaySquadSub}</div>
 </button>

 <button
 type="button"
 onClick={() => navigateTo('E4')}
 className="p-3 rounded-[20px] bg-[#ffd731]/30 border border-[#000000] text-left hover:bg-[#ffd731]/50 transition-colors cursor-pointer"
 >
 <span className="text-lg">🏅</span>
 <div className="font-bold text-xs text-[#000000] mt-1">{t.seasonLeaderboard}</div>
 <div className="text-[10px] text-[#000000]/60 font-bold">{t.seasonLeaderboardSub}</div>
 </button>
 </div>
 </div>
 </>
 )}

 {/* 1. Scoreboard v2 Interactive View */}
 {activeTool === 'scoreboard' && (
 <div className="bg-[#ffffff] rounded-[28px] p-5 shadow-sm space-y-4">
 <div className="flex items-center justify-between pb-3">
 <div className="flex items-center gap-2">
 <span className="text-lg">🔢</span>
 <h2 className="font-['Antonio',sans-serif] font-black text-base uppercase text-[#000000]">
 {t.toolScoreboard}
 </h2>
 </div>
 <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#ffd731] text-[#000000] text-[10px] font-black whitespace-nowrap">
 {t.scorerSet} {setNumber} ({t.scorerBestOf})
 </span>
 </div>

 <div className="grid grid-cols-2 gap-3 text-center">
 {/* Team A */}
 <div className={`p-4 rounded-[24px] transition-all ${server === 'A' ? 'bg-[#55db9c]' : 'bg-[#dceeff]/30'}`}>
 <div className="text-xs font-bold text-[#000000] flex items-center justify-center gap-1.5">
 <span className="font-black font-['Antonio',sans-serif] uppercase tracking-wide">{t.teamA}</span>
 {server === 'A' && <span className="w-2 h-2 rounded-[1600px] bg-[#000000] animate-pulse" />}
 </div>
 <div className="text-5xl font-black text-[#000000] my-2 font-['Antonio',sans-serif]">
 {scoreA}
 </div>
 <div className="flex items-center justify-center gap-2">
 <button
 type="button"
 onClick={() => setScoreA(Math.max(0, scoreA - 1))}
 className="w-8 h-8 rounded-[1600px] bg-[#ffffff] border border-[#000000] font-black text-xs hover:bg-[#e9e9e9] cursor-pointer"
 >
 -
 </button>
 <button
 type="button"
 onClick={() => {
 setScoreA(scoreA + 1);
 setServer('A');
 }}
 className="flex-1 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] font-bold text-xs hover:bg-[#1a1a1a] shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
 >
 {t.pointBtn}
 </button>
 </div>
 <div className="text-[10px] text-[#000000]/70 font-bold mt-2">
 {t.setsWon}: {setsWonA}
 </div>
 </div>

 {/* Team B */}
 <div className={`p-4 rounded-[24px] transition-all ${server === 'B' ? 'bg-[#55db9c]' : 'bg-[#dceeff]/30'}`}>
 <div className="text-xs font-bold text-[#000000] flex items-center justify-center gap-1.5">
 <span className="font-black font-['Antonio',sans-serif] uppercase tracking-wide">{t.teamB}</span>
 {server === 'B' && <span className="w-2 h-2 rounded-[1600px] bg-[#000000] animate-pulse" />}
 </div>
 <div className="text-5xl font-black text-[#000000] my-2 font-['Antonio',sans-serif]">
 {scoreB}
 </div>
 <div className="flex items-center justify-center gap-2">
 <button
 type="button"
 onClick={() => setScoreB(Math.max(0, scoreB - 1))}
 className="w-8 h-8 rounded-[1600px] bg-[#ffffff] border border-[#000000] font-black text-xs hover:bg-[#e9e9e9] cursor-pointer"
 >
 -
 </button>
 <button
 type="button"
 onClick={() => {
 setScoreB(scoreB + 1);
 setServer('B');
 }}
 className="flex-1 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] font-bold text-xs hover:bg-[#1a1a1a] shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
 >
 {t.pointBtn}
 </button>
 </div>
 <div className="text-[10px] text-[#000000]/70 font-bold mt-2">
 {t.setsWon}: {setsWonB}
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between pt-2">
 <button
 type="button"
 onClick={() => {
 setScoreA(0);
 setScoreB(0);
 }}
 className="px-3 py-1.5 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-xs font-bold text-[#000000] flex items-center gap-1 hover:bg-[#e9e9e9] cursor-pointer whitespace-nowrap"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 <span>{t.resetSetBtn}</span>
 </button>

 <button
 type="button"
 onClick={() => navigateTo('C1')}
 className="px-4 py-2 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] text-xs font-bold flex items-center gap-1.5 hover:bg-[#1a1a1a] cursor-pointer whitespace-nowrap"
 >
 <span>{t.openFullScorer}</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 )}

 {/* 2. Team Randomizer v2 Interactive View */}
 {activeTool === 'randomizer' && (
 <div className="bg-[#ffffff] rounded-[28px] p-5 shadow-sm space-y-4">
 <div className="flex items-center justify-between pb-3">
 <div className="flex items-center gap-2">
 <span className="text-lg">🎲</span>
 <h2 className="font-['Antonio',sans-serif] font-black text-base uppercase text-[#000000]">
 {t.randomizerHeader}
 </h2>
 </div>
 <button
 type="button"
 onClick={() => {
 setShuffleCount((c) => c + 1);
 gainExp(20, language === 'th' ? 'สุ่มจับคู่ก๊วนสมดุล' : 'Balanced match shuffled');
 }}
 className="px-3 py-1.5 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-xs font-bold flex items-center gap-1 hover:bg-[#45c98c] active:scale-95 transition-all shadow-xs cursor-pointer whitespace-nowrap"
 >
 <Shuffle className="w-3.5 h-3.5" />
 <span>{t.shuffleBtn}</span>
 </button>
 </div>

 <div className="grid grid-cols-2 gap-3">
 {/* Team 1 */}
 <div className="p-3.5 rounded-[24px] bg-[#55db9c]/30 space-y-2">
 <div className="flex items-center justify-between text-xs font-black text-[#000000] font-['Antonio',sans-serif]">
 <span>TEAM A (OVR 84)</span>
 <span className="text-[10px]">{t.court1}</span>
 </div>
 <div className="space-y-1.5 text-xs font-bold text-[#000000]">
 <div className="p-2 rounded-[16px] bg-[#ffffff] flex justify-between">
 <span className="truncate">{SQUAD_PLAYERS[shuffleCount % SQUAD_PLAYERS.length].name}</span>
 <span className="font-black ml-1">88</span>
 </div>
 <div className="p-2 rounded-[16px] bg-[#ffffff] flex justify-between">
 <span className="truncate">{SQUAD_PLAYERS[(shuffleCount + 3) % SQUAD_PLAYERS.length].name}</span>
 <span className="font-black ml-1">80</span>
 </div>
 </div>
 </div>

 {/* Team 2 */}
 <div className="p-3.5 rounded-[24px] bg-[#ffd731]/30 space-y-2">
 <div className="flex items-center justify-between text-xs font-black text-[#000000] font-['Antonio',sans-serif]">
 <span>TEAM B (OVR 83)</span>
 <span className="text-[10px]">{t.court1}</span>
 </div>
 <div className="space-y-1.5 text-xs font-bold text-[#000000]">
 <div className="p-2 rounded-[16px] bg-[#ffffff] flex justify-between">
 <span className="truncate">{SQUAD_PLAYERS[(shuffleCount + 1) % SQUAD_PLAYERS.length].name}</span>
 <span className="font-black ml-1">84</span>
 </div>
 <div className="p-2 rounded-[16px] bg-[#ffffff] flex justify-between">
 <span className="truncate">{SQUAD_PLAYERS[(shuffleCount + 2) % SQUAD_PLAYERS.length].name}</span>
 <span className="font-black ml-1">82</span>
 </div>
 </div>
 </div>
 </div>

 <div className="p-3 rounded-[20px] bg-[#dceeff] flex items-center justify-between text-xs">
 <span className="font-bold text-[#000000]/70">{t.balanceRate}:</span>
 <span className="font-black text-[#000000]">✓ 98% ({t.balanceDesc})</span>
 </div>
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
 <div className="flex items-center gap-1.5">
 <button
 type="button"
 onClick={() => setFormation('attack')}
 className={`px-2.5 py-1 rounded-[1600px] text-xs font-bold border border-[#000000] cursor-pointer whitespace-nowrap ${
 formation === 'attack' ? 'bg-[#000000] text-[#ffffff]' : 'bg-[#ffffff] text-[#000000]'
 }`}
 >
 {t.formationAttack}
 </button>
 <button
 type="button"
 onClick={() => setFormation('defense')}
 className={`px-2.5 py-1 rounded-[1600px] text-xs font-bold border border-[#000000] cursor-pointer whitespace-nowrap ${
 formation === 'defense' ? 'bg-[#000000] text-[#ffffff]' : 'bg-[#ffffff] text-[#000000]'
 }`}
 >
 {t.formationDefense}
 </button>
 </div>
 </div>

 {/* Tactical Badminton Court Graphic */}
 <div className="relative w-full h-64 rounded-[28px] bg-[#55db9c] p-3 flex flex-col justify-between overflow-hidden shadow-inner ">
 <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#000000] opacity-80" />
 <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-[#000000] opacity-50" />
 <div className="absolute bottom-1/4 left-0 right-0 h-0.5 bg-[#000000] opacity-50" />
 <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#000000] opacity-50" />

 {/* Team B */}
 <div className="relative z-10 flex justify-around">
 <div className="w-8 h-8 rounded-[1600px] bg-[#fb4903] text-[#ffffff] flex items-center justify-center font-black text-xs shadow-md">
 B1
 </div>
 <div className="w-8 h-8 rounded-[1600px] bg-[#fb4903] text-[#ffffff] flex items-center justify-center font-black text-xs shadow-md">
 B2
 </div>
 </div>

 {/* Shuttlecock */}
 <div className="self-center z-10 text-xl animate-bounce">
 🏸
 </div>

 {/* Team A */}
 <div className={`relative z-10 flex ${formation === 'attack' ? 'flex-col items-center gap-4' : 'justify-around'}`}>
 <div className="w-8 h-8 rounded-[1600px] bg-[#4da2ff] text-[#000000] flex items-center justify-center font-black text-xs shadow-md">
 A1
 </div>
 <div className="w-8 h-8 rounded-[1600px] bg-[#4da2ff] text-[#000000] flex items-center justify-center font-black text-xs shadow-md">
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
 <span className="text-xs font-bold text-[#000000] px-2.5 py-0.5 rounded-[1600px] bg-[#ffd731] ">
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
 <div className="p-4 rounded-[24px] bg-[#ffd731] text-center space-y-1">
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
 onClick={() => navigateTo('E2')}
 className="w-full py-3.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] font-bold text-xs uppercase tracking-wide hover:bg-[#1a1a1a] transition-transform active:scale-95 shadow-xs cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
 >
 <Share2 className="w-3.5 h-3.5 shrink-0" />
 <span className="whitespace-nowrap">{t.shareToRsvpBtn}</span>
 </button>
 </div>
 )}
 </div>
 </div>
 );
};
