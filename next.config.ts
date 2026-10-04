import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      'sanity/structure': './node_modules/sanity/lib/structure.js',
      'sanity/router': './node_modules/sanity/lib/router.js',
      'sanity/desk': './node_modules/sanity/lib/desk.js',
      'sanity/presentation': './node_modules/sanity/lib/presentation.js',
      sanity: './node_modules/sanity/lib/index.js',
    },
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
