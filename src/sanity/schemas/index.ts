// Objects
import { localeString } from './objects/localeString';
import { localeText } from './objects/localeText';

// Singletons
import { heroSection } from './singletons/heroSection';
import { aboutSection } from './singletons/aboutSection';
import { servicesSection } from './singletons/servicesSection';
import { productsSection } from './singletons/productsSection';
import { contactInfo } from './singletons/contactInfo';

// Collections
import { serviceItem } from './documents/serviceItem';
import { product } from './documents/product';
import { coreValue } from './documents/coreValue';
import { carouselSlide } from './documents/carouselSlide';
import { category } from './documents/category';
import { blogPost } from './documents/blogPost';
import { author } from './documents/author';
import { legalPage } from './documents/legalPage';

export const schemaTypes = [
  // Objects
  localeString,
  localeText,

  // Singletons
  heroSection,
  aboutSection,
  servicesSection,
  productsSection,
  contactInfo,

  // Collections
  serviceItem,
  product,
  coreValue,
  carouselSlide,
  category,
  blogPost,
  author,
  legalPage,
];

export const singletonTypes = new Set([
  'heroSection',
  'aboutSection',
  'servicesSection',
  'productsSection',
  'contactInfo',
]);
