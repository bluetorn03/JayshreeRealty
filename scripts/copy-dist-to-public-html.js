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
  path.resolve(projectRoot, '../..', 'public_html')
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
  }
}

let copiedCount = 0;
for (const targetDir of potentialPublicHtmlDirs) {
  try {
    // Ensure targetDir exists if it's in projectRoot or parent directory
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    console.log(`Syncing dist contents to: ${targetDir}`);
    copyRecursiveSync(distDir, targetDir);

    // Also ensure .htaccess exists in target public_html
    const htaccessSrc = path.join(projectRoot, 'public', '.htaccess');
    const htaccessDest = path.join(targetDir, '.htaccess');
    if (fs.existsSync(htaccessSrc) && !fs.existsSync(htaccessDest)) {
      fs.copyFileSync(htaccessSrc, htaccessDest);
      console.log(`Copied .htaccess to: ${htaccessDest}`);
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
