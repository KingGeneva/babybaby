import { Article } from '@/types/article';
import { diversificationAlimentairePilier } from './diversification_alimentaire_pilier';

// Liste des articles sur la nutrition
export const nutritionArticles: Article[] = [
  diversificationAlimentairePilier,
  {
    id: 10, // Changed ID to 10 so it appears first
    title: "Coliques du Bébé : Comprendre, Identifier et Soulager",
    excerpt: "Les coliques du nourrisson représentent l'un des défis les plus éprouvants pour de jeunes parents. Découvrez comment identifier et soulager ce trouble courant.",
    summary: "Guide complet pour comprendre, identifier et soulager les coliques de bébé.",
    content: `
# Coliques du Bébé : Comprendre, Identifier et Soulager

Les coliques du nourrisson représentent l'un des défis les plus éprouvants pour de jeunes parents. Entre pleurs inconsolables, inquiétudes constantes et nuits sans sommeil, cette période peut mettre à rude épreuve toute la famille. Pourtant, bien que pénibles, les coliques sont fréquentes et généralement sans danger.

## Qu'est-ce qu'une colique ?
On parle de coliques lorsqu'un bébé pleure de manière intense et imprévisible, souvent en soirée, pendant plus de 3 heures par jour, au moins 3 jours par semaine, et ce, sur une durée de plus de 3 semaines. Ces crises surviennent sans cause apparente, malgré des soins attentifs.

## Comment reconnaître les symptômes ?
Les pleurs sont perçants et soudains, accompagnés d'un visage rouge, d'un ventre ballonné, de gaz, et de gestes évocateurs : bébé se tortille, ramène ses genoux vers l'abdomen, serre les poings. Entre les crises, il mange et se développe normalement.

## Quelles sont les causes possibles ?
Les experts évoquent plusieurs hypothèses : un système digestif encore immature, une sensibilité alimentaire, l'ingestion d'air, un tempérament réactif ou même un microbiote intestinal déséquilibré. Bien que la cause exacte reste mystérieuse, ces pistes permettent d'explorer différentes solutions.

## Quelles solutions existent ?
Heureusement, il existe des gestes simples pour apaiser votre bébé :

- Le contact peau à peau
- L'emmaillotage
- Le bercement doux ou les sons blancs
- Le massage abdominal
- Une alimentation adaptée (sur avis médical)
- L'usage prudent de probiotiques ou de gouttes anti-gaz

Et surtout : ne restez pas seuls. Le soutien d'un professionnel de santé et de vos proches est précieux durant cette période.

## Envie d'aller plus loin ?
Pour découvrir en détail les causes, symptômes, mythes et solutions aux coliques du nourrisson, téléchargez dès maintenant notre eBook gratuit « Coliques du bébé ».
Un guide complet pour mieux comprendre et soulager votre bébé… et retrouver un peu de sérénité.
    `,
    image: "/lovable-uploads/b38422af-2f1b-4427-aad4-cee8e9d3d887.png",
    category: "Nutrition",
    date: "26 avril 2025",
    readingTime: 12,
    author: "Dr. Sophie Martin",
    views: 843,
    featured: true,
    tags: ["coliques", "nutrition", "digestion", "nouveau-né", "alimentation"]
  },
  {
    id: 2,
    title: "Les bienfaits de l'allaitement maternel",
    excerpt: "Découvrez pourquoi l'allaitement maternel est souvent recommandé par les pédiatres et comment il peut bénéficier autant à la mère qu'à son bébé.",
    summary: "Les avantages de l'allaitement pour la mère et le bébé, expliqués par des experts.",
    content: `# Les bienfaits de l'allaitement maternel

L'allaitement maternel est bien plus qu'un simple moyen de nourrir votre bébé. Il s'agit d'un processus complexe qui offre de nombreux avantages tant pour la mère que pour l'enfant. Voici un aperçu des bienfaits de cette pratique naturelle.

## Pour bébé

### Un système immunitaire renforcé
Le lait maternel contient des anticorps qui aident votre bébé à combattre les virus et les bactéries. Cette protection est particulièrement importante dans les premiers mois de la vie, lorsque le système immunitaire de bébé est encore en développement.

### Une digestion facilitée
Le lait maternel est plus facile à digérer que les préparations lactées. Il contient également des enzymes qui facilitent la digestion, ce qui peut aider à prévenir les coliques et les reflux.

### Un développement cognitif optimal
Des études ont montré que les bébés allaités ont de meilleurs résultats aux tests cognitifs plus tard dans la vie. Le lait maternel contient des acides gras essentiels qui favorisent le développement du cerveau.

## Pour la mère

### Une récupération post-accouchement plus rapide
L'allaitement stimule la production d'ocytocine, une hormone qui aide l'utérus à retrouver sa taille normale après l'accouchement.

### Une réduction du risque de certaines maladies
Les mères qui allaitent ont un risque réduit de développer certains types de cancer, notamment le cancer du sein et des ovaires.

### Un lien affectif renforcé
L'allaitement favorise un contact peau à peau régulier entre la mère et son bébé, ce qui peut contribuer à renforcer le lien affectif entre eux.

## Comment bien démarrer l'allaitement

### Préparez-vous avant la naissance
Informez-vous sur l'allaitement pendant votre grossesse. Suivez des cours prénatals, lisez des livres ou consultez un conseiller en lactation.

### Commencez tôt
Essayez d'allaiter votre bébé dans l'heure qui suit sa naissance. Ce "premier lait", appelé colostrum, est riche en nutriments et en anticorps.

### Trouvez une position confortable
Il existe plusieurs positions d'allaitement. Trouvez celle qui vous convient le mieux et assurez-vous que votre bébé prend correctement le sein.

### N'hésitez pas à demander de l'aide
Si vous rencontrez des difficultés, n'hésitez pas à consulter un professionnel de la santé ou un conseiller en lactation. De nombreux problèmes d'allaitement peuvent être résolus avec une aide appropriée.

## Conclusion

L'allaitement maternel est un choix personnel qui dépend de nombreux facteurs. Quelle que soit votre décision, l'important est que vous et votre bébé soyez en bonne santé et heureux. Si vous choisissez d'allaiter, sachez que cette pratique offre de nombreux avantages pour vous et votre enfant, et qu'il existe des ressources pour vous aider en cas de besoin.`,
    image: "/lovable-uploads/f17afad4-d5f6-413a-935d-83d0053d4541.png",
    category: "Nutrition",
    date: "10 avril 2025",
    readingTime: 10,
    author: "Dr. Marie Dupont",
    views: 1562,
    tags: ["allaitement", "nutrition", "nouveau-né", "santé"]
  },
  {
    id: 3,
    title: "La diversification alimentaire : quand et comment l'introduire",
    excerpt: "Apprenez à quels moments introduire de nouveaux aliments dans l'alimentation de votre bébé et découvrez les meilleures pratiques pour une diversification réussie.",
    summary: "Guide complet pour bien démarrer la diversification alimentaire de votre bébé.",
    content: `# La diversification alimentaire : quand et comment l'introduire

La diversification alimentaire est une étape importante dans le développement de votre bébé. Elle consiste à introduire progressivement des aliments solides dans son alimentation, en complément du lait maternel ou infantile. Voici un guide pour vous aider à aborder cette période avec sérénité.

## À quel âge commencer la diversification ?

L'Organisation Mondiale de la Santé (OMS) recommande de commencer la diversification alimentaire à partir de 6 mois révolus. Avant cet âge, le lait (maternel ou infantile) suffit à couvrir tous les besoins nutritionnels de votre bébé.

Cependant, chaque enfant est unique et certains signes peuvent indiquer qu'il est prêt à découvrir de nouveaux aliments :
- Il tient sa tête droite et est capable de rester assis avec un soutien
- Il manifeste de l'intérêt pour votre nourriture
- Il ouvre la bouche quand vous lui proposez une cuillère
- Il a perdu le réflexe d'extrusion (qui consiste à pousser les aliments hors de sa bouche avec sa langue)

## Par quels aliments commencer ?

### Les légumes
Commencez par des purées de légumes à la texture lisse et au goût doux : carotte, courgette, potiron... Proposez un légume à la fois pendant 2-3 jours pour détecter d'éventuelles intolérances.

### Les fruits
Après les légumes, introduisez les fruits cuits et mixés : pomme, poire, banane... Évitez d'ajouter du sucre.

### Les protéines
Vers 7-8 mois, vous pouvez introduire des protéines animales en petites quantités : viande, poisson, œuf (d'abord le jaune, puis le blanc).

### Les céréales et féculents
Le pain, les pâtes, le riz, la semoule peuvent être introduits progressivement, de préférence des versions complètes riches en fibres.

## Quelques conseils pratiques

### Respectez le rythme de votre bébé
N'forcez jamais votre enfant à manger. Respectez ses signaux de faim et de satiété.

### Privilégiez le fait maison
Les purées maison permettent de contrôler les ingrédients et d'habituer votre bébé à une variété de goûts et de textures.

### Évoluez progressivement vers des textures plus consistantes
Commencez par des purées lisses, puis passez à des textures plus épaisses, des petits morceaux, et enfin des aliments à manger avec les doigts.

### Soyez patient
Il est normal qu'un bébé refuse un nouvel aliment plusieurs fois avant de l'accepter. Continuez à le lui proposer sans le forcer.

### Évitez certains aliments
Avant un an, évitez le miel (risque de botulisme), le lait de vache non modifié (trop riche en protéines), les fruits à coque entiers (risque d'étouffement) et les aliments très salés ou sucrés.

## Conclusion

La diversification alimentaire est une période d'exploration et de découverte pour votre bébé. Prenez le temps d'observer ses réactions et adaptez-vous à son rythme. L'objectif n'est pas seulement nutritionnel, mais aussi de lui faire découvrir le plaisir de manger et de partager un repas en famille.

N'hésitez pas à consulter votre pédiatre ou un professionnel de santé si vous avez des questions ou des inquiétudes concernant l'alimentation de votre bébé.`,
    image: "/lovable-uploads/f5a21dc5-5eb0-4077-b04f-d7d3f4d44ccd.png",
    category: "Nutrition",
    date: "15 février 2025",
    readingTime: 9,
    author: "Emilie Rousseau",
    views: 2104,
    tags: ["diversification", "alimentation", "nutrition", "bébé"]
  }
];
