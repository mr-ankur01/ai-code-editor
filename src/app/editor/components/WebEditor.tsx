// @/app/editor/components/WebEditor.tsx
'use client';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Sandbox } from './Sandbox';
import { templates } from '@/lib/templates';

export function WebEditor() {
  const [html, setHtml] = useState(templates.web.html);
  const [css, setCss] = useState(templates.web.css);
  const [js, setJs] = useState(templates.web.js);
  const [webContent, setWebContent] = useState('');

  useEffect(() => {
    const combinedContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Web Project Output</title>
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full w-full gap-2">
      <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden">
        <Tabs defaultValue="html" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
          </TabsList>
          <div className="flex-grow relative">
            <TabsContent value="html" className="absolute inset-0 m-0">
               <Textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="<!-- HTML code here... -->"
                className="w-full h-full p-4 font-code text-sm bg-card border-0 resize-none focus-visible:ring-0 rounded-none"
              />
            </TabsContent>
            <TabsContent value="css" className="absolute inset-0 m-0">
               <Textarea
                value={css}
                onChange={(e) => setCss(e.target.value)}
                placeholder="/* CSS code here... */"
                className="w-full h-full p-4 font-code text-sm bg-card border-0 resize-none focus-visible:ring-0 rounded-none"
              />
            </TabsContent>
            <TabsContent value="js" className="absolute inset-0 m-0">
               <Textarea
                value={js}
                onChange={(e) => setJs(e.target.value)}
                placeholder="// JavaScript code here..."
                className="w-full h-full p-4 font-code text-sm bg-card border-0 resize-none focus-visible:ring-0 rounded-none"
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
         <Sandbox content={webContent} />
      </div>
    </div>
  );
}
