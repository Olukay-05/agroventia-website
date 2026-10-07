// lib/api/mock-data.ts
import type {
  HeroContent,
  AboutContent,
  ServiceContent,
  ProductContent,
  ProductCatalogItem,
  ContactContent,
  CoreValuesContent,
  CarouselImageDisplayContent,
  BlogPost,
  Author,
  Category,
  ProductsSectionContent,
  LegalPageContent,
} from '@/types/content';
import { getPortfolioProducts } from './products-portfolio';

/**
 * Determines if mock data should be used instead of real Sanity API calls.
 * Operates seamlessly without credentials in development, CI, or offline environments.
 */
export const shouldUseMockData = (): boolean => {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return true;
  }

  const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const hasValidProjectId =
    !!sanityProjectId &&
    sanityProjectId !== 'your_sanity_project_id_here' &&
    sanityProjectId !== 'undefined' &&
    sanityProjectId !== 'agrov-production' &&
    sanityProjectId.trim().length > 0;

  // Always use mock data fallback if Sanity project ID is not properly configured
  if (!hasValidProjectId) {
    return true;
  }

  return false;
};

/**
 * Logs when fallback content is being used
 */
export const logFallbackUsage = (contentType: string, reason: string): void => {
  console.warn(`[MockFallback] Using fallback content for ${contentType}: ${reason}`);
};

// ---------------------------------------------------------------------------
// Mock Hero Content (en, fr, esp)
// ---------------------------------------------------------------------------

export const getMockHeroContent = async (locale?: string): Promise<HeroContent[]> => {
  const loc = (locale || 'en').toLowerCase().trim();

  if (loc.startsWith('fr')) {
    return [
      {
        _id: '113d7e91-1b4e-4dfd-97a7-679c42f40118',
        title: "Imports Agricoles Premium d'Afrique de l'Ouest",
        subtitle: 'Connecter les Marchés Mondiaux avec des Produits Agricoles de Qualité',
        description:
          "AgroVentia Inc. se spécialise dans l'importation de produits agricoles de haute qualité, notamment la noix de cola, le gingembre, l'hibiscus, le cacao et plus encore, provenant de sources ouest-africaines de confiance.",
        backgroundImage: '/background-image-mobile.jpg',
        companyLogo: '/agroventia-logo.jpg',
        ctaPrimary: 'Explorer les Produits',
        ctaSecondary: 'Contactez-nous',
        isActive: true,
        overlayOpacity: 50,
        displayMode: 'carousel',
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-21T13:19:21.561Z' },
        _updatedDate: { $date: '2026-10-04T04:11:15.771Z' },
      },
    ];
  }

  if (loc.startsWith('es') || loc === 'esp') {
    return [
      {
        _id: '113d7e91-1b4e-4dfd-97a7-679c42f40118',
        title: 'Simplificando el abastecimiento global con productos agrícolas confiables y de primera calidad.',
        subtitle: 'Conectando Mercados Globales con Productos Agrícolas de Calidad',
        description:
          'AgroVentia Inc. se especializa en la importación de productos agrícolas de alta calidad, incluidos nuez de cola, jengibre, hibisco, cacao y más, de fuentes confiables de África Occidental.',
        backgroundImage: '/background-image-mobile.jpg',
        companyLogo: '/agroventia-logo.jpg',
        ctaPrimary: 'Explorar Productos',
        ctaSecondary: 'Solicitar Cotización',
        isActive: true,
        overlayOpacity: 50,
        displayMode: 'carousel',
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-21T13:19:21.561Z' },
        _updatedDate: { $date: '2026-10-04T04:11:15.771Z' },
      },
    ];
  }

  return [
    {
      _id: '113d7e91-1b4e-4dfd-97a7-679c42f40118',
      title: 'Premium Agricultural Imports from West Africa',
      subtitle: 'Connecting Global Markets with Quality Agricultural Products',
      description:
        'AgroVentia Inc. specializes in importing high-quality agricultural products including kolanut, ginger, hibiscus, cocoa, and more from trusted West African sources.',
      backgroundImage: '/background-image-mobile.jpg',
      companyLogo: '/agroventia-logo.jpg',
      ctaPrimary: 'Explore Products',
      ctaSecondary: 'Contact Us',
      isActive: true,
      overlayOpacity: 50,
      displayMode: 'carousel',
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-21T13:19:21.561Z' },
      _updatedDate: { $date: '2026-10-04T04:11:15.771Z' },
    },
  ];
};

// ---------------------------------------------------------------------------
// Mock About Content (en, fr, esp)
// ---------------------------------------------------------------------------

export const getMockAboutContent = async (locale?: string): Promise<AboutContent[]> => {
  const loc = (locale || 'en').toLowerCase().trim();

  if (loc.startsWith('fr')) {
    return [
      {
        _id: '1a26a2a6-3512-48c1-99ec-3e469d12d725',
        sectionTitle: "À Propos d'AgroVentia Inc.",
        mission:
          "Livrer des produits agricoles de première qualité, d'origine éthique, dans le monde entier, en garantissant qualité, fiabilité et durabilité à chaque transaction.",
        vision:
          "Devenir la principale passerelle mondiale vers les meilleurs produits agricoles d'Afrique en supprimant les barrières, en favorisant la confiance et en stimulant une croissance durable pour les acheteurs internationaux et les producteurs africains.",
        story:
          "AgroVentia Inc. est une entreprise canadienne avec de profondes racines africaines, établie pour connecter les marchés mondiaux avec des produits agricoles de haute qualité. Notre équipe de direction combine une vaste expertise en gestion d'entreprise, en conseil et en commerce mondial, avec plus d'une décennie d'expérience directe dans l'importation et l'exportation de produits agricoles.",
        headquarters: 'Toronto, CA',
        foundingYear: '2025',
        certifications: 'ISO 14001, LEED Gold',
        aboutImage: '/natural-farming-export.png',
        isActive: true,
        whyChooseTitle: 'Pourquoi Choisir AgroVentia Inc.?',
        highlights: [
          {
            _key: 'hl-1',
            metric: '10+',
            title: 'Produits de Qualité Supérieure',
            description: "Une gamme complète de solutions d'approvisionnement agricole.",
            colorVariant: 'primary',
            sortOrder: 1,
            isActive: true,
          },
          {
            _key: 'hl-2',
            metric: '20+',
            title: 'Marchés Internationaux Desservis',
            description: "Rapprochement direct entre producteurs africains et acheteurs d'Amérique du Nord et d'Europe.",
            colorVariant: 'secondary',
            sortOrder: 2,
            isActive: true,
          },
          {
            _key: 'hl-3',
            metric: '100%',
            title: 'Qualité Garantie',
            description: "Chaque envoi fait l'objet de contrôles rigoureux de pureté, de fraîcheur et de conformité sanitaire.",
            colorVariant: 'bronze',
            sortOrder: 3,
            isActive: true,
          },
          {
            _key: 'hl-4',
            metric: '10+',
            title: "Années d'Expertise Commerciale",
            description: "Plus d'une décennie d'expérience dans l'établissement de filières agricoles robustes en Afrique.",
            colorVariant: 'neutral',
            sortOrder: 4,
            isActive: true,
          },
          {
            _key: 'hl-5',
            metric: '100%',
            title: 'Logistique Fiable',
            description: 'Chaîne logistique fluide et expéditions ponctuelles pour un approvisionnement en toute sécurité.',
            colorVariant: 'forest',
            sortOrder: 5,
            isActive: true,
          },
        ],
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-21T14:40:20.146Z' },
        _updatedDate: { $date: '2026-10-04T04:29:46.316Z' },
        coreValues: [
          {
            _id: '85b1197b-d538-43e7-879b-21003ec8aaab',
            reference: 'quality',
            title: "Qualité d'Abord",
            description: 'Livrer des produits agricoles prémium et constants à chaque fois.',
            isActive: true,
            _owner: 'sanity',
            _createdDate: { $date: '2025-08-21T16:49:51.374Z' },
            _updatedDate: { $date: '2025-08-25T15:17:51.269Z' },
          },
          {
            _id: '4ab83339-fd43-4466-b0d4-e45a88bb49db',
            reference: 'ethical',
            title: 'Approvisionnement Éthique',
            description: 'Partenariat avec des agriculteurs africains vérifiés pour assurer durabilité et équité.',
            isActive: true,
            _owner: 'sanity',
            _createdDate: { $date: '2025-08-21T16:49:51.373Z' },
            _updatedDate: { $date: '2025-08-22T16:04:49.828Z' },
          },
          {
            _id: '4da26982-fc4c-45c3-b0bb-10084b7273f0',
            reference: 'trust',
            title: 'Confiance & Transparence',
            description: 'Communication claire et responsabilité dans chaque transaction.',
            isActive: true,
            _owner: 'sanity',
            _createdDate: { $date: '2025-08-21T16:49:51.372Z' },
            _updatedDate: { $date: '2025-08-22T16:04:53.161Z' },
          },
          {
            _id: '226a834a-7dc8-408d-8a48-9d32a043813e',
            reference: 'reliability',
            title: 'Fiabilité',
            description: 'Service transparent, opportun et fiable, à toute échelle, à chaque expédition.',
            isActive: true,
            _owner: 'sanity',
            _createdDate: { $date: '2025-08-21T16:49:51.371Z' },
            _updatedDate: { $date: '2025-08-25T15:17:56.704Z' },
          },
        ],
      },
    ];
  }

  if (loc.startsWith('es') || loc === 'esp') {
    return [
      {
        _id: '1a26a2a6-3512-48c1-99ec-3e469d12d725',
        sectionTitle: 'Acerca de AgroVentia Inc.',
        mission:
          'Hacer que el comercio agrícola sea más accesible y comercialmente efectivo conectando la oferta calificada con la demanda genuina del mercado.',
        vision:
          'Convertirse en una contraparte comercial internacional de confianza para productores, procesadores y compradores agrícolas.',
        story:
          'AgroVentia Inc. es una empresa canadiense con profundas raíces africanas, establecida para conectar los mercados globales con productos agrícolas de alta calidad. Cada envío lleva nuestro compromiso con la calidad, la transparencia y la entrega a tiempo.',
        headquarters: 'Toronto, CA',
        foundingYear: '2025',
        certifications: 'ISO 14001, LEED Gold',
        aboutImage: '/natural-farming-export.png',
        isActive: true,
        whyChooseTitle: '¿Por Qué Elegir AgroVentia Inc.?',
        highlights: [
          {
            _key: 'hl-1',
            metric: '10+',
            title: 'Productos de Alta Calidad',
            description: 'Gama completa de soluciones agroalimentarias de primer orden.',
            colorVariant: 'primary',
            sortOrder: 1,
            isActive: true,
          },
          {
            _key: 'hl-2',
            metric: '20+',
            title: 'Mercados Internacionales Atendidos',
            description: 'Conectamos productores africanos con compradores en América del Norte, Europa y el mundo.',
            colorVariant: 'secondary',
            sortOrder: 2,
            isActive: true,
          },
          {
            _key: 'hl-3',
            metric: '100%',
            title: 'Calidad Garantizada',
            description: 'Cada envío se somete a estrictos controles de frescura, pureza y normativa fitosanitaria.',
            colorVariant: 'bronze',
            sortOrder: 3,
            isActive: true,
          },
          {
            _key: 'hl-4',
            metric: '10+',
            title: 'Años de Experiencia Comercial',
            description: 'Más de una década consolidando cadenas de suministro sólidas con productores africanos.',
            colorVariant: 'neutral',
            sortOrder: 4,
            isActive: true,
          },
          {
            _key: 'hl-5',
            metric: '100%',
            title: 'Logística Confiable',
            description: 'Gestión logística integral y despachos puntuales para adquirir materias primas con seguridad.',
            colorVariant: 'forest',
            sortOrder: 5,
            isActive: true,
          },
        ],
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-21T14:40:20.146Z' },
        _updatedDate: { $date: '2026-10-04T04:29:46.316Z' },
        coreValues: [
          {
            _id: '85b1197b-d538-43e7-879b-21003ec8aaab',
            reference: 'quality',
            title: 'Calidad Primero',
            description: 'Entregar productos agrícolas de primera calidad consistentes cada vez.',
            isActive: true,
            _owner: 'sanity',
            _createdDate: { $date: '2025-08-21T16:49:51.374Z' },
            _updatedDate: { $date: '2025-08-25T15:17:51.269Z' },
          },
          {
            _id: '4ab83339-fd43-4466-b0d4-e45a88bb49db',
            reference: 'ethical',
            title: 'Abastecimiento Ético',
            description: 'Asociación con agricultores africanos verificados para asegurar sostenibilidad.',
            isActive: true,
            _owner: 'sanity',
            _createdDate: { $date: '2025-08-21T16:49:51.373Z' },
            _updatedDate: { $date: '2025-08-22T16:04:49.828Z' },
          },
          {
            _id: '4da26982-fc4c-45c3-b0bb-10084b7273f0',
            reference: 'trust',
            title: 'Confianza y Transparencia',
            description: 'Comunicación clara y rendición de cuentas en cada transacción.',
            isActive: true,
            _owner: 'sanity',
            _createdDate: { $date: '2025-08-21T16:49:51.372Z' },
            _updatedDate: { $date: '2025-08-22T16:04:53.161Z' },
          },
          {
            _id: '226a834a-7dc8-408d-8a48-9d32a043813e',
            reference: 'reliability',
            title: 'Fiabilidad',
            description: 'Servicio transparente, oportuno y confiable en cada envío.',
            isActive: true,
            _owner: 'sanity',
            _createdDate: { $date: '2025-08-21T16:49:51.371Z' },
            _updatedDate: { $date: '2025-08-25T15:17:56.704Z' },
          },
        ],
      },
    ];
  }

  return [
    {
      _id: '1a26a2a6-3512-48c1-99ec-3e469d12d725',
      sectionTitle: 'About AgroVentia Inc.',
      mission:
        'To deliver premium, ethically sourced agricultural products worldwide, ensuring quality, reliability, and sustainability in every transaction.',
      vision:
        "To become the leading global gateway to Africa's finest agricultural products by removing barriers, fostering trust, and driving sustainable growth for international buyers and African producers alike.",
      story:
        'AgroVentia Inc. is a Canadian company with deep African roots, established to connect global markets with high-quality agricultural products. Our leadership team combines extensive expertise in business management, consulting, and global trade, with over a decade of direct experience in the import and export of agricultural produce.',
      headquarters: 'Toronto, CA',
      foundingYear: '2025',
      certifications: 'ISO 14001, LEED Gold',
      aboutImage: '/natural-farming-export.png',
      isActive: true,
      whyChooseTitle: 'Why Choose AgroVentia Inc.?',
      highlights: [
        {
          _key: 'hl-1',
          metric: '10+',
          title: 'Premium Products',
          description: 'Comprehensive range of agricultural solutions.',
          colorVariant: 'primary',
          sortOrder: 1,
          isActive: true,
        },
        {
          _key: 'hl-2',
          metric: '20+',
          title: 'Global Markets Served',
          description: 'Connecting African producers with buyers across North America, Europe, and beyond.',
          colorVariant: 'secondary',
          sortOrder: 2,
          isActive: true,
        },
        {
          _key: 'hl-3',
          metric: '100%',
          title: 'Quality Guaranteed',
          description: 'Every shipment undergoes strict checks for freshness, purity, and compliance.',
          colorVariant: 'bronze',
          sortOrder: 3,
          isActive: true,
        },
        {
          _key: 'hl-4',
          metric: '10+',
          title: 'Years of Trade Expertise',
          description: 'Over a decade of building strong supply chains with African producers.',
          colorVariant: 'neutral',
          sortOrder: 4,
          isActive: true,
        },
        {
          _key: 'hl-5',
          metric: '100%',
          title: 'Reliable Logistics',
          description: 'Seamless supply chain and dependable shipping; so you can source with confidence.',
          colorVariant: 'forest',
          sortOrder: 5,
          isActive: true,
        },
      ],
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-21T14:40:20.146Z' },
      _updatedDate: { $date: '2026-10-04T04:29:46.316Z' },
      coreValues: [
        {
          _id: '85b1197b-d538-43e7-879b-21003ec8aaab',
          reference: 'quality',
          title: 'Quality First',
          description: 'Delivering premium, consistent agricultural products every time.',
          isActive: true,
          _owner: 'sanity',
          _createdDate: { $date: '2025-08-21T16:49:51.374Z' },
          _updatedDate: { $date: '2025-08-25T15:17:51.269Z' },
        },
        {
          _id: '4ab83339-fd43-4466-b0d4-e45a88bb49db',
          reference: 'ethical',
          title: 'Ethical Sourcing',
          description: 'Partnering with vetted African farmers to ensure sustainability and fairness.',
          isActive: true,
          _owner: 'sanity',
          _createdDate: { $date: '2025-08-21T16:49:51.373Z' },
          _updatedDate: { $date: '2025-08-22T16:04:49.828Z' },
        },
        {
          _id: '4da26982-fc4c-45c3-b0bb-10084b7273f0',
          reference: 'trust',
          title: 'Trust & Transparency',
          description: 'Clear communication and accountability in every transaction.',
          isActive: true,
          _owner: 'sanity',
          _createdDate: { $date: '2025-08-21T16:49:51.372Z' },
          _updatedDate: { $date: '2025-08-22T16:04:53.161Z' },
        },
        {
          _id: '226a834a-7dc8-408d-8a48-9d32a043813e',
          reference: 'reliability',
          title: 'Reliability',
          description: 'Seamless, timely, and dependable service, every scale, every shipment.',
          isActive: true,
          _owner: 'sanity',
          _createdDate: { $date: '2025-08-21T16:49:51.371Z' },
          _updatedDate: { $date: '2025-08-25T15:17:56.704Z' },
        },
      ],
    },
  ];
};

