// types/wix.ts
export interface WixBase {
  _id: string;
  _owner: string;
  _createdDate: { $date: string };
  _updatedDate: { $date: string };
  isActive?: boolean;
}

export interface HeroContent extends WixBase {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  companyLogo: string;
  ctaPrimary: string;
  ctaSecondary: string;
  overlayOpacity?: number; // Add the missing overlayOpacity property
  displayMode?: 'carousel' | 'static';
}

export interface CoreValue extends WixBase {
  reference: string;
  title: string;
  description: string;
}

export interface HighlightItem {
  _key?: string;
  metric: string;
  title: string;
  description: string;
  colorVariant?: 'primary' | 'secondary' | 'bronze' | 'neutral' | 'forest';
  sortOrder?: number;
  isActive?: boolean;
}

export interface AboutContent extends WixBase {
  sectionTitle: string;
  mission: string;
  vision: string;
  story: string;
  headquarters: string;
  foundingYear: string;
  certifications: string;
  aboutImage: string;
  coreValues: CoreValue[];
  whyChooseTitle?: string;
  highlights?: HighlightItem[];
}

export interface ServiceContent extends WixBase {
  sectionTitle: string;
  sectionDescription: string;
  importServices: string;
  customSourcing: string;
  qualityAssurance: string;
  logistics: string;
  documentation: string;
  servicesImage: string;
}

export interface ProductsCtaBanner {
  heading?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  isActive?: boolean;
}

export interface ProductsSectionContent extends WixBase {
  sectionTitle?: string;
  sectionDescription?: string;
  categoriesTitle?: string;
  categoriesSubtitle?: string;
  searchPlaceholder?: string;
  ctaBanner?: ProductsCtaBanner;
  sectionImage?: string;
}

export interface ProductContent extends WixBase {
  title: string;
  productName?: string;
  description: string;
  category: string;
  images?: string[];
  image1: string;
  qualityStandards?: string;
  sku?: string;
  inStock?: boolean;
  sortOrder?: number;
  price?: number;
}

export interface LegalLinkItem {
  _key?: string;
  label: string;
  url: string;
}

export interface PolicySectionItem {
  _key?: string;
  sectionId?: string;
  heading: string;
  content: string;
  sortOrder?: number;
}

export interface LegalPageContent extends WixBase {
  title: string;
  slug: string;
  lastUpdated: string;
  introduction?: string;
  sections: PolicySectionItem[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface ContactContent extends WixBase {
  sectionTitle: string;
  sectionDescription: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessHours: string;
  responseTime: string;
  socialLinks: string;
  contactImage: string;
  latitude?: number;
  longitude?: number;
  companyTagline?: string;
  companyBio?: string;
  followUsTitle?: string;
  quickLinksTitle?: string;
  coreValuesTitle?: string;
  productCategoriesTitle?: string;
  copyrightNotice?: string;
  backToTopText?: string;
  legalLinks?: LegalLinkItem[];
}

export interface WixContentResponse<T> {
  items: T[];
  totalCount: number;
}

export interface Author extends WixBase {
  name: string;
  bio: string;
  profileImage: string;
}

export interface Category extends WixBase {
  title: string;
  description: string;
}

export interface BlogPost extends WixBase {
  title: string;
  slug: string; // The URL slug
  excerpt: string;
  content: any; // Rich text HTML string or Rich Content Object
  coverImage: string;
  publishedDate: { $date: string } | string;
  author?: Author[] | string; // Note: Even single refs often come as array in expansion or simple ID string
  categories?: Category[] | string[];
  seoTitle?: string;
  seoDescription?: string;
}

export type WixBaseItem = WixBase;

export interface ProductCatalogItem extends ProductContent {
  allProducts?: ProductContent[];
  productReferences_data?: ProductContent[];
}

export interface CoreValuesContent extends WixBase {
  title: string;
  description: string;
  reference?: string;
  sortOrder?: number;
}

export interface CarouselImageDisplayContent extends WixBase {
  title?: string;
  description?: string;
  image: string;
  imageDescription?: string;
  tagline?: string;
  displayOrder?: number;
}
