import { forwardRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface EditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(
  ({ code, setCode, language }, ref) => {
    return (
      <div className="w-full h-full relative">
        <Textarea
          ref={ref}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Your code starts here..."
          className="w-full h-full p-4 font-code text-sm bg-card border-0 resize-none focus-visible:ring-0 rounded-none"
          spellCheck="false"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <div className="absolute top-2 right-4 text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
          {language}
        </div>
      </div>
    );
  }
);

Editor.displayName = 'Editor';