// ---------------------------------------------------------------------------
// Mock Services Content (en, fr, esp)
// ---------------------------------------------------------------------------

export const getMockServicesContent = async (locale?: string): Promise<ServiceContent[]> => {
  const loc = (locale || 'en').toLowerCase().trim();

  if (loc.startsWith('fr')) {
    return [
      {
        _id: 'e9f4cafe-e0c3-4763-8de5-8c442a28f654',
        sectionTitle: 'Nos Services',
        sectionDescription:
          'Services complets d\'importation agricole connectant les producteurs ouest-africains avec les marchés mondiaux grâce à une gestion fiable de la chaîne d\'approvisionnement.',
        importServices:
          'Approvisionnement direct auprès de fournisseurs ouest-africains vérifiés, expédition en vrac et par conteneurs, assistance au dédouanement',
        customSourcing:
          'Recherche de produits spécialisés, tarification basée sur le volume, planification de la disponibilité saisonnière, options d\'emballage personnalisé',
        qualityAssurance:
          'Tests de qualité rigoureux, vérification de la certification biologique, dépistage de la contamination, garanties de fraîcheur',
        logistics:
          'Expédition sous température contrôlée, horaires de livraison flexibles, suivi et surveillance, gestion des stocks',
        documentation:
          'Documentation de conformité complète, certificats d\'origine, certificats sanitaires, déclarations en douane',
        servicesImage: '/service-section.jpg',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T18:38:22.040Z' },
        _updatedDate: { $date: '2025-08-28T11:06:25.477Z' },
      },
    ];
  }

  if (loc.startsWith('es') || loc === 'esp') {
    return [
      {
        _id: 'e9f4cafe-e0c3-4763-8de5-8c442a28f654',
        sectionTitle: 'Nuestros Servicios',
        sectionDescription:
          'Servicios integrales de importación agrícola que conectan a productores de África Occidental con mercados globales mediante una gestión confiable de la cadena de suministro.',
        importServices: 'Abastecimiento directo, envíos a granel y contenedores, despacho aduanero.',
        customSourcing: 'Búsqueda de productos especializados, precios por volumen, empaque personalizado.',
        qualityAssurance: 'Pruebas rigurosas de calidad, certificación orgánica, garantías de frescura.',
        logistics: 'Transporte a temperatura controlada, entrega flexible y seguimiento continuo.',
        documentation: 'Documentación completa de cumplimiento, certificados de origen y aduanas.',
        servicesImage: '/service-section.jpg',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T18:38:22.040Z' },
        _updatedDate: { $date: '2025-08-28T11:06:25.477Z' },
      },
    ];
  }

  return [
    {
      _id: 'e9f4cafe-e0c3-4763-8de5-8c442a28f654',
      sectionTitle: 'Our Services',
      sectionDescription:
        'Comprehensive agricultural import services connecting West African producers with global markets through reliable supply chain management.',
      importServices:
        'Direct sourcing from verified West African suppliers, bulk and container shipping, customs clearance assistance',
      customSourcing:
        'Specialized product sourcing, volume-based pricing, seasonal availability planning, custom packaging options',
      qualityAssurance:
        'Rigorous quality testing, organic certification verification, contamination screening, freshness guarantees',
      logistics:
        'Temperature-controlled shipping, flexible delivery schedules, tracking and monitoring, inventory management',
      documentation:
        'Complete compliance documentation, certificates of origin, health certificates, customs declarations',
      servicesImage: '/service-section.jpg',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T18:38:22.040Z' },
      _updatedDate: { $date: '2025-08-28T11:06:25.477Z' },
    },
  ];
};

// ---------------------------------------------------------------------------
// Mock Products Content (en, fr, esp)
// ---------------------------------------------------------------------------

