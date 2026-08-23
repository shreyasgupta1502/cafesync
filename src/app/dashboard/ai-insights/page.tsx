import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const insights = [
  {
    title: "At-Risk Customers",
    description:
      "17 customers haven't visited in 10+ days. 5 of them are within one purchase of a loyalty reward.",
    priority: "High Priority" as const,
    icon: AlertTriangle,
  },
  {
    title: "Revenue Opportunity",
    description:
      "Your weekend revenue is 35% lower than weekdays. Consider a weekend promotion targeting regular weekday customers.",
    priority: "Medium Priority" as const,
    icon: TrendingUp,
  },
  {
    title: "Top Customer Alert",
    description:
      "Sneha Reddy has a reward ready to redeem. She normally visits daily but hasn't been in 2 days.",
    priority: "Action Needed" as const,
    icon: UserCheck,
  },
];

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "High Priority":
      return <Badge variant="destructive">{priority}</Badge>;
    case "Action Needed":
      return (
        <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/20 dark:text-amber-400 border">
          {priority}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
}

export default function AIInsightsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered analysis of your customer data
        </p>
      </div>

      {/* Agent Card */}
      <Card className="border-primary/20 bg-primary/[0.02]">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">
                  Customer Engagement Agent
                </CardTitle>
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <CardDescription className="mt-1">
                Analyzes customer behavior, identifies at-risk customers, and
                recommends targeted campaigns.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button>
            <Brain className="h-4 w-4" />
            Run Analysis
          </Button>
        </CardContent>
      </Card>

      {/* Recent Insights */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Recent Insights
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {insights.map((insight) => (
            <Card key={insight.title}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      insight.priority === "High Priority"
                        ? "bg-destructive/10"
                        : insight.priority === "Action Needed"
                          ? "bg-amber-500/10"
                          : "bg-secondary"
                    )}
                  >
                    <insight.icon
                      className={cn(
                        "h-5 w-5",
                        insight.priority === "High Priority"
                          ? "text-destructive"
                          : insight.priority === "Action Needed"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-secondary-foreground"
                      )}
                    />
                  </div>
                  {getPriorityBadge(insight.priority)}
                </div>
                <CardTitle className="mt-2">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
