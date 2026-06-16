// Base de connaissances enrichie pour BabyBot
// Contient des informations détaillées sur tous les sujets liés aux bébés et à la parentalité

export interface KnowledgeEntry {
  keywords: string[];
  response: string;
  category: string;
}

export const knowledgeBase: KnowledgeEntry[] = [
  // ============================================
  // SECTION: APPLICATION BABYBABY
  // ============================================
  {
    keywords: ['bonjour', 'salut', 'hello', 'coucou', 'bonsoir'],
    response: "Bonjour ! Je suis BabyBot, votre assistant parental. Comment puis-je vous aider aujourd'hui ? Je peux répondre à vos questions sur le développement de bébé, le sommeil, l'alimentation, la santé, les outils de l'application BabyBaby et bien plus encore !",
    category: 'greetings'
  },
  {
    keywords: ["c'est quoi", "qu'est-ce", "quest ce", "présent", "babybaby", "application", "app"],
    response: "BabyBaby est une application tout-en-un conçue spécifiquement pour les jeunes parents. Elle offre :\n\n📊 **Tableau de bord intelligent** : Suivi du sommeil, des jalons de développement, de la croissance avec graphiques\n📅 **Calendrier médical** : Rendez-vous et rappels de vaccination\n🛠️ **Outils pratiques** : Calculateur d'ovulation, générateur de prénoms, bruit blanc, berceuses\n📚 **Ressources éducatives** : Articles, cours, e-books gratuits\n👥 **Communauté** : Forum pour échanger avec d'autres parents",
    category: 'application'
  },
  {
    keywords: ['tableau de bord', 'dashboard', 'fonctionnalités principal'],
    response: "Le tableau de bord intelligent de BabyBaby centralise toutes les informations importantes :\n\n• **Suivi du sommeil** : Enregistrez les heures de coucher et réveil, visualisez les patterns\n• **Jalons de développement** : Marquez les étapes importantes (premier sourire, premiers pas...)\n• **Courbes de croissance** : Graphiques de poids, taille et périmètre crânien comparés aux normes OMS\n• **Calendrier médical** : Planifiez les rendez-vous pédiatre et spécialistes\n• **Carnet de vaccination** : Rappels automatiques selon le calendrier vaccinal officiel",
    category: 'application'
  },
  {
    keywords: ['outils', 'parent', 'disponible', 'fonction'],
    response: "BabyBaby propose une gamme complète d'outils pratiques :\n\n🧮 **Calculateur d'ovulation** : Pour planifier la conception\n📝 **Checklist naissance** : Liste complète pour préparer l'arrivée de bébé\n🎁 **Registre de cadeaux** : Partagez vos souhaits avec vos proches\n🎵 **Berceuses & Bruit blanc** : Sons apaisants pour l'endormissement\n💰 **Calculateur de coûts** : Estimez le budget bébé\n👶 **Générateur de prénoms** : Trouvez le prénom idéal avec significations et origines\n😴 **Suivi du sommeil** : Analysez les patterns de sommeil",
    category: 'application'
  },
  {
    keywords: ['contenu', 'éduca', 'apprendre', 'cours', 'formation'],
    response: "BabyBaby offre un contenu éducatif riche et fiable :\n\n📖 **Articles experts** : Plus de 50 articles rédigés par des pédiatres et spécialistes\n🎓 **Cours en ligne** : Formations vidéo sur les soins aux nouveau-nés, le sommeil, l'alimentation\n📚 **E-books gratuits** : Guides pratiques téléchargeables sur la grossesse, naissance, parentalité\n📋 **Fiches pratiques** : Conseils rapides et applicables au quotidien\n\nTout le contenu est validé par des professionnels de santé.",
    category: 'application'
  },
  {
    keywords: ['communauté', 'forum', 'autres parents', 'interagir', 'échang'],
    response: "Notre forum communautaire est un espace bienveillant pour les parents :\n\n👥 **Échanges d'expériences** : Partagez votre vécu et apprenez des autres\n💬 **Questions-réponses** : Posez vos questions et recevez des conseils\n🤝 **Soutien mutuel** : Trouvez du réconfort auprès de parents qui vivent les mêmes situations\n📁 **Catégories thématiques** : Grossesse, nouveau-né, alimentation, sommeil, développement...\n\nL'inscription est gratuite et respecte votre vie privée.",
    category: 'application'
  },

  // ============================================
  // SECTION: SOMMEIL BÉBÉ
  // ============================================
  {
    keywords: ['sommeil', 'dormir', 'nuit', 'sieste', 'endorm'],
    response: "Le sommeil de bébé évolue considérablement :\n\n**0-3 mois** : 14-17h de sommeil par jour, cycles courts de 2-4h\n**3-6 mois** : Début de consolidation nocturne, 3-4 siestes\n**6-12 mois** : 12-14h dont 10-12h la nuit, 2 siestes\n\n**Conseils pour un bon sommeil :**\n• Établir une routine régulière (bain, berceuse, câlin)\n• Chambre fraîche (18-20°C), sombre et calme\n• Reconnaître les signes de fatigue\n• Coucher bébé somnolent mais éveillé\n• Utiliser le bruit blanc si nécessaire",
    category: 'sommeil'
  },
  {
    keywords: ['routine', 'coucher', 'rituel', 'soir'],
    response: "La routine du coucher est essentielle pour un bon sommeil :\n\n**Routine idéale (30-45 min avant le coucher) :**\n1. 🛁 Bain tiède relaxant\n2. 👶 Massage doux avec une huile adaptée\n3. 👕 Habillage en pyjama confortable\n4. 📚 Histoire courte ou chanson douce\n5. 💡 Lumières tamisées, environnement calme\n6. 😘 Câlin et mots rassurants\n7. 🛏️ Déposer bébé dans son lit, encore éveillé\n\n**Clés du succès :**\n• Même heure chaque soir (±30 min)\n• Mêmes étapes dans le même ordre\n• Ambiance calme et prévisible",
    category: 'sommeil'
  },
  {
    keywords: ['réveils', 'réveil nocturne', 'pleur nuit', 'nuit difficile'],
    response: "Les réveils nocturnes sont normaux chez les bébés :\n\n**Causes fréquentes :**\n• Faim (surtout avant 6 mois)\n• Inconfort (couche, température)\n• Poussées dentaires\n• Pics de croissance\n• Cauchemars ou terreurs nocturnes (après 1 an)\n\n**Comment gérer :**\n• Attendre quelques minutes avant d'intervenir\n• Intervention calme et minimale\n• Éviter de créer de nouvelles associations d'endormissement\n• Vérifier les besoins de base sans trop stimuler\n• Patience : c'est une phase qui passe !",
    category: 'sommeil'
  },
  {
    keywords: ['méthode', '5-10-15', 'ferber', 'extinction', 'laisser pleurer'],
    response: "Il existe plusieurs méthodes pour l'endormissement autonome :\n\n**Méthode 5-10-15 (Ferber) :**\n• Intervalles progressifs avant de rassurer bébé\n• Visites courtes sans prendre bébé\n• Adaptée après 6 mois\n\n**Méthode douce (graduelle) :**\n• Réduction progressive de l'intervention\n• Présence rassurante diminuée peu à peu\n• Plus longue mais moins stressante\n\n**Méthode du fading :**\n• Diminution progressive des aides à l'endormissement\n\n⚠️ Choisissez la méthode qui correspond à vos valeurs. Consultez un professionnel si besoin.",
    category: 'sommeil'
  },
  {
    keywords: ['bruit blanc', 'berceuse', 'son', 'musique', 'white noise'],
    response: "Les sons apaisants aident bébé à s'endormir :\n\n**Bruit blanc :**\n• Rappelle les sons in utero\n• Masque les bruits environnants\n• Types : pluie, ventilateur, océan, aspirateur...\n• Volume recommandé : 50-60 dB (conversation normale)\n• Ne pas placer la source trop près de bébé\n\n**Berceuses :**\n• Voix parentale = le meilleur son apaisant\n• Mélodies simples et répétitives\n• Favorisent le lien d'attachement\n\n🎵 L'application BabyBaby propose un générateur de bruit blanc et des berceuses !",
    category: 'sommeil'
  },
  {
    keywords: ['régression', 'sommeil change', 'dort plus', 'dort moins'],
    response: "Les régressions du sommeil sont des périodes normales :\n\n**Principales régressions :**\n• **4 mois** : Maturation des cycles de sommeil\n• **8-10 mois** : Anxiété de séparation, motricité\n• **12 mois** : Premiers pas, langage\n• **18 mois** : Autonomie, cauchemars\n• **24 mois** : Terreurs nocturnes, transition sieste unique\n\n**Conseils :**\n• Maintenir la routine habituelle\n• Plus de présence rassurante\n• Éviter de créer de nouvelles habitudes\n• Généralement 2-6 semaines puis retour à la normale",
    category: 'sommeil'
  },

  // ============================================
  // SECTION: ALIMENTATION & NUTRITION
  // ============================================
  {
    keywords: ['allaitement', 'maternel', 'sein', 'lait maternel'],
    response: "L'allaitement maternel offre de nombreux bienfaits :\n\n**Pour bébé :**\n• Anticorps protecteurs contre les infections\n• Digestion facilitée, moins de coliques\n• Développement cognitif optimal\n• Réduction des risques d'allergies\n\n**Pour maman :**\n• Récupération post-accouchement plus rapide\n• Réduction du risque de cancer du sein\n• Lien affectif renforcé\n• Économique et pratique\n\n**Conseils pour réussir :**\n• Mise au sein précoce (1ère heure)\n• Positions confortables\n• Allaitement à la demande\n• N'hésitez pas à consulter une conseillère en lactation",
    category: 'nutrition'
  },
  {
    keywords: ['biberon', 'lait infantile', 'préparation', 'formule', 'lait maternisé'],
    response: "Le lait infantile est une alternative sûre et nutritive :\n\n**Types de laits :**\n• **1er âge (0-6 mois)** : Unique source de nutrition\n• **2ème âge (6-12 mois)** : Avec diversification\n• **Croissance (1-3 ans)** : Complément alimentaire\n• **Spéciaux** : AR (anti-régurgitation), HA (hypoallergénique), sans lactose...\n\n**Préparation du biberon :**\n• Eau adaptée aux nourrissons\n• 1 mesure rase pour 30 ml d'eau\n• Température ≈ 37°C\n• Consommer dans l'heure\n• Ne jamais réchauffer au micro-ondes",
    category: 'nutrition'
  },
  {
    keywords: ['diversification', 'aliment solide', 'purée', 'compote', 'premier aliment'],
    response: "La diversification alimentaire commence vers 4-6 mois :\n\n**Signes de préparation :**\n• Tient sa tête droite\n• S'intéresse à votre nourriture\n• Perte du réflexe d'extrusion\n\n**Ordre d'introduction suggéré :**\n1. **4-6 mois** : Légumes doux (carotte, courgette, potiron)\n2. **5-6 mois** : Fruits cuits (pomme, poire, banane)\n3. **7-8 mois** : Protéines (viande, poisson, jaune d'œuf)\n4. **8-9 mois** : Féculents (pâtes, riz, pain)\n\n**Conseils :**\n• Un nouvel aliment à la fois (2-3 jours)\n• Textures progressivement moins lisses\n• Jamais forcer bébé à manger",
    category: 'nutrition'
  },
  {
    keywords: ['dme', 'alimentation autonome', 'finger food', 'morceaux'],
    response: "La DME (Diversification Menée par l'Enfant) est une approche alternative :\n\n**Principe :**\n• Bébé mange seul des morceaux dès 6 mois\n• Pas de purées, aliments en bâtonnets\n• L'enfant découvre à son rythme\n\n**Conditions préalables :**\n• Bébé ≥ 6 mois et en bonne santé\n• Peut s'asseoir avec soutien\n• Coordonne main-bouche\n• Développement normal\n\n**Avantages :**\n• Développe la motricité fine\n• Apprentissage des textures\n• Autonomie alimentaire\n• Plaisir de manger\n\n⚠️ Apprenez les gestes de premiers secours en cas d'étouffement.",
    category: 'nutrition'
  },
  {
    keywords: ['colique', 'pleur', 'inconsolable', 'gaz', 'ballonnement', 'ventre'],
    response: "Les coliques touchent 20-25% des bébés (pic à 6 semaines) :\n\n**Reconnaître les coliques (règle des 3) :**\n• Pleurs > 3h/jour\n• > 3 jours/semaine\n• > 3 semaines\n\n**Solutions pour soulager :**\n• 🤱 Contact peau à peau\n• 👶 Massage abdominal dans le sens des aiguilles d'une montre\n• 🚶 Bercement, promenade\n• 🎵 Bruit blanc\n• 🍼 Vérifier la prise du biberon (moins d'air avalé)\n• 🧘 Position \"vélo\" avec les jambes\n• 💊 Probiotiques ou gouttes anti-gaz (avis médical)\n\n**Rassurez-vous :** Les coliques disparaissent vers 3-4 mois.",
    category: 'nutrition'
  },
  {
    keywords: ['reflux', 'régurgitation', 'rgo', 'vomi', 'crache'],
    response: "Régurgitations et reflux sont fréquents chez les bébés :\n\n**Différence :**\n• **Régurgitation simple** : Petite quantité, bébé ne souffre pas\n• **RGO (reflux gastro-œsophagien)** : Douleurs, pleurs, refus alimentaire\n\n**Conseils pour limiter les reflux :**\n• Maintenir bébé vertical 20-30 min après les repas\n• Fractionner les repas (quantités plus petites, plus souvent)\n• Surélever légèrement la tête du matelas (5-10°)\n• Éviter de serrer la couche\n• Laits AR sur avis médical\n\n⚠️ Consultez si : perte de poids, sang dans les régurgitations, détresse respiratoire.",
    category: 'nutrition'
  },
  {
    keywords: ['allergie', 'intolérance', 'lait de vache', 'iplv', 'réaction'],
    response: "Allergies et intolérances alimentaires chez bébé :\n\n**Allergie aux protéines de lait de vache (APLV) :**\n• Symptômes : eczéma, diarrhées, vomissements, sang dans selles\n• Traitement : lait hydrolysé ou à base d'acides aminés\n• Guérison souvent vers 1-3 ans\n\n**Principaux allergènes à surveiller :**\n• Lait de vache\n• Œufs\n• Arachides\n• Fruits à coque\n• Blé/gluten\n• Poisson, crustacés\n\n**Prévention :**\n• Introduction progressive de chaque aliment\n• Observer 2-3 jours avant d'en introduire un nouveau\n• Consultez rapidement en cas de réaction",
    category: 'nutrition'
  },

  // ============================================
  // SECTION: DÉVELOPPEMENT
  // ============================================
  {
    keywords: ['développement', 'étape', 'jalon', 'milestone', 'progrès'],
    response: "Le développement de bébé suit des étapes clés :\n\n**0-3 mois :**\n• Suit des yeux, premiers sourires\n• Tient sa tête quelques secondes\n• Réagit aux sons\n\n**3-6 mois :**\n• Attrape les objets, les porte à la bouche\n• Se retourne, tient assis avec soutien\n• Babille, reconnaît son prénom\n\n**6-12 mois :**\n• Rampe, puis 4 pattes\n• Premiers mots (mama, papa)\n• Se met debout, premiers pas (9-15 mois)\n\n**12-24 mois :**\n• Marche assurée, court\n• Vocabulaire en expansion (50+ mots)\n• Début de l'autonomie\n\n⚠️ Chaque bébé a son rythme. Consultez si retard significatif.",
    category: 'developpement'
  },
  {
    keywords: ['motricité', 'marche', 'ramper', '4 pattes', 'assis', 'debout'],
    response: "Les étapes motrices de 0 à 18 mois :\n\n**Motricité globale :**\n• 2-3 mois : Tient sa tête\n• 4-6 mois : Se retourne\n• 6-8 mois : Tient assis seul\n• 7-10 mois : Rampe ou 4 pattes\n• 9-12 mois : Se met debout, fait quelques pas\n• 12-15 mois : Marche seul\n• 15-18 mois : Monte les escaliers\n\n**Motricité fine :**\n• 3-4 mois : Attrape les objets\n• 6-9 mois : Transfère d'une main à l'autre\n• 9-12 mois : Pince pouce-index\n• 12-18 mois : Empile des cubes, gribouille\n\n✨ Favorisez le temps au sol, le jeu libre et limitez les équipements restrictifs.",
    category: 'developpement'
  },
  {
    keywords: ['langage', 'parole', 'mot', 'parler', 'babill'],
    response: "Le développement du langage de 0 à 24 mois :\n\n**0-6 mois :**\n• Pleurs différenciés\n• Gazouillis, vocalises\n• Réagit à la voix, aux sons\n\n**6-12 mois :**\n• Babillage (ba-ba, ma-ma)\n• Comprend le \"non\"\n• Premiers mots vers 10-12 mois\n• Répond à son prénom\n\n**12-18 mois :**\n• 10-20 mots\n• Montre du doigt\n• Comprend consignes simples\n\n**18-24 mois :**\n• 50-100 mots, puis explosion du vocabulaire\n• Phrases de 2 mots (\"papa parti\")\n• Suit des consignes à 2 étapes\n\n**Stimuler le langage :**\n• Parlez-lui beaucoup !\n• Lisez des livres\n• Chantez des comptines\n• Nommez les objets du quotidien",
    category: 'developpement'
  },
  {
    keywords: ['éveil', 'stimulation', 'jouet', 'jeu', 'activité'],
    response: "L'éveil de bébé à chaque âge :\n\n**0-3 mois :**\n• Mobiles noir et blanc, puis colorés\n• Tapis d'éveil\n• Hochets légers\n• Chansons et contact visuel\n\n**3-6 mois :**\n• Miroirs sécurisés\n• Jouets à textures variées\n• Balles sensorielles\n• Temps sur le ventre\n\n**6-12 mois :**\n• Cubes à empiler/emboîter\n• Livres en tissu ou cartonnés\n• Jeux de cache-cache\n• Instruments de musique\n\n**12-24 mois :**\n• Puzzles simples\n• Pâte à modeler\n• Jeux de construction\n• Jeu symbolique (dînette, poupées)\n\n🎮 Le meilleur jouet reste... vous ! L'interaction est primordiale.",
    category: 'developpement'
  },
  {
    keywords: ['écran', 'télé', 'tablette', 'téléphone', 'smartphone'],
    response: "Recommandations sur les écrans pour les jeunes enfants :\n\n**Avant 2 ans :**\n❌ Éviter totalement les écrans\n• Le cerveau n'est pas prêt à traiter ces stimulations\n• Impact négatif sur le langage et l'attention\n• Perturbe le sommeil\n\n**2-3 ans :**\n• Maximum 30 min/jour\n• Toujours accompagné d'un adulte\n• Contenu éducatif adapté\n\n**Alternatives :**\n• Jeux physiques et sensoriels\n• Lecture partagée\n• Musique et chansons\n• Temps en nature\n• Jeu libre et créatif\n\n📱 Les appels vidéo avec la famille sont acceptables même avant 2 ans.",
    category: 'developpement'
  },

  // ============================================
  // SECTION: SANTÉ & MÉDICAL
  // ============================================
  {
    keywords: ['vaccin', 'vaccination', 'calendrier vaccinal', 'immunisation'],
    response: "Le calendrier vaccinal protège bébé des maladies graves :\n\n**Calendrier vaccinal du Québec (PIQ) :**\n• 2 mois : DCaT-HB-VPI-Hib + Pneumocoque + Rotavirus\n• 4 mois : Rappels DCaT-HB-VPI-Hib + Pneumocoque + Rotavirus\n• 6 mois : Influenza (saisonnier)\n• 12 mois : RRO-Var (Rougeole-Rubéole-Oreillons-Varicelle) + Méningocoque C + Pneumocoque\n• 18 mois : Rappel DCaT-VPI-Hib\n• 4-6 ans : RRO-Var + DCaT-VPI\n\n**Au Canada :**\nChaque province a son propre calendrier — au Québec, c'est le Protocole d'immunisation du Québec (PIQ), administré gratuitement au CLSC.\n\n**Conseils :**\n• Carnet de vaccination du Québec à jour\n• Acétaminophène (Tempra, Tylenol) si fièvre légère\n• Signaler toute réaction inhabituelle à Info-Santé 811\n\n📅 L'application BabyBaby envoie des rappels automatiques !",
    category: 'sante'
  },
  {
    keywords: ['médical', 'docteur', 'pédiatre', 'rendez-vous', 'visite'],
    response: "Suivi médical recommandé pour bébé :\n\n**Visites obligatoires :**\n• Dans les 8 jours après la naissance\n• À 1 mois\n• 2, 4, 5, 11-13 mois (vaccinations)\n• 9 mois et 24 mois (examens de santé)\n\n**Ce qui est vérifié :**\n• Croissance (poids, taille, périmètre crânien)\n• Développement psychomoteur\n• Vision et audition\n• Alimentation\n• Sommeil\n• Vaccinations\n\n**Quand consulter en urgence :**\n• Fièvre > 38°C avant 3 mois\n• Difficultés respiratoires\n• Refus de s'alimenter\n• Somnolence excessive\n• Convulsions",
    category: 'sante'
  },
  {
    keywords: ['fièvre', 'température', 'malade', 'thermomètre'],
    response: "La fièvre chez bébé :\n\n**Définition :**\n• Température > 38°C (rectale ou frontale)\n\n**Quand s'inquiéter :**\n🚨 **Urgence si :**\n• Bébé < 3 mois avec fièvre\n• Fièvre > 40°C\n• Convulsions\n• Difficultés respiratoires\n• Taches rouges/violettes sur la peau\n• Comportement anormal\n\n**Comment agir :**\n• Découvrir légèrement bébé\n• Hydrater fréquemment\n• Acétaminophène (Tempra, Tylenol) selon le poids — avis Info-Santé 811 ou pédiatre\n• Surveiller l'évolution\n\n**Ne pas faire :**\n• Bain froid\n• Trop couvrir\n• AAS / Aspirine (jamais chez l'enfant — risque de syndrome de Reye)",
    category: 'sante'
  },
  {
    keywords: ['dent', 'poussée dentaire', 'dentition', 'gencive'],
    response: "Les poussées dentaires (4-8 mois généralement) :\n\n**Symptômes :**\n• Bave excessive\n• Gencives gonflées et rouges\n• Joues rouges\n• Fesses irritées parfois\n• Irritabilité, troubles du sommeil\n• Envie de mordre\n\n**Ordre d'apparition typique :**\n1. Incisives centrales inférieures (6-10 mois)\n2. Incisives centrales supérieures (8-12 mois)\n3. Incisives latérales (9-16 mois)\n4. Premières molaires (13-19 mois)\n5. Canines (16-23 mois)\n6. Deuxièmes molaires (23-33 mois)\n\n**Soulager :**\n• Anneaux de dentition réfrigérés\n• Massage des gencives (doigt propre)\n• Gels homéopathiques\n• Câlins et patience !",
    category: 'sante'
  },
  {
    keywords: ['croissance', 'poids', 'taille', 'courbe', 'percentile'],
    response: "Le suivi de croissance est essentiel :\n\n**Ce qu'on mesure :**\n• Poids (en kg)\n• Taille/longueur (en cm)\n• Périmètre crânien (en cm)\n\n**Comprendre les percentiles :**\n• 50ème percentile = moyenne\n• Entre 3ème et 97ème = zone normale\n• L'important : la régularité de la courbe\n\n**Poids moyen :**\n• Naissance : 3-3,5 kg\n• 6 mois : double le poids de naissance\n• 12 mois : triple le poids de naissance\n\n**Quand consulter :**\n• Changement brutal de couloir\n• Stagnation prolongée\n• Courbe toujours < 3ème ou > 97ème percentile\n\n📊 BabyBaby affiche les courbes selon les normes OMS.",
    category: 'sante'
  },

  // ============================================
  // SECTION: SÉCURITÉ
  // ============================================
  {
    keywords: ['sécurité', 'accident', 'danger', 'protection', 'maison'],
    response: "Sécuriser la maison pour bébé :\n\n**Prévention des chutes :**\n• Barrières d'escalier en haut et en bas\n• Protection des fenêtres\n• Tapis antidérapant dans la baignoire\n• Ne jamais laisser bébé seul en hauteur\n\n**Prévention des intoxications :**\n• Médicaments et produits ménagers en hauteur\n• Verrous pour placards\n• Plantes toxiques hors de portée\n\n**Prévention des brûlures :**\n• Protège-coins sur tables\n• Barrière de cuisine\n• Température du bain ≤ 37°C\n\n**Prévention de l'étouffement :**\n• Pas de petits objets accessibles\n• Jouets adaptés à l'âge\n• Surveillance pendant les repas",
    category: 'securite'
  },
  {
    keywords: ['mort subite', 'sécurité sommeil', 'position', 'couchage'],
    response: "Prévention de la mort subite du nourrisson :\n\n**Couchage sécuritaire :**\n✅ **À faire :**\n• Toujours sur le dos\n• Matelas ferme et plat\n• Chambre entre 18-20°C\n• Bébé dans sa propre surface de sommeil\n• Gigoteuse adaptée (pas de couverture)\n\n❌ **À éviter :**\n• Oreillers, couettes, tours de lit\n• Peluches dans le lit\n• Co-sleeping sur canapé ou fauteuil\n• Surchauffe\n• Tabagisme passif\n\n**Autres facteurs protecteurs :**\n• Allaitement maternel\n• Tétine à l'endormissement (après 1 mois)\n• Vaccinations à jour",
    category: 'securite'
  },
  {
    keywords: ['étouffement', 'fausse route', 'heimlich', 'urgence'],
    response: "Premiers secours en cas d'étouffement :\n\n**Signes d'étouffement :**\n• Ne tousse pas, ne pleure pas\n• Lèvres bleues\n• Mains au cou\n\n**Bébé < 1 an :**\n1. 5 claques dans le dos (bébé sur l'avant-bras, tête en bas)\n2. Si inefficace : 5 compressions thoraciques (sur le sternum)\n3. Alterner jusqu'à libération ou perte de connaissance\n\n**Enfant > 1 an :**\n• 5 claques dans le dos\n• Si inefficace : compressions abdominales (Heimlich)\n\n🚨 **Appelez le 911 immédiatement** (ou Info-Santé 811 pour les questions non urgentes)\n\n⚠️ Formation aux premiers secours (Croix-Rouge canadienne, Ambulance Saint-Jean) vivement recommandée pour tous les parents !",
    category: 'securite'
  },
  {
    keywords: ['siège auto', 'voiture', 'voyage', 'transport'],
    response: "La sécurité en voiture (Québec / Canada) :\n\n**Choix du siège auto (normes Transports Canada / CMVSS 213) :**\n• **Nouveau-né — environ 10 kg** : Coquille dos à la route, obligatoire\n• **Jusqu'à 18 kg minimum** : Siège convertible — dos à la route le plus longtemps possible (recommandation SAAQ : minimum 2 ans)\n• **Jusqu'à 36 kg ou 145 cm** : Siège d'appoint (booster) — obligatoire au Québec\n\n**Règles essentielles (Code de la sécurité routière du Québec) :**\n• Dos à la route jusqu'à au moins 2 ans (idéalement plus longtemps)\n• Installation selon le manuel du siège ET du véhicule\n• Harnais bien ajusté (1 doigt max entre la sangle et la clavicule)\n• Jamais de siège dos à la route devant un coussin gonflable actif\n• Retirer les manteaux épais avant d'installer bébé\n\n**Autres conseils :**\n• Privilégier un siège certifié CMVSS 213 (étiquette canadienne)\n• Faire vérifier l'installation par un technicien CAA-Québec ou un poste de pompiers participant\n• Jamais de bébé seul dans la voiture",
    category: 'securite'
  },

  // ============================================
  // SECTION: PORTAGE & ÉQUIPEMENT
  // ============================================
  {
    keywords: ['portage', 'écharpe', 'porte-bébé', 'porter'],
    response: "Le portage physiologique :\n\n**Bienfaits :**\n• Renforce le lien d'attachement\n• Apaise bébé (rappel de l'utérus)\n• Favorise le développement moteur\n• Libère les mains des parents\n• Facilite l'allaitement\n\n**Types de portage :**\n• **Écharpe tissée** : Polyvalente, apprentissage requis\n• **Écharpe extensible** : Facile pour les débuts\n• **Mei-tai** : Compromis écharpe/porte-bébé\n• **Porte-bébé préformé** : Simple d'utilisation\n• **Sling** : Rapide pour courts trajets\n\n**Règles de sécurité :**\n• Position grenouille (genoux plus hauts que fesses)\n• Voies respiratoires dégagées\n• Menton décollé de la poitrine\n• Bébé assez haut pour l'embrasser",
    category: 'equipement'
  },
  {
    keywords: ['équipement', 'matériel', 'indispensable', 'liste', 'naissance'],
    response: "Les essentiels pour l'arrivée de bébé :\n\n**Sommeil :**\n• Lit à barreaux aux normes (NF)\n• Matelas ferme adapté\n• Gigoteuses (selon saison)\n• Babyphone\n\n**Déplacements :**\n• Siège auto groupe 0+\n• Poussette\n• Porte-bébé ou écharpe\n\n**Change et hygiène :**\n• Table à langer sécurisée\n• Couches (newborn et taille 1)\n• Produits adaptés (liniment, eau thermale)\n• Baignoire bébé\n\n**Alimentation :**\n• Biberons et tétines (si besoin)\n• Tire-lait (si allaitement)\n• Bavoirs\n\n**Vêtements :**\n• Bodies (beaucoup !)\n• Pyjamas, bonnets, chaussettes\n• Prévoir taille 1 mois + 3 mois\n\n📝 Utilisez la checklist BabyBaby pour ne rien oublier !",
    category: 'equipement'
  },

  // ============================================
  // SECTION: PARENTALITÉ & BIEN-ÊTRE
  // ============================================
  {
    keywords: ['fatigue', 'épuisement', 'burn out', 'maman fatiguée', 'papa fatigué'],
    response: "La fatigue parentale est réelle et normale :\n\n**Reconnaître les signes :**\n• Irritabilité, sautes d'humeur\n• Troubles du sommeil malgré la fatigue\n• Sentiment de débordement\n• Difficultés de concentration\n• Isolation sociale\n\n**Prendre soin de vous :**\n• Acceptez l'aide proposée\n• Dormez quand bébé dort\n• Sortez quotidiennement, même brièvement\n• Maintenez des moments pour vous\n• Parlez de vos difficultés\n\n**Ressources :**\n• PMI, sage-femme\n• Associations de soutien parental\n• Consultations psy si besoin\n\n🤝 Demander de l'aide n'est pas un échec, c'est un acte de force.",
    category: 'bienetre'
  },
  {
    keywords: ['baby blues', 'dépression post', 'dépression', 'tristesse', 'pleur maman'],
    response: "Baby blues vs dépression post-partum :\n\n**Baby blues (50-80% des mamans) :**\n• Début : 2-5 jours après l'accouchement\n• Durée : quelques jours à 2 semaines\n• Symptômes : pleurs, émotivité, fatigue\n• Résolution spontanée\n\n**Dépression post-partum (10-20%) :**\n• Début : semaines ou mois après la naissance\n• Symptômes persistants > 2 semaines\n• Tristesse profonde, culpabilité\n• Difficultés à s'attacher au bébé\n• Pensées négatives récurrentes\n\n🚨 **Consultez si :**\n• Symptômes > 2 semaines\n• Pensées de vous faire du mal ou au bébé\n• Incapacité à fonctionner au quotidien\n\n💬 La dépression post-partum se soigne très bien avec une aide adaptée.",
    category: 'bienetre'
  },
  {
    keywords: ['couple', 'relation', 'intimité', 'père', 'papa'],
    response: "Préserver son couple après l'arrivée de bébé :\n\n**Défis courants :**\n• Fatigue et manque de temps à deux\n• Répartition des tâches\n• Intimité chamboulée\n• Communication difficile\n\n**Conseils :**\n• Préservez des moments à deux, même courts\n• Communiquez ouvertement sur vos besoins\n• Répartissez équitablement les responsabilités\n• Acceptez que l'intimité évolue\n• Faites équipe, pas compétition\n• Demandez de l'aide extérieure si tension\n\n**Pour le papa :**\n• Le lien avec bébé se construit aussi\n• Impliquez-vous dès le début\n• Soutenez votre partenaire\n• Créez vos propres rituels avec bébé",
    category: 'bienetre'
  },
  {
    keywords: ['gentle parenting', 'parentalité douce', 'bienveillance', 'positive', 'éducation'],
    response: "La parentalité positive (gentle parenting) :\n\n**Principes fondamentaux :**\n• **Empathie** : Se mettre à la place de l'enfant\n• **Respect** : L'enfant est une personne à part entière\n• **Limites bienveillantes** : Cadre ferme sans punition\n• **Communication** : Verbaliser les émotions\n• **Renforcement positif** : Valoriser les bons comportements\n\n**Ce que ce n'est PAS :**\n• Laxisme ou absence de règles\n• Tout céder à l'enfant\n• Éviter toute frustration\n\n**En pratique :**\n• \"Je vois que tu es en colère\" (validation)\n• \"On ne tape pas, ça fait mal\" (limite claire)\n• \"Tu peux taper sur ce coussin\" (alternative)\n\n📖 Consultez notre article détaillé sur le sujet dans la section Articles !",
    category: 'bienetre'
  },

  // ============================================
  // SECTION: OFFRES ET RESSOURCES
  // ============================================
  {
    keywords: ['offres gratuites', 'coupons', 'échantillons', 'gratuit', 'promo'],
    response: "Offres gratuites pour les jeunes parents :\n\n**Au Canada/Québec :**\n• 🍼 **Enfamil** : Trousse de bienvenue + coupons\n• 🧷 **Huggies** : Échantillons de couches\n• 🎀 **Pampers** : Programme de récompenses\n• 🍎 **Nestlé Bébé** : Coffret découverte\n• 🧸 **Similac** : Trousse gratuite\n\n**Comment en profiter :**\n• Inscription sur les sites des marques\n• Registres de naissance (Amazon, Babies R Us)\n• PMI et maternités\n\n📦 Consultez notre page \"Offres Gratuites\" pour les liens directs et les dernières promotions disponibles !",
    category: 'ressources'
  },
  {
    keywords: ['ebook', 'livre', 'lecture', 'guide', 'télécharger'],
    response: "E-books gratuits disponibles sur BabyBaby :\n\n📚 **Nos guides pratiques :**\n• \"Les 6 premiers mois - Guide complet\"\n• \"Le sommeil du bébé\"\n• \"Gentle Parenting - L'approche bienveillante\"\n• \"Coliques du bébé - Comprendre et soulager\"\n• \"Au-delà du plastique - Guide écologique\"\n• \"Les étapes clés du développement\"\n\n**Téléchargement :**\n• Formats PDF téléchargeables\n• Consultables hors ligne\n• Entièrement gratuits\n\n📖 Rendez-vous dans la section \"E-books\" de l'application pour accéder à toute la bibliothèque !",
    category: 'ressources'
  },

  // ============================================
  // SECTION: COMPTE ET SUPPORT
  // ============================================
  {
    keywords: ['compte', 'inscription', 'connexion', 'inscrire', 'créer'],
    response: "Créer un compte BabyBaby :\n\n**Étapes :**\n1. Cliquez sur \"Se connecter\" en haut à droite\n2. Sélectionnez \"Créer un compte\"\n3. Entrez votre e-mail et créez un mot de passe\n4. Confirmez via l'e-mail reçu\n\n**Avantages du compte :**\n• Sauvegarde de vos données\n• Synchronisation multi-appareils\n• Accès à toutes les fonctionnalités\n• Forum communautaire\n• Newsletters et alertes personnalisées\n\n**Confidentialité :**\n• Données chiffrées et sécurisées\n• Aucun partage sans consentement\n• Export et suppression possibles à tout moment",
    category: 'application'
  },
  {
    keywords: ['problème', 'bug', 'aide', 'support', 'erreur', 'contact'],
    response: "Besoin d'aide ? Voici comment nous joindre :\n\n**Support technique :**\n📧 support@babybaby.org\n📞 Disponible du lundi au vendredi, 9h-18h\n⏱️ Réponse sous 24h\n\n**Problèmes courants :**\n• Videz le cache de votre navigateur\n• Essayez une connexion/déconnexion\n• Vérifiez votre connexion internet\n• Mettez l'application à jour\n\n**FAQ :**\nConsultez notre page FAQ pour les questions fréquentes !\n\n📝 Pour signaler un bug, précisez :\n• Votre appareil et navigateur\n• Les étapes pour reproduire le problème\n• Des captures d'écran si possible",
    category: 'application'
  },
  {
    keywords: ['paiement', 'abonnement', 'premium', 'prix', 'tarif'],
    response: "Les offres BabyBaby :\n\n**Version gratuite :**\n• Tableau de bord basique\n• Suivi de croissance\n• Articles et ressources\n• Outils essentiels\n• Forum communautaire\n\n**Version Premium :**\n• Toutes les fonctionnalités gratuites\n• Accès à tous les cours vidéo\n• E-books exclusifs\n• Stockage illimité\n• Exports de données\n• Absence de publicités\n• Support prioritaire\n\n💳 Consultez la section \"Abonnement\" dans votre compte pour les tarifs actuels et les offres promotionnelles.",
    category: 'application'
  },
  {
    keywords: ['confidentialité', 'données', 'sécurité', 'rgpd', 'vie privée'],
    response: "Protection de vos données chez BabyBaby :\n\n**Nos engagements :**\n🔒 Données chiffrées (SSL/TLS)\n🏢 Serveurs sécurisés en Europe\n🚫 Aucune vente de données\n✅ Conformité RGPD\n\n**Vos droits :**\n• Accéder à toutes vos données\n• Les modifier ou corriger\n• Les exporter (format standard)\n• Les supprimer définitivement\n\n**Comment exercer vos droits :**\n• Paramètres du compte → \"Mes données\"\n• Contact : privacy@babybaby.org\n\n👶 Les données de vos enfants sont particulièrement protégées et ne sont jamais utilisées à des fins commerciales.",
    category: 'application'
  }
];

