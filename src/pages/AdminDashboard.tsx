import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useLeads } from '../context/LeadContext';
import { useData } from '../context/DataContext';
import { PropertyItem, GoogleReviewItem } from '../types';
import {
  LayoutDashboard, Users, Building2, Home as HomeIcon, Star, Image as ImageIcon, Settings, 
  BarChart3, Search, Download, Trash2, Phone, MessageSquare, 
  CheckCircle2, Clock, Filter, Eye, ShieldCheck, Sparkles, Plus, Edit3, Lock, LogOut, FileText, Check, X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { leads, updateLeadStatus, deleteLead } = useLeads();
  const {
    projects, reviews, heroSettings, popupSettings, adminCredentials,
    isAdminAuthenticated, loginAdmin, logoutAdmin, updateAdminCredentials,
    addProject, updateProject, deleteProject, toggleProjectFeatured,
    addReview, updateReview, deleteReview, updateHeroSettings, updatePopupSettings
  } = useData();

  // Login state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active tab state
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'leads' | 'projects' | 'reviews' | 'hero' | 'popup' | 'analytics' | 'settings'
  >('dashboard');

  // Lead filters & notes
  const [leadFilterTab, setLeadFilterTab] = useState<'All' | 'New' | 'Today' | 'Upcoming' | 'Contacted' | 'Closed'>('All');
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [leadNotes, setLeadNotes] = useState<{ [id: string]: string }>({});

  // Project Modal / Form State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<PropertyItem>>({
    title: '',
    category: 'Kharghar New Projects',
    location: '',
    type: 'New Launch',
    configuration: '2 & 3 BHK',
    price: '₹ 75 Lakhs*',
    area: '650 - 1100 Sq.Ft.',
    possession: 'Possession Dec 2026',
    brokerage: '0% Brokerage',
    brokerageFree: true,
    published: true,
    isFeatured: true,
    features: ['Rooftop Amenities', 'Podium Parking', '24/7 Security'],
    highlights: 'Near station & upcoming airport hub.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000'
  });

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState<Partial<GoogleReviewItem>>({
    author: '',
    rating: 5,
    timeAgo: '1 week ago',
    content: '',
    avatarColor: '#c5a059',
    verified: true,
    reviewsCount: 'Local Guide'
  });

  // Settings State
  const [newAdminUser, setNewAdminUser] = useState(adminCredentials.username);
  const [newAdminPass, setNewAdminPass] = useState(adminCredentials.passwordHash);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(loginUser, loginPass);
    if (!success) {
      setLoginError('Invalid Username or Password! Default: admin@jayshreerealty / jayshreerealty@8989');
    } else {
      setLoginError('');
    }
  };

  // Filtered Leads logic
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      l.phone.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      (l.email && l.email.toLowerCase().includes(leadSearchQuery.toLowerCase())) ||
      (l.preferredArea && l.preferredArea.toLowerCase().includes(leadSearchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (leadFilterTab === 'New') return l.status === 'New';
    if (leadFilterTab === 'Contacted') return l.status === 'Contacted';
    if (leadFilterTab === 'Closed') return l.status === 'Closed';
    if (leadFilterTab === 'Today') return l.timestamp && l.timestamp.includes(new Date().toISOString().slice(0, 10));
    if (leadFilterTab === 'Upcoming') return l.status === 'Follow-up';

    return true;
  });

  // Export CSV
  const exportLeadsCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Requirement', 'Budget', 'Area', 'Property Type', 'Message', 'Lead Source', 'CTA Source', 'Page', 'Timestamp', 'Status'];
    const rows = leads.map(l => [
      l.id, l.name, l.phone, l.email || '', l.requirement || '', l.budget || '', l.preferredArea || '', l.propertyType || '',
      `"${(l.message || '').replace(/"/g, '""')}"`, l.lead_source, l.cta_source, l.page_name, l.timestamp, l.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Jayshree_Realty_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Save Project
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.location) return;

    if (editingProjectId) {
      updateProject(editingProjectId, projectForm);
    } else {
      addProject(projectForm as Omit<PropertyItem, 'id'>);
    }
    setIsProjectModalOpen(false);
    setEditingProjectId(null);
  };

  // Handle Save Review
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author || !reviewForm.content) return;
    addReview(reviewForm as Omit<GoogleReviewItem, 'id'>);
    setIsReviewModalOpen(false);
  };

  // Handle Credentials Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminCredentials(newAdminUser, newAdminPass);
    setSettingsSuccess('Admin credentials updated successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  // IF NOT AUTHENTICATED: Show Private Secure Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b19] flex items-center justify-center p-4 font-outfit">
        <SEOHead title="Private Admin Login | Jayshree Realty" description="Secure Admin Portal Login" />

        <div className="w-full max-w-md bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8">
            <img
              src="/images/jayshree-realty-logo.png"
              alt="Jayshree Realty"
              className="h-14 mx-auto object-contain mb-3"
            />
            <h1 className="font-serif text-2xl font-bold text-white">Private Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Authorized Jayshree Realty Executives Only</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs leading-relaxed">
              {loginError}
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
                placeholder="admin@jayshreerealty"
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

            <button type="submit" className="btn-gold w-full py-3.5 text-sm font-bold shadow-xl tracking-wider uppercase mt-2">
              <Lock className="w-4 h-4 mr-1.5" /> SECURE LOGIN
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
            Default Credentials: <strong className="text-slate-300">admin@jayshreerealty</strong> / <strong className="text-slate-300">jayshreerealty@8989</strong>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#050814] pt-24 pb-20 font-outfit text-slate-200">
      <SEOHead
        title="Admin Portal | Enterprise Management Dashboard"
        description="Private Admin Panel for Jayshree Realty projects, property listings, leads, and CMS."
      />

      <div className="container mx-auto px-4">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-gold">Enterprise CMS Engine</span>
              <span className="badge-emerald">Live LocalStorage Synced</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Jayshree Realty <span className="text-gradient-gold">Admin Console</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={exportLeadsCSV} className="btn-outline-gold text-xs px-4 py-2.5 flex items-center gap-2">
              <Download className="w-4 h-4" /> Export CSV Leads ({leads.length})
            </button>

            <button
              onClick={logoutAdmin}
              className="px-4 py-2.5 rounded-lg bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Layout Grid: Sidebar Tabs + Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-1.5 bg-glass p-3.5 rounded-2xl border border-slate-800 h-fit">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'leads', label: `Lead Manager (${leads.length})`, icon: Users, badge: leads.filter(l => l.status === 'New').length },
              { id: 'projects', label: `Projects CMS (${projects.length})`, icon: Building2 },
              { id: 'reviews', label: `Reviews CMS (${reviews.length})`, icon: Star },
              { id: 'hero', label: 'Hero & Typewriter CMS', icon: Sparkles },
              { id: 'popup', label: 'Popup Form CMS', icon: Eye },
              { id: 'analytics', label: 'Analytics & Traffic', icon: BarChart3 },
              { id: 'settings', label: 'Admin Settings & Security', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-md'
                      : 'text-slate-300 hover:bg-[#1c2541] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-[#070b19] text-[#c5a059]' : 'bg-[#10b981] text-white'}`}>
                      {tab.badge} New
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Workspace Area */}
          <div className="lg:col-span-9 space-y-6">

            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-glass p-5 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-xs font-medium block">Total Captured Leads</span>
                    <span className="font-serif text-3xl font-bold text-white block mt-1">{leads.length}</span>
                    <span className="text-[11px] text-[#10b981] font-semibold mt-1 block">Live localStorage synced</span>
                  </div>

                  <div className="bg-glass p-5 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-xs font-medium block">New Pending Leads</span>
                    <span className="font-serif text-3xl font-bold text-gradient-gold block mt-1">
                      {leads.filter(l => l.status === 'New').length}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">Requires immediate callback</span>
                  </div>

                  <div className="bg-glass p-5 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-xs font-medium block">Active Projects Listed</span>
                    <span className="font-serif text-3xl font-bold text-white block mt-1">{projects.length}</span>
                    <span className="text-[11px] text-slate-400 block mt-1">Across 8 Navi Mumbai Nodes</span>
                  </div>

                  <div className="bg-glass p-5 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-xs font-medium block">Google Reviews Rating</span>
                    <span className="font-serif text-3xl font-bold text-white block mt-1">4.8 ★</span>
                    <span className="text-[11px] text-slate-400 block mt-1">{reviews.length} Verified Reviews</span>
                  </div>
                </div>

                {/* Recent Submissions */}
                <div className="bg-glass p-6 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg font-bold text-white">Recent Submissions</h3>
                    <button onClick={() => setActiveTab('leads')} className="text-xs text-[#c5a059] hover:underline font-semibold">
                      View Lead Manager →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#070b19] text-slate-400 uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="p-3">Client Name</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Requirement</th>
                          <th className="p-3">Area & Budget</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {leads.slice(0, 5).map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-900/50">
                            <td className="p-3 font-semibold text-white">{lead.name}</td>
                            <td className="p-3 text-slate-300 font-mono">{lead.phone}</td>
                            <td className="p-3 text-[#e5c178]">{lead.requirement} ({lead.propertyType})</td>
                            <td className="p-3 text-slate-300">{lead.preferredArea} • {lead.budget}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                lead.status === 'New' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40' :
                                lead.status === 'Contacted' ? 'bg-[#c5a059]/20 text-[#e5c178] border border-[#c5a059]/40' :
                                'bg-slate-800 text-slate-300'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 text-[11px]">{lead.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LEAD MANAGER */}
            {activeTab === 'leads' && (
              <div className="space-y-4 animate-fade-in">
                {/* Filters Bar */}
                <div className="bg-glass p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search leads by client name, phone, area..."
                      value={leadSearchQuery}
                      onChange={(e) => setLeadSearchQuery(e.target.value)}
                      className="w-full bg-[#070b19] border border-slate-700 focus:border-[#c5a059] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {(['All', 'New', 'Today', 'Upcoming', 'Contacted', 'Closed'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setLeadFilterTab(tab)}
                        className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                          leadFilterTab === tab
                            ? 'bg-[#c5a059] text-[#070b19] border-[#c5a059]'
                            : 'bg-[#070b19] text-slate-300 border-slate-700 hover:border-[#c5a059]'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="bg-glass rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#070b19] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Client Info</th>
                          <th className="p-3.5">Requirement</th>
                          <th className="p-3.5">Budget & Location</th>
                          <th className="p-3.5">Source & Page</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-900/60 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-white text-sm">{lead.name}</div>
                              <div className="text-slate-300 font-mono text-[11px]">{lead.phone}</div>
                              {lead.email && <div className="text-slate-400 text-[10px]">{lead.email}</div>}
                            </td>
                            <td className="p-3.5">
                              <div className="font-semibold text-[#e5c178]">{lead.requirement}</div>
                              <div className="text-slate-400 text-[11px]">{lead.propertyType}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="text-slate-200">{lead.budget || 'N/A'}</div>
                              <div className="text-slate-400 text-[11px]">{lead.preferredArea}</div>
                            </td>
                            <td className="p-3.5 text-[11px]">
                              <div className="text-slate-300 font-semibold">{lead.lead_source}</div>
                              <div className="text-slate-500">{lead.cta_source} ({lead.page_name})</div>
                              <div className="text-slate-500 text-[10px]">{lead.timestamp}</div>
                            </td>
                            <td className="p-3.5">
                              <select
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                                className="bg-[#070b19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#c5a059] hover:text-[#070b19] transition-colors"
                                  title="Call Client"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.name)},%20this%20is%20Jayshree%20Realty.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-[#25d366]/20 text-[#25d366] hover:bg-[#25d366] hover:text-white transition-colors"
                                  title="WhatsApp Client"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => deleteLead(lead.id)}
                                  className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROJECTS CMS */}
            {activeTab === 'projects' && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-glass p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Project Listings CMS</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage every property card: Image, Name, Type, Price, Badges, 0% Brokerage toggle, and Publish state.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm({
                        title: '',
                        category: 'Kharghar New Projects',
                        location: '',
                        type: 'New Launch',
                        configuration: '2 & 3 BHK',
                        price: '₹ 75 Lakhs*',
                        area: '650 - 1100 Sq.Ft.',
                        possession: 'Possession Dec 2026',
                        brokerage: '0% Brokerage',
                        brokerageFree: true,
                        published: true,
                        isFeatured: true,
                        features: ['Rooftop Amenities', 'Podium Parking'],
                        highlights: 'Near station & airport.',
                        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000'
                      });
                      setIsProjectModalOpen(true);
                    }}
                    className="btn-gold text-xs px-4 py-2.5 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add New Property
                  </button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-4 rounded-xl bg-[#070b19] border border-slate-800 flex flex-col justify-between space-y-3">
                      <div className="flex gap-3">
                        <img src={proj.image} alt={proj.title} className="w-20 h-20 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-white text-xs truncate">{proj.title}</h4>
                            <button
                              onClick={() => toggleProjectFeatured(proj.id)}
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${proj.isFeatured ? 'bg-[#c5a059] text-[#070b19]' : 'bg-slate-800 text-slate-400'}`}
                            >
                              {proj.isFeatured ? 'Featured' : 'Normal'}
                            </button>
                          </div>
                          <span className="text-[11px] text-[#c5a059] block mt-0.5">{proj.category} • {proj.type}</span>
                          <span className="text-[11px] font-bold text-white">{proj.price} • {proj.configuration}</span>
                          <p className="text-[10px] text-slate-400 truncate">{proj.location}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${proj.brokerageFree ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'}`}>
                            {proj.brokerageFree ? '0% Brokerage Enabled' : 'No 0% Badge'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProjectId(proj.id);
                              setProjectForm(proj);
                              setIsProjectModalOpen(true);
                            }}
                            className="p-1.5 rounded bg-slate-800 hover:bg-[#c5a059] hover:text-[#070b19] transition-colors"
                            title="Edit Property"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProject(proj.id)}
                            className="p-1.5 rounded bg-red-950/50 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                            title="Delete Property"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS CMS */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-glass p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Google Reviews CMS</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage customer testimonials shown in the Home infinite horizontal marquee.</p>
                  </div>
                  <button
                    onClick={() => {
                      setReviewForm({
                        author: '',
                        rating: 5,
                        timeAgo: '1 week ago',
                        content: '',
                        avatarColor: '#c5a059',
                        verified: true,
                        reviewsCount: 'Local Guide'
                      });
                      setIsReviewModalOpen(true);
                    }}
                    className="btn-gold text-xs px-4 py-2.5 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Google Review
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-[#070b19] border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-white">{rev.author} ({rev.rating}★)</div>
                        <button onClick={() => deleteReview(rev.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-slate-300 italic">"{rev.content}"</p>
                      <div className="text-[10px] text-slate-500">{rev.timeAgo} • {rev.reviewsCount || 'Verified Review'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: HERO & TYPEWRITER CMS */}
            {activeTab === 'hero' && (
              <div className="bg-glass p-6 rounded-2xl border border-slate-800 space-y-5 animate-fade-in font-outfit text-xs">
                <h3 className="font-serif text-xl font-bold text-white">Hero & Rotating Typewriter Keywords CMS</h3>
                
                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Heading Part 1</label>
                    <input
                      type="text"
                      value={heroSettings.headingPart1}
                      onChange={(e) => updateHeroSettings({ headingPart1: e.target.value })}
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Heading Gold Accent</label>
                    <input
                      type="text"
                      value={heroSettings.headingGold}
                      onChange={(e) => updateHeroSettings({ headingGold: e.target.value })}
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Hero Background Image URL</label>
                    <input
                      type="text"
                      value={heroSettings.backgroundImage}
                      onChange={(e) => updateHeroSettings({ backgroundImage: e.target.value })}
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Typewriter Rotating Keywords (Comma-separated)</label>
                    <input
                      type="text"
                      value={heroSettings.keywords ? heroSettings.keywords.join(', ') : ''}
                      onChange={(e) => updateHeroSettings({ keywords: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Example: Premium Projects, Buy Property, Sell Property, Verified Properties, Navi Mumbai, Luxury Homes</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: POPUP CMS */}
            {activeTab === 'popup' && (
              <div className="bg-glass p-6 rounded-2xl border border-slate-800 space-y-5 animate-fade-in font-outfit text-xs">
                <h3 className="font-serif text-xl font-bold text-white">Popup Form Modal CMS</h3>

                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Popup Title</label>
                    <input
                      type="text"
                      value={popupSettings.title}
                      onChange={(e) => updatePopupSettings({ title: e.target.value })}
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Popup Subtitle</label>
                    <input
                      type="text"
                      value={popupSettings.subtitle}
                      onChange={(e) => updatePopupSettings({ subtitle: e.target.value })}
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Privacy Note Subtext</label>
                    <input
                      type="text"
                      value={popupSettings.privacyText}
                      onChange={(e) => updatePopupSettings({ privacyText: e.target.value })}
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="bg-glass p-6 rounded-2xl border border-slate-800 space-y-5 animate-fade-in font-outfit text-xs">
                <h3 className="font-serif text-xl font-bold text-white">Traffic & Conversion Analytics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#070b19] p-5 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Total Page Views</span>
                    <div className="font-serif text-3xl font-bold text-white mt-1">2,840</div>
                  </div>
                  <div className="bg-[#070b19] p-5 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Form Conversion Rate</span>
                    <div className="font-serif text-3xl font-bold text-[#10b981] mt-1">5.2%</div>
                  </div>
                  <div className="bg-[#070b19] p-5 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Top Demand Node</span>
                    <div className="font-serif text-2xl font-bold text-[#e5c178] mt-1">Nerul & Kharghar</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: ADMIN SETTINGS & CREDENTIALS */}
            {activeTab === 'settings' && (
              <div className="bg-glass p-6 rounded-2xl border border-slate-800 space-y-5 animate-fade-in font-outfit text-xs">
                <h3 className="font-serif text-xl font-bold text-white">Admin Security Credentials & Settings</h3>

                {settingsSuccess && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl">
                    {settingsSuccess}
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Admin Username / Email</label>
                    <input
                      type="text"
                      required
                      value={newAdminUser}
                      onChange={(e) => setNewAdminUser(e.target.value)}
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Admin Password</label>
                    <input
                      type="text"
                      required
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>

                  <button type="submit" className="btn-gold py-2.5 px-6 font-bold text-xs uppercase">
                    Update Security Credentials
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* PROJECT EDIT / ADD MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto font-outfit text-xs text-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-serif text-lg font-bold text-white">
                {editingProjectId ? 'Edit Property Listing' : 'Add New Property Listing'}
              </h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Project / Property Title *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Location / Sector *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Kharghar New Projects">Kharghar New Projects</option>
                    <option value="Upper Kharghar">Upper Kharghar</option>
                    <option value="Ulwe New Projects">Ulwe New Projects</option>
                    <option value="Pushpak Nagar New Projects">Pushpak Nagar New Projects</option>
                    <option value="Nerul & Seawoods New Projects">Nerul & Seawoods New Projects</option>
                    <option value="Juinagar & Sanpada New Projects">Juinagar & Sanpada New Projects</option>
                    <option value="Panvel">Panvel</option>
                    <option value="Khandeshwar / Kamothe">Khandeshwar / Kamothe</option>
                    <option value="Resale">Resale Listings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Property Type</label>
                  <select
                    value={projectForm.type}
                    onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value as any })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="New Launch">New Launch</option>
                    <option value="Township">Township</option>
                    <option value="Resale">Resale</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Starting Price *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.price}
                    onChange={(e) => setProjectForm({ ...projectForm, price: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Configuration</label>
                  <input
                    type="text"
                    value={projectForm.configuration}
                    onChange={(e) => setProjectForm({ ...projectForm, configuration: e.target.value })}
                    placeholder="e.g. 2 & 3 BHK"
                    className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Carpet Area</label>
                  <input
                    type="text"
                    value={projectForm.area}
                    onChange={(e) => setProjectForm({ ...projectForm, area: e.target.value })}
                    placeholder="e.g. 650 - 1100 Sq.Ft."
                    className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Image URL *</label>
                <input
                  type="text"
                  required
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.brokerageFree ?? true}
                    onChange={(e) => setProjectForm({ ...projectForm, brokerageFree: e.target.checked })}
                    className="rounded text-[#c5a059]"
                  />
                  <span>Show "0% Brokerage" Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.isFeatured ?? true}
                    onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.checked })}
                    className="rounded text-[#c5a059]"
                  />
                  <span>Mark as Featured Project</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold px-6 py-2 text-xs font-bold uppercase">
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW ADD MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-6 w-full max-w-md font-outfit text-xs text-slate-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h3 className="font-serif text-lg font-bold text-white">Add Google Testimonial</h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Review Content *</label>
                <textarea
                  required
                  rows={3}
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-white"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold px-5 py-2 text-xs font-bold uppercase">
                  Add Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
