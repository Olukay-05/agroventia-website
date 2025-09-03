import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

const ProductSkeleton: React.FC = () => {
  return (
    <Card className="flex flex-col overflow-hidden">
      {/* Image skeleton */}
      <div
        className="overflow-hidden rounded-t-lg relative wix-image-container bg-gray-200 animate-pulse"
        style={{ height: '12rem' }}
      />

      <CardHeader className="pb-3">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
      </CardHeader>

      <CardContent className="pb-3 flex-grow">
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
      </CardFooter>
    </Card>
  );
};

export default ProductSkeleton;
