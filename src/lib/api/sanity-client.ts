// lib/api/sanity-client.ts
import { client, urlFor } from '@/sanity/client';
import type {
  HeroContent,
  AboutContent,
  ServiceContent,
  ProductContent,
  ProductCatalogItem,
  ContactContent,
  CoreValue,
  CoreValuesContent,
  CarouselImageDisplayContent,
  BlogPost,
  Author,
  Category,
  WixBase,
  WixBaseItem,
} from '@/types/wix';
import {
  shouldUseMockData,
  getMockHeroContent,
  getMockAboutContent,
  getMockServicesContent,
  getMockProductsContent,
  getMockProductCatalogContent,
  getMockContactContent,
  getMockCoreValues,
  getMockCarouselImages,
  getMockBlogPosts,
  getMockBlogPostBySlug,
  getMockAuthors,
  getMockCategories,
} from './mock-data';
import {
  buildSanityImageUrl,
  urlForImage,
  isSanityImageSource,
  getSanityImageDimensions,
  hasHotspot,
  type SanityImageOptions,
} from './sanity-image';

export {
  client as sanityClient,
  client,
  urlFor,
  buildSanityImageUrl,
  urlForImage,
  isSanityImageSource,
  getSanityImageDimensions,
};

export type SanityLocale = 'en' | 'fr' | 'esp';

/**
 * Normalizes user/browser locale strings ('en', 'fr', 'fr-CA', 'esp', 'es', 'es-ES')
 * to one of the 3 supported Sanity schema language keys: 'en', 'fr', or 'esp'.
 */
export function normalizeLocale(locale?: string): SanityLocale {
  if (!locale) return 'en';
  const clean = locale.toLowerCase().trim();
  if (clean.startsWith('fr')) return 'fr';
  if (clean.startsWith('es')) return 'esp';
  return 'en';
}

/**
 * Resolves a Sanity image object or URL to a string CDN URL.
 */
export function resolveSanityImageUrl(source: any, options?: SanityImageOptions): string {
  if (!source) return '';
  if (typeof source === 'string') return source;
  if (source.asset?.url && !hasHotspot(source)) return source.asset.url;
  try {
    if (hasHotspot(source)) {
      return buildSanityImageUrl(source, options) || '';
    }
    if (source.asset?._ref || source.asset?._id) {
      return urlFor(source).url() || '';
    }
  } catch {
    // Ignore URL builder errors and fallback
  }
  return '';
}

/**
 * Extracts localized text from a Sanity localeString/localeText object
 * with fallback to English or any available translation.
 */
export function extractLocalizedText(value: any, locale: string = 'en'): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const norm = normalizeLocale(locale);
  return value[norm] || value.en || value.fr || value.esp || '';
}

// ---------------------------------------------------------------------------
// GROQ Queries with localized projection & coalesce fallback
// ---------------------------------------------------------------------------

export const HERO_QUERY = `*[_type == "heroSection" && isActive != false][0]{
  _id,
  _createdAt,
  _updatedAt,
  isActive,
  "displayMode": coalesce(displayMode, "carousel"),
  "title": coalesce(title[$locale], title.en, ""),
  "subtitle": coalesce(subtitle[$locale], subtitle.en, ""),
  "description": coalesce(description[$locale], description.en, ""),
  "ctaPrimary": coalesce(ctaPrimary[$locale], ctaPrimary.en, "Explore Products"),
  "ctaSecondary": coalesce(ctaSecondary[$locale], ctaSecondary.en, "Request a Quote"),
  ctaLink,
  overlayOpacity,
  "companyLogo": coalesce(companyLogo.asset->url, ""),
  "backgroundImage": coalesce(backgroundImage.asset->url, "")
}`;

export const ABOUT_QUERY = `*[_type == "aboutSection" && isActive != false][0]{
  _id,
  _createdAt,
  _updatedAt,
  isActive,
  "sectionTitle": coalesce(sectionTitle[$locale], sectionTitle.en, ""),
  "story": coalesce(story[$locale], story.en, ""),
  "mission": coalesce(mission[$locale], mission.en, ""),
  "vision": coalesce(vision[$locale], vision.en, ""),
  headquarters,
  foundingYear,
  certifications,
  "aboutImage": coalesce(aboutImage.asset->url, ""),
  "coreValues": *[_type == "coreValue" && isActive != false] | order(sortOrder asc){
    _id,
    _createdAt,
    _updatedAt,
    isActive,
    reference,
    sortOrder,
    "title": coalesce(title[$locale], title.en, ""),
    "description": coalesce(description[$locale], description.en, "")
  }
}`;

