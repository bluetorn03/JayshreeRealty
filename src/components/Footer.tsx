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
                className="h-14 w-auto object-contain mb-2"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-outfit">
              Jayshree Realty is Navi Mumbai’s premier luxury real estate consultancy. We specialize in newly launched townships, CIDCO plot projects, and direct resale properties across Nerul, Seawoods, Kharghar, Ulwe & Pushpak Nagar.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="badge-gold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059]" /> 100% Verified Deals
              </span>
              <span className="badge-emerald">0% Brokerage Options</span>
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
