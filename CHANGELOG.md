# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2025-10-11

### Première version

#### Ajouté
- Composant `CodeBlock` avec support de React
- Coloration syntaxique via Prism.js pour 20+ langages
- 4 thèmes : VS Dark, Light, Dracula, Nord
- Boutons macOS style (rouge, jaune, vert)
- Bouton copier dans le presse-papiers
- Numéros de ligne optionnels
- Effet machine à écrire (typing effect)
- Support TypeScript complet
- Build ESM et CJS
- Documentation complète
- Page de démo interactive
- Guide de publication npm

#### Langages supportés
- JavaScript, TypeScript, JSX, TSX
- HTML, CSS
- Python, Java, Go, Rust
- C, C++, C#, PHP, Ruby
- Bash, JSON, YAML, Markdown, SQL

#### Fonctionnalités
- Affichage du code avec thèmes
- Responsive design
- Animations fluides
- Copie en un clic
- TypeScript types inclus
- Zero configuration

---

## [2.4.0] - 2026-01-29

### Ajouté
- **12 nouveaux thèmes** : tokyo-night, catppuccin-mocha, rose-pine, everforest, kanagawa, ayu-dark, material-ocean, horizon, outrun, forest, ocean, lavender
- **backgroundImage** : image de fond pour la zone code (URL)
- **backgroundImageOverlay** : opacité de l’overlay noir (0–1, défaut 0.85) pour garder le code lisible
- **Web Component** : attributs background-image, background-image-overlay

---

## [2.3.0] - 2026-01-29

### Ajouté
- **showHeader** : masquer la barre (fichier + boutons) pour un affichage code seul
- **headerActions** : slot ReactNode pour boutons personnalisés dans la barre (ex. « Ouvrir dans CodeSandbox »)
- **loading** : état chargement avec skeleton animé (respecte prefers-reduced-motion)
- **fontFamily** : police du code (ex. `'JetBrains Mono'`)
- **Web Component** : attributs show-header, loading, font-family

---

## [2.2.0] - 2026-01-29

### Ajouté
- **startLineNumber** : numéro de la première ligne affichée (extrait de fichier, ex. lignes 45–52)
- **prefers-reduced-motion** : l’effet machine à écrire est désactivé si l’utilisateur a demandé moins d’animations
- **Web Component** : attributs size, code-folding, fullscreen-button, title, description, active-line, start-line-number
- **Web Component** : événements personnalisés `wcb-copy` et `wcb-line-click` (detail: `{ lineNumber }`)

---

## [2.0.0] - 2026-01-28

### Ajouté
- Thèmes **Solarized Light**, **Solarized Dark**, **One Dark**, **Gruvbox Dark**
- Thème **Light** retravaillé : fond #f6f8fa, contraste renforcé, couleurs de syntaxe dédiées
- **prompt** : style terminal avec préfixe (ex: `"$ "`, `"> "`)
- **customTheme** : variables CSS personnalisées pour surcharger le thème
- **diff** : mode diff avec `{ oldCode, newCode }` (lignes − rouge / + vert)
- **exportImageButton** : bouton pour exporter le bloc en PNG (html2canvas, chargé à la demande)
- **Web Component** : entrée `webcodeblock/web-component`, custom element `<web-code-block>`
- **Vue / Svelte / Angular** : utilisation via le Web Component
- **Prism retiré** : coloration 100 % intégrée, bundle plus léger
- **title** / **description** : titre et description optionnels
- **activeLine** : ligne mise en avant (bordure bleue, fond léger)
- **onCopy** : callback après copie réussie
- **labels** : libellés i18n (copy, copied, expand, reduce, exportImage, fullscreen, closeFullscreen, fold, unfold)
- **fullscreenButton** : bouton modal plein écran
- **size** : taille de police (`'small' | 'medium' | 'large'`)
- **onLineClick** : callback au clic sur un numéro de ligne (1-based)
- **palette** : surcharge couleurs thème (bg, header, text, border)
- **Accessibilité** : aria-live « Copié », role region, aria-label, clavier
- **codeFolding** : pliage de code façon IDE (replier/déplier blocs), ligne de fermeture `}` visible quand replié

---

## [1.1.0] - 2026-01-28

### Ajouté
- Thèmes **GitHub Dark** et **Monokai**
- Thème **auto** : suit la préférence système (`prefers-color-scheme`)
- **highlightLines** : surligner des lignes (`[1, 3, 5]` ou `"1-3, 5"`)
- **wrapLines** : retour à la ligne des lignes longues
- **collapsible** : bouton Réduire/Agrandir quand `maxHeight` est défini
- Accessibilité : `role="region"`, `aria-label` sur le bloc et le bouton copier, support clavier (Enter/Espace sur copier)
