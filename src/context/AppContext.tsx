/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState } from 'react';
import {
  ScreenId,
  MainTab,
  AppViewMode,
  PlayerProfile,
  CourtFacility,
  CourtSlot,
  BookingState,
  MatchScoreState,
  ShotLogItem,
  Quest,
  AIDrill,
  GuildGroup,
  GuildEvent,
  LeaderboardUser,
} from '../types';
import {
  INITIAL_PLAYER,
  COURTS_DATA,
  INITIAL_QUESTS,
  AI_DRILLS,
  GUILDS_DATA,
  CURRENT_GUILD_EVENT,
  LEADERBOARD_DATA,
} from '../data/mockData';

interface ExpGainPayload {
  amount: number;
  source: string;
  badgeUnlocked?: string;
  newLevel?: number;
}

interface AppContextType {
  // Navigation
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId, direction?: 'forward' | 'backward') => void;
  navDirection: 'forward' | 'backward';
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  isDeviceFrameEnabled: boolean;
  toggleDeviceFrame: () => void;
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;

  // Player & Gamification
  player: PlayerProfile;
  updatePlayer: (updates: Partial<PlayerProfile>) => void;
  gainExp: (amount: number, source: string, badgeName?: string) => void;
  expCelebration: ExpGainPayload | null;
  dismissExpCelebration: () => void;

  // Court Booking
  courts: CourtFacility[];
  selectedCourt: CourtFacility;
  setSelectedCourt: (court: CourtFacility) => void;
  booking: BookingState;
  updateBooking: (updates: Partial<BookingState>) => void;
  resetBooking: () => void;

  // Match Scoring
  match: MatchScoreState;
  addScorePoint: (team: 'A' | 'B', shotType?: any, errorReason?: any) => void;
  undoLastPoint: () => void;
  finishMatch: () => void;
  startNewMatch: () => void;

  // Quests & AI Drills
  quests: Quest[];
  claimQuestReward: (questId: string) => void;
  drills: AIDrill[];
  completeDrill: (drillId: string) => void;

  // Guild & Event
  guilds: GuildGroup[];
  currentEvent: GuildEvent;
  toggleEventRsvp: (userId: string) => void;
  leaderboard: LeaderboardUser[];

  // Wearables
  wearableConnected: boolean;
  setWearableConnected: (connected: boolean) => void;
  wearableMetrics: {
    heartRateBpm: number;
    caloriesBurned: number;
    distanceKm: number;
    expConverted: boolean;
  };
  convertCaloriesToExp: () => void;

  // Video Analysis demo state
  analyzedVideoResult: any;
  setAnalyzedVideoResult: (res: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('B1');
  const [navDirection, setNavDirection] = useState<'forward' | 'backward'>('forward');
  const [activeTab, setActiveTabState] = useState<MainTab>('home');
  const [isDeviceFrameEnabled, setIsDeviceFrameEnabled] = useState<boolean>(true);
  const [viewMode, setViewModeState] = useState<AppViewMode>('showcase');

  const setViewMode = (mode: AppViewMode) => {
    setViewModeState(mode);
  };

  React.useEffect(() => {
    (window as any).__setAppViewMode = setViewMode;
  }, []);

  // Player State
  const [player, setPlayer] = useState<PlayerProfile>(INITIAL_PLAYER);
  const [expCelebration, setExpCelebration] = useState<ExpGainPayload | null>(null);

  // Court Booking State
  const [courts] = useState<CourtFacility[]>(COURTS_DATA);
  const [selectedCourt, setSelectedCourt] = useState<CourtFacility>(COURTS_DATA[0]);
  const [booking, setBooking] = useState<BookingState>({
    court: COURTS_DATA[0],
    selectedCourtNumber: 3,
    selectedSlots: [
      {
        id: 'slot_19_20',
        courtNumber: 3,
        startTime: '19:00',
        endTime: '20:00',
        price: 280,
        isAvailable: true,
        isSelected: true,
      },
      {
        id: 'slot_20_21',
        courtNumber: 3,
        startTime: '20:00',
        endTime: '21:00',
        price: 280,
        isAvailable: true,
        isSelected: true,
      },
    ],
    date: '2026-11-07',
    totalAmount: 560,
    paymentMethod: 'PromptPay',
    slipUploaded: false,
    bookingRef: 'BK-SMA-8921',
  });

  // Match Scoring State
  const [match, setMatch] = useState<MatchScoreState>({
    playerAName: 'กานต์ & โอห์ม',
    playerBName: 'อาร์ท & ท็อป',
    isDoubles: true,
    scoreA: 19,
    scoreB: 18,
    setsWonA: 1,
    setsWonB: 0,
    currentSet: 2,
    pastSets: [{ set: 1, scoreA: 21, scoreB: 17 }],
    server: 'A',
    serviceBox: 'left',
    isMatchFinished: false,
    shotHistory: [
      {
        id: 'shot_1',
        pointNumber: 35,
        team: 'A',
        shotType: 'Smash',
        timestamp: '19:42',
        zone: 'mid-right',
      },
      {
        id: 'shot_2',
        pointNumber: 36,
        team: 'B',
        shotType: 'Drop',
        timestamp: '19:43',
        zone: 'front-left',
      },
      {
        id: 'shot_3',
        pointNumber: 37,
        team: 'A',
        shotType: 'Smash',
        timestamp: '19:44',
        zone: 'back-right',
      },
    ],
  });

  // Quests & Drills State
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [drills, setDrills] = useState<AIDrill[]>(AI_DRILLS);

  // Guilds & Leaderboard State
  const [guilds] = useState<GuildGroup[]>(GUILDS_DATA);
  const [currentEvent, setCurrentEvent] = useState<GuildEvent>(CURRENT_GUILD_EVENT);
  const [leaderboard] = useState<LeaderboardUser[]>(LEADERBOARD_DATA);

  // Wearable State
  const [wearableConnected, setWearableConnected] = useState<boolean>(true);
  const [wearableMetrics, setWearableMetrics] = useState({
    heartRateBpm: 164,
    caloriesBurned: 680,
    distanceKm: 3.42,
    expConverted: false,
  });

  // Video Analysis State
  const [analyzedVideoResult, setAnalyzedVideoResult] = useState<any>(null);

  const SCREEN_ORDER: Record<ScreenId, number> = {
    A1: 0, A2: 1,
    B1: 10, B2: 11, B3: 12, B4: 13,
    C1: 20, C2: 21, C3: 22, C4: 23,
    D1: 30, D2: 31, D3: 32,
    E1: 40, E2: 41, E3: 42, E4: 43,
    F1: 50, F2: 51,
  };

  // Helpers
  const navigateTo = (screen: ScreenId, direction?: 'forward' | 'backward') => {
    const dir = direction || (SCREEN_ORDER[screen] < SCREEN_ORDER[currentScreen] ? 'backward' : 'forward');
    setNavDirection(dir);
    setCurrentScreen(screen);
    // sync tab
    if (['A1', 'A2'].includes(screen)) {
      // keep
    } else if (['B1', 'B2', 'B3', 'B4'].includes(screen)) {
      setActiveTabState('booking');
    } else if (['C1', 'C2', 'C3', 'C4'].includes(screen)) {
      setActiveTabState('logger');
    } else if (['D1', 'D2', 'D3'].includes(screen)) {
      setActiveTabState('coach');
    } else if (['E1', 'E2', 'E3', 'E4'].includes(screen)) {
      setActiveTabState('community');
    } else if (['F1', 'F2'].includes(screen)) {
      setActiveTabState('profile');
    }
  };

  const setActiveTab = (tab: MainTab) => {
    let targetScreen: ScreenId = 'D1';
    switch (tab) {
      case 'home':
        targetScreen = 'D1'; // Dashboard hub
        break;
      case 'booking':
        targetScreen = 'B1'; // Discovery
        break;
      case 'logger':
        targetScreen = 'C1'; // Match logger
        break;
      case 'coach':
        targetScreen = 'D1'; // AI Coach
        break;
      case 'community':
        targetScreen = 'E1'; // Guild hub
        break;
      case 'profile':
        targetScreen = 'F1'; // Trophy room
        break;
    }
    navigateTo(targetScreen);
  };

  const toggleDeviceFrame = () => {
    setIsDeviceFrameEnabled((prev) => !prev);
  };

  const updatePlayer = (updates: Partial<PlayerProfile>) => {
    setPlayer((prev) => ({ ...prev, ...updates }));
  };

  const gainExp = (amount: number, source: string, badgeName?: string) => {
    setPlayer((prev) => {
      let newExp = prev.currentExp + amount;
      let newLevel = prev.level;
      let nextLevelExp = prev.nextLevelExp;

      if (newExp >= nextLevelExp) {
        newExp = newExp - nextLevelExp;
        newLevel += 1;
        nextLevelExp = Math.round(nextLevelExp * 1.25);
      }

      setExpCelebration({
        amount,
        source,
        badgeUnlocked: badgeName,
        newLevel: newLevel !== prev.level ? newLevel : undefined,
      });

      return {
        ...prev,
        level: newLevel,
        currentExp: newExp,
        nextLevelExp,
      };
    });
  };

  const dismissExpCelebration = () => {
    setExpCelebration(null);
  };

  const updateBooking = (updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const resetBooking = () => {
    setBooking({
      court: selectedCourt,
      selectedCourtNumber: 1,
      selectedSlots: [],
      date: '2026-11-07',
      totalAmount: 0,
      paymentMethod: 'PromptPay',
      slipUploaded: false,
      bookingRef: `BK-SMA-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  const addScorePoint = (team: 'A' | 'B', shotType: any = 'Smash', errorReason?: any) => {
    setMatch((prev) => {
      const nextScoreA = team === 'A' ? prev.scoreA + 1 : prev.scoreA;
      const nextScoreB = team === 'B' ? prev.scoreB + 1 : prev.scoreB;

      // Determine serving box (Badminton rule: even = right, odd = left)
      const servingScore = team === 'A' ? nextScoreA : nextScoreB;
      const nextBox = servingScore % 2 === 0 ? 'right' : 'left';

      const newShot: ShotLogItem = {
        id: `shot_${Date.now()}`,
        pointNumber: nextScoreA + nextScoreB,
        team,
        shotType: shotType || (team === 'A' ? 'Smash' : 'Drop'),
        errorReason,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        zone: team === 'A' ? 'mid-right' : 'front-left',
      };

      // Check set point (21 or deuce up to 30)
      let currentSetWonA = prev.setsWonA;
      let currentSetWonB = prev.setsWonB;
      let isSetOver = false;

      if (
        (nextScoreA >= 21 && nextScoreA - nextScoreB >= 2) ||
        nextScoreA === 30
      ) {
        currentSetWonA += 1;
        isSetOver = true;
      } else if (
        (nextScoreB >= 21 && nextScoreB - nextScoreA >= 2) ||
        nextScoreB === 30
      ) {
        currentSetWonB += 1;
        isSetOver = true;
      }

      if (isSetOver) {
        const past = [
          ...prev.pastSets,
          { set: prev.currentSet, scoreA: nextScoreA, scoreB: nextScoreB },
        ];
        const isMatchDone = currentSetWonA === 2 || currentSetWonB === 2;
        return {
          ...prev,
          scoreA: isMatchDone ? nextScoreA : 0,
          scoreB: isMatchDone ? nextScoreB : 0,
          setsWonA: currentSetWonA,
          setsWonB: currentSetWonB,
          currentSet: isMatchDone ? prev.currentSet : prev.currentSet + 1,
          pastSets: past,
          server: team,
          serviceBox: nextBox,
          shotHistory: [newShot, ...prev.shotHistory],
          isMatchFinished: isMatchDone,
          winner: isMatchDone ? (currentSetWonA === 2 ? 'A' : 'B') : undefined,
        };
      }

      return {
        ...prev,
        scoreA: nextScoreA,
        scoreB: nextScoreB,
        server: team,
        serviceBox: nextBox,
        shotHistory: [newShot, ...prev.shotHistory],
      };
    });
  };

  const undoLastPoint = () => {
    setMatch((prev) => {
      if (prev.shotHistory.length === 0) return prev;
      const lastShot = prev.shotHistory[0];
      const newHistory = prev.shotHistory.slice(1);
      const newScoreA = lastShot.team === 'A' ? Math.max(0, prev.scoreA - 1) : prev.scoreA;
      const newScoreB = lastShot.team === 'B' ? Math.max(0, prev.scoreB - 1) : prev.scoreB;

      return {
        ...prev,
        scoreA: newScoreA,
        scoreB: newScoreB,
        shotHistory: newHistory,
      };
    });
  };

  const finishMatch = () => {
    setMatch((prev) => ({
      ...prev,
      isMatchFinished: true,
      winner: prev.scoreA >= prev.scoreB ? 'A' : 'B',
    }));
    // Award match EXP
    gainExp(350, 'จบการแข่งขันแมตช์เต็ม (Match Finished)', 'Smash King Tier II');
    navigateTo('C2');
  };

  const startNewMatch = () => {
    setMatch({
      playerAName: 'กานต์ & โอห์ม',
      playerBName: 'อาร์ท & ท็อป',
      isDoubles: true,
      scoreA: 0,
      scoreB: 0,
      setsWonA: 0,
      setsWonB: 0,
      currentSet: 1,
      pastSets: [],
      server: 'A',
      serviceBox: 'right',
      shotHistory: [],
      isMatchFinished: false,
    });
    navigateTo('C1');
  };

  const claimQuestReward = (questId: string) => {
    const q = quests.find((item) => item.id === questId);
    if (!q || q.claimed || q.current < q.target) return;

    setQuests((prev) =>
      prev.map((item) => (item.id === questId ? { ...item, claimed: true } : item))
    );
    gainExp(q.expReward, `สำเร็จภารกิจ: ${q.thaiTitle}`);
  };

  const completeDrill = (drillId: string) => {
    const d = drills.find((item) => item.id === drillId);
    if (!d || d.completed) return;

    setDrills((prev) =>
      prev.map((item) => (item.id === drillId ? { ...item, completed: true } : item))
    );
    gainExp(d.expReward, `สำเร็จการซ้อม AI Drill: ${d.thaiTitle}`);
  };

  const toggleEventRsvp = (userId: string) => {
    setCurrentEvent((prev) => {
      const isAlreadyAttending = prev.attendees.some((a) => a.id === userId);
      if (isAlreadyAttending) {
        return {
          ...prev,
          attendees: prev.attendees.filter((a) => a.id !== userId),
        };
      } else {
        const newAttendee = {
          id: userId,
          name: player.name,
          avatar: player.avatarUrl,
          tier: player.tier,
          ovr: 85,
          paid: false,
        };
        return {
          ...prev,
          attendees: [...prev.attendees, newAttendee],
        };
      }
    });
  };

  const convertCaloriesToExp = () => {
    if (wearableMetrics.expConverted) return;
    const bonusExp = Math.round(wearableMetrics.caloriesBurned * 0.2); // 680 * 0.2 = 136 EXP
    setWearableMetrics((prev) => ({ ...prev, expConverted: true }));
    gainExp(bonusExp, 'Smartwatch Health Sync (เบิร์น 680 แคลอรี่)');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        navDirection,
        activeTab,
        setActiveTab,
        isDeviceFrameEnabled,
        toggleDeviceFrame,
        viewMode,
        setViewMode,
        player,
        updatePlayer,
        gainExp,
        expCelebration,
        dismissExpCelebration,
        courts,
        selectedCourt,
        setSelectedCourt,
        booking,
        updateBooking,
        resetBooking,
        match,
        addScorePoint,
        undoLastPoint,
        finishMatch,
        startNewMatch,
        quests,
        claimQuestReward,
        drills,
        completeDrill,
        guilds,
        currentEvent,
        toggleEventRsvp,
        leaderboard,
        wearableConnected,
        setWearableConnected,
        wearableMetrics,
        convertCaloriesToExp,
        analyzedVideoResult,
        setAnalyzedVideoResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
