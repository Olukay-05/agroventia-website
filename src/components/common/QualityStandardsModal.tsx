'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Globe, PackageCheck, ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import WixImage from '@/components/WixImage';
import useScrollToSection from '@/hooks/useScrollToSection';
import { useLocale } from '@/contexts/LocaleContext';

export interface QualityStandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  qualityStandards?: string; // Legacy parameter prop
  typicalQualityParameters?: string;
  product?: {
    _id?: string;
    title?: string;
    name?: string;
    productName?: string;
    slug?: string;
    category?: string;
    sourcingOrigin?: string;
    image?: string;
    image1?: string;
    description?: string;
    typicalQualityParameters?: string;
    qualityStandards?: string;
    displayLogistics?: boolean;
    packagingLogistics?: string;
    sku?: string;
  } | null;
  onRequestQuote?: (productName: string) => void;
}

// Simple HTML sanitizer to prevent XSS attacks while permitting formatted text
const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/on\w+=[^\s>]+/gi, '')
    .replace(/href=["']javascript:[^"']*["']/gi, '')
    .replace(/src=["']javascript:[^"']*["']/gi, '')
    .replace(/src=["']data:[^"']*["']/gi, '');

  const allowedTags = [
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    'ol',
    'ul',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'div',
    'span',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ];
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  sanitized = sanitized.replace(tagRegex, (match, tagName) => {
    return allowedTags.includes(tagName.toLowerCase()) ? match : '';
  });

  return sanitized;
};

