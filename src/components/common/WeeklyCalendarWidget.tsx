import React, { useState } from 'react';
import { Calendar as CalendarIcon, Check, Clock } from 'lucide-react';
import { playSelectSound, playSmashSound } from '../../utils/retroAudio';
import { useApp } from '../../context/AppContext';

interface CalendarSessionItem {
  id: string;
  timeRange: string;
  titleTh: string;
  titleEn: string;
  trainerTh: string;
  trainerEn: string;
  category: 'Match' | 'Yoga' | 'Drill' | 'Cardio';
  icon: string;
  courtNameTh: string;
  courtNameEn: string;
  intensity: 'Low' | 'Medium' | 'High';
  joined: boolean;
  attendeeCount: number;
}

const INITIAL_SESSIONS: Record<number, CalendarSessionItem[]> = {
  11: [
    {
      id: 'sess_1',
      timeRange: '18:00 - 19:30',
      titleTh: 'วอร์มอัปและยืดกล้ามเนื้อสำหรับนักแบด',
      titleEn: 'Yoga & Flexibility for Badminton',
      trainerTh: 'ครูแพรว (ผู้ฝึกสอนรับรอง)',
      trainerEn: 'Coach Praew (Certified)',
      category: 'Yoga',
      icon: '🧘',
      courtNameTh: 'คอร์ท 2 · วินเนอร์ อารีน่า',
      courtNameEn: 'Court 2 · Winner Arena',
      intensity: 'Low',
      joined: false,
      attendeeCount: 12,
    },
    {
      id: 'sess_2',
      timeRange: '19:30 - 21:00',
      titleTh: 'ก๊วนมือใหม่และสตรี ตีสบายๆ',
      titleEn: 'Beginner Friendly Match Play',
      trainerTh: 'โค้ชอาร์ท',
      trainerEn: 'Coach Art',
      category: 'Match',
      icon: '🏸',
      courtNameTh: 'คอร์ท 5 · ลาดพร้าว',
      courtNameEn: 'Court 5 · Ladprao',
      intensity: 'Medium',
      joined: false,
      attendeeCount: 16,
    },
  ],
  12: [
    {
      id: 'sess_3',
      timeRange: '19:00 - 20:30',
      titleTh: 'ฝึกสแมชเต็มแรงและสปีดฟุตเวิร์ก',
      titleEn: 'Full Body Smash & Footwork Drill',
      trainerTh: 'แดเนียล มัวร์ (อดีตเยาวชนทีมชาติ)',
      trainerEn: 'Daniel Moore (Ex-National)',
      category: 'Drill',
      icon: '⚡',
      courtNameTh: 'คอร์ท 3 · สแมช อารีน่า',
      courtNameEn: 'Court 3 · Smash Arena',
      intensity: 'High',
      joined: true,
      attendeeCount: 8,
    },
    {
      id: 'sess_4',
      timeRange: '20:30 - 22:30',
      titleTh: 'ก๊วนไดมอนด์ลีก แข่งขันคู่ผสม',
      titleEn: 'Diamond League Mixed Doubles',
      trainerTh: 'กานต์ และ โค้ชต้น',
      trainerEn: 'Karn & Coach Ton',
      category: 'Match',
      icon: '👥',
      courtNameTh: 'คอร์ท 1-2 · อินฟินิตี้ พระราม 9',
      courtNameEn: 'Courts 1-2 · Infinity Rama 9',
      intensity: 'High',
      joined: false,
      attendeeCount: 28,
    },
  ],
  13: [
    {
      id: 'sess_5',
      timeRange: '18:30 - 20:00',
      titleTh: 'แดนซ์คาร์ดิโอ เสริมความคล่องตัว',
      titleEn: 'Dance Cardio & Footwork Agility',
      trainerTh: 'โซเฟีย มาร์ติเนซ',
      trainerEn: 'Sophia Martinez',
      category: 'Cardio',
      icon: '🔥',
      courtNameTh: 'สตูดิโอ 1 · วินเนอร์ อารีน่า',
      courtNameEn: 'Studio 1 · Winner Arena',
      intensity: 'Medium',
      joined: false,
      attendeeCount: 14,
    },
  ],
  14: [
    {
      id: 'sess_6',
      timeRange: '19:00 - 21:00',
      titleTh: 'เทคนิคหน้าเน็ตและตบครอสคอร์ท',
      titleEn: 'Net Play Mastery & Cross-Court Smash',
      trainerTh: 'โค้ชท็อป',
      trainerEn: 'Coach Top',
      category: 'Drill',
      icon: '🎯',
      courtNameTh: 'คอร์ท 4 · สปอร์ต รีเฟรช',
      courtNameEn: 'Court 4 · Sport Refresh',
      intensity: 'Medium',
      joined: false,
      attendeeCount: 10,
    },
  ],
  15: [
    {
      id: 'sess_7',
      timeRange: '20:00 - 23:00',
      titleTh: 'ปาร์ตี้ตีแบดคืนวันศุกร์ ลูกขนไก่ไม่อั้น',
      titleEn: 'Friday Night Smash Party Buffet',
      trainerTh: 'ก๊วนนักตบกรุงเทพฯ',
      trainerEn: 'Bangkok Shuttlers Guild',
      category: 'Match',
      icon: '🍻',
      courtNameTh: 'คอร์ท 1-4 · 71 แบดมินตัน',
      courtNameEn: 'Courts 1-4 · 71 Badminton',
      intensity: 'High',
      joined: false,
      attendeeCount: 32,
    },
  ],
  16: [
    {
      id: 'sess_8',
      timeRange: '09:00 - 11:30',
      titleTh: 'ซ้อมเช้าวันเสาร์ ประลองฝีมือ',
      titleEn: 'Saturday Morning Sparring Session',
      trainerTh: 'โค้ชกานต์',
      trainerEn: 'Coach Karn',
      category: 'Match',
      icon: '☀️',
      courtNameTh: 'คอร์ท 3 · ลาดพร้าว',
      courtNameEn: 'Court 3 · Ladprao',
      intensity: 'Medium',
      joined: false,
      attendeeCount: 18,
    },
  ],
  17: [
    {
      id: 'sess_9',
      timeRange: '16:00 - 18:30',
      titleTh: 'จำลองการแข่งขันวันอาทิตย์ เก็บคะแนน',
      titleEn: 'Sunday Tournament Simulation',
      trainerTh: 'ทีมผู้ฝึกสอนทางการ',
      trainerEn: 'Official Smash Team',
      category: 'Match',
      icon: '🏆',
      courtNameTh: 'คอร์ท 1 · พระราม 9',
      courtNameEn: 'Court 1 · Rama 9',
      intensity: 'High',
      joined: false,
      attendeeCount: 24,
    },
  ],
};

