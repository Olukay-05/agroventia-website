
import React from 'react';

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
    nodes: RichTextNode[];
}

interface RichTextRendererProps {
    content: RichContent | string;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content }) => {
    // Handle case where content might be a simple string (legacy/imported HTML)
    if (typeof content === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    if (!content || !content.nodes) {
        return null;
    }

    const renderNode = (node: RichTextNode, index: number): React.ReactNode => {
        switch (node.type) {
            case 'HEADING':
                const level = node.headingData?.level || 2;
                const Tag = `h${level}` as React.ElementType;
                return (
                    <Tag key={node.id || index} className="font-bold text-[#281909] mt-8 mb-4">
                        {node.nodes?.map((child, i) => renderNode(child, i))}
                    </Tag>
                );

            case 'PARAGRAPH':
                return (
                    <p key={node.id || index} className="mb-4 leading-relaxed text-agro-neutral-700">
                        {node.nodes?.map((child, i) => renderNode(child, i))}
                    </p>
                );

            case 'TEXT':
                let textCheck = node.textData?.text || '';
                if (node.textData?.decorations) {
                    node.textData.decorations.forEach((dec) => {
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

            case 'BULLETED_LIST':
                return (
                    <ul key={node.id || index} className="list-disc pl-6 mb-6 space-y-2">
                        {node.nodes?.map((child, i) => renderNode(child, i))}
                    </ul>
                );

            case 'ORDERED_LIST':
                return (
                    <ol key={node.id || index} className="list-decimal pl-6 mb-6 space-y-2">
                        {node.nodes?.map((child, i) => renderNode(child, i))}
                    </ol>
                );

            case 'LIST_ITEM':
                return (
                    <li key={node.id || index}>
                        {node.nodes?.map((child, i) => renderNode(child, i))}
                    </li>
                );

            default:
                console.warn('Unknown node type:', node.type);
                return null;
        }
    };

    return <div className="rich-text-content">{content.nodes.map((node, i) => renderNode(node, i))}</div>;
};

export default RichTextRenderer;
