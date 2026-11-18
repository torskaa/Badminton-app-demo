/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GeoPoint {
  lat: number;
  lng: number;
}

export const BANGKOK_DEFAULT_CENTER: GeoPoint = {
  lat: 13.7649,
  lng: 100.5698,
};

/**
 * Great-circle Haversine distance in kilometers (rounded to 1 decimal place).
 */
export function calculateHaversineKm(from: GeoPoint, to: GeoPoint): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(0.1, Math.round(R * c * 10) / 10);
}

/**
 * Local calendar date in YYYY-MM-DD format.
 */
export function getTodayIsoDate(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface UpcomingDayOption {
  isoDate: string;
  dayLabel: string;
  dateNum: number;
  monthYearLabel: string;
  isToday: boolean;
}

const THAI_DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
const EN_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const THAI_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];
const EN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function generateUpcomingDays(isThai: boolean, count = 7, baseDate: Date = new Date()): UpcomingDayOption[] {
  const list: UpcomingDayOption[] = [];
  for (let i = 0; i < count; i += 1) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + i);
    const dow = d.getDay();
    const dayLabel =
      i === 0
        ? isThai
          ? 'วันนี้'
          : 'Today'
        : isThai
          ? THAI_DAYS[dow]
          : EN_DAYS[dow];
    const monthLabel = isThai
      ? `${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`
      : `${EN_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    list.push({
      isoDate: getTodayIsoDate(d),
      dayLabel,
      dateNum: d.getDate(),
      monthYearLabel: monthLabel,
      isToday: i === 0,
    });
  }
  return list;
}

export const COURT_SLOT_HOURS = [
  { id: 's_16', startTime: '16:00', endTime: '17:00', startHour: 16 },
  { id: 's_17', startTime: '17:00', endTime: '18:00', startHour: 17 },
  { id: 's_18', startTime: '18:00', endTime: '19:00', startHour: 18 },
  { id: 's_19', startTime: '19:00', endTime: '20:00', startHour: 19 },
  { id: 's_20', startTime: '20:00', endTime: '21:00', startHour: 20 },
  { id: 's_21', startTime: '21:00', endTime: '22:00', startHour: 21 },
  { id: 's_22', startTime: '22:00', endTime: '23:00', startHour: 22 },
];

export function isSlotElapsedToday(dateIso: string, startHour: number, now: Date = new Date()): boolean {
  if (dateIso !== getTodayIsoDate(now)) {
    return false;
  }
  return now.getHours() >= startHour;
}

export function getGoogleMapsDirectionsUrl(lat: number, lng: number, label?: string): string {
  const dest = `${lat},${lng}`;
  const params = new URLSearchParams({
    api: '1',
    destination: dest,
  });
  if (label) {
    params.set('destination_place_id', '');
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}