export const QualityStandardsModal: React.FC<QualityStandardsModalProps> = ({
  isOpen,
  onClose,
  productName,
  qualityStandards,
  typicalQualityParameters,
  product,
  onRequestQuote,
}) => {
  const { scrollToSection } = useScrollToSection();
  const { locale } = useLocale();

  const isFrench = locale?.startsWith('fr');
  const isSpanish = locale?.startsWith('es') || locale === 'esp';

  // Localized UI Labels
  const labels = {
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
    emptyParameters: isFrench
      ? 'Les paramètres de qualité représentatifs pour ce lot sont personnalisés selon les spécifications contractuelles.'
      : isSpanish
        ? 'Los parámetros de calidad representativos para este lote se personalizan según las especificaciones del contrato.'
        : 'Representative quality parameters for this lot are customized to contract specifications.',
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
    viewSpecPage: isFrench
      ? 'Voir la fiche complète'
      : isSpanish
        ? 'Ver página de especificaciones'
        : 'View Full Spec Page',
    originLabel: isFrench ? 'Origine' : isSpanish ? 'Origen' : 'Origin',
  };

  const displayName =
    product?.title ||
    product?.name ||
    product?.productName ||
    productName ||
    'Agricultural Commodity';

  const parametersText =
    product?.typicalQualityParameters ||
    typicalQualityParameters ||
    product?.qualityStandards ||
    qualityStandards ||
    '';

  const productImage =
    product?.image ||
    product?.image1 ||
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop';

  const handleRequestQuote = () => {
    onClose();
    if (onRequestQuote) {
      onRequestQuote(displayName);
    } else {
      scrollToSection('contact', 100);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full rounded-2xl max-h-[90vh] overflow-y-auto bg-[#FDF8F0] dark:bg-agro-neutral-900 text-[#281909] dark:text-agro-neutral-50 backdrop-blur-xl border border-agro-primary-200/60 dark:border-agro-primary-800/60 shadow-2xl p-5 sm:p-8">
        <DialogHeader className="pb-3 border-b border-agro-primary-100 dark:border-agro-primary-900/40">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {product?.category && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-agro-primary-100 text-agro-primary-900 dark:bg-agro-primary-950 dark:text-agro-primary-300">
                {product.category}
              </span>
            )}
            {product?.sourcingOrigin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/95 dark:bg-agro-neutral-800 text-agro-primary-800 dark:text-agro-primary-300 shadow-sm border border-agro-primary-200/60 dark:border-agro-primary-700">
                {product.sourcingOrigin.toLowerCase().match(/canada|prairie|saskatchewan|alberta|manitoba|ontario/) ? (
                  <span aria-hidden="true">🍁</span>
                ) : (
                  <Globe size={11} className="text-agro-secondary-600" />
                )}
                <span>{product.sourcingOrigin}</span>
              </span>
            )}
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-[#281909] dark:text-agro-neutral-50 font-serif">
            {displayName}
          </DialogTitle>
        </DialogHeader>

        {/* Two-Column Split Layout on Desktop (Left 45% visual, Right 55% specifications dossier) */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visual Showcase (Clean White Studio Canvas) */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-[4/3] md:aspect-square w-full rounded-2xl overflow-hidden bg-white border border-agro-primary-200/60 dark:border-agro-primary-800/40 p-4 shadow-sm flex items-center justify-center">
              <WixImage
                src={productImage}
                alt={displayName}
                fill
                className="object-contain w-full h-full max-h-full hover:scale-105 transition-transform duration-500"
              />
              {product?.sourcingOrigin && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 dark:bg-agro-neutral-900/95 text-agro-primary-900 dark:text-agro-primary-200 shadow-sm backdrop-blur-md border border-agro-primary-200/60 dark:border-agro-primary-800/60">
                    {product.sourcingOrigin.toLowerCase().match(/canada|prairie|saskatchewan|alberta|manitoba|ontario/) ? (
                      <span aria-hidden="true">🍁</span>
                    ) : (
                      <Globe size={10} className="text-agro-secondary-600" />
                    )}
                    <span>{product.sourcingOrigin}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Quick Sourcing Overview pill */}
            <div className="p-3 rounded-xl bg-agro-primary-50/70 dark:bg-agro-neutral-850 border border-agro-primary-100 dark:border-agro-primary-900/50 text-xs text-gray-600 dark:text-agro-neutral-300 flex items-center justify-between">
              <span className="font-semibold text-agro-primary-900 dark:text-agro-neutral-100">
                {labels.originLabel}:
              </span>
              <span>{product?.sourcingOrigin || 'Direct Cooperative Origin'}</span>
            </div>
          </div>

          {/* Right Column: Identity, Quality Parameters & Logistics */}
          <div className="md:col-span-7 space-y-5">
            {/* Description overview if available */}
            {product?.description && (
              <div
                className="text-sm text-gray-700 dark:text-agro-neutral-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
              />
            )}

            {/* Typical Quality Parameters Section */}
            <div className="rounded-xl bg-white/90 dark:bg-agro-neutral-850 p-4 sm:p-5 border border-agro-primary-200/60 dark:border-agro-primary-800/60 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-agro-primary-600 dark:text-agro-primary-400" />
                <h4 className="text-base sm:text-lg font-semibold text-agro-primary-900 dark:text-agro-primary-200">
                  {labels.sectionTitle}
                </h4>
              </div>

              {parametersText ? (
                <div
                  className="prose prose-sm max-w-none text-gray-700 dark:text-agro-neutral-300 prose-headings:text-agro-primary-900 dark:prose-headings:text-agro-primary-200 prose-ul:list-disc prose-li:ml-4"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(parametersText) }}
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-agro-neutral-400 italic">
                  {labels.emptyParameters}
                </p>
              )}

              {/* Footnote Disclaimer */}
              <p className="mt-4 pt-3 border-t border-dashed border-agro-primary-200/50 dark:border-agro-primary-800/50 text-xs text-gray-500 dark:text-agro-neutral-400 leading-normal italic">
                {labels.disclaimer}
              </p>
            </div>

            {/* Export & Packaging Logistics (Toggleable - rendered only if displayLogistics is true) */}
            {Boolean(product?.displayLogistics && product?.packagingLogistics) && (
              <div className="rounded-xl bg-agro-primary-50/70 dark:bg-agro-neutral-850 p-4 sm:p-5 border border-agro-primary-200/60 dark:border-agro-primary-800/60">
                <div className="flex items-center gap-2 mb-2">
                  <PackageCheck className="h-5 w-5 text-agro-primary-700 dark:text-agro-primary-400" />
                  <h4 className="text-base font-semibold text-agro-primary-900 dark:text-agro-primary-200">
                    {labels.logisticsTitle}
                  </h4>
                </div>
                <div
                  className="text-sm text-gray-700 dark:text-agro-neutral-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(product?.packagingLogistics || ''),
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions (Sticky bottom bar on mobile for touch accessibility) */}
        <div className="mt-6 pt-4 border-t border-agro-primary-100 dark:border-agro-primary-900/40 sticky bottom-0 bg-[#FDF8F0]/95 dark:bg-agro-neutral-900/95 backdrop-blur-md z-10 flex flex-col sm:flex-row gap-3 justify-end items-center">
          {product?.slug && (
            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-agro-primary-300 dark:border-agro-primary-700 text-sm font-semibold text-agro-primary-800 dark:text-agro-primary-200 hover:bg-agro-primary-100/50 transition-colors"
            >
              {labels.viewSpecPage}
              <ExternalLink size={14} />
            </Link>
          )}

          <Button
            onClick={handleRequestQuote}
            className="w-full sm:w-auto btn-agro-primary flex items-center justify-center gap-2 py-2.5 px-6 font-semibold shadow-md"
          >
            {labels.requestQuote}
            <ArrowRight size={14} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const TypicalQualityParametersModal = QualityStandardsModal;
export default QualityStandardsModal;
