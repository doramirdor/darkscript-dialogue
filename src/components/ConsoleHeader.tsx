
import React from 'react';
import { X, Maximize, Minimize, Plus, RotateCcw, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConsoleHeaderProps {
  title: string;
}

const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({ title }) => {
  return (
    <div className="vscode-title-bar">
      <div className="flex items-center space-x-2">
        <h1 className="vscode-title-text">{title}</h1>
      </div>
      <div className="vscode-title-actions">
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white">
          <Plus className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default ConsoleHeader;
