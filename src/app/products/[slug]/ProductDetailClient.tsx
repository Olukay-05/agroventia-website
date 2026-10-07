'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Globe,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import SectionContainer from '@/components/common/SectionContainer';
import SanityImage from '@/components/SanityImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/contexts/LocaleContext';
import { QuoteRequestProvider, useQuoteRequest } from '@/contexts/QuoteRequestContext';
import { useProductBySlug, useProductCatalogContent } from '@/hooks/useContent';
import { normalizeCategorySlug } from '@/lib/product-filters';
import { trackButtonClick, trackProductQuoteRequest } from '@/lib/analytics';
import type { ProductCatalogItem } from '@/types/content';

interface ProductDetailClientProps {
  product: ProductCatalogItem;
  relatedProducts: ProductCatalogItem[];
}

function ProductDetailContent({
  product: initialProduct,
  relatedProducts: initialRelatedProducts,
}: ProductDetailClientProps) {
  const { locale } = useLocale();
  const { setRequestedProduct, prefetchProductForQuote } = useQuoteRequest();
  const productKey = initialProduct.slug || initialProduct._id;
  const { data: localizedProduct, isLoading: isProductLoading } = useProductBySlug(productKey);
  const { data: localizedCatalog } = useProductCatalogContent({ all: true });

  const isFrench = locale?.startsWith('fr');
  const isSpanish = locale?.startsWith('es') || locale === 'esp';
  const product = localizedProduct || (locale === 'en' ? initialProduct : null);
  const relatedProducts = localizedCatalog
    ? localizedCatalog
        .filter(item => item._id !== product?._id && item.slug !== productKey)
        .slice(0, 3)
    : locale === 'en'
      ? initialRelatedProducts
      : [];

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDF8F0] dark:bg-agro-neutral-950 flex flex-col">
        <Header />
        <main className="flex-grow pt-32 text-center text-agro-primary-950 dark:text-agro-neutral-50">
          <p>{isFrench ? 'Chargement du produit localisé…' : isSpanish ? 'Cargando el producto localizado…' : isProductLoading ? 'Loading product…' : 'Product unavailable.'}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const labels = {
    home: isFrench ? 'Accueil' : isSpanish ? 'Inicio' : 'Home',
    catalog: isFrench ? 'Catalogue' : isSpanish ? 'Catálogo' : 'Catalog',
    backToCatalog: isFrench
      ? 'Retour au catalogue'
      : isSpanish
        ? 'Volver al catálogo'
        : 'Back to Catalog',
    sectionTitle: isFrench
      ? 'Paramètres de qualité typiques'
      : isSpanish
        ? 'Parámetros de calidad típicos'
        : 'Typical Quality Parameters',
    disclaimer: isFrench
      ? 'Les spécifications sont des repères typiques. AgroVentia adapte les lots selon les exigences contractuelles des acheteurs, les classifications de grade et les réglementations phytosanitaires de destination.'
      : isSpanish
        ? 'Las especificaciones son puntos de referencia típicos. AgroVentia personaliza los lotes según las especificaciones contractuales del comprador, las clasificaciones de grado y las normativas fitosanitarias de destino.'
        : 'Specifications are typical benchmarks. AgroVentia customizes lots to buyer contract specifications, grade classifications, and destination phytosanitary regulations.',
    logisticsTitle: isFrench
      ? "Logistique d'exportation et d'emballage"
      : isSpanish
        ? 'Logística de exportación y embalaje'
        : 'Export & Packaging Logistics',
    requestQuote: isFrench
      ? 'Demander un devis personnalisé'
      : isSpanish
        ? 'Solicitar cotización personalizada'
        : 'Request Custom Quote',
    relatedTitle: isFrench
      ? 'Commodités associées'
      : isSpanish
        ? 'Productos básicos relacionados'
        : 'Related Commodities',
    viewDetails: isFrench
      ? 'Voir les détails'
      : isSpanish
        ? 'Ver detalles'
        : 'View Details',
    originLabel: isFrench ? 'Origine certifiée' : isSpanish ? 'Origen certificado' : 'Certified Origin',
    directOrigin: isFrench ? 'Origine coopérative directe' : isSpanish ? 'Origen cooperativo directo' : 'Direct Cooperative Origin',
    categoryLabel: isFrench ? 'Catégorie' : isSpanish ? 'Categoría' : 'Category',
    sourcingContext: isFrench ? "Contexte du corridor d'approvisionnement" : isSpanish ? 'Contexto del corredor de abastecimiento' : 'Sourcing Corridor Context',
    canadaContext: isFrench
      ? 'Récolté dans les Prairies canadiennes fertiles selon des normes rigoureuses de pureté, d’humidité et de poids spécifique.'
      : isSpanish
        ? 'Cosechado en las fértiles praderas canadienses bajo rigurosas normas de pureza, humedad y peso específico.'
        : 'Harvested across the fertile Canadian Prairies under rigorous purity, moisture, and test-weight standards.',
    africaContext: isFrench
      ? "Regroupé auprès de coopératives régionales vérifiées en Afrique de l’Ouest avec traçabilité phytosanitaire pour l’exportation."
      : isSpanish
        ? 'Agregado mediante cooperativas regionales verificadas de África Occidental con trazabilidad fitosanitaria para exportación.'
        : 'Aggregated through vetted regional cooperatives in West Africa with phytosanitary traceability for export.',
    harvestWindow: isFrench ? 'Période de récolte' : isSpanish ? 'Período de cosecha' : 'Harvest Window',
    exportReadiness: isFrench ? "Préparation à l’exportation" : isSpanish ? 'Preparación para exportación' : 'Export Readiness',
    canadaHarvest: isFrench ? 'Août à octobre' : isSpanish ? 'Agosto a octubre' : 'Aug - Oct',
    africaHarvest: isFrench ? 'Toute l’année / décembre à mars' : isSpanish ? 'Todo el año / diciembre a marzo' : 'Year-Round / Dec - Mar',
    bulkShipping: isFrench ? 'Vrac ou conteneurisé' : isSpanish ? 'A granel o en contenedores' : 'Bulk Vessel / Containerized',
    parametersFallback: isFrench
      ? 'Les paramètres représentatifs de cette commodité sont adaptés aux contrats des acheteurs.'
      : isSpanish
        ? 'Los parámetros representativos de este producto se adaptan a los contratos de los compradores.'
        : 'Representative parameters for this commodity are customized to buyer contracts.',
  };

  const title = product.title || product.productName || (isFrench ? 'Commodité agricole' : isSpanish ? 'Producto agrícola' : 'Agricultural Commodity');
  const parametersText =
    product.typicalQualityParameters || product.qualityStandards || '';
  const image =
    product.image ||
    product.image1 ||
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop';

  const handleRequestQuote = () => {
    setRequestedProduct({ name: title, id: product._id });
    trackProductQuoteRequest(title, product._id);
    prefetchProductForQuote(product._id);
    trackButtonClick('product_detail_request_quote', {
      product_name: title,
      product_id: product._id,
    });
    window.location.href = `/#contact`;
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0] dark:bg-agro-neutral-950 text-[#281909] dark:text-agro-neutral-50 flex flex-col">
      <Header />

      <main className="flex-grow pt-20">
        {/* Breadcrumbs Header */}
        <div className="bg-white/60 dark:bg-agro-neutral-900/60 border-b border-agro-primary-100 dark:border-agro-primary-900/50 py-4">
          <div className="container-premium max-w-6xl mx-auto px-4 flex items-center justify-between">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-agro-neutral-400">
              <Link href="/" className="hover:text-agro-primary-800 transition-colors">
                {labels.home}
              </Link>
              <ChevronRight size={14} />
              <Link href={`/products?lang=${encodeURIComponent(locale)}`} className="hover:text-agro-primary-800 transition-colors">
                {labels.catalog}
              </Link>
              {product.category && (
                <>
                  <ChevronRight size={14} />
                  <Link
                    href={`/products?category=${encodeURIComponent(normalizeCategorySlug(product.category))}&lang=${encodeURIComponent(locale)}`}
                    className="hover:text-agro-primary-800 transition-colors hidden sm:inline"
                  >
                    {product.category}
                  </Link>
                </>
              )}
              <ChevronRight size={14} />
              <span className="text-agro-primary-900 dark:text-agro-neutral-100 font-semibold truncate max-w-xs">
                {title}
              </span>
            </nav>

            <Link
              href={`/products?lang=${encodeURIComponent(locale)}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-agro-primary-700 dark:text-agro-primary-300 hover:text-agro-primary-900 transition-colors"
            >
              <ArrowLeft size={14} />
              {labels.backToCatalog}
            </Link>
          </div>
        </div>

        {/* Product Dossier Section */}
        <SectionContainer id="product-dossier" className="py-10 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Visual Showcase (Studio Cutout on White Canvas) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-white border border-agro-primary-200/70 dark:border-agro-primary-800/70 shadow-lg p-6 flex items-center justify-center">
                  <SanityImage
                    src={image}
                    alt={title}
                    fill
                    className="object-contain w-full h-full max-h-full hover:scale-105 transition-transform duration-500"
                  />
                  {product.sourcingOrigin && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 dark:bg-agro-neutral-900/95 text-agro-primary-900 dark:text-agro-primary-200 shadow-sm backdrop-blur-sm border border-agro-primary-200 dark:border-agro-primary-800">
                        {product.sourcingOrigin.toLowerCase().match(/canada|prairie|saskatchewan|alberta|manitoba|ontario/) ? (
                          <span aria-hidden="true">🍁</span>
                        ) : (
                          <Globe size={13} className="text-agro-secondary-600" />
                        )}
                        {product.sourcingOrigin}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sourcing corridor info card */}
                <div className="p-4 rounded-xl bg-white/80 dark:bg-agro-neutral-900 border border-agro-primary-200/60 dark:border-agro-primary-800/60 text-xs sm:text-sm text-gray-600 dark:text-agro-neutral-300 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-agro-primary-900 dark:text-agro-neutral-100">
                      {labels.originLabel}:
                    </span>
                    <span className="font-medium">{product.sourcingOrigin || labels.directOrigin}</span>
                  </div>
                  {product.category && (
                    <div className="flex items-center justify-between border-t border-dashed border-agro-primary-100 dark:border-agro-primary-900/50 pt-2">
                      <span className="font-semibold text-agro-primary-900 dark:text-agro-neutral-100">
                        {labels.categoryLabel}:
                      </span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                  )}
                </div>

                {/* Sourcing Corridor Context Dossier Box */}
                <div className="p-5 rounded-2xl bg-agro-primary-50/70 dark:bg-agro-neutral-900 border border-agro-primary-200/60 dark:border-agro-primary-800/60 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-agro-primary-700 dark:text-agro-primary-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-agro-primary-950 dark:text-agro-primary-100">
                      {labels.sourcingContext}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-agro-neutral-300 leading-relaxed">
                    {product.sourcingOrigin?.toLowerCase().match(/canada|prairie|saskatchewan|alberta|manitoba|ontario/)
                      ? labels.canadaContext
                      : labels.africaContext}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-agro-primary-200/40 dark:border-agro-primary-800/40 text-[11px] text-gray-600 dark:text-agro-neutral-300">
                    <div>
                      <span className="block font-semibold text-agro-primary-900 dark:text-agro-neutral-200">{labels.harvestWindow}:</span>
                      <span>{product.sourcingOrigin?.toLowerCase().match(/canada|prairie|saskatchewan|alberta|manitoba|ontario/) ? labels.canadaHarvest : labels.africaHarvest}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-agro-primary-900 dark:text-agro-neutral-200">{labels.exportReadiness}:</span>
                      <span>{labels.bulkShipping}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Identity, Parameters & Logistics */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  {product.category && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-agro-primary-100 text-agro-primary-800 dark:bg-agro-primary-950 dark:text-agro-primary-300 mb-2">
                      {product.category}
                    </span>
                  )}
                  <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-agro-primary-950 dark:text-agro-neutral-50 tracking-tight">
                    {title}
                  </h1>
                </div>

                {/* Description */}
                {product.description && (
                  <div
                    className="prose prose-sm sm:prose-base max-w-none text-gray-700 dark:text-agro-neutral-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}

                {/* Typical Quality Parameters Matrix */}
                <div className="rounded-2xl bg-white dark:bg-agro-neutral-900 p-6 border border-agro-primary-200/80 dark:border-agro-primary-800/80 shadow-md">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-agro-primary-100 dark:border-agro-primary-800">
                    <ShieldCheck className="h-6 w-6 text-agro-primary-600 dark:text-agro-primary-400" />
                    <h2 className="text-xl font-bold text-agro-primary-950 dark:text-agro-primary-100">
                      {labels.sectionTitle}
                    </h2>
                  </div>

                  {parametersText ? (
                    <div
                      className="prose prose-sm max-w-none text-gray-700 dark:text-agro-neutral-300 prose-headings:text-agro-primary-900 dark:prose-headings:text-agro-primary-200 prose-ul:list-disc prose-li:ml-4"
                      dangerouslySetInnerHTML={{ __html: parametersText }}
                    />
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-agro-neutral-400 italic">
                      {labels.parametersFallback}
                    </p>
                  )}

                  {/* Footnote Disclaimer */}
                  <p className="mt-5 pt-4 border-t border-dashed border-agro-primary-200 dark:border-agro-primary-800 text-xs text-gray-500 dark:text-agro-neutral-400 leading-normal italic">
                    {labels.disclaimer}
                  </p>
                </div>

                {/* Export & Packaging Logistics (Toggleable - only rendered if displayLogistics is true) */}
                {Boolean(product.displayLogistics && product.packagingLogistics) && (
                  <div className="rounded-2xl bg-agro-primary-50/70 dark:bg-agro-neutral-900 p-6 border border-agro-primary-200/70 dark:border-agro-primary-800/70 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <PackageCheck className="h-5 w-5 text-agro-primary-700 dark:text-agro-primary-400" />
                      <h3 className="text-lg font-bold text-agro-primary-950 dark:text-agro-primary-100">
                        {labels.logisticsTitle}
                      </h3>
                    </div>
                    <div
                      className="text-sm text-gray-700 dark:text-agro-neutral-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.packagingLogistics || '' }}
                    />
                  </div>
                )}

                {/* Main Action Banner */}
                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={handleRequestQuote}
                    className="btn-agro-primary flex-1 py-4 text-base flex items-center justify-center gap-2 shadow-lg font-semibold"
                  >
                    {labels.requestQuote}
                    <ArrowRight size={18} />
                  </Button>
                  <Link href={`/products?lang=${encodeURIComponent(locale)}`} className="sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="btn-agro-outline w-full py-4 text-base font-semibold"
                    >
                      {labels.backToCatalog}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Commodities Section (3-card grid from complementary corridor) */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="mt-20 pt-12 border-t border-agro-primary-200/60 dark:border-agro-primary-800/60">
                <h3 className="text-2xl font-bold font-serif text-agro-primary-950 dark:text-agro-neutral-50 mb-8">
                  {labels.relatedTitle}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {relatedProducts.slice(0, 3).map(rel => {
                    const relTitle = rel.title || rel.productName || '';
                    const relImage =
                      rel.image ||
                      rel.image1 ||
                      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop';

                    return (
                      <Link
                        key={rel._id}
                        href={`/products/${rel.slug || rel._id}?lang=${encodeURIComponent(locale)}`}
                        className="group"
                      >
                        <Card className="h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-agro-primary-200/60 dark:border-agro-primary-800/40 bg-white/90 dark:bg-agro-neutral-900/90 backdrop-blur-md group-hover:shadow-xl group-hover:border-agro-primary-400 group-hover:-translate-y-1 transition-all duration-300">
                          <div className="flex flex-col flex-grow">
                            {/* Pure white studio cutout canvas */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-white border-b border-agro-primary-100/60 dark:border-agro-primary-900/40 p-3 flex items-center justify-center">
                              <SanityImage
                                src={relImage}
                                alt={relTitle}
                                fill
                                className="object-contain w-full h-full max-h-full group-hover:scale-105 transition-transform duration-500"
                              />
                              {rel.sourcingOrigin && (
                                <div className="absolute top-2.5 left-2.5 z-10">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 dark:bg-agro-neutral-900/95 text-agro-primary-900 dark:text-agro-primary-200 shadow-sm border border-agro-primary-200/60 dark:border-agro-primary-800/60">
                                    {rel.sourcingOrigin.toLowerCase().match(/canada|prairie|saskatchewan|alberta|manitoba|ontario/) ? (
                                      <span aria-hidden="true">🍁</span>
                                    ) : (
                                      <Globe size={10} className="text-agro-secondary-600" />
                                    )}
                                    <span>{rel.sourcingOrigin}</span>
                                  </span>
                                </div>
                              )}
                            </div>

                            <CardHeader className="pb-2 pt-4 px-5">
                              {rel.category && (
                                <span className="text-xs font-bold uppercase tracking-wider text-agro-secondary-600 dark:text-agro-secondary-400">
                                  {rel.category}
                                </span>
                              )}
                              <CardTitle className="text-base font-bold text-agro-primary-950 dark:text-agro-neutral-50 line-clamp-1 group-hover:text-agro-primary-700 transition-colors">
                                {relTitle}
                              </CardTitle>
                            </CardHeader>

                            <CardContent className="pb-4 px-5 flex-grow">
                              {rel.description && (
                                <div
                                  className="text-xs text-gray-600 dark:text-agro-neutral-300 line-clamp-2 leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: rel.description }}
                                />
                              )}
                            </CardContent>
                          </div>

                          <div className="px-5 pb-4 pt-1 flex items-center text-xs font-semibold text-agro-primary-700 dark:text-agro-primary-300 group-hover:underline gap-1">
                            <span>{labels.viewDetails}</span>
                            <ArrowRight size={12} />
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductDetailClient(props: ProductDetailClientProps) {
  return (
    <QuoteRequestProvider>
      <ProductDetailContent {...props} />
    </QuoteRequestProvider>
  );
}
