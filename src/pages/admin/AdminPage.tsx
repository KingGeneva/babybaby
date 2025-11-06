
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AdminEbooksTab from './AdminEbooksTab';
import AdminLullabiesTab from './AdminLullabiesTab';
import AdminArticlesTab from './AdminArticlesTab';
import AdminAutoArticlesTab from './AdminAutoArticlesTab';

const AdminPage = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Check if the current user is an admin using has_role function
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      try {
        // Use the has_role function to check admin status
        const { data, error } = await supabase.rpc('has_role' as any, {
          _user_id: user.id,
          _role: 'admin'
        }) as { data: boolean | null, error: any };
          
        if (error) throw error;
        
        setIsAuthorized(data === true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAuthorized(false);
        toast({
          title: 'Erreur',
          description: "Impossible de vérifier les permissions d'administrateur",
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, toast]);

  // Show loading state while checking admin status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-babybaby-cosmic mx-auto"></div>
          <p className="mt-4 text-babybaby-cosmic">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authorized
  if (isAuthorized === false) {
    toast({
      title: 'Accès refusé',
      description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page",
      variant: 'destructive',
    });
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-babybaby-cosmic text-center">
            Interface d'administration
          </h1>

          <Tabs defaultValue="ebooks">
            <TabsList className="w-full mb-8 grid grid-cols-4">
              <TabsTrigger value="ebooks">Ebooks</TabsTrigger>
              <TabsTrigger value="lullabies">Berceuses</TabsTrigger>
              <TabsTrigger value="articles">Manuels</TabsTrigger>
              <TabsTrigger value="auto-articles">Auto IA</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ebooks">
              <AdminEbooksTab />
            </TabsContent>
            
            <TabsContent value="lullabies">
              <AdminLullabiesTab />
            </TabsContent>
            
            <TabsContent value="articles">
              <AdminArticlesTab />
            </TabsContent>

            <TabsContent value="auto-articles">
              <AdminAutoArticlesTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
