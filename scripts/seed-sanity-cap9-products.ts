// scripts/seed-sanity-cap9-products.ts
/**
 * CAP-9: Product Architecture Restructuring Seeder Script
 * - Purges obsolete category placeholder documents (e.g. product-agricultural-beverages-extracts)
 * - Seeds/upserts the full 46+ commodity portfolio across Canadian and West African corridors
 * - Seeds multilingual names, descriptions, sourcing origins, and Typical Quality Parameters (en, fr, esp)
 * - Tags the 9 flagship commodities with isFeatured: true
 * - Configures toggleable Export & Packaging Logistics (displayLogistics)
 */

import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from 'next-sanity';
import { COMMODITY_PORTFOLIO, FLAGSHIP_FEATURED_SLUGS } from '../src/lib/api/products-portfolio';

// Load environment variables (.env.local has priority)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

interface ScriptOptions {
  dryRun: boolean;
  verbose: boolean;
  purgeLegacy: boolean;
}

const parseArgs = (): ScriptOptions => {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    purgeLegacy: !args.includes('--no-purge'),
  };
};

// Obsolete placeholder IDs from legacy category mapping
const LEGACY_PLACEHOLDER_IDS = [
  'product-agricultural-beverages-extracts',
  'product-grains-cereals',
  'product-legumes-pulses',
  'product-nuts-seeds',
  'product-oilseeds-oils',
  'product-roots-tubers',
  'product-spices-herbs',
  'product-vegetables-fruits',
  'product-animal-feed-forage',
  'product-fibers-industrial',
  'product-medicinal-aromatic',
  'product-specialty-organic',
  // Legacy import placeholder categories with SKUs
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
  const options = parseArgs();
  console.log(`\n========================================================`);
  console.log(`🌾 AgroVentia CAP-9 Product Portfolio Seeder`);
  console.log(`Mode: ${options.dryRun ? '🔍 DRY RUN (no mutations)' : '🚀 LIVE SEEDING'}`);
  console.log(`Purge Legacy Placeholders: ${options.purgeLegacy ? 'YES' : 'NO'}`);
  console.log(`Total Portfolio Commodities: ${COMMODITY_PORTFOLIO.length}`);
  console.log(`Flagship Featured Count: ${FLAGSHIP_FEATURED_SLUGS.length}`);
  console.log(`========================================================\n`);

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId) {
    console.error('❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID is not configured in environment.');
    if (!options.dryRun) process.exit(1);
  }

  const client = (projectId && token)
    ? createClient({
        projectId,
        dataset,
        token,
        apiVersion: '2024-01-01',
        useCdn: false,
      })
    : null;

  if (!client && !options.dryRun) {
    console.error('❌ Error: SANITY_API_WRITE_TOKEN is missing. Provide write token for live mutations.');
    process.exit(1);
  }

  // 1. Purge Phase
  if (options.purgeLegacy) {
    console.log(`\n🧹 [Phase 1] Purging obsolete placeholder category documents...`);
    for (const legacyId of LEGACY_PLACEHOLDER_IDS) {
      if (options.dryRun) {
        console.log(`  [DRY RUN] Would delete placeholder document: ${legacyId}`);
      } else if (client) {
        try {
          await client.delete(legacyId);
          console.log(`  ✅ Deleted placeholder document: ${legacyId}`);
        } catch (err: any) {
          // Document may not exist, ignore 404
          if (options.verbose) {
            console.log(`  ℹ️ Notice for ${legacyId}: ${err?.message || err}`);
          }
        }
      }
    }
  }

  // 2. Media Asset Pre-check
  console.log(`\n🖼️ [Phase 2] Verifying public commodity image assets...`);
  const publicDir = path.resolve(process.cwd(), 'public');
  let verifiedMediaCount = 0;

  for (const commodity of COMMODITY_PORTFOLIO) {
    if (commodity.image.startsWith('/')) {
      const localFilePath = path.join(publicDir, commodity.image);
      if (fs.existsSync(localFilePath)) {
        verifiedMediaCount++;
      } else if (options.verbose) {
        console.warn(`  ⚠️ Asset not found locally: ${commodity.image}`);
      }
    } else {
      verifiedMediaCount++;
    }
  }
  console.log(`  Verified ${verifiedMediaCount} / ${COMMODITY_PORTFOLIO.length} media assets.`);

  // 3. Seed / Upsert Phase
  console.log(`\n🌱 [Phase 3] Seeding genuine multi-corridor commodities...`);
  let seededCount = 0;
  let featuredCount = 0;

  for (const commodity of COMMODITY_PORTFOLIO) {
    const isFeatured = Boolean(
      commodity.isFeatured || FLAGSHIP_FEATURED_SLUGS.includes(commodity.slug as any)
    );
    if (isFeatured) featuredCount++;

    const docId = `product-${commodity.slug}`;

    const sanityDoc: { _id: string; _type: string; [key: string]: any } = {
      _id: docId,
      _type: 'product',
      productName: {
        _type: 'localeString',
        en: commodity.en.title,
        fr: commodity.fr.title,
        esp: commodity.esp.title,
      },
      slug: {
        _type: 'slug',
        current: commodity.slug,
      },
      productDescription: {
        _type: 'localeText',
        en: commodity.en.description,
        fr: commodity.fr.description,
        esp: commodity.esp.description,
      },
      sourcingOrigin: {
        _type: 'localeString',
        en: commodity.en.origin,
        fr: commodity.fr.origin,
        esp: commodity.esp.origin,
      },
      typicalQualityParameters: {
        _type: 'localeText',
        en: commodity.en.typicalQualityParameters,
        fr: commodity.fr.typicalQualityParameters,
        esp: commodity.esp.typicalQualityParameters,
      },
      // Backward compatibility fallback string
      qualityStandards: commodity.en.typicalQualityParameters,
      category: commodity.en.category,
      corridor: commodity.corridor,
      isFeatured,
      displayLogistics: Boolean(commodity.displayLogistics),
      isActive: true,
    };

    if (commodity.en.packagingLogistics) {
      sanityDoc.packagingLogistics = {
        _type: 'localeText',
        en: commodity.en.packagingLogistics,
        fr: commodity.fr.packagingLogistics || commodity.en.packagingLogistics,
        esp: commodity.esp.packagingLogistics || commodity.en.packagingLogistics,
      };
    }

    if (options.dryRun) {
      if (options.verbose) {
        console.log(`  [DRY RUN] ${docId} | ${commodity.en.title} [${commodity.corridor.toUpperCase()}] (Featured: ${isFeatured})`);
      }
      seededCount++;
    } else if (client) {
      try {
        await client.createOrReplace(sanityDoc);
        if (options.verbose) {
          console.log(`  ✅ Upserted: ${docId} (${commodity.en.title})`);
        }
        seededCount++;
      } catch (err: any) {
        console.error(`  ❌ Failed to upsert ${docId}:`, err?.message || err);
      }
    }
  }

  console.log(`\n========================================================`);
  console.log(`🎉 CAP-9 Seeding Summary:`);
  console.log(`  Total Commodities Processed: ${seededCount}`);
  console.log(`  Flagship Featured (3x3 Grid): ${featuredCount}`);
  console.log(`  Trade Terminology: 'Typical Quality Parameters'`);
  console.log(`  Status: ${options.dryRun ? 'DRY RUN COMPLETE (No mutations executed)' : 'SUCCESS'}`);
  console.log(`========================================================\n`);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
