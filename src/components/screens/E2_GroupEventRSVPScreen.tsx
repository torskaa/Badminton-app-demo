import React from 'react';
import { Calendar, Users, MapPin, ArrowRight, CheckCircle2, UserPlus, Swords } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const E2_GroupEventRSVPScreen: React.FC = () => {
  const { currentEvent, toggleEventRsvp, player, navigateTo, gainExp } = useApp();

  const isUserAttending = currentEvent.attendees.some((a) => a.id === player.id);

  const totalExpense = currentEvent.courtFeeTotal + currentEvent.shuttlecockFeeTotal;
  const confirmedCount = currentEvent.attendees.length;
  const costPerPerson = confirmedCount > 0 ? (totalExpense / confirmedCount).toFixed(0) : '140';

  const handleToggleRSVP = () => {
    toggleEventRsvp(player.id);
    if (!isUserAttending) {
      gainExp(50, `ลงชื่อเข้าร่วมกิจกรรมก๊วน ${currentEvent.title}`);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      <MobileHeader title="Squad Event & Court RSVP" showBack />

      <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar pb-16">
        {/* Event Header Banner (Slush style) */}
        <div className="border border-[#000000] rounded-[32px] p-5 space-y-2.5 bg-[#ffffff]">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#55db9c] border border-[#000000] text-[#000000]">
              RSVP Open · Saturday
            </span>
            <span className="text-xs font-bold text-[#ff5c34]">
              เหลือ {currentEvent.maxPlayers - confirmedCount} ที่นั่ง
            </span>
          </div>

          <h2 className="font-['Antonio',sans-serif] text-2xl font-black uppercase leading-tight tracking-tight text-[#000000]">
            {currentEvent.title}
          </h2>

          <div className="space-y-1.5 text-xs text-[#000000]/70 font-medium pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#5c4ade]" />
              <span>{currentEvent.date} · {currentEvent.timeRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#ff5c34]" />
              <span>{currentEvent.courtName} (Court 3-6)</span>
            </div>
          </div>
        </div>

        {/* Automatic Split-Bill Calculator Card */}
        <div className="border border-[#000000] rounded-[28px] p-4 space-y-2 bg-[#ffd731]">
          <div className="flex items-center justify-between">
            <span className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
              AUTO SPLIT-BILL ESTIMATOR (หารค่าคอร์ท & ลูก)
            </span>
            <span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold uppercase tracking-[0.032em] bg-[#ffffff] border border-[#000000]">
              รวม ฿{totalExpense}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs font-bold text-[#000000]/80">
              เฉลี่ยจ่ายคนละประมาณ:
            </span>
            <div className="font-['Antonio',sans-serif] text-4xl font-black text-[#000000] leading-none">
              ~฿{costPerPerson} <span className="text-xs font-normal text-[#000000]/70">({confirmedCount} คน)</span>
            </div>
          </div>
        </div>

        {/* Confirmed Attendees List */}
        <div className="border border-[#000000] rounded-[28px] p-4 space-y-3 bg-[#ffffff]">
          <div className="flex items-center justify-between">
            <h3 className="font-['Antonio',sans-serif] text-sm font-black uppercase tracking-wider text-[#000000]">
              Confirmed Squad ({confirmedCount})
            </h3>
            <span className="text-xs font-bold text-[#000000]/60">Max {currentEvent.maxPlayers} คน</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {currentEvent.attendees.map((a) => (
              <div
                key={a.id}
                className="p-3 rounded-[20px] border border-[#000000] bg-[#ffffff] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold block truncate text-[#000000]">{a.name}</span>
                  <span className="text-[10px] text-[#000000]/60 font-medium">{a.tier} · OVR {a.ovr}</span>
                </div>
                {a.paid && (
                  <span className="px-2 py-0.5 rounded-[1600px] text-[9px] font-bold bg-[#55db9c] border border-[#000000] text-[#000000]">
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
            type="button"
            onClick={handleToggleRSVP}
            className={`w-full py-3.5 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 border border-[#000000] whitespace-nowrap ${
              isUserAttending
                ? 'bg-[#55db9c] text-[#000000]'
                : 'bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff]'
            }`}
          >
            {isUserAttending ? (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5] shrink-0" />
                <span className="whitespace-nowrap">ATTENDING (TAP TO CANCEL)</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">RSVP THIS SATURDAY (+50 EXP)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigateTo('E3')}
            className="w-full py-3 px-4 rounded-[1600px] font-bold text-xs uppercase tracking-[0.032em] border border-[#000000] flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] whitespace-nowrap"
          >
            <Swords className="w-3.5 h-3.5 text-[#5c4ade] shrink-0" />
            <span className="whitespace-nowrap">AI SMART MATCHMAKER (E3)</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
