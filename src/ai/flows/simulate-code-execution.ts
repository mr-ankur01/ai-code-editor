'use server';
/**
 * @fileOverview Simulates the execution of a code snippet and returns the predicted output.
 *
 * - simulateCodeExecution - A function that simulates code execution.
 * - SimulateCodeExecutionInput - The input type for the simulateCodeExecution function.
 * - SimulateCodeExecutionOutput - The return type for the simulateCodeExecution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateCodeExecutionInputSchema = z.object({
  code: z.string().describe('The code to simulate.'),
  language: z.string().describe('The programming language of the code.'),
});
export type SimulateCodeExecutionInput = z.infer<typeof SimulateCodeExecutionInputSchema>;

const SimulateCodeExecutionOutputSchema = z.object({
  output: z.string().describe('The predicted output of the code execution.'),
});
export type SimulateCodeExecutionOutput = z.infer<typeof SimulateCodeExecutionOutputSchema>;

export async function simulateCodeExecution(input: SimulateCodeExecutionInput): Promise<SimulateCodeExecutionOutput> {
  return simulateCodeExecutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateCodeExecutionPrompt',
  input: {schema: SimulateCodeExecutionInputSchema},
  output: {schema: SimulateCodeExecutionOutputSchema},
  prompt: `You are a code execution simulator. You will be given a block of code in a specific language.
Your task is to predict the exact output that would be printed to the terminal if this code were executed.
Do not provide any explanation, comments, or markdown formatting. Only return the raw text output that the code would generate.

Language: {{{language}}}
Code:
\`\`\`
{{{code}}}
\`\`\`
`,
});

const simulateCodeExecutionFlow = ai.defineFlow(
  {
    name: 'simulateCodeExecutionFlow',
    inputSchema: SimulateCodeExecutionInputSchema,
    outputSchema: SimulateCodeExecutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
