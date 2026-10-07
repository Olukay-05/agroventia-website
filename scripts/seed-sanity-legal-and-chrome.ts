// scripts/seed-sanity-legal-and-chrome.ts
/**
 * Seeds and synchronizes Sanity Content Lake with CAP-8 documents:
 * 1. Legal & Policies documents (privacy-policy, terms-of-service, cookie-policy)
 * 2. Products section singleton chrome & CTA banner
 * 3. About section singleton "Why Choose" highlights
 * 4. Contact info singleton footer branding & legal links
 *
 * Usage:
 *   npx tsx scripts/seed-sanity-legal-and-chrome.ts [--dry-run] [--verbose]
 */
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from 'next-sanity';

// Load environment variables (.env.local has priority)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

interface ScriptOptions {
  dryRun: boolean;
  verbose: boolean;
}

const parseArgs = (): ScriptOptions => {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose') || args.includes('-v'),
  };
};

// ---------------------------------------------------------------------------
// Canonical Multilingual Data (en, fr, esp)
// Adheres strictly to CAP-7 anti-slop rules & dash prohibition (no — or -).
// ---------------------------------------------------------------------------

const LEGAL_DOCUMENTS = [
  {
    _id: 'legal-privacy-policy',
    _type: 'legalPage',
    title: {
      _type: 'localeString',
      en: 'Privacy Policy',
      fr: 'Politique de Confidentialité',
      esp: 'Política de Privacidad',
    },
    slug: {
      _type: 'slug',
      current: 'privacy-policy',
    },
    lastUpdated: '2026-10-05',
    introduction: {
      _type: 'localeText',
      en: 'AgroVentia Inc. operates the agroventia.ca website. This page outlines our policies regarding the collection, use, and disclosure of personal data when you use our commercial service.',
      fr: "AgroVentia Inc. exploite le site agroventia.ca. La présente page décrit nos politiques relatives à la collecte, l'utilisation et la communication des renseignements personnels dans le cadre de nos activités commerciales.",
      esp: 'AgroVentia Inc. opera el sitio agroventia.ca. Esta política detalla nuestras prácticas relativas a la recopilación, uso y divulgación de datos personales al utilizar nuestra plataforma comercial.',
    },
    sections: [
      {
        _type: 'policySection',
        _key: 's1',
        sectionId: 'info-collection',
        sortOrder: 1,
        heading: {
          _type: 'localeString',
          en: 'Information Collection and Use',
          fr: 'Collecte et Utilisation des Renseignements',
          esp: 'Recopilación y Uso de Información',
        },
        content: {
          _type: 'localeText',
          en: 'We collect several different types of information for various purposes to provide and improve our service to you as an agricultural trade partner.',
          fr: "Nous recueillons plusieurs types de renseignements à diverses fins commerciales afin d'assurer et d'optimiser la prestation de nos services auprès de nos partenaires d'affaires.",
          esp: 'Recopilamos información comercial y de contacto para gestionar cotizaciones y optimizar nuestras relaciones comerciales en el sector agroalimentario.',
        },
      },
      {
        _type: 'policySection',
        _key: 's2',
        sectionId: 'personal-data',
        sortOrder: 2,
        heading: {
          _type: 'localeString',
          en: 'Personal & Business Data',
          fr: 'Renseignements Personnels et d’Affaires',
          esp: 'Datos Personales y de Contacto Comercial',
        },
        content: {
          _type: 'localeText',
          en: 'While using our service or requesting catalog documents, we may ask you to provide contact information that can be used to contact or identify you, including email address, full name, phone number, and company credentials.',
          fr: "Lors de vos demandes de catalogues ou de soumissions, nous pouvons recueillir vos coordonnées professionnelles, notamment votre adresse courriel, votre nom complet, votre numéro de téléphone et le profil de votre entreprise.",
          esp: 'Al solicitar catálogos o cotizaciones, podemos requerir nombre completo, correo electrónico corporativo, teléfono y acreditaciones de su empresa.',
        },
      },
      {
        _type: 'policySection',
        _key: 's3',
        sectionId: 'usage-data',
        sortOrder: 3,
        heading: {
          _type: 'localeString',
          en: 'Usage Data & Diagnostics',
          fr: 'Données d’Utilisation et Diagnostics',
          esp: 'Datos de Uso y Navegación Web',
        },
        content: {
          _type: 'localeText',
          en: 'We may also collect technical information on how the service is accessed and used, including IP address, browser type, pages viewed, and visit duration.',
          fr: "Nous recueillons des données techniques relatives à la consultation du site Web, y compris l'adresse IP, le type de navigateur, les pages consultées et la durée des sessions.",
          esp: 'Recopilamos métricas técnicas sobre la interacción con el portal, incluyendo dirección IP, navegador y tiempo de permanencia.',
        },
      },
      {
        _type: 'policySection',
        _key: 's4',
        sectionId: 'pipeda-compliance',
        sortOrder: 4,
        heading: {
          _type: 'localeString',
          en: 'Regulatory Compliance & Privacy Rights',
          fr: 'Conformité Réglementaire et Droits des Titulaires',
          esp: 'Derechos del Titular y Cumplimiento Normativo',
        },
        content: {
          _type: 'localeText',
          en: 'In accordance with Canadian privacy standards (PIPEDA and Quebec Law 25), you maintain the right to review, update, or withdraw consent for data handling by writing to our compliance officer.',
          fr: 'Conformément aux normes canadiennes applicables (LPRPDE et Loi 25 du Québec), vous disposez du droit d’accéder à vos renseignements, de les rectifier ou d’en demander le retrait en communiquant avec notre responsable de la protection des données.',
          esp: 'Usted tiene derecho a acceder, rectificar o solicitar la supresión de sus datos personales conforme a los estándares de privacidad aplicables dirigiéndose a nuestro equipo de atención legal.',
        },
      },
      {
        _type: 'policySection',
        _key: 's5',
        sectionId: 'security',
        sortOrder: 5,
        heading: {
          _type: 'localeString',
          en: 'Data Security & Retention',
          fr: 'Sécurité et Conservation des Données',
          esp: 'Seguridad de los Datos',
        },
        content: {
          _type: 'localeText',
          en: 'The security of your trade data is important to us. We employ commercially acceptable security safeguards to prevent unauthorized access or disclosure.',
          fr: 'La protection de vos données commerciales est primordiale. Nous appliquons des protocoles rigoureux de sécurité administrative et technique pour prévenir tout accès non autorisé.',
          esp: 'Adoptamos protocolos de seguridad técnica y organizativa para resguardar la confidencialidad e integridad de la información comercial recibida.',
        },
      },
    ],
    seoTitle: {
      _type: 'localeString',
      en: 'Privacy Policy | AgroVentia Inc.',
      fr: 'Politique de Confidentialité | AgroVentia Inc.',
      esp: 'Política de Privacidad | AgroVentia Inc.',
    },
    seoDescription: {
      _type: 'localeText',
      en: 'AgroVentia Inc. corporate privacy and data protection policy.',
      fr: 'Politique de confidentialité et protection des renseignements personnels chez AgroVentia Inc.',
      esp: 'Política de privacidad y protección de datos comerciales de AgroVentia Inc.',
    },
    isActive: true,
  },
  {
    _id: 'legal-terms-of-service',
    _type: 'legalPage',
    title: {
      _type: 'localeString',
      en: 'Terms of Service',
      fr: "Conditions d'Utilisation",
      esp: 'Términos de Servicio',
    },
    slug: {
      _type: 'slug',
      current: 'terms-of-service',
    },
    lastUpdated: '2026-10-05',
    introduction: {
      _type: 'localeText',
      en: 'Welcome to AgroVentia Inc. These Terms of Service govern your use of our corporate website and digital commerce inquiry facilities.',
      fr: "Bienvenue chez AgroVentia Inc. Les présentes conditions d'utilisation régissent l'accès et l'usage de notre plateforme Web et de nos services d'information commerciale.",
      esp: 'Bienvenido a AgroVentia Inc. Estos términos de servicio regulan el uso de nuestro portal web y servicios de intercambio comercial.',
    },
    sections: [
      {
        _type: 'policySection',
        _key: 's1',
        sectionId: 'intro',
        sortOrder: 1,
        heading: {
          _type: 'localeString',
          en: 'Introduction',
          fr: 'Introduction et Portée',
          esp: 'Introducción',
        },
        content: {
          _type: 'localeText',
          en: 'By using our service, you agree to be bound by these terms. If you disagree with any part of these terms, you should discontinue use immediately.',
          fr: "En accédant à nos services, vous acceptez d'être lié par les présentes conditions. Si vous refusez l'une quelconque de ces modalités, vous ne devez pas utiliser le service.",
          esp: 'Al navegar en este sitio web, usted acepta someterse a estos términos de servicio. Si discrepa de algún punto, debe abstenerse de utilizar el portal.',
        },
      },
      {
        _type: 'policySection',
        _key: 's2',
        sectionId: 'commercial-accounts',
        sortOrder: 2,
        heading: {
          _type: 'localeString',
          en: 'Commercial Inquiries & Catalog Requests',
          fr: 'Relations Commerciales et Demandes de Devis',
          esp: 'Operaciones Comerciales y Cotizaciones',
        },
        content: {
          _type: 'localeText',
          en: 'Catalog listings and online pricing inquiries represent non-binding trade showcases until formal sales orders and inspection certificates are executed between both parties.',
          fr: "Les demandes de devis, catalogues et propositions tarifaires constituent des invitations à négocier et ne représentent pas des offres contractuelles contraignantes avant l'émission d'un bon de commande formel signé par les deux parties.",
          esp: 'Las solicitudes de catálogo y cotizaciones en línea tienen carácter orientativo para compras al por mayor y no configuran un compromiso de entrega hasta la firma del respectivo contrato mercantil.',
        },
      },
      {
        _type: 'policySection',
        _key: 's3',
        sectionId: 'intellectual-property',
        sortOrder: 3,
        heading: {
          _type: 'localeString',
          en: 'Intellectual Property Rights',
          fr: 'Propriété Intellectuelle',
          esp: 'Propiedad Intelectual',
        },
        content: {
          _type: 'localeText',
          en: 'All text, graphics, logos, trade names, and product documentation displayed on this website are protected intellectual property of AgroVentia Inc.',
          fr: "Le contenu du site, incluant les logos, descriptions, photographies de commodités et spécifications de grade, demeure la propriété exclusive d'AgroVentia Inc. et de ses concédants.",
          esp: 'Todos los logotipos, textos comerciales, fotografías de materias primas y especificaciones son propiedad protegida de AgroVentia Inc.',
        },
      },
      {
        _type: 'policySection',
        _key: 's4',
        sectionId: 'governing-law',
        sortOrder: 4,
        heading: {
          _type: 'localeString',
          en: 'Governing Law and Jurisdiction',
          fr: 'Lois Applicables et Juridiction',
          esp: 'Ley Aplicable y Jurisdicción',
        },
        content: {
          _type: 'localeText',
          en: 'These terms are governed in accordance with the laws of the Province of Ontario and the applicable federal laws of Canada.',
          fr: 'Les présentes conditions sont régies et interprétées conformément aux lois de la province de l’Ontario et aux lois fédérales du Canada applicables.',
          esp: 'Estos términos se rigen conforme a las leyes vigentes en la provincia de Ontario y la legislación federal de Canadá.',
        },
      },
    ],
    seoTitle: {
      _type: 'localeString',
      en: 'Terms of Service | AgroVentia Inc.',
      fr: "Conditions d'Utilisation | AgroVentia Inc.",
      esp: 'Términos de Servicio | AgroVentia Inc.',
    },
    seoDescription: {
      _type: 'localeText',
      en: 'Terms of Service governing AgroVentia Inc. corporate web platform.',
      fr: "Conditions contractuelles d'utilisation de la plateforme AgroVentia Inc.",
      esp: 'Términos y condiciones legales de AgroVentia Inc.',
    },
    isActive: true,
  },
  {
    _id: 'legal-cookie-policy',
    _type: 'legalPage',
    title: {
      _type: 'localeString',
      en: 'Cookie Policy',
      fr: 'Politique Relative aux Témoins',
      esp: 'Política de Cookies',
    },
    slug: {
      _type: 'slug',
      current: 'cookie-policy',
    },
    lastUpdated: '2026-10-05',
    introduction: {
      _type: 'localeText',
      en: 'This Cookie Policy explains how AgroVentia Inc. uses cookies and related technologies to recognize you when you visit our website at agroventia.ca.',
      fr: 'La présente politique explique comment AgroVentia Inc. utilise les témoins (cookies) et technologies similaires pour reconnaître les visiteurs sur son site agroventia.ca et soutenir une expérience de navigation fluide.',
      esp: 'Esta Política de Cookies detalla cómo AgroVentia Inc. utiliza cookies y tecnologías análogas para identificar a los usuarios en agroventia.ca y mejorar su experiencia en el portal.',
    },
    sections: [
      {
        _type: 'policySection',
        _key: 's1',
        sectionId: 'what-are-cookies',
        sortOrder: 1,
        heading: {
          _type: 'localeString',
          en: 'What are cookies?',
          fr: 'Que sont les témoins?',
          esp: '¿Qué son las cookies?',
        },
        content: {
          _type: 'localeText',
          en: 'Cookies are small data files placed on your computer or mobile device when you visit a website. They are widely used to ensure websites function properly and to remember preferences.',
          fr: 'Les témoins sont de petits fichiers de données placés sur votre ordinateur ou appareil mobile lorsque vous visitez un site Web. Ils permettent de mémoriser vos préférences et de faciliter les sessions de consultation.',
          esp: 'Las cookies son pequeños archivos de datos que se alojan en su equipo o dispositivo móvil al visitar un sitio web para recordar preferencias y optimizar la navegación.',
        },
      },
      {
        _type: 'policySection',
        _key: 's2',
        sectionId: 'why-cookies',
        sortOrder: 2,
        heading: {
          _type: 'localeString',
          en: 'Why do we use cookies?',
          fr: 'Pourquoi utilisons-nous des témoins?',
          esp: '¿Por qué utilizamos cookies?',
        },
        content: {
          _type: 'localeText',
          en: 'We use first-party essential cookies for core technical functionality and optional third-party analytics cookies to observe visitor traffic and improve digital services.',
          fr: "Nous utilisons des témoins essentiels pour le fonctionnement technique du site, ainsi que des témoins analytiques facultatifs afin de mesurer l'achalandage et d'améliorer la convivialité de nos services.",
          esp: 'Empleamos cookies indispensables para el correcto funcionamiento técnico de la página y cookies analíticas para evaluar el rendimiento comercial de la plataforma.',
        },
      },
      {
        _type: 'policySection',
        _key: 's3',
        sectionId: 'cookie-types',
        sortOrder: 3,
        heading: {
          _type: 'localeString',
          en: 'Types of cookies we use',
          fr: 'Types de témoins utilisés',
          esp: 'Categorías de cookies empleadas',
        },
        content: {
          _type: 'localeText',
          en: 'Our website uses strictly necessary cookies for session management and consent preferences, alongside performance and language setting cookies.',
          fr: 'Notre site emploie des témoins strictement essentiels (gestion de session et consentement), des témoins de performance et analytiques, ainsi que des témoins de préférences de langue.',
          esp: 'Utilizamos cookies técnicas obligatorias, cookies de analítica web y cookies de personalización de idioma y región.',
        },
      },
      {
        _type: 'policySection',
        _key: 's4',
        sectionId: 'managing-preferences',
        sortOrder: 4,
        heading: {
          _type: 'localeString',
          en: 'Managing your preferences',
          fr: 'Gestion de vos préférences',
          esp: 'Control de preferencias',
        },
        content: {
          _type: 'localeText',
          en: 'You can update your cookie preferences at any time using the interactive settings panel on this page or by configuring your web browser settings.',
          fr: 'Vous pouvez à tout moment activer ou désactiver les témoins non essentiels grâce au module interactif de préférences disponible sur cette page ou par les paramètres de votre navigateur.',
          esp: 'Puede modificar sus preferencias en cualquier momento mediante el panel de configuración de esta página o configurando su navegador web.',
        },
      },
    ],
    seoTitle: {
      _type: 'localeString',
      en: 'Cookie Policy | AgroVentia Inc.',
      fr: 'Politique Relative aux Témoins | AgroVentia Inc.',
      esp: 'Política de Cookies | AgroVentia Inc.',
    },
    seoDescription: {
      _type: 'localeText',
      en: 'AgroVentia Inc. cookie usage and visitor preference policy.',
      fr: 'Politique et gestion des témoins de navigation sur le site AgroVentia Inc.',
      esp: 'Información y configuración de cookies en AgroVentia Inc.',
    },
    isActive: true,
  },
];

