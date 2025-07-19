'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Editor } from './components/Editor';
import { AIPanel } from './components/AIPanel';
import { OutputTabs } from './components/OutputTabs';
import { templates } from '@/lib/templates';
import { Skeleton } from '@/components/ui/skeleton';

function EditorView() {
  const searchParams = useSearchParams();
  const template = searchParams.get('template') as keyof typeof templates | null;
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [terminalOutput, setTerminalOutput] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (template && templates[template]) {
      setCode(templates[template]);
      switch (template) {
        case 'js':
          setLanguage('javascript');
          setTerminalOutput('// JavaScript console output will appear here.');
          break;
        case 'python':
          setLanguage('python');
          setTerminalOutput('# Python script output will appear here.');
          break;
        case 'html':
          setLanguage('html');
          setTerminalOutput('<!-- HTML/CSS will render in the website output tab. -->');
          break;
      }
    } else {
      setCode(templates.js);
      setLanguage('javascript');
    }
  }, [template]);

  const getSelectedText = () => {
    if (editorRef.current) {
      const { selectionStart, selectionEnd } = editorRef.current;
      return editorRef.current.value.substring(selectionStart, selectionEnd);
    }
    return '';
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
      <Header showBack={true} />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-2 p-2 overflow-hidden">
        {/* Left Column */}
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="flex-grow rounded-lg border bg-card shadow-sm overflow-hidden">
            <Editor
              ref={editorRef}
              code={code}
              setCode={setCode}
              language={language}
            />
          </div>
          <div className="h-[300px] min-h-[200px] rounded-lg border bg-card shadow-sm overflow-hidden">
            <OutputTabs terminalOutput={terminalOutput} webContent={code} />
          </div>
        </div>

        {/* Right Column (Side Panel) */}
        <div className="hidden lg:flex flex-col h-full rounded-lg border bg-card shadow-sm overflow-hidden p-1">
          <AIPanel
            editorCode={code}
            setEditorCode={setCode}
            getSelectedText={getSelectedText}
          />
        </div>
      </main>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorPageSkeleton />}>
      <EditorView />
    </Suspense>
  )
}

function EditorPageSkeleton() {
  return (
    <div className="h-screen w-full flex flex-col bg-background">
      <Header showBack={true} />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-2 p-2">
         {/* Left Column */}
         <div className="flex flex-col gap-2">
            <Skeleton className="flex-grow rounded-lg" />
            <Skeleton className="h-[300px] min-h-[200px] rounded-lg" />
         </div>
         {/* Right Column */}
         <div className="hidden lg:block">
            <Skeleton className="h-full w-full rounded-lg" />
         </div>
      </main>
    </div>
  )
}
