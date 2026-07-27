import React, { createContext, useContext, useState, useEffect } from 'react';
import { LeadSubmission } from '../types';

interface LeadContextType {
  leads: LeadSubmission[];
  addLead: (leadData: Omit<LeadSubmission, 'id' | 'timestamp' | 'status'>) => void;
  updateLeadStatus: (id: string, status: LeadSubmission['status']) => void;
  deleteLead: (id: string) => void;
  isModalOpen: boolean;
  openModal: (ctaSource?: string, requirement?: string) => void;
  closeModal: () => void;
  modalCtaSource: string;
  modalRequirement: string;
}

const INITIAL_DEMO_LEADS: LeadSubmission[] = [
  {
    id: 'lead-101',
    name: 'Rajesh Sharma',
    phone: '+91 98201 45892',
    email: 'rajesh.sharma@example.com',
    requirement: 'Buy',
    budget: '₹ 80 Lakhs - ₹ 1 Cr',
    preferredArea: 'Nerul East',
    propertyType: '2 BHK',
    message: 'Interested in ready possession 2 BHK near Nerul Station.',
    lead_source: 'Website Hero Form',
    cta_source: 'Hero CTA',
    page_name: 'Home',
    timestamp: '2026-07-27 09:30:00',
    status: 'New'
  },
  {
    id: 'lead-102',
    name: 'Sneha Kulkarni',
    phone: '+91 98192 33410',
    email: 'sneha.k@example.com',
    requirement: 'Buy',
    budget: '₹ 40 Lakhs - ₹ 50 Lakhs',
    preferredArea: 'Pushpak Nagar',
    propertyType: '1 BHK',
    message: 'Looking for 1 BHK investment near upcoming Navi Mumbai Airport.',
    lead_source: 'Pop-up Modal',
    cta_source: 'Scroll Trigger 25%',
    page_name: 'Featured Projects',
    timestamp: '2026-07-27 10:05:00',
    status: 'Contacted'
  },
  {
    id: 'lead-103',
    name: 'Vikram Mehta',
    phone: '+91 97690 12099',
    email: 'v.mehta@example.com',
    requirement: 'Sell',
    budget: '₹ 1.5 Cr+',
    preferredArea: 'Seawoods West',
    propertyType: '3 BHK',
    message: 'Want to sell my 3 BHK in Seawoods Sector 44.',
    lead_source: 'Sell Property Page',
    cta_source: 'Evaluation Request',
    page_name: 'Sell Property',
    timestamp: '2026-07-26 18:45:00',
    status: 'Follow-up'
  }
];

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<LeadSubmission[]>(() => {
    const saved = localStorage.getItem('jayshree_leads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved leads:', e);
      }
    }
    return INITIAL_DEMO_LEADS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCtaSource, setModalCtaSource] = useState('General CTA');
  const [modalRequirement, setModalRequirement] = useState('');
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  useEffect(() => {
    localStorage.setItem('jayshree_leads', JSON.stringify(leads));
  }, [leads]);

  // Automatic Trigger: 3 Seconds OR 25% Scroll
  useEffect(() => {
    if (hasAutoOpened) return;

    // 1. Timer trigger (3 seconds)
    const timer = setTimeout(() => {
      if (!hasAutoOpened) {
        setHasAutoOpened(true);
        setModalCtaSource('Timed Popup (3s)');
        setIsModalOpen(true);
      }
    }, 3000);

    // 2. Scroll trigger (25% scroll depth)
    const handleScroll = () => {
      const scrollDepth = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollDepth >= 0.25 && !hasAutoOpened) {
        setHasAutoOpened(true);
        setModalCtaSource('Scroll Depth (25%)');
        setIsModalOpen(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasAutoOpened]);

  const openModal = (ctaSource: string = 'CTA Click', requirement: string = '') => {
    setModalCtaSource(ctaSource);
    setModalRequirement(requirement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addLead = (leadData: Omit<LeadSubmission, 'id' | 'timestamp' | 'status'>) => {
    const newLead: LeadSubmission = {
      ...leadData,
      id: `lead-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: 'New'
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: LeadSubmission['status']) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        addLead,
        updateLeadStatus,
        deleteLead,
        isModalOpen,
        openModal,
        closeModal,
        modalCtaSource,
        modalRequirement
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
