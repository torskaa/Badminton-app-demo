import { PlayerProfile } from '../types';

export interface AICoachAdviceResponse {
  source: 'gemini' | 'offline-coach';
  headline: string;
  summary: string;
  tips: string[];
}

export interface AIAnalyzeShotResponse {
  source: 'gemini' | 'offline-cv';
  score: number;
  racketSpeedKmh: number;
  contactHeightM: number;
  trunkRotationDeg: number;
  impactTimingMs: number;
  coachingAdvice: string[];
}

export interface AIMatchDiagnosticsResponse {
  source: 'gemini' | 'offline-diagnostics';
  advice: string;
  drillFocus: string;
}

export async function fetchAICoachInsight(params: {
  player: PlayerProfile;
  question?: string;
  language: 'th' | 'en';
}): Promise<AICoachAdviceResponse> {
  const res = await fetch('/api/ai/coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch AI Coach insight');
  }
  return res.json();
}

export async function fetchAIAnalyzeShot(params: {
  metrics: {
    racketSpeedKmh: number;
    contactHeightM: number;
    trunkRotationDeg: number;
    impactTimingMs: number;
  };
  clipName?: string;
  imageBase64?: string;
  imageMimeType?: string;
  language: 'th' | 'en';
}): Promise<AIAnalyzeShotResponse> {
  const res = await fetch('/api/ai/analyze-shot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze shot');
  }
  return res.json();
}

export async function fetchAIMatchDiagnostics(params: {
  zoneName: string;
  errorsCount: number;
  matchScore: string;
  language: 'th' | 'en';
}): Promise<AIMatchDiagnosticsResponse> {
  const res = await fetch('/api/ai/match-diagnostics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze court zone');
  }
  return res.json();
}
