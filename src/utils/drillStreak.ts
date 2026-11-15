/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CACHE_KEYS, readCache, writeCache } from './offlineCache';

export interface DrillStreakCacheData {
  completedDates: string[];
  updatedAt: number;
}

export interface StreakDayNode {
  dateKey: string;
  labelTh: string;
  labelEn: string;
  completed: boolean;
  isToday: boolean;
}

export interface DrillStreakSummary {
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  totalDrillsDays: number;
  lastCompletedDate: string | null;
  last7Days: StreakDayNode[];
}

const TH_DAY_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'] as const;
const EN_DAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftDateKey(dateKey: string, offsetDays: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() + offsetDays);
  return getLocalDateKey(dt);
}

function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function normalizeStreakDates(dates: string[], maxDateKey: string = getLocalDateKey()): string[] {
  const valid = new Set<string>();
  for (const item of dates) {
    if (typeof item === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item) && item <= maxDateKey) {
      valid.add(item);
    }
  }
  return Array.from(valid).sort();
}

export function seedDefaultStreakDates(referenceDate: Date = new Date()): string[] {
  const todayKey = getLocalDateKey(referenceDate);
  // Seed a 4-day consecutive streak ending yesterday so completing a drill today advances it to 5
  return [-4, -3, -2, -1].map((offset) => shiftDateKey(todayKey, offset));
}

export function loadDrillStreakDates(): string[] {
  const cached = readCache<DrillStreakCacheData>(CACHE_KEYS.DRILL_STREAK);
  if (cached && Array.isArray(cached.completedDates) && cached.completedDates.length > 0) {
    return normalizeStreakDates(cached.completedDates);
  }
  const seeded = seedDefaultStreakDates();
  writeCache<DrillStreakCacheData>(CACHE_KEYS.DRILL_STREAK, {
    completedDates: seeded,
    updatedAt: Date.now(),
  });
  return seeded;
}

export function persistDrillStreakDates(dates: string[]): string[] {
  const normalized = normalizeStreakDates(dates);
  writeCache<DrillStreakCacheData>(CACHE_KEYS.DRILL_STREAK, {
    completedDates: normalized,
    updatedAt: Date.now(),
  });
  return normalized;
}

export function recordDrillCompletedForToday(currentDates: string[], referenceDate: Date = new Date()): string[] {
  const todayKey = getLocalDateKey(referenceDate);
  if (currentDates.includes(todayKey)) {
    return persistDrillStreakDates(currentDates);
  }
  return persistDrillStreakDates([...currentDates, todayKey]);
}

export function calculateDrillStreakSummary(
  dates: string[],
  referenceDate: Date = new Date()
): DrillStreakSummary {
  const todayKey = getLocalDateKey(referenceDate);
  const yesterdayKey = shiftDateKey(todayKey, -1);
  const normalized = normalizeStreakDates(dates, todayKey);
  const dateSet = new Set(normalized);

  const completedToday = dateSet.has(todayKey);

  // Active streak remains intact if user completed today or yesterday
  let currentStreak = 0;
  let cursor = completedToday ? todayKey : dateSet.has(yesterdayKey) ? yesterdayKey : null;
  while (cursor && dateSet.has(cursor)) {
    currentStreak += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  // Compute longest consecutive chain across history
  let longestStreak = 0;
  let run = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    if (i === 0) {
      run = 1;
    } else if (shiftDateKey(normalized[i - 1], 1) === normalized[i]) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > longestStreak) {
      longestStreak = run;
    }
  }

  const last7Days: StreakDayNode[] = [];
  for (let offset = -6; offset <= 0; offset += 1) {
    const key = shiftDateKey(todayKey, offset);
    const dt = parseDateKey(key);
    const dayIdx = dt.getDay();
    last7Days.push({
      dateKey: key,
      labelTh: TH_DAY_SHORT[dayIdx],
      labelEn: EN_DAY_SHORT[dayIdx],
      completed: dateSet.has(key),
      isToday: key === todayKey,
    });
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    completedToday,
    totalDrillsDays: normalized.length,
    lastCompletedDate: normalized.length > 0 ? normalized[normalized.length - 1] : null,
    last7Days,
  };
}
