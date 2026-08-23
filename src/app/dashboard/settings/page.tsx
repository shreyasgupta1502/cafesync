import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Award,
  Bell,
  MessageSquare,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your cafe profile, loyalty program, and notification
          preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cafe Profile */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Store className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle>Cafe Profile</CardTitle>
                <CardDescription>
                  Your cafe&apos;s basic information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                <Store className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Cafe Name</p>
                  <p className="font-medium">Cafe Sunshine</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">owner@cafesunshine.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">MG Road, Bangalore</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Program */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Award className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle>Loyalty Program</CardTitle>
                <CardDescription>
                  Current loyalty program configuration
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">Purchase Count</p>
                </div>
                <Badge variant="outline">Points-based</Badge>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Target</p>
                <p className="font-medium">Buy 6 get 1 free</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">Active</p>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 border">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Bell className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive updates
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <span className="text-sm font-medium">
                  Order Confirmations
                </span>
                <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 border">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <span className="text-sm font-medium">Loyalty Updates</span>
                <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 border">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <span className="text-sm font-medium">
                  Promotional Messages
                </span>
                <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 border">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    WhatsApp Integration
                  </span>
                </div>
                <Badge variant="secondary">
                  <Clock className="h-3 w-3" />
                  Coming Soon
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
