import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import heroDesktopBg from '../assets/hero-dekstop-view.webp';
import heroMobileBg from '../assets/hero-mobie-view.webp';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/ProjectCard';
import { useScrollReveal } from '../utils/useScrollReveal';

export const PropertyListings: React.FC = () => {
  const { projects } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const resaleCategories = [
    'Resale',
    '1 BHK Nerul East',
    '1 BHK Nerul West',
    '1 BHK Seawoods East',
    '1 BHK Seawoods West',
    '1 BHK Juinagar',
    '2 BHK Nerul East',
    '2 BHK Nerul West',
    '2 BHK Seawoods East',
    '2 BHK Seawoods West',
    '2 BHK Juinagar',
    '3/4 BHK',
    'Row House'
  ];

  const resaleListings = projects.filter((p) => {
    if (p.published === false || p.archived === true) return false;
    // Check if property is marked as Resale or in a resale category
    const isResale =
      p.type === 'Resale' ||
      p.category === 'Resale' ||
      (p.placements && p.placements.includes('resale')) ||
      resaleCategories.includes(p.category);
    return isResale;
  });

  const filteredListings = resaleListings.filter((p) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Resale') {
      return p.type === 'Resale' || p.category === 'Resale';
    }
    return p.category === activeCategory;
  });

  useScrollReveal([activeCategory, filteredListings.length]);

  return (
    <div className="min-h-screen font-sans">
      <SEOHead
        title="Property Listings in Nerul & Seawoods | 1 & 2 BHK Resale"
        description="Comprehensive property listings of ready possession 1 BHK, 2 BHK, 3/4 BHK flats and row houses in Nerul East, Nerul West, Seawoods & Juinagar."
      />

      {/* 1. HEADER */}
      <section className="relative pt-32 pb-20 border-b border-[#c5a059]/20 overflow-hidden bg-[#070b19]">
                {/* Desktop View Background Image (>= md) */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat opacity-85"
          style={{ backgroundImage: `url(${heroDesktopBg})` }}
        />
        {/* Mobile View Background Image (< md) */}
        <div
          className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat opacity-85"
          style={{ backgroundImage: `url(${heroMobileBg})` }}
        />
        {/* Vibrant Luxury Gradient: Enhanced image visibility with clear text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b19]/65 via-[#070b19]/40 to-[#070b19]/90" />
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-3 relative z-10 reveal">
          <span className="badge-gold">Verified CIDCO Resale & Ready Homes</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Property Listings in <span className="text-gradient-gold">Nerul & Seawoods</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-outfit">
            Explore ready-to-move 1 BHK, 2 BHK, 3/4 BHK apartments and independent row houses with clear titles.
          </p>
        </div>
      </section>

      {/* 2. CATEGORIES & CARDS GRID (Warm Beige Background) */}
      <section className="py-20 section-warm-beige min-h-[60vh]">
        <div className="container mx-auto px-4">
          {/* Resale Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 font-outfit text-xs reveal">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2.5 rounded-full border transition-all duration-300 font-bold ${
                activeCategory === 'All'
                  ? 'bg-[#0b132b] text-white border-[#0b132b] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#c5a059]'
              }`}
            >
              All Listings ({resaleListings.length})
            </button>

            {resaleCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2.5 rounded-full border transition-all duration-300 font-semibold ${
                  activeCategory === cat
                    ? 'bg-[#0b132b] text-white border-[#0b132b] shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#c5a059]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((property, idx) => {
                const isEvenRow = Math.floor(idx / 3) % 2 === 0;
                return (
                  <div key={property.id} className={`${isEvenRow ? 'reveal-left' : 'reveal-right'} stagger-${(idx % 3) + 1}`}>
                    <ProjectCard property={property} theme="light" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#c5a059] flex items-center justify-center mx-auto text-2xl font-bold">
                🏠
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-800">
                No Resale Listings In This Node Currently
              </h3>
              <p className="text-sm text-slate-600 font-outfit">
                We have verified off-market and upcoming CIDCO transfer flats matching this criteria. Connect with our Nerul Station team directly.
              </p>
              <button
                onClick={() => setActiveCategory('All')}
                className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                View All Resale Listings ({resaleListings.length})
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
