"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Sun, Thermometer, Droplets, Loader2, AlertTriangle, TrendingUp, Sparkles } from "lucide-react";

type WeatherData = {
  date: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  weather: string;
  description: string;
  rain_probability: number;
  humidity: number;
};

type Insight = {
  type: string;
  priority: string;
  title: string;
  description: string;
  actions: string[];
};

const weatherIcons: Record<string, any> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudRain,
};

const priorityStyles = {
  high: "border-[#dc2626] bg-[#dc2626]/5",
  medium: "border-[#d97706] bg-[#d97706]/5",
  low: "border-[#6f4e37] bg-[#6f4e37]/5",
};

export default function WeatherInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [insights, setInsights] = useState<{ summary: string; suggestions: Insight[] } | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState("");

  const fetchWeatherInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/weather-insights");
      if (!response.ok) throw new Error("Failed to fetch weather insights");
      
      const data = await response.json();
      setForecast(data.forecast);
      setInsights(data.insights);
      setAiSuggestions(data.aiSuggestions);
    } catch (error) {
      console.error("Weather fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherInsights();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weather Insights</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered inventory and marketing suggestions based on weather forecasts
          </p>
        </div>
        <Button onClick={fetchWeatherInsights} disabled={loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Refresh Forecast
            </>
          )}
        </Button>
      </div>

      {/* Weather Forecast Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3">7-Day Forecast</h2>
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
          {forecast.map((day, i) => {
            const Icon = weatherIcons[day.weather] || Cloud;
            const date = new Date(day.date);
            const dayName = i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });
            
            return (
              <Card key={day.date}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium mb-2">{dayName}</p>
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{day.temp}°C</p>
                  <p className="text-xs text-muted-foreground capitalize mt-1">{day.description}</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Droplets className="h-3 w-3" />
                    {Math.round(day.rain_probability)}%
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Insights Summary */}
      {insights && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Weather Analysis</CardTitle>
            <CardDescription>{insights.summary}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Weather-Based Suggestions */}
      {insights?.suggestions && insights.suggestions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Inventory & Marketing Suggestions</h2>
          <div className="space-y-4">
            {insights.suggestions.map((suggestion, i) => (
              <Card key={i} className={`border-l-4 ${priorityStyles[suggestion.priority as keyof typeof priorityStyles]}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      {suggestion.type === "hot" && <Sun className="h-5 w-5 text-[#d97706]" />}
                      {suggestion.type === "rain" && <CloudRain className="h-5 w-5 text-[#3b82f6]" />}
                      {suggestion.type === "cold" && <Thermometer className="h-5 w-5 text-[#6366f1]" />}
                      {suggestion.type === "pleasant" && <Cloud className="h-5 w-5 text-[#16a34a]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{suggestion.title}</h3>
                        <Badge variant={suggestion.priority === "high" ? "destructive" : "secondary"} className="text-[11px]">
                          {suggestion.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Recommended Actions:</p>
                        <ul className="space-y-1">
                          {suggestion.actions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* AI-Enhanced Suggestions */}
      {aiSuggestions && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>AI-Powered Recommendations</CardTitle>
            </div>
            <CardDescription>Detailed suggestions based on weather patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">{aiSuggestions}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
