import React, { Suspense } from 'react';
import { getBlogPosts } from '@/lib/api/sanity-client';
import BlogListingClient from './BlogListingClient';

export const revalidate = 60;

export default async function BlogListingPage() {
  const initialPosts = await getBlogPosts().catch(() => []);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f4e9]" />}>
      <BlogListingClient initialPosts={initialPosts} />
    </Suspense>
  );
}
