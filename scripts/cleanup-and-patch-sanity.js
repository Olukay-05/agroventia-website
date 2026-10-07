const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });
const { COMMODITY_PORTFOLIO } = require('../src/lib/api/products-portfolio');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hn79lbvx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-01',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

const OBSOLETE_SKU_DOC_IDS = [
  'product-agricultural-industrial-products',
  'product-feed-animal-nutrition',
  'product-food-agricultural-ingredients',
  'product-fruits-berries',
  'product-natural-sweeteners-extracts',
  'product-oils-butters',
  'product-oilseeds-nuts-specialty-seeds',
  'product-processed-value-added-foods',
  'product-pulses-legumes',
  'product-spices-botanicals-specialty-crops',
];

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`\n======================================================`);
  console.log(`🌾 Sanity Product Catalog Cleanup & Category Patch`);
  console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE MUTATION'}`);
  console.log(`======================================================\n`);

  // 1. Check obsolete documents
  const allProducts = await client.fetch(`*[_type == "product"]{
    _id,
    sku,
    "title": coalesce(productName.en, title, ""),
    category,
    corridor,
    slug
  }`);
  console.log(`Current product count in Sanity: ${allProducts.length}`);

  const obsoleteDocs = allProducts.filter(p => {
    const rawId = p._id.replace(/^drafts\./, '');
    return OBSOLETE_SKU_DOC_IDS.includes(rawId) || (p.sku && p.sku.startsWith('AGV-'));
  });

  console.log(`Found ${obsoleteDocs.length} obsolete placeholder documents to purge:`);
  for (const doc of obsoleteDocs) {
    console.log(`  - [${doc._id}] SKU: ${doc.sku} | Title: ${doc.title}`);
  }

  if (!isDryRun) {
    for (const doc of obsoleteDocs) {
      const baseId = doc._id.replace(/^drafts\./, '');
      try {
        await client.delete(doc._id);
        console.log(`  Deleted ${doc._id}`);
      } catch (err) {
        console.warn(`  Failed to delete ${doc._id}:`, err.message);
      }
      try {
        await client.delete(`drafts.${baseId}`);
      } catch (e) {
        // May not exist
      }
    }
  }

  // 2. Patch 46 real commodities with category and corridor
  console.log(`\nPatching 46 commodities with canonical categories and corridors...`);
  let patchedCount = 0;

  for (const commodity of COMMODITY_PORTFOLIO) {
    const docId = `product-${commodity.slug}`;
    const categoryName = commodity.en.category;
    const corridor = commodity.corridor;

    console.log(`  Target: ${docId} -> Category: "${categoryName}", Corridor: "${corridor}"`);

    if (!isDryRun) {
      try {
        await client
          .patch(docId)
          .set({
            category: categoryName,
            corridor: corridor,
          })
          .commit();
        patchedCount++;
      } catch (err) {
        console.warn(`  Failed to patch ${docId}:`, err.message);
      }
    }
  }

  console.log(`\nFinished! Patched: ${patchedCount} / ${COMMODITY_PORTFOLIO.length}`);
}

main().catch(console.error);
