
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import DashboardPage from "./pages/DashboardPage";
import ToolsPage from "./pages/ToolsPage";
import CommunityPage from "./pages/CommunityPage";
import AuthPage from "./pages/AuthPage";
import ParentalDashboard from "./pages/ParentalDashboard";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import EbooksPage from "./pages/EbooksPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import FAQPage from "./pages/FAQPage";
import AboutPage from "./pages/AboutPage";
import ChatbotButton from "./components/chatbot/ChatbotButton";
import MedicalDashboardPage from "./pages/MedicalDashboardPage";
import MedicalAppointmentPage from "./pages/MedicalAppointmentPage";
import QuizPage from "./pages/QuizPage";
import QuizDetailPage from "./pages/QuizDetailPage";
import QuizResultsPage from "./pages/QuizResultsPage";
import AdminPage from './pages/admin/AdminPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/:childId" element={<DashboardPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:id" element={<ArticleDetailPage />} />
              <Route path="/ebooks" element={<EbooksPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
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
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/quiz/:quizId" element={<QuizDetailPage />} />
              <Route path="/quiz/:quizId/results" element={<QuizResultsPage />} />
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
            
            <ChatbotButton />
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
