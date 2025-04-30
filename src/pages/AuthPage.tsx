
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AuthForm from '@/components/auth/AuthForm';
import P5Canvas from '@/components/P5Canvas';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const AuthPage = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [processingToken, setProcessingToken] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer le chemin précédent si disponible
  const from = location.state?.from?.pathname || '/dashboard';

  // Vérifier si la page comporte des paramètres liés à la réinitialisation de mot de passe
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const type = searchParams.get('type');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Traiter les erreurs explicites dans l'URL
  useEffect(() => {
    if (error) {
      setTokenError(`${error}: ${errorDescription || 'Une erreur s\'est produite'}`);
      toast({
        title: "Erreur d'authentification",
        description: errorDescription || "Une erreur s'est produite lors de l'authentification",
        variant: "destructive",
      });
    }
  }, [error, errorDescription]);

  // Traiter les tokens de l'URL
  useEffect(() => {
    if ((accessToken && refreshToken) || type === 'recovery') {
      console.log("Tokens détectés dans l'URL ou réinitialisation de mot de passe, traitement en cours...");
      setProcessingToken(true);
      
      const processTokens = async () => {
        try {
          if (type === 'recovery') {
            // Pour la réinitialisation de mot de passe, nous redirigerons vers une page spécifique
            // en attendant que l'implémentation soit faite
            toast({
              title: "Réinitialisation du mot de passe",
              description: "Veuillez définir votre nouveau mot de passe",
            });
            // À implémenter: redirection vers une page de réinitialisation
          } else if (accessToken && refreshToken) {
            // Traiter la session à partir des tokens
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) {
              throw error;
            } else {
              console.log("Session établie avec succès:", data);
              navigate(from);
              toast({
                title: "Authentification réussie",
                description: "Vous êtes maintenant connecté",
              });
            }
          }
        } catch (error: any) {
          console.error("Erreur lors du traitement des tokens:", error);
          setTokenError(error.message);
          toast({
            title: "Erreur d'authentification",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setProcessingToken(false);
        }
      };
      
      processTokens();
    }
  }, [accessToken, refreshToken, type, navigate, from]);

  // Rediriger si déjà authentifié
  if (!loading && user && !processingToken) {
    console.log("Utilisateur déjà authentifié, redirection vers le tableau de bord");
    return <Navigate to={from} replace />;
  }

  // Afficher un écran de chargement pendant le traitement des tokens
  if (processingToken) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <P5Canvas className="fixed inset-0 -z-10" />
        
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
              <CardTitle className="text-center">Authentification en cours</CardTitle>
              <CardDescription className="text-center">
                Veuillez patienter pendant que nous traitons votre demande...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <Loader2 className="h-12 w-12 animate-spin text-babybaby-cosmic" />
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Afficher une erreur si le traitement des tokens a échoué
  if (tokenError) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <P5Canvas className="fixed inset-0 -z-10" />
        
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
              <CardTitle className="text-center">Erreur d'authentification</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertDescription>{tokenError}</AlertDescription>
              </Alert>
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={() => navigate('/auth')}
                  className="px-4 py-2 bg-babybaby-cosmic text-white rounded-md hover:bg-babybaby-cosmic/90"
                >
                  Retourner à la page de connexion
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <P5Canvas className="fixed inset-0 -z-10" />
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8 text-center text-babybaby-cosmic">
          {from !== '/dashboard' ? 'Connectez-vous pour continuer' : 'Accès au Tableau de Bord'}
        </h1>
        
        <AuthForm />
      </div>

      <Footer />
    </div>
  );
};

export default AuthPage;
