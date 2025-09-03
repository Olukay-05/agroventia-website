'use client';

import React from 'react';
import Footer from '@/components/sections/Footer';

export default function FooterPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-agro-neutral-25 to-agro-neutral-50">
      {/* Mock content to show footer in context */}
      <div className="container-premium py-20">
        <div className="text-center space-y-6">
          <h1 className="heading-section">AgroVentia Footer Preview</h1>
          <p className="text-lead max-w-2xl mx-auto">
            This preview showcases the improved footer component with better
            brand colors, enhanced contrast for readability, and interactive
            elements including hover effects, social media links, and newsletter
            signup functionality.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="card-feature">
              <h3 className="heading-card">Improved Contrast</h3>
              <p className="text-body">
                Footer now uses proper color combinations with WCAG-compliant
                contrast ratios for better readability and accessibility.
              </p>
            </div>

            <div className="card-feature">
              <h3 className="heading-card">Interactive Elements</h3>
              <p className="text-body">
                Added hover effects, animated social media buttons, newsletter
                signup with validation, and smooth scroll-to-top functionality.
              </p>
            </div>

            <div className="card-feature">
              <h3 className="heading-card">Brand Colors</h3>
              <p className="text-body">
                Utilizes the AgroVentia brand color palette with gradients and
                proper color hierarchy for visual appeal and brand consistency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mock sections to provide context */}
      <div id="hero" className="py-20 bg-agro-primary-50">
        <div className="container-premium text-center">
          <h2 className="heading-subsection">Hero Section</h2>
          <p className="text-body">Mock hero content for navigation testing</p>
        </div>
      </div>

      <div id="about" className="py-20 bg-agro-neutral-50">
        <div className="container-premium text-center">
          <h2 className="heading-subsection">About Section</h2>
          <p className="text-body">Mock about content for navigation testing</p>
        </div>
      </div>

      <div id="services" className="py-20 bg-agro-secondary-50">
        <div className="container-premium text-center">
          <h2 className="heading-subsection">Services Section</h2>
          <p className="text-body">
            Mock services content for navigation testing
          </p>
        </div>
      </div>

      <div id="products" className="py-20 bg-agro-primary-50">
        <div className="container-premium text-center">
          <h2 className="heading-subsection">Products Section</h2>
          <p className="text-body">
            Mock products content for navigation testing
          </p>
        </div>
      </div>

      <div id="contact" className="py-20 bg-agro-neutral-50">
        <div className="container-premium text-center">
          <h2 className="heading-subsection">Contact Section</h2>
          <p className="text-body">
            Mock contact content for navigation testing
          </p>
        </div>
      </div>

      {/* The improved footer */}
      <Footer />
    </div>
  );
}
