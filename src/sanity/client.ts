import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { apiVersion, dataset, projectId, useCdn } from './env';

// Keep module initialization safe for tests, but never substitute a real
// project. A missing project ID must fail at the Sanity request boundary.
const clientProjectId = projectId || 'missing-sanity-project-id';

export const client = createClient({
  projectId: clientProjectId,
  dataset,
  apiVersion,
  useCdn,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
