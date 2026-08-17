import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Plus,
  Gavel,
  CheckCircle2,
  CalendarClock,
  ArrowRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { ProfitBadge } from '../../components/common/ProfitBadge';
import { CreateListingModal } from './CreateListingModal';

interface MyListingsViewProps {
  onOpenBiddingRoom: (listingId: number) => void;
}

export const MyListingsView: React.FC<MyListingsViewProps> = ({
  onOpenBiddingRoom,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchMyListings = async () => {
    try {
      const data = await apiFetch<any[]>('/listings');
      // Filter by current farmer user
      const myList = data.filter((l) => l.farmer_id === user?.id);
      setListings(myList.length > 0 ? myList : data);
    } catch (err) {
      console.error('Failed to load farmer listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {t.nav.myListings}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your produce listings, track live merchant bids, and monitor margins.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/60 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>{t.farmer.createListing}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <span className="text-xs">Loading your listings...</span>
        </div>
      ) : listings.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 space-y-3">
          <Sprout className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="font-bold text-white text-base">
            No Active Crop Listings Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            List your harvest today to receive competitive offers directly from verified merchants.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
          >
            {t.farmer.createListing}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map((l) => {
            const hasBids = l.bids && l.bids.length > 0;
            const topBid = hasBids ? l.bids[0] : null;

            return (
              <div
                key={l.id}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-slate-800/80 flex flex-col justify-between"
              >
                {/* Image Header */}
                <div className="relative h-44 border-b border-slate-800">
                  <img
                    src={l.image_url}
                    alt={l.crop_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                      {l.quality_grade}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        l.status === 'bidding_open'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : l.status === 'finalized'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {l.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="font-black text-lg text-white">
                        {l.crop_name}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">
                        {l.quantity_quintals} Quintals • {l.variety}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Base Reserve
                      </span>
                      <span className="font-extrabold text-slate-200">
                        ₹{l.base_price}/Qtl
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                      <span className="text-[10px] text-amber-400 block font-semibold">
                        Cost of Prod.
                      </span>
                      <span className="font-extrabold text-amber-300">
                        ₹{l.cost_of_production}/Qtl
                      </span>
                    </div>
                  </div>

                  {/* Highest Bid or Scheduled Notice */}
                  {l.status === 'scheduled_tomorrow' ? (
                    <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                      <div className="flex items-center justify-between text-amber-300 font-bold">
                        <span className="flex items-center gap-1">
                          <CalendarClock className="w-3.5 h-3.5" />
                          Bidding Scheduled
                        </span>
                        <CountdownTimer
                          targetDate={l.bidding_opens_at}
                          type="opens_at"
                        />
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Last APMC closing rate: ₹{l.previous_closing_price}/Qtl
                      </div>
                    </div>
                  ) : topBid ? (
                    <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                            Top Bid ({l.total_bids_count} total)
                          </span>
                          <span className="font-black text-base text-white">
                            ₹{topBid.amount_per_quintal.toLocaleString('en-IN')}/Qtl
                          </span>
                        </div>
                        <ProfitBadge
                          bidPrice={topBid.amount_per_quintal}
                          costOfProduction={l.cost_of_production}
                          size="sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 text-slate-400 text-center">
                      Bidding live • Awaiting merchant offers
                    </div>
                  )}

                  {/* Actions */}
                  <button
                    onClick={() => onOpenBiddingRoom(l.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-white font-bold transition-all"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Enter Live Bidding Floor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateListingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchMyListings}
      />
    </div>
  );
};
