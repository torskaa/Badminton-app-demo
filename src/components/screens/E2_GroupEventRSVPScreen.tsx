/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Users, Calculator, Check, CheckCircle2, Clock, MapPin, DollarSign, ArrowRight, ShieldCheck, UserPlus, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const E2_GroupEventRSVPScreen: React.FC = () => {
  const { currentEvent, toggleEventRsvp, player, navigateTo } = useApp();

  const isUserAttending = currentEvent.attendees.some((a) => a.id === player.id);

  const totalExpense = currentEvent.courtFeeTotal + currentEvent.shuttlecockFeeTotal;
  const confirmedCount = currentEvent.attendees.length;
  const costPerPerson = confirmedCount > 0 ? (totalExpense / confirmedCount).toFixed(0) : '140';

  const [paymentMarked, setPaymentMarked] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title="Squad Event & Court RSVP" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Event Header Banner (Slush Card with 1px black outline) */}
        <div className="bg-white border border-black rounded-[32px] p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-[#55db9c] border border-black text-black text-[10px] font-black uppercase">
              RSVP Open · Saturday
            </span>
            <span className="text-xs font-bold text-[#fb4903]">
              {currentEvent.maxPlayers - confirmedCount} Slots Left
            </span>
          </div>

          <h2 className="font-['Antonio'] text-3xl font-extrabold text-black uppercase leading-tight tracking-tight">
            {currentEvent.title}
          </h2>

          <div className="space-y-1 text-xs text-neutral-700 font-medium pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#5c4ade]" />
              <span>{currentEvent.date} · {currentEvent.timeRange}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#fb4903]" />
              <span>{currentEvent.courtName} (Court 3-6)</span>
            </div>
          </div>
        </div>

        {/* Automatic Split-Bill Calculator Card */}
        <div className="bg-[#ffd731] border border-black rounded-[28px] p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-['Antonio'] text-lg font-bold text-black uppercase tracking-tight">
              Auto Split-Bill Estimator
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white border border-black text-[10px] font-bold text-black">
              Total ฿{totalExpense}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs font-bold text-neutral-800">
              Estimated share per player:
            </span>
            <div className="font-['Antonio'] text-4xl font-extrabold text-black leading-none">
              ~฿{costPerPerson} <span className="text-xs font-normal">({confirmedCount} players)</span>
            </div>
          </div>
        </div>

        {/* Confirmed Attendees List */}
        <div className="bg-white border border-black rounded-[28px] p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-['Antonio'] text-xl font-bold uppercase text-black">
              Confirmed Squad ({confirmedCount})
            </h3>
            <span className="text-xs font-bold text-neutral-600">Max {currentEvent.maxPlayers}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {currentEvent.attendees.map((a) => (
              <div
                key={a.id}
                className="p-2.5 rounded-2xl bg-[#dceeff]/40 border border-black flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-black block truncate">{a.name}</span>
                  <span className="text-[10px] text-neutral-600 font-medium">{a.tier} · OVR {a.ovr}</span>
                </div>
                {a.paid && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#55db9c] text-black text-[9px] font-bold border border-black">
                    Paid
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Toggle RSVP Action */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => toggleEventRsvp(player.id)}
            className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-wider border border-black flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 shadow-sm ${
              isUserAttending
                ? 'bg-[#55db9c] text-black'
                : 'bg-black text-white hover:bg-neutral-800'
            }`}
          >
            {isUserAttending ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>You're Attending (+50 EXP Earned) · Tap to Cancel</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>RSVP Spot Now (+50 EXP Reward)</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateTo('E3')}
              className="py-3 rounded-full bg-white hover:bg-neutral-100 border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <span>AI Matchmaker Duel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigateTo('E1')}
              className="py-3 rounded-full bg-white hover:bg-neutral-100 border border-black text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <span>Guild Tavern HQ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
