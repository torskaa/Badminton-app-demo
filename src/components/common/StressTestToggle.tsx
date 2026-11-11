import React from 'react';
import { useApp } from '../../context/AppContext';

export type StressDataMode = 'demo' | 'worst' | 'empty' | 'one';

export const StressTestToggle: React.FC = () => {
  const { dataMode, setDataMode } = useApp();

  return (
    <div
      aria-label="Break UI Data Mode Switcher"
      className="hidden md:flex fixed bottom-5 left-1/2 -translate-x-1/2 z-50 items-center gap-1 p-1 rounded-full bg-[#18181b]/90 backdrop-blur-md shadow-2xl border border-[#27272a] text-[11px] font-sans select-none"
    >
      <span className="text-[#a1a1aa] font-semibold px-2 text-[10px] uppercase tracking-wider">
        Data:
      </span>
      <button
        type="button"
        onClick={() => setDataMode('demo')}
        className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
          dataMode === 'demo'
            ? 'bg-[#ffffff] text-[#000000] shadow-sm'
            : 'text-[#d4d4d8] hover:text-[#ffffff]'
        }`}
      >
        Demo
      </button>
      <button
        type="button"
        onClick={() => setDataMode('worst')}
        className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
          dataMode === 'worst'
            ? 'bg-[#fb4903] text-[#ffffff] shadow-sm'
            : 'text-[#d4d4d8] hover:text-[#ffffff]'
        }`}
        title="Stress-test long strings, huge numbers, overflow edge cases"
      >
        Worst Case
      </button>
      <button
        type="button"
        onClick={() => setDataMode('one')}
        className={`px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer ${
          dataMode === 'one'
            ? 'bg-[#ffffff] text-[#000000] shadow-sm'
            : 'text-[#d4d4d8] hover:text-[#ffffff]'
        }`}
        title="Single-item boundary case"
      >
        One
      </button>
      <button
        type="button"
        onClick={() => setDataMode('empty')}
        className={`px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer ${
          dataMode === 'empty'
            ? 'bg-[#ffffff] text-[#000000] shadow-sm'
            : 'text-[#d4d4d8] hover:text-[#ffffff]'
        }`}
        title="Empty zero-data state"
      >
        Empty
      </button>
    </div>
  );
};
