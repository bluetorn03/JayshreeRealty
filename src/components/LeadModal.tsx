import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Phone, Mail, User, Building, MapPin, Sparkles } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { useData } from '../context/DataContext';
import { useLocation } from 'react-router-dom';
import logo from '../assets/jayshree-realty-logo.png';

export const LeadModal: React.FC = () => {
  const { isModalOpen, closeModal, addLead, modalCtaSource, modalRequirement } = useLeads();
  const { popupSettings } = useData();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    requirement: 'Buy',
    budget: '₹ 40 Lakhs - ₹ 70 Lakhs',
    preferredArea: 'Nerul & Seawoods',
    propertyType: '2 BHK',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (modalRequirement) {
      setFormData((prev) => ({ ...prev, propertyType: modalRequirement }));
    }
  }, [modalRequirement]);

  if (!isModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    addLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      requirement: formData.requirement,
      budget: formData.budget,
      preferredArea: formData.preferredArea,
      propertyType: formData.propertyType,
      message: formData.message,
      lead_source: 'Interactive Lead Popup',
      cta_source: modalCtaSource || 'Website CTA',
      page_name: location.pathname || 'Home'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeModal();
      setFormData({
        name: '',
        phone: '',
        email: '',
        requirement: 'Buy',
        budget: '₹ 40 Lakhs - ₹ 70 Lakhs',
        preferredArea: 'Nerul & Seawoods',
        propertyType: '2 BHK',
        message: ''
      });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[92vh] border border-amber-200/50">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:text-white hover:bg-[#c5a059] flex items-center justify-center transition-all duration-300 shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side Banner (Dark Luxury Branding & Image) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-b from-[#0b132b] via-[#070b19] to-[#1c2541] p-8 flex-col justify-between relative overflow-hidden text-white border-r border-[#c5a059]/20">
          {/* Background Decorative Image & Vignette */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{ backgroundImage: `url('${popupSettings.leftImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000'}')` }}
          ></div>

          <div className="relative z-10 space-y-6">
            <div className="inline-block">
              <img
                src={logo}
                alt="Jayshree Realty"
                className="h-12 w-auto object-contain mb-2"
              />
              <div className="font-serif text-lg font-bold text-gradient-gold tracking-wider uppercase">
                Jayshree Realty
              </div>
            </div>

            <div>
              <span className="badge-gold mb-3 text-[10px] shadow-sm">
                <Sparkles className="w-3 h-3" /> {popupSettings.badge || 'Exclusive Launch Pricing'}
              </span>
              <h3 className="font-serif text-2xl font-bold text-white leading-tight mb-3">
                Luxury 1, 2 & 3 BHK Homes in Navi Mumbai
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-outfit">
                Register now for priority site visits, direct developer discounts, and verified inventory across Nerul, Seawoods, Kharghar, Ulwe & Pushpak Nagar.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-3 pt-6 border-t border-slate-800/80 text-xs text-slate-300 font-outfit">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#25d366] shrink-0" />
              <span>0% Brokerage on Selected New Launches</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#25d366] shrink-0" />
              <span>Direct Bank Loan & CIDCO Paperwork Support</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#25d366] shrink-0" />
              <span>Free Pickup & Drop Site Visit Transport</span>
            </div>
          </div>
        </div>

        {/* Right Side Form (Light Beige / White Background) */}
        <div className="col-span-12 md:col-span-7 bg-[#faf8f5] p-6 sm:p-9 overflow-y-auto flex flex-col justify-center">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center border border-[#10b981]/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl text-slate-900 font-bold">Inquiry Received!</h3>
              <p className="text-sm text-slate-600 font-outfit max-w-sm">
                Thank you for contacting <strong className="text-[#99732b]">Jayshree Realty</strong>. Our senior real estate advisor will call you shortly.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-1">
                  {popupSettings.title || 'Get Best Offer'}
                </h3>
                <p className="text-xs text-slate-500 font-outfit font-medium">
                  {popupSettings.subtitle || 'Register now for exclusive launch pricing & verified floor plans.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 font-outfit">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full bg-white border border-slate-200 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98200 00000"
                      className="w-full bg-white border border-slate-200 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@email.com"
                        className="w-full bg-white border border-slate-200 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Select Configuration
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full bg-white border border-slate-200 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none transition-colors shadow-sm"
                    >
                      <option value="1 BHK">1 BHK Apartment</option>
                      <option value="2 BHK">2 BHK Luxury Apartment</option>
                      <option value="3/4 BHK">3/4 BHK Grand Residence</option>
                      <option value="Row House">Row House / Villa</option>
                      <option value="Commercial">Commercial Shop / Office</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Location / Budget
                  </label>
                  <select
                    value={formData.preferredArea}
                    onChange={(e) => setFormData({ ...formData, preferredArea: e.target.value })}
                    className="w-full bg-white border border-slate-200 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none transition-colors shadow-sm"
                  >
                    <option value="Nerul & Seawoods">Nerul & Seawoods</option>
                    <option value="Kharghar">Kharghar & Upper Kharghar</option>
                    <option value="Ulwe">Ulwe Coastal Belt</option>
                    <option value="Pushpak Nagar">Pushpak Nagar (Airport Node)</option>
                    <option value="Juinagar & Sanpada">Juinagar & Sanpada</option>
                    <option value="Panvel">Panvel Smart City</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-gold w-full py-3.5 text-sm font-bold shadow-xl tracking-wider uppercase"
                >
                  GET BEST OFFER NOW
                </button>

                <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#99732b]" /> {popupSettings.privacyText || 'We respect your privacy. No spam, ever.'}
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
