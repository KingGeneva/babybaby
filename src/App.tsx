
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import CacheManager from './components/common/CacheManager';
import ChatbotButton from "./components/chatbot/ChatbotButton";
import FloatingIncentive from "./components/subscription/FloatingIncentive";

// Version simplifiée
const APP_VERSION = '1.1';

// Pages avec chargement paresseux groupées par catégorie
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

// Pages du contenu
const ArticlesPage = lazy(() => import("./pages/ArticlesPage"));
const ArticleDetailPage = lazy(() => import("./pages/ArticleDetailPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const FreeOffersPage = lazy(() => import("./pages/FreeOffersPage"));

// Pages nécessitant authentification
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const EbooksPage = lazy(() => import("./pages/EbooksPage"));
const ParentalDashboard = lazy(() => import("./pages/ParentalDashboard"));
const MedicalDashboardPage = lazy(() => import("./pages/MedicalDashboardPage"));
const MedicalAppointmentPage = lazy(() => import("./pages/MedicalAppointmentPage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const QuizDetailPage = lazy(() => import("./pages/QuizDetailPage"));
const QuizResultsPage = lazy(() => import("./pages/QuizResultsPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));

// Composant pour les routes protégées
const ProtectedRoute = lazy(() => import("./components/auth/ProtectedRoute"));

// Configuration optimisée de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      gcTime: 300000,
    },
  },
});

// Fallback simplifié pour le chargement paresseux
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin h-8 w-8 border-4 border-babybaby-cosmic border-t-transparent rounded-full"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CacheManager version={APP_VERSION} />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/articles" element={<ArticlesPage />} />
                <Route path="/articles/:id" element={<ArticleDetailPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/free-offers" element={<FreeOffersPage />} />
                
                {/* Routes protégées */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/:childId" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tools" 
                  element={
                    <ProtectedRoute>
                      <ToolsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/community" 
                  element={
                    <ProtectedRoute>
                      <CommunityPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ebooks" 
                  element={
                    <ProtectedRoute>
                      <EbooksPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/parental-dashboard" 
                  element={
                    <ProtectedRoute>
                      <ParentalDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/medical/dashboard/:childId" 
                  element={
                    <ProtectedRoute>
                      <MedicalDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/medical/appointment/new" 
                  element={
                    <ProtectedRoute>
                      <MedicalAppointmentPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/medical/appointment/:id" 
                  element={
                    <ProtectedRoute>
                      <MedicalAppointmentPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/quiz" 
                  element={
                    <ProtectedRoute>
                      <QuizPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/quiz/:quizId" 
                  element={
                    <ProtectedRoute>
                      <QuizDetailPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/quiz/:quizId/results" 
                  element={
                    <ProtectedRoute>
                      <QuizResultsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/courses" 
                  element={
                    <ProtectedRoute>
                      <CoursesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/courses/:courseId" 
                  element={
                    <ProtectedRoute>
                      <CourseDetailPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            
            <ChatbotButton />
            <FloatingIncentive scrollThreshold={400} />
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
