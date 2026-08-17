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
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ProfitBadge } from '../../components/common/ProfitBadge';

export const MyOrdersView: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {t.nav.myOrders}
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Track locked produce deals, escrow payments, and delivery completion
        </p>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <span className="text-xs">Loading order ledger...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-slate-400 border border-slate-800">
          <PackageCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <h4 className="font-bold text-slate-300">No finalized orders yet</h4>
          <p className="text-xs mt-1">
            Accept a leading bid in the Live Bidding Room to lock a deal and generate an order.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-white">
                      Order #{o.id} • {o.crop_name}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full capitalize ${
                        o.status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {o.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Farmer: {o.farmer_name} • Merchant: {o.merchant_name}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Value</div>
                  <div className="text-xl font-black text-emerald-400">
                    ₹{o.total_amount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">
                    Quantity
                  </span>
                  <span className="font-extrabold text-slate-200">
                    {o.quantity_quintals} Quintals
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">
                    Agreed Rate
                  </span>
                  <span className="font-extrabold text-slate-200">
                    ₹{o.agreed_price_per_quintal}/Qtl
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-emerald-400 block font-bold">
                    Net Realized Profit
                  </span>
                  <span className="font-extrabold text-emerald-300">
                    +₹{Math.round(o.net_profit_amount).toLocaleString('en-IN')} ({o.profit_margin_pct.toFixed(1)}%)
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">
                    Escrow Settlement
                  </span>
                  <span className="font-extrabold text-amber-300 capitalize">
                    {o.payment_status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
