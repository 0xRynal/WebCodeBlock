import React, { useEffect, useState } from 'react';
import { CodeBlockProps } from '../types';

/**
 * Parse et colorise le code avec curseur intégré
 */
const highlightCodeWithCursor = (code: string, language: string, showCursor: boolean, theme: string): JSX.Element => {
  if (!code) return <></>;

  switch (language) {
    case 'typescript':
    case 'javascript':
      return highlightJavaScriptWithCursor(code, showCursor, theme);
    case 'jsx':
      return highlightJSXWithCursor(code, showCursor, theme);
    case 'html':
    case 'css':
    case 'python':
    case 'json':
    case 'yaml':
    case 'sql':
    case 'bash':
    case 'shell':
    case 'markdown':
      return highlightGenericWithCursor(code, language, showCursor, theme);
    default:
      return (
        <>
          <span>{code}</span>
          {showCursor && (
            <span className="typing-cursor" style={{
              backgroundColor: theme === 'light' ? '#333' : '#fff'
            }} />
          )}
        </>
      );
  }
};

/**
 * Coloration pour JavaScript/TypeScript avec curseur
 */
const highlightJavaScriptWithCursor = (code: string, showCursor: boolean, theme: string): JSX.Element => {
  const lines = code.split('\n');
  
  return (
    <>
      {lines.map((line, lineIndex) => {
        const tokens = parseLine(line);
        const isLastLine = lineIndex === lines.length - 1;
        const isLastLineEmpty = isLastLine && line.trim() === '';
        
        return (
          <div key={lineIndex}>
            {tokens.map((token, tokenIndex) => (
              <span key={tokenIndex} className={`token ${token.type}`}>
                {token.text}
              </span>
            ))}
            {showCursor && isLastLine && !isLastLineEmpty && (
              <span className="typing-cursor" style={{
                backgroundColor: theme === 'light' ? '#333' : '#fff'
              }} />
            )}
            {showCursor && isLastLine && isLastLineEmpty && (
              <span className="typing-cursor" style={{
                backgroundColor: theme === 'light' ? '#333' : '#fff'
              }} />
            )}
            {lineIndex < lines.length - 1 && '\n'}
          </div>
        );
      })}
    </>
  );
};

