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

import {
  resolveProviderType,
  getDefaultModelId,
  getAvailableProviders,
  getTranslationModel,
} from '../provider';

describe('Tri-Provider Translation Engine - Provider Resolution Matrix', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.LLM_PROVIDER;
    delete process.env.LLM_MODEL;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Automatic Provider Detection Hierarchy', () => {
    it('returns null when no provider keys are available', () => {
      expect(resolveProviderType()).toBeNull();
      expect(getAvailableProviders()).toEqual([]);
      expect(getTranslationModel()).toBeNull();
    });

    it('prioritizes OpenRouter first when available in auto-detection', () => {
      process.env.OPENROUTER_API_KEY = 'sk-or-v1-mock-key';
      process.env.OPENAI_API_KEY = 'sk-openai-mock-key';
      process.env.ANTHROPIC_API_KEY = 'sk-ant-mock-key';

      expect(resolveProviderType()).toBe('openrouter');
      expect(getAvailableProviders()).toEqual(['openrouter', 'openai', 'anthropic']);
    });

    it('falls back to OpenAI when OpenRouter is absent', () => {
      process.env.OPENAI_API_KEY = 'sk-openai-mock-key';
      process.env.ANTHROPIC_API_KEY = 'sk-ant-mock-key';

      expect(resolveProviderType()).toBe('openai');
      expect(getAvailableProviders()).toEqual(['openai', 'anthropic']);
    });

    it('falls back to Anthropic when OpenRouter and OpenAI are absent', () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-mock-key';

      expect(resolveProviderType()).toBe('anthropic');
      expect(getAvailableProviders()).toEqual(['anthropic']);
    });
  });

  describe('Explicit LLM_PROVIDER Configuration', () => {
    it('respects explicit LLM_PROVIDER=openai even if OpenRouter key is set', () => {
      process.env.OPENROUTER_API_KEY = 'sk-or-v1-mock';
      process.env.OPENAI_API_KEY = 'sk-openai-mock';
      process.env.LLM_PROVIDER = 'openai';

      expect(resolveProviderType()).toBe('openai');
    });

    it('respects explicit LLM_PROVIDER=anthropic', () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-mock';
      process.env.LLM_PROVIDER = 'anthropic';

      expect(resolveProviderType()).toBe('anthropic');
    });

    it('falls back to auto-detection if explicit provider lacks the required key', () => {
      process.env.LLM_PROVIDER = 'openai';
      // No OPENAI_API_KEY, but ANTHROPIC_API_KEY is available
      process.env.ANTHROPIC_API_KEY = 'sk-ant-mock';

      expect(resolveProviderType()).toBe('anthropic');
    });
  });

  describe('Model ID Resolution', () => {
    it('returns default cost-effective model IDs for each provider', () => {
      expect(getDefaultModelId('openrouter')).toBe('anthropic/claude-3.5-haiku');
      expect(getDefaultModelId('openai')).toBe('gpt-4o-mini');
      expect(getDefaultModelId('anthropic')).toBe('claude-3-5-haiku-20241022');
    });

    it('honors LLM_MODEL environment override', () => {
      process.env.LLM_MODEL = 'openai/gpt-4o';
      expect(getDefaultModelId('openrouter')).toBe('openai/gpt-4o');
      expect(getDefaultModelId('openai')).toBe('openai/gpt-4o');
    });
  });

  describe('SDK Model Factory Initialization', () => {
    it('creates an OpenRouter model instance when key is present', () => {
      process.env.OPENROUTER_API_KEY = 'sk-or-mock-key';
      const resolved = getTranslationModel('openrouter');
      expect(resolved).not.toBeNull();
      expect(resolved?.provider).toBe('openrouter');
      expect(resolved?.modelId).toBe('anthropic/claude-3.5-haiku');
    });

    it('creates an OpenAI model instance when key is present', () => {
      process.env.OPENAI_API_KEY = 'sk-mock-key';
      const resolved = getTranslationModel('openai');
      expect(resolved).not.toBeNull();
      expect(resolved?.provider).toBe('openai');
      expect(resolved?.modelId).toBe('gpt-4o-mini');
    });

    it('creates an Anthropic model instance when key is present', () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-mock-key';
      const resolved = getTranslationModel('anthropic');
      expect(resolved).not.toBeNull();
      expect(resolved?.provider).toBe('anthropic');
      expect(resolved?.modelId).toBe('claude-3-5-haiku-20241022');
    });
  });
});
