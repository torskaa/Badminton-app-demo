import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Sparkles, Zap, Flame, Wind, Smile, BatteryCharging, X } from 'lucide-react';
import { playSelectSound, playSmashSound, playCoinSound } from '../../utils/retroAudio';
import { useApp } from '../../context/AppContext';

export type MoodEnergyLevel = 'tense' | 'calm' | 'balanced' | 'energized' | 'high_energy';

export interface MoodConfig {
 id: MoodEnergyLevel;
 label: string;
 thaiLabel: string;
 badge: string;
 badgeTh?: string;
 color: string;
 bgColor: string;
 cardBg: string;
 headline: string;
 headlineTh?: string;
 description: string;
 descriptionEn?: string;
 badmintonFocus: string;
 badmintonFocusEn?: string;
 recommendedType: string;
 recommendedTypeTh?: string;
}

export const MOOD_LEVELS: MoodConfig[] = [
 {
 id: 'tense',
 label: 'Tense',
 thaiLabel: 'เมื่อยล้า',
 badge: 'Stretching & Recovery',
 badgeTh: 'ยืดเหยียดฟื้นฟู',
 color: '#8b5cf6',
 bgColor: 'bg-[#ede9fe]',
 cardBg: 'bg-[#2a233c]',
 headline: 'You feel a bit tight. Let’s loosen up and reset.',
 headlineTh: 'กล้ามเนื้อตึงล้า มายืดเหยียดและรีเซ็ตกัน',
 description: 'รู้สึกตึงล้าจากงานหรือการซ้อมหนัก เหมาะกับการวอร์มอัปยืดเส้น โฟกัสหัวไหล่ ข้อมือ และฟุตเวิร์กเบาๆ',
 descriptionEn: 'Muscles feel tight or tired. Best for gentle warm-ups, shoulder mobility, wrist release, and light footwork.',
 badmintonFocus: 'เซฟโต้ช้าๆ, ยืดหยุ่น, หยอดหน้าเน็ต',
 badmintonFocusEn: 'Slow rally, flexibility, gentle net drops',
 recommendedType: 'Recovery & Flexibility Drill',
 recommendedTypeTh: 'การฝึกยืดเหยียดและฟื้นฟู',
 },
 {
 id: 'calm',
 label: 'Calm',
 thaiLabel: 'ผ่อนคลาย',
 badge: 'Mindful & Flow',
 badgeTh: 'สมาธิและการเคลื่อนไหว',
 color: '#ec4899',
 bgColor: 'bg-[#fce7f3]',
 cardBg: 'bg-[#2b3a35]',
 headline: 'You feel relaxed and grounded. Looking for mindful movement.',
 headlineTh: 'รู้สึกสงบและผ่อนคลาย พร้อมสำหรับการเคลื่อนไหวที่นุ่มนวล',
 description: 'คุณรู้สึกสงบ ผ่อนคลาย และมีสมาธิ เหมาะกับการตีแรลลี่ยาวๆ เซฟลูกข้ามแดน ควบคุมวิถีลูกโดยไม่เน้นความเร็ว',
 descriptionEn: 'Feeling calm and centered. Ideal for long continuous rallies, lift control, and consistent court positioning.',
 badmintonFocus: 'แรลลี่ 30 ช็อตต่อเนื่อง, คุมทิศทาง',
 badmintonFocusEn: '30-shot rallies, precision placement',
 recommendedType: 'Flow Rally & Net Placement',
 recommendedTypeTh: 'แรลลี่ต่อเนื่องและวางลูกหน้าเน็ต',
 },
 {
 id: 'balanced',
 label: 'Balanced',
 thaiLabel: 'สมดุล',
 badge: 'Core & Control',
 badgeTh: 'แกนกลางและการควบคุม',
 color: '#10b981',
 bgColor: 'bg-[#d1fae5]',
 cardBg: 'bg-[#1e2e42]',
 headline: 'You feel focused. A good moment for controlled, full-body training.',
 headlineTh: 'มีสมาธิคงที่ เหมาะสำหรับการซ้อมแบบรอบด้าน',
 description: 'คุณมีสมาธิดีและพลังงานคงที่ เหมาะสำหรับการลงทีมคู่ ซ้อมเกมรับสลับเกมบุก เล่นตามแท็กติก',
 descriptionEn: 'Good focus and steady energy. Perfect for tactical doubles, transitioning between defense and offense.',
 badmintonFocus: 'เกมคู่ผสม, สลับรับบุก, ฟุตเวิร์ก 6 มุม',
 badmintonFocusEn: 'Tactical doubles, transition play, 6-corner footwork',
 recommendedType: 'Tactical Doubles & Drill Mix',
 recommendedTypeTh: 'เกมคู่แท็กติกและการฝึกผสม',
 },
 {
 id: 'energized',
 label: 'Energized',
 thaiLabel: 'พลังเต็ม',
 badge: 'Dynamic & Power',
 badgeTh: 'พลังและจังหวะเร็ว',
 color: '#ffd731',
 bgColor: 'bg-[#fef9c3]',
 cardBg: 'bg-[#3b2a4a]',
 headline: 'You feel active. Time for dynamic workouts and higher intensity.',
 headlineTh: 'ฟอร์มกำลังเข้าฝัก พร้อมระเบิดพลังและสปีด',
 description: 'กล้ามเนื้อพร้อมระเบิดพลัง อยากกระโดดตบสแมช วิ่งไล่เก็บทุกลูก และดวลแมตช์สปีดเร็วกับคู่แข่งฝีมือสูสี',
 descriptionEn: 'Muscles primed for high output. Ready for jump smashes, high-tempo exchanges, and intense sparring.',
 badmintonFocus: 'Jump Smash 340+ km/h, ดักหน้าเน็ต, สปีดสูง',
 badmintonFocusEn: 'Jump smashes 340+ km/h, aggressive net intercepts, fast pace',
 recommendedType: 'High-Speed Sparring & Smash Battle',
 recommendedTypeTh: 'สปาร์ริ่งสปีดสูงและดวลลูกตบ',
 },
 {
 id: 'high_energy',
 label: 'High energy',
 thaiLabel: 'บีสต์โหมด',
 badge: 'Peak Performance',
 badgeTh: 'ขีดสุดสมรรถนะ',
 color: '#fb4903',
 bgColor: 'bg-[#ffedd5]',
 cardBg: 'bg-[#40201d]',
 headline: 'You are on fire! Let’s push limits with maximum power.',
 headlineTh: 'อะดรีนาลีนเต็มพิกัด พร้อมทลายขีดจำกัด',
 description: 'พร้อมลงแข่งขันจริง ซ้อม AI Drills สปีดเต็มพิกัด และเผาผลาญแคลอรี่ทะลุ 700+ กิโลแคลอรี',
 descriptionEn: 'Adrenaline pumping! Ready for full competitive intensity, AI speed drills, and 700+ kcal burn.',
 badmintonFocus: 'AI Footwork Speed Drill, แมตช์ 3 เซ็ต, คาร์ดิโอหนัก',
 badmintonFocusEn: 'AI footwork speed drill, full 3-set match, intense cardio',
 recommendedType: 'Tournament Intensity & Cardio Burn',
 recommendedTypeTh: 'ทัวร์นาเมนต์เต็มแม็กซ์และเบิร์นหนัก',
 },
];

