import React, { useState } from 'react';
import { Cloud, Lock } from 'lucide-react';
import {
  Plus,
  ArrowRightLeft,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  CheckCircle2,
  X,
  Wallet,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playCoinSound, playSelectSound } from '../../utils/retroAudio';

interface FinancePanelProps {
  embeddedInProfile?: boolean;
  externalPointsModalOpen?: boolean;
  onClosePointsModal?: () => void;
}

export const FinancePanel: React.FC<FinancePanelProps> = ({
  embeddedInProfile = false,
  externalPointsModalOpen,
  onClosePointsModal,
}) => {
  const {
    player,
    navigateTo,
    t,
    language,
    walletBalance,
    walletTransactions,
    vouchers,
    redeemPointsVoucher,
    topUpWallet,
    authUser,
    signInWithGoogle,
    isAuthBusy,
  } = useApp();
  const isThai = language === 'th';
  const [payLaterBalance] = useState(0);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [internalPointsModalOpen, setInternalPointsModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(500);
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [isSubmittingTopUp, setIsSubmittingTopUp] = useState(false);
  const [showAllTx, setShowAllTx] = useState(false);
  const [txFilter, setTxFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [redeemFeedback, setRedeemFeedback] = useState<string | null>(null);

  const filteredTransactions = walletTransactions.filter((tx) =>
    txFilter === 'all' ? true : tx.type === txFilter
  );
  const visibleTransactions = showAllTx
    ? filteredTransactions
    : filteredTransactions.slice(0, 4);
  const activeVouchers = vouchers.filter((v) => !v.used);

  const isPointsModalOpen =
    externalPointsModalOpen !== undefined ? externalPointsModalOpen : internalPointsModalOpen;
  const closePointsModal = () => {
    if (onClosePointsModal) {
      onClosePointsModal();
    } else {
      setInternalPointsModalOpen(false);
    }
  };

  const handleTopUpConfirm = async () => {
    if (isSubmittingTopUp) return;
    setIsSubmittingTopUp(true);
    try {
      await topUpWallet(topUpAmount);
      setTopUpSuccess(true);
      setTimeout(() => {
        setTopUpSuccess(false);
        setIsTopUpModalOpen(false);
      }, 1200);
    } catch (err) {
      console.error('Top-up failed:', err);
    } finally {
      setIsSubmittingTopUp(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dual Wallet Cards */}
      <div className={embeddedInProfile ? '' : 'px-5 -mt-8 z-10 relative'}>
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: SmashPay Wallet */}
          <div className="bg-[#ffffff] rounded-[24px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[126px] relative overflow-hidden">
            <div>
              <div className="text-[11px] font-medium text-[#71717a] flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                <span className="truncate">{t.walletTitle}</span>
              </div>
              <div className="text-[24px] font-bold text-[#111111] tabular-nums mt-1.5 leading-tight">
                ฿{walletBalance.toLocaleString()}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-[#15803d] bg-[#e8f7ee] px-2.5 py-1 rounded-full">
              <span className="truncate">{isThai ? 'พร้อมใช้ทันที' : 'Ready to pay'}</span>
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  setInternalPointsModalOpen(true);
                }}
                className="no-doodle underline font-semibold shrink-0 cursor-pointer"
              >
                {player.currentExp.toLocaleString()} {isThai ? 'แต้ม' : 'pts'}
              </button>
            </div>
          </div>

          {/* Card 2: PayLater */}
          <div className="bg-[#ffffff] rounded-[24px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[126px] relative overflow-hidden">
            <div>
              <div className="text-[11px] font-medium text-[#71717a] flex items-center justify-between gap-1">
                <span className="truncate">{t.payLaterTitle}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#e85729] text-[#ffffff] text-[9px] font-semibold whitespace-nowrap shrink-0">
                  {t.creditBadge}
                </span>
              </div>
              <div className="text-[24px] font-bold text-[#111111] tabular-nums mt-1.5 leading-tight">
                ฿{payLaterBalance.toFixed(2)}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-[#52525b] bg-[#f5f5f7] px-2.5 py-1 rounded-full">
              <span className="truncate">{isThai ? 'ผ่อน 0% 3 เดือน' : '0% · 3 months'}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setIsTopUpModalOpen(true);
            }}
            className="no-doodle py-3 px-4 rounded-full bg-[#111111] text-[#ffffff] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center gap-2 hover:bg-[#27272a] transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.25] shrink-0" />
            <span className="font-semibold text-xs whitespace-nowrap">{t.topUpAction}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              navigateTo('E2');
            }}
            className="no-doodle py-3 px-4 rounded-full bg-[#ffffff] text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center gap-2 hover:bg-[#f4f4f5] transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#111111] shrink-0" />
            <span className="font-semibold text-xs whitespace-nowrap">{t.transferAction}</span>
          </button>
        </div>
        {/* Cloud Sync Banner */}
        <div className="mt-3 rounded-[20px] bg-[#ffffff] px-3.5 py-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                authUser ? 'bg-[#e8f7ee] text-[#15803d]' : 'bg-[#f5f5f7] text-[#71717a]'
              }`}
            >
              {authUser ? <Cloud className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-[#111111] truncate">
                {authUser
                  ? isThai
                    ? 'ซิงค์กระเป๋าเงินบนคลาวด์แล้ว'
                    : 'Cloud Wallet Synced'
                  : isThai
                  ? 'โหมดทดลอง (ยังไม่เชื่อมบัญชี)'
                  : 'Demo Wallet (Local)'}
              </div>
              <div className="text-[10px] text-[#71717a] truncate">
                {authUser
                  ? authUser.email || authUser.displayName
                  : isThai
                  ? 'ล็อกอิน Google เพื่อบันทึกประวัติการเงินจริง'
                  : 'Sign in with Google to save transactions'}
              </div>
            </div>
          </div>
          {!authUser && (
            <button
              type="button"
              disabled={isAuthBusy}
              onClick={() => signInWithGoogle()}
              className="no-doodle px-3 py-1.5 rounded-full bg-[#111111] text-[#ffffff] text-[10px] font-semibold whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
            >
              {isAuthBusy
                ? isThai ? 'กำลังเข้าสู่ระบบ...' : 'Signing in...'
                : isThai ? 'เชื่อมต่อ Google' : 'Sign in'}
            </button>
          )}
        </div>
      </div>

      {/* Deals / Perks Carousel */}
      <div className={embeddedInProfile ? 'space-y-2.5' : 'px-4 mt-2 space-y-2.5'}>
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[13px] font-semibold text-[#6b7280]">{t.recommendedTitle}</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-[#e8f7ee] text-[#15803d] text-[10px] font-semibold">
            {isThai ? 'สิทธิพิเศษ' : 'DEALS'}
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 pt-0.5 snap-x scroll-smooth">
          {/* Promo Card 1 */}
          <button
            type="button"
            onClick={() => {
              playCoinSound();
              setIsTopUpModalOpen(true);
            }}
            className="no-doodle w-[230px] shrink-0 p-4 rounded-[24px] bg-[#7cd7a0] text-[#111111] flex flex-col justify-between h-40 shadow-[0_2px_10px_rgba(0,0,0,0.04)] snap-start cursor-pointer hover:opacity-95 transition-all text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#ffffff] text-[9px] font-bold">
                  {isThai ? 'สแมชเพย์' : 'SMASHPAY'}
                </span>
                <span className="text-[10px] font-semibold">
                  {isThai ? 'เงินคืน 10%' : '10% CASHBACK'}
                </span>
              </div>
              <h4 className="text-sm font-bold leading-snug mt-1 text-[#111111]">
                {isThai ? 'เริ่มใช้กระเป๋าเงินสแมชเพย์' : 'Get started with SmashPay'}
              </h4>
              <p className="text-[11px] text-[#111111]/75 mt-1 line-clamp-2">
                {isThai
                  ? 'เติมเงินครั้งแรกรับคืน 10% พร้อมจองคอร์ทไว'
                  : '10% cashback on first top-up & instant booking'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold underline">
                {isThai ? 'เติมเงินทันที →' : 'Top up now →'}
              </span>
              <span className="text-xl">📱</span>
            </div>
          </button>

          {/* Promo Card 2 */}
          <button
            type="button"
            onClick={() => {
              playCoinSound();
              setIsTopUpModalOpen(true);
            }}
            className="no-doodle w-[230px] shrink-0 p-4 rounded-[24px] bg-[#e85729] text-[#ffffff] flex flex-col justify-between h-40 shadow-[0_2px_10px_rgba(0,0,0,0.04)] snap-start cursor-pointer hover:opacity-95 transition-all text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#ffffff] text-[#111111] text-[9px] font-bold">
                  {isThai ? 'พันธมิตร' : 'PARTNER'}
                </span>
                <span className="text-[10px] font-semibold">
                  {isThai ? 'ฟรีค่าธรรมเนียม' : '0% FEE'}
                </span>
              </div>
              <h4 className="text-sm font-bold leading-snug mt-1">
                {isThai ? 'จ่ายง่ายด้วยทรูมันนี่' : 'Pay easily with TrueMoney'}
              </h4>
              <p className="text-[11px] text-[#ffffff]/85 mt-1 line-clamp-2">
                {isThai
                  ? 'สแกนจ่ายไวผ่านทรูมันนี่และพร้อมเพย์'
                  : 'Fast contactless scan via TrueMoney & PromptPay'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold underline">
                {isThai ? 'สแกนจ่าย →' : 'Scan & Pay →'}
              </span>
              <span className="text-xl">⚡</span>
            </div>
          </button>

          {/* Promo Card 3 */}
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              navigateTo('B1');
            }}
            className="no-doodle w-[230px] shrink-0 p-4 rounded-[24px] bg-[#e8f7ee] text-[#111111] flex flex-col justify-between h-40 shadow-[0_2px_10px_rgba(0,0,0,0.04)] snap-start cursor-pointer hover:opacity-95 transition-all text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#ffffff] text-[9px] font-bold">
                  {isThai ? 'จ่ายทีหลัง' : 'PAYLATER'}
                </span>
                <span className="text-[10px] font-semibold text-[#15803d]">
                  {isThai ? 'ดอกเบี้ย 0%' : '0% INTEREST'}
                </span>
              </div>
              <h4 className="text-sm font-bold leading-snug mt-1">
                {isThai ? 'ตีแบดก่อน ผ่อน 0% 3 เดือน' : 'Play First, PayLater 0%'}
              </h4>
              <p className="text-[11px] text-[#111111]/75 mt-1 line-clamp-2">
                {isThai
                  ? 'ผ่อนค่าคอร์ทและอุปกรณ์สบายๆ นาน 3 เดือน'
                  : 'Split court and gear costs 0% over 3 months'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold underline">
                {isThai ? 'ดูวงเงิน →' : 'Check limit →'}
              </span>
              <span className="text-xl">💳</span>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Transactions Statement */}
      <div className={embeddedInProfile ? 'space-y-2' : 'px-4 mt-2 space-y-2'}>
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[13px] font-semibold text-[#5c6f5e]">
            {t.recentTxTitle} ({filteredTransactions.length})
          </h3>
          {filteredTransactions.length > 4 && (
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setShowAllTx((prev) => !prev);
              }}
              className="no-doodle text-xs font-semibold text-[#004d2c] flex items-center gap-0.5 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>
                {showAllTx
                  ? isThai
                    ? 'ย่อรายการ'
                    : 'Show less'
                  : t.viewAllTx}
              </span>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${showAllTx ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        {/* Transaction Filter Chips */}
        <div className="flex items-center gap-1.5 px-1">
          {[
            { id: 'all' as const, label: isThai ? 'ทั้งหมด' : 'All' },
            { id: 'credit' as const, label: isThai ? 'เงินเข้า' : 'Credits' },
            { id: 'debit' as const, label: isThai ? 'เงินออก' : 'Debits' },
          ].map((tab) => {
            const active = txFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playSelectSound();
                  setTxFilter(tab.id);
                }}
                className={`no-doodle px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c]'
                    : 'bg-[#ffffff] text-[#5c6f5e] border-[#d4dfd0] hover:border-[#2d4d14]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-[#ffffff] rounded-[24px] p-2 border border-[#d4dfd0] shadow-2xs divide-y divide-[#d4dfd0]/60">
          {visibleTransactions.length === 0 ? (
            <div className="p-5 text-center text-xs text-[#5c6f5e] font-medium">
              {isThai ? 'ยังไม่มีรายการในหมวดนี้' : 'No transactions in this filter'}
            </div>
          ) : (
            visibleTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 flex items-center justify-between gap-3 hover:bg-[#f8faf6] transition-colors rounded-[16px]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === 'credit'
                        ? 'bg-[#e8f7ee] text-[#15803d]'
                        : 'bg-[#fff5f2] text-[#e85729]'
                    }`}
                  >
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft className="w-4 h-4 stroke-[2.2]" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs text-[#142608] truncate">{tx.title}</h4>
                    <p className="text-[11px] text-[#5c6f5e] truncate mt-0.5">
                      {tx.subtitle} · {tx.date}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-bold tabular-nums ${
                      tx.type === 'credit' ? 'text-[#15803d]' : 'text-[#142608]'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}฿{Math.abs(tx.amount).toLocaleString()}
                  </div>
                  <span className="text-[10px] font-medium text-[#5c6f5e] block whitespace-nowrap">
                    {tx.status === 'completed'
                      ? t.completedStatus
                      : isThai
                        ? 'รอดำเนินการ'
                        : 'Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top-Up Modal */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#000000]/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] bg-[#ffffff] p-5 shadow-2xl space-y-4 text-[#111111]">
            <div className="flex items-center justify-between pb-2 border-b border-[#000000]/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-[#e8f7ee] flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-[#15803d]" />
                </span>
                <h3 className="font-semibold text-base text-[#111111]">{t.topUpModalTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTopUpModalOpen(false)}
                className="no-doodle w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#111111] hover:bg-[#e5e7eb] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {topUpSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#e8f7ee] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#15803d] stroke-[2.2]" />
                </div>
                <h4 className="text-xl font-bold text-[#111111]">
                  {language === 'th'
                    ? `เติมเงินสำเร็จ +฿${topUpAmount}!`
                    : `Top-up +฿${topUpAmount} Successful!`}
                </h4>
                <p className="text-xs text-[#71717a]">{t.topUpSuccessMsg}</p>
              </div>
            ) : (
              <>
                <div className="text-center py-2">
                  <span className="text-xs font-medium text-[#71717a]">{t.selectAmount}:</span>
                  <div className="text-4xl font-bold text-[#111111] tabular-nums my-1">
                    ฿{topUpAmount}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[100, 300, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        playSelectSound();
                        setTopUpAmount(amt);
                      }}
                      className={`no-doodle py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        topUpAmount === amt
                          ? 'bg-[#111111] text-[#ffffff]'
                          : 'bg-[#f5f5f7] text-[#111111] hover:bg-[#ececef]'
                      }`}
                    >
                      ฿{amt}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleTopUpConfirm}
                  className="no-doodle w-full py-3.5 rounded-full bg-[#111111] hover:bg-[#27272a] text-[#ffffff] font-semibold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{t.topUpPromptPayBtn}</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* My Points Overview Modal */}
      {isPointsModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-[340px] rounded-[28px] bg-[#ffffff] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#000000]/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#e8f7ee] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#15803d]" />
                </div>
                <h3 className="font-semibold text-base text-[#111111]">
                  {isThai ? 'แต้มของฉัน' : 'My Smash Points'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closePointsModal}
                className="no-doodle w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#111111] hover:bg-[#e5e7eb] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            <div className="rounded-[20px] bg-[#e8f7ee] p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-[#15803d]">
                <span>{isThai ? 'คะแนนสะสมปัจจุบัน' : 'Current Balance'}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#111111] text-[#ffffff] text-[10px] font-semibold">
                  {isThai ? `เลเวล ${player.level}` : `Lv.${player.level} · ${player.tier}`}
                </span>
              </div>
              <div className="text-3xl font-bold text-[#111111] tabular-nums">
                {player.currentExp.toLocaleString()} {isThai ? 'แต้ม' : 'PTS'}
              </div>
              <div className="w-full h-2 rounded-full bg-[#ffffff] overflow-hidden">
                <div
                  className="h-full bg-[#15803d] rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((player.currentExp / Math.max(1, player.nextLevelExp)) * 100)
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-[#3f3f46] leading-relaxed">
                {isThai
                  ? `อีก ${Math.max(0, player.nextLevelExp - player.currentExp).toLocaleString()} แต้ม เพื่ออัปเลเวลถัดไปและรับคูปองลดค่าคอร์ท`
                  : `${Math.max(0, player.nextLevelExp - player.currentExp).toLocaleString()} pts to reach next level & unlock court vouchers.`}
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  costExp: 500,
                  titleTh: 'ส่วนลดค่าคอร์ท ฿50',
                  titleEn: '฿50 Court Discount',
                  discountAmount: 50,
                  target: 'court' as const,
                },
                {
                  costExp: 300,
                  titleTh: 'ส่วนลดค่าก๊วน ฿30',
                  titleEn: '฿30 Squad Fee Off',
                  discountAmount: 30,
                  target: 'squad' as const,
                },
              ].map((reward) => {
                const canAfford = player.currentExp >= reward.costExp;
                return (
                  <button
                    key={reward.titleEn}
                    type="button"
                    disabled={!canAfford}
                    onClick={() => {
                      const res = redeemPointsVoucher(reward);
                      if (res.ok && res.voucher) {
                        setRedeemFeedback(
                          isThai
                            ? `แลกสำเร็จ! โค้ด ${res.voucher.code} พร้อมใช้ตอนชำระเงิน`
                            : `Redeemed! Code ${res.voucher.code} ready at checkout`
                        );
                        setTimeout(() => setRedeemFeedback(null), 4000);
                      }
                    }}
                    className={`no-doodle w-full rounded-[16px] p-3 border flex items-center justify-between text-xs transition-all text-left ${
                      canAfford
                        ? 'bg-[#f8faf6] border-[#d4dfd0] hover:border-[#004d2c] cursor-pointer active:scale-[0.99]'
                        : 'bg-[#f5f5f7] border-transparent opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span className="font-semibold text-[#142608]">
                      {isThai ? reward.titleTh : reward.titleEn}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#004d2c] text-[#ffffff] text-[10px] font-semibold whitespace-nowrap shrink-0">
                      {isThai ? `แลก ${reward.costExp} แต้ม` : `Redeem ${reward.costExp}`}
                    </span>
                  </button>
                );
              })}

              {redeemFeedback && (
                <div className="p-2.5 rounded-[14px] bg-[#e8f7ee] border border-[#7cd7a0] text-[11px] font-semibold text-[#004d2c] text-center">
                  {redeemFeedback}
                </div>
              )}

              {activeVouchers.length > 0 && (
                <div className="pt-1 space-y-1">
                  <div className="text-[10px] font-semibold text-[#5c6f5e] uppercase tracking-wider">
                    {isThai ? `คูปองพร้อมใช้งาน (${activeVouchers.length})` : `Active Vouchers (${activeVouchers.length})`}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeVouchers.map((v) => (
                      <span
                        key={v.id}
                        className="px-2.5 py-1 rounded-full bg-[#e8f7ee] text-[#004d2c] text-[10px] font-semibold border border-[#7cd7a0]"
                      >
                        {isThai ? v.titleTh : v.titleEn} · {v.code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                playSelectSound();
                closePointsModal();
                navigateTo('D2');
              }}
              className="no-doodle w-full py-3 rounded-full bg-[#111111] text-[#ffffff] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isThai ? 'ไปเก็บแต้มเพิ่มในภารกิจ' : 'Earn More Points in Quests'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
