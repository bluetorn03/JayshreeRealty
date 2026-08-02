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
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Dynamic dist/public_html resolution function
const resolveDistFolder = () => {
  const candidatePaths = [
    path.resolve(process.cwd(), 'dist'),
    path.resolve(__dirname, '..', 'dist'),
    path.resolve(process.cwd(), 'public_html'),
    path.resolve(__dirname, '..', 'public_html'),
    path.resolve(process.cwd(), '../public_html'),
    path.resolve(__dirname, '../../public_html')
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate) && fs.existsSync(path.join(candidate, 'index.html'))) {
      return candidate;
    }
  }
  return candidatePaths[0];
};

const distPath = resolveDistFolder();
const indexPath = path.join(distPath, 'index.html');

// Diagnostics & Path Audit log
console.log('='.repeat(65));
console.log('🚀 PRODUCTION ENVIRONMENT PATH AUDIT:');
console.log('  • process.cwd():          ', process.cwd());
console.log('  • __dirname:              ', __dirname);
console.log('  • distPath:               ', distPath);
console.log('  • indexPath:              ', indexPath);
console.log('  • fs.existsSync(distPath): ', fs.existsSync(distPath));
console.log('  • fs.existsSync(indexPath):', fs.existsSync(indexPath));
console.log('='.repeat(65));

// ================================================================
// 1. HELMET (Security Headers)
// ================================================================
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// ================================================================
// 2. CORS Configuration
// ================================================================
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://jayshreerealty.com',
  process.env.CLIENT_URL || 'https://jayshreerealty.com',
  process.env.BACKEND_URL || 'https://jayshreerealty.com',
  'https://jayshreerealty.com',
  'https://www.jayshreerealty.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ================================================================
// 3. JSON & URLENCODED BODY PARSERS
// ================================================================
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Rate Limiters for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

// ================================================================
// 4. UPLOADS (Static User Media)
// ================================================================
const publicUploads = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(publicUploads)) {
  fs.mkdirSync(publicUploads, { recursive: true });
}
app.use('/uploads', express.static(publicUploads));

// ================================================================
// 5. EXPRESS.STATIC (Frontend Built Assets in dist / public_html)
// ================================================================
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, {
    maxAge: NODE_ENV === 'production' ? '7d' : '0',
    etag: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));
} else {
  console.warn(`⚠️ Warning: Static assets directory not found at ${distPath}`);
}

// ================================================================
// 6. API ROUTES & CORE ENDPOINTS
// ================================================================
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check with comprehensive Phase 1 audit metrics
app.get('/api/health', (req, res) => {
  const currentDistPath = resolveDistFolder();
  const currentIndexPath = path.join(currentDistPath, 'index.html');
  const assetsPath = path.join(currentDistPath, 'assets');

  const safeReaddir = (targetPath) => {
    try {
      return fs.existsSync(targetPath) ? fs.readdirSync(targetPath) : null;
    } catch (e) {
      return `Error reading directory: ${e.message}`;
    }
  };

  const candidatePublicHtmls = [
    path.resolve(process.cwd(), 'public_html'),
    path.resolve(__dirname, '..', 'public_html'),
    path.resolve(process.cwd(), '../public_html')
  ];

  const publicHtmlContents = {};
  candidatePublicHtmls.forEach(p => {
    publicHtmlContents[p] = safeReaddir(p);
  });

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: NODE_ENV,
    database: 'Supabase PostgreSQL',
    version: '2.1.0-prod-audit',
    audit: {
      cwd: process.cwd(),
      dirname: __dirname,
      distPath: currentDistPath,
      indexPath: currentIndexPath,
      distExists: fs.existsSync(currentDistPath),
      indexExists: fs.existsSync(currentIndexPath),
      faviconExists: fs.existsSync(path.join(currentDistPath, 'favicon.ico')),
      distContents: safeReaddir(currentDistPath),
      assetsContents: safeReaddir(assetsPath),
      publicHtmlSearch: publicHtmlContents
    }
  });
});

// Production Audit Test Email Route
app.all('/api/test-email', async (req, res) => {
  try {
    const { executeTestEmailAudit } = await import('./services/email.js');
    const recipient = req.body?.recipient || req.query?.recipient || 'jayshreerealty16@gmail.com';
    const result = await executeTestEmailAudit(recipient);
    console.log(`[SMTP Test Route] Audit result for ${recipient}:`, result);
    return res.status(result.status_code || 200).json(result);
  } catch (error) {
    console.error('[SMTP Test Route Error]', error);
    return res.status(500).json({
      success: false,
      status_code: 500,
      failure_reason: error.message
    });
  }
});

