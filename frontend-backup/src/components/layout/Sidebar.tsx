import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  Store,
  Gavel,
  Truck,
  TrendingUp,
  Stethoscope,
  ShoppingBag,
  PackageCheck,
  ShieldAlert,
  Sparkles,
  Radio,
  MapPin,
  Star,
  LogOut,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();

  const getNavSections = () => {
    switch (user?.role) {
      case 'farmer':
        return [
          {
            section: language === 'mr' ? 'थेट शेतकरी व्यापार' : language === 'hi' ? 'सीधा किसान व्यापार' : 'Direct Trade',
            items: [
              { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
              { id: 'my-listings', label: t.nav.myListings, icon: Sprout },
              { id: 'bidding-room', label: t.nav.liveBidding, icon: Gavel, badge: 'Live', badgeColor: 'bg-rose-100 text-rose-700 border-rose-200' },
              { id: 'my-orders', label: t.nav.myOrders, icon: PackageCheck },
              { id: 'payment-ledger', label: t.nav.paymentsEscrow, icon: Smartphone, badge: 'PhonePe', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' },
              { id: 'farmer-transporters', label: t.nav.transporterFleet, icon: Truck, badge: 'Low Rates', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
            ]
          },
          {
            section: language === 'mr' ? 'कृषी तंत्रज्ञान व साधने' : language === 'hi' ? 'कृषि तकनीकी व उपकरण' : 'Agri-Intelligence & Tools',
            items: [
              { id: 'mandi-intelligence', label: t.nav.mandiIntelligence, icon: TrendingUp, badge: 'Profits', badgeColor: 'bg-[#272401]/10 text-[#272401] border-[#272401]/30' },
              { id: 'plant-doctor', label: t.nav.plantDoctor, icon: Stethoscope, badge: 'AI', badgeColor: 'bg-[#dfe5f3] text-[#557373] border-[#557373]/30' },
              { id: 'pesticide-store', label: t.nav.pesticideStore, icon: ShoppingBag },
            ]
          }
        ];
      case 'merchant':
        return [
          {
            section: language === 'mr' ? 'मंडी शेतमाल शोध' : language === 'hi' ? 'मंडी फसल खोज' : 'Mandi Discovery',
            items: [
              { id: 'marketplace', label: t.nav.marketplace, icon: Store },
              { id: 'bidding-room', label: t.nav.liveBidding, icon: Gavel, badge: 'Live', badgeColor: 'bg-rose-100 text-rose-700 border-rose-200' },
              { id: 'my-orders', label: t.nav.myOrders, icon: PackageCheck },
              { id: 'payment-ledger', label: t.nav.paymentsEscrow, icon: Smartphone, badge: 'PhonePe', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' },
              { id: 'mandi-intelligence', label: t.nav.mandiIntelligence, icon: TrendingUp },
            ]
          }
        ];
      case 'transporter':
        return [
          {
            section: language === 'mr' ? 'स्मार्ट मालवाहतूक' : language === 'hi' ? 'स्मार्ट माल ढुलाई' : 'Smart Logistics',
            items: [
              { id: 'transport-jobs', label: t.transporter.availableLoads, icon: Truck, badge: 'Hot Leads', badgeColor: 'bg-[#dfe5f3] text-[#557373] border-[#557373]/30' },
              { id: 'active-trips', label: t.transporter.assignedTrips, icon: PackageCheck },
              { id: 'payment-ledger', label: t.nav.paymentsEscrow, icon: Smartphone, badge: 'Instant', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
              { id: 'mandi-intelligence', label: t.nav.mandiIntelligence, icon: TrendingUp },
            ]
          }
        ];
      case 'seller':
        return [
          {
            section: language === 'mr' ? 'कृषी सेवा केंद्र' : language === 'hi' ? 'कृषि सेवा केंद्र' : 'Agri-Inputs Marketplace',
            items: [
              { id: 'seller-inventory', label: t.nav.sellerInventory, icon: ShoppingBag },
              { id: 'seller-orders', label: t.nav.sellerOrders, icon: PackageCheck },
              { id: 'payment-ledger', label: t.nav.paymentsEscrow, icon: Smartphone, badge: 'UPI', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
            ]
          }
        ];
      case 'admin':
        return [
          {
            section: language === 'mr' ? 'मंच प्रशासन व नियमन' : language === 'hi' ? 'मंच प्रशासन व नियंत्रण' : 'Platform Governance',
            items: [
              { id: 'admin-dashboard', label: t.nav.adminPanel, icon: ShieldAlert },
              { id: 'payment-ledger', label: t.nav.paymentsEscrow, icon: Smartphone, badge: 'Audit', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' },
              { id: 'marketplace', label: t.nav.marketplace, icon: Store },
              { id: 'mandi-intelligence', label: t.nav.mandiIntelligence, icon: TrendingUp },
            ]
          }
        ];
      default:
        return [
          {
            section: language === 'mr' ? 'मुख्य विभाग' : language === 'hi' ? 'मुख्य विभाग' : 'Overview',
            items: [
              { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
              { id: 'marketplace', label: t.nav.marketplace, icon: Store },
            ]
          }
        ];
    }
  };

  const navSections = getNavSections();

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col gap-5 border-r border-[#557373]/15 p-4 min-h-screen">
      {/* Role & Persona Status Widget */}
      <div className="p-3.5 rounded-3xl glass-card relative overflow-hidden group border border-[#557373]/20 shadow-sm bg-white">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#dfe5f3]/60 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#557373] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {t.nav.verifiedPersona}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-[#272401] font-bold bg-[#dfe5f3] px-2 py-0.5 rounded-full border border-[#557373]/20">
            <Star className="w-2.5 h-2.5 fill-[#272401]" />
            {user?.trust_score} {t.nav.trustScore}
          </div>
        </div>

        <div className="flex items-center gap-2.5 mb-2.5">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'}
            alt={user?.name}
            className="w-9 h-9 rounded-2xl object-cover border border-[#557373]/40"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-black truncate text-[#0d0d0d]">{user?.name}</div>
            <div className="text-[10px] text-[#64748b] flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-2.5 h-2.5 shrink-0 text-[#557373]" />
              <span className="truncate">{user?.location || 'Nashik, MH'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-1.5 px-2.5 rounded-xl bg-[#f2efea] hover:bg-[#dfe5f3] text-[11px] font-semibold text-[#557373] hover:text-[#0d0d0d] transition-colors flex items-center justify-center gap-1.5 border border-[#557373]/20 cursor-pointer"
        >
          <LogOut className="w-3 h-3" />
          <span>{t.common.switchRole}</span>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="space-y-5 flex-1">
        {navSections.map((sect, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#557373]/80">
              {sect.section}
            </div>
            <nav className="space-y-1">
              {sect.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#557373] to-[#435c5c] text-white shadow-md shadow-[#557373]/25 font-bold scale-[1.02]'
                        : 'text-[#0d0d0d] opacity-80 hover:opacity-100 hover:bg-[#dfe5f3]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#557373]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : item.badgeColor || 'bg-[#dfe5f3] text-[#557373] border-[#557373]/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Live Market Connection Status Widget */}
      <div className="p-3 rounded-2xl glass-card text-center space-y-1 border border-[#557373]/20 bg-white">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#557373]">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>{t.nav.apmcLiveSync}</span>
        </div>
        <p className="text-[10px] text-[#64748b]">
          {t.nav.apmcSyncDesc}
        </p>
      </div>
    </aside>
  );
};
