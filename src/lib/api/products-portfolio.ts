// src/lib/api/products-portfolio.ts
/**
 * Canonical 46+ Commodity Portfolio for AgroVentia Inc. (CAP-9)
 * Represents both core trade corridors:
 * - Canadian Prairies & Eastern Canada (33 commodities from docs/products.md)
 * - Tropical & West Africa (13 commodities from semantic studio assets)
 *
 * Adheres strictly to CAP-7 anti-slop rules, no em-dashes, and standardized
 * "Typical Quality Parameters" trade terminology across en, fr, and esp.
 */
import type { ProductContent } from '@/types/content';

export const FLAGSHIP_FEATURED_SLUGS = [
  'milling-wheat',
  'durum-wheat',
  'red-lentils',
  'canola-seed',
  'dried-split-ginger',
  'natural-white-sesame-seeds',
  'raw-shea-butter',
  'raw-cocoa-pods-and-beans',
  'yellow-soybeans',
] as const;

export interface RawCommodityDefinition {
  id: string;
  slug: string;
  corridor: 'canada' | 'africa';
  categoryKey: 'grains' | 'pulses' | 'oilseeds' | 'spices' | 'horticulture';
  image: string;
  isFeatured?: boolean;
  displayLogistics?: boolean;
  en: {
    title: string;
    description: string;
    origin: string;
    category: string;
    typicalQualityParameters: string;
    packagingLogistics?: string;
  };
  fr: {
    title: string;
    description: string;
    origin: string;
    category: string;
    typicalQualityParameters: string;
    packagingLogistics?: string;
  };
  esp: {
    title: string;
    description: string;
    origin: string;
    category: string;
    typicalQualityParameters: string;
    packagingLogistics?: string;
  };
}

