"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEMO_CAFE_ID } from "@/lib/types";

export default function AIPromotionPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setGenerated(null);

    try {
      const response = await fetch("/api/ai/generate-promotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          context: "Cafe Sunshine - A cozy neighborhood cafe serving handcrafted beverages and fresh snacks. Customer base: 50+ regulars, average order ₹265.",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate promotion");
      }

      const data = await response.json();
      setGenerated(data.promotion);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generated) return;

    setLoading(true);
    const supabase = createClient();

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (generated.duration_days || 7));

    const { error: saveError } = await supabase.from("promotions").insert({
      cafe_id: DEMO_CAFE_ID,
      title: generated.title,
      description: generated.description,
      discount_percent: generated.discount_percent,
      target_segment: generated.target_segment,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      is_active: true,
      total_targeted: 0,
      total_redeemed: 0,
    });

    setLoading(false);

    if (saveError) {
      setError("Failed to save promotion");
    } else {
      router.push("/dashboard/promotions");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Promotion Generator</h1>
        <p className="text-muted-foreground mt-1">
          Describe what kind of promotion you want, and AI will create it for you
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Describe Your Promotion
          </CardTitle>
          <CardDescription>
            Example: "Weekend special for regular customers" or "Discount for inactive customers to bring them back"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">What kind of promotion do you want?</Label>
            <Input
              id="prompt"
              placeholder="E.g., 'Buy 2 get 1 free on pastries for weekend shoppers'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Promotion
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Result */}
      {generated && (
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Promotion</span>
              <Button onClick={handleSave} disabled={loading} className="gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Save & Create
              </Button>
            </CardTitle>
            <CardDescription>Review and save to your promotions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Title</Label>
              <p className="text-lg font-semibold">{generated.title}</p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Description</Label>
              <p className="text-sm">{generated.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Target Audience</Label>
                <p className="text-sm font-medium capitalize">{generated.target_segment}</p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Discount</Label>
                <p className="text-sm font-medium">
                  {generated.discount_percent ? `${generated.discount_percent}% off` : "Special offer"}
                </p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Duration</Label>
                <p className="text-sm font-medium">{generated.duration_days} days</p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Expires</Label>
                <p className="text-sm font-medium">
                  {new Date(Date.now() + (generated.duration_days || 7) * 86400000).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Example Prompts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Example Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              "Weekend discount for high-value customers",
              "Bring back customers who haven't ordered in 2 weeks",
              "Reward loyal customers who have 5+ orders",
              "Happy hour promotion for cold drinks",
              "Buy 2 get 1 free on all pastries",
            ].map((example) => (
              <button
                key={example}
                onClick={() => setPrompt(example)}
                className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2 text-left text-sm transition-colors hover:bg-secondary"
              >
                {example}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
