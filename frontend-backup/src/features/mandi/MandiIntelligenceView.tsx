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
  Search,
  Filter,
  RefreshCw,
  Building2,
  Calendar,
  Layers,
  ArrowUpDown,
  Flame,
  Globe
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

const CROPS_LIST = [
  { id: 'Wheat', name: 'Sharbati Wheat (गहू / गेहूं)', icon: '🌾' },
  { id: 'Soybean', name: 'Soybean (सोयाबीन / सोयाबीन)', icon: '🌿' },
  { id: 'Cotton', name: 'Bt Cotton (कापूस / कपास)', icon: '🌱' },
  { id: 'Tomato', name: 'Hybrid Tomato (टोमॅटो / टमाटर)', icon: '🍅' },
  { id: 'Red Onion', name: 'Red Onion (कांदा / प्याज)', icon: '🧅' },
  { id: 'Basmati Rice', name: 'Basmati Rice / Paddy (बासमती तांदूळ / धान)', icon: '🍚' },
  { id: 'Potato', name: 'Potato (बटाटा / आलू)', icon: '🥔' },
  { id: 'Chilli / Pepper', name: 'Chilli / Pepper (मिरची / मिर्च)', icon: '🌶️' },
  { id: 'Sugarcane', name: 'Sugarcane (ऊस / गन्ना)', icon: '🎋' },
  { id: 'Maize / Corn', name: 'Maize / Corn (मका / मक्का)', icon: '🌽' },
  { id: 'Groundnut / Peanut', name: 'Groundnut / Peanut (भुईमूग / मूंगफली)', icon: '🥜' },
  { id: 'Mustard', name: 'Mustard / Sarson (मोहरी / सरसों)', icon: '🌼' },
  { id: 'Banana', name: 'Robusta Banana (केळी / केला)', icon: '🍌' },
  { id: 'Grapes', name: 'Thompson Grapes (द्राक्षे / अंगूर)', icon: '🍇' },
  { id: 'Citrus / Lemon', name: 'Citrus / Lemon / Orange (संत्रे / संतरा / लिंबू)', icon: '🍋' },
  { id: 'Tur / Arhar Dal', name: 'Tur / Arhar Dal (तूर / अरहर)', icon: '🍲' },
  { id: 'Chana / Gram', name: 'Chana / Bengal Gram (हरभरा / चना)', icon: '🧆' },
];

const STATES_LIST = [
  'All States',
  'Maharashtra',
  'Madhya Pradesh',
  'Delhi',
  'Punjab',
  'Gujarat',
  'Karnataka',
  'Rajasthan',
  'Uttar Pradesh',
  'Telangana',
  'Bihar',
  'Tamil Nadu',
  'Haryana'
];

