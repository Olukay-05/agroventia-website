// src/lib/translation/agribusiness-glossary.ts

/**
 * Standardized Agribusiness System Prompt enforcing Canadian Federal (CFIA/ACIA) compliance,
 * Quebec OQLF linguistic standards, formal B2B International Spanish, and strict Anti-Slop / No-Dash rules.
 */
export const AGROVENTIA_SYSTEM_PROMPT = `
You are the Chief Multilingual Agricultural Trade Translator for AgroVentia Inc., 
a premier Canadian agricultural export-import corporation operating in Ontario and Western Canada.

Translate the provided English commercial agricultural text into:
1. Authentic Canadian French (fr-CA): Adhere strictly to the Office québécois de la langue française (OQLF) and Canadian Food Inspection Agency (CFIA / ACIA) terminology.
2. Professional B2B International Spanish (es): Use formal Latin American and international commercial trade Spanish ("Usted" tone, rigorous phytosanitary and export terminology).

CRITICAL ANTI-AI SLOP & EDITORIAL TONE RULES:
- NO AI BUZZWORDS OR FILLER: Never use tropes or hype phrases like "testament to", "delve", "cutting-edge", "game-changing", "seamlessly", "revolutionizing", "leverage", "robust", "pivotal", or "fostering".
- GROUNDED TRADE STYLE: Keep tone factual, direct, and professional. Focus on purity, origin, harvest season, moisture specifications, packaging, and phytosanitary verification.
- STRICT DASH PROHIBITION: DO NOT use em-dashes (—), en-dashes (–), or floating hyphens (-) between text clauses as pauses or separators. Use natural sentence punctuation (commas, periods, or colons).
- TECHNICAL INVARIANCE: Never alter, round, or hallucinate numbers, percentages, or units (e.g. moisture %, FFA %, metric tonnes, packaging sizes, nut counts).
- ACRONYMS: Maintain standard trade compliance acronyms (CFIA/ACIA, FDA, SGS, ISO 22000, HACCP).

COMMODITY NOMENCLATURE BENCHMARKS:
- Kolanut (Cola acuminata / Garcinia kola) -> fr-CA: "Noix de cola séchée" | es: "Nuez de cola seca"
- Dried Split Ginger -> fr-CA: "Gingembre séché concassé" | es: "Jengibre seco troceado"
- Raw Cashew Nuts (In-shell) -> fr-CA: "Noix d'anacarde brutes (en coque)" | es: "Nueces de anacardo crudas (con cáscara)"
- Natural White Sesame Seeds -> fr-CA: "Graines de sésame blanc naturel" | es: "Semillas de sésamo blanco natural"
- Premium Fermented Cocoa Beans -> fr-CA: "Fèves de cacao fermentées de première qualité" | es: "Granos de cacao fermentados de calidad superior"
- Dried Hibiscus Flowers (Karkadé / Flor de Jamaica) -> fr-CA: "Fleurs d'hibiscus séchées (Karkadé)" | es: "Flores de hibisco secas (Flor de Jamaica)"
- Unrefined Shea Butter -> fr-CA: "Beurre de karité brut non raffiné" | es: "Manteca de karité pura sin refinar"
- Dried Chili Peppers -> fr-CA: "Piments séchés (Pili-pili)" | es: "Chiles secos (Ojo de pájaro)"
- Gum Arabic (Acacia) -> fr-CA: "Gomme arabique naturelle (Acacia)" | es: "Goma arábiga natural (Acacia)"
- Cassava Starch / Chips -> fr-CA: "Fécule et cossettes de manioc" | es: "Almidón y hojuelas de yuca"
- Tiger Nuts (Chufa) -> fr-CA: "Souchet comestible séché" | es: "Chufas secas seleccionadas"
- Black Peppercorns -> fr-CA: "Poivre noir entier de qualité export" | es: "Pimienta negra en grano grado exportación"
- Phytosanitary certified -> fr-CA: "Certifié phytosanitaire (conforme ACIA)" | es: "Certificado fitosanitario"
- Traceability -> fr-CA: "Traçabilité intégrale" | es: "Trazabilidad completa"
`.trim();

