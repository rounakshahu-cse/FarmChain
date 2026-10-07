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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 glass-card border border-[#557373]/25 shadow-sm group bg-white">
        <div className="absolute top-0 right-0 w-[24rem] h-[24rem] bg-gradient-to-bl from-[#dfe5f3] via-[#557373]/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#557373] flex items-center gap-1.5 bg-[#dfe5f3] px-3 py-1.5 rounded-full border border-[#557373]/25">
                <Sparkles className="w-3.5 h-3.5" />
                {t.farmer.welcome}
              </span>
              <span className="text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-[#272401]/10 text-[#272401] border border-[#272401]/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.gateway.zeroMiddlemanBadge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gradient-agro leading-tight">
              {t.farmer.welcome}, {user?.name || t.roles.farmer} 🌾
            </h1>

            <p className="text-xs text-[#64748b] max-w-2xl leading-relaxed">
              {t.farmer.welcomeDesc}
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#557373] hover:bg-[#435c5c] text-white font-black text-xs shadow-md shadow-[#557373]/25 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.farmer.createListing}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Active Listings */}
        <div className="glass-card glass-card-hover rounded-3xl p-5 space-y-1 relative overflow-hidden bg-white border border-[#557373]/20">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#64748b] truncate">
              {t.farmer.activeListings}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0d0d0d] tracking-tight nums">
            {listings.length}
          </div>
          <div className="text-[10px] font-bold text-[#557373] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#557373] animate-pulse" />
            <span>{t.farmer.recentListings}</span>
          </div>
        </div>

        {/* Stat 2: Live Bids */}
        <div className="glass-card glass-card-hover rounded-3xl p-5 space-y-1 relative overflow-hidden bg-white border border-[#557373]/20">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#64748b] truncate">
              {t.farmer.liveBidsCount}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#272401]/10 border border-[#272401]/25 flex items-center justify-center text-[#272401] shrink-0">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0d0d0d] tracking-tight nums">
            {totalBidsCount}
          </div>
          <div className="text-[10px] font-bold text-[#272401] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>{t.biddingRoom.leadingBuyer}</span>
          </div>
        </div>

        {/* Stat 3: Pipeline GMV */}
        <div className="glass-card glass-card-hover rounded-3xl p-5 space-y-1 relative overflow-hidden bg-white border border-[#557373]/20">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#64748b] truncate">
              {t.farmer.totalRevenue}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0d0d0d] tracking-tight nums">
            ₹{totalSalesEstimate.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] font-bold text-[#557373]">
            {t.farmer.expectedEarnings}
          </div>
        </div>

        {/* Stat 4: Best Mandi Alert */}
        <div className="glass-card glass-card-hover rounded-3xl p-5 space-y-1 relative overflow-hidden bg-white border border-[#557373]/20">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#64748b] truncate">
              {t.farmer.bestMandiAlert}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#272401]/10 border border-[#272401]/25 flex items-center justify-center text-[#272401] shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-[#0d0d0d] truncate leading-tight">
            {mandiFeed?.best_mandi?.mandi_name || 'Pune APMC'}
          </div>
          <div className="text-[10px] font-extrabold text-[#557373] nums">
            ₹{mandiFeed?.best_mandi?.modal_price || 5380}/Qtl {t.mandi.netRealizedProfit}
          </div>
        </div>
      </div>

      {/* Quick Access Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mandi Intelligence card */}
        <div
          onClick={() => onNavigate('mandi-intelligence')}
          className="glass-card glass-card-hover rounded-3xl p-5 cursor-pointer space-y-4 relative overflow-hidden group bg-white border border-[#557373]/20"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#557373]" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-[#0d0d0d]">
              {t.nav.mandiIntelligence}
            </h4>
            <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
              {t.mandi.compareMandiRates}
            </p>
          </div>
        </div>

        {/* AI Plant Doctor card */}
        <div
          onClick={() => onNavigate('plant-doctor')}
          className="glass-card glass-card-hover rounded-3xl p-5 cursor-pointer space-y-4 relative overflow-hidden group bg-white border border-[#557373]/20"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#557373]" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-[#0d0d0d]">
              {t.nav.plantDoctor} (AI Vision)
            </h4>
            <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
              {t.disease.uploadPrompt}
            </p>
          </div>
        </div>

        {/* Pesticides & Inputs Store card */}
        <div
          onClick={() => onNavigate('pesticide-store')}
          className="glass-card glass-card-hover rounded-3xl p-5 cursor-pointer space-y-4 relative overflow-hidden group bg-white border border-[#557373]/20"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#272401]/10 border border-[#272401]/25 flex items-center justify-center text-[#272401] group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#272401]" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-[#0d0d0d]">
              {t.nav.pesticideStore}
            </h4>
            <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
              {t.pesticides.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Active Listings in Live Bidding Window */}
      <div className="glass-card rounded-3xl p-6 space-y-5 bg-white border border-[#557373]/20 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] shrink-0">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#0d0d0d]">
                {t.farmer.enterBiddingRoom}
              </h3>
              <p className="text-xs text-[#64748b]">
                {t.farmer.copWarning}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('my-listings')}
            className="text-xs text-[#557373] hover:underline font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#dfe5f3]/50 transition-colors"
          >
            <span>{t.common.viewAll} ({listings.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {listings.slice(0, 2).map((l) => {
            const topBid = l.bids && l.bids.length > 0 ? l.bids[0] : null;
            return (
              <div
                key={l.id}
                onClick={() => onNavigate('bidding-room', l.id)}
                className="p-4 rounded-2xl glass-card glass-card-hover cursor-pointer transition-all flex items-center justify-between gap-4 bg-white border border-[#557373]/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={l.image_url}
                    alt={l.crop_name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#557373]/30 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-black text-sm text-[#0d0d0d] truncate">
                      {l.crop_name} ({l.quantity_quintals} Qtl)
                    </h4>
                    <p className="text-[11px] text-[#64748b] truncate">{l.variety} · {l.quality_grade}</p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#dfe5f3] text-[#557373] border border-[#557373]/30 nums">
                        {l.total_bids_count} {t.farmer.liveBidsCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1 shrink-0">
                  <div className="text-[10px] text-[#64748b] font-semibold">{t.biddingRoom.currentTopBid}</div>
                  <div className="text-xl font-black text-[#557373] nums">
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
