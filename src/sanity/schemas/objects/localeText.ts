import { defineType, defineField } from 'sanity';

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English (Default)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'fr',
      title: 'French',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'esp',
      title: 'Spanish',
      type: 'text',
      rows: 4,
    }),
  ],
});
