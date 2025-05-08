
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Lazy loaded admin component
const AdminPage = lazy(() => import("../pages/admin/AdminPage"));

export const adminRoutes: RouteObject[] = [
  { 
    path: "/admin", 
    element: <ProtectedRoute><AdminPage /></ProtectedRoute> 
  }
];
