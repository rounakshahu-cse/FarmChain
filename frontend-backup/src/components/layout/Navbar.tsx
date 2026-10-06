import React, { useState } from 'react';
import {
  Sprout,
  Globe,
  Bell,
  Check,
  ChevronDown,
  Star,
  Layers,
  MapPin,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'farmer':
        return 'bg-[#557373]/15 text-[#557373] border-[#557373]/30';
      case 'merchant':
        return 'bg-[#272401]/10 text-[#272401] border-[#272401]/25';
      case 'transporter':
        return 'bg-[#dfe5f3] text-[#557373] border-[#557373]/30';
      case 'seller':
        return 'bg-[#dfe5f3] text-[#272401] border-[#272401]/30';
      case 'admin':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#557373]/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#557373] via-[#435c5c] to-[#272401] p-0.5 shadow-md shadow-[#557373]/20 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-[#557373] rounded-[14px] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-[#f2efea] group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-gradient-agro">
                {t.appName}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#dfe5f3] text-[#557373] border border-[#557373]/25">
                FarmChain
              </span>
            </div>
            <p className="text-[11px] text-[#557373] font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Logged-in User Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card text-xs font-medium shadow-xs text-[#0d0d0d] bg-white">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'}
              alt={user?.name}
              className="w-6 h-6 rounded-full object-cover border border-[#557373]/40"
            />
            <div className="text-left hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold max-w-[110px] truncate text-[#0d0d0d]">
                  {user?.name}
                </span>
                <span
                  className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(
                    user?.role
                  )}`}
                >
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Payments / Escrow Shortcut */}
          <button
            onClick={() => setActiveTab('payment-ledger')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-black text-purple-800 transition-all shadow-xs"
            title="Open PhonePe UPI & Escrow Payments Hub"
          >
            <span className="w-5 h-5 rounded-lg bg-[#5f259f] text-white flex items-center justify-center font-bold text-[10px]">
              पे
            </span>
            <span className="hidden sm:inline text-[11px]">{t.nav.paymentsEscrow}</span>
          </button>

          {/* Switch Role / Log Out Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#557373]/25 hover:border-rose-400 text-xs font-semibold text-[#64748b] hover:text-rose-700 hover:bg-rose-50 transition-all shadow-xs"
            title={t.common.switchRole}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{t.common.switchRole}</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-card hover:border-[#557373] text-xs font-semibold transition-all text-[#0d0d0d] bg-white"
            >
              <Globe className="w-4 h-4 text-[#557373]" />
              <span className="uppercase text-[11px]">
                {language === 'en' ? 'ENG' : language === 'hi' ? 'हिंदी' : 'मराठी'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60 text-[#0d0d0d]" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl glass-panel shadow-2xl p-1.5 z-50 border border-[#557373]/20 bg-white">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                    language === 'en'
                      ? 'bg-[#557373]/15 text-[#557373] font-bold'
                      : 'hover:bg-[#dfe5f3]/50 text-[#0d0d0d]'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <Check className="w-3.5 h-3.5 text-[#557373]" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage('hi');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                    language === 'hi'
                      ? 'bg-[#557373]/15 text-[#557373] font-bold'
                      : 'hover:bg-[#dfe5f3]/50 text-[#0d0d0d]'
                  }`}
                >
                  <span>हिंदी (Hindi)</span>
                  {language === 'hi' && <Check className="w-3.5 h-3.5 text-[#557373]" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage('mr');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                    language === 'mr'
                      ? 'bg-[#557373]/15 text-[#557373] font-bold'
                      : 'hover:bg-[#dfe5f3]/50 text-[#0d0d0d]'
                  }`}
                >
                  <span>मराठी (Marathi)</span>
                  {language === 'mr' && <Check className="w-3.5 h-3.5 text-[#557373]" />}
                </button>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowLangDropdown(false);
              }}
              className="relative p-2 rounded-xl glass-card hover:border-[#557373] transition-all text-[#0d0d0d] bg-white"
              title={t.nav.notifications}
            >
              <Bell className="w-4 h-4 text-[#557373]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 border border-[#557373]/20 bg-white">
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#557373]/15 mb-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#557373]" />
                    <span className="font-bold text-xs text-[#0d0d0d]">
                      {t.nav.notifications}
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-[#557373] hover:underline font-bold"
                    >
                      {t.nav.markAllRead}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1.5">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-[#64748b]">
                      {t.nav.noNotifications}
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.is_read
                            ? 'bg-[#dfe5f3]/30 border-[#557373]/15 text-[#64748b]'
                            : 'bg-[#dfe5f3] border-[#557373]/40 text-[#0d0d0d]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-[#557373]">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-[#64748b] whitespace-nowrap">
                            {n.created_at}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#0d0d0d] mt-1 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
