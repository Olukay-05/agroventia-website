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
import { getBlogPosts, getBlogPostBySlug } from '@/lib/api/wix-client';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import RichTextRenderer from '@/components/blog/RichTextRenderer';
import { Category, Author } from '@/types/wix';
import { formatDate } from '@/lib/utils/date';

export async function generateStaticParams() {
  const posts = await getBlogPosts();
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
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch related posts (simple strategy: get all and filter out current)
  // In a real large-scale app, we would query with filter excluding ID
  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts
    .filter(p => p._id !== post._id)
    .slice(0, 3);



  const getCategoryTitle = (categories: Category[] | string[] | undefined) => {
    if (Array.isArray(categories) && categories.length > 0) {
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
        {/* Header Section */}
        <section className="relative w-full py-24 md:py-32 bg-[#281909] overflow-hidden">
          {/* Enhanced Gradient with smoother transition - Brand Consistent */}
          <div className="absolute inset-0 bg-gradient-to-br from-agro-primary-900 via-[#1a0f06] to-[#0f0803] opacity-95" />

          {/* Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-agro-primary-800/40 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-agro-secondary-600/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container-premium max-w-4xl mx-auto relative z-10 px-4 md:px-0">
            {/* Semantic Navigation */}
            <nav aria-label="Breadcrumb" className="mb-8 md:mb-12">
              <Link
                href="/blog"
                className="inline-flex text-[#f8f4e9] items-center text-sm font-semibold text-agro-primary-300 hover:text-white transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-agro-primary-400 rounded-md px-2 py-1 -ml-2"
              >
                <ArrowLeft className="mr-2 text-[#f8f4e9] h-4 w-4 group-hover:-translate-x-1 transition-transform ease-out" />
                Back to Blog
              </Link>
            </nav>

            <div className="space-y-6 md:space-y-8 animate-fade-in-up">
              {/* Category Tag */}
              <div>
                <span className="inline-flex text-[#f8f4e9] items-center px-4 py-1.5 bg-agro-primary-500/20 text-agro-primary-200 text-xs md:text-sm font-bold rounded-full uppercase tracking-wider backdrop-blur-sm border border-agro-primary-500/30 hover:bg-agro-primary-500/30 transition-colors">
                  {getCategoryTitle(post.categories)}
                </span>
              </div>

              {/* H1 Title with proper hierarchy and responsiveness */}
              <h1 className="heading-display text-[#f8f4e9] text-4xl sm:text-5xl md:text-5xl lg:text-6xl !leading-[1.15] text-[#FDF8F0] tracking-tight drop-shadow-sm">
                {post.title}
              </h1>

              {/* Metadata Cluster */}
              <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm md:text-base text-agro-neutral-300 py-6 border-t border-white/10 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-agro-primary-800/80 border border-agro-primary-700 flex items-center justify-center text-[#FDF8F0] shadow-md ring-2 ring-white/5">
                    <User size={18} />
                  </div>
                  <span className="font-semibold text-[#FDF8F0] tracking-wide">
                    {getAuthorName(post.author)}
                  </span>
                </div>

                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-agro-neutral-600" />

                <div className="flex items-center gap-2.5" title="Published date">
                  <Calendar size={18} className="text-agro-primary-400" />
                  <span className="font-medium tracking-normal opacity-90">{formatDate(post.publishedDate)}</span>
                </div>

                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-agro-neutral-600" />

                <div className="flex items-center gap-2.5" title="Estimated reading time">
                  <Clock size={18} className="text-agro-primary-400" />
                  <span className="font-medium tracking-normal opacity-90">5 min read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Image Section with visual depth */}
        <div className="container-premium max-w-5xl mx-auto -mt-24 md:-mt-32 relative z-20 px-4 sm:px-6 mb-12">
          <div className="aspect-[16/9] md:aspect-[21/9] w-full relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-agro-neutral-900 border-4 border-white dark:border-[#281909]">
            {/* Fallback color while loading */}
            <div className="absolute inset-0 bg-agro-neutral-200 animate-pulse" />
            <WixImage
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transform transition-transform duration-700 hover:scale-105"
              priority
            />
            {/* Gradient Overlay for subtle depth */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl md:rounded-3xl" />
          </div>
        </div>

        {/* Main Content Section */}
        <SectionContainer className="pb-16 md:pb-24 pt-4 md:pt-8 bg-[#f8f4e9]">
          <div className="container-premium max-w-3xl mx-auto px-4 sm:px-6">
            <article
              className="prose prose-lg md:prose-xl prose-stone max-w-prose mx-auto
                            prose-headings:font-heading prose-headings:text-[#281909] prose-headings:font-bold prose-headings:scroll-mt-24
                            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 cursor-auto
                            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-agro-neutral-700 prose-p:leading-[1.75] prose-p:font-normal prose-p:tracking-wide
                            prose-a:text-agro-primary-700 prose-a:font-semibold prose-a:border-b-2 prose-a:border-agro-primary-300 prose-a:no-underline hover:prose-a:bg-agro-primary-50 hover:prose-a:text-agro-primary-800 transition-colors
                            prose-strong:text-[#281909] prose-strong:font-bold
                            prose-blockquote:border-l-4 prose-blockquote:border-agro-primary-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-agro-neutral-600 prose-blockquote:bg-white/40 prose-blockquote:py-4 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg prose-blockquote:my-10
                            prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-agro-primary-500 prose-li:pl-2
                            prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-12
                            prose-hr:border-agro-neutral-200 prose-hr:my-12
                        "
            >
              <RichTextRenderer content={post.content} />
            </article>

            {/* Share Section with better spacing */}
            <div className="mt-20 pt-12 border-t border-agro-neutral-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="font-heading font-bold text-xl text-[#281909]">
                  Share this article
                </div>
                <div className="flex gap-4">
                  {[
                    { Icon: Twitter, label: 'Share on Twitter' },
                    { Icon: Facebook, label: 'Share on Facebook' },
                    { Icon: Linkedin, label: 'Share on LinkedIn' },
                    { Icon: Share2, label: 'Copy Link' }
                  ].map(({ Icon, label }, index) => (
                    <Button
                      key={index}
                      size="icon"
                      variant="outline"
                      aria-label={label}
                      className="rounded-full w-12 h-12 border-agro-neutral-300 bg-white/50 hover:bg-white hover:text-agro-primary-600 hover:border-agro-primary-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    >
                      <Icon size={20} />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Related Posts Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <svg width="400" height="400" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="currentColor" className="text-agro-primary-500" />
            </svg>
          </div>

          <div className="container-premium">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 border-b border-agro-neutral-100 pb-8">
              <div className="max-w-2xl">
                <span className="text-agro-primary-600 font-bold tracking-wider uppercase text-xs md:text-sm mb-3 block">
                  Keep Reading
                </span>
                <h2 className="heading-section mb-0 text-[#281909]">
                  More Insights from <span className="text-agro-primary-600">AgroVentia</span>
                </h2>
              </div>
              <Link
                href="/blog"
                className="group flex items-center gap-2 text-agro-neutral-600 hover:text-agro-primary-600 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-agro-primary-50"
              >
                View all articles
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {relatedPosts.map(relatedPost => (
                <Link
                  href={`/blog/${relatedPost.slug}`}
                  key={relatedPost._id}
                  className="group block h-full focus:outline-none focus:ring-2 focus:ring-agro-primary-500 focus:ring-offset-2 rounded-3xl"
                >
                  <article className="h-full flex flex-col bg-[#f8f4e9] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 group-hover:bg-[#fcfaf6] border border-transparent group-hover:border-agro-primary-100">
                    {/* Consistent image container with main listing */}
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <WixImage
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-[11px] font-bold text-agro-primary-800 rounded-full uppercase tracking-wider shadow-sm ring-1 ring-black/5">
                          {getCategoryTitle(relatedPost.categories)}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-agro-neutral-500 mb-4 font-medium uppercase tracking-wide">
                        <Calendar size={14} className="text-agro-primary-600" />
                        <span>{formatDate(relatedPost.publishedDate)}</span>
                      </div>

                      <h3 className="heading-card text-xl md:text-2xl leading-snug group-hover:text-agro-primary-700 transition-colors mb-4 line-clamp-2">
                        {relatedPost.title}
                      </h3>

                      <p className="text-agro-neutral-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {/* If we had an excerpt, we'd use it here. Using a generic placeholder or part of content if available would be good, but lacking that in props, we skip or show metadata */}
                        Explore expert analysis and strategies in this detailed article about agricultural innovation.
                      </p>

                      <div className="mt-auto pt-4 flex items-center text-agro-primary-700 text-sm font-bold group-hover:translate-x-2 transition-transform origin-left border-t border-agro-neutral-200/50 group-hover:border-transparent">
                        Read Full Article <ArrowRight size={14} className="ml-2" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
}
