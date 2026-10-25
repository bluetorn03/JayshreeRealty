# 🛡️ JAYSHREE REALTY - SYSTEM & DATA SAFETY RULES
> **MANDATORY INSTRUCTION FOR ALL AI CODING ASSISTANTS & AUTOMATION:**
> Refer to [AGENTS.md](file:///c:/Users/ADMIN/OneDrive/Documents/Websites/realestate/JayshreeRealty/AGENTS.md) and [.agents/rules/live-data-safety.md](file:///c:/Users/ADMIN/OneDrive/Documents/Websites/realestate/JayshreeRealty/.agents/rules/live-data-safety.md).

## Critical Non-Negotiables:
1. **LIVE CLIENT DATA IS SACROSANCT:**
   - Never run `DROP TABLE`, `TRUNCATE`, or destructive bulk `DELETE` on live Supabase tables (`properties`, `leads`, etc.).
   - Never purge, overwrite, or delete images in `/public_html/uploads/`, `/persistent_uploads/`, or Supabase storage bucket `property-images`.
2. **HOSTINGER AUTO-DEPLOY PURGE PROTECTION:**
   - Hostinger clones to `/hbuilds/versions/<uuid>/nodejs` and deletes previous versions.
   - All uploaded images and client files must remain in permanent paths outside the version folder.
   - `scripts/copy-dist-to-public-html.js` must NEVER execute destructive cleanup on `public_html/uploads/`.
3. **SYNC BEFORE UPGRADE:**
   - Run `npm run sync:uploads` to pull newly uploaded client images to local before developing.
4. **ASSET HIERARCHY:**
   - Real client images in `uploads/` always take top priority over `uploads/curated-fallbacks/`. Fallback vector badges must NEVER replace real photos.