export const getMockProductsContent = async (locale?: string): Promise<ProductContent[]> => {
  const loc = (locale || 'en').toLowerCase().trim();

  const enrich = (list: ProductContent[]): ProductContent[] => {
    const isFrench = loc.startsWith('fr');
    const isSpanish = loc.startsWith('es') || loc === 'esp';
    const defaultOrigin = isFrench
      ? "Afrique de l'Ouest"
      : isSpanish
        ? 'África Occidental'
        : 'West Africa';

    return list.map(p => ({
      ...p,
      slug: p.slug || p._id.replace(/^prod-/, ''),
      sourcingOrigin: p.sourcingOrigin || defaultOrigin,
      typicalQualityParameters: p.typicalQualityParameters || p.qualityStandards || '',
      qualityStandards: p.typicalQualityParameters || p.qualityStandards || '',
      isFeatured: p.isFeatured ?? ['prod-ginger', 'prod-sesame', 'prod-shea', 'prod-cocoa'].includes(p._id),
      displayLogistics: p.displayLogistics ?? (p._id === 'prod-ginger'),
      packagingLogistics:
        p.packagingLogistics ||
        (p._id === 'prod-ginger'
          ? isFrench
            ? 'Sacs export en PP de 50 kg, conteneur FCL 20 pi environ 14 tonnes'
            : isSpanish
              ? 'Sacos de polipropileno de 50 kg, capacidad FCL 20 pies aprox 14 TM'
              : '50kg export grade PP bags, 20ft FCL capacity approx 14 MT'
          : ''),
    }));
  };

  if (loc.startsWith('fr')) {
    return enrich([
      {
        _id: 'prod-kolanut',
        title: 'Noix de Cola Séchée',
        productName: 'Noix de Cola Séchée',
        description:
          "Noix de cola séchée de qualité supérieure, provenant directement de producteurs certifiés d'Afrique de l'Ouest. Soigneusement sélectionnée et séchée naturellement pour préserver ses propriétés et ses caractéristiques authentiques pour les industries des boissons et pharmaceutique.",
        category: 'Plantes botaniques et médicinales',
        image1: '/fresh-kolanuts.jpg',
        images: ['/fresh-kolanuts.jpg'],
        sku: 'AGV-KOLANUT',
        inStock: true,
        sortOrder: 0,
        qualityStandards: 'Humidité: < 10%, FFA: < 2%, Nettoyé et trié à la main, conforme ACIA',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.755Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-ginger',
        title: 'Gingembre séché concassé',
        productName: 'Gingembre séché concassé',
        description:
          "Gingembre concassé séché au soleil, à l'arôme intense et à haute teneur en oléorésine. Issu de communautés agricoles biologiques d'Afrique de l'Ouest, idéal pour la transformation d'épices, l'extraction et la distribution alimentaire.",
        category: 'Épices et aromates',
        image1: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7',
        images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7'],
        sku: 'AGV-GINGER',
        inStock: true,
        sortOrder: 1,
        qualityStandards: 'Humidité: < 12%, Huile volatile: > 1.5%, Impuretés: < 1%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.753Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-cashew',
        title: "Noix d'anacarde brutes (en coque)",
        productName: "Noix d'anacarde brutes (en coque)",
        description:
          "Noix d'anacarde brutes en coque à haut rendement KOR. Récoltées et séchées dans des conditions contrôlées pour garantir un rendement optimal en amandes et un très faible taux de défauts pour les unités de transformation industrielle.",
        category: 'Noix et amandes',
        image1: 'https://images.unsplash.com/photo-1509722747041-616f39b57569',
        images: ['https://images.unsplash.com/photo-1509722747041-616f39b57569'],
        sku: 'AGV-CASHEW',
        inStock: true,
        sortOrder: 2,
        qualityStandards: 'Nombre de noix: 180 à 200 par kg, Rendement KOR: 48 à 50 lbs, Humidité: < 9%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.752Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-sesame',
        title: 'Graines de sésame blanc naturel',
        productName: 'Graines de sésame blanc naturel',
        description:
          "Graines de sésame blanc naturel nettoyées mécaniquement, de couleur uniforme et d'une pureté remarquable. Cultivées dans les principales zones agricoles, parfaites pour la boulangerie, la production de tahini et le pressage d'huile.",
        category: 'Graines oléagineuses',
        image1: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c'],
        sku: 'AGV-SESAME',
        inStock: true,
        sortOrder: 3,
        qualityStandards: 'Pureté: 99.5% min, Humidité: < 6%, Teneur en huile: > 50%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.751Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-cocoa',
        title: 'Fèves de cacao fermentées de première qualité',
        productName: 'Fèves de cacao fermentées de première qualité',
        description:
          "Fèves de cacao bien fermentées et rigoureusement séchées, aux notes riches de chocolat et à faible acidité. Entièrement traçables auprès de réseaux coopératifs respectant des normes strictes de durabilité et d'absence de travail des enfants.",
        category: 'Cacao et dérivés',
        image1: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55',
        images: ['https://images.unsplash.com/photo-1541781774459-bb2af2f05b55'],
        sku: 'AGV-COCOA',
        inStock: true,
        sortOrder: 4,
        qualityStandards: 'Nombre de fèves: 95 à 105 par 100g, Humidité: < 7.5%, Défauts: < 3%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.750Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-hibiscus',
        title: "Fleurs d'hibiscus séchées (Karkadé)",
        productName: "Fleurs d'hibiscus séchées (Karkadé)",
        description:
          "Calices entiers d'hibiscus rouge foncé à haute teneur en anthocyanes et acidité franche. Rigoureusement tamisés pour éliminer poussières et corps étrangers, convenant aux infusions, aux extraits et aux colorants alimentaires naturels.",
        category: 'Plantes botaniques et médicinales',
        image1: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d',
        images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d'],
        sku: 'AGV-HIBISCUS',
        inStock: true,
        sortOrder: 5,
        qualityStandards: 'Humidité: < 11%, Cendres totales: < 10%, Cendres insolubles: < 1.5%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.749Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-shea',
        title: 'Beurre de karité brut non raffiné',
        productName: 'Beurre de karité brut non raffiné',
        description:
          "Beurre de karité brut artisanal préparé par des réseaux de coopératives de femmes en Afrique de l'Ouest. Qualité Grade A avec arôme caractéristique de noisette et teinte ivoire, idéal pour la formulation cosmétique et pharmaceutique.",
        category: 'Graines oléagineuses',
        image1: 'https://images.unsplash.com/photo-1608248597359-598d9e634594',
        images: ['https://images.unsplash.com/photo-1608248597359-598d9e634594'],
        sku: 'AGV-SHEA',
        inStock: true,
        sortOrder: 6,
        qualityStandards: 'Grade A, FFA: < 1%, Indice de peroxyde: < 5 meq/kg, Eau: < 0.5%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.748Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-chili',
        title: 'Piments séchés (Œil d’oiseau)',
        productName: 'Piments séchés (Œil d’oiseau)',
        description:
          "Piments œil d'oiseau entiers et séchés d'une chaleur intense. Séchage homogène préservant la vive couleur rouge et la forte teneur en capsaïcine pour les sauces piquantes, mélanges d'épices et extractions industrielles.",
        category: 'Épices et aromates',
        image1: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d',
        images: ['https://images.unsplash.com/photo-1588252303782-cb80119abd6d'],
        sku: 'AGV-CHILI',
        inStock: true,
        sortOrder: 7,
        qualityStandards: 'Scoville: 80 000 à 120 000 SHU, Humidité: < 10%, Matières étrangères: < 1%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.747Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-gum',
        title: 'Gomme arabique naturelle (Acacia)',
        productName: 'Gomme arabique naturelle (Acacia)',
        description:
          "Larmes de gomme Acacia senegal et Acacia seyal de haute pureté. Récoltées naturellement et triées à la main pour les applications pharmaceutiques, la stabilisation des boissons, la confiserie et l'industrie.",
        category: 'Plantes botaniques et médicinales',
        image1: 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
        images: ['https://images.unsplash.com/photo-1563245372-f21724e3856d'],
        sku: 'AGV-GUM',
        inStock: true,
        sortOrder: 8,
        qualityStandards: 'Grade 1 (Senegal) et Grade 2 (Seyal), Humidité: < 12%, Cendres totales: < 4%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.746Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-cassava',
        title: 'Fécule et cossettes de manioc',
        productName: 'Fécule et cossettes de manioc',
        description:
          "Cossettes de manioc séchées de qualité industrielle et fécule de manioc raffinée de qualité alimentaire. Produites à partir de racines de manioc matures sans OGM, offrant d'excellentes propriétés de gélatinisation pour l'agroalimentaire.",
        category: 'Tubercules et céréales',
        image1: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
        images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37'],
        sku: 'AGV-CASSAVA',
        inStock: true,
        sortOrder: 9,
        qualityStandards: 'Teneur en amidon: > 85%, Humidité: < 12%, Fibres: < 2%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.745Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-tiger',
        title: 'Souchet comestible séché',
        productName: 'Souchet comestible séché',
        description:
          "Tubercules de souchet comestible lavés et séchés (Cyperus esculentus). Riches en fibres prébiotiques, en acide oléique et en douceur naturelle, parfaits pour les substituts laitiers végétaux, l'horchata et les farines sans gluten.",
        category: 'Tubercules et céréales',
        image1: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c'],
        sku: 'AGV-TIGER',
        inStock: true,
        sortOrder: 10,
        qualityStandards: 'Humidité: < 9%, Calibres: 8 à 12 mm, Impuretés: < 0.5%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.744Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-pepper',
        title: 'Poivre noir entier de qualité export',
        productName: 'Poivre noir entier de qualité export',
        description:
          "Grains entiers de poivre noir séchés au soleil auprès de coopératives de petits exploitants d'Afrique de l'Ouest. Densité élevée avec un poids spécifique d'au moins 550 g/L et forte teneur en pipérine, nettoyés et stérilisés à la vapeur.",
        category: 'Épices et aromates',
        image1: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898',
        images: ['https://images.unsplash.com/photo-1509358271058-acd22cc93898'],
        sku: 'AGV-PEPPER',
        inStock: true,
        sortOrder: 11,
        qualityStandards: 'Densité: > 550 g/L, Humidité: < 12%, Pipérine: > 4.5%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.743Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
    ]);
  }

  if (loc.startsWith('es') || loc === 'esp') {
    return enrich([
      {
        _id: 'prod-kolanut',
        title: 'Nuez de Cola Seca',
        productName: 'Nuez de Cola Seca',
        description:
          'Nuez de cola seca de primera calidad procedente directamente de productores certificados de África Occidental. Cuidadosamente seleccionada y secada de forma natural para mantener sus propiedades y características auténticas para aplicaciones farmacéuticas y de bebidas.',
        category: 'Productos botánicos y medicinales',
        image1: '/fresh-kolanuts.jpg',
        images: ['/fresh-kolanuts.jpg'],
        sku: 'AGV-KOLANUT',
        inStock: true,
        sortOrder: 0,
        qualityStandards: 'Humedad: < 10%, FFA: < 2%, Limpiado y seleccionado a mano, conforme a normas internacionales',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.755Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-ginger',
        title: 'Jengibre seco troceado',
        productName: 'Jengibre seco troceado',
        description:
          'Jengibre troceado secado al sol con intenso aroma y alto contenido de oleorresina. Procedente de comunidades agrícolas orgánicas de África Occidental, ideal para procesamiento de especias, extracción y distribución culinaria.',
        category: 'Especias y aromáticos',
        image1: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7',
        images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7'],
        sku: 'AGV-GINGER',
        inStock: true,
        sortOrder: 1,
        qualityStandards: 'Humedad: < 12%, Aceite volátil: > 1.5%, Impurezas: < 1%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.753Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-cashew',
        title: 'Nueces de anacardo crudas (con cáscara)',
        productName: 'Nueces de anacardo crudas (con cáscara)',
        description:
          'Nueces de anacardo crudas con cáscara de alto rendimiento KOR. Cosechadas y secadas bajo condiciones controladas para garantizar un rendimiento óptimo de almendra y bajo índice de defectos para instalaciones de procesamiento industrial.',
        category: 'Nueces y semillas comestibles',
        image1: 'https://images.unsplash.com/photo-1509722747041-616f39b57569',
        images: ['https://images.unsplash.com/photo-1509722747041-616f39b57569'],
        sku: 'AGV-CASHEW',
        inStock: true,
        sortOrder: 2,
        qualityStandards: 'Conteo de nueces: 180 a 200 por kg, Rendimiento KOR: 48 a 50 lbs, Humedad: < 9%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.752Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-sesame',
        title: 'Semillas de sésamo blanco natural',
        productName: 'Semillas de sésamo blanco natural',
        description:
          'Semillas de sésamo blanco natural limpiadas mecánicamente, con color uniforme y pureza excepcional. Procedentes de zonas agrícolas principales, perfectas para panadería, elaboración de tahini y molienda de aceite.',
        category: 'Semillas oleaginosas',
        image1: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c'],
        sku: 'AGV-SESAME',
        inStock: true,
        sortOrder: 3,
        qualityStandards: 'Pureza: 99.5% mín, Humedad: < 6%, Contenido de aceite: > 50%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.751Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-cocoa',
        title: 'Granos de cacao fermentados de calidad superior',
        productName: 'Granos de cacao fermentados de calidad superior',
        description:
          'Granos de cacao bien fermentados y completamente secos, con notas profundas de chocolate y baja acidez. Totalmente trazables a redes de cooperativas agrícolas que cumplen con estrictas normas de sostenibilidad y trabajo ético.',
        category: 'Cacao y derivados',
        image1: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55',
        images: ['https://images.unsplash.com/photo-1541781774459-bb2af2f05b55'],
        sku: 'AGV-COCOA',
        inStock: true,
        sortOrder: 4,
        qualityStandards: 'Conteo de granos: 95 a 105 por 100g, Humedad: < 7.5%, Defectos: < 3%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.750Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-hibiscus',
        title: 'Flores de hibisco secas (Flor de Jamaica)',
        productName: 'Flores de hibisco secas (Flor de Jamaica)',
        description:
          'Cálices enteros de hibisco color rojo oscuro con alto contenido de antocianinas y acidez característica. Cuidadosamente tamizados para reducir polvo y materias extrañas, aptos para infusiones, extractos y colorantes alimentarios naturales.',
        category: 'Productos botánicos y medicinales',
        image1: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d',
        images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d'],
        sku: 'AGV-HIBISCUS',
        inStock: true,
        sortOrder: 5,
        qualityStandards: 'Humedad: < 11%, Cenizas totales: < 10%, Cenizas insolubles en ácido: < 1.5%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.749Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-shea',
        title: 'Manteca de karité pura sin refinar',
        productName: 'Manteca de karité pura sin refinar',
        description:
          'Manteca de karité pura sin refinar elaborada artesanalmente por cooperativas de mujeres en África Occidental. Calidad Grado A con aroma característico y tonalidad marfil, ideal para formulaciones cosméticas y farmacéuticas.',
        category: 'Semillas oleaginosas',
        image1: 'https://images.unsplash.com/photo-1608248597359-598d9e634594',
        images: ['https://images.unsplash.com/photo-1608248597359-598d9e634594'],
        sku: 'AGV-SHEA',
        inStock: true,
        sortOrder: 6,
        qualityStandards: 'Grado A, FFA: < 1%, Índice de peróxido: < 5 meq/kg, Agua: < 0.5%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.748Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-chili',
        title: 'Chiles secos (Ojo de pájaro)',
        productName: 'Chiles secos (Ojo de pájaro)',
        description:
          'Chiles ojo de pájaro enteros y secos de intenso picor. Secado uniforme para conservar el color rojo brillante y la alta concentración de capsaicina para salsas, condimentos y extracción industrial.',
        category: 'Especias y aromáticos',
        image1: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d',
        images: ['https://images.unsplash.com/photo-1588252303782-cb80119abd6d'],
        sku: 'AGV-CHILI',
        inStock: true,
        sortOrder: 7,
        qualityStandards: 'Scoville: 80 000 a 120 000 SHU, Humedad: < 10%, Materia extraña: < 1%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.747Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-gum',
        title: 'Goma arábiga natural (Acacia)',
        productName: 'Goma arábiga natural (Acacia)',
        description:
          'Lágrimas de goma Acacia senegal y Acacia seyal de alta pureté. Cosechadas de manera natural y seleccionadas a mano para aplicaciones farmacéuticas, estabilización de bebidas, confitería y usos industriales.',
        category: 'Productos botánicos y medicinales',
        image1: 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
        images: ['https://images.unsplash.com/photo-1563245372-f21724e3856d'],
        sku: 'AGV-GUM',
        inStock: true,
        sortOrder: 8,
        qualityStandards: 'Grado 1 (Senegal) y Grado 2 (Seyal), Humedad: < 12%, Cenizas totales: < 4%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.746Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-cassava',
        title: 'Almidón y hojuelas de yuca',
        productName: 'Almidón y hojuelas de yuca',
        description:
          'Hojuelas de yuca seca de grado industrial y almidón refinado de grado alimentario. Producidos a partir de raíces de yuca madura no transgénica, proporcionando excelentes propiedades de gelatinización para la industria alimentaria.',
        category: 'Tubérculos y granos',
        image1: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
        images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37'],
        sku: 'AGV-CASSAVA',
        inStock: true,
        sortOrder: 9,
        qualityStandards: 'Contenido de almidón: > 85%, Humedad: < 12%, Fibra: < 2%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.745Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-tiger',
        title: 'Chufas secas seleccionadas',
        productName: 'Chufas secas seleccionadas',
        description:
          'Tubérculos de chufa lavados y secos seleccionados (Cyperus esculentus). Ricos en fibra prebiótica, ácido oleico y dulzura natural, ideales para alternativas lácteas vegetales, producción de horchata y molienda sin gluten.',
        category: 'Tubérculos y granos',
        image1: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c'],
        sku: 'AGV-TIGER',
        inStock: true,
        sortOrder: 10,
        qualityStandards: 'Humedad: < 9%, Calibres: 8 a 12 mm, Impurezas: < 0.5%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.744Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
      {
        _id: 'prod-pepper',
        title: 'Pimienta negra en grano grado exportación',
        productName: 'Pimienta negra en grano grado exportación',
        description:
          'Granos enteros de pimienta negra secados al sol por cooperativas de pequeños agricultores de África Occidental. Alta densidad con peso específico mínimo de 550 g/L y marcada pungencia de piperina, limpios y esterilizados por vapor.',
        category: 'Especias y aromáticos',
        image1: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898',
        images: ['https://images.unsplash.com/photo-1509358271058-acd22cc93898'],
        sku: 'AGV-PEPPER',
        inStock: true,
        sortOrder: 11,
        qualityStandards: 'Densidad: > 550 g/L, Humedad: < 12%, Piperina: > 4.5%',
        isActive: true,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:44:46.743Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
    ]);
  }

  return enrich([
    {
      _id: 'prod-kolanut',
      title: 'Dried Kolanut',
      productName: 'Dried Kolanut',
      description:
        'Premium grade dried kolanut sourced directly from certified West African growers. Carefully selected and naturally dried to maintain potency and authentic characteristics for beverage and pharmaceutical applications.',
      category: 'Botanicals',
      image1: '/fresh-kolanuts.jpg',
      images: ['/fresh-kolanuts.jpg'],
      sku: 'AGV-KOLANUT',
      inStock: true,
      sortOrder: 0,
      qualityStandards: 'Moisture: < 10%, FFA: < 2%, Cleaned and hand-sorted, CFIA compliant',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:44:46.755Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
    {
      _id: 'prod-ginger',
      title: 'Split Dried Ginger',
      productName: 'Split Dried Ginger',
      description:
        'Sun-dried split ginger with robust aroma and high oleoresin content. Sourced from organic farming communities in West Africa, ideal for spice processing, extraction, and culinary distribution.',
      category: 'Spices & Aromatics',
      image1: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7',
      images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7'],
      sku: 'AGV-GINGER',
      inStock: true,
      sortOrder: 1,
      qualityStandards: 'Moisture: < 12%, Volatile oil: > 1.5%, Impurities: < 1%',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:44:46.753Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
    {
      _id: 'prod-cashew',
      title: 'Raw Cashew Nuts',
      productName: 'Raw Cashew Nuts',
      description:
        'High outturn raw cashew nuts in shell. Harvested and dried under controlled conditions to ensure optimal kernel yield and low defective rates for industrial processing facilities.',
      category: 'Nuts & Kernels',
      image1: 'https://images.unsplash.com/photo-1509722747041-616f39b57569',
      images: ['https://images.unsplash.com/photo-1509722747041-616f39b57569'],
      sku: 'AGV-CASHEW',
      inStock: true,
      sortOrder: 2,
      qualityStandards: 'Nut count: 180 to 200 per kg, Outturn: 48 to 50 lbs, Moisture: < 9%',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:44:46.752Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
    {
      _id: 'prod-sesame',
      title: 'Natural White Sesame Seeds',
      productName: 'Natural White Sesame Seeds',
      description:
        'Mechanically cleaned natural white sesame seeds with uniform color and exceptional purity. Sourced from prime agricultural zones, perfect for bakery, tahini production, and oil crushing.',
      category: 'Oilseeds',
      image1: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c'],
      sku: 'AGV-SESAME',
      inStock: true,
      sortOrder: 3,
      qualityStandards: 'Purity: 99.5% min, Moisture: < 6%, Oil content: > 50%',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:44:46.751Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
    {
      _id: 'prod-cocoa',
      title: 'Premium Fermented Cocoa Beans',
      productName: 'Premium Fermented Cocoa Beans',
      description:
        'Well-fermented and thoroughly dried cocoa beans with rich chocolate notes and low acidity. Fully traceable to cooperative farm networks adhering to strict child-labor-free and sustainability standards.',
      category: 'Cocoa & Derivatives',
      image1: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55',
      images: ['https://images.unsplash.com/photo-1541781774459-bb2af2f05b55'],
      sku: 'AGV-COCOA',
      inStock: true,
      sortOrder: 4,
      qualityStandards: 'Bean count: 95 to 105 per 100g, Moisture: < 7.5%, Defective: < 3%',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:44:46.750Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
    {
      _id: 'prod-hibiscus',
      title: 'Dried Hibiscus Calyces',
      productName: 'Dried Hibiscus Calyces',
      description:
        'Whole dark-red hibiscus calyces with high anthocyanin content and sharp tartness. Thoroughly sieved to minimize dust and foreign matter, suitable for herbal teas, extracts, and food coloring.',
      category: 'Botanicals',
      image1: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d',
      images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d'],
      sku: 'AGV-HIBISCUS',
      inStock: true,
      sortOrder: 5,
      qualityStandards: 'Moisture: < 11%, Total ash: < 10%, Acid insoluble ash: < 1.5%',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:44:46.749Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
    {
      _id: 'prod-shea',
      title: 'Unrefined Shea Butter',
      productName: 'Unrefined Shea Butter',
      description:
        'Traditional hand-crafted unrefined shea butter from women cooperative networks in West Africa. Grade A quality with characteristic nutty aroma and ivory-to-pale-yellow color, ideal for cosmetic and pharmaceutical formulating.',
      category: 'Oilseeds',
      image1: 'https://images.unsplash.com/photo-1608248597359-598d9e634594',
      images: ['https://images.unsplash.com/photo-1608248597359-598d9e634594'],
      sku: 'AGV-SHEA',
      inStock: true,
      sortOrder: 6,
      qualityStandards: 'Grade A, FFA: < 1%, Peroxide value: < 5 meq/kg, Water: < 0.5%',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:44:46.748Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
    {
      _id: 'prod-chili',
      title: 'Dried Chili Peppers (Bird’s Eye)',
      productName: 'Dried Chili Peppers (Bird’s Eye)',
      description:
        'Intensely hot whole dried bird’s eye chili peppers. Uniformly dried to retain vivid red coloration and high capsaicin concentration for hot sauces, seasoning blends, and industrial capsaicin extraction.',
      category: 'Spices & Aromatics',
      image1: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d',
      images: ['https://images.unsplash.com/photo-1588252303782-cb80119abd6d'],
      sku: 'AGV-CHILI',
      inStock: true,
      sortOrder: 7,
      qualityStandards: 'Scoville: 80,000 to 120,000 SHU, Moisture: < 10%, Foreign matter: < 1%',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:44:46.747Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
    {
      _id: 'prod-gum',
      title: 'Gum Arabic (Acacia)',
      productName: 'Gum Arabic (Acacia)',
      description:
        'High-purity Acacia senegal and Acacia seyal gum tears. Naturally harvested and hand-graded for pharmaceutical, beverage stabilization, confectionery, and lithographic applications.',
      category: 'Botanicals',
      image1: 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
      images: ['https://images.unsplash.com/photo-1563245372-f21724e3856d'],
      sku: 'AGV-GUM',
      inStock: true,
      sortOrder: 8,
      qualityStandards: 'Grade 1 (Senegal) and Grade 2 (Seyal), Moisture: < 12%, Total ash: < 4%',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:44:46.746Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
    {
      _id: 'prod-cassava',
      title: 'Cassava Starch / Chips',
      productName: 'Cassava Starch / Chips',
      description:
        'Industrial grade dried cassava chips and refined food-grade tapioca starch. Produced from mature, non-GMO cassava roots, providing high gelatinization properties for food production and bio-industrial feedstocks.',
      category: 'Tubers & Grains',
      image1: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
      images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37'],
      sku: 'AGV-CASSAVA',
      inStock: true,
      sortOrder: 9,
      qualityStandards: 'Starch content: > 85%, Moisture: < 12%, Fiber: < 2%',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:44:46.745Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
    {
      _id: 'prod-tiger',
      title: 'Tiger Nuts (Chufa)',
      productName: 'Tiger Nuts (Chufa)',
      description:
        'Selected washed and dried tiger nut tubers (Cyperus esculentus). Rich in prebiotic fiber, oleic acid, and natural sweetness, ideal for dairy-free milk alternatives, horchata production, and gluten-free milling.',
      category: 'Tubers & Grains',
      image1: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c'],
      sku: 'AGV-TIGER',
      inStock: true,
      sortOrder: 10,
      qualityStandards: 'Moisture: < 9%, Sizes: 8 to 12 mm, Impurities: < 0.5%',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:44:46.744Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
    {
      _id: 'prod-pepper',
      title: 'Black Peppercorns',
      productName: 'Black Peppercorns',
      description:
        'Whole sun-dried black peppercorns from trusted West African smallholder cooperatives. Bold density with minimum 550 g/L test weight and intense piperine pungency, cleaned and steam-sterilized for international spice packers.',
      category: 'Spices & Aromatics',
      image1: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898',
      images: ['https://images.unsplash.com/photo-1509358271058-acd22cc93898'],
      sku: 'AGV-PEPPER',
      inStock: true,
      sortOrder: 11,
      qualityStandards: 'Density: > 550 g/L, Moisture: < 12%, Piperine: > 4.5%',
      isActive: true,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:44:46.743Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
  ]);
};


export const getMockProductCatalogContent = async (
  locale?: string,
  all: boolean = false
): Promise<ProductCatalogItem[]> => {
  if (all) {
    const products = getPortfolioProducts(locale);
    return products.map(p => ({
      ...p,
      productName: p.title,
      allProducts: [],
    }));
  }
  const products = await getMockProductsContent(locale);
  return products.map(p => ({
    ...p,
    productName: p.title,
    allProducts: [],
  }));
};

export const getAllMockProductCatalogContent = async (
  locale?: string
): Promise<ProductCatalogItem[]> => {
  return getMockProductCatalogContent(locale, true);
};

// ---------------------------------------------------------------------------
// Mock Contact Content (en, fr, esp)
// ---------------------------------------------------------------------------

export const getMockContactContent = async (locale?: string): Promise<ContactContent[]> => {
  const loc = (locale || 'en').toLowerCase().trim();

  if (loc.startsWith('fr')) {
    return [
      {
        _id: '8db43fe2-adac-40cd-b90e-41909fd6beb4',
        sectionTitle: 'Contactez-nous',
        sectionDescription:
          'Prêt à discuter de vos besoins en produits ? Contactez notre équipe pour un service personnalisé et des prix compétitifs.',
        businessEmail: 'info@agroventia.ca',
        businessPhone: '+1 (403) 477-6059',
        businessAddress: '403, 65 Mutual Street, Toronto, M5B 0E5',
        businessHours: 'Lundi à vendredi: 8h00 à 18h00 HNE',
        responseTime: '24 heures pour toutes les demandes',
        socialLinks: 'https://www.linkedin.com/company/agroventia-inc',
        contactImage: '/service-section.jpg',
        isActive: true,
        companyTagline: 'Solutions Agricoles',
        companyBio:
          'Partenaire de confiance en exportation agricole, distribuant des produits de premier choix sur les marchés mondiaux avec constance, transparence et ponctualité.',
        followUsTitle: 'Suivez-Nous',
        quickLinksTitle: 'Liens Rapides',
        coreValuesTitle: 'Nos Valeurs Fondamentales',
        productCategoriesTitle: 'Catégories de Produits',
        copyrightNotice: 'AgroVentia Inc. Tous droits réservés.',
        backToTopText: 'Retour en Haut',
        legalLinks: [
          { _key: 'll-1', label: 'Politique de Confidentialité', url: '/privacy-policy' },
          { _key: 'll-2', label: "Conditions d'Utilisation", url: '/terms-of-service' },
          { _key: 'll-3', label: 'Politique Relative aux Témoins', url: '/cookie-policy' },
        ],
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-23T07:20:09.970Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
    ];
  }

  if (loc.startsWith('es') || loc === 'esp') {
    return [
      {
        _id: '8db43fe2-adac-40cd-b90e-41909fd6beb4',
        sectionTitle: 'Contáctenos',
        sectionDescription: '¿Listo para discutir sus necesidades de productos? Póngase en contacto con nuestro equipo.',
        businessEmail: 'info@agroventia.ca',
        businessPhone: '+1 (403) 477-6059',
        businessAddress: '403, 65 Mutual Street, Toronto, M5B 0E5',
        businessHours: 'Lunes a viernes: 8:00 a 18:00 EST',
        responseTime: 'Dentro de 24 horas',
        socialLinks: 'https://www.linkedin.com/company/agroventia-inc',
        contactImage: '/service-section.jpg',
        isActive: true,
        companyTagline: 'Soluciones Agrícolas',
        companyBio:
          'Socio comercial de confianza en exportación agrícola, distribuyendo productos de alta calidad en mercados globales con constancia, transparencia y puntualidad.',
        followUsTitle: 'Síganos',
        quickLinksTitle: 'Enlaces Rápidos',
        coreValuesTitle: 'Nuestros Valores Fundamentales',
        productCategoriesTitle: 'Categorías de Productos',
        copyrightNotice: 'AgroVentia Inc. Todos los derechos reservados.',
        backToTopText: 'Volver Arriba',
        legalLinks: [
          { _key: 'll-1', label: 'Política de Privacidad', url: '/privacy-policy' },
          { _key: 'll-2', label: 'Términos de Servicio', url: '/terms-of-service' },
          { _key: 'll-3', label: 'Política de Cookies', url: '/cookie-policy' },
        ],
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-23T07:20:09.970Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      },
    ];
  }

  return [
    {
      _id: '8db43fe2-adac-40cd-b90e-41909fd6beb4',
      sectionTitle: 'Get In Touch',
      sectionDescription:
        'Ready to discuss your product needs? Contact our team for personalized service and competitive pricing.',
      businessEmail: 'info@agroventia.ca',
      businessPhone: '+1 (403) 477-6059',
      businessAddress: '403, 65 Mutual Street, Toronto, M5B 0E5',
      businessHours: 'Monday to Friday: 8:00 AM to 6:00 PM EST',
      responseTime: '24 hours for all inquiries',
      socialLinks: 'https://www.linkedin.com/company/agroventia-inc',
      contactImage: '/service-section.jpg',
      isActive: true,
      companyTagline: 'Agricultural Solutions',
      companyBio:
        'Trusted agricultural export partner delivering premium products to global markets with consistency, transparency, and on-time delivery.',
      followUsTitle: 'Follow Us',
      quickLinksTitle: 'Quick Links',
      coreValuesTitle: 'Our Core Values',
      productCategoriesTitle: 'Product Categories',
      copyrightNotice: 'AgroVentia Inc. All rights reserved.',
      backToTopText: 'Back to Top',
      legalLinks: [
        { _key: 'll-1', label: 'Privacy Policy', url: '/privacy-policy' },
        { _key: 'll-2', label: 'Terms of Service', url: '/terms-of-service' },
        { _key: 'll-3', label: 'Cookie Policy', url: '/cookie-policy' },
      ],
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-23T07:20:09.970Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
    },
  ];
};

// ---------------------------------------------------------------------------
// Mock Core Values (en, fr, esp)
// ---------------------------------------------------------------------------

export const getMockCoreValues = async (locale?: string): Promise<CoreValuesContent[]> => {
  const about = await getMockAboutContent(locale);
  const cvs = about[0]?.coreValues || [];
  return cvs.map((cv, idx) => ({
    _id: cv._id,
    _owner: 'sanity',
    _createdDate: cv._createdDate,
    _updatedDate: cv._updatedDate,
    title: cv.title,
    description: cv.description,
    reference: cv.reference,
    sortOrder: idx,
    isActive: cv.isActive ?? true,
  }));
};

// ---------------------------------------------------------------------------
// Mock Carousel Images (en, fr, esp)
// ---------------------------------------------------------------------------

export const getMockCarouselImages = async (locale?: string): Promise<CarouselImageDisplayContent[]> => {
  const loc = (locale || 'en').toLowerCase().trim();

  return [
    {
      _id: 'carousel-1',
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-21T00:00:00.000Z' },
      _updatedDate: { $date: '2026-10-04T00:00:00.000Z' },
      image: '/background-image-mobile.jpg',
      title:
        loc.startsWith('fr')
          ? 'Qualité agricole supérieure'
          : loc.startsWith('es') || loc === 'esp'
            ? 'Calidad agrícola superior'
            : 'Premium Agricultural Quality',
      description:
        loc.startsWith('fr')
          ? 'Des produits agricoles traçables, préparés selon les exigences des acheteurs internationaux.'
          : loc.startsWith('es') || loc === 'esp'
            ? 'Productos agrícolas trazables, preparados según los requisitos de compradores internacionales.'
            : 'Traceable agricultural products prepared to international buyer requirements.',
      imageDescription:
        loc.startsWith('fr')
          ? 'Qualité agricole premium'
          : loc.startsWith('es') || loc === 'esp'
            ? 'Calidad agrícola prémium'
            : 'Premium Agricultural Quality',
      tagline:
        loc.startsWith('fr')
          ? 'Approvisionnement fiable et direct'
          : loc.startsWith('es') || loc === 'esp'
            ? 'Abastecimiento directo y confiable'
            : 'Reliable Direct Sourcing',
      displayOrder: 1,
      isActive: true,
    },
    {
      _id: 'carousel-2',
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-21T00:00:00.000Z' },
      _updatedDate: { $date: '2026-10-04T00:00:00.000Z' },
      image: 'https://images.unsplash.com/photo-1649344739140-c71b2ee1005c',
      title:
        loc.startsWith('fr')
          ? 'Chaînes d’approvisionnement durables'
          : loc.startsWith('es') || loc === 'esp'
            ? 'Cadenas de suministro sostenibles'
            : 'Sustainable Supply Chains',
      description:
        loc.startsWith('fr')
          ? 'Des partenariats responsables qui relient les producteurs aux marchés mondiaux.'
          : loc.startsWith('es') || loc === 'esp'
            ? 'Alianzas responsables que conectan a los productores con mercados globales.'
            : 'Responsible partnerships connecting producers with global markets.',
      imageDescription:
        loc.startsWith('fr')
          ? 'Filières agricoles durables'
          : loc.startsWith('es') || loc === 'esp'
            ? 'Cadenas agrícolas sostenibles'
            : 'Sustainable Agricultural Supply',
      tagline:
        loc.startsWith('fr')
          ? 'Commerce international éthique'
          : loc.startsWith('es') || loc === 'esp'
            ? 'Comercio internacional ético'
            : 'Ethical International Trade',
      displayOrder: 2,
      isActive: true,
    },
  ];
};

// ---------------------------------------------------------------------------
// Mock Blog Posts (en, fr, esp)
// ---------------------------------------------------------------------------

export const getMockBlogPosts = async (locale?: string): Promise<BlogPost[]> => {
  const loc = (locale || 'en').toLowerCase().trim();
  const isFr = loc.startsWith('fr');
  const isEs = loc.startsWith('es') || loc === 'esp';

  const post1Title = isFr
    ? 'Faire le pont entre les industries avec des produits agricoles de qualité'
    : isEs
      ? 'Uniendo industrias con productos agrícolas prémium'
      : 'Bridging Industries with Premium Produce';

  const post1Excerpt = isFr
    ? "Découvrez comment l'approvisionnement éthique transforme le commerce agricole entre l'Afrique de l'Ouest et les marchés mondiaux."
    : isEs
      ? 'Descubra cómo el abastecimiento ético transforma el comercio agrícola entre África Occidental y los mercados globales.'
      : 'Explore how ethical sourcing transforms agricultural trade between West Africa and global markets.';

  const post1Content = isFr
    ? '<p>Chez AgroVentia, notre engagement envers une qualité constante et des partenariats éthiques assure un approvisionnement agricole fluide entre les continents. Nous travaillons directement avec des producteurs vérifiés pour garantir la traçabilité complète de chaque cargaison.</p><p>De la validation phytosanitaire à la logistique maritime, nos protocoles stricts protègent la pureté des commodités tout au long de la chaîne d\'approvisionnement.</p>'
    : isEs
      ? '<p>En AgroVentia, nuestro compromiso con la calidad constante y las alianzas éticas garantiza un suministro agrícola confiable entre continentes. Colaboramos directamente con productores certificados para asegurar la trazabilidad integral de cada cargamento.</p><p>Desde la certificación fitosanitaria hasta la logística marítima, nuestros protocolos rigurosos protegen la pureza de los productos en cada etapa de la cadena de suministro.</p>'
      : '<p>At AgroVentia, our commitment to consistent quality and ethical partnerships ensures seamless agricultural sourcing across continents. We collaborate directly with verified growers to maintain rigorous lot-level traceability.</p><p>From phytosanitary inspection to ocean freight coordination, our disciplined trade protocols guarantee commodity integrity and timely delivery worldwide.</p>';

  const post1CatTitle = isFr
    ? 'Analyses du secteur'
    : isEs
      ? 'Perspectivas del sector'
      : 'Industry Insights';

  const post2Title = isFr
    ? "L'approvisionnement durable en légumineuses canadiennes pour les marchés mondiaux"
    : isEs
      ? 'Abastecimiento sostenible de legumbres canadienses para mercados globales'
      : 'Sustainable Sourcing of Canadian Pulses for Global Markets';

  const post2Excerpt = isFr
    ? 'Analyse des corridors d\'exportation des Prairies canadiennes et des spécifications de grade pour les lentilles et pois jaunes.'
    : isEs
      ? 'Análisis de los corredores de exportación de las praderas canadienses y especificaciones de grado para lentejas y guisantes amarillos.'
      : 'An in-depth analysis of Canadian Prairies export corridors and grade specifications for red lentils and yellow peas.';

  const post2Content = isFr
    ? '<p>Le Canada demeure le chef de file mondial de la production et de l\'exportation de légumineuses de haute qualité. Grâce à des conditions de culture optimales en Saskatchewan et en Alberta, nos lentilles rouges et pois jaunes répondent aux normes de pureté les plus strictes.</p><p>AgroVentia fournit aux transformateurs alimentaires et aux négociants internationaux des spécifications personnalisées et des expéditions maritimes conteneurisées régulières.</p>'
    : isEs
      ? '<p>Canadá se mantiene como el líder mundial en la producción y exportación de legumbres de alta calidad. Gracias a condiciones de cultivo ideales en Saskatchewan y Alberta, nuestras lentejas rojas y guisantes amarillos cumplen con los estándares de pureza más rigurosos.</p><p>AgroVentia abastece a procesadores industriales y distribuidores internacionales con especificaciones personalizadas y despachos marítimos regulares.</p>'
      : '<p>Canada remains the global benchmark for high-protein pulse production and export reliability. Cultivated across prime agricultural soils in Saskatchewan and Alberta, our red lentils and yellow peas deliver exceptional purity and cooking performance.</p><p>AgroVentia supports international food manufacturers and commodity distributors with custom lot grading, containerized ocean logistics, and dependable shipment schedules.</p>';

  const post2CatTitle = isFr
    ? 'Chaîne d\'approvisionnement'
    : isEs
      ? 'Cadena de suministro'
      : 'Supply Chain & Logistics';

  const authorName = isFr
    ? 'Équipe éditoriale AgroVentia'
    : isEs
      ? 'Equipo editorial AgroVentia'
      : 'AgroVentia Editorial';

  return [
    {
      _id: 'mock-post-1',
      _owner: 'sanity',
      _createdDate: { $date: '2025-09-01T10:00:00.000Z' },
      _updatedDate: { $date: '2026-10-04T12:00:00.000Z' },
      title: post1Title,
      slug: 'bridging-industries-with-premium-produce',
      excerpt: post1Excerpt,
      content: post1Content,
      coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
      publishedDate: '2025-09-01T10:00:00.000Z',
      author: authorName,
      categories: [
        {
          _id: 'cat-1',
          _owner: 'sanity',
          _createdDate: { $date: '2025-09-01T10:00:00.000Z' },
          _updatedDate: { $date: '2026-10-04T12:00:00.000Z' },
          title: post1CatTitle,
          description: isFr
            ? 'Analyses du commerce agricole mondial et des filières.'
            : isEs
              ? 'Actualizaciones sobre el comercio agrícola global y cadenas de suministro.'
              : 'Updates on global agricultural trade and supply chains.',
        },
      ],
    },
    {
      _id: 'mock-post-2',
      _owner: 'sanity',
      _createdDate: { $date: '2025-09-15T10:00:00.000Z' },
      _updatedDate: { $date: '2026-10-05T12:00:00.000Z' },
      title: post2Title,
      slug: 'sustainable-sourcing-canadian-pulses-global-markets',
      excerpt: post2Excerpt,
      content: post2Content,
      coverImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b',
      publishedDate: '2025-09-15T10:00:00.000Z',
      author: authorName,
      categories: [
        {
          _id: 'cat-2',
          _owner: 'sanity',
          _createdDate: { $date: '2025-09-15T10:00:00.000Z' },
          _updatedDate: { $date: '2026-10-05T12:00:00.000Z' },
          title: post2CatTitle,
          description: isFr
            ? 'Normes de qualité et logistique d\'exportation des légumineuses.'
            : isEs
              ? 'Estándares de calidad y logística de exportación de legumbres.'
              : 'Quality standards and export logistics for pulse crops.',
        },
      ],
    },
  ];
};

export const getMockBlogPostBySlug = async (
  slug: string,
  locale?: string
): Promise<BlogPost | null> => {
  const posts = await getMockBlogPosts(locale);
  return posts.find(p => p.slug === slug) || posts[0] || null;
};

// ---------------------------------------------------------------------------
// Mock Authors & Categories
// ---------------------------------------------------------------------------

export const getMockAuthors = async (locale?: string): Promise<Author[]> => {
  const loc = (locale || 'en').toLowerCase().trim();
  return [
    {
      _id: 'mock-author-1',
      _owner: 'sanity',
      _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
      _updatedDate: { $date: '2026-10-04T00:00:00.000Z' },
      name: 'AgroVentia Editorial',
      bio: loc.startsWith('fr')
        ? 'Bureau éditorial et veille de marché AgroVentia.'
        : loc.startsWith('es') || loc === 'esp'
          ? 'Equipo editorial y análisis de mercado de AgroVentia.'
          : 'Market insights and supply chain perspectives from the AgroVentia team.',
      profileImage: '/agroventia-logo.jpg',
    },
  ];
};

export const getMockCategories = async (locale?: string): Promise<Category[]> => {
  const loc = (locale || 'en').toLowerCase().trim();

  if (loc.startsWith('fr')) {
    return [
      {
        _id: 'cat-spices',
        _owner: 'sanity',
        _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
        title: 'Épices et aromates',
        description: 'Gingembre, piment et poivre noir de qualité export.',
      },
      {
        _id: 'cat-oilseeds',
        _owner: 'sanity',
        _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
        title: 'Graines oléagineuses',
        description: 'Sésame blanc naturel et beurre de karité brut.',
      },
      {
        _id: 'cat-nuts',
        _owner: 'sanity',
        _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
        title: 'Noix et amandes',
        description: "Noix d'anacarde brutes en coque de premier choix.",
      },
      {
        _id: 'cat-botanicals',
        _owner: 'sanity',
        _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
        title: 'Plantes botaniques et médicinales',
        description: 'Noix de cola séchée, fleurs d’hibiscus et gomme arabique.',
      },
      {
        _id: 'cat-cocoa',
        _owner: 'sanity',
        _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
        title: 'Cacao et dérivés',
        description: 'Fèves de cacao fermentées traçables et éthiques.',
      },
      {
        _id: 'cat-tubers',
        _owner: 'sanity',
        _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
        title: 'Tubercules et céréales',
        description: 'Fécule de manioc raffinée et souchet comestible séché.',
      },
    ];
  }

  if (loc.startsWith('es') || loc === 'esp') {
    return [
      {
        _id: 'cat-spices',
        _owner: 'sanity',
        _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
        title: 'Especias y aromáticos',
        description: 'Jengibre, chiles secos y pimienta negra grado exportación.',
      },
      {
        _id: 'cat-oilseeds',
        _owner: 'sanity',
        _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
        title: 'Semillas oleaginosas',
        description: 'Semillas de sésamo blanco natural y manteca de karité pura.',
      },
      {
        _id: 'cat-nuts',
        _owner: 'sanity',
        _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
        title: 'Nueces y semillas comestibles',
        description: 'Nueces de anacardo crudas con cáscara de alto rendimiento.',
      },
      {
        _id: 'cat-botanicals',
        _owner: 'sanity',
        _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
        title: 'Productos botánicos y medicinales',
        description: 'Nuez de cola seca, flores de hibisco y goma arábiga.',
      },
      {
        _id: 'cat-cocoa',
        _owner: 'sanity',
        _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
        title: 'Cacao y derivados',
        description: 'Granos de cacao fermentados sostenibles y trazables.',
      },
      {
        _id: 'cat-tubers',
        _owner: 'sanity',
        _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
        title: 'Tubérculos y granos',
        description: 'Almidón de yuca refinado y chufas secas seleccionadas.',
      },
    ];
  }

  return [
    {
      _id: 'cat-spices',
      _owner: 'sanity',
      _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      title: 'Spices & Aromatics',
      description: 'Ginger, chili peppers, and export grade black pepper.',
    },
    {
      _id: 'cat-oilseeds',
      _owner: 'sanity',
      _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      title: 'Oilseeds',
      description: 'Natural white sesame seeds and unrefined shea butter.',
    },
    {
      _id: 'cat-nuts',
      _owner: 'sanity',
      _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      title: 'Nuts & Kernels',
      description: 'Raw cashew nuts in shell with high outturn yield.',
    },
    {
      _id: 'cat-botanicals',
      _owner: 'sanity',
      _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      title: 'Botanicals',
      description: 'Dried kolanut, dried hibiscus calyces, and gum arabic.',
    },
    {
      _id: 'cat-cocoa',
      _owner: 'sanity',
      _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      title: 'Cocoa & Derivatives',
      description: 'Premium fermented and dried traceable cocoa beans.',
    },
    {
      _id: 'cat-tubers',
      _owner: 'sanity',
      _createdDate: { $date: '2025-09-01T00:00:00.000Z' },
      _updatedDate: { $date: '2026-10-05T20:00:00.000Z' },
      title: 'Tubers & Grains',
      description: 'Industrial cassava starch, dried chips, and tiger nuts.',
    },
  ];
};

// ---------------------------------------------------------------------------
// Mock Products Section Intro & CTA Banner (en, fr, esp)
// ---------------------------------------------------------------------------

export const getMockProductsSectionContent = async (
  locale?: string
): Promise<ProductsSectionContent> => {
  const loc = (locale || 'en').toLowerCase().trim();

  if (loc.startsWith('fr')) {
    return {
      _id: 'productsSection',
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-21T13:19:21.561Z' },
      _updatedDate: { $date: '2026-10-06T00:00:00.000Z' },
      isActive: true,
      sectionTitle: 'Nos Produits de Première Qualité',
      sectionDescription:
        'Découvrez notre collection complète de produits agricoles de première qualité, rigoureusement sélectionnés pour leur fraîcheur et leur authenticité.',
      categoriesTitle: 'Catégories de Produits',
      categoriesSubtitle:
        'Explorez notre vaste gamme de denrées agricoles de premier choix provenant de nos partenaires certifiés.',
      searchPlaceholder: 'Rechercher des produits...',
      sectionImage: '/service-section.jpg',
      ctaBanner: {
        heading: 'Une Qualité Éprouvée. Un Approvisionnement Constant et Fiable.',
        description:
          "AgroVentia Inc. livre le meilleur des récoltes africaines avec constance, transparence et ponctualité. Chaque expédition est encadrée avec rigueur, professionnalisme et intégrité afin de soutenir l'expansion de votre entreprise. Devenez notre partenaire commercial en toute sérénité.",
        primaryButtonText: 'Demander le Catalogue des Produits',
        secondaryButtonText: 'Planifier un Entretien',
        isActive: true,
      },
    };
  }

  if (loc.startsWith('es') || loc === 'esp') {
    return {
      _id: 'productsSection',
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-21T13:19:21.561Z' },
      _updatedDate: { $date: '2026-10-06T00:00:00.000Z' },
      isActive: true,
      sectionTitle: 'Nuestros Productos de Primera Calidad',
      sectionDescription:
        'Explore nuestra colección completa de productos agrícolas de primera calidad, rigurosamente seleccionados por su frescura y autenticidad.',
      categoriesTitle: 'Categorías de Productos',
      categoriesSubtitle:
        'Descubra nuestra amplia gama de materias primas agrícolas de alta calidad provenientes de productores certificados.',
      searchPlaceholder: 'Buscar productos...',
      sectionImage: '/service-section.jpg',
      ctaBanner: {
        heading: 'Calidad Comprobada. Suministro Seguro y Confiable.',
        description:
          'AgroVentia Inc. suministra los mejores productos agrícolas africanos con constancia, transparencia y puntualidad. Cada cargamento se gestiona con rigurosa precisión, profesionalismo e integridad para que su empresa prospere. Asóciese con nosotros y crezca con total tranquilidad.',
        primaryButtonText: 'Solicitar Catálogo de Productos',
        secondaryButtonText: 'Programar una Llamada',
        isActive: true,
      },
    };
  }

  return {
    _id: 'productsSection',
    _owner: 'sanity',
    _createdDate: { $date: '2025-08-21T13:19:21.561Z' },
    _updatedDate: { $date: '2026-10-06T00:00:00.000Z' },
    isActive: true,
    sectionTitle: 'Our Premium Products',
    sectionDescription:
      'Explore our complete collection of premium agricultural products, carefully sourced and selected for quality and authenticity.',
    categoriesTitle: 'Product Categories',
    categoriesSubtitle:
      'Discover our comprehensive range of premium agricultural products sourced from trusted global partners.',
    searchPlaceholder: 'Search products...',
    sectionImage: '/service-section.jpg',
    ctaBanner: {
      heading: 'Quality You Can Trust. Supply You Can Rely On Always.',
      description:
        "AgroVentia Inc. delivers Africa's best consistently, transparently, and on time. Every shipment is managed with precision, professionalism, and integrity; so you can focus on scaling your business. Partner with us, and grow with confidence.",
      primaryButtonText: 'Request Product Catalog',
      secondaryButtonText: 'Schedule a Call',
      isActive: true,
    },
  };
};

// ---------------------------------------------------------------------------
// Mock Legal & Policy Pages (en, fr, esp)
// ---------------------------------------------------------------------------

export const getMockLegalPageBySlug = async (
  slug: string,
  locale?: string
): Promise<LegalPageContent | null> => {
  const loc = (locale || 'en').toLowerCase().trim();
  const cleanSlug = slug.toLowerCase().trim();

  const isFr = loc.startsWith('fr');
  const isEs = loc.startsWith('es') || loc === 'esp';

  if (cleanSlug === 'privacy-policy') {
    if (isFr) {
      return {
        _id: 'legal-privacy-policy',
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-20T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T00:00:00.000Z' },
        isActive: true,
        title: 'Politique de Confidentialité',
        slug: 'privacy-policy',
        lastUpdated: '2026-10-05',
        introduction:
          "AgroVentia Inc. (« nous », « notre » ou « nos ») exploite le site Web agroventia.ca. La présente politique explique nos pratiques relatives à la collecte, à l'utilisation et à la divulgation des données personnelles lorsque vous utilisez nos services.",
        sections: [
          {
            _key: 's1',
            sectionId: 'info-collection',
            heading: 'Collecte et Utilisation des Informations',
            content:
              "Nous recueillons plusieurs types de données à des fins variées afin de vous fournir et d'améliorer continuellement notre offre de services agricoles et commerciaux.",
            sortOrder: 1,
          },
          {
            _key: 's2',
            sectionId: 'personal-data',
            heading: 'Données Personnelles',
            content:
              "Lors de l'utilisation de nos formulaires ou demandes de catalogue, nous pouvons vous demander de fournir des coordonnées professionnelles vérifiables, notamment votre adresse courriel, votre nom complet, votre numéro de téléphone et les informations relatives à votre entreprise.",
            sortOrder: 2,
          },
          {
            _key: 's3',
            sectionId: 'usage-data',
            heading: "Données d'Utilisation et Témoins",
            content:
              "Nous recueillons des données techniques telles que les adresses IP, le type de navigateur, les pages visitées et la durée de navigation afin d'optimiser les performances de notre plateforme.",
            sortOrder: 3,
          },
          {
            _key: 's4',
            sectionId: 'pipeda-compliance',
            heading: 'Conformité Réglementaire et Droits (LPRPDE / Loi 25)',
            content:
              "Conformément aux lois canadiennes sur la protection des renseignements personnels (LPRPDE et Loi 25 du Québec), vous disposez d'un droit d'accès, de rectification et de retrait du consentement relatif à vos données personnelles en communiquant avec notre délégué à la protection des données.",
            sortOrder: 4,
          },
          {
            _key: 's5',
            sectionId: 'security',
            heading: 'Sécurité et Conservation des Données',
            content:
              "La sécurité de vos renseignements est une priorité absolue. Nous mettons en œuvre des mesures de protection physiques, organisationnelles et électroniques rigoureuses adaptées à la sensibilité des données traitées.",
            sortOrder: 5,
          },
        ],
        seoTitle: 'Politique de Confidentialité | AgroVentia Inc.',
        seoDescription:
          'Politique de confidentialité et protection des renseignements personnels d’AgroVentia Inc.',
      };
    }

    if (isEs) {
      return {
        _id: 'legal-privacy-policy',
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-20T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T00:00:00.000Z' },
        isActive: true,
        title: 'Política de Privacidad',
        slug: 'privacy-policy',
        lastUpdated: '2026-10-05',
        introduction:
          'AgroVentia Inc. opera el sitio web agroventia.ca. Esta página informa sobre nuestras directrices respecto a la recopilación, uso y divulgación de datos personales cuando utiliza nuestros servicios comerciales.',
        sections: [
          {
            _key: 's1',
            sectionId: 'info-collection',
            heading: 'Recopilación y Uso de la Información',
            content:
              'Recopilamos varios tipos de información comercial y técnica con el propósito de optimizar nuestro servicio y coordinar operaciones de exportación con la máxima eficiencia.',
            sortOrder: 1,
          },
          {
            _key: 's2',
            sectionId: 'personal-data',
            heading: 'Datos Personales',
            content:
              'Al solicitar catálogos o cotizaciones, podemos requerir información de contacto comercial verificable, incluyendo correo electrónico corporativo, nombre, teléfono y datos de registro mercantil de su empresa.',
            sortOrder: 2,
          },
          {
            _key: 's3',
            sectionId: 'usage-data',
            heading: 'Datos de Uso y Rastreo',
            content:
              'Podemos registrar datos técnicos sobre cómo se accede y utiliza el sitio web para mejorar continuamente nuestra infraestructura digital.',
            sortOrder: 3,
          },
          {
            _key: 's4',
            sectionId: 'pipeda-compliance',
            heading: 'Derechos del Titular y Cumplimiento Normativo',
            content:
              'Usted tiene derecho a acceder, rectificar o solicitar la supresión de sus datos personales conforme a los estándares de privacidad aplicables dirigiéndose a nuestro equipo de atención legal.',
            sortOrder: 4,
          },
          {
            _key: 's5',
            sectionId: 'security',
            heading: 'Seguridad de los Datos',
            content:
              'Adoptamos protocolos de seguridad técnica y organizativa para resguardar la confidencialidad e integridad de la información comercial recibida.',
            sortOrder: 5,
          },
        ],
        seoTitle: 'Política de Privacidad | AgroVentia Inc.',
        seoDescription:
          'Política de privacidad y protección de datos comerciales de AgroVentia Inc.',
      };
    }

    return {
      _id: 'legal-privacy-policy',
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-20T00:00:00.000Z' },
      _updatedDate: { $date: '2026-10-05T00:00:00.000Z' },
      isActive: true,
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      lastUpdated: '2026-10-05',
      introduction:
        'AgroVentia Inc. operates the agroventia.ca website. This page outlines our policies regarding the collection, use, and disclosure of personal data when you use our commercial service.',
      sections: [
        {
          _key: 's1',
          sectionId: 'info-collection',
          heading: 'Information Collection and Use',
          content:
            'We collect several different types of information for various purposes to provide and improve our service to you as an agricultural trade partner.',
          sortOrder: 1,
        },
        {
          _key: 's2',
          sectionId: 'personal-data',
          heading: 'Personal & Business Data',
          content:
            'While using our service or requesting catalog documents, we may ask you to provide contact information that can be used to contact or identify you, including email address, full name, phone number, and company credentials.',
          sortOrder: 2,
        },
        {
          _key: 's3',
          sectionId: 'usage-data',
          heading: 'Usage Data & Diagnostics',
          content:
            'We may also collect technical information on how the service is accessed and used, including IP address, browser type, pages viewed, and visit duration.',
          sortOrder: 3,
        },
        {
          _key: 's4',
          sectionId: 'pipeda-compliance',
          heading: 'Regulatory Compliance & Privacy Rights',
          content:
            'In accordance with Canadian privacy standards (PIPEDA and Quebec Law 25), you maintain the right to review, update, or withdraw consent for data handling by writing to our compliance officer.',
          sortOrder: 4,
        },
        {
          _key: 's5',
          sectionId: 'security',
          heading: 'Data Security & Retention',
          content:
            'The security of your trade data is important to us. We employ commercially acceptable security safeguards to prevent unauthorized access or disclosure.',
          sortOrder: 5,
        },
      ],
      seoTitle: 'Privacy Policy | AgroVentia Inc.',
      seoDescription: 'AgroVentia Inc. corporate privacy and data protection policy.',
    };
  }

  if (cleanSlug === 'terms-of-service') {
    if (isFr) {
      return {
        _id: 'legal-terms-of-service',
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-20T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T00:00:00.000Z' },
        isActive: true,
        title: "Conditions d'Utilisation",
        slug: 'terms-of-service',
        lastUpdated: '2026-10-05',
        introduction:
          "Bienvenue chez AgroVentia Inc. Les présentes conditions d'utilisation régissent l'accès et l'usage de notre plateforme Web et de nos services d'information commerciale.",
        sections: [
          {
            _key: 's1',
            sectionId: 'intro',
            heading: 'Introduction et Portée',
            content:
              "En accédant à nos services, vous acceptez d'être lié par les présentes conditions. Si vous refusez l'une quelconque de ces modalités, vous ne devez pas utiliser le service.",
            sortOrder: 1,
          },
          {
            _key: 's2',
            sectionId: 'commercial-accounts',
            heading: 'Relations Commerciales et Demandes de Devis',
            content:
              "Les demandes de devis, catalogues et propositions tarifaires constituent des invitations à négocier et ne représentent pas des offres contractuelles contraignantes avant l'émission d'un bon de commande formel signé par les deux parties.",
            sortOrder: 2,
          },
          {
            _key: 's3',
            sectionId: 'intellectual-property',
            heading: 'Propriété Intellectuelle',
            content:
              "Le contenu du site, incluant les logos, descriptions, photographies de commodités et spécifications de grade, demeure la propriété exclusive d'AgroVentia Inc. et de ses concédants.",
            sortOrder: 3,
          },
          {
            _key: 's4',
            sectionId: 'governing-law',
            heading: 'Lois Applicables et Juridiction',
            content:
              'Les présentes conditions sont régies et interprétées conformément aux lois de la province de l’Ontario et aux lois fédérales du Canada applicables.',
            sortOrder: 4,
          },
        ],
        seoTitle: "Conditions d'Utilisation | AgroVentia Inc.",
        seoDescription: "Conditions contractuelles d'utilisation de la plateforme AgroVentia Inc.",
      };
    }

    if (isEs) {
      return {
        _id: 'legal-terms-of-service',
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-20T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T00:00:00.000Z' },
        isActive: true,
        title: 'Términos de Servicio',
        slug: 'terms-of-service',
        lastUpdated: '2026-10-05',
        introduction:
          'Bienvenido a AgroVentia Inc. Estos términos de servicio regulan el uso de nuestro portal web y servicios de intercambio comercial.',
        sections: [
          {
            _key: 's1',
            sectionId: 'intro',
            heading: 'Introducción',
            content:
              'Al navegar en este sitio web, usted acepta someterse a estos términos de servicio. Si discrepa de algún punto, debe abstenerse de utilizar el portal.',
            sortOrder: 1,
          },
          {
            _key: 's2',
            sectionId: 'commercial-accounts',
            heading: 'Operaciones Comerciales y Cotizaciones',
            content:
              'Las solicitudes de catálogo y cotizaciones en línea tienen carácter orientativo para compras al por mayor y no configuran un compromiso de entrega hasta la firma del respectivo contrato mercantil.',
            sortOrder: 2,
          },
          {
            _key: 's3',
            sectionId: 'intellectual-property',
            heading: 'Propiedad Intelectual',
            content:
              'Todos los logotipos, textos comerciales, fotografías de materias primas y especificaciones son propiedad protegida de AgroVentia Inc.',
            sortOrder: 3,
          },
          {
            _key: 's4',
            sectionId: 'governing-law',
            heading: 'Ley Aplicable y Jurisdicción',
            content:
              'Estos términos se rigen conforme a las leyes vigentes en la provincia de Ontario y la legislación federal de Canadá.',
            sortOrder: 4,
          },
        ],
        seoTitle: 'Términos de Servicio | AgroVentia Inc.',
        seoDescription: 'Términos y condiciones legales de AgroVentia Inc.',
      };
    }

    return {
      _id: 'legal-terms-of-service',
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-20T00:00:00.000Z' },
      _updatedDate: { $date: '2026-10-05T00:00:00.000Z' },
      isActive: true,
      title: 'Terms of Service',
      slug: 'terms-of-service',
      lastUpdated: '2026-10-05',
      introduction:
        'Welcome to AgroVentia Inc. These Terms of Service govern your use of our corporate website and digital commerce inquiry facilities.',
      sections: [
        {
          _key: 's1',
          sectionId: 'intro',
          heading: 'Introduction',
          content:
            'By using our service, you agree to be bound by these terms. If you disagree with any part of these terms, you should discontinue use immediately.',
          sortOrder: 1,
        },
        {
          _key: 's2',
          sectionId: 'commercial-accounts',
          heading: 'Commercial Inquiries & Catalog Requests',
          content:
            'Catalog listings and online pricing inquiries represent non-binding trade showcases until formal sales orders and inspection certificates are executed between both parties.',
          sortOrder: 2,
        },
        {
          _key: 's3',
          sectionId: 'intellectual-property',
          heading: 'Intellectual Property Rights',
          content:
            'All text, graphics, logos, trade names, and product documentation displayed on this website are protected intellectual property of AgroVentia Inc.',
          sortOrder: 3,
        },
        {
          _key: 's4',
          sectionId: 'governing-law',
          heading: 'Governing Law and Jurisdiction',
          content:
            'These terms are governed in accordance with the laws of the Province of Ontario and the applicable federal laws of Canada.',
          sortOrder: 4,
        },
      ],
      seoTitle: 'Terms of Service | AgroVentia Inc.',
      seoDescription: 'Terms of Service governing AgroVentia Inc. corporate web platform.',
    };
  }

  if (cleanSlug === 'cookie-policy') {
    if (isFr) {
      return {
        _id: 'legal-cookie-policy',
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-20T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T00:00:00.000Z' },
        isActive: true,
        title: 'Politique Relative aux Témoins',
        slug: 'cookie-policy',
        lastUpdated: '2026-10-05',
        introduction:
          'La présente politique explique comment AgroVentia Inc. utilise les témoins (cookies) et technologies similaires pour reconnaître les visiteurs sur son site agroventia.ca et soutenir une expérience de navigation fluide.',
        sections: [
          {
            _key: 's1',
            sectionId: 'what-are-cookies',
            heading: 'Que sont les témoins?',
            content:
              'Les témoins sont de petits fichiers de données placés sur votre ordinateur ou appareil mobile lorsque vous visitez un site Web. Ils permettent de mémoriser vos préférences et de faciliter les sessions de consultation.',
            sortOrder: 1,
          },
          {
            _key: 's2',
            sectionId: 'why-cookies',
            heading: 'Pourquoi utilisons-nous des témoins?',
            content:
              "Nous utilisons des témoins essentiels pour le fonctionnement technique du site, ainsi que des témoins analytiques facultatifs afin de mesurer l'achalandage et d'améliorer la convivialité de nos services.",
            sortOrder: 2,
          },
          {
            _key: 's3',
            sectionId: 'cookie-types',
            heading: 'Types de témoins utilisés',
            content:
              'Notre site emploie des témoins strictement essentiels (gestion de session et consentement), des témoins de performance et analytiques, ainsi que des témoins de préférences de langue.',
            sortOrder: 3,
          },
          {
            _key: 's4',
            sectionId: 'managing-preferences',
            heading: 'Gestion de vos préférences',
            content:
              'Vous pouvez à tout moment activer ou désactiver les témoins non essentiels grâce au module interactif de préférences disponible sur cette page ou par les paramètres de votre navigateur.',
            sortOrder: 4,
          },
        ],
        seoTitle: 'Politique Relative aux Témoins | AgroVentia Inc.',
        seoDescription:
          'Politique et gestion des témoins de navigation sur le site AgroVentia Inc.',
      };
    }

    if (isEs) {
      return {
        _id: 'legal-cookie-policy',
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-20T00:00:00.000Z' },
        _updatedDate: { $date: '2026-10-05T00:00:00.000Z' },
        isActive: true,
        title: 'Política de Cookies',
        slug: 'cookie-policy',
        lastUpdated: '2026-10-05',
        introduction:
          'Esta Política de Cookies detalla cómo AgroVentia Inc. utiliza cookies y tecnologías análogas para identificar a los usuarios en agroventia.ca y mejorar su experiencia en el portal.',
        sections: [
          {
            _key: 's1',
            sectionId: 'what-are-cookies',
            heading: '¿Qué son las cookies?',
            content:
              'Las cookies son pequeños archivos de datos que se alojan en su equipo o dispositivo móvil al visitar un sitio web para recordar preferencias y optimizar la navegación.',
            sortOrder: 1,
          },
          {
            _key: 's2',
            sectionId: 'why-cookies',
            heading: '¿Por qué utilizamos cookies?',
            content:
              'Empleamos cookies indispensables para el correcto funcionamiento técnico de la página y cookies analíticas para evaluar el rendimiento comercial de la plataforma.',
            sortOrder: 2,
          },
          {
            _key: 's3',
            sectionId: 'cookie-types',
            heading: 'Categorías de cookies empleadas',
            content:
              'Utilizamos cookies técnicas obligatorias, cookies de analítica web y cookies de personalización de idioma y región.',
            sortOrder: 3,
          },
          {
            _key: 's4',
            sectionId: 'managing-preferences',
            heading: 'Control de preferencias',
            content:
              'Puede modificar sus preferencias en cualquier momento mediante el panel de configuración de esta página o configurando su navegador web.',
            sortOrder: 4,
          },
        ],
        seoTitle: 'Política de Cookies | AgroVentia Inc.',
        seoDescription: 'Información y configuración de cookies en AgroVentia Inc.',
      };
    }

    return {
      _id: 'legal-cookie-policy',
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-20T00:00:00.000Z' },
      _updatedDate: { $date: '2026-10-05T00:00:00.000Z' },
      isActive: true,
      title: 'Cookie Policy',
      slug: 'cookie-policy',
      lastUpdated: '2026-10-05',
      introduction:
        'This Cookie Policy explains how AgroVentia Inc. uses cookies and related technologies to recognize you when you visit our website at agroventia.ca.',
      sections: [
        {
          _key: 's1',
          sectionId: 'what-are-cookies',
          heading: 'What are cookies?',
          content:
            'Cookies are small data files placed on your computer or mobile device when you visit a website. They are widely used to ensure websites function properly and to remember preferences.',
          sortOrder: 1,
        },
        {
          _key: 's2',
          sectionId: 'why-cookies',
          heading: 'Why do we use cookies?',
          content:
            'We use first-party essential cookies for core technical functionality and optional third-party analytics cookies to observe visitor traffic and improve digital services.',
          sortOrder: 2,
        },
        {
          _key: 's3',
          sectionId: 'cookie-types',
          heading: 'Types of cookies we use',
          content:
            'We use strictly essential technical cookies, performance and diagnostic cookies, and functional cookies for language selection.',
          sortOrder: 3,
        },
        {
          _key: 's4',
          sectionId: 'managing-preferences',
          heading: 'Managing your preferences',
          content:
            'You have full control over non-essential cookies. You can accept, reject, or customize your settings using the preference toggles below.',
          sortOrder: 4,
        },
      ],
      seoTitle: 'Cookie Policy | AgroVentia Inc.',
      seoDescription: 'Cookie policy and preference configuration for AgroVentia Inc.',
    };
  }

  return null;
};

// ---------------------------------------------------------------------------
// Generic Fallback Helpers
// ---------------------------------------------------------------------------

export const getFallbackContent = async <T>(
  contentType: string,
  isEmergency: boolean = false
): Promise<T[]> => {
  switch (contentType.toLowerCase()) {
    case 'hero':
      return (await getMockHeroContent()) as unknown as T[];
    case 'about':
      return (await getMockAboutContent()) as unknown as T[];
    case 'services':
      return (await getMockServicesContent()) as unknown as T[];
    case 'products':
      return (await getMockProductsContent()) as unknown as T[];
    case 'contact':
      return (await getMockContactContent()) as unknown as T[];
    default:
      console.warn(`No fallback content available for type: ${contentType}`);
      return [];
  }
};

export const getEmergencyContent = <T>(): T => {
  return {
    title: 'AgroVentia - Agricultural Solutions',
    description:
      'We are currently experiencing technical difficulties. Please try again later or contact us directly.',
    fallbackMessage: 'Content temporarily unavailable',
  } as T;
};
