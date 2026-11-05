import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface MobileStatusBarProps {
  darkText?: boolean;
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({ darkText = true }) => {
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full h-11 pt-1 px-6 flex items-center justify-between select-none shrink-0 z-50 text-[13px] font-bold tracking-tight ${
      darkText ? 'text-[#000000]' : 'text-[#ffffff]'
    }`}>
      {/* Left: Clock */}
      <span className="font-semibold text-[13px] tracking-tight">{currentTime}</span>

      {/* Center: Dynamic Island Pill */}
      <div className="w-24 h-5 bg-[#000000] rounded-[1600px] flex items-center justify-between px-2 text-[9px] text-[#ffffff] shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#1c1c1e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#55db9c]/90 animate-pulse" />
      </div>

      {/* Right: Cellular Signal + Wifi + Battery */}
      <div className="flex items-center gap-1.5 text-[12px]">
        {/* 4-bar cellular icon */}
        <div className="flex items-end gap-0.5 h-3">
          <span className="w-0.5 h-1 rounded-full bg-current" />
          <span className="w-0.5 h-1.5 rounded-full bg-current" />
          <span className="w-0.5 h-2 rounded-full bg-current" />
          <span className="w-0.5 h-2.5 rounded-full bg-current" />
        </div>

        {/* Wifi */}
        <Wifi className="w-3.5 h-3.5 stroke-[2.4]" />

        {/* Battery with 94% fill */}
        <div className="flex items-center gap-0.5">
          <div className="w-5 h-2.5 rounded-[4px] border border-current p-0.5 flex items-center">
            <div className="w-[88%] h-full bg-current rounded-[2px]" />
          </div>
          <span className="w-0.5 h-1 bg-current rounded-r-xs" />
        </div>
      </div>
    </div>
  );
};
