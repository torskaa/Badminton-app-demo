import React from 'react';
import { X, Globe, Moon, Sun, Volume2, VolumeX, Tv, Check, HardDrive, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { formatCacheTimestamp } from '../../utils/offlineCache';

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
 isOnline,
 lastSyncedAt,
 refreshOfflineCache,
 resetOfflineCache,
 } = useApp();

 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#000000]/60 backdrop-blur-xs select-none">
 <div className="w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] bg-[#ffffff] p-5 shadow-2xl space-y-4 text-[#000000]">
 {/* Header */}
 <div className="flex items-center justify-between pb-3">
 <div className="flex items-center gap-2">
 <span className="w-8 h-8 rounded-[1600px] bg-[#e85729] flex items-center justify-center text-[#000000]">
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
 <Globe className="w-4 h-4 text-[#e85729]" />
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
 ? 'bg-[#7cd7a0] text-[#000000] font-black shadow-xs'
 : 'bg-[#ffffff] text-[#000000]/80 hover:bg-[#f3f4f6]'
 }`}
 >
 <div className="flex items-center gap-2">
 <span className="text-base">🇹🇭</span>
 <span className="text-xs font-bold whitespace-nowrap">ภาษาไทย</span>
 </div>
 {language === 'th' && <Check className="w-4 h-4 stroke-[3]" />}
 </button>

 <button
 type="button"
 onClick={() => setLanguage('en')}
 className={`p-3 rounded-[20px] border border-[#000000] flex items-center justify-between cursor-pointer transition-all active:scale-95 ${
 language === 'en'
 ? 'bg-[#e85729] text-[#000000] font-black shadow-xs'
 : 'bg-[#ffffff] text-[#000000]/80 hover:bg-[#f3f4f6]'
 }`}
 >
 <div className="flex items-center gap-2">
 <span className="text-base">🇬🇧</span>
 <span className="text-xs font-bold whitespace-nowrap">English</span>
 </div>
 {language === 'en' && <Check className="w-4 h-4 stroke-[3]" />}
 </button>
 </div>
 </div>

 {/* 2. Theme Setting */}
 <div className="space-y-2 pt-2 ">
 <div className="flex items-center gap-1.5 text-xs font-bold text-[#000000]">
 <Sun className="w-4 h-4 text-[#e85729]" />
 <span className="uppercase tracking-[0.032em] font-['Antonio',sans-serif] text-sm font-black">
 {t.settingsTheme}
 </span>
 </div>
 <div data-filter="true" className="bg-[#ececef] p-1 rounded-full grid grid-cols-2 gap-1">
 <button
 type="button"
 onClick={() => theme === 'dark' && toggleTheme()}
 className={`no-doodle min-h-[36px] px-2.5 py-1.5 rounded-full flex items-center justify-center gap-1.5 text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
 theme === 'light'
 ? 'bg-[#ffffff] text-[#111111] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
 : 'text-[#6b7280] hover:text-[#111111]'
 }`}
 >
 <Sun className="w-3.5 h-3.5 shrink-0" />
 <span>{language === 'th' ? 'ธีมสว่าง' : 'Light Theme'}</span>
 </button>

 <button
 type="button"
 onClick={() => theme === 'light' && toggleTheme()}
 className={`no-doodle min-h-[36px] px-2.5 py-1.5 rounded-full flex items-center justify-center gap-1.5 text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
 theme === 'dark'
 ? 'bg-[#ffffff] text-[#111111] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
 : 'text-[#6b7280] hover:text-[#111111]'
 }`}
 >
 <Moon className="w-3.5 h-3.5 shrink-0" />
 <span>{language === 'th' ? 'โหมดมืด' : 'Dark Mode'}</span>
 </button>
 </div>
 </div>

 {/* 3. Audio & CRT Toggles */}
 <div className="space-y-2 pt-2 ">
 <div className="flex items-center justify-between p-2 rounded-[16px] bg-[#f4f8fb] ">
 <div className="flex items-center gap-2">
 {isSoundEnabled ? <Volume2 className="w-4 h-4 text-[#000000]" /> : <VolumeX className="w-4 h-4 text-[#000000]/50" />}
 <span className="text-xs font-bold text-[#000000]">
 {language === 'th' ? 'เสียงประกอบย้อนยุค' : 'Retro Sound FX'}
 </span>
 </div>
 <button
 type="button"
 onClick={toggleSound}
 className={`px-3 py-1 rounded-[1600px] text-[10px] font-black border border-[#000000] cursor-pointer ${
 isSoundEnabled ? 'bg-[#7cd7a0] text-[#000000]' : 'bg-[#cccccc] text-[#000000]'
 }`}
 >
 {isSoundEnabled ? (language === 'th' ? 'เปิด' : 'ON') : (language === 'th' ? 'ปิด' : 'OFF')}
 </button>
 </div>

 <div className="flex items-center justify-between p-2 rounded-[16px] bg-[#f4f8fb] ">
 <div className="flex items-center gap-2">
 <Tv className="w-4 h-4 text-[#000000]" />
 <span className="text-xs font-bold text-[#000000]">
 {language === 'th' ? 'เอฟเฟกต์จอภาพย้อนยุค' : 'Retro Screen Filter'}
 </span>
 </div>
 <button
 type="button"
 onClick={toggleCrt}
 className={`px-3 py-1 rounded-[1600px] text-[10px] font-black border border-[#000000] cursor-pointer ${
 isCrtEnabled ? 'bg-[#e85729] text-[#000000]' : 'bg-[#cccccc] text-[#000000]'
 }`}
 >
 {isCrtEnabled ? (language === 'th' ? 'เปิด' : 'ON') : (language === 'th' ? 'ปิด' : 'OFF')}
 </button>
 </div>
 </div>

 {/* 4. Offline Cache & PWA Install */}
 <div className="space-y-2 pt-1">
 <div className="flex items-center justify-between p-2.5 rounded-[16px] bg-[#f4f8fb]">
 <div className="flex items-center gap-2 min-w-0">
 <HardDrive className="w-4 h-4 text-[#000000] shrink-0" />
 <div className="min-w-0">
 <div className="text-xs font-bold text-[#000000] truncate">
 {language === 'th' ? 'ข้อมูลออฟไลน์' : 'Offline Cache'}
 </div>
 <div className="text-[10px] font-bold text-[#000000]/60">
 {isOnline
 ? `${language === 'th' ? 'อัปเดตล่าสุด' : 'Synced'}: ${formatCacheTimestamp(lastSyncedAt, language)}`
 : (language === 'th' ? 'ออฟไลน์ · ใช้ข้อมูลในเครื่อง' : 'Offline · Using local cache')}
 </div>
 </div>
 </div>
 <div className="flex items-center gap-1.5 shrink-0">
 <button
 type="button"
 onClick={refreshOfflineCache}
 className="p-1.5 rounded-[1600px] bg-[#7cd7a0] border border-[#000000] text-[#000000] hover:bg-[#6bc990] cursor-pointer"
 title={language === 'th' ? 'ซิงค์แคชตอนนี้' : 'Sync cache now'}
 >
 <RefreshCw className="w-3.5 h-3.5" />
 </button>
 <button
 type="button"
 onClick={resetOfflineCache}
 className="px-2.5 py-1 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[10px] font-bold text-[#000000] hover:bg-[#e85729] hover:text-[#ffffff] cursor-pointer"
 >
 {language === 'th' ? 'ล้างแคช' : 'Reset'}
 </button>
 </div>
 </div>

 <PWAInstallButton />
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
