import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Check, Cloud } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DoodleAvatar } from '../common/DoodleAvatar';
import { computeHistoricalMatchStats } from '../../utils/matchHistoryUtils';
import { playSelectSound } from '../../utils/retroAudio';

type WindowRange = 'last10' | 'last20';

interface SplitRow {
  labelTh: string;
  labelEn: string;
  leftAll: number | string;
  leftSingles: number | string;
  leftDoubles: number | string;
  rightAll: number | string;
  rightSingles: number | string;
  rightDoubles: number | string;
  highlightLeft?: 'all' | 'singles' | 'doubles';
  highlightRight?: 'all' | 'singles' | 'doubles';
}

interface StandingRow {
  typeTh: string;
  typeEn: string;
  played: number;
  win: number;
  loss: number;
  scored: number;
  conceded: number;
  diff: number;
  rank: number | null;
  winPct: number;
}

interface H2HMatchItem {
  id: string;
  date: string;
  league: string;
  format: 'Singles' | 'Doubles';
  leftNameTh: string;
  leftNameEn: string;
  rightNameTh: string;
  rightNameEn: string;
  leftSet1: number;
  rightSet1: number;
  leftTotal: number;
  rightTotal: number;
  leftWon: boolean;
}

interface ComparisonProfile {
  id: string;
  nameTh: string;
  nameEn: string;
  tierTh: string;
  tierEn: string;
  avatarPreset: 'ohm' | 'top' | 'bank' | 'ploy';
  scoredAvg: Record<WindowRange, SplitRow[]>;
  concededAvg: Record<WindowRange, SplitRow[]>;
  totalPointsDist: Record<WindowRange, SplitRow[]>;
  firstSetDist: Record<WindowRange, SplitRow[]>;
  userStandings: StandingRow[];
  opponentStandings: StandingRow[];
  h2hMatches: H2HMatchItem[];
  userRecentMatches: H2HMatchItem[];
  opponentRecentMatches: H2HMatchItem[];
}

