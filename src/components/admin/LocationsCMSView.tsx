import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { LocationNode } from '../../types';
import { MapPin, Plus, Edit3, Trash2, Search, Building2, Eye, EyeOff } from 'lucide-react';

export const LocationsCMSView: React.FC = () => {
  const { locations, addLocation, updateLocation, deleteLocation } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<LocationNode | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    activeCount: 0,
    activeStatus: true
  });

  const filteredLocations = locations.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingLoc(null);
    setForm({ name: '', description: '', activeCount: 0, activeStatus: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (loc: LocationNode) => {
    setEditingLoc(loc);
    setForm({
      name: loc.name,
      description: loc.description,
      activeCount: loc.activeCount,
      activeStatus: (loc as any).activeStatus !== false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    if (editingLoc) {
      await updateLocation(editingLoc.id, form);
    } else {
      await addLocation(form);
    }
    setIsModalOpen(false);
  };

  const toggleNodeActive = async (loc: LocationNode) => {
    const nextState = (loc as any).activeStatus === false ? true : false;
    await updateLocation(loc.id, { activeStatus: nextState } as any);
  };

  return (
    <div className="space-y-6 font-outfit">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Location & Node <span className="text-[#c5a059]">Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage Navi Mumbai real estate location nodes, active project counts, and status toggles.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Location Node
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location nodes..."
          className="w-full bg-[#0d1527] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((loc) => {
          const isNodeActive = (loc as any).activeStatus !== false;
          return (
            <div key={loc.id} className="bg-[#0d1527] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#c5a059]" /> {loc.name}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#c5a059]/20 text-[#e5c178] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {loc.activeCount} Projects
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleNodeActive(loc)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        isNodeActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isNodeActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {isNodeActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{loc.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <button
                  onClick={() => handleOpenEdit(loc)}
                  className="text-[#c5a059] font-bold hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Node
                </button>
                <button
                  onClick={() => deleteLocation(loc.id)}
                  className="text-red-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 font-outfit">
            <h3 className="font-serif font-bold text-xl text-white">
              {editingLoc ? 'Edit Location Node' : 'Add Location Node'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Node Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Kharghar or Pushpak Nagar"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description / Infrastructure Highlights</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Near Airport Node & Coastal Highway"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Active Projects Count</label>
                <input
                  type="number"
                  value={form.activeCount}
                  onChange={(e) => setForm({ ...form, activeCount: Number(e.target.value) })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.activeStatus}
                    onChange={(e) => setForm({ ...form, activeStatus: e.target.checked })}
                    className="rounded accent-[#c5a059]"
                  />
                  <span className="text-white font-semibold">Active Node Status (Visible on Website)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-4 py-2 rounded-xl font-bold"
                >
                  Save Location Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
