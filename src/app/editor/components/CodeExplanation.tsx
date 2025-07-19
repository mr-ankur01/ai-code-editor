'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wand2, Loader } from 'lucide-react';
import { explainCodeSelection } from '@/ai/flows/explain-code-selection';
import { useToast } from '@/hooks/use-toast';

interface CodeExplanationProps {
  editorCode: string;
  getSelectedText: () => string;
}

export function CodeExplanation({ editorCode, getSelectedText }: CodeExplanationProps) {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExplainCode = async () => {
    const selectedCode = getSelectedText();
    const codeToExplain = selectedCode.trim() || editorCode.trim();

    if (!codeToExplain) {
      toast({
        variant: 'destructive',
        title: 'No code found',
        description: 'Please select some code or write code in the editor to explain.',
      });
      return;
    }

    setIsLoading(true);
    setExplanation('');

    try {
      const result = await explainCodeSelection({ code: codeToExplain });
      setExplanation(result.explanation);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to explain code.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle>Code Explanation</CardTitle>
        <CardDescription>Select code in the editor or explain the whole file.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Button onClick={handleExplainCode} disabled={isLoading}>
          {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Explain Code
        </Button>
        <ScrollArea className="flex-grow rounded-md border p-4 bg-muted/50">
          {isLoading && <p className="text-muted-foreground animate-pulse">Analyzing code...</p>}
          {explanation ? (
            <div className="text-sm whitespace-pre-wrap">{explanation}</div>
          ) : (
            !isLoading && <p className="text-sm text-muted-foreground">The explanation will appear here.</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
