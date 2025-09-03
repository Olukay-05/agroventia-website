// Mock data for homepage sections using existing Wix API structure

// Data passed as props to the root component
export const mockRootProps = {
  heroData: {
    title: 'Professional Agricultural Import Solutions',
    subtitle:
      'Quality Products for Modern Agriculture - Your Trusted Partner in Agricultural Innovation',
    backgroundImage:
      'https://images.unsplash.com/photo-1649344739140-c71b2ee1005c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGZhcm1pbmclMjBmaWVsZHMlMjB0cmFjdG9yJTIwbGFuZHNjYXBlfGVufDB8MHx8Z3JlZW58MTc1NjIxODM3NHww&ixlib=rb-4.1.0&q=85',
    ctaPrimary: 'Get Started',
    ctaSecondary: 'Learn More',
  },
  aboutData: {
    title: 'About AgroVentia',
    description:
      'Leading agricultural import company dedicated to providing premium farming solutions and innovative agricultural products to farmers worldwide.',
    coreValues: [
      'Quality Assurance',
      'Sustainable Practices',
      'Innovation Focus',
      'Customer Excellence',
    ],
  },
  servicesData: [
    {
      id: 'service-1',
      title: 'Agricultural Consulting',
      description:
        'Expert advice and consulting services for modern farming practices and agricultural optimization.',
      icon: 'consulting',
    },
    {
      id: 'service-2',
      title: 'Supply Chain Management',
      description:
        'Comprehensive supply chain solutions for agricultural products and farming equipment.',
      icon: 'supply-chain',
    },
    {
      id: 'service-3',
      title: 'Quality Control',
      description:
        'Rigorous quality control processes ensuring premium agricultural products and materials.',
      icon: 'quality',
    },
  ],
  productsData: [
    {
      id: 'category-1',
      name: 'Farm Equipment',
      description:
        'Modern farming equipment and machinery for efficient agricultural operations.',
      image:
        'https://images.unsplash.com/photo-1634584604333-75c849472112?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHx0cmFjdG9yJTIwZmFybSUyMGVxdWlwbWVudCUyMG1hY2hpbmVyeSUyMGhhcnZlc3RlcnxlbnwwfDB8fHwxNzU2MjE4Mzc0fDA&ixlib=rb-4.1.0&q=85',
      productCount: 25,
    },
    {
      id: 'category-2',
      name: 'Crop Protection',
      description:
        'Advanced crop protection solutions including pesticides and disease management products.',
      image:
        'https://images.unsplash.com/photo-1708266658968-a9e1dc40ab17?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxjcm9wJTIwc3ByYXlpbmclMjBwbGFudCUyMHByb3RlY3Rpb24lMjBhZ3JpY3VsdHVyZSUyMHBlc3RpY2lkZXxlbnwwfDB8fGdyZWVufDE3NTYyMTgzNzR8MA&ixlib=rb-4.1.0&q=85',
      productCount: 18,
    },
    {
      id: 'category-3',
      name: 'Fertilizers & Nutrients',
      description:
        'Premium fertilizers and plant nutrients for optimal crop growth and yield.',
      image:
        'https://images.unsplash.com/photo-1682785868646-f2353d226849?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxmZXJ0aWxpemVyJTIwcGxhbnQlMjBudXRyaWVudHMlMjBzb2lsJTIwYWdyaWN1bHR1cmV8ZW58MHwwfHx8MTc1NjIxODM3NHww&ixlib=rb-4.1.0&q=85',
      productCount: 32,
    },
  ],
  contactData: {
    title: 'Get In Touch',
    description:
      'Contact us for agricultural solutions and partnership opportunities.',
    address: '123 Agricultural Drive, Farm City, FC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@agroventia.com',
    hours: 'Monday - Friday: 8:00 AM - 6:00 PM',
  },
};
