import React, { useState } from 'react';
import logo from '../../assets/jayshree-realty-logo.png';
import {
  LayoutDashboard, Users, Building2, Layers, Star, Sparkles, Eye,
  Activity, MapPin, Image as ImageIcon, Settings as SettingsIcon,
  LogOut, Menu, X, ShieldAlert, BarChart3
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

  return (
    <div className="h-screen bg-[#070b19] text-slate-100 font-outfit flex flex-col overflow-hidden">
      {/* Top Navigation Bar - FIXED TOP */}
      <header className="bg-[#090f20] border-b border-[#c5a059]/30 fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 h-[60px] flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#0f172a] text-[#c5a059] border border-[#c5a059]/30 hover:bg-[#1e293b]"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <img src={logo} alt="Jayshree Realty" className="h-9 sm:h-10 w-auto object-contain" />
          <div className="hidden sm:block border-l border-slate-700 pl-4">
            <h1 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide">
              JAYSHREE REALTY <span className="text-[#c5a059]">ENTERPRISE CMS</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Private Real Estate Console</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Database & API: Connected
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Main Layout Container below Fixed Header */}
      <div className="flex-1 flex pt-[60px] relative overflow-hidden h-screen">
        {/* DESKTOP FIXED LEFT SIDEBAR */}
        <aside className="hidden lg:flex w-64 bg-[#0a1022] border-r border-[#c5a059]/20 flex-col justify-between shrink-0 p-4 fixed left-0 top-[60px] bottom-0 h-[calc(100vh-60px)] overflow-y-auto z-30">
          <div className="space-y-1">
            {['Core Dashboard', 'Content Management', 'System & Admin'].map((cat) => (
              <div key={cat} className="space-y-1 pt-2">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                            ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg'
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

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="p-3 bg-[#060a16] rounded-xl border border-slate-800 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
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
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <aside
              className="w-72 bg-[#0a1022] border-r border-[#c5a059]/30 h-full p-4 flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-serif font-bold text-white text-sm">Navigation Menu</div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-400"
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
                                ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg'
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

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
                Jayshree Realty Enterprise CMS
              </div>
            </aside>
          </div>
        )}

        {/* MAIN CONTENT AREA - SCROLLABLE ONLY */}
        <main className="lg:ml-64 flex-1 h-[calc(100vh-60px)] overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
