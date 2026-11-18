import React, { useState } from 'react';
import { Check, Copy, Maximize2, QrCode, ScanBarcode, X } from 'lucide-react';
import { playSelectSound } from '../../utils/retroAudio';

export interface TicketSpecItem {
  label: string;
  value: string;
}

interface EntryTicketCardProps {
  dateTimeLine: string;
  title: string;
  venueLine: string;
  specs: [TicketSpecItem, TicketSpecItem, TicketSpecItem];
  stubLabel?: string;
  ticketCode: string;
  defaultScanMode?: 'barcode' | 'qr';
  isThai?: boolean;
  notchBgClass?: string;
}

const CrispBarcodeSvg: React.FC<{ className?: string }> = ({ className = 'w-12 h-11' }) => (
  <svg viewBox="0 0 64 52" className={className} aria-hidden="true">
    <rect x="2" y="2" width="3.5" height="48" fill="currentColor" />
    <rect x="8" y="2" width="1.8" height="48" fill="currentColor" />
    <rect x="12" y="2" width="4.2" height="48" fill="currentColor" />
    <rect x="19" y="2" width="1.6" height="48" fill="currentColor" />
    <rect x="23" y="2" width="3.2" height="48" fill="currentColor" />
    <rect x="29" y="2" width="2" height="48" fill="currentColor" />
    <rect x="33.5" y="2" width="4.5" height="48" fill="currentColor" />
    <rect x="40.5" y="2" width="1.8" height="48" fill="currentColor" />
    <rect x="45" y="2" width="3.6" height="48" fill="currentColor" />
    <rect x="51" y="2" width="2.2" height="48" fill="currentColor" />
    <rect x="55.5" y="2" width="1.8" height="48" fill="currentColor" />
    <rect x="59.5" y="2" width="3" height="48" fill="currentColor" />
  </svg>
);

const CrispQrSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    {/* Top-left finder */}
    <rect x="2" y="2" width="28" height="28" rx="3" fill="currentColor" />
    <rect x="7" y="7" width="18" height="18" rx="1.5" fill="#edf4ea" />
    <rect x="11" y="11" width="10" height="10" rx="1" fill="currentColor" />

    {/* Top-right finder */}
    <rect x="70" y="2" width="28" height="28" rx="3" fill="currentColor" />
    <rect x="75" y="7" width="18" height="18" rx="1.5" fill="#edf4ea" />
    <rect x="79" y="11" width="10" height="10" rx="1" fill="currentColor" />

    {/* Bottom-left finder */}
    <rect x="2" y="70" width="28" height="28" rx="3" fill="currentColor" />
    <rect x="7" y="75" width="18" height="18" rx="1.5" fill="#edf4ea" />
    <rect x="11" y="79" width="10" height="10" rx="1" fill="currentColor" />

    {/* Data modules */}
    <rect x="36" y="4" width="7" height="7" fill="currentColor" />
    <rect x="48" y="4" width="7" height="7" fill="currentColor" />
    <rect x="58" y="11" width="7" height="7" fill="currentColor" />
    <rect x="36" y="17" width="13" height="7" fill="currentColor" />
    <rect x="54" y="23" width="10" height="7" fill="currentColor" />

    <rect x="4" y="37" width="7" height="13" fill="currentColor" />
    <rect x="16" y="37" width="8" height="8" fill="currentColor" />
    <rect x="28" y="44" width="7" height="14" fill="currentColor" />
    <rect x="11" y="54" width="12" height="8" fill="currentColor" />

    <rect x="39" y="36" width="18" height="18" rx="2" fill="currentColor" />
    <rect x="44" y="41" width="8" height="8" rx="1" fill="#edf4ea" />
    <rect x="62" y="37" width="8" height="13" fill="currentColor" />
    <rect x="75" y="37" width="10" height="8" fill="currentColor" />
    <rect x="89" y="41" width="8" height="15" fill="currentColor" />
    <rect x="72" y="51" width="12" height="8" fill="currentColor" />

    <rect x="38" y="61" width="10" height="8" fill="currentColor" />
    <rect x="54" y="59" width="11" height="11" fill="currentColor" />
    <rect x="70" y="65" width="8" height="14" fill="currentColor" />
    <rect x="83" y="63" width="14" height="8" fill="currentColor" />

    <rect x="37" y="75" width="8" height="10" fill="currentColor" />
    <rect x="50" y="75" width="13" height="8" fill="currentColor" />
    <rect x="42" y="89" width="15" height="8" fill="currentColor" />
    <rect x="63" y="86" width="10" height="11" fill="currentColor" />
    <rect x="80" y="77" width="17" height="19" rx="2" fill="currentColor" />
    <rect x="85" y="82" width="7" height="9" fill="#edf4ea" />
  </svg>
);

