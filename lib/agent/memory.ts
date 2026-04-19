/**
 * Memory manager for the AI agent.
 * Since the agent runs on the server, the client will pass the message history.
 * This helper provides utilities to truncate and format memory correctly for Gemini.
 */

export interface Message {
  role: "user" | "model" | "function";
  content: string;
  name?: string;
}

export const MAX_HISTORY = 10;

export function getTruncatedHistory(history: Message[]): Message[] {
  if (history.length <= MAX_HISTORY) return history;
  return history.slice(history.length - MAX_HISTORY);
}

/**
 * Formats the history for the Google Generative AI SDK format.
 */
export function formatHistoryForGemini(history: Message[]) {
  return history.map((msg) => ({
    role: msg.role === "model" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
}
