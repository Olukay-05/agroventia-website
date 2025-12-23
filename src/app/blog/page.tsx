import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

import SectionContainer from '@/components/common/SectionContainer';
import WixImage from '@/components/WixImage';
import { MOCK_OR_STATIC_BLOG_POSTS } from '@/lib/mock-blog-data';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';

const NEWSLETTER_BG_IMAGE =
  'https://images.unsplash.com/photo-1625246333195-098e98e509c6';

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-[#f8f4e9]">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#281909]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--agro-primary-900)_0%,var(--agro-primary-950)_100%)] opacity-90" />

          {/* Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#225217]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#CD7E0D]/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container-premium relative z-10 text-center">
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full border border-agro-primary-500/30 bg-agro-primary-500/10 text-agro-primary-300 text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
              Our Blog
            </span>
            <h1 className="heading-hero mb-6 block text-[#FDF8F0]">
              Latest Insights & News
            </h1>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-[#F6F2E7] max-w-2xl mx-auto opacity-90">
              Stay updated with the latest trends, expert advice, and stories
              from the world of agriculture and global trade.
            </p>
          </div>
        </section>

        {/* Blog Grid Section */}
        <SectionContainer className="py-16 md:py-24 relative">
          <div className="container-premium">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {MOCK_OR_STATIC_BLOG_POSTS.map(post => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post._id}
                  className="group block h-full transform transition-all duration-300 hover:-translate-y-2"
                >
                  <article className="h-full flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg border border-agro-neutral-100 hover:shadow-xl transition-all duration-300">
                    <div className="relative h-64 w-full overflow-hidden">
                      <WixImage
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-xs font-bold text-agro-primary-700 rounded-full uppercase tracking-wider shadow-sm border border-agro-primary-100">
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex flex-col flex-grow p-6 md:p-8">
                      <div className="flex items-center gap-4 text-xs font-medium text-agro-neutral-500 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar
                            size={14}
                            className="text-agro-primary-500"
                          />
                          <span>{post.publishedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-agro-primary-500" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <h2 className="heading-card text-xl md:text-2xl mb-3 text-agro-neutral-900 group-hover:text-agro-primary-700 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-body text-sm md:text-base line-clamp-3 mb-6 flex-grow">
                        {post.excerpt}
                      </p>

                      <div className="pt-6 border-t border-agro-neutral-100 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold text-agro-neutral-600">
                          <div className="w-6 h-6 rounded-full bg-agro-primary-100 flex items-center justify-center text-agro-primary-700">
                            <User size={12} />
                          </div>
                          <span>{post.author}</span>
                        </div>
                        <span className="text-sm font-bold text-agro-primary-600 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
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
                className="btn-agro-outline text-base py-6 px-10 rounded-xl border-2 hover:bg-agro-primary-50"
              >
                View All Articles
              </Button>
            </div>
          </div>
        </SectionContainer>

        {/* Newsletter Section */}
        <section className="py-24 bg-gradient-to-br from-agro-primary-900 to-agro-primary-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <WixImage
              src={NEWSLETTER_BG_IMAGE}
              alt="Agriculture background"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-agro-primary-950/80 backdrop-blur-sm" />

          <div className="container-premium text-center relative z-10">
            <h2 className="heading-section text-3xl md:text-5xl text-white mb-6">
              Stay Cultivated
            </h2>
            <p className="text-lg md:text-xl font-light text-agro-primary-100 max-w-2xl mx-auto mb-10">
              Get the latest market insights, agricultural news, and company
              updates delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all font-medium"
              />
              <Button className="btn-agro-secondary py-4 px-8 h-auto rounded-xl text-lg shadow-lg hover:shadow-xl">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
