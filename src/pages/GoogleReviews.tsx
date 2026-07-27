import React from 'react';
import { SEOHead } from '../components/SEOHead';
import { GOOGLE_REVIEWS_DATA } from '../data/reviewsData';
import { ReviewCard } from '../components/ReviewCard';
import { Star, ShieldCheck, CheckCircle2, Award, ExternalLink } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

export const GoogleReviews: React.FC = () => {
  const { openModal } = useLeads();

  return (
    <div className="min-h-screen bg-[#070b19] pt-28 pb-20">
      <SEOHead
        title="Google Reviews | 4.8 Rating Jayshree Realty Nerul"
        description="Read top 10 verified Google customer reviews for Jayshree Realty real estate consultant in Nerul Navi Mumbai."
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="badge-gold">100% Authentic Customer Feedback</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Client <span className="text-gradient-gold">Google Reviews</span>
          </h1>
          <p className="text-sm text-slate-300 font-outfit">
            Read real experience testimonials from homebuyers and sellers who dealt with Jayshree Realty.
          </p>
        </div>

        {/* Rating Summary Box */}
        <div className="bg-glass p-8 rounded-3xl border border-[#c5a059]/40 max-w-3xl mx-auto mb-16 text-center font-outfit shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="text-center sm:text-left">
              <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Overall Rating</span>
              <div className="flex items-center gap-3">
                <span className="font-serif text-5xl font-extrabold text-gradient-gold">4.8</span>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#c5a059] text-[#c5a059]" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-300">Based on 21+ Google Reviews</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 text-left border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#25d366]" />
                <span>Responsive & Polite Team (Abhishek Padwal & Sunil)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#25d366]" />
                <span>Transparent Paperwork & Accurate Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#25d366]" />
                <span>Free Transport Facility for Property Visits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top 10 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {GOOGLE_REVIEWS_DATA.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="text-center pt-8 border-t border-slate-800/80">
          <button onClick={() => openModal('Reviews Page CTA')} className="btn-gold px-8 py-3.5 text-xs font-bold">
            EXPERIENCE OUR LUXURY ADVISORY SERVICE NOW
          </button>
        </div>
      </div>
    </div>
  );
};
