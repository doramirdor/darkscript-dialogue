
import React, { useState, useRef, useEffect } from 'react';
import { Send, AtSign, Image, File, Folder, Code, FileText, Search } from 'lucide-react';
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
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

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
  language?: string;
  path?: string;
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
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleAddContextFile = (fileName: string, type: 'file' | 'folder' | 'code', language?: string, path?: string) => {
    setContextFiles([...contextFiles, { name: fileName, type, language, path }]);
  };

  // Mock repository files (in a real app these would come from the actual repository)
  const mockRepoFiles = [
    { name: 'ConsoleInput.tsx', type: 'file' as const, language: 'TS', path: '...iew-ui/src/components' },
    { name: 'install-extension.sh', type: 'file' as const, language: 'SH', path: '' },
    { name: 'ConsoleHeader.tsx', type: 'file' as const, language: 'TS', path: '...w-ui/src/components' },
    { name: 'setup.sh', type: 'file' as const, language: 'SH', path: '' },
    { name: 'main.js', type: 'file' as const, language: 'JS', path: 'media' },
    { name: 'MessageService.ts', type: 'file' as const, language: 'TS', path: 'src/services' },
    { name: 'ConsoleInterface.tsx', type: 'file' as const, language: 'TS', path: '...ui/src/components' },
    { name: 'CheckpointCommands.ts', type: 'file' as const, language: 'TS', path: '.../checkpoints' },
    { name: 'tailwind.config.js', type: 'file' as const, language: 'JS', path: '' },
    { name: 'vite.config.ts', type: 'file' as const, language: 'TS', path: '' },
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

  // Filter files based on search query
  const filteredFiles = mockRepoFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get appropriate file icon color based on language/type
  const getFileIconForType = (file: { name: string, type: string, language?: string }) => {
    if (file.type === 'folder') {
      return <Folder className="h-4 w-4 mr-2 text-[#e2c08d]" />;
    }
    
    // Return language indicator based on file extension
    switch(file.language) {
      case 'TS':
        return <span className="w-4 h-4 mr-2 text-[#3178c6] text-xs font-medium flex items-center justify-center">TS</span>;
      case 'JS':
        return <span className="w-4 h-4 mr-2 text-[#f7df1e] text-xs font-medium flex items-center justify-center">JS</span>;
      case 'SH':
        return <span className="w-4 h-4 mr-2 text-[#89e051] text-xs font-medium flex items-center justify-center">$</span>;
      default:
        return <File className="h-4 w-4 mr-2 text-[#cccccc]" />;
    }
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
              <PopoverContent className="w-[450px] p-0 bg-[#1e1e1e] border-[var(--vscode-border)]">
                <Command className="bg-transparent border-none">
                  <CommandInput 
                    placeholder="Search files and folders..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    className="h-9 text-sm"
                  />
                  <CommandList className="max-h-[300px] overflow-y-auto">
                    <CommandEmpty>No files found.</CommandEmpty>
                    <CommandGroup heading="Files & folders">
                      {filteredFiles.map((file, index) => (
                        <CommandItem
                          key={index}
                          className="flex items-center py-1.5 px-2 cursor-pointer hover:bg-[#2a2d2e]"
                          onSelect={() => {
                            handleAddContextFile(file.name, file.type, file.language, file.path);
                            setSearchQuery('');
                          }}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              {getFileIconForType(file)}
                              <span className="text-sm">{file.name}</span>
                            </div>
                            {file.path && (
                              <span className="text-[#6e6e6e] text-xs ml-2">{file.path}</span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          {contextFiles.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {contextFiles.map((file, index) => (
                <div key={index} className="flex items-center bg-[#2d2d2d] rounded-sm px-2 py-0.5 text-xs">
                  <div className="flex items-center">
                    {/* Fix here: Use strict equality and ensure all types are properly handled */}
                    {file.type === 'file' && file.language === 'JS' && (
                      <span className="mr-1 text-[#f7df1e] opacity-80">JS</span>
                    )}
                    {file.type === 'file' && file.language === 'TS' && (
                      <span className="mr-1 text-[#3178c6] opacity-80">TS</span>
                    )}
                    {file.type === 'file' && file.language === 'SH' && (
                      <span className="mr-1 text-[#89e051] opacity-80">$</span>
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
