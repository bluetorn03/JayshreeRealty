import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { initSupabaseDb } from './db/supabase.js';

import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import leadRoutes from './routes/leads.js';
import cmsRoutes from './routes/cms.js';
import analyticsRoutes from './routes/analytics.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ================================================================
// SECURITY HEADERS (helmet)
// ================================================================
app.use(helmet({
  contentSecurityPolicy: false, // Disabled because frontend uses inline scripts & Supabase CDN
  crossOriginEmbedderPolicy: false
}));

// ================================================================
// CORS Configuration
// ================================================================
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://jayshreerealty.com',
  process.env.CLIENT_URL || 'https://jayshreerealty.com',
  process.env.BACKEND_URL || 'https://jayshreerealty.com',
  'https://jayshreerealty.com',
  'https://www.jayshreerealty.com',
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin) || NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in production for Hostinger deployment
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ================================================================
// BODY PARSING
// ================================================================
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ================================================================
// RATE LIMITING - Protect API endpoints
// ================================================================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Only 20 login attempts per 15 mins
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);

// ================================================================
// STATIC FILE SERVING - Uploaded Media
// ================================================================
const publicUploads = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(publicUploads)) {
  fs.mkdirSync(publicUploads, { recursive: true });
}
app.use('/uploads', express.static(publicUploads));

// ================================================================
// API ROUTES
// ================================================================
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// ================================================================
// HEALTH CHECK & STATUS ENDPOINTS
// ================================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: NODE_ENV,
    database: 'Supabase PostgreSQL',
    version: '2.0.0'
  });
});

// Robots.txt (served dynamically from site_settings if available)
app.get('/robots.txt', async (req, res) => {
  try {
    const { supabase } = await import('./db/supabase.js');
    const { data } = await supabase.from('site_settings').select('robots_txt_content').eq('id', 1).limit(1);
    const content = data?.[0]?.robots_txt_content || "User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://jayshreerealty.com/sitemap.xml";
    res.type('text/plain').send(content);
  } catch (e) {
    res.type('text/plain').send("User-agent: *\nAllow: /\nDisallow: /admin");
  }
});

// Sitemap.xml (basic auto-generated)
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://jayshreerealty.com';
    const staticPages = ['/', '/about', '/buy', '/sell', '/commercial', '/projects', '/testimonials', '/contact'];

    const urls = staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    res.type('application/xml').send(xml);
  } catch (e) {
    res.status(500).send('Sitemap generation failed');
  }
});

// ================================================================
// SERVE PRODUCTION FRONTEND BUILD (Hostinger deployment)
// ================================================================
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, {
    maxAge: NODE_ENV === 'production' ? '7d' : '0',
    etag: true
  }));

  // SPA fallback - serve index.html for all non-API / non-uploads routes (Express 5 syntax)
  app.get('{*path}', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else if (NODE_ENV !== 'production') {
  console.log('⚠️  No dist/ folder found. Run "npm run build" for production, or use "npm run dev" for frontend dev server.');
}

// Unhandled API route fallback
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// ================================================================
// GLOBAL ERROR HANDLER
// ================================================================
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || err.statusCode || 500).json({
    success: false,
    message: NODE_ENV === 'production' ? 'Internal server error' : (err.message || 'An unexpected error occurred')
  });
});

// ================================================================
// SERVER STARTUP
// ================================================================
const startServer = async () => {
  try {
    // Attempt DB initialization (seed default data) - non-blocking if tables don't exist yet
    await initSupabaseDb().catch(err => {
      console.warn('[DB Init Warning] Tables may not exist yet. Run: npm run migrate');
      console.warn('[DB Init Warning]', err.message);
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('='.repeat(55));
      console.log('🚀  Jayshree Realty Enterprise Backend');
      console.log('='.repeat(55));
      console.log(`📡  Running:    http://localhost:${PORT}`);
      console.log(`⚡  Database:   Supabase (${process.env.SUPABASE_URL?.replace('https://', '') || 'not configured'})`);
      console.log(`🌍  Mode:       ${NODE_ENV}`);
      console.log(`📁  Uploads:    /uploads/`);
      console.log('='.repeat(55));
      console.log('');
    });
  } catch (err) {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  }
};

startServer();
