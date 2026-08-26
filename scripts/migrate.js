/**
 * Supabase Data Migration Helper Script
 * This script copies data from your OLD Supabase project to your NEW Supabase project.
 * 
 * Instructions:
 * 1. Open this file and fill in your OLD and NEW Supabase project credentials below.
 * 2. Make sure you have run the 'supabase_setup.sql' script in your NEW Supabase project's SQL editor first.
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

  console.log("⚡ Starting database migration...");
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

    // 2. Clear default mock/records in new project to prevent duplication
    const { error: deleteError } = await newClient
      .from(table)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all (forUUID id)

    // For tables with text primary key (like site_settings)
    if (table === 'site_settings') {
      await newClient.from(table).delete().neq('key', 'dummy_value_to_delete_all');
    }

    // 3. Insert records into new project
    const { error: insertError } = await newClient
      .from(table)
      .insert(records);

    if (insertError) {
      console.error(`❌ Error inserting records into new project's [${table}] table:`, insertError.message);
    } else {
      console.log(`✅ Successfully copied ${records.length} records into new project's [${table}] table.`);
    }
  }

  console.log("\n🏁 Migration complete! Your new Supabase project tables are fully synced.");
}

runMigration().catch(err => {
  console.error("❌ Fatal migration error:", err);
});
