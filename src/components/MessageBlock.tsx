
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

interface CodeSuggestion {
  file: string;
  description: string;
  newCode: string;
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
  onApplyCode?: (code: string, fileName: string) => void;
}

const MessageBlock: React.FC<MessageBlockProps> = ({ 
  content, 
  type, 
  codeBlocks = [],
  onApplyCode 
}) => {
  // Parse content for code-suggestions format
  const parseCodeSuggestions = (content: string) => {
    const regex = /```code-suggestions\s+([\s\S]*?)```/g;
    const matches = [...content.matchAll(regex)];
    
    if (matches.length > 0) {
      try {
        const jsonContent = matches[0][1].trim();
        const parsedSuggestions: CodeSuggestion[] = JSON.parse(jsonContent);
        return {
          contentWithoutSuggestions: content.replace(regex, ''),
          suggestions: parsedSuggestions
        };
      } catch (error) {
        console.error("Failed to parse code suggestions:", error);
      }
    }
    
    return { contentWithoutSuggestions: content, suggestions: [] };
  };

  const { contentWithoutSuggestions, suggestions } = parseCodeSuggestions(content);
  
  // Convert suggestions to code blocks format
  const allCodeBlocks = [
    ...suggestions.map(suggestion => ({
      file: suggestion.file,
      startLine: 1,
      endLine: suggestion.newCode.split('\n').length,
      newCode: suggestion.newCode,
      description: suggestion.description,
      language: suggestion.language || (suggestion.file?.endsWith('.py') ? 'python' : 'typescript'),
      highlight: suggestion.highlight || [],
      isRemoved: suggestion.isRemoved || false,
      isAdded: suggestion.isAdded || false
    })),
    ...(codeBlocks || [])
  ];
  
  // Split the content by code block placeholders
  const contentParts = contentWithoutSuggestions.split('```code```');

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
                {index < contentParts.length - 1 && index < allCodeBlocks.length && (
                  'file' in allCodeBlocks[index] ? (
                    <CodeBlock 
                      code={allCodeBlocks[index].newCode || (allCodeBlocks[index] as any).code} 
                      language={allCodeBlocks[index].file?.endsWith('.py') ? 'python' : 'typescript'}
                      fileName={allCodeBlocks[index].file}
                      startLine={(allCodeBlocks[index] as CodeBlockData).startLine}
                      description={(allCodeBlocks[index] as CodeBlockData).description}
                      highlight={allCodeBlocks[index].highlight}
                      isRemoved={allCodeBlocks[index].isRemoved}
                      isAdded={allCodeBlocks[index].isAdded}
                      onApply={onApplyCode}
                    />
                  ) : (
                    <CodeBlock 
                      code={(allCodeBlocks[index] as any).code}
                      language={(allCodeBlocks[index] as any).language}
                      highlight={(allCodeBlocks[index] as any).highlight}
                      isRemoved={(allCodeBlocks[index] as any).isRemoved}
                      isAdded={(allCodeBlocks[index] as any).isAdded}
                      onApply={onApplyCode}
                    />
                  )
                )}
              </React.Fragment>
            ))}

            {/* Render any code suggestions that weren't part of the content split */}
            {suggestions.length > 0 && contentParts.length <= 1 && suggestions.map((suggestion, idx) => (
              <CodeBlock 
                key={`suggestion-${idx}`}
                code={suggestion.newCode}
                language={suggestion.file?.endsWith('.py') ? 'python' : 'typescript'}
                fileName={suggestion.file}
                description={suggestion.description}
                highlight={suggestion.highlight}
                isRemoved={suggestion.isRemoved}
                isAdded={suggestion.isAdded}
                onApply={onApplyCode}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBlock;
