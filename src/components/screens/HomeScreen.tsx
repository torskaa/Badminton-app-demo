import React, { useState } from 'react';
import {
 QrCode,
 Search,
 Wallet,
 Calendar,
 MapPin,
 Star,
 ChevronRight,
 ArrowRight,
 RotateCw,
 Sparkles,
 Zap,
 Flame,
 Users,
 Compass,
 Trophy,
 Tag,
 ThumbsUp,
 X,
 Filter,
 CheckCircle2,
 Clock,
 Shield,
 Layers,
 Heart,
 Bell,
 Footprints,
 Play,
 SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourtFacility } from '../../types';
import { playCoinSound, playSelectSound, playSmashSound } from '../../utils/retroAudio';
import { EnergyMoodModal, MoodEnergyLevel, MOOD_LEVELS } from '../common/EnergyMoodModal';
import { ProgressRingsWidget } from '../common/ProgressRingsWidget';
import { WeeklyCalendarWidget } from '../common/WeeklyCalendarWidget';
import { WorkoutDetailModal, WorkoutDetailData } from '../common/WorkoutDetailModal';
import { SectionHeader } from '../common/SectionHeader';
import { DoodleAvatar } from '../common/DoodleAvatar';

// Workouts mapped to energy levels (VibeMove style)
const WORKOUT_SESSIONS_MAP: Record<MoodEnergyLevel, WorkoutDetailData> = {
 energized: {
 id: 'wk_energized_1',
 title: 'Strength & Jump Smash 340+ km/h',
 titleTh: 'พาวเวอร์สแมชความเร็วสูง 340+ km/h',
 titleEn: 'Strength & Jump Smash 340+ km/h',
 subtitle: 'เจาะลึกจังหวะเทคตัวกระโดดตบสแมช และเร่งสปีดโต้กลับเร็วในแดนหน้า เหมาะกับผู้เล่นสายบุก',
 subtitleTh: 'เจาะลึกจังหวะเทคตัวกระโดดตบสแมช และเร่งสปีดโต้กลับเร็วในแดนหน้า เหมาะกับผู้เล่นสายบุก',
 subtitleEn: 'Master explosive jump smash mechanics and rapid net intercepts for aggressive attacking players.',
 category: 'Smash Hunter',
 schedule: 'Today, 19:30 - 21:00',
 scheduleTh: 'วันนี้ 19:30 - 21:00 น.',
 scheduleEn: 'Today, 19:30 - 21:00',
 intensity: 'High',
 intensityLabel: 'High intensity',
 intensityLabelTh: 'ความหนักระดับสูง',
 intensityLabelEn: 'High intensity',
 tags: ['Energizing', 'Power', 'Smash Hunter', 'Diamond'],
 tagsTh: ['พลังเต็ม', 'สายตบ', 'นักกีฬาลีก', 'สปีดเร็ว'],
 tagsEn: ['Energizing', 'Power', 'Smash Hunter', 'Diamond'],
 trainerName: 'โค้ชกานต์ (OVR 85)',
 trainerRole: 'National Certified Coach · Diamond Rank',
 trainerRoleTh: 'โค้ชระดับประเทศ · ระดับไดมอนด์',
 trainerRoleEn: 'National Certified Coach · Diamond Rank',
 trainerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
 courtName: 'คอร์ท 3 สแมช อารีน่า พระราม 9',
 courtNameTh: 'คอร์ท 3 สแมช อารีน่า พระราม 9',
 courtNameEn: 'Court 3 Smash Arena Rama 9',
 videoPreviewUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=700&auto=format&fit=crop&q=80',
 rating: '4.9',
 caloriesBurnEstimate: 620,
 durationMin: 90,
 },
 calm: {
 id: 'wk_calm_1',
 title: 'Flow Rally & Net Placement',
 titleTh: 'แรลลี่ผ่อนคลายและวางลูกหน้าเน็ต',
 titleEn: 'Flow Rally & Net Placement',
 subtitle: 'เน้นตีประคอง 30 ช็อตต่อเนื่อง ควบคุมวิถีลูกหยอดและลูกตัดเลียดเน็ต ไร้ความกดดันด้านแต้ม',
 subtitleTh: 'เน้นตีประคอง 30 ช็อตต่อเนื่อง ควบคุมวิถีลูกหยอดและลูกตัดเลียดเน็ต ไร้ความกดดันด้านแต้ม',
 subtitleEn: 'Focus on 30 continuous relaxed rallies, smooth drop shots, and mindful court movement.',
 category: 'Mindful Flow',
 schedule: 'Today, 18:00 - 19:30',
 scheduleTh: 'วันนี้ 18:00 - 19:30 น.',
 scheduleEn: 'Today, 18:00 - 19:30',
 intensity: 'Low',
 intensityLabel: 'Low intensity',
 intensityLabelTh: 'ความหนักเบา',
 intensityLabelEn: 'Low intensity',
 tags: ['Calm', 'Mindful', 'Rally Flow', 'Drop Shot'],
 tagsTh: ['ผ่อนคลาย', 'สมาธิ', 'แรลลี่ยาว', 'ลูกหยอด'],
 tagsEn: ['Calm', 'Mindful', 'Rally Flow', 'Drop Shot'],
 trainerName: 'ครูแพรว (Certified Trainer)',
 trainerRole: 'Badminton Yoga Specialist',
 trainerRoleTh: 'ผู้เชี่ยวชาญโยคะแบดมินตัน',
 trainerRoleEn: 'Badminton Yoga Specialist',
 trainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
 courtName: 'คอร์ท 4 ติดแอร์ วินเนอร์ อารีน่า',
 courtNameTh: 'คอร์ท 4 ติดแอร์ วินเนอร์ อารีน่า',
 courtNameEn: 'Court 4 Air-Con Winner Arena',
 videoPreviewUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&auto=format&fit=crop&q=80',
 rating: '4.8',
 caloriesBurnEstimate: 320,
 durationMin: 75,
 },
 balanced: {
 id: 'wk_balanced_1',
 title: 'Tactical Mixed Doubles & Core Footwork',
 titleTh: 'แท็กติกเกมคู่ผสมและฟุตเวิร์ก 6 มุม',
 titleEn: 'Tactical Mixed Doubles & Core Footwork',
 subtitle: 'เกมคู่ผสมมาตรฐาน ฝึกการยืนตำแหน่ง การส่งสัญญาณ และจังหวะสลับเกมรับเป็นเกมบุก',
 subtitleTh: 'เกมคู่ผสมมาตรฐาน ฝึกการยืนตำแหน่ง การส่งสัญญาณ และจังหวะสลับเกมรับเป็นเกมบุก',
 subtitleEn: 'Standard mixed doubles positioning, team rotation, and tactical transitions.',
 category: 'Tactical Doubles',
 schedule: 'Today, 19:00 - 20:30',
 scheduleTh: 'วันนี้ 19:00 - 20:30 น.',
 scheduleEn: 'Today, 19:00 - 20:30',
 intensity: 'Medium',
 intensityLabel: 'Medium intensity',
 intensityLabelTh: 'ความหนักปานกลาง',
 intensityLabelEn: 'Medium intensity',
 tags: ['Balanced', 'Doubles', 'Footwork', 'Tactics'],
 tagsTh: ['สมดุล', 'เกมคู่', 'ฟุตเวิร์ก', 'แท็กติก'],
 tagsEn: ['Balanced', 'Doubles', 'Footwork', 'Tactics'],
 trainerName: 'โค้ชอาร์ท & ท็อป',
 trainerRole: 'Ex-Regional Champions',
 trainerRoleTh: 'อดีตแชมป์ระดับภาค',
 trainerRoleEn: 'Ex-Regional Champions',
 trainerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
 courtName: 'คอร์ท 2 ลาดพร้าวสปอร์ต',
 courtNameTh: 'คอร์ท 2 ลาดพร้าวสปอร์ต',
 courtNameEn: 'Court 2 Ladprao Sports',
 videoPreviewUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&auto=format&fit=crop&q=80',
 rating: '4.9',
 caloriesBurnEstimate: 480,
 durationMin: 90,
 },
 high_energy: {
 id: 'wk_high_1',
 title: 'Beast Mode Cardio & AI Speed Drills',
 titleTh: 'บีสต์โหมดคาร์ดิโอและสปีด AI เผาผลาญ 700 kcal',
 titleEn: 'Beast Mode Cardio & AI Speed Drills',
 subtitle: 'ซ้อมฟุตเวิร์ก 6 มุมด้วยระบบ AI สปีด 100% วิ่งไล่ลูกไม่ยั้ง เบิร์นไขมันเต็มเหนี่ยว',
 subtitleTh: 'ซ้อมฟุตเวิร์ก 6 มุมด้วยระบบ AI สปีด 100% วิ่งไล่ลูกไม่ยั้ง เบิร์นไขมันเต็มเหนี่ยว',
 subtitleEn: 'High intensity AI footwork drills, maximum court coverage, and massive 700+ kcal burn.',
 category: 'Beast Mode',
 schedule: 'Today, 20:30 - 22:00',
 scheduleTh: 'วันนี้ 20:30 - 22:00 น.',
 scheduleEn: 'Today, 20:30 - 22:00',
 intensity: 'High',
 intensityLabel: 'Peak intensity',
 intensityLabelTh: 'ขีดสุดสมรรถนะ',
 intensityLabelEn: 'Peak intensity',
 tags: ['High Energy', '700 kcal', 'AI Footwork', 'Cardio'],
 tagsTh: ['บีสต์โหมด', 'เผาผลาญหนัก', 'สปีด AI', 'คาร์ดิโอ'],
 tagsEn: ['High Energy', '700 kcal', 'AI Footwork', 'Cardio'],
 trainerName: 'Smash AI Official Coach',
 trainerRole: 'Automated Real-time Sensor Coach',
 trainerRoleTh: 'โค้ชระบบเซนเซอร์ AI แบบเรียลไทม์',
 trainerRoleEn: 'Automated Real-time Sensor Coach',
 trainerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
 courtName: 'คอร์ท 1 พื้นยาง BWF',
 courtNameTh: 'คอร์ท 1 พื้นยาง BWF',
 courtNameEn: 'Court 1 BWF Taraflex',
 videoPreviewUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&auto=format&fit=crop&q=80',
 rating: '5.0',
 caloriesBurnEstimate: 720,
 durationMin: 90,
 },
 tense: {
 id: 'wk_tense_1',
 title: 'Badminton Mobility & Shoulder Recovery',
 titleTh: 'ยืดเหยียดผ่อนคลายและฟื้นฟูกล้ามเนื้อ',
 titleEn: 'Badminton Mobility & Shoulder Recovery',
 subtitle: 'คลายกล้ามเนื้อสะบัก ไหล่ และข้อมือ ด้วยท่ายืดเฉพาะทางของนักแบดมินตันอาชีพ',
 subtitleTh: 'คลายกล้ามเนื้อสะบัก ไหล่ และข้อมือ ด้วยท่ายืดเฉพาะทางของนักแบดมินตันอาชีพ',
 subtitleEn: 'Release muscle tightness in shoulders and wrists with pro mobility routines.',
 category: 'Mobility & Recovery',
 schedule: 'Today, 18:30 - 19:30',
 scheduleTh: 'วันนี้ 18:30 - 19:30 น.',
 scheduleEn: 'Today, 18:30 - 19:30',
 intensity: 'Low',
 intensityLabel: 'Recovery',
 intensityLabelTh: 'ฟื้นฟูกล้ามเนื้อ',
 intensityLabelEn: 'Recovery',
 tags: ['Recovery', 'Stretching', 'Mobility', 'Flexibility'],
 tagsTh: ['ฟื้นฟู', 'ยืดเหยียด', 'กล้ามเนื้อ', 'ผ่อนคลาย'],
 tagsEn: ['Recovery', 'Stretching', 'Mobility', 'Flexibility'],
 trainerName: 'แอนนา (Sports Physiotherapist)',
 trainerRole: 'Badminton Recovery Specialist',
 trainerRoleTh: 'นักกายภาพบำบัดกีฬาแบดมินตัน',
 trainerRoleEn: 'Badminton Recovery Specialist',
 trainerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
 courtName: 'สตูดิโอ 2 วินเนอร์ อารีน่า',
 courtNameTh: 'สตูดิโอ 2 วินเนอร์ อารีน่า',
 courtNameEn: 'Studio 2 Winner Arena',
 videoPreviewUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&auto=format&fit=crop&q=80',
 rating: '4.9',
 caloriesBurnEstimate: 210,
 durationMin: 60,
 },
};

