
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AuthForm from '@/components/auth/AuthForm';
import P5Canvas from '@/components/P5Canvas';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Vérifier si l'URL contient un token d'authentification (après redirection)
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      console.log("Tokens détectés dans l'URL, traitement en cours...");
      
      // Traiter la session à partir des tokens
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ data, error }) => {
        if (error) {
          console.error("Erreur lors de la définition de la session:", error);
          toast({
            title: "Erreur d'authentification",
            description: error.message,
            variant: "destructive",
          });
        } else {
          console.log("Session établie avec succès:", data);
          navigate('/parental-dashboard');
          toast({
            title: "Authentification réussie",
            description: "Vous êtes maintenant connecté",
          });
        }
      });
    }
  }, [navigate]);

  // Rediriger si déjà authentifié
  if (!loading && user) {
    console.log("Utilisateur déjà authentifié, redirection vers le tableau de bord");
    return <Navigate to="/parental-dashboard" replace />;
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <P5Canvas className="fixed inset-0 -z-10" />
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8 text-center text-babybaby-cosmic">
          Accès au Tableau de Bord
        </h1>
        
        <AuthForm />
      </div>

      <Footer />
    </div>
  );
};

export default AuthPage;
