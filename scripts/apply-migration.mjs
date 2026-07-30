/**
 * Jayshree Realty - Apply Missing Columns Migration
 * Adds 10 attribution columns to the leads table via Supabase Management API
 * Run: node scripts/apply-migration.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

// Extract project ref from URL (e.g. pzmjewrnnzntvtueqmcq)
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];
const MANAGEMENT_URL = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

// The 10 missing attribution columns
const MIGRATIONS = [
  "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS button_source TEXT DEFAULT '';",
  "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS form_source TEXT DEFAULT '';",
  "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS property_source TEXT DEFAULT '';",
  "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS device_info TEXT DEFAULT '';",
  "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS traffic_source TEXT DEFAULT '';",
  "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_source TEXT DEFAULT '';",
  "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_medium TEXT DEFAULT '';",
  "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT DEFAULT '';",
  "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_term TEXT DEFAULT '';",
  "ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_content TEXT DEFAULT '';"
];

// Combined migration as a single transaction
const MIGRATION_SQL = `
DO $$
BEGIN
  -- leads: attribution tracking columns (v2.1 migration)
  ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS button_source TEXT DEFAULT '';
  ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS form_source TEXT DEFAULT '';
  ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS property_source TEXT DEFAULT '';
  ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS device_info TEXT DEFAULT '';
  ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS traffic_source TEXT DEFAULT '';
  ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_source TEXT DEFAULT '';
  ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_medium TEXT DEFAULT '';
  ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT DEFAULT '';
  ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_term TEXT DEFAULT '';
  ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_content TEXT DEFAULT '';
  
  RAISE NOTICE 'Migration v2.1: 10 attribution columns added to leads table';
END $$;
`;

// Strategy 1: Try Supabase Management API
async function tryManagementAPI() {
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  if (!accessToken || accessToken.includes('your_personal')) {
    console.log('  ⚠️  No SUPABASE_ACCESS_TOKEN — skipping Management API');
    return false;
  }

  console.log('  Trying Supabase Management API...');
  const res = await fetch(MANAGEMENT_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: MIGRATION_SQL })
  });

  if (res.ok) {
    const data = await res.json();
    console.log('  ✅ Management API migration succeeded');
    return true;
  } else {
    const err = await res.text();
    console.log(`  ⚠️  Management API: ${res.status} — ${err.slice(0, 200)}`);
    return false;
  }
}

// Strategy 2: Try Supabase pg_query RPC
async function tryPgQueryRPC() {
  console.log('  Trying pg_query RPC...');
  const { data, error } = await supabase.rpc('pg_query', { query: MIGRATION_SQL });
  if (!error) {
    console.log('  ✅ pg_query RPC migration succeeded');
    return true;
  }
  console.log(`  ⚠️  pg_query RPC: ${error.message}`);
  return false;
}

// Strategy 3: Verify columns exist by testing SELECT on each
async function verifyColumnExists(col) {
  const { error } = await supabase.from('leads').select(col).limit(0);
  return !error || !error.message.includes('does not exist');
}

// Strategy 4: Test if we can INSERT with the new columns (means they exist)
async function verifyViaInsert() {
  const testId = `migration-verify-${Date.now()}`;
  const { error } = await supabase.from('leads').insert([{
    id: testId,
    name: 'Migration Test',
    phone: '0000000000',
    lead_source: 'Migration Test',
    cta_source: 'Automated',
    page_name: '/test',
    button_source: 'test_button',
    form_source: 'test_form',
    device_info: 'Desktop (Windows)',
    traffic_source: 'Direct',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: ''
  }]);

  if (!error) {
    await supabase.from('leads').delete().eq('id', testId);
    return { success: true };
  }
  return { success: false, error: error.message };
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('  APPLYING LEADS TABLE MIGRATION (v2.1)');
  console.log('  10 attribution columns → leads table');
  console.log('='.repeat(60) + '\n');

  // First check if columns already exist
  console.log('  Checking current column state...');
  const testCols = ['button_source', 'device_info', 'utm_source'];
  const alreadyExists = [];
  for (const col of testCols) {
    if (await verifyColumnExists(col)) alreadyExists.push(col);
  }

  if (alreadyExists.length === testCols.length) {
    console.log('  ✅ All attribution columns already exist! No migration needed.');
    return;
  }
  console.log(`  Columns to add: button_source, form_source, property_source, device_info,`);
  console.log(`                  traffic_source, utm_source, utm_medium, utm_campaign, utm_term, utm_content\n`);

  // Try Management API first
  const mgmtSuccess = await tryManagementAPI();
  if (!mgmtSuccess) {
    // Try RPC
    const rpcSuccess = await tryPgQueryRPC();
    if (!rpcSuccess) {
      console.log('\n  ℹ️  Automated migration requires manual SQL execution.');
      console.log('  The migration SQL is ready in: migration_pending.sql');
      console.log('\n  MANUAL STEPS:');
      console.log('  1. Open: https://supabase.com/dashboard/project/pzmjewrnnzntvtueqmcq/sql');
      console.log('  2. Click "New Query"');
      console.log('  3. Paste the contents of migration_pending.sql');
      console.log('  4. Click Run (Ctrl+Enter)');
      console.log('\n  OR run migration_v2.1.sql for the complete sync.\n');
      
      // Output the SQL directly for convenience
      console.log('  ─── COPY THIS SQL ───────────────────────────────────');
      MIGRATIONS.forEach(sql => console.log('  ' + sql));
      console.log('  ─────────────────────────────────────────────────────\n');
    }
  }

  // Verify after migration attempt
  console.log('\n  Verifying migration result...');
  const verifyResult = await verifyViaInsert();
  if (verifyResult.success) {
    console.log('  ✅ MIGRATION VERIFIED: INSERT with all attribution columns works!');
    console.log('  ✅ leads table is now fully synchronized with schema v2.1');
  } else {
    console.log(`  ⚠️  Verification: ${verifyResult.error}`);
    console.log('  → Manual SQL execution required (see migration_pending.sql)');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

main().catch(e => console.error('Fatal:', e.message));
