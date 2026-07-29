/**
 * JAYSHREE REALTY - Automated Supabase Database Setup
 * Uses Supabase Management API with Personal Access Token
 * 
 * Usage:
 *   1. Add SUPABASE_ACCESS_TOKEN to .env (get from supabase.com/dashboard/account/tokens)
 *   2. Run: node server/migrate.js
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';
const PROJECT_REF = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

if (!SERVICE_ROLE_KEY || !SUPABASE_URL) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// Execute SQL via Supabase Management API (requires Personal Access Token)
async function executeSqlViaManagementApi(sql) {
  if (!ACCESS_TOKEN || ACCESS_TOKEN === 'your_personal_access_token_here') {
    return { ok: false, error: 'No access token' };
  }
  
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });
  
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  
  return { ok: res.ok, status: res.status, data };
}

// Execute SQL via Supabase REST RPC (if custom function exists)
async function executeSqlViaRpc(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql_query: sql })
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

// Check if tables exist using the service role key
async function checkTableExists(tableName) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?select=*&limit=0`, {
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    }
  });
  return res.ok;
}

async function main() {
  console.log('\n🚀 JAYSHREE REALTY - Database Migration');
  console.log('='.repeat(55));
  console.log(`📡 Supabase URL: ${SUPABASE_URL}`);
  console.log(`📋 Project Ref: ${PROJECT_REF}`);
  console.log(`🔑 Access Token: ${ACCESS_TOKEN && ACCESS_TOKEN !== 'your_personal_access_token_here' ? '✅ Present' : '❌ Missing'}`);
  console.log('');

  // Check current table status
  console.log('🔍 Checking database tables...\n');
  const tables = ['admin_users', 'properties', 'leads', 'categories', 'reviews', 'hero_settings', 'popup_settings', 'site_settings', 'counters', 'location_nodes', 'analytics_events', 'activity_logs'];
  
  let missingCount = 0;
  for (const t of tables) {
    const exists = await checkTableExists(t);
    if (exists) {
      console.log(`  ✅ ${t}`);
    } else {
      console.log(`  ❌ ${t} (missing)`);
      missingCount++;
    }
  }

  if (missingCount === 0) {
    console.log('\n✅ All tables already exist! Database is ready.\n');
    return;
  }

  console.log(`\n⚠️  ${missingCount} tables need to be created.\n`);

  // Try via Management API
  if (ACCESS_TOKEN && ACCESS_TOKEN !== 'your_personal_access_token_here') {
    console.log('📤 Running migration via Supabase Management API...\n');
    
    const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ supabase_schema.sql not found!');
      process.exit(1);
    }
    
    const sql = fs.readFileSync(schemaPath, 'utf8');
    const result = await executeSqlViaManagementApi(sql);
    
    if (result.ok) {
      console.log('✅ Migration executed successfully via Management API!');
      console.log('\nVerifying tables...\n');
      for (const t of tables) {
        const exists = await checkTableExists(t);
        console.log(`  ${exists ? '✅' : '❌'} ${t}`);
      }
    } else {
      console.error(`❌ Management API failed (${result.status}):`, JSON.stringify(result.data, null, 2));
      showManualInstructions();
    }
  } else {
    // No access token - show manual instructions
    showManualInstructions();
  }
}

function showManualInstructions() {
  console.log('\n' + '═'.repeat(55));
  console.log('📝 MANUAL SETUP REQUIRED');
  console.log('═'.repeat(55));
  console.log('\nTo create the database tables, run the SQL schema in Supabase:\n');
  console.log('  1. Open: https://supabase.com/dashboard/project/pzmjewrnnzntvtueqmcq/sql/new');
  console.log('  2. Click "New Query" (or clear existing content)');
  console.log('  3. Copy the contents of: supabase_schema.sql');
  console.log('  4. Paste into the SQL Editor');
  console.log('  5. Click "Run" (or press Ctrl+Enter)');
  console.log('  6. Look for the green success notification');
  console.log('\n  OR for automatic setup:');
  console.log('  1. Go to: https://supabase.com/dashboard/account/tokens');
  console.log('  2. Click "Generate new token"');
  console.log('  3. Copy the token');
  console.log('  4. Set in .env: SUPABASE_ACCESS_TOKEN=your_token_here');
  console.log('  5. Re-run: node server/migrate.js\n');
  console.log('═'.repeat(55));
}

main().catch(e => {
  console.error('\n❌ Migration error:', e.message);
  process.exit(1);
});
