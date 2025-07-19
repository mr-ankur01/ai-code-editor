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
  html: z.string().describe('The complete, generated HTML code. This should be a full HTML structure, not just a snippet.'),
  css: z.string().describe('The complete, generated CSS code to style the component. This should be full CSS, not just a snippet.'),
  js: z.string().describe('The complete, generated JavaScript code for any interactivity. This should be full JS, not just a snippet.'),
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

  Provide the **full and complete code** for all three parts. Do not use placeholders or omit any code. The HTML should be the complete structure, the CSS should provide all necessary styling, and the JavaScript should handle all interactivity.

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
