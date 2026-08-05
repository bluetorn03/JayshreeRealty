import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useData } from '../context/DataContext';
import { AdminLayout } from '../components/admin/AdminLayout';
import { EnterpriseDashboardWidget } from '../components/admin/EnterpriseDashboardWidget';
import { AnalyticsView } from '../components/admin/AnalyticsView';
import { LeadManagementView } from '../components/admin/LeadManagementView';
import { PropertyCMSView } from '../components/admin/PropertyCMSView';
import { ReviewsCMSView } from '../components/admin/ReviewsCMSView';
import { SettingsSecurityView } from '../components/admin/SettingsSecurityView';
import logo from '../assets/jayshree-realty-logo.png';
import { Lock, ShieldAlert } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isAdminAuthenticated, loginAdmin, logoutAdmin } = useData();

  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

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

  React.useEffect(() => {
    const syncTabFromUrl = () => {
      const currentTab = getInitialTab();
      setActiveTab(currentTab);
      localStorage.setItem('jayshree_admin_active_tab', currentTab);
      const targetPath = `/admin/${currentTab}`;
      if (window.location.pathname !== targetPath) {
        window.history.replaceState({ tab: currentTab }, '', targetPath);
      }
    };

    syncTabFromUrl();
    window.addEventListener('popstate', syncTabFromUrl);
    return () => window.removeEventListener('popstate', syncTabFromUrl);
  }, []);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    localStorage.setItem('jayshree_admin_active_tab', tab);
    const targetPath = `/admin/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, '', targetPath);
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
    <AdminLayout activeTab={activeTab} setActiveTab={(tab: any) => handleTabChange(tab)} onLogout={logoutAdmin}>
      {activeTab === 'overview' && <EnterpriseDashboardWidget onNavigateTab={(tab: any) => handleTabChange(tab)} />}
      {activeTab === 'analytics' && <AnalyticsView />}
      {activeTab === 'leads' && <LeadManagementView />}
      {activeTab === 'properties' && <PropertyCMSView />}
      {activeTab === 'reviews' && <ReviewsCMSView />}
      {activeTab === 'settings' && <SettingsSecurityView />}
    </AdminLayout>
  );
};

export default AdminDashboard;
