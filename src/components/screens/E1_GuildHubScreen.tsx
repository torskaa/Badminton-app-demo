/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Shield, Calendar, Trophy, ChevronRight, Sparkles, Plus, Award, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const E1_GuildHubScreen: React.FC = () => {
  const { guilds, currentEvent, navigateTo } = useApp();

  return (
    <div className="flex-1 flex flex-col bg-[#f0f4f9] text-neutral-900 select-none pb-24 overflow-y-auto no-scrollbar">
      <MobileHeader title="คอมมูนิตี้ & ก๊วนแบดมินตัน" />

      <div className="p-4 space-y-4">
        {/* Community Banner */}
        <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0066ff]/10 text-[#0066ff] flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#0066ff] uppercase tracking-wider block">
                Guild & Squad Hub
              </span>
              <h3 className="text-xs font-extrabold text-neutral-900 mt-0.5">
                รวมกลุ่มตีแบด หารค่าคอร์ท & จัดคู่สูสีด้วย AI
              </h3>
            </div>
          </div>
        </div>

        {/* Featured Upcoming Guild Event Banner */}
        <div
          onClick={() => navigateTo('E2')}
          className="p-5 rounded-3xl bg-white border-2 border-[#d8ff00] hover:border-black transition-all cursor-pointer shadow-md space-y-3 group"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="px-3 py-1 rounded-full bg-[#d8ff00] text-black font-extrabold text-[10px] flex items-center gap-1">
              <Calendar className="w-3 h-3" /> กิจกรรมถัดไปประจำสัปดาห์
            </span>
            <span className="text-emerald-700 font-mono text-[11px] font-bold">
              {currentEvent.attendees.length}/{currentEvent.maxPlayers} คนลงชื่อแล้ว
            </span>
          </div>

          <div>
            <h3 className="text-base font-extrabold text-neutral-900 group-hover:text-[#0066ff] transition-colors">
              {currentEvent.title}
            </h3>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              {currentEvent.courtName} · {currentEvent.date} ({currentEvent.timeRange})
            </p>
          </div>

          {/* Attendees Faces & Split Bill preview */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {currentEvent.attendees.slice(0, 4).map((att) => (
                  <img
                    key={att.id}
                    src={att.avatar}
                    alt={att.name}
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <span className="text-[11px] text-neutral-500 font-medium">
                หารเฉลี่ย <strong>฿{Math.round((currentEvent.courtFeeTotal + currentEvent.shuttlecockFeeTotal) / (currentEvent.attendees.length || 1))} /คน</strong>
              </span>
            </div>

            <span className="font-extrabold text-[#0066ff] text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>ลงชื่อ RSVP</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => navigateTo('E3')}
            className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs cursor-pointer hover:border-[#0066ff] hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs font-black text-neutral-900 group-hover:text-[#0066ff] transition-colors">
              AI Smart Matchmaker
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              จัดทีมแบ่งสายแต้มสูสี 50/50
            </div>
          </div>

          <div
            onClick={() => navigateTo('E4')}
            className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs cursor-pointer hover:border-[#0066ff] hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-2">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="text-xs font-black text-neutral-900 group-hover:text-purple-700 transition-colors">
              ตารางลีก & ลีดเดอร์บอร์ด
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              ไต่อันดับคะแนนประจำสัปดาห์
            </div>
          </div>
        </div>

        {/* My Guilds List */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
              ก๊วนแบดของคุณ (My Active Squads)
            </h4>
            <span className="text-[11px] font-bold text-[#0066ff] cursor-pointer">
              + สร้างก๊วนใหม่
            </span>
          </div>

          <div className="space-y-3">
            {guilds.map((g) => (
              <div
                key={g.id}
                onClick={() => navigateTo('E2')}
                className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs cursor-pointer hover:border-neutral-300 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-[#d8ff00] font-black text-sm flex items-center justify-center border border-neutral-100 shadow-xs">
                    {g.tag}
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-neutral-900">
                      {g.name}
                    </h5>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {g.memberCount} สมาชิก · {g.homeCourt}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                    Lv.{g.level}
                  </span>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">
                    {g.regularDays}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
