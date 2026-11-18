/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateHaversineKm } from './geoUtils';

export interface ParsedWorkoutSession {
  title: string;
  source: string;
  sportType: string;
  dateIso: string;
  durationMin: number;
  avgHeartRate: number;
  maxHeartRate: number;
  caloriesBurned: number;
  distanceKm: number;
}

function estimateCaloriesFromHr(durationMin: number, avgHr: number): number {
  const safeMin = Math.max(5, Math.min(360, durationMin || 45));
  const intensityFactor = avgHr >= 155 ? 10.5 : avgHr >= 135 ? 8.5 : 6.8;
  return Math.round(safeMin * intensityFactor);
}

function parseTcxDocument(doc: Document, fallbackName: string): ParsedWorkoutSession | null {
  const activity = doc.getElementsByTagName('Activity')[0];
  if (!activity) return null;

  const sportAttr = activity.getAttribute('Sport') || 'Badminton';
  const idNode = activity.getElementsByTagName('Id')[0];
  const dateIso = idNode?.textContent?.trim() || new Date().toISOString();

  const laps = Array.from(activity.getElementsByTagName('Lap'));
  let totalSeconds = 0;
  let totalMeters = 0;
  let totalCalories = 0;
  let weightedHrSum = 0;
  let weightedHrDur = 0;
  let maxHr = 0;

  for (const lap of laps) {
    const sec = Number(lap.getElementsByTagName('TotalTimeSeconds')[0]?.textContent || 0);
    const dist = Number(lap.getElementsByTagName('DistanceMeters')[0]?.textContent || 0);
    const cal = Number(lap.getElementsByTagName('Calories')[0]?.textContent || 0);
    const avgHrNode = lap.getElementsByTagName('AverageHeartRateBpm')[0];
    const lapAvgHr = Number(avgHrNode?.getElementsByTagName('Value')[0]?.textContent || 0);
    const maxHrNode = lap.getElementsByTagName('MaximumHeartRateBpm')[0];
    const lapMaxHr = Number(maxHrNode?.getElementsByTagName('Value')[0]?.textContent || 0);

    if (Number.isFinite(sec)) totalSeconds += sec;
    if (Number.isFinite(dist)) totalMeters += dist;
    if (Number.isFinite(cal)) totalCalories += cal;
    if (lapAvgHr > 0) {
      const weight = sec > 0 ? sec : 1;
      weightedHrSum += lapAvgHr * weight;
      weightedHrDur += weight;
    }
    if (lapMaxHr > maxHr) maxHr = lapMaxHr;
  }

  // Fallback: compute HR from individual Trackpoints if Lap averages were missing
  if (weightedHrDur === 0) {
    const hrNodes = Array.from(doc.getElementsByTagName('HeartRateBpm'));
    let sum = 0;
    let count = 0;
    for (const node of hrNodes) {
      const val = Number(node.getElementsByTagName('Value')[0]?.textContent || 0);
      if (val >= 45 && val <= 230) {
        sum += val;
        count += 1;
        if (val > maxHr) maxHr = val;
      }
    }
    if (count > 0) {
      weightedHrSum = sum;
      weightedHrDur = count;
    }
  }

  const creatorName =
    activity.getElementsByTagName('Creator')[0]?.getElementsByTagName('Name')[0]?.textContent?.trim() ||
    'TCX Workout';
  const durationMin = Math.max(1, Math.round(totalSeconds / 60) || 45);
  const avgHeartRate = weightedHrDur > 0 ? Math.round(weightedHrSum / weightedHrDur) : 148;
  const finalMaxHr = Math.max(avgHeartRate, Math.round(maxHr || avgHeartRate + 18));
  const caloriesBurned =
    totalCalories > 0 ? Math.round(totalCalories) : estimateCaloriesFromHr(durationMin, avgHeartRate);
  const distanceKm = Number(Math.max(0.2, totalMeters / 1000).toFixed(2));

  return {
    title: `${sportAttr} (${fallbackName.replace(/\.tcx$/i, '')})`,
    source: creatorName,
    sportType: sportAttr,
    dateIso,
    durationMin,
    avgHeartRate,
    maxHeartRate: finalMaxHr,
    caloriesBurned,
    distanceKm,
  };
}

