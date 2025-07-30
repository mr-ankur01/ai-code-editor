'use server';
/**
 * @fileOverview Generates a complete component (e.g., React, Vue) with necessary boilerplate from a single prompt.
 *
 * - generateComponentCode - A function that generates component code based on a prompt.
 * - GenerateComponentCodeInput - The input type for the function.
 * - GenerateComponentCodeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateComponentCodeInputSchema = z.object({
  prompt: z.string().describe('The prompt describing the component to generate.'),
  framework: z.enum(['react', 'vue']).describe('The framework for the component (React or Vue).')
});
export type GenerateComponentCodeInput = z.infer<typeof GenerateComponentCodeInputSchema>;

const GenerateComponentCodeOutputSchema = z.object({
  componentCode: z.string().describe('The main component code (e.g., App.js for React, App.vue for Vue).'),
  entryPointCode: z.string().optional().describe('The entry point code (e.g., main.js or index.js to mount the app).'),
  htmlCode: z.string().optional().describe('The HTML entry point (e.g., index.html).')
});
export type GenerateComponentCodeOutput = z.infer<typeof GenerateComponentCodeOutputSchema>;

export async function generateComponentCode(input: GenerateComponentCodeInput): Promise<GenerateComponentCodeOutput> {
  return generateComponentCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateComponentCodePrompt',
  input: {schema: GenerateComponentCodeInputSchema},
  output: {schema: GenerateComponentCodeOutputSchema},
  prompt: `You are an expert web developer specializing in {{framework}}. Based on the user's prompt, generate the code for a single file component and any necessary entrypoint/HTML files.

  - For React, the main file is 'App.js'. You don't need an entry point or HTML.
  - For Vue, provide 'index.js' for the entry point and a basic 'index.html' with an <div id="app"></div>. The main component logic should be in 'index.js'.
  - The component should be self-contained and complete.
  - Be as complete as possible, including imports.

  Prompt: {{{prompt}}}`,
});

const generateComponentCodeFlow = ai.defineFlow(
  {
    name: 'generateComponentCodeFlow',
    inputSchema: GenerateComponentCodeInputSchema,
    outputSchema: GenerateComponentCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
