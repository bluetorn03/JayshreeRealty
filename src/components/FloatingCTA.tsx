import React from 'react';
import { Phone, MessageSquare, ClipboardList } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { useData } from '../context/DataContext';
import { analyticsTracker } from '../services/analyticsTracker';

export const FloatingCTA: React.FC = () => {
  const { openModal } = useLeads();
  const { siteSettings } = useData();

  const phoneRaw = siteSettings?.phoneRaw || '+918169005579';
  const phoneDisplay = siteSettings?.phone || '+91 81690 05579';
  const whatsappRaw = siteSettings?.whatsappRaw || '918169005579';
  const whatsappUrl = `https://wa.me/${whatsappRaw}?text=Hello,%20I%20want%20property%20information%20from%20Jayshree%20Realty.`;

  const handleWhatsAppClick = () => {
    analyticsTracker.trackCTAClick('WhatsApp Click', document.title);
  };

  const handleCallClick = () => {
    analyticsTracker.trackCTAClick('Phone Call Click', document.title);
  };

  const handleEnquireClick = () => {
    analyticsTracker.trackCTAClick('Enquire Button Click', document.title);
    openModal('Mobile Sticky Bottom Bar');
  };

  return (
    <>
      {/* Desktop Floating Actions (Bottom Right) */}
      <div className="floating-actions">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-wa pulse-gold"
          title={`Chat on WhatsApp (${phoneDisplay})`}
          onClick={handleWhatsAppClick}
        >
          <MessageSquare className="w-6 h-6" />
        </a>

        <a
          href={`tel:${phoneRaw}`}
          className="floating-btn floating-call"
          title={`Call Now (${phoneDisplay})`}
          onClick={handleCallClick}
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>

      {/* Mobile Sticky Bottom Bar (Inspired by design reference image 3) */}
      <div className="mobile-bottom-bar font-outfit text-xs font-semibold uppercase tracking-wider">
        <a
          href={`tel:${phoneRaw}`}
          className="flex flex-col items-center justify-center bg-[#0d1527] text-white hover:text-[#c5a059] border-r border-[#c5a059]/20 transition-colors"
          onClick={handleCallClick}
        >
          <Phone className="w-4 h-4 mb-1 text-[#c5a059]" />
          CALL NOW
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center bg-[#0d1527] text-[#25d366] hover:bg-[#25d366] hover:text-white border-r border-[#c5a059]/20 transition-colors"
          onClick={handleWhatsAppClick}
        >
          <MessageSquare className="w-4 h-4 mb-1 text-[#25d366]" />
          WHATSAPP
        </a>

        <button
          onClick={handleEnquireClick}
          className="flex flex-col items-center justify-center bg-gradient-to-r from-[#e5c178] to-[#c5a059] text-[#070b19] font-bold transition-all"
        >
          <ClipboardList className="w-4 h-4 mb-1" />
          ENQUIRE
        </button>
      </div>
    </>
  );
};
