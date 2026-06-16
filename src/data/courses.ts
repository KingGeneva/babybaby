import { Course } from "@/types/course";
import introSoins from "@/assets/courses/intro-soins-v2.mp4.asset.json";
import introDev from "@/assets/courses/intro-developpement-v2.mp4.asset.json";
import introNutrition from "@/assets/courses/intro-nutrition-v2.mp4.asset.json";

const PDF_SOINS = "/resources/guide-soins-nouveau-ne.pdf";
const PDF_DEV = "/resources/guide-developpement-bebe.pdf";
const PDF_DIVERS = "/resources/guide-diversification-alimentaire.pdf";

export const courses: Course[] = [
  {
    id: "soin-nouveau-ne",
    title: "Soins essentiels pour nouveau-nés",
    description:
      "Maîtrisez tous les gestes du quotidien : bain, alimentation, sommeil, soins médicaux. Un cours complet validé par des pédiatres pour aborder sereinement les premiers mois.",
    image:
      "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?q=80&w=1470&auto=format&fit=crop",
    duration: "3h20min",
    level: "Débutant",
    instructor: "Dr. Sophie Martin, pédiatre",
    category: "Soins",
    updatedAt: "14/06/2026",
    modules: [
      {
        id: "soins-m1",
        title: "Le bain et l'hygiène du nouveau-né",
        duration: "45min",
        videoUrl: introSoins.url,
        content: `
          <h2>Le bain et l'hygiène du nouveau-né</h2>
          <p>Le bain est bien plus qu'un moment d'hygiène : c'est un rituel sensoriel qui renforce le lien parent-enfant et apaise le bébé. Voici la méthode complète, étape par étape.</p>

          <h3>1. Préparer le matériel</h3>
          <ul>
            <li>Baignoire bébé stable, antidérapante</li>
            <li>Thermomètre de bain (objectif <strong>37°C</strong>)</li>
            <li>Savon surgras pH neutre, sans parfum</li>
            <li>Deux serviettes douces préchauffées</li>
            <li>Couche, vêtements et gigoteuse à portée de main</li>
            <li>Compresses stériles pour le cordon (si pas encore tombé)</li>
          </ul>

          <h3>2. Préparer la pièce</h3>
          <p>Chauffez la salle de bain à <strong>22–24°C</strong>, fermez la porte, coupez les courants d'air. La sécurité prime : ne quittez jamais bébé des yeux, même une seconde.</p>

          <h3>3. Les 8 étapes du bain</h3>
          <ol>
            <li>Déshabillez bébé enveloppé dans la serviette, ne découvrez que les zones lavées.</li>
            <li>Nettoyez le visage avec un coton humide, du centre vers l'extérieur.</li>
            <li>Soin des yeux : un coton par œil, de l'angle interne vers l'externe.</li>
            <li>Plongez bébé doucement : main gauche sous la nuque, main droite sous les fesses.</li>
            <li>Savonnez le corps en insistant sur les plis (cou, aisselles, aines).</li>
            <li>Rincez abondamment pour éliminer tout résidu.</li>
            <li>Sortez bébé et enveloppez-le immédiatement dans la serviette chaude.</li>
            <li>Séchez par tamponnement, sans frotter, surtout les plis.</li>
          </ol>

          <h3>4. Fréquence et alternance</h3>
          <p>Pendant les 4 premières semaines, <strong>2 à 3 bains par semaine</strong> suffisent. Les autres jours, pratiquez une toilette localisée (visage, mains, siège) au gant de toilette.</p>

          <h3>5. Soins du cordon ombilical</h3>
          <p>Jusqu'à la chute (J5–J15), nettoyez à la compresse stérile imbibée de sérum physiologique, puis séchez. Pas d'alcool, pas de pansement occlusif. Consultez si rougeur, odeur ou écoulement.</p>

          <h3>6. Erreurs fréquentes à éviter</h3>
          <ul>
            <li>Eau trop chaude (>38°C) : risque de brûlure</li>
            <li>Coton-tige dans les oreilles : danger</li>
            <li>Crème hydratante systématique : à réserver aux peaux sèches</li>
            <li>Bain trop long (>10 min) : refroidissement et dessèchement cutané</li>
          </ul>

          <h3>À retenir</h3>
          <p>Un bain réussi est un bain <em>court, chaud, sécurisant et joyeux</em>. Chantez, parlez : votre voix est le meilleur des doudous.</p>
        `,
        resources: [
          { id: "r1-1", title: "Guide complet : Soins du nouveau-né (PDF)", type: "pdf", url: PDF_SOINS },
          { id: "r1-2", title: "Vidéo d'introduction au bain", type: "video", url: introSoins.url },
          { id: "r1-3", title: "OMS — Recommandations soins postnatals", type: "link", url: "https://www.who.int/fr/news-room/fact-sheets/detail/newborns-reducing-mortality" },
        ],
      },
      {
        id: "soins-m2",
        title: "L'alimentation du nouveau-né",
        duration: "55min",
        content: `
          <h2>Alimentation : allaitement, biberon et signaux de bébé</h2>
          <p>L'alimentation des 6 premiers mois conditionne la santé future. Ce module couvre les deux modes — sein et biberon — sans jugement, avec des conseils pratiques validés par l'OMS et la Leche League.</p>

          <h3>1. L'allaitement maternel</h3>
          <p>Recommandé de manière <strong>exclusive jusqu'à 6 mois</strong>, puis poursuivi en complément de la diversification jusqu'à 2 ans.</p>
          <h4>Bonne position</h4>
          <ul>
            <li>Bébé face au sein, ventre contre ventre</li>
            <li>Bouche grande ouverte englobant l'aréole, pas seulement le mamelon</li>
            <li>Menton collé au sein, lèvres retroussées</li>
            <li>Vous entendez la déglutition rythmée</li>
          </ul>
          <h4>Fréquence</h4>
          <p>À la demande, soit <strong>8 à 12 tétées/24h</strong> les premières semaines. Une tétée efficace dure 15 à 40 min.</p>

          <h3>2. Le biberon (lait infantile)</h3>
          <ul>
            <li>Eau peu minéralisée (mention "convient pour les nourrissons")</li>
            <li>1 mesurette rase pour 30 ml d'eau, toujours</li>
            <li>Tétine adaptée à l'âge, débit lent les premières semaines</li>
            <li>Bébé semi-assis, biberon incliné à 45°, tétine pleine de lait</li>
            <li>Pause à mi-biberon pour le rot</li>
          </ul>
          <p>Préparation extemporanée recommandée. Si conservation, max 1h à T° ambiante, 24h au frigo (4°C).</p>

          <h3>3. Quantités indicatives (lait infantile)</h3>
          <table>
            <thead><tr><th>Âge</th><th>Volume / 24h</th><th>Nombre de biberons</th></tr></thead>
            <tbody>
              <tr><td>0–1 mois</td><td>500–700 ml</td><td>6 à 8</td></tr>
              <tr><td>1–3 mois</td><td>700–900 ml</td><td>5 à 6</td></tr>
              <tr><td>3–6 mois</td><td>800–1000 ml</td><td>4 à 5</td></tr>
            </tbody>
          </table>

          <h3>4. Signaux à connaître</h3>
          <p><strong>Faim</strong> : main à la bouche, succion, recherche du sein, agitation. Pleurs = signal tardif.</p>
          <p><strong>Satiété</strong> : ralentissement, relâchement, sommeil paisible.</p>
          <p><strong>Bonne hydratation</strong> : 6 à 8 couches mouillées/jour, urines claires.</p>

          <h3>5. Quand consulter</h3>
          <ul>
            <li>Refus alimentaire > 6h</li>
            <li>Vomissements en jet répétés</li>
            <li>Perte de poids > 10% à la naissance ou stagnation après J15</li>
            <li>Coliques sévères persistantes</li>
          </ul>
        `,
        resources: [
          { id: "r2-1", title: "Tableau des quantités (PDF)", type: "pdf", url: PDF_SOINS },
          { id: "r2-2", title: "Nourri-Source (Québec) — soutien à l'allaitement", type: "link", url: "https://nourri-source.org/" },
        ],
      },
      {
        id: "soins-m3",
        title: "Le sommeil et les rythmes",
        duration: "40min",
        content: `
          <h2>Le sommeil : comprendre pour mieux accompagner</h2>
          <p>Un nouveau-né dort 16 à 20h par 24h, sans distinction jour/nuit. La maturation des rythmes circadiens se fait progressivement entre 6 semaines et 4 mois.</p>

          <h3>1. Les règles d'or de la sécurité du sommeil</h3>
          <ul>
            <li><strong>Toujours sur le dos</strong>, jamais sur le ventre ni sur le côté</li>
            <li>Matelas <strong>ferme, à la taille du lit</strong>, drap-housse uniquement</li>
            <li>Gigoteuse adaptée, <strong>aucune couverture, oreiller, peluche, tour de lit</strong></li>
            <li>Chambre à <strong>18–20°C</strong>, aérée quotidiennement</li>
            <li>Bébé dans la chambre des parents les 6 premiers mois, dans son propre lit</li>
            <li>Pas de tabac dans l'environnement</li>
          </ul>

          <h3>2. Les cycles de sommeil</h3>
          <p>Un cycle de nouveau-né dure <strong>50 minutes</strong> (vs 90 min chez l'adulte) et alterne sommeil agité (rêves, mouvements) et sommeil calme. Les micro-réveils entre cycles sont normaux : laissez 2–3 min avant d'intervenir, bébé peut se rendormir seul.</p>

          <h3>3. Construire un rituel apaisant</h3>
          <ol>
            <li>Bain tiède ou massage doux</li>
            <li>Tétée / biberon dans la pénombre</li>
            <li>Berceuse ou bruit blanc</li>
            <li>Coucher éveillé mais somnolent</li>
          </ol>
          <p>La régularité (mêmes gestes, même ordre) crée le repère.</p>

          <h3>4. Différencier jour et nuit</h3>
          <p>Le jour : lumière naturelle, bruits de vie, interactions. La nuit : pénombre, silence, change minimal, peu d'échanges visuels. En 6–8 semaines, bébé associe nuit = sommeil long.</p>

          <h3>5. Les régressions du sommeil</h3>
          <p>Vers 4 mois, 8–10 mois et 18 mois, des régressions normales liées au développement neurologique surviennent. Maintenez les rituels, évitez les nouvelles habitudes (cododo, biberon nocturne) si non souhaitées sur le long terme.</p>
        `,
        resources: [
          { id: "r3-1", title: "Calendrier de suivi du sommeil (PDF)", type: "pdf", url: PDF_SOINS },
          { id: "r3-2", title: "INSPQ — Mortalité infantile et sommeil sécuritaire", type: "link", url: "https://www.inspq.qc.ca/" },
        ],
      },
      {
        id: "soins-m4",
        title: "Les soins médicaux et signes d'alerte",
        duration: "60min",
        content: `
          <h2>Soins médicaux : ce que tout parent doit savoir</h2>

          <h3>1. La trousse à pharmacie idéale</h3>
          <ul>
            <li>Thermomètre digital rectal</li>
            <li>Sérum physiologique en unidoses</li>
            <li>Mouche-bébé</li>
            <li>Paracétamol nourrisson (suspension buvable)</li>
            <li>Compresses stériles, antiseptique sans alcool (chlorhexidine aqueuse)</li>
            <li>Crème pour le change (oxyde de zinc)</li>
            <li>Solution de réhydratation orale (SRO)</li>
          </ul>

          <h3>2. Prendre la température</h3>
          <p>Méthode de référence avant 2 ans : <strong>rectale</strong>. Fièvre = <strong>≥ 38°C</strong>. Avant 3 mois, toute fièvre est une <strong>urgence pédiatrique</strong>.</p>

          <h3>3. Le nettoyage du nez</h3>
          <p>Bébé respire exclusivement par le nez les 6 premiers mois. Lavage au sérum physiologique 1 à 4 fois/jour selon l'encombrement : bébé sur le côté, instillez la dose dans la narine supérieure, laissez s'écouler.</p>

          <h3>4. Le calendrier vaccinal 2026</h3>
          <ul>
            <li><strong>2 mois</strong> : DTP-Coqueluche-Hib-Hép B, Pneumocoque, Méningocoque B et C, Rotavirus</li>
            <li><strong>4 mois</strong> : rappels</li>
            <li><strong>5 mois</strong> : Méningocoque B rappel</li>
            <li><strong>11 mois</strong> : rappels DTP, Pneumocoque, Méningocoque</li>
            <li><strong>12 mois</strong> : ROR, Méningocoque ACWY</li>
          </ul>

          <h3>5. Quand appeler le 15 ou consulter en urgence</h3>
          <ul>
            <li>Fièvre avant 3 mois</li>
            <li>Difficulté respiratoire (geignement, tirage, cyanose)</li>
            <li>Refus alimentaire > 6h, déshydratation (fontanelle creuse, peu de couches)</li>
            <li>Convulsion, hypotonie, comportement inhabituel</li>
            <li>Éruption purpurique qui ne s'efface pas à la pression</li>
            <li>Pleurs inconsolables > 2h</li>
          </ul>

          <h3>6. Les premiers gestes</h3>
          <p>Apprenez la <strong>désobstruction des voies aériennes</strong> (manœuvre de Mofenson, tapes dorsales). Suivez une formation PSC1 nourrisson : c'est le geste qui sauve.</p>
        `,
        resources: [
          { id: "r4-1", title: "Carnet de suivi vaccinal (PDF)", type: "pdf", url: PDF_SOINS },
          { id: "r4-2", title: "Numéros d'urgence pédiatrique", type: "link", url: "https://www.service-public.fr/particuliers/vosdroits/F1136" },
        ],
      },
    ],
  },
  {
    id: "developpement-bebe",
    title: "Développement et éveil du bébé",
    description:
      "Comprenez les étapes clés du développement de 0 à 24 mois et apprenez à stimuler chaque sens avec des activités concrètes adaptées à chaque âge.",
    image:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1470&auto=format&fit=crop",
    duration: "2h45min",
    level: "Intermédiaire",
    instructor: "Émilie Durand, psychomotricienne",
    category: "Développement",
    updatedAt: "14/06/2026",
    modules: [
      {
        id: "dev-m1",
        title: "Les étapes du développement moteur",
        duration: "40min",
        videoUrl: introDev.url,
        content: `
          <h2>Le développement moteur : de la position fœtale à la marche</h2>
          <p>Le développement moteur suit un ordre <strong>céphalo-caudal</strong> (de la tête vers les pieds) et <strong>proximo-distal</strong> (du centre vers les extrémités). Chaque enfant a son rythme, ces repères sont indicatifs.</p>

          <h3>0–3 mois</h3>
          <ul>
            <li>Tient sa tête en position ventrale puis assise</li>
            <li>Suit un objet du regard à 180°</li>
            <li>Ouvre les mains, attrape par réflexe</li>
            <li>Sourire-réponse vers 6 semaines</li>
          </ul>

          <h3>4–6 mois</h3>
          <ul>
            <li>Se retourne dos-ventre puis ventre-dos</li>
            <li>Saisit volontairement les objets, les porte à la bouche</li>
            <li>Tient assis avec appui</li>
            <li>Babille (areuh, gazouillis)</li>
          </ul>

          <h3>7–9 mois</h3>
          <ul>
            <li>Tient assis sans appui</li>
            <li>Rampe, se déplace en quatre pattes</li>
            <li>Passe les objets d'une main à l'autre</li>
            <li>Pince inférieure puis supérieure (pouce-index)</li>
            <li>Dit "papa", "maman" sans valeur sémantique</li>
          </ul>

          <h3>10–12 mois</h3>
          <ul>
            <li>Se met debout, fait quelques pas avec appui</li>
            <li>Pince fine maîtrisée</li>
            <li>Comprend des consignes simples ("donne", "non")</li>
            <li>Premiers mots avec sens</li>
          </ul>

          <h3>13–24 mois</h3>
          <ul>
            <li>Marche autonome (12–18 mois en moyenne)</li>
            <li>Court, monte les escaliers à quatre pattes puis debout</li>
            <li>Empile 3 à 6 cubes</li>
            <li>Vocabulaire : 10 mots à 18 mois, 50 à 24 mois</li>
            <li>Associe deux mots ("encore lait")</li>
          </ul>

          <h3>Signaux d'alerte (à 9, 12 et 24 mois)</h3>
          <p>Consultez un pédiatre si à <strong>4 mois</strong> bébé ne tient pas sa tête, à <strong>9 mois</strong> ne tient pas assis, à <strong>18 mois</strong> ne marche pas ou ne dit aucun mot, ou s'il perd une acquisition.</p>
        `,
        resources: [
          { id: "rd1-1", title: "Guide développement 0–24 mois (PDF)", type: "pdf", url: PDF_DEV },
          { id: "rd1-2", title: "Vidéo introduction", type: "video", url: introDev.url },
        ],
      },
      {
        id: "dev-m2",
        title: "Stimulation cognitive et sensorielle",
        duration: "45min",
        content: `
          <h2>Stimuler les sens sans surstimuler</h2>
          <p>Le cerveau d'un nourrisson crée <strong>1 million de connexions synaptiques par seconde</strong>. La qualité des interactions compte plus que la quantité de jouets.</p>

          <h3>1. La vue</h3>
          <p>Bébé naît avec une vision floue (20 cm). Il distingue les contrastes forts (noir/blanc/rouge) avant les couleurs nuancées.</p>
          <ul>
            <li>0–3 mois : mobiles contrastés, miroir incassable</li>
            <li>3–6 mois : couleurs vives, livres en tissu</li>
            <li>6+ mois : objets en mouvement, jeux de cache-cache</li>
          </ul>

          <h3>2. L'ouïe</h3>
          <ul>
            <li>Parlez à votre bébé, même nouveau-né : votre voix est un repère</li>
            <li>Lecture quotidienne dès la naissance (10 min suffisent)</li>
            <li>Musique douce, comptines à gestes</li>
            <li>Évitez les jouets électroniques bruyants > 60 dB</li>
          </ul>

          <h3>3. Le toucher</h3>
          <ul>
            <li>Peau à peau quotidien les premiers mois</li>
            <li>Massage bébé après le bain</li>
            <li>Textures variées : bois, tissu doux, silicone, papier froissé</li>
            <li>Jeux d'eau supervisés dès 6 mois</li>
          </ul>

          <h3>4. Le goût et l'odorat</h3>
          <p>Lors de la diversification, présentez un seul aliment à la fois pour permettre la mémorisation gustative. Les saveurs amères (légumes verts) demandent 8 à 15 expositions avant acceptation.</p>

          <h3>5. La règle d'or : l'interaction</h3>
          <p>Un parent attentif vaut tous les jouets du monde. <strong>15 minutes de jeu partagé actif</strong> par jour suffisent à stimuler le développement cognitif.</p>

          <h3>6. Les écrans</h3>
          <p>Recommandation OMS : <strong>aucun écran avant 3 ans</strong>. Les écrans passifs nuisent au langage, à l'attention et au sommeil.</p>
        `,
        resources: [
          { id: "rd2-1", title: "Guide activités sensorielles (PDF)", type: "pdf", url: PDF_DEV },
          { id: "rd2-2", title: "Société canadienne de pédiatrie — Temps d'écran", type: "link", url: "https://cps.ca/fr/" },
        ],
      },
      {
        id: "dev-m3",
        title: "Jeux et activités par âge",
        duration: "30min",
        content: `
          <h2>20 activités testées par âge</h2>

          <h3>0–6 mois</h3>
          <ol>
            <li><strong>Peau à peau</strong> — régule la température, le rythme cardiaque, le lien</li>
            <li><strong>Mobile contrasté</strong> — stimule la vision et l'oculomotricité</li>
            <li><strong>Tummy time</strong> — sur le ventre éveillé, 3 × 5 min/jour</li>
            <li><strong>Massage doux</strong> — calme, structure le schéma corporel</li>
            <li><strong>Hochet et anneau de dentition</strong></li>
          </ol>

          <h3>6–12 mois</h3>
          <ol>
            <li><strong>Cubes à empiler / à encastrer</strong></li>
            <li><strong>Livres en tissu et cartonnés</strong></li>
            <li><strong>Jeux d'eau dans la baignoire</strong></li>
            <li><strong>Cache-cache simple</strong> — comprend la permanence de l'objet</li>
            <li><strong>Panier des trésors</strong> — objets du quotidien (cuillère, foulard, brosse)</li>
          </ol>

          <h3>12–18 mois</h3>
          <ol>
            <li><strong>Puzzles encastrement</strong> 2 à 4 pièces</li>
            <li><strong>Premiers crayons gros module</strong> — gribouillage</li>
            <li><strong>Instruments de musique simples</strong> (tambourin, maracas)</li>
            <li><strong>Pousseur, chariot de marche</strong></li>
            <li><strong>Livres à rabats</strong></li>
          </ol>

          <h3>18–24 mois</h3>
          <ol>
            <li><strong>Pâte à modeler maison</strong> sans gluten</li>
            <li><strong>Puzzles 4–6 pièces</strong></li>
            <li><strong>Imitation domestique</strong> (balai, cuisine, téléphone)</li>
            <li><strong>Comptines à gestes</strong> (Petit escargot, Ainsi font font font)</li>
            <li><strong>Tri par couleur/forme</strong></li>
          </ol>

          <h3>Activité bonus : la motricité libre</h3>
          <p>Inspirée de la pédiatre Emmi Pikler : laissez bébé dans un espace sécurisé, sans le mettre dans des positions qu'il ne sait pas atteindre seul (assis, debout). Il acquiert chaque étape à son rythme, avec une meilleure confiance en lui.</p>
        `,
        resources: [
          { id: "rd3-1", title: "Liste de jouets par âge (PDF)", type: "pdf", url: PDF_DEV },
        ],
      },
      {
        id: "dev-m4",
        title: "Repères et signaux d'alerte",
        duration: "50min",
        content: `
          <h2>Quand s'inquiéter ? Quand consulter ?</h2>

          <h3>1. Le principe de variabilité</h3>
          <p>Chaque enfant a son rythme. Un retard de 1 à 2 mois sur une acquisition isolée n'est généralement pas inquiétant. C'est <strong>l'accumulation</strong> ou la <strong>régression</strong> qui doit alerter.</p>

          <h3>2. Repères à 9 mois</h3>
          <p>Consultez si bébé :</p>
          <ul>
            <li>Ne tient pas assis</li>
            <li>N'attrape pas les objets</li>
            <li>N'établit pas de contact visuel</li>
            <li>Ne babille pas</li>
            <li>Ne réagit pas à son prénom</li>
          </ul>

          <h3>3. Repères à 18 mois</h3>
          <ul>
            <li>Ne marche pas</li>
            <li>Ne dit aucun mot</li>
            <li>Ne pointe pas du doigt</li>
            <li>N'imite pas les gestes du quotidien</li>
            <li>Pas de jeu symbolique (donner à manger à une poupée)</li>
          </ul>

          <h3>4. Signaux d'alerte sur le spectre autistique</h3>
          <ul>
            <li>Absence de sourire-réponse à 3 mois</li>
            <li>Pas de babillage à 12 mois</li>
            <li>Absence de geste de pointage à 16 mois</li>
            <li>Aucun mot à 18 mois</li>
            <li>Régression du langage ou du contact à tout âge</li>
          </ul>
          <p>Test M-CHAT possible à 18 mois auprès du pédiatre.</p>

          <h3>5. Vers qui se tourner ?</h3>
          <ul>
            <li><strong>Pédiatre / médecin traitant</strong> : premier interlocuteur</li>
            <li><strong>CLSC</strong> : suivi infirmier et bilans gratuits pour 0–5 ans</li>
            <li><strong>CRDP / CRDI-TED</strong> : centres de réadaptation pour prise en charge pluridisciplinaire 0–6 ans</li>
            <li><strong>Psychoéducateur, orthophoniste</strong> : sur recommandation (OPHQ, RAMQ)</li>
          </ul>

          <h3>6. Le dépistage précoce sauve</h3>
          <p>Plus une difficulté est repérée tôt, meilleure est la prise en charge. Ne minimisez pas votre intuition de parent : elle est souvent juste.</p>
        `,
        resources: [
          { id: "rd4-1", title: "Test M-CHAT à imprimer", type: "link", url: "https://mchatscreen.com/" },
          { id: "rd4-2", title: "Naître et grandir — Trouver son CLSC", type: "link", url: "https://naitreetgrandir.com/" },
        ],
      },
    ],
  },
  {
    id: "alimentation-diversifiee",
    title: "Introduction à l'alimentation diversifiée",
    description:
      "Démarrez la diversification en confiance : âges, aliments, recettes adaptées, gestion des allergies. Un cours complet basé sur les recommandations 2026.",
    image:
      "https://images.unsplash.com/photo-1613125979311-0a208dc91c00?q=80&w=1470&auto=format&fit=crop",
    duration: "3h10min",
    level: "Débutant",
    instructor: "Marie Leblanc, diététicienne pédiatrique",
    category: "Nutrition",
    updatedAt: "14/06/2026",
    modules: [
      {
        id: "nutri-m1",
        title: "Quand et comment commencer la diversification",
        duration: "45min",
        videoUrl: introNutrition.url,
        content: `
          <h2>Quand commencer la diversification ?</h2>
          <p>Les recommandations 2026 (PNNS, ESPGHAN) convergent : la diversification se débute <strong>entre 4 et 6 mois révolus</strong>, jamais avant 17 semaines, jamais après 26 semaines.</p>

          <h3>1. Les 4 signes de maturité</h3>
          <ul>
            <li>Bébé tient assis avec un léger appui</li>
            <li>Il manifeste un intérêt pour ce que vous mangez</li>
            <li>Il a perdu le réflexe d'extrusion (ne repousse plus la cuillère avec la langue)</li>
            <li>Il sait coordonner les mouvements main-bouche</li>
          </ul>

          <h3>2. Deux approches possibles</h3>
          <h4>Diversification classique (purées et compotes)</h4>
          <p>Texture mixée lisse, à la cuillère, progression douce vers les morceaux à 9–10 mois.</p>
          <h4>DME — Diversification Menée par l'Enfant</h4>
          <p>Bébé mange seul, avec les doigts, des aliments fondants en bâtonnets. Nécessite un bébé en âge de tenir assis et un encadrement actif (jamais seul à table).</p>
          <p>Les deux approches peuvent se combiner.</p>

          <h3>3. La règle de progression</h3>
          <ol>
            <li>Un nouvel aliment à la fois, sur 3 jours, pour repérer une éventuelle allergie</li>
            <li>Commencez par des légumes (avant les fruits, plus sucrés)</li>
            <li>1 repas diversifié + lait, puis 2 repas, puis 3 vers 9 mois</li>
            <li>Le lait reste la base : <strong>500 ml/jour minimum</strong> jusqu'à 12 mois</li>
          </ol>

          <h3>4. Matériel utile</h3>
          <ul>
            <li>Chaise haute conforme à la norme EN 14988</li>
            <li>Cuillères en silicone souple</li>
            <li>Bavoir manches longues</li>
            <li>Bols à ventouse</li>
            <li>Mixeur cuiseur ou simple blender</li>
          </ul>

          <h3>5. L'environnement du repas</h3>
          <p>Bébé assis, pas devant un écran, en présence de la famille. Imitez-le, parlez, nommez les aliments. Un repas dure 20–30 min. <strong>Ne forcez jamais</strong> : c'est bébé qui décide de la quantité.</p>
        `,
        resources: [
          { id: "rn1-1", title: "Guide diversification (PDF)", type: "pdf", url: PDF_DIVERS },
          { id: "rn1-2", title: "Vidéo introduction", type: "video", url: introNutrition.url },
          { id: "rn1-3", title: "PNNS — Nutrition de l'enfant", type: "link", url: "https://www.mangerbouger.fr/" },
        ],
      },
      {
        id: "nutri-m2",
        title: "Les aliments recommandés par âge",
        duration: "40min",
        content: `
          <h2>Catalogue des aliments par âge</h2>

          <h3>4–6 mois : démarrage</h3>
          <ul>
            <li><strong>Légumes</strong> mixés : carotte, courgette, haricots verts, patate douce, potiron, brocoli</li>
            <li><strong>Fruits</strong> en compote sans sucre : pomme, poire, banane, pêche</li>
            <li><strong>Céréales infantiles</strong> sans gluten puis avec gluten</li>
          </ul>

          <h3>6–8 mois : enrichissement</h3>
          <ul>
            <li><strong>Protéines</strong> : 10 g/jour de viande blanche, poisson blanc, œuf entier bien cuit (1 fois/semaine puis plus)</li>
            <li><strong>Légumineuses</strong> : lentilles, pois cassés bien cuits, mixés</li>
            <li><strong>Matière grasse</strong> : 1 cuillère à café d'huile de colza/noix crue par repas</li>
            <li><strong>Yaourts</strong> nature au lait infantile ou demi-écrémé</li>
          </ul>

          <h3>9–12 mois : textures variées</h3>
          <ul>
            <li>Morceaux fondants écrasés à la fourchette</li>
            <li>Pain, pâtes, riz bien cuits</li>
            <li>Fromages pasteurisés (emmental, comté)</li>
            <li>Quantité de protéines : 20 g/jour</li>
          </ul>

          <h3>12–24 mois : alimentation familiale</h3>
          <ul>
            <li>Mêmes plats que la famille, peu salés, peu sucrés</li>
            <li>3 repas + 1 goûter</li>
            <li>500 ml de lait/produits laitiers/jour</li>
            <li>Eau à volonté, pas de jus de fruits sucrés</li>
          </ul>

          <h3>À éviter avant…</h3>
          <table>
            <thead><tr><th>Aliment</th><th>Âge minimum</th><th>Raison</th></tr></thead>
            <tbody>
              <tr><td>Miel</td><td>12 mois</td><td>Risque botulisme</td></tr>
              <tr><td>Lait de vache (boisson)</td><td>12 mois</td><td>Pauvre en fer</td></tr>
              <tr><td>Sel ajouté</td><td>12 mois</td><td>Reins immatures</td></tr>
              <tr><td>Sucre ajouté</td><td>24 mois</td><td>Préférence gustative</td></tr>
              <tr><td>Fromages au lait cru</td><td>5 ans</td><td>Listeria</td></tr>
              <tr><td>Fruits à coque entiers</td><td>4 ans</td><td>Étouffement</td></tr>
            </tbody>
          </table>
        `,
        resources: [
          { id: "rn2-1", title: "Tableau aliments par âge (PDF)", type: "pdf", url: PDF_DIVERS },
        ],
      },
      {
        id: "nutri-m3",
        title: "10 recettes maison testées",
        duration: "55min",
        content: `
          <h2>10 recettes faciles et équilibrées</h2>

          <h3>1. Velouté carotte-cumin (6m+)</h3>
          <p>200 g carottes vapeur 15 min, 50 ml eau de cuisson, 1 pincée de cumin, 1 c.c. huile de colza. Mixer.</p>

          <h3>2. Purée potiron-pomme (6m+)</h3>
          <p>150 g potiron + 1 pomme vapeur 12 min, mixer. Naturellement sucrée, idéal pour la transition.</p>

          <h3>3. Risotto courgette-parmesan (8m+)</h3>
          <p>40 g riz arborio cuit dans 200 ml bouillon de légumes, 80 g courgette râpée, 10 g parmesan râpé en fin de cuisson.</p>

          <h3>4. Saumon vapeur & patate douce (8m+)</h3>
          <p>30 g saumon vapeur 8 min, 100 g patate douce écrasée, 1 c.c. huile de colza, jus de citron.</p>

          <h3>5. Crumble pomme-flocons d'avoine (10m+)</h3>
          <p>2 pommes en dés, 30 g flocons d'avoine, 10 g beurre, cannelle. 20 min au four à 180°C.</p>

          <h3>6. Mini-cakes courgette-feta (12m+)</h3>
          <p>1 courgette râpée, 1 œuf, 50 g farine, 30 g feta émiettée, 1 c.c. huile d'olive. 20 min à 180°C en moules silicone.</p>

          <h3>7. Boulettes poulet-curcuma (12m+)</h3>
          <p>100 g poulet haché, 1 c.s. flocons d'avoine, 1 jaune d'œuf, ½ c.c. curcuma. Former, cuire à la poêle 8 min.</p>

          <h3>8. Compote pomme-poire sans sucre (6m+)</h3>
          <p>2 pommes + 2 poires en dés, 1 c.s. eau, vanille. 15 min à feu doux, mixer.</p>

          <h3>9. Riz au lait coco-vanille (12m+)</h3>
          <p>40 g riz rond, 200 ml lait infantile, 50 ml lait de coco, vanille. 25 min à feu doux.</p>

          <h3>10. Galettes légumes oubliés (18m+)</h3>
          <p>1 panais + 1 carotte râpés, 1 œuf, 30 g farine, herbes. Poêler 4 min de chaque côté en petits palets.</p>

          <h3>Conseils de conservation</h3>
          <ul>
            <li>Frigo (4°C) : 48h max</li>
            <li>Congélateur : 1 mois en portions individuelles (bacs à glaçons silicone)</li>
            <li>Décongélation au frigo ou bain-marie, jamais à T° ambiante</li>
          </ul>
        `,
        resources: [
          { id: "rn3-1", title: "Livret 10 recettes (PDF)", type: "pdf", url: PDF_DIVERS },
        ],
      },
      {
        id: "nutri-m4",
        title: "Allergies, intolérances et besoins spécifiques",
        duration: "50min",
        content: `
          <h2>Allergies et intolérances : ce qu'il faut savoir</h2>

          <h3>1. La fenêtre de tolérance</h3>
          <p>Les recommandations 2026 préconisent d'<strong>introduire tôt</strong> les allergènes (entre 4 et 6 mois) pour favoriser la tolérance immunitaire. Le report d'introduction augmente le risque d'allergie.</p>

          <h3>2. Les 14 allergènes majeurs</h3>
          <p>Œuf, arachide, fruits à coque, lait, gluten, soja, poisson, crustacés, mollusques, céleri, moutarde, sésame, sulfites, lupin.</p>

          <h3>3. Comment introduire un allergène</h3>
          <ul>
            <li>En petite quantité (¼ c.c.)</li>
            <li>Le matin ou midi, jamais le soir</li>
            <li>À la maison, pas en collectivité la première fois</li>
            <li>Surveiller 2h : rougeurs, œdème, vomissements, gêne respiratoire</li>
            <li>Si tolérance : augmenter progressivement, intégrer 2 fois/semaine</li>
          </ul>

          <h3>4. Reconnaître une réaction allergique</h3>
          <p><strong>Légère</strong> : rougeurs autour de la bouche, urticaire localisée → consultation rapide.</p>
          <p><strong>Sévère (anaphylaxie)</strong> : œdème du visage/langue, gêne respiratoire, pâleur, vomissements répétés → <strong>15 immédiatement</strong>.</p>

          <h3>5. Allergie aux protéines de lait de vache (APLV)</h3>
          <p>Concerne 2–3% des nourrissons. Symptômes : régurgitations sévères, eczéma, diarrhée, pleurs. Diagnostic médical + lait hypoallergénique (HA) ou hydrolysat poussé sur prescription.</p>

          <h3>6. Régimes végétarien et végétalien</h3>
          <p>Le régime végétarien est possible avec un suivi diététicien (apports en fer, B12, oméga 3 à surveiller). Le <strong>régime végétalien strict n'est pas recommandé</strong> avant 2 ans sans supplémentation médicale rigoureuse.</p>

          <h3>7. Carences fréquentes à surveiller</h3>
          <ul>
            <li><strong>Fer</strong> : viandes rouges, lentilles, épinards + vitamine C pour l'absorption</li>
            <li><strong>Vitamine D</strong> : supplémentation systématique jusqu'à 18 mois (800–1000 UI/jour)</li>
            <li><strong>Oméga 3</strong> : poissons gras 1–2 fois/semaine, huile de colza/noix</li>
            <li><strong>Iode</strong> : sel iodé après 12 mois, poissons</li>
          </ul>

          <h3>8. La néophobie alimentaire (18m–3 ans)</h3>
          <p>Phase normale de refus du nouveau. Stratégies : exposition répétée (jusqu'à 15 fois), pas de chantage, manger en famille, laisser bébé toucher/sentir, varier les formes (cru/cuit/râpé).</p>
        `,
        resources: [
          { id: "rn4-1", title: "Fiche allergènes (PDF)", type: "pdf", url: PDF_DIVERS },
          { id: "rn4-2", title: "Association Asthme & Allergies", type: "link", url: "https://asthme-allergies.org/" },
        ],
      },
    ],
  },
];
