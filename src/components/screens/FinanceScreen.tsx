import React, { useState } from 'react';
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
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FINANCE_TRANSACTIONS } from '../../data/mockData';
import { playCoinSound } from '../../utils/retroAudio';
import { MobileHeader } from '../common/MobileHeader';

export const FinanceScreen: React.FC = () => {
  const { gainExp, navigateTo, t, language } = useApp();
  const [walletBalance, setWalletBalance] = useState(1250);
  const [payLaterBalance] = useState(0);
  const [transactions, setTransactions] = useState(FINANCE_TRANSACTIONS);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(500);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const handleTopUpConfirm = () => {
    setWalletBalance((prev) => prev + topUpAmount);
    const newTx = {
      id: `tx_${Date.now()}`,
      title: language === 'th' ? 'เติมเงินผ่าน PromptPay QR' : 'PromptPay QR Top-up',
      subtitle: language === 'th' ? 'กระเป๋าเงิน SmashPay สำเร็จ' : 'SmashPay Wallet Credited',
      amount: topUpAmount,
      type: 'credit' as const,
      date: language === 'th' ? 'เมื่อสักครู่' : 'Just now',
      category: 'wallet_topup',
      status: 'completed' as const,
    };
    setTransactions([newTx, ...transactions]);
    playCoinSound();
    gainExp(50, language === 'th' ? `เติมเงิน ฿${topUpAmount} เข้ากระเป๋าเงิน` : `Topped up ฿${topUpAmount} to Wallet`);
    setTopUpSuccess(true);
    setTimeout(() => {
      setTopUpSuccess(false);
      setIsTopUpModalOpen(false);
    }, 1200);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-y-auto overscroll-contain no-scrollbar pb-24">
      {/* 1. Header Card in Slush CI with 1px Solid Black Border */}
      <div className="bg-[#ffffff] text-[#000000] px-4 pt-4 pb-12 border-b border-[#000000] relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-[1600px] bg-[#ffd731] border border-[#000000] flex items-center justify-center text-base">
              🪙
            </span>
            <h1 className="text-2xl font-black text-[#000000] font-['Antonio',sans-serif] tracking-wide uppercase">
              {t.financeHeader}
            </h1>
          </div>
          <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-[9px] font-black uppercase">
            {t.zeroFeesBadge}
          </span>
        </div>

        <p className="text-xs text-[#000000]/70 font-bold max-w-[280px]">
          {t.financeHeaderSub}
        </p>
      </div>

      {/* 2. Floating Dual Cards: SmashPay Wallet & PayLater */}
      <div className="px-4 -mt-8 z-10">
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: SmashPay Wallet */}
          <div className="bg-[#ffffff] rounded-[28px] p-4 border border-[#000000] shadow-sm flex flex-col justify-between h-34 relative overflow-hidden">
            <div>
              <div className="text-[11px] font-bold text-[#000000]/60 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-[#5c4ade]" />
                <span className="truncate">{t.walletTitle}</span>
              </div>
              <div className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000] mt-1">
                ฿{walletBalance.toLocaleString()}
              </div>
            </div>

            <div className="h-4 w-full rounded-[1600px] bg-[#dceeff] border border-[#000000]/30" />
          </div>

          {/* Card 2: PayLater */}
          <div className="bg-[#ffffff] rounded-[28px] p-4 border border-[#000000] shadow-sm flex flex-col justify-between h-34 relative overflow-hidden">
            <div>
              <div className="text-[11px] font-bold text-[#000000]/60 flex items-center justify-between">
                <span className="truncate">{t.payLaterTitle}</span>
                <span className="px-1.5 py-0.2 rounded-[1600px] bg-[#ffd731] border border-[#000000] text-[#000000] text-[8px] font-black">
                  {t.creditBadge}
                </span>
              </div>
              <div className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000] mt-1">
                ฿{payLaterBalance.toFixed(2)}
              </div>
            </div>

            <div className="h-4 w-full rounded-[1600px] bg-[#e9ccff] border border-[#000000]/30" />
          </div>
        </div>

        {/* Quick Action Buttons: Pure language, single line, 1px black border */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            type="button"
            onClick={() => setIsTopUpModalOpen(true)}
            className="py-3 px-4 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] shadow-xs flex items-center justify-center gap-2 hover:bg-[#1a1a1a] transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5] shrink-0" />
            <span className="font-bold text-xs uppercase tracking-wider whitespace-nowrap">
              {t.topUpAction}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('E2')}
            className="py-3 px-4 rounded-[1600px] bg-[#ffffff] text-[#000000] border border-[#000000] shadow-xs flex items-center justify-center gap-2 hover:bg-[#e9e9e9] transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#000000] shrink-0" />
            <span className="font-bold text-xs uppercase tracking-wider whitespace-nowrap">
              {t.transferAction}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Recommended for you (Slush Cards Carousel) */}
      <div className="px-4 mt-6">
        <h2 className="text-base font-black text-[#000000] font-['Antonio',sans-serif] uppercase tracking-wide mb-3">
          {t.recommendedTitle}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {/* Promo Card 1: Mint Slush Promo */}
          <div className="p-4 rounded-[28px] bg-[#55db9c] text-[#000000] border border-[#000000] flex flex-col justify-between h-36 shadow-xs relative overflow-hidden">
            <div>
              <span className="px-2 py-0.5 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[9px] font-black uppercase inline-block">
                CASHBACK
              </span>
              <h3 className="font-['Antonio',sans-serif] text-sm font-black uppercase leading-tight mt-1.5 line-clamp-2">
                {t.promoCashback}
              </h3>
            </div>
            <div className="flex items-center justify-between text-xs font-bold pt-1">
              <span className="text-[10px] text-[#000000]/70 font-bold">10% CASHBACK</span>
              <span className="text-xl">💳</span>
            </div>
          </div>

          {/* Promo Card 2: Sunburst Slush Promo */}
          <div className="p-4 rounded-[28px] bg-[#ffd731] text-[#000000] border border-[#000000] flex flex-col justify-between h-36 shadow-xs relative overflow-hidden">
            <div>
              <span className="px-2 py-0.5 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[9px] font-black uppercase inline-block">
                PARTNER
              </span>
              <h3 className="font-['Antonio',sans-serif] text-sm font-black uppercase leading-tight mt-1.5 line-clamp-2">
                {t.promoTrueMoney}
              </h3>
            </div>
            <div className="flex items-center justify-between text-xs font-bold pt-1">
              <span className="text-[10px] text-[#000000]/70 font-bold">PROMPTPAY QR</span>
              <span className="text-xl">📲</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Transactions Statement */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-[#000000] font-['Antonio',sans-serif] uppercase tracking-wide">
            {t.recentTxTitle}
          </h2>
          <button
            type="button"
            className="text-xs font-bold text-[#000000] flex items-center gap-0.5 hover:underline"
          >
            <span>{t.viewAllTx}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-[#ffffff] rounded-[28px] p-2.5 border border-[#000000] shadow-xs divide-y divide-[#000000]/10">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-3 flex items-center justify-between gap-3 hover:bg-[#dceeff]/30 transition-colors rounded-[20px]">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-[1600px] border border-[#000000] flex items-center justify-center shrink-0 ${
                  tx.type === 'credit' ? 'bg-[#55db9c] text-[#000000]' : 'bg-[#ffd731] text-[#000000]'
                }`}>
                  {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" /> : <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />}
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-[#000000] truncate">
                    {tx.title}
                  </h4>
                  <p className="text-[10px] text-[#000000]/60 font-bold truncate">
                    {tx.subtitle} · {tx.date}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-['Antonio',sans-serif] text-base font-black text-[#000000]">
                  {tx.type === 'credit' ? '+' : ''}฿{Math.abs(tx.amount).toLocaleString()}
                </div>
                <span className="text-[9px] font-bold text-[#000000]/60 block whitespace-nowrap">
                  {tx.status === 'completed' ? t.completedStatus : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top-Up Modal in Slush CI */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#000000]/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] bg-[#ffffff] p-5 shadow-2xl space-y-4 border-2 border-[#000000] text-[#000000]">
            <div className="flex items-center justify-between border-b border-[#000000] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-[1600px] bg-[#ffd731] border border-[#000000] flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-[#000000]" />
                </span>
                <h3 className="font-['Antonio',sans-serif] font-black text-base uppercase tracking-tight text-[#000000]">
                  {t.topUpModalTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTopUpModalOpen(false)}
                className="w-7 h-7 rounded-[1600px] bg-[#cccccc] border border-[#000000] flex items-center justify-center text-[#000000] hover:bg-[#ff5c34] hover:text-[#ffffff] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {topUpSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-[1600px] bg-[#55db9c] border-2 border-[#000000] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#000000] stroke-[2.5]" />
                </div>
                <h4 className="font-['Antonio',sans-serif] text-2xl font-black uppercase text-[#000000]">
                  {language === 'th' ? `เติมเงินสำเร็จ +฿${topUpAmount}!` : `Top-up +฿${topUpAmount} Successful!`}
                </h4>
                <p className="text-xs text-[#000000]/70 font-bold">{t.topUpSuccessMsg}</p>
              </div>
            ) : (
              <>
                <div className="text-center py-2">
                  <span className="text-xs font-bold text-[#000000]/60">{t.selectAmount}:</span>
                  <div className="font-['Antonio',sans-serif] text-4xl font-black text-[#000000] my-1">
                    ฿{topUpAmount}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[100, 300, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-2 rounded-[1600px] text-xs font-bold border border-[#000000] transition-all cursor-pointer ${
                        topUpAmount === amt
                          ? 'bg-[#000000] text-[#ffffff]'
                          : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                      }`}
                    >
                      ฿{amt}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleTopUpConfirm}
                  className="w-full py-3.5 rounded-[1600px] bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] font-bold text-xs uppercase tracking-[0.032em] transition-all border border-[#000000] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{t.topUpPromptPayBtn}</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
