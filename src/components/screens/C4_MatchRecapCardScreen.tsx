/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Share2, Download, Check, Sparkles, Trophy, Zap, Flame, Award, ArrowRight, RotateCcw } from 'lucide-react';
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
    <div className="flex-1 flex flex-col justify-between bg-[#f0f4f9] text-neutral-900 pb-6 select-none">
      <MobileHeader title="Match Recap Card (Social Share)" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar flex flex-col items-center">
        {/* Instruction label */}
        <div className="text-center px-2">
          <span className="text-[10px] font-bold tracking-widest text-[#0066ff] uppercase">
            FIFA PLAYER CARD · INSTAGRAM STORY READY
          </span>
          <p className="text-xs text-neutral-500 mt-0.5">
            การ์ดสรุปฟอร์มการเล่น พร้อมแชร์ลง IG Story, TikTok & Facebook
          </p>
        </div>

        {/* The Holographic FIFA Card */}
        <div className="w-full max-w-[320px] rounded-[36px] p-[3px] bg-gradient-to-b from-[#d8ff00] via-cyan-400 to-[#0066ff] shadow-xl hover:scale-102 transition-transform">
          <div className="w-full bg-[#111318] rounded-[33px] p-5 text-white relative overflow-hidden">
            {/* Card Ambient Glows */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#d8ff00]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top row: OVR, Position, Tier */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl font-black font-mono tracking-tight text-[#d8ff00] leading-none">
                  85
                </div>
                <div className="text-[11px] font-extrabold text-[#d8ff00] tracking-wider mt-1">
                  OVR · SMASH
                </div>
                <div className="text-[9px] font-mono text-neutral-400">
                  DIAMOND LEAGUE
                </div>
              </div>

              {/* Player Image */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80"
                  alt="Player Card"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#d8ff00] text-black text-[9px] font-black">
                  MVP
                </span>
              </div>
            </div>

            {/* Player Name & Playstyle */}
            <div className="text-center mt-3 pt-2 border-t border-white/10">
              <h3 className="text-lg font-black tracking-tight text-white uppercase">
                {player.name}
              </h3>
              <p className="text-[10px] text-[#d8ff00] font-bold">
                {player.playstyle}
              </p>
            </div>

            {/* Match Key Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
              <div>
                <div className="text-[10px] text-neutral-400">SMASH MAX</div>
                <div className="text-sm font-black font-mono text-[#d8ff00]">362 KM/H</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400">WIN RATE</div>
                <div className="text-sm font-black font-mono text-white">68.5%</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400">EXP GAIN</div>
                <div className="text-sm font-black font-mono text-emerald-400">+250</div>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
              <span className="font-mono">SMASHAI ENGINE</span>
              <span className="text-[#d8ff00] font-bold">VERIFIED CARD</span>
            </div>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="w-full max-w-[320px] space-y-2 pt-2">
          <button
            type="button"
            onClick={handleShareStory}
            className="w-full h-12 rounded-full bg-[#111318] hover:bg-[#1f2430] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-98"
          >
            <Share2 className="w-4 h-4 text-[#d8ff00]" />
            <span>{copiedLink ? 'คัดลอกลิงก์การ์ดเรียบร้อย!' : 'แชร์ลง Instagram Story / TikTok'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCard}
            className="w-full h-11 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 border border-neutral-200 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'กำลังบันทึกภาพ...' : 'บันทึกลงอัลบั้มรูปภาพ'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Home CTA */}
      <div className="px-5 pt-3 border-t border-neutral-200 bg-white shrink-0">
        <button
          type="button"
          onClick={() => {
            startNewMatch();
            navigateTo('D1');
          }}
          className="w-full h-13 rounded-full bg-[#0066ff] hover:bg-[#0055d4] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
        >
          <span>กลับสู่หน้าหลัก AI Coach Dashboard</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
