// src/lib/assets/prompt-blueprint-engine.ts
/**
 * CAP-10: Canadian Agricultural Studio Asset Blueprint & Generation Engine
 * Defines standardized prompt blueprints, negative constraints, and visual
 * validation parameters for the 33 Canadian commodities defined in docs/products.md.
 */

export interface BlueprintVisualStandards {
  backdrop: '#FFFFFF';
  lighting: string;
  shadow: string;
  composition: string;
  aspectRatio: '1:1';
  minWidth: number;
  minHeight: number;
  format: 'png';
}

export const CANADIAN_STUDIO_VISUAL_STANDARDS: BlueprintVisualStandards = {
  backdrop: '#FFFFFF',
  lighting: 'Softbox diffuse studio lighting (5500K daylight), dual fill, zero harsh specular reflections',
  shadow: 'Delicate, soft ground contact shadow directly beneath commodity pile',
  composition: 'Centered hero presentation, commodity occupying ~75–80% of canvas, tight macro focus',
  aspectRatio: '1:1',
  minWidth: 1024,
  minHeight: 1024,
  format: 'png',
};

export const STANDARD_NEGATIVE_CONSTRAINTS =
  '--no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur';

export interface CanadianCommodityBlueprint {
  slug: string;
  commoditySubject: string;
  categoryKey: 'grains' | 'pulses' | 'oilseeds' | 'horticulture';
  promptSubject: string;
  fullPrompt: string;
  negativeConstraints: string;
  targetAssetPath: string;
}

