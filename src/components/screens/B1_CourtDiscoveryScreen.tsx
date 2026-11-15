import React, { useState } from 'react';
import {
 Search,
 MapPin,
 Star,
 ChevronRight,
 MessageSquare,
 Bell,
 Zap,
 ArrowLeft,
 ArrowRight,
 SlidersHorizontal,
 X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DoodleAvatar } from '../common/DoodleAvatar';
import { CourtFacility } from '../../types';
import { CourtDiscoveryEmptyState } from '../common/CourtDiscoveryEmptyState';
import { SectionHeader } from '../common/SectionHeader';

export const B1_CourtDiscoveryScreen: React.FC = () => {
  const {
    courts,
    setSelectedCourt,
    updateBooking,
    navigateTo,
    goBack,
    player,
    setSparringModalPlayer,
    gainExp,
    language,
  } = useApp();
  const isThai = language === 'th';

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'badminton' | 'pickleball' | 'quickmatch' | 'tournaments'
  >('all');
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [suggestToast, setSuggestToast] = useState(false);

  const categories = [
    { id: 'all', label: isThai ? 'ทั้งหมด' : 'All', icon: '⚡', color: '#7cd7a0' },
    { id: 'badminton', label: isThai ? 'แบดมินตัน' : 'Badminton', icon: '🏸', color: '#7cd7a0' },
    { id: 'pickleball', label: isThai ? 'พิกเคิลบอล' : 'Pickleball', icon: '🏓', color: '#7cd7a0' },
    { id: 'quickmatch', label: isThai ? 'จับคู่ด่วน' : 'Quick Match', icon: '⚔️', color: '#e8f7ee' },
    { id: 'tournaments', label: isThai ? 'ทัวร์นาเมนต์' : 'Tournaments', icon: '🏆', color: '#e85729' },
  ];

  const quickMatchPlayers = [
    {
      id: 'p1',
      name: isThai ? 'กานต์ สายตบ' : 'Karn Smash',
      ovr: 88,
      tier: isThai ? 'ระดับไดมอนด์' : 'Diamond League',
      role: isThai ? 'ถนัดลูกตบหนัก' : 'Attacking Smash Specialist',
      status: isThai ? 'พร้อมดวลคอร์ท 3' : 'Ready at Court 3',
      winRate: 78,
      distance: '1.2 กม.',
      color: '#7cd7a0',
    },
    {
      id: 'p2',
      name: isThai ? 'โอห์ม ดักเน็ต' : 'Ohm Net Control',
      ovr: 82,
      tier: isThai ? 'ระดับโกลด์' : 'Gold League',
      role: isThai ? 'คุมจังหวะหน้าเน็ต' : 'Tactical Net Wizard',
      status: isThai ? 'หาคู่ซ้อมคู่ผสม' : 'Looking for Mixed Doubles',
      winRate: 72,
      distance: '2.5 กม.',
      color: '#e8f7ee',
    },
    {
      id: 'p3',
      name: isThai ? 'แนนซี่ เกมรับ' : 'Nancy Defense',
      ovr: 85,
      tier: isThai ? 'ระดับไดมอนด์' : 'Diamond League',
      role: isThai ? 'รับเหนียวแน่น' : 'Defensive Wall',
      status: isThai ? 'ว่างวันเสาร์ 18:00' : 'Free Sat 18:00',
      winRate: 81,
      distance: '3.1 กม.',
      color: '#7cd7a0',
    },
  ];

  const handleSelectCourt = (court: CourtFacility) => {
    setSelectedCourt(court);
    updateBooking({ court, selectedCourtNumber: 1 });
    navigateTo('B2');
  };

  const handleSuggestCourt = () => {
    gainExp(30, isThai ? 'เสนอสนามแบดมินตันใหม่' : 'Suggested a new badminton venue');
    setSuggestToast(true);
    setTimeout(() => setSuggestToast(false), 3000);
  };

  const filteredCourts = simulateEmpty
    ? []
    : courts.filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.location.toLowerCase().includes(searchTerm.toLowerCase());
        if (activeCategory === 'pickleball') return matchesSearch && c.surfaceType.includes('Synthetic');
        return matchesSearch;
      });

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28 bg-[#f4f8fb] text-[#000000]">
      {/* 1. Header */}
      <div className="app-header-safe px-5 pb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={goBack}
            className="w-8 h-8 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#e9e9e9] active:scale-90 transition-transform shadow-xs"
            aria-label={isThai ? 'ย้อนกลับ' : 'Back'}
            title={isThai ? 'ย้อนกลับ' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div
            onClick={() => navigateTo('F1')}
            className="cursor-pointer hover:scale-105 active:scale-95 transition-transform shrink-0"
          >
            <DoodleAvatar preset="karn" size="sm" ringClass="border-2 border-[#000000] shadow-xs" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-[#000000]/70 font-bold tracking-[0.032em] flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#e85729] shrink-0" />
              <span className="truncate">{isThai ? 'กรุงเทพฯ · พระราม 9' : 'Bangkok · Rama 9'}</span>
            </div>
            <div className="font-['Antonio',sans-serif] text-lg font-black uppercase tracking-tight leading-none mt-0.5 truncate">
              {isThai ? `สวัสดี ${player.name}` : `Hi, ${player.name}`}
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo('E1')}
            className="w-9 h-9 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center transition-all cursor-pointer hover:bg-[#e8f7ee] active:scale-95"
            title={isThai ? 'แชทก๊วน' : 'Guild Chat'}
          >
            <MessageSquare className="w-4 h-4 text-[#000000]" />
          </button>
          <button
            type="button"
            onClick={() => navigateTo('D2')}
            className="w-9 h-9 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center transition-all cursor-pointer hover:bg-[#7cd7a0] active:scale-95 relative"
            title={isThai ? 'แจ้งเตือนภารกิจ' : 'Quest Alerts'}
          >
            <Bell className="w-4 h-4 text-[#000000]" />
            <span className="w-2 h-2 rounded-full bg-[#e85729] absolute top-1.5 right-1.5" />
          </button>
        </div>
      </div>

      {/* 2. Search Pill Bar */}
      <div className="px-4 mt-2">
        <div className="w-full flex items-center gap-2.5 px-4 py-3 rounded-[1600px] bg-[#ffffff] focus-within:bg-[#ffffff]">
          <Search className="w-4 h-4 text-[#000000]/60 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isThai ? 'ค้นหาสนาม คู่ซ้อม หรือคอร์ทว่าง...' : 'Search court, sparring partner, drills...'}
            className="w-full bg-transparent text-xs font-bold tracking-[0.032em] focus:outline-none placeholder:text-[#000000]/40 text-[#000000]"
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} className="text-[#000000]/60 hover:text-[#000000]">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => navigateTo('B2')}
            className="p-1 rounded-[1600px] text-[#000000]/70 hover:text-[#000000]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Category Filter Horizontal Strip */}
      <div className="px-4 mt-3.5">
        <div data-filter="true" className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-[1600px] text-xs font-bold tracking-[0.032em] shrink-0 transition-transform active:scale-95 cursor-pointer border border-[#000000] whitespace-nowrap ${
                  isActive
                    ? 'bg-[#000000] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Hero Promo Banner */}
      <div className="px-4 mt-4">
        <div
          onClick={() => handleSelectCourt(courts[0])}
          className="rounded-[28px] p-5 bg-[#ffffff] relative overflow-hidden cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="px-3 py-1 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-[10px] font-bold tracking-[0.032em] uppercase flex items-center gap-1 whitespace-nowrap">
                <Zap className="w-3 h-3 fill-current text-[#000000]" />
                <span>{isThai ? 'ลด 20% ช่วงเวลาพิเศษ' : '20% OFF PRIME TIME'}</span>
              </span>
              <div className="flex items-center gap-1 text-xs font-black text-[#000000]">
                <Star className="w-3.5 h-3.5 fill-[#e85729] stroke-[#000000]" />
                <span>4.9 (128)</span>
              </div>
            </div>

            <h3 className="font-['Antonio',sans-serif] text-2xl font-black uppercase tracking-tight leading-tight text-[#000000]">
              {courts[0].name}
            </h3>
            <p className="text-xs text-[#000000]/70 font-bold mt-0.5">
              {courts[0].location} · {courts[0].surfaceType}
            </p>

            <div className="flex items-center justify-between mt-4 pt-3">
              <div>
                <span className="text-[10px] text-[#000000]/60 font-bold tracking-[0.032em] uppercase block">
                  {isThai ? 'เริ่มต้น' : 'Starts from'}
                </span>
                <span className="text-lg font-black text-[#000000]">
                  ฿{courts[0].pricePerHour}
                  <span className="text-xs font-normal text-[#000000]/60">{isThai ? '/ชม.' : '/hr'}</span>
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectCourt(courts[0]);
                }}
                className="px-5 py-2.5 rounded-[1600px] bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] font-bold text-xs tracking-[0.032em] uppercase border border-[#000000] flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">{isThai ? 'จองคอร์ท' : 'BOOK COURT'}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Quick Actions 4-Pill Strip */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <button
            type="button"
            onClick={() => handleSelectCourt(courts[0])}
            className="p-3 rounded-[24px] bg-[#ffffff] border border-[#000000] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-[1600px] bg-[#7cd7a0] mx-auto mb-1 flex items-center justify-center font-bold text-base">
              🏸
            </div>
            <span className="text-[10px] font-bold tracking-[0.032em] block truncate uppercase text-[#000000]">
              {isThai ? 'จองคอร์ท' : 'Book Court'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('E3')}
            className="p-3 rounded-[24px] bg-[#ffffff] border border-[#000000] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-[1600px] bg-[#7cd7a0] mx-auto mb-1 flex items-center justify-center font-bold text-base">
              ⚔️
            </div>
            <span className="text-[10px] font-bold tracking-[0.032em] block truncate uppercase text-[#000000]">
              {isThai ? 'จัดทีมก๊วน' : 'Matchmaker'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('C3')}
            className="p-3 rounded-[24px] bg-[#ffffff] border border-[#000000] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-[1600px] bg-[#7cd7a0] mx-auto mb-1 flex items-center justify-center font-bold text-base">
              📊
            </div>
            <span className="text-[10px] font-bold tracking-[0.032em] block truncate uppercase text-[#000000]">
              {isThai ? 'ฮีทแมพสถิติ' : 'Heatmap'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('E1')}
            className="p-3 rounded-[24px] bg-[#ffffff] border border-[#000000] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-[1600px] bg-[#e8f7ee] mx-auto mb-1 flex items-center justify-center font-bold text-base">
              🏆
            </div>
            <span className="text-[10px] font-bold tracking-[0.032em] block truncate uppercase text-[#000000]">
              {isThai ? 'ก๊วนแข่ง' : 'Squads'}
            </span>
          </button>
        </div>
      </div>

      {/* 6. Quick Match Sparring Partners */}
      <div className="px-4 mt-5 space-y-2.5">
        <SectionHeader
          title={isThai ? 'ชวนดวลสปีด' : 'QUICK MATCH SPARRING'}
          subtitle={isThai ? 'แตะเพื่อส่งคำท้าดวล' : 'Tap to challenge immediately'}
          rightSlot={
            <button
              type="button"
              onClick={() => navigateTo('E3')}
              className="text-xs font-bold tracking-[0.032em] text-[#000000] hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              {isThai ? 'ดูทั้งหมด →' : 'See all →'}
            </button>
          }
        />

        <div className="grid grid-cols-3 gap-2">
          {quickMatchPlayers.map((p) => (
            <div
              key={p.id}
              onClick={() => setSparringModalPlayer(p)}
              className="rounded-[24px] p-3 text-center cursor-pointer transition-transform hover:scale-105 active:scale-95 bg-[#ffffff]"
            >
              <div
                className="w-10 h-10 rounded-[1600px] mx-auto mb-1.5 flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: p.color }}
              >
                🏸
              </div>
              <h4 className="text-[11px] font-bold truncate leading-tight text-[#000000]">{p.name}</h4>
              <span className="inline-block px-2 py-0.5 rounded-[1600px] text-[9px] font-bold tracking-[0.032em] mt-1 bg-[#000000] text-[#ffffff] whitespace-nowrap">
                {isThai ? `พลัง ${p.ovr}` : `${p.ovr} OVR`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Available Arenas */}
      <div className="px-4 mt-5 space-y-3">
        <SectionHeader
          title={isThai ? 'สนามแนะนำในกรุงเทพฯ' : 'AVAILABLE ARENAS'}
          rightSlot={
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSimulateEmpty(!simulateEmpty)}
                className={`text-[10px] font-bold tracking-[0.032em] px-2.5 py-0.5 rounded-[1600px] border border-[#000000] cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  simulateEmpty ? 'bg-[#e85729] text-[#ffffff]' : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                }`}
              >
                {simulateEmpty ? (isThai ? '✕ ปิดจำลอง' : '✕ Reset') : isThai ? 'จำลองว่าง' : 'Test Empty'}
              </button>
              <span className="text-xs text-[#000000]/60 font-bold whitespace-nowrap">
                {isThai ? `${filteredCourts.length} สนาม` : `${filteredCourts.length} Arenas`}
              </span>
            </div>
          }
        />

        {suggestToast && (
          <div className="p-3 rounded-[20px] bg-[#7cd7a0] text-xs font-bold text-[#000000] text-center animate-bounce">
            {isThai
              ? '🎉 ส่งข้อมูลสนามใหม่สำเร็จ (+30 EXP)'
              : '🎉 Venue suggested! +30 EXP added'}
          </div>
        )}

        {filteredCourts.length === 0 ? (
          <CourtDiscoveryEmptyState
            searchTerm={searchTerm}
            onResetFilters={() => {
              setSearchTerm('');
              setActiveCategory('all');
              setSimulateEmpty(false);
            }}
            onSuggestCourt={handleSuggestCourt}
          />
        ) : (
          filteredCourts.map((court) => (
            <div
              key={court.id}
              onClick={() => handleSelectCourt(court)}
              className="rounded-[28px] p-4 flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] bg-[#ffffff]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2.5 py-0.5 rounded-[1600px] text-[9px] font-bold tracking-[0.032em] uppercase bg-[#7cd7a0] text-[#000000] shrink-0 whitespace-nowrap">
                    {court.surfaceType}
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] font-black text-[#000000] shrink-0">
                    <Star className="w-3.5 h-3.5 fill-[#e85729] stroke-[#000000]" />
                    <span>{court.rating}</span>
                  </div>
                </div>

                <h4 className="font-['Antonio',sans-serif] text-lg font-black tracking-tight leading-tight text-[#000000] truncate">
                  {court.name}
                </h4>
                <p className="text-[11px] text-[#000000]/70 font-medium mt-0.5 truncate">
                  {court.location} · {isThai ? `${court.courtCount} คอร์ท · ${court.distanceKm} กม.` : `${court.courtCount} Courts · ${court.distanceKm} km`}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-base font-black text-[#000000] whitespace-nowrap">
                  ฿{court.pricePerHour}
                  <span className="text-[10px] font-normal text-[#000000]/60">{isThai ? '/ชม.' : '/hr'}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCourt(court);
                  }}
                  className="mt-1.5 px-3.5 py-1.5 rounded-[1600px] text-[10px] font-bold tracking-[0.032em] uppercase flex items-center gap-1 transition-transform active:scale-95 bg-[#000000] text-[#ffffff] border border-[#000000] hover:bg-[#1a1a1a] whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">{isThai ? 'เลือกสนาม' : 'SELECT COURT'}</span>
                  <ChevronRight className="w-3 h-3 shrink-0" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
