import React, { useState } from 'react';
import { X, Lock, ShieldCheck, CreditCard, CheckCircle2, ArrowRight, Mail, Sparkles } from 'lucide-react';
import { MemberProfile } from '../types';
import { api } from '../api/client';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planTier: MemberProfile['tier'];
  billingCycle: 'Monthly' | 'Annual';
  price: number;
  member: MemberProfile;
  onPaymentSuccess: (newTier: MemberProfile['tier']) => void;
  onOpenNotifications: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  planTier,
  billingCycle,
  price,
  member,
  onPaymentSuccess,
  onOpenNotifications,
}) => {
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [cardName, setCardName] = useState(member.name || 'Alex Hunter');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    txnId: string;
    amount: number;
    plan: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardExp(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await api.processPayment({
        cardNumber,
        cardExp,
        cardCvv,
        planTier,
        billingCycle,
        amount: price,
        memberName: cardName,
        email: member.email,
      });

      if (res.success) {
        setSuccessReceipt({
          txnId: res.transactionId,
          amount: res.amount,
          plan: planTier,
        });
        onPaymentSuccess(planTier);
      }
    } catch (err) {
      console.error('Payment processing failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const fillTestCard = () => {
    setCardNumber('4000 1234 5678 9010');
    setCardExp('08/29');
    setCardCvv('739');
    setCardName(member.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#10131d] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            setSuccessReceipt(null);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {successReceipt ? (
          /* SUCCESS CONFIRMATION STATE */
          <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-[#c2f83d]/15 text-[#c2f83d] rounded-full flex items-center justify-center mx-auto border border-[#c2f83d]/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#c2f83d]">
                Transaction Confirmed · 256-Bit Captured
              </span>
              <h3 className="text-2xl font-bold text-white font-display mt-1">
                Payment Successful
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your subscription to <strong className="text-white">{successReceipt.plan}</strong> has been activated.
              </p>
            </div>

            <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between items-center text-slate-400">
                <span>Receipt Number:</span>
                <span className="font-mono text-white font-bold">{successReceipt.txnId}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Amount Paid:</span>
                <span className="font-mono text-[#c2f83d] font-bold text-sm">${successReceipt.amount}.00 USD</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Billing Frequency:</span>
                <span className="text-white">{billingCycle}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Automated Email:</span>
                <span className="text-slate-300 font-mono text-[11px] truncate max-w-[200px]">{member.email}</span>
              </div>
            </div>

            <div className="p-3 bg-[#c2f83d]/[0.06] border border-[#c2f83d]/20 rounded-lg text-xs text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#c2f83d] shrink-0" />
              <span>An automated invoice receipt has been dispatched to your email notification inbox.</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  setSuccessReceipt(null);
                  onClose();
                  onOpenNotifications();
                }}
                className="flex-1 py-3 px-4 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>View Dispatched Email</span>
              </button>
              <button
                onClick={() => {
                  setSuccessReceipt(null);
                  onClose();
                }}
                className="py-3 px-5 bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM STATE */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#c2f83d] uppercase tracking-wider mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>PCI-DSS Tokenized Gateway</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                Secure Membership Checkout
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Upgrade or renew your Mr Fit Gym access with encrypted processing.
              </p>
            </div>

            {/* Selected Plan Summary Box */}
            <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Selected Plan</span>
                <div className="text-base font-bold text-white font-display">{planTier}</div>
                <div className="text-xs text-slate-400 font-mono">{billingCycle} renewal</div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-[#c2f83d] font-mono tabular-nums">
                  ${price}
                </span>
                <span className="text-xs text-slate-400 font-mono">/mo</span>
              </div>
            </div>

            {/* Card Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cardholder Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c2f83d] transition-colors font-sans"
                  placeholder="e.g. Alex Hunter"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Card Number
                  </label>
                  <button
                    type="button"
                    onClick={fillTestCard}
                    className="text-[10px] text-[#c2f83d] hover:underline cursor-pointer font-mono"
                  >
                    Auto-fill Test Card
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c2f83d] transition-colors font-mono tracking-wider"
                    placeholder="4242 •••• •••• 4242"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Expiration (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={cardExp}
                    onChange={handleExpChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c2f83d] transition-colors font-mono"
                    placeholder="12/28"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Security CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c2f83d] transition-colors font-mono"
                    placeholder="892"
                  />
                </div>
              </div>
            </div>

            {/* Security Guarantee Notice */}
            <div className="flex items-center gap-2.5 text-[11px] text-slate-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]">
              <ShieldCheck className="w-4 h-4 text-[#c2f83d] shrink-0" />
              <span>Payments are encrypted with AES-256 bit banking security. Zero card details stored in plain text.</span>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c2f83d]/20 disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Processing Encrypted Transaction...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize & Pay ${price}.00</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