export const CANADIAN_COMMODITY_BLUEPRINTS: Record<string, CanadianCommodityBlueprint> = {
  // Category 1: Grains & Cereals
  'milling-wheat': {
    slug: 'milling-wheat',
    commoditySubject: 'Non-Durum / Milling Wheat',
    categoryKey: 'grains',
    promptSubject: 'Pile of clean, golden Canadian hard red spring milling wheat kernels, plump sound wheat grains',
    fullPrompt:
      'Pile of clean, golden Canadian hard red spring milling wheat kernels, plump sound wheat grains, isolated studio product photography on seamless pure white background, diffuse softbox lighting, soft contact shadow underneath, razor-sharp grain texture, commercial agricultural grade inspection view, ultra-high resolution stock photography, 8k, photorealistic --no husk, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/milling-wheat.png',
  },
  'durum-wheat': {
    slug: 'durum-wheat',
    commoditySubject: 'Durum Wheat',
    categoryKey: 'grains',
    promptSubject: 'Organic cluster of hard amber Canadian durum wheat kernels, vitreous translucent golden grains, premium semolina grade',
    fullPrompt:
      'Organic cluster of hard amber Canadian durum wheat kernels, vitreous translucent golden grains, premium semolina grade, isolated studio product shot on pure white backdrop, diffuse soft lighting, subtle drop shadow, commercial agricultural grade inspection view, 8k, photorealistic --no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/durum-wheat.png',
  },
  'feed-barley': {
    slug: 'feed-barley',
    commoditySubject: 'Feed Barley',
    categoryKey: 'grains',
    promptSubject: 'Plump clean Canadian feed barley grains, light golden hulled barley, commercial animal feed grade',
    fullPrompt:
      'Plump clean Canadian feed barley grains, light golden hulled barley, commercial animal feed grade, isolated on pure white background, studio macro photography, soft ground shadow, commercial agricultural grade inspection view, 8k, photorealistic --no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/feed-barley.png',
  },
  'malting-barley': {
    slug: 'malting-barley',
    commoditySubject: 'Malting Barley',
    categoryKey: 'grains',
    promptSubject: 'Uniform two-row Canadian malting barley grains, pristine brewery grade, plump clean kernels',
    fullPrompt:
      'Uniform two-row Canadian malting barley grains, pristine brewery grade, plump clean kernels, isolated studio product photography on solid white background, sharp focus, diffuse studio lights, commercial agricultural grade inspection view, 8k, photorealistic --no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/malting-barley.png',
  },
  'malt': {
    slug: 'malt',
    commoditySubject: 'Malt',
    categoryKey: 'grains',
    promptSubject: 'Kilned Canadian barley malt kernels, golden-amber roasted malt grains for brewing',
    fullPrompt:
      'Kilned Canadian barley malt kernels, golden-amber roasted malt grains for brewing, isolated on seamless pure white background, studio product shot, delicate ground shadow, commercial agricultural grade inspection view, 8k, photorealistic --no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/malt.png',
  },
  'raw-oats': {
    slug: 'raw-oats',
    commoditySubject: 'Raw Oats',
    categoryKey: 'grains',
    promptSubject: 'Clean whole Canadian groat oats, slender golden oat kernels, food milling grade',
    fullPrompt:
      'Clean whole Canadian groat oats, slender golden oat kernels, food milling grade, isolated on solid white background, studio macro shot, soft contact shadow, commercial agricultural grade inspection view, 8k, photorealistic --no husk, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/raw-oats.png',
  },
  'oat-flakes-flour': {
    slug: 'oat-flakes-flour',
    commoditySubject: 'Oat Flakes / Oat Flour',
    categoryKey: 'grains',
    promptSubject: 'Clean pile of large rolled Canadian oat flakes next to fine powdery white oat flour',
    fullPrompt:
      'Clean pile of large rolled Canadian oat flakes next to fine powdery white oat flour, isolated on seamless pure white background, commercial bakery ingredient shot, soft lighting, subtle shadow, commercial agricultural grade inspection view, 8k, photorealistic --no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/oat-flakes-flour.png',
  },

  // Category 2: Pulses & Legumes
  'red-lentils': {
    slug: 'red-lentils',
    commoditySubject: 'Red Lentils',
    categoryKey: 'pulses',
    promptSubject: 'Mound of vibrant split orange-red Canadian lentils, uniform round split pulse seeds, food manufacturing grade',
    fullPrompt:
      'Mound of vibrant split orange-red Canadian lentils, uniform round split pulse seeds, food manufacturing grade, isolated studio product photography on seamless pure white background, softbox lighting, crisp texture, soft contact shadow underneath, 8k, photorealistic --no bowls, no shadows, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/red-lentils.png',
  },
  'green-lentils': {
    slug: 'green-lentils',
    commoditySubject: 'Green Lentils',
    categoryKey: 'pulses',
    promptSubject: 'Clean heap of whole large Canadian Laird green lentils, uniform olive-green disk-shaped pulse seeds',
    fullPrompt:
      'Clean heap of whole large Canadian Laird green lentils, uniform olive-green disk-shaped pulse seeds, isolated on solid white backdrop, studio product photography, subtle ground contact shadow, 8k, photorealistic --no cooking, no spoon, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/green-lentils.png',
  },
  'yellow-peas': {
    slug: 'yellow-peas',
    commoditySubject: 'Yellow Peas',
    categoryKey: 'pulses',
    promptSubject: 'Clean round Canadian yellow field peas, smooth spherical golden dry peas, protein extraction grade',
    fullPrompt:
      'Clean round Canadian yellow field peas, smooth spherical golden dry peas, protein extraction grade, isolated studio shot on pure white background, soft shadow, 8k, photorealistic --no pods, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/yellow-peas.png',
  },
  'green-peas': {
    slug: 'green-peas',
    commoditySubject: 'Green Peas',
    categoryKey: 'pulses',
    promptSubject: 'Vibrant dry whole Canadian green peas, uniform spherical green pulse seeds',
    fullPrompt:
      'Vibrant dry whole Canadian green peas, uniform spherical green pulse seeds, isolated on pure white background, commercial grade product photography, soft ground shadow, 8k, photorealistic --no soup, no bowls, no pods, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/green-peas.png',
  },
  'chickpeas': {
    slug: 'chickpeas',
    commoditySubject: 'Chickpeas (Kabuli)',
    categoryKey: 'pulses',
    promptSubject: 'Large Canadian Kabuli chickpeas, wrinkled beige garbanzo beans, 9mm bold grade',
    fullPrompt:
      'Large Canadian Kabuli chickpeas, wrinkled beige garbanzo beans, 9mm bold grade, isolated studio product shot on seamless pure white background, crisp macro focus, soft contact shadow, 8k, photorealistic --no hummus, no plants, no bowls, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/chickpeas.png',
  },
  'dry-beans': {
    slug: 'dry-beans',
    commoditySubject: 'Dry Beans (Mixed / Pinto / Great Northern)',
    categoryKey: 'pulses',
    promptSubject: 'Assortment of polished Canadian dry edible beans, clean mottled pinto and white navy beans',
    fullPrompt:
      'Assortment of polished Canadian dry edible beans, clean mottled pinto and white navy beans, isolated studio shot on pure white background, diffuse studio lighting, subtle soft ground shadow, 8k, photorealistic --no cans, no background, no bowls, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/dry-beans.png',
  },
  'kidney-beans': {
    slug: 'kidney-beans',
    commoditySubject: 'Kidney Beans',
    categoryKey: 'pulses',
    promptSubject: 'Glossy deep-red Canadian dark red kidney beans, large kidney-shaped dry beans, canning grade',
    fullPrompt:
      'Glossy deep-red Canadian dark red kidney beans, large kidney-shaped dry beans, canning grade, isolated on seamless pure white background, studio product shot, subtle shadow, 8k, photorealistic --no cooked beans, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/kidney-beans.png',
  },
  'navy-beans': {
    slug: 'navy-beans',
    commoditySubject: 'Navy Beans',
    categoryKey: 'pulses',
    promptSubject: 'Small polished white Canadian navy beans, uniform oval pulse seeds, baked bean manufacturing grade',
    fullPrompt:
      'Small polished white Canadian navy beans, uniform oval pulse seeds, baked bean manufacturing grade, isolated on seamless white backdrop, studio macro shot, soft ground contact shadow, 8k, photorealistic --no sauce, no plate, no bowls, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/navy-beans.png',
  },
  'pulse-flour-pea-protein': {
    slug: 'pulse-flour-pea-protein',
    commoditySubject: 'Pulse Flour / Pea Protein',
    categoryKey: 'pulses',
    promptSubject: 'Fine pale-cream Canadian yellow pea protein isolate powder, clean mound of smooth pulse flour, functional food ingredient',
    fullPrompt:
      'Fine pale-cream Canadian yellow pea protein isolate powder, clean mound of smooth pulse flour, functional food ingredient, isolated studio photography on solid white background, soft shadow, 8k, photorealistic --no scoop, no shaker, no bowls, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/pulse-flour-pea-protein.png',
  },

  // Category 3: Oilseeds, Nuts & Specialty Seeds
  'canola-seed': {
    slug: 'canola-seed',
    commoditySubject: 'Canola Seed',
    categoryKey: 'oilseeds',
    promptSubject: 'Heap of tiny round dark-brown to black Canadian canola seeds, gleaming oilseed grains, high-oil crushing grade',
    fullPrompt:
      'Heap of tiny round dark-brown to black Canadian canola seeds, gleaming oilseed grains, high-oil crushing grade, isolated studio product photography on pure white background, crisp macro detail, soft shadow, 8k, photorealistic --no yellow flowers, no oil bottle, no hands, no bowls, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/canola-seed.png',
  },
  'canola-oil': {
    slug: 'canola-oil',
    commoditySubject: 'Canola Oil',
    categoryKey: 'oilseeds',
    promptSubject: 'Clean clear glass bottle filled with pure golden Canadian refined canola oil, brilliant amber-yellow edible oil',
    fullPrompt:
      'Clean clear glass bottle filled with pure golden Canadian refined canola oil, brilliant amber-yellow edible oil, isolated on pure white background, soft studio lighting, delicate reflection, clean minimal commercial look, 8k, photorealistic --no label, no flowers, no hands, no bowls, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/canola-oil.png',
  },
  'canola-meal': {
    slug: 'canola-meal',
    commoditySubject: 'Canola Meal',
    categoryKey: 'oilseeds',
    promptSubject: 'Crushed golden-brown Canadian canola meal pellets and protein feed flakes, livestock nutrition co-product',
    fullPrompt:
      'Crushed golden-brown Canadian canola meal pellets and protein feed flakes, livestock nutrition co-product, isolated on pure white background, studio product photography, soft contact shadow, 8k, photorealistic --no cows, no farm, no bowls, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/canola-meal.png',
  },
  'yellow-soybeans': {
    slug: 'yellow-soybeans',
    commoditySubject: 'Soybeans',
    categoryKey: 'oilseeds',
    promptSubject: 'Smooth spherical Canadian yellow soybeans, non-GMO food grade, clean cream-colored legumes with dark hilum',
    fullPrompt:
      'Smooth spherical Canadian yellow soybeans, non-GMO food grade, clean cream-colored legumes with dark hilum, isolated studio photography on solid white background, soft lighting, delicate ground shadow, 8k, photorealistic --no pods, no milk, no bowls, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/yellow-soybeans.png',
  },
  'flaxseed-linseed': {
    slug: 'flaxseed-linseed',
    commoditySubject: 'Flaxseed / Linseed',
    categoryKey: 'oilseeds',
    promptSubject: 'Glossy flat reddish-brown Canadian brown flaxseeds, high omega-3 oilseed grains, polished gleaming seeds',
    fullPrompt:
      'Glossy flat reddish-brown Canadian brown flaxseeds, high omega-3 oilseed grains, polished gleaming seeds, isolated on seamless pure white background, macro studio shot, soft shadow, 8k, photorealistic --no bread, no spoon, no bowls, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/flaxseed-linseed.png',
  },
  'yellow-mustard-seed': {
    slug: 'yellow-mustard-seed',
    commoditySubject: 'Yellow Mustard Seed',
    categoryKey: 'oilseeds',
    promptSubject: 'Tiny spherical Canadian yellow mustard seeds, bright pale-yellow condiment seeds',
    fullPrompt:
      'Tiny spherical Canadian yellow mustard seeds, bright pale-yellow condiment seeds, isolated studio product shot on pure white background, crisp macro texture, soft shadow, 8k, photorealistic --no prepared mustard, no jar, no bowls, no hands, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/yellow-mustard-seed.png',
  },
  'brown-mustard-seed': {
    slug: 'brown-mustard-seed',
    commoditySubject: 'Brown Mustard Seed',
    categoryKey: 'oilseeds',
    promptSubject: 'Small dark-brown to reddish-brown Canadian brown mustard seeds, pungent spice seeds',
    fullPrompt:
      'Small dark-brown to reddish-brown Canadian brown mustard seeds, pungent spice seeds, isolated on seamless white background, studio macro photography, subtle ground shadow, 8k, photorealistic --no sauce, no hands, no bowls, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/brown-mustard-seed.png',
  },
  'oriental-mustard-seed': {
    slug: 'oriental-mustard-seed',
    commoditySubject: 'Oriental Mustard Seed',
    categoryKey: 'oilseeds',
    promptSubject: 'Golden-yellow to light amber Canadian oriental mustard seeds, clean spice grains',
    fullPrompt:
      'Golden-yellow to light amber Canadian oriental mustard seeds, clean spice grains, isolated on pure white background, studio commercial shot, diffuse lighting, soft ground shadow, 8k, photorealistic --no bowls, no background, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/oriental-mustard-seed.png',
  },
  'canary-seed': {
    slug: 'canary-seed',
    commoditySubject: 'Canary Seed',
    categoryKey: 'oilseeds',
    promptSubject: 'Slender golden-yellow Canadian glabrous canary seeds, clean birdseed and food-grade canary grains',
    fullPrompt:
      'Slender golden-yellow Canadian glabrous canary seeds, clean birdseed and food-grade canary grains, isolated on pure white background, sharp studio macro photography, subtle shadow, 8k, photorealistic --no birds, no cages, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/canary-seed.png',
  },
  'wheat-gluten-specialty-proteins': {
    slug: 'wheat-gluten-specialty-proteins',
    commoditySubject: 'Wheat Gluten / Specialty Proteins',
    categoryKey: 'oilseeds',
    promptSubject: 'Clean pile of fine pale-tan vital wheat gluten powder, high-protein bakery flour ingredient',
    fullPrompt:
      'Clean pile of fine pale-tan vital wheat gluten powder, high-protein bakery flour ingredient, isolated on seamless pure white background, studio product shot, soft shadow, 8k, photorealistic --no dough, no bread, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/wheat-gluten-specialty-proteins.png',
  },
  'mustard-flour-ingredients': {
    slug: 'mustard-flour-ingredients',
    commoditySubject: 'Mustard Flour / Mustard Ingredients',
    categoryKey: 'oilseeds',
    promptSubject: 'Fine ground yellow mustard flour powder, milled pungent spice ingredient',
    fullPrompt:
      'Fine ground yellow mustard flour powder, milled pungent spice ingredient, isolated on pure white background, studio macro shot, soft ground contact shadow, 8k, photorealistic --no pasty mustard, no jar, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/mustard-flour-ingredients.png',
  },

  // Category 4: Horticulture, Specialty & Animal Nutrition
  'frozen-french-fries-processed-potatoes': {
    slug: 'frozen-french-fries-processed-potatoes',
    commoditySubject: 'Frozen French Fries / Processed Potatoes',
    categoryKey: 'horticulture',
    promptSubject: 'Neat cluster of golden cut Canadian Russet frozen french fry potato strips, premium restaurant cut, lightly frosted',
    fullPrompt:
      'Neat cluster of golden cut Canadian Russet frozen french fry potato strips, premium restaurant cut, lightly frosted, isolated studio product photography on pure white background, soft lighting, delicate shadow, 8k, photorealistic --no fast food box, no ketchup, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/frozen-french-fries-processed-potatoes.png',
  },
  'seed-potatoes': {
    slug: 'seed-potatoes',
    commoditySubject: 'Seed Potatoes',
    categoryKey: 'horticulture',
    promptSubject: 'Clean firm Canadian certified seed potatoes, unblemished tubers with clean eyes, disease-free seed stock',
    fullPrompt:
      'Clean firm Canadian certified seed potatoes, unblemished tubers with clean eyes, disease-free seed stock, isolated on pure white background, studio agricultural product shot, soft ground shadow, 8k, photorealistic --no dirt, no garden, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/seed-potatoes.png',
  },
  'blueberries': {
    slug: 'blueberries',
    commoditySubject: 'Blueberries',
    categoryKey: 'horticulture',
    promptSubject: 'Plump fresh Canadian wild and cultivated blueberries, deep indigo berries with delicate natural white bloom',
    fullPrompt:
      'Plump fresh Canadian wild and cultivated blueberries, deep indigo berries with delicate natural white bloom, isolated cluster on seamless pure white background, crisp macro photography, soft shadow, 8k, photorealistic --no pie, no leaves, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/blueberries.png',
  },
  'cranberries': {
    slug: 'cranberries',
    commoditySubject: 'Cranberries',
    categoryKey: 'horticulture',
    promptSubject: 'Firm glossy deep-red Canadian cranberries, fresh tart berries, processing and juice grade',
    fullPrompt:
      'Firm glossy deep-red Canadian cranberries, fresh tart berries, processing and juice grade, isolated on seamless pure white background, studio commercial shot, subtle ground shadow, 8k, photorealistic --no sauce, no branches, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/cranberries.png',
  },
  'maple-syrup-maple-sugar': {
    slug: 'maple-syrup-maple-sugar',
    commoditySubject: 'Maple Syrup / Maple Sugar',
    categoryKey: 'horticulture',
    promptSubject: 'Elegant clear glass bottle of Grade A pure amber Canadian maple syrup alongside natural granulated maple sugar crystals',
    fullPrompt:
      'Elegant clear glass bottle of Grade A pure amber Canadian maple syrup alongside natural granulated maple sugar crystals, isolated on pure white background, warm studio backlight, clean minimal styling, 8k, photorealistic --no pancakes, no rustic wood, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/maple-syrup-maple-sugar.png',
  },
  'pet-food-livestock-feed': {
    slug: 'pet-food-livestock-feed',
    commoditySubject: 'Pet Food / Livestock Feed Preparations',
    categoryKey: 'horticulture',
    promptSubject: 'Uniform golden-brown extruded animal nutrition kibbles and feed pellets, Canadian commercial feed preparation',
    fullPrompt:
      'Uniform golden-brown extruded animal nutrition kibbles and feed pellets, Canadian commercial feed preparation, isolated on seamless pure white background, studio product photography, subtle shadow, 8k, photorealistic --no pets, no bowls, no packaging, no bags, no wooden bowls, no field background, no text, no watermarks, no blur',
    negativeConstraints: STANDARD_NEGATIVE_CONSTRAINTS,
    targetAssetPath: '/products/canadian/pet-food-livestock-feed.png',
  },
};

export function getCanadianCommodityBlueprint(slug: string): CanadianCommodityBlueprint | undefined {
  return CANADIAN_COMMODITY_BLUEPRINTS[slug];
}

export function getAllCanadianCommodityBlueprints(): CanadianCommodityBlueprint[] {
  return Object.values(CANADIAN_COMMODITY_BLUEPRINTS);
}

export function formatBlueprintPrompt(subject: string, specificDetails?: string): string {
  const coreSubject = specificDetails ? `${subject}, ${specificDetails}` : subject;
  return `${coreSubject}, isolated studio product photography, displayed in a neat, organic heap on a seamless pure white background, commercial agricultural grade inspection view, diffuse softbox studio lighting, subtle soft ground contact shadow, razor-sharp focus on texture and kernel details, natural color saturation, ultra-high resolution commercial stock photography, 8k, photorealistic ${STANDARD_NEGATIVE_CONSTRAINTS}`;
}
