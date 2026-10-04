import { defineType, defineField } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product Catalog Item',
  type: 'document',
  fields: [
    defineField({
      name: 'productName',
      title: 'Product Name / Title',
      type: 'localeString',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'productDescription',
      title: 'Product Description',
      type: 'localeText',
    }),
    defineField({
      name: 'productImage',
      title: 'Primary Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'images',
      title: 'Additional Product Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price / Unit Reference',
      type: 'number',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'sku',
      title: 'SKU / Product Code',
      type: 'string',
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'qualityStandards',
      title: 'Quality Standards & Certifications',
      type: 'string',
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
    {
      title: 'Product Name',
      name: 'productNameAsc',
      by: [{ field: 'productName.en', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'productName.en',
      subtitle: 'sku',
      media: 'productImage',
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
        title: title || 'Untitled Product',
        subtitle: subtitle ? `SKU: ${subtitle}` : '',
        media,
      };
    },
  },
});
