#!/usr/bin/env node

/**
 * Database Migration Helper
 * Helps manage RLS policies during Prisma schema migrations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

const command = process.argv[2];

if (!command || !['disable', 'enable'].includes(command)) {
  console.log('Usage: node scripts/manage-rls.js [disable|enable]');
  console.log('');
  console.log('Commands:');
  console.log('  disable  - Disable RLS policies before schema migration');
  console.log('  enable   - Re-enable RLS policies after schema migration');
  process.exit(1);
}

const sqlFile = command === 'disable' 
  ? path.join(__dirname, '../prisma/disable-rls.sql')
  : path.join(__dirname, '../prisma/enable-rls.sql');

if (!fs.existsSync(sqlFile)) {
  console.error(`❌ SQL file not found: ${sqlFile}`);
  process.exit(1);
}

console.log(`\n🔧 ${command === 'disable' ? 'Disabling' : 'Enabling'} RLS policies...\n`);

try {
  // Read the SQL file
  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  // Execute using psql (requires psql to be installed)
  // Alternatively, you can use the pg library
  const tempFile = path.join(__dirname, 'temp.sql');
  fs.writeFileSync(tempFile, sql);
  
  execSync(`psql "${DATABASE_URL}" -f "${tempFile}"`, {
    stdio: 'inherit'
  });
  
  fs.unlinkSync(tempFile);
  
  console.log(`\n✅ Successfully ${command === 'disable' ? 'disabled' : 'enabled'} RLS policies\n`);
  
  if (command === 'disable') {
    console.log('Next steps:');
    console.log('1. Run: npm run db:push');
    console.log('2. Run: node scripts/manage-rls.js enable');
  }
  
} catch (error) {
  console.error(`\n❌ Error ${command === 'disable' ? 'disabling' : 'enabling'} RLS policies:`);
  console.error(error.message);
  console.log('\n💡 Alternative: Run the SQL commands manually in Supabase SQL Editor');
  console.log(`   File: ${sqlFile}`);
  process.exit(1);
}
