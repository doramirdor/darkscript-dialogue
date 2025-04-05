
import React, { useState, useRef, useEffect } from 'react';
import { Send, AtSign, Image, File, Folder, Code, FileText, GitBranch, Terminal, AlertTriangle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ConsoleInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  isGenerating?: boolean;
  onStop?: () => void;
  onAccept?: () => void;
}

// Fix the type definition to include 'code' as a valid type
interface ContextFile {
  name: string;
  type: 'file' | 'folder' | 'code';
}

const ConsoleInput: React.FC<ConsoleInputProps> = ({ 
  onSendMessage, 
  placeholder = "Plan, search, build anything", 
  isGenerating = false,
  onStop,
  onAccept
}) => {
  const [message, setMessage] = useState('');
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
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

  const handleAddContextFile = (fileName: string, type: 'file' | 'folder' | 'code') => {
    setContextFiles([...contextFiles, { name: fileName, type }]);
  };

  // Mock file options (in a real app these would come from the repo)
  const mockFiles = [
    { name: 'tailwind.config.js', type: 'file' as const },
    { name: 'vite.config.ts', type: 'file' as const },
    { name: 'src', type: 'folder' as const },
    { name: 'components', type: 'folder' as const },
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const removeContextFile = (index: number) => {
    const newContextFiles = [...contextFiles];
    newContextFiles.splice(index, 1);
    setContextFiles(newContextFiles);
  };

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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <AtSign className="h-3 w-3 mr-1" /> Add context
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-[#1e1e1e] border-[var(--vscode-border)]">
                <div className="p-3 border-b border-[var(--vscode-border)]">
                  <div className="text-sm text-[#cccccc] mb-2">Add files, folders, docs...</div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between flex items-center py-1 px-2 h-8 hover:bg-[#2a2d2e]"
                      onClick={() => {}}
                    >
                      <div className="flex items-center">
                        <Folder className="h-4 w-4 mr-2 text-[#cccccc]" />
                        <span className="text-sm">Files & folders</span>
                      </div>
                      <span className="text-[#cccccc]">›</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between flex items-center py-1 px-2 h-8 hover:bg-[#2a2d2e]"
                      onClick={() => {}}
                    >
                      <div className="flex items-center">
                        <Code className="h-4 w-4 mr-2 text-[#cccccc]" />
                        <span className="text-sm">Code</span>
                      </div>
                      <span className="text-[#cccccc]">›</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between flex items-center py-1 px-2 h-8 hover:bg-[#2a2d2e]"
                      onClick={() => {}}
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-[#cccccc]" />
                        <span className="text-sm">Docs</span>
                      </div>
                      <span className="text-[#cccccc]">›</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between flex items-center py-1 px-2 h-8 hover:bg-[#2a2d2e]"
                      onClick={() => {}}
                    >
                      <div className="flex items-center">
                        <GitBranch className="h-4 w-4 mr-2 text-[#cccccc]" />
                        <span className="text-sm">Git</span>
                      </div>
                      <span className="text-[#cccccc]">›</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between flex items-center py-1 px-2 h-8 hover:bg-[#2a2d2e]"
                      onClick={() => {}}
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-[#cccccc]" />
                        <span className="text-sm">Past chats</span>
                      </div>
                      <span className="text-[#cccccc]">›</span>
                    </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-between flex items-center py-1 px-2 h-8 hover:bg-[#2a2d2e]"
                      onClick={() => {}}
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-[#cccccc]" />
                        <span className="text-sm">Cursor rules</span>
                      </div>
                      <span className="text-[#cccccc]">›</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between flex items-center py-1 px-2 h-8 hover:bg-[#2a2d2e]"
                      onClick={() => {}}
                    >
                      <div className="flex items-center">
                        <Terminal className="h-4 w-4 mr-2 text-[#cccccc]" />
                        <span className="text-sm">Terminals</span>
                      </div>
                      <span className="text-[#cccccc]">›</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between flex items-center py-1 px-2 h-8 hover:bg-[#2a2d2e]"
                      onClick={() => {}}
                    >
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-[#cccccc]" />
                        <span className="text-sm">Linter errors</span>
                      </div>
                      <span className="text-[#cccccc]">›</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between flex items-center py-1 px-2 h-8 hover:bg-[#2a2d2e]"
                      onClick={() => {}}
                    >
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-[#cccccc]" />
                        <span className="text-sm">Web</span>
                      </div>
                      <span className="text-[#cccccc]">›</span>
                    </Button>
                  </div>
                </div>
                
                {/* Mock file selector (in a real app this would be dynamic based on repo) */}
                <div className="p-2">
                  {mockFiles.map((file, index) => (
                    <Button 
                      key={index}
                      variant="ghost" 
                      className="w-full justify-start flex items-center py-1 px-2 h-8 hover:bg-[#2a2d2e] my-0.5"
                      onClick={() => handleAddContextFile(file.name, file.type)}
                    >
                      <div className="flex items-center">
                        {file.type === 'file' && <File className="h-4 w-4 mr-2 text-[#cccccc]" />}
                        {file.type === 'folder' && <Folder className="h-4 w-4 mr-2 text-[#cccccc]" />}
                        <span className="text-sm">{file.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {contextFiles.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {contextFiles.map((file, index) => (
                <div key={index} className="flex items-center bg-[#2d2d2d] rounded-sm px-2 py-0.5 text-xs">
                  <div className="flex items-center">
                    {/* Fix here: Use strict equality and ensure all types are properly handled */}
                    {file.type === 'file' && (
                      <span className="mr-1 text-yellow-500 opacity-80">JS</span>
                    )}
                    {file.type === 'folder' && <Folder className="h-3 w-3 mr-1" />}
                    {file.type === 'code' && <Code className="h-3 w-3 mr-1" />}
                    <span>{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => removeContextFile(index)}
                  >
                    <span className="text-[#858585]">×</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
          
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
