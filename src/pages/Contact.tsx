import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useLeads } from '../context/LeadContext';
import { MapPin, Phone, MessageSquare, Clock, CheckCircle2, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const { addLead } = useLeads();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    requirement: 'Buy',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    addLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      requirement: formData.requirement,
      budget: 'General Inquiry',
      preferredArea: 'Nerul Head Office',
      propertyType: 'All',
      message: formData.message,
      lead_source: 'Contact Us Form',
      cta_source: 'Contact Page Direct Form',
      page_name: 'Contact Us'
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen font-sans">
      <SEOHead
        title="Contact Us | Jayshree Realty Nerul Railway Station"
        description="Visit Jayshree Realty at G-102, 1st Floor, Nerul Railway Station Complex, above Union Bank of India. Phone +91 81690 05579."
      />

      {/* 1. HEADER (Dark Navy Background) */}
      <section className="pt-32 pb-20 section-navy border-b border-[#c5a059]/20">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-3">
          <span className="badge-gold">Head Office</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Contact <span className="text-gradient-gold">Jayshree Realty</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-outfit">
            Visit our office at Nerul Railway Station Complex or reach out directly via call or WhatsApp.
          </p>
        </div>
      </section>

      {/* 2. CONTACT DETAILS & FORM (Warm Beige Background) */}
      <section className="py-20 section-warm-beige">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            
            {/* Left Contact Info */}
            <div className="lg:col-span-5 space-y-6 font-outfit">
              <div className="bg-white p-8 rounded-3xl border border-amber-200/80 shadow-xl space-y-6">
                <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Official Details</h3>

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
                      <p className="text-xs text-slate-600 font-medium">Monday - Sunday: 9:30 AM - 8:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-amber-200/80 shadow-2xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-fade-in font-outfit">
                  <div className="w-16 h-16 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center mx-auto border border-[#10b981]/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">Message Sent Successfully!</h3>
                  <p className="text-sm text-slate-600 font-medium">
                    Thank you for reaching out to <strong>Jayshree Realty</strong>. We will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-outfit">
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">Send Us a Direct Message</h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98200 00000"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@email.com"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nature of Inquiry</label>
                    <select
                      value={formData.requirement}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
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
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we assist you?"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-gold w-full py-3.5 text-sm font-bold shadow-xl uppercase">
                    SEND INQUIRY NOW <Send className="w-4 h-4 ml-1" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
