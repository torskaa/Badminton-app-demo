/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Maximize2, Sparkles, Smartphone, ArrowRight, Zap, Trophy, LayoutGrid, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';

// Screen Components
import { A1_WelcomeScreen } from '../screens/A1_WelcomeScreen';
import { B1_CourtDiscoveryScreen } from '../screens/B1_CourtDiscoveryScreen';
import { B2_CourtDetailSlotScreen } from '../screens/B2_CourtDetailSlotScreen';
import { C1_InMatchLoggerScreen } from '../screens/C1_InMatchLoggerScreen';
import { D1_AICoachDashboardScreen } from '../screens/D1_AICoachDashboardScreen';
import { BottomTabBar } from './BottomTabBar';

interface ShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  targetScreen: ScreenId;
  badge: string;
  badgeColor: string;
  component: React.ReactNode;
  showTabBar?: boolean;
}

export const MultiScreenShowcase: React.FC = () => {
  const { navigateTo } = useApp();

  const showcaseScreens: ShowcaseItem[] = [
    {
      id: 'onboarding',
      title: '1. Onboarding & Welcome',
      subtitle: 'Build Community & Instant Booking',
      targetScreen: 'A1',
      badge: 'Visual Hero & CTA',
      badgeColor: 'bg-[#55db9c]',
      component: <A1_WelcomeScreen />,
      showTabBar: false,
    },
    {
      id: 'discovery',
      title: '2. Home & Discovery',
      subtitle: 'Categories, Quick Match & Arenas',
      targetScreen: 'B1',
      badge: 'Quick Sparring',
      badgeColor: 'bg-[#4da2ff]',
      component: <B1_CourtDiscoveryScreen />,
      showTabBar: true,
    },
    {
      id: 'booking',
      title: '3. Court Booking & Slots',
      subtitle: 'Taraflex BWF & Realtime Schedule',
      targetScreen: 'B2',
      badge: '2x EXP Prime-Time',
      badgeColor: 'bg-[#ffd731]',
      component: <B2_CourtDetailSlotScreen />,
      showTabBar: false,
    },
    {
      id: 'match_tracker',
      title: '4. Courtside Live Score',
      subtitle: 'Sets Tracking & Audio Waves',
      targetScreen: 'C1',
      badge: 'Thumb-Tap Scoring',
      badgeColor: 'bg-[#fb4903]',
      component: <C1_InMatchLoggerScreen />,
      showTabBar: true,
    },
    {
      id: 'ai_coach',
      title: '5. AI Coach & Skill Radar',
      subtitle: 'Weakness Diagnostics & FIFA Card',
      targetScreen: 'D1',
      badge: '5-Axis AI Radar',
      badgeColor: 'bg-[#e9ccff]',
      component: <D1_AICoachDashboardScreen />,
      showTabBar: true,
    },
  ];

  const handleOpenSingle = (target: ScreenId) => {
    navigateTo(target);
    const win = window as any;
    if (win.__setAppViewMode) {
      win.__setAppViewMode('single');
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-6 px-4 select-none min-h-screen bg-[#dceeff] text-[#000000]">
      {/* Header Info Banner (Max-width 1360px per guidelines, soft card 28px, 1px black outline) */}
      <div className="w-full max-w-[1360px] mb-6 p-6 rounded-[28px] bg-[#ffffff] border border-[#000000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.032em] text-[#fb4903] uppercase mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fb4903] border border-[#000000]" />
            <span>INTERACTIVE MULTI-SCREEN SHOWCASE</span>
          </div>
          <h1 className="lateral-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[#000000]">
            PANORAMIC APP PATHWAYS
          </h1>
          <p className="text-xs font-bold text-[#000000]/70 mt-1 max-w-2xl leading-relaxed">
            รองรับระบบ Slush Design Tokens เต็มรูปแบบ (1px Solid Black Outline, Soft Pills 1600px, Six-Color Palette) 
            คุณสามารถคลิกลองเล่นบนหน้าจอแต่ละอันได้ทันที หรือกดปุ่ม <strong>[ขยาย]</strong> เพื่อทดสอบใน Single Device Mode
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="px-4 py-2 rounded-[1600px] bg-[#ffd731] border border-[#000000] text-[#000000] font-bold text-xs uppercase tracking-[0.032em]">
            📱 5 SCREENS ACTIVE
          </span>
        </div>
      </div>

      {/* Panoramic Horizontal Showcase Container (Max-width 1700px, generous horizontal room to breathe) */}
      <div className="w-full max-w-[1700px] overflow-x-auto no-scrollbar pb-8 pt-2">
        <div className="flex items-start gap-8 min-w-max px-4">
          {showcaseScreens.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              {/* Screen Top Header Meta */}
              <div className="w-[380px] flex items-center justify-between mb-3 px-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Antonio',sans-serif] text-base font-black uppercase text-[#000000] tracking-wide">
                      {item.title}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold tracking-[0.032em] uppercase border border-[#000000] text-[#000000] ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] truncate max-w-[260px] font-bold text-[#000000]/60">
                    {item.subtitle}
                  </p>
                </div>

                {/* Focus Button (Black fill or outline black) */}
                <button
                  type="button"
                  onClick={() => handleOpenSingle(item.targetScreen)}
                  className="px-3.5 py-1.5 rounded-[1600px] text-xs font-bold tracking-[0.032em] uppercase flex items-center gap-1.5 transition-all cursor-pointer border border-[#000000] bg-[#ffffff] text-[#000000] hover:bg-[#ffd731] active:scale-95"
                  title="เปิดทดสอบหน้าจอนี้ในโหมดเดี่ยว"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>ขยาย</span>
                </button>
              </div>

              {/* Slush & Rainbow Soft Device Frame (rounded-[44px], 1.5px black border, white base) */}
              <div className="w-[380px] h-[780px] rounded-[44px] p-2.5 bg-[#ffffff] border-2 border-[#000000] relative flex flex-col overflow-hidden">
                {/* Dynamic Island Pill */}
                <div className="absolute top-3.5 inset-x-0 z-50 flex justify-center pointer-events-none">
                  <div className="w-24 h-5 bg-[#000000] rounded-[1600px] flex items-center justify-between px-2 text-[9px] text-[#ffffff]">
                    <span className="w-2 h-2 rounded-full bg-[#333333]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#55db9c]" />
                  </div>
                </div>

                {/* Screen Content Viewport */}
                <div className="flex-1 w-full h-full rounded-[36px] overflow-hidden flex flex-col relative no-scrollbar border border-[#000000] bg-[#ffffff] text-[#000000]">
                  <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
                    {item.component}
                  </div>
                  {item.showTabBar && <BottomTabBar />}
                </div>

                {/* Bottom Home Indicator */}
                <div className="absolute bottom-1 inset-x-0 flex justify-center pointer-events-none z-50">
                  <div className="w-28 h-1 rounded-[1600px] bg-[#000000]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
