import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CodeBlockProps } from '../types';

const DEFAULT_LABELS = {
  copy: 'Copier',
  copied: 'Copié !',
  expand: 'Agrandir',
  reduce: 'Réduire',
  exportImage: 'Exporter en PNG',
  fullscreen: 'Plein écran',
  closeFullscreen: 'Fermer',
  fold: 'Replier',
  unfold: 'Déplier',
} as const;

type DiffLine = { type: 'same' | 'remove' | 'add'; line: string };

function computeDiff(oldCode: string, newCode: string): DiffLine[] {
  const oldLines = oldCode.split('\n');
  const newLines = newCode.split('\n');
  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      result.push({ type: 'same', line: oldLines[i] });
      i++;
      j++;
    } else if (i < oldLines.length && (j >= newLines.length || !newLines.slice(j).includes(oldLines[i]))) {
      result.push({ type: 'remove', line: oldLines[i] });
      i++;
    } else if (j < newLines.length && (i >= oldLines.length || !oldLines.slice(i).includes(newLines[j]))) {
      result.push({ type: 'add', line: newLines[j] });
      j++;
    } else {
      const nextJ = newLines.slice(j).indexOf(oldLines[i]);
      const nextI = oldLines.slice(i).indexOf(newLines[j]);
      if (nextJ >= 0 && (nextI < 0 || nextJ <= nextI)) {
        for (let k = 0; k < nextJ; k++) result.push({ type: 'add', line: newLines[j + k] });
        j += nextJ;
      } else if (nextI >= 0) {
        for (let k = 0; k < nextI; k++) result.push({ type: 'remove', line: oldLines[i + k] });
        i += nextI;
      } else {
        if (i < oldLines.length) result.push({ type: 'remove', line: oldLines[i++] });
        if (j < newLines.length) result.push({ type: 'add', line: newLines[j++] });
      }
    }
  }
  return result;
}

export type FoldRange = { start: number; end: number };

function getFoldRanges(code: string, language: string): FoldRange[] {
  const lines = code.split('\n');
  const ranges: FoldRange[] = [];
  const foldableLanguages = ['javascript', 'typescript', 'jsx', 'tsx', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'php'];
  if (!foldableLanguages.includes(language.toLowerCase())) return ranges;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed.endsWith('{')) continue;
    let depth = 0;
    const startLine = i;
    block: for (let j = i; j < lines.length; j++) {
      const line = lines[j];
      for (let k = 0; k < line.length; k++) {
        const c = line[k];
        if (c === '"' || c === "'" || c === '`') {
          const quote = c;
          k++;
          while (k < line.length && (line[k] !== quote || line[k - 1] === '\\')) k++;
          continue;
        }
        if (c === '{') depth++;
        if (c === '}') depth--;
      }
      if (depth === 0) {
        if (j > startLine) ranges.push({ start: startLine + 1, end: j + 1 });
        break block;
      }
    }
  }
  return ranges;
}

const parseHighlightLines = (highlightLines?: number[] | string): Set<number> => {
  const set = new Set<number>();
  if (!highlightLines) return set;
  if (Array.isArray(highlightLines)) {
    highlightLines.forEach((n) => set.add(Number(n)));
    return set;
  }
  String(highlightLines)
    .split(',')
    .forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [a, b] = trimmed.split('-').map((x) => parseInt(x.trim(), 10));
        for (let i = a; i <= b; i++) set.add(i);
      } else {
        const n = parseInt(trimmed, 10);
        if (!Number.isNaN(n)) set.add(n);
      }
    });
  return set;
};

type FoldContext = {
  foldRanges: FoldRange[];
  collapsedStarts: Set<number>;
  onToggleFold: (lineNum: number) => void;
  labelFold: string;
  labelUnfold: string;
};

