import { defineType, defineField } from 'sanity';

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'displayMode',
      title: 'Hero Display Mode',
      description:
        'Choose whether the homepage displays the dynamic carousel (from Carousel Slides) or the static custom hero banner.',
      type: 'string',
      options: {
        list: [
          { title: 'Dynamic Carousel (Default)', value: 'carousel' },
          { title: 'Static Singleton Banner', value: 'static' },
        ],
        layout: 'radio',
      },
      initialValue: 'carousel',
    }),
    defineField({
      name: 'title',
      title: 'Title / Heading',
      type: 'localeString',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'localeText',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
    }),
    defineField({
      name: 'ctaPrimary',
      title: 'Primary CTA Text',
      type: 'localeString',
    }),
    defineField({
      name: 'ctaSecondary',
      title: 'Secondary CTA Text',
      type: 'localeString',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link URL',
      type: 'url',
      validation: (Rule: any) =>
        Rule.uri({
          allowRelative: true,
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
    defineField({
      name: 'companyLogo',
      title: 'Company Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay Opacity (0 - 100)',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(100),
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
      subtitle: 'subtitle.en',
      displayMode: 'displayMode',
      media: 'backgroundImage',
    },
    prepare({
      title,
      subtitle,
      displayMode,
      media,
    }: {
      title?: string;
      subtitle?: string;
      displayMode?: string;
      media?: any;
    }) {
      const mode = displayMode === 'static' ? 'Static Banner' : 'Carousel Mode';
      return {
        title: title || 'Hero Banner',
        subtitle: `[${mode}] ${subtitle || 'Homepage Hero Section'}`,
        media,
      };
    },
  },
});