const PRODUCTS_SECTION_PATCH = {
  categoriesTitle: {
    _type: 'localeString',
    en: 'Product Categories',
    fr: 'Catégories de Produits',
    esp: 'Categorías de Productos',
  },
  categoriesSubtitle: {
    _type: 'localeText',
    en: 'Discover our comprehensive range of premium agricultural products sourced from trusted global partners.',
    fr: 'Explorez notre vaste gamme de denrées agricoles de premier choix provenant de nos partenaires certifiés.',
    esp: 'Descubra nuestra amplia gama de materias primas agrícolas de alta calidad provenientes de productores certificados.',
  },
  searchPlaceholder: {
    _type: 'localeString',
    en: 'Search products...',
    fr: 'Rechercher des produits...',
    esp: 'Buscar productos...',
  },
  ctaBanner: {
    heading: {
      _type: 'localeString',
      en: 'Quality You Can Trust. Supply You Can Rely On Always.',
      fr: 'Une Qualité Éprouvée. Un Approvisionnement Constant et Fiable.',
      esp: 'Calidad Comprobada. Suministro Seguro y Confiable.',
    },
    description: {
      _type: 'localeText',
      en: "AgroVentia Inc. delivers Africa's best consistently, transparently, and on time. Every shipment is managed with precision, professionalism, and integrity; so you can focus on scaling your business. Partner with us, and grow with confidence.",
      fr: "AgroVentia Inc. livre le meilleur des récoltes africaines avec constance, transparence et ponctualité. Chaque expédition est encadrée avec rigueur, professionnalisme et intégrité afin de soutenir l'expansion de votre entreprise. Devenez notre partenaire commercial en toute sérénité.",
      esp: 'AgroVentia Inc. suministra los mejores productos agrícolas africanos con constancia, transparencia y puntualidad. Cada cargamento se gestiona con rigurosa precisión, profesionalismo e integridad para que su empresa prospere. Asóciese con nosotros y crezca con total tranquilidad.',
    },
    primaryButtonText: {
      _type: 'localeString',
      en: 'Request Product Catalog',
      fr: 'Demander le Catalogue des Produits',
      esp: 'Solicitar Catálogo de Productos',
    },
    secondaryButtonText: {
      _type: 'localeString',
      en: 'Schedule a Call',
      fr: 'Planifier un Entretien',
      esp: 'Programar una Llamada',
    },
    isActive: true,
  },
};

