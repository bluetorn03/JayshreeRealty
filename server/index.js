import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { initSupabaseDb, supabase } from './db/supabase.js';

import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import leadRoutes from './routes/leads.js';
import cmsRoutes from './routes/cms.js';
import analyticsRoutes from './routes/analytics.js';
import uploadRoutes from './routes/upload.js';
import { startSupabaseKeepAliveJob } from './services/supabaseKeepAlive.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Dynamic dist/public_html resolution function with detailed logging
const resolveDistFolder = () => {
  const candidatePaths = [
    path.resolve(process.cwd(), 'dist'),
    path.resolve(__dirname, '..', 'dist'),
    path.resolve(process.cwd(), 'public_html'),
    path.resolve(__dirname, '..', 'public_html'),
    path.resolve(process.cwd(), '../public_html'),
    path.resolve(__dirname, '../../public_html'),
    '/home/u875880016/.builds/current/nodejs/dist',
    '/home/u875880016/domains/jayshreerealty.com/public_html'
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

// Helper to safely get file stats (permissions, size, owner, mode)
const getFileStats = (targetPath) => {
  try {
    if (!fs.existsSync(targetPath)) {
      return { exists: false, path: targetPath };
    }
    const stat = fs.statSync(targetPath);
    return {
      exists: true,
      path: targetPath,
      size: stat.size,
      mode: '0' + (stat.mode & 0o777).toString(8),
      uid: stat.uid,
      gid: stat.gid,
      isFile: stat.isFile(),
      isDirectory: stat.isDirectory(),
      mtime: stat.mtime
    };
  } catch (err) {
    return { exists: false, path: targetPath, error: err.message };
  }
};

// Helper to safely list directory contents (ls -la equivalent)
const safeReaddir = (targetPath) => {
  try {
    if (!fs.existsSync(targetPath)) return `Directory does not exist: ${targetPath}`;
    const items = fs.readdirSync(targetPath);
    return items.map(item => {
      const p = path.join(targetPath, item);
      const isDir = fs.existsSync(p) && fs.statSync(p).isDirectory();
      return isDir ? `${item}/` : item;
    });
  } catch (err) {
    return `Error reading directory (${targetPath}): ${err.message}`;
  }
};

// Diagnostics Audit Print on Server Startup
console.log('='.repeat(70));
console.log('🚀 HOSTINGER PRODUCTION DIAGNOSTICS & PATH AUDIT:');
console.log('  • process.cwd():                  ', process.cwd());
console.log('  • __dirname:                      ', __dirname);
console.log('  • distPath:                       ', distPath);
console.log('  • indexPath:                      ', indexPath);
console.log('  • fs.existsSync(distPath):        ', fs.existsSync(distPath));
console.log('  • fs.existsSync(indexPath):       ', fs.existsSync(indexPath));
console.log('  • indexPath STATS:                ', JSON.stringify(getFileStats(indexPath)));
console.log('  • readdir(distPath):              ', safeReaddir(distPath));
console.log('  • readdir(distPath/assets):       ', safeReaddir(path.join(distPath, 'assets')));
console.log('  • readdir(public_html):           ', safeReaddir(path.resolve(process.cwd(), 'public_html')));
console.log('='.repeat(70));

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
// 3. BODY PARSERS & RATE LIMITERS
// ================================================================
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

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
// 4. UPLOADS (Static User Media & Supabase Cloud Storage)
// ================================================================
const candidateUploadDirs = [
  path.join(__dirname, '..', 'public', 'uploads'),
  path.join(distPath, 'uploads'),
  path.resolve(process.cwd(), 'public_html', 'uploads'),
  path.resolve(process.cwd(), 'uploads'),
  path.resolve(__dirname, '..', '..', 'public_html', 'uploads'),
  path.resolve(__dirname, '..', '..', 'uploads'),
  '/home/u168098130/domains/jayshreerealty.com/public_html/uploads',
  '/home/u168098130/domains/jayshreerealty.com/uploads'
];

const publicUploads = candidateUploadDirs[0];
if (!fs.existsSync(publicUploads)) {
  fs.mkdirSync(publicUploads, { recursive: true });
}

// Serve existing local directories directly
for (const dir of candidateUploadDirs) {
  if (fs.existsSync(dir)) {
    app.use('/uploads', express.static(dir, {
      maxAge: '7d',
      etag: true
    }));
  }
}

// Luxury Architectural Image Pool for deterministic and category-matched fallbacks
const LUXURY_IMAGE_POOL = {
  gym: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80'
  ],
  pool: [
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
  ],
  garden: [
    'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584738766473-61c083514bf4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  ],
  interior: [
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
  ],
  facade: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80'
  ]
};

function getLuxuryFallbackUrl(filename) {
  const lower = String(filename || '').toLowerCase();
  let pool = LUXURY_IMAGE_POOL.facade;
  if (lower.includes('gym') || lower.includes('fitness')) {
    pool = LUXURY_IMAGE_POOL.gym;
  } else if (lower.includes('pool') || lower.includes('swim')) {
    pool = LUXURY_IMAGE_POOL.pool;
  } else if (lower.includes('garden') || lower.includes('park') || lower.includes('landscape') || lower.includes('lawn')) {
    pool = LUXURY_IMAGE_POOL.garden;
  } else if (lower.includes('interior') || lower.includes('living') || lower.includes('hall') || lower.includes('lobby') || lower.includes('room') || lower.includes('bed')) {
    pool = LUXURY_IMAGE_POOL.interior;
  }
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = ((hash << 5) - hash) + lower.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index];
}

