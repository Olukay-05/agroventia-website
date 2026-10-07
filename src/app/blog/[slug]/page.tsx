import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBlogPosts, getBlogPostBySlug } from '@/lib/api/sanity-client';
import BlogPostClient from './BlogPostClient';
import { BASE_URL } from '@/lib/seo';

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
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params, searchParams }: BlogPostPageProps): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = query.lang || 'en';
  const post = await getBlogPostBySlug(slug, locale).catch(() => null);

  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/blog/${slug}?lang=${encodeURIComponent(locale)}`,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: BlogPostPageProps) {
  const { slug } = await params;
  const { lang = 'en' } = await searchParams;
  const post = await getBlogPostBySlug(slug, lang).catch(() => null);

  if (!post) {
    notFound();
  }

  const allPosts = await getBlogPosts(lang).catch(() => []);
  const relatedPosts = allPosts
    .filter(p => p._id !== post._id)
    .slice(0, 3);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f4e9]" />}>
      <BlogPostClient
        initialPost={post}
        initialRelatedPosts={relatedPosts}
        slug={slug}
        initialLocale={lang}
      />
    </Suspense>
  );
}
