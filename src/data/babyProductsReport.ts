// Types for the baby products report
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  rank: number;
  tagline: string;
  description: string;
  price?: string;
  pros?: string[];
  cons?: string[];
  imageUrl?: string;
  affiliateLink?: string;
  specifications?: Record<string, string>;
}

export interface ProductCategory {
  id: string;
  title: string;
  slug: string;
  description: string;
  marketAnalysis: string[];
  products: Product[];
  comparisonTable?: {
    headers: string[];
    rows: Record<string, string>[];
  };
}

export const reportMetadata = {
  title: "Les meilleurs produits pour bébé à acheter en 2026",
  shortTitle: "Les meilleurs produits pour bébé à acheter en 2026",
  description: "Guide complet des meilleurs produits pour bébé en 2026 : analyse de 10 catégories, avis d'experts et recommandations pour les parents canadiens et québécois.",
  publishDate: "2026-01-15",
  updateDate: "2026-01-15",
  author: "BabyBaby Expert Team",
  keywords: [
    "comparatif produits bébé 2026",
    "meilleurs produits bébé Canada",
    "guide achat puériculture Québec",
    "tire-lait Canada",
    "siège auto bébé",
    "poussette hiver Québec",
    "babyphone sécurisé",
    "chaise haute ergonomique",
    "porte-bébé physiologique",
    "couches écologiques Québec"
  ]
};

export const introContent = {
  mainTitle: "Rapport Stratégique Global",
  subtitle: "L'État du Marché de la Puériculture au Québec et au Canada – Horizon 2026",
  introduction: `L'année 2026 marque un tournant décisif dans l'industrie de la puériculture au Canada, et plus spécifiquement au Québec. L'analyse croisée des tendances de consommation, des évolutions réglementaires de Transports Canada et des retours d'expérience de milliers de parents révèle un marché qui ne se contente plus de répondre à des besoins primaires.`,
  keyFactors: [
    {
      title: "Rigueur Climatique",
      description: "La capacité de l'équipement à performer dans des conditions hivernales extrêmes (neige, gadoue, températures négatives) reste le filtre premier de la qualité au Québec.",
      icon: "snowflake"
    },
    {
      title: "Conscience Éco-Sanitaire",
      description: "La peur des microplastiques et des perturbateurs endocriniens propulse les matériaux nobles comme le verre, le silicone de grade médical et les textiles biologiques.",
      icon: "leaf"
    },
    {
      title: "Polarisation Technologique",
      description: "Une scission claire entre des parents plébiscitant la \"High-Tech\" et ceux prônant un retour au \"Low-Tech\" fiable.",
      icon: "cpu"
    }
  ]
};

