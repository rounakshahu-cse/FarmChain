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
  Palette,
  Sun,
  Moon,
  Flame,
  Leaf,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import type { AppTheme } from '../../context/ThemeContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
  const { user, demoUsers, switchDemoUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { theme, setTheme, toggleTheme } = useTheme();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'farmer':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'merchant':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'transporter':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'seller':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'admin':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const themes: { id: AppTheme; label: string; desc: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { id: 'pristine-light', label: 'Pristine Light', desc: 'Clean White, Slate & Emerald', icon: Sun, color: 'text-emerald-500' },
    { id: 'obsidian-dark', label: 'Obsidian Dark', desc: 'Deep Charcoal & Neon Mint', icon: Moon, color: 'text-emerald-400' },
    { id: 'sapphire-light', label: 'Sapphire Blue', desc: 'Ocean Blue & Pure White', icon: Sparkles, color: 'text-blue-500' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 p-0.5 shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-gradient-agro">
                {t.appName}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                FarmChain
              </span>
            </div>
            <p className="text-[11px] opacity-75 font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Palette / Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeDropdown(!showThemeDropdown);
                setShowRoleDropdown(false);
                setShowLangDropdown(false);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-card text-xs font-bold hover:border-emerald-500/50 transition-all shadow-sm"
              title="Change Color Theme"
            >
              <Palette className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline text-[11px] font-bold">
                {themes.find((t) => t.id === theme)?.label || 'Theme'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showThemeDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-3xl glass-panel shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-white/10 mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Color Atmosphere
                  </span>
                  <span className="text-[9px] opacity-60">5 Themes</span>
                </div>
                <div className="space-y-1">
                  {themes.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = theme === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setTheme(item.id);
                          setShowThemeDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all ${
                          isCurrent
                            ? 'bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold shadow-sm'
                            : 'hover:bg-white/10 opacity-80 hover:opacity-100 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black truncate">{item.label}</div>
                            <div className="text-[10px] opacity-60 truncate">{item.desc}</div>
                          </div>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Demo Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowLangDropdown(false);
                setShowNotifDropdown(false);
                setShowThemeDropdown(false);
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-card hover:border-emerald-500/50 transition-all text-xs font-medium shadow-sm"
              title={t.nav.switchDemo}
            >
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'}
                alt={user?.name}
                className="w-6 h-6 rounded-full object-cover border border-emerald-500/50"
              />
              <div className="text-left hidden md:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold max-w-[110px] truncate">
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
                <div className="text-[10px] opacity-75 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <span>{user?.trust_score} Trust</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
            </button>

            {/* Persona Switcher Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                      <Layers className="w-3.5 h-3.5" />
                      {t.nav.switchDemo}
                    </span>
                    <span className="text-[10px] opacity-75">5 Personas</span>
                  </div>
                  <p className="text-[11px] opacity-75 mt-0.5">
                    Click any persona to immediately experience their role-based portal.
                  </p>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1">
                  {demoUsers.map((u) => {
                    const isSelected = u.id === user?.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchDemoUser(u.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold'
                            : 'hover:bg-white/10 opacity-85 hover:opacity-100 border border-transparent'
                        }`}
                      >
                        <img
                          src={u.avatar_url}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs truncate">
                              {u.name}
                            </span>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(
                                u.role
                              )}`}
                            >
                              {u.role}
                            </span>
                          </div>
                          <div className="text-[10px] opacity-75 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-0.5 truncate">
                              <MapPin className="w-2.5 h-2.5" />
                              {u.location}
                            </span>
                            <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              {u.trust_score}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowRoleDropdown(false);
                setShowNotifDropdown(false);
                setShowThemeDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-card hover:border-emerald-500/40 text-xs font-semibold transition-all"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="uppercase text-[11px]">
                {language === 'en' ? 'ENG' : language === 'hi' ? 'हिंदी' : 'मराठी'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl glass-panel shadow-2xl p-1.5 z-50">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                    language === 'en'
                      ? 'bg-emerald-500/25 text-emerald-300 font-bold'
                      : 'hover:bg-white/10 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage('hi');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                    language === 'hi'
                      ? 'bg-emerald-500/25 text-emerald-300 font-bold'
                      : 'hover:bg-white/10 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span>हिंदी (Hindi)</span>
                  {language === 'hi' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage('mr');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                    language === 'mr'
                      ? 'bg-emerald-500/25 text-emerald-300 font-bold'
                      : 'hover:bg-white/10 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span>मराठी (Marathi)</span>
                  {language === 'mr' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowRoleDropdown(false);
                setShowLangDropdown(false);
                setShowThemeDropdown(false);
              }}
              className="relative p-2 rounded-xl glass-card hover:border-emerald-500/50 transition-all"
              title={t.nav.notifications}
            >
              <Bell className="w-4 h-4 text-emerald-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-950 shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs">
                      {t.nav.notifications}
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-emerald-400 hover:underline font-bold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1.5">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs opacity-60">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.is_read
                            ? 'bg-white/5 border-white/5 opacity-75'
                            : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-emerald-300">
                            {n.title}
                          </span>
                          <span className="text-[10px] opacity-60 whitespace-nowrap">
                            {n.created_at}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-90 mt-1 leading-relaxed">
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
