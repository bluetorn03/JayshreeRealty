import React from 'react';
import { MapPin, Calendar, MessageSquare, Phone, ArrowUpRight, Sparkles, Building2 } from 'lucide-react';
import { PropertyItem } from '../types';
import { useLeads } from '../context/LeadContext';

interface ProjectCardProps {
  property: PropertyItem;
  theme?: 'dark' | 'light';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ property, theme = 'light' }) => {
  const { openModal } = useLeads();
  const whatsappUrl = `https://wa.me/918169005579?text=Hello,%20I%20am%20interested%20in%20${encodeURIComponent(
    property.title + ' (' + property.location + ')'
  )}%20from%20Jayshree%20Realty.`;

  const isLight = theme === 'light';

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col group ${
        isLight
          ? 'bg-white border border-amber-200/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-[#c5a059]'
          : 'bg-[#0d1527] border border-[#c5a059]/30 shadow-2xl hover:border-[#c5a059]'
      }`}
    >
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-900">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b]/90 via-black/20 to-black/30"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-10">
          {/* Category Badge */}
          <span className="badge-gold font-outfit shadow-md backdrop-blur-md text-[11px] font-bold">
            {property.category}
          </span>
          
          {/* Property Type Badge (Replaces fixed 0% Brokerage badge) */}
          <span className="bg-[#0b132b]/90 border border-[#c5a059]/40 text-[#e5c178] px-2.5 py-0.5 rounded-full text-[11px] font-outfit font-semibold shadow-md backdrop-blur-md">
            {property.type}
          </span>

          {/* Brokerage Badge ONLY if explicitly enabled in Admin (property.brokerageFree === true) */}
          {property.brokerageFree === true && (
            <span className="badge-emerald font-outfit shadow-md backdrop-blur-md text-[11px]">
              0% Brokerage
            </span>
          )}
        </div>

        {/* Property Code Badge if present */}
        {property.code && (
          <div className="absolute top-3 right-3 bg-[#070b19]/90 border border-[#c5a059]/40 text-[#e5c178] px-2.5 py-1 rounded-md text-xs font-mono font-bold">
            {property.code}
          </div>
        )}

        {/* Price Overlay on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
          <div>
            <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-outfit font-medium">Starting Price</span>
            <span className="font-serif text-xl font-bold text-white tracking-wide">{property.price}</span>
          </div>
          {property.isFeatured && (
            <span className="text-[11px] bg-[#c5a059] text-[#070b19] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 font-outfit shadow-lg">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3
            className={`font-serif text-lg font-bold leading-snug mb-1.5 transition-colors ${
              isLight
                ? 'text-slate-900 group-hover:text-[#99732b]'
                : 'text-white group-hover:text-[#e5c178]'
            }`}
          >
            {property.title}
          </h3>
          
          <p
            className={`text-xs flex items-center gap-1.5 font-outfit mb-3 font-medium ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
            {property.location}
          </p>

          {/* Quick Specs Grid */}
          <div
            className={`grid grid-cols-2 gap-2 p-3 rounded-xl border text-xs font-outfit ${
              isLight
                ? 'bg-slate-50 border-slate-200/80 text-slate-700'
                : 'bg-[#070b19]/60 border-slate-800 text-slate-200'
            }`}
          >
            <div>
              <span className={`text-[10px] uppercase block font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Config</span>
              <span className="font-bold">{property.configuration}</span>
            </div>
            <div>
              <span className={`text-[10px] uppercase block font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Carpet Area</span>
              <span className="font-bold">{property.area}</span>
            </div>
            {property.possession && (
              <div className={`col-span-2 pt-1.5 mt-1 border-t flex items-center gap-1.5 ${isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-300'}`}>
                <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                <span className="text-[11px] font-medium">{property.possession}</span>
              </div>
            )}
          </div>

          {/* Highlights */}
          {property.highlights && (
            <p className={`text-xs font-outfit italic pt-3 line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              "{property.highlights}"
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`pt-3 border-t flex items-center gap-2 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
          <button
            onClick={() => openModal(`Project Card (${property.title})`, property.configuration)}
            className="btn-gold flex-1 text-xs py-2.5 font-bold shadow-md"
          >
            Get Best Offer <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </button>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-[#25d366]/15 text-[#25d366] hover:bg-[#25d366] hover:text-white transition-colors border border-[#25d366]/30"
            title="WhatsApp Inquiry"
          >
            <MessageSquare className="w-4 h-4" />
          </a>

          <a
            href="tel:+918169005579"
            className={`p-2.5 rounded-lg transition-colors border ${
              isLight
                ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-[#0b132b] hover:text-white'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-[#c5a059]'
            }`}
            title="Call Jayshree Realty"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
