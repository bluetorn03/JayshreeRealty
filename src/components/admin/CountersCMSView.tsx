import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { CounterItem } from '../../types';
import { Activity, Save, RotateCcw, Eye, Check, TrendingUp, Users, Building2, Award } from 'lucide-react';
import { AnimatedCounter } from '../AnimatedCounter';

const DEFAULT_COUNTERS_SEED: CounterItem[] = [
  { id: 'cnt-1', label: 'Happy Families', value: 450, suffix: '+', iconName: 'Users' },
  { id: 'cnt-2', label: 'Projects Delivered', value: 85, suffix: '+', iconName: 'Building2' },
  { id: 'cnt-3', label: 'Years Experience', value: 12, suffix: '+', iconName: 'Award' },
  { id: 'cnt-4', label: 'Sq.Ft. Managed', value: 2, suffix: 'M+', iconName: 'TrendingUp' },
];

export const CountersCMSView: React.FC = () => {
  const { counters, saveAllCounters } = useData();

  const [counterList, setCounterList] = useState<CounterItem[]>(counters);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);

  const handleUpdate = (id: string, field: keyof CounterItem, val: any) => {
    setCounterList(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const handleSave = async () => {
    await saveAllCounters(counterList);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = async () => {
    setCounterList(DEFAULT_COUNTERS_SEED);
    await saveAllCounters(DEFAULT_COUNTERS_SEED);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-outfit">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Achievement <span className="text-[#c5a059]">Counters CMS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connected counter module. Modify labels, values, and suffixes with Save, Reset, and Live Preview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <button
            onClick={handleSave}
            className="btn-gold px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Counters
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          Achievement counters saved successfully to database! Website counters updated instantly.
        </div>
      )}

      {/* Editable Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {counterList.map((c, idx) => (
          <div key={c.id || idx} className="bg-[#0d1527] border border-[#c5a059]/30 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-[#c5a059] uppercase">Counter #{idx + 1}</span>
              <span className="text-[10px] text-slate-500 font-mono">ID: {c.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Label</label>
                <input
                  type="text"
                  value={c.label}
                  onChange={(e) => handleUpdate(c.id, 'label', e.target.value)}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Numeric Value</label>
                <input
                  type="number"
                  value={c.value}
                  onChange={(e) => handleUpdate(c.id, 'value', Number(e.target.value))}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Suffix (e.g. +, M+, %)</label>
                <input
                  type="text"
                  value={c.suffix}
                  onChange={(e) => handleUpdate(c.id, 'suffix', e.target.value)}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Icon Name</label>
                <input
                  type="text"
                  value={c.iconName || 'TrendingUp'}
                  onChange={(e) => handleUpdate(c.id, 'iconName', e.target.value)}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2 text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LIVE PREVIEW SECTION */}
      <div className="bg-[#0b1222] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="font-serif font-bold text-lg text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#c5a059]" /> Website Live Counter Preview
          </div>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
            ● Real-Time Sync
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {counterList.map((c) => (
            <div key={c.id} className="text-center p-4 bg-[#070b19] rounded-2xl border border-slate-800/80">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#e5c178] tracking-tight">
                <AnimatedCounter end={c.value} suffix={c.suffix} label={c.label} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
