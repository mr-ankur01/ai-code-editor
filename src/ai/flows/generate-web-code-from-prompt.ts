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
  html: z.string().describe('The complete HTML code for the entire page, from <!DOCTYPE> to </html>. It should be a well-formed HTML document.'),
  css: z.string().describe('The complete CSS code. It should be self-contained and not include <style> tags.'),
  js: z.string().describe('The complete JavaScript code. It should be self-contained and not include <script> tags.'),
});
export type GenerateWebCodeOutput = z.infer<typeof GenerateWebCodeOutputSchema>;

export async function generateWebCode(input: GenerateWebCodeInput): Promise<GenerateWebCodeOutput> {
  return generateWebCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebCodePrompt',
  input: {schema: GenerateWebCodeInputSchema},
  output: {schema: GenerateWebCodeOutputSchema},
  prompt: `You are an expert web developer. Based on the user's prompt, generate three separate code blocks for a complete webpage.

  Provide the **full and complete code** for each language.
  - All generated code (HTML, CSS, and JavaScript) MUST be well-formatted with proper indentation.
  - The HTML should be a complete document, starting with <!DOCTYPE html> and ending with </html>.
  - The CSS should be complete.
  - The JavaScript should be complete and manipulate the HTML. The user will inject it separately, so you do not need to add a <script> tag for it in the HTML.
  - For any images that are not for e-commerce, you MUST use 'https://picsum.photos/<width>/<height>' for placeholder images (e.g., https://picsum.photos/600/400).
  - For every placeholder image, you MUST also add a 'data-ai-hint' attribute with one or two keywords describing the image (e.g., 'data-ai-hint="mountain landscape"'). Generate descriptive alt text. Do not use any other placeholder services.
  - If the prompt is related to e-commerce, you MUST use one of the following dummy APIs for product data: 'https://dummyjson.com/products', 'https://fakestoreapiserver.reactbd.org/api/products', or 'https://fakestoreapi.com/products'. When using these APIs, you MUST use the image URLs provided in the API response for product images and NOT use a placeholder service like picsum.photos.

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
