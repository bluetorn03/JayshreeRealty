import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import {
  ShieldCheck, Mail, Check, Lock, Phone, MessageSquare,
  MapPin, Globe, Share2, Search, Building2, Instagram, Facebook, Youtube, Linkedin
} from 'lucide-react';

export const SettingsSecurityView: React.FC = () => {
  const {
    siteSettings, updateSiteSettings, updateAdminCredentials,
    adminCredentials
  } = useData();

  const [form, setForm] = useState(siteSettings);
  const [newAdminUser, setNewAdminUser] = useState(adminCredentials.username);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize local form when siteSettings loads asynchronously
  useEffect(() => {
    if (siteSettings) {
      setForm(siteSettings);
    }
  }, [siteSettings]);

  // Clean phone input for tel: protocol
  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\s+/g, '');
    const phoneRaw = cleaned.startsWith('+') ? cleaned : (cleaned ? `+${cleaned}` : '');
    setForm(prev => ({
      ...prev,
      phone: val,
      phoneRaw: phoneRaw || prev.phoneRaw
    }));
  };

  // Clean WhatsApp input for wa.me/ protocol
  const handleWhatsAppChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    setForm(prev => ({
      ...prev,
      whatsapp: val,
      whatsappRaw: cleaned || prev.whatsappRaw
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteSettings(form);

      if (newAdminPass.trim()) {
        await updateAdminCredentials(newAdminUser, newAdminPass);
        setNewAdminPass('');
      }

      setSuccessMsg('Site settings and contact credentials saved successfully! Changes are live across the entire website.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-outfit">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            System Settings & <span className="text-[#c5a059]">Global Configuration</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic contact channels, official company information, social links, SEO tags, and admin credentials.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-gold px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <ShieldCheck className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save System Settings'}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
        
        {/* COLUMN 1: Company Contact & Channels (Dynamic across website) */}
        <div className="space-y-8">
          
          {/* Official Contact Info */}
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3 font-serif font-bold text-white text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#c5a059]" /> Official Site Contact Channels
            </div>
            <p className="text-[11px] text-slate-400">
              Updating these fields instantly changes the phone number, email, and WhatsApp links across the Header, Footer, Floating Buttons, Contact Page, and Property Cards.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Company Phone (Display) <span className="text-[#c5a059]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.phone || ''}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+91 81690 05579"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Formatted for display text</span>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Calling Number (Raw for tel:)
                </label>
                <input
                  type="text"
                  value={form.phoneRaw || ''}
                  onChange={(e) => setForm({ ...form, phoneRaw: e.target.value })}
                  placeholder="+918169005579"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Used in href="tel:..." (auto-synced)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Official Company Email <span className="text-[#c5a059]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email || ''}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="info@jayshreerealty.com"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Used for client inquiries & notifications</span>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  WhatsApp Business Number
                </label>
                <input
                  type="text"
                  value={form.whatsapp || ''}
                  onChange={(e) => handleWhatsAppChange(e.target.value)}
                  placeholder="+91 81690 05579"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">WhatsApp Chat target (auto-synced)</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Company Name / Brand Title
              </label>
              <input
                type="text"
                value={form.companyName || ''}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="Jayshree Realty"
                className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Head Office Physical Address
              </label>
              <textarea
                rows={2}
                value={form.address || ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="G-102, First Floor, Nerul Railway Station Complex, above Union Bank of India, Nerul, Navi Mumbai 400706"
                className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Displayed in Footer, Contact page & Legal schema</span>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Google Maps Embed URL
              </label>
              <input
                type="text"
                value={form.googleMapsEmbedUrl || ''}
                onChange={(e) => setForm({ ...form, googleMapsEmbedUrl: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Renders interactive map on Contact page</span>
            </div>
          </div>

          {/* Social Media Channels */}
          <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3 font-serif font-bold text-white text-sm flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#c5a059]" /> Official Social Media Handles
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram URL
                </label>
                <input
                  type="text"
                  value={form.instagramUrl || ''}
                  onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                  placeholder="https://www.instagram.com/jayshreerealty_navimumbai"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5 text-blue-400" /> Facebook URL
                </label>
                <input
                  type="text"
                  value={form.facebookUrl || ''}
                  onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
                  placeholder="https://www.facebook.com/share/..."
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-red-500" /> YouTube Channel URL
                </label>
                <input
                  type="text"
                  value={form.youtubeUrl || ''}
                  onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/@jayshree_realty_navi_mumbai"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-sky-400" /> LinkedIn URL
                </label>
                <input
                  type="text"
                  value={form.linkedinUrl || ''}
                  onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/company/jayshreerealty"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 2: Admin Security Credentials, Global SEO & Mail Gateway */}
        <div className="space-y-8">
          
          {/* Admin Credentials & Security */}
          <div className="bg-[#0d1527] border border-[#c5a059]/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3 font-serif font-bold text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#c5a059]" /> Admin Authentication Credentials
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Admin Username / Email</label>
              <input
                type="text"
                required
                value={newAdminUser}
                onChange={(e) => setNewAdminUser(e.target.value)}
                className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">New Password (Leave blank to keep unchanged)</label>
              <input
                type="password"
                value={newAdminPass}
                onChange={(e) => setNewAdminPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="font-serif font-bold text-white text-xs flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400" /> Nodemailer SMTP Status (.env)
              </div>
              <div className="p-3 bg-[#070b19] border border-slate-800 rounded-xl space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">SMTP Host:</span>
                  <span className="font-mono text-emerald-400">smtp.hostinger.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SMTP Port:</span>
                  <span className="font-mono text-slate-200">465</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Receiver Email:</span>
                  <span className="font-mono text-[#c5a059]">{form.email || 'Not configured'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Global SEO & Metadata */}
          <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3 font-serif font-bold text-white text-sm flex items-center gap-2">
              <Search className="w-4 h-4 text-[#c5a059]" /> Global Search Engine Optimization (SEO)
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Default Meta Title</label>
              <input
                type="text"
                value={form.seoTitleDefault || ''}
                onChange={(e) => setForm({ ...form, seoTitleDefault: e.target.value })}
                placeholder="Jayshree Realty | Premium Luxury Real Estate Consultancy Navi Mumbai"
                className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Default Meta Description</label>
              <textarea
                rows={3}
                value={form.seoDescriptionDefault || ''}
                onChange={(e) => setForm({ ...form, seoDescriptionDefault: e.target.value })}
                placeholder="Navi Mumbai premier luxury real estate consultancy. Verified CIDCO plot projects & luxury residential towers."
                className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Default Keywords (comma separated)</label>
              <input
                type="text"
                value={form.seoKeywordsDefault || ''}
                onChange={(e) => setForm({ ...form, seoKeywordsDefault: e.target.value })}
                placeholder="Navi Mumbai Real Estate, Nerul Flat Sale, Kharghar New Launch, Jayshree Realty"
                className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

        </div>

      </form>
    </div>
  );
};
