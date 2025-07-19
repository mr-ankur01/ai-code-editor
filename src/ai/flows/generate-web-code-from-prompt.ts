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
  html: z.string().describe('The generated HTML code.'),
  css: z.string().describe('The generated CSS code.'),
  js: z.string().describe('The generated JavaScript code.'),
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

  The HTML should be the structure, the CSS should provide the styling, and the JavaScript should handle any interactivity. Provide code for all three parts.

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