const highlightCodeWithCursor = (
  code: string,
  language: string,
  showCursor: boolean,
  theme: string,
  highlightSet?: Set<number>,
  activeLine?: number,
  foldContext?: FoldContext
): JSX.Element => {
  if (!code) return <></>;
  const isLightTheme = theme === 'light' || theme === 'solarized-light' || theme === 'ocean' || theme === 'lavender';
  const cursorColor = isLightTheme ? '#586e75' : '#fff';

  switch (language) {
    case 'typescript':
    case 'javascript':
      return highlightJavaScriptWithCursor(code, showCursor, theme, highlightSet, activeLine, foldContext);
    case 'jsx':
      return highlightJSXWithCursor(code, showCursor, theme, highlightSet, activeLine, foldContext);
    case 'html':
    case 'css':
    case 'python':
    case 'json':
    case 'yaml':
    case 'sql':
    case 'bash':
    case 'shell':
    case 'markdown':
      return highlightGenericWithCursor(code, language, showCursor, theme, highlightSet, activeLine, foldContext);
    default:
      return (
        <>
          <span>{code}</span>
          {showCursor && (
            <span className="typing-cursor" style={{ backgroundColor: cursorColor }} />
          )}
        </>
      );
  }
};

function isLineVisible(lineNum: number, foldRanges: FoldRange[], collapsedStarts: Set<number>): boolean {
  return !foldRanges.some((r) => collapsedStarts.has(r.start) && lineNum > r.start && lineNum < r.end);
}

function isFoldStart(lineNum: number, foldRanges: FoldRange[]): boolean {
  return foldRanges.some((r) => r.start === lineNum);
}

