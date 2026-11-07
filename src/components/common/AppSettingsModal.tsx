import React from 'react';
import { X, Globe, Moon, Sun, Volume2, VolumeX, Tv, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSettingsModal: React.FC<AppSettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
    isSoundEnabled,
    toggleSound,
    isCrtEnabled,
    toggleCrt,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#000000]/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] bg-[#ffffff] border-2 border-[#000000] p-5 shadow-2xl space-y-4 text-[#000000]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#000000] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-[1600px] bg-[#ffd731] border border-[#000000] flex items-center justify-center text-[#000000]">
              ⚙️
            </span>
            <div>
              <h3 className="font-['Antonio',sans-serif] text-lg font-black uppercase tracking-tight text-[#000000]">
                {language === 'th' ? 'การตั้งค่าระบบ' : 'App Settings'}
              </h3>
              <p className="text-[10px] text-[#000000]/60 font-bold">
                {language === 'th' ? 'ภาษา ธีม และเสียงเอฟเฟกต์' : 'Language, Theme & Audio'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-[1600px] bg-[#cccccc] border border-[#000000] flex items-center justify-center hover:bg-[#ff5c34] hover:text-[#ffffff] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* 1. Language Setting */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#000000]">
            <Globe className="w-4 h-4 text-[#5c4ade]" />
            <span className="uppercase tracking-[0.032em] font-['Antonio',sans-serif] text-sm font-black">
              {t.settingsLanguage}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLanguage('th')}
              className={`p-3 rounded-[20px] border border-[#000000] flex items-center justify-between cursor-pointer transition-all active:scale-95 ${
                language === 'th'
                  ? 'bg-[#55db9c] text-[#000000] font-black shadow-xs'
                  : 'bg-[#ffffff] text-[#000000]/80 hover:bg-[#f3f4f6]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🇹🇭</span>
                <span className="text-xs font-bold whitespace-nowrap">ภาษาไทย (TH)</span>
              </div>
              {language === 'th' && <Check className="w-4 h-4 stroke-[3]" />}
            </button>

            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`p-3 rounded-[20px] border border-[#000000] flex items-center justify-between cursor-pointer transition-all active:scale-95 ${
                language === 'en'
                  ? 'bg-[#ffd731] text-[#000000] font-black shadow-xs'
                  : 'bg-[#ffffff] text-[#000000]/80 hover:bg-[#f3f4f6]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🇬🇧</span>
                <span className="text-xs font-bold whitespace-nowrap">English (EN)</span>
              </div>
              {language === 'en' && <Check className="w-4 h-4 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* 2. Theme Setting */}
        <div className="space-y-2 pt-2 border-t border-[#000000]/15">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#000000]">
            <Sun className="w-4 h-4 text-[#ffd731]" />
            <span className="uppercase tracking-[0.032em] font-['Antonio',sans-serif] text-sm font-black">
              {t.settingsTheme}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`p-2.5 rounded-[1600px] border border-[#000000] flex items-center justify-center gap-2 text-xs font-bold cursor-pointer ${
                theme === 'light' ? 'bg-[#000000] text-[#ffffff]' : 'bg-[#ffffff] text-[#000000]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'ธีม Slush ดั้งเดิม' : 'Slush Original'}</span>
            </button>

            <button
              type="button"
              onClick={() => theme === 'light' && toggleTheme()}
              className={`p-2.5 rounded-[1600px] border border-[#000000] flex items-center justify-center gap-2 text-xs font-bold cursor-pointer ${
                theme === 'dark' ? 'bg-[#000000] text-[#ffffff]' : 'bg-[#ffffff] text-[#000000]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'โหมดมืด' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>

        {/* 3. Audio & CRT Toggles */}
        <div className="space-y-2 pt-2 border-t border-[#000000]/15">
          <div className="flex items-center justify-between p-2 rounded-[16px] bg-[#dceeff] border border-[#000000]">
            <div className="flex items-center gap-2">
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-[#000000]" /> : <VolumeX className="w-4 h-4 text-[#000000]/50" />}
              <span className="text-xs font-bold text-[#000000]">
                {language === 'th' ? 'เสียงเอฟเฟกต์ 8-Bit' : '8-Bit Retro Sound'}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={`px-3 py-1 rounded-[1600px] text-[10px] font-black border border-[#000000] cursor-pointer ${
                isSoundEnabled ? 'bg-[#55db9c] text-[#000000]' : 'bg-[#cccccc] text-[#000000]'
              }`}
            >
              {isSoundEnabled ? (language === 'th' ? 'เปิด' : 'ON') : (language === 'th' ? 'ปิด' : 'OFF')}
            </button>
          </div>

          <div className="flex items-center justify-between p-2 rounded-[16px] bg-[#dceeff] border border-[#000000]">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-[#000000]" />
              <span className="text-xs font-bold text-[#000000]">
                {language === 'th' ? 'เอฟเฟกต์หน้าจอ CRT' : 'CRT Retro Shader'}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleCrt}
              className={`px-3 py-1 rounded-[1600px] text-[10px] font-black border border-[#000000] cursor-pointer ${
                isCrtEnabled ? 'bg-[#ffd731] text-[#000000]' : 'bg-[#cccccc] text-[#000000]'
              }`}
            >
              {isCrtEnabled ? (language === 'th' ? 'เปิด' : 'ON') : (language === 'th' ? 'ปิด' : 'OFF')}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-[1600px] bg-[#000000] text-[#ffffff] font-bold text-xs uppercase tracking-[0.032em] hover:bg-[#1a1a1a] transition-all cursor-pointer border border-[#000000]"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
