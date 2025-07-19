// @/app/editor/components/WebEditor.tsx
'use client';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Sandbox } from './Sandbox';
import { Monitor, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebEditorProps {
    setEditorCode: (code: string) => void;
    html: string;
}

export function WebEditor({ setEditorCode, html }: WebEditorProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full w-full gap-2">
      <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden">
         <Textarea
          value={html}
          onChange={(e) => setEditorCode(e.target.value)}
          placeholder="<!-- HTML code with inline CSS and JS here... -->"
          className="w-full h-full p-4 font-code text-sm bg-card border-0 resize-none focus-visible:ring-0 rounded-none"
        />
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
            <Sandbox key={refreshKey} content={html} />
        </div>
      </div>
    </div>
  );
}
