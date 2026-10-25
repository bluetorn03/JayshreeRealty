# Live Data & Deployment Safety Rules
> Applied to: All workflows, database operations, asset handling, and production deployments for Jayshree Realty.

## Core Rules:
1. **Never Purge or Overwrite Live Client Data:**
   - Supabase tables (`properties`, `leads`, etc.) contain live customer data. No destructive DDL (`DROP`, `TRUNCATE`) or bulk `DELETE`.
   - Live images in `public_html/uploads`, `persistent_uploads`, and Supabase bucket `property-images` are production assets and must NEVER be cleaned, purged, or deleted during builds or deployments.

2. **Hostinger Ephemeral Clone Protection:**
   - Hostinger deploys into `/hbuilds/versions/<uuid>/nodejs` and deletes old versions.
   - Any uploaded file must live outside the version tree: in Supabase Storage (`property-images`) and Hostinger persistent directories (`/home/u168098130/public_html/uploads` and `/home/u168098130/persistent_uploads`).
   - `scripts/copy-dist-to-public-html.js` must only perform non-destructive incremental copying.

3. **Multi-Root Synchronization:**
   - When writing uploads or public assets on Hostinger, always mirror to both `/home/u168098130/public_html` (Hostinger File Manager root) and `/home/u168098130/domains/jayshreerealty.com/public_html` (domain root).

4. **Local Sync Rule:**
   - Before upgrading properties or schemas locally, run `npm run sync:uploads` to fetch newly uploaded client assets.

5. **Asset Hierarchy:**
   - Real client images in `uploads/` always take precedence over `uploads/curated-fallbacks/`. Fallback placeholders must never replace actual client photos.
