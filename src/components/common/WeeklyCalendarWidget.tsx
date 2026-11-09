import React, { useState } from 'react';
import { Calendar as CalendarIcon, Check, ChevronRight, Clock, Users, Zap } from 'lucide-react';
import { playCoinSound, playSelectSound, playSmashSound } from '../../utils/retroAudio';

interface CalendarSessionItem {
  id: string;
  timeRange: string;
  title: string;
  trainer: string;
  category: 'Match' | 'Yoga' | 'Drill' | 'Cardio';
  icon: string;
  courtName: string;
  intensity: 'Low' | 'Medium' | 'High';
  joined: boolean;
  attendeeCount: number;
}

const INITIAL_SESSIONS: Record<number, CalendarSessionItem[]> = {
  11: [
    {
      id: 'sess_1',
      timeRange: '18:00 - 19:30',
      title: 'วอร์มอัป & ยืดกล้ามเนื้อ (Yoga for Badminton)',
      trainer: 'ครูแพรว (Certified Coach)',
      category: 'Yoga',
      icon: '🧘',
      courtName: 'คอร์ท 2 · Winner Arena',
      intensity: 'Low',
      joined: false,
      attendeeCount: 12,
    },
    {
      id: 'sess_2',
      timeRange: '19:30 - 21:00',
      title: 'ก๊วนมือใหม่ & สตรี (Beginner Friendly Match)',
      trainer: 'โค้ชอาร์ท',
      category: 'Match',
      icon: '🏸',
      courtName: 'คอร์ท 5 · ลาดพร้าว',
      intensity: 'Medium',
      joined: false,
      attendeeCount: 16,
    },
  ],
  12: [
    {
      id: 'sess_3',
      timeRange: '19:00 - 20:30',
      title: 'Full Body Smash & Footwork Drill (ซ้อมสปีด)',
      trainer: 'Daniel Moore (Ex-National)',
      category: 'Drill',
      icon: '⚡',
      courtName: 'คอร์ท 3 · สแมช อารีน่า',
      intensity: 'High',
      joined: true,
      attendeeCount: 8,
    },
    {
      id: 'sess_4',
      timeRange: '20:30 - 22:30',
      title: 'ก๊วน Diamond League แข่งขันคู่ผสม (Pro Match)',
      trainer: 'กานต์ & โค้ชต้น',
      category: 'Match',
      icon: '👥',
      courtName: 'คอร์ท 1-2 · Infinity Rama 9',
      intensity: 'High',
      joined: false,
      attendeeCount: 28,
    },
  ],
  13: [
    {
      id: 'sess_5',
      timeRange: '18:30 - 20:00',
      title: 'Dance Cardio & Footwork Agility',
      trainer: 'Sophia Martinez',
      category: 'Cardio',
      icon: '🔥',
      courtName: 'สตูดิโอ 1 · Winner Arena',
      intensity: 'Medium',
      joined: false,
      attendeeCount: 14,
    },
  ],
  14: [
    {
      id: 'sess_6',
      timeRange: '19:00 - 21:00',
      title: 'เทคนิคหน้าเน็ต & ตบครอสคอร์ท (Net Play Mastery)',
      trainer: 'โค้ชท็อป',
      category: 'Drill',
      icon: '🎯',
      courtName: 'คอร์ท 4 · Sport Refresh',
      intensity: 'Medium',
      joined: false,
      attendeeCount: 10,
    },
  ],
  15: [
    {
      id: 'sess_7',
      timeRange: '20:00 - 23:00',
      title: 'Friday Night Smash Party (บุฟเฟต์ลูกขนไก่)',
      trainer: 'Bangkok Shuttlers Guild',
      category: 'Match',
      icon: '🍻',
      courtName: 'คอร์ท 1-4 · 71 Badminton',
      intensity: 'High',
      joined: false,
      attendeeCount: 32,
    },
  ],
  16: [
    {
      id: 'sess_8',
      timeRange: '09:00 - 11:30',
      title: 'Weekend Morning Sparring (ซ้อมเช้าเสาร์)',
      trainer: 'โค้ชกานต์',
      category: 'Match',
      icon: '☀️',
      courtName: 'คอร์ท 3 · ลาดพร้าว',
      intensity: 'Medium',
      joined: false,
      attendeeCount: 18,
    },
  ],
  17: [
    {
      id: 'sess_9',
      timeRange: '16:00 - 18:30',
      title: 'Sunday AI Tournament Simulation (แข่งเก็บแรงค์)',
      trainer: 'Smash AI Official',
      category: 'Match',
      icon: '🏆',
      courtName: 'คอร์ท 1 · พระราม 9',
      intensity: 'High',
      joined: false,
      attendeeCount: 24,
    },
  ],
};

