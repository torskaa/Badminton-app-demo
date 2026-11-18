import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Watch,
  Heart,
  Flame,
  Footprints,
  Zap,
  RefreshCw,
  ArrowRight,
  Swords,
  CheckCircle2,
  Plus,
  UploadCloud,
  Link2,
  Unlink,
  Copy,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Activity,
  Camera,
  Smartphone,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';
import { parseWorkoutFileContent } from '../../utils/workoutFileParser';
import { playSelectSound } from '../../utils/retroAudio';

interface StravaAthlete {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  profile: string;
  city: string;
  country: string;
}

interface StravaActivityItem {
  id: string;
  name: string;
  sportType: string;
  startDate: string;
  durationMin: number;
  distanceKm: number;
  avgHeartRate: number | null;
  maxHeartRate: number | null;
  caloriesBurned: number;
  hasExactCalories: boolean;
  deviceName: string;
  isAppleWatch: boolean;
}

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

const STRAVA_TOKEN_STORAGE_KEY = 'smashai_strava_session_token';
const SHORTCUTS_KEY_STORAGE = 'smashai_apple_shortcuts_key_v1';

function readStoredStravaToken(): string | null {
  try {
    return sessionStorage.getItem(STRAVA_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredStravaToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(STRAVA_TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(STRAVA_TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage restriction errors
  }
}

function getOrCreateShortcutsKey(): string {
  try {
    const existing = localStorage.getItem(SHORTCUTS_KEY_STORAGE);
    if (existing && existing.length >= 12) return existing;
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const created = `smash_${hex}`;
    localStorage.setItem(SHORTCUTS_KEY_STORAGE, created);
    return created;
  } catch {
    return `smash_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

async function compressImageToBase64(
  file: File
): Promise<{ base64: string; mimeType: string; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('READ_FAILED'));
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const img = new Image();
      img.onerror = () => {
        // Fallback: send original file base64 directly (e.g., HEIC or non-canvas formats)
        const parts = dataUrl.split(',');
        const base64 = parts[1] || '';
        resolve({
          base64,
          mimeType: file.type || 'image/jpeg',
          previewUrl: dataUrl,
        });
      };
      img.onload = () => {
        const maxDim = 1280;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const parts = dataUrl.split(',');
          resolve({
            base64: parts[1] || '',
            mimeType: file.type || 'image/jpeg',
            previewUrl: dataUrl,
          });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = compressedUrl.split(',')[1] || '';
        resolve({
          base64,
          mimeType: 'image/jpeg',
          previewUrl: compressedUrl,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export const F2_WearableSyncScreen: React.FC = () => {
  const {
    setWearableConnected,
    wearableMetrics,
    convertCaloriesToExp,
    logWearableWorkout,
    navigateTo,
    language,
  } = useApp();
  const isThai = language === 'th';

  // Free Method 1: AI Workout Screenshot Scanner
  const [isScanningScreenshot, setIsScanningScreenshot] = useState<boolean>(false);
  const [scanPreviewUrl, setScanPreviewUrl] = useState<string | null>(null);
  const [scanSummaryNote, setScanSummaryNote] = useState<string | null>(null);
  const screenshotInputRef = useRef<HTMLInputElement | null>(null);

  // Free Method 2: Apple Shortcuts Webhook & Direct File Import
  const [freeWatchTab, setFreeWatchTab] = useState<'shortcuts' | 'file'>('shortcuts');
  const [shortcutsKey] = useState<string>(() => getOrCreateShortcutsKey());
  const [shortcutsWebhookUrl, setShortcutsWebhookUrl] = useState<string>('');
  const [shortcutsWorkouts, setShortcutsWorkouts] = useState<ShortcutsWorkoutItem[]>([]);
  const [isLoadingShortcuts, setIsLoadingShortcuts] = useState<boolean>(false);
  const [copiedWebhook, setCopiedWebhook] = useState<boolean>(false);
  const [showShortcutsGuide, setShowShortcutsGuide] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Optional Paid-API Method: Strava OAuth 2.0 (Collapsed unless already connected)
  const [showStravaSection, setShowStravaSection] = useState<boolean>(false);
  const [stravaConfigured, setStravaConfigured] = useState<boolean | null>(null);
  const [stravaConnected, setStravaConnected] = useState<boolean>(false);
  const [stravaAthlete, setStravaAthlete] = useState<StravaAthlete | null>(null);
  const [callbackDomain, setCallbackDomain] = useState<string>('');
  const [stravaActivities, setStravaActivities] = useState<StravaActivityItem[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState<boolean>(false);
  const [isConnectingStrava, setIsConnectingStrava] = useState<boolean>(false);
  const [importingActivityId, setImportingActivityId] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState<boolean>(false);

  // Manual Entry & Status Banners
  const [showLogForm, setShowLogForm] = useState<boolean>(false);
  const [justConverted, setJustConverted] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [inputHr, setInputHr] = useState(String(wearableMetrics.heartRateBpm));
  const [inputKcal, setInputKcal] = useState(String(wearableMetrics.caloriesBurned));
  const [inputDist, setInputDist] = useState(String(wearableMetrics.distanceKm));

  const buildStravaHeaders = useCallback((): HeadersInit => {
    const token = readStoredStravaToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const flashNotice = useCallback((msg: string) => {
    setSyncError(null);
    setSyncNotice(msg);
    setTimeout(() => {
      setSyncNotice((curr) => (curr === msg ? null : curr));
    }, 4500);
  }, []);

  // Fetch Apple Shortcuts live webhook inbox
  const fetchShortcutsInbox = useCallback(
    async (notifyIfEmpty = false) => {
      setIsLoadingShortcuts(true);
      try {
        const resp = await fetch(
          `/api/wearable/shortcuts-inbox?key=${encodeURIComponent(shortcutsKey)}`
        );
        if (!resp.ok) return;
        const data = await resp.json();
        if (data.webhookUrl) {
          setShortcutsWebhookUrl(String(data.webhookUrl));
        }
        const list = Array.isArray(data.workouts) ? (data.workouts as ShortcutsWorkoutItem[]) : [];
        setShortcutsWorkouts(list);
        if (list.length > 0) {
          setWearableConnected(true);
        }
        if (notifyIfEmpty) {
          flashNotice(
            list.length > 0
              ? isThai
                ? `พบข้อมูลจาก Apple Shortcuts จำนวน ${list.length} รายการ`
                : `Found ${list.length} synced Apple Shortcuts workout(s)`
              : isThai
                ? 'เชื่อมต่อ Webhook พร้อมรับข้อมูลแล้ว (ยังไม่มีรายการส่งมาจาก iPhone)'
                : 'Webhook is live and ready — no workouts pushed from iPhone yet.'
          );
        }
      } catch {
        if (notifyIfEmpty) {
          setSyncError(
            isThai
              ? 'ไม่สามารถตรวจสอบ Webhook Inbox ได้ในขณะนี้'
              : 'Unable to check Shortcuts inbox right now.'
          );
        }
      } finally {
        setIsLoadingShortcuts(false);
      }
    },
    [flashNotice, isThai, setWearableConnected, shortcutsKey]
  );

  const fetchStravaActivities = useCallback(async () => {
    setIsLoadingActivities(true);
    setSyncError(null);
    try {
      const resp = await fetch('/api/strava/activities', {
        credentials: 'include',
        headers: buildStravaHeaders(),
      });
      if (resp.status === 401) {
        setStravaConnected(false);
        setStravaAthlete(null);
        setStravaActivities([]);
        writeStoredStravaToken(null);
        return;
      }
      if (!resp.ok) {
        throw new Error('STRAVA_FETCH_ERROR');
      }
      const data = await resp.json();
      if (data.athlete) setStravaAthlete(data.athlete);
      setStravaActivities(Array.isArray(data.activities) ? data.activities : []);
    } catch {
      setSyncError(
        isThai
          ? 'ไม่สามารถดึงกิจกรรมจาก Strava ได้ในขณะนี้ กรุณากดลองใหม่อีกครั้ง'
          : 'Unable to fetch Strava activities right now. Please try again.'
      );
    } finally {
      setIsLoadingActivities(false);
    }
  }, [buildStravaHeaders, isThai]);

  const checkStravaStatus = useCallback(async () => {
    try {
      const resp = await fetch('/api/strava/status', {
        credentials: 'include',
        headers: buildStravaHeaders(),
      });
      if (!resp.ok) return;
      const data = await resp.json();
      setStravaConfigured(Boolean(data.configured));
      setCallbackDomain(String(data.callbackDomain || ''));
      const isConnectedNow = Boolean(data.connected);
      setStravaConnected(isConnectedNow);
      if (isConnectedNow) {
        setWearableConnected(true);
        setShowStravaSection(true);
        setStravaAthlete(data.athlete || null);
        fetchStravaActivities();
      }
    } catch {
      // Ignore silently
    }
  }, [buildStravaHeaders, fetchStravaActivities, setWearableConnected]);

  useEffect(() => {
    fetchShortcutsInbox(false);
    checkStravaStatus();
  }, [checkStravaStatus, fetchShortcutsInbox]);

  // Listen for OAuth completion message from Strava popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin || '';
      const isTrustedOrigin =
        origin === window.location.origin ||
        origin.endsWith('.run.app') ||
        origin.includes('localhost');
      if (!isTrustedOrigin) return;

      if (event.data?.type === 'STRAVA_OAUTH_SUCCESS') {
        if (typeof event.data.sessionToken === 'string' && event.data.sessionToken) {
          writeStoredStravaToken(event.data.sessionToken);
        }
        setIsConnectingStrava(false);
        setStravaConnected(true);
        setShowStravaSection(true);
        setWearableConnected(true);
        if (event.data.athlete) {
          setStravaAthlete(event.data.athlete);
        }
        flashNotice(
          isThai
            ? 'เชื่อมต่อ Strava สำเร็จ! กำลังดึงรายการออกกำลังกายล่าสุด...'
            : 'Connected to Strava! Loading your latest activities...'
        );
        fetchStravaActivities();
      } else if (event.data?.type === 'STRAVA_OAUTH_ERROR') {
        setIsConnectingStrava(false);
        const errCode = String(event.data.error || '');
        setSyncError(
          errCode === 'access_denied'
            ? isThai
              ? 'ยกเลิกการเชื่อมต่อ Strava คุณสามารถกดเชื่อมต่อใหม่ได้ทุกเมื่อ'
              : 'Strava authorization was cancelled. Tap Connect anytime to retry.'
            : isThai
              ? 'การเชื่อมต่อ Strava ไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า Callback Domain แล้วลองใหม่'
              : 'Strava authorization failed. Check your Callback Domain settings and retry.'
        );
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [fetchStravaActivities, flashNotice, isThai, setWearableConnected]);

  // Free Method 1: Handle Workout Screenshot AI Scan
  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSyncError(null);
    setScanSummaryNote(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSyncError(
        isThai
          ? 'กรุณาเลือกไฟล์รูปภาพ (.jpg, .png, .webp) จากหน้าจอสรุปผลซ้อม'
          : 'Please select an image file (.jpg, .png, .webp) of your workout summary.'
      );
      if (screenshotInputRef.current) screenshotInputRef.current.value = '';
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setSyncError(
        isThai ? 'ไฟล์ภาพมีขนาดใหญ่เกิน 15MB' : 'Image file exceeds 15MB limit.'
      );
      if (screenshotInputRef.current) screenshotInputRef.current.value = '';
      return;
    }

    playSelectSound();
    setIsScanningScreenshot(true);

    try {
      const { base64, mimeType, previewUrl } = await compressImageToBase64(file);
      setScanPreviewUrl(previewUrl);

      const resp = await fetch('/api/wearable/scan-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          imageMimeType: mimeType,
          language,
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.workout) {
        setSyncError(
          data.error ||
            (isThai
              ? 'อ่านข้อมูลจากภาพไม่สำเร็จ กรุณาลองอัปโหลดภาพแคปหน้าจอที่ชัดเจนขึ้น'
              : 'Could not extract workout metrics from this screenshot.')
        );
        return;
      }

      const w = data.workout as {
        id: string;
        activityName: string;
        sourceApp: string;
        caloriesBurned: number;
        avgHeartRate: number;
        maxHeartRate: number;
        distanceKm: number;
        durationMin: number;
        summaryNote: string;
      };

      logWearableWorkout({
        heartRateBpm: w.avgHeartRate,
        maxHeartRateBpm: w.maxHeartRate,
        caloriesBurned: w.caloriesBurned,
        distanceKm: w.distanceKm,
        durationMin: w.durationMin,
        source: `AI Scan · ${w.sourceApp}`,
        activityName: w.activityName,
        activityId: w.id,
      });

      setWearableConnected(true);
      setInputHr(String(w.avgHeartRate));
      setInputKcal(String(w.caloriesBurned));
      setInputDist(String(w.distanceKm));
      if (w.summaryNote) setScanSummaryNote(w.summaryNote);

      flashNotice(
        isThai
          ? `สแกน "${w.activityName}" สำเร็จ (${w.caloriesBurned} แคลอรี · ${w.avgHeartRate} BPM)`
          : `Scanned "${w.activityName}" (${w.caloriesBurned} kcal · ${w.avgHeartRate} BPM)`
      );
    } catch {
      setSyncError(
        isThai
          ? 'เชื่อมต่อบริการ AI สแกนภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
          : 'Failed to connect to AI screenshot scanner. Please retry.'
      );
    } finally {
      setIsScanningScreenshot(false);
      if (screenshotInputRef.current) screenshotInputRef.current.value = '';
    }
  };

  // Free Method 2A: Import a workout received from Apple Shortcuts Webhook
  const handleImportShortcutsWorkout = (item: ShortcutsWorkoutItem) => {
    playSelectSound();
    logWearableWorkout({
      heartRateBpm: item.avgHeartRate,
      maxHeartRateBpm: item.maxHeartRate,
      caloriesBurned: item.caloriesBurned,
      distanceKm: item.distanceKm,
      durationMin: item.durationMin,
      source: item.source || 'Apple Watch · Shortcuts',
      activityName: item.name,
      activityId: item.id,
    });
    setWearableConnected(true);
    setInputHr(String(item.avgHeartRate));
    setInputKcal(String(item.caloriesBurned));
    setInputDist(String(item.distanceKm));
    flashNotice(
      isThai
        ? `นำเข้า "${item.name}" จาก Apple Shortcuts แล้ว (${item.caloriesBurned} แคลอรี)`
        : `Imported "${item.name}" from Apple Shortcuts (${item.caloriesBurned} kcal)`
    );
  };

  // Free Method 2B: Import .tcx / .gpx / Apple Health .xml / Strava .csv
  const handleWorkoutFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSyncError(null);
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setSyncError(
        isThai
          ? 'ไฟล์มีขนาดใหญ่เกิน 25MB (แนะนำ Export เฉพาะไฟล์ .tcx / .gpx / .csv ของรอบซ้อม)'
          : 'File exceeds 25MB. Export a single workout .tcx / .gpx / .csv file instead.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseWorkoutFileContent(String(reader.result || ''), file.name);
        logWearableWorkout({
          heartRateBpm: parsed.avgHeartRate,
          maxHeartRateBpm: parsed.maxHeartRate,
          caloriesBurned: parsed.caloriesBurned,
          distanceKm: parsed.distanceKm,
          durationMin: parsed.durationMin,
          source: parsed.source,
          activityName: parsed.title,
          activityId: `file_${parsed.dateIso}_${parsed.caloriesBurned}`,
        });
        setWearableConnected(true);
        setInputHr(String(parsed.avgHeartRate));
        setInputKcal(String(parsed.caloriesBurned));
        setInputDist(String(parsed.distanceKm));
        flashNotice(
          isThai
            ? `นำเข้าไฟล์ "${parsed.title}" สำเร็จ (${parsed.caloriesBurned} แคลอรี)`
            : `Imported "${parsed.title}" (${parsed.caloriesBurned} kcal)`
        );
      } catch {
        setSyncError(
          isThai
            ? 'ไฟล์ไม่รองรับ กรุณาเลือกไฟล์ .tcx, .gpx, Strava .csv หรือ Apple Health .xml'
            : 'Unsupported file format. Please select a valid .tcx, .gpx, Strava .csv, or Apple Health .xml file.'
        );
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Optional Strava OAuth handlers
  const handleConnectStrava = async () => {
    if (isConnectingStrava) return;
    playSelectSound();
    setSyncError(null);
    setIsConnectingStrava(true);

    try {
      const resp = await fetch('/api/strava/auth-url', { credentials: 'include' });
      const data = await resp.json();

      if (!resp.ok || !data.url) {
        setIsConnectingStrava(false);
        if (data.error === 'STRAVA_NOT_CONFIGURED') {
          setStravaConfigured(false);
          if (data.callbackDomain) setCallbackDomain(data.callbackDomain);
          setSyncError(
            isThai
              ? 'Strava API ต้องใช้บัญชี Strava Subscription — แนะนำใช้วิธีสแกนภาพหรือ Apple Shortcuts ด้านบนฟรี 100%'
              : 'Strava API requires a Strava Subscription. Use the free AI Scan or Apple Shortcuts above instead.'
          );
        } else {
          setSyncError(
            isThai
              ? 'ไม่สามารถเริ่มการเชื่อมต่อ Strava ได้ในขณะนี้'
              : 'Unable to initiate Strava authorization right now.'
          );
        }
        return;
      }

      const authPopup = window.open(data.url, 'strava_oauth_popup', 'width=600,height=700');
      if (!authPopup) {
        setIsConnectingStrava(false);
        setSyncError(
          isThai
            ? 'เบราว์เซอร์บล็อกหน้าต่างป๊อปอัป กรุณาอนุญาต Pop-up เพื่อเชื่อมต่อ Strava'
            : 'Popup was blocked by your browser. Please allow pop-ups to connect Strava.'
        );
      }
    } catch {
      setIsConnectingStrava(false);
      setSyncError(
        isThai
          ? 'เชื่อมต่อเซิร์ฟเวอร์ Strava ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
          : 'Failed to reach Strava connection endpoint. Please retry.'
      );
    }
  };

  const handleDisconnectStrava = async () => {
    playSelectSound();
    try {
      await fetch('/api/strava/disconnect', {
        method: 'POST',
        credentials: 'include',
        headers: buildStravaHeaders(),
      });
    } catch {
      // Ignore network errors on disconnect
    }
    writeStoredStravaToken(null);
    setStravaConnected(false);
    setStravaAthlete(null);
    setStravaActivities([]);
    flashNotice(isThai ? 'ยกเลิกการเชื่อมต่อ Strava แล้ว' : 'Disconnected from Strava');
  };

  const handleImportStravaActivity = async (activity: StravaActivityItem) => {
    if (importingActivityId) return;
    setImportingActivityId(activity.id);
    setSyncError(null);

    try {
      let resolved = activity;
      const detailResp = await fetch(`/api/strava/activities/${activity.id}`, {
        credentials: 'include',
        headers: buildStravaHeaders(),
      });
      if (detailResp.ok) {
        const detailData = await detailResp.json();
        if (detailData.activity) resolved = detailData.activity;
      }

      const sourceLabel = resolved.deviceName ? `Strava · ${resolved.deviceName}` : 'Strava';
      const avgHr = resolved.avgHeartRate || 148;
      const maxHr = resolved.maxHeartRate || Math.min(210, avgHr + 18);

      logWearableWorkout({
        heartRateBpm: avgHr,
        maxHeartRateBpm: maxHr,
        caloriesBurned: resolved.caloriesBurned,
        distanceKm: Math.max(
          0.2,
          resolved.distanceKm || Number((resolved.durationMin * 0.06).toFixed(2))
        ),
        durationMin: resolved.durationMin,
        source: sourceLabel,
        activityName: resolved.name,
        activityId: `strava_${resolved.id}`,
      });

      setInputHr(String(avgHr));
      setInputKcal(String(resolved.caloriesBurned));
      setInputDist(String(resolved.distanceKm || 0.2));

      flashNotice(
        isThai
          ? `นำเข้า "${resolved.name}" สำเร็จ (${resolved.caloriesBurned} แคลอรี · ${sourceLabel})`
          : `Imported "${resolved.name}" (${resolved.caloriesBurned} kcal · ${sourceLabel})`
      );
    } catch {
      setSyncError(
        isThai
          ? 'ไม่สามารถดึงรายละเอียดกิจกรรมจาก Strava ได้ กรุณาลองใหม่'
          : 'Unable to import activity details from Strava.'
      );
    } finally {
      setImportingActivityId(null);
    }
  };

  const handleSaveManualWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const hr = Math.max(80, Math.min(210, Number(inputHr) || 156));
    const kcal = Math.max(50, Math.min(2500, Number(inputKcal) || 480));
    const dist = Math.max(0.2, Math.min(30, Number(inputDist) || 3.8));
    logWearableWorkout({
      heartRateBpm: Math.round(hr),
      caloriesBurned: Math.round(kcal),
      distanceKm: Number(dist.toFixed(1)),
      source: isThai ? 'กรอกผลซ้อมเอง' : 'Manual Log',
      activityName: isThai ? 'ซ้อมแบดมินตัน' : 'Badminton Session',
    });
    setShowLogForm(false);
    flashNotice(
      isThai
        ? `บันทึกเซสชันซ้อมแล้ว (${Math.round(kcal)} แคลอรี · กดแลกแต้มด้านล่างได้เลย)`
        : `Workout logged (${Math.round(kcal)} kcal · Ready to claim EXP)`
    );
  };

  const handleConvert = () => {
    if (wearableMetrics.expConverted) return;
    convertCaloriesToExp();
    setJustConverted(true);
    setTimeout(() => setJustConverted(false), 3000);
  };

  const handleCopyWebhook = () => {
    if (!shortcutsWebhookUrl) return;
    navigator.clipboard?.writeText(shortcutsWebhookUrl);
    setCopiedWebhook(true);
    playSelectSound();
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleCopyDomain = () => {
    if (!callbackDomain) return;
    navigator.clipboard?.writeText(callbackDomain);
    setCopiedDomain(true);
    playSelectSound();
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  const rewardExp = Math.max(10, Math.round(wearableMetrics.caloriesBurned / 2));
  const peakHr = wearableMetrics.maxHeartRateBpm || Math.min(205, wearableMetrics.heartRateBpm + 18);
  const hrZoneLabel =
    wearableMetrics.heartRateBpm >= 155
      ? isThai
        ? 'โซนออกกำลังหนัก'
        : 'ANAEROBIC ZONE'
      : wearableMetrics.heartRateBpm >= 130
        ? isThai
          ? 'โซนคาร์ดิโอ'
          : 'CARDIO ZONE'
        : isThai
          ? 'โซนวอร์มอัพ'
          : 'WARM-UP ZONE';

  const formatShortDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
    return d.toLocaleDateString(isThai ? 'th-TH' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f8faf6] text-[#142608] overflow-hidden">
      <MobileHeader
        title={isThai ? 'ซิงค์นาฬิกา & สุขภาพ' : 'Watch & Health Sync'}
        showBack
      />

      <div className="px-4 pt-4 space-y-3.5 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-20 max-w-xl w-full mx-auto">
        {/* 1. HERO (100% FREE): AI Workout Screenshot Scanner */}
        <div className="p-4 rounded-[24px] bg-[#004d2c] text-[#ffffff] space-y-3 shadow-xs">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-[#7cd7a0] text-[#004d2c] flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm font-bold text-[#ffffff]">
                    {isThai ? 'สแกนภาพสรุปผลซ้อมด้วย AI' : 'AI Workout Screenshot Scan'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#7cd7a0] text-[#004d2c] text-[10px] font-bold shrink-0">
                    {isThai ? 'ฟรี 100%' : '100% Free'}
                  </span>
                </div>
                <p className="text-[11px] text-[#d4dfd0] mt-0.5 leading-snug">
                  {isThai
                    ? 'แคปหน้าจอ Apple Watch, Apple Fitness, Strava (ฟรี) หรือ Garmin แล้วอัปโหลด — AI อ่านแคลอรีและชีพจรให้อัตโนมัติ'
                    : 'Upload any Apple Watch, Apple Fitness, free Strava, or Garmin summary screenshot for instant metrics.'}
                </p>
              </div>
            </div>
          </div>

          <input
            ref={screenshotInputRef}
            type="file"
            accept="image/*"
            onChange={handleScreenshotUpload}
            className="hidden"
          />

          <button
            type="button"
            disabled={isScanningScreenshot}
            onClick={() => screenshotInputRef.current?.click()}
            className="no-doodle w-full py-3 px-4 rounded-full bg-[#7cd7a0] hover:bg-[#69c990] text-[#142608] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {isScanningScreenshot ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>
                  {isThai ? 'กำลังอ่านแคลอรีและชีพจรจากภาพ...' : 'Extracting metrics from screenshot...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  {isThai
                    ? 'เลือกภาพแคปหน้าจอสรุปผลซ้อม'
                    : 'Upload Workout Summary Screenshot'}
                </span>
              </>
            )}
          </button>

          {scanPreviewUrl && (
            <div className="p-2.5 rounded-[16px] bg-[#ffffff]/10 border border-[#7cd7a0]/30 flex items-center gap-3">
              <img
                src={scanPreviewUrl}
                alt="Workout screenshot preview"
                className="w-12 h-12 rounded-[10px] object-cover border border-[#7cd7a0]/40 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-[#7cd7a0]">
                  {isScanningScreenshot
                    ? isThai
                      ? 'กำลังวิเคราะห์ภาพด้วย AI...'
                      : 'Analyzing screenshot...'
                    : isThai
                      ? 'สแกนภาพล่าสุดเรียบร้อย'
                      : 'Latest screenshot scanned'}
                </div>
                {scanSummaryNote && (
                  <p className="text-[11px] text-[#ffffff]/90 line-clamp-2 mt-0.5 leading-snug">
                    {scanSummaryNote}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status / Error Banners */}
        {syncNotice && (
          <div className="px-3.5 py-2.5 rounded-[16px] bg-[#e8f7ee] border border-[#7cd7a0] text-xs font-semibold text-[#004d2c] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
            <span>{syncNotice}</span>
          </div>
        )}

        {syncError && (
          <div className="px-3.5 py-2.5 rounded-[16px] bg-[#fff5f2] border border-[#e85729]/30 text-xs font-semibold text-[#e85729] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{syncError}</span>
          </div>
        )}

        {/* 2. FREE APPLE WATCH SYNC HUB (Apple Shortcuts Webhook + Direct File Import) */}
        <div className="p-4 rounded-[24px] bg-[#ffffff] border border-[#d4dfd0] space-y-3 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#e8f7ee] text-[#004d2c] flex items-center justify-center shrink-0">
                <Watch className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#142608] truncate">
                    {isThai ? 'ซิงค์ Apple Watch & นาฬิกา' : 'Apple Watch & File Sync'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#e8f7ee] text-[#15803d] text-[10px] font-bold shrink-0">
                    {isThai ? 'ฟรี' : 'Free'}
                  </span>
                </div>
                <p className="text-[11px] text-[#5c6f5e] truncate">
                  {isThai
                    ? 'ซิงค์อัตโนมัติผ่าน Apple Shortcuts หรืออัปโหลดไฟล์ .tcx / .gpx / .csv'
                    : 'Auto-sync via iOS Shortcuts or upload .tcx / .gpx / .csv / .xml'}
                </p>
              </div>
            </div>
          </div>

          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-[#f2f7f0] border border-[#d4dfd0]">
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setFreeWatchTab('shortcuts');
              }}
              className={`no-doodle py-2 px-3 rounded-full text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                freeWatchTab === 'shortcuts'
                  ? 'bg-[#004d2c] text-[#ffffff]'
                  : 'text-[#5c6f5e] hover:text-[#142608]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{isThai ? 'Apple Shortcuts' : 'Apple Shortcuts'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setFreeWatchTab('file');
              }}
              className={`no-doodle py-2 px-3 rounded-full text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                freeWatchTab === 'file'
                  ? 'bg-[#004d2c] text-[#ffffff]'
                  : 'text-[#5c6f5e] hover:text-[#142608]'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{isThai ? 'นำเข้าไฟล์ซ้อม' : 'Import File'}</span>
            </button>
          </div>

          {freeWatchTab === 'shortcuts' ? (
            <div className="space-y-3">
              <div className="p-3 rounded-[16px] bg-[#f8faf6] border border-[#d4dfd0] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#004d2c]">
                    {isThai
                      ? 'ลิงก์รับข้อมูลส่วนตัว (Apple Shortcuts Webhook)'
                      : 'Your Personal Apple Shortcuts Webhook URL'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      fetchShortcutsInbox(true);
                    }}
                    disabled={isLoadingShortcuts}
                    className="no-doodle px-2.5 py-1 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#004d2c] text-[10px] font-bold text-[#004d2c] flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${isLoadingShortcuts ? 'animate-spin' : ''}`}
                    />
                    <span>{isThai ? 'เช็กข้อมูล' : 'Refresh'}</span>
                  </button>
                </div>

                {shortcutsWebhookUrl && (
                  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-[12px] bg-[#ffffff] border border-[#d4dfd0]">
                    <code className="text-[10px] font-mono text-[#142608] truncate">
                      {shortcutsWebhookUrl}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyWebhook}
                      className="no-doodle px-2.5 py-1 rounded-full bg-[#e8f7ee] text-[#004d2c] text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedWebhook ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>
                        {copiedWebhook
                          ? isThai
                            ? 'คัดลอกแล้ว'
                            : 'Copied'
                          : isThai
                            ? 'คัดลอก'
                            : 'Copy'}
                      </span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setShowShortcutsGuide((v) => !v);
                  }}
                  className="no-doodle w-full pt-1 text-[11px] font-bold text-[#004d2c] flex items-center justify-between cursor-pointer"
                >
                  <span>
                    {isThai
                      ? 'วิธีตั้งค่าซิงค์อัตโนมัติบน iPhone (ใช้แอปคำสั่งลัดฟรีของ Apple)'
                      : 'How to set up free auto-sync in iPhone Shortcuts'}
                  </span>
                  {showShortcutsGuide ? (
                    <ChevronUp className="w-4 h-4 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0" />
                  )}
                </button>

                {showShortcutsGuide && (
                  <div className="pt-2 border-t border-[#e6eee2] space-y-2 text-[11px] text-[#526453] leading-relaxed">
                    <ol className="list-decimal list-inside space-y-1.5">
                      <li>
                        {isThai
                          ? 'เปิดแอป "คำสั่งลัด (Shortcuts)" ที่ติดมากับ iPhone → แท็บ "การทำงานอัตโนมัติ" → กด + → เลือก "ออกกำลังกาย (Workout)" → เมื่อสิ้นสุด (Ends) → ทำงานทันที'
                          : 'Open built-in iPhone Shortcuts → Automation → + → Workout → Ends → Run Immediately.'}
                      </li>
                      <li>
                        {isThai
                          ? 'เพิ่มคำสั่ง "ค้นหาตัวอย่างสุขภาพ (Find Health Samples)" เลือกประเภท Workouts, เรียงตาม Start Date ล่าสุด, จำกัด 1 รายการ'
                          : 'Add "Find Health Samples" → Type: Workouts → Sort by Start Date (Latest First) → Limit: 1.'}
                      </li>
                      <li>
                        {isThai
                          ? 'เพิ่มคำสั่ง "รับเนื้อหาของ URL (Get Contents of URL)" วางลิงก์ Webhook ด้านบน → เมธอด POST → เนื้อหาแบบ JSON ใส่คีย์ calories, avgHeartRate, distanceKm, durationMin, workoutName'
                          : 'Add "Get Contents of URL" with the Webhook URL above → Method: POST → JSON body keys: calories, avgHeartRate, distanceKm, durationMin, workoutName.'}
                      </li>
                      <li>
                        {isThai
                          ? 'ทุกครั้งที่กดจบการตีแบดบน Apple Watch ข้อมูลจะส่งเข้า SmashAI อัตโนมัติฟรีตลอดการใช้งาน!'
                          : 'Every time you end a Badminton workout on Apple Watch, it syncs directly into SmashAI for free!'}
                      </li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Synced Apple Shortcuts Inbox List */}
              {shortcutsWorkouts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#004d2c]">
                      {isThai ? 'รอบซ้อมที่ส่งมาจาก Apple Shortcuts' : 'Received from Apple Shortcuts'}
                    </span>
                    <span className="text-[10px] font-semibold text-[#5c6f5e] tabular-nums">
                      {shortcutsWorkouts.length} {isThai ? 'รายการ' : 'items'}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
                    {shortcutsWorkouts.map((item) => {
                      const isActive = wearableMetrics.activityId === item.id;
                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-[16px] border flex items-center justify-between gap-2.5 ${
                            isActive
                              ? 'bg-[#e8f7ee] border-[#7cd7a0]'
                              : 'bg-[#f8faf6] border-[#d4dfd0]'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#142608] truncate">
                                {item.name}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-[#004d2c] text-[#7cd7a0] text-[9px] font-bold shrink-0">
                                Apple Watch
                              </span>
                            </div>
                            <div className="text-[10px] text-[#5c6f5e] font-medium tabular-nums mt-0.5 truncate">
                              {formatShortDate(item.startDate)} · {item.caloriesBurned} kcal ·{' '}
                              {item.avgHeartRate} BPM · {item.durationMin}{' '}
                              {isThai ? 'นาที' : 'min'}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleImportShortcutsWorkout(item)}
                            className={`no-doodle px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 cursor-pointer whitespace-nowrap ${
                              isActive
                                ? 'bg-[#004d2c] text-[#7cd7a0]'
                                : 'bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff]'
                            }`}
                          >
                            {isActive
                              ? isThai
                                ? 'ใช้งานอยู่'
                                : 'Active'
                              : isThai
                                ? 'นำเข้า'
                                : 'Import'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept=".tcx,.gpx,.xml,.csv,application/xml,text/xml,text/csv"
                onChange={handleWorkoutFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="no-doodle w-full py-3.5 px-4 rounded-[16px] border border-dashed border-[#004d2c]/45 hover:border-[#004d2c] bg-[#f8faf6] hover:bg-[#e8f7ee]/60 text-[#004d2c] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <UploadCloud className="w-4 h-4 shrink-0" />
                <span>
                  {isThai
                    ? 'เลือกไฟล์ .tcx / .gpx / Strava .csv / Apple Health .xml'
                    : 'Choose .tcx / .gpx / Strava .csv / Apple Health .xml'}
                </span>
              </button>
              <p className="text-[11px] text-[#5c6f5e] leading-relaxed px-1">
                {isThai
                  ? 'บัญชี Strava ฟรีสามารถกด Export GPX หรือดาวน์โหลดไฟล์ activities.csv มาอัปโหลดที่นี่ได้ฟรีโดยไม่ต้องสมัคร Strava Subscription'
                  : 'Free Strava accounts can export GPX or activities.csv and upload them here without a paid subscription.'}
              </p>
            </div>
          )}
        </div>

        {/* 3. Active Session Telemetry & Cardiac Wave */}
        <div className="p-4 rounded-[24px] bg-[#ffffff] border border-[#d4dfd0] space-y-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs gap-2">
            <div className="min-w-0">
              <span className="text-sm font-bold flex items-center gap-1.5 text-[#142608] truncate">
                <Heart className="w-4 h-4 text-[#e85729] fill-[#e85729] shrink-0" />
                <span className="truncate">
                  {wearableMetrics.activityName ||
                    (isThai ? 'รอบซ้อมล่าสุด' : 'Latest Workout Session')}
                </span>
              </span>
              <span className="text-[10px] font-semibold text-[#5c6f5e] block mt-0.5 truncate">
                {wearableMetrics.source || (isThai ? 'กรอกข้อมูลเอง' : 'Manual Log')}
                {wearableMetrics.durationMin
                  ? ` · ${wearableMetrics.durationMin} ${isThai ? 'นาที' : 'min'}`
                  : ''}
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[#e85729] text-[#ffffff] whitespace-nowrap shrink-0">
              {hrZoneLabel}
            </span>
          </div>

          {/* SVG Heart Rate Wave */}
          <div className="w-full h-20 rounded-[18px] bg-[#004d2c] p-2 relative flex items-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
              <path
                d="M 0 30 Q 20 30 30 30 L 40 10 L 48 50 L 56 15 L 64 35 L 72 30 L 120 30 L 130 8 L 138 52 L 146 12 L 154 35 L 162 30 L 220 30 L 230 10 L 238 50 L 246 15 L 254 35 L 262 30 L 300 30"
                fill="none"
                stroke="#7cd7a0"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute right-3 top-2 text-[10px] font-bold text-[#7cd7a0] tabular-nums">
              {isThai ? `สูงสุด ${peakHr} BPM` : `PEAK ${peakHr} BPM`}
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-[18px] bg-[#e85729] text-[#ffffff] text-center">
              <Heart className="w-4 h-4 mx-auto mb-1 fill-[#ffffff]" />
              <div className="text-xl font-bold leading-none tabular-nums">
                {wearableMetrics.heartRateBpm}
              </div>
              <div className="text-[10px] font-semibold mt-1 text-[#ffffff]/90">
                {isThai ? 'ชีพจรเฉลี่ย' : 'AVG BPM'}
              </div>
            </div>

            <div className="p-3 rounded-[18px] bg-[#e8f7ee] border border-[#d4dfd0] text-[#004d2c] text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-[#e85729] fill-[#e85729]" />
              <div className="text-xl font-bold leading-none tabular-nums">
                {wearableMetrics.caloriesBurned}
              </div>
              <div className="text-[10px] font-semibold mt-1 text-[#5c6f5e]">
                {isThai ? 'เผาผลาญ (แคล)' : 'KCAL BURN'}
              </div>
            </div>

            <div className="p-3 rounded-[18px] bg-[#7cd7a0] text-[#142608] text-center">
              <Footprints className="w-4 h-4 mx-auto mb-1 text-[#004d2c]" />
              <div className="text-xl font-bold leading-none tabular-nums">
                {wearableMetrics.distanceKm}
              </div>
              <div className="text-[10px] font-semibold mt-1 text-[#004d2c]/85">
                {isThai ? 'ระยะทาง (กม.)' : 'KM DIST'}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Convert Calories to EXP Engine */}
        <div className="p-4 rounded-[24px] bg-[#ffffff] border border-[#d4dfd0] space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e85729] flex items-center justify-center text-[#ffffff]">
              <Zap className="w-4 h-4 fill-[#ffffff]" />
            </div>
            <h4 className="text-sm font-bold text-[#142608]">
              {isThai ? 'แปลงแคลอรีเป็นคะแนน EXP' : 'Calories to EXP Engine'}
            </h4>
          </div>

          <p className="text-xs text-[#5c6f5e] font-medium leading-relaxed">
            {isThai
              ? 'ทุก 2 แคลอรีจากรอบซ้อมที่สแกนหรือซิงค์เข้ามา แปลงเป็น 1 EXP และบันทึกลงโปรไฟล์อัตโนมัติ'
              : 'Every 2 calories from scanned or synced workouts converts to 1 EXP and saves to your profile.'}
          </p>

          <button
            type="button"
            disabled={wearableMetrics.expConverted}
            onClick={handleConvert}
            className={`no-doodle w-full py-3 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              wearableMetrics.expConverted
                ? 'bg-[#e8f7ee] text-[#004d2c]/70 border border-[#d4dfd0] cursor-not-allowed'
                : 'bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] active:scale-[0.98] cursor-pointer'
            }`}
          >
            {wearableMetrics.expConverted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
                <span className="truncate">
                  {isThai
                    ? `รับแล้ว +${rewardExp} EXP (สแกนหรือนำเข้ารอบใหม่เพื่อรับเพิ่ม)`
                    : `Claimed +${rewardExp} EXP (Scan or import a new session)`}
                </span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-[#7cd7a0] text-[#7cd7a0] shrink-0" />
                <span>
                  {isThai ? `แลกคะแนน (+${rewardExp} EXP)` : `Convert Kcal (+${rewardExp} EXP)`}
                </span>
              </>
            )}
          </button>

          {justConverted && (
            <div className="p-2.5 rounded-full bg-[#7cd7a0] text-[#142608] text-center text-xs font-bold">
              {isThai
                ? `รับ +${rewardExp} EXP เข้าโปรไฟล์เรียบร้อยแล้ว`
                : `+${rewardExp} EXP saved to your profile!`}
            </div>
          )}
        </div>

        {/* 5. Manual Session Logger */}
        <div className="p-4 rounded-[24px] bg-[#ffffff] border border-[#d4dfd0] space-y-3 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-[#142608]">
                {isThai ? 'กรอกค่าซ้อมจากนาฬิกาด้วยตนเอง' : 'Manual Watch Session Entry'}
              </h4>
              <p className="text-[11px] text-[#5c6f5e]">
                {isThai
                  ? 'สำหรับกรอกค่าสรุปหลังตีเสร็จทันทีโดยไม่ต้องเชื่อมบัญชี'
                  : 'Quickly enter post-match Apple Watch / Garmin stats'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLogForm((v) => !v)}
              className="no-doodle px-3 py-1.5 rounded-full bg-[#e8f7ee] text-[#004d2c] border border-[#d4dfd0] hover:border-[#2d4d14] text-[11px] font-semibold flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showLogForm ? (isThai ? 'ปิด' : 'Close') : isThai ? 'กรอกผลซ้อม' : 'Log'}</span>
            </button>
          </div>

          {showLogForm && (
            <form
              onSubmit={handleSaveManualWorkout}
              className="space-y-2.5 pt-2 border-t border-[#e6eee2]"
            >
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#5c6f5e] mb-1">
                    {isThai ? 'ชีพจร (BPM)' : 'Avg BPM'}
                  </label>
                  <input
                    type="number"
                    min={80}
                    max={210}
                    value={inputHr}
                    onChange={(e) => setInputHr(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-[12px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#2d4d14] text-xs font-bold text-[#142608] outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#5c6f5e] mb-1">
                    {isThai ? 'แคลอรี (kcal)' : 'Calories'}
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={2500}
                    value={inputKcal}
                    onChange={(e) => setInputKcal(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-[12px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#2d4d14] text-xs font-bold text-[#142608] outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#5c6f5e] mb-1">
                    {isThai ? 'ระยะ (กม.)' : 'Dist (km)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.2}
                    max={30}
                    value={inputDist}
                    onChange={(e) => setInputDist(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-[12px] bg-[#f8faf6] border border-[#d4dfd0] focus:border-[#2d4d14] text-xs font-bold text-[#142608] outline-none tabular-nums"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="no-doodle w-full py-2.5 rounded-full bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] text-xs font-bold cursor-pointer active:scale-[0.98] transition-all"
              >
                {isThai ? 'บันทึกผลซ้อมและเปิดรับแต้ม EXP' : 'Save Workout & Unlock EXP'}
              </button>
            </form>
          )}
        </div>

        {/* 6. OPTIONAL (Collapsible): Strava OAuth API for Strava Subscribers */}
        <div className="p-4 rounded-[24px] bg-[#ffffff] border border-[#d4dfd0] space-y-3 shadow-2xs">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setShowStravaSection((v) => !v);
            }}
            className="no-doodle w-full flex items-center justify-between gap-2.5 cursor-pointer text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              {stravaAthlete?.profile ? (
                <img
                  src={stravaAthlete.profile}
                  alt={stravaAthlete.firstName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#e85729] shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#fff5f2] text-[#e85729] border border-[#e85729]/25 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-[#142608]">
                    {stravaConnected && stravaAthlete
                      ? `${stravaAthlete.firstName} ${stravaAthlete.lastName}`.trim()
                      : 'Strava OAuth API'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                      stravaConnected
                        ? 'bg-[#e8f7ee] text-[#15803d]'
                        : 'bg-[#fff5f2] text-[#e85729]'
                    }`}
                  >
                    {stravaConnected
                      ? isThai
                        ? 'เชื่อมต่อแล้ว'
                        : 'Connected'
                      : isThai
                        ? 'ต้องมี Strava Subscription'
                        : 'Requires Strava Sub'}
                  </span>
                </div>
                <p className="text-[11px] text-[#5c6f5e] truncate mt-0.5">
                  {isThai
                    ? 'ตัวเลือกเสริมสำหรับผู้ที่มีแพ็กเกจ Strava รายเดือนอยู่แล้ว'
                    : 'Optional direct API sync for paid Strava subscribers'}
                </p>
              </div>
            </div>
            {showStravaSection ? (
              <ChevronUp className="w-4 h-4 text-[#5c6f5e] shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#5c6f5e] shrink-0" />
            )}
          </button>

          {showStravaSection && (
            <div className="pt-2 border-t border-[#e6eee2] space-y-3">
              {stravaConnected ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#004d2c]">
                      {isThai ? 'กิจกรรมล่าสุดจาก Strava' : 'Recent Strava Activities'} (
                      {stravaActivities.length})
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          playSelectSound();
                          fetchStravaActivities();
                        }}
                        disabled={isLoadingActivities}
                        className="no-doodle w-8 h-8 rounded-full bg-[#f8faf6] border border-[#d4dfd0] flex items-center justify-center text-[#004d2c] cursor-pointer"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${isLoadingActivities ? 'animate-spin' : ''}`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={handleDisconnectStrava}
                        className="no-doodle w-8 h-8 rounded-full bg-[#fff5f2] border border-[#e85729]/30 flex items-center justify-center text-[#e85729] cursor-pointer"
                      >
                        <Unlink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isLoadingActivities ? (
                    <div className="py-3 text-center text-xs text-[#5c6f5e]">
                      {isThai ? 'กำลังดึงข้อมูลจาก Strava...' : 'Fetching Strava activities...'}
                    </div>
                  ) : stravaActivities.length === 0 ? (
                    <div className="py-2 text-center text-xs text-[#5c6f5e]">
                      {isThai ? 'ยังไม่มีกิจกรรมในบัญชี Strava นี้' : 'No Strava activities found.'}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                      {stravaActivities.map((act) => {
                        const isImported = wearableMetrics.activityId === `strava_${act.id}`;
                        const isBusy = importingActivityId === act.id;
                        return (
                          <div
                            key={act.id}
                            className={`p-3 rounded-[16px] border flex items-center justify-between gap-2.5 ${
                              isImported
                                ? 'bg-[#e8f7ee] border-[#7cd7a0]'
                                : 'bg-[#f8faf6] border-[#d4dfd0]'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-[#142608] truncate">
                                  {act.name}
                                </span>
                                {act.isAppleWatch && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#004d2c] text-[#7cd7a0] text-[9px] font-bold shrink-0">
                                    Apple Watch
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-[#5c6f5e] font-medium tabular-nums mt-0.5 truncate">
                                {formatShortDate(act.startDate)} · {act.durationMin}{' '}
                                {isThai ? 'นาที' : 'min'} ·{' '}
                                {act.avgHeartRate ? `${act.avgHeartRate} BPM` : `${act.distanceKm} km`}
                              </div>
                            </div>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleImportStravaActivity(act)}
                              className="no-doodle px-3 py-1.5 rounded-full bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] text-[11px] font-bold shrink-0 cursor-pointer"
                            >
                              {isBusy
                                ? '...'
                                : isImported
                                  ? isThai
                                    ? 'ใช้งานอยู่'
                                    : 'Active'
                                  : isThai
                                    ? 'นำเข้า'
                                    : 'Import'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleConnectStrava}
                    disabled={isConnectingStrava}
                    className="no-doodle w-full py-2.5 px-4 rounded-full bg-[#e85729] hover:bg-[#d1471c] text-[#ffffff] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    <Link2 className="w-4 h-4 shrink-0" />
                    <span>
                      {isConnectingStrava
                        ? isThai
                          ? 'กำลังเปิดหน้าต่าง Strava...'
                          : 'Opening Strava...'
                        : isThai
                          ? 'เชื่อมต่อบัญชี Strava (OAuth)'
                          : 'Connect with Strava'}
                    </span>
                  </button>

                  {stravaConfigured === false && callbackDomain && (
                    <div className="p-2.5 rounded-[14px] bg-[#f8faf6] border border-[#d4dfd0] space-y-1.5 text-[11px] text-[#5c6f5e]">
                      <p className="leading-snug">
                        {isThai
                          ? 'หมายเหตุ: Strava ปรับเงื่อนไขให้ต้องสมัคร Strava Subscription ก่อนสร้าง API App — หากไม่ต้องการเสียค่าใช้จ่าย ให้ใช้ "สแกนภาพ AI" หรือ "Apple Shortcuts" ด้านบนได้ฟรี 100%'
                          : 'Note: Strava requires a paid subscription to create API apps. Use AI Scan or Apple Shortcuts above for 100% free sync.'}
                      </p>
                      <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[10px] bg-[#ffffff] border border-[#d4dfd0]">
                        <code className="text-[10px] font-mono text-[#142608] truncate">
                          {callbackDomain}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyDomain}
                          className="no-doodle px-2 py-0.5 rounded-full bg-[#e8f7ee] text-[#004d2c] text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          {copiedDomain ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedDomain ? (isThai ? 'คัดลอกแล้ว' : 'Copied') : isThai ? 'คัดลอก' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dual CTA Links */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => navigateTo('C1')}
            className="no-doodle p-3 rounded-full bg-[#004d2c] hover:bg-[#15803d] text-[#ffffff] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Swords className="w-3.5 h-3.5 shrink-0" />
            <span>{isThai ? 'บันทึกแต้มสด' : 'Live Scorer'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('F1')}
            className="no-doodle p-3 rounded-full bg-[#ffffff] hover:bg-[#e8f7ee] text-[#142608] border border-[#d4dfd0] hover:border-[#2d4d14] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>{isThai ? 'กลับหน้าโปรไฟล์' : 'Back to Profile'}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
