/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, QrCode, Zap, Calendar, Users, ArrowRight, Play, Share2, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const B4_BookingSuccessScreen: React.FC = () => {
  const { booking, selectedCourt, player, navigateTo } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title="Court Pass Confirmed" />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Slush Success Badge Header */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 rounded-full bg-[#55db9c] border border-black text-black flex items-center justify-center mx-auto mb-2 rotate-[-6deg] shadow-xs">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <h2 className="font-['Antonio'] text-3xl font-extrabold text-black uppercase tracking-tight leading-tight">
            BOOKING CONFIRMED!
          </h2>
          <p className="text-xs text-neutral-600 font-medium">
            Your digital pass is ready for courtside counter check-in.
          </p>
        </div>

        {/* EXP Reward Loot Card */}
        <div className="p-3.5 rounded-[28px] bg-[#ffd731] border border-black flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white border border-black text-black flex items-center justify-center font-bold">
              <Zap className="w-6 h-6 fill-[#fb4903] text-[#fb4903]" />
            </div>
            <div>
              <div className="font-['Antonio'] text-xl font-extrabold text-black uppercase leading-none">
                +100 EXP CLAIMED!
              </div>
              <div className="text-[11px] text-neutral-800 font-bold mt-0.5">
                Current Level: Lv.{player.level} ({player.currentExp} / {player.nextLevelExp} EXP)
              </div>
            </div>
          </div>
        </div>

        {/* Digital E-Ticket Pass (Slush Sticker Wallet Style) */}
        <div className="bg-white border border-black rounded-[32px] overflow-hidden shadow-xs">
          {/* Ticket Header */}
          <div className="p-4 bg-black text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#ffd731] uppercase tracking-wider block mb-0.5">
                BWF TARAFLEX PASS · SMASH.AI
              </span>
              <h3 className="font-['Antonio'] text-2xl font-extrabold text-white uppercase leading-none">
                {selectedCourt.name}
              </h3>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-[#55db9c] text-black border border-white text-xs font-black">
              COURT {booking.selectedCourtNumber || 3}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-[#dceeff]/50 border border-black">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Date & Time</span>
                <span className="font-bold text-black">{booking.date || '7 Nov 2026'} (19:00 - 21:00)</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#dceeff]/50 border border-black">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Pass Reference</span>
                <span className="font-mono font-bold text-black">{booking.bookingRef || 'BK-SMA-8921'}</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="py-2 text-center">
              <div className="w-32 h-32 bg-white border border-black rounded-2xl mx-auto p-2 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                  <rect x="0" y="0" width="30" height="30" fill="black" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" fill="black" />

                  <rect x="70" y="0" width="30" height="30" fill="black" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" fill="black" />

                  <rect x="0" y="70" width="30" height="30" fill="black" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" fill="black" />

                  <rect x="36" y="10" width="8" height="8" fill="black" />
                  <rect x="36" y="36" width="28" height="28" fill="black" />
                  <rect x="42" y="42" width="16" height="16" fill="white" />
                  <rect x="72" y="74" width="18" height="18" fill="black" />
                </svg>
              </div>
              <p className="text-[10px] text-neutral-500 font-bold mt-1.5 uppercase tracking-wide">
                Scan at Arena Gate or Counter
              </p>
            </div>
          </div>
        </div>

        {/* Complete User Flow Next Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => navigateTo('C1')}
            className="w-full py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-sm border border-black flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Match Scoring Now (Go to Court)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateTo('E2')}
              className="py-3 rounded-full bg-[#e9ccff] hover:bg-[#dfb5ff] border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Squad Party RSVP</span>
            </button>

            <button
              onClick={() => navigateTo('D1')}
              className="py-3 rounded-full bg-white hover:bg-neutral-100 border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>AI Coach Hub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
