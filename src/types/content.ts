// types/content.ts
export interface ContentBase {
  _id: string;
  _owner?: string;
  _createdDate?: { $date: string } | string;
  _updatedDate?: { $date: string } | string;
  _createdAt?: string;
  _updatedAt?: string;
  isActive?: boolean;
}

export interface HeroContent extends ContentBase {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  companyLogo: string;
  ctaPrimary: string;
  ctaSecondary: string;
  overlayOpacity?: number;
  displayMode?: 'carousel' | 'static';
}

export interface CoreValue extends ContentBase {
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

export interface AboutContent extends ContentBase {
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

export interface ServiceContent extends ContentBase {
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

export interface ProductsSectionContent extends ContentBase {
  sectionTitle?: string;
  sectionDescription?: string;
  categoriesTitle?: string;
  categoriesSubtitle?: string;
  searchPlaceholder?: string;
  ctaBanner?: ProductsCtaBanner;
  sectionImage?: string;
}

export interface ProductContent extends ContentBase {
  title: string;
  productName?: string;
  slug?: string;
  description: string;
  category: string;
  corridor?: 'canada' | 'africa';
  sourcingOrigin?: string;
  typicalQualityParameters?: string;
  qualityStandards?: string; // Legacy alias for backward compatibility
  isFeatured?: boolean;
  displayLogistics?: boolean;
  packagingLogistics?: string;
  images?: string[];
  image?: string;
  image1: string;
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

export interface LegalPageContent extends ContentBase {
  title: string;
  slug: string;
  lastUpdated: string;
  introduction?: string;
  sections: PolicySectionItem[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface ContactContent extends ContentBase {
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

export interface ContentResponse<T> {
  items: T[];
  totalCount: number;
}

export interface Author extends ContentBase {
  name: string;
  bio: string;
  profileImage: string;
}

export interface Category extends ContentBase {
  title: string;
  description: string;
}

export interface BlogPost extends ContentBase {
  title: string;
  slug: string; // The URL slug
  excerpt: string;
  content?: any; // Rich text HTML string, Portable Text blocks, or Rich Content Object
  coverImage: string;
  publishedDate: { $date: string } | string;
  author?: Author[] | string;
  categories?: Category[] | string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductCategory extends ContentBase {
  title: string;
  description: string;
  categoryImage: string;
  productReferences?: string[];
  allProducts?: ProductContent[];
  productReferences_data?: ProductContent[];
}

export interface ProductCatalogItem extends ProductContent {
  allProducts?: ProductContent[];
  productReferences_data?: ProductContent[];
}

export interface CoreValuesContent extends ContentBase {
  title: string;
  description: string;
  reference?: string;
  sortOrder?: number;
}

export interface CarouselImageDisplayContent extends ContentBase {
  title?: string;
  description?: string;
  image: string;
  imageDescription?: string;
  tagline?: string;
  displayOrder?: number;
}
