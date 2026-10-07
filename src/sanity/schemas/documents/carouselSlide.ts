import { defineType, defineField } from 'sanity';

export const carouselSlide = defineType({
  name: 'carouselSlide',
  title: 'Carousel Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Slide Title',
      type: 'localeString',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'localeString',
    }),
    defineField({
      name: 'description',
      title: 'Description / Caption',
      type: 'localeText',
    }),
    defineField({
      name: 'image',
      title: 'Slide Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'tagline.en',
      subtitle: 'title.en',
      media: 'image',
    },
    prepare({
      title,
      subtitle,
      media,
    }: {
      title?: string;
      subtitle?: string;
      media?: any;
    }) {
      return {
        title: title || subtitle || 'Carousel Slide',
        subtitle: subtitle || '',
        media,
      };
    },
  },
});
