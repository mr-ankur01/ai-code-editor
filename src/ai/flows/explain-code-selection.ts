'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing a selected block of code into key points.
 *
 * - explainCodeSelection - A function that takes a code snippet as input and returns its explanation.
 * - ExplainCodeSelectionInput - The input type for the explainCodeSelection function.
 * - ExplainCodeSelectionOutput - The return type for the explainCodeSelection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCodeSelectionInputSchema = z.object({
  code: z
    .string()
    .describe('The block of code selected by the user to be explained.'),
});
export type ExplainCodeSelectionInput = z.infer<
  typeof ExplainCodeSelectionInputSchema
>;

const ExplainCodeSelectionOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A summary of the code block, presented as a list of points.'),
});
export type ExplainCodeSelectionOutput = z.infer<
  typeof ExplainCodeSelectionOutputSchema
>;

export async function explainCodeSelection(
  input: ExplainCodeSelectionInput
): Promise<ExplainCodeSelectionOutput> {
  return explainCodeSelectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodeSelectionPrompt',
  input: {schema: ExplainCodeSelectionInputSchema},
  output: {schema: ExplainCodeSelectionOutputSchema},
  prompt: `You are an AI code assistant. Explain the purpose of the entire code file provided below.
Summarize the file in a few short, clear, and concise bullet points.

Code:
\`\`\`
{{{code}}}
\`\`\`

Explanation Points:`,
});

const explainCodeSelectionFlow = ai.defineFlow(
  {
    name: 'explainCodeSelectionFlow',
    inputSchema: ExplainCodeSelectionInputSchema,
    outputSchema: ExplainCodeSelectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
