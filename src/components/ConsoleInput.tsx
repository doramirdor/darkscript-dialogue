
import React, { useState, useRef, useEffect } from 'react';
import { Send, AtSign, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConsoleInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  isGenerating?: boolean;
  onStop?: () => void;
  onAccept?: () => void;
}

const ConsoleInput: React.FC<ConsoleInputProps> = ({ 
  onSendMessage, 
  placeholder = "Plan, search, build anything", 
  isGenerating = false,
  onStop,
  onAccept
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-[var(--vscode-border)] bg-[var(--vscode-editor-bg)] py-3 px-4 w-full">
      {isGenerating ? (
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse"></div>
            <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
            <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
            <span className="ml-2 text-sm text-muted-foreground">Generating...</span>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="text-xs py-1 px-3 h-7 bg-[var(--vscode-input-bg)] hover:bg-[var(--vscode-button-hover-bg)] border-[var(--vscode-border)]"
              onClick={onStop}
            >
              <span>Stop</span>
              <span className="ml-2 opacity-70 text-xs">⌘⏎</span>
            </Button>
            <Button 
              className="text-xs py-1 px-3 h-7 bg-[var(--vscode-button-bg)] hover:bg-[var(--vscode-button-hover-bg)]"
              onClick={onAccept}
            >
              <span>Accept</span>
              <span className="ml-2 opacity-70 text-xs">⌘⏎</span>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center mb-1 text-xs text-muted-foreground">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <AtSign className="h-3 w-3 mr-1" /> Add context
            </Button>
          </div>
          
          <div className="relative flex items-center border border-[var(--vscode-input-border)] bg-[var(--vscode-input-bg)] rounded-sm">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="flex-1 py-2 px-3 bg-transparent focus:outline-none resize-none max-h-[200px] scrollbar-thin text-sm"
            />
            
            <div className="flex items-center pr-2">
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon"  
                className="h-8 w-8 text-muted-foreground hover:text-white"
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center mt-2 text-xs justify-between">
            <div className="flex items-center text-muted-foreground">
              <span className="inline-flex items-center">
                Agent #1
              </span>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                Auto
              </Button>
            </div>
            <div className="text-xs text-muted-foreground opacity-80">
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Image className="h-3.5 w-3.5 mr-1" /> Send
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ConsoleInput;
