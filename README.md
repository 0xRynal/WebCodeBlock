# webcodeblock

[![npm version](https://badge.fury.io/js/webcodeblock.svg)](https://www.npmjs.com/package/webcodeblock)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Composant React pour afficher des blocs de code façon VS Code avec coloration syntaxique, thèmes personnalisables et animations.

## Fonctionnalités

- 4 thèmes : VS Dark, Light, Dracula, Nord
- Boutons macOS (traffic lights)
- Coloration syntaxique via Prism.js (20+ langages)
- Bouton copier intégré
- Effet machine à écrire optionnel
- Numéros de ligne optionnels
- Responsive
- TypeScript
- Zero configuration

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
import 'webcodeblock/dist/style.css';

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

// Dracula
<CodeBlock filename="dracula.js" language="javascript" theme="dracula" code={code} />

// Nord
<CodeBlock filename="nord.js" language="javascript" theme="nord" code={code} />
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

## Props API

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `filename` | `string` | **requis** | Nom du fichier affiché dans l'en-tête |
| `language` | `string` | **requis** | Langage pour la coloration syntaxique |
| `code` | `string` | **requis** | Code source à afficher |
| `theme` | `'vs-dark' \| 'light' \| 'dracula' \| 'nord'` | `'vs-dark'` | Thème visuel |
| `copyButton` | `boolean` | `true` | Afficher le bouton copier |
| `showLineNumbers` | `boolean` | `false` | Afficher les numéros de ligne |
| `typingEffect` | `boolean` | `false` | Activer l'effet machine à écrire |
| `typingSpeed` | `number` | `20` | Vitesse du typing (ms/caractère) |
| `maxHeight` | `string` | `undefined` | Hauteur max avec scroll |
| `className` | `string` | `''` | Classes CSS personnalisées |

## Thèmes disponibles

### VS Dark
Thème sombre inspiré de Visual Studio Code (par défaut)

### Light
Thème clair pour les fonds blancs

### Dracula
Thème sombre populaire avec couleurs vives

### Nord
Thème nordique avec palette froide

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

- [Prism.js](https://prismjs.com/) pour la coloration syntaxique
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Vite](https://vitejs.dev/) pour le build

## Liens

- [NPM Package](https://www.npmjs.com/package/webcodeblock)
