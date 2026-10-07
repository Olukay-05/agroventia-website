'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPageNumbers } from '@/lib/product-filters';
import { useLocale } from '@/contexts/LocaleContext';

export interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  className = '',
}) => {
  const { locale } = useLocale();
  const isFrench = locale?.startsWith('fr');
  const isSpanish = locale?.startsWith('es') || locale === 'esp';

  const labels = {
    previous: isFrench ? 'Précédent' : isSpanish ? 'Anterior' : 'Previous',
    next: isFrench ? 'Suivant' : isSpanish ? 'Siguiente' : 'Next',
    page: isFrench ? 'Page' : isSpanish ? 'Página' : 'Page',
    of: isFrench ? 'sur' : isSpanish ? 'de' : 'of',
    showingRange: (start: number, end: number, total: number) =>
      isFrench
        ? `Affichage de ${start}–${end} sur ${total} commodités`
        : isSpanish
          ? `Mostrando ${start}–${end} de ${total} productos`
          : `Showing ${start}–${end} of ${total} commodities`,
  };

  if (totalItems === 0) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      role="navigation"
      aria-label="Product Catalog Pagination"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 pb-4 border-t border-agro-primary-100 dark:border-agro-primary-900/50 ${className}`}
    >
      {/* Range summary */}
      <div className="text-xs sm:text-sm text-gray-600 dark:text-agro-neutral-300 font-medium">
        {labels.showingRange(startIndex + 1, endIndex, totalItems)}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Previous Page Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="btn-agro-outline h-9 px-3 text-xs sm:text-sm font-medium flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">{labels.previous}</span>
          </Button>

          {/* Page Number Buttons */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((item, idx) => {
              if (item === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-1 text-xs sm:text-sm text-gray-400 select-none"
                    aria-hidden="true"
                  >
                    …
                  </span>
                );
              }

              const isCurrent = item === currentPage;
              return (
                <Button
                  key={`page-${item}`}
                  variant={isCurrent ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(item)}
                  aria-label={`${labels.page} ${item}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`h-9 min-w-9 px-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-agro-primary-700 text-white shadow-md hover:bg-agro-primary-800'
                      : 'btn-agro-outline bg-white dark:bg-agro-neutral-850 hover:bg-agro-primary-50 dark:hover:bg-agro-neutral-800'
                  }`}
                >
                  {item}
                </Button>
              );
            })}
          </div>

          {/* Next Page Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
            className="btn-agro-outline h-9 px-3 text-xs sm:text-sm font-medium flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">{labels.next}</span>
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </nav>
  );
};

export default ProductPagination;
