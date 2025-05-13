
export type FAQCategory = 
  | "Tous" 
  | "Général" 
  | "Application" 
  | "Fonctionnalités" 
  | "Outils" 
  | "Développement" 
  | "Santé" 
  | "Nutrition" 
  | "Sommeil" 
  | "Ressources";

export type FAQ = {
  question: string;
  answer: string;
  category: Exclude<FAQCategory, "Tous">;
};

export const faqCategories: FAQCategory[] = [
  "Général",
  "Application",
  "Fonctionnalités",
  "Outils",
  "Développement",
  "Santé",
  "Nutrition",
  "Sommeil",
  "Ressources"
];

export const faqs: FAQ[] = [
  // Nouvelles questions optimisées pour le SEO
  {
    question: "Qu'est-ce que l'application BabyBaby ?",
    answer: "L'application BabyBaby est une solution tout-en-un conçue spécifiquement pour les jeunes parents. Elle offre une interface utilisateur de pointe pour une expérience fluide, intuitive et personnalisée, centralisant divers outils essentiels pour suivre, comprendre et célébrer le développement de leur bébé.",
    category: "Général"
  },
  {
    question: "Quelles sont les fonctionnalités principales offertes par le tableau de bord intelligent ?",
    answer: "Le tableau de bord intelligent permet de visualiser rapidement les informations importantes. Il inclut le suivi du sommeil de bébé pour assurer des nuits paisibles, le suivi des jalons de développement pour marquer les étapes importantes, le suivi de croissance avec graphiques et données sur la taille et le poids, un calendrier médical pour les rendez-vous, et un calendrier de vaccination avec rappels.",
    category: "Fonctionnalités"
  },
  {
    question: "Quels outils parentaux sont disponibles dans l'application ?",
    answer: "BabyBaby propose une gamme d'outils pratiques pour aider les parents. Cela comprend un calculateur d'ovulation pour la planification de la conception, une checklist de préparation pour l'arrivée de bébé, un registre de cadeaux, un lecteur de berceuses et un générateur de bruit blanc pour faciliter le sommeil, un calculateur de coûts pour estimer le budget, et un générateur de prénoms.",
    category: "Outils"
  },
  {
    question: "L'application propose-t-elle des ressources interactives ?",
    answer: "Oui, l'application inclut des quiz interactifs pour les parents et des tests amusants pour évaluer leurs connaissances sur la parentalité, offrant ainsi une approche ludique de l'apprentissage.",
    category: "Ressources"
  },
  {
    question: "Quel type de contenu éducatif est accessible via BabyBaby ?",
    answer: "BabyBaby offre une variété de contenus éducatifs fiables. On y trouve des articles avec des conseils, des cours sur divers sujets liés à la parentalité, une bibliothèque d'e-books et de guides pratiques sur la grossesse, la naissance et la parentalité.",
    category: "Ressources"
  },
  {
    question: "L'application permet-elle d'interagir avec d'autres parents ?",
    answer: "Oui, l'application dispose d'un forum où les utilisateurs peuvent rejoindre une communauté active de parents pour échanger des expériences et partager leurs parcours.",
    category: "Fonctionnalités"
  },
  {
    question: "Comment BabyBaby aide-t-elle à suivre le développement du bébé ?",
    answer: "BabyBaby aide à suivre le développement du bébé à travers le suivi du sommeil, le suivi des jalons de développement, le suivi de croissance avec des données et graphiques, ainsi qu'un calendrier médical et de vaccination pour s'assurer que tous les rendez-vous importants sont respectés.",
    category: "Développement"
  },
  // Questions existantes
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
