import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve('.'),
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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
