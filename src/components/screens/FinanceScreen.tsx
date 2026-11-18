import React, { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playSelectSound } from '../../utils/retroAudio';
import { FinancePanel } from '../finance/FinancePanel';

export const FinanceScreen: React.FC = () => {
  const { goBack, t, language } = useApp();
  const isThai = language === 'th';
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f5f5f7] text-[#111111] overflow-y-auto overscroll-contain no-scrollbar pb-28">
      <div className="bg-gradient-to-b from-[#ffffff] via-[#fafafc] to-[#f5f5f7] pb-12">
        <header className="sticky top-0 z-30 app-header-safe px-5 pb-3 flex items-center justify-between gap-3 bg-[#ffffff]/85 backdrop-blur-md shrink-0 select-none text-[#111111]">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              goBack();
            }}
            className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#111111] hover:bg-[#f3f4f6] active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label={isThai ? 'ย้อนกลับ' : 'Back'}
            title={isThai ? 'ย้อนกลับ' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </button>

          <div className="min-w-0 flex-1 text-center px-1">
            <h1 className="text-[15px] font-semibold text-[#111111] tracking-tight leading-tight truncate">
              {t.financeHeader}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setIsPointsModalOpen(true);
            }}
            aria-label={isThai ? 'แต้มของฉัน' : 'My Points'}
            title={isThai ? 'แต้มของฉัน' : 'My Points'}
            className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#15803d] hover:bg-[#f3f4f6] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 stroke-[1.9]" />
          </button>
        </header>
      </div>

      <FinancePanel
        externalPointsModalOpen={isPointsModalOpen}
        onClosePointsModal={() => setIsPointsModalOpen(false)}
      />
    </div>
  );
};
