
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
const ContactPage = lazy(() => import("../pages/ContactPage"));
const AffiliateRedirectPage = lazy(() => import("../pages/AffiliateRedirectPage"));

const ShopPage = lazy(() => import("../pages/ShopPage"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));
const BabyProductsReportPage = lazy(() => import("../pages/BabyProductsReportPage"));
const FavoritesPage = lazy(() => import("../pages/FavoritesPage"));
const ContestReglementPage = lazy(() => import("../pages/ContestReglementPage"));
const CostCalculatorQuebecPage = lazy(() => import("../pages/CostCalculatorQuebecPage"));

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
  // ArticleDetailPage gère déjà sa mise en page (NavBar/Footer) : on évite le double layout
  { path: "/articles/:id", element: <ArticleDetailPage /> },
  { path: "/faq", element: wrapWithLayout(FAQPage, 'fade') },
  { path: "/about", element: wrapWithLayout(AboutPage, 'fade') },
  { path: "/free-offers", element: wrapWithLayout(FreeOffersPage, 'slide') },
  { path: "/ebooks", element: wrapWithLayout(EbooksPage, 'slide') },
  { path: "/ebooks/:id", element: wrapWithLayout(EbookViewerPage, 'fade') },
  { path: "/contests", element: wrapWithLayout(ContestsPage, 'slide') },
  { path: "/contests/reglement", element: wrapWithLayout(ContestReglementPage, 'fade') },
  { path: "/concours", element: wrapWithLayout(ContestsPage, 'slide') },
  { path: "/concours/reglement", element: wrapWithLayout(ContestReglementPage, 'fade') },
  { path: "/calculateur-cout-bebe-quebec", element: wrapWithLayout(CostCalculatorQuebecPage, 'fade') },
  { path: "/contact", element: wrapWithLayout(ContactPage, 'fade') },
  { path: "/boutique", element: wrapWithLayout(ShopPage, 'slide') },
  { path: "/boutique/:handle", element: wrapWithLayout(ProductDetailPage, 'fade') },
  { path: "/meilleurs-produits-bebe-2026", element: wrapWithLayout(BabyProductsReportPage, 'fade') },
  { path: "/favoris", element: <FavoritesPage /> },
  // Couche d'affiliation : hors MainLayout, jamais indexée (cf. robots.txt + meta noindex).
  { path: "/go/:productId", element: <AffiliateRedirectPage /> },
  { path: "*", element: wrapWithLayout(NotFound, 'scale') }
];
