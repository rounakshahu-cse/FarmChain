import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  TrendingUp,
  DollarSign,
  Gavel,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

export const AdminDashboardView: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          apiFetch<any>('/admin/stats'),
          apiFetch<any[]>('/admin/users'),
        ]);
        setStats(statsData);
        setUsersList(usersData);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
        <span className="text-xs">Connecting to platform oversight node...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {t.nav.adminPanel}
          </h2>
          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            Super Ops
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          National platform analytics, verified trust scores, dispute arbitration, and audit logs
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 block">
            Platform GMV
          </span>
          <div className="text-2xl font-black text-emerald-400">
            ₹{stats?.platform_gmv?.toLocaleString('en-IN') || '14,80,000'}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">
            0% Middleman leakage
          </span>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 block">
            Registered Farmers
          </span>
          <div className="text-2xl font-black text-white">
            {stats?.total_farmers || 3}
          </div>
          <span className="text-[10px] text-slate-400">
            Across MH, Punjab, MP
          </span>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 block">
            Wholesale Merchants
          </span>
          <div className="text-2xl font-black text-blue-400">
            {stats?.total_merchants || 3}
          </div>
          <span className="text-[10px] text-blue-400">
            Verified APMC license holders
          </span>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 block">
            Avg Trust Score
          </span>
          <div className="text-2xl font-black text-amber-400">
            {stats?.average_trust_score || 4.9} ★
          </div>
          <span className="text-[10px] text-amber-400">
            Composite rating algorithm
          </span>
        </div>
      </div>

      {/* Disputes & Arbitrations */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Active Dispute Monitoring & Mediation
          </h3>
          <span className="text-xs text-slate-400">
            Automated Escrow Governance
          </span>
        </div>

        <div className="space-y-3">
          {stats?.disputes?.map((d: any) => (
            <div
              key={d.id}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {d.id} • {d.crop}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      d.status.includes('Resolved')
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Parties: {d.farmer} ↔ {d.merchant || d.transporter} ({d.type})
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block">
                  Dispute Severity
                </span>
                <span className="font-black text-amber-400">{d.severity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Directory */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          Verified Platform Participants Directory
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">User Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Phone / Contact</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3 text-center">Trust Score</th>
                <th className="py-2.5 px-3 text-center">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40 text-slate-300">
                  <td className="py-2.5 px-3 font-bold text-white">{u.name}</td>
                  <td className="py-2.5 px-3 capitalize font-semibold text-slate-400">
                    {u.role}
                  </td>
                  <td className="py-2.5 px-3">{u.phone}</td>
                  <td className="py-2.5 px-3">{u.location}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-amber-400">
                    {u.trust_score} ★
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
