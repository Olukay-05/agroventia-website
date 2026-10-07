// src/scripts/verify-carousel-setup.ts
// Script to verify CarouselImageDisplay collection setup

console.log('🔍 Verifying CarouselImageDisplay collection setup...\n');

// Check environment variables
console.log('1. Checking environment variables:');
const hasToken = !!process.env.WIX_API_TOKEN;
const hasSiteId = !!process.env.WIX_SITE_ID;

console.log(`   WIX_API_TOKEN present: ${hasToken ? '✅ Yes' : '❌ No'}`);
console.log(`   WIX_SITE_ID present: ${hasSiteId ? '✅ Yes' : '❌ No'}`);

if (!hasToken || !hasSiteId) {
  console.log(
    '\n⚠️  Please set WIX_API_TOKEN and WIX_SITE_ID in your .env.local file\n'
  );
  process.exit(1);
}

console.log('\n2. Environment variables are properly configured!');

console.log('\n3. Next steps to verify your CarouselImageDisplay collection:');
console.log('   a. Log in to your Wix CMS');
console.log('   b. Navigate to the Collections section');
console.log(
  '   c. Verify that a collection named "CarouselImageDisplay" exists'
);
console.log('   d. Check that the collection has the following fields:');
console.log('      - image (URL field)');
console.log('      - imageDescription (Text field)');
console.log('      - tagline (Text field)');
console.log(
  '   e. Verify that the collection has at least one item with data in these fields'
);

console.log('\n4. To test the carousel:');
console.log('   a. Start your development server: npm run dev');
console.log('   b. Visit http://localhost:3000 to see the carousel');
console.log(
  '   c. Visit http://localhost:3000/api/test-carousel to test the API endpoint'
);
console.log(
  '   d. Visit http://localhost:3000/test/carousel to see detailed carousel data'
);

console.log('\n✅ Verification complete!');
