// scripts/seed-sanity-translations.ts
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from 'next-sanity';
import { translateText } from '../src/lib/translation/translator';
import { getTranslationCacheStats } from '../src/lib/translation/cache';

// Load environment variables (.env.local has priority)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

interface ScriptOptions {
  dryRun: boolean;
  verbose: boolean;
  auditOnly: boolean;
  repairIdentical: boolean;
  types: Set<string> | null;
}

const parseArgs = (): ScriptOptions => {
  const args = process.argv.slice(2);
  const typesArg = args.find((arg) => arg.startsWith('--types='));
  const types = typesArg
    ? new Set(
        typesArg
          .slice('--types='.length)
          .split(',')
          .map((type) => type.trim())
          .filter(Boolean)
      )
    : null;

  return {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    auditOnly: args.includes('--audit'),
    repairIdentical: args.includes('--repair-identical'),
    types,
  };
};

// Target document queries to fetch from Sanity Content Lake
const DOC_QUERIES = [
  { type: 'product', query: `*[_type == "product"]` },
  { type: 'heroSection', query: `*[_type == "heroSection"]` },
  { type: 'aboutSection', query: `*[_type == "aboutSection"]` },
  { type: 'servicesSection', query: `*[_type == "servicesSection"]` },
  { type: 'productsSection', query: `*[_type == "productsSection"]` },
  { type: 'contactInfo', query: `*[_type == "contactInfo"]` },
  { type: 'coreValue', query: `*[_type == "coreValue"]` },
  { type: 'carouselSlide', query: `*[_type == "carouselSlide"]` },
  { type: 'category', query: `*[_type == "category"]` },
  { type: 'blogPost', query: `*[_type == "blogPost"]` },
  { type: 'author', query: `*[_type == "author"]` },
  { type: 'legalPage', query: `*[_type == "legalPage"]` },
];

const TRANSLATABLE_FIELDS: Record<string, string[]> = {
  heroSection: ['title', 'subtitle', 'description', 'ctaPrimary', 'ctaSecondary'],
  aboutSection: ['sectionTitle', 'mission', 'vision', 'story', 'whyChooseTitle'],
  servicesSection: ['sectionTitle', 'subtitle', 'description'],
  productsSection: ['sectionTitle', 'subtitle', 'description', 'categoriesTitle', 'categoriesSubtitle'],
  contactInfo: [
    'sectionTitle',
    'sectionDescription',
    'businessAddress',
    'businessHours',
    'responseTime',
    'companyTagline',
    'companyBio',
    'followUsTitle',
    'quickLinksTitle',
    'coreValuesTitle',
    'productCategoriesTitle',
    'copyrightNotice',
    'backToTopText',
  ],
  product: [
    'productName',
    'productDescription',
    'sourcingOrigin',
    'typicalQualityParameters',
    'packagingLogistics',
  ],
  coreValue: ['title', 'description'],
  carouselSlide: ['title', 'tagline', 'description'],
  category: ['title', 'description'],
  blogPost: ['title', 'excerpt', 'content', 'seoTitle', 'seoDescription'],
  author: ['name', 'bio'],
  legalPage: ['title', 'introduction', 'seoTitle', 'seoDescription'],
};

