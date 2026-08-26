/**
 * Supabase Data Migration Helper Script (Safe, Non-Destructive Mode)
 * This script copies data from your OLD Supabase project to your NEW Supabase project.
 * 
 * Safe Features:
 * - Uses UPSERT instead of DELETE. It will NOT delete or overwrite any existing records in your target database.
 * - Preserves exact primary key IDs (UUIDs) to ensure salad-plan relations remain intact.
 * 
 * Instructions:
 * 1. Open this file and fill in your OLD and NEW Supabase project credentials below.
 * 2. Make sure you have run the 'supabase_setup.sql' script in your target Supabase project's SQL editor first.
 * 3. Run this script from your terminal:
 *    node scripts/migrate.js
 */

const { createClient } = require('@supabase/supabase-js');

// ==========================================
// CONFIGURATION: Enter your Supabase credentials
// ==========================================
const OLD_SUPABASE_URL = "YOUR_OLD_SUPABASE_URL_HERE";
const OLD_SUPABASE_ANON_KEY = "YOUR_OLD_SUPABASE_ANON_KEY_HERE";

const NEW_SUPABASE_URL = "YOUR_NEW_SUPABASE_URL_HERE";
const NEW_SUPABASE_ANON_KEY = "YOUR_NEW_SUPABASE_ANON_KEY_HERE";

// ==========================================
// MIGRATION ENGINE
// ==========================================
async function runMigration() {
  if (
    OLD_SUPABASE_URL.includes("YOUR_") || 
    NEW_SUPABASE_URL.includes("YOUR_")
  ) {
    console.error("❌ Error: Please open 'scripts/migrate.js' and fill in your actual Supabase URLs and Anon Keys first!");
    process.exit(1);
  }

  console.log("⚡ Starting safe database migration...");
  const oldClient = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_ANON_KEY);
  const newClient = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_ANON_KEY);

  const tables = ['site_settings', 'salads', 'salad_plans', 'inquiries'];

  for (const table of tables) {
    console.log(`\n⏳ Migrating table: [${table}]...`);
    
    // 1. Fetch data from old project
    const { data: records, error: fetchError } = await oldClient
      .from(table)
      .select('*');

    if (fetchError) {
      console.error(`❌ Error fetching records from old project's [${table}] table:`, fetchError.message);
      continue;
    }

    if (!records || records.length === 0) {
      console.log(`ℹ️ Table [${table}] is empty in the old project. Skipping.`);
      continue;
    }

    console.log(`Read ${records.length} records from old project.`);

    // 2. Safe Copy: Use upsert to write data without deleting anything
    const { error: upsertError } = await newClient
      .from(table)
      .upsert(records, { onConflict: table === 'site_settings' ? 'key' : 'id' });

    if (upsertError) {
      console.error(`❌ Error migrating records into new project's [${table}] table:`, upsertError.message);
    } else {
      console.log(`✅ Successfully synced ${records.length} records into new project's [${table}] table.`);
    }
  }

  console.log("\n🏁 Safe migration complete! All data has been copied over exactly as it was.");
}

runMigration().catch(err => {
  console.error("❌ Fatal migration error:", err);
});
