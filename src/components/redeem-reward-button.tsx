"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Gift, Loader2 } from "lucide-react";

export function RedeemRewardButton({ 
  userId,
  isRewardReady 
}: { 
  userId: string;
  isRewardReady: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRedeem = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/redeem-reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to redeem reward");
      }

      const data = await response.json();
      alert(data.message);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isRewardReady) return null;

  return (
    <div className="mt-4">
      <Button
        onClick={handleRedeem}
        disabled={loading}
        size="lg"
        className="w-full gap-2 bg-[#16a34a] hover:bg-[#16a34a]/90"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Redeeming...
          </>
        ) : (
          <>
            <Gift className="h-5 w-5" />
            Claim Your Free Reward!
          </>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground mt-2">
        Show this confirmation to the cafe staff
      </p>
    </div>
  );
}