export const COMMODITY_PORTFOLIO: RawCommodityDefinition[] = [
  // ==========================================
  // FLAGSHIP 9 FEATURED COMMODITIES
  // ==========================================
  {
    id: 'prod-milling-wheat',
    slug: 'milling-wheat',
    corridor: 'canada',
    categoryKey: 'grains',
    image: '/products/canadian/milling-wheat.png',
    isFeatured: true,
    displayLogistics: false,
    en: {
      title: 'Non-Durum / Milling Wheat',
      description:
        'Canadian wheat for flour milling, bakery production, food processing and bulk commodity applications.',
      origin: 'Saskatchewan, Alberta, Manitoba, Canada',
      category: 'Grains & Cereals',
      typicalQualityParameters:
        '• Controlled moisture • Test weight to grade • Low foreign material • Sound kernels • Protein to specification',
    },
    fr: {
      title: 'Ble de mouture / Non dur',
      description:
        'Ble canadien pour meunerie, boulangerie industrielle, transformation alimentaire et commerce en vrac.',
      origin: 'Saskatchewan, Alberta, Manitoba, Canada',
      category: 'Grains et cereales',
      typicalQualityParameters:
        '• Humidite controlee • Poids specifique selon le grade • Faible taux de matieres etrangeres • Grains sains • Proteines selon specifications',
    },
    esp: {
      title: 'Trigo panadero / No candeal',
      description:
        'Trigo canadiense para molienda de harina, produccion de panaderia, procesamiento de alimentos y comercio a granel.',
      origin: 'Saskatchewan, Alberta, Manitoba, Canada',
      category: 'Granos y cereales',
      typicalQualityParameters:
        '• Humedad controlada • Peso hectolitrico segun grado • Bajo contenido de materia extrana • Granos sanos • Proteina segun especificacion',
    },
  },
  {
    id: 'prod-durum-wheat',
    slug: 'durum-wheat',
    corridor: 'canada',
    categoryKey: 'grains',
    image: '/products/canadian/durum-wheat.png',
    isFeatured: true,
    displayLogistics: false,
    en: {
      title: 'Durum Wheat',
      description:
        'Hard amber durum used primarily for semolina, pasta, couscous and other durum-based foods.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Grains & Cereals',
      typicalQualityParameters:
        '• Vitreous kernels to grade • Protein to specification • Controlled moisture • Minimal damage • Low foreign material',
    },
    fr: {
      title: 'Ble dur',
      description:
        'Ble dur ambre utilise principalement pour la semoule, les pates alimentaires, le couscous et les specialites cerealières.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Grains et cereales',
      typicalQualityParameters:
        '• Grains vitreux selon le grade • Proteines selon specifications • Humidite controlee • Dommages minimaux • Faibles impuretes',
    },
    esp: {
      title: 'Trigo candeal duro',
      description:
        'Trigo duro ambar utilizado principalmente para semola, pastas, cuscus y alimentos a base de trigo duro.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Granos y cereales',
      typicalQualityParameters:
        '• Granos vitreos segun grado • Proteina segun especificacion • Humedad controlada • Dano minimo • Bajo contenido de materia extrana',
    },
  },
  {
    id: 'prod-red-lentils',
    slug: 'red-lentils',
    corridor: 'canada',
    categoryKey: 'pulses',
    image: '/products/canadian/red-lentils.png',
    isFeatured: true,
    displayLogistics: false,
    en: {
      title: 'Red Lentils',
      description:
        'Canadian red lentils supplied whole or split for food manufacturing, milling, retail packing and food-service applications.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Pulses & Legumes',
      typicalQualityParameters:
        '• Uniform colour • Controlled moisture • Low foreign material • Minimal damage • Grade/size to specification',
    },
    fr: {
      title: 'Lentilles rouges',
      description:
        'Lentilles rouges canadiennes entieres ou cassees pour transformation alimentaire, meunerie et conditionnement de detail.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Legumineuses et legumes secs',
      typicalQualityParameters:
        '• Couleur uniforme • Humidite controlee • Faibles impuretes • Dommages minimaux • Calibre selon specifications',
    },
    esp: {
      title: 'Lentejas rojas',
      description:
        'Lentejas rojas canadienses enteras o partidas para fabricacion de alimentos, molienda y envasado minorista.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Legumbres y leguminosas',
      typicalQualityParameters:
        '• Color uniforme • Humedad controlada • Bajo contenido de materia extrana • Dano minimo • Grado y tamano segun especificacion',
    },
  },
  {
    id: 'prod-canola-seed',
    slug: 'canola-seed',
    corridor: 'canada',
    categoryKey: 'oilseeds',
    image: '/products/canadian/canola-seed.png',
    isFeatured: true,
    displayLogistics: true,
    en: {
      title: 'Canola Seed',
      description:
        'Canadian oilseed supplied for crushing into edible oil, meal and other food or industrial applications.',
      origin: 'Saskatchewan, Alberta, Manitoba, Canada',
      category: 'Oilseeds, Nuts & Seeds',
      typicalQualityParameters:
        '• Controlled moisture • Low foreign material • Minimal heated/damaged seed • Oil content to specification • Grade compliant',
      packagingLogistics:
        'Standard 50kg polypropylene bags, bulk Big Bags (1000kg), and 20ft/40ft FCL bulk container liners. Supported Incoterms: FOB Vancouver, CFR, CIF major global destinations.',
    },
    fr: {
      title: 'Graines de canola',
      description:
        'Graines oleagineuses canadiennes pour trituration en huile alimentaire, tourteau et applications industrielles.',
      origin: 'Saskatchewan, Alberta, Manitoba, Canada',
      category: 'Graines oleagineuses',
      typicalQualityParameters:
        '• Humidite controlee • Faibles matieres etrangeres • Graines echauffees ou endommagees minimes • Teneur en huile selon specifications • Conforme au grade',
      packagingLogistics:
        'Sacs en polypropylene standard de 50 kg, Big Bags en vrac (1000 kg) et conteneurs maritimes FCL 20 pi / 40 pi. Incoterms: FOB Vancouver, CFR, CIF.',
    },
    esp: {
      title: 'Semilla de canola',
      description:
        'Semilla oleaginosa canadiense para extraccion de aceite comestible, harina y aplicaciones industriales.',
      origin: 'Saskatchewan, Alberta, Manitoba, Canada',
      category: 'Semillas oleaginosas',
      typicalQualityParameters:
        '• Humedad controlada • Bajo contenido de materia extrana • Minimo de grano danado por calor • Contenido de aceite segun especificacion • Conforme al grado',
      packagingLogistics:
        'Sacos de polipropileno de 50 kg, Big Bags a granel (1000 kg) y contenedores FCL de 20 y 40 pies. Incoterms compatibles: FOB Vancouver, CFR, CIF.',
    },
  },
  {
    id: 'prod-ginger',
    slug: 'dried-split-ginger',
    corridor: 'africa',
    categoryKey: 'spices',
    image: '/products/dried-split-ginger.png',
    isFeatured: true,
    displayLogistics: true,
    en: {
      title: 'Dried Split Ginger',
      description:
        'Sun-dried split ginger with robust aroma and high oleoresin content, sourced from sustainable African farming communities.',
      origin: 'Nigeria, West Africa',
      category: 'Spices & Botanicals',
      typicalQualityParameters:
        '• Moisture: < 12% • Volatile oil: > 1.5% • Impurities: < 1% • Clean split root • Free from mould and foreign matter',
      packagingLogistics:
        '40kg and 50kg export grade polypropylene or jute bags. 20ft FCL capacity approx 14 MT. Incoterms: FOB Lagos/Apapa, CFR, CIF.',
    },
    fr: {
      title: 'Gingembre seche concasse',
      description:
        'Gingembre concasse seche au soleil a fort arome et forte teneur en oleoresine, issu de cooperatives agricoles ouest-africaines.',
      origin: 'Nigeria, Afrique de l Ouest',
      category: 'Epices et aromates',
      typicalQualityParameters:
        '• Humidite: < 12% • Huile volatile: > 1.5% • Impuretes: < 1% • Racines saines • Sans moisissure ni corps etrangers',
      packagingLogistics:
        'Sacs export en PP ou jute de 40 kg et 50 kg. Capacite conteneur 20 pi FCL environ 14 tonnes. Incoterms: FOB Lagos/Apapa, CFR, CIF.',
    },
    esp: {
      title: 'Jengibre seco partido',
      description:
        'Jengibre partido secado al sol con aroma intenso y alto contenido de oleorresina, procedente de cooperativas de Africa Occidental.',
      origin: 'Nigeria, Africa Occidental',
      category: 'Especias y aromaticos',
      typicalQualityParameters:
        '• Humedad: < 12% • Aceite volatil: > 1.5% • Impurezas: < 1% • Raices limpias • Libre de moho y materias extranas',
      packagingLogistics:
        'Sacos de polipropileno o yute de 40 kg y 50 kg. Capacidad FCL 20 pies aprox 14 TM. Incoterms: FOB Lagos/Apapa, CFR, CIF.',
    },
  },
  {
    id: 'prod-sesame',
    slug: 'natural-white-sesame-seeds',
    corridor: 'africa',
    categoryKey: 'oilseeds',
    image: '/products/natural-sesame-seeds.png',
    isFeatured: true,
    displayLogistics: false,
    en: {
      title: 'Natural White Sesame Seeds',
      description:
        'Mechanically cleaned natural white sesame seeds with uniform colour, high purity, and natural oil content.',
      origin: 'Nigeria, West Africa',
      category: 'Oilseeds, Nuts & Seeds',
      typicalQualityParameters:
        '• Purity: > 99.5% • Moisture: < 6% • Oil content: > 50% • Free fatty acids (FFA): < 2% • Grade 1 export specification',
    },
    fr: {
      title: 'Graines de sesame blanc naturel',
      description:
        'Graines de sesame blanc naturel nettoyees mecaniquement, a couleur uniforme, purete elevee et teneur naturelle en huile.',
      origin: 'Nigeria, Afrique de l Ouest',
      category: 'Graines oleagineuses',
      typicalQualityParameters:
        '• Purete: > 99.5% • Humidite: < 6% • Teneur en huile: > 50% • Acides gras libres: < 2% • Conforme au grade export 1',
    },
    esp: {
      title: 'Semillas de sesamo blanco natural',
      description:
        'Semillas de sesamo blanco natural limpiadas mecanicamente, de color uniforme, alta pureza y rico contenido graso.',
      origin: 'Nigeria, Africa Occidental',
      category: 'Semillas oleaginosas',
      typicalQualityParameters:
        '• Pureza: > 99.5% • Humedad: < 6% • Contenido de aceite: > 50% • Acidos grasos libres: < 2% • Grado 1 de exportacion',
    },
  },
  {
    id: 'prod-shea',
    slug: 'raw-shea-butter',
    corridor: 'africa',
    categoryKey: 'oilseeds',
    image: '/products/raw-shea-butter.png',
    isFeatured: true,
    displayLogistics: false,
    en: {
      title: 'Raw Shea Butter',
      description:
        'Pure unrefined raw shea butter handcrafted by certified cooperatives in West Africa for cosmetic and specialty formulations.',
      origin: 'West Africa',
      category: 'Oilseeds, Nuts & Seeds',
      typicalQualityParameters:
        '• Grade A unrefined • FFA: < 1% • Peroxide value: < 5 meq/kg • Moisture: < 0.5% • Authentic ivory to light yellow hue',
    },
    fr: {
      title: 'Beurre de karite brut',
      description:
        'Beurre de karite brut non raffine elabore artisanalement en Afrique de l Ouest pour l industrie cosmetique et pharmaceutique.',
      origin: 'Afrique de l Ouest',
      category: 'Graines oleagineuses',
      typicalQualityParameters:
        '• Grade A non raffine • FFA: < 1% • Indice de peroxyde: < 5 meq/kg • Humidite: < 0.5% • Teinte ivoire authentique',
    },
    esp: {
      title: 'Manteca de karite pura sin refinar',
      description:
        'Manteca de karite pura sin refinar producida artesanalmente en Africa Occidental para aplicaciones cosmeticas y farmaceuticas.',
      origin: 'Africa Occidental',
      category: 'Semillas oleaginosas',
      typicalQualityParameters:
        '• Grado A sin refinar • FFA: < 1% • Indice de peroxido: < 5 meq/kg • Humedad: < 0.5% • Tono marfil caracteristico',
    },
  },
  {
    id: 'prod-cocoa',
    slug: 'raw-cocoa-pods-and-beans',
    corridor: 'africa',
    categoryKey: 'horticulture',
    image: '/products/raw-cocoa-pods.png',
    isFeatured: true,
    displayLogistics: false,
    en: {
      title: 'Raw Cocoa Pods & Beans',
      description:
        'Well-fermented West African cocoa beans and whole pods carefully harvested for chocolate manufacturers and food processors.',
      origin: 'West Africa',
      category: 'Horticultural & Ingredients',
      typicalQualityParameters:
        '• Bean count: 95 to 105 per 100g • Moisture: < 7.5% • Slaty: < 3% • Mouldy: < 3% • Well fermented and sun dried',
    },
    fr: {
      title: 'Cabosses et feves de cacao brutes',
      description:
        'Feves de cacao et cabosses entieres d Afrique de l Ouest, bien fermentees pour l industrie chocolatiere et agroalimentaire.',
      origin: 'Afrique de l Ouest',
      category: 'Produits horticoles et ingredients',
      typicalQualityParameters:
        '• Compte de feves: 95 a 105 par 100g • Humidite: < 7.5% • Ardoisees: < 3% • Moisies: < 3% • Fermentation complete',
    },
    esp: {
      title: 'Mazorcas y granos de cacao crudos',
      description:
        'Granos de cacao y mazorcas enteras de Africa Occidental fermentados con precision para la industria chocolatera.',
      origin: 'Africa Occidental',
      category: 'Horticultura e ingredientes',
      typicalQualityParameters:
        '• Conteo de granos: 95 a 105 por 100g • Humedad: < 7.5% • Pizarrosos: < 3% • Mohosos: < 3% • Fermentacion optima',
    },
  },
  {
    id: 'prod-yellow-soybeans',
    slug: 'yellow-soybeans',
    corridor: 'canada',
    categoryKey: 'oilseeds',
    image: '/products/canadian/yellow-soybeans.png',
    isFeatured: true,
    displayLogistics: false,
    en: {
      title: 'Conventional Yellow Soybeans',
      description:
        'Canadian conventional, food-grade and identity-preserved soybeans for food manufacturing, crushing, feed and specialty applications.',
      origin: 'Ontario, Manitoba, Quebec, Canada',
      category: 'Oilseeds, Nuts & Seeds',
      typicalQualityParameters:
        '• Controlled moisture • Low foreign material • Uniform size/colour • Protein/oil to specification • Variety/type specified',
    },
    fr: {
      title: 'Soja jaune conventionnel',
      description:
        'Soja canadien conventionnel de qualite alimentaire a identite preservee pour transformation, trituration et nutrition animale.',
      origin: 'Ontario, Manitoba, Quebec, Canada',
      category: 'Graines oleagineuses',
      typicalQualityParameters:
        '• Humidite controlee • Faibles impuretes • Calibre et couleur uniformes • Proteines et huile selon specifications',
    },
    esp: {
      title: 'Soja amarillo convencional',
      description:
        'Soja canadiense convencional para alimentacion humana, molienda y usos especializados con trazabilidad garantizada.',
      origin: 'Ontario, Manitoba, Quebec, Canada',
      category: 'Semillas oleaginosas',
      typicalQualityParameters:
        '• Humedad controlada • Bajo contenido de materia extrana • Tamano y color uniforme • Proteina y aceite segun especificacion',
    },
  },

  // ==========================================
  // CANADIAN PULSES & GRAINS (docs/products.md)
  // ==========================================
  {
    id: 'prod-green-lentils',
    slug: 'green-lentils',
    corridor: 'canada',
    categoryKey: 'pulses',
    image: '/products/canadian/green-lentils.png',
    en: {
      title: 'Green Lentils',
      description:
        'Canadian green lentils available in different sizes and grades for retail, food service and processing applications.',
      origin: 'Saskatchewan, Canada',
      category: 'Pulses & Legumes',
      typicalQualityParameters:
        '• Uniform colour/size • Controlled moisture • Low foreign material • Minimal damage • Grade to specification',
    },
    fr: {
      title: 'Lentilles vertes',
      description:
        'Lentilles vertes canadiennes disponibles en differents calibres et grades pour commerce de detail et restauration.',
      origin: 'Saskatchewan, Canada',
      category: 'Legumineuses et legumes secs',
      typicalQualityParameters:
        '• Calibre et couleur uniformes • Humidite controlee • Faibles impuretes • Dommages minimaux • Conforme au grade',
    },
    esp: {
      title: 'Lentejas verdes',
      description:
        'Lentejas verdes canadienses disponibles en varios calibres y grados para el sector minorista y de hosteleria.',
      origin: 'Saskatchewan, Canada',
      category: 'Legumbres y leguminosas',
      typicalQualityParameters:
        '• Color y tamano uniformes • Humedad controlada • Bajo contenido de impurezas • Dano minimo • Grado segun especificacion',
    },
  },
  {
    id: 'prod-yellow-peas',
    slug: 'yellow-peas',
    corridor: 'canada',
    categoryKey: 'pulses',
    image: '/products/canadian/yellow-peas.png',
    en: {
      title: 'Yellow Peas',
      description:
        'Canadian yellow field peas used in packaged foods, splitting, milling, protein extraction and ingredient manufacturing.',
      origin: 'Saskatchewan, Alberta, Manitoba, Canada',
      category: 'Pulses & Legumes',
      typicalQualityParameters:
        '• Consistent colour • Controlled moisture • Low foreign material • Minimal damage • Grade to specification',
    },
    fr: {
      title: 'Pois jaunes',
      description:
        'Pois jaunes de grande culture canadiens pour cassage, meunerie, extraction de proteines et ingredients alimentaires.',
      origin: 'Saskatchewan, Alberta, Manitoba, Canada',
      category: 'Legumineuses et legumes secs',
      typicalQualityParameters:
        '• Couleur homogene • Humidite controlee • Faibles matieres etrangeres • Dommages minimaux • Conforme au grade',
    },
    esp: {
      title: 'Guisantes amarillos',
      description:
        'Guisantes secos amarillos canadienses para molienda, fraccionamiento y extraccion de proteinas vegetales.',
      origin: 'Saskatchewan, Alberta, Manitoba, Canada',
      category: 'Legumbres y leguminosas',
      typicalQualityParameters:
        '• Color consistente • Humedad controlada • Materia extrana reducida • Dano minimo • Grado segun especificacion',
    },
  },
  {
    id: 'prod-green-peas',
    slug: 'green-peas',
    corridor: 'canada',
    categoryKey: 'pulses',
    image: '/products/canadian/green-peas.png',
    en: {
      title: 'Green Peas',
      description:
        'Canadian green field peas supplied for splitting, food processing, packaged pulses and other ingredient applications.',
      origin: 'Saskatchewan, Alberta, Manitoba, Canada',
      category: 'Pulses & Legumes',
      typicalQualityParameters:
        '• Natural green colour • Controlled moisture • Low foreign material • Minimal damage • Grade to specification',
    },
    fr: {
      title: 'Pois verts',
      description:
        'Pois verts canadiens de premier choix pour transformation, cassage et conditionnement alimentaire.',
      origin: 'Saskatchewan, Alberta, Manitoba, Canada',
      category: 'Legumineuses et legumes secs',
      typicalQualityParameters:
        '• Teinte verte naturelle • Humidite controlee • Faibles impuretes • Dommages minimaux • Conforme au grade',
    },
    esp: {
      title: 'Guisantes verdes',
      description:
        'Guisantes secos verdes canadienses suministrados para envasado, fraccionamiento y procesado industrial.',
      origin: 'Saskatchewan, Alberta, Manitoba, Canada',
      category: 'Legumbres y leguminosas',
      typicalQualityParameters:
        '• Color verde natural • Humedad controlada • Minimas impurezas • Dano controlado • Grado a especificacion',
    },
  },
  {
    id: 'prod-chickpeas',
    slug: 'chickpeas',
    corridor: 'canada',
    categoryKey: 'pulses',
    image: '/products/canadian/chickpeas.png',
    en: {
      title: 'Chickpeas (Kabuli)',
      description:
        'Canadian chickpeas for hummus production, retail packing, food service and other food-processing applications.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Pulses & Legumes',
      typicalQualityParameters:
        '• Size to specification • Controlled moisture • Low foreign material • Minimal damage • Grade to specification',
    },
    fr: {
      title: 'Pois chiches (Kabuli)',
      description:
        'Pois chiches canadiens pour houmous, vente au detail, restauration et transformation agroalimentaire.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Legumineuses et legumes secs',
      typicalQualityParameters:
        '• Calibre selon specifications • Humidite controlee • Faibles impuretes • Dommages minimaux • Grade conforme',
    },
    esp: {
      title: 'Garbanzos (Kabuli)',
      description:
        'Garbanzos canadienses para elaboracion de hummus, distribucion minorista y alimentacion especializada.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Legumbres y leguminosas',
      typicalQualityParameters:
        '• Calibre a especificacion • Humedad controlada • Bajo contenido de impurezas • Dano minimo • Conforme a norma',
    },
  },
  {
    id: 'prod-dry-beans',
    slug: 'dry-beans',
    corridor: 'canada',
    categoryKey: 'pulses',
    image: '/products/canadian/dry-beans.png',
    en: {
      title: 'Dry Beans',
      description:
        'Canadian dry beans available across selected classes for canning, packaged foods, food service and processing.',
      origin: 'Manitoba, Ontario, Alberta, Canada',
      category: 'Pulses & Legumes',
      typicalQualityParameters:
        '• Varietal consistency • Controlled moisture • Low foreign material • Minimal splits/damage • Grade to specification',
    },
    fr: {
      title: 'Haricots secs',
      description:
        'Haricots secs canadiens de differentes classes pour conserverie, conditionnement et transformation.',
      origin: 'Manitoba, Ontario, Alberta, Canada',
      category: 'Legumineuses et legumes secs',
      typicalQualityParameters:
        '• Constance varietale • Humidite controlee • Faibles impuretes • Grains feles minimaux • Grade specifie',
    },
    esp: {
      title: 'Frijoles secos',
      description:
        'Frijoles secos canadienses de varias categorias para conservas, alimentos envasados y hosteleria.',
      origin: 'Manitoba, Ontario, Alberta, Canada',
      category: 'Legumbres y leguminosas',
      typicalQualityParameters:
        '• Consistencia varietal • Humedad controlada • Bajo contenido de impurezas • Dano minimo • Grado comercial',
    },
  },
  {
    id: 'prod-kidney-beans',
    slug: 'kidney-beans',
    corridor: 'canada',
    categoryKey: 'pulses',
    image: '/products/canadian/kidney-beans.png',
    en: {
      title: 'Kidney Beans',
      description:
        'Red kidney beans for canning, packaged foods, prepared meals, retail and food-service applications.',
      origin: 'Ontario, Manitoba, Canada',
      category: 'Pulses & Legumes',
      typicalQualityParameters:
        '• Consistent colour • Size to specification • Controlled moisture • Low foreign material • Minimal damage',
    },
    fr: {
      title: 'Haricots rouges',
      description:
        'Haricots rouges canadiens pour conserveries, plats prepares et emballages alimentaires familiaux.',
      origin: 'Ontario, Manitoba, Canada',
      category: 'Legumineuses et legumes secs',
      typicalQualityParameters:
        '• Couleur rouge vive • Calibre specifie • Humidite controlee • Faibles matieres etrangeres • Dommages limites',
    },
    esp: {
      title: 'Frijoles rojos',
      description:
        'Frijoles rojos canadienses ideales para enlatado, comidas preparadas y distribucion minorista.',
      origin: 'Ontario, Manitoba, Canada',
      category: 'Legumbres y leguminosas',
      typicalQualityParameters:
        '• Color homogeneo • Calibre segun especificacion • Humedad controlada • Impurezas reducidas • Minimo dano',
    },
  },
  {
    id: 'prod-navy-beans',
    slug: 'navy-beans',
    corridor: 'canada',
    categoryKey: 'pulses',
    image: '/products/canadian/navy-beans.png',
    en: {
      title: 'Navy Beans',
      description:
        'Small white beans commonly used in baked beans, canning, packaged foods and ingredient applications.',
      origin: 'Ontario, Manitoba, Canada',
      category: 'Pulses & Legumes',
      typicalQualityParameters:
        '• Consistent colour • Uniform sizing • Controlled moisture • Low foreign material • Minimal staining/damage',
    },
    fr: {
      title: 'Haricots ronds blancs (Navy)',
      description:
        'Petits haricots blancs pour haricots cuits au four, conserves et ingredients agroalimentaires.',
      origin: 'Ontario, Manitoba, Canada',
      category: 'Legumineuses et legumes secs',
      typicalQualityParameters:
        '• Couleur blanche uniforme • Calibrage regulier • Humidite controlee • Faibles impuretes • Taches minimes',
    },
    esp: {
      title: 'Frijoles blancos pequenos (Navy)',
      description:
        'Pequenos frijoles blancos empleados habitualmente en conservas y aplicaciones culinarias industriales.',
      origin: 'Ontario, Manitoba, Canada',
      category: 'Legumbres y leguminosas',
      typicalQualityParameters:
        '• Color uniforme • Calibre homogeneo • Humedad controlada • Bajo contenido de materias extranas • Manchas minimas',
    },
  },
  {
    id: 'prod-canola-oil',
    slug: 'canola-oil',
    corridor: 'canada',
    categoryKey: 'oilseeds',
    image: '/products/canadian/canola-oil.png',
    en: {
      title: 'Canola Oil',
      description:
        'Crude or refined Canadian canola oil for food manufacturing, food service and industrial applications.',
      origin: 'Canadian processing facilities',
      category: 'Oilseeds, Nuts & Seeds',
      typicalQualityParameters:
        '• Refining level specified • Controlled impurities • Colour/odour parameters • Food-grade where applicable • Buyer specification',
    },
    fr: {
      title: 'Huile de canola',
      description:
        'Huile de canola canadienne brute ou raffinee pour agroalimentaire et restauration commerciale.',
      origin: 'Usines de transformation canadiennes',
      category: 'Graines oleagineuses',
      typicalQualityParameters:
        '• Niveau de raffinage specifie • Impuretes controlees • Couleur et odeur conformes • Qualite alimentaire certifiee',
    },
    esp: {
      title: 'Aceite de canola',
      description:
        'Aceite de canola canadiense crudo o refinado para industria alimentaria y hosteleria.',
      origin: 'Plantas procesadoras canadienses',
      category: 'Semillas oleaginosas',
      typicalQualityParameters:
        '• Nivel de refinado especificado • Impurezas controladas • Parametros de color y olor definidos • Grado alimentario',
    },
  },
  {
    id: 'prod-canola-meal',
    slug: 'canola-meal',
    corridor: 'canada',
    categoryKey: 'oilseeds',
    image: '/products/canadian/canola-meal.png',
    en: {
      title: 'Canola Meal',
      description:
        'Protein-containing co-product of canola processing used primarily in dairy, livestock and animal-feed formulations.',
      origin: 'Canadian processing facilities',
      category: 'Oilseeds, Nuts & Seeds',
      typicalQualityParameters:
        '• Protein to specification • Controlled moisture • Fibre to specification • Feed-safety requirements • Contaminant limits',
    },
    fr: {
      title: 'Tourteau de canola',
      description:
        'Coproduit proteique de trituration du canola pour alimentation des vaches laitieres et du betail.',
      origin: 'Usines de transformation canadiennes',
      category: 'Graines oleagineuses',
      typicalQualityParameters:
        '• Proteines conformes • Humidite controlee • Fibres selon specifications • Normes de securite pour aliments d elevage',
    },
    esp: {
      title: 'Harina de canola',
      description:
        'Subproducto proteico del procesado de canola utilizado primordialmente en piensos para ganado y vacuno.',
      origin: 'Plantas procesadoras canadienses',
      category: 'Semillas oleaginosas',
      typicalQualityParameters:
        '• Proteina segun especificacion • Humedad controlada • Fibra a especificacion • Normas de seguridad en piensos',
    },
  },
  {
    id: 'prod-flaxseed',
    slug: 'flaxseed-linseed',
    corridor: 'canada',
    categoryKey: 'oilseeds',
    image: '/products/canadian/flaxseed-linseed.png',
    en: {
      title: 'Flaxseed / Linseed',
      description:
        'Canadian flaxseed for food ingredients, bakery products, animal nutrition, oil extraction and industrial applications.',
      origin: 'Saskatchewan, Manitoba, Alberta, Canada',
      category: 'Oilseeds, Nuts & Seeds',
      typicalQualityParameters:
        '• Controlled moisture • Low foreign material • Consistent colour • Minimal damage • Grade to specification',
    },
    fr: {
      title: 'Graines de lin',
      description:
        'Graines de lin canadiennes pour boulangerie, ingredients dietetiques, nutrition animale et extraction d huile.',
      origin: 'Saskatchewan, Manitoba, Alberta, Canada',
      category: 'Graines oleagineuses',
      typicalQualityParameters:
        '• Humidite controlee • Faibles impuretes • Couleur reguliere • Dommages minimaux • Grade conforme',
    },
    esp: {
      title: 'Semilla de lino / Linaza',
      description:
        'Linaza canadiense para ingredientes alimentarios, panaderia, nutricion animal y extraccion de aceite.',
      origin: 'Saskatchewan, Manitoba, Alberta, Canada',
      category: 'Semillas oleaginosas',
      typicalQualityParameters:
        '• Humedad controlada • Bajo contenido de materia extrana • Color uniforme • Dano minimo • Grado segun norma',
    },
  },
  {
    id: 'prod-yellow-mustard',
    slug: 'yellow-mustard-seed',
    corridor: 'canada',
    categoryKey: 'spices',
    image: '/products/canadian/yellow-mustard-seed.png',
    en: {
      title: 'Yellow Mustard Seed',
      description:
        'Canadian yellow mustard seed used in prepared mustard, sauces, food ingredients and condiment manufacturing.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Spices & Botanicals',
      typicalQualityParameters:
        '• Varietal purity • Controlled moisture • Consistent colour • Low foreign material • Grade to specification',
    },
    fr: {
      title: 'Graines de moutarde jaune',
      description:
        'Graines de moutarde jaune canadiennes pour sauces, condiments prepares et assaisonnements alimentaires.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Epices et aromates',
      typicalQualityParameters:
        '• Purete varietale • Humidite controlee • Teinte constante • Faibles impuretes • Grade conforme',
    },
    esp: {
      title: 'Semilla de mostaza amarilla',
      description:
        'Semilla de mostaza amarilla canadiense empleada en mostazas preparadas, salsas y condimentos.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Especias y aromaticos',
      typicalQualityParameters:
        '• Pureza varietal • Humedad controlada • Color consistente • Bajo nivel de impurezas • Grado especificado',
    },
  },
  {
    id: 'prod-brown-mustard',
    slug: 'brown-mustard-seed',
    corridor: 'canada',
    categoryKey: 'spices',
    image: '/products/canadian/brown-mustard-seed.png',
    en: {
      title: 'Brown Mustard Seed',
      description:
        'Brown mustard seed used in condiments, spice blends, sauces and processed-food applications.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Spices & Botanicals',
      typicalQualityParameters:
        '• Varietal purity • Controlled moisture • Consistent colour • Low foreign material • Grade to specification',
    },
    fr: {
      title: 'Graines de moutarde brune',
      description:
        'Graines de moutarde brune pour condiments de table, melanges d epices et agroalimentaire.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Epices et aromates',
      typicalQualityParameters:
        '• Purete varietale • Humidite controlee • Couleur uniforme • Impuretes minimes • Conforme aux grades officiels',
    },
    esp: {
      title: 'Semilla de mostaza parda',
      description:
        'Semilla de mostaza parda para salsas, mezclas aromaticas de especias y conservas.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Especias y aromaticos',
      typicalQualityParameters:
        '• Pureza varietal • Humedad controlada • Color constante • Impurezas reducidas • Conforme a especificacion',
    },
  },
  {
    id: 'prod-oriental-mustard',
    slug: 'oriental-mustard-seed',
    corridor: 'canada',
    categoryKey: 'spices',
    image: '/products/canadian/oriental-mustard-seed.png',
    en: {
      title: 'Oriental Mustard Seed',
      description:
        'Oriental mustard seed used in mustard products, seasonings, food processing and selected oil applications.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Spices & Botanicals',
      typicalQualityParameters:
        '• Varietal purity • Controlled moisture • Consistent colour • Low foreign material • Grade to specification',
    },
    fr: {
      title: 'Graines de moutarde orientale',
      description:
        'Graines de moutarde orientale pour fabrication de condiments piquants et extractions d assaisonnements.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Epices et aromates',
      typicalQualityParameters:
        '• Purete varietale • Humidite controlee • Couleur reguliere • Faibles impuretes • Grade commercial certifie',
    },
    esp: {
      title: 'Semilla de mostaza oriental',
      description:
        'Semilla de mostaza oriental para elaboracion de condimentos picantes y aceites aromaticos.',
      origin: 'Saskatchewan, Alberta, Canada',
      category: 'Especias y aromaticos',
      typicalQualityParameters:
        '• Pureza varietal • Humedad controlada • Tono homogeneo • Materia extrana reducida • Grado comercial',
    },
  },
  {
    id: 'prod-canary-seed',
    slug: 'canary-seed',
    corridor: 'canada',
    categoryKey: 'grains',
    image: '/products/canadian/canary-seed.png',
    en: {
      title: 'Canary Seed',
      description:
        'Canadian canary seed supplied for birdseed and approved human-food applications depending on variety and destination.',
      origin: 'Saskatchewan, Canada',
      category: 'Grains & Cereals',
      typicalQualityParameters:
        '• Controlled moisture • Low foreign material • Uniform seed • Minimal damage • Grade to specification',
    },
    fr: {
      title: 'Graines d alpiste',
      description:
        'Alpiste canadien pour oisellerie et applications certifiees d alimentation humaine selon les normes de destination.',
      origin: 'Saskatchewan, Canada',
      category: 'Grains et cereales',
      typicalQualityParameters:
        '• Humidite controlee • Faibles matieres etrangeres • Grains uniformes • Dommages minimaux • Grade conforme',
    },
    esp: {
      title: 'Semilla de alpiste',
      description:
        'Alpiste canadiense suministrado para mezclas ornitologicas y aplicaciones alimentarias humanas autorizadas.',
      origin: 'Saskatchewan, Canada',
      category: 'Granos y cereales',
      typicalQualityParameters:
        '• Humedad controlada • Bajo contenido de materia extrana • Granos uniformes • Dano minimo • Grado segun norma',
    },
  },
  {
    id: 'prod-feed-barley',
    slug: 'feed-barley',
    corridor: 'canada',
    categoryKey: 'grains',
    image: '/products/canadian/feed-barley.png',
    en: {
      title: 'Feed Barley',
      description:
        'Canadian barley supplied as an energy source for livestock and commercial animal-feed formulations.',
      origin: 'Alberta, Saskatchewan, Manitoba, Canada',
      category: 'Grains & Cereals',
      typicalQualityParameters:
        '• Controlled moisture • Test weight to specification • Low foreign material • Minimal mould/heating • Feed-grade requirements',
    },
    fr: {
      title: 'Orge fourragere',
      description:
        'Orge canadienne utilisee comme source d energie nutritionnelle pour le betail et l elevage commercial.',
      origin: 'Alberta, Saskatchewan, Manitoba, Canada',
      category: 'Grains et cereales',
      typicalQualityParameters:
        '• Humidite controlee • Poids specifique certifie • Faibles impuretes • Sans echauffement ni moisissure • Grade fourrager',
    },
    esp: {
      title: 'Cebada forrajera',
      description:
        'Cebada canadiense suministrada como fuente energetica para piensos de ganado y produccion pecuaria.',
      origin: 'Alberta, Saskatchewan, Manitoba, Canada',
      category: 'Granos y cereales',
      typicalQualityParameters:
        '• Humedad controlada • Peso hectolitrico segun especificacion • Bajo nivel de impurezas • Grado para piensos',
    },
  },
  {
    id: 'prod-malting-barley',
    slug: 'malting-barley',
    corridor: 'canada',
    categoryKey: 'grains',
    image: '/products/canadian/malting-barley.png',
    en: {
      title: 'Malting Barley',
      description:
        'Barley selected for malting and subsequent use by breweries, distilleries and food manufacturers.',
      origin: 'Alberta, Saskatchewan, Manitoba, Canada',
      category: 'Grains & Cereals',
      typicalQualityParameters:
        '• Germination to specification • Kernel uniformity • Controlled protein/moisture • Minimal damage • Variety specified',
    },
    fr: {
      title: 'Orge de brasserie',
      description:
        'Orge selectionnee pour le maltage destinee aux brasseries, distilleries et industries agroalimentaires.',
      origin: 'Alberta, Saskatchewan, Manitoba, Canada',
      category: 'Grains et cereales',
      typicalQualityParameters:
        '• Faculte germinative certifiee • Calibrage homogene • Teneur en proteines et humidite controlees • Variete garantie',
    },
    esp: {
      title: 'Cebada cervecera / Para malta',
      description:
        'Cebada seleccionada para malteo empleada por cerveceras, destilerias y fabricantes de alimentos.',
      origin: 'Alberta, Saskatchewan, Manitoba, Canada',
      category: 'Granos y cereales',
      typicalQualityParameters:
        '• Capacidad de germinacion a especificacion • Calibre uniforme • Proteina y humedad controladas • Variedad garantizada',
    },
  },
  {
    id: 'prod-malt',
    slug: 'malt',
    corridor: 'canada',
    categoryKey: 'grains',
    image: '/products/canadian/malt.png',
    en: {
      title: 'Malt',
      description:
        'Processed barley malt supplied to breweries, distilleries and food manufacturers for fermentation and ingredient applications.',
      origin: 'Canadian malt processors',
      category: 'Grains & Cereals',
      typicalQualityParameters:
        '• Extract to specification • Controlled moisture • Consistent modification • Variety/type specified • Microbiological requirements',
    },
    fr: {
      title: 'Malt d orge',
      description:
        'Malt d orge transforme livre aux brasseries et distilleries pour fermentation et aromatisations.',
      origin: 'Malteries canadiennes',
      category: 'Grains et cereales',
      typicalQualityParameters:
        '• Extrait garanti • Humidite controlee • Degre de modification regulier • Criteres microbiologiques stricts',
    },
    esp: {
      title: 'Malta de cebada',
      description:
        'Malta procesada para cervecerias, destilerias e ingredientes de fermentacion industrial.',
      origin: 'Procesadores canadienses de malta',
      category: 'Granos y cereales',
      typicalQualityParameters:
        '• Extracto a especificacion • Humedad controlada • Modificacion uniforme • Requisitos microbiologicos verificados',
    },
  },
  {
    id: 'prod-raw-oats',
    slug: 'raw-oats',
    corridor: 'canada',
    categoryKey: 'grains',
    image: '/products/canadian/raw-oats.png',
    en: {
      title: 'Raw Oats',
      description:
        'Canadian oats supplied for milling, food manufacturing, animal nutrition and further processing into oat ingredients.',
      origin: 'Manitoba, Saskatchewan, Alberta, Canada',
      category: 'Grains & Cereals',
      typicalQualityParameters:
        '• Controlled moisture • Test weight to grade • Low foreign material • Minimal damage • Grade to specification',
    },
    fr: {
      title: 'Avoine brute',
      description:
        'Avoine canadienne pour meunerie, transformation alimentaire, flocons et nutrition animale.',
      origin: 'Manitoba, Saskatchewan, Alberta, Canada',
      category: 'Grains et cereales',
      typicalQualityParameters:
        '• Humidite controlee • Poids specifique conforme • Faibles matieres etrangeres • Dommages limites • Grade officiel',
    },
    esp: {
      title: 'Avena cruda',
      description:
        'Avena canadiense para molienda, elaboracion de copos, nutricion animal y derivados alimentarios.',
      origin: 'Manitoba, Saskatchewan, Alberta, Canada',
      category: 'Granos y cereales',
      typicalQualityParameters:
        '• Humedad controlada • Peso hectolitrico segun grado • Materia extrana reducida • Dano minimo • Grado segun norma',
    },
  },
  {
    id: 'prod-oat-flakes-flour',
    slug: 'oat-flakes-flour',
    corridor: 'canada',
    categoryKey: 'grains',
    image: '/products/canadian/oat-flakes-flour.png',
    en: {
      title: 'Oat Flakes / Oat Flour',
      description:
        'Processed oat ingredients for cereals, bakery products, snacks, beverages and other food-manufacturing applications.',
      origin: 'Canadian processing facilities',
      category: 'Grains & Cereals',
      typicalQualityParameters:
        '• Food-grade processing • Particle/flake specification • Controlled moisture • Microbiological limits • Packaging specification',
    },
    fr: {
      title: 'Flocons d avoine et farine d avoine',
      description:
        'Ingredients a base d avoine pour cereales du matin, barres de collation, boulangerie et boissons vegetales.',
      origin: 'Usines de transformation canadiennes',
      category: 'Grains et cereales',
      typicalQualityParameters:
        '• Transformation qualite alimentaire • Calibrage des flocons precis • Humidite controlee • Limites microbiologiques respectees',
    },
    esp: {
      title: 'Copos y harina de avena',
      description:
        'Copos y harinas de avena para cereales de desayuno, reposteria, aperitivos y bebidas vegetales.',
      origin: 'Plantas procesadoras canadienses',
      category: 'Granos y cereales',
      typicalQualityParameters:
        '• Grado alimentario • Granulometria y tamano de copo a especificacion • Humedad controlada • Limites microbiologicos conformes',
    },
  },
  {
    id: 'prod-pulse-flour',
    slug: 'pulse-flour-pea-protein',
    corridor: 'canada',
    categoryKey: 'pulses',
    image: '/products/canadian/pulse-flour-pea-protein.png',
    en: {
      title: 'Pulse Flour / Pea Protein / Lentil Ingredients',
      description:
        'Pulse-derived flours and protein ingredients used in food manufacturing, nutrition products and plant-based formulations.',
      origin: 'Canadian processing facilities',
      category: 'Pulses & Legumes',
      typicalQualityParameters:
        '• Protein to specification • Controlled moisture • Particle size specified • Microbiological limits • Food-safety documentation',
    },
    fr: {
      title: 'Farine de legumineuses et proteines de pois',
      description:
        'Farines de legumineuses et concentrats proteiques pour formulations vegetales, panification et nutrition sportive.',
      origin: 'Usines de transformation canadiennes',
      category: 'Legumineuses et legumes secs',
      typicalQualityParameters:
        '• Teneur en proteines garantie • Humidite controlee • Granulometrie definie • Documentation complete de salubrite',
    },
    esp: {
      title: 'Harinas de legumbres y proteina de guisante',
      description:
        'Ingredientes proteicos y harinas de leguminosas para nutricion vegetal, alimentos funcionales y panificacion.',
      origin: 'Plantas procesadoras canadienses',
      category: 'Legumbres y leguminosas',
      typicalQualityParameters:
        '• Proteina a especificacion • Humedad controlada • Granulometria especificada • Certificaciones de inocuidad',
    },
  },
  {
    id: 'prod-wheat-gluten',
    slug: 'wheat-gluten-specialty-proteins',
    corridor: 'canada',
    categoryKey: 'horticulture',
    image: '/products/canadian/wheat-gluten-specialty-proteins.png',
    en: {
      title: 'Wheat Gluten / Specialty Proteins',
      description:
        'Protein ingredients used in bakery, food manufacturing, plant-based formulations and other functional food applications.',
      origin: 'Canadian processing facilities',
      category: 'Horticultural & Ingredients',
      typicalQualityParameters:
        '• Protein to specification • Functional properties specified • Controlled moisture • Food-grade requirements • Microbiological limits',
    },
    fr: {
      title: 'Gluten de ble et proteines de specialite',
      description:
        'Ingredients proteiques vitaux pour boulangerie, viandes vegetales et applications fonctionnelles agroalimentaires.',
      origin: 'Usines de transformation canadiennes',
      category: 'Produits horticoles et ingredients',
      typicalQualityParameters:
        '• Teneur elevee en proteines • Proprietes viscoelastiques validees • Humidite controlee • Salubrite alimentaire certifiee',
    },
    esp: {
      title: 'Gluten de trigo y proteinas funcionales',
      description:
        'Gluten de trigo vital y proteinas funcionales para panificacion, analogos carnicos y nutricion especializada.',
      origin: 'Plantas procesadoras canadienses',
      category: 'Horticultura e ingredientes',
      typicalQualityParameters:
        '• Proteina segun especificacion • Propiedades funcionales comprobadas • Humedad controlada • Parametros microbiologicos',
    },
  },
  {
    id: 'prod-french-fries',
    slug: 'frozen-french-fries-processed-potatoes',
    corridor: 'canada',
    categoryKey: 'horticulture',
    image: '/products/canadian/frozen-french-fries-processed-potatoes.png',
    en: {
      title: 'Frozen French Fries / Processed Potatoes',
      description:
        'Canadian potato products supplied for food service, retail and other frozen or processed-food applications.',
      origin: 'Alberta, Manitoba, New Brunswick, PEI, Canada',
      category: 'Horticultural & Ingredients',
      typicalQualityParameters:
        '• Cut/size specification • Defect tolerances • Food-safety requirements • Cold-chain integrity • Packaging specification',
    },
    fr: {
      title: 'Frites congelees et produits de pomme de terre',
      description:
        'Specialites surgelees de pommes de terre canadiennes pour restauration rapide, distributeurs et grandes surfaces.',
      origin: 'Alberta, Manitoba, Nouveau-Brunswick, IPE, Canada',
      category: 'Produits horticoles et ingredients',
      typicalQualityParameters:
        '• Calibre de coupe specifie • Tolerances de defauts controlees • Respect strict de la chaine du froid • Emballages professionnels',
    },
    esp: {
      title: 'Patatas fritas congeladas y procesados de patata',
      description:
        'Patatas congeladas de calidad canadiense para servicios de alimentacion, hosteleria y retail internacional.',
      origin: 'Alberta, Manitoba, Nuevo Brunswick, IPE, Canada',
      category: 'Horticultura e ingredientes',
      typicalQualityParameters:
        '• Corte y tamano especificados • Tolerancia de defectos reducida • Cadena de frio controlada • Envasado profesional',
    },
  },
  {
    id: 'prod-seed-potatoes',
    slug: 'seed-potatoes',
    corridor: 'canada',
    categoryKey: 'horticulture',
    image: '/products/canadian/seed-potatoes.png',
    en: {
      title: 'Seed Potatoes',
      description:
        'Certified Canadian seed potatoes supplied for commercial potato production in approved domestic and export markets.',
      origin: 'PEI, New Brunswick, Alberta, Manitoba, Canada',
      category: 'Horticultural & Ingredients',
      typicalQualityParameters:
        '• Certified seed class • Varietal purity • Disease requirements • Phytosanitary compliance • Destination requirements',
    },
    fr: {
      title: 'Semences de pommes de terre certifiees',
      description:
        'Tubercules de semence canadiens certifies pour production commerciale dans les marches approuves a l exportation.',
      origin: 'IPE, Nouveau-Brunswick, Alberta, Manitoba, Canada',
      category: 'Produits horticoles et ingredients',
      typicalQualityParameters:
        '• Classe de semence certifiee • Purete varietale garantie • Conformite phytosanitaire stricte • Absence de viroses majeures',
    },
    esp: {
      title: 'Patatas de siembra certificadas',
      description:
        'Tuberculos de siembra canadienses certificados para cultivo comercial en mercados con acuerdos fitosanitarios.',
      origin: 'IPE, Nuevo Brunswick, Alberta, Manitoba, Canada',
      category: 'Horticultura e ingredientes',
      typicalQualityParameters:
        '• Categoria de siembra certificada • Pureza varietal • Control de patogenos • Certificado fitosanitario oficial',
    },
  },
  {
    id: 'prod-blueberries',
    slug: 'blueberries',
    corridor: 'canada',
    categoryKey: 'horticulture',
    image: '/products/canadian/blueberries.png',
    en: {
      title: 'Blueberries',
      description:
        'Canadian cultivated and wild blueberries available in selected fresh, frozen and processed formats.',
      origin: 'British Columbia, Quebec, Atlantic Canada',
      category: 'Horticultural & Ingredients',
      typicalQualityParameters:
        '• Maturity/colour specification • Defect tolerances • Residue compliance • Food-safety requirements • Cold-chain controls',
    },
    fr: {
      title: 'Bleuets canadiens',
      description:
        'Bleuets sauvages et de culture canadiens disponibles en formats frais, surgeles individuellement (IQF) et transformes.',
      origin: 'Colombie-Britannique, Quebec, Canada atlantique',
      category: 'Produits horticoles et ingredients',
      typicalQualityParameters:
        '• Indice de maturite et couleur • Taux de defauts minimal • Respect des LMR • Maitrise de la chaine du froid',
    },
    esp: {
      title: 'Arandanos canadienses',
      description:
        'Arandanos cultivados y silvestres canadienses disponibles en formatos frescos, congelados IQF y preparados.',
      origin: 'Columbia Britanica, Quebec, Canada Atlantico',
      category: 'Horticultura e ingredientes',
      typicalQualityParameters:
        '• Color y madurez homogeneos • Tolerancia a defectos verificada • Cumplimiento de residuos • Cadena de frio continua',
    },
  },
  {
    id: 'prod-cranberries',
    slug: 'cranberries',
    corridor: 'canada',
    categoryKey: 'horticulture',
    image: '/products/canadian/cranberries.png',
    en: {
      title: 'Cranberries',
      description:
        'Canadian cranberries available fresh, frozen, dried or as processed ingredients for food and beverage applications.',
      origin: 'Quebec, British Columbia, Canada',
      category: 'Horticultural & Ingredients',
      typicalQualityParameters:
        '• Maturity/colour specification • Defect tolerances • Residue compliance • Food-safety requirements • Format-specific specifications',
    },
    fr: {
      title: 'Canneberges',
      description:
        'Canneberges canadiennes fraiches, congelees, sechees ou en concentres pour l agroalimentaire et les boissons.',
      origin: 'Quebec, Colombie-Britannique, Canada',
      category: 'Produits horticoles et ingredients',
      typicalQualityParameters:
        '• Couleur rouge caracteristique • Faibles defauts • Salubrite alimentaire verifiee • Teneur en brix selon format',
    },
    esp: {
      title: 'Arandanos rojos (Cranberries)',
      description:
        'Arandanos rojos canadienses frescos, congelados, deshidratados o en concentrados para bebidas y reposteria.',
      origin: 'Quebec, Columbia Britanica, Canada',
      category: 'Horticultura e ingredientes',
      typicalQualityParameters:
        '• Color y maduracion controlados • Minimos defectos • Inocuidad alimentaria certificada • Parametros por formato',
    },
  },
  {
    id: 'prod-maple-syrup',
    slug: 'maple-syrup-maple-sugar',
    corridor: 'canada',
    categoryKey: 'horticulture',
    image: '/products/canadian/maple-syrup-maple-sugar.png',
    en: {
      title: 'Maple Syrup / Maple Sugar',
      description:
        'Canadian maple syrup and sugar supplied for retail, food service and food-manufacturing applications.',
      origin: 'Quebec and Eastern Canada',
      category: 'Horticultural & Ingredients',
      typicalQualityParameters:
        '• Canadian grade requirements • Colour class specified • Food-safety compliance • Packaging specification • Traceability',
    },
    fr: {
      title: 'Sirop d erable et sucre d erable',
      description:
        'Sirop et sucre d erable canadiens de prestige pour la vente au detail, la restauration et les manufactures de confiserie.',
      origin: 'Quebec et Est du Canada',
      category: 'Produits horticoles et ingredients',
      typicalQualityParameters:
        '• Classification officielle canadienne • Classe de couleur certifiee • Salubrite certifiee • Tracabilite complete',
    },
    esp: {
      title: 'Sirope de arce y azucar de arce',
      description:
        'Jarabe y azucar de arce canadiense puro para distribucion comercial, pasteleria e industria alimentaria.',
      origin: 'Quebec y Este de Canada',
      category: 'Horticultura e ingredientes',
      typicalQualityParameters:
        '• Grado oficial canadiense • Clasificacion por color especificada • Inocuidad certificada • Trazabilidad garantizada',
    },
  },
  {
    id: 'prod-mustard-flour',
    slug: 'mustard-flour-ingredients',
    corridor: 'canada',
    categoryKey: 'spices',
    image: '/products/canadian/mustard-flour-ingredients.png',
    en: {
      title: 'Mustard Flour / Mustard Ingredients',
      description:
        'Processed mustard ingredients used in sauces, seasonings, meat products, prepared foods and condiment manufacturing.',
      origin: 'Prairie-grown / Canadian processors',
      category: 'Spices & Botanicals',
      typicalQualityParameters:
        '• Particle size specified • Controlled moisture • Pungency/functionality to specification • Food-grade requirements • Microbiological limits',
    },
    fr: {
      title: 'Farine de moutarde et derives',
      description:
        'Farines et semoules de moutarde pour charcuterie, sauces de table, mayonnaises et melanges d assaisonnements.',
      origin: 'Prairies canadiennes / Meuneries specialisees',
      category: 'Epices et aromates',
      typicalQualityParameters:
        '• Granulometrie controlee • Humidite stabilisee • Piquant et fonctionnalite a la demande • Criteres microbiologiques',
    },
    esp: {
      title: 'Harina de mostaza e ingredientes derivados',
      description:
        'Harinas de mostaza y productos funcionales para salsas, condimentos, carnes procesadas y alimentos preparados.',
      origin: 'Cultivo en Praderas / Procesadores canadienses',
      category: 'Especias y aromaticos',
      typicalQualityParameters:
        '• Granulometria definida • Humedad controlada • Picor segun especificacion • Grado alimentario riguroso',
    },
  },
  {
    id: 'prod-pet-feed',
    slug: 'pet-food-livestock-feed',
    corridor: 'canada',
    categoryKey: 'horticulture',
    image: '/products/canadian/pet-food-livestock-feed.png',
    en: {
      title: 'Pet Food / Livestock Feed Preparations',
      description:
        'Canadian feed ingredients and preparations for livestock and companion-animal nutrition applications.',
      origin: 'Multiple Canadian provinces',
      category: 'Horticultural & Ingredients',
      typicalQualityParameters:
        '• Nutritional specification • Ingredient declaration • Controlled moisture • Feed-safety compliance • Contaminant limits',
    },
    fr: {
      title: 'Aliments pour animaux de compagnie et d elevage',
      description:
        'Ingredients canadiens de haute qualite pour la formulation d aliments pour animaux de compagnie et le betail.',
      origin: 'Provinces canadiennes',
      category: 'Produits horticoles et ingredients',
      typicalQualityParameters:
        '• Profil nutritionnel conforme • Declaration stricte des composants • Humidite controlee • Salubrite zootechnique',
    },
    esp: {
      title: 'Ingredientes para nutricion animal y mascotas',
      description:
        'Ingredientes canadienses para alimentacion de mascotas y formulaciones nutricionales para ganado.',
      origin: 'Diversas provincias de Canada',
      category: 'Horticultura e ingredientes',
      typicalQualityParameters:
        '• Perfil nutricional garantizado • Declaracion de ingredientes transparente • Control de humedad • Limites microbiologicos',
    },
  },

  // ==========================================
  // ADDITIONAL TROPICAL & WEST AFRICAN COMMODITIES
  // ==========================================
  {
    id: 'prod-hibiscus',
    slug: 'dried-hibiscus-flowers',
    corridor: 'africa',
    categoryKey: 'spices',
    image: '/products/dried-hibiscus-flowers.png',
    en: {
      title: 'Dried Hibiscus Flowers (Zobo)',
      description:
        'Dark red whole calyces with high anthocyanin content and characteristic tartness for herbal teas and beverage infusions.',
      origin: 'Nigeria, West Africa',
      category: 'Spices & Botanicals',
      typicalQualityParameters:
        '• Moisture: < 11% • Total ash: < 10% • Acid-insoluble ash: < 1.5% • Carefully sifted for low dust and debris',
    },
    fr: {
      title: 'Fleurs d hibiscus sechees (Bissap)',
      description:
        'Calices entiers rouge fonce riches en anthocyanes et acidite rafraichissante pour tisanes, extraits et boissons.',
      origin: 'Nigeria, Afrique de l Ouest',
      category: 'Epices et aromates',
      typicalQualityParameters:
        '• Humidite: < 11% • Cendres totales: < 10% • Cendres insolubles: < 1.5% • Tamise soigneusement',
    },
    esp: {
      title: 'Flores de hibisco secas (Flor de Jamaica)',
      description:
        'Calices enteros de color rojo oscuro con alto contenido de antocianinas para infusiones, bebidas y extractos.',
      origin: 'Nigeria, Africa Occidental',
      category: 'Especias y aromaticos',
      typicalQualityParameters:
        '• Humedad: < 11% • Cenizas totales: < 10% • Cenizas insolubles: < 1.5% • Tamizado para minimo polvo',
    },
  },
  {
    id: 'prod-tiger-nuts',
    slug: 'tiger-nuts',
    corridor: 'africa',
    categoryKey: 'oilseeds',
    image: '/products/tiger-nuts.png',
    en: {
      title: 'Tiger Nuts',
      description:
        'Clean washed sun-dried tiger nuts (Cyperus esculentus) rich in prebiotic fiber, oleic acid, and natural sweetness.',
      origin: 'West Africa',
      category: 'Oilseeds, Nuts & Seeds',
      typicalQualityParameters:
        '• Moisture: < 9% • Caliber: 8 to 12 mm • Foreign matter: < 0.5% • Free from mould and insect damage',
    },
    fr: {
      title: 'Souchet comestible seche (Tigernuts)',
      description:
        'Tubercules de souchet laves et seches au soleil, riches en fibres prebiotiques et douceur naturelle.',
      origin: 'Afrique de l Ouest',
      category: 'Graines oleagineuses',
      typicalQualityParameters:
        '• Humidite: < 9% • Calibres: 8 a 12 mm • Impuretes: < 0.5% • Absence d insectes et moisissures',
    },
    esp: {
      title: 'Chufa seca (Tiger nuts)',
      description:
        'Chufas limpias secadas al sol ricas en fibra prebiotica y azucares naturales para horchata y bebidas vegetales.',
      origin: 'Africa Occidental',
      category: 'Semillas oleaginosas',
      typicalQualityParameters:
        '• Humedad: < 9% • Calibre: 8 a 12 mm • Materia extrana: < 0.5% • Sin picaduras ni moho',
    },
  },
  {
    id: 'prod-ginger-slices',
    slug: 'ginger-rhizome-slices',
    corridor: 'africa',
    categoryKey: 'spices',
    image: '/products/ginger-rhizome-slices.png',
    en: {
      title: 'Ginger Rhizome Slices',
      description:
        'Uniform thin ginger slices prepared from mature roots for tea blending, extraction, and culinary food preparations.',
      origin: 'Nigeria, West Africa',
      category: 'Spices & Botanicals',
      typicalQualityParameters:
        '• Moisture: < 10% • Volatile oil: > 1.8% • Thickness: 2 to 4 mm • Pure varietal ginger root',
    },
    fr: {
      title: 'Lamelles de rhizome de gingembre',
      description:
        'Lamelles fines et regulieres de gingembre pour infusions, extraits alimentaires et preparations culinaires.',
      origin: 'Nigeria, Afrique de l Ouest',
      category: 'Epices et aromates',
      typicalQualityParameters:
        '• Humidite: < 10% • Huile volatile: > 1.8% • Epaisseur: 2 a 4 mm • Rhizomes murs sans additifs',
    },
    esp: {
      title: 'Rodajas de rizoma de jengibre',
      description:
        'Rodajas deshidratadas de jengibre para te, infusiones herbales y elaboraciones culinarias.',
      origin: 'Nigeria, Africa Occidental',
      category: 'Especias y aromaticos',
      typicalQualityParameters:
        '• Humedad: < 10% • Aceite volatil: > 1.8% • Grosor: 2 a 4 mm • Calidad exportacion',
    },
  },
  {
    id: 'prod-hardwood-charcoal',
    slug: 'hardwood-charcoal',
    corridor: 'africa',
    categoryKey: 'spices',
    image: '/products/hardwood-charcoal.png',
    en: {
      title: 'Hardwood Charcoal',
      description:
        'Dense hardwood lump charcoal produced through sustainable kilning for high heat output and low ash residue.',
      origin: 'West Africa',
      category: 'Spices & Botanicals',
      typicalQualityParameters:
        '• Fixed carbon: > 75% • Moisture: < 6% • Ash content: < 4% • High calorific value • Low spark and smoke',
    },
    fr: {
      title: 'Charbon de bois dur',
      description:
        'Charbon de bois dur dense a haute valeur calorifique et faible teneur en cendres pour usages professionnels.',
      origin: 'Afrique de l Ouest',
      category: 'Epices et aromates',
      typicalQualityParameters:
        '• Carbone fixe: > 75% • Humidite: < 6% • Taux de cendres: < 4% • Combustion longue et reguliere',
    },
    esp: {
      title: 'Carbon vegetal de madera dura',
      description:
        'Carbon vegetal vegetal de alta densidad con elevado poder calorifico y bajo residuo de ceniza.',
      origin: 'Africa Occidental',
      category: 'Especias y aromaticos',
      typicalQualityParameters:
        '• Carbono fijo: > 75% • Humedad: < 6% • Ceniza: < 4% • Alto poder calorifico sin chispas',
    },
  },
  {
    id: 'prod-shea-nuts',
    slug: 'raw-shea-nuts',
    corridor: 'africa',
    categoryKey: 'oilseeds',
    image: '/products/raw-shea-nuts.png',
    en: {
      title: 'Raw Shea Nuts',
      description:
        'Sun-dried raw shea nuts (Vitellaria paradoxa) harvested from wild savannah trees with high oil yield for butter processing.',
      origin: 'West Africa',
      category: 'Oilseeds, Nuts & Seeds',
      typicalQualityParameters:
        '• Oil content: 48 to 52% • Moisture: < 7% • Free fatty acids (FFA): < 4% • Clean kernels with low foreign matter',
    },
    fr: {
      title: 'Noix de karite brutes',
      description:
        'Noix de karite sauvages de savane sechees au soleil, a haute teneur en matiere grasse pour le pressage.',
      origin: 'Afrique de l Ouest',
      category: 'Graines oleagineuses',
      typicalQualityParameters:
        '• Teneur en huile: 48 a 52% • Humidite: < 7% • FFA: < 4% • Noix saines bien calibrees',
    },
    esp: {
      title: 'Nueces de karite crudas',
      description:
        'Nueces de karite secadas al sol con alto rendimiento en aceite para extraccion y refinado.',
      origin: 'Africa Occidental',
      category: 'Semillas oleaginosas',
      typicalQualityParameters:
        '• Contenido de aceite: 48 a 52% • Humedad: < 7% • FFA: < 4% • Granos seleccionados sin impurezas',
    },
  },
  {
    id: 'prod-turmeric-fingers',
    slug: 'turmeric-fingers',
    corridor: 'africa',
    categoryKey: 'spices',
    image: '/products/turmeric-fingers.png',
    en: {
      title: 'Turmeric Fingers',
      description:
        'Cured and polished whole turmeric fingers with vibrant golden-yellow core and rich curcumin content.',
      origin: 'West Africa',
      category: 'Spices & Botanicals',
      typicalQualityParameters:
        '• Curcumin content: > 3.5% • Moisture: < 10% • Extraneous matter: < 1% • Solid sound fingers',
    },
    fr: {
      title: 'Doigts de curcuma entiers',
      description:
        'Doigts entiers de curcuma traites et polis a couleur doree intense et forte concentration en curcumine.',
      origin: 'Afrique de l Ouest',
      category: 'Epices et aromates',
      typicalQualityParameters:
        '• Curcumine: > 3.5% • Humidite: < 10% • Matieres etrangeres: < 1% • Racines denses et saines',
    },
    esp: {
      title: 'Dedos de curcuma enteros',
      description:
        'Rizomas enteros de curcuma curados y pulidos con alto contenido de curcumina y color dorado brillante.',
      origin: 'Africa Occidental',
      category: 'Especias y aromaticos',
      typicalQualityParameters:
        '• Curcumina: > 3.5% • Humedad: < 10% • Impurezas: < 1% • Rizomas sanos y uniformes',
    },
  },
  {
    id: 'prod-whole-cloves',
    slug: 'whole-cloves',
    corridor: 'africa',
    categoryKey: 'spices',
    image: '/products/whole-cloves.png',
    en: {
      title: 'Whole Cloves',
      description:
        'Sun-dried whole aromatic clove flower buds (Syzygium aromaticum) packed with essential eugenol oil.',
      origin: 'West Africa',
      category: 'Spices & Botanicals',
      typicalQualityParameters:
        '• Eugenol oil: > 15% • Moisture: < 12% • Head intact: > 90% • Stems/debris: < 2%',
    },
    fr: {
      title: 'Clous de girofle entiers',
      description:
        'Boutons floraux entiers de giroflier seches au soleil, riches en eugenol et arome puissant.',
      origin: 'Afrique de l Ouest',
      category: 'Epices et aromates',
      typicalQualityParameters:
        '• Huile d eugenol: > 15% • Humidite: < 12% • Tetes intactes: > 90% • Queues: < 2%',
    },
    esp: {
      title: 'Clavos de olor enteros',
      description:
        'Botones florales aromaticos enteros de clavo secados al sol con alto contenido de eugenol.',
      origin: 'Africa Occidental',
      category: 'Especias y aromaticos',
      typicalQualityParameters:
        '• Aceite de eugenol: > 15% • Humedad: < 12% • Cabezas intactas: > 90% • Impurezas: < 2%',
    },
  },
  {
    id: 'prod-kolanut',
    slug: 'fresh-kola-nuts',
    corridor: 'africa',
    categoryKey: 'spices',
    image: '/products/fresh-kola-nuts.png',
    en: {
      title: 'Fresh & Dried Kola Nuts',
      description:
        'Authentic West African kola nuts (Cola acuminata and Cola nitida) harvested and graded for traditional and industrial uses.',
      origin: 'Nigeria, West Africa',
      category: 'Spices & Botanicals',
      typicalQualityParameters:
        '• Moisture: < 10% for dried • Hand sorted • Clean nuts • Freedom from mould and weevils',
    },
    fr: {
      title: 'Noix de cola fraiches et sechees',
      description:
        'Noix de cola authentiques d Afrique de l Ouest triees manuellement pour usages traditionnels et industriels.',
      origin: 'Nigeria, Afrique de l Ouest',
      category: 'Epices et aromates',
      typicalQualityParameters:
        '• Humidite: < 10% pour les sechees • Triage manuel soigneux • Sans moisissures ni charancons',
    },
    esp: {
      title: 'Nuez de cola fresca y seca',
      description:
        'Nueces de cola autenticas de Africa Occidental seleccionadas a mano para aplicaciones farmaceuticas y tradicionales.',
      origin: 'Nigeria, Africa Occidental',
      category: 'Especias y aromaticos',
      typicalQualityParameters:
        '• Humedad: < 10% en secas • Seleccion manual • Libres de plagas y hongos',
    },
  },
  {
    id: 'prod-whole-ginger',
    slug: 'whole-ginger-root',
    corridor: 'africa',
    categoryKey: 'spices',
    image: '/products/whole-ginger-root.png',
    en: {
      title: 'Whole Dried Ginger Root',
      description:
        'Selected whole dried ginger rhizomes offering concentrated pungency for industrial grinding and food formulations.',
      origin: 'Nigeria, West Africa',
      category: 'Spices & Botanicals',
      typicalQualityParameters:
        '• Moisture: < 12% • Oleoresin: > 2.0% • Ash: < 8% • Clean peeled or unpeeled sound roots',
    },
    fr: {
      title: 'Racine de gingembre sechee entiere',
      description:
        'Rhizomes entiers de gingembre seche a forte saveur piquante pour mouture industrielle et melanges d epices.',
      origin: 'Nigeria, Afrique de l Ouest',
      category: 'Epices et aromates',
      typicalQualityParameters:
        '• Humidite: < 12% • Oleoresine: > 2.0% • Cendres: < 8% • Racines saines nettoyees',
    },
    esp: {
      title: 'Raiz entera de jengibre seco',
      description:
        'Rizomas enteros de jengibre seco de sabor intenso para molienda industrial y preparados alimentarios.',
      origin: 'Nigeria, Africa Occidental',
      category: 'Especias y aromaticos',
      typicalQualityParameters:
        '• Humedad: < 12% • Oleorresina: > 2.0% • Cenizas: < 8% • Raices limpias sin defectos',
    },
  },
];

