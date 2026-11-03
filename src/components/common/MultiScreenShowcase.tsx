/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Maximize2, Sparkles, Smartphone, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
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
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      component: <A1_WelcomeScreen />,
      showTabBar: false,
    },
    {
      id: 'discovery',
      title: '2. Home & Discovery',
      subtitle: 'Categories, Quick Match & Arenas',
      targetScreen: 'B1',
      badge: 'Quick Match Sparring',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      component: <B1_CourtDiscoveryScreen />,
      showTabBar: true,
    },
    {
      id: 'booking',
      title: '3. Court Booking & Slots',
      subtitle: 'Taraflex BWF & Realtime Schedule',
      targetScreen: 'B2',
      badge: 'Instant 2x EXP Slots',
      badgeColor: 'bg-[#d8ff00]/20 text-[#d8ff00] border-[#d8ff00]/30',
      component: <B2_CourtDetailSlotScreen />,
      showTabBar: false,
    },
    {
      id: 'match_tracker',
      title: '4. Courtside Live Score',
      subtitle: 'Sets Tracking & Audio Waves',
      targetScreen: 'C1',
      badge: 'Thumb-Tap Scoring',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      component: <C1_InMatchLoggerScreen />,
      showTabBar: true,
    },
    {
      id: 'ai_coach',
      title: '5. AI Coach & Skill Radar',
      subtitle: 'Weakness Diagnostics & FIFA Card',
      targetScreen: 'D1',
      badge: '5-Axis AI Radar',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      component: <D1_AICoachDashboardScreen />,
      showTabBar: true,
    },
  ];

  const handleOpenSingle = (target: ScreenId) => {
    navigateTo(target);
    // Switch to single phone view
    const win = window as any;
    if (win.__setAppViewMode) {
      win.__setAppViewMode('single');
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-6 px-4 select-none">
      {/* Header Info Banner */}
      <div className="w-full max-w-6xl mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#d8ff00] font-bold tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-[#d8ff00] animate-ping" />
            <span>Interactive Multi-Screen Navigation Overview</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            แยกหน้าจอ Navigation ทั้งหมด (Showcase Gallery)
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            แสดงผลแยกหน้าจอตามภาพต้นแบบ Behance/Dribbble ทั้ง 5 เส้นทางหลัก คุณสามารถกดเล่นบนหน้าจอแต่ละอันได้ทันที หรือกดปุ่ม <strong>[ขยายเต็มจอ]</strong> เพื่อเข้าไปทดสอบระบบใน Single Phone Mode
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 font-medium">
            📱 5 Interactive Screens Active
          </span>
        </div>
      </div>

      {/* Panoramic Horizontal Showcase Container */}
      <div className="w-full max-w-[1700px] overflow-x-auto no-scrollbar pb-8 pt-2">
        <div className="flex items-start gap-8 min-w-max px-4">
          {showcaseScreens.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center">
              {/* Screen Top Header Meta */}
              <div className="w-[380px] flex items-center justify-between mb-3 px-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white tracking-tight">
                      {item.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate max-w-[260px]">
                    {item.subtitle}
                  </p>
                </div>

                {/* Focus Button */}
                <button
                  onClick={() => handleOpenSingle(item.targetScreen)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-[#d8ff00] hover:text-black text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-white/10 group"
                  title="เปิดทดสอบหน้าจอนี้ในโหมดเดี่ยว"
                >
                  <Maximize2 className="w-3.5 h-3.5 group-hover:scale-110" />
                  <span className="text-[11px]">ขยาย</span>
                </button>
              </div>

              {/* iPhone 16 Device Frame */}
              <div className="w-[380px] h-[780px] rounded-[48px] p-3 bg-neutral-900 border-[3px] border-neutral-700 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden ring-1 ring-white/10">
                {/* Dynamic Island Pill */}
                <div className="absolute top-4 inset-x-0 z-50 flex justify-center pointer-events-none">
                  <div className="w-24 h-5 bg-black rounded-full shadow-inner flex items-center justify-between px-2 text-[9px] text-white">
                    <span className="w-2 h-2 rounded-full bg-neutral-800" />
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                  </div>
                </div>

                {/* Screen Content Viewport */}
                <div className="flex-1 w-full h-full rounded-[38px] overflow-hidden bg-[#f0f4f9] text-neutral-900 flex flex-col relative no-scrollbar">
                  <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
                    {item.component}
                  </div>
                  {item.showTabBar && <BottomTabBar />}
                </div>

                {/* iPhone Bottom Home Bar */}
                <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none z-50">
                  <div className="w-28 h-1 bg-neutral-400/60 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
