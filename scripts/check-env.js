#!/usr/bin/env node

/**
 * Environment Variable Checker
 * Validates and displays environment configuration
 */

const fs = require('fs');
const path = require('path');

const envFiles = [
  '.env',
  '.env.development.local',
  '.env.local',
];

console.log('🔍 Checking environment files...\n');

envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (fs.existsSync(filePath)) {
    console.log(`✅ Found: ${file}`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Look for DATABASE_URL
      const dbUrlLine = lines.find(line => line.trim().startsWith('DATABASE_URL'));
      
      if (dbUrlLine) {
        // Mask the password in the URL for security
        const maskedUrl = dbUrlLine.replace(
          /(:\/\/)([^:]+):([^@]+)@/,
          '$1$2:****@'
        );
        console.log(`   DATABASE_URL found: ${maskedUrl}`);
      } else {
        console.log(`   ⚠️  DATABASE_URL not found in this file`);
      }
      
      // Check for common issues
      const hasNullBytes = content.includes('\0');
      const hasInvalidChars = /[\x00-\x08\x0B-\x0C\x0E-\x1F]/.test(content);
      
      if (hasNullBytes || hasInvalidChars) {
        console.log(`   ❌ WARNING: File contains illegal characters!`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error reading file: ${error.message}`);
    }
    
    console.log('');
  } else {
    console.log(`❌ Not found: ${file}\n`);
  }
});

console.log('\n📋 Current DATABASE_URL from process.env:');
if (process.env.DATABASE_URL) {
  const maskedUrl = process.env.DATABASE_URL.replace(
    /(:\/\/)([^:]+):([^@]+)@/,
    '$1$2:****@'
  );
  console.log(`   ${maskedUrl}`);
} else {
  console.log('   ⚠️  DATABASE_URL not set in environment');
}
