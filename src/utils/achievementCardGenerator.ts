/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Badge, PlayerProfile } from '../types';

export type AchievementCardTheme = 'mint' | 'dark' | 'orange';

export interface AchievementCardOptions {
  player: PlayerProfile;
  unlockedBadges: Badge[];
  totalBadgesCount: number;
  dailyStreakDays?: number;
  language: 'th' | 'en';
  theme?: AchievementCardTheme;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function fillAndStrokeDoodleCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillColor: string,
  shadowOffsetX = 10,
  shadowOffsetY = 12,
  borderWidth = 5
) {
  if (shadowOffsetX !== 0 || shadowOffsetY !== 0) {
    drawRoundedRect(ctx, x + shadowOffsetX, y + shadowOffsetY, w, h, r);
    ctx.fillStyle = '#000000';
    ctx.fill();
  }

  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.fillStyle = fillColor;
  ctx.fill();

  if (borderWidth > 0) {
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
  }
}

function drawTrophyIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Cup body
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy - 14);
  ctx.lineTo(cx + 14, cy - 14);
  ctx.lineTo(cx + 10, cy + 2);
  ctx.quadraticCurveTo(cx, cy + 12, cx - 10, cy + 2);
  ctx.closePath();
  ctx.fill();

  // Handles
  ctx.beginPath();
  ctx.arc(cx - 16, cy - 7, 5, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + 16, cy - 7, 5, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();

  // Stem & Base
  ctx.beginPath();
  ctx.moveTo(cx, cy + 7);
  ctx.lineTo(cx, cy + 16);
  ctx.moveTo(cx - 10, cy + 16);
  ctx.lineTo(cx + 10, cy + 16);
  ctx.stroke();
  ctx.restore();
}

function drawZapIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx + 3, cy - 16);
  ctx.lineTo(cx - 11, cy + 2);
  ctx.lineTo(cx - 1, cy + 2);
  ctx.lineTo(cx - 5, cy + 16);
  ctx.lineTo(cx + 11, cy - 2);
  ctx.lineTo(cx + 1, cy - 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function truncateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let clipped = text;
  while (clipped.length > 1 && ctx.measureText(`${clipped}…`).width > maxWidth) {
    clipped = clipped.slice(0, -1);
  }
  return `${clipped}…`;
}

