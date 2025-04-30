import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Dashboard from '@/components/dashboard/Dashboard';
import Footer from '@/components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { childId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hasProfiles, setHasProfiles] = useState<boolean | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // Si l'utilisateur est connecté mais aucun enfant n'est sélectionné
    if (user && !childId) {
      // Vérifier si l'utilisateur a des profils d'enfants
      const checkProfiles = async () => {
        try {
          const { data, error } = await supabase
            .from('child_profiles')
            .select('id')
            .limit(1);

          if (error) throw error;

          // Si l'utilisateur a au moins un profil, rediriger vers le tableau de bord parental
          // pour sélectionner un enfant
          if (data && data.length > 0) {
            setHasProfiles(true);
            navigate('/parental-dashboard');
          } else {
            setHasProfiles(false);
          }
        } catch (error) {
          console.error("Erreur lors de la vérification des profils:", error);
          setHasProfiles(false);
        }
      };

      checkProfiles();
    } else {
      setHasProfiles(true);
    }
  }, [user, loading, childId, navigate]);

  // Afficher un état de chargement pendant la vérification
  if (loading || hasProfiles === null) {
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

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="pt-24">
        <Dashboard childId={childId} showDevelopmentSection={true} />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
