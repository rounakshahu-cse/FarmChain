import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { KrishiSahayakChat } from './components/chatbot/KrishiSahayakChat';

// Feature Views
import { FarmerOverview } from './features/farmer/FarmerOverview';
import { MyListingsView } from './features/farmer/MyListingsView';
import { LiveBiddingRoom } from './features/farmer/LiveBiddingRoom';
import { MerchantDiscoveryView } from './features/merchant/MerchantDiscoveryView';
import { TransporterJobsView } from './features/transporter/TransporterJobsView';
import { MandiIntelligenceView } from './features/mandi/MandiIntelligenceView';
import { PlantDoctorView } from './features/disease/PlantDoctorView';
import { PesticideStoreView } from './features/pesticides/PesticideStoreView';
import { MyOrdersView } from './features/orders/MyOrdersView';
import { SellerInventoryView } from './features/seller/SellerInventoryView';
import { AdminDashboardView } from './features/admin/AdminDashboardView';
import { X, CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { latestToast, dismissToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBiddingListingId, setSelectedBiddingListingId] = useState<number | undefined>(undefined);
  const [pesticideSearchQuery, setPesticideSearchQuery] = useState<string>('');

  const handleNavigate = (tab: string, initialListingId?: number) => {
    setActiveTab(tab);
    if (initialListingId) {
      setSelectedBiddingListingId(initialListingId);
    }
  };

  const handleNavigateToPesticides = (query?: string) => {
    if (query) {
      setPesticideSearchQuery(query);
    }
    setActiveTab('pesticide-store');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        if (user?.role === 'merchant') {
          return <MerchantDiscoveryView onOpenLiveBidding={(id) => handleNavigate('bidding-room', id)} />;
        }
        if (user?.role === 'transporter') {
          return <TransporterJobsView />;
        }
        if (user?.role === 'seller') {
          return <SellerInventoryView />;
        }
        if (user?.role === 'admin') {
          return <AdminDashboardView />;
        }
        return <FarmerOverview onNavigate={handleNavigate} />;

      case 'my-listings':
        return <MyListingsView onOpenBiddingRoom={(id) => handleNavigate('bidding-room', id)} />;

      case 'marketplace':
        return <MerchantDiscoveryView onOpenLiveBidding={(id) => handleNavigate('bidding-room', id)} />;

      case 'bidding-room':
        return <LiveBiddingRoom initialListingId={selectedBiddingListingId} />;

      case 'transport-jobs':
      case 'active-trips':
        return <TransporterJobsView />;

      case 'mandi-intelligence':
        return <MandiIntelligenceView />;

      case 'plant-doctor':
        return <PlantDoctorView onNavigateToPesticides={handleNavigateToPesticides} />;

      case 'pesticide-store':
        return <PesticideStoreView initialSearchQuery={pesticideSearchQuery} />;

      case 'my-orders':
        return <MyOrdersView />;

      case 'seller-inventory':
      case 'seller-orders':
        return <SellerInventoryView />;

      case 'admin-dashboard':
        return <AdminDashboardView />;

      default:
        return <FarmerOverview onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased relative overflow-hidden transition-colors duration-300">
      {/* Background Ambient Glow Lights */}
      <div className="pointer-events-none fixed -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-float" />
      <div className="pointer-events-none fixed top-1/3 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '-2s' }} />
      <div className="pointer-events-none fixed -bottom-32 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

      {/* Top Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Real-time Toast Notification */}
      {latestToast && (
        <div className="fixed top-20 right-5 z-50 max-w-sm rounded-2xl bg-emerald-950/95 border border-emerald-500/60 shadow-2xl backdrop-blur-xl p-4 text-white animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-emerald-300">
                  {latestToast.title}
                </h4>
                <p className="text-[11px] text-slate-200 mt-1 leading-relaxed">
                  {latestToast.message}
                </p>
              </div>
            </div>
            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Krishi Sahayak Chatbot */}
      <KrishiSahayakChat />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
