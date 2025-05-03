import { Course } from "@/types/course";

export const courses: Course[] = [
  {
    id: "soin-nouveau-ne",
    title: "Soins essentiels pour nouveau-nés",
    description: "Apprenez les techniques essentielles pour prendre soin de votre nouveau-né, du bain à l'alimentation en passant par le sommeil et les soins de santé.",
    image: "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?q=80&w=1470&auto=format&fit=crop",
    duration: "3h20min",
    level: "Débutant",
    instructor: "Dr. Sophie Martin",
    category: "Soins",
    updatedAt: "15/04/2025",
    thematic: {
      id: "soins-par-age",
      name: "Soins de bébé par âge",
      position: 1,
      ageRange: "0-3 mois"
    },
    modules: [
      {
        id: "module-1",
        title: "Le bain et l'hygiène du nouveau-né",
        duration: "45min",
        content: `
          <h2>Le bain et l'hygiène du nouveau-né</h2>
          
          <p>Le bain est un moment privilégié pour créer un lien avec votre bébé. C'est aussi une étape importante pour son hygiène quotidienne. Voici comment procéder pour offrir une expérience agréable et sécuritaire à votre nouveau-né.</p>
          
          <h3>Préparation du bain</h3>
          
          <p>Avant de commencer, assurez-vous d'avoir tout le matériel nécessaire à portée de main:</p>
          
          <ul>
            <li>Une baignoire adaptée aux bébés</li>
            <li>Un savon doux spécial bébé (pH neutre)</li>
            <li>Des serviettes douces</li>
            <li>Des vêtements propres</li>
            <li>Une couche propre</li>
            <li>Une brosse à cheveux douce</li>
          </ul>
          
          <p>La température de l'eau doit être d'environ 37°C, ce qui correspond à la température corporelle du bébé. Utilisez toujours un thermomètre de bain pour vérifier la température. La pièce doit être chauffée à environ 22-24°C pour éviter que le bébé n'ait froid.</p>
          
          <h3>Étapes du bain</h3>
          
          <ol>
            <li>Déshabiller votre bébé en le gardant enveloppé dans une serviette, ne découvrant que les parties que vous lavez.</li>
            <li>Commencer par nettoyer son visage avec un gant de toilette humide, sans savon, en allant du centre vers l'extérieur.</li>
            <li>Pour les yeux, utilisez un coton différent pour chaque œil, en essuyant de l'intérieur vers l'extérieur.</li>
            <li>Nettoyez délicatement les oreilles en surface uniquement, sans introduire quoi que ce soit dans le conduit auditif.</li>
            <li>Immergez doucement votre bébé dans l'eau, en le tenant fermement par l'aisselle et en soutenant sa tête avec votre avant-bras.</li>
            <li>Lavez le corps avec un savon doux, en insistant sur les plis (cou, aisselles, aines).</li>
            <li>Rincez soigneusement pour éliminer tout résidu de savon.</li>
            <li>Sortez votre bébé de l'eau et enveloppez-le immédiatement dans une serviette chaude.</li>
          </ol>
          
          <h3>Soins après le bain</h3>
          
          <p>Après le bain, séchez délicatement votre bébé en tamponnant sa peau, sans frotter. N'oubliez pas les plis de peau où l'humidité peut causer des irritations. C'est le moment idéal pour appliquer une crème hydratante si la peau de votre bébé est sèche.</p>
          
          <p>Pour les soins du cordon ombilical (jusqu'à sa chute), nettoyez-le avec une compresse stérile imbibée d'antiseptique recommandé par votre pédiatre. Laissez-le sécher à l'air libre avant de remettre la couche.</p>
          
          <h3>Fréquence des bains</h3>
          
          <p>Pendant les premières semaines, 2 à 3 bains par semaine suffisent pour maintenir une bonne hygiène. Les jours sans bain, procédez à une toilette localisée des zones sensibles (visage, cou, siège). Trop de bains peuvent assécher la peau fragile de votre bébé.</p>
          
          <h3>Conseils pratiques</h3>
          
          <p>N'hésitez pas à parler et chanter pendant le bain pour rassurer votre bébé. Maintenez un contact visuel et rassurez-le par vos gestes doux et votre voix calme. Avec le temps, le bain deviendra un moment de plaisir partagé.</p>
        `,
        resources: [
          {
            id: "resource-1",
            title: "Guide PDF: Techniques de bain",
            type: "pdf",
            url: "/resources/guide-bain-bebe.pdf"
          },
          {
            id: "resource-2",
            title: "Vidéo: Démonstration du bain",
            type: "video",
            url: "https://www.youtube.com/watch?v=example"
          }
        ]
      },
      {
        id: "module-2",
        title: "L'alimentation du nouveau-né",
        duration: "55min",
        content: `<p>Contenu détaillé sur l'alimentation du nouveau-né...</p>`,
        resources: [
          {
            id: "resource-3",
            title: "Guide de l'allaitement",
            type: "pdf",
            url: "/resources/guide-allaitement.pdf"
          }
        ]
      },
      {
        id: "module-3",
        title: "Le sommeil et les rythmes",
        duration: "40min",
        content: `<p>Contenu détaillé sur le sommeil du nouveau-né...</p>`,
        resources: [
          {
            id: "resource-4",
            title: "Calendrier de suivi du sommeil",
            type: "pdf",
            url: "/resources/calendrier-sommeil.pdf"
          }
        ]
      },
      {
        id: "module-4",
        title: "Les soins médicaux de base",
        duration: "60min",
        content: `<p>Contenu détaillé sur les soins médicaux...</p>`,
        resources: []
      }
    ]
  },
  {
    id: "developpement-bebe",
    title: "Développement et éveil du bébé",
    description: "Découvrez les étapes clés du développement de votre bébé et apprenez à stimuler son éveil à travers des activités adaptées à chaque âge.",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1470&auto=format&fit=crop",
    duration: "2h45min",
    level: "Intermédiaire",
    instructor: "Émilie Durand",
    category: "Développement",
    updatedAt: "10/04/2025",
    thematic: {
      id: "developpement-par-age",
      name: "Développement de bébé par âge",
      position: 1,
      ageRange: "0-12 mois"
    },
    modules: [
      {
        id: "module-1",
        title: "Les étapes du développement moteur",
        duration: "40min",
        content: `<p>Contenu détaillé sur le développement moteur...</p>`,
        resources: []
      },
      {
        id: "module-2",
        title: "Stimulation cognitive et sensorielle",
        duration: "45min",
        content: `<p>Contenu détaillé sur la stimulation cognitive...</p>`,
        resources: []
      },
      {
        id: "module-3",
        title: "Jeux et activités par âge",
        duration: "30min",
        content: `<p>Contenu détaillé sur les jeux adaptés...</p>`,
        resources: []
      },
      {
        id: "module-4",
        title: "Repères et signaux d'alerte",
        duration: "50min",
        content: `<p>Contenu détaillé sur les repères de développement...</p>`,
        resources: []
      }
    ]
  },
  {
    id: "alimentation-diversifiee",
    title: "Introduction à l'alimentation diversifiée",
    description: "Apprenez à introduire progressivement les aliments solides dans l'alimentation de votre bébé, avec des recettes et conseils adaptés.",
    image: "https://images.unsplash.com/photo-1613125979311-0a208dc91c00?q=80&w=1470&auto=format&fit=crop",
    duration: "3h10min",
    level: "Débutant",
    instructor: "Nutritionniste Marie Leblanc",
    category: "Nutrition",
    updatedAt: "20/04/2025",
    thematic: {
      id: "alimentation-par-age",
      name: "Alimentation de bébé par âge",
      position: 2,
      ageRange: "6-12 mois"
    },
    modules: [
      {
        id: "module-1",
        title: "Quand et comment commencer la diversification",
        duration: "45min",
        content: `<p>Contenu détaillé sur le début de la diversification...</p>`,
        resources: []
      },
      {
        id: "module-2",
        title: "Les aliments recommandés par âge",
        duration: "40min",
        content: `<p>Contenu détaillé sur les aliments adaptés...</p>`,
        resources: []
      },
      {
        id: "module-3",
        title: "Recettes adaptées aux bébés",
        duration: "55min",
        content: `<p>Contenu détaillé avec des recettes...</p>`,
        resources: []
      },
      {
        id: "module-4",
        title: "Gérer les allergies et intolérances",
        duration: "50min",
        content: `<p>Contenu détaillé sur les allergies alimentaires...</p>`,
        resources: []
      }
    ]
  },
  {
    id: "sommeil-bebe-0-6",
    title: "Sommeil du bébé de 0 à 6 mois",
    description: "Techniques douces et efficaces pour aider votre nouveau-né à développer de saines habitudes de sommeil dès les premiers mois.",
    image: "/lovable-uploads/ccda2a74-7a35-4a2d-8bc3-7b8c2feb3139.png",
    duration: "2h30min",
    level: "Débutant",
    instructor: "Dr. Anne Lecorps",
    category: "Sommeil",
    updatedAt: "02/05/2025",
    thematic: {
      id: "sommeil-par-age",
      name: "Sommeil de bébé par âge",
      position: 1,
      ageRange: "0-6 mois"
    },
    modules: [
      {
        id: "module-1",
        title: "Comprendre les cycles de sommeil du nouveau-né",
        duration: "35min",
        content: `
          <h2>Comprendre les cycles de sommeil du nouveau-né</h2>
          
          <p>Le sommeil d'un nouveau-né est structuré de façon très différente de celui d'un adulte. Cette compréhension est fondamentale pour aider votre bébé à bien dormir.</p>
          
          <h3>Les états de veille et de sommeil</h3>
          
          <p>Les nouveau-nés alternent entre six états de conscience différents :</p>
          
          <ul>
            <li><strong>Sommeil profond</strong> : Respiration régulière, pas de mouvements oculaires, peu de mouvements corporels</li>
            <li><strong>Sommeil léger (paradoxal)</strong> : Mouvements oculaires rapides, respiration irrégulière, petits soubresauts</li>
            <li><strong>Somnolence</strong> : État intermédiaire entre sommeil et éveil</li>
            <li><strong>Éveil calme</strong> : Bébé est alerte mais calme</li>
            <li><strong>Éveil actif</strong> : Bébé est éveillé et actif</li>
            <li><strong>Pleurs</strong> : État d'éveil avec agitation maximale</li>
          </ul>
          
          <p>Ces états se succèdent selon des cycles plus courts que chez l'adulte (50-60 minutes contre 90 minutes). De plus, les nouveau-nés passent environ 50% de leur temps de sommeil en sommeil paradoxal, contre 20% chez l'adulte.</p>
          
          <h3>Les besoins de sommeil par âge</h3>
          
          <p>Entre 0 et 6 mois, les besoins de sommeil évoluent rapidement :</p>
          
          <ul>
            <li><strong>0-1 mois</strong> : 16-18 heures par jour en cycles de 2-3 heures</li>
            <li><strong>1-3 mois</strong> : 15-17 heures avec des périodes de sommeil nocturne qui s'allongent progressivement</li>
            <li><strong>3-6 mois</strong> : 14-16 heures avec 2-3 siestes et une période nocturne plus longue</li>
          </ul>
          
          <h3>Rythme circadien en développement</h3>
          
          <p>À la naissance, le bébé n'a pas encore développé son rythme circadien (horloge biologique). Cette horloge se met en place progressivement pendant les 3-4 premiers mois. Avant cela, le sommeil est distribué de façon assez aléatoire entre le jour et la nuit.</p>
          
          <p>Pour favoriser le développement du rythme circadien :</p>
          
          <ul>
            <li>Exposez bébé à la lumière naturelle pendant la journée</li>
            <li>Maintenez un environnement calme et sombre la nuit</li>
            <li>Évitez de stimuler bébé pendant les tétées nocturnes</li>
          </ul>
          
          <h3>Reconnaître les signes de fatigue</h3>
          
          <p>Apprendre à identifier les premiers signes de fatigue est essentiel pour mettre bébé au lit au bon moment :</p>
          
          <ul>
            <li>Frottement des yeux</li>
            <li>Bâillements</li>
            <li>Regard dans le vide</li>
            <li>Agitation ou hyperactivité</li>
            <li>Pleurs plus facilement</li>
          </ul>
          
          <p>Si vous attendez l'apparition des pleurs intenses, il est souvent trop tard : bébé est déjà en surstimulation et aura plus de mal à s'endormir.</p>
        `,
        resources: [
          {
            id: "resource-1",
            title: "Tableau des besoins de sommeil par âge",
            type: "pdf",
            url: "/resources/besoins-sommeil-par-age.pdf"
          }
        ]
      },
      {
        id: "module-2",
        title: "Créer un environnement propice au sommeil",
        duration: "30min",
        content: `<p>Contenu détaillé sur l'environnement de sommeil idéal...</p>`,
        resources: []
      },
      {
        id: "module-3",
        title: "Techniques d'apaisement et routines",
        duration: "45min",
        content: `<p>Contenu détaillé sur les routines d'endormissement...</p>`,
        resources: []
      },
      {
        id: "module-4",
        title: "Gérer les réveils nocturnes",
        duration: "40min",
        content: `<p>Contenu détaillé sur la gestion des réveils...</p>`,
        resources: []
      }
    ]
  },
  {
    id: "sommeil-bebe-6-12",
    title: "Sommeil du bébé de 6 à 12 mois",
    description: "Comment gérer la régression du sommeil et établir des routines efficaces pour les bébés plus âgés.",
    image: "/lovable-uploads/ccda2a74-7a35-4a2d-8bc3-7b8c2feb3139.png",
    duration: "2h15min",
    level: "Intermédiaire",
    instructor: "Dr. Anne Lecorps",
    category: "Sommeil",
    updatedAt: "03/05/2025",
    thematic: {
      id: "sommeil-par-age",
      name: "Sommeil de bébé par âge",
      position: 2,
      ageRange: "6-12 mois"
    },
    modules: [
      {
        id: "module-1",
        title: "La régression du sommeil : comprendre et gérer",
        duration: "40min",
        content: `<p>Contenu détaillé sur la régression du sommeil...</p>`,
        resources: []
      },
      {
        id: "module-2",
        title: "Routines adaptées pour les 6-12 mois",
        duration: "35min",
        content: `<p>Contenu détaillé sur les routines...</p>`,
        resources: []
      },
      {
        id: "module-3",
        title: "Gestion des siestes et transitions",
        duration: "30min",
        content: `<p>Contenu détaillé sur les siestes...</p>`,
        resources: []
      },
      {
        id: "module-4",
        title: "L'apprentissage du sommeil autonome",
        duration: "30min",
        content: `<p>Contenu détaillé sur l'autonomie...</p>`,
        resources: []
      }
    ]
  }
];
