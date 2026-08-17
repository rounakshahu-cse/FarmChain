import React, { useState, useEffect } from 'react';
import {
  Gavel,
  Trophy,
  CheckCircle2,
  TrendingUp,
  Clock,
  User,
  Star,
  Sparkles,
  Loader2,
  Truck,
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { apiFetch, WS_BASE_URL } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ProfitBadge } from '../../components/common/ProfitBadge';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { SmartTransportModal } from '../../components/transport/SmartTransportModal';
import confetti from 'canvas-confetti';

interface LiveBiddingRoomProps {
  initialListingId?: number;
}

export const LiveBiddingRoom: React.FC<LiveBiddingRoomProps> = ({
  initialListingId,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [listings, setListings] = useState<any[]>([]);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);

  // Transport modal state
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [finalizedOrder, setFinalizedOrder] = useState<any | null>(null);

  const fetchListings = async () => {
    try {
      const data = await apiFetch<any[]>('/listings');
      setListings(data);

      if (data.length > 0) {
        if (initialListingId) {
          const match = data.find((l) => l.id === initialListingId);
          setSelectedListing(match || data[0]);
        } else if (!selectedListing) {
          setSelectedListing(data[0]);
        } else {
          // Update selected listing with fresh bids
          const updated = data.find((l) => l.id === selectedListing.id);
          if (updated) setSelectedListing(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    const interval = setInterval(fetchListings, 5000);
    return () => clearInterval(interval);
  }, []);

  // WebSocket for live bid room
  useEffect(() => {
    if (!selectedListing?.id) return;
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(`${WS_BASE_URL}/ws/bids/${selectedListing.id}`);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'NEW_BID' || data.event === 'DEAL_FINALIZED') {
            fetchListings();
          }
        } catch (e) {
          console.error('Error parsing live bid websocket', e);
        }
      };
    } catch (e) {
      console.warn('WS error', e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [selectedListing?.id]);

  const handleAcceptBid = async (bidId: number) => {
    if (!selectedListing) return;
    setIsAccepting(true);
    try {
      const order = await apiFetch<any>('/bids/accept', {
        method: 'POST',
        body: JSON.stringify({ bid_id: bidId }),
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setFinalizedOrder(order);
      await fetchListings();
      setShowTransportModal(true);
    } catch (err: any) {
      alert(`Error accepting bid: ${err.message}`);
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center opacity-60 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <span className="text-xs font-bold">Connecting to Live APMC Bidding Floor...</span>
      </div>
    );
  }

  const isFarmer = user?.role === 'farmer';
  const isOwner = selectedListing && user?.id === selectedListing.farmer_id;
  const bids = selectedListing?.bids || [];
  const leadingBid = bids.length > 0 ? bids[0] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">
                  {t.nav.liveBidding}
                </h2>
                <span className="flex items-center gap-1.5 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  Live Floor
                </span>
              </div>
              <p className="text-xs opacity-75 mt-0.5">
                Real-time merchant bidding floor with instant cost-of-production profit indicators
              </p>
            </div>
          </div>
        </div>

        {/* Listing Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {listings.map((l) => {
            const isSelected = selectedListing?.id === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setSelectedListing(l)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-emerald-400 text-white font-black shadow-lg shadow-emerald-950/40 scale-105'
                    : 'glass-card opacity-80 hover:opacity-100 hover:border-emerald-500/40'
                }`}
              >
                {l.crop_name} ({l.quantity_quintals} Qtl)
              </button>
            );
          })}
        </div>
      </div>

      {selectedListing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Listing Details Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-card rounded-3xl p-5 space-y-4">
              <div className="relative h-48 rounded-2xl overflow-hidden glass-card">
                <img
                  src={selectedListing.image_url}
                  alt={selectedListing.crop_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/40">
                    {selectedListing.quality_grade}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-xl capitalize ${
                      selectedListing.status === 'bidding_open'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : selectedListing.status === 'finalized'
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-amber-500 text-slate-950 font-black'
                    }`}
                  >
                    {selectedListing.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black">
                  {selectedListing.crop_name}
                </h3>
                <p className="text-xs opacity-75">
                  {selectedListing.variety} · {selectedListing.farm_location}
                </p>
              </div>

              {/* Countdown */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl glass-card">
                <span className="text-xs opacity-75 font-semibold">Bidding Window:</span>
                <CountdownTimer
                  targetDate={selectedListing.bidding_closes_at}
                  type="closes_at"
                />
              </div>

              {/* Financial Benchmarks */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3.5 rounded-2xl glass-card">
                  <span className="text-[10px] uppercase font-bold opacity-75 block">
                    Reserve Base
                  </span>
                  <span className="text-base font-black">
                    ₹{selectedListing.base_price}/Qtl
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl glass-card border-amber-500/30">
                  <span className="text-[10px] uppercase font-black text-amber-400 block">
                    Cost of Production
                  </span>
                  <span className="text-base font-black text-amber-300">
                    ₹{selectedListing.cost_of_production}/Qtl
                  </span>
                </div>
              </div>

              {selectedListing.previous_closing_price && (
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs flex items-center justify-between text-cyan-300 font-semibold">
                  <span>Last APMC Market Close:</span>
                  <span className="font-black text-sm">
                    ₹{selectedListing.previous_closing_price}/Qtl
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Bids Stream & Profit Analyzer */}
          <div className="lg:col-span-2 space-y-4">
            {/* Top Bid Banner */}
            {leadingBid ? (
              <div className="glass-card rounded-3xl p-6 border-emerald-500/40 shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                      <Trophy className="w-7 h-7 animate-bounce-subtle" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                          Current Leading Offer
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Rank #1
                        </span>
                      </div>
                      <div className="text-3xl font-black text-emerald-400 tracking-tight">
                        ₹{leadingBid.amount_per_quintal.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-semibold opacity-75">
                          / Quintal
                        </span>
                      </div>
                      <div className="text-xs opacity-85 mt-0.5">
                        Total Deal Value:{' '}
                        <span className="font-black text-emerald-300">
                          ₹{leadingBid.total_amount.toLocaleString('en-IN')}
                        </span>{' '}
                        by {leadingBid.merchant_name}
                      </div>
                    </div>
                  </div>

                  {/* Profitability Flag */}
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-[10px] opacity-75 uppercase font-bold mb-1">
                      Farmer Profit Verdict
                    </span>
                    <ProfitBadge
                      bidPrice={leadingBid.amount_per_quintal}
                      costOfProduction={selectedListing.cost_of_production}
                      quantity={selectedListing.quantity_quintals}
                      benchmarkPrice={selectedListing.previous_closing_price}
                      size="lg"
                    />
                  </div>
                </div>

                {/* Farmer Accept Bid Action */}
                {selectedListing.status === 'bidding_open' && isOwner && (
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs opacity-85 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Funds locked in APMC verified escrow upon acceptance</span>
                    </div>

                    <button
                      onClick={() => handleAcceptBid(leadingBid.id)}
                      disabled={isAccepting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-xl shadow-emerald-950/60 transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
                    >
                      {isAccepting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Locking Escrow Deal...</span>
                        </>
                      ) : (
                        <>
                          <span>{t.farmer.acceptWinningBid}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-10 text-center opacity-75 border">
                <Gavel className="w-12 h-12 mx-auto opacity-40 mb-3" />
                <h4 className="font-bold text-base">
                  No active bids placed yet
                </h4>
                <p className="text-xs mt-1 opacity-75">
                  Merchants have been notified and will place competitive offers shortly.
                </p>
              </div>
            )}

            {/* Bids Leaderboard Table */}
            <div className="glass-card rounded-3xl p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-black text-sm">
                    Live Bids Leaderboard ({bids.length} Offers)
                  </h4>
                </div>
                <span className="text-[11px] opacity-75 font-semibold">
                  Sorted Highest First
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {bids.map((bid: any, idx: number) => {
                  const isTop = idx === 0;
                  return (
                    <div
                      key={bid.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isTop
                          ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md font-bold'
                          : 'glass-card opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                            isTop
                              ? 'bg-emerald-500 text-slate-950 shadow-md'
                              : 'bg-white/10 opacity-75'
                          }`}
                        >
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs">
                              {bid.merchant_name}
                            </span>
                            <span className="text-[10px] text-amber-400 font-extrabold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {bid.merchant_trust_score}
                            </span>
                          </div>
                          {bid.note && (
                            <p className="text-[11px] opacity-75 italic mt-0.5">
                              "{bid.note}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <div className="font-black text-base text-emerald-400">
                            ₹{bid.amount_per_quintal.toLocaleString('en-IN')}/Qtl
                          </div>
                          <div className="text-[10px] opacity-70">
                            Total: ₹{bid.total_amount.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <ProfitBadge
                          bidPrice={bid.amount_per_quintal}
                          costOfProduction={selectedListing.cost_of_production}
                          size="sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Transport Connect Modal Prompt */}
      {showTransportModal && selectedListing && (
        <SmartTransportModal
          isOpen={showTransportModal}
          onClose={() => setShowTransportModal(false)}
          orderId={finalizedOrder?.id}
          cropName={selectedListing.crop_name}
          loadQuintals={selectedListing.quantity_quintals}
          pickupLocation={selectedListing.farm_location}
          dropLocation="APMC Market Depot"
          distanceKm={45}
        />
      )}
    </div>
  );
};
