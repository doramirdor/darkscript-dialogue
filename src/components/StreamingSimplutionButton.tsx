
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Terminal, Play, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreamingSimplutionButtonProps {
  onShowSimplution: () => void;
  className?: string;
}

const StreamingSimplutionButton: React.FC<StreamingSimplutionButtonProps> = ({
  onShowSimplution,
  className
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("flex gap-2 text-xs", className)}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>Simplution</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="grid gap-4 p-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Streaming Simplution</h4>
            <p className="text-sm text-muted-foreground">
              See how streaming messages work in real-time.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="flex gap-2" onClick={onShowSimplution}>
                <Play className="h-3.5 w-3.5" />
                <span>Run Demo</span>
              </Button>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Code className="h-3.5 w-3.5" />
                <span>View Code</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground">
            This demo shows how streaming messages are rendered in real-time as they arrive from the server.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default StreamingSimplutionButton;
