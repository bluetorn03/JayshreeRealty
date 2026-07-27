import React from 'react';
import { SEOHead } from '../components/SEOHead';

export const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen font-sans">
      <SEOHead
        title="Terms & Conditions | Jayshree Realty"
        description="Terms and conditions for using Jayshree Realty website and real estate consultancy services."
      />

      <section className="pt-32 pb-16 section-navy border-b border-[#c5a059]/20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="badge-gold mb-2">Legal Disclaimer</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">Terms & Conditions</h1>
          <p className="text-xs text-slate-400 font-outfit mt-2">Effective Date: July 2026</p>
        </div>
      </section>

      <section className="py-20 section-white min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-4xl font-outfit text-slate-700 space-y-8">
          <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md space-y-6 text-sm">
            <section className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-slate-900">1. Real Estate Consultancy Scope</h2>
              <p className="leading-relaxed text-slate-600">
                <strong>Jayshree Realty</strong> acts as an authorized real estate consultancy and channel partner facilitating property buying, selling, and leasing across Navi Mumbai nodes (Nerul, Seawoods, Kharghar, Ulwe, Pushpak Nagar & Panvel).
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-slate-200/60">
              <h2 className="font-serif text-xl font-bold text-slate-900">2. Property Prices & Availability</h2>
              <p className="leading-relaxed text-slate-600">
                Property prices, carpet areas, floor plans, and availability listed on this site are indicative and subject to change per developer revisions and CIDCO approvals. Final terms are confirmed during physical site visits and agreement execution.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-slate-200/60">
              <h2 className="font-serif text-xl font-bold text-slate-900">3. Zero Brokerage Policy</h2>
              <p className="leading-relaxed text-slate-600">
                The 0% brokerage policy applies specifically to direct developer launch projects as indicated. Resale property transactions may involve standard consultancy service terms as agreed prior to transaction closure.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-slate-200/60">
              <h2 className="font-serif text-xl font-bold text-slate-900">4. Head Office Contact</h2>
              <p className="leading-relaxed text-slate-600">
                <strong className="text-slate-900">Jayshree Realty</strong> <br />
                G-102, First Floor, Nerul Railway Station Complex, above Union Bank of India, Nerul, Navi Mumbai 400706 <br />
                Phone: +91 81690 05579
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};
