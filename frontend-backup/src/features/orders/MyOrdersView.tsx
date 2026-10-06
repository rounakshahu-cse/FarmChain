import React, { useState, useEffect } from 'react';
import {
  PackageCheck,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  TrendingUp,
  Loader2,
  DollarSign,
  Smartphone,
  Banknote,
  Receipt,
  Sparkles
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ProfitBadge } from '../../components/common/ProfitBadge';
import { RealPaymentModal } from '../../components/payment/RealPaymentModal';
import { SmartTransportModal } from '../../components/transport/SmartTransportModal';

export const MyOrdersView: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Payment Modal State
  const [selectedPayOrder, setSelectedPayOrder] = useState<any>(null);
  const [showPayModal, setShowPayModal] = useState(false);

  // Transport Modal State
  const [selectedTransportOrder, setSelectedTransportOrder] = useState<any>(null);
  const [showTransportModal, setShowTransportModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await apiFetch<any[]>('/orders/');
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePayOrder = (order: any) => {
    setSelectedPayOrder(order);
    setShowPayModal(true);
  };

  const handleBookTransport = (order: any) => {
    setSelectedTransportOrder(order);
    setShowTransportModal(true);
  };

  const handlePaymentSuccess = async (paymentDetails: any) => {
    if (!selectedPayOrder) return;
    try {
      await apiFetch(`/orders/${selectedPayOrder.id}/pay`, {
        method: 'POST',
        body: JSON.stringify({
          payment_method: paymentDetails.method.toLowerCase(),
          upi_id: 'merchant@okhdfcbank',
          amount: paymentDetails.amount
        })
      });
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update order payment in backend:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center">
              <PackageCheck className="w-4 h-4 text-[#557373]" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0d0d0d]">
              {t.nav.myOrders}
            </h2>
          </div>
          <p className="text-xs text-[#64748b] mt-1">
            {t.orders.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#557373] bg-[#dfe5f3] px-3 py-1 rounded-full border border-[#557373]/20">
            {orders.length} {t.common.active}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-[#64748b] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#557373]" />
          <span className="text-xs">{t.common.loading}</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-[#64748b] border border-[#557373]/20 bg-white">
          <PackageCheck className="w-10 h-10 mx-auto text-[#557373]/50 mb-2" />
          <h4 className="font-bold text-[#0d0d0d]">{t.orders.title}</h4>
          <p className="text-xs mt-1">
            {t.orders.subtitle}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const isMerchant = user?.role === 'merchant';
            const isFarmer = user?.role === 'farmer';
            const isPendingPayment = o.payment_status === 'pending_escrow' || o.payment_status === 'unpaid';

            return (
              <div
                key={o.id}
                className="glass-card rounded-3xl p-6 border border-[#557373]/20 space-y-4 bg-white shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#557373]/15 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-[#0d0d0d]">
                        Order #{o.id} • {o.crop_name}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full capitalize ${
                          o.status === 'delivered'
                            ? 'bg-[#557373] text-white'
                            : 'bg-[#dfe5f3] text-[#272401]'
                        }`}
                      >
                        {o.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-[#64748b] mt-0.5">
                      {t.orders.farmer}: <strong className="text-[#0d0d0d]">{o.farmer_name}</strong> • {t.orders.merchant}: <strong className="text-[#0d0d0d]">{o.merchant_name}</strong>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4 justify-between sm:justify-end">
                    <div>
                      <div className="text-[11px] text-[#64748b]">{t.payments.dealName}</div>
                      <div className="text-xl font-black text-[#557373]">
                        ₹{o.total_amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/20">
                    <span className="text-[10px] text-[#64748b] block font-bold">
                      {t.orders.quantity}
                    </span>
                    <span className="font-extrabold text-[#0d0d0d]">
                      {o.quantity_quintals} Quintals
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/20">
                    <span className="text-[10px] text-[#64748b] block font-bold">
                      {t.orders.agreedRate}
                    </span>
                    <span className="font-extrabold text-[#0d0d0d]">
                      ₹{o.agreed_price_per_quintal}/Qtl
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#dfe5f3]/70 border border-[#557373]/30">
                    <span className="text-[10px] text-[#557373] block font-bold">
                      {t.orders.profit}
                    </span>
                    <span className="font-extrabold text-[#557373]">
                      +₹{Math.round(o.net_profit_amount).toLocaleString('en-IN')} ({o.profit_margin_pct.toFixed(1)}%)
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#f2efea]/70 border border-[#272401]/25">
                    <span className="text-[10px] text-[#272401] block font-bold">
                      {t.payments.escrowBalance}
                    </span>
                    <span className={`font-extrabold capitalize text-xs ${o.payment_status.includes('escrow') ? 'text-emerald-700 font-black' : 'text-[#272401]'}`}>
                      {o.payment_status === 'escrow_deposited' ? '🛡️ Escrow Locked in Bank' : o.payment_status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Interactive Action Bar */}
                <div className="pt-2 border-t border-[#557373]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#64748b]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Protected by Smart Krishi Multi-Party Escrow</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Merchant Pay Button */}
                    {isMerchant && isPendingPayment && (
                      <button
                        onClick={() => handlePayOrder(o)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#557373] hover:bg-[#435c5c] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Smartphone className="w-4 h-4 text-emerald-300" />
                        {t.payments.payWithUPI} (₹{o.total_amount.toLocaleString('en-IN')})
                      </button>
                    )}

                    {/* Merchant Paid Verification Badge */}
                    {isMerchant && !isPendingPayment && (
                      <button
                        onClick={() => handlePayOrder(o)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {t.common.viewDetails} • {t.orders.profit}
                      </button>
                    )}

                    {/* Farmer Dispatch & Book Transporter Button */}
                    {isFarmer && (
                      <button
                        onClick={() => handleBookTransport(o)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#dfe5f3] hover:bg-[#c9d4ea] text-[#557373] font-black text-xs border border-[#557373]/30 shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        {t.orders.connectTransporter}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Real Payment Modal for Merchant */}
      {selectedPayOrder && showPayModal && (
        <RealPaymentModal
          isOpen={showPayModal}
          onClose={() => setShowPayModal(false)}
          title={`Pay Farmer for Order #${selectedPayOrder.id}`}
          amount={selectedPayOrder.total_amount}
          beneficiaryName={selectedPayOrder.farmer_name}
          beneficiarySubtitle={`${selectedPayOrder.crop_name} (${selectedPayOrder.quantity_quintals} Quintals)`}
          paymentType="merchant_to_farmer"
          orderId={selectedPayOrder.id}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Smart Transport Modal for Farmer */}
      {selectedTransportOrder && showTransportModal && (
        <SmartTransportModal
          isOpen={showTransportModal}
          onClose={() => setShowTransportModal(false)}
          orderId={selectedTransportOrder.id}
          cropName={selectedTransportOrder.crop_name}
          loadQuintals={selectedTransportOrder.quantity_quintals}
          pickupLocation="Farmer Warehouse / Mandi Bay"
          dropLocation="Merchant Mandi Yard"
          distanceKm={45}
          onSuccess={() => {
            setShowTransportModal(false);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
};

