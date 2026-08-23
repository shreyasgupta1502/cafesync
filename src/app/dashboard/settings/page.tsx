import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Coffee, Bell, Shield } from "lucide-react";

const profileFields = [
  { label: "Cafe Name", value: "Cafe Sunshine" },
  { label: "Email", value: "owner@cafesunshine.com" },
  { label: "Phone", value: "+91 98765 43210" },
  { label: "Address", value: "MG Road, Bangalore" },
];

const notifications = [
  { label: "Order Confirmations", status: "Enabled" },
  { label: "Loyalty Updates", status: "Enabled" },
  { label: "Promotional Messages", status: "Enabled" },
  { label: "WhatsApp Integration", status: "Coming Soon" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your cafe profile and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cafe Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Cafe Profile</CardTitle>
                <CardDescription>Your business information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {profileFields.map((field) => (
                <div key={field.label} className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{field.label}</Label>
                  <div className="rounded-lg bg-secondary px-3 py-2 text-sm font-medium">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Program */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4a76a]/15">
                <Coffee className="h-5 w-5 text-[#d4a76a]" />
              </div>
              <div>
                <CardTitle>Loyalty Program</CardTitle>
                <CardDescription>Current reward configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Visual Cups */}
            <div className="text-center">
              <p className="text-lg font-bold mb-3">Buy 6, Get 1 Free</p>
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl"
                  >
                    ☕
                  </div>
                ))}
                <span className="mx-1 text-lg font-bold text-muted-foreground">=</span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#16a34a]/10 text-xl ring-2 ring-[#16a34a]/30">
                  🎉
                </div>
              </div>
            </div>

            {/* Config Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <div className="rounded-lg bg-secondary px-3 py-2 text-sm font-medium">
                  Purchase Count
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="rounded-lg bg-[#16a34a]/10 px-3 py-2 text-sm font-medium text-[#16a34a]">
                  Active
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d97706]/10">
              <Bell className="h-5 w-5 text-[#d97706]" />
            </div>
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when notifications are sent</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {notifications.map((n) => {
              const isEnabled = n.status === "Enabled";
              const isComingSoon = n.status === "Coming Soon";
              return (
                <div
                  key={n.label}
                  className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-secondary/50 transition-colors"
                >
                  <span className="text-sm font-medium">{n.label}</span>
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                      isEnabled
                        ? "border-[#16a34a]/20 bg-[#16a34a]/10 text-[#16a34a]"
                        : isComingSoon
                        ? "border-[#d97706]/20 bg-[#d97706]/10 text-[#d97706]"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {n.status}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
