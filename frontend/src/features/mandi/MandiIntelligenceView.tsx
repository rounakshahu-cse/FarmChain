import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  MapPin,
  Truck,
  DollarSign,
  Scale,
  Loader2,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

export const MandiIntelligenceView: React.FC = () => {
  const { t } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState('Soybean');
  const [quantity, setQuantity] = useState<number>(50);
  const [farmerLocation, setFarmerLocation] = useState('Nashik, Maharashtra');
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMandiData = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch<any>(
        `/mandi/prices?crop=${encodeURIComponent(selectedCrop)}&farmer_location=${encodeURIComponent(
          farmerLocation
        )}&quantity_quintals=${quantity}`
      );
      setData(res);
    } catch (err) {
      console.error('Failed to load mandi intelligence:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMandiData();
  }, [selectedCrop, quantity]);

  const bestMandi = data?.best_mandi;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">{t.mandi.title}</h2>
            <p className="text-xs opacity-75 mt-0.5 max-w-2xl">
              {t.mandi.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar with Interactive Sliders */}
      <div className="glass-card rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="text-xs font-bold block mb-2">
            {t.mandi.selectCrop}
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl glass-card text-xs font-bold focus:outline-none focus:border-emerald-500"
          >
            <option value="Soybean">Soybean (सोयाबीन)</option>
            <option value="Wheat">Sharbati Wheat (गहू / गेहूं)</option>
            <option value="Cotton">BT Cotton (कापूस / कपास)</option>
            <option value="Tomato">Hybrid Tomato (टोमॅटो)</option>
            <option value="Red Onion">Red Onion (कांदा / प्याज)</option>
            <option value="Basmati Rice">Basmati Rice (तांदूळ)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold block mb-2 flex items-center justify-between">
            <span>Harvest Batch Quantity</span>
            <span className="text-emerald-400 font-black">{quantity} Qtl</span>
          </label>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2 bg-white/10"
          />
        </div>

        <div>
          <label className="text-xs font-bold block mb-2">
            Farmer Origin Location
          </label>
          <input
            type="text"
            value={farmerLocation}
            onChange={(e) => setFarmerLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl glass-card text-xs font-semibold focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center opacity-60 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <span className="text-xs font-semibold">
            Calculating transport freight vs APMC modal prices...
          </span>
        </div>
      ) : (
        <>
          {/* AI Recommended Best Mandi Highlight Banner */}
          {bestMandi && (
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 glass-card border border-emerald-500/40 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-400 p-0.5 shadow-lg">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 block">
                      {t.mandi.aiBestChoice}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">
                      {bestMandi.mandi_name} ({bestMandi.district}, {bestMandi.state})
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] opacity-70 block font-semibold">
                      Gross APMC Modal Rate
                    </span>
                    <span className="text-sm font-bold opacity-60 line-through">
                      ₹{bestMandi.modal_price}/Qtl
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/50 shadow-lg">
                    <span className="text-[10px] uppercase font-black text-emerald-400 block">
                      Net Realized In Hand
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-300">
                      ₹{bestMandi.net_realized_price}/Qtl
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs opacity-85 leading-relaxed pt-3 border-t border-white/10">
                💡 <strong>Why this is optimal:</strong> Even after deducting ₹
                {bestMandi.estimated_transport_cost}/Qtl in freight costs ({bestMandi.distance_km} km), selling your {quantity} Qtl here realizes{' '}
                <strong className="text-emerald-400 font-black">
                  ₹{(bestMandi.net_realized_price * quantity).toLocaleString('en-IN')} total net revenue
                </strong>.
              </p>
            </div>
          )}

          {/* Comparative Table & Cards */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="font-black text-base">
              Regional Mandi Price & Freight Comparison Table
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/10 opacity-70 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Mandi / Market</th>
                    <th className="py-3 px-3">State / District</th>
                    <th className="py-3 px-3 text-right">Gross Price (₹/Qtl)</th>
                    <th className="py-3 px-3 text-right">Distance (km)</th>
                    <th className="py-3 px-3 text-right">Freight Deduct / Qtl</th>
                    <th className="py-3 px-3 text-right">Net Realized Price</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {data?.all_mandis?.map((m: any) => (
                    <tr
                      key={m.id}
                      className={`transition-all ${
                        m.is_best_mandi
                          ? 'bg-emerald-500/15 font-bold text-emerald-200'
                          : 'hover:bg-white/5 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <td className="py-3.5 px-3 font-bold flex items-center gap-2">
                        {m.is_best_mandi && (
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span>{m.mandi_name}</span>
                      </td>
                      <td className="py-3.5 px-3 opacity-75">
                        {m.district}, {m.state}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black">
                        ₹{m.modal_price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right opacity-75">
                        {m.distance_km} km
                      </td>
                      <td className="py-3.5 px-3 text-right text-rose-400 font-bold">
                        -₹{m.estimated_transport_cost}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-sm text-emerald-400">
                        ₹{m.net_realized_price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {m.is_best_mandi ? (
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            ★ Top Profit
                          </span>
                        ) : (
                          <span className="text-[10px] opacity-60">
                            Standard
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
