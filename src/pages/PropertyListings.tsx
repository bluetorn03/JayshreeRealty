import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/ProjectCard';

export const PropertyListings: React.FC = () => {
  const { projects } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const resaleCategories = [
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

  const filteredListings = projects.filter((p) => {
    if (p.published === false) return false;
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="min-h-screen font-sans">
      <SEOHead
        title="Property Listings in Nerul & Seawoods | 1 & 2 BHK Resale"
        description="Comprehensive property listings of ready possession 1 BHK, 2 BHK, 3/4 BHK flats and row houses in Nerul East, Nerul West, Seawoods & Juinagar."
      />

      {/* 1. HEADER */}
      <section className="relative pt-32 pb-20 border-b border-[#c5a059]/20 overflow-hidden bg-[#070b19]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b19]/90 via-[#070b19]/75 to-[#070b19]" />
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-3 relative z-10">
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
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 font-outfit text-xs">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2.5 rounded-full border transition-all duration-300 font-bold ${
                activeCategory === 'All'
                  ? 'bg-[#0b132b] text-white border-[#0b132b] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#c5a059]'
              }`}
            >
              All Listings ({projects.length})
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((property) => (
              <ProjectCard key={property.id} property={property} theme="light" />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
