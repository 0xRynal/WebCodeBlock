import type { ReactNode } from 'react';

export type Theme =
  | 'vs-dark'
  | 'light'
  | 'dracula'
  | 'nord'
  | 'github-dark'
  | 'monokai'
  | 'solarized-light'
  | 'solarized-dark'
  | 'one-dark'
  | 'gruvbox-dark'
  | 'tokyo-night'
  | 'catppuccin-mocha'
  | 'rose-pine'
  | 'everforest'
  | 'kanagawa'
  | 'ayu-dark'
  | 'material-ocean'
  | 'horizon'
  | 'outrun'
  | 'forest'
  | 'ocean'
  | 'lavender'
  | 'auto';

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
  | string;

export interface CodeBlockProps {
  filename: string;
  language: Language;
  theme?: Theme;
  code?: string;
  copyButton?: boolean;
  typingEffect?: boolean;
  typingSpeed?: number;
  showLineNumbers?: boolean;
  maxHeight?: string;
  highlightLines?: number[] | string;
  wrapLines?: boolean;
  collapsible?: boolean;
  prompt?: string;
  customTheme?: Record<string, string>;
  diff?: { oldCode: string; newCode: string };
  exportImageButton?: boolean;
  title?: string;
  description?: string;
  activeLine?: number;
  onCopy?: () => void;
  labels?: {
    copy?: string;
    copied?: string;
    expand?: string;
    reduce?: string;
    exportImage?: string;
    fullscreen?: string;
    closeFullscreen?: string;
    fold?: string;
    unfold?: string;
  };
  fullscreenButton?: boolean;
  size?: 'small' | 'medium' | 'large';
  onLineClick?: (lineNumber: number) => void;
  palette?: {
    bg?: string;
    header?: string;
    text?: string;
    border?: string;
  };
  codeFolding?: boolean;
  className?: string;
  startLineNumber?: number;
  showHeader?: boolean;
  headerActions?: ReactNode;
  loading?: boolean;
  fontFamily?: string;
  backgroundImage?: string;
  backgroundImageOverlay?: number;
}