export const EntryTicketCard: React.FC<EntryTicketCardProps> = ({
  dateTimeLine,
  title,
  venueLine,
  specs,
  stubLabel = 'ADMIT ONE',
  ticketCode,
  defaultScanMode = 'qr',
  isThai = true,
  notchBgClass = 'bg-[#f8faf6]',
}) => {
  const [scanMode, setScanMode] = useState<'barcode' | 'qr'>(defaultScanMode);
  const [copied, setCopied] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleCopyCode = () => {
    playSelectSound();
    navigator.clipboard?.writeText(ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Split long ticket code neatly across 2 lines on narrow stub (matching reference NS-24-0417- / C14)
  const codeParts = ticketCode.split('-');
  const codeTop = codeParts.length >= 3 ? `${codeParts.slice(0, -1).join('-')}-` : ticketCode;
  const codeBottom = codeParts.length >= 3 ? codeParts[codeParts.length - 1] : '';

  return (
    <div className="space-y-2.5">
      {/* Perforated Horizontal Editorial Ticket */}
      <div className="relative rounded-[22px] bg-gradient-to-br from-[#f2f7ee] via-[#e9f2e4] to-[#e0ecdb] border border-[#c6dac2] shadow-[0_10px_28px_rgba(0,77,44,0.08)] text-[#004d2c] flex items-stretch overflow-hidden">
        {/* LEFT MAIN TICKET BODY */}
        <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* Mono Date & Time Kicker */}
            <div className="text-[10.5px] font-mono font-semibold tracking-[0.14em] uppercase text-[#43614d] truncate tabular-nums">
              {dateTimeLine}
            </div>

            {/* Editorial Event / Court Title */}
            <h3 className="mt-1.5 text-[20px] sm:text-[23px] font-bold tracking-tight leading-[1.18] text-[#004d2c] line-clamp-2">
              {title}
            </h3>

            {/* Venue / Court Zone Line */}
            <p className="mt-1.5 text-[12px] font-medium text-[#4a6754] truncate">
              {venueLine}
            </p>
          </div>

          <div>
            {/* Fine Horizontal Dashed Rule */}
            <div className="border-t border-dashed border-[#004d2c]/25 my-3.5" />

            {/* 3-Column Spec Grid (mirrors ROW · SEAT · GATE) */}
            <div className="grid grid-cols-3 gap-2">
              {specs.map((spec) => (
                <div key={spec.label} className="min-w-0">
                  <div className="text-[9.5px] font-mono font-semibold uppercase tracking-[0.1em] text-[#52705c] truncate">
                    {spec.label}
                  </div>
                  <div className="mt-0.5 text-[16px] sm:text-[18px] font-bold text-[#004d2c] tabular-nums leading-tight truncate">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER VERTICAL PERFORATION SEAM + TOP/BOTTOM DIE-CUT NOTCHES */}
        <div className="relative w-4 shrink-0 flex items-center justify-center" aria-hidden="true">
          {/* Top circular punch notch */}
          <span
            className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full ${notchBgClass} border-b border-[#c6dac2] z-10`}
          />
          {/* Circular dot perforation line */}
          <svg
            viewBox="0 0 6 160"
            preserveAspectRatio="none"
            className="h-[calc(100%-24px)] w-1.5 text-[#004d2c]"
          >
            <line
              x1="3"
              y1="4"
              x2="3"
              y2="156"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeDasharray="0.5 8"
            />
          </svg>
          {/* Bottom circular punch notch */}
          <span
            className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full ${notchBgClass} border-t border-[#c6dac2] z-10`}
          />
        </div>

        {/* RIGHT TEAR-OFF STUB (ADMIT ONE + QR/BARCODE + MONO REF) */}
        <button
          type="button"
          onClick={() => {
            playSelectSound();
            setIsZoomOpen(true);
          }}
          aria-label={isThai ? 'ขยายคิวอาร์โค้ดเพื่อสแกน' : 'Expand pass for scanning'}
          className="no-doodle w-[98px] sm:w-[114px] shrink-0 px-2 py-4 flex flex-col items-center justify-between gap-2.5 hover:bg-[#004d2c]/[0.04] active:bg-[#004d2c]/[0.07] transition-colors cursor-pointer text-center"
        >
          {/* Vertical Rotated ADMIT ONE Label */}
          <span className="[writing-mode:vertical-rl] rotate-180 text-[9.5px] font-mono font-semibold tracking-[0.22em] uppercase text-[#43614d] leading-none">
            {stubLabel}
          </span>

          {/* Scannable QR Code or Barcode Graphic */}
          <div className="flex items-center justify-center text-[#004d2c]">
            {scanMode === 'barcode' ? (
              <CrispBarcodeSvg className="w-12 h-11" />
            ) : (
              <div className="p-1 rounded-[10px] bg-[#f7faf5]/90 border border-[#004d2c]/15">
                <CrispQrSvg className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* Monospace Ticket Reference */}
          <div className="font-mono text-[9.5px] font-semibold text-[#3f5d49] leading-[1.25] tabular-nums">
            <div className="whitespace-nowrap">{codeTop}</div>
            {codeBottom && <div className="whitespace-nowrap">{codeBottom}</div>}
          </div>
        </button>
      </div>

      {/* Subtle Utility Strip: Toggle QR / Barcode, Zoom to Scan, Copy Ref */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setScanMode('qr');
            }}
            className={`no-doodle filter-pill min-h-[32px] px-3 py-1 rounded-full text-[11px] inline-flex items-center gap-1.5 transition-all cursor-pointer border whitespace-nowrap ${
              scanMode === 'qr'
                ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c] font-semibold'
                : 'bg-[#ffffff] text-[#526453] border-[#d4dfd0] hover:border-[#2d4d14] font-medium'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 shrink-0" />
            <span>QR</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setScanMode('barcode');
            }}
            className={`no-doodle filter-pill min-h-[32px] px-3 py-1 rounded-full text-[11px] inline-flex items-center gap-1.5 transition-all cursor-pointer border whitespace-nowrap ${
              scanMode === 'barcode'
                ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c] font-semibold'
                : 'bg-[#ffffff] text-[#526453] border-[#d4dfd0] hover:border-[#2d4d14] font-medium'
            }`}
          >
            <ScanBarcode className="w-3.5 h-3.5 shrink-0" />
            <span>{isThai ? 'บาร์โค้ด' : 'Barcode'}</span>
          </button>
        </div>

        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyCode}
            className="no-doodle min-h-[32px] px-2.5 py-1 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#2d4d14] text-[#142608] text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#15803d] shrink-0" />
                <span className="text-[#15803d]">{isThai ? 'คัดลอกแล้ว' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-[#526453] shrink-0" />
                <span>{isThai ? 'รหัส' : 'Copy'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setIsZoomOpen(true);
            }}
            className="no-doodle min-h-[32px] px-3 py-1 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#2d4d14] text-[#004d2c] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
          >
            <Maximize2 className="w-3 h-3 shrink-0" />
            <span>{isThai ? 'ขยายสแกน' : 'Scan'}</span>
          </button>
        </div>
      </div>

      {/* High-Contrast Full-Size Scan Modal (for Venue Counter Scanner) */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0c1d13]/70 backdrop-blur-xs flex items-center justify-center p-5"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[340px] rounded-[26px] bg-gradient-to-b from-[#f2f7ee] to-[#e4efe0] border border-[#c6dac2] p-5 text-[#004d2c] shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-mono font-semibold tracking-[0.14em] uppercase text-[#43614d]">
                  {dateTimeLine}
                </div>
                <h4 className="text-[17px] font-bold text-[#004d2c] leading-snug mt-0.5 truncate">
                  {title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                aria-label={isThai ? 'ปิด' : 'Close'}
                className="no-doodle w-9 h-9 rounded-full bg-[#ffffff] border border-[#d4dfd0] hover:border-[#004d2c] flex items-center justify-center text-[#004d2c] cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-[20px] bg-[#ffffff] border border-[#d4dfd0] p-5 flex flex-col items-center justify-center gap-3">
              {scanMode === 'barcode' ? (
                <CrispBarcodeSvg className="w-48 h-24 text-[#004d2c]" />
              ) : (
                <CrispQrSvg className="w-44 h-44 text-[#004d2c]" />
              )}
              <div className="font-mono text-xs font-bold tracking-[0.16em] text-[#004d2c] tabular-nums">
                {ticketCode}
              </div>
            </div>

            <div className="border-t border-dashed border-[#004d2c]/25 pt-3 grid grid-cols-3 gap-2 text-center">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <div className="text-[9.5px] font-mono uppercase tracking-[0.1em] text-[#52705c]">
                    {spec.label}
                  </div>
                  <div className="text-sm font-bold text-[#004d2c] tabular-nums mt-0.5">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-center font-medium text-[#4a6754]">
              {isThai
                ? 'ยื่นหน้าจอนี้ที่เคาน์เตอร์สนามเพื่อเช็กอินเข้าเล่นทันที'
                : 'Present this pass at the venue counter for instant check-in'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
