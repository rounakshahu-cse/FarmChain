import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { KrishiSahayakChat } from './components/chatbot/KrishiSahayakChat';
import { LoginGatewayPage } from './features/auth/LoginGatewayPage';

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
import { FarmerTransportersView } from './features/farmer/FarmerTransportersView';
import { PaymentLedgerView } from './features/payment/PaymentLedgerView';
import { SellerInventoryView } from './features/seller/SellerInventoryView';
import { AdminDashboardView } from './features/admin/AdminDashboardView';
import { X, CheckCircle2, Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { latestToast, dismissToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBiddingListingId, setSelectedBiddingListingId] = useState<number | undefined>(undefined);
  const [pesticideSearchQuery, setPesticideSearchQuery] = useState<string>('');

  // Default tab according to role on login
  useEffect(() => {
    if (user) {
      if (user.role === 'merchant') {
        setActiveTab('marketplace');
      } else if (user.role === 'transporter') {
        setActiveTab('transport-jobs');
      } else if (user.role === 'seller') {
        setActiveTab('seller-inventory');
      } else if (user.role === 'admin') {
        setActiveTab('admin-dashboard');
      } else {
        setActiveTab('dashboard');
      }
    }
  }, [user?.id, user?.role]);

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

  // If loading session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f2efea] flex flex-col items-center justify-center text-[#557373] gap-3">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="text-xs font-bold text-[#0d0d0d]">Loading FarmChain Smart Krishi Connect...</span>
      </div>
    );
  }

  // If user is not logged in, show the initial Login & Project Introduction Gateway Page
  if (!user) {
    return <LoginGatewayPage />;
  }

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
        return <TransporterJobsView initialTab="available" />;

      case 'active-trips':
        return <TransporterJobsView initialTab="active" />;

      case 'mandi-intelligence':
        return <MandiIntelligenceView />;

      case 'plant-doctor':
        return <PlantDoctorView onNavigateToPesticides={handleNavigateToPesticides} />;

      case 'pesticide-store':
        return <PesticideStoreView initialSearchQuery={pesticideSearchQuery} />;

      case 'my-orders':
        return <MyOrdersView />;

      case 'farmer-transporters':
        return <FarmerTransportersView />;

      case 'payment-ledger':
        return <PaymentLedgerView />;

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
    <div className="min-h-screen flex flex-col antialiased relative overflow-hidden transition-colors duration-300 bg-[#f2efea]">
      {/* Background Ambient Glow Lights */}
      <div className="pointer-events-none fixed -top-32 -left-32 w-96 h-96 bg-[#557373]/10 rounded-full blur-3xl -z-10 animate-float" />
      <div className="pointer-events-none fixed top-1/3 -right-32 w-96 h-96 bg-[#dfe5f3]/60 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '-2s' }} />
      <div className="pointer-events-none fixed -bottom-32 left-1/4 w-96 h-96 bg-[#272401]/5 rounded-full blur-3xl -z-10" />

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
        <div className="fixed top-20 right-5 z-50 max-w-sm rounded-2xl bg-white/95 border border-[#557373]/40 shadow-2xl backdrop-blur-xl p-4 text-[#0d0d0d] animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#557373]/15 border border-[#557373]/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#557373]" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-[#557373]">
                  {latestToast.title}
                </h4>
                <p className="text-[11px] text-[#0d0d0d] mt-1 leading-relaxed">
                  {latestToast.message}
                </p>
              </div>
            </div>
            <button
              onClick={dismissToast}
              className="text-[#64748b] hover:text-[#0d0d0d] p-1 rounded-lg hover:bg-[#dfe5f3]/50 transition-colors"
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
