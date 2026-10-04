import { defineType, defineField } from 'sanity';

export const aboutSection = defineType({
  name: 'aboutSection',
  title: 'About AgroVentia',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'localeString',
    }),
    defineField({
      name: 'story',
      title: 'Company Story / Content',
      type: 'localeText',
    }),
    defineField({
      name: 'mission',
      title: 'Mission Statement',
      type: 'localeText',
    }),
    defineField({
      name: 'vision',
      title: 'Vision Statement',
      type: 'localeText',
    }),
    defineField({
      name: 'headquarters',
      title: 'Headquarters Location',
      type: 'string',
    }),
    defineField({
      name: 'foundingYear',
      title: 'Founding Year',
      type: 'string',
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'string',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About Section / Facility Image',
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
      subtitle: 'headquarters',
      media: 'aboutImage',
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
        title: title || 'About AgroVentia',
        subtitle: subtitle ? `HQ: ${subtitle}` : 'About Section',
        media,
      };
    },
  },
});
