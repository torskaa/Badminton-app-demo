/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutGrid, Calendar, Play, Users, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MainTab } from '../../types';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, currentScreen, navigateTo } = useApp();

  if (['A1', 'A2'].includes(currentScreen)) {
    return null;
  }

  const tabs: {
    id: MainTab;
    label: string;
    icon: React.ElementType;
    isPrimary?: boolean;
  }[] = [
    { id: 'home', label: 'Coach', icon: LayoutGrid },
    { id: 'booking', label: 'Courts', icon: Calendar },
    { id: 'logger', label: 'Score', icon: Play, isPrimary: true },
    { id: 'community', label: 'Squad', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="absolute bottom-4 left-4 right-4 z-40 select-none">
      <nav className="w-full bg-[#0a0d14]/90 backdrop-blur-2xl border border-white/10 rounded-full px-2 py-2 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  navigateTo('C1');
                }}
                className="group cursor-pointer relative"
                title="Courtside Score Tracker"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-[#d4ff00] text-black shadow-[0_0_24px_rgba(212,255,0,0.6)] scale-105 font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5 fill-current stroke-[2.4]" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className={`flex items-center justify-center min-w-[44px] h-11 px-3 rounded-full transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white/15 text-[#d4ff00] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex flex-col items-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4] text-[#d4ff00]' : 'stroke-[1.8]'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
