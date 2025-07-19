import { ScrollArea } from '@/components/ui/scroll-area';

interface TerminalProps {
  output: string;
}

export function Terminal({ output }: TerminalProps) {
  return (
    <ScrollArea className="h-full w-full bg-muted/50 rounded-md">
      <div className="p-4 font-code text-sm text-foreground">
        <pre>
          <code>{output}</code>
        </pre>
      </div>
    </ScrollArea>
  );
}
