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
      <DialogContent className="max-w-3xl rounded-xl max-h-[85vh] overflow-y-auto bg-[#FDF8F0] dark:bg-agro-neutral-900 text-[#281909] dark:text-agro-neutral-50 backdrop-blur-xl border border-agro-primary-200/40 dark:border-agro-primary-800/40 shadow-2xl p-6 sm:p-8">
        <DialogHeader className="pb-4 border-b border-agro-primary-100 dark:border-agro-primary-900/40">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {product?.category && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-agro-primary-100 text-agro-primary-800 dark:bg-agro-primary-950 dark:text-agro-primary-300">
                {product.category}
              </span>
            )}
            {product?.sourcingOrigin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-agro-secondary-100 text-agro-secondary-900 dark:bg-agro-secondary-950 dark:text-agro-secondary-300">
                <Globe size={11} />
                {product.sourcingOrigin}
              </span>
            )}
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-[#281909] dark:text-agro-neutral-50 font-serif">
            {displayName}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Visual Showcase */}
          <div className="relative h-56 sm:h-64 w-full rounded-lg overflow-hidden bg-white/60 dark:bg-agro-neutral-800/60 border border-agro-primary-100 dark:border-agro-primary-900/30">
            <WixImage
              src={productImage}
              alt={displayName}
              fill
              className="object-contain p-4 hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Description overview if available */}
          {product?.description && (
            <div
              className="text-sm text-gray-700 dark:text-agro-neutral-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
            />
          )}

          {/* Typical Quality Parameters Section */}
          <div className="rounded-lg bg-white/80 dark:bg-agro-neutral-850 p-4 sm:p-5 border border-agro-primary-100 dark:border-agro-primary-900/50 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-agro-primary-600 dark:text-agro-primary-400" />
              <h4 className="text-base sm:text-lg font-semibold text-agro-primary-900 dark:text-agro-primary-200">
                {labels.sectionTitle}
              </h4>
            </div>

            {parametersText ? (
              <div
                className="prose prose-sm max-w-none text-gray-700 dark:text-agro-neutral-300 prose-headings:text-agro-primary-900 prose-ul:list-disc prose-li:ml-4"
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
            <div className="rounded-lg bg-agro-primary-50/70 dark:bg-agro-neutral-850 p-4 sm:p-5 border border-agro-primary-200/60 dark:border-agro-primary-800/60">
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

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-agro-primary-100 dark:border-agro-primary-900/40 flex flex-col sm:flex-row gap-3 justify-end items-center">
          {product?.slug && (
            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md border border-agro-primary-300 dark:border-agro-primary-700 text-sm font-medium text-agro-primary-800 dark:text-agro-primary-200 hover:bg-agro-primary-100/50 transition-colors"
            >
              {labels.viewSpecPage}
              <ExternalLink size={14} />
            </Link>
          )}

          <Button
            onClick={handleRequestQuote}
            className="w-full sm:w-auto btn-agro-primary flex items-center justify-center gap-2 py-2.5 px-5"
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
