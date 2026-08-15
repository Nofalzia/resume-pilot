import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";

import {
  AI_MODEL,
  openrouter,
  SYSTEM_PROMPT,
} from "@/lib/ai/config";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openrouter(AI_MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 2000,
  });

  return result.toUIMessageStreamResponse();
}