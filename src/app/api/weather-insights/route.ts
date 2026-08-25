import { NextResponse } from "next/server";
import { getWeatherForecast, generateWeatherInsights } from "@/lib/weather";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET() {
  try {
    // Get weather forecast
    const forecast = await getWeatherForecast();

    if (!forecast || forecast.length === 0) {
      return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
    }

    // Generate basic insights
    const basicInsights = generateWeatherInsights(forecast);

    // Use AI to enhance suggestions
    const systemPrompt = `You are a cafe business consultant. Based on weather forecasts, provide specific, actionable inventory and marketing suggestions for a cafe.

Focus on:
1. Which specific products to stock up on
2. Marketing messages to send to customers
3. Operational adjustments (staffing, hours, etc.)

Be specific with product names and quantities. Keep suggestions practical and actionable.`;

    const weatherSummary = forecast.map(day => 
      `${day.date}: ${day.temp}°C, ${day.description}, ${day.rain_probability}% rain`
    ).join("\n");

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Weather forecast for next week:\n${weatherSummary}\n\nProvide specific inventory and marketing suggestions for Cafe Sunshine.` 
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiSuggestions = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      forecast,
      insights: basicInsights,
      aiSuggestions,
    });
  } catch (error: any) {
    console.error("Weather Insights Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate weather insights" },
      { status: 500 }
    );
  }
}
