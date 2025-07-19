import { forwardRef, useEffect, useState } from 'react';
import MonacoEditor, { Monaco } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Skeleton } from '@/components/ui/skeleton';

interface EditorProps {
  code: string;
  setCode: (code: string) => void;
  language?: string;
}

export const Editor = forwardRef<any, EditorProps>(
  ({ code, setCode, language }, ref) => {
    const { resolvedTheme } = useTheme();
    const [editorTheme, setEditorTheme] = useState('light');

    useEffect(() => {
      setEditorTheme(resolvedTheme === 'dark' ? 'vs-dark' : 'light');
    }, [resolvedTheme]);

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
      if (ref) {
        (ref as React.MutableRefObject<any>).current = editor;
      }
      // You can define custom themes here if needed
      // monaco.editor.defineTheme('my-dark-theme', { ... });
    };

    return (
      <MonacoEditor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => setCode(value || '')}
        theme={editorTheme}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: {
            top: 16,
            bottom: 16,
          },
        }}
        loading={<Skeleton className="w-full h-full" />}
        onMount={handleEditorDidMount}
      />
    );
  }
);

Editor.displayName = 'Editor';
