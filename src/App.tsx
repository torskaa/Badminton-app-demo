/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import firebaseConfig from '../firebase-applet-config.json';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { BottomTabBar } from './components/common/BottomTabBar';
import { GameCompanionWidget } from './components/common/GameCompanionWidget';
import { ExpCelebrationModal } from './components/common/ExpCelebrationModal';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { NotificationBanner } from './components/common/NotificationBanner';
import { OfflineIndicator } from './components/common/OfflineIndicator';

// Redesigned Grab-Superapp Primary Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { CourtMapScreen } from './components/screens/CourtMapScreen';
import { ClubToolsScreen } from './components/screens/ClubToolsScreen';
import { BadmintonFeedScreen } from './components/screens/BadmintonFeedScreen';
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
  const { currentScreen, isScreenLoading } = useApp();

  if (isScreenLoading) {
    return <LoadingSkeleton screen={currentScreen} />;
  }

  switch (currentScreen) {
    // PRIMARY SUPERAPP SCREENS (Grab Layout)
    case 'HOME':
      return <HomeScreen />;
    case 'MAP':
      return <CourtMapScreen />;
    case 'CLUB_TOOLS':
      return <ClubToolsScreen />;
    case 'FEED':
      return <BadmintonFeedScreen />;
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
    opacity: 0,
    scale: 0.985,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 380, damping: 34, mass: 0.85 },
      opacity: { duration: 0.2, ease: 'easeOut' },
      scale: { duration: 0.2, ease: 'easeOut' },
    },
  },
  exit: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? '-24%' : '100%',
    opacity: 0,
    scale: 0.985,
    transition: {
      x: { type: 'spring', stiffness: 380, damping: 34, mass: 0.85 },
      opacity: { duration: 0.16, ease: 'easeOut' },
      scale: { duration: 0.16, ease: 'easeOut' },
    },
  }),
};

// Feature flag to show/hide character companion without deleting code
const SHOW_GAME_COMPANION = false;

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
      <NotificationBanner />
      <OfflineIndicator />
      {SHOW_GAME_COMPANION && <GameCompanionWidget />}
      <BottomTabBar />
      <ExpCelebrationModal />
    </div>
  );
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message || 'Unexpected application error' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('SmashAI ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.message || '';
      const isQuotaExceeded = msg.includes('Quota exceeded');
      const isFreeReadUnitsQuota = msg.includes(
        "Free daily read units per project (free tier database)"
      );
      const upgradeUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data?openUpgradeDialog=true`;

      return (
        <div className="min-h-screen bg-[#f8faf6] flex items-center justify-center p-6">
          <div className="max-w-sm w-full bg-white rounded-3xl p-6 shadow-xl border border-[#d4dfd0] text-center space-y-4">
            <img
              src="/apple-touch-icon.png"
              alt="SmashAI"
              className="w-16 h-16 rounded-2xl mx-auto shadow-md"
            />
            {isQuotaExceeded ? (
              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-[#004d2c]">
                  Firestore Daily Quota Reached
                </h2>
                <p className="text-xs text-[#5c6f5e] leading-relaxed">
                  Your free-tier Firestore usage limit has been reached for today. Daily quota
                  resets tomorrow. See the Spark plan limits under the Enterprise edition section on{' '}
                  <a
                    href="https://firebase.google.com/pricing#cloud-firestore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold text-[#004d2c]"
                  >
                    Firebase Firestore Pricing
                  </a>
                  .
                </p>
                {isFreeReadUnitsQuota && (
                  <a
                    href={upgradeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full py-2.5 px-4 rounded-2xl bg-[#e8f7ee] border border-[#7cd7a0] text-[#004d2c] font-bold text-xs"
                  >
                    Open Firestore Database Upgrade Settings
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <h2 className="text-lg font-extrabold text-[#004d2c]">
                  เกิดข้อผิดพลาดชั่วคราว
                </h2>
                <p className="text-xs text-[#5c6f5e] leading-relaxed">
                  แอปพบปัญหาเล็กน้อยระหว่างทำงาน กดโหลดใหม่เพื่อกลับมาใช้งานต่อได้ทันที
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-2xl bg-[#004d2c] hover:bg-[#003b22] text-white font-bold text-sm transition cursor-pointer"
            >
              รีเฟรชแอป (Reload)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [isMapsQuotaExceeded, setIsMapsQuotaExceeded] = React.useState(false);

  React.useEffect(() => {
    const handleQuotaExceeded = () => {
      setIsMapsQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  return (
    <AppErrorBoundary>
      {isMapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <AppProvider>
        <DeviceFrame>
          <MainViewport />
        </DeviceFrame>
      </AppProvider>
    </AppErrorBoundary>
  );
}