const ABOUT_SECTION_PATCH = {
  whyChooseTitle: {
    _type: 'localeString',
    en: 'Why Choose AgroVentia Inc.?',
    fr: 'Pourquoi Choisir AgroVentia Inc.?',
    esp: '¿Por Qué Elegir AgroVentia Inc.?',
  },
  highlights: [
    {
      _type: 'highlightItem',
      _key: 'hl-1',
      metric: '10+',
      title: {
        _type: 'localeString',
        en: 'Premium Quality Products',
        fr: 'Produits de Qualité Supérieure',
        esp: 'Productos de Alta Calidad',
      },
      description: {
        _type: 'localeText',
        en: 'Comprehensive range of top-tier agricultural commodities.',
        fr: 'Gamme complète de denrées agricoles de premier ordre.',
        esp: 'Gama completa de soluciones agroalimentarias de primer orden.',
      },
      colorVariant: 'primary',
      sortOrder: 1,
      isActive: true,
    },
    {
      _type: 'highlightItem',
      _key: 'hl-2',
      metric: '20+',
      title: {
        _type: 'localeString',
        en: 'Global Markets Served',
        fr: 'Marchés Mondiaux Desservis',
        esp: 'Mercados Internacionales Atendidos',
      },
      description: {
        _type: 'localeText',
        en: 'Connecting African producers to buyers across North America, Europe, and beyond.',
        fr: "Relier les producteurs africains aux acheteurs d'Amérique du Nord, d'Europe et du monde entier.",
        esp: 'Conectamos productores africanos con compradores en América del Norte, Europa y el mundo.',
      },
      colorVariant: 'secondary',
      sortOrder: 2,
      isActive: true,
    },
    {
      _type: 'highlightItem',
      _key: 'hl-3',
      metric: '100%',
      title: {
        _type: 'localeString',
        en: 'Quality Guaranteed',
        fr: 'Qualité Garantie',
        esp: 'Calidad Garantizada',
      },
      description: {
        _type: 'localeText',
        en: 'Every shipment undergoes rigorous inspection for freshness, purity, and compliance.',
        fr: 'Chaque expédition fait l’objet d’inspections rigoureuses pour certifier fraîcheur, pureté et conformité.',
        esp: 'Cada envío se somete a estrictos controles de frescura, pureza y normativa fitosanitaria.',
      },
      colorVariant: 'bronze',
      sortOrder: 3,
      isActive: true,
    },
    {
      _type: 'highlightItem',
      _key: 'hl-4',
      metric: '10+',
      title: {
        _type: 'localeString',
        en: 'Years Industry Experience',
        fr: 'Années d’Expérience Sectorielle',
        esp: 'Años de Experiencia Comercial',
      },
      description: {
        _type: 'localeText',
        en: 'Over a decade of building resilient agricultural supply networks across Africa.',
        fr: 'Plus d’une décennie à bâtir des réseaux d’approvisionnement agricole résilients en Afrique.',
        esp: 'Más de una década consolidando cadenas de suministro sólidas con productores africanos.',
      },
      colorVariant: 'neutral',
      sortOrder: 4,
      isActive: true,
    },
    {
      _type: 'highlightItem',
      _key: 'hl-5',
      metric: '100%',
      title: {
        _type: 'localeString',
        en: 'Reliable Logistics',
        fr: 'Logistique Fiable',
        esp: 'Logística Confiable',
      },
      description: {
        _type: 'localeText',
        en: 'End-to-end supply chain management ensuring on-time delivery and peace of mind.',
        fr: 'Prise en charge intégrale de la chaîne logistique assurant ponctualité et sérénité.',
        esp: 'Gestión logística integral y despachos puntuales para adquirir materias primas con seguridad.',
      },
      colorVariant: 'forest',
      sortOrder: 5,
      isActive: true,
    },
  ],
};

