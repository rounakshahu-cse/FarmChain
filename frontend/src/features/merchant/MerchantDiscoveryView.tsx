import React, { useState, useEffect } from 'react';
import {
  Store,
  Search,
  Filter,
  Gavel,
  CalendarClock,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sparkles,
  MapPin,
  Star,
  SlidersHorizontal
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import confetti from 'canvas-confetti';

interface MerchantDiscoveryViewProps {
  onOpenLiveBidding: (listingId: number) => void;
}

export const MerchantDiscoveryView: React.FC<MerchantDiscoveryViewProps> = ({
  onOpenLiveBidding,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [listings, setListings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Quick bidding modal state
  const [biddingListing, setBiddingListing] = useState<any | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidNote, setBidNote] = useState('');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);

  const fetchListings = async () => {
    try {
      const data = await apiFetch<any[]>('/listings');
      setListings(data);
    } catch (err) {
      console.error('Failed to load merchant marketplace:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleOpenBidModal = (listing: any) => {
    setBiddingListing(listing);
    const topBid = listing.bids && listing.bids.length > 0 ? listing.bids[0].amount_per_quintal : listing.base_price;
    setBidAmount(topBid + 50);
    setBidNote('Direct cash settlement upon APMC dock receipt');
    setBidSuccess(false);
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingListing) return;

    setIsSubmittingBid(true);
    try {
      await apiFetch(`/listings/${biddingListing.id}/bids`, {
        method: 'POST',
        body: JSON.stringify({
          amount_per_quintal: Number(bidAmount),
          note: bidNote,
        }),
      });

      setBidSuccess(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });

      await fetchListings();
      setTimeout(() => {
        setBiddingListing(null);
        setBidSuccess(false);
      }, 1500);
    } catch (err: any) {
      alert(`Bid placement error: ${err.message}`);
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Crops' },
    { id: 'oilseeds', label: 'Oilseeds', match: ['Soybean', 'Mustard', 'Groundnut'] },
    { id: 'cereals', label: 'Grains & Cereals', match: ['Wheat', 'Rice', 'Maize', 'Bajra'] },
    { id: 'vegetables', label: 'Vegetables', match: ['Tomato', 'Onion', 'Potato'] },
    { id: 'commercial', label: 'Commercial', match: ['Cotton', 'Sugarcane'] },
  ];

  const filteredListings = listings.filter((l) => {
    let matchesCat = true;
    if (selectedCategory !== 'all') {
      const activeCat = categories.find((c) => c.id === selectedCategory);
      if (activeCat?.match) {
        matchesCat = activeCat.match.some((crop) => l.crop_name.toLowerCase().includes(crop.toLowerCase()));
      }
    }
    const matchesSearch =
      l.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.variety?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.farm_location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                {t.merchant.browseListings}
              </h2>
              <p className="text-xs opacity-75 mt-0.5">
                Verified direct farm lots with live APMC benchmark rates & transparent bids
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 opacity-50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.merchant.searchCrops}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-card text-xs placeholder:opacity-50 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-950/40 scale-105'
                  : 'glass-card opacity-80 hover:opacity-100 hover:border-amber-500/40'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Listings */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center opacity-60 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <span className="text-xs font-semibold">Loading marketplace produce...</span>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center opacity-75">
          <Store className="w-12 h-12 mx-auto opacity-40 mb-3" />
          <h4 className="font-bold text-base">No matching produce lots found</h4>
          <p className="text-xs mt-1 opacity-75">Try adjusting your search terms or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredListings.map((l) => {
            const hasBids = l.bids && l.bids.length > 0;
            const topBid = hasBids ? l.bids[0] : null;
            const isScheduled = l.status === 'scheduled_tomorrow';
            const isFinalized = l.status === 'finalized';

            return (
              <div
                key={l.id}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Image & Status Badges */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={l.image_url}
                    alt={l.crop_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute top-3.5 left-3.5">
                    <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/40">
                      {l.quality_grade}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5">
                    {isScheduled ? (
                      <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-amber-950/90 text-amber-300 border border-amber-500/50 flex items-center gap-1">
                        <CalendarClock className="w-3 h-3 text-amber-400" />
                        Opens Tomorrow
                      </span>
                    ) : isFinalized ? (
                      <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-blue-950/90 text-blue-300 border border-blue-500/50">
                        Deal Finalized
                      </span>
                    ) : (
                      <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Live Bidding
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5">
                    <h3 className="font-black text-xl text-white tracking-tight">
                      {l.crop_name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/90 font-semibold mt-0.5">
                      <span>{l.quantity_quintals} Quintals · {l.variety}</span>
                      <span className="flex items-center gap-1 text-[11px] text-amber-400 font-extrabold bg-black/40 px-2 py-0.5 rounded-lg">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {l.farmer_trust_score} Trust
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-xs">
                  {/* Origin */}
                  <div className="flex items-center gap-1.5 opacity-75 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Farmer: <b>{l.farmer_name}</b> ({l.farm_location})</span>
                  </div>

                  {/* Scheduled Tomorrow Notice Banner */}
                  {isScheduled ? (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                      <div className="flex items-center justify-between text-amber-300 font-bold">
                        <span className="flex items-center gap-1.5">
                          <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
                          {t.merchant.scheduledTomorrowBanner}
                        </span>
                        <CountdownTimer
                          targetDate={l.bidding_opens_at}
                          type="opens_at"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="opacity-80">{t.merchant.previousClosePrice}:</span>
                        <span className="font-black text-amber-400">
                          ₹{l.previous_closing_price}/Qtl
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-2xl glass-card">
                        <span className="text-[10px] opacity-70 block font-semibold">
                          Reserve Base
                        </span>
                        <span className="font-extrabold text-sm">
                          ₹{l.base_price}/Qtl
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl glass-card border-emerald-500/30">
                        <span className="text-[10px] text-emerald-400 block font-bold">
                          Current Highest Bid
                        </span>
                        <span className="font-black text-sm text-emerald-400">
                          ₹{topBid ? topBid.amount_per_quintal : l.base_price}/Qtl
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Merchant Actions */}
                  <div className="pt-1 flex items-center gap-2">
                    {l.status === 'bidding_open' ? (
                      <>
                        <button
                          onClick={() => handleOpenBidModal(l)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/40 transition-all"
                        >
                          <Gavel className="w-4 h-4 stroke-[2.5]" />
                          <span>{t.merchant.placeBid}</span>
                        </button>
                        <button
                          onClick={() => onOpenLiveBidding(l.id)}
                          className="px-3.5 py-3 rounded-2xl glass-card hover:border-emerald-500/50 transition-all text-emerald-400"
                          title="Watch live auction room"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onOpenLiveBidding(l.id)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl glass-card hover:border-emerald-500/50 font-bold transition-all"
                      >
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span>View Auction Room</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Bid Modal */}
      {biddingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl glass-panel shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Gavel className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base">
                  Place Competitive Bid
                </h3>
              </div>
              <button
                onClick={() => setBiddingListing(null)}
                className="opacity-60 hover:opacity-100 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-4 mt-4 text-xs">
              <div className="p-3.5 rounded-2xl glass-card space-y-1">
                <div className="font-black text-sm">
                  {biddingListing.crop_name} ({biddingListing.quantity_quintals} Qtl)
                </div>
                <div className="opacity-75 text-xs">
                  Farmer: {biddingListing.farmer_name} · {biddingListing.farm_location}
                </div>
                <div className="flex items-center justify-between text-xs pt-2 mt-1 border-t border-white/10">
                  <span className="opacity-75">Current Leading Offer:</span>
                  <span className="font-black text-emerald-400 text-sm">
                    ₹{biddingListing.highest_bid_amount || biddingListing.base_price}/Qtl
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">
                  {t.merchant.yourBidPerQtl} *
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={biddingListing.base_price}
                  className="w-full px-3.5 py-3 rounded-2xl glass-card border-amber-500/60 text-amber-400 font-black text-lg focus:outline-none"
                />
              </div>

              {/* Quick Increment Chips */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] opacity-75 font-semibold">Quick Add:</span>
                {[50, 100, 200, 500].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setBidAmount((prev) => prev + inc)}
                    className="px-3 py-1.5 rounded-xl glass-card hover:bg-amber-500/20 hover:border-amber-500/40 text-[11px] font-black text-amber-300 transition-all"
                  >
                    +₹{inc}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between">
                <span className="font-semibold">Total Deal Commitment:</span>
                <span className="font-black text-base">
                  ₹{(bidAmount * biddingListing.quantity_quintals).toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="font-bold block mb-1">
                  Offer Note / Settlement Terms
                </label>
                <input
                  type="text"
                  value={bidNote}
                  onChange={(e) => setBidNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-card focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingBid || bidSuccess}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/50 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-xs"
              >
                {isSubmittingBid ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Broadcasting Live Bid...</span>
                  </>
                ) : bidSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Bid Successfully Placed!</span>
                  </>
                ) : (
                  <>
                    <Gavel className="w-4 h-4 stroke-[2.5]" />
                    <span>Confirm & Broadcast Bid</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
