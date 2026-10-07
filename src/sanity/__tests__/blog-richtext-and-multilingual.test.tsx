import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RichTextRenderer from '@/components/blog/RichTextRenderer';
import { transformBlogPost } from '@/lib/api/sanity-client';
import { LocaleProvider } from '@/contexts/LocaleContext';

describe('Blog Rich Text & Multilingual Integration', () => {
  describe('RichTextRenderer', () => {
    it('renders Sanity Portable Text blocks with proper headings and paragraphs', () => {
      const portableTextContent = [
        {
          _type: 'block',
          _key: 'b1',
          style: 'h2',
          children: [{ _type: 'span', text: 'Sustainable Agriculture Horizons', marks: [] }],
        },
        {
          _type: 'block',
          _key: 'b2',
          style: 'normal',
          children: [
            { _type: 'span', text: 'AgroVentia leads trade with ', marks: [] },
            { _type: 'span', text: 'premium pulse commodities', marks: ['strong'] },
            { _type: 'span', text: ' worldwide.', marks: [] },
          ],
        },
        {
          _type: 'block',
          _key: 'b3',
          style: 'blockquote',
          children: [{ _type: 'span', text: 'Quality is our global hallmark.', marks: [] }],
        },
      ];

      render(<RichTextRenderer content={portableTextContent} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Sustainable Agriculture Horizons');
      expect(screen.getByText('premium pulse commodities')).toBeInTheDocument();
      expect(screen.getByText('Quality is our global hallmark.')).toBeInTheDocument();
    });

    it('renders Sanity Portable Text lists and links', () => {
      const portableTextWithListAndLink = [
        {
          _type: 'block',
          _key: 'l1',
          listItem: 'bullet',
          children: [{ _type: 'span', text: 'Canadian Red Lentils', marks: [] }],
        },
        {
          _type: 'block',
          _key: 'l2',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              text: 'Explore Specifications',
              marks: ['link-key-1'],
            },
          ],
          markDefs: [
            {
              _key: 'link-key-1',
              _type: 'link',
              href: 'https://agroventia.com/products',
            },
          ],
        },
      ];

      render(<RichTextRenderer content={portableTextWithListAndLink} />);

      expect(screen.getByText('Canadian Red Lentils')).toBeInTheDocument();
      const link = screen.getByRole('link', { name: 'Explore Specifications' });
      expect(link).toHaveAttribute('href', 'https://agroventia.com/products');
    });

    it('renders localized content objects by selecting the specified locale', () => {
      const localizedContent = {
        en: '<p>English trade briefing and market updates.</p>',
        fr: '<p>Analyse commerciale et perspectives en français canadien.</p>',
        esp: '<p>Perspectivas del mercado y comercio agrícola en español.</p>',
      };

      const { rerender } = render(
        <RichTextRenderer content={localizedContent} locale="en" />
      );
      expect(screen.getByText(/English trade briefing/i)).toBeInTheDocument();

      rerender(<RichTextRenderer content={localizedContent} locale="fr" />);
      expect(screen.getByText(/Analyse commerciale et perspectives/i)).toBeInTheDocument();

      rerender(<RichTextRenderer content={localizedContent} locale="esp" />);
      expect(screen.getByText(/Perspectivas del mercado y comercio agrícola/i)).toBeInTheDocument();
    });

    it('renders markdown and multiline text with headers, bullets, and paragraphs', () => {
      const markdownContent = `## Market Overview

AgroVentia connects North American growers with international distribution channels.

* High-protein red lentils
* Yellow peas grade 1

> Traceability guaranteed at every stage.`;

      render(<RichTextRenderer content={markdownContent} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Market Overview');
      expect(screen.getByText(/High-protein red lentils/i)).toBeInTheDocument();
      expect(screen.getByText(/Yellow peas grade 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Traceability guaranteed at every stage/i)).toBeInTheDocument();
    });

    it('renders HTML string content correctly', () => {
      const htmlContent = '<h2>Export Integrity</h2><p>Rigorous lot inspection certified.</p>';
      render(<RichTextRenderer content={htmlContent} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Export Integrity');
      expect(screen.getByText('Rigorous lot inspection certified.')).toBeInTheDocument();
    });

    it('preserves legacy Wix rich text node structure', () => {
      const wixRichContent = {
        nodes: [
          {
            type: 'HEADING',
            headingData: { level: 3 },
            nodes: [{ type: 'TEXT', textData: { text: 'Wix Architecture Legacy Node' } }],
          },
          {
            type: 'PARAGRAPH',
            nodes: [{ type: 'TEXT', textData: { text: 'Legacy content displays without regressions.' } }],
          },
        ],
      };

      render(<RichTextRenderer content={wixRichContent} />);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Wix Architecture Legacy Node');
      expect(screen.getByText('Legacy content displays without regressions.')).toBeInTheDocument();
    });

    it('handles empty, null, or undefined content gracefully without crashing', () => {
      const { container: emptyContainer } = render(<RichTextRenderer content="" />);
      expect(emptyContainer.firstChild).toBeNull();

      const { container: nullContainer } = render(<RichTextRenderer content={null as any} />);
      expect(nullContainer.firstChild).toBeNull();

      const { container: undefinedContainer } = render(<RichTextRenderer content={undefined as any} />);
      expect(undefinedContainer.firstChild).toBeNull();
    });
  });

  describe('transformBlogPost', () => {
    it('unwraps localized title, excerpt, and content across English, French, and Spanish', () => {
      const rawDoc = {
        _id: 'post-123',
        _createdAt: '2026-01-01T00:00:00Z',
        _updatedAt: '2026-01-02T00:00:00Z',
        slug: { current: 'sustainable-ag-trade' },
        title: {
          en: 'Sustainable Agricultural Trade',
          fr: 'Commerce agricole durable',
          esp: 'Comercio agrícola sostenible',
        },
        excerpt: {
          en: 'Global trade insights for commodity buyers.',
          fr: "Perspectives du commerce mondial pour les acheteurs de commodités.",
          esp: 'Perspectivas del comercio global para compradores de materias primas.',
        },
        content: {
          en: '<p>English body content.</p>',
          fr: '<p>Contenu principal en français.</p>',
          esp: '<p>Contenido principal en español.</p>',
        },
        coverImage: {
          asset: {
            url: 'https://cdn.sanity.io/images/proj/prod/trade.jpg',
          },
        },
        publishedDate: '2026-01-01T12:00:00Z',
        author: {
          name: 'AgroVentia Trade Desk',
        },
        categories: [
          {
            _id: 'cat-pulses',
            title: {
              en: 'Pulses & Legumes',
              fr: 'Légumineuses',
              esp: 'Legumbres',
            },
          },
        ],
      };

      const enPost = transformBlogPost(rawDoc, 'en');
      expect(enPost.title).toBe('Sustainable Agricultural Trade');
      expect(enPost.excerpt).toBe('Global trade insights for commodity buyers.');
      expect(enPost.content).toBe('<p>English body content.</p>');
      expect(enPost.categories?.[0]).toEqual(
        expect.objectContaining({ title: 'Pulses & Legumes' })
      );

      const frPost = transformBlogPost(rawDoc, 'fr');
      expect(frPost.title).toBe('Commerce agricole durable');
      expect(frPost.excerpt).toBe("Perspectives du commerce mondial pour les acheteurs de commodités.");
      expect(frPost.content).toBe('<p>Contenu principal en français.</p>');
      expect(frPost.categories?.[0]).toEqual(
        expect.objectContaining({ title: 'Légumineuses' })
      );

      const esPost = transformBlogPost(rawDoc, 'esp');
      expect(esPost.title).toBe('Comercio agrícola sostenible');
      expect(esPost.excerpt).toBe('Perspectivas del comercio global para compradores de materias primas.');
      expect(esPost.content).toBe('<p>Contenido principal en español.</p>');
      expect(esPost.categories?.[0]).toEqual(
        expect.objectContaining({ title: 'Legumbres' })
      );
    });

    it('falls back to English when a specific language translation is missing', () => {
      const rawDoc = {
        _id: 'post-fallback',
        slug: 'fallback-slug',
        title: { en: 'Default English Title' },
        excerpt: { en: 'Default English Excerpt' },
        content: { en: 'Default English Content' },
      };

      const frPost = transformBlogPost(rawDoc, 'fr');
      expect(frPost.title).toBe('Default English Title');
      expect(frPost.excerpt).toBe('Default English Excerpt');
      expect(frPost.content).toBe('Default English Content');
    });

    it('preserves Portable Text block arrays when content is already an array', () => {
      const blocks = [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Block text from Sanity' }],
        },
      ];

      const rawDoc = {
        _id: 'post-pt',
        slug: 'pt-slug',
        title: 'Plain Title String',
        excerpt: 'Plain Excerpt String',
        content: blocks,
      };

      const post = transformBlogPost(rawDoc, 'en');
      expect(post.title).toBe('Plain Title String');
      expect(post.content).toEqual(blocks);
    });
  });
});
