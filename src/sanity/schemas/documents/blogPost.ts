import { defineType, defineField } from 'sanity';

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Post Title',
      type: 'localeString',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / Summary',
      type: 'localeText',
    }),
    defineField({
      name: 'content',
      title: 'Content / Body',
      type: 'localeBlogBody',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
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
  ],
  orderings: [
    {
      title: 'Publication Date, Newest',
      name: 'publishedDateDesc',
      by: [{ field: 'publishedDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      author: 'author.name',
      media: 'coverImage',
      date: 'publishedDate',
    },
    prepare({
      title,
      author,
      media,
      date,
    }: {
      title?: string;
      author?: string;
      media?: any;
      date?: string;
    }) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : '';
      return {
        title: title || 'Untitled Blog Post',
        subtitle: [author, formattedDate].filter(Boolean).join(' • '),
        media,
      };
    },
  },
});
