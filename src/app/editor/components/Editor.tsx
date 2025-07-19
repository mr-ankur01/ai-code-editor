import { forwardRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface EditorProps {
  code: string;
  setCode: (code: string) => void;
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(
  ({ code, setCode }, ref) => {
    return (
      <Textarea
        ref={ref}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="// Your code starts here..."
        className="w-full h-full p-4 font-code text-sm bg-card border-0 resize-none focus-visible:ring-0 rounded-none flex-grow"
        spellCheck="false"
        autoCorrect="off"
      />
    );
  }
);

Editor.displayName = 'Editor';
