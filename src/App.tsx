/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { BottomTabBar } from './components/common/BottomTabBar';
import { ExpCelebrationModal } from './components/common/ExpCelebrationModal';

// Redesigned Grab-Superapp Primary Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { CourtMapScreen } from './components/screens/CourtMapScreen';
import { ClubToolsScreen } from './components/screens/ClubToolsScreen';
import { FinanceScreen } from './components/screens/FinanceScreen';

// Sub-flow Screens
import { A1_WelcomeScreen } from './components/screens/A1_WelcomeScreen';
import { A2_PlaystyleSetupScreen } from './components/screens/A2_PlaystyleSetupScreen';
import { B1_CourtDiscoveryScreen } from './components/screens/B1_CourtDiscoveryScreen';
import { B2_CourtDetailSlotScreen } from './components/screens/B2_CourtDetailSlotScreen';
import { B3_CheckoutPaymentScreen } from './components/screens/B3_CheckoutPaymentScreen';
import { B4_BookingSuccessScreen } from './components/screens/B4_BookingSuccessScreen';
import { C1_InMatchLoggerScreen } from './components/screens/C1_InMatchLoggerScreen';
import { C2_PostMatchSummaryScreen } from './components/screens/C2_PostMatchSummaryScreen';
import { C3_AIDiagnosticsScreen } from './components/screens/C3_AIDiagnosticsScreen';
import { C4_MatchRecapCardScreen } from './components/screens/C4_MatchRecapCardScreen';
import { D1_AICoachDashboardScreen } from './components/screens/D1_AICoachDashboardScreen';
import { D2_AIQuestsDrillsScreen } from './components/screens/D2_AIQuestsDrillsScreen';
import { D3_VideoAnalysisScreen } from './components/screens/D3_VideoAnalysisScreen';
import { E1_GuildHubScreen } from './components/screens/E1_GuildHubScreen';
import { E2_GroupEventRSVPScreen } from './components/screens/E2_GroupEventRSVPScreen';
import { E3_AISmartMatchmakerScreen } from './components/screens/E3_AISmartMatchmakerScreen';
import { E4_GroupLeaderboardScreen } from './components/screens/E4_GroupLeaderboardScreen';
import { F1_UserProfileTrophyScreen } from './components/screens/F1_UserProfileTrophyScreen';
import { F2_WearableSyncScreen } from './components/screens/F2_WearableSyncScreen';

const ScreenRenderer: React.FC = () => {
  const { currentScreen } = useApp();

  switch (currentScreen) {
    // PRIMARY SUPERAPP SCREENS (Grab Layout)
    case 'HOME':
      return <HomeScreen />;
    case 'MAP':
      return <CourtMapScreen />;
    case 'CLUB_TOOLS':
      return <ClubToolsScreen />;
    case 'FINANCE':
      return <FinanceScreen />;

    // PATH A: Authentication & Onboarding
    case 'A1':
      return <A1_WelcomeScreen />;
    case 'A2':
      return <A2_PlaystyleSetupScreen />;

    // PATH B: Court Booking & Quests
    case 'B1':
      return <B1_CourtDiscoveryScreen />;
    case 'B2':
      return <B2_CourtDetailSlotScreen />;
    case 'B3':
      return <B3_CheckoutPaymentScreen />;
    case 'B4':
      return <B4_BookingSuccessScreen />;

    // PATH C: In-Match Scoring & Analytics
    case 'C1':
      return <C1_InMatchLoggerScreen />;
    case 'C2':
      return <C2_PostMatchSummaryScreen />;
    case 'C3':
      return <C3_AIDiagnosticsScreen />;
    case 'C4':
      return <C4_MatchRecapCardScreen />;

    // PATH D: AI Coach & Skill-Up Hub
    case 'D1':
      return <D1_AICoachDashboardScreen />;
    case 'D2':
      return <D2_AIQuestsDrillsScreen />;
    case 'D3':
      return <D3_VideoAnalysisScreen />;

    // PATH E: Community & Guilds
    case 'E1':
      return <E1_GuildHubScreen />;
    case 'E2':
      return <E2_GroupEventRSVPScreen />;
    case 'E3':
      return <E3_AISmartMatchmakerScreen />;
    case 'E4':
      return <E4_GroupLeaderboardScreen />;

    // PATH F: Player Profile & Trophy Cabinet
    case 'F1':
      return <F1_UserProfileTrophyScreen />;
    case 'F2':
      return <F2_WearableSyncScreen />;

    default:
      return <HomeScreen />;
  }
};

const screenVariants: Variants = {
  enter: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? '100%' : '-100%',
    opacity: 0.35,
    scale: 0.985,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 350, damping: 32, mass: 0.8 },
      opacity: { duration: 0.22, ease: 'easeOut' },
      scale: { duration: 0.22, ease: 'easeOut' },
    },
  },
  exit: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? '-28%' : '100%',
    opacity: 0,
    scale: 0.985,
    transition: {
      x: { type: 'spring', stiffness: 350, damping: 32, mass: 0.8 },
      opacity: { duration: 0.18, ease: 'easeIn' },
      scale: { duration: 0.18, ease: 'easeIn' },
    },
  }),
};

function MainViewport() {
  const { currentScreen, navDirection } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between min-h-0 relative overflow-hidden">
      <div className="flex-1 w-full h-full min-h-0 relative overflow-hidden">
        <AnimatePresence mode="popLayout" custom={navDirection} initial={false}>
          <motion.div
            key={currentScreen}
            custom={navDirection}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full min-h-0 flex flex-col overflow-hidden"
          >
            <ScreenRenderer />
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomTabBar />
      <ExpCelebrationModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DeviceFrame>
        <MainViewport />
      </DeviceFrame>
    </AppProvider>
  );
}