const highlightJavaScriptWithCursor = (
  code: string,
  showCursor: boolean,
  theme: string,
  highlightSet?: Set<number>,
  activeLine?: number,
  foldContext?: FoldContext
): JSX.Element => {
  const lines = code.split('\n');
  const isLightTheme = theme === 'light' || theme === 'solarized-light' || theme === 'ocean' || theme === 'lavender';
  const cursorColor = isLightTheme ? '#586e75' : '#fff';
  const foldRanges = foldContext?.foldRanges ?? [];
  const collapsedStarts = foldContext?.collapsedStarts ?? new Set<number>();
  const onToggleFold = foldContext?.onToggleFold;
  const labelFold = foldContext?.labelFold ?? 'Replier';
  const labelUnfold = foldContext?.labelUnfold ?? 'Déplier';

  return (
    <>
      {lines.map((line, lineIndex) => {
        const lineNum = lineIndex + 1;
        if (foldRanges.length > 0 && !isLineVisible(lineNum, foldRanges, collapsedStarts)) return null;

        const tokens = parseLine(line);
        const isLastLine = lineIndex === lines.length - 1;
        const isLastLineEmpty = isLastLine && line.trim() === '';
        const isHighlight = highlightSet?.has(lineNum);
        const isActive = activeLine === lineNum;
        const lineClass = [isHighlight && 'line-highlight', isActive && 'line-active'].filter(Boolean).join(' ') || undefined;
        const isStart = isFoldStart(lineNum, foldRanges);
        const isCollapsed = isStart && collapsedStarts.has(lineNum);

        const lineContent = (
          <>
            {tokens.map((token, tokenIndex) => (
              <span key={tokenIndex} className={`token ${token.type}`}>
                {token.text}
              </span>
            ))}
            {showCursor && isLastLine && !isLastLineEmpty && (
              <span className="typing-cursor" style={{ backgroundColor: cursorColor }} />
            )}
            {showCursor && isLastLine && isLastLineEmpty && (
              <span className="typing-cursor" style={{ backgroundColor: cursorColor }} />
            )}
            {lineIndex < lines.length - 1 && '\n'}
          </>
        );

        return (
          <div key={lineIndex} className={lineClass} data-line={lineNum}>
            {isStart && onToggleFold && (
              <button
                type="button"
                className={`web-code-block-fold-btn ${isCollapsed ? 'collapsed' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleFold(lineNum); }}
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? labelUnfold : labelFold}
                title={isCollapsed ? labelUnfold : labelFold}
              >
                <span className="web-code-block-fold-icon" aria-hidden>{isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}</span>
              </button>
            )}
            {foldContext ? <span className="web-code-block-line-content">{lineContent}</span> : lineContent}
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

    const commentMatch = line.slice(current).match(/^(\/\/.*)/);
    if (commentMatch) {
      tokens.push({ text: commentMatch[1], type: 'comment' });
      current += commentMatch[1].length;
      found = true;
    }

    const stringMatch = line.slice(current).match(/^(["'`])(?:(?!\1)[^\\]|\\.)*\1/);
    if (!found && stringMatch) {
      tokens.push({ text: stringMatch[0], type: 'string' });
      current += stringMatch[0].length;
      found = true;
    }

    const keywordMatch = line.slice(current).match(/^(function|const|let|var|if|else|for|while|return|class|interface|type|enum|import|export|from|async|await|try|catch|throw|new|this|super|extends|implements|public|private|protected|static|readonly|abstract|namespace|declare|module|as|is|in|of|typeof|instanceof|void|never|unknown|any|boolean|string|number|object|symbol|bigint)\b/);
    if (!found && keywordMatch) {
      tokens.push({ text: keywordMatch[1], type: 'keyword' });
      current += keywordMatch[1].length;
      found = true;
    }

    const numberMatch = line.slice(current).match(/^(\d+(\.\d+)?)/);
    if (!found && numberMatch) {
      tokens.push({ text: numberMatch[1], type: 'number' });
      current += numberMatch[1].length;
      found = true;
    }

    const classMatch = line.slice(current).match(/^([A-Z][a-zA-Z0-9]*)/);
    if (!found && classMatch) {
      tokens.push({ text: classMatch[1], type: 'class-name' });
      current += classMatch[1].length;
      found = true;
    }

    const functionMatch = line.slice(current).match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
    if (!found && functionMatch) {
      tokens.push({ text: functionMatch[1], type: 'function' });
      current += functionMatch[1].length;
      found = true;
    }

    const variableMatch = line.slice(current).match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (!found && variableMatch) {
      tokens.push({ text: variableMatch[1], type: 'variable' });
      current += variableMatch[1].length;
      found = true;
    }

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

const highlightJSXWithCursor = (
  code: string,
  showCursor: boolean,
  theme: string,
  highlightSet?: Set<number>,
  activeLine?: number,
  foldContext?: FoldContext
): JSX.Element => {
  const lines = code.split('\n');
  const isLightTheme = theme === 'light' || theme === 'solarized-light' || theme === 'ocean' || theme === 'lavender';
  const cursorColor = isLightTheme ? '#586e75' : '#fff';
  const foldRanges = foldContext?.foldRanges ?? [];
  const collapsedStarts = foldContext?.collapsedStarts ?? new Set<number>();
  const onToggleFold = foldContext?.onToggleFold;
  const labelFold = foldContext?.labelFold ?? 'Replier';
  const labelUnfold = foldContext?.labelUnfold ?? 'Déplier';

  return (
    <>
      {lines.map((line, lineIndex) => {
        const lineNum = lineIndex + 1;
        if (foldRanges.length > 0 && !isLineVisible(lineNum, foldRanges, collapsedStarts)) return null;

        const tokens = parseJSXLine(line);
        const isLastLine = lineIndex === lines.length - 1;
        const isLastLineEmpty = isLastLine && line.trim() === '';
        const isHighlight = highlightSet?.has(lineNum);
        const isActive = activeLine === lineNum;
        const lineClass = [isHighlight && 'line-highlight', isActive && 'line-active'].filter(Boolean).join(' ') || undefined;
        const isStart = isFoldStart(lineNum, foldRanges);
        const isCollapsed = isStart && collapsedStarts.has(lineNum);

        const lineContent = (
          <>
            {tokens.map((token, tokenIndex) => (
              <span key={tokenIndex} className={`token ${token.type}`}>
                {token.text}
              </span>
            ))}
            {showCursor && isLastLine && !isLastLineEmpty && (
              <span className="typing-cursor" style={{ backgroundColor: cursorColor }} />
            )}
            {showCursor && isLastLine && isLastLineEmpty && (
              <span className="typing-cursor" style={{ backgroundColor: cursorColor }} />
            )}
            {lineIndex < lines.length - 1 && '\n'}
          </>
        );

        return (
          <div key={lineIndex} className={lineClass} data-line={lineNum}>
            {isStart && onToggleFold && (
              <button
                type="button"
                className={`web-code-block-fold-btn ${isCollapsed ? 'collapsed' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleFold(lineNum); }}
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? labelUnfold : labelFold}
                title={isCollapsed ? labelUnfold : labelFold}
              >
                <span className="web-code-block-fold-icon" aria-hidden>{isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}</span>
              </button>
            )}
            {foldContext ? <span className="web-code-block-line-content">{lineContent}</span> : lineContent}
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

    const commentMatch = line.slice(current).match(/^(\/\/.*)/);
    if (!found && commentMatch) {
      tokens.push({ text: commentMatch[1], type: 'comment' });
      current += commentMatch[1].length;
      found = true;
    }

    const jsxTagMatch = line.slice(current).match(/^(<\/?[A-Za-z][A-Za-z0-9]*)/);
    if (!found && jsxTagMatch) {
      tokens.push({ text: jsxTagMatch[1], type: 'tag' });
      current += jsxTagMatch[1].length;
      found = true;
    }

    const attrMatch = line.slice(current).match(/^([a-zA-Z-]+)\s*=/);
    if (!found && attrMatch) {
      tokens.push({ text: attrMatch[1], type: 'attr-name' });
      current += attrMatch[1].length;
      found = true;
    }

    const stringMatch = line.slice(current).match(/^(["'`])(?:(?!\1)[^\\]|\\.)*\1/);
    if (!found && stringMatch) {
      tokens.push({ text: stringMatch[0], type: 'string' });
      current += stringMatch[0].length;
      found = true;
    }

    const keywordMatch = line.slice(current).match(/^(function|const|let|var|if|else|for|while|return|class|interface|import|export|from|async|await|try|catch|throw|new|this|super|extends|implements|public|private|protected|static|readonly|default)\b/);
    if (!found && keywordMatch) {
      tokens.push({ text: keywordMatch[1], type: 'keyword' });
      current += keywordMatch[1].length;
      found = true;
    }

    const numberMatch = line.slice(current).match(/^(\d+(\.\d+)?)/);
    if (!found && numberMatch) {
      tokens.push({ text: numberMatch[1], type: 'number' });
      current += numberMatch[1].length;
      found = true;
    }

    const classMatch = line.slice(current).match(/^([A-Z][a-zA-Z0-9]*)/);
    if (!found && classMatch) {
      tokens.push({ text: classMatch[1], type: 'class-name' });
      current += classMatch[1].length;
      found = true;
    }

    const functionMatch = line.slice(current).match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
    if (!found && functionMatch) {
      tokens.push({ text: functionMatch[1], type: 'function' });
      current += functionMatch[1].length;
      found = true;
    }

    const variableMatch = line.slice(current).match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (!found && variableMatch) {
      tokens.push({ text: variableMatch[1], type: 'variable' });
      current += variableMatch[1].length;
      found = true;
    }

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

const parseGenericLine = (line: string, language: string) => {
  const tokens = [];
  let current = 0;

  while (current < line.length) {
    let found = false;

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

    const stringMatch = line.slice(current).match(/^(["'`])(?:(?!\1)[^\\]|\\.)*\1/);
    if (!found && stringMatch) {
      tokens.push({ text: stringMatch[0], type: 'string' });
      current += stringMatch[0].length;
      found = true;
    }

    if (language === 'html') {
      const htmlTagMatch = line.slice(current).match(/^(<\/?[a-zA-Z][a-zA-Z0-9]*)/);
      if (!found && htmlTagMatch) {
        tokens.push({ text: htmlTagMatch[1], type: 'tag' });
        current += htmlTagMatch[1].length;
        found = true;
      }

      const htmlAttrMatch = line.slice(current).match(/^([a-zA-Z-]+)\s*=/);
      if (!found && htmlAttrMatch) {
        tokens.push({ text: htmlAttrMatch[1], type: 'attr-name' });
        current += htmlAttrMatch[1].length;
        found = true;
      }
    }

    if (language === 'css') {
      const cssSelectorMatch = line.slice(current).match(/^([.#]?[a-zA-Z][a-zA-Z0-9-]*)/);
      if (!found && cssSelectorMatch) {
        tokens.push({ text: cssSelectorMatch[1], type: 'selector' });
        current += cssSelectorMatch[1].length;
        found = true;
      }

      const cssPropMatch = line.slice(current).match(/^([a-zA-Z-]+)\s*:/);
      if (!found && cssPropMatch) {
        tokens.push({ text: cssPropMatch[1], type: 'property' });
        current += cssPropMatch[1].length;
        found = true;
      }

      const cssAtRuleMatch = line.slice(current).match(/^(@[a-zA-Z-]+)/);
      if (!found && cssAtRuleMatch) {
        tokens.push({ text: cssAtRuleMatch[1], type: 'keyword' });
        current += cssAtRuleMatch[1].length;
        found = true;
      }
    }

    if (language === 'json') {
      const jsonKeyMatch = line.slice(current).match(/^"([^"]+)":/);
      if (!found && jsonKeyMatch) {
        tokens.push({ text: jsonKeyMatch[0], type: 'property' });
        current += jsonKeyMatch[0].length;
        found = true;
      }
    }

    if (language === 'yaml') {
      const yamlKeyMatch = line.slice(current).match(/^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:/);
      if (!found && yamlKeyMatch) {
        tokens.push({ text: yamlKeyMatch[1], type: 'property' });
        current += yamlKeyMatch[1].length;
        found = true;
      }
    }

    if (language === 'markdown') {
      const markdownHeaderMatch = line.slice(current).match(/^(#{1,6})\s/);
      if (!found && markdownHeaderMatch) {
        tokens.push({ text: markdownHeaderMatch[1], type: 'header' });
        current += markdownHeaderMatch[1].length;
        found = true;
      }

      const markdownLinkMatch = line.slice(current).match(/^(\[[^\]]+\]\([^)]+\))/);
      if (!found && markdownLinkMatch) {
        tokens.push({ text: markdownLinkMatch[1], type: 'link' });
        current += markdownLinkMatch[1].length;
        found = true;
      }

      const markdownCodeMatch = line.slice(current).match(/^(`[^`]+`)/);
      if (!found && markdownCodeMatch) {
        tokens.push({ text: markdownCodeMatch[1], type: 'code' });
        current += markdownCodeMatch[1].length;
        found = true;
      }
    }

    if (language === 'bash') {
      const bashVarMatch = line.slice(current).match(/^(\$[a-zA-Z_][a-zA-Z0-9_]*|\$\{[^}]+\})/);
      if (!found && bashVarMatch) {
        tokens.push({ text: bashVarMatch[1], type: 'variable' });
        current += bashVarMatch[1].length;
        found = true;
      }
    }

    if (language === 'sql') {
      const sqlIdentifierMatch = line.slice(current).match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=[,()\s]|$)/);
      if (!found && sqlIdentifierMatch) {
        tokens.push({ text: sqlIdentifierMatch[1], type: 'identifier' });
        current += sqlIdentifierMatch[1].length;
        found = true;
      }
    }

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

const highlightGenericWithCursor = (
  code: string,
  language: string,
  showCursor: boolean,
  theme: string,
  highlightSet?: Set<number>,
  activeLine?: number,
  foldContext?: FoldContext
): JSX.Element => {
  const lines = code.split('\n');
  const isLightTheme = theme === 'light' || theme === 'solarized-light' || theme === 'ocean' || theme === 'lavender';
  const cursorColor = isLightTheme ? '#586e75' : '#fff';
  const foldRanges = foldContext?.foldRanges ?? [];
  const collapsedStarts = foldContext?.collapsedStarts ?? new Set<number>();
  const onToggleFold = foldContext?.onToggleFold;
  const labelFold = foldContext?.labelFold ?? 'Replier';
  const labelUnfold = foldContext?.labelUnfold ?? 'Déplier';

  return (
    <>
      {lines.map((line, lineIndex) => {
        const lineNum = lineIndex + 1;
        if (foldRanges.length > 0 && !isLineVisible(lineNum, foldRanges, collapsedStarts)) return null;

        const tokens = parseGenericLine(line, language);
        const isLastLine = lineIndex === lines.length - 1;
        const isLastLineEmpty = isLastLine && line.trim() === '';
        const isHighlight = highlightSet?.has(lineNum);
        const isActive = activeLine === lineNum;
        const lineClass = [isHighlight && 'line-highlight', isActive && 'line-active'].filter(Boolean).join(' ') || undefined;
        const isStart = isFoldStart(lineNum, foldRanges);
        const isCollapsed = isStart && collapsedStarts.has(lineNum);

        const lineContent = (
          <>
            {tokens.map((token, tokenIndex) => (
              <span key={tokenIndex} className={`token ${token.type}`}>
                {token.text}
              </span>
            ))}
            {showCursor && isLastLine && !isLastLineEmpty && (
              <span className="typing-cursor" style={{ backgroundColor: cursorColor }} />
            )}
            {showCursor && isLastLine && isLastLineEmpty && (
              <span className="typing-cursor" style={{ backgroundColor: cursorColor }} />
            )}
            {lineIndex < lines.length - 1 && '\n'}
          </>
        );

        return (
          <div key={lineIndex} className={lineClass} data-line={lineNum}>
            {isStart && onToggleFold && (
              <button
                type="button"
                className={`web-code-block-fold-btn ${isCollapsed ? 'collapsed' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleFold(lineNum); }}
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? labelUnfold : labelFold}
                title={isCollapsed ? labelUnfold : labelFold}
              >
                <span className="web-code-block-fold-icon" aria-hidden>{isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}</span>
              </button>
            )}
            {foldContext ? <span className="web-code-block-line-content">{lineContent}</span> : lineContent}
          </div>
        );
      })}
    </>
  );
};

const COLLAPSED_HEIGHT = '120px';

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
  highlightLines,
  wrapLines = false,
  collapsible = false,
  prompt,
  customTheme,
  diff,
  exportImageButton = false,
  title,
  description,
  activeLine,
  onCopy,
  labels: labelsProp,
  fullscreenButton = false,
  size = 'medium',
  onLineClick,
  palette,
  codeFolding = false,
  className = '',
  startLineNumber = 1,
  showHeader = true,
  headerActions,
  loading = false,
  fontFamily,
  backgroundImage,
  backgroundImageOverlay = 0.85,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const isDiffMode = Boolean(diff);
  const displayCode = isDiffMode ? diff!.newCode : (code ?? '');
  const [displayedCode, setDisplayedCode] = useState(typingEffect && !isDiffMode ? '' : displayCode);
  const [copied, setCopied] = useState(false);
  const [typingComplete, setTypingComplete] = useState(!typingEffect || isDiffMode);
  const canCollapse = Boolean(collapsible && maxHeight);
  const [isExpanded, setIsExpanded] = useState(!canCollapse);
  const [exporting, setExporting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [collapsedStarts, setCollapsedStarts] = useState<Set<number>>(new Set());

  const highlightSet = parseHighlightLines(highlightLines);
  const themeClass = theme;
  const cursorTheme = theme === 'auto' ? 'vs-dark' : theme;
  const effectiveMaxHeight = canCollapse && !isExpanded ? COLLAPSED_HEIGHT : maxHeight;
  const diffLines = isDiffMode ? computeDiff(diff!.oldCode, diff!.newCode) : null;

  const lines = displayedCode.split('\n');
  const foldRanges = codeFolding && !isDiffMode ? getFoldRanges(displayedCode, language) : [];
  const visibleLineIndices = codeFolding && foldRanges.length > 0
    ? lines.map((_, i) => i).filter((i) => isLineVisible(i + 1, foldRanges, collapsedStarts))
    : lines.map((_, i) => i);

  const handleToggleFold = (lineNum: number) => {
    setCollapsedStarts((prev) => {
      const next = new Set(prev);
      if (next.has(lineNum)) next.delete(lineNum);
      else next.add(lineNum);
      return next;
    });
  };

  useEffect(() => {
    if (typingEffect && !typingComplete && !isDiffMode && code != null) {
      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setDisplayedCode(code);
        setTypingComplete(true);
        return;
      }
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
  }, [typingEffect, code, typingSpeed, typingComplete, isDiffMode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopied(true);
      if (liveRegionRef.current) liveRegionRef.current.textContent = labels.copied;
      setTimeout(() => {
        setCopied(false);
        if (liveRegionRef.current) liveRegionRef.current.textContent = '';
      }, 2000);
      onCopy?.();
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleExportImage = async () => {
    if (!containerRef.current || exporting) return;
    setExporting(true);
    try {
      await new Promise((r) => setTimeout(r, 0));
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(containerRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `${filename.replace(/\.[^.]+$/, '') || 'code'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Erreur export image:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleCopyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCopy();
    }
  };

  const paletteVars = palette
    ? {
        ...(palette.bg && { '--wcb-custom-bg': palette.bg }),
        ...(palette.header && { '--wcb-custom-header': palette.header }),
        ...(palette.text && { '--wcb-custom-text': palette.text }),
        ...(palette.border && { '--wcb-custom-border': palette.border }),
      }
    : {};

  const blockContent = (
    <div
      ref={containerRef}
      className={`web-code-block theme-${themeClass} group wcb-size-${size} ${className} ${exporting ? 'wcb-exporting' : ''} ${loading ? 'wcb-loading' : ''} ${backgroundImage ? 'wcb-has-bg-image' : ''}`}
      style={{
        maxHeight: isFullscreen ? undefined : effectiveMaxHeight,
        ...(fontFamily && { '--wcb-font-family': fontFamily } as React.CSSProperties),
        ...(backgroundImage && { '--wcb-bg-image': `url("${backgroundImage.replace(/"/g, '%22')}")`, '--wcb-bg-image-overlay': String(backgroundImageOverlay) } as React.CSSProperties),
        ...(customTheme as React.CSSProperties),
        ...paletteVars,
      }}
      role="region"
      aria-label={`Bloc de code : ${filename}`}
      aria-busy={loading}
    >
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="wcb-sr-only"
      />
      {title && (
        <div className="web-code-block-title">
          {title}
        </div>
      )}
      {showHeader && (
        <div className="web-code-block-header">
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

          <div className="web-code-block-filename">
            {filename}
          </div>

          {headerActions && <div className="web-code-block-header-actions">{headerActions}</div>}
          {canCollapse && (
            <button
              type="button"
              className="web-code-block-collapse-btn"
              onClick={() => setIsExpanded((v) => !v)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? labels.reduce : labels.expand}
            >
              {isExpanded ? labels.reduce : labels.expand}
            </button>
          )}
          {fullscreenButton && (
            <button
              type="button"
              className="web-code-block-fullscreen-btn"
              onClick={() => setIsFullscreen((v) => !v)}
              aria-label={isFullscreen ? labels.closeFullscreen : labels.fullscreen}
              title={isFullscreen ? labels.closeFullscreen : labels.fullscreen}
            >
              {isFullscreen ? labels.closeFullscreen : labels.fullscreen}
            </button>
          )}
        </div>
      )}

      <div className="web-code-block-content">
        {exportImageButton && (
          <button
            type="button"
            onClick={handleExportImage}
            disabled={exporting}
            className="web-code-block-export-button"
            title={labels.exportImage}
            aria-label={labels.exportImage}
          >
            PNG
          </button>
        )}
        {copyButton && (
          <button
            type="button"
            onClick={handleCopy}
            onKeyDown={handleCopyKeyDown}
            className="web-code-block-copy-button"
            title={copied ? labels.copied : labels.copy}
            aria-label={copied ? labels.copied : labels.copy}
          >
            {copied ? (
              <span className="flex items-center gap-1">
                <CheckIcon /> {labels.copied}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CopyIcon /> {labels.copy}
              </span>
            )}
          </button>
        )}

        {showLineNumbers && !loading && !isDiffMode && (
          <div className={`web-code-block-line-numbers ${onLineClick ? 'wcb-line-numbers-clickable' : ''}`}>
            {(codeFolding && visibleLineIndices.length < lines.length ? visibleLineIndices : lines.map((_, i) => i)).map((index) => {
              const displayNum = startLineNumber + index;
              const line = lines[index];
              const content = <>{displayNum}</>;
              return onLineClick ? (
                <button
                  key={index}
                  type="button"
                  className="web-code-block-line-number"
                  style={{ minHeight: line?.trim() === '' ? '1.5rem' : 'auto' }}
                  onClick={() => onLineClick(displayNum)}
                  aria-label={`Ligne ${displayNum}`}
                >
                  {content}
                </button>
              ) : (
                <div
                  key={index}
                  className="web-code-block-line-number"
                  style={{ minHeight: line?.trim() === '' ? '1.5rem' : 'auto' }}
                >
                  {content}
                </div>
              );
            })}
          </div>
        )}
        {showLineNumbers && !loading && isDiffMode && diffLines && (
          <div className={`web-code-block-line-numbers ${onLineClick ? 'wcb-line-numbers-clickable' : ''}`}>
            {diffLines.map((_, index) => {
              const displayNum = startLineNumber + index;
              return onLineClick ? (
                <button
                  key={index}
                  type="button"
                  className="web-code-block-line-number"
                  style={{ minHeight: '1.5rem' }}
                  onClick={() => onLineClick(displayNum)}
                  aria-label={`Ligne ${displayNum}`}
                >
                  {displayNum}
                </button>
              ) : (
                <div key={index} className="web-code-block-line-number" style={{ minHeight: '1.5rem' }}>
                  {displayNum}
                </div>
              );
            })}
          </div>
        )}

        <pre
          className={`web-code-block-code ${showLineNumbers ? 'with-line-numbers' : ''} ${wrapLines ? 'wrap-lines' : ''} ${codeFolding && foldRanges.length > 0 ? 'with-fold' : ''}`}
          style={{ maxHeight: effectiveMaxHeight ? 'calc(100% - 48px)' : undefined }}
        >
          <code className={`language-${language}`} style={fontFamily ? { fontFamily: 'var(--wcb-font-family)' } : undefined}>
            {loading ? (
              <div className="wcb-skeleton" aria-hidden>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="wcb-skeleton-line" style={{ width: i === 3 ? '60%' : i === 5 ? '40%' : '90%' }} />
                ))}
              </div>
            ) : isDiffMode && diffLines ? (
              <>
                {prompt && <span className="web-code-block-prompt">{prompt}</span>}
                {diffLines.map((d, i) => (
                  <div key={i} className={`web-code-block-diff-line ${d.type !== 'same' ? `diff-${d.type}` : ''}`}>
                    {d.type !== 'same' && <span className="opacity-70 mr-2">{d.type === 'remove' ? '−' : '+'}</span>}
                    {d.line}
                    {i < diffLines.length - 1 && '\n'}
                  </div>
                ))}
              </>
            ) : (
              <>
                {prompt && <span className="web-code-block-prompt">{prompt}</span>}
                {highlightCodeWithCursor(
                  displayedCode,
                  language,
                  typingEffect && !typingComplete,
                  cursorTheme,
                  highlightSet,
                  activeLine,
                  codeFolding && foldRanges.length > 0
                    ? {
                        foldRanges,
                        collapsedStarts,
                        onToggleFold: handleToggleFold,
                        labelFold: labels.fold,
                        labelUnfold: labels.unfold,
                      }
                    : undefined
                )}
              </>
            )}
          </code>
        </pre>
      </div>
      {description && <div className="web-code-block-description">{description}</div>}
    </div>
  );

  if (isFullscreen && typeof document !== 'undefined') {
    return createPortal(
      <div
        className="wcb-fullscreen-overlay"
        onClick={() => setIsFullscreen(false)}
        role="dialog"
        aria-modal="true"
        aria-label={labels.closeFullscreen}
      >
        <div className="wcb-fullscreen-inner" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="wcb-fullscreen-close"
            onClick={() => setIsFullscreen(false)}
            aria-label={labels.closeFullscreen}
          >
            {labels.closeFullscreen}
          </button>
          {blockContent}
        </div>
      </div>,
      document.body
    );
  }

  return blockContent;
};

const ChevronDownIcon: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

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