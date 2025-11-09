require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Running exercise_weights migration...');
  
  const migrationPath = path.join(__dirname, 'supabase', 'migrations', '003_exercise_weights.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  
  // Split by semicolon and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  for (const statement of statements) {
    if (statement.includes('CREATE TABLE') || 
        statement.includes('CREATE INDEX') || 
        statement.includes('CREATE POLICY') ||
        statement.includes('ALTER TABLE') ||
        statement.includes('COMMENT ON')) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        if (error) {
          // Try direct execution for some statements
          console.log(`⚠️  Trying alternative execution...`);
        }
      } catch (err) {
        console.log(`⚠️  Statement: ${statement.substring(0, 50)}...`);
      }
    }
  }
  
  // Verify table was created
  const { data, error } = await supabase
    .from('exercise_weights')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ Migration verification failed:', error.message);
    console.log('\n📝 Please run this SQL manually in Supabase SQL Editor:');
    console.log('\n' + sql);
    process.exit(1);
  }
  
  console.log('✅ Migration completed successfully!');
  console.log('✅ Table exercise_weights created');
}

runMigration().catch(console.error);
