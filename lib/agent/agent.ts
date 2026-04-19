import { model } from "@/lib/gemini";
import { tools, toolImplementations } from "./tools";

/**
 * The core Agent function that implements function calling with Gemini.
 */
export async function runAgent(
  userPrompt: string, 
  history: any[], 
  userId: string
) {
  // 1. Initialize chat with given history and tools
  const chat = model.startChat({
    history: history,
    tools: [
      {
        functionDeclarations: tools as any,
      },
    ],
  });

  // 2. Send user message
  let result = await chat.sendMessage(userPrompt);
  let response = result.response;

  // 3. ReAct Loop - handle up to 5 iterations of tool calls
  let iterations = 0;
  while (response.candidates![0].content.parts.some(p => p.functionCall) && iterations < 5) {
    iterations++;
    const functionCalls = response.candidates![0].content.parts.filter(p => p.functionCall);
    
    const functionResponses = await Promise.all(
      functionCalls.map(async (call) => {
        const functionCall = call.functionCall!;
        const toolName = functionCall.name as keyof typeof toolImplementations;
        const args = functionCall.args as any;

        console.log(`[Agent] Calling tool: ${toolName}`, args);

        const toolFn = toolImplementations[toolName];
        if (!toolFn) {
          return {
            functionResponse: {
              name: toolName,
              response: { error: "Tool not found" },
            },
          };
        }

        try {
          // Add userId to args for tools that need it
          const result = await toolFn({ ...args, userId });
          return {
            functionResponse: {
              name: toolName,
              response: { result },
            },
          };
        } catch (error: any) {
          return {
            functionResponse: {
              name: toolName,
              response: { error: error.message },
            },
          };
        }
      })
    );

    // Feed tool results back to Gemini
    result = await chat.sendMessage(functionResponses);
    response = result.response;
  }

  return response.text();
}
