
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import AdminEbooksTab from './AdminEbooksTab';
import AdminLullabiesTab from './AdminLullabiesTab';
import AdminArticlesTab from './AdminArticlesTab';
import AdminCMSTab from './AdminCMSTab';

const AdminPage = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useUserRole();

  // Show loading state while checking admin status
  if (loading) {
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
  if (!user || !isAdmin) {
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

          <Tabs defaultValue="cms">
            <TabsList className="w-full mb-8">
              <TabsTrigger value="cms" className="flex-1">CMS Articles</TabsTrigger>
              <TabsTrigger value="ebooks" className="flex-1">Ebooks</TabsTrigger>
              <TabsTrigger value="lullabies" className="flex-1">Berceuses</TabsTrigger>
              <TabsTrigger value="articles" className="flex-1">Articles Statiques</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cms">
              <AdminCMSTab />
            </TabsContent>
            
            <TabsContent value="ebooks">
              <AdminEbooksTab />
            </TabsContent>
            
            <TabsContent value="lullabies">
              <AdminLullabiesTab />
            </TabsContent>
            
            <TabsContent value="articles">
              <AdminArticlesTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