// Fonction pour trouver la meilleure réponse basée sur les mots-clés
export const findBestResponse = (userMessage: string): string | null => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Score chaque entrée de la base de connaissances
  let bestMatch: { entry: KnowledgeEntry; score: number } | null = null;
  
  for (const entry of knowledgeBase) {
    let score = 0;
    
    for (const keyword of entry.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        // Plus de poids pour les mots-clés plus longs (plus spécifiques)
        score += keyword.length;
      }
    }
    
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { entry, score };
    }
  }
  
  return bestMatch ? bestMatch.entry.response : null;
};

// Fonction pour obtenir des suggestions de questions
export const getSuggestedQuestions = (category?: string): string[] => {
  const suggestions = [
    "Comment aider mon bébé à mieux dormir ?",
    "Quand commencer la diversification alimentaire ?",
    "Quels sont les signes de coliques ?",
    "Comment suivre la croissance de mon bébé ?",
    "Quels vaccins sont obligatoires ?",
    "Comment sécuriser ma maison pour bébé ?",
    "Qu'est-ce que la parentalité positive ?",
    "Quels sont les outils disponibles dans l'application ?",
    "Comment gérer les réveils nocturnes ?",
    "À quel âge bébé commence à marcher ?"
  ];
  
  // Retourne 4 suggestions aléatoires
  return suggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
};
