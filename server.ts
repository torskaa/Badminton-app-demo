import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Request, type Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction =
  process.env.NODE_ENV === 'production' || process.env.npm_lifecycle_event === 'start';
const PORT = Number(process.env.PORT || 3000);

interface StravaAthleteSummary {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  profile: string;
  city: string;
  country: string;
}

interface StravaSessionRecord {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix seconds
  athlete: StravaAthleteSummary;
}

const STRAVA_SESSION_COOKIE = 'smashai_strava_sid';
const stravaSessions = new Map<string, StravaSessionRecord>();
const stravaOAuthStates = new Map<string, number>();

function getStravaCredentials() {
  const clientId = (process.env.STRAVA_CLIENT_ID || '').trim();
  const clientSecret = (process.env.STRAVA_CLIENT_SECRET || '').trim();
  return {
    clientId,
    clientSecret,
    configured: Boolean(clientId && clientSecret),
  };
}

function getBaseAppUrl(req: Request): string {
  const envUrl = (process.env.APP_URL || '').trim().replace(/\/+$/, '');
  if (envUrl && envUrl !== 'MY_APP_URL') {
    return envUrl;
  }
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
  return `${proto}://${host}`.replace(/\/+$/, '');
}

function getStravaRedirectUri(req: Request): string {
  return `${getBaseAppUrl(req)}/auth/strava/callback`;
}

function getCallbackDomain(urlStr: string): string {
  try {
    return new URL(urlStr).hostname;
  } catch {
    return '';
  }
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const eqIdx = part.indexOf('=');
    if (eqIdx <= 0) continue;
    const key = part.slice(0, eqIdx).trim();
    const val = part.slice(eqIdx + 1).trim();
    if (key) {
      try {
        result[key] = decodeURIComponent(val);
      } catch {
        result[key] = val;
      }
    }
  }
  return result;
}

function getStravaSessionId(req: Request): string | null {
  const cookies = parseCookies(req.headers.cookie);
  if (cookies[STRAVA_SESSION_COOKIE]) {
    return cookies[STRAVA_SESSION_COOKIE];
  }
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }
  return null;
}

function serializeForInlineScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

