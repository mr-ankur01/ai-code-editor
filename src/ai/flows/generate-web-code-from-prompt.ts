'use server';
/**
 * @fileOverview Generates a complete web component (HTML, CSS, and JavaScript) from a single prompt.
 *
 * - generateWebCode - A function that generates code based on a prompt.
 * - GenerateWebCodeInput - The input type for the generateWebCode function.
 * - GenerateWebCodeOutput - The return type for the generateWebCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWebCodeInputSchema = z.object({
  prompt: z.string().describe('The prompt describing the web component to generate.'),
});
export type GenerateWebCodeInput = z.infer<typeof GenerateWebCodeInputSchema>;

const GenerateWebCodeOutputSchema = z.object({
  html: z.string().describe('The complete HTML code for the component. This should only include the content for the <body> tag, not the full HTML document structure.'),
  css: z.string().describe('The complete, self-contained CSS code to style the component.'),
  js: z.string().describe('The complete, self-contained JavaScript code for any interactivity.'),
});
export type GenerateWebCodeOutput = z.infer<typeof GenerateWebCodeOutputSchema>;

export async function generateWebCode(input: GenerateWebCodeInput): Promise<GenerateWebCodeOutput> {
  return generateWebCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebCodePrompt',
  input: {schema: GenerateWebCodeInputSchema},
  output: {schema: GenerateWebCodeOutputSchema},
  prompt: `You are an expert web developer. Based on the user's prompt, generate a complete, self-contained web component consisting of HTML, CSS, and JavaScript.

  Provide the **full and complete code** for all three parts.
  - The HTML should only be the content for the <body>. Do not include <html>, <head>, or <body> tags.
  - The CSS should provide all necessary styling for the component.
  - The JavaScript should handle all interactivity for the component.

  Prompt: {{{prompt}}}`,
});

const generateWebCodeFlow = ai.defineFlow(
  {
    name: 'generateWebCodeFlow',
    inputSchema: GenerateWebCodeInputSchema,
    outputSchema: GenerateWebCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
