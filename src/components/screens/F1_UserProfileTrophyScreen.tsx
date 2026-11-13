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
 Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { SectionHeader } from '../common/SectionHeader';
import { ProSubscriptionModal } from '../common/ProSubscriptionModal';
import { AppSettingsModal } from '../common/AppSettingsModal';
import { DoodleAvatar, resolveDoodlePreset } from '../common/DoodleAvatar';
import { playCoinSound, playSelectSound } from '../../utils/retroAudio';

export interface PastMatchResult {
 id: string;
 opponent: {
 name: string;
 nameTh?: string;
 nameEn?: string;
 tier: string;
 club: string;
 avatars: string[];
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
 partnerAvatar?: string;
 scores: { set: number; userScore: number; opponentScore: number }[];
 finalScore: string;
 durationMin: number;
 expGained: number;
 highestSmashKmh: number;
 highlightShot: string;
 highlightShotTh?: string;
 highlightShotEn?: string;
}

const AVATARS = {
 ohm: 'ohm',
 bank: 'bank',
 top: 'top',
 ploy: 'ploy',
 meen: 'meen',
};

const INITIAL_PAST_MATCHES: PastMatchResult[] = [
 {
 id: 'match_01',
 opponent: {
 name: 'โอห์ม ปืนกล',
 nameTh: 'โอห์ม ปืนกล',
 nameEn: 'Ohm Machinegun',
 tier: 'Diamond League',
 club: 'Rama 9 Smashers',
 avatars: [AVATARS.ohm],
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
 avatars: [AVATARS.bank, AVATARS.top],
 },
 partnerName: 'พลอย จอมหยอด',
 partnerNameTh: 'พลอย',
 partnerNameEn: 'Ploy',
 partnerAvatar: AVATARS.ploy,
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
 avatars: [AVATARS.top],
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
 name: 'มีน & นัท',
 nameTh: 'มีน & นัท',
 nameEn: 'Meen & Nat',
 tier: 'Silver League',
 club: 'Rama 9 Smashers',
 avatars: [AVATARS.meen, AVATARS.bank],
 },
 partnerName: 'โอห์ม ปืนกล',
 partnerNameTh: 'โอห์ม',
 partnerNameEn: 'Ohm',
 partnerAvatar: AVATARS.ohm,
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

const FaceAvatar: React.FC<{
 src?: string;
 label: string;
 className?: string;
 accentClass?: string;
}> = ({ src, label, className = 'w-11 h-11', accentClass = 'border-[#000000]' }) => {
 const preset = resolveDoodlePreset(src || label);
 return (
 <DoodleAvatar
 preset={preset}
 seed={label}
 className={className}
 ringClass={`border-2 ${accentClass} shadow-xs`}
 />
 );
};

interface MatchFaceOffCardProps {
 match: PastMatchResult;
 userDisplayName: string;
 userAvatarUrl: string;
 isThai: boolean;
 isExpanded: boolean;
 onToggleExpand: () => void;
 onAnalyze?: () => void;
 surfaceClass?: string;
}

const MatchFaceOffCard: React.FC<MatchFaceOffCardProps> = ({
 match,
 userDisplayName,
 userAvatarUrl,
 isThai,
 isExpanded,
 onToggleExpand,
 onAnalyze,
 surfaceClass = 'bg-[#ffffff] border border-[#000000]/10',
}) => {
 const isWin = match.result === 'win';
 const isDoubles = match.matchType === 'Doubles';
 const userShortName = userDisplayName.split(' ')[0] || (isThai ? 'คุณ' : 'You');
 const partnerShortName = isThai
 ? (match.partnerNameTh || match.partnerName || 'คู่หู')
 : (match.partnerNameEn || match.partnerName || 'Partner');
 const teamALabel = isDoubles ? `${userShortName} & ${partnerShortName}` : userShortName;
 const teamBLabel = isThai
 ? (match.opponent.nameTh || match.opponent.name)
 : (match.opponent.nameEn || match.opponent.name);

 const tierLabel = isThai
 ? match.opponent.tier
 .replace('Diamond League', 'ลีกไดมอนด์')
 .replace('Platinum League', 'ลีกแพลทินัม')
 .replace('Gold League', 'ลีกโกลด์')
 .replace('Silver League', 'ลีกซิลเวอร์')
 .replace('Bronze League', 'ลีกบรอนซ์')
 : match.opponent.tier;

 const scoreDisplay = match.finalScore.replace('-', ':');
 const setSummary = match.scores.map((s) => `${s.userScore}-${s.opponentScore}`).join(' · ');

 return (
 <div className={`rounded-[24px] p-4 space-y-3 shadow-xs transition-all ${surfaceClass}`}>
 {/* Top Row: Date + Format on left, Result Badge on right */}
 <div className="flex items-center justify-between gap-2">
 <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#000000]/60 min-w-0 truncate">
 <Calendar className="w-3 h-3 text-[#000000]/45 shrink-0" />
 <span className="truncate">{isThai ? (match.dateTh || match.date) : (match.dateEn || match.date)}</span>
 </div>
 <span
 className={`px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold shrink-0 whitespace-nowrap ${
 isWin ? 'bg-[#7cd7a0] text-[#000000]' : 'bg-[#e85729] text-[#ffffff]'
 }`}
 >
 {isWin ? (isThai ? 'ชนะ' : 'WIN') : (isThai ? 'แพ้' : 'LOSS')}
 </span>
 </div>

 {/* Centerpiece: Football-Style 2-Sided Matchup */}
 <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 py-1">
 {/* Left Side: User Team */}
 <div className="flex flex-col items-center text-center min-w-0">
 {isDoubles ? (
 <div className="flex items-center justify-center -space-x-2.5">
 <FaceAvatar
 src={userAvatarUrl}
 label={userShortName}
 className="w-10 h-10 z-10"
 accentClass="border-[#ffffff] ring-2 ring-[#7cd7a0] bg-[#e8f7ee]"
 />
 <FaceAvatar
 src={match.partnerAvatar}
 label={partnerShortName}
 className="w-10 h-10"
 accentClass="border-[#ffffff] ring-2 ring-[#7cd7a0] bg-[#e8f7ee]"
 />
 </div>
 ) : (
 <FaceAvatar
 src={userAvatarUrl}
 label={userShortName}
 className="w-12 h-12"
 accentClass="border-[#7cd7a0] bg-[#e8f7ee]"
 />
 )}
 <span className="text-xs font-bold text-[#000000] truncate w-full mt-1.5 leading-snug">
 {teamALabel}
 </span>
 <span className="text-[10px] font-medium text-[#000000]/55 truncate w-full">
 {isThai ? 'ทีมเรา' : 'You'}
 </span>
 </div>

 {/* Center: Clean Scoreboard Pill */}
 <div className="bg-[#f4f8fb] rounded-[20px] px-3.5 py-2 text-center min-w-[96px] flex flex-col items-center justify-center">
 <div className="flex items-center gap-1 text-[9px] font-bold text-[#000000]/65 whitespace-nowrap">
 <span className={`w-1.5 h-1.5 rounded-full ${isWin ? 'bg-[#15803d]' : 'bg-[#e85729]'}`} />
 <span>{isThai ? (isDoubles ? 'ประเภทคู่' : 'ประเภทเดี่ยว') : match.matchType}</span>
 </div>
 <div className="text-2xl font-bold text-[#000000] tabular-nums leading-tight mt-0.5 whitespace-nowrap">
 {scoreDisplay}
 </div>
 <div className="text-[10px] font-semibold text-[#000000]/60 tabular-nums whitespace-nowrap mt-0.5">
 {setSummary}
 </div>
 </div>

 {/* Right Side: Opponent Team */}
 <div className="flex flex-col items-center text-center min-w-0">
 {isDoubles && match.opponent.avatars.length > 1 ? (
 <div className="flex items-center justify-center -space-x-2.5">
 <FaceAvatar
 src={match.opponent.avatars[0]}
 label={teamBLabel}
 className="w-10 h-10 z-10"
 accentClass="border-[#ffffff] ring-1 ring-[#000000]/15 bg-[#f4f8fb]"
 />
 <FaceAvatar
 src={match.opponent.avatars[1]}
 label={teamBLabel}
 className="w-10 h-10"
 accentClass="border-[#ffffff] ring-1 ring-[#000000]/15 bg-[#f4f8fb]"
 />
 </div>
 ) : (
 <FaceAvatar
 src={match.opponent.avatars[0]}
 label={teamBLabel}
 className="w-12 h-12"
 accentClass="border-[#000000]/15 bg-[#f4f8fb]"
 />
 )}
 <span className="text-xs font-bold text-[#000000] truncate w-full mt-1.5 leading-snug">
 {teamBLabel}
 </span>
 <span className="text-[10px] font-medium text-[#000000]/55 truncate w-full">
 {tierLabel}
 </span>
 </div>
 </div>

 {/* Bottom Footer: Venue + Compact Stats Toggle */}
 <div className="pt-2 border-t border-[#000000]/8 flex items-center justify-between gap-2">
 <div className="flex items-center gap-1 text-[10px] font-medium text-[#000000]/60 min-w-0 truncate">
 <MapPin className="w-3 h-3 text-[#e85729] shrink-0" />
 <span className="truncate">{isThai ? (match.courtNameTh || match.courtName) : (match.courtNameEn || match.courtName)}</span>
 </div>
 <button
 type="button"
 onClick={onToggleExpand}
 className="px-2.5 py-1 rounded-[1600px] bg-[#f4f8fb] border border-[#000000]/15 text-[10px] font-bold text-[#000000] flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap hover:bg-[#e9e9e9]"
 >
 <span>{isExpanded ? (isThai ? 'ย่อลง' : 'Hide') : (isThai ? 'ดูสถิติ' : 'Stats')}</span>
 {isExpanded ? <ChevronUp className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />}
 </button>
 </div>

 {/* Expandable Telemetry Drawer */}
 {isExpanded && (
 <div className="p-3 rounded-[18px] bg-[#f4f8fb] space-y-2 text-[10px]">
 <div className="grid grid-cols-3 gap-2 text-center">
 <div className="p-2 rounded-[12px] bg-[#ffffff]">
 <span className="text-[9px] font-bold text-[#000000]/55 block whitespace-nowrap">
 {isThai ? 'สปีดตบ' : 'Top Smash'}
 </span>
 <span className="text-xs font-bold text-[#000000] whitespace-nowrap tabular-nums">
 ⚡ {match.highestSmashKmh} km/h
 </span>
 </div>
 <div className="p-2 rounded-[12px] bg-[#ffffff]">
 <span className="text-[9px] font-bold text-[#000000]/55 block whitespace-nowrap">
 {isThai ? 'เวลาแข่ง' : 'Duration'}
 </span>
 <span className="text-xs font-bold text-[#000000] whitespace-nowrap tabular-nums">
 ⏱️ {match.durationMin} {isThai ? 'นาที' : 'min'}
 </span>
 </div>
 <div className="p-2 rounded-[12px] bg-[#7cd7a0]">
 <span className="text-[9px] font-bold text-[#000000]/70 block whitespace-nowrap">
 {isThai ? 'EXP ที่ได้' : 'EXP'}
 </span>
 <span className="text-xs font-bold text-[#000000] whitespace-nowrap tabular-nums">
 +{match.expGained} EXP
 </span>
 </div>
 </div>
 <div className="p-2 rounded-[12px] bg-[#ffffff] flex items-center justify-between gap-2">
 <div className="flex items-center gap-1.5 min-w-0 flex-1">
 <Sparkles className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
 <span className="truncate font-medium text-[#000000]/80">
 <strong>{isThai ? 'ไฮไลต์:' : 'Highlight:'}</strong>{' '}
 {isThai ? (match.highlightShotTh || match.highlightShot) : (match.highlightShotEn || match.highlightShot)}
 </span>
 </div>
 {onAnalyze && (
 <button
 type="button"
 onClick={onAnalyze}
 className="px-2.5 py-1 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[10px] font-bold hover:bg-[#333333] cursor-pointer active:scale-95 transition-transform whitespace-nowrap shrink-0"
 >
 {isThai ? 'วิเคราะห์ช็อต' : 'Analyze'}
 </button>
 )}
 </div>
 </div>
 )}
 </div>
 );
};

export const F1_UserProfileTrophyScreen: React.FC = () => {
 const { player, navigateTo, booking, gainExp, language } = useApp();
 const isThai = language === 'th';
 const [activeTab, setActiveTab] = useState<'card' | 'matches' | 'trophies' | 'gear'>('card');
 const [isProModalOpen, setIsProModalOpen] = useState(false);
 const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
 avatars: [AVATARS.ohm],
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
 <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28 bg-[#f4f8fb] text-[#000000]">
 <MobileHeader
 rightSlot={
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setIsSettingsOpen(true);
 }}
 className="px-3 py-1.5 rounded-[1600px] bg-[#ffffff] text-[#000000] text-[11px] font-bold whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer hover:bg-[#f4f8fb]"
 >
 <Settings className="w-3.5 h-3.5 shrink-0" />
 <span>{isThai ? 'ตั้งค่า' : 'Settings'}</span>
 </button>
 }
 />

 {/* Segmented Tab Bar (Filter tabs stay clean without heavy CTA borders) */}
 <div data-filter="true" className="px-5 py-3 flex items-center gap-1.5 bg-[#ffffff] shrink-0 overflow-x-auto no-scrollbar">
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
 className={`px-1.5 py-0.5 rounded-full text-[10px] font-black whitespace-nowrap shrink-0 ${
 activeTab === 'matches' ? 'bg-[#7cd7a0] text-[#000000]' : 'bg-[#000000] text-[#ffffff]'
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

 <div className="px-5 pt-4 space-y-4">
 {activeTab === 'card' && (
 <div className="space-y-4 w-full">
 {/* Athlete Identity Card Section */}
 <div className="space-y-1.5 w-full">
 <SectionHeader
 title={isThai ? 'การ์ดข้อมูลนักกีฬา' : 'ATHLETE IDENTITY CARD'}
 badge={isThai ? 'ยืนยันตัวตนแล้ว' : 'SMASH VERIFIED'}
 badgeVariant="dark"
 />
 <div className="w-full rounded-[32px] bg-[#7cd7a0] shadow-sm p-5 text-[#000000]">
 <div className="flex items-center justify-between gap-3">
 <div className="flex items-center gap-3 min-w-0">
 <DoodleAvatar
 preset="karn"
 size="lg"
 ringClass="border-2 border-[#000000] shadow-xs"
 />
 <div className="min-w-0">
 <h3 className="text-xl font-bold text-[#000000] leading-snug truncate">
 {isThai ? (player.nameTh || 'กานต์ ธนวัฒน์') : (player.nameEn || 'Karn Tanawat')}
 </h3>
 <p className="text-xs text-[#000000]/75 font-medium truncate">
 {isThai ? (player.playstyleTh || 'สายบุกตบสแมชดุดัน') : (player.playstyleEn || player.playstyle)}
 </p>
 <span className="inline-block mt-1 px-2.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[10px] font-bold whitespace-nowrap">
 {isThai ? 'ลีกไดมอนด์' : 'DIAMOND LEAGUE'}
 </span>
 </div>
 </div>

 <div className="text-right shrink-0">
 <div className="text-4xl font-bold leading-none tabular-nums text-[#000000]">
 85
 </div>
 <div className="text-[10px] font-bold text-[#000000]/70 mt-1 whitespace-nowrap">
 {isThai ? 'คะแนนรวม' : 'OVR RATING'}
 </div>
 </div>
 </div>

 {/* Stat Pills */}
 <div className="grid grid-cols-3 gap-2 mt-4 text-center">
 <div className="p-2.5 rounded-[16px] bg-[#ffffff] shadow-xs">
 <div className="text-[10px] font-bold text-[#000000]/60 whitespace-nowrap">
 {isThai ? 'พลังตบ' : 'POW'}
 </div>
 <div className="text-lg font-bold text-[#000000] tabular-nums leading-tight mt-0.5">
 {player.skillRadar.power}
 </div>
 </div>
 <div className="p-2.5 rounded-[16px] bg-[#ffffff] shadow-xs">
 <div className="text-[10px] font-bold text-[#000000]/60 whitespace-nowrap">
 {isThai ? 'ความเร็ว' : 'SPD'}
 </div>
 <div className="text-lg font-bold text-[#000000] tabular-nums leading-tight mt-0.5">
 {player.skillRadar.speed}
 </div>
 </div>
 <div className="p-2.5 rounded-[16px] bg-[#ffffff] shadow-xs">
 <div className="text-[10px] font-bold text-[#000000]/60 whitespace-nowrap">
 {isThai ? 'คุมลูก' : 'CTL'}
 </div>
 <div className="text-lg font-bold text-[#000000] tabular-nums leading-tight mt-0.5">
 {player.skillRadar.control}
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* PAST MATCH RESULTS Section */}
 <div className="space-y-1.5 w-full">
 <SectionHeader
 title={isThai ? 'ประวัติการแข่งขัน' : 'PAST MATCHES'}
 subtitle={isThai ? 'บันทึกผลการแข่งขันล่าสุดและสถิติคอร์ท' : 'Recent match results & court stats'}
 rightSlot={
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveTab('matches');
 }}
 className="px-2.5 py-1 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] text-[10px] font-bold uppercase tracking-[0.032em] flex items-center gap-1 hover:bg-[#333333] cursor-pointer shadow-xs active:scale-95 transition-all whitespace-nowrap shrink-0"
 >
 <span>{isThai ? 'ดูทั้งหมด' : 'See all'}</span>
 <ChevronRight className="w-3 h-3 shrink-0" />
 </button>
 }
 />

 <div className="w-full p-4 rounded-[28px] bg-[#ffffff] space-y-3 shadow-sm">
 {/* Quick Stats Strip */}
 <div className="grid grid-cols-3 gap-2 text-center">
 <div className="p-2 rounded-[16px] bg-[#f4f8fb]">
 <div className="text-[9px] font-bold uppercase text-[#000000]/60 whitespace-nowrap">
 {isThai ? 'อัตราชนะ' : 'WIN RATE'}
 </div>
 <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000] leading-tight tabular-nums whitespace-nowrap">
 {winRatePercentage}%
 </div>
 <div className="text-[9px] text-[#000000]/70 font-semibold whitespace-nowrap">
 {isThai ? `ชนะ ${winsCount} · แพ้ ${totalMatchesCount - winsCount}` : `${winsCount}W · ${totalMatchesCount - winsCount}L`}
 </div>
 </div>
 <div className="p-2 rounded-[16px] bg-[#7cd7a0]">
 <div className="text-[9px] font-bold uppercase text-[#000000]/70 whitespace-nowrap">
 {isThai ? 'EXP รวม' : 'TOTAL EXP'}
 </div>
 <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000] leading-tight tabular-nums whitespace-nowrap">
 +{totalExpFromMatches}
 </div>
 <div className="text-[9px] text-[#000000]/80 font-semibold whitespace-nowrap">
 {totalMatchesCount} {isThai ? 'แมตช์' : 'Matches'}
 </div>
 </div>
 <div className="p-2 rounded-[16px] bg-[#f4f8fb]">
 <div className="text-[9px] font-bold uppercase text-[#000000]/60 whitespace-nowrap">
 {isThai ? 'สปีดตบสูงสุด' : 'TOP SMASH'}
 </div>
 <div className="font-['Antonio',sans-serif] text-lg font-black text-[#000000] leading-tight tabular-nums whitespace-nowrap">
 {Math.max(...matches.map((m) => m.highestSmashKmh))} km/h
 </div>
 <div className="text-[9px] text-[#15803d] font-bold whitespace-nowrap">
 {isThai ? 'สถิติความเร็ว' : 'Speed Record'}
 </div>
 </div>
 </div>

 {/* Football-Style Match Face-Off Cards */}
 <div className="space-y-3 pt-1">
 {matches.slice(0, 3).map((match) => (
 <MatchFaceOffCard
 key={match.id}
 match={match}
 userDisplayName={isThai ? (player.nameTh || 'กานต์ ธนวัฒน์') : (player.nameEn || 'Karn Tanawat')}
 userAvatarUrl={player.avatarUrl}
 isThai={isThai}
 isExpanded={expandedMatchId === match.id}
 onToggleExpand={() => {
 playSelectSound();
 setExpandedMatchId(expandedMatchId === match.id ? null : match.id);
 }}
 onAnalyze={() => navigateTo('C3')}
 surfaceClass="bg-[#f8fbff] border border-[#000000]/8"
 />
 ))}
 </div>

 {/* Action: Simulate New Match Button */}
 <div className="pt-1 flex items-center gap-2">
 <button
 type="button"
 onClick={handleSimulateNewMatch}
 className="flex-1 py-2.5 px-3 rounded-[1600px] bg-[#7cd7a0] border border-[#000000] text-xs font-bold uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 hover:bg-[#6ecb93] active:scale-95 transition-transform cursor-pointer text-[#000000] whitespace-nowrap"
 >
 <Plus className="w-3.5 h-3.5 text-[#000000] shrink-0" />
 <span className="whitespace-nowrap">{isThai ? 'จำลองบันทึกผลแข่งใหม่' : 'Simulate New Match'}</span>
 </button>
 </div>
 </div>
 </div>

 {/* My Active Booking Pass Section */}
 <div className="space-y-1.5 w-full">
 <SectionHeader
 title={isThai ? 'บัตรเข้าคอร์ทของฉัน' : 'MY ACTIVE PASS'}
 badge={isThai ? 'พร้อมใช้งาน' : 'READY'}
 badgeVariant="green"
 />
 <div
 onClick={() => navigateTo('B4')}
 className="doodle-cta w-full p-4 rounded-[28px] bg-[#ffffff] cursor-pointer hover:bg-[#e8f7ee] transition-all flex items-center justify-between gap-3"
 >
 <div className="flex items-center gap-3 min-w-0 flex-1">
 <div className="w-10 h-10 rounded-[1600px] bg-[#7cd7a0] flex items-center justify-center font-bold text-[#000000] shrink-0">
 <QrCode className="w-5 h-5" />
 </div>
 <div className="min-w-0 flex-1">
 <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000] truncate">
 {booking.court?.name || 'สแมช อารีน่า พระราม 9'}
 </div>
 <div className="text-[10px] text-[#000000]/70 font-bold truncate">
 {isThai ? `คอร์ท ${booking.selectedCourtNumber || 3} · แสดง QR เพื่อเปิดไฟสนาม` : `Court ${booking.selectedCourtNumber || 3} · Scan QR at check-in`}
 </div>
 </div>
 </div>
 <ChevronRight className="w-4 h-4 text-[#000000] shrink-0" />
 </div>
 </div>

 {/* Wearable Sync Section */}
 <div className="space-y-1.5 w-full">
 <SectionHeader
 title={isThai ? 'เชื่อมต่ออุปกรณ์สวมใส่' : 'SMART WEARABLE'}
 badge="164 BPM · 480 kcal"
 badgeVariant="soft"
 />
 <div
 onClick={() => navigateTo('F2')}
 className="doodle-cta w-full p-4 rounded-[28px] bg-[#ffffff] cursor-pointer hover:bg-[#e8f7ee] transition-all flex items-center justify-between gap-3"
 >
 <div className="flex items-center gap-3 min-w-0 flex-1">
 <div className="w-10 h-10 rounded-[1600px] bg-[#7cd7a0] flex items-center justify-center font-bold text-[#000000] shrink-0">
 <Watch className="w-5 h-5" />
 </div>
 <div className="min-w-0 flex-1">
 <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000] truncate">
 APPLE WATCH & GARMIN SYNC
 </div>
 <div className="text-[10px] text-[#000000]/70 font-bold truncate">
 {isThai ? 'ซิงค์ชีพจรและเผาผลาญแคลอรี่เป็นแต้ม EXP' : 'Sync heart rate & calories to EXP'}
 </div>
 </div>
 </div>
 <ChevronRight className="w-4 h-4 text-[#000000] shrink-0" />
 </div>
 </div>

 {/* Edit DNA & Settings Section */}
 <div className="space-y-1.5 w-full">
 <SectionHeader
 title={isThai ? 'ตั้งค่าความถนัดนักกีฬา' : 'PLAYSTYLE DNA'}
 badge={isThai ? 'แก้ไขได้' : 'EDITABLE'}
 badgeVariant="soft"
 />
 <div
 onClick={() => navigateTo('A2')}
 className="doodle-cta w-full p-4 rounded-[28px] bg-[#ffffff] cursor-pointer hover:bg-[#e9e9e9] transition-all flex items-center justify-between gap-3"
 >
 <div className="flex items-center gap-3 min-w-0 flex-1">
 <div className="w-10 h-10 rounded-[1600px] bg-[#e8f7ee] flex items-center justify-center font-bold text-[#000000] shrink-0">
 <UserCog className="w-5 h-5" />
 </div>
 <div className="min-w-0 flex-1">
 <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000] truncate">
 {isThai ? 'แก้ไขสไตล์การเล่น & มือถนัด' : 'Edit Athlete DNA & Playstyle'}
 </div>
 <div className="text-[10px] text-[#000000]/70 font-bold truncate">
 {isThai ? 'ปรับสายตบ, มือกุมแร็กเก็ต, และเป้าหมายฝึกฝน' : 'Customize playstyle, grip hand, and goals'}
 </div>
 </div>
 </div>
 <ChevronRight className="w-4 h-4 text-[#000000] shrink-0" />
 </div>
 </div>

 {/* App Settings & Language Card */}
 <div className="space-y-1.5 w-full">
 <SectionHeader
 title={isThai ? 'ตั้งค่าแอป & ภาษา' : 'APP SETTINGS & LANGUAGE'}
 badge={language.toUpperCase()}
 badgeVariant="dark"
 />
 <div
 onClick={() => {
 playSelectSound();
 setIsSettingsOpen(true);
 }}
 className="doodle-cta w-full p-4 rounded-[28px] bg-[#ffffff] cursor-pointer hover:bg-[#e8f7ee] transition-all flex items-center justify-between gap-3"
 >
 <div className="flex items-center gap-3 min-w-0 flex-1">
 <div className="w-10 h-10 rounded-[1600px] bg-[#f4f8fb] border border-[#000000] flex items-center justify-center font-bold text-[#000000] shrink-0">
 <Settings className="w-5 h-5" />
 </div>
 <div className="min-w-0 flex-1">
 <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000] truncate">
 {isThai ? 'เปลี่ยนภาษา TH/EN & เสียงเอฟเฟกต์' : 'Language TH/EN & Sound Settings'}
 </div>
 <div className="text-[10px] text-[#000000]/70 font-bold truncate">
 {isThai ? 'สลับภาษาไทย-อังกฤษ ตั้งค่าเสียงและการซิงค์ออฟไลน์' : 'Switch language, retro audio & offline sync'}
 </div>
 </div>
 </div>
 <ChevronRight className="w-4 h-4 text-[#000000] shrink-0" />
 </div>
 </div>

 {/* Pro Membership Section */}
 <div className="space-y-1.5 w-full">
 <SectionHeader
 title="SMASH PRO MEMBER"
 badge={isThai ? '฿199 / เดือน' : '฿199 / MO'}
 badgeVariant="orange"
 />
 <div
 onClick={() => {
 setIsProModalOpen(true);
 playCoinSound();
 }}
 className="doodle-cta w-full p-4 rounded-[28px] bg-[#7cd7a0] cursor-pointer hover:bg-[#6ecb93] transition-all flex items-center justify-between gap-3"
 >
 <div className="flex items-center gap-3 min-w-0 flex-1">
 <div className="w-10 h-10 rounded-[1600px] bg-[#000000] text-[#e85729] flex items-center justify-center font-bold shrink-0">
 <Crown className="w-5 h-5" />
 </div>
 <div className="min-w-0 flex-1">
 <div className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000] truncate">
 {isThai ? 'สิทธิพิเศษสมาชิก PRO' : 'PRO ATHLETE PERKS'}
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

 {/* Quick Action Buttons */}
 <div className="w-full grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => navigateTo('D1')}
 className="p-3 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#ffffff] text-[#000000] border border-[#000000] hover:bg-[#e9e9e9] whitespace-nowrap"
 >
 <Crosshair className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
 <span>{isThai ? 'เรดาร์โค้ช AI' : 'COACH RADAR'}</span>
 </button>
 <button
 type="button"
 onClick={() => navigateTo('B1')}
 className="p-3 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-[#000000] text-[#ffffff] border border-[#000000] hover:bg-[#1a1a1a] whitespace-nowrap"
 >
 <Calendar className="w-3.5 h-3.5 shrink-0" />
 <span>{isThai ? 'จองสนามแบด' : 'BOOK COURTS'}</span>
 </button>
 </div>
 </div>
 )}

 {/* DEDICATED FULL TAB: ผลการแข่ง (MATCHES) */}
 {activeTab === 'matches' && (
 <div className="space-y-4">
 {/* Summary Section */}
 <div className="space-y-1.5">
 <SectionHeader
 title={isThai ? 'ประวัติผลการแข่งขันทั้งหมด' : 'ALL MATCH HISTORY'}
 subtitle={isThai ? 'แมตช์ที่บันทึกในระบบ' : 'Recorded matches in system'}
 rightSlot={
 <button
 type="button"
 onClick={handleSimulateNewMatch}
 className="px-3 py-1.5 rounded-[1600px] bg-[#7cd7a0] text-[#000000] border border-[#000000] text-xs font-black uppercase tracking-wide flex items-center gap-1 hover:bg-[#46c288] active:scale-95 transition-transform cursor-pointer shadow-xs whitespace-nowrap shrink-0"
 >
 <Plus className="w-3.5 h-3.5 shrink-0" />
 <span>{isThai ? 'เพิ่มผลแข่ง' : 'Add Match'}</span>
 </button>
 }
 />

 <div className="p-4 rounded-[28px] bg-[#ffffff] shadow-sm space-y-3">
 {/* Big Stat Summary */}
 <div className="grid grid-cols-4 gap-2 text-center">
 <div className="p-2 rounded-[16px] bg-[#f4f8fb]">
 <div className="text-[8px] font-bold uppercase text-[#000000]/60 whitespace-nowrap">{isThai ? 'ทั้งหมด' : 'TOTAL'}</div>
 <div className="font-['Antonio',sans-serif] text-xl font-black text-[#000000] tabular-nums">{matches.length}</div>
 </div>
 <div className="p-2 rounded-[16px] bg-[#7cd7a0]/30">
 <div className="text-[8px] font-bold uppercase text-[#000000]/60 whitespace-nowrap">{isThai ? 'ชนะ' : 'WINS'}</div>
 <div className="font-['Antonio',sans-serif] text-xl font-black text-[#000000] tabular-nums">{winsCount}</div>
 </div>
 <div className="p-2 rounded-[16px] bg-[#e85729]/20">
 <div className="text-[8px] font-bold uppercase text-[#000000]/60 whitespace-nowrap">{isThai ? 'แพ้' : 'LOSSES'}</div>
 <div className="font-['Antonio',sans-serif] text-xl font-black text-[#000000] tabular-nums">
 {matches.length - winsCount}
 </div>
 </div>
 <div className="p-2 rounded-[16px] bg-[#7cd7a0]">
 <div className="text-[8px] font-bold uppercase text-[#000000]/70 whitespace-nowrap">WIN RATE</div>
 <div className="font-['Antonio',sans-serif] text-xl font-black text-[#000000] tabular-nums">{winRatePercentage}%</div>
 </div>
 </div>

 {/* Filter Pills */}
 <div data-filter="true" className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
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
 className={`px-3 py-1 rounded-[1600px] text-[10px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap shrink-0 cursor-pointer ${
 matchFilter === f.id
 ? 'bg-[#000000] text-[#ffffff] border-[#000000]'
 : 'bg-[#ffffff] text-[#000000] border-[#000000] hover:bg-[#e9e9e9]'
 }`}
 >
 {f.label}
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Match List */}
 <div className="space-y-3">
 {filteredMatches.length === 0 ? (
 <div className="p-8 text-center bg-[#ffffff] rounded-[28px] shadow-sm">
 <p className="text-xs font-bold text-[#000000]/60">ไม่พบข้อมูลแมตช์ในหมวดหมู่นี้</p>
 </div>
 ) : (
 filteredMatches.map((match) => (
 <MatchFaceOffCard
 key={match.id}
 match={match}
 userDisplayName={isThai ? (player.nameTh || 'กานต์ ธนวัฒน์') : (player.nameEn || 'Karn Tanawat')}
 userAvatarUrl={player.avatarUrl}
 isThai={isThai}
 isExpanded={expandedMatchId === match.id}
 onToggleExpand={() => {
 playSelectSound();
 setExpandedMatchId(expandedMatchId === match.id ? null : match.id);
 }}
 onAnalyze={() => navigateTo('C3')}
 surfaceClass="bg-[#ffffff] shadow-sm"
 />
 ))
 )}
 </div>
 </div>
 )}

 {activeTab === 'trophies' && (
 <div className="space-y-3">
 <SectionHeader
 title={isThai ? 'ตู้เหรียญรางวัลเกียรติยศ' : 'TROPHY & BADGE CASE'}
 badge={`${player.badges.filter((b) => b.unlocked).length}/${player.badges.length}`}
 badgeVariant="green"
 />
 <div className="grid grid-cols-2 gap-3">
 {player.badges.map((b) => (
 <div
 key={b.id}
 className={`p-4 rounded-[28px] shadow-sm transition-all flex flex-col justify-between ${
 b.unlocked ? 'bg-[#ffffff]' : 'bg-[#cccccc]/40 opacity-70'
 }`}
 >
 <div>
 <div className="flex items-center justify-between gap-2 mb-2">
 <div className="w-10 h-10 rounded-[1600px] bg-[#7cd7a0] text-[#000000] flex items-center justify-center font-bold shadow-xs shrink-0">
 <Award className="w-5 h-5" />
 </div>
 <span className="text-[9px] font-bold uppercase tracking-[0.032em] px-2.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] shadow-xs whitespace-nowrap shrink-0">
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
 <span className={b.unlocked ? 'text-[#000000] whitespace-nowrap' : 'text-[#000000]/50 whitespace-nowrap'}>
 {b.unlocked ? (isThai ? '✓ ปลดล็อก (+100 EXP)' : '✓ Unlocked (+100 EXP)') : `${b.progress}/${b.maxProgress}`}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {activeTab === 'gear' && (
 <div className="space-y-1.5">
 <SectionHeader
 title={isThai ? 'สเปกอุปกรณ์ไม้แบด' : 'RACKET & STRING SPEC'}
 badge="PRO SETUP"
 badgeVariant="green"
 />
 <div className="p-5 rounded-[28px] bg-[#ffffff] shadow-sm space-y-2.5">
 <div className="p-3 rounded-[20px] bg-[#f4f8fb] flex items-center justify-between gap-2">
 <span className="text-xs text-[#000000]/70 font-bold whitespace-nowrap">{isThai ? 'รุ่นไม้แบด:' : 'Racket Model:'}</span>
 <span className="text-xs font-bold font-mono truncate">{player.racket.model}</span>
 </div>
 <div className="p-3 rounded-[20px] bg-[#f4f8fb] flex items-center justify-between gap-2">
 <span className="text-xs text-[#000000]/70 font-bold whitespace-nowrap">{isThai ? 'น้ำหนัก / กริป:' : 'Weight / Grip:'}</span>
 <span className="text-xs font-bold font-mono whitespace-nowrap">{player.racket.weightGrip}</span>
 </div>
 <div className="p-3 rounded-[20px] bg-[#f4f8fb] flex items-center justify-between gap-2">
 <span className="text-xs text-[#000000]/70 font-bold whitespace-nowrap">{isThai ? 'ความตึงเอ็น:' : 'Tension:'}</span>
 <span className="text-xs font-bold text-[#15803d] font-mono whitespace-nowrap">{player.racket.stringTension}</span>
 </div>
 <div className="p-3 rounded-[20px] bg-[#f4f8fb] flex items-center justify-between gap-2">
 <span className="text-xs text-[#000000]/70 font-bold whitespace-nowrap">{isThai ? 'ประเภทเอ็น:' : 'String Type:'}</span>
 <span className="text-xs font-bold truncate">{player.racket.stringType}</span>
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
 <AppSettingsModal
 isOpen={isSettingsOpen}
 onClose={() => setIsSettingsOpen(false)}
 />
 </div>
 );
};
