import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Calendar, Play, Users, User, LayoutGrid } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MainTab } from '../../types';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, currentScreen, navigateTo } = useApp();

  // Hide BottomTabBar on dedicated sub-flows and actions to avoid covering buttons
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

  const tabs: {
    id: MainTab;
    label: string;
    icon: React.ElementType;
    isPrimary?: boolean;
    targetScreen: any;
  }[] = [
    { id: 'booking', label: 'Courts', icon: Compass, targetScreen: 'B1' },
    { id: 'coach', label: 'AI Coach', icon: LayoutGrid, targetScreen: 'D1' },
    { id: 'logger', label: 'Live', icon: Play, isPrimary: true, targetScreen: 'C1' },
    { id: 'community', label: 'Guilds', icon: Users, targetScreen: 'E1' },
    { id: 'profile', label: 'Profile', icon: User, targetScreen: 'F1' },
  ];

  return (
    <div className="absolute bottom-4 left-4 right-4 z-40 select-none pointer-events-none">
      <nav className="w-full bg-[#ffffff] border border-[#000000] rounded-[1600px] px-2 py-1.5 flex items-center justify-between pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            (tab.id === 'booking' && ['B1', 'B2', 'B3', 'B4'].includes(currentScreen)) ||
            (tab.id === 'coach' && ['D1', 'D2', 'D3'].includes(currentScreen)) ||
            (tab.id === 'logger' && ['C1', 'C2', 'C3', 'C4'].includes(currentScreen)) ||
            (tab.id === 'community' && ['E1', 'E2', 'E3', 'E4'].includes(currentScreen)) ||
            (tab.id === 'profile' && ['F1', 'F2'].includes(currentScreen));

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  navigateTo(tab.targetScreen);
                }}
                className="cursor-pointer relative -my-1 group active:scale-95 transition-transform"
                title="Courtside Live Score Tracker"
              >
                {/* Slush CTA: Black-fill with 1px black outline */}
                <div className="w-12 h-12 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] flex items-center justify-center hover:bg-[#1a1a1a] transition-all">
                  <Icon className="w-5 h-5 fill-current stroke-[2.4]" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                navigateTo(tab.targetScreen);
              }}
              className={`relative flex items-center justify-center h-10 px-3.5 rounded-[1600px] cursor-pointer transition-all active:scale-95 ${
                isActive
                  ? 'bg-[#ffd731] border border-[#000000] text-[#000000]'
                  : 'text-[#000000]/70 hover:text-[#000000] hover:bg-[#e9e9e9]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="w-4 h-4 stroke-[2.5]" />
                {isActive && (
                  <span className="text-[11px] font-bold tracking-[0.032em] uppercase">
                    {tab.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
