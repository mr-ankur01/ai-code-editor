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
import { Play } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { WebEditor } from './components/WebEditor';

type WebLanguage = 'html' | 'css' | 'js';

function EditorView() {
  const searchParams = useSearchParams();
  const template = searchParams.get('template') as keyof Omit<typeof templates, 'web'> | 'web' | null;
  
  // Single file editor state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [terminalOutput, setTerminalOutput] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Web editor state
  const [html, setHtml] = useState(templates.web.html);
  const [css, setCss] = useState(templates.web.css);
  const [js, setJs] = useState(templates.web.js);
  const [activeWebLanguage, setActiveWebLanguage] = useState<WebLanguage>('html');

  useEffect(() => {
    if (template && templates[template] && template !== 'web') {
      const templateContent = templates[template as keyof Omit<typeof templates, 'web'>];
      setCode(templateContent);
      switch (template) {
        case 'python':
          setLanguage('python');
          break;
        case 'react':
            setLanguage('javascript');
            break;
        case 'vue':
            setLanguage('html');
            break;
      }
      setTerminalOutput(`> Running ${template}...\n(Execution is simulated)`);

    } else if (template === 'web') {
      setHtml(templates.web.html);
      setCss(templates.web.css);
      setJs(templates.web.js);
    } else {
      setCode(templates.react);
      setLanguage('javascript');
      setTerminalOutput(`> Running react...\n(Execution is simulated)`);
    }
  }, [template]);

  const getSelectedText = () => {
    if (editorRef.current) {
      const { selectionStart, selectionEnd } = editorRef.current;
      return editorRef.current.value.substring(selectionStart, selectionEnd);
    }
    // TODO: Implement for multi-file editor
    return '';
  };
  
  const handleRunCode = () => {
    setTerminalOutput(`> Running ${language} code...\n(Execution is simulated)`);
  };
  
  const handleWebEditorCodeChange = (newCode: string, language: 'html' | 'css' | 'js') => {
    if (language === 'html') setHtml(newCode);
    if (language === 'css') setCss(newCode);
    if (language === 'js') setJs(newCode);
  };
  
  const handleAIPanelCodeChange = (newCode: string | {html: string, css: string, js: string}) => {
      if(template === 'web' && typeof newCode === 'object' && 'html' in newCode) {
        setHtml(newCode.html);
        setCss(newCode.css);
        setJs(newCode.js);
      } else if (typeof newCode === 'string') {
        setCode(newCode);
      }
  }

  const getActiveWebEditorCode = () => {
    switch(activeWebLanguage) {
      case 'html': return html;
      case 'css': return css;
      case 'js': return js;
      default: return '';
    }
  }

  if (template === 'web') {
    return (
       <SidebarProvider>
        <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
          <Header showBack={true} showSidebarToggle={true} />
          <div className="flex flex-grow overflow-hidden">
            <SidebarInset>
              <main className="flex-grow p-2 overflow-hidden">
                  <WebEditor 
                    setEditorCode={handleWebEditorCodeChange}
                    html={html}
                    css={css}
                    js={js}
                    onTabChange={setActiveWebLanguage}
                  />
              </main>
            </SidebarInset>
             <Sidebar side="right" collapsible="icon">
              <SidebarContent className="p-0">
                 <AIPanel
                    editorCode={getActiveWebEditorCode()}
                    setEditorCode={handleAIPanelCodeChange}
                    getSelectedText={() => ""} // TODO: Implement for multi-file editor
                    activeWebLanguage={activeWebLanguage}
                  />
              </SidebarContent>
            </Sidebar>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
        <Header showBack={true} showSidebarToggle={true} />
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
                <div className="relative flex-grow flex">
                  <Editor
                    ref={editorRef}
                    code={code}
                    setCode={setCode}
                  />
                </div>
              </div>
              <div className="h-[300px] min-h-[200px] rounded-lg border bg-card shadow-sm overflow-hidden">
                <OutputTabs terminalOutput={terminalOutput} />
              </div>
            </main>
          </SidebarInset>

          <Sidebar side="right" collapsible="icon">
            <SidebarContent className="p-0">
               <AIPanel
                  editorCode={code}
                  setEditorCode={handleAIPanelCodeChange}
                  getSelectedText={getSelectedText}
                  language={language}
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
