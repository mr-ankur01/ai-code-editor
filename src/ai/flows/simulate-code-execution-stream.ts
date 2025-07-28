
'use server';
/**
 * @fileOverview Simulates the execution of a code snippet and streams the predicted output.
 *
 * - simulateCodeExecutionStream - A function that simulates code execution and streams the output.
 * - SimulateCodeExecutionStreamInput - The input type for the simulateCodeExecutionStream function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateCodeExecutionStreamInputSchema = z.object({
  code: z.string().describe('The code to simulate.'),
  language: z.string().describe('The programming language of the code.'),
});
export type SimulateCodeExecutionStreamInput = z.infer<typeof SimulateCodeExecutionStreamInputSchema>;

// This is the internal flow definition, which is not exported.
const simulateCodeExecutionStreamFlow = ai.defineFlow(
  {
    name: 'simulateCodeExecutionStream',
    inputSchema: SimulateCodeExecutionStreamInputSchema,
    outputSchema: z.string(),
  },
  async (input, streamingCallback) => {
    const prompt = `You are a code execution simulator. You will be given a block of code in a specific language.
Your task is to predict the exact output that would be printed to the terminal if this code were executed.
Do not provide any explanation, comments, or markdown formatting. Only return the raw text output that the code would generate.

Language: ${input.language}
Code:
\`\`\`
${input.code}
\`\`\`
`;

    const {stream} = ai.generateStream({
        prompt: prompt,
        model: 'googleai/gemini-pro'
    });

    let result = '';
    for await (const chunk of stream) {
        if(streamingCallback) streamingCallback(chunk.text);
        result += chunk.text;
    }

    return result;
  }
);

// This is the exported async function that satisfies the 'use server' constraint.
export async function simulateCodeExecutionStream(
    input: SimulateCodeExecutionStreamInput,
    streamingCallback?: (chunk: string) => void
): Promise<string> {
    return simulateCodeExecutionStreamFlow(input, streamingCallback);
}
