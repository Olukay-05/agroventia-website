// src/lib/translation/cache.ts
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import type { TranslationCacheEntry } from './types';

// In-memory cache store
const memoryCache = new Map<string, TranslationCacheEntry>();

let cacheHits = 0;
let cacheMisses = 0;

// Resolve cache directory path
function getCacheFilePath(): string {
  return path.resolve(process.cwd(), '.cache', 'translations.json');
}

/**
 * Initializes persistent cache from disk if available and enabled.
 */
function loadDiskCache(): void {
  try {
    if (process.env.TRANSLATION_CACHE_ENABLED === 'false') return;

    const filePath = getCacheFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const entries: Record<string, TranslationCacheEntry> = JSON.parse(data);
      for (const [key, entry] of Object.entries(entries)) {
        memoryCache.set(key, entry);
      }
    }
  } catch {
    // Disk cache read is optional and non-blocking (e.g. read-only serverless environment)
  }
}

/**
 * Persists in-memory cache entries to disk.
 */
function saveDiskCache(): void {
  try {
    if (process.env.TRANSLATION_CACHE_ENABLED === 'false') return;

    const filePath = getCacheFilePath();
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const obj: Record<string, TranslationCacheEntry> = {};
    for (const [key, entry] of memoryCache.entries()) {
      obj[key] = entry;
    }

    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf-8');
  } catch {
    // Disk write is best-effort and non-blocking
  }
}

// Initialize on module load
loadDiskCache();

/**
 * Computes a deterministic SHA-256 hash from source text and context.
 */
export function generateTranslationKey(sourceText: string, context = ''): string {
  const normalized = (sourceText || '').trim().replace(/\s+/g, ' ');
  const normalizedContext = (context || '').trim();
  return crypto
    .createHash('sha256')
    .update(`${normalized}|${normalizedContext}`)
    .digest('hex');
}

/**
 * Retrieves a cached translation if available.
 * Returns null on miss or when caching is disabled.
 */
export function getCachedTranslation(
  sourceText: string,
  context?: string
): { fr: string; esp: string } | null {
  if (process.env.TRANSLATION_CACHE_ENABLED === 'false') {
    return null;
  }

  const key = generateTranslationKey(sourceText, context);
  const entry = memoryCache.get(key);

  if (entry && entry.fr && entry.esp) {
    cacheHits++;
    return { fr: entry.fr, esp: entry.esp };
  }

  cacheMisses++;
  return null;
}

/**
 * Saves a translation to memory cache and writes to disk.
 */
export function setCachedTranslation(
  sourceText: string,
  translation: { fr: string; esp: string },
  context?: string
): void {
  if (process.env.TRANSLATION_CACHE_ENABLED === 'false') return;

  const key = generateTranslationKey(sourceText, context);
  const entry: TranslationCacheEntry = {
    key,
    sourceText,
    context,
    fr: translation.fr,
    esp: translation.esp,
    timestamp: Date.now(),
  };

  memoryCache.set(key, entry);
  saveDiskCache();
}

/**
 * Clears in-memory and persistent cache.
 */
export function clearTranslationCache(): void {
  memoryCache.clear();
  cacheHits = 0;
  cacheMisses = 0;

  try {
    const filePath = getCacheFilePath();
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Non-blocking
  }
}

/**
 * Returns cache telemetry and hit rates.
 */
export function getTranslationCacheStats(): {
  size: number;
  hits: number;
  misses: number;
} {
  return {
    size: memoryCache.size,
    hits: cacheHits,
    misses: cacheMisses,
  };
}
