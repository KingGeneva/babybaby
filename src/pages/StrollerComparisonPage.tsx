
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, PauseCircle, Volume2 } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import HowToStructuredData from '@/components/seo/HowToStructuredData';

const StrollerComparisonPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio("/audio/poussettes-podcast.mp3"));
  
  const togglePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Clean up audio on component unmount
  React.useEffect(() => {
    audio.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.pause();
    };
  }, [audio]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Top 5 des Meilleures Poussettes en 2025 | Comparatif Complet" 
        description="Découvrez notre comparatif complet des 5 meilleures poussettes de 2025 : performances, prix, avantages et inconvénients pour choisir la poussette idéale pour votre bébé."
        canonicalUrl="https://babybaby.app/articles/meilleures-poussettes-2025"
        ogType="article"
        keywords={["poussette", "poussette bébé", "comparatif poussettes", "meilleures poussettes 2025", "poussette légère", "poussette tout terrain"]}
        articleData={{
          publishedTime: "2025-05-11T10:00:00Z",
          modifiedTime: "2025-05-11T10:00:00Z",
          author: "BabyBaby",
          tags: ["poussette", "équipement bébé", "guide achat", "comparatif"]
        }}
      />
      
      <HowToStructuredData
        name="Comment choisir la meilleure poussette pour votre bébé"
        description="Guide complet pour choisir la poussette idéale selon vos besoins, votre style de vie et votre budget."
        image="/lovable-uploads/cc398d50-38b3-477d-a1a5-9ff5dd303ae8.png"
        totalTime="PT10M"
        steps={[
          {
            name: "Identifiez vos besoins",
            text: "Déterminez où vous utiliserez la poussette (ville, campagne, voyages) et si vous avez besoin d'un modèle compact ou tout-terrain."
          },
          {
            name: "Définissez votre budget",
            text: "Les prix des poussettes varient considérablement, de 129$ à plus de 999$. Décidez combien vous êtes prêts à investir."
          },
          {
            name: "Considérez l'âge de votre bébé",
            text: "Certaines poussettes sont adaptées dès la naissance, d'autres sont plus appropriées pour les bébés plus âgés."
          },
          {
            name: "Examinez les caractéristiques",
            text: "Vérifiez la facilité de pliage, le poids, la maniabilité et les options de rangement."
          },
          {
            name: "Choisissez parmi les modèles recommandés",
            text: "Basez-vous sur notre sélection des 5 meilleures poussettes pour faire un choix éclairé."
          }
        ]}
        pageUrl="https://babybaby.app/articles/meilleures-poussettes-2025"
      />

      <NavBar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-6 flex justify-center">
            <img 
              src="/lovable-uploads/cc398d50-38b3-477d-a1a5-9ff5dd303ae8.png" 
              alt="Top 5 des Meilleures Poussettes en 2025" 
              className="w-full max-w-3xl rounded-lg shadow-lg" 
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-800">
            Top 5 des Meilleures Poussettes en 2025 : Comparatif Complet et Recommandations
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <Card className="bg-gradient-to-r from-babybaby-cosmic/10 to-purple-100 mb-8">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-shrink-0">
                  <Volume2 className="h-10 w-10 text-babybaby-cosmic" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium mb-1">Podcast BabyBaby</h3>
                  <p className="text-sm text-gray-600 mb-2">Écoutez notre segment audio dédié à ce sujet</p>
                  <Button 
                    onClick={togglePlayPause}
                    className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 flex items-center gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <PauseCircle className="h-5 w-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-5 w-5" />
                        Écouter le segment du podcast
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="prose max-w-none">
              <p className="mb-6 text-lg">
                Choisir la meilleure poussette pour bébé en 2025 est une étape cruciale pour tous les parents. Avec une multitude de modèles disponibles sur le marché, il peut être difficile de s'y retrouver. Ce guide comparatif présente les meilleures poussettes 2025, selon les critères essentiels : sécurité, confort, prix, maniabilité, évolutivité et qualité de fabrication.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-babybaby-cosmic">Pourquoi bien choisir sa poussette en 2025 ?</h2>
              <p>
                La poussette est l'un des investissements les plus importants pour les jeunes parents. Que vous soyez citadin, adepte de balades nature ou parent de jumeaux, il existe une poussette adaptée à votre style de vie. Les deux sources citées soulignent que le choix dépend avant tout de vos besoins, de l'âge de votre bébé, et de votre budget.
              </p>
              
              <h2 className="text-2xl font-semibold mt-10 mb-6 text-center text-babybaby-cosmic">Les 5 Meilleures Poussettes 2025</h2>
              
              <div className="mb-10 border-l-4 border-babybaby-cosmic pl-6 py-2">
                <h3 className="text-xl font-semibold mb-2">1. Safety 1st Raya Travel System – Confort & Polyvalence</h3>
                <p className="font-medium text-gray-700">Prix : 499,97 $</p>
                <p className="mb-3">Parfaite pour un usage quotidien, cette poussette tout-en-un est livrée avec un siège d'auto et un mode landau.</p>
                <p className="font-medium mb-1">Atouts :</p>
                <ul className="list-disc ml-6 mb-3">
                  <li>Suspension intégrée pour un confort optimal</li>
                  <li>Rembourrage en mousse mémoire</li>
                  <li>Fenêtre Peek-a-Boo pour garder un œil sur bébé</li>
                  <li>Facile à plier et à transporter</li>
                  <li>Très bon rapport qualité-prix</li>
                </ul>
                <p className="mb-2"><strong>Idéal pour :</strong> les parents à la recherche d'un système de voyage complet et fiable.</p>
                <Link to="https://amzn.to/3Strvm6" className="text-blue-600 hover:text-blue-800 font-medium">
                  Voir le produit →
                </Link>
              </div>
              
              <div className="mb-10 border-l-4 border-babybaby-cosmic pl-6 py-2">
                <h3 className="text-xl font-semibold mb-2">2. Summer Infant 3Dlite – Ultra légère & Pratique</h3>
                <p className="font-medium text-gray-700">Prix : 129,97 $</p>
                <p className="mb-3">Un choix judicieux pour les petits budgets et les voyageurs. Cette poussette parapluie légère (13 lb) se plie rapidement et se transporte aisément.</p>
                <p className="font-medium mb-1">Avantages :</p>
                <ul className="list-disc ml-6 mb-3">
                  <li>Compacte et simple à utiliser</li>
                  <li>Repose-pieds réglable</li>
                  <li>Harnais à 5 points</li>
                  <li>Parfait pour les escapades ou les transports en commun</li>
                </ul>
                <p className="mb-2"><strong>Idéal pour :</strong> les sorties occasionnelles ou les familles qui bougent souvent.</p>
                <Link to="https://amzn.to/4kfbeNH" className="text-blue-600 hover:text-blue-800 font-medium">
                  Voir le produit →
                </Link>
              </div>
              
              <div className="mb-10 border-l-4 border-babybaby-cosmic pl-6 py-2">
                <h3 className="text-xl font-semibold mb-2">3. Maxi Cosi Zelia Max 5-en-1 – Polyvalence & Style</h3>
                <p className="font-medium text-gray-700">Prix moyen : autour de 500 $</p>
                <p className="mb-3">Cette poussette évolutive propose 5 modes d'utilisation, avec nacelle intégrée et compatibilité siège d'auto.</p>
                <p className="font-medium mb-1">Points forts :</p>
                <ul className="list-disc ml-6 mb-3">
                  <li>Design moderne et haut de gamme</li>
                  <li>Grande capacité de rangement sous la poussette</li>
                  <li>Siège réversible (face parent ou face monde)</li>
                  <li>Pliage simple d'une main</li>
                </ul>
                <p className="mb-2"><strong>Idéal pour :</strong> les parents recherchant une solution complète et esthétique.</p>
                <Link to="https://amzn.to/42Wne0U" className="text-blue-600 hover:text-blue-800 font-medium">
                  Voir le produit →
                </Link>
              </div>
              
              <div className="mb-10 border-l-4 border-babybaby-cosmic pl-6 py-2">
                <h3 className="text-xl font-semibold mb-2">4. Thule Urban Glide 2 Double – Haut de Gamme pour Famille Active</h3>
                <p className="font-medium text-gray-700">Prix : 999,95 $</p>
                <p className="mb-3">Une poussette double premium, parfaite pour les familles avec deux jeunes enfants ou des jumeaux. Adaptée à la marche rapide et au jogging.</p>
                <p className="font-medium mb-1">Caractéristiques clés :</p>
                <ul className="list-disc ml-6 mb-3">
                  <li>Grandes roues avec suspension intégrée</li>
                  <li>Design aérodynamique et solide</li>
                  <li>Frein à main pratique pour la sécurité</li>
                  <li>Repliable d'une main malgré sa taille</li>
                </ul>
                <p className="mb-2"><strong>Idéal pour :</strong> les familles sportives ou les sorties tout-terrain.</p>
                <Link to="https://amzn.to/44yJWx9" className="text-blue-600 hover:text-blue-800 font-medium">
                  Voir le produit →
                </Link>
              </div>
              
              <div className="mb-10 border-l-4 border-babybaby-cosmic pl-6 py-2">
                <h3 className="text-xl font-semibold mb-2">5. Evenflo Victory Plus Jogger Travel System – Tout-Terrain & Abordable</h3>
                <p className="font-medium text-gray-700">Prix : 399,97 $</p>
                <p className="mb-3">Une poussette robuste et polyvalente conçue pour le jogging ou les balades sur terrains irréguliers. Livrée avec un siège d'auto pour bébé.</p>
                <p className="font-medium mb-1">Forces :</p>
                <ul className="list-disc ml-6 mb-3">
                  <li>Grandes roues pneumatiques durables</li>
                  <li>Confort élevé pour bébé</li>
                  <li>Facile à plier et à ranger</li>
                  <li>Excellente maniabilité</li>
                </ul>
                <p className="mb-2"><strong>Idéal pour :</strong> les parents actifs à la recherche d'un système abordable et performant.</p>
                <Link to="https://amzn.to/4dclNi3" className="text-blue-600 hover:text-blue-800 font-medium">
                  Voir le produit →
                </Link>
              </div>
              
              <Separator className="my-8" />
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-babybaby-cosmic">Ce que dit Protégez-Vous.ca</h2>
              <p className="mb-6">
                Dans un test indépendant réalisé en janvier 2025, Protégez-Vous.ca a évalué 25 modèles de poussettes parmi les marques les plus populaires : Baby Jogger, Graco, Maxi-Cosi, Peg Perego, Thule, UPPAbaby… Le site met l'accent sur des critères objectifs : fiabilité, réparabilité, sécurité, et performance. Un excellent complément à notre sélection.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-babybaby-cosmic">Conseils pour bien choisir votre poussette</h2>
              <p className="mb-3">Avant d'acheter, posez-vous ces questions :</p>
              <ul className="list-disc ml-6 mb-6">
                <li>Où vais-je utiliser la poussette ? (ville, campagne, voyages)</li>
                <li>Dois-je l'utiliser dès la naissance ?</li>
                <li>Ai-je besoin d'un modèle compact ou tout-terrain ?</li>
                <li>Est-ce que le pliage et le rangement sont faciles ?</li>
                <li>Mon budget me permet-il d'opter pour un modèle évolutif ?</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-babybaby-cosmic">Conclusion</h2>
              <p className="mb-6">
                Que vous cherchiez une poussette légère pour vos déplacements, un modèle double pour jumeaux, ou une poussette tout-en-un avec siège auto, cette sélection des meilleures poussettes 2025 vous guidera vers un choix éclairé.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StrollerComparisonPage;
