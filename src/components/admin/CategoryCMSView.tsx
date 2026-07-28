import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ProjectCategory } from '../../types';
import { Layers, Plus, Edit3, Trash2, Search, Check, Tag, X } from 'lucide-react';

export const CategoryCMSView: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [newCatInput, setNewCatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editCatInput, setEditCatInput] = useState('');

  const filteredCategories = categories.filter(c =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    await addCategory(newCatInput.trim() as ProjectCategory);
    setNewCatInput('');
  };

  const handleStartEdit = (cat: string) => {
    setEditingCat(cat);
    setEditCatInput(cat);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editCatInput.trim()) return;
    await updateCategory(editingCat, editCatInput.trim());
    setEditingCat(null);
    setEditCatInput('');
  };

  return (
    <div className="space-y-6 font-outfit">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Project <span className="text-[#c5a059]">Category Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, edit, search, and delete project categories automatically synchronized with website filters.
          </p>
        </div>
      </div>

      {/* Add New Category Bar */}
      <form onSubmit={handleAdd} className="p-4 bg-[#0d1527] border border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newCatInput}
          onChange={(e) => setNewCatInput(e.target.value)}
          placeholder="e.g. 1 BHK Seawoods West, Luxury CIDCO Plots..."
          className="flex-1 bg-[#070b19] border border-slate-700 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
        />
        <button
          type="submit"
          className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </form>

      {/* Search & Grid */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-[#0d1527] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredCategories.map((cat) => (
            <div
              key={cat}
              className="p-4 bg-[#0d1527] border border-slate-800 hover:border-[#c5a059]/40 rounded-xl flex items-center justify-between shadow-md text-xs"
            >
              <div className="flex items-center gap-2.5 flex-1 pr-2 overflow-hidden">
                <Tag className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span className="font-semibold text-white truncate">{cat}</span>
              </div>
              
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleStartEdit(cat)}
                  className="p-1.5 rounded bg-slate-800 border border-slate-700 text-[#c5a059] hover:bg-[#c5a059] hover:text-[#070b19] transition-colors"
                  title="Edit Category"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteCategory(cat)}
                  className="p-1.5 rounded bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCat && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 font-outfit">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-white">Edit Category Name</h3>
              <button onClick={() => setEditingCat(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editCatInput}
                  onChange={(e) => setEditCatInput(e.target.value)}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
                />
                <p className="text-[10px] text-slate-400 mt-1">Updating this category will also update all existing property listings assigned to it.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-4 py-2 rounded-xl font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
