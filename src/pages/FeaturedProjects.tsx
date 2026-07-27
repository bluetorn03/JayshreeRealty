import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectCategory } from '../types';

export const FeaturedProjects: React.FC = () => {
  const { projects } = useData();
  const [activeGroup, setActiveGroup] = useState<string>('All');

  const groups: ProjectCategory[] = [
    'Kharghar New Projects',
    'Upper Kharghar',
    'Ulwe New Projects',
    'Pushpak Nagar New Projects',
    'Nerul & Seawoods New Projects',
    'Juinagar & Sanpada New Projects',
    'Panvel',
    'Khandeshwar / Kamothe'
  ];

  const displayedProjects = projects.filter((p) => {
    if (p.published === false) return false;
    if (activeGroup === 'All') return true;
    return p.category === activeGroup;
  });

  return (
    <div className="min-h-screen font-sans">
      <SEOHead
        title="Featured New Projects in Navi Mumbai | Kharghar, Ulwe, Nerul & Pushpak Nagar"
        description="Official list of new developer launches, 4-acre townships, and airport node projects in Navi Mumbai with 0% brokerage."
      />

      {/* 1. HEADER (Dark Navy Background) */}
      <section className="pt-32 pb-20 section-navy border-b border-[#c5a059]/20">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-3">
          <span className="badge-gold">Official Developer Directory</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Featured New Projects in <span className="text-gradient-gold">Navi Mumbai</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-outfit">
            Explore newly launched residential towers and mega townships across the 8 major growth nodes.
          </p>
        </div>
      </section>

      {/* 2. GROUP SELECTOR & PROJECTS GRID (Warm Beige Background) */}
      <section className="py-20 section-warm-beige min-h-[60vh]">
        <div className="container mx-auto px-4">
          {/* Group Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14 font-outfit text-xs">
            <button
              onClick={() => setActiveGroup('All')}
              className={`px-5 py-2.5 rounded-full border transition-all duration-300 font-bold ${
                activeGroup === 'All'
                  ? 'bg-[#0b132b] text-white border-[#0b132b] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#c5a059]'
              }`}
            >
              All 8 Major Groups ({projects.length})
            </button>
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`px-4 py-2.5 rounded-full border transition-all duration-300 font-semibold ${
                  activeGroup === group
                    ? 'bg-[#0b132b] text-white border-[#0b132b] shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#c5a059]'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Projects Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((property) => (
              <ProjectCard key={property.id} property={property} theme="light" />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
