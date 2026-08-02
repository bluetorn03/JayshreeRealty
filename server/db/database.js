import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'jayshree.sqlite');
const sqlite = sqlite3.verbose();

export const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Helper for Promisified Queries
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const initDb = async () => {
  console.log('Initializing SQLite Database schema...');

  await run(`CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    configuration TEXT,
    price TEXT,
    area TEXT,
    possession TEXT,
    features_json TEXT,
    image TEXT,
    gallery_images_json TEXT,
    is_featured INTEGER DEFAULT 0,
    code TEXT,
    highlights TEXT,
    brokerage TEXT,
    brokerage_free INTEGER DEFAULT 0,
    published INTEGER DEFAULT 1,
    archived INTEGER DEFAULT 0,
    placements_json TEXT,
    brochure_url TEXT,
    floor_plan_url TEXT,
    builder_name TEXT,
    builder_experience TEXT,
    amenities_json TEXT,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Migrate missing property columns if needed
  try {
    const propCols = await query(`PRAGMA table_info(properties)`);
    const colNames = propCols.map(c => c.name);
    if (!colNames.includes('youtube_url')) await run(`ALTER TABLE properties ADD COLUMN youtube_url TEXT`);
    if (!colNames.includes('description')) await run(`ALTER TABLE properties ADD COLUMN description TEXT`);
    if (!colNames.includes('short_description')) await run(`ALTER TABLE properties ADD COLUMN short_description TEXT`);
    if (!colNames.includes('long_description')) await run(`ALTER TABLE properties ADD COLUMN long_description TEXT`);
  } catch (err) {
    console.warn('Property column migration note:', err.message);
  }

  await run(`CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    requirement TEXT,
    budget TEXT,
    preferred_area TEXT,
    property_type TEXT,
    message TEXT,
    lead_source TEXT,
    cta_source TEXT,
    page_name TEXT,
    timestamp TEXT,
    status TEXT DEFAULT 'New',
    notes TEXT,
    assigned_to TEXT DEFAULT 'Unassigned',
    follow_up_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS lead_history (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL,
    action TEXT NOT NULL,
    note TEXT,
    performed_by TEXT DEFAULT 'Admin',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    sort_order INTEGER DEFAULT 0
  )`);

  await run(`CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    time_ago TEXT,
    content TEXT,
    avatar_color TEXT,
    verified INTEGER DEFAULT 1,
    reviews_count TEXT,
    is_local_guide INTEGER DEFAULT 0,
    published INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS hero_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    heading_part1 TEXT,
    heading_gold TEXT,
    subtext TEXT,
    keywords_json TEXT,
    background_image TEXT
  )`);

  await run(`CREATE TABLE IF NOT EXISTS popup_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    title TEXT,
    subtitle TEXT,
    badge TEXT,
    left_image TEXT,
    privacy_text TEXT,
    enabled INTEGER DEFAULT 1,
    trigger_delay INTEGER DEFAULT 3,
    scroll_trigger_percent INTEGER DEFAULT 25,
    redirect_url TEXT DEFAULT '',
    success_message TEXT DEFAULT 'Thank you! Our luxury real estate expert will contact you shortly.'
  )`);

  await run(`CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    company_name TEXT,
    phone TEXT,
    phone_raw TEXT,
    email TEXT,
    whatsapp TEXT,
    whatsapp_raw TEXT,
    address TEXT,
    google_maps_embed_url TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    youtube_url TEXT,
    seo_title_default TEXT,
    seo_description_default TEXT,
    seo_keywords_default TEXT,
    ga_measurement_id TEXT,
    gtm_container_id TEXT,
    gsc_verification_meta TEXT,
    robots_txt_content TEXT,
    sitemap_auto_generate INTEGER DEFAULT 1,
    smtp_host TEXT,
    smtp_port TEXT,
    smtp_user TEXT,
    smtp_from_email TEXT,
    maintenance_mode INTEGER DEFAULT 0,
    maintenance_message TEXT
  )`);

  await run(`CREATE TABLE IF NOT EXISTS counters (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    value INTEGER NOT NULL,
    suffix TEXT,
    icon_name TEXT,
    sort_order INTEGER DEFAULT 0
  )`);

  await run(`CREATE TABLE IF NOT EXISTS location_nodes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    active_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0
  )`);

  await run(`CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    page_path TEXT,
    page_title TEXT,
    property_id TEXT,
    referrer TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS visitor_sessions (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_returning INTEGER DEFAULT 0,
    page_views_count INTEGER DEFAULT 1,
    lead_id TEXT
  )`);

  await run(`CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    user TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await seedDefaults();
  console.log('SQLite Database initialization complete.');
};

