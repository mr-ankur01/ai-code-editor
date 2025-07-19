'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Editor } from './components/Editor';
import { AIPanel } from './components/AIPanel';
import { OutputTabs } from './components/OutputTabs';
import { templates } from '@/lib/templates';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Play, PanelRight, PanelLeft } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarInset, useSidebar } from '@/components/ui/sidebar';

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
  
  const handleRunCode = () => {
    setTerminalOutput(`Running ${language} code...\n\n(Note: This is a simulated execution environment.)`);
  };

  const EditorHeader = () => {
    const { open } = useSidebar();
    return (
      <Header showBack={true}>
        <SidebarTrigger>
          {open ? <PanelRight /> : <PanelLeft />}
        </SidebarTrigger>
      </Header>
    )
  }

  return (
    <SidebarProvider>
      <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
        <EditorHeader />
        <div className="flex flex-grow overflow-hidden">
          <SidebarInset>
            <main className="flex-grow flex flex-col gap-2 p-2 overflow-hidden">
              <div className="flex-grow rounded-lg border bg-card shadow-sm overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-2 border-b">
                  <div className="text-sm font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    {language}
                  </div>
                  <Button size="sm" onClick={handleRunCode}>
                      <Play className="w-4 h-4 mr-2" />
                      Run
                  </Button>
                </div>
                <div className="relative flex-grow flex flex-col">
                  <Editor
                    ref={editorRef}
                    code={code}
                    setCode={setCode}
                  />
                </div>
              </div>
              <div className="h-[300px] min-h-[200px] rounded-lg border bg-card shadow-sm overflow-hidden">
                <OutputTabs terminalOutput={terminalOutput} webContent={code} />
              </div>
            </main>
          </SidebarInset>

          <Sidebar side="right" collapsible="icon">
            <SidebarContent className="p-0">
               <AIPanel
                  editorCode={code}
                  setEditorCode={setCode}
                  getSelectedText={getSelectedText}
                />
            </SidebarContent>
          </Sidebar>
        </div>
      </div>
    </SidebarProvider>
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
