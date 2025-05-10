
import { createLazyComponent } from './LazyLoader';

// Priority 1 - Core components loaded immediately
export const Dashboard = createLazyComponent(() => import('@/components/dashboard/Dashboard'));
export const TestimonialsCarousel = createLazyComponent(() => import('@/components/testimonials/TestimonialsCarousel'));
export const ArticleSection = createLazyComponent(() => import('@/components/articles/ArticleSection'));
export const Footer = createLazyComponent(() => import('@/components/Footer'));
