import React, { useState, useEffect } from 'react';
import {
  Truck,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  MapPin,
  Scale,
  Sparkles,
  ArrowRight,
  Loader2,
  DollarSign,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { SmartTransportModal } from '../../components/transport/SmartTransportModal';
import { RealPaymentModal } from '../../components/payment/RealPaymentModal';

export const FarmerTransportersView: React.FC = () => {
  const { user } = useAuth();
  const [transporters, setTransporters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDirectPayModal, setShowDirectPayModal] = useState(false);

  const fetchTransporters = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<any[]>('/transport/transporters');
      setTransporters(data);
    } catch (err) {
      console.error('Failed to load transporters:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransporters();
  }, []);

  const handleBookDriver = (driver: any) => {
    setSelectedDriver(driver);
    setShowBookingModal(true);
  };

  const handlePayDriverDirect = (driver: any) => {
    setSelectedDriver(driver);
    setShowDirectPayModal(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] shadow-xs">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#0d0d0d]">
                Verified Transporter Fleet Directory
              </h2>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Farmer Exclusive
              </span>
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">
              Connect directly with verified local harvest drivers, compare graduated per-km rates, and pay seamlessly via PhonePe or Cash.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#557373] bg-[#dfe5f3]/80 px-3 py-1.5 rounded-full border border-[#557373]/20 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {transporters.length} Active Local Fleets
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-[#64748b] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#557373]" />
          <span className="text-xs font-bold">Locating active harvest transporters near you...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {transporters.map((driver) => (
            <div
              key={driver.id}
              className="glass-card rounded-3xl p-6 bg-white border border-[#557373]/20 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Top Driver Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373] font-black text-base shadow-xs">
                      {driver.driver_name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-sm text-[#0d0d0d]">{driver.name}</h4>
                        {driver.verified && (
                          <span title="KYC & Vehicle Verified">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#64748b] font-medium">Driver: {driver.driver_name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-black shrink-0">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{driver.rating}</span>
                  </div>
                </div>

                {/* Vehicle Specs & Reg */}
                <div className="p-3 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/15 space-y-1 text-xs">
                  <div className="font-bold text-[#0d0d0d] flex items-center justify-between">
                    <span>{driver.vehicle_type}</span>
                    <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded-md border border-[#557373]/20 text-[#557373]">
                      {driver.vehicle_number}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748b] flex items-center justify-between pt-1">
                    <span>Max Capacity: <strong className="text-[#0d0d0d]">{driver.capacity_quintals} Qtl</strong></span>
                    <span>Trips: <strong className="text-emerald-700">{driver.trips_completed}+</strong></span>
                  </div>
                </div>

                {/* Transparent Rate Box */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-[#dfe5f3]/60 border border-[#557373]/20">
                    <span className="text-[10px] text-[#64748b] block font-semibold">Base Fare</span>
                    <span className="font-black text-sm text-[#557373]">₹{driver.base_fare}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#dfe5f3]/60 border border-[#557373]/20">
                    <span className="text-[10px] text-[#64748b] block font-semibold">Running Rate</span>
                    <span className="font-black text-sm text-[#557373]">₹{driver.rate_per_km}/km</span>
                  </div>
                </div>

                {/* Operating Coverage */}
                <div className="text-[11px] text-[#64748b] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#557373] shrink-0" />
                  <span className="truncate">{driver.operating_districts}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#557373]/10 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${driver.phone}`}
                    className="py-2 rounded-xl bg-[#f2efea] hover:bg-[#dfe5f3] text-[#0d0d0d] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#557373]" />
                    Call Driver
                  </a>
                  <button
                    onClick={() => handlePayDriverDirect(driver)}
                    className="py-2 rounded-xl bg-[#dfe5f3] hover:bg-[#c9d4ea] text-[#557373] font-black text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    Pay Advance
                  </button>
                </div>

                <button
                  onClick={() => handleBookDriver(driver)}
                  className="w-full py-2.5 rounded-xl bg-[#557373] hover:bg-[#435c5c] text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  Book This Vehicle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Smart Transport Modal when booking */}
      {selectedDriver && showBookingModal && (
        <SmartTransportModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          cropName="Produce Harvest"
          loadQuintals={selectedDriver.capacity_quintals > 30 ? 30 : selectedDriver.capacity_quintals}
          pickupLocation="Dindori Farm, Nashik"
          dropLocation="Vashi APMC Market, Navi Mumbai"
          distanceKm={45}
          onSuccess={() => {
            setShowBookingModal(false);
            fetchTransporters();
          }}
        />
      )}

      {/* Direct Payment Modal for Driver */}
      {selectedDriver && showDirectPayModal && (
        <RealPaymentModal
          isOpen={showDirectPayModal}
          onClose={() => setShowDirectPayModal(false)}
          title={`Pay Transporter ${selectedDriver.driver_name}`}
          amount={selectedDriver.base_fare + selectedDriver.rate_per_km * 25}
          beneficiaryName={selectedDriver.driver_name}
          beneficiarySubtitle={`${selectedDriver.vehicle_type} (${selectedDriver.vehicle_number})`}
          paymentType="farmer_to_transporter"
          onPaymentSuccess={() => {
            setShowDirectPayModal(false);
          }}
        />
      )}
    </div>
  );
};
