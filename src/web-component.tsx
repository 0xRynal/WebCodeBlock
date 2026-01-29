import React from 'react';
import { createRoot } from 'react-dom/client';
import { CodeBlock } from './components/CodeBlock';
import type { CodeBlockProps, Theme } from './types';
import './styles/theme.css';

const ATTR = {
  filename: 'filename',
  language: 'language',
  theme: 'theme',
  code: 'code',
  copyButton: 'copy-button',
  showLineNumbers: 'show-line-numbers',
  wrapLines: 'wrap-lines',
  collapsible: 'collapsible',
  prompt: 'prompt',
  maxHeight: 'max-height',
  exportImageButton: 'export-image-button',
  highlightLines: 'highlight-lines',
} as const;

function parseBool(val: string | null): boolean | undefined {
  if (val == null) return undefined;
  return val === 'true' || val === '';
}

function getProps(el: HTMLElement): CodeBlockProps {
  const get = (key: string) => el.getAttribute(key);
  const code = get(ATTR.code) ?? '';
  const highlightLinesRaw = get(ATTR.highlightLines);
  const highlightLines = highlightLinesRaw
    ? highlightLinesRaw.includes(',') || highlightLinesRaw.includes('-')
      ? highlightLinesRaw
      : (highlightLinesRaw.split(/\s+/).map(Number).filter((n) => !Number.isNaN(n)) as number[])
    : undefined;
  return {
    filename: get(ATTR.filename) ?? 'code',
    language: (get(ATTR.language) ?? 'typescript') as CodeBlockProps['language'],
    theme: (get(ATTR.theme) ?? 'vs-dark') as Theme,
    code,
    copyButton: parseBool(get(ATTR.copyButton)) ?? true,
    showLineNumbers: parseBool(get(ATTR.showLineNumbers)) ?? false,
    wrapLines: parseBool(get(ATTR.wrapLines)) ?? false,
    collapsible: parseBool(get(ATTR.collapsible)) ?? false,
    prompt: get(ATTR.prompt) ?? undefined,
    maxHeight: get(ATTR.maxHeight) ?? undefined,
    exportImageButton: parseBool(get(ATTR.exportImageButton)) ?? false,
    highlightLines,
  };
}

class WebCodeBlockElement extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null;
  private mountPoint: HTMLDivElement | null = null;

  static get observedAttributes(): string[] {
    return Object.values(ATTR);
  }

  connectedCallback(): void {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    this.root = createRoot(this.mountPoint);
    this.render();
  }

  disconnectedCallback(): void {
    if (this.root && this.mountPoint) {
      this.root.unmount();
      this.root = null;
      this.mountPoint?.remove();
      this.mountPoint = null;
    }
  }

  attributeChangedCallback(): void {
    this.render();
  }

  private render(): void {
    if (!this.root || !this.mountPoint) return;
    this.root.render(React.createElement(CodeBlock, getProps(this)));
  }
}

export function registerWebCodeBlock(): void {
  if (typeof customElements !== 'undefined' && !customElements.get('web-code-block')) {
    customElements.define('web-code-block', WebCodeBlockElement);
  }
}

registerWebCodeBlock();
