
import { createLazyComponent } from './LazyLoader';

// Priority 4/5 - Lowest priority components loaded last
export const ContactSection = createLazyComponent(
  () => import('@/components/ContactSection'),
  1000
);

export const NewsletterForm = createLazyComponent(
  () => import('@/components/NewsletterForm'),
  1200
);
