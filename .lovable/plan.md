## Vidéo BabyBaby — Format 9:16 (Reels/TikTok/Stories)

**Objectif :** Générer une vidéo verticale 1080×1920 de ~25s, prête à publier sur Instagram Reels, TikTok et Stories.

### Concept créatif

**Direction visuelle :**
- Palette : crème `#FAF7F2` (fond), navy `#1B2A4E` (texte principal), corail `#E76F51` (accents), or doux `#D4A574` (détails)
- Typo : Fraunces (display serif, chaleureux) + Inter (body)
- Style : éditorial doux, parental, premium — proche du carrousel Insta déjà produit
- Motion : entrées spring douces, parallaxe subtile, transitions slide/fade
- Pas d'IA cliché (pas de néon, pas de gradient violet)

**Storyboard (5 scènes, ~5s chacune) :**

1. **Hook (0–4s)** — Fond crème, gros titre "Et si UNE SEULE app remplaçait vos 7 onglets de jeune parent ?" avec "UNE SEULE" en corail. Léger sticker animé.
2. **Problème (4–9s)** — Liste animée : "🍼 Dernière tétée ?" / "💉 Prochain vaccin ?" / "😴 Bruit blanc ?" / "🔄 À qui le tour ?". Apparition staggered.
3. **Solution (9–15s)** — Mockup smartphone vertical (image générée) avec courbe OMS + widgets, "BabyBaby.org" en gros + sous-titre "Tout en 1, 100% gratuit".
4. **Preuve (15–20s)** — Chiffres animés : **15 000 familles** • **4,9/5** • **Normes OMS** • **0€**. Stagger en compteurs.
5. **CTA (20–25s)** — "Vos premiers **1000 jours**, sereinement." + "babybaby.org" + petit handle visuel.

**Voiceover (optionnel) :** version 25s en français (voix féminine chaleureuse via ElevenLabs). Musique : aucune par défaut (ajoutable côté édition Insta/TikTok pour éviter copyright).

### Plan technique

- Stack : **Remotion** (1080×1920, 30fps, 750 frames = 25s)
- Sandbox : scaffold dans `remotion/`, render headless via `scripts/render-remotion.mjs` → `/mnt/documents/babybaby-reel-9x16.mp4`
- Fonts : Google Fonts via `@remotion/google-fonts` (Fraunces + Inter)
- Assets visuels :
  - 1 image générée du mockup téléphone (scène 3) — réutilise palette du carrousel
  - 1 image background subtil (texture papier crème)
  - Pas de photos de bébé (évite questions de droits)
- Voiceover : **désactivé par défaut** (vidéo muette type Reel) — je peux l'ajouter via ElevenLabs si tu veux (~+30s de génération)
- Transitions : `@remotion/transitions` (slide + fade, springTiming)

### Livrable
- `babybaby-reel-9x16.mp4` (1080×1920, ~25s, H.264, muet)
- Tag `<presentation-artifact>` pour téléchargement direct

### Question rapide avant build

**Voiceover en français inclus ou vidéo muette (texte uniquement) ?** Le muet est généralement préféré pour Reels/TikTok (les utilisateurs ajoutent leur musique), mais le voiceover augmente la rétention.

Confirme (ou réponds "muet" / "voix off") et je lance la production.