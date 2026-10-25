import React, { useState, useEffect } from 'react';
import logo from '../../assets/jayshree-realty-logo.png';
import {
  LayoutDashboard, Users, Building2, Layers, Star, Sparkles, Eye,
  Activity, MapPin, Image as ImageIcon, Settings as SettingsIcon,
  LogOut, Menu, X, ShieldAlert, BarChart3, Sun, Moon
} from 'lucide-react';

interface AdminLayoutProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  children
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [adminTheme, setAdminTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('jayshree_admin_theme') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = adminTheme === 'dark' ? 'light' : 'dark';
    setAdminTheme(nextTheme);
    localStorage.setItem('jayshree_admin_theme', nextTheme);
  };

  const navItems = [
    { id: 'overview', label: 'Enterprise Dashboard', icon: LayoutDashboard, category: 'Core Dashboard' },
    { id: 'analytics', label: 'Real Estate Analytics', icon: BarChart3, category: 'Core Dashboard' },
    { id: 'leads', label: 'Lead Management', icon: Users, category: 'Core Dashboard' },
    { id: 'properties', label: 'Property & Project CMS', icon: Building2, category: 'Content Management' },
    { id: 'reviews', label: 'Reviews & Testimonials', icon: Star, category: 'Content Management' },
    { id: 'settings', label: 'Settings & Security', icon: SettingsIcon, category: 'System & Admin' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileDrawerOpen(false);
  };

  const isLight = adminTheme === 'light';

  return (
    <div className={`h-screen font-outfit flex flex-col overflow-hidden transition-colors duration-200 ${
      isLight ? 'admin-light-mode bg-slate-100 text-slate-800' : 'admin-dark-mode bg-[#070b19] text-slate-100'
    }`}>
      {/* Top Navigation Bar - FIXED TOP */}
      <header className={`border-b fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 h-[60px] flex items-center justify-between shadow-xl transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200 shadow-slate-200/50'
          : 'bg-[#090f20] border-[#c5a059]/30'
      }`}>
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className={`lg:hidden p-2 rounded-lg border transition-colors ${
              isLight
                ? 'bg-slate-100 text-[#99732b] border-slate-300 hover:bg-slate-200'
                : 'bg-[#0f172a] text-[#c5a059] border-[#c5a059]/30 hover:bg-[#1e293b]'
            }`}
            aria-label="Toggle Navigation Drawer"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <img src={logo} alt="Jayshree Realty" className="h-9 sm:h-10 w-auto object-contain" />
          <div className={`hidden sm:block border-l pl-4 ${isLight ? 'border-slate-300' : 'border-slate-700'}`}>
            <h1 className={`font-serif text-base sm:text-lg font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
              JAYSHREE REALTY <span className="text-[#c5a059]">ENTERPRISE CMS</span>
            </h1>
            <p className={`text-[10px] uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Private Real Estate Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-xs transition-all ${
              isLight
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight ? <Moon className="w-4 h-4 text-amber-800" /> : <Sun className="w-4 h-4 text-amber-300" />}
            <span className="hidden md:inline">{isLight ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {/* Connected Badge */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            isLight
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
              : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live DB Connected
          </div>

          {/* Logout Button with Confirmation Modal Trigger */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-1.5 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-500/30 text-xs px-3.5 py-1.5 sm:py-2 rounded-xl transition-all font-semibold"
            title="Log out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Main Layout Container below Fixed Header */}
      <div className="flex-1 flex pt-[60px] relative overflow-hidden h-screen">
        {/* DESKTOP FIXED LEFT SIDEBAR */}
        <aside className={`hidden lg:flex w-64 border-r flex-col justify-between shrink-0 p-4 fixed left-0 top-[60px] bottom-0 h-[calc(100vh-60px)] overflow-y-auto z-30 transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
            : 'bg-[#0a1022] border-[#c5a059]/20 text-slate-100'
        }`}>
          <div className="space-y-1">
            {['Core Dashboard', 'Content Management', 'System & Admin'].map((cat) => (
              <div key={cat} className="space-y-1 pt-2">
                <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {cat}
                </div>
                {navItems
                  .filter((item) => item.category === cat)
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[#c5a059] text-white font-bold shadow-md'
                            : isLight
                              ? 'text-slate-600 hover:bg-slate-100'
                              : 'text-slate-300 hover:bg-[#0f1932]'
                        }`}
                      >
                        <Icon className="w-4 h-4" /> {item.label}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>

          <div className={`pt-4 border-t space-y-2 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <div className={`p-3 rounded-xl border text-[11px] space-y-1 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#060a16] border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-slate-500">
                <span>Database Engine</span>
                <span className="text-[#c5a059] font-bold">Supabase PostgreSQL</span>
              </div>
              <div className="text-[10px] text-slate-400">Secure REST API Connectivity</div>
            </div>
          </div>
        </aside>

        {/* MOBILE COLLAPSIBLE DRAWER SIDEBAR */}
        {mobileDrawerOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <aside
              className={`w-72 border-r h-full p-4 flex flex-col justify-between overflow-y-auto ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0a1022] border-[#c5a059]/30 text-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                  <div className="font-serif font-bold text-sm">Navigation Menu</div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {['Core Dashboard', 'Content Management', 'System & Admin'].map((cat) => (
                  <div key={cat} className="space-y-1">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {cat}
                    </div>
                    {navItems
                      .filter((item) => item.category === cat)
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                              isActive
                                ? 'bg-[#c5a059] text-white font-bold shadow-md'
                                : isLight
                                  ? 'text-slate-700 hover:bg-slate-100'
                                  : 'text-slate-300 hover:bg-[#0f1932]'
                            }`}
                          >
                            <Icon className="w-4 h-4" /> {item.label}
                          </button>
                        );
                      })}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center">
                Jayshree Realty Enterprise CMS
              </div>
            </aside>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className={`lg:ml-64 flex-1 h-[calc(100vh-60px)] overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full transition-colors duration-200 ${
          isLight ? 'bg-slate-100 text-slate-800' : 'bg-[#070b19] text-slate-100'
        }`}>
          {children}
        </main>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className={`border rounded-2xl p-6 max-w-md w-full shadow-2xl relative transition-all ${
              isLight
                ? 'bg-white border-slate-300 text-slate-900 shadow-slate-300/60'
                : 'bg-[#0d1527] border-[#c5a059]/50 text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-red-600/10 border border-red-500/30 rounded-xl text-red-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-serif text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Confirm Admin Logout
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Are you sure you want to log out?</p>
              </div>
            </div>

            <p className={`text-xs mb-6 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              You will be safely logged out of Jayshree Realty Enterprise CMS and will need to enter your admin credentials to log back in.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                  isLight
                    ? 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
