import React from 'react';
import { SEOHead } from '../components/SEOHead';
import { useLeads } from '../context/LeadContext';
import { MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export const CommercialProperties: React.FC = () => {
  const { openModal } = useLeads();

  const commercialList = [
    {
      id: 'comm-1',
      title: 'Station Complex Commercial Offices',
      location: 'Nerul Railway Station Complex, Navi Mumbai',
      price: '₹ 85 Lakhs*',
      area: '350 - 1200 Sq.Ft.',
      features: ['Heavy Footfall', 'High Rental Yield', 'Elevator Access', 'Direct Railway Station Entry'],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'comm-2',
      title: 'Highstreet Retail Shops',
      location: 'Seawoods Grand Central Corridor',
      price: '₹ 1.25 Cr*',
      area: '450 - 900 Sq.Ft.',
      features: ['Main Road Frontage', 'Glass Frontage', 'Provision for AC', 'Ample Customer Parking'],
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'comm-3',
      title: 'Corporate IT & Executive Suites',
      location: 'Sanpada / Vashi Highway Hub',
      price: '₹ 1.85 Cr*',
      area: '850 - 2500 Sq.Ft.',
      features: ['24/7 Power Backup', 'Multi-level Car Parking', 'Grand Reception Lobby'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000'
    }
  ];

  return (
    <div className="min-h-screen font-sans">
      <SEOHead
        title="Commercial Properties & Shops in Nerul & Navi Mumbai"
        description="Invest in high return commercial offices, station complex spaces, and retail shops in Nerul, Seawoods, and Sanpada with Jayshree Realty."
      />

      {/* 1. HEADER (Dark Navy Background) */}
      <section className="pt-32 pb-20 section-navy border-b border-[#c5a059]/20">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-3">
          <span className="badge-gold">High Return Investments</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Commercial Properties in <span className="text-gradient-gold">Navi Mumbai</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-outfit">
            Prime retail shops, railway station complex office suites, and corporate spaces with high rental yields.
          </p>
        </div>
      </section>

      {/* 2. COMMERCIAL CARDS (Warm Beige Background) */}
      <section className="py-24 section-warm-beige border-b border-amber-200/60">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {commercialList.map((comm) => (
              <div key={comm.id} className="bg-white rounded-2xl border border-amber-200/80 shadow-xl overflow-hidden flex flex-col justify-between group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img src={comm.image} alt={comm.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="badge-gold font-bold shadow-md">Commercial Space</span>
                    </div>
                  </div>
                  <div className="p-6 font-outfit">
                    <h3 className="font-serif text-xl font-bold text-slate-900 mb-2 leading-snug">{comm.title}</h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mb-4 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0" /> {comm.location}
                    </p>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs font-outfit mb-5">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase block font-semibold">Starting Price</span>
                        <span className="text-[#99732b] font-bold text-sm">{comm.price}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase block font-semibold">Carpet Area</span>
                        <span className="text-slate-900 font-bold text-sm">{comm.area}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 font-outfit">
                      {comm.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#99732b] shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => openModal(`Commercial (${comm.title})`, 'Commercial')}
                    className="btn-gold w-full text-xs py-3.5 font-bold uppercase shadow-lg"
                  >
                    GET BROCHURE & ROI DETAILS <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