/**
 * Deterministic Agricultural Trade Dictionary for Offline Fallback, Tests, and Baseline Seeding.
 * Guarantees zero AI slop, zero em-dashes, and exact trade compliance.
 */
export const DETERMINISTIC_FALLBACK_DICTIONARY: Record<
  string,
  { fr: string; esp: string }
> = {
  // Headlines & Core CTAs
  'Simplifying global sourcing with reliable, premium agricultural products.': {
    fr: "Simplifier l'approvisionnement mondial avec des produits agricoles fiables et de première qualité.",
    esp: 'Simplificando el abastecimiento global con productos agrícolas confiables y de primera calidad.',
  },
  'Premium Agricultural Imports from West Africa': {
    fr: "Importations agricoles de première qualité d'Afrique de l'Ouest",
    esp: 'Importaciones agrícolas de primera calidad desde África Occidental',
  },
  'Connecting Global Markets with Quality Agricultural Products': {
    fr: 'Connecter les marchés mondiaux avec des produits agricoles de qualité',
    esp: 'Conectando mercados globales con productos agrícolas de calidad',
  },
  'Explore Products': {
    fr: 'Explorer les produits',
    esp: 'Explorar productos',
  },
  'Request a Quote': {
    fr: 'Demander un devis',
    esp: 'Solicitar cotización',
  },
  'Contact Us': {
    fr: 'Contactez-nous',
    esp: 'Contáctenos',
  },
  'Get in Touch': {
    fr: 'Entrer en communication',
    esp: 'Póngase en contacto',
  },

  // Commodity 1: Dried Kolanut
  'Dried Kolanut': {
    fr: 'Noix de cola séchée',
    esp: 'Nuez de cola seca',
  },
  'Premium grade dried kolanut sourced directly from certified West African growers. Carefully selected and naturally dried to maintain potency and authentic characteristics for beverage and pharmaceutical applications.': {
    fr: "Noix de cola séchée de qualité supérieure, provenant directement de producteurs certifiés d'Afrique de l'Ouest. Soigneusement sélectionnée et séchée naturellement pour préserver ses propriétés et ses caractéristiques authentiques pour les industries des boissons et pharmaceutique.",
    esp: 'Nuez de cola seca de primera calidad procedente directamente de productores certificados de África Occidental. Cuidadosamente seleccionada y secada de forma natural para mantener sus propiedades y características auténticas para aplicaciones farmacéuticas y de bebidas.',
  },
  'Moisture: < 10%, FFA: < 2%, Cleaned and hand-sorted, CFIA compliant': {
    fr: 'Humidité: < 10%, FFA: < 2%, Nettoyé et trié à la main, conforme ACIA',
    esp: 'Humedad: < 10%, FFA: < 2%, Limpiado y seleccionado a mano, conforme a normas internacionales',
  },

  // Commodity 2: Split Dried Ginger
  'Split Dried Ginger': {
    fr: 'Gingembre séché concassé',
    esp: 'Jengibre seco troceado',
  },
  'Organic Split Ginger': {
    fr: 'Gingembre séché biologique concassé',
    esp: 'Jengibre seco orgánico troceado',
  },
  'Sun-dried split ginger with robust aroma and high oleoresin content. Sourced from organic farming communities in West Africa, ideal for spice processing, extraction, and culinary distribution.': {
    fr: "Gingembre concassé séché au soleil, à l'arôme intense et à haute teneur en oléorésine. Issu de communautés agricoles biologiques d'Afrique de l'Ouest, idéal pour la transformation d'épices, l'extraction et la distribution alimentaire.",
    esp: 'Jengibre troceado secado al sol con intenso aroma y alto contenido de oleorresina. Procedente de comunidades agrícolas orgánicas de África Occidental, ideal para procesamiento de especias, extracción y distribución culinaria.',
  },
  'Moisture: < 12%, Volatile oil: > 1.5%, Impurities: < 1%': {
    fr: 'Humidité: < 12%, Huile volatile: > 1.5%, Impuretés: < 1%',
    esp: 'Humedad: < 12%, Aceite volátil: > 1.5%, Impurezas: < 1%',
  },

  // Commodity 3: Raw Cashew Nuts
  'Raw Cashew Nuts': {
    fr: "Noix d'anacarde brutes (en coque)",
    esp: 'Nueces de anacardo crudas (con cáscara)',
  },
  'Raw Cashew Nuts (In-shell)': {
    fr: "Noix d'anacarde brutes (en coque)",
    esp: 'Nueces de anacardo crudas (con cáscara)',
  },
  'High outturn raw cashew nuts in shell. Harvested and dried under controlled conditions to ensure optimal kernel yield and low defective rates for industrial processing facilities.': {
    fr: "Noix d'anacarde brutes en coque à haut rendement KOR. Récoltées et séchées dans des conditions contrôlées pour garantir un rendement optimal en amandes et un très faible taux de défauts pour les unités de transformation industrielle.",
    esp: 'Nueces de anacardo crudas con cáscara de alto rendimiento KOR. Cosechadas y secadas bajo condiciones controladas para garantizar un rendimiento óptimo de almendra y bajo índice de defectos para instalaciones de procesamiento industrial.',
  },
  'Nut count: 180 to 200 per kg, Outturn: 48 to 50 lbs, Moisture: < 9%': {
    fr: 'Nombre de noix: 180 à 200 par kg, Rendement KOR: 48 à 50 lbs, Humidité: < 9%',
    esp: 'Conteo de nueces: 180 a 200 por kg, Rendimiento KOR: 48 a 50 lbs, Humedad: < 9%',
  },

  // Commodity 4: Natural White Sesame Seeds
  'Natural White Sesame Seeds': {
    fr: 'Graines de sésame blanc naturel',
    esp: 'Semillas de sésamo blanco natural',
  },
  'Mechanically cleaned natural white sesame seeds with uniform color and exceptional purity. Sourced from prime agricultural zones, perfect for bakery, tahini production, and oil crushing.': {
    fr: "Graines de sésame blanc naturel nettoyées mécaniquement, de couleur uniforme et d'une pureté remarquable. Cultivées dans les principales zones agricoles, parfaites pour la boulangerie, la production de tahini et le pressage d'huile.",
    esp: 'Semillas de sésamo blanco natural limpiadas mecánicamente, con color uniforme y pureza excepcional. Procedentes de zonas agrícolas principales, perfectas para panadería, elaboración de tahini y molienda de aceite.',
  },
  'Purity: 99.5% min, Moisture: < 6%, Oil content: > 50%': {
    fr: 'Pureté: 99.5% min, Humidité: < 6%, Teneur en huile: > 50%',
    esp: 'Pureza: 99.5% mín, Humedad: < 6%, Contenido de aceite: > 50%',
  },

  // Commodity 5: Premium Fermented Cocoa Beans
  'Premium Fermented Cocoa Beans': {
    fr: 'Fèves de cacao fermentées de première qualité',
    esp: 'Granos de cacao fermentados de calidad superior',
  },
  'Well-fermented and thoroughly dried cocoa beans with rich chocolate notes and low acidity. Fully traceable to cooperative farm networks adhering to strict child-labor-free and sustainability standards.': {
    fr: "Fèves de cacao bien fermentées et rigoureusement séchées, aux notes riches de chocolat et à faible acidité. Entièrement traçables auprès de réseaux coopératifs respectant des normes strictes de durabilité et d'absence de travail des enfants.",
    esp: 'Granos de cacao bien fermentados y completamente secos, con notas profundas de chocolate y baja acidez. Totalmente trazables a redes de cooperativas agrícolas que cumplen con estrictas normas de sostenibilidad y trabajo ético.',
  },
  'Bean count: 95 to 105 per 100g, Moisture: < 7.5%, Defective: < 3%': {
    fr: 'Nombre de fèves: 95 à 105 par 100g, Humidité: < 7.5%, Défauts: < 3%',
    esp: 'Conteo de granos: 95 a 105 por 100g, Humedad: < 7.5%, Defectos: < 3%',
  },

  // Commodity 6: Dried Hibiscus Calyces
  'Dried Hibiscus Calyces': {
    fr: "Fleurs d'hibiscus séchées (Karkadé)",
    esp: 'Flores de hibisco secas (Flor de Jamaica)',
  },
  'Dried Hibiscus Flowers (Flor de Jamaica)': {
    fr: "Fleurs d'hibiscus séchées (Karkadé)",
    esp: 'Flores de hibisco secas (Flor de Jamaica)',
  },
  'Whole dark-red hibiscus calyces with high anthocyanin content and sharp tartness. Thoroughly sieved to minimize dust and foreign matter, suitable for herbal teas, extracts, and food coloring.': {
    fr: "Calices entiers d'hibiscus rouge foncé à haute teneur en anthocyanes et acidité franche. Rigoureusement tamisés pour éliminer poussières et corps étrangers, convenant aux infusions, aux extraits et aux colorants alimentaires naturels.",
    esp: 'Cálices enteros de hibisco color rojo oscuro con alto contenido de antocianinas y acidez característica. Cuidadosamente tamizados para reducir polvo y materias extrañas, aptos para infusiones, extractos y colorantes alimentarios naturales.',
  },
  'Moisture: < 11%, Total ash: < 10%, Acid insoluble ash: < 1.5%': {
    fr: 'Humidité: < 11%, Cendres totales: < 10%, Cendres insolubles: < 1.5%',
    esp: 'Humedad: < 11%, Cenizas totales: < 10%, Cenizas insolubles en ácido: < 1.5%',
  },

  // Commodity 7: Unrefined Shea Butter
  'Unrefined Shea Butter': {
    fr: 'Beurre de karité brut non raffiné',
    esp: 'Manteca de karité pura sin refinar',
  },
  'Traditional hand-crafted unrefined shea butter from women cooperative networks in West Africa. Grade A quality with characteristic nutty aroma and ivory-to-pale-yellow color, ideal for cosmetic and pharmaceutical formulating.': {
    fr: "Beurre de karité brut artisanal préparé par des réseaux de coopératives de femmes en Afrique de l'Ouest. Qualité Grade A avec arôme caractéristique de noisette et teinte ivoire, idéal pour la formulation cosmétique et pharmaceutique.",
    esp: 'Manteca de karité pura sin refinar elaborada artesanalmente por cooperativas de mujeres en África Occidental. Calidad Grado A con aroma característico y tonalidad marfil, ideal para formulaciones cosméticas y farmacéuticas.',
  },
  'Grade A, FFA: < 1%, Peroxide value: < 5 meq/kg, Water: < 0.5%': {
    fr: 'Grade A, FFA: < 1%, Indice de peroxyde: < 5 meq/kg, Eau: < 0.5%',
    esp: 'Grado A, FFA: < 1%, Índice de peróxido: < 5 meq/kg, Agua: < 0.5%',
  },

  // Commodity 8: Dried Chili Peppers
  'Dried Chili Peppers (Bird’s Eye)': {
    fr: 'Piments séchés (Œil d’oiseau)',
    esp: 'Chiles secos (Ojo de pájaro)',
  },
  'Dried Chili Peppers': {
    fr: 'Piments séchés de qualité export',
    esp: 'Chiles secos grado exportación',
  },
  'Intensely hot whole dried bird’s eye chili peppers. Uniformly dried to retain vivid red coloration and high capsaicin concentration for hot sauces, seasoning blends, and industrial capsaicin extraction.': {
    fr: "Piments œil d'oiseau entiers et séchés d'une chaleur intense. Séchage homogène préservant la vive couleur rouge et la forte teneur en capsaïcine pour les sauces piquantes, mélanges d'épices et extractions industrielles.",
    esp: 'Chiles ojo de pájaro enteros y secos de intenso picor. Secado uniforme para conservar el color rojo brillante y la alta concentración de capsaicina para salsas, condimentos y extracción industrial.',
  },
  'Scoville: 80,000 to 120,000 SHU, Moisture: < 10%, Foreign matter: < 1%': {
    fr: 'Scoville: 80 000 à 120 000 SHU, Humidité: < 10%, Matières étrangères: < 1%',
    esp: 'Scoville: 80 000 a 120 000 SHU, Humedad: < 10%, Materia extraña: < 1%',
  },

  // Commodity 9: Gum Arabic
  'Gum Arabic (Acacia)': {
    fr: 'Gomme arabique naturelle (Acacia)',
    esp: 'Goma arábiga natural (Acacia)',
  },
  'High-purity Acacia senegal and Acacia seyal gum tears. Naturally harvested and hand-graded for pharmaceutical, beverage stabilization, confectionery, and lithographic applications.': {
    fr: "Larmes de gomme Acacia senegal et Acacia seyal de haute pureté. Récoltées naturellement et triées à la main pour les applications pharmaceutiques, la stabilisation des boissons, la confiserie et l'industrie.",
    esp: 'Lágrimas de goma Acacia senegal y Acacia seyal de alta pureté. Cosechadas de manera natural y seleccionadas a mano para aplicaciones farmacéuticas, estabilización de bebidas, confitería y usos industriales.',
  },
  'Grade 1 (Senegal) and Grade 2 (Seyal), Moisture: < 12%, Total ash: < 4%': {
    fr: 'Grade 1 (Senegal) et Grade 2 (Seyal), Humidité: < 12%, Cendres totales: < 4%',
    esp: 'Grado 1 (Senegal) y Grado 2 (Seyal), Humedad: < 12%, Cenizas totales: < 4%',
  },

  // Commodity 10: Cassava Starch / Chips
  'Cassava Starch / Chips': {
    fr: 'Fécule et cossettes de manioc',
    esp: 'Almidón y hojuelas de yuca',
  },
  'Industrial grade dried cassava chips and refined food-grade tapioca starch. Produced from mature, non-GMO cassava roots, providing high gelatinization properties for food production and bio-industrial feedstocks.': {
    fr: "Cossettes de manioc séchées de qualité industrielle et fécule de manioc raffinée de qualité alimentaire. Produites à partir de racines de manioc matures sans OGM, offrant d'excellentes propriétés de gélatinisation pour l'agroalimentaire.",
    esp: 'Hojuelas de yuca seca de grado industrial y almidón refinado de grado alimentario. Producidos a partir de raíces de yuca madura no transgénica, proporcionando excelentes propiedades de gelatinización para la industria alimentaria.',
  },
  'Starch content: > 85%, Moisture: < 12%, Fiber: < 2%': {
    fr: 'Teneur en amidon: > 85%, Humidité: < 12%, Fibres: < 2%',
    esp: 'Contenido de almidón: > 85%, Humedad: < 12%, Fibra: < 2%',
  },

  // Commodity 11: Tiger Nuts (Chufa)
  'Tiger Nuts (Chufa)': {
    fr: 'Souchet comestible séché',
    esp: 'Chufas secas seleccionadas',
  },
  'Selected washed and dried tiger nut tubers (Cyperus esculentus). Rich in prebiotic fiber, oleic acid, and natural sweetness, ideal for dairy-free milk alternatives, horchata production, and gluten-free milling.': {
    fr: "Tubercules de souchet comestible lavés et séchés (Cyperus esculentus). Riches en fibres prébiotiques, en acide oléique et en douceur naturelle, parfaits pour les substituts laitiers végétaux, l'horchata et les farines sans gluten.",
    esp: 'Tubérculos de chufa lavados y secos seleccionados (Cyperus esculentus). Ricos en fibra prebiótica, ácido oleico y dulzura natural, ideales para alternativas lácteas vegetales, producción de horchata y molienda sin gluten.',
  },
  'Moisture: < 9%, Sizes: 8 to 12 mm, Impurities: < 0.5%': {
    fr: 'Humidité: < 9%, Calibres: 8 à 12 mm, Impuretés: < 0.5%',
    esp: 'Humedad: < 9%, Calibres: 8 a 12 mm, Impurezas: < 0.5%',
  },

  // Commodity 12: Black Peppercorns
  'Black Peppercorns': {
    fr: 'Poivre noir entier de qualité export',
    esp: 'Pimienta negra en grano grado exportación',
  },
  'Whole sun-dried black peppercorns from trusted West African smallholder cooperatives. Bold density with minimum 550 g/L test weight and intense piperine pungency, cleaned and steam-sterilized for international spice packers.': {
    fr: "Grains entiers de poivre noir séchés au soleil auprès de coopératives de petits exploitants d'Afrique de l'Ouest. Densité élevée avec un poids spécifique d'au moins 550 g/L et forte teneur en pipérine, nettoyés et stérilisés à la vapeur.",
    esp: 'Granos enteros de pimienta negra secados al sol por cooperativas de pequeños agricultores de África Occidental. Alta densidad con peso específico mínimo de 550 g/L y marcada pungencia de piperina, limpios y esterilizados por vapor.',
  },
  'Density: > 550 g/L, Moisture: < 12%, Piperine: > 4.5%': {
    fr: 'Densité: > 550 g/L, Humidité: < 12%, Pipérine: > 4.5%',
    esp: 'Densidad: > 550 g/L, Humedad: < 12%, Piperina: > 4.5%',
  },

  // Core Values
  'Quality First': {
    fr: "La qualité d'abord",
    esp: 'Calidad ante todo',
  },
  'Deliver consistent, premium agricultural products every time.': {
    fr: 'Livrer des produits agricoles de première qualité et constants à chaque expédition.',
    esp: 'Entregar productos agrícolas de primera calidad y consistentes en cada envío.',
  },
  'Ethical Sourcing': {
    fr: 'Approvisionnement éthique',
    esp: 'Abastecimiento ético',
  },
  'Partnering with verified African farmers to ensure sustainability.': {
    fr: 'Partenariat avec des producteurs africains vérifiés pour assurer durabilité et équité.',
    esp: 'Alianzas con productores africanos verificados para asegurar sostenibilidad y equidad.',
  },
  'Trust & Transparency': {
    fr: 'Confiance et transparence',
    esp: 'Confianza y transparencia',
  },
  'Clear communication and accountability in every transaction.': {
    fr: 'Communication claire et responsabilité totale dans chaque transaction commerciale.',
    esp: 'Comunicación clara y rendición de cuentas en cada transacción comercial.',
  },
  'Reliability': {
    fr: 'Fiabilité opérationnelle',
    esp: 'Fiabilidad operativa',
  },
  'Seamless, timely, and dependable service at any scale.': {
    fr: 'Service ponctuel, rigoureux et fiable, quelle que soit l’envergure de la commande.',
    esp: 'Servicio puntual, riguroso y confiable en cualquier escala de volumen.',
  },

  'Specification Discipline': {
    fr: 'Discipline en matière de spécifications',
    esp: 'Disciplina de especificaciones',
  },
  'Products and opportunities are evaluated against defined buyer, market and commercial requirements.': {
    fr: 'Les produits et les occasions commerciales sont évalués selon les exigences définies des acheteurs, des marchés et des opérations commerciales.',
    esp: 'Los productos y las oportunidades se evalúan conforme a requisitos definidos de compradores, mercados y operaciones comerciales.',
  },
  'Responsible Sourcing': {
    fr: 'Approvisionnement responsable',
    esp: 'Abastecimiento responsable',
  },
  'We seek credible counterparties and transparent sourcing relationships across the markets in which we operate.': {
    fr: 'Nous recherchons des contreparties crédibles et des relations d’approvisionnement transparentes dans tous nos marchés.',
    esp: 'Buscamos contrapartes confiables y relaciones de abastecimiento transparentes en todos los mercados donde operamos.',
  },
  Transparency: {
    fr: 'Transparence',
    esp: 'Transparencia',
  },
  'Clear communication around origin, specifications, availability, commercial terms and transaction requirements.': {
    fr: 'Une communication claire sur l’origine, les spécifications, la disponibilité, les conditions commerciales et les exigences transactionnelles.',
    esp: 'Comunicación clara sobre el origen, las especificaciones, la disponibilidad, las condiciones comerciales y los requisitos de cada transacción.',
  },
  'Opportunities are evaluated for specification, volume, pricing, counterparty fit and execution requirements before commitment.': {
    fr: 'Avant tout engagement, les occasions sont évaluées selon les spécifications, le volume, le prix, l’adéquation de la contrepartie et les exigences d’exécution.',
    esp: 'Antes de asumir un compromiso, las oportunidades se evalúan según las especificaciones, el volumen, el precio, la idoneidad de la contraparte y los requisitos de ejecución.',
  },

  // Homepage carousel
  'Your Trusted Partner in Global Agricultural Trade': {
    fr: 'Votre partenaire de confiance dans le commerce agricole mondial',
    esp: 'Su socio de confianza en el comercio agrícola mundial',
  },
  'Quality you can count on, partnerships that last.': {
    fr: 'Une qualité fiable, des partenariats durables.',
    esp: 'Calidad en la que puede confiar, alianzas que perduran.',
  },
  'Global Agricultural Trade. Canadian Counterparty.': {
    fr: 'Commerce agricole mondial. Contrepartie canadienne.',
    esp: 'Comercio agrícola mundial. Contraparte canadiense.',
  },
  'AgroVentia connects qualified agricultural supply with commercial buyers across Canada, West Africa and international markets.': {
    fr: 'AgroVentia met en relation une offre agricole qualifiée avec des acheteurs commerciaux au Canada, en Afrique de l’Ouest et sur les marchés internationaux.',
    esp: 'AgroVentia conecta una oferta agrícola calificada con compradores comerciales en Canadá, África Occidental y los mercados internacionales.',
  },
  'Premium Agricultural Produce from Africa': {
    fr: 'Produits agricoles haut de gamme d’Afrique',
    esp: 'Productos agrícolas prémium de África',
  },
  'From Fields to You': {
    fr: 'Des champs jusqu’à vous',
    esp: 'Del campo a usted',
  },
  'Ethically sourced. Globally delivered.': {
    fr: 'Approvisionnement éthique. Livraison mondiale.',
    esp: 'Abastecimiento ético. Entrega mundial.',
  },
  'From Africa’s Finest Fields to You': {
    fr: 'Des meilleurs champs d’Afrique jusqu’à vous',
    esp: 'De los mejores campos de África hasta usted',
  },
  'Redefining Agricultural Trade': {
    fr: 'Redéfinir le commerce agricole',
    esp: 'Redefiniendo el comercio agrícola',
  },
  'Every shipment, a promise kept.': {
    fr: 'Chaque expédition, une promesse tenue.',
    esp: 'Cada envío, una promesa cumplida.',
  },
  'Redefining Agricultural Trade with Integrity': {
    fr: 'Redéfinir le commerce agricole avec intégrité',
    esp: 'Redefiniendo el comercio agrícola con integridad',
  },

  'AgroVentia Inc. specializes in high-quality agricultural products including kolanut, ginger, hibiscus, cocoa, and more from trusted sources.': {
    fr: 'AgroVentia Inc. se spécialise dans les produits agricoles de haute qualité, notamment la noix de kola, le gingembre, l’hibiscus, le cacao et d’autres produits issus de sources fiables.',
    esp: 'AgroVentia Inc. se especializa en productos agrícolas de alta calidad, como nuez de kola, jengibre, hibisco, cacao y otros productos de fuentes confiables.',
  },
  'About AgroVentia Inc.': {
    fr: 'À propos d’AgroVentia Inc.',
    esp: 'Acerca de AgroVentia Inc.',
  },
  'To make agricultural trade more accessible and commercially effective by connecting qualified supply with genuine market demand.': {
    fr: 'Rendre le commerce agricole plus accessible et efficace sur le plan commercial en reliant une offre qualifiée à une demande réelle du marché.',
    esp: 'Hacer que el comercio agrícola sea más accesible y comercialmente eficaz conectando una oferta calificada con una demanda real del mercado.',
  },
  'To become a trusted international trading counterparty for agricultural producers, processors and buyers seeking reliable access to new markets and supply opportunities.': {
    fr: 'Devenir une contrepartie commerciale internationale de confiance pour les producteurs, les transformateurs et les acheteurs agricoles qui recherchent un accès fiable à de nouveaux marchés et à de nouvelles possibilités d’approvisionnement.',
    esp: 'Convertirnos en una contraparte comercial internacional de confianza para productores, procesadores y compradores agrícolas que buscan acceso confiable a nuevos mercados y oportunidades de abastecimiento.',
  },
  'Our Process': {
    fr: 'Notre processus',
    esp: 'Nuestro proceso',
  },
  'Products & Trade Origins': {
    fr: 'Produits et origines commerciales',
    esp: 'Productos y orígenes comerciales',
  },
  'Whether you are sourcing agricultural products or seeking international markets for available supply, share your requirement with our team and we will assess the opportunity.': {
    fr: 'Que vous recherchiez des produits agricoles ou des marchés internationaux pour une offre disponible, communiquez vos besoins à notre équipe et nous évaluerons l’occasion.',
    esp: 'Tanto si busca productos agrícolas como mercados internacionales para una oferta disponible, comunique sus requisitos a nuestro equipo y evaluaremos la oportunidad.',
  },
  '24 hours for all inquiries': {
    fr: 'Dans les 24 heures pour toutes les demandes',
    esp: 'En un plazo de 24 horas para todas las consultas',
  },
  Community: {
    fr: 'Communauté',
    esp: 'Comunidad',
  },
  'Social impact and people in agriculture.': {
    fr: 'L’impact social et les personnes qui œuvrent dans le secteur agricole.',
    esp: 'El impacto social y las personas que trabajan en la agricultura.',
  },
  Compliance: {
    fr: 'Conformité',
    esp: 'Cumplimiento normativo',
  },
  'Standards and regulations.': {
    fr: 'Normes et réglementation.',
    esp: 'Normas y reglamentos.',
  },
  'Market Trends': {
    fr: 'Tendances du marché',
    esp: 'Tendencias del mercado',
  },
  'Insights into market demands and opportunities.': {
    fr: 'Analyses de la demande et des occasions du marché.',
    esp: 'Análisis de la demanda y las oportunidades del mercado.',
  },
  'Logistics, farm-to-table courses.': {
    fr: 'Logistique et parcours de la ferme à la table.',
    esp: 'Logística y recorridos de la granja a la mesa.',
  },
  Sustainability: {
    fr: 'Durabilité',
    esp: 'Sostenibilidad',
  },
  'Practices for long-term agricultural health.': {
    fr: 'Pratiques favorisant la santé à long terme du secteur agricole.',
    esp: 'Prácticas que favorecen la salud agrícola a largo plazo.',
  },
  Technology: {
    fr: 'Technologie',
    esp: 'Tecnología',
  },
  'Innovations in farming.': {
    fr: 'Innovations dans le secteur agricole.',
    esp: 'Innovaciones en la agricultura.',
  },
  'AgroVentia Editorial & Sourcing Desk': {
    fr: 'Bureau éditorial et approvisionnement d’AgroVentia',
    esp: 'Equipo editorial y de abastecimiento de AgroVentia',
  },

  // Categories
  'Spices & Aromatics': {
    fr: 'Épices et aromates',
    esp: 'Especias y aromáticos',
  },
  'Oilseeds': {
    fr: 'Graines oléagineuses',
    esp: 'Semillas oleaginosas',
  },
  'Nuts & Kernels': {
    fr: 'Noix et amandes',
    esp: 'Nueces y semillas comestibles',
  },
  'Botanicals': {
    fr: 'Plantes botaniques et médicinales',
    esp: 'Productos botánicos y medicinales',
  },
  'Cocoa & Derivatives': {
    fr: 'Cacao et dérivés',
    esp: 'Cacao y derivados',
  },
  'Tubers & Grains': {
    fr: 'Tubercules et céréales',
    esp: 'Tubérculos y granos',
  },
};

/**
 * Normalizes text for reliable dictionary lookup.
 */
export function normalizeTextForLookup(text: string): string {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Searches the deterministic fallback dictionary for an exact or normalized match.
 */
export function lookupFallbackDictionary(
  text: string
): { fr: string; esp: string } | null {
  if (!text) return null;
  const normalized = normalizeTextForLookup(text);

  if (DETERMINISTIC_FALLBACK_DICTIONARY[normalized]) {
    return DETERMINISTIC_FALLBACK_DICTIONARY[normalized];
  }

  // Case-insensitive fallback
  const lower = normalized.toLowerCase();
  for (const [key, value] of Object.entries(DETERMINISTIC_FALLBACK_DICTIONARY)) {
    if (key.toLowerCase() === lower) {
      return value;
    }
  }

  return null;
}
