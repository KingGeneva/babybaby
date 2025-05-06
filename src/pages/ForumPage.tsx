
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ForumCategory } from '@/components/forum/types';
import { getCategories } from '@/components/forum/forumService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, MessageCircle, Users, Clock, ChevronRight, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import SEOHead from '@/components/common/SEOHead';

const ForumPage = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCategoryClick = (slug: string) => {
    navigate(`/forum/categories/${slug}`);
  };

  const iconMap = {
    'baby': <Users size={24} />,
    'baby-face': <Users size={24} />,
    'rattle': <BookOpen size={24} />,
    'toy-brick': <BookOpen size={24} />,
    'stethoscope': <MessageCircle size={24} />,
    'user': <Users size={24} />
  };

  const getIconForCategory = (iconName: string | null) => {
    if (!iconName || !iconMap[iconName]) {
      return <MessageCircle size={24} />;
    }
    return iconMap[iconName];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <SEOHead 
          title="Forum des Parents | BabyBaby"
          description="Rejoignez notre forum pour échanger avec d'autres parents, poser vos questions et partager vos expériences sur la parentalité, la grossesse et le développement des enfants."
          canonicalUrl="https://babybaby.app/forum"
          keywords={["forum parents", "communauté parents", "questions parentalité", "échanges bébé", "conseils jeunes parents", "entraide parentale"]}
        />
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
      <SEOHead 
        title="Forum des Parents | BabyBaby"
        description="Échangez avec d'autres parents sur notre forum. Discussions par thématiques : grossesse, nouveaux-nés, alimentation, éducation et santé des enfants."
        canonicalUrl="https://babybaby.app/forum"
        keywords={["forum parents", "communauté parents", "questions parentalité", "échanges bébé", "conseils jeunes parents", "entraide parentale"]}
      />
      <NavBar />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3 text-babybaby-cosmic">Forum des Parents</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discutez avec d'autres parents, posez vos questions et partagez vos expériences dans un espace convivial et bienveillant.
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10"
                placeholder="Rechercher dans les catégories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate('/forum/recent')} variant="ghost">
              Discussions récentes
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babybaby-cosmic"></div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredCategories.map(category => (
                <motion.div key={category.id} variants={itemVariants}>
                  <Card 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="w-12 h-12 rounded-full bg-babybaby-cosmic/10 text-babybaby-cosmic flex items-center justify-center">
                        {getIconForCategory(category.icon)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                      </div>
                      <ChevronRight className="text-gray-400" />
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-gray-600 min-h-[40px]">
                        {category.description}
                      </CardDescription>
                      <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          <span>42 discussions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>Dernière: il y a 2h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForumPage;
