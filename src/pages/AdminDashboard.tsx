import React, { useState, useEffect } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useData } from '../context/DataContext';
import { useLeads } from '../context/LeadContext';
import { AdminLayout } from '../components/admin/AdminLayout';
import { EnterpriseDashboardWidget } from '../components/admin/EnterpriseDashboardWidget';
import { AnalyticsView } from '../components/admin/AnalyticsView';
import { LeadManagementView } from '../components/admin/LeadManagementView';
import { PropertyCMSView } from '../components/admin/PropertyCMSView';
import { ReviewsCMSView } from '../components/admin/ReviewsCMSView';
import { SettingsSecurityView } from '../components/admin/SettingsSecurityView';
import logo from '../assets/jayshree-realty-logo.png';
import { Lock, ShieldAlert, LogOut } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isAdminAuthenticated, loginAdmin, logoutAdmin } = useData();
  const { refreshLeads } = useLeads();

  useEffect(() => {
    if (isAdminAuthenticated) {
      refreshLeads();
    }
  }, [isAdminAuthenticated]);

  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  type AdminTab = 'overview' | 'analytics' | 'leads' | 'properties' | 'reviews' | 'settings';

  const getInitialTab = (): AdminTab => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin/reviews')) return 'reviews';
    if (path.includes('/admin/leads')) return 'leads';
    if (path.includes('/admin/properties')) return 'properties';
    if (path.includes('/admin/analytics')) return 'analytics';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/admin/overview')) return 'overview';

    const stored = localStorage.getItem('jayshree_admin_active_tab') as AdminTab;
    if (['overview', 'analytics', 'leads', 'properties', 'reviews', 'settings'].includes(stored)) {
      return stored;
    }
    return 'overview';
  };

  // Navigation tab state with route persistence
  const [activeTab, setActiveTab] = useState<AdminTab>(getInitialTab);

  // Synchronize route and handle browser Back button safely
  useEffect(() => {
    const syncTabFromUrl = () => {
      const currentTab = getInitialTab();
      setActiveTab(currentTab);
      localStorage.setItem('jayshree_admin_active_tab', currentTab);
      const targetPath = `/admin/${currentTab}`;
      if (window.location.pathname !== targetPath && window.location.pathname.startsWith('/admin')) {
        window.history.replaceState({ tab: currentTab, inAdmin: true }, '', targetPath);
      }
    };

    syncTabFromUrl();

    if (isAdminAuthenticated) {
      // Ensure there's a barrier history entry inside /admin so back button doesn't silently dump user outside
      window.history.pushState({ inAdmin: true, tab: activeTab }, '', window.location.pathname);

      const handlePopState = (e: PopStateEvent) => {
        const path = window.location.pathname.toLowerCase();
        // If back button tries to navigate away from /admin
        if (!path.startsWith('/admin')) {
          // Re-push current admin state so session doesn't accidentally terminate
          window.history.pushState({ inAdmin: true, tab: activeTab }, '', `/admin/${activeTab}`);
          setShowBackConfirm(true);
        } else {
          syncTabFromUrl();
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [isAdminAuthenticated, activeTab]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    localStorage.setItem('jayshree_admin_active_tab', tab);
    const targetPath = `/admin/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab, inAdmin: true }, '', targetPath);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const success = await loginAdmin(loginUser, loginPass);
      if (!success) {
        setLoginError('Invalid username or password.');
      } else {
        // Set clean admin URL on login
        window.history.replaceState({ inAdmin: true, tab: 'overview' }, '', '/admin/overview');
      }
    } catch (err) {
      setLoginError('Invalid username or password.');
    } finally {
      setLoggingIn(false);
    }
  };

  // 1. ISOLATED PRIVATE LOGIN SCREEN (No website components exposed)
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b19] flex items-center justify-center p-4 font-outfit">
        <SEOHead title="Private Admin Login | Jayshree Realty" description="Secure Enterprise Admin Portal Login" />

        <div className="w-full max-w-md bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Jayshree Realty"
              className="h-14 mx-auto object-contain mb-3"
            />
            <h1 className="font-serif text-2xl font-bold text-white">Private Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Authorized Jayshree Realty Management</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3.5 bg-red-950/70 border border-red-500/50 rounded-xl text-red-300 text-xs font-semibold leading-relaxed text-center flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Username / Email
              </label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="Enter credentials"
                className="w-full bg-[#070b19] border border-slate-700 focus:border-[#c5a059] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#070b19] border border-slate-700 focus:border-[#c5a059] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full btn-gold py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" /> {loggingIn ? 'Authenticating...' : 'Secure Admin Access'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800/80 pt-4">
            <span className="text-[11px] text-slate-400 font-mono">
              Jayshree Realty Enterprise CMS v2.4 (Encrypted Session)
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN CONSOLE
  return (
    <>
      <AdminLayout activeTab={activeTab} setActiveTab={(tab: any) => handleTabChange(tab)} onLogout={logoutAdmin}>
        {activeTab === 'overview' && <EnterpriseDashboardWidget onNavigateTab={(tab: any) => handleTabChange(tab)} />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'leads' && <LeadManagementView />}
        {activeTab === 'properties' && <PropertyCMSView />}
        {activeTab === 'reviews' && <ReviewsCMSView />}
        {activeTab === 'settings' && <SettingsSecurityView />}
      </AdminLayout>

      {/* Browser Back Navigation Protection Modal */}
      {showBackConfirm && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowBackConfirm(false)}
        >
          <div
            className="bg-[#0d1527] border border-[#c5a059]/50 rounded-2xl p-6 max-w-md w-full shadow-2xl relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-red-600/10 border border-red-500/30 rounded-xl text-red-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Confirm Admin Navigation
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">You pressed the browser back button</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Do you want to log out of the Admin Console and return to the main website, or stay in your current session?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBackConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Stay in Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBackConfirm(false);
                  logoutAdmin();
                  window.location.href = '/';
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout & Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
