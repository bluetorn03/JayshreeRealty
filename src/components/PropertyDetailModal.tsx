import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Building2,
  Sparkles,
  MessageSquare,
  Phone,
  ArrowUpRight,
  Play,
  CheckCircle2,
  Layers,
  Award,
  Share2,
  Check
} from 'lucide-react';
import { PropertyItem } from '../types';
import { FormattedDescription } from './FormattedDescription';
import { getYouTubeEmbedUrl } from '../utils/youtube';

interface PropertyDetailModalProps {
  property: PropertyItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenLeadModal?: (source: string, requirement: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onOpenLeadModal
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);

  // Reset image index when modal opens or property changes
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, property]);

  const imagesList = React.useMemo(() => {
    if (!property) return [];
    if (property.galleryImages && property.galleryImages.length > 0) {
      return property.galleryImages.filter(Boolean);
    }
    return property.image ? [property.image] : [];
  }, [property]);

  // Keyboard navigation (Arrow keys + Esc)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && imagesList.length > 1) {
        setCurrentImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight' && imagesList.length > 1) {
        setCurrentImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, imagesList, onClose]);

  // Scroll thumbnail into view
  useEffect(() => {
    if (!thumbnailsRef.current) return;
    const activeThumb = thumbnailsRef.current.children[currentImageIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentImageIndex]);

  if (!isOpen || !property) return null;

  const currentDisplayImage = imagesList[currentImageIndex] || property.image;

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

  // Touch Swipe for mobile
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title + ' - Jayshree Realty',
        text: `Check out ${property.title} in ${property.location} starting at ${property.price}!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const whatsappUrl = `https://wa.me/918169005579?text=Hello,%20I%20am%20interested%20in%20${encodeURIComponent(
    property.title + ' (' + property.location + ')'
  )}%20from%20Jayshree%20Realty.`;

  const shortDesc = property.highlights || property.shortDescription || '';
  const longDesc = property.longDescription || property.description || '';

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#0b132b] text-white border border-[#c5a059]/40 rounded-2xl md:rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#070b19]/90 shrink-0">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="badge-gold text-[10px] font-bold shrink-0">
              {property.category}
            </span>
            <span className="bg-[#0b132b] border border-[#c5a059]/40 text-[#e5c178] px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0">
              {property.type}
            </span>
            {property.brokerageFree && (
              <span className="badge-emerald text-[10px] shrink-0">
                0% Brokerage
              </span>
            )}
            {property.code && (
              <span className="bg-slate-800 text-amber-300 border border-amber-400/30 font-mono text-[11px] px-2 py-0.5 rounded font-bold shrink-0">
                {property.code}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share Property"
              className="p-2 rounded-full bg-slate-800 hover:bg-[#c5a059] text-slate-300 hover:text-[#070b19] transition-colors"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 md:p-6 space-y-6 custom-scrollbar">
          
          {/* 1. FULL SIZE IMAGE GALLERY SECTION */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            {/* Main Active Image Viewport */}
            <div
              className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[420px] bg-black flex items-center justify-center select-none"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <img
                src={currentDisplayImage}
                alt={`${property.title} - Full View ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
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
                    target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
                  }
                }}
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Photo Counter Badge */}
              {imagesList.length > 0 && (
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-[#c5a059]/40 text-[#e5c178] px-3 py-1 rounded-full text-xs font-mono font-bold shadow-lg">
                  📷 {currentImageIndex + 1} / {imagesList.length} Photos
                </div>
              )}

              {/* Move / Slide Left Button */}
              {imagesList.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-[#c5a059] text-white hover:text-[#070b19] border border-white/20 hover:border-[#c5a059] backdrop-blur-md shadow-2xl transition-all duration-200 z-10 active:scale-95"
                  title="Previous Image (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Move / Slide Right Button */}
              {imagesList.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-[#c5a059] text-white hover:text-[#070b19] border border-white/20 hover:border-[#c5a059] backdrop-blur-md shadow-2xl transition-all duration-200 z-10 active:scale-95"
                  title="Next Image (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Price & Title overlay on photo */}
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between pointer-events-none">
                <div>
                  <span className="text-[11px] text-[#e5c178] font-bold uppercase tracking-wider block">
                    Verified Exclusive Listing
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                    {property.title}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-outfit">
                    Starting Price
                  </span>
                  <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#c5a059] drop-shadow-md">
                    {property.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {imagesList.length > 1 && (
              <div
                ref={thumbnailsRef}
                className="p-2.5 bg-[#070b19] border-t border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar select-none"
              >
                {imagesList.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      idx === currentImageIndex
                        ? 'border-[#c5a059] scale-105 shadow-lg shadow-[#c5a059]/30 ring-2 ring-[#c5a059]/40'
                        : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/80 text-white px-1 rounded">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. SPECIFICATIONS GRID */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-3">
              <MapPin className="w-4 h-4 text-[#c5a059] shrink-0" />
              <span className="text-sm text-slate-200 font-semibold">{property.location}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#070b19]/80 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase block font-semibold text-slate-400">Configuration</span>
                <span className="font-bold text-sm text-white font-serif">{property.configuration || 'Customizable'}</span>
              </div>
              <div className="bg-[#070b19]/80 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase block font-semibold text-slate-400">Carpet Area</span>
                <span className="font-bold text-sm text-[#e5c178]">{property.area || 'On Request'}</span>
              </div>
              <div className="bg-[#070b19]/80 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase block font-semibold text-slate-400">Possession</span>
                <span className="font-bold text-sm text-white flex items-center justify-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                  {property.possession || 'Ready / Under Construction'}
                </span>
              </div>
              <div className="bg-[#070b19]/80 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase block font-semibold text-slate-400">Consultancy</span>
                <span className="font-bold text-sm text-[#c5a059]">{property.builderName || 'Jayshree Realty'}</span>
              </div>
            </div>
          </div>

          {/* 3. SHORT DESCRIPTION / HIGHLIGHTS BANNER */}
          {shortDesc && (
            <div className="bg-gradient-to-r from-[#c5a059]/20 via-[#c5a059]/10 to-transparent border-l-4 border-[#c5a059] p-4 rounded-r-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-[#e5c178] uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-[#c5a059]" /> Project Highlights & Short Summary
              </div>
              <p className="text-sm font-outfit text-slate-100 font-medium leading-relaxed">
                {shortDesc}
              </p>
            </div>
          )}

          {/* 4. FULL DETAILED OVERVIEW / LONG DESCRIPTION (Formatted with headings, enters, bullets) */}
          {longDesc && (
            <div className="bg-[#070b19]/70 border border-slate-800/90 rounded-2xl p-5 md:p-6 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-serif text-lg font-bold text-[#c5a059] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#c5a059]" /> Complete Detailed Property Overview
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Detailed Specifications</span>
              </div>

              {/* Formatted Content Renderer */}
              <div className="pt-2 text-slate-200">
                <FormattedDescription text={longDesc} isLight={false} />
              </div>
            </div>
          )}

          {/* 5. AMENITIES & FEATURES */}
          {((property.amenities && property.amenities.length > 0) || (property.features && property.features.length > 0)) && (
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-[#c5a059]" /> Luxury Amenities & Key Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {[...(property.amenities || []), ...(property.features || [])].filter((v, i, a) => a.indexOf(v) === i).map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 6. YOUTUBE WALKTHROUGH VIDEO IF AVAILABLE */}
          {property.youtubeUrl && (
            <div className="space-y-2 pt-2">
              <h4 className="font-serif text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Play className="w-4 h-4 text-red-500 fill-red-500" /> Official Video Walkthrough
              </h4>
              <div className="relative pt-[56.25%] rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl">
                <iframe
                  src={getYouTubeEmbedUrl(property.youtubeUrl, false)}
                  title={`${property.title} Video Tour`}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

        </div>

        {/* Bottom Action Buttons (Sticky & Responsive) */}
        <div className="p-4 bg-[#070b19] border-t border-slate-800 flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              if (onOpenLeadModal) {
                onOpenLeadModal(`Full Property View (${property.title})`, property.configuration);
              }
            }}
            className="btn-gold flex-1 py-3 text-xs md:text-sm font-bold shadow-xl flex items-center justify-center gap-1.5"
          >
            Get Best Offer & Priority Visit <ArrowUpRight className="w-4 h-4" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl bg-[#25d366]/20 text-[#25d366] hover:bg-[#25d366] hover:text-white transition-colors border border-[#25d366]/40 flex items-center gap-2 font-bold text-xs"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <a
            href="tel:+918169005579"
            className="px-4 py-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-[#c5a059] hover:text-[#070b19] transition-colors border border-slate-700 flex items-center gap-2 font-bold text-xs"
            title="Call Jayshree Realty"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call Us</span>
          </a>
        </div>
      </div>
    </div>
  );
};
