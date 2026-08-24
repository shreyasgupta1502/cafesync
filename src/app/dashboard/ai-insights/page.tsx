"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2, AlertTriangle, TrendingUp, UserCheck, Target, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEMO_CAFE_ID } from "@/lib/types";

type Insight = {
  type: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  customers: string[];
  recommendation: string;
};

type Analysis = {
  insights: Insight[];
  summary: string;
};

const priorityStyles = {
  high: "border-[#dc2626] bg-[#dc2626]/5",
  medium: "border-[#d97706] bg-[#d97706]/5",
  low: "border-[#6f4e37] bg-[#6f4e37]/5",
};

const priorityBadges = {
  high: "border-[#dc2626]/20 bg-[#dc2626]/10 text-[#dc2626]",
  medium: "border-[#d97706]/20 bg-[#d97706]/10 text-[#d97706]",
  low: "border-primary/20 bg-primary/10 text-primary",
};

const typeIcons = {
  at_risk: AlertTriangle,
  high_value: TrendingUp,
  loyalty: UserCheck,
  opportunity: Target,
};

export default function AIInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [executing, setExecuting] = useState<number | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    
    try {
      const supabase = createClient();

      // Fetch customer data
      const { data: customers } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          created_at,
          orders(id, total_amount, created_at)
        `)
        .eq("cafe_id", DEMO_CAFE_ID)
        .eq("role", "customer");

      // Get loyalty progress
      const { data: loyaltyData } = await supabase
        .from("loyalty_progress")
        .select("customer_id, current_count, rewards_earned, loyalty_programs!inner(target_count)");

      // Process customer data
      const processedCustomers = customers?.map((c) => {
        const orders = c.orders || [];
        const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        const lastOrder = orders.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        
        const daysSinceLastOrder = lastOrder
          ? Math.floor((Date.now() - new Date(lastOrder.created_at).getTime()) / 86400000)
          : 999;

        const loyalty = loyaltyData?.find((l) => l.customer_id === c.id);
        
        return {
          name: c.full_name,
          email: c.email,
          totalOrders: orders.length,
          totalSpent,
          daysSinceLastOrder,
          loyaltyProgress: loyalty ? {
            current: loyalty.current_count,
            target: (loyalty.loyalty_programs as any)?.target_count ?? 6,
            rewardsEarned: loyalty.rewards_earned,
          } : null,
        };
      }) ?? [];

      // Get recent order patterns
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentOrders } = await supabase
        .from("orders")
        .select("created_at, total_amount")
        .eq("cafe_id", DEMO_CAFE_ID)
        .gte("created_at", sevenDaysAgo.toISOString());

      const orderPatterns = {
        last7Days: recentOrders?.length ?? 0,
        avgOrderValue: recentOrders?.length 
          ? recentOrders.reduce((sum, o) => sum + Number(o.total_amount), 0) / recentOrders.length 
          : 0,
      };

      // Call AI analysis
      const response = await fetch("/api/ai/analyze-customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customers: processedCustomers,
          recentOrders: orderPatterns,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze customers");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const executeCampaign = async (insight: Insight, index: number) => {
    setExecuting(index);
    
    try {
      const response = await fetch("/api/ai/execute-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          insight,
          ownerResponse: "Approved and executing campaign",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute campaign");
      }

      const data = await response.json();
      
      // Show success message
      alert(`Campaign executed! Created promotion and sent ${data.notificationsSent} notifications.`);
      
      // Remove the insight from the list since it's been executed
      if (analysis) {
        setAnalysis({
          ...analysis,
          insights: analysis.insights.filter((_, i) => i !== index),
        });
      }
    } catch (err: any) {
      alert(err.message || "Failed to execute campaign");
    } finally {
      setExecuting(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Customer Insights</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered analysis of your customer base and engagement opportunities
        </p>
      </div>

      {/* Agent Card */}
      <Card className="bg-primary text-primary-foreground border-none">
        <CardContent className="p-8">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Brain className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">Customer Engagement Agent</h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-4">
                Analyzes all {50} customers, identifies at-risk customers, high-value opportunities, 
                and generates targeted campaign recommendations based on behavior patterns.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="gap-2 font-semibold"
                onClick={runAnalysis}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Summary */}
      {analysis?.summary && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{analysis.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      {analysis?.insights && analysis.insights.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Insights & Recommendations</h2>
          <div className="space-y-4">
            {analysis.insights.map((insight, i) => {
              const Icon = typeIcons[insight.type as keyof typeof typeIcons] || Target;
              
              return (
                <Card
                  key={i}
                  className={`transition-all hover:shadow-md border-l-4 ${priorityStyles[insight.priority]}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                        style={{ 
                          backgroundColor: insight.priority === "high" ? "#dc262615" : 
                            insight.priority === "medium" ? "#d9770615" : "#6f4e3715" 
                        }}
                      >
                        <Icon className="h-5 w-5" style={{ 
                          color: insight.priority === "high" ? "#dc2626" : 
                            insight.priority === "medium" ? "#d97706" : "#6f4e37" 
                        }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge className={`text-[11px] ${priorityBadges[insight.priority]}`}>
                            {insight.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {insight.description}
                        </p>
                        
                        {insight.customers.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1">Affected Customers:</p>
                            <div className="flex flex-wrap gap-1">
                              {insight.customers.map((name, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium"
                                >
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="rounded-lg bg-secondary/50 px-3 py-2 mb-3">
                          <p className="text-xs text-muted-foreground mb-0.5">Recommended Action:</p>
                          <p className="text-sm font-medium italic">{insight.recommendation}</p>
                        </div>

                        <Button
                          onClick={() => executeCampaign(insight, i)}
                          disabled={executing === i}
                          className="w-full gap-2"
                          variant={insight.priority === "high" ? "default" : "outline"}
                        >
                          {executing === i ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Executing Campaign...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Approve & Execute Campaign
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
