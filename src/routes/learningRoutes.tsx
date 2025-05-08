
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Lazy loaded learning components
const QuizPage = lazy(() => import("../pages/QuizPage"));
const QuizDetailPage = lazy(() => import("../pages/QuizDetailPage"));
const QuizResultsPage = lazy(() => import("../pages/QuizResultsPage"));
const CoursesPage = lazy(() => import("../pages/CoursesPage"));
const CourseDetailPage = lazy(() => import("../pages/CourseDetailPage"));

export const learningRoutes: RouteObject[] = [
  { 
    path: "/quiz", 
    element: <ProtectedRoute><QuizPage /></ProtectedRoute> 
  },
  { 
    path: "/quiz/:quizId", 
    element: <ProtectedRoute><QuizDetailPage /></ProtectedRoute> 
  },
  { 
    path: "/quiz/:quizId/results", 
    element: <ProtectedRoute><QuizResultsPage /></ProtectedRoute> 
  },
  { 
    path: "/courses", 
    element: <ProtectedRoute><CoursesPage /></ProtectedRoute> 
  },
  { 
    path: "/courses/:courseId", 
    element: <ProtectedRoute><CourseDetailPage /></ProtectedRoute> 
  }
];
