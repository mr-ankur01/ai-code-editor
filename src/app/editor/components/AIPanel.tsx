import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeGeneration } from './CodeGeneration';
import { CodeExplanation } from './CodeExplanation';
import { ChatWithAI } from './ChatWithAI';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

interface AIPanelProps {
  editorCode: string;
  setEditorCode: (code: string | {html: string, css: string, js: string}, language?: 'html' | 'css' | 'js') => void;
  getSelectedText: () => string;
  activeWebLanguage?: 'html' | 'css' | 'js';
  language?: string;
}

export function AIPanel({ editorCode, setEditorCode, getSelectedText, activeWebLanguage, language }: AIPanelProps) {
  return (
    <Tabs defaultValue="generate" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="generate"><Sparkles className="w-4 h-4 mr-2" />Generate</TabsTrigger>
        <TabsTrigger value="explain"><Bot className="w-4 h-4 mr-2" />Explain</TabsTrigger>
        <TabsTrigger value="chat"><MessageSquare className="w-4 h-4 mr-2" />Chat</TabsTrigger>
      </TabsList>
      <div className="flex-grow mt-2 overflow-y-auto p-1">
        <TabsContent value="generate">
          <CodeGeneration 
            setEditorCode={setEditorCode} 
            activeWebLanguage={activeWebLanguage} 
            language={language}
          />
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
