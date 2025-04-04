
import React from 'react';
import { cn } from '@/lib/utils';
import CodeBlock from './CodeBlock';

export type MessageType = 'user' | 'system' | 'loading';

export interface CodeBlockData {
  file: string;
  startLine: number;
  endLine: number;
  newCode: string;
  description: string;
  language?: string;
  highlight?: number[];
  isRemoved?: boolean;
  isAdded?: boolean;
}

interface MessageBlockProps {
  content: string;
  type: MessageType;
  codeBlocks?: (CodeBlockData | {
    code: string;
    language?: string;
    highlight?: number[];
    isRemoved?: boolean;
    isAdded?: boolean;
  })[];
}

const MessageBlock: React.FC<MessageBlockProps> = ({ content, type, codeBlocks = [] }) => {
  // Split the content by code block placeholders
  const contentParts = content.split('```code```');

  return (
    <div 
      className={cn(
        "w-full px-4 py-3 animate-fade-up",
        type === 'user' ? "bg-[#2d2d2d]" : "bg-transparent",
        type === 'loading' && "opacity-80"
      )}
    >
      <div className="max-w-4xl mx-auto">
        {type === 'loading' ? (
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse delay-150" />
            <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse delay-300" />
            <span className="ml-2 text-sm text-muted-foreground">Generating</span>
          </div>
        ) : (
          <>
            {contentParts.map((part, index) => (
              <React.Fragment key={index}>
                {part && (
                  <div className="prose prose-invert prose-pre:bg-[#1e1e1e] prose-pre:text-sm max-w-none text-[13px] leading-relaxed">
                    {part.split('\n').map((line, lineIndex) => (
                      <p key={lineIndex} className={lineIndex > 0 ? "mt-2" : ""}>{line}</p>
                    ))}
                  </div>
                )}
                {index < contentParts.length - 1 && index < codeBlocks.length && (
                  'file' in codeBlocks[index] ? (
                    <CodeBlock 
                      code={codeBlocks[index].newCode || (codeBlocks[index] as any).code} 
                      language={codeBlocks[index].file?.endsWith('.py') ? 'python' : 'typescript'}
                      fileName={codeBlocks[index].file}
                      startLine={(codeBlocks[index] as CodeBlockData).startLine}
                      description={(codeBlocks[index] as CodeBlockData).description}
                      highlight={codeBlocks[index].highlight}
                      isRemoved={codeBlocks[index].isRemoved}
                      isAdded={codeBlocks[index].isAdded}
                    />
                  ) : (
                    <CodeBlock 
                      code={(codeBlocks[index] as any).code}
                      language={(codeBlocks[index] as any).language}
                      highlight={(codeBlocks[index] as any).highlight}
                      isRemoved={(codeBlocks[index] as any).isRemoved}
                      isAdded={(codeBlocks[index] as any).isAdded}
                    />
                  )
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBlock;
