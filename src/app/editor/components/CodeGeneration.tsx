'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateCode } from '@/ai/flows/generate-code-from-prompt';
import { generateWebCode } from '@/ai/flows/generate-web-code-from-prompt';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CodeGenerationProps {
  setEditorCode: (code: string | {html: string, css: string, js: string}, language?: string) => void;
  activeWebLanguage?: 'html' | 'css' | 'js';
  language?: string;
}

export function CodeGeneration({ setEditorCode, activeWebLanguage, language }: CodeGenerationProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Prompt',
        description: 'Please enter a prompt to generate code.',
      });
      return;
    }
    setIsLoading(true);
    try {
      if(activeWebLanguage) {
        const result = await generateWebCode({ prompt });
        setEditorCode(result);
      } else {
        const result = await generateCode({ prompt, language });
        setEditorCode(result.code);
      }
      toast({
        title: 'Code Generated',
        description: 'The generated code has been added to the editor.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate code.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    if (activeWebLanguage) {
      return "e.g., 'A simple counter button'";
    }
    if (language === 'vue') {
      return "e.g., 'A Vue component for a shopping cart'";
    }
    return `e.g., 'a ${language || 'javascript'} function to reverse a string'`;
  }

  return (
    <Card className="h-full flex flex-col border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle>Code Generation</CardTitle>
        <CardDescription>Describe the code you want to create.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder={getPlaceholder()}
          className="flex-grow resize-none"
          disabled={isLoading}
        />
        <Button onClick={handleGenerateCode} disabled={isLoading}>
          {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Generate Code
        </Button>
      </CardContent>
    </Card>
  );
}
