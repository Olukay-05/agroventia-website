import { defineType, defineField } from 'sanity';

export const contactInfo = defineType({
  name: 'contactInfo',
  title: 'Contact & Footer Info',
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
      name: 'businessEmail',
      title: 'Business Email',
      type: 'string',
      validation: (Rule: any) =>
        Rule.regex(
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          { name: 'email', invert: false }
        ).error('Please enter a valid email address'),
    }),
    defineField({
      name: 'businessPhone',
      title: 'Business Phone',
      type: 'string',
    }),
    defineField({
      name: 'businessAddress',
      title: 'Business Address',
      type: 'localeString',
    }),
    defineField({
      name: 'businessHours',
      title: 'Business Hours',
      type: 'localeText',
    }),
    defineField({
      name: 'responseTime',
      title: 'Expected Response Time',
      type: 'localeString',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'string',
    }),
    defineField({
      name: 'contactImage',
      title: 'Contact Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'mapEmbedCode',
      title: 'Map Embed Code / Iframe URL',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
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
      subtitle: 'businessEmail',
      media: 'contactImage',
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
        title: title || 'Contact & Footer Info',
        subtitle: subtitle || 'Contact Singleton',
        media,
      };
    },
  },
});
