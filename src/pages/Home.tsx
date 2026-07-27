import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { ProjectCard } from '../components/ProjectCard';
import { ReviewCard } from '../components/ReviewCard';
import { useData } from '../context/DataContext';
import { useLeads } from '../context/LeadContext';
import { 
  Building2, MapPin, ShieldCheck, Award, ArrowRight, CheckCircle2, 
  Sparkles, Star, Phone, MessageSquare, Search, Users
} from 'lucide-react';

export const Home: React.FC = () => {
  const { openModal } = useLeads();
  const { projects, reviews, heroSettings } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchLocation, setSearchLocation] = useState<string>('');

  // Smooth Typewriter Animation State
  const keywords = heroSettings.keywords && heroSettings.keywords.length > 0
    ? heroSettings.keywords
    : ["Premium Projects", "Buy Property", "Sell Property", "Verified Properties", "Navi Mumbai", "Luxury Homes"];

  const [keywordIndex, setKeywordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = keywords[keywordIndex];
    const speed = isDeleting ? 40 : 90;

    const timeout = setTimeout(() => {
      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setKeywordIndex((prev) => (prev + 1) % keywords.length);
      } else {
        setCurrentText(
          fullText.substring(0, isDeleting ? currentText.length - 1 : currentText.length + 1)
        );
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, keywordIndex, keywords]);

  const featuredProjects = projects.filter((p) => {
    if (p.published === false) return false;
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Resale') return p.type === 'Resale';
    return p.category.toLowerCase().includes(selectedCategory.toLowerCase());
  }).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#070b19] font-sans">
      <SEOHead
        title="Jayshree Realty | Premium Luxury Real Estate Consultant in Navi Mumbai"
        description="Jayshree Realty is Navi Mumbai's leading luxury real estate consultant offering 100+ verified projects in Nerul, Seawoods, Kharghar, Ulwe, Pushpak Nagar & Panvel."
      />

      {/* 1. HERO SECTION (Dark Navy Background) */}
      <section className="relative min-h-[92vh] pt-32 pb-24 flex items-center justify-center overflow-hidden border-b border-[#c5a059]/20 section-navy">
        {/* Background Image with Lighter Overlay & Entrance Zoom */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-hero-zoom transition-all"
          style={{
            backgroundImage: `url('${heroSettings.backgroundImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000'}')`
          }}
        >
          {/* Lighter Gradient Overlay so background image is vibrant and visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b19]/90 via-[#070b19]/75 to-[#070b19]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-transparent to-[#070b19]/50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#e5c178] text-xs font-outfit uppercase tracking-widest font-semibold animate-fade-in shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                100+ Verified Projects | Nerul, Kharghar, Ulwe, Pushpak Nagar & Panvel
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                {heroSettings.headingPart1 || "Navi Mumbai’s Most"} <br />
                <span className="text-gradient-gold">{heroSettings.headingGold || "Trusted Luxury Real Estate"}</span>
              </h1>

              {/* Typewriter Animation for Rotating Keywords */}
              <div className="flex items-center gap-2 font-outfit text-lg sm:text-2xl text-slate-200 font-semibold h-10">
                <span className="text-slate-400">Specialized In:</span>
                <span className="text-[#e5c178] font-bold border-r-2 border-[#c5a059] pr-1.5 animate-pulse">
                  {currentText}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-300 font-outfit leading-relaxed max-w-2xl">
                {heroSettings.subtext || "Experience transparent property buying with verified CIDCO plots, direct developer launches, and prime resale homes across Nerul, Seawoods, Kharghar, Ulwe, Pushpak Nagar & Panvel."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={() => openModal('Hero Main CTA')}
                  className="btn-gold px-8 py-4 text-sm font-bold tracking-wider shadow-xl"
                >
                  GET BEST OFFER NOW <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <Link
                  to="/projects"
                  className="btn-outline-gold px-7 py-4 text-sm font-semibold"
                >
                  Explore All Projects
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 font-outfit text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#c5a059] shrink-0" />
                  <span>100% Legal Title Search</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#c5a059] shrink-0" />
                  <span>0% Brokerage Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#c5a059] fill-[#c5a059] shrink-0" />
                  <span>4.8/5 Rated on Google</span>
                </div>
              </div>
            </div>

            {/* Hero Right Quick Search Form */}
            <div className="lg:col-span-5">
              <div className="bg-glass p-6 sm:p-8 rounded-3xl border border-[#c5a059]/40 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/10 rounded-full blur-2xl"></div>

                <div className="mb-5">
                  <span className="badge-gold mb-2">Fast Inquiry</span>
                  <h3 className="font-serif text-xl font-bold text-white">Find Your Luxury Home</h3>
                  <p className="text-xs text-slate-400 font-outfit">Instant floor plans, prices & site visit bookings.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    openModal(`Hero Search (${searchLocation || 'General'})`);
                  }}
                  className="space-y-4 font-outfit"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Select Location Node</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#c5a059]" />
                      <select
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="w-full bg-[#070b19] border border-slate-700 focus:border-[#c5a059] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="">All Nodes (Nerul, Seawoods, Kharghar...)</option>
                        <option value="Nerul & Seawoods">Nerul & Seawoods</option>
                        <option value="Kharghar">Kharghar & Upper Kharghar</option>
                        <option value="Ulwe">Ulwe Coastal Node</option>
                        <option value="Pushpak Nagar">Pushpak Nagar (Near NMIA Airport)</option>
                        <option value="Juinagar & Sanpada">Juinagar & Sanpada</option>
                        <option value="Panvel">Panvel Smart City</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Config</label>
                      <select className="w-full bg-[#070b19] border border-slate-700 focus:border-[#c5a059] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none">
                        <option>1 BHK</option>
                        <option>2 BHK</option>
                        <option>3/4 BHK</option>
                        <option>Row House</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Budget</label>
                      <select className="w-full bg-[#070b19] border border-slate-700 focus:border-[#c5a059] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none">
                        <option>₹ 35L - ₹ 60L</option>
                        <option>₹ 60L - ₹ 1 Cr</option>
                        <option>₹ 1 Cr - ₹ 2.5 Cr</option>
                        <option>₹ 2.5 Cr+</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-gold w-full py-3.5 font-bold text-sm tracking-wider shadow-lg">
                    SEARCH & GET BEST OFFER
                  </button>

                  <div className="text-center pt-2">
                    <a
                      href="tel:+918169005579"
                      className="text-xs text-slate-300 hover:text-[#e5c178] inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#c5a059]" /> Direct Call: <strong>+91 81690 05579</strong>
                    </a>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. METRICS COUNTER SECTION (Pure White Background) */}
      <section className="py-16 section-white border-b border-slate-200/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <AnimatedCounter
              end={100}
              suffix="+"
              label="Verified Projects"
              sublabel="Sanpada to Panvel"
              icon={Building2}
            />
            <AnimatedCounter
              end={15}
              suffix="+"
              label="Years Trust"
              sublabel="Navi Mumbai Experts"
              icon={Award}
            />
            <AnimatedCounter
              end={5000}
              suffix="+"
              label="Happy Families"
              sublabel="Seamless Closures"
              icon={Users}
            />
            <AnimatedCounter
              end={4}
              prefix=""
              suffix=".8★"
              label="Google Rating"
              sublabel="21+ Client Reviews"
              icon={Star}
            />
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROJECTS SECTION (Warm Beige Background) */}
      <section className="py-24 section-warm-beige border-b border-amber-200/60">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="badge-gold-dark mb-2">Prime Real Estate</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                Featured Projects in <span className="text-gradient-gold">Navi Mumbai</span>
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 text-xs font-outfit">
              {['All', 'Kharghar', 'Ulwe', 'Pushpak Nagar', 'Nerul', 'Resale'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 font-semibold ${
                    selectedCategory === cat
                      ? 'bg-[#0b132b] text-white border-[#0b132b] shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#c5a059]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((property) => (
              <ProjectCard key={property.id} property={property} theme="light" />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link to="/projects" className="btn-gold px-9 py-4 text-sm font-bold shadow-xl">
              View All 100+ Projects & Listings <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US SECTION (Dark Navy Background) */}
      <section className="py-24 section-navy-secondary border-y border-[#c5a059]/20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="badge-gold mb-2">Unmatched Integrity</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Why Buyers & Sellers Trust <span className="text-gradient-gold">Jayshree Realty</span>
            </h2>
            <p className="text-sm text-slate-300 font-outfit">
              We eliminate guesswork with direct site visits, legal title verifications, and zero brokerage structures for new developer launches in Navi Mumbai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#070b19] p-8 rounded-2xl border border-slate-800 hover:border-[#c5a059]/40 transition-all duration-300 text-left group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-[#c5a059]/15 text-[#c5a059] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">CIDCO Title & Legal Clearance</h3>
              <p className="text-xs text-slate-400 font-outfit leading-relaxed">
                Every property listed undergoes rigorous legal audit by local advocate experts to ensure complete peace of mind and hassle-free bank home loan approvals.
              </p>
            </div>

            <div className="bg-[#070b19] p-8 rounded-2xl border border-slate-800 hover:border-[#c5a059]/40 transition-all duration-300 text-left group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-[#c5a059]/15 text-[#c5a059] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Station Proximity & Airport Hubs</h3>
              <p className="text-xs text-slate-400 font-outfit leading-relaxed">
                Specialized focus on Nerul Railway Station Complex, Seawoods Grand Central, Ulwe Bamandongri, and Pushpak Nagar Airport node properties.
              </p>
            </div>

            <div className="bg-[#070b19] p-8 rounded-2xl border border-slate-800 hover:border-[#c5a059]/40 transition-all duration-300 text-left group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-[#c5a059]/15 text-[#c5a059] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Dedicated Transport & Guided Visits</h3>
              <p className="text-xs text-slate-400 font-outfit leading-relaxed">
                As praised by verified Google reviewers, we provide free site visit transport facility and personal executive guidance from start to finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 4-STEP BUYING PROCESS (Pure White Background) */}
      <section className="py-24 section-white border-b border-slate-200/80">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="badge-gold-dark">Simplified Journey</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              4 Easy Steps to Your <span className="text-gradient-gold">Dream Home</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-outfit">
            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl font-serif font-black text-[#c5a059] mb-3">01</div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Share Requirement</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Tell us your preferred budget, node (Nerul, Ulwe, Kharghar), and configuration.</p>
            </div>

            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl font-serif font-black text-[#c5a059] mb-3">02</div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Curated Site Visits</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Visit handpicked verified properties with our personal transport executive.</p>
            </div>

            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl font-serif font-black text-[#c5a059] mb-3">03</div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Best Deal Negotiation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">We negotiate maximum discounts directly with top builder developers.</p>
            </div>

            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl font-serif font-black text-[#c5a059] mb-3">04</div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Paperwork & Key Handover</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Complete legal registration and receive keys to your brand new home!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GOOGLE REVIEWS SECTION (Warm Beige Background with Infinite Horizontal Marquee) */}
      <section className="py-24 section-warm-beige border-t border-amber-200/60 overflow-hidden relative">
        <div className="container mx-auto px-4 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="badge-gold-dark mb-2">100% Authentic Feedback</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                What Our Clients Say on <span className="text-gradient-gold">Google Reviews</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl font-bold text-slate-900">4.8</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#fbbc04] text-[#fbbc04]" />
                ))}
              </div>
              <span className="text-xs text-slate-600 font-outfit font-semibold ml-1">(21+ Verified Reviews)</span>
            </div>
          </div>
        </div>

        {/* Infinite Horizontal Marquee Track with Left and Right Gradient Fades */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Left Gradient Edge Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#faf7f2] via-[#faf7f2]/80 to-transparent z-10 pointer-events-none"></div>
          {/* Right Gradient Edge Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#faf7f2] via-[#faf7f2]/80 to-transparent z-10 pointer-events-none"></div>

          <div className="marquee-track flex gap-6 px-4">
            {/* Repeat reviews array twice for continuous seamless loop */}
            {[...reviews, ...reviews].map((review, idx) => (
              <ReviewCard key={`${review.id}-${idx}`} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. STRATEGIC GROWTH NODES SECTION (Dark Navy Background) */}
      <section className="py-24 section-navy border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="badge-gold">Strategic Locations</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Prime Growth Nodes in <span className="text-gradient-gold">Navi Mumbai</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 font-outfit">
            {[
              { name: 'Nerul East & West', desc: 'Central Connectivity & Station Hub' },
              { name: 'Seawoods Grand Central', desc: 'Luxury Coastal & Mall Belt' },
              { name: 'Kharghar Central', desc: 'Golf Course & Metro Corridor' },
              { name: 'Upper Kharghar', desc: '4-Acre Miyawaki Townships' },
              { name: 'Ulwe Coastal Node', desc: 'MTHL Sea Link & Bamandongri' },
              { name: 'Pushpak Nagar', desc: 'Adjacent to NMIA Airport' },
              { name: 'Juinagar & Sanpada', desc: 'Station Proximity & Vashi Hub' },
              { name: 'Panvel & Expressway', desc: 'Smart City Expansion' },
            ].map((area, idx) => (
              <Link
                key={idx}
                to={`/projects?area=${encodeURIComponent(area.name)}`}
                className="bg-glass p-5 rounded-xl border border-slate-800 hover:border-[#c5a059] transition-all text-left block group"
              >
                <h4 className="font-bold text-white text-sm group-hover:text-[#e5c178] transition-colors mb-1">
                  {area.name}
                </h4>
                <p className="text-xs text-slate-400">{area.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BOTTOM HIGH CONVERSION CTA BANNER */}
      <section className="py-20 section-white border-t border-slate-200/80">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#070b19] p-8 sm:p-14 rounded-3xl border border-[#c5a059]/40 text-center relative overflow-hidden shadow-2xl">
            <div className="max-w-3xl mx-auto space-y-6 relative z-10">
              <span className="badge-gold">Limited Developer Offers</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                Ready to Secure Your Luxury Home in <span className="text-gradient-gold">Navi Mumbai?</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-outfit">
                Talk directly with our senior consultants at <strong className="text-white">Jayshree Realty</strong> today for priority site visits.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => openModal('Bottom Home CTA Banner')}
                  className="btn-gold px-9 py-4 text-sm font-bold shadow-xl"
                >
                  REQUEST INSTANT CALLBACK
                </button>
                
                <a
                  href="https://wa.me/918169005579?text=Hello,%20I%20want%20property%20information%20from%20Jayshree%20Realty."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp px-7 py-4 text-sm font-bold"
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> CHAT ON WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