export const HomeScreen: React.FC = () => {
 const {
 player,
 courts,
 setSelectedCourt,
 updateBooking,
 navigateTo,
 t,
 language,
 simulateDataFetch,
 gainExp,
 triggerSampleInvite,
 triggerSampleBookingConfirmation,
 triggerSampleCountdownAlert,
 triggerSamplePartyUpdate,
 } = useApp();
 const isThai = language === 'th';

 // Search & Suggestions State
 const [searchQuery, setSearchQuery] = useState('');
 const [isSearchSuggestionsOpen, setIsSearchSuggestionsOpen] = useState(false);

 // VibeMove State
 const [isEnergyModalOpen, setIsEnergyModalOpen] = useState(false);
 const [currentMood, setCurrentMood] = useState<MoodEnergyLevel>('energized');
 const [isWorkoutDetailOpen, setIsWorkoutDetailOpen] = useState(false);
 const [showAllCategories, setShowAllCategories] = useState(false);

 // View Sub-tab: 'today' | 'schedule' | 'courts'
 const [activeSubTab, setActiveSubTab] = useState<'today' | 'schedule' | 'courts'>('today');

 // Favorites
 const [favoriteCourtIds, setFavoriteCourtIds] = useState<string[]>(['court_1']);
 const [isHeroWorkoutFavorited, setIsHeroWorkoutFavorited] = useState(false);

 // Live countdown
 const [countdownSeconds, setCountdownSeconds] = useState(2538);
 React.useEffect(() => {
 const timer = setInterval(() => {
 setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 3600));
 }, 1000);
 return () => clearInterval(timer);
 }, []);

 const formatCountdown = (totalSec: number) => {
 const mins = Math.floor(totalSec / 60);
 const secs = totalSec % 60;
 return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
 };

 const activeMoodConfig = MOOD_LEVELS.find((m) => m.id === currentMood) || MOOD_LEVELS[3];
 const currentWorkout = WORKOUT_SESSIONS_MAP[currentMood] || WORKOUT_SESSIONS_MAP.energized;

 const handleToggleFavoriteCourt = (e: React.MouseEvent, courtId: string) => {
 e.stopPropagation();
 playCoinSound();
 setFavoriteCourtIds((prev) =>
 prev.includes(courtId) ? prev.filter((id) => id !== courtId) : [...prev, courtId]
 );
 };

 const handleSelectCourt = (court: CourtFacility) => {
 setSelectedCourt(court);
 updateBooking({ court, selectedCourtNumber: 1 });
 navigateTo('B2');
 };

 // 8 Services Matrix (Grid 4x2) per design.md specification
  const servicesMatrix = [
    { id: 'srv_courts', label: 'Find Courts', thai: 'ค้นหาสนาม', icon: '🏸', screen: 'MAP', color: 'bg-[#7cd7a0]' },
    { id: 'srv_groups', label: 'Find Groups', thai: 'หาก๊วน', icon: '👥', screen: 'E1', color: 'bg-[#7cd7a0]', badge: '28' },
    { id: 'srv_create', label: 'Create Party', thai: 'สร้างก๊วน', icon: '➕', screen: 'E2', color: 'bg-[#7cd7a0]' },
    { id: 'srv_tools', label: 'Club Tools', thai: 'กล่องเครื่องมือ', icon: '🛠️', screen: 'CLUB_TOOLS', color: 'bg-[#e8f7ee]', badge: 'HOT' },
    { id: 'srv_coach', label: 'Find Coach', thai: 'หาโค้ชสอน', icon: '🎯', screen: 'D1', color: 'bg-[#7cd7a0]' },
    { id: 'srv_tourn', label: 'Tournaments', thai: 'ทัวร์นาเมนต์', icon: '🏆', screen: 'E4', color: 'bg-[#7cd7a0]' },
    { id: 'srv_activity', label: 'Activities', thai: 'กิจกรรมเด่น', icon: '⚡', screen: 'D2', color: 'bg-[#e85729]', badge: 'NEW' },
    { id: 'srv_quiz', label: 'Level Quiz', thai: 'วัดระดับฝีมือ', icon: '📝', screen: 'A2', color: 'bg-[#15803d]', badge: 'NEW' },
  ];

 return (
 <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-y-auto overscroll-contain no-scrollbar pb-28">
 {/* 1. Grab-Signature Header Nav Bar (Exact Grab App Layout from Reference Screenshot) */}
 <div className="bg-[#004d2c] text-[#ffffff] app-header-safe px-5 pb-4 shadow-sm relative z-30">
 <div className="flex items-center gap-3">
 {/* A. QR / Barcode Scanner Squircle Button */}
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 navigateTo('MAP');
 }}
 className="w-10 h-10 rounded-[14px] bg-[#ffffff]/15 hover:bg-[#ffffff]/25 border border-[#ffffff]/20 flex items-center justify-center text-[#ffffff] cursor-pointer active:scale-[0.96] transition-all shrink-0 shadow-xs"
 title={isThai ? 'สแกน QR โค้ด' : 'Scan QR Code'}
 >
 <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[2.2] text-[#ffffff]">
 <path d="M4 8V5a1 1 0 0 1 1-1h3" strokeLinecap="round" strokeLinejoin="round" />
 <path d="M16 4h3a1 1 0 0 1 1 1v3" strokeLinecap="round" strokeLinejoin="round" />
 <path d="M20 16v3a1 1 0 0 1-1 1h-3" strokeLinecap="round" strokeLinejoin="round" />
 <path d="M8 20H5a1 1 0 0 1-1-1v-3" strokeLinecap="round" strokeLinejoin="round" />
 <line x1="7" y1="12" x2="17" y2="12" strokeLinecap="round" strokeWidth="2.5" />
 </svg>
 </button>

 {/* B. Center Wide White Search Bar Pill with placeholder */}
 <div className="flex-1 relative">
 <div
 onClick={() => {
 playSelectSound();
 setIsSearchSuggestionsOpen(!isSearchSuggestionsOpen);
 }}
 className="w-full h-10 px-4 rounded-[1600px] bg-[#ffffff] flex items-center gap-2 cursor-pointer shadow-xs hover:bg-[#f9fafb] transition-colors"
 >
 <Search className="w-4 h-4 text-[#000000]/60 shrink-0" />
 <input
 type="text"
 placeholder={searchQuery || (isThai ? 'ค้นหาสนาม, ก๊วน, คลาส, ร้านค้า...' : 'Search courts, parties, classes...')}
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 onFocus={() => setIsSearchSuggestionsOpen(true)}
 className="w-full bg-transparent text-xs font-semibold text-[#000000] placeholder:text-[#000000]/55 outline-none cursor-text truncate"
 />
 {searchQuery && (
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 setSearchQuery('');
 }}
 className="w-4 h-4 rounded-full bg-[#eeeeee] flex items-center justify-center text-[10px] text-[#000000]/60 hover:text-[#000000] shrink-0"
 >
 ✕
 </button>
 )}
 </div>

 {/* Smart Search Dropdown */}
 {isSearchSuggestionsOpen && (
 <div className="absolute top-12 left-0 right-0 z-50 bg-[#ffffff] rounded-[24px] p-3 shadow-2xl space-y-2 animate-in fade-in zoom-in-95 text-[#000000]">
 <div className="flex items-center justify-between pb-2 text-[10px]">
 <span className="font-black uppercase tracking-wider text-[#000000] flex items-center gap-1">
 <Sparkles className="w-3 h-3 text-[#15803d]" />
 {isThai ? 'คำค้นหายอดนิยม' : 'Trending Searches'}
 </span>
 <button
 type="button"
 onClick={() => setIsSearchSuggestionsOpen(false)}
 className="text-[#000000]/60 hover:text-[#000000] font-bold"
 >
 {isThai ? 'ปิด' : 'Close'}
 </button>
 </div>
 <div className="flex flex-wrap gap-2 pt-1">
 {(isThai
 ? ['ติดแอร์', 'ที่จอดรถ', 'ชาร์จรถ EV', 'ก๊วนมือใหม่', 'คอร์ทเปิดดึก', 'ลาดพร้าว']
 : ['Air-Con', 'Parking', 'EV Charging', 'Beginner Party', 'Late Night', 'Ladprao']
 ).map((tag) => (
 <button
 key={tag}
 type="button"
 onClick={() => {
 playSelectSound();
 setSearchQuery(tag);
 setIsSearchSuggestionsOpen(false);
 }}
 className="px-3 py-1 rounded-[1600px] bg-[#f4f8fb] text-[10px] font-bold hover:bg-[#c2e2ff] shadow-xs"
 >
 {tag}
 </button>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* C. GrabCoins / SmashRewards Golden Icon (G) */}
 <button
 type="button"
 onClick={() => {
 playCoinSound();
 navigateTo('FINANCE');
 }}
 className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7cd7a0] via-[#f59e0b] to-[#d97706] flex items-center justify-center text-[#ffffff] font-black text-sm shadow-xs cursor-pointer active:scale-[0.96] transition-transform shrink-0"
 title={isThai ? 'เหรียญสแมชเพย์' : 'SmashRewards (120 Coins)'}
 >
 <span className="font-['Antonio',sans-serif] text-base drop-shadow-xs font-black">G</span>
 </button>

 {/* D. Circular Doodle Profile Avatar Button */}
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 navigateTo('F1');
 }}
 className="rounded-full overflow-hidden flex items-center justify-center cursor-pointer active:scale-[0.96] transition-transform shrink-0 shadow-xs"
 title={isThai ? 'โปรไฟล์ผู้ใช้' : 'User Profile'}
 >
 <DoodleAvatar preset="karn" size="sm" className="w-9 h-9" ringClass="border-2 border-[#ffffff]" />
 </button>
 </div>
 </div>

 {/* Dual Quick Info Cards (Matching Grab reference: View Balance / Ride to) */}
 <div className="px-5 pt-4">
 <div className="grid grid-cols-2 gap-3">
 {/* Card 1: View Balance / SmashPay Wallet */}
 <div
 onClick={() => {
 playSelectSound();
 navigateTo('FINANCE');
 }}
 className="doodle-cta p-3 rounded-[20px] bg-[#ffffff] flex items-center justify-between gap-2 cursor-pointer transition-all"
 >
 <div className="min-w-0">
 <span className="text-[10px] text-[#000000]/60 font-semibold block leading-tight truncate">
 {isThai ? 'ยอดเงินคงเหลือ' : 'View Balance'}
 </span>
 <div className="flex items-center gap-1 mt-1">
 <span className="text-xs font-black text-[#000000] font-['Antonio',sans-serif] uppercase tracking-wide truncate">
 {isThai ? 'กระเป๋าเงินสแมชเพย์' : 'SmashPay Wallet'}
 </span>
 </div>
 <span className="text-[11px] font-black text-[#004d2c] block font-['Antonio',sans-serif]">
 ฿1,250.00
 </span>
 </div>
 <div className="w-8 h-8 rounded-full bg-[#7cd7a0]/20 flex items-center justify-center text-base shrink-0">
 💳
 </div>
 </div>

 {/* Card 2: Next Match / Ride to */}
 <div
 onClick={() => {
 playSelectSound();
 navigateTo('B4');
 }}
 className="doodle-cta p-3 rounded-[20px] bg-[#ffffff] flex items-center justify-between gap-2 cursor-pointer transition-all"
 >
 <div className="min-w-0">
 <span className="text-[10px] text-[#e85729] font-black block leading-tight truncate">
 {isThai ? 'นัดหมายถัดไป' : 'Next Match'}
 </span>
 <div className="flex items-center gap-1 mt-1">
 <span className="text-xs font-black text-[#000000] font-['Antonio',sans-serif] uppercase tracking-wide truncate">
 {isThai ? 'เมทริส ลาดพร้าว' : 'Metris Ladprao'}
 </span>
 </div>
 <span className="text-[10px] text-[#000000]/65 font-bold block truncate">
 {isThai ? 'วันนี้ 19:00 · คอร์ท 3' : 'Today 19:00 · Court 3'}
 </span>
 </div>
 <div className="w-8 h-8 rounded-full bg-[#e85729]/15 flex items-center justify-center text-base shrink-0">
 🏸
 </div>
 </div>
 </div>
      {/* Quick Action Dual Pills (Exact design.md 4.1) */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button
          type="button"
          onClick={() => {
            playSelectSound();
            navigateTo('MAP');
          }}
          className="py-3 px-3 rounded-[1600px] bg-[#ffffff] hover:bg-[#f2f2f2] text-[#000000] border border-[#000000] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-[0.96] transition-all shadow-xs"
        >
          <span>🏸</span>
          <span>{isThai ? 'ค้นหาสนาม' : 'Find Courts'}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            playSelectSound();
            navigateTo('E1');
          }}
          className="py-3 px-3 rounded-[1600px] bg-[#ffffff] hover:bg-[#f2f2f2] text-[#000000] border border-[#000000] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-[0.96] transition-all shadow-xs whitespace-nowrap"
        >
          <span>👥</span>
          <span>{isThai ? 'หาก๊วน' : 'Find Groups'}</span>
          <span className="px-2 py-0.5 rounded-[1600px] bg-[#e85729] text-[#ffffff] text-[9px] font-black shrink-0 whitespace-nowrap">
            28
          </span>
        </button>
      </div>
 </div>

 {/* Main Body with Clean Proportions (Faithful to VibeMove video 00:01 - 00:03) */}
 <div className="px-4 pt-4 space-y-4">
 {/* 2. HERO VIBE CARD ("Not sure what you want to train today?") */}
 <div className="rounded-[28px] bg-[#243b34] text-[#ffffff] p-4 relative overflow-hidden shadow-lg flex flex-col justify-between space-y-4">
 {/* Top Row: Headings & Waving Mascot */}
 <div className="flex items-start justify-between gap-3 relative z-10">
 <div className="space-y-1 max-w-[70%]">
 <h2 className="text-lg font-black leading-tight text-[#ffffff] font-['Antonio',sans-serif] uppercase tracking-wide">
 {isThai ? (
 <>
 ยังไม่แน่ใจว่าจะ<span className="font-serif italic font-normal text-[#e85729] underline decoration-[#e85729] decoration-1">ฝึกซ้อม</span>อะไร<span className="font-serif italic font-normal text-[#7cd7a0] underline decoration-[#7cd7a0] decoration-1">วันนี้</span>?
 </>
 ) : (
 <>
 Not sure <span className="font-serif italic font-normal text-[#e85729] underline decoration-[#e85729] decoration-1">what</span> you want to <span className="font-serif italic font-normal text-[#7cd7a0] underline decoration-[#7cd7a0] decoration-1">train</span> today?
 </>
 )}
 </h2>
 <p className="text-[11px] text-[#ffffff]/80 font-normal leading-relaxed pt-1">
 {isThai
 ? 'บอกความรู้สึกของคุณ แล้วเราจะแนะนำการฝึกซ้อมที่เข้ากับพลังงานและอารมณ์ของคุณ'
 : "Tell us how you feel, we'll recommend workouts matching your energy & mood."}
 </p>
 </div>

 {/* Character Mascot Toggle (Hidden per user request: 'hide character เมื่อกี้ก่อนไม่ต้องลบ') */}
          {/* Note: Set showMascotHero to true whenever you want to re-enable Smashy #15 */}
          {false ? (
            <div className="shrink-0 relative mt-1 flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  playSmashSound();
                }}
                title="น้องสแมชชี่ (Smashy) #15"
                className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#162722] border-2 border-[#7cd7a0] shadow-lg cursor-pointer group active:scale-[0.96] transition-transform"
              >
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_b3fgwrb3fgwrb3fg_9069fb4e.jpeg"
                  alt="Smashy Badminton Hero #15"
                  className="w-full h-full object-cover object-[51%_22%] scale-110 group-hover:scale-125 transition-transform duration-300"
                />
                <div className="absolute top-0 right-0 bg-[#e85729] text-white text-[8px] font-black px-1 rounded-bl-md">
                  #15
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs py-0.2 text-center text-[7.5px] font-black text-[#e85729] uppercase tracking-wider">
                  SMASHY
                </div>
              </button>
              <div className="mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7cd7a0] animate-pulse" />
                <span className="text-[8.5px] font-extrabold uppercase text-[#e85729] tracking-wide">
                  CO-PILOT
                </span>
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 shrink-0 relative mt-1">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <polygon
                  points="50,5 57,18 71,9 72,23 87,20 81,33 95,38 84,48 96,58 82,63 89,76 74,74 72,89 60,81 50,92 40,81 28,89 26,74 11,76 18,63 4,58 16,48 5,38 19,33 13,20 28,23 29,9 43,18"
                  fill="#e85729"
                  stroke="#000000"
                  strokeWidth="2.5"
                />
                <circle cx="40" cy="43" r="3" fill="#000000" />
                <circle cx="60" cy="43" r="3" fill="#000000" />
                <path d="M 42,54 Q 50,62 58,54" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="42" y1="80" x2="38" y2="92" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="58" y1="80" x2="62" y2="92" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
                <ellipse cx="34" cy="94" rx="7" ry="3.5" fill="#000000" />
                <ellipse cx="66" cy="94" rx="7" ry="3.5" fill="#000000" />
              </svg>
            </div>
          )}
 </div>

 {/* Wide Pill Button: "Find my match" - PRIMARY CTA KEEPS BORDER */}
 <div className="relative z-10 pt-1">
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setIsEnergyModalOpen(true);
 }}
 className="w-full py-3 rounded-[1600px] bg-[#ffffff] hover:bg-[#f0f0f0] text-[#000000] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-[0.96] transition-transform shadow-sm"
 >
 <span>{isThai ? 'ค้นหาการฝึกที่ใช่' : 'Find my match'}</span>
 </button>
 </div>
 </div>

 {/* 3. SERVICES MATRIX (Grid 4x2) */}
    <div className="space-y-2">
      <SectionHeader
        title={isThai ? 'บริการทั้งหมด (8 รายการ)' : 'Services Matrix (8)'}
        badge={isThai ? 'ครบครันทุกเรื่องแบด' : 'All-in-One'}
        badgeVariant="soft"
      />

      {/* 4x2 Grid of 1:1 Squircles */}
      <div className="grid grid-cols-4 gap-3">
        {servicesMatrix.map((srv) => (
          <button
            key={srv.id}
            type="button"
            onClick={() => {
              playSelectSound();
              navigateTo(srv.screen as any);
            }}
            className="p-3 rounded-[22px] bg-[#ffffff] shadow-sm flex flex-col items-center justify-between aspect-square hover:shadow-md active:scale-[0.96] transition-all cursor-pointer relative"
          >
            {srv.badge && (
              <span className="absolute -top-1 right-1 px-2 py-0.5 rounded-[1600px] bg-[#e85729] text-[#ffffff] text-[8px] font-black shadow-xs whitespace-nowrap shrink-0">
                {srv.badge}
              </span>
            )}
            <div
              className={`w-9 h-9 rounded-[1600px] flex items-center justify-center text-lg mt-1 ${srv.color}`}
            >
              {srv.icon}
            </div>
            <div className="text-center w-full">
              <span className="text-[10px] font-black text-[#000000] block leading-tight truncate whitespace-nowrap">
                {isThai ? srv.thai : srv.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* Line OpenChat Banner (Exact design.md 4.1) */}
    <div className="rounded-[24px] bg-[#06c755] text-[#ffffff] p-4 relative overflow-hidden shadow-md flex items-center justify-between gap-3">
      <div className="space-y-1 max-w-[65%] min-w-0">
        <span className="px-2 py-1 rounded-[1600px] bg-[#000000]/20 text-[#ffffff] text-[9px] font-bold inline-block">
          {isThai ? 'ชุมชนคนตีแบด' : 'COMMUNITY'}
        </span>
        <h3 className="text-sm font-black leading-tight text-[#ffffff] font-['Antonio',sans-serif] uppercase tracking-wide truncate">
          {isThai ? 'เข้าร่วม Line OpenChat แอปตีแบด' : 'Join Badminton Community OpenChat'}
        </h3>
        <p className="text-[10px] text-[#ffffff]/95 font-medium line-clamp-2">
          {isThai ? 'หาเพื่อนตีแบด แชร์โปรคอร์ท และนัดแมตช์สด 1,480 คน' : 'Find friends, share court discounts, and live matchmaking (1,480 players)'}
        </p>
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              navigateTo('E1');
            }}
            className="px-3 py-2 rounded-[1600px] bg-[#ffffff] hover:bg-[#f2f2f2] text-[#000000] border border-[#000000] text-[10px] font-bold cursor-pointer active:scale-[0.96] transition-all shadow-xs"
          >
            {isThai ? 'เข้ากลุ่ม LINE' : 'Join LINE OpenChat'}
          </button>
        </div>
      </div>
      {/* Line OpenChat QR Mascot Graphic */}
      <div className="w-16 h-16 shrink-0 bg-[#ffffff] p-2 rounded-[16px] shadow-sm flex flex-col items-center justify-center">
        <QrCode className="w-8 h-8 text-[#000000]" />
        <span className="text-[7px] font-black text-[#000000] mt-1">OPENCHAT</span>
      </div>
    </div>

 {/* 4. YOUR PROGRESS SECTION (3 Proportional Square Cards side-by-side) */}
 <ProgressRingsWidget
 steps={3548}
 stepsTarget={6000}
 calories={273}
 caloriesTarget={600}
 activityMinutes={65} // 1h 5m
 activityTargetMinutes={90}
 onSeeActivityClick={() => navigateTo('F2')}
 />

 {/* 5. VIEW SELECTOR TABS (Clean filter tabs without heavy CTA borders) */}
 <div data-filter="true" className="flex items-center gap-2 p-1 rounded-[1600px] bg-[#ffffff] shadow-xs">
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveSubTab('today');
 }}
 className={`flex-1 py-2 rounded-[1600px] text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
 activeSubTab === 'today'
 ? 'bg-[#000000] text-[#ffffff] shadow-xs'
 : 'text-[#000000]/60 hover:text-[#000000]'
 }`}
 >
 {isThai ? 'เซสชันวันนี้' : "Today's Sessions"}
 </button>

 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveSubTab('schedule');
 }}
 className={`flex-1 py-2 rounded-[1600px] text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
 activeSubTab === 'schedule'
 ? 'bg-[#000000] text-[#ffffff] shadow-xs'
 : 'text-[#000000]/60 hover:text-[#000000]'
 }`}
 >
 {isThai ? 'ตารางกิจกรรม' : 'Schedule'}
 </button>

 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveSubTab('courts');
 }}
 className={`flex-1 py-2 rounded-[1600px] text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
 activeSubTab === 'courts'
 ? 'bg-[#000000] text-[#ffffff] shadow-xs'
 : 'text-[#000000]/60 hover:text-[#000000]'
 }`}
 >
 {isThai ? 'สนามทั้งหมด' : 'Courts'}
 </button>
 </div>

 {/* TAB 1: TODAY'S SESSIONS */}
 {activeSubTab === 'today' && (
 <div className="space-y-2.5">
 <SectionHeader
 title={isThai ? 'เซสชันที่เหมาะกับคุณ' : 'Fits your mood today'}
 rightSlot={
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setIsEnergyModalOpen(true);
 }}
 className="text-xs font-bold text-[#e85729] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
 >
 <span>{isThai ? 'เปลี่ยนอารมณ์' : 'Change my mood'}</span>
 <ChevronRight className="w-3.5 h-3.5 shrink-0" />
 </button>
 }
 />

 {/* Large Prominent Hero Session Card */}
 <div
 onClick={() => {
 playSelectSound();
 setIsWorkoutDetailOpen(true);
 }}
 className="w-full bg-[#ffffff] rounded-[28px] overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
 >
 {/* Media Preview Container with Overlay Controls */}
 <div className="relative w-full aspect-[16/10] bg-[#243b34] overflow-hidden">
 <img
 src={currentWorkout.videoPreviewUrl}
 alt={isThai ? currentWorkout.titleTh : currentWorkout.titleEn}
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-[#000000]/30 pointer-events-none" />

 {/* Top Badge & Heart */}
 <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
 <span className="px-3 py-1 rounded-[1600px] bg-[#000000]/75 backdrop-blur-xs text-[#ffffff] text-[10px] font-bold flex items-center gap-1 whitespace-nowrap shrink-0">
 <Flame className="w-3 h-3 text-[#e85729] shrink-0" />
 <span>{isThai ? currentWorkout.intensityLabelTh : currentWorkout.intensityLabelEn}</span>
 </span>

 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 playCoinSound();
 setIsHeroWorkoutFavorited(!isHeroWorkoutFavorited);
 }}
 className="w-8 h-8 rounded-full bg-[#ffffff]/90 backdrop-blur-xs border border-[#000000] flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-transform shadow-xs shrink-0"
 aria-label="Favorite session"
 >
 <Heart
 className={`w-4 h-4 transition-colors ${
 isHeroWorkoutFavorited ? 'fill-[#e85729] text-[#e85729]' : 'text-[#000000]'
 }`}
 />
 </button>
 </div>

 {/* Center "Start Training" Button */}
 <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center">
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 playSmashSound();
 gainExp(50, isThai ? `เริ่มการฝึกซ้อม: ${currentWorkout.titleTh}` : `Start training: ${currentWorkout.titleEn}`);
 navigateTo('C1');
 }}
 className="w-full py-3 rounded-[1600px] bg-[#e85729] hover:bg-[#ff5a1a] text-[#ffffff] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-[0.96] transition-transform shadow-md whitespace-nowrap"
 >
 <Play className="w-3.5 h-3.5 fill-current shrink-0" />
 <span className="whitespace-nowrap">{isThai ? 'เริ่มการฝึกซ้อม' : 'Start training'}</span>
 </button>
 </div>
 </div>

 {/* Clean Session Text Details below Media */}
 <div className="p-4 space-y-2">
 <div className="flex items-center justify-between gap-2">
 <h3 className="text-[15px] font-extrabold text-[#000000] leading-snug truncate">
 {isThai ? currentWorkout.titleTh : currentWorkout.titleEn}
 </h3>
 <span className="text-[11px] font-black text-[#000000] bg-[#7cd7a0] px-2.5 py-0.5 rounded-[1600px] shrink-0 whitespace-nowrap tabular-nums">
 ★ {currentWorkout.rating}
 </span>
 </div>

 <div className="flex items-center gap-1.5 text-xs font-semibold text-[#000000]/70 truncate">
 <Clock className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
 <span className="whitespace-nowrap">{isThai ? currentWorkout.scheduleTh : currentWorkout.scheduleEn}</span>
 <span aria-hidden="true">·</span>
 <span className="truncate">{isThai ? currentWorkout.courtNameTh : currentWorkout.courtNameEn}</span>
 </div>

 {/* Concise 3-Tag Metadata Row (Single-line, clean spacing) */}
 <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
 {((isThai ? currentWorkout.tagsTh : currentWorkout.tagsEn) || currentWorkout.tags)
 .slice(0, 3)
 .map((tag, tIdx) => (
 <span
 key={tIdx}
 className="px-3 py-1 rounded-[1600px] bg-[#f4f8fb] text-[#000000] text-[10px] font-semibold leading-normal shrink-0 whitespace-nowrap"
 >
 {tag}
 </span>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {/* TAB 2: SCHEDULE VIEW (Weekly Calendar from VibeMove) */}
 {activeSubTab === 'schedule' && (
 <div className="animate-in fade-in">
 <WeeklyCalendarWidget />
 </div>
 )}

 {/* TAB 3: COURTS VIEW (16:9 Badminton Courts Feed) */}
 {activeSubTab === 'courts' && (
 <div className="space-y-2.5 animate-in fade-in">
 <SectionHeader
 title={isThai ? 'สนามใกล้คุณ' : 'Courts Near You'}
 rightSlot={
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 navigateTo('MAP');
 }}
 className="px-3 py-1 rounded-[1600px] bg-[#ffffff] hover:bg-[#f2f2f2] text-[#000000] border border-[#000000] text-[11px] font-bold flex items-center gap-1 cursor-pointer active:scale-[0.96] transition-all shadow-xs whitespace-nowrap shrink-0"
 >
 <span>{isThai ? 'ดูคอร์ทว่างบนแผนที่' : 'Explore Map'}</span>
 <ChevronRight className="w-3.5 h-3.5 shrink-0" />
 </button>
 }
 />

 <div className="space-y-3">
 {courts.length === 0 ? (
 <div className="p-6 rounded-[24px] bg-[#ffffff] text-center space-y-2">
 <div className="text-3xl">🏸</div>
 <p className="text-xs font-bold text-neutral-800">
 {isThai ? 'ไม่พบสนามในโหมดข้อมูลว่างเปล่า (Empty State)' : 'No courts available in Empty Data Mode'}
 </p>
 <p className="text-[11px] text-neutral-500">
 {isThai ? 'สลับโหมดเป็น Demo หรือ Worst Case ที่แถบ Break-UI ด้านล่างเพื่อดูข้อมูล' : 'Switch data mode to Demo or Worst Case via testing controls'}
 </p>
 </div>
 ) : (
 courts.slice(0, 3).map((court) => (
 <div
 key={court.id}
 onClick={() => handleSelectCourt(court)}
 className="bg-[#ffffff] rounded-[24px] overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-99"
 >
 <div className="relative w-full aspect-[16/9] bg-[#e5e7eb] overflow-hidden">
 <img
 src={court.imageUrl}
 alt={court.name}
 className="w-full h-full object-cover"
 />

 <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
 <span className="px-2 py-1 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-[9px] font-black shadow-xs">
 {isThai ? 'เปิดจอง' : 'Available'}
 </span>
                  <span className="px-2 py-1 rounded-[1600px] bg-[#000000]/65 text-[#ffffff] text-[8px] font-bold backdrop-blur-xs shadow-xs">
                    {isThai ? 'จองแล้วเมื่อ 5 นาทีก่อน' : 'Booked 5m ago'}
                  </span>
 </div>

 <button
 type="button"
 onClick={(e) => handleToggleFavoriteCourt(e, court.id)}
 className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#ffffff] border border-[#000000] flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-transform shadow-xs"
 >
 <Heart
 className={`w-3.5 h-3.5 transition-colors ${
 favoriteCourtIds.includes(court.id)
 ? 'fill-[#e85729] text-[#e85729]'
 : 'text-[#000000]'
 }`}
 />
 </button>

 <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-xs font-black shadow-xs">
 ฿{court.pricePerHour}/{isThai ? 'ชม.' : 'hr'}
 </div>
 </div>

 <div className="p-3 space-y-1">
 <div className="flex items-center justify-between gap-2">
 <h3 className="font-['Antonio',sans-serif] font-black text-sm uppercase text-[#000000] truncate">
 {court.name}
 </h3>
 <span className="text-xs font-bold text-[#000000] shrink-0">★ {court.rating}</span>
 </div>
 <div className="flex items-center justify-between gap-2 pt-1">
                    <p className="text-[10px] text-[#000000]/60 font-semibold truncate">
 {court.location} · {court.distanceKm} {isThai ? 'กม.' : 'km'}
 </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCourt(court);
                      }}
                      className="px-3 py-1 rounded-[1600px] bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] border border-[#000000] text-[10px] font-bold cursor-pointer active:scale-[0.96] transition-transform shadow-xs shrink-0"
                    >
                      {isThai ? 'จองคอร์ทและล็อกเวลา' : 'Book Slot'}
                    </button>
                  </div>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 )}

 {/* 6. Compact Live Simulator Section */}
 <div className="space-y-1.5">
 <SectionHeader
 title={isThai ? '⚡ จำลองเหตุการณ์สด' : '⚡ LIVE EVENTS SIMULATOR'}
 badge={isThai ? `⏱️ แมตช์ถัดไป ${formatCountdown(countdownSeconds)}` : `⏱️ Next ${formatCountdown(countdownSeconds)}`}
 badgeVariant="orange"
 />
 <div className="p-3 rounded-[22px] bg-[#ffffff] shadow-sm">
 <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
 <button
 type="button"
 onClick={triggerSampleInvite}
 className="px-3 py-1 rounded-[1600px] bg-[#7cd7a0] hover:bg-[#6ecb93] text-[#000000] border border-[#000000] text-[10px] font-black tracking-wide flex items-center gap-1 shrink-0 cursor-pointer active:scale-[0.96] transition-all shadow-xs"
 >
 <span>⚔️</span>
 <span>{isThai ? 'เพื่อนท้าแข่ง' : 'Match Invite'}</span>
 </button>

 <button
 type="button"
 onClick={triggerSampleBookingConfirmation}
 className="px-3 py-1 rounded-[1600px] bg-[#7cd7a0] hover:bg-[#6be4ab] text-[#000000] border border-[#000000] text-[10px] font-black tracking-wide flex items-center gap-1 shrink-0 cursor-pointer active:scale-[0.96] transition-all shadow-xs"
 >
 <span>🎫</span>
 <span>{isThai ? 'จองคอร์ทสำเร็จ' : 'Booking Confirmed'}</span>
 </button>

 <button
 type="button"
 onClick={triggerSampleCountdownAlert}
 className="px-3 py-1 rounded-[1600px] bg-[#e85729] hover:bg-[#ff6122] text-[#ffffff] border border-[#000000] text-[10px] font-black tracking-wide flex items-center gap-1 shrink-0 cursor-pointer active:scale-[0.96] transition-all shadow-xs"
 >
 <span>⏱️</span>
 <span>{isThai ? 'เตือนแมตช์ใกล้เริ่ม' : 'Upcoming Match'}</span>
 </button>

 <button
 type="button"
 onClick={triggerSamplePartyUpdate}
 className="px-3 py-1 rounded-[1600px] bg-[#e8f7ee] hover:bg-[#dfb3ff] text-[#000000] border border-[#000000] text-[10px] font-black tracking-wide flex items-center gap-1 shrink-0 cursor-pointer active:scale-[0.96] transition-all shadow-xs"
 >
 <span>👥</span>
 <span>{isThai ? 'อัปเดตก๊วนสด' : 'Party Update'}</span>
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Energy & Mood Modal (Video 00:04 - 00:10) */}
 <EnergyMoodModal
 isOpen={isEnergyModalOpen}
 onClose={() => setIsEnergyModalOpen(false)}
 selectedMood={currentMood}
 onSelectMood={(mood) => {
 setCurrentMood(mood);
 gainExp(30, `อัปเดต Vibe: ${mood.toUpperCase()}`);
 }}
 playerName={player.name}
 />

 {/* Workout Detail Modal (Video 00:11 - 00:13) */}
 <WorkoutDetailModal
 isOpen={isWorkoutDetailOpen}
 onClose={() => setIsWorkoutDetailOpen(false)}
 workout={currentWorkout}
 onChangeMoodClick={() => {
 setIsWorkoutDetailOpen(false);
 setIsEnergyModalOpen(true);
 }}
 onStartTraining={() => {
 navigateTo('C1');
 }}
 />
 </div>
 );
};
