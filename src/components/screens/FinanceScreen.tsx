import React, { useState } from 'react';
import {
 Plus,
 ArrowLeft,
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
import { FINANCE_TRANSACTIONS } from '../../data/mockData';
import { playCoinSound, playSelectSound } from '../../utils/retroAudio';
import { SectionHeader } from '../common/SectionHeader';

export const FinanceScreen: React.FC = () => {
 const { player, gainExp, navigateTo, goBack, t, language } = useApp();
 const isThai = language === 'th';
 const [walletBalance, setWalletBalance] = useState(1250);
 const [payLaterBalance] = useState(0);
 const [transactions, setTransactions] = useState(FINANCE_TRANSACTIONS);
 const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
 const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
 const [topUpAmount, setTopUpAmount] = useState(500);
 const [topUpSuccess, setTopUpSuccess] = useState(false);

 const handleTopUpConfirm = () => {
 setWalletBalance((prev) => prev + topUpAmount);
 const newTx = {
 id: `tx_${Date.now()}`,
 title: language === 'th' ? 'เติมเงินผ่านพร้อมเพย์' : 'PromptPay QR Top-up',
 subtitle: language === 'th' ? 'เติมเครดิตกระเป๋าเงินสำเร็จ' : 'SmashPay Wallet Credited',
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
    <div className="flex-1 min-h-0 flex flex-col bg-[#f5f5f7] text-[#111111] overflow-y-auto overscroll-contain no-scrollbar pb-24">
      <div className="bg-gradient-to-b from-[#ffffff] via-[#fafafc] to-[#f5f5f7] pb-12">
        <header className="sticky top-0 z-30 app-header-safe px-5 pb-3 flex items-center justify-between gap-3 bg-[#ffffff]/85 backdrop-blur-md shrink-0 select-none text-[#111111]">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              goBack();
            }}
            className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#111111] hover:bg-[#f3f4f6] active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label={isThai ? 'ย้อนกลับ' : 'Back'}
            title={isThai ? 'ย้อนกลับ' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </button>

          <div className="min-w-0 flex-1 text-center px-1">
            <h1 className="text-[15px] font-semibold text-[#111111] tracking-tight leading-tight truncate">
              {t.financeHeader}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setIsPointsModalOpen(true);
            }}
            aria-label={isThai ? 'แต้มของฉัน' : 'My Points'}
            title={isThai ? 'แต้มของฉัน' : 'My Points'}
            className="no-doodle w-11 h-11 rounded-full bg-[#ffffff] shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#15803d] hover:bg-[#f3f4f6] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 stroke-[1.9]" />
          </button>
        </header>
      </div>

      {/* 2. Floating Dual Cards: SmashPay Wallet & PayLater */}
      <div className="px-5 -mt-8 z-10">
 <div className="grid grid-cols-2 gap-3">
 {/* Card 1: SmashPay Wallet */}
 <div className="bg-[#ffffff] rounded-[28px] p-4 shadow-sm flex flex-col justify-between h-34 relative overflow-hidden">
 <div>
 <div className="text-[11px] font-bold text-[#000000]/60 flex items-center gap-1.5">
 <Wallet className="w-3.5 h-3.5 text-[#15803d]" />
 <span className="truncate">{t.walletTitle}</span>
 </div>
 <div className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000] mt-1">
 ฿{walletBalance.toLocaleString()}
 </div>
 </div>

 <div className="h-4 w-full rounded-[1600px] bg-[#f4f8fb] " />
 </div>

 {/* Card 2: PayLater */}
 <div className="bg-[#ffffff] rounded-[28px] p-4 shadow-sm flex flex-col justify-between h-34 relative overflow-hidden">
 <div>
 <div className="text-[11px] font-bold text-[#000000]/60 flex items-center justify-between">
 <span className="truncate">{t.payLaterTitle}</span>
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#e85729] text-[#ffffff] text-[8px] font-black whitespace-nowrap shrink-0">
 {t.creditBadge}
 </span>
 </div>
 <div className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000] mt-1">
 ฿{payLaterBalance.toFixed(2)}
 </div>
 </div>

 <div className="h-4 w-full rounded-[1600px] bg-[#e8f7ee] " />
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

 {/* 3. Recommended for you (Grab-Style Slush Cards Carousel) */}
 <div className="px-4 mt-6 space-y-2.5">
 <SectionHeader
 title={t.recommendedTitle}
 badge={isThai ? 'สิทธิพิเศษ' : 'DEALS'}
 badgeVariant="green"
 />

 <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 snap-x scroll-smooth">
 {/* Promo Card 1 */}
 <div
 onClick={() => {
 playCoinSound();
 setIsTopUpModalOpen(true);
 }}
 className="w-[240px] shrink-0 p-4 rounded-[28px] bg-[#7cd7a0] text-[#000000] flex flex-col justify-between h-44 shadow-sm snap-start cursor-pointer hover:opacity-95 transition-all"
 >
 <div>
 <div className="flex items-center justify-between mb-1">
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#ffffff] text-[9px] font-black uppercase">
 {isThai ? 'สแมชเพย์' : 'SMASHPAY'}
 </span>
 <span className="text-[10px] font-bold">{isThai ? 'เงินคืน 10%' : '10% CASHBACK'}</span>
 </div>
 <h3 className="font-['Antonio',sans-serif] text-base font-black uppercase leading-tight mt-1 text-[#000000]">
 {isThai ? 'เริ่มใช้กระเป๋าเงินสแมชเพย์' : 'Get started with SmashPay Wallet'}
 </h3>
 <p className="text-[10px] text-[#000000]/80 font-bold mt-1 line-clamp-2">
 {isThai ? 'เติมเงินครั้งแรกรับคืน 10% พร้อมจองคอร์ทไว' : 'Get 10% cashback on first top-up & express booking'}
 </p>
 </div>
 <div className="flex items-center justify-between pt-1">
 <span className="text-xs font-bold underline">{isThai ? 'เติมเงินทันที →' : 'Top up now →'}</span>
 <span className="text-2xl">📱</span>
 </div>
 </div>

 {/* Promo Card 2 */}
 <div
 onClick={() => {
 playCoinSound();
 setIsTopUpModalOpen(true);
 }}
 className="w-[240px] shrink-0 p-4 rounded-[28px] bg-[#e85729] text-[#000000] flex flex-col justify-between h-44 shadow-sm snap-start cursor-pointer hover:opacity-95 transition-all"
 >
 <div>
 <div className="flex items-center justify-between mb-1">
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#ffffff] text-[9px] font-black uppercase">
 {isThai ? 'พันธมิตร' : 'PARTNER'}
 </span>
 <span className="text-[10px] font-bold">{isThai ? 'ฟรีค่าธรรมเนียม' : '0% FEE'}</span>
 </div>
 <h3 className="font-['Antonio',sans-serif] text-base font-black uppercase leading-tight mt-1 text-[#000000]">
 {isThai ? 'จ่ายง่ายด้วยทรูมันนี่' : 'Pay easily with TrueMoney'}
 </h3>
 <p className="text-[10px] text-[#000000]/80 font-bold mt-1 line-clamp-2">
 {isThai ? 'สแกนจ่ายไวผ่านทรูมันนี่และพร้อมเพย์' : 'Fast contactless scan via TrueMoney & PromptPay'}
 </p>
 </div>
 <div className="flex items-center justify-between pt-1">
 <span className="text-xs font-bold underline">{isThai ? 'สแกนจ่าย →' : 'Scan & Pay →'}</span>
 <span className="text-2xl">⚡</span>
 </div>
 </div>

 {/* Promo Card 3 */}
 <div
 onClick={() => {
 playSelectSound();
 navigateTo('B1');
 }}
 className="w-[240px] shrink-0 p-4 rounded-[28px] bg-[#e8f7ee] text-[#000000] flex flex-col justify-between h-44 shadow-sm snap-start cursor-pointer hover:opacity-95 transition-all"
 >
 <div>
 <div className="flex items-center justify-between mb-1">
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#ffffff] text-[9px] font-black uppercase">
 {isThai ? 'จ่ายทีหลัง' : 'PAYLATER'}
 </span>
 <span className="text-[10px] font-bold">{isThai ? 'ดอกเบี้ย 0%' : '0% INTEREST'}</span>
 </div>
 <h3 className="font-['Antonio',sans-serif] text-base font-black uppercase leading-tight mt-1 text-[#000000]">
 {isThai ? 'ตีแบดก่อน ผ่อน 0% 3 เดือน' : 'Play First, PayLater 0% 3 Months'}
 </h3>
 <p className="text-[10px] text-[#000000]/80 font-bold mt-1 line-clamp-2">
 {isThai ? 'ผ่อนค่าคอร์ทและอุปกรณ์สบายๆ นาน 3 เดือน' : 'Split court and gear costs 0% over 3 months'}
 </p>
 </div>
 <div className="flex items-center justify-between pt-1">
 <span className="text-xs font-bold underline">{isThai ? 'ดูวงเงิน →' : 'Check limit →'}</span>
 <span className="text-2xl">💳</span>
 </div>
 </div>

 {/* Promo Card 4 */}
 <div
 onClick={() => {
 playSelectSound();
 navigateTo('F1');
 }}
 className="w-[240px] shrink-0 p-4 rounded-[28px] bg-[#ffffff] text-[#000000] flex flex-col justify-between h-44 shadow-sm snap-start cursor-pointer hover:bg-[#f8f9fa] transition-all"
 >
 <div>
 <div className="flex items-center justify-between mb-1">
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#000000] text-[#e85729] text-[9px] font-black uppercase">
 {isThai ? 'สแมชโปร' : 'PRO PASS'}
 </span>
 <span className="text-[10px] font-bold text-[#15803d]">{isThai ? '฿199/เดือน' : '฿199/mo'}</span>
 </div>
 <h3 className="font-['Antonio',sans-serif] text-base font-black uppercase leading-tight mt-1 text-[#000000]">
 {isThai ? 'แพ็กเกจสมาชิกสแมชโปร' : 'Smash Pro Member Pass'}
 </h3>
 <p className="text-[10px] text-[#000000]/70 font-bold mt-1 line-clamp-2">
 {isThai ? 'ลดค่าสนาม 10% พร้อมวิเคราะห์เกมไม่จำกัด' : '10% off courts & unlimited game analysis'}
 </p>
 </div>
 <div className="flex items-center justify-between pt-1">
 <span className="text-xs font-bold underline">{isThai ? 'สมัครสมาชิก →' : 'Join now →'}</span>
 <span className="text-2xl">👑</span>
 </div>
 </div>
 </div>
 </div>

 {/* 4. Recent Transactions Statement */}
 <div className="px-4 mt-6 space-y-2">
 <SectionHeader
 title={t.recentTxTitle}
 rightSlot={
 <button
 type="button"
 className="text-xs font-bold text-[#000000] flex items-center gap-0.5 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
 >
 <span>{t.viewAllTx}</span>
 <ChevronRight className="w-3.5 h-3.5 shrink-0" />
 </button>
 }
 />

 <div className="bg-[#ffffff] rounded-[28px] p-2.5 shadow-xs ">
 {transactions.map((tx) => (
 <div key={tx.id} className="p-3 flex items-center justify-between gap-3 hover:bg-[#f4f8fb]/30 transition-colors rounded-[20px]">
 <div className="flex items-center gap-3 min-w-0">
 <div className={`w-9 h-9 rounded-[1600px] flex items-center justify-center shrink-0 ${
 tx.type === 'credit' ? 'bg-[#7cd7a0] text-[#000000]' : 'bg-[#e85729] text-[#000000]'
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
 {tx.status === 'completed' ? t.completedStatus : (isThai ? 'รอดำเนินการ' : 'Pending')}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Top-Up Modal in Slush CI */}
 {isTopUpModalOpen && (
 <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#000000]/60 backdrop-blur-xs">
 <div className="w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] bg-[#ffffff] p-5 shadow-2xl space-y-4 text-[#000000]">
 <div className="flex items-center justify-between pb-3">
 <div className="flex items-center gap-2">
 <span className="w-8 h-8 rounded-[1600px] bg-[#e85729] flex items-center justify-center">
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
 <div className="w-16 h-16 mx-auto rounded-[1600px] bg-[#7cd7a0] flex items-center justify-center">
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

 {/* 6. My Points Overview Modal */}
 {isPointsModalOpen && (
 <div className="fixed inset-0 z-50 bg-[#000000]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
 <div className="w-full max-w-[340px] rounded-[28px] bg-[#ffffff] border-2 border-[#000000] p-5 shadow-[4px_6px_0px_#000000] space-y-4">
 <div className="flex items-center justify-between pb-3 border-b border-[#000000]/10">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-[1600px] bg-[#7cd7a0] flex items-center justify-center">
 <Sparkles className="w-4 h-4 text-[#000000]" />
 </div>
 <h3 className="font-['Antonio',sans-serif] font-black text-base uppercase tracking-tight text-[#000000]">
 {isThai ? 'แต้มของฉัน' : 'My Smash Points'}
 </h3>
 </div>
 <button
 type="button"
 onClick={() => setIsPointsModalOpen(false)}
 className="w-7 h-7 rounded-[1600px] bg-[#e5e7eb] flex items-center justify-center text-[#000000] hover:bg-[#e85729] hover:text-[#ffffff] cursor-pointer"
 >
 <X className="w-4 h-4 stroke-[2.5]" />
 </button>
 </div>

 <div className="rounded-[20px] bg-[#e8f7ee] p-4 space-y-2">
 <div className="flex items-center justify-between text-xs font-bold text-[#000000]/70">
 <span>{isThai ? 'คะแนนสะสมปัจจุบัน' : 'Current Balance'}</span>
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[10px]">
 {isThai ? `เลเวล ${player.level}` : `Lv.${player.level} · ${player.tier}`}
 </span>
 </div>
 <div className="font-['Antonio',sans-serif] text-3xl font-black text-[#000000] tabular-nums">
 {player.currentExp.toLocaleString()} {isThai ? 'แต้ม' : 'PTS'}
 </div>
 <div className="w-full h-2 rounded-full bg-[#ffffff] overflow-hidden">
 <div
 className="h-full bg-[#7cd7a0] rounded-full transition-all"
 style={{ width: `${Math.min(100, Math.round((player.currentExp / Math.max(1, player.nextLevelExp)) * 100))}%` }}
 />
 </div>
 <p className="text-[11px] text-[#000000]/65 font-normal">
 {isThai
 ? `อีก ${Math.max(0, player.nextLevelExp - player.currentExp).toLocaleString()} แต้ม เพื่ออัปเลเวลถัดไปและรับคูปองลดค่าคอร์ท`
 : `${Math.max(0, player.nextLevelExp - player.currentExp).toLocaleString()} pts to reach next level & unlock court vouchers.`}
 </p>
 </div>

 <div className="space-y-2">
 <div className="rounded-[16px] bg-[#f4f8fb] p-3 flex items-center justify-between text-xs">
 <span className="font-bold text-[#000000]">{isThai ? 'ส่วนลดค่าคอร์ท ฿50' : '฿50 Court Discount'}</span>
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#ffffff] text-[10px] font-bold text-[#15803d]">
 500 {isThai ? 'แต้ม' : 'PTS'}
 </span>
 </div>
 <div className="rounded-[16px] bg-[#f4f8fb] p-3 flex items-center justify-between text-xs">
 <span className="font-bold text-[#000000]">{isThai ? 'ฟรีค่าธรรมเนียมก๊วน' : 'Free Squad Fee'}</span>
 <span className="px-2 py-0.5 rounded-[1600px] bg-[#ffffff] text-[10px] font-bold text-[#15803d]">
 300 {isThai ? 'แต้ม' : 'PTS'}
 </span>
 </div>
 </div>

 <button
 type="button"
 onClick={() => {
 playSelectSound();
 setIsPointsModalOpen(false);
 navigateTo('D2');
 }}
 className="w-full py-3 rounded-[1600px] bg-[#000000] text-[#ffffff] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
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
