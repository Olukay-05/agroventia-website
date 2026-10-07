import { defineType, defineField } from 'sanity';

export const servicesSection = defineType({
  name: 'servicesSection',
  title: 'Services Intro',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'localeString',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Section Description / Process Overview',
      type: 'localeText',
    }),
    defineField({
      name: 'importServices',
      title: 'Import & Export Services Detail',
      type: 'localeText',
    }),
    defineField({
      name: 'customSourcing',
      title: 'Custom Sourcing Detail',
      type: 'localeText',
    }),
    defineField({
      name: 'qualityAssurance',
      title: 'Quality Assurance Detail',
      type: 'localeText',
    }),
    defineField({
      name: 'logistics',
      title: 'Logistics & Supply Chain Detail',
      type: 'localeText',
    }),
    defineField({
      name: 'documentation',
      title: 'Documentation & Compliance Detail',
      type: 'localeText',
    }),
    defineField({
      name: 'servicesImage',
      title: 'Services Showcase Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imageBackground',
      title: 'Services Background Image',
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
      media: 'servicesImage',
    },
    prepare({
      title,
      media,
    }: {
      title?: string;
      media?: any;
    }) {
      return {
        title: title || 'Services Intro',
        subtitle: 'Services Section Singleton',
        media,
      };
    },
  },
});
