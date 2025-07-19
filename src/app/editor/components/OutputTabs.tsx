import { TerminalSquare } from 'lucide-react';
import { Terminal } from './Terminal';

interface OutputTabsProps {
  terminalOutput: string;
}

export function OutputTabs({ terminalOutput }: OutputTabsProps) {
  return (
    <div className="w-full h-full flex flex-col">
       <div className="flex h-10 items-center justify-between px-3 border-b bg-muted/50 shrink-0">
          <div className="flex items-center">
            <TerminalSquare className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium text-muted-foreground">Terminal</span>
          </div>
        </div>
      <div className="flex-grow p-2">
         <Terminal output={terminalOutput} />
      </div>
    </div>
  );
}
