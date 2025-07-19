'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateCode } from '@/ai/flows/generate-code-from-prompt';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Language = 'html' | 'css' | 'js' | 'javascript' | 'python';

interface CodeGenerationProps {
  setEditorCode: (code: string, language?: Language) => void;
  activeWebLanguage?: 'html' | 'css' | 'js';
}

export function CodeGeneration({ setEditorCode, activeWebLanguage }: CodeGenerationProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('javascript');
  const { toast } = useToast();

  useEffect(() => {
    if (activeWebLanguage) {
      setLanguage(activeWebLanguage);
    }
  }, [activeWebLanguage]);

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
      const result = await generateCode({ prompt, language });
      setEditorCode(result.code, language);
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
          placeholder="e.g., 'a javascript function to reverse a string'"
          className="flex-grow resize-none"
          disabled={isLoading}
        />
        {activeWebLanguage && (
           <Select 
             value={language} 
             onValueChange={(value) => setLanguage(value as Language)}
             disabled={isLoading}
           >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="js">JavaScript</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button onClick={handleGenerateCode} disabled={isLoading}>
          {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Generate Code
        </Button>
      </CardContent>
    </Card>
  );
}
