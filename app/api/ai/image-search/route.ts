import { NextResponse } from "next/server";
import { visionModel } from "@/lib/gemini";
import { toolImplementations } from "@/lib/agent/tools";

export async function POST(req: Request) {
  try {
    const { image } = await req.json(); // base64 image

    if (!image) {
      return NextResponse.json({ message: "Image is required" }, { status: 400 });
    }

    // 1. Setup Vision Prompt
    const prompt = "Describe this product in detail including type, color, and style. Be concise.";
    const imagePart = {
      inlineData: {
        data: image.split(",")[1] || image, // Handle both data:image/png;base64,... and raw base64
        mimeType: "image/jpeg",
      },
    };

    // 2. Generate Description
    const result = await visionModel.generateContent([prompt, imagePart]);
    const description = result.response.text();

    console.log("[Vision] Product Description:", description);

    // 3. Search for matching products using the tool
    const matchingProducts = await toolImplementations.search_products({ query: description });

    return NextResponse.json({
      description,
      products: matchingProducts
    });
  } catch (error: any) {
    console.error("[Vision API Error]", error);
    return NextResponse.json({ message: "Error processing image", error: error.message }, { status: 500 });
  }
}
