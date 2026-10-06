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
      name: 'companyTagline',
      title: 'Footer Company Tagline',
      type: 'localeString',
      description: 'e.g., "Agricultural Solutions"',
    }),
    defineField({
      name: 'companyBio',
      title: 'Footer Company Elevator Pitch / Bio',
      type: 'localeText',
      description: 'e.g., "Trusted agricultural export partner delivering premium products to global markets..."',
    }),
    defineField({
      name: 'followUsTitle',
      title: 'Follow Us Heading',
      type: 'localeString',
      description: 'e.g., "Follow Us"',
    }),
    defineField({
      name: 'quickLinksTitle',
      title: 'Quick Links Heading',
      type: 'localeString',
      description: 'e.g., "Quick Links"',
    }),
    defineField({
      name: 'coreValuesTitle',
      title: 'Core Values Heading',
      type: 'localeString',
      description: 'e.g., "Our Core Values"',
    }),
    defineField({
      name: 'productCategoriesTitle',
      title: 'Product Categories Heading',
      type: 'localeString',
      description: 'e.g., "Product Categories"',
    }),
    defineField({
      name: 'copyrightNotice',
      title: 'Copyright Notice Suffix',
      type: 'localeString',
      description: 'e.g., "AgroVentia Inc. All rights reserved."',
    }),
    defineField({
      name: 'backToTopText',
      title: 'Back to Top Button Label',
      type: 'localeString',
      description: 'e.g., "Back to Top"',
    }),
    defineField({
      name: 'legalLinks',
      title: 'Footer Legal Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'legalLinkItem',
          title: 'Legal Link',
          fields: [
            defineField({
              name: 'label',
              title: 'Link Label',
              type: 'localeString',
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Target URL / Path',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label.en',
              subtitle: 'url',
            },
          },
        },
      ],
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
