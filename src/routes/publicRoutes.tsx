
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import PageTransition from "@/components/layout/PageTransition";

// Lazy loaded page components
const Index = lazy(() => import("../pages/Index"));
const NotFound = lazy(() => import("../pages/NotFound"));
const AuthPage = lazy(() => import("../pages/AuthPage"));
const ArticlesPage = lazy(() => import("../pages/ArticlesPage"));
const ArticleDetailPage = lazy(() => import("../pages/ArticleDetailPage"));
const FAQPage = lazy(() => import("../pages/FAQPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const FreeOffersPage = lazy(() => import("../pages/FreeOffersPage"));
const EbooksPage = lazy(() => import("../pages/EbooksPage"));
const EbookViewerPage = lazy(() => import("../pages/EbookViewerPage"));
const ContestsPage = lazy(() => import("../pages/ContestsPage"));
const StrollerComparisonPage = lazy(() => import("../pages/StrollerComparisonPage"));
const BoutiquePage = lazy(() => import("../pages/BoutiquePage"));

// Wrap page components with transition effects and layout
const wrapWithLayout = (Component: React.ComponentType, variant: 'fade' | 'slide' | 'scale' = 'fade') => {
  return (
    <MainLayout>
      <PageTransition variant={variant}>
        <Component />
      </PageTransition>
    </MainLayout>
  );
};

export const publicRoutes: RouteObject[] = [
  { path: "/", element: <Index /> }, // Index already has MainLayout
  { path: "/auth", element: <AuthPage /> }, // Authentication page typically uses a separate layout
  { path: "/articles", element: wrapWithLayout(ArticlesPage, 'slide') },
  { path: "/articles/:id", element: wrapWithLayout(ArticleDetailPage, 'fade') },
  { path: "/articles/meilleures-poussettes-2025", element: wrapWithLayout(StrollerComparisonPage, 'fade') },
  { path: "/faq", element: wrapWithLayout(FAQPage, 'fade') },
  { path: "/about", element: wrapWithLayout(AboutPage, 'fade') },
  { path: "/free-offers", element: wrapWithLayout(FreeOffersPage, 'slide') },
  { path: "/ebooks", element: wrapWithLayout(EbooksPage, 'slide') },
  { path: "/ebooks/:id", element: wrapWithLayout(EbookViewerPage, 'fade') },
  { path: "/contests", element: wrapWithLayout(ContestsPage, 'slide') },
  { path: "/boutique", element: wrapWithLayout(BoutiquePage, 'slide') },
  { path: "*", element: wrapWithLayout(NotFound, 'scale') }
];
