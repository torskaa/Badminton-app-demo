import React, { useState } from 'react';
import { ArrowLeft, Flame, Zap, Compass, Settings, RotateCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playSelectSound } from '../../utils/retroAudio';
import { ScreenSwitcherModal } from './ScreenSwitcherModal';
import { AppSettingsModal } from './AppSettingsModal';

interface MobileHeaderProps {
 title?: string;
 showBack?: boolean;
 onBack?: () => void;
 subtitle?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ title, showBack, onBack, subtitle }) => {
 const { player, currentScreen, navigateTo, language, setLanguage, simulateDataFetch } = useApp();
 const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
 const [isSettingsOpen, setIsSettingsOpen] = useState(false);

 const handleBack = () => {
 if (onBack) {
 onBack();
 return;
 }
 if (['A2'].includes(currentScreen)) navigateTo('A1', 'backward');
 else if (['B2', 'B3'].includes(currentScreen)) navigateTo('B1', 'backward');
 else if (['B4'].includes(currentScreen)) navigateTo('B1', 'backward');
 else if (['C2', 'C3', 'C4'].includes(currentScreen)) navigateTo('C1', 'backward');
 else if (['D2', 'D3'].includes(currentScreen)) navigateTo('D1', 'backward');
 else if (['E2', 'E3', 'E4'].includes(currentScreen)) navigateTo('E1', 'backward');
 else if (['F2'].includes(currentScreen)) navigateTo('F1', 'backward');
 else navigateTo('HOME', 'backward');
 };

 return (
 <>
 <header className="sticky top-0 z-30 px-3 py-2 bg-[#ffffff] flex items-center justify-between gap-2 shrink-0 select-none text-[#000000] shadow-xs">
 {/* Left: Back Pill or Clean Logo */}
 <div className="flex items-center gap-2 min-w-0">
 {showBack ? (
 <button
 type="button"
 onClick={handleBack}
 className="w-8 h-8 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#e9e9e9] transition-transform active:scale-90 shadow-xs"
 aria-label="Back"
 >
 <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
 </button>
 ) : (
 <div
 onClick={() => navigateTo('HOME')}
 className="cursor-pointer flex items-center gap-1 shrink-0 hover:scale-105 transition-transform"
 >
 <span className="font-['Antonio',sans-serif] text-xl font-black uppercase tracking-tight text-[#000000]">
 SMASH
 </span>
 </div>
 )}

 {showBack && title && (
 <div className="min-w-0">
 <h1 className="text-xs font-bold tracking-[0.032em] truncate leading-tight uppercase font-['Antonio',sans-serif]">
 {title}
 </h1>
 {subtitle && (
 <p className="text-[10px] text-[#000000]/60 truncate leading-none mt-0.5 font-bold">
 {subtitle}
 </p>
 )}
 </div>
 )}
 </div>

 {/* Right status: Language Pill + Streak + Level + Settings + Directory */}
 <div className="flex items-center gap-1.5 shrink-0">
 {/* Quick Language Toggle Pill [ 🇹🇭 TH | 🇬🇧 EN ] */}
 <div className="flex items-center p-0.5 rounded-[1600px] bg-[#dceeff] text-[10px] font-bold">
 <button
 type="button"
 onClick={() => setLanguage('th')}
 className={`px-1.5 py-0.5 rounded-[1600px] transition-all cursor-pointer ${
 language === 'th'
 ? 'bg-[#000000] text-[#ffffff] font-black'
 : 'text-[#000000]/70 hover:text-[#000000]'
 }`}
 title="ภาษาไทย"
 >
 TH
 </button>
 <button
 type="button"
 onClick={() => setLanguage('en')}
 className={`px-1.5 py-0.5 rounded-[1600px] transition-all cursor-pointer ${
 language === 'en'
 ? 'bg-[#000000] text-[#ffffff] font-black'
 : 'text-[#000000]/70 hover:text-[#000000]'
 }`}
 title="English"
 >
 EN
 </button>
 </div>

 {/* Streak pill (Ember) */}
 <div
 onClick={() => navigateTo('F1')}
 className="flex items-center gap-1 px-2 py-1 rounded-[1600px] bg-[#fb4903] text-[#ffffff] text-[10px] font-bold tracking-[0.032em] cursor-pointer hover:scale-105 active:scale-95 transition-transform shadow-xs"
 >
 <Flame className="w-3 h-3 fill-current text-[#ffffff]" />
 <span>{player.streakWeeks}W</span>
 </div>

 {/* Level pill (Sunburst) */}
 <div
 onClick={() => navigateTo('F1')}
 className="flex items-center gap-1 px-2 py-1 rounded-[1600px] bg-[#ffd731] text-[#000000] text-[10px] font-bold tracking-[0.032em] cursor-pointer hover:scale-105 active:scale-95 transition-transform shadow-xs"
 >
 <Zap className="w-3 h-3 fill-current" />
 <span>Lv.{player.level}</span>
 </div>

 {/* Settings Pill */}
 <button
 type="button"
 onClick={() => setIsSettingsOpen(true)}
 className="w-7 h-7 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center cursor-pointer hover:bg-[#e9e9e9] active:scale-95 transition-all shadow-xs"
 title="Settings"
 >
 <Settings className="w-3.5 h-3.5 text-[#000000]" />
 </button>

 {/* Directory Pill */}
 <button
 type="button"
 onClick={() => setIsSwitcherOpen(true)}
 className="w-7 h-7 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center cursor-pointer hover:bg-[#e9ccff] active:scale-95 transition-all shadow-xs"
 title="Directory (All 18 Screens)"
 >
 <Compass className="w-3.5 h-3.5 text-[#5c4ade]" />
 </button>
 </div>
 </header>

 <AppSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
 <ScreenSwitcherModal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
 </>
 );
};

