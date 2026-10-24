# Incident articles — 24 octobre 2026

## Causes observées
- L’outil d’état Cloud confirme que la base hébergée est **en pause**. Les requêtes de lecture échouent et le nom d’hôte des fichiers distants ne se résout pas. Aucune modification RLS ne peut résoudre cette panne d’infrastructure.
- Localement, avant correction : **10 articles locaux**, **2 requêtes Storage** à l’ouverture (StrictMode), **2 headers et 2 footers**. L’URL `/articles/200` affichait « Article introuvable » alors que la source distante est inaccessible.
- La résolution détail supposait `articles/{id}.json`, contrairement aux anciens articles dont le fichier est un timestamp et l’id JSON est différent (exemple historique : id 200, fichier 1777940102000.json).
- Les listes Storage étaient limitées à leur première page ; recherche et catégorie relançaient toutes les lectures. Les boutons de pagination ne faisaient rien.
- Le sitemap publié répond HTTP 200 et contient **53 URLs d’articles**. Ce nombre n’établit pas le nombre actuel de documents publiés dans Storage.

## Corrections préparées
- Catalogue paginé (100 fichiers par appel), six téléchargements concurrents au maximum, exclusion de `_index.json`, validation des identifiants/titres et exclusion des statuts explicitement non publiés.
- Cache React Query commun à l’accueil, à la liste et aux détails ; filtres/recherche locaux sans requêtes supplémentaires.
- Résolution des détails par id JSON indépendamment du nom de fichier ; erreur réseau distincte d’une absence réelle, bouton Réessayer.
- Pagination visuelle de 12 articles ; suppression du double layout sur la page Articles ; liens des cartes alignés sur les canonical slug/id.
- Bulles conservées : import p5 différé, DPR 1, 30 images/seconde, pause hors écran/onglet masqué et réduction des mouvements.
- Service worker v9 : pas de cache API ni distant, retrait des jokers de préchargement invalides, mise à jour du worker existant.
- Prérendu : même validation du statut publié que le catalogue public. Aucune mutation des articles, RLS ou fonctions serveur.

## Vérifications exécutées
- `bun run test -- src/lib/articleCatalog.test.ts scripts/internal-links.test.ts scripts/prerender-utils.test.ts` : **29/29 réussis**.
- Playwright local, visiteur anonyme : 10 locaux toujours visibles en panne ; un seul header/footer ; erreur temporaire correcte pour id 200.
- Transport Storage simulé (aucune écriture réelle) : 152 JSON, dont un brouillon ; **151 distants publiés + 10 locaux = 161**, 12 cartes par page, deuxième page accessible, recherche sans appel réseau supplémentaire, filtres combinés corrects.
- Article simulé id 200 avec fichier timestamp : accès slug/id et rechargement réussis, un H1. Ancienne URL réelle locale `/articles/5` et rechargement réussis.
- Mobile 390 px : largeur du document 390 px, aucun débordement horizontal. Captures desktop/mobile inspectées ; bulles présentes. Aucun `pageerror` dans le parcours testé.
- Journal automatique de compilation : dernier état **build OK**. Aucun build manuel ni contrôle TypeScript autonome exécuté (la plateforme les gère automatiquement).

## Limites avant validation du diff
La réactivation Cloud exige l’autorisation explicite du propriétaire. Aucun total Storage/CMS réel après correction, inspection RLS, accès aux articles distants réels ou prérendu distant complet ne peut être certifié tant que Cloud reste en pause. Les résultats de 161 articles sont **simulés**, pas un décompte de production. Le sitemap public et le site publié sont inchangés. Aucune publication, changement de visibilité, email ou génération.

La refonte visuelle précédemment validée est différée pour respecter la dernière demande de préserver le design pendant l’incident.