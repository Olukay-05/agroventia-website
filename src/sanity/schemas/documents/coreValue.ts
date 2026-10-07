import { defineType, defineField } from 'sanity';

export const coreValue = defineType({
  name: 'coreValue',
  title: 'Core Value',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Value Title',
      type: 'localeString',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
    }),
    defineField({
      name: 'reference',
      title: 'Reference / Identifier',
      type: 'string',
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
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'reference',
    },
    prepare({
      title,
      subtitle,
    }: {
      title?: string;
      subtitle?: string;
    }) {
      return {
        title: title || 'Untitled Core Value',
        subtitle: subtitle ? `Ref: ${subtitle}` : '',
      };
    },
  },
});
