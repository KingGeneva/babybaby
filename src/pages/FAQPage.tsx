
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SEOHead from '@/components/common/SEOHead';
import { Helmet } from 'react-helmet-async';

const faqCategories = [
  "Général",
  "Santé",
  "Nutrition",
  "Sommeil",
  "Développement",
  "Application"
];

type FAQ = {
  question: string;
  answer: string;
  category: string;
};

const faqs: FAQ[] = [
  {
    question: "Qu'est-ce que BabyBaby ?",
    answer: "BabyBaby est une application complète pour les parents qui permet de suivre la croissance, la santé et le développement de votre bébé. Nous proposons des outils personnalisés, des conseils d'experts et une communauté de soutien pour vous accompagner dans votre parcours parental.",
    category: "Général"
  },
  {
    question: "Comment puis-je créer un compte ?",
    answer: "Pour créer un compte, cliquez sur le bouton 'Se connecter' en haut à droite de la page, puis sélectionnez 'Créer un compte'. Remplissez le formulaire avec votre adresse e-mail et créez un mot de passe. Vous recevrez ensuite un e-mail de confirmation pour activer votre compte.",
    category: "Application"
  },
  {
    question: "Est-ce que l'application est gratuite ?",
    answer: "BabyBaby propose une version gratuite avec des fonctionnalités de base et une version premium avec des fonctionnalités avancées. Vous pouvez découvrir la différence entre les deux versions dans la section 'Abonnements' de l'application.",
    category: "Général"
  },
  {
    question: "Comment ajouter un profil pour mon bébé ?",
    answer: "Après vous être connecté, accédez à votre tableau de bord et cliquez sur 'Ajouter un bébé'. Remplissez les informations demandées comme le nom, la date de naissance et le sexe de votre enfant.",
    category: "Application"
  },
  {
    question: "À quelle fréquence dois-je mesurer mon bébé ?",
    answer: "Les pédiatres recommandent généralement de mesurer la taille et le poids de votre bébé lors des visites de routine : à la naissance, puis à 1, 2, 4, 6, 9, 12, 18 et 24 mois. Cependant, vous pouvez enregistrer des mesures plus fréquemment si vous le souhaitez.",
    category: "Santé"
  },
  {
    question: "Comment interpréter les courbes de croissance ?",
    answer: "Les courbes de croissance montrent comment la croissance de votre bébé se compare aux normes établies. Un bébé qui suit une courbe régulière, même en dessous ou au-dessus de la moyenne, se développe généralement normalement. L'important est la régularité de la croissance plutôt que la position exacte sur la courbe.",
    category: "Développement"
  },
  {
    question: "Quand dois-je commencer la diversification alimentaire ?",
    answer: "L'Organisation Mondiale de la Santé recommande de commencer la diversification alimentaire autour de 6 mois, lorsque votre bébé montre des signes de préparation comme tenir sa tête, s'intéresser à votre nourriture, et avoir perdu le réflexe d'extrusion (pousser la nourriture hors de la bouche avec la langue).",
    category: "Nutrition"
  },
  {
    question: "Mon bébé ne dort pas bien, que faire ?",
    answer: "Le sommeil des bébés varie considérablement. Établir une routine régulière, créer un environnement propice au sommeil, et observer les signes de fatigue peuvent aider. Si les difficultés persistent, consultez notre section 'Sommeil' pour des conseils plus détaillés ou parlez-en avec votre pédiatre.",
    category: "Sommeil"
  }
];

const FAQPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Général");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredFAQs = faqs.filter(faq => {
    const categoryMatch = selectedCategory === "Tous" || faq.category === selectedCategory;
    const searchMatch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // FAQ structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50/50">
      <SEOHead 
        title="FAQ - Questions Fréquentes" 
        description="Trouvez des réponses à toutes vos questions sur BabyBaby, l'application de suivi pour votre bébé. Santé, nutrition, sommeil et plus encore."
        canonicalUrl="https://babybaby.app/faq"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      </Helmet>
      
      <NavBar />
      
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-babybaby-cosmic mb-4">
              Questions Fréquentes
            </h1>
            <p className="text-gray-600 mb-8">
              Trouvez rapidement des réponses à vos questions sur BabyBaby et la parentalité
            </p>

            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-base"
              />
            </div>
            
            <div className="flex overflow-x-auto space-x-2 pb-4 justify-center">
              <Button
                key="Tous"
                variant={selectedCategory === "Tous" ? "default" : "outline"}
                className="whitespace-nowrap"
                onClick={() => setSelectedCategory("Tous")}
              >
                Tous
              </Button>
              {faqCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="whitespace-nowrap"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="px-6 py-4 hover:bg-sky-50/50 text-left">
                      <span className="text-lg font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">Aucune question ne correspond à votre recherche.</p>
                </div>
              )}
            </Accordion>
          </div>
          
          <div className="max-w-3xl mx-auto mt-10 text-center">
            <h3 className="text-xl font-semibold mb-4">Vous n'avez pas trouvé votre réponse ?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="flex items-center gap-2 bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
                <MessageSquare className="h-4 w-4" />
                Discuter avec notre chatbot
              </Button>
              <Button variant="outline">
                Contacter notre équipe
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
