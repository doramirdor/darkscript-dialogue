
import React, { useEffect, useRef } from 'react';
import { Check, Copy, X } from 'lucide-react';
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
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  showLineNumbers = true,
  highlight = [],
  isRemoved = false,
  isAdded = false
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
  
  // Very simple syntax highlighting function - in a real app, use a library like Prism or highlight.js
  const formatLine = (line: string) => {
    return line
      .replace(/(const|let|var|await|return|import|export|from|function)/g, '<span class="syntax-keyword">$1</span>')
      .replace(/(["'`].*?["'`])/g, '<span class="syntax-string">$1</span>')
      .replace(/(\b\w+\b)(?=\s*\()/g, '<span class="syntax-function">$1</span>')
      .replace(/(\/\/.*$)/g, '<span class="syntax-comment">$1</span>')
      .replace(/(\b\d+\b)/g, '<span class="syntax-constant">$1</span>')
      .replace(/(\.\w+)/g, '<span class="syntax-variable">$1</span>');
  };

  return (
    <div className={cn(
      "rounded-md overflow-hidden w-full my-4 border border-console-border bg-console group relative transition-all duration-200",
      isRemoved && "bg-red-950/30 border-red-800/40",
      isAdded && "bg-green-950/30 border-green-800/40"
    )}>
      <div className="flex items-center justify-between px-4 py-2 bg-console-accent text-sm font-mono text-muted-foreground">
        <div className="flex items-center space-x-2">
          <span className="text-xs">{language}</span>
          {isRemoved && <span className="text-xs text-red-400">removed</span>}
          {isAdded && <span className="text-xs text-green-400">added</span>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto scrollbar-thin">
        <pre className="font-mono text-sm">
          <code ref={codeRef}>
            {lines.map((line, i) => (
              <div 
                key={i} 
                className={cn(
                  "whitespace-pre py-0.5", 
                  highlight.includes(i+1) && "bg-console-muted",
                  isRemoved && "text-red-400 bg-red-900/20",
                  isAdded && "text-green-400 bg-green-900/20"
                )}
              >
                {showLineNumbers && (
                  <span className="inline-block w-8 text-right mr-4 text-console-syntax-comment select-none">
                    {i + 1}
                  </span>
                )}
                <span dangerouslySetInnerHTML={{ __html: formatLine(line) }} />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
