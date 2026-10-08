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


export const localeBlogBody = defineType({
  name: 'localeBlogBody',
  title: 'Localized Blog Body',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: 'en',
      title: 'English (Markdown supported)',
      type: 'markdown',
      description: 'Supports Markdown: # Heading, **bold**, *italic*, [link](url), - lists',
    }),
    defineField({
      name: 'fr',
      title: 'French',
      type: 'markdown',
    }),
    defineField({
      name: 'esp',
      title: 'Spanish',
      type: 'markdown',
    }),
  ],
});