async function seedDefaults() {
  // Seed Default Admin User if empty
  const adminUser = process.env.ADMIN_USER || 'admin@jayshreerealty';
  const adminPass = process.env.ADMIN_PASS || 'jayshreerealty@8989';
  const existingAdmin = await getOne(`SELECT * FROM admin_users WHERE username = ?`, [adminUser.toLowerCase()]);
  
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPass, salt);
    await run(`INSERT INTO admin_users (id, username, password_hash, role) VALUES (?, ?, ?, ?)`, [
      'admin-1',
      adminUser.toLowerCase(),
      hash,
      'super_admin'
    ]);
    console.log('Seeded default admin user:', adminUser);
  }

  // Seed Default Hero Settings
  const existingHero = await getOne(`SELECT * FROM hero_settings WHERE id = 1`);
  if (!existingHero) {
    await run(`INSERT INTO hero_settings (id, heading_part1, heading_gold, subtext, keywords_json, background_image) VALUES (
      1,
      'Navi Mumbai’s Most',
      'Trusted Luxury Real Estate',
      'Experience transparent property buying with verified CIDCO plots, direct developer launches, and prime resale homes across Nerul, Seawoods, Kharghar, Ulwe, Pushpak Nagar & Panvel.',
      ?,
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000'
    )`, [JSON.stringify([
      "Premium Projects", "Buy Property", "Sell Property", "Verified Properties", "Navi Mumbai", "Luxury Homes"
    ])]);
  }

  // Seed Default Popup Settings
  const existingPopup = await getOne(`SELECT * FROM popup_settings WHERE id = 1`);
  if (!existingPopup) {
    await run(`INSERT INTO popup_settings (id, title, subtitle, badge, left_image, privacy_text, enabled, trigger_delay, scroll_trigger_percent) VALUES (
      1,
      'Get Best Offer & Instant Details',
      'Register now for exclusive launch pricing, priority site visits & floor plans.',
      'Exclusive Launch Pricing',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
      'We respect your privacy. No spam, ever.',
      1, 3, 25
    )`);
  }

  // Seed Default Site Settings
  const existingSite = await getOne(`SELECT * FROM site_settings WHERE id = 1`);
  if (!existingSite) {
    await run(`INSERT INTO site_settings (id, company_name, phone, phone_raw, email, whatsapp, whatsapp_raw, address, google_maps_embed_url, logo_url, favicon_url, facebook_url, instagram_url, linkedin_url, youtube_url, seo_title_default, seo_description_default, seo_keywords_default, ga_measurement_id, gtm_container_id, gsc_verification_meta, robots_txt_content, sitemap_auto_generate, smtp_host, smtp_port, smtp_user, smtp_from_email, maintenance_mode, maintenance_message) VALUES (
      1,
      'Jayshree Realty',
      '+91 81690 05579',
      '+918169005579',
      'info@jayshreerealty.com',
      '+91 81690 05579',
      '918169005579',
      'Shop No. 12, Prime Plaza, Sector 19, Nerul West, Navi Mumbai, Maharashtra 400706',
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.492582845625!2d73.0125!3d19.0416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m3!2sNerul%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000',
      '/assets/jayshree-realty-logo.png',
      '/favicon.ico',
      'https://facebook.com/jayshreerealty',
      'https://instagram.com/jayshreerealty',
      'https://linkedin.com/company/jayshreerealty',
      'https://youtube.com/@jayshreerealty',
      'Jayshree Realty | Premium Luxury Real Estate Consultancy Navi Mumbai',
      'Navi Mumbai premier luxury real estate consultancy. Verified CIDCO plot projects, luxury residential towers & commercial spaces in Nerul, Seawoods, Kharghar & Ulwe.',
      'Navi Mumbai Real Estate, Nerul Flat Sale, Kharghar New Launch, Seawoods Luxury Flat, Pushpak Nagar CIDCO Plot, Jayshree Realty',
      'G-MEASUREMENT_ID',
      'GTM-CONTAINER_ID',
      'gsc-verification-token',
      'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://jayshreerealty.com/sitemap.xml',
      'smtp.gmail.com',
      '465',
      'jayshreerealty16@gmail.com',
      'jayshreerealty16@gmail.com',
      0,
      'System undergoes scheduled maintenance. We will be back shortly.'
    )`);
  }

  // Seed Default Counters if empty
  const countRow = await getOne(`SELECT COUNT(*) as cnt FROM counters`);
  if (countRow && countRow.cnt === 0) {
    const defaultCounters = [
      { id: 'cnt-1', label: 'Happy Families', value: 450, suffix: '+', icon_name: 'Users', sort_order: 1 },
      { id: 'cnt-2', label: 'Projects Delivered', value: 85, suffix: '+', icon_name: 'Building2', sort_order: 2 },
      { id: 'cnt-3', label: 'Years Experience', value: 12, suffix: '+', icon_name: 'Award', sort_order: 3 },
      { id: 'cnt-4', label: 'Sq.Ft. Managed', value: 2, suffix: 'M+', icon_name: 'TrendingUp', sort_order: 4 },
    ];
    for (const c of defaultCounters) {
      await run(`INSERT INTO counters (id, label, value, suffix, icon_name, sort_order) VALUES (?, ?, ?, ?, ?, ?)`, [
        c.id, c.label, c.value, c.suffix, c.icon_name, c.sort_order
      ]);
    }
  }

  // Seed Default Location Nodes if empty
  const locRow = await getOne(`SELECT COUNT(*) as cnt FROM location_nodes`);
  if (locRow && locRow.cnt === 0) {
    const defaultLocations = [
      { id: 'loc-1', name: 'Kharghar', description: 'Central Park, Golf Course, & Metro Hub', active_count: 12, sort_order: 1 },
      { id: 'loc-2', name: 'Nerul & Seawoods', description: 'Grand Central Mall & Palm Beach Road', active_count: 14, sort_order: 2 },
      { id: 'loc-3', name: 'Ulwe', description: 'Near Atal Setu MTHL & Coastal Highway', active_count: 8, sort_order: 3 },
      { id: 'loc-4', name: 'Pushpak Nagar', description: 'Navi Mumbai International Airport Node', active_count: 6, sort_order: 4 },
      { id: 'loc-5', name: 'Panvel', description: 'Mega Township & Railway Junction', active_count: 4, sort_order: 5 }
    ];
    for (const l of defaultLocations) {
      await run(`INSERT INTO location_nodes (id, name, description, active_count, sort_order) VALUES (?, ?, ?, ?, ?)`, [
        l.id, l.name, l.description, l.active_count, l.sort_order
      ]);
    }
  }

  // Seed Default Categories if empty
  const catRow = await getOne(`SELECT COUNT(*) as cnt FROM categories`);
  if (catRow && catRow.cnt === 0) {
    const defaultCats = [
      'Kharghar New Projects', 'Upper Kharghar', 'Ulwe New Projects', 'Pushpak Nagar New Projects',
      'Nerul & Seawoods New Projects', 'Juinagar & Sanpada New Projects', 'Panvel', 'Khandeshwar / Kamothe',
      'Resale', 'Commercial Workspaces', '1 BHK Nerul East', '1 BHK Nerul West', '1 BHK Seawoods East',
      '1 BHK Seawoods West', '2 BHK Nerul East', '2 BHK Nerul West', '2 BHK Seawoods East', '2 BHK Seawoods West',
      '3/4 BHK', 'Row House'
    ];
    for (let i = 0; i < defaultCats.length; i++) {
      await run(`INSERT INTO categories (id, name, sort_order) VALUES (?, ?, ?)`, [
        `cat-${i + 1}`, defaultCats[i], i + 1
      ]);
    }
  }

  // Seed Default Reviews if empty
  const revRow = await getOne(`SELECT COUNT(*) as cnt FROM reviews`);
  if (revRow && revRow.cnt === 0) {
    const defaultReviews = [
      {
        id: 'rev-1',
        author: 'Amitabh Sen',
        rating: 5,
        time_ago: '2 weeks ago',
        content: 'Jayshree Realty helped me buy a prime 2 BHK in Nerul West with zero brokerage and total transparency. Special thanks to the team for smooth CIDCO title verification!',
        avatar_color: 'bg-amber-600',
        verified: 1,
        reviews_count: '14 reviews',
        is_local_guide: 1
      },
      {
        id: 'rev-2',
        author: 'Pooja Deshmukh',
        rating: 5,
        time_ago: '1 month ago',
        content: 'Highly professional luxury real estate consultants in Navi Mumbai. They gave us exclusive developer pricing for a Pushpak Nagar project near the upcoming airport.',
        avatar_color: 'bg-emerald-600',
        verified: 1,
        reviews_count: '8 reviews',
        is_local_guide: 0
      },
      {
        id: 'rev-3',
        author: 'Rohan Verma',
        rating: 5,
        time_ago: '3 months ago',
        content: 'Sold my Seawoods property within 15 days at a great price. Extremely reliable, trustworthy, and smooth paperwork assistance.',
        avatar_color: 'bg-blue-600',
        verified: 1,
        reviews_count: '22 reviews',
        is_local_guide: 1
      }
    ];
    for (const r of defaultReviews) {
      await run(`INSERT INTO reviews (id, author, rating, time_ago, content, avatar_color, verified, reviews_count, is_local_guide) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        r.id, r.author, r.rating, r.time_ago, r.content, r.avatar_color, r.verified, r.reviews_count, r.is_local_guide
      ]);
    }
  }

  // Seed Initial Properties if properties table is empty
  const propRow = await getOne(`SELECT COUNT(*) as cnt FROM properties`);
  if (propRow && propRow.cnt === 0) {
    const DEFAULT_PROPERTIES_SEED = [
      {
        id: 'proj-1',
        slug: 'jayshree-heights-nerul',
        title: 'Jayshree Heights',
        category: '2 BHK Nerul West',
        location: 'Sector 19, Nerul West, Navi Mumbai',
        type: 'New Launch',
        configuration: '2 & 3 BHK Luxury Residences',
        price: '₹ 1.25 Cr*',
        area: '780 - 1150 Sq.Ft.',
        possession: 'Ready Possession',
        features: ['CIDCO Clear Title Plot', 'Podium Amenities', 'Grand Entrance Lobby'],
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
        galleryImages: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000'
        ],
        isFeatured: true,
        code: '2BHK-01N',
        highlights: 'Prime Palm Beach Road connectivity.',
        brokerage: '0% Brokerage',
        brokerageFree: true,
        published: true,
        archived: false,
        placements: ['homepage', 'featured', 'buy'],
        brochureUrl: '',
        floorPlanUrl: '',
        builderName: 'Jayshree Developers',
        builderExperience: '12+ Years',
        amenities: ['Swimming Pool', 'Gymnasium', '24/7 Security', 'Clubhouse']
      },
      {
        id: 'proj-2',
        slug: 'airport-view-pushpak-nagar',
        title: 'Airport View Enclave',
        category: 'Pushpak Nagar New Projects',
        location: 'Pushpak Nagar, Navi Mumbai',
        type: 'New Launch',
        configuration: '1 & 2 BHK Premium Apartments',
        price: '₹ 42 Lakhs*',
        area: '450 - 680 Sq.Ft.',
        possession: 'Possession Dec 2026',
        features: ['Near Navi Mumbai Intl Airport', 'CIDCO Plot', 'High ROI'],
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
        galleryImages: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000'
        ],
        isFeatured: true,
        code: '1BHK-09P',
        highlights: 'Direct investment opportunity near Airport terminal.',
        brokerage: '0% Brokerage',
        brokerageFree: true,
        published: true,
        archived: false,
        placements: ['homepage', 'featured', 'buy'],
        brochureUrl: '',
        floorPlanUrl: '',
        builderName: 'Jayshree Developers',
        builderExperience: '12+ Years',
        amenities: ['Gymnasium', '24/7 Security', 'Podium Parking']
      }
    ];
    for (const p of DEFAULT_PROPERTIES_SEED) {
      await run(`INSERT INTO properties (
        id, slug, title, category, location, type, configuration, price, area, possession,
        features_json, image, gallery_images_json, is_featured, code, highlights, brokerage,
        brokerage_free, published, archived, placements_json, brochure_url, floor_plan_url,
        builder_name, builder_experience, amenities_json, seo_title, seo_description, seo_keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        p.id,
        p.slug || p.id,
        p.title,
        p.category,
        p.location,
        p.type,
        p.configuration,
        p.price,
        p.area,
        p.possession || 'Ready Possession',
        JSON.stringify(p.features || []),
        p.image,
        JSON.stringify(p.galleryImages || [p.image]),
        p.isFeatured ? 1 : 0,
        p.code || '',
        p.highlights || '',
        p.brokerage || '0% Brokerage',
        p.brokerageFree ? 1 : 0,
        p.published !== false ? 1 : 0,
        p.archived ? 1 : 0,
        JSON.stringify(p.placements || (p.isFeatured ? ['homepage', 'featured', 'buy'] : ['buy'])),
        p.brochureUrl || '',
        p.floorPlanUrl || '',
        p.builderName || 'Jayshree Developers',
        p.builderExperience || '12+ Years',
        JSON.stringify(p.amenities || ['Swimming Pool', 'Gymnasium', '24/7 Security', 'Clubhouse']),
        p.seoTitle || p.title,
        p.seoDescription || p.highlights || p.title,
        p.seoKeywords || 'Navi Mumbai Real Estate, Flat for Sale'
      ]);
    }
  }

  // Seed Demo Leads if leads table is empty
  const leadRow = await getOne(`SELECT COUNT(*) as cnt FROM leads`);
  if (leadRow && leadRow.cnt === 0) {
    const demoLeads = [
      {
        id: 'lead-101',
        name: 'Rajesh Sharma',
        phone: '+91 98201 45892',
        email: 'rajesh.sharma@example.com',
        requirement: 'Buy',
        budget: '₹ 80 Lakhs - ₹ 1 Cr',
        preferred_area: 'Nerul East',
        property_type: '2 BHK',
        message: 'Interested in ready possession 2 BHK near Nerul Station.',
        lead_source: 'Website Hero Form',
        cta_source: 'Hero CTA',
        page_name: 'Home',
        timestamp: '2026-07-27 09:30:00',
        status: 'New',
        notes: 'Requested site visit on Sunday.'
      },
      {
        id: 'lead-102',
        name: 'Sneha Kulkarni',
        phone: '+91 98192 33410',
        email: 'sneha.k@example.com',
        requirement: 'Buy',
        budget: '₹ 40 Lakhs - ₹ 50 Lakhs',
        preferred_area: 'Pushpak Nagar',
        property_type: '1 BHK',
        message: 'Looking for 1 BHK investment near upcoming Navi Mumbai Airport.',
        lead_source: 'Pop-up Modal',
        cta_source: 'Scroll Trigger 25%',
        page_name: 'Featured Projects',
        timestamp: '2026-07-27 10:05:00',
        status: 'Contacted',
        notes: 'Sent project brochure on WhatsApp.'
      },
      {
        id: 'lead-103',
        name: 'Vikram Mehta',
        phone: '+91 97690 12099',
        email: 'v.mehta@example.com',
        requirement: 'Sell',
        budget: '₹ 1.5 Cr+',
        preferred_area: 'Seawoods West',
        property_type: '3 BHK',
        message: 'Want to sell my 3 BHK in Seawoods Sector 44.',
        lead_source: 'Sell Property Page',
        cta_source: 'Evaluation Request',
        page_name: 'Sell Property',
        timestamp: '2026-07-26 18:45:00',
        status: 'Follow-up',
        notes: 'Schedule home evaluation meeting next week.'
      }
    ];
    for (const l of demoLeads) {
      await run(`INSERT INTO leads (
        id, name, phone, email, requirement, budget, preferred_area, property_type,
        message, lead_source, cta_source, page_name, timestamp, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        l.id, l.name, l.phone, l.email, l.requirement, l.budget, l.preferred_area,
        l.property_type, l.message, l.lead_source, l.cta_source, l.page_name,
        l.timestamp, l.status, l.notes
      ]);
    }
  }
}
