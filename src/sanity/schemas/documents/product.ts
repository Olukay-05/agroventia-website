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
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'productName.en',
        maxLength: 96,
      },
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
      title: 'Commodity Category',
      type: 'string',
      description: 'Commodity sector classification',
      options: {
        list: [
          { title: 'Grains & Cereals', value: 'Grains & Cereals' },
          { title: 'Pulses & Legumes', value: 'Pulses & Legumes' },
          { title: 'Oilseeds, Nuts & Seeds', value: 'Oilseeds, Nuts & Seeds' },
          { title: 'Spices & Botanicals', value: 'Spices & Botanicals' },
          { title: 'Horticultural & Ingredients', value: 'Horticultural & Ingredients' },
        ],
      },
    }),
    defineField({
      name: 'corridor',
      title: 'Trade Corridor',
      type: 'string',
      description: 'Primary trade corridor origin',
      options: {
        list: [
          { title: 'Canadian Prairies & Eastern Canada', value: 'canada' },
          { title: 'Tropical & West Africa', value: 'africa' },
        ],
      },
    }),
    defineField({
      name: 'sourcingOrigin',
      title: 'Sourcing Origin',
      type: 'localeString',
      description: 'Regional sourcing corridor (e.g., Canadian Prairies, West Africa)',
    }),
    defineField({
      name: 'typicalQualityParameters',
      title: 'Typical Quality Parameters',
      type: 'localeText',
      description: 'Representative quality parameters matrix and specifications',
    }),
    defineField({
      name: 'qualityStandards',
      title: 'Quality Standards (Legacy / Fallback)',
      type: 'string',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured on Homepage (3x3 Grid)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'displayLogistics',
      title: 'Display Export & Packaging Logistics',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle button to display export and packaging logistics on product details',
    }),
    defineField({
      name: 'packagingLogistics',
      title: 'Export & Packaging Logistics',
      type: 'localeText',
      description: 'Standard bag weights, container capacities, and supported Incoterms',
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
      category: 'category',
      corridor: 'corridor',
      media: 'productImage',
    },
    prepare({
      title,
      category,
      corridor,
      media,
    }: {
      title?: string;
      category?: string;
      corridor?: string;
      media?: any;
    }) {
      const corridorLabel = corridor === 'africa' ? 'West Africa' : corridor === 'canada' ? 'Canadian Prairies' : '';
      const subtitleParts = [category, corridorLabel].filter(Boolean);
      return {
        title: title || 'Untitled Product',
        subtitle: subtitleParts.join(' • ') || 'Commodity',
        media,
      };
    },
  },
});
