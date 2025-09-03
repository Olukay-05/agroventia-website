'use client';

import { useState, useEffect } from 'react';
import {
  HeroContent,
  AboutContent,
  ServiceContent,
  ProductContent,
  ProductCategory,
  ContactContent,
} from '@/services/wix-data.service';
import { convertWixImageUrl } from '@/lib/utils/image';
import WixImage from './WixImage';

// Utility function to extract image URLs from Import2 product data
function extractProductImages(product: ProductContent): string[] {
  const images: string[] = [];

  // Check common image field names
  const imageFieldNames = [
    'image1', // Import2 collection uses image1
    'images', // Array of images
    'image', // Single image
    'productImage', // Product specific image
    'photo', // Alternative naming
    'picture', // Alternative naming
    'mainImage', // Main product image
    'thumbnail', // Thumbnail image
  ];

  imageFieldNames.forEach(fieldName => {
    const value = (product as unknown as Record<string, unknown>)[fieldName];
    if (value) {
      if (Array.isArray(value) && value.length > 0) {
        // Handle array of images
        images.push(
          ...value.filter(img => typeof img === 'string' && img.trim())
        );
      } else if (typeof value === 'string' && value.trim()) {
        // Handle single image string
        images.push(value);
      } else if (typeof value === 'object' && (value as { src?: string }).src) {
        // Handle Wix media object
        images.push((value as { src: string }).src);
      }
    }
  });

  // Log for debugging
  if (images.length === 0) {
    console.warn('No images found for product:', {
      productName: product.name || 'Unknown',
      availableFields: Object.keys(product),
      checkedFields: imageFieldNames,
    });
  }

  return [...new Set(images)]; // Remove duplicates
}

interface CollectionData {
  hero: { items: Array<{ data: HeroContent }> };
  about: { items: Array<{ data: AboutContent }> };
  services: { items: Array<{ data: ServiceContent }> };
  products: { items: Array<{ data: ProductContent }> };
  categories: {
    items: Array<{ data: ProductCategory }>;
    allProducts?: ProductContent[];
    productSummary?: {
      totalProducts: number;
      productsSource: string;
      fetchedAt: string;
      note: string;
    };
  };
  contact: { items: Array<{ data: ContactContent }> };
  _metadata: {
    fetchedAt: string;
    totalCollections: number;
  };
}

