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
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getNavSections = () => {
    switch (user?.role) {
      case 'farmer':
        return [
          {
            section: 'Direct Trade',
            items: [
              { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
              { id: 'my-listings', label: t.nav.myListings, icon: Sprout },
              { id: 'bidding-room', label: t.nav.liveBidding, icon: Gavel, badge: 'Live', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
              { id: 'my-orders', label: t.nav.myOrders, icon: PackageCheck },
            ]
          },
          {
            section: 'Agri-Intelligence & Tools',
            items: [
              { id: 'mandi-intelligence', label: t.nav.mandiIntelligence, icon: TrendingUp, badge: 'Profits', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
              { id: 'plant-doctor', label: t.nav.plantDoctor, icon: Stethoscope, badge: 'AI', badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/40' },
              { id: 'pesticide-store', label: t.nav.pesticideStore, icon: ShoppingBag },
            ]
          }
        ];
      case 'merchant':
        return [
          {
            section: 'Mandi Discovery',
            items: [
              { id: 'marketplace', label: t.nav.marketplace, icon: Store },
              { id: 'bidding-room', label: t.nav.liveBidding, icon: Gavel, badge: 'Live', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
              { id: 'my-orders', label: t.nav.myOrders, icon: PackageCheck },
              { id: 'mandi-intelligence', label: t.nav.mandiIntelligence, icon: TrendingUp },
            ]
          }
        ];
      case 'transporter':
        return [
          {
            section: 'Smart Logistics',
            items: [
              { id: 'transport-jobs', label: t.transporter.availableLoads, icon: Truck, badge: 'Hot Leads', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
              { id: 'active-trips', label: t.transporter.assignedTrips, icon: PackageCheck },
              { id: 'mandi-intelligence', label: t.nav.mandiIntelligence, icon: TrendingUp },
            ]
          }
        ];
      case 'seller':
        return [
          {
            section: 'Agri-Inputs Marketplace',
            items: [
              { id: 'seller-inventory', label: 'Product Inventory', icon: ShoppingBag },
              { id: 'seller-orders', label: 'Order Fulfillment', icon: PackageCheck },
            ]
          }
        ];
      case 'admin':
        return [
          {
            section: 'Platform Governance',
            items: [
              { id: 'admin-dashboard', label: t.nav.adminPanel, icon: ShieldAlert },
              { id: 'marketplace', label: t.nav.marketplace, icon: Store },
              { id: 'mandi-intelligence', label: t.nav.mandiIntelligence, icon: TrendingUp },
            ]
          }
        ];
      default:
        return [
          {
            section: 'Overview',
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
    <aside className="w-64 shrink-0 hidden md:flex flex-col gap-5 border-r border-emerald-500/10 p-4 min-h-screen">
      {/* Role & Persona Status Widget */}
      <div className="p-3.5 rounded-3xl glass-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Verified Persona
          </span>
          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            {user?.trust_score} Trust
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'}
            alt={user?.name}
            className="w-9 h-9 rounded-2xl object-cover border border-emerald-500/40"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-black truncate">{user?.name}</div>
            <div className="text-[10px] opacity-70 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-2.5 h-2.5 shrink-0 text-emerald-400" />
              <span className="truncate">{user?.location || 'Nashik, MH'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="space-y-5 flex-1">
        {navSections.map((sect, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider opacity-60">
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-950/50 font-bold scale-[1.02]'
                        : 'opacity-80 hover:opacity-100 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : item.badgeColor || 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
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
      <div className="p-3 rounded-2xl glass-card text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-400">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>APMC Live Sync Active</span>
        </div>
        <p className="text-[10px] opacity-70">
          Real-time trade feeds, e-KYC & smart logistics connected
        </p>
      </div>
    </aside>
  );
};
