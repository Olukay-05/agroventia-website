// Mock data for homepage sections using existing Wix API structure

// Data passed as props to the root component
export const mockRootProps = {
  heroData: {
    _id: 'mock-hero-1',
    _owner: 'mock-owner',
    _createdDate: { $date: '2023-01-01T00:00:00.000Z' },
    _updatedDate: { $date: '2023-01-01T00:00:00.000Z' },
    title: 'Professional Agricultural Import Solutions',
    subtitle:
      'Quality Products for Modern Agriculture - Your Trusted Partner in Agricultural Innovation',
    description: 'Leading agricultural solutions for modern farming needs',
    backgroundImage:
      'https://images.unsplash.com/photo-1649344739140-c71b2ee1005c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGZhcm1pbmclMjBmaWVsZHMlMjB0cmFjdG9yJTIwbGFuZHNjYXBlfGVufDB8MHx8Z3JlZW58MTc1NjIxODM3NHww&ixlib=rb-4.1.0&q=85',
    companyLogo: '/agroventia-logo.jpg',
    ctaPrimary: 'Get Started',
    ctaSecondary: 'Learn More',
  },
  aboutData: {
    _id: 'mock-about-1',
    _owner: 'mock-owner',
    _createdDate: { $date: '2023-01-01T00:00:00.000Z' },
    _updatedDate: { $date: '2023-01-01T00:00:00.000Z' },
    sectionTitle: 'About AgroVentia Inc.',
    mission:
      'To deliver premium, ethically sourced agricultural products worldwide, ensuring quality, reliability, and sustainability in every transaction.',
    vision:
      'To be the leading provider of sustainable agricultural solutions that empower farmers and contribute to global food security.',
    story:
      "AgroVentia Inc. is a Canadian company with deep African roots, established to connect global markets with high-quality agricultural products. Our leadership team combines extensive expertise in business management, consulting, and global trade, with over a decade of direct experience in the import and export of agricultural produce.  AgroVentia was created with one goal: to give international buyers a reliable, straightforward way to access Africa's finest agricultural products. Every shipment carries our commitment to quality, transparency, and on-time delivery, so you can source with confidence and focus on growing your business. At AgroVentia, we prioritize quality, ethical sourcing, customer trust, and long-term value over short-term gains. Every transaction, regardless of scale, is handled with the highest professional and ethical standards. Through strong partnerships and a sustainable supply chain across Africa, we deliver consistency and trust. Our goal is not just to be a supplier, but a long-term partner in helping you achieve your sourcing objectives and deliver excellence to your customers through seamless, dependable trade.",
    headquarters: 'Toronto, Canada',
    foundingYear: '2010',
    certifications: 'ISO 9001, USDA Organic, GlobalGAP',
    aboutImage:
      'https://images.unsplash.com/photo-1597668589684-0d5f0c9e4d5a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGZhcm1pbmclMjBoZWFkcXVhcnRlcnN8ZW58MHwwfHx8MTc1NjIxODM3NHww&ixlib=rb-4.1.0&q=85',
    coreValues: [
      {
        _id: 'value-1',
        _owner: 'mock-owner',
        _createdDate: { $date: '2023-01-01T00:00:00.000Z' },
        _updatedDate: { $date: '2023-01-01T00:00:00.000Z' },
        reference: 'quality',
        title: 'Quality First',
        description:
          'We ensure all our products meet the highest standards of quality and safety.',
      },
      {
        _id: 'value-2',
        _owner: 'mock-owner',
        _createdDate: { $date: '2023-01-01T00:00:00.000Z' },
        _updatedDate: { $date: '2023-01-01T00:00:00.000Z' },
        reference: 'sustainability',
        title: 'Ethical Sourcing',
        description:
          'We are committed to environmentally responsible sourcing and distribution.',
      },
      {
        _id: 'value-3',
        _owner: 'mock-owner',
        _createdDate: { $date: '2023-01-01T00:00:00.000Z' },
        _updatedDate: { $date: '2023-01-01T00:00:00.000Z' },
        reference: 'innovation',
        title: 'Trust & Transparency',
        description:
          'We continuously seek new technologies and methods to improve agricultural outcomes.',
      },
      {
        _id: 'value-4',
        _owner: 'mock-owner',
        _createdDate: { $date: '2023-01-01T00:00:00.000Z' },
        _updatedDate: { $date: '2023-01-01T00:00:00.000Z' },
        reference: 'customer',
        title: 'Reliability',
        description:
          'We prioritize our customers needs and strive to exceed their expectations.',
      },
    ],
  },
  servicesData: {
    _id: 'mock-services-1',
    _owner: 'mock-owner',
    _createdDate: { $date: '2023-01-01T00:00:00.000Z' },
    _updatedDate: { $date: '2023-01-01T00:00:00.000Z' },
    sectionTitle: 'Our Process',
    sectionDescription:
      'From farm to market, our process ensures every product is sourced responsibly, inspected carefully, and delivered reliably to global buyers.',
    importServices:
      'We identify Africa’s finest agricultural producers, prioritizing ethical practices and sustainable farming.',
    customSourcing:
      'We deliver as promised, shipments arrive on schedule so you can focus on growing your business.',
    qualityAssurance:
      'Every product is carefully inspected and verified to meet international standards before export.',
    logistics:
      'Our experienced team manages the entire supply chain, ensuring efficiency and transparency.',
    documentation:
      'More than a supplier, we’re committed to building lasting relationships based on trust and value.',
    servicesImage:
      'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHJlJTIwbG9naXN0aWNzJTIwc3VwcGx5JTIwY2hhaW58ZW58MHwwfHx8MTc1NjIxODM3NHww&ixlib=rb-4.1.0&q=85',
  },
  productsData: [
    {
      _id: 'category-1',
      _owner: 'mock-owner',
      _createdDate: { $date: '2023-01-01T00:00:00.000Z' },
      _updatedDate: { $date: '2023-01-01T00:00:00.000Z' },
      title: 'Farm Equipment',
      description:
        'Modern farming equipment and machinery for efficient agricultural operations.',
      categoryImage:
        'https://images.unsplash.com/photo-1634584604333-75c849472112?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHx0cmFjdG9yJTIwZmFybSUyMGVxdWlwbWVudCUyMG1hY2hpbmVyeSUyMGhhcnZlc3RlcnxlbnwwfDB8fHwxNzU2MjE4Mzc0fDA&ixlib=rb-4.1.0&q=85',
    },
    {
      _id: 'category-2',
      _owner: 'mock-owner',
      _createdDate: { $date: '2023-01-01T00:00:00.000Z' },
      _updatedDate: { $date: '2023-01-01T00:00:00.000Z' },
      title: 'Crop Protection',
      description:
        'Advanced crop protection solutions including pesticides and disease management products.',
      categoryImage:
        'https://images.unsplash.com/photo-1708266658968-a9e1dc40ab17?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxjcm9wJTIwc3ByYXlpbmclMjBwbGFudCUyMHByb3RlY3Rpb24lMjBhZ3JpY3VsdHVyZSUyMHBlc3RpY2lkZXxlbnwwfDB8fGdyZWVufDE3NTYyMTgzNzR8MA&ixlib=rb-4.1.0&q=85',
    },
    {
      _id: 'category-3',
      _owner: 'mock-owner',
      _createdDate: { $date: '2023-01-01T00:00:00.000Z' },
      _updatedDate: { $date: '2023-01-01T00:00:00.000Z' },
      title: 'Fertilizers & Nutrients',
      description:
        'Premium fertilizers and plant nutrients for optimal crop growth and yield.',
      categoryImage:
        'https://images.unsplash.com/photo-1682785868646-f2353d226849?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxmZXJ0aWxpemVyJTIwcGxhbnQlMjBudXRyaWVudHMlMjBzb2lsJTIwYWdyaWN1bHR1cmV8ZW58MHwwfHx8MTc1NjIxODM3NHww&ixlib=rb-4.1.0&q=85',
    },
  ],
  contactData: {
    _id: 'mock-contact-1',
    _owner: 'mock-owner',
    _createdDate: { $date: '2023-01-01T00:00:00.000Z' },
    _updatedDate: { $date: '2023-01-01T00:00:00.000Z' },
    sectionTitle: 'Get In Touch',
    sectionDescription:
      'Ready to discuss your product needs? Contact our team for personalized service and competitive pricing.',
    businessEmail: 'info@agroventia.ca',
    businessPhone: '+1 (403) 477-6059',
    businessAddress: '403 - 65 Mutual Street, Toronto, M5B 0E5',
    businessHours:
      'Monday - Friday: 8:00 AM - 6:00 PM EST Saturday: 9:00 AM - 2:00 PM EST Sunday: Closed',
    responseTime: 'Within 24 hours',
    socialLinks: 'https://www.linkedin.com/company/agroventia',
    contactImage:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMG9mZmljZSUyMGNvbnRhY3QlMjB1c2ElMjBmYXJtaW5nfGVufDB8MHx8fDE3NTYyMTgzNzR8MA&ixlib=rb-4.1.0&q=85',
    latitude: 43.6532,
    longitude: -79.3832,
  },
};
