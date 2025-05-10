
import React, { Suspense, lazy, ComponentType } from 'react';

// Reusable loading component
export const SectionLoader = () => (
  <div className="py-6 flex justify-center items-center">
    <div className="animate-pulse w-full max-w-2xl h-16 bg-gray-100 rounded-lg"></div>
  </div>
);

// Type for the lazy loading function
export type LazyComponentType = Promise<{ default: ComponentType<any> }>;

// Helper function to create lazily loaded components with variable delay
export function createLazyComponent(
  importFn: () => Promise<{ default: ComponentType<any> }>,
  delayMs: number = 0
): React.LazyExoticComponent<ComponentType<any>> {
  if (delayMs <= 0) {
    return lazy(importFn);
  }
  
  return lazy((): LazyComponentType => {
    return new Promise(resolve => {
      setTimeout(() => {
        importFn().then(module => {
          resolve({ default: module.default });
        });
      }, delayMs);
    });
  });
}

// Wrapper component for lazy-loaded sections
export function LazySection({
  Component,
  fallback = <SectionLoader />,
  ...props
}: {
  Component: React.ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}
