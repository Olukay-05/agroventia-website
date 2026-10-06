import { defineType, defineField } from 'sanity';

export const productsSection = defineType({
  name: 'productsSection',
  title: 'Products Intro',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'localeString',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'localeText',
    }),
    defineField({
      name: 'categoriesTitle',
      title: 'Category Mode Title',
      type: 'localeString',
      description: 'e.g., "Product Categories"',
    }),
    defineField({
      name: 'categoriesSubtitle',
      title: 'Category Mode Subtitle',
      type: 'localeText',
      description: 'e.g., "Discover our comprehensive range of premium agricultural products..."',
    }),
    defineField({
      name: 'searchPlaceholder',
      title: 'Search Input Placeholder',
      type: 'localeString',
      description: 'e.g., "Search products..."',
    }),
    defineField({
      name: 'ctaBanner',
      title: 'Trust & Supply Conversion Banner',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Banner Heading',
          type: 'localeString',
          description: 'e.g., "Quality You Can Trust. Supply You Can Rely On Always."',
        }),
        defineField({
          name: 'description',
          title: 'Banner Description',
          type: 'localeText',
          description: 'e.g., "AgroVentia Inc. delivers Africa\'s best consistently, transparently, and on time..."',
        }),
        defineField({
          name: 'primaryButtonText',
          title: 'Primary CTA Button Label',
          type: 'localeString',
          description: 'e.g., "Request Product Catalog"',
        }),
        defineField({
          name: 'secondaryButtonText',
          title: 'Secondary CTA Button Label',
          type: 'localeString',
          description: 'e.g., "Schedule a Call"',
        }),
        defineField({
          name: 'isActive',
          title: 'Show CTA Banner',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'sectionImage',
      title: 'Products Showcase Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'sectionTitle.en',
      media: 'sectionImage',
    },
    prepare({
      title,
      media,
    }: {
      title?: string;
      media?: any;
    }) {
      return {
        title: title || 'Products Intro',
        subtitle: 'Products Section Singleton',
        media,
      };
    },
  },
});
