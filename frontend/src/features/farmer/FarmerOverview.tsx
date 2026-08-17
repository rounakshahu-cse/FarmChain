import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Plus,
  Gavel,
  TrendingUp,
  Truck,
  Stethoscope,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  DollarSign,
  Layers,
  Flame,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../api/client';
import { ProfitBadge } from '../../components/common/ProfitBadge';
import { CreateListingModal } from './CreateListingModal';

interface FarmerOverviewProps {
  onNavigate: (tab: string, initialListingId?: number) => void;
}

export const FarmerOverview: React.FC<FarmerOverviewProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [listings, setListings] = useState<any[]>([]);
  const [mandiFeed, setMandiFeed] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        const [listData, mandiData] = await Promise.all([
          apiFetch<any[]>('/listings'),
          apiFetch<any>('/mandi/prices?crop=Soybean'),
        ]);
        setListings(listData);
        setMandiFeed(mandiData);
      } catch (err) {
        console.error('Failed to load farmer overview:', err);
      }
    };
    loadOverviewData();
  }, []);

  const totalSalesEstimate = listings.reduce((acc, l) => {
    const topBid = l.bids && l.bids.length > 0 ? l.bids[0].total_amount : 0;
    return acc + topBid;
  }, 0);

  const totalBidsCount = listings.reduce((acc, l) => acc + (l.total_bids_count || 0), 0);

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Welcome Banner with Dynamic Mesh Gradient */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-card border border-emerald-500/30 shadow-2xl group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Empowering Indian Agriculture
              </span>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                0% Middleman Cut · 100% Direct APMC
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gradient-agro">
              Welcome, {user?.name || 'Farmer'} 🌾
            </h1>
            
            <p className="text-xs sm:text-sm opacity-80 max-w-2xl leading-relaxed">
              Connect directly with verified wholesale merchants, lock in guaranteed profit-protected bids, calculate real-time net mandi returns, and diagnose crop health with AI vision.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-950/60 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.farmer.createListing}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid with Rich Color Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Active Listings */}
        <div className="glass-card glass-card-hover rounded-3xl p-4 sm:p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-75">
              {t.farmer.activeListings}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black">
            {listings.length}
          </div>
          <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Across 5 Agri commodities</span>
          </div>
        </div>

        {/* Stat 2: Live Bids */}
        <div className="glass-card glass-card-hover rounded-3xl p-4 sm:p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-75">
              {t.farmer.liveBidsCount}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black">
            {totalBidsCount}
          </div>
          <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            <span>From certified APMC buyers</span>
          </div>
        </div>

        {/* Stat 3: Pipeline GMV */}
        <div className="glass-card glass-card-hover rounded-3xl p-4 sm:p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-75">
              Active Pipeline GMV
            </span>
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black">
            ₹{totalSalesEstimate.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] font-bold text-cyan-400">
            Projected total realization
          </div>
        </div>

        {/* Stat 4: Best Mandi Alert */}
        <div className="glass-card glass-card-hover rounded-3xl p-4 sm:p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-75">
              Best Mandi Alert
            </span>
            <div className="w-9 h-9 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-purple-300 truncate">
            {mandiFeed?.best_mandi?.mandi_name || 'Pune APMC'}
          </div>
          <div className="text-[11px] font-extrabold text-purple-400">
            ₹{mandiFeed?.best_mandi?.modal_price || 5380}/Qtl Net Realized
          </div>
        </div>
      </div>

      {/* Quick Access Feature Cards with Distinct Color Tones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mandi Intelligence card */}
        <div
          onClick={() => onNavigate('mandi-intelligence')}
          className="glass-card glass-card-hover rounded-3xl p-5 cursor-pointer space-y-3 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-gradient-agro">
              {t.nav.mandiIntelligence}
            </h4>
            <p className="text-xs opacity-75 mt-1 leading-relaxed">
              Compare prices net of transport across 10+ APMCs to maximize your profit.
            </p>
          </div>
        </div>

        {/* AI Plant Doctor card */}
        <div
          onClick={() => onNavigate('plant-doctor')}
          className="glass-card glass-card-hover rounded-3xl p-5 cursor-pointer space-y-3 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-violet-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-violet-300">
              {t.nav.plantDoctor} (AI Vision)
            </h4>
            <p className="text-xs opacity-75 mt-1 leading-relaxed">
              Upload leaf photos for 98% accurate disease detection & instant spray remedies.
            </p>
          </div>
        </div>

        {/* Pesticides & Inputs Store card */}
        <div
          onClick={() => onNavigate('pesticide-store')}
          className="glass-card glass-card-hover rounded-3xl p-5 cursor-pointer space-y-3 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-gradient-gold">
              {t.nav.pesticideStore}
            </h4>
            <p className="text-xs opacity-75 mt-1 leading-relaxed">
              Order verified bio-fungicides, certified seeds & pure organic inputs.
            </p>
          </div>
        </div>
      </div>

      {/* Active Listings in Live Bidding Window */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                Active Produce in Live Bidding Window
              </h3>
              <p className="text-[11px] opacity-75">
                Real-time merchant offers with automatic cost-of-production profit protection
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('my-listings')}
            className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>View All ({listings.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.slice(0, 2).map((l) => {
            const topBid = l.bids && l.bids.length > 0 ? l.bids[0] : null;
            return (
              <div
                key={l.id}
                onClick={() => onNavigate('bidding-room', l.id)}
                className="p-4 rounded-2xl glass-card glass-card-hover cursor-pointer transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={l.image_url}
                    alt={l.crop_name}
                    className="w-16 h-16 rounded-2xl object-cover border border-emerald-500/30"
                  />
                  <div className="space-y-0.5">
                    <h4 className="font-black text-sm">
                      {l.crop_name} ({l.quantity_quintals} Qtl)
                    </h4>
                    <p className="text-xs opacity-75">{l.variety} · {l.quality_grade}</p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {l.total_bids_count} active bids
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-[11px] opacity-75 font-semibold">Leading Bid</div>
                  <div className="text-lg font-black text-emerald-400">
                    ₹{topBid ? topBid.amount_per_quintal.toLocaleString('en-IN') : l.base_price}/Qtl
                  </div>
                  {topBid && (
                    <ProfitBadge
                      bidPrice={topBid.amount_per_quintal}
                      costOfProduction={l.cost_of_production}
                      size="sm"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CreateListingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => onNavigate('my-listings')}
      />
    </div>
  );
};
