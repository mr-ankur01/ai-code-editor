
'use client';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Editor } from './components/Editor';
import { AIPanel } from './components/AIPanel';
import { OutputTabs } from './components/OutputTabs';
import { templates } from '@/lib/templates';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Play, Monitor, RefreshCw, Loader } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { WebEditor } from './components/WebEditor';
import { Sandbox } from './components/Sandbox';
import { simulateCodeExecution } from '@/ai/flows/simulate-code-execution';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

type WebLanguage = 'html' | 'css' | 'js';

function EditorView() {
  const searchParams = useSearchParams();
  const template = searchParams.get('template') as keyof Omit<typeof templates, 'web'> | 'web' | null;
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();
  
  // Single file editor state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [terminalOutput, setTerminalOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const editorRef = useRef<any>(null);

  // Web editor state
  const [html, setHtml] = useState(templates.web.html);
  const [css, setCss] = useState(templates.web.css);
  const [js, setJs] = useState(templates.web.js);
  const [activeWebLanguage, setActiveWebLanguage] = useState<WebLanguage>('html');

  // Sandbox state
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        case 'javascript':
            setLanguage('javascript');
            break;
        case 'java':
            setLanguage('java');
            break;
        case 'go':
            setLanguage('go');
            break;
        case 'csharp':
            setLanguage('csharp');
            break;
      }
    } else if (template === 'web') {
      setHtml(templates.web.html);
      setCss(templates.web.css);
      setJs(templates.web.js);
    } else {
      setCode(templates.react);
      setLanguage('javascript');
    }
  }, [template]);

  const themeStyles = `
      :root {
        --background: 240 10% 98%;
        --foreground: 222.2 84% 4.9%;
        --card: 0 0% 100%;
        --card-foreground: 222.2 84% 4.9%;
        --popover: 0 0% 100%;
        --popover-foreground: 222.2 84% 4.9%;
        --primary: 210 90% 55%; /* Muted Blue */
        --primary-foreground: 210 40% 98%;
        --secondary: 210 40% 96.1%;
        --secondary-foreground: 210 40% 9%;
        --muted: 210 40% 96.1%;
        --muted-foreground: 210 40% 45.1%;
        --accent: 210 90% 90%; /* Lighter Blue */
        --accent-foreground: 210 90% 25%;
        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 0 0% 98%;
        --border: 210 40% 89.8%;
        --input: 210 40% 89.8%;
        --ring: 210 90% 55%;
      }
    
      .dark {
        --background: 20 14% 6%;
        --foreground: 20 5% 94%;
        --card: 20 14% 6%;
        --card-foreground: 20 5% 94%;
        --popover: 20 14% 6%;
        --popover-foreground: 20 5% 94%;
        --primary: 210 90% 55%;
        --primary-foreground: 210 40% 98%;
        --secondary: 20 10% 15%;
        --secondary-foreground: 20 5% 98%;
        --muted: 20 10% 15%;
        --muted-foreground: 20 5% 64%;
        --accent: 210 90% 15%; /* Darker Blue */
        --accent-foreground: 210 90% 85%;
        --destructive: 0 72% 51%;
        --destructive-foreground: 0 0% 98%;
        --border: 20 10% 15%;
        --input: 20 10% 15%;
        --ring: 210 90% 55%;
      }

      body { 
        font-family: sans-serif; 
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
        transition: background-color 0.2s, color 0.2s;
      }
      #root { padding: 1rem; }
      button {
        background-color: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
      }
      button:hover {
        opacity: 0.9;
      }
    `;

  const sandboxedReactHtml = useMemo(() => {
    if (template !== 'react' || !isMounted) return '';
    const reactVersion = '18.3.1';
    
    return `
      <!DOCTYPE html>
      <html class="${resolvedTheme}">
        <head>
          <title>React Preview</title>
          <style>${themeStyles}</style>
          <script src="https://unpkg.com/react@${reactVersion}/umd/react.development.js" crossorigin></script>
          <script src="https://unpkg.com/react-dom@${reactVersion}/umd/react.dom.development.js" crossorigin></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel" data-type="module">
            try {
              ${code}
            } catch (error) {
              const root = document.getElementById('root');
              root.innerHTML = '<pre style="color: red;">' + error + '</pre>';
            }
          </script>
        </body>
      </html>
    `;
  }, [code, template, resolvedTheme, themeStyles, isMounted]);

  const sandboxedWebHtml = useMemo(() => {
    if (!isMounted) return '';
    return `
      <!DOCTYPE html>
      <html class="${resolvedTheme}">
        <head>
          <style>
            ${themeStyles}
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  }, [html, css, js, resolvedTheme, themeStyles, isMounted]);


  const getSelectedText = () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      const selection = editorRef.current.getSelection();
      if (model && selection) {
        return model.getValueInRange(selection);
      }
    }
    // TODO: Implement for multi-file editor
    return '';
  };
  
  const handleRunCode = async () => {
    if (template === 'react' || template === 'web' || template === 'vue') {
      setRefreshKey(prev => prev + 1);
      return;
    }
    
    if (!code.trim()) {
      toast({
        variant: 'destructive',
        title: 'No code to run',
        description: 'Please write some code in the editor before running.',
      });
      return;
    }

    setIsExecuting(true);
    const fileName = `main.${{python: 'py', go: 'go', java: 'java', csharp: 'cs', javascript: 'js'}[language] || 'js'}`;
    setTerminalOutput(`> Running ${fileName}...\n`);

    try {
      const result = await simulateCodeExecution({ code, language });
      setTerminalOutput(prev => prev + result.output);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Execution Error',
        description: 'The AI failed to simulate the code execution.',
      });
       setTerminalOutput(prev => prev + 'An error occurred during API simulation.');
    } finally {
      setIsExecuting(false);
    }
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
              <main className="flex-grow p-2 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden">
                    <WebEditor 
                      setEditorCode={handleWebEditorCodeChange}
                      html={html}
                      css={css}
                      js={js}
                      onTabChange={setActiveWebLanguage}
                    />
                  </div>
                   <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden">
                      <div className="flex h-10 items-center justify-between px-3 border-b bg-muted/50">
                        <div className="flex items-center">
                          <Monitor className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium text-muted-foreground">Web Output</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setRefreshKey(k => k + 1)}>
                          <RefreshCw className="w-4 h-4" />
                          <span className="sr-only">Refresh</span>
                        </Button>
                      </div>
                      <div className="flex-grow">
                          {isMounted ? <Sandbox key={refreshKey} content={sandboxedWebHtml} /> : <Skeleton className="w-full h-full" />}
                      </div>
                    </div>
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
                    {template === 'react' ? 'React.js' : language}
                  </div>
                   <Button size="sm" onClick={handleRunCode} disabled={isExecuting}>
                      {isExecuting ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                      Run
                    </Button>
                </div>
                <div className="relative flex-1">
                  <div className="absolute inset-0">
                    <Editor
                      ref={editorRef}
                      code={code}
                      setCode={setCode}
                      language={language}
                    />
                  </div>
                </div>
              </div>
              <div className="h-[300px] min-h-[200px] rounded-lg border bg-card shadow-sm overflow-hidden">
                {template === 'react' || template === 'vue' ? (
                  <div className="flex flex-col h-full">
                    <div className="flex h-10 items-center justify-between px-3 border-b bg-muted/50">
                      <div className="flex items-center">
                        <Monitor className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium text-muted-foreground">Web Output</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setRefreshKey(k => k + 1)}>
                        <RefreshCw className="w-4 h-4" />
                        <span className="sr-only">Refresh</span>
                      </Button>
                    </div>
                    <div className="flex-grow">
                      {isMounted ? <Sandbox key={refreshKey} content={sandboxedReactHtml} /> : <Skeleton className="w-full h-full" />}
                    </div>
                  </div>
                ) : (
                  <OutputTabs terminalOutput={terminalOutput} />
                )}
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

    