async function main() {
  const options = parseArgs();
  const selectedQueries = options.types
    ? DOC_QUERIES.filter(({ type }) => options.types?.has(type))
    : DOC_QUERIES;

  if (options.types) {
    const knownTypes = new Set(DOC_QUERIES.map(({ type }) => type));
    const unknownTypes = [...options.types].filter((type) => !knownTypes.has(type));
    if (unknownTypes.length > 0) {
      throw new Error(`Unknown document type(s): ${unknownTypes.join(', ')}`);
    }
  }
  console.log(`\n========================================================`);
  console.log(`🌾 AgroVentia Automated Translation Seeder (CAP-7)`);
  console.log(`Mode: ${options.dryRun ? '🔍 DRY RUN (no mutations)' : '🚀 LIVE SEEDING'}`);
  console.log(`========================================================\n`);

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || projectId === 'your_sanity_project_id_here') {
    console.warn(`[WARN] Sanity Project ID is not configured. Running in offline dry-run test mode.`);
  }

  const client =
    projectId && token
      ? createClient({
          projectId,
          dataset,
          apiVersion: '2024-03-01',
          token,
          useCdn: false,
        })
      : null;

  let totalDocsInspected = 0;
  let totalFieldsProcessed = 0;
  let totalTranslationsApplied = 0;
  let totalSkippedAlreadyPresent = 0;
  let totalMissingTranslations = 0;
  let totalSourceFallbacks = 0;

  for (const { type, query } of selectedQueries) {
    console.log(`\nProcessing collection: ${type}...`);
    let docs: any[] = [];

    if (client) {
      try {
        docs = await client.fetch(query);
      } catch (err: any) {
        console.warn(`[WARN] Failed to fetch ${type} from Sanity: ${err.message}`);
      }
    }

    if (!docs || docs.length === 0) {
      console.log(`  (0 documents found in remote Content Lake for ${type})`);
      continue;
    }

    totalDocsInspected += docs.length;
    const fieldsToTranslate = TRANSLATABLE_FIELDS[type] || [];

    for (const doc of docs) {
      const patches: Record<string, string> = {};

      for (const field of fieldsToTranslate) {
        const val = doc[field];
        const enSource =
          typeof val?.en === 'string' ? val.en.trim() : '';

        if (!enSource) continue;
        totalFieldsProcessed++;

        const hasFr = val.fr && val.fr.trim().length > 0;
        const hasEsp = val.esp && val.esp.trim().length > 0;
        const frMatchesSource = hasFr && val.fr.trim() === enSource;
        const espMatchesSource = hasEsp && val.esp.trim() === enSource;
        const identicalValueIsValid =
          field === 'sourcingOrigin' || field === 'businessAddress';

        if (
          options.auditOnly &&
          !identicalValueIsValid &&
          (frMatchesSource || espMatchesSource)
        ) {
          const fallbackLocales = [
            frMatchesSource && 'fr',
            espMatchesSource && 'esp',
          ].filter(Boolean);
          totalSourceFallbacks += fallbackLocales.length;
          console.log(
            `  ⚠ ${doc._id}.${field} matches English in: ${fallbackLocales.join(', ')} | source: ${JSON.stringify(enSource)}`
          );
          continue;
        }

        const needsFr =
          !hasFr ||
          (options.repairIdentical && !identicalValueIsValid && frMatchesSource);
        const needsEsp =
          !hasEsp ||
          (options.repairIdentical && !identicalValueIsValid && espMatchesSource);

        if (!needsFr && !needsEsp) {
          totalSkippedAlreadyPresent++;
          if (options.verbose) {
            console.log(`  ✓ ${doc._id}.${field} already translated. Skipping.`);
          }
          continue;
        }

        if (options.auditOnly) {
          const missingLocales = [!hasFr && 'fr', !hasEsp && 'esp'].filter(Boolean);
          totalMissingTranslations += missingLocales.length;
          console.log(
            `  ⚠ ${doc._id}.${field} missing: ${missingLocales.join(', ')}`
          );
          continue;
        }

        // Translate
        const translation = await translateText({
          text: enSource,
          context: `${type}.${field}`,
        });

        if (
          translation.fr.trim() === enSource &&
          translation.esp.trim() === enSource
        ) {
          console.error(
            `  ✗ ${doc._id}.${field}: translation provider returned the English source; refusing to persist it.`
          );
          continue;
        }

        if (needsFr && translation.fr) {
          patches[`${field}.fr`] = translation.fr;
        }
        if (needsEsp && translation.esp) {
          patches[`${field}.esp`] = translation.esp;
        }

        totalTranslationsApplied++;
        console.log(`  ✨ [${type}] ${doc._id}.${field}: Translated to FR & ESP`);
      }

      if (Object.keys(patches).length > 0 && !options.dryRun && client) {
        try {
          await client.patch(doc._id).set(patches).commit();
          if (options.verbose) {
            console.log(`  💾 Committed patches to document ${doc._id}`);
          }
        } catch (err: any) {
          console.error(`  ❌ Failed to patch document ${doc._id}: ${err.message}`);
        }
      }
    }
  }

  const cacheStats = getTranslationCacheStats();

  console.log(`\n========================================================`);
  console.log(`🎉 Seeding Summary`);
  console.log(`--------------------------------------------------------`);
  console.log(`Documents Inspected:       ${totalDocsInspected}`);
  console.log(`Fields Evaluated:          ${totalFieldsProcessed}`);
  console.log(`Translations Applied:      ${totalTranslationsApplied}`);
  console.log(`Skipped (Already Present): ${totalSkippedAlreadyPresent}`);
  if (options.auditOnly) {
    console.log(`Missing Locale Values:     ${totalMissingTranslations}`);
    console.log(`English Fallback Values:   ${totalSourceFallbacks}`);
  }
  console.log(`Cache Hits:                ${cacheStats.hits}`);
  console.log(`Cache Misses:              ${cacheStats.misses}`);
  console.log(`Total Cached Entries:      ${cacheStats.size}`);
  console.log(`========================================================\n`);
}

main().catch((err) => {
  console.error('[FATAL] Script error:', err);
  process.exit(1);
});
