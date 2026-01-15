"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, BarChart3, Settings, LogOut, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const pathname = usePathname();

    if (pathname === "/login") return null;

    const links = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/inventory", label: "Inventory", icon: Package },
        { href: "/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="hidden fixed left-0 top-0 h-screen w-72 flex-col border-r border-border bg-card text-card-foreground md:flex shadow-xl z-50">
            {/* Logo Section */}
            <div className="flex h-32 flex-col items-center justify-center border-b border-border px-8">
                <div className="relative h-24 w-full">
                    {/* Add dark/light logic for logo if needed, or assume logo works on both */}
                    <Image
                        src="/madison-logo.png"
                        alt="Madison Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-8 px-4">
                <nav className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "group relative flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full" />
                                )}
                                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                <span className="tracking-wide">{link.label}</span>

                                {/* Glow effect on active - Subtle in both modes */}
                                {isActive && (
                                    <div className="absolute inset-0 -z-10 bg-primary/5 rounded-lg blur-xl" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="p-6 border-t border-border">
                <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-muted">
                    <LogOut className="h-5 w-5" />
                    <span className="tracking-wide">Sign Out</span>
                </button>
            </div>
        </div>
    );
}
