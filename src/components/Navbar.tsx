import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ChevronDown, Building2, Home as HomeIcon, MapPin } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import logo from '../assets/jayshree-realty-logo.png';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { openModal } = useLeads();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[950] transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070b19]/95 backdrop-blur-md border-b border-[#c5a059]/30 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-[#070b19]/90 via-[#070b19]/60 to-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo Area */}
        <Link to="/" className="flex items-center gap-3.5 shrink-0 group py-1">
          <img
            src={logo}
            alt="Jayshree Realty"
            className="h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-gradient-gold uppercase leading-none">
              Jayshree Realty
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Single Line Guarantee */}
        <nav className="hidden xl:flex items-center gap-7 text-[13px] font-outfit font-medium whitespace-nowrap">
          <Link
            to="/"
            className={`transition-colors hover:text-[#e5c178] py-1 ${
              isActive('/') ? 'text-[#e5c178] font-bold border-b-2 border-[#c5a059]' : 'text-slate-200'
            }`}
          >
            Home
          </Link>
          
          <Link
            to="/about"
            className={`transition-colors hover:text-[#e5c178] py-1 ${
              isActive('/about') ? 'text-[#e5c178] font-bold border-b-2 border-[#c5a059]' : 'text-slate-200'
            }`}
          >
            About Us
          </Link>

          <Link
            to="/buy"
            className={`transition-colors hover:text-[#e5c178] py-1 ${
              isActive('/buy') ? 'text-[#e5c178] font-bold border-b-2 border-[#c5a059]' : 'text-slate-200'
            }`}
          >
            Buy Property
          </Link>

          <Link
            to="/sell"
            className={`transition-colors hover:text-[#e5c178] py-1 ${
              isActive('/sell') ? 'text-[#e5c178] font-bold border-b-2 border-[#c5a059]' : 'text-slate-200'
            }`}
          >
            Sell Property
          </Link>

          {/* Submenu Dropdown for Properties */}
          <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <button className="flex items-center gap-1.5 text-slate-200 hover:text-[#e5c178] py-1 transition-colors">
              Properties & Projects <ChevronDown className="w-3.5 h-3.5 text-[#c5a059]" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-[#0d1527] border border-[#c5a059]/30 rounded-xl shadow-2xl py-2 px-1 backdrop-blur-xl animate-fade-in">
                <Link
                  to="/projects"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-[#1c2541] hover:text-[#e5c178] text-xs font-medium"
                >
                  <Building2 className="w-4 h-4 text-[#c5a059]" />
                  Featured Projects (8 Nodes)
                </Link>
                <Link
                  to="/listings"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-[#1c2541] hover:text-[#e5c178] text-xs font-medium"
                >
                  <HomeIcon className="w-4 h-4 text-[#c5a059]" />
                  Property Listings (1 & 2 BHK, Resale)
                </Link>
                <Link
                  to="/commercial"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-[#1c2541] hover:text-[#e5c178] text-xs font-medium"
                >
                  <Building2 className="w-4 h-4 text-[#c5a059]" />
                  Commercial Properties
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/contact"
            className={`transition-colors hover:text-[#e5c178] py-1 ${
              isActive('/contact') ? 'text-[#e5c178] font-bold border-b-2 border-[#c5a059]' : 'text-slate-200'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Action CTAs - Reduced Width Compact Buttons */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <a
            href="tel:+918169005579"
            className="btn-phone text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-md font-semibold tracking-wide"
          >
            <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
            +91 81690 05579
          </a>
          <button
            onClick={() => openModal('Navbar Enquire CTA')}
            className="btn-gold text-xs px-3.5 py-1.5 rounded-md font-bold tracking-wide"
          >
            Enquire Now
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden text-slate-200 hover:text-[#c5a059] p-2 focus:outline-none shrink-0"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#c5a059]" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile & Tablet Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070b19] border-b border-[#c5a059]/30 px-6 py-6 space-y-4 animate-fade-in max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-3 font-outfit text-sm">
            <Link to="/" className="text-slate-200 hover:text-[#e5c178] py-1 border-b border-slate-800">
              Home
            </Link>
            <Link to="/about" className="text-slate-200 hover:text-[#e5c178] py-1 border-b border-slate-800">
              About Us
            </Link>
            <Link to="/buy" className="text-slate-200 hover:text-[#e5c178] py-1 border-b border-slate-800">
              Buy Property
            </Link>
            <Link to="/sell" className="text-slate-200 hover:text-[#e5c178] py-1 border-b border-slate-800">
              Sell Property
            </Link>
            <Link to="/projects" className="text-slate-200 hover:text-[#e5c178] py-1 border-b border-slate-800">
              Featured Projects
            </Link>
            <Link to="/listings" className="text-slate-200 hover:text-[#e5c178] py-1 border-b border-slate-800">
              Property Listings
            </Link>
            <Link to="/commercial" className="text-slate-200 hover:text-[#e5c178] py-1 border-b border-slate-800">
              Commercial Properties
            </Link>
            <Link to="/contact" className="text-slate-200 hover:text-[#e5c178] py-1 border-b border-slate-800">
              Contact Us
            </Link>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="tel:+918169005579"
              className="btn-phone w-full text-center py-2 text-xs font-bold"
            >
              Call +91 81690 05579
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openModal('Mobile Drawer Enquire');
              }}
              className="btn-gold w-full text-center py-2 text-xs font-bold"
            >
              Enquire Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