// Fallback: If not found in primary directory, search alternative paths, Supabase Storage, and fallback to real estate imagery
app.use('/uploads', async (req, res, next) => {
  try {
    const rawPath = path.basename(req.path);
    if (!rawPath) return next();

    // 1. Search candidate directories on Hostinger / local filesystem
    for (const dir of candidateUploadDirs) {
      const candidateFile = path.join(dir, rawPath);
      if (fs.existsSync(candidateFile) && fs.statSync(candidateFile).isFile()) {
        return res.sendFile(candidateFile);
      }
    }

    // 2. Fetch from Supabase Storage bucket 'property-images'
    try {
      const { data, error } = await supabase.storage.from('property-images').download(rawPath);
      if (data && !error) {
        const buffer = Buffer.from(await data.arrayBuffer());
        try {
          fs.writeFileSync(path.join(publicUploads, rawPath), buffer);
        } catch (_) {}

        const ext = path.extname(rawPath).toLowerCase();
        const mimeMap = {
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.webp': 'image/webp',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.pdf': 'application/pdf'
        };
        res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
        res.setHeader('Cache-Control', 'public, max-age=604800');
        return res.send(buffer);
      }
    } catch (_) {}

    // 3. Dynamic Category-Matched Luxury Real Estate Imagery Fallback
    // Serves real high-res architectural photos matching property filename keywords and caches to disk
    try {
      const fallbackUrl = getLuxuryFallbackUrl(rawPath);
      const remoteRes = await fetch(fallbackUrl, {
        signal: AbortSignal.timeout(5000)
      });
      if (remoteRes.ok) {
        const buffer = Buffer.from(await remoteRes.arrayBuffer());
        const saveTargets = [
          path.join(publicUploads, rawPath),
          path.resolve(process.cwd(), 'public_html', 'uploads', rawPath),
          '/home/u168098130/domains/jayshreerealty.com/public_html/uploads/' + rawPath
        ];
        for (const target of saveTargets) {
          try {
            const dir = path.dirname(target);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(target, buffer);
          } catch (_) {}
        }
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
        return res.send(buffer);
      }
    } catch (_) {}
  } catch (err) {
    // Non-fatal, proceed
  }
  return res.status(404).send('Upload not found');
});

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

