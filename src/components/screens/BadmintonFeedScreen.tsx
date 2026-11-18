import React from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playSelectSound } from '../../utils/retroAudio';
import { BadmintonFeedSection } from '../home/BadmintonFeedSection';

export const BadmintonFeedScreen: React.FC = () => {
  const { goBack, navigateTo, language } = useApp();
  const isThai = language === 'th';

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar pb-28 bg-[#f8faf6] text-[#142608]">
      {/* Profile-style Sticky Header */}
      <header className="sticky top-0 z-30 app-header-safe px-5 pb-3 flex items-center justify-between gap-2 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#d4dfd0]/60">
        <button
          type="button"
          onClick={() => {
            playSelectSound();
            goBack();
          }}
          aria-label={isThai ? 'ย้อนกลับ' : 'Back'}
          className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#2d4d14] shadow-2xs flex items-center justify-center text-[#142608] hover:bg-[#f8faf6] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
        </button>

        <div className="min-w-0 flex-1 text-center px-1">
          <h1 className="text-[15px] font-semibold text-[#142608] tracking-tight truncate">
            {isThai ? 'ฟีดแบดมินตัน' : 'Badminton Feed'}
          </h1>
          <p className="text-[11px] text-[#71717a] truncate leading-tight">
            {isThai ? 'ผลแข่งของฉัน · อัปเดตก๊วน · กิจกรรมเพื่อน' : 'My Results · Guild Updates · Friend Activity'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playSelectSound();
            navigateTo('E4');
          }}
          aria-label={isThai ? 'อันดับก๊วน' : 'Guild Rankings'}
          title={isThai ? 'อันดับก๊วน' : 'Guild Rankings'}
          className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#2d4d14] shadow-2xs flex items-center justify-center text-[#142608] hover:bg-[#f8faf6] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Trophy className="w-4 h-4 stroke-[1.9]" />
        </button>
      </header>

      {/* Main Feed Content */}
      <div className="px-5 pt-4 max-w-2xl w-full mx-auto">
        <BadmintonFeedSection compactHeader />
      </div>
    </div>
  );
};
