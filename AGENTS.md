# 🛡️ MANDATORY RULES: PRODUCTION DATA SAFETY & HOSTINGER DEPLOYMENT PROTOCOL
> **CRITICAL INSTRUCTION FOR ALL AI AGENTS & DEVELOPERS:**
> This repository is connected to the LIVE production real estate platform: **https://jayshreerealty.com**.
> Real client properties, leads, and high-resolution uploaded images are actively stored in production.
> Under NO circumstances should any AI model, tool, or script execute destructive actions that delete, overwrite, purge, or corrupt live client data.

---

## 🛑 1. ZERO-DATA-LOSS DIRECTIVE (NON-NEGOTIABLE)

### A. Live Database (Supabase)
1. **Never drop or truncate tables:** Tables such as `properties`, `leads`, `analytics`, `amenities`, etc., contain real client records. Queries like `DROP TABLE`, `TRUNCATE`, `DELETE FROM properties` are strictly forbidden.
2. **Migrations must be purely additive:** Always use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`. Never rename or drop columns without explicit user consent and a verified backup.
3. **Never reset or reseed live database:** Do not run dummy seed scripts on live Supabase without checking if production data exists.

### B. Live Uploads & Media Storage
1. **Never purge `public_html/uploads`:** Client property photos are stored in:
   - Supabase Cloud Storage: `property-images` bucket (Immutable primary storage)
   - Hostinger Webroot: `/home/u168098130/public_html/uploads`
   - Hostinger Domain Webroot: `/home/u168098130/domains/jayshreerealty.com/public_html/uploads`
   - Hostinger Server Persistent: `/home/u168098130/persistent_uploads`
2. **Never replace real photos with static placeholders:** Real client property photos must always take top priority. Never hardcode static badges, fallback vector svgs, or sample Unsplash URLs over real property images.

---

## 🚀 2. HOSTINGER GIT AUTO-DEPLOY PURGE PROTECTION

Hostinger Git Auto-deploy automatically clones code into a temporary version directory (`/hbuilds/versions/<new-uuid>/nodejs`) and purges the previous version directory upon deployment.

To prevent client images from being lost during git deployments:
1. **Uploads MUST be outside the version folder:**
   All uploaded media MUST be stored in persistent paths outside `/hbuilds/versions/...`:
   - Primary: Supabase Storage bucket `property-images` (cloud-hosted, immune to server wipes).
   - Server Cache: `/home/u168098130/public_html/uploads` & `/home/u168098130/persistent_uploads`.
2. **Non-Destructive Copy in `scripts/copy-dist-to-public-html.js`:**
   - The deployment script copies build files (`dist/`) into `public_html/`.
   - **RULE:** The copy logic must NEVER run `rm -rf`, `rimraf`, or clean `public_html/uploads`. It must ONLY copy new files without deleting existing user uploads.
3. **Multi-Root Synchronization:**
   Hostinger File Manager views `/home/u168098130/public_html`, while Apache/Nginx maps to `/home/u168098130/domains/jayshreerealty.com/public_html`.
   - **RULE:** Upload routes (`server/routes/upload.js`) and startup sync (`server/index.js`) must mirror files to BOTH paths simultaneously.

---

## 🔄 3. LOCAL-TO-LIVE SYNCHRONIZATION WORKFLOW

Whenever the client adds new properties or uploads new images on the live website, the local machine must be updated before performing local upgrades.

### The Command:
```bash
npm run sync:uploads
```
- **What it does:** Runs `scripts/sync-live-uploads.js`.
- Connects directly to Supabase and the live server API.
- Scans all 90+ live properties and downloads any newly uploaded client images into the local `public/uploads/` directory.
- Ensures local and live environments remain 100% in sync without missing assets.

---

## 🧩 4. SEPARATION OF ASSETS (FALLBACKS VS REAL UPLOADS)

1. **Client Uploads:** Live in `uploads/` (root uploads directory).
2. **Curated Fallbacks:** Live in `uploads/curated-fallbacks/` (segregated directory).
3. **RULE:** Fallback images must NEVER overwrite or take precedence over real client photos in `uploads/`. If a property has a valid uploaded image, that image MUST be displayed on the property card, gallery, and admin edit form.

---

## ✅ 5. PRE-DEPLOYMENT AI CHECKLIST

Before any AI commits code, builds, or pushes to `origin main`, it MUST verify:
- [ ] No `public_html/uploads` or `persistent_uploads` cleanup commands were added.
- [ ] `scripts/copy-dist-to-public-html.js` retains non-destructive copy behavior.
- [ ] `server/routes/upload.js` retains dual-upload to Supabase Storage + Hostinger persistent folders.
- [ ] `scripts/sync-live-uploads.js` is intact and functional.
- [ ] Local build (`npm run build`) passes cleanly without syntax or type errors.
- [ ] Live properties table in Supabase is intact with all records preserved.
