import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionContainer from '@/components/common/SectionContainer';
import WixImage from '@/components/WixImage';
import { MOCK_OR_STATIC_BLOG_POSTS } from '@/lib/mock-blog-data';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';

export async function generateStaticParams() {
  return MOCK_OR_STATIC_BLOG_POSTS.map(post => ({
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
  const post = MOCK_OR_STATIC_BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f8f4e9]">
      <Header />

      <main className="pt-20">
        {/* Header Section */}
        <section className="relative w-full py-20 bg-[#281909] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--agro-primary-900)_0%,var(--agro-primary-950)_100%)] opacity-95" />

          {/* Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#225217] rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#CD7E0D] rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container-premium max-w-4xl mx-auto relative z-10">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-semibold text-agro-primary-300 hover:text-[#FDF8F0] mb-8 transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />{' '}
              Back to Blog
            </Link>

            <div className="space-y-6">
              <span className="inline-block px-4 py-1.5 bg-agro-primary-500/20 text-agro-primary-300 text-sm font-semibold rounded-full uppercase tracking-wider backdrop-blur-sm border border-agro-primary-500/30">
                {post.category}
              </span>

              <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl !leading-tight text-[#FDF8F0]">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-agro-neutral-300 py-4 border-t border-white/10 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-agro-primary-700 flex items-center justify-center text-[#FDF8F0]">
                    <User size={14} />
                  </div>
                  <span className="font-medium text-[#FDF8F0]">
                    {post.author}
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-agro-neutral-500" />
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-agro-primary-400" />
                  <span>{post.publishedDate}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-agro-neutral-500" />
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-agro-primary-400" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Image */}
        <div className="container-premium max-w-5xl mx-auto -mt-20 relative z-20 px-4 sm:px-6">
          <div className="aspect-[21/9] w-full relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#281909]">
            <WixImage
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <SectionContainer className="py-16 md:py-24 bg-[#f8f4e9]">
          <div className="container-premium max-w-3xl mx-auto">
            <div
              className="prose prose-lg md:prose-xl max-w-none
                            prose-headings:font-heading prose-headings:text-[#281909] prose-headings:font-bold
                            prose-p:text-agro-neutral-700 prose-p:leading-relaxed prose-p:font-light
                            prose-a:text-agro-primary-600 prose-a:font-semibold hover:prose-a:text-agro-primary-700 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-[#281909] prose-strong:font-bold
                            prose-blockquote:border-l-4 prose-blockquote:border-agro-primary-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-agro-neutral-600 prose-blockquote:bg-white/50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
                            prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-agro-primary-500
                            prose-img:rounded-xl prose-img:shadow-lg
                        "
            >
              {/* Using dangerouslySetInnerHTML for mock content structure */}
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Share Section */}
            <div className="mt-16 pt-10 border-t border-agro-neutral-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="font-heading font-bold text-xl text-[#281909]">
                  Share this article
                </div>
                <div className="flex gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full w-12 h-12 border-agro-neutral-300 hover:bg-agro-primary-50 hover:text-agro-primary-600 hover:border-agro-primary-200 transition-all"
                  >
                    <Twitter size={20} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full w-12 h-12 border-agro-neutral-300 hover:bg-agro-primary-50 hover:text-agro-primary-600 hover:border-agro-primary-200 transition-all"
                  >
                    <Facebook size={20} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full w-12 h-12 border-agro-neutral-300 hover:bg-agro-primary-50 hover:text-agro-primary-600 hover:border-agro-primary-200 transition-all"
                  >
                    <Linkedin size={20} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full w-12 h-12 border-agro-neutral-300 hover:bg-agro-primary-50 hover:text-agro-primary-600 hover:border-agro-primary-200 transition-all"
                  >
                    <Share2 size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Related Posts */}
        <section className="py-24 bg-white relative">
          <div className="container-premium">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <span className="text-agro-primary-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
                  Keep Reading
                </span>
                <h2 className="heading-section mb-0 text-[#281909]">
                  More Insights
                </h2>
              </div>
              <Link
                href="/blog"
                className="btn-agro-ghost py-2 px-6 rounded-lg text-sm group"
              >
                View all articles{' '}
                <ArrowRight
                  size={16}
                  className="ml-2 inline group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MOCK_OR_STATIC_BLOG_POSTS.filter(p => p._id !== post._id)
                .slice(0, 3)
                .map(relatedPost => (
                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    key={relatedPost._id}
                    className="group block h-full"
                  >
                    <article className="h-full flex flex-col bg-[#f8f4e9] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <WixImage
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-agro-primary-700 rounded-full uppercase tracking-wider">
                            {relatedPost.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-xs text-agro-neutral-500 mb-3">
                          <Calendar size={12} />
                          <span>{relatedPost.publishedDate}</span>
                        </div>
                        <h3 className="heading-card text-lg leading-snug group-hover:text-agro-primary-700 transition-colors mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <div className="mt-auto pt-4 flex items-center text-agro-primary-600 text-sm font-semibold group-hover:translate-x-1 transition-transform origin-left">
                          Read Now <ArrowRight size={14} className="ml-1" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* Simplified Newsletter Section */}
        <section className="py-20 bg-[#281909] text-white">
          <div className="container-premium text-center">
            <h2 className="heading-section text-white mb-4">
              Subscribe to our Newsletter
            </h2>
            <p className="text-agro-neutral-300 max-w-xl mx-auto mb-8">
              Join our community to receive the latest updates and expert
              insights directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-agro-primary-400 focus:bg-white/15 transition-all"
              />
              <Button className="btn-agro-primary">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
