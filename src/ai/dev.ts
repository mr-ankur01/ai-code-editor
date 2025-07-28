import { config } from 'dotenv';
config();

import '@/ai/flows/chat-with-ai-assistant.ts';
import '@/ai/flows/explain-code-selection.ts';
import '@/ai/flows/generate-code-from-prompt.ts';
import '@/ai/flows/generate-web-code-from-prompt.ts';
import '@/ai/flows/simulate-code-execution.ts';
import '@/ai/flows/simulate-code-execution-stream.ts';