const parseLine = (line: string) => {
  const tokens = [];
  let current = 0;
  
  while (current < line.length) {
    let found = false;
    
    // Commentaires //
    const commentMatch = line.slice(current).match(/^(\/\/.*)/);
    if (commentMatch) {
      tokens.push({ text: commentMatch[1], type: 'comment' });
      current += commentMatch[1].length;
      found = true;
    }
    
    // Chaînes
    const stringMatch = line.slice(current).match(/^(["'`])(?:(?!\1)[^\\]|\\.)*\1/);
    if (!found && stringMatch) {
      tokens.push({ text: stringMatch[0], type: 'string' });
      current += stringMatch[0].length;
      found = true;
    }
    
    // Mots-clés
    const keywordMatch = line.slice(current).match(/^(function|const|let|var|if|else|for|while|return|class|interface|type|enum|import|export|from|async|await|try|catch|throw|new|this|super|extends|implements|public|private|protected|static|readonly|abstract|namespace|declare|module|as|is|in|of|typeof|instanceof|void|never|unknown|any|boolean|string|number|object|symbol|bigint)\b/);
    if (!found && keywordMatch) {
      tokens.push({ text: keywordMatch[1], type: 'keyword' });
      current += keywordMatch[1].length;
      found = true;
    }
    
    // Nombres
    const numberMatch = line.slice(current).match(/^(\d+(\.\d+)?)/);
    if (!found && numberMatch) {
      tokens.push({ text: numberMatch[1], type: 'number' });
      current += numberMatch[1].length;
      found = true;
    }
    
    // Classes (majuscule)
    const classMatch = line.slice(current).match(/^([A-Z][a-zA-Z0-9]*)/);
    if (!found && classMatch) {
      tokens.push({ text: classMatch[1], type: 'class-name' });
      current += classMatch[1].length;
      found = true;
    }
    
    // Fonctions
    const functionMatch = line.slice(current).match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
    if (!found && functionMatch) {
      tokens.push({ text: functionMatch[1], type: 'function' });
      current += functionMatch[1].length;
      found = true;
    }
    
    // Variables/Props - maxHeight, className, etc.
    const variableMatch = line.slice(current).match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (!found && variableMatch) {
      tokens.push({ text: variableMatch[1], type: 'variable' });
      current += variableMatch[1].length;
      found = true;
    }
    
    // Opérateurs
    const operatorMatch = line.slice(current).match(/^([+\-*/%=<>!&|^~?:;,\.\[\]{}()])/);
    if (!found && operatorMatch) {
      tokens.push({ text: operatorMatch[1], type: 'operator' });
      current += operatorMatch[1].length;
      found = true;
    }
    
    if (!found) {
      tokens.push({ text: line[current], type: 'text' });
      current++;
    }
  }
  
  return tokens;
};

/**
 * Coloration pour JSX avec curseur
 */
const highlightJSXWithCursor = (code: string, showCursor: boolean, theme: string): JSX.Element => {
  const lines = code.split('\n');
  
  return (
    <>
      {lines.map((line, lineIndex) => {
        const tokens = parseJSXLine(line);
        const isLastLine = lineIndex === lines.length - 1;
        const isLastLineEmpty = isLastLine && line.trim() === '';
        
        return (
          <div key={lineIndex}>
            {tokens.map((token, tokenIndex) => (
              <span key={tokenIndex} className={`token ${token.type}`}>
                {token.text}
              </span>
            ))}
            {showCursor && isLastLine && !isLastLineEmpty && (
              <span className="typing-cursor" style={{
                backgroundColor: theme === 'light' ? '#333' : '#fff'
              }} />
            )}
            {showCursor && isLastLine && isLastLineEmpty && (
              <span className="typing-cursor" style={{
                backgroundColor: theme === 'light' ? '#333' : '#fff'
              }} />
            )}
            {lineIndex < lines.length - 1 && '\n'}
          </div>
        );
      })}
    </>
  );
};

const parseJSXLine = (line: string) => {
  const tokens = [];
  let current = 0;
  
  while (current < line.length) {
    let found = false;
    
    // Commentaires //
    const commentMatch = line.slice(current).match(/^(\/\/.*)/);
    if (!found && commentMatch) {
      tokens.push({ text: commentMatch[1], type: 'comment' });
      current += commentMatch[1].length;
      found = true;
    }
    
    // Balises JSX <div>, </div>, <Component />
    const jsxTagMatch = line.slice(current).match(/^(<\/?[A-Za-z][A-Za-z0-9]*)/);
    if (!found && jsxTagMatch) {
      tokens.push({ text: jsxTagMatch[1], type: 'tag' });
      current += jsxTagMatch[1].length;
      found = true;
    }
    
    // Attributs JSX className="value"
    const attrMatch = line.slice(current).match(/^([a-zA-Z-]+)\s*=/);
    if (!found && attrMatch) {
      tokens.push({ text: attrMatch[1], type: 'attr-name' });
      current += attrMatch[1].length;
      found = true;
    }
    
    // Chaînes
    const stringMatch = line.slice(current).match(/^(["'`])(?:(?!\1)[^\\]|\\.)*\1/);
    if (!found && stringMatch) {
      tokens.push({ text: stringMatch[0], type: 'string' });
      current += stringMatch[0].length;
      found = true;
    }
    
    // Mots-clés
    const keywordMatch = line.slice(current).match(/^(function|const|let|var|if|else|for|while|return|class|interface|import|export|from|async|await|try|catch|throw|new|this|super|extends|implements|public|private|protected|static|readonly|default)\b/);
    if (!found && keywordMatch) {
      tokens.push({ text: keywordMatch[1], type: 'keyword' });
      current += keywordMatch[1].length;
      found = true;
    }
    
    // Nombres
    const numberMatch = line.slice(current).match(/^(\d+(\.\d+)?)/);
    if (!found && numberMatch) {
      tokens.push({ text: numberMatch[1], type: 'number' });
      current += numberMatch[1].length;
      found = true;
    }
    
    // Classes (majuscule) - Composants React
    const classMatch = line.slice(current).match(/^([A-Z][a-zA-Z0-9]*)/);
    if (!found && classMatch) {
      tokens.push({ text: classMatch[1], type: 'class-name' });
      current += classMatch[1].length;
      found = true;
    }
    
    // Fonctions
    const functionMatch = line.slice(current).match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
    if (!found && functionMatch) {
      tokens.push({ text: functionMatch[1], type: 'function' });
      current += functionMatch[1].length;
      found = true;
    }
    
    // Variables/Props - maxHeight, className, etc.
    const variableMatch = line.slice(current).match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (!found && variableMatch) {
      tokens.push({ text: variableMatch[1], type: 'variable' });
      current += variableMatch[1].length;
      found = true;
    }
    
    // Opérateurs
    const operatorMatch = line.slice(current).match(/^([+\-*/%=<>!&|^~?:;,\.\[\]{}()])/);
    if (!found && operatorMatch) {
      tokens.push({ text: operatorMatch[1], type: 'operator' });
      current += operatorMatch[1].length;
      found = true;
    }
    
    if (!found) {
      tokens.push({ text: line[current], type: 'text' });
      current++;
    }
  }
  
  return tokens;
};

/**
 * Parser générique amélioré pour les langages non-JS
 */
const parseGenericLine = (line: string, language: string) => {
  const tokens = [];
  let current = 0;
  
  while (current < line.length) {
    let found = false;
    
    // Commentaires selon le langage
    const commentPatterns = {
      html: /^<!--[\s\S]*?-->/,
      css: /^\/\*[\s\S]*?\*\/|\/\/.*/,
      python: /^#.*/,
      yaml: /^#.*/,
      sql: /^--.*/,
      bash: /^#.*/,
      json: /^\/\/.*/,
      markdown: /^<!--[\s\S]*?-->/,
    };
    
    const commentMatch = line.slice(current).match(commentPatterns[language as keyof typeof commentPatterns] || /^\/\/.*/);
    if (!found && commentMatch) {
      tokens.push({ text: commentMatch[0], type: 'comment' });
      current += commentMatch[0].length;
      found = true;
    }
    
    // Chaînes
    const stringMatch = line.slice(current).match(/^(["'`])(?:(?!\1)[^\\]|\\.)*\1/);
    if (!found && stringMatch) {
      tokens.push({ text: stringMatch[0], type: 'string' });
      current += stringMatch[0].length;
      found = true;
    }
    
    // Langage spécifique
    if (language === 'html') {
      // Balises HTML <tag>
      const htmlTagMatch = line.slice(current).match(/^(<\/?[a-zA-Z][a-zA-Z0-9]*)/);
      if (!found && htmlTagMatch) {
        tokens.push({ text: htmlTagMatch[1], type: 'tag' });
        current += htmlTagMatch[1].length;
        found = true;
      }
      
      // Attributs HTML
      const htmlAttrMatch = line.slice(current).match(/^([a-zA-Z-]+)\s*=/);
      if (!found && htmlAttrMatch) {
        tokens.push({ text: htmlAttrMatch[1], type: 'attr-name' });
        current += htmlAttrMatch[1].length;
        found = true;
      }
    }
    
    if (language === 'css') {
      // Sélecteurs CSS
      const cssSelectorMatch = line.slice(current).match(/^([.#]?[a-zA-Z][a-zA-Z0-9-]*)/);
      if (!found && cssSelectorMatch) {
        tokens.push({ text: cssSelectorMatch[1], type: 'selector' });
        current += cssSelectorMatch[1].length;
        found = true;
      }
      
      // Propriétés CSS
      const cssPropMatch = line.slice(current).match(/^([a-zA-Z-]+)\s*:/);
      if (!found && cssPropMatch) {
        tokens.push({ text: cssPropMatch[1], type: 'property' });
        current += cssPropMatch[1].length;
        found = true;
      }
      
      // At-rules CSS
      const cssAtRuleMatch = line.slice(current).match(/^(@[a-zA-Z-]+)/);
      if (!found && cssAtRuleMatch) {
        tokens.push({ text: cssAtRuleMatch[1], type: 'keyword' });
        current += cssAtRuleMatch[1].length;
        found = true;
      }
    }
    
    if (language === 'json') {
      // Clés JSON
      const jsonKeyMatch = line.slice(current).match(/^"([^"]+)":/);
      if (!found && jsonKeyMatch) {
        tokens.push({ text: jsonKeyMatch[0], type: 'property' });
        current += jsonKeyMatch[0].length;
        found = true;
      }
    }
    
    if (language === 'yaml') {
      // Clés YAML
      const yamlKeyMatch = line.slice(current).match(/^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:/);
      if (!found && yamlKeyMatch) {
        tokens.push({ text: yamlKeyMatch[1], type: 'property' });
        current += yamlKeyMatch[1].length;
        found = true;
      }
    }
    
    if (language === 'markdown') {
      // Headers Markdown
      const markdownHeaderMatch = line.slice(current).match(/^(#{1,6})\s/);
      if (!found && markdownHeaderMatch) {
        tokens.push({ text: markdownHeaderMatch[1], type: 'header' });
        current += markdownHeaderMatch[1].length;
        found = true;
      }
      
      // Liens Markdown [text](url)
      const markdownLinkMatch = line.slice(current).match(/^(\[[^\]]+\]\([^)]+\))/);
      if (!found && markdownLinkMatch) {
        tokens.push({ text: markdownLinkMatch[1], type: 'link' });
        current += markdownLinkMatch[1].length;
        found = true;
      }
      
      // Code inline Markdown `code`
      const markdownCodeMatch = line.slice(current).match(/^(`[^`]+`)/);
      if (!found && markdownCodeMatch) {
        tokens.push({ text: markdownCodeMatch[1], type: 'code' });
        current += markdownCodeMatch[1].length;
        found = true;
      }
    }
    
    if (language === 'bash') {
      // Variables Bash $VAR ou ${VAR}
      const bashVarMatch = line.slice(current).match(/^(\$[a-zA-Z_][a-zA-Z0-9_]*|\$\{[^}]+\})/);
      if (!found && bashVarMatch) {
        tokens.push({ text: bashVarMatch[1], type: 'variable' });
        current += bashVarMatch[1].length;
        found = true;
      }
    }
    
    if (language === 'sql') {
      // Noms de colonnes/tables SQL
      const sqlIdentifierMatch = line.slice(current).match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=[,()\s]|$)/);
      if (!found && sqlIdentifierMatch) {
        tokens.push({ text: sqlIdentifierMatch[1], type: 'identifier' });
        current += sqlIdentifierMatch[1].length;
        found = true;
      }
    }
    
    // Mots-clés génériques
    const keywords = {
      html: /^(<!DOCTYPE|html|head|body|title|meta|link|script|style|div|span|p|h[1-6]|ul|ol|li|a|img|button|input|form|table|tr|td|th)\b/i,
      css: /^(display|position|width|height|margin|padding|color|background|border|font|text|flex|grid|float|clear|overflow|z-index)\b/i,
      python: /^(def|class|import|from|if|else|elif|for|while|try|except|finally|with|as|return|yield|lambda|and|or|not|in|is|None|True|False)\b/,
      sql: /^(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INDEX|JOIN|INNER|LEFT|RIGHT|OUTER|ON|GROUP|ORDER|BY|HAVING|LIMIT|UNION|DISTINCT)\b/i,
      bash: /^(if|then|else|fi|for|while|do|done|case|esac|function|echo|cd|ls|mkdir|rm|cp|mv|grep|awk|sed|chmod|sudo|export|source)\b/,
      json: /^(true|false|null)\b/,
      yaml: /^(true|false|null|yes|no|on|off)\b/,
    };
    
    const keywordMatch = line.slice(current).match(keywords[language as keyof typeof keywords] || /^$/);
    if (!found && keywordMatch) {
      tokens.push({ text: keywordMatch[1], type: 'keyword' });
      current += keywordMatch[1].length;
      found = true;
    }
    
    // Nombres
    const numberMatch = line.slice(current).match(/^(\d+(\.\d+)?)/);
    if (!found && numberMatch) {
      tokens.push({ text: numberMatch[1], type: 'number' });
      current += numberMatch[1].length;
      found = true;
    }
    
    if (!found) {
      tokens.push({ text: line[current], type: 'text' });
      current++;
    }
  }
  
  return tokens;
};

/**
 * Coloration générique avec curseur
 */
const highlightGenericWithCursor = (code: string, language: string, showCursor: boolean, theme: string): JSX.Element => {
  const lines = code.split('\n');
  
  return (
    <>
      {lines.map((line, lineIndex) => {
        const tokens = parseGenericLine(line, language);
        const isLastLine = lineIndex === lines.length - 1;
        const isLastLineEmpty = isLastLine && line.trim() === '';
        
        return (
          <div key={lineIndex}>
            {tokens.map((token, tokenIndex) => (
              <span key={tokenIndex} className={`token ${token.type}`}>
                {token.text}
              </span>
            ))}
            {showCursor && isLastLine && !isLastLineEmpty && (
              <span className="typing-cursor" style={{
                backgroundColor: theme === 'light' ? '#333' : '#fff'
              }} />
            )}
            {showCursor && isLastLine && isLastLineEmpty && (
              <span className="typing-cursor" style={{
                backgroundColor: theme === 'light' ? '#333' : '#fff'
              }} />
            )}
            {lineIndex < lines.length - 1 && '\n'}
          </div>
        );
      })}
    </>
  );
};


/**
 * CodeBlock - Composant pour afficher du code stylisé façon VS Code
 * 
 * @example
 * ```tsx
 * <CodeBlock
 *   filename="app.ts"
 *   language="typescript"
 *   theme="vs-dark"
 *   code={`function hello() { console.log("Hello!"); }`}
 *   copyButton={true}
 * />
 * ```
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  filename,
  language,
  theme = 'vs-dark',
  code,
  copyButton = true,
  typingEffect = false,
  typingSpeed = 20,
  showLineNumbers = false,
  maxHeight,
  className = '',
}) => {
  const [displayedCode, setDisplayedCode] = useState(typingEffect ? '' : code);
  const [copied, setCopied] = useState(false);
  const [typingComplete, setTypingComplete] = useState(!typingEffect);

  /**
   * Effet de machine à écrire
   */
  useEffect(() => {
    if (typingEffect && !typingComplete) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= code.length) {
          setDisplayedCode(code.slice(0, currentIndex));
          currentIndex++;
        } else {
          setTypingComplete(true);
          clearInterval(interval);
        }
      }, typingSpeed);

      return () => clearInterval(interval);
    }
  }, [typingEffect, code, typingSpeed, typingComplete]);

  /**
   * Copier le code dans le presse-papiers
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const lines = displayedCode.split('\n');

  return (
    <div 
      className={`web-code-block theme-${theme} group ${className}`}
      style={{ maxHeight }}
    >
      {/* Header avec boutons macOS et nom du fichier */}
      <div className="web-code-block-header">
        {/* Boutons style macOS */}
        <div className="web-code-block-dots">
          <div 
            className="web-code-block-dot" 
            style={{ backgroundColor: '#ff5f56' }}
            title="Close"
          />
          <div 
            className="web-code-block-dot" 
            style={{ backgroundColor: '#ffbd2e' }}
            title="Minimize"
          />
          <div 
            className="web-code-block-dot" 
            style={{ backgroundColor: '#27c93f' }}
            title="Maximize"
          />
        </div>

        {/* Nom du fichier */}
        <div className="web-code-block-filename">
          {filename}
        </div>
      </div>

      {/* Contenu du code */}
      <div className="web-code-block-content">
        {/* Bouton copier */}
        {copyButton && (
          <button
            onClick={handleCopy}
            className="web-code-block-copy-button"
            title={copied ? 'Copié !' : 'Copier le code'}
          >
            {copied ? (
              <span className="flex items-center gap-1">
                <CheckIcon /> Copié !
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CopyIcon /> Copier
              </span>
            )}
          </button>
        )}

        {/* Numéros de ligne */}
        {showLineNumbers && (
          <div className="web-code-block-line-numbers">
            {lines.map((line, index) => (
              <div 
                key={index} 
                className="web-code-block-line-number"
                style={{ 
                  minHeight: line.trim() === '' ? '1.5rem' : 'auto'
                }}
              >
                {index + 1}
              </div>
            ))}
          </div>
        )}

        {/* Code */}
        <pre 
          className={`web-code-block-code ${showLineNumbers ? 'with-line-numbers' : ''}`}
          style={{ maxHeight: maxHeight ? 'calc(100% - 48px)' : undefined }}
        >
          <code className={`language-${language}`}>
            {highlightCodeWithCursor(displayedCode, language, typingEffect && !typingComplete, theme)}
          </code>
        </pre>
      </div>
    </div>
  );
};

/**
 * Icône de copie (SVG)
 */
const CopyIcon: React.FC = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

/**
 * Icône de validation (SVG)
 */
const CheckIcon: React.FC = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default CodeBlock;