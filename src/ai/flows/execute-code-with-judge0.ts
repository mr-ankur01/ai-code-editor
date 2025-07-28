'use server';
/**
 * @fileOverview Executes a code snippet using the Judge0 API.
 *
 * - executeCodeWithJudge0 - Submits code to Judge0 and retrieves the result.
 * - ExecuteCodeInput - The input type for the function.
 * - Judge0ExecutionResult - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mapping from our app's language names to Judge0's language IDs.
const languageIdMap: { [key: string]: number } = {
  'javascript': 93, // Node.js
  'python': 71,    // Python 3.8.1
  'java': 62,      // Java (OpenJDK 13.0.1)
  'csharp': 51,    // C# (Mono 6.6.0.161)
  'go': 60,        // Go (1.13.5)
};

const ExecuteCodeInputSchema = z.object({
  source_code: z.string().describe('The source code to execute.'),
  language_id: z.string().describe('The language of the source code (e.g., "python", "javascript").'),
});
export type ExecuteCodeInput = z.infer<typeof ExecuteCodeInputSchema>;

const Judge0ExecutionResultSchema = z.object({
  stdout: z.string().nullable(),
  stderr: z.string().nullable(),
  compile_output: z.string().nullable(),
  message: z.string().nullable(),
  status: z.object({
    id: z.number(),
    description: z.string(),
  }).nullable(),
});
export type Judge0ExecutionResult = z.infer<typeof Judge0ExecutionResultSchema>;

// Helper function to delay execution.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function postToJudge0(url: string, body: object) {
  const apiKey = process.env.JUDGE0_API_KEY;
  const apiHost = process.env.JUDGE0_API_HOST;

  if (!apiKey || !apiHost) {
    throw new Error('Judge0 API key or host is not configured in environment variables.');
  }

  const response = await fetch(`https://${apiHost}${url}?base64_encoded=false&wait=false`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Judge0 API error: ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

async function getFromJudge0(url: string) {
  const apiKey = process.env.JUDGE0_API_KEY;
  const apiHost = process.env.JUDGE0_API_HOST;
  
  if (!apiKey || !apiHost) {
      throw new Error('Judge0 API key or host is not configured in environment variables.');
  }

  const response = await fetch(`https://${apiHost}${url}?base64_encoded=false`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost,
    },
  });

  if (!response.ok) {
    throw new Error(`Judge0 API error: ${response.statusText}`);
  }

  return response.json();
}


const executeCodeFlow = ai.defineFlow(
  {
    name: 'executeCodeWithJudge0Flow',
    inputSchema: ExecuteCodeInputSchema,
    outputSchema: Judge0ExecutionResultSchema,
  },
  async (input) => {
    const languageId = languageIdMap[input.language_id];
    if (!languageId) {
      throw new Error(`Unsupported language: ${input.language_id}`);
    }

    // 1. Create a submission
    const submissionResponse = await postToJudge0('/submissions', {
      source_code: input.source_code,
      language_id: languageId,
    });

    const token = submissionResponse.token;
    if (!token) {
      throw new Error('Failed to get submission token from Judge0.');
    }

    // 2. Poll for the result
    let result;
    while (true) {
      result = await getFromJudge0(`/submissions/${token}`);
      if (result.status.id > 2) { // Statuses 1 (In Queue) and 2 (Processing) are pending
        break;
      }
      await sleep(1000); // Wait for 1 second before polling again
    }
    
    return result;
  }
);


export async function executeCodeWithJudge0(input: ExecuteCodeInput): Promise<Judge0ExecutionResult> {
  return executeCodeFlow(input);
}
