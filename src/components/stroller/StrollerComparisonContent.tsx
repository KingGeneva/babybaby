
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import StrollerItem from './StrollerItem';
import PodcastPlayer from './PodcastPlayer';

const StrollerComparisonContent: React.FC = () => {
  // Définir le chemin audio avec une gestion de fallback pour éviter les erreurs fatales
  const audioPath = "/audio/Guides des meilleures poussettes pour bebes.wav";
  
  return (
    <div className="prose max-w-none">
      <p className="mb-6 text-lg">
        Choisir la meilleure poussette pour bébé en 2025 est une étape cruciale pour tous les parents. Avec une multitude de modèles disponibles sur le marché, il peut être difficile de s'y retrouver. Ce guide comparatif présente les meilleures poussettes 2025, selon les critères essentiels : sécurité, confort, prix, maniabilité, évolutivité et qualité de fabrication.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4 text-babybaby-cosmic">Pourquoi bien choisir sa poussette en 2025 ?</h2>
      <p>
        La poussette est l'un des investissements les plus importants pour les jeunes parents. Que vous soyez citadin, adepte de balades nature ou parent de jumeaux, il existe une poussette adaptée à votre style de vie. Les deux sources citées soulignent que le choix dépend avant tout de vos besoins, de l'âge de votre bébé, et de votre budget.
      </p>
      
      <h2 className="text-2xl font-semibold mt-10 mb-6 text-center text-babybaby-cosmic">Les 5 Meilleures Poussettes 2025</h2>
      
      <PodcastPlayer audioSrc={audioPath} />
      
      <StrollerItem 
        title="1. Safety 1st Raya Travel System – Confort & Polyvalence"
        price="499,97 $"
        description="Parfaite pour un usage quotidien, cette poussette tout-en-un est livrée avec un siège d'auto et un mode landau."
        features={[
          "Suspension intégrée pour un confort optimal",
          "Rembourrage en mousse mémoire",
          "Fenêtre Peek-a-Boo pour garder un œil sur bébé",
          "Facile à plier et à transporter",
          "Très bon rapport qualité-prix"
        ]}
        idealFor="les parents à la recherche d'un système de voyage complet et fiable"
        productLink="https://amzn.to/3Strvm6"
      />
      
      <StrollerItem 
        title="2. Summer Infant 3Dlite – Ultra légère & Pratique"
        price="129,97 $"
        description="Un choix judicieux pour les petits budgets et les voyageurs. Cette poussette parapluie légère (13 lb) se plie rapidement et se transporte aisément."
        features={[
          "Compacte et simple à utiliser",
          "Repose-pieds réglable",
          "Harnais à 5 points",
          "Parfait pour les escapades ou les transports en commun"
        ]}
        idealFor="les sorties occasionnelles ou les familles qui bougent souvent"
        productLink="https://amzn.to/4kfbeNH"
      />
      
      <StrollerItem 
        title="3. Maxi Cosi Zelia Max 5-en-1 – Polyvalence & Style"
        price="autour de 500 $"
        description="Cette poussette évolutive propose 5 modes d'utilisation, avec nacelle intégrée et compatibilité siège d'auto."
        features={[
          "Design moderne et haut de gamme",
          "Grande capacité de rangement sous la poussette",
          "Siège réversible (face parent ou face monde)",
          "Pliage simple d'une main"
        ]}
        idealFor="les parents recherchant une solution complète et esthétique"
        productLink="https://amzn.to/42Wne0U"
      />
      
      <StrollerItem 
        title="4. Thule Urban Glide 2 Double – Haut de Gamme pour Famille Active"
        price="999,95 $"
        description="Une poussette double premium, parfaite pour les familles avec deux jeunes enfants ou des jumeaux. Adaptée à la marche rapide et au jogging."
        features={[
          "Grandes roues avec suspension intégrée",
          "Design aérodynamique et solide",
          "Frein à main pratique pour la sécurité",
          "Repliable d'une main malgré sa taille"
        ]}
        idealFor="les familles sportives ou les sorties tout-terrain"
        productLink="https://amzn.to/44yJWx9"
      />
      
      <StrollerItem 
        title="5. Evenflo Victory Plus Jogger Travel System – Tout-Terrain & Abordable"
        price="399,97 $"
        description="Une poussette robuste et polyvalente conçue pour le jogging ou les balades sur terrains irréguliers. Livrée avec un siège d'auto pour bébé."
        features={[
          "Grandes roues pneumatiques durables",
          "Confort élevé pour bébé",
          "Facile à plier et à ranger",
          "Excellente maniabilité"
        ]}
        idealFor="les parents actifs à la recherche d'un système abordable et performant"
        productLink="https://amzn.to/4dclNi3"
      />
      
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
  );
};

export default StrollerComparisonContent;
