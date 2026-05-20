
# Refonte BabyBaby — "Le copilote intelligent des nouveaux parents"

## Analyse de l'existant

L'app actuelle (`babybaby.org`) est aujourd'hui un site React/Vite avec :
- Blog/articles (Supabase + bucket `articles`)
- Boutique Shopify
- Dashboard de croissance basique (`growth_measurements`, `milestones`, `child_profiles`)
- Quelques outils (`SleepTracker` local, FAQ, ebooks, forum)
- Auth Supabase + rôles admin

Ce qui manque pour atteindre la vision :
- Tracking unifié (tétées, biberons, couches, sommeil) avec sync temps réel co-parent
- IA proactive (assistant, prédictions, fenêtres d'éveil)
- Timeline émotionnelle / souvenirs
- UX "3 secondes / une main / 3h du matin" (dark mode, gros tap zones, widgets, voix)
- Communauté segmentée et feed snackable
- Gamification (streaks, badges)

Vu l'ampleur, je propose une **refonte par phases**, sans tout casser. Phase 0 pose les fondations design + data, puis chaque phase est une release autonome.

---

## Phase 0 — Fondations (design system + data model)

**Design system "Soft Night"**
- Refonte de `index.css` et `tailwind.config.ts` : palette HSL (crème chaud, rose pastel, bleu poudre, lilas, sauge) + dark mode par défaut adapté à la nuit (faible contraste bleu).
- Typographie : pair éditorial chaleureux (ex. Instrument Serif + Work Sans).
- Tokens sémantiques uniquement (`--surface-night`, `--accent-glow`, `--haptic-success`…).
- Composants "thumb-first" : `<BigTapButton>`, `<NightCard>`, `<QuickLogWidget>`.

**Data model (migration Supabase)**
Nouvelles tables (toutes avec RLS scopée via `child_profiles.user_id` et table `family_members` pour co-parent) :
- `feedings` (type: breast_left/right/bottle, started_at, ended_at, amount_ml, notes)
- `diapers` (type: wet/dirty/mixed, occurred_at)
- `sleeps` (started_at, ended_at, quality, location)
- `baby_events` (type, occurred_at, photo_url, note) — timeline unifiée pour souvenirs/milestones
- `family_members` (child_id, user_id, role: parent/caregiver/grandparent) — base du mode co-parent
- `daily_summaries` (cache journalier des stats agrégées)
- `parent_wellness` (sommeil parent, hydratation, humeur) — Parent-Care

Realtime activé sur `feedings`, `diapers`, `sleeps`, `baby_events` pour sync co-parent instantanée.

---

## Phase 1 — Tracking "Zero Friction" + Sync co-parent

**Écran d'accueil nocturne**
Route `/now` (PWA-ready) : un seul écran avec
- Heure + "Dernière tétée il y a 2h47 · sein droit suggéré"
- 3 gros boutons : [Tétée] [Couche] [Tout va bien]
- Haptic feedback (`navigator.vibrate`) sur chaque tap.

**Quick-log widgets**
- Chronomètre tétée avec alternance auto (mémorise dernier sein).
- Biberon : preset volumes + slider.
- Couche : 3 icônes tap-once.
- Sommeil : un seul bouton "Dort / Réveillé" qui ouvre/ferme une session.

**Mode co-parent**
- Invitation par email/lien magique → ajoute un `family_members`.
- Realtime channel par `child_id` → toast "Papa vient de donner le biberon (90 ml)".
- Vue "Relève de garde" : résumé visuel des 6 dernières heures.

**Commande vocale (web)**
- Web Speech API (`SpeechRecognition`) derrière un bouton flottant.
- Parser local simple : "tétée gauche 10 minutes", "couche pleine", "biberon 120".
- Fallback : Edge function `voice-parse` (Lovable AI, `google/gemini-3-flash-preview`) avec sortie structurée Zod.

---

## Phase 2 — IA Proactive

Edge functions (Lovable AI Gateway, JWT verify ON, rate-limit par user) :

- `baby-ai-assistant` — chat streamé (AI SDK + `useChat`). System prompt pédiatrique + contexte enfant (âge, dernières 24h de données) injecté côté serveur. Ton rassurant, jamais alarmiste. Sources OMS/HAS citées.
- `wake-window-predictor` — analyse les `sleeps` des 14 derniers jours, calcule médiane des fenêtres d'éveil par tranche d'âge, push notif "Léa va fatiguer dans ~15 min".
- `feeding-predictor` — pattern tétées → "Lucas devrait avoir faim vers 14h20".
- `cry-analyzer` (optionnel, opt-in) — upload 5s d'audio → classification faim/fatigue/inconfort (modèle hébergé, pas on-device en web).
- `daily-activity` — chaque matin, génère 1-2 micro-jeux de 5 min adaptés au stade de développement (cron `pg_cron` + `pg_net`).

UI : panneau "Aujourd'hui" sur `/now` avec les prédictions actives + assistant accessible en swipe.

---

## Phase 3 — Timeline & Souvenirs

- Route `/timeline/:childId` — feed vertical type "Life Feed" (photos, milestones, mesures, anecdotes vocales).
- Notes vocales : enregistrement Web Audio → upload bucket `memories` → transcription via edge function (Lovable AI ou ElevenLabs STT batch).
- Souvenirs auto : edge function mensuelle "Il y a 1 an aujourd'hui…" + génération d'un récap mensuel (texte IA + grille photos).
- Export PDF album (jspdf + html2canvas côté client, ou edge function avec Puppeteer-like). Premium.
- Capsule temporelle : lettre programmée à date future (table `memory_capsules`).

---

## Phase 4 — Gamification, Communauté, Feed

- **Streaks & badges** : table `achievements`, calcul côté DB (trigger), affichage Duolingo-like.
- **Communauté segmentée** : refonte du forum existant en groupes par âge / situation (0-3 mois, jumeaux, papas solo, allaitement…). Filtres dynamiques.
- **Feed snackable** : route `/feed` — cartes verticales swipeables (astuces, activités, dev). Contenu admin + IA. Bon pour SEO (pages indexables).

---

## Phase 5 — Parent-Care & SOS

- Tracker sommeil parent + hydratation + humeur (table `parent_wellness`).
- Exercice cohérence cardiaque 5 min (timer animé).
- "SOS Experts" : annuaire de pros validés + lien visio (intégration externe type Cal.com plus tard).

---

## Phase 6 — Monétisation propre

- Stripe via `payments--enable_stripe_payments`.
- Plan Premium 4,99 €/mois : IA illimitée, export album PDF, analytics sommeil avancés, multi-enfants illimités, capsule temporelle, co-parent avancé.
- Free généreux : tracking complet à vie.
- Zéro pub, zéro vente de données — afficher la promesse dans le footer + page `/privacy-promise`.

---

## Stack & contraintes techniques

- **Frontend** : on reste sur React + Vite + BrowserRouter (cohérent avec mémoire projet). Pas de React Native maintenant — on livre une **PWA installable** avec `vite-plugin-pwa`, manifest, icônes, offline. Capacitor plus tard si besoin natif.
- **Backend** : Lovable Cloud (Supabase). Toutes les nouvelles tables avec RLS stricte basée sur `family_members`. Triggers de validation (pas de CHECK avec `now()`).
- **IA** : Lovable AI Gateway (LOVABLE_API_KEY déjà présent) via AI SDK + provider `@ai-sdk/openai-compatible`. Modèle par défaut `google/gemini-3-flash-preview`.
- **STT** : ElevenLabs (clé à ajouter si phase 3 active). Sinon Web Speech API gratuit pour phase 1.
- **Realtime** : `ALTER PUBLICATION supabase_realtime ADD TABLE …` pour tracking & co-parent.
- **SEO** : conserve canonicals, hreflang, schema.org (mémoire projet). Routes publiques articles/feed/communauté restent SSR-friendly via Helmet.
- **Sécurité** : `verify_jwt = true` sur toutes les nouvelles edge functions ; admin gating via `has_role`.

---

## Ce que je propose comme prochaine étape

Démarrer par **Phase 0 + Phase 1** dans le même chantier (fondations + écran nocturne + tracking + co-parent), parce que c'est ce qui change immédiatement la valeur perçue et débloque toutes les phases suivantes.

Avant de coder, j'aimerais valider 3 choses avec toi :

1. **Périmètre du premier sprint** : on fait Phase 0+1 d'un coup, ou on découpe encore plus fin (ex. seulement le design system + écran `/now` + tétées) ?
2. **PWA vs natif** : OK pour rester en PWA installable maintenant et garder Capacitor pour plus tard ?
3. **Périmètre de la refonte visuelle** : on repense **toute** l'app (home, articles, boutique, dashboard) avec le nouveau design system, ou seulement les nouvelles sections "parent" et on garde le reste ?

Réponds-moi sur ces 3 points et je lance l'implémentation.
