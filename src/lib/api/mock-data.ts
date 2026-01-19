// lib/api/mock-data.ts
import type {
  HeroContent,
  AboutContent,
  ServiceContent,
  ProductContent,
  ContactContent,
} from '@/types/wix';

/**
 * Determines if mock data should be used instead of real Wix API calls
 */
export const shouldUseMockData = (): boolean => {
  // Use mock data in development if Wix credentials are not configured
  const isDevelopment = process.env.NODE_ENV === 'development';

  // For client-side, we can only check public variables
  const isClientSide = typeof window !== 'undefined';

  if (isClientSide) {
    // Client-side can only access NEXT_PUBLIC_ variables
    const hasClientCredentials = !!process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
    // In development, use mock data if credentials are missing
    // In production, only use mock data if explicitly requested (for testing)
    return isDevelopment
      ? !hasClientCredentials
      : !!process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  } else {
    // Server-side can access both public and private variables
    const hasWixCredentials = !!(
      process.env.NEXT_PUBLIC_WIX_CLIENT_ID && process.env.WIX_API_TOKEN
    );
    // In development, use mock data if credentials are missing
    // In production, only use mock data if explicitly requested (for testing)
    return isDevelopment
      ? !hasWixCredentials
      : !!process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  }
};

/**
 * Logs when fallback content is being used
 */
export const logFallbackUsage = (contentType: string, reason: string): void => {
  console.warn(`Using fallback content for ${contentType}: ${reason}`);
};

/**
 * Mock Hero Content - matches exact Wix structure
 */
export const getMockHeroContent = async (locale?: string): Promise<HeroContent[]> => {
  if (locale?.startsWith('fr')) {
    return [
      {
        _id: '113d7e91-1b4e-4dfd-97a7-679c42f40118',
        title: "Imports Agricoles Premium d'Afrique de l'Ouest",
        subtitle: 'Connecter les Marchés Mondiaux avec des Produits Agricoles de Qualité',
        description:
          "AgroVentia Inc. se spécialise dans l'importation de produits agricoles de haute qualité, notamment la noix de cola, le gingembre, l'hibiscus, le cacao et plus encore, provenant de sources ouest-africaines de confiance.</p>",
        backgroundImage:
          'wix:image://v1/nsplsh_559a94c786044333bcfc26ccb4be438b~mv2.jpg/Image%20by%20James%20Baltz.jpg#originWidth=5464&originHeight=3070',
        companyLogo:
          'wix:image://v1/a3b8a8_425766322d194e70817446fa58efb113~mv2.jpg/agroventia-logo.jpg#originWidth=1536&originHeight=1024',
        ctaPrimary: 'Explorer les Produits',
        ctaSecondary: 'Contactez-nous',
        isActive: true,
        _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
        _createdDate: { $date: '2025-08-21T13:19:21.561Z' },
        _updatedDate: { $date: '2025-08-25T14:18:55.254Z' },
      },
    ];
  }
  return [
    {
      _id: '113d7e91-1b4e-4dfd-97a7-679c42f40118',
      title: 'Premium Agricultural Imports from West Africa',
      subtitle: 'Connecting Global Markets with Quality Agricultural Products',
      description:
        'AgroVentia Inc. specializes in importing high-quality agricultural products including kolanut, ginger, hibiscus, cocoa, and more from trusted West African sources.</p>',
      backgroundImage:
        'wix:image://v1/nsplsh_559a94c786044333bcfc26ccb4be438b~mv2.jpg/Image%20by%20James%20Baltz.jpg#originWidth=5464&originHeight=3070',
      companyLogo:
        'wix:image://v1/a3b8a8_425766322d194e70817446fa58efb113~mv2.jpg/agroventia-logo.jpg#originWidth=1536&originHeight=1024',
      ctaPrimary: 'Explore Products',
      ctaSecondary: 'Contact Us',
      isActive: true,
      _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
      _createdDate: { $date: '2025-08-21T13:19:21.561Z' },
      _updatedDate: { $date: '2025-08-25T14:18:55.254Z' },
    },
  ];
};

