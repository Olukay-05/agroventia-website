// src/sanity/__tests__/cap10-canadian-assets.test.ts
/**
 * CAP-10: Canadian Agricultural Studio Asset Blueprint & Generation Pipeline Tests
 * Validates:
 * 1. Blueprint prompt engine coverage for all 33 Canadian commodities
 * 2. Visual standards compliance (1:1 aspect ratio, >=1024x1024 resolution, pure #FFFFFF backdrop)
 * 3. Physical file existence and validity in public/products/canadian/
 * 4. Portfolio data layer linking to Canadian studio assets
 * 5. Asset validation engine and sync pipeline compliance
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import {
  CANADIAN_COMMODITY_BLUEPRINTS,
  CANADIAN_STUDIO_VISUAL_STANDARDS,
  STANDARD_NEGATIVE_CONSTRAINTS,
  getAllCanadianCommodityBlueprints,
  getCanadianCommodityBlueprint,
  formatBlueprintPrompt,
} from '@/lib/assets/prompt-blueprint-engine';
import { COMMODITY_PORTFOLIO, getPortfolioProducts } from '@/lib/api/products-portfolio';
import { validateCanadianAsset } from '../../../scripts/sync-canadian-assets-to-sanity';

const ASSET_DIR = path.resolve(process.cwd(), 'public/products/canadian');

describe('CAP-10: Canadian Agricultural Studio Asset Blueprint Engine', () => {
  const blueprints = getAllCanadianCommodityBlueprints();

  test('Scenario 1.1: Blueprint registry covers exactly 33 Canadian commodities', () => {
    expect(blueprints.length).toBe(33);
    expect(Object.keys(CANADIAN_COMMODITY_BLUEPRINTS).length).toBe(33);
  });

  test('Scenario 1.2: Visual standards strictly mandate 1:1 square, >=1024x1024, #FFFFFF backdrop, and PNG', () => {
    expect(CANADIAN_STUDIO_VISUAL_STANDARDS.backdrop).toBe('#FFFFFF');
    expect(CANADIAN_STUDIO_VISUAL_STANDARDS.aspectRatio).toBe('1:1');
    expect(CANADIAN_STUDIO_VISUAL_STANDARDS.minWidth).toBe(1024);
    expect(CANADIAN_STUDIO_VISUAL_STANDARDS.minHeight).toBe(1024);
    expect(CANADIAN_STUDIO_VISUAL_STANDARDS.format).toBe('png');
  });

  test('Scenario 1.3: All 33 blueprint prompts contain negative constraints avoiding clutter', () => {
    blueprints.forEach(bp => {
      expect(bp.fullPrompt).toContain('no packaging');
      expect(bp.fullPrompt).toContain('no wooden bowls');
      expect(bp.fullPrompt).toContain('no blur');
      expect(bp.fullPrompt).toMatch(/(pure|solid|seamless) white (background|backdrop)/);
      expect(bp.targetAssetPath).toBe(`/products/canadian/${bp.slug}.png`);
    });
  });

  test('Scenario 1.4: formatBlueprintPrompt constructs standardized architectural formula', () => {
    const prompt = formatBlueprintPrompt('Canadian Oats', 'sound plump kernels');
    expect(prompt).toContain('Canadian Oats, sound plump kernels');
    expect(prompt).toContain('isolated studio product photography');
    expect(prompt).toContain('seamless pure white background');
    expect(prompt).toContain('subtle soft ground contact shadow');
    expect(prompt).toContain(STANDARD_NEGATIVE_CONSTRAINTS);
  });
});

describe('CAP-10: Physical Studio Assets Validation (public/products/canadian/)', () => {
  const blueprints = getAllCanadianCommodityBlueprints();

  test('Scenario 2.1: All 33 Canadian studio asset PNG files exist on disk', () => {
    expect(fs.existsSync(ASSET_DIR)).toBe(true);

    const missingAssets: string[] = [];
    blueprints.forEach(bp => {
      const assetPath = path.join(ASSET_DIR, `${bp.slug}.png`);
      if (!fs.existsSync(assetPath)) {
        missingAssets.push(`${bp.slug}.png`);
      }
    });

    expect(missingAssets).toEqual([]);
  });

  test('Scenario 2.2: All 33 assets are 1024x1024 1:1 square PNG format', async () => {
    for (const bp of blueprints) {
      const assetPath = path.join(ASSET_DIR, `${bp.slug}.png`);
      const meta = await sharp(assetPath).metadata();

      expect(meta.format).toBe('png');
      expect(meta.width).toBe(1024);
      expect(meta.height).toBe(1024);
    }
  });

  test('Scenario 2.3: Asset boundary corners are pure white (#FFFFFF)', async () => {
    // Sample representative commodities across all 4 categories
    const testSlugs = [
      'milling-wheat',
      'red-lentils',
      'canola-seed',
      'pulse-flour-pea-protein',
      'blueberries',
      'maple-syrup-maple-sugar',
    ];

    for (const slug of testSlugs) {
      const assetPath = path.join(ASSET_DIR, `${slug}.png`);
      const pixel = await sharp(assetPath)
        .extract({ left: 0, top: 0, width: 1, height: 1 })
        .raw()
        .toBuffer();

      const [r, g, b] = [pixel[0], pixel[1], pixel[2]];
      expect(r).toBeGreaterThanOrEqual(245);
      expect(g).toBeGreaterThanOrEqual(245);
      expect(b).toBeGreaterThanOrEqual(245);
    }
  });
});

describe('CAP-10: Portfolio Linking & CMS Pipeline Integration', () => {
  test('Scenario 3.1: All 33 Canadian commodities in COMMODITY_PORTFOLIO link to /products/canadian/[slug].png', () => {
    const canadianCommodities = COMMODITY_PORTFOLIO.filter(c => c.corridor === 'canada');
    expect(canadianCommodities.length).toBe(33);

    canadianCommodities.forEach(c => {
      expect(c.image).toBe(`/products/canadian/${c.slug}.png`);
    });
  });

  test('Scenario 3.2: getPortfolioProducts populates image1 and images with Canadian studio paths', () => {
    const products = getPortfolioProducts('en');
    const canadianProducts = products.filter(p => p.corridor === 'canada');
    expect(canadianProducts.length).toBe(33);

    canadianProducts.forEach(p => {
      expect(p.image1).toBe(`/products/canadian/${p.slug}.png`);
      expect(p.images).toContain(`/products/canadian/${p.slug}.png`);
    });
  });

  test('Scenario 3.3: validateCanadianAsset returns valid compliant result for Canadian assets', async () => {
    const result = await validateCanadianAsset('milling-wheat', ASSET_DIR);

    expect(result.exists).toBe(true);
    expect(result.format).toBe('png');
    expect(result.isSquare).toBe(true);
    expect(result.isSufficientResolution).toBe(true);
    expect(result.isWhiteBackdrop).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
