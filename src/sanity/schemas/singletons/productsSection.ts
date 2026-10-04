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
