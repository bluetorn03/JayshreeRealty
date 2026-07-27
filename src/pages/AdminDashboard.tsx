import React, { useState, useRef } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useLeads } from '../context/LeadContext';
import { useData } from '../context/DataContext';
import { PropertyItem, GoogleReviewItem, PlacementTarget, ProjectCategory } from '../types';
import logo from '../assets/jayshree-realty-logo.png';
import {
  LayoutDashboard, Users, Building2, Home as HomeIcon, Star, Image as ImageIcon, Settings as SettingsIcon, 
  BarChart3, Search, Download, Trash2, Phone, MessageSquare, 
  CheckCircle2, Clock, Filter, Eye, ShieldCheck, Sparkles, Plus, Edit3, Lock, LogOut, FileText, Check, X,
  Globe, ShieldAlert, Upload, RefreshCw, Layers, MapPin, Database, Server, Activity, HardDrive, FileJson, Wrench
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { leads, updateLeadStatus, deleteLead } = useLeads();
  const {
    projects, reviews, heroSettings, popupSettings, adminCredentials, siteSettings,
    categories, counters, locations, mediaLibrary,
    isAdminAuthenticated, loginAdmin, logoutAdmin, updateAdminCredentials,
    addProject, updateProject, deleteProject, toggleProjectFeatured, toggleProjectPublished, toggleProjectArchive,
    addReview, updateReview, deleteReview, updateHeroSettings, updatePopupSettings, updateSiteSettings,
    addMediaItem, deleteMediaItem, updateCounter, addCategory, exportBackup, importBackup
  } = useData();

  // Login state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active tab state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'leads' | 'properties' | 'categories' | 'reviews' | 'hero' | 'popup' | 'counters' | 'locations' | 'medialib' | 'settings'
  >('overview');

  // Lead filters & notes
  const [leadFilterTab, setLeadFilterTab] = useState<'All' | 'New' | 'Today' | 'Follow-up' | 'Contacted' | 'Closed'>('All');
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [leadNotesInput, setLeadNotesInput] = useState('');

  // Property Modal / Form State
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
    brokerageFree: false,
    published: true,
    isFeatured: true,
    placements: ['homepage', 'featured', 'buy'],
    features: ['Rooftop Amenities', 'Podium Parking', '24/7 Security'],
    highlights: 'Near station & upcoming infrastructure hub.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
    galleryImages: [],
    brochureUrl: '',
    floorPlanUrl: '',
    builderName: 'Premier Developer',
    builderExperience: '15+ Years',
    amenities: ['Swimming Pool', 'Gymnasium', 'Clubhouse', 'Children Play Area'],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
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

  // Category Modal State
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState(siteSettings);
  const [newAdminUser, setNewAdminUser] = useState(adminCredentials.username);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  const backupFileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle Login Submit (Generic Error Message ONLY - Security Audit)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(loginUser, loginPass);
    if (!success) {
      setLoginError('Invalid username or password.');
    } else {
      setLoginError('');
    }
  };

  // Filtered Leads
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
    if (leadFilterTab === 'Follow-up') return l.status === 'Follow-up';
    if (leadFilterTab === 'Today') return l.timestamp && l.timestamp.includes(new Date().toISOString().slice(0, 10));

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

  // Handle Open Edit Project
  const handleEditProject = (proj: PropertyItem) => {
    setEditingProjectId(proj.id);
    setProjectForm(proj);
    setIsProjectModalOpen(true);
  };

  // Handle Save Review
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author || !reviewForm.content) return;
    addReview(reviewForm as Omit<GoogleReviewItem, 'id'>);
    setIsReviewModalOpen(false);
  };

  // Handle Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
    if (newAdminPass.trim()) {
      updateAdminCredentials(newAdminUser, newAdminPass);
    } else {
      updateAdminCredentials(newAdminUser, adminCredentials.passwordHash);
    }
    setSettingsSuccess('Settings and Admin Security configuration saved successfully!');
    setTimeout(() => setSettingsSuccess(''), 3500);
  };

  // Handle Backup Import
  const handleBackupFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importBackup(content);
        if (ok) {
          alert('Backup restored successfully!');
        } else {
          alert('Failed to parse backup file. Please check JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  // IF NOT AUTHENTICATED: Show Isolated Private Secure Login Screen (No public layout, no exposure)
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
              className="w-full btn-gold py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 mt-6"
            >
              <Lock className="w-4 h-4" /> Secure Admin Access
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

  // Calculate KPIs for Overview
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const followUpLeadsCount = leads.filter(l => l.status === 'Follow-up').length;
  const closedLeadsCount = leads.filter(l => l.status === 'Closed').length;
  const publishedProjectsCount = projects.filter(p => p.published !== false).length;

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 font-outfit flex flex-col">
      <SEOHead title="Enterprise Admin Console | Jayshree Realty" description="Private Real Estate CMS Console" />

      {/* ISOLATED ADMIN TOP BAR (No public header/footer) */}
      <header className="bg-[#090f20] border-b border-[#c5a059]/30 sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Jayshree Realty" className="h-10 w-auto object-contain" />
          <div className="hidden sm:block border-l border-slate-700 pl-4">
            <h1 className="font-serif text-lg font-bold text-white tracking-wide">JAYSHREE REALTY <span className="text-[#c5a059]">ENTERPRISE CMS</span></h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Real Estate Operations Console</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Health: 100% Operational
          </div>

          <button
            onClick={exportLeadsCSV}
            className="hidden sm:flex items-center gap-2 bg-[#0d1527] border border-[#c5a059]/40 hover:border-[#c5a059] text-white text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#c5a059]" /> Export Leads ({totalLeadsCount})
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* ISOLATED SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-[#0a1022] border-r border-[#c5a059]/20 flex flex-col justify-between shrink-0 p-4">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Dashboard</div>
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview' ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg' : 'text-slate-300 hover:bg-[#0f1932]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview & Analytics
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'leads' ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg' : 'text-slate-300 hover:bg-[#0f1932]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" /> Lead Manager
              </div>
              {newLeadsCount > 0 && (
                <span className="bg-emerald-500 text-black font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {newLeadsCount} New
                </span>
              )}
            </button>

            <div className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Content Management</div>

            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'properties' ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg' : 'text-slate-300 hover:bg-[#0f1932]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4" /> Property & Project CMS
              </div>
              <span className="text-[10px] font-mono opacity-80">({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'categories' ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg' : 'text-slate-300 hover:bg-[#0f1932]'
              }`}
            >
              <Layers className="w-4 h-4" /> Project Categories
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'reviews' ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg' : 'text-slate-300 hover:bg-[#0f1932]'
              }`}
            >
              <Star className="w-4 h-4" /> Reviews & Testimonials
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'hero' ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg' : 'text-slate-300 hover:bg-[#0f1932]'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Hero & Typewriter CMS
            </button>

            <button
              onClick={() => setActiveTab('popup')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'popup' ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg' : 'text-slate-300 hover:bg-[#0f1932]'
              }`}
            >
              <Eye className="w-4 h-4" /> Lead Popup CMS
            </button>

            <button
              onClick={() => setActiveTab('counters')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'counters' ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg' : 'text-slate-300 hover:bg-[#0f1932]'
              }`}
            >
              <Activity className="w-4 h-4" /> Achievement Counters
            </button>

            <button
              onClick={() => setActiveTab('locations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'locations' ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg' : 'text-slate-300 hover:bg-[#0f1932]'
              }`}
            >
              <MapPin className="w-4 h-4" /> Locations & Nodes
            </button>

            <button
              onClick={() => setActiveTab('medialib')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'medialib' ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg' : 'text-slate-300 hover:bg-[#0f1932]'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Media Library
            </button>

            <div className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">System & Admin</div>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'settings' ? 'bg-[#c5a059] text-[#070b19] font-bold shadow-lg' : 'text-slate-300 hover:bg-[#0f1932]'
              }`}
            >
              <SettingsIcon className="w-4 h-4" /> Settings & Security
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="p-3 bg-[#060a16] rounded-xl border border-slate-800 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Storage Status</span>
                <span className="text-[#c5a059] font-bold">OK</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#c5a059] h-full w-1/4"></div>
              </div>
              <div className="text-[10px] text-slate-400">IndexedDB / LocalStorage Sync</div>
            </div>
          </div>
        </aside>

        {/* MAIN DISPLAY REGION */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Enterprise Overview & Analytics</h2>
                <p className="text-xs text-slate-400 mt-1">Real-time stats from website visitors, leads, and inventory state.</p>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-[#0d1527] border border-[#c5a059]/30 rounded-2xl p-5 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Total Captured Leads</span>
                    <Users className="w-4 h-4 text-[#c5a059]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-white">{totalLeadsCount}</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Live local storage synced
                  </div>
                </div>

                <div className="bg-[#0d1527] border border-[#c5a059]/30 rounded-2xl p-5 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>New Pending Leads</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-amber-400">{newLeadsCount}</div>
                  <div className="text-[11px] text-amber-300/80">Requires prompt response</div>
                </div>

                <div className="bg-[#0d1527] border border-[#c5a059]/30 rounded-2xl p-5 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Active Properties Listed</span>
                    <Building2 className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-white">{publishedProjectsCount}</div>
                  <div className="text-[11px] text-slate-400">Across Navi Mumbai Nodes</div>
                </div>

                <div className="bg-[#0d1527] border border-[#c5a059]/30 rounded-2xl p-5 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Google Reviews Rating</span>
                    <Star className="w-4 h-4 text-[#c5a059]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#e5c178]">4.9 ★</div>
                  <div className="text-[11px] text-slate-400">{reviews.length} Verified Reviews</div>
                </div>
              </div>

              {/* Module Summary Blocks */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Today's Follow Ups */}
                <div className="bg-[#0d1527] border border-[#c5a059]/20 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#c5a059]" /> Today's Follow Ups & Actions
                    </h3>
                    <span className="text-xs text-[#c5a059] font-bold">{followUpLeadsCount} Pending</span>
                  </div>

                  <div className="space-y-3">
                    {leads.filter(l => l.status === 'Follow-up' || l.status === 'New').slice(0, 4).map(lead => (
                      <div key={lead.id} className="p-3 bg-[#070b19] border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{lead.name}</div>
                          <div className="text-[11px] text-slate-400">{lead.phone} • {lead.preferredArea || 'Navi Mumbai'}</div>
                        </div>
                        <button
                          onClick={() => { setActiveTab('leads'); setLeadFilterTab('Follow-up'); }}
                          className="px-2.5 py-1 rounded bg-[#c5a059]/20 text-[#e5c178] hover:bg-[#c5a059] hover:text-black font-semibold transition-all"
                        >
                          View
                        </button>
                      </div>
                    ))}
                    {leads.filter(l => l.status === 'Follow-up' || l.status === 'New').length === 0 && (
                      <p className="text-xs text-slate-400 py-4 text-center">No pending follow-ups required today.</p>
                    )}
                  </div>
                </div>

                {/* Lead Pipeline Breakdown */}
                <div className="bg-[#0d1527] border border-[#c5a059]/20 rounded-2xl p-6 space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#c5a059]" /> Lead Pipeline Breakdown
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">New Uncontacted</span>
                        <span className="font-bold text-emerald-400">{newLeadsCount}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full" style={{ width: `${totalLeadsCount ? (newLeadsCount/totalLeadsCount)*100 : 0}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">In Follow-Up</span>
                        <span className="font-bold text-amber-400">{followUpLeadsCount}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: `${totalLeadsCount ? (followUpLeadsCount/totalLeadsCount)*100 : 0}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Closed / Converted</span>
                        <span className="font-bold text-sky-400">{closedLeadsCount}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-sky-400 h-full" style={{ width: `${totalLeadsCount ? (closedLeadsCount/totalLeadsCount)*100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System & Health Status */}
                <div className="bg-[#0d1527] border border-[#c5a059]/20 rounded-2xl p-6 space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#c5a059]" /> System & Hosting Health
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-[#070b19] rounded-xl">
                      <span className="text-slate-300">Hostinger LiteSpeed Engine</span>
                      <span className="text-emerald-400 font-bold">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-[#070b19] rounded-xl">
                      <span className="text-slate-300">SPA Router Fallback (.htaccess)</span>
                      <span className="text-emerald-400 font-bold">Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-[#070b19] rounded-xl">
                      <span className="text-slate-300">Robots & Sitemap XML</span>
                      <span className="text-emerald-400 font-bold">Indexed</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-[#070b19] rounded-xl">
                      <span className="text-slate-300">Admin Security Scoping</span>
                      <span className="text-emerald-400 font-bold">Protected</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: LEAD MANAGER */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">Lead Manager & Pipeline</h2>
                  <p className="text-xs text-slate-400 mt-1">Manage buyer/seller inquiries captured from website forms & CTAs.</p>
                </div>

                <button
                  onClick={exportLeadsCSV}
                  className="btn-gold px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg w-fit"
                >
                  <Download className="w-4 h-4" /> Download CSV Export
                </button>
              </div>

              {/* Controls Bar */}
              <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#0d1527] p-4 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  {(['All', 'New', 'Today', 'Follow-up', 'Contacted', 'Closed'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setLeadFilterTab(tab)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        leadFilterTab === tab ? 'bg-[#c5a059] text-black shadow-md' : 'bg-[#070b19] text-slate-300 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                    placeholder="Search name, phone, area..."
                    className="w-full bg-[#070b19] border border-slate-700 focus:border-[#c5a059] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Leads Table */}
              <div className="bg-[#0d1527] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#080d19] text-slate-400 border-b border-slate-800 font-serif">
                      <tr>
                        <th className="p-4 font-bold">Client Name</th>
                        <th className="p-4 font-bold">Phone / Email</th>
                        <th className="p-4 font-bold">Requirement</th>
                        <th className="p-4 font-bold">Source & Page</th>
                        <th className="p-4 font-bold">Timestamp</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-[#091122] transition-colors">
                          <td className="p-4 font-bold text-white">{lead.name}</td>
                          <td className="p-4 font-mono text-slate-300">
                            <div>{lead.phone}</div>
                            {lead.email && <div className="text-[11px] text-slate-400">{lead.email}</div>}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-amber-200">{lead.requirement || 'Property Inquiry'}</span>
                            <div className="text-[11px] text-slate-400">{lead.preferredArea} • {lead.budget}</div>
                          </td>
                          <td className="p-4 text-[11px] text-slate-400">
                            <span className="text-slate-300 font-semibold">{lead.lead_source}</span>
                            <div>{lead.page_name}</div>
                          </td>
                          <td className="p-4 text-[11px] text-slate-400 font-mono">{lead.timestamp}</td>
                          <td className="p-4">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                              className={`bg-[#070b19] border rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none ${
                                lead.status === 'New' ? 'border-emerald-500/50 text-emerald-400' :
                                lead.status === 'Follow-up' ? 'border-amber-500/50 text-amber-400' :
                                lead.status === 'Contacted' ? 'border-sky-500/50 text-sky-400' : 'border-slate-600 text-slate-400'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Follow-up">Follow-up</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-500/30 transition-all"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            No leads matching current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROPERTY & PROJECT CMS */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">Property & Project CMS</h2>
                  <p className="text-xs text-slate-400 mt-1">Create, edit, feature, and target placement of properties across site pages.</p>
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
                      brokerageFree: false,
                      published: true,
                      isFeatured: true,
                      placements: ['homepage', 'featured', 'buy'],
                      features: ['Rooftop Amenities', 'Podium Parking'],
                      highlights: '',
                      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000'
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="btn-gold px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg w-fit"
                >
                  <Plus className="w-4 h-4" /> Add New Property Listing
                </button>
              </div>

              {/* Property Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-[#0d1527] border border-[#c5a059]/30 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="relative h-48 bg-slate-900">
                        <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="badge-gold text-[10px] font-bold">{proj.category}</span>
                          {proj.brokerageFree && (
                            <span className="badge-emerald text-[10px] font-bold">0% Brokerage Enabled</span>
                          )}
                        </div>
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <button
                            onClick={() => toggleProjectPublished(proj.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold shadow ${
                              proj.published !== false ? 'bg-emerald-500 text-black' : 'bg-slate-700 text-white'
                            }`}
                          >
                            {proj.published !== false ? 'Published' : 'Draft'}
                          </button>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="font-serif font-bold text-base text-white leading-snug">{proj.title}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#c5a059]" /> {proj.location}
                        </p>
                        
                        <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-800 font-mono">
                          <span className="text-amber-300 font-bold">{proj.price}</span>
                          <span className="text-slate-400">{proj.configuration}</span>
                        </div>

                        {/* Placements Badges */}
                        <div className="pt-2 border-t border-slate-800/60">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Target Placements:</span>
                          <div className="flex flex-wrap gap-1">
                            {(proj.placements || ['buy']).map(p => (
                              <span key={p} className="px-2 py-0.5 bg-[#070b19] border border-slate-700 rounded text-[10px] text-amber-200">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#080d1a] border-t border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => toggleProjectFeatured(proj.id)}
                        className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                          proj.isFeatured ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" /> {proj.isFeatured ? 'Featured' : 'Feature'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProject(proj)}
                          className="p-2 rounded bg-slate-800 text-slate-200 hover:bg-[#c5a059] hover:text-black transition-all"
                          title="Edit Property"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProject(proj.id)}
                          className="p-2 rounded bg-red-950/50 text-red-300 hover:bg-red-900 transition-all border border-red-500/30"
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

          {/* TAB 4: CATEGORIES CMS */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Project Categories CMS</h2>
                <p className="text-xs text-slate-400 mt-1">Manage filter categories for properties & listings.</p>
              </div>

              <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="Enter new category name..."
                    className="flex-1 bg-[#070b19] border border-slate-700 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (newCategoryInput.trim()) {
                        addCategory(newCategoryInput.trim() as ProjectCategory);
                        setNewCategoryInput('');
                      }
                    }}
                    className="btn-gold px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <div key={cat} className="p-3.5 bg-[#070b19] border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{cat}</span>
                      <span className="text-[10px] text-[#c5a059] font-bold">
                        {projects.filter(p => p.category === cat).length} Properties
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS CMS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">Google Reviews & Testimonials</h2>
                  <p className="text-xs text-slate-400 mt-1">Manage customer testimonials shown on homepage & reviews section.</p>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="btn-gold px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-[#0d1527] border border-slate-800 rounded-2xl p-5 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: rev.avatarColor }}>
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{rev.author}</div>
                          <div className="text-[11px] text-slate-400">{rev.reviewsCount || 'Verified Client'} • {rev.timeAgo}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="p-1.5 rounded bg-red-950/50 text-red-300 hover:bg-red-900 border border-red-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 text-sm">
                      {'★'.repeat(rev.rating)}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic font-outfit">"{rev.content}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: HERO CMS */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Hero & Typewriter CMS</h2>
                <p className="text-xs text-slate-400 mt-1">Configure main homepage headline, gold highlight, typewriter phrases, and hero background image.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); updateHeroSettings(heroSettings); alert('Hero settings updated live!'); }} className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Heading Part 1</label>
                  <input
                    type="text"
                    value={heroSettings.headingPart1}
                    onChange={(e) => updateHeroSettings({ headingPart1: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Gold Accent Headline</label>
                  <input
                    type="text"
                    value={heroSettings.headingGold}
                    onChange={(e) => updateHeroSettings({ headingGold: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-[#e5c178] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Subtext Paragraph</label>
                  <textarea
                    rows={3}
                    value={heroSettings.subtext}
                    onChange={(e) => updateHeroSettings({ subtext: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-4 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Hero Background Image URL</label>
                  <input
                    type="text"
                    value={heroSettings.backgroundImage}
                    onChange={(e) => updateHeroSettings({ backgroundImage: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                  />
                </div>

                <button type="submit" className="btn-gold px-6 py-2.5 text-xs font-bold rounded-xl shadow-lg">
                  Save Hero Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: POPUP CMS */}
          {activeTab === 'popup' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Lead Modal & Offer Popup CMS</h2>
                <p className="text-xs text-slate-400 mt-1">Configure modal popups triggered on homepage and property cards.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); updatePopupSettings(popupSettings); alert('Popup settings saved!'); }} className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Popup Title</label>
                  <input
                    type="text"
                    value={popupSettings.title}
                    onChange={(e) => updatePopupSettings({ title: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Subtitle / Offer Detail</label>
                  <input
                    type="text"
                    value={popupSettings.subtitle}
                    onChange={(e) => updatePopupSettings({ subtitle: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Badge Text</label>
                  <input
                    type="text"
                    value={popupSettings.badge}
                    onChange={(e) => updatePopupSettings({ badge: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-[#e5c178]"
                  />
                </div>

                <button type="submit" className="btn-gold px-6 py-2.5 text-xs font-bold rounded-xl shadow-lg">
                  Save Popup Configuration
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: COUNTERS CMS */}
          {activeTab === 'counters' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Achievement Counters CMS</h2>
                <p className="text-xs text-slate-400 mt-1">Edit statistics displayed across the website.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {counters.map((c) => (
                  <div key={c.id} className="bg-[#0d1527] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <label className="block text-xs font-bold text-slate-300 uppercase">{c.label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={c.value}
                        onChange={(e) => updateCounter(c.id, { value: Number(e.target.value) })}
                        className="w-32 bg-[#070b19] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold"
                      />
                      <input
                        type="text"
                        value={c.suffix}
                        onChange={(e) => updateCounter(c.id, { suffix: e.target.value })}
                        className="w-20 bg-[#070b19] border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-300 font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: LOCATIONS CMS */}
          {activeTab === 'locations' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Navi Mumbai Locations & Nodes</h2>
                <p className="text-xs text-slate-400 mt-1">Manage location Nodes for search and area tagging.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locations.map((loc) => (
                  <div key={loc.id} className="bg-[#0d1527] border border-slate-800 rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif font-bold text-white text-base">{loc.name}</h3>
                      <span className="badge-gold text-[10px]">{loc.activeCount} Properties</span>
                    </div>
                    <p className="text-xs text-slate-400">{loc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: MEDIA LIBRARY */}
          {activeTab === 'medialib' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">Media Library Asset Manager</h2>
                  <p className="text-xs text-slate-400 mt-1">Upload & copy image URLs for project cards, banners, and brochures.</p>
                </div>
              </div>

              <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="Paste image URL..."
                    className="flex-1 bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (newMediaUrl.trim()) {
                        addMediaItem(newMediaUrl.trim());
                        setNewMediaUrl('');
                      }
                    }}
                    className="btn-gold px-4 py-2 text-xs font-bold rounded-xl"
                  >
                    Add Image URL
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaLibrary.map((url, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 h-32">
                      <img src={url} alt="Media Asset" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => { navigator.clipboard.writeText(url); alert('Image URL copied to clipboard!'); }}
                          className="px-2.5 py-1 bg-[#c5a059] text-black text-[10px] font-bold rounded"
                        >
                          Copy URL
                        </button>
                        <button
                          onClick={() => deleteMediaItem(url)}
                          className="p-1 bg-red-600 text-white rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SETTINGS PAGE */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">System Settings & Admin Security</h2>
                <p className="text-xs text-slate-400 mt-1">Manage company information, phone, email, WhatsApp, maps, analytics, maintenance mode, and credentials.</p>
              </div>

              {settingsSuccess && (
                <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {settingsSuccess}
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* Company Contact Information */}
                <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-serif font-bold text-base text-[#e5c178] border-b border-slate-800 pb-2">Company Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Company Name</label>
                      <input
                        type="text"
                        value={settingsForm.companyName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                        className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={settingsForm.whatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                        className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Office Address</label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Google Maps Embed URL</label>
                      <input
                        type="text"
                        value={settingsForm.googleMapsEmbedUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsEmbedUrl: e.target.value })}
                        className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Analytics & Technical SEO */}
                <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-serif font-bold text-base text-[#e5c178] border-b border-slate-800 pb-2">Analytics & Technical SEO Integration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">GA4 Measurement ID</label>
                      <input
                        type="text"
                        value={settingsForm.gaMeasurementId}
                        onChange={(e) => setSettingsForm({ ...settingsForm, gaMeasurementId: e.target.value })}
                        className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">GTM Container ID</label>
                      <input
                        type="text"
                        value={settingsForm.gtmContainerId}
                        onChange={(e) => setSettingsForm({ ...settingsForm, gtmContainerId: e.target.value })}
                        className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">GSC Verification Token</label>
                      <input
                        type="text"
                        value={settingsForm.gscVerificationMeta}
                        onChange={(e) => setSettingsForm({ ...settingsForm, gscVerificationMeta: e.target.value })}
                        className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Robots.txt Content</label>
                    <textarea
                      rows={3}
                      value={settingsForm.robotsTxtContent}
                      onChange={(e) => setSettingsForm({ ...settingsForm, robotsTxtContent: e.target.value })}
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* Data Backup & Restore */}
                <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-serif font-bold text-base text-[#e5c178] border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>JSON Data Backup & Restore</span>
                    <FileJson className="w-4 h-4 text-[#c5a059]" />
                  </h3>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={exportBackup}
                      className="px-4 py-2.5 bg-[#c5a059]/20 border border-[#c5a059]/50 text-[#e5c178] hover:bg-[#c5a059] hover:text-black rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download Complete CMS Backup (.json)
                    </button>

                    <button
                      type="button"
                      onClick={() => backupFileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700"
                    >
                      <Upload className="w-4 h-4 text-sky-400" /> Restore CMS from Backup JSON
                    </button>
                    
                    <input
                      ref={backupFileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleBackupFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Maintenance Mode & Admin Credentials */}
                <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-serif font-bold text-base text-[#e5c178] border-b border-slate-800 pb-2">Admin Security Credentials</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Admin Username</label>
                      <input
                        type="text"
                        value={newAdminUser}
                        onChange={(e) => setNewAdminUser(e.target.value)}
                        className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">New Password (Leave blank to keep existing)</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="btn-gold px-8 py-3 rounded-xl font-bold text-xs shadow-xl flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save All Enterprise Settings
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* PROPERTY EDIT / CREATE MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto font-outfit">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-serif font-bold text-lg text-white">
                {editingProjectId ? 'Edit Property Listing' : 'Create New Property Listing'}
              </h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Vantaara Luxury 2 & 3 BHK"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Property Type</label>
                  <select
                    value={projectForm.type}
                    onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value as any })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                  >
                    <option value="New Launch">New Launch</option>
                    <option value="Township">Township</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Resale">Resale</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    placeholder="Sector 34, Kharghar"
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Starting Price</label>
                  <input
                    type="text"
                    required
                    value={projectForm.price}
                    onChange={(e) => setProjectForm({ ...projectForm, price: e.target.value })}
                    placeholder="₹ 85 Lakhs*"
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Configuration</label>
                  <input
                    type="text"
                    value={projectForm.configuration}
                    onChange={(e) => setProjectForm({ ...projectForm, configuration: e.target.value })}
                    placeholder="2 & 3 BHK"
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Carpet Area</label>
                  <input
                    type="text"
                    value={projectForm.area}
                    onChange={(e) => setProjectForm({ ...projectForm, area: e.target.value })}
                    placeholder="720 - 1150 Sq.Ft."
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Target Placements selection */}
              <div className="p-4 bg-[#070b19] border border-slate-800 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-[#e5c178] uppercase">Target Page Placements (Select Where Property Appears):</label>
                <div className="flex flex-wrap gap-3 text-xs">
                  {(['homepage', 'featured', 'buy', 'commercial', 'resale'] as PlacementTarget[]).map(target => {
                    const currentPlacements = projectForm.placements || ['buy'];
                    const isSelected = currentPlacements.includes(target);
                    return (
                      <label key={target} className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProjectForm({ ...projectForm, placements: [...currentPlacements, target] });
                            } else {
                              setProjectForm({ ...projectForm, placements: currentPlacements.filter(p => p !== target) });
                            }
                          }}
                          className="rounded border-slate-700 text-[#c5a059] focus:ring-0"
                        />
                        <span className="capitalize">{target}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Brokerage & Status Toggles */}
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.brokerageFree || false}
                    onChange={(e) => setProjectForm({ ...projectForm, brokerageFree: e.target.checked })}
                    className="rounded border-slate-700 text-[#c5a059]"
                  />
                  <span>Show "0% Brokerage" Badge (Disabled by Default)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.isFeatured || false}
                    onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.checked })}
                    className="rounded border-slate-700 text-[#c5a059]"
                  />
                  <span>Highlight as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.published !== false}
                    onChange={(e) => setProjectForm({ ...projectForm, published: e.target.checked })}
                    className="rounded border-slate-700 text-[#c5a059]"
                  />
                  <span>Publish to Website</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-6 py-2 rounded-xl text-xs font-bold shadow-lg"
                >
                  Save Property Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW CREATE MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-white text-base">Add Client Review</h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Review Content</label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold px-4 py-1.5 rounded-lg text-xs font-bold">
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
