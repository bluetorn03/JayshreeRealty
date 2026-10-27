import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { ProjectCard } from '../components/ProjectCard';
import { ReviewCard } from '../components/ReviewCard';
import { useData } from '../context/DataContext';
import { useLeads } from '../context/LeadContext';
import { useScrollReveal } from '../utils/useScrollReveal';
import {
  Building2, MapPin, ShieldCheck, Award, ArrowRight,
  Sparkles, Star, Phone, MessageSquare, Users
} from 'lucide-react';
import heroDesktopBg from '../assets/hero-dekstop-view.webp';
import heroMobileBg from '../assets/hero-mobie-view.webp';

const DEFAULT_KEYWORDS = ["Premium Projects", "Buy Property", "Sell Property", "Verified Properties", "Navi Mumbai", "Luxury Homes"];

export const Home: React.FC = () => {
  const { openModal } = useLeads();
  const { projects, reviews, heroSettings, siteSettings } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchLocation, setSearchLocation] = useState<string>('');

  // Smooth infinite marquee reference (continuous linear motion without scroll resets)
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);

  // Guarantee sufficient review cards for an infinite continuous seamless track
  const marqueeReviewsList = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    if (reviews.length < 8) {
      return [...reviews, ...reviews, ...reviews];
    }
    return reviews;
  }, [reviews]);

  // Activate BeyondArtist 2.2 Scroll Reveal
  useScrollReveal([selectedCategory, projects.length]);

  // Smooth Typewriter Animation State Machine (Zero flickering, zero layout shift)
  const keywords = useMemo(() => {
    return heroSettings.keywords && heroSettings.keywords.length > 0
      ? heroSettings.keywords
      : [
          "Specialized focus on Navi Mumbai International Airport nearby nodes",
          ...DEFAULT_KEYWORDS
        ];
  }, [heroSettings.keywords]);

  const [keywordIndex, setKeywordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = keywords[keywordIndex % keywords.length] || '';

    if (!isDeleting && currentText === fullText) {
      // Pause at full text before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && currentText === '') {
      // Pause at empty before next keyword
      setIsDeleting(false);
      setKeywordIndex((prev) => (prev + 1) % keywords.length);
    } else {
      // Type/delete character
      const speed = isDeleting ? 30 : 60;
      timer = setTimeout(() => {
        setCurrentText((prev) =>
          isDeleting
            ? fullText.substring(0, prev.length - 1)
            : fullText.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, keywordIndex, keywords]);

  const featuredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (p.published === false || p.archived === true) return false;
      if (p.placements && p.placements.length > 0 && !p.placements.includes('homepage') && !p.placements.includes('featured') && !p.isFeatured) return false;
      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Resale') return p.type === 'Resale';
      return p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    }).slice(0, 6);
  }, [projects, selectedCategory]);

  const desktopHeroBg = (heroSettings.backgroundImage && !heroSettings.backgroundImage.includes('unsplash.com'))
    ? heroSettings.backgroundImage
    : heroDesktopBg;

  const mobileHeroBg = (heroSettings.backgroundImage && !heroSettings.backgroundImage.includes('unsplash.com'))
    ? heroSettings.backgroundImage
    : heroMobileBg;

  return (
    <div className="min-h-screen bg-[#070b19] font-sans">
      <SEOHead
        title="Jayshree Realty | Premium Luxury Real Estate Consultant in Navi Mumbai"
        description="Jayshree Realty is Navi Mumbai's leading luxury real estate consultant offering 100+ verified projects in Nerul, Seawoods, Kharghar, Ulwe, Pushpak Nagar & Panvel."
      />

      {/* HERO & METRICS PINNED OVERLAY CONTAINER (Desktop cinematic scroll-over effect) */}
      <div className="relative">
        {/* 1. HERO SECTION (Dark Navy Background, pinned on desktop, releases before subsequent sections) */}
        <section className="relative md:sticky md:top-0 md:z-0 min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden border-b border-[#c5a059]/20 section-navy">
          {/* Desktop View Background Image (>= md) */}
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat animate-hero-parallax transition-all will-change-transform"
            style={{
              backgroundImage: `url("${desktopHeroBg}")`
            }}
          >
            {/* Lighter Gradient Overlay so background image is vibrant and visible */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b19]/30 via-[#070b19]/25 to-[#070b19]/8"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-transparent to-[#070b19]/10"></div>
          </div>

          {/* Mobile View Background Image (< md) */}
          <div
            className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat animate-hero-parallax transition-all will-change-transform"
            style={{
              backgroundImage: `url("${mobileHeroBg}")`
            }}
          >
            {/* Lighter Gradient Overlay so background image is vibrant and visible */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b19]/30 via-[#070b19]/25 to-[#070b19]/8"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-transparent to-[#070b19]/10"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Hero Left Content */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#e5c178] text-xs font-outfit uppercase tracking-widest font-semibold hero-motion-badge shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                  100+ Verified Projects | Nerul, Kharghar, Ulwe, Pushpak Nagar & Panvel
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight hero-motion-title">
                  {heroSettings.headingPart1 || "Navi Mumbai’s Most"} <br />
                  <span className="text-gradient-gold">{heroSettings.headingGold || "Trusted Luxury Real Estate"}</span>
                </h1>

                {/* Typewriter Animation for Rotating Keywords */}
                <div className="flex flex-wrap items-center gap-2 font-outfit text-base sm:text-xl lg:text-2xl text-slate-200 font-semibold min-h-[52px] sm:min-h-[44px] hero-motion-typewriter">
                  <span className="text-slate-400 shrink-0">Specialized In:</span>
                  <span className="text-[#e5c178] font-bold inline-flex items-center min-h-[32px] break-words">
                    <span>{currentText}</span>
                    <span className="w-0.5 h-6 bg-[#c5a059] ml-1 animate-pulse shrink-0" aria-hidden="true" />
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-300 font-outfit leading-relaxed max-w-2xl hero-motion-desc">
                  {heroSettings.subtext || "Experience transparent property buying with verified CIDCO plots, direct developer launches, and prime resale homes across Nerul, Seawoods, Kharghar, Ulwe, Pushpak Nagar & Panvel."}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-3 hero-motion-ctas">
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
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 font-outfit text-xs text-slate-300 hero-motion-trust">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#c5a059] shrink-0" />
                    <span>100% Legal Title Search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#c5a059] shrink-0" />
                    <span>Direct Developer Launch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#c5a059] fill-[#c5a059] shrink-0" />
                    <span>4.8/5 Rated on Google</span>
                  </div>
                </div>
              </div>

              {/* Hero Right Quick Search Form */}
              <div className="lg:col-span-5 hero-motion-card">
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
                        href={`tel:${siteSettings?.phoneRaw || '+918169005579'}`}
                        className="text-xs text-slate-300 hover:text-[#e5c178] inline-flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#c5a059]" /> Direct Call: <strong>{siteSettings?.phone || '+91 81690 05579'}</strong>
                      </a>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. METRICS COUNTER SECTION (Pure White Background, smoothly slides up over pinned hero on desktop) */}
        <section className="relative z-10 py-16 section-white border-t border-[#c5a059]/30 border-b border-slate-200/80 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="reveal stagger-1">
                <AnimatedCounter
                  end={150}
                  suffix="+"
                  label="Verified Projects"
                  sublabel="Sanpada to Panvel"
                  icon={Building2}
                />
              </div>
              <div className="reveal stagger-2">
                <AnimatedCounter
                  end={25}
                  suffix="+"
                  label="Years Trust"
                  sublabel="Navi Mumbai Experts"
                  icon={Award}
                />
              </div>
              <div className="reveal stagger-3">
                <AnimatedCounter
                  end={750}
                  suffix="+"
                  label="Happy Families"
                  sublabel="Seamless Closures"
                  icon={Users}
                />
              </div>
              <div className="reveal stagger-4">
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
          </div>
        </section>
      </div>

      {/* 3. FEATURED PROJECTS SECTION (Warm Beige Background) */}
      <section className="relative z-10 py-24 section-warm-beige border-b border-amber-200/60">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 reveal">
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
                  className={`px-4 py-2 rounded-full border transition-all duration-300 font-semibold ${selectedCategory === cat
                    ? 'bg-[#0b132b] text-white border-[#0b132b] shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#c5a059]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Responsive Grid (Row 1 reveals from left, Row 2 reveals from right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((property, idx) => {
              const isEvenRow = Math.floor(idx / 3) % 2 === 0;
              return (
                <div
                  key={property.id}
                  className={`${isEvenRow ? 'reveal-left' : 'reveal-right'} stagger-${(idx % 3) + 1}`}
                >
                  <ProjectCard property={property} theme="light" />
                </div>
              );
            })}
          </div>

          <div className="mt-14 text-center reveal stagger-2">
            <Link to="/projects" className="btn-gold view-all-highlight px-9 py-4 text-sm font-bold shadow-xl">
              View All 100+ Projects & Listings <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US SECTION (Dark Navy Background) */}
      <section className="py-24 section-navy-secondary border-y border-[#c5a059]/20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 reveal">
            <span className="badge-gold mb-2">Unmatched Integrity</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Why Buyers & Sellers Trust <span className="text-gradient-gold">Jayshree Realty</span>
            </h2>
            <p className="text-sm text-slate-300 font-outfit">
              We eliminate guesswork with direct site visits, legal title verifications, and zero brokerage structures for new developer launches in Navi Mumbai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#070b19] p-8 rounded-2xl border border-slate-800 hover:border-[#c5a059]/40 transition-all duration-300 text-left group hover:-translate-y-1 reveal stagger-1">
              <div className="w-14 h-14 rounded-xl bg-[#c5a059]/15 text-[#c5a059] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">CIDCO Title & Legal Clearance</h3>
              <p className="text-xs text-slate-400 font-outfit leading-relaxed">
                Every property listed undergoes rigorous legal audit by local advocate experts to ensure complete peace of mind and hassle-free bank home loan approvals.
              </p>
            </div>

            <div className="bg-[#070b19] p-8 rounded-2xl border border-slate-800 hover:border-[#c5a059]/40 transition-all duration-300 text-left group hover:-translate-y-1 reveal stagger-2">
              <div className="w-14 h-14 rounded-xl bg-[#c5a059]/15 text-[#c5a059] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Station Proximity & Airport Hubs</h3>
              <p className="text-xs text-slate-400 font-outfit leading-relaxed">
                Specialized focus on Nerul Railway Station Complex, Seawoods Grand Central, Ulwe Bamandongri, and Pushpak Nagar Airport node properties.
              </p>
            </div>

            <div className="bg-[#070b19] p-8 rounded-2xl border border-slate-800 hover:border-[#c5a059]/40 transition-all duration-300 text-left group hover:-translate-y-1 reveal stagger-3">
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
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 reveal">
            <span className="badge-gold-dark">Simplified Journey</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              4 Easy Steps to Your <span className="text-gradient-gold">Dream Home</span>
            </h2>
          </div>

          <div className="relative">
            {/* Visual Connector Trace Line across steps 01-04 on desktop without changing geometry */}
            <div
              className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#c5a059]/30 to-transparent pointer-events-none z-0"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-outfit relative z-10">
              <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal stagger-1">
                <div className="text-4xl font-serif font-black text-[#c5a059] mb-3 transition-transform duration-300 hover:scale-105 inline-block">01</div>
                <h4 className="font-bold text-slate-900 text-base mb-2">Share Requirement</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Tell us your preferred budget, node (Nerul, Ulwe, Kharghar), and configuration.</p>
              </div>

              <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal stagger-2">
                <div className="text-4xl font-serif font-black text-[#c5a059] mb-3 transition-transform duration-300 hover:scale-105 inline-block">02</div>
                <h4 className="font-bold text-slate-900 text-base mb-2">Curated Site Visits</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Visit handpicked verified properties with our personal transport executive.</p>
              </div>

              <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal stagger-3">
                <div className="text-4xl font-serif font-black text-[#c5a059] mb-3 transition-transform duration-300 hover:scale-105 inline-block">03</div>
                <h4 className="font-bold text-slate-900 text-base mb-2">Best Deal Negotiation</h4>
                <p className="text-xs text-slate-600 leading-relaxed">We negotiate maximum discounts directly with top builder developers.</p>
              </div>

              <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal stagger-4">
                <div className="text-4xl font-serif font-black text-[#c5a059] mb-3 transition-transform duration-300 hover:scale-105 inline-block">04</div>
                <h4 className="font-bold text-slate-900 text-base mb-2">Paperwork & Key Handover</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Complete legal registration and receive keys to your brand new home!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GOOGLE REVIEWS SECTION (Warm Beige Background with Infinite Horizontal Marquee) */}
      <section className="py-24 section-warm-beige border-t border-amber-200/60 overflow-hidden relative">
        <div className="container mx-auto px-4 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 reveal">
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

          <div
            ref={marqueeTrackRef}
            className="marquee-track flex"
          >
            {/* Track 1 */}
            <div className="flex gap-6 pr-6 shrink-0">
              {marqueeReviewsList.map((review, idx) => (
                <ReviewCard key={`t1-${review.id}-${idx}`} review={review} />
              ))}
            </div>
            {/* Track 2: Duplicate for seamless continuous infinite loop without jump */}
            <div className="flex gap-6 pr-6 shrink-0" aria-hidden="true">
              {marqueeReviewsList.map((review, idx) => (
                <ReviewCard key={`t2-${review.id}-${idx}`} review={review} />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials CTA Banner Below Google Reviews */}
        <div className="container mx-auto px-4 mt-8 relative z-20">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xl reveal stagger-2">
            <div className="space-y-1 font-outfit">
              <span className="badge-gold">Verified Client Gallery & Videos</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Explore Full Client Stories, Head Office Gallery & Video Reviews
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-outfit">
                Watch video testimonials, view our Nerul Railway Station office gallery, and read in-depth reviews.
              </p>
            </div>
            <Link
              to="/testimonials"
              className="btn-gold shrink-0 px-6 py-3.5 text-xs font-bold shadow-lg flex items-center gap-2"
            >
              VIEW TESTIMONIALS PAGE <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. STRATEGIC GROWTH NODES SECTION (Dark Navy Background) */}
      <section className="py-24 section-navy border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3 reveal">
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
                className={`bg-glass p-5 rounded-xl border border-slate-800 hover:border-[#c5a059] transition-all text-left block group reveal stagger-${(idx % 4) + 1}`}
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
          <div className="bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#070b19] p-8 sm:p-14 rounded-3xl border border-[#c5a059]/40 text-center relative overflow-hidden shadow-2xl reveal">
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
                  href={`https://wa.me/${siteSettings?.whatsappRaw || '918169005579'}?text=Hello,%20I%20want%20property%20information%20from%20Jayshree%20Realty.`}
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
