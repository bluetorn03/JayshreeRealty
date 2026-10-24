import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const distDir = path.join(projectRoot, 'dist');

// Target locations for public_html across various deployment structures
const potentialPublicHtmlDirs = [
  path.join(projectRoot, 'public_html'),
  path.resolve(projectRoot, '..', 'public_html'),
  path.resolve(projectRoot, '../..', 'public_html'),
  path.resolve(projectRoot, '../../..', 'public_html'),
  '/home/u168098130/domains/jayshreerealty.com/public_html'
];

console.log('='.repeat(65));
console.log('📦 DEPLOYMENT COPY PROCESS: Syncing nodejs/dist -> public_html');
console.log('='.repeat(65));
console.log(`Source dist directory: ${distDir}`);
console.log(`fs.existsSync(distDir): ${fs.existsSync(distDir)}`);

if (!fs.existsSync(distDir)) {
  console.error('❌ Source dist directory does not exist! Run "npm run build" first.');
  process.exit(1);
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
    try {
      fs.chmodSync(dest, 0o644);
    } catch (_) {}
  }
}

let copiedCount = 0;
for (const targetDir of potentialPublicHtmlDirs) {
  try {
    if (!fs.existsSync(targetDir)) {
      // Only create if within repository or parent domain
      if (targetDir.includes('jayshreerealty.com') || targetDir.includes(projectRoot)) {
        fs.mkdirSync(targetDir, { recursive: true });
      } else {
        continue;
      }
    }

    console.log(`Syncing dist contents to: ${targetDir}`);
    copyRecursiveSync(distDir, targetDir);

    // Ensure .htaccess with Hostinger Passenger config is present in target directory
    const htaccessSrc = path.join(projectRoot, 'public', '.htaccess');
    const htaccessDest = path.join(targetDir, '.htaccess');
    if (fs.existsSync(htaccessSrc)) {
      fs.copyFileSync(htaccessSrc, htaccessDest);
      try { fs.chmodSync(htaccessDest, 0o644); } catch (_) {}
      console.log(`✅ Configured Passenger .htaccess in: ${htaccessDest}`);
    }

    // Ensure uploads directory exists in target and sync bundled uploads
    const uploadsTarget = path.join(targetDir, 'uploads');
    if (!fs.existsSync(uploadsTarget)) {
      fs.mkdirSync(uploadsTarget, { recursive: true });
    }
    const uploadsSrc = path.join(projectRoot, 'public', 'uploads');
    if (fs.existsSync(uploadsSrc)) {
      for (const item of fs.readdirSync(uploadsSrc)) {
        const s = path.join(uploadsSrc, item);
        const d = path.join(uploadsTarget, item);
        if (fs.existsSync(s) && fs.statSync(s).isFile() && !fs.existsSync(d)) {
          fs.copyFileSync(s, d);
          try { fs.chmodSync(d, 0o644); } catch (_) {}
        }
      }
    }

    console.log(`✅ Successfully synced dist -> ${targetDir}`);
    copiedCount++;
  } catch (err) {
    console.warn(`⚠️ Could not copy to ${targetDir}:`, err.message);
  }
}

console.log('='.repeat(65));
console.log(`✨ Copy process finished. Synced to ${copiedCount} target directory/directories.`);
console.log('='.repeat(65));
