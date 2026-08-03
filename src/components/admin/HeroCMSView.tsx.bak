import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { api } from '../../services/api';
import { Sparkles, Upload, Save, RefreshCw, Eye, Check } from 'lucide-react';

export const HeroCMSView: React.FC = () => {
  const { heroSettings, updateHeroSettings } = useData();

  const [form, setForm] = useState(heroSettings);
  const [keywordInput, setKeywordInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    setForm(prev => ({
      ...prev,
      keywords: [...(prev.keywords || []), keywordInput.trim()]
    }));
    setKeywordInput('');
  };

  const handleRemoveKeyword = (idx: number) => {
    const updated = [...(form.keywords || [])];
    updated.splice(idx, 1);
    setForm(prev => ({ ...prev, keywords: updated }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      if (res.success && res.url) {
        setForm(prev => ({ ...prev, backgroundImage: res.url }));
      }
    } catch (err) {
      alert('Background image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHeroSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-outfit">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Hero Section & <span className="text-[#c5a059]">Typewriter CMS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Customize hero titles, gold highlights, typewriter keywords, and background hero banner image.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-gold px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Hero Settings
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          Hero settings saved successfully! Website updated instantly.
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
        {/* Form Inputs */}
        <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Heading Line 1</label>
            <input
              type="text"
              value={form.headingPart1}
              onChange={(e) => setForm({ ...form, headingPart1: e.target.value })}
              className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Gold Highlighted Text</label>
            <input
              type="text"
              value={form.headingGold}
              onChange={(e) => setForm({ ...form, headingGold: e.target.value })}
              className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Subtext Description</label>
            <textarea
              rows={4}
              value={form.subtext}
              onChange={(e) => setForm({ ...form, subtext: e.target.value })}
              className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          {/* Typewriter Keywords Editor */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-slate-300 font-semibold">Typewriter Animated Keywords</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="e.g. Verified CIDCO Plots"
                className="flex-1 bg-[#070b19] border border-slate-700 rounded-xl p-2 text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="btn-gold px-3 py-2 rounded-xl font-bold"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {(form.keywords || []).map((kw, idx) => (
                <span
                  key={idx}
                  className="bg-[#070b19] border border-[#c5a059]/40 text-[#e5c178] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(idx)}
                    className="text-red-400 hover:text-red-300 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Background Banner Upload & Live Preview */}
        <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="font-serif font-bold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Hero Background Banner Image</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1.5 text-xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#c5a059]" /> Replace Image
            </button>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Image URL</label>
            <input
              type="text"
              value={form.backgroundImage}
              onChange={(e) => setForm({ ...form, backgroundImage: e.target.value })}
              className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
            <img src={form.backgroundImage} alt="Hero Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-black/40 to-transparent p-6 flex flex-col justify-end">
              <div className="text-white font-serif font-bold text-lg">{form.headingPart1}</div>
              <div className="text-[#c5a059] font-serif font-bold text-xl">{form.headingGold}</div>
              <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">{form.subtext}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