/**
 * Returns localized ProductContent items for the entire portfolio
 */
export function getPortfolioProducts(locale?: string): ProductContent[] {
  const loc = (locale || 'en').toLowerCase().trim();
  const langKey = loc.startsWith('fr') ? 'fr' : (loc.startsWith('es') || loc === 'esp') ? 'esp' : 'en';

  return COMMODITY_PORTFOLIO.map((c, idx) => {
    const locData = c[langKey];
    const isFeatured = Boolean(c.isFeatured);

    return {
      _id: c.id,
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:00:00.000Z' },
      _updatedDate: { $date: '2026-10-06T20:00:00.000Z' },
      isActive: true,
      title: locData.title,
      productName: locData.title,
      slug: c.slug,
      corridor: c.corridor,
      description: locData.description,
      category: locData.category,
      sourcingOrigin: locData.origin,
      typicalQualityParameters: locData.typicalQualityParameters,
      qualityStandards: locData.typicalQualityParameters, // backward compat alias
      isFeatured,
      displayLogistics: Boolean(c.displayLogistics),
      packagingLogistics: locData.packagingLogistics || '',
      image1: c.image,
      images: [c.image],
      sku: `AGV-${c.slug.toUpperCase().replace(/-/g, '').slice(0, 8)}`,
      inStock: true,
      sortOrder: idx,
    };
  });
}
