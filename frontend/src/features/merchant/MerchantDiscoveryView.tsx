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
    { id: 'all', label: t.merchant.allCrops },
    { id: 'oilseeds', label: t.merchant.oilseeds, match: ['Soybean', 'Mustard', 'Groundnut'] },
    { id: 'cereals', label: t.merchant.cereals, match: ['Wheat', 'Rice', 'Maize', 'Bajra'] },
    { id: 'vegetables', label: t.merchant.vegetables, match: ['Tomato', 'Onion', 'Potato'] },
    { id: 'commercial', label: t.merchant.commercial, match: ['Cotton', 'Sugarcane'] },
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
            <div className="w-10 h-10 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0d0d0d]">
                {t.merchant.browseListings}
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                {t.merchant.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.merchant.searchCrops}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#557373]/25 text-xs text-[#0d0d0d] placeholder:text-[#64748b] focus:outline-none focus:border-[#557373] transition-all shadow-xs"
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
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-[#557373] border-[#557373] text-white font-black shadow-md shadow-[#557373]/20 scale-105'
                  : 'bg-white border-[#557373]/20 text-[#0d0d0d] hover:bg-[#dfe5f3]/50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Listings */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-[#64748b] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#557373]" />
          <span className="text-xs font-semibold">{t.common.loading}</span>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-[#557373]/20 bg-white">
          <Store className="w-12 h-12 mx-auto text-[#557373]/50 mb-3" />
          <h4 className="font-bold text-base text-[#0d0d0d]">{t.merchant.title}</h4>
          <p className="text-xs mt-1 text-[#64748b]">{t.common.noData}</p>
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
                className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group bg-white border border-[#557373]/20"
              >
                {/* Image & Status Badges */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={l.image_url}
                    alt={l.crop_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                  <div className="absolute top-3.5 left-3.5">
                    <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-[#dfe5f3] border border-[#557373]/40">
                      {l.quality_grade}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5">
                    {isScheduled ? (
                      <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-[#dfe5f3] text-[#272401] border border-[#272401]/30 flex items-center gap-1">
                        <CalendarClock className="w-3 h-3 text-[#272401]" />
                        {t.merchant.scheduledTomorrowBanner}
                      </span>
                    ) : isFinalized ? (
                      <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-[#272401] text-white">
                        {t.biddingRoom.dealConfirmed}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-[#557373] text-white flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        {t.biddingRoom.liveRoomActive}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5">
                    <h3 className="font-black text-xl text-white tracking-tight">
                      {l.crop_name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/90 font-semibold mt-0.5">
                      <span>{l.quantity_quintals} Quintals · {l.variety}</span>
                      <span className="flex items-center gap-1 text-[11px] text-[#dfe5f3] font-extrabold bg-black/40 px-2 py-0.5 rounded-lg border border-white/20">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {l.farmer_trust_score} Trust
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-xs">
                  {/* Origin */}
                  <div className="flex items-center gap-1.5 text-[#64748b] text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-[#557373] shrink-0" />
                    <span className="truncate">{t.merchant.sellerFarmer}: <b className="text-[#0d0d0d]">{l.farmer_name}</b> ({l.farm_location})</span>
                  </div>

                  {/* Scheduled Tomorrow Notice Banner */}
                  {isScheduled ? (
                    <div className="p-3.5 rounded-2xl bg-[#dfe5f3]/70 border border-[#557373]/30 space-y-1.5">
                      <div className="flex items-center justify-between text-[#272401] font-bold">
                        <span className="flex items-center gap-1.5">
                          <CalendarClock className="w-3.5 h-3.5 text-[#272401]" />
                          {t.merchant.scheduledTomorrowBanner}
                        </span>
                        <CountdownTimer
                          targetDate={l.bidding_opens_at}
                          type="opens_at"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#64748b]">{t.merchant.previousClosePrice}:</span>
                        <span className="font-black text-[#272401]">
                          ₹{l.previous_closing_price}/Qtl
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/20">
                        <span className="text-[10px] text-[#64748b] block font-semibold">
                          {t.biddingRoom.reserveBasePrice}
                        </span>
                        <span className="font-extrabold text-sm text-[#0d0d0d]">
                          ₹{l.base_price}/Qtl
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#dfe5f3]/60 border border-[#557373]/30">
                        <span className="text-[10px] text-[#557373] block font-bold">
                          {t.merchant.currentHighestBid}
                        </span>
                        <span className="font-black text-sm text-[#557373]">
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
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#557373] hover:bg-[#435c5c] text-white font-black shadow-md shadow-[#557373]/20 transition-all"
                        >
                          <Gavel className="w-4 h-4 stroke-[2.5]" />
                          <span>{t.merchant.placeBid}</span>
                        </button>
                        <button
                          onClick={() => onOpenLiveBidding(l.id)}
                          className="px-3.5 py-3 rounded-2xl bg-white border border-[#557373]/30 hover:bg-[#dfe5f3] transition-all text-[#557373]"
                          title="Watch live auction room"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onOpenLiveBidding(l.id)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#dfe5f3] hover:bg-[#557373] hover:text-white text-[#557373] font-bold border border-[#557373]/25 transition-all"
                      >
                        <Clock className="w-4 h-4" />
                        <span>{t.merchant.enterAuction}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white border border-[#557373]/20 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#0d0d0d]">
            <div className="flex items-center justify-between border-b border-[#557373]/15 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373]">
                  <Gavel className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-[#0d0d0d]">
                  {t.merchant.placeBid}
                </h3>
              </div>
              <button
                onClick={() => setBiddingListing(null)}
                className="text-[#64748b] hover:text-[#0d0d0d] p-1.5 rounded-lg hover:bg-[#dfe5f3]/50 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-4 mt-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/20 space-y-1">
                <div className="font-black text-sm text-[#0d0d0d]">
                  {biddingListing.crop_name} ({biddingListing.quantity_quintals} Qtl)
                </div>
                <div className="text-[#64748b] text-xs">
                  Farmer: {biddingListing.farmer_name} · {biddingListing.farm_location}
                </div>
                <div className="flex items-center justify-between text-xs pt-2 mt-1 border-t border-[#557373]/15">
                  <span className="text-[#64748b]">{t.biddingRoom.currentTopBid}:</span>
                  <span className="font-black text-[#557373] text-sm">
                    ₹{biddingListing.highest_bid_amount || biddingListing.base_price}/Qtl
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-[#0d0d0d]">
                  {t.merchant.yourBidPerQtl} *
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={biddingListing.base_price}
                  className="w-full px-3.5 py-3 rounded-2xl bg-white border border-[#557373]/40 text-[#0d0d0d] font-black text-lg focus:outline-none focus:border-[#557373]"
                />
              </div>

              {/* Quick Increment Chips */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#64748b] font-semibold">{t.merchant.quickIncrement}:</span>
                {[50, 100, 200, 500].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setBidAmount((prev) => prev + inc)}
                    className="px-3 py-1.5 rounded-xl bg-[#dfe5f3] hover:bg-[#557373] hover:text-white border border-[#557373]/30 text-[11px] font-black text-[#557373] transition-all"
                  >
                    +₹{inc}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#dfe5f3]/70 border border-[#557373]/25 text-[#0d0d0d] flex items-center justify-between">
                <span className="font-semibold text-[#64748b]">{t.payments.totalSettled}:</span>
                <span className="font-black text-base text-[#557373]">
                  ₹{(bidAmount * biddingListing.quantity_quintals).toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="font-bold block mb-1 text-[#0d0d0d]">
                  {t.orders.counterParty}
                </label>
                <input
                  type="text"
                  value={bidNote}
                  onChange={(e) => setBidNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/30 text-[#0d0d0d] focus:outline-none focus:border-[#557373]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingBid || bidSuccess}
                className="w-full py-3.5 rounded-2xl bg-[#557373] hover:bg-[#435c5c] text-white font-black shadow-md shadow-[#557373]/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-xs"
              >
                {isSubmittingBid ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.common.loading}</span>
                  </>
                ) : bidSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>{t.biddingRoom.dealConfirmed}</span>
                  </>
                ) : (
                  <>
                    <Gavel className="w-4 h-4 stroke-[2.5]" />
                    <span>{t.biddingRoom.submitBid}</span>
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