const COMPARISON_PROFILES: ComparisonProfile[] = [
  {
    id: 'ohm',
    nameTh: 'โอห์ม ปืนกล',
    nameEn: 'Ohm Machinegun',
    tierTh: 'ลีกไดมอนด์',
    tierEn: 'Diamond League',
    avatarPreset: 'ohm',
    scoredAvg: {
      last10: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 10, leftSingles: 6, leftDoubles: 4, rightAll: 10, rightSingles: 5, rightDoubles: 5 },
        { labelTh: 'เซต 1', labelEn: 'Set 1', leftAll: 19.4, leftSingles: 19.8, leftDoubles: 18.8, rightAll: 20.1, rightSingles: 20.6, rightDoubles: 19.6 },
        { labelTh: 'เซต 2', labelEn: 'Set 2', leftAll: 18.9, leftSingles: 19.2, leftDoubles: 18.5, rightAll: 18.4, rightSingles: 17.8, rightDoubles: 19.0 },
        { labelTh: 'เซต 3', labelEn: 'Set 3', leftAll: 20.2, leftSingles: 20.5, leftDoubles: 19.7, rightAll: 16.8, rightSingles: 15.2, rightDoubles: 18.4 },
        { labelTh: 'ดิวซ์', labelEn: 'Deuce', leftAll: 2.4, leftSingles: 2.5, leftDoubles: 2.2, rightAll: 1.8, rightSingles: 2.0, rightDoubles: 1.6 },
        { labelTh: 'เต็มเกม', labelEn: 'Full', leftAll: 46.2, leftSingles: 48.1, leftDoubles: 43.4, rightAll: 44.8, rightSingles: 43.9, rightDoubles: 45.7, highlightLeft: 'singles', highlightRight: 'doubles' },
      ],
      last20: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 20, leftSingles: 12, leftDoubles: 8, rightAll: 20, rightSingles: 11, rightDoubles: 9 },
        { labelTh: 'เซต 1', labelEn: 'Set 1', leftAll: 19.1, leftSingles: 19.5, leftDoubles: 18.5, rightAll: 19.4, rightSingles: 19.8, rightDoubles: 18.9 },
        { labelTh: 'เซต 2', labelEn: 'Set 2', leftAll: 18.7, leftSingles: 19.0, leftDoubles: 18.3, rightAll: 18.1, rightSingles: 17.6, rightDoubles: 18.7 },
        { labelTh: 'เซต 3', labelEn: 'Set 3', leftAll: 19.8, leftSingles: 20.1, leftDoubles: 19.4, rightAll: 16.5, rightSingles: 15.8, rightDoubles: 17.3 },
        { labelTh: 'ดิวซ์', labelEn: 'Deuce', leftAll: 2.1, leftSingles: 2.3, leftDoubles: 1.9, rightAll: 1.6, rightSingles: 1.8, rightDoubles: 1.4 },
        { labelTh: 'เต็มเกม', labelEn: 'Full', leftAll: 45.3, leftSingles: 47.0, leftDoubles: 42.8, rightAll: 43.9, rightSingles: 43.1, rightDoubles: 44.9, highlightLeft: 'singles', highlightRight: 'doubles' },
      ],
    },
    concededAvg: {
      last10: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 10, leftSingles: 6, leftDoubles: 4, rightAll: 10, rightSingles: 5, rightDoubles: 5 },
        { labelTh: 'เซต 1', labelEn: 'Set 1', leftAll: 16.8, leftSingles: 16.4, leftDoubles: 17.4, rightAll: 18.2, rightSingles: 17.6, rightDoubles: 18.8 },
        { labelTh: 'เซต 2', labelEn: 'Set 2', leftAll: 16.1, leftSingles: 15.9, leftDoubles: 16.5, rightAll: 18.6, rightSingles: 18.0, rightDoubles: 19.2 },
        { labelTh: 'เซต 3', labelEn: 'Set 3', leftAll: 15.4, leftSingles: 15.1, leftDoubles: 15.9, rightAll: 19.0, rightSingles: 18.4, rightDoubles: 19.6 },
        { labelTh: 'ดิวซ์', labelEn: 'Deuce', leftAll: 1.2, leftSingles: 1.4, leftDoubles: 0.9, rightAll: 2.2, rightSingles: 2.0, rightDoubles: 2.4 },
        { labelTh: 'เต็มเกม', labelEn: 'Full', leftAll: 38.6, leftSingles: 38.2, leftDoubles: 39.4, rightAll: 45.9, rightSingles: 44.2, rightDoubles: 47.6, highlightLeft: 'doubles', highlightRight: 'doubles' },
      ],
      last20: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 20, leftSingles: 12, leftDoubles: 8, rightAll: 20, rightSingles: 11, rightDoubles: 9 },
        { labelTh: 'เซต 1', labelEn: 'Set 1', leftAll: 17.0, leftSingles: 16.7, leftDoubles: 17.5, rightAll: 18.0, rightSingles: 17.4, rightDoubles: 18.7 },
        { labelTh: 'เซต 2', labelEn: 'Set 2', leftAll: 16.4, leftSingles: 16.2, leftDoubles: 16.8, rightAll: 18.3, rightSingles: 17.9, rightDoubles: 18.9 },
        { labelTh: 'เซต 3', labelEn: 'Set 3', leftAll: 15.8, leftSingles: 15.5, leftDoubles: 16.2, rightAll: 18.7, rightSingles: 18.1, rightDoubles: 19.4 },
        { labelTh: 'ดิวซ์', labelEn: 'Deuce', leftAll: 1.3, leftSingles: 1.4, leftDoubles: 1.1, rightAll: 2.0, rightSingles: 1.9, rightDoubles: 2.2 },
        { labelTh: 'เต็มเกม', labelEn: 'Full', leftAll: 39.2, leftSingles: 38.8, leftDoubles: 39.8, rightAll: 45.1, rightSingles: 43.8, rightDoubles: 46.7, highlightLeft: 'doubles', highlightRight: 'doubles' },
      ],
    },
    totalPointsDist: {
      last10: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 10, leftSingles: 6, leftDoubles: 4, rightAll: 10, rightSingles: 5, rightDoubles: 5 },
        { labelTh: '35-', labelEn: '35-', leftAll: 0, leftSingles: 0, leftDoubles: 0, rightAll: 1, rightSingles: 1, rightDoubles: 0 },
        { labelTh: '36-40', labelEn: '36-40', leftAll: 2, leftSingles: 1, leftDoubles: 1, rightAll: 2, rightSingles: 1, rightDoubles: 1 },
        { labelTh: '41-45', labelEn: '41-45', leftAll: 4, leftSingles: 2, leftDoubles: 2, rightAll: 3, rightSingles: 2, rightDoubles: 1 },
        { labelTh: '46-50', labelEn: '46-50', leftAll: 1, leftSingles: 1, leftDoubles: 0, rightAll: 1, rightSingles: 0, rightDoubles: 1 },
        { labelTh: '51-55', labelEn: '51-55', leftAll: 1, leftSingles: 1, leftDoubles: 0, rightAll: 2, rightSingles: 1, rightDoubles: 1 },
        { labelTh: '56-60', labelEn: '56-60', leftAll: 2, leftSingles: 1, leftDoubles: 1, rightAll: 1, rightSingles: 0, rightDoubles: 1 },
        { labelTh: '61+', labelEn: '61+', leftAll: 0, leftSingles: 0, leftDoubles: 0, rightAll: 0, rightSingles: 0, rightDoubles: 0 },
      ],
      last20: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 20, leftSingles: 12, leftDoubles: 8, rightAll: 20, rightSingles: 11, rightDoubles: 9 },
        { labelTh: '35-', labelEn: '35-', leftAll: 1, leftSingles: 1, leftDoubles: 0, rightAll: 2, rightSingles: 2, rightDoubles: 0 },
        { labelTh: '36-40', labelEn: '36-40', leftAll: 4, leftSingles: 2, leftDoubles: 2, rightAll: 5, rightSingles: 3, rightDoubles: 2 },
        { labelTh: '41-45', labelEn: '41-45', leftAll: 7, leftSingles: 4, leftDoubles: 3, rightAll: 5, rightSingles: 3, rightDoubles: 2 },
        { labelTh: '46-50', labelEn: '46-50', leftAll: 3, leftSingles: 2, leftDoubles: 1, rightAll: 3, rightSingles: 1, rightDoubles: 2 },
        { labelTh: '51-55', labelEn: '51-55', leftAll: 2, leftSingles: 1, leftDoubles: 1, rightAll: 3, rightSingles: 2, rightDoubles: 1 },
        { labelTh: '56-60', labelEn: '56-60', leftAll: 3, leftSingles: 2, leftDoubles: 1, rightAll: 2, rightSingles: 0, rightDoubles: 2 },
        { labelTh: '61+', labelEn: '61+', leftAll: 0, leftSingles: 0, leftDoubles: 0, rightAll: 0, rightSingles: 0, rightDoubles: 0 },
      ],
    },
    firstSetDist: {
      last10: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 10, leftSingles: 6, leftDoubles: 4, rightAll: 10, rightSingles: 5, rightDoubles: 5 },
        { labelTh: '12-', labelEn: '12-', leftAll: 0, leftSingles: 0, leftDoubles: 0, rightAll: 1, rightSingles: 1, rightDoubles: 0 },
        { labelTh: '13-15', labelEn: '13-15', leftAll: 1, leftSingles: 1, leftDoubles: 0, rightAll: 1, rightSingles: 0, rightDoubles: 1 },
        { labelTh: '16-18', labelEn: '16-18', leftAll: 2, leftSingles: 1, leftDoubles: 1, rightAll: 3, rightSingles: 2, rightDoubles: 1 },
        { labelTh: '19-21', labelEn: '19-21', leftAll: 6, leftSingles: 3, leftDoubles: 3, rightAll: 4, rightSingles: 2, rightDoubles: 2 },
        { labelTh: '22+', labelEn: '22+', leftAll: 1, leftSingles: 1, leftDoubles: 0, rightAll: 1, rightSingles: 0, rightDoubles: 1 },
      ],
      last20: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 20, leftSingles: 12, leftDoubles: 8, rightAll: 20, rightSingles: 11, rightDoubles: 9 },
        { labelTh: '12-', labelEn: '12-', leftAll: 0, leftSingles: 0, leftDoubles: 0, rightAll: 2, rightSingles: 1, rightDoubles: 1 },
        { labelTh: '13-15', labelEn: '13-15', leftAll: 2, leftSingles: 1, leftDoubles: 1, rightAll: 3, rightSingles: 2, rightDoubles: 1 },
        { labelTh: '16-18', labelEn: '16-18', leftAll: 4, leftSingles: 2, leftDoubles: 2, rightAll: 6, rightSingles: 3, rightDoubles: 3 },
        { labelTh: '19-21', labelEn: '19-21', leftAll: 12, leftSingles: 7, leftDoubles: 5, rightAll: 7, rightSingles: 4, rightDoubles: 3 },
        { labelTh: '22+', labelEn: '22+', leftAll: 2, leftSingles: 2, leftDoubles: 0, rightAll: 2, rightSingles: 1, rightDoubles: 1 },
      ],
    },
    userStandings: [
      { typeTh: 'ทั้งหมด', typeEn: 'All', played: 14, win: 11, loss: 3, scored: 46.2, conceded: 38.6, diff: 7.6, rank: 1, winPct: 79 },
      { typeTh: 'เดี่ยว', typeEn: 'Singles', played: 8, win: 6, loss: 2, scored: 48.1, conceded: 38.2, diff: 9.9, rank: 1, winPct: 75 },
      { typeTh: 'คู่', typeEn: 'Doubles', played: 6, win: 5, loss: 1, scored: 43.4, conceded: 39.4, diff: 4.0, rank: 2, winPct: 83 },
      { typeTh: '10 นัดล่าสุด', typeEn: 'Last 10', played: 10, win: 8, loss: 2, scored: 46.2, conceded: 38.6, diff: 7.6, rank: null, winPct: 80 },
    ],
    opponentStandings: [
      { typeTh: 'ทั้งหมด', typeEn: 'All', played: 14, win: 8, loss: 6, scored: 44.8, conceded: 45.9, diff: -1.1, rank: 4, winPct: 57 },
      { typeTh: 'เดี่ยว', typeEn: 'Singles', played: 7, win: 4, loss: 3, scored: 43.9, conceded: 44.2, diff: -0.3, rank: 5, winPct: 57 },
      { typeTh: 'คู่', typeEn: 'Doubles', played: 7, win: 4, loss: 3, scored: 45.7, conceded: 47.6, diff: -1.9, rank: 4, winPct: 57 },
      { typeTh: '10 นัดล่าสุด', typeEn: 'Last 10', played: 10, win: 5, loss: 5, scored: 44.8, conceded: 45.9, diff: -1.1, rank: null, winPct: 50 },
    ],
    h2hMatches: [
      { id: 'h2h_1', date: '07/11/2026', league: 'Rama 9 League', format: 'Singles', leftNameTh: 'กานต์ ธนวัฒน์', leftNameEn: 'Karn Tanawat', rightNameTh: 'โอห์ม ปืนกล', rightNameEn: 'Ohm Machinegun', leftSet1: 21, rightSet1: 18, leftTotal: 61, rightTotal: 58, leftWon: true },
      { id: 'h2h_2', date: '24/10/2026', league: 'Friday Clash', format: 'Doubles', leftNameTh: 'โอห์ม & แบงค์', leftNameEn: 'Ohm & Bank', rightNameTh: 'กานต์ & พลอย', rightNameEn: 'Karn & Ploy', leftSet1: 16, rightSet1: 21, leftTotal: 35, rightTotal: 42, leftWon: true },
      { id: 'h2h_3', date: '11/10/2026', league: 'Rama 9 League', format: 'Singles', leftNameTh: 'กานต์ ธนวัฒน์', leftNameEn: 'Karn Tanawat', rightNameTh: 'โอห์ม ปืนกล', rightNameEn: 'Ohm Machinegun', leftSet1: 19, rightSet1: 21, leftTotal: 55, rightTotal: 60, leftWon: false },
      { id: 'h2h_4', date: '28/09/2026', league: 'Club Open', format: 'Singles', leftNameTh: 'กานต์ ธนวัฒน์', leftNameEn: 'Karn Tanawat', rightNameTh: 'โอห์ม ปืนกล', rightNameEn: 'Ohm Machinegun', leftSet1: 21, rightSet1: 15, leftTotal: 42, rightTotal: 32, leftWon: true },
      { id: 'h2h_5', date: '14/09/2026', league: 'BKK Night', format: 'Doubles', leftNameTh: 'กานต์ & ท็อป', leftNameEn: 'Karn & Top', rightNameTh: 'โอห์ม & อาร์ท', rightNameEn: 'Ohm & Art', leftSet1: 21, rightSet1: 19, leftTotal: 43, rightTotal: 39, leftWon: true },
      { id: 'h2h_6', date: '02/09/2026', league: 'Rama 9 League', format: 'Singles', leftNameTh: 'โอห์ม ปืนกล', leftNameEn: 'Ohm Machinegun', rightNameTh: 'กานต์ ธนวัฒน์', rightNameEn: 'Karn Tanawat', leftSet1: 21, rightSet1: 14, leftTotal: 42, rightTotal: 31, leftWon: false },
    ],
    userRecentMatches: [
      { id: 'ur_1', date: '07/11/2026', league: 'Rama 9 League', format: 'Singles', leftNameTh: 'กานต์ ธนวัฒน์', leftNameEn: 'Karn Tanawat', rightNameTh: 'โอห์ม ปืนกล', rightNameEn: 'Ohm Machinegun', leftSet1: 21, rightSet1: 18, leftTotal: 61, rightTotal: 58, leftWon: true },
      { id: 'ur_2', date: '05/11/2026', league: 'Friday Clash', format: 'Doubles', leftNameTh: 'กานต์ & พลอย', leftNameEn: 'Karn & Ploy', rightNameTh: 'แบงค์ & ท็อป', rightNameEn: 'Bank & Top', leftSet1: 21, rightSet1: 15, leftTotal: 42, rightTotal: 32, leftWon: true },
      { id: 'ur_3', date: '02/11/2026', league: 'Club Open', format: 'Singles', leftNameTh: 'กานต์ ธนวัฒน์', leftNameEn: 'Karn Tanawat', rightNameTh: 'อาร์ท สปีด', rightNameEn: 'Art Speedster', leftSet1: 17, rightSet1: 21, leftTotal: 56, rightTotal: 58, leftWon: false },
      { id: 'ur_4', date: '28/10/2026', league: 'BKK Night', format: 'Doubles', leftNameTh: 'กานต์ & โอห์ม', leftNameEn: 'Karn & Ohm', rightNameTh: 'มีน & นัท', rightNameEn: 'Meen & Nat', leftSet1: 21, rightSet1: 12, leftTotal: 42, rightTotal: 26, leftWon: true },
    ],
    opponentRecentMatches: [
      { id: 'or_1', date: '07/11/2026', league: 'Rama 9 League', format: 'Singles', leftNameTh: 'โอห์ม ปืนกล', leftNameEn: 'Ohm Machinegun', rightNameTh: 'กานต์ ธนวัฒน์', rightNameEn: 'Karn Tanawat', leftSet1: 18, rightSet1: 21, leftTotal: 58, rightTotal: 61, leftWon: false },
      { id: 'or_2', date: '04/11/2026', league: 'Friday Clash', format: 'Singles', leftNameTh: 'โอห์ม ปืนกล', leftNameEn: 'Ohm Machinegun', rightNameTh: 'นัท คอร์ทไว', rightNameEn: 'Nat Fastcourt', leftSet1: 21, rightSet1: 14, leftTotal: 42, rightTotal: 29, leftWon: true },
      { id: 'or_3', date: '30/10/2026', league: 'BKK Night', format: 'Doubles', leftNameTh: 'โอห์ม & แบงค์', leftNameEn: 'Ohm & Bank', rightNameTh: 'ท็อป & มิกซ์', rightNameEn: 'Top & Mix', leftSet1: 21, rightSet1: 19, leftTotal: 43, rightTotal: 38, leftWon: true },
      { id: 'or_4', date: '25/10/2026', league: 'Club Open', format: 'Singles', leftNameTh: 'โอห์ม ปืนกล', leftNameEn: 'Ohm Machinegun', rightNameTh: 'อาร์ท สปีด', rightNameEn: 'Art Speedster', leftSet1: 16, rightSet1: 21, leftTotal: 34, rightTotal: 42, leftWon: false },
    ],
  },
  {
    id: 'art',
    nameTh: 'อาร์ท สปีด',
    nameEn: 'Art Speedster',
    tierTh: 'ลีกไดมอนด์',
    tierEn: 'Diamond League',
    avatarPreset: 'top',
    scoredAvg: {
      last10: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 10, leftSingles: 6, leftDoubles: 4, rightAll: 10, rightSingles: 7, rightDoubles: 3 },
        { labelTh: 'เซต 1', labelEn: 'Set 1', leftAll: 19.4, leftSingles: 19.8, leftDoubles: 18.8, rightAll: 19.9, rightSingles: 20.4, rightDoubles: 18.7 },
        { labelTh: 'เซต 2', labelEn: 'Set 2', leftAll: 18.9, leftSingles: 19.2, leftDoubles: 18.5, rightAll: 19.3, rightSingles: 19.7, rightDoubles: 18.4 },
        { labelTh: 'เซต 3', labelEn: 'Set 3', leftAll: 20.2, leftSingles: 20.5, leftDoubles: 19.7, rightAll: 18.9, rightSingles: 19.4, rightDoubles: 17.8 },
        { labelTh: 'ดิวซ์', labelEn: 'Deuce', leftAll: 2.4, leftSingles: 2.5, leftDoubles: 2.2, rightAll: 2.6, rightSingles: 2.8, rightDoubles: 2.1 },
        { labelTh: 'เต็มเกม', labelEn: 'Full', leftAll: 46.2, leftSingles: 48.1, leftDoubles: 43.4, rightAll: 47.4, rightSingles: 49.2, rightDoubles: 43.1, highlightLeft: 'singles', highlightRight: 'singles' },
      ],
      last20: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 20, leftSingles: 12, leftDoubles: 8, rightAll: 20, rightSingles: 13, rightDoubles: 7 },
        { labelTh: 'เซต 1', labelEn: 'Set 1', leftAll: 19.1, leftSingles: 19.5, leftDoubles: 18.5, rightAll: 19.5, rightSingles: 20.0, rightDoubles: 18.6 },
        { labelTh: 'เซต 2', labelEn: 'Set 2', leftAll: 18.7, leftSingles: 19.0, leftDoubles: 18.3, rightAll: 19.0, rightSingles: 19.4, rightDoubles: 18.2 },
        { labelTh: 'เซต 3', labelEn: 'Set 3', leftAll: 19.8, leftSingles: 20.1, leftDoubles: 19.4, rightAll: 18.5, rightSingles: 19.0, rightDoubles: 17.6 },
        { labelTh: 'ดิวซ์', labelEn: 'Deuce', leftAll: 2.1, leftSingles: 2.3, leftDoubles: 1.9, rightAll: 2.3, rightSingles: 2.5, rightDoubles: 1.9 },
        { labelTh: 'เต็มเกม', labelEn: 'Full', leftAll: 45.3, leftSingles: 47.0, leftDoubles: 42.8, rightAll: 46.6, rightSingles: 48.2, rightDoubles: 43.5, highlightLeft: 'singles', highlightRight: 'singles' },
      ],
    },
    concededAvg: {
      last10: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 10, leftSingles: 6, leftDoubles: 4, rightAll: 10, rightSingles: 7, rightDoubles: 3 },
        { labelTh: 'เซต 1', labelEn: 'Set 1', leftAll: 16.8, leftSingles: 16.4, leftDoubles: 17.4, rightAll: 17.2, rightSingles: 16.9, rightDoubles: 17.9 },
        { labelTh: 'เซต 2', labelEn: 'Set 2', leftAll: 16.1, leftSingles: 15.9, leftDoubles: 16.5, rightAll: 17.4, rightSingles: 17.0, rightDoubles: 18.3 },
        { labelTh: 'เซต 3', labelEn: 'Set 3', leftAll: 15.4, leftSingles: 15.1, leftDoubles: 15.9, rightAll: 16.8, rightSingles: 16.4, rightDoubles: 17.7 },
        { labelTh: 'ดิวซ์', labelEn: 'Deuce', leftAll: 1.2, leftSingles: 1.4, leftDoubles: 0.9, rightAll: 1.9, rightSingles: 1.7, rightDoubles: 2.3 },
        { labelTh: 'เต็มเกม', labelEn: 'Full', leftAll: 38.6, leftSingles: 38.2, leftDoubles: 39.4, rightAll: 40.8, rightSingles: 39.9, rightDoubles: 42.9, highlightLeft: 'doubles', highlightRight: 'doubles' },
      ],
      last20: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 20, leftSingles: 12, leftDoubles: 8, rightAll: 20, rightSingles: 13, rightDoubles: 7 },
        { labelTh: 'เซต 1', labelEn: 'Set 1', leftAll: 17.0, leftSingles: 16.7, leftDoubles: 17.5, rightAll: 17.5, rightSingles: 17.1, rightDoubles: 18.2 },
        { labelTh: 'เซต 2', labelEn: 'Set 2', leftAll: 16.4, leftSingles: 16.2, leftDoubles: 16.8, rightAll: 17.6, rightSingles: 17.2, rightDoubles: 18.4 },
        { labelTh: 'เซต 3', labelEn: 'Set 3', leftAll: 15.8, leftSingles: 15.5, leftDoubles: 16.2, rightAll: 17.0, rightSingles: 16.6, rightDoubles: 17.8 },
        { labelTh: 'ดิวซ์', labelEn: 'Deuce', leftAll: 1.3, leftSingles: 1.4, leftDoubles: 1.1, rightAll: 1.8, rightSingles: 1.6, rightDoubles: 2.1 },
        { labelTh: 'เต็มเกม', labelEn: 'Full', leftAll: 39.2, leftSingles: 38.8, leftDoubles: 39.8, rightAll: 41.2, rightSingles: 40.3, rightDoubles: 42.9, highlightLeft: 'doubles', highlightRight: 'doubles' },
      ],
    },
    totalPointsDist: {
      last10: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 10, leftSingles: 6, leftDoubles: 4, rightAll: 10, rightSingles: 7, rightDoubles: 3 },
        { labelTh: '35-', labelEn: '35-', leftAll: 0, leftSingles: 0, leftDoubles: 0, rightAll: 0, rightSingles: 0, rightDoubles: 0 },
        { labelTh: '36-40', labelEn: '36-40', leftAll: 2, leftSingles: 1, leftDoubles: 1, rightAll: 1, rightSingles: 1, rightDoubles: 0 },
        { labelTh: '41-45', labelEn: '41-45', leftAll: 4, leftSingles: 2, leftDoubles: 2, rightAll: 4, rightSingles: 3, rightDoubles: 1 },
        { labelTh: '46-50', labelEn: '46-50', leftAll: 1, leftSingles: 1, leftDoubles: 0, rightAll: 2, rightSingles: 1, rightDoubles: 1 },
        { labelTh: '51-55', labelEn: '51-55', leftAll: 1, leftSingles: 1, leftDoubles: 0, rightAll: 1, rightSingles: 1, rightDoubles: 0 },
        { labelTh: '56-60', labelEn: '56-60', leftAll: 2, leftSingles: 1, leftDoubles: 1, rightAll: 2, rightSingles: 1, rightDoubles: 1 },
        { labelTh: '61+', labelEn: '61+', leftAll: 0, leftSingles: 0, leftDoubles: 0, rightAll: 0, rightSingles: 0, rightDoubles: 0 },
      ],
      last20: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 20, leftSingles: 12, leftDoubles: 8, rightAll: 20, rightSingles: 13, rightDoubles: 7 },
        { labelTh: '35-', labelEn: '35-', leftAll: 1, leftSingles: 1, leftDoubles: 0, rightAll: 1, rightSingles: 1, rightDoubles: 0 },
        { labelTh: '36-40', labelEn: '36-40', leftAll: 4, leftSingles: 2, leftDoubles: 2, rightAll: 3, rightSingles: 2, rightDoubles: 1 },
        { labelTh: '41-45', labelEn: '41-45', leftAll: 7, leftSingles: 4, leftDoubles: 3, rightAll: 7, rightSingles: 5, rightDoubles: 2 },
        { labelTh: '46-50', labelEn: '46-50', leftAll: 3, leftSingles: 2, leftDoubles: 1, rightAll: 4, rightSingles: 2, rightDoubles: 2 },
        { labelTh: '51-55', labelEn: '51-55', leftAll: 2, leftSingles: 1, leftDoubles: 1, rightAll: 2, rightSingles: 1, rightDoubles: 1 },
        { labelTh: '56-60', labelEn: '56-60', leftAll: 3, leftSingles: 2, leftDoubles: 1, rightAll: 3, rightSingles: 2, rightDoubles: 1 },
        { labelTh: '61+', labelEn: '61+', leftAll: 0, leftSingles: 0, leftDoubles: 0, rightAll: 0, rightSingles: 0, rightDoubles: 0 },
      ],
    },
    firstSetDist: {
      last10: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 10, leftSingles: 6, leftDoubles: 4, rightAll: 10, rightSingles: 7, rightDoubles: 3 },
        { labelTh: '12-', labelEn: '12-', leftAll: 0, leftSingles: 0, leftDoubles: 0, rightAll: 0, rightSingles: 0, rightDoubles: 0 },
        { labelTh: '13-15', labelEn: '13-15', leftAll: 1, leftSingles: 1, leftDoubles: 0, rightAll: 1, rightSingles: 0, rightDoubles: 1 },
        { labelTh: '16-18', labelEn: '16-18', leftAll: 2, leftSingles: 1, leftDoubles: 1, rightAll: 2, rightSingles: 1, rightDoubles: 1 },
        { labelTh: '19-21', labelEn: '19-21', leftAll: 6, leftSingles: 3, leftDoubles: 3, rightAll: 5, rightSingles: 4, rightDoubles: 1 },
        { labelTh: '22+', labelEn: '22+', leftAll: 1, leftSingles: 1, leftDoubles: 0, rightAll: 2, rightSingles: 2, rightDoubles: 0 },
      ],
      last20: [
        { labelTh: 'รวม', labelEn: 'Total', leftAll: 20, leftSingles: 12, leftDoubles: 8, rightAll: 20, rightSingles: 13, rightDoubles: 7 },
        { labelTh: '12-', labelEn: '12-', leftAll: 0, leftSingles: 0, leftDoubles: 0, rightAll: 0, rightSingles: 0, rightDoubles: 0 },
        { labelTh: '13-15', labelEn: '13-15', leftAll: 2, leftSingles: 1, leftDoubles: 1, rightAll: 2, rightSingles: 1, rightDoubles: 1 },
        { labelTh: '16-18', labelEn: '16-18', leftAll: 4, leftSingles: 2, leftDoubles: 2, rightAll: 5, rightSingles: 3, rightDoubles: 2 },
        { labelTh: '19-21', labelEn: '19-21', leftAll: 12, leftSingles: 7, leftDoubles: 5, rightAll: 10, rightSingles: 7, rightDoubles: 3 },
        { labelTh: '22+', labelEn: '22+', leftAll: 2, leftSingles: 2, leftDoubles: 0, rightAll: 3, rightSingles: 2, rightDoubles: 1 },
      ],
    },
    userStandings: [
      { typeTh: 'ทั้งหมด', typeEn: 'All', played: 14, win: 11, loss: 3, scored: 46.2, conceded: 38.6, diff: 7.6, rank: 1, winPct: 79 },
      { typeTh: 'เดี่ยว', typeEn: 'Singles', played: 8, win: 6, loss: 2, scored: 48.1, conceded: 38.2, diff: 9.9, rank: 1, winPct: 75 },
      { typeTh: 'คู่', typeEn: 'Doubles', played: 6, win: 5, loss: 1, scored: 43.4, conceded: 39.4, diff: 4.0, rank: 2, winPct: 83 },
      { typeTh: '10 นัดล่าสุด', typeEn: 'Last 10', played: 10, win: 8, loss: 2, scored: 46.2, conceded: 38.6, diff: 7.6, rank: null, winPct: 80 },
    ],
    opponentStandings: [
      { typeTh: 'ทั้งหมด', typeEn: 'All', played: 14, win: 10, loss: 4, scored: 47.4, conceded: 40.8, diff: 6.6, rank: 2, winPct: 71 },
      { typeTh: 'เดี่ยว', typeEn: 'Singles', played: 9, win: 7, loss: 2, scored: 49.2, conceded: 39.9, diff: 9.3, rank: 2, winPct: 78 },
      { typeTh: 'คู่', typeEn: 'Doubles', played: 5, win: 3, loss: 2, scored: 43.1, conceded: 42.9, diff: 0.2, rank: 3, winPct: 60 },
      { typeTh: '10 นัดล่าสุด', typeEn: 'Last 10', played: 10, win: 7, loss: 3, scored: 47.4, conceded: 40.8, diff: 6.6, rank: null, winPct: 70 },
    ],
    h2hMatches: [
      { id: 'ah_1', date: '02/11/2026', league: 'Lam Luk Ka Open', format: 'Singles', leftNameTh: 'กานต์ ธนวัฒน์', leftNameEn: 'Karn Tanawat', rightNameTh: 'อาร์ท สปีด', rightNameEn: 'Art Speedster', leftSet1: 17, rightSet1: 21, leftTotal: 56, rightTotal: 58, leftWon: false },
      { id: 'ah_2', date: '18/10/2026', league: 'Rama 9 League', format: 'Singles', leftNameTh: 'กานต์ ธนวัฒน์', leftNameEn: 'Karn Tanawat', rightNameTh: 'อาร์ท สปีด', rightNameEn: 'Art Speedster', leftSet1: 21, rightSet1: 18, leftTotal: 42, rightTotal: 35, leftWon: true },
      { id: 'ah_3', date: '04/10/2026', league: 'Friday Clash', format: 'Doubles', leftNameTh: 'กานต์ & พลอย', leftNameEn: 'Karn & Ploy', rightNameTh: 'อาร์ท & ท็อป', rightNameEn: 'Art & Top', leftSet1: 21, rightSet1: 19, leftTotal: 44, rightTotal: 40, leftWon: true },
      { id: 'ah_4', date: '15/09/2026', league: 'Club Open', format: 'Singles', leftNameTh: 'อาร์ท สปีด', leftNameEn: 'Art Speedster', rightNameTh: 'กานต์ ธนวัฒน์', rightNameEn: 'Karn Tanawat', leftSet1: 21, rightSet1: 19, leftTotal: 43, rightTotal: 39, leftWon: false },
    ],
    userRecentMatches: [
      { id: 'ur_1', date: '07/11/2026', league: 'Rama 9 League', format: 'Singles', leftNameTh: 'กานต์ ธนวัฒน์', leftNameEn: 'Karn Tanawat', rightNameTh: 'โอห์ม ปืนกล', rightNameEn: 'Ohm Machinegun', leftSet1: 21, rightSet1: 18, leftTotal: 61, rightTotal: 58, leftWon: true },
      { id: 'ur_2', date: '05/11/2026', league: 'Friday Clash', format: 'Doubles', leftNameTh: 'กานต์ & พลอย', leftNameEn: 'Karn & Ploy', rightNameTh: 'แบงค์ & ท็อป', rightNameEn: 'Bank & Top', leftSet1: 21, rightSet1: 15, leftTotal: 42, rightTotal: 32, leftWon: true },
      { id: 'ur_3', date: '02/11/2026', league: 'Club Open', format: 'Singles', leftNameTh: 'กานต์ ธนวัฒน์', leftNameEn: 'Karn Tanawat', rightNameTh: 'อาร์ท สปีด', rightNameEn: 'Art Speedster', leftSet1: 17, rightSet1: 21, leftTotal: 56, rightTotal: 58, leftWon: false },
      { id: 'ur_4', date: '28/10/2026', league: 'BKK Night', format: 'Doubles', leftNameTh: 'กานต์ & โอห์ม', leftNameEn: 'Karn & Ohm', rightNameTh: 'มีน & นัท', rightNameEn: 'Meen & Nat', leftSet1: 21, rightSet1: 12, leftTotal: 42, rightTotal: 26, leftWon: true },
    ],
    opponentRecentMatches: [
      { id: 'ar_1', date: '06/11/2026', league: 'Rama 9 League', format: 'Singles', leftNameTh: 'อาร์ท สปีด', leftNameEn: 'Art Speedster', rightNameTh: 'แบงค์ พาวเวอร์', rightNameEn: 'Bank Power', leftSet1: 21, rightSet1: 16, leftTotal: 42, rightTotal: 33, leftWon: true },
      { id: 'ar_2', date: '02/11/2026', league: 'Lam Luk Ka Open', format: 'Singles', leftNameTh: 'อาร์ท สปีด', leftNameEn: 'Art Speedster', rightNameTh: 'กานต์ ธนวัฒน์', rightNameEn: 'Karn Tanawat', leftSet1: 21, rightSet1: 17, leftTotal: 58, rightTotal: 56, leftWon: true },
      { id: 'ar_3', date: '26/10/2026', league: 'BKK Night', format: 'Doubles', leftNameTh: 'อาร์ท & ท็อป', leftNameEn: 'Art & Top', rightNameTh: 'มีน & นัท', rightNameEn: 'Meen & Nat', leftSet1: 18, rightSet1: 21, leftTotal: 38, rightTotal: 42, leftWon: false },
    ],
  },
];

