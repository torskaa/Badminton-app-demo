/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { BottomTabBar } from './components/common/BottomTabBar';
import { ExpCelebrationModal } from './components/common/ExpCelebrationModal';

// Screens
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
      return <D1_AICoachDashboardScreen />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <DeviceFrame>
        <div className="flex-1 flex flex-col justify-between min-h-0 relative">
          <ScreenRenderer />
          <BottomTabBar />
          <ExpCelebrationModal />
        </div>
      </DeviceFrame>
    </AppProvider>
  );
}
