import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { GoogleReviewItem, LeadershipProfile, VideoTestimonialItem } from '../../types';
import { Star, Plus, Edit3, Trash2, Check, X, ShieldCheck, Users, Video, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { DEFAULT_LEADERSHIP, DEFAULT_VIDEO_TESTIMONIALS } from '../../context/DataContext';
import { api } from '../../services/api';

export const ReviewsCMSView: React.FC = () => {
  const {
    reviews, addReview, updateReview, deleteReview,
    leadership, addLeadershipProfile, updateLeadershipProfile, deleteLeadershipProfile,
    videoTestimonials, saveVideoTestimonial, deleteVideoTestimonial
  } = useData();

  const [activeTab, setActiveTab] = useState<'reviews' | 'leadership' | 'videos'>('reviews');

  // Google Reviews State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<GoogleReviewItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [reviewForm, setReviewForm] = useState<Partial<GoogleReviewItem>>({
    author: '',
    rating: 5,
    timeAgo: '1 week ago',
    content: '',
    avatarColor: 'bg-amber-600',
    verified: true,
    reviewsCount: 'Verified Client',
    isLocalGuide: true,
    published: true
  });

  // Leadership State
  const activeLeadership = (leadership && leadership.length > 0) ? leadership : DEFAULT_LEADERSHIP;
  const [editingProfile, setEditingProfile] = useState<LeadershipProfile | null>(null);
  const [isLeadershipModalOpen, setIsLeadershipModalOpen] = useState(false);
  const [confirmDeleteProfileId, setConfirmDeleteProfileId] = useState<string | null>(null);

  // Video Testimonials State
  const activeVideos = (videoTestimonials && videoTestimonials.length > 0) ? videoTestimonials : DEFAULT_VIDEO_TESTIMONIALS;
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoTestimonialItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const [videoForm, setVideoForm] = useState<Partial<VideoTestimonialItem>>({
    clientName: '',
    location: '',
    title: '',
    youtubeUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
  });

  // Handle Review Actions
  const handleOpenAddReview = () => {
    setEditingReview(null);
    setReviewForm({
      author: '', rating: 5, timeAgo: 'Recently', content: '',
      avatarColor: 'bg-amber-600', verified: true, reviewsCount: 'Verified Client', isLocalGuide: true, published: true
    });
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author || !reviewForm.content) return;

    if (editingReview) {
      await updateReview(editingReview.id, reviewForm);
    } else {
      await addReview(reviewForm as Omit<GoogleReviewItem, 'id'>);
    }
    setIsReviewModalOpen(false);
  };

  // Handle Leadership Actions
  const handleOpenEditLeadership = (profile: LeadershipProfile) => {
    setEditingProfile(profile);
    setIsLeadershipModalOpen(true);
  };

  const handleSaveLeadership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    const isNew = !activeLeadership.find(p => p.id === editingProfile.id);
    
    if (isNew) {
      await addLeadershipProfile(editingProfile);
    } else {
      await updateLeadershipProfile(editingProfile.id, editingProfile);
    }
    setIsLeadershipModalOpen(false);
  };

  const handleAddLeadership = () => {
    const newProfile: LeadershipProfile = {
      id: `lead-${Date.now()}`,
      role: 'Founder',
      name: '',
      designation: '',
      image: '',
      description: '',
      achievements: '',
      officeLocation: '',
      experience: '',
      badges: []
    };
    setEditingProfile(newProfile);
    setIsLeadershipModalOpen(true);
  };

  const handleDeleteLeadership = async (id: string) => {
    await deleteLeadershipProfile(id);
    setConfirmDeleteProfileId(null);
  };

  // Handle Video Actions
  const handleOpenAddVideo = () => {
    setEditingVideo(null);
    setVideoForm({
      clientName: '', location: '', title: '', youtubeUrl: '',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    });
    setIsVideoModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.youtubeUrl) return;

    const newVideo: VideoTestimonialItem = {
      id: editingVideo ? editingVideo.id : `vvid-${Date.now()}`,
      clientName: videoForm.clientName || 'Valued Client',
      location: videoForm.location || 'Navi Mumbai',
      title: videoForm.title,
      youtubeUrl: videoForm.youtubeUrl,
      thumbnail: videoForm.thumbnail || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
      sortOrder: editingVideo ? editingVideo.sortOrder : activeVideos.length
    };

    await saveVideoTestimonial(newVideo);
    setIsVideoModalOpen(false);
  };

  const handleDeleteVideo = async (id: string) => {
    await deleteVideoTestimonial(id);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await api.uploadFile(file);
      const uploadedUrl = res.url || res.fileUrl;
      if (res.success && uploadedUrl) {
        if (field === 'thumbnail') {
          setVideoForm(prev => ({ ...prev, thumbnail: uploadedUrl }));
        } else if (editingProfile) {
          setEditingProfile(prev => prev ? { ...prev, image: uploadedUrl } : prev);
        }
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-outfit">
      {/* Header & Sub-Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Reviews & Testimonials <span className="text-[#c5a059]">CMS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage Google customer reviews, Founder & CEO leadership cards, and video reviews with live sync.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0d1527] p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'reviews' ? 'bg-[#c5a059] text-[#070b19]' : 'text-slate-300 hover:text-white'
            }`}
          >
            Google Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('leadership')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'leadership' ? 'bg-[#c5a059] text-[#070b19]' : 'text-slate-300 hover:text-white'
            }`}
          >
            Founder & CEO Cards
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'videos' ? 'bg-[#c5a059] text-[#070b19]' : 'text-slate-300 hover:text-white'
            }`}
          >
            Video Reviews ({activeVideos.length})
          </button>
        </div>
      </div>

      {/* TAB 1: GOOGLE REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleOpenAddReview}
              className="btn-gold px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-[#0d1527] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${rev.avatarColor || 'bg-amber-600'} flex items-center justify-center text-white font-bold text-xs`}>
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{rev.author}</div>
                        <div className="text-[10px] text-slate-400">{rev.timeAgo}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => updateReview(rev.id, { published: !rev.published })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rev.published !== false ? 'bg-emerald-500 text-black' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {rev.published !== false ? 'Published' : 'Hidden'}
                    </button>
                  </div>

                  <div className="flex items-center text-amber-400 text-xs">
                    {'★'.repeat(rev.rating || 5)}
                  </div>

                  <p className="text-xs text-slate-300 italic line-clamp-3">
                    "{rev.content}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <button
                    onClick={() => { setEditingReview(rev); setReviewForm(rev); setIsReviewModalOpen(true); }}
                    className="text-[#c5a059] font-bold hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(rev.id)}
                    className="text-red-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FOUNDER & CEO MANAGEMENT */}
      {activeTab === 'leadership' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleAddLeadership}
              className="btn-gold px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeLeadership.map((prof) => (
              <div key={prof.id} className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-6 shadow-2xl space-y-4 font-outfit">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="badge-gold text-xs">{prof.role} Profile</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditLeadership(prof)}
                      className="btn-gold px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setConfirmDeleteProfileId(prof.id)}
                      className="px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/60"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {prof.image ? (
                    <img src={prof.image} alt={prof.name} className="w-24 h-28 object-cover rounded-xl border border-[#c5a059]" />
                  ) : (
                    <div className="w-24 h-28 rounded-xl border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-500 text-xs">No Image</div>
                  )}
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-white">{prof.name || 'Untitled'}</h3>
                    <p className="text-xs text-[#e5c178] font-semibold">{prof.designation}</p>
                    <p className="text-[11px] text-slate-400">{prof.experience}</p>
                    <p className="text-[11px] text-slate-400">{prof.officeLocation}</p>
                  </div>
                </div>

                {prof.description && (
                  <p className="text-xs text-slate-300 italic border-t border-slate-800 pt-3">
                    "{prof.description}"
                  </p>
                )}

                {prof.achievements && (
                  <div className="bg-[#070b19] p-3 rounded-xl border border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Achievements</span>
                    <span className="text-white font-semibold">{prof.achievements}</span>
                  </div>
                )}

                {prof.badges && prof.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {prof.badges.map((b: string, i: number) => (
                      <span key={i} className="bg-[#c5a059]/15 text-[#99732b] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c5a059]/30">{b}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Delete Profile Confirmation */}
          <ConfirmModal
            isOpen={!!confirmDeleteProfileId}
            title="Delete Leadership Profile?"
            message="This will permanently remove this profile from the website."
            onConfirm={() => {
              if (confirmDeleteProfileId) handleDeleteLeadership(confirmDeleteProfileId);
            }}
            onCancel={() => setConfirmDeleteProfileId(null)}
          />
        </div>
      )}

      {/* TAB 3: VIDEO REVIEWS MANAGEMENT */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleOpenAddVideo}
              className="btn-gold px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <Video className="w-4 h-4" /> Add Video Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeVideos.map((vid) => (
              <div key={vid.id} className="bg-[#0d1527] border border-[#c5a059]/30 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between font-outfit">
                <div className="relative h-48 bg-black">
                  <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="badge-gold text-xs">{vid.clientName}</span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] text-[#e5c178] font-bold block">{vid.location}</span>
                  <h3 className="font-serif text-white font-bold text-sm">{vid.title}</h3>
                  <p className="text-xs text-slate-400 truncate">{vid.youtubeUrl}</p>
                </div>

                <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <button
                    onClick={() => { setEditingVideo(vid); setVideoForm(vid); setIsVideoModalOpen(true); }}
                    className="text-[#c5a059] font-bold hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(vid.id)}
                    className="text-red-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leadership Edit Modal */}
      {isLeadershipModalOpen && editingProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-xl text-white">Edit {editingProfile.role} Profile</h3>
            <form onSubmit={handleSaveLeadership} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Designation *</label>
                <input
                  type="text"
                  required
                  value={editingProfile.designation}
                  onChange={(e) => setEditingProfile({ ...editingProfile, designation: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Profile Image URL / Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProfile.image}
                    onChange={(e) => setEditingProfile({ ...editingProfile, image: e.target.value })}
                    className="flex-1 bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                  <label className="btn-gold px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description / Bio</label>
                <textarea
                  rows={3}
                  value={editingProfile.description}
                  onChange={(e) => setEditingProfile({ ...editingProfile, description: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Achievements</label>
                <input
                  type="text"
                  value={editingProfile.achievements}
                  onChange={(e) => setEditingProfile({ ...editingProfile, achievements: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Office Location</label>
                <input
                  type="text"
                  value={editingProfile.officeLocation}
                  onChange={(e) => setEditingProfile({ ...editingProfile, officeLocation: e.target.value })}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsLeadershipModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
                <button type="submit" className="btn-gold px-4 py-2 rounded-xl font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-white">{editingVideo ? 'Edit Video Review' : 'Add Video Review'}</h3>
            <form onSubmit={handleSaveVideo} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  value={videoForm.title || ''}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. Seamless CIDCO Title Verification"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Client Name</label>
                <input
                  type="text"
                  value={videoForm.clientName || ''}
                  onChange={(e) => setVideoForm({ ...videoForm, clientName: e.target.value })}
                  placeholder="e.g. Rahul & Meera Deshmukh"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">YouTube URL / Embed URL *</label>
                <input
                  type="url"
                  required
                  value={videoForm.youtubeUrl || ''}
                  onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Thumbnail Image URL / Drag-and-drop</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={videoForm.thumbnail || ''}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                    className="flex-1 bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                  <label className="btn-gold px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsVideoModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
                <button type="submit" className="btn-gold px-4 py-2 rounded-xl font-bold">Save Video Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Review Edit/Add Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-outfit">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-xl text-white">
                {editingReview ? 'Edit Google Review' : 'Add New Google Review'}
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.author || ''}
                  onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                  placeholder="e.g. Satish Gamare"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={reviewForm.rating || 5}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:border-[#c5a059] outline-none"
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★☆)</option>
                    <option value={3}>3 Stars (★★★☆☆)</option>
                    <option value={2}>2 Stars (★★☆☆☆)</option>
                    <option value={1}>1 Star (★☆☆☆☆)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Time Ago</label>
                  <input
                    type="text"
                    value={reviewForm.timeAgo || 'Recently'}
                    onChange={(e) => setReviewForm({ ...reviewForm, timeAgo: e.target.value })}
                    placeholder="e.g. 2 weeks ago"
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:border-[#c5a059] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Review Content *</label>
                <textarea
                  rows={4}
                  required
                  value={reviewForm.content || ''}
                  onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                  placeholder="Write full review comment..."
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Avatar Color</label>
                  <select
                    value={reviewForm.avatarColor || 'bg-amber-600'}
                    onChange={(e) => setReviewForm({ ...reviewForm, avatarColor: e.target.value })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:border-[#c5a059] outline-none"
                  >
                    <option value="bg-amber-600">Amber / Gold</option>
                    <option value="bg-purple-600">Purple</option>
                    <option value="bg-indigo-600">Indigo</option>
                    <option value="bg-[#E91E63]">Pink</option>
                    <option value="bg-[#009688]">Teal</option>
                    <option value="bg-[#FF5722]">Orange</option>
                    <option value="bg-[#4CAF50]">Green</option>
                    <option value="bg-[#2196F3]">Blue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Reviews Sub-text</label>
                  <input
                    type="text"
                    value={reviewForm.reviewsCount || '1 review'}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewsCount: e.target.value })}
                    placeholder="e.g. 5 reviews • 2 photos"
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:border-[#c5a059] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewForm.verified !== false}
                    onChange={(e) => setReviewForm({ ...reviewForm, verified: e.target.checked })}
                    className="accent-[#c5a059] w-4 h-4"
                  />
                  <span>Verified Buyer</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(reviewForm.isLocalGuide)}
                    onChange={(e) => setReviewForm({ ...reviewForm, isLocalGuide: e.target.checked })}
                    className="accent-[#c5a059] w-4 h-4"
                  />
                  <span>Local Guide</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewForm.published !== false}
                    onChange={(e) => setReviewForm({ ...reviewForm, published: e.target.checked })}
                    className="accent-[#c5a059] w-4 h-4"
                  />
                  <span>Published</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-5 py-2 rounded-xl font-bold"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Review Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Are you sure you want to delete this review?"
        message="This action will delete the review."
        onConfirm={() => {
          if (confirmDeleteId) deleteReview(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};
