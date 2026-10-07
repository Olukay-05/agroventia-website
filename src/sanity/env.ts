export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-01';

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const projectId =
  rawProjectId && /^[a-z0-9-]+$/.test(rawProjectId) ? rawProjectId : '';

export const hasSanityConfig = Boolean(projectId && dataset);

export const useCdn = process.env.NODE_ENV === 'production';
