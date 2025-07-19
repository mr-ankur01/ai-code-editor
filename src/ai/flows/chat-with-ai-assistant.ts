'use server';
/**
 * @fileOverview Implements an AI chat assistant for coding questions, debugging, and general programming advice.
 *
 * - chatWithAiAssistant - A function that handles the chat process.
 * - ChatWithAiAssistantInput - The input type for the chatWithAiAssistant function.
 * - ChatWithAiAssistantOutput - The return type for the chatWithAiAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithAiAssistantInputSchema = z.object({
  query: z.string().describe('The user query or question.'),
});
export type ChatWithAiAssistantInput = z.infer<typeof ChatWithAiAssistantInputSchema>;

const ChatWithAiAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s response to the query.'),
});
export type ChatWithAiAssistantOutput = z.infer<typeof ChatWithAiAssistantOutputSchema>;

export async function chatWithAiAssistant(input: ChatWithAiAssistantInput): Promise<ChatWithAiAssistantOutput> {
  return chatWithAiAssistantFlow(input);
}

const chatWithAiAssistantPrompt = ai.definePrompt({
  name: 'chatWithAiAssistantPrompt',
  input: {schema: ChatWithAiAssistantInputSchema},
  output: {schema: ChatWithAiAssistantOutputSchema},
  prompt: `You are a helpful AI assistant that can answer coding questions, debug code, and provide general programming advice.

  User Query: {{{query}}}

  Response: `,
});

const chatWithAiAssistantFlow = ai.defineFlow(
  {
    name: 'chatWithAiAssistantFlow',
    inputSchema: ChatWithAiAssistantInputSchema,
    outputSchema: ChatWithAiAssistantOutputSchema,
  },
  async input => {
    const {output} = await chatWithAiAssistantPrompt(input);
    return output!;
  }
);
