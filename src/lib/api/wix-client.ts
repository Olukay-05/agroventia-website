// lib/api/wix-client.ts
/**
 * @deprecated Legacy Wix client is deprecated as part of Wix to Sanity migration (CAP-5).
 * Use `@/lib/api/sanity-client` and `@/types/wix` instead.
 * All Wix SDK dependencies (@wix/sdk, @wix/data, @wix/multilingual) have been completely removed.
 */
export * from '@/types/wix';
export * from './sanity-client';
