# webcodeblock

[![npm version](https://badge.fury.io/js/webcodeblock.svg)](https://www.npmjs.com/package/webcodeblock)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Composant React pour afficher des blocs de code façon VS Code avec coloration syntaxique, thèmes personnalisables et animations.

## Fonctionnalités

- 10 thèmes : VS Dark, Light, Dracula, Nord, GitHub Dark, Monokai, Solarized Light/Dark, One Dark, Gruvbox Dark + thème auto (système)
- Boutons macOS (traffic lights)
- Coloration syntaxique intégrée (20+ langages)
- Bouton copier intégré
- Effet machine à écrire optionnel
- Numéros de ligne optionnels
- Surlignage de lignes (highlightLines)
- Retour à la ligne (wrapLines) et bloc réductible (collapsible)
- Style terminal (prompt), mode diff (old/new), thème personnalisable (customTheme)
- Export en image PNG (exportImageButton)
- Taille de police (size: small / medium / large)
- Clic sur numéro de ligne (onLineClick) pour permalink / navigation
- Palette personnalisée (palette: bg, header, text, border)
- Pliage de code (codeFolding) : replier/déplier blocs comme dans un IDE (fonctions, classes)
- Accessibilité (ARIA, clavier, annonce « Copié » en aria-live)
- Responsive
- TypeScript
- Zero configuration
- Web Component (usage sans React)
- Utilisable depuis Vue, Svelte, Angular

## Installation

```bash
npm install webcodeblock
# ou
yarn add webcodeblock
# ou
pnpm add webcodeblock
```

## Utilisation rapide

```tsx
import { CodeBlock } from 'webcodeblock';
import 'webcodeblock/styles';

function App() {
  return (
    <CodeBlock
      filename="app.ts"
      language="typescript"
      theme="vs-dark"
      code={`function main() {
  console.log("Hello");
}`}
    />
  );
}
```

## Exemples

### Exemple basique

```tsx
<CodeBlock
  filename="app.js"
  language="javascript"
  code={`console.log("Hello World!");`}
/>
```

### Avec toutes les options

```tsx
<CodeBlock
  filename="server.ts"
  language="typescript"
  theme="dracula"
  code={code}
  copyButton={true}
  showLineNumbers={true}
  typingEffect={true}
  typingSpeed={30}
  maxHeight="500px"
/>
```

### Différents thèmes

```tsx
// VS Dark (par défaut)
<CodeBlock filename="dark.js" language="javascript" theme="vs-dark" code={code} />

// Light
<CodeBlock filename="light.js" language="javascript" theme="light" code={code} />

// Autres thèmes
<CodeBlock filename="dracula.js" language="javascript" theme="dracula" code={code} />
<CodeBlock filename="nord.js" language="javascript" theme="nord" code={code} />
<CodeBlock filename="github.js" language="javascript" theme="github-dark" code={code} />
<CodeBlock filename="monokai.js" language="javascript" theme="monokai" code={code} />
<CodeBlock filename="solarized.js" language="javascript" theme="solarized-light" code={code} />
<CodeBlock filename="solarized-dark.js" language="javascript" theme="solarized-dark" code={code} />
<CodeBlock filename="one-dark.js" language="javascript" theme="one-dark" code={code} />
<CodeBlock filename="gruvbox.js" language="javascript" theme="gruvbox-dark" code={code} />

// Auto (suit prefers-color-scheme)
<CodeBlock filename="auto.js" language="javascript" theme="auto" code={code} />
```

### Langages supportés

```tsx
// JavaScript / TypeScript
<CodeBlock filename="app.ts" language="typescript" code={tsCode} />
<CodeBlock filename="app.jsx" language="jsx" code={jsxCode} />

// HTML / CSS
<CodeBlock filename="index.html" language="html" code={htmlCode} />
<CodeBlock filename="style.css" language="css" code={cssCode} />

// Python
<CodeBlock filename="main.py" language="python" code={pythonCode} />

// Et bien plus : Go, Rust, Java, PHP, Ruby, Bash, SQL, etc.
```

### Effet machine à écrire

```tsx
<CodeBlock
  filename="typing.ts"
  language="typescript"
  code={code}
  typingEffect={true}
  typingSpeed={20} // ms par caractère
/>
```

### Numéros de ligne

```tsx
<CodeBlock
  filename="example.py"
  language="python"
  code={code}
  showLineNumbers={true}
/>
```

### Surlignage de lignes et options

```tsx
<CodeBlock
  filename="app.ts"
  language="typescript"
  code={code}
  highlightLines={[1, 3, 5]}
  wrapLines={true}
  maxHeight="400px"
  collapsible={true}
/>
```

### Style terminal (prompt)

```tsx
<CodeBlock
  filename="script.sh"
  language="bash"
  code={code}
  prompt="$ "
/>
```

### Mode diff

```tsx
<CodeBlock
  filename="patch.ts"
  language="typescript"
  diff={{ oldCode: "const x = 1;", newCode: "const x = 2;" }}
  showLineNumbers={true}
/>
```

### Thème personnalisé et export image

```tsx
<CodeBlock
  filename="app.ts"
  language="typescript"
  code={code}
  customTheme={{ '--wcb-vs-dark-bg': '#1a1a2e' }}
  exportImageButton={true}
/>
```

### Titre, description, ligne active, plein écran et i18n

```tsx
<CodeBlock
  filename="hook.ts"
  language="typescript"
  code={code}
  title="Exemple useReducer"
  description="Hook React pour gérer un état complexe."
  activeLine={3}
  onCopy={() => console.log('Copié')}
  fullscreenButton={true}
  labels={{ copy: 'Copy', copied: 'Copied!', fullscreen: 'Fullscreen', closeFullscreen: 'Close' }}
/>
```

### Taille, clic sur ligne, palette

```tsx
<CodeBlock
  filename="app.ts"
  language="typescript"
  code={code}
  size="small"
  showLineNumbers={true}
  onLineClick={(lineNum) => console.log('Ligne', lineNum)}
  palette={{ bg: '#0d1117', header: '#161b22', text: '#c9d1d9' }}
/>
```

### Pliage de code (replier / déplier comme dans un IDE)

```tsx
<CodeBlock
  filename="utils.ts"
  language="typescript"
  code={codeAvecFonctions}
  showLineNumbers={true}
  codeFolding={true}
  labels={{ fold: 'Replier', unfold: 'Déplier' }}
/>
```

Les blocs qui se terminent par `{` (fonctions, classes, etc.) affichent un chevron à gauche : clic pour replier (▼ → ▶) ou déplier (▶ → ▼).

## Props API

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `filename` | `string` | **requis** | Nom du fichier affiché dans l'en-tête |
| `language` | `string` | **requis** | Langage pour la coloration syntaxique |
| `code` | `string` | — | Code source (ignoré si `diff` est fourni) |
| `theme` | `'vs-dark' \| 'light' \| 'dracula' \| 'nord' \| 'github-dark' \| 'monokai' \| 'solarized-light' \| 'solarized-dark' \| 'one-dark' \| 'gruvbox-dark' \| 'auto'` | `'vs-dark'` | Thème visuel |
| `copyButton` | `boolean` | `true` | Afficher le bouton copier |
| `showLineNumbers` | `boolean` | `false` | Afficher les numéros de ligne |
| `typingEffect` | `boolean` | `false` | Activer l'effet machine à écrire |
| `typingSpeed` | `number` | `20` | Vitesse du typing (ms/caractère) |
| `maxHeight` | `string` | `undefined` | Hauteur max avec scroll |
| `highlightLines` | `number[] \| string` | — | Lignes à surligner (ex: `[1,3,5]` ou `"1-3, 5"`) |
| `wrapLines` | `boolean` | `false` | Retour à la ligne des lignes longues |
| `collapsible` | `boolean` | `false` | Bouton Réduire/Agrandir (avec maxHeight) |
| `prompt` | `string` | — | Préfixe style terminal (ex: `"$ "`, `"> "`) |
| `customTheme` | `Record<string, string>` | — | Variables CSS pour surcharger le thème |
| `diff` | `{ oldCode: string; newCode: string }` | — | Mode diff (lignes − rouge / + vert) |
| `exportImageButton` | `boolean` | `false` | Bouton pour exporter le bloc en PNG |
| `title` | `string` | — | Titre optionnel au-dessus du bloc |
| `description` | `string` | — | Description optionnelle sous le bloc |
| `activeLine` | `number` | — | Ligne à mettre en avant (1-based) |
| `onCopy` | `() => void` | — | Callback après copie réussie |
| `labels` | `object` | — | Libellés i18n (copy, copied, expand, reduce, exportImage, fullscreen, closeFullscreen, fold, unfold) |
| `fullscreenButton` | `boolean` | `false` | Bouton pour afficher le bloc en plein écran |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Taille de police du code |
| `onLineClick` | `(lineNumber: number) => void` | — | Callback au clic sur un numéro de ligne (1-based) |
| `palette` | `{ bg?, header?, text?, border? }` | — | Couleurs pour surcharger le thème (bg, header, text, border) |
| `codeFolding` | `boolean` | `false` | Activer le pliage de code (replier/déplier blocs comme dans un IDE) |
| `className` | `string` | `''` | Classes CSS personnalisées |

## Thèmes disponibles

Valeurs possibles pour la prop `theme` : `vs-dark` (défaut), `light`, `dracula`, `nord`, `github-dark`, `monokai`, `solarized-light`, `solarized-dark`, `one-dark`, `gruvbox-dark`, `auto`.

| Valeur | Description |
|--------|-------------|
| `vs-dark` | Sombre type VS Code (défaut) |
| `light` | Clair, contraste renforcé |
| `dracula` | Palette Dracula |
| `nord` | Palette Nord |
| `github-dark` | Sombre type GitHub |
| `monokai` | Palette Monokai |
| `solarized-light` / `solarized-dark` | Palette Solarized |
| `one-dark` | One Dark |
| `gruvbox-dark` | Gruvbox sombre |
| `auto` | Suit `prefers-color-scheme` |

## Web Component

Utilisation sans React (HTML, ou avec Vue/Svelte/Angular). Nécessite React et React-DOM chargés sur la page.

```html
<script type="module">
  import 'https://unpkg.com/react@18/umd/react.production.min.js';
  import 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
  import 'webcodeblock/web-component';
  import 'webcodeblock/styles';
</script>
<web-code-block
  filename="app.ts"
  language="typescript"
  theme="vs-dark"
  code="function main() { console.log('Hello'); }"
></web-code-block>
```

En module ES (avec React déjà présent) :

```js
import 'webcodeblock/web-component';
import 'webcodeblock/styles';
// Le custom element <web-code-block> est enregistré automatiquement
```

Attributs supportés : `filename`, `language`, `theme`, `code`, `copy-button`, `show-line-numbers`, `wrap-lines`, `collapsible`, `prompt`, `max-height`, `export-image-button`, `highlight-lines` (ex. `"1-3, 5"`). Thèmes : `vs-dark`, `light`, `dracula`, `nord`, `github-dark`, `monokai`, `solarized-light`, `solarized-dark`, `one-dark`, `gruvbox-dark`, `auto`.

## Vue, Svelte, Angular

Utilisez le Web Component (charger React + le script web-component + les styles, puis le custom element).

**Vue 3** (optionnel : indiquer que le custom element est un composant Vue) :

```vue
<template>
  <web-code-block
    filename="app.ts"
    language="typescript"
    :code="code"
  />
</template>
<script setup>
import 'webcodeblock/web-component';
import 'webcodeblock/styles';
const code = `function main() {}`;
</script>
```

**Svelte** : idem, importer le script et les styles une fois, puis `<web-code-block ... />` dans le template.

**Angular** : ajouter `CUSTOM_ELEMENTS_SCHEMA` au module/component, importer le script et les styles dans `angular.json` ou au bootstrap, puis `<web-code-block ...></web-code-block>` dans le template.

## Langages supportés

JavaScript, TypeScript, JSX, TSX, HTML, CSS, Python, Java, Go, Rust, C, C++, C#, PHP, Ruby, Bash, JSON, YAML, Markdown, SQL, et plus encore.

## Développement

### Installation locale

```bash
npm install
```

### Mode développement

```bash
npm run dev
```

### Build

```bash
npm run build
```

## License

MIT © [0xRynal](https://github.com/0xRynal)

## Remerciements

- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Vite](https://vitejs.dev/) pour le build
- [html2canvas](https://html2canvas.hertzen.com/) pour l’export image

## Liens

- [NPM Package](https://www.npmjs.com/package/webcodeblock)
