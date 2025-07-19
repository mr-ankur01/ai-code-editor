// @/app/editor/components/WebEditor.tsx
'use client';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Sandbox } from './Sandbox';
import { Monitor, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Language = 'html' | 'css' | 'js';

interface WebEditorProps {
    setEditorCode: (code: string, language: Language) => void;
    html: string;
    css: string;
    js: string;
    activeTab: Language;
    onTabChange: (tab: Language) => void;
}

export function WebEditor({ setEditorCode, html, css, js, activeTab, onTabChange }: WebEditorProps) {
  const [webContent, setWebContent] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const combinedContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Website Output</title>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
      </html>
    `;
    setWebContent(combinedContent);
  }, [html, css, js]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full w-full gap-2">
      <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as Language)} className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
          </TabsList>
          <div className="flex-grow relative">
            <TabsContent value="html" className="absolute inset-0 m-0">
               <Textarea
                value={html}
                onChange={(e) => setEditorCode(e.target.value, 'html')}
                placeholder="<!-- HTML code here... -->"
                className="w-full h-full p-4 font-code text-sm bg-card border-0 resize-none focus-visible:ring-0 rounded-none"
              />
            </TabsContent>
            <TabsContent value="css" className="absolute inset-0 m-0">
               <Textarea
                value={css}
                onChange={(e) => setEditorCode(e.target.value, 'css')}
                placeholder="/* CSS code here... */"
                className="w-full h-full p-4 font-code text-sm bg-card border-0 resize-none focus-visible:ring-0 rounded-none"
              />
            </TabsContent>
            <TabsContent value="js" className="absolute inset-0 m-0">
               <Textarea
                value={js}
                onChange={(e) => setEditorCode(e.target.value, 'js')}
                placeholder="// JavaScript code here..."
                className="w-full h-full p-4 font-code text-sm bg-card border-0 resize-none focus-visible:ring-0 rounded-none"
              />
            </TabsContent>
          </div>
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
            <Sandbox key={refreshKey} content={webContent} />
        </div>
      </div>
    </div>
  );
}
