
import { lazy } from "react";
import { RouteObject } from "react-router-dom";

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

export const publicRoutes: RouteObject[] = [
  { path: "/", element: <Index /> },
  { path: "/auth", element: <AuthPage /> },
  { path: "/articles", element: <ArticlesPage /> },
  { path: "/articles/:id", element: <ArticleDetailPage /> },
  { path: "/faq", element: <FAQPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/free-offers", element: <FreeOffersPage /> },
  { path: "/ebooks", element: <EbooksPage /> },
  { path: "/ebooks/:id", element: <EbookViewerPage /> },
  { path: "*", element: <NotFound /> }
];
