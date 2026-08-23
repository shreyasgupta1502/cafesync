import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, TrendingUp, UserCheck, Target, Sparkles, BarChart3, Megaphone } from "lucide-react";

const insights = [
  {
    title: "At-Risk Customers",
    description: "17 customers haven't visited in 10+ days. 5 of them are within one purchase of a loyalty reward.",
    suggestion: "Suggested: Send a loyalty reminder to the 5 nearly-rewarded customers.",
    priority: "High Priority",
    borderColor: "#dc2626",
    badgeStyle: "border-[#dc2626]/20 bg-[#dc2626]/10 text-[#dc2626]",
    icon: AlertTriangle,
  },
  {
    title: "Revenue Opportunity",
    description: "Your weekend revenue is 35% lower than weekdays. Consider a weekend promotion targeting regular weekday customers.",
    suggestion: "Suggested: Launch a weekend special campaign.",
    priority: "Medium Priority",
    borderColor: "#d97706",
    badgeStyle: "border-[#d97706]/20 bg-[#d97706]/10 text-[#d97706]",
    icon: TrendingUp,
  },
  {
    title: "Top Customer Alert",
    description: "Sneha Reddy has a reward ready to redeem. She normally visits daily but hasn't been in 2 days.",
    suggestion: "Suggested: Send a personalized reward reminder.",
    priority: "Action Needed",
    borderColor: "#6f4e37",
    badgeStyle: "border-primary/20 bg-primary/10 text-primary",
    icon: UserCheck,
  },
];

const capabilities = [
  { title: "Customer Segmentation", desc: "Classify customers into meaningful groups automatically", icon: Target },
  { title: "Promotion Generation", desc: "Generate targeted campaigns from natural language", icon: Sparkles },
  { title: "Behavior Analysis", desc: "Identify purchase patterns and predict churn", icon: BarChart3 },
  { title: "Campaign Automation", desc: "Run engagement campaigns with human approval", icon: Megaphone },
];

export default function AIInsightsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground mt-1">AI-powered analysis of your customer data</p>
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
                Analyzes customer behavior, identifies at-risk customers, and recommends
                targeted campaigns. The agent reviews purchase history, loyalty progress,
                and visit patterns to generate actionable insights.
              </p>
              <Button variant="secondary" size="lg" className="gap-2 font-semibold">
                <Sparkles className="h-4 w-4" />
                Run Analysis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Insights */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Insights</h2>
        <div className="space-y-4">
          {insights.map((insight) => (
            <Card
              key={insight.title}
              className="transition-all hover:shadow-md"
              style={{ borderLeft: `4px solid ${insight.borderColor}` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${insight.borderColor}15` }}
                  >
                    <insight.icon className="h-5 w-5" style={{ color: insight.borderColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{insight.title}</h3>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${insight.badgeStyle}`}>
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {insight.description}
                    </p>
                    <p className="text-sm italic text-primary/70">
                      {insight.suggestion}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Capabilities */}
      <div>
        <h2 className="text-xl font-semibold mb-4">AI Capabilities</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap) => (
            <Card key={cap.title} className="transition-all hover:shadow-md hover:-translate-y-0.5">
              <CardContent className="p-5 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <cap.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{cap.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
