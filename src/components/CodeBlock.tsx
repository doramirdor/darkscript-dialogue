
import React, { useEffect, useRef } from 'react';
import { Check, Copy, X, CornerUpLeft, Maximize, ArrowRight } from 'lucide-react';
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
  onApply?: (code: string, fileName: string) => void;
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
  description = '',
  onApply
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

  const handleApply = () => {
    if (onApply && fileName) {
      onApply(code, fileName);
    }
  };

  const lines = code.trim().split('\n');
  
  // Function to highlight code based on language
  const renderSyntaxHighlightedLine = (line: string, language: string) => {
    if (language === 'python') {
      // Render Python syntax highlighting
      const parts = [];
      let currentPos = 0;
      
      // Keywords
      const keywordRegex = /(def|class|if|elif|else|for|while|return|import|from|as|with|try|except|finally|raise|assert)/g;
      let match;
      while ((match = keywordRegex.exec(line)) !== null) {
        if (match.index > currentPos) {
          parts.push(<span key={`text-${currentPos}`}>{line.substring(currentPos, match.index)}</span>);
        }
        parts.push(<span key={`keyword-${match.index}`} className="text-[#C586C0]">{match[0]}</span>);
        currentPos = match.index + match[0].length;
      }
      
      if (currentPos < line.length) {
        // Process remaining parts of the line
        const remainingText = line.substring(currentPos);
        
        // Strings
        const remainingParts = remainingText.split(/(['"])(.+?)(['"])/g).filter(Boolean);
        let isInString = false;
        
        remainingParts.forEach((part, i) => {
          if (part === "'" || part === '"') {
            isInString = !isInString;
            parts.push(<span key={`quote-${currentPos}-${i}`} className="text-[#CE9178]">{part}</span>);
          } else if (isInString) {
            parts.push(<span key={`string-${currentPos}-${i}`} className="text-[#CE9178]">{part}</span>);
          } else {
            // Function calls
            const funcParts = part.split(/(\b\w+\b)(?=\s*\()/g).filter(Boolean);
            funcParts.forEach((funcPart, j) => {
              if (funcPart.match(/\b\w+\b(?=\s*\()/)) {
                parts.push(<span key={`func-${currentPos}-${i}-${j}`} className="text-[#DCDCAA]">{funcPart}</span>);
              } else {
                // Comments
                const commentParts = funcPart.split(/(#.*$)/g).filter(Boolean);
                commentParts.forEach((commentPart, k) => {
                  if (commentPart.startsWith('#')) {
                    parts.push(<span key={`comment-${currentPos}-${i}-${j}-${k}`} className="text-[#6A9955]">{commentPart}</span>);
                  } else {
                    // Numbers
                    const numParts = commentPart.split(/(\b\d+\.?\d*\b)/g).filter(Boolean);
                    numParts.forEach((numPart, l) => {
                      if (numPart.match(/\b\d+\.?\d*\b/)) {
                        parts.push(<span key={`num-${currentPos}-${i}-${j}-${k}-${l}`} className="text-[#B5CEA8]">{numPart}</span>);
                      } else {
                        // Method access
                        const methodParts = numPart.split(/(\.\w+)/g).filter(Boolean);
                        methodParts.forEach((methodPart, m) => {
                          if (methodPart.match(/\.\w+/)) {
                            parts.push(<span key={`method-${currentPos}-${i}-${j}-${k}-${l}-${m}`} className="text-[#9CDCFE]">{methodPart}</span>);
                          } else {
                            parts.push(<span key={`other-${currentPos}-${i}-${j}-${k}-${l}-${m}`}>{methodPart}</span>);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
      
      return <>{parts.length > 0 ? parts : line}</>;
    } else {
      // Default JavaScript/TypeScript highlighting with similar approach
      const jsKeywords = /(const|let|var|await|return|import|export|from|function|process|path|if|else|for|while|switch|case|break|continue|try|catch|finally)/g;
      
      const parts = [];
      let currentPos = 0;
      
      // Keywords
      let match;
      while ((match = jsKeywords.exec(line)) !== null) {
        if (match.index > currentPos) {
          parts.push(<span key={`text-${currentPos}`}>{line.substring(currentPos, match.index)}</span>);
        }
        parts.push(<span key={`keyword-${match.index}`} className="text-[#C586C0]">{match[0]}</span>);
        currentPos = match.index + match[0].length;
      }
      
      if (currentPos < line.length) {
        // Process remaining parts with similar patterns as Python
        const remainingText = line.substring(currentPos);
        parts.push(<span key={`rest-${currentPos}`}>{remainingText}</span>);
      }
      
      return <>{parts.length > 0 ? parts : line}</>;
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
          {fileName && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 text-muted-foreground hover:text-white flex items-center gap-1 px-2 w-auto"
              onClick={handleApply}
            >
              <ArrowRight className="h-3 w-3" />
              <span className="text-xs">Apply to {fileName.split('/').pop()}</span>
            </Button>
          )}
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
                "whitespace-pre py-[2px] flex", 
                isHighlighted && "vscode-line-highlight bg-[#2a2d2e]",
                isRemoved && "vscode-deleted-line",
                isAdded && "vscode-added-line"
              );
              
              return (
                <div key={i} className={lineClasses}>
                  {showLineNumbers && (
                    <span className="inline-block w-8 text-right mr-4 text-[#858585] select-none flex-shrink-0">
                      {startLine + i}
                    </span>
                  )}
                  <span className="flex-grow">
                    {renderSyntaxHighlightedLine(line, language)}
                  </span>
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
