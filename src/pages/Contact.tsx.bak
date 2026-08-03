import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useLeads } from '../context/LeadContext';
import {
  MapPin, Phone, MessageSquare, Clock, CheckCircle2, Send,
  Mail, Briefcase, UserCheck, Instagram, Facebook, Youtube
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { addLead } = useLeads();
  const [activeFormTab, setActiveFormTab] = useState<'contact' | 'career'>('contact');
  const [submitted, setSubmitted] = useState(false);

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
    message: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.phone) return;

    addLead({
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

    setSubmitted(true);
  };

  const handleCareerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerData.name || !careerData.phone) return;

    addLead({
      name: careerData.name,
      phone: careerData.phone,
      email: careerData.email,
      requirement: `Career: ${careerData.position}`,
      budget: `Experience: ${careerData.experience}`,
      preferredArea: 'Head Office Nerul',
      propertyType: 'Career Application',
      message: `Resume Link/Details: ${careerData.resumeUrl || 'N/A'}. Cover Letter: ${careerData.message}`,
      lead_source: 'Career Form Application',
      cta_source: 'Contact Page Career Switcher',
      page_name: 'Contact Us / Careers'
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen font-sans bg-[#070b19]">
      <SEOHead
        title="Contact Us & Careers | Jayshree Realty Nerul Railway Station"
        description="Visit Jayshree Realty at G-102, 1st Floor, Nerul Railway Station Complex. Connect via call, email info@jayshreerealty.com or apply for real estate careers."
      />

      {/* 1. HEADER */}
      <section className="relative pt-32 pb-20 border-b border-[#c5a059]/20 overflow-hidden bg-[#070b19]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b19]/90 via-[#070b19]/75 to-[#070b19]" />
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">

            {/* Left Contact Info & Official Social Links */}
            <div className="lg:col-span-5 space-y-6 font-outfit">
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
                        G-102, First Floor, Nerul Railway Station Complex, above Union Bank of India, Nerul, Navi Mumbai 400706
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Direct Call</h4>
                      <a href="tel:+918169005579" className="text-sm font-bold text-[#99732b] hover:underline">
                        +91 81690 05579
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Official Email</h4>
                      <a href="mailto:info@jayshreerealty.com" className="text-xs font-bold text-[#99732b] hover:underline">
                        info@jayshreerealty.com
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
                        href="https://wa.me/918169005579?text=Hello,%20I%20want%20property%20information%20from%20Jayshree%20Realty."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#25d366] font-bold hover:underline"
                      >
                        +91 81690 05579 (Instant Reply)
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
                      href="https://www.instagram.com/jayshreerealty_navimumbai?igsh=aHlhNW1jdnRybGJs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href="https://www.facebook.com/share/14k1PnjThjZ/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                      title="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a
                      href="https://youtube.com/@jayshree_realty_navi_mumbai?si=TfK4HesvkWiswOEz"
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
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-amber-200/80 shadow-2xl flex flex-col justify-between">
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

                    <button type="submit" className="btn-gold w-full py-3.5 text-sm font-bold shadow-xl uppercase">
                      SEND INQUIRY NOW <Send className="w-4 h-4 ml-1" />
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
                          <option value="Senior Property Advisor">Senior Property Advisor</option>
                          <option value="CIDCO Legal & Documentation Expert">CIDCO Legal & Documentation Expert</option>
                          <option value="Telecaller & Client Relationship">Telecaller & Client Relationship</option>
                          <option value="Digital Marketing Specialist">Digital Marketing Specialist</option>
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

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Resume Link / Google Drive URL</label>
                      <input
                        type="url"
                        value={careerData.resumeUrl}
                        onChange={(e) => setCareerData({ ...careerData, resumeUrl: e.target.value })}
                        placeholder="https://drive.google.com/your-resume-link"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                      />
                    </div>

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

                    <button type="submit" className="btn-gold w-full py-3.5 text-sm font-bold shadow-xl uppercase">
                      SUBMIT CAREER APPLICATION <UserCheck className="w-4 h-4 ml-1" />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