function renderOAuthPopupHtml(payload: Record<string, unknown>, statusText: string): string {
  const serialized = serializeForInlineScript(payload);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SmashAI × Strava</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f8faf6; color: #142608; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; text-align: center; }
      .card { background: #ffffff; border: 1px solid #d4dfd0; border-radius: 24px; padding: 24px 28px; max-width: 340px; }
      h1 { font-size: 18px; color: #004d2c; margin: 0 0 8px; }
      p { font-size: 13px; color: #5c6f5e; margin: 0; line-height: 1.5; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>SmashAI × Strava</h1>
      <p>${statusText}</p>
    </div>
    <script>
      (function () {
        var msg = ${serialized};
        if (window.opener) {
          window.opener.postMessage(msg, '*');
          setTimeout(function () { window.close(); }, 120);
        } else {
          window.location.href = '/';
        }
      })();
    </script>
  </body>
</html>`;
}

async function getValidStravaAccessToken(sessionId: string): Promise<string | null> {
  const session = stravaSessions.get(sessionId);
  if (!session) return null;

  const nowSec = Math.floor(Date.now() / 1000);
  if (session.expiresAt > nowSec + 60) {
    return session.accessToken;
  }

  const { clientId, clientSecret, configured } = getStravaCredentials();
  if (!configured) return null;

  const refreshResp = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: session.refreshToken,
    }),
  });

  if (!refreshResp.ok) {
    stravaSessions.delete(sessionId);
    return null;
  }

  const refreshed = (await refreshResp.json()) as {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };

  session.accessToken = refreshed.access_token;
  session.refreshToken = refreshed.refresh_token || session.refreshToken;
  session.expiresAt = refreshed.expires_at;
  stravaSessions.set(sessionId, session);
  return session.accessToken;
}

function estimateActivityCalories(activity: Record<string, any>): number {
  if (typeof activity.calories === 'number' && activity.calories > 0) {
    return Math.round(activity.calories);
  }
  if (typeof activity.kilojoules === 'number' && activity.kilojoules > 0) {
    return Math.round(activity.kilojoules * 1.05);
  }
  const movingMin = Math.max(1, Math.round(Number(activity.moving_time || 0) / 60));
  const avgHr = Number(activity.average_heartrate || 145);
  const rate = avgHr >= 155 ? 10.5 : avgHr >= 135 ? 8.5 : 6.8;
  return Math.round(movingMin * rate);
}

function mapStravaActivity(raw: Record<string, any>) {
  const movingSeconds = Number(raw.moving_time || raw.elapsed_time || 0);
  const durationMin = Math.max(1, Math.round(movingSeconds / 60));
  const distanceKm = Number((Number(raw.distance || 0) / 1000).toFixed(2));
  const avgHeartRate = raw.average_heartrate ? Math.round(Number(raw.average_heartrate)) : null;
  const maxHeartRate = raw.max_heartrate ? Math.round(Number(raw.max_heartrate)) : null;
  const deviceName = typeof raw.device_name === 'string' ? raw.device_name : '';

  return {
    id: String(raw.id),
    name: String(raw.name || 'Strava Workout'),
    sportType: String(raw.sport_type || raw.type || 'Workout'),
    startDate: String(raw.start_date_local || raw.start_date || new Date().toISOString()),
    durationMin,
    distanceKm,
    avgHeartRate,
    maxHeartRate,
    caloriesBurned: estimateActivityCalories(raw),
    hasExactCalories: typeof raw.calories === 'number' && raw.calories > 0,
    deviceName,
    isAppleWatch: deviceName.toLowerCase().includes('apple watch'),
  };
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '10mb' }));

  // Health & Readiness check
  app.get('/api/health', (_req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const strava = getStravaCredentials();
    res.json({
      status: 'ok',
      geminiConfigured: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
      stravaConfigured: strava.configured,
      timestamp: new Date().toISOString(),
    });
  });

  // ==========================================================
  // STRAVA OAUTH 2.0 & API V3 PROXY ROUTES (Iframe-Safe Popup)
  // ==========================================================
  app.get('/api/strava/status', (req, res) => {
    const { configured } = getStravaCredentials();
    const callbackUrl = getStravaRedirectUri(req);
    const callbackDomain = getCallbackDomain(callbackUrl);
    const sid = getStravaSessionId(req);
    const session = sid ? stravaSessions.get(sid) : undefined;

    res.json({
      configured,
      connected: Boolean(session),
      callbackUrl,
      callbackDomain,
      athlete: session ? session.athlete : null,
    });
  });

  app.get('/api/strava/auth-url', (req, res) => {
    const { clientId, configured } = getStravaCredentials();
    const redirectUri = getStravaRedirectUri(req);
    const callbackDomain = getCallbackDomain(redirectUri);

    if (!configured) {
      return res.status(503).json({
        error: 'STRAVA_NOT_CONFIGURED',
        callbackUrl: redirectUri,
        callbackDomain,
      });
    }

    // Prune stale states older than 10 minutes
    const now = Date.now();
    for (const [key, createdAt] of stravaOAuthStates.entries()) {
      if (now - createdAt > 10 * 60 * 1000) {
        stravaOAuthStates.delete(key);
      }
    }

    const state = crypto.randomBytes(16).toString('hex');
    stravaOAuthStates.set(state, now);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      approval_prompt: 'auto',
      scope: 'read,activity:read_all',
      state,
    });

    const authUrl = `https://www.strava.com/oauth/authorize?${params.toString()}`;
    return res.json({ url: authUrl, redirectUri, callbackDomain });
  });

  const handleStravaCallback = async (req: Request, res: Response) => {
    const errorParam = typeof req.query.error === 'string' ? req.query.error : '';
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const state = typeof req.query.state === 'string' ? req.query.state : '';

    if (errorParam) {
      return res
        .status(200)
        .set('Content-Type', 'text/html; charset=utf-8')
        .send(
          renderOAuthPopupHtml(
            { type: 'STRAVA_OAUTH_ERROR', error: errorParam },
            'Strava authorization was cancelled. Closing window...'
          )
        );
    }

    if (!code || !state || !stravaOAuthStates.has(state)) {
      return res
        .status(400)
        .set('Content-Type', 'text/html; charset=utf-8')
        .send(
          renderOAuthPopupHtml(
            { type: 'STRAVA_OAUTH_ERROR', error: 'invalid_state' },
            'Invalid or expired authorization session. Please try again.'
          )
        );
    }
    stravaOAuthStates.delete(state);

    const { clientId, clientSecret, configured } = getStravaCredentials();
    if (!configured) {
      return res
        .status(503)
        .set('Content-Type', 'text/html; charset=utf-8')
        .send(
          renderOAuthPopupHtml(
            { type: 'STRAVA_OAUTH_ERROR', error: 'server_not_configured' },
            'Strava credentials are not configured on the server.'
          )
        );
    }

    try {
      const tokenResp = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResp.ok) {
        const errBody = await tokenResp.text();
        console.error('Strava token exchange failed:', tokenResp.status, errBody);
        return res
          .status(502)
          .set('Content-Type', 'text/html; charset=utf-8')
          .send(
            renderOAuthPopupHtml(
              { type: 'STRAVA_OAUTH_ERROR', error: 'token_exchange_failed' },
              'Could not complete Strava sign-in. Please close this window and retry.'
            )
          );
      }

      const tokenData = (await tokenResp.json()) as {
        access_token: string;
        refresh_token: string;
        expires_at: number;
        athlete?: Record<string, any>;
      };

      const athlete: StravaAthleteSummary = {
        id: Number(tokenData.athlete?.id || 0),
        firstName: String(tokenData.athlete?.firstname || 'Strava'),
        lastName: String(tokenData.athlete?.lastname || 'Athlete'),
        username: String(tokenData.athlete?.username || ''),
        profile: String(tokenData.athlete?.profile || tokenData.athlete?.profile_medium || ''),
        city: String(tokenData.athlete?.city || ''),
        country: String(tokenData.athlete?.country || ''),
      };

      const sessionId = crypto.randomBytes(32).toString('hex');
      stravaSessions.set(sessionId, {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_at,
        athlete,
      });

      res.cookie(STRAVA_SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return res
        .status(200)
        .set('Content-Type', 'text/html; charset=utf-8')
        .send(
          renderOAuthPopupHtml(
            { type: 'STRAVA_OAUTH_SUCCESS', sessionToken: sessionId, athlete },
            'Connected to Strava! Returning to SmashAI...'
          )
        );
    } catch (err) {
      console.error('Strava callback error:', err);
      return res
        .status(500)
        .set('Content-Type', 'text/html; charset=utf-8')
        .send(
          renderOAuthPopupHtml(
            { type: 'STRAVA_OAUTH_ERROR', error: 'unexpected_error' },
            'Unexpected error during Strava sign-in.'
          )
        );
    }
  };

  app.get(['/auth/strava/callback', '/auth/strava/callback/'], handleStravaCallback);

  app.get('/api/strava/activities', async (req, res) => {
    const sid = getStravaSessionId(req);
    if (!sid) {
      return res.status(401).json({ error: 'STRAVA_NOT_CONNECTED' });
    }

    try {
      const accessToken = await getValidStravaAccessToken(sid);
      if (!accessToken) {
        return res.status(401).json({ error: 'STRAVA_SESSION_EXPIRED' });
      }

      const stravaResp = await fetch(
        'https://www.strava.com/api/v3/athlete/activities?per_page=15',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!stravaResp.ok) {
        if (stravaResp.status === 401) {
          stravaSessions.delete(sid);
          return res.status(401).json({ error: 'STRAVA_TOKEN_REVOKED' });
        }
        return res.status(502).json({ error: 'STRAVA_API_ERROR' });
      }

      const rawList = (await stravaResp.json()) as Record<string, any>[];
      const activities = Array.isArray(rawList) ? rawList.map(mapStravaActivity) : [];
      const session = stravaSessions.get(sid);

      return res.json({
        athlete: session?.athlete || null,
        activities,
      });
    } catch (err) {
      console.error('Strava activities fetch failed:', err);
      return res.status(502).json({ error: 'STRAVA_FETCH_FAILED' });
    }
  });

  app.get('/api/strava/activities/:activityId', async (req, res) => {
    const sid = getStravaSessionId(req);
    const activityId = String(req.params.activityId || '').replace(/[^0-9]/g, '');
    if (!sid) {
      return res.status(401).json({ error: 'STRAVA_NOT_CONNECTED' });
    }
    if (!activityId) {
      return res.status(400).json({ error: 'INVALID_ACTIVITY_ID' });
    }

    try {
      const accessToken = await getValidStravaAccessToken(sid);
      if (!accessToken) {
        return res.status(401).json({ error: 'STRAVA_SESSION_EXPIRED' });
      }

      const detailResp = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!detailResp.ok) {
        return res.status(502).json({ error: 'STRAVA_ACTIVITY_DETAIL_FAILED' });
      }

      const rawDetail = (await detailResp.json()) as Record<string, any>;
      return res.json({ activity: mapStravaActivity(rawDetail) });
    } catch (err) {
      console.error('Strava activity detail error:', err);
      return res.status(502).json({ error: 'STRAVA_FETCH_FAILED' });
    }
  });

  app.post('/api/strava/disconnect', async (req, res) => {
    const sid = getStravaSessionId(req);
    if (sid) {
      const session = stravaSessions.get(sid);
      stravaSessions.delete(sid);
      if (session?.accessToken) {
        fetch('https://www.strava.com/oauth/deauthorize', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }).catch(() => {
          // Best-effort remote revoke
        });
      }
    }

    res.clearCookie(STRAVA_SESSION_COOKIE, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    return res.json({ disconnected: true });
  });

  // ==========================================================
  // FREE WEARABLE SYNC: APPLE SHORTCUTS WEBHOOK & AI SCREENSHOT SCANNER
  // ==========================================================
  interface ShortcutsWorkoutItem {
    id: string;
    name: string;
    sportType: string;
    source: string;
    startDate: string;
    durationMin: number;
    distanceKm: number;
    avgHeartRate: number;
    maxHeartRate: number;
    caloriesBurned: number;
    receivedAt: string;
  }

  const SHORTCUTS_INBOX_FILE = '/tmp/smashai-shortcuts-inbox.json';
  const shortcutsInbox = new Map<string, ShortcutsWorkoutItem[]>();

  try {
    if (fs.existsSync(SHORTCUTS_INBOX_FILE)) {
      const saved = JSON.parse(fs.readFileSync(SHORTCUTS_INBOX_FILE, 'utf-8')) as Record<
        string,
        ShortcutsWorkoutItem[]
      >;
      if (saved && typeof saved === 'object') {
        for (const [k, list] of Object.entries(saved)) {
          if (Array.isArray(list)) {
            shortcutsInbox.set(k, list.slice(0, 20));
          }
        }
      }
    }
  } catch {
    // Ignore corrupt temp file
  }

  const persistShortcutsInbox = () => {
    try {
      const obj: Record<string, ShortcutsWorkoutItem[]> = {};
      for (const [k, list] of shortcutsInbox.entries()) {
        obj[k] = list.slice(0, 20);
      }
      fs.writeFileSync(SHORTCUTS_INBOX_FILE, JSON.stringify(obj), 'utf-8');
    } catch {
      // Best-effort local persistence
    }
  };

  const extractNumericValue = (val: unknown): number => {
    if (typeof val === 'number' && Number.isFinite(val)) return val;
    if (typeof val !== 'string') return 0;
    const trimmed = val.trim();
    // Handle HH:MM:SS or MM:SS duration strings
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(trimmed)) {
      const parts = trimmed.split(':').map(Number);
      if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
      if (parts.length === 2) return parts[0] + parts[1] / 60;
    }
    const match = trimmed.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? Number(match[0]) : 0;
  };

  const resolveSyncKey = (req: Request): string => {
    const raw =
      (typeof req.query.key === 'string' ? req.query.key : '') ||
      (typeof req.headers['x-smashai-key'] === 'string' ? req.headers['x-smashai-key'] : '') ||
      (typeof req.body?.syncKey === 'string' ? req.body.syncKey : '') ||
      (typeof req.body?.key === 'string' ? req.body.key : '');
    return raw.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  };

  app.get('/api/wearable/shortcuts-inbox', (req, res) => {
    const syncKey = resolveSyncKey(req);
    if (!syncKey || syncKey.length < 8) {
      return res.status(400).json({ error: 'INVALID_SYNC_KEY' });
    }
    const webhookUrl = `${getBaseAppUrl(req)}/api/wearable/shortcuts-webhook?key=${encodeURIComponent(syncKey)}`;
    const workouts = shortcutsInbox.get(syncKey) || [];
    return res.json({
      syncKey,
      webhookUrl,
      workouts,
    });
  });

  app.post('/api/wearable/shortcuts-webhook', (req, res) => {
    const syncKey = resolveSyncKey(req);
    if (!syncKey || syncKey.length < 8) {
      return res.status(400).json({
        error: 'MISSING_SYNC_KEY',
        message: 'Include ?key=YOUR_SYNC_KEY in the webhook URL or X-SmashAI-Key header.',
      });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const rawDuration =
      extractNumericValue(
        body.durationMin ?? body.duration ?? body.minutes ?? body.elapsedTime ?? body.time
      ) || 45;
    // If Apple Shortcuts sent raw seconds (> 360), convert to minutes
    const durationMin = Math.max(
      1,
      Math.min(480, Math.round(rawDuration > 360 ? rawDuration / 60 : rawDuration))
    );

    const rawAvgHr = extractNumericValue(
      body.avgHeartRate ?? body.heartRate ?? body.heartRateBpm ?? body.bpm ?? body.hr
    );
    const avgHeartRate =
      rawAvgHr >= 45 && rawAvgHr <= 230 ? Math.round(rawAvgHr) : 148;

    const rawMaxHr = extractNumericValue(body.maxHeartRate ?? body.peakHeartRate ?? body.maxBpm);
    const maxHeartRate =
      rawMaxHr >= avgHeartRate && rawMaxHr <= 235
        ? Math.round(rawMaxHr)
        : Math.min(210, avgHeartRate + 18);

    const rawCalories = extractNumericValue(
      body.calories ?? body.caloriesBurned ?? body.activeEnergy ?? body.kcal ?? body.energy
    );
    const caloriesBurned =
      rawCalories >= 10 && rawCalories <= 5000
        ? Math.round(rawCalories)
        : estimateActivityCalories({
            moving_time: durationMin * 60,
            average_heartrate: avgHeartRate,
          });

    let rawDist = extractNumericValue(body.distanceKm ?? body.distance ?? body.km);
    if (rawDist > 60) {
      // Likely meters instead of km
      rawDist = rawDist / 1000;
    }
    const distanceKm = Number(
      Math.max(0.2, Math.min(50, rawDist > 0 ? rawDist : durationMin * 0.065)).toFixed(2)
    );

    const sportType = String(body.sportType || body.workoutType || body.type || 'Badminton').trim();
    const workoutName = String(
      body.workoutName || body.name || body.title || `${sportType} · Apple Watch`
    ).trim();
    const source = String(body.source || body.device || 'Apple Watch · Shortcuts').trim();
    const startDate = String(body.startDate || body.date || new Date().toISOString()).trim();

    const item: ShortcutsWorkoutItem = {
      id: `sc_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      name: workoutName.slice(0, 80),
      sportType: sportType.slice(0, 40),
      source: source.slice(0, 60),
      startDate,
      durationMin,
      distanceKm,
      avgHeartRate,
      maxHeartRate,
      caloriesBurned,
      receivedAt: new Date().toISOString(),
    };

    const existing = shortcutsInbox.get(syncKey) || [];
    shortcutsInbox.set(syncKey, [item, ...existing].slice(0, 20));
    persistShortcutsInbox();

    return res.status(201).json({
      ok: true,
      workout: item,
    });
  });

  app.post('/api/wearable/scan-screenshot', async (req, res) => {
    const { imageBase64, imageMimeType, language } = req.body || {};
    const isThai = language !== 'en';
    const ai = getGeminiClient();

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({
        error: isThai ? 'กรุณาเลือกภาพหน้าจอสรุปผลการออกกำลังกาย' : 'Please upload a workout summary screenshot.',
      });
    }

    const allowedMimes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);
    const safeMime =
      typeof imageMimeType === 'string' && allowedMimes.has(imageMimeType.toLowerCase())
        ? imageMimeType.toLowerCase()
        : 'image/jpeg';

    if (!ai) {
      return res.status(503).json({
        error: isThai
          ? 'บริการ AI สแกนภาพยังไม่พร้อมใช้งานในขณะนี้ กรุณาตรวจสอบการตั้งค่าเซิร์ฟเวอร์'
          : 'AI screenshot scanner is unavailable right now.',
      });
    }

    try {
      const promptText = isThai
        ? `อ่านข้อมูลสรุปการออกกำลังกายจากภาพหน้าจอนี้ (เช่น Apple Fitness, Apple Watch, Strava, Garmin, Huawei, Samsung Health)
- ตั้ง isWorkoutScreenshot = true หากภาพนี้เป็นหน้าจอสรุปผลการออกกำลังกายหรือค่าสุขภาพจากนาฬิกา/แอปฟิตเนส มิฉะนั้นตั้งเป็น false
- อ่านค่าที่ปรากฏจริงบนหน้าจอให้แม่นยำที่สุด:
  - activityName: ชื่อกีฬาหรือชื่อรอบซ้อม เช่น "Badminton", "แบดมินตันเย็น", "Indoor Run"
  - sourceApp: ชื่อแอปหรืออุปกรณ์ที่เห็น เช่น "Apple Fitness", "Apple Watch", "Strava", "Garmin Connect"
  - caloriesBurned: จำนวนแคลอรี (kcal/CAL) หากมี Active Calories กับ Total Calories ให้ใช้ Active Calories หรือค่าหลักที่โชว์เป็นจำนวนเต็ม (ถ้าไม่มีเลยให้ใส่ 0)
  - avgHeartRate: อัตราการเต้นหัวใจเฉลี่ย (BPM) เป็นจำนวนเต็ม (ถ้าไม่มีให้ใส่ 0)
  - maxHeartRate: อัตราการเต้นหัวใจสูงสุด (BPM) เป็นจำนวนเต็ม (ถ้าไม่มีให้ใส่ 0)
  - distanceKm: ระยะทางเป็นกิโลเมตร (ถ้าในภาพเป็นไมล์ให้แปลงเป็น km, ถ้าไม่มีให้ใส่ 0)
  - durationMin: ระยะเวลาเป็นนาทีจำนวนเต็ม (ถ้าไม่มีให้ใส่ 0)
  - workoutDate: วันที่/เวลาที่เห็นในภาพ (สตริงสั้นๆ)
  - summaryNote: สรุปสั้นๆ ภาษาไทย 1 ประโยคว่าอ่านค่าอะไรได้บ้าง`
        : `Extract workout summary telemetry from this fitness/watch screenshot (Apple Fitness, Apple Watch, Strava, Garmin, Huawei, Samsung Health, etc.).
- Set isWorkoutScreenshot = true ONLY if this image is a real workout/fitness summary screen; otherwise false.
- Read visible metrics accurately:
  - activityName: sport/session title (e.g., "Badminton", "Evening Badminton")
  - sourceApp: detected app or watch (e.g., "Apple Fitness", "Apple Watch", "Strava", "Garmin")
  - caloriesBurned: active or main calories in kcal (integer, 0 if not shown)
  - avgHeartRate: average heart rate in BPM (integer, 0 if not shown)
  - maxHeartRate: peak/max heart rate in BPM (integer, 0 if not shown)
  - distanceKm: distance in kilometers (convert miles to km if needed, 0 if not shown)
  - durationMin: workout duration in whole minutes (0 if not shown)
  - workoutDate: visible date/time string (empty string if not shown)
  - summaryNote: 1 short English sentence summarizing what was extracted.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: {
          parts: [
            { inlineData: { mimeType: safeMime, data: imageBase64 } },
            { text: promptText },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isWorkoutScreenshot: { type: Type.BOOLEAN },
              activityName: { type: Type.STRING },
              sourceApp: { type: Type.STRING },
              caloriesBurned: { type: Type.INTEGER },
              avgHeartRate: { type: Type.INTEGER },
              maxHeartRate: { type: Type.INTEGER },
              distanceKm: { type: Type.NUMBER },
              durationMin: { type: Type.INTEGER },
              workoutDate: { type: Type.STRING },
              summaryNote: { type: Type.STRING },
            },
            required: [
              'isWorkoutScreenshot',
              'activityName',
              'sourceApp',
              'caloriesBurned',
              'avgHeartRate',
              'maxHeartRate',
              'distanceKm',
              'durationMin',
              'workoutDate',
              'summaryNote',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text || '{}').trim()) as {
        isWorkoutScreenshot?: boolean;
        activityName?: string;
        sourceApp?: string;
        caloriesBurned?: number;
        avgHeartRate?: number;
        maxHeartRate?: number;
        distanceKm?: number;
        durationMin?: number;
        workoutDate?: string;
        summaryNote?: string;
      };

      if (!parsed.isWorkoutScreenshot) {
        return res.status(422).json({
          error: isThai
            ? 'ไม่พบข้อมูลสรุปการออกกำลังกายในภาพนี้ กรุณาอัปโหลดภาพแคปหน้าจอจาก Apple Fitness, Apple Watch หรือ Strava'
            : 'No workout summary detected in this image. Please upload an Apple Fitness, Apple Watch, or Strava summary screenshot.',
        });
      }

      const durationMin = Math.max(1, Math.min(480, Math.round(Number(parsed.durationMin || 0) || 45)));
      const rawAvgHr = Math.round(Number(parsed.avgHeartRate || 0));
      const avgHeartRate = rawAvgHr >= 45 && rawAvgHr <= 230 ? rawAvgHr : 148;
      const rawMaxHr = Math.round(Number(parsed.maxHeartRate || 0));
      const maxHeartRate =
        rawMaxHr >= avgHeartRate && rawMaxHr <= 235
          ? rawMaxHr
          : Math.min(210, avgHeartRate + 18);

      const rawCalories = Math.round(Number(parsed.caloriesBurned || 0));
      const caloriesBurned =
        rawCalories >= 10 && rawCalories <= 5000
          ? rawCalories
          : estimateActivityCalories({
              moving_time: durationMin * 60,
              average_heartrate: avgHeartRate,
            });

      const rawDistance = Number(parsed.distanceKm || 0);
      const distanceKm = Number(
        Math.max(0.2, Math.min(50, rawDistance > 0 ? rawDistance : durationMin * 0.065)).toFixed(2)
      );

      const sourceApp = String(parsed.sourceApp || 'Watch Screenshot').trim();
      const activityName = String(parsed.activityName || 'Badminton Workout').trim();

      return res.json({
        workout: {
          id: `scan_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
          activityName,
          sourceApp,
          caloriesBurned,
          avgHeartRate,
          maxHeartRate,
          distanceKm,
          durationMin,
          workoutDate: String(parsed.workoutDate || '').trim(),
          summaryNote: String(parsed.summaryNote || '').trim(),
          caloriesEstimated: rawCalories < 10,
          heartRateEstimated: rawAvgHr < 45,
        },
      });
    } catch (err) {
      console.error('Gemini wearable screenshot scan error:', err);
      return res.status(502).json({
        error: isThai
          ? 'ไม่สามารถอ่านภาพสรุปผลได้ในขณะนี้ กรุณาลองอัปโหลดภาพที่ชัดเจนอีกครั้ง'
          : 'Unable to analyze screenshot right now. Please try again with a clearer image.',
      });
    }
  });

  // Server-Side Gemini Coach Endpoint
  app.post('/api/ai/coach', async (req, res) => {
    const { player, question, language } = req.body || {};
    const isThai = language !== 'en';
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        source: 'offline-coach',
        headline: isThai
          ? 'โฟกัสคุมหน้าเน็ตและปิดมุมหลังแบ็คแฮนด์'
          : 'Focus on Net Control & Backhand Deep Corner',
        summary: isThai
          ? 'ค่าพลังตบ (Power) ของคุณโดดเด่นแล้ว หากเพิ่มความแม่นหน้าเน็ตและจังหวะคืนตัวหลังตีจะช่วยลดการเสียแต้มง่ายได้ทันที'
          : 'Your smash power is already strong. Sharpening net drops and split-step recovery will cut unforced errors.',
        tips: isThai
          ? [
              'ฝึกหยอดหน้าเน็ตสลับซ้าย-ขวา 3 เซต เซตละ 20 ลูกก่อนลงทีม',
              'หลังกระโดดตบ ให้รีเซ็ตเท้ากลับมาคุมกลางคอร์ทภายใน 0.5 วินาที',
              'ใช้ลูกเซฟลึกกดดันมุมหลังแบ็คแฮนด์คู่แข่งก่อนหาจังหวะบุก',
            ]
          : [
              'Run 3x20 alternating forehand/backhand net drops before games.',
              'Recover with a crisp split-step within 0.5s after jump smashes.',
              'Pin opponents to deep backhand corner before attacking loose lifts.',
            ],
      });
    }

    try {
      const radar = player?.skillRadar || { power: 88, speed: 82, control: 76, stamina: 84, tactics: 90 };
      const prompt = isThai
        ? `คุณคือโค้ชแบดมินตันมืออาชีพ วิเคราะห์นักกีฬาคนนี้:
ชื่อ: ${player?.name || 'ผู้เล่น'}
สไตล์การเล่น: ${player?.playstyleTh || player?.playstyle || 'สายบุกตบสแมช'}
ระดับ: ${player?.tier || 'Diamond'} เลเวล ${player?.level || 12}
ค่าพลัง 5 ด้าน (เต็ม 100): Power=${radar.power}, Speed=${radar.speed}, Control=${radar.control}, Stamina=${radar.stamina}, Tactics=${radar.tactics}
คำถาม/เป้าหมายเพิ่มเติม: ${question || 'ขอคำแนะนำพัฒนาการเล่นเพื่อชนะแมตช์หน้า'}
ตอบเป็นภาษาไทยที่กระชับ ชัดเจน ปฏิบัติตามได้จริงบนคอร์ท`
        : `You are an elite badminton coach. Analyze this player:
Name: ${player?.nameEn || player?.name || 'Player'}
Playstyle: ${player?.playstyle || 'Attacking Smash Hunter'}
Tier: ${player?.tier || 'Diamond'}, Level ${player?.level || 12}
5-Axis Skills (0-100): Power=${radar.power}, Speed=${radar.speed}, Control=${radar.control}, Stamina=${radar.stamina}, Tactics=${radar.tactics}
Player question/goal: ${question || 'Give practical tips to win the next match.'}
Reply concisely in English with actionable on-court steps.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['headline', 'summary', 'tips'],
          },
        },
      });

      const parsed = JSON.parse((response.text || '{}').trim());
      return res.json({ source: 'gemini', ...parsed });
    } catch (err) {
      console.error('Gemini Coach API error:', err);
      return res.status(502).json({
        error: isThai ? 'ไม่สามารถเชื่อมต่อโค้ช AI ได้ชั่วคราว' : 'Unable to reach AI Coach right now',
      });
    }
  });

  // Server-Side Gemini Biomechanics / Shot Analysis Endpoint
  app.post('/api/ai/analyze-shot', async (req, res) => {
    const { metrics, imageBase64, imageMimeType, clipName, language } = req.body || {};
    const isThai = language !== 'en';
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        source: 'offline-cv',
        score: 89,
        racketSpeedKmh: metrics?.racketSpeedKmh || 344,
        contactHeightM: metrics?.contactHeightM || 2.86,
        trunkRotationDeg: metrics?.trunkRotationDeg || 46.8,
        impactTimingMs: metrics?.impactTimingMs || 13,
        coachingAdvice: isThai
          ? [
              'จุดกระทบลูกสูง 2.86 เมตร กดวิถีลูกชันและรับยากมาก',
              'หมุนลำตัวสมดุล 46.8° เพิ่มความเร็วสะบัดข้อมือปลายจังหวะอีกเล็กน้อย',
              'หลังลงพื้นควรรีบสปริทสเต็ปทันทีเพื่อดักลูกหยอดสวนกลับ',
            ]
          : [
              '2.86m contact point creates a steep downward smash trajectory.',
              '46.8° trunk rotation is well-balanced; snap wrist slightly earlier at impact.',
              'Recover immediately into split-step to cover counter drops.',
            ],
      });
    }

    try {
      const promptText = isThai
        ? `วิเคราะห์ท่าตี/จังหวะตบแบดมินตันจากข้อมูลนี้ (ชื่อคลิป: ${clipName || 'Jump Smash'}):
ความเร็วหัวไม้เดิม ${metrics?.racketSpeedKmh || 342} กม./ชม., จุดกระทบ ${metrics?.contactHeightM || 2.85} ม., หมุนลำตัว ${metrics?.trunkRotationDeg || 46.2} องศา
ประเมินคะแนน 70-98, ตัวเลข biomechanics ที่สมจริง และคำแนะนำสั้นกระชับ 3 ข้อเป็นภาษาไทย`
        : `Analyze this badminton smash/stroke clip (${clipName || 'Jump Smash'}):
Baseline metrics: ${metrics?.racketSpeedKmh || 342} km/h, contact height ${metrics?.contactHeightM || 2.85}m, trunk rotation ${metrics?.trunkRotationDeg || 46.2} deg.
Return a realistic score (70-98), biomechanics metrics, and 3 actionable coaching tips in English.`;

      const contents =
        imageBase64 && imageMimeType
          ? {
              parts: [
                { inlineData: { mimeType: String(imageMimeType), data: String(imageBase64) } },
                { text: promptText },
              ],
            }
          : promptText;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              racketSpeedKmh: { type: Type.INTEGER },
              contactHeightM: { type: Type.NUMBER },
              trunkRotationDeg: { type: Type.NUMBER },
              impactTimingMs: { type: Type.INTEGER },
              coachingAdvice: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'score',
              'racketSpeedKmh',
              'contactHeightM',
              'trunkRotationDeg',
              'impactTimingMs',
              'coachingAdvice',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text || '{}').trim());
      return res.json({ source: 'gemini', ...parsed });
    } catch (err) {
      console.error('Gemini Analyze Shot API error:', err);
      return res.status(502).json({
        error: isThai ? 'วิเคราะห์วิดีโอไม่สำเร็จ กรุณาลองใหม่' : 'Video analysis failed. Please try again.',
      });
    }
  });

  // Server-Side Match Zone Diagnostics Endpoint
  app.post('/api/ai/match-diagnostics', async (req, res) => {
    const { zoneName, errorsCount, matchScore, language } = req.body || {};
    const isThai = language !== 'en';
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        source: 'offline-diagnostics',
        advice: isThai
          ? `โซน "${zoneName || 'หน้าเน็ต'}" มีจุดพลาด ${errorsCount ?? 3} ครั้ง แนะนำให้ย่อเข่าและตั้งหน้าไม้รอระดับอกเพื่อลดการติดเน็ต`
          : `Zone "${zoneName || 'Net'}" logged ${errorsCount ?? 3} errors. Lower center of gravity and keep racket head at chest level.`,
        drillFocus: isThai ? 'ฝึกดักหน้าเน็ตเร็ว 15 นาที' : '15-min Fast Net Intercept Drill',
      });
    }

    try {
      const prompt = isThai
        ? `ในแมตช์แบดมินตันสกอร์ ${matchScore || '21-18'} ผู้เล่นพลาดในโซน "${zoneName}" จำนวน ${errorsCount ?? 2} ครั้ง ขอคำแนะนำสั้นๆ 1 ย่อหน้า และชื่อแบบฝึกแก้ทาง 1 อย่างเป็นภาษาไทย`
        : `In a badminton match (${matchScore || '21-18'}), the player had ${errorsCount ?? 2} errors in "${zoneName}". Give 1 concise tactical tip and 1 targeted drill name in English.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              advice: { type: Type.STRING },
              drillFocus: { type: Type.STRING },
            },
            required: ['advice', 'drillFocus'],
          },
        },
      });

      const parsed = JSON.parse((response.text || '{}').trim());
      return res.json({ source: 'gemini', ...parsed });
    } catch (err) {
      console.error('Gemini Match Diagnostics API error:', err);
      return res.status(502).json({
        error: isThai ? 'วิเคราะห์โซนคอร์ทไม่สำเร็จ' : 'Zone diagnostics failed',
      });
    }
  });

  if (isProduction) {
    const distPath = path.resolve(__dirname, 'dist');
    const distIndex = path.join(distPath, 'index.html');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      if (!fs.existsSync(distIndex)) {
        return res
          .status(503)
          .send('Production build not found. Please run "npm run build" first.');
      }
      return res.sendFile(distIndex);
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        let html = fs.readFileSync(indexPath, 'utf-8');
        html = await vite.transformIndexHtml(req.originalUrl, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        next(e);
      }
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`SmashAI server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start SmashAI server:', err);
  process.exit(1);
});
