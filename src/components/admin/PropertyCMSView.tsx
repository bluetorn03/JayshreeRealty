import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { PropertyItem, ProjectCategory } from '../../types';
import { api } from '../../services/api';
import { ConfirmModal } from './ConfirmModal';
import { FormattedDescription } from '../FormattedDescription';
import {
  Building2, Plus, Edit3, Trash2, Eye, EyeOff, Sparkles, Upload,
  Image as ImageIcon, FileText, Check, X, Layers, MapPin, Search, ArrowUpRight,
  Bold, Heading, List, CornerDownLeft, ShieldCheck, Tag, ChevronDown,
  Loader2, Clipboard, CheckCircle2, AlertCircle
} from 'lucide-react';

export const PropertyCMSView: React.FC = () => {
  const {
    projects, addProject, updateProject, deleteProject,
    toggleProjectFeatured, toggleProjectPublished, toggleProjectArchive, categories, addCategory
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [longDescTab, setLongDescTab] = useState<'edit' | 'preview'>('edit');
  const longDescRef = useRef<HTMLTextAreaElement | null>(null);

  const [newAmenityInput, setNewAmenityInput] = useState('');

  // Project Category Combobox & Autosuggestions state
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const categorySuggestionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categorySuggestionsRef.current &&
        !categorySuggestionsRef.current.contains(event.target as Node)
      ) {
        setShowCategorySuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const POPULAR_AMENITIES = [
    'Swimming Pool', 'Gymnasium', 'Clubhouse', '24/7 Security', 'Podium Swimming Pool',
    'Rooftop Garden', "Children's Play Area", 'Jogging Track', 'EV Charging Station',
    'Grand Entrance Lobby', 'Indoor Games Arena', 'High-Speed Elevators', 'Power Backup',
    'Landscaped Gardens', 'Intercom Facility', 'CCTV Surveillance'
  ];

  const handleAddAmenity = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const current = form.amenities || [];
    if (!current.includes(trimmed)) {
      const updated = [...current, trimmed];
      setForm({ ...form, amenities: updated, features: updated });
    }
    setNewAmenityInput('');
  };

  const handleRemoveAmenity = (name: string) => {
    const updated = (form.amenities || []).filter(a => a !== name);
    setForm({ ...form, amenities: updated, features: updated });
  };

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
    features: [],
    highlights: 'Prime luxury tower located opposite metro station.',
    shortDescription: 'Prime luxury tower located opposite metro station.',
    longDescription: '',
    description: '',
    image: '',
    galleryImages: [],
    brochureUrl: '',
    floorPlanUrl: '',
    builderName: 'Jayshree Developers',
    builderExperience: '12+ Years',
    amenities: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const dragCounterRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  const insertLongDescFormat = (prefix: string, suffix: string = '', placeholder: string = '') => {
    if (!longDescRef.current) return;
    const textarea = longDescRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = form.longDescription !== undefined ? form.longDescription : (form.description || '');
    const selectedText = currentVal.substring(start, end);
    const replacement = selectedText ? `${prefix}${selectedText}${suffix}` : `${prefix}${placeholder}${suffix}`;
    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    setForm({ ...form, longDescription: newVal, description: newVal });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText ? selectedText.length : placeholder.length)
      );
    }, 0);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    return true;
  });

  const handleTypeChange = (newType: PropertyItem['type']) => {
    let newPlacements = form.placements || [];
    if (newType === 'Resale') {
      newPlacements = Array.from(new Set([...newPlacements, 'resale', 'homepage']));
    } else if (newType === 'Commercial') {
      newPlacements = Array.from(new Set([...newPlacements, 'commercial']));
    } else if (newType === 'Featured') {
      newPlacements = Array.from(new Set([...newPlacements, 'featured', 'homepage']));
    } else if (newType === 'New Launch' || newType === 'Township' || newType === 'Luxury') {
      newPlacements = Array.from(new Set([...newPlacements, 'featured', 'homepage', 'buy']));
    }
    setForm(prev => ({
      ...prev,
      type: newType,
      placements: newPlacements,
      isFeatured: newType === 'Featured' ? true : prev.isFeatured
    }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    const initialCategory = categories[0] || 'Kharghar New Projects';
    setCategoryInput(initialCategory);
    setShowCategorySuggestions(false);
    setForm({
      title: '',
      slug: '',
      category: initialCategory,
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
      features: [],
      highlights: 'Prime location near Palm Beach Road.',
      shortDescription: 'Prime location near Palm Beach Road.',
      longDescription: '',
      description: '',
      image: '',
      galleryImages: [],
      brochureUrl: '',
      floorPlanUrl: '',
      builderName: 'Jayshree Realty',
      builderExperience: '12+ Years',
      amenities: [],
      seoTitle: '',
      seoDescription: '',
      seoKeywords: ''
    });
    setNewAmenityInput('');
    setLongDescTab('edit');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: PropertyItem) => {
    setEditingId(proj.id);
    const shortVal = proj.highlights || proj.shortDescription || '';
    const longVal = proj.longDescription !== undefined ? proj.longDescription : (proj.description || '');
    const currentAmenities = proj.amenities && proj.amenities.length > 0 ? proj.amenities : (proj.features || []);
    setCategoryInput(proj.category || '');
    setShowCategorySuggestions(false);
    setForm({
      ...proj,
      category: proj.category || '',
      type: proj.type || 'New Launch',
      highlights: shortVal,
      shortDescription: shortVal,
      longDescription: longVal,
      description: longVal,
      amenities: currentAmenities,
      features: currentAmenities,
      galleryImages: proj.galleryImages && proj.galleryImages.length > 0 ? proj.galleryImages : [proj.image]
    });
    setNewAmenityInput('');
    setLongDescTab('edit');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location) return;

    const finalCategory = (categoryInput || form.category || 'Kharghar New Projects').trim();
    if (finalCategory && !categories.includes(finalCategory)) {
      try {
        await addCategory(finalCategory);
      } catch (err) {
        console.error('Error adding new category:', err);
      }
    }

    const finalImage = form.image || (form.galleryImages && form.galleryImages.length > 0 ? form.galleryImages[0] : '');
    const shortVal = (form.highlights || form.shortDescription || '').trim();
    const longVal = (form.longDescription !== undefined ? form.longDescription : (form.description || '')).trim();
    const finalAmenities = form.amenities || [];

    const payload = {
      ...form,
      category: finalCategory,
      type: form.type || 'New Launch',
      highlights: shortVal,
      shortDescription: shortVal,
      longDescription: longVal,
      description: longVal,
      amenities: finalAmenities,
      features: finalAmenities,
      image: finalImage,
      galleryImages: form.galleryImages && form.galleryImages.length > 0 ? form.galleryImages : (finalImage ? [finalImage] : [])
    };

    if (editingId) {
      await updateProject(editingId, payload);
    } else {
      await addProject(payload as Omit<PropertyItem, 'id'>);
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

  // Unified Image Processor & Uploader (File picker, Drag & Drop, Clipboard Paste)
  const processAndUploadFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;

    const validFiles = files.filter(file => {
      return file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);
    });

    if (validFiles.length === 0) {
      setUploadMessage({
        type: 'error',
        text: 'Please select valid image files (JPG, PNG, WEBP, GIF, SVG).',
      });
      setTimeout(() => setUploadMessage(null), 4000);
      return;
    }

    setUploading(true);
    setUploadMessage({
      type: 'info',
      text: `Uploading ${validFiles.length} image${validFiles.length > 1 ? 's' : ''}...`,
    });

    try {
      let uploadedUrls: string[] = [];

      // 1. Try batch multiple upload if multiple files
      if (validFiles.length > 1 && api.uploadFiles) {
        const batchRes = await api.uploadFiles(validFiles);
        if (batchRes && batchRes.success && (batchRes.urls || batchRes.fileUrls)) {
          uploadedUrls = batchRes.urls || batchRes.fileUrls || [];
        }
      }

      // 2. Fallback to single upload per file if batch not available or failed
      if (uploadedUrls.length === 0) {
        for (const file of validFiles) {
          const res = await api.uploadFile(file);
          if (res && res.success && res.url) {
            uploadedUrls.push(res.url);
          } else {
            console.warn('[Upload single file issue]', res?.message);
          }
        }
      }

      if (uploadedUrls.length > 0) {
        setForm(prev => {
          const nextGallery = [...(prev.galleryImages || []), ...uploadedUrls];
          return {
            ...prev,
            galleryImages: nextGallery,
            image: prev.image || nextGallery[0] || uploadedUrls[0],
          };
        });
        setUploadMessage({
          type: 'success',
          text: `Successfully uploaded ${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''}!`,
        });
        setTimeout(() => setUploadMessage(null), 3500);
      } else {
        setUploadMessage({
          type: 'error',
          text: 'Upload failed. Please check file format and network.',
        });
        setTimeout(() => setUploadMessage(null), 4000);
      }
    } catch (err: any) {
      console.error('[Upload handler error]', err);
      setUploadMessage({
        type: 'error',
        text: err?.message || 'Upload failed. Please try again.',
      });
      setTimeout(() => setUploadMessage(null), 4000);
    } finally {
      setUploading(false);
      if (galleryFileInputRef.current) {
        galleryFileInputRef.current.value = '';
      }
    }
  };

  // Upload Additional Gallery Images File
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processAndUploadFiles(Array.from(files));
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

  // Drag and Drop Handlers with Visual Feedback & External URL Support
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDropFiles = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);

    // 1. Files dropped directly from system / explorer
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processAndUploadFiles(Array.from(e.dataTransfer.files));
      return;
    }

    // 2. Image link dropped from external browser tab
    const droppedUrl = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (droppedUrl && /^https?:\/\/.+/i.test(droppedUrl.trim())) {
      const cleanUrl = droppedUrl.trim();
      setForm(prev => {
        const nextGallery = [...(prev.galleryImages || []), cleanUrl];
        return {
          ...prev,
          galleryImages: nextGallery,
          image: prev.image || nextGallery[0] || cleanUrl,
        };
      });
      setUploadMessage({
        type: 'success',
        text: 'External image link added to gallery!',
      });
      setTimeout(() => setUploadMessage(null), 3000);
    }
  };

  // Clipboard Paste Support (Ctrl+V) & Manual Paste Button
  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard) {
        setUploadMessage({ type: 'info', text: 'Press Ctrl+V on your keyboard to paste copied images directly.' });
        setTimeout(() => setUploadMessage(null), 3500);
        return;
      }
      if (navigator.clipboard.read) {
        try {
          const items = await navigator.clipboard.read();
          const imageFiles: File[] = [];
          for (const item of items) {
            for (const type of item.types) {
              if (type.startsWith('image/')) {
                const blob = await item.getType(type);
                const ext = type.split('/')[1]?.replace('+xml', '') || 'png';
                const file = new File([blob], `clipboard_image_${Date.now()}.${ext}`, { type });
                imageFiles.push(file);
              }
            }
          }
          if (imageFiles.length > 0) {
            await processAndUploadFiles(imageFiles);
            return;
          }
        } catch (_) {}
      }
      if (navigator.clipboard.readText) {
        const text = (await navigator.clipboard.readText()).trim();
        if (text && /^https?:\/\/.+/i.test(text)) {
          setForm(prev => {
            const nextGallery = [...(prev.galleryImages || []), text];
            return {
              ...prev,
              galleryImages: nextGallery,
              image: prev.image || nextGallery[0] || text,
            };
          });
          setUploadMessage({ type: 'success', text: 'Pasted image URL added to gallery!' });
          setTimeout(() => setUploadMessage(null), 3000);
          return;
        }
      }
      setUploadMessage({ type: 'info', text: 'No image found in clipboard. Copy an image or URL and press Ctrl+V.' });
      setTimeout(() => setUploadMessage(null), 3500);
    } catch (e: any) {
      setUploadMessage({ type: 'info', text: 'Press Ctrl+V on your keyboard to paste copied images directly.' });
      setTimeout(() => setUploadMessage(null), 3500);
    }
  };

  // Global Clipboard paste listener while modal is open
  useEffect(() => {
    if (!isModalOpen) return;

    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items || items.length === 0) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob) {
            const ext = blob.type.split('/')[1]?.replace('+xml', '') || 'png';
            const file = new File([blob], `pasted_image_${Date.now()}_${i + 1}.${ext}`, { type: blob.type });
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        processAndUploadFiles(imageFiles);
        return;
      }

      // If pasting text, only auto-add as image if user isn't currently typing in an input/textarea
      const activeEl = document.activeElement;
      const isTextInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
      if (!isTextInput) {
        const text = e.clipboardData?.getData('text/plain')?.trim();
        if (text && /^https?:\/\/.+/i.test(text)) {
          if (/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(text) || text.includes('images.pexels.com') || text.includes('unsplash.com')) {
            e.preventDefault();
            setForm(prev => {
              const nextGallery = [...(prev.galleryImages || []), text];
              return {
                ...prev,
                galleryImages: nextGallery,
                image: prev.image || nextGallery[0] || text,
              };
            });
            setUploadMessage({ type: 'success', text: 'Pasted image URL added to gallery!' });
            setTimeout(() => setUploadMessage(null), 3000);
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
    };
  }, [isModalOpen]);

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
                <img
                  src={proj.image || (proj.galleryImages && proj.galleryImages.length > 0 ? proj.galleryImages[0] : '')}
                  alt={proj.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedLive && target.src.includes('/uploads/') && !window.location.hostname.includes('jayshreerealty.com')) {
                      target.dataset.triedLive = 'true';
                      const uploadIdx = target.src.indexOf('/uploads/');
                      target.src = `https://jayshreerealty.com${target.src.substring(uploadIdx)}`;
                      return;
                    }
                    if (!target.dataset.triedDefault) {
                      target.dataset.triedDefault = 'true';
                      target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                    }
                  }}
                />
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
                onClick={() => setConfirmDeleteId(proj.id)}
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
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl w-full max-w-4xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
            {/* Pinned Sticky Header with Fixed Close Button */}
            <div className="sticky top-0 z-40 bg-[#0d1527] border-b border-slate-800 px-6 sm:px-8 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#c5a059] animate-pulse"></div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                  {editingId ? 'Edit Property Listing' : 'Create New Property Listing'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shadow-md border border-slate-700/60"
                title="Close Form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
              <form onSubmit={handleSave} className="space-y-6 text-xs">
                {/* Basic Details */}
                <div className="space-y-3">
                  <div className="font-serif font-bold text-slate-300 uppercase text-[11px] tracking-wider text-[#c5a059]">
                    1. General Information
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <label className="block text-slate-300 mb-1">Property Type *</label>
                      <select
                        value={form.type || 'New Launch'}
                        onChange={(e) => handleTypeChange(e.target.value as any)}
                        className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
                      >
                        <option value="New Launch">New Launch (New Projects)</option>
                        <option value="Resale">Resale (CIDCO / Ready Resale)</option>
                        <option value="Commercial">Commercial (Office / Shop / Workspace)</option>
                        <option value="Township">Township (Integrated 4-10 Acre)</option>
                        <option value="Featured">Featured (Prime Spotlight)</option>
                        <option value="Luxury">Luxury (Ultra Premium)</option>
                      </select>
                    </div>

                    {/* Project Category Combobox */}
                    <div className="relative" ref={categorySuggestionsRef}>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-slate-300">Project Category *</label>
                        <span className="text-[10px] text-[#c5a059]">Type or select</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={categoryInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCategoryInput(val);
                            setForm(prev => ({ ...prev, category: val }));
                            setShowCategorySuggestions(true);
                          }}
                          onFocus={() => setShowCategorySuggestions(true)}
                          placeholder="Type or select category..."
                          className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 pr-8 text-white focus:outline-none focus:border-[#c5a059]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCategorySuggestions(prev => !prev)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#c5a059]"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Suggestions list */}
                      {showCategorySuggestions && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto bg-[#070b19] border border-[#c5a059]/50 rounded-xl shadow-2xl z-50 divide-y divide-slate-800">
                          {categoryInput.trim() && !categories.some(c => c.toLowerCase() === categoryInput.trim().toLowerCase()) && (
                            <button
                              type="button"
                              onClick={() => {
                                const custom = categoryInput.trim();
                                setCategoryInput(custom);
                                setForm(prev => ({ ...prev, category: custom }));
                                setShowCategorySuggestions(false);
                              }}
                              className="w-full text-left px-3.5 py-2.5 text-xs text-[#c5a059] bg-[#c5a059]/10 hover:bg-[#c5a059]/20 font-semibold flex items-center justify-between"
                            >
                              <span>+ Use custom: &quot;{categoryInput.trim()}&quot;</span>
                              <span className="text-[10px] uppercase font-bold tracking-wider">New</span>
                            </button>
                          )}
                          {categories.filter(c => c.toLowerCase().includes(categoryInput.toLowerCase().trim())).length > 0 ? (
                            categories.filter(c => c.toLowerCase().includes(categoryInput.toLowerCase().trim())).map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => {
                                  setCategoryInput(cat);
                                  setForm(prev => ({ ...prev, category: cat }));
                                  setShowCategorySuggestions(false);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                                  categoryInput === cat ? 'bg-[#c5a059]/15 text-[#c5a059] font-bold' : 'text-slate-200'
                                }`}
                              >
                                <span>{cat}</span>
                                {categoryInput === cat && <Check className="w-3.5 h-3.5 text-[#c5a059]" />}
                              </button>
                            ))
                          ) : (
                            <div className="p-3 text-center text-[11px] text-slate-400">
                              No matching preset categories. Typing custom category allowed!
                            </div>
                          )}
                        </div>
                      )}
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
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="font-serif font-bold text-slate-300 uppercase text-[11px] tracking-wider text-[#c5a059] flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5" /> 2. Images & Drag & Drop Upload Zone
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold text-[11px] flex items-center gap-1.5 border border-slate-700 transition-colors shadow-sm"
                      title="Paste copied image or URL from clipboard"
                    >
                      <Clipboard className="w-3.5 h-3.5 text-[#c5a059]" /> Paste Image (Ctrl+V)
                    </button>
                    <button
                      type="button"
                      onClick={handleAddGalleryField}
                      className="btn-gold px-3 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Another Image Field
                    </button>
                  </div>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDropFiles}
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-[#c5a059] bg-[#c5a059]/15 ring-4 ring-[#c5a059]/30 scale-[1.01]'
                      : uploading
                      ? 'border-amber-500/60 bg-amber-500/5'
                      : 'border-slate-700 hover:border-[#c5a059] bg-[#070b19]/60 hover:bg-[#070b19]/90'
                  }`}
                  onClick={() => {
                    if (!uploading) galleryFileInputRef.current?.click();
                  }}
                >
                  <input
                    type="file"
                    ref={galleryFileInputRef}
                    onChange={handleGalleryFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  {uploading ? (
                    <div className="flex flex-col items-center justify-center py-2 pointer-events-none">
                      <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin mb-2" />
                      <p className="font-semibold text-white text-xs">Uploading images to server...</p>
                      <p className="text-[10px] text-slate-400 mt-1">Please wait while files are processed and synced</p>
                    </div>
                  ) : isDragging ? (
                    <div className="flex flex-col items-center justify-center py-2 pointer-events-none">
                      <Upload className="w-9 h-9 text-[#c5a059] animate-bounce mb-2" />
                      <p className="font-bold text-[#c5a059] text-sm">Release to Drop & Upload Images Now!</p>
                      <p className="text-[10px] text-slate-300 mt-1">Supports multiple image files or image URLs</p>
                    </div>
                  ) : (
                    <div className="pointer-events-none">
                      <Upload className="w-8 h-8 text-[#c5a059] mx-auto mb-2 transition-transform group-hover:scale-110" />
                      <p className="font-semibold text-slate-200 text-xs">
                        Drag & drop images here, click to browse, or paste with <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-[10px] font-mono text-[#c5a059]">Ctrl+V</kbd>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Supports JPG, PNG, WEBP, SVG • Multi-file selection & direct clipboard paste enabled
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Status Banner */}
                {uploadMessage && (
                  <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                    uploadMessage.type === 'success'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : uploadMessage.type === 'error'
                      ? 'bg-red-950/60 border-red-500/40 text-red-300'
                      : 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                  }`}>
                    {uploadMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
                    {uploadMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />}
                    {uploadMessage.type === 'info' && <Loader2 className="w-4 h-4 shrink-0 text-blue-400 animate-spin" />}
                    <span>{uploadMessage.text}</span>
                  </div>
                )}

                <div className="p-4 bg-[#070b19] border border-slate-800 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-slate-300">Property Image Gallery List ({ (form.galleryImages || []).length } Images):</div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {(form.galleryImages || []).length === 0 ? (
                      <div className="py-4 text-center text-xs text-slate-500 border border-dashed border-slate-800/80 rounded-xl bg-[#090e1f]/50">
                        No images added yet. Click &quot;+ ADD ANOTHER IMAGE FIELD&quot; or upload files above.
                      </div>
                    ) : (
                      (form.galleryImages || []).map((url, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#0d1527] p-2 rounded-xl border border-slate-800">
                        <span className="font-mono text-slate-400 text-[10px] w-6">#{idx + 1}</span>
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => handleUpdateGalleryUrl(idx, e.target.value)}
                          placeholder="Image URL or uploaded file path..."
                          className="flex-1 bg-[#070b19] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                        />
                        {url && (
                          <img
                            src={url}
                            alt=""
                            className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0 bg-slate-900"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.dataset.triedFallback) {
                                target.dataset.triedFallback = 'true';
                                target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80';
                              }
                            }}
                          />
                        )}
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
                    )))}
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-300 font-semibold text-xs">Highlights / Short Description</label>
                    <span className="text-[10px] text-amber-400">Card Badge & Quick Summary</span>
                  </div>
                  <input
                    type="text"
                    value={form.highlights || form.shortDescription || ''}
                    onChange={(e) => setForm({ ...form, highlights: e.target.value, shortDescription: e.target.value })}
                    placeholder="e.g. Prime location near Palm Beach Road & Seawoods Station..."
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c5a059]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Short highlighted line displayed prominently on property cards & full details.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-slate-200 font-semibold text-xs text-[#c5a059]">
                      Full Detailed Property Overview / Long Description
                    </label>

                    {/* Edit / Preview Tabs */}
                    <div className="flex items-center bg-[#070b19] p-0.5 rounded-lg border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setLongDescTab('edit')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          longDescTab === 'edit'
                            ? 'bg-[#c5a059] text-[#070b19]'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        ✏️ Edit Text
                      </button>
                      <button
                        type="button"
                        onClick={() => setLongDescTab('preview')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          longDescTab === 'preview'
                            ? 'bg-[#c5a059] text-[#070b19]'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        👁️ Live Preview
                      </button>
                    </div>
                  </div>

                  {/* Rich Text Quick Formatting Toolbar */}
                  {longDescTab === 'edit' && (
                    <div className="p-2 bg-[#070b19] border border-slate-700/80 rounded-xl flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-1">Style Tools:</span>

                      <button
                        type="button"
                        onClick={() => insertLongDescFormat('**', '**', 'Bold Text')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold border border-slate-700 flex items-center gap-1 transition-colors"
                        title="Bold Text (**text**)"
                      >
                        <Bold className="w-3 h-3 text-[#c5a059]" /> Bold
                      </button>

                      <button
                        type="button"
                        onClick={() => insertLongDescFormat('# ', '', 'Major Heading')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
                        title="Main Heading (# Title)"
                      >
                        <Heading className="w-3 h-3 text-[#c5a059]" /> H1 Title
                      </button>

                      <button
                        type="button"
                        onClick={() => insertLongDescFormat('### ', '', 'Section Highlights')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
                        title="Sub-heading (### Section)"
                      >
                        <Heading className="w-3 h-3 text-amber-300" /> H2 Section
                      </button>

                      <button
                        type="button"
                        onClick={() => insertLongDescFormat('• ', '', 'Premium amenity or key specification')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
                        title="Bullet List Item (• Point)"
                      >
                        <List className="w-3 h-3 text-[#c5a059]" /> Bullet Point
                      </button>

                      <button
                        type="button"
                        onClick={() => insertLongDescFormat('\n\n', '', '')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
                        title="Line Break / Enter"
                      >
                        <CornerDownLeft className="w-3 h-3 text-emerald-400" /> Enter / Line Break
                      </button>

                      <button
                        type="button"
                        onClick={() => insertLongDescFormat('Rera-PMI', '', '270002500457')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[#e5c178] rounded text-xs font-mono font-bold border border-[#c5a059]/40 flex items-center gap-1 transition-colors"
                        title="RERA Registration Tag"
                      >
                        <ShieldCheck className="w-3 h-3 text-[#c5a059]" /> RERA Badge
                      </button>

                      {/* Color Formatting Tools */}
                      <div className="w-full pt-2 mt-1 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-wider mr-1">Color Tools:</span>
                        
                        <button
                          type="button"
                          onClick={() => insertLongDescFormat('[color:gold]', '[/color]', 'Gold Text')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-[#e5c178] rounded text-xs font-semibold border border-[#c5a059]/40 flex items-center gap-1 transition-colors"
                          title="Gold Accent ([color:gold]text[/color])"
                        >
                          🟡 Gold
                        </button>

                        <button
                          type="button"
                          onClick={() => insertLongDescFormat('[color:emerald]', '[/color]', 'Green Text')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-xs font-semibold border border-emerald-500/30 flex items-center gap-1 transition-colors"
                          title="Emerald Green ([color:emerald]text[/color])"
                        >
                          🟢 Emerald
                        </button>

                        <button
                          type="button"
                          onClick={() => insertLongDescFormat('[color:blue]', '[/color]', 'Blue Text')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded text-xs font-semibold border border-blue-500/30 flex items-center gap-1 transition-colors"
                          title="Royal Blue ([color:blue]text[/color])"
                        >
                          🔵 Blue
                        </button>

                        <button
                          type="button"
                          onClick={() => insertLongDescFormat('[color:red]', '[/color]', 'Red Text')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded text-xs font-semibold border border-rose-500/30 flex items-center gap-1 transition-colors"
                          title="Crimson Red ([color:red]text[/color])"
                        >
                          🔴 Red
                        </button>

                        <button
                          type="button"
                          onClick={() => insertLongDescFormat('[color:amber]', '[/color]', 'Amber Text')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-xs font-semibold border border-amber-500/30 flex items-center gap-1 transition-colors"
                          title="Warm Amber ([color:amber]text[/color])"
                        >
                          🟠 Amber
                        </button>

                        <button
                          type="button"
                          onClick={() => insertLongDescFormat('[color:purple]', '[/color]', 'Purple Text')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded text-xs font-semibold border border-purple-500/30 flex items-center gap-1 transition-colors"
                          title="Purple ([color:purple]text[/color])"
                        >
                          🟣 Purple
                        </button>

                        <button
                          type="button"
                          onClick={() => insertLongDescFormat('[color:gray]', '[/color]', 'Muted Note')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded text-xs font-normal border border-slate-700 flex items-center gap-1 transition-colors"
                          title="Muted Gray ([color:gray]text[/color])"
                        >
                          ⚪ Gray
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Textarea for Editing */}
                  {longDescTab === 'edit' ? (
                    <textarea
                      ref={longDescRef}
                      rows={6}
                      value={form.longDescription !== undefined ? form.longDescription : (form.description || '')}
                      onChange={(e) => setForm({ ...form, longDescription: e.target.value, description: e.target.value })}
                      placeholder={"Write complete property overview, RERA details, and project highlights...\n\nExample:\nRera-PMI270002500457\n\n### Exclusive Highlights:\n• [color:gold]Prime 30m Coastal Road frontage[/color]\n• State-of-the-art Italian marble flooring\n• Grand double-height entrance lobby"}
                      className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-3 text-white font-sans text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-[#c5a059]"
                    />
                  ) : (
                    /* Live Preview Box */
                    <div className="bg-[#070b19] border border-[#c5a059]/40 rounded-xl p-4 min-h-[160px] max-h-72 overflow-y-auto">
                      <div className="text-[10px] uppercase font-mono text-[#c5a059] font-bold pb-2 mb-2 border-b border-slate-800">
                        Live Preview (Exact Website Rendering):
                      </div>
                      <FormattedDescription
                        text={form.longDescription || form.description || ''}
                        isLight={false}
                      />
                      {!(form.longDescription || form.description) && (
                        <p className="text-xs text-slate-500 italic">No description entered yet. Switch to "Edit Text" and type your overview.</p>
                      )}
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400">
                    💡 <strong>Enter key</strong> press karne par website card aur full view mai automatic new line banegi. Text select karke <strong>Style Tools</strong> ya <strong>Color Tools</strong> click karein.
                  </p>
                </div>

              </div>

              {/* 4. Luxury Amenities & Key Features Management */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="font-serif font-bold text-slate-300 uppercase text-[11px] tracking-wider text-[#c5a059]">
                    4. Luxury Amenities & Key Features Management
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {(form.amenities || []).length} Amenities Added
                  </span>
                </div>

                {/* Currently Assigned Amenities List */}
                <div className="bg-[#070b19] border border-slate-700/80 rounded-xl p-3.5 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Active Property Amenities (Click ✕ to remove):
                  </span>
                  
                  {(form.amenities && form.amenities.length > 0) ? (
                    <div className="flex flex-wrap gap-2">
                      {form.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-[#c5a059]/40 text-xs font-medium text-slate-200 shadow-sm"
                        >
                          <Check className="w-3 h-3 text-[#c5a059]" />
                          <span>{amenity}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAmenity(amenity)}
                            className="p-0.5 hover:bg-red-500/20 hover:text-red-400 rounded-full text-slate-400 transition-colors ml-0.5"
                            title={`Remove ${amenity}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No amenities added yet. Type below or click popular suggestions to add.</p>
                  )}
                </div>

                {/* Add Custom Amenity Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newAmenityInput}
                    onChange={(e) => setNewAmenityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAmenity(newAmenityInput);
                      }
                    }}
                    placeholder="Type custom amenity (e.g. Italian Marble Flooring, Infinity Pool...)"
                    className="flex-1 bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddAmenity(newAmenityInput)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-[#c5a059] text-white hover:text-[#070b19] rounded-xl text-xs font-bold border border-slate-700 transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Amenity
                  </button>
                </div>

                {/* Popular Amenities Suggestions */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Quick Add Suggestions (Click to Add / Toggle):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_AMENITIES.map((name, idx) => {
                      const isAdded = (form.amenities || []).includes(name);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => isAdded ? handleRemoveAmenity(name) : handleAddAmenity(name)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                            isAdded
                              ? 'bg-[#c5a059]/20 border-[#c5a059] text-[#e5c178] font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                          }`}
                        >
                          {isAdded ? <Check className="w-3 h-3 text-[#c5a059]" /> : <Plus className="w-3 h-3" />}
                          {name}
                        </button>
                      );
                    })}
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Are you sure you want to continue?"
        message="This action will move the selected property to Trash."
        onConfirm={() => {
          if (confirmDeleteId) deleteProject(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};
