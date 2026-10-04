const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: '.env.local', override: true });

const WIX_API_TOKEN = process.env.WIX_API_TOKEN;
const WIX_SITE_ID = process.env.WIX_SITE_ID;
const WIX_API_BASE_URL = 'https://www.wixapis.com/wix-data/v2/items';

const collections = [
  'HeroContent',
  'AboutContent',
  'ServicesContent',
  'ProductsContent',
  'Import1',
  'ContactContent',
  'OurCoreValues',
  'CarouselImageDisplay',
  'Import5',
  'Import3',
  'Import4'
];

async function pullCollection(name) {
  try {
    const res = await fetch(`${WIX_API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WIX_API_TOKEN}`,
        'Content-Type': 'application/json',
        'wix-site-id': WIX_SITE_ID,
      },
      body: JSON.stringify({
        dataCollectionId: name,
        cursorPaging: { limit: 50 },
        returnTotalCount: true,
        includeReferencedItems: ['*']
      })
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, status: res.status, error: err };
    }

    const data = await res.json();
    return {
      success: true,
      count: data.dataItems ? data.dataItems.length : 0,
      totalCount: data.pagingMetadata ? data.pagingMetadata.total : 0,
      items: data.dataItems ? data.dataItems.map(d => d.data) : []
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function run() {
  console.log('--- Wix Live Collections Audit ---');
  const results = {};
  for (const c of collections) {
    process.stdout.write(`Fetching ${c}... `);
    const res = await pullCollection(c);
    if (res.success) {
      console.log(`OK (${res.count} items)`);
      results[c] = res;
    } else {
      console.log(`FAILED (${res.status || res.error})`);
      results[c] = res;
    }
  }

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'wix_live_snapshot.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Saved live snapshot to ${outputPath}`);
}

run().catch(console.error);
