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
  ProductsSectionContent,
  LegalPageContent,
  HighlightItem,
  LegalLinkItem,
  PolicySectionItem,
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
  getMockProductsSectionContent,
  getMockLegalPageBySlug,
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
  "whyChooseTitle": coalesce(whyChooseTitle[$locale], whyChooseTitle.en, ""),
  "highlights": highlights[isActive != false] | order(sortOrder asc){
    _key,
    metric,
    sortOrder,
    colorVariant,
    isActive,
    "title": coalesce(title[$locale], title.en, ""),
    "description": coalesce(description[$locale], description.en, "")
  },
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

export const PRODUCTS_SECTION_QUERY = `*[_type == "productsSection" && isActive != false][0]{
  _id,
  _createdAt,
  _updatedAt,
  isActive,
  "sectionTitle": coalesce(sectionTitle[$locale], sectionTitle.en, ""),
  "sectionDescription": coalesce(sectionDescription[$locale], sectionDescription.en, ""),
  "categoriesTitle": coalesce(categoriesTitle[$locale], categoriesTitle.en, ""),
  "categoriesSubtitle": coalesce(categoriesSubtitle[$locale], categoriesSubtitle.en, ""),
  "searchPlaceholder": coalesce(searchPlaceholder[$locale], searchPlaceholder.en, ""),
  "ctaBanner": {
    "heading": coalesce(ctaBanner.heading[$locale], ctaBanner.heading.en, ""),
    "description": coalesce(ctaBanner.description[$locale], ctaBanner.description.en, ""),
    "primaryButtonText": coalesce(ctaBanner.primaryButtonText[$locale], ctaBanner.primaryButtonText.en, ""),
    "secondaryButtonText": coalesce(ctaBanner.secondaryButtonText[$locale], ctaBanner.secondaryButtonText.en, ""),
    "isActive": coalesce(ctaBanner.isActive, true)
  },
  "sectionImage": coalesce(sectionImage.asset->url, "")
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
  "slug": coalesce(slug.current, ""),
  "description": coalesce(productDescription[$locale], productDescription.en, ""),
  "productImage": coalesce(productImage.asset->url, ""),
  "images": images[].asset->url,
  price,
  "category": coalesce(category->title[$locale], category->title.en, category->title, ""),
  "sourcingOrigin": coalesce(sourcingOrigin[$locale], sourcingOrigin.en, sourcingOrigin, ""),
  "typicalQualityParameters": coalesce(typicalQualityParameters[$locale], typicalQualityParameters.en, typicalQualityParameters, qualityStandards, ""),
  "isFeatured": coalesce(isFeatured, false),
  "displayLogistics": coalesce(displayLogistics, false),
  "packagingLogistics": coalesce(packagingLogistics[$locale], packagingLogistics.en, packagingLogistics, ""),
  sku,
  inStock,
  sortOrder,
  qualityStandards
}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && (slug.current == $slug || _id == $slug) && isActive != false][0]{
  _id,
  _createdAt,
  _updatedAt,
  isActive,
  "title": coalesce(productName[$locale], productName.en, ""),
  "productName": coalesce(productName[$locale], productName.en, ""),
  "slug": coalesce(slug.current, ""),
  "description": coalesce(productDescription[$locale], productDescription.en, ""),
  "productImage": coalesce(productImage.asset->url, ""),
  "images": images[].asset->url,
  price,
  "category": coalesce(category->title[$locale], category->title.en, category->title, ""),
  "sourcingOrigin": coalesce(sourcingOrigin[$locale], sourcingOrigin.en, sourcingOrigin, ""),
  "typicalQualityParameters": coalesce(typicalQualityParameters[$locale], typicalQualityParameters.en, typicalQualityParameters, qualityStandards, ""),
  "isFeatured": coalesce(isFeatured, false),
  "displayLogistics": coalesce(displayLogistics, false),
  "packagingLogistics": coalesce(packagingLogistics[$locale], packagingLogistics.en, packagingLogistics, ""),
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
  "companyTagline": coalesce(companyTagline[$locale], companyTagline.en, ""),
  "companyBio": coalesce(companyBio[$locale], companyBio.en, ""),
  "followUsTitle": coalesce(followUsTitle[$locale], followUsTitle.en, ""),
  "quickLinksTitle": coalesce(quickLinksTitle[$locale], quickLinksTitle.en, ""),
  "coreValuesTitle": coalesce(coreValuesTitle[$locale], coreValuesTitle.en, ""),
  "productCategoriesTitle": coalesce(productCategoriesTitle[$locale], productCategoriesTitle.en, ""),
  "copyrightNotice": coalesce(copyrightNotice[$locale], copyrightNotice.en, ""),
  "backToTopText": coalesce(backToTopText[$locale], backToTopText.en, ""),
  "legalLinks": legalLinks[]{
    _key,
    url,
    "label": coalesce(label[$locale], label.en, "")
  },
  "contactImage": coalesce(contactImage.asset->url, ""),
  mapEmbedCode,
  latitude,
  longitude
}`;