function parseGpxDocument(doc: Document, fallbackName: string): ParsedWorkoutSession | null {
  const trkpts = Array.from(doc.getElementsByTagName('trkpt'));
  if (trkpts.length === 0) return null;

  const trackName =
    doc.getElementsByTagName('trk')[0]?.getElementsByTagName('name')[0]?.textContent?.trim() ||
    fallbackName.replace(/\.gpx$/i, '');
  const trackType =
    doc.getElementsByTagName('trk')[0]?.getElementsByTagName('type')[0]?.textContent?.trim() ||
    'Workout';

  let totalKm = 0;
  let prevLat: number | null = null;
  let prevLng: number | null = null;
  let firstTimeMs: number | null = null;
  let lastTimeMs: number | null = null;
  let hrSum = 0;
  let hrCount = 0;
  let maxHr = 0;

  for (const pt of trkpts) {
    const lat = Number(pt.getAttribute('lat'));
    const lng = Number(pt.getAttribute('lon'));
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      if (prevLat !== null && prevLng !== null) {
        totalKm += calculateHaversineKm({ lat: prevLat, lng: prevLng }, { lat, lng });
      }
      prevLat = lat;
      prevLng = lng;
    }

    const timeText = pt.getElementsByTagName('time')[0]?.textContent?.trim();
    if (timeText) {
      const ms = Date.parse(timeText);
      if (Number.isFinite(ms)) {
        if (firstTimeMs === null || ms < firstTimeMs) firstTimeMs = ms;
        if (lastTimeMs === null || ms > lastTimeMs) lastTimeMs = ms;
      }
    }

    // Read HR from gpxtpx:hr / ns3:hr / hr extension tags
    const allChildren = Array.from(pt.getElementsByTagName('*'));
    for (const child of allChildren) {
      const localName = (child.localName || child.tagName || '').toLowerCase();
      if (localName === 'hr' || localName === 'heartrate') {
        const val = Number(child.textContent || 0);
        if (val >= 45 && val <= 230) {
          hrSum += val;
          hrCount += 1;
          if (val > maxHr) maxHr = val;
        }
      }
    }
  }

  const durationMin =
    firstTimeMs !== null && lastTimeMs !== null && lastTimeMs > firstTimeMs
      ? Math.max(1, Math.round((lastTimeMs - firstTimeMs) / 60000))
      : 45;
  const avgHeartRate = hrCount > 0 ? Math.round(hrSum / hrCount) : 146;
  const finalMaxHr = Math.max(avgHeartRate, Math.round(maxHr || avgHeartRate + 16));
  const caloriesBurned = estimateCaloriesFromHr(durationMin, avgHeartRate);

  return {
    title: trackName,
    source: 'GPX Export',
    sportType: trackType,
    dateIso: firstTimeMs ? new Date(firstTimeMs).toISOString() : new Date().toISOString(),
    durationMin,
    avgHeartRate,
    maxHeartRate: finalMaxHr,
    caloriesBurned,
    distanceKm: Number(Math.max(0.2, totalKm).toFixed(2)),
  };
}

