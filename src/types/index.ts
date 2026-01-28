/**
 * Thèmes disponibles pour le CodeBlock
 */
export type Theme = 'vs-dark' | 'light' | 'dracula' | 'nord';

/**
 * Langages supportés par Prism.js
 */
export type Language = 
  | 'javascript' 
  | 'typescript' 
  | 'jsx' 
  | 'tsx'
  | 'html' 
  | 'css' 
  | 'python' 
  | 'java' 
  | 'go' 
  | 'rust' 
  | 'c' 
  | 'cpp' 
  | 'csharp'
  | 'php'
  | 'ruby'
  | 'bash'
  | 'json'
  | 'yaml'
  | 'markdown'
  | 'sql'
  | string; // Permet d'autres langages Prism

/**
 * Props du composant CodeBlock
 */
export interface CodeBlockProps {
  /** Nom du fichier à afficher dans l'en-tête */
  filename: string;
  
  /** Langage pour la coloration syntaxique */
  language: Language;
  
  /** Thème visuel du bloc de code */
  theme?: Theme;
  
  /** Code source à afficher */
  code: string;
  
  /** Afficher un bouton pour copier le code */
  copyButton?: boolean;
  
  /** Activer l'effet de machine à écrire */
  typingEffect?: boolean;
  
  /** Vitesse de l'effet typing (ms par caractère) */
  typingSpeed?: number;
  
  /** Afficher les numéros de ligne */
  showLineNumbers?: boolean;
  
  /** Hauteur maximale du bloc (avec scroll si dépassé) */
  maxHeight?: string;
  
  /** Classe CSS personnalisée */
  className?: string;
  
}

