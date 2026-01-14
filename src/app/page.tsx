"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, TrendingDown, ArrowUpRight, Plus, AlertCircle } from "lucide-react";
import { inventoryStorage } from "@/lib/storage";
import { useEffect, useState } from "react";
import Link from "next/link"; // Corrected import
import { cn } from "@/lib/utils";

export default function Home() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    totalValue: 0
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const items = inventoryStorage.getAll();
    const lowStockItems = items.filter(i => i.quantity <= i.minStock);
    const totalVal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    setStats({
      totalItems: items.length,
      lowStock: lowStockItems.length,
      totalValue: totalVal
    });
  }, []);

  if (!mounted) return <div className="p-8 text-muted-foreground">Loading dashboard...</div>;

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, here is your daily overview.</p>
        </div>
        <Link href="/inventory">
          <Button size="lg" className="shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Add Stock
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/50 transition-all hover:bg-card hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Unique items tracked</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 transition-all hover:bg-card hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            {stats.lowStock > 0 ? (
              <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
            ) : (
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", stats.lowStock > 0 ? "text-destructive" : "")}>
              {stats.lowStock}
            </div>
            <p className="text-xs text-muted-foreground">Items below minimum level</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 transition-all hover:bg-card hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated stock value</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Visual Placeholder for now */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Usage Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed text-muted-foreground bg-background/50">
              Chart Placeholder (Recharts to be installed)
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" className="w-full justify-start h-12">
              Create Purchase Order
            </Button>
            <Button variant="outline" className="w-full justify-start h-12">
              Audit Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
