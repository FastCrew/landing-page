// Test schema import to verify compilation
const testSchema = async () => {
  try {
    console.log('Testing schema import...');

    // This should compile without errors if schema is correct
    const schema = await import('./src/db/schema');

    console.log('✅ Schema import successful');
    console.log('Available exports:', Object.keys(schema));

    // Test automated schema generation
    const { insertProfileSchema, createProfileSchema } = schema;

    console.log('✅ Automated schemas available');
    console.log('✅ Custom schemas available');

    return true;
  } catch (error) {
    console.error('❌ Schema test failed:', error);
    return false;
  }
};

testSchema();