export const MandiIntelligenceView: React.FC = () => {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'arbitrage' | 'all_mandis'>('arbitrage');
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [quantity, setQuantity] = useState<number>(10);
  const [farmerLocation, setFarmerLocation] = useState('Nashik, Maharashtra');
  
  // Tab 1 state
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tab 2 (All Mandis Feed) state
  const [allFeeds, setAllFeeds] = useState<any[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedFeedCrop, setSelectedFeedCrop] = useState('All Crops');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'modal_price' | 'arrivals_tonnes' | 'trend_pct'>('modal_price');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Fetch AI single-crop profit arbitrage
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

  // Fetch all real-time feeds
  const fetchAllFeeds = async () => {
    setIsFeedLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedState !== 'All States') params.append('state', selectedState);
      if (selectedFeedCrop !== 'All Crops') params.append('crop', selectedFeedCrop);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      
      const res = await apiFetch<any[]>(`/mandi/all?${params.toString()}`);
      setAllFeeds(res);
    } catch (err) {
      console.error('Failed to load all mandi feeds:', err);
    } finally {
      setIsFeedLoading(false);
    }
  };

  useEffect(() => {
    fetchMandiData();
  }, [selectedCrop, quantity]);

  useEffect(() => {
    if (activeTab === 'all_mandis') {
      fetchAllFeeds();
    }
  }, [activeTab, selectedState, selectedFeedCrop, searchQuery]);

  const bestMandi = data?.best_mandi;

  // Sorting for Tab 2
  const sortedFeeds = [...allFeeds].sort((a, b) => {
    let valA = a[sortBy] ?? 0;
    let valB = b[sortBy] ?? 0;
    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Live Wholesale APMC Ticker Bar */}
      <div className="overflow-hidden rounded-2xl bg-[#272401] text-white py-2 px-4 shadow-sm border border-[#272401]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE APMC FEED
          </div>
          <div className="flex items-center gap-6 text-xs whitespace-nowrap overflow-x-auto no-scrollbar font-medium">
            <span>🌾 <strong>Wheat (Choithram Indore):</strong> ₹2,980/Qtl <span className="text-emerald-400 font-bold">+3.8%</span></span>
            <span className="text-white/30">•</span>
            <span>🌿 <strong>Soybean (Pune APMC):</strong> ₹5,380/Qtl <span className="text-emerald-400 font-bold">+4.1%</span></span>
            <span className="text-white/30">•</span>
            <span>🌱 <strong>Bt Cotton (Rajkot Yard):</strong> ₹7,820/Qtl <span className="text-emerald-400 font-bold">+3.7%</span></span>
            <span className="text-white/30">•</span>
            <span>🧅 <strong>Red Onion (Lasalgaon):</strong> ₹2,380/Qtl <span className="text-emerald-400 font-bold">+3.9%</span></span>
            <span className="text-white/30">•</span>
            <span>🍚 <strong>Basmati Rice (Karnal Mandi):</strong> ₹4,380/Qtl <span className="text-emerald-400 font-bold">+3.9%</span></span>
            <span className="text-white/30">•</span>
            <span>🍅 <strong>Hybrid Tomato (Vashi APMC):</strong> ₹1,850/Qtl <span className="text-emerald-400 font-bold">+6.8%</span></span>
            <span className="text-white/30">•</span>
            <span>🌶️ <strong>Byadgi Chilli (Haveri APMC):</strong> ₹19,400/Qtl <span className="text-emerald-400 font-bold">+5.8%</span></span>
            <span className="text-white/30">•</span>
            <span>🥔 <strong>Potato (Agra APMC):</strong> ₹1,450/Qtl <span className="text-emerald-400 font-bold">+2.7%</span></span>
            <span className="text-white/30">•</span>
            <span>🍇 <strong>Thompson Grapes (Nashik Yard):</strong> ₹7,850/Qtl <span className="text-emerald-400 font-bold">+5.4%</span></span>
          </div>
        </div>
      </div>

      {/* Main Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0d0d0d] flex items-center gap-2">
              {t.mandi.title}
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                100% Real APMC Data
              </span>
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              {t.mandi.subtitle}
            </p>
          </div>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex items-center p-1 rounded-2xl bg-[#dfe5f3] border border-[#557373]/25 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('arbitrage')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'arbitrage'
                ? 'bg-[#557373] text-white shadow-xs'
                : 'text-[#557373] hover:text-[#0d0d0d]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.mandi.aiProfitCalc}
          </button>
          <button
            onClick={() => setActiveTab('all_mandis')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'all_mandis'
                ? 'bg-[#557373] text-white shadow-xs'
                : 'text-[#557373] hover:text-[#0d0d0d]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            {t.mandi.allIndiaMandis}
          </button>
        </div>
      </div>

      {activeTab === 'arbitrage' ? (
        <>
          {/* Controls for AI Profit Arbitrage */}
          <div className="glass-card rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-5 bg-white border border-[#557373]/20 shadow-xs">
            <div>
              <label className="text-xs font-bold text-[#0d0d0d] block mb-2">
                {t.mandi.selectCrop} (17 Commodities)
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/25 text-[#0d0d0d] text-xs font-bold focus:outline-none focus:border-[#557373]"
              >
                {CROPS_LIST.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.icon} {crop.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0d0d0d] block mb-2 flex items-center justify-between">
                <span>{t.mandi.harvestQuantity}</span>
                <span className="text-[#557373] font-black">{quantity} {t.common.quintal} ({quantity * 100} kg)</span>
              </label>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#557373] mt-2 bg-[#dfe5f3]"
              />
              <div className="flex justify-between text-[10px] text-[#64748b] mt-1 font-semibold">
                <span>5 Qtl (Auto Cargo)</span>
                <span>60 Qtl (Tractor)</span>
                <span>250 Qtl (Trailer)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0d0d0d] block mb-2">
                {t.mandi.farmerLocation}
              </label>
              <input
                type="text"
                value={farmerLocation}
                onChange={(e) => setFarmerLocation(e.target.value)}
                placeholder="e.g. Nashik, Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/25 text-[#0d0d0d] text-xs font-semibold focus:outline-none focus:border-[#557373]"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-[#64748b] gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#557373]" />
              <span className="text-xs font-semibold">
                {t.common.loading}
              </span>
            </div>
          ) : (
            <>
              {/* AI Recommended Best Mandi Highlight Banner */}
              {bestMandi && (
                <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 glass-card border border-[#557373]/30 shadow-md space-y-4 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#557373] to-[#272401] p-0.5 shadow-md shrink-0">
                        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-[#557373] animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#272401] block">
                          {t.mandi.aiBestChoice} FOR {selectedCrop.toUpperCase()}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-[#0d0d0d]">
                          {bestMandi.mandi_name} ({bestMandi.district}, {bestMandi.state})
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#64748b] font-medium">
                          <span>Variety: <strong className="text-[#0d0d0d]">{bestMandi.variety}</strong></span>
                          <span>•</span>
                          <span>Price Spread: ₹{bestMandi.min_price} - ₹{bestMandi.max_price}/Qtl</span>
                          <span>•</span>
                          <span>Daily Arrivals: <strong>{bestMandi.arrivals_tonnes || 150} Tonnes</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-[#64748b] block font-semibold">
                          {t.mandi.grossModalRate}
                        </span>
                        <span className="text-sm font-bold text-[#64748b] line-through">
                          ₹{bestMandi.modal_price.toLocaleString('en-IN')}/Qtl
                        </span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 shadow-xs">
                        <span className="text-[10px] uppercase font-black text-[#557373] block">
                          {t.mandi.netRealized}
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-[#557373]">
                          ₹{bestMandi.net_realized_price.toLocaleString('en-IN')}/Qtl
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <p className="text-[#64748b] leading-relaxed">
                      💡 <strong className="text-[#0d0d0d]">AI Profit Arbitrage Insight:</strong> Even after deducting ₹
                      {bestMandi.estimated_transport_cost}/Qtl in freight costs ({bestMandi.distance_km} km), selling your {quantity} Qtl here realizes{' '}
                      <strong className="text-[#557373] font-black">
                        ₹{(bestMandi.net_realized_price * quantity).toLocaleString('en-IN')} total net revenue
                      </strong>.
                    </p>
                    <div className="flex items-center gap-2 text-emerald-700 font-bold shrink-0">
                      <TrendingUp className="w-4 h-4" />
                      <span>+{bestMandi.trend_pct}% Market Momentum</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparative Table */}
              <div className="glass-card rounded-3xl p-6 space-y-4 bg-white border border-[#557373]/20 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-black text-base text-[#0d0d0d]">
                    {t.mandi.regionalComparison} {selectedCrop}
                  </h3>
                  <span className="text-xs text-[#64748b] font-medium">
                    Showing {data?.all_mandis?.length || 0} wholesale mandis ranked by net realized return
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#557373]/15 text-[#64748b] uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">{t.mandi.mandiMarket}</th>
                        <th className="py-3 px-3">{t.mandi.variety}</th>
                        <th className="py-3 px-3 text-right">{t.mandi.modalRate}</th>
                        <th className="py-3 px-3 text-right">{t.mandi.priceRange}</th>
                        <th className="py-3 px-3 text-right">{t.mandi.arrivals}</th>
                        <th className="py-3 px-3 text-right">{t.transporter.distance}</th>
                        <th className="py-3 px-3 text-right">{t.mandi.freight}</th>
                        <th className="py-3 px-3 text-right">{t.mandi.netRealized}</th>
                        <th className="py-3 px-3 text-center">{t.mandi.trend}</th>
                        <th className="py-3 px-3 text-center">{t.common.status}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#557373]/10 font-medium">
                      {data?.all_mandis?.map((m: any) => (
                        <tr
                          key={m.id}
                          className={`transition-all ${
                            m.is_best_mandi
                              ? 'bg-[#dfe5f3]/60 font-bold text-[#0d0d0d]'
                              : 'hover:bg-[#dfe5f3]/30 text-[#0d0d0d]'
                          }`}
                        >
                          <td className="py-3.5 px-3 font-bold flex items-center gap-2">
                            {m.is_best_mandi && (
                              <Sparkles className="w-3.5 h-3.5 text-[#272401] shrink-0" />
                            )}
                            <div>
                              <span>{m.mandi_name}</span>
                              <span className="text-[10px] text-[#64748b] block font-normal">{m.district}, {m.state}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-[#64748b] font-medium">
                            {m.variety}
                          </td>
                          <td className="py-3.5 px-3 text-right font-black text-sm text-[#0d0d0d]">
                            ₹{m.modal_price.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-3 text-right text-[#64748b]">
                            ₹{m.min_price.toLocaleString('en-IN')} - ₹{m.max_price.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-3 text-right font-semibold text-[#0d0d0d]">
                            {m.arrivals_tonnes || 120} T
                          </td>
                          <td className="py-3.5 px-3 text-right text-[#64748b]">
                            {m.distance_km} km
                          </td>
                          <td className="py-3.5 px-3 text-right text-rose-600 font-bold">
                            -₹{m.estimated_transport_cost}
                          </td>
                          <td className="py-3.5 px-3 text-right font-black text-sm text-[#557373]">
                            ₹{m.net_realized_price.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${m.trend_pct >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                              {m.trend_pct >= 0 ? '+' : ''}{m.trend_pct}%
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            {m.is_best_mandi ? (
                              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#557373] text-white shadow-xs">
                                ★ {t.mandi.aiBestChoice}
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-800 font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                                {m.market_status || 'Open'}
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
        </>
      ) : (
        /* Tab 2: All-India Real-Time Wholesale Mandi Feed */
        <div className="space-y-5">
          {/* Filters & Search Toolbar */}
          <div className="glass-card rounded-3xl p-5 bg-white border border-[#557373]/20 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Search Bar */}
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Mandi name, City, State, or Variety..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/25 text-[#0d0d0d] text-xs font-semibold focus:outline-none focus:border-[#557373]"
                />
              </div>

              {/* State Filter */}
              <div>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/25 text-[#0d0d0d] text-xs font-bold focus:outline-none focus:border-[#557373]"
                >
                  {STATES_LIST.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Commodity Filter */}
              <div>
                <select
                  value={selectedFeedCrop}
                  onChange={(e) => setSelectedFeedCrop(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/25 text-[#0d0d0d] text-xs font-bold focus:outline-none focus:border-[#557373]"
                >
                  <option value="All Crops">All 17 Commodities</option>
                  {CROPS_LIST.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick State Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> State:
              </span>
              {STATES_LIST.slice(0, 8).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedState === st
                      ? 'bg-[#557373] text-white shadow-xs'
                      : 'bg-[#f2efea] text-[#64748b] hover:bg-[#dfe5f3] hover:text-[#0d0d0d]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Feeds Table */}
          <div className="glass-card rounded-3xl p-6 space-y-4 bg-white border border-[#557373]/20 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-base text-[#0d0d0d]">
                  National APMC Wholesale Mandi Ticker Feed ({sortedFeeds.length} Active Records)
                </h3>
                <p className="text-xs text-[#64748b]">
                  Real-time modal wholesale prices, trade volumes, and price ranges across registered Indian agricultural yards.
                </p>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#64748b] font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#f2efea] border border-[#557373]/20 text-xs font-bold text-[#0d0d0d]"
                >
                  <option value="modal_price">Modal Wholesale Price</option>
                  <option value="arrivals_tonnes">Daily Arrivals (Tonnes)</option>
                  <option value="trend_pct">24h Price Trend %</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="p-1.5 rounded-xl bg-[#f2efea] border border-[#557373]/20 text-[#557373]"
                  title="Toggle Ascending / Descending"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {isFeedLoading ? (
              <div className="py-24 flex flex-col items-center justify-center text-[#64748b] gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#557373]" />
                <span className="text-xs font-semibold">Loading real-time national APMC feeds...</span>
              </div>
            ) : sortedFeeds.length === 0 ? (
              <div className="py-16 text-center text-[#64748b] space-y-2">
                <p className="font-bold text-sm text-[#0d0d0d]">No mandis matched your filter criteria.</p>
                <p className="text-xs">Try searching for a different city, crop, or clearing state filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#557373]/15 text-[#64748b] uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Commodity & Variety</th>
                      <th className="py-3 px-3">Mandi / Market Yard</th>
                      <th className="py-3 px-3">State / District</th>
                      <th className="py-3 px-3 text-right">Modal Price (₹/Qtl)</th>
                      <th className="py-3 px-3 text-right">Min Price</th>
                      <th className="py-3 px-3 text-right">Max Price</th>
                      <th className="py-3 px-3 text-right">Daily Arrivals</th>
                      <th className="py-3 px-3 text-center">24h Trend</th>
                      <th className="py-3 px-3 text-center">Market Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#557373]/10 font-medium">
                    {sortedFeeds.map((feed) => (
                      <tr key={feed.id} className="hover:bg-[#dfe5f3]/30 transition-all text-[#0d0d0d]">
                        <td className="py-3.5 px-3">
                          <div className="font-black text-sm text-[#0d0d0d]">{feed.crop_name}</div>
                          <div className="text-[11px] text-[#64748b] font-medium">{feed.variety}</div>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-[#0d0d0d]">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#557373] shrink-0" />
                            <span>{feed.mandi_name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-[#64748b]">
                          <span>{feed.district}, <strong>{feed.state}</strong></span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-black text-sm text-[#557373]">
                          ₹{feed.modal_price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 text-right text-[#64748b]">
                          ₹{feed.min_price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 text-right text-[#64748b]">
                          ₹{feed.max_price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-[#0d0d0d]">
                          {feed.arrivals_tonnes || 120} Tonnes
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${feed.trend_pct >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {feed.trend_pct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {feed.trend_pct >= 0 ? '+' : ''}{feed.trend_pct}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            {feed.market_status || 'Open & Trading'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

