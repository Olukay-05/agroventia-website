// scripts/sync-tropical-assets-to-sanity.ts
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from 'next-sanity';
import { COMMODITY_PORTFOLIO } from '../src/lib/api/products-portfolio';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function main() {
  const africaCommodities = COMMODITY_PORTFOLIO.filter(c => c.corridor === 'africa');
  console.log(`Syncing ${africaCommodities.length} tropical assets to Sanity...`);

  for (const c of africaCommodities) {
    const localPath = path.join(process.cwd(), 'public', c.image);
    if (!fs.existsSync(localPath)) {
      console.warn(`File not found: ${localPath}`);
      continue;
    }

    const docId = `product-${c.slug}`;
    console.log(`Uploading ${path.basename(localPath)} -> ${docId}...`);

    const asset = await client.assets.upload('image', fs.createReadStream(localPath), {
      filename: path.basename(localPath),
      contentType: 'image/png',
    });

    await client
      .patch(docId)
      .set({
        productImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
      })
      .commit();

    console.log(`  ✅ Linked ${asset._id} to ${docId}`);
  }

  console.log(`Tropical assets sync complete!`);
}

main().catch(console.error);
