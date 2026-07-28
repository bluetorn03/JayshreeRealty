import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { GoogleReviewItem } from '../../types';
import { Star, Plus, Edit3, Trash2, Check, X, ShieldCheck } from 'lucide-react';

export const ReviewsCMSView: React.FC = () => {
  const { reviews, addReview, updateReview, deleteReview } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<GoogleReviewItem | null>(null);

  const [form, setForm] = useState<Partial<GoogleReviewItem>>({
    author: '',
    rating: 5,
    timeAgo: '1 week ago',
    content: '',
    avatarColor: 'bg-amber-600',
    verified: true,
    reviewsCount: '12 reviews',
    isLocalGuide: true,
    published: true
  });

  const handleOpenAdd = () => {
    setEditingReview(null);
    setForm({
      author: '',
      rating: 5,
      timeAgo: 'Recently',
      content: '',
      avatarColor: 'bg-amber-600',
      verified: true,
      reviewsCount: 'Verified Customer',
      isLocalGuide: true,
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rev: GoogleReviewItem) => {
    setEditingReview(rev);
    setForm(rev);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author || !form.content) return;

    if (editingReview) {
      await updateReview(editingReview.id, form);
    } else {
      await addReview(form as Omit<GoogleReviewItem, 'id'>);
    }
    setIsModalOpen(false);
  };

  const togglePublished = async (rev: GoogleReviewItem) => {
    await updateReview(rev.id, { published: !rev.published });
  };

  return (
    <div className="space-y-6 font-outfit">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Google Reviews <span className="text-[#c5a059]">CMS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage verified client testimonials, ratings, and Google review badges displayed on the homepage.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Review
        </button>
      </div>

      {/* Reviews Grid */}
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
                    <div className="text-[10px] text-slate-400">{rev.timeAgo} • {rev.reviewsCount}</div>
                  </div>
                </div>
                <button
                  onClick={() => togglePublished(rev)}
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
                onClick={() => handleOpenEdit(rev)}
                className="text-[#c5a059] font-bold hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => deleteReview(rev.id)}
                className="text-red-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-white">
              {editingReview ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={form.author || ''}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="e.g. Rajesh Kulkarni"
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={form.rating || 5}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Time Ago</label>
                  <input
                    type="text"
                    value={form.timeAgo || ''}
                    onChange={(e) => setForm({ ...form, timeAgo: e.target.value })}
                    placeholder="e.g. 2 weeks ago"
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Review Content *</label>
                <textarea
                  rows={4}
                  required
                  value={form.content || ''}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Excellent real estate consultancy in Nerul..."
                  className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-4 py-2 rounded-xl font-bold"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
