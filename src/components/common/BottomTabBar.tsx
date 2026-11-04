/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
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
    color: string;
  }[] = [
    { id: 'home', label: 'Coach', icon: LayoutGrid, color: '#4da2ff' },
    { id: 'booking', label: 'Courts', icon: Calendar, color: '#55db9c' },
    { id: 'logger', label: 'Live Score', icon: Play, isPrimary: true, color: '#ffd731' },
    { id: 'community', label: 'Guilds', icon: Users, color: '#e9ccff' },
    { id: 'profile', label: 'Profile', icon: User, color: '#fb4903' },
  ];

  return (
    <div className="absolute bottom-4 left-4 right-4 z-40 select-none">
      <nav className="w-full bg-white border border-black rounded-full px-2 py-1.5 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isPrimary) {
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.06 }}
                onClick={() => {
                  setActiveTab(tab.id);
                  navigateTo('C1');
                }}
                className="group cursor-pointer relative -my-1"
                title="Courtside Score Tracker"
              >
                <div className="w-12 h-12 rounded-full bg-black text-white border border-black flex items-center justify-center transition-all duration-200 hover:bg-[#4da2ff] hover:text-black shadow-md">
                  <Icon className="w-5 h-5 fill-current stroke-[2.4]" />
                </div>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className="relative flex items-center justify-center min-w-[44px] h-11 px-3 rounded-full cursor-pointer transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-full border border-black"
                  style={{ backgroundColor: tab.color }}
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5] text-black' : 'stroke-[2] text-neutral-500 hover:text-black'
                  }`}
                />
              </div>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
