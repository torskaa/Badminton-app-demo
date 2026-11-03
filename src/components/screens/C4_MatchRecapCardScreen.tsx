/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Share2, Download, Check, Sparkles, Trophy, Zap, Flame, Award, ArrowLeft, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileHeader } from '../common/MobileHeader';

export const C4_MatchRecapCardScreen: React.FC = () => {
  const { player, match, navigateTo, startNewMatch } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShareStory = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadCard = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setCopiedLink(true);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#080b12] pb-6">
      <MobileHeader title="Match Recap Card (Social Share)" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar flex flex-col items-center">
        {/* Instruction label */}
        <div className="text-center">
          <span className="text-[10px] font-mono font-bold tracking-widest text-lime-400 uppercase">
            FIFA CARD / SPOTIFY WRAPPED STYLE
          </span>
          <p className="text-xs text-slate-300 mt-0.5">
            การ์ดสรุปฟอร์มการเล่นระดับพรีเมียม พร้อมแชร์ลง Instagram Story & TikTok
          </p>
        </div>

        {/* The Card Asset Container */}
        <div className="w-full max-w-[320px] rounded-[32px] p-[2px] bg-gradient-to-b from-amber-400 via-lime-400 to-cyan-500 shadow-[0_12px_45px_rgba(204,255,0,0.3)] transition-transform hover:scale-[1.01]">
          <div className="w-full bg-gradient-to-b from-[#131a29] via-[#0b101c] to-[#080c14] rounded-[30px] p-5 text-white relative overflow-hidden">
            {/* Ambient gold/lime glows inside card */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-lime-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top row: OVR, Position, Tier */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-lime-200 to-lime-400 leading-none">
                  85
                </div>
                <div className="text-[11px] font-extrabold text-lime-400 tracking-wider">
                  OVR · SMASH
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  DIAMOND LEAGUE
                </div>
              </div>

              {/* Tier Shield Badge */}
              <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-amber-400/50 flex items-center gap-1.5 shadow-md">
                <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-black text-amber-400">DIAMOND</span>
              </div>
            </div>

            {/* Player Avatar & Action Shot Visual */}
            <div className="relative my-3 flex flex-col items-center">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-lime-400/40 shadow-xl bg-slate-900">
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating MVP tag */}
              <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                <span>MATCH MVP 🔥</span>
              </div>
            </div>

            {/* Player Name & Playstyle */}
            <div className="text-center mt-3 mb-4">
              <h3 className="text-base font-black text-white tracking-tight">
                {player.name}
              </h3>
              <p className="text-[10px] text-lime-400 font-mono">
                {player.playstyle}
              </p>
            </div>

            {/* 6 Grid Stats (FIFA Style) */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
              <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-sm font-black font-mono text-lime-400">88</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">POW (พลัง)</div>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-sm font-black font-mono text-lime-400">82</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">SPD (สปีด)</div>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-sm font-black font-mono text-lime-400">76</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">CTL (คุมเกม)</div>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-sm font-black font-mono text-lime-400">84</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">STA (ความอึด)</div>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-sm font-black font-mono text-lime-400">90</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">TAC (แท็กติก)</div>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-sm font-black font-mono text-amber-400">362</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">KM/H (ตบ)</div>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 font-mono">
              <span>SMASH-AI MATCH CARD</span>
              <span className="text-lime-400 font-bold">4-WEEK STREAK 🔥</span>
            </div>
          </div>
        </div>

        {/* Share Feedback Toast */}
        {copiedLink && (
          <div className="px-3 py-1.5 rounded-xl bg-lime-400/20 border border-lime-400 text-lime-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in duration-150">
            <Check className="w-4 h-4" />
            <span>คัดลอกลิงก์ Story สำหรับแชร์แล้ว!</span>
          </div>
        )}
      </div>

      {/* Share Actions */}
      <div className="px-4 space-y-2 pt-2 shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleShareStory}
            className="min-h-[46px] py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:brightness-110 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>แชร์ลง Instagram Story</span>
          </button>

          <button
            onClick={handleDownloadCard}
            disabled={isDownloading}
            className="min-h-[46px] py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-lime-400" />
            <span>{isDownloading ? 'กำลังเรนเดอร์...' : 'บันทึกรูปภาพ HD'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('D1')}
            className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-lime-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-110"
          >
            <span>กลับหน้า AI Dashboard</span>
          </button>

          <button
            onClick={startNewMatch}
            className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>เริ่มจดแมตช์ใหม่</span>
          </button>
        </div>
      </div>
    </div>
  );
};
