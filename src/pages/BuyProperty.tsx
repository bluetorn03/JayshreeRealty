import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/ProjectCard';
import { Search, RefreshCw } from 'lucide-react';

export const BuyProperty: React.FC = () => {
  const { projects } = useData();
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedConfig, setSelectedConfig] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProperties = projects.filter((p) => {
    if (p.published === false || p.archived === true) return false;
    if (p.placements && p.placements.length > 0 && !p.placements.includes('buy') && !p.placements.includes('homepage')) return false;

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      selectedLocation === 'All' || p.category.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesConfig =
      selectedConfig === 'All' || p.configuration.toLowerCase().includes(selectedConfig.toLowerCase());

    const matchesType =
      selectedType === 'All' || p.type === selectedType;

    return matchesSearch && matchesLocation && matchesConfig && matchesType;
  });

  const resetFilters = () => {
    setSelectedLocation('All');
    setSelectedConfig('All');
    setSelectedType('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen font-sans">
      <SEOHead
        title="Buy Property in Navi Mumbai | 1, 2, 3 BHK & Townships"
        description="Browse premium verified properties for sale in Nerul, Seawoods, Kharghar, Ulwe, Pushpak Nagar & Panvel with Jayshree Realty."
      />

      {/* 1. HEADER */}
      <section className="relative pt-32 pb-20 border-b border-[#c5a059]/20 overflow-hidden bg-[#070b19]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b19]/90 via-[#070b19]/75 to-[#070b19]" />
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-3 relative z-10">
          <span className="badge-gold">Verified Buyer Inventory</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Buy Your Ideal Home in <span className="text-gradient-gold">Navi Mumbai</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-outfit">
            Explore 1, 2, 3 BHK flats, lavish 4-acre townships, and CIDCO plot launches with 0% brokerage on select developer projects.
          </p>
        </div>
      </section>

      {/* 2. FILTER & LISTINGS SECTION (Warm Beige Background) */}
      <section className="py-20 section-warm-beige min-h-[60vh]">
        <div className="container mx-auto px-4">
          {/* Filter Bar Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xl mb-12 font-outfit">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#c5a059]" />
                <input
                  type="text"
                  placeholder="Search project name or node..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                />
              </div>

              {/* Location Select */}
              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm font-medium"
                >
                  <option value="All">All Navi Mumbai Locations</option>
                  <option value="Nerul">Nerul & Seawoods</option>
                  <option value="Kharghar">Kharghar</option>
                  <option value="Upper Kharghar">Upper Kharghar</option>
                  <option value="Ulwe">Ulwe Coastal Node</option>
                  <option value="Pushpak Nagar">Pushpak Nagar (Airport)</option>
                  <option value="Juinagar">Juinagar & Sanpada</option>
                  <option value="Panvel">Panvel</option>
                  <option value="Kamothe">Kamothe & Khandeshwar</option>
                </select>
              </div>

              {/* Config Select */}
              <div>
                <select
                  value={selectedConfig}
                  onChange={(e) => setSelectedConfig(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm font-medium"
                >
                  <option value="All">All Configurations</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="Row House">Row House</option>
                </select>
              </div>

              {/* Type Select */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm font-medium"
                >
                  <option value="All">All Property Types</option>
                  <option value="New Launch">New Developer Launch</option>
                  <option value="Township">4-Acre Township</option>
                  <option value="Resale">Resale Ready Possession</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
              <span>Showing <strong className="text-slate-900 font-bold">{filteredProperties.length}</strong> matching properties</span>
              <button
                onClick={resetFilters}
                className="text-[#99732b] hover:underline flex items-center gap-1 font-bold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <ProjectCard key={property.id} property={property} theme="light" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-md">
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">No matching properties found</h3>
              <p className="text-xs text-slate-500 font-outfit mb-4">Try relaxing your search filter criteria or contact our advisor directly.</p>
              <button onClick={resetFilters} className="btn-gold text-xs px-6 py-2.5 font-bold uppercase">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