export const LEGAL_PAGE_BY_SLUG_QUERY = `*[_type == "legalPage" && slug.current == $slug && isActive != false][0]{
  _id,
  _createdAt,
  _updatedAt,
  isActive,
  "title": coalesce(title[$locale], title.en, ""),
  "slug": slug.current,
  lastUpdated,
  "introduction": coalesce(introduction[$locale], introduction.en, ""),
  "sections": sections[] | order(sortOrder asc){
    _key,
    sectionId,
    sortOrder,
    "heading": coalesce(heading[$locale], heading.en, ""),
    "content": coalesce(content[$locale], content.en, "")
  },
  "seoTitle": coalesce(seoTitle[$locale], seoTitle.en, ""),
  "seoDescription": coalesce(seoDescription[$locale], seoDescription.en, "")
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

  const highlights: HighlightItem[] = Array.isArray(raw.highlights)
    ? raw.highlights.map((h: any) => ({
        _key: h._key,
        metric: h.metric || '',
        title: typeof h.title === 'string' ? h.title : extractLocalizedText(h.title, locale),
        description: typeof h.description === 'string' ? h.description : extractLocalizedText(h.description, locale),
        colorVariant: h.colorVariant || 'forest',
        sortOrder: h.sortOrder ?? 0,
        isActive: h.isActive ?? true,
      }))
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
    whyChooseTitle: typeof raw.whyChooseTitle === 'string' ? raw.whyChooseTitle : extractLocalizedText(raw.whyChooseTitle, locale),
    highlights,
  };
}

export function transformProductsSectionContent(raw: any, locale: string = 'en'): ProductsSectionContent {
  const ctaBanner = raw.ctaBanner ? {
    heading: typeof raw.ctaBanner.heading === 'string' ? raw.ctaBanner.heading : extractLocalizedText(raw.ctaBanner.heading, locale),
    description: typeof raw.ctaBanner.description === 'string' ? raw.ctaBanner.description : extractLocalizedText(raw.ctaBanner.description, locale),
    primaryButtonText: typeof raw.ctaBanner.primaryButtonText === 'string' ? raw.ctaBanner.primaryButtonText : extractLocalizedText(raw.ctaBanner.primaryButtonText, locale),
    secondaryButtonText: typeof raw.ctaBanner.secondaryButtonText === 'string' ? raw.ctaBanner.secondaryButtonText : extractLocalizedText(raw.ctaBanner.secondaryButtonText, locale),
    isActive: raw.ctaBanner.isActive ?? true,
  } : undefined;

  return {
    _id: raw._id || 'productsSection',
    _owner: 'sanity',
    _createdDate: { $date: raw._createdAt || new Date().toISOString() },
    _updatedDate: { $date: raw._updatedAt || new Date().toISOString() },
    isActive: raw.isActive ?? true,
    sectionTitle: typeof raw.sectionTitle === 'string' ? raw.sectionTitle : extractLocalizedText(raw.sectionTitle, locale),
    sectionDescription: typeof raw.sectionDescription === 'string' ? raw.sectionDescription : extractLocalizedText(raw.sectionDescription, locale),
    categoriesTitle: typeof raw.categoriesTitle === 'string' ? raw.categoriesTitle : extractLocalizedText(raw.categoriesTitle, locale),
    categoriesSubtitle: typeof raw.categoriesSubtitle === 'string' ? raw.categoriesSubtitle : extractLocalizedText(raw.categoriesSubtitle, locale),
    searchPlaceholder: typeof raw.searchPlaceholder === 'string' ? raw.searchPlaceholder : extractLocalizedText(raw.searchPlaceholder, locale),
    ctaBanner,
    sectionImage: resolveSanityImageUrl(raw.sectionImage),
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

  const slug = typeof raw.slug === 'string'
    ? raw.slug
    : (raw.slug?.current || '');

  const sourcingOrigin = typeof raw.sourcingOrigin === 'string'
    ? raw.sourcingOrigin
    : (raw.sourcingOrigin ? extractLocalizedText(raw.sourcingOrigin, locale) : '');

  const typicalQualityParameters = typeof raw.typicalQualityParameters === 'string' && raw.typicalQualityParameters.length > 0
    ? raw.typicalQualityParameters
    : (raw.typicalQualityParameters ? extractLocalizedText(raw.typicalQualityParameters, locale) : (raw.qualityStandards || ''));

  const packagingLogistics = typeof raw.packagingLogistics === 'string'
    ? raw.packagingLogistics
    : (raw.packagingLogistics ? extractLocalizedText(raw.packagingLogistics, locale) : '');

  return {
    _id: raw._id || 'product',
    _owner: 'sanity',
    _createdDate: { $date: raw._createdAt || new Date().toISOString() },
    _updatedDate: { $date: raw._updatedAt || new Date().toISOString() },
    isActive: raw.isActive ?? true,
    title,
    productName: title,
    slug,
    description,
    category: categoryTitle,
    sourcingOrigin,
    typicalQualityParameters,
    qualityStandards: typicalQualityParameters || raw.qualityStandards || '',
    isFeatured: Boolean(raw.isFeatured),
    displayLogistics: Boolean(raw.displayLogistics),
    packagingLogistics,
    image1: imageUrl,
    images: imagesList,
    price: raw.price,
    sku: raw.sku || '',
    inStock: raw.inStock ?? true,
    sortOrder: raw.sortOrder ?? 0,
    allProducts: [],
  };
}

export function transformContactContent(raw: any, locale: string = 'en'): ContactContent {
  const legalLinks: LegalLinkItem[] = Array.isArray(raw.legalLinks)
    ? raw.legalLinks.map((ll: any) => ({
        _key: ll._key,
        url: ll.url || '',
        label: typeof ll.label === 'string' ? ll.label : extractLocalizedText(ll.label, locale),
      }))
    : [];

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
    companyTagline: typeof raw.companyTagline === 'string' ? raw.companyTagline : extractLocalizedText(raw.companyTagline, locale),
    companyBio: typeof raw.companyBio === 'string' ? raw.companyBio : extractLocalizedText(raw.companyBio, locale),
    followUsTitle: typeof raw.followUsTitle === 'string' ? raw.followUsTitle : extractLocalizedText(raw.followUsTitle, locale),
    quickLinksTitle: typeof raw.quickLinksTitle === 'string' ? raw.quickLinksTitle : extractLocalizedText(raw.quickLinksTitle, locale),
    coreValuesTitle: typeof raw.coreValuesTitle === 'string' ? raw.coreValuesTitle : extractLocalizedText(raw.coreValuesTitle, locale),
    productCategoriesTitle: typeof raw.productCategoriesTitle === 'string' ? raw.productCategoriesTitle : extractLocalizedText(raw.productCategoriesTitle, locale),
    copyrightNotice: typeof raw.copyrightNotice === 'string' ? raw.copyrightNotice : extractLocalizedText(raw.copyrightNotice, locale),
    backToTopText: typeof raw.backToTopText === 'string' ? raw.backToTopText : extractLocalizedText(raw.backToTopText, locale),
    legalLinks,
  };
}

export function transformLegalPageContent(raw: any, locale: string = 'en'): LegalPageContent {
  const sections: PolicySectionItem[] = Array.isArray(raw.sections)
    ? raw.sections.map((sec: any) => ({
        _key: sec._key,
        sectionId: sec.sectionId || '',
        heading: typeof sec.heading === 'string' ? sec.heading : extractLocalizedText(sec.heading, locale),
        content: typeof sec.content === 'string' ? sec.content : extractLocalizedText(sec.content, locale),
        sortOrder: sec.sortOrder ?? 0,
      }))
    : [];

  return {
    _id: raw._id || 'legalPage',
    _owner: 'sanity',
    _createdDate: { $date: raw._createdAt || new Date().toISOString() },
    _updatedDate: { $date: raw._updatedAt || new Date().toISOString() },
    isActive: raw.isActive ?? true,
    title: typeof raw.title === 'string' ? raw.title : extractLocalizedText(raw.title, locale),
    slug: typeof raw.slug === 'string' ? raw.slug : (raw.slug?.current || ''),
    lastUpdated: raw.lastUpdated || '',
    introduction: typeof raw.introduction === 'string' ? raw.introduction : extractLocalizedText(raw.introduction, locale),
    sections,
    seoTitle: typeof raw.seoTitle === 'string' ? raw.seoTitle : extractLocalizedText(raw.seoTitle, locale),
    seoDescription: typeof raw.seoDescription === 'string' ? raw.seoDescription : extractLocalizedText(raw.seoDescription, locale),
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

export const getProductCatalogContent = async (
  locale?: string,
  options?: { all?: boolean }
): Promise<ProductCatalogItem[]> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockProductCatalogContent(normLocale, options?.all);
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

export const getProductBySlug = async (
  slug: string,
  locale?: string
): Promise<ProductCatalogItem | null> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    const list = await getMockProductCatalogContent(normLocale, true);
    return list.find(p => p.slug === slug || p._id === slug) || null;
  }
  try {
    const raw = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug, locale: normLocale });
    if (raw) {
      return transformProductContent(raw, normLocale);
    }
    return null;
  } catch (err: any) {
    console.error(`[Sanity] Product by slug query failed (${slug}):`, err?.message || err);
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

export const getProductsSectionContent = async (locale?: string): Promise<ProductsSectionContent | null> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockProductsSectionContent(normLocale);
  }
  try {
    const raw = await client.fetch(PRODUCTS_SECTION_QUERY, { locale: normLocale });
    if (raw) {
      return transformProductsSectionContent(raw, normLocale);
    }
    return null;
  } catch (err: any) {
    console.error(`[Sanity] Products section content query failed:`, err?.message || err);
    throw err;
  }
};

export const getLegalPageBySlug = async (slug: string, locale?: string): Promise<LegalPageContent | null> => {
  const normLocale = normalizeLocale(locale);
  if (shouldUseMockData()) {
    return getMockLegalPageBySlug(slug, normLocale);
  }
  try {
    const raw = await client.fetch(LEGAL_PAGE_BY_SLUG_QUERY, { slug, locale: normLocale });
    if (raw) {
      return transformLegalPageContent(raw, normLocale);
    }
    return null;
  } catch (err: any) {
    console.error(`[Sanity] Legal page query by slug failed:`, err?.message || err);
    throw err;
  }
};

