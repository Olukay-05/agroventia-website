// src/app/robots.txt/route.ts
import { BASE_URL } from '@/lib/seo';

export async function GET() {
  const robotsTxt = `# *
User-agent: *
Allow: /

# Host
Host: ${BASE_URL}

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
