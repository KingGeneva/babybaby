
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Lazy loaded forum components
const ForumPage = lazy(() => import("../pages/ForumPage"));
const ForumCategoryPage = lazy(() => import("../pages/ForumCategoryPage"));
const ForumTopicPage = lazy(() => import("../pages/ForumTopicPage"));
const NewTopicPage = lazy(() => import("../pages/NewTopicPage"));

export const forumRoutes: RouteObject[] = [
  { 
    path: "/forum", 
    element: <ProtectedRoute><ForumPage /></ProtectedRoute> 
  },
  { 
    path: "/forum/categories/:slug", 
    element: <ProtectedRoute><ForumCategoryPage /></ProtectedRoute> 
  },
  { 
    path: "/forum/topics/:topicId", 
    element: <ProtectedRoute><ForumTopicPage /></ProtectedRoute> 
  },
  { 
    path: "/forum/new-topic/:categoryId", 
    element: <ProtectedRoute><NewTopicPage /></ProtectedRoute> 
  },
  { 
    path: "/forum/new-topic", 
    element: <ProtectedRoute><NewTopicPage /></ProtectedRoute> 
  }
];
