
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Lazy loaded dashboard components
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const ToolsPage = lazy(() => import("../pages/ToolsPage"));
const CommunityPage = lazy(() => import("../pages/CommunityPage"));
const ParentalDashboard = lazy(() => import("../pages/ParentalDashboard"));
const MedicalDashboardPage = lazy(() => import("../pages/MedicalDashboardPage"));
const MedicalAppointmentPage = lazy(() => import("../pages/MedicalAppointmentPage"));

export const dashboardRoutes: RouteObject[] = [
  { 
    path: "/dashboard", 
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute> 
  },
  { 
    path: "/dashboard/:childId", 
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute> 
  },
  { 
    path: "/tools", 
    element: <ProtectedRoute><ToolsPage /></ProtectedRoute> 
  },
  { 
    path: "/community", 
    element: <ProtectedRoute><CommunityPage /></ProtectedRoute> 
  },
  { 
    path: "/parental-dashboard", 
    element: <ProtectedRoute><ParentalDashboard /></ProtectedRoute> 
  },
  { 
    path: "/medical/dashboard/:childId", 
    element: <ProtectedRoute><MedicalDashboardPage /></ProtectedRoute> 
  },
  { 
    path: "/medical/appointment/new", 
    element: <ProtectedRoute><MedicalAppointmentPage /></ProtectedRoute> 
  },
  { 
    path: "/medical/appointment/:id", 
    element: <ProtectedRoute><MedicalAppointmentPage /></ProtectedRoute> 
  }
];
