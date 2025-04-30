
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export const ArticleCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden h-full">
      <Skeleton className="h-48 w-full" />
      <div className="p-6">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-7 w-full mt-3 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </Card>
  );
};

export const ArticleListItemSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4">
          <Skeleton className="h-48 md:h-full w-full" />
        </div>
        <div className="md:w-3/4 p-6">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-4/5 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div className="flex justify-end">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export const ArticleDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-8 w-full mb-6" />
      </div>
      
      {/* Image */}
      <Skeleton className="h-64 w-full mb-8 rounded-lg" />
      
      {/* Content */}
      <div className="space-y-4 mb-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-9/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-8/12" />
      </div>
      
      {/* Actions */}
      <div className="flex justify-between mb-8">
        <Skeleton className="h-10 w-28 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      
      {/* Promotion */}
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
};
