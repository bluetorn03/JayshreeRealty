import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Settings as SettingsIcon, ShieldCheck, Mail, Database, Download, Upload, Check, Lock } from 'lucide-react';

export const SettingsSecurityView: React.FC = () => {
  const {
    siteSettings, updateSiteSettings, updateAdminCredentials,
    adminCredentials, exportBackup, importBackup
  } = useData();

  const [form, setForm] = useState(siteSettings);
  const [newAdminUser, setNewAdminUser] = useState(adminCredentials.username);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const backupInputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(form);

    if (newAdminPass.trim()) {
      await updateAdminCredentials(newAdminUser, newAdminPass);
    }
    setSuccessMsg('Security credentials and site settings saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const ok = importBackup(content);
        if (ok) alert('Backup restored successfully!');
        else alert('Invalid backup JSON format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 font-outfit">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            System Settings & <span className="text-[#c5a059]">Security Console</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Environment credentials, Nodemailer Gmail configuration status, SQLite backups, and SEO settings.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-gold px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" /> Save System Settings
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
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
              className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">New Password (Leave blank to keep unchanged)</label>
            <input
              type="password"
              value={newAdminPass}
              onChange={(e) => setNewAdminPass(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="font-serif font-bold text-white text-xs flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400" /> Nodemailer Gmail SMTP Status (.env)
            </div>
            <div className="p-3 bg-[#070b19] border border-slate-800 rounded-xl space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">SMTP Host:</span>
                <span className="font-mono text-emerald-400">smtp.gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SMTP Port:</span>
                <span className="font-mono text-slate-200">587</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Receiver Email:</span>
                <span className="font-mono text-slate-200">{form.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Database Backups & SEO */}
        <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 font-serif font-bold text-white text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-[#c5a059]" /> Database Backup & Hostinger Restore
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={exportBackup}
              className="btn-gold px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow"
            >
              <Download className="w-4 h-4" /> Download JSON Backup
            </button>

            <input
              type="file"
              ref={backupInputRef}
              onChange={handleFileRestore}
              accept=".json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => backupInputRef.current?.click()}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-[#c5a059]" /> Restore Backup
            </button>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="font-serif font-bold text-white text-xs">Site Contact & Phone Configuration</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Company Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Company Email</label>
                <input
                  type="text"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
