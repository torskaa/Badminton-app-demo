/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Shield, Calendar, Trophy, ChevronRight, Sparkles, Plus, Award, UserCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const E1_GuildHubScreen: React.FC = () => {
  const { guilds, currentEvent, navigateTo } = useApp();

  return (
    <div className="flex-1 flex flex-col bg-[#dceeff] text-black select-none pb-24 overflow-y-auto no-scrollbar font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title="Guilds & Community" />

      <div className="p-4 space-y-4">
        {/* Community Header Banner */}
        <div className="bg-white border border-black rounded-[32px] p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#e9ccff] border border-black flex items-center justify-center font-bold text-black rotate-[-6deg]">
              <Users className="w-6 h-6 stroke-[2.4]" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-[#55db9c] border border-black text-[9px] font-black uppercase text-black inline-block mb-0.5">
                Community HQ
              </span>
              <h2 className="font-['Antonio'] text-2xl font-black text-black uppercase leading-tight">
                BANGKOK SMASHERS GUILD
              </h2>
              <p className="text-xs text-neutral-600 font-medium">
                Split court fees, party with friends & match fair duels with AI.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Upcoming Guild Event Banner (Slush Sticker Card) */}
        <div
          onClick={() => navigateTo('E2')}
          className="bg-white border border-black rounded-[32px] p-4 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="px-3 py-1 rounded-full bg-[#ffd731] border border-black text-black font-extrabold text-[10px] uppercase flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Next Saturday Session
            </span>
            <span className="text-black font-bold text-xs bg-[#55db9c] px-2.5 py-0.5 rounded-full border border-black">
              {currentEvent.attendees.length}/{currentEvent.maxPlayers} RSVP'd
            </span>
          </div>

          <div>
            <h3 className="font-['Antonio'] text-3xl font-extrabold text-black uppercase leading-tight tracking-tight">
              {currentEvent.title}
            </h3>
            <p className="text-xs text-neutral-600 font-medium mt-0.5">
              {currentEvent.courtName} · {currentEvent.date} ({currentEvent.timeRange})
            </p>
          </div>

          {/* Split Bill preview & Attend button */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Estimated Split</span>
              <div className="font-['Antonio'] text-xl font-bold text-black leading-none">
                ~฿{Math.round((currentEvent.courtFeeTotal + currentEvent.shuttlecockFeeTotal) / currentEvent.maxPlayers)}/person
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateTo('E2');
              }}
              className="px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold border border-black flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span>RSVP Party</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => navigateTo('E3')}
            className="bg-[#ffd731] border border-black rounded-[24px] p-3.5 text-left cursor-pointer hover:scale-105 active:scale-95 transition-transform flex flex-col justify-between h-28"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-black flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <h4 className="font-['Antonio'] text-xl font-bold text-black uppercase leading-tight">
                AI Matchmaker
              </h4>
              <p className="text-[10px] text-neutral-800 font-bold">Find 96% Match Opponents →</p>
            </div>
          </button>

          <button
            onClick={() => navigateTo('E4')}
            className="bg-[#e9ccff] border border-black rounded-[24px] p-3.5 text-left cursor-pointer hover:scale-105 active:scale-95 transition-transform flex flex-col justify-between h-28"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-black flex items-center justify-center font-bold">
              🏆
            </div>
            <div>
              <h4 className="font-['Antonio'] text-xl font-bold text-black uppercase leading-tight">
                Leaderboards
              </h4>
              <p className="text-[10px] text-neutral-800 font-bold">Top Smashers Ranking →</p>
            </div>
          </button>
        </div>

        {/* Guild Roster & Active Guilds */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-['Antonio'] text-xl font-bold uppercase text-black">
              Featured Bangkok Guilds
            </h3>
            <span className="text-xs font-bold text-neutral-600">3 Verified</span>
          </div>

          <div className="space-y-2">
            {guilds.map((g) => (
              <div
                key={g.id}
                onClick={() => navigateTo('E2')}
                className="p-3 rounded-2xl bg-[#dceeff]/40 border border-black flex items-center justify-between gap-3 cursor-pointer hover:bg-[#dceeff] transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-black">{g.name}</h4>
                  <p className="text-[10px] text-neutral-600">{g.homeCourt} · {g.memberCount} members</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white border border-black text-[10px] font-bold text-black shrink-0">
                  Join Party
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
