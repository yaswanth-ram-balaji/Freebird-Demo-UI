'use server';
/**
 * @fileOverview A flow for generating AI chat responses.
 *
 * - getAiResponse - A function that generates a response based on chat history.
 * - ChatHistorySchema - The Zod schema for the input (an array of messages).
 */
import { ai } from '@/ai/genkit';
import { MessageSchema } from '@/lib/data';
import { z } from 'zod';

const ChatHistorySchema = z.array(MessageSchema);
export type ChatHistory = z.infer<typeof ChatHistorySchema>;

export async function getAiResponse(history: ChatHistory): Promise<string> {
  return chatFlow(history);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatHistorySchema },
  output: { schema: z.string() },
  prompt: `You are a participant in a chat room. Your name is Alex.
  Your persona is helpful, friendly, and concise.
  Given the chat history, provide a relevant and natural-sounding response.
  Do not act as an AI or assistant. Just be a normal chat user.
  Keep your responses short and conversational.

  Chat History:
  {{#each input}}
  {{this.senderId}}: {{this.text}}
  {{/each}}
  Alex:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatHistorySchema,
    outputSchema: z.string(),
  },
  async (history) => {
    const llmResponse = await chatPrompt(history);
    return llmResponse.output!;
  }
);
