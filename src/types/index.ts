/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenId = 
  | 'HOME' // Superapp Home Screen (Grab style)
  | 'MAP' // Discover / Court Map Screen with Bottom Sheet
  | 'CLUB_TOOLS' // Club Assistant Tools Screen (Scoreboard, Randomizer, Tactic Board, Split Calc)
  | 'FINANCE' // Finance & Wallet Screen (Purple Theme)
  | 'A1' // Welcome
  | 'A2' // Player Avatar & Playstyle Setup
  | 'B1' // Court Discovery
  | 'B2' // Court Detail & Slot Selection
  | 'B3' // Checkout & Payment
  | 'B4' // Booking Success & Quest Progress
  | 'C1' // Quick In-Match Logger
  | 'C2' // Post-Match XP & Stat Summary
  | 'C3' // AI Match Diagnostics
  | 'C4' // Match Recap Card (Social Share)
  | 'D1' // AI Personal Dashboard (Skill Radar)
  | 'D2' // AI Quests & Training Drills
  | 'D3' // Video Analysis Upload
  | 'E1' // My Groups & Guild Hub
  | 'E2' // Group Match Event & RSVP (Split Bill)
  | 'E3' // AI Smart Matchmaker / Team Balancing
  | 'E4' // Group Leaderboard & Season Tier
  | 'F1' // User Profile & Trophy Room
  | 'F2'; // Wearable Companion Sync

export type MainTab = 'home' | 'club' | 'discover' | 'more' | 'profile';

export type AppViewMode = 'single' | 'showcase';

export type PlayerTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Pro';

export interface SkillRadar {
  power: number;     // e.g. 88 (Smash speed, offensive impact)
  speed: number;     // e.g. 82 (Footwork, court coverage)
  control: number;   // e.g. 76 (Net drops, clears accuracy)
  stamina: number;   // e.g. 84 (3rd set performance)
  tactics: number;   // e.g. 90 (Court placement, shot selection)
}

export interface Badge {
  id: string;
  name: string;
  thaiName: string;
  description: string;
  iconName: string;
  category: 'combat' | 'endurance' | 'social' | 'special';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  currentExp: number;
  nextLevelExp: number;
  tier: PlayerTier;
  streakWeeks: number;
  dominantHand: 'Right' | 'Left';
  playstyle: 'Attacking Smash Hunter' | 'Defensive Wall' | 'Net Control Wizard' | 'All-Rounder';
  primaryGoal: 'Smash Mastery' | 'Lightning Footwork' | 'Tactical Net Play' | 'Endurance';
  skillRadar: SkillRadar;
  pastRadar: SkillRadar; // For level comparison
  racket: {
    model: string;
    weightGrip: string;
    stringTension: string;
    stringType: string;
  };
  stats: {
    totalMatches: number;
    winRate: number;
    totalSmashes: number;
    highestSmashSpeedKmh: number;
    totalPlayHours: number;
  };
  badges: Badge[];
}

export interface CourtFacility {
  id: string;
  name: string;
  location: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  hasAirCon: boolean;
  courtCount: number;
  surfaceType: 'BWF Taraflex (Green)' | 'Parquet Wood' | 'Synthetic Rubber';
  bonusExpMultiplier: number;
  imageUrl: string;
  amenities: string[];
  slotsAvailableToday: number;
  latitude?: number;
  longitude?: number;
  hasParking?: boolean;
  hasShower?: boolean;
  hasEvCharging?: boolean;
  hasRacketRental?: boolean;
  isBookable?: boolean;
}

export interface FinanceTransaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'debit' | 'credit';
  date: string;
  category: 'court_booking' | 'split_bill' | 'wallet_topup' | 'gear_purchase';
  status: 'completed' | 'pending';
}

export interface CourtSlot {
  id: string;
  courtNumber: number;
  startTime: string;
  endTime: string;
  price: number;
  isAvailable: boolean;
  isSelected?: boolean;
}

export interface BookingState {
  court?: CourtFacility;
  selectedCourtNumber: number;
  selectedSlots: CourtSlot[];
  date: string;
  totalAmount: number;
  paymentMethod: 'PromptPay' | 'CreditCard';
  slipUploaded: boolean;
  bookingRef: string;
}

export type ShotType = 'Smash' | 'Drop' | 'Net' | 'Drive' | 'Clear' | 'Lift';
export type ErrorReason = 'Net Tape' | 'Out Wide' | 'Out Baseline' | 'Footwork Fault' | 'Unforced';

export interface ShotLogItem {
  id: string;
  pointNumber: number;
  team: 'A' | 'B';
  shotType: ShotType;
  errorReason?: ErrorReason;
  timestamp: string;
  zone: 'front-left' | 'front-right' | 'mid-left' | 'mid-right' | 'back-left' | 'back-right';
}

export interface MatchScoreState {
  playerAName: string;
  playerBName: string;
  isDoubles: boolean;
  scoreA: number;
  scoreB: number;
  setsWonA: number;
  setsWonB: number;
  currentSet: number;
  pastSets: { set: number; scoreA: number; scoreB: number }[];
  server: 'A' | 'B';
  serviceBox: 'right' | 'left';
  shotHistory: ShotLogItem[];
  isMatchFinished: boolean;
  winner?: 'A' | 'B';
}

export interface AIDiagnosticReport {
  overallGrade: string;
  smashWinRate: number;
  netSuccessRate: number;
  unforcedErrorCount: number;
  fatigueIndex: number;
  primaryWeakness: string;
  aiInsights: string[];
  recommendedDrillIds: string[];
}

export interface Quest {
  id: string;
  title: string;
  thaiTitle: string;
  type: 'daily' | 'weekly';
  expReward: number;
  current: number;
  target: number;
  claimed: boolean;
  icon: string;
}

export interface AIDrill {
  id: string;
  title: string;
  thaiTitle: string;
  focusArea: 'Smash' | 'Net Play' | 'Footwork' | 'Defense';
  difficulty: 'Beginner' | 'Intermediate' | 'Pro';
  durationMin: number;
  expReward: number;
  description: string;
  videoPlaceholderUrl: string;
  completed: boolean;
  steps: string[];
}

export interface GuildGroup {
  id: string;
  name: string;
  tag: string;
  level: number;
  memberCount: number;
  maxMembers: number;
  regularDays: string;
  homeCourt: string;
  guildPerks: string[];
  avatarColor: string;
}

export interface GuildEvent {
  id: string;
  guildId: string;
  title: string;
  courtName: string;
  date: string;
  timeRange: string;
  courtFeeTotal: number;
  shuttlecockFeeTotal: number;
  maxPlayers: number;
  attendees: {
    id: string;
    name: string;
    avatar: string;
    tier: PlayerTier;
    ovr: number;
    paid: boolean;
    isHost?: boolean;
  }[];
  waitlist: string[];
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  tier: PlayerTier;
  ovr: number;
  winRate: number;
  totalGames: number;
  smashPoints: number;
  exp: number;
  guildTitle: string;
  avatarUrl: string;
}
