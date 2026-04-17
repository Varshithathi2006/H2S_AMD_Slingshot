import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { runAgent } from "@/lib/agent/agent";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { prompt, history } = await req.json();

    if (!prompt) {
      return NextResponse.json({ message: "Prompt is required" }, { status: 400 });
    }

    // Call the agentic loop
    const responseText = await runAgent(prompt, history || [], session.user.id);

    return NextResponse.json({ content: responseText });
  } catch (error: any) {
    console.error("[Chat API Error]", error);
    return NextResponse.json({ message: "Error in AI processing", error: error.message }, { status: 500 });
  }
}
