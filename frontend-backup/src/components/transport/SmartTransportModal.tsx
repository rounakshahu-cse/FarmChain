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
import { RealPaymentModal } from '../payment/RealPaymentModal';
import { useLanguage } from '../../context/LanguageContext';

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
  const { t } = useLanguage();
  const [distance, setDistance] = useState(distanceKm);
  const [pickup, setPickup] = useState(pickupLocation);
  const [drop, setDrop] = useState(dropLocation);
  const [load, setLoad] = useState(loadQuintals);

  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookedJobData, setBookedJobData] = useState<any>(null);

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
      const job = await apiFetch<any>('/transport/book', {
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

      setBookedJobData(job);
      setIsBooking(false);
      setShowPaymentModal(true);
    } catch (err) {
      console.error('Booking failed:', err);
      setIsBooking(false);
    }
  };

  const handleFreightPaymentSuccess = async (paymentDetails: any) => {
    if (bookedJobData) {
      try {
        await apiFetch(`/transport/jobs/${bookedJobData.id}/pay`, {
          method: 'POST',
          body: JSON.stringify({
            payment_method: paymentDetails.method,
            amount: paymentDetails.amount
          })
        });
      } catch (e) {
        console.error('Payment sync error:', e);
      }
    }
    setShowPaymentModal(false);
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
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-[#557373]/20 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#0d0d0d]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#557373]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#557373]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#0d0d0d]">
                  {t.transporterFleet.hireTransporter}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dfe5f3] text-[#557373] border border-[#557373]/30">
                  {t.common.verified}
                </span>
              </div>
              <p className="text-xs text-[#64748b]">
                {t.transporter.title} · {load} {t.common.quintal} {cropName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748b] hover:text-[#0d0d0d] hover:bg-[#dfe5f3]/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 p-3.5 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/20 text-xs">
          <div>
            <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#557373]" /> {t.transporter.pickup}
            </label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="mt-1 w-full bg-transparent font-semibold text-[#0d0d0d] focus:outline-none border-b border-[#557373]/20 focus:border-[#557373]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1">
              <Navigation className="w-3 h-3 text-[#272401]" /> {t.transporter.drop}
            </label>
            <input
              type="text"
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
              className="mt-1 w-full bg-transparent font-semibold text-[#0d0d0d] focus:outline-none border-b border-[#557373]/20 focus:border-[#272401]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1">
              <Scale className="w-3 h-3 text-[#557373]" /> {t.transporter.distance} (km)
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="mt-1 w-full bg-transparent font-semibold text-[#0d0d0d] focus:outline-none border-b border-[#557373]/20 focus:border-[#557373]"
            />
          </div>
        </div>

        {/* Vehicle Options */}
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-xs text-[#64748b] gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#557373]" />
              <span>{t.common.loading}</span>
            </div>
          ) : quoteData?.options?.map((opt: any, idx: number) => {
            const isSelected = selectedVehicle === opt.vehicle_type;
            return (
              <div
                key={idx}
                onClick={() => setSelectedVehicle(opt.vehicle_type)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#557373]/15 border-[#557373] text-[#0d0d0d] shadow-sm'
                    : 'bg-[#f2efea]/40 border-[#557373]/20 text-[#0d0d0d] hover:border-[#557373]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#557373] text-white'
                        : 'bg-[#dfe5f3] text-[#557373]'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{opt.vehicle_type}</span>
                      {opt.vehicle_type === quoteData.recommended_vehicle && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#557373] text-white">
                          ★ Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#64748b] mt-0.5">
                      Base: ₹{opt.base_rate} · Rate: ₹{opt.rate_per_km}/km · Cap: {opt.capacity_quintals} Qtl
                    </div>
                    {opt.description && (
                      <div className="text-[10px] text-[#64748b] italic line-clamp-1">
                        {opt.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-[#557373]">
                    ₹{opt.estimated_cost.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#64748b]">
                    ₹{(opt.estimated_cost / load).toFixed(1)}/Qtl freight
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#557373]/15">
          <div className="text-xs">
            <span className="text-[#64748b] block">{t.transporter.payout}:</span>
            <span className="font-black text-base text-[#0d0d0d]">
              ₹
              {quoteData?.options
                ?.find((o: any) => o.vehicle_type === selectedVehicle)
                ?.estimated_cost?.toLocaleString('en-IN') || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748b] hover:bg-[#dfe5f3]/50 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              onClick={handleBook}
              disabled={isBooking || !selectedVehicle}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                bookingSuccess
                  ? 'bg-[#557373] text-white'
                  : 'bg-[#557373] hover:bg-[#435c5c] text-white disabled:opacity-50'
              }`}
            >
              {isBooking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.common.loading}</span>
                </>
              ) : bookingSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.common.success}</span>
                </>
              ) : (
                <>
                  <span>{t.transporter.acceptJob}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Freight Payment Modal (PhonePe / Cash) */}
        {showPaymentModal && (
          <RealPaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              onSuccess?.();
              onClose();
            }}
            title="Settle Transporter Freight Payment"
            amount={
              quoteData?.options?.find((o: any) => o.vehicle_type === selectedVehicle)?.estimated_cost ||
              quoteData?.recommended_cost ||
              500
            }
            beneficiaryName={bookedJobData?.transporter_name || 'Assigned Transporter'}
            beneficiarySubtitle={`${selectedVehicle} • Trip ${pickup} to ${drop}`}
            paymentType="farmer_to_transporter"
            transportJobId={bookedJobData?.id}
            onPaymentSuccess={handleFreightPaymentSuccess}
          />
        )}
      </div>
    </div>
  );
};
