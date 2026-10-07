// src/lib/translation/schema.ts
import { z } from 'zod';

/**
 * Sanitizes text to strictly eliminate em-dashes, en-dashes, and floating hyphen breaks.
 * Replaces em-dashes and en-dashes with natural comma breaks or colons, preserving compound words.
 */
export function sanitizeNoDashes(text: string): string {
  if (!text || typeof text !== 'string') return '';

  return text
    // Replace em-dashes and en-dashes surrounded by spaces with a comma and space
    .replace(/\s*[—–]\s*/g, ', ')
    // Replace floating hyphen clause separators (e.g. "word - word") with comma
    .replace(/\s+-\s+/g, ', ')
    // Replace any remaining rogue em-dashes or en-dashes with a comma
    .replace(/[—–]/g, ', ')
    // Clean up any double commas or awkward spacing produced
    .replace(/,\s*,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Reusable Zod validator ensuring translated text is non-empty,
 * and contains strictly zero em-dashes, en-dashes, or floating hyphen breaks.
 */
export const cleanTextValidator = z
  .string()
  .min(1, 'Translation cannot be empty')
  .refine((val) => !/[—–]/.test(val), {
    message: 'Translation must not contain em-dashes or en-dashes',
  })
  .refine((val) => !/\s-\s/.test(val), {
    message: 'Translation must not contain floating hyphen clause separators',
  });

export const TranslationOutputSchema = z.object({
  fr: cleanTextValidator,
  esp: cleanTextValidator,
});

export type TranslationOutputValidated = z.infer<typeof TranslationOutputSchema>;
