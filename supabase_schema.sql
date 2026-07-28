-- ==============================================================================
-- JAYSHREE REALTY - SUPABASE PRODUCTION DATABASE SCHEMA & RLS SECURITY POLICIES
-- ==============================================================================

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
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
    youtube_url TEXT,
    description TEXT,
    short_description TEXT,
    long_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Lead History Table
CREATE TABLE IF NOT EXISTS public.lead_history (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    note TEXT,
    performed_by TEXT DEFAULT 'Admin',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- 6. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Hero Settings Table
CREATE TABLE IF NOT EXISTS public.hero_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    heading_part1 TEXT,
    heading_gold TEXT,
    subtext TEXT,
    keywords_json TEXT,
    background_image TEXT
);

-- 8. Popup Settings Table
CREATE TABLE IF NOT EXISTS public.popup_settings (
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
);

-- 9. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
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
);

-- 10. Counters Table
CREATE TABLE IF NOT EXISTS public.counters (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    value INTEGER NOT NULL,
    suffix TEXT,
    icon_name TEXT,
    sort_order INTEGER DEFAULT 0
);

-- 11. Location Nodes Table
CREATE TABLE IF NOT EXISTS public.location_nodes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    active_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0
);

-- 12. Analytics Events Table
CREATE TABLE IF NOT EXISTS public.analytics_events (
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
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Visitor Sessions Table
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

-- 14. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Optimal Performance
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_published ON public.properties(published);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON public.analytics_events(timestamp DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popup_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies (Allow non-authenticated users to view website content)
CREATE POLICY "Public Read Properties" ON public.properties FOR SELECT USING (published = 1 AND archived = 0);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (published = 1);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Public Read Counters" ON public.counters FOR SELECT USING (true);
CREATE POLICY "Public Read Hero Settings" ON public.hero_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Popup Settings" ON public.popup_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);

-- Lead Submission Policy (Allow anyone to submit forms)
CREATE POLICY "Public Lead Insertion" ON public.leads FOR INSERT WITH CHECK (true);

-- Admin / Service Role Full CRUD Policies
CREATE POLICY "Admin All Properties" ON public.properties FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Reviews" ON public.reviews FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Locations" ON public.location_nodes FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Counters" ON public.counters FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Hero Settings" ON public.hero_settings FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Popup Settings" ON public.popup_settings FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Site Settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Leads" ON public.leads FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Users" ON public.admin_users FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
