import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useLeads } from '../context/LeadContext';
import { CheckCircle2, Phone, ShieldCheck } from 'lucide-react';

export const SellProperty: React.FC = () => {
  const { addLead } = useLeads();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: 'Nerul East',
    propertyType: '2 BHK',
    expectedPrice: '',
    carpetArea: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    addLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      requirement: 'Sell',
      budget: formData.expectedPrice ? `Expected ₹ ${formData.expectedPrice}` : 'Market Price Evaluation',
      preferredArea: formData.location,
      propertyType: formData.propertyType,
      message: `Carpet Area: ${formData.carpetArea || 'N/A'}. Details: ${formData.message}`,
      lead_source: 'Sell Property Evaluation Form',
      cta_source: 'Sell Page Direct Form',
      page_name: 'Sell Property'
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen font-sans">
      <SEOHead
        title="Sell Property in Nerul & Navi Mumbai | Free Evaluation"
        description="Sell your 1, 2, 3 BHK property at top market valuation with Jayshree Realty. Access to 5000+ verified buyers in Navi Mumbai."
      />

      {/* 1. HEADER (Dark Navy Background) */}
      <section className="pt-32 pb-20 section-navy border-b border-[#c5a059]/20">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-3">
          <span className="badge-gold">Seller Consultation</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Sell Your Property at <span className="text-gradient-gold">Best Valuation</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-outfit">
            Connect with genuine pre-approved buyers across Nerul, Seawoods, Juinagar, Kharghar & Ulwe with zero upfront marketing costs.
          </p>
        </div>
      </section>

      {/* 2. FORM & BENEFITS (Warm Beige Background) */}
      <section className="py-20 section-warm-beige">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
            
            {/* Left Info & Benefits */}
            <div className="lg:col-span-5 space-y-6 font-outfit text-slate-700">
              <div className="bg-white p-7 rounded-3xl border border-amber-200/80 shadow-xl">
                <span className="badge-gold-dark mb-3">Why Jayshree Realty</span>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">Why List Your Property With Us?</h3>
                <ul className="space-y-4 text-xs sm:text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#99732b] shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Active Database of 5000+ Buyers:</strong> Match your property with qualified buyers looking in Nerul & Seawoods.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#99732b] shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Free Professional Pricing Audit:</strong> Get realistic market price evaluation based on recent CIDCO resale registrations.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#99732b] shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Zero Upfront Marketing Charges:</strong> We handle high-resolution photos, online listing, and targeted promotion.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#99732b] shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Smooth Paperwork Support:</strong> Complete advocate assistance for agreement drafting & CIDCO transfer.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b132b] text-white text-xs">
                <span className="text-[#e5c178] font-bold block mb-1">Direct Seller Helpline</span>
                <p className="text-slate-300">Call our senior seller relation lead directly:</p>
                <a href="tel:+918169005579" className="text-lg font-bold text-white hover:text-[#c5a059] block pt-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#c5a059]" /> +91 81690 05579
                </a>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-amber-200/80 shadow-2xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-fade-in font-outfit">
                  <div className="w-16 h-16 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center mx-auto border border-[#10b981]/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">Evaluation Request Received!</h3>
                  <p className="text-sm text-slate-600 font-medium">
                    Thank you! Our property valuation officer will contact you shortly to inspect your property in <strong>{formData.location}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-outfit">
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">Request Free Property Valuation</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Owner Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Patil"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                      />
                    </div>

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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Property Location</label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                      >
                        <option value="Nerul East">Nerul East</option>
                        <option value="Nerul West">Nerul West</option>
                        <option value="Seawoods East">Seawoods East</option>
                        <option value="Seawoods West">Seawoods West</option>
                        <option value="Juinagar">Juinagar</option>
                        <option value="Sanpada">Sanpada</option>
                        <option value="Kharghar">Kharghar</option>
                        <option value="Ulwe">Ulwe</option>
                        <option value="Pushpak Nagar">Pushpak Nagar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Configuration</label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                      >
                        <option value="1 BHK">1 BHK</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3/4 BHK">3/4 BHK</option>
                        <option value="Row House">Row House</option>
                        <option value="Commercial Shop/Office">Commercial</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Expected Price (Optional)</label>
                      <input
                        type="text"
                        value={formData.expectedPrice}
                        onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                        placeholder="e.g. 75 Lakhs"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Carpet Area Sq.Ft. (Optional)</label>
                      <input
                        type="text"
                        value={formData.carpetArea}
                        onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
                        placeholder="e.g. 580 Sq.Ft."
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Additional Details</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Sector 15, CIDCO title clear, OC received, balcony view."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#c5a059] rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-gold w-full py-3.5 text-sm font-bold shadow-xl uppercase">
                    SUBMIT FOR FREE VALUATION
                  </button>

                  <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#99732b]" /> Your details are 100% confidential. No public listing without approval.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
