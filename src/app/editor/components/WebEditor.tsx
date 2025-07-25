'use client';
import { useState, useMemo, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface WebEditorProps {
    setEditorCode: (code: string, language: 'html' | 'css' | 'js') => void;
    html: string;
    css: string;
    js: string;
    onTabChange: (language: 'html' | 'css' | 'js') => void;
}

export function WebEditor({ setEditorCode, html, css, js, onTabChange }: WebEditorProps) {
  const { resolvedTheme } = useTheme();
  const [editorTheme, setEditorTheme] = useState('light');

  useEffect(() => {
    setEditorTheme(resolvedTheme === 'dark' ? 'vs-dark' : 'light');
  }, [resolvedTheme]);

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    wordWrap: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: {
      top: 16,
      bottom: 16,
    },
  };

  return (
      <Tabs defaultValue="html" className="w-full h-full flex flex-col" onValueChange={(value) => onTabChange(value as 'html' | 'css' | 'js')}>
        <TabsList className="shrink-0 w-full justify-start rounded-none border-b -mt-2">
          <TabsTrigger value="html" className="rounded-none">HTML</TabsTrigger>
          <TabsTrigger value="css" className="rounded-none">CSS</TabsTrigger>
          <TabsTrigger value="js" className="rounded-none">JavaScript</TabsTrigger>
        </TabsList>
        <TabsContent value="html" className="m-0 flex-grow">
          <MonacoEditor
            language="html"
            value={html}
            onChange={(value) => setEditorCode(value || '', 'html')}
            theme={editorTheme}
            options={editorOptions}
            loading={<Skeleton className="w-full h-full" />}
          />
        </TabsContent>
        <TabsContent value="css" className="m-0 flex-grow">
           <MonacoEditor
            language="css"
            value={css}
            onChange={(value) => setEditorCode(value || '', 'css')}
            theme={editorTheme}
            options={editorOptions}
            loading={<Skeleton className="w-full h-full" />}
          />
        </TabsContent>
        <TabsContent value="js" className="m-0 flex-grow">
           <MonacoEditor
            language="javascript"
            value={js}
            onChange={(value) => setEditorCode(value || '', 'js')}
            theme={editorTheme}
            options={editorOptions}
            loading={<Skeleton className="w-full h-full" />}
          />
        </TabsContent>
      </Tabs>
  );
}