/**
 * Mock About Content - matches exact Wix structure
 */
export const getMockAboutContent = async (locale?: string): Promise<AboutContent[]> => {
  if (locale?.startsWith('fr')) {
    return [
      {
        _id: '1a26a2a6-3512-48c1-99ec-3e469d12d725',
        sectionTitle: "À Propos d'AgroVentia Inc.",
        mission:
          "Livrer des produits agricoles de première qualité, d'origine éthique, dans le monde entier, en garantissant qualité, fiabilité et durabilité à chaque transaction.",
        vision:
          "Devenir la principale passerelle mondiale vers les meilleurs produits agricoles d'Afrique en supprimant les barrières, en favorisant la confiance et en stimulant une croissance durable pour les acheteurs internationaux et les producteurs africains.",
        story:
          "AgroVentia Inc. est une entreprise canadienne avec de profondes racines africaines, établie pour connecter les marchés mondiaux avec des produits agricoles de haute qualité. Notre équipe de direction combine une vaste expertise en gestion d'entreprise, en conseil et en commerce mondial, avec plus d'une décennie d'expérience directe dans l'importation et l'exportation de produits agricoles.&nbsp;</p> <p class=\"font_8\"><br></p> <p class=\"font_8\">AgroVentia a été créée avec un seul objectif : offrir aux acheteurs internationaux un moyen fiable et simple d'accéder aux meilleurs produits agricoles d'Afrique. Chaque expédition porte notre engagement envers la qualité, la transparence et la livraison à temps, afin que vous puissiez vous approvisionner en toute confiance et vous concentrer sur la croissance de votre entreprise.</p> <p class=\"font_8\"><br></p> <p class=\"font_8\">Chez AgroVentia, nous privilégions la qualité, l'approvisionnement éthique, la confiance des clients et la valeur à long terme plutôt que les gains à court terme. Chaque transaction, quelle que soit son ampleur, est traitée avec les normes professionnelles et éthiques les plus élevées.</p> <p class=\"font_8\">Grâce à des partenariats solides et à une chaîne d'approvisionnement durable à travers l'Afrique, nous offrons cohérence et confiance. Notre objectif n'est pas seulement d'être un fournisseur, mais un partenaire à long terme pour vous aider à atteindre vos objectifs d'approvisionnement et à offrir l'excellence à vos clients grâce à un commerce transparent et fiable.</p> <p class=\"font_8\"><br></p>",
        headquarters: 'Toronto, CA',
        foundingYear: '2025',
        certifications: 'ISO 14001, LEED Gold',
        aboutImage:
          'wix:image://v1/nsplsh_727008106eb04e258eb94d797b68341b~mv2.jpg/Image%20by%20imsogabriel%20stock.jpg#originWidth=4501&originHeight=3376',
        isActive: true,
        _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
        _createdDate: { $date: '2025-08-21T14:40:20.146Z' },
        _updatedDate: { $date: '2025-08-26T23:43:18.102Z' },
        coreValues: [
          {
            _id: '85b1197b-d538-43e7-879b-21003ec8aaab',
            reference: '1a26a2a6-3512-48c1-99ec-3e469d12d725',
            title: "Qualité d'Abord",
            description:
              'Livrer des produits agricoles prémium et constants à chaque fois.</p>',
            isActive: true,
            _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
            _createdDate: { $date: '2025-08-21T16:49:51.374Z' },
            _updatedDate: { $date: '2025-08-25T15:17:51.269Z' },
          },
          {
            _id: '4ab83339-fd43-4466-b0d4-e45a88bb49db',
            reference: '1a26a2a6-3512-48c1-99ec-3e469d12d725',
            title: 'Approvisionnement Éthique',
            description:
              'Partenariat avec des agriculteurs africains vérifiés pour assurer durabilité et équité.',
            isActive: true,
            _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
            _createdDate: { $date: '2025-08-21T16:49:51.373Z' },
            _updatedDate: { $date: '2025-08-22T16:04:49.828Z' },
          },
          {
            _id: '4da26982-fc4c-45c3-b0bb-10084b7273f0',
            reference: '1a26a2a6-3512-48c1-99ec-3e469d12d725',
            title: 'Confiance & Transparence',
            description:
              'Communication claire et responsabilité dans chaque transaction.',
            isActive: true,
            _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
            _createdDate: { $date: '2025-08-21T16:49:51.372Z' },
            _updatedDate: { $date: '2025-08-22T16:04:53.161Z' },
          },
          {
            _id: '226a834a-7dc8-408d-8a48-9d32a043813e',
            reference: '1a26a2a6-3512-48c1-99ec-3e469d12d725',
            title: 'Fiabilité',
            description:
              'Service transparent, opportun et fiable, à toute échelle, à chaque expédition.</p>',
            isActive: true,
            _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
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
        "To become the leading global gateway to Africa's finest agricultural products by removing barriers, fostering trust, and driving sustainable growth for international buyers and African producers alike. ",
      story:
        'AgroVentia Inc. is a Canadian company with deep African roots, established to connect global markets with high-quality agricultural products. Our leadership team combines extensive expertise in business management, consulting, and global trade, with over a decade of direct experience in the import and export of agricultural produce.&nbsp;</p> <p class="font_8"><br></p> <p class="font_8">AgroVentia was created with one goal: to give international buyers a reliable, straightforward way to access Africa\'s finest agricultural products. Every shipment carries our commitment to quality, transparency, and on-time delivery, so you can source with confidence and focus on growing your business.</p> <p class="font_8"><br></p> <p class="font_8">At AgroVentia, we prioritize quality, ethical sourcing, customer trust, and long-term value over short-term gains. Every transaction, regardless of scale, is handled with the highest professional and ethical standards.</p> <p class="font_8">Through strong partnerships and a sustainable supply chain across Africa, we deliver consistency and trust. Our goal is not just to be a supplier, but a long-term partner in helping you achieve your sourcing objectives and deliver excellence to your customers through seamless, dependable trade.</p> <p class="font_8"><br></p>',
      headquarters: 'Toronto, CA',
      foundingYear: '2025',
      certifications: 'ISO 14001, LEED Gold',
      aboutImage:
        'wix:image://v1/nsplsh_727008106eb04e258eb94d797b68341b~mv2.jpg/Image%20by%20imsogabriel%20stock.jpg#originWidth=4501&originHeight=3376',
      isActive: true,
      _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
      _createdDate: { $date: '2025-08-21T14:40:20.146Z' },
      _updatedDate: { $date: '2025-08-26T23:43:18.102Z' },
      coreValues: [
        {
          _id: '85b1197b-d538-43e7-879b-21003ec8aaab',
          reference: '1a26a2a6-3512-48c1-99ec-3e469d12d725',
          title: 'Quality First',
          description:
            'Delivering premium, consistent agricultural products every time.</p>',
          isActive: true,
          _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
          _createdDate: { $date: '2025-08-21T16:49:51.374Z' },
          _updatedDate: { $date: '2025-08-25T15:17:51.269Z' },
        },
        {
          _id: '4ab83339-fd43-4466-b0d4-e45a88bb49db',
          reference: '1a26a2a6-3512-48c1-99ec-3e469d12d725',
          title: 'Ethical Sourcing',
          description:
            'Partnering with vetted African farmers to ensure sustainability and fairness.',
          isActive: true,
          _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
          _createdDate: { $date: '2025-08-21T16:49:51.373Z' },
          _updatedDate: { $date: '2025-08-22T16:04:49.828Z' },
        },
        {
          _id: '4da26982-fc4c-45c3-b0bb-10084b7273f0',
          reference: '1a26a2a6-3512-48c1-99ec-3e469d12d725',
          title: 'Trust & Transparency',
          description:
            'Clear communication and accountability in every transaction.',
          isActive: true,
          _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
          _createdDate: { $date: '2025-08-21T16:49:51.372Z' },
          _updatedDate: { $date: '2025-08-22T16:04:53.161Z' },
        },
        {
          _id: '226a834a-7dc8-408d-8a48-9d32a043813e',
          reference: '1a26a2a6-3512-48c1-99ec-3e469d12d725',
          title: 'Reliability',
          description:
            'Seamless, timely, and dependable service, every scale, every shipment.</p>',
          isActive: true,
          _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
          _createdDate: { $date: '2025-08-21T16:49:51.371Z' },
          _updatedDate: { $date: '2025-08-25T15:17:56.704Z' },
        },
      ],
    },
  ];
};

/**
 * Mock Services Content - matches exact Wix structure
 */
export const getMockServicesContent = async (locale?: string): Promise<ServiceContent[]> => {
  if (locale?.startsWith('fr')) {
    return [
      {
        _id: 'e9f4cafe-e0c3-4763-8de5-8c442a28f654',
        sectionTitle: 'Nos Services',
        sectionDescription:
          '<p class="font_8">Services complets d\'importation agricole connectant les producteurs ouest-africains avec les marchés mondiaux grâce à une gestion fiable de la chaîne d\'approvisionnement.</p>',
        importServices:
          '<p class="font_8">Approvisionnement direct auprès de fournisseurs ouest-africains vérifiés, expédition en vrac et par conteneurs, assistance au dédouanement</p>',
        customSourcing:
          'Recherche de produits spécialisés, tarification basée sur le volume, planification de la disponibilité saisonnière, options d\'emballage personnalisé',
        qualityAssurance:
          'Tests de qualité rigoureux, vérification de la certification biologique, dépistage de la contamination, garanties de fraîcheur',
        logistics:
          'Expédition sous température contrôlée, horaires de livraison flexibles, suivi et surveillance, gestion des stocks',
        documentation:
          'Documentation de conformité complète, certificats d\'origine, certificats sanitaires, déclarations en douane',
        servicesImage:
          'wix:image://v1/a3b8a8_425766322d194e70817446fa58efb113~mv2.jpg/agroventia-logo.jpg#originWidth=1536&originHeight=1024',
        isActive: true,
        _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
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
        '<p class="font_8">Comprehensive agricultural import services connecting West African producers with global markets through reliable supply chain management.</p>',
      importServices:
        '<p class="font_8">Direct sourcing from verified West African suppliers, bulk and container shipping, customs clearance assistance</p>',
      customSourcing:
        'Specialized product sourcing, volume-based pricing, seasonal availability planning, custom packaging options',
      qualityAssurance:
        'Rigorous quality testing, organic certification verification, contamination screening, freshness guarantees',
      logistics:
        'Temperature-controlled shipping, flexible delivery schedules, tracking and monitoring, inventory management',
      documentation:
        'Complete compliance documentation, certificates of origin, health certificates, customs declarations',
      servicesImage:
        'wix:image://v1/a3b8a8_425766322d194e70817446fa58efb113~mv2.jpg/agroventia-logo.jpg#originWidth=1536&originHeight=1024',
      isActive: true,
      _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
      _createdDate: { $date: '2025-08-22T18:38:22.040Z' },
      _updatedDate: { $date: '2025-08-28T11:06:25.477Z' },
    },
  ];
};

/**
 * Mock Products Content - matches exact Wix structure
 */
export const getMockProductsContent = async (locale?: string): Promise<ProductContent[]> => {
  if (locale?.startsWith('fr')) {
    return [
      {
        _id: '98abb64d-29c3-48bf-8ae3-3f1b78320bec',
        title: 'Noix de Cola Séchée',
        description:
          'Noix de cola séchée de qualité supérieure, soigneusement récoltée et séchée au soleil pour préserver sa saveur naturelle et ses propriétés riches en caféine. Idéal pour les boissons, les produits nutraceutiques et les usages culturels.',
        category: 'Boissons et Extraits Agricoles',
        image1:
          'wix:image://v1/nsplsh_378c0b5c023448ff85735ec9a661676f~mv2.jpg/Image%20by%20Haberdoedas.jpg#originWidth=10498&originHeight=7453',
        _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
        _createdDate: { $date: '2025-08-22T15:44:46.755Z' },
        _updatedDate: { $date: '2025-08-25T22:04:22.326Z' },
      },
      {
        _id: 'ead87c49-3761-4eb1-ba61-076dddcafc92',
        title: 'Noix de Cola Fraîche',
        description:
          'Noix de cola fraîche, cueillie à la main, avec un arôme naturel complet et une grande puissance. Parfait pour les applications culinaires, culturelles et les boissons.',
        category: 'Boissons et Extraits Agricoles',
        image1:
          'wix:image://v1/nsplsh_8c970a30dcf5449c88a6f2dbdff92708~mv2.jpg/Image%20by%20Katharina.jpg#originWidth=6000&originHeight=4000',
        _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
        _createdDate: { $date: '2025-08-22T15:44:46.754Z' },
        _updatedDate: { $date: '2025-08-25T22:04:22.326Z' },
      },
      {
        _id: '8d761993-db3f-4ea6-aedd-be09106242cb',
        title: 'Gingembre Séché',
        description:
          'Gingembre séché au soleil, aromatique, avec une saveur riche et un piquant naturel. Parfait pour les usages culinaires, médicinaux et les boissons.',
        category: 'Racines et Épices',
        image1:
          'wix:image://v1/nsplsh_96ca78c323434a119c0f9b153fd64609~mv2.jpg/Image%20by%20Dmytro%20Glazunov.jpg#originWidth=6000&originHeight=3376',
        _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
        _createdDate: { $date: '2025-08-22T15:44:46.753Z' },
        _updatedDate: { $date: '2025-08-25T22:04:22.326Z' },
      },
    ];
  }
  return [
    {
      _id: '98abb64d-29c3-48bf-8ae3-3f1b78320bec',
      title: 'Dried Kolanut',
      description:
        'Premium dried kolanut, carefully harvested and sun-dried to preserve its natural flavor and caffeine-rich properties. Ideal for beverages, nutraceuticals, and cultural uses.',
      category: 'Agricultural Beverages & Extracts',
      image1:
        'wix:image://v1/nsplsh_378c0b5c023448ff85735ec9a661676f~mv2.jpg/Image%20by%20Haberdoedas.jpg#originWidth=10498&originHeight=7453',
      _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
      _createdDate: { $date: '2025-08-22T15:44:46.755Z' },
      _updatedDate: { $date: '2025-08-25T22:04:22.326Z' },
    },
    {
      _id: 'ead87c49-3761-4eb1-ba61-076dddcafc92',
      title: 'Fresh Kolanut',
      description:
        'Fresh, handpicked kolanut with full natural aroma and potency. Perfect for culinary, cultural, and beverage applications.',
      category: 'Agricultural Beverages & Extracts',
      image1:
        'wix:image://v1/nsplsh_8c970a30dcf5449c88a6f2dbdff92708~mv2.jpg/Image%20by%20Katharina.jpg#originWidth=6000&originHeight=4000',
      _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
      _createdDate: { $date: '2025-08-22T15:44:46.754Z' },
      _updatedDate: { $date: '2025-08-25T22:04:22.326Z' },
    },
    {
      _id: '8d761993-db3f-4ea6-aedd-be09106242cb',
      title: 'Dried Ginger',
      description:
        'Aromatic, sun-dried ginger with rich flavor and natural pungency. Perfect for culinary, medicinal, and beverage uses.',
      category: 'Roots & Spices',
      image1:
        'wix:image://v1/nsplsh_96ca78c323434a119c0f9b153fd64609~mv2.jpg/Image%20by%20Dmytro%20Glazunov.jpg#originWidth=6000&originHeight=3376',
      _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
      _createdDate: { $date: '2025-08-22T15:44:46.753Z' },
      _updatedDate: { $date: '2025-08-25T22:04:22.326Z' },
    },
  ];
};

/**
 * Mock Contact Content - matches exact Wix structure
 */
export const getMockContactContent = async (locale?: string): Promise<ContactContent[]> => {
  if (locale?.startsWith('fr')) {
    return [
      {
        _id: '8db43fe2-adac-40cd-b90e-41909fd6beb4',
        sectionTitle: 'Contactez-nous',
        sectionDescription:
          '<p class="font_8">Prêt à discuter de vos besoins en produits ? Contactez notre équipe pour un service personnalisé et des prix compétitifs.</p>',
        businessEmail: 'info@agroventia.ca',
        businessPhone: '+1 (403) 477-6059',
        businessAddress: '403 - 65 Mutual Street, Toronto, M5B 0E5',
        businessHours:
          'Lundi - Vendredi: 8:00 - 18:00 EST Samedi: 9:00 - 14:00 EST Dimanche: Fermé',
        responseTime: '24 heures pour toutes les demandes',
        socialLinks:
          'LinkedIn: /company/agroventia Twitter: @agroventia Facebook: /agroventiainc',
        contactImage:
          'wix:image://v1/nsplsh_af43421e30ce4856a7bc199e4f3cbab1~mv2.jpg/Image%20by%20Mathyas%20Kurmann.jpg#originWidth=5847&originHeight=3898',
        isActive: true,
        _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
        _createdDate: { $date: '2025-08-23T07:20:09.970Z' },
        _updatedDate: { $date: '2025-08-26T23:44:10.634Z' },
      },
    ];
  }
  return [
    {
      _id: '8db43fe2-adac-40cd-b90e-41909fd6beb4',
      sectionTitle: 'Get In Touch',
      sectionDescription:
        '<p class="font_8">Ready to discuss your product needs? Contact our team for personalized service and competitive pricing.</p>',
      businessEmail: 'info@agroventia.ca',
      businessPhone: '+1 (403) 477-6059',
      businessAddress: '403 - 65 Mutual Street, Toronto, M5B 0E5',
      businessHours:
        'Monday - Friday: 8:00 AM - 6:00 PM EST Saturday: 9:00 AM - 2:00 PM EST Sunday: Closed',
      responseTime: '24 hours for all inquiries',
      socialLinks:
        'LinkedIn: /company/agroventia Twitter: @agroventia Facebook: /agroventiainc',
      contactImage:
        'wix:image://v1/nsplsh_af43421e30ce4856a7bc199e4f3cbab1~mv2.jpg/Image%20by%20Mathyas%20Kurmann.jpg#originWidth=5847&originHeight=3898',
      isActive: true,
      _owner: 'a3b8a8da-383d-4f87-ade8-a9def3277b58',
      _createdDate: { $date: '2025-08-23T07:20:09.970Z' },
      _updatedDate: { $date: '2025-08-26T23:44:10.634Z' },
    },
  ];
};

/**
 * Generic fallback content generator
 */
export const getFallbackContent = async <T>(
  contentType: string,
  isEmergency: boolean = false
): Promise<T[]> => {
  const emergencyPrefix = isEmergency ? 'Emergency Fallback: ' : 'Fallback: ';

  switch (contentType.toLowerCase()) {
    case 'hero':
      return [
        {
          _id: `fallback-hero-${Date.now()}`,
          title: `${emergencyPrefix}Premium Agricultural Imports from West Africa`,
          subtitle:
            'Connecting Global Markets with Quality Agricultural Products',
          description:
            'AgroVentia Inc. specializes in importing high-quality agricultural products including kolanut, ginger, hibiscus, cocoa, and more from trusted West African sources.',
          backgroundImage: '/images/fallback-hero.jpg',
          ctaPrimary: 'Explore Products',
          ctaSecondary: 'Contact Us',
          isActive: true,
          _owner: 'fallback-owner',
          _createdDate: { $date: new Date().toISOString() },
          _updatedDate: { $date: new Date().toISOString() },
        },
      ] as T[];

    case 'about':
      return [
        {
          _id: `fallback-about-${Date.now()}`,
          sectionTitle: `${emergencyPrefix}About AgroVentia Inc.`,
          mission:
            'To deliver premium, ethically sourced agricultural products worldwide.',
          vision:
            "To become the leading global gateway to Africa's finest agricultural products.",
          story:
            'AgroVentia Inc. is a Canadian company with deep African roots, established to connect global markets with high-quality agricultural products.',
          headquarters: 'Toronto, CA',
          foundingYear: '2025',
          certifications: 'ISO 14001, LEED Gold',
          aboutImage: '/images/fallback-about.jpg',
          isActive: true,
          _owner: 'fallback-owner',
          _createdDate: { $date: new Date().toISOString() },
          _updatedDate: { $date: new Date().toISOString() },
          coreValues: [],
        },
      ] as T[];

    case 'services':
      return [
        {
          _id: `fallback-service-${Date.now()}`,
          sectionTitle: `${emergencyPrefix}Our Services`,
          sectionDescription:
            'Comprehensive agricultural import services connecting West African producers with global markets.',
          importServices:
            'Direct sourcing from verified West African suppliers, bulk and container shipping.',
          customSourcing:
            'Specialized product sourcing, volume-based pricing, seasonal availability planning.',
          qualityAssurance:
            'Rigorous quality testing, organic certification verification.',
          logistics:
            'Temperature-controlled shipping, flexible delivery schedules.',
          documentation:
            'Complete compliance documentation, certificates of origin.',
          servicesImage: '/images/fallback-services.jpg',
          isActive: true,
          _owner: 'fallback-owner',
          _createdDate: { $date: new Date().toISOString() },
          _updatedDate: { $date: new Date().toISOString() },
        },
      ] as T[];

    case 'products':
      return [
        {
          _id: `fallback-product-${Date.now()}`,
          title: `${emergencyPrefix}Premium Agricultural Products`,
          description:
            'High-quality agricultural products sourced directly from West Africa.',
          category: 'General',
          image1: '/images/fallback-product.jpg',
          _owner: 'fallback-owner',
          _createdDate: { $date: new Date().toISOString() },
          _updatedDate: { $date: new Date().toISOString() },
        },
      ] as T[];

    case 'contact':
      return [
        {
          _id: `fallback-contact-${Date.now()}`,
          sectionTitle: `${emergencyPrefix}Get In Touch`,
          sectionDescription:
            'Ready to discuss your product needs? Contact our team for personalized service.',
          businessEmail: 'info@agroventia.ca',
          businessPhone: '+1 (403) 477-6059',
          businessAddress: '403 - 65 Mutual Street, Toronto, M5B 0E5',
          businessHours: 'Monday - Friday: 8:00 AM - 6:00 PM EST',
          responseTime: '24 hours for all inquiries',
          socialLinks: 'LinkedIn: /company/agroventia Twitter: @agroventia',
          contactImage: '/images/fallback-contact.jpg',
          isActive: true,
          _owner: 'fallback-owner',
          _createdDate: { $date: new Date().toISOString() },
          _updatedDate: { $date: new Date().toISOString() },
        },
      ] as T[];

    default:
      console.warn(`No fallback content available for type: ${contentType}`);
      return [];
  }
};

/**
 * Emergency content when all else fails
 */
export const getEmergencyContent = <T>(): T => {
  return {
    title: 'AgroVentia - Agricultural Solutions',
    description:
      'We are currently experiencing technical difficulties. Please try again later or contact us directly.',
    fallbackMessage: 'Content temporarily unavailable',
  } as T;
};