const DAYS = [
  { dayEn: 'Mon', dayTh: 'จ.', dateNum: 11 },
  { dayEn: 'Tue', dayTh: 'อ.', dateNum: 12 },
  { dayEn: 'Wed', dayTh: 'พ.', dateNum: 13 },
  { dayEn: 'Thu', dayTh: 'พฤ.', dateNum: 14 },
  { dayEn: 'Fri', dayTh: 'ศ.', dateNum: 15 },
  { dayEn: 'Sat', dayTh: 'ส.', dateNum: 16 },
  { dayEn: 'Sun', dayTh: 'อา.', dateNum: 17 },
];

export const WeeklyCalendarWidget: React.FC = () => {
  const { language } = useApp();
  const isThai = language === 'th';

  const [selectedDate, setSelectedDate] = useState<number>(12);
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
      {/* Header - Single Language Only */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-[#000000] uppercase tracking-wide font-['Antonio',sans-serif] flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-[#fb4903]" />
          <span>{isThai ? 'ตารางกิจกรรมสัปดาห์นี้' : 'Weekly Schedule'}</span>
        </h2>
        <span className="text-[10px] font-bold text-[#000000]/60">
          {isThai ? 'ธันวาคม 2026' : 'December 2026'}
        </span>
      </div>

      {/* Horizontal Day Selector Strip */}
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
              className={`flex-1 min-w-[46px] py-2 px-1 rounded-[18px] border border-black/[0.08] shadow-xs flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-[#fb4903] text-[#ffffff] font-black shadow-sm scale-102 border-transparent'
                  : 'bg-[#ffffff] text-[#000000] hover:bg-[#f0f0f0]'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-[#ffffff]/90' : 'text-[#000000]/60'}`}>
                {isThai ? d.dayTh : d.dayEn}
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
          <div className="p-4 rounded-[20px] bg-[#ffffff] border border-black/[0.08] shadow-xs text-center text-xs font-bold text-[#000000]/60">
            {isThai ? 'ไม่มีกิจกรรมที่จัดในวันนี้ เลือกลองดูวันอื่นๆ ได้เลย' : 'No sessions scheduled for this day. Check other days.'}
          </div>
        ) : (
          currentSessions.map((session) => (
            <div
              key={session.id}
              className="p-3 rounded-[24px] bg-[#ffffff] border border-black/[0.06] shadow-sm flex items-center justify-between gap-2.5 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-[16px] bg-[#dceeff] flex items-center justify-center text-lg shrink-0">
                {session.icon}
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5 text-[10px] text-[#000000]/60 font-bold truncate">
                  <Clock className="w-3 h-3 text-[#5c4ade]" />
                  <span>{session.timeRange}</span>
                  <span>·</span>
                  <span className="truncate">{isThai ? session.courtNameTh : session.courtNameEn}</span>
                </div>

                <h4 className="text-xs font-black text-[#000000] font-['Antonio',sans-serif] uppercase tracking-wide truncate">
                  {isThai ? session.titleTh : session.titleEn}
                </h4>

                <div className="flex items-center gap-2 text-[10px] text-[#000000]/70 font-semibold truncate">
                  <span>{isThai ? `ผู้สอน: ${session.trainerTh}` : `Trainer: ${session.trainerEn}`}</span>
                  <span>·</span>
                  <span className="text-[#fb4903] font-bold">
                    {session.attendeeCount} {isThai ? 'คน' : 'players'}
                  </span>
                </div>
              </div>

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
                    <span>{isThai ? 'เข้าร่วมแล้ว' : 'Joined'}</span>
                  </>
                ) : (
                  <span>{isThai ? 'เข้าร่วม' : 'Join'}</span>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