export default function WixDataFetcher() {
  const [data, setData] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllData() {
      try {
        console.log('Fetching all collections...');
        const response = await fetch('/api/collections');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Fetched data:', result);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-4 text-xl text-gray-600">
              Loading Wix Collections...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h2 className="font-bold text-xl mb-2">Error Loading Data</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-600">
            <h2 className="text-xl">No data available</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AgroVentia Inc. - Data Overview
          </h1>
          <p className="text-gray-600">
            Fetched {data._metadata.totalCollections} collections at{' '}
            {new Date(data._metadata.fetchedAt).toLocaleString()}
          </p>
        </div>

        {/* Hero Section */}
        {data.hero.items.length > 0 && (
          <div className="bg-blue-600 text-white p-8 rounded-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-4">
                  {data.hero.items[0].data.title || 'Welcome to AgroVentia'}
                </h2>
                <p className="text-xl mb-4 opacity-90">
                  {data.hero.items[0].data.subtitle ||
                    'Your Agricultural Partner'}
                </p>
                <p className="mb-6 opacity-80">
                  {data.hero.items[0].data.description ||
                    'Leading the way in agricultural innovation and sustainable farming solutions.'}
                </p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                  {data.hero.items[0].data.ctaPrimary || 'Learn More'}
                </button>
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                {data.hero.items[0].data.backgroundImage ? (
                  <WixImage
                    src={data.hero.items[0].data.backgroundImage}
                    alt={data.hero.items[0].data.title || 'Hero Background'}
                    fill={true}
                    className="w-full h-full"
                    style={{ objectFit: 'cover' }}
                    onLoadError={error =>
                      console.warn('Hero image failed:', error)
                    }
                  />
                ) : (
                  <div className="bg-blue-500 h-full flex items-center justify-center">
                    <span className="text-2xl font-semibold">
                      Hero Image Placeholder
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* About Section */}
        {data.about.items.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-600">
                  Our Mission
                </h3>
                <p className="text-gray-700 mb-6">
                  {data.about.items[0].data.mission ||
                    'To provide sustainable agricultural solutions for a better future.'}
                </p>
                <h3 className="text-xl font-semibold mb-3 text-blue-600">
                  Our Vision
                </h3>
                <p className="text-gray-700">
                  {data.about.items[0].data.vision ||
                    'Leading innovation in sustainable agriculture worldwide.'}
                </p>
              </div>
              <div className="h-48 rounded-lg overflow-hidden">
                {data.about.items[0].data.aboutImage ? (
                  <WixImage
                    src={data.about.items[0].data.aboutImage}
                    alt="About Us"
                    fill={true}
                    className="w-full h-full"
                    style={{ objectFit: 'cover' }}
                    onLoadError={error =>
                      console.warn('About image failed:', error)
                    }
                  />
                ) : (
                  <div className="bg-gray-200 h-full flex items-center justify-center">
                    <span className="text-gray-600">
                      About Image Placeholder
                    </span>
                  </div>
                )}
              </div>

              {data.about.items[0].data.coreValues &&
                data.about.items[0].data.coreValues.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                      Core Values
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {data.about.items[0].data.coreValues.map(
                        (value, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <h4 className="font-semibold text-lg mb-2">
                              {value.title}
                            </h4>
                            <p className="text-gray-600">{value.description}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Services Section */}
        {data.services.items.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.services.items.map((service, index) => (
                <div
                  key={index}
                  className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                    {service.data.icon ? (
                      <WixImage
                        src={service.data.icon}
                        alt={service.data.title}
                        fill={true}
                        className="w-8 h-8"
                        style={{ objectFit: 'contain' }}
                        onLoadError={error =>
                          console.warn('Service icon failed:', error)
                        }
                      />
                    ) : (
                      <span className="text-green-600 text-xl font-bold">
                        S
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {service.data.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.data.description}
                  </p>
                  {service.data.features &&
                    service.data.features.length > 0 && (
                      <ul className="text-sm text-gray-500">
                        {service.data.features
                          .slice(0, 3)
                          .map((feature, fIndex) => (
                            <li key={fIndex} className="mb-1">
                              • {feature}
                            </li>
                          ))}
                      </ul>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Categories Section */}
        {data.categories && data.categories.items.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Product Categories
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.categories.items.map((category, index) => (
                <div
                  key={index}
                  className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
                    {category.data.categoryImage ? (
                      <WixImage
                        src={category.data.categoryImage}
                        alt={category.data.title || category.data.title}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover rounded-lg"
                        onLoadError={error =>
                          console.warn('Category image failed:', error)
                        }
                      />
                    ) : (
                      <div className="bg-gray-200 h-full flex items-center justify-center">
                        <span className="text-gray-500">Category Image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {category.data.title || category.data.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.data.description || category.data.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>Products: {category.data.allProducts?.length || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products from Import2 Collection */}
        {data.products && data.products.items.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              All Products - Import2 Collection
            </h2>
            <div className="mb-6 bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-3">
                Direct Import2 Products
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Total Products:</strong>{' '}
                    {data.products.items.length}
                  </p>
                  <p>
                    <strong>Active Products:</strong>{' '}
                    {
                      data.products.items.filter(
                        (item: { data: { isActive?: boolean } }) =>
                          item.data.isActive !== false
                      ).length
                    }
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Data Source:</strong> Import2 Collection
                  </p>
                  <p>
                    <strong>Fetch Method:</strong> Direct API Query
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Collection ID:</strong> Import2
                  </p>
                  <p>
                    <strong>Items Type:</strong> ProductContent
                  </p>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.products.items.map((productItem, index) => {
                const product = productItem.data;
                const productImages = extractProductImages(product);

                // Debug: Log product data structure to console
                if (index === 0) {
                  // Removed verbose console.log to reduce noise
                }

                return (
                  <div
                    key={product._id || index}
                    className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="w-full h-48 rounded-lg mb-4 overflow-hidden bg-gray-100">
                      {productImages.length > 0 ? (
                        <WixImage
                          src={productImages[0]}
                          alt={product.name || `Product ${index + 1}`}
                          fill={true}
                          className="w-full h-full"
                          style={{ objectFit: 'cover' }}
                          onLoadError={error =>
                            console.warn(
                              `Import2 Product ${index + 1} image failed:`,
                              error,
                              'Available images:',
                              productImages
                            )
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <span className="block">No Image Available</span>
                            <span className="text-xs mt-1 block">
                              Available fields:{' '}
                              {Object.keys(product).join(', ')}
                            </span>
                            <span className="text-xs mt-1 block">
                              Checked image fields: image1, images, image,
                              productImage, photo, picture
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {product.name || `Product ${index + 1}`}
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {product.description || 'No description available'}
                    </p>

                    {/* Product Details */}
                    <div className="space-y-2 text-sm">
                      {product.category && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium text-blue-600">
                            {product.category}
                          </span>
                        </div>
                      )}

                      {product.origin && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Origin:</span>
                          <span className="font-medium">{product.origin}</span>
                        </div>
                      )}

                      {product.price !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium text-green-600">
                            ${product.price}
                          </span>
                        </div>
                      )}

                      {product.availability !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              product.availability
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.availability
                              ? 'Available'
                              : 'Out of Stock'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Additional Images Count */}
                    {productImages.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        {productImages.length > 1 ? (
                          <p className="text-xs text-gray-500">
                            +{productImages.length - 1} more image
                            {productImages.length > 2 ? 's' : ''}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Single image available
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Individual Products Detailed Section */}
        {data.categories &&
          data.categories.allProducts &&
          data.categories.allProducts.length > 0 && (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Complete Product Catalog
              </h2>
              <div className="mb-6 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">
                  Product Collection Overview
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Total Products:</strong>{' '}
                      {data.categories.allProducts.length}
                    </p>
                    <p>
                      <strong>Active Products:</strong>{' '}
                      {
                        data.categories.allProducts.filter(
                          (p: ProductContent) => p.isActive !== false
                        ).length
                      }
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Data Source:</strong>{' '}
                      {data.categories.productSummary?.productsSource ||
                        'Wix CMS'}
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{' '}
                      {new Date(
                        data.categories.productSummary?.fetchedAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Categories:</strong>{' '}
                      {data.categories.items.length}
                    </p>
                    <p>
                      <strong>Collection:</strong> Import2
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Product List */}
              <div className="space-y-8">
                {data.categories.allProducts.map(
                  (product: ProductContent, index: number) => {
                    // Extract product metadata
                    const productData = product;
                    const createdDate = productData._createdDate
                      ? new Date(
                          typeof productData._createdDate === 'string'
                            ? productData._createdDate
                            : productData._createdDate.$date
                        )
                      : null;
                    const updatedDate = productData._updatedDate
                      ? new Date(
                          typeof productData._updatedDate === 'string'
                            ? productData._updatedDate
                            : productData._updatedDate.$date
                        )
                      : null;

                    return (
                      <div
                        key={product._id || index}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="grid lg:grid-cols-3 gap-6">
                          {/* Product Image */}
                          <div className="lg:col-span-1">
                            <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                              {productData.images &&
                              productData.images.length > 0 ? (
                                <WixImage
                                  src={productData.images[0]}
                                  alt={
                                    productData.name || `Product ${index + 1}`
                                  }
                                  width={400}
                                  height={256}
                                  className="w-full h-full object-cover rounded-lg"
                                  onLoadError={error =>
                                    console.warn(
                                      `Product ${index + 1} first image failed:`,
                                      error
                                    )
                                  }
                                />
                              ) : productData.images &&
                                productData.images.length > 1 ? (
                                <WixImage
                                  src={productData.images[1]}
                                  alt={
                                    productData.name || `Product ${index + 1}`
                                  }
                                  width={400}
                                  height={256}
                                  className="w-full h-full object-cover rounded-lg"
                                  onLoadError={error =>
                                    console.warn(
                                      `Product ${index + 1} second image failed:`,
                                      error
                                    )
                                  }
                                />
                              ) : productData.images &&
                                productData.images.length > 0 ? (
                                <WixImage
                                  src={productData.images[0]}
                                  alt={
                                    productData.name || `Product ${index + 1}`
                                  }
                                  width={400}
                                  height={256}
                                  className="w-full h-full object-cover rounded-lg"
                                  onLoadError={error =>
                                    console.warn(
                                      `Product ${index + 1} first image failed:`,
                                      error
                                    )
                                  }
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <span>No Image Available</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="lg:col-span-2 space-y-4">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {productData.name || `Product ${index + 1}`}
                              </h3>
                              <div className="text-gray-600 mb-4">
                                {productData.description && (
                                  <p className="mb-3">
                                    {productData.description}
                                  </p>
                                )}
                                {productData.description && (
                                  <p className="mb-3">
                                    {productData.description}
                                  </p>
                                )}
                                {productData.description && (
                                  <p className="mb-3">
                                    {productData.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Product Metadata Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Basic Information */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                  Product Information
                                </h4>

                                {productData._id && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Product ID:
                                    </span>
                                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                      {productData._id}
                                    </span>
                                  </div>
                                )}

                                {productData.category && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Category:
                                    </span>
                                    <span className="font-medium">
                                      {productData.category}
                                    </span>
                                  </div>
                                )}

                                {productData.origin && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Origin:
                                    </span>
                                    <span className="font-medium">
                                      {productData.origin}
                                    </span>
                                  </div>
                                )}

                                {productData.price !== undefined && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Price:
                                    </span>
                                    <span className="font-medium text-green-600">
                                      ${productData.price}
                                    </span>
                                  </div>
                                )}

                                {productData.availability !== undefined && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Availability:
                                    </span>
                                    <span
                                      className={`font-medium ${
                                        productData.availability
                                          ? 'text-green-600'
                                          : 'text-red-600'
                                      }`}
                                    >
                                      {productData.availability
                                        ? 'In Stock'
                                        : 'Out of Stock'}
                                    </span>
                                  </div>
                                )}

                                {productData.isActive !== undefined && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Status:
                                    </span>
                                    <span
                                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                                        productData.isActive
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {productData.isActive
                                        ? 'Active'
                                        : 'Inactive'}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Technical Details */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                  Technical Details
                                </h4>

                                {createdDate && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Created:
                                    </span>
                                    <span className="text-sm">
                                      {createdDate.toLocaleDateString()}
                                    </span>
                                  </div>
                                )}

                                {updatedDate && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Updated:
                                    </span>
                                    <span className="text-sm">
                                      {updatedDate.toLocaleDateString()}
                                    </span>
                                  </div>
                                )}

                                {productData._owner && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Owner ID:
                                    </span>
                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                      {productData._owner.substring(0, 8)}...
                                    </span>
                                  </div>
                                )}

                                {product.category && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Category:
                                    </span>
                                    <span className="font-medium text-blue-600">
                                      {product.category}
                                    </span>
                                  </div>
                                )}

                                {productData.specifications &&
                                  Object.keys(productData.specifications)
                                    .length > 0 && (
                                    <div>
                                      <span className="text-gray-600 block mb-2">
                                        Specifications:
                                      </span>
                                      <div className="bg-gray-50 p-3 rounded text-sm">
                                        {Object.entries(
                                          productData.specifications
                                        ).map(([key, value]) => (
                                          <div
                                            key={key}
                                            className="flex justify-between mb-1"
                                          >
                                            <span className="capitalize">
                                              {key}:
                                            </span>
                                            <span>{String(value)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>

                            {/* Additional Images */}
                            {productData.images &&
                              productData.images.length > 1 && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">
                                    Additional Images
                                  </h4>
                                  <div className="grid grid-cols-4 gap-2">
                                    {productData.images
                                      .slice(1, 5)
                                      .map(
                                        (
                                          imageUrl: string,
                                          imgIndex: number
                                        ) => (
                                          <div
                                            key={imgIndex}
                                            className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                                          >
                                            <WixImage
                                              src={imageUrl}
                                              alt={`Product image ${imgIndex + 2}`}
                                              width={100}
                                              height={100}
                                              className="w-full h-full object-cover"
                                              onLoadError={error =>
                                                console.warn(
                                                  `Product additional image ${imgIndex + 2} failed:`,
                                                  error
                                                )
                                              }
                                            />
                                          </div>
                                        )
                                      )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Summary Footer */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Data Summary
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p>
                      <strong>Total Products Displayed:</strong>{' '}
                      {data.categories.allProducts.length}
                    </p>
                    <p>
                      <strong>Categories Available:</strong>{' '}
                      {data.categories.items
                        .map(
                          (cat: { data: ProductCategory }) =>
                            (cat.data as { categoryName?: string })
                              .categoryName ||
                            (cat.data as { title?: string }).title
                        )
                        .join(', ')}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Data Fetched:</strong>{' '}
                      {new Date(data._metadata.fetchedAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>API Method:</strong> Direct HTTP (No SDK)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Products Section */}
        {data.categories &&
          data.categories.allProducts &&
          data.categories.allProducts.length > 0 && (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Products
              </h2>
              <div className="mb-6 bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">
                  <strong>Total Products:</strong>{' '}
                  {data.categories.allProducts.length} |{' '}
                  <strong>Categories:</strong> {data.categories.items.length} |{' '}
                  <strong>Source:</strong>{' '}
                  {data.categories.productSummary?.productsSource || 'Wix CMS'}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.categories.allProducts
                  .slice(0, 8)
                  .map((product, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 p-4 rounded-lg"
                    >
                      <div className="h-32 rounded-lg mb-4 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <WixImage
                            src={product.images[0]}
                            alt={product.name}
                            width={200}
                            height={128}
                            className="w-full h-full object-cover"
                            onLoadError={error =>
                              console.warn('Product grid image failed:', error)
                            }
                          />
                        ) : (
                          <div className="bg-gray-200 h-full flex items-center justify-center">
                            <span className="text-gray-500 text-sm">
                              Product Image
                            </span>
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold mb-2">{product.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        Origin: {product.origin}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                          product.availability
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.availability ? 'Available' : 'Out of Stock'}
                      </span>
                    </div>
                  ))}
              </div>
              {data.categories.allProducts.length > 8 && (
                <div className="mt-6 text-center">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    View All {data.categories.allProducts.length} Products
                  </button>
                </div>
              )}
            </div>
          )}

        {/* Contact Section */}
        {data.contact.items.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {data.contact.items[0].data.sectionTitle || 'Get In Touch'}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Address</h3>
                  <p className="text-gray-600">
                    {data.contact.items[0].data.businessAddress ||
                      '403 - 65 Mutual Street, Toronto, M5B 0E5'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Phone</h3>
                  <p className="text-gray-600">
                    {data.contact.items[0].data.businessPhone ||
                      '+1 (403) 477-6059'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Email</h3>
                  <p className="text-gray-600">
                    {data.contact.items[0].data.businessEmail ||
                      'info@agroventia.ca'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Working Hours</h3>
                  <p className="text-gray-600">
                    {data.contact.items[0].data.businessHours ||
                      'Monday - Friday: 8:00 AM - 6:00 PM EST Saturday: 9:00 AM - 2:00 PM EST Sunday: Closed'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Response Time</h3>
                  <p className="text-gray-600">
                    {data.contact.items[0].data.responseTime ||
                      '24 hours for all inquiries'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Social Links</h3>
                  <p className="text-gray-600">
                    {data.contact.items[0].data.socialLinks ||
                      'LinkedIn: /company/agroventia Twitter: @agroventia Facebook: /agroventiainc'}
                  </p>
                </div>
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                {data.contact.items[0].data.contactImage ? (
                  <WixImage
                    src={data.contact.items[0].data.contactImage}
                    alt="Contact Us"
                    width={400}
                    height={256}
                    className="w-full h-full object-cover rounded-lg"
                    onLoadError={error =>
                      console.warn('Contact image failed:', error)
                    }
                  />
                ) : (
                  <div className="bg-gray-200 h-full flex items-center justify-center">
                    <span className="text-gray-600">
                      Contact Image Placeholder
                    </span>
                  </div>
                )}
              </div>
            </div>
            {data.contact.items[0].data.sectionDescription && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.contact.items[0].data.sectionDescription,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Debug Info */}
        <div className="bg-gray-900 text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Data Fetching Debug Info</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Collections Loaded:</h4>
              <ul className="space-y-1">
                <li>• Hero: {data.hero.items.length} items</li>
                <li>• About: {data.about.items.length} items</li>
                <li>• Services: {data.services.items.length} items</li>
                <li>
                  • Products (Import2): {data.products.items.length} items
                </li>
                <li>• Categories: {data.categories.items.length} items</li>
                <li>• Contact: {data.contact.items.length} items</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">API Details:</h4>
              <ul className="space-y-1">
                <li>• Fetch Method: Direct HTTP (No SDK)</li>
                <li>• Data Source: Wix CMS Collections</li>
                <li>• Reference Handling: Enabled</li>
                <li>
                  • All Products Embedded:{' '}
                  {data.categories.allProducts ? 'Yes' : 'No'}
                </li>
                <li>
                  • Total Products (Import2): {data.products.items.length}
                </li>
              </ul>
            </div>
          </div>

          {/* Image URL Debug */}
          {data.hero.items.length > 0 &&
            data.hero.items[0].data.backgroundImage && (
              <div className="mt-6 p-4 bg-gray-800 rounded">
                <h4 className="font-semibold mb-2">
                  Image URL Debug (Hero Background):
                </h4>
                <div className="text-xs space-y-1">
                  <p>
                    <strong>Original:</strong>{' '}
                    <span className="text-yellow-300">
                      {data.hero.items[0].data.backgroundImage}
                    </span>
                  </p>
                  <p>
                    <strong>Converted:</strong>{' '}
                    <span className="text-green-300">
                      {convertWixImageUrl(
                        data.hero.items[0].data.backgroundImage
                      )?.primary || 'No conversion result'}
                    </span>
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
