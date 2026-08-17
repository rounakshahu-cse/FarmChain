import React, { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  Navigation,
  Scale,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  DollarSign,
  Send,
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

export const TransporterJobsView: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available');
  const [updatingJobId, setUpdatingJobId] = useState<number | null>(null);

  const fetchJobs = async () => {
    try {
      const data = await apiFetch<any[]>('/transport/jobs');
      setJobs(data);
    } catch (err) {
      console.error('Failed to load transport jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleUpdateStatus = async (jobId: number, nextStatus: string) => {
    setUpdatingJobId(jobId);
    try {
      await apiFetch(`/transport/jobs/${jobId}/status?new_status=${nextStatus}`, {
        method: 'POST',
      });

      if (nextStatus === 'delivered') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }

      await fetchJobs();
    } catch (err: any) {
      alert(`Error updating trip status: ${err.message}`);
    } finally {
      setUpdatingJobId(null);
    }
  };

  const availableJobs = jobs.filter((j) => j.status === 'available');
  const activeTrips = jobs.filter((j) =>
    ['accepted', 'pickup_done', 'in_transit'].includes(j.status)
  );
  const completedTrips = jobs.filter((j) =>
    ['delivered', 'completed'].includes(j.status)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Truck className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {t.transporter.availableLoads} & Logistics
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Accept verified farm produce transport jobs with guaranteed distance-calculated payouts.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'available'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Available Leads ({availableJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Active Trips ({activeTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Delivered ({completedTrips.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <span className="text-xs">Loading logistics network...</span>
        </div>
      ) : activeTab === 'available' ? (
        /* Available Leads Board */
        availableJobs.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-slate-400 border border-slate-800">
            <Truck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <h4 className="font-bold text-slate-300">No open delivery leads</h4>
            <p className="text-xs mt-1">
              New crop deals finalized by farmers will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableJobs.map((j) => (
              <div
                key={j.id}
                className="glass-card glass-card-hover rounded-3xl p-5 border border-slate-800/80 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-400 block">
                      Guaranteed Trip #{j.id}
                    </span>
                    <h3 className="text-base font-black text-white">{j.crop_name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Guaranteed Payout
                    </span>
                    <span className="text-lg font-black text-emerald-400">
                      ₹{j.calculated_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">
                        Pickup Farm
                      </span>
                      <span className="font-semibold text-slate-200">
                        {j.pickup_location} (Farmer: {j.farmer_name})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2 border-t border-slate-800/80">
                    <Navigation className="w-3.5 h-3.5 text-amber-400 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">
                        Delivery Destination
                      </span>
                      <span className="font-semibold text-slate-200">
                        {j.drop_location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    Load: <strong className="text-slate-200">{j.load_quintals} Qtl</strong>
                  </span>
                  <span>
                    Distance: <strong className="text-slate-200">{j.distance_km} km</strong>
                  </span>
                </div>

                <button
                  onClick={() => handleUpdateStatus(j.id, 'accepted')}
                  disabled={updatingJobId === j.id}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-950/60 transition-all flex items-center justify-center gap-2"
                >
                  {updatingJobId === j.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{t.transporter.acceptJob}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'active' ? (
        /* Active Trips Progress */
        activeTrips.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-slate-400 border border-slate-800">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <h4 className="font-bold text-slate-300">All trips up to date</h4>
            <p className="text-xs mt-1">Accept open loads to start your delivery route.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTrips.map((j) => (
              <div
                key={j.id}
                className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400">
                      Active Shipment #{j.id}
                    </span>
                    <h3 className="text-lg font-black text-white">{j.crop_name}</h3>
                    <p className="text-xs text-slate-400">
                      Farmer: {j.farmer_name} ({j.farmer_phone}) • {j.vehicle_type}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40">
                      Payout: ₹{j.calculated_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-slate-300">
                      Route Status Progression:
                    </span>
                    <span className="text-amber-400 font-extrabold uppercase text-[11px]">
                      {j.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        j.status === 'accepted'
                          ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold'
                          : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      }`}
                    >
                      1. Accepted & Assigned
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border ${
                        j.status === 'in_transit'
                          ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold animate-pulse-slow'
                          : j.status === 'delivered'
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      2. In Transit (On Route)
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border ${
                        j.status === 'delivered'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      3. Delivered & Settled
                    </div>
                  </div>
                </div>

                {/* Step Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {j.status === 'accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(j.id, 'in_transit')}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md"
                    >
                      {t.transporter.startTrip} →
                    </button>
                  )}
                  {j.status === 'in_transit' && (
                    <button
                      onClick={() => handleUpdateStatus(j.id, 'delivered')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md"
                    >
                      {t.transporter.markDelivered} ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Completed Trips History */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedTrips.map((j) => (
            <div
              key={j.id}
              className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-sm text-white">{j.crop_name}</span>
                </div>
                <span className="text-xs font-extrabold text-emerald-400">
                  ₹{j.calculated_price.toLocaleString('en-IN')} Received
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {j.pickup_location} → {j.drop_location} ({j.distance_km} km)
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
