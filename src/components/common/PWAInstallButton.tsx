import React, { useState } from 'react';
import { Download, Smartphone, Share, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useApp } from '../../context/AppContext';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useApp();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="w-full py-2.5 px-4 rounded-[1600px] bg-[#7cd7a0] text-[#000000] border border-[#000000] text-xs font-black uppercase tracking-[0.032em] flex items-center justify-center gap-2 hover:bg-[#6bc990] active:scale-95 transition-all cursor-pointer shadow-xs"
      >
        <Download className="w-4 h-4 stroke-[2.5]" />
        <span>{language === 'th' ? 'ติดตั้งแอป SmashAI ลงเครื่อง' : 'Install SmashAI App'}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="w-full py-2.5 px-4 rounded-[1600px] bg-[#7cd7a0] text-[#000000] border border-[#000000] text-xs font-black uppercase tracking-[0.032em] flex items-center justify-center gap-2 hover:bg-[#6bc990] active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          <Smartphone className="w-4 h-4 stroke-[2.5]" />
          <span>{language === 'th' ? 'วิธีติดตั้งบน iPhone / iPad' : 'Install on iPhone / iPad'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#000000]/60 p-4">
            <div className="w-full max-w-sm rounded-[28px] bg-[#ffffff] border border-[#000000] p-5 shadow-2xl space-y-3 text-[#000000]">
              <div className="flex items-center justify-between">
                <h3 className="font-['Antonio',sans-serif] text-lg font-black uppercase">
                  {language === 'th' ? 'ติดตั้ง SmashAI บน iOS' : 'Install on iPhone / iPad'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="w-7 h-7 rounded-[1600px] bg-[#f4f8fb] border border-[#000000] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs font-bold text-[#000000]/80 leading-relaxed">
                {language === 'th' ? (
                  <>
                    1. แตะปุ่ม <strong className="inline-flex items-center gap-1"><Share className="w-3 h-3" /> Share</strong> ที่แถบเครื่องมือ Safari<br />
                    2. เลื่อนลงแล้วเลือก <strong>Add to Home Screen</strong> เพื่อใช้งานแบบออฟไลน์ระหว่างแข่งได้ทันที
                  </>
                ) : (
                  <>
                    1. Tap the <strong className="inline-flex items-center gap-1"><Share className="w-3 h-3" /> Share</strong> button in Safari toolbar.<br />
                    2. Scroll down and tap <strong>Add to Home Screen</strong> for instant offline court access.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] text-xs font-bold uppercase cursor-pointer"
              >
                {language === 'th' ? 'เข้าใจแล้ว' : 'Got It'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