export const productCategories: ProductCategory[] = [
  {
    id: "tire-laits",
    title: "Tire-Laits",
    slug: "tire-laits",
    description: "L'allaitement et l'expression du lait maternel représentent l'un des segments les plus techniques et émotionnellement chargés de la puériculture.",
    marketAnalysis: [
      "L'opposition entre les pompes de \"grade hospitalier\" traditionnelles et les nouvelles technologies \"wearable\" (portables) définit l'offre actuelle.",
      "Le Spectra, reconnu mondialement et par les consultantes en lactation comme la référence absolue, reste confronté à des défis logistiques au Canada.",
      "Les tire-laits portables ont explosé en popularité, mais ne devraient pas constituer le seul moyen d'expression pour une mère qui tire son lait exclusivement."
    ],
    comparisonTable: {
      headers: ["Caractéristique", "Spectra S1 Plus", "Medela Freestyle", "Momcozy M5", "Medela Harmony"],
      rows: [
        { "Caractéristique": "Type", "Spectra S1 Plus": "Électrique Double (Grade Hospitalier)", "Medela Freestyle": "Électrique Double (Portable)", "Momcozy M5": "Wearable (Tout-en-un)", "Medela Harmony": "Manuel" },
        { "Caractéristique": "Portabilité", "Spectra S1 Plus": "Moyenne", "Medela Freestyle": "Haute", "Momcozy M5": "Excellente", "Medela Harmony": "Excellente" },
        { "Caractéristique": "Technologie", "Spectra S1 Plus": "Vibration douce, cycles ajustables", "Medela Freestyle": "2-Phase Expression", "Momcozy M5": "Succion rythmique", "Medela Harmony": "Manuel" },
        { "Caractéristique": "Fiabilité", "Spectra S1 Plus": "Très Élevée", "Medela Freestyle": "Moyenne", "Momcozy M5": "Bonne", "Medela Harmony": "Indestructible" },
        { "Caractéristique": "Prix (CAD)", "Spectra S1 Plus": "250$ - 300$", "Medela Freestyle": "450$ - 500$", "Momcozy M5": "200$ - 250$", "Medela Harmony": "40$ - 60$" }
      ]
    },
    products: [
      {
        id: "spectra-s1-plus",
        name: "Spectra S1 Plus",
        brand: "Spectra",
        category: "tire-laits",
        rank: 1,
        tagline: "Le Meilleur Choix Global",
        description: "Le Spectra S1 Plus conserve sa couronne en 2026. Il représente le meilleur équilibre entre puissance \"clinique\" et autonomie. Sa batterie rechargeable intégrée offre environ 3 heures de pompage, libérant les mères de la prise murale sans sacrifier la puissance d'aspiration (jusqu'à 270 mmHg).",
        price: "250$ - 300$",
        imageUrl: "/lovable-uploads/spectra-s1-plus.jpg",
        affiliateLink: "https://a.co/d/7IXOTs7",
        pros: ["Batterie rechargeable intégrée", "Mode massage efficace", "Puissance grade hospitalier", "Réglages personnalisables"],
        cons: ["Volumineux", "Disponibilité variable au Canada"]
      },
      {
        id: "medela-harmony",
        name: "Medela Harmony",
        brand: "Medela",
        category: "tire-laits",
        rank: 2,
        tagline: "Le Meilleur Choix Manuel / Budget",
        description: "Souvent sous-estimé, le Medela Harmony est un outil essentiel dans l'arsenal de toute mère allaitante. Sa poignée ergonomique pivotante permet de simuler manuellement les deux phases de succion.",
        price: "40$ - 60$",
        imageUrl: "/lovable-uploads/medela-harmony.jpg",
        affiliateLink: "https://a.co/d/ezkfddI",
        pros: ["Économique", "Silencieux", "Portable", "Compatible biberons Medela"],
        cons: ["Manuel (fatigue possible)"]
      },
      {
        id: "momcozy-m5",
        name: "Momcozy M5",
        brand: "Momcozy",
        category: "tire-laits",
        rank: 3,
        tagline: "Le Meilleur Choix Wearable",
        description: "Le Momcozy M5 s'impose comme le leader du segment portable grâce à son rapport performance/prix agressif. Le design discret \"Baby Mouth\" tente d'imiter la succion naturelle.",
        price: "200$ - 250$",
        imageUrl: "/lovable-uploads/momcozy-m5.jpg",
        affiliateLink: "https://a.co/d/axD8NnI",
        pros: ["Mains libres", "Design discret", "Rapport qualité/prix", "Portable"],
        cons: ["Ne remplace pas un tire-lait de table pour usage exclusif"]
      }
    ]
  },
  {
    id: "sieges-auto-convertibles",
    title: "Sièges Auto Convertibles",
    slug: "sieges-auto-convertibles",
    description: "La sécurité automobile des enfants est un domaine où les compromis sont impossibles. Le marché est traversé par une tension entre l'innovation ergonomique et la rigueur sécuritaire.",
    marketAnalysis: [
      "Les experts CPST martèlent un message clair : la sécurité maximale réside dans le maintien de la position dos à la route le plus longtemps possible, idéalement jusqu'à 4 ou 5 ans.",
      "L'année 2025-2026 a été marquée par des turbulences dans le segment des sièges rotatifs, notamment avec le cas de l'Evenflo Revolve360.",
      "La marque canadienne Clek représente le summum de la sécurité passive avec leur structure en acier et barre anti-rebond."
    ],
    products: [
      {
        id: "graco-extend2fit",
        name: "Graco Extend2Fit",
        brand: "Graco",
        category: "sieges-auto-convertibles",
        rank: 1,
        tagline: "Le Meilleur Rapport Sécurité/Prix",
        description: "Le choix rationnel par excellence. Il offre les limites de poids dos à la route les plus élevées du marché (50 lbs), surpassant des sièges trois fois plus chers. Son panneau d'extension de jambes résout la plainte numéro un des parents.",
        pros: ["50 lbs dos à la route", "Panneau d'extension jambes", "Installation simple", "Compact"],
        cons: ["Moins premium que Clek"]
      },
      {
        id: "clek-foonf",
        name: "Clek Foonf",
        brand: "Clek",
        category: "sieges-auto-convertibles",
        rank: 2,
        tagline: "Le Meilleur Siège Premium",
        description: "Fabriqué au Canada, le Foonf est une merveille d'ingénierie. Son système d'installation rigide (Rigid LATCH) et sa barre anti-rebond en font un investissement de premier ordre pour la sécurité.",
        pros: ["Fabriqué au Canada", "Installation quasi-instantanée", "Barre anti-rebond", "Durabilité 9 ans", "Ultra-étroit (3 de large)"],
        cons: ["Lourd", "Prix élevé"]
      },
      {
        id: "britax-one4life",
        name: "Britax One4Life ClickTight",
        brand: "Britax",
        category: "sieges-auto-convertibles",
        rank: 3,
        tagline: "Le Meilleur Tout-en-un Facile à Installer",
        description: "Britax résout le problème d'installation avec sa technologie ClickTight : on soulève l'assise, on passe la ceinture, on referme, et c'est verrouillé. Un siège robuste de la naissance jusqu'au réhausseur.",
        pros: ["Installation ClickTight infaillible", "De la naissance à 10 ans", "Protection latérale multicouche"],
        cons: ["Encombrant"]
      }
    ]
  },
  {
    id: "coquilles",
    title: "Sièges Auto pour Bébé (Coquilles)",
    slug: "coquilles",
    description: "La majorité des parents canadiens optent pour une coquille pour la première année. La raison est climatique et pratique : pouvoir installer bébé au chaud dans la maison puis clipser le siège dans la voiture.",
    marketAnalysis: [
      "La jambe de force et la barre anti-rebond sont devenues les standards de sécurité avancée en 2026.",
      "Pour les citadins, le poids de la coquille est crucial, avec des modèles pesant parfois moins de 6 livres."
    ],
    products: [
      {
        id: "clek-liing",
        name: "Clek Liing",
        brand: "Clek",
        category: "coquilles",
        rank: 1,
        tagline: "La Référence Technique",
        description: "Conçu et fabriqué au Canada, le Liing offre une base équipée d'une jambe de force métallique et d'un système d'ajustement de l'inclinaison (jusqu'à 7 positions).",
        pros: ["Jambe de force métallique", "7 positions d'inclinaison", "Fabriqué au Canada", "Compatible poussettes haut de gamme"],
        cons: ["Prix premium"]
      },
      {
        id: "nuna-pipa-rx",
        name: "Nuna PIPA RX",
        brand: "Nuna",
        category: "coquilles",
        rank: 2,
        tagline: "Le Meilleur pour la Ville",
        description: "Le PIPA RX se distingue par sa base \"RELX\" polyvalente et sa capacité à être installé sans base de manière très sécuritaire. Idéal pour les taxis et voyages en avion.",
        pros: ["Ultra-léger", "Installation sans base possible", "Dream Drape intégré", "Finitions luxueuses (laine mérinos)"],
        cons: ["Prix élevé"]
      },
      {
        id: "graco-snugride",
        name: "Graco SnugRide SnugLock 35 DLX",
        brand: "Graco",
        category: "coquilles",
        rank: 3,
        tagline: "Le Meilleur Budget / Fiabilité",
        description: "Graco prouve que la sécurité n'est pas réservée à l'élite. La technologie SnugLock rend l'installation extrêmement simple et solide.",
        pros: ["Excellent rapport qualité/prix", "Installation SnugLock simple", "Écosystème poussettes vaste"],
        cons: ["Plus lourd", "Moins raffiné"]
      }
    ]
  },
  {
    id: "biberons",
    title: "Biberons",
    slug: "biberons",
    description: "L'année 2026 confirme le déclin du plastique dans l'alimentation infantile. Les parents se tournent massivement vers le verre borosilicate et le silicone.",
    marketAnalysis: [
      "Le verre borosilicate résiste aux chocs thermiques brutaux, est inerte, ne se raye pas et ne retient pas les odeurs.",
      "Pour les bébés souffrant de RGO ou de coliques, le système de ventilation interne de Dr. Brown's reste inégalé cliniquement."
    ],
    products: [
      {
        id: "philips-avent-natural",
        name: "Philips Avent Natural Response (Verre)",
        brand: "Philips Avent",
        category: "biberons",
        rank: 1,
        tagline: "Le Meilleur Global",
        description: "Ce biberon a révolutionné le marché avec sa tétine \"Natural Response\" qui ne laisse couler le lait que lorsque le bébé exerce une compression active, réduisant le risque de confusion sein-tétine.",
        pros: ["Tétine Natural Response", "Verre durable", "Disponibilité excellente", "Ergonomique"],
        cons: ["Fragile si mal manipulé"]
      },
      {
        id: "dr-browns-options",
        name: "Dr. Brown's Options+ Wide-Neck (Verre)",
        brand: "Dr. Brown's",
        category: "biberons",
        rank: 2,
        tagline: "Le Spécialiste Anti-Colique",
        description: "Le biberon vers lequel les parents se tournent en désespoir de cause lors des crises de coliques. Le système de ventilation interne réduit l'ingestion d'air.",
        pros: ["Système anti-colique éprouvé", "Col large plus physiologique", "Verre sans plastique"],
        cons: ["Nettoyage plus fastidieux", "Nombreuses pièces"]
      },
      {
        id: "comotomo",
        name: "Comotomo",
        brand: "Comotomo",
        category: "biberons",
        rank: 3,
        tagline: "La Meilleure Transition Sein-Biberon",
        description: "Pour ceux qui trouvent le verre trop lourd, le Comotomo en silicone médical offre un corps mou rappelant la texture de la peau. Souvent le biberon de la \"dernière chance\".",
        pros: ["Silicone médical souple", "Nettoyage facile sans goupillon", "Transition sein-biberon"],
        cons: ["Moins durable que le verre"]
      }
    ]
  },
  {
    id: "babyphones",
    title: "Babyphones (Moniteurs)",
    slug: "babyphones",
    description: "La surveillance de bébé en 2026 est un champ de bataille entre la cybersécurité et la Data. Faut-il privilégier une connexion inviolable ou des données de santé avancées?",
    marketAnalysis: [
      "Face aux histoires de caméras IP piratées, une large part du marché revient aux moniteurs utilisant la technologie FHSS (ondes radio locales cryptées).",
      "Les moniteurs intelligents comme le Nanit Pro utilisent la vision par ordinateur pour analyser le sommeil de l'enfant."
    ],
    products: [
      {
        id: "eufy-spaceview",
        name: "Eufy SpaceView Pro / S340",
        brand: "Eufy",
        category: "babyphones",
        rank: 1,
        tagline: "La Fiabilité Absolue (Non-WiFi)",
        description: "Le moniteur vidéo \"plug-and-play\" par excellence. Définition 2K, excellente vision nocturne, portée traversant les murs épais. Zéro soucis de sécurité.",
        pros: ["Non-WiFi (sécurisé)", "Définition 2K", "Excellente portée", "Batterie longue durée"],
        cons: ["Pas de fonctionnalités connectées"]
      },
      {
        id: "nanit-pro",
        name: "Nanit Pro",
        brand: "Nanit",
        category: "babyphones",
        rank: 2,
        tagline: "Le Coach Intelligent (WiFi)",
        description: "Se distingue par sa vue plongeante parfaite et son application offrant des résumés vidéo de la nuit et des alertes de mouvement respiratoire très précises.",
        pros: ["Analyse du sommeil par IA", "Vue bird's eye", "Application aboutie", "Coaching sommeil"],
        cons: ["Nécessite WiFi", "Prix premium", "Risques cybersécurité potentiels"]
      },
      {
        id: "vtech-dm1211",
        name: "VTech DM1211",
        brand: "VTech",
        category: "babyphones",
        rank: 3,
        tagline: "L'Essentiel Audio",
        description: "Utilise la technologie DECT 6.0 pour un son cristallin sans interférences. Portée souvent double des moniteurs vidéo. Idéal pour les voyages.",
        price: "< 80$",
        pros: ["Son cristallin DECT 6.0", "Portée excellente", "Budget friendly", "Robuste"],
        cons: ["Audio uniquement"]
      }
    ]
  },
  {
    id: "poussettes",
    title: "Poussettes",
    slug: "poussettes",
    description: "Choisir une poussette au Québec est un exercice de gestion des contraintes. Elle doit être maniable dans les allées étroites mais capable de franchir un banc de neige en janvier.",
    marketAnalysis: [
      "Une poussette avec de petites roues en plastique dur est inutilisable quatre mois par an au Québec.",
      "La catégorie \"Crossover\" domine le marché en 2026.",
      "La UPPAbaby Vista reste le statut-symbole ultime grâce à sa modularité."
    ],
    products: [
      {
        id: "uppababy-vista",
        name: "UPPAbaby Vista V2 / V3",
        brand: "UPPAbaby",
        category: "poussettes",
        rank: 1,
        tagline: "L'Investissement Familial",
        description: "La poussette \"à tout faire\". Elle vient avec un berceau approuvé pour le sommeil de nuit. Se convertit en poussette double. Panier gigantesque (30 lbs). Service client légendaire.",
        pros: ["Berceau approuvé sommeil", "Convertible en double", "Panier 30 lbs", "Service client excellent", "Valeur de revente"],
        cons: ["Prix élevé", "Roues moyennes pour neige profonde"]
      },
      {
        id: "bumbleride-indie",
        name: "Bumbleride Indie / Era",
        brand: "Bumbleride",
        category: "poussettes",
        rank: 2,
        tagline: "La Tout-Terrain Hivernale",
        description: "Si vous vivez en banlieue ou aimez les sentiers, la Bumbleride est supérieure. Vrais pneus gonflables, engagement écologique fort (tissus recyclés).",
        pros: ["Pneus gonflables", "Performance neige/glace excellente", "Engagement écologique", "Siège réversible (Era)"],
        cons: ["Moins compacte"]
      },
      {
        id: "thule-urban-glide-3",
        name: "Thule Urban Glide 3",
        brand: "Thule",
        category: "poussettes",
        rank: 3,
        tagline: "La Reine de l'Activité",
        description: "La poussette la plus maniable du marché, se pousse d'un doigt. Frein à main rotatif indispensable pour les côtes glacées. Qualité suédoise.",
        pros: ["Maniabilité exceptionnelle", "Frein à main", "Légère pour une joggeuse", "Qualité suédoise"],
        cons: ["Moins modulaire"]
      }
    ]
  },
  {
    id: "couches",
    title: "Couches",
    slug: "couches",
    description: "Le marché de la couche en 2026 est un miroir des préoccupations écologiques. Le Québec se distingue par un taux d'adoption des couches lavables très élevé.",
    marketAnalysis: [
      "La marque québécoise Attitude propose une couche jetable biodégradable à plus de 50%, exempte de chlore et parfums.",
      "Les couches Kirkland Signature de Costco offrent une performance premium pour un prix imbattable.",
      "Les couches lavables bénéficient souvent de subventions municipales couvrant jusqu'à 50% de l'achat."
    ],
    products: [
      {
        id: "attitude",
        name: "Attitude",
        brand: "Attitude",
        category: "couches",
        rank: 1,
        tagline: "L'Éco-Responsable Québécoise",
        description: "Pour les parents qui veulent du jetable sans culpabilité environnementale. Douces, hypoallergéniques et produites par une entreprise locale certifiée carboneutre.",
        pros: ["Biodégradable 50%+", "Entreprise québécoise carboneutre", "Sans chlore ni parfums", "Hypoallergéniques"],
        cons: ["Prix plus élevé"]
      },
      {
        id: "kirkland-signature",
        name: "Kirkland Signature (Costco)",
        brand: "Kirkland",
        category: "couches",
        rank: 2,
        tagline: "La Valeur Sûre",
        description: "Le choix du pragmatisme. Non parfumées, extrêmement absorbantes (crucial pour les nuits de 12h) et économies de centaines de dollars par an.",
        pros: ["Prix imbattable", "Absorption excellente", "Non parfumées", "Anti-fuites nuit"],
        cons: ["Pas écologique"]
      },
      {
        id: "la-petite-ourse",
        name: "La Petite Ourse / Mère Hélène",
        brand: "Marques locales",
        category: "couches",
        rank: 3,
        tagline: "Le Lavable Facile",
        description: "Ces marques locales dominent le lavable grâce à des kits de démarrage complets. Couches à poche avec double gousset anti-fuite. Excellente valeur de revente.",
        pros: ["Économies long terme", "Subventions municipales", "Écologique", "Valeur de revente"],
        cons: ["Investissement initial", "Entretien"]
      }
    ]
  },
  {
    id: "porte-bebes",
    title: "Porte-Bébés",
    slug: "porte-bebes",
    description: "Le portage physiologique est devenu une norme culturelle. Les parents cherchent des produits respectant la physiologie de l'enfant tout en étant esthétiquement plaisants.",
    marketAnalysis: [
      "Pour les nouveau-nés (0-3 mois), les écharpes extensibles comme Beluga Baby ont redéfini la catégorie.",
      "Une fois le bébé plus lourd, Ergobaby et Tula restent les leaders techniques, tandis que WildBird et Artipoppe introduisent une dimension fashion."
    ],
    products: [
      {
        id: "ergobaby-omni-breeze",
        name: "Ergobaby Omni Breeze",
        brand: "Ergobaby",
        category: "porte-bebes",
        rank: 1,
        tagline: "Le Plus Polyvalent",
        description: "Le couteau suisse du portage. Permet toutes les positions. Tissu SoftFlex Mesh le plus respirant du marché. S'ajuste du nouveau-né au bambin sans insert.",
        pros: ["Toutes positions", "Ultra-respirant", "Nouveau-né au bambin sans insert", "Ergonomique certifié"],
        cons: ["Look technique"]
      },
      {
        id: "beluga-baby-wrap",
        name: "Beluga Baby Wrap",
        brand: "Beluga Baby",
        category: "porte-bebes",
        rank: 2,
        tagline: "Le Cocon Nouveau-Né",
        description: "Fierté canadienne. Ce wrap est imbattable pour les trois premiers mois. Tissu bambou thermorégulateur et antibactérien, léger et respirant.",
        pros: ["Marque canadienne", "Bambou thermorégulateur", "Idéal peau-à-peau", "Léger et respirant"],
        cons: ["Courbe d'apprentissage", "Limité aux premiers mois"]
      },
      {
        id: "wildbird-aerial",
        name: "WildBird Aerial",
        brand: "WildBird",
        category: "porte-bebes",
        rank: 3,
        tagline: "L'Esthétique Ergonomique",
        description: "Ce porte-bébé hybride combine la facilité d'un porte-bébé à clips avec l'esthétique d'une écharpe en lin. Répartition du poids exceptionnelle.",
        pros: ["Esthétique élégante", "Lin luxueux", "Répartition poids optimale", "Style + fonction"],
        cons: ["Prix élevé"]
      }
    ]
  },
  {
    id: "sacs-a-langer",
    title: "Sacs à Langer",
    slug: "sacs-a-langer",
    description: "Le sac à langer de 2026 ne ressemble plus à un sac à langer. Il est unisexe, durable et conçu pour avoir une seconde vie comme sac de travail.",
    marketAnalysis: [
      "La marque montréalaise Lambert a totalement conquis le marché québécois avec ses sacs en cuir vegan.",
      "Lululemon a capturé le segment des parents sportifs avec le New Parent Backpack."
    ],
    products: [
      {
        id: "lambert-mia",
        name: "Lambert (Mia ou Raven)",
        brand: "Lambert",
        category: "sacs-a-langer",
        rank: 1,
        tagline: "Le Chic Québécois",
        description: "Le leader incontesté au Québec. Allie l'élégance de la maroquinerie urbaine à l'intelligence d'un sac de puériculture. Tapis à langer intégré, poches isothermes.",
        pros: ["Marque montréalaise", "Cuir vegan nettoyable", "Tapis à langer intégré", "Design élégant"],
        cons: ["Prix premium"]
      },
      {
        id: "lululemon-new-parent",
        name: "Lululemon New Parent Backpack",
        brand: "Lululemon",
        category: "sacs-a-langer",
        rank: 2,
        tagline: "Le Fonctionnel Actif",
        description: "Un sac pensé pour la vraie vie. Léger, résistant aux taches et confortable. Organisation intuitive. Design neutre partageable entre parents.",
        pros: ["Tissus techniques hydrofuges", "Organisation intuitive", "Design unisexe", "Robuste"],
        cons: ["Moins élégant que Lambert"]
      },
      {
        id: "poppy-peonies",
        name: "Poppy & Peonies (The Commuter)",
        brand: "Poppy & Peonies",
        category: "sacs-a-langer",
        rank: 3,
        tagline: "La Polyvalence Organisée",
        description: "Autre réussite canadienne. Se transforme (sac à dos ou bandoulière). Fente latérale pour accéder aux lingettes sans ouvrir le sac.",
        pros: ["Marque canadienne", "Transformable", "Accès lingettes latéral", "Excellent compromis"],
        cons: ["Moins connu"]
      }
    ]
  },
  {
    id: "chaises-hautes",
    title: "Chaises Hautes",
    slug: "chaises-hautes",
    description: "La chaise haute est vue comme un outil d'inclusion sociale. L'ergonomie posturale est reconnue comme essentielle pour sécuriser la déglutition.",
    marketAnalysis: [
      "La Stokke Tripp Trapp, créée en 1972, n'a jamais été égalée avec sa conception en \"Z\" ajustable.",
      "Pour les budgets serrés, la IKEA Antilop reste incontournable, mais nécessite un repose-pieds ajouté."
    ],
    products: [
      {
        id: "stokke-tripp-trapp",
        name: "Stokke Tripp Trapp",
        brand: "Stokke",
        category: "chaises-hautes",
        rank: 1,
        tagline: "La Référence Absolue",
        description: "La chaise qui grandit vraiment avec l'enfant (de 6 mois à l'âge adulte). Permet une posture assise active idéale pour la DME. Design intemporel, héritage familial.",
        pros: ["6 mois à adulte", "Ergonomie parfaite", "Design intemporel", "Valeur de revente 70-80%"],
        cons: ["Prix élevé", "Accessoires coûteux"]
      },
      {
        id: "abiie-beyond",
        name: "Abiie Beyond Wooden High Chair",
        brand: "Abiie",
        category: "chaises-hautes",
        rank: 2,
        tagline: "La Pratique et Ajustable",
        description: "Le meilleur concurrent de la Tripp Trapp. Ajustabilité similaire mais mécanisme plus simple (clips). Inclut souvent plateau et coussins dans le prix.",
        pros: ["Ajustement facile (clips)", "Plateau et coussins inclus", "Très facile à nettoyer"],
        cons: ["Moins iconique que Stokke"]
      },
      {
        id: "ikea-antilop",
        name: "IKEA Antilop (+ Repose-pieds)",
        brand: "IKEA",
        category: "chaises-hautes",
        rank: 3,
        tagline: "Le Hack Budgétaire",
        description: "À 30$, imbattable. Design monobloc sans recoins, le rêve après un repas de spaghettis. Avec un repose-pieds ajustable (30-40$), une chaise acceptable pour moins de 100$.",
        price: "~70$ avec repose-pieds",
        pros: ["Prix imbattable", "Ultra-facile à nettoyer", "Design simple"],
        cons: ["Nécessite repose-pieds (non inclus)", "Pas évolutive"]
      }
    ]
  }
];

export const conclusionContent = {
  title: "Conclusion",
  text: "Le paysage de la puériculture 2026 au Québec et au Canada est défini par une recherche de sens. Les parents votent avec leur portefeuille pour des produits qui durent (Stokke, Clek), qui protègent la santé de leur enfant et de la planète (Attitude, Biberons Verre), et qui soutiennent l'économie locale (Lambert, Beluga Baby). Dans un contexte économique inflationniste, la valeur ne se mesure plus au prix le plus bas, mais au coût par utilisation et à la valeur de revente."
};
