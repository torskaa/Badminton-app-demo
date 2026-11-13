import React from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, justReconnected, hasPendingSync, language } = useApp();

  if (isOnline && !justReconnected) {
    return null;
  }

  if (!isOnline) {
    return (
      <div className="px-3 pb-1.5 pointer-events-none z-40">
        <div className="w-full rounded-[1600px] bg-[#e85729] text-[#ffffff] border border-[#000000] px-3 py-1.5 shadow-md flex items-center justify-between gap-2 text-[10px] font-bold">
          <div className="flex items-center gap-1.5 min-w-0">
            <WifiOff className="w-3.5 h-3.5 shrink-0 animate-pulse" />
            <span className="truncate">
              {language === 'th'
                ? 'โหมดออฟไลน์ — แผนที่สนาม ภารกิจ และคะแนนแมตช์ถูกบันทึกในเครื่องแล้ว'
                : 'Offline Mode — Court Map, Quests & match progress cached locally'}
            </span>
          </div>
          {hasPendingSync && (
            <span className="px-1.5 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[9px] font-black shrink-0 uppercase">
              {language === 'th' ? 'รอบันทึกซิงค์' : 'Saved Local'}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 pb-1.5 pointer-events-none z-40">
      <div className="w-full rounded-[1600px] bg-[#7cd7a0] text-[#000000] border border-[#000000] px-3 py-1.5 shadow-md flex items-center gap-1.5 text-[10px] font-black">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">
          {language === 'th'
            ? 'กลับมาออนไลน์แล้ว — ซิงค์ข้อมูลแผนที่สนามและภารกิจเรียบร้อย'
            : 'Back Online — Court Map & Quest progress synced'}
        </span>
      </div>
    </div>
  );
};
