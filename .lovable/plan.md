# Refonte visuelle BabyBaby — univers éditorial 3D

## Résultat visé
Une page d’accueil premium, chaleureuse et cohérente, avec un mobile de chambre 3D procédural au centre du hero, une hiérarchie éditoriale forte et des animations au défilement sobres. Tous les contenus, données, formulaires, routes, outils, SEO et fonctions existants restent actifs.

## Mise en œuvre
1. **Fondations visuelles**
   - Remplacer la palette actuelle par des jetons sémantiques ivoire, forêt/sauge, pêche et champagne, en conservant les modes clair/sombre.
   - Harmoniser typographie, boutons, bordures, ombres, focus et réduction des mouvements.

2. **Hero WebGL adaptatif**
   - Installer les versions React 18 de Three.js, React Three Fiber, Drei, postprocessing et GSAP.
   - Créer un chunk 3D chargé à la demande avec mobile suspendu, lune, étoiles, nuages, arcs, volumes céramique/métal et particules GLSL.
   - Ajouter éclairage studio local, ombres, bloom léger, réaction au pointeur et caméra liée au défilement.
   - Prévoir WebGL2, qualité adaptative, pause hors écran/onglet caché, error boundary et fallback statique élégant pour réduction des mouvements ou absence WebGL.
   - Garder immédiatement visibles le slogan exact, le sous-titre exact et les liens vers produits, outils et concours.

3. **Composition complète de l’accueil**
   - Recomposer les outils existants, le calculateur Québec, les articles réels, le quiz, les e-books, l’histoire du domaine, l’appel au compte et l’infolettre.
   - Donner à chaque section une structure éditoriale distincte sans retirer de contenu ni inventer de preuve sociale.
   - Remplacer les anciens avis fictifs par une navigation factuelle vers les étapes et ressources existantes.

4. **Navigation et pied de page**
   - Refaire nav, bannière concours, menu mobile et footer dans le nouveau langage visuel.
   - Corriger les liens invalides, les imbrications de liens, les noms accessibles, Escape, fermeture après navigation et cibles tactiles.

5. **Orchestration et validation**
   - Ajouter une petite machine à états typée GSAP/ScrollTrigger pour les transitions de sections, sans scroll-jacking et avec nettoyage complet.
   - Vérifier TypeScript, build production, prérendu, tests existants et aperçu navigateur.
   - Tester desktop, tablette, 390 px et 360 px, avec réduction des mouvements et fallback WebGL; contrôler console, liens, menus, H1 unique, débordement horizontal et visibilité jusqu’au footer.

## Détails techniques
- Un seul canvas sur la page; aucune ressource HDR/GLB distante.
- R3F `^8.18`, Drei `^9.122`, postprocessing compatible React 18, GSAP ScrollTrigger.
- DPR, particules, segments, ombres et bloom réduits sur appareils modestes.
- Le contenu HTML reste prérendable et indépendant du canvas.
- Aucun changement de base de données, fonction serveur, route, schéma SEO ou contenu éditorial métier.
