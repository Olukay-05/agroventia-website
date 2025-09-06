'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import FooterSocialLinks from './FooterSocialLinks';
import FooterNewsletter from './FooterNewsletter';
import FooterLinkSection from './FooterLinkSection';
import Image from 'next/image';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import {
  ContactContent,
  ProductContent,
  ServiceContent,
} from '@/services/wix-data.service';

const Footer: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  // Ensure consistent year between server and client
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const [contactData, setContactData] = useState<ContactContent | null>(null);
  const [servicesData, setServicesData] = useState<ServiceContent[]>([]);
  const [productsData, setProductsData] = useState<ProductContent[]>([]);

  // Fetch contact data from Wix CMS
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all collections in parallel
        const [contactResponse, servicesResponse, productsResponse] =
          await Promise.all([
            fetch('/api/collections/ContactContent'),
            fetch('/api/collections/ServicesContent'),
            fetch('/api/collections/Import2'), // Using Import2 for products
          ]);

        // Process contact data
        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          if (contactData.items && contactData.items.length > 0) {
            setContactData(contactData.items[0].data);
          }
        }

        // Process services data
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          if (servicesData.items && servicesData.items.length > 0) {
            setServicesData(
              servicesData.items.map(
                (item: { data: ServiceContent }) => item.data
              )
            );
          }
        }

        // Process products data (for categories)
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          if (productsData.items && productsData.items.length > 0) {
            setProductsData(
              productsData.items.map(
                (item: { data: ProductContent }) => item.data
              )
            );
          }
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchAllData();
  }, []);

  // Default fallback data
  const defaultContactData = {
    address: '403 - 65 Mutual Street, Toronto, M5B 0E5',
    phone: '+1 (403) 477-6059',
    email: 'info@agroventia.ca',
    workingHours:
      'Monday - Friday: 8:00 AM - 6:00 PM EST Saturday: 9:00 AM - 2:00 PM EST Sunday: Closed',
  };

  // Use fetched data or fallback to defaults
  const contactInfo = contactData
    ? {
        address: contactData.businessAddress || defaultContactData.address,
        phone: contactData.businessPhone || defaultContactData.phone,
        email: contactData.businessEmail || defaultContactData.email,
        workingHours:
          contactData.businessHours || defaultContactData.workingHours,
      }
    : defaultContactData;

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigationLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#services' },
    { label: 'Products', href: '#products' },
    { label: 'Contact', href: '#contact' },
  ];

  const serviceLinks =
    servicesData.length > 0
      ? servicesData
          .slice(0, 5)
          .map(service => service.title || 'Agricultural Service')
      : [
          'Sourcing with Integrity',
          'Rigorous Quality Checks',
          'Seamless Logistics',
          'On-Time Delivery',
          'Long-Term Partnerships',
        ];

  const productCategories =
    productsData.length > 0
      ? [
          ...new Set(
            productsData.map(
              product =>
                product.category ||
                (product as unknown as { productCategory?: string })
                  .productCategory ||
                'Agricultural Products'
            )
          ),
        ].slice(0, 5)
      : [
          'Farm Equipment',
          'Crop Protection',
          'Fertilizers & Nutrients',
          'Seeds & Planting',
          'Irrigation Systems',
        ];

  const handleServiceClick = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    link: string | { label: string; href?: string }
  ) => {
    // Handle service link click - could navigate to service page
  };

  const handleProductClick = (
    link: string | { label: string; href?: string }
  ) => {
    const categoryName = typeof link === 'string' ? link : link.label;

    // Set the category filter in sessionStorage
    sessionStorage.setItem(
      'selectedProductCategory',
      categoryName.toLowerCase()
    );

    // Navigate to the products section
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });

      // Dispatch a custom event to notify the ProductsSection to update its filter
      window.dispatchEvent(
        new CustomEvent('productCategorySelected', {
          detail: { category: categoryName.toLowerCase() },
        })
      );
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#281909]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#225217]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-premium" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#CD7E0D]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse-premium" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#225217]/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Main Footer Content */}
      {/* <div className="container-premium py-16 relative z-10"> */}
      <div className="container-premium py-16 relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/agroventia-logo%201.svg"
                  alt="AgroVentia Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#FDF8F0]">
                  AgroVentia Inc.
                </h3>
                <p className="text-sm text-[#F6F2E7] font-medium">
                  Agricultural Solutions
                </p>
              </div>
            </div>

            <p className="text-[#F6F2E7] leading-relaxed">
              Trusted agricultural export partner delivering premium products to
              global markets with consistency, transparency, and on-time
              delivery.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm text-[#F6F2E7] group hover:text-[#FDF8F0] transition-colors duration-200">
                <MapPin
                  size={16}
                  className="text-[#FDF8F0] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200"
                />
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-[#F6F2E7] group hover:text-[#FDF8F0] transition-colors duration-200">
                <Phone
                  size={16}
                  className="text-[#FDF8F0] flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-[#F6F2E7] group hover:text-[#FDF8F0] transition-colors duration-200">
                <Mail
                  size={16}
                  className="text-[#FDF8F0] flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                />
                <span>{contactInfo.email}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4">
              <p className="text-sm text-[#F6F2E7] mb-3">Follow Us</p>
              <FooterSocialLinks />
            </div>
          </div>

          {/* Quick Links */}
          <FooterLinkSection
            title="Quick Links"
            links={navigationLinks}
            onLinkClick={link => {
              if (typeof link === 'object' && link.href) {
                handleNavClick(link.href);
              }
            }}
          />

          {/* Services */}
          <FooterLinkSection
            title="Our Process"
            links={serviceLinks}
            onLinkClick={handleServiceClick}
          />

          {/* Products */}
          <FooterLinkSection
            title="Product Categories"
            links={productCategories}
            onLinkClick={handleProductClick}
          />
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <FooterNewsletter />
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-[#F6F2E7]/50 to-transparent" />

      {/* Bottom Footer */}
      <div className="container-premium py-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-[#F6F2E7]">
            <p>&copy; {currentYear} AgroVentia Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <button
                onClick={() => (window.location.href = '/privacy-policy')}
                className="hover:text-[#FDF8F0] transition-colors duration-200 hover:underline underline-offset-4"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => (window.location.href = '/terms-of-service')}
                className="hover:text-[#FDF8F0] transition-colors duration-200 hover:underline underline-offset-4"
              >
                Terms of Service
              </button>
              <button
                onClick={() => (window.location.href = '/cookie-policy')}
                className="hover:text-[#FDF8F0] transition-colors duration-200 hover:underline underline-offset-4"
              >
                Cookie Policy
              </button>
            </div>
          </div>

          {/* Language Selector and Back to Top */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <LanguageSelector className="w-[160px] sm:w-[180px]" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="
                bg-[#FDF8F0] backdrop-blur-sm
                border-2 border-[#281909] text-[#281909]
                hover:bg-[#225217] hover:text-[#FDF8F0]
                hover:border-[#225217] hover:scale-105
                transition-all duration-300 ease-out
                group
              "
            >
              <ArrowUp
                size={16}
                className="text-[#281909] group-hover:text-[#FDF8F0] transition-colors duration-200 mr-1"
              />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
