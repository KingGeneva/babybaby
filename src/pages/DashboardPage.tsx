
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Dashboard from '@/components/dashboard/Dashboard';
import Footer from '@/components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SEOHead from '@/components/common/SEOHead';
import P5Canvas from '@/components/P5Canvas';

const DashboardPage = () => {
  const { childId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page d'authentification si l'utilisateur n'est pas connecté
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  // Afficher un état de chargement pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="pt-24 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babybaby-cosmic"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, ne rien rendre (la redirection se fera via l'effet)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Tableau de bord | BabyBaby" 
        description="Suivez la croissance et le développement de votre enfant."
        canonicalUrl="https://babybaby.app/dashboard"
      />
      <NavBar />
      <P5Canvas className="fixed inset-0 -z-10" />
      <div className="pt-24">
        <Dashboard childId={childId || 'demo'} showDevelopmentSection={true} />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
