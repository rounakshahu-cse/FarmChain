import React, { useState, useEffect } from 'react';
import {
  Truck,
  X,
  MapPin,
  Scale,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import confetti from 'canvas-confetti';

interface SmartTransportModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: number;
  cropName: string;
  loadQuintals: number;
  pickupLocation: string;
  dropLocation: string;
  distanceKm?: number;
  onSuccess?: () => void;
}

export const SmartTransportModal: React.FC<SmartTransportModalProps> = ({
  isOpen,
  onClose,
  orderId,
  cropName,
  loadQuintals,
  pickupLocation,
  dropLocation,
  distanceKm = 45,
  onSuccess,
}) => {
  const [distance, setDistance] = useState(distanceKm);
  const [pickup, setPickup] = useState(pickupLocation);
  const [drop, setDrop] = useState(dropLocation);
  const [load, setLoad] = useState(loadQuintals);

  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch<any>('/transport/quote', {
        method: 'POST',
        body: JSON.stringify({
          crop_name: cropName,
          load_quintals: load,
          pickup_location: pickup,
          drop_location: drop,
          distance_km: distance,
        }),
      });
      setQuoteData(res);
      setSelectedVehicle(res.recommended_vehicle);
    } catch (err) {
      console.error('Failed to get transport quote:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchQuote();
    }
  }, [isOpen, distance, load]);

  const handleBook = async () => {
    if (!quoteData || !selectedVehicle) return;
    const chosenOption = quoteData.options.find(
      (o: any) => o.vehicle_type === selectedVehicle
    );

    setIsBooking(true);
    try {
      await apiFetch('/transport/book', {
        method: 'POST',
        body: JSON.stringify({
          order_id: orderId,
          crop_name: cropName,
          load_quintals: load,
          vehicle_type: selectedVehicle,
          pickup_location: pickup,
          drop_location: drop,
          distance_km: distance,
          calculated_price: chosenOption?.estimated_cost || quoteData.recommended_cost,
        }),
      });

      setBookingSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onSuccess?.();
        onClose();
        setBookingSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsBooking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Truck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Smart Transport Connector
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI Matched
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Minimum freight cost engine calibrated for {load} Qtl {cropName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" /> Pickup Farm
            </label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="mt-1 w-full bg-transparent font-semibold text-slate-200 focus:outline-none border-b border-slate-800 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Navigation className="w-3 h-3 text-amber-400" /> Drop Location
            </label>
            <input
              type="text"
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
              className="mt-1 w-full bg-transparent font-semibold text-slate-200 focus:outline-none border-b border-slate-800 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Scale className="w-3 h-3 text-cyan-400" /> Est. Distance (km)
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="mt-1 w-full bg-transparent font-semibold text-slate-200 focus:outline-none border-b border-slate-800 focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Vehicle Options */}
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              <span>Calculating optimal vehicle capacity & routes...</span>
            </div>
          ) : quoteData?.options?.map((opt: any, idx: number) => {
            const isSelected = selectedVehicle === opt.vehicle_type;
            return (
              <div
                key={idx}
                onClick={() => setSelectedVehicle(opt.vehicle_type)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg shadow-amber-950/40'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{opt.vehicle_type}</span>
                      {opt.is_recommended && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> Best Choice
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-sm text-amber-400">
                    ₹{opt.estimated_cost}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Base ₹{opt.base_rate} + ₹{opt.rate_per_km}/km
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed Verified Transporter & Live GPS Tracking</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleBook}
              disabled={isBooking || isLoading || bookingSuccess}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-950/60 disabled:opacity-50 transition-all"
            >
              {isBooking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Assigning Driver...</span>
                </>
              ) : bookingSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Transport Confirmed!</span>
                </>
              ) : (
                <>
                  <span>Book Transport (₹{quoteData?.recommended_cost || 0})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
