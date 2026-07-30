-- ================================================================
-- JAYSHREE REALTY - COMPLETE DATABASE MIGRATION
-- Version: 2.1 | Generated for production sync
-- 
-- SAFE TO RUN MULTIPLE TIMES — All statements are idempotent.
-- No existing data or tables are dropped.
--
-- RUN IN: https://supabase.com/dashboard/project/pzmjewrnnzntvtueqmcq/sql
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- STEP 1: CREATE MISSING TABLES (IF NOT EXISTS — safe)
-- ================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY DEFAULT 'admin-1',
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    location TEXT NOT NULL DEFAULT 'Navi Mumbai',
    type TEXT NOT NULL DEFAULT 'New Launch',
    configuration TEXT DEFAULT '',
    price TEXT DEFAULT '',
    area TEXT DEFAULT '',
    possession TEXT DEFAULT '',
    features_json TEXT DEFAULT '[]',
    image TEXT DEFAULT '',
    gallery_images_json TEXT DEFAULT '[]',
    is_featured INTEGER DEFAULT 0,
    code TEXT DEFAULT '',
    highlights TEXT DEFAULT '',
    brokerage TEXT DEFAULT '',
    brokerage_free INTEGER DEFAULT 0,
    published INTEGER DEFAULT 1,
    archived INTEGER DEFAULT 0,
    placements_json TEXT DEFAULT '["buy"]',
    brochure_url TEXT DEFAULT '',
    floor_plan_url TEXT DEFAULT '',
    builder_name TEXT DEFAULT '',
    builder_experience TEXT DEFAULT '',
    amenities_json TEXT DEFAULT '[]',
    seo_title TEXT DEFAULT '',
    seo_description TEXT DEFAULT '',
    seo_keywords TEXT DEFAULT '',
    youtube_url TEXT DEFAULT '',
    description TEXT DEFAULT '',
    short_description TEXT DEFAULT '',
    long_description TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    requirement TEXT DEFAULT '',
    budget TEXT DEFAULT '',
    preferred_area TEXT DEFAULT '',
    property_type TEXT DEFAULT '',
    message TEXT DEFAULT '',
    lead_source TEXT DEFAULT 'Website Form',
    cta_source TEXT DEFAULT 'General Inquiry',
    page_name TEXT DEFAULT 'Home',
    button_source TEXT DEFAULT '',
    form_source TEXT DEFAULT '',
    property_source TEXT DEFAULT '',
    device_info TEXT DEFAULT '',
    traffic_source TEXT DEFAULT '',
    utm_source TEXT DEFAULT '',
    utm_medium TEXT DEFAULT '',
    utm_campaign TEXT DEFAULT '',
    utm_term TEXT DEFAULT '',
    utm_content TEXT DEFAULT '',
    timestamp TEXT,
    status TEXT DEFAULT 'New',
    notes TEXT DEFAULT '',
    assigned_to TEXT DEFAULT 'Unassigned',
    follow_up_date TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lead_history (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL,
    action TEXT NOT NULL,
    note TEXT DEFAULT '',
    performed_by TEXT DEFAULT 'Admin',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    time_ago TEXT DEFAULT 'Recently',
    content TEXT DEFAULT '',
    avatar_color TEXT DEFAULT '#c5a059',
    verified INTEGER DEFAULT 1,
    reviews_count TEXT DEFAULT '1 review',
    is_local_guide INTEGER DEFAULT 0,
    published INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hero_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    heading_part1 TEXT DEFAULT 'Navi Mumbai''s Most',
    heading_gold TEXT DEFAULT 'Trusted Luxury Real Estate',
    subtext TEXT DEFAULT '',
    keywords_json TEXT DEFAULT '[]',
    background_image TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.popup_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    title TEXT DEFAULT 'Get Best Offer & Instant Details',
    subtitle TEXT DEFAULT '',
    badge TEXT DEFAULT '',
    left_image TEXT DEFAULT '',
    privacy_text TEXT DEFAULT '',
    enabled INTEGER DEFAULT 1,
    trigger_delay INTEGER DEFAULT 3,
    scroll_trigger_percent INTEGER DEFAULT 25,
    redirect_url TEXT DEFAULT '',
    success_message TEXT DEFAULT 'Thank you! Our expert will contact you shortly.'
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    company_name TEXT DEFAULT 'Jayshree Realty',
    phone TEXT DEFAULT '+91 81690 05579',
    phone_raw TEXT DEFAULT '+918169005579',
    email TEXT DEFAULT 'jayshreerealty03@gmail.com',
    whatsapp TEXT DEFAULT '+91 81690 05579',
    whatsapp_raw TEXT DEFAULT '918169005579',
    address TEXT DEFAULT 'G-102, 1st Floor, Nerul Railway Station Complex, Nerul West, Navi Mumbai 400706',
    google_maps_embed_url TEXT DEFAULT '',
    logo_url TEXT DEFAULT '/assets/jayshree-realty-logo.png',
    favicon_url TEXT DEFAULT '/favicon.ico',
    facebook_url TEXT DEFAULT '',
    instagram_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    youtube_url TEXT DEFAULT '',
    seo_title_default TEXT DEFAULT 'Jayshree Realty | Premium Luxury Real Estate Consultancy Navi Mumbai',
    seo_description_default TEXT DEFAULT '',
    seo_keywords_default TEXT DEFAULT '',
    ga_measurement_id TEXT DEFAULT '',
    gtm_container_id TEXT DEFAULT '',
    gsc_verification_meta TEXT DEFAULT '',
    robots_txt_content TEXT DEFAULT '',
    sitemap_auto_generate INTEGER DEFAULT 1,
    smtp_host TEXT DEFAULT 'smtp.hostinger.com',
    smtp_port TEXT DEFAULT '465',
    smtp_user TEXT DEFAULT 'info@jayshreerealty.com',
    smtp_from_email TEXT DEFAULT 'info@jayshreerealty.com',
    maintenance_mode INTEGER DEFAULT 0,
    maintenance_message TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.counters (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    value INTEGER NOT NULL DEFAULT 0,
    suffix TEXT DEFAULT '+',
    icon_name TEXT DEFAULT 'Building2',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.location_nodes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    active_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    page_path TEXT DEFAULT '/',
    page_title TEXT DEFAULT '',
    property_id TEXT,
    referrer TEXT DEFAULT 'Direct',
    device_type TEXT DEFAULT 'Desktop',
    browser TEXT DEFAULT 'Chrome',
    os TEXT DEFAULT 'Windows',
    ip_address TEXT DEFAULT '',
    country TEXT DEFAULT '',
    city TEXT DEFAULT '',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.visitor_sessions (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    is_returning INTEGER DEFAULT 0,
    page_views_count INTEGER DEFAULT 1,
    lead_id TEXT
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    user_name TEXT NOT NULL DEFAULT 'Admin',
    action TEXT NOT NULL,
    details TEXT DEFAULT '',
    ip_address TEXT DEFAULT '',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- STEP 2: SAFE COLUMN MIGRATIONS (ADD COLUMN IF NOT EXISTS)
-- These will not fail if columns already exist
-- ================================================================

-- leads: Attribution columns (added in v2.1)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS button_source TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS form_source TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS property_source TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS device_info TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS traffic_source TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_source TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_medium TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_term TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_content TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assigned_to TEXT DEFAULT 'Unassigned';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS follow_up_date TEXT DEFAULT '';

-- properties: Extended fields (added in v2.0)
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS long_description TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS builder_name TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS builder_experience TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS amenities_json TEXT DEFAULT '[]';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS seo_title TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS seo_description TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS seo_keywords TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS placements_json TEXT DEFAULT '["buy"]';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS brochure_url TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS floor_plan_url TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS code TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS highlights TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS brokerage TEXT DEFAULT '';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS brokerage_free INTEGER DEFAULT 0;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS archived INTEGER DEFAULT 0;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS gallery_images_json TEXT DEFAULT '[]';

-- site_settings: Hostinger SMTP fields
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS google_maps_embed_url TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS ga_measurement_id TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gtm_container_id TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gsc_verification_meta TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS robots_txt_content TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS sitemap_auto_generate INTEGER DEFAULT 1;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS maintenance_mode INTEGER DEFAULT 0;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS maintenance_message TEXT DEFAULT '';

-- ================================================================
-- STEP 3: PERFORMANCE INDEXES (safe, IF NOT EXISTS)
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_properties_category  ON public.properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_featured   ON public.properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_published  ON public.properties(published);
CREATE INDEX IF NOT EXISTS idx_properties_archived   ON public.properties(archived);
CREATE INDEX IF NOT EXISTS idx_properties_slug       ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_leads_created_at      ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status          ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_phone           ON public.leads(phone);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp   ON public.analytics_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor     ON public.analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_session     ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_reviews_published     ON public.reviews(published);
CREATE INDEX IF NOT EXISTS idx_lead_history_lead_id  ON public.lead_history(lead_id);

-- ================================================================
-- STEP 4: ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE public.admin_users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_history     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popup_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counters         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_nodes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs    ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies (idempotent re-run safe)
DO $$ DECLARE pol RECORD; BEGIN
  FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- Service role: Full access (Node.js backend)
CREATE POLICY "service_role_admin_users"    ON public.admin_users    FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_properties"     ON public.properties     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_leads"          ON public.leads          FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_lead_history"   ON public.lead_history   FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_categories"     ON public.categories     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_reviews"        ON public.reviews        FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_hero"           ON public.hero_settings  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_popup"          ON public.popup_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_site"           ON public.site_settings  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_counters"       ON public.counters       FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_locations"      ON public.location_nodes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_analytics"      ON public.analytics_events FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_sessions"       ON public.visitor_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_activity"       ON public.activity_logs  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Anonymous: Read published content
CREATE POLICY "anon_read_properties"  ON public.properties     FOR SELECT TO anon USING (published = 1 AND archived = 0);
CREATE POLICY "anon_read_reviews"     ON public.reviews        FOR SELECT TO anon USING (published = 1);
CREATE POLICY "anon_read_categories"  ON public.categories     FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_locations"   ON public.location_nodes FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_counters"    ON public.counters       FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_hero"        ON public.hero_settings  FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_popup"       ON public.popup_settings FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_site"        ON public.site_settings  FOR SELECT TO anon USING (true);

-- Anonymous: Write (form submissions & tracking)
CREATE POLICY "anon_insert_leads"     ON public.leads          FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_insert_analytics" ON public.analytics_events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_upsert_sessions"  ON public.visitor_sessions FOR ALL    TO anon USING (true) WITH CHECK (true);

-- ================================================================
-- STEP 5: DEFAULT DATA SEEDING (safe, INSERT ... WHERE NOT EXISTS)
-- ================================================================

-- Hero Settings
INSERT INTO public.hero_settings (id, heading_part1, heading_gold, subtext, keywords_json, background_image)
SELECT 1, 'Navi Mumbai''s Most', 'Trusted Luxury Real Estate',
  'Experience transparent property buying with verified CIDCO plots, direct developer launches, and prime resale homes across Nerul, Seawoods, Kharghar, Ulwe, Pushpak Nagar & Panvel.',
  '["Premium Projects","Buy Property","Sell Property","Verified Properties","Navi Mumbai","Luxury Homes"]',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000'
WHERE NOT EXISTS (SELECT 1 FROM public.hero_settings WHERE id = 1);

-- Popup Settings
INSERT INTO public.popup_settings (id, title, subtitle, badge, left_image, privacy_text, enabled, trigger_delay, scroll_trigger_percent, redirect_url, success_message)
SELECT 1, 'Get Best Offer & Instant Details',
  'Register now for exclusive launch pricing, priority site visits & floor plans.',
  'Exclusive Launch Pricing',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
  'We respect your privacy. No spam, ever.',
  1, 3, 25, '', 'Thank you! Our luxury real estate expert will contact you shortly.'
WHERE NOT EXISTS (SELECT 1 FROM public.popup_settings WHERE id = 1);

-- Site Settings
INSERT INTO public.site_settings (
  id, company_name, phone, phone_raw, email, whatsapp, whatsapp_raw, address,
  logo_url, favicon_url, facebook_url, instagram_url, linkedin_url, youtube_url,
  seo_title_default, seo_description_default, seo_keywords_default,
  smtp_host, smtp_port, smtp_user, smtp_from_email,
  robots_txt_content, sitemap_auto_generate, maintenance_mode, maintenance_message,
  google_maps_embed_url, ga_measurement_id, gtm_container_id, gsc_verification_meta
)
SELECT 1, 'Jayshree Realty', '+91 81690 05579', '+918169005579', 'jayshreerealty03@gmail.com',
  '+91 81690 05579', '918169005579',
  'G-102, 1st Floor, Nerul Railway Station Complex, Nerul West, Navi Mumbai 400706',
  '/assets/jayshree-realty-logo.png', '/favicon.ico',
  'https://facebook.com/jayshreerealty', 'https://instagram.com/jayshreerealty',
  'https://linkedin.com/company/jayshreerealty', 'https://youtube.com/@jayshreerealty',
  'Jayshree Realty | Premium Luxury Real Estate Consultancy Navi Mumbai',
  'Navi Mumbai premier luxury real estate consultancy. Verified CIDCO plot projects, luxury residential towers & commercial spaces in Nerul, Seawoods, Kharghar & Ulwe.',
  'Navi Mumbai Real Estate, Nerul Flat Sale, Kharghar New Launch, Seawoods Luxury Flat, Pushpak Nagar CIDCO Plot, Jayshree Realty',
  'smtp.hostinger.com', '465', 'info@jayshreerealty.com', 'info@jayshreerealty.com',
  E'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://jayshreerealty.com/sitemap.xml',
  1, 0, 'We will be back shortly.', '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE id = 1);

-- Counters
INSERT INTO public.counters (id, label, value, suffix, icon_name, sort_order)
SELECT 'cnt-1', 'Happy Families', 450, '+', 'Users', 0 WHERE NOT EXISTS (SELECT 1 FROM public.counters WHERE id = 'cnt-1');
INSERT INTO public.counters (id, label, value, suffix, icon_name, sort_order)
SELECT 'cnt-2', 'Projects Delivered', 85, '+', 'Building2', 1 WHERE NOT EXISTS (SELECT 1 FROM public.counters WHERE id = 'cnt-2');
INSERT INTO public.counters (id, label, value, suffix, icon_name, sort_order)
SELECT 'cnt-3', 'Years Experience', 25, '+', 'Award', 2 WHERE NOT EXISTS (SELECT 1 FROM public.counters WHERE id = 'cnt-3');
INSERT INTO public.counters (id, label, value, suffix, icon_name, sort_order)
SELECT 'cnt-4', 'Sq.Ft. Managed', 2, 'M+', 'TrendingUp', 3 WHERE NOT EXISTS (SELECT 1 FROM public.counters WHERE id = 'cnt-4');

-- Location Nodes
INSERT INTO public.location_nodes (id, name, description, active_count, sort_order)
SELECT 'loc-1', 'Kharghar', 'Central Park, Golf Course, & Metro Hub', 12, 0 WHERE NOT EXISTS (SELECT 1 FROM public.location_nodes WHERE id = 'loc-1');
INSERT INTO public.location_nodes (id, name, description, active_count, sort_order)
SELECT 'loc-2', 'Nerul & Seawoods', 'Grand Central Mall & Palm Beach Road', 14, 1 WHERE NOT EXISTS (SELECT 1 FROM public.location_nodes WHERE id = 'loc-2');
INSERT INTO public.location_nodes (id, name, description, active_count, sort_order)
SELECT 'loc-3', 'Ulwe', 'Near Atal Setu MTHL & Coastal Highway', 8, 2 WHERE NOT EXISTS (SELECT 1 FROM public.location_nodes WHERE id = 'loc-3');
INSERT INTO public.location_nodes (id, name, description, active_count, sort_order)
SELECT 'loc-4', 'Pushpak Nagar', 'Navi Mumbai International Airport Node', 6, 3 WHERE NOT EXISTS (SELECT 1 FROM public.location_nodes WHERE id = 'loc-4');
INSERT INTO public.location_nodes (id, name, description, active_count, sort_order)
SELECT 'loc-5', 'Panvel', 'Mega Township & Railway Junction', 4, 4 WHERE NOT EXISTS (SELECT 1 FROM public.location_nodes WHERE id = 'loc-5');

-- Categories (20 default)
INSERT INTO public.categories (id, name, sort_order)
SELECT id, name, sort_order FROM (VALUES
  ('cat-1','Kharghar New Projects',0), ('cat-2','Upper Kharghar',1),
  ('cat-3','Ulwe New Projects',2), ('cat-4','Pushpak Nagar New Projects',3),
  ('cat-5','Nerul & Seawoods New Projects',4), ('cat-6','Juinagar & Sanpada New Projects',5),
  ('cat-7','Panvel',6), ('cat-8','Khandeshwar / Kamothe',7),
  ('cat-9','Resale',8), ('cat-10','Commercial Workspaces',9),
  ('cat-11','1 BHK Nerul East',10), ('cat-12','1 BHK Nerul West',11),
  ('cat-13','1 BHK Seawoods East',12), ('cat-14','1 BHK Seawoods West',13),
  ('cat-15','2 BHK Nerul East',14), ('cat-16','2 BHK Nerul West',15),
  ('cat-17','2 BHK Seawoods East',16), ('cat-18','2 BHK Seawoods West',17),
  ('cat-19','3/4 BHK',18), ('cat-20','Row House',19)
) AS v(id,name,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE categories.id = v.id);

-- Reviews (10 real Google reviews)
INSERT INTO public.reviews (id, author, rating, time_ago, content, avatar_color, verified, reviews_count, is_local_guide, published, sort_order)
SELECT id, author, rating, time_ago, content, avatar_color, 1, reviews_count, is_local_guide::int, 1, sort_order FROM (VALUES
  ('rev-1','Namita Pingulkar',5,'11 months ago','Great experience working with Jayshree Realty. They were professional, knowledgeable, and always responsive to my questions. The property listings were accurate and well-presented, and the entire process from viewing to paperwork was smooth.','#8E24AA','1 review',false,0),
  ('rev-2','Mrunmai Palav',5,'5 years ago','It''s a nice responsive and very helping company. Helps properly and shows us the perfect place as soon as possible. Especially I met one of the staff member, named Abhishek Padwal and he is very nice. Provides all details properly and gives good options.','#E91E63','3 reviews',false,1),
  ('rev-3','Satish Gamare',5,'4 years ago','It''s a nice responsive and very helping Company. Good service provided by the firm. Very helpful & loyal team. Must Recommended to get work done from this firm.','#3F51B5','11 reviews',false,2),
  ('rev-4','Dheeresh Bangera',5,'3 years ago','The team is young, very polite and co-operate. Their service is very good and turn around time is quick. One of the best agency to deal.','#009688','2 reviews',false,3),
  ('rev-5','Prashant Mirashi',5,'5 years ago','Good service provided by the firm. Very helpful & loyal team. Must recommended to get work done from this firm.','#FF5722','3 reviews • 6 photos',false,4),
  ('rev-6','Pradeep Kumbhar',5,'1 year ago','Great service and good response by Sunil. Great and very loyal team.','#00BCD4','4 reviews',false,5),
  ('rev-7','Asif Shaikh',5,'1 year ago','Sir our last visit was great and your executive person was excellent and guided well. Even Transport facility was provided for property visits.','#4CAF50','15 reviews',true,6),
  ('rev-8','Priyanka Devkar',5,'2 years ago','We were searching home from last 7 months & Jayshree Enterprises gave us the exact property which we needed. Thank you.','#FF9800','3 reviews',false,7),
  ('rev-9','Sunil R. Patil',5,'8 months ago','Best real estate consultant in Nerul and Navi Mumbai. Very transparent dealing and zero hassle paperwork support.','#673AB7','5 reviews',false,8),
  ('rev-10','Anand Gawde',5,'1 year ago','Extremely professional real estate advisors. Guided me to buy 2 BHK in Seawoods at best market rate.','#2196F3','7 reviews',false,9)
) AS v(id,author,rating,time_ago,content,avatar_color,reviews_count,is_local_guide,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.reviews WHERE reviews.id = v.id);

-- Admin User (bcrypt hash for: jayshreerealty@8989)
-- NOTE: The db-audit.mjs script will upsert this with a fresh hash from bcrypt.
-- This is a valid bcrypt hash for the password "jayshreerealty@8989"
INSERT INTO public.admin_users (id, username, password_hash, role)
SELECT 'admin-1', 'admin@jayshreerealty',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'super_admin'
WHERE NOT EXISTS (SELECT 1 FROM public.admin_users WHERE username = 'admin@jayshreerealty');

-- ================================================================
-- STEP 6: VERIFICATION
-- ================================================================
DO $$
DECLARE
  tbl_count INTEGER;
  col_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO tbl_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN (
    'admin_users','properties','leads','categories','reviews',
    'hero_settings','popup_settings','site_settings','counters',
    'location_nodes','analytics_events','visitor_sessions',
    'activity_logs','lead_history'
  );

  -- Check attribution columns exist
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'leads'
  AND column_name IN (
    'button_source','form_source','property_source','device_info',
    'traffic_source','utm_source','utm_medium','utm_campaign','utm_term','utm_content'
  );

  RAISE NOTICE '══════════════════════════════════════════════════════';
  RAISE NOTICE 'Jayshree Realty DB Sync Complete!';
  RAISE NOTICE 'Tables verified: % / 14', tbl_count;
  RAISE NOTICE 'Lead attribution columns: % / 10', col_count;
  RAISE NOTICE 'Admin login: admin@jayshreerealty';
  RAISE NOTICE 'Password:    jayshreerealty@8989';
  RAISE NOTICE '══════════════════════════════════════════════════════';
END $$;
