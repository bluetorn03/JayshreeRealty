import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, CheckCircle2, ChevronRight } from 'lucide-react';
import logo from '../assets/jayshree-realty-logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050814] text-slate-300 border-t border-[#c5a059]/20 pt-16 pb-12 relative overflow-hidden">
      {/* Decorative Gold Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="Jayshree Realty"
                className="h-16 w-auto object-contain mb-2"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-outfit">
              Jayshree Realty is Navi Mumbai’s premier luxury real estate consultancy. We specialize in newly launched townships, CIDCO plot projects, and direct resale properties across Nerul, Seawoods, Kharghar, Ulwe & Pushpak Nagar.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="badge-gold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059]" /> 100% Verified Deals
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-base text-[#e5c178] uppercase tracking-wider font-semibold border-b border-[#c5a059]/20 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm font-outfit text-slate-400">
              <li>
                <Link to="/" className="hover:text-[#e5c178] flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#c5a059]" /> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#e5c178] flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#c5a059]" /> About Jayshree Realty
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-[#e5c178] flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#c5a059]" /> Client Reviews & Testimonials
                </Link>
              </li>
              <li>
                <Link to="/buy" className="hover:text-[#e5c178] flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#c5a059]" /> Buy Property
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-[#e5c178] flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#c5a059]" /> Sell Your Property
                </Link>
              </li>
              <li>
                <Link to="/commercial" className="hover:text-[#e5c178] flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#c5a059]" /> Commercial Spaces
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[#e5c178] flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#c5a059]" /> Featured Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Areas We Serve */}
          <div className="space-y-4">
            <h4 className="font-serif text-base text-[#e5c178] uppercase tracking-wider font-semibold border-b border-[#c5a059]/20 pb-2">
              Navi Mumbai Nodes
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-outfit text-slate-400">
              <Link to="/projects?area=Nerul" className="hover:text-[#e5c178] transition-colors py-1">
                • Nerul East & West
              </Link>
              <Link to="/projects?area=Seawoods" className="hover:text-[#e5c178] transition-colors py-1">
                • Seawoods Grand
              </Link>
              <Link to="/projects?area=Kharghar" className="hover:text-[#e5c178] transition-colors py-1">
                • Kharghar Central
              </Link>
              <Link to="/projects?area=Upper+Kharghar" className="hover:text-[#e5c178] transition-colors py-1">
                • Upper Kharghar
              </Link>
              <Link to="/projects?area=Ulwe" className="hover:text-[#e5c178] transition-colors py-1">
                • Ulwe Coastal Belt
              </Link>
              <Link to="/projects?area=Pushpak+Nagar" className="hover:text-[#e5c178] transition-colors py-1">
                • Pushpak Nagar (Airport)
              </Link>
              <Link to="/projects?area=Juinagar" className="hover:text-[#e5c178] transition-colors py-1">
                • Juinagar & Sanpada
              </Link>
              <Link to="/projects?area=Panvel" className="hover:text-[#e5c178] transition-colors py-1">
                • Panvel & Expressway
              </Link>
            </div>
          </div>

          {/* Col 4: Address & Direct Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-base text-[#e5c178] uppercase tracking-wider font-semibold border-b border-[#c5a059]/20 pb-2">
              Official Head Office
            </h4>
            <div className="space-y-3 text-xs font-outfit text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                <span>
                  G-102, First Floor, Nerul Railway Station Complex, above Union Bank of India, Nerul, Navi Mumbai 400706
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#c5a059] shrink-0" />
                <a href="tel:+918169005579" className="hover:text-[#e5c178]">
                  +91 81690 05579
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#c5a059] shrink-0" />
                <a href="mailto:info@jayshreerealty.com" className="hover:text-[#e5c178]">
                  info@jayshreerealty.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#25d366] shrink-0" />
                <a
                  href="https://wa.me/918169005579?text=Hello,%20I%20want%20property%20information%20from%20Jayshree%20Realty."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25d366]"
                >
                  WhatsApp: +91 81690 05579
                </a>
              </div>

              {/* Social Icons Bar */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://www.instagram.com/jayshreerealty_navimumbai?igsh=aHlhNW1jdnRybGJs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#c5a059] hover:text-[#070b19] flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a
                  href="https://www.facebook.com/share/14k1PnjThjZ/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#c5a059] hover:text-[#070b19] flex items-center justify-center transition-colors"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
                </a>
                <a
                  href="https://youtube.com/@jayshree_realty_navi_mumbai?si=TfK4HesvkWiswOEz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#c5a059] hover:text-[#070b19] flex items-center justify-center transition-colors"
                  title="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-outfit">
          <p>© {new Date().getFullYear()} Jayshree Realty. All Rights Reserved. Luxury Real Estate Consultant in Navi Mumbai.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              Sitemap & Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
