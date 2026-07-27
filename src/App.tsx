import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

// Public Layout Wrapper: Ensures Navbar, Footer, LeadModal, FloatingCTA are present ONLY on public pages
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#070b19] text-slate-100 font-sans selection:bg-[#c5a059] selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <LeadModal />
      <FloatingCTA />
    </div>
  );
};

export function App() {
  return (
    <DataProvider>
      <LeadProvider>
        <Router>
          <Routes>
            {/* Private Isolated Admin Route - Completely detached from public layout */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Public Website Routes with Header/Footer/Floating CTA */}
            <Route element={<PublicLayout />}>
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
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </LeadProvider>
    </DataProvider>
  );
}

export default App;
