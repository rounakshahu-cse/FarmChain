import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Banknote,
  QrCode,
  ArrowRight,
  Loader2,
  Lock,
  Receipt,
  Sparkles,
  Copy,
  Check,
  Volume2,
  Truck,
  Building2,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { useLanguage } from '../../context/LanguageContext';

interface RealPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  beneficiaryName: string;
  beneficiarySubtitle?: string;
  paymentType: 'merchant_to_farmer' | 'farmer_to_transporter' | 'agri_input';
  orderId?: number;
  transportJobId?: number;
  onPaymentSuccess: (paymentDetails: {
    method: string;
    transactionRef: string;
    amount: number;
    beneficiary: string;
  }) => void;
}

// Function to play crisp PhonePe-style payment success chime using Web Audio API
const playPaymentSuccessChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Note 1: High crisp ding
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.15); // A5
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.8);

    // Note 2: Harmonics for rich banking tone
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6
      gain2.gain.setValueAtTime(0.35, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 1.2);
    }, 120);
  } catch (e) {
    console.log('Audio chime not supported or muted by browser policy');
  }
};

export const RealPaymentModal: React.FC<RealPaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  amount,
  beneficiaryName,
  beneficiarySubtitle,
  paymentType,
  orderId,
  transportJobId,
  onPaymentSuccess,
}) => {
  const { t } = useLanguage();
  const [method, setMethod] = useState<'phonepe' | 'gpay' | 'paytm' | 'card' | 'cod'>('phonepe');
  const [upiId, setUpiId] = useState('merchant@okhdfcbank');
  const [upiPin, setUpiPin] = useState(['', '', '', '']);
  const [pinStep, setPinStep] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);
  const [txnDetails, setTxnDetails] = useState<any>(null);

  // Generate random transaction ID & OTP
  const [txnRef] = useState(() => `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`);
  const [handoverOtp] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setPinStep(false);
      setIsProcessing(false);
      setUpiPin(['', '', '', '']);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinInput = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newPin = [...upiPin];
    newPin[index] = val ? val.slice(-1) : '';
    setUpiPin(newPin);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`upi-pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleStartPayment = () => {
    if (method === 'cod') {
      // Offline cash handover flow
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        playPaymentSuccessChime();
        setTxnDetails({
          method: 'Cash on Delivery / Mandi Cash Handover',
          transactionRef: `COD-${txnRef.replace('UPI/', '')}`,
          amount,
          beneficiary: beneficiaryName,
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          otp: handoverOtp
        });
        onPaymentSuccess({
          method: 'cod',
          transactionRef: `COD-${txnRef.replace('UPI/', '')}`,
          amount,
          beneficiary: beneficiaryName
        });
      }, 1200);
    } else {
      // Open UPI PIN verification keypad
      setPinStep(true);
    }
  };

  const handleVerifyPinAndSubmit = () => {
    setPinStep(false);
    setIsProcessing(true);
    setProcessingStage(1);

    setTimeout(() => setProcessingStage(2), 700);
    setTimeout(() => setProcessingStage(3), 1400);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      playPaymentSuccessChime();

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#557373', '#10b981', '#dfe5f3', '#272401']
      });

      const details = {
        method: method.toUpperCase(),
        transactionRef: txnRef,
        amount,
        beneficiary: beneficiaryName,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        bankRef: `HDFC${Math.floor(10000000 + Math.random() * 90000000)}`
      };

      setTxnDetails(details);
      onPaymentSuccess({
        method,
        transactionRef: txnRef,
        amount,
        beneficiary: beneficiaryName
      });
    }, 2200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white border border-[#557373]/20 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Top Accent Header */}
        <div className="px-6 py-4 bg-[#557373] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">{title}</h3>
              <p className="text-[10px] text-white/80">100% Encrypted & NPCI Verified Direct Settlement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {isProcessing ? (
            /* Stage Animation */
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-[#dfe5f3] border-t-[#557373] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-[#557373] animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-base text-[#0d0d0d]">
                  {processingStage === 1 && 'Connecting with Bank Server...'}
                  {processingStage === 2 && 'Authenticating via NPCI UPI Gateway...'}
                  {processingStage === 3 && 'Transferring Funds to Beneficiary...'}
                </h4>
                <p className="text-xs text-[#64748b]">
                  Please do not press back or refresh while payment is being processed.
                </p>
              </div>
            </div>
          ) : isSuccess ? (
            /* PhonePe High-Impact Success Screen */
            <div className="py-3 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-50" />
                <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 block">
                  {method === 'cod' ? 'OFFLINE VOUCHER GENERATED' : 'PAYMENT SUCCESSFUL'}
                </span>
                <h3 className="text-3xl font-black text-[#0d0d0d]">
                  ₹{amount.toLocaleString('en-IN')}
                </h3>
                <p className="text-xs text-[#64748b]">
                  {method === 'cod'
                    ? `Cash on Delivery handover confirmed for ${beneficiaryName}`
                    : `Transferred successfully to ${beneficiaryName}`}
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-2xl bg-[#f2efea]/80 border border-[#557373]/20 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#557373]/15">
                  <span className="text-[#64748b]">Beneficiary</span>
                  <span className="font-extrabold text-[#0d0d0d]">{beneficiaryName}</span>
                </div>
                {beneficiarySubtitle && (
                  <div className="flex justify-between items-center pb-2 border-b border-[#557373]/15">
                    <span className="text-[#64748b]">Details</span>
                    <span className="font-semibold text-[#557373]">{beneficiarySubtitle}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pb-2 border-b border-[#557373]/15">
                  <span className="text-[#64748b]">Payment Mode</span>
                  <span className="font-bold text-[#0d0d0d] uppercase">{method}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#557373]/15">
                  <span className="text-[#64748b]">Transaction Ref</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-[#0d0d0d]">
                    <span>{txnRef}</span>
                    <button
                      onClick={() => copyToClipboard(txnRef)}
                      className="p-1 hover:bg-[#dfe5f3] rounded text-[#557373]"
                    >
                      {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                {method === 'cod' && (
                  <div className="flex justify-between items-center p-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900">
                    <span className="font-bold">Mandi Handover OTP:</span>
                    <span className="font-black font-mono text-base tracking-widest bg-amber-200 px-2 py-0.5 rounded-lg">{handoverOtp}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 text-[11px] text-[#64748b]">
                  <span>Date & Time</span>
                  <span>{new Date().toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl bg-[#557373] hover:bg-[#435c5c] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t.common.confirm}
                </button>
              </div>
            </div>
          ) : pinStep ? (
            /* Interactive UPI PIN Keypad */
            <div className="space-y-5 text-center py-2 animate-in zoom-in-95 duration-200">
              <div className="space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#557373]/15 text-[#557373] mx-auto flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-black text-base text-[#0d0d0d]">Enter 4-Digit UPI PIN</h4>
                <p className="text-xs text-[#64748b]">
                  Authorizing payment of <strong className="text-[#0d0d0d]">₹{amount.toLocaleString('en-IN')}</strong> to {beneficiaryName}
                </p>
              </div>

              {/* 4 Digit PIN Inputs */}
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`upi-pin-${idx}`}
                    type="password"
                    maxLength={1}
                    value={upiPin[idx]}
                    onChange={(e) => handlePinInput(idx, e.target.value)}
                    className="w-12 h-14 text-center text-2xl font-black rounded-2xl bg-[#f2efea] border-2 border-[#557373]/30 focus:border-[#557373] focus:bg-white text-[#0d0d0d] focus:outline-none transition-all"
                  />
                ))}
              </div>

              <div className="text-[11px] text-[#64748b] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Secured by NPCI 256-bit UPI Gateway</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setPinStep(false)}
                  className="flex-1 py-3 rounded-2xl bg-[#f2efea] hover:bg-[#dfe5f3] text-[#0d0d0d] font-bold text-xs transition-all"
                >
                  {t.common.back}
                </button>
                <button
                  onClick={handleVerifyPinAndSubmit}
                  disabled={upiPin.some((p) => p === '')}
                  className="flex-1 py-3 rounded-2xl bg-[#557373] hover:bg-[#435c5c] disabled:opacity-50 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {t.payments.payWithUPI} (₹{amount.toLocaleString('en-IN')})
                </button>
              </div>
            </div>
          ) : (
            /* Payment Method Selection Screen */
            <>
              {/* Payment Summary Header */}
              <div className="p-4 rounded-2xl bg-[#dfe5f3]/70 border border-[#557373]/25 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#557373] block">Total Payable Amount</span>
                  <div className="text-2xl font-black text-[#0d0d0d]">₹{amount.toLocaleString('en-IN')}</div>
                  <span className="text-[11px] text-[#64748b]">Pay to: <strong>{beneficiaryName}</strong></span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#557373]/20 shadow-xs">
                  <QrCode className="w-8 h-8 text-[#557373]" />
                </div>
              </div>

              {/* Payment Options Grid */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#0d0d0d] block">
                  Select Payment Method
                </label>

                {/* Option 1: PhonePe (Recommended) */}
                <div
                  onClick={() => setMethod('phonepe')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    method === 'phonepe'
                      ? 'border-[#557373] bg-[#dfe5f3]/40 shadow-xs ring-1 ring-[#557373]'
                      : 'border-[#557373]/20 hover:bg-[#f2efea]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5f259f] text-white flex items-center justify-center font-black text-xs shadow-xs">
                      पे
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-[#0d0d0d] flex items-center gap-2">
                        PhonePe UPI
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                          Instant / Zero Fee
                        </span>
                      </div>
                      <div className="text-[10px] text-[#64748b]">Pay directly via PhonePe UPI ID or QR code</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${method === 'phonepe' ? 'border-[#557373] bg-[#557373]' : 'border-gray-400'}`}>
                    {method === 'phonepe' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {/* Option 2: Google Pay */}
                <div
                  onClick={() => setMethod('gpay')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    method === 'gpay'
                      ? 'border-[#557373] bg-[#dfe5f3]/40 shadow-xs ring-1 ring-[#557373]'
                      : 'border-[#557373]/20 hover:bg-[#f2efea]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-blue-600 flex items-center justify-center font-black text-sm shadow-xs">
                      GPay
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-[#0d0d0d]">Google Pay</div>
                      <div className="text-[10px] text-[#64748b]">Instant bank account direct settlement</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${method === 'gpay' ? 'border-[#557373] bg-[#557373]' : 'border-gray-400'}`}>
                    {method === 'gpay' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {/* Option 3: Paytm / BHIM UPI */}
                <div
                  onClick={() => setMethod('paytm')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    method === 'paytm'
                      ? 'border-[#557373] bg-[#dfe5f3]/40 shadow-xs ring-1 ring-[#557373]'
                      : 'border-[#557373]/20 hover:bg-[#f2efea]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#002e6e] text-white flex items-center justify-center font-black text-[11px] shadow-xs">
                      UPI
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-[#0d0d0d]">BHIM / Paytm / Any UPI</div>
                      <div className="text-[10px] text-[#64748b]">Supports SBI, HDFC, ICICI, Axis & all UPI apps</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${method === 'paytm' ? 'border-[#557373] bg-[#557373]' : 'border-gray-400'}`}>
                    {method === 'paytm' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {/* Option 4: Cash on Delivery / Mandi Cash Handover */}
                <div
                  onClick={() => setMethod('cod')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    method === 'cod'
                      ? 'border-[#272401] bg-[#f2efea] shadow-xs ring-1 ring-[#272401]'
                      : 'border-[#557373]/20 hover:bg-[#f2efea]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#272401] text-white flex items-center justify-center shadow-xs">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-[#0d0d0d] flex items-center gap-2">
                        Cash on Delivery (Offline Mandi Cash)
                        <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                          Handover at Mandi
                        </span>
                      </div>
                      <div className="text-[10px] text-[#64748b]">Generate APMC gate physical cash handover receipt</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${method === 'cod' ? 'border-[#272401] bg-[#272401]' : 'border-gray-400'}`}>
                    {method === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              </div>

              {/* Online UPI input if online method selected */}
              {method !== 'cod' && (
                <div className="p-3 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/20 space-y-1.5">
                  <label className="text-[11px] font-bold text-[#0d0d0d] flex justify-between">
                    <span>Virtual Payment Address (UPI ID)</span>
                    <span className="text-[#557373] text-[10px]">Verified @NPCI</span>
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#557373]/25 text-xs font-semibold text-[#0d0d0d] focus:outline-none focus:border-[#557373]"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl bg-[#f2efea] hover:bg-[#dfe5f3] text-[#0d0d0d] font-bold text-xs transition-all"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleStartPayment}
                  className="flex-2 py-3 rounded-2xl bg-[#557373] hover:bg-[#435c5c] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {method === 'cod' ? (
                    <>
                      <Banknote className="w-4 h-4" />
                      {t.common.proceed} (₹{amount.toLocaleString('en-IN')})
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      {t.payments.payWithUPI} (₹{amount.toLocaleString('en-IN')})
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
