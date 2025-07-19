'use server';

/**
 * @fileOverview This file defines a Genkit flow for explaining a selected block of code in plain language.
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
    .describe('The explanation of the selected code block in plain language.'),
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
  prompt: `You are an AI code assistant. Explain the following code block in plain language:

  {{code}}`,
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
