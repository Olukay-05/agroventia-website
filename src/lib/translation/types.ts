// src/lib/translation/types.ts

export type LLMProviderType = 'openrouter' | 'openai' | 'anthropic';

export interface TranslationModelConfig {
  provider: LLMProviderType;
  modelId: string;
  apiKey: string;
  baseURL?: string;
  temperature?: number;
}

export interface TranslationInput {
  text: string;
  context?: string; // e.g. "Product Catalog Specification" | "Homepage Hero CTA"
  sourceLang?: 'en';
  forceFresh?: boolean; // Bypass cache if editor explicitly requests re-translation
}

export interface TranslationOutput {
  fr: string; // Canadian French (fr-CA)
  esp: string; // International B2B Spanish (es / esp)
  cached?: boolean;
  provider?: LLMProviderType;
  model?: string;
}

export interface TranslationCacheEntry {
  key: string;
  sourceText: string;
  context?: string;
  fr: string;
  esp: string;
  timestamp: number;
}

export interface BatchItemToTranslate {
  id: string;
  type: string;
  field: string;
  sourceText: string;
  context?: string;
}

export interface BatchTranslationResult {
  total: number;
  translated: number;
  cached: number;
  skipped: number;
  errors: Array<{ id: string; field: string; error: string }>;
}
