import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Eye, Save, Upload, Check } from 'lucide-react';

export const PopupCMSView: React.FC = () => {
  const { popupSettings, updatePopupSettings } = useData();

  const [form, setForm] = useState(popupSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePopupSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-outfit">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Lead Capture <span className="text-[#c5a059]">Popup Modal CMS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure automatic lead popup triggers (time delay, scroll depth %), fields, badge titles, and redirect URLs.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-gold px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Popup Settings
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          Popup settings saved successfully! Controls updated on live website.
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
        <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-serif font-bold text-white text-sm">Triggers & Behavior</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.enabled !== false}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="rounded accent-[#c5a059]"
              />
              <span className="text-emerald-400 font-bold">Popup Active</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Timer Trigger Delay (Seconds)</label>
              <input
                type="number"
                value={form.triggerDelay || 3}
                onChange={(e) => setForm({ ...form, triggerDelay: Number(e.target.value) })}
                className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Scroll Depth Trigger (%)</label>
              <input
                type="number"
                value={form.scrollTriggerPercent || 25}
                onChange={(e) => setForm({ ...form, scrollTriggerPercent: Number(e.target.value) })}
                className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Popup Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Subtitle Description</label>
            <textarea
              rows={2}
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Badge Tag Text</label>
              <input
                type="text"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Privacy Footer Text</label>
              <input
                type="text"
                value={form.privacyText}
                onChange={(e) => setForm({ ...form, privacyText: e.target.value })}
                className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Image & Redirect Settings */}
        <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 font-serif font-bold text-white text-sm">
            Popup Banner Image & Submission Actions
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Left Image URL</label>
            <input
              type="text"
              value={form.leftImage}
              onChange={(e) => setForm({ ...form, leftImage: e.target.value })}
              className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Success Message on Submit</label>
            <textarea
              rows={2}
              value={form.successMessage || ''}
              onChange={(e) => setForm({ ...form, successMessage: e.target.value })}
              className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Redirect URL (Optional)</label>
            <input
              type="text"
              value={form.redirectUrl || ''}
              onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
              placeholder="e.g. /projects or thank-you link"
              className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div className="relative h-40 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            <img src={form.leftImage} alt="Popup Left" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end">
              <span className="badge-gold text-[10px] w-fit font-bold">{form.badge}</span>
              <div className="text-white font-serif font-bold text-sm mt-1">{form.title}</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
