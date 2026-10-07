// scripts/fix-and-sync-tropical-assets.ts
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from 'next-sanity';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const CORRECT_MAPPING: { screenshot: string; productFile: string; slug: string; title: string }[] = [
  {
    screenshot: 'Screenshot 2025-09-05 092835.png',
    productFile: 'turmeric-fingers.png',
    slug: 'turmeric-fingers',
    title: 'Turmeric Fingers',
  },
  {
    screenshot: 'Screenshot 2025-09-04 001324.png',
    productFile: 'raw-cocoa-pods.png',
    slug: 'raw-cocoa-pods-and-beans',
    title: 'Raw Cocoa Pods & Beans',
  },
  {
    screenshot: 'Screenshot 2025-09-03 214309.png',
    productFile: 'raw-shea-butter.png',
    slug: 'raw-shea-butter',
    title: 'Raw Shea Butter',
  },
  {
    screenshot: 'Screenshot 2025-09-04 222626.png',
    productFile: 'raw-shea-nuts.png',
    slug: 'raw-shea-nuts',
    title: 'Raw Shea Nuts',
  },
  {
    screenshot: 'Screenshot 2025-09-05 092943.png',
    productFile: 'whole-cloves.png',
    slug: 'whole-cloves',
    title: 'Whole Cloves',
  },
  {
    screenshot: 'Screenshot 2025-09-04 222144.png',
    productFile: 'natural-sesame-seeds.png',
    slug: 'natural-white-sesame-seeds',
    title: 'Natural White Sesame Seeds',
  },
  {
    screenshot: 'Screenshot 2025-09-04 211027.png',
    productFile: 'dried-hibiscus-flowers.png',
    slug: 'dried-hibiscus-flowers',
    title: 'Dried Hibiscus Flowers (Zobo)',
  },
  {
    screenshot: 'Screenshot 2025-09-04 211643.png',
    productFile: 'tiger-nuts.png',
    slug: 'tiger-nuts',
    title: 'Tiger Nuts',
  },
  {
    screenshot: 'Screenshot 2025-09-04 213729.png',
    productFile: 'hardwood-charcoal.png',
    slug: 'hardwood-charcoal',
    title: 'Hardwood Charcoal',
  },
  {
    screenshot: 'Screenshot 2025-09-04 193712.png',
    productFile: 'fresh-kola-nuts.png',
    slug: 'fresh-kola-nuts',
    title: 'Fresh & Dried Kola Nuts',
  },
  {
    screenshot: 'Screenshot 2025-09-04 211843.png',
    productFile: 'dried-split-ginger.png',
    slug: 'dried-split-ginger',
    title: 'Dried Split Ginger',
  },
  {
    screenshot: 'Screenshot 2025-09-04 210555.png',
    productFile: 'whole-ginger-root.png',
    slug: 'whole-ginger-root',
    title: 'Whole Dried Ginger Root',
  },
  {
    screenshot: 'Screenshot 2025-09-04 211843.png',
    productFile: 'ginger-rhizome-slices.png',
    slug: 'ginger-rhizome-slices',
    title: 'Ginger Rhizome Slices',
  },
  {
    screenshot: 'Screenshot 2025-09-07 190704.png',
    productFile: 'yellow-soybeans.png',
    slug: 'yellow-soybeans',
    title: 'Conventional Yellow Soybeans',
  },
];

async function main() {
  const publicDir = path.join(process.cwd(), 'public');
  const productsDir = path.join(publicDir, 'products');

  console.log('====================================================');
  console.log('Step 1: Remapping screenshots to correct product files');
  console.log('====================================================');

  for (const item of CORRECT_MAPPING) {
    const srcPath = path.join(publicDir, item.screenshot);
    const destPath = path.join(productsDir, item.productFile);

    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️ Source file not found: ${srcPath}`);
      continue;
    }

    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied "${item.screenshot}" -> "${item.productFile}" for [${item.title}]`);
  }

  console.log('\n====================================================');
  console.log('Step 2: Uploading corrected assets directly to Sanity Studio');
  console.log('====================================================');

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !token) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN is missing!');
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-03-01',
    useCdn: false,
  });

  for (const item of CORRECT_MAPPING) {
    const localFilePath = path.join(productsDir, item.productFile);
    if (!fs.existsSync(localFilePath)) {
      console.warn(`⚠️ Product file not found: ${localFilePath}`);
      continue;
    }

    const docId = `product-${item.slug}`;
    console.log(`Uploading ${item.productFile} to Sanity for ${docId}...`);

    const asset = await client.assets.upload('image', fs.createReadStream(localFilePath), {
      filename: item.productFile,
      contentType: 'image/png',
    });

    console.log(`  Uploaded asset: ${asset._id} (${asset.url})`);

    // Patch Sanity product document so productImage points dynamically to the uploaded asset
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
        images: [
          {
            _type: 'image',
            _key: `asset-${item.slug}`,
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
        ],
      })
      .commit();

    console.log(`  ✅ Linked asset ${asset._id} to document ${docId}`);
  }

  console.log('\n====================================================');
  console.log('🎉 Successfully fixed local files and synced to Sanity Studio!');
  console.log('====================================================\n');
}

main().catch(err => {
  console.error('Fatal error in fix script:', err);
  process.exit(1);
});
