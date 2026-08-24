import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt, context } = await request.json();

    const systemPrompt = `You are an AI assistant helping cafe owners create effective promotions. 
Based on the owner's description, generate a structured promotion with:
- A catchy title (max 50 chars)
- A clear description (max 150 chars)
- Target audience (e.g., "all customers", "inactive customers", "high-value customers", "new customers")
- Discount percentage (if applicable, between 5-30%)
- Duration in days (between 3-14 days)

Context about the cafe:
${context}

Respond ONLY with valid JSON in this exact format:
{
  "title": "string",
  "description": "string",
  "target_segment": "string",
  "discount_percent": number or null,
  "duration_days": number
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI");
    }

    const promotion = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ promotion });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate promotion" },
      { status: 500 }
    );
  }
}
