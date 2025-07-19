import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeGeneration } from './CodeGeneration';
import { CodeExplanation } from './CodeExplanation';
import { ChatWithAI } from './ChatWithAI';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

interface AIPanelProps {
  editorCode: string;
  setEditorCode: (code: string) => void;
  getSelectedText: () => string;
}

export function AIPanel({ editorCode, setEditorCode, getSelectedText }: AIPanelProps) {
  return (
    <Tabs defaultValue="generate" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="generate"><Sparkles className="w-4 h-4 mr-2" />Generate</TabsTrigger>
        <TabsTrigger value="explain"><Bot className="w-4 h-4 mr-2" />Explain</TabsTrigger>
        <TabsTrigger value="chat"><MessageSquare className="w-4 h-4 mr-2" />Chat</TabsTrigger>
      </TabsList>
      <div className="flex-grow mt-2 overflow-y-auto p-1">
        <TabsContent value="generate">
          <CodeGeneration setEditorCode={setEditorCode} />
        </TabsContent>
        <TabsContent value="explain">
          <CodeExplanation editorCode={editorCode} getSelectedText={getSelectedText} />
        </TabsContent>
        <TabsContent value="chat">
          <ChatWithAI />
        </TabsContent>
      </div>
    </Tabs>
  );
}
