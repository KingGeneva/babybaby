# Rendre le contenu visible aux crawlers — Plan

## Le problème en une ligne

Ton site est une SPA Vite/React : le HTML envoyé par le serveur est une **coquille vide** (`<div id="root"></div>`). Tout le contenu (articles, ebooks, FAQ) n'apparaît qu'après exécution du JavaScript dans le navigateur. Pour Google c'est un handicap majeur, pour les autres crawlers (Bing, LinkedIn, Facebook, ChatGPT, Perplexity) c'est invisible.

Il faut générer du **HTML statique pré-rendu** pour chaque route avant publication.

---

## Deux options — choisis-en une

### Option A — Pré-rendu statique avec Puppeteer (rapide à mettre en place)

**Outil** : `vite-prerender-plugin` (basé sur Puppeteer)

**Comment ça marche** : au moment du `vite build`, un Chrome headless lance ton app sur chaque route listée, attend que React ait fini de tout afficher, puis sauvegarde le HTML résultant dans `dist/<route>/index.html`. À la livraison, le visiteur (et le crawler) reçoit directement la page complète.

**Routes couvertes** : homepage, `/articles`, chaque article (`/articles/:id`), `/ebooks`, `/faq`, `/about`, `/boutique`, `/meilleurs-produits-bebe-2026`, `/tools` — environ 25-30 pages.

**Avantages**
- ~30 min de mise en place
- Aucune réécriture de code applicatif
- Le résultat est strictement identique à ce que voit un utilisateur

**Risques / limites**
- Puppeteer télécharge Chromium (~170 Mo) au build — peut ralentir ou échouer dans l'env de build Lovable
- Le build prend +2 à 5 min
- Les pages derrière auth (dashboard, admin) sont exclues — normal
- Pour les articles ajoutés dynamiquement après build, il faut re-builder

### Option B — Migration progressive vers du SSR vrai (recommandé long terme)

Migrer vers **Next.js** ou **Remix**, qui rendent le HTML côté serveur à chaque requête. C'est la solution propre, mais c'est une refonte structurelle (1-2 semaines de travail), pas une intervention de 30 min.

Pas recommandé maintenant : on perd l'élan, et l'Option A apporte déjà 90% du bénéfice SEO.

---

## En parallèle de l'Option A — quick wins (15 min)

Que tu choisisses A ou B, ces actions sont gratuites et immédiates :

1. **Débloquer GPTBot, CCBot, Google-Extended** dans `public/robots.txt` (actuellement bloqués → invisible pour ChatGPT/Claude/Perplexity)
2. **Raccourcir le `<title>`** de `index.html` (77 → ~58 caractères, sinon tronqué dans Google)
3. **Raccourcir la meta description** (217 → ~155 caractères)
4. **Créer `/llms.txt`** pour les LLM crawlers
5. **Préparer le fichier `disavow.txt`** listant les 152 domaines Blogspot toxiques à soumettre dans Google Search Console (action manuelle de ta part)

---

## Ce que je propose de faire maintenant

Si tu valides ce plan, je vais :

1. Installer `vite-prerender-plugin` et le configurer pour les routes statiques + les articles
2. Lister dynamiquement les IDs d'articles depuis `src/data/articles/index.ts`
3. Lancer un build de test pour vérifier que Puppeteer fonctionne dans l'env Lovable
4. Si le build Puppeteer échoue → bascule sur un plan B léger : générer manuellement le HTML enrichi pour la homepage + un template d'article (sans headless browser), c'est moins parfait mais ça fonctionne partout
5. Appliquer les quick wins en parallèle (robots.txt, titres, llms.txt)

## Détails techniques

- `vite-prerender-plugin` s'ajoute dans `vite.config.ts` sans changer le code React
- `react-helmet-async` continue de fonctionner — Puppeteer attend l'hydratation et capture le `<head>` final
- Le sitemap.xml existant reste valide
- Aucun impact sur le dev server (`vite dev` n'est pas affecté)

## Hors scope de cette intervention

- Création de nouveau contenu / nouveaux articles
- Campagne de backlinks (action manuelle hors code)
- Soumission du disavow dans Search Console (action manuelle dans l'interface Google)
- Migration vers Next.js / Remix (Option B, projet séparé si tu le souhaites un jour)
