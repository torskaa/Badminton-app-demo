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
    <div className="flex-1 flex flex-col justify-between bg-[#dceeff] text-black pb-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <MobileHeader title="Athlete Recap Card" showBack />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar flex flex-col items-center">
        {/* Banner Label */}
        <div className="text-center px-2">
          <span className="px-3 py-1 rounded-full bg-[#ffd731] border border-black text-[10px] font-black uppercase text-black inline-block mb-1">
            Story Share Ready
          </span>
          <h2 className="font-['Antonio'] text-3xl font-extrabold text-black uppercase tracking-tight leading-tight">
            ATHLETE TRADING CARD
          </h2>
          <p className="text-xs text-neutral-600 font-medium">
            Share your match performance directly to Instagram, TikTok, and Line.
          </p>
        </div>

        {/* Slush Holographic Athlete Card (Sunburst & Voltage Violet) */}
        <div className="w-full max-w-[320px] rounded-[36px] bg-[#ffd731] border-2 border-black p-5 relative overflow-hidden shadow-md">
          {/* Top row: OVR, Position, Tier */}
          <div className="flex items-start justify-between">
            <div>
              <div className="font-['Antonio'] text-6xl font-black text-black leading-none">
                88
              </div>
              <div className="text-[11px] font-extrabold uppercase text-black tracking-wider">
                OVR · SMASH HUNTER
              </div>
              <div className="text-[10px] font-bold text-neutral-700">
                {player.tier} Tier · Lv.{player.level}
              </div>
            </div>

            {/* Shuttlecock Avatar Sticker */}
            <div className="w-16 h-16 rounded-3xl bg-white border border-black flex items-center justify-center text-3xl rotate-6 shadow-xs">
              🏸
            </div>
          </div>

          {/* Athlete Name */}
          <div className="mt-4 pb-3 border-b border-black">
            <h3 className="font-['Antonio'] text-3xl font-black uppercase tracking-tight text-black leading-none">
              {player.name}
            </h3>
            <p className="text-[11px] text-neutral-800 font-bold mt-0.5">
              Bangkok Smashers Guild · Astrox 99 Pro
            </p>
          </div>

          {/* 5-Axis Stats Grid */}
          <div className="grid grid-cols-3 gap-2 my-3 text-center">
            <div className="p-2 rounded-2xl bg-white border border-black">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">PWR</span>
              <span className="font-['Antonio'] text-2xl font-bold text-black">{player.skillRadar.power}</span>
            </div>
            <div className="p-2 rounded-2xl bg-white border border-black">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">SPD</span>
              <span className="font-['Antonio'] text-2xl font-bold text-black">{player.skillRadar.speed}</span>
            </div>
            <div className="p-2 rounded-2xl bg-white border border-black">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">CTL</span>
              <span className="font-['Antonio'] text-2xl font-bold text-black">{player.skillRadar.control}</span>
            </div>
            <div className="p-2 rounded-2xl bg-white border border-black">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">STA</span>
              <span className="font-['Antonio'] text-2xl font-bold text-black">{player.skillRadar.stamina}</span>
            </div>
            <div className="p-2 rounded-2xl bg-white border border-black">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">TAC</span>
              <span className="font-['Antonio'] text-2xl font-bold text-black">{player.skillRadar.tactics}</span>
            </div>
            <div className="p-2 rounded-2xl bg-[#55db9c] border border-black">
              <span className="text-[10px] font-bold text-black uppercase block">STREAK</span>
              <span className="font-['Antonio'] text-2xl font-bold text-black">{player.streakWeeks}W</span>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="flex items-center justify-between text-[10px] font-bold text-black pt-1">
            <span>SMASH.AI CERTIFIED</span>
            <span className="px-2 py-0.5 rounded-full bg-black text-white font-mono">
              VERIFIED #8921
            </span>
          </div>
        </div>

        {/* Share & Download Pill Buttons */}
        <div className="w-full max-w-[320px] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareStory}
              className="py-3 px-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs border border-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'Story Copied!' : 'Share to IG'}</span>
            </button>

            <button
              onClick={handleDownloadCard}
              className="py-3 px-4 rounded-full bg-white hover:bg-neutral-100 text-black font-bold text-xs border border-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Saving...' : 'Save Image'}</span>
            </button>
          </div>

          {/* Flow Next Buttons */}
          <button
            onClick={() => navigateTo('D1')}
            className="w-full py-3.5 rounded-full bg-[#55db9c] hover:bg-[#68eab0] text-black font-bold text-xs border border-black flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-xs"
          >
            <Trophy className="w-4 h-4" />
            <span>Return to AI Coach Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigateTo('E3')}
            className="w-full py-2.5 rounded-full bg-white hover:bg-neutral-100 text-black font-bold text-xs border border-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <span>Challenge Another Player (Matchmaker)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
