import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin, Calendar, MessageSquare, Phone, ArrowUpRight, Sparkles,
  Building2, Play, X, Youtube, Maximize2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { PropertyItem } from '../types';
import { useLeads } from '../context/LeadContext';
import { useData } from '../context/DataContext';
import { getYouTubeEmbedUrl } from '../utils/youtube';
import { PropertyDetailModal } from './PropertyDetailModal';

interface ProjectCardProps {
  property: PropertyItem;
  theme?: 'dark' | 'light';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ property, theme = 'light' }) => {
  const { openModal } = useLeads();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Touch swipe states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const imagesList = useMemo(() => {
    if (property.galleryImages && property.galleryImages.length > 0) {
      return property.galleryImages.filter(Boolean);
    }
    return property.image ? [property.image] : [];
  }, [property]);

  // Mobile Viewport Visibility Observer for Infinite Autoloop
  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      {
        threshold: 0.35 // triggers when at least 35% visible on mobile screen
      }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Infinite Image Autoloop: Runs when hovered on desktop OR when visible in mobile viewport
  useEffect(() => {
    if (imagesList.length <= 1) return;
    const shouldLoop = isHovered || isInViewport;
    if (!shouldLoop) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [isHovered, isInViewport, imagesList.length]);

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (imagesList.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (imagesList.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  // Touch Swipe handlers for mobile cards
  const minSwipeDistance = 40;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      e.stopPropagation();
      handleNextImage();
    } else if (isRightSwipe) {
      e.stopPropagation();
      handlePrevImage();
    }
  };

  const { siteSettings } = useData();
  const whatsappRaw = siteSettings?.whatsappRaw || '918169005579';
  const phoneRaw = siteSettings?.phoneRaw || '+918169005579';
  const whatsappUrl = `https://wa.me/${whatsappRaw}?text=Hello,%20I%20am%20interested%20in%20${encodeURIComponent(
    property.title + ' (' + property.location + ')'
  )}%20from%20Jayshree%20Realty.`;

  const isLight = theme === 'light';

  const shortDesc = (property.highlights || property.shortDescription || '').trim();
  const longDesc = (property.longDescription || property.description || '').trim();

  return (
    <>
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
        className={`rounded-2xl overflow-hidden luxury-card-motion md:hover:-translate-y-1.5 flex flex-col group ${
          isLight
            ? 'bg-white border border-amber-200/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-[#c5a059]'
            : 'bg-[#0d1527] border border-[#c5a059]/30 shadow-2xl hover:border-[#c5a059]'
        }`}
      >
        {/* Image & Carousel Container - Clickable to open Big Screen Modal */}
        <div
          onClick={() => setIsDetailModalOpen(true)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative h-60 sm:h-64 w-full overflow-hidden bg-slate-950 cursor-pointer select-none"
          title="Click to view full property photos & details"
        >
          {/* Dual-Layer Carousel: Ambient Color-Matched Backdrop + Crisp Full Aspect-Ratio Contain */}
          {imagesList.map((imgSrc, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-700 ease-in-out ${
                idx === currentImageIndex ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Layer 1: Ambient Blurred Backdrop (Matches image colors, fills entire horizontal card width) */}
              <img
                src={imgSrc}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-50 brightness-75 select-none pointer-events-none"
                loading="lazy"
              />
              {/* Layer 2: Full-Visibility Foreground (Guarantees vertical and horizontal images show 100% full height/width without cropping top or bottom) */}
              <img
                src={imgSrc}
                alt={`${property.title} - Image ${idx + 1}`}
                className="relative z-[2] w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-104 drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                loading="lazy"
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
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b]/85 via-black/10 to-black/25 pointer-events-none z-[3]"></div>

          {/* Quick View Floating Hint on Desktop Hover */}
          <div className="hidden sm:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/75 backdrop-blur-md border border-[#c5a059]/60 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl z-10 scale-90 group-hover:scale-100">
            <Maximize2 className="w-3.5 h-3.5 text-[#c5a059]" /> Quick View
          </div>

          {/* Manual Left Slide Button on Card (Visible on mobile or hover) */}
          {imagesList.length > 1 && (
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/65 hover:bg-[#c5a059] text-white hover:text-[#070b19] border border-white/20 hover:border-[#c5a059] flex items-center justify-center shadow-lg transition-all z-20 active:scale-90"
              title="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Manual Right Slide Button on Card (Visible on mobile or hover) */}
          {imagesList.length > 1 && (
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/65 hover:bg-[#c5a059] text-white hover:text-[#070b19] border border-white/20 hover:border-[#c5a059] flex items-center justify-center shadow-lg transition-all z-20 active:scale-90"
              title="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Gallery Dots Indicator */}
          {imagesList.length > 1 && (
            <div className="absolute bottom-11 left-0 right-0 flex justify-center gap-1 z-10 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {imagesList.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? 'w-4 bg-[#c5a059]' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Top Badges (Responsive, dynamic width, no overlap) */}
          <div className="absolute top-3 left-3 right-16 flex flex-wrap items-center gap-1.5 z-10 max-w-[calc(100%-4.5rem)] pointer-events-none" style={{zIndex: 3}}>
            {/* Category Badge */}
            <span className="badge-gold font-outfit shadow-md backdrop-blur-md text-[10px] font-bold truncate max-w-[120px] pointer-events-auto">
              {property.category}
            </span>
            
            {/* Property Type Badge */}
            <span className="bg-[#0b132b]/90 border border-[#c5a059]/40 text-[#e5c178] px-2 py-0.5 rounded-full text-[10px] font-outfit font-semibold shadow-md backdrop-blur-md truncate max-w-[100px] pointer-events-auto">
              {property.type}
            </span>

            {/* Brokerage Badge ONLY if explicitly enabled */}
            {property.brokerageFree === true && (
              <span className="badge-emerald font-outfit shadow-md backdrop-blur-md text-[10px] whitespace-nowrap pointer-events-auto">
                0% Brokerage
              </span>
            )}
          </div>

          {/* Property Code Badge if present */}
          {property.code !== undefined && property.code !== '' && (
            <div className="absolute top-3 right-3 bg-[#070b19]/90 border border-[#c5a059]/40 text-[#e5c178] px-2 py-0.5 rounded-md text-[11px] font-mono font-bold z-10">
              {property.code}
            </div>
          )}

          {/* Price Overlay on Image */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between" style={{zIndex: 3}}>
            <div>
              <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-outfit font-medium">Starting Price</span>
              <span className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">{property.price}</span>
            </div>
            {/* YouTube Video Button */}
            {property.youtubeUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVideoModal(true);
                }}
                className="text-[11px] bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-full font-bold flex items-center gap-1 font-outfit shadow-lg transition-transform hover:scale-105 z-20 pointer-events-auto"
                title="Watch Property Walkthrough Video"
              >
                <Play className="w-3 h-3 fill-white" /> Watch Video
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3.5">
          <div>
            {/* Title - Clickable to open Big Screen Modal */}
            <h3
              onClick={() => setIsDetailModalOpen(true)}
              className={`font-serif text-lg font-bold leading-snug mb-1.5 transition-colors cursor-pointer ${
                isLight
                  ? 'text-slate-900 group-hover:text-[#99732b]'
                  : 'text-white group-hover:text-[#e5c178]'
              }`}
              title="Click to view full property overview"
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

            {/* 1. Highlights / Short Description */}
            {shortDesc && (
              <div
                className={`mt-3 text-xs font-outfit flex items-start gap-1.5 p-2 rounded-lg border font-medium ${
                  isLight
                    ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
                    : 'bg-[#c5a059]/10 border-[#c5a059]/30 text-[#e5c178]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059] shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">{shortDesc}</span>
              </div>
            )}

            {/* 2. Full Detailed Property Overview / Long Description */}
            {longDesc && (
              <div className={`text-xs font-outfit pt-2.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                <div className="line-clamp-2 whitespace-pre-line">
                  {longDesc}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDetailModalOpen(true);
                  }}
                  className="text-[11px] font-bold text-[#c5a059] hover:text-[#99732b] dark:hover:text-[#e5c178] inline-flex items-center gap-0.5 mt-1 transition-colors hover:underline cursor-pointer"
                >
                  more...
                </button>
              </div>
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
              href={`tel:${phoneRaw}`}
              className={`p-2.5 rounded-lg transition-colors border ${
                isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-[#0b132b] hover:text-white'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-[#c5a059]'
              }`}
              title={`Call Jayshree Realty (${siteSettings?.phone || '+91 81690 05579'})`}
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* YOUTUBE VIDEO MODAL */}
        {showVideoModal && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <div
              className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-4 w-full max-w-3xl shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 px-2">
                <div className="flex items-center gap-2 font-outfit text-sm font-bold text-white">
                  <Youtube className="w-5 h-5 text-red-500" />
                  {property.title} - Official Video Tour
                </div>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="p-1.5 rounded-full bg-slate-800 hover:bg-[#c5a059] text-slate-300 hover:text-[#070b19] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative pt-[56.25%] rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(property.youtubeUrl, true)}
                  title={`${property.title} YouTube Video`}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULL SCREEN PROPERTY DETAILS & GALLERY MODAL (LUXURY LIGHT THEME) */}
      <PropertyDetailModal
        property={property}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenLeadModal={openModal}
      />
    </>
  );
};
