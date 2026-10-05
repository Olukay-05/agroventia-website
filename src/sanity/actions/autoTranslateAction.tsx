// src/sanity/actions/autoTranslateAction.tsx
import { useState } from 'react';
export interface DocumentActionProps {
  id: string;
  type: string;
  draft?: Record<string, any> | null;
  published?: Record<string, any> | null;
  patch: {
    execute: (patches: any[]) => void;
  };
  onComplete?: () => void;
  [key: string]: any;
}

export type DocumentActionComponent = (props: DocumentActionProps) => any;

// Document types that support automated multilingual localization
export const LOCALIZED_SCHEMA_TYPES = new Set([
  'heroSection',
  'aboutSection',
  'servicesSection',
  'productsSection',
  'contactInfo',
  'product',
  'coreValue',
  'carouselSlide',
  'category',
  'blogPost',
  'author',
  'serviceItem',
]);

// Map of schema type to fields that should be translated
const TRANSLATABLE_FIELDS_BY_TYPE: Record<string, string[]> = {
  heroSection: ['title', 'subtitle', 'description', 'ctaPrimary', 'ctaSecondary'],
  aboutSection: ['sectionTitle', 'mission', 'vision', 'story'],
  servicesSection: ['sectionTitle', 'subtitle', 'description'],
  productsSection: ['sectionTitle', 'subtitle', 'description'],
  contactInfo: ['title', 'subtitle', 'address', 'responsePromise'],
  product: ['productName', 'productDescription'],
  coreValue: ['title', 'description'],
  carouselSlide: ['title', 'subtitle', 'description', 'ctaText'],
  category: ['title', 'description'],
  blogPost: ['title', 'excerpt'],
  author: ['name', 'bio'],
  serviceItem: ['title', 'description'],
};

export const AutoTranslateAction: DocumentActionComponent = (
  props: DocumentActionProps
) => {
  const { id, type, draft, published, patch } = props;
  const [isTranslating, setIsTranslating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Only render for supported localized schema types
  if (!LOCALIZED_SCHEMA_TYPES.has(type)) {
    return null;
  }

  const doc = draft || published;
  if (!doc) {
    return null;
  }

  const translatableFields = TRANSLATABLE_FIELDS_BY_TYPE[type] || [];

  // Check if any existing French or Spanish content exists
  const hasExistingTranslations = translatableFields.some((field) => {
    const val = (doc as any)[field];
    return val && (val.fr?.trim() || val.esp?.trim());
  });

  const performTranslation = async () => {
    setIsTranslating(true);
    setShowConfirmDialog(false);

    try {
      const patches: Record<string, any> = {};

      for (const field of translatableFields) {
        const fieldVal = (doc as any)[field];
        const enSource = fieldVal?.en?.trim();

        if (enSource) {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: enSource,
              context: `${type}.${field}`,
              forceFresh: true,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data) {
              patches[`${field}.fr`] = data.data.fr;
              patches[`${field}.esp`] = data.data.esp;
            }
          }
        }
      }

      if (Object.keys(patches).length > 0) {
        patch.execute([{ set: patches }]);
      }
    } catch (err) {
      console.error('[AutoTranslateAction] Failed to execute translation:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTrigger = () => {
    if (hasExistingTranslations) {
      setShowConfirmDialog(true);
    } else {
      performTranslation();
    }
  };

  return {
    label: isTranslating ? 'Translating...' : '✨ Auto-Translate to FR & ES',
    title: 'Generate Canadian French and B2B Spanish translations for empty fields',
    disabled: isTranslating,
    onHandle: handleTrigger,
    dialog: showConfirmDialog
      ? {
          type: 'confirm',
          tone: 'caution',
          onCancel: () => setShowConfirmDialog(false),
          onConfirm: () => performTranslation(),
          message:
            'Existing French and Spanish content detected in this document. Do you want to overwrite it with automated translations? (Human edits will be replaced)',
        }
      : false,
  };
};