interface EnergyMoodModalProps {
 isOpen: boolean;
 onClose: () => void;
 selectedMood: MoodEnergyLevel;
 onSelectMood: (mood: MoodEnergyLevel) => void;
 playerName: string;
}

export const EnergyMoodModal: React.FC<EnergyMoodModalProps> = ({
 isOpen,
 onClose,
 selectedMood,
 onSelectMood,
 playerName,
}) => {
 const { language } = useApp();
 const isThai = language === 'th';
 const [activeMoodId, setActiveMoodId] = useState<MoodEnergyLevel>(selectedMood);

 if (!isOpen) return null;

 const currentConfig = MOOD_LEVELS.find((m) => m.id === activeMoodId) || MOOD_LEVELS[3];

 const handleMoodClick = (moodId: MoodEnergyLevel) => {
 setActiveMoodId(moodId);
 playSelectSound();
 };

 const handleConfirm = () => {
 playSmashSound();
 onSelectMood(activeMoodId);
 onClose();
 };

 // Render Illustrated Mascot based on VibeMove Video / Webp reference
 const renderMascot = () => {
 switch (activeMoodId) {
 case 'tense':
 return (
 <motion.div
 key="tense"
 initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
 animate={{ scale: 1, opacity: 1, rotate: 0 }}
 exit={{ scale: 0.8, opacity: 0 }}
 transition={{ type: 'spring', stiffness: 300, damping: 20 }}
 className="w-44 h-48 flex items-center justify-center relative"
 >
 {/* Purple Spiky Hexagon Mascot with Band */}
 <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-md">
 {/* Legs with black shoes */}
 <line x1="85" y1="170" x2="85" y2="200" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
 <line x1="115" y1="170" x2="115" y2="200" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
 <ellipse cx="78" cy="202" rx="14" ry="7" fill="#000000" />
 <ellipse cx="122" cy="202" rx="14" ry="7" fill="#000000" />

 {/* Head / Body Shape (Spiky polygon) */}
 <polygon
 points="100,20 145,45 165,95 140,145 100,165 60,145 35,95 55,45"
 fill="#d8b4fe"
 stroke="#000000"
 strokeWidth="4"
 />
 {/* Cute Eyes & Focused expression */}
 <ellipse cx="80" cy="85" rx="4" ry="6" fill="#000000" />
 <ellipse cx="120" cy="85" rx="4" ry="6" fill="#000000" />
 <line x1="95" y1="88" x2="105" y2="88" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
 {/* Stretchy Resistance Band in Arms */}
 <path
 d="M 50,115 Q 100,145 150,115"
 fill="none"
 stroke="#fb4903"
 strokeWidth="7"
 strokeLinecap="round"
 />
 {/* Arms holding the band */}
 <path
 d="M 55,100 Q 65,120 50,115"
 fill="none"
 stroke="#000000"
 strokeWidth="5"
 strokeLinecap="round"
 />
 <path
 d="M 145,100 Q 135,120 150,115"
 fill="none"
 stroke="#000000"
 strokeWidth="5"
 strokeLinecap="round"
 />
 </svg>
 </motion.div>
 );

 case 'calm':
 return (
 <motion.div
 key="calm"
 initial={{ scale: 0.8, opacity: 0, y: 10 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.8, opacity: 0 }}
 transition={{ type: 'spring', stiffness: 300, damping: 20 }}
 className="w-44 h-48 flex items-center justify-center relative"
 >
 {/* Pink Hexagon Mascot with crossed arms (Faithful to video 00:04) */}
 <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-md">
 {/* Straight legs */}
 <line x1="85" y1="168" x2="85" y2="202" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
 <line x1="115" y1="168" x2="115" y2="202" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
 <ellipse cx="78" cy="204" rx="14" ry="7" fill="#000000" />
 <ellipse cx="122" cy="204" rx="14" ry="7" fill="#000000" />

 {/* Pink Hexagon Body */}
 <polygon
 points="100,25 155,55 155,130 100,165 45,130 45,55"
 fill="#f472b6"
 stroke="#000000"
 strokeWidth="4"
 />
 {/* Peaceful closed eyes */}
 <path d="M 72,85 Q 82,92 92,85" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
 <path d="M 108,85 Q 118,92 128,85" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
 {/* Cute nose & tiny smile */}
 <line x1="100" y1="92" x2="100" y2="102" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
 <ellipse cx="100" cy="112" rx="3.5" ry="4" fill="#000000" />

 {/* Crossed Arms resting calmly in oval */}
 <ellipse cx="100" cy="148" rx="42" ry="18" fill="#a7f3d0" stroke="#000000" strokeWidth="3.5" />
 <path d="M 75,142 Q 95,152 110,140" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
 <path d="M 85,152 Q 105,160 125,148" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />

 {/* Floating calm ball */}
 <circle cx="152" cy="145" r="11" fill="#e07a5f" stroke="#000000" strokeWidth="2.5" />
 </svg>
 </motion.div>
 );

 case 'balanced':
 return (
 <motion.div
 key="balanced"
 initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
 animate={{ scale: 1, opacity: 1, rotate: 0 }}
 exit={{ scale: 0.8, opacity: 0 }}
 transition={{ type: 'spring', stiffness: 300, damping: 20 }}
 className="w-44 h-48 flex items-center justify-center relative"
 >
 {/* Green 4-Leaf Meditating Mascot (Faithful to video 00:06) */}
 <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-md">
 {/* Cross-legged meditation pose */}
 <path
 d="M 60,175 Q 100,195 140,175 Q 150,190 120,198 Q 100,202 80,198 Q 50,190 60,175"
 fill="#000000"
 />
 {/* 4-leaf clover shaped character body */}
 <path
 d="M 100,40 
 C 120,15 150,15 155,45 
 C 160,75 140,90 155,115 
 C 170,140 145,165 120,155 
 C 95,145 80,165 55,150 
 C 30,135 40,105 45,85 
 C 50,65 30,35 60,25 
 C 85,18 90,35 100,40 Z"
 fill="#86efac"
 stroke="#000000"
 strokeWidth="4"
 />
 {/* Zen closed eyes & smile */}
 <path d="M 75,85 Q 85,80 95,85" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
 <path d="M 105,85 Q 115,80 125,85" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
 <path d="M 96,98 Q 100,104 104,98" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
 {/* Meditating arms (Chin Mudra fingers) */}
 <path
 d="M 62,105 Q 45,130 65,145 Q 85,148 78,135"
 fill="none"
 stroke="#000000"
 strokeWidth="3.5"
 strokeLinecap="round"
 />
 <path
 d="M 138,105 Q 155,130 135,145 Q 115,148 122,135"
 fill="none"
 stroke="#000000"
 strokeWidth="3.5"
 strokeLinecap="round"
 />
 {/* Floating balance ball */}
 <circle cx="152" cy="148" r="10" fill="#e07a5f" stroke="#000000" strokeWidth="2.5" />
 </svg>
 </motion.div>
 );

 case 'energized':
 return (
 <motion.div
 key="energized"
 initial={{ scale: 0.8, opacity: 0, y: -10 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.8, opacity: 0 }}
 transition={{ type: 'spring', stiffness: 300, damping: 20 }}
 className="w-48 h-48 flex items-center justify-center relative"
 >
 {/* Yellow Sun Mascot with Sneakers giving Peace Sign (Exact VibeMove video mascot 00:07!) */}
 <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-md">
 {/* Dancing stick legs */}
 <path d="M 85,145 Q 80,175 70,195" fill="none" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
 <path d="M 120,145 Q 130,170 145,185" fill="none" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
 {/* Sneakers with laces */}
 <ellipse cx="60" cy="198" rx="15" ry="7" fill="#000000" />
 <ellipse cx="152" cy="188" rx="15" ry="7" fill="#000000" />

 {/* Spiky Sun Rays */}
 <polygon
 points="100,10 115,35 142,18 145,45 175,40 162,65 190,75 168,95 192,115 165,125 178,152 148,148 145,178 120,162 100,185 80,162 55,178 52,148 22,152 35,125 8,115 32,95 10,75 38,65 25,40 55,45 58,18 85,35"
 fill="#ffd731"
 stroke="#000000"
 strokeWidth="4"
 />
 {/* Smiling Happy Face */}
 <ellipse cx="80" cy="85" rx="5" ry="7" fill="#000000" />
 <ellipse cx="120" cy="85" rx="5" ry="7" fill="#000000" />
 <path d="M 85,108 Q 100,125 115,108" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" />

 {/* Left hand giving PEACE SIGN ✌️ */}
 <path
 d="M 52,95 Q 35,75 30,55"
 fill="none"
 stroke="#000000"
 strokeWidth="4"
 strokeLinecap="round"
 />
 {/* Peace fingers */}
 <line x1="30" y1="55" x2="22" y2="38" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
 <line x1="30" y1="55" x2="35" y2="38" stroke="#000000" strokeWidth="4" strokeLinecap="round" />

 {/* Right hand holding tiny badminton racket */}
 <path
 d="M 148,95 Q 168,85 175,70"
 fill="none"
 stroke="#000000"
 strokeWidth="4"
 strokeLinecap="round"
 />
 <line x1="175" y1="70" x2="190" y2="55" stroke="#000000" strokeWidth="3" />
 <ellipse cx="196" cy="48" rx="8" ry="11" fill="none" stroke="#fb4903" strokeWidth="2.5" />
 </svg>
 </motion.div>
 );

 case 'high_energy':
 return (
 <motion.div
 key="high_energy"
 initial={{ scale: 0.8, opacity: 0, rotate: 10 }}
 animate={{ scale: 1, opacity: 1, rotate: 0 }}
 exit={{ scale: 0.8, opacity: 0 }}
 transition={{ type: 'spring', stiffness: 300, damping: 20 }}
 className="w-48 h-48 flex items-center justify-center relative"
 >
 {/* Fiery High Energy Shuttlecock Mascot */}
 <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-md">
 {/* Lightning / Fire Aura */}
 <path
 d="M 100,15 Q 130,5 125,35 Q 165,25 150,60 Q 185,75 160,110 Q 185,145 140,165 Q 100,195 60,165 Q 15,145 40,110 Q 15,75 50,60 Q 35,25 75,35 Z"
 fill="#fb4903"
 stroke="#000000"
 strokeWidth="4"
 />
 {/* Golden Shuttlecock Core */}
 <circle cx="100" cy="135" r="28" fill="#ffd731" stroke="#000000" strokeWidth="3.5" />
 {/* Badminton Feathers on top */}
 <polygon points="75,115 100,45 125,115" fill="#ffffff" stroke="#000000" strokeWidth="3" />
 <line x1="88" y1="115" x2="100" y2="45" stroke="#000000" strokeWidth="2" />
 <line x1="112" y1="115" x2="100" y2="45" stroke="#000000" strokeWidth="2" />

 {/* Fierce Champion Eyes & Sweatband */}
 <rect x="76" y="122" width="48" height="8" rx="4" fill="#000000" />
 <ellipse cx="88" cy="136" rx="4" ry="5" fill="#000000" />
 <ellipse cx="112" cy="136" rx="4" ry="5" fill="#000000" />
 <path d="M 92,148 Q 100,154 108,148" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />

 {/* Running Sneakers */}
 <path d="M 80,165 L 70,195" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
 <path d="M 120,165 L 135,190" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
 <ellipse cx="60" cy="198" rx="14" ry="7" fill="#000000" />
 <ellipse cx="145" cy="192" rx="14" ry="7" fill="#000000" />
 </svg>
 </motion.div>
 );
 }
 };

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#000000]/60 backdrop-blur-xs select-none">
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 transition={{ type: 'spring', stiffness: 350, damping: 28 }}
 className="w-full max-w-sm bg-[#ffffff] rounded-[32px] shadow-2xl flex flex-col overflow-hidden max-h-[92vh]"
 >
 {/* Top Bar with Back Button (from video) */}
 <div className="px-4 pt-3.5 pb-2 flex items-center justify-between ">
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 onClose();
 }}
 className="w-8 h-8 rounded-[1600px] bg-[#f3f4f6] hover:bg-[#e5e7eb] border border-[#000000] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
 >
 <ArrowLeft className="w-4 h-4 text-[#000000]" />
 </button>

 <span className="text-xs font-black uppercase tracking-wider text-[#000000] font-['Antonio',sans-serif]">
 {isThai ? 'ระดับพลังงานวันนี้' : "Today's Energy Level"}
 </span>

 <button
 type="button"
 onClick={() => {
 playSelectSound();
 onClose();
 }}
 className="w-8 h-8 rounded-[1600px] bg-[#f3f4f6] hover:bg-[#e5e7eb] border border-[#000000] flex items-center justify-center cursor-pointer active:scale-95 transition-transform text-[#000000]"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Scrollable Body */}
 <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3.5">
 {/* Header Question (with Serif Italic Accent like VibeMove) */}
 <div className="text-center space-y-1">
 <h2 className="text-lg font-black text-[#000000] leading-tight">
 {isThai ? (
 <>
 {playerName}, วันนี้คุณ<span className="font-serif italic font-normal underline decoration-[#ffd731] decoration-2">รู้สึกอย่างไร</span>บ้าง?
 </>
 ) : (
 <>
 {playerName}, how do you <span className="font-serif italic font-normal underline decoration-[#ffd731] decoration-2">feel right</span> now?
 </>
 )}
 </h2>
 <p className="text-[11px] text-[#000000]/70 font-bold">
 {isThai
 ? 'เลือกพลังงานของคุณวันนี้ แล้วระบบจะแนะนำการฝึกซ้อมที่เข้ากับคุณ'
 : "Tell us how you feel, we'll recommend workouts matching your energy."}
 </p>
 </div>

 {/* Central Illustrated Mascot Card (VibeMove style in Slush CI) */}
 <div
 className={`w-full rounded-[28px] shadow-md p-4 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300 ${currentConfig.cardBg}`}
 style={{ minHeight: '220px' }}
 >
 {/* Subtle background ambient ring */}
 <div
 className="absolute inset-0 opacity-15 pointer-events-none"
 style={{
 background: `radial-gradient(circle at center, ${currentConfig.color} 0%, transparent 70%)`,
 }}
 />

 {/* Tag / Category Badge */}
 <div className="absolute top-3 left-3 z-10">
 <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#ffffff] text-[#000000] text-[9px] font-black uppercase tracking-wider shadow-xs">
 {isThai ? (currentConfig.badgeTh || currentConfig.badge) : currentConfig.badge}
 </span>
 </div>

 {/* Render Animated Mascot */}
 <div className="py-1 z-10">{renderMascot()}</div>
 </div>

 {/* Horizontal Mood Strip with Hand-Drawn Oval Circle Indicator (Video 00:04 - 00:09) */}
 <div className="space-y-1.5">
 <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
 {MOOD_LEVELS.map((mood) => {
 const isSelected = mood.id === activeMoodId;
 return (
 <button
 key={mood.id}
 type="button"
 onClick={() => handleMoodClick(mood.id)}
 className={`relative px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
 isSelected
 ? 'text-[#000000] font-black scale-105'
 : 'text-[#000000]/50 hover:text-[#000000]'
 }`}
 >
 {/* Hand-drawn Oval outline when selected (VibeMove style) */}
 {isSelected && (
 <motion.div
 layoutId="moodOvalIndicator"
 className="absolute inset-0 rounded-[1600px] bg-[#ffffff] shadow-xs -z-10"
 transition={{ type: 'spring', stiffness: 450, damping: 30 }}
 />
 )}
 <span>{isThai ? mood.thaiLabel : mood.label}</span>
 </button>
 );
 })}
 </div>

 {/* Mood Description Card */}
 <motion.div
 key={activeMoodId}
 initial={{ opacity: 0, y: 6 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.2 }}
 className="p-3 rounded-[20px] bg-[#f8fbff] shadow-xs text-center space-y-1"
 >
 <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#000000]">
 <span>🎯 {isThai ? currentConfig.thaiLabel : currentConfig.label}</span>
 <span className="text-[10px] text-[#000000]/50 font-normal">
 ({isThai ? (currentConfig.recommendedTypeTh || currentConfig.recommendedType) : currentConfig.recommendedType})
 </span>
 </div>
 <p className="text-[11px] text-[#000000]/80 font-bold leading-relaxed">
 {isThai ? currentConfig.description : (currentConfig.descriptionEn || currentConfig.description)}
 </p>
 <div className="pt-1 flex items-center justify-center gap-1 text-[10px] text-[#fb4903] font-bold">
 <span>{isThai ? '🏸 โฟกัส:' : '🏸 Focus:'}</span>
 <span>{isThai ? currentConfig.badmintonFocus : (currentConfig.badmintonFocusEn || currentConfig.badmintonFocus)}</span>
 </div>
 </motion.div>
 </div>
 </div>

 {/* Bottom Action Button (Let's find workout) */}
 <div className="p-3.5 bg-[#ffffff]">
 <button
 type="button"
 onClick={handleConfirm}
 className="w-full py-3 rounded-[1600px] bg-[#000000] text-[#ffffff] hover:bg-[#222222] border-2 border-[#000000] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform shadow-md"
 >
 <span>{isThai ? 'ค้นหาการฝึกซ้อมตามพลังงาน' : "Let's find workout"}</span>
 <Check className="w-4 h-4 text-[#55db9c]" />
 </button>
 </div>
 </motion.div>
 </div>
 </AnimatePresence>
 );
};