export const SERVICES_QUERY = `*[_type == "servicesSection" && isActive != false][0]{
  _id,
  _createdAt,
  _updatedAt,
  isActive,
  "sectionTitle": coalesce(sectionTitle[$locale], sectionTitle.en, ""),
  "sectionDescription": coalesce(sectionDescription[$locale], sectionDescription.en, ""),
  "importServices": coalesce(importServices[$locale], importServices.en, ""),
  "customSourcing": coalesce(customSourcing[$locale], customSourcing.en, ""),
  "qualityAssurance": coalesce(qualityAssurance[$locale], qualityAssurance.en, ""),
  "logistics": coalesce(logistics[$locale], logistics.en, ""),
  "documentation": coalesce(documentation[$locale], documentation.en, ""),
  "servicesImage": coalesce(servicesImage.asset->url, ""),
  "imageBackground": coalesce(imageBackground.asset->url, "")
}`;

export const PRODUCTS_QUERY = `*[_type == "product" && isActive != false] | order(sortOrder asc){
  _id,
  _createdAt,
  _updatedAt,
  isActive,
  "title": coalesce(productName[$locale], productName.en, ""),
  "productName": coalesce(productName[$locale], productName.en, ""),
  "description": coalesce(productDescription[$locale], productDescription.en, ""),
  "productImage": coalesce(productImage.asset->url, ""),
  "images": images[].asset->url,
  price,
  "category": coalesce(category->title[$locale], category->title.en, category->title, ""),
  sku,
  inStock,
  sortOrder,
  qualityStandards
}`;

export const CONTACT_QUERY = `*[_type == "contactInfo" && isActive != false][0]{
  _id,
  _createdAt,
  _updatedAt,
  isActive,
  "sectionTitle": coalesce(sectionTitle[$locale], sectionTitle.en, ""),
  "sectionDescription": coalesce(sectionDescription[$locale], sectionDescription.en, ""),
  businessEmail,
  businessPhone,
  "businessAddress": coalesce(businessAddress[$locale], businessAddress.en, ""),
  "businessHours": coalesce(businessHours[$locale], businessHours.en, ""),
  "responseTime": coalesce(responseTime[$locale], responseTime.en, ""),
  socialLinks,
  "contactImage": coalesce(contactImage.asset->url, ""),
  mapEmbedCode,
  latitude,
  longitude
}`;

export const CORE_VALUES_QUERY = `*[_type == "coreValue" && isActive != false] | order(sortOrder asc){
  _id,
  _createdAt,
  _updatedAt,
  isActive,
  reference,
  sortOrder,
  "title": coalesce(title[$locale], title.en, ""),
  "description": coalesce(description[$locale], description.en, "")
}`;

export const CAROUSEL_IMAGES_QUERY = `*[_type == "carouselSlide" && isActive != false] | order(displayOrder asc){
  _id,
  _createdAt,
  _updatedAt,
  isActive,
  displayOrder,
  "title": coalesce(title[$locale], title.en, ""),
  "tagline": coalesce(tagline[$locale], tagline.en, ""),
  "description": coalesce(description[$locale], description.en, ""),
  "image": coalesce(image.asset->url, "")
}`;

export const BLOG_POSTS_QUERY = `*[_type == "blogPost"] | order(publishedDate desc){
  _id,
  _createdAt,
  _updatedAt,
  "title": coalesce(title[$locale], title.en, ""),
  "slug": slug.current,
  "excerpt": coalesce(excerpt[$locale], excerpt.en, ""),
  "content": coalesce(content[$locale], content.en, ""),
  "coverImage": coalesce(coverImage.asset->url, ""),
  publishedDate,
  author->{
    _id,
    name,
    "bio": coalesce(bio[$locale], bio.en, "")
  },
  categories[]->{
    _id,
    "title": coalesce(title[$locale], title.en, "")
  }
}`;

