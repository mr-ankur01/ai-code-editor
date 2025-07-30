'use server';
/**
 * @fileOverview Generates code based on a user-provided prompt.
 *
 * - generateCode - A function that generates code based on a prompt.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeInputSchema = z.object({
  prompt: z.string().describe('The prompt describing the code to generate.'),
  language: z.string().optional().describe('The programming language for the code.  Examples: Javascript, Python, HTML, etc.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  code: z.string().describe('The generated code.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: {schema: GenerateCodeInputSchema},
  output: {schema: GenerateCodeOutputSchema},
  prompt: `You are an expert software developer{{#if language}} that specializes in generating code in {{language}}{{/if}}.

  Based on the prompt, generate the appropriate code. Be as complete as possible, including imports, functions, classes, etc.
  
  {{#if (eq language "java")}}
  **CRITICAL**: The public class MUST be named "Main".
  {{/if}}

  Prompt: {{{prompt}}}`,
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
