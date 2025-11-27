#!/usr/bin/env node

/**
 * Fastcrew Setup Validation Script
 * Checks if all required environment variables and dependencies are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Fastcrew Setup Validation\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found. Please copy .env.example to .env and fill in your credentials.');
  process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');

// Check required environment variables
const requiredVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY'
];

const optionalVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'AWS_S3_BUCKET'
];

console.log('✅ Environment Variables Check:');

let hasRequired = true;
requiredVars.forEach(varName => {
  const value = envContent.match(new RegExp(`${varName}=(.*)`, 'm'));
  if (value && value[1] && !value[1].includes('your_') && !value[1].includes('placeholder')) {
    console.log(`  ✅ ${varName}: Configured`);
  } else {
    console.log(`  ❌ ${varName}: Missing or placeholder value`);
    hasRequired = false;
  }
});

console.log('\n📝 Optional Variables (for full features):');
optionalVars.forEach(varName => {
  const value = envContent.match(new RegExp(`${varName}=(.*)`, 'm'));
  if (value && value[1] && !value[1].startsWith('#') && !value[1].includes('your_')) {
    console.log(`  ✅ ${varName}: Configured`);
  } else {
    console.log(`  ⚠️  ${varName}: Not configured (optional)`);
  }
});

// Check package.json
const packagePath = path.join(process.cwd(), 'package.json');
let packageJson = null;
if (fs.existsSync(packagePath)) {
  packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('\n📦 Package Dependencies:');
  
  const requiredDeps = ['@clerk/nextjs', 'next', 'react', 'react-dom'];
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`  ✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`  ❌ ${dep}: Missing`);
    }
  });
}

// Check Next.js version compatibility
const nextVersion = packageJson?.dependencies?.next;
if (nextVersion) {
  const versionMatch = nextVersion.match(/(\d+)\./);
  if (versionMatch && parseInt(versionMatch[1]) >= 14) {
    console.log(`  ✅ Next.js version ${nextVersion}: Compatible with Clerk v5`);
  } else {
    console.log(`  ⚠️  Next.js version ${nextVersion}: Please ensure compatibility with Clerk v5`);
  }
}

// Check file structure
console.log('\n📁 Project Structure:');
const keyFiles = [
  'src/middleware.ts',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/onboarding/page.tsx',
  'src/lib/auth/roles.ts',
  'src/app/api/profile/route.ts'
];

keyFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}: Exists`);
  } else {
    console.log(`  ❌ ${file}: Missing`);
  }
});

// Final validation
console.log('\n🎯 Validation Summary:');
if (hasRequired) {
  console.log('✅ All required variables are configured!');
  console.log('🚀 You can now run: npm run dev');
  console.log('\n📚 Next steps:');
  console.log('1. Get your Clerk credentials from https://dashboard.clerk.com/');
  console.log('2. Update .env file with your actual keys');
  console.log('3. Run: npm install && npm run dev');
  console.log('\n📖 For detailed setup instructions, see SETUP.md');
} else {
  console.log('❌ Some required variables are missing.');
  console.log('🔧 Please update your .env file with valid Clerk credentials.');
  process.exit(1);
}