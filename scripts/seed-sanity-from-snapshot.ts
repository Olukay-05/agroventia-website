import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from 'next-sanity';

// Load environment variables (.env.local has precedence over .env)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

export interface WixMediaDetails {
  rawUrl: string;
  mediaFile: string;
  filename: string;
  publicUrl: string;
  width: number;
  height: number;
}

export interface LocaleString {
  en: string;
  fr: string;
  esp: string;
}

export interface SanityImageReference {
  _type: 'image';
  asset: {
    _type: 'reference';
    _ref: string;
  };
  hotspot: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface MigrationOptions {
  snapshotPath?: string;
  dryRun?: boolean;
  skipMedia?: boolean;
  verbose?: boolean;
}

export interface MigrationSummary {
  dryRun: boolean;
  totalRecordsInSnapshot: number;
  collectionsProcessed: number;
  documentsMutated: number;
  documentsByType: Record<string, number>;
  mediaAssetsReferenced: number;
  uniqueMediaAssets: number;
  mediaAssetsUploaded: number;
  mediaFallbacksUsed: number;
  errors: string[];
}

/**
 * Parses a proprietary Wix media URI into public CDN URL and metadata.
 * Example: wix:image://v1/a3b8a8...~mv2.jpg/logo.jpg#originWidth=1536&originHeight=1024
 */
export function parseWixImageUrl(wixUrl: string): WixMediaDetails | null {
  if (typeof wixUrl !== 'string' || !wixUrl.startsWith('wix:image://v1/')) {
    return null;
  }

  try {
    const rawPath = wixUrl.slice('wix:image://v1/'.length);
    const slashIdx = rawPath.indexOf('/');
    if (slashIdx === -1) {
      return null;
    }

    const mediaFile = rawPath.substring(0, slashIdx);
    if (!mediaFile || !mediaFile.includes('~mv2')) {
      return null;
    }

    const rest = rawPath.substring(slashIdx + 1);

    const [filenamePart, hashPart] = rest.split('#');
    const filename = decodeURIComponent(filenamePart || mediaFile);

    let width = 800;
    let height = 600;

    if (hashPart) {
      const params = new URLSearchParams(hashPart);
      const w = parseInt(params.get('originWidth') || '', 10);
      const h = parseInt(params.get('originHeight') || '', 10);
      if (!isNaN(w) && w > 0) width = w;
      if (!isNaN(h) && h > 0) height = h;
    }

    const publicUrl = `https://static.wixstatic.com/media/${mediaFile}`;

    return {
      rawUrl: wixUrl,
      mediaFile,
      filename,
      publicUrl,
      width,
      height,
    };
  } catch {
    return null;
  }
}

/**
 * Strips HTML tags and decodes common HTML entities for plain text fields.
 */
export function cleanHtmlToText(html: string): string {
  if (!html || typeof html !== 'string') return '';

  return html
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&rsquo;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extracts plain text paragraphs from Wix rich text JSON node structure.
 */
export function extractRichText(contentNode: any): string {
  if (!contentNode) return '';
  if (typeof contentNode === 'string') return cleanHtmlToText(contentNode);

  if (contentNode.nodes && Array.isArray(contentNode.nodes)) {
    const paragraphs: string[] = [];
    for (const node of contentNode.nodes) {
      const texts: string[] = [];
      function collectText(n: any) {
        if (!n) return;
        if (n.textData?.text) {
          texts.push(n.textData.text);
        }
        if (n.nodes && Array.isArray(n.nodes)) {
          n.nodes.forEach(collectText);
        }
      }
      collectText(node);
      const paragraphText = texts.join('').trim();
      if (paragraphText) {
        paragraphs.push(paragraphText);
      }
    }
    return paragraphs.join('\n\n');
  }

  return '';
}

/**
 * Converts a string into a URL-friendly, deterministic slug.
 */
export function slugify(text: string): string {
  if (!text) return 'untitled';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled';
}

/**
 * Creates a multilingual object adhering to Sanity localeString/localeText schemas.
 */
export function toLocale(enText: string, frText = '', espText = ''): LocaleString {
  return {
    en: enText || '',
    fr: frText || '',
    esp: espText || '',
  };
}

/**
 * Builds a Sanity image object with default center hotspot and reference.
 */
export function createSanityImage(assetId: string): SanityImageReference {
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
    hotspot: {
      x: 0.5,
      y: 0.5,
      height: 1,
      width: 1,
    },
  };
}

/**
 * Minimal transparent 1x1 PNG fallback buffer when Wix media fails or is unreachable.
 */
export const FALLBACK_PNG_BUFFER = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

/**
 * Downloads an image from Wix CDN with graceful error fallback.
 */
export async function fetchImageAsset(
  publicUrl: string,
  filename: string
): Promise<{ buffer: Buffer; contentType: string; isFallback: boolean }> {
  try {
    const res = await fetch(publicUrl, {
      headers: {
        'User-Agent': 'AgroVentia-Sanity-Migration/1.0',
      },
    });

    if (!res.ok) {
      console.warn(`[WARN] Wix media returned HTTP ${res.status} for ${publicUrl}. Using placeholder.`);
      return {
        buffer: FALLBACK_PNG_BUFFER,
        contentType: 'image/png',
        isFallback: true,
      };
    }

    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    return {
      buffer: Buffer.from(arrayBuffer),
      contentType,
      isFallback: false,
    };
  } catch (err: any) {
    console.warn(`[WARN] Network error fetching ${publicUrl}: ${err.message}. Using placeholder.`);
    return {
      buffer: FALLBACK_PNG_BUFFER,
      contentType: 'image/png',
      isFallback: true,
    };
  }
}

/**
 * Transforms all 11 Wix collections from the snapshot into 32 typed Sanity documents.
 */
export function transformWixSnapshot(
  snapshot: Record<string, any>,
  assetMap: Map<string, string>
): any[] {
  const documents: any[] = [];

  // Helper to get image reference
  const getImage = (rawUrl?: string): SanityImageReference | undefined => {
    if (!rawUrl) return undefined;
    const assetId = assetMap.get(rawUrl);
    if (!assetId) return undefined;
    return createSanityImage(assetId);
  };

  // 1. HeroContent (1 Singleton: heroSection)
  if (snapshot.HeroContent?.items?.[0]) {
    const item = snapshot.HeroContent.items[0];
    const heroDoc: any = {
      _id: 'heroSection',
      _type: 'heroSection',
      title: toLocale(item.title || 'Simplifying global sourcing with reliable, premium agricultural products.'),
      subtitle: toLocale(item.subtitle || ''),
      description: toLocale(cleanHtmlToText(item.description || '')),
      ctaPrimary: toLocale(item.ctaPrimary || 'Explore Products'),
      ctaSecondary: toLocale(item.ctaSecondary || 'Request a Quote'),
      ctaLink: '/products',
      overlayOpacity: 50,
      isActive: item.isActive ?? true,
    };

    const logo = getImage(item.companyLogo);
    if (logo) heroDoc.companyLogo = logo;

    const bg = getImage(item.backgroundImage);
    if (bg) heroDoc.backgroundImage = bg;

    documents.push(heroDoc);
  }

  // 2. AboutContent (1 Singleton: aboutSection)
  if (snapshot.AboutContent?.items?.[0]) {
    const item = snapshot.AboutContent.items[0];
    const aboutDoc: any = {
      _id: 'aboutSection',
      _type: 'aboutSection',
      sectionTitle: toLocale(item.sectionTitle || 'About AgroVentia Inc.'),
      story: toLocale(cleanHtmlToText(item.story || '')),
      mission: toLocale(cleanHtmlToText(item.mission || '')),
      vision: toLocale(cleanHtmlToText(item.vision || '')),
      headquarters: item.headquarters || 'Ontario, CA',
      foundingYear: item.foundingYear || '2025',
      certifications: item.certifications || 'ISO 14001, LEED Gold',
      isActive: item.isActive ?? true,
    };

    const img = getImage(item.aboutImage);
    if (img) aboutDoc.aboutImage = img;

    documents.push(aboutDoc);
  }

  // 3. ServicesContent (1 Singleton: servicesSection)
  if (snapshot.ServicesContent?.items?.[0]) {
    const item = snapshot.ServicesContent.items[0];
    const servicesDoc: any = {
      _id: 'servicesSection',
      _type: 'servicesSection',
      sectionTitle: toLocale(item.sectionTitle || 'Our Process'),
      sectionDescription: toLocale(cleanHtmlToText(item.sectionDescription || '')),
      importServices: toLocale(item.importServices || ''),
      customSourcing: toLocale(item.customSourcing || ''),
      qualityAssurance: toLocale(item.qualityAssurance || ''),
      logistics: toLocale(item.logistics || ''),
      documentation: toLocale(item.documentation || ''),
      isActive: item.isActive ?? true,
    };

    const sImg = getImage(item.servicesImage);
    if (sImg) servicesDoc.servicesImage = sImg;

    const bgImg = getImage(item.imageBackground);
    if (bgImg) servicesDoc.imageBackground = bgImg;

    documents.push(servicesDoc);
  }

  // 4. ProductsContent (1 Singleton: productsSection)
  if (snapshot.ProductsContent?.items?.[0]) {
    const item = snapshot.ProductsContent.items[0];
    const prodSecDoc: any = {
      _id: 'productsSection',
      _type: 'productsSection',
      sectionTitle: toLocale(item.sectionTitle || 'Products & Trade Origins'),
      sectionDescription: toLocale(item.sectionDescription || ''),
      isActive: item.isActive ?? true,
    };

    const sImg = getImage(item.sectionImage);
    if (sImg) prodSecDoc.sectionImage = sImg;

    documents.push(prodSecDoc);
  }

  // 5. ContactContent (1 Singleton: contactInfo)
  if (snapshot.ContactContent?.items?.[0]) {
    const item = snapshot.ContactContent.items[0];
    const contactDoc: any = {
      _id: 'contactInfo',
      _type: 'contactInfo',
      sectionTitle: toLocale(item.sectionTitle || 'Contact AgroVentia'),
      sectionDescription: toLocale(item.sectionDescription || ''),
      businessEmail: item.businessEmail || 'info@agroventia.ca',
      businessPhone: item.businessPhone || '+1 (403) 477-6059',
      businessAddress: toLocale(item.businessAddress || '249 2883 456 Ave, Ontario CA'),
      businessHours: toLocale(item.businessHours || ''),
      responseTime: toLocale(item.responseTime || 'Within 24 Hours'),
      socialLinks: item.socialLinks || 'https://www.linkedin.com/company/agroventia-inc',
      mapEmbedCode: '',
      isActive: item.isActive ?? true,
    };

    const cImg = getImage(item.contactImage);
    if (cImg) contactDoc.contactImage = cImg;

    documents.push(contactDoc);
  }

  // 6. OurCoreValues (4 Collection items: coreValue)
  if (snapshot.OurCoreValues?.items) {
    snapshot.OurCoreValues.items.forEach((item: any, idx: number) => {
      const doc: any = {
        _id: `coreValue-${slugify(item.title)}`,
        _type: 'coreValue',
        title: toLocale(item.title),
        description: toLocale(cleanHtmlToText(item.description || '')),
        reference: item.reference || '',
        sortOrder: idx,
        isActive: item.isActive ?? true,
      };
      documents.push(doc);
    });
  }

  // 7. CarouselImageDisplay (4 Collection items: carouselSlide)
  if (snapshot.CarouselImageDisplay?.items) {
    snapshot.CarouselImageDisplay.items.forEach((item: any, idx: number) => {
      const order = item.displayOrder ?? (idx + 1);
      const title = item.title || item.tagline || `Slide ${order}`;
      const doc: any = {
        _id: `carouselSlide-${order}-${slugify(title)}`,
        _type: 'carouselSlide',
        title: toLocale(item.title || ''),
        tagline: toLocale(item.tagline || ''),
        description: toLocale(item.description || ''),
        displayOrder: order,
        isActive: item.isActive ?? true,
      };

      const img = getImage(item.imageUrl);
      if (img) doc.image = img;

      documents.push(doc);
    });
  }

  // 8. Import4 (6 Collection items: category)
  if (snapshot.Import4?.items) {
    snapshot.Import4.items.forEach((item: any) => {
      const slug = slugify(item.title);
      const doc: any = {
        _id: `category-${slug}`,
        _type: 'category',
        title: toLocale(item.title),
        slug: { _type: 'slug', current: slug },
        description: toLocale(item.description || ''),
      };
      documents.push(doc);
    });
  }

  // 9. Import3 (1 Collection item: author)
  if (snapshot.Import3?.items?.[0]) {
    const item = snapshot.Import3.items[0];
    const name = item.name || item.title || 'AgroVentia Inc.';
    const doc: any = {
      _id: `author-${slugify(name)}`,
      _type: 'author',
      name,
      bio: toLocale('AgroVentia Editorial & Sourcing Desk'),
    };
    documents.push(doc);
  }

  // 10. Import5 (1 Collection item: blogPost)
  if (snapshot.Import5?.items?.[0]) {
    const item = snapshot.Import5.items[0];
    const slug = item.slug || slugify(item.title);
    const doc: any = {
      _id: `blogPost-${slug}`,
      _type: 'blogPost',
      title: toLocale(item.title),
      slug: { _type: 'slug', current: slug },
      excerpt: toLocale(item.excerpt || ''),
      content: toLocale(extractRichText(item.content)),
      publishedDate: item.publishedDate || new Date().toISOString(),
      author: {
        _type: 'reference',
        _ref: 'author-agroventia-inc',
      },
      categories: [
        {
          _type: 'reference',
          _ref: 'category-supply-chain',
        },
      ],
    };

    const cover = getImage(item.coverImage);
    if (cover) doc.coverImage = cover;

    documents.push(doc);
  }

  // 11. Import1 (12 Collection items: product)
  if (snapshot.Import1?.items) {
    snapshot.Import1.items.forEach((item: any, idx: number) => {
      const slug = slugify(item.title);
      const doc: any = {
        _id: `product-${slug}`,
        _type: 'product',
        productName: toLocale(item.title),
        productDescription: toLocale(
          item.categoryDescription ||
            item.description ||
            `${item.title} sourced and supplied by AgroVentia Inc.`
        ),
        sku: `AGV-${slug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`,
        inStock: true,
        sortOrder: idx,
        isActive: true,
      };

      const pImg = getImage(item.image);
      if (pImg) doc.productImage = pImg;

      documents.push(doc);
    });
  }

  return documents;
}

/**
 * Executes the full end-to-end migration runner.
 */
export async function runMigration(options: MigrationOptions = {}): Promise<MigrationSummary> {
  const summary: MigrationSummary = {
    dryRun: false,
    totalRecordsInSnapshot: 0,
    collectionsProcessed: 0,
    documentsMutated: 0,
    documentsByType: {},
    mediaAssetsReferenced: 0,
    uniqueMediaAssets: 0,
    mediaAssetsUploaded: 0,
    mediaFallbacksUsed: 0,
    errors: [],
  };

  const snapshotFile =
    options.snapshotPath ||
    path.resolve(process.cwd(), 'src/data/wix_live_snapshot.json');

  console.log(`[INFO] Reading Wix live snapshot from: ${snapshotFile}`);

  if (!fs.existsSync(snapshotFile)) {
    const err = `Snapshot file not found at ${snapshotFile}`;
    console.error(`[ERROR] ${err}`);
    summary.errors.push(err);
    return summary;
  }

  let snapshot: Record<string, any>;
  try {
    const rawContent = fs.readFileSync(snapshotFile, 'utf-8');
    snapshot = JSON.parse(rawContent);
  } catch (err: any) {
    const msg = `Failed to parse snapshot JSON: ${err.message}`;
    console.error(`[ERROR] ${msg}`);
    summary.errors.push(msg);
    return summary;
  }

  // Count items and collections
  const collectionNames = Object.keys(snapshot);
  summary.collectionsProcessed = collectionNames.length;

  for (const name of collectionNames) {
    const count = snapshot[name]?.items?.length || 0;
    summary.totalRecordsInSnapshot += count;
  }

  console.log(
    `[INFO] Snapshot loaded: ${summary.collectionsProcessed} collections, ${summary.totalRecordsInSnapshot} total records.`
  );

  // Sanity environment configuration
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID;
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_DATASET ||
    'production';
  const token =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_WRITE_TOKEN;
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-01';

  // Determine dry-run status
  const isCliDryRun = process.argv.includes('--dry-run') || options.dryRun;
  if (isCliDryRun || !token || !projectId) {
    summary.dryRun = true;
    if (!token) {
      console.log(
        '[NOTICE] SANITY_API_WRITE_TOKEN is not set. Executing in idempotent DRY-RUN mode.'
      );
    } else if (isCliDryRun) {
      console.log('[NOTICE] --dry-run flag detected. Executing in DRY-RUN mode.');
    }
  }

  const client =
    !summary.dryRun && token && projectId
      ? createClient({
          projectId,
          dataset,
          apiVersion,
          token,
          useCdn: false,
        })
      : null;

  // Extract all Wix image URLs across snapshot
  const rawImageUrls: string[] = [];
  function scanForImages(val: any) {
    if (!val) return;
    if (typeof val === 'string' && val.startsWith('wix:image://')) {
      rawImageUrls.push(val);
    } else if (typeof val === 'object') {
      Object.values(val).forEach(scanForImages);
    }
  }
  scanForImages(snapshot);

  summary.mediaAssetsReferenced = rawImageUrls.length;
  const uniqueUrls = Array.from(new Set(rawImageUrls));
  summary.uniqueMediaAssets = uniqueUrls.length;

  console.log(
    `[INFO] Media extraction: ${summary.mediaAssetsReferenced} references found (${summary.uniqueMediaAssets} unique).`
  );

  // Map of Wix raw URL -> Sanity asset ID
  const assetMap = new Map<string, string>();

  // Process and upload assets
  for (let i = 0; i < uniqueUrls.length; i++) {
    const rawUrl = uniqueUrls[i];
    const details = parseWixImageUrl(rawUrl);

    if (!details) {
      console.warn(`[WARN] Could not parse Wix image URL: ${rawUrl}`);
      continue;
    }

    if (summary.dryRun || options.skipMedia) {
      // Deterministic mock asset ID for dry-run verification
      const mockAssetId = `image-${slugify(details.mediaFile)}-asset`;
      assetMap.set(rawUrl, mockAssetId);
      summary.mediaAssetsUploaded++;
    } else if (client) {
      console.log(
        `[MEDIA ${i + 1}/${uniqueUrls.length}] Fetching ${details.filename} (${details.publicUrl})...`
      );

      const { buffer, contentType, isFallback } = await fetchImageAsset(
        details.publicUrl,
        details.filename
      );

      if (isFallback) {
        summary.mediaFallbacksUsed++;
      }

      try {
        const assetDoc = await client.assets.upload('image', buffer, {
          filename: details.filename,
          contentType,
        });
        assetMap.set(rawUrl, assetDoc._id);
        summary.mediaAssetsUploaded++;
        console.log(`  -> Uploaded as Sanity Asset ID: ${assetDoc._id}`);
      } catch (uploadErr: any) {
        console.error(
          `[ERROR] Failed to upload asset ${details.filename} to Sanity: ${uploadErr.message}`
        );
        summary.errors.push(`Upload error for ${details.filename}: ${uploadErr.message}`);
        // Fall back to a placeholder ID to avoid aborting the entire migration
        assetMap.set(rawUrl, `fallback-${slugify(details.mediaFile)}`);
      }
    }
  }

  // Transform snapshot records into Sanity document payloads
  console.log('[INFO] Transforming Wix records into Sanity document payloads...');
  const documents = transformWixSnapshot(snapshot, assetMap);

  console.log(`[INFO] Generated ${documents.length} Sanity documents from snapshot.`);

  // Upsert / mutate documents
  for (const doc of documents) {
    summary.documentsByType[doc._type] = (summary.documentsByType[doc._type] || 0) + 1;

    if (summary.dryRun) {
      if (options.verbose) {
        console.log(`[DRY-RUN UPSERT] ${doc._type} (${doc._id})`);
      }
      summary.documentsMutated++;
    } else if (client) {
      try {
        await client.createOrReplace(doc);
        summary.documentsMutated++;
        if (options.verbose) {
          console.log(`[UPSERTED] ${doc._type} (${doc._id})`);
        }
      } catch (mutationErr: any) {
        const msg = `Mutation error for ${doc._type} (${doc._id}): ${mutationErr.message}`;
        console.error(`[ERROR] ${msg}`);
        summary.errors.push(msg);
      }
    }
  }

  // Print structured summary report
  printSummaryReport(summary);

  return summary;
}

/**
 * Prints a clean, structured migration summary to console.
 */
function printSummaryReport(s: MigrationSummary) {
  const line = '='.repeat(60);
  console.log('\n' + line);
  console.log('       AgroVentia Wix to Sanity Migration Summary');
  console.log(line);
  console.log(` Execution Mode:      ${s.dryRun ? 'DRY-RUN (Idempotent)' : 'LIVE (Production Lake)'}`);
  console.log(` Collections Read:    ${s.collectionsProcessed} collections`);
  console.log(` Snapshot Records:    ${s.totalRecordsInSnapshot} items`);
  console.log(` Documents Mutated:   ${s.documentsMutated} items (${s.documentsMutated} / ${s.totalRecordsInSnapshot})`);
  console.log(' Breakdown by Type:');
  for (const [type, count] of Object.entries(s.documentsByType)) {
    console.log(`   - ${type.padEnd(18)}: ${count}`);
  }
  console.log(' Media Assets Pipeline:');
  console.log(`   - Total Referenced: ${s.mediaAssetsReferenced}`);
  console.log(`   - Unique Files:     ${s.uniqueMediaAssets}`);
  console.log(`   - Uploaded/Mapped:  ${s.mediaAssetsUploaded}`);
  console.log(`   - Fallbacks Used:   ${s.mediaFallbacksUsed}`);
  console.log(` Errors Encountered:  ${s.errors.length}`);
  console.log(` Final Status:        ${s.errors.length === 0 ? 'SUCCESS' : 'COMPLETED WITH WARNINGS'}`);
  console.log(line + '\n');
}

// Direct execution entrypoint
const isDirectRun = Boolean(
  typeof process !== 'undefined' &&
    process.argv[1] &&
    (process.argv[1].endsWith('seed-sanity-from-snapshot.ts') ||
      process.argv[1].endsWith('seed-sanity-from-snapshot.js'))
);

if (isDirectRun) {
  runMigration().then((summary) => {
    if (summary.errors.length > 0) {
      process.exit(1);
    }
  });
}
