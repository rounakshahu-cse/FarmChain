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
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Welcome Banner with Calm Luxury Mesh Gradient - MEGA ENLARGED */}
      <div className="relative overflow-hidden rounded-[3rem] p-12 sm:p-16 lg:p-20 glass-card border border-[#557373]/25 shadow-xl group bg-white">
        <div className="absolute top-0 right-0 w-[48rem] h-[48rem] bg-gradient-to-bl from-[#dfe5f3] via-[#557373]/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-base font-extrabold uppercase tracking-wider text-[#557373] flex items-center gap-2.5 bg-[#dfe5f3] px-5 py-2.5 rounded-full border border-[#557373]/25">
                <Sparkles className="w-6 h-6" />
                {t.farmer.welcome}
              </span>
              <span className="text-base font-black px-5 py-2.5 rounded-full bg-[#272401]/10 text-[#272401] border border-[#272401]/20 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5" />
                {t.gateway.zeroMiddlemanBadge}
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-gradient-agro leading-[0.95]">
              {t.farmer.welcome}, {user?.name || t.roles.farmer} 🌾
            </h1>
            
            <p className="text-lg sm:text-xl text-[#64748b] max-w-3xl leading-relaxed">
              {t.farmer.welcomeDesc}
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-4 px-12 py-6 rounded-3xl bg-[#557373] hover:bg-[#435c5c] text-white font-black text-lg sm:text-xl shadow-xl shadow-[#557373]/30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Plus className="w-7 h-7 stroke-[3]" />
            <span>{t.farmer.createListing}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid with Calm Luxury Accents - MEGA ENLARGED CHARTS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Stat 1: Active Listings - MEGA ENLARGED */}
        <div className="glass-card glass-card-hover rounded-[3rem] p-10 sm:p-12 space-y-6 relative overflow-hidden bg-white border border-[#557373]/20 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#64748b]">
              {t.farmer.activeListings}
            </span>
            <div className="w-20 h-20 rounded-3xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] shadow-sm">
              <Sprout className="w-10 h-10" />
            </div>
          </div>
          <div className="text-6xl sm:text-7xl font-black text-[#0d0d0d] tracking-tight">
            {listings.length}
          </div>
          <div className="text-base font-bold text-[#557373] flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#557373] animate-pulse" />
            <span>{t.farmer.recentListings}</span>
          </div>
        </div>

        {/* Stat 2: Live Bids - MEGA ENLARGED */}
        <div className="glass-card glass-card-hover rounded-[3rem] p-10 sm:p-12 space-y-6 relative overflow-hidden bg-white border border-[#557373]/20 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#64748b]">
              {t.farmer.liveBidsCount}
            </span>
            <div className="w-20 h-20 rounded-3xl bg-[#272401]/10 border border-[#272401]/25 flex items-center justify-center text-[#272401] shadow-sm">
              <Gavel className="w-10 h-10" />
            </div>
          </div>
          <div className="text-6xl sm:text-7xl font-black text-[#0d0d0d] tracking-tight">
            {totalBidsCount}
          </div>
          <div className="text-base font-bold text-[#272401] flex items-center gap-2.5">
            <Flame className="w-6 h-6" />
            <span>{t.biddingRoom.leadingBuyer}</span>
          </div>
        </div>

        {/* Stat 3: Pipeline GMV - MEGA ENLARGED */}
        <div className="glass-card glass-card-hover rounded-[3rem] p-10 sm:p-12 space-y-6 relative overflow-hidden bg-white border border-[#557373]/20 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#64748b]">
              {t.farmer.totalRevenue}
            </span>
            <div className="w-20 h-20 rounded-3xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] shadow-sm">
              <DollarSign className="w-10 h-10" />
            </div>
          </div>
          <div className="text-5xl sm:text-6xl font-black text-[#0d0d0d] tracking-tight">
            ₹{totalSalesEstimate.toLocaleString('en-IN')}
          </div>
          <div className="text-base font-bold text-[#557373]">
            {t.farmer.expectedEarnings}
          </div>
        </div>

        {/* Stat 4: Best Mandi Alert - MEGA ENLARGED */}
        <div className="glass-card glass-card-hover rounded-[3rem] p-10 sm:p-12 space-y-6 relative overflow-hidden bg-white border border-[#557373]/20 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#64748b]">
              {t.farmer.bestMandiAlert}
            </span>
            <div className="w-20 h-20 rounded-3xl bg-[#272401]/10 border border-[#272401]/25 flex items-center justify-center text-[#272401] shadow-sm">
              <TrendingUp className="w-10 h-10" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#0d0d0d] truncate leading-tight">
            {mandiFeed?.best_mandi?.mandi_name || 'Pune APMC'}
          </div>
          <div className="text-base font-extrabold text-[#557373]">
            ₹{mandiFeed?.best_mandi?.modal_price || 5380}/Qtl {t.mandi.netRealizedProfit}
          </div>
        </div>
      </div>

      {/* Quick Access Feature Cards - MEGA ENLARGED */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Mandi Intelligence card */}
        <div
          onClick={() => onNavigate('mandi-intelligence')}
          className="glass-card glass-card-hover rounded-[3rem] p-10 sm:p-14 cursor-pointer space-y-8 relative overflow-hidden group bg-white border border-[#557373]/20 shadow-md hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="w-24 h-24 rounded-[2rem] bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] group-hover:scale-110 transition-transform shadow-sm">
              <TrendingUp className="w-11 h-11" />
            </div>
            <ArrowRight className="w-7 h-7 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#557373]" />
          </div>
          <div>
            <h4 className="font-extrabold text-2xl sm:text-3xl text-[#0d0d0d]">
              {t.nav.mandiIntelligence}
            </h4>
            <p className="text-lg text-[#64748b] mt-4 leading-relaxed">
              {t.mandi.compareMandiRates}
            </p>
          </div>
        </div>

        {/* AI Plant Doctor card */}
        <div
          onClick={() => onNavigate('plant-doctor')}
          className="glass-card glass-card-hover rounded-[3rem] p-10 sm:p-14 cursor-pointer space-y-8 relative overflow-hidden group bg-white border border-[#557373]/20 shadow-md hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="w-24 h-24 rounded-[2rem] bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] group-hover:scale-110 transition-transform shadow-sm">
              <Stethoscope className="w-11 h-11" />
            </div>
            <ArrowRight className="w-7 h-7 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#557373]" />
          </div>
          <div>
            <h4 className="font-extrabold text-2xl sm:text-3xl text-[#0d0d0d]">
              {t.nav.plantDoctor} (AI Vision)
            </h4>
            <p className="text-lg text-[#64748b] mt-4 leading-relaxed">
              {t.disease.uploadPrompt}
            </p>
          </div>
        </div>

        {/* Pesticides & Inputs Store card */}
        <div
          onClick={() => onNavigate('pesticide-store')}
          className="glass-card glass-card-hover rounded-[3rem] p-10 sm:p-14 cursor-pointer space-y-8 relative overflow-hidden group bg-white border border-[#557373]/20 shadow-md hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="w-24 h-24 rounded-[2rem] bg-[#272401]/10 border border-[#272401]/25 flex items-center justify-center text-[#272401] group-hover:scale-110 transition-transform shadow-sm">
              <ShoppingBag className="w-11 h-11" />
            </div>
            <ArrowRight className="w-7 h-7 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#272401]" />
          </div>
          <div>
            <h4 className="font-extrabold text-2xl sm:text-3xl text-[#0d0d0d]">
              {t.nav.pesticideStore}
            </h4>
            <p className="text-lg text-[#64748b] mt-4 leading-relaxed">
              {t.pesticides.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Active Listings in Live Bidding Window - MEGA ENLARGED */}
      <div className="glass-card rounded-[3rem] p-10 sm:p-12 lg:p-14 space-y-10 bg-white border border-[#557373]/20 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] shadow-sm">
              <Gavel className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-2xl sm:text-3xl text-[#0d0d0d]">
                {t.farmer.enterBiddingRoom}
              </h3>
              <p className="text-base sm:text-lg text-[#64748b]">
                {t.farmer.copWarning}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('my-listings')}
            className="text-lg text-[#557373] hover:underline font-bold flex items-center gap-2.5 px-5 py-2.5 rounded-full hover:bg-[#dfe5f3]/50 transition-colors"
          >
            <span>{t.common.viewAll} ({listings.length})</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {listings.slice(0, 2).map((l) => {
            const topBid = l.bids && l.bids.length > 0 ? l.bids[0] : null;
            return (
              <div
                key={l.id}
                onClick={() => onNavigate('bidding-room', l.id)}
                className="p-10 rounded-[2.5rem] glass-card glass-card-hover cursor-pointer transition-all flex items-center justify-between gap-8 bg-white border border-[#557373]/20 shadow-sm hover:shadow-lg"
              >
                <div className="flex items-center gap-6">
                  <img
                    src={l.image_url}
                    alt={l.crop_name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] object-cover border border-[#557373]/30 shadow-sm"
                  />
                  <div className="space-y-2.5">
                    <h4 className="font-black text-xl sm:text-2xl text-[#0d0d0d]">
                      {l.crop_name} ({l.quantity_quintals} Qtl)
                    </h4>
                    <p className="text-lg text-[#64748b]">{l.variety} · {l.quality_grade}</p>
                    <div className="flex items-center gap-2.5 pt-1">
                      <span className="text-base font-extrabold px-4 py-2 rounded-full bg-[#dfe5f3] text-[#557373] border border-[#557373]/30">
                        {l.total_bids_count} {t.farmer.liveBidsCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-2.5 shrink-0">
                  <div className="text-base text-[#64748b] font-semibold">{t.biddingRoom.currentTopBid}</div>
                  <div className="text-3xl sm:text-4xl font-black text-[#557373]">
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
