import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerNav } from "@/components/customer-nav";
import { Award, Gift, Star } from "lucide-react";

const loyaltyConfig = {
  programName: "Coffee Rewards",
  target: 6,
  current: 5,
  totalRewardsEarned: 3,
  reward: "Free coffee of your choice",
};

const rewardHistory = [
  { date: "Aug 10, 2026", reward: "Free Cappuccino", status: "Redeemed" },
  { date: "Jul 22, 2026", reward: "Free Latte", status: "Redeemed" },
  { date: "Jul 5, 2026", reward: "Free Cold Brew", status: "Redeemed" },
];

const milestoneMessages: Record<number, string> = {
  1: "Great start! Your journey to free coffee has begun.",
  2: "Keep it up! You're making progress.",
  3: "You're halfway there! Just 3 more to go.",
  4: "Getting closer! Only 2 more coffees.",
  5: "Almost there! Just 1 more coffee until your free drink!",
  6: "Your next coffee is FREE! Claim your reward on your next visit.",
};

export default function LoyaltyPage() {
  const { current, target, reward } = loyaltyConfig;
  const message = milestoneMessages[current] || "";
  const isRewardReady = current >= target;

  return (
    <div className="min-h-screen bg-background">
      <CustomerNav />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Loyalty Rewards</h1>
          <p className="text-muted-foreground mt-1">Track your progress and earn free drinks</p>
        </div>

        {/* Progress Card */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0">
            {/* Top banner */}
            <div className="bg-primary px-6 py-5 text-primary-foreground">
              <div className="flex items-center gap-3 mb-1">
                <Award className="h-6 w-6" />
                <h2 className="text-xl font-bold">{loyaltyConfig.programName}</h2>
              </div>
              <p className="text-primary-foreground/80 text-sm">
                Buy {target} coffees, get your next one free!
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Cup Progress */}
              <div className="flex items-center justify-center gap-3">
                {Array.from({ length: target }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-all ${
                        i < current
                          ? "bg-primary/15 ring-2 ring-primary/30 scale-100"
                          : "bg-secondary scale-95 opacity-50"
                      }`}
                    >
                      ☕
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      #{i + 1}
                    </span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-1.5 ml-2">
                  <span className="text-lg font-bold text-muted-foreground">=</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${
                      isRewardReady
                        ? "bg-[#16a34a]/15 ring-2 ring-[#16a34a]/30 animate-pulse"
                        : "bg-secondary opacity-50 scale-95"
                    }`}
                  >
                    🎉
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">FREE</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-bold text-primary">{current} / {target}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(current / target) * 100}%` }}
                  />
                </div>
              </div>

              {/* Milestone Message */}
              <div
                className={`rounded-xl px-5 py-4 text-center ${
                  isRewardReady
                    ? "bg-[#16a34a]/10 border border-[#16a34a]/20"
                    : "bg-secondary"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    isRewardReady ? "text-[#16a34a]" : "text-foreground"
                  }`}
                >
                  {message}
                </p>
                {!isRewardReady && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Reward: {reward}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="mx-auto h-6 w-6 text-[#d4a76a] mb-2" />
              <p className="text-2xl font-bold">{current}/{target}</p>
              <p className="text-xs text-muted-foreground">Current Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Gift className="mx-auto h-6 w-6 text-[#16a34a] mb-2" />
              <p className="text-2xl font-bold">{loyaltyConfig.totalRewardsEarned}</p>
              <p className="text-xs text-muted-foreground">Rewards Earned</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="mx-auto h-6 w-6 text-primary mb-2" />
              <p className="text-2xl font-bold">{target - current}</p>
              <p className="text-xs text-muted-foreground">Until Next Reward</p>
            </CardContent>
          </Card>
        </div>

        {/* Reward History */}
        <Card>
          <CardHeader>
            <CardTitle>Reward History</CardTitle>
            <CardDescription>Your previously earned rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rewardHistory.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-4 py-3 bg-secondary/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16a34a]/10">
                      <Gift className="h-4 w-4 text-[#16a34a]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.reward}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-[#16a34a]/20 bg-[#16a34a]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#16a34a]">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
