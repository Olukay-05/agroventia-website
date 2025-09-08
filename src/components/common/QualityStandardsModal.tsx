'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useScrollToSection from '@/hooks/useScrollToSection';

interface QualityStandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  qualityStandards: string;
  onRequestQuote?: (productName: string) => void; // Add onRequestQuote prop
}

// Simple HTML sanitizer to prevent XSS attacks
const sanitizeHtml = (html: string): string => {
  // Remove script tags and their content
  html = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  );

  // Remove iframe tags
  html = html.replace(
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    ''
  );

  // Remove object tags
  html = html.replace(
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    ''
  );

  // Remove embed tags
  html = html.replace(/<embed\b[^>]*>/gi, '');

  // Remove on* event attributes (more comprehensive)
  html = html.replace(/on\w+="[^"]*"/gi, '');
  html = html.replace(/on\w+='[^']*'/gi, '');
  html = html.replace(/on\w+=[^\s>]+/gi, '');

  // Remove javascript: links
  html = html.replace(/href=["']javascript:[^"']*["']/gi, '');
  html = html.replace(/src=["']javascript:[^"']*["']/gi, '');

  // Remove data: URLs
  html = html.replace(/src=["']data:[^"']*["']/gi, '');

  // Allow only safe HTML tags
  const allowedTags = [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'ol',
    'ul',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'div',
    'span',
  ];
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  html = html.replace(tagRegex, (match, tagName) => {
    return allowedTags.includes(tagName.toLowerCase()) ? match : '';
  });

  return html;
};

const QualityStandardsModal: React.FC<QualityStandardsModalProps> = ({
  isOpen,
  onClose,
  productName,
  qualityStandards,
  onRequestQuote, // Destructure the new prop
}) => {
  const { scrollToSection } = useScrollToSection();

  // Function to safely render HTML content
  const renderHtmlContent = (htmlContent: string) => {
    // Sanitize the HTML content to prevent XSS attacks
    const sanitizedContent = sanitizeHtml(htmlContent);

    return (
      <div
        className="prose max-w-none prose-headings:text-agro-primary-800 prose-p:text-gray-700 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4 prose-strong:font-semibold"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  };

  // Handle quote request button click
  const handleRequestQuote = () => {
    onClose(); // Close the modal first
    // If onRequestQuote callback is provided, use it
    if (onRequestQuote) {
      onRequestQuote(productName);
    } else {
      // Default behavior: scroll to contact section
      scrollToSection('contact', 100);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" lg:max-w-3xl rounded-lg max-h-[80vh] overflow-y-auto bg-[#FDF8F0] text-[#281909] backdrop-blur-lg border border-white/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#281909]">
            {productName}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {qualityStandards ? (
            renderHtmlContent(qualityStandards)
          ) : (
            <p className="text-gray-500 italic">
              No quality standards information available for this product.
            </p>
          )}
        </div>
        {/* Request Quote Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleRequestQuote}
            className="btn-agro-primary flex items-center"
          >
            Request Quote
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QualityStandardsModal;
