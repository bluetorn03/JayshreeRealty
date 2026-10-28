import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import heroDesktopBg from '../assets/hero-dekstop-view.webp';
import heroMobileBg from '../assets/hero-mobie-view.webp';
import { useLeads } from '../context/LeadContext';
import { useData } from '../context/DataContext';
import { ResumeUploader } from '../components/ResumeUploader';
import {
  MapPin, Phone, MessageSquare, Clock, CheckCircle2, Send,
  Mail, Briefcase, UserCheck, Instagram, Facebook, Youtube,
  Navigation, ExternalLink, Car, Train
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { addLead } = useLeads();
  const { siteSettings } = useData();
  const [activeFormTab, setActiveFormTab] = useState<'contact' | 'career'>('contact');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Contact Form state
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: '',
    requirement: 'Buy',
    message: ''
  });

  // Career Form state
  const [careerData, setCareerData] = useState({
    name: '',
    phone: '',
    email: '',
    position: 'Real Estate Sales Executive',
    experience: '1-3 Years',
    resumeUrl: '',
    resumeFilename: '',
    resumeMimeType: '',
    resumeSize: 0,
    message: ''
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.phone || isSubmitting) return;

    setIsSubmitting(true);
    setFormError('');

    try {
      const res = await addLead({
        name: contactData.name,
        phone: contactData.phone,
        email: contactData.email,
        requirement: contactData.requirement,
        budget: 'General Inquiry',
        preferredArea: 'Nerul Head Office',
        propertyType: 'All',
        message: contactData.message,
        lead_source: 'Contact Us Form',
        cta_source: 'Contact Page Direct Form',
        page_name: 'Contact Us'
      });

      if (res && res.success === false) {
        setFormError(res.message || 'Failed to submit inquiry. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setFormError(err.message || 'Error submitting inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerData.name || !careerData.phone || isSubmitting) return;

    setIsSubmitting(true);
    setFormError('');

    try {
      const res = await addLead({
        name: careerData.name,
        phone: careerData.phone,
        email: careerData.email,
        requirement: `Career: ${careerData.position}`,
        budget: `Experience: ${careerData.experience}`,
        preferredArea: 'Head Office Nerul',
        propertyType: 'Career Application',
        message: careerData.message || `Applicant for ${careerData.position} (${careerData.experience})`,
        lead_source: 'Career Form Application',
        cta_source: 'Contact Page Career Switcher',
        page_name: 'Contact Us / Careers',
        resumeUrl: careerData.resumeUrl,
        resumeFilename: careerData.resumeFilename,
        resumeMimeType: careerData.resumeMimeType,
        resumeSize: careerData.resumeSize
      });

      if (res && res.success === false) {
        setFormError(res.message || 'Failed to submit application. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setFormError(err.message || 'Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#070b19]">
      <SEOHead
        title="Contact Us & Careers | Jayshree Realty Nerul Railway Station"
        description="Visit Jayshree Realty at G-102, 1st Floor, Nerul Railway Station Complex. Connect via call, email info@jayshreerealty.com or apply for real estate careers."
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
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-3 relative z-10">
          <span className="badge-gold">Head Office & Careers</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Connect With <span className="text-gradient-gold">Jayshree Realty</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-outfit">
            Visit our head office at Nerul Railway Station Complex, inquire about property deals, or apply to join our growing team.
          </p>
        </div>
      </section>

      {/* 2. CONTACT DETAILS & DUAL FORM SWITCHER */}
      <section className="py-20 section-warm-beige">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">

            {/* Left Contact Info & Official Social Links (Sticky Shorter Column on Desktop) */}
            <div className="lg:col-span-5 space-y-6 font-outfit lg:sticky lg:top-28 lg:self-start reveal-left">
              <div className="bg-white p-8 rounded-3xl border border-amber-200/80 shadow-xl space-y-6">
                <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Official Head Office</h3>

                <div className="space-y-5 text-sm text-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Office Address</h4>
                      <p className="text-xs leading-relaxed text-slate-600 font-medium">
                        {siteSettings.address || 'G-102, First Floor, Nerul Railway Station Complex, above Union Bank of India, Nerul, Navi Mumbai 400706'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Direct Call</h4>
                      <a href={`tel:${siteSettings.phoneRaw || '+918169005579'}`} className="text-sm font-bold text-[#99732b] hover:underline">
                        {siteSettings.phone || '+91 81690 05579'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Official Email</h4>
                      <a href={`mailto:${siteSettings.email || 'info@jayshreerealty.com'}`} className="text-xs font-bold text-[#99732b] hover:underline">
                        {siteSettings.email || 'info@jayshreerealty.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#25d366]/15 text-[#25d366] flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">WhatsApp Chat</h4>
                      <a
                        href={`https://wa.me/${siteSettings.whatsappRaw || '918169005579'}?text=Hello,%20I%20want%20property%20information%20from%20Jayshree%20Realty.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#25d366] font-bold hover:underline"
                      >
                        {siteSettings.whatsapp || siteSettings.phone || '+91 81690 05579'} (Instant Reply)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Working Hours</h4>
                      <p className="text-xs text-slate-600 font-medium">Tuesday - Sunday: 10:30 AM - 7:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Connect On Social Media</h4>
                  <div className="flex items-center gap-3">
                    <a
                      href={siteSettings.instagramUrl || "https://www.instagram.com/jayshreerealty_navimumbai?igsh=aHlhNW1jdnRybGJs"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href={siteSettings.facebookUrl || "https://www.facebook.com/share/14k1PnjThjZ/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                      title="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a
                      href={siteSettings.youtubeUrl || "https://youtube.com/@jayshree_realty_navi_mumbai?si=TfK4HesvkWiswOEz"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                      title="YouTube"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card with Switcher Tabs (Contact Form / Career Form) */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-amber-200/80 shadow-2xl flex flex-col justify-between reveal-right">
              <div>
                {/* Form Switcher Tab Buttons */}
                <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl mb-8 border border-slate-200">
                  <button
                    onClick={() => { setActiveFormTab('contact'); setSubmitted(false); }}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      activeFormTab === 'contact'
                        ? 'bg-[#070b19] text-[#e5c178] shadow-lg'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-4 h-4" /> Contact Form
                  </button>
                  <button
                    onClick={() => { setActiveFormTab('career'); setSubmitted(false); }}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      activeFormTab === 'career'
                        ? 'bg-[#070b19] text-[#e5c178] shadow-lg'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" /> Career Form
                  </button>
                </div>

                {submitted ? (
                  <div className="py-12 text-center space-y-4 animate-fade-in font-outfit">
                    <div className="w-16 h-16 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center mx-auto border border-[#10b981]/30">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-slate-900">
                      {activeFormTab === 'contact' ? 'Message Sent Successfully!' : 'Career Application Received!'}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium">
                      Thank you for contacting <strong>Jayshree Realty</strong>. Our team will review your message and reach out shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold mt-4"
                    >
                      Submit Another Response
                    </button>
                  </div>
                ) : activeFormTab === 'contact' ? (
                  /* 1. CONTACT FORM */
                  <form onSubmit={handleContactSubmit} className="space-y-4 font-outfit">
                    <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">Send Us a Direct Message</h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={contactData.name}
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                        placeholder="e.g. Anand Gawde"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={contactData.phone}
                          onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                          placeholder="+91 98200 00000"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                        <input
                          type="email"
                          value={contactData.email}
                          onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                          placeholder="name@email.com"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nature of Inquiry</label>
                      <select
                        value={contactData.requirement}
                        onChange={(e) => setContactData({ ...contactData, requirement: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm font-medium"
                      >
                        <option value="Buy">Buy Residential Property</option>
                        <option value="Sell">Sell Property Valuation</option>
                        <option value="Commercial">Commercial Space Investment</option>
                        <option value="General">General Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-medium">Your Message</label>
                      <textarea
                        rows={4}
                        value={contactData.message}
                        onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                        placeholder="How can we assist you?"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                      ></textarea>
                    </div>

                    {formError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                        {formError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-gold w-full py-3.5 text-sm font-bold shadow-xl uppercase disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'SENDING INQUIRY...' : 'SEND INQUIRY NOW'}
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* 2. CAREER FORM */
                  <form onSubmit={handleCareerSubmit} className="space-y-4 font-outfit">
                    <div>
                      <span className="badge-gold mb-1">Join Our Team</span>
                      <h3 className="font-serif text-2xl font-bold text-slate-900">Career Application</h3>
                      <p className="text-xs text-slate-500">Apply for high-growth real estate consultancy positions at Jayshree Realty.</p>
                    </div>

                    {formError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                        {formError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={careerData.name}
                        onChange={(e) => setCareerData({ ...careerData, name: e.target.value })}
                        placeholder="e.g. Ramesh Deshmukh"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={careerData.phone}
                          onChange={(e) => setCareerData({ ...careerData, phone: e.target.value })}
                          placeholder="+91 98200 00000"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={careerData.email}
                          onChange={(e) => setCareerData({ ...careerData, email: e.target.value })}
                          placeholder="candidate@email.com"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Position Applied For</label>
                        <select
                          value={careerData.position}
                          onChange={(e) => setCareerData({ ...careerData, position: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm font-medium"
                        >
                          <option value="Real Estate Sales Executive">Real Estate Sales Executive</option>
                          <option value="Pre Sales & Telecaller">Pre Sales & Telecaller</option>
                          <option value="Property Acquisition Executive">Property Acquisition Executive</option>
                          <option value="Marketing Manager">Marketing Manager</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Years of Experience</label>
                        <select
                          value={careerData.experience}
                          onChange={(e) => setCareerData({ ...careerData, experience: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm font-medium"
                        >
                          <option value="Fresher">Fresher (0 Years)</option>
                          <option value="1-3 Years">1 - 3 Years</option>
                          <option value="3-5 Years">3 - 5 Years</option>
                          <option value="5+ Years">5+ Years</option>
                        </select>
                      </div>
                    </div>

                    <ResumeUploader
                      currentFileUrl={careerData.resumeUrl}
                      currentFileName={careerData.resumeFilename}
                      onUploadSuccess={(fileUrl, fileName, metadata) => {
                        setCareerData(prev => ({
                          ...prev,
                          resumeUrl: fileUrl,
                          resumeFilename: fileName || '',
                          resumeMimeType: metadata?.mimetype || '',
                          resumeSize: metadata?.size || 0
                        }));
                      }}
                      onClear={() => {
                        setCareerData(prev => ({
                          ...prev,
                          resumeUrl: '',
                          resumeFilename: '',
                          resumeMimeType: '',
                          resumeSize: 0
                        }));
                      }}
                    />

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Cover Letter / Experience Summary</label>
                      <textarea
                        rows={3}
                        value={careerData.message}
                        onChange={(e) => setCareerData({ ...careerData, message: e.target.value })}
                        placeholder="Briefly describe your real estate sales background..."
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl p-3 text-xs text-slate-900 focus:outline-none shadow-sm"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-gold w-full py-3.5 text-sm font-bold shadow-xl uppercase disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'SUBMITTING APPLICATION...' : 'SUBMIT CAREER APPLICATION'}
                      <UserCheck className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

          {/* 3. GOOGLE MAPS LOCATION & DIRECTIONS SECTION */}
          <div className="mt-16 sm:mt-24 max-w-6xl mx-auto space-y-8 font-outfit">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3 reveal">
              <span className="badge-gold inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#c5a059]" /> Google Verified Location
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900">
                Visit Our Office at <span className="text-gradient-gold">Nerul Station Complex</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Directly connected to Nerul Railway Station (Platform 1) above Union Bank of India. Easily accessible from Palm Beach Road, Sion-Panvel Highway, and across Navi Mumbai &amp; Mumbai.
              </p>
            </div>

            {/* Quick Landmark & Accessibility Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal">
              <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-md flex items-start gap-3.5 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-0.5">Exact Landmark</h4>
                  <p className="text-xs text-slate-600 leading-snug font-medium">G-102, 1st Floor, Above Union Bank of India</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-md flex items-start gap-3.5 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center shrink-0">
                  <Train className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-0.5">Train Transit</h4>
                  <p className="text-xs text-slate-600 leading-snug font-medium">1 Min walk from Nerul Station Platform 1</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-md flex items-start gap-3.5 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-0.5">Road Access</h4>
                  <p className="text-xs text-slate-600 leading-snug font-medium">2 Mins from Sion-Panvel Highway &amp; Palm Beach</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-md flex items-start gap-3.5 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-0.5">Office Timings</h4>
                  <p className="text-xs text-slate-600 leading-snug font-medium">Tue - Sun: 10:30 AM to 7:00 PM</p>
                </div>
              </div>
            </div>

            {/* Master Google Map Frame Card */}
            <div className="bg-white p-4 sm:p-7 rounded-3xl border border-amber-200/90 shadow-2xl space-y-5 reveal">
              {/* Map Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                      Jayshree Realty Head Office
                    </h3>
                    <p className="text-xs text-slate-500">Live Google Business Profile Location • Navi Mumbai, Maharashtra</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Jayshree+Realty+Nerul+Navi+Mumbai&destination_place_id=ChIJf847KT_DrzsRj4DjasSStSw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold px-4 py-2 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-md hover:scale-[1.02] transition-transform"
                    title="Get Turn-by-Turn Driving Directions on Google Maps"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Get Directions
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>
                </div>
              </div>

              {/* Responsive Map Embed Container */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-amber-100 shadow-inner bg-slate-100 h-[380px] sm:h-[460px] lg:h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.6923275637237!2d73.01790729999999!3d19.0332746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c33f293bce7f%3A0x2cb592c46be3808f!2sJayshree%20Realty!5e0!3m2!1sen!2sin!4v1793195818224!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Jayshree Realty Head Office Location - Nerul Railway Station Complex"
                  className="w-full h-full"
                />
              </div>

              {/* Map Footer Information */}
              <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-600">
                <div className="flex items-start gap-2 max-w-2xl">
                  <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900 font-semibold">Office Address: </strong>
                    {siteSettings.address || 'G-102, First Floor, Nerul Railway Station Complex, above Union Bank of India, Nerul, Navi Mumbai 400706'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href={`tel:${siteSettings.phoneRaw || '+918169005579'}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                    Call: {siteSettings.phone || '+91 81690 05579'}
                  </a>
                  <a
                    href={`https://wa.me/${siteSettings.whatsappRaw || '918169005579'}?text=Hello%20Jayshree%20Realty,%20I%20am%20visiting%20your%20office%20and%20need%20directions.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25d366]/15 hover:bg-[#25d366]/25 text-[#128c7e] font-bold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25d366]" />
                    WhatsApp Directions
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
