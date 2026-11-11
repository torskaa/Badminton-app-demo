import React, { useState } from 'react';
import {
 Award,
 Trophy,
 Zap,
 Watch,
 ChevronRight,
 ChevronDown,
 ChevronUp,
 Calendar,
 Crosshair,
 QrCode,
 UserCog,
 Crown,
 Swords,
 Flame,
 Plus,
 MapPin,
 Clock,
 Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { ProSubscriptionModal } from '../common/ProSubscriptionModal';
import { playCoinSound, playSelectSound } from '../../utils/retroAudio';

export interface PastMatchResult {
 id: string;
 opponent: {
 name: string;
 nameTh?: string;
 nameEn?: string;
 tier: string;
 club: string;
 };
 courtName: string;
 courtNameTh?: string;
 courtNameEn?: string;
 date: string;
 dateTh?: string;
 dateEn?: string;
 result: 'win' | 'loss';
 matchType: 'Singles' | 'Doubles';
 partnerName?: string;
 partnerNameTh?: string;
 partnerNameEn?: string;
 scores: { set: number; userScore: number; opponentScore: number }[];
 finalScore: string;
 durationMin: number;
 expGained: number;
 highestSmashKmh: number;
 highlightShot: string;
 highlightShotTh?: string;
 highlightShotEn?: string;
}

const INITIAL_PAST_MATCHES: PastMatchResult[] = [
 {
 id: 'match_01',
 opponent: {
 name: 'โอห์ม ปืนกล',
 nameTh: 'โอห์ม ปืนกล',
 nameEn: 'Ohm Machinegun',
 tier: 'Diamond League',
 club: 'Rama 9 Smashers',
 },
 courtName: 'Winner Arena Badminton Rama 9 (Court 3)',
 courtNameTh: 'วินเนอร์ อารีน่า พระราม 9 (คอร์ท 3)',
 courtNameEn: 'Winner Arena Badminton Rama 9 (Court 3)',
 date: '7 พ.ย. 2026 · 19:30 น.',
 dateTh: '7 พ.ย. 2026 · 19:30 น.',
 dateEn: 'Nov 7, 2026 · 7:30 PM',
 result: 'win',
 matchType: 'Singles',
 scores: [
 { set: 1, userScore: 21, opponentScore: 18 },
 { set: 2, userScore: 19, opponentScore: 21 },
 { set: 3, userScore: 21, opponentScore: 19 },
 ],
 finalScore: '2 - 1',
 durationMin: 48,
 expGained: 150,
 highestSmashKmh: 342,
 highlightShot: 'Steep Jump Smash (Corner Line)',
 highlightShotTh: 'ลูกจัมป์สแมชมุมคอร์ทเฉียบคม',
 highlightShotEn: 'Steep Jump Smash (Corner Line)',
 },
 {
 id: 'match_02',
 opponent: {
 name: 'แบงค์ & ท็อป',
 nameTh: 'แบงค์ & ท็อป',
 nameEn: 'Bank & Top',
 tier: 'Gold League',
 club: 'BKK Weekend Shuttlers',
 },
 partnerName: 'พลอย จอมหยอด',
 partnerNameTh: 'พลอย จอมหยอด',
 partnerNameEn: 'Ploy Net Master',
 courtName: 'สนามแบดอินฟินิตี้ หทัยราษฎร์',
 courtNameTh: 'สนามแบดอินฟินิตี้ หทัยราษฎร์',
 courtNameEn: 'Infinity Badminton Hathairat',
 date: '5 พ.ย. 2026 · 20:00 น.',
 dateTh: '5 พ.ย. 2026 · 20:00 น.',
 dateEn: 'Nov 5, 2026 · 8:00 PM',
 result: 'win',
 matchType: 'Doubles',
 scores: [
 { set: 1, userScore: 21, opponentScore: 15 },
 { set: 2, userScore: 21, opponentScore: 17 },
 ],
 finalScore: '2 - 0',
 durationMin: 36,
 expGained: 120,
 highestSmashKmh: 328,
 highlightShot: 'Double Net Kill Tap & Intercept',
 highlightShotTh: 'การตัดหยอดหน้าเน็ตคู่ชิดเสา',
 highlightShotEn: 'Double Net Kill Tap & Intercept',
 },
 {
 id: 'match_03',
 opponent: {
 name: 'อาร์ท สปีด',
 nameTh: 'อาร์ท สปีด',
 nameEn: 'Art Speedster',
 tier: 'Diamond League',
 club: 'Rama 9 Smashers',
 },
 courtName: 'Sport Refresh ลำลูกกา คลอง 4',
 courtNameTh: 'สปอร์ต รีเฟรช ลำลูกกา คลอง 4 (คอร์ท 5)',
 courtNameEn: 'Sport Refresh Lam Luk Ka Klong 4 (Court 5)',
 date: '2 พ.ย. 2026 · 18:15 น.',
 dateTh: '2 พ.ย. 2026 · 18:15 น.',
 dateEn: 'Nov 2, 2026 · 6:15 PM',
 result: 'loss',
 matchType: 'Singles',
 scores: [
 { set: 1, userScore: 17, opponentScore: 21 },
 { set: 2, userScore: 21, opponentScore: 16 },
 { set: 3, userScore: 18, opponentScore: 21 },
 ],
 finalScore: '1 - 2',
 durationMin: 55,
 expGained: 60,
 highestSmashKmh: 315,
 highlightShot: 'Full-Court Rally 34 Strokes',
 highlightShotTh: 'การตีโต้เต็มคอร์ท 34 จังหวะ',
 highlightShotEn: 'Full-Court Rally 34 Strokes',
 },
 {
 id: 'match_04',
 opponent: {
 name: 'มีน แบ็กแฮนด์ & นัท',
 nameTh: 'มีน แบ็กแฮนด์ & นัท',
 nameEn: 'Meen & Nat',
 tier: 'Silver League',
 club: 'Rama 9 Smashers',
 },
 partnerName: 'โอห์ม ปืนกล',
 partnerNameTh: 'โอห์ม ปืนกล',
 partnerNameEn: 'Ohm Machinegun',
 courtName: '71 Sport Club เอกมัย-ปรีดี',
 courtNameTh: '71 สปอร์ตคลับ เอกมัย-ปรีดี (คอร์ท 2)',
 courtNameEn: '71 Sport Club Ekkamai-Pridi (Court 2)',
 date: '28 ต.ค. 2026 · 19:00 น.',
 dateTh: '28 ต.ค. 2026 · 19:00 น.',
 dateEn: 'Oct 28, 2026 · 7:00 PM',
 result: 'win',
 matchType: 'Doubles',
 scores: [
 { set: 1, userScore: 21, opponentScore: 12 },
 { set: 2, userScore: 21, opponentScore: 14 },
 ],
 finalScore: '2 - 0',
 durationMin: 29,
 expGained: 100,
 highestSmashKmh: 336,
 highlightShot: 'Flick Serve Receiver Smash',
 highlightShotTh: 'ลูกตบสวนกลับจากการเสิร์ฟสะบัด',
 highlightShotEn: 'Flick Serve Receiver Smash',
 },
];

export const F1_UserProfileTrophyScreen: React.FC = () => {
 const { player, navigateTo, booking, gainExp, language } = useApp();
 const isThai = language === 'th';
 const [activeTab, setActiveTab] = useState<'card' | 'matches' | 'trophies' | 'gear'>('card');
 const [isProModalOpen, setIsProModalOpen] = useState(false);

 // Local state for past match results
 const [matches, setMatches] = useState<PastMatchResult[]>(INITIAL_PAST_MATCHES);
 const [matchFilter, setMatchFilter] = useState<'all' | 'win' | 'loss' | 'Singles' | 'Doubles'>('all');
 const [expandedMatchId, setExpandedMatchId] = useState<string | null>('match_01');

 // Stats calculation from local state
 const totalMatchesCount = matches.length;
 const winsCount = matches.filter((m) => m.result === 'win').length;
 const winRatePercentage = totalMatchesCount > 0 ? Math.round((winsCount / totalMatchesCount) * 100) : 0;
 const totalExpFromMatches = matches.reduce((sum, m) => sum + m.expGained, 0);

 // Filtered matches
 const filteredMatches = matches.filter((m) => {
 if (matchFilter === 'all') return true;
 if (matchFilter === 'win') return m.result === 'win';
 if (matchFilter === 'loss') return m.result === 'loss';
 if (matchFilter === 'Singles') return m.matchType === 'Singles';
 if (matchFilter === 'Doubles') return m.matchType === 'Doubles';
 return true;
 });

 // Action to simulate adding a new match to local state
 const handleSimulateNewMatch = () => {
 playCoinSound();
 const newMatch: PastMatchResult = {
 id: `match_${Date.now()}`,
 opponent: {
 name: isThai ? 'แชมป์ สแมชไฟเออร์' : 'Champ Smashfire',
 tier: 'Diamond League',
 club: 'Bangkok Clash Arena',
 },
 courtName: isThai ? 'สแมช อารีน่า พระราม 9 (คอร์ท 1)' : 'Smash Arena Rama 9 (Court 1)',
 date: isThai ? 'วันนี้ เมื่อสักครู่' : 'Today Just now',
 result: 'win',
 matchType: 'Singles',
 scores: [
 { set: 1, userScore: 21, opponentScore: 19 },
 { set: 2, userScore: 22, opponentScore: 20 },
 ],
 finalScore: '2 - 0',
 durationMin: 38,
 expGained: 160,
 highestSmashKmh: 348,
 highlightShot: 'Clutch Deuce Winning Smash',
 };
 setMatches([newMatch, ...matches]);
 setExpandedMatchId(newMatch.id);
 gainExp(160, isThai ? 'บันทึกชัยชนะแมตช์ใหม่ลงประวัตินักกีฬา!' : 'Saved new match victory to athlete profile!');
 };

 return (
 <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28 bg-[#dceeff] text-[#000000]">
 <MobileHeader title={isThai ? 'โปรไฟล์นักกีฬา & ตู้เหรียญรางวัล' : 'Athlete Profile & Trophies'} />

 {/* Segmented Tab Bar (Paper white with 1px black border, 1600px pills) */}
 <div className="px-4 py-3 flex items-center gap-1.5 bg-[#ffffff] shrink-0 overflow-x-auto no-scrollbar">
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveTab('card');
 }}
 className={`px-3 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] transition-all cursor-pointer border border-[#000000] whitespace-nowrap shrink-0 ${
 activeTab === 'card'
 ? 'bg-[#000000] text-[#ffffff]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 {isThai ? 'การ์ดนักกีฬา' : 'Player Card'}
 </button>

 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveTab('matches');
 }}
 className={`px-3 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] transition-all cursor-pointer border border-[#000000] shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
 activeTab === 'matches'
 ? 'bg-[#000000] text-[#ffffff]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 <span>{isThai ? 'ผลการแข่ง' : 'Match Results'}</span>
 <span
 className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
 activeTab === 'matches' ? 'bg-[#55db9c] text-[#000000]' : 'bg-[#000000] text-[#ffffff]'
 }`}
 >
 {matches.length}
 </span>
 </button>

 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveTab('trophies');
 }}
 className={`px-3 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] transition-all cursor-pointer border border-[#000000] shadow-xs whitespace-nowrap shrink-0 ${
 activeTab === 'trophies'
 ? 'bg-[#000000] text-[#ffffff]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 {isThai
 ? `เหรียญ (${player.badges.filter((b) => b.unlocked).length})`
 : `Badges (${player.badges.filter((b) => b.unlocked).length})`}
 </button>

 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveTab('gear');
 }}
 className={`px-3 py-2 rounded-[1600px] text-xs font-bold uppercase tracking-[0.032em] transition-all cursor-pointer border border-[#000000] shadow-xs whitespace-nowrap shrink-0 ${
 activeTab === 'gear'
 ? 'bg-[#000000] text-[#ffffff]'
 : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 {isThai ? 'ไม้และเอ็น' : 'Gear & Strings'}
 </button>
 </div>

 <div className="p-4 space-y-4">
 {activeTab === 'card' && (
 <div className="space-y-3.5 w-full">
 {/* Athlete Identity Trading Card */}
 <div className="w-full rounded-[32px] bg-[#ffd731] shadow-lg p-4 text-[#000000]">
 <div className="flex items-center justify-between pb-2 mb-2 ">
 <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[9px] font-black uppercase tracking-wider">
 {isThai ? 'การ์ดข้อมูลนักกีฬา' : 'ATHLETE CARD'}
 </span>
 <span className="text-[10px] font-bold text-[#000000]/70">
 {isThai ? 'ยืนยันตัวตนแล้ว' : 'SMASH VERIFIED'}
 </span>
 </div>

 <div className="flex items-start justify-between">
 <div>
 <div className="font-['Antonio',sans-serif] text-6xl font-black leading-none">
 85
 </div>
 <div className="text-[11px] font-bold tracking-[0.032em] uppercase mt-0.5">
 {isThai ? 'คะแนนรวม · สแมชโปร' : 'OVR · SMASH PRO'}
 </div>
 <span className="inline-block mt-1 px-2.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[9px] font-bold tracking-[0.032em]">
 {isThai ? 'ลีกไดมอนด์' : 'DIAMOND LEAGUE'}
 </span>
 </div>

 <img
 src={player.avatarUrl}
 alt="Player Avatar"
 className="w-16 h-16 rounded-[20px] object-cover shadow-xs bg-[#ffffff]"
 />
 </div>

 <div className="text-center mt-3 pt-2.5 ">
 <h3 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight text-[#000000]">
 {isThai ? (player.nameTh || 'กานต์ ธนวัฒน์') : (player.nameEn || 'Karn Tanawat')}
 </h3>
 <p className="text-xs text-[#000000]/80 font-bold">
 {isThai ? `สไตล์การเล่น: ${player.playstyleTh || 'สายบุกตบสแมชดุดัน'}` : `Playstyle: ${player.playstyleEn || player.playstyle}`}
 </p>
 </div>

 {/* Stat Pills */}
 <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 text-center">
 <div className="p-2 rounded-[16px] bg-[#ffffff] shadow-xs">
 <div className="text-[9px] font-bold uppercase text-[#000000]/60 tracking-[0.032em]">
 {isThai ? 'พลัง' : 'POW'}
 </div>
 <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000]">
 {player.skillRadar.power}
 </div>
 </div>
 <div className="p-2 rounded-[16px] bg-[#ffffff] shadow-xs">
 <div className="text-[9px] font-bold uppercase text-[#000000]/60 tracking-[0.032em]">
 {isThai ? 'สปีด' : 'SPD'}
 </div>
 <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000]">
 {player.skillRadar.speed}
 </div>
 </div>
 <div className="p-2 rounded-[16px] bg-[#ffffff] shadow-xs">
 <div className="text-[9px] font-bold uppercase text-[#000000]/60 tracking-[0.032em]">
 {isThai ? 'คุมลูก' : 'CTL'}
 </div>
 <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000]">
 {player.skillRadar.control}
 </div>
 </div>
 </div>
 </div>

 {/* NEW SECTION: ประวัติผลการแข่งขันล่าสุด (PAST MATCH RESULTS FROM LOCAL STATE) */}
 <div className="w-full p-4 rounded-[28px] bg-[#ffffff] space-y-3 shadow-sm">
 <div className="flex items-center justify-between pb-2 ">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-[1600px] bg-[#dceeff] flex items-center justify-center text-[#000000]">
 <Swords className="w-4 h-4" />
 </div>
 <div>
 <h4 className="font-['Antonio',sans-serif] text-base font-black uppercase tracking-wider text-[#000000] leading-none">
 {isThai ? 'ประวัติการแข่งขัน' : 'PAST MATCHES'}
 </h4>
 <p className="text-[10px] text-[#000000]/65 font-bold mt-0.5">
 {isThai ? 'บันทึกผลการแข่งขันล่าสุดและสถิติคอร์ท' : 'Recent match results & court stats'}
 </p>
 </div>
 </div>

 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveTab('matches');
 }}
 className="px-2.5 py-1 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] text-[10px] font-bold uppercase tracking-[0.032em] flex items-center gap-1 hover:bg-[#333333] cursor-pointer shadow-xs active:scale-95 transition-all"
 >
 <span>{isThai ? 'ดูทั้งหมด' : 'See all'}</span>
 <ChevronRight className="w-3 h-3" />
 </button>
 </div>

 {/* Local State Quick Stats Strip */}
 <div className="grid grid-cols-3 gap-2 text-center">
 <div className="p-2 rounded-[16px] bg-[#dceeff] shadow-xs">
 <div className="text-[9px] font-bold uppercase text-[#000000]/60 tracking-wider">
 {isThai ? 'อัตราชนะ' : 'WIN RATE'}
 </div>
 <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000] leading-tight">
 {winRatePercentage}%
 </div>
 <div className="text-[9px] text-[#000000]/70 font-semibold">
 {isThai ? `ชนะ ${winsCount} - แพ้ ${totalMatchesCount - winsCount}` : `${winsCount}W - ${totalMatchesCount - winsCount}L`}
 </div>
 </div>
 <div className="p-2 rounded-[16px] bg-[#ffd731] shadow-xs">
 <div className="text-[9px] font-bold uppercase text-[#000000]/70 tracking-wider">
 {isThai ? 'EXP รวม' : 'TOTAL EXP'}
 </div>
 <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000] leading-tight">
 +{totalExpFromMatches}
 </div>
 <div className="text-[9px] text-[#000000]/80 font-semibold">{totalMatchesCount} {isThai ? 'แมตช์' : 'Matches'}</div>
 </div>
 <div className="p-2 rounded-[16px] bg-[#ffffff] shadow-xs">
 <div className="text-[9px] font-bold uppercase text-[#000000]/60 tracking-wider">
 {isThai ? 'สปีดตบสูงสุด' : 'TOP SMASH'}
 </div>
 <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000] leading-tight">
 {Math.max(...matches.map((m) => m.highestSmashKmh))} km/h
 </div>
 <div className="text-[9px] text-[#55db9c] font-bold">
 {isThai ? 'สถิติความเร็ว' : 'Speed Record'}
 </div>
 </div>
 </div>

 {/* Render List of Past Match Results */}
 <div className="space-y-2.5 pt-1">
 {matches.slice(0, 3).map((match) => {
 const isExpanded = expandedMatchId === match.id;
 const isWin = match.result === 'win';

 return (
 <div
 key={match.id}
 className="rounded-[20px] bg-[#f8fbff] p-3 space-y-2 transition-all hover:bg-[#edf5ff] shadow-xs"
 >
 {/* Top Row: Date, Result badge, Match Type */}
 <div className="flex items-center justify-between text-[10px]">
 <div className="flex items-center gap-1.5 font-bold text-[#000000]/70">
 <Calendar className="w-3 h-3 text-[#000000]/60" />
 <span>{isThai ? (match.dateTh || match.date) : (match.dateEn || match.date)}</span>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#ffffff] text-[9px] font-bold uppercase text-[#000000]/80">
 {isThai ? (match.matchType.toLowerCase().includes('single') ? 'ประเภทเดี่ยว' : 'ประเภทคู่') : match.matchType}
 </span>
 <span
 className={`px-2.5 py-0.5 rounded-[1600px] text-[9px] font-black uppercase ${
 isWin ? 'bg-[#55db9c] text-[#000000]' : 'bg-[#fb4903] text-[#ffffff]'
 }`}
 >
 {isWin ? (isThai ? 'ชนะ' : 'WIN') : (isThai ? 'แพ้' : 'LOSS')} · {match.finalScore}
 </span>
 </div>
 </div>

 {/* Opponent & Matchup Info */}
 <div className="flex items-start justify-between gap-2 pt-1 ">
 <div className="min-w-0 flex-1">
 <div className="flex items-center gap-1.5">
 <span className="text-[11px] font-bold text-[#000000]/50 uppercase tracking-wider">VS</span>
 <span className="font-['Antonio',sans-serif] text-base font-black text-[#000000] tracking-wide truncate">
 {isThai ? (match.opponent.nameTh || match.opponent.name) : (match.opponent.nameEn || match.opponent.name)}
 </span>
 </div>
 <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#000000]/70 font-semibold flex-wrap">
 <span className="px-2 py-0.5 rounded-full bg-[#ffd731] text-[9px] font-black text-[#000000]">
 {isThai ? match.opponent.tier.replace('Diamond League', 'ลีกไดมอนด์').replace('Platinum League', 'ลีกแพลทินัม').replace('Gold League', 'ลีกโกลด์').replace('Silver League', 'ลีกซิลเวอร์').replace('Bronze League', 'ลีกบรอนซ์') : match.opponent.tier}
 </span>
 <span>{match.opponent.club}</span>
 {match.partnerName && (
 <span className="text-[#5c4ade]">· {isThai ? `คู่กับ ${match.partnerNameTh || match.partnerName}` : `with ${match.partnerNameEn || match.partnerName}`}</span>
 )}
 </div>
 <div className="flex items-center gap-1 mt-1 text-[10px] text-[#000000]/60 font-medium truncate">
 <MapPin className="w-3 h-3 shrink-0" />
 <span className="truncate">{isThai ? (match.courtNameTh || match.courtName) : (match.courtNameEn || match.courtName)}</span>
 </div>
 </div>

 {/* Final Score Big Display */}
 <div className="text-right shrink-0">
 <div className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000] leading-none">
 {match.finalScore}
 </div>
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setExpandedMatchId(isExpanded ? null : match.id);
 }}
 className="mt-1 text-[9px] font-bold uppercase text-[#000000] underline flex items-center justify-end gap-0.5 cursor-pointer"
 >
 <span>{isExpanded ? (isThai ? 'ย่อ' : 'Collapse') : (isThai ? 'ดูเซ็ต' : 'Sets')}</span>
 {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
 </button>
 </div>
 </div>

 {/* Set-by-Set Score Chips */}
 <div className="flex items-center gap-1.5 pt-1">
 <span className="text-[9px] font-bold text-[#000000]/60 uppercase">
 {isThai ? 'คะแนนเซ็ต:' : 'Set Scores:'}
 </span>
 <div className="flex items-center gap-1.5 flex-wrap">
 {match.scores.map((s) => (
 <span
 key={s.set}
 className={`px-2 py-0.5 rounded-[8px] text-[10px] font-mono font-bold ${
 s.userScore > s.opponentScore
 ? 'bg-[#ffffff] text-[#000000] font-black'
 : 'bg-[#eeeeee] text-[#000000]/70'
 }`}
 >
 {isThai ? `เซ็ต ${s.set}: ${s.userScore}–${s.opponentScore}` : `S${s.set}: ${s.userScore}-${s.opponentScore}`}
 </span>
 ))}
 </div>
 </div>

 {/* Expanded Set & Performance Telemetry */}
 {isExpanded && (
 <div className="mt-2 pt-2 bg-[#ffffff] p-2.5 rounded-[16px] space-y-2 text-[10px]">
 <div className="grid grid-cols-3 gap-2 text-center">
 <div className="p-1.5 rounded-[10px] bg-[#dceeff] ">
 <span className="text-[8px] font-bold text-[#000000]/60 uppercase block">
 {isThai ? 'ความเร็วสแมช' : 'Top Smash'}
 </span>
 <span className="font-['Antonio',sans-serif] text-sm font-black text-[#000000]">
 ⚡ {match.highestSmashKmh} {isThai ? 'กม./ชม.' : 'km/h'}
 </span>
 </div>
 <div className="p-1.5 rounded-[10px] bg-[#dceeff] ">
 <span className="text-[8px] font-bold text-[#000000]/60 uppercase block">
 {isThai ? 'ระยะเวลาแข่ง' : 'Duration'}
 </span>
 <span className="font-['Antonio',sans-serif] text-sm font-black text-[#000000]">
 ⏱️ {match.durationMin} {isThai ? 'นาที' : 'min'}
 </span>
 </div>
 <div className="p-1.5 rounded-[10px] bg-[#ffd731] ">
 <span className="text-[8px] font-bold text-[#000000]/70 uppercase block">
 {isThai ? 'EXP ที่ได้รับ' : 'EXP Gained'}
 </span>
 <span className="font-['Antonio',sans-serif] text-sm font-black text-[#000000]">
 +{match.expGained} EXP
 </span>
 </div>
 </div>
 <div className="text-[10px] font-medium text-[#000000]/80 bg-[#f4f7fb] p-2 rounded-[12px] flex items-center gap-1.5">
 <Sparkles className="w-3.5 h-3.5 text-[#5c4ade] shrink-0" />
 <span><strong>{isThai ? 'ไฮไลต์ช็อตสำคัญ:' : 'Highlight Shot:'}</strong> {isThai ? (match.highlightShotTh || match.highlightShot) : (match.highlightShotEn || match.highlightShot)}</span>
 </div>
 </div>
 )}
 </div>
 );
 })}
 </div>

 {/* Action: Simulate New Match Button to demonstrate live local state */}
 <div className="pt-2 flex items-center gap-2">
 <button
 type="button"
 onClick={handleSimulateNewMatch}
 className="flex-1 py-2.5 px-3 rounded-[1600px] bg-[#ffd731] border border-[#000000] text-xs font-bold uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 hover:bg-[#ffe266] active:scale-95 transition-transform cursor-pointer text-[#000000]"
 >
 <Plus className="w-3.5 h-3.5 text-[#000000]" />
 <span>{isThai ? '+ จำลองบันทึกผลแข่งใหม่' : '+ Simulate New Match'}</span>
 </button>
 </div>
 </div>

 {/* My Active Booking Pass (Real User Flow) */}
 <div
 onClick={() => navigateTo('B4')}
 className="w-full p-4 rounded-[28px] bg-[#ffffff] cursor-pointer hover:bg-[#e9ccff] transition-all space-y-2"
 >
 <div className="flex items-center justify-between pb-1 text-[10px]">
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#dceeff] font-black uppercase text-[#000000]">
 {isThai ? 'บัตรเข้าสนาม' : 'ACTIVE PASS'}
 </span>
 <span className="font-bold text-[#55db9c]">● {isThai ? 'พร้อมใช้งาน' : 'Ready'}</span>
 </div>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-[1600px] bg-[#55db9c] flex items-center justify-center font-bold text-[#000000]">
 <QrCode className="w-5 h-5" />
 </div>
 <div>
 <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
 บัตรเข้าคอร์ทของฉัน
 </div>
 <div className="text-[10px] text-[#000000]/70 font-bold">
 {booking.court?.name || 'สแมช อารีน่า พระราม 9'} · คอร์ท {booking.selectedCourtNumber || 3}
 </div>
 </div>
 </div>
 <ChevronRight className="w-4 h-4 text-[#000000]" />
 </div>
 </div>

 {/* Wearable Sync Callout */}
 <div
 onClick={() => navigateTo('F2')}
 className="w-full p-4 rounded-[28px] bg-[#ffffff] cursor-pointer hover:bg-[#ffd731] transition-all space-y-2"
 >
 <div className="flex items-center justify-between pb-1 text-[10px]">
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#4da2ff] text-[#000000] font-black uppercase">
 เชื่อมต่ออุปกรณ์ · SMART WEARABLE
 </span>
 <span className="font-bold text-[#000000]/60">164 BPM · 480 kcal</span>
 </div>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-[1600px] bg-[#4da2ff] flex items-center justify-center font-bold text-[#000000]">
 <Watch className="w-5 h-5" />
 </div>
 <div>
 <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
 APPLE WATCH & GARMIN SYNC
 </div>
 <div className="text-[10px] text-[#000000]/70 font-bold">
 ซิงค์ชีพจรและเผาผลาญแคลอรี่เป็นแต้ม EXP
 </div>
 </div>
 </div>
 <ChevronRight className="w-4 h-4 text-[#000000]" />
 </div>
 </div>

 {/* Edit DNA & Settings */}
 <div
 onClick={() => navigateTo('A2')}
 className="w-full p-4 rounded-[28px] bg-[#ffffff] cursor-pointer hover:bg-[#e9e9e9] transition-all space-y-2"
 >
 <div className="flex items-center justify-between pb-1 text-[10px]">
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#e9ccff] font-black uppercase text-[#000000]">
 {isThai ? 'ตั้งค่าความถนัด' : 'PLAYSTYLE DNA'}
 </span>
 <span className="font-bold text-[#000000]/60">{isThai ? 'แก้ไขข้อมูล' : 'Edit'}</span>
 </div>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-[1600px] bg-[#e9ccff] flex items-center justify-center font-bold text-[#000000]">
 <UserCog className="w-5 h-5" />
 </div>
 <div>
 <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
 {isThai ? 'แก้ไขข้อมูลนักกีฬา & สไตล์การเล่น' : 'Edit Athlete DNA & Playstyle'}
 </div>
 <div className="text-[10px] text-[#000000]/70 font-bold">
 {isThai ? 'ปรับสายตบ, มือกุมแร็กเก็ต, และเป้าหมายฝึกฝน' : 'Customize playstyle, grip hand, and goals'}
 </div>
 </div>
 </div>
 <ChevronRight className="w-4 h-4 text-[#000000]" />
 </div>
 </div>

 {/* Pro Membership Monetization Shortcut */}
 <div
 onClick={() => {
 setIsProModalOpen(true);
 playCoinSound();
 }}
 className="w-full p-4 rounded-[28px] bg-[#ffd731] cursor-pointer hover:bg-[#ffe266] transition-all space-y-2"
 >
 <div className="flex items-center justify-between pb-1 text-[10px]">
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffd731] font-black uppercase">
 {isThai ? 'สมาชิกสิทธิพิเศษ' : 'PRO PASS'}
 </span>
 <span className="font-black text-[#000000]">{isThai ? '฿199 / เดือน' : '฿199 / mo'}</span>
 </div>
 <div className="flex items-center justify-between gap-3">
 <div className="flex items-center gap-3 min-w-0 flex-1">
 <div className="w-10 h-10 rounded-[1600px] bg-[#000000] text-[#ffd731] flex items-center justify-center font-bold shrink-0">
 <Crown className="w-5 h-5" />
 </div>
 <div className="min-w-0 flex-1">
 <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000] truncate">
 SMASH PRO MEMBER
 </div>
 <div className="text-[10px] text-[#000000]/80 font-bold truncate">
 {isThai ? 'ลดค่าคอร์ท 10% · สแกน AI ไม่จำกัด' : '10% off courts · Unlimited AI Scans'}
 </div>
 </div>
 </div>
 <span className="px-3.5 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[10px] font-bold tracking-[0.032em] uppercase shrink-0 whitespace-nowrap">
 {player.tier === 'Pro' ? (isThai ? 'ใช้งานอยู่' : 'ACTIVE') : (isThai ? 'อัปเกรด' : 'UPGRADE')}
 </span>
 </div>
 </div>

 {/* Quick Action Buttons (Black fill and outlined black) */}
 <div className="w-full grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => navigateTo('D1')}
 className="p-3 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#ffffff] text-[#000000] border border-[#000000] hover:bg-[#e9e9e9] whitespace-nowrap"
 >
 <Crosshair className="w-3.5 h-3.5 text-[#5c4ade]" />
 <span>{isThai ? 'เรดาร์โค้ช AI' : 'COACH RADAR (D1)'}</span>
 </button>
 <button
 type="button"
 onClick={() => navigateTo('B1')}
 className="p-3 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#000000] text-[#ffffff] border border-[#000000] hover:bg-[#1a1a1a] whitespace-nowrap"
 >
 <Calendar className="w-3.5 h-3.5" />
 <span>{isThai ? 'จองสนามแบด' : 'BOOK COURTS (B1)'}</span>
 </button>
 </div>
 </div>
 )}

 {/* DEDICATED FULL TAB: ผลการแข่ง (MATCHES) */}
 {activeTab === 'matches' && (
 <div className="space-y-4">
 {/* Header / Summary Card */}
 <div className="p-4 rounded-[28px] bg-[#ffffff] shadow-sm space-y-3">
 <div className="flex items-center justify-between pb-2 ">
 <div>
 <h4 className="font-['Antonio',sans-serif] text-lg font-black uppercase tracking-wider text-[#000000] leading-tight">
 {isThai ? 'ประวัติผลการแข่งขันทั้งหมด' : 'ALL MATCH HISTORY'}
 </h4>
 <p className="text-[10px] text-[#000000]/70 font-bold">
 {isThai ? 'แมตช์ที่บันทึกในระบบ' : 'Recorded matches in system'}
 </p>
 </div>
 {/* CTA Action button keeps solid black border */}
 <button
 type="button"
 onClick={handleSimulateNewMatch}
 className="px-3 py-1.5 rounded-[1600px] bg-[#55db9c] text-[#000000] border-2 border-[#000000] text-xs font-black uppercase tracking-wide flex items-center gap-1 hover:bg-[#46c288] active:scale-95 transition-transform cursor-pointer shadow-xs"
 >
 <Plus className="w-3.5 h-3.5" />
 <span>{isThai ? 'เพิ่มผลแข่ง' : 'Add Match'}</span>
 </button>
 </div>

 {/* Big Stat Summary */}
 <div className="grid grid-cols-4 gap-2 text-center">
 <div className="p-2 rounded-[16px] bg-[#dceeff] shadow-xs">
 <div className="text-[8px] font-bold uppercase text-[#000000]/60">{isThai ? 'แมตช์ทั้งหมด' : 'TOTAL'}</div>
 <div className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{matches.length}</div>
 </div>
 <div className="p-2 rounded-[16px] bg-[#55db9c]/30 shadow-xs">
 <div className="text-[8px] font-bold uppercase text-[#000000]/60">{isThai ? 'ชนะ' : 'WINS'}</div>
 <div className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{winsCount}</div>
 </div>
 <div className="p-2 rounded-[16px] bg-[#fb4903]/20 shadow-xs">
 <div className="text-[8px] font-bold uppercase text-[#000000]/60">{isThai ? 'แพ้' : 'LOSSES'}</div>
 <div className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">
 {matches.length - winsCount}
 </div>
 </div>
 <div className="p-2 rounded-[16px] bg-[#ffd731] shadow-xs">
 <div className="text-[8px] font-bold uppercase text-[#000000]/70">WIN RATE</div>
 <div className="font-['Antonio',sans-serif] text-xl font-black text-[#000000]">{winRatePercentage}%</div>
 </div>
 </div>

 {/* Filter Pills */}
 <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
 {(
 [
 { id: 'all', label: isThai ? `ทั้งหมด (${matches.length})` : `All (${matches.length})` },
 { id: 'win', label: isThai ? `ชนะ (${winsCount})` : `Won (${winsCount})` },
 { id: 'loss', label: isThai ? `แพ้ (${matches.length - winsCount})` : `Lost (${matches.length - winsCount})` },
 { id: 'Singles', label: isThai ? 'เดี่ยว' : 'Singles' },
 { id: 'Doubles', label: isThai ? 'คู่' : 'Doubles' },
 ] as const
 ).map((f) => (
 <button
 key={f.id}
 type="button"
 onClick={() => {
 playSelectSound();
 setMatchFilter(f.id);
 }}
 className={`px-2.5 py-1 rounded-[1600px] text-[10px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap cursor-pointer ${
 matchFilter === f.id
 ? 'bg-[#000000] text-[#ffffff] border-[#000000] shadow-xs'
 : 'bg-[#ffffff] text-[#000000] border-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 {f.label}
 </button>
 ))}
 </div>
 </div>

 {/* Match List */}
 <div className="space-y-3">
 {filteredMatches.length === 0 ? (
 <div className="p-8 text-center bg-[#ffffff] rounded-[28px] shadow-sm">
 <p className="text-xs font-bold text-[#000000]/60">ไม่พบข้อมูลแมตช์ในหมวดหมู่นี้</p>
 </div>
 ) : (
 filteredMatches.map((match) => {
 const isExpanded = expandedMatchId === match.id;
 const isWin = match.result === 'win';

 return (
 <div
 key={match.id}
 className="p-4 rounded-[28px] bg-[#ffffff] space-y-3 transition-all shadow-sm hover:shadow-md"
 >
 {/* Top Bar: Match Date & Badges */}
 <div className="flex items-center justify-between pb-2 ">
 <div className="flex items-center gap-1.5 text-xs font-bold text-[#000000]/70">
 <Clock className="w-3.5 h-3.5" />
 <span>{isThai ? (match.dateTh || match.date) : (match.dateEn || match.date)}</span>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#dceeff] text-[10px] font-bold uppercase text-[#000000]">
 {match.matchType}
 </span>
 <span
 className={`px-3 py-0.5 rounded-[1600px] text-[10px] font-black uppercase ${
 isWin ? 'bg-[#55db9c] text-[#000000]' : 'bg-[#fb4903] text-[#ffffff]'
 }`}
 >
 {isWin ? (isThai ? 'ชนะ' : 'VICTORY') : (isThai ? 'แพ้' : 'DEFEAT')}
 </span>
 </div>
 </div>

 {/* Opponent Info and Main Scoreboard */}
 <div className="flex items-center justify-between gap-3">
 <div className="min-w-0 flex-1">
 <div className="text-[10px] font-bold text-[#000000]/50 uppercase tracking-wider">
 {isThai ? 'คู่ต่อสู้' : 'OPPONENT'}
 </div>
 <h4 className="font-['Antonio',sans-serif] text-xl font-black text-[#000000] tracking-wide truncate">
 {isThai ? (match.opponent.nameTh || match.opponent.name) : (match.opponent.nameEn || match.opponent.name)}
 </h4>
 <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#000000]/70 font-semibold flex-wrap">
 <span className="px-2 py-0.2 rounded-full bg-[#ffd731] text-[9px] font-black">
 {match.opponent.tier}
 </span>
 <span>{match.opponent.club}</span>
 </div>
 {match.partnerName && (
 <div className="text-[10px] text-[#5c4ade] font-bold mt-0.5">
 {isThai ? `คู่หูร่วมทีม: ${match.partnerNameTh || match.partnerName}` : `Partner: ${match.partnerNameEn || match.partnerName}`}
 </div>
 )}
 <div className="text-[10px] text-[#000000]/60 font-medium flex items-center gap-1 mt-1 truncate">
 <MapPin className="w-3 h-3 shrink-0" />
 <span className="truncate">{isThai ? (match.courtNameTh || match.courtName) : (match.courtNameEn || match.courtName)}</span>
 </div>
 </div>

 {/* Final Score Pill */}
 <div className="text-center p-3 rounded-[20px] bg-[#dceeff] shadow-xs min-w-[76px] shrink-0">
 <div className="text-[9px] font-bold text-[#000000]/60 uppercase">{isThai ? 'สกอร์รวม' : 'SCORE'}</div>
 <div className="font-['Antonio',sans-serif] text-3xl font-black text-[#000000] leading-none my-0.5">
 {match.finalScore}
 </div>
 <div className="text-[9px] font-bold text-[#000000]/70">{match.durationMin} {isThai ? 'นาที' : 'min'}</div>
 </div>
 </div>

 {/* Set By Set Breakdown */}
 <div className="p-2.5 rounded-[18px] bg-[#f8fbff] shadow-xs space-y-2">
 <div className="flex items-center justify-between text-[10px] font-bold text-[#000000]/70">
 <span>{isThai ? 'ผลการแข่งขันแต่ละเซ็ต' : 'SET SCORES'}</span>
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setExpandedMatchId(isExpanded ? null : match.id);
 }}
 className="text-[#000000] underline flex items-center gap-0.5 cursor-pointer"
 >
 <span>{isExpanded ? (isThai ? 'ซ่อนรายละเอียด' : 'Hide') : (isThai ? 'ดูเทเลเมทรี' : 'View Stats')}</span>
 {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
 </button>
 </div>

 <div className="grid grid-cols-3 gap-2">
 {match.scores.map((s) => {
 const setWon = s.userScore > s.opponentScore;
 return (
 <div
 key={s.set}
 className={`p-2 rounded-[14px] text-center ${
 setWon ? 'bg-[#55db9c]/25' : 'bg-[#ffffff]'
 }`}
 >
 <div className="text-[9px] font-bold text-[#000000]/60 uppercase">{isThai ? `เซ็ต ${s.set}` : `Set ${s.set}`}</div>
 <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000]">
 {s.userScore} - {s.opponentScore}
 </div>
 <div className="text-[8px] font-bold uppercase mt-0.5">
 {setWon ? (isThai ? 'ชนะ' : 'WON') : (isThai ? 'แพ้' : 'LOST')}
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Expandable Match Analytics & Telemetry */}
 {isExpanded && (
 <div className="p-3 rounded-[20px] bg-[#fffbed] shadow-xs space-y-2.5 text-[11px]">
 <div className="flex items-center justify-between pb-1">
 <span className="font-['Antonio',sans-serif] text-xs font-black uppercase text-[#000000]">
 {isThai ? 'สถิติการเล่นและความเร็วลูก' : 'SMASH METRICS'}
 </span>
 <span className="font-bold text-[#55db9c] text-[10px]">VERIFIED</span>
 </div>

 <div className="grid grid-cols-3 gap-2 text-center">
 <div className="p-2 rounded-[14px] bg-[#ffffff] shadow-xs">
 <div className="text-[9px] font-bold text-[#000000]/60 uppercase">
 {isThai ? 'ลูกตบเร็วสุด' : 'TOP SMASH'}
 </div>
 <div className="font-['Antonio',sans-serif] text-base font-black text-[#000000]">
 ⚡ {match.highestSmashKmh} km/h
 </div>
 </div>
 <div className="p-2 rounded-[14px] bg-[#ffffff] shadow-xs">
 <div className="text-[9px] font-bold text-[#000000]/60 uppercase">
 {isThai ? 'ระยะเวลา' : 'DURATION'}
 </div>
 <div className="font-['Antonio',sans-serif] text-base font-black text-[#000000]">
 ⏱️ {match.durationMin} {isThai ? 'น.' : 'm'}
 </div>
 </div>
 <div className="p-2 rounded-[14px] bg-[#ffffff] shadow-xs">
 <div className="text-[9px] font-bold text-[#000000]/60 uppercase">
 {isThai ? 'EXP ได้รับ' : 'EXP'}
 </div>
 <div className="font-['Antonio',sans-serif] text-base font-black text-[#000000]">
 +{match.expGained} EXP
 </div>
 </div>
 </div>

 <div className="p-2.5 rounded-[14px] bg-[#ffffff] shadow-xs flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Sparkles className="w-4 h-4 text-[#ffd731] shrink-0" />
 <div>
 <div className="text-[9px] font-bold text-[#000000]/60 uppercase">
 {isThai ? 'ช็อตไฮไลต์ประจำแมตช์' : 'HIGHLIGHT SHOT'}
 </div>
 <div className="font-bold text-xs text-[#000000]">
 {isThai ? (match.highlightShotTh || match.highlightShot) : (match.highlightShotEn || match.highlightShot)}
 </div>
 </div>
 </div>
 {/* CTA button preserves solid black border */}
 <button
 type="button"
 onClick={() => navigateTo('C3')}
 className="px-2.5 py-1 rounded-[1600px] bg-[#000000] text-[#ffffff] border-2 border-[#000000] text-[9px] font-bold uppercase tracking-wider hover:bg-[#333333] cursor-pointer shadow-xs active:scale-95 transition-transform"
 >
 {isThai ? 'ตรวจวิเคราะห์ช็อต' : 'Analyze Motion'}
 </button>
 </div>
 </div>
 )}
 </div>
 );
 })
 )}
 </div>
 </div>
 )}

 {activeTab === 'trophies' && (
 <div className="space-y-3">
 <div className="grid grid-cols-2 gap-3">
 {player.badges.map((b) => (
 <div
 key={b.id}
 className={`p-4 rounded-[28px] shadow-sm transition-all flex flex-col justify-between ${
 b.unlocked ? 'bg-[#ffffff]' : 'bg-[#cccccc]/40 opacity-70'
 }`}
 >
 <div>
 <div className="flex items-center justify-between mb-2">
 <div className="w-10 h-10 rounded-[1600px] bg-[#ffd731] text-[#000000] flex items-center justify-center font-bold shadow-xs">
 <Award className="w-5 h-5" />
 </div>
 <span className="text-[9px] font-bold uppercase tracking-[0.032em] px-2.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] shadow-xs">
 {b.rarity}
 </span>
 </div>

 <h5 className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wide text-[#000000]">
 {b.name}
 </h5>
 <p className="text-[10px] text-[#000000]/70 mt-1 font-medium leading-relaxed">
 {b.description}
 </p>
 </div>

 <div className="mt-3 pt-2 flex items-center justify-between text-[10px] font-bold">
 <span className={b.unlocked ? 'text-[#000000]' : 'text-[#000000]/50'}>
 {b.unlocked ? (isThai ? '✓ ปลดล็อกแล้ว (+100 EXP)' : '✓ Unlocked (+100 EXP)') : `${b.progress}/${b.maxProgress}`}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {activeTab === 'gear' && (
 <div className="p-5 rounded-[28px] bg-[#ffffff] shadow-sm space-y-4">
 <h4 className="font-['Antonio',sans-serif] text-base font-black uppercase tracking-wider text-[#000000]">
 {isThai ? 'สเปกอุปกรณ์ไม้แบด' : 'RACKET & STRING SPEC'}
 </h4>

 <div className="space-y-2.5">
 <div className="p-3 rounded-[20px] bg-[#dceeff] shadow-xs flex items-center justify-between">
 <span className="text-xs text-[#000000]/70 font-bold">{isThai ? 'รุ่นไม้แบด:' : 'Racket Model:'}</span>
 <span className="text-xs font-bold font-mono">{player.racket.model}</span>
 </div>
 <div className="p-3 rounded-[20px] bg-[#dceeff] shadow-xs flex items-center justify-between">
 <span className="text-xs text-[#000000]/70 font-bold">{isThai ? 'น้ำหนัก / กริป:' : 'Weight / Grip:'}</span>
 <span className="text-xs font-bold font-mono">{player.racket.weightGrip}</span>
 </div>
 <div className="p-3 rounded-[20px] bg-[#dceeff] shadow-xs flex items-center justify-between">
 <span className="text-xs text-[#000000]/70 font-bold">{isThai ? 'ความตึงเอ็น:' : 'Tension:'}</span>
 <span className="text-xs font-bold text-[#5c4ade] font-mono">{player.racket.stringTension}</span>
 </div>
 <div className="p-3 rounded-[20px] bg-[#dceeff] shadow-xs flex items-center justify-between">
 <span className="text-xs text-[#000000]/70 font-bold">{isThai ? 'ประเภทเอ็น:' : 'String Type:'}</span>
 <span className="text-xs font-bold">{player.racket.stringType}</span>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Pro Membership Modal */}
 <ProSubscriptionModal
 isOpen={isProModalOpen}
 onClose={() => setIsProModalOpen(false)}
 />
 </div>
 );
};
