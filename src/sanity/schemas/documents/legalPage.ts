import { defineType, defineField } from 'sanity';

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal & Policy Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'localeString',
      description: 'e.g., "Privacy Policy", "Terms of Service", "Cookie Policy"',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL path)',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      initialValue: () => new Date().toISOString().split('T')[0],
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction Text',
      type: 'localeText',
      description: 'Introductory paragraph displayed beneath the title',
    }),
    defineField({
      name: 'body',
      title: 'Full Policy Content (Markdown)',
      type: 'localeBlogBody',
      description: 'Optional unified Markdown document editor. If populated, renders as a continuous document with formatting, headings, and lists.',
    }),
    defineField({
      name: 'sections',
      title: 'Policy Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'policySection',
          title: 'Policy Section',
          fields: [
            defineField({
              name: 'sectionId',
              title: 'Section Identifier / Anchor',
              type: 'string',
              description: 'e.g., "info-collection", "cookies-data", "liability"',
            }),
            defineField({
              name: 'heading',
              title: 'Section Heading',
              type: 'localeString',
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Section Content',
              type: 'localeText',
              description: 'Full text for this section (markdown or line breaks supported)',
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'sortOrder',
              title: 'Sort Order',
              type: 'number',
              initialValue: 0,
            }),
          ],
          preview: {
            select: {
              title: 'heading.en',
              subtitle: 'sectionId',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Meta Title',
      type: 'localeString',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'localeText',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Published',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'slug.current',
      date: 'lastUpdated',
    },
    prepare({
      title,
      subtitle,
      date,
    }: {
      title?: string;
      subtitle?: string;
      date?: string;
    }) {
      return {
        title: title || 'Legal Page',
        subtitle: `/${subtitle || ''} • Updated: ${date || 'N/A'}`,
      };
    },
  },
});
