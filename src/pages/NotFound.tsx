import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { Home, Search, Phone, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070b19] flex items-center justify-center px-4 py-24 text-center font-outfit">
      <SEOHead
        title="404 Page Not Found | Jayshree Realty"
        description="The page you are looking for could not be found. Return to Jayshree Realty homepage."
      />

      <div className="bg-glass p-8 sm:p-12 rounded-3xl border border-[#c5a059]/30 max-w-lg w-full space-y-6 shadow-2xl">
        <div className="font-serif text-7xl font-extrabold text-gradient-gold">404</div>
        
        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-white">Page Not Found</h1>
          <p className="text-xs text-slate-400">
            The property page or resource you requested might have been moved or is currently unavailable.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link to="/" className="btn-gold w-full py-3 text-xs font-bold">
            <Home className="w-4 h-4 mr-1" /> RETURN TO HOMEPAGE
          </Link>

          <Link to="/buy" className="btn-outline-gold w-full py-3 text-xs font-semibold">
            <Search className="w-4 h-4 mr-1" /> BROWSE PROPERTY LISTINGS
          </Link>
        </div>
      </div>
    </div>
  );
};
