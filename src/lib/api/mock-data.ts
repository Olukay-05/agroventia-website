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
} from '@/types/wix';

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

  if (loc.startsWith('fr')) {
    return [
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
    ];
  }

  if (loc.startsWith('es') || loc === 'esp') {
    return [
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
    ];
  }

  return [
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
  ];
};


export const getMockProductCatalogContent = async (locale?: string): Promise<ProductCatalogItem[]> => {
  const products = await getMockProductsContent(locale);
  return products.map(p => ({
    ...p,
    productName: p.title,
    allProducts: [],
  }));
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

  const title =
    loc.startsWith('fr')
      ? 'Faire le pont entre les industries avec des produits agricoles de qualité'
      : loc.startsWith('es') || loc === 'esp'
        ? 'Uniendo industrias con productos agrícolas prémium'
        : 'Bridging Industries with Premium Produce';

  const excerpt =
    loc.startsWith('fr')
      ? "Découvrez comment l'approvisionnement éthique transforme le commerce agricole entre l'Afrique de l'Ouest et les marchés mondiaux."
      : loc.startsWith('es') || loc === 'esp'
        ? 'Descubra cómo el abastecimiento ético transforma el comercio agrícola entre África Occidental y los mercados globales.'
        : 'Explore how ethical sourcing transforms agricultural trade between West Africa and global markets.';

  return [
    {
      _id: 'mock-post-1',
      _owner: 'sanity',
      _createdDate: { $date: '2025-09-01T10:00:00.000Z' },
      _updatedDate: { $date: '2026-10-04T12:00:00.000Z' },
      title,
      slug: 'bridging-industries-with-premium-produce',
      excerpt,
      content:
        '<p>At AgroVentia, our commitment to consistent quality and ethical partnerships ensures seamless agricultural sourcing across continents.</p>',
      coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
      publishedDate: '2025-09-01T10:00:00.000Z',
      author: 'AgroVentia Editorial',
      categories: [
        {
          _id: 'cat-1',
          _owner: 'sanity',
          _createdDate: { $date: '2025-09-01T10:00:00.000Z' },
          _updatedDate: { $date: '2026-10-04T12:00:00.000Z' },
          title: 'Industry Insights',
          description: 'Updates on global agricultural trade and supply chains.',
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
