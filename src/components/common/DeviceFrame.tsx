import React from 'react';
import { QuickSparringModal } from './QuickSparringModal';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center relative bg-[#f0f4f8] select-none overflow-hidden">
      {/* Background Ambience (Desktop Only Subtle Texture) */}
      <div className="hidden md:block absolute inset-0 bg-radial from-[#ffffff]/40 via-transparent to-[#000000]/5 pointer-events-none" />

      {/* Real Mobile App Viewport */}
      <main className="w-full flex flex-col relative transition-all duration-200 overflow-hidden h-[100dvh] md:h-[92vh] md:max-h-[920px] md:max-w-[430px] md:rounded-[36px] md:border-2 md:border-[#000000] md:shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-[#ffffff]">
        <div className="flex-1 w-full min-h-0 overflow-hidden flex flex-col relative bg-[#ffffff] text-[#000000]">
          {children}
        </div>
      </main>

      {/* Quick Sparring Modal */}
      <QuickSparringModal />
    </div>
  );
};
