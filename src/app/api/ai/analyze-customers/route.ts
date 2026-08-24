import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { customers, recentOrders } = await request.json();

    const systemPrompt = `You are an expert cafe business analyst. Analyze the customer data and provide actionable insights.

Your analysis should identify:
1. At-risk customers (haven't ordered recently, were regular but stopped)
2. High-value opportunities (customers spending a lot, ready for upsells)
3. Loyalty opportunities (customers close to rewards who need a nudge)
4. Specific campaign recommendations with exact customer names

Respond ONLY with valid JSON in this format:
{
  "insights": [
    {
      "type": "at_risk" | "high_value" | "loyalty" | "opportunity",
      "title": "Brief title",
      "description": "Detailed description with specific numbers and customer names",
      "priority": "high" | "medium" | "low",
      "customers": ["Customer Name 1", "Customer Name 2"],
      "recommendation": "Specific action to take"
    }
  ],
  "summary": "Overall summary of cafe health and key opportunities"
}`;

    const dataContext = `
Customer Data:
${JSON.stringify(customers, null, 2)}

Recent Order Patterns:
${JSON.stringify(recentOrders, null, 2)}
`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this cafe's customer data and provide insights:\n\n${dataContext}` },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze customers" },
      { status: 500 }
    );
  }
}
