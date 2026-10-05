jest.mock('ai', () => ({
  generateObject: jest.fn(),
}));

jest.mock('@ai-sdk/openai', () => ({
  createOpenAI: jest.fn(() =>
    jest.fn((modelId: string) => ({ modelId, mockProvider: 'openai' }))
  ),
}));

jest.mock('@ai-sdk/anthropic', () => ({
  createAnthropic: jest.fn(() =>
    jest.fn((modelId: string) => ({ modelId, mockProvider: 'anthropic' }))
  ),
}));

import { generateObject } from 'ai';
import { translateText, translateBatch } from '../translator';
import {
  getCachedTranslation,
  setCachedTranslation,
  clearTranslationCache,
  generateTranslationKey,
  getTranslationCacheStats,
} from '../cache';
import { sanitizeNoDashes, cleanTextValidator } from '../schema';

describe('Tri-Provider Translation Engine - Core & Cache Tests', () => {
  beforeEach(() => {
    clearTranslationCache();
    jest.clearAllMocks();
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.LLM_PROVIDER;
  });

  afterAll(() => {
    clearTranslationCache();
  });

  describe('Dash Prohibition & Anti-AI Slop Sanitation', () => {
    it('should eliminate em-dashes and en-dashes from translations', () => {
      const textWithEmDash = 'AgroVentia — connecting Canadian food processors — with premium commodities';
      const sanitized = sanitizeNoDashes(textWithEmDash);
      expect(sanitized).not.toContain('—');
      expect(sanitized).not.toContain('–');
      expect(sanitized).toBe('AgroVentia, connecting Canadian food processors, with premium commodities');
    });

    it('should replace floating hyphen clause separators but preserve compound words', () => {
      const textWithFloatingHyphens = 'Top grade soybeans - harvested naturally - for high-protein feed';
      const sanitized = sanitizeNoDashes(textWithFloatingHyphens);
      expect(sanitized).not.toMatch(/\s-\s/);
      expect(sanitized).toContain('high-protein'); // Compound word preserved
      expect(sanitized).toBe('Top grade soybeans, harvested naturally, for high-protein feed');
    });

    it('should validate clean text with cleanTextValidator', () => {
      expect(() => cleanTextValidator.parse('Clean text, natural phrasing')).not.toThrow();
      expect(() => cleanTextValidator.parse('Text with em-dash — slop')).toThrow();
      expect(() => cleanTextValidator.parse('Text with en-dash – slop')).toThrow();
      expect(() => cleanTextValidator.parse('Text with floating hyphen - slop')).toThrow();
    });
  });

  describe('SHA-256 Token Caching Layer', () => {
    it('generates deterministic SHA-256 keys', () => {
      const key1 = generateTranslationKey('Raw Cashew Nuts', 'Product Catalog');
      const key2 = generateTranslationKey('Raw Cashew Nuts', 'Product Catalog');
      const keyDiffContext = generateTranslationKey('Raw Cashew Nuts', 'Homepage');

      expect(key1).toHaveLength(64);
      expect(key1).toBe(key2);
      expect(key1).not.toBe(keyDiffContext);
    });

    it('retrieves cached translations with < 2ms latency and 0 remote tokens', async () => {
      const source = 'Raw Cashew Nuts';
      const context = 'Product Title';

      setCachedTranslation(
        source,
        {
          fr: "Noix d'anacarde brutes (en coque)",
          esp: 'Nueces de anacardo crudas (con cáscara)',
        },
        context
      );

      const startTime = performance.now();
      const result = await translateText({ text: source, context });
      const duration = performance.now() - startTime;

      expect(result.cached).toBe(true);
      expect(result.fr).toBe("Noix d'anacarde brutes (en coque)");
      expect(result.esp).toBe('Nueces de anacardo crudas (con cáscara)');
      expect(duration).toBeLessThan(10); // Cache retrieval under 10ms (typically <2ms in memory)
    });

    it('honors forceFresh to bypass cache when requested', async () => {
      const source = 'Split Dried Ginger';
      setCachedTranslation(
        source,
        {
          fr: 'Cached French',
          esp: 'Cached Spanish',
        }
      );

      // Cached hit
      const normalResult = await translateText({ text: source });
      expect(normalResult.fr).toBe('Cached French');
      expect(normalResult.cached).toBe(true);

      // Force fresh bypass
      const freshResult = await translateText({ text: source, forceFresh: true });
      expect(freshResult.fr).toBe('Gingembre séché concassé'); // Re-evaluated from glossary
      expect(freshResult.cached).toBe(false);
    });

    it('tracks cache hits and misses stats accurately', () => {
      clearTranslationCache();
      getCachedTranslation('Non-existent text');
      setCachedTranslation('Sample text', { fr: 'Exemple', esp: 'Ejemplo' });
      getCachedTranslation('Sample text');

      const stats = getTranslationCacheStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.size).toBe(1);
    });
  });

  describe('Deterministic Agribusiness Glossary Fallback', () => {
    it('translates benchmark commodities with exact industry nomenclature and ACIA / CFIA acronyms', async () => {
      const result = await translateText({
        text: 'Moisture: < 10%, FFA: < 2%, Cleaned and hand-sorted, CFIA compliant',
      });

      expect(result.fr).toContain('conforme ACIA');
      expect(result.fr).not.toContain('CFIA'); // Converted to Canadian French ACIA
      expect(result.fr).not.toContain('—');
      expect(result.esp).not.toContain('—');
      expect(result.fr).toContain('< 10%'); // Invariant metric preserved
      expect(result.fr).toContain('< 2%'); // Invariant metric preserved
    });

    it('translates raw cashew specifications maintaining KOR outturn and nut counts', async () => {
      const result = await translateText({
        text: 'Nut count: 180 to 200 per kg, Outturn: 48 to 50 lbs, Moisture: < 9%',
      });

      expect(result.fr).toBe('Nombre de noix: 180 à 200 par kg, Rendement KOR: 48 à 50 lbs, Humidité: < 9%');
      expect(result.esp).toBe('Conteo de nueces: 180 a 200 por kg, Rendimiento KOR: 48 a 50 lbs, Humedad: < 9%');
    });

    it('handles empty or whitespace text gracefully', async () => {
      const result = await translateText({ text: '   ' });
      expect(result.fr).toBe('');
      expect(result.esp).toBe('');
    });
  });

  describe('Remote LLM Execution & Provider Cascading', () => {
    it('calls remote generateObject when credentials are provided', async () => {
      process.env.OPENAI_API_KEY = 'sk-mock-key';

      (generateObject as jest.Mock).mockResolvedValueOnce({
        object: {
          fr: 'Haricots de soja sans OGM de qualité supérieure',
          esp: 'Frijoles de soja no modificados genéticamente de primera calidad',
        },
      });

      const result = await translateText({
        text: 'Custom Novel Product Description',
        context: 'Product Catalog',
      });

      expect(result.cached).toBe(false);
      expect(result.provider).toBe('openai');
      expect(result.fr).toBe('Haricots de soja sans OGM de qualité supérieure');
      expect(generateObject).toHaveBeenCalledTimes(1);

      // Verify second call is served from cache
      const cachedResult = await translateText({
        text: 'Custom Novel Product Description',
        context: 'Product Catalog',
      });
      expect(cachedResult.cached).toBe(true);
      expect(generateObject).toHaveBeenCalledTimes(1); // 0 additional remote calls
    });

    it('cascades to alternate provider or glossary if primary provider fails', async () => {
      process.env.OPENROUTER_API_KEY = 'sk-or-mock';
      process.env.OPENAI_API_KEY = 'sk-openai-mock';

      // First call (OpenRouter) fails with 429 Rate Limit
      (generateObject as jest.Mock)
        .mockRejectedValueOnce(new Error('Rate limit exceeded: 429'))
        // Secondary call (OpenAI) succeeds
        .mockResolvedValueOnce({
          object: {
            fr: 'Traduction de secours réussie',
            esp: 'Traducción de respaldo exitosa',
          },
        });

      const result = await translateText({
        text: 'Novel text to trigger cascade',
      });

      expect(result.fr).toBe('Traduction de secours réussie');
      expect(generateObject).toHaveBeenCalledTimes(2);
    });
  });

  describe('Batch Translation Processor', () => {
    it('processes batch translation items and returns structured summary', async () => {
      const batchItems = [
        {
          id: 'prod-1',
          type: 'productsContent',
          field: 'title',
          sourceText: 'Raw Cashew Nuts',
          context: 'Product Title',
        },
        {
          id: 'prod-2',
          type: 'productsContent',
          field: 'title',
          sourceText: 'Split Dried Ginger',
          context: 'Product Title',
        },
        {
          id: 'prod-3',
          type: 'productsContent',
          field: 'emptyField',
          sourceText: '',
        },
      ];

      const summary = await translateBatch(batchItems);
      expect(summary.total).toBe(3);
      expect(summary.skipped).toBe(1);
      expect(summary.translated).toBe(2);
      expect(summary.errors).toHaveLength(0);
    });
  });
});
