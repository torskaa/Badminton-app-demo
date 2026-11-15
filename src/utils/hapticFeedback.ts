/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HapticPatternType =
  | 'light'
  | 'point_a'
  | 'point_b'
  | 'undo'
  | 'set_won';

const HAPTICS_STORAGE_KEY = 'smashai_v1_haptics_enabled';

const HAPTIC_PATTERNS: Record<HapticPatternType, number | number[]> = {
  light: 12,
  point_a: 32,              // Single crisp pulse for Team A point
  point_b: [18, 28, 18],    // Distinct double pulse for Team B point
  undo: [16, 22, 36],       // Reverse double nudge for point undo
  set_won: [45, 35, 65, 35, 95], // Celebration burst for set/match point
};

export function isHapticSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

export function loadHapticsPreference(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    const raw = window.localStorage.getItem(HAPTICS_STORAGE_KEY);
    if (raw === null) return true;
    return raw === 'true';
  } catch {
    return true;
  }
}

export function saveHapticsPreference(enabled: boolean): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(HAPTICS_STORAGE_KEY, String(enabled));
  } catch {
    // Ignore storage quota or private mode errors
  }
}

export function triggerHaptic(
  pattern: HapticPatternType = 'light',
  enabled = true
): boolean {
  if (!enabled || !isHapticSupported()) return false;
  try {
    return navigator.vibrate(HAPTIC_PATTERNS[pattern]);
  } catch {
    return false;
  }
}
