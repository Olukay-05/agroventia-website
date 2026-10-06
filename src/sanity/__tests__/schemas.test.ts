import { schemaTypes, singletonTypes } from '../schemas';
import { heroSection } from '../schemas/singletons/heroSection';
import { aboutSection } from '../schemas/singletons/aboutSection';
import { servicesSection } from '../schemas/singletons/servicesSection';
import { productsSection } from '../schemas/singletons/productsSection';
import { contactInfo } from '../schemas/singletons/contactInfo';
import { serviceItem } from '../schemas/documents/serviceItem';
import { product } from '../schemas/documents/product';
import { coreValue } from '../schemas/documents/coreValue';
import { carouselSlide } from '../schemas/documents/carouselSlide';
import { category } from '../schemas/documents/category';
import { blogPost } from '../schemas/documents/blogPost';
import { author } from '../schemas/documents/author';
import { legalPage } from '../schemas/documents/legalPage';

describe('Sanity Studio Schemas (Story 1 / CAP-1 & Story 8 / CAP-8)', () => {
  it('should export all 15 schema types (2 objects, 5 singletons, 8 collections)', () => {
    expect(schemaTypes).toHaveLength(15);
    const names = schemaTypes.map((s: any) => s.name);
    
    // Objects
    expect(names).toContain('localeString');
    expect(names).toContain('localeText');

    // Singletons
    expect(names).toContain('heroSection');
    expect(names).toContain('aboutSection');
    expect(names).toContain('servicesSection');
    expect(names).toContain('productsSection');
    expect(names).toContain('contactInfo');

    // Collections
    expect(names).toContain('serviceItem');
    expect(names).toContain('product');
    expect(names).toContain('coreValue');
    expect(names).toContain('carouselSlide');
    expect(names).toContain('category');
    expect(names).toContain('blogPost');
    expect(names).toContain('author');
    expect(names).toContain('legalPage');
  });

  it('should register exact 5 singleton types in singletonTypes set', () => {
    expect(singletonTypes.size).toBe(5);
    expect(singletonTypes.has('heroSection')).toBe(true);
    expect(singletonTypes.has('aboutSection')).toBe(true);
    expect(singletonTypes.has('servicesSection')).toBe(true);
    expect(singletonTypes.has('productsSection')).toBe(true);
    expect(singletonTypes.has('contactInfo')).toBe(true);
  });

  it('should configure hotspot: true on all image fields across document schemas', () => {
    const documentSchemas = [
      heroSection,
      aboutSection,
      servicesSection,
      productsSection,
      contactInfo,
      serviceItem,
      product,
      coreValue,
      carouselSlide,
      category,
      blogPost,
      author,
      legalPage,
    ];

    for (const schema of documentSchemas as any[]) {
      if (schema.fields) {
        for (const field of schema.fields) {
          if (field.type === 'image') {
            expect(field.options?.hotspot).toBe(true);
          }
          if (field.type === 'array' && field.of) {
            for (const item of field.of) {
              if (item.type === 'image') {
                expect(item.options?.hotspot).toBe(true);
              }
            }
          }
        }
      }
    }
  });

  it('should ensure multilingual objects have fields for en, fr, and esp', () => {
    const localeString = schemaTypes.find((s: any) => s.name === 'localeString') as any;
    const localeText = schemaTypes.find((s: any) => s.name === 'localeText') as any;

    expect(localeString).toBeDefined();
    expect(localeText).toBeDefined();

    const strLangs = localeString.fields.map((f: any) => f.name);
    expect(strLangs).toEqual(expect.arrayContaining(['en', 'fr', 'esp']));

    const textLangs = localeText.fields.map((f: any) => f.name);
    expect(textLangs).toEqual(expect.arrayContaining(['en', 'fr', 'esp']));
  });
});
