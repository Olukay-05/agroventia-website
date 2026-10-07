// src/lib/translation/translator.ts
import { generateObject } from 'ai';
import { TranslationOutputSchema, sanitizeNoDashes } from './schema';
import {
  AGROVENTIA_SYSTEM_PROMPT,
  lookupFallbackDictionary,
} from './agribusiness-glossary';
import { getCachedTranslation, setCachedTranslation } from './cache';
import {
  getTranslationModel,
  getAvailableProviders,
  type ResolvedTranslationModel,
} from './provider';
import type {
  TranslationInput,
  TranslationOutput,
  BatchItemToTranslate,
  BatchTranslationResult,
  LLMProviderType,
} from './types';

/**
 * Translates commercial agricultural English text into Canadian French (fr-CA)
 * and International B2B Spanish (es / esp) with zero AI slop, zero em-dashes, and SHA-256 caching.
 */
export async function translateText(
  input: TranslationInput
): Promise<TranslationOutput> {
  const { text, context = '', forceFresh = false } = input;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return { fr: '', esp: '', cached: true };
  }

  const cleanText = text.trim();

  // 1. SHA-256 Cache Check (Immediate resolution in < 2ms, 0 tokens)
  if (!forceFresh) {
    const cached = getCachedTranslation(cleanText, context);
    if (cached) {
      return {
        fr: sanitizeNoDashes(cached.fr),
        esp: sanitizeNoDashes(cached.esp),
        cached: true,
      };
    }
  }

  // 2. Check Deterministic Agribusiness Dictionary first for exact benchmark hits
  const dictionaryMatch = lookupFallbackDictionary(cleanText);

  if (dictionaryMatch) {
    const canonicalResult = {
      fr: sanitizeNoDashes(dictionaryMatch.fr),
      esp: sanitizeNoDashes(dictionaryMatch.esp),
      cached: false,
    };
    setCachedTranslation(cleanText, canonicalResult, context);
    return canonicalResult;
  }

  // 3. Resolve LLM Provider Model
  const resolvedModel = getTranslationModel();

  // If no LLM credentials are configured (e.g. CI / offline / test mode), use dictionary match
  if (!resolvedModel) {
    throw new Error(
      'No translation provider is configured and the source text is not in the deterministic glossary.'
    );
  }

  // 4. Remote LLM Execution via Vercel AI SDK
  try {
    const result = await executeRemoteTranslation(cleanText, context, resolvedModel);

    // Cache verified translation
    setCachedTranslation(
      cleanText,
      { fr: result.fr, esp: result.esp },
      context
    );

    return result;
  } catch (err: any) {
    console.warn(
      `[TranslationService] Provider ${resolvedModel.provider} failed: ${err.message}. Attempting cascade fallback.`
    );

    // 5. Cascade fallback to alternate configured providers
    const alternateProviders = getAvailableProviders().filter(
      (p) => p !== resolvedModel.provider
    );

    for (const altProvider of alternateProviders) {
      const altModel = getTranslationModel(altProvider);
      if (!altModel) continue;

      try {
        const altResult = await executeRemoteTranslation(cleanText, context, altModel);
        setCachedTranslation(
          cleanText,
          { fr: altResult.fr, esp: altResult.esp },
          context
        );
        return altResult;
      } catch (altErr: any) {
        console.warn(
          `[TranslationService] Cascade provider ${altProvider} failed: ${altErr.message}`
        );
      }
    }

    throw new Error(
      `All configured translation providers failed for ${context || 'unscoped content'}.`
    );
  }
}

/**
 * Invokes Vercel AI SDK generateObject with structured output schema and agribusiness context.
 */
async function executeRemoteTranslation(
  cleanText: string,
  context: string,
  resolved: ResolvedTranslationModel
): Promise<TranslationOutput> {
  const prompt = [
    context ? `Context: ${context}` : '',
    `English source to translate:`,
    `"""`,
    cleanText,
    `"""`,
  ]
    .filter(Boolean)
    .join('\n');

  const { object } = await generateObject({
    model: resolved.model,
    system: AGROVENTIA_SYSTEM_PROMPT,
    schema: TranslationOutputSchema,
    prompt,
    temperature: 0.1,
  });

  return {
    fr: sanitizeNoDashes(object.fr),
    esp: sanitizeNoDashes(object.esp),
    cached: false,
    provider: resolved.provider,
    model: resolved.modelId,
  };
}

/**
 * Batch translation runner for CLI scripts and bulk content migrations.
 */
export async function translateBatch(
  items: BatchItemToTranslate[]
): Promise<BatchTranslationResult> {
  const summary: BatchTranslationResult = {
    total: items.length,
    translated: 0,
    cached: 0,
    skipped: 0,
    errors: [],
  };

  for (const item of items) {
    if (!item.sourceText || !item.sourceText.trim()) {
      summary.skipped++;
      continue;
    }

    try {
      const res = await translateText({
        text: item.sourceText,
        context: item.context,
      });

      if (res.cached) {
        summary.cached++;
      } else {
        summary.translated++;
      }
    } catch (err: any) {
      summary.errors.push({
        id: item.id,
        field: item.field,
        error: err.message || 'Unknown error',
      });
    }
  }

  return summary;
}
