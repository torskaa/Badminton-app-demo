import React from 'react';
import { Plus, Swords, Users, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

interface GuildHubEmptyStateProps {
 onCreateGuild: () => void;
 onFindSparring: () => void;
 onReset?: () => void;
}

export const GuildHubEmptyState: React.FC<GuildHubEmptyStateProps> = ({
 onCreateGuild,
 onFindSparring,
 onReset,
}) => {
 return (
 <div className="w-full p-6 my-2 rounded-[28px] bg-[#ffffff] text-[#000000] text-center select-none flex flex-col items-center">
 {/* Whimsical Slush / Rainbow On-Brand Vector Illustration */}
 <div className="relative w-44 h-36 flex items-center justify-center mb-3">
 {/* Floating Sticker Badges */}
 <div className="absolute top-1 right-2 px-2.5 py-0.5 rounded-[1600px] bg-[#55db9c] text-[9px] font-bold tracking-[0.032em] text-[#000000] rotate-[6deg]">
 +50 EXP RSVP
 </div>
 <div className="absolute bottom-2 left-2 w-7 h-7 rounded-[1600px] bg-[#fb4903] text-[#ffffff] flex items-center justify-center text-xs font-black shadow-xs rotate-[-10deg] animate-pulse">
 ⚡
 </div>

 {/* Central Whimsical Vector Illustration: Cute Waiting Badminton Racket Waving a Guild Banner */}
 <svg viewBox="0 0 160 130" className="w-full h-full">
 {/* Subtle 3D Inflatable Ribbon Loop (Electric Blue #4da2ff) */}
 <path
 d="M 20,85 C 35,35 85,25 125,60 C 145,80 148,60 142,40 C 140,85 110,115 70,105 C 35,95 25,105 20,85 Z"
 fill="#4da2ff"
 stroke="#000000"
 strokeWidth="1.5"
 />
 {/* Glossy specular reflection */}
 <path
 d="M 32,75 C 50,45 85,38 112,60"
 fill="none"
 stroke="#ffffff"
 strokeWidth="3.5"
 strokeLinecap="round"
 opacity="0.8"
 />

 {/* Cute Friendly Racket Body */}
 <g transform="translate(35, 20) rotate(-10)">
 {/* Racket Oval Head */}
 <ellipse cx="30" cy="30" rx="22" ry="26" fill="#e9ccff" stroke="#000000" strokeWidth="1.5" />
 {/* String Mesh Pattern */}
 <line x1="20" y1="10" x2="20" y2="50" stroke="#5c4ade" strokeWidth="0.8" opacity="0.6" />
 <line x1="30" y1="5" x2="30" y2="55" stroke="#5c4ade" strokeWidth="0.8" opacity="0.6" />
 <line x1="40" y1="10" x2="40" y2="50" stroke="#5c4ade" strokeWidth="0.8" opacity="0.6" />
 <line x1="12" y1="20" x2="48" y2="20" stroke="#5c4ade" strokeWidth="0.8" opacity="0.6" />
 <line x1="10" y1="30" x2="50" y2="30" stroke="#5c4ade" strokeWidth="0.8" opacity="0.6" />
 <line x1="12" y1="40" x2="48" y2="40" stroke="#5c4ade" strokeWidth="0.8" opacity="0.6" />

 {/* Cute Racket Face */}
 <circle cx="23" cy="28" r="2.5" fill="#000000" />
 <circle cx="37" cy="28" r="2.5" fill="#000000" />
 <circle cx="24" cy="27" r="0.8" fill="#ffffff" />
 <circle cx="38" cy="27" r="0.8" fill="#ffffff" />
 {/* Happy Smile */}
 <path d="M 26,34 Q 30,38 34,34" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
 {/* Cute Cheeks */}
 <circle cx="19" cy="32" r="2" fill="#fb4903" opacity="0.7" />
 <circle cx="41" cy="32" r="2" fill="#fb4903" opacity="0.7" />

 {/* Racket Shaft & Grip */}
 <rect x="28" y="56" width="4" height="24" fill="#000000" />
 <rect x="26" y="80" width="8" height="22" rx="3" fill="#ffd731" stroke="#000000" strokeWidth="1.2" />
 {/* Grip Tape Bands */}
 <line x1="26" y1="86" x2="34" y2="86" stroke="#000000" strokeWidth="1" />
 <line x1="26" y1="92" x2="34" y2="92" stroke="#000000" strokeWidth="1" />
 <line x1="26" y1="98" x2="34" y2="98" stroke="#000000" strokeWidth="1" />
 </g>

 {/* Cute Guild Flag / Banner Waving */}
 <g transform="translate(85, 25)">
 <line x1="10" y1="10" x2="10" y2="85" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
 <polygon
 points="12,12 58,24 12,38"
 fill="#ffd731"
 stroke="#000000"
 strokeWidth="1.5"
 />
 <circle cx="26" cy="25" r="4" fill="#fb4903" />
 {/* Little Shuttlecock on Flag */}
 <text x="22" y="28" fontSize="6" fontWeight="bold">🏸</text>
 </g>
 </svg>
 </div>

 {/* Crushed Lateral / Antonio Display Headline */}
 <div className="space-y-1 mb-2">
 <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#e9ccff] text-[10px] font-bold tracking-[0.032em] uppercase text-[#000000] inline-block">
 GUILD TAVERN QUIET
 </span>
 <h3 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight text-[#000000] leading-none mt-1">
 NO SQUADS ACTIVE RIGHT NOW
 </h3>
 <p className="text-xs text-[#000000]/70 font-medium max-w-[280px] mx-auto leading-relaxed mt-1">
 ยังไม่มีก๊วนที่เปิดรับสมาชิกในรอบนี้ มาร่วมเป็นกัปตันก๊วนคนแรก ชวนเพื่อนและให้ระบบช่วยหารค่าคอร์ทอัตโนมัติ
 </p>
 </div>

 {/* Action Buttons (Strict Rules: Black fill CTA or outlined black) */}
 <div className="w-full space-y-2 mt-2 pt-2 ">
 <button
 type="button"
 onClick={onCreateGuild}
 className="w-full py-3.5 px-4 rounded-[1600px] bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 border border-[#000000] transition-transform active:scale-95 cursor-pointer shadow-sm group whitespace-nowrap"
 >
 <Plus className="w-4 h-4 stroke-[3] shrink-0" />
 <span className="whitespace-nowrap">HOST SQUAD SESSION (+100 EXP)</span>
 </button>

 <button
 type="button"
 onClick={onFindSparring}
 className="w-full py-2.5 px-4 rounded-[1600px] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 border border-[#000000] transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
 >
 <Swords className="w-3.5 h-3.5 text-[#fb4903] shrink-0" />
 <span className="whitespace-nowrap">FIND SPARRING DUEL (E3)</span>
 </button>

 {onReset && (
 <button
 type="button"
 onClick={onReset}
 className="text-[11px] text-[#000000]/60 hover:text-[#000000] font-bold tracking-[0.032em] pt-1 underline cursor-pointer whitespace-nowrap"
 >
 RESET GUILD FILTERS
 </button>
 )}
 </div>
 </div>
 );
};
