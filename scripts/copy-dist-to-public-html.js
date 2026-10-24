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

    // Safely ensure .htaccess exists in target public_html without destroying Passenger config
    const htaccessSrc = path.join(projectRoot, 'public', '.htaccess');
    const htaccessDest = path.join(targetDir, '.htaccess');
    if (fs.existsSync(htaccessDest)) {
      const existing = fs.readFileSync(htaccessDest, 'utf8');
      if (existing.includes('Passenger') || existing.includes('passenger') || existing.includes('lsapi')) {
        console.log(`ℹ️ Preserved server-specific Passenger config in: ${htaccessDest}`);
      } else if (fs.existsSync(htaccessSrc)) {
        fs.copyFileSync(htaccessSrc, htaccessDest);
      }
    } else if (fs.existsSync(htaccessSrc)) {
      fs.copyFileSync(htaccessSrc, htaccessDest);
      console.log(`Copied .htaccess to: ${htaccessDest}`);
    }

    // Ensure uploads directory exists in target
    const uploadsTarget = path.join(targetDir, 'uploads');
    if (!fs.existsSync(uploadsTarget)) {
      fs.mkdirSync(uploadsTarget, { recursive: true });
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
