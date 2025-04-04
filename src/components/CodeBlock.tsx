
import React, { useEffect, useRef } from 'react';
import { Check, Copy, X, CornerUpLeft, Maximize } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlight?: number[];
  isRemoved?: boolean;
  isAdded?: boolean;
  fileName?: string;
  startLine?: number;
  description?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  showLineNumbers = true,
  highlight = [],
  isRemoved = false,
  isAdded = false,
  fileName = '',
  startLine = 1,
  description = ''
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.trim().split('\n');
  
  // Simple syntax highlighting similar to VS Code
  const formatLine = (line: string) => {
    if (language === 'python') {
      return line
        .replace(/(def|class|if|elif|else|for|while|return|import|from|as|with|try|except|finally|raise|assert)/g, '<span style="color: #C586C0;">$1</span>')
        .replace(/(["'`].*?["'`])/g, '<span style="color: #CE9178;">$1</span>')
        .replace(/(\b\w+\b)(?=\s*\()/g, '<span style="color: #DCDCAA;">$1</span>')
        .replace(/(#.*$)/g, '<span style="color: #6A9955;">$1</span>')
        .replace(/(\b\d+\b)/g, '<span style="color: #B5CEA8;">$1</span>')
        .replace(/(\.\w+)/g, '<span style="color: #9CDCFE;">$1</span>')
        .replace(/(\{|\}|\(|\)|\[|\]|:|;|,)/g, '<span style="color: #D4D4D4;">$1</span>');
    } else {
      // Default JavaScript/TypeScript highlighting
      return line
        .replace(/(const|let|var|await|return|import|export|from|function|process|path|if|else|for|while|switch|case|break|continue|try|catch|finally)/g, '<span style="color: #C586C0;">$1</span>')
        .replace(/(["'`].*?["'`])/g, '<span style="color: #CE9178;">$1</span>')
        .replace(/(\b\w+\b)(?=\s*\()/g, '<span style="color: #DCDCAA;">$1</span>')
        .replace(/(\/\/.*$)/g, '<span style="color: #6A9955;">$1</span>')
        .replace(/(\b\d+\b)/g, '<span style="color: #B5CEA8;">$1</span>')
        .replace(/(\.\w+)/g, '<span style="color: #9CDCFE;">$1</span>')
        .replace(/(\{|\}|\(|\)|\[|\]|;|,)/g, '<span style="color: #D4D4D4;">$1</span>');
    }
  };

  return (
    <div className={cn(
      "rounded-sm overflow-hidden w-full my-4 border border-[var(--vscode-border)] bg-[var(--vscode-editor-bg)] group relative transition-all duration-200",
      isRemoved && "bg-[var(--vscode-removed-bg)]",
      isAdded && "bg-[var(--vscode-added-bg)]"
    )}>
      {description && (
        <div className="px-3 py-2 text-xs border-b border-[var(--vscode-border)] text-[#cccccc] bg-[#1e1e1e]">
          {description}
        </div>
      )}
      <div className="flex items-center justify-between px-3 py-1 bg-[#2d2d2d] text-xs font-mono text-[#cccccc]">
        <div className="flex items-center space-x-2">
          <span className="vscode-file-tab flex items-center">
            <span className="file-icon opacity-70">
              {language === 'python' ? 'PY' : language === 'javascript' ? 'JS' : language === 'typescript' ? 'TS' : language}
            </span>
            <span className="ml-1">{fileName || (language === 'python' ? 'train.py' : 'vite.main.config.ts')}</span>
            <span className="ml-2 text-xs text-muted-foreground">Lines: {startLine}-{startLine + lines.length - 1}</span>
            {isRemoved && <span className="ml-2 text-xs text-red-400">-1</span>}
            {isAdded && <span className="ml-2 text-xs text-green-400">+1</span>}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-white"
          >
            <Maximize className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-white"
          >
            <X className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-white"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </div>
      <div className="p-3 overflow-x-auto scrollbar-thin bg-[#1e1e1e]">
        <pre className="font-mono text-xs leading-relaxed">
          <code ref={codeRef}>
            {lines.map((line, i) => {
              const isHighlighted = highlight.includes(i+1);
              const lineClasses = cn(
                "whitespace-pre py-[2px]", 
                isHighlighted && "vscode-line-highlight bg-[#2a2d2e]",
                isRemoved && "vscode-deleted-line",
                isAdded && "vscode-added-line"
              );
              
              return (
                <div key={i} className={lineClasses}>
                  {showLineNumbers && (
                    <span className="inline-block w-8 text-right mr-4 text-[#858585] select-none">
                      {startLine + i}
                    </span>
                  )}
                  <span dangerouslySetInnerHTML={{ __html: formatLine(line) }} />
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
