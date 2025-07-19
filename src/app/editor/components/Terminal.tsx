import { ScrollArea } from '@/components/ui/scroll-area';

interface TerminalProps {
  output: string;
}

export function Terminal({ output }: TerminalProps) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4 font-code text-sm text-foreground bg-muted/50 h-full rounded-md">
        <pre>
          <code>{output}</code>
        </pre>
      </div>
    </ScrollArea>
  );
}
