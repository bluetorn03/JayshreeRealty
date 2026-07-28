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
    // 1. Seed Admin User
    const adminUser = (process.env.ADMIN_USER || 'admin@jayshreerealty').toLowerCase();
    const adminPass = process.env.ADMIN_PASS || 'jayshreerealty@8989';

    const { data: existingAdmins, error: adminErr } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', adminUser);

    if (!adminErr && (!existingAdmins || existingAdmins.length === 0)) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(adminPass, salt);
      
      await supabase.from('admin_users').insert([{
        id: 'admin-1',
        username: adminUser,
        password_hash: hash,
        role: 'super_admin'
      }]);
      console.log(`[Supabase DB] Seeded default admin user: ${adminUser}`);
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
        email: 'jayshreerealty03@gmail.com',
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
        smtp_port: '587',
        smtp_user: 'jayshreerealty03@gmail.com',
        smtp_from_email: 'jayshreerealty03@gmail.com',
        maintenance_mode: 0,
        maintenance_message: 'System undergoes scheduled maintenance. We will be back shortly.'
      }]);
      console.log('[Supabase DB] Seeded site settings');
    }

    console.log('[Supabase DB] Initialization complete.');
  } catch (err) {
    console.warn('[Supabase DB] Initialization warning:', err.message);
  }
};
