import React, { Suspense } from 'react';
import { getBlogPosts } from '@/lib/api/sanity-client';
import BlogListingClient from './BlogListingClient';

export const revalidate = 60;

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang = 'en' } = await searchParams;
  const initialPosts = await getBlogPosts(lang).catch(() => []);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f4e9]" />}>
      <BlogListingClient initialPosts={initialPosts} initialLocale={lang} />
    </Suspense>
  );
}
