
import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useCategoryPage } from '@/components/forum/hooks/useCategoryPage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import CategoryHeader from './CategoryHeader';
import EmptyCategory from './EmptyCategory';
import TopicList from './TopicList';
import ForumPagination from '@/components/forum/ForumPagination';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { 
    category, 
    topics, 
    loading, 
    page, 
    totalPages, 
    handlePageChange, 
    handleCreateTopic,
    formatDate
  } = useCategoryPage(slug);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6 text-babybaby-cosmic">Forum des Parents</h1>
            <p className="text-lg mb-8">Connectez-vous pour accéder au forum et partager avec d'autres parents.</p>
            <Button onClick={() => navigate('/auth')} size="lg">
              Se connecter
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babybaby-cosmic"></div>
            </div>
          ) : (
            <>
              <CategoryHeader 
                category={category} 
                handleCreateTopic={handleCreateTopic} 
              />

              <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    className="pl-10"
                    placeholder="Rechercher dans les discussions..."
                  />
                </div>
                <Button onClick={() => navigate('/forum/recent')} variant="ghost">
                  Discussions récentes
                </Button>
              </div>

              {topics.length === 0 ? (
                <EmptyCategory handleCreateTopic={handleCreateTopic} />
              ) : (
                <TopicList 
                  topics={topics} 
                  category={category} 
                  formatDate={formatDate} 
                />
              )}

              {totalPages > 1 && (
                <div className="mt-8">
                  <ForumPagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
