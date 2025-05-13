
// Bot responses based on keywords
export const getBotResponse = (userMessage: string): string => {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  // Réponses générales sur l'application
  if (lowerCaseMessage.includes('bonjour') || lowerCaseMessage.includes('salut')) {
    return "Bonjour ! Comment puis-je vous aider aujourd'hui avec l'application BabyBaby ?";
  }
  
  // Qu'est-ce que BabyBaby
  if ((lowerCaseMessage.includes('c\'est quoi') || lowerCaseMessage.includes('qu\'est-ce') || lowerCaseMessage.includes('quest ce') || lowerCaseMessage.includes('présent')) && 
      (lowerCaseMessage.includes('babybaby') || lowerCaseMessage.includes('application') || lowerCaseMessage.includes('app'))) {
    return "L'application BabyBaby est une solution tout-en-un conçue spécifiquement pour les jeunes parents. Elle offre une interface utilisateur de pointe pour une expérience fluide, intuitive et personnalisée, centralisant divers outils essentiels pour suivre, comprendre et célébrer le développement de votre bébé.";
  }
  
  // Fonctionnalités principales
  if (lowerCaseMessage.includes('tableau de bord') || lowerCaseMessage.includes('dashboard') || 
      (lowerCaseMessage.includes('fonctionnalités') && lowerCaseMessage.includes('principal'))) {
    return "Le tableau de bord intelligent de BabyBaby permet de visualiser rapidement les informations importantes. Il inclut le suivi du sommeil de bébé pour assurer des nuits paisibles, le suivi des jalons de développement pour marquer les étapes importantes, le suivi de croissance avec graphiques et données sur la taille et le poids, un calendrier médical pour les rendez-vous, et un calendrier de vaccination avec rappels.";
  }
  
  // Outils parentaux
  if (lowerCaseMessage.includes('outils') && (lowerCaseMessage.includes('parent') || lowerCaseMessage.includes('disponible'))) {
    return "BabyBaby propose une gamme d'outils pratiques pour aider les parents. Cela comprend un calculateur d'ovulation pour la planification de la conception, une checklist de préparation pour l'arrivée de bébé, un registre de cadeaux, un lecteur de berceuses et un générateur de bruit blanc pour faciliter le sommeil, un calculateur de coûts pour estimer le budget, et un générateur de prénoms.";
  }
  
  // Ressources interactives
  if (lowerCaseMessage.includes('ressources') && lowerCaseMessage.includes('interactives') || 
      lowerCaseMessage.includes('quiz') || lowerCaseMessage.includes('interactif')) {
    return "Oui, l'application BabyBaby inclut des quiz interactifs pour les parents et des tests amusants pour évaluer vos connaissances sur la parentalité, offrant ainsi une approche ludique de l'apprentissage.";
  }
  
  // Contenu éducatif
  if (lowerCaseMessage.includes('contenu') && lowerCaseMessage.includes('éduca') || 
      lowerCaseMessage.includes('apprendre') || lowerCaseMessage.includes('cours')) {
    return "BabyBaby offre une variété de contenus éducatifs fiables. On y trouve des articles avec des conseils, des cours sur divers sujets liés à la parentalité, une bibliothèque d'e-books et de guides pratiques sur la grossesse, la naissance et la parentalité.";
  }
  
  // Communauté
  if (lowerCaseMessage.includes('communauté') || lowerCaseMessage.includes('forum') || 
      lowerCaseMessage.includes('autres parents') || lowerCaseMessage.includes('interagir')) {
    return "Oui, l'application dispose d'un forum où vous pouvez rejoindre une communauté active de parents pour échanger des expériences et partager votre parcours. C'est un lieu bienveillant pour poser des questions, obtenir des conseils et trouver du soutien auprès d'autres personnes vivant des expériences similaires.";
  }
  
  // Suivi du développement
  if (lowerCaseMessage.includes('développement') || lowerCaseMessage.includes('suivre') || 
      lowerCaseMessage.includes('suivi') && lowerCaseMessage.includes('bébé')) {
    return "BabyBaby aide à suivre le développement du bébé à travers le suivi du sommeil, le suivi des jalons de développement, le suivi de croissance avec des données et graphiques, ainsi qu'un calendrier médical et de vaccination pour s'assurer que tous les rendez-vous importants sont respectés.";
  }
  
  // Questions existantes maintenues
  if (lowerCaseMessage.includes('comment') && lowerCaseMessage.includes('fonctionne')) {
    return "BabyBaby est une application complète pour suivre le développement de votre enfant. Elle propose un tableau de bord personnalisé, un suivi de croissance, un calendrier médical, un carnet de vaccination, des articles informatifs, des outils pratiques comme le générateur de prénoms et le bruit blanc, des cours pour parents, et bien plus encore !";
  }
  
  // Profils de bébé
  if (lowerCaseMessage.includes('profil') || lowerCaseMessage.includes('ajouter bébé')) {
    return "Pour ajouter un profil de bébé, connectez-vous à votre compte, puis cliquez sur 'Ajouter un profil' dans le tableau de bord. Vous pourrez renseigner le prénom, la date de naissance, le genre et une photo optionnelle. Ces informations permettront de personnaliser le suivi de votre enfant.";
  }
  
  // Suivi de croissance
  if (lowerCaseMessage.includes('croissance') || lowerCaseMessage.includes('poids') || lowerCaseMessage.includes('taille')) {
    return "Le suivi de croissance vous permet d'enregistrer la taille, le poids et le périmètre crânien de votre bébé. Les données sont visualisées sur des courbes de croissance comparées aux normes de référence. Pour ajouter une mesure, allez dans le tableau de bord de votre enfant et cliquez sur 'Ajouter une mesure'.";
  }
  
  // Étapes de développement / Jalon
  if (lowerCaseMessage.includes('étape') || lowerCaseMessage.includes('jalon') || lowerCaseMessage.includes('milestone')) {
    return "BabyBaby vous permet de suivre les étapes clés du développement de votre enfant. Notre liste d'étapes couvre le développement moteur, cognitif et social de 0 à 36 mois. Vous pouvez marquer les étapes comme accomplies et recevoir des conseils adaptés à chaque période.";
  }
  
  // Calendrier médical et vaccination
  if (lowerCaseMessage.includes('médical') || lowerCaseMessage.includes('docteur') || lowerCaseMessage.includes('pédiatre') || lowerCaseMessage.includes('rendez-vous')) {
    return "Le calendrier médical vous permet de planifier et suivre tous les rendez-vous médicaux de votre enfant. Vous pouvez ajouter des rendez-vous avec différents spécialistes, configurer des rappels et noter les observations importantes. Accédez-y depuis le tableau de bord de votre enfant en cliquant sur 'Calendrier médical'.";
  }
  
  if (lowerCaseMessage.includes('vaccin') || lowerCaseMessage.includes('vaccination')) {
    return "Le carnet de vaccination numérique vous aide à suivre tous les vaccins de votre enfant. L'application vous rappelle les vaccinations à venir selon le calendrier officiel, et vous permet d'enregistrer les vaccins administrés avec leurs dates et lots. Vous pouvez même télécharger un récapitulatif pour votre médecin.";
  }
  
  // Articles
  if (lowerCaseMessage.includes('article') || lowerCaseMessage.includes('blog')) {
    return "BabyBaby propose une bibliothèque d'articles rédigés par des experts sur la parentalité, le développement, la santé et le bien-être des bébés. Vous pouvez filtrer les articles par catégorie, rechercher des sujets spécifiques et sauvegarder vos articles préférés pour les consulter plus tard.";
  }
  
  // Cours pour parents
  if (lowerCaseMessage.includes('cours') || lowerCaseMessage.includes('formation') || lowerCaseMessage.includes('apprendre')) {
    return "BabyBaby propose des cours en ligne pour les parents ! Ces formations sont conçues par des experts et couvrent divers sujets comme les soins aux nouveau-nés, le sommeil, l'alimentation, et le développement. Chaque cours est composé de modules vidéo, de ressources téléchargeables et d'exercices pratiques. Vous pouvez y accéder depuis la section 'Cours' du menu principal.";
  }
  
  if (lowerCaseMessage.includes('module') || lowerCaseMessage.includes('leçon')) {
    return "Les cours BabyBaby sont divisés en modules accessibles et pratiques. Chaque module comprend une vidéo explicative, du contenu écrit, et souvent des ressources supplémentaires comme des PDF ou des liens utiles. Vous pouvez suivre les cours à votre rythme et reprendre là où vous vous êtes arrêté. Les modules sont conçus pour s'adapter à votre emploi du temps chargé de parent.";
  }
  
  // E-books
  if (lowerCaseMessage.includes('ebook') || lowerCaseMessage.includes('livre') || lowerCaseMessage.includes('lecture')) {
    return "BabyBaby propose une sélection d'e-books gratuits et premium sur divers sujets liés à la parentalité. Ces guides pratiques sont téléchargeables au format PDF et peuvent être consultés hors ligne. Vous trouverez des e-books sur l'alimentation, le sommeil, les activités d'éveil, et bien d'autres sujets. Accédez à la bibliothèque d'e-books depuis la section 'Ressources' du menu.";
  }
  
  // Outils
  if (lowerCaseMessage.includes('outil') || lowerCaseMessage.includes('fonction')) {
    return "BabyBaby propose plusieurs outils pratiques : calculateur d'ovulation, générateur de prénoms, bruit blanc pour aider bébé à dormir, berceuses, checklist pour préparer l'arrivée de bébé, registre de cadeaux, calculateur de coûts, et notre quiz interactif pour connaître votre style parental. Vous pouvez accéder à tous ces outils depuis la section 'Outils' dans le menu principal.";
  }
  
  if (lowerCaseMessage.includes('bruit blanc') || lowerCaseMessage.includes('berceuse') || lowerCaseMessage.includes('dormir')) {
    return "Notre application propose un générateur de bruit blanc avec différents sons (pluie, ventilateur, océan...) et un lecteur de berceuses pour aider votre bébé à s'endormir. Vous pouvez régler le volume, programmer un arrêt automatique et même créer des playlists personnalisées.";
  }
  
  if (lowerCaseMessage.includes('prénom') || lowerCaseMessage.includes('nom')) {
    return "Le générateur de prénoms vous aide à trouver l'inspiration ! Filtrez par origine, genre, longueur ou initiale. Vous pouvez sauvegarder vos préférés et les partager avec votre partenaire. L'outil propose également la signification et l'origine de chaque prénom.";
  }
  
  if (lowerCaseMessage.includes('checklist') || lowerCaseMessage.includes('liste')) {
    return "Notre checklist pour l'arrivée de bébé vous guide dans les préparatifs avant la naissance. Les items sont organisés par catégorie (vêtements, matériel de puériculture, hygiène...) et vous pouvez suivre votre progression, ajouter vos propres items et recevoir des rappels pour les achats importants.";
  }
  
  // Compte et inscription
  if (lowerCaseMessage.includes('compte') || lowerCaseMessage.includes('inscription') || lowerCaseMessage.includes('connexion')) {
    return "Pour créer un compte, cliquez sur 'Se connecter' en haut à droite, puis 'Créer un compte'. L'inscription est gratuite et sécurisée. Vous pourrez ajouter plusieurs profils d'enfants et accéder à toutes les fonctionnalités de base de l'application, y compris nos nouveaux cours pour parents. Vos données sont protégées et ne sont jamais partagées sans votre consentement.";
  }
  
  // Paiement et abonnement
  if (lowerCaseMessage.includes('paiement') || lowerCaseMessage.includes('abonnement') || lowerCaseMessage.includes('premium')) {
    return "BabyBaby propose une version gratuite avec toutes les fonctionnalités essentielles, et une version premium avec des options avancées (accès à tous les cours pour parents, plus d'espace de stockage, export de données, absence de publicités, etc.). Vous pouvez consulter les différentes offres dans la section 'Abonnement' après vous être connecté.";
  }
  
  // Confidentialité et sécurité
  if (lowerCaseMessage.includes('confidentialité') || lowerCaseMessage.includes('données') || lowerCaseMessage.includes('sécurité')) {
    return "Chez BabyBaby, la sécurité des données est notre priorité. Toutes les informations sont chiffrées, stockées sur des serveurs sécurisés et jamais partagées avec des tiers sans votre consentement. Vous pouvez à tout moment consulter, exporter ou supprimer vos données depuis les paramètres de votre compte.";
  }
  
  // Support technique
  if (lowerCaseMessage.includes('problème') || lowerCaseMessage.includes('bug') || lowerCaseMessage.includes('aide') || lowerCaseMessage.includes('support')) {
    return "Si vous rencontrez un problème technique, vous pouvez contacter notre support à support@babybaby.app ou via le formulaire de contact accessible depuis les paramètres. Notre équipe est disponible du lundi au vendredi, de 9h à 18h et vous répondra sous 24h.";
  }
  
  // Offres gratuites
  if (lowerCaseMessage.includes('offres gratuites') || lowerCaseMessage.includes('coupons') || lowerCaseMessage.includes('échantillons')) {
    return "BabyBaby propose une page d'offres gratuites où vous pouvez trouver une sélection de programmes comme Huggies, Enfamil, Pampers et autres marques qui offrent des échantillons, des coupons et des trousses gratuites pour bébé. Ces offres sont disponibles au Canada et au Québec. Consultez notre page 'Offres Gratuites' dans la section Ressources du menu pour en savoir plus.";
  }
  
  // Réponse par défaut
  return "Je ne suis pas sûr de comprendre votre question. Pourriez-vous la reformuler ou choisir l'un des sujets suggérés ci-dessous ? Vous pouvez me demander des informations sur l'application BabyBaby, le tableau de bord intelligent, les outils parentaux disponibles, les ressources interactives, le contenu éducatif, le forum communautaire ou le suivi du développement de bébé.";
};
