import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Users,
  UserCheck,
  UserPlus,
  IndianRupee,
  Mail,
  Coffee,
  Star,
  CalendarDays,
} from "lucide-react";

const summaryStats = [
  {
    title: "Total Customers",
    value: "234",
    icon: Users,
  },
  {
    title: "Active This Month",
    value: "89",
    icon: UserCheck,
  },
  {
    title: "New This Week",
    value: "12",
    icon: UserPlus,
  },
  {
    title: "Average Spend",
    value: "₹285",
    icon: IndianRupee,
  },
];

const customers = [
  {
    name: "Rahul Sharma",
    email: "rahul@email.com",
    visits: 45,
    totalSpent: "₹12,600",
    favorite: "Cappuccino",
    loyalty: "5/6",
    lastVisit: "2 days ago",
    segment: "Regular" as const,
  },
  {
    name: "Priya Patel",
    email: "priya@email.com",
    visits: 32,
    totalSpent: "₹9,800",
    favorite: "Latte",
    loyalty: "2/6",
    lastVisit: "5 days ago",
    segment: "Regular" as const,
  },
  {
    name: "Amit Kumar",
    email: "amit@email.com",
    visits: 8,
    totalSpent: "₹2,100",
    favorite: "Espresso",
    loyalty: "2/6",
    lastVisit: "12 days ago",
    segment: "Inactive" as const,
  },
  {
    name: "Sneha Reddy",
    email: "sneha@email.com",
    visits: 67,
    totalSpent: "₹28,400",
    favorite: "Mocha",
    loyalty: "6/6",
    lastVisit: "1 day ago",
    segment: "High Value" as const,
  },
  {
    name: "Vikram Singh",
    email: "vikram@email.com",
    visits: 3,
    totalSpent: "₹540",
    favorite: "Cold Brew",
    loyalty: "3/6",
    lastVisit: "8 days ago",
    segment: "New" as const,
  },
  {
    name: "Meera Joshi",
    email: "meera@email.com",
    visits: 28,
    totalSpent: "₹7,200",
    favorite: "Masala Chai",
    loyalty: "4/6",
    lastVisit: "3 days ago",
    segment: "Regular" as const,
  },
];

function getSegmentBadge(segment: string) {
  switch (segment) {
    case "High Value":
      return (
        <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/20 dark:text-amber-400 border">
          {segment}
        </Badge>
      );
    case "Inactive":
      return <Badge variant="destructive">{segment}</Badge>;
    case "New":
      return <Badge variant="secondary">{segment}</Badge>;
    default:
      return <Badge variant="outline">{segment}</Badge>;
  }
}

export default function CustomersPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your customer base, loyalty progress, and engagement.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer List */}
      <div className="space-y-4">
        {customers.map((customer) => (
          <Card key={customer.email}>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Name, email, segment */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <span className="text-sm font-semibold text-secondary-foreground">
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{customer.name}</p>
                      {getSegmentBadge(customer.segment)}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </div>
                  </div>
                </div>

                {/* Right: Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      <span className="font-medium">{customer.visits}</span>{" "}
                      <span className="text-muted-foreground">visits</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{customer.totalSpent}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Coffee className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {customer.favorite}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-muted-foreground" />
                    <Badge
                      variant={
                        customer.loyalty === "6/6" ? "default" : "secondary"
                      }
                      className={cn(
                        customer.loyalty === "6/6" &&
                          "bg-emerald-500/15 text-emerald-700 border-emerald-500/20 dark:text-emerald-400"
                      )}
                    >
                      {customer.loyalty}
                      {customer.loyalty === "6/6" && " (reward ready!)"}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground">
                    Last visit: {customer.lastVisit}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