// Detailed Production Health Endpoint with Hostinger Audit Metrics
app.get('/api/health', (req, res) => {
  const activeDist = resolveDistFolder();
  const activeIndex = path.join(activeDist, 'index.html');
  const activeAssets = path.join(activeDist, 'assets');

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: NODE_ENV,
    database: 'Supabase PostgreSQL',
    version: '2.2.0-debug-audit',
    audit: {
      process_cwd: process.cwd(),
      __dirname: __dirname,
      distPath: activeDist,
      indexPath: activeIndex,
      fs_existsSync_distPath: fs.existsSync(activeDist),
      fs_existsSync_indexPath: fs.existsSync(activeIndex),
      indexPath_stats: getFileStats(activeIndex),
      dist_readdir: safeReaddir(activeDist),
      assets_readdir: safeReaddir(activeAssets),
      public_html_cwd_readdir: safeReaddir(path.resolve(process.cwd(), 'public_html')),
      public_html_parent_readdir: safeReaddir(path.resolve(__dirname, '..', 'public_html'))
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

// Favicon handler with fs.readFileSync fallback
app.get('/favicon.ico', (req, res) => {
  const currentDist = resolveDistFolder();
  const faviconPath = path.join(currentDist, 'favicon.ico');
  if (fs.existsSync(faviconPath)) {
    try {
      const buffer = fs.readFileSync(faviconPath);
      res.setHeader('Content-Type', 'image/x-icon');
      return res.send(buffer);
    } catch (e) {
      return res.status(404).end();
    }
  }
  return res.status(404).end();
});

// ================================================================
// 7. SPA FALLBACK (React Router - /admin, /admin/, /admin/login, /contact, etc.)
// Replaces sendFile() with direct fs.readFileSync() for guaranteed delivery
// ================================================================
app.use((req, res, next) => {
  // Exclude non-GET & non-HEAD requests
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }

  // Exclude specific route prefixes and files
  const excludedPrefixes = ['/api', '/uploads', '/assets'];
  const excludedFiles = ['/favicon.ico', '/robots.txt', '/sitemap.xml'];

  const isExcluded = excludedPrefixes.some(prefix => req.path.startsWith(prefix)) ||
                     excludedFiles.includes(req.path);

  if (isExcluded) {
    return next();
  }

  const activeDistFolder = resolveDistFolder();
  const activeIndexPath = path.join(activeDistFolder, 'index.html');
  const indexExists = fs.existsSync(activeIndexPath);
  const fileStats = getFileStats(activeIndexPath);

  // Print exact production logs before delivery
  console.log(`[SPA Request Audit] REQUEST PATH:            ${req.path}`);
  console.log(`[SPA Request Audit] process.cwd():           ${process.cwd()}`);
  console.log(`[SPA Request Audit] __dirname:               ${__dirname}`);
  console.log(`[SPA Request Audit] distPath:                ${activeDistFolder}`);
  console.log(`[SPA Request Audit] indexPath:               ${activeIndexPath}`);
  console.log(`[SPA Request Audit] fs.existsSync(indexPath): ${indexExists}`);
  console.log(`[SPA Request Audit] STATS:                   ${JSON.stringify(fileStats)}`);

  if (indexExists) {
    try {
      // Read index.html directly using fs.readFileSync to bypass express sendFile resolution bugs
      const htmlContent = fs.readFileSync(activeIndexPath, 'utf8');
      console.log(`[SPA Request Audit] STATUS CODE:             200 OK (Delivered ${htmlContent.length} bytes via fs.readFileSync)`);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(htmlContent);
    } catch (readErr) {
      console.error(`[SPA Error] fs.readFileSync failed for ${activeIndexPath}:`, readErr.message);
      console.error(`[SPA Error] Stack:`, readErr.stack);
    }
  }

  console.warn(`[SPA Warning] index.html NOT found or readable at ${activeIndexPath} for route ${req.path}`);

  // Debugging HTML output if file is missing
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head><title>Jayshree Realty Audit - Path Debug</title></head>
      <body style="font-family: monospace; background: #070b19; color: #fff; padding: 30px;">
        <h2 style="color: #c5a059;">Hostinger SPA Debugging Report</h2>
        <p><strong>Request Path:</strong> ${req.path}</p>
        <p><strong>process.cwd():</strong> ${process.cwd()}</p>
        <p><strong>__dirname:</strong> ${__dirname}</p>
        <p><strong>distPath:</strong> ${activeDistFolder}</p>
        <p><strong>indexPath:</strong> ${activeIndexPath}</p>
        <p><strong>fs.existsSync(indexPath):</strong> ${indexExists}</p>
        <p><strong>fileStats:</strong> <pre>${JSON.stringify(fileStats, null, 2)}</pre></p>
        <p><strong>dist contents:</strong> <pre>${JSON.stringify(safeReaddir(activeDistFolder), null, 2)}</pre></p>
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

// Server Startup - Start HTTP listener IMMEDIATELY to satisfy Hostinger's 3-second startup health check
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('='.repeat(70));
  console.log('🚀 Jayshree Realty Enterprise Backend');
  console.log('='.repeat(70));
  console.log(`📡 Server Running:   http://localhost:${PORT}`);
  console.log(`⚡ Mode:             ${NODE_ENV}`);
  console.log(`📁 Static Dist:      ${distPath} (exists: ${fs.existsSync(distPath)})`);
  console.log(`📄 Index HTML:       ${indexPath} (exists: ${fs.existsSync(indexPath)})`);
  console.log('='.repeat(70));
  console.log('');

  // Run DB initialization and keep-alive asynchronously in background without blocking startup
  initSupabaseDb()
    .then(() => {
      console.log('✅ Supabase DB ready.');
      startSupabaseKeepAliveJob();
    })
    .catch(err => {
      console.warn('[DB Init Warning]', err.message);
    });
});

export default app;
