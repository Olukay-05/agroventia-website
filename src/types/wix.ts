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
}

export interface CoreValue extends WixBase {
  reference: string;
  title: string;
  description: string;
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

export interface ProductContent extends WixBase {
  title: string;
  description: string;
  category: string;
  image1: string;
  qualityStandards?: string;
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
}

export interface WixContentResponse<T> {
  items: T[];
  totalCount: number;
}
