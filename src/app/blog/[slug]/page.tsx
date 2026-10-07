import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getBlogPosts, getBlogPostBySlug } from '@/lib/api/sanity-client';
import BlogPostClient from './BlogPostClient';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getBlogPosts().catch(() => []);
  return posts.map(post => ({
    slug: post.slug,
  }));
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  const allPosts = await getBlogPosts().catch(() => []);
  const relatedPosts = allPosts
    .filter(p => p._id !== post._id)
    .slice(0, 3);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f4e9]" />}>
      <BlogPostClient
        initialPost={post}
        initialRelatedPosts={relatedPosts}
        slug={slug}
      />
    </Suspense>
  );
}
