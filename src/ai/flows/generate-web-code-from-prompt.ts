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
  html: z.string().describe('The complete, self-contained HTML document. This should be a single file including <html>, <head>, <body>, <style>, and <script> tags as needed.'),
});
export type GenerateWebCodeOutput = z.infer<typeof GenerateWebCodeOutputSchema>;

export async function generateWebCode(input: GenerateWebCodeInput): Promise<GenerateWebCodeOutput> {
  return generateWebCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebCodePrompt',
  input: {schema: GenerateWebCodeInputSchema},
  output: {schema: GenerateWebCodeOutputSchema},
  prompt: `You are an expert web developer. Based on the user's prompt, generate a single, complete, self-contained HTML file.

  Provide the **full and complete code** for the HTML document.
  - The response must be a valid HTML file.
  - It MUST include all necessary HTML tags like <html>, <head>, and <body>.
  - All CSS MUST be included inside a <style> tag within the <head>.
  - All JavaScript MUST be included inside a <script> tag, preferably at the end of the <body>.

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
