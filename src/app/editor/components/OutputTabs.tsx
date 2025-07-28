import { TerminalSquare } from 'lucide-react';
import { RawTerminal } from './RawTerminal';

interface OutputTabsProps {
  streamingOutput?: { content: string, key: number } | null;
}

export function OutputTabs({ streamingOutput }: OutputTabsProps) {
  return (
    <div className="w-full h-full flex flex-col">
       <div className="flex h-10 items-center justify-between px-3 border-b bg-muted/50 shrink-0">
          <div className="flex items-center">
            <TerminalSquare className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium text-muted-foreground">Terminal</span>
          </div>
        </div>
      <div className="flex-grow p-2 relative">
         <RawTerminal 
            streamingOutput={streamingOutput}
         />
      </div>
    </div>
  );
}
