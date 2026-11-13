/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIDrill, CourtFacility, MatchScoreState, PlayerProfile, Quest } from '../types';

export const CACHE_KEYS = {
  COURT_MAP: 'smashai_v1_court_map_cache',
  QUESTS_DRILLS: 'smashai_v1_quests_drills_cache',
  PLAYER_MATCH: 'smashai_v1_player_match_cache',
} as const;

export interface CourtMapCacheData {
  courts: CourtFacility[];
  selectedCourtId: string;
  activeFilter: string | null;
  searchQuery: string;
  onlyBookable: boolean;
  showPricePerHour: boolean;
  sheetState: 'peek' | 'half' | 'full';
  pan: { x: number; y: number };
  zoom: number;
  lastSyncedAt: number;
}

export interface QuestsDrillsCacheData {
  quests: Quest[];
  drills: AIDrill[];
  activeTab: 'quests' | 'drills';
  lastSyncedAt: number;
  pendingSync: boolean;
}

export interface PlayerMatchCacheData {
  player: PlayerProfile;
  match: MatchScoreState;
  selectedCourtId: string;
  lastSyncedAt: number;
  pendingSync: boolean;
}

function canUseStorage(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function readCache<T>(key: string): T | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as T;
    if (parsed === null || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, value: T): boolean {
  if (!canUseStorage()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Handle QuotaExceededError or private browsing gracefully
    return false;
  }
}

export function removeCache(key: string): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage errors
  }
}

export function clearAllOfflineCaches(): void {
  removeCache(CACHE_KEYS.COURT_MAP);
  removeCache(CACHE_KEYS.QUESTS_DRILLS);
  removeCache(CACHE_KEYS.PLAYER_MATCH);
}

export function formatCacheTimestamp(timestamp: number | null, lang: 'th' | 'en'): string {
  if (!timestamp) {
    return lang === 'th' ? 'ยังไม่มีแคช' : 'Not cached';
  }
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '--:--';
  }
}

export function getCacheOverview(): {
  courtMapSyncedAt: number | null;
  questsSyncedAt: number | null;
  matchSyncedAt: number | null;
  hasPendingSync: boolean;
} {
  const courtMap = readCache<CourtMapCacheData>(CACHE_KEYS.COURT_MAP);
  const quests = readCache<QuestsDrillsCacheData>(CACHE_KEYS.QUESTS_DRILLS);
  const playerMatch = readCache<PlayerMatchCacheData>(CACHE_KEYS.PLAYER_MATCH);

  return {
    courtMapSyncedAt: courtMap?.lastSyncedAt ?? null,
    questsSyncedAt: quests?.lastSyncedAt ?? null,
    matchSyncedAt: playerMatch?.lastSyncedAt ?? null,
    hasPendingSync: Boolean(quests?.pendingSync || playerMatch?.pendingSync),
  };
}
