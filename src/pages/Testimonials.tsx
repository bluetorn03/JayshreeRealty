import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useData } from '../context/DataContext';
import { useLeads } from '../context/LeadContext';
import {
  Star, ShieldCheck, MapPin, Quote, Play, CheckCircle2,
  Users, Building2, ArrowRight, X, Phone, MessageSquare
} from 'lucide-react';
import officeImage from '../assets/office-image.jpeg';

export const Testimonials: React.FC = () => {
  const { reviews } = useData();
  const { openModal } = useLeads();
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  const videoTestimonials = [
    {
      id: 'v1',
      clientName: 'Rahul & Meera Deshmukh',
      location: 'Bought 2 BHK in Nerul West',
      title: 'Seamless CIDCO Title Clear Verification & Zero Brokerage',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'v2',
      clientName: 'Dr. Anish Shetty',
      location: 'Invested in Pushpak Nagar CIDCO Plot',
      title: 'Exclusive Airport Node Launch Price Advantage',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const officeGallery = [
    { title: 'Jayshree Realty Head Office Front', img: officeImage },
    { title: 'Client Consultation Suite', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800' },
    { title: 'Legal & Documentation Desk', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800' }
  ];

  const happyClientsGallery = [
    { caption: 'Flat Key Handover in Seawoods Grand', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800' },
    { caption: 'CIDCO Plot Allotment Verification', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800' },
    { caption: 'Happy Family at Kharghar Township Launch', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <div className="min-h-screen font-sans bg-[#070b19]">
      <SEOHead
        title="Client Testimonials & Office Gallery | Jayshree Realty Navi Mumbai"
        description="Read authentic client reviews, watch testimonial videos, view our Nerul Railway Station office gallery and meet Jayshree Realty's leadership team."
      />

      {/* 1. HERO HEADER */}
      <section className="relative pt-32 pb-20 border-b border-[#c5a059]/20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b19]/90 via-[#070b19]/75 to-[#070b19]" />
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-4 relative z-10">
          <span className="badge-gold">Verified Client Reviews</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Client Stories & <span className="text-gradient-gold">Trust Reviews</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-outfit leading-relaxed">
            Discover why 450+ families and investors trust Jayshree Realty for purchasing premium CIDCO plots, direct launch apartments, and prime resale homes across Navi Mumbai.
          </p>
        </div>
      </section>

      {/* 2. CEO THOUGHT & LEADERSHIP SECTION */}
      <section className="py-20 border-b border-slate-800 bg-[#0a1022]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#0d1527] to-[#121c35] border border-[#c5a059]/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/10 rounded-full blur-3xl"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-4 text-center">
                <div className="relative inline-block rounded-2xl overflow-hidden border-2 border-[#c5a059] shadow-2xl p-1.5 bg-[#070b19]">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
                    alt="CEO Jayshree Realty"
                    className="w-48 h-56 sm:w-56 sm:h-64 object-cover rounded-xl"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-[#070b19]/90 backdrop-blur-md border border-[#c5a059]/40 rounded-lg p-2 text-center">
                    <span className="font-serif text-xs font-bold text-[#e5c178] block">Jayshree Realty Founder</span>
                    <span className="text-[10px] text-slate-300">15+ Yrs Navi Mumbai Real Estate Expertise</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4 font-outfit">
                <Quote className="w-10 h-10 text-[#c5a059] opacity-60" />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                  "Real Estate isn't just about buying square feet—it's about securing family legacies with complete legal peace of mind."
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  At Jayshree Realty, every single plot title, CIDCO clearance, and property document undergoes strict legal audit before we present it to our clients. Our goal is 100% transparency, zero hidden charges, and lifelong market advisory.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-[#e5c178] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#c5a059]" /> 100% Legal Title Search Guaranteed
                  </span>
                  <span className="flex items-center gap-1.5 text-[#e5c178] font-semibold">
                    <Building2 className="w-4 h-4 text-[#c5a059]" /> Station Complex Head Office
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REAL CLIENT REVIEWS GRID */}
      <section className="py-20 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3 font-outfit">
            <span className="badge-gold">Client Feedback</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              What Our Buyers & Sellers Say
            </h2>
            <p className="text-sm text-slate-400">
              Verified 5-Star Google ratings from property owners across Nerul, Seawoods, Kharghar & Ulwe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#0d1527] border border-slate-800 hover:border-[#c5a059]/50 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 font-outfit"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${rev.avatarColor || 'bg-amber-600'} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{rev.author}</h3>
                        <span className="text-[11px] text-slate-400">{rev.timeAgo}</span>
                      </div>
                    </div>
                    {rev.verified && (
                      <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-amber-400 text-xs">
                    {'★'.repeat(rev.rating || 5)}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{rev.content}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Google Review</span>
                  <span>{rev.reviewsCount || '100% Genuine'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OFFICE & HEADQUARTERS IMAGE GALLERY */}
      <section className="py-20 border-b border-slate-800 bg-[#090f20]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3 font-outfit">
            <span className="badge-gold">Head Office Infrastructure</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Visit Our Nerul Station Office
            </h2>
            <p className="text-sm text-slate-400">
              Conveniently located at G-102, 1st Floor, Nerul Railway Station Complex (above Union Bank of India).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {officeGallery.map((item, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden border border-[#c5a059]/30 shadow-2xl bg-[#0d1527]">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-left font-outfit">
                  <span className="text-[11px] text-[#e5c178] font-bold block">{item.title}</span>
                  <p className="text-[10px] text-slate-300">Nerul Railway Station Complex, Navi Mumbai</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HAPPY CLIENTS GALLERY */}
      <section className="py-20 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3 font-outfit">
            <span className="badge-gold">Happy Buyers & Investors</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Moments of Joy & Key Handovers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {happyClientsGallery.map((item, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-[#0d1527]">
                <img
                  src={item.img}
                  alt={item.caption}
                  className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 font-outfit">
                  <span className="text-xs text-white font-bold block">{item.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIAL VIDEOS */}
      <section className="py-20 border-b border-slate-800 bg-[#090f20]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3 font-outfit">
            <span className="badge-gold">Video Reviews</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Watch Video Testimonials
            </h2>
            <p className="text-sm text-slate-400">
              Hear directly from our homeowners about their property buying experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {videoTestimonials.map((vid) => (
              <div
                key={vid.id}
                className="bg-[#0d1527] border border-[#c5a059]/30 rounded-2xl overflow-hidden shadow-2xl group flex flex-col font-outfit"
              >
                <div className="relative h-56 bg-slate-900">
                  <img src={vid.thumbnail} alt={vid.clientName} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button
                      onClick={() => setSelectedVideoUrl(vid.youtubeUrl)}
                      className="w-14 h-14 rounded-full bg-[#c5a059] text-[#070b19] flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110"
                    >
                      <Play className="w-6 h-6 fill-[#070b19] ml-1" />
                    </button>
                  </div>
                </div>
                <div className="p-5 flex-1 space-y-2">
                  <span className="badge-gold text-[10px]">{vid.location}</span>
                  <h3 className="font-serif font-bold text-white text-base">{vid.title}</h3>
                  <p className="text-xs text-slate-300">{vid.clientName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DIRECT CONSULTATION CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6 font-outfit">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Ready to Find Your <span className="text-gradient-gold">Dream Home?</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Book a complimentary office meeting or free site visit with our senior real estate consultants today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openModal('Testimonials Page Bottom CTA')}
              className="btn-gold px-8 py-4 text-sm font-bold shadow-xl"
            >
              BOOK FREE CONSULTATION <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <a
              href="tel:+918169005579"
              className="btn-phone px-7 py-4 text-sm font-semibold"
            >
              <Phone className="w-4 h-4 text-[#c5a059]" /> Call +91 81690 05579
            </a>
          </div>
        </div>
      </section>

      {/* YOUTUBE VIDEO MODAL */}
      {selectedVideoUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-[#0d1527] border border-[#c5a059]/40 rounded-3xl p-4 w-full max-w-3xl shadow-2xl relative">
            <button
              onClick={() => setSelectedVideoUrl(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[#c5a059] text-[#070b19] flex items-center justify-center font-bold shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative pt-[56.25%] rounded-2xl overflow-hidden bg-black">
              <iframe
                src={`${selectedVideoUrl}?autoplay=1`}
                title="Testimonial Video"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
