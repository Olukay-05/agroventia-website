// lib/wix-config.ts
export interface WixConfig {
  apiToken: string;
  siteId: string;
  clientId: string;
  baseUrl: string;
}

// For client-side usage, we can only access NEXT_PUBLIC_ prefixed variables
const isClientSide = typeof window !== 'undefined';

export const wixConfig: WixConfig = {
  apiToken: process.env.WIX_API_TOKEN || '',
  siteId: isClientSide
    ? process.env.NEXT_PUBLIC_WIX_SITE_ID || ''
    : process.env.WIX_SITE_ID || '',
  clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID || '',
  baseUrl:
    process.env.WIX_API_BASE_URL || 'https://www.wixapis.com/wix-data/v2/items',
};

// Validate configuration only in production
if (process.env.NODE_ENV === 'production') {
  // On client side, we only check the public site ID
  if (isClientSide) {
    if (!wixConfig.siteId) {
      console.warn(
        'Missing required Wix site ID. Check your environment variables.'
      );
    }
  } else {
    // On server side, we check all required variables
    if (
      !wixConfig.apiToken ||
      !wixConfig.siteId ||
      !wixConfig.baseUrl ||
      !wixConfig.clientId
    ) {
      throw new Error(
        'Missing required Wix configuration. Check your environment variables.'
      );
    }
  }
}
