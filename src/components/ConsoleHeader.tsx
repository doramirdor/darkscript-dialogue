
import React from 'react';
import { X, Maximize, MoreHorizontal, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConsoleHeaderProps {
  title: string;
}

const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-console-border bg-console">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-medium text-white">{title}</h1>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
          <History className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
          <Maximize className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConsoleHeader;
