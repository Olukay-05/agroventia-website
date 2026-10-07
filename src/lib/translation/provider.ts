// src/lib/translation/provider.ts
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { LLMProviderType } from './types';

export interface ResolvedTranslationModel {
  model: any;
  provider: LLMProviderType;
  modelId: string;
}

/**
 * Returns default cost-effective model ID for each supported provider.
 */
export function getDefaultModelId(provider: LLMProviderType): string {
  switch (provider) {
    case 'openrouter':
      return process.env.LLM_MODEL || 'anthropic/claude-3.5-haiku';
    case 'openai':
      return process.env.LLM_MODEL || 'gpt-4o-mini';
    case 'anthropic':
      return process.env.LLM_MODEL || 'claude-3-5-haiku-20241022';
  }
}

/**
 * Resolves the active provider type based on explicit config or automatic detection.
 */
export function resolveProviderType(): LLMProviderType | null {
  const explicit = (process.env.LLM_PROVIDER || '').toLowerCase().trim();

  if (explicit === 'openrouter' && process.env.OPENROUTER_API_KEY) {
    return 'openrouter';
  }
  if (explicit === 'openai' && process.env.OPENAI_API_KEY) {
    return 'openai';
  }
  if (explicit === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
    return 'anthropic';
  }

  // Automatic Detection Matrix: OpenRouter -> OpenAI -> Anthropic
  if (process.env.OPENROUTER_API_KEY) {
    return 'openrouter';
  }
  if (process.env.OPENAI_API_KEY) {
    return 'openai';
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return 'anthropic';
  }

  return null;
}

/**
 * Creates and returns a Vercel AI SDK LanguageModel instance for the specified or detected provider.
 * Returns null if no valid credentials are found (triggers offline dictionary fallback).
 */
export function getTranslationModel(
  overrideProvider?: LLMProviderType
): ResolvedTranslationModel | null {
  const provider = overrideProvider || resolveProviderType();

  if (!provider) {
    return null;
  }

  try {
    switch (provider) {
      case 'openrouter': {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) return null;
        const modelId = getDefaultModelId('openrouter');
        const openrouter = createOpenAI({
          baseURL: 'https://openrouter.ai/api/v1',
          apiKey,
          headers: {
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://agroventia.ca',
            'X-Title': 'AgroVentia Canadian Agribusiness Platform',
          },
        });
        return {
          model: openrouter(modelId),
          provider: 'openrouter',
          modelId,
        };
      }

      case 'openai': {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return null;
        const modelId = getDefaultModelId('openai');
        const openai = createOpenAI({ apiKey });
        return {
          model: openai(modelId),
          provider: 'openai',
          modelId,
        };
      }

      case 'anthropic': {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) return null;
        const modelId = getDefaultModelId('anthropic');
        const anthropic = createAnthropic({ apiKey });
        return {
          model: anthropic(modelId),
          provider: 'anthropic',
          modelId,
        };
      }

      default:
        return null;
    }
  } catch (err) {
    console.error(`[TranslationProvider] Error initializing provider ${provider}:`, err);
    return null;
  }
}

/**
 * Returns available backup providers for cascading in case of upstream HTTP 429/503.
 */
export function getAvailableProviders(): LLMProviderType[] {
  const providers: LLMProviderType[] = [];
  if (process.env.OPENROUTER_API_KEY) providers.push('openrouter');
  if (process.env.OPENAI_API_KEY) providers.push('openai');
  if (process.env.ANTHROPIC_API_KEY) providers.push('anthropic');
  return providers;
}
