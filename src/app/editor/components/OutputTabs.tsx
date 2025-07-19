import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal } from './Terminal';
import { Sandbox } from './Sandbox';
import { Monitor, TerminalSquare } from 'lucide-react';

interface OutputTabsProps {
  terminalOutput: string;
  webContent: string;
}

export function OutputTabs({ terminalOutput, webContent }: OutputTabsProps) {
  return (
    <Tabs defaultValue="terminal" className="w-full h-full flex flex-col">
      <TabsList className="shrink-0">
        <TabsTrigger value="terminal"><TerminalSquare className="w-4 h-4 mr-2" />Terminal</TabsTrigger>
        <TabsTrigger value="website"><Monitor className="w-4 h-4 mr-2" />Website Output</TabsTrigger>
      </TabsList>
      <div className="flex-grow mt-2 overflow-auto">
        <TabsContent value="terminal" className="m-0 h-full">
          <Terminal output={terminalOutput} />
        </TabsContent>
        <TabsContent value="website" className="m-0 h-full">
          <Sandbox content={webContent} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
