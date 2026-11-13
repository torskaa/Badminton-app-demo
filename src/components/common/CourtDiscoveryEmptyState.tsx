import React from 'react';
import { RefreshCw, MapPin, Sparkles, Plus, ArrowRight } from 'lucide-react';

interface CourtDiscoveryEmptyStateProps {
 onResetFilters: () => void;
 onSuggestCourt?: () => void;
 searchTerm?: string;
}

export const CourtDiscoveryEmptyState: React.FC<CourtDiscoveryEmptyStateProps> = ({
 onResetFilters,
 onSuggestCourt,
 searchTerm,
}) => {
 return (
 <div className="w-full p-6 my-2 rounded-[28px] bg-[#ffffff] text-[#000000] text-center select-none flex flex-col items-center">
 {/* Whimsical Slush / Rainbow On-Brand Vector Illustration */}
 <div className="relative w-44 h-36 flex items-center justify-center mb-3">
 {/* Floating Stars and Badges */}
 <div className="absolute top-1 left-2 w-7 h-7 rounded-[1600px] bg-[#e85729] flex items-center justify-center text-xs font-black shadow-xs rotate-[-12deg] animate-bounce">
 ★
 </div>
 <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-[1600px] bg-[#e8f7ee] text-[9px] font-bold tracking-[0.032em] text-[#000000] rotate-[8deg]">
 ? MISSING
 </div>

 {/* Central Whimsical Searching Shuttlecock with Magnifying Glass SVG */}
 <svg viewBox="0 0 160 130" className="w-full h-full">
 {/* Subtle 3D Inflatable Ribbon Base (Electric Blue #7cd7a0) */}
 <path
 d="M 15,90 C 30,30 80,30 115,65 C 135,85 145,70 148,50 C 152,90 120,120 75,110 C 35,100 22,115 15,90 Z"
 fill="#7cd7a0"
 stroke="#000000"
 strokeWidth="1.5"
 />
 {/* Glossy specular curve */}
 <path
 d="M 28,80 C 45,45 80,40 105,65"
 fill="none"
 stroke="#ffffff"
 strokeWidth="3.5"
 strokeLinecap="round"
 opacity="0.8"
 />

 {/* Cute Shuttlecock Body */}
 <g transform="translate(50, 25)">
 {/* Feathers */}
 <polygon
 points="30,10 10,65 50,65"
 fill="#ffffff"
 stroke="#000000"
 strokeWidth="1.5"
 />
 {/* Feather Lines */}
 <line x1="20" y1="65" x2="28" y2="20" stroke="#000000" strokeWidth="1" strokeDasharray="3 2" />
 <line x1="40" y1="65" x2="32" y2="20" stroke="#000000" strokeWidth="1" strokeDasharray="3 2" />
 <line x1="16" y1="45" x2="44" y2="45" stroke="#e85729" strokeWidth="1.5" />
 <line x1="13" y1="55" x2="47" y2="55" stroke="#e85729" strokeWidth="1.5" />

 {/* Cork Base (Head) */}
 <circle cx="30" cy="15" r="14" fill="#e85729" stroke="#000000" strokeWidth="1.5" />
 
 {/* Cute Face: Curious Blinking Eyes */}
 <circle cx="25" cy="14" r="2.5" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />
 <circle cx="26" cy="14" r="1.2" fill="#000000" />
 <circle cx="34" cy="14" r="2.5" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />
 <circle cx="35" cy="14" r="1.2" fill="#000000" />
 {/* Curious little mouth */}
 <path d="M 28,19 Q 30,22 32,19" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
 </g>

 {/* Whimsical Magnifying Glass with Mint Pop Rim */}
 <g transform="translate(85, 45) rotate(15)">
 <circle cx="20" cy="20" r="18" fill="#e8f7ee" fillOpacity="0.5" stroke="#000000" strokeWidth="1.5" />
 <circle cx="20" cy="20" r="14" fill="none" stroke="#7cd7a0" strokeWidth="3" />
 <line x1="33" y1="33" x2="52" y2="52" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
 <line x1="33" y1="33" x2="50" y2="50" stroke="#e85729" strokeWidth="2" strokeLinecap="round" />
 {/* Sparkle reflection */}
 <path d="M 12,12 Q 18,8 24,12" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
 </g>
 </svg>
 </div>

 {/* Crushed Lateral / Antonio Display Headline */}
 <div className="space-y-1 mb-2">
 <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#e85729] text-[10px] font-bold tracking-[0.032em] uppercase text-[#000000] inline-block">
 SEARCH RADAR EMPTY
 </span>
 <h3 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight text-[#000000] leading-none mt-1">
 {searchTerm ? `NO COURTS FOR "${searchTerm}"` : 'NO COURTS FOUND IN THIS RADAR'}
 </h3>
 <p className="text-xs text-[#000000]/70 font-medium max-w-[280px] mx-auto leading-relaxed mt-1">
 ไม่พบคอร์ทแบดมินตันตามตัวกรองนี้ ลองปรับคำค้นหา หรือรีเซ็ตเพื่อค้นหา BWF Taraflex ทั้งหมดในกรุงเทพฯ
 </p>
 </div>

 {/* Action Buttons (Strict Rules: Black fill CTA or outlined black) */}
 <div className="w-full space-y-2 mt-2 pt-2 ">
 <button
 type="button"
 onClick={onResetFilters}
 className="w-full py-3.5 px-4 rounded-[1600px] bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 border border-[#000000] transition-transform active:scale-95 cursor-pointer shadow-sm group whitespace-nowrap"
 >
 <RefreshCw className="w-4 h-4 shrink-0 group-hover:rotate-180 transition-transform duration-300" />
 <span className="whitespace-nowrap">RESET ALL FILTERS</span>
 </button>

 <button
 type="button"
 onClick={onSuggestCourt}
 className="w-full py-2.5 px-4 rounded-[1600px] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-1.5 border border-[#000000] transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
 >
 <Plus className="w-3.5 h-3.5 shrink-0" />
 <span className="whitespace-nowrap">SUGGEST A NEW COURT (+30 EXP)</span>
 </button>
 </div>
 </div>
 );
};
