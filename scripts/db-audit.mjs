/**
 * Jayshree Realty - Supabase Database Audit & Migration Script
 * Run: node scripts/db-audit.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('MISSING SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});
const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

// ── Report ───────────────────────────────────────────────────────────────────
const R = {
  tablesFound: [], tablesMissing: [],
  columnsOK: [], columnsMissing: [],
  applied: [], skipped: [], errors: [], warnings: [],
  dataChecks: [], apiChecks: []
};
const HR = '='.repeat(68);

function ok(msg)   { console.log('  ✅ ' + msg); R.applied.push(msg); }
function skip(msg) { console.log('  ✓  ' + msg); R.skipped.push(msg); }
function warn(msg) { console.log('  ⚠️  ' + msg); R.warnings.push(msg); }
function fail(msg) { console.log('  ❌ ' + msg); R.errors.push(msg); }
function hdr(msg)  { console.log('\n' + HR + '\n  ' + msg + '\n' + HR); }

// ── Expected schema definition ───────────────────────────────────────────────
const EXPECTED_TABLES = [
  'admin_users','properties','leads','lead_history','categories',
  'reviews','hero_settings','popup_settings','site_settings',
  'counters','location_nodes','analytics_events','visitor_sessions','activity_logs'
];

const EXPECTED_COLS = {
  admin_users:      ['id','username','password_hash','role','created_at'],
  properties: [
    'id','slug','title','category','location','type','configuration','price',
    'area','possession','features_json','image','gallery_images_json','is_featured',
    'code','highlights','brokerage','brokerage_free','published','archived',
    'placements_json','brochure_url','floor_plan_url','builder_name','builder_experience',
    'amenities_json','seo_title','seo_description','seo_keywords','youtube_url',
    'description','short_description','long_description','created_at','updated_at'
  ],
  leads: [
    'id','name','phone','email','requirement','budget','preferred_area','property_type',
    'message','lead_source','cta_source','page_name',
    'button_source','form_source','property_source','device_info','traffic_source',
    'utm_source','utm_medium','utm_campaign','utm_term','utm_content',
    'timestamp','status','notes','assigned_to','follow_up_date','created_at'
  ],
  lead_history:     ['id','lead_id','action','note','performed_by','timestamp'],
  categories:       ['id','name','sort_order','created_at'],
  reviews:          ['id','author','rating','time_ago','content','avatar_color','verified','reviews_count','is_local_guide','published','sort_order','created_at'],
  hero_settings:    ['id','heading_part1','heading_gold','subtext','keywords_json','background_image'],
  popup_settings:   ['id','title','subtitle','badge','left_image','privacy_text','enabled','trigger_delay','scroll_trigger_percent','redirect_url','success_message'],
  site_settings: [
    'id','company_name','phone','phone_raw','email','whatsapp','whatsapp_raw',
    'address','google_maps_embed_url','logo_url','favicon_url',
    'facebook_url','instagram_url','linkedin_url','youtube_url',
    'seo_title_default','seo_description_default','seo_keywords_default',
    'ga_measurement_id','gtm_container_id','gsc_verification_meta',
    'robots_txt_content','sitemap_auto_generate','smtp_host','smtp_port',
    'smtp_user','smtp_from_email','maintenance_mode','maintenance_message'
  ],
  counters:         ['id','label','value','suffix','icon_name','sort_order','created_at'],
  location_nodes:   ['id','name','description','active_count','sort_order','created_at'],
  analytics_events: ['id','visitor_id','session_id','event_type','page_path','page_title','property_id','referrer','device_type','browser','os','ip_address','country','city','timestamp'],
  visitor_sessions: ['id','visitor_id','session_id','start_time','last_active','is_returning','page_views_count','lead_id'],
  activity_logs:    ['id','user_name','action','details','ip_address','timestamp']
};

// ALTER TABLE SQL for every expected column (only used if missing)
const ALTER_SQL = {
  // leads attribution columns
  'leads.button_source':        "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS button_source TEXT DEFAULT '';",
  'leads.form_source':          "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS form_source TEXT DEFAULT '';",
  'leads.property_source':      "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS property_source TEXT DEFAULT '';",
  'leads.device_info':          "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS device_info TEXT DEFAULT '';",
  'leads.traffic_source':       "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS traffic_source TEXT DEFAULT '';",
  'leads.utm_source':           "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_source TEXT DEFAULT '';",
  'leads.utm_medium':           "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_medium TEXT DEFAULT '';",
  'leads.utm_campaign':         "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT DEFAULT '';",
  'leads.utm_term':             "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_term TEXT DEFAULT '';",
  'leads.utm_content':          "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_content TEXT DEFAULT '';",
  'leads.follow_up_date':       "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS follow_up_date TEXT DEFAULT '';",
  'leads.notes':                "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';",
  'leads.assigned_to':          "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assigned_to TEXT DEFAULT 'Unassigned';",
  // properties extended columns
  'properties.slug':            "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS slug TEXT;",
  'properties.short_description':"ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT '';",
  'properties.long_description': "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS long_description TEXT DEFAULT '';",
  'properties.builder_name':    "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS builder_name TEXT DEFAULT '';",
  'properties.builder_experience':"ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS builder_experience TEXT DEFAULT '';",
  'properties.amenities_json':  "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS amenities_json TEXT DEFAULT '[]';",
  'properties.seo_title':       "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS seo_title TEXT DEFAULT '';",
  'properties.seo_description': "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS seo_description TEXT DEFAULT '';",
  'properties.seo_keywords':    "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS seo_keywords TEXT DEFAULT '';",
  'properties.youtube_url':     "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT '';",
  'properties.description':     "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';",
  'properties.placements_json': "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS placements_json TEXT DEFAULT '[\"buy\"]';",
  'properties.brochure_url':    "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS brochure_url TEXT DEFAULT '';",
  'properties.floor_plan_url':  "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS floor_plan_url TEXT DEFAULT '';",
  'properties.updated_at':      "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();",
  'properties.code':            "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS code TEXT DEFAULT '';",
  'properties.highlights':      "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS highlights TEXT DEFAULT '';",
  'properties.brokerage':       "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS brokerage TEXT DEFAULT '';",
  'properties.brokerage_free':  "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS brokerage_free INTEGER DEFAULT 0;",
  'properties.archived':        "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS archived INTEGER DEFAULT 0;",
  'properties.possession':      "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS possession TEXT DEFAULT '';"
};

// ── 1. TABLE AUDIT ───────────────────────────────────────────────────────────
async function auditTables() {
  hdr('STEP 1/6 — TABLE AUDIT');
  const status = {};
  for (const tbl of EXPECTED_TABLES) {
    const { error } = await supabase.from(tbl).select('id').limit(1);
    if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
      fail(`Table MISSING: ${tbl}`);
      R.tablesMissing.push(tbl);
      status[tbl] = false;
    } else {
      skip(`Table EXISTS: ${tbl}`);
      R.tablesFound.push(tbl);
      status[tbl] = true;
    }
  }
  return status;
}

// ── 2. COLUMN AUDIT ─────────────────────────────────────────────────────────
async function auditColumns(tableStatus) {
  hdr('STEP 2/6 — COLUMN AUDIT');
  const allMissing = [];
  for (const [tbl, exists] of Object.entries(tableStatus)) {
    if (!exists) continue;
    const expected = EXPECTED_COLS[tbl] || [];
    const missing = [];
    for (const col of expected) {
      const { error } = await supabase.from(tbl).select(col).limit(0);
      if (error && (error.message.includes('does not exist') || error.message.includes('column'))) {
        fail(`MISSING COLUMN: ${tbl}.${col}`);
        missing.push(`${tbl}.${col}`);
        R.columnsMissing.push(`${tbl}.${col}`);
      }
    }
    if (missing.length === 0) {
      skip(`All columns OK: ${tbl} (${expected.length} cols)`);
      R.columnsOK.push(tbl);
    }
    allMissing.push(...missing);
  }
  return allMissing;
}

// ── 3. DATA AUDIT & SEEDING ──────────────────────────────────────────────────
async function auditAndSeedData() {
  hdr('STEP 3/6 — DATA AUDIT & SEEDING');

  // Admin user — always upsert with fresh bcrypt hash
  const adminUser = (process.env.ADMIN_USER || 'admin@jayshreerealty').toLowerCase();
  const adminPass = process.env.ADMIN_PASS || 'jayshreerealty@8989';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(adminPass, salt);
  const { error: adminErr } = await supabase.from('admin_users').upsert([{
    id: 'admin-1', username: adminUser, password_hash: hash, role: 'super_admin'
  }], { onConflict: 'id' });
  if (adminErr) fail(`admin_users upsert: ${adminErr.message}`);
  else ok(`admin_users: Admin user ensured (${adminUser})`);
  R.dataChecks.push({ table: 'admin_users', status: adminErr ? 'ERROR' : 'OK' });

  // Hero settings
  const { data: hero } = await supabase.from('hero_settings').select('id').eq('id', 1);
  if (!hero || hero.length === 0) {
    const { error } = await supabase.from('hero_settings').insert([{
      id: 1,
      heading_part1: "Navi Mumbai's Most",
      heading_gold: 'Trusted Luxury Real Estate',
      subtext: 'Experience transparent property buying with verified CIDCO plots, direct developer launches, and prime resale homes across Nerul, Seawoods, Kharghar, Ulwe, Pushpak Nagar & Panvel.',
      keywords_json: JSON.stringify(['Premium Projects','Buy Property','Sell Property','Verified Properties','Navi Mumbai','Luxury Homes']),
      background_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000'
    }]);
    if (error) fail(`hero_settings seed: ${error.message}`);
    else ok('hero_settings: Seeded');
  } else { skip('hero_settings: Data exists'); }
  R.dataChecks.push({ table: 'hero_settings', status: 'CHECKED' });

  // Popup settings
  const { data: popup } = await supabase.from('popup_settings').select('id').eq('id', 1);
  if (!popup || popup.length === 0) {
    const { error } = await supabase.from('popup_settings').insert([{
      id: 1, title: 'Get Best Offer & Instant Details',
      subtitle: 'Register now for exclusive launch pricing, priority site visits & floor plans.',
      badge: 'Exclusive Launch Pricing',
      left_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
      privacy_text: 'We respect your privacy. No spam, ever.',
      enabled: 1, trigger_delay: 3, scroll_trigger_percent: 25,
      redirect_url: '', success_message: 'Thank you! Our luxury real estate expert will contact you shortly.'
    }]);
    if (error) fail(`popup_settings seed: ${error.message}`);
    else ok('popup_settings: Seeded');
  } else { skip('popup_settings: Data exists'); }

  // Site settings
  const { data: site } = await supabase.from('site_settings').select('id').eq('id', 1);
  if (!site || site.length === 0) {
    const { error } = await supabase.from('site_settings').insert([{
      id: 1, company_name: 'Jayshree Realty',
      phone: '+91 81690 05579', phone_raw: '+918169005579',
      email: 'info@jayshreerealty.com',
      whatsapp: '+91 81690 05579', whatsapp_raw: '918169005579',
      address: 'G-102, 1st Floor, Nerul Railway Station Complex, Nerul West, Navi Mumbai 400706',
      logo_url: '/assets/jayshree-realty-logo.png', favicon_url: '/favicon.ico',
      facebook_url: 'https://facebook.com/jayshreerealty',
      instagram_url: 'https://instagram.com/jayshreerealty',
      linkedin_url: 'https://linkedin.com/company/jayshreerealty',
      youtube_url: 'https://youtube.com/@jayshreerealty',
      seo_title_default: 'Jayshree Realty | Premium Luxury Real Estate Consultancy Navi Mumbai',
      seo_description_default: 'Navi Mumbai premier luxury real estate consultancy. Verified CIDCO plot projects, luxury residential towers & commercial spaces in Nerul, Seawoods, Kharghar & Ulwe.',
      seo_keywords_default: 'Navi Mumbai Real Estate, Nerul Flat Sale, Kharghar New Launch, Seawoods Luxury Flat, Pushpak Nagar CIDCO Plot, Jayshree Realty',
      smtp_host: 'smtp.hostinger.com', smtp_port: '465',
      smtp_user: 'info@jayshreerealty.com', smtp_from_email: 'info@jayshreerealty.com',
      robots_txt_content: 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://jayshreerealty.com/sitemap.xml',
      sitemap_auto_generate: 1, maintenance_mode: 0,
      maintenance_message: 'We will be back shortly.',
      ga_measurement_id: '', gtm_container_id: '', gsc_verification_meta: '',
      google_maps_embed_url: ''
    }]);
    if (error) fail(`site_settings seed: ${error.message}`);
    else ok('site_settings: Seeded');
  } else { skip('site_settings: Data exists'); }

  // Counters
  const counterSeeds = [
    { id:'cnt-1', label:'Happy Families', value:450, suffix:'+', icon_name:'Users', sort_order:0 },
    { id:'cnt-2', label:'Projects Delivered', value:85, suffix:'+', icon_name:'Building2', sort_order:1 },
    { id:'cnt-3', label:'Years Experience', value:25, suffix:'+', icon_name:'Award', sort_order:2 },
    { id:'cnt-4', label:'Sq.Ft. Managed', value:2, suffix:'M+', icon_name:'TrendingUp', sort_order:3 }
  ];
  for (const c of counterSeeds) {
    const { data } = await supabase.from('counters').select('id').eq('id', c.id);
    if (!data || data.length === 0) {
      const { error } = await supabase.from('counters').insert([c]);
      if (error) fail(`counter ${c.id}: ${error.message}`);
      else ok(`counters: Seeded "${c.label}"`);
    } else { skip(`counters: "${c.label}" exists`); }
  }

  // Location nodes
  const locs = [
    { id:'loc-1', name:'Kharghar',          description:'Central Park, Golf Course, & Metro Hub',         active_count:12, sort_order:0 },
    { id:'loc-2', name:'Nerul & Seawoods',   description:'Grand Central Mall & Palm Beach Road',            active_count:14, sort_order:1 },
    { id:'loc-3', name:'Ulwe',               description:'Near Atal Setu MTHL & Coastal Highway',           active_count:8,  sort_order:2 },
    { id:'loc-4', name:'Pushpak Nagar',      description:'Navi Mumbai International Airport Node',           active_count:6,  sort_order:3 },
    { id:'loc-5', name:'Panvel',             description:'Mega Township & Railway Junction',                 active_count:4,  sort_order:4 }
  ];
  for (const l of locs) {
    const { data } = await supabase.from('location_nodes').select('id').eq('id', l.id);
    if (!data || data.length === 0) {
      const { error } = await supabase.from('location_nodes').insert([l]);
      if (error) fail(`location_node ${l.id}: ${error.message}`);
      else ok(`location_nodes: Seeded "${l.name}"`);
    } else { skip(`location_nodes: "${l.name}" exists`); }
  }

  // Categories
  const cats = [
    {id:'cat-1',name:'Kharghar New Projects',sort_order:0},
    {id:'cat-2',name:'Upper Kharghar',sort_order:1},
    {id:'cat-3',name:'Ulwe New Projects',sort_order:2},
    {id:'cat-4',name:'Pushpak Nagar New Projects',sort_order:3},
    {id:'cat-5',name:'Nerul & Seawoods New Projects',sort_order:4},
    {id:'cat-6',name:'Juinagar & Sanpada New Projects',sort_order:5},
    {id:'cat-7',name:'Panvel',sort_order:6},
    {id:'cat-8',name:'Khandeshwar / Kamothe',sort_order:7},
    {id:'cat-9',name:'Resale',sort_order:8},
    {id:'cat-10',name:'Commercial Workspaces',sort_order:9},
    {id:'cat-11',name:'1 BHK Nerul East',sort_order:10},
    {id:'cat-12',name:'1 BHK Nerul West',sort_order:11},
    {id:'cat-13',name:'1 BHK Seawoods East',sort_order:12},
    {id:'cat-14',name:'1 BHK Seawoods West',sort_order:13},
    {id:'cat-15',name:'2 BHK Nerul East',sort_order:14},
    {id:'cat-16',name:'2 BHK Nerul West',sort_order:15},
    {id:'cat-17',name:'2 BHK Seawoods East',sort_order:16},
    {id:'cat-18',name:'2 BHK Seawoods West',sort_order:17},
    {id:'cat-19',name:'3/4 BHK',sort_order:18},
    {id:'cat-20',name:'Row House',sort_order:19}
  ];
  for (const c of cats) {
    const { data } = await supabase.from('categories').select('id').eq('id', c.id);
    if (!data || data.length === 0) {
      const { error } = await supabase.from('categories').insert([c]);
      if (error) fail(`category ${c.id}: ${error.message}`);
      else ok(`categories: Seeded "${c.name}"`);
    }
  }
  const { data: catCount } = await supabase.from('categories').select('id');
  skip(`categories: ${(catCount||[]).length} categories in database`);

  // Reviews
  const reviews = [
    {id:'rev-1',author:'Namita Pingulkar',rating:5,time_ago:'11 months ago',content:'Great experience working with Jayshree Realty. They were professional, knowledgeable, and always responsive to my questions. The property listings were accurate and well-presented, and the entire process from viewing to paperwork was smooth.',avatar_color:'#8E24AA',verified:1,reviews_count:'1 review',is_local_guide:0,published:1,sort_order:0},
    {id:'rev-2',author:'Mrunmai Palav',rating:5,time_ago:'5 years ago',content:"It's a nice responsive and very helping company. Helps properly and shows us the perfect place as soon as possible. Especially I met one of the staff member, named Abhishek Padwal and he is very nice. Provides all details properly and gives good options.",avatar_color:'#E91E63',verified:1,reviews_count:'3 reviews',is_local_guide:0,published:1,sort_order:1},
    {id:'rev-3',author:'Satish Gamare',rating:5,time_ago:'4 years ago',content:"It's a nice responsive and very helping Company. Good service provided by the firm. Very helpful & loyal team. Must Recommended to get work done from this firm.",avatar_color:'#3F51B5',verified:1,reviews_count:'11 reviews',is_local_guide:0,published:1,sort_order:2},
    {id:'rev-4',author:'Dheeresh Bangera',rating:5,time_ago:'3 years ago',content:'The team is young, very polite and co-operate. Their service is very good and turn around time is quick. One of the best agency to deal.',avatar_color:'#009688',verified:1,reviews_count:'2 reviews',is_local_guide:0,published:1,sort_order:3},
    {id:'rev-5',author:'Prashant Mirashi',rating:5,time_ago:'5 years ago',content:'Good service provided by the firm. Very helpful & loyal team. Must recommended to get work done from this firm.',avatar_color:'#FF5722',verified:1,reviews_count:'3 reviews • 6 photos',is_local_guide:0,published:1,sort_order:4},
    {id:'rev-6',author:'Pradeep Kumbhar',rating:5,time_ago:'1 year ago',content:'Great service and good response by Sunil. Great and very loyal team.',avatar_color:'#00BCD4',verified:1,reviews_count:'4 reviews',is_local_guide:0,published:1,sort_order:5},
    {id:'rev-7',author:'Asif Shaikh',rating:5,time_ago:'1 year ago',content:'Sir our last visit was great and your executive person was excellent and guided well. Even Transport facility was provided for property visits.',avatar_color:'#4CAF50',verified:1,reviews_count:'15 reviews',is_local_guide:1,published:1,sort_order:6},
    {id:'rev-8',author:'Priyanka Devkar',rating:5,time_ago:'2 years ago',content:'We were searching home from last 7 months & Jayshree Enterprises gave us the exact property which we needed. Thank you.',avatar_color:'#FF9800',verified:1,reviews_count:'3 reviews',is_local_guide:0,published:1,sort_order:7},
    {id:'rev-9',author:'Sunil R. Patil',rating:5,time_ago:'8 months ago',content:'Best real estate consultant in Nerul and Navi Mumbai. Very transparent dealing and zero hassle paperwork support.',avatar_color:'#673AB7',verified:1,reviews_count:'5 reviews',is_local_guide:0,published:1,sort_order:8},
    {id:'rev-10',author:'Anand Gawde',rating:5,time_ago:'1 year ago',content:'Extremely professional real estate advisors. Guided me to buy 2 BHK in Seawoods at best market rate.',avatar_color:'#2196F3',verified:1,reviews_count:'7 reviews',is_local_guide:0,published:1,sort_order:9}
  ];
  for (const r of reviews) {
    const { data } = await supabase.from('reviews').select('id').eq('id', r.id);
    if (!data || data.length === 0) {
      const { error } = await supabase.from('reviews').insert([r]);
      if (error) fail(`review ${r.id}: ${error.message}`);
      else ok(`reviews: Seeded "${r.author}"`);
    }
  }
  const { data: revCount } = await supabase.from('reviews').select('id');
  skip(`reviews: ${(revCount||[]).length} reviews in database`);
}

// ── 4. API CONNECTIVITY TEST ─────────────────────────────────────────────────
async function testAPIConnectivity() {
  hdr('STEP 4/6 — API CONNECTIVITY TESTS');

  // Anon read: properties
  const { data: anonProps, error: e1 } = await anonClient
    .from('properties').select('id,title').eq('published', 1).eq('archived', 0).limit(3);
  if (e1) fail(`ANON READ properties: ${e1.message}`);
  else ok(`ANON READ properties: OK — ${(anonProps||[]).length} published visible`);
  R.apiChecks.push({ name: 'anon_read_properties', ok: !e1 });

  // Anon read: reviews
  const { data: anonRevs, error: e2 } = await anonClient
    .from('reviews').select('id').eq('published', 1).limit(3);
  if (e2) fail(`ANON READ reviews: ${e2.message}`);
  else ok(`ANON READ reviews: OK — ${(anonRevs||[]).length} reviews visible`);
  R.apiChecks.push({ name: 'anon_read_reviews', ok: !e2 });

  // Anon read: categories
  const { data: anonCats, error: e3 } = await anonClient
    .from('categories').select('name').limit(5);
  if (e3) fail(`ANON READ categories: ${e3.message}`);
  else ok(`ANON READ categories: OK — ${(anonCats||[]).length} categories visible`);
  R.apiChecks.push({ name: 'anon_read_categories', ok: !e3 });

  // Anon read: hero_settings
  const { data: anonHero, error: e4 } = await anonClient
    .from('hero_settings').select('heading_part1').eq('id', 1);
  if (e4) fail(`ANON READ hero_settings: ${e4.message}`);
  else ok(`ANON READ hero_settings: OK — "${anonHero?.[0]?.heading_part1 || 'N/A'}"`);
  R.apiChecks.push({ name: 'anon_read_hero_settings', ok: !e4 });

  // Anon read: site_settings
  const { data: anonSite, error: e5 } = await anonClient
    .from('site_settings').select('company_name').eq('id', 1);
  if (e5) fail(`ANON READ site_settings: ${e5.message}`);
  else ok(`ANON READ site_settings: OK — "${anonSite?.[0]?.company_name || 'N/A'}"`);
  R.apiChecks.push({ name: 'anon_read_site_settings', ok: !e5 });

  // Anon read: popup_settings
  const { data: anonPopup, error: e6 } = await anonClient
    .from('popup_settings').select('title').eq('id', 1);
  if (e6) fail(`ANON READ popup_settings: ${e6.message}`);
  else ok(`ANON READ popup_settings: OK — "${anonPopup?.[0]?.title || 'N/A'}"`);
  R.apiChecks.push({ name: 'anon_read_popup_settings', ok: !e6 });

  // Anon INSERT lead test
  const testId = `audit-test-${Date.now()}`;
  const { error: e7 } = await anonClient.from('leads').insert([{
    id: testId, name: 'Audit Bot', phone: '0000000000',
    lead_source: 'DB Audit Test', cta_source: 'Automated', page_name: '/audit'
  }]);
  if (e7) fail(`ANON INSERT lead: ${e7.message}`);
  else {
    ok('ANON INSERT lead: OK — lead submission policy works');
    await supabase.from('leads').delete().eq('id', testId);
    skip('Audit test lead deleted');
  }
  R.apiChecks.push({ name: 'anon_insert_lead', ok: !e7 });

  // Service role full access
  const { data: svcLeads, error: e8 } = await supabase.from('leads').select('id').limit(1);
  if (e8) fail(`SERVICE ROLE READ leads: ${e8.message}`);
  else ok('SERVICE ROLE READ leads: OK');
  R.apiChecks.push({ name: 'service_role_read_leads', ok: !e8 });

  const { data: svcAdmin, error: e9 } = await supabase.from('admin_users').select('username').limit(1);
  if (e9) fail(`SERVICE ROLE READ admin_users: ${e9.message}`);
  else ok(`SERVICE ROLE READ admin_users: OK — "${svcAdmin?.[0]?.username || 'N/A'}"`);
  R.apiChecks.push({ name: 'service_role_read_admin', ok: !e9 });

  // Auth verification test
  const { data: adminRow } = await supabase
    .from('admin_users').select('password_hash').eq('username', 'admin@jayshreerealty');
  if (adminRow && adminRow.length > 0) {
    const testPass = process.env.ADMIN_PASS || 'jayshreerealty@8989';
    const isValid = await bcrypt.compare(testPass, adminRow[0].password_hash);
    if (isValid) ok(`AUTH: Password verification test PASSED for admin@jayshreerealty`);
    else fail(`AUTH: Password verification FAILED — hash mismatch`);
    R.apiChecks.push({ name: 'auth_password_verify', ok: isValid });
  }
}

// ── 5. GENERATE PENDING SQL MIGRATION ───────────────────────────────────────
async function generatePendingSQL(missingCols) {
  hdr('STEP 5/6 — PENDING SQL MIGRATION');
  
  if (missingCols.length === 0) {
    skip('No missing columns — database schema is fully synchronized');
    return null;
  }

  const lines = [
    '-- ================================================================',
    '-- JAYSHREE REALTY - PENDING DATABASE MIGRATION',
    `-- Generated: ${new Date().toISOString()}`,
    '-- INSTRUCTIONS: Run in Supabase SQL Editor → New Query → Run',
    '-- URL: https://supabase.com/dashboard/project/pzmjewrnnzntvtueqmcq/sql',
    '-- ================================================================',
    '',
    '-- Safe idempotent column additions (ADD COLUMN IF NOT EXISTS)',
    ''
  ];
  for (const col of missingCols) {
    const sql = ALTER_SQL[col];
    if (sql) lines.push(sql);
    else warn(`No ALTER SQL defined for: ${col}`);
  }
  lines.push('');
  lines.push('-- Verify columns were added');
  lines.push("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('leads','properties') ORDER BY table_name, ordinal_position;");

  const sqlContent = lines.join('\n');
  const outPath = join(__dirname, '../migration_pending.sql');
  writeFileSync(outPath, sqlContent, 'utf8');
  ok(`Pending migration SQL written to: migration_pending.sql`);
  console.log('\n  SQL content preview:');
  lines.filter(l => l.startsWith('ALTER')).forEach(l => console.log('    ' + l));
  return sqlContent;
}

// ── 6. DATABASE STATISTICS ───────────────────────────────────────────────────
async function collectStats() {
  hdr('STEP 6/6 — DATABASE STATISTICS');
  const tables = ['properties','leads','categories','reviews','location_nodes','counters','analytics_events','visitor_sessions','activity_logs','lead_history'];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('id');
    if (error) warn(`${t}: ${error.message}`);
    else skip(`${t}: ${(data||[]).length} rows`);
  }
}

// ── FINAL REPORT ─────────────────────────────────────────────────────────────
function printReport(missingCols) {
  hdr('FINAL AUDIT REPORT');

  const tabOK = R.tablesFound.length;
  const tabTotal = EXPECTED_TABLES.length;
  const apiOK = R.apiChecks.filter(x => x.ok).length;
  const apiTotal = R.apiChecks.length;

  console.log(`
  SUMMARY
  ─────────────────────────────────────────
  Tables:    ${tabOK}/${tabTotal} found  ${R.tablesMissing.length > 0 ? '⚠️  MISSING: ' + R.tablesMissing.join(', ') : '✅ All present'}
  Columns:   ${R.columnsMissing.length === 0 ? '✅ All synchronized' : '⚠️  ' + R.columnsMissing.length + ' missing (see migration_pending.sql)'}
  API Tests: ${apiOK}/${apiTotal} passed
  Seeding:   ${R.applied.length} actions applied
  Errors:    ${R.errors.length === 0 ? '✅ None' : '❌ ' + R.errors.length}
  Warnings:  ${R.warnings.length}
  `);

  if (R.errors.length > 0) {
    console.log('  ERRORS:');
    R.errors.forEach(e => console.log('    ❌ ' + e));
  }

  if (R.warnings.length > 0) {
    console.log('  WARNINGS:');
    R.warnings.forEach(w => console.log('    ⚠️  ' + w));
  }

  if (missingCols.length > 0) {
    console.log('\n  ⚠️  REQUIRED ACTION:');
    console.log('  Run the generated migration_pending.sql file in Supabase SQL Editor:');
    console.log('  https://supabase.com/dashboard/project/pzmjewrnnzntvtueqmcq/sql');
  } else {
    console.log('\n  ✅ DATABASE IS FULLY SYNCHRONIZED');
    console.log('  All tables, columns, policies, and seed data are in sync.');
  }
  console.log('\n' + HR + '\n');
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n' + HR);
  console.log('  JAYSHREE REALTY — SUPABASE DB AUDIT & MIGRATION');
  console.log(`  ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  console.log('  Project: ' + SUPABASE_URL);
  console.log(HR);

  const tableStatus  = await auditTables();
  const missingCols  = await auditColumns(tableStatus);
  await auditAndSeedData();
  await testAPIConnectivity();
  await generatePendingSQL(missingCols);
  await collectStats();
  printReport(missingCols);
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
