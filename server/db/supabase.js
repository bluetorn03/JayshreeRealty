import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Helper check for Supabase connection validity
export const isSupabaseConfigured = () => {
  return (
    process.env.SUPABASE_URL &&
    !process.env.SUPABASE_URL.includes('xyzcompany') &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder')
  );
};

// Database Initialization & Automatic Seeding Helper
export const initSupabaseDb = async () => {
  console.log('[Supabase DB] Checking & Initializing database connection...');

  try {
    // 1. Seed / Ensure Admin User with correct password hash
    const adminUser = (process.env.ADMIN_USER || 'admin@jayshreerealty').toLowerCase();
    const adminPass = process.env.ADMIN_PASS || 'jayshreerealty@8989';

    // Always upsert with fresh hash to ensure password is always correct
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPass, salt);

    const { error: adminErr } = await supabase.from('admin_users').upsert([{
      id: 'admin-1',
      username: adminUser,
      password_hash: hash,
      role: 'super_admin'
    }], { onConflict: 'id' });

    if (!adminErr) {
      console.log(`[Supabase DB] Admin user seeded/updated: ${adminUser}`);
    } else {
      console.warn('[Supabase DB] Admin upsert warning:', adminErr.message);
    }

    // 2. Seed Hero Settings
    const { data: heroData, error: heroErr } = await supabase.from('hero_settings').select('*').eq('id', 1);
    if (!heroErr && (!heroData || heroData.length === 0)) {
      await supabase.from('hero_settings').insert([{
        id: 1,
        heading_part1: 'Navi Mumbai’s Most',
        heading_gold: 'Trusted Luxury Real Estate',
        subtext: 'Experience transparent property buying with verified CIDCO plots, direct developer launches, and prime resale homes across Nerul, Seawoods, Kharghar, Ulwe, Pushpak Nagar & Panvel.',
        keywords_json: JSON.stringify([
          'Premium Projects', 'Buy Property', 'Sell Property',
          'Verified Properties', 'Navi Mumbai', 'Luxury Homes'
        ]),
        background_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000'
      }]);
      console.log('[Supabase DB] Seeded hero settings');
    }

    // 3. Seed Popup Settings
    const { data: popupData, error: popupErr } = await supabase.from('popup_settings').select('*').eq('id', 1);
    if (!popupErr && (!popupData || popupData.length === 0)) {
      await supabase.from('popup_settings').insert([{
        id: 1,
        title: 'Get Best Offer & Instant Details',
        subtitle: 'Register now for exclusive launch pricing, priority site visits & floor plans.',
        badge: 'Exclusive Launch Pricing',
        left_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
        privacy_text: 'We respect your privacy. No spam, ever.',
        enabled: 1,
        trigger_delay: 3,
        scroll_trigger_percent: 25,
        redirect_url: '',
        success_message: 'Thank you! Our luxury real estate expert will contact you shortly.'
      }]);
      console.log('[Supabase DB] Seeded popup settings');
    }

    // 4. Seed Site Settings
    const { data: siteData, error: siteErr } = await supabase.from('site_settings').select('*').eq('id', 1);
    if (!siteErr && (!siteData || siteData.length === 0)) {
      await supabase.from('site_settings').insert([{
        id: 1,
        company_name: 'Jayshree Realty',
        phone: '+91 81690 05579',
        phone_raw: '+918169005579',
        email: 'info@jayshreerealty.com',
        whatsapp: '+91 81690 05579',
        whatsapp_raw: '918169005579',
        address: 'Shop No. 12, Prime Plaza, Sector 19, Nerul West, Navi Mumbai, Maharashtra 400706',
        google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.492582845625!2d73.0125!3d19.0416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m3!2sNerul%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000',
        logo_url: '/assets/jayshree-realty-logo.png',
        favicon_url: '/favicon.ico',
        facebook_url: 'https://facebook.com/jayshreerealty',
        instagram_url: 'https://instagram.com/jayshreerealty',
        linkedin_url: 'https://linkedin.com/company/jayshreerealty',
        youtube_url: 'https://youtube.com/@jayshreerealty',
        seo_title_default: 'Jayshree Realty | Premium Luxury Real Estate Consultancy Navi Mumbai',
        seo_description_default: 'Navi Mumbai premier luxury real estate consultancy. Verified CIDCO plot projects, luxury residential towers & commercial spaces in Nerul, Seawoods, Kharghar & Ulwe.',
        seo_keywords_default: 'Navi Mumbai Real Estate, Nerul Flat Sale, Kharghar New Launch, Seawoods Luxury Flat, Pushpak Nagar CIDCO Plot, Jayshree Realty',
        ga_measurement_id: 'G-MEASUREMENT_ID',
        gtm_container_id: 'GTM-CONTAINER_ID',
        gsc_verification_meta: 'gsc-verification-token',
        robots_txt_content: "User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://jayshreerealty.com/sitemap.xml",
        sitemap_auto_generate: 1,
        smtp_host: 'smtp.gmail.com',
        smtp_port: '465',
        smtp_user: 'jayshreerealty16@gmail.com',
        smtp_from_email: 'jayshreerealty16@gmail.com',
        maintenance_mode: 0,
        maintenance_message: 'System undergoes scheduled maintenance. We will be back shortly.'
      }]);
      console.log('[Supabase DB] Seeded site settings');
    }

    // 5. Seed Properties (ensure every location & category is covered)
    const { data: propData, error: propErr } = await supabase.from('properties').select('id');
    if (!propErr && (!propData || propData.length === 0)) {
      const seedProperties = [
        {
          id: 'seed-nerul-1',
          slug: 'jayshree-residency-nerul',
          title: 'Jayshree Residency Nerul',
          category: 'Residential',
          location: 'Nerul West, Navi Mumbai',
          type: 'Residential',
          configuration: '2 & 3 BHK Luxury Apartments',
          price: '₹ 1.25 Cr*',
          area: '750 - 1100 Sq.Ft.',
          possession: 'Ready to Move',
          features_json: JSON.stringify(['Near Nerul Station', 'CIDCO Title Clear', '0% Brokerage', 'Podium Amenities']),
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
          gallery_images_json: JSON.stringify(['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000']),
          is_featured: 1,
          code: 'JR-NER-01',
          highlights: 'Prime luxury residences in Nerul West near Palm Beach Road.',
          brokerage: '0% Brokerage',
          brokerage_free: 1,
          published: 1,
          archived: 0,
          placements_json: JSON.stringify(['homepage', 'featured', 'buy']),
          builder_name: 'Jayshree Realty',
          builder_experience: '25+ Years',
          amenities_json: JSON.stringify(['Swimming Pool', 'Gymnasium', '24/7 Security', 'Clubhouse']),
          seo_title: 'Jayshree Residency | 2 & 3 BHK Flats in Nerul West',
          description: 'Luxury ready possession apartments in Nerul West.',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'seed-ulwe-1',
          slug: 'ulwe-prime-heights',
          title: 'Ulwe Prime Heights',
          category: 'Resale',
          location: 'Sector 19, Ulwe, Navi Mumbai',
          type: 'Resale',
          configuration: '1 & 2 BHK Prime Flats',
          price: '₹ 65 Lakhs*',
          area: '620 - 950 Sq.Ft.',
          possession: 'Ready Possession',
          features_json: JSON.stringify(['Near Bamandongri Railway Station', 'Atal Setu MTHL Connectivity', 'Verified Title']),
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
          gallery_images_json: JSON.stringify(['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000']),
          is_featured: 0,
          code: 'JR-ULW-02',
          highlights: 'Excellent connectivity to Atal Setu MTHL sea link.',
          brokerage: '0% Brokerage',
          brokerage_free: 1,
          published: 1,
          archived: 0,
          placements_json: JSON.stringify(['buy']),
          builder_name: 'Jayshree Realty',
          builder_experience: '25+ Years',
          amenities_json: JSON.stringify(['Elevator', '24/7 Power Backup', 'Car Parking']),
          seo_title: 'Ulwe Prime Heights | 1 & 2 BHK Resale Flats Ulwe',
          description: 'Ready to move resale apartments near Atal Setu in Ulwe.',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'seed-kharghar-1',
          slug: 'kharghar-central-park-greens',
          title: 'Kharghar Central Park Greens',
          category: 'Township',
          location: 'Sector 35, Kharghar, Navi Mumbai',
          type: 'Township',
          configuration: '2 & 3 BHK Mega Township Towers',
          price: '₹ 95 Lakhs*',
          area: '680 - 1250 Sq.Ft.',
          possession: 'Dec 2026',
          features_json: JSON.stringify(['4-Acre Gated Township', 'Near Central Park & Golf Course', 'Metro Connectivity']),
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
          gallery_images_json: JSON.stringify(['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000']),
          is_featured: 1,
          code: 'JR-KHG-03',
          highlights: 'Mega lifestyle township facing Golf Course & Central Park Kharghar.',
          brokerage: '0% Brokerage',
          brokerage_free: 1,
          published: 1,
          archived: 0,
          placements_json: JSON.stringify(['homepage', 'featured', 'buy']),
          builder_name: 'Jayshree Developers',
          builder_experience: '18+ Years',
          amenities_json: JSON.stringify(['Golf Putting Green', 'Olympic Size Pool', 'Gymnasium', 'Landscaped Gardens']),
          seo_title: 'Kharghar Central Park Greens | Mega Township Kharghar',
          description: 'Premium township towers in Sector 35 Kharghar.',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'seed-pushpak-1',
          slug: 'airport-view-enclave-pushpak-nagar',
          title: 'Airport View Enclave Pushpak Nagar',
          category: 'Featured',
          location: 'Pushpak Nagar, Navi Mumbai',
          type: 'New Launch',
          configuration: '1 & 2 BHK Airport Node Apartments',
          price: '₹ 45 Lakhs*',
          area: '450 - 680 Sq.Ft.',
          possession: 'Dec 2026',
          features_json: JSON.stringify(['Near Navi Mumbai International Airport', 'CIDCO Plot Project', 'High Rental Yield']),
          image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000',
          gallery_images_json: JSON.stringify(['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000']),
          is_featured: 1,
          code: 'JR-PN-04',
          highlights: 'Direct developer launch in airport growth node Pushpak Nagar.',
          brokerage: '0% Brokerage',
          brokerage_free: 1,
          published: 1,
          archived: 0,
          placements_json: JSON.stringify(['homepage', 'featured', 'buy']),
          builder_name: 'Jayshree Realty',
          builder_experience: '25+ Years',
          amenities_json: JSON.stringify(['Gymnasium', '24/7 Security', 'Podium Parking']),
          seo_title: 'Airport View Enclave | 1 & 2 BHK Pushpak Nagar',
          description: 'Prime CIDCO plot project near upcoming airport terminal.',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'seed-seawoods-1',
          slug: 'seawoods-grand-palm-towers',
          title: 'Seawoods Grand Palm Towers',
          category: 'Luxury',
          location: 'Seawoods West, Navi Mumbai',
          type: 'Luxury',
          configuration: '3 & 4 BHK Ultra Luxury Sea-Facing Suites',
          price: '₹ 2.40 Cr*',
          area: '1400 - 2100 Sq.Ft.',
          possession: 'Ready Possession',
          features_json: JSON.stringify(['Sea-Facing Balconies', 'Adjacent to Grand Central Mall', 'Italian Marble Flooring']),
          image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1000',
          gallery_images_json: JSON.stringify(['https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1000']),
          is_featured: 1,
          code: 'JR-SW-05',
          highlights: 'Ultra luxury sea-facing residences in Seawoods West.',
          brokerage: '0% Brokerage',
          brokerage_free: 1,
          published: 1,
          archived: 0,
          placements_json: JSON.stringify(['homepage', 'featured', 'buy']),
          builder_name: 'Jayshree Realty',
          builder_experience: '25+ Years',
          amenities_json: JSON.stringify(['Infinity Pool', 'Sky Lounge', 'Concierge Service', 'Private Elevator']),
          seo_title: 'Seawoods Grand Palm Towers | Luxury 3 & 4 BHK Seawoods',
          description: 'Ultra luxury sea-facing residences near Seawoods Grand Central.',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'seed-commercial-1',
          slug: 'nerul-station-commercial-office-suites',
          title: 'Nerul Station Commercial Office Suites',
          category: 'Commercial',
          location: 'Nerul West, Navi Mumbai',
          type: 'Commercial',
          configuration: 'Boutique Office Suites & Retail Shops',
          price: '₹ 85 Lakhs*',
          area: '350 - 900 Sq.Ft.',
          possession: 'Ready Possession',
          features_json: JSON.stringify(['High Footfall Location', 'Direct Station Complex Access', 'Assured High ROI Yield']),
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000',
          gallery_images_json: JSON.stringify(['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000']),
          is_featured: 1,
          code: 'JR-COM-06',
          highlights: 'Prime commercial office spaces at Nerul Railway Station complex.',
          brokerage: '0% Brokerage',
          brokerage_free: 1,
          published: 1,
          archived: 0,
          placements_json: JSON.stringify(['commercial', 'buy']),
          builder_name: 'Jayshree Realty',
          builder_experience: '25+ Years',
          amenities_json: JSON.stringify(['High Speed Elevators', '24/7 CCTV & Security', 'Central AC']),
          seo_title: 'Nerul Commercial Office Suites | Shops & Offices Nerul',
          description: 'High return commercial office space in Nerul Station Complex.',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      ];

      await supabase.from('properties').insert(seedProperties);
      console.log('[Supabase DB] Seeded properties for all required locations & categories');
    }

    // 6. Seed Leadership Profiles (Founder & CEO)
    const { data: leadProfData, error: leadProfErr } = await supabase.from('leadership_profiles').select('id');
    if (!leadProfErr && (!leadProfData || leadProfData.length === 0)) {
      await supabase.from('leadership_profiles').insert([
        {
          id: 'lead-founder',
          role: 'Founder',
          name: 'Jayesh Patel',
          designation: 'Founder & Managing Director',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
          description: 'Pioneered transparent property acquisitions, verified CIDCO title transfers, and luxury real estate investments across Navi Mumbai for over 25 years.',
          achievements: '450+ Verified Home Allocations, 100% Legal Title Guarantee',
          office_location: 'G-102, Nerul Railway Station Complex, Navi Mumbai',
          experience: '25+ Years Real Estate Industry Leadership',
          badges_json: JSON.stringify(['Founder', 'CIDCO Title Specialist', 'Navi Mumbai Expert'])
        },
        {
          id: 'lead-ceo',
          role: 'CEO',
          name: 'Jayshree Patel',
          designation: 'Chief Executive Officer',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
          description: 'Spearheading client relationship management, direct developer partnerships, and strategic expansion into airport node developments in Pushpak Nagar & Ulwe.',
          achievements: 'Best Customer Satisfaction Award 2024, 0% Brokerage Direct Launch Network',
          office_location: 'Head Office, Nerul Railway Station Complex, Navi Mumbai',
          experience: '18+ Years Strategic Advisory & Client Experience',
          badges_json: JSON.stringify(['CEO', 'Customer Experience Pioneer', 'Airport Node Specialist'])
        }
      ]);
      console.log('[Supabase DB] Seeded leadership profiles');
    }

    // 7. Seed Video Testimonials
    const { data: videoData, error: videoErr } = await supabase.from('video_testimonials').select('id');
    if (!videoErr && (!videoData || videoData.length === 0)) {
      await supabase.from('video_testimonials').insert([
        {
          id: 'v1',
          client_name: 'Rahul & Meera Deshmukh',
          location: 'Bought 2 BHK in Nerul West',
          title: 'Seamless CIDCO Title Clear Verification & Zero Brokerage',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
          sort_order: 0
        },
        {
          id: 'v2',
          client_name: 'Dr. Anish Shetty',
          location: 'Invested in Pushpak Nagar CIDCO Plot',
          title: 'Exclusive Airport Node Launch Price Advantage',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
          sort_order: 1
        }
      ]);
      console.log('[Supabase DB] Seeded video testimonials');
    }

    console.log('[Supabase DB] Initialization complete.');
  } catch (err) {
    console.warn('[Supabase DB] Initialization warning:', err.message);
  }
};
