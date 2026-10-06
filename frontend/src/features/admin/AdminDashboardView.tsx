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
      <div className="py-24 flex flex-col items-center justify-center text-[#64748b] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
        <span className="text-xs">{t.common.loading}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-rose-700" />
          </div>
          <h2 className="text-xl font-extrabold text-[#0d0d0d]">
            {t.nav.adminPanel}
          </h2>
          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
            Super Ops
          </span>
        </div>
        <p className="text-xs text-[#64748b] mt-1">
          {t.admin.subtitle}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-[#557373]/20 space-y-1 bg-white">
          <span className="text-xs font-bold text-[#64748b] block">
            {t.admin.escrowVolume}
          </span>
          <div className="text-2xl font-black text-[#557373]">
            ₹{stats?.platform_gmv?.toLocaleString('en-IN') || '14,80,000'}
          </div>
          <span className="text-[10px] text-[#557373] font-medium">
            0% Middleman leakage
          </span>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-[#557373]/20 space-y-1 bg-white">
          <span className="text-xs font-bold text-[#64748b] block">
            {t.roles.farmer}
          </span>
          <div className="text-2xl font-black text-[#0d0d0d]">
            {stats?.total_farmers || 3}
          </div>
          <span className="text-[10px] text-[#64748b]">
            Across MH, Punjab, MP
          </span>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-[#557373]/20 space-y-1 bg-white">
          <span className="text-xs font-bold text-[#64748b] block">
            {t.roles.merchant}
          </span>
          <div className="text-2xl font-black text-[#272401]">
            {stats?.total_merchants || 3}
          </div>
          <span className="text-[10px] text-[#272401]">
            Verified APMC license holders
          </span>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-[#557373]/20 space-y-1 bg-white">
          <span className="text-xs font-bold text-[#64748b] block">
            {t.nav.trustScore}
          </span>
          <div className="text-2xl font-black text-[#272401]">
            {stats?.average_trust_score || 4.9} ★
          </div>
          <span className="text-[10px] text-[#272401]">
            Composite rating algorithm
          </span>
        </div>
      </div>

      {/* Disputes & Arbitrations */}
      <div className="glass-card rounded-3xl p-6 border border-[#557373]/20 space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#0d0d0d] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#272401]" />
            {t.admin.disputeManagement}
          </h3>
          <span className="text-xs text-[#64748b]">
            {t.payments.escrowAssurance}
          </span>
        </div>

        <div className="space-y-3">
          {stats?.disputes?.map((d: any) => (
            <div
              key={d.id}
              className="p-4 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0d0d0d] text-sm">
                    {d.id} • {d.crop}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      d.status.includes('Resolved')
                        ? 'bg-[#dfe5f3] text-[#557373] border border-[#557373]/30'
                        : 'bg-[#272401]/10 text-[#272401] border border-[#272401]/25'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <p className="text-[#64748b] text-[11px] mt-1">
                  Parties: {d.farmer} ↔ {d.merchant || d.transporter} ({d.type})
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-[#64748b] block">
                  Dispute Severity
                </span>
                <span className="font-black text-[#272401]">{d.severity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Directory */}
      <div className="glass-card rounded-3xl p-6 border border-[#557373]/20 space-y-4 bg-white">
        <h3 className="font-extrabold text-base text-[#0d0d0d] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#557373]" />
          {t.admin.userRegistry}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#557373]/15 text-[#64748b] text-[10px] uppercase">
                <th className="py-2.5 px-3">{t.gateway.enterAs}</th>
                <th className="py-2.5 px-3">{t.common.status}</th>
                <th className="py-2.5 px-3">{t.common.phone}</th>
                <th className="py-2.5 px-3">{t.common.location}</th>
                <th className="py-2.5 px-3 text-center">{t.nav.trustScore}</th>
                <th className="py-2.5 px-3 text-center">{t.common.verified}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#557373]/10">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-[#dfe5f3]/30 text-[#0d0d0d]">
                  <td className="py-2.5 px-3 font-bold text-[#0d0d0d]">{u.name}</td>
                  <td className="py-2.5 px-3 capitalize font-semibold text-[#64748b]">
                    {u.role}
                  </td>
                  <td className="py-2.5 px-3">{u.phone}</td>
                  <td className="py-2.5 px-3">{u.location}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#272401]">
                    {u.trust_score} ★
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dfe5f3] text-[#557373] border border-[#557373]/30">
                      {t.common.verified}
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