const CONTACT_INFO_PATCH = {
  companyTagline: {
    _type: 'localeString',
    en: 'Agricultural Solutions',
    fr: 'Solutions Agricoles',
    esp: 'Soluciones Agrícolas',
  },
  companyBio: {
    _type: 'localeText',
    en: 'Trusted agricultural export partner delivering premium products to global markets with consistency, transparency, and on-time delivery.',
    fr: 'Partenaire de confiance en exportation agricole, distribuant des produits de premier choix sur les marchés mondiaux avec constance, transparence et ponctualité.',
    esp: 'Socio comercial de confianza en exportación agrícola, distribuyendo productos de alta calidad en mercados globales con constancia, transparencia y puntualidad.',
  },
  followUsTitle: {
    _type: 'localeString',
    en: 'Follow Us',
    fr: 'Suivez-Nous',
    esp: 'Síganos',
  },
  quickLinksTitle: {
    _type: 'localeString',
    en: 'Quick Links',
    fr: 'Liens Rapides',
    esp: 'Enlaces Rápidos',
  },
  coreValuesTitle: {
    _type: 'localeString',
    en: 'Our Core Values',
    fr: 'Nos Valeurs Fondamentales',
    esp: 'Nuestros Valores Fundamentales',
  },
  productCategoriesTitle: {
    _type: 'localeString',
    en: 'Product Categories',
    fr: 'Catégories de Produits',
    esp: 'Categorías de Productos',
  },
  copyrightNotice: {
    _type: 'localeString',
    en: 'AgroVentia Inc. All rights reserved.',
    fr: 'AgroVentia Inc. Tous droits réservés.',
    esp: 'AgroVentia Inc. Todos los derechos reservados.',
  },
  backToTopText: {
    _type: 'localeString',
    en: 'Back to Top',
    fr: 'Retour en Haut',
    esp: 'Volver Arriba',
  },
  legalLinks: [
    {
      _type: 'legalLinkItem',
      _key: 'll-1',
      label: {
        _type: 'localeString',
        en: 'Privacy Policy',
        fr: 'Politique de Confidentialité',
        esp: 'Política de Privacidad',
      },
      url: '/privacy-policy',
    },
    {
      _type: 'legalLinkItem',
      _key: 'll-2',
      label: {
        _type: 'localeString',
        en: 'Terms of Service',
        fr: "Conditions d'Utilisation",
        esp: 'Términos de Servicio',
      },
      url: '/terms-of-service',
    },
    {
      _type: 'legalLinkItem',
      _key: 'll-3',
      label: {
        _type: 'localeString',
        en: 'Cookie Policy',
        fr: 'Politique Relative aux Témoins',
        esp: 'Política de Cookies',
      },
      url: '/cookie-policy',
    },
  ],
};

