"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, DollarSign, Plus, AlertTriangle, BarChart3, ArrowRight, Flame } from "lucide-react";
import { inventoryStorage } from "@/lib/storage";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

  if (!mounted) return <div className="flex items-center justify-center h-screen"><div className="text-muted-foreground">Loading...</div></div>;

  // Mock data for the chart
  const chartData = [
    { name: 'Mon', value: 45000, orders: 12 },
    { name: 'Tue', value: 52000, orders: 15 },
    { name: 'Wed', value: 38000, orders: 10 },
    { name: 'Thu', value: 61000, orders: 18 },
    { name: 'Fri', value: 75000, orders: 22 },
    { name: 'Sat', value: 88000, orders: 28 },
    { name: 'Sun', value: 92000, orders: 31 },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 md:p-12 max-w-[1600px] mx-auto w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Welcome back, here's what's happening today</p>
        </div>
        <Link href="/inventory">
          <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all bg-primary hover:bg-primary/90 group">
            <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            Add Stock
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="group relative overflow-hidden bg-card border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Inventory</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-heading text-foreground mb-1">{stats.totalItems}</div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Active items
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-card border-border">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            stats.lowStock > 0 && "from-red-500/5"
          )} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Low Stock</CardTitle>
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              stats.lowStock > 0 ? "bg-primary/10" : "bg-green-500/10"
            )}>
              {stats.lowStock > 0 ? (
                <AlertTriangle className="h-5 w-5 text-primary animate-pulse" />
              ) : (
                <Package className="h-5 w-5 text-green-500" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-4xl font-bold font-heading mb-1",
              stats.lowStock > 0 ? "text-primary" : "text-foreground"
            )}>
              {stats.lowStock}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.lowStock > 0 ? "Items need restocking" : "All items in stock"}
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-card border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Value</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-heading text-foreground mb-1">
              ₦{(stats.totalValue / 1000).toFixed(1)}K
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              Inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2 relative overflow-hidden bg-card border-border">
          <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">Weekly Revenue</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Last 7 days performance</p>
              </div>
              <Flame className="h-6 w-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-gradient-start)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-chart-gradient-end)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} strokeOpacity={0.5} />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    itemStyle={{ color: 'var(--color-chart-stroke)' }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-chart-stroke)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="relative overflow-hidden bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Most used features</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/inventory" className="block group">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 hover:bg-muted transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">Manage Stock</div>
                    <div className="text-xs text-muted-foreground">{stats.totalItems} items</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link href="/analytics" className="block group">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 hover:bg-muted transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">View Analytics</div>
                    <div className="text-xs text-muted-foreground">Detailed reports</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mt-4">
              <div className="flex items-start gap-3">
                <Flame className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-foreground text-sm mb-1">Madison Tip</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {stats.lowStock > 0
                      ? `You have ${stats.lowStock} ${stats.lowStock === 1 ? 'item' : 'items'} running low. Consider restocking soon!`
                      : "All items are well-stocked. Great inventory management!"
                    }
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
