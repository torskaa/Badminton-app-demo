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
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title="ระบบคอมมูนิตี้ & ก๊วนแบดมินตัน" />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Community Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                Guild & Squad Hub
              </span>
              <h3 className="text-xs font-black text-white">
                รวมกลุ่มตีแบด หารค่าคอร์ท & จัดคู่สูสีด้วย AI
              </h3>
            </div>
          </div>
        </div>

        {/* Featured Upcoming Guild Event Banner */}
        <div
          onClick={() => navigateTo('E2')}
          className="p-4 rounded-3xl bg-gradient-to-b from-[#131b2e] to-[#0d1320] border-2 border-lime-400/40 hover:border-lime-400 transition-all cursor-pointer shadow-lg space-y-2.5 group"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-lime-400 text-slate-950 font-black text-[10px] flex items-center gap-1">
              <Calendar className="w-3 h-3" /> กิจกรรมถัดไปประจำสัปดาห์
            </span>
            <span className="text-lime-400 font-mono text-[11px] font-bold">
              {currentEvent.attendees.length}/{currentEvent.maxPlayers} คนลงชื่อแล้ว
            </span>
          </div>

          <div>
            <h3 className="text-sm font-black text-white group-hover:text-lime-400 transition-colors">
              {currentEvent.title}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {currentEvent.courtName} · {currentEvent.date} ({currentEvent.timeRange})
            </p>
          </div>

          {/* Attendees Faces & Split Bill preview */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex -space-x-2 overflow-hidden">
              {currentEvent.attendees.slice(0, 5).map((att, i) => (
                <div
                  key={att.id}
                  className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 text-slate-200 text-[10px] font-bold flex items-center justify-center uppercase font-mono"
                >
                  {att.name[0]}
                </div>
              ))}
              {currentEvent.attendees.length > 5 && (
                <div className="w-7 h-7 rounded-full bg-lime-400 text-slate-950 text-[10px] font-bold flex items-center justify-center font-mono">
                  +{currentEvent.attendees.length - 5}
                </div>
              )}
            </div>

            <span className="text-lime-400 font-bold flex items-center gap-1 text-[11px]">
              <span>ระบบหารค่าคอร์ทอัตโนมัติ</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* Guilds List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-lime-400" />
              <span>ก๊วนแบดที่คุณเป็นสมาชิก ({guilds.length})</span>
            </label>
            <span className="text-[10px] text-lime-400 font-mono font-bold">+ สร้างก๊วนใหม่</span>
          </div>

          {guilds.map((guild) => (
            <div
              key={guild.id}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-slate-950 font-mono shadow-sm"
                    style={{ backgroundColor: guild.avatarColor }}
                  >
                    {guild.tag.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-extrabold text-white">
                        {guild.name}
                      </h4>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-lime-400 font-mono font-bold border border-slate-700">
                        Lv.{guild.level}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      สมาชิก {guild.memberCount}/{guild.maxMembers} คน · {guild.homeCourt}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    Active
                  </span>
                </div>
              </div>

              {/* Regular Schedule */}
              <div className="text-[11px] text-slate-300 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <span>ตารางนัดตี: {guild.regularDays}</span>
              </div>

              {/* Perks */}
              <div className="flex flex-wrap gap-1">
                {guild.guildPerks.map((perk, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    ★ {perk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Shortcuts: AI Matchmaker & Leaderboard */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => navigateTo('E3')}
            className="p-3 rounded-2xl bg-[#0f1524] border border-cyan-500/30 hover:border-cyan-400 text-left cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-400/20 text-cyan-400 flex items-center justify-center mb-1.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs font-black text-white">AI Smart Matchmaker</div>
            <div className="text-[10px] text-slate-400 mt-0.5">จัดทีม 2v2 สูสี 50/50</div>
          </button>

          <button
            onClick={() => navigateTo('E4')}
            className="p-3 rounded-2xl bg-[#0f1524] border border-amber-500/30 hover:border-amber-400 text-left cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-1.5">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-xs font-black text-white">Group Leaderboard</div>
            <div className="text-[10px] text-slate-400 mt-0.5">ตารางลีกประจำเดือน</div>
          </button>
        </div>
      </div>

      {/* Primary Action */}
      <div className="px-4 pt-2 shrink-0">
        <button
          onClick={() => navigateTo('E2')}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-300 text-slate-950 font-black text-sm shadow-[0_4px_16px_rgba(204,255,0,0.35)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4 stroke-[2.5]" />
          <span>เปิดดูกิจกรรมนัดตี & จัดการ RSVP ยอดหาร</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
