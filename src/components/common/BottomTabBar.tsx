import React from 'react';
import { Home, Users, LayoutGrid, User, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MainTab } from '../../types';
import { playSelectSound } from '../../utils/retroAudio';

export const BottomTabBar: React.FC = () => {
 const { activeTab, setActiveTab, currentScreen, navigateTo, t, language } = useApp();

 // Hide BottomTabBar on dedicated full-screen action flows
 const HIDE_TAB_BAR_SCREENS = [
 'A1', 'A2',
 'B2', 'B3', 'B4',
 'C1', 'C4',
 'D3',
 'E2', 'E3',
 'F2',
 ];

 if (HIDE_TAB_BAR_SCREENS.includes(currentScreen)) {
 return null;
 }

 const isHomeActive = currentScreen === 'HOME' || activeTab === 'home';
 const isClubActive = currentScreen === 'CLUB_TOOLS' || ['E1', 'E2', 'E3', 'E4'].includes(currentScreen);
 const isDiscoverActive = currentScreen === 'MAP' || ['B1', 'B2', 'B3', 'B4'].includes(currentScreen);
 const isFinanceActive = currentScreen === 'FINANCE';
 const isProfileActive = currentScreen === 'F1' || currentScreen === 'F2' || ['D1', 'D2', 'D3'].includes(currentScreen);

 return (
 <div className="absolute bottom-0 left-0 right-0 z-40 select-none px-3 pb-[max(0.4rem,env(safe-area-inset-bottom,0.4rem))] pt-1 bg-gradient-to-t from-[#ffffff] via-[#ffffff]/90 to-transparent pointer-events-none">
 {/* Floating Sleek Dock Container (Clean & Modern) */}
 <div className="max-w-md mx-auto bg-[#ffffff] rounded-[28px] shadow-2xl p-1.5 flex items-center justify-between pointer-events-auto">
 {/* 1. Home (Pill active background like VibeMove video 00:01) */}
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveTab('home');
 navigateTo('HOME');
 }}
 className={`flex-1 py-1.5 px-1 rounded-[20px] flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
 isHomeActive
 ? 'bg-[#fb4903] text-[#ffffff] font-black shadow-xs'
 : 'text-[#000000]/60 hover:text-[#000000]'
 }`}
 >
 <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
 <span className="text-[9px] font-bold mt-0.5 leading-none">
 {t.tabHome}
 </span>
 </button>

 {/* 2. Club / Workouts */}
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveTab('club');
 navigateTo('CLUB_TOOLS');
 }}
 className={`flex-1 py-1.5 px-1 rounded-[20px] flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 relative ${
 isClubActive
 ? 'bg-[#55db9c] text-[#000000] font-black shadow-xs'
 : 'text-[#000000]/60 hover:text-[#000000]'
 }`}
 >
 <span className="absolute -top-1 right-2 px-1 py-0.1 rounded-[1600px] bg-[#fb4903] text-[#ffffff] text-[7px] font-black">
 {language === 'th' ? 'ใหม่' : 'NEW'}
 </span>
 <Users className={`w-5 h-5 ${isClubActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
 <span className="text-[9px] font-bold mt-0.5 leading-none">
 {t.tabClub}
 </span>
 </button>

 {/* 3. Center Discover: Shuttlecock Floating FAB */}
 <div className="flex-1 flex flex-col items-center justify-center relative -mt-5">
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveTab('discover');
 navigateTo('MAP');
 }}
 className="w-12 h-12 rounded-[1600px] bg-[#ffd731] hover:bg-[#ffe366] text-[#000000] shadow-lg flex items-center justify-center active:scale-90 transition-all cursor-pointer border border-[#000000] ring-3 ring-[#ffffff]"
 title={t.tabDiscover}
 >
 {/* White Badminton Shuttlecock SVG Icon */}
 <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-[#000000]">
 <path d="M12 2a4 4 0 0 0-4 4c0 1.6 1 3 2.4 3.6L7 16l2 2 3.5-3.5L16 18l2-2-3.4-6.4C16 9 17 7.6 17 6a4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2a2 2 0 0 1 2-2zM9.8 11.5l1.6 3 1.6-3c-.5-.3-1-.5-1.6-.5s-1.1.2-1.6.5z" />
 </svg>
 </button>
 <span
 className={`text-[9px] font-black mt-0.5 whitespace-nowrap ${
 isDiscoverActive ? 'text-[#000000]' : 'text-[#000000]/60'
 }`}
 >
 {t.tabDiscover}
 </span>
 </div>

 {/* 4. More / Finance */}
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveTab('more');
 navigateTo('FINANCE');
 }}
 className={`flex-1 py-1.5 px-1 rounded-[20px] flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
 isFinanceActive
 ? 'bg-[#e9ccff] text-[#000000] font-black shadow-xs'
 : 'text-[#000000]/60 hover:text-[#000000]'
 }`}
 >
 <LayoutGrid className={`w-5 h-5 ${isFinanceActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
 <span className="text-[9px] font-bold mt-0.5 leading-none">
 {t.tabMore}
 </span>
 </button>

 {/* 5. Profile */}
 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setActiveTab('profile');
 navigateTo('F1');
 }}
 className={`flex-1 py-1.5 px-1 rounded-[20px] flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
 isProfileActive
 ? 'bg-[#000000] text-[#ffffff] font-black shadow-xs'
 : 'text-[#000000]/60 hover:text-[#000000]'
 }`}
 >
 <User className={`w-5 h-5 ${isProfileActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
 <span className="text-[9px] font-bold mt-0.5 leading-none">
 {t.tabProfile}
 </span>
 </button>
 </div>
 </div>
 );
};
