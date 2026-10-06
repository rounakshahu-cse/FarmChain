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
  DollarSign
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface TransporterJobsViewProps {
  initialTab?: 'available' | 'active' | 'completed';
}

export const TransporterJobsView: React.FC<TransporterJobsViewProps> = ({ initialTab = 'available' }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [jobs, setJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingJobId, setUpdatingJobId] = useState<number | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const fetchJobs = async () => {
    setIsLoading(true);
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
      await apiFetch(`/transport/jobs/${jobId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: nextStatus }),
      });

      if (nextStatus === 'delivered') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      await fetchJobs();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setUpdatingJobId(null);
    }
  };

  const availableJobs = jobs.filter(
    (j) => j.status === 'available' || j.status === 'requested' || (!j.transporter_id && j.status !== 'delivered')
  );
  const activeTrips = jobs.filter(
    (j) => j.status === 'accepted' || j.status === 'in_transit' || j.status === 'loading'
  );
  const completedTrips = jobs.filter((j) => j.status === 'delivered' || j.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center">
              <Truck className="w-4 h-4 text-[#557373]" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0d0d0d]">
              {t.transporter.title}
            </h2>
          </div>
          <p className="text-xs text-[#64748b] mt-1">
            {t.transporter.subtitle}
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-[#557373]/20 text-xs shadow-xs">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'available'
                ? 'bg-[#557373] text-white shadow-xs'
                : 'text-[#64748b] hover:text-[#0d0d0d]'
            }`}
          >
            {t.transporter.availableLoads} ({availableJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-[#557373] text-white shadow-xs'
                : 'text-[#64748b] hover:text-[#0d0d0d]'
            }`}
          >
            {t.transporter.assignedTrips} ({activeTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-[#557373] text-white shadow-xs'
                : 'text-[#64748b] hover:text-[#0d0d0d]'
            }`}
          >
            {t.transporter.completedTrips} ({completedTrips.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-[#64748b] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#557373]" />
          <span className="text-xs">Loading logistics network...</span>
        </div>
      ) : activeTab === 'available' ? (
        /* Available Leads Board */
        availableJobs.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-[#64748b] border border-[#557373]/20 bg-white">
            <Truck className="w-10 h-10 mx-auto text-[#557373]/50 mb-2" />
            <h4 className="font-bold text-[#0d0d0d]">{t.transporter.noLoadsFound}</h4>
            <p className="text-xs mt-1">
              {t.transporter.subtitle}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableJobs.map((j) => (
              <div
                key={j.id}
                className="glass-card glass-card-hover rounded-3xl p-5 border border-[#557373]/20 space-y-4 bg-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#272401] block">
                      Guaranteed Trip #{j.id}
                    </span>
                    <h3 className="text-base font-black text-[#0d0d0d]">{j.crop_name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#64748b] block font-medium">
                      {t.transporter.payout}
                    </span>
                    <span className="text-lg font-black text-[#557373]">
                      ₹{j.calculated_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/20 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#557373] mt-0.5" />
                    <div>
                      <span className="text-[10px] text-[#64748b] block font-bold">
                        {t.transporter.pickup}
                      </span>
                      <span className="font-semibold text-[#0d0d0d]">
                        {j.pickup_location} (Farmer: {j.farmer_name})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2 border-t border-[#557373]/15">
                    <Navigation className="w-3.5 h-3.5 text-[#272401] mt-0.5" />
                    <div>
                      <span className="text-[10px] text-[#64748b] block font-bold">
                        {t.transporter.drop}
                      </span>
                      <span className="font-semibold text-[#0d0d0d]">
                        {j.drop_location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#64748b]">
                  <span className="flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-[#557373]" />
                    {t.transporter.loadWeight}: <strong className="text-[#0d0d0d]">{j.load_quintals} {t.common.quintal}</strong>
                  </span>
                  <span>
                    {t.transporter.distance}: <strong className="text-[#0d0d0d]">{j.distance_km} km</strong>
                  </span>
                </div>

                <button
                  onClick={() => handleUpdateStatus(j.id, 'accepted')}
                  disabled={updatingJobId === j.id}
                  className="w-full py-2.5 rounded-xl bg-[#557373] hover:bg-[#435c5c] text-white font-extrabold text-xs shadow-md shadow-[#557373]/20 transition-all flex items-center justify-center gap-2"
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
          <div className="glass-card rounded-3xl p-12 text-center text-[#64748b] border border-[#557373]/20 bg-white">
            <CheckCircle2 className="w-10 h-10 mx-auto text-[#557373] mb-2" />
            <h4 className="font-bold text-[#0d0d0d]">{t.transporter.completedTrips}</h4>
            <p className="text-xs mt-1">{t.transporter.noLoadsFound}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTrips.map((j) => (
              <div
                key={j.id}
                className="glass-card rounded-3xl p-6 border border-[#557373]/20 space-y-4 bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#272401]">
                      Active Shipment #{j.id}
                    </span>
                    <h3 className="text-lg font-black text-[#0d0d0d]">{j.crop_name}</h3>
                    <p className="text-xs text-[#64748b]">
                      Farmer: {j.farmer_name} ({j.farmer_phone}) • {j.vehicle_type}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#557373] px-3 py-1.5 rounded-xl bg-[#dfe5f3] border border-[#557373]/30">
                      Payout: ₹{j.calculated_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="p-4 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/20">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-[#0d0d0d]">
                      {t.transporter.routeDetails}:
                    </span>
                    <span className="text-[#272401] font-extrabold uppercase text-[11px]">
                      {j.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        j.status === 'accepted'
                          ? 'bg-[#dfe5f3] border-[#557373] text-[#557373] font-bold'
                          : 'bg-[#557373]/15 border-[#557373]/30 text-[#557373]'
                      }`}
                    >
                      1. {t.transporter.acceptJob}
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border ${
                        j.status === 'in_transit'
                          ? 'bg-[#dfe5f3] border-[#557373] text-[#557373] font-bold animate-pulse-slow'
                          : j.status === 'delivered'
                          ? 'bg-[#557373]/15 border-[#557373]/30 text-[#557373]'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      2. {t.transporter.inTransit}
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border ${
                        j.status === 'delivered'
                          ? 'bg-[#557373] text-white font-bold'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      3. {t.transporter.markDelivered}
                    </div>
                  </div>
                </div>

                {/* Step Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {j.status === 'accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(j.id, 'in_transit')}
                      className="px-5 py-2.5 rounded-xl bg-[#557373] hover:bg-[#435c5c] text-white font-extrabold text-xs shadow-md"
                    >
                      {t.transporter.startTrip} →
                    </button>
                  )}
                  {j.status === 'in_transit' && (
                    <button
                      onClick={() => handleUpdateStatus(j.id, 'delivered')}
                      className="px-5 py-2.5 rounded-xl bg-[#557373] hover:bg-[#435c5c] text-white font-extrabold text-xs shadow-md"
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
              className="glass-card rounded-3xl p-5 border border-[#557373]/20 space-y-3 bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#557373]" />
                  <span className="font-bold text-sm text-[#0d0d0d]">{j.crop_name}</span>
                </div>
                <span className="text-xs font-extrabold text-[#557373]">
                  ₹{j.calculated_price.toLocaleString('en-IN')} {t.transporter.completed}
                </span>
              </div>
              <p className="text-xs text-[#64748b]">
                {j.pickup_location} → {j.drop_location} ({j.distance_km} km)
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
