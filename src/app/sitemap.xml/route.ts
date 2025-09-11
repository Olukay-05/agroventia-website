// src/app/sitemap.xml/route.ts
import { generateSitemapEntry } from '@/lib/seo';

// Define all static pages
const STATIC_PAGES = [
  '/',
  '/products',
  '/about',
  '/services',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
];

// Generate sitemap
export async function GET() {
  const currentDate = new Date().toISOString();

  // Static pages entries
  const staticEntries = STATIC_PAGES.map(path =>
    generateSitemapEntry(path, currentDate, 'weekly', path === '/' ? 1.0 : 0.8)
  );

  // For dynamic content like products, we would fetch from the API
  // This is a simplified example - in a real implementation, you would fetch actual product data
  const productEntries = [
    // Example product entries - these would be dynamically generated from your product data
    generateSitemapEntry('/products/kolanut', currentDate, 'weekly', 0.7),
    generateSitemapEntry('/products/ginger', currentDate, 'weekly', 0.7),
    generateSitemapEntry('/products/hibiscus', currentDate, 'weekly', 0.7),
    generateSitemapEntry('/products/cocoa', currentDate, 'weekly', 0.7),
  ];

  // Combine all entries
  const allEntries = [...staticEntries, ...productEntries];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
