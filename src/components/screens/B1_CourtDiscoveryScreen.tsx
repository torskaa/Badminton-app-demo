/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Star,
  ChevronRight,
  MessageSquare,
  Bell,
  Play,
  Flame,
  Zap,
  Users,
  Trophy,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourtFacility } from '../../types';

export const B1_CourtDiscoveryScreen: React.FC = () => {
  const { courts, setSelectedCourt, updateBooking, navigateTo, player } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'badminton' | 'pickleball' | 'tennis' | 'quickmatch'>('badminton');

  const categories = [
    { id: 'badminton', label: 'Badminton', icon: '🏸', color: '#4da2ff' },
    { id: 'pickleball', label: 'Pickleball', icon: '🏓', color: '#ffd731' },
    { id: 'tennis', label: 'Tennis', icon: '🎾', color: '#55db9c' },
    { id: 'quickmatch', label: 'Quick Spar', icon: '⚡', color: '#fb4903' },
  ];

  const quickMatchPlayers = [
    {
      name: 'กานต์ (Lv.14)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      sport: 'Badminton',
      tag: 'Diamond League',
      status: 'Ready Now',
      color: '#ffd731',
    },
    {
      name: 'โอห์ม (Lv.12)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      sport: 'Badminton',
      tag: 'Smash Specialist',
      status: 'Court 3',
      color: '#4da2ff',
    },
    {
      name: 'แนนซี่ (Lv.16)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      sport: 'Double Mix',
      tag: 'Top Ranker',
      status: 'Open Partner',
      color: '#e9ccff',
    },
  ];

  const handleSelectCourt = (court: CourtFacility) => {
    setSelectedCourt(court);
    updateBooking({ court, selectedCourtNumber: 1 });
    navigateTo('B2');
  };

  const filteredCourts = courts.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#dceeff] text-black overflow-y-auto no-scrollbar pb-24 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header: Jack Ray Profile & Location */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#ffd731] border border-black flex items-center justify-center font-['Antonio'] text-xl font-bold shadow-xs">
            JR
          </div>
          <div>
            <div className="text-xs text-neutral-600 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#fb4903]" />
              <span>Bangkok · Rama 9</span>
            </div>
            <div className="font-['Antonio'] text-xl font-black text-black tracking-tight leading-none uppercase">
              Jack Ray · Lv.{player.level}
            </div>
          </div>
        </div>

        {/* Right Action Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('E1')}
            className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 text-black border border-black flex items-center justify-center cursor-pointer transition-transform active:scale-95"
            title="Chat & Community"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateTo('F1')}
            className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 text-black border border-black flex items-center justify-center cursor-pointer relative transition-transform active:scale-95"
            title="Profile & Trophy"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input Bar (Slush Pill Style) */}
      <div className="px-5 mt-2">
        <div className="w-full bg-white border border-black rounded-full px-4 py-2.5 flex items-center gap-2.5 shadow-xs">
          <Search className="w-4 h-4 text-black" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search BWF Taraflex courts, areas..."
            className="w-full text-xs font-bold text-black placeholder:text-neutral-500 outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Category Pills (Multi-color Sticker Set) */}
      <div className="px-5 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-['Antonio'] text-lg font-bold text-black uppercase tracking-tight">
            Sports & Quick Match
          </h2>
          <span className="text-xs font-bold text-neutral-600">4 Categories</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  if (cat.id === 'quickmatch') navigateTo('E3');
                }}
                className={`px-4 py-2 rounded-full border border-black text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-transform cursor-pointer active:scale-95 ${
                  isActive ? 'scale-105' : 'bg-white hover:bg-neutral-50 text-black'
                }`}
                style={{ backgroundColor: isActive ? cat.color : '#ffffff' }}
              >
                <span>{cat.icon}</span>
                <span className="text-black">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Arena Banner (Slush Card with Inflatable Ribbon Tag) */}
      <div className="px-5 mt-4">
        <div
          onClick={() => handleSelectCourt(courts[0])}
          className="w-full bg-white border border-black rounded-[32px] p-4 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform relative overflow-hidden group shadow-xs"
        >
          {/* Top Info Bar */}
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 rounded-full bg-[#ffd731] border border-black text-[10px] font-black uppercase text-black flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              <span>2X EXP Prime Time</span>
            </span>
            <div className="flex items-center gap-1 text-xs font-black text-black">
              <Star className="w-3.5 h-3.5 fill-[#ffd731] stroke-black" />
              <span>4.9 (128 reviews)</span>
            </div>
          </div>

          <h3 className="font-['Antonio'] text-3xl font-extrabold text-black uppercase tracking-tight leading-tight">
            {courts[0].name}
          </h3>
          <p className="text-xs text-neutral-600 font-medium mt-0.5">
            {courts[0].location} · {courts[0].surfaceType} · {courts[0].courtCount} Courts Available
          </p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-200">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Starts from</span>
              <div className="font-['Antonio'] text-xl font-bold text-black leading-none">
                ฿{courts[0].pricePerHour}<span className="text-xs text-neutral-600 font-normal">/hr</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectCourt(courts[0]);
              }}
              className="px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold border border-black flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span>Select Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Sparring Partners Strip */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-['Antonio'] text-lg font-bold text-black uppercase tracking-tight">
            Quick Match Sparring
          </h2>
          <button
            onClick={() => navigateTo('E3')}
            className="text-xs font-bold text-[#5c4ade] hover:underline cursor-pointer"
          >
            See All Matchmakers →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {quickMatchPlayers.map((p, i) => (
            <div
              key={i}
              onClick={() => navigateTo('E3')}
              className="bg-white border border-black rounded-[22px] p-2.5 text-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              style={{ backgroundColor: p.color }}
            >
              <div className="w-10 h-10 rounded-full bg-white border border-black mx-auto mb-1 flex items-center justify-center font-bold text-sm">
                🏸
              </div>
              <h4 className="text-[11px] font-bold text-black truncate leading-tight">{p.name}</h4>
              <span className="inline-block px-1.5 py-0.5 rounded-full bg-white border border-black text-[9px] font-bold text-black mt-1">
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* More Available Courts */}
      <div className="px-5 mt-5 space-y-3">
        <h2 className="font-['Antonio'] text-lg font-bold text-black uppercase tracking-tight">
          All Arenas in Bangkok
        </h2>

        {filteredCourts.slice(1).map((court) => (
          <div
            key={court.id}
            onClick={() => handleSelectCourt(court)}
            className="bg-white border border-black rounded-[24px] p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform"
          >
            <div>
              <span className="px-2 py-0.5 rounded-full bg-[#55db9c] border border-black text-[9px] font-extrabold uppercase text-black inline-block mb-1">
                {court.surfaceType}
              </span>
              <h4 className="font-['Antonio'] text-xl font-bold text-black uppercase leading-tight">
                {court.name}
              </h4>
              <p className="text-[11px] text-neutral-600">{court.location} · {court.courtCount} Courts</p>
            </div>

            <div className="text-right shrink-0">
              <div className="font-['Antonio'] text-lg font-bold text-black">
                ฿{court.pricePerHour}/hr
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#5c4ade] mt-1">
                <span>Book Slot</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
