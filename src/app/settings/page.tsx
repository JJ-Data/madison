"use client"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Laptop, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inventoryStorage } from "@/lib/storage";

export default function SettingsPage() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleReset = () => {
        if (confirm("Are you sure? This will delete all inventory data permanently.")) {
            // Logic to clear storage would go here, technically we need to expose a clear method or just clear localStorage
            localStorage.removeItem('inventory');
            localStorage.removeItem('inventory_history');
            window.location.reload();
        }
    }

    if (!mounted) return null;

    return (
        <div className="flex flex-col gap-8 p-8 md:p-12 max-w-[1600px] mx-auto w-full min-h-screen text-foreground">
            <div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">Settings</h1>
                <p className="text-muted-foreground text-lg">Manage your application preferences and data.</p>
            </div>

            <div className="grid gap-8 max-w-2xl">
                {/* Appearance Section */}
                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize how the app looks on your device</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <Button
                                variant="outline"
                                className={`flex flex-col gap-3 h-28 items-center justify-center border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setTheme('light')}
                            >
                                <Sun className="h-6 w-6" />
                                <span className="font-medium">Light</span>
                            </Button>
                            <Button
                                variant="outline"
                                className={`flex flex-col gap-3 h-28 items-center justify-center border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setTheme('dark')}
                            >
                                <Moon className="h-6 w-6" />
                                <span className="font-medium">Dark</span>
                            </Button>
                            <Button
                                variant="outline"
                                className={`flex flex-col gap-3 h-28 items-center justify-center border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setTheme('system')}
                            >
                                <Laptop className="h-6 w-6" />
                                <span className="font-medium">System</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Section */}
                <Card className="border-destructive/30 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription className="text-destructive/70">Irreversible actions regarding your data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="font-medium text-destructive">Reset Inventory Data</div>
                                <div className="text-sm text-destructive/60">Permanently delete all items and history</div>
                            </div>
                            <Button variant="destructive" onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Reset Data
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
