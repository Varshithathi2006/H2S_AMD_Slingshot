import { describe, it, expect, vi } from "vitest";
import { runAgent } from "@/lib/agent/agent";

// Mock the Gemini model
vi.mock("@/lib/gemini", () => ({
  model: {
    startChat: vi.fn(() => ({
      sendMessage: vi.fn().mockResolvedValue({
        response: {
          text: () => "I found some laptops for you.",
          candidates: [
            {
              content: {
                parts: [{ text: "I found some laptops for you." }]
              }
            }
          ]
        }
      })
    }))
  }
}));

describe("Agent ReAct Loop", () => {
  it("should return a text response from Gemini", async () => {
    const response = await runAgent("Find me a laptop", [], "user-123");
    expect(response).toBe("I found some laptops for you.");
  });
});
