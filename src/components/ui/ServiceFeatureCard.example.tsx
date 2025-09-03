// Example usage of ServiceFeatureCard component
import React, { useState } from 'react';
import ServiceFeatureCard from './ServiceFeatureCard';
import {
  Handshake,
  Truck,
  ShieldCheck,
  Package,
  Globe,
  FileText,
} from 'lucide-react';

const ServiceFeatureCardExample = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const services = [
    {
      id: 'consulting',
      title: 'Agricultural Consulting',
      description:
        'Expert advice and consulting services for modern farming practices and agricultural optimization.',
      icon: <Handshake className="text-green-600" />,
    },
    {
      id: 'logistics',
      title: 'Supply Chain Management',
      description:
        'Comprehensive supply chain solutions for agricultural products and farming equipment.',
      icon: <Truck className="text-blue-600" />,
    },
    {
      id: 'quality',
      title: 'Quality Control',
      description:
        'Rigorous quality control processes ensuring premium agricultural products and materials.',
      icon: <ShieldCheck className="text-purple-600" />,
    },
    {
      id: 'packaging',
      title: 'Custom Packaging',
      description:
        'Specialized packaging solutions to preserve product quality during transit.',
      icon: <Package className="text-amber-600" />,
    },
    {
      id: 'global',
      title: 'Global Logistics',
      description:
        'End-to-end logistics solutions connecting African producers with global markets.',
      icon: <Globe className="text-indigo-600" />,
    },
    {
      id: 'documentation',
      title: 'Documentation Services',
      description:
        'Complete documentation support for seamless import/export processes.',
      icon: <FileText className="text-rose-600" />,
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12">
          ServiceFeatureCard Examples
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceFeatureCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              index={index}
              isActive={activeCard === service.id}
              onClick={() =>
                setActiveCard(activeCard === service.id ? null : service.id)
              }
            />
          ))}
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Interactive Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Hover over cards to see 3D tilt effect</li>
            <li>Click cards to toggle active state</li>
            <li>Icons move slightly with mouse position</li>
            <li>Smooth spring animations on all interactions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceFeatureCardExample;
