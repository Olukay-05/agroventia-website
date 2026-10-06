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
      name: 'whyChooseTitle',
      title: 'Why Choose Section Title',
      type: 'localeString',
      description: 'e.g., "Why Choose AgroVentia Inc.?"',
    }),
    defineField({
      name: 'highlights',
      title: 'Company Highlights / Stat Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'highlightItem',
          title: 'Highlight Item',
          fields: [
            defineField({
              name: 'metric',
              title: 'Metric Badge Text',
              type: 'string',
              description: 'e.g., "10+", "20+", "100%"',
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Card Title',
              type: 'localeString',
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Card Description',
              type: 'localeText',
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'colorVariant',
              title: 'Color Accent Theme',
              type: 'string',
              options: {
                list: [
                  { title: 'Primary Green (Primary 100)', value: 'primary' },
                  { title: 'Golden Amber (Secondary 100)', value: 'secondary' },
                  { title: 'Warm Bronze (Bronze 400)', value: 'bronze' },
                  { title: 'Neutral Sage (Neutral 100)', value: 'neutral' },
                  { title: 'Forest Emerald (Primary 200)', value: 'forest' },
                ],
              },
              initialValue: 'primary',
            }),
            defineField({
              name: 'sortOrder',
              title: 'Sort Order',
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
          preview: {
            select: {
              title: 'title.en',
              subtitle: 'metric',
            },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return {
                title: title || 'Highlight Item',
                subtitle: subtitle ? `Metric: ${subtitle}` : undefined,
              };
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
