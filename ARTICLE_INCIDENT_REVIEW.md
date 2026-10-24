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
- Les guides locaux sont visibles immédiatement pendant le chargement. Un JSON distant en erreur ne fait plus disparaître les autres articles récupérés : un avertissement de catalogue incomplet reste affiché.
- Résolution des détails par id JSON indépendamment du nom de fichier ; erreur réseau distincte d’une absence réelle, bouton Réessayer.
- Pagination visuelle de 12 articles ; suppression du double layout sur la page Articles ; liens des cartes alignés sur les canonical slug/id.
- Bulles conservées : import p5 différé, DPR 1, 30 images/seconde, pause hors écran/onglet masqué et réduction des mouvements.
- Service worker v9 : pas de cache API ni distant, retrait des jokers de préchargement invalides, mise à jour du worker existant.
- Prérendu : même validation du statut publié que le catalogue public. Aucune mutation des articles, RLS ou fonctions serveur.

## Vérifications exécutées
- `bun run test -- src/hooks/useArticles.test.tsx src/lib/articleCatalog.test.ts scripts/internal-links.test.ts scripts/prerender-utils.test.ts` : **32/32 réussis**, y compris mutualisation des requêtes, visibilité immédiate et échec partiel.
- Playwright local, visiteur anonyme : 10 locaux toujours visibles en panne ; un seul header/footer ; erreur temporaire correcte pour id 200.
- Transport Storage simulé (aucune écriture réelle) : 152 JSON, dont un brouillon ; **151 distants publiés + 10 locaux = 161**, 12 cartes par page, deuxième page accessible, recherche sans appel réseau supplémentaire, filtres combinés corrects.
- Article simulé id 200 avec fichier timestamp : accès slug/id et rechargement réussis, un H1. Ancienne URL réelle locale `/articles/5` et rechargement réussis.
- Mobile 390 px et 360 px : largeur du document égale à celle du viewport, aucun débordement horizontal. Captures desktop/mobile inspectées ; bulles présentes. Aucun `pageerror` dans le parcours testé.
- Journal automatique de compilation : dernier état **build OK**. Aucun build manuel ni contrôle TypeScript autonome exécuté (la plateforme les gère automatiquement).

## Limites avant validation du diff
Cloud a été réactivé à la demande explicite du propriétaire, sans achat ni changement de forfait. Après plusieurs contrôles pendant le démarrage, auth et base répondent normalement. Les résultats de 161 articles ci-dessus restent **simulés** ; les décomptes réels sont ci-dessous. Aucune publication, changement de visibilité, email ou génération.

## Revue finale après remise en service
- Décompte SQL réel : **104 objets** dans le bucket articles, **43 JSON d’articles** (hors `_index.json`). Catalogue lu anonymement : **43 distants + 10 locaux = 53 articles**, complet, sans avertissement. Avant remise en service : 10 locaux et catalogue incomplet.
- `cms_articles` : 2 entrées, toutes deux publiées. Leurs titres correspondent aux articles Storage id 200 et 201 ; le frontend public utilise Storage, pas cette table. Aucune nouvelle source ni publication de brouillon ajoutée.
- Politiques inspectées sans modification : lecture publique du bucket articles ; lecture CMS limitée aux publiés, mutations administrateur. Aucun assouplissement RLS.
- `loadCatalog` conserve désormais aussi les résultats des pages précédentes si une page de listing échoue. Les téléchargements individuels échoués n’annulent pas les articles sains. `fetchPublicArticles` retourne les résultats partiels avec `complete: false` et avertissement explicite ; la page affiche cet avertissement réel.
- Un article absent d’un catalogue incomplet déclenche une erreur temporaire, jamais un vrai introuvable. Le bouton Réessayer d’un détail force une nouvelle lecture si le cache était incomplet.
- Tri restauré : date de publication française/ISO décroissante, puis date réelle du fichier Storage, puis id ; les téléchargements conservent cette date de fichier.
- Le détail vide article et erreur à chaque changement d’identifiant ; un paramètre invalide affiche immédiatement introuvable. Tests couvrant les transitions depuis un article réussi et depuis une erreur.
- `bun run test src/services/publicArticles.test.ts src/pages/ArticleDetailPage.test.tsx src/lib/articleCatalog.test.ts src/hooks/useArticle.test.tsx src/hooks/useArticles.test.tsx scripts/internal-links.test.ts scripts/prerender-utils.test.ts` : **42 tests réussis**, 7 fichiers.
- Playwright réel anonyme sur localhost : les cinq pages affichent 12/12/12/12/5 articles ; recherche/catégorie sans requête Storage supplémentaire ; accès et rechargement de l’ancien `/articles/5` et du plus récent id 1788940844689 réussis ; id distant 200 accessible ; transition URL invalide vérifiée. Aucun `pageerror`. Captures desktop/mobile inspectées, aucun débordement horizontal à 390/360 px.
- Sitemap publié HTTP 200 : **64 URLs, dont 53 articles, zéro doublon**. Comparaison des URLs exactes avec `articleUrl` sur le catalogue réel : aucune URL manquante ou supplémentaire. Le sitemap n’a pas été modifié ni soumis.
- Journal automatique de compilation : dernier état **build OK**. Aucun build/typecheck manuel lancé conformément aux règles de la plateforme. Le journal disponible ne certifie pas un nouveau postbuild/prérendu distant après réactivation ; aucune sortie `dist` n’est disponible dans ce sandbox. La validation du prérendu sur catalogue réel reste à effectuer par le processus de compilation de la plateforme, sans publication.
- Cache Vite : **307 fichiers déjà suivis**, aucun fichier cache modifié dans cette revue ni dans le commit be1e9e33 inspecté. `.gitignore` est protégé en lecture seule : ajout d’une exclusion refusé, aucun contournement ni nettoyage destructif effectué.
- Anomalie préexistante observée sur le dernier article : un H1 dans son contenu Markdown s’ajoute au titre de page (2 H1, 1 canonical). Signalée, contenu laissé intact pour respecter la réparation ciblée.

### Fichiers de cette revue
`src/lib/articleCatalog.ts`, `src/services/publicArticles.ts`, `src/hooks/useArticle.ts`, `src/pages/ArticleDetailPage.tsx`, `src/pages/ArticlesPage.tsx`, `src/lib/articleCatalog.test.ts`, `src/services/publicArticles.test.ts`, `src/hooks/useArticle.test.tsx`, `src/pages/ArticleDetailPage.test.tsx`, `AGENTS.md`, `roadmap.md`, ce bilan. Aucune fonction serveur ni migration modifiée.

La refonte visuelle précédemment validée est différée pour respecter la dernière demande de préserver le design pendant l’incident.