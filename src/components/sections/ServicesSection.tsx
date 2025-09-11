'use client';

import React, { useState } from 'react';
import {
  Handshake,
  Truck,
  ShieldCheck,
  Package,
  Globe,
  FileText,
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ServiceFeatureCard from '@/components/ui/ServiceFeatureCard';
import { ServiceContent } from '@/types/wix';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Interface for Wix services data structure
interface WixServicesData {
  customSourcing?: string;
  documentation?: string;
  importServices?: string;
  isActive?: boolean;
  logistics?: string;
  qualityAssurance?: string;
  sectionDescription?: string;
  sectionTitle?: string;
  servicesImage?: string;
  [key: string]: unknown;
}

interface ServicesSectionProps {
  data?: ServiceItem[] | WixServicesData | WixServicesData[] | ServiceContent;
  isLoading: boolean;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  data,
  isLoading,
}) => {
  const [activeService, setActiveService] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'consulting':
        return <Handshake size={32} />;
      case 'supply-chain':
        return <Truck size={32} />;
      case 'quality':
        return <ShieldCheck size={32} />;
      case 'packaging':
        return <Package size={32} />;
      case 'global':
        return <Globe size={32} />;
      case 'documentation':
        return <FileText size={32} />;
      case 'sourcing': // Added missing case for sourcing icon
        return <Handshake size={32} />;
      case 'logistics': // Added missing case for logistics icon
        return <Truck size={32} />;
      case 'delivery': // Added missing case for delivery icon
        return <Truck size={32} />;
      case 'partnership': // Added missing case for partnership icon
        return <Handshake size={32} />;
      default:
        return <Handshake size={32} />;
    }
  };

  const defaultServices = [
    {
      id: 'process-1',
      title: 'Sourcing with Integrity',
      description:
        'We identify Africa’s finest agricultural producers, prioritizing ethical practices and sustainable farming.',
      icon: 'sourcing',
    },
    {
      id: 'process-2',
      title: 'Rigorous Quality Checks',
      description:
        'Every product is carefully inspected and verified to meet international standards before export.',
      icon: 'quality',
    },
    {
      id: 'process-3',
      title: 'Seamless Logistics',
      description:
        'Our experienced team manages the entire supply chain, ensuring efficiency and transparency.',
      icon: 'logistics',
    },
    {
      id: 'process-4',
      title: 'On-Time Delivery',
      description:
        'We deliver as promised — shipments arrive on schedule so you can focus on growing your business.',
      icon: 'delivery',
    },
    {
      id: 'process-5',
      title: 'Long-Term Partnerships',
      description:
        'More than a supplier, we’re committed to building lasting relationships based on trust and value.',
      icon: 'partnership',
    },
  ];

  if (isLoading) {
    return (
      <section
        id="services"
        className="py-16 md:py-20 lg:py-32 overflow-hidden"
      >
        <div className="container-premium">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Loading services..." />
          </div>
        </div>
      </section>
    );
  }

  // Transform Wix data structure to component format
  const transformWixData = (wixData: WixServicesData): ServiceItem[] => {
    const services: ServiceItem[] = [];

    // Map Wix fields to our service items
    if (wixData.importServices) {
      services.push({
        id: 'import-services',
        title: 'Sourcing with Integrity', // Updated title to match the content
        description: wixData.importServices.replace(/<[^>]*>/g, ''), // Strip HTML tags
        icon: 'sourcing',
      });
    }

    if (wixData.customSourcing) {
      services.push({
        id: 'custom-sourcing',
        title: 'On-Time Delivery', // Updated title to match the content
        description: wixData.customSourcing,
        icon: 'delivery',
      });
    }

    if (wixData.qualityAssurance) {
      services.push({
        id: 'quality-assurance',
        title: 'Rigorous Quality Checks', // Updated title to match the content
        description: wixData.qualityAssurance,
        icon: 'quality',
      });
    }

    if (wixData.logistics) {
      services.push({
        id: 'logistics',
        title: 'Seamless Logistics', // Updated title to match the content
        description: wixData.logistics,
        icon: 'logistics',
      });
    }

    if (wixData.documentation) {
      services.push({
        id: 'documentation',
        title: 'Long-Term Partnerships', // Updated title to match the content
        description: wixData.documentation,
        icon: 'partnership',
      });
    }

    return services;
  };

  let services: ServiceItem[];

  // Handle different data formats
  let servicesDataObject: WixServicesData | null = null;

  if (Array.isArray(data)) {
    // Check if it's an array of ServiceItem or WixServicesData
    if (data.length > 0 && 'id' in data[0] && 'title' in data[0]) {
      // It's already in the correct ServiceItem format
      services = data as ServiceItem[];
    } else {
      // It's an array of WixServicesData, transform the first one
      services =
        data.length > 0
          ? transformWixData(data[0] as WixServicesData)
          : defaultServices;
    }
  } else if (data && typeof data === 'object') {
    // Check if this is a ServiceContent object (which extends WixBase)
    if ('sectionTitle' in data && 'importServices' in data) {
      // It's a ServiceContent object, cast it to WixServicesData
      servicesDataObject = data as unknown as WixServicesData;
    }
    // Special handling for services data - check if it has servicesImage directly
    else if ('servicesImage' in data) {
      servicesDataObject = data as WixServicesData;
    }
    // Check if this is the direct WixServicesData object
    else if (
      'sectionTitle' in data ||
      'sectionDescription' in data ||
      'importServices' in data
    ) {
      servicesDataObject = data as WixServicesData;
    }
    // Check if this is a TransformedResponse with items array
    else if (
      'items' in data &&
      Array.isArray((data as unknown as { items: unknown[] }).items)
    ) {
      const items = (
        data as unknown as { items: Array<{ data?: WixServicesData }> }
      ).items;
      if (items.length > 0 && items[0].data) {
        servicesDataObject = items[0].data as WixServicesData;
      }
    }
    // Check if this is an object with a services property containing the data
    else if ('services' in data) {
      const servicesProp = (data as unknown as { services: unknown }).services;
      if (servicesProp && typeof servicesProp === 'object') {
        if (
          'items' in servicesProp &&
          Array.isArray((servicesProp as { items: unknown[] }).items)
        ) {
          const items = (
            servicesProp as { items: Array<{ data?: WixServicesData }> }
          ).items;
          if (items.length > 0 && items[0].data) {
            servicesDataObject = items[0].data as WixServicesData;
          }
        } else if (
          'sectionTitle' in servicesProp ||
          'sectionDescription' in servicesProp
        ) {
          servicesDataObject = servicesProp as WixServicesData;
        }
      }
    }

    // If we found a servicesDataObject, use it
    if (servicesDataObject) {
      services = transformWixData(servicesDataObject);
    } else {
      // Single WixServicesData object
      services = transformWixData(data as WixServicesData);
    }
  } else {
    // No data provided, use defaults
    services = defaultServices;
  }

  return (
    // <section
    //   id="services"
    //   className="py-16 md:py-20 lg:py-32 overflow-hidden relative"
    // >
    //   <div className="container-premium">
    //     <div className="text-center mb-16 scroll-reveal">
    //       <h2 className="heading-section text-[#281909] mb-4">
    //         {Array.isArray(data) && data.length > 0 && 'sectionTitle' in data[0]
    //           ? (data[0] as WixServicesData).sectionTitle
    //           : 'Our Process'}
    //       </h2>
    //       <p className="text-lead max-w-3xl mx-auto text-[#281909]">
    //         {Array.isArray(data) &&
    //         data.length > 0 &&
    //         'sectionDescription' in data[0]
    //           ? (data[0] as WixServicesData).sectionDescription
    //           : 'Comprehensive agricultural import services connecting West African producers with global markets through reliable supply chain management.'}
    //       </p>
    //     </div>

    //     {/* Services Grid with triangle layout */}
    //     <div className="mb-8 md:mb-12">
    //       {/* First row - 3 cards on large screens */}
    //       <div className="hidden lg:grid lg:grid-cols-3 gap-6 mb-6">
    //         {services.slice(0, 3).map(service => (
    //           <ServiceFeatureCard
    //             key={service.id}
    //             title={service.title}
    //             description={service.description}
    //             icon={getIcon(service.icon)}
    //             isActive={activeService === service.id}
    //             onClick={() =>
    //               setActiveService(
    //                 service.id === activeService ? null : service.id
    //               )
    //             }
    //           />
    //         ))}
    //       </div>

    //       {/* Second row - 2 centered cards on large screens */}
    //       <div className="hidden lg:flex lg:justify-center">
    //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
    //           {services.slice(3, 5).map(service => (
    //             <ServiceFeatureCard
    //               key={service.id}
    //               title={service.title}
    //               description={service.description}
    //               icon={getIcon(service.icon)}
    //               isActive={activeService === service.id}
    //               onClick={() =>
    //                 setActiveService(
    //                   service.id === activeService ? null : service.id
    //                 )
    //               }
    //             />
    //           ))}
    //         </div>
    //       </div>

    //       {/* Tablet/mobile layout - responsive grid */}
    //       <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
    //         {services.map(service => (
    //           <ServiceFeatureCard
    //             key={service.id}
    //             title={service.title}
    //             description={service.description}
    //             icon={getIcon(service.icon)}
    //             isActive={activeService === service.id}
    //             onClick={() =>
    //               setActiveService(
    //                 service.id === activeService ? null : service.id
    //               )
    //             }
    //           />
    //         ))}
    //       </div>
    //     </div>

    //     {/* Additional Services */}

    //     {/* <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 md:p-8 lg:p-12 scroll-reveal">
    //       <div className="responsive-grid lg-2 items-center">
    //         <div className="space-y-4 md:space-y-6">
    //           <h3 className="heading-subsection mb-3 md:mb-4">
    //             Need Custom Solutions?
    //           </h3>
    //           <p className="text-body mb-4 md:mb-6">
    //             Our team of agricultural experts can develop tailored
    //             solutions to meet your specific farming requirements. From
    //             specialized equipment sourcing to custom supply chain
    //             optimization, we're here to help.
    //           </p>
    //           <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
    //             <Button className="btn-agro-primary text-sm md:text-base py-2 md:py-3">
    //               Request Consultation
    //             </Button>
    //             <Button
    //               variant="outline"
    //               className="btn-agro-outline text-sm md:text-base py-2 md:py-3"
    //             >
    //               View All Services
    //             </Button>
    //           </div>
    //         </div>

    //         <div className="responsive-grid sm-2 gap-3 md:gap-4 mt-6 lg:mt-0">
    //           {[
    //             {
    //               id: 'satisfaction',
    //               value: '98%',
    //               color: 'text-green-600',
    //               label: 'Client Satisfaction',
    //             },
    //             {
    //               id: 'response',
    //               value: '24h',
    //               color: 'text-blue-600',
    //               label: 'Response Time',
    //             },
    //             {
    //               id: 'projects',
    //               value: '100+',
    //               color: 'text-purple-600',
    //               label: 'Projects Completed',
    //             },
    //             {
    //               id: 'countries',
    //               value: '15+',
    //               color: 'text-amber-600',
    //               label: 'Countries Served',
    //             },
    //           ].map(stat => (
    //             <div
    //               key={stat.id}
    //               className="bg-white p-3 md:p-4 rounded-lg shadow-sm text-center"
    //             >
    //               <div
    //                 className={`text-xl md:text-2xl font-bold ${stat.color} mb-1`}
    //               >
    //                 {stat.value}
    //               </div>
    //               <div className="text-xs md:text-sm text-gray-600">
    //                 {stat.label}
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </div> */}
    //   </div>
    // </section>

    <section
      id="services"
      className="py-16 md:py-24 bg-agro-neutral-50 relative overflow-hidden"
    >
      {/* Background image - desktop/tablet version */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block"
        style={{
          backgroundImage: "url('/service-section.jpg')",
          zIndex: 1,
        }}
      />

      {/* Background image - mobile version */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:hidden"
        style={{
          backgroundImage: "url('/background-image-mobile.jpg')",
          zIndex: 1,
        }}
      />

      {/* Lighter overlay to ensure text readability while showing more of the image */}
      <div
        // className="absolute inset-0 bg-white/70 dark:bg-gray-900/50"
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30"
        style={{ zIndex: 2 }}
      />

      {/* Glassmorphic container wrapper - hidden on mobile */}
      <div className="container-premium relative z-10">
        <div className="max-w-full mx-auto">
          <div className="hidden lg:block glass-card backdrop-blur-xl bg-white/50 dark:bg-gray-800/5 border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12 mx-auto my-8 md:my-12">
            {/* Content */}
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16 scroll-reveal">
                <h2 className="heading-section text-[#fdf8f0]">
                  {servicesDataObject?.sectionTitle ||
                    (data &&
                      typeof data === 'object' &&
                      !Array.isArray(data) &&
                      (data as unknown as WixServicesData).sectionTitle) ||
                    'Our Process'}
                </h2>
                <div className="text-lead text-[#fdf8f0] max-w-3xl mx-auto">
                  {servicesDataObject?.sectionDescription ||
                  (data &&
                    typeof data === 'object' &&
                    !Array.isArray(data) &&
                    (data as unknown as WixServicesData).sectionDescription) ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: (servicesDataObject?.sectionDescription ||
                          (data as unknown as WixServicesData)
                            .sectionDescription)!
                          .replace(/<[^>]*>/g, '') // Strip all HTML tags
                          .replace(/\s+/g, ' ') // Normalize whitespace
                          .trim(),
                      }}
                    />
                  ) : (
                    <p className="text-[#fdf8f0]">
                      From farm to market, our process ensures every product is
                      sourced responsibly, inspected carefully, and delivered
                      reliably to global buyers.
                    </p>
                  )}
                </div>
              </div>

              {/* Services Grid with triangle layout */}
              <div className="mb-8 md:mb-12">
                {/* First row - 3 cards on large screens */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-6 mb-6">
                  {services.slice(0, 3).map(service => (
                    <ServiceFeatureCard
                      key={service.id}
                      title={service.title}
                      description={service.description}
                      icon={getIcon(service.icon)}
                      isActive={activeService === service.id}
                      onClick={() =>
                        setActiveService(
                          service.id === activeService ? null : service.id
                        )
                      }
                    />
                  ))}
                </div>

                {/* Second row - 2 centered cards on large screens */}
                <div className="hidden lg:flex lg:justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                    {services.slice(3, 5).map(service => (
                      <ServiceFeatureCard
                        key={service.id}
                        title={service.title}
                        description={service.description}
                        icon={getIcon(service.icon)}
                        isActive={activeService === service.id}
                        onClick={() =>
                          setActiveService(
                            service.id === activeService ? null : service.id
                          )
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Tablet/mobile layout - responsive grid */}
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {services.map(service => (
                    <ServiceFeatureCard
                      key={service.id}
                      title={service.title}
                      description={service.description}
                      icon={getIcon(service.icon)}
                      isActive={activeService === service.id}
                      onClick={() =>
                        setActiveService(
                          service.id === activeService ? null : service.id
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Additional Services */}

              {/* <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 md:p-8 lg:p-12 scroll-reveal">
                <div className="responsive-grid lg-2 items-center">
                  <div className="space-y-4 md:space-y-6">
                    <h3 className="heading-subsection mb-3 md:mb-4">
                      Need Custom Solutions?
                    </h3>
                    <p className="text-body mb-4 md:mb-6">
                      Our team of agricultural experts can develop tailored
                      solutions to meet your specific farming requirements. From
                      specialized equipment sourcing to custom supply chain
                      optimization, we're here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      <Button className="btn-agro-primary text-sm md:text-base py-2 md:py-3">
                        Request Consultation
                      </Button>
                      <Button
                        variant="outline"
                        className="btn-agro-outline text-sm md:text-base py-2 md:py-3"
                      >
                        View All Services
                      </Button>
                    </div>
                  </div>



                  <div className="responsive-grid sm-2 gap-3 md:gap-4 mt-6 lg:mt-0">
                    {[
                      {
                        id: 'satisfaction',
                        value: '98%',
                        color: 'text-green-600',
                        label: 'Client Satisfaction',
                      },
                      {
                        id: 'response',
                        value: '24h',
                        color: 'text-blue-600',
                        label: 'Response Time',
                      },
                      {
                        id: 'projects',
                        value: '100+',
                        color: 'text-purple-600',
                        label: 'Projects Completed',
                      },
                      {
                        id: 'countries',
                        value: '15+',
                        color: 'text-amber-600',
                        label: 'Countries Served',
                      },
                    ].map(stat => (
                      <div
                        key={stat.id}
                        className="bg-white p-3 md:p-4 rounded-lg shadow-sm text-center"
                      >
                        <div
                          className={`text-xl md:text-2xl font-bold ${stat.color} mb-1`}
                        >
                          {stat.value}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Mobile layout without glassmorphic effect */}
          <div className="lg:hidden max-w-6xl mx-auto px-4 md:px-6">
            {/* Section Header */}
            <div className="text-center mb-12 scroll-reveal">
              <h2 className="heading-section text-[#fdf8f0]">
                {servicesDataObject?.sectionTitle ||
                  (data &&
                    typeof data === 'object' &&
                    !Array.isArray(data) &&
                    (data as unknown as WixServicesData).sectionTitle) ||
                  'Our Services'}
              </h2>
              <div className="text-lead text-[#fdf8f0] max-w-3xl mx-auto">
                {servicesDataObject?.sectionDescription ||
                (data &&
                  typeof data === 'object' &&
                  !Array.isArray(data) &&
                  (data as unknown as WixServicesData).sectionDescription) ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: (servicesDataObject?.sectionDescription ||
                        (data as unknown as WixServicesData)
                          .sectionDescription)!
                        .replace(/<[^>]*>/g, '') // Strip all HTML tags
                        .replace(/\s+/g, ' ') // Normalize whitespace
                        .trim(),
                    }}
                  />
                ) : (
                  <p>
                    Comprehensive agricultural solutions designed to meet the
                    evolving needs of modern farming operations
                  </p>
                )}
              </div>
            </div>

            {/* Services Grid for mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services.map(service => (
                <ServiceFeatureCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  icon={getIcon(service.icon)}
                  isActive={activeService === service.id}
                  onClick={() =>
                    setActiveService(
                      service.id === activeService ? null : service.id
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