async function main() {
  const options = parseArgs();
  console.log(`\n========================================================`);
  console.log(`📜 AgroVentia Legal Pages & UI Chrome Seeder (CAP-8)`);
  console.log(`Mode: ${options.dryRun ? '🔍 DRY RUN (no mutations)' : '🚀 LIVE SEEDING'}`);
  console.log(`========================================================\n`);

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !token) {
    console.error(`[ERROR] Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local.`);
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-03-01',
    token,
    useCdn: false,
  });

  console.log(`Targeting Sanity Project: ${projectId} (Dataset: ${dataset})\n`);

  // 1. Seed Legal Policy Documents
  console.log(`[STEP 1/4] Upserting Legal & Policies Documents...`);
  for (const doc of LEGAL_DOCUMENTS) {
    if (options.dryRun) {
      console.log(`  [DRY-RUN] Would create/replace legalPage: ${doc._id} (${doc.slug.current})`);
    } else {
      try {
        await client.createOrReplace(doc);
        console.log(`  ✓ Successfully upserted legalPage: ${doc._id} (${doc.slug.current})`);
      } catch (err: any) {
        console.error(`  ✗ Failed to upsert ${doc._id}: ${err.message}`);
      }
    }
  }

  // 2. Patch Products Section Singleton
  console.log(`\n[STEP 2/4] Patching Products Section Singleton (categories & CTA banner)...`);
  if (options.dryRun) {
    console.log(`  [DRY-RUN] Would patch productsSection singleton`);
  } else {
    try {
      await client
        .patch('productsSection')
        .set(PRODUCTS_SECTION_PATCH)
        .commit();
      console.log(`  ✓ Successfully patched productsSection singleton`);
    } catch (err: any) {
      console.error(`  ✗ Failed to patch productsSection: ${err.message}`);
    }
  }

  // 3. Patch About Section Singleton
  console.log(`\n[STEP 3/4] Patching About Section Singleton (whyChooseTitle & highlights)...`);
  if (options.dryRun) {
    console.log(`  [DRY-RUN] Would patch aboutSection singleton`);
  } else {
    try {
      await client
        .patch('aboutSection')
        .set(ABOUT_SECTION_PATCH)
        .commit();
      console.log(`  ✓ Successfully patched aboutSection singleton`);
    } catch (err: any) {
      console.error(`  ✗ Failed to patch aboutSection: ${err.message}`);
    }
  }

  // 4. Patch Contact Info Singleton
  console.log(`\n[STEP 4/4] Patching Contact Info Singleton (footer branding & legalLinks)...`);
  if (options.dryRun) {
    console.log(`  [DRY-RUN] Would patch contactInfo singleton`);
  } else {
    try {
      await client
        .patch('contactInfo')
        .set(CONTACT_INFO_PATCH)
        .commit();
      console.log(`  ✓ Successfully patched contactInfo singleton`);
    } catch (err: any) {
      console.error(`  ✗ Failed to patch contactInfo: ${err.message}`);
    }
  }

  console.log(`\n========================================================`);
  console.log(`🎉 Seeding Complete!`);
  console.log(`========================================================\n`);
}

main().catch(err => {
  console.error('Fatal error in seeder:', err);
  process.exit(1);
});