const DAYS = [
  { dayName: 'Mon', dateNum: 11, thaiDay: 'จันทร์' },
  { dayName: 'Tue', dateNum: 12, thaiDay: 'อังคาร' },
  { dayName: 'Wed', dateNum: 13, thaiDay: 'พุธ' },
  { dayName: 'Thu', dateNum: 14, thaiDay: 'พฤหัส' },
  { dayName: 'Fri', dateNum: 15, thaiDay: 'ศุกร์' },
  { dayName: 'Sat', dateNum: 16, thaiDay: 'เสาร์' },
  { dayName: 'Sun', dateNum: 17, thaiDay: 'อาทิตย์' },
];

export const WeeklyCalendarWidget: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number>(12); // Default Tue 12
  const [sessionsMap, setSessionsMap] = useState<Record<number, CalendarSessionItem[]>>(INITIAL_SESSIONS);

  const currentSessions = sessionsMap[selectedDate] || [];

  const handleToggleJoin = (sessionId: string) => {
    setSessionsMap((prev) => {
      const dayList = prev[selectedDate] || [];
      const updated = dayList.map((item) => {
        if (item.id === sessionId) {
          const nextJoined = !item.joined;
          if (nextJoined) {
            playSmashSound();
          } else {
            playSelectSound();
          }
          return {
            ...item,
            joined: nextJoined,
            attendeeCount: nextJoined ? item.attendeeCount + 1 : Math.max(0, item.attendeeCount - 1),
          };
        }
        return item;
      });
      return { ...prev, [selectedDate]: updated };
    });
  };

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-[#000000] uppercase tracking-wide font-['Antonio',sans-serif] flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-[#fb4903]" />
          <span>Weekly Schedule · ตารางก๊วน & คลาสสัปดาห์นี้</span>
        </h2>
        <span className="text-[10px] font-bold text-[#000000]/60">ธันวาคม 2026</span>
      </div>

      {/* Horizontal Day Selector Strip (Exact VibeMove reference in Slush CI) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {DAYS.map((d) => {
          const isSelected = d.dateNum === selectedDate;
          return (
            <button
              key={d.dateNum}
              type="button"
              onClick={() => {
                playSelectSound();
                setSelectedDate(d.dateNum);
              }}
              className={`flex-1 min-w-[46px] py-2 px-1 rounded-[18px] border border-[#000000] flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-[#fb4903] text-[#ffffff] font-black shadow-xs scale-102'
                  : 'bg-[#ffffff] text-[#000000] hover:bg-[#f0f0f0]'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-[#ffffff]/90' : 'text-[#000000]/60'}`}>
                {d.dayName}
              </span>
              <span className="text-sm font-black font-['Antonio',sans-serif] mt-0.5">
                {d.dateNum}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sessions List for Selected Day */}
      <div className="space-y-2">
        {currentSessions.length === 0 ? (
          <div className="p-4 rounded-[20px] bg-[#ffffff] border border-[#000000] text-center text-xs font-bold text-[#000000]/60">
            ไม่มีกิจกรรมที่จัดในวันนี้ เลือกลองดูวันอื่นๆ ได้เลย
          </div>
        ) : (
          currentSessions.map((session) => (
            <div
              key={session.id}
              className="p-3 rounded-[24px] bg-[#ffffff] border border-[#000000] shadow-xs flex items-center justify-between gap-2.5 hover:shadow-md transition-all"
            >
              {/* Category Icon Badge */}
              <div className="w-10 h-10 rounded-[16px] bg-[#dceeff] border border-[#000000] flex items-center justify-center text-lg shrink-0">
                {session.icon}
              </div>

              {/* Session Info */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5 text-[10px] text-[#000000]/60 font-bold truncate">
                  <Clock className="w-3 h-3 text-[#5c4ade]" />
                  <span>{session.timeRange}</span>
                  <span>·</span>
                  <span className="truncate">{session.courtName}</span>
                </div>

                <h4 className="text-xs font-black text-[#000000] font-['Antonio',sans-serif] uppercase tracking-wide truncate">
                  {session.title}
                </h4>

                <div className="flex items-center gap-2 text-[10px] text-[#000000]/70 font-semibold truncate">
                  <span>ผู้สอน: {session.trainer}</span>
                  <span>·</span>
                  <span className="text-[#fb4903] font-bold">{session.attendeeCount} คน</span>
                </div>
              </div>

              {/* Join Button (Interactive VibeMove style) */}
              <button
                type="button"
                onClick={() => handleToggleJoin(session.id)}
                className={`px-3 py-1.5 rounded-[1600px] border border-[#000000] text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap flex items-center gap-1 ${
                  session.joined
                    ? 'bg-[#55db9c] text-[#000000]'
                    : 'bg-[#000000] text-[#ffffff] hover:bg-[#222222]'
                }`}
              >
                {session.joined ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>จอยแล้ว</span>
                  </>
                ) : (
                  <span>Join</span>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
