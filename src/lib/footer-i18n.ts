// src/lib/footer-i18n.ts
/**
 * Localization strings and canonical commodity categories for the AgroVentia Global Footer.
 * Adheres strictly to CAP-7 anti-slop guidelines, Canadian French (fr-CA), and B2B Spanish (es).
 */

export interface CanonicalCategoryItem {
  slug: string;
  label: string;
}

export interface FooterUiLabels {
  quickLinksTitle: string;
  productCategoriesTitle: string;
  coreValuesTitle: string;
  followUsTitle: string;
  backToTopText: string;
  companyTagline: string;
  companyBio: string;
  copyrightNotice: string;
  nav: {
    home: string;
    products: string;
    about: string;
    blog: string;
    contact: string;
  };
  legal: {
    privacy: string;
    terms: string;
    cookies: string;
  };
  categories: CanonicalCategoryItem[];
}

export const FOOTER_UI: Record<'en' | 'fr' | 'esp', FooterUiLabels> = {
  en: {
    quickLinksTitle: 'Quick Links',
    productCategoriesTitle: 'Product Categories',
    coreValuesTitle: 'Our Core Values',
    followUsTitle: 'Follow Us',
    backToTopText: 'Back to Top',
    companyTagline: 'Agricultural Solutions',
    companyBio:
      'Trusted agricultural export partner delivering premium products to global markets with consistency, transparency, and on-time delivery.',
    copyrightNotice: 'AgroVentia Inc. All rights reserved.',
    nav: {
      home: 'Home',
      products: 'Products',
      about: 'About',
      blog: 'Blog',
      contact: 'Contact',
    },
    legal: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
    },
    categories: [
      { slug: 'grains-and-cereals', label: 'Grains & Cereals' },
      { slug: 'pulses-and-legumes', label: 'Pulses & Legumes' },
      { slug: 'oilseeds-and-special-crops', label: 'Oilseeds & Special Crops' },
      { slug: 'spices-and-botanicals', label: 'Spices & Botanicals' },
      { slug: 'horticulture-and-specialty', label: 'Horticulture & Specialty Products' },
    ],
  },
  fr: {
    quickLinksTitle: 'Liens rapides',
    productCategoriesTitle: 'Catégories de produits',
    coreValuesTitle: 'Nos valeurs fondamentales',
    followUsTitle: 'Suivez-nous',
    backToTopText: 'Haut de page',
    companyTagline: 'Solutions agricoles mondiales',
    companyBio:
      'Partenaire d’exportation agricole de confiance fournissant des produits haut de gamme sur les marchés mondiaux avec rigueur, transparence et ponctualité.',
    copyrightNotice: 'AgroVentia Inc. Tous droits réservés.',
    nav: {
      home: 'Accueil',
      products: 'Produits',
      about: 'À Propos',
      blog: 'Blogue',
      contact: 'Contact',
    },
    legal: {
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d’utilisation',
      cookies: 'Politique relative aux témoins',
    },
    categories: [
      { slug: 'grains-and-cereals', label: 'Grains et céréales' },
      { slug: 'pulses-and-legumes', label: 'Légumineuses' },
      { slug: 'oilseeds-and-special-crops', label: 'Oléagineux et cultures spéciales' },
      { slug: 'spices-and-botanicals', label: 'Épices et plantes médicinales' },
      { slug: 'horticulture-and-specialty', label: 'Horticulture et produits de spécialité' },
    ],
  },
  esp: {
    quickLinksTitle: 'Enlaces rápidos',
    productCategoriesTitle: 'Categorías de productos',
    coreValuesTitle: 'Nuestros valores fundamentales',
    followUsTitle: 'Síganos',
    backToTopText: 'Volver arriba',
    companyTagline: 'Soluciones agrícolas globales',
    companyBio:
      'Socio de exportación agrícola de confianza que suministra productos de primera calidad a los mercados internacionales con rigor, transparencia y puntualidad.',
    copyrightNotice: 'AgroVentia Inc. Todos los derechos reservados.',
    nav: {
      home: 'Inicio',
      products: 'Productos',
      about: 'Nosotros',
      blog: 'Blog',
      contact: 'Contacto',
    },
    legal: {
      privacy: 'Política de privacidad',
      terms: 'Términos de servicio',
      cookies: 'Política de cookies',
    },
    categories: [
      { slug: 'grains-and-cereals', label: 'Granos y cereales' },
      { slug: 'pulses-and-legumes', label: 'Legumbres' },
      { slug: 'oilseeds-and-special-crops', label: 'Oleaginosas y cultivos especiales' },
      { slug: 'spices-and-botanicals', label: 'Especias y botánicos' },
      { slug: 'horticulture-and-specialty', label: 'Horticultura y productos especiales' },
    ],
  },
};

export function getFooterUiLabels(locale?: string): FooterUiLabels {
  if (!locale) return FOOTER_UI.en;
  const clean = locale.toLowerCase().trim();
  if (clean.startsWith('fr')) return FOOTER_UI.fr;
  if (clean.startsWith('es') || clean === 'esp') return FOOTER_UI.esp;
  return FOOTER_UI.en;
}
