
import React, { useState, useRef, useEffect } from 'react';
import ConsoleHeader from './ConsoleHeader';
import ConsoleInput from './ConsoleInput';
import MessageBlock, { MessageType } from './MessageBlock';

interface Message {
  id: string;
  content: string;
  type: MessageType;
  codeBlocks?: Array<{
    code: string;
    language?: string;
    highlight?: number[];
    isRemoved?: boolean;
    isAdded?: boolean;
  }>;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    content: 'Same issue, file not found.',
    type: 'user',
  },
  {
    id: '2',
    content: 'I see the issue. The problem is that we\'re trying to load the HTML file from the wrong location after the Vite build. Let\'s modify the path to use the correct location in the build output:```code```',
    type: 'system',
    codeBlocks: [
      {
        code: '// Load the scraping HTML file\nconst scrapingPath = path.join(_dirname, \'scraping\', \'scraping.html\');\nawait scrapingWindow.loadFile(scrapingPath);\n\n// Send URL to the window',
        language: 'ts',
        isRemoved: true,
      }
    ]
  },
  {
    id: '3',
    content: '```code```Let\'s also update the Vite config to ensure the files are copied to the correct location:```code```',
    type: 'system',
    codeBlocks: [
      {
        code: 'const scrapingPath = path.join(process.cwd(), \'.vite/build/helpers/ipc/model.html\');\nawait scrapingWindow.loadFile(scrapingPath);\n\n// Send URL to the window',
        language: 'ts',
        isAdded: true
      },
      {
        code: 'export default defineConfig({\n  resolve: {\n    alias: {\n      \'@\': path.resolve(__dirname, \'./src\')\n    },\n  },\n  build: {\n    rollupOptions: {\n      external: [\n        // Externalize native modules\n        \'node-llama-cpp\',\n      ]\n    }\n  }\n});',
        language: 'ts',
      }
    ]
  }
];

const ConsoleInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      type: 'user',
    };
    
    setMessages([...messages, newMessage]);
    // Simulate a response
    setIsGenerating(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Generating',
        type: 'loading',
      }]);
    }, 500);
  };

  const handleStopGenerating = () => {
    setIsGenerating(false);
    setMessages(prev => prev.filter(msg => msg.type !== 'loading'));
  };

  const handleAcceptGenerating = () => {
    setIsGenerating(false);
    setMessages(prev => {
      const newMessages = prev.filter(msg => msg.type !== 'loading');
      return [
        ...newMessages, 
        {
          id: Date.now().toString(),
          content: 'Changes applied successfully. The path now correctly points to the file location in the build output directory.',
          type: 'system',
        }
      ];
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[var(--vscode-editor-bg)] vscode-dark">
      <ConsoleHeader title="Extracting Plain Text from Websites" />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="py-2 border-b border-[var(--vscode-border)] bg-[#2d2d2d]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="vscode-terminal-command">
              <span className="text-[#C586C0] mr-2">npm</span> run start
            </div>
          </div>
        </div>
        
        {messages.map((message) => (
          <MessageBlock 
            key={message.id}
            content={message.content}
            type={message.type}
            codeBlocks={message.codeBlocks}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <ConsoleInput 
        onSendMessage={handleSendMessage} 
        isGenerating={isGenerating}
        onStop={handleStopGenerating}
        onAccept={handleAcceptGenerating}
      />
    </div>
  );
};

export default ConsoleInterface;
