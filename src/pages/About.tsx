import React from 'react';
import { SEOHead } from '../components/SEOHead';
import { ShieldCheck, Users, MapPin, CheckCircle2, Building2, ArrowRight } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

export const About: React.FC = () => {
  const { openModal } = useLeads();

  return (
    <div className="min-h-screen font-sans">
      <SEOHead
        title="About Us | Trusted Luxury Real Estate Consultant in Nerul & Navi Mumbai"
        description="Learn about Jayshree Realty, Navi Mumbai's leading real estate consultancy located at Nerul Railway Station Complex. Over 15 years of excellence."
      />

      {/* 1. HERO HEADER (Dark Navy Background) */}
      <section className="pt-32 pb-20 section-navy border-b border-[#c5a059]/20">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-4">
          <span className="badge-gold">Our Legacy of Trust</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            About <span className="text-gradient-gold">Jayshree Realty</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-outfit leading-relaxed">
            Navi Mumbai’s premier real estate consultancy, delivering transparent property acquisitions, verified CIDCO titles, and zero-hassle paperwork for over 15 years.
          </p>
        </div>
      </section>

      {/* 2. STORY SECTION (Pure White Background) */}
      <section className="py-24 section-white border-b border-slate-200/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6 text-slate-700 font-outfit">
              <span className="badge-gold-dark">15+ Years Excellence</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 leading-snug">
                Building Lifetime Customer Relationships in <span className="text-gradient-gold">Navi Mumbai</span>
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                Founded on the pillars of integrity, transparency, and deep local market expertise, <strong>Jayshree Realty</strong> has established itself as one of the most reliable real estate consultancies headquartered at the <strong>Nerul Railway Station Complex</strong>.
              </p>
              <p className="text-sm leading-relaxed text-slate-600">
                Whether you are buying a dream 1 BHK or 2 BHK home in Nerul/Seawoods, exploring investment opportunities in upcoming townships in Kharghar and Ulwe, or securing high-appreciation plots near the Navi Mumbai International Airport in Pushpak Nagar, our dedicated team guides you through every step.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-[#99732b]" /> 100% Legal Title Search & CIDCO Paperwork
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-[#99732b]" /> Verified Developer Inventory & Direct Pricing
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-[#99732b]" /> Complimentary Transport for Site Visits
                </div>
              </div>

              <div className="pt-4">
                <button onClick={() => openModal('About Page CTA')} className="btn-gold text-xs px-7 py-3.5 font-bold shadow-lg">
                  Book Free Consultation <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-amber-200/80 shadow-2xl bg-white p-3">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"
                  alt="Jayshree Realty Head Office"
                  className="rounded-2xl w-full h-80 sm:h-96 object-cover"
                />
                <div className="p-4 text-left font-outfit bg-slate-50 rounded-xl mt-3 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-[#99732b] font-bold">
                    <MapPin className="w-4 h-4 text-[#c5a059]" /> Official Head Office
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    G-102, First Floor, Nerul Railway Station Complex, above Union Bank of India, Nerul, Navi Mumbai 400706
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS (Warm Beige Background) */}
      <section className="py-24 section-warm-beige border-b border-amber-200/60">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="badge-gold-dark">Our Standards</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              The Pillars of Our <span className="text-gradient-gold">Service</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left">
              <div className="w-12 h-12 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">Transparency First</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-outfit leading-relaxed">
                No hidden fees, no misleading carpet areas. We present raw facts, verified floor plans, and exact all-inclusive prices.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left">
              <div className="w-12 h-12 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">Exclusive Inventory</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-outfit leading-relaxed">
                Direct access to top developer launches in Kharghar, Pushpak Nagar, Ulwe, Seawoods & Panvel.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left">
              <div className="w-12 h-12 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">Dedicated Advisory</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-outfit leading-relaxed">
                Personal executive assistance from start to key handover, ensuring seamless bank loan approvals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION (Dark Navy Background) */}
      <section className="py-20 section-navy">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
          <span className="badge-gold">Get in Touch</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Looking for Your Next <span className="text-gradient-gold">Property Deal?</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-outfit">
            Speak directly with our senior advisors today for customized property options matching your exact budget.
          </p>
          <div className="pt-2">
            <button onClick={() => openModal('About Bottom CTA')} className="btn-gold px-8 py-3.5 font-bold text-xs uppercase shadow-xl">
              Schedule Free Site Visit
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
