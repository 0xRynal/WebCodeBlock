# webcodeblock

[![npm version](https://badge.fury.io/js/webcodeblock.svg)](https://www.npmjs.com/package/webcodeblock)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Composant React pour afficher des blocs de code façon VS Code : coloration syntaxique, thèmes, copie, export PNG, pliage de code, Web Component.

## Fonctionnalités

- 23 thèmes : vs-dark, light, dracula, nord, github-dark, monokai, solarized-light/dark, one-dark, gruvbox-dark, tokyo-night, catppuccin-mocha, rose-pine, everforest, kanagawa, ayu-dark, material-ocean, horizon, outrun, forest, ocean, lavender, auto
- Coloration 20+ langages, numéros de ligne, surlignage, wrap, bloc réductible
- Bouton copier, effet machine à écrire (respecte prefers-reduced-motion), style terminal (prompt), mode diff
- Taille (size), clic sur ligne (onLineClick), palette personnalisée, pliage de code (codeFolding)
- Export PNG, plein écran, accessibilité (ARIA, aria-live), TypeScript
- Web Component (HTML / Vue / Svelte / Angular)

## Installation

```bash
npm install webcodeblock
```

## Utilisation

```tsx
import { CodeBlock } from 'webcodeblock';
import 'webcodeblock/styles';

<CodeBlock
  filename="app.ts"
  language="typescript"
  theme="vs-dark"
  code={`function main() { console.log("Hello"); }`}
/>
```

## Exemples

```tsx
// Thèmes : vs-dark | light | dracula | nord | github-dark | monokai | solarized-light | solarized-dark | one-dark | gruvbox-dark | auto
<CodeBlock filename="app.js" language="javascript" theme="dracula" code={code} />

// Options courantes
<CodeBlock
  filename="app.ts"
  language="typescript"
  code={code}
  showLineNumbers={true}
  typingEffect={true}
  maxHeight="400px"
  highlightLines={[1, 3, 5]}
  wrapLines={true}
  collapsible={true}
/>

// Numéro de ligne de départ (extrait de fichier)
<CodeBlock filename="app.ts" language="typescript" code={snippet} showLineNumbers startLineNumber={45} />

// Terminal, diff, export image
<CodeBlock filename="script.sh" language="bash" code={code} prompt="$ " />
<CodeBlock filename="patch.ts" language="typescript" diff={{ oldCode: "const x=1;", newCode: "const x=2;" }} showLineNumbers />
<CodeBlock filename="app.ts" language="typescript" code={code} exportImageButton={true} />

// Taille, clic ligne, palette, pliage
<CodeBlock
  filename="app.ts"
  language="typescript"
  code={code}
  size="small"
  showLineNumbers
  onLineClick={(n) => console.log('Ligne', n)}
  palette={{ bg: '#0d1117', header: '#161b22', text: '#c9d1d9' }}
  codeFolding={true}
  labels={{ fold: 'Replier', unfold: 'Déplier' }}
/>
```

## Props API

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `filename` | `string` | **requis** | Nom du fichier dans l'en-tête |
| `language` | `string` | **requis** | Langage (typescript, javascript, python, html, css, …) |
| `code` | `string` | — | Code source (ignoré si `diff`) |
| `theme` | `string` | `'vs-dark'` | vs-dark, light, dracula, nord, github-dark, monokai, solarized-light, solarized-dark, one-dark, gruvbox-dark, tokyo-night, catppuccin-mocha, rose-pine, everforest, kanagawa, ayu-dark, material-ocean, horizon, outrun, forest, ocean, lavender, auto |
| `copyButton` | `boolean` | `true` | Bouton copier |
| `showLineNumbers` | `boolean` | `false` | Numéros de ligne |
| `typingEffect` | `boolean` | `false` | Effet machine à écrire |
| `typingSpeed` | `number` | `20` | ms par caractère |
| `maxHeight` | `string` | — | Hauteur max + scroll |
| `highlightLines` | `number[] \| string` | — | Ex. `[1,3,5]` ou `"1-3, 5"` |
| `wrapLines` | `boolean` | `false` | Retour à la ligne |
| `collapsible` | `boolean` | `false` | Réduire / Agrandir |
| `prompt` | `string` | — | Préfixe terminal (ex. `"$ "`) |
| `customTheme` | `Record<string, string>` | — | Variables CSS |
| `diff` | `{ oldCode, newCode }` | — | Mode diff |
| `exportImageButton` | `boolean` | `false` | Export PNG |
| `title`, `description` | `string` | — | Titre / description |
| `activeLine` | `number` | — | Ligne mise en avant (1-based) |
| `onCopy` | `() => void` | — | Callback après copie |
| `labels` | `object` | — | copy, copied, expand, reduce, exportImage, fullscreen, closeFullscreen, fold, unfold |
| `fullscreenButton` | `boolean` | `false` | Plein écran |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Taille de police |
| `onLineClick` | `(lineNumber: number) => void` | — | Clic sur numéro de ligne |
| `palette` | `{ bg?, header?, text?, border? }` | — | Couleurs surcharge |
| `codeFolding` | `boolean` | `false` | Replier / déplier blocs |
| `className` | `string` | `''` | Classes CSS |
| `startLineNumber` | `number` | `1` | Numéro de la première ligne (extrait de fichier) |
| `showHeader` | `boolean` | `true` | Afficher la barre (fichier + boutons) |
| `headerActions` | `ReactNode` | — | Boutons ou contenu personnalisé dans la barre (après le nom du fichier) |
| `loading` | `boolean` | `false` | Afficher un skeleton pendant le chargement |
| `fontFamily` | `string` | — | Police du code (ex. `'JetBrains Mono'`) |
| `backgroundImage` | `string` | — | URL d’image de fond pour la zone code |
| `backgroundImageOverlay` | `number` | `0.85` | Opacité de l’overlay noir (0–1) pour garder le code lisible |

## Web Component

Sans React (HTML ou avec Vue/Svelte/Angular). Charger React + le bundle web-component + les styles.

```html
<script type="module">
  import 'https://unpkg.com/react@18/umd/react.production.min.js';
  import 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
  import 'webcodeblock/web-component';
  import 'webcodeblock/styles';
</script>
<web-code-block filename="app.ts" language="typescript" theme="vs-dark" code="function main() {}"></web-code-block>
```

Avec React déjà présent : `import 'webcodeblock/web-component'; import 'webcodeblock/styles';` puis `<web-code-block ... />`.

Attributs : filename, language, theme, code, copy-button, show-line-numbers, wrap-lines, collapsible, prompt, max-height, export-image-button, highlight-lines, size, code-folding, fullscreen-button, title, description, active-line, start-line-number, show-header, loading, font-family, background-image, background-image-overlay.

Événements : `wcb-copy` (après copie), `wcb-line-click` (detail: `{ lineNumber }`). Ex. : `el.addEventListener('wcb-copy', () => ...)` ou `el.addEventListener('wcb-line-click', (e) => console.log(e.detail.lineNumber))`.

## Développement

```bash
npm install && npm run dev
npm run build
```

## License

MIT © [0xRynal](https://github.com/0xRynal)

Remerciements : [Tailwind CSS](https://tailwindcss.com/), [Vite](https://vitejs.dev/), [html2canvas](https://html2canvas.hertzen.com/).  
[NPM](https://www.npmjs.com/package/webcodeblock)
