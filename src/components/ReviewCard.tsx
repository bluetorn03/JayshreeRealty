import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { GoogleReviewItem } from '../types';

interface ReviewCardProps {
  review: GoogleReviewItem;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:border-[#c5a059] transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden text-slate-800 shrink-0 w-[320px] sm:w-[380px]">
      
      {/* Background Quote Icon */}
      <Quote className="absolute top-4 right-4 w-10 h-10 text-[#c5a059]/10 group-hover:text-[#c5a059]/20 transition-colors" />

      <div>
        {/* Top Google Branding & Rating Stars */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-1.5">
            {/* Google 'G' Colored Logo Badge */}
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-[#4285F4]">
              G
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#fbbc04] text-[#fbbc04]" />
              ))}
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-outfit font-medium">{review.timeAgo}</span>
        </div>

        {/* Review Text */}
        <p className="text-xs sm:text-sm text-slate-700 font-outfit leading-relaxed mb-6 italic">
          "{review.content}"
        </p>
      </div>

      {/* Author Details */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
          style={{ backgroundColor: review.avatarColor || '#c5a059' }}
        >
          {review.author.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-outfit text-sm font-bold text-slate-900 truncate">{review.author}</h4>
            <span title="Verified Google Review">
              <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-outfit font-medium">
            <span>{review.reviewsCount || 'Verified Client'}</span>
            {review.isLocalGuide && (
              <span className="text-[#99732b] font-bold">• Local Guide</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
