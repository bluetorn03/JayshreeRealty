import React from 'react';
import { SEOHead } from '../components/SEOHead';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen font-sans">
      <SEOHead
        title="Privacy Policy | Jayshree Realty"
        description="Privacy policy for Jayshree Realty real estate consultancy in Nerul Navi Mumbai."
      />

      <section className="pt-32 pb-16 section-navy border-b border-[#c5a059]/20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="badge-gold mb-2">Legal Compliance</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400 font-outfit mt-2">Effective Date: July 2026</p>
        </div>
      </section>

      <section className="py-20 section-white min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-4xl font-outfit text-slate-700 space-y-8">
          <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md space-y-6 text-sm">
            <section className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-slate-900">1. Information Collection</h2>
              <p className="leading-relaxed text-slate-600">
                At <strong>Jayshree Realty</strong>, we respect your personal privacy. We collect personal information such as your name, phone number, email address, property preferences, and budget strictly when you submit an inquiry form or request property details on our website.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-slate-200/60">
              <h2 className="font-serif text-xl font-bold text-slate-900">2. Use of Information</h2>
              <p className="leading-relaxed text-slate-600">
                The information you provide is used solely to contact you regarding property inquiries, schedule site visits, provide project floor plans, and assist with real estate buying or selling transactions in Navi Mumbai. We do NOT sell or share your information with third-party telemarketers.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-slate-200/60">
              <h2 className="font-serif text-xl font-bold text-slate-900">3. Data Protection & Security</h2>
              <p className="leading-relaxed text-slate-600">
                We implement strict security measures to maintain the safety of your personal information. All lead submissions are stored securely.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-slate-200/60">
              <h2 className="font-serif text-xl font-bold text-slate-900">4. Contacting Us</h2>
              <p className="leading-relaxed text-slate-600">
                If you have questions regarding this privacy policy, you may contact us at: <br />
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
