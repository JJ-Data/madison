"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { historyStorage, InventoryTransaction } from "@/lib/storage";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LabelList } from 'recharts';
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChartData {
    name: string;
    usage: number;
}

interface TopItem {
    name: string;
    usage: number;
    unit: string;
}

export default function AnalyticsPage() {
    const [mounted, setMounted] = useState(false);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [topItems, setTopItems] = useState<TopItem[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<InventoryTransaction[]>([]);
    const [history, setHistory] = useState<InventoryTransaction[]>([]);

    // Daily Overview State
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [dailyStats, setDailyStats] = useState<{ totalUsage: number; itemsUsed: number; restockCount: number }>({
        totalUsage: 0, itemsUsed: 0, restockCount: 0
    });

    useEffect(() => {
        setMounted(true);
        const data = historyStorage.getAll();
        setHistory(data);

        // 1. Process Chart Data (Last 7 Days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const dailyUsage = last7Days.map(date => {
            const dayUsage = data
                .filter(h => h.type === 'usage' && h.date.startsWith(date))
                .reduce((acc, curr) => acc + curr.amount, 0);

            return {
                name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                usage: dayUsage
            };
        });
        setChartData(dailyUsage);

        // 2. Process Top Items
        const usageMap = new Map<string, { amount: number, unit: string }>();
        data.filter(h => h.type === 'usage').forEach(h => {
            const current = usageMap.get(h.itemName) || { amount: 0, unit: 'units' };
            usageMap.set(h.itemName, { amount: current.amount + h.amount, unit: 'units' });
        });

        const sortedTop = Array.from(usageMap.entries())
            .map(([name, data]) => ({ name, usage: data.amount, unit: data.unit }))
            .sort((a, b) => b.usage - a.usage)
            .slice(0, 5);
        setTopItems(sortedTop);

        // 3. Recent Transactions
        setRecentTransactions(data.slice(0, 10));

    }, []);

    // Filter transactions for the selected date
    const selectedDateTransactions = history.filter(h => h.date.startsWith(selectedDate));

    // Calculate daily stats when date changes
    useEffect(() => {
        const usage = selectedDateTransactions.filter(t => t.type === 'usage').reduce((acc, curr) => acc + curr.amount, 0);
        const restock = selectedDateTransactions.filter(t => t.type === 'restock').reduce((acc, curr) => acc + curr.amount, 0);
        const uniqueItems = new Set(selectedDateTransactions.filter(t => t.type === 'usage').map(t => t.itemName)).size;

        setDailyStats({
            totalUsage: usage,
            itemsUsed: uniqueItems,
            restockCount: restock
        });
    }, [selectedDate, history]);

    const changeDate = (days: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    if (!mounted) return <div className="p-8 text-muted-foreground">Loading analytics...</div>;

    return (
        <div className="flex flex-col gap-6 p-6 md:p-8 max-w-[1600px] mx-auto w-full text-foreground">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-heading">Analytics</h1>
                <p className="text-muted-foreground">Insights into stock consumption and trends.</p>
            </div>

            {/* Daily Overview Section */}
            <Card className="border-border bg-card shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className="text-xl">Daily Overview</CardTitle>
                        <CardDescription>Detailed breakdown for {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border">
                        <Button variant="ghost" size="icon" onClick={() => changeDate(-1)} className="h-8 w-8 hover:bg-background hover:text-foreground">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2 px-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium tabular-nums">
                                {selectedDate}
                            </span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => changeDate(1)} disabled={selectedDate >= new Date().toISOString().split('T')[0]} className="h-8 w-8 hover:bg-background hover:text-foreground">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex flex-col items-center justify-center text-center">
                            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Usage</span>
                            <span className="text-3xl font-bold text-primary mt-1">{dailyStats.totalUsage}</span>
                        </div>
                        <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/10 flex flex-col items-center justify-center text-center">
                            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Unique Items</span>
                            <span className="text-3xl font-bold text-orange-500 mt-1">{dailyStats.itemsUsed}</span>
                        </div>
                        <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/10 flex flex-col items-center justify-center text-center">
                            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Restocked</span>
                            <span className="text-3xl font-bold text-green-500 mt-1">{dailyStats.restockCount}</span>
                        </div>
                    </div>

                    <div className="relative overflow-x-auto rounded-md border border-border">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3">Time</th>
                                    <th className="px-6 py-3">Item</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                    <th className="px-6 py-3 text-right">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {selectedDateTransactions.length > 0 ? (
                                    selectedDateTransactions.map((t) => (
                                        <tr key={t.id} className="bg-card hover:bg-muted/50">
                                            <td className="px-6 py-4 font-medium text-muted-foreground whitespace-nowrap">
                                                {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                {t.itemName}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold font-heading text-foreground">
                                                {t.amount}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={cn(
                                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                    t.type === 'restock'
                                                        ? "bg-green-500/10 text-green-500"
                                                        : "bg-red-500/10 text-red-500"
                                                )}>
                                                    {t.type === 'restock' ? 'Restock' : 'Usage'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                            No activity recorded for this date.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-2 border-border bg-card">
                    <CardHeader>
                        <CardTitle>Weekly Usage Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full relative">
                            {!chartData.some(d => d.usage > 0) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] z-10">
                                    <div className="text-center">
                                        <p className="text-muted-foreground font-medium">No usage data for this week</p>
                                        <p className="text-xs text-muted-foreground/70">Start using items to see analytics</p>
                                    </div>
                                </div>
                            )}
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                                        itemStyle={{ color: 'var(--color-chart-stroke)' }}
                                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
                                    />
                                    <Bar
                                        dataKey="usage"
                                        fill="var(--color-chart-stroke)"
                                        radius={[4, 4, 0, 0]}
                                        fillOpacity={1}
                                    >
                                        <LabelList dataKey="usage" position="top" className="fill-foreground text-xs font-bold" formatter={(value: any) => value > 0 ? value : ''} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle>Top Consumed Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topItems.length > 0 ? (
                                topItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                                        <span className="font-medium text-foreground">{item.name}</span>
                                        <span className="font-bold text-primary">{item.usage}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground text-center py-4">No usage data recorded yet.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/50 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{t.itemName}</span>
                                            <span className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className={`font-bold ${t.type === 'restock' ? 'text-green-500' : 'text-primary'}`}>
                                            {t.type === 'restock' ? '+' : '-'}{t.amount}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground text-center py-4">No transactions yet.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
