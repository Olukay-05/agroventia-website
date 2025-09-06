// scripts/get-collection-schema.ts
import fetch from 'node-fetch';

/**
 * Get schema information for a Wix collection
 * @param collectionName - Name of the collection to get schema for
 * @returns Promise with status and result/error
 */
async function getCollectionSchema(collectionName: string) {
  console.log(`🔍 Getting schema for collection "${collectionName}"...`);

  // Validate environment variables
  const wixApiToken = process.env.WIX_API_TOKEN;
  const wixSiteId = process.env.WIX_SITE_ID;

  if (!wixApiToken || !wixSiteId) {
    console.error('❌ Missing required environment variables');
    console.error('   WIX_API_TOKEN:', wixApiToken ? '✓ Set' : '✗ Missing');
    console.error('   WIX_SITE_ID:', wixSiteId ? '✓ Set' : '✗ Missing');
    return { status: 0, error: 'Missing environment variables' };
  }

  // Wix Data API endpoint for getting collection schema
  const url = `https://www.wixapis.com/wix-data/v2/namespaces/collections/${collectionName}/schema`;

  try {
    console.log(`   📡 Sending request to Wix API...`);

    // Make the API request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${wixApiToken}`,
        'wix-site-id': wixSiteId,
      },
    });

    console.log(
      `   📥 Received response: ${response.status} ${response.statusText}`
    );

    // Parse the response
    const result = await response.json();

    if (response.ok) {
      console.log(
        `   ✅ Successfully retrieved schema for "${collectionName}"`
      );
      console.log(`   📋 Schema:`, JSON.stringify(result, null, 2));
      return { status: response.status, data: result };
    } else {
      console.log(`   ❌ Failed to get schema for "${collectionName}"`);
      console.log(`   📋 Error details:`, result);
      return { status: response.status, data: result };
    }
  } catch (error) {
    console.error(
      `❌ Error getting schema for collection "${collectionName}":`,
      error
    );
    return { status: 0, error: error };
  }
}

// Example usage - get schema for a collection
// Replace 'YourCollectionName' with the actual collection name you want to check
getCollectionSchema('YourCollectionName').then(result => {
  console.log('=== COLLECTION SCHEMA RETRIEVAL COMPLETED ===');
  console.log('Final result:', result);
});
