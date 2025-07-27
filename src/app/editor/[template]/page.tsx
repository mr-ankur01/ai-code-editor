
'use client';
import { Suspense, useEffect, useMemo, useRef, useState, use } from 'react';
import { Header } from '@/components/Header';
import { Editor } from '../components/Editor';
import { AIPanel } from '../components/AIPanel';
import { OutputTabs } from '../components/OutputTabs';
import { templates } from '@/lib/templates';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Play, Monitor, RefreshCw, Loader, Download } from 'lucide-react';
import { WebEditor } from '../components/WebEditor';
import { Sandbox } from '../components/Sandbox';
import { simulateCodeExecution } from '@/ai/flows/simulate-code-execution';
import { useToast } from '@/hooks/use-toast';
import { SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

type WebLanguage = 'html' | 'css' | 'js';

function EditorView({ params: paramsPromise }: { params: Promise<{ template: keyof Omit<typeof templates, 'web'> | 'web' | null }> }) {
  const params = use(paramsPromise);
  const { template } = params;
  const { toast } = useToast();
  
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
            setCode(templates.react);
            setLanguage('javascript');
            break;
        case 'vue':
            setCode(templates.vue);
            setLanguage('html');
            break;
        case 'javascript':
            setCode(templates.javascript);
            setLanguage('javascript');
            break;
        case 'java':
            setCode(templates.java);
            setLanguage('java');
            break;
        case 'go':
            setCode(templates.go);
            setLanguage('go');
            break;
        case 'csharp':
            setCode(templates.csharp);
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

  const sandboxedWebHtml = useMemo(() => {
    if (!isMounted) return '';
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: sans-serif;
              background-color: #ffffff;
              color: #000000;
            }
            #root { padding: 1rem; }
            button {
              background-color: #3b82f6;
              color: #ffffff;
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 0.5rem;
              cursor: pointer;
            }
            button:hover {
              opacity: 0.9;
            }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  }, [html, css, js, isMounted]);


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

  const handleDownloadCode = () => {
    let content = '';
    let filename = 'code.txt';

    if (template === 'web') {
        content = getActiveWebEditorCode();
        filename = `index.${activeWebLanguage}`;
    } else {
        content = code;
        const extension = {
            python: 'py',
            react: 'jsx',
            vue: 'html',
            javascript: 'js',
            java: 'java',
            go: 'go',
            csharp: 'cs'
        }[template || ''] || 'txt';
        filename = `${template || 'code'}.${extension}`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
  
  const reactIndexJs = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;


  if (template === 'web') {
    return (
      <SidebarProvider>
          <SidebarInset className="flex-grow flex flex-col bg-background text-foreground overflow-hidden">
            <Header showBack={true} showSidebarToggle={true} />
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-2 h-full p-2">
                <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden h-full">
                  <div className="flex items-center justify-between p-2 border-b">
                      <div className="text-sm font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        Web Project
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleDownloadCode}>
                        <Download className="w-4 h-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                  </div>
                  <WebEditor 
                    setEditorCode={handleWebEditorCodeChange}
                    html={html}
                    css={css}
                    js={js}
                    onTabChange={setActiveWebLanguage}
                  />
                </div>
                <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden h-full">
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
            <SidebarContent>
              <AIPanel
                  editorCode={getActiveWebEditorCode()}
                  setEditorCode={handleAIPanelCodeChange}
                  getSelectedText={() => ""} // TODO: Implement for multi-file editor
                  activeWebLanguage={activeWebLanguage}
                />
            </SidebarContent>
          </Sidebar>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <SidebarInset className="flex-grow flex flex-col bg-background text-foreground overflow-hidden">
        <Header showBack={true} showSidebarToggle={true} />
        <main className="flex-grow flex flex-col gap-2 overflow-hidden h-full p-2">
            <div className="flex-grow rounded-lg border bg-card shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-2 border-b">
                <div className="text-sm font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  {template === 'react' ? 'React.js' : language}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={handleDownloadCode}>
                    <Download className="w-4 h-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleRunCode} disabled={isExecuting}>
                    {isExecuting ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    <span className="sr-only">Run</span>
                  </Button>
                </div>
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
              {template === 'react' ? (
                isMounted ? (
                  <SandpackProvider
                      key={refreshKey}
                      template="react"
                      files={{
                        '/App.js': code,
                        '/index.js': {
                          code: reactIndexJs,
                          hidden: true,
                        },
                      }}
                    >
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
                        <div className="flex-grow h-full">
                          <SandpackPreview showRefreshButton={false} showOpenInCodeSandbox={false} />
                        </div>
                      </div>
                  </SandpackProvider>
                ) : <Skeleton className="w-full h-full" />
              ) : template === 'vue' ? (
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
                    {isMounted ? <Sandbox key={refreshKey} content={code} /> : <Skeleton className="w-full h-full" />}
                  </div>
                </div>
              ) : (
                <OutputTabs terminalOutput={terminalOutput} />
              )}
            </div>
          </main>
      </SidebarInset>
      <Sidebar side="right" collapsible="icon">
          <SidebarContent>
            <AIPanel
                editorCode={code}
                setEditorCode={handleAIPanelCodeChange}
                getSelectedText={getSelectedText}
                language={language}
              />
          </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

export default function EditorPage({ params }: { params: { template: string }}) {
  const promise = Promise.resolve(params);
  return (
    <Suspense fallback={<EditorPageSkeleton />}>
      <EditorView params={promise} />
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

    