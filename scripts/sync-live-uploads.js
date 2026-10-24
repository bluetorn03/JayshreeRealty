import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const localUploadsDir = path.join(projectRoot, 'public', 'uploads');

if (!fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const liveBaseUrl = (process.env.CLIENT_URL || process.env.FRONTEND_URL || 'https://jayshreerealty.com').replace(/\/+$/, '');

console.log('='.repeat(65));
console.log('🔄 SYNC LIVE UPLOADS -> LOCAL MACHINE');
console.log('='.repeat(65));

async function syncFromLive() {
  let downloadedCount = 0;
  let alreadyPresentCount = 0;

  // 1. Fetch all properties from Supabase to gather all active image paths
  const imageNames = new Set();

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: properties, error } = await supabase.from('properties').select('image, gallery_images_json');
      if (!error && properties) {
        for (const p of properties) {
          if (p.image && p.image.startsWith('/uploads/')) {
            imageNames.add(path.basename(p.image));
          }
          if (p.gallery_images_json) {
            try {
              const gallery = typeof p.gallery_images_json === 'string' ? JSON.parse(p.gallery_images_json) : p.gallery_images_json;
              if (Array.isArray(gallery)) {
                for (const g of gallery) {
                  if (typeof g === 'string' && g.startsWith('/uploads/')) {
                    imageNames.add(path.basename(g));
                  }
                }
              }
            } catch (_) {}
          }
        }
      }

      // 2. Also check Supabase Storage bucket 'property-images'
      try {
        const { data: files } = await supabase.storage.from('property-images').list('', { limit: 500 });
        if (files) {
          for (const f of files) {
            if (f.name) imageNames.add(f.name);
          }
        }
      } catch (_) {}
    } catch (e) {
      console.warn('⚠️ Supabase connection warning:', e.message);
    }
  }

  console.log(`Found ${imageNames.size} distinct image references from live database.`);

  // 3. Download missing images from live website
  for (const filename of imageNames) {
    if (!filename || filename === 'curated-fallbacks') continue;
    const localPath = path.join(localUploadsDir, filename);

    if (fs.existsSync(localPath)) {
      alreadyPresentCount++;
      continue;
    }

    try {
      const liveUrl = `${liveBaseUrl}/uploads/${filename}`;
      const res = await fetch(liveUrl, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(localPath, buffer);
        console.log(`  ✓ Downloaded new live image: ${filename} (${buffer.length} bytes)`);
        downloadedCount++;
      }
    } catch (err) {
      // Non-fatal if specific file fails
    }
  }

  console.log('='.repeat(65));
  console.log(`✨ Sync finished: ${downloadedCount} new images downloaded, ${alreadyPresentCount} already present.`);
  console.log('='.repeat(65));
}

syncFromLive().catch(err => {
  console.error('❌ Sync failed:', err.message);
});
