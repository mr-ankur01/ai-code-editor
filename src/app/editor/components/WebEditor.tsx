'use client';
import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Sandbox } from './Sandbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebEditorProps {
    setEditorCode: (code: string, language: 'html' | 'css' | 'js') => void;
    html: string;
    css: string;
    js: string;
    onTabChange: (language: 'html' | 'css' | 'js') => void;
}

export function WebEditor({ setEditorCode, html, css, js, onTabChange }: WebEditorProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const sandboxedHtml = useMemo(() => {
    return `<!DOCTYPE html>
<html>
  <head>
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>${js}</script>
  </body>
</html>`;
  }, [html, css, js]);
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full w-full gap-2">
      <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden">
        <Tabs defaultValue="html" className="w-full h-full flex flex-col" onValueChange={(value) => onTabChange(value as 'html' | 'css' | 'js')}>
          <TabsList className="shrink-0 w-full justify-start rounded-none border-b">
            <TabsTrigger value="html" className="rounded-none">HTML</TabsTrigger>
            <TabsTrigger value="css" className="rounded-none">CSS</TabsTrigger>
            <TabsTrigger value="js" className="rounded-none">JavaScript</TabsTrigger>
          </TabsList>
          <TabsContent value="html" className="m-0 flex-grow">
            <Textarea
              value={html}
              onChange={(e) => setEditorCode(e.target.value, 'html')}
              placeholder="<!-- HTML code for the body... -->"
              className="w-full h-full p-4 font-code text-sm bg-card border-0 resize-none focus-visible:ring-0 rounded-none"
            />
          </TabsContent>
          <TabsContent value="css" className="m-0 flex-grow">
            <Textarea
              value={css}
              onChange={(e) => setEditorCode(e.target.value, 'css')}
              placeholder="/* CSS styles... */"
              className="w-full h-full p-4 font-code text-sm bg-card border-0 resize-none focus-visible:ring-0 rounded-none"
            />
          </TabsContent>
          <TabsContent value="js" className="m-0 flex-grow">
            <Textarea
              value={js}
              onChange={(e) => setEditorCode(e.target.value, 'js')}
              placeholder="// JavaScript code..."
              className="w-full h-full p-4 font-code text-sm bg-card border-0 resize-none focus-visible:ring-0 rounded-none"
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="flex h-10 items-center justify-between px-3 border-b bg-muted/50">
          <div className="flex items-center">
            <Monitor className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium text-muted-foreground">Web Output</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        <div className="flex-grow">
            <Sandbox key={refreshKey} content={sandboxedHtml} />
        </div>
      </div>
    </div>
  );
}
