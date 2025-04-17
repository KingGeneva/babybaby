
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

// Import des articles (à terme, cela viendrait d'une API)
import { articles } from '@/data/articles';

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const articleId = parseInt(id || '0');
  const article = articles.find(a => a.id === articleId);
  
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Article introuvable</h1>
            <p className="mb-6">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button onClick={() => navigate('/articles')}>
              Retourner aux articles
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
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center gap-2"
              onClick={() => navigate('/articles')}
            >
              <ArrowLeft size={16} />
              Retour aux articles
            </Button>
            
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline">{article.category}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {article.date}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-babybaby-cosmic">
                {article.title}
              </h1>
              
              {article.image && (
                <div className="mb-8">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none">
                {/* Contenu de l'article */}
                <p className="text-gray-700 mb-4">
                  {article.excerpt}
                </p>
                
                <p className="text-gray-700 mb-4">
                  Le sommeil est l'un des piliers fondamentaux du développement de votre bébé. Un bon repos favorise non seulement sa croissance physique et cognitive, mais contribue aussi au bien-être de toute la famille. Cependant, de nombreux parents se heurtent à des nuits agitées, des réveils fréquents ou des difficultés d'endormissement. Heureusement, il existe des astuces simples et naturelles pour aider bébé à mieux dormir.
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">5 conseils pratiques pour améliorer le sommeil de votre tout-petit</h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">1. Instaurer une routine du coucher régulière</h3>
                <p className="text-gray-700 mb-4">
                  Les bébés aiment la prévisibilité. Mettre en place une routine calme et rassurante chaque soir (bain tiède, massage, histoire douce ou berceuse) aide à envoyer des signaux clairs à bébé : c'est l'heure de dormir. Une routine stable permet à l'enfant de se sentir en sécurité, ce qui facilite l'endormissement.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">2. Créer un environnement propice au sommeil</h3>
                <p className="text-gray-700 mb-4">
                  Une chambre paisible, légèrement fraîche (environ 20°C), sombre et silencieuse constitue un cadre idéal pour le sommeil. Vous pouvez aussi utiliser un bruit blanc léger pour masquer les bruits ambiants qui pourraient réveiller bébé.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">3. Observer les signes de fatigue</h3>
                <p className="text-gray-700 mb-4">
                  Il est important de reconnaître les premiers signes de fatigue : frottement des yeux, bâillements, agitation. Si vous attendez trop longtemps, bébé peut devenir trop fatigué et avoir plus de mal à s'endormir. Respecter son rythme naturel aide à instaurer un sommeil plus paisible.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">4. Encourager l'endormissement autonome</h3>
                <p className="text-gray-700 mb-4">
                  Apprenez progressivement à bébé à s'endormir seul. Cela peut passer par le fait de le déposer dans son lit lorsqu'il est encore éveillé mais somnolent. Cela l'aide à associer son lit à un lieu de repos et à développer sa capacité à se rendormir sans assistance.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">5. Maintenir une certaine régularité</h3>
                <p className="text-gray-700 mb-4">
                  Les horaires de coucher et de sieste réguliers aident à réguler l'horloge biologique de bébé. Même les fins de semaine, essayez de garder une routine stable pour ne pas perturber son rythme.
                </p>
                
                <div className="bg-babybaby-lightblue/30 p-6 rounded-lg mt-8 mb-8">
                  <h3 className="text-xl font-semibold mb-3">Pour aller plus loin</h3>
                  <p className="mb-4">
                    Découvrez des techniques douces et efficaces pour améliorer le sommeil de votre bébé, téléchargez notre guide complet "Sommeil du bébé" gratuitement.
                  </p>
                  <Button className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
                    Télécharger notre guide gratuit
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
