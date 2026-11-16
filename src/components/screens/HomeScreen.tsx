import React, { useState } from 'react';
import {
  QrCode,
  Search,
  ChevronRight,
  Wallet,
  Calendar,
  Heart,
  Play,
  Clock,
  Flame,
  Sparkles,
  MapPin,
  ArrowRight,
  Star,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourtFacility } from '../../types';
import { playCoinSound, playSelectSound, playSmashSound } from '../../utils/retroAudio';
import { EnergyMoodModal, MoodEnergyLevel } from '../common/EnergyMoodModal';
import { ProgressRingsWidget } from '../common/ProgressRingsWidget';
import { WeeklyCalendarWidget } from '../common/WeeklyCalendarWidget';
import { WorkoutDetailModal, WorkoutDetailData } from '../common/WorkoutDetailModal';
import { DoodleAvatar } from '../common/DoodleAvatar';
import { DailyStreakCard } from '../common/DailyStreakCard';
import { GearCheckCard } from '../common/GearCheckCard';
import { SectionHeader } from '../common/SectionHeader';
import { BadmintonFeedSection } from '../home/BadmintonFeedSection';

// Workouts mapped to energy levels (VibeMove style)
const WORKOUT_SESSIONS_MAP: Record<MoodEnergyLevel, WorkoutDetailData> = {
 energized: {
 id: 'wk_energized_1',
 title: 'Strength & Jump Smash 340+ km/h',
 titleTh: 'พาวเวอร์สแมชความเร็วสูง',
 titleEn: 'Strength & Jump Smash 340+ km/h',
 subtitle: 'ฝึกจังหวะกระโดดตบสแมชและเร่งสปีดแดนหน้า',
 subtitleTh: 'ฝึกจังหวะกระโดดตบสแมชและเร่งสปีดแดนหน้า',
 subtitleEn: 'Master jump smash timing and rapid net intercepts.',
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
 trainerName: 'โค้ชกานต์ · ระดับ 85',
 trainerRole: 'National Certified Coach · Diamond Rank',
 trainerRoleTh: 'โค้ชระดับประเทศ',
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
 subtitle: 'ตีโต้ 30 ช็อตต่อเนื่อง เน้นลูกหยอดคุมจังหวะ',
 subtitleTh: 'ตีโต้ 30 ช็อตต่อเนื่อง เน้นลูกหยอดคุมจังหวะ',
 subtitleEn: 'Focus on relaxed 30-shot rallies and smooth net drops.',
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
 trainerName: 'ครูแพรว',
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
 titleTh: 'แท็กติกเกมคู่ผสมและฟุตเวิร์ก',
 titleEn: 'Tactical Mixed Doubles & Core Footwork',
 subtitle: 'ฝึกการยืนตำแหน่งและการสลับเกมรับเป็นรุก',
 subtitleTh: 'ฝึกการยืนตำแหน่งและการสลับเกมรับเป็นรุก',
 subtitleEn: 'Doubles positioning, rotation, and defense-to-attack transitions.',
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
 title: 'Beast Mode Cardio & Speed Drills',
 titleTh: 'คาร์ดิโอและสปีดฟุตเวิร์กเต็มพิกัด',
 titleEn: 'Beast Mode Cardio & Speed Drills',
 subtitle: 'ซ้อมฟุตเวิร์ก 6 มุมความเร็วสูง เผาผลาญเต็มที่',
 subtitleTh: 'ซ้อมฟุตเวิร์ก 6 มุมความเร็วสูง เผาผลาญเต็มที่',
 subtitleEn: 'High-intensity 6-corner footwork drills with 700+ kcal burn.',
 category: 'Beast Mode',
 schedule: 'Today, 20:30 - 22:00',
 scheduleTh: 'วันนี้ 20:30 - 22:00 น.',
 scheduleEn: 'Today, 20:30 - 22:00',
 intensity: 'High',
 intensityLabel: 'Peak intensity',
 intensityLabelTh: 'ขีดสุดสมรรถนะ',
 intensityLabelEn: 'Peak intensity',
 tags: ['High Energy', '700 kcal', 'Footwork', 'Cardio'],
 tagsTh: ['เข้มข้นสูง', 'เผาผลาญหนัก', 'ฟุตเวิร์ก', 'คาร์ดิโอ'],
 tagsEn: ['High Energy', '700 kcal', 'Footwork', 'Cardio'],
 trainerName: 'โค้ชสแมช',
 trainerRole: 'Automated Real-time Sensor Coach',
 trainerRoleTh: 'ระบบช่วยฝึกเรียลไทม์',
 trainerRoleEn: 'Automated Real-time Coach',
 trainerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
 courtName: 'คอร์ท 1 พื้นยางมาตรฐาน',
 courtNameTh: 'คอร์ท 1 พื้นยางมาตรฐาน',
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
 subtitle: 'คลายกล้ามเนื้อไหล่และข้อมือหลังจบเกม',
 subtitleTh: 'คลายกล้ามเนื้อไหล่และข้อมือหลังจบเกม',
 subtitleEn: 'Release shoulder and wrist tightness with pro mobility drills.',
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
 trainerName: 'แอนนา · นักกายภาพ',
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
    language,
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

  // 8 Services Matrix (Grid 4x2)
  const servicesMatrix = [
    { id: 'srv_courts', label: 'Find Courts', thai: 'ค้นหาสนาม', icon: '🏸', screen: 'MAP', color: 'bg-[#7cd7a0]', badgeColor: 'bg-[#e85729]' },
    { id: 'srv_groups', label: 'Find Groups', thai: 'หาก๊วน', icon: '👥', screen: 'E1', color: 'bg-[#7cd7a0]', badge: '28', badgeColor: 'bg-[#e85729]' },
    { id: 'srv_create', label: 'Create Party', thai: 'สร้างก๊วน', icon: '➕', screen: 'E2', color: 'bg-[#7cd7a0]', badgeColor: 'bg-[#e85729]' },
    { id: 'srv_tools', label: 'Club Tools', thai: 'เครื่องมือ', icon: '🛠️', screen: 'CLUB_TOOLS', color: 'bg-[#e8f7ee]', badge: 'HOT', badgeColor: 'bg-[#e85729]' },
    { id: 'srv_coach', label: 'Find Coach', thai: 'หาโค้ชสอน', icon: '🎯', screen: 'D1', color: 'bg-[#7cd7a0]', badgeColor: 'bg-[#e85729]' },
    { id: 'srv_tourn', label: 'Tournaments', thai: 'ทัวร์นาเมนต์', icon: '🏆', screen: 'E4', color: 'bg-[#7cd7a0]', badgeColor: 'bg-[#e85729]' },
    { id: 'srv_activity', label: 'Activities', thai: 'กิจกรรมเด่น', icon: '⚡', screen: 'D2', color: 'bg-[#e85729]', badge: 'NEW', badgeColor: 'bg-[#e85729]' },
    { id: 'srv_quiz', label: 'Level Quiz', thai: 'วัดระดับฝีมือ', icon: '📝', screen: 'A2', color: 'bg-[#15803d]', badge: 'NEW', badgeColor: 'bg-[#e85729]' },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f4f8fb] text-[#000000] overflow-y-auto overscroll-contain no-scrollbar pb-28">
      {/* 1. Grab-Signature Header Nav Bar */}
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


      {/* Main Body with Smooth Vertical Spacing */}
      <div className="px-4 pt-4 space-y-4">
        {/* 2. SERVICES MATRIX (4x2 Grid, first section right below header) */}
        <div className="space-y-2.5">
          <SectionHeader
            title={isThai ? 'บริการทั้งหมด (8 รายการ)' : 'All Services (8)'}
            badge={isThai ? 'ครบครันทุกเรื่องแบด' : 'Super App Hub'}
            badgeVariant="soft"
          />

          <div className="grid grid-cols-4 gap-2">
            {servicesMatrix.map((srv) => (
              <button
                key={srv.id}
                type="button"
                onClick={() => {
                  playSelectSound();
                  navigateTo(srv.screen as any);
                }}
                className="aspect-square rounded-[22px] bg-[#ffffff] hover:bg-[#f9fafb] p-2 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 relative group"
              >
                {srv.badge && (
                  <span
                    className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-[1600px] text-[8px] font-black text-[#ffffff] leading-none shadow-xs ${
                      srv.badgeColor || 'bg-[#e85729]'
                    }`}
                  >
                    {srv.badge}
                  </span>
                )}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform ${srv.color}`}
                >
                  {srv.icon}
                </div>
                <span className="text-[10px] font-bold text-[#000000] leading-tight truncate w-full text-center px-0.5">
                  {isThai ? srv.thai : srv.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. HERO VIBE CHECK CARD ("ยังไม่แน่ใจว่าจะฝึกซ้อมอะไรวันนี้?") */}
        <div className="rounded-[28px] bg-[#243b34] text-[#ffffff] p-4 relative overflow-hidden shadow-md flex flex-col justify-between space-y-3.5">
          <div className="flex items-start justify-between gap-2 relative z-10">
            <div className="space-y-1 max-w-[70%]">
              <h2 className="text-base font-black leading-tight text-[#ffffff]">
                {isThai ? (
                  <>
                    ยังไม่แน่ใจว่าจะ
                    <span className="font-serif italic font-normal underline decoration-[#e85729] decoration-2 mx-1 text-[#e85729]">
                      ฝึกซ้อม
                    </span>
                    อะไร
                    <span className="font-serif italic font-normal underline decoration-[#7cd7a0] decoration-2 ml-1 text-[#7cd7a0]">
                      วันนี้
                    </span>
                    ?
                  </>
                ) : (
                  <>
                    Not sure <span className="font-serif italic font-normal underline decoration-[#e85729] decoration-2 text-[#e85729]">what</span> to{' '}
                    <span className="font-serif italic font-normal underline decoration-[#7cd7a0] decoration-2 text-[#7cd7a0]">train</span> today?
                  </>
                )}
              </h2>
              <p className="text-[11px] text-[#ffffff]/75 font-medium leading-relaxed pt-0.5">
                {isThai
                  ? 'บอกความรู้สึกของคุณ แล้วเราจะแนะนำการฝึกซ้อมที่เข้ากับพลังงานและอารมณ์ของคุณ'
                  : 'Tell us how you feel and we will recommend a training plan matching your energy.'}
              </p>
            </div>

            {/* Spiky Character Illustration */}
            <div className="w-16 h-16 shrink-0 relative">
              <svg viewBox="0 0 100 108" className="w-full h-full drop-shadow-md">
                <line x1="40" y1="84" x2="36" y2="98" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="60" y1="84" x2="64" y2="98" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
                <ellipse cx="33" cy="99" rx="6" ry="3.5" fill="#000000" />
                <ellipse cx="67" cy="99" rx="6" ry="3.5" fill="#000000" />
                <polygon
                  points="50,5 57,18 71,9 72,23 87,20 81,33 95,38 84,48 96,58 82,63 89,76 74,74 72,89 60,81 50,92 40,81 28,89 26,74 11,76 18,63 4,58 16,48 5,38 19,33 13,20 28,23 29,9 43,18"
                  fill="#e85729"
                  stroke="#000000"
                  strokeWidth="2.5"
                />
                <circle cx="40" cy="43" r="3" fill="#000000" />
                <circle cx="60" cy="43" r="3" fill="#000000" />
                <path d="M 42,54 Q 50,62 58,54" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setIsEnergyModalOpen(true);
            }}
            className="w-full py-2.5 rounded-[1600px] bg-[#ffffff] hover:bg-[#f3f4f6] text-[#000000] text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm relative z-10"
          >
            <span>{isThai ? 'ค้นหาการฝึกที่ใช่' : 'Find my training'}</span>
          </button>
        </div>

        {/* 4. DUAL QUICK INFO CARDS + DUAL PILLS (Between Training Hero & LINE Group) */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Left Quick Card: SmashPay Wallet */}
            <button
              type="button"
              onClick={() => {
                playCoinSound();
                navigateTo('FINANCE');
              }}
              className="doodle-cta p-3 rounded-[20px] bg-[#ffffff] flex items-center justify-between gap-2 text-left cursor-pointer active:scale-[0.98] transition-all"
            >
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-[#000000]/55 truncate">
                  {isThai ? 'ยอดเงินคงเหลือ' : 'Balance'}
                </div>
                <div className="text-xs font-black text-[#000000] truncate mt-0.5">
                  {isThai ? 'กระเป๋าเงินสแมชเพย์' : 'SmashPay Wallet'}
                </div>
                <div className="text-sm font-black text-[#004d2c] tabular-nums mt-0.5">
                  ฿1,250.00
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#e8f7ee] flex items-center justify-center text-base shrink-0">
                <Wallet className="w-4 h-4 text-[#004d2c]" />
              </div>
            </button>

            {/* Right Quick Card: Next Match Booking */}
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                navigateTo('B4');
              }}
              className="doodle-cta p-3 rounded-[20px] bg-[#ffffff] flex items-center justify-between gap-2 text-left cursor-pointer active:scale-[0.98] transition-all"
            >
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-[#e85729] truncate">
                  {isThai ? 'นัดหมายถัดไป' : 'Next Match'}
                </div>
                <div className="text-xs font-black text-[#000000] truncate mt-0.5">
                  {isThai ? 'เมทริส ลาดพร้าว' : 'Metris Ladprao'}
                </div>
                <div className="text-[10px] font-bold text-[#000000]/65 truncate mt-0.5">
                  {isThai ? 'วันนี้ 19:00 · คอร์ท 3' : 'Today 19:00 · Court 3'}
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#fff3ee] flex items-center justify-center text-base shrink-0">
                <Calendar className="w-4 h-4 text-[#e85729]" />
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                navigateTo('MAP');
              }}
              className="py-2.5 px-3 rounded-[1600px] bg-[#ffffff] text-[#000000] text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
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
              className="py-2.5 px-3 rounded-[1600px] bg-[#ffffff] text-[#000000] text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <span>👥</span>
              <span>{isThai ? 'หาก๊วน' : 'Find Groups'}</span>
              <span className="px-2 py-0.5 rounded-[1600px] bg-[#e85729] text-[#ffffff] text-[10px] font-black leading-none">
                28
              </span>
            </button>
          </div>
        </div>

        {/* 5. BRIGHT GREEN LINE OPENCHAT BANNER */}
        <div className="rounded-[24px] bg-[#06c755] text-[#ffffff] p-4 shadow-sm flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-[1600px] bg-[#000000]/15 text-[#ffffff] text-[10px] font-bold">
              {isThai ? 'ชุมชนคนตีแบด' : 'Badminton Community'}
            </span>
            <h3 className="text-sm font-black text-[#ffffff] leading-tight">
              {isThai ? 'เข้าร่วม LINE OPENCHAT แอปตีแบด' : 'Join Badminton LINE OpenChat'}
            </h3>
            <p className="text-[11px] font-medium text-[#ffffff]/90 leading-snug">
              {isThai
                ? 'หาเพื่อนตีแบด แชร์โปรคอร์ท และนัดแมตช์สด 1,480 คน'
                : 'Find badminton buddies, court deals & live matches · 1,480 members'}
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  navigateTo('E1');
                }}
                className="px-4 py-1.5 rounded-[1600px] bg-[#ffffff] hover:bg-[#f3f4f6] text-[#000000] text-[11px] font-black cursor-pointer active:scale-95 transition-transform shadow-xs"
              >
                {isThai ? 'เข้ากลุ่ม LINE' : 'Join LINE Group'}
              </button>
            </div>
          </div>

          <div className="w-16 h-16 rounded-[18px] bg-[#ffffff] text-[#000000] flex flex-col items-center justify-center gap-0.5 shrink-0 shadow-xs">
            <QrCode className="w-7 h-7 text-[#000000]" />
            <span className="text-[8px] font-black tracking-wider uppercase text-[#000000]">
              OPENCHAT
            </span>
          </div>
        </div>

        {/* 6. DAILY DRILL STREAK TRACKER */}
        <DailyStreakCard />

        {/* 7. PRE-COURT ESSENTIALS GEAR CHECK */}
        <GearCheckCard />

        {/* 8. YOUR PROGRESS (3 Circular Progress Rings) */}
        <ProgressRingsWidget
          steps={3548}
          stepsTarget={6000}
          calories={273}
          caloriesTarget={600}
          activityMinutes={65}
          activityTargetMinutes={90}
          onSeeActivityClick={() => navigateTo('F2')}
        />

        {/* 9. VIEW SELECTOR TABS (Profile Segmented Control Style) */}
        <div
          data-filter="true"
          className="bg-[#ececef] p-1 rounded-full grid grid-cols-3 gap-1"
        >
          {(
            [
              { id: 'today', label: isThai ? 'เซสชันวันนี้' : 'Today' },
              { id: 'schedule', label: isThai ? 'ตารางกิจกรรม' : 'Schedule' },
              { id: 'courts', label: isThai ? 'สนามทั้งหมด' : 'Courts' },
            ] as const
          ).map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playSelectSound();
                  setActiveSubTab(tab.id);
                }}
                className={`no-doodle min-h-[38px] px-2 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap truncate ${
                  isActive
                    ? 'bg-[#ffffff] text-[#111111] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                    : 'text-[#6b7280] hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: TODAY'S SESSIONS */}
        {activeSubTab === 'today' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2 px-1">
              <h3 className="text-[13px] font-semibold text-[#6b7280] leading-tight truncate">
                {isThai ? 'เซสชันที่เหมาะกับคุณวันนี้' : 'Fits your mood today'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  setIsEnergyModalOpen(true);
                }}
                className="no-doodle text-xs font-medium text-[#e85729] hover:opacity-80 flex items-center gap-0.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{isThai ? 'เปลี่ยนอารมณ์' : 'Change mood'}</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>

            <div
              onClick={() => {
                playSelectSound();
                setIsWorkoutDetailOpen(true);
              }}
              className="w-full bg-[#ffffff] rounded-[24px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer"
            >
              <div className="relative w-full aspect-[16/10] bg-[#243b34] overflow-hidden">
                <img
                  src={currentWorkout.videoPreviewUrl}
                  alt={isThai ? currentWorkout.titleTh : currentWorkout.titleEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/75 via-transparent to-[#000000]/25 pointer-events-none" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#000000]/70 backdrop-blur-xs text-[#ffffff] text-[10px] font-medium flex items-center gap-1 whitespace-nowrap shrink-0">
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
                    className="no-doodle w-9 h-9 rounded-full bg-[#ffffff]/90 backdrop-blur-xs flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform shadow-xs shrink-0"
                    aria-label="Favorite session"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isHeroWorkoutFavorited ? 'fill-[#e85729] text-[#e85729]' : 'text-[#111111]'
                      }`}
                    />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSmashSound();
                      gainExp(50, isThai ? `เริ่มการฝึกซ้อม: ${currentWorkout.titleTh}` : `Start training: ${currentWorkout.titleEn}`);
                      navigateTo('C1');
                    }}
                    className="no-doodle w-full min-h-[46px] py-3 rounded-full bg-gradient-to-b from-[#2b2b2e] to-[#111111] text-[#ffffff] text-[13px] font-medium flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all shadow-[0_6px_18px_rgba(0,0,0,0.22)] whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>{isThai ? 'เริ่มการฝึกซ้อม' : 'Start training'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[15px] font-semibold text-[#111111] leading-snug truncate">
                    {isThai ? currentWorkout.titleTh : currentWorkout.titleEn}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#e8f7ee] text-[#15803d] text-[11px] font-semibold shrink-0 flex items-center gap-1 tabular-nums">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{currentWorkout.rating}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-normal text-[#71717a] truncate">
                  <Clock className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                  <span className="whitespace-nowrap">{isThai ? currentWorkout.scheduleTh : currentWorkout.scheduleEn}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{isThai ? currentWorkout.courtNameTh : currentWorkout.courtNameEn}</span>
                </div>

                <div className="text-[11px] font-normal text-[#71717a] truncate pt-0.5">
                  {((isThai ? currentWorkout.tagsTh : currentWorkout.tagsEn) || currentWorkout.tags)
                    .slice(0, 3)
                    .join(' · ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULE VIEW */}
        {activeSubTab === 'schedule' && (
          <div className="animate-in fade-in">
            <WeeklyCalendarWidget />
          </div>
        )}

        {/* TAB 3: COURTS VIEW */}
        {activeSubTab === 'courts' && (
          <div className="space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between gap-2 px-1">
              <h3 className="text-[13px] font-semibold text-[#6b7280] leading-tight truncate">
                {isThai ? 'สนามใกล้คุณ' : 'Courts Near You'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  navigateTo('MAP');
                }}
                className="no-doodle text-xs font-medium text-[#111111] hover:opacity-75 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{isThai ? 'ดูบนแผนที่' : 'Map view'}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>

            <div className="space-y-3">
              {courts.length === 0 ? (
                <div className="p-6 rounded-[24px] bg-[#ffffff] text-center space-y-2 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                  <div className="text-3xl">🏸</div>
                  <p className="text-xs font-semibold text-[#111111]">
                    {isThai ? 'ไม่พบรายชื่อสนามในขณะนี้' : 'No courts available right now'}
                  </p>
                  <p className="text-[11px] text-[#71717a]">
                    {isThai ? 'ลองเปลี่ยนตัวกรองหรือเปิดแผนที่เพื่อค้นหาสนามอื่น' : 'Try adjusting filters or explore the map'}
                  </p>
                </div>
              ) : (
                courts.slice(0, 3).map((court) => (
                  <div
                    key={court.id}
                    onClick={() => handleSelectCourt(court)}
                    className="bg-[#ffffff] rounded-[24px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                  >
                    <div className="relative w-full aspect-[16/9] bg-[#e5e7eb] overflow-hidden">
                      <img
                        src={court.imageUrl}
                        alt={court.name}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-[#e8f7ee] text-[#15803d] text-[10px] font-semibold">
                          {isThai ? 'เปิดจอง' : 'Available'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleToggleFavoriteCourt(e, court.id)}
                        className="no-doodle absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#ffffff]/90 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform shadow-xs"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            favoriteCourtIds.includes(court.id)
                              ? 'fill-[#e85729] text-[#e85729]'
                              : 'text-[#111111]'
                          }`}
                        />
                      </button>

                      <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full bg-[#ffffff]/95 text-[#111111] text-xs font-semibold shadow-xs tabular-nums">
                        ฿{court.pricePerHour}/{isThai ? 'ชม.' : 'hr'}
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[14px] font-semibold text-[#111111] truncate">
                          {court.name}
                        </h3>
                        <span className="text-xs font-semibold text-[#111111] shrink-0">★ {court.rating}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <p className="text-[11px] text-[#71717a] flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-[#e85729] shrink-0" />
                          <span className="truncate">
                            {court.location} · {court.distanceKm} {isThai ? 'กม.' : 'km'}
                          </span>
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCourt(court);
                          }}
                          className="no-doodle px-3.5 py-1.5 rounded-full bg-gradient-to-b from-[#2b2b2e] to-[#111111] text-[#ffffff] text-[11px] font-medium cursor-pointer active:scale-95 transition-all shrink-0 whitespace-nowrap"
                        >
                          {isThai ? 'จองคอร์ทและล็อกเวลา' : 'Book & Lock Slot'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 10. BADMINTON FEED (Profile Page UI Layout Style) */}
        <BadmintonFeedSection />

        {/* 11. LIVE EVENTS SIMULATOR */}
        <div className="space-y-2">
          <SectionHeader
            title={isThai ? 'จำลองเหตุการณ์สด' : 'Live Event Simulator'}
            badge={isThai ? `แมตช์ถัดไป ${formatCountdown(countdownSeconds)}` : `Next ${formatCountdown(countdownSeconds)}`}
            badgeVariant="orange"
          />

          <div className="p-3 rounded-[22px] bg-[#ffffff] shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={triggerSampleInvite}
                className="px-3 py-2 rounded-[16px] border border-[#000000]/15 bg-[#e8f7ee] hover:bg-[#d8f2e3] text-[#000000] text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <span>⚔️</span>
                <span>{isThai ? 'เพื่อนท้าแข่ง' : 'Match Invite'}</span>
              </button>

              <button
                type="button"
                onClick={triggerSampleBookingConfirmation}
                className="px-3 py-2 rounded-[16px] border border-[#000000]/15 bg-[#f4f8fb] hover:bg-[#e5eef5] text-[#000000] text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <span>🎫</span>
                <span>{isThai ? 'จองคอร์ทสำเร็จ' : 'Booking Confirmed'}</span>
              </button>

              <button
                type="button"
                onClick={triggerSampleCountdownAlert}
                className="px-3 py-2 rounded-[16px] border border-[#000000]/15 bg-[#fff3ee] hover:bg-[#ffe4d8] text-[#e85729] text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <span>⏱️</span>
                <span>{isThai ? 'เตือนแมตช์ใกล้เริ่ม' : 'Upcoming Match'}</span>
              </button>

              <button
                type="button"
                onClick={triggerSamplePartyUpdate}
                className="px-3 py-2 rounded-[16px] border border-[#000000]/15 bg-[#f4f8fb] hover:bg-[#e5eef5] text-[#000000] text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
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
 gainExp(30, isThai ? 'อัปเดตระดับพลังงานวันนี้แล้ว' : `Updated mood: ${mood.toUpperCase()}`);
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
