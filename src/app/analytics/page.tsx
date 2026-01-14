"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inventoryStorage } from "@/lib/storage";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
    name: string;
    usage: number;
}

export default function AnalyticsPage() {
    const [mounted, setMounted] = useState(false);
    const [data, setData] = useState<DataPoint[]>([]);

    useEffect(() => {
        setMounted(true);
        // Mocking historical data for demonstration since we just started
        const mockHistory: DataPoint[] = [
            { name: 'Mon', usage: 12 },
            { name: 'Tue', usage: 19 },
            { name: 'Wed', usage: 15 },
            { name: 'Thu', usage: 22 },
            { name: 'Fri', usage: 30 },
            { name: 'Sat', usage: 45 },
            { name: 'Sun', usage: 38 },
        ];
        setData(mockHistory);
    }, []);

    if (!mounted) return <div className="p-8">Loading analytics...</div>;

    return (
        <div className="flex flex-col gap-6 p-6 md:p-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Insights into stock consumption and trends.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-2 border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle>Weekly Usage Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={data}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="usage"
                                        stroke="#e11d48" // Primary Red
                                        strokeWidth={2}
                                        dot={{ fill: "#e11d48" }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle>Top Consumed Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Mock Data List */}
                            <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                <span className="font-medium">Thyme</span>
                                <span className="font-bold">45 jars</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                <span className="font-medium">Chicken Breast</span>
                                <span className="font-bold">120 kg</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                <span className="font-medium">Basmati Rice</span>
                                <span className="font-bold">15 bags</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle>Cost Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Total Spent (This Week)</span>
                                <span className="text-xl font-bold">₦250,000</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[75%]" />
                            </div>
                            <p className="text-xs text-muted-foreground">You have used 75% of your weekly budget.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
