
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Initialisation du contexte d'authentification");
    
    // Écouter les changements d'état d'authentification en PREMIER
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Changement d'état d'authentification:", event, session?.user?.email);
        
        // Mettre à jour l'état en fonction de l'événement
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Afficher des notifications pour certains événements
        if (event === 'SIGNED_IN') {
          toast({
            title: "Authentification réussie",
            description: `Connecté en tant que ${session?.user?.email}`,
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Déconnexion réussie",
            description: "Vous avez été déconnecté avec succès",
          });
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Réinitialisation du mot de passe",
            description: "Veuillez définir votre nouveau mot de passe",
          });
        } else if (event === 'USER_UPDATED') {
          toast({
            title: "Profil mis à jour",
            description: "Vos informations ont été mises à jour",
          });
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Token rafraîchi avec succès");
        }
      }
    );

    // ENSUITE vérifier s'il existe déjà une session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session existante:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log("Nettoyage du listener d'authentification");
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      console.log("Déconnexion effectuée");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur s'est produite lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  // Préparer les valeurs à partager via le contexte
  const contextValue: AuthContextType = {
    session,
    user,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
