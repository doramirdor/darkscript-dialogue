
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, AtSign } from 'lucide-react';
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
    <div className="border-t border-console-border bg-console py-4 px-4 w-full">
      {isGenerating ? (
        <div className="flex max-w-4xl mx-auto space-x-2">
          <Button 
            variant="outline" 
            className="text-sm flex-1 py-6 bg-console-accent hover:bg-console-highlight border-console-border"
            onClick={onStop}
          >
            <span className="mr-2">Stop</span> ⌘⏎
          </Button>
          <Button 
            className="text-sm flex-1 py-6 bg-blue-600 hover:bg-blue-700"
            onClick={onAccept}
          >
            <span className="mr-2">Accept</span> ⌘⏎
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <div className="flex items-end mb-1 text-xs text-muted-foreground">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <AtSign className="h-3 w-3 mr-1" /> Add context
            </Button>
          </div>
          
          <div className="relative flex items-center rounded-md border border-console-border bg-console-accent">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="flex-1 py-3 px-4 bg-transparent focus:outline-none resize-none max-h-[200px] scrollbar-thin"
            />
            
            <div className="flex items-center pr-2">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
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
          </div>
        </form>
      )}
    </div>
  );
};

export default ConsoleInput;