export async function generateAchievementCardDataUrl(
  options: AchievementCardOptions
): Promise<string> {
  const {
    player,
    unlockedBadges,
    totalBadgesCount,
    dailyStreakDays = 0,
    language,
    theme = 'mint',
  } = options;

  const isThai = language === 'th';

  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Proceed cleanly with fallback system fonts
    }
  }

  const width = 1080;
  const height = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to initialize canvas context');
  }

  const fontStack = isThai
    ? '"IBM Plex Sans Thai", "Plus Jakarta Sans", sans-serif'
    : '"Plus Jakarta Sans", "Antonio", sans-serif';
  const displayFont = isThai
    ? '"IBM Plex Sans Thai", "Antonio", sans-serif'
    : '"Antonio", "Plus Jakarta Sans", sans-serif';

  const palette =
    theme === 'dark'
      ? {
          bg: '#162722',
          dot: 'rgba(255, 255, 255, 0.08)',
          heroFill: '#243b34',
          heroText: '#ffffff',
          heroSub: 'rgba(255, 255, 255, 0.78)',
          accent: '#7cd7a0',
          accentSecondary: '#e85729',
          cardFill: '#ffffff',
          footerText: 'rgba(255, 255, 255, 0.72)',
        }
      : theme === 'orange'
      ? {
          bg: '#fff7f4',
          dot: 'rgba(0, 0, 0, 0.07)',
          heroFill: '#e85729',
          heroText: '#ffffff',
          heroSub: 'rgba(255, 255, 255, 0.88)',
          accent: '#7cd7a0',
          accentSecondary: '#000000',
          cardFill: '#ffffff',
          footerText: 'rgba(0, 0, 0, 0.6)',
        }
      : {
          bg: '#f6f9f6',
          dot: 'rgba(0, 0, 0, 0.07)',
          heroFill: '#7cd7a0',
          heroText: '#000000',
          heroSub: 'rgba(0, 0, 0, 0.72)',
          accent: '#e85729',
          accentSecondary: '#000000',
          cardFill: '#ffffff',
          footerText: 'rgba(0, 0, 0, 0.58)',
        };

  // 1. Background & Subtle Sketchbook Dot Grid
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = palette.dot;
  for (let gx = 28; gx < width; gx += 32) {
    for (let gy = 28; gy < height; gy += 32) {
      ctx.beginPath();
      ctx.arc(gx, gy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const TIER_TH: Record<string, string> = {
    Bronze: 'บรอนซ์',
    Silver: 'ซิลเวอร์',
    Gold: 'โกลด์',
    Diamond: 'ไดมอนด์',
    Pro: 'โปร',
  };

  const RARITY_TH: Record<string, string> = {
    Legendary: 'ตำนาน',
    Epic: 'มหากาพย์',
    Rare: 'หายาก',
    Common: 'ทั่วไป',
  };

  // 2. Outer Brand Header Row
  drawRoundedRect(ctx, 64, 56, 330, 52, 26);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.font = `700 22px ${fontStack}`;
  ctx.fillStyle = '#7cd7a0';
  ctx.textBaseline = 'middle';
  ctx.fillText(isThai ? 'บัตรความสำเร็จ' : 'SMASHCLUB · ACHIEVEMENT', 92, 82);

  ctx.font = `700 22px ${fontStack}`;
  ctx.fillStyle = palette.footerText;
  ctx.textAlign = 'right';
  ctx.fillText(isThai ? 'สถิตินักกีฬา' : 'ATHLETE MILESTONE CARD', width - 64, 82);
  ctx.textAlign = 'left';

  // 3. Hero Athlete & EXP Level Card
  fillAndStrokeDoodleCard(ctx, 64, 134, width - 128, 410, 44, palette.heroFill, 12, 14, 6);

  // Avatar Emblem Circle on left
  ctx.save();
  drawRoundedRect(ctx, 106, 178, 128, 128, 64);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#000000';
  ctx.stroke();

  const displayName = isThai
    ? player.nameTh || player.name || 'กานต์ ธนวัฒน์'
    : player.nameEn || player.name || 'Karn Tanawat';
  const initials = displayName.trim().slice(0, 2).toUpperCase();
  ctx.font = `700 44px ${displayFont}`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText(initials, 170, 244);
  ctx.textAlign = 'left';
  ctx.restore();

  // Player Name & Tier Badge
  ctx.font = `700 44px ${fontStack}`;
  ctx.fillStyle = palette.heroText;
  ctx.fillText(truncateText(ctx, displayName, 480), 262, 206);

  const playstyleText = isThai
    ? player.playstyleTh || 'สายบุกตบสแมชดุดัน'
    : player.playstyleEn || player.playstyle;
  ctx.font = `600 24px ${fontStack}`;
  ctx.fillStyle = palette.heroSub;
  ctx.fillText(truncateText(ctx, playstyleText, 480), 262, 250);

  // Tier pill
  drawRoundedRect(ctx, 262, 276, 236, 40, 20);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.font = `700 18px ${fontStack}`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(
    isThai ? `ระดับ${TIER_TH[player.tier] || player.tier}` : `${player.tier.toUpperCase()} LEAGUE`,
    380,
    297
  );
  ctx.textAlign = 'left';

  // Level Pill on Top-Right of Hero Card
  fillAndStrokeDoodleCard(ctx, width - 294, 174, 186, 134, 30, '#ffffff', 6, 8, 5);
  ctx.font = `700 20px ${fontStack}`;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.textAlign = 'center';
  ctx.fillText(isThai ? 'ระดับเลเวล' : 'EXP LEVEL', width - 201, 204);

  ctx.font = `700 68px ${displayFont}`;
  ctx.fillStyle = '#000000';
  ctx.fillText(isThai ? `ล.${player.level}` : `LV.${player.level}`, width - 201, 262);
  ctx.textAlign = 'left';

  // Current EXP Progress Box inside Hero Card
  fillAndStrokeDoodleCard(ctx, 106, 344, width - 212, 160, 28, '#ffffff', 6, 6, 4);

  drawZapIcon(ctx, 148, 392, '#e85729');
  ctx.font = `700 24px ${fontStack}`;
  ctx.fillStyle = '#000000';
  ctx.fillText(isThai ? 'คะแนนประสบการณ์สะสม' : 'CURRENT XP PROGRESS', 176, 392);

  const expPct = Math.min(100, Math.round((player.currentExp / Math.max(1, player.nextLevelExp)) * 100));
  ctx.font = `700 28px ${displayFont}`;
  ctx.textAlign = 'right';
  ctx.fillStyle = '#15803d';
  ctx.fillText(
    isThai
      ? `${player.currentExp.toLocaleString()} / ${player.nextLevelExp.toLocaleString()} คะแนน (${expPct}%)`
      : `${player.currentExp.toLocaleString()} / ${player.nextLevelExp.toLocaleString()} XP (${expPct}%)`,
    width - 138,
    392
  );
  ctx.textAlign = 'left';

  // Progress Track
  const trackX = 138;
  const trackY = 434;
  const trackW = width - 276;
  const trackH = 38;
  drawRoundedRect(ctx, trackX, trackY, trackW, trackH, 19);
  ctx.fillStyle = '#e5e7eb';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#000000';
  ctx.stroke();

  const fillW = Math.max(36, Math.round((trackW * expPct) / 100));
  drawRoundedRect(ctx, trackX, trackY, fillW, trackH, 19);
  ctx.fillStyle = theme === 'orange' ? '#e85729' : '#7cd7a0';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#000000';
  ctx.stroke();

  // 4. Two KPI Metric Tiles (Recent Trophy Count + Streak / Top Smash)
  const tileY = 580;
  const tileW = (width - 128 - 28) / 2;
  const tileH = 216;

  // Tile 1: Unlocked Trophy Count
  fillAndStrokeDoodleCard(ctx, 64, tileY, tileW, tileH, 36, '#ffffff', 10, 12, 5);
  drawRoundedRect(ctx, 96, tileY + 28, 64, 64, 32);
  ctx.fillStyle = '#7cd7a0';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#000000';
  ctx.stroke();
  drawTrophyIcon(ctx, 128, tileY + 60, '#000000');

  ctx.font = `700 22px ${fontStack}`;
  ctx.fillStyle = 'rgba(0,0,0,0.62)';
  ctx.fillText(isThai ? 'เหรียญรางวัลที่ปลดล็อก' : 'TROPHIES UNLOCKED', 180, tileY + 50);

  ctx.font = `700 62px ${displayFont}`;
  ctx.fillStyle = '#000000';
  ctx.fillText(`${unlockedBadges.length}`, 180, tileY + 106);

  ctx.font = `700 24px ${fontStack}`;
  ctx.fillStyle = '#15803d';
  ctx.fillText(
    isThai ? `จากทั้งหมด ${totalBadgesCount} เหรียญ` : `of ${totalBadgesCount} earned`,
    180,
    tileY + 158
  );

  // Tile 2: Match & Smash Record + Streak
  const tile2X = 64 + tileW + 28;
  fillAndStrokeDoodleCard(ctx, tile2X, tileY, tileW, tileH, 36, '#ffffff', 10, 12, 5);

  ctx.font = `700 22px ${fontStack}`;
  ctx.fillStyle = 'rgba(0,0,0,0.62)';
  ctx.fillText(
    isThai ? 'ผลงานสนาม & สตรีค' : 'COURT RECORD & STREAK',
    tile2X + 34,
    tileY + 46
  );

  ctx.font = `700 44px ${displayFont}`;
  ctx.fillStyle = '#000000';
  ctx.fillText(
    isThai ? `ชนะ ${player.stats.winRate}%` : `${player.stats.winRate}% WIN`,
    tile2X + 34,
    tileY + 102
  );

  ctx.font = `700 24px ${fontStack}`;
  ctx.fillStyle = '#e85729';
  ctx.fillText(
    isThai
      ? `สตรีค ${dailyStreakDays} วัน · ตบ ${player.stats.highestSmashSpeedKmh} กม./ชม.`
      : `${dailyStreakDays}d Streak · ${player.stats.highestSmashSpeedKmh} km/h`,
    tile2X + 34,
    tileY + 158
  );

  // 5. Recent Trophies Showcase Box
  const recentsY = 832;
  const recentsH = 398;
  fillAndStrokeDoodleCard(ctx, 64, recentsY, width - 128, recentsH, 40, '#ffffff', 10, 12, 5);

  ctx.font = `700 28px ${fontStack}`;
  ctx.fillStyle = '#000000';
  ctx.fillText(isThai ? 'เหรียญรางวัลล่าสุดของฉัน' : 'RECENT TROPHY HIGHLIGHTS', 102, recentsY + 52);

  drawRoundedRect(ctx, width - 294, recentsY + 28, 194, 44, 22);
  ctx.fillStyle = '#e85729';
  ctx.fill();
  ctx.font = `700 20px ${fontStack}`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(
    isThai ? `สะสมแล้ว ${unlockedBadges.length} ชิ้น` : `${unlockedBadges.length} UNLOCKED`,
    width - 197,
    recentsY + 51
  );
  ctx.textAlign = 'left';

  const recentThree = unlockedBadges.slice(0, 3);
  if (recentThree.length === 0) {
    ctx.font = `600 24px ${fontStack}`;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText(
      isThai ? 'เริ่มลงสนามเพื่อปลดล็อกเหรียญรางวัลแรก!' : 'Play matches to unlock your first trophy!',
      width / 2,
      recentsY + 220
    );
    ctx.textAlign = 'left';
  } else {
    recentThree.forEach((badge, idx) => {
      const rowY = recentsY + 96 + idx * 94;
      drawRoundedRect(ctx, 102, rowY, width - 204, 78, 22);
      ctx.fillStyle = '#f4f8fb';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.stroke();

      // Mini green trophy icon circle
      drawRoundedRect(ctx, 122, rowY + 15, 48, 48, 24);
      ctx.fillStyle = '#7cd7a0';
      ctx.fill();
      drawTrophyIcon(ctx, 146, rowY + 39, '#000000');

      // Badge title & timestamp
      const badgeTitle = isThai ? badge.thaiName || badge.name : badge.name;
      ctx.font = `700 24px ${fontStack}`;
      ctx.fillStyle = '#000000';
      ctx.fillText(truncateText(ctx, badgeTitle, 470), 190, rowY + 32);

      const badgeTime = badge.unlockedAt || (isThai ? 'ปลดล็อกแล้ว' : 'Unlocked');
      ctx.font = `600 18px ${fontStack}`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
      ctx.fillText(truncateText(ctx, badgeTime, 470), 190, rowY + 58);

      // Rarity pill on right
      const rarityBg =
        badge.rarity === 'Legendary'
          ? '#e85729'
          : badge.rarity === 'Epic'
          ? '#000000'
          : '#7cd7a0';
      const rarityFg = badge.rarity === 'Rare' || badge.rarity === 'Common' ? '#000000' : '#ffffff';

      drawRoundedRect(ctx, width - 296, rowY + 19, 168, 40, 20);
      ctx.fillStyle = rarityBg;
      ctx.fill();
      ctx.font = `700 18px ${fontStack}`;
      ctx.fillStyle = rarityFg;
      ctx.textAlign = 'center';
      ctx.fillText(
        isThai ? RARITY_TH[badge.rarity] || badge.rarity : badge.rarity.toUpperCase(),
        width - 212,
        rowY + 40
      );
      ctx.textAlign = 'left';
    });
  }

  // 6. Footer Watermark
  ctx.font = `700 20px ${fontStack}`;
  ctx.fillStyle = palette.footerText;
  ctx.fillText(
    isThai ? 'บันทึกสถิติสนามแบด · 2026' : 'SMASHCLUB AI · BWF COURT MASTER 2026',
    64,
    1286
  );

  ctx.textAlign = 'right';
  ctx.fillText(
    isThai
      ? `${player.stats.totalMatches} แมตช์ · ${player.stats.totalPlayHours} ชม.`
      : `${player.stats.totalMatches} Matches · ${player.stats.totalPlayHours}h`,
    width - 64,
    1286
  );
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}
