
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
  }
];