const CollapsibleHeader: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  rightControls?: React.ReactNode;
}> = ({ title, isOpen, onToggle, rightControls }) => (
  <div className="px-4 py-3 flex items-center justify-between gap-2 bg-[#ffffff]">
    <button
      type="button"
      onClick={() => {
        playSelectSound();
        onToggle();
      }}
      className="no-doodle text-[14px] font-semibold text-[#111111] flex items-center gap-1.5 cursor-pointer text-left min-w-0 truncate"
    >
      <span className="truncate">{title}</span>
    </button>

    <div className="flex items-center gap-2 shrink-0">
      {rightControls}
      <button
        type="button"
        onClick={() => {
          playSelectSound();
          onToggle();
        }}
        aria-label={isOpen ? 'Collapse section' : 'Expand section'}
        className="no-doodle w-7 h-7 rounded-full hover:bg-[#f3f4f6] flex items-center justify-center text-[#71717a] cursor-pointer transition-colors"
      >
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

const WindowToggle: React.FC<{
  value: WindowRange;
  onChange: (val: WindowRange) => void;
  isThai: boolean;
}> = ({ value, onChange, isThai }) => (
  <div
    data-filter="true"
    className="inline-flex items-center gap-1.5"
  >
    <button
      type="button"
      onClick={() => {
        playSelectSound();
        onChange('last10');
      }}
      className={`no-doodle filter-pill px-2.5 py-1 rounded-full text-[10px] transition-all cursor-pointer whitespace-nowrap border ${
        value === 'last10'
          ? 'bg-[#e8f7ee] text-[#004d2c] border-[#2d4d14] font-semibold'
          : 'bg-[#ffffff] text-[#6b7280] border-[#d4dfd0] hover:border-[#2d4d14] hover:text-[#142608] font-medium'
      }`}
    >
      {isThai ? '10นัดล่าสุด' : 'Last 10'}
    </button>
    <button
      type="button"
      onClick={() => {
        playSelectSound();
        onChange('last20');
      }}
      className={`no-doodle filter-pill px-2.5 py-1 rounded-full text-[10px] transition-all cursor-pointer whitespace-nowrap border ${
        value === 'last20'
          ? 'bg-[#e8f7ee] text-[#004d2c] border-[#2d4d14] font-semibold'
          : 'bg-[#ffffff] text-[#6b7280] border-[#d4dfd0] hover:border-[#2d4d14] hover:text-[#142608] font-medium'
      }`}
    >
      {isThai ? '20นัดล่าสุด' : 'Last 20'}
    </button>
  </div>
);

const MirrorComparisonTable: React.FC<{
  rows: SplitRow[];
  isThai: boolean;
}> = ({ rows, isThai }) => (
  <div className="w-full text-[11px] tabular-nums">
    {/* Table Column Headers */}
    <div className="grid grid-cols-7 bg-[#f5f5f7] text-[#6b7280] font-medium py-1.5 text-center border-y border-[#000000]/[0.05]">
      <div className="truncate">{isThai ? 'รวม' : 'All'}</div>
      <div className="truncate">{isThai ? 'เดี่ยว' : 'Sgl'}</div>
      <div className="truncate">{isThai ? 'คู่' : 'Dbl'}</div>
      <div />
      <div className="truncate">{isThai ? 'รวม' : 'All'}</div>
      <div className="truncate">{isThai ? 'เดี่ยว' : 'Sgl'}</div>
      <div className="truncate">{isThai ? 'คู่' : 'Dbl'}</div>
    </div>

    {/* Rows */}
    <div className="divide-y divide-[#000000]/[0.05]">
      {rows.map((row, idx) => (
        <div
          key={`${row.labelEn}_${idx}`}
          className="grid grid-cols-7 py-2 text-center items-center hover:bg-[#fafafa] transition-colors"
        >
          <div className={row.highlightLeft === 'all' ? 'font-semibold text-[#dc2626]' : 'text-[#111111]'}>
            {row.leftAll}
          </div>
          <div className={row.highlightLeft === 'singles' ? 'font-semibold text-[#dc2626]' : 'text-[#111111]'}>
            {row.leftSingles}
          </div>
          <div className={row.highlightLeft === 'doubles' ? 'font-semibold text-[#dc2626]' : 'text-[#111111]'}>
            {row.leftDoubles}
          </div>

          <div className="text-[#71717a] font-medium text-[10px] truncate px-0.5">
            {isThai ? row.labelTh : row.labelEn}
          </div>

          <div className={row.highlightRight === 'all' ? 'font-semibold text-[#dc2626]' : 'text-[#111111]'}>
            {row.rightAll}
          </div>
          <div className={row.highlightRight === 'singles' ? 'font-semibold text-[#dc2626]' : 'text-[#111111]'}>
            {row.rightSingles}
          </div>
          <div className={row.highlightRight === 'doubles' ? 'font-semibold text-[#dc2626]' : 'text-[#111111]'}>
            {row.rightDoubles}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MatchTableRows: React.FC<{
  matches: H2HMatchItem[];
  isThai: boolean;
}> = ({ matches, isThai }) => (
  <div className="w-full text-[11px] tabular-nums">
    <div className="grid grid-cols-[76px_minmax(0,1fr)_36px_42px] bg-[#f5f5f7] text-[#6b7280] font-medium px-3 py-1.5 border-y border-[#000000]/[0.05] items-center">
      <div>{isThai ? 'วันที่/รายการ' : 'Date/Event'}</div>
      <div>{isThai ? 'คู่แข่ง' : 'Matchup'}</div>
      <div className="text-center">{isThai ? 'เซต1' : 'S1'}</div>
      <div className="text-center">{isThai ? 'เต็ม' : 'Pts'}</div>
    </div>

    {matches.length === 0 ? (
      <div className="py-6 text-center text-xs text-[#71717a]">
        {isThai ? 'ไม่พบประวัติการแข่งขันในประเภทนี้' : 'No matches recorded in this format'}
      </div>
    ) : (
      <div className="divide-y divide-[#000000]/[0.05]">
        {matches.map((m) => (
          <div
            key={m.id}
            className="grid grid-cols-[76px_minmax(0,1fr)_36px_42px] px-3 py-2.5 items-center gap-1.5 hover:bg-[#fafafa] transition-colors"
          >
            {/* Date & Tournament */}
            <div className="min-w-0 leading-tight">
              <div className="text-[10px] font-medium text-[#52525b] truncate">{m.date}</div>
              <div className="text-[10px] text-[#9ca3af] truncate mt-0.5">{m.league}</div>
              <div className="text-[9px] text-[#71717a] truncate">
                {isThai ? (m.format === 'Singles' ? 'เดี่ยว' : 'คู่') : m.format}
              </div>
            </div>

            {/* Stacked Matchup Names */}
            <div className="min-w-0 space-y-1">
              <div
                className={`text-xs truncate ${
                  m.leftWon ? 'font-semibold text-[#dc2626]' : 'font-normal text-[#111111]'
                }`}
              >
                {isThai ? m.leftNameTh : m.leftNameEn}
              </div>
              <div
                className={`text-xs truncate ${
                  !m.leftWon ? 'font-semibold text-[#15803d]' : 'font-normal text-[#111111]'
                }`}
              >
                {isThai ? m.rightNameTh : m.rightNameEn}
              </div>
            </div>

            {/* Set 1 Stacked Score */}
            <div className="text-center space-y-1 text-xs text-[#52525b] font-medium">
              <div>{m.leftSet1}</div>
              <div>{m.rightSet1}</div>
            </div>

            {/* Final Total Stacked Solid Score Chips (Matches Reference Red/Green Score Boxes) */}
            <div className="flex flex-col items-center gap-0.5">
              <span
                className={`w-8 py-0.5 rounded-[4px] text-[11px] font-semibold text-center text-[#ffffff] ${
                  m.leftWon ? 'bg-[#15803d]' : 'bg-[#dc2626]'
                }`}
              >
                {m.leftTotal}
              </span>
              <span
                className={`w-8 py-0.5 rounded-[4px] text-[11px] font-semibold text-center text-[#ffffff] ${
                  !m.leftWon ? 'bg-[#15803d]' : 'bg-[#dc2626]'
                }`}
              >
                {m.rightTotal}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export const PlayerStatsPanel: React.FC = () => {
  const { player, language, authUser, userCloudMatches } = useApp();
  const isThai = language === 'th';
  const firebaseMatchStats = useMemo(
    () => computeHistoricalMatchStats(userCloudMatches),
    [userCloudMatches]
  );

  const [selectedOpponentId, setSelectedOpponentId] = useState<'ohm' | 'art'>('ohm');

  // Section Expand/Collapse States
  const [openScoredAvg, setOpenScoredAvg] = useState(true);
  const [openConcededAvg, setOpenConcededAvg] = useState(true);
  const [openTotalDist, setOpenTotalDist] = useState(true);
  const [openFirstSetDist, setOpenFirstSetDist] = useState(true);
  const [openStandings, setOpenStandings] = useState(true);
  const [openH2H, setOpenH2H] = useState(true);
  const [openRecent, setOpenRecent] = useState(true);

  // Per-section Window Toggles (10 vs 20 recent matches)
  const [scoredWindow, setScoredWindow] = useState<WindowRange>('last10');
  const [concededWindow, setConcededWindow] = useState<WindowRange>('last10');
  const [totalDistWindow, setTotalDistWindow] = useState<WindowRange>('last10');
  const [firstSetWindow, setFirstSetWindow] = useState<WindowRange>('last10');

  // Filters for H2H & Recent
  const [h2hSinglesOnly, setH2hSinglesOnly] = useState(false);
  const [recentSinglesOnly, setRecentSinglesOnly] = useState(false);
  const [recentSide, setRecentSide] = useState<'user' | 'opponent'>('user');

  const comp = COMPARISON_PROFILES.find((c) => c.id === selectedOpponentId) || COMPARISON_PROFILES[0];
  const userName = isThai ? (player.nameTh || 'กานต์ ธนวัฒน์') : (player.nameEn || 'Karn Tanawat');
  const compName = isThai ? comp.nameTh : comp.nameEn;

  const displayedH2H = h2hSinglesOnly
    ? comp.h2hMatches.filter((m) => m.format === 'Singles')
    : comp.h2hMatches;
  const h2hWins = displayedH2H.filter((m) => m.leftWon).length;
  const h2hLosses = displayedH2H.length - h2hWins;
  const h2hHighPtsPct = displayedH2H.length
    ? Math.round((displayedH2H.filter((m) => m.leftTotal + m.rightTotal >= 85).length / displayedH2H.length) * 100)
    : 0;

  const baseRecent = recentSide === 'user' ? comp.userRecentMatches : comp.opponentRecentMatches;
  const displayedRecent = recentSinglesOnly
    ? baseRecent.filter((m) => m.format === 'Singles')
    : baseRecent;
  const recentWins = displayedRecent.filter((m) => m.leftWon).length;
  const recentLosses = displayedRecent.length - recentWins;
  const recentHighPct = displayedRecent.length
    ? Math.round((displayedRecent.filter((m) => m.leftTotal + m.rightTotal >= 85).length / displayedRecent.length) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Live Firebase Career & Match Summary */}
      <div className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[14px] font-bold text-[#142608] leading-tight">
              {isThai ? 'สรุปสถิติจริงจาก Firebase' : 'Live Firebase Career Stats'}
            </h3>
            <p className="text-[11px] text-[#5c6f5e] mt-0.5">
              {authUser
                ? isThai
                  ? `คำนวณจาก ${firebaseMatchStats.totalMatches} แมตช์ในบัญชีของคุณ`
                  : `Aggregated from ${firebaseMatchStats.totalMatches} recorded matches`
                : isThai
                  ? 'เข้าสู่ระบบ Google ในหน้าหลักเพื่อดึงข้อมูลสถิติจริงจากคลาวด์'
                  : 'Sign in with Google on Overview to pull live Firebase records'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#004d2c] shrink-0">
            <Cloud className="w-3.5 h-3.5" />
            <span>{authUser ? (isThai ? 'ซิงค์แล้ว' : 'Live') : isThai ? 'ออฟไลน์' : 'Offline'}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 tabular-nums">
          <div className="p-2.5 rounded-[14px] bg-[#f8faf6] border border-[#e6eee2]">
            <div className="text-[10px] font-semibold text-[#5c6f5e]">
              {isThai ? 'ชนะ / แพ้' : 'Record'}
            </div>
            <div className="text-base font-bold text-[#142608] mt-0.5">
              {firebaseMatchStats.wins}W - {firebaseMatchStats.losses}L
            </div>
            <div className="text-[10px] text-[#15803d] font-semibold">
              {firebaseMatchStats.winRate}% {isThai ? 'ชนะ' : 'Win'}
            </div>
          </div>

          <div className="p-2.5 rounded-[14px] bg-[#f8faf6] border border-[#e6eee2]">
            <div className="text-[10px] font-semibold text-[#5c6f5e]">
              {isThai ? 'คะแนนเฉลี่ยต่อนัด' : 'Avg Points / Match'}
            </div>
            <div className="text-base font-bold text-[#142608] mt-0.5">
              {firebaseMatchStats.avgPointsFor} : {firebaseMatchStats.avgPointsAgainst}
            </div>
            <div className="text-[10px] text-[#5c6f5e]">
              {isThai ? 'ได้ : เสีย' : 'For : Against'}
            </div>
          </div>

          <div className="p-2.5 rounded-[14px] bg-[#f8faf6] border border-[#e6eee2]">
            <div className="text-[10px] font-semibold text-[#5c6f5e]">
              {isThai ? 'ความเร็วตบสูงสุด' : 'Peak Smash'}
            </div>
            <div className="text-base font-bold text-[#004d2c] mt-0.5">
              {firebaseMatchStats.peakSmashKmh || player.stats.highestSmashSpeedKmh} km/h
            </div>
            <div className="text-[10px] text-[#5c6f5e]">
              {isThai
                ? `เฉลี่ย ${firebaseMatchStats.avgSmashKmh || 0} กม./ชม.`
                : `Avg ${firebaseMatchStats.avgSmashKmh || 0} km/h`}
            </div>
          </div>

          <div className="p-2.5 rounded-[14px] bg-[#e8f7ee] border border-[#7cd7a0]/45">
            <div className="text-[10px] font-semibold text-[#004d2c]">
              {isThai ? 'เดี่ยว / คู่' : 'Singles / Doubles'}
            </div>
            <div className="text-base font-bold text-[#004d2c] mt-0.5">
              {firebaseMatchStats.singlesMatches} / {firebaseMatchStats.doublesMatches}
            </div>
            <div className="text-[10px] text-[#15803d] font-semibold">
              +{firebaseMatchStats.totalExpGained.toLocaleString()} EXP
            </div>
          </div>
        </div>
      </div>

      {/* Head-to-Head Matchup Banner & Opponent Switcher */}
      <div className="bg-[#ffffff] border border-[#d4dfd0] rounded-[24px] p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#6b7280]">
            {isThai ? 'เปรียบเทียบสถิติผู้เล่น' : 'Player Matchup Comparison'}
          </span>
          <div data-filter="true" className="inline-flex items-center gap-1.5">
            {COMPARISON_PROFILES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  playSelectSound();
                  setSelectedOpponentId(item.id as 'ohm' | 'art');
                }}
                className={`no-doodle filter-pill min-h-[32px] px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer whitespace-nowrap border ${
                  selectedOpponentId === item.id
                    ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c] font-semibold shadow-2xs'
                    : 'bg-[#f8faf6] text-[#52525b] border-[#d4dfd0] hover:border-[#2d4d14] hover:text-[#142608] font-medium'
                }`}
              >
                {isThai ? item.nameTh.split(' ')[0] : item.nameEn.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <DoodleAvatar
              preset="karn"
              size="sm"
              className="w-10 h-10 shrink-0"
              ringClass="border-2 border-[#e8f7ee]"
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#111111] truncate">{userName}</div>
              <div className="text-[10px] text-[#15803d] font-medium truncate">
                {isThai ? 'ลีกไดมอนด์ · อันดับ 1' : 'Diamond · #1'}
              </div>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#9ca3af] px-1">VS</span>

          <div className="flex items-center justify-end gap-2.5 min-w-0 text-right">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#111111] truncate">{compName}</div>
              <div className="text-[10px] text-[#71717a] font-medium truncate">
                {isThai ? comp.tierTh : comp.tierEn}
              </div>
            </div>
            <DoodleAvatar
              preset={comp.avatarPreset}
              size="sm"
              className="w-10 h-10 shrink-0"
              ringClass="border-2 border-[#f3f4f6]"
            />
          </div>
        </div>
      </div>

      {/* 1. ได้คะแนนเฉลี่ย (Average Points Scored) */}
      <section className="bg-[#ffffff] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <CollapsibleHeader
          title={isThai ? 'ได้คะแนนเฉลี่ย' : 'Average Points Scored'}
          isOpen={openScoredAvg}
          onToggle={() => setOpenScoredAvg(!openScoredAvg)}
          rightControls={<WindowToggle value={scoredWindow} onChange={setScoredWindow} isThai={isThai} />}
        />
        {openScoredAvg && <MirrorComparisonTable rows={comp.scoredAvg[scoredWindow]} isThai={isThai} />}
      </section>

      {/* 2. เสียคะแนนเฉลี่ย (Average Points Conceded) */}
      <section className="bg-[#ffffff] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <CollapsibleHeader
          title={isThai ? 'เสียคะแนนเฉลี่ย' : 'Average Points Conceded'}
          isOpen={openConcededAvg}
          onToggle={() => setOpenConcededAvg(!openConcededAvg)}
          rightControls={<WindowToggle value={concededWindow} onChange={setConcededWindow} isThai={isThai} />}
        />
        {openConcededAvg && <MirrorComparisonTable rows={comp.concededAvg[concededWindow]} isThai={isThai} />}
      </section>

      {/* 3. คะแนนรวม (Total Points Distribution) */}
      <section className="bg-[#ffffff] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <CollapsibleHeader
          title={isThai ? 'คะแนนรวม' : 'Total Match Points'}
          isOpen={openTotalDist}
          onToggle={() => setOpenTotalDist(!openTotalDist)}
          rightControls={<WindowToggle value={totalDistWindow} onChange={setTotalDistWindow} isThai={isThai} />}
        />
        {openTotalDist && <MirrorComparisonTable rows={comp.totalPointsDist[totalDistWindow]} isThai={isThai} />}
      </section>

      {/* 4. คะแนนเซตแรก (First Set Points Distribution) */}
      <section className="bg-[#ffffff] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <CollapsibleHeader
          title={isThai ? 'คะแนนเซตแรก' : 'First Set Points'}
          isOpen={openFirstSetDist}
          onToggle={() => setOpenFirstSetDist(!openFirstSetDist)}
          rightControls={<WindowToggle value={firstSetWindow} onChange={setFirstSetWindow} isThai={isThai} />}
        />
        {openFirstSetDist && <MirrorComparisonTable rows={comp.firstSetDist[firstSetWindow]} isThai={isThai} />}
      </section>

      {/* 5. ตารางคะแนน (Standings & Format Breakdown) */}
      <section className="bg-[#ffffff] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <CollapsibleHeader
          title={isThai ? 'ตารางคะแนน' : 'Standings Breakdown'}
          isOpen={openStandings}
          onToggle={() => setOpenStandings(!openStandings)}
        />
        {openStandings && (
          <div className="divide-y divide-[#000000]/[0.06]">
            {[
              { title: userName, rows: comp.userStandings },
              { title: compName, rows: comp.opponentStandings },
            ].map((block) => (
              <div key={block.title} className="pt-1 pb-2">
                <div className="px-4 py-1.5 text-xs font-semibold text-[#111111]">
                  {block.title}
                </div>
                <div className="w-full text-[11px] tabular-nums">
                  <div className="grid grid-cols-[58px_repeat(7,1fr)_38px] bg-[#f5f5f7] text-[#6b7280] font-medium px-3 py-1.5 text-center items-center border-y border-[#000000]/[0.05]">
                    <div className="text-left">{isThai ? 'ประเภท' : 'Split'}</div>
                    <div>{isThai ? 'นัด' : 'P'}</div>
                    <div>{isThai ? 'ชนะ' : 'W'}</div>
                    <div>{isThai ? 'แพ้' : 'L'}</div>
                    <div>{isThai ? 'ได้' : 'PF'}</div>
                    <div>{isThai ? 'เสีย' : 'PA'}</div>
                    <div>+/-</div>
                    <div>{isThai ? 'อันดับ' : 'Rk'}</div>
                    <div>{isThai ? 'ชนะ%' : 'W%'}</div>
                  </div>
                  <div className="divide-y divide-[#000000]/[0.05]">
                    {block.rows.map((r) => (
                      <div
                        key={r.typeEn}
                        className="grid grid-cols-[58px_repeat(7,1fr)_38px] px-3 py-2 text-center items-center hover:bg-[#fafafa] transition-colors"
                      >
                        <div className="text-left font-medium text-[#111111] truncate">
                          {isThai ? r.typeTh : r.typeEn}
                        </div>
                        <div className="text-[#111111]">{r.played}</div>
                        <div className="text-[#15803d] font-medium">{r.win}</div>
                        <div className="text-[#dc2626] font-medium">{r.loss}</div>
                        <div className="text-[#111111]">{r.scored}</div>
                        <div className="text-[#111111]">{r.conceded}</div>
                        <div className={r.diff >= 0 ? 'text-[#15803d] font-medium' : 'text-[#dc2626] font-medium'}>
                          {r.diff > 0 ? `+${r.diff}` : r.diff}
                        </div>
                        <div className="text-[#52525b]">{r.rank ?? '—'}</div>
                        <div className="font-semibold text-[#111111]">{r.winPct}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. ผลงานการพบกัน (Head-to-Head Results) */}
      <section className="bg-[#ffffff] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <CollapsibleHeader
          title={isThai ? 'ผลงานการพบกัน' : 'Head-to-Head'}
          isOpen={openH2H}
          onToggle={() => setOpenH2H(!openH2H)}
          rightControls={
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setH2hSinglesOnly(!h2hSinglesOnly);
              }}
              className="no-doodle flex items-center gap-1.5 text-[11px] font-medium text-[#52525b] cursor-pointer whitespace-nowrap"
            >
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  h2hSinglesOnly
                    ? 'bg-[#15803d] border-[#15803d] text-[#ffffff]'
                    : 'border-[#d4d4d8] bg-[#ffffff]'
                }`}
              >
                {h2hSinglesOnly && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </span>
              <span>{isThai ? 'เฉพาะเดี่ยว' : 'Singles only'}</span>
            </button>
          }
        />
        {openH2H && (
          <div>
            {/* Dynamic Summary Row */}
            <div className="px-4 py-2 border-t border-[#000000]/[0.05] grid grid-cols-4 gap-1 text-center text-[11px] font-semibold tabular-nums">
              <div className="text-[#dc2626]">
                {isThai ? `ชนะ: ${h2hWins}` : `W: ${h2hWins}`}
              </div>
              <div className="text-[#15803d]">
                {isThai ? `แพ้: ${h2hLosses}` : `L: ${h2hLosses}`}
              </div>
              <div className="text-[#dc2626]">
                {isThai ? `สูง: ${h2hHighPtsPct}%` : `High: ${h2hHighPtsPct}%`}
              </div>
              <div className="text-[#111111]">
                {isThai ? `พบกัน ${displayedH2H.length}` : `${displayedH2H.length} M`}
              </div>
            </div>
            <MatchTableRows matches={displayedH2H} isThai={isThai} />
          </div>
        )}
      </section>

      {/* 7. ผลการแข่งขันที่ผ่านมา (Recent Matches by Player Toggle) */}
      <section className="bg-[#ffffff] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <CollapsibleHeader
          title={isThai ? 'ผลการแข่งขันที่ผ่านมา' : 'Recent Results'}
          isOpen={openRecent}
          onToggle={() => setOpenRecent(!openRecent)}
          rightControls={
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setRecentSinglesOnly(!recentSinglesOnly);
              }}
              className="no-doodle flex items-center gap-1.5 text-[11px] font-medium text-[#52525b] cursor-pointer whitespace-nowrap"
            >
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  recentSinglesOnly
                    ? 'bg-[#15803d] border-[#15803d] text-[#ffffff]'
                    : 'border-[#d4d4d8] bg-[#ffffff]'
                }`}
              >
                {recentSinglesOnly && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </span>
              <span>{isThai ? 'เฉพาะเดี่ยว' : 'Singles only'}</span>
            </button>
          }
        />
        {openRecent && (
          <div>
            {/* Outlined Player Switcher Chips */}
            <div className="px-3 pb-2.5">
              <div
                data-filter="true"
                className="grid grid-cols-2 gap-2"
              >
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setRecentSide('user');
                  }}
                  className={`no-doodle filter-pill min-h-[34px] py-1 px-3 rounded-full text-[11px] transition-all cursor-pointer truncate border ${
                    recentSide === 'user'
                      ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c] font-semibold shadow-2xs'
                      : 'bg-[#f8faf6] text-[#52525b] border-[#d4dfd0] hover:border-[#2d4d14] hover:text-[#142608] font-medium'
                  }`}
                >
                  {userName}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setRecentSide('opponent');
                  }}
                  className={`no-doodle filter-pill min-h-[34px] py-1 px-3 rounded-full text-[11px] transition-all cursor-pointer truncate border ${
                    recentSide === 'opponent'
                      ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c] font-semibold shadow-2xs'
                      : 'bg-[#f8faf6] text-[#52525b] border-[#d4dfd0] hover:border-[#2d4d14] hover:text-[#142608] font-medium'
                  }`}
                >
                  {compName}
                </button>
              </div>
            </div>

            {/* Dynamic Summary Row */}
            <div className="px-4 py-2 border-t border-[#000000]/[0.05] grid grid-cols-4 gap-1 text-center text-[11px] font-semibold tabular-nums">
              <div className="text-[#dc2626]">
                {isThai ? `ชนะ: ${recentWins}` : `W: ${recentWins}`}
              </div>
              <div className="text-[#15803d]">
                {isThai ? `แพ้: ${recentLosses}` : `L: ${recentLosses}`}
              </div>
              <div className="text-[#dc2626]">
                {isThai ? `สูง: ${recentHighPct}%` : `High: ${recentHighPct}%`}
              </div>
              <div className="text-[#111111]">
                {isThai ? `${displayedRecent.length} นัด` : `${displayedRecent.length} M`}
              </div>
            </div>

            <MatchTableRows matches={displayedRecent} isThai={isThai} />
          </div>
        )}
      </section>
    </div>
  );
};