export const BLOG_POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  _createdAt,
  _updatedAt,
  "title": coalesce(title[$locale], title.en, ""),
  "slug": slug.current,
  "excerpt": coalesce(excerpt[$locale], excerpt.en, ""),
  "content": coalesce(content[$locale], content.en, ""),
  "coverImage": coalesce(coverImage.asset->url, ""),
  publishedDate,
  author->{
    _id,
    name,
    "bio": coalesce(bio[$locale], bio.en, "")
  },
  categories[]->{
    _id,
    "title": coalesce(title[$locale], title.en, "")
  }
}`;

export const AUTHORS_QUERY = `*[_type == "author"]{
  _id,
  _createdAt,
  _updatedAt,
  name,
  "bio": coalesce(bio[$locale], bio.en, "")
}`;

export const CATEGORIES_QUERY = `*[_type == "category"]{
  _id,
  _createdAt,
  _updatedAt,
  "title": coalesce(title[$locale], title.en, ""),
  "description": coalesce(description[$locale], description.en, ""),
  "slug": slug.current
}`;

// ---------------------------------------------------------------------------
// Response Transformers
// ---------------------------------------------------------------------------

export function transformHeroContent(raw: any, locale: string = 'en'): HeroContent {
  return {
    _id: raw._id || 'heroSection',
    _owner: 'sanity',
    _createdDate: { $date: raw._createdAt || new Date().toISOString() },
    _updatedDate: { $date: raw._updatedAt || new Date().toISOString() },
    isActive: raw.isActive ?? true,
    title: typeof raw.title === 'string' ? raw.title : extractLocalizedText(raw.title, locale),
    subtitle: typeof raw.subtitle === 'string' ? raw.subtitle : extractLocalizedText(raw.subtitle, locale),
    description: typeof raw.description === 'string' ? raw.description : extractLocalizedText(raw.description, locale),
    backgroundImage: resolveSanityImageUrl(raw.backgroundImage),
    companyLogo: resolveSanityImageUrl(raw.companyLogo),
    ctaPrimary: typeof raw.ctaPrimary === 'string' ? raw.ctaPrimary : extractLocalizedText(raw.ctaPrimary, locale),
    ctaSecondary: typeof raw.ctaSecondary === 'string' ? raw.ctaSecondary : extractLocalizedText(raw.ctaSecondary, locale),
    overlayOpacity: raw.overlayOpacity ?? 50,
    displayMode: raw.displayMode || 'carousel',
  };
}

export function transformCoreValue(raw: any, locale: string = 'en'): CoreValue {
  return {
    _id: raw._id || 'coreValue',
    _owner: 'sanity',
    _createdDate: { $date: raw._createdAt || new Date().toISOString() },
    _updatedDate: { $date: raw._updatedAt || new Date().toISOString() },
    isActive: raw.isActive ?? true,
    reference: raw.reference || '',
    title: typeof raw.title === 'string' ? raw.title : extractLocalizedText(raw.title, locale),
    description: typeof raw.description === 'string' ? raw.description : extractLocalizedText(raw.description, locale),
  };
}

export function transformAboutContent(raw: any, locale: string = 'en'): AboutContent {
  const coreValues = Array.isArray(raw.coreValues)
    ? raw.coreValues.map((cv: any) => transformCoreValue(cv, locale))
    : [];

  return {
    _id: raw._id || 'aboutSection',
    _owner: 'sanity',
    _createdDate: { $date: raw._createdAt || new Date().toISOString() },
    _updatedDate: { $date: raw._updatedAt || new Date().toISOString() },
    isActive: raw.isActive ?? true,
    sectionTitle: typeof raw.sectionTitle === 'string' ? raw.sectionTitle : extractLocalizedText(raw.sectionTitle, locale),
    mission: typeof raw.mission === 'string' ? raw.mission : extractLocalizedText(raw.mission, locale),
    vision: typeof raw.vision === 'string' ? raw.vision : extractLocalizedText(raw.vision, locale),
    story: typeof raw.story === 'string' ? raw.story : extractLocalizedText(raw.story, locale),
    headquarters: raw.headquarters || 'Ontario, CA',
    foundingYear: raw.foundingYear || '2025',
    certifications: raw.certifications || 'ISO 14001, LEED Gold',
    aboutImage: resolveSanityImageUrl(raw.aboutImage),
    coreValues,
  };
}

export function transformServiceContent(raw: any, locale: string = 'en'): ServiceContent {
  return {
    _id: raw._id || 'servicesSection',
    _owner: 'sanity',
    _createdDate: { $date: raw._createdAt || new Date().toISOString() },
    _updatedDate: { $date: raw._updatedAt || new Date().toISOString() },
    isActive: raw.isActive ?? true,
    sectionTitle: typeof raw.sectionTitle === 'string' ? raw.sectionTitle : extractLocalizedText(raw.sectionTitle, locale),
    sectionDescription: typeof raw.sectionDescription === 'string' ? raw.sectionDescription : extractLocalizedText(raw.sectionDescription, locale),
    importServices: typeof raw.importServices === 'string' ? raw.importServices : extractLocalizedText(raw.importServices, locale),
    customSourcing: typeof raw.customSourcing === 'string' ? raw.customSourcing : extractLocalizedText(raw.customSourcing, locale),
    qualityAssurance: typeof raw.qualityAssurance === 'string' ? raw.qualityAssurance : extractLocalizedText(raw.qualityAssurance, locale),
    logistics: typeof raw.logistics === 'string' ? raw.logistics : extractLocalizedText(raw.logistics, locale),
    documentation: typeof raw.documentation === 'string' ? raw.documentation : extractLocalizedText(raw.documentation, locale),
    servicesImage: resolveSanityImageUrl(raw.servicesImage),
  };
}

export function transformProductContent(raw: any, locale: string = 'en'): ProductCatalogItem {
  const imageUrl = resolveSanityImageUrl(raw.productImage) || (Array.isArray(raw.images) && raw.images[0] ? resolveSanityImageUrl(raw.images[0]) : '');
  const title = typeof raw.title === 'string' && raw.title.length > 0
    ? raw.title
    : (typeof raw.productName === 'string' ? raw.productName : extractLocalizedText(raw.productName || raw.title, locale));
  const description = typeof raw.description === 'string' && raw.description.length > 0
    ? raw.description
    : (typeof raw.productDescription === 'string' ? raw.productDescription : extractLocalizedText(raw.productDescription || raw.description, locale));
  const categoryTitle = typeof raw.category === 'string'
    ? raw.category
    : (raw.category?.title ? extractLocalizedText(raw.category.title, locale) : '');

  const imagesList = Array.isArray(raw.images)
    ? raw.images.map(resolveSanityImageUrl).filter(Boolean)
    : (imageUrl ? [imageUrl] : []);

  return {
    _id: raw._id || 'product',
    _owner: 'sanity',
    _createdDate: { $date: raw._createdAt || new Date().toISOString() },
    _updatedDate: { $date: raw._updatedAt || new Date().toISOString() },
    isActive: raw.isActive ?? true,
    title,
    productName: title,
    description,
    category: categoryTitle,
    image1: imageUrl,
    images: imagesList,
    qualityStandards: raw.qualityStandards || '',
    price: raw.price,
    sku: raw.sku || '',
    inStock: raw.inStock ?? true,
    sortOrder: raw.sortOrder ?? 0,
    allProducts: [],
  };
}

export function transformContactContent(raw: any, locale: string = 'en'): ContactContent {
  return {
    _id: raw._id || 'contactInfo',
    _owner: 'sanity',
    _createdDate: { $date: raw._createdAt || new Date().toISOString() },
    _updatedDate: { $date: raw._updatedAt || new Date().toISOString() },
    isActive: raw.isActive ?? true,
    sectionTitle: typeof raw.sectionTitle === 'string' ? raw.sectionTitle : extractLocalizedText(raw.sectionTitle, locale),
    sectionDescription: typeof raw.sectionDescription === 'string' ? raw.sectionDescription : extractLocalizedText(raw.sectionDescription, locale),
    businessEmail: raw.businessEmail || '',
    businessPhone: raw.businessPhone || '',
    businessAddress: typeof raw.businessAddress === 'string' ? raw.businessAddress : extractLocalizedText(raw.businessAddress, locale),
    businessHours: typeof raw.businessHours === 'string' ? raw.businessHours : extractLocalizedText(raw.businessHours, locale),
    responseTime: typeof raw.responseTime === 'string' ? raw.responseTime : extractLocalizedText(raw.responseTime, locale),
    socialLinks: raw.socialLinks || '',
    contactImage: resolveSanityImageUrl(raw.contactImage),
    latitude: raw.latitude,
    longitude: raw.longitude,
  };
}

export function transformCoreValuesContent(raw: any, locale: string = 'en'): CoreValuesContent {
  return {
    _id: raw._id || 'coreValue',
    _owner: 'sanity',
    _createdDate: { $date: raw._createdAt || new Date().toISOString() },
    _updatedDate: { $date: raw._updatedAt || new Date().toISOString() },
    title: typeof raw.title === 'string' ? raw.title : extractLocalizedText(raw.title, locale),
    description: typeof raw.description === 'string' ? raw.description : extractLocalizedText(raw.description, locale),
    reference: raw.reference || '',
    sortOrder: raw.sortOrder ?? 0,
    isActive: raw.isActive ?? true,
  };
}

export function transformCarouselSlide(raw: any, locale: string = 'en'): CarouselImageDisplayContent {
  const normLocale = normalizeLocale(locale);
  return {
    _id: raw._id || 'carouselSlide',
    _owner: 'sanity',
    _createdDate: { $date: raw._createdAt || new Date().toISOString() },
    _updatedDate: { $date: raw._updatedAt || new Date().toISOString() },
    title: typeof raw.title === 'string' ? raw.title : extractLocalizedText(raw.title, normLocale),
    description: typeof raw.description === 'string' ? raw.description : extractLocalizedText(raw.description, normLocale),
    image: resolveSanityImageUrl(raw.image),
    imageDescription: typeof raw.description === 'string' ? raw.description : extractLocalizedText(raw.description, normLocale),
    tagline: typeof raw.tagline === 'string' ? raw.tagline : extractLocalizedText(raw.tagline || raw.title, normLocale),
    displayOrder: raw.displayOrder ?? 0,
    isActive: raw.isActive ?? true,
  };
}

// ---------------------------------------------------------------------------
// Client API Fetch Methods (isolated mock fallback only for offline / test flags)
// In production mode with valid credentials, errors are logged and surfaced.
// ---------------------------------------------------------------------------

export const getHeroContent = async (locale?: string): Promise<HeroContent[]> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockHeroContent(normLocale);
  }
  try {
    const raw = await client.fetch(HERO_QUERY, { locale: normLocale });
    if (raw) {
      return [transformHeroContent(raw, normLocale)];
    }
    return [];
  } catch (err: any) {
    console.error(`[Sanity] Hero content query failed:`, err?.message || err);
    throw err;
  }
};

export const getAboutContent = async (locale?: string): Promise<AboutContent[]> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockAboutContent(normLocale);
  }
  try {
    const raw = await client.fetch(ABOUT_QUERY, { locale: normLocale });
    if (raw) {
      return [transformAboutContent(raw, normLocale)];
    }
    return [];
  } catch (err: any) {
    console.error(`[Sanity] About content query failed:`, err?.message || err);
    throw err;
  }
};

export const getServicesContent = async (locale?: string): Promise<ServiceContent[]> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockServicesContent(normLocale);
  }
  try {
    const raw = await client.fetch(SERVICES_QUERY, { locale: normLocale });
    if (raw) {
      return [transformServiceContent(raw, normLocale)];
    }
    return [];
  } catch (err: any) {
    console.error(`[Sanity] Services content query failed:`, err?.message || err);
    throw err;
  }
};

export const getProductsContent = async (locale?: string): Promise<ProductContent[]> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockProductsContent(normLocale);
  }
  try {
    const rawList = await client.fetch<any[]>(PRODUCTS_QUERY, { locale: normLocale });
    if (Array.isArray(rawList)) {
      return rawList.map(item => transformProductContent(item, normLocale));
    }
    return [];
  } catch (err: any) {
    console.error(`[Sanity] Products query failed:`, err?.message || err);
    throw err;
  }
};

export const getProductCatalogContent = async (locale?: string): Promise<ProductCatalogItem[]> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockProductCatalogContent(normLocale);
  }
  try {
    const rawList = await client.fetch<any[]>(PRODUCTS_QUERY, { locale: normLocale });
    if (Array.isArray(rawList)) {
      return rawList.map(item => transformProductContent(item, normLocale));
    }
    return [];
  } catch (err: any) {
    console.error(`[Sanity] Product catalog query failed:`, err?.message || err);
    throw err;
  }
};

export const getContactContent = async (locale?: string): Promise<ContactContent[]> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockContactContent(normLocale);
  }
  try {
    const raw = await client.fetch(CONTACT_QUERY, { locale: normLocale });
    if (raw) {
      return [transformContactContent(raw, normLocale)];
    }
    return [];
  } catch (err: any) {
    console.error(`[Sanity] Contact content query failed:`, err?.message || err);
    throw err;
  }
};

export const getCoreValues = async (locale?: string): Promise<CoreValuesContent[]> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockCoreValues(normLocale);
  }
  try {
    const rawList = await client.fetch<any[]>(CORE_VALUES_QUERY, { locale: normLocale });
    if (Array.isArray(rawList)) {
      return rawList.map(item => transformCoreValuesContent(item, normLocale));
    }
    return [];
  } catch (err: any) {
    console.error(`[Sanity] Core values query failed:`, err?.message || err);
    throw err;
  }
};

export const getCarouselImages = async (locale?: string): Promise<CarouselImageDisplayContent[]> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockCarouselImages(normLocale);
  }
  try {
    const rawList = await client.fetch<any[]>(CAROUSEL_IMAGES_QUERY, { locale: normLocale });
    if (Array.isArray(rawList)) {
      return rawList.map(item => transformCarouselSlide(item, normLocale));
    }
    return [];
  } catch (err: any) {
    console.error(`[Sanity] Carousel images query failed:`, err?.message || err);
    throw err;
  }
};

export const getBlogPosts = async (locale?: string): Promise<BlogPost[]> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockBlogPosts(normLocale);
  }
  try {
    const rawList = await client.fetch<any[]>(BLOG_POSTS_QUERY, { locale: normLocale });
    if (Array.isArray(rawList)) {
      return rawList.map(item => ({
        _id: item._id,
        _owner: 'sanity',
        _createdDate: { $date: item._createdAt || new Date().toISOString() },
        _updatedDate: { $date: item._updatedAt || new Date().toISOString() },
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        coverImage: item.coverImage,
        publishedDate: item.publishedDate,
        author: item.author?.name || 'AgroVentia Editorial',
        categories: item.categories?.map((c: any) => ({
          _id: c._id,
          _owner: 'sanity',
          _createdDate: { $date: new Date().toISOString() },
          _updatedDate: { $date: new Date().toISOString() },
          title: c.title,
          description: '',
        })) || [],
      }));
    }
    return [];
  } catch (err: any) {
    console.error(`[Sanity] Blog posts query failed:`, err?.message || err);
    throw err;
  }
};

export const getBlogPostBySlug = async (slug: string, locale?: string): Promise<BlogPost | null> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockBlogPostBySlug(slug, normLocale);
  }
  try {
    const raw = await client.fetch(BLOG_POST_BY_SLUG_QUERY, { slug, locale: normLocale });
    if (raw) {
      return {
        _id: raw._id,
        _owner: 'sanity',
        _createdDate: { $date: raw._createdAt || new Date().toISOString() },
        _updatedDate: { $date: raw._updatedAt || new Date().toISOString() },
        title: raw.title,
        slug: raw.slug,
        excerpt: raw.excerpt,
        content: raw.content,
        coverImage: raw.coverImage,
        publishedDate: raw.publishedDate,
        author: raw.author?.name || 'AgroVentia Editorial',
        categories: raw.categories?.map((c: any) => ({
          _id: c._id,
          _owner: 'sanity',
          _createdDate: { $date: new Date().toISOString() },
          _updatedDate: { $date: new Date().toISOString() },
          title: c.title,
          description: '',
        })) || [],
      };
    }
    return null;
  } catch (err: any) {
    console.error(`[Sanity] Blog post by slug failed:`, err?.message || err);
    throw err;
  }
};

export const getAuthors = async (locale?: string): Promise<Author[]> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockAuthors(normLocale);
  }
  try {
    const rawList = await client.fetch<any[]>(AUTHORS_QUERY, { locale: normLocale });
    if (Array.isArray(rawList)) {
      return rawList.map(a => ({
        _id: a._id,
        _owner: 'sanity',
        _createdDate: { $date: a._createdAt || new Date().toISOString() },
        _updatedDate: { $date: a._updatedAt || new Date().toISOString() },
        name: a.name,
        bio: a.bio,
        profileImage: '',
      }));
    }
    return [];
  } catch (err: any) {
    console.error(`[Sanity] Authors query failed:`, err?.message || err);
    throw err;
  }
};

export const getCategories = async (locale?: string): Promise<Category[]> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockCategories(normLocale);
  }
  try {
    const rawList = await client.fetch<any[]>(CATEGORIES_QUERY, { locale: normLocale });
    if (Array.isArray(rawList)) {
      return rawList.map(c => ({
        _id: c._id,
        _owner: 'sanity',
        _createdDate: { $date: c._createdAt || new Date().toISOString() },
        _updatedDate: { $date: c._updatedAt || new Date().toISOString() },
        title: c.title,
        description: c.description || '',
      }));
    }
    return [];
  } catch (err: any) {
    console.error(`[Sanity] Categories query failed:`, err?.message || err);
    throw err;
  }
};
