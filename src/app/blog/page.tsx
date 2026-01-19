import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

import SectionContainer from '@/components/common/SectionContainer';
import WixImage from '@/components/WixImage';
import { getBlogPosts } from '@/lib/api/wix-client';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { BlogPost, Category, Author } from '@/types/wix';

import { formatDate } from '@/lib/utils/date';

const NEWSLETTER_BG_IMAGE =
  'https://images.unsplash.com/photo-1625246333195-098e98e509c6';

export default async function BlogListingPage() {
  const posts = await getBlogPosts();

  const getCategoryTitle = (categories: Category[] | string[] | undefined) => {
    if (Array.isArray(categories) && categories.length > 0) {
      // Check if it's an object populated by include()
      const firstCat = categories[0];
      if (typeof firstCat === 'object' && 'title' in firstCat) {
        return (firstCat as Category).title;
      }
    }
    return 'Insights';
  };

  const getAuthorName = (author: Author | string | Author[] | undefined) => {
    if (Array.isArray(author) && author.length > 0) {
      const firstAuth = author[0];
      if (typeof firstAuth === 'object' && 'name' in firstAuth) {
        return (firstAuth as Author).name;
      }
    } else if (author && typeof author === 'object' && 'name' in author) {
      return (author as Author).name;
    }
    return 'AgroVentia Team';
  };

  return (
    <div className="min-h-screen bg-[#f8f4e9]">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        {/* Design Principle: Strong visual hierarchy and brand consistency with gradients */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#281909]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--agro-primary-900)_0%,var(--agro-primary-950)_100%)] opacity-95" />

          {/* Decorative Background Elements - Subtle depth */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#225217]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#CD7E0D]/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container-premium relative z-10 text-center">
            {/* Tag: Improved readability and spacing */}
            <span className="inline-block px-4 py-1.5 mb-8 rounded-full border border-agro-primary-500/30 bg-agro-primary-500/10 text-agro-primary-300 text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
              Our Blog
            </span>

            {/* Heading: H1 with proper scale */}
            <h1 className="heading-hero mb-6 block text-[#FDF8F0]">
              Latest Insights & News
            </h1>

            {/* Subheading: Optimized line height (1.6) and width (max-w-2xl) */}
            <p className="text-xl md:text-2xl font-light leading-relaxed text-[#F6F2E7] max-w-2xl mx-auto opacity-90">
              Stay updated with the latest trends, expert advice, and stories
              from the world of agriculture and global trade.
            </p>
          </div>
        </section>

        {/* Blog Grid Section */}
        <SectionContainer className="py-16 md:py-24 relative">
          <div className="container-premium">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              {posts.map(post => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post._id}
                  className="group block h-full focus:outline-none focus:ring-2 focus:ring-agro-primary-500 focus:ring-offset-4 rounded-3xl"
                >
                  <article className="h-full flex flex-col bg-white rounded-3xl overflow-hidden shadow-md group-hover:shadow-2xl border border-agro-neutral-100 transition-all duration-300 transform group-hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="relative h-64 w-full overflow-hidden">
                      <WixImage
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-xs font-bold text-agro-primary-700 rounded-full uppercase tracking-wider shadow-sm border border-agro-primary-100">
                          {getCategoryTitle(post.categories)}
                        </span>
                      </div>
                      {/* Gradient Overlay for visual consistency */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex flex-col flex-grow p-6 md:p-8">
                      {/* Metadata: Increased size for readability & contrast check (WCAG AA) */}
                      <div className="flex items-center gap-4 text-sm font-medium text-agro-neutral-600 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar
                            size={16}
                            className="text-agro-primary-600"
                          />
                          <span>{formatDate(post.publishedDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} className="text-agro-primary-600" />
                          <span>5 min read</span>
                        </div>
                      </div>

                      {/* Title: H2 hierarchy */}
                      <h2 className="heading-card text-xl md:text-2xl mb-4 text-agro-neutral-900 group-hover:text-agro-primary-700 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h2>

                      {/* Excerpt: Minimum 16px font size for body text */}
                      <p className="text-body text-base line-clamp-3 mb-8 flex-grow text-agro-neutral-600 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Footer: User & CTA */}
                      <div className="pt-6 border-t border-agro-neutral-100 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-agro-neutral-700">
                          <div className="w-8 h-8 rounded-full bg-agro-primary-50 flex items-center justify-center text-agro-primary-700 border border-agro-primary-100">
                            <User size={14} />
                          </div>
                          <span>{getAuthorName(post.author)}</span>
                        </div>
                        <span className="text-sm font-bold text-agro-primary-700 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                          Read Article <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="mt-20 text-center">
              <Button
                size="lg"
                variant="outline"
                className="btn-agro-outline text-base py-6 px-10 rounded-xl border-2 hover:bg-agro-primary-50 focus:ring-2 focus:ring-agro-primary-300 focus:ring-offset-2"
              >
                View All Articles
              </Button>
            </div>
          </div>
        </SectionContainer>


      </main>

      <Footer />
    </div>
  );
}
