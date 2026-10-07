import { defineType, defineField } from 'sanity';

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized String',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English (Default)',
      type: 'string',
    }),
    defineField({
      name: 'fr',
      title: 'French',
      type: 'string',
    }),
    defineField({
      name: 'esp',
      title: 'Spanish',
      type: 'string',
    }),
  ],
});
