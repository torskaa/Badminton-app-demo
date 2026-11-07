import React from 'react';
import { Home, Users, LayoutGrid, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MainTab } from '../../types';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, currentScreen, navigateTo, t } = useApp();

  // Hide BottomTabBar on dedicated action flows
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
  const isMoreActive = currentScreen === 'FINANCE';
  const isProfileActive = currentScreen === 'F1' || currentScreen === 'F2' || ['D1', 'D2', 'D3'].includes(currentScreen);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 select-none bg-[#ffffff] border-t border-[#000000] px-2 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom,0.35rem))] shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-between relative px-2">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('home');
            navigateTo('HOME');
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer active:scale-95 transition-transform"
        >
          <Home
            className={`w-5 h-5 ${isHomeActive ? 'text-[#000000] stroke-[2.5]' : 'text-[#000000]/45'}`}
          />
          <span
            className={`text-[10px] mt-0.5 font-bold whitespace-nowrap ${
              isHomeActive ? 'text-[#000000]' : 'text-[#000000]/50'
            }`}
          >
            {t.tabHome}
          </span>
        </button>

        {/* 2. Club */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('club');
            navigateTo('CLUB_TOOLS');
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer active:scale-95 transition-transform relative"
        >
          <span className="absolute -top-1 right-2 px-1.5 py-0.2 rounded-[1600px] bg-[#fb4903] text-[#ffffff] border border-[#000000] text-[8px] font-black tracking-wide">
            {t.newBadge}
          </span>
          <Users
            className={`w-5 h-5 ${isClubActive ? 'text-[#00B14F] stroke-[2.5]' : 'text-[#000000]/45'}`}
          />
          <span
            className={`text-[10px] mt-0.5 font-bold whitespace-nowrap ${
              isClubActive ? 'text-[#000000]' : 'text-[#000000]/50'
            }`}
          >
            {t.tabClub}
          </span>
        </button>

        {/* 3. Center Discover: Custom Protruding Floating Action Button (FAB) in Slush CI */}
        <div className="flex-1 flex flex-col items-center justify-center relative -mt-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('discover');
              navigateTo('MAP');
            }}
            className="w-14 h-14 rounded-[1600px] bg-[#55db9c] hover:bg-[#45c98c] text-[#000000] shadow-md flex items-center justify-center active:scale-95 transition-all cursor-pointer border-2 border-[#000000] ring-4 ring-[#ffffff]"
            title={t.tabDiscover}
          >
            {/* White Badminton Shuttlecock SVG Icon */}
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current text-[#000000]">
              <path d="M12 2a4 4 0 0 0-4 4c0 1.6 1 3 2.4 3.6L7 16l2 2 3.5-3.5L16 18l2-2-3.4-6.4C16 9 17 7.6 17 6a4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2a2 2 0 0 1 2-2zM9.8 11.5l1.6 3 1.6-3c-.5-.3-1-.5-1.6-.5s-1.1.2-1.6.5z" />
            </svg>
          </button>
          <span
            className={`text-[10px] font-black mt-0.5 whitespace-nowrap ${
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
            setActiveTab('more');
            navigateTo('FINANCE');
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer active:scale-95 transition-transform"
        >
          <LayoutGrid
            className={`w-5 h-5 ${isMoreActive ? 'text-[#000000] stroke-[2.5]' : 'text-[#000000]/45'}`}
          />
          <span
            className={`text-[10px] mt-0.5 font-bold whitespace-nowrap ${
              isMoreActive ? 'text-[#000000]' : 'text-[#000000]/50'
            }`}
          >
            {t.tabMore}
          </span>
        </button>

        {/* 5. Profile */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('profile');
            navigateTo('F1');
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer active:scale-95 transition-transform"
        >
          <User
            className={`w-5 h-5 ${isProfileActive ? 'text-[#000000] stroke-[2.5]' : 'text-[#000000]/45'}`}
          />
          <span
            className={`text-[10px] mt-0.5 font-bold whitespace-nowrap ${
              isProfileActive ? 'text-[#000000]' : 'text-[#000000]/50'
            }`}
          >
            {t.tabProfile}
          </span>
        </button>
      </div>
    </div>
  );
};
