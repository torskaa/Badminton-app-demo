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
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourtFacility } from '../../types';
import { playCoinSound, playSelectSound, playSmashSound } from '../../utils/retroAudio';
import { EnergyMoodModal, MoodEnergyLevel, MOOD_LEVELS } from '../common/EnergyMoodModal';
import { ProgressRingsWidget } from '../common/ProgressRingsWidget';
import { WeeklyCalendarWidget } from '../common/WeeklyCalendarWidget';
import { WorkoutDetailModal, WorkoutDetailData } from '../common/WorkoutDetailModal';

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

  // Primary 4 categories (Exact VibeMove 1-row layout)
  const primaryCategories = [
    { id: 'cat_courts', label: 'Courts', thai: 'คอร์ทแบด', icon: '🏸', screen: 'MAP', color: 'bg-[#55db9c]' },
    { id: 'cat_parties', label: 'Parties', thai: 'จอยก๊วน', icon: '👥', screen: 'E1', color: 'bg-[#ffd731]', badge: '28' },
    { id: 'cat_coach', label: 'AI Coach', thai: 'AI ซ้อม', icon: '🎯', screen: 'D1', color: 'bg-[#4da2ff]' },
    { id: 'cat_video', label: 'Video AI', thai: 'วิเคราะห์ AI', icon: '⚡', screen: 'D3', color: 'bg-[#e9ccff]' },
  ];

  // Additional categories shown when "See all >" is tapped
  const secondaryCategories = [
    { id: 'cat_tourn', label: 'Tournaments', thai: 'ทัวร์นาเมนต์', icon: '🏆', screen: 'E4', color: 'bg-[#fb4903]' },
    { id: 'cat_string', label: 'Stringing', thai: 'ขึ้นเอ็น 3D', icon: '🛠️', screen: 'F1', color: 'bg-[#ffffff]' },
    { id: 'cat_spar', label: 'Sparring', thai: 'สปาร์ริ่ง', icon: '⏱️', screen: 'C1', color: 'bg-[#ffd731]' },
    { id: 'cat_wallet', label: 'SmashPay', thai: 'กระเป๋าเงิน', icon: '🪙', screen: 'FINANCE', color: 'bg-[#55db9c]' },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] overflow-y-auto overscroll-contain no-scrollbar pb-28">
      {/* 1. Grab-Signature Header Nav Bar (Exact Grab App Layout from Reference Screenshot) */}
      <div className="bg-[#004d2c] text-[#ffffff] px-3.5 pt-3.5 pb-3 border-b border-[#000000] shadow-sm relative z-30">
        <div className="flex items-center gap-2.5">
          {/* A. QR / Barcode Scanner Squircle Button */}
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              navigateTo('MAP');
            }}
            className="w-10 h-10 rounded-[14px] bg-[#ffffff]/15 hover:bg-[#ffffff]/25 border border-[#ffffff]/20 flex items-center justify-center text-[#ffffff] cursor-pointer active:scale-95 transition-all shrink-0 shadow-xs"
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
              className="w-full h-10 px-3.5 rounded-[1600px] bg-[#ffffff] border border-[#000000]/15 flex items-center gap-2 cursor-pointer shadow-xs hover:bg-[#f9fafb] transition-colors"
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
              <div className="absolute top-12 left-0 right-0 z-50 bg-[#ffffff] rounded-[24px] border-2 border-[#000000] p-3 shadow-2xl space-y-2 animate-in fade-in zoom-in-95 text-[#000000]">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#000000]/10 text-[10px]">
                  <span className="font-black uppercase tracking-wider text-[#000000] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#5c4ade]" />
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
                <div className="flex flex-wrap gap-1.5 pt-1">
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
                      className="px-2.5 py-1 rounded-[1600px] bg-[#dceeff] border border-[#000000] text-[10px] font-bold hover:bg-[#c2e2ff]"
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
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffd731] via-[#f59e0b] to-[#d97706] border border-[#000000]/20 flex items-center justify-center text-[#ffffff] font-black text-sm shadow-xs cursor-pointer active:scale-95 transition-transform shrink-0"
            title={isThai ? 'เหรียญสแมชเพย์' : 'SmashRewards (120 Coins)'}
          >
            <span className="font-['Antonio',sans-serif] text-base drop-shadow-xs font-black">G</span>
          </button>

          {/* D. Circular Profile Avatar Button */}
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              navigateTo('F1');
            }}
            className="w-9 h-9 rounded-full bg-[#dceeff] border-2 border-[#ffffff] overflow-hidden flex items-center justify-center cursor-pointer active:scale-95 transition-transform shrink-0 shadow-xs relative"
            title={isThai ? 'โปรไฟล์ผู้ใช้' : 'User Profile'}
          >
            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt={player.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#00b14f] flex items-center justify-center text-[#ffffff]">
                <User className="w-5 h-5 fill-current" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Dual Quick Info Cards (Matching Grab reference: View Balance / Ride to) */}
      <div className="px-4 pt-3">
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: View Balance / SmashPay Wallet */}
          <div
            onClick={() => {
              playSelectSound();
              navigateTo('FINANCE');
            }}
            className="p-3 rounded-[20px] bg-[#ffffff] border border-[#000000] shadow-xs flex items-center justify-between gap-2 cursor-pointer hover:bg-[#fafafa] active:scale-98 transition-all"
          >
            <div className="min-w-0">
              <span className="text-[10px] text-[#000000]/60 font-semibold block leading-tight truncate">
                {isThai ? 'ยอดเงินคงเหลือ' : 'View Balance'}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs font-black text-[#000000] font-['Antonio',sans-serif] uppercase tracking-wide truncate">
                  {isThai ? 'กระเป๋าเงินสแมชเพย์' : 'SmashPay Wallet'}
                </span>
              </div>
              <span className="text-[11px] font-black text-[#004d2c] block font-['Antonio',sans-serif]">
                ฿1,250.00
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#55db9c]/20 border border-[#000000]/10 flex items-center justify-center text-base shrink-0">
              💳
            </div>
          </div>

          {/* Card 2: Next Match / Ride to */}
          <div
            onClick={() => {
              playSelectSound();
              navigateTo('B4');
            }}
            className="p-3 rounded-[20px] bg-[#ffffff] border border-[#000000] shadow-xs flex items-center justify-between gap-2 cursor-pointer hover:bg-[#fafafa] active:scale-98 transition-all"
          >
            <div className="min-w-0">
              <span className="text-[10px] text-[#fb4903] font-black block leading-tight truncate">
                {isThai ? 'นัดหมายถัดไป' : 'Next Match'}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs font-black text-[#000000] font-['Antonio',sans-serif] uppercase tracking-wide truncate">
                  {isThai ? 'เมทริส ลาดพร้าว' : 'Metris Ladprao'}
                </span>
              </div>
              <span className="text-[10px] text-[#000000]/65 font-bold block truncate">
                {isThai ? 'วันนี้ 19:00 · คอร์ท 3' : 'Today 19:00 · Court 3'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#ffd731]/20 border border-[#000000]/10 flex items-center justify-center text-base shrink-0">
              🏸
            </div>
          </div>
        </div>
      </div>

      {/* Main Body with Clean Proportions (Faithful to VibeMove video 00:01 - 00:03) */}
      <div className="px-4 pt-3.5 space-y-4">
        {/* 2. HERO VIBE CARD ("Not sure what you want to train today?") */}
        <div className="rounded-[28px] bg-[#243b34] text-[#ffffff] border-2 border-[#000000] p-4 relative overflow-hidden shadow-md flex flex-col justify-between space-y-3.5">
          {/* Top Row: Headings & Waving Mascot */}
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="space-y-1 max-w-[70%]">
              <h2 className="text-lg font-black leading-tight text-[#ffffff] font-['Antonio',sans-serif] uppercase tracking-wide">
                {isThai ? (
                  <>
                    ยังไม่แน่ใจว่าจะ<span className="font-serif italic font-normal text-[#ffd731] underline decoration-[#ffd731] decoration-1">ฝึกซ้อม</span>อะไร<span className="font-serif italic font-normal text-[#55db9c] underline decoration-[#55db9c] decoration-1">วันนี้</span>?
                  </>
                ) : (
                  <>
                    Not sure <span className="font-serif italic font-normal text-[#ffd731] underline decoration-[#ffd731] decoration-1">what</span> you want to <span className="font-serif italic font-normal text-[#55db9c] underline decoration-[#55db9c] decoration-1">train</span> today?
                  </>
                )}
              </h2>
              <p className="text-[11px] text-[#ffffff]/80 font-normal leading-relaxed pt-0.5">
                {isThai
                  ? 'บอกความรู้สึกของคุณ แล้วเราจะแนะนำการฝึกซ้อมที่เข้ากับพลังงานและอารมณ์ของคุณ'
                  : "Tell us how you feel, we'll recommend workouts matching your energy & mood."}
              </p>
            </div>

            {/* Cute Illustrated Mascot */}
            <div className="w-16 h-16 shrink-0 relative mt-0.5">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <polygon
                  points="50,5 57,18 71,9 72,23 87,20 81,33 95,38 84,48 96,58 82,63 89,76 74,74 72,89 60,81 50,92 40,81 28,89 26,74 11,76 18,63 4,58 16,48 5,38 19,33 13,20 28,23 29,9 43,18"
                  fill="#ffd731"
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
                <line x1="20" y1="46" x2="10" y2="35" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="35" x2="6" y2="28" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="35" x2="14" y2="28" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Wide Pill Button: "Find my match" */}
          <div className="relative z-10 pt-1">
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setIsEnergyModalOpen(true);
              }}
              className="w-full py-2.5 rounded-[1600px] bg-[#ffffff] hover:bg-[#f0f0f0] text-[#000000] border-2 border-[#000000] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-transform shadow-xs"
            >
              <span>{isThai ? 'ค้นหาการฝึกที่ใช่' : 'Find my match'}</span>
              <span className="text-[10px] text-[#000000]/60 font-bold">
                ({isThai ? activeMoodConfig.thaiLabel : activeMoodConfig.label})
              </span>
            </button>
          </div>
        </div>

        {/* 3. CATEGORIES SECTION (1 Clean Proportioned Row of 4 Squircles with "See all >") */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#000000] uppercase tracking-wide font-['Antonio',sans-serif]">
              {isThai ? 'หมวดหมู่บริการ' : 'Categories'}
            </h2>
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setShowAllCategories(!showAllCategories);
              }}
              className="text-xs font-bold text-[#000000]/70 hover:text-[#000000] flex items-center gap-0.5 cursor-pointer"
            >
              <span>{isThai ? (showAllCategories ? 'ย่อลง' : 'ดูทั้งหมด') : (showAllCategories ? 'Show less' : 'See all')}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllCategories ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {/* Primary 4 squircle cards */}
          <div className="grid grid-cols-4 gap-2.5">
            {primaryCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  playSelectSound();
                  navigateTo(cat.screen as any);
                }}
                className="p-2.5 rounded-[22px] bg-[#ffffff] border border-[#000000] flex flex-col items-center justify-between aspect-square hover:bg-[#f9fafb] active:scale-95 transition-all cursor-pointer shadow-xs relative"
              >
                {cat.badge && (
                  <span className="absolute -top-1 right-1 px-1.5 py-0.2 rounded-[1600px] bg-[#fb4903] text-[#ffffff] border border-[#000000] text-[8px] font-black">
                    {cat.badge}
                  </span>
                )}
                <div
                  className={`w-9 h-9 rounded-[1600px] border border-[#000000] flex items-center justify-center text-lg mt-0.5 ${cat.color}`}
                >
                  {cat.icon}
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-black text-[#000000] block leading-tight">
                    {isThai ? cat.thai : cat.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Expandable secondary categories when user clicks "See all >" */}
          {showAllCategories && (
            <div className="grid grid-cols-4 gap-2.5 pt-1 animate-in fade-in zoom-in-95">
              {secondaryCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    navigateTo(cat.screen as any);
                  }}
                  className="p-2.5 rounded-[22px] bg-[#ffffff] border border-[#000000] flex flex-col items-center justify-between aspect-square hover:bg-[#f9fafb] active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  <div
                    className={`w-9 h-9 rounded-[1600px] border border-[#000000] flex items-center justify-center text-lg mt-0.5 ${cat.color}`}
                  >
                    {cat.icon}
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-black text-[#000000] block leading-tight">
                      {isThai ? cat.thai : cat.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
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

        {/* 5. VIEW SELECTOR TABS (Well-proportioned switcher to keep layout clean & balanced) */}
        <div className="flex items-center gap-1.5 p-1 rounded-[1600px] bg-[#ffffff] border border-[#000000]">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setActiveSubTab('today');
            }}
            className={`flex-1 py-1.5 rounded-[1600px] text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
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
            className={`flex-1 py-1.5 rounded-[1600px] text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
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
            className={`flex-1 py-1.5 rounded-[1600px] text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'courts'
                ? 'bg-[#000000] text-[#ffffff] shadow-xs'
                : 'text-[#000000]/60 hover:text-[#000000]'
            }`}
          >
            {isThai ? 'สนามทั้งหมด' : 'Courts'}
          </button>
        </div>

        {/* TAB 1: TODAY'S SESSIONS (Fits your mood today - Video 00:02 & 00:11 layout) */}
        {activeSubTab === 'today' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-[#000000] uppercase tracking-wide font-['Antonio',sans-serif]">
                {isThai ? 'เซสชันที่เหมาะกับคุณ' : 'Fits your mood today'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  setIsEnergyModalOpen(true);
                }}
                className="text-xs font-bold text-[#fb4903] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>{isThai ? 'เปลี่ยนอารมณ์' : 'Change my mood'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Large Prominent Hero Session Card (Video 00:11 Style) */}
            <div
              onClick={() => {
                playSelectSound();
                setIsWorkoutDetailOpen(true);
              }}
              className="w-full bg-[#ffffff] rounded-[28px] border-2 border-[#000000] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              {/* Media Preview Container with Overlay Controls */}
              <div className="relative w-full aspect-[16/10] bg-[#243b34] overflow-hidden border-b border-[#000000]">
                <img
                  src={currentWorkout.videoPreviewUrl}
                  alt={isThai ? currentWorkout.titleTh : currentWorkout.titleEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-[#000000]/30 pointer-events-none" />

                {/* Top Badge & Heart */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#000000]/70 backdrop-blur-xs text-[#ffffff] border border-[#ffffff]/30 text-[9px] font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#fb4903]" />
                    <span>{isThai ? currentWorkout.intensityLabelTh : currentWorkout.intensityLabelEn}</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playCoinSound();
                      setIsHeroWorkoutFavorited(!isHeroWorkoutFavorited);
                    }}
                    className="w-8 h-8 rounded-full bg-[#ffffff]/90 backdrop-blur-xs border border-[#000000] flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-transform shadow-xs"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isHeroWorkoutFavorited ? 'fill-[#fb4903] text-[#fb4903]' : 'text-[#000000]'
                      }`}
                    />
                  </button>
                </div>

                {/* Center "Start Training" Button (Exact VibeMove video 00:11!) */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSmashSound();
                      gainExp(50, isThai ? `เริ่มการฝึกซ้อม: ${currentWorkout.titleTh}` : `Start training: ${currentWorkout.titleEn}`);
                      navigateTo('C1');
                    }}
                    className="w-full py-2.5 rounded-[1600px] bg-[#fb4903] hover:bg-[#ff5a1a] text-[#ffffff] border border-[#000000] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isThai ? 'เริ่มการฝึกซ้อม' : 'Start training'}</span>
                  </button>
                </div>
              </div>

              {/* Session Text Details below Media */}
              <div className="p-3.5 pt-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-['Antonio',sans-serif] text-base font-black text-[#000000] uppercase tracking-wide leading-tight line-clamp-1">
                    {isThai ? currentWorkout.titleTh : currentWorkout.titleEn}
                  </h3>
                  <span className="text-xs font-black text-[#000000] bg-[#ffd731] border border-[#000000] px-2 py-0.5 rounded-full shrink-0">
                    ★ {currentWorkout.rating}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#000000]/70">
                  <Clock className="w-3.5 h-3.5 text-[#5c4ade] shrink-0" />
                  <span>{isThai ? currentWorkout.scheduleTh : currentWorkout.scheduleEn}</span>
                  <span>·</span>
                  <span className="truncate">{isThai ? currentWorkout.courtNameTh : currentWorkout.courtNameEn}</span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  {((isThai ? currentWorkout.tagsTh : currentWorkout.tagsEn) || currentWorkout.tags).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 rounded-[1600px] bg-[#dceeff] border border-[#000000] text-[#000000] text-[9px] font-bold shrink-0 whitespace-nowrap"
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
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-[#000000] uppercase tracking-wide font-['Antonio',sans-serif]">
                {isThai ? 'สนามใกล้คุณ' : 'Courts Near You'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  navigateTo('MAP');
                }}
                className="text-xs font-bold text-[#000000] hover:underline flex items-center gap-0.5"
              >
                <span>{isThai ? 'เปิดแผนที่' : 'Open Map'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {courts.slice(0, 3).map((court) => (
                <div
                  key={court.id}
                  onClick={() => handleSelectCourt(court)}
                  className="bg-[#ffffff] rounded-[24px] overflow-hidden border border-[#000000] shadow-xs cursor-pointer hover:shadow-md transition-all active:scale-99"
                >
                  <div className="relative w-full aspect-[16/9] bg-[#e5e7eb] overflow-hidden border-b border-[#000000]">
                    <img
                      src={court.imageUrl}
                      alt={court.name}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-[9px] font-black">
                        {isThai ? 'เปิดจอง' : 'Available'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleToggleFavoriteCourt(e, court.id)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#ffffff] border border-[#000000] flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-transform shadow-sm"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          favoriteCourtIds.includes(court.id)
                            ? 'fill-[#fb4903] text-[#fb4903]'
                            : 'text-[#000000]'
                        }`}
                      />
                    </button>

                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-[1600px] bg-[#ffd731] text-[#000000] border border-[#000000] text-xs font-black">
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
                    <p className="text-[10px] text-[#000000]/60 font-semibold truncate">
                      {court.location} · {court.distanceKm} {isThai ? 'กม.' : 'km'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Compact Live Simulator Bar (Convenient testing triggers for notification banners) */}
        <div className="p-2.5 rounded-[22px] bg-[#ffffff] border border-[#000000] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#55db9c] animate-pulse" />
              <span className="font-['Antonio',sans-serif] font-black uppercase tracking-wider text-[#000000]">
                {isThai ? '⚡ จำลองเหตุการณ์สด' : '⚡ LIVE EVENTS SIMULATOR'}
              </span>
            </div>
            <span className="font-bold text-[#fb4903]">
              {isThai ? `⏱️ แมตช์ถัดไป ${formatCountdown(countdownSeconds)}` : `⏱️ Next match in ${formatCountdown(countdownSeconds)}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={triggerSampleInvite}
              className="px-2.5 py-1 rounded-[1600px] bg-[#ffd731] hover:bg-[#ffe366] text-[#000000] border border-[#000000] text-[10px] font-black tracking-wide flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              <span>⚔️</span>
              <span>{isThai ? 'เพื่อนท้าแข่ง' : 'Match Invite'}</span>
            </button>

            <button
              type="button"
              onClick={triggerSampleBookingConfirmation}
              className="px-2.5 py-1 rounded-[1600px] bg-[#55db9c] hover:bg-[#6be4ab] text-[#000000] border border-[#000000] text-[10px] font-black tracking-wide flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              <span>🎫</span>
              <span>{isThai ? 'จองคอร์ทสำเร็จ' : 'Booking Confirmed'}</span>
            </button>

            <button
              type="button"
              onClick={triggerSampleCountdownAlert}
              className="px-2.5 py-1 rounded-[1600px] bg-[#fb4903] hover:bg-[#ff6122] text-[#ffffff] border border-[#000000] text-[10px] font-black tracking-wide flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              <span>⏱️</span>
              <span>{isThai ? 'เตือนแมตช์ใกล้เริ่ม' : 'Upcoming Match'}</span>
            </button>

            <button
              type="button"
              onClick={triggerSamplePartyUpdate}
              className="px-2.5 py-1 rounded-[1600px] bg-[#e9ccff] hover:bg-[#dfb3ff] text-[#000000] border border-[#000000] text-[10px] font-black tracking-wide flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              <span>👥</span>
              <span>{isThai ? 'อัปเดตก๊วนสด' : 'Party Update'}</span>
            </button>
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
