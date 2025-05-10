
import { createLazyComponent } from './LazyLoader';

// Priority 3 - Components loaded after primary content
export const ProductsSection = createLazyComponent(
  () => import('@/components/products/ProductsSection'),
  700
);

export const ToolsSection = createLazyComponent(
  () => import('@/components/tools/ToolsSection'),
  900
);
