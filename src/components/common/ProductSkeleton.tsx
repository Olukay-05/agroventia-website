import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

const ProductSkeleton: React.FC = () => {
  return (
    <Card className="flex flex-col overflow-hidden" data-testid="card">
      {/* Image skeleton with shimmer effect */}
      <div
        className="overflow-hidden rounded-t-lg relative wix-image-container bg-gray-200 animate-shimmer"
        style={{ height: '12rem' }}
      />

      <CardHeader className="pb-3">
        {/* Title skeleton with shimmer effect */}
        <div className="h-6 bg-gray-200 rounded animate-shimmer"></div>
      </CardHeader>

      <CardContent className="pb-3 flex-grow">
        {/* Description skeleton with shimmer effect */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-4/6"></div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {/* Button skeleton with shimmer effect */}
        <div className="h-10 bg-gray-200 rounded animate-shimmer w-full"></div>
      </CardFooter>
    </Card>
  );
};

export default ProductSkeleton;
