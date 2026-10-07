import path from 'path';
import fs from 'fs';
import {
  parseWixImageUrl,
  cleanHtmlToText,
  extractRichText,
  slugify,
  toLocale,
  createSanityImage,
  fetchImageAsset,
  transformWixSnapshot,
  runMigration,
  FALLBACK_PNG_BUFFER,
} from '../../../scripts/seed-sanity-from-snapshot';

describe('Automated Wix Data and Media Migration Pipeline (Story 2 / CAP-2)', () => {
  const snapshotPath = path.resolve(__dirname, '../../data/wix_live_snapshot.json');

  it('should verify wix_live_snapshot.json exists and is valid JSON', () => {
    expect(fs.existsSync(snapshotPath)).toBe(true);
    const raw = fs.readFileSync(snapshotPath, 'utf-8');
    const data = JSON.parse(raw);
    expect(typeof data).toBe('object');
    expect(Object.keys(data).length).toBe(11);
  });

  describe('Media URL Parser (parseWixImageUrl)', () => {
    it('should parse standard Wix image URI with dimensions and filename', () => {
      const wixUrl =
        'wix:image://v1/a3b8a8_425766322d194e70817446fa58efb113~mv2.jpg/agroventia-logo.jpg#originWidth=1536&originHeight=1024';
      const result = parseWixImageUrl(wixUrl);

      expect(result).not.toBeNull();
      expect(result?.mediaFile).toBe('a3b8a8_425766322d194e70817446fa58efb113~mv2.jpg');
      expect(result?.filename).toBe('agroventia-logo.jpg');
      expect(result?.publicUrl).toBe(
        'https://static.wixstatic.com/media/a3b8a8_425766322d194e70817446fa58efb113~mv2.jpg'
      );
      expect(result?.width).toBe(1536);
      expect(result?.height).toBe(1024);
    });

    it('should properly URL-decode filename with special characters and spaces', () => {
      const wixUrl =
        'wix:image://v1/nsplsh_7692f28646574f7da2f8fc47a02c9c96~mv2.jpg/Image%20by%20PROJETO%20CAF%C3%89%20GATO-MOURISCO.jpg#originWidth=5616&originHeight=3744';
      const result = parseWixImageUrl(wixUrl);

      expect(result).not.toBeNull();
      expect(result?.filename).toBe('Image by PROJETO CAFÉ GATO-MOURISCO.jpg');
      expect(result?.width).toBe(5616);
      expect(result?.height).toBe(3744);
    });

    it('should return null for invalid or non-Wix URLs', () => {
      expect(parseWixImageUrl('')).toBeNull();
      expect(parseWixImageUrl('https://example.com/test.jpg')).toBeNull();
      expect(parseWixImageUrl('wix:image://invalid-format')).toBeNull();
    });
  });

  describe('HTML and Text Sanitization', () => {
    it('should strip HTML tags and decode entities in cleanHtmlToText', () => {
      const html = '<p class="font_8">AgroVentia &amp; Partners &nbsp; sourcing &quot;quality&quot; crops.</p>';
      const clean = cleanHtmlToText(html);
      expect(clean).toBe('AgroVentia & Partners   sourcing "quality" crops.');
    });

    it('should extract text from Wix rich text node structure', () => {
      const richNodes = {
        nodes: [
          {
            type: 'HEADING',
            nodes: [
              {
                textData: { text: 'Heading 1' },
              },
            ],
          },
          {
            type: 'PARAGRAPH',
            nodes: [
              {
                textData: { text: 'Paragraph first line. ' },
              },
              {
                textData: { text: 'Second part.' },
              },
            ],
          },
        ],
      };

      const extracted = extractRichText(richNodes);
      expect(extracted).toContain('Heading 1');
      expect(extracted).toContain('Paragraph first line. Second part.');
    });
  });

  describe('Slug and Localization Helpers', () => {
    it('should generate consistent URL slugs', () => {
      expect(slugify('Premium Cocoa Beans (Standard Grade)')).toBe('premium-cocoa-beans-standard-grade');
      expect(slugify('Café & Thé Spécial')).toBe('cafe-the-special');
    });

    it('should structure multilingual fields for en, fr, and esp', () => {
      const localized = toLocale('English Title', 'Titre Français', 'Título Español');
      expect(localized).toEqual({
        en: 'English Title',
        fr: 'Titre Français',
        esp: 'Título Español',
      });
    });

    it('should build Sanity image objects with center hotspot and reference', () => {
      const img = createSanityImage('image-abc123-asset');
      expect(img._type).toBe('image');
      expect(img.asset).toEqual({
        _type: 'reference',
        _ref: 'image-abc123-asset',
      });
      expect(img.hotspot).toEqual({
        x: 0.5,
        y: 0.5,
        height: 1,
        width: 1,
      });
    });
  });

  describe('Media Download and Fallback Strategy', () => {
    it('should fall back to placeholder buffer when remote URL fails', async () => {
      const result = await fetchImageAsset('https://static.wixstatic.com/media/non-existent-image-404.jpg', 'fallback.jpg');
      expect(result.isFallback).toBe(true);
      expect(result.contentType).toBe('image/png');
      expect(result.buffer).toEqual(FALLBACK_PNG_BUFFER);
    });
  });

  describe('Document Transformation (transformWixSnapshot)', () => {
    const rawContent = fs.readFileSync(snapshotPath, 'utf-8');
    const snapshot = JSON.parse(rawContent);

    // Mock asset map
    const assetMap = new Map<string, string>();
    assetMap.set(
      'wix:image://v1/a3b8a8_425766322d194e70817446fa58efb113~mv2.jpg/agroventia-logo.jpg#originWidth=1536&originHeight=1024',
      'asset-logo'
    );
    assetMap.set(
      'wix:image://v1/nsplsh_559a94c786044333bcfc26ccb4be438b~mv2.jpg/Image%20by%20James%20Baltz.jpg#originWidth=5464&originHeight=3070',
      'asset-hero-bg'
    );

    const documents = transformWixSnapshot(snapshot, assetMap);

    it('should produce exactly 33 typed Sanity documents across all 11 collections', () => {
      expect(documents).toHaveLength(33);
    });

    it('should transform singletons with deterministic IDs and proper schemas', () => {
      const hero = documents.find((d) => d._id === 'heroSection');
      expect(hero).toBeDefined();
      expect(hero._type).toBe('heroSection');
      expect(hero.title.en).toBeTruthy();
      expect(hero.companyLogo?.asset._ref).toBe('asset-logo');
      expect(hero.backgroundImage?.asset._ref).toBe('asset-hero-bg');

      const about = documents.find((d) => d._id === 'aboutSection');
      expect(about).toBeDefined();
      expect(about._type).toBe('aboutSection');
      expect(about.sectionTitle.en).toBe('About AgroVentia Inc.');
      expect(about.foundingYear).toBe('2025');

      const services = documents.find((d) => d._id === 'servicesSection');
      expect(services).toBeDefined();
      expect(services._type).toBe('servicesSection');
      expect(services.sectionTitle.en).toBe('Our Process');

      const productsSec = documents.find((d) => d._id === 'productsSection');
      expect(productsSec).toBeDefined();
      expect(productsSec._type).toBe('productsSection');

      const contact = documents.find((d) => d._id === 'contactInfo');
      expect(contact).toBeDefined();
      expect(contact._type).toBe('contactInfo');
      expect(contact.businessEmail).toBe('info@agroventia.ca');
    });

    it('should transform all 4 core values with sortOrder and reference', () => {
      const values = documents.filter((d) => d._type === 'coreValue');
      expect(values).toHaveLength(4);
      values.forEach((v, idx) => {
        expect(v._id).toMatch(/^coreValue-/);
        expect(v.sortOrder).toBe(idx);
        expect(v.title.en).toBeTruthy();
      });
    });

    it('should transform all 4 carousel slides with displayOrder', () => {
      const slides = documents.filter((d) => d._type === 'carouselSlide');
      expect(slides).toHaveLength(4);
      slides.forEach((s) => {
        expect(s._id).toMatch(/^carouselSlide-/);
        expect(typeof s.displayOrder).toBe('number');
      });
    });

    it('should transform all 6 categories with slug object', () => {
      const categories = documents.filter((d) => d._type === 'category');
      expect(categories).toHaveLength(6);
      categories.forEach((c) => {
        expect(c._id).toMatch(/^category-/);
        expect(c.slug?._type).toBe('slug');
        expect(c.slug?.current).toBeTruthy();
      });
    });

    it('should transform author and blogPost with mutual reference', () => {
      const author = documents.find((d) => d._type === 'author');
      expect(author).toBeDefined();
      expect(author._id).toBe('author-agroventia-inc');

      const post = documents.find((d) => d._type === 'blogPost');
      expect(post).toBeDefined();
      expect(post.author?._type).toBe('reference');
      expect(post.author?._ref).toBe('author-agroventia-inc');
      expect(post.categories?.[0]?._ref).toBe('category-supply-chain');
    });

    it('should transform all 12 catalog products with SKUs and localized titles', () => {
      const products = documents.filter((d) => d._type === 'product');
      expect(products).toHaveLength(12);
      products.forEach((p, idx) => {
        expect(p._id).toMatch(/^product-/);
        expect(p.productName.en).toBeTruthy();
        expect(p.sku).toMatch(/^AGV-/);
        expect(p.sortOrder).toBe(idx);
        expect(p.inStock).toBe(true);
      });
    });
  });

  describe('Full Migration Runner Execution (runMigration)', () => {
    it('should execute end-to-end dry-run migration without exceptions or fatal errors', async () => {
      const summary = await runMigration({
        snapshotPath,
        dryRun: true,
      });

      expect(summary.dryRun).toBe(true);
      expect(summary.collectionsProcessed).toBe(11);
      expect(summary.totalRecordsInSnapshot).toBe(33);
      expect(summary.documentsMutated).toBe(33);
      expect(summary.mediaAssetsReferenced).toBe(17);
      expect(summary.uniqueMediaAssets).toBe(14);
      expect(summary.mediaAssetsUploaded).toBe(14);
      expect(summary.errors).toHaveLength(0);
    });

    it('should execute idempotently when run multiple times', async () => {
      const run1 = await runMigration({ snapshotPath, dryRun: true });
      const run2 = await runMigration({ snapshotPath, dryRun: true });

      expect(run1.documentsMutated).toBe(run2.documentsMutated);
      expect(run1.uniqueMediaAssets).toBe(run2.uniqueMediaAssets);
      expect(run1.errors).toHaveLength(0);
      expect(run2.errors).toHaveLength(0);
    });
  });
});
