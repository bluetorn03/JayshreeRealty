import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { PropertyItem, ProjectCategory } from '../../types';
import { api } from '../../services/api';
import {
  Building2, Plus, Edit3, Trash2, Eye, EyeOff, Sparkles, Upload,
  Image as ImageIcon, FileText, Check, X, Layers, MapPin, Search, ArrowUpRight
} from 'lucide-react';

export const PropertyCMSView: React.FC = () => {
  const {
    projects, addProject, updateProject, deleteProject,
    toggleProjectFeatured, toggleProjectPublished, toggleProjectArchive, categories
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<PropertyItem>>({
    title: '',
    slug: '',
    category: 'Kharghar New Projects',
    location: 'Kharghar, Navi Mumbai',
    type: 'New Launch',
    configuration: '2 & 3 BHK',
    price: '₹ 85 Lakhs*',
    area: '750 - 1200 Sq.Ft.',
    possession: 'Ready to Move',
    brokerageFree: true,
    published: true,
    isFeatured: true,
    placements: ['homepage', 'featured', 'buy'],
    features: ['Podium Parking', 'Rooftop Garden', 'Clubhouse'],
    highlights: 'Prime luxury tower located opposite metro station.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000'
    ],
    brochureUrl: '',
    floorPlanUrl: '',
    builderName: 'Jayshree Developers',
    builderExperience: '12+ Years',
    amenities: ['Swimming Pool', 'Gymnasium', '24/7 Security', 'Clubhouse'],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      category: categories[0] || 'Kharghar New Projects',
      location: 'Nerul West, Navi Mumbai',
      type: 'New Launch',
      configuration: '2 BHK',
      price: '₹ 75 Lakhs*',
      area: '650 - 1000 Sq.Ft.',
      possession: 'Dec 2026',
      brokerageFree: true,
      published: true,
      isFeatured: true,
      placements: ['homepage', 'featured', 'buy'],
      features: ['Podium Swimming Pool', 'Gymnasium'],
      highlights: 'Prime location near Palm Beach Road.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
      galleryImages: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000'
      ],
      brochureUrl: '',
      floorPlanUrl: '',
      builderName: 'Jayshree Realty',
      builderExperience: '12+ Years',
      amenities: ['Swimming Pool', 'Gymnasium', '24/7 Security', 'Clubhouse'],
      seoTitle: '',
      seoDescription: '',
      seoKeywords: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: PropertyItem) => {
    setEditingId(proj.id);
    setForm({
      ...proj,
      galleryImages: proj.galleryImages && proj.galleryImages.length > 0 ? proj.galleryImages : [proj.image]
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location) return;

    if (editingId) {
      await updateProject(editingId, form);
    } else {
      await addProject(form as Omit<PropertyItem, 'id'>);
    }
    setIsModalOpen(false);
    setEditingId(null);
  };

  // Dynamic Unlimited Image Gallery Handling
  const handleAddGalleryField = () => {
    const current = form.galleryImages || [];
    setForm({
      ...form,
      galleryImages: [...current, '']
    });
  };

  const handleUpdateGalleryUrl = (index: number, url: string) => {
    const current = [...(form.galleryImages || [])];
    current[index] = url;
    setForm({
      ...form,
      galleryImages: current,
      image: current[0] || form.image
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    const current = [...(form.galleryImages || [])];
    current.splice(index, 1);
    setForm({
      ...form,
      galleryImages: current,
      image: current[0] || form.image
    });
  };

  // Upload Hero Image File
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      if (res.success && res.url) {
        setForm(prev => ({
          ...prev,
          image: res.url,
          galleryImages: [res.url, ...(prev.galleryImages || []).filter(u => u !== res.url)]
        }));
      }
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // Upload Additional Gallery Images File
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const res = await api.uploadFile(files[i]);
        if (res.success && res.url) {
          setForm(prev => ({
            ...prev,
            galleryImages: [...(prev.galleryImages || []), res.url]
          }));
        }
      }
    } catch (err) {
      alert('Gallery upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // Reorder Gallery Images
  const handleMoveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const current = [...(form.galleryImages || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIdx];
    current[targetIdx] = temp;
    setForm({
      ...form,
      galleryImages: current,
      image: current[0] || form.image
    });
  };

  // Drag and Drop File Handler
  const handleDropFiles = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const res = await api.uploadFile(files[i]);
        if (res.success && res.url) {
          setForm(prev => ({
            ...prev,
            galleryImages: [...(prev.galleryImages || []), res.url],
            image: prev.image || res.url
          }));
        }
      }
    } catch (err) {
      alert('Drop upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-outfit">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Property & Project <span className="text-[#c5a059]">CMS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Unlimited image gallery, drag-and-drop file uploads, YouTube video link management, and hover image rotation.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Property
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#0d1527] p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterCategory === 'All' ? 'bg-[#c5a059] text-black font-bold' : 'bg-[#070b19] text-slate-300'
            }`}
          >
            All Categories ({projects.length})
          </button>
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filterCategory === cat ? 'bg-[#c5a059] text-black font-bold' : 'bg-[#070b19] text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, location..."
            className="w-full bg-[#070b19] border border-slate-700 focus:border-[#c5a059] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Property Cards CMS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <div key={proj.id} className="bg-[#0d1527] border border-[#c5a059]/30 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div>
              <div className="relative h-48 bg-slate-900">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  <span className="badge-gold text-[10px] font-bold">{proj.category}</span>
                  {proj.youtubeUrl && (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      Video Linked
                    </span>
                  )}
                  {proj.isFeatured && (
                    <span className="bg-[#c5a059] text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    onClick={() => toggleProjectPublished(proj.id)}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      proj.published !== false ? 'bg-emerald-500 text-black' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {proj.published !== false ? 'Published' : 'Unpublished'}
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div className="font-serif text-lg font-bold text-white">{proj.price}</div>
                  <div className="text-[10px] text-slate-300 font-mono">
                    {(proj.galleryImages || []).length} Gallery Images
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-serif font-bold text-base text-white">{proj.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a059]" /> {proj.location}
                </p>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold">{proj.configuration}</span> • {proj.area}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <button
                onClick={() => handleOpenEdit(proj)}
                className="text-[#c5a059] font-bold hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Property
              </button>

              <button
                onClick={() => deleteProject(proj.id)}
                className="text-red-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comprehensive Property CMS Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="font-serif font-bold text-xl text-white">
                {editingId ? 'Edit Property Listing' : 'Create New Property Listing'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs">
              {/* Basic Details */}
              <div className="space-y-3">
                <div className="font-serif font-bold text-slate-300 uppercase text-[11px] tracking-wider text-[#c5a059]">
                  1. General Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Property Title *</label>
                    <input
                      type="text"
                      required
                      value={form.title || ''}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Jayshree Heights"
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Project Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Location / Node *</label>
                    <input
                      type="text"
                      required
                      value={form.location || ''}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Sector 19, Nerul West"
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Starting Price *</label>
                    <input
                      type="text"
                      required
                      value={form.price || ''}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="e.g. ₹ 75 Lakhs*"
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Configuration *</label>
                    <input
                      type="text"
                      required
                      value={form.configuration || ''}
                      onChange={(e) => setForm({ ...form, configuration: e.target.value })}
                      placeholder="e.g. 2 & 3 BHK"
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Carpet Area</label>
                    <input
                      type="text"
                      value={form.area || ''}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      placeholder="e.g. 650 - 1100 Sq.Ft."
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Possession Status</label>
                    <input
                      type="text"
                      value={form.possession || ''}
                      onChange={(e) => setForm({ ...form, possession: e.target.value })}
                      placeholder="e.g. Dec 2026 or Ready"
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Property Code / Tag</label>
                    <input
                      type="text"
                      value={form.code || ''}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      placeholder="e.g. 2 BHK - 14N"
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* UNLIMITED GALLERY IMAGES & DRAG AND DROP */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <div className="font-serif font-bold text-slate-300 uppercase text-[11px] tracking-wider text-[#c5a059]">
                    2. Images & Drag & Drop Upload Zone
                  </div>
                  <button
                    type="button"
                    onClick={handleAddGalleryField}
                    className="btn-gold px-3 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Image Field
                  </button>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropFiles}
                  className="border-2 border-dashed border-slate-700 hover:border-[#c5a059] rounded-2xl p-6 text-center bg-[#070b19]/60 transition-colors cursor-pointer"
                  onClick={() => galleryFileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={galleryFileInputRef}
                    onChange={handleGalleryFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-[#c5a059] mx-auto mb-2" />
                  <p className="font-semibold text-slate-200 text-xs">Drag and drop images here or click to browse files</p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, WEBP, SVG file formats</p>
                </div>

                <div className="p-4 bg-[#070b19] border border-slate-800 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-slate-300">Property Image Gallery List ({ (form.galleryImages || []).length } Images):</div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {(form.galleryImages || []).map((url, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#0d1527] p-2 rounded-xl border border-slate-800">
                        <span className="font-mono text-slate-400 text-[10px] w-6">#{idx + 1}</span>
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => handleUpdateGalleryUrl(idx, e.target.value)}
                          placeholder="Image URL or uploaded file path..."
                          className="flex-1 bg-[#070b19] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                        />
                        {url && <img src={url} alt="" className="w-8 h-8 object-cover rounded border border-slate-700 shrink-0" />}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveGalleryImage(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold disabled:opacity-40"
                            title="Move Up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveGalleryImage(idx, 'down')}
                            disabled={idx === (form.galleryImages || []).length - 1}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold disabled:opacity-40"
                            title="Move Down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="p-1.5 text-red-400 hover:bg-red-950/40 rounded-lg"
                            title="Remove Image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Descriptions & YouTube Video Link */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="font-serif font-bold text-slate-300 uppercase text-[11px] tracking-wider text-[#c5a059]">
                  3. Descriptions & YouTube Video Integration
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">YouTube Video Link (Walkthrough / Tour URL)</label>
                  <input
                    type="text"
                    value={form.youtubeUrl || ''}
                    onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID or embed URL"
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">This video link opens when users click the YouTube play button on property cards.</p>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Highlights / Short Description</label>
                  <input
                    type="text"
                    value={form.highlights || ''}
                    onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                    placeholder="Prime luxury development near Metro station..."
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Full Detailed Property Overview / Long Description</label>
                  <textarea
                    rows={4}
                    value={form.description || form.longDescription || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value, longDescription: e.target.value })}
                    placeholder="Write complete property specifications, floor plan highlights, RERA number, and CIDCO plot details..."
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Brochure URL / PDF Path</label>
                    <input
                      type="text"
                      value={form.brochureUrl || ''}
                      onChange={(e) => setForm({ ...form, brochureUrl: e.target.value })}
                      placeholder="/uploads/brochure.pdf"
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Floor Plan Image / PDF URL</label>
                    <input
                      type="text"
                      value={form.floorPlanUrl || ''}
                      onChange={(e) => setForm({ ...form, floorPlanUrl: e.target.value })}
                      placeholder="/uploads/floorplan.jpg"
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles & SEO */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex flex-wrap gap-6 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.published !== false}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="rounded accent-[#c5a059]"
                    />
                    <span className="text-white font-semibold">Published on Website</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured || false}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="rounded accent-[#c5a059]"
                    />
                    <span className="text-white font-semibold">Mark as Featured</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.brokerageFree || false}
                      onChange={(e) => setForm({ ...form, brokerageFree: e.target.checked })}
                      className="rounded accent-[#c5a059]"
                    />
                    <span className="text-white font-semibold">0% Brokerage Tag</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-6 py-2.5 rounded-xl font-bold shadow-lg"
                >
                  Save & Publish to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
