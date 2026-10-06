import React, { useState } from 'react';
import {
  Smartphone,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  QrCode,
  DollarSign,
  Receipt,
  UserCheck,
  Truck,
  Store,
  Sprout,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { RealPaymentModal } from '../../components/payment/RealPaymentModal';

export const PaymentLedgerView: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    amount: number;
    beneficiaryName: string;
    beneficiarySubtitle: string;
    paymentType: 'merchant_to_farmer' | 'farmer_to_transporter' | 'agri_input';
  }>({
    title: 'Merchant to Farmer Crop Settlement',
    amount: 315000,
    beneficiaryName: 'Ramesh Patil (Farmer)',
    beneficiarySubtitle: 'Soybean Lot #1 (60 Quintals) • Choithram APMC',
    paymentType: 'merchant_to_farmer',
  });

  // Custom Test Payment State
  const [customAmount, setCustomAmount] = useState<number>(5000);
  const [customBeneficiary, setCustomBeneficiary] = useState<string>('Ramesh Patil (Farmer)');
  const [customNotes, setCustomNotes] = useState<string>('Produce Deal Advance');

  // Transactions History State
  const [transactions, setTransactions] = useState<any[]>([
    {
      id: 'TXN-90218',
      ref: 'UPI/782190384912',
      type: 'Merchant ➔ Farmer Deal Settlement',
      from: 'Suresh Agrawal (Merchant)',
      to: 'Ramesh Patil (Farmer)',
      amount: 315000,
      mode: 'PhonePe UPI',
      status: 'Escrow Released',
      date: 'Today, 04:15 AM',
      crop: 'Soybean (60 Qtl)'
    },
    {
      id: 'TXN-90217',
      ref: 'UPI/482019482910',
      type: 'Farmer ➔ Transporter Freight',
      from: 'Ramesh Patil (Farmer)',
      to: 'Jagjit Singh (Logistics)',
      amount: 3450,
      mode: 'PhonePe UPI',
      status: 'Paid & Confirmed',
      date: 'Today, 03:30 AM',
      crop: 'Tomato Crates (35 Qtl)'
    },
    {
      id: 'TXN-90216',
      ref: 'COD-189204',
      type: 'Cash on Delivery Handover',
      from: 'Vijay Mehra (Merchant)',
      to: 'Balwinder Singh (Driver)',
      amount: 6700,
      mode: 'Offline Mandi Cash',
      status: 'Voucher Active (OTP: 4821)',
      date: 'Yesterday, 07:45 PM',
      crop: 'Sharbati Wheat (45 Qtl)'
    },
    {
      id: 'TXN-90215',
      ref: 'UPI/109283746192',
      type: 'Farmer ➔ Agro Store Purchase',
      from: 'Ramesh Patil (Farmer)',
      to: 'Dr. Aniruddha Joshi (Maha Krishi)',
      amount: 1850,
      mode: 'Google Pay UPI',
      status: 'Completed',
      date: 'Yesterday, 02:10 PM',
      crop: 'Bio-Fungicide & Neem Oil'
    }
  ]);

  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const handleLaunchPayment = (
    title: string,
    amount: number,
    beneficiaryName: string,
    beneficiarySubtitle: string,
    paymentType: 'merchant_to_farmer' | 'farmer_to_transporter' | 'agri_input'
  ) => {
    setModalConfig({
      title,
      amount,
      beneficiaryName,
      beneficiarySubtitle,
      paymentType
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (details: any) => {
    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      ref: details.transactionRef,
      type: modalConfig.title,
      from: `${user?.name || 'You'} (${user?.role || 'User'})`,
      to: details.beneficiary,
      amount: details.amount,
      mode: details.method.toUpperCase(),
      status: details.method === 'cod' ? 'Voucher Generated' : 'Payment Successful',
      date: 'Just Now',
      crop: modalConfig.beneficiarySubtitle
    };

    setTransactions([newTxn, ...transactions]);
  };

  const copyRef = (refText: string) => {
    navigator.clipboard.writeText(refText);
    setCopiedRef(refText);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] shadow-xs">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#0d0d0d]">
              {t.payments.title}
            </h2>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                {t.payments.phonePeBadge}
              </span>
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">
              {t.payments.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              handleLaunchPayment(
                'Custom Smart Payment Demo',
                customAmount,
                customBeneficiary,
                customNotes,
                'merchant_to_farmer'
              )
            }
            className="px-5 py-2.5 rounded-2xl bg-[#557373] hover:bg-[#435c5c] text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            Launch PhonePe Payment Demo
          </button>
        </div>
      </div>

      {/* Escrow Balance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-3xl p-5 bg-white border border-[#557373]/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#64748b]">
            <span className="font-bold">{t.payments.escrowBalance}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#557373]">₹3,15,000</div>
          <p className="text-[10px] text-[#64748b]">{t.payments.escrowAssurance}</p>
        </div>

        <div className="glass-card rounded-3xl p-5 bg-white border border-[#557373]/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#64748b]">
            <span className="font-bold">{t.payments.totalSettled}</span>
            <TrendingUp className="w-4 h-4 text-[#557373]" />
          </div>
          <div className="text-2xl font-black text-[#0d0d0d]">₹4,25,000</div>
          <p className="text-[10px] text-emerald-700 font-bold">{t.payments.disputeProtection}</p>
        </div>

        <div className="glass-card rounded-3xl p-5 bg-white border border-[#557373]/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#64748b]">
            <span className="font-bold">{t.payments.payWithUPI}</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-black text-[#0d0d0d] pt-1">
            PhonePe • GPay • Paytm • Cash Handover
          </div>
          <p className="text-[10px] text-[#64748b]">Zero payment processing fees for Indian farmers</p>
        </div>
      </div>

      {/* Instant Demo Payment Triggers */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-[#0d0d0d] flex items-center gap-2">
          <span>🚀 Instant One-Click Payment Demonstrations</span>
          <span className="text-[10px] font-bold text-[#557373] bg-[#dfe5f3] px-2 py-0.5 rounded-full">
            Click any flow below to test
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Flow 1: Merchant -> Farmer */}
          <div className="glass-card rounded-3xl p-5 bg-white border border-[#557373]/20 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                पे
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-purple-700 block">Flow 1: Deal Sourcing</span>
                <h4 className="font-black text-sm text-[#0d0d0d]">Merchant ➔ Farmer Deal</h4>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Merchant pays for 60 Qtl Soybean produce directly to Farmer Ramesh Patil.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f2efea]/70 border border-[#557373]/15 text-xs flex justify-between">
                <span className="text-[#64748b]">Deal Value:</span>
                <span className="font-black text-[#557373]">₹3,15,000</span>
              </div>
            </div>

            <button
              onClick={() =>
                handleLaunchPayment(
                  'Merchant to Farmer Produce Deal',
                  315000,
                  'Ramesh Patil (Farmer)',
                  'Soybean Batch #1 (60 Quintals)',
                  'merchant_to_farmer'
                )
              }
              className="w-full py-2.5 rounded-xl bg-[#557373] hover:bg-[#435c5c] text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Pay Farmer via PhonePe / Cash
            </button>
          </div>

          {/* Flow 2: Farmer -> Transporter */}
          <div className="glass-card rounded-3xl p-5 bg-white border border-[#557373]/20 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-blue-700 block">Flow 2: Harvest Freight</span>
                <h4 className="font-black text-sm text-[#0d0d0d]">Farmer ➔ Transporter Freight</h4>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Farmer settles freight advance for Tata Ace Mini Truck to Driver Jagjit Singh.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f2efea]/70 border border-[#557373]/15 text-xs flex justify-between">
                <span className="text-[#64748b]">Freight Payout:</span>
                <span className="font-black text-[#557373]">₹3,450</span>
              </div>
            </div>

            <button
              onClick={() =>
                handleLaunchPayment(
                  'Farmer to Transporter Freight Payout',
                  3450,
                  'Jagjit Singh (Driver)',
                  'Tata Ace Mini Truck (MH-15-EG-4412)',
                  'farmer_to_transporter'
                )
              }
              className="w-full py-2.5 rounded-xl bg-[#dfe5f3] hover:bg-[#c9d4ea] text-[#557373] font-black text-xs border border-[#557373]/30 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-3.5 h-3.5" />
              Pay Transporter Advance
            </button>
          </div>

          {/* Flow 3: Farmer -> Agri Input Store */}
          <div className="glass-card rounded-3xl p-5 bg-white border border-[#557373]/20 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-amber-800 block">Flow 3: Farm Inputs</span>
                <h4 className="font-black text-sm text-[#0d0d0d]">Farmer ➔ Agri-Store Purchase</h4>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Farmer buys bio-fungicides and neem oil fertilizers from authorized seller.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f2efea]/70 border border-[#557373]/15 text-xs flex justify-between">
                <span className="text-[#64748b]">Order Total:</span>
                <span className="font-black text-[#557373]">₹1,850</span>
              </div>
            </div>

            <button
              onClick={() =>
                handleLaunchPayment(
                  'Agri-Input Store Purchase',
                  1850,
                  'Dr. Aniruddha Joshi (Maha Krishi Kendra)',
                  'Bio-Fungicide (2L) & Neem Oil Extract',
                  'agri_input'
                )
              }
              className="w-full py-2.5 rounded-xl bg-[#f2efea] hover:bg-[#dfe5f3] text-[#0d0d0d] font-black text-xs border border-[#557373]/20 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Store className="w-3.5 h-3.5" />
              Pay Agri-Store via UPI / Cash
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Settlement Ledger */}
      <div className="glass-card rounded-3xl p-6 bg-white border border-[#557373]/20 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#557373]/15 pb-3">
          <div>
            <h3 className="font-black text-base text-[#0d0d0d]">
              {t.payments.title}
            </h3>
            <p className="text-xs text-[#64748b]">
              {t.payments.subtitle}
            </p>
          </div>
          <span className="text-xs font-bold text-[#557373] bg-[#dfe5f3] px-3 py-1 rounded-full self-start sm:self-auto">
            {transactions.length} Transactions Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#557373]/15 text-[#64748b] text-[11px] font-bold">
                <th className="pb-3 pr-4">{t.payments.transactionId}</th>
                <th className="pb-3 px-4">{t.payments.dealName}</th>
                <th className="pb-3 px-4">{t.payments.party}</th>
                <th className="pb-3 px-4">{t.common.contact}</th>
                <th className="pb-3 px-4">{t.payments.amount}</th>
                <th className="pb-3 px-4">{t.payments.status}</th>
                <th className="pb-3 pl-4 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#557373]/10 font-medium">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#f2efea]/40 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-[#0d0d0d]">
                      <span>{tx.ref}</span>
                      <button
                        onClick={() => copyRef(tx.ref)}
                        className="p-1 hover:bg-[#dfe5f3] rounded text-[#557373]"
                      >
                        {copiedRef === tx.ref ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-[#64748b]">{tx.date}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-[#0d0d0d]">{tx.type}</div>
                    <div className="text-[10px] text-[#64748b]">{tx.crop}</div>
                  </td>

                  <td className="py-3.5 px-4 text-[#0d0d0d]">
                    <div className="font-bold">{tx.to}</div>
                    <div className="text-[10px] text-[#64748b]">From: {tx.from}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded-full bg-[#dfe5f3] text-[#557373]">
                      {tx.mode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-black text-sm text-[#557373]">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {tx.status}
                    </span>
                  </td>

                  <td className="py-3.5 pl-4 text-right">
                    <button
                      onClick={() =>
                        handleLaunchPayment(
                          tx.type,
                          tx.amount,
                          tx.to,
                          tx.crop,
                          'merchant_to_farmer'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-[#f2efea] hover:bg-[#dfe5f3] text-[#557373] font-black text-xs transition-all inline-flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      {t.common.viewDetails}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real Payment Modal */}
      {showPaymentModal && (
        <RealPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title={modalConfig.title}
          amount={modalConfig.amount}
          beneficiaryName={modalConfig.beneficiaryName}
          beneficiarySubtitle={modalConfig.beneficiarySubtitle}
          paymentType={modalConfig.paymentType}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
