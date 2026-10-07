import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductCatalogContent, getProductBySlug } from '@/lib/api/sanity-client';
import ProductDetailClient from './ProductDetailClient';
import { BASE_URL } from '@/lib/seo';

export const revalidate = 60;
export const dynamicParams = true;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateStaticParams() {
  const products = await getProductCatalogContent('en', { all: true });
  return products
    .filter(p => Boolean(p.slug))
    .map(p => ({
      slug: p.slug!,
    }));
}

export async function generateMetadata({
  params,
  searchParams,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang = 'en' } = await searchParams;
  const product = await getProductBySlug(slug, lang);

  if (!product) {
    return {
      title: 'Product Not Found | AgroVentia Inc.',
      description: 'The requested agricultural commodity could not be found.',
    };
  }

  const title = product.title || product.productName || 'Agricultural Commodity';
  const description =
    product.description?.replace(/<[^>]+>/g, '').slice(0, 160) ||
    `Specifications, typical quality parameters, and origin details for ${title} from AgroVentia Inc.`;
  const image = product.image || product.image1 || `${BASE_URL}/agroventia-logo.jpg`;

  return {
    title: `${title} | AgroVentia Inc.`,
    description,
    openGraph: {
      title: `${title} | AgroVentia Inc.`,
      description,
      url: `${BASE_URL}/products/${slug}?lang=${encodeURIComponent(lang)}`,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | AgroVentia Inc.`,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const { lang = 'en' } = await searchParams;
  const product = await getProductBySlug(slug, lang);

  if (!product) {
    notFound();
  }

  // Fetch all commodities to compute related products
  const allProducts = await getProductCatalogContent(lang, { all: true });
  const relatedProducts = allProducts
    .filter(p => p._id !== product._id && p.slug !== slug)
    .filter(p => {
      // Prioritize same category or same corridor
      return (
        (product.category && p.category === product.category) ||
        (product.sourcingOrigin && p.sourcingOrigin === product.sourcingOrigin)
      );
    })
    .slice(0, 3);

  // If fewer than 3 related by category/origin, fill with other commodities
  if (relatedProducts.length < 3) {
    const remaining = allProducts.filter(
      p => p._id !== product._id && p.slug !== slug && !relatedProducts.some(r => r._id === p._id)
    );
    relatedProducts.push(...remaining.slice(0, 3 - relatedProducts.length));
  }

  // Schema.org Product structured data
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title || product.productName,
    image: product.image || product.image1,
    description: product.description?.replace(/<[^>]+>/g, ''),
    category: product.category,
    countryOfOrigin: product.sourcingOrigin,
    brand: {
      '@type': 'Brand',
      name: 'AgroVentia Inc.',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      price: '0.00',
      description: 'Wholesale B2B pricing available upon custom contract quotation.',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
