import { groq, CHAT_MODEL } from "@/lib/groq";
import { tools, toolImplementations } from "./tools";

/**
 * The core Agent function that implements function calling with Groq.
 */
export async function runAgent(
  userPrompt: string, 
  history: any[], 
  userId: string
) {
  // Convert tools to Groq/OpenAI function format
  const groqTools = tools.map(tool => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));

  // Convert history to Groq message format
  // Note: history from Gemini might have a different format, 
  // but usually it's { role, parts: [{ text }] }
  // We'll simplify or assume OpenAI format for now, or convert it.
  const messages: any[] = history.map(h => ({
    role: h.role === "model" ? "assistant" : h.role,
    content: typeof h.parts[0].text === "string" ? h.parts[0].text : JSON.stringify(h.parts[0]),
  }));

  messages.push({ role: "user", content: userPrompt });

  // ReAct Loop - handle up to 5 iterations of tool calls
  let iterations = 0;
  while (iterations < 5) {
    iterations++;
    
    const response = await groq.chat.completions.create({
      model: CHAT_MODEL,
      messages: messages,
      tools: groqTools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;
    messages.push(responseMessage);

    if (!responseMessage.tool_calls) {
      return responseMessage.content || "";
    }

    // Process tool calls
    const toolOutputs = await Promise.all(
      responseMessage.tool_calls.map(async (toolCall) => {
        const toolName = toolCall.function.name as keyof typeof toolImplementations;
        const args = JSON.parse(toolCall.function.arguments);

        console.log(`[Agent] Calling tool: ${toolName}`, args);

        const toolFn = toolImplementations[toolName];
        let result;
        if (!toolFn) {
          result = { error: "Tool not found" };
        } else {
          try {
            result = await toolFn({ ...args, userId });
          } catch (error: any) {
            result = { error: error.message };
          }
        }

        return {
          tool_call_id: toolCall.id,
          role: "tool" as const,
          name: toolName,
          content: JSON.stringify(result),
        };
      })
    );

    messages.push(...toolOutputs);
  }

  return "I've reached my iteration limit. How else can I help you?";
}
