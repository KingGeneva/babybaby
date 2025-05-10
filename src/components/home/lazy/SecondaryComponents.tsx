
import { createLazyComponent } from './LazyLoader';

// Priority 2 - Secondary components loaded with slight delay
export const EbooksSection = createLazyComponent(
  () => import('@/components/ebooks/EbooksSection'),
  300
);

export const PartnersCarousel = createLazyComponent(
  () => import('@/components/partners/PartnersCarousel'),
  500
);

export const CoursesSection = createLazyComponent(
  () => import('@/components/courses/CoursesSection'),
  600
);