function parseAppleHealthXml(doc: Document, fallbackName: string): ParsedWorkoutSession | null {
  const workouts = Array.from(doc.getElementsByTagName('Workout'));
  if (workouts.length === 0) return null;

  // Prefer the most recent Badminton workout; otherwise pick the latest Workout entry
  const sorted = [...workouts].sort((a, b) => {
    const tA = Date.parse(a.getAttribute('startDate') || '') || 0;
    const tB = Date.parse(b.getAttribute('startDate') || '') || 0;
    return tB - tA;
  });

  const chosen =
    sorted.find((w) =>
      (w.getAttribute('workoutActivityType') || '').toLowerCase().includes('badminton')
    ) || sorted[0];

  const rawType = (chosen.getAttribute('workoutActivityType') || 'Workout').replace(
    /^HKWorkoutActivityType/,
    ''
  );
  const sourceName = chosen.getAttribute('sourceName') || 'Apple Watch';
  const startDate = chosen.getAttribute('startDate') || new Date().toISOString();
  const durationVal = Number(chosen.getAttribute('duration') || 45);
  const durationUnit = (chosen.getAttribute('durationUnit') || 'min').toLowerCase();
  const durationMin = Math.max(
    1,
    Math.round(durationUnit.startsWith('sec') ? durationVal / 60 : durationVal)
  );

  let calories = Number(chosen.getAttribute('totalEnergyBurned') || 0);
  let dist = Number(chosen.getAttribute('totalDistance') || 0);
  const distUnit = (chosen.getAttribute('totalDistanceUnit') || 'km').toLowerCase();
  if (distUnit === 'mi' || distUnit === 'mile') {
    dist = dist * 1.60934;
  } else if (distUnit === 'm') {
    dist = dist / 1000;
  }

  let avgHr = 0;
  let maxHr = 0;
  const statsNodes = Array.from(chosen.getElementsByTagName('WorkoutStatistics'));
  for (const stat of statsNodes) {
    const type = stat.getAttribute('type') || '';
    if (type.includes('HeartRate')) {
      avgHr = Number(stat.getAttribute('average') || avgHr);
      maxHr = Number(stat.getAttribute('maximum') || maxHr);
    } else if (type.includes('ActiveEnergyBurned') && calories <= 0) {
      calories = Number(stat.getAttribute('sum') || 0);
    } else if (type.includes('Distance') && dist <= 0) {
      const sum = Number(stat.getAttribute('sum') || 0);
      const unit = (stat.getAttribute('unit') || 'km').toLowerCase();
      dist = unit === 'm' ? sum / 1000 : unit === 'mi' ? sum * 1.60934 : sum;
    }
  }

  const finalAvgHr = avgHr >= 45 && avgHr <= 230 ? Math.round(avgHr) : 152;
  const finalMaxHr = Math.max(finalAvgHr, Math.round(maxHr || finalAvgHr + 18));
  const finalCalories =
    calories > 0 ? Math.round(calories) : estimateCaloriesFromHr(durationMin, finalAvgHr);

  return {
    title: `${rawType} · ${sourceName || fallbackName}`,
    source: sourceName,
    sportType: rawType,
    dateIso: startDate,
    durationMin,
    avgHeartRate: finalAvgHr,
    maxHeartRate: finalMaxHr,
    caloriesBurned: finalCalories,
    distanceKm: Number(Math.max(0.2, dist || durationMin * 0.065).toFixed(2)),
  };
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

function parseStravaCsv(csvText: string, fallbackName: string): ParsedWorkoutSession | null {
  const lines = csvText
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return null;

  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const findCol = (...candidates: string[]) =>
    headers.findIndex((h) => candidates.some((c) => h === c || h.includes(c)));

  const nameIdx = findCol('activity name', 'name', 'title');
  const typeIdx = findCol('activity type', 'sport type', 'sport', 'type');
  const dateIdx = findCol('activity date', 'date', 'start date');
  const movingIdx = findCol('moving time', 'elapsed time', 'duration');
  const distIdx = findCol('distance');
  const avgHrIdx = findCol('average heart rate', 'avg heart rate', 'avg hr');
  const maxHrIdx = findCol('max heart rate', 'max hr');
  const calIdx = findCol('calories', 'energy');

  const rows = lines.slice(1).map((line) => splitCsvLine(line));
  if (rows.length === 0) return null;

  // Prefer the most recent Badminton / Racket activity; otherwise pick latest row
  const reversed = [...rows].reverse();
  const chosen =
    reversed.find((r) => {
      const sport = `${r[typeIdx] || ''} ${r[nameIdx] || ''}`.toLowerCase();
      return sport.includes('badminton') || sport.includes('racket') || sport.includes('แบด');
    }) || reversed[0];

  const activityName = (nameIdx >= 0 ? chosen[nameIdx] : '') || fallbackName.replace(/\.csv$/i, '');
  const sportType = (typeIdx >= 0 ? chosen[typeIdx] : '') || 'Badminton';
  const dateRaw = (dateIdx >= 0 ? chosen[dateIdx] : '') || new Date().toISOString();
  const rawMoving = Number((movingIdx >= 0 ? chosen[movingIdx] : '0').replace(/,/g, '')) || 2700;
  // Strava CSV exports moving/elapsed time in seconds
  const durationMin = Math.max(1, Math.round(rawMoving > 300 ? rawMoving / 60 : rawMoving));

  const rawAvgHr = Number((avgHrIdx >= 0 ? chosen[avgHrIdx] : '0').replace(/,/g, '')) || 0;
  const avgHeartRate = rawAvgHr >= 45 && rawAvgHr <= 230 ? Math.round(rawAvgHr) : 148;
  const rawMaxHr = Number((maxHrIdx >= 0 ? chosen[maxHrIdx] : '0').replace(/,/g, '')) || 0;
  const maxHeartRate =
    rawMaxHr >= avgHeartRate && rawMaxHr <= 235
      ? Math.round(rawMaxHr)
      : Math.min(210, avgHeartRate + 18);

  const rawCal = Number((calIdx >= 0 ? chosen[calIdx] : '0').replace(/,/g, '')) || 0;
  const caloriesBurned =
    rawCal >= 10 ? Math.round(rawCal) : estimateCaloriesFromHr(durationMin, avgHeartRate);

  let rawDist = Number((distIdx >= 0 ? chosen[distIdx] : '0').replace(/,/g, '')) || 0;
  if (rawDist > 60) rawDist = rawDist / 1000;
  const distanceKm = Number(Math.max(0.2, rawDist || durationMin * 0.065).toFixed(2));

  return {
    title: activityName,
    source: 'Strava CSV Export',
    sportType,
    dateIso: dateRaw,
    durationMin,
    avgHeartRate,
    maxHeartRate,
    caloriesBurned,
    distanceKm,
  };
}

export function parseWorkoutFileContent(
  fileText: string,
  fileName: string
): ParsedWorkoutSession {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.csv')) {
    const parsedCsv = parseStravaCsv(fileText, fileName);
    if (parsedCsv) return parsedCsv;
    throw new Error('INVALID_CSV');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(fileText, 'application/xml');
  const parseError = doc.getElementsByTagName('parsererror')[0];
  if (parseError) {
    throw new Error('INVALID_XML');
  }

  if (lower.endsWith('.tcx') || doc.getElementsByTagName('TrainingCenterDatabase').length > 0) {
    const parsed = parseTcxDocument(doc, fileName);
    if (parsed) return parsed;
  }

  if (lower.endsWith('.gpx') || doc.getElementsByTagName('gpx').length > 0) {
    const parsed = parseGpxDocument(doc, fileName);
    if (parsed) return parsed;
  }

  if (doc.getElementsByTagName('HealthData').length > 0 || doc.getElementsByTagName('Workout').length > 0) {
    const parsed = parseAppleHealthXml(doc, fileName);
    if (parsed) return parsed;
  }

  throw new Error('UNSUPPORTED_WORKOUT_FORMAT');
}
