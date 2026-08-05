import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useData } from '../context/DataContext';
import { useLeads } from '../context/LeadContext';
import { getYouTubeEmbedUrl } from '../utils/youtube';
import {
  Star, ShieldCheck, MapPin, Quote, Play, CheckCircle2,
  Users, Building2, ArrowRight, X, Phone, MessageSquare, Award, Briefcase
} from 'lucide-react';
import officeImage from '../assets/office-image.jpeg';
import { DEFAULT_LEADERSHIP, DEFAULT_VIDEO_TESTIMONIALS } from '../context/DataContext';
import { LeadershipProfile, VideoTestimonialItem } from '../types';

export const Testimonials: React.FC = () => {
  const { reviews, leadership, videoTestimonials } = useData();
  const { openModal } = useLeads();
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  // Leadership Profiles (Column 1: Founder, Column 2: CEO)
  const activeLeadership = (leadership && leadership.length > 0) ? leadership : DEFAULT_LEADERSHIP;
  const founder = activeLeadership.find((l: LeadershipProfile) => l.role === 'Founder') || activeLeadership[0];
  const ceo = activeLeadership.find((l: LeadershipProfile) => l.role === 'CEO') || activeLeadership[1] || activeLeadership[0];
  const displayVideos = (videoTestimonials && videoTestimonials.length > 0) ? videoTestimonials : DEFAULT_VIDEO_TESTIMONIALS;

  const officeGallery = [
    { title: 'Jayshree Realty Head Office Front', img: officeImage },
    { title: 'Client Consultation Suite', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800' },
    { title: 'Legal & Documentation Desk', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <div className="min-h-screen font-sans bg-[#070b19]">
      <SEOHead
        title="Client Testimonials & Office Gallery | Jayshree Realty Navi Mumbai"
        description="Read authentic client reviews, watch testimonial videos, view our Nerul Railway Station office gallery and meet Jayshree Realty's leadership team."
      />

      {/* SECTION 1: HERO HEADER (DARK THEME) */}
      <section className="relative pt-32 pb-20 border-b border-[#c5a059]/20 overflow-hidden bg-[#070b19]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b19]/90 via-[#070b19]/75 to-[#070b19]" />
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-4 relative z-10">
          <span className="badge-gold">Verified Client Reviews & Leadership</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Client Stories & <span className="text-gradient-gold">Leadership Vision</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-outfit leading-relaxed">
            Discover why 450+ families and investors trust Jayshree Realty for purchasing premium CIDCO plots, direct launch apartments, and prime resale homes across Navi Mumbai.
          </p>
        </div>
      </section>

      {/* SECTION 2: FOUNDER & CEO LEADERSHIP SECTION (LIGHT THEME) */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3 font-outfit">
            <span className="badge-gold-dark">Leadership Team</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Pioneering Integrity in <span className="text-[#99732b]">Navi Mumbai Real Estate</span>
            </h2>
            <p className="text-sm text-slate-600">
              Meet the founders leading Jayshree Realty's commitment to 100% legal title verification and zero-brokerage acquisitions.
            </p>
          </div>

          {/* 2-Column Layout: Column 1 (Founder), Column 2 (CEO) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Column 1: Founder Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-36 h-44 object-cover rounded-2xl border-2 border-[#c5a059] shadow-md shrink-0"
                  />
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="badge-gold text-[10px] font-bold uppercase">{founder.role}</span>
                    <h3 className="font-serif text-2xl font-bold text-slate-900">{founder.name}</h3>
                    <p className="text-xs font-semibold text-[#99732b]">{founder.designation}</p>
                    <p className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#c5a059]" /> {founder.experience}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 font-outfit text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
                  <p className="italic text-slate-700 font-medium">"{founder.description}"</p>
                  
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Key Achievements</span>
                    <span className="font-bold text-slate-900">{founder.achievements}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 font-medium pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>{founder.officeLocation}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                {founder.badges.map((b: string, idx: number) => (
                  <span key={idx} className="bg-[#c5a059]/15 text-[#99732b] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#c5a059]/30">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Column 2: CEO Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <img
                    src={ceo.image}
                    alt={ceo.name}
                    className="w-36 h-44 object-cover rounded-2xl border-2 border-[#c5a059] shadow-md shrink-0"
                  />
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="badge-gold text-[10px] font-bold uppercase">{ceo.role}</span>
                    <h3 className="font-serif text-2xl font-bold text-slate-900">{ceo.name}</h3>
                    <p className="text-xs font-semibold text-[#99732b]">{ceo.designation}</p>
                    <p className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1">
                      <Award className="w-3.5 h-3.5 text-[#c5a059]" /> {ceo.experience}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 font-outfit text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
                  <p className="italic text-slate-700 font-medium">"{ceo.description}"</p>
                  
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Key Achievements</span>
                    <span className="font-bold text-slate-900">{ceo.achievements}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 font-medium pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>{ceo.officeLocation}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                {ceo.badges.map((b: string, idx: number) => (
                  <span key={idx} className="bg-[#c5a059]/15 text-[#99732b] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#c5a059]/30">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: REAL CLIENT REVIEWS GRID (DARK THEME) */}
      <section className="py-20 bg-[#070b19] border-b border-slate-800">
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

      {/* SECTION 4: OFFICE INFRASTRUCTURE (LIGHT THEME) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3 font-outfit">
            <span className="badge-gold-dark">Head Office Infrastructure</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Visit Our Nerul Station Office
            </h2>
            <p className="text-sm text-slate-600">
              Conveniently located at G-102, 1st Floor, Nerul Railway Station Complex (above Union Bank of India).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {officeGallery.map((item, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-left font-outfit">
                  <span className="text-[11px] text-[#e5c178] font-bold block">{item.title}</span>
                  <p className="text-[10px] text-slate-300">Nerul Railway Station Complex, Navi Mumbai</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: VIDEO TESTIMONIALS (DARK THEME) */}
      <section className="py-20 bg-[#070b19] border-b border-slate-800">
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
            {displayVideos.map((vid: VideoTestimonialItem) => (
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

      {/* SECTION 6: DIRECT CONSULTATION CTA (LIGHT THEME) */}
      <section className="py-20 bg-amber-50/50 border-b border-amber-200/60">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6 font-outfit">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Ready to Find Your <span className="text-[#99732b]">Dream Home?</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
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
              className="px-7 py-4 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2"
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
                src={getYouTubeEmbedUrl(selectedVideoUrl || undefined, true)}
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
