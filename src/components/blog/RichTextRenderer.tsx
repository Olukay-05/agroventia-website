'use client';

import React from 'react';
import { PortableText, type PortableTextComponents } from 'next-sanity';
import { resolveSanityImageUrl } from '@/lib/api/sanity-client';

interface RichTextNode {
  type: string;
  id?: string;
  nodes?: RichTextNode[];
  textData?: {
    text: string;
    decorations?: Array<{ type: string; fontWeightValue?: number }>;
  };
  paragraphData?: {
    textStyle?: { textAlignment?: string };
  };
  headingData?: {
    level?: number;
    textStyle?: { textAlignment?: string };
  };
  [key: string]: any;
}

interface RichContent {
  nodes?: RichTextNode[];
  [key: string]: any;
}

export interface RichTextRendererProps {
  content: RichContent | string | any[] | Record<string, any> | null | undefined;
  locale?: string;
  className?: string;
}

/**
 * Custom styling components for Portable Text blocks, lists, marks, and media.
 */
const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 leading-relaxed text-agro-neutral-700 text-base md:text-lg">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="font-heading font-bold text-3xl md:text-4xl text-[#281909] mt-10 mb-6 scroll-mt-24">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#281909] mt-10 mb-5 scroll-mt-24">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading font-bold text-xl md:text-2xl text-[#281909] mt-8 mb-4 scroll-mt-24">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-heading font-semibold text-lg md:text-xl text-[#281909] mt-6 mb-3">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-agro-primary-500 pl-6 italic text-agro-neutral-600 bg-white/40 py-4 pr-4 rounded-r-lg my-8">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-agro-neutral-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-agro-neutral-700">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="pl-1 leading-relaxed marker:text-agro-primary-500">{children}</li>
    ),
    number: ({ children }) => (
      <li className="pl-1 leading-relaxed marker:text-agro-primary-500">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-[#281909]">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <u className="underline decoration-agro-primary-400 underline-offset-4">{children}</u>
    ),
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded bg-agro-primary-50 text-agro-primary-800 font-mono text-sm border border-agro-primary-100">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = value?.href || '';
      const isExternal = href.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-agro-primary-700 font-semibold border-b-2 border-agro-primary-300 hover:bg-agro-primary-50 hover:text-agro-primary-800 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const imgUrl = resolveSanityImageUrl(value);
      if (!imgUrl) return null;
      return (
        <figure className="my-8 rounded-2xl overflow-hidden shadow-lg border border-agro-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={value.alt || 'Blog illustration'}
            className="w-full object-cover max-h-[500px]"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-agro-neutral-500 py-2.5 bg-agro-neutral-50 border-t border-agro-neutral-100">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

/**
 * Parses inline formatting for markdown strings (**bold**, *italic*, [link](url), `code`).
 */
function renderInlineFormatting(text: string): React.ReactNode {
  if (!text) return null;

  // Pattern matches [label](url), **bold**, *italic*, `code`
  const tokenRegex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Link: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isExternal = href.startsWith('http');
      return (
        <a
          key={index}
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-agro-primary-700 font-semibold border-b-2 border-agro-primary-300 hover:bg-agro-primary-50 hover:text-agro-primary-800 transition-colors"
        >
          {label}
        </a>
      );
    }

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-[#281909]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-agro-primary-50 text-agro-primary-800 font-mono text-sm border border-agro-primary-100"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

/**
 * Parses markdown / multiline text blocks into React semantic elements.
 */
function renderMarkdownString(markdown: string): React.ReactNode {
  const blocks = markdown
    .trim()
    .split(/\n\s*\n+/)
    .map(b => b.trim())
    .filter(Boolean);

  return blocks.map((block, bIdx) => {
    // Heading 1: # Heading
    if (block.startsWith('# ')) {
      return (
        <h1 key={bIdx} className="font-heading font-bold text-3xl md:text-4xl text-[#281909] mt-10 mb-6">
          {renderInlineFormatting(block.slice(2))}
        </h1>
      );
    }

    // Heading 2: ## Heading
    if (block.startsWith('## ')) {
      return (
        <h2 key={bIdx} className="font-heading font-bold text-2xl md:text-3xl text-[#281909] mt-10 mb-5">
          {renderInlineFormatting(block.slice(3))}
        </h2>
      );
    }

    // Heading 3: ### Heading
    if (block.startsWith('### ')) {
      return (
        <h3 key={bIdx} className="font-heading font-bold text-xl md:text-2xl text-[#281909] mt-8 mb-4">
          {renderInlineFormatting(block.slice(4))}
        </h3>
      );
    }

    // Blockquote: > Quote
    if (block.startsWith('>')) {
      const quoteText = block.replace(/^>\s*/gm, '').trim();
      return (
        <blockquote
          key={bIdx}
          className="border-l-4 border-agro-primary-500 pl-6 italic text-agro-neutral-600 bg-white/40 py-4 pr-4 rounded-r-lg my-8"
        >
          {renderInlineFormatting(quoteText)}
        </blockquote>
      );
    }

    // Bullet List: lines starting with *, -, or •
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const isBulletList = lines.length > 0 && lines.every(l => /^[*•-]\s+/.test(l));
    if (isBulletList) {
      return (
        <ul key={bIdx} className="list-disc pl-6 mb-6 space-y-2 text-agro-neutral-700">
          {lines.map((line, lIdx) => (
            <li key={lIdx} className="pl-1 leading-relaxed marker:text-agro-primary-500">
              {renderInlineFormatting(line.replace(/^[*•-]\s+/, ''))}
            </li>
          ))}
        </ul>
      );
    }

    // Numbered List: lines starting with 1. , 2. , etc.
    const isNumberedList = lines.length > 0 && lines.every(l => /^\d+\.\s+/.test(l));
    if (isNumberedList) {
      return (
        <ol key={bIdx} className="list-decimal pl-6 mb-6 space-y-2 text-agro-neutral-700">
          {lines.map((line, lIdx) => (
            <li key={lIdx} className="pl-1 leading-relaxed marker:text-agro-primary-500">
              {renderInlineFormatting(line.replace(/^\d+\.\s+/, ''))}
            </li>
          ))}
        </ol>
      );
    }

    // Regular paragraph
    return (
      <p key={bIdx} className="mb-6 leading-relaxed text-agro-neutral-700 text-base md:text-lg">
        {renderInlineFormatting(block)}
      </p>
    );
  });
}

/**
 * Legacy Wix rich-text node renderer.
 */
function renderWixNode(node: RichTextNode, index: number): React.ReactNode {
  switch (node.type) {
    case 'HEADING': {
      const level = node.headingData?.level || 2;
      const Tag = `h${level}` as React.ElementType;
      return (
        <Tag key={node.id || index} className="font-bold text-[#281909] mt-8 mb-4">
          {node.nodes?.map((child, i) => renderWixNode(child, i))}
        </Tag>
      );
    }

    case 'PARAGRAPH':
      return (
        <p key={node.id || index} className="mb-4 leading-relaxed text-agro-neutral-700">
          {node.nodes?.map((child, i) => renderWixNode(child, i))}
        </p>
      );

    case 'TEXT': {
      let textCheck = node.textData?.text || '';
      if (node.textData?.decorations) {
        node.textData.decorations.forEach(dec => {
          if (dec.type === 'BOLD') {
            textCheck = `<strong>${textCheck}</strong>`;
          } else if (dec.type === 'ITALIC') {
            textCheck = `<em>${textCheck}</em>`;
          } else if (dec.type === 'UNDERLINE') {
            textCheck = `<u>${textCheck}</u>`;
          }
        });
        return <span key={index} dangerouslySetInnerHTML={{ __html: textCheck }} />;
      }
      return <span key={index}>{textCheck}</span>;
    }

    case 'BULLETED_LIST':
      return (
        <ul key={node.id || index} className="list-disc pl-6 mb-6 space-y-2">
          {node.nodes?.map((child, i) => renderWixNode(child, i))}
        </ul>
      );

    case 'ORDERED_LIST':
      return (
        <ol key={node.id || index} className="list-decimal pl-6 mb-6 space-y-2">
          {node.nodes?.map((child, i) => renderWixNode(child, i))}
        </ol>
      );

    case 'LIST_ITEM':
      return (
        <li key={node.id || index}>
          {node.nodes?.map((child, i) => renderWixNode(child, i))}
        </li>
      );

    default:
      return null;
  }
}

/**
 * Primary rich text rendering component supporting:
 * - Sanity Portable Text block arrays (via next-sanity)
 * - Localized content objects ({ en, fr, esp })
 * - Markdown and formatted multiline strings
 * - HTML strings
 * - Legacy Wix RichContent node trees
 */
const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  locale = 'en',
  className = '',
}) => {
  if (content === null || content === undefined || content === '') {
    return null;
  }

  // 1. Localized container object: { en: ..., fr: ..., esp: ... }
  if (
    typeof content === 'object' &&
    !Array.isArray(content) &&
    !content.nodes &&
    !content._type
  ) {
    const loc = (locale || 'en').toLowerCase().trim();
    const isFr = loc.startsWith('fr');
    const isEs = loc.startsWith('es') || loc === 'esp';
    const targetKey = isFr ? 'fr' : isEs ? (content.esp ? 'esp' : 'es') : 'en';

    const pickNonEmpty = (val: any) => {
      if (val === null || val === undefined) return null;
      if (typeof val === 'string' && val.trim().length === 0) return null;
      return val;
    };

    const activeLocalized =
      pickNonEmpty(content[targetKey]) ??
      pickNonEmpty(content[loc]) ??
      pickNonEmpty(content.en) ??
      pickNonEmpty(content.fr) ??
      pickNonEmpty(content.esp) ??
      pickNonEmpty(content.es) ??
      Object.values(content).find(v => pickNonEmpty(v) !== null);

    if (!activeLocalized) return null;
    return <RichTextRenderer content={activeLocalized} locale={locale} className={className} />;
  }

  // 2. Sanity Portable Text (array of blocks)
  if (Array.isArray(content)) {
    if (content.length === 0) return null;
    return (
      <div className={`rich-text-content ${className}`.trim()}>
        <PortableText value={content} components={portableTextComponents} />
      </div>
    );
  }

  // 3. String content (HTML, Markdown, or plain text)
  if (typeof content === 'string') {
    const trimmed = content.trim();
    if (!trimmed) return null;

    // Check if content contains HTML tags
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(trimmed);
    if (hasHtmlTags) {
      return (
        <div
          className={`rich-text-content space-y-4 ${className}`.trim()}
          dangerouslySetInnerHTML={{ __html: trimmed }}
        />
      );
    }

    // Markdown or plain text
    return (
      <div className={`rich-text-content ${className}`.trim()}>
        {renderMarkdownString(trimmed)}
      </div>
    );
  }

  // 4. Legacy Wix RichContent ({ nodes: [...] })
  if (typeof content === 'object' && Array.isArray(content.nodes)) {
    if (content.nodes.length === 0) return null;
    return (
      <div className={`rich-text-content ${className}`.trim()}>
        {content.nodes.map((node: RichTextNode, i: number) => renderWixNode(node, i))}
      </div>
    );
  }

  return null;
};

export default RichTextRenderer;
