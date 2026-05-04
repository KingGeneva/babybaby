
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Lazy loaded learning components
const CoursesPage = lazy(() => import("../pages/CoursesPage"));
const CourseDetailPage = lazy(() => import("../pages/CourseDetailPage"));

export const learningRoutes: RouteObject[] = [
  {
    path: "/courses",
    element: <ProtectedRoute><CoursesPage /></ProtectedRoute>
  },
  {
    path: "/courses/:courseId",
    element: <ProtectedRoute><CourseDetailPage /></ProtectedRoute>
  }
];