// Robots.txt
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

// Sitemap.xml
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

// Favicon handler
app.get('/favicon.ico', (req, res) => {
  const currentDist = resolveDistFolder();
  const faviconPath = path.join(currentDist, 'favicon.ico');
  if (fs.existsSync(faviconPath)) {
    return res.sendFile(faviconPath, (err) => {
      if (err && !res.headersSent) {
        res.status(404).end();
      }
    });
  }
  return res.status(404).end();
});

// ================================================================
// 7. SPA FALLBACK (React Router - /admin, /admin/, /admin/login, /contact, etc.)
// Task 8 Exclude: /api/*, /uploads/*, /assets/*, /favicon.ico, /robots.txt, /sitemap.xml
// Task 9: Existence check before sendFile()
// Phase 3 Runtime Logging
// ================================================================
app.use((req, res, next) => {
  // Exclude non-GET & non-HEAD requests
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }

  // Exclude specific route prefixes and files (Requirement 8)
  const excludedPrefixes = ['/api', '/uploads', '/assets'];
  const excludedFiles = ['/favicon.ico', '/robots.txt', '/sitemap.xml'];

  const isExcluded = excludedPrefixes.some(prefix => req.path.startsWith(prefix)) ||
                     excludedFiles.includes(req.path);

  if (isExcluded) {
    return next();
  }

  const activeDistFolder = resolveDistFolder();
  const activeIndexPath = path.join(activeDistFolder, 'index.html');

  // Phase 3 Runtime Logging
  console.log(`[SPA Request] REQUEST PATH:    ${req.path}`);
  console.log(`[SPA Request] DIST PATH:       ${activeDistFolder}`);
  console.log(`[SPA Request] INDEX PATH:      ${activeIndexPath}`);
  console.log(`[SPA Request] STATIC PATH:     ${activeDistFolder}`);
  console.log(`[SPA Request] ABSOLUTE FILE:   ${activeIndexPath}`);

  // Existence check before sendFile (Requirement 9)
  if (fs.existsSync(activeIndexPath)) {
    console.log(`[SPA Request] STATUS CODE:     200 (Serving index.html)`);
    return res.sendFile(activeIndexPath, (err) => {
      if (err && !res.headersSent) {
        console.error(`[SPA Error] sendFile failed for ${req.path}:`, err.message);
        console.error(`[SPA Error] Stack:`, err.stack);
        return next(err);
      }
    });
  }

  console.warn(`[SPA Warning] index.html NOT found at ${activeIndexPath} for request ${req.path}`);

  // Return HTML fallback error message instead of JSON so browser gets HTML for SPA route
  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head><title>Jayshree Realty - Build Warning</title></head>
      <body style="font-family: sans-serif; background: #070b19; color: #fff; padding: 40px; text-align: center;">
        <h1 style="color: #c5a059;">Jayshree Realty Production Audit</h1>
        <p>The application server is active, but frontend static assets (index.html) are not yet generated in: <code>${activeIndexPath}</code>.</p>
        <p>Please execute <code>npm run build</code> on Hostinger server or push latest release.</p>
      </body>
    </html>
  `);
});

// ================================================================
// 8. 404 HANDLER FOR UNHANDLED API ROUTES
// ================================================================
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

app.use((req, res) => {
  res.status(404).send('Resource not found');
});

// ================================================================
// 9. GLOBAL ERROR HANDLER
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
    await initSupabaseDb().catch(err => {
      console.warn('[DB Init Warning] Tables may not exist yet. Run: npm run migrate');
      console.warn('[DB Init Warning]', err.message);
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('='.repeat(65));
      console.log('🚀 Jayshree Realty Enterprise Backend');
      console.log('='.repeat(65));
      console.log(`📡 Server Running:   http://localhost:${PORT}`);
      console.log(`⚡ Mode:             ${NODE_ENV}`);
      console.log(`📁 Static Dist:      ${distPath} (exists: ${fs.existsSync(distPath)})`);
      console.log(`📄 Index HTML:       ${indexPath} (exists: ${fs.existsSync(indexPath)})`);
      console.log('='.repeat(65));
      console.log('');
    });
  } catch (err) {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  }
};

startServer();
