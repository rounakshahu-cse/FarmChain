import React, { useState } from 'react';
import {
  Sprout,
  Store,
  Truck,
  ShoppingBag,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Stethoscope,
  Bot,
  ArrowRight,
  ShieldCheck,
  Globe,
  Check,
  ChevronDown,
  Lock,
  Phone,
  UserCheck,
  Star,
  MapPin,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const LoginGatewayPage: React.FC = () => {
  const { demoUsers, loginWithRole, switchDemoUser, login, isLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    try {
      await login(phone, password);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    {
      id: 'farmer',
      title: t.roles.farmer,
      tagline: language === 'mr' ? 'थेट बाजारभाव आणि नफा संरक्षण' : language === 'hi' ? 'सीधी बोली और मुनाफा सुरक्षा' : 'Direct Trade & Profit Protection',
      desc: language === 'mr'
        ? 'शेतमाल लिस्ट करा, थेट व्यापाऱ्यांकडून चालू लिलाव बोली मिळवा, बाजारभाव तपासा आणि AI ने पिकांचे रोग ओळखा.'
        : language === 'hi'
        ? 'फसल लिस्ट करें, सीधे व्यापारियों से लाइव बोली पाएं, मंडी भाव की तुलना करें और AI से फसल रोग निदान करें।'
        : 'List harvest lots, receive competitive bids from verified APMC merchants, compare regional mandi rates, and diagnose crop diseases with AI.',
      icon: Sprout,
      color: 'text-[#557373]',
      bgBadge: 'bg-[#dfe5f3] text-[#557373]',
      demoUser: demoUsers.find((u) => u.role === 'farmer'),
      features: [t.nav.liveBidding, t.nav.plantDoctor, t.nav.mandiIntelligence]
    },
    {
      id: 'merchant',
      title: t.roles.merchant,
      tagline: language === 'mr' ? 'थेट शेतीमाल खरेदी आणि लाइव्ह बोली' : language === 'hi' ? 'सीधे किसानों से फसल खरीद' : 'Direct Produce Sourcing & Auctions',
      desc: language === 'mr'
        ? 'विविध मंड्यांमधील प्रमाणित शेतमाल शोधा, पारदर्शक लाइव्ह लिलावात बोली लावा आणि थेट माल खरेदी करा.'
        : language === 'hi'
        ? 'सत्यापित खेतों से ताजा माल खोजें, पारदर्शी लाइव नीलामी में बोली लगाएं और सीधे सौदे पक्के करें।'
        : 'Discover verified farm produce lots across APMCs, submit real-time competitive bids in open auctions, and lock in guaranteed farm-direct supply.',
      icon: Store,
      color: 'text-[#272401]',
      bgBadge: 'bg-[#272401]/10 text-[#272401]',
      demoUser: demoUsers.find((u) => u.role === 'merchant'),
      features: [t.biddingRoom.title, t.merchant.escrowGuaranteed, t.farmer.qualityGrade]
    },
    {
      id: 'transporter',
      title: t.roles.transporter,
      tagline: language === 'mr' ? 'खात्रीशीर भाडे आणि वाहतूक फेऱ्या' : language === 'hi' ? 'किमी आधारित निश्चित किराया' : 'Guaranteed Freight Routes',
      desc: language === 'mr'
        ? 'शेतमाल वाहतुकीचे ऑर्डर्स स्वीकारा, अंतरावर आधारित निश्चित भाडे मिळवा आणि थेट डिलिव्हरी करा.'
        : language === 'hi'
        ? 'सत्यापित कृषि माल ढुलाई के आर्डर स्वीकारें, दूरी के अनुसार तय भाड़ा पाएं और डिलीवरी पूरी करें।'
        : 'Access verified produce freight loads, accept AI-calculated distance-based payout routes, and manage trip status from farm to mandi depot.',
      icon: Truck,
      color: 'text-[#557373]',
      bgBadge: 'bg-[#dfe5f3] text-[#557373]',
      demoUser: demoUsers.find((u) => u.role === 'transporter'),
      features: [t.transporter.routeDetails, t.nav.transporterFleet, t.payments.escrowAssurance]
    },
  ];

  const secondaryRoles = [
    {
      id: 'seller',
      roleKey: 'seller' as const,
      title: t.gateway.kendraTitle,
      desc: t.gateway.kendraDesc,
      icon: ShoppingBag,
      user: demoUsers.find((u) => u.role === 'seller'),
    },
    {
      id: 'admin',
      roleKey: 'admin' as const,
      title: t.gateway.adminTitle,
      desc: t.gateway.adminDesc,
      icon: ShieldAlert,
      user: demoUsers.find((u) => u.role === 'admin'),
    },
  ];

  const projectCapabilities = [
    {
      icon: Sparkles,
      title: t.nav.liveBidding,
      desc: t.biddingRoom.subtitle,
    },
    {
      icon: TrendingUp,
      title: t.nav.mandiIntelligence,
      desc: t.mandi.subtitle,
    },
    {
      icon: Stethoscope,
      title: t.nav.plantDoctor,
      desc: t.disease.subtitle,
    },
    {
      icon: Bot,
      title: t.chatbot.title,
      desc: t.chatbot.subtitle,
    },
  ];

  return (
    <div className="min-h-screen text-[#0d0d0d] relative overflow-hidden flex flex-col justify-between">
      {/* High-Resolution Agricultural Digital Technology Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-30 scale-100 transform-gpu"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      />
      {/* Atmospheric Glassmorphic Overlay for perfect text contrast and visual depth */}
      <div 
        className="fixed inset-0 bg-gradient-to-b from-[#f4f1ec]/88 via-[#f2efea]/78 to-[#ede9e2]/90 backdrop-blur-[2px] -z-20" 
      />

      {/* Ambient Accent Glows */}
      <div className="pointer-events-none fixed -top-40 -left-40 w-[550px] h-[550px] bg-[#557373]/20 rounded-full blur-3xl -z-10 animate-float" />
      <div className="pointer-events-none fixed top-1/2 -right-40 w-[550px] h-[550px] bg-[#272401]/15 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '-2s' }} />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#557373] via-[#435c5c] to-[#272401] p-0.5 shadow-lg shadow-[#557373]/25">
            <div className="w-full h-full bg-[#557373] rounded-[14px] flex items-center justify-center">
              <Sprout className="w-6 h-6 text-[#f2efea]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-gradient-agro drop-shadow-xs">
                {t.appName}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#dfe5f3]/90 text-[#557373] border border-[#557373]/30 backdrop-blur-xs shadow-xs">
                FarmChain
              </span>
            </div>
            <p className="text-xs text-[#557373] font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-[#557373]/25 shadow-sm text-xs font-semibold hover:border-[#557373] hover:bg-white transition-all"
          >
            <Globe className="w-4 h-4 text-[#557373]" />
            <span className="uppercase text-[11px]">
              {language === 'en' ? 'ENG' : language === 'hi' ? 'हिंदी' : 'मराठी'}
            </span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border border-[#557373]/20 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
      </header>

      {/* Main Gateway Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 flex-1 flex flex-col justify-center">
        {/* Project Introduction Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#557373]/30 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#557373]" />
            <span className="text-xs font-extrabold text-[#557373] tracking-wide">
              {t.gateway.heroBadge}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gradient-agro leading-tight drop-shadow-xs">
            {t.gateway.title}
          </h1>

          <p className="text-sm sm:text-base text-[#475569] font-medium leading-relaxed max-w-2xl mx-auto">
            {t.gateway.subheadline}
          </p>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {projectCapabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-sm text-left space-y-1 hover:border-[#557373]/60 hover:bg-white/95 transition-all group"
                >
                  <div className="w-7 h-7 rounded-xl bg-[#dfe5f3]/90 flex items-center justify-center text-[#557373] group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-[#0d0d0d]">{cap.title}</div>
                  <div className="text-[10px] text-[#64748b] leading-snug line-clamp-2">{cap.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role Selection Gateway Section */}
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-2xl font-black text-[#0d0d0d] drop-shadow-2xs">
              {t.gateway.chooseRoleTitle}
            </h2>
            <p className="text-xs text-[#475569] font-semibold">
              {t.gateway.chooseRoleDesc}
            </p>
          </div>

          {/* 3 Primary Role Cards (Farmer, Merchant, Transporter) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {roles.map((r) => {
              const Icon = r.icon;
              const user = r.demoUser;
              const handleEnter = () => {
                if (user) {
                  switchDemoUser(user.id);
                } else {
                  loginWithRole(r.id as any);
                }
              };

              return (
                <div
                  key={r.id}
                  onClick={handleEnter}
                  className="glass-card rounded-3xl p-6 bg-white/85 backdrop-blur-md border border-white/80 flex flex-col justify-between cursor-pointer group shadow-md hover:shadow-2xl hover:bg-white/95 hover:border-[#557373] transition-all relative overflow-hidden active:scale-[0.99]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#dfe5f3]/90 border border-[#557373]/30 flex items-center justify-center text-[#557373] group-hover:scale-110 transition-transform shadow-xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-black/5 shadow-2xs ${r.bgBadge}`}>
                        {r.id}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-[#0d0d0d] group-hover:text-[#557373] transition-colors">
                        {r.title}
                      </h3>
                      <p className="text-[11px] font-bold text-[#557373] mt-0.5">
                        {r.tagline}
                      </p>
                      <p className="text-xs text-[#64748b] mt-2 leading-relaxed">
                        {r.desc}
                      </p>
                    </div>

                    {/* Pre-configured Demo Profile Preview */}
                    {user && (
                      <div className="p-3 rounded-2xl bg-[#f2efea]/80 backdrop-blur-xs border border-[#557373]/20 flex items-center gap-2.5">
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#557373]/30 shadow-2xs"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-[#0d0d0d] truncate">
                            {user.name}
                          </div>
                          <div className="text-[10px] text-[#64748b] flex items-center gap-2">
                            <span className="flex items-center gap-0.5 truncate">
                              <MapPin className="w-2.5 h-2.5 text-[#557373]" />
                              {user.location}
                            </span>
                            <span className="text-[#272401] font-bold">
                              ★ {user.trust_score}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action CTA Button */}
                  <div className="pt-5 mt-4 border-t border-[#557373]/15">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnter();
                      }}
                      className="w-full py-3 rounded-2xl bg-[#557373] group-hover:bg-[#435c5c] hover:bg-[#3b5252] text-white font-extrabold text-xs shadow-md shadow-[#557373]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{t.gateway.enterAs} {r.title}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secondary Roles (Input Kendra & Admin) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2">
            {secondaryRoles.map((sr) => {
              const Icon = sr.icon;
              return (
                <div
                  key={sr.id}
                  onClick={() => {
                    if (sr.user) {
                      switchDemoUser(sr.user.id);
                    } else {
                      loginWithRole(sr.roleKey);
                    }
                  }}
                  className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/80 hover:bg-white/95 hover:border-[#557373] cursor-pointer flex items-center justify-between gap-3 shadow-sm hover:shadow-xl transition-all group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#dfe5f3]/90 flex items-center justify-center text-[#557373] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0d0d0d] group-hover:text-[#557373] transition-colors">
                        {sr.title}
                      </div>
                      <div className="text-[10px] text-[#64748b]">
                        {sr.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#557373] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Manual Phone/Password Login Accordion */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowManualLogin(!showManualLogin)}
            className="text-xs text-[#557373] hover:underline font-extrabold inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#557373]/20 shadow-xs hover:bg-white transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{showManualLogin ? t.gateway.manualLoginHide : t.gateway.manualLoginToggle}</span>
          </button>

          {showManualLogin && (
            <div className="max-w-md mx-auto mt-4 p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-2xl text-left text-xs animate-in fade-in duration-200">
              <h4 className="font-black text-sm text-[#0d0d0d] mb-1">
                {t.gateway.accountSignIn}
              </h4>
              <p className="text-[11px] text-[#64748b] mb-4">
                {t.gateway.accountSignInDesc}
              </p>

              {loginError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-3">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div>
                  <label className="font-bold text-[#0d0d0d] block mb-1">{t.gateway.phoneNumber}</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f2efea]/70 border border-[#557373]/30 text-xs text-[#0d0d0d] focus:outline-none focus:border-[#557373]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#0d0d0d] block mb-1">{t.gateway.password}</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f2efea]/70 border border-[#557373]/30 text-xs text-[#0d0d0d] focus:outline-none focus:border-[#557373]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#557373] hover:bg-[#435c5c] text-white font-extrabold text-xs shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.gateway.authenticating}</span>
                    </>
                  ) : (
                    <span>{t.gateway.loginButton}</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center text-xs text-[#64748b] border-t border-[#557373]/15 mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t.gateway.copyright}</span>
          <span className="text-[11px] text-[#557373] font-semibold">{t.gateway.zeroMiddlemanBadge}</span>
        </div>
      </footer>
    </div>
  );
};
