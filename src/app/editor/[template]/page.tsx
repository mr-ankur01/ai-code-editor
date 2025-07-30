
'use client';
import { Suspense, useEffect, useMemo, useRef, useState, use } from 'react';
import { Header } from '@/components/Header';
import { Editor } from '../components/Editor';
import { AIPanel } from '../components/AIPanel';
import { templates } from '@/lib/templates';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Play, Monitor, RefreshCw, Loader, Download } from 'lucide-react';
import { Sandbox } from '../components/Sandbox';
import { executeCodeWithJudge0 } from '@/ai/flows/execute-code-with-judge0';
import { useToast } from '@/hooks/use-toast';
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, useSandpack } from '@codesandbox/sandpack-react';
import { useTheme } from 'next-themes';

type WebLanguage = 'html' | 'css' | 'js';

function EditorView({ params: paramsPromise }: { params: Promise<{ template: keyof Omit<typeof templates, 'web'> | 'web' | null }> }) {
  const params = use(paramsPromise);
  const { template } = params;
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();
  
  // Single file editor state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [terminalStream, setTerminalStream] = useState<{ content: string, key: number } | null>(null);
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
        case 'javascript':
            setCode(templates.javascript);
            setLanguage('javascript');
            break;
        case 'react':
            setCode(templates.react);
            setLanguage('javascript');
            break;
        case 'vue':
            setCode(templates.vue);
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
      setCode(templates.javascript);
      setLanguage('javascript');
    }
  }, [template]);

  const sandboxedWebHtml = useMemo(() => {
    if (!isMounted) return '';
    // We construct a full HTML document here to ensure proper rendering in the sandbox.
    // The CSS is injected into a <style> tag and the JS into a <script> tag.
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Default styles to ensure visibility of content */
            body { 
              font-family: sans-serif;
              background-color: #ffffff;
              color: #000000;
            }
            #root { padding: 1rem; }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (e) {
              document.body.innerHTML = '<pre style="color: red;">' + e + '</pre>';
            }
          </script>
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
    if (template === 'web') {
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
    setTerminalStream({ content: '', key: Date.now() });

    if (language === 'javascript') {
        const output: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;
        let finalOutput = '';

        console.log = (...args) => {
            const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
            output.push(message);
            finalOutput = output.join('\n');
            setTerminalStream({ content: finalOutput, key: Date.now() });
        };
        console.error = (...args) => {
            const message = `Error: ${args.map(arg => arg instanceof Error ? arg.message : String(arg)).join(' ')}`;
            output.push(message);
            finalOutput = output.join('\n');
            setTerminalStream({ content: finalOutput, key: Date.now() });
        };

        try {
            new Function(code)();
        } catch (e: any) {
            output.push(`Error: ${e.message}`);
            finalOutput = output.join('\n');
            setTerminalStream({ content: finalOutput, key: Date.now() });
        } finally {
            console.log = originalLog;
            console.error = originalError;
            setIsExecuting(false);
        }
        return;
    }
    
    try {
      const initialMessage = '> Executing...\n';
      setTerminalStream({ content: initialMessage, key: Date.now() });

      const result = await executeCodeWithJudge0({ source_code: code, language_id: language });

      let executionOutput = initialMessage;
      executionOutput += result.stdout || '';
      if (result.stderr) {
        executionOutput += `\nStderr:\n${result.stderr}`;
      }
      if (result.compile_output) {
        executionOutput += `\nCompile Output:\n${result.compile_output}`;
      }
      if (result.message) {
        executionOutput += `\nMessage:\n${result.message}`;
      }
      
      setTerminalStream({ content: executionOutput, key: Date.now() });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        toast({
            variant: 'destructive',
            title: 'Execution Error',
            description: errorMessage,
        });
        setTerminalStream(prev => ({ content: (prev?.content || '') + `\nError: ${errorMessage}`, key: prev?.key || Date.now() }));
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
            javascript: 'js',
            java: 'java',
            go: 'go',
            csharp: 'cs',
            react: 'jsx',
            vue: 'vue',
        }[language || ''] || 'txt';
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

  const sandpackConfig = useMemo(() => {
    if (!template) return null;
    switch (template) {
      case 'react':
        return {
          template: 'react' as const,
          files: { '/App.js': code },
          customSetup: {
            dependencies: { 'react': 'latest', 'react-dom': 'latest' }
          }
        };
      case 'vue':
        return {
          template: 'vanilla' as const,
          files: { 
            '/App.vue': code,
            '/index.js': `import { createApp } from 'vue';\nimport App from './App.vue';\n\ncreateApp(App).mount('#app');`,
            '/index.html': `<div id="app"></div>`,
           },
           customSetup: {
            dependencies: { 'vue': 'latest' }
          }
        };
      default:
        return null;
    }
  }, [template, code]);

  if (template === 'react' || template === 'vue') {
     if (!sandpackConfig) return <EditorPageSkeleton />;

    return (
      <SidebarProvider>
          <SidebarInset>
            <Header showBack={true} showSidebarToggle={true} />
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-2 h-[calc(100vh-4rem)] p-2">
                <SandpackProvider
                  template={sandpackConfig.template}
                  files={sandpackConfig.files}
                  theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                  onActiveFileChange={(path) => {
                    // Sandpack's files are read-only, so we get the updated code from the editor instance if needed
                  }}
                  customSetup={sandpackConfig.customSetup}
                >
                  <SandpackLayout className="w-full h-full border-0 rounded-lg overflow-hidden">
                    <SandpackCodeEditor 
                      showTabs
                    />
                    <SandpackPreview 
                      showRefreshButton
                      showOpenInCodeSandbox={false}
                    />
                  </SandpackLayout>
                </SandpackProvider>
            </main>
          </SidebarInset>
          <Sidebar side="right" collapsible="offcanvas">
            <SidebarContent>
              <AIPanel
                  editorCode={code}
                  setEditorCode={handleAIPanelCodeChange}
                  getSelectedText={() => ""}
                  language={language}
                />
            </SidebarContent>
          </Sidebar>
      </SidebarProvider>
    )
  }

  if (template === 'web') {
    return (
      <SidebarProvider>
          <SidebarInset>
            <Header showBack={true} showSidebarToggle={true} />
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-2 h-[calc(100vh-4rem)] p-2">
                <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden h-full p-2">
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
                <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden h-full p-2">
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
          <Sidebar side="right" collapsible="offcanvas">
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
      <SidebarInset>
        <Header showBack={true} showSidebarToggle={true} />
        <main className="flex-grow flex flex-col gap-2 overflow-hidden h-[calc(100vh-4rem)] p-2">
            <div className="flex-grow rounded-lg border bg-card shadow-sm overflow-hidden flex flex-col p-2">
              <div className="flex items-center justify-between p-2 border-b">
                <div className="text-sm font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  {template}
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
            <div className="h-[300px] min-h-[200px] rounded-lg border bg-card shadow-sm overflow-hidden flex flex-col">
                <div className="flex h-10 items-center justify-between px-3 border-b bg-muted/50 shrink-0">
                    <div className="flex items-center">
                        <Monitor className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium text-muted-foreground">Output</span>
                    </div>
                </div>
                <div className="flex-grow p-2">
                    <pre className="w-full h-full overflow-auto text-sm p-2 bg-background rounded-md">{terminalStream?.content}</pre>
                </div>
            </div>
          </main>
      </SidebarInset>
      <Sidebar side="right" collapsible="offcanvas">
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
