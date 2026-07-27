import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { LeadProvider } from './context/LeadContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LeadModal } from './components/LeadModal';
import { FloatingCTA } from './components/FloatingCTA';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { BuyProperty } from './pages/BuyProperty';
import { SellProperty } from './pages/SellProperty';
import { CommercialProperties } from './pages/CommercialProperties';
import { FeaturedProjects } from './pages/FeaturedProjects';
import { PropertyListings } from './pages/PropertyListings';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { NotFound } from './pages/NotFound';
import { AdminDashboard } from './pages/AdminDashboard';

export function App() {
  return (
    <DataProvider>
      <LeadProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[#070b19] text-slate-100 font-sans selection:bg-[#c5a059] selection:text-white">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/buy" element={<BuyProperty />} />
                <Route path="/sell" element={<SellProperty />} />
                <Route path="/commercial" element={<CommercialProperties />} />
                <Route path="/projects" element={<FeaturedProjects />} />
                <Route path="/listings" element={<PropertyListings />} />
                <Route path="/reviews" element={<Navigate to="/" replace />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsConditions />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
            <LeadModal />
            <FloatingCTA />
          </div>
        </Router>
      </LeadProvider>
    </DataProvider>
  );
}

export default App;
