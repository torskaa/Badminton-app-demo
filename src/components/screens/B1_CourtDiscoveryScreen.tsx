/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  ChevronRight,
  MessageSquare,
  Bell,
  Play,
  Flame,
  Zap,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourtFacility } from '../../types';

export const B1_CourtDiscoveryScreen: React.FC = () => {
  const { courts, setSelectedCourt, updateBooking, navigateTo, player } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'badminton' | 'pickleball' | 'tennis' | 'quickmatch'>('badminton');

  const categories = [
    { id: 'badminton', label: 'Badminton', icon: '🏸' },
    { id: 'pickleball', label: 'Pickleball', icon: '🏓' },
    { id: 'tennis', label: 'Tennis', icon: '🎾' },
    { id: 'quickmatch', label: 'Quick Match', icon: '⚡' },
  ];

  const quickMatchPlayers = [
    {
      name: 'กานต์ (Lv.14)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      sport: 'Badminton',
      tag: 'Diamond League',
      status: 'Ready Now',
    },
    {
      name: 'โอห์ม (Lv.12)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      sport: 'Badminton',
      tag: 'Smash Specialist',
      status: 'Court 3',
    },
    {
      name: 'แนนซี่ (Lv.16)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      sport: 'Double Mix',
      tag: 'Top Ranker',
      status: 'Open Partner',
    },
  ];

  const handleSelectCourt = (court: CourtFacility) => {
    setSelectedCourt(court);
    updateBooking({ court, selectedCourtNumber: 1 });
    navigateTo('B2');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f0f4f9] text-neutral-900 overflow-y-auto no-scrollbar pb-24 select-none">
      {/* Top Header: Jack Ray / Alex Carter Profile & Location (Matches Image 2) */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
            alt="Profile Avatar"
            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div>
            <div className="text-xs text-neutral-500 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0066ff]" />
              <span>Bangkok · Rama 9</span>
            </div>
            <div className="text-base font-extrabold text-neutral-900 tracking-tight">
              Jack Ray
            </div>
          </div>
        </div>

        {/* Right Action Pills (Chat & Bell, matches Image 2) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('E1')}
            className="w-10 h-10 rounded-full bg-white text-neutral-700 flex items-center justify-center shadow-sm hover:shadow border border-neutral-200/60 cursor-pointer transition-all"
            title="Chat & Community"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateTo('F1')}
            className="w-10 h-10 rounded-full bg-white text-neutral-700 flex items-center justify-center shadow-sm hover:shadow border border-neutral-200/60 cursor-pointer relative transition-all"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#d4ff00] border border-white" />
          </button>
        </div>
      </div>

      {/* Modern Search Pill Input (Matches Image 2) */}
      <div className="px-5 mt-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search court, coach, or sparring partner..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-neutral-200/80 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 shadow-xs"
          />
        </div>
      </div>

      {/* Horizontal Category Chips (Matches Image 2) */}
      <div className="px-5 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Category
          </h2>
          <span className="text-[11px] font-semibold text-[#0066ff] cursor-pointer">
            See All
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-[#0066ff] text-white shadow-sm scale-102'
                  : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/70 shadow-2xs'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vibrant Promo Card (Matches Image 3 "SMASH YOUR WAY FUN") */}
      <div className="px-5 mt-4">
        <div className="rounded-3xl p-4 bg-gradient-to-r from-[#d8ff00] via-[#c6f300] to-[#b3e600] text-neutral-950 shadow-md relative overflow-hidden flex items-center justify-between">
          <div className="z-10 max-w-[220px]">
            <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-extrabold uppercase tracking-wider inline-block mb-1.5">
              🔥 2x EXP BONUS
            </span>
            <h3 className="text-lg font-black leading-tight tracking-tight uppercase">
              SMASH YOUR WAY FUN
            </h3>
            <p className="text-[11px] text-neutral-800 font-medium mt-1">
              จองคอร์ทพรีเมียมวันนี้ รับส่วนลด 20% และแต้มยศลีกคูณสอง!
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-black/10 backdrop-blur-xs flex items-center justify-center shrink-0 text-2xl font-black rotate-6 shadow-xs">
            🏸
          </div>
        </div>
      </div>

      {/* Quick Match Row (Matches Image 2 right phone) */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Quick Match & Sparring
          </h2>
          <button
            onClick={() => navigateTo('E3')}
            className="text-[11px] font-semibold text-[#0066ff] cursor-pointer"
          >
            AI Matchmaker →
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {quickMatchPlayers.map((p, idx) => (
            <div
              key={idx}
              onClick={() => navigateTo('E3')}
              className="w-28 p-3 rounded-2xl bg-white border border-neutral-200/70 shadow-xs shrink-0 flex flex-col items-center text-center cursor-pointer hover:border-[#0066ff]/50 transition-all"
            >
              <div className="relative">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-100"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10b981] border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                  ✓
                </span>
              </div>
              <div className="text-[11px] font-bold text-neutral-900 mt-2 truncate w-full">
                {p.name}
              </div>
              <span className="text-[9px] text-[#0066ff] font-semibold mt-0.5">
                {p.sport}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Arena Card (Matches Image 2 & 3 Hero Card) */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Featured Courts
          </h2>
          <span className="text-[11px] font-semibold text-[#0066ff]">
            12 Arenas Near You
          </span>
        </div>

        {courts.slice(0, 3).map((court) => (
          <div
            key={court.id}
            onClick={() => handleSelectCourt(court)}
            className="mb-4 rounded-3xl bg-white border border-neutral-200/80 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all group"
          >
            {/* Image Header with badges */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
              <img
                src={court.imageUrl}
                alt={court.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Top Badges (Matches Image 2: "30min", "4.5 ★") */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide">
                  {court.hasAirCon ? '❄️ Air-Conditioned' : '🌿 Open Air'}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#d8ff00] text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{court.rating.toFixed(1)}</span>
                </span>
              </div>

              {/* Bottom Image Overlay with Title */}
              <div className="absolute bottom-3 inset-x-4 flex items-end justify-between text-white">
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">
                    {court.name}
                  </h3>
                  <p className="text-[11px] text-neutral-300 font-medium">
                    {court.location} · {court.courtCount} Courts
                  </p>
                </div>
                {/* Round Play/Arrow Button (Matches Image 2) */}
                <div className="w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg group-hover:bg-[#d8ff00] group-hover:scale-110 transition-all">
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Bottom Card Meta Details */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <img
                    className="w-6 h-6 rounded-full border border-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                    alt="Attendee"
                  />
                  <img
                    className="w-6 h-6 rounded-full border border-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                    alt="Attendee"
                  />
                  <div className="w-6 h-6 rounded-full bg-neutral-200 border border-white text-[9px] font-bold text-neutral-700 flex items-center justify-center">
                    +8
                  </div>
                </div>
                <span className="text-[11px] text-neutral-500 font-medium">
                  Players Active
                </span>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-neutral-900">
                  ฿{court.pricePerHour}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium"> / hr</